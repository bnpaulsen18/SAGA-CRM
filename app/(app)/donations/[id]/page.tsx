import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import SagaCard from '@/components/ui/saga-card'
import { analyzeDonorPattern, calculateDonorEngagementScore } from '@/lib/ai/donor-profiles'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PencilSimple, TrendUp, TrendDown, ArrowRight, FileText } from '@phosphor-icons/react/dist/ssr'

export const runtime = 'nodejs'

const bricolage = { fontFamily: 'var(--font-bricolage), sans-serif' } as const
const labelCls = 'text-sm font-medium text-[var(--ink-soft)]'

export default async function DonationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth()
  const { id } = await params
  const prisma = await getPrismaWithRLS()

  const donation = await prisma.donation.findFirst({
    where: { id, organizationId: session.user.organizationId ?? '__no_such_org__' },
    include: {
      contact: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
      campaign: { select: { id: true, name: true } },
    },
  })

  if (!donation) {
    notFound()
  }

  const donorHistory = await prisma.donation.findMany({
    where: { contactId: donation.contactId, organizationId: session.user.organizationId ?? '__no_such_org__' },
    orderBy: { donatedAt: 'desc' },
    select: { id: true, amount: true, donatedAt: true, campaign: { select: { name: true } } },
  })

  const totalGiven = donorHistory.reduce((sum, d) => sum + d.amount, 0)
  const donationCount = donorHistory.length
  const averageGift = totalGiven / donationCount
  const daysSinceLastGift = Math.floor((Date.now() - new Date(donorHistory[0].donatedAt).getTime()) / (1000 * 60 * 60 * 24))

  let giftTrend: 'increasing' | 'decreasing' | 'stable' = 'stable'
  if (donorHistory.length >= 3) {
    const recentAvg = donorHistory.slice(0, 3).reduce((sum, d) => sum + d.amount, 0) / 3
    const olderAvg = donorHistory.slice(-3).reduce((sum, d) => sum + d.amount, 0) / 3
    if (recentAvg > olderAvg * 1.1) giftTrend = 'increasing'
    else if (recentAvg < olderAvg * 0.9) giftTrend = 'decreasing'
  }

  let donorIntelligence = null
  let engagementScore = null
  try {
    if (donorHistory.length > 0) {
      donorIntelligence = await analyzeDonorPattern(
        donorHistory.map((d) => ({ date: d.donatedAt, amount: d.amount, fund: d.campaign?.name || 'General' }))
      )
      engagementScore = calculateDonorEngagementScore({ donationCount, totalGiven, daysSinceLastGift, averageGiftTrend: giftTrend })
    }
  } catch (error) {
    console.error('AI analysis failed:', error)
  }

  const scoreColor = (level: string) =>
    level === 'High' ? '#2E7D5B' : level === 'Medium' ? '#B7791F' : level === 'Low' ? '#C77A3F' : '#C0573F'
  const scoreBar = (level: string) =>
    level === 'High' ? 'linear-gradient(90deg,#4A8C6F,#2E7D5B)' :
    level === 'Medium' ? 'linear-gradient(90deg,#E8A33D,#B7791F)' :
    level === 'Low' ? 'linear-gradient(90deg,#E0875A,#C77A3F)' :
    'linear-gradient(90deg,#D17A66,#C0573F)'

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <Link href="/donations" className="inline-flex items-center gap-1 text-[var(--ink-soft)] hover:text-[var(--ink)] mb-2 text-sm transition-colors">
          ← Back to Donations
        </Link>
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-[var(--ink)] mb-2" style={bricolage}>Donation Details</h1>
            <p className="text-[var(--ink-soft)]">
              ${donation.amount.toLocaleString()} from{' '}
              <Link href={`/contacts/${donation.contact.id}`} className="text-[#5B4B8A] hover:text-[#E0507A] underline">
                {donation.contact.firstName} {donation.contact.lastName}
              </Link>
            </p>
          </div>
          <div className="flex gap-3">
            <a href={`/api/donations/${id}/receipt`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="text-[var(--ink)] border-[var(--line)] hover:bg-[var(--surface-2)] flex items-center gap-2">
                <FileText size={18} weight="bold" />
                Download Receipt
              </Button>
            </a>
            <Link href={`/donations/${id}/edit`}>
              <Button className="text-white font-semibold flex items-center gap-2 border-none" style={{ background: 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)' }}>
                <PencilSimple size={18} weight="bold" />
                Edit Donation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Donation Information */}
          <SagaCard title="Donation Information">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Amount</label>
                <p className="text-2xl font-bold text-[#4A8C6F] mt-1 tabular-nums">${donation.amount.toLocaleString()}</p>
              </div>
              <div>
                <label className={labelCls}>Date</label>
                <p className="text-lg text-[var(--ink)] mt-1">
                  {new Date(donation.donatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div>
                <label className={labelCls}>Payment Method</label>
                <p className="text-[var(--ink)] mt-1 capitalize">{donation.method.toLowerCase().replace(/_/g, ' ')}</p>
              </div>
              <div>
                <label className={labelCls}>Campaign</label>
                <p className="text-[var(--ink)] mt-1">
                  {donation.campaign ? (
                    <Link href={`/campaigns/${donation.campaign.id}`} className="text-[#5B4B8A] hover:text-[#E0507A] underline">
                      {donation.campaign.name}
                    </Link>
                  ) : ('General Fund')}
                </p>
              </div>
              {donation.fundRestriction && (
                <div>
                  <label className={labelCls}>Fund Restriction</label>
                  <p className="text-[var(--ink)] mt-1 capitalize">{donation.fundRestriction.toLowerCase().replace(/_/g, ' ')}</p>
                </div>
              )}
              {donation.notes && (
                <div className="col-span-2">
                  <label className={labelCls}>Notes</label>
                  <p className="text-[var(--ink-soft)] mt-1">{donation.notes}</p>
                </div>
              )}
            </div>
          </SagaCard>

          {/* Donor Information */}
          <SagaCard title="👤 Donor Information">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Name</label>
                <p className="text-lg text-[var(--ink)] mt-1">
                  <Link href={`/contacts/${donation.contact.id}`} className="hover:text-[#5B4B8A] transition-colors">
                    {donation.contact.firstName} {donation.contact.lastName}
                  </Link>
                </p>
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <p className="text-[var(--ink)] mt-1">{donation.contact.email}</p>
              </div>
              {donation.contact.phone && (
                <div>
                  <label className={labelCls}>Phone</label>
                  <p className="text-[var(--ink)] mt-1">{donation.contact.phone}</p>
                </div>
              )}
              <div>
                <label className={labelCls}>Lifetime Giving</label>
                <p className="text-xl font-bold text-[#4A8C6F] mt-1 tabular-nums">${totalGiven.toLocaleString()}</p>
              </div>
              <div>
                <label className={labelCls}>Total Donations</label>
                <p className="text-xl font-bold text-[var(--ink)] mt-1 tabular-nums">{donationCount}</p>
              </div>
              <div>
                <label className={labelCls}>Average Gift</label>
                <p className="text-lg text-[var(--ink)] mt-1 tabular-nums">${averageGift.toFixed(2)}</p>
              </div>
            </div>
          </SagaCard>

          {/* Donation History */}
          <SagaCard title="📜 Donor History">
            <div className="space-y-3">
              {donorHistory.slice(0, 10).map((d) => {
                const current = d.id === id
                return (
                  <div
                    key={d.id}
                    className="flex justify-between items-center p-3 rounded-lg border"
                    style={current
                      ? { background: '#FCEFE9', borderColor: '#F0C9B8' }
                      : { background: 'var(--paper)', borderColor: 'var(--line)' }}
                  >
                    <div>
                      <p className="text-[var(--ink)] font-medium tabular-nums">
                        {current && '→ '}${d.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-[var(--ink-faint)]">{d.campaign?.name || 'General Fund'}</p>
                    </div>
                    <p className="text-sm text-[var(--ink-soft)]">{new Date(d.donatedAt).toLocaleDateString()}</p>
                  </div>
                )
              })}
              {donorHistory.length > 10 && (
                <Link href={`/contacts/${donation.contact.id}`} className="block text-center text-[#5B4B8A] hover:text-[#E0507A] text-sm pt-2">
                  View all {donorHistory.length} donations →
                </Link>
              )}
            </div>
          </SagaCard>
        </div>

        {/* Sidebar - AI Insights */}
        <div className="space-y-6">
          {engagementScore && (
            <SagaCard title="Engagement Score">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold mb-2 tabular-nums" style={{ color: scoreColor(engagementScore.level) }}>
                  {engagementScore.score}
                </div>
                <div className="text-lg text-[var(--ink)] font-medium">{engagementScore.level} Engagement</div>
              </div>
              <div className="w-full bg-[var(--surface-2)] rounded-full h-3 overflow-hidden mb-4">
                <div className="h-full transition-all" style={{ width: `${engagementScore.score}%`, background: scoreBar(engagementScore.level) }} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[var(--ink-soft)] mb-2">Recommendations:</h4>
                <ul className="space-y-2">
                  {engagementScore.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-[var(--ink-soft)] flex gap-2">
                      <span className="text-[#E0507A]">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </SagaCard>
          )}

          {donorIntelligence && (
            <SagaCard title="🤖 AI Donor Intelligence">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[var(--ink-faint)] uppercase">Giving Frequency</label>
                  <p className="text-[var(--ink)] mt-1 capitalize">{donorIntelligence.givingFrequency}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--ink-faint)] uppercase">Gift Trend</label>
                  <p className="text-[var(--ink)] mt-1 capitalize flex items-center gap-2">
                    {donorIntelligence.averageGiftTrend}
                    {donorIntelligence.averageGiftTrend === 'increasing' && <TrendUp size={18} weight="bold" className="text-[#4A8C6F]" />}
                    {donorIntelligence.averageGiftTrend === 'decreasing' && <TrendDown size={18} weight="bold" className="text-[#C0573F]" />}
                    {donorIntelligence.averageGiftTrend === 'stable' && <ArrowRight size={18} weight="bold" className="text-[#5B4B8A]" />}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--ink-faint)] uppercase">Best Time to Ask</label>
                  <p className="text-[var(--ink-soft)] text-sm mt-1">{donorIntelligence.bestTimeToAsk}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--ink-faint)] uppercase">Suggested Ask Amount</label>
                  <p className="text-xl font-bold text-[#4A8C6F] mt-1 tabular-nums">${donorIntelligence.suggestedAskAmount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--ink-faint)] uppercase mb-2 block">Preferred Causes</label>
                  <div className="flex flex-wrap gap-2">
                    {donorIntelligence.preferredCauses.map((cause, i) => (
                      <span key={i} className="px-2 py-1 rounded text-xs" style={{ background: '#EEE9F5', color: '#5B4B8A', border: '1px solid #DDD3EC' }}>
                        {cause}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--ink-faint)] uppercase mb-2 block">Key Insights</label>
                  <ul className="space-y-1">
                    {donorIntelligence.insights.map((insight, i) => (
                      <li key={i} className="text-sm text-[var(--ink-soft)] flex gap-2">
                        <span className="text-[#E0507A]">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SagaCard>
          )}
        </div>
      </div>
    </>
  )
}
