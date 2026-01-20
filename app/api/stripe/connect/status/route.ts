import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getConnectAccount, isAccountOnboarded } from '@/lib/stripe/connect';

/**
 * GET /api/stripe/connect/status
 * Check Stripe Connect account status
 *
 * Returns current connection status and details
 */
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.organizationId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const organization = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
      select: {
        stripeConnectAccountId: true,
        stripeConnectStatus: true,
        stripeConnectError: true,
        subscriptionTier: true,
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // If not connected, return basic status
    if (!organization.stripeConnectAccountId) {
      return NextResponse.json({
        status: organization.stripeConnectStatus,
        connected: false,
        canConnect: organization.subscriptionTier !== 'FREE',
        error: organization.stripeConnectError,
      });
    }

    // Fetch fresh status from Stripe
    try {
      const account = await getConnectAccount(organization.stripeConnectAccountId);
      const onboarded = await isAccountOnboarded(organization.stripeConnectAccountId);

      // Update database if status changed
      const newStatus = onboarded ? 'CONNECTED' : 'PENDING';
      if (newStatus !== organization.stripeConnectStatus) {
        await prisma.organization.update({
          where: { id: session.user.organizationId },
          data: { stripeConnectStatus: newStatus },
        });
      }

      return NextResponse.json({
        status: newStatus,
        connected: onboarded,
        accountId: organization.stripeConnectAccountId,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        detailsSubmitted: account.details_submitted,
        requirements: account.requirements,
      });
    } catch (error) {
      console.error('[Stripe Connect] Status check error:', error);

      // Account may have been deleted or restricted
      await prisma.organization.update({
        where: { id: session.user.organizationId },
        data: {
          stripeConnectStatus: 'ERROR',
          stripeConnectError: 'Could not verify Stripe account. Please reconnect.',
        },
      });

      return NextResponse.json({
        status: 'ERROR',
        connected: false,
        error: 'Could not verify Stripe account',
      });
    }
  } catch (error) {
    console.error('[Stripe Connect] Status endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
}
