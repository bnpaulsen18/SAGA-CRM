import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import DashboardLayout from '@/components/DashboardLayout'
import SagaCard from '@/components/ui/saga-card'
import { analyzeDonorPattern, calculateDonorEngagementScore } from '@/lib/ai/donor-profiles'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const runtime = 'nodejs'

interface DonationDetailPageProps {
  params: { id: string }
}

export default async function DonationDetailPage({ params }: DonationDetailPageProps) {
  const session = await requireAuth()
  const prisma = await getPrismaWithRLS()

  // Fetch donation with related data
  const donation = await prisma.donation.findFirst({
    where: {
      id: params.id,
      organizationId: session.user.organizationId || undefined
    },
    include: {
      contact: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true
        }
      },
      campaign: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  if (!donation) {
    notFound()
  }

  // Fetch donor's full donation history for AI analysis
  const donorHistory = await prisma.donation.findMany({
    where: {
      contactId: donation.contactId,
      organizationId: session.user.organizationId || undefined
    },
    orderBy: { donatedAt: 'desc' },
    select: {
      id: true,
      amount: true,
      donatedAt: true,
      campaign: {
        select: { name: true }
      }
    }
  })

  // Calculate donor stats
  const totalGiven = donorHistory.reduce((sum, d) => sum + d.amount, 0)
  const donationCount = donorHistory.length
  const averageGift = totalGiven / donationCount
  const daysSinceLastGift = Math.floor(
    (Date.now() - new Date(donorHistory[0].donatedAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  // Determine gift trend
  let giftTrend: 'increasing' | 'decreasing' | 'stable' = 'stable'
  if (donorHistory.length >= 3) {
    const recentAvg = donorHistory.slice(0, 3).reduce((sum, d) => sum + d.amount, 0) / 3
    const olderAvg = donorHistory.slice(-3).reduce((sum, d) => sum + d.amount, 0) / 3
    if (recentAvg > olderAvg * 1.1) giftTrend = 'increasing'
    else if (recentAvg < olderAvg * 0.9) giftTrend = 'decreasing'
  }

  // Get AI-powered donor intelligence
  let donorIntelligence = null
  let engagementScore = null

  try {
    // Only run AI analysis if there's meaningful history
    if (donorHistory.length > 0) {
      donorIntelligence = await analyzeDonorPattern(
        donorHistory.map(d => ({
          date: d.donatedAt,
          amount: d.amount,
          fund: d.campaign?.name || 'General'
        }))
      )

      engagementScore = calculateDonorEngagementScore({
        donationCount,
        totalGiven,
        daysSinceLastGift,
        averageGiftTrend: giftTrend
      })
    }
  } catch (error) {
    console.error('AI analysis failed:', error)
  }

  return (
    <DashboardLayout
      userName={session.user.name || session.user.email || 'User'}
      userRole={session.user.role}
    >
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/donations" className="text-white/70 hover:text-white">
            ← Back to Donations
          </Link>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Donation Details
            </h1>
            <p className="text-white/70">
              ${donation.amount.toLocaleString()} from{' '}
              <Link
                href={`/contacts/${donation.contact.id}`}
                className="text-orange-400 hover:text-orange-500 underline"
              >
                {donation.contact.firstName} {donation.contact.lastName}
              </Link>
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
              📄 Download Receipt
            </Button>
            <Link href={`/donations/${params.id}/edit`}>
              <Button
                className="text-white font-semibold"
                style={{
                  background: 'linear-gradient(to right, #764ba2, #ff6b35)',
                  border: 'none'
                }}
              >
                ✏️ Edit Donation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Donation Information */}
          <SagaCard title="💰 Donation Information">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-white/70">Amount</label>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  ${donation.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-white/70">Date</label>
                <p className="text-lg text-white mt-1">
                  {new Date(donation.donatedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-white/70">Payment Method</label>
                <p className="text-white mt-1">{donation.method.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-white/70">Campaign</label>
                <p className="text-white mt-1">
                  {donation.campaign ? (
                    <Link
                      href={`/campaigns/${donation.campaign.id}`}
                      className="text-orange-400 hover:text-orange-500 underline"
                    >
                      {donation.campaign.name}
                    </Link>
                  ) : (
                    'General Fund'
                  )}
                </p>
              </div>
              {donation.fundRestriction && (
                <div>
                  <label className="text-sm font-medium text-white/70">Fund Restriction</label>
                  <p className="text-white mt-1">{donation.fundRestriction.replace('_', ' ')}</p>
                </div>
              )}
              {donation.notes && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-white/70">Notes</label>
                  <p className="text-white/80 mt-1">{donation.notes}</p>
                </div>
              )}
            </div>
          </SagaCard>

          {/* Donor Information */}
          <SagaCard title="👤 Donor Information">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-white/70">Name</label>
                <p className="text-lg text-white mt-1">
                  <Link
                    href={`/contacts/${donation.contact.id}`}
                    className="hover:text-orange-400 transition-colors"
                  >
                    {donation.contact.firstName} {donation.contact.lastName}
                  </Link>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-white/70">Email</label>
                <p className="text-white mt-1">{donation.contact.email}</p>
              </div>
              {donation.contact.phone && (
                <div>
                  <label className="text-sm font-medium text-white/70">Phone</label>
                  <p className="text-white mt-1">{donation.contact.phone}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-white/70">Lifetime Giving</label>
                <p className="text-xl font-bold text-green-400 mt-1">
                  ${totalGiven.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-white/70">Total Donations</label>
                <p className="text-xl font-bold text-white mt-1">{donationCount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-white/70">Average Gift</label>
                <p className="text-lg text-white mt-1">${averageGift.toFixed(2)}</p>
              </div>
            </div>
          </SagaCard>

          {/* Donation History */}
          <SagaCard title="📜 Donor History">
            <div className="space-y-3">
              {donorHistory.slice(0, 10).map((d) => (
                <div
                  key={d.id}
                  className="flex justify-between items-center p-3 rounded-lg"
                  style={{
                    background: d.id === params.id ? 'rgba(255, 107, 53, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    border: d.id === params.id ? '1px solid rgba(255, 107, 53, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div>
                    <p className="text-white font-medium">
                      {d.id === params.id && '→ '}${d.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-white/60">{d.campaign?.name || 'General Fund'}</p>
                  </div>
                  <p className="text-sm text-white/70">
                    {new Date(d.donatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {donorHistory.length > 10 && (
                <Link
                  href={`/contacts/${donation.contact.id}`}
                  className="block text-center text-orange-400 hover:text-orange-500 text-sm pt-2"
                >
                  View all {donorHistory.length} donations →
                </Link>
              )}
            </div>
          </SagaCard>
        </div>

        {/* Sidebar - AI Insights */}
        <div className="space-y-6">
          {/* Engagement Score */}
          {engagementScore && (
            <SagaCard title="🎯 Engagement Score">
              <div className="text-center mb-4">
                <div
                  className="text-5xl font-bold mb-2"
                  style={{
                    color: engagementScore.level === 'High'
                      ? '#22c55e'
                      : engagementScore.level === 'Medium'
                      ? '#eab308'
                      : engagementScore.level === 'Low'
                      ? '#f97316'
                      : '#ef4444'
                  }}
                >
                  {engagementScore.score}
                </div>
                <div className="text-lg text-white font-medium">{engagementScore.level} Engagement</div>
              </div>
              <div
                className="w-full bg-white/10 rounded-full h-3 overflow-hidden mb-4"
              >
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${engagementScore.score}%`,
                    background:
                      engagementScore.level === 'High'
                        ? 'linear-gradient(to right, #22c55e, #16a34a)'
                        : engagementScore.level === 'Medium'
                        ? 'linear-gradient(to right, #eab308, #ca8a04)'
                        : 'linear-gradient(to right, #ef4444, #dc2626)'
                  }}
                ></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white/70 mb-2">Recommendations:</h4>
                <ul className="space-y-2">
                  {engagementScore.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-white/80 flex gap-2">
                      <span className="text-orange-400">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </SagaCard>
          )}

          {/* AI Donor Intelligence */}
          {donorIntelligence && (
            <SagaCard title="🤖 AI Donor Intelligence">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-white/70 uppercase">Giving Frequency</label>
                  <p className="text-white mt-1 capitalize">{donorIntelligence.givingFrequency}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/70 uppercase">Gift Trend</label>
                  <p className="text-white mt-1 capitalize flex items-center gap-2">
                    {donorIntelligence.averageGiftTrend}
                    {donorIntelligence.averageGiftTrend === 'increasing' && '📈'}
                    {donorIntelligence.averageGiftTrend === 'decreasing' && '📉'}
                    {donorIntelligence.averageGiftTrend === 'stable' && '➡️'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/70 uppercase">Best Time to Ask</label>
                  <p className="text-white/80 text-sm mt-1">{donorIntelligence.bestTimeToAsk}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/70 uppercase">Suggested Ask Amount</label>
                  <p className="text-xl font-bold text-green-400 mt-1">
                    ${donorIntelligence.suggestedAskAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/70 uppercase mb-2 block">Preferred Causes</label>
                  <div className="flex flex-wrap gap-2">
                    {donorIntelligence.preferredCauses.map((cause, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded text-xs text-white"
                        style={{
                          background: 'rgba(255, 107, 53, 0.2)',
                          border: '1px solid rgba(255, 107, 53, 0.4)'
                        }}
                      >
                        {cause}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/70 uppercase mb-2 block">Key Insights</label>
                  <ul className="space-y-1">
                    {donorIntelligence.insights.map((insight, i) => (
                      <li key={i} className="text-sm text-white/80 flex gap-2">
                        <span className="text-orange-400">•</span>
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
    </DashboardLayout>
  )
}
