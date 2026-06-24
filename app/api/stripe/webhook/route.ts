import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe, isStripeAvailable, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe/client';
import { prisma } from '@/lib/prisma';
import { sendAutomatedThankYou } from '@/lib/email/send-donation-receipt';
import { calculateFraudScore } from '@/lib/security/fraud-detector';

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  // Check if Stripe is available
  if (!stripe || !isStripeAvailable) {
    console.error('[Stripe Webhook] Stripe not configured but webhook received');
    return NextResponse.json(
      { error: 'Stripe integration not configured' },
      { status: 503 }
    );
  }

  if (!STRIPE_WEBHOOK_SECRET) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata!;

  // Check idempotency key first (most reliable duplicate detection)
  const idempotencyKey = metadata.idempotencyKey;
  if (idempotencyKey) {
    const existingByIdempotency = await prisma.donation.findUnique({
      where: { idempotencyKey },
    });

    if (existingByIdempotency) {
      console.warn('[Stripe Webhook] Duplicate detected via idempotency key:', {
        idempotencyKey,
        sessionId: session.id,
        existingDonationId: existingByIdempotency.id,
      });
      return; // Skip creating duplicate donation
    }
  }

  // Duplicate transaction detection - prevent webhook replay attacks
  const transactionId = session.payment_intent as string || session.subscription as string;
  if (transactionId) {
    const existingDonation = await prisma.donation.findFirst({
      where: {
        transactionId,
        organizationId: metadata.organizationId,
      },
    });

    if (existingDonation) {
      console.warn('[Stripe Webhook] Duplicate transaction detected (transactionId):', {
        transactionId,
        sessionId: session.id,
        existingDonationId: existingDonation.id,
      });
      return; // Skip creating duplicate donation
    }
  }

  // Calculate fraud score for Stripe donations
  const fraudCheck = await calculateFraudScore({
    organizationId: metadata.organizationId,
    contactId: metadata.contactId,
    amount: (session.amount_total || 0) / 100,
    method: metadata.method || 'CREDIT_CARD',
  });

  // Log high-risk Stripe donations
  if (fraudCheck.fraudScore >= 40) {
    console.warn('[Stripe Webhook] High-risk donation detected:', {
      sessionId: session.id,
      fraudScore: fraudCheck.fraudScore,
      flags: fraudCheck.fraudFlags,
    });
  }

  // Create donation record
  const donation = await prisma.donation.create({
    data: {
      organizationId: metadata.organizationId,
      contactId: metadata.contactId,
      amount: (session.amount_total || 0) / 100,
      currency: (session.currency || 'usd').toUpperCase(),
      type: metadata.isRecurring === 'true' ? 'MONTHLY' : 'ONE_TIME',
      method: 'CREDIT_CARD',
      status: 'COMPLETED',
      fundRestriction: (metadata.fundRestriction as any) || 'UNRESTRICTED',
      campaignId: metadata.campaignId || null,
      transactionId: session.payment_intent as string || session.subscription as string,
      receiptNumber: `STRIPE-${Date.now()}`,
      taxDeductible: true,
      donatedAt: new Date(),
      // Fraud detection fields
      idempotencyKey: idempotencyKey || null,
      fraudScore: fraudCheck.fraudScore,
      fraudFlags: fraudCheck.fraudFlags,
      reviewStatus: fraudCheck.reviewStatus,
    },
  });

  // Update campaign if applicable
  if (metadata.campaignId) {
    await prisma.campaign.update({
      where: { id: metadata.campaignId },
      data: {
        raised: {
          increment: donation.amount,
        },
      },
    });
  }

  // Send automated thank-you email
  try {
    await sendAutomatedThankYou(donation.id);
  } catch (error) {
    console.error('Failed to send automated email:', error);
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Handle recurring donation payment
  // Type assertion: invoice.subscription exists in Stripe API but not in TS type definitions
  const invoiceWithSubscription = invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription };

  if (invoiceWithSubscription.subscription && invoice.metadata && Object.keys(invoice.metadata).length > 0) {
    const metadata = invoice.metadata;

    // Duplicate transaction detection - prevent webhook replay attacks
    const transactionId = invoice.id;
    const existingDonation = await prisma.donation.findFirst({
      where: {
        transactionId,
        organizationId: metadata.organizationId,
      },
    });

    if (existingDonation) {
      console.warn('[Stripe Webhook] Duplicate recurring transaction detected:', {
        transactionId,
        invoiceId: invoice.id,
        existingDonationId: existingDonation.id,
      });
      return; // Skip creating duplicate donation
    }

    await prisma.donation.create({
      data: {
        organizationId: metadata.organizationId,
        contactId: metadata.contactId,
        amount: (invoice.amount_paid || 0) / 100,
        currency: (invoice.currency || 'usd').toUpperCase(),
        type: 'MONTHLY',
        method: 'CREDIT_CARD',
        status: 'COMPLETED',
        fundRestriction: (metadata.fundRestriction as any) || 'UNRESTRICTED',
        campaignId: metadata.campaignId || null,
        transactionId: invoice.id,
        receiptNumber: `STRIPE-${Date.now()}`,
        taxDeductible: true,
        donatedAt: new Date(),
      },
    });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`Subscription deleted: ${subscription.id}`);

  const metadata = subscription.metadata as {
    organizationId?: string;
    contactId?: string;
    campaignId?: string;
    fundRestriction?: string;
  };

  if (!metadata.organizationId || !metadata.contactId) {
    console.error('Missing metadata in subscription deletion webhook');
    return;
  }

  try {
    // Find all MONTHLY donations for this contact/subscription
    // Note: We don't store subscription ID on donations, so we'll mark the most recent MONTHLY donation as cancelled
    const recentMonthlyDonation = await prisma.donation.findFirst({
      where: {
        organizationId: metadata.organizationId,
        contactId: metadata.contactId,
        type: 'MONTHLY',
        status: {
          in: ['COMPLETED', 'PENDING']
        }
      },
      orderBy: {
        donatedAt: 'desc'
      }
    });

    if (recentMonthlyDonation) {
      // Update donation status to CANCELLED
      await prisma.donation.update({
        where: { id: recentMonthlyDonation.id },
        data: {
          status: 'CANCELLED',
          notes: `Recurring subscription cancelled on ${new Date().toISOString()}`
        }
      });

      // Create an interaction record for the cancellation
      await prisma.interaction.create({
        data: {
          organizationId: metadata.organizationId,
          contactId: metadata.contactId,
          userId: metadata.organizationId, // System user
          type: 'NOTE',
          subject: 'Recurring Donation Cancelled',
          notes: `Stripe subscription ${subscription.id} was cancelled. Monthly donations have been stopped.`,
          occurredAt: new Date()
        }
      });

      console.log(`Marked recurring donation ${recentMonthlyDonation.id} as cancelled for contact ${metadata.contactId}`);
    } else {
      console.warn(`No active monthly donations found for contact ${metadata.contactId}`);
    }
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}
