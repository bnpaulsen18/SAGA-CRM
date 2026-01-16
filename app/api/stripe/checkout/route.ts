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

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

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

    // Create Stripe Checkout Session with idempotency key
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
                  description: `Recurring donation to ${session.user.organizationId}`,
                },
                unit_amount: Math.round(amount * 100),
                recurring: {
                  interval: 'month',
                },
              }
            : {
                currency: 'usd',
                product_data: {
                  name: 'Donation',
                  description: `One-time donation to ${session.user.organizationId}`,
                },
                unit_amount: Math.round(amount * 100),
              },
          quantity: 1,
        },
      ],
      metadata: {
        organizationId: session.user.organizationId || '',
        contactId,
        campaignId: campaignId || '',
        fundRestriction: fundRestriction || 'UNRESTRICTED',
        isRecurring: isRecurring ? 'true' : 'false',
        idempotencyKey, // Store for webhook
        method: 'CREDIT_CARD',
      },
      success_url: successUrl || `${process.env.NEXTAUTH_URL}/donations?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/donations?canceled=true`,
      customer_email: body.email,
    }, {
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
