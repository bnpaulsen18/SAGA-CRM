/**
 * The single source of truth for donor math.
 *
 * Before this module existed there were two disagreeing scoring systems: the
 * dashboard classifier (status buckets + dollars at stake) and
 * `lib/ai/donor-profiles.ts` (a 0-100 additive score). The same donor could be
 * "Lapse risk — personal call" on the dashboard and "Low — send a survey" on the
 * donation page. Both are now derived here, so the screens cannot contradict
 * each other and the four AI agents have one vocabulary to gate on.
 *
 * Deliberately pure: no Prisma, no network, no session. Same input always
 * produces the same output, which makes it testable and free to run.
 *
 * ## Two different questions, two different signals
 *
 * `status` answers **"who should a fundraiser look at today?"** It uses flat
 * thresholds because it is triage — a $10k/year donor who is 7 months quiet is
 * worth a look even though they are on their normal rhythm.
 *
 * `lapsed` answers **"has this donor actually stopped giving?"** It is relative
 * to that donor's *own* giving cadence, because a monthly donor who misses three
 * months has stopped while an annual donor at 14 months has not.
 *
 * These are not the same question and must not share a threshold. A donor can be
 * `Cooling` (flag it) without being `lapsed` (do not send a win-back) — that
 * separation is what keeps Morning Brief and Return Series from both grabbing
 * the same person.
 */

export type DonorStatus = 'Lapse risk' | 'Cooling' | 'New donor' | 'Champion' | 'Active'
export type EngagementLevel = 'High' | 'Medium' | 'Low' | 'At risk'
export type GiftTrend = 'increasing' | 'decreasing' | 'stable' | 'insufficient data'

export interface Gift {
  amount: number
  donatedAt: Date
}

/**
 * Either supply `gifts` (full detail — unlocks cadence, trend and richer
 * reasons) or the three aggregates (the cheap path the dashboard uses, where
 * hydrating every donation to compute four numbers would be wasteful).
 * When `gifts` is present the aggregates are recomputed from it, so a caller
 * cannot pass an inconsistent pair.
 */
export interface DonorFacts {
  count?: number
  lifetime?: number
  lastGift?: Date | null
  gifts?: Gift[]
}

export interface ScoringThresholds {
  championLifetime: number
  championRecencyMonths: number
  newDonorMonths: number
  /** Flat lapse cut used for `status`, and the fallback when cadence is unknown. */
  lapseFloorMonths: number
  coolingMonths: number
  /** Grace added to a donor's own cadence before they count as lapsed. */
  cadenceGraceMonths: number
  cadenceGraceRatio: number
  majorGiftMinGifts: number
  majorGiftRecencyMonths: number
  majorGiftTrendRatio: number
  /** Above this lifetime, Return Series escalates to a person instead of emailing. */
  humanEscalationLifetime: number
}

/** Defaults. Per-organization overrides belong on `Organization` — see docs/SagaAgents.md §8. */
export const DEFAULT_THRESHOLDS: ScoringThresholds = {
  championLifetime: 10000,
  championRecencyMonths: 6,
  newDonorMonths: 2,
  lapseFloorMonths: 12,
  coolingMonths: 6,
  cadenceGraceMonths: 2,
  cadenceGraceRatio: 0.5,
  majorGiftMinGifts: 3,
  majorGiftRecencyMonths: 6,
  majorGiftTrendRatio: 1.5,
  humanEscalationLifetime: 2000,
}

export interface DonorSignal {
  count: number
  lifetime: number
  average: number
  largest: number
  lastGift: Date | null
  monthsSince: number

  /** Triage bucket — drives the dashboard and Morning Brief ranking. */
  status: DonorStatus
  suggestion: string
  atStake: number

  /** Median months between gifts. Null with fewer than 2 gifts. */
  cadenceMonths: number | null
  /** How far past their own rhythm they are. >1 means overdue. Null without cadence. */
  overdueRatio: number | null
  /** The cadence-aware cut this donor is measured against. */
  lapseThresholdMonths: number
  /** Has actually stopped giving, relative to their own rhythm. Return Series gates on this. */
  lapsed: boolean
  /** Lapsed AND valuable enough that a person should call instead of the agent emailing. */
  needsHumanOutreach: boolean

  trend: GiftTrend
  /** Last gift vs. the average of all prior gifts. Null with fewer than 2 gifts. */
  trendRatio: number | null
  /** Passes all three Major-Gift Signal gates: depth, recency, trajectory. */
  majorGiftSignal: boolean

