import { NextResponse } from 'next/server';
import { stripe, isStripeAvailable } from '@/lib/stripe/client';
import { requireAuth } from '@/lib/permissions';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

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

    // Create Stripe Checkout Session
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
      },
      success_url: successUrl || `${process.env.NEXTAUTH_URL}/donations?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/donations?canceled=true`,
      customer_email: body.email,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
