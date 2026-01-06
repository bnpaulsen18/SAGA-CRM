import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const initPrisma = (): PrismaClient => {
  if (!process.env.DATABASE_URL && !process.env.DIRECT_URL) {
    throw new Error(
      '[Prisma] DATABASE_URL or DIRECT_URL must be configured. The application cannot function without a database connection.'
    );
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

export const prisma =
  globalForPrisma.prisma ?? initPrisma();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
