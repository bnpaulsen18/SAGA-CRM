import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * Health Check Endpoint
 * Returns system health status for monitoring and uptime checks
 *
 * @returns 200 if all systems healthy, 503 if any critical service is down
 */
export async function GET() {
  const startTime = Date.now();

  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
    checks: {
      database: await checkDatabase(),
      email: checkEmail(),
      stripe: checkStripe(),
      auth: checkAuth(),
    },
    responseTime: 0,
  };

  checks.responseTime = Date.now() - startTime;

  // Determine overall status
  const checkValues = Object.values(checks.checks);
  const hasUnhealthy = checkValues.some((check) => check.status === 'error');
  const hasDegraded = checkValues.some((check) => check.status === 'degraded');

  if (hasUnhealthy) {
    checks.status = 'unhealthy';
  } else if (hasDegraded) {
    checks.status = 'degraded';
  }

  const statusCode = checks.status === 'unhealthy' ? 503 : 200;

  return NextResponse.json(checks, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

/**
 * Check database connectivity
 */
async function checkDatabase() {
  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;

    return {
      status: 'ok' as const,
      message: 'Database connection healthy',
      responseTime,
    };
  } catch (error) {
    return {
      status: 'error' as const,
      message: error instanceof Error ? error.message : 'Database connection failed',
      responseTime: 0,
    };
  }
}

/**
 * Check email service configuration
 */
function checkEmail() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return {
      status: 'degraded' as const,
      message: 'Email service not fully configured (receipts may not send)',
      configured: false,
    };
  }

  return {
    status: 'ok' as const,
    message: 'Email service configured',
    configured: true,
    fromEmail,
  };
}

/**
 * Check Stripe configuration
 */
function checkStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const isLiveMode = secretKey?.startsWith('sk_live_');

  if (!secretKey || !publishableKey) {
    return {
      status: 'degraded' as const,
      message: 'Stripe not configured (donation processing disabled)',
      configured: false,
    };
  }

  if (!webhookSecret) {
    return {
      status: 'degraded' as const,
      message: 'Stripe webhook not configured (automatic donation recording may fail)',
      configured: true,
      webhookConfigured: false,
      mode: isLiveMode ? 'live' : 'test',
    };
  }

  return {
    status: 'ok' as const,
    message: 'Stripe fully configured',
    configured: true,
    webhookConfigured: true,
    mode: isLiveMode ? 'live' : 'test',
  };
}

/**
 * Check authentication configuration
 */
function checkAuth() {
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const microsoftClientId = process.env.MICROSOFT_CLIENT_ID;

  if (!nextAuthSecret) {
    return {
      status: 'error' as const,
      message: 'NEXTAUTH_SECRET not configured',
      configured: false,
    };
  }

  const providers = [];
  if (googleClientId) providers.push('Google');
  if (microsoftClientId) providers.push('Microsoft');

  return {
    status: 'ok' as const,
    message: 'Authentication configured',
    configured: true,
    url: nextAuthUrl || 'not set',
    providers,
  };
}
