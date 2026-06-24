import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { exchangeOAuthCode, isAccountOnboarded } from '@/lib/stripe/connect';

/**
 * GET /api/stripe/connect/callback
 * Handle the Stripe Connect OAuth callback.
 *
 * Security:
 * - Requires an authenticated session. The org that receives the payout account is
 *   ALWAYS the logged-in user's org — never the `state` query param (which is attacker-controllable).
 * - `state` must match the CSRF nonce set in the authorize step (httpOnly cookie).
 *   Without this, anyone could bind their own Stripe account to a victim org and redirect its donations.
 */
export async function GET(req: NextRequest) {
  const settingsRedirect = (params: Record<string, string>) => {
    const url = new URL('/settings/integrations', req.url);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    return NextResponse.redirect(url);
  };

  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // 1. Must be authenticated. The connecting org comes from the session, not the URL.
    const session = await auth();
    if (!session?.user?.organizationId) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    const organizationId = session.user.organizationId;

    // 2. CSRF: state must equal the nonce we set in /authorize (single-use).
    const cookieStore = await cookies();
    const expectedState = cookieStore.get('stripe_connect_state')?.value;
    cookieStore.delete('stripe_connect_state');
    if (!state || !expectedState || state !== expectedState) {
      return settingsRedirect({ stripe_error: 'Invalid or expired connection request. Please try again.' });
    }

    // 3. Stripe returned an error (e.g. the user declined).
    if (error) {
      console.error('[Stripe Connect] OAuth error:', error, errorDescription);
      await prisma.organization.update({
        where: { id: organizationId },
        data: { stripeConnectStatus: 'ERROR', stripeConnectError: errorDescription || error },
      });
      return settingsRedirect({ stripe_error: errorDescription || error });
    }

    if (!code) {
      return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
    }

    // 4. Exchange the code and bind the Stripe account to the SESSION's org.
    const { stripeUserId } = await exchangeOAuthCode(code);
    const isOnboarded = await isAccountOnboarded(stripeUserId);

    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        stripeConnectAccountId: stripeUserId,
        stripeConnectStatus: isOnboarded ? 'CONNECTED' : 'PENDING',
        stripeConnectError: null,
      },
    });

    return settingsRedirect(
      isOnboarded
        ? { stripe_connected: 'true' }
        : { stripe_connected: 'true', stripe_pending: 'true' }
    );
  } catch (error) {
    console.error('[Stripe Connect] Callback error:', error);
    const url = new URL('/settings/integrations', req.nextUrl.origin);
    url.searchParams.set('stripe_error', 'Connection failed. Please try again.');
    return NextResponse.redirect(url);
  }
}
