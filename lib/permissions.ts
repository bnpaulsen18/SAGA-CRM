import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getPrismaWithRLS, verifyOrganizationOwnership } from './prisma-rls'

/**
 * Role-Based Access Control (RBAC) Permissions
 *
 * This module provides permission checks for various actions.
 * Roles: PLATFORM_ADMIN > ADMIN > MEMBER > VIEWER
 */

// ============================================
// Authentication Guards
// ============================================

/**
 * Require any authenticated user
 * Redirects to login if not authenticated
 */
export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }
  return session
}

/**
 * Require organization admin or platform admin
 * Throws error if user doesn't have admin role
 */
export async function requireOrgAdmin() {
  const session = await requireAuth()

  if (session.user.role !== 'ADMIN' && !session.user.isPlatformAdmin) {
    throw new Error('Forbidden: Admin access required')
  }

  return session
}

/**
 * Require platform admin (SAGA super admin)
 * Throws error if user is not platform admin
 */
export async function requirePlatformAdmin() {
  const session = await requireAuth()

  if (!session.user.isPlatformAdmin) {
    throw new Error('Forbidden: Platform admin access required')
  }

  return session
}

// ============================================
// Resource-Level Permissions
// ============================================

/**
 * Check if user can view a contact
 */
export async function canViewContact(contactId: string): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user) return false

    // Platform admins can view everything
    if (session.user.isPlatformAdmin) return true

    return await verifyOrganizationOwnership('contact', contactId)
  } catch (error) {
    return false
  }
}

/**
 * Check if user can edit a contact
 */
export async function canEditContact(contactId: string): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user) return false

    // Platform admins can edit everything
    if (session.user.isPlatformAdmin) return true

    // Viewers cannot edit
    if (session.user.role === 'VIEWER') return false

    return await verifyOrganizationOwnership('contact', contactId)
  } catch (error) {
    return false
  }
}

/**
 * Check if user can delete a contact
 */
export async function canDeleteContact(contactId: string): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user) return false

    // Platform admins can delete everything
    if (session.user.isPlatformAdmin) return true

    // Only org admins can delete
    if (session.user.role !== 'ADMIN') return false

    return await verifyOrganizationOwnership('contact', contactId)
  } catch (error) {
    return false
  }
}

/**
 * Check if user can view a donation
 */
export async function canViewDonation(donationId: string): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user) return false

    // Platform admins can view everything
    if (session.user.isPlatformAdmin) return true

    return await verifyOrganizationOwnership('donation', donationId)
  } catch (error) {
    return false
  }
}

/**
 * Check if user can edit a donation
 */
export async function canEditDonation(donationId: string): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user) return false

    // Platform admins can edit everything
    if (session.user.isPlatformAdmin) return true

    // Viewers cannot edit
    if (session.user.role === 'VIEWER') return false

    return await verifyOrganizationOwnership('donation', donationId)
  } catch (error) {
    return false
  }
}

/**
 * Check if user can delete a donation
 */
export async function canDeleteDonation(donationId: string): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user) return false

    // Platform admins can delete everything
    if (session.user.isPlatformAdmin) return true

    // Only org admins can delete donations (financial records)
    if (session.user.role !== 'ADMIN') return false

    return await verifyOrganizationOwnership('donation', donationId)
  } catch (error) {
    return false
  }
}

/**
 * Check if user can create donations
 */
export async function canCreateDonation(): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user) return false

    // Platform admins can create
    if (session.user.isPlatformAdmin) return true

    // Viewers cannot create
    if (session.user.role === 'VIEWER') return false

    // Must have an organization
    return !!session.user.organizationId
  } catch (error) {
    return false
  }
}

/**
 * Check if user can view a campaign
 */
export async function canViewCampaign(campaignId: string): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user) return false

    // Platform admins can view everything
    if (session.user.isPlatformAdmin) return true

    return await verifyOrganizationOwnership('campaign', campaignId)
  } catch (error) {
    return false
  }
}

/**
 * Check if user can edit a campaign
 */
export async function canEditCampaign(campaignId: string): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user) return false

    // Platform admins can edit everything
    if (session.user.isPlatformAdmin) return true

    // Viewers cannot edit
    if (session.user.role === 'VIEWER') return false

    return await verifyOrganizationOwnership('campaign', campaignId)
  } catch (error) {
    return false
  }
}

/**
 * Check if user can access reports
 */
export async function canAccessReports(): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user) return false

    // All authenticated users can access reports for their org
    return true
  } catch (error) {
    return false
  }
}

/**
 * Check if user can export data (GDPR)
 */
export async function canExportData(): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user) return false

    // Platform admins can export
    if (session.user.isPlatformAdmin) return true

    // Org admins can export their org's data
    if (session.user.role === 'ADMIN') return true

    return false
  } catch (error) {
    return false
  }
}

/**
 * Check if user can delete data (GDPR right to be forgotten)
 */
export async function canDeleteGDPRData(): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user) return false

    // Platform admins can delete
    if (session.user.isPlatformAdmin) return true

    // Only org admins can delete (for GDPR compliance)
    if (session.user.role === 'ADMIN') return true

    return false
  } catch (error) {
    return false
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Get user's role label for display
 */
export function getRoleLabel(role: string, isPlatformAdmin: boolean): string {
  if (isPlatformAdmin) return 'Platform Admin'

  switch (role) {
    case 'ADMIN':
      return 'Organization Admin'
    case 'MEMBER':
      return 'Member'
    case 'VIEWER':
      return 'Viewer'
    default:
      return role
  }
}

/**
 * Check if user has permission level
 * @param requiredRole Minimum role required
 */
export async function hasRole(requiredRole: 'VIEWER' | 'MEMBER' | 'ADMIN' | 'PLATFORM_ADMIN'): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user) return false

    // Platform admins always have access
    if (session.user.isPlatformAdmin) return true

    const roleHierarchy = {
      VIEWER: 1,
      MEMBER: 2,
      ADMIN: 3,
      PLATFORM_ADMIN: 4
    }

    const userLevel = roleHierarchy[session.user.role as keyof typeof roleHierarchy] || 0
    const requiredLevel = roleHierarchy[requiredRole]

    return userLevel >= requiredLevel
  } catch (error) {
    return false
  }
}