  engagement: { score: number; level: EngagementLevel }
  /** Plain-language explanation of what drove the above. Agents use this for "why now". */
  reasons: string[]
}

const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30.44

function monthsBetween(from: Date, to: Date): number {
  return (to.getTime() - from.getTime()) / MS_PER_MONTH
}

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

/**
 * Trend over non-overlapping windows.
 *
 * The previous implementation compared `slice(0, 3)` against `slice(-3)`, which
 * for a donor with exactly 3 gifts is the *same three gifts* — so every 3-gift
 * donor was reported as "stable" no matter what their giving did. Taking
 * k = floor(n/2) capped at 3 guarantees the windows never overlap.
 */
function computeTrend(sortedDesc: Gift[]): GiftTrend {
  const n = sortedDesc.length
  const k = Math.min(3, Math.floor(n / 2))
  if (k === 0) return 'insufficient data'
  const mean = (xs: Gift[]) => xs.reduce((s, g) => s + g.amount, 0) / xs.length
  const recent = mean(sortedDesc.slice(0, k))
  const older = mean(sortedDesc.slice(n - k))
  if (recent > older * 1.1) return 'increasing'
  if (recent < older * 0.9) return 'decreasing'
  return 'stable'
}

/**
 * Score one donor. `now` is injectable so tests and the seed reporter can pin time.
 */
