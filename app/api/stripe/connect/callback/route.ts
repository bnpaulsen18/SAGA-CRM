import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exchangeOAuthCode, isAccountOnboarded } from '@/lib/stripe/connect';

/**
 * GET /api/stripe/connect/callback
 * Handle Stripe Connect OAuth callback
 *
 * Query params:
 * - code: OAuth authorization code from Stripe
 * - state: organizationId passed in authorization request
 * - error: Error code if OAuth failed
 * - error_description: Human-readable error message
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // organizationId
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
      console.error('[Stripe Connect] OAuth error:', error, errorDescription);

      if (state) {
        await prisma.organization.update({
          where: { id: state },
          data: {
            stripeConnectStatus: 'ERROR',
            stripeConnectError: errorDescription || error,
          },
        });
      }

      // Redirect to settings with error
      const redirectUrl = new URL('/settings/integrations', req.url);
      redirectUrl.searchParams.set('stripe_error', errorDescription || error);
      return NextResponse.redirect(redirectUrl);
    }

    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing code or state parameter' },
        { status: 400 }
      );
    }

    const organizationId = state;

    // Exchange OAuth code for access token and Stripe account ID
    const { stripeUserId, accessToken, refreshToken } = await exchangeOAuthCode(code);

    // Check if account is fully onboarded
    const isOnboarded = await isAccountOnboarded(stripeUserId);

    // Update organization with Connect account details
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        stripeConnectAccountId: stripeUserId,
        stripeConnectStatus: isOnboarded ? 'CONNECTED' : 'PENDING',
        stripeConnectError: null,
      },
    });

    // Redirect to success page
    const redirectUrl = new URL('/settings/integrations', req.url);
    redirectUrl.searchParams.set('stripe_connected', 'true');
    if (!isOnboarded) {
      redirectUrl.searchParams.set('stripe_pending', 'true');
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('[Stripe Connect] Callback error:', error);

    // Redirect to error page
    const redirectUrl = new URL('/settings/integrations', req.nextUrl.origin);
    redirectUrl.searchParams.set('stripe_error', 'Connection failed. Please try again.');
    return NextResponse.redirect(redirectUrl);
  }
}
