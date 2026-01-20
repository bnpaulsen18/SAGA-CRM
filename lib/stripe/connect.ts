import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[Stripe Connect] STRIPE_SECRET_KEY not configured');
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    })
  : null;

/**
 * Create Stripe Connect account link for OAuth onboarding
 * @param organizationId - Organization ID for state parameter
 * @param refreshUrl - URL to return to if user needs to restart
 * @param returnUrl - URL to return to after successful connection
 */
export async function createConnectAccountLink(
  organizationId: string,
  refreshUrl: string,
  returnUrl: string
): Promise<string> {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  // Create Connect account link
  const accountLink = await stripe.accountLinks.create({
    type: 'account_onboarding',
    account: organizationId, // Will be created first
    refresh_url: refreshUrl,
    return_url: returnUrl,
  });

  return accountLink.url;
}

/**
 * Create a Stripe Connect Express account for a nonprofit
 * @param email - Organization email
 * @param businessProfile - Business details
 */
export async function createConnectAccount(params: {
  email: string;
  businessName: string;
  country?: string;
  type?: 'express' | 'standard';
}): Promise<Stripe.Account> {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  const { email, businessName, country = 'US', type = 'express' } = params;

  const account = await stripe.accounts.create({
    type,
    email,
    country,
    business_type: 'non_profit',
    business_profile: {
      name: businessName,
      product_description: 'Nonprofit donations and fundraising',
      support_email: email,
    },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    settings: {
      payouts: {
        schedule: {
          interval: 'daily', // Nonprofits get funds quickly
        },
      },
    },
  });

  return account;
}

/**
 * Get Connect account details and status
 */
export async function getConnectAccount(
  accountId: string
): Promise<Stripe.Account> {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  return await stripe.accounts.retrieve(accountId);
}

/**
 * Check if Connect account is fully onboarded and can accept payments
 */
export async function isAccountOnboarded(
  accountId: string
): Promise<boolean> {
  const account = await getConnectAccount(accountId);

  return (
    account.charges_enabled === true &&
    account.payouts_enabled === true &&
    account.details_submitted === true
  );
}

/**
 * Create a payment intent with application fee (2% platform fee)
 * @param amount - Amount in cents
 * @param connectedAccountId - Nonprofit's Stripe Connect account
 * @param applicationFeePercent - Platform fee percentage (default 2%)
 */
export async function createPaymentIntentWithFee(params: {
  amount: number;
  currency?: string;
  connectedAccountId: string;
  applicationFeePercent?: number;
  metadata?: Record<string, string>;
  idempotencyKey?: string;
}): Promise<Stripe.PaymentIntent> {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  const {
    amount,
    currency = 'usd',
    connectedAccountId,
    applicationFeePercent = 2,
    metadata,
    idempotencyKey,
  } = params;

  // Calculate 2% application fee
  const applicationFeeAmount = Math.round(amount * (applicationFeePercent / 100));

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount,
      currency,
      application_fee_amount: applicationFeeAmount,
      metadata: {
        ...metadata,
        platform_fee_percent: applicationFeePercent.toString(),
      },
      transfer_data: {
        destination: connectedAccountId, // 98% goes to nonprofit
      },
    },
    {
      idempotencyKey,
    }
  );

  return paymentIntent;
}

/**
 * Delete/disconnect a Connect account
 */
export async function disconnectAccount(accountId: string): Promise<void> {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  await stripe.accounts.del(accountId);
}

/**
 * Get OAuth URL for Stripe Connect
 */
export function getConnectOAuthUrl(params: {
  state: string; // organizationId encrypted
  redirectUri: string;
}): string {
  const { state, redirectUri } = params;

  const clientId = process.env.STRIPE_CONNECT_CLIENT_ID;
  if (!clientId) {
    throw new Error('STRIPE_CONNECT_CLIENT_ID not configured');
  }

  const url = new URL('https://connect.stripe.com/oauth/authorize');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('scope', 'read_write');
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);
  url.searchParams.set('stripe_user[business_type]', 'non_profit');
  url.searchParams.set('stripe_user[country]', 'US');

  return url.toString();
}

/**
 * Exchange OAuth code for Connect account access
 */
export async function exchangeOAuthCode(code: string): Promise<{
  stripeUserId: string;
  accessToken: string;
  refreshToken: string;
}> {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  const response = await stripe.oauth.token({
    grant_type: 'authorization_code',
    code,
  });

  return {
    stripeUserId: response.stripe_user_id!,
    accessToken: response.access_token!,
    refreshToken: response.refresh_token!,
  };
}

export { stripe };
