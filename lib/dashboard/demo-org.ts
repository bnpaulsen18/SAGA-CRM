import type { PrismaClient } from '@prisma/client'

/**
 * The demo organization ("Hope Foundation") is identified by this EIN — a
 * database-enforced unique column (`Organization.ein @unique`), not an
 * ordinary boolean flag. That matters: `findUnique` on a unique column is
 * structurally incapable of returning more than one row, whereas a boolean
 * flag would need `findFirst` and could silently resolve to the wrong org if
 * the invariant were ever violated (e.g. a second org accidentally flagged).
 *
 * scripts/seed-demo-login.ts imports this same constant — it must never be
 * redeclared elsewhere.
 */
export const DEMO_ORG_EIN = '88-8888888' as const

/**
 * A TrustedOrgId can only be minted by trustOrgIdFromSession() (after
 * requireAuth()) or trustDemoOrgId() (after resolving the hardcoded demo
 * org). A bare `string` — e.g. from a route param or search param — fails to
 * typecheck wherever a TrustedOrgId is required. This makes "wire an
 * unauthenticated org id into org-scoped data" a compile error rather than a
 * code-review hope.
 */
export type TrustedOrgId = string & { readonly __brand: 'TrustedOrgId' }

export function trustOrgIdFromSession(organizationId: string): TrustedOrgId {
  return organizationId as TrustedOrgId
}

function trustDemoOrgId(organizationId: string): TrustedOrgId {
  return organizationId as TrustedOrgId
}

/**
 * Resolves the demo org id for the public /demo page. Never accepts input —
 * the EIN is a hardcoded constant, not a parameter. The post-fetch check is
 * deliberate defense-in-depth: it's the assertion that still catches a
 * mistake even if a future refactor loosens the query itself.
 */
export async function getDemoOrgIdOrThrow(prisma: PrismaClient): Promise<TrustedOrgId> {
  const org = await prisma.organization.findUnique({
    where: { ein: DEMO_ORG_EIN },
    select: { id: true, ein: true },
  })

  if (!org || org.ein !== DEMO_ORG_EIN) {
    throw new Error('Demo organization missing or misconfigured — refusing to render /demo')
  }

  return trustDemoOrgId(org.id)
}
