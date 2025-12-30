import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import DashboardLayout from '@/components/DashboardLayout'
import SagaCard from '@/components/ui/saga-card'
import { generateExecutiveSummary } from '@/lib/ai/donation-insights'
import { Button } from '@/components/ui/button'
import MonthlyGivingChart from '@/components/reports/MonthlyGivingChart'
import TopDonorsTable from '@/components/reports/TopDonorsTable'

export default async function ReportsPage() {
  const session = await requireAuth()
  const prisma = await getPrismaWithRLS()

  // Calculate date range (last 12 months)
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 12)

  // Fetch donations for the period
  const donations = await prisma.donation.findMany({
    where: {
      organizationId: session.user.organizationId || undefined,
      donatedAt: {
        gte: startDate,
        lte: endDate
      },
      status: 'COMPLETED'
    },
    include: {
      contact: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      campaign: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      donatedAt: 'desc'
    }
  })

  // Calculate key metrics
  const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0)
  const donationCount = donations.length
  const averageGift = donationCount > 0 ? totalRaised / donationCount : 0

  // Get unique donors
  const uniqueDonorIds = new Set(donations.map(d => d.contactId))
  const donorCount = uniqueDonorIds.size

  // Calculate new donors (first donation in this period)
  const allDonations = await prisma.donation.findMany({
    where: {
      organizationId: session.user.organizationId || undefined,
      status: 'COMPLETED'
    },
    select: {
      contactId: true,
      donatedAt: true
    },
    orderBy: {
      donatedAt: 'asc'
    }
  })

  const firstDonationDates = new Map<string, Date>()
  allDonations.forEach(d => {
    if (!firstDonationDates.has(d.contactId)) {
      firstDonationDates.set(d.contactId, d.donatedAt)
    }
  })

  const newDonors = Array.from(uniqueDonorIds).filter(contactId => {
    const firstDonation = firstDonationDates.get(contactId)
    return firstDonation && firstDonation >= startDate
  }).length

  // Group by month for chart
  const monthlyData: { [key: string]: number } = {}
  donations.forEach(d => {
    const monthKey = `${d.donatedAt.getFullYear()}-${String(d.donatedAt.getMonth() + 1).padStart(2, '0')}`
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + d.amount
  })

  const chartData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      amount
    }))

  // Top donors
  const donorTotals = new Map<string, { total: number; count: number; contact: any }>()
  donations.forEach(d => {
    if (!donorTotals.has(d.contactId)) {
      donorTotals.set(d.contactId, {
        total: 0,
        count: 0,
        contact: d.contact
      })
    }
    const donorData = donorTotals.get(d.contactId)!
    donorData.total += d.amount
    donorData.count += 1
  })

  const topDonors = Array.from(donorTotals.entries())
    .map(([contactId, data]) => ({
      contactId,
      name: `${data.contact.firstName} ${data.contact.lastName}`,
      total: data.total,
      count: data.count,
      avgGift: data.total / data.count
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)

  // Top campaigns/funds
  const campaignTotals = new Map<string, number>()
  donations.forEach(d => {
    const campaignName = d.campaign?.name || 'General Fund'
    campaignTotals.set(campaignName, (campaignTotals.get(campaignName) || 0) + d.amount)
  })

  const topFunds = Array.from(campaignTotals.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)

  // Generate AI Executive Summary
  let executiveSummary = null
  try {
    if (donations.length > 0) {
      executiveSummary = await generateExecutiveSummary({
        dateRange: { start: startDate, end: endDate },
        totalRaised,
        donorCount,
        averageGift,
        newDonors,
        topFunds
      })
    }
  } catch (error) {
    console.error('Failed to generate executive summary:', error)
  }

  // Compare to previous period
  const prevStartDate = new Date(startDate)
  prevStartDate.setMonth(prevStartDate.getMonth() - 12)
  const prevEndDate = new Date(startDate)

  const prevDonations = await prisma.donation.findMany({
    where: {
      organizationId: session.user.organizationId || undefined,
      donatedAt: {
        gte: prevStartDate,
        lt: prevEndDate
      },
      status: 'COMPLETED'
    },
    select: {
      amount: true
    }
  })

  const prevTotalRaised = prevDonations.reduce((sum, d) => sum + d.amount, 0)
  const growthRate = prevTotalRaised > 0
    ? ((totalRaised - prevTotalRaised) / prevTotalRaised) * 100
    : 100

  return (
    <DashboardLayout
      userName={session.user.name || session.user.email}
      userRole={session.user.role}
    >
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Fundraising Reports</h1>
            <p className="text-white/70">
              Performance analysis for the last 12 months
            </p>
          </div>
          <Button
            variant="outline"
            className="text-white border-white/30 hover:bg-white/10"
          >
            📄 Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SagaCard>
          <h3 className="text-sm font-medium text-white/70 mb-2">Total Raised</h3>
          <p className="text-3xl font-bold text-green-400">
            ${totalRaised.toLocaleString()}
          </p>
          {growthRate !== 0 && (
            <p className={`text-sm mt-2 ${growthRate > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {growthRate > 0 ? '↑' : '↓'} {Math.abs(growthRate).toFixed(1)}% vs. last year
            </p>
          )}
        </SagaCard>

        <SagaCard>
          <h3 className="text-sm font-medium text-white/70 mb-2">Total Donations</h3>
          <p className="text-3xl font-bold text-white">{donationCount}</p>
          <p className="text-sm text-white/60 mt-2">
            From {donorCount} donor{donorCount === 1 ? '' : 's'}
          </p>
        </SagaCard>

        <SagaCard>
          <h3 className="text-sm font-medium text-white/70 mb-2">Average Gift</h3>
          <p className="text-3xl font-bold text-white">
            ${averageGift.toFixed(2)}
          </p>
          <p className="text-sm text-white/60 mt-2">Per donation</p>
        </SagaCard>

        <SagaCard>
          <h3 className="text-sm font-medium text-white/70 mb-2">New Donors</h3>
          <p className="text-3xl font-bold text-orange-400">{newDonors}</p>
          <p className="text-sm text-white/60 mt-2">
            {donorCount > 0 ? ((newDonors / donorCount) * 100).toFixed(0) : 0}% of total donors
          </p>
        </SagaCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts & Tables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Monthly Giving Trend */}
          <SagaCard title="📈 Monthly Giving Trend">
            {chartData.length > 0 ? (
              <MonthlyGivingChart data={chartData} />
            ) : (
              <p className="text-white/60 text-center py-8">
                No donation data available for this period
              </p>
            )}
          </SagaCard>

          {/* Top Donors */}
          <SagaCard title="🏆 Top Donors (Last 12 Months)">
            {topDonors.length > 0 ? (
              <TopDonorsTable donors={topDonors} />
            ) : (
              <p className="text-white/60 text-center py-8">
                No donors yet
              </p>
            )}
          </SagaCard>

          {/* Top Campaigns/Funds */}
          <SagaCard title="💰 Top Campaigns & Funds">
            <div className="space-y-3">
              {topFunds.map((fund, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-white/40">#{i + 1}</span>
                    <span className="text-white">{fund.name}</span>
                  </div>
                  <span className="text-lg font-bold text-green-400">
                    ${fund.amount.toLocaleString()}
                  </span>
                </div>
              ))}
              {topFunds.length === 0 && (
                <p className="text-white/60 text-center py-4">No campaigns yet</p>
              )}
            </div>
          </SagaCard>
        </div>

        {/* Right Column - AI Insights */}
        <div>
          <SagaCard title="🤖 AI Executive Summary">
            {executiveSummary ? (
              <div
                className="prose prose-invert prose-sm max-w-none"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                dangerouslySetInnerHTML={{
                  __html: executiveSummary.replace(/\n/g, '<br>')
                }}
              />
            ) : (
              <p className="text-white/60 text-sm">
                {donations.length === 0
                  ? 'No donation data available to analyze'
                  : 'AI summary unavailable at this time'}
              </p>
            )}
          </SagaCard>
        </div>
      </div>
    </DashboardLayout>
  )
}
