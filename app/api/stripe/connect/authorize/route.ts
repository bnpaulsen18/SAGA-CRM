import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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

    // Generate OAuth URL with an unguessable CSRF state nonce, stored in an httpOnly
    // cookie and verified in the callback. Never expose the raw org id as state.
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/stripe/connect/callback`;

    const state = crypto.randomUUID();
    (await cookies()).set('stripe_connect_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    const oauthUrl = getConnectOAuthUrl({
      state,
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
