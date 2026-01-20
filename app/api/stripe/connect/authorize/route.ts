import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getConnectOAuthUrl } from '@/lib/stripe/connect';

/**
 * POST /api/stripe/connect/authorize
 * Initiate Stripe Connect OAuth flow
 *
 * Returns OAuth URL to redirect user to Stripe
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

    const organizationId = session.user.organizationId;

    // Check subscription tier - only Pro/Enterprise can connect Stripe
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { subscriptionTier: true, name: true },
    });

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    if (organization.subscriptionTier === 'FREE') {
      return NextResponse.json(
        { error: 'Stripe Connect requires Pro or Enterprise plan. Please upgrade to process online donations.' },
        { status: 403 }
      );
    }

    // Generate OAuth URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/stripe/connect/callback`;

    const oauthUrl = getConnectOAuthUrl({
      state: organizationId, // State = orgId for verification
      redirectUri,
    });

    // Update status to PENDING
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        stripeConnectStatus: 'PENDING',
        stripeConnectError: null,
      },
    });

    return NextResponse.json({
      url: oauthUrl,
      message: 'Redirect user to this URL to connect Stripe account',
    });
  } catch (error) {
    console.error('[Stripe Connect] Authorization error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Stripe Connect' },
      { status: 500 }
    );
  }
}
