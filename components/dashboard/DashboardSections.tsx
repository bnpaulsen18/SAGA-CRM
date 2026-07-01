import Link from 'next/link'
import {
  TrendUp, TrendDown, Sparkle, ArrowRight, Users, CurrencyDollar, Gift, Heart,
} from '@phosphor-icons/react/dist/ssr'
import {
  money, money2, type DashboardViewModel, type KpiKind, type AttentionDonor, type DonorStatus,
} from '@/lib/dashboard/build-dashboard-viewmodel'

export const sunset = 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)'
export const bricolage = { fontFamily: 'var(--font-bricolage), sans-serif' } as const

export const statusStyle: Record<DonorStatus, { color: string; bg: string }> = {
  'Lapse risk': { color: '#C0573F', bg: '#F6EBE6' },
  Cooling: { color: '#B7791F', bg: '#F7EFD9' },
  'New donor': { color: '#5B4B8A', bg: '#EEE9F5' },
  Champion: { color: '#2E7D5B', bg: '#E6F3EE' },
  Active: { color: 'var(--ink-soft)', bg: 'var(--surface-2)' },
}

const kpiIcon: Record<KpiKind, typeof CurrencyDollar> = {
  raisedThisYear: CurrencyDollar,
  activeDonors: Users,
  avgGift: Gift,
  retention: Heart,
}

/** Resolves where an interactive element should point. Real dashboard passes real
 *  authenticated hrefs; /demo passes a resolver that always sends visitors to /register
 *  instead of a deep link that would just bounce them to /login. */
export type LinkFor = (
  kind: 'contact' | 'contacts' | 'campaign' | 'campaigns' | 'donation' | 'donations' | 'reports',
  id?: string
) => string

