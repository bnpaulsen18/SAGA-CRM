/**
 * Rate Limiting Utility - Vercel KV (Redis) Implementation
 * Production-ready rate limiter for serverless environments
 *
 * IMPORTANT: This uses Vercel KV (Redis) instead of in-memory storage
 * to work correctly across multiple serverless function instances.
 */

import { kv } from '@vercel/kv'

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

/**
 * Check if request should be rate limited using Redis
 * @param identifier Unique identifier (IP address, user ID, etc.)
 * @param maxRequests Maximum requests allowed
 * @param windowMs Time window in milliseconds
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
export async function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult> {
  try {
    const key = `ratelimit:${identifier}`
    const now = Date.now()
    const windowSeconds = Math.ceil(windowMs / 1000)

    // Get current count
    const currentCount = await kv.get<number>(key)

    // First request in window
    if (currentCount === null) {
      await kv.set(key, 1, { ex: windowSeconds })

      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs,
      }
    }

    // Check if limit exceeded
    if (currentCount >= maxRequests) {
      const ttl = await kv.ttl(key)
      const retryAfter = ttl > 0 ? ttl : windowSeconds

      return {
        allowed: false,
        remaining: 0,
        resetTime: now + (retryAfter * 1000),
        retryAfter,
      }
    }

    // Increment count
    const newCount = await kv.incr(key)

    // Ensure TTL is set (in case INCR created a key without expiration)
    if (currentCount === 0) {
      await kv.expire(key, windowSeconds)
    }

    return {
      allowed: true,
      remaining: maxRequests - newCount,
      resetTime: now + windowMs,
    }
  } catch (error) {
    console.error('Rate limiter error:', error)

    // Fail open - allow request if Redis is unavailable
    // This prevents complete service outage if Redis fails
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: Date.now() + windowMs,
    }
  }
}

/**
 * Manually reset rate limit for a specific identifier
 * Useful for testing or admin overrides
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  try {
    await kv.del(`ratelimit:${identifier}`)
  } catch (error) {
    console.error('Rate limit reset error:', error)
  }
}

/**
 * Get current rate limit stats for an identifier
 */
export async function getRateLimitStats(identifier: string): Promise<{
  count: number
  ttl: number
} | null> {
  try {
    const key = `ratelimit:${identifier}`
    const [count, ttl] = await Promise.all([
      kv.get<number>(key),
      kv.ttl(key)
    ])

    if (count === null) {
      return null
    }

    return { count, ttl }
  } catch (error) {
    console.error('Get rate limit stats error:', error)
    return null
  }
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Newsletter API - 10 requests per 15 minutes per IP
  NEWSLETTER: {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },

  // Authentication - 5 requests per 15 minutes per IP
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  },

  // API endpoints - 100 requests per minute per user
  API: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },

  // PDF generation - 20 requests per minute per user
  PDF: {
    maxRequests: 20,
    windowMs: 60 * 1000,
  },

  // Donations - 10 requests per hour per user (anti-fraud)
  DONATIONS: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },

  // Stripe checkout - 5 requests per 15 minutes per user
  STRIPE_CHECKOUT: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
}

/**
 * Helper to get client identifier from request
 * Uses IP address as identifier
 */
export function getClientIdentifier(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const ip = forwardedFor?.split(',')[0].trim() || realIp || 'unknown'

  return `ip:${ip}`
}

/**
 * Helper to create rate limit response headers
 */
export function createRateLimitHeaders(result: RateLimitResult) {
  return {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
    ...(result.retryAfter && {
      'Retry-After': result.retryAfter.toString(),
    }),
  }
}

/**
 * Backward compatibility wrapper
 * Maintains the same interface as the old RateLimiter class
 */
export class RateLimiter {
  async check(
    identifier: string,
    maxRequests: number,
    windowMs: number
  ): Promise<RateLimitResult> {
    return checkRateLimit(identifier, maxRequests, windowMs)
  }

  async reset(identifier: string): Promise<void> {
    return resetRateLimit(identifier)
  }

  async getStats(identifier: string) {
    return getRateLimitStats(identifier)
  }

  // These methods are no-ops for Redis implementation
  clear() {
    console.warn('RateLimiter.clear() is a no-op with Redis implementation')
  }

  destroy() {
    console.warn('RateLimiter.destroy() is a no-op with Redis implementation')
  }
}

// Singleton instance for backward compatibility
export const rateLimiter = new RateLimiter()
