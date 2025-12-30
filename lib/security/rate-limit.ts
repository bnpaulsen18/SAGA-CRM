/**
 * Rate Limiting Implementation
 * Simple in-memory rate limiter (for MVP)
 * TODO: Upgrade to Redis/Upstash for production
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check if request should be rate limited
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param config - Rate limit configuration
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  // Initialize or get existing record
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 0,
      resetTime: now + config.windowMs,
    };
  }

  const record = store[key];
  record.count++;

  const remaining = Math.max(0, config.maxRequests - record.count);
  const success = record.count <= config.maxRequests;

  return {
    success,
    limit: config.maxRequests,
    remaining,
    reset: record.resetTime,
  };
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // API endpoints
  api: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 100 requests per minute
  },

  // Authentication endpoints
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 5 requests per 15 minutes
  },

  // Email sending
  email: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 10 emails per minute
  },

  // PDF generation
  pdf: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 20 PDFs per minute
  },
};

/**
 * Get client identifier from request
 */
export function getClientIdentifier(req: Request): string {
  // Try to get IP from headers (works with proxies)
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

  // You could also use session ID or user ID for authenticated requests
  return ip;
}
