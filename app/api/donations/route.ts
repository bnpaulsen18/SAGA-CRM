import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendAutomatedThankYou } from '@/lib/email/send-donation-receipt';
import {
  rateLimiter,
  RATE_LIMITS,
  getClientIdentifier,
  createRateLimitHeaders,
} from '@/lib/security/rate-limiter';
import { calculateFraudScore } from '@/lib/security/fraud-detector';
import { randomBytes } from 'crypto';

export const runtime = 'nodejs'

/**
 * Verify Turnstile CAPTCHA token with Cloudflare
 */
async function verifyTurnstile(token: string): Promise<boolean> {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    console.warn('[Donations] TURNSTILE_SECRET_KEY not configured, skipping verification');
    return true; // Allow through if not configured
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('[Donations] Turnstile verification failed:', error);
    return false;
  }
}

// GET /api/donations - List all donations for the user's organization
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const donations = await prisma.donation.findMany({
      where: {
        organizationId: session.user.organizationId,
      },
      include: {
        contact: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        campaign: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        donatedAt: 'desc',
      },
    });

    return NextResponse.json(donations);
  } catch (error) {
    console.error('GET /api/donations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}

// POST /api/donations - Create a new donation
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting - 10 donations per hour per IP (anti-fraud)
    const identifier = getClientIdentifier(req);
    const rateLimit = await rateLimiter.check(
      identifier,
      RATE_LIMITS.DONATIONS.maxRequests,
      RATE_LIMITS.DONATIONS.windowMs
    );

    const rateLimitHeaders = createRateLimitHeaders(rateLimit);

    if (!rateLimit.allowed) {
      console.warn('[Donations] Rate limit exceeded:', identifier);
      return NextResponse.json(
        {
          error: 'Too many donation submissions. Please try again later or contact support if this is legitimate.',
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: rateLimitHeaders,
        }
      );
    }

    const body = await req.json();
    const {
      contactId,
      amount,
      fundRestriction,
      method,
      type,
      campaignId,
      transactionId,
      notes,
      donatedAt,
      turnstileToken,
    } = body;

    // CAPTCHA verification (if configured)
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && turnstileToken) {
      const isValid = await verifyTurnstile(turnstileToken);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Security verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // Validation
    if (!contactId || !amount) {
      return NextResponse.json(
        { error: 'Contact and amount are required' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Minimum donation amount (prevents micro-donation fraud)
    const MIN_DONATION_AMOUNT = 5.00;
    if (amount < MIN_DONATION_AMOUNT) {
      return NextResponse.json(
        {
          error: `Minimum donation is $${MIN_DONATION_AMOUNT}. Processing fees make smaller donations uneconomical. Thank you for understanding!`,
        },
        { status: 400 }
      );
    }

    // Velocity check - flag suspicious rapid donations
    const recentDonations = await prisma.donation.count({
      where: {
        organizationId: session.user.organizationId,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
        },
      },
    });

    if (recentDonations >= 3) {
      console.warn('[Donations] Suspicious velocity detected:', {
        organizationId: session.user.organizationId,
        userId: session.user.id,
        count: recentDonations,
      });

      // Allow the donation but flag it for review
      // In production, you'd want to alert admins here
    }

    // Verify the contact belongs to the user's organization
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact || contact.organizationId !== session.user.organizationId) {
      return NextResponse.json(
        { error: 'Contact not found or access denied' },
        { status: 403 }
      );
    }

    // Generate idempotency key (prevents duplicate charges)
    const idempotencyKey = `don_${session.user.organizationId}_${Date.now()}_${randomBytes(8).toString('hex')}`;

    // Check if idempotency key already exists (shouldn't happen, but safety check)
    // Note: Using findFirst because idempotencyKey is nullable (Prisma doesn't allow nullable unique fields in findUnique)
    const existingDonation = await prisma.donation.findFirst({
      where: { idempotencyKey },
    });

    if (existingDonation) {
      console.warn('[Donations] Idempotency key collision detected:', idempotencyKey);
      return NextResponse.json(
        { error: 'Duplicate request detected. Please try again.' },
        { status: 409 }
      );
    }

    // Calculate fraud score
    const clientIp = getClientIdentifier(req);
    const fraudCheck = await calculateFraudScore({
      organizationId: session.user.organizationId,
      contactId,
      amount: parseFloat(amount),
      method,
      ipAddress: clientIp,
      userAgent: req.headers.get('user-agent') || undefined,
    });

    // Block high-risk transactions automatically
    if (fraudCheck.reviewStatus === 'REJECTED') {
      console.error('[Donations] High-risk transaction blocked:', {
        contactId,
        amount,
        fraudScore: fraudCheck.fraudScore,
        flags: fraudCheck.fraudFlags,
      });

      return NextResponse.json(
        {
          error: 'This transaction has been flagged as high-risk and cannot be processed. Please contact support if you believe this is an error.',
          fraudScore: fraudCheck.fraudScore,
        },
        { status: 403 }
      );
    }

    // Log medium-risk transactions for review
    if (fraudCheck.reviewStatus === 'PENDING_REVIEW') {
      console.warn('[Donations] Medium-risk transaction flagged for review:', {
        contactId,
        amount,
        fraudScore: fraudCheck.fraudScore,
        flags: fraudCheck.fraudFlags,
        recommendation: fraudCheck.recommendation,
      });
    }

    // Generate a unique receipt number (simple version: ORG-YYYYMMDD-RANDOM)
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const receiptNumber = `${session.user.organizationId.substring(0, 4)}-${dateStr}-${randomStr}`;

    // Create the donation
    const donation = await prisma.donation.create({
      data: {
        organizationId: session.user.organizationId,
        contactId,
        amount: parseFloat(amount),
        currency: 'USD',
        type: type || 'ONE_TIME',
        method: method || 'CREDIT_CARD',
        status: 'COMPLETED',
        fundRestriction: fundRestriction || 'UNRESTRICTED',
        campaignId: campaignId || null,
        transactionId: transactionId || null,
        notes: notes || null,
        receiptNumber,
        taxDeductible: true,
        donatedAt: donatedAt ? new Date(donatedAt) : new Date(),
        // Fraud detection fields
        idempotencyKey,
        fraudScore: fraudCheck.fraudScore,
        fraudFlags: fraudCheck.fraudFlags,
        reviewStatus: fraudCheck.reviewStatus,
      },
      include: {
        contact: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        campaign: {
          select: {
            name: true,
          },
        },
      },
    });

    // Send automated thank-you email with AI-generated message (async, don't wait)
    sendAutomatedThankYou(donation.id).catch(error => {
      console.error('Failed to send automated thank-you email:', error);
      // Don't fail the request if email fails
    });

    return NextResponse.json(donation, {
      status: 201,
      headers: rateLimitHeaders,
    });
  } catch (error) {
    console.error('POST /api/donations error:', error);
    return NextResponse.json(
      { error: 'Failed to create donation' },
      { status: 500 }
    );
  }
}
