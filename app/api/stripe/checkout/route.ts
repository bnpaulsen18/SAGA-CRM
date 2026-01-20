import { NextResponse } from 'next/server';
import { stripe, isStripeAvailable } from '@/lib/stripe/client';
import { requireAuth } from '@/lib/permissions';
import {
  rateLimiter,
  RATE_LIMITS,
  getClientIdentifier,
  createRateLimitHeaders,
} from '@/lib/security/rate-limiter';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    // Check Stripe Connect status for this organization
    const organization = await prisma.organization.findUnique({
      where: { id: session.user.organizationId! },
      select: {
        stripeConnectAccountId: true,
        stripeConnectStatus: true,
        subscriptionTier: true,
        name: true,
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Block if Free tier trying to process online donations
    if (organization.subscriptionTier === 'FREE') {
      return NextResponse.json(
        {
          error: 'Online donation processing requires Pro or Enterprise plan. Please upgrade to accept donations online.',
          upgradeUrl: '/pricing',
        },
        { status: 403 }
      );
    }

    // Block if Stripe not connected
    if (!organization.stripeConnectAccountId || organization.stripeConnectStatus !== 'CONNECTED') {
      return NextResponse.json(
        {
          error: 'Stripe account not connected. Please connect your Stripe account in Settings to accept online donations.',
          connectUrl: '/settings/integrations',
          status: organization.stripeConnectStatus,
        },
        { status: 403 }
      );
    }

    // Rate limiting - 5 checkout requests per 15 minutes per IP (anti-fraud)
    const identifier = getClientIdentifier(req);
    const rateLimit = await rateLimiter.check(
      identifier,
      RATE_LIMITS.STRIPE_CHECKOUT.maxRequests,
      RATE_LIMITS.STRIPE_CHECKOUT.windowMs
    );

    const rateLimitHeaders = createRateLimitHeaders(rateLimit);

    if (!rateLimit.allowed) {
      console.warn('[Stripe Checkout] Rate limit exceeded:', identifier);
      return NextResponse.json(
        {
          error: 'Too many checkout attempts. Please try again later or contact support if this is legitimate.',
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: rateLimitHeaders,
        }
      );
    }

    // Check if Stripe is available
    if (!stripe || !isStripeAvailable) {
      return NextResponse.json(
        {
          error: 'Stripe integration not configured. Use manual donation entry.',
          fallbackUrl: '/donations/new'
        },
        { status: 503 }
      );
    }

    const body = await req.json();

    const {
      amount,
      contactId,
      campaignId,
      fundRestriction,
      isRecurring,
      successUrl,
      cancelUrl,
    } = body;

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!contactId) {
      return NextResponse.json({ error: 'Contact required' }, { status: 400 });
    }

    // Generate idempotency key for Stripe (prevents duplicate charges)
    const idempotencyKey = `stripe_checkout_${session.user.organizationId}_${Date.now()}_${randomBytes(8).toString('hex')}`;

    // Calculate 2% platform application fee
    const amountInCents = Math.round(amount * 100);
    const applicationFeeAmount = Math.round(amountInCents * 0.02); // 2% platform fee

    // Create Stripe Checkout Session with Connect and application fee
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: isRecurring ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: isRecurring
            ? {
                currency: 'usd',
                product_data: {
                  name: 'Monthly Donation',
                  description: `Recurring donation to ${organization.name}`,
                },
                unit_amount: amountInCents,
                recurring: {
                  interval: 'month',
                },
              }
            : {
                currency: 'usd',
                product_data: {
                  name: 'Donation',
                  description: `One-time donation to ${organization.name}`,
                },
                unit_amount: amountInCents,
              },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount, // Platform takes 2%
        on_behalf_of: organization.stripeConnectAccountId, // Connected account
        transfer_data: {
          destination: organization.stripeConnectAccountId, // 98% goes to nonprofit
        },
        metadata: {
          organizationId: session.user.organizationId || '',
          contactId,
          campaignId: campaignId || '',
          fundRestriction: fundRestriction || 'UNRESTRICTED',
          isRecurring: isRecurring ? 'true' : 'false',
          idempotencyKey,
          method: 'CREDIT_CARD',
          platformFeePercent: '2',
          platformFeeAmount: (applicationFeeAmount / 100).toFixed(2),
        },
      },
      metadata: {
        organizationId: session.user.organizationId || '',
        contactId,
        campaignId: campaignId || '',
        connectedAccountId: organization.stripeConnectAccountId,
      },
      success_url: successUrl || `${process.env.NEXTAUTH_URL}/donations?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/donations?canceled=true`,
      customer_email: body.email,
    }, {
      stripeAccount: organization.stripeConnectAccountId, // Make request on behalf of Connected account
      idempotencyKey, // Stripe idempotency key - prevents duplicate charges
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url
    }, {
      headers: rateLimitHeaders,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
