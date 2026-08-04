import type { PrismaClient } from '@prisma/client'
import type { TrustedOrgId } from './demo-org'
import { scoreDonor, STATUS_PRIORITY, type DonorStatus } from '@/lib/donors/scoring'

export const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US')
export const money2 = (n: number) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// Donor math lives in lib/donors/scoring.ts — the single source of truth shared
// by the dashboard, the donor/donation pages and the agents. Re-exported here so
// existing importers of this module keep working.
export type { DonorStatus }

export interface AttentionDonor {
  contactId: string
  name: string
  email: string
  initials: string
  lifetime: number
  lastGift: Date | null
  count: number
  monthsSince: number
  status: DonorStatus
  suggestion: string
  atStake: number
}

export type KpiKind = 'raisedThisYear' | 'activeDonors' | 'avgGift' | 'retention'

export interface KpiItem {
  kind: KpiKind
  label: string
  value: string
  delta: number | null
  sub?: string
  accent: boolean
}

export interface MonthPoint {
  label: string
  total: number
}

export interface CampaignSummary {
  id: string
  name: string
  goal: number | null
  raised: number
  percent: number
}

export interface RecentDonationItem {
  id: string
  amount: number
  status: string
  donatedAt: Date
  contactName: string
  campaignName: string | null
}

export interface DashboardViewModel {
  organizationName: string
  kpis: KpiItem[]
  /** Donors needing attention, sorted by priority, capped at 6 (the max ever rendered). */
  needAttention: AttentionDonor[]
  /** Count + dollar total across ALL non-active donors, not just the capped/rendered slice above. */
  attentionCount: number
  atStakeTotal: number
  months: MonthPoint[]
  campaigns: CampaignSummary[]
  recentDonations: RecentDonationItem[]
}

export function greetingFor(now: Date): string {
  return now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening'
}

