import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'

/**
 * Row-Level Security (RLS) for Prisma
 *
 * NOTE: Prisma middleware ($use) is deprecated. We use manual filtering instead.
 * All queries in pages/API routes must use getPrismaWithRLS() to ensure data isolation.
 *
 * Platform admins can access all organizations' data.
 * Regular users can only access their own organization's data.
 *
 * SECURITY: This prevents data leakage between organizations.
 */

// Singleton Prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Get Prisma client with user session context
 * Use this in all pages and API routes to enforce multi-tenancy
 */
export async function getPrismaWithRLS() {
  const session = await auth()

  if (!session?.user) {
    throw new Error('Unauthorized: No active session')
  }

  // For platform admins, return regular Prisma (no filtering)
  if (session.user.isPlatformAdmin) {
    return prisma
  }

  // For regular users, verify they have an organization
  if (!session.user.organizationId) {
    throw new Error('Forbidden: User has no organization assigned')
  }

  // Return Prisma client - queries must manually include organizationId filter
  // This is enforced at the application level in each query
  return prisma
}

/**
 * Get organization ID filter for current user
 * Use this in all queries to enforce RLS
 */
export async function getOrgFilter() {
  const session = await auth()

  if (!session?.user) {
    throw new Error('Unauthorized: No active session')
  }

  // Platform admins see all organizations
  if (session.user.isPlatformAdmin) {
    return {}
  }

  // Regular users only see their organization
  if (!session.user.organizationId) {
    throw new Error('Forbidden: User has no organization assigned')
  }

  return {
    organizationId: session.user.organizationId
  }
}

/**
 * Get organization ID for creating records
 */
export async function getOrgId(): Promise<string> {
  const session = await auth()

  if (!session?.user) {
    throw new Error('Unauthorized: No active session')
  }

  if (!session.user.organizationId) {
    throw new Error('Forbidden: User has no organization assigned')
  }

  return session.user.organizationId
}

/**
 * Helper function to check if a resource belongs to the current user's organization
 */
export async function verifyOrganizationOwnership(
  resourceType: string,
  resourceId: string
): Promise<boolean> {
  const session = await auth()

  if (!session?.user) {
    return false
  }

  // Platform admins can access everything
  if (session.user.isPlatformAdmin) {
    return true
  }

  try {
    const resource = await (prisma as any)[resourceType].findUnique({
      where: { id: resourceId },
      select: { organizationId: true }
    })

    if (!resource) {
      return false
    }

    return resource.organizationId === session.user.organizationId
  } catch (error) {
    console.error('Error verifying organization ownership:', error)
    return false
  }
}
