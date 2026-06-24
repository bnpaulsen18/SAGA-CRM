import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import DashboardLayout from '@/components/DashboardLayout'
import {
  TrendUp, TrendDown, Sparkle, ArrowRight, Users, CurrencyDollar,
  Gift, Heart,
} from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const runtime = 'nodejs'

const money = (n: number) =>
  '$' + Math.round(n).toLocaleString('en-US')
const money2 = (n: number) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const sunset = 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)'
const bricolage = { fontFamily: 'var(--font-bricolage), sans-serif' } as const

export default async function DashboardPage() {
  const session = await requireAuth()

  if (session.user.isPlatformAdmin || !session.user.organizationId) {
    redirect('/admin')
  }
  const organizationId = session.user.organizationId
  const prisma = await getPrismaWithRLS()

  const now = new Date()
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const [org, totalAgg, thisMonthAgg, lastMonthAgg, contacts, campaigns, recentDonations] =
    await Promise.all([
      prisma.organization.findUnique({ where: { id: organizationId }, select: { name: true } }),
      prisma.donation.aggregate({
        where: { organizationId, status: 'COMPLETED' },
        _sum: { amount: true }, _count: true,
      }),
      prisma.donation.aggregate({
        where: { organizationId, status: 'COMPLETED', donatedAt: { gte: startOfThisMonth } },
        _sum: { amount: true }, _count: true,
      }),
      prisma.donation.aggregate({
        where: {
          organizationId, status: 'COMPLETED',
          donatedAt: { gte: startOfLastMonth, lt: startOfThisMonth },
        },
        _sum: { amount: true }, _count: true,
      }),
      prisma.contact.findMany({
        where: { organizationId },
        include: {
          donations: {
            where: { status: 'COMPLETED' },
            select: { amount: true, donatedAt: true },
            orderBy: { donatedAt: 'desc' },
          },
        },
      }),
      prisma.campaign.findMany({
        where: { organizationId, status: 'ACTIVE' },
        orderBy: { raised: 'desc' }, take: 4,
        select: { id: true, name: true, goal: true, raised: true, endDate: true },
      }),
      prisma.donation.findMany({
        where: { organizationId },
        take: 6, orderBy: { donatedAt: 'desc' },
        include: { contact: { select: { firstName: true, lastName: true } }, campaign: { select: { name: true } } },
      }),
    ])

  const totalRaised = totalAgg._sum?.amount || 0
  const totalGifts = totalAgg._count || 0
  const thisMonthRaised = thisMonthAgg._sum?.amount || 0
  const lastMonthRaised = lastMonthAgg._sum?.amount || 0
  const revenueDelta = lastMonthRaised > 0
    ? Math.round(((thisMonthRaised - lastMonthRaised) / lastMonthRaised) * 100)
    : (thisMonthRaised > 0 ? 100 : 0)

  // ---- Donor intelligence (computed from real gifts) ----
  type DonorStatus = 'Lapse risk' | 'Cooling' | 'New donor' | 'Champion' | 'Active'
  type Donor = {
    id: string; name: string; email: string; initials: string
    lifetime: number; lastGift: Date | null; count: number; monthsSince: number
    status: DonorStatus; suggestion: string; atStake: number
  }
  const monthsBetween = (d: Date) => (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24 * 30.4)
  const initialsOf = (f: string, l: string) => ((f?.[0] || '') + (l?.[0] || '')).toUpperCase()

  const donors: Donor[] = contacts
    .filter((c) => c.donations.length > 0)
    .map((c) => {
      const lifetime = c.donations.reduce((s, d) => s + d.amount, 0)
      const lastGift = c.donations[0]?.donatedAt ?? null
      const count = c.donations.length
      const monthsSince = lastGift ? monthsBetween(lastGift) : 999
      const avg = lifetime / Math.max(count, 1)
      let status: DonorStatus = 'Active'
      let suggestion = 'Send impact update'
      let atStake = avg
      if (count === 1 && monthsSince < 2) {
        status = 'New donor'; suggestion = 'Start welcome series'; atStake = avg * 4
      } else if (lifetime >= 10000 && monthsSince < 6) {
        status = 'Champion'; suggestion = 'Invite to upgrade'; atStake = avg * 2
      } else if (monthsSince >= 12) {
        status = 'Lapse risk'; suggestion = 'Personal call'; atStake = avg * 1.5
      } else if (monthsSince >= 6) {
        status = 'Cooling'; suggestion = 'Re-engage with story'; atStake = avg
      }
      return {
        id: c.id, name: `${c.firstName} ${c.lastName}`, email: c.email || '',
        initials: initialsOf(c.firstName, c.lastName), lifetime, lastGift, count, monthsSince,
        status, suggestion, atStake,
      }
    })

  const activeDonorCount = donors.length
  const avgGift = totalGifts > 0 ? totalRaised / totalGifts : 0
  const repeatDonors = donors.filter((d) => d.count > 1).length
  const retention = activeDonorCount > 0 ? Math.round((repeatDonors / activeDonorCount) * 100) : 0

  const priority: Record<DonorStatus, number> = {
    'Lapse risk': 0, Cooling: 1, Champion: 2, 'New donor': 3, Active: 4,
  }
  const needAttention = [...donors]
    .filter((d) => d.status !== 'Active')
    .sort((a, b) => priority[a.status] - priority[b.status] || b.atStake - a.atStake)
  const brief = needAttention.slice(0, 3)
  const atStakeTotal = needAttention.reduce((s, d) => s + d.atStake, 0)

  // ---- Giving over time (last 6 months) ----
  const months: { label: string; total: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    let total = 0
    for (const c of contacts) for (const d of c.donations) {
      if (d.donatedAt >= start && d.donatedAt < end) total += d.amount
    }
    months.push({ label: start.toLocaleString('en-US', { month: 'short' }), total })
  }
  const maxMonth = Math.max(...months.map((m) => m.total), 1)

  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening'
  const firstName = (session.user.name || 'there').split(' ')[0]
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const statusStyle: Record<DonorStatus, { color: string; bg: string }> = {
    'Lapse risk': { color: '#C0573F', bg: '#F6EBE6' },
    Cooling: { color: '#B7791F', bg: '#F7EFD9' },
    'New donor': { color: '#5B4B8A', bg: '#EEE9F5' },
    Champion: { color: '#2E7D5B', bg: '#E6F3EE' },
    Active: { color: 'var(--ink-soft)', bg: 'var(--surface-2)' },
  }

  const kpis = [
    { label: 'Raised this year', value: money(totalRaised), delta: revenueDelta as number | null, sub: undefined as string | undefined, icon: CurrencyDollar, accent: true },
    { label: 'Active donors', value: activeDonorCount.toLocaleString(), delta: null, sub: `${totalGifts} gifts all-time`, icon: Users, accent: false },
    { label: 'Average gift', value: money(avgGift), delta: null, sub: 'across completed gifts', icon: Gift, accent: false },
    { label: 'Donor retention', value: `${retention}%`, delta: null, sub: `${repeatDonors} repeat donors`, icon: Heart, accent: false },
  ]

  return (
    <DashboardLayout
      userName={session.user.name || session.user.email || 'User'}
      userRole={session.user.role}
      searchPlaceholder="Search donors, donations, campaigns..."
    >
      {/* Greeting */}
      <div className="mb-8">
        <h1 style={bricolage} className="text-3xl font-bold text-[var(--ink)]">{greeting}, {firstName}</h1>
        <p className="text-[var(--ink-soft)] mt-1">
          Where {org?.name || 'your organization'} stands today · {dateStr}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => {
          const Icon = k.icon
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

      {/* AI Morning Brief */}
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
              <span className="text-white font-semibold">{money(atStakeTotal)}</span> in revenue at stake ·{' '}
              <span className="text-white font-semibold">{needAttention.length}</span> actions to review
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
                <Link key={d.id} href={`/contacts/${d.id}`} className="block bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-xl p-4 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: statusStyle[d.status].color }}>{d.initials}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded text-white" style={{ background: 'rgba(255,255,255,.12)' }}>{d.status}</span>
                  </div>
                  <p className="text-white font-semibold text-sm">{d.suggestion}: {d.name}</p>
                  <p className="text-white/75 text-xs mt-1">
                    {d.count === 1 ? 'First-time donor' : `${money(d.lifetime)} lifetime`} · {Math.round(d.monthsSince)}mo since last gift
                  </p>
                  <p className="text-white/90 text-sm font-semibold mt-2">{money(d.atStake)}+ at stake →</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Giving over time + Donors needing attention */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 style={bricolage} className="text-lg font-semibold text-[var(--ink)]">Giving over time</h2>
            <Link href="/reports" className="text-sm font-medium text-[#5B4B8A] hover:text-[#E0507A] inline-flex items-center gap-1">
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

        {/* Donors needing attention */}
        <div className="lg:col-span-3 bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)]">
            <div>
              <h2 style={bricolage} className="text-lg font-semibold text-[var(--ink)]">Donors who need you this week</h2>
              <p className="text-sm text-[var(--ink-soft)]">Ranked by lapse risk and lifetime value</p>
            </div>
            <Link href="/contacts" className="text-sm font-medium text-[#5B4B8A] hover:text-[#E0507A] inline-flex items-center gap-1 whitespace-nowrap">
              All donors <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
          {needAttention.length === 0 ? (
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
                  {needAttention.slice(0, 6).map((d) => (
                    <tr key={d.id} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--paper)] transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: statusStyle[d.status].color }}>{d.initials}</span>
                          <div className="min-w-0">
                            <Link href={`/contacts/${d.id}`} className="font-medium text-[var(--ink)] hover:text-[#5B4B8A] block truncate">{d.name}</Link>
                            <span className="text-xs text-[var(--ink-faint)] truncate block">{d.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-medium text-[var(--ink)] text-right tabular-nums">{money(d.lifetime)}</td>
                      <td className="px-3 py-3 text-[var(--ink-soft)] whitespace-nowrap">{Math.round(d.monthsSince)}mo ago</td>
                      <td className="px-3 py-3">
                        <span className="text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap" style={{ color: statusStyle[d.status].color, background: statusStyle[d.status].bg }}>{d.status}</span>
                      </td>
                      <td className="px-6 py-3">
                        <Link href={`/contacts/${d.id}`} className="text-[#5B4B8A] hover:text-[#E0507A] font-medium whitespace-nowrap">{d.suggestion} →</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Campaigns + Recent donations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaigns */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 style={bricolage} className="text-lg font-semibold text-[var(--ink)]">Active campaigns</h2>
            <Link href="/campaigns" className="text-sm font-medium text-[#5B4B8A] hover:text-[#E0507A] inline-flex items-center gap-1">
              All <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
          {campaigns.length === 0 ? (
            <p className="text-[var(--ink-faint)] text-sm py-6 text-center">No active campaigns yet.</p>
          ) : (
            <div className="space-y-5">
              {campaigns.map((c) => {
                const pct = c.goal && c.goal > 0 ? Math.min((c.raised / c.goal) * 100, 100) : 0
                return (
                  <Link key={c.id} href={`/campaigns/${c.id}`} className="block group">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="font-medium text-[var(--ink)] group-hover:text-[#5B4B8A]">{c.name}</span>
                      <span className="text-sm text-[var(--ink-soft)]">{money(c.raised)} <span className="text-[var(--ink-faint)]">of {money(c.goal || 0)}</span></span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: sunset }} />
                    </div>
                    <div className="text-xs text-[var(--ink-faint)] mt-1">{pct.toFixed(0)}% of goal</div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent donations */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)]">
            <h2 style={bricolage} className="text-lg font-semibold text-[var(--ink)]">Recent donations</h2>
            <Link href="/donations" className="text-sm font-medium text-[#5B4B8A] hover:text-[#E0507A] inline-flex items-center gap-1">
              All <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
          {recentDonations.length === 0 ? (
            <p className="text-[var(--ink-faint)] text-sm py-8 text-center">No donations yet.</p>
          ) : (
            <div className="divide-y divide-[var(--line)]">
              {recentDonations.map((d) => (
                <Link key={d.id} href={`/donations/${d.id}`} className="flex items-center justify-between px-6 py-3 hover:bg-[var(--paper)] transition-colors">
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--ink)] truncate">{d.contact.firstName} {d.contact.lastName}</p>
                    <p className="text-xs text-[var(--ink-faint)] truncate">{d.campaign?.name || 'General Fund'} · {new Date(d.donatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
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
      </div>
    </DashboardLayout>
  )
}
