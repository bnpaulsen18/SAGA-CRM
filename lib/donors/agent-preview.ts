import type { PrismaClient } from '@prisma/client'
import { scoreDonor, STATUS_PRIORITY, type DonorSignal } from './scoring'
import type { AgentKey } from './agent-catalog'

/**
 * Computes what each agent *would* do right now, against the organization's real
 * donor file. None of the agents are built — this is the selection logic they
 * will gate on, run live so the agent pages show something true instead of a
 * screenshot.
 *
 * Deliberately mirrors buildDashboardViewModel's contract: takes a prisma client
 * and an organizationId the caller has already established, never resolves a
 * session itself.
 */

export interface AgentPreviewRow {
  contactId: string
  name: string
  /** The number that earns this donor a place on the list. */
  headline: string
  /** Why the agent picked them. */
  detail: string
  /** Optional second-tier grouping, e.g. Return Series' automated vs escalated split. */
  group?: string
}

export interface AgentPreview {
  rows: AgentPreviewRow[]
  /** Donors the agent deliberately left alone, and why — the controls. */
  silent: AgentPreviewRow[]
  totalDonors: number
}

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US')
const mo = (n: number) => {
  if (n < 1) {
    const d = Math.max(1, Math.round(n * 30.44))
    return `${d} day${d === 1 ? '' : 's'}`
  }
  const m = Math.round(n)
  return `${m} month${m === 1 ? '' : 's'}`
}

export async function buildAgentPreview(
  prisma: PrismaClient,
  organizationId: string,
  agent: AgentKey,
  opts?: { now?: Date; limit?: number }
): Promise<AgentPreview> {
  const now = opts?.now ?? new Date()
  const limit = opts?.limit ?? 8

  // One query for every completed gift, grouped in memory. Cadence and trend
  // need each gift's date, so the dashboard's groupBy aggregate is not enough
  // here — but a single flat read is still cheaper than per-donor queries.
  const donations = await prisma.donation.findMany({
    where: { organizationId, status: 'COMPLETED' },
    select: { contactId: true, amount: true, donatedAt: true },
  })

  const byContact = new Map<string, { amount: number; donatedAt: Date }[]>()
  for (const d of donations) {
    if (!d.contactId) continue
    const list = byContact.get(d.contactId)
    if (list) list.push({ amount: d.amount, donatedAt: d.donatedAt })
    else byContact.set(d.contactId, [{ amount: d.amount, donatedAt: d.donatedAt }])
  }

  const scored: { contactId: string; s: DonorSignal }[] = []
  for (const [contactId, gifts] of byContact) {
    scored.push({ contactId, s: scoreDonor({ gifts }, { now }) })
  }

  let picked: { contactId: string; s: DonorSignal; group?: string }[] = []
  let silentPicked: { contactId: string; s: DonorSignal }[] = []

  switch (agent) {
    case 'morning-brief':
      // Same ranking as the dashboard: dollars at stake, which already carries
      // the status weighting through its multipliers.
      picked = scored
        .filter((r) => r.s.status !== 'Active')
        .sort((a, b) =>
          b.s.atStake - a.s.atStake || STATUS_PRIORITY[a.s.status] - STATUS_PRIORITY[b.s.status])
        .slice(0, 3)
      break

    case 'major-gift-signal':
      picked = scored
        .filter((r) => r.s.majorGiftSignal)
        .sort((a, b) => (b.s.trendRatio ?? 0) - (a.s.trendRatio ?? 0))
        .slice(0, limit)
      // The controls: loyal, healthy donors the gates correctly ignore.
      silentPicked = scored
        .filter((r) => !r.s.majorGiftSignal && !r.s.lapsed && r.s.count >= 3)
        .sort((a, b) => b.s.count - a.s.count)
        .slice(0, 3)
      break

    case 'welcome-series':
      picked = scored
        .filter((r) => r.s.status === 'New donor')
        .sort((a, b) => a.s.monthsSince - b.s.monthsSince)
        .slice(0, limit)
      break

    case 'return-series': {
      const lapsed = scored.filter((r) => r.s.lapsed)
      picked = [
        ...lapsed.filter((r) => !r.s.needsHumanOutreach)
          .sort((a, b) => b.s.lifetime - a.s.lifetime)
          .map((r) => ({ ...r, group: 'Automated win-back' })),
        ...lapsed.filter((r) => r.s.needsHumanOutreach)
          .sort((a, b) => b.s.lifetime - a.s.lifetime)
          .map((r) => ({ ...r, group: 'Escalated to a person' })),
      ].slice(0, limit)
      // Quiet but on-rhythm — the donors a flat threshold would wrongly email.
      silentPicked = scored
        .filter((r) => !r.s.lapsed && r.s.monthsSince >= 6)
        .sort((a, b) => b.s.lifetime - a.s.lifetime)
        .slice(0, 3)
      break
    }
  }

  // Names only for the handful actually rendered.
  const ids = Array.from(new Set([...picked, ...silentPicked].map((r) => r.contactId)))
  const contacts = ids.length
    ? await prisma.contact.findMany({
        where: { id: { in: ids }, organizationId },
        select: { id: true, firstName: true, lastName: true },
      })
    : []
  const nameOf = new Map(contacts.map((c) => [c.id, `${c.firstName} ${c.lastName}`]))

  const describe = (s: DonorSignal): { headline: string; detail: string } => {
    switch (agent) {
      case 'morning-brief':
        return {
          headline: `${money(s.atStake)} at stake`,
          detail: `${s.status} · ${mo(s.monthsSince)} quiet · ${s.suggestion}`,
        }
      case 'major-gift-signal':
        return {
          headline: `${(s.trendRatio ?? 0).toFixed(1)}x their prior average`,
          detail: `${money(s.lifetime)} lifetime across ${s.count} gifts · last gift ${mo(s.monthsSince)} ago`,
        }
      case 'welcome-series':
        return {
          headline: `First gift ${mo(s.monthsSince)} ago`,
          detail: `${money(s.lifetime)} · three touches over the next 30 days`,
        }
      case 'return-series':
        return {
          headline: `${money(s.lifetime)} lifetime`,
          detail: s.cadenceMonths
            ? `${mo(s.monthsSince)} quiet · normally gives every ${mo(s.cadenceMonths)}`
            : `${mo(s.monthsSince)} quiet`,
        }
    }
  }

  const describeSilent = (s: DonorSignal): { headline: string; detail: string } =>
    agent === 'return-series'
      ? {
          headline: `${mo(s.monthsSince)} quiet — but not lapsed`,
          detail: s.cadenceMonths
            ? `Gives every ${mo(s.cadenceMonths)}, so they are still on schedule. A flat 12-month rule would have emailed them.`
            : 'Not enough history to call them lapsed.',
        }
      : {
          headline: `${s.count} gifts · ${(s.trendRatio ?? 0).toFixed(1)}x`,
          detail: `${money(s.lifetime)} lifetime · loyal but not accelerating, so the trajectory gate correctly passes them over.`,
        }

  return {
    rows: picked.map((r) => ({
      contactId: r.contactId,
      name: nameOf.get(r.contactId) ?? 'Unknown donor',
      group: r.group,
      ...describe(r.s),
    })),
    silent: silentPicked.map((r) => ({
      contactId: r.contactId,
      name: nameOf.get(r.contactId) ?? 'Unknown donor',
      ...describeSilent(r.s),
    })),
    totalDonors: scored.length,
  }
}