export function dateStrFor(now: Date): string {
  return now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

/**
 * Pure function of (prisma, organizationId, now) — deliberately does NOT call
 * requireAuth()/auth()/getPrismaWithRLS(). It has no session concept at all;
 * both the authenticated dashboard and the public /demo page resolve their
 * own organizationId (session-derived vs. hardcoded demo org) and pass it in
 * as a TrustedOrgId, which is the only thing this function ever trusts.
 *
 * Field selection is deliberately explicit everywhere — Donation carries
 * internal fields (fraudScore, reviewStatus, idempotencyKey, notes, ...)
 * that must never be serialized to a public page.
 */
export async function buildDashboardViewModel(
  prisma: PrismaClient,
  organizationId: TrustedOrgId,
  opts?: { now?: Date }
): Promise<DashboardViewModel> {
  const now = opts?.now ?? new Date()
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const startOfChartWindow = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  const [org, totalAgg, thisMonthAgg, lastMonthAgg, donorStatsRaw, chartDonations, campaignsRaw, recentDonationsRaw] =
    await Promise.all([
      prisma.organization.findUnique({ where: { id: organizationId }, select: { name: true } }),
      prisma.donation.aggregate({
        where: { organizationId, status: 'COMPLETED' },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.donation.aggregate({
        where: { organizationId, status: 'COMPLETED', donatedAt: { gte: startOfThisMonth } },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.donation.aggregate({
        where: {
          organizationId, status: 'COMPLETED',
          donatedAt: { gte: startOfLastMonth, lt: startOfThisMonth },
        },
        _sum: { amount: true },
        _count: true,
      }),
      // Aggregated per-donor stats via groupBy — avoids fetching every contact
      // with every one of their donation rows (unbounded at org scale, and a
      // public route has no natural traffic ceiling the way authenticated
      // staff usage does).
      prisma.donation.groupBy({
        by: ['contactId'],
        where: { organizationId, status: 'COMPLETED' },
        _sum: { amount: true },
        _max: { donatedAt: true },
        _count: { _all: true },
      }),
      // Bounded by the 6-month chart window, not by all-time donation volume.
      prisma.donation.findMany({
        where: { organizationId, status: 'COMPLETED', donatedAt: { gte: startOfChartWindow } },
        select: { amount: true, donatedAt: true },
      }),
      prisma.campaign.findMany({
        where: { organizationId, status: 'ACTIVE' },
        orderBy: { raised: 'desc' },
        take: 4,
        select: { id: true, name: true, goal: true, raised: true },
      }),
      prisma.donation.findMany({
        where: { organizationId },
        take: 6,
        orderBy: { donatedAt: 'desc' },
        select: {
          id: true, amount: true, status: true, donatedAt: true,
          contact: { select: { firstName: true, lastName: true } },
          campaign: { select: { name: true } },
        },
      }),
    ])

  const totalRaised = totalAgg._sum?.amount || 0
  const totalGifts = totalAgg._count || 0
  const thisMonthRaised = thisMonthAgg._sum?.amount || 0
  const lastMonthRaised = lastMonthAgg._sum?.amount || 0
  const revenueDelta = lastMonthRaised > 0
    ? Math.round(((thisMonthRaised - lastMonthRaised) / lastMonthRaised) * 100)
    : (thisMonthRaised > 0 ? 100 : 0)

  // ---- Donor intelligence, computed off the aggregated groupBy rows (no per-donation hydration) ----
  // scoreDonor's aggregate path is used deliberately: cadence and trend need every
  // gift date, and hydrating the whole donation table to compute them for a list
  // that renders six rows is not worth it. Per-donor pages pass the full history.
  type DonorStat = Omit<AttentionDonor, 'name' | 'email' | 'initials'>
  const donorStats: DonorStat[] = donorStatsRaw.map((row) => {
    const s = scoreDonor(
      { count: row._count._all, lifetime: row._sum.amount ?? 0, lastGift: row._max.donatedAt ?? null },
      { now }
    )
    return {
      contactId: row.contactId,
      lifetime: s.lifetime, lastGift: s.lastGift, count: s.count,
      monthsSince: s.monthsSince, status: s.status, suggestion: s.suggestion, atStake: s.atStake,
    }
  })

  const activeDonorCount = donorStats.length
  const avgGift = totalGifts > 0 ? totalRaised / totalGifts : 0
  const repeatDonors = donorStats.filter((d) => d.count > 1).length
  const retention = activeDonorCount > 0 ? Math.round((repeatDonors / activeDonorCount) * 100) : 0

  // Ranked purely by dollars at stake. Status is already weighted into atStake
  // via its multipliers, so sorting by status first double-counts it — and lets
  // a $425 lapse risk outrank a $10,000 donor who just went quiet.
  const needAttentionStats = donorStats
    .filter((d) => d.status !== 'Active')
    .sort((a, b) => b.atStake - a.atStake || STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status])

  const attentionCount = needAttentionStats.length
  const atStakeTotal = needAttentionStats.reduce((s, d) => s + d.atStake, 0)

  // Only fetch Contact name/email for the handful of donors actually rendered.
  const renderedIds = needAttentionStats.slice(0, 6).map((d) => d.contactId)
  const renderedContacts = renderedIds.length
    ? await prisma.contact.findMany({
        where: { id: { in: renderedIds } },
        select: { id: true, firstName: true, lastName: true, email: true },
      })
    : []
  const contactById = new Map(renderedContacts.map((c) => [c.id, c]))

  const needAttention: AttentionDonor[] = needAttentionStats.slice(0, 6).map((d) => {
    const c = contactById.get(d.contactId)
    const firstName = c?.firstName ?? ''
    const lastName = c?.lastName ?? ''
    return {
      ...d,
      name: `${firstName} ${lastName}`.trim() || 'Unknown donor',
      email: c?.email ?? '',
      initials: ((firstName[0] ?? '') + (lastName[0] ?? '')).toUpperCase(),
    }
  })

  // ---- Giving over time (last 6 months), bucketed from the bounded chart query ----
  const months: MonthPoint[] = []
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    let total = 0
    for (const d of chartDonations) {
      if (d.donatedAt >= start && d.donatedAt < end) total += d.amount
    }
    months.push({ label: start.toLocaleString('en-US', { month: 'short' }), total })
  }

  const kpis: KpiItem[] = [
    { kind: 'raisedThisYear', label: 'Raised this year', value: money(totalRaised), delta: revenueDelta, accent: true },
    { kind: 'activeDonors', label: 'Active donors', value: activeDonorCount.toLocaleString(), delta: null, sub: `${totalGifts} gifts all-time`, accent: false },
    { kind: 'avgGift', label: 'Average gift', value: money(avgGift), delta: null, sub: 'across completed gifts', accent: false },
    { kind: 'retention', label: 'Donor retention', value: `${retention}%`, delta: null, sub: `${repeatDonors} repeat donors`, accent: false },
  ]

  const campaigns: CampaignSummary[] = campaignsRaw.map((c) => ({
    id: c.id,
    name: c.name,
    goal: c.goal,
    raised: c.raised,
    percent: c.goal && c.goal > 0 ? Math.min((c.raised / c.goal) * 100, 100) : 0,
  }))

  const recentDonations: RecentDonationItem[] = recentDonationsRaw.map((d) => ({
    id: d.id,
    amount: d.amount,
    status: d.status,
    donatedAt: d.donatedAt,
    contactName: `${d.contact.firstName} ${d.contact.lastName}`,
    campaignName: d.campaign?.name ?? null,
  }))

  return {
    organizationName: org?.name || 'your organization',
    kpis,
    needAttention,
    attentionCount,
    atStakeTotal,
    months,
    campaigns,
    recentDonations,
  }
}
