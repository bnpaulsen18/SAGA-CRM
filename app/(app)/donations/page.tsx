import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
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

const bricolage = { fontFamily: 'var(--font-bricolage), sans-serif' } as const

export default async function DonationsPage({ searchParams }: DonationsPageProps) {
  const session = await requireAuth()
  const prisma = await getPrismaWithRLS()

  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = Number(params.limit) || 50
  const skip = (page - 1) * limit

  const status = params.status as string | undefined
  const campaignId = params.campaignId as string | undefined
  const startDate = params.startDate as string | undefined
  const endDate = params.endDate as string | undefined
  const minAmount = params.minAmount as string | undefined
  const maxAmount = params.maxAmount as string | undefined

  const baseWhere: any = {
    organizationId: session.user.organizationId ?? '__no_such_org__',
  }
  const filterWhere = { ...baseWhere }

  if (status && status !== 'all') filterWhere.status = status
  if (campaignId && campaignId !== 'all') filterWhere.campaignId = campaignId
  if (startDate || endDate) {
    filterWhere.donatedAt = {}
    if (startDate) filterWhere.donatedAt.gte = new Date(startDate)
    if (endDate) {
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

  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [totalDonationsCount, totalRaisedAggregate, thisMonthAggregate, campaigns] = await Promise.all([
    prisma.donation.count({ where: filterWhere }),
    prisma.donation.aggregate({ where: baseWhere, _sum: { amount: true } }),
    prisma.donation.aggregate({
      where: { ...baseWhere, donatedAt: { gte: firstDayOfMonth } },
      _sum: { amount: true }, _count: true,
    }),
    prisma.campaign.findMany({
      where: { organizationId: session.user.organizationId ?? '__no_such_org__' },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  const donations = await prisma.donation.findMany({
    where: filterWhere,
    include: {
      contact: { select: { firstName: true, lastName: true, email: true } },
      campaign: { select: { name: true } },
    },
    orderBy: { donatedAt: 'desc' },
    skip,
    take: limit,
  })

  const totalRaised = totalRaisedAggregate._sum.amount || 0
  const thisMonthTotal = thisMonthAggregate._sum.amount || 0
  const thisMonthCount = thisMonthAggregate._count

  const totalPages = Math.ceil(totalDonationsCount / limit)
  const startRecord = totalDonationsCount === 0 ? 0 : skip + 1
  const endRecord = Math.min(skip + limit, totalDonationsCount)

  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--ink)] mb-2" style={bricolage}>Donations</h1>
          <p className="text-[var(--ink-soft)]">Track and manage all donations</p>
        </div>
        <Link href="/donations/new">
          <Button className="text-white font-semibold flex items-center gap-2 saga-button border-none">
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
              <h3 className="text-sm font-medium text-[var(--ink-soft)]">Total Raised (All Time)</h3>
              <p className="text-3xl font-bold text-[var(--ink)] mt-2 tabular-nums">
                ${totalRaised.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-[var(--ink-faint)] mt-1">Across all campaigns</p>
            </div>
            <CurrencyDollar size={40} weight="bold" className="text-[#4A8C6F]" />
          </div>
        </SagaCard>

        <SagaCard variant="orange">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[var(--ink-soft)]">This Month</h3>
              <p className="text-3xl font-bold text-[var(--ink)] mt-2 tabular-nums">
                ${thisMonthTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-[var(--ink-faint)] mt-1">{thisMonthCount} donation{thisMonthCount !== 1 ? 's' : ''}</p>
            </div>
            <TrendUp size={40} weight="bold" className="text-[var(--ink-faint)]" />
          </div>
        </SagaCard>

        <SagaCard variant="pink">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[var(--ink-soft)]">Total Donations</h3>
              <p className="text-3xl font-bold text-[var(--ink)] mt-2 tabular-nums">{totalDonationsCount}</p>
              <p className="text-xs text-[var(--ink-faint)] mt-1">All time records</p>
            </div>
            <Gift size={40} weight="bold" className="text-[var(--ink-faint)]" />
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
                <HandCoins size={64} weight="bold" className="text-[var(--ink-faint)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--ink)] mb-2">No donations yet</h3>
              <p className="text-[var(--ink-soft)] mb-6">Get started by recording your first donation</p>
              <Link href="/donations/new">
                <Button className="text-white font-semibold saga-button border-none">
                  Record First Donation
                </Button>
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--paper)] border-b border-[var(--line)]">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--ink-soft)]">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--ink-soft)]">Donor</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--ink-soft)]">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--ink-soft)]">Fund</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--ink-soft)]">Campaign</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--ink-soft)]">Method</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--ink-soft)]">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--ink-soft)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} className="border-b border-[var(--line)] hover:bg-[var(--paper)] transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-[var(--ink-soft)] text-sm">
                        {new Date(donation.donatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-[var(--ink)] font-medium">
                          {donation.contact.firstName} {donation.contact.lastName}
                        </div>
                        <div className="text-[var(--ink-faint)] text-sm">{donation.contact.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#4A8C6F] font-semibold text-lg tabular-nums">
                        ${donation.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--surface-2)] text-[var(--ink-soft)] border border-[var(--line)]">
                        {donation.fundRestriction.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[var(--ink-soft)] text-sm">{donation.campaign?.name || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[var(--ink-soft)] text-sm capitalize">
                        {donation.method.toLowerCase().replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                        style={
                          donation.status === 'COMPLETED'
                            ? { background: '#E6F3EE', color: '#2E7D5B', border: '1px solid #CDE9DD' }
                            : donation.status === 'PENDING'
                            ? { background: '#F7EFD9', color: '#B7791F', border: '1px solid #ECD9A8' }
                            : { background: '#F6EBE6', color: '#C0573F', border: '1px solid #EAD3C8' }
                        }
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
            <div className="bg-[var(--paper)] border-t border-[var(--line)] px-6 py-4 mt-6 -mx-6 -mb-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--ink-soft)]">
                  Showing {startRecord.toLocaleString()}-{endRecord.toLocaleString()} of {totalDonationsCount.toLocaleString()} donation{totalDonationsCount !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[var(--ink-faint)] text-sm">Page {page} of {totalPages}</span>
                  <div className="flex gap-2">
                    <Link href={page <= 1 ? '#' : buildPageUrl(page - 1)}>
                      <Button
                        variant="outline" size="sm" disabled={page <= 1}
                        className="text-[var(--ink)] border-[var(--line)] hover:bg-[var(--surface-2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <CaretLeft size={16} weight="bold" />
                        Previous
                      </Button>
                    </Link>
                    <Link href={page >= totalPages ? '#' : buildPageUrl(page + 1)}>
                      <Button
                        variant="outline" size="sm" disabled={page >= totalPages}
                        className="text-[var(--ink)] border-[var(--line)] hover:bg-[var(--surface-2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
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
    </>
  )
}