export function KpiGrid({ kpis }: { kpis: DashboardViewModel['kpis'] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((k) => {
        const Icon = kpiIcon[k.kind]
        return (
          <div key={k.label} className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[var(--ink-soft)]">{k.label}</span>
              <Icon size={20} weight="bold" className={k.accent ? 'text-[#E0507A]' : 'text-[var(--ink-faint)]'} />
            </div>
            <div className="text-3xl font-bold text-[var(--ink)] tabular-nums" style={bricolage}>{k.value}</div>
            <div className="mt-2 flex items-center gap-2">
              {k.delta !== null && (
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md"
                  style={k.delta >= 0 ? { color: '#2E7D5B', background: '#E6F3EE' } : { color: '#C0573F', background: '#F6EBE6' }}
                >
                  {k.delta >= 0 ? <TrendUp size={12} weight="bold" /> : <TrendDown size={12} weight="bold" />}
                  {Math.abs(k.delta)}% vs last month
                </span>
              )}
              {k.sub && <span className="text-xs text-[var(--ink-faint)]">{k.sub}</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DonorTile({ donor, linkFor, onSelect, accentGradient }: {
  donor: AttentionDonor
  linkFor?: LinkFor
  onSelect?: (donor: AttentionDonor) => void
  accentGradient: boolean
}) {
  const content = (
    <>
      <div className="flex items-center gap-2 mb-2">
        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: statusStyle[donor.status].color }}>{donor.initials}</span>
        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded text-white" style={{ background: 'rgba(255,255,255,.12)' }}>{donor.status}</span>
      </div>
      <p className="text-white font-semibold text-sm">{donor.suggestion}: {donor.name}</p>
      <p className="text-white/75 text-xs mt-1">
        {donor.count === 1 ? 'First-time donor' : `${money(donor.lifetime)} lifetime`} · {Math.round(donor.monthsSince)}mo since last gift
      </p>
      <p className="text-white/90 text-sm font-semibold mt-2">{money(donor.atStake)}+ at stake →</p>
    </>
  )
  const cls = 'block w-full text-left bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-xl p-4 transition-colors'
  if (onSelect) {
    return <button type="button" onClick={() => onSelect(donor)} className={cls}>{content}</button>
  }
  return <Link href={linkFor ? linkFor('contact', donor.contactId) : '#'} className={cls}>{content}</Link>
}

export function MorningBrief({ vm, linkFor, onDonorSelect }: {
  vm: DashboardViewModel
  linkFor?: LinkFor
  onDonorSelect?: (donor: AttentionDonor) => void
}) {
  const brief = vm.needAttention.slice(0, 3)
  return (
    <div
      className="rounded-2xl p-6 mb-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#1b1020 0%,#2a1330 50%,#1d1633 100%)' }}
    >
      <div className="absolute -top-1/4 -right-[10%] w-[55%] h-[140%] rounded-full" style={{ background: 'radial-gradient(circle,rgba(224,62,92,.28),transparent 62%)' }} />
      <div className="absolute -bottom-1/3 -left-[8%] w-1/2 h-[120%] rounded-full" style={{ background: 'radial-gradient(circle,rgba(155,93,224,.24),transparent 62%)' }} />
      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="inline-flex items-center gap-2 text-[10.5px] font-bold tracking-[0.12em] uppercase text-white/90 bg-white/10 border border-white/15 px-3 py-1.5 rounded-md">
            <Sparkle size={12} weight="fill" className="text-[#F0567A]" />
            Your morning brief
          </div>
          <div className="text-white/70 text-sm">
            <span className="text-white font-semibold">{money(vm.atStakeTotal)}</span> in revenue at stake ·{' '}
            <span className="text-white font-semibold">{vm.attentionCount}</span> actions to review
          </div>
        </div>

        <p style={bricolage} className="text-white text-xl font-semibold leading-snug mb-5 max-w-2xl">
          SAGA turns donor data into the next right action.{' '}
          <span style={{ background: 'linear-gradient(105deg,#FBA94B,#F0567A)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            Here&apos;s where to focus today.
          </span>
        </p>

        {brief.length === 0 ? (
          <p className="text-white/75 text-sm">No donors need attention right now — add donors and gifts to see AI recommendations.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {brief.map((d) => (
              <DonorTile key={d.contactId} donor={d} linkFor={linkFor} onSelect={onDonorSelect} accentGradient={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function GivingChart({ months, linkFor }: { months: DashboardViewModel['months']; linkFor: LinkFor }) {
  const maxMonth = Math.max(...months.map((m) => m.total), 1)
  return (
    <div className="lg:col-span-2 bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 style={bricolage} className="text-lg font-semibold text-[var(--ink)]">Giving over time</h2>
        <Link href={linkFor('reports')} className="text-sm font-medium text-[#5B4B8A] hover:text-[#E0507A] inline-flex items-center gap-1">
          View report <ArrowRight size={14} weight="bold" />
        </Link>
      </div>
      <div className="flex items-end justify-between gap-3 h-40">
        {months.map((m) => (
          <div key={m.label} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full rounded-t-md" style={{ height: `${Math.max((m.total / maxMonth) * 130, 4)}px`, background: sunset }} title={money(m.total)} />
            <span className="text-xs text-[var(--ink-faint)]">{m.label}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-[var(--ink-soft)] mt-4">
        {months[5].total >= months[4].total
          ? `Giving is up this month — ${money(months[5].total)} so far.`
          : `Giving softened this month — a stewardship push could help.`}
      </p>
    </div>
  )
}

export function AttentionTable({ vm, linkFor, onDonorSelect }: {
  vm: DashboardViewModel
  linkFor?: LinkFor
  onDonorSelect?: (donor: AttentionDonor) => void
}) {
  const rows = vm.needAttention.slice(0, 6)
  return (
    <div className="lg:col-span-3 bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)]">
        <div>
          <h2 style={bricolage} className="text-lg font-semibold text-[var(--ink)]">Donors who need you this week</h2>
          <p className="text-sm text-[var(--ink-soft)]">Ranked by lapse risk and lifetime value</p>
        </div>
        <Link href={linkFor ? linkFor('contacts') : '#'} className="text-sm font-medium text-[#5B4B8A] hover:text-[#E0507A] inline-flex items-center gap-1 whitespace-nowrap">
          All donors <ArrowRight size={14} weight="bold" />
        </Link>
      </div>
      {rows.length === 0 ? (
        <div className="p-8 text-center text-[var(--ink-faint)] text-sm">No donors need attention — your portfolio is healthy.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--ink-faint)] border-b border-[var(--line)]">
                <th className="font-medium px-6 py-3">Donor</th>
                <th className="font-medium px-3 py-3 text-right">Lifetime</th>
                <th className="font-medium px-3 py-3">Last gift</th>
                <th className="font-medium px-3 py-3">Status</th>
                <th className="font-medium px-6 py-3">SAGA suggests</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => {
                const nameCell = onDonorSelect ? (
                  <button type="button" onClick={() => onDonorSelect(d)} className="font-medium text-[var(--ink)] hover:text-[#5B4B8A] block truncate text-left">{d.name}</button>
                ) : (
                  <Link href={linkFor ? linkFor('contact', d.contactId) : '#'} className="font-medium text-[var(--ink)] hover:text-[#5B4B8A] block truncate">{d.name}</Link>
                )
                return (
                  <tr key={d.contactId} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--paper)] transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: statusStyle[d.status].color }}>{d.initials}</span>
                        <div className="min-w-0">
                          {nameCell}
                          <span className="text-xs text-[var(--ink-faint)] truncate block">{d.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 font-medium text-[var(--ink)] text-right tabular-nums">{money(d.lifetime)}</td>
                    <td className="px-3 py-3 text-[var(--ink-soft)] whitespace-nowrap">{Math.round(d.monthsSince)}mo ago</td>
                    <td className="px-3 py-3">
                      <span className="text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap" style={{ color: statusStyle[d.status].color, background: statusStyle[d.status].bg }}>{d.status}</span>
                    </td>
                    <td className="px-6 py-3 text-[#5B4B8A] font-medium whitespace-nowrap">{d.suggestion}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function CampaignsPanel({ campaigns, linkFor }: { campaigns: DashboardViewModel['campaigns']; linkFor: LinkFor }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 style={bricolage} className="text-lg font-semibold text-[var(--ink)]">Active campaigns</h2>
        <Link href={linkFor('campaigns')} className="text-sm font-medium text-[#5B4B8A] hover:text-[#E0507A] inline-flex items-center gap-1">
          All <ArrowRight size={14} weight="bold" />
        </Link>
      </div>
      {campaigns.length === 0 ? (
        <p className="text-[var(--ink-faint)] text-sm py-6 text-center">No active campaigns yet.</p>
      ) : (
        <div className="space-y-5">
          {campaigns.map((c) => (
            <Link key={c.id} href={linkFor('campaign', c.id)} className="block group">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-medium text-[var(--ink)] group-hover:text-[#5B4B8A]">{c.name}</span>
                <span className="text-sm text-[var(--ink-soft)]">{money(c.raised)} <span className="text-[var(--ink-faint)]">of {money(c.goal || 0)}</span></span>
              </div>
              <div className="h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${c.percent}%`, background: sunset }} />
              </div>
              <div className="text-xs text-[var(--ink-faint)] mt-1">{c.percent.toFixed(0)}% of goal</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function RecentDonationsPanel({ donations, linkFor }: { donations: DashboardViewModel['recentDonations']; linkFor: LinkFor }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)]">
        <h2 style={bricolage} className="text-lg font-semibold text-[var(--ink)]">Recent donations</h2>
        <Link href={linkFor('donations')} className="text-sm font-medium text-[#5B4B8A] hover:text-[#E0507A] inline-flex items-center gap-1">
          All <ArrowRight size={14} weight="bold" />
        </Link>
      </div>
      {donations.length === 0 ? (
        <p className="text-[var(--ink-faint)] text-sm py-8 text-center">No donations yet.</p>
      ) : (
        <div className="divide-y divide-[var(--line)]">
          {donations.map((d) => (
            <Link key={d.id} href={linkFor('donation', d.id)} className="flex items-center justify-between px-6 py-3 hover:bg-[var(--paper)] transition-colors">
              <div className="min-w-0">
                <p className="font-medium text-[var(--ink)] truncate">{d.contactName}</p>
                <p className="text-xs text-[var(--ink-faint)] truncate">{d.campaignName || 'General Fund'} · {new Date(d.donatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="font-bold text-[var(--ink)] tabular-nums">{money2(d.amount)}</p>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded"
                  style={d.status === 'COMPLETED' ? { color: '#2E7D5B', background: '#E6F3EE' } : d.status === 'PENDING' ? { color: '#B7791F', background: '#F7EFD9' } : { color: '#C0573F', background: '#F6EBE6' }}
                >
                  {d.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