export function scoreDonor(
  facts: DonorFacts,
  opts?: { now?: Date; thresholds?: Partial<ScoringThresholds> }
): DonorSignal {
  const now = opts?.now ?? new Date()
  const t = { ...DEFAULT_THRESHOLDS, ...opts?.thresholds }

  const gifts = facts.gifts ? [...facts.gifts].sort((a, b) => +b.donatedAt - +a.donatedAt) : null

  const count = gifts ? gifts.length : (facts.count ?? 0)
  const lifetime = gifts ? gifts.reduce((s, g) => s + g.amount, 0) : (facts.lifetime ?? 0)
  const lastGift = gifts ? (gifts[0]?.donatedAt ?? null) : (facts.lastGift ?? null)
  const largest = gifts ? gifts.reduce((m, g) => Math.max(m, g.amount), 0) : 0
  const average = count > 0 ? lifetime / count : 0
  // 999 keeps a donor with no gifts out of every recency window rather than
  // making them look maximally recent.
  const monthsSince = lastGift ? monthsBetween(lastGift, now) : 999

  // ---- Triage bucket (flat thresholds — see the header note) ----
  let status: DonorStatus = 'Active'
  let suggestion = 'Send impact update'
  let atStake = average
  if (count === 1 && monthsSince < t.newDonorMonths) {
    status = 'New donor'; suggestion = 'Start welcome series'; atStake = average * 4
  } else if (lifetime >= t.championLifetime && monthsSince < t.championRecencyMonths) {
    status = 'Champion'; suggestion = 'Invite to upgrade'; atStake = average * 2
  } else if (monthsSince >= t.lapseFloorMonths) {
    status = 'Lapse risk'; suggestion = 'Personal call'; atStake = average * 1.5
  } else if (monthsSince >= t.coolingMonths) {
    status = 'Cooling'; suggestion = 'Re-engage with story'; atStake = average
  }

  // ---- Cadence-relative lapse (the donor's own rhythm) ----
  let cadenceMonths: number | null = null
  if (gifts && gifts.length >= 2) {
    const intervals: number[] = []
    for (let i = 0; i < gifts.length - 1; i++) {
      intervals.push(monthsBetween(gifts[i + 1].donatedAt, gifts[i].donatedAt))
    }
    cadenceMonths = median(intervals)
  }

  // A monthly donor (cadence 1) lapses at ~3 months; an annual donor (cadence 12)
  // at ~18. A single multiplier cannot express both, so the grace is the larger
  // of a proportional share and an absolute floor.
  const lapseThresholdMonths = cadenceMonths
    ? cadenceMonths + Math.max(cadenceMonths * t.cadenceGraceRatio, t.cadenceGraceMonths)
    : t.lapseFloorMonths
  const overdueRatio = cadenceMonths ? monthsSince / cadenceMonths : null
  // Single-gift donors have no rhythm to be measured against, so they fall back
  // to the flat cut rather than counting as lapsed the moment they are overdue.
  const lapsed = count > 0 && monthsSince >= lapseThresholdMonths
  const needsHumanOutreach = lapsed && lifetime >= t.humanEscalationLifetime

  // ---- Trajectory ----
  const trend: GiftTrend = gifts ? computeTrend(gifts) : 'insufficient data'
  let trendRatio: number | null = null
  if (gifts && gifts.length >= 2) {
    const priorAvg = (lifetime - gifts[0].amount) / (gifts.length - 1)
    trendRatio = priorAvg > 0 ? gifts[0].amount / priorAvg : null
  }
  const majorGiftSignal =
    count >= t.majorGiftMinGifts &&
    monthsSince <= t.majorGiftRecencyMonths &&
    trendRatio !== null &&
    trendRatio >= t.majorGiftTrendRatio

  // ---- Engagement (0-100) ----
  let score = 0
  if (count >= 12) score += 30
  else if (count >= 6) score += 25
  else if (count >= 3) score += 20
  else if (count >= 2) score += 15
  else if (count >= 1) score += 10

  if (monthsSince <= 1) score += 25
  else if (monthsSince <= 3) score += 20
  else if (monthsSince <= 6) score += 15
  else if (monthsSince <= 12) score += 10
  else score += 5

  if (lifetime >= 10000) score += 20
  else if (lifetime >= 5000) score += 15
  else if (lifetime >= 1000) score += 10
  else if (lifetime >= 100) score += 5

  if (trend === 'increasing') score += 15
  else if (trend === 'stable' || trend === 'insufficient data') score += 10
  else score += 5

  let level: EngagementLevel =
    score >= 80 ? 'High' : score >= 60 ? 'Medium' : score >= 40 ? 'Low' : 'At risk'

  // Structural guarantee that the two screens can never disagree: a donor the
  // dashboard is calling a lapse risk must not read as engaged anywhere else.
  if (status === 'Lapse risk') level = 'At risk'
  else if (status === 'Cooling' && (level === 'High' || level === 'Medium')) level = 'Low'

  // ---- Why ----
  const reasons: string[] = []
  const round = (n: number) => Math.round(n)
  if (count === 0) {
    reasons.push('No completed gifts on file')
  } else {
    if (status === 'New donor') reasons.push('First gift landed within the last two months')
    if (status === 'Champion') reasons.push(`Lifetime giving over $${t.championLifetime.toLocaleString('en-US')} and gave recently`)
    if (count >= 5) reasons.push(`Loyal donor — ${count} gifts on file`)
    if (trend === 'increasing') reasons.push('Gifts are getting larger over time')
    if (trend === 'decreasing') reasons.push('Gifts are getting smaller over time')
    if (majorGiftSignal && trendRatio) {
      reasons.push(`Last gift was ${trendRatio.toFixed(1)}x their prior average`)
    }
    if (cadenceMonths) {
      reasons.push(`Typically gives about every ${round(cadenceMonths)} month${round(cadenceMonths) === 1 ? '' : 's'}`)
    }
    if (lapsed) {
      reasons.push(
        cadenceMonths
          ? `${round(monthsSince)} months quiet — past their usual ${round(cadenceMonths)}-month rhythm`
          : `${round(monthsSince)} months since their last gift`
      )
    } else if (status === 'Cooling') {
      reasons.push(`${round(monthsSince)} months quiet, but still within their normal giving rhythm`)
    }
    if (needsHumanOutreach) {
      reasons.push('Too valuable for an automated win-back — route to a person')
    }
  }

  return {
    count, lifetime, average, largest, lastGift, monthsSince,
    status, suggestion, atStake,
    cadenceMonths, overdueRatio, lapseThresholdMonths, lapsed, needsHumanOutreach,
    trend, trendRatio, majorGiftSignal,
    engagement: { score, level },
    reasons,
  }
}

/** Ranking order for the dashboard's "needs attention" list and Morning Brief. */
export const STATUS_PRIORITY: Record<DonorStatus, number> = {
  'Lapse risk': 0, Cooling: 1, Champion: 2, 'New donor': 3, Active: 4,
}

/** UI accents, kept next to the statuses they describe so they cannot drift apart. */
export const STATUS_COLORS: Record<DonorStatus, { color: string; bg: string }> = {
  'Lapse risk': { color: '#C0573F', bg: '#F6EBE6' },
  Cooling: { color: '#B7791F', bg: '#F7EFD9' },
  'New donor': { color: '#5B4B8A', bg: '#EEE9F5' },
  Champion: { color: '#2E7D5B', bg: '#E6F3EE' },
  Active: { color: '#4A7BD9', bg: '#E8EEFB' },
}

export const ENGAGEMENT_COLORS: Record<EngagementLevel, string> = {
  High: '#2E7D5B', Medium: '#B7791F', Low: '#C77A3F', 'At risk': '#C0573F',
}
