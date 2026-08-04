import SagaCard from '@/components/ui/saga-card'
import { TrendUp, TrendDown, ArrowRight, Minus } from '@phosphor-icons/react/dist/ssr'
import { ENGAGEMENT_COLORS, STATUS_COLORS, type DonorSignal } from '@/lib/donors/scoring'

/**
 * Engagement Score + Donor Intelligence, rendered from a single DonorSignal so
 * the donor page and the donation page can never show different verdicts for the
 * same person.
 *
 * Everything here is computed arithmetic — deliberately not labelled "AI".
 * The panel this replaced was titled "AI Donor Intelligence" but rendered the
 * *fallback* branch of an AI call that always failed (no ANTHROPIC_API_KEY), so
 * every donor got the same canned "consider reaching out during their typical
 * giving season". These values are real. When the agents ship, the AI layer adds
 * narrative on top of these numbers rather than replacing them.
 */

const barFor = (level: string) =>
  level === 'High' ? 'linear-gradient(90deg,#4A8C6F,#2E7D5B)'
  : level === 'Medium' ? 'linear-gradient(90deg,#E8A33D,#B7791F)'
  : level === 'Low' ? 'linear-gradient(90deg,#E0875A,#C77A3F)'
  : 'linear-gradient(90deg,#D97757,#C0573F)'

const labelCls = 'text-xs font-medium text-[var(--ink-faint)] uppercase tracking-wide'

function frequencyLabel(s: DonorSignal): string {
  if (s.count === 0) return 'No gifts yet'
  if (s.count === 1) return 'One-time so far'
  const c = s.cadenceMonths
  if (!c) return 'Irregular'
  if (c <= 1.5) return 'Monthly'
  if (c <= 4) return 'Quarterly'
  if (c <= 7) return 'Twice a year'
  if (c <= 14) return 'Annually'
  return 'Irregular'
}

/** Round to a figure a fundraiser would actually ask for. */
function niceAsk(n: number): number {
  if (n < 100) return Math.max(25, Math.round(n / 25) * 25)
  if (n < 1000) return Math.round(n / 50) * 50
  if (n < 10000) return Math.round(n / 100) * 100
  return Math.round(n / 500) * 500
}

function suggestedAsk(s: DonorSignal): number | null {
  if (s.count === 0) return null
  // A donor whose gifts are growing has already shown their ceiling is higher
  // than their average; anchor on the largest instead.
  const base = s.trend === 'increasing' ? s.largest * 1.25 : s.average * 1.2
  return niceAsk(base)
}

function nextGiftLine(s: DonorSignal): string {
  if (s.count === 0 || !s.lastGift) return 'No giving history yet'
  if (!s.cadenceMonths) return 'Not enough history to predict a rhythm'
  const months = Math.round(s.cadenceMonths)
  const due = new Date(s.lastGift)
  due.setMonth(due.getMonth() + months)
  const overdueMonths = Math.round(s.monthsSince - s.cadenceMonths)
  if (overdueMonths > 0) {
    return `Was due around ${due.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} — about ${overdueMonths} month${overdueMonths === 1 ? '' : 's'} overdue`
  }
  return `Around ${due.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}, based on their ${months}-month rhythm`
}

function TrendIcon({ trend }: { trend: DonorSignal['trend'] }) {
  if (trend === 'increasing') return <TrendUp size={18} weight="bold" className="text-[#4A8C6F]" />
  if (trend === 'decreasing') return <TrendDown size={18} weight="bold" className="text-[#C0573F]" />
  if (trend === 'stable') return <ArrowRight size={18} weight="bold" className="text-[#5B4B8A]" />
  return <Minus size={18} weight="bold" className="text-[var(--ink-faint)]" />
}

export function EngagementScoreCard({ signal }: { signal: DonorSignal }) {
  const { engagement, status, suggestion, reasons } = signal
  const statusColor = STATUS_COLORS[status]

  return (
    <SagaCard title="Engagement Score">
      <div className="text-center mb-4">
        <div
          className="text-5xl font-bold mb-2 tabular-nums"
          style={{ color: ENGAGEMENT_COLORS[engagement.level] }}
        >
          {engagement.score}
        </div>
        <div className="text-lg text-[var(--ink)] font-medium">{engagement.level} engagement</div>
      </div>

      <div
        className="w-full bg-[var(--surface-2)] rounded-full h-3 overflow-hidden mb-5"
        role="img"
        aria-label={`Engagement score ${engagement.score} out of 100`}
      >
        <div className="h-full" style={{ width: `${engagement.score}%`, background: barFor(engagement.level) }} />
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: statusColor.bg, color: statusColor.color, border: `1px solid ${statusColor.color}33` }}
        >
          {status}
        </span>
        <span className="text-sm text-[var(--ink)] font-medium">{suggestion}</span>
      </div>

      {reasons.length > 0 && (
        <div>
          <h4 className={`${labelCls} mb-2`}>Why</h4>
          <ul className="space-y-1.5">
            {reasons.map((r, i) => (
              <li key={i} className="text-sm text-[var(--ink-soft)] flex gap-2">
                <span className="text-[#E0507A] flex-shrink-0">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </SagaCard>
  )
}

export function DonorIntelligenceCard({ signal, funds = [] }: { signal: DonorSignal; funds?: string[] }) {
  const ask = suggestedAsk(signal)

  return (
    <SagaCard title="Donor Intelligence">
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Giving Frequency</label>
          <p className="text-[var(--ink)] mt-1">{frequencyLabel(signal)}</p>
        </div>

        <div>
          <label className={labelCls}>Gift Trend</label>
          <p className="text-[var(--ink)] mt-1 capitalize flex items-center gap-2">
            {signal.trend}
            <TrendIcon trend={signal.trend} />
          </p>
        </div>

        <div>
          <label className={labelCls}>Next Gift Expected</label>
          <p className="text-[var(--ink-soft)] text-sm mt-1">{nextGiftLine(signal)}</p>
        </div>

        {ask !== null && (
          <div>
            <label className={labelCls}>Suggested Ask</label>
            <p className="text-xl font-bold text-[#4A8C6F] mt-1 tabular-nums">
              ${ask.toLocaleString('en-US')}
            </p>
            <p className="text-xs text-[var(--ink-faint)] mt-1">
              {signal.trend === 'increasing' ? 'Based on their largest gift and rising trend' : 'Based on their average gift'}
            </p>
          </div>
        )}

        {funds.length > 0 && (
          <div>
            <label className={`${labelCls} mb-2 block`}>Funds Supported</label>
            <div className="flex flex-wrap gap-2">
              {funds.map((f) => (
                <span
                  key={f}
                  className="px-2 py-1 rounded text-xs"
                  style={{ background: '#EEE9F5', color: '#5B4B8A', border: '1px solid #DDD3EC' }}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-[var(--ink-faint)] pt-2 border-t border-[var(--line)]">
          Calculated from this donor&rsquo;s giving history. AI-written narrative arrives with the agents.
        </p>
      </div>
    </SagaCard>
  )
}
