import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Lazy-initialized Prisma client that doesn't throw during build time.
 * This fixes Vercel deployment failures where Next.js evaluates server
 * components during build but environment variables aren't available.
 */
const initPrisma = (): PrismaClient | null => {
  // Don't throw during build time - return null and defer error to runtime
  if (!process.env.DATABASE_URL && !process.env.DIRECT_URL) {
    // During build, we may not have env vars - that's okay
    // The error will be thrown at runtime when prisma is actually used
    console.warn('[Prisma] DATABASE_URL not configured - deferring to runtime');
    return null;
  }

  // Check if using PgBouncer (Supabase pooler)
  const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL || '';
  const isPgBouncer = databaseUrl.includes('pgbouncer=true') || databaseUrl.includes('pooler.supabase');

  if (isPgBouncer) {
    // Use PostgreSQL adapter for PgBouncer compatibility
    // This avoids the "prepared statement does not exist" error
    const pool = new Pool({
      connectionString: databaseUrl,
      max: 10, // Limit connections for serverless
    });

    const adapter = new PrismaPg(pool);

    return new PrismaClient({
      adapter,
      log: ['error'],
    });
  }

  // Standard Prisma Client for direct connections
  return new PrismaClient({
    log: ['error'],
  });
};

// Initialize prisma - may be null during build time
const _prisma = globalForPrisma.prisma ?? initPrisma();

// Export a proxy that throws a helpful error if used without proper config
export const prisma = new Proxy(_prisma as PrismaClient, {
  get(target, prop) {
    if (target === null) {
      throw new Error(
        '[Prisma] DATABASE_URL or DIRECT_URL must be configured. ' +
        'The application cannot function without a database connection. ' +
        'Please set these environment variables in your Vercel project settings.'
      );
    }
    return Reflect.get(target, prop);
  }
});

if (process.env.NODE_ENV !== 'production' && _prisma) {
  globalForPrisma.prisma = _prisma;
}
