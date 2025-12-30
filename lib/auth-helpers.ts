import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Get the current authenticated user from the session
 * Use this in server components and server actions
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}

/**
 * Get the current user with full details from database
 * Includes organization information
 */
export async function getCurrentUserWithOrg() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      organization: true,
    },
  });

  return user;
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use at the top of server components that require auth
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return session.user;
}

/**
 * Check if user has a specific role
 */
export async function hasRole(role: "PLATFORM_ADMIN" | "ADMIN" | "MEMBER" | "VIEWER") {
  const session = await auth();
  return session?.user?.role === role;
}

/**
 * Require specific role - redirects if user doesn't have the role
 */
export async function requireRole(role: "PLATFORM_ADMIN" | "ADMIN" | "MEMBER" | "VIEWER") {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== role) {
    redirect("/dashboard"); // or to an unauthorized page
  }

  return session.user;
}

/**
 * Check if user is a platform admin (SAGA owner)
 */
export async function isPlatformAdmin() {
  const session = await auth();
  return session?.user?.isPlatformAdmin || session?.user?.role === "PLATFORM_ADMIN";
}

/**
 * Require platform admin role - for SAGA owner features only
 */
export async function requirePlatformAdmin() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.isPlatformAdmin) {
    redirect("/dashboard"); // or to an unauthorized page
  }

  return session.user;
}

/**
 * Check if user is an organization admin
 */
export async function isAdmin() {
  return await hasRole("ADMIN");
}

/**
 * Require admin role (org admin, not platform admin)
 */
export async function requireAdmin() {
  return await requireRole("ADMIN");
}

/**
 * Get the user's organization ID
 */
export async function getOrganizationId() {
  const session = await auth();
  return session?.user?.organizationId || null;
}

/**
 * Get all organization IDs the user has access to
 * - Platform admins: ALL organizations
 * - Parent org admins: Their org + all sub-projects
 * - Regular users: Only their organization
 */
export async function getAccessibleOrganizationIds(): Promise<string[]> {
  const session = await auth();

  if (!session?.user) {
    return [];
  }

  // Platform admins can access all organizations
  if (session.user.isPlatformAdmin) {
    const allOrgs = await prisma.organization.findMany({
      select: { id: true },
    });
    return allOrgs.map((org) => org.id);
  }

  // Regular users can only access their organization
  if (!session.user.organizationId) {
    return [];
  }

  // Get user's organization with sub-projects
  const userOrg = await prisma.organization.findUnique({
    where: { id: session.user.organizationId },
    include: {
      subProjects: {
        select: { id: true },
      },
    },
  });

  if (!userOrg) {
    return [];
  }

  // If user is admin of a parent org, they can access sub-projects
  if (session.user.role === "ADMIN" && userOrg.organizationType === "PARENT") {
    return [userOrg.id, ...userOrg.subProjects.map((p) => p.id)];
  }

  // Otherwise, just their own organization
  return [userOrg.id];
}

/**
 * Check if user can access a specific organization
 * Used for permission checks before showing data
 */
export async function canAccessOrganization(organizationId: string): Promise<boolean> {
  const accessibleIds = await getAccessibleOrganizationIds();
  return accessibleIds.includes(organizationId);
}

/**
 * Get all organizations (for platform admin only)
 */
export async function getAllOrganizations() {
  const isPlatformAdminUser = await isPlatformAdmin();

  if (!isPlatformAdminUser) {
    throw new Error("Unauthorized: Platform admin access required");
  }

  return await prisma.organization.findMany({
    include: {
      _count: {
        select: {
          users: true,
          contacts: true,
          donations: true,
          campaigns: true,
        },
      },
      parentOrganization: {
        select: {
          id: true,
          name: true,
        },
      },
      subProjects: {
        select: {
          id: true,
          name: true,
          organizationType: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Get organizations with their sub-projects hierarchy
 * For parent org admins to view their projects
 */
export async function getOrganizationHierarchy() {
  const session = await auth();

  if (!session?.user?.organizationId) {
    return null;
  }

  const org = await prisma.organization.findUnique({
    where: { id: session.user.organizationId },
    include: {
      subProjects: {
        include: {
          _count: {
            select: {
              users: true,
              contacts: true,
              donations: true,
              designatedDonations: true, // Donations designated for this project
            },
          },
        },
      },
      parentOrganization: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return org;
}
