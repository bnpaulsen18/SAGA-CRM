// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Capture 100% of transactions for performance monitoring in development
  // Reduce this in production to save quota
  environment: process.env.NODE_ENV || 'development',

  // Filter out sensitive information
  beforeSend(event) {
    // Remove query strings from URLs
    if (event.request?.url) {
      event.request.url = event.request.url.split('?')[0];
    }

    // Remove sensitive headers and environment variables
    if (event.request?.headers) {
      delete event.request.headers.Authorization;
      delete event.request.headers.Cookie;
      delete event.request.headers['x-api-key'];
    }

    // Remove sensitive environment variables from context
    if (event.contexts?.runtime?.env) {
      const env = event.contexts.runtime.env as Record<string, unknown>;
      delete env.DATABASE_URL;
      delete env.STRIPE_SECRET_KEY;
      delete env.NEXTAUTH_SECRET;
      delete env.RESEND_API_KEY;
      delete env.ANTHROPIC_API_KEY;
    }

    return event;
  },

  ignoreErrors: [
    // Database connection errors (these are already logged)
    'ECONNREFUSED',
    'ETIMEDOUT',
    // Next.js internal errors
    'NEXT_NOT_FOUND',
  ],
});
