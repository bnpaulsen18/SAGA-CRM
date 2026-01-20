import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { disconnectAccount } from '@/lib/stripe/connect';

/**
 * POST /api/stripe/connect/disconnect
 * Disconnect Stripe Connect account
 *
 * WARNING: This will prevent the organization from accepting online donations
 */
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.organizationId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only ADMIN role can disconnect
    if (session.user.role !== 'ADMIN' && session.user.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can disconnect Stripe' },
        { status: 403 }
      );
    }

    const organization = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
      select: {
        stripeConnectAccountId: true,
      },
    });

    if (!organization?.stripeConnectAccountId) {
      return NextResponse.json(
        { error: 'No Stripe account connected' },
        { status: 400 }
      );
    }

    // Disconnect from Stripe
    try {
      await disconnectAccount(organization.stripeConnectAccountId);
    } catch (error) {
      // Account may already be deleted, continue anyway
      console.warn('[Stripe Connect] Disconnect warning:', error);
    }

    // Update database
    await prisma.organization.update({
      where: { id: session.user.organizationId },
      data: {
        stripeConnectAccountId: null,
        stripeConnectStatus: 'NOT_CONNECTED',
        stripeConnectError: 'Manually disconnected by admin',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Stripe account disconnected. Online donations are now disabled.',
    });
  } catch (error) {
    console.error('[Stripe Connect] Disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Stripe account' },
      { status: 500 }
    );
  }
}
