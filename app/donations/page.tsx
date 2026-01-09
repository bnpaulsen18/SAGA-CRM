import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import DashboardLayout from '@/components/DashboardLayout'
import SagaCard from '@/components/ui/saga-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CurrencyDollar, TrendUp, Gift, HandCoins, Plus, CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr'
import DonationRowActions from './DonationRowActions'
import DonationsFilters from '@/components/donations/DonationsFilters'

export const runtime = 'nodejs'

interface DonationsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DonationsPage({ searchParams }: DonationsPageProps) {
  const session = await requireAuth()
  const prisma = await getPrismaWithRLS()

  // Parse pagination and filter params from URL
  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = Number(params.limit) || 50
  const skip = (page - 1) * limit

  // Parse filter parameters
  const status = params.status as string | undefined
  const campaignId = params.campaignId as string | undefined
  const startDate = params.startDate as string | undefined
  const endDate = params.endDate as string | undefined
  const minAmount = params.minAmount as string | undefined
  const maxAmount = params.maxAmount as string | undefined

  // Build dynamic where clause based on filters
  const baseWhere: any = {
    organizationId: session.user.organizationId || undefined
  }

  // Apply filters to base where clause
  const filterWhere = { ...baseWhere }

  if (status && status !== 'all') {
    filterWhere.status = status
  }

  if (campaignId && campaignId !== 'all') {
    filterWhere.campaignId = campaignId
  }

  if (startDate || endDate) {
    filterWhere.donatedAt = {}
    if (startDate) filterWhere.donatedAt.gte = new Date(startDate)
    if (endDate) {
      // Set to end of day
      const endDateTime = new Date(endDate)
      endDateTime.setHours(23, 59, 59, 999)
      filterWhere.donatedAt.lte = endDateTime
    }
  }

  if (minAmount || maxAmount) {
    filterWhere.amount = {}
    if (minAmount) filterWhere.amount.gte = parseFloat(minAmount)
    if (maxAmount) filterWhere.amount.lte = parseFloat(maxAmount)
  }

  // Get total counts and aggregates for accurate stats (independent of pagination and filters)
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [totalDonationsCount, totalRaisedAggregate, thisMonthAggregate, campaigns] = await Promise.all([
    prisma.donation.count({
      where: filterWhere
    }),
    prisma.donation.aggregate({
      where: baseWhere,
      _sum: {
        amount: true
      }
    }),
    prisma.donation.aggregate({
      where: {
        ...baseWhere,
        donatedAt: {
          gte: firstDayOfMonth
        }
      },
      _sum: {
        amount: true
      },
      _count: true
    }),
    prisma.campaign.findMany({
      where: {
        organizationId: session.user.organizationId || undefined
      },
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: 'asc'
      }
    })
  ])

  // Fetch donations for the user's organization (paginated and filtered)
  const donations = await prisma.donation.findMany({
    where: filterWhere,
    include: {
      contact: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      campaign: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      donatedAt: 'desc',
    },
    skip,
    take: limit
  })

  // Use actual totals from aggregates (not paginated subset)
  const totalRaised = totalRaisedAggregate._sum.amount || 0
  const thisMonthTotal = thisMonthAggregate._sum.amount || 0
  const thisMonthCount = thisMonthAggregate._count

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalDonationsCount / limit)
  const startRecord = totalDonationsCount === 0 ? 0 : skip + 1
  const endRecord = Math.min(skip + limit, totalDonationsCount)

  return (
    <DashboardLayout
      userName={session.user.name || session.user.email || 'User'}
      userRole={session.user.role}
      searchPlaceholder="Search donations by donor, amount, campaign..."
    >
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Donations</h1>
          <p className="text-white/70">Track and manage all donations</p>
        </div>
        <Link href="/donations/new">
          <Button
            className="text-white font-semibold flex items-center gap-2 saga-button border-none"
          >
            <Plus size={18} weight="bold" />
            New Donation
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SagaCard variant="purple">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white/70">Total Raised (All Time)</h3>
              <p className="text-3xl font-bold text-white mt-2">
                ${totalRaised.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-white/50 mt-1">Across all campaigns</p>
            </div>
            <CurrencyDollar size={40} weight="bold" className="text-green-400" />
          </div>
        </SagaCard>

        <SagaCard variant="orange">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white/70">This Month</h3>
              <p className="text-3xl font-bold text-white mt-2">
                ${thisMonthTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-white/50 mt-1">{thisMonthCount} donation{thisMonthCount !== 1 ? 's' : ''}</p>
            </div>
            <TrendUp size={40} weight="bold" className="text-blue-400" />
          </div>
        </SagaCard>

        <SagaCard variant="pink">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white/70">Total Donations</h3>
              <p className="text-3xl font-bold text-white mt-2">{totalDonationsCount}</p>
              <p className="text-xs text-white/50 mt-1">All time records</p>
            </div>
            <Gift size={40} weight="bold" className="text-purple-400" />
          </div>
        </SagaCard>
      </div>

      {/* Filters */}
      <DonationsFilters campaigns={campaigns} />

      {/* Donations Table */}
      <SagaCard>
        <div className="overflow-x-auto">
          {donations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="flex justify-center mb-4">
                <HandCoins size={64} weight="bold" className="text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No donations yet</h3>
              <p className="text-white/60 mb-6">Get started by recording your first donation</p>
              <Link href="/donations/new">
                <Button
                  className="text-white font-semibold saga-button border-none"
                >
                  Record First Donation
                </Button>
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Donor</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Fund</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Campaign</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Method</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr
                    key={donation.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/donations/${donation.id}`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-white/90 text-sm">
                        {new Date(donation.donatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">
                          {donation.contact.firstName} {donation.contact.lastName}
                        </div>
                        <div className="text-white/50 text-sm">{donation.contact.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#ffa07a] font-semibold text-lg">
                        ${donation.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/20">
                        {donation.fundRestriction.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/70 text-sm">
                        {donation.campaign?.name || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/70 text-sm capitalize">
                        {donation.method.toLowerCase().replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          donation.status === 'COMPLETED'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : donation.status === 'PENDING'
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {donation.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <DonationRowActions donationId={donation.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Footer - Pagination */}
        {totalDonationsCount > 0 && (() => {
          // Build query string with current filters
          const buildPageUrl = (newPage: number) => {
            const queryParams = new URLSearchParams()
            queryParams.set('page', newPage.toString())
            queryParams.set('limit', limit.toString())
            if (status && status !== 'all') queryParams.set('status', status)
            if (campaignId && campaignId !== 'all') queryParams.set('campaignId', campaignId)
            if (startDate) queryParams.set('startDate', startDate)
            if (endDate) queryParams.set('endDate', endDate)
            if (minAmount) queryParams.set('minAmount', minAmount)
            if (maxAmount) queryParams.set('maxAmount', maxAmount)
            return `/donations?${queryParams.toString()}`
          }

          return (
            <div className="bg-white/5 border-t border-white/10 px-6 py-4 mt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">
                  Showing {startRecord.toLocaleString()}-{endRecord.toLocaleString()} of {totalDonationsCount.toLocaleString()} donation{totalDonationsCount !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Link href={page <= 1 ? '#' : buildPageUrl(page - 1)}>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        className="text-white border-white/30 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <CaretLeft size={16} weight="bold" />
                        Previous
                      </Button>
                    </Link>
                    <Link href={page >= totalPages ? '#' : buildPageUrl(page + 1)}>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        className="text-white border-white/30 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        Next
                        <CaretRight size={16} weight="bold" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}
      </SagaCard>
    </DashboardLayout>
  )
}
