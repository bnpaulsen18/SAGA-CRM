import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import DashboardLayout from '@/components/DashboardLayout'
import SagaCard from '@/components/ui/saga-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CurrencyDollar, TrendUp, Gift, HandCoins, Plus } from '@phosphor-icons/react/dist/ssr'
import DonationRowActions from './DonationRowActions'

export const runtime = 'nodejs'

export default async function DonationsPage() {
  const session = await requireAuth()
  const prisma = await getPrismaWithRLS()

  // Fetch donations for the user's organization
  const donations = await prisma.donation.findMany({
    where: {
      organizationId: session.user.organizationId || undefined,
    },
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
    take: 100, // Limit to 100 for now, we'll add pagination later
  })

  // Calculate total raised
  const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0)
  const thisMonthDonations = donations.filter((d) => {
    const donationDate = new Date(d.donatedAt)
    const now = new Date()
    return (
      donationDate.getMonth() === now.getMonth() &&
      donationDate.getFullYear() === now.getFullYear()
    )
  })
  const thisMonthTotal = thisMonthDonations.reduce((sum, d) => sum + d.amount, 0)

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
            className="text-white font-semibold flex items-center gap-2"
            style={{
              background: 'linear-gradient(to right, #764ba2, #ff6b35)',
              border: 'none'
            }}
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
              <p className="text-xs text-white/50 mt-1">{thisMonthDonations.length} donation{thisMonthDonations.length !== 1 ? 's' : ''}</p>
            </div>
            <TrendUp size={40} weight="bold" className="text-blue-400" />
          </div>
        </SagaCard>

        <SagaCard variant="pink">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white/70">Total Donations</h3>
              <p className="text-3xl font-bold text-white mt-2">{donations.length}</p>
              <p className="text-xs text-white/50 mt-1">All time records</p>
            </div>
            <Gift size={40} weight="bold" className="text-purple-400" />
          </div>
        </SagaCard>
      </div>

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
                  className="text-white font-semibold"
                  style={{
                    background: 'linear-gradient(to right, #764ba2, #ff6b35)',
                    border: 'none'
                  }}
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

        {/* Table Footer - Pagination placeholder */}
        {donations.length > 0 && (
          <div className="bg-white/5 border-t border-white/10 px-6 py-4 mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/60">
                Showing {donations.length} donation{donations.length !== 1 ? 's' : ''}
              </p>
              {donations.length >= 100 && (
                <p className="text-sm text-white/60">
                  Pagination coming soon...
                </p>
              )}
            </div>
          </div>
        )}
      </SagaCard>
    </DashboardLayout>
  )
}
