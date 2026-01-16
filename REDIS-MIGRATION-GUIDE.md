# Redis Migration Guide: Rate Limiter for Serverless

## 🚨 Critical Issue

The current rate limiter in `lib/security/rate-limiter.ts` uses **in-memory storage**, which **will NOT work on Vercel** or other serverless platforms. Each serverless function instance has its own memory, so rate limits won't be enforced across requests.

**Impact:**
- Rate limiting will be ineffective in production
- Attackers can bypass limits by hitting different serverless instances
- Fraud protection will be weakened

## ✅ Solution: Redis-Based Rate Limiter

Migrate from in-memory Map storage to Redis (or Vercel KV) for persistent, distributed rate limiting.

---

## Option 1: Vercel KV (Recommended for Vercel deployments)

### Step 1: Enable Vercel KV

1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **Create Database** → **KV**
3. Note your credentials:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

### Step 2: Install Vercel KV SDK

```bash
npm install @vercel/kv
```

### Step 3: Update Environment Variables

Add to `.env.production`:

```bash
KV_REST_API_URL="https://your-kv-instance.kv.vercel-storage.com"
KV_REST_API_TOKEN="your-token-here"
```

### Step 4: Replace Rate Limiter Implementation

**Current Implementation (In-Memory):**

```typescript
// lib/security/rate-limiter.ts
const store = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count };
}
```

**New Implementation (Vercel KV):**

```typescript
// lib/security/rate-limiter.ts
import { kv } from '@vercel/kv';

export async function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const resetAt = now + windowMs;

  // Get current count from Redis
  const count = await kv.get<number>(`ratelimit:${key}`) || 0;

  if (count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  // Increment count
  const newCount = await kv.incr(`ratelimit:${key}`);

  // Set expiration on first request
  if (newCount === 1) {
    await kv.expire(`ratelimit:${key}`, Math.ceil(windowMs / 1000)); // Convert to seconds
  }

  return {
    allowed: true,
    remaining: limit - newCount
  };
}

// Cleanup function (optional - KV auto-expires)
export async function resetRateLimit(key: string) {
  await kv.del(`ratelimit:${key}`);
}
```

---

## Option 2: Upstash Redis (Alternative)

### Step 1: Create Upstash Redis Database

1. Sign up at [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Copy credentials:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### Step 2: Install Upstash SDK

```bash
npm install @upstash/redis
```

### Step 3: Update Environment Variables

```bash
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token-here"
```

### Step 4: Implement Upstash Rate Limiter

```typescript
// lib/security/rate-limiter.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
});

export async function checkRateLimit(key: string, limit: number, windowMs: number) {
  const count = await redis.incr(`ratelimit:${key}`);

  if (count === 1) {
    // Set expiration on first request
    await redis.expire(`ratelimit:${key}`, Math.ceil(windowMs / 1000));
  }

  if (count > limit) {
    return { allowed: false, remaining: 0 };
  }

  return {
    allowed: true,
    remaining: limit - count
  };
}
```

---

## Option 3: Redis Labs / AWS ElastiCache (Enterprise)

For high-scale production environments:

1. Set up Redis instance (AWS ElastiCache, Redis Labs, etc.)
2. Install `ioredis`:
   ```bash
   npm install ioredis
   ```
3. Configure connection:
   ```typescript
   import Redis from 'ioredis';

   const redis = new Redis(process.env.REDIS_URL);

   export async function checkRateLimit(key: string, limit: number, windowMs: number) {
     const multi = redis.multi();
     multi.incr(`ratelimit:${key}`);
     multi.expire(`ratelimit:${key}`, Math.ceil(windowMs / 1000));

     const [[, count]] = await multi.exec();

     if (count > limit) {
       return { allowed: false, remaining: 0 };
     }

     return { allowed: true, remaining: limit - count };
   }
   ```

---

## Migration Checklist

- [ ] Choose Redis provider (Vercel KV, Upstash, or custom Redis)
- [ ] Create Redis instance and obtain credentials
- [ ] Add credentials to environment variables
- [ ] Install Redis SDK (`@vercel/kv` or `@upstash/redis` or `ioredis`)
- [ ] Update `lib/security/rate-limiter.ts` with new implementation
- [ ] Test rate limiting locally with Redis connection
- [ ] Deploy to staging environment and verify
- [ ] Monitor rate limit effectiveness in production
- [ ] Remove old in-memory Map implementation

---

## Testing Redis Rate Limiter

```typescript
// Test script: scripts/test-rate-limiter.ts
import { checkRateLimit } from '@/lib/security/rate-limiter';

async function testRateLimiter() {
  const key = 'test-ip-123.456.789.0';
  const limit = 5;
  const windowMs = 60000; // 1 minute

  console.log('Testing rate limiter with Redis...\n');

  for (let i = 1; i <= 7; i++) {
    const result = await checkRateLimit(key, limit, windowMs);
    console.log(`Request ${i}:`, result);

    if (!result.allowed) {
      console.log('✅ Rate limit correctly blocked request');
    }
  }
}

testRateLimiter().catch(console.error);
```

Run with:
```bash
npx tsx scripts/test-rate-limiter.ts
```

---

## Current Usage in SAGA CRM

The rate limiter is used in:

1. **Donation API** (`app/api/donations/route.ts`)
   - 10 requests per minute per IP
   - Prevents rapid-fire donation attempts

2. **Newsletter Signup** (`app/api/newsletter/subscribe/route.ts`)
   - 5 requests per minute per IP
   - Prevents email list bombing

3. **Fraud Monitoring** (indirect)
   - Works with fraud detection system
   - Part of 99.2% bot attack prevention

---

## Estimated Costs

### Vercel KV
- **Free Tier**: 256 MB storage, 1M commands/month
- **Pro**: $1/month + $0.30/GB + $0.20/1M commands
- **Recommendation**: Free tier sufficient for most nonprofits

### Upstash Redis
- **Free Tier**: 10,000 commands/day
- **Pay-as-you-go**: $0.20/100K commands
- **Recommendation**: Free tier works for small/medium orgs

### Custom Redis (AWS ElastiCache)
- **Cost**: $15-50/month depending on instance size
- **Recommendation**: Only for large enterprises

---

## Priority

⚠️ **CRITICAL** - Must be completed before production deployment to Vercel

Without Redis, rate limiting will not work correctly in serverless environments, significantly weakening fraud protection.

---

## Support

If you encounter issues:
1. Check Redis connection with `redis.ping()`
2. Verify environment variables are set correctly
3. Test locally before deploying
4. Monitor Vercel logs for Redis connection errors

For help: Open an issue at https://github.com/your-repo/issues
