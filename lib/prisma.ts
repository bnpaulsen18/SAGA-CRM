import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const initPrisma = (): PrismaClient => {
  if (!process.env.DATABASE_URL && !process.env.DIRECT_URL) {
    throw new Error(
      '[Prisma] DATABASE_URL or DIRECT_URL must be configured. The application cannot function without a database connection.'
    );
  }

  return new PrismaClient({
    // Disable query logging for better performance
    log: ['error'],
  });
};

export const prisma =
  globalForPrisma.prisma ?? initPrisma();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
