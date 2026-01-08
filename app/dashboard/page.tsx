import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import DashboardLayout from '@/components/DashboardLayout'
import SagaCard from '@/components/ui/saga-card'
import { Users, CurrencyDollar, ChartBar, TrendUp, Gift } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

export const runtime = 'nodejs'

export default async function DashboardPage() {
  const session = await requireAuth()

  // Platform admins should use the /admin dashboard
  if (session.user.isPlatformAdmin || !session.user.organizationId) {
    const { redirect } = await import('next/navigation')
    redirect('/admin')
  }

  const prisma = await getPrismaWithRLS()

  // Fetch dashboard stats and data in parallel
  const [
    totalContacts,
    activeContacts,
    totalDonationsCount,
    totalRevenue,
    totalCampaigns,
    activeCampaigns,
    recentDonations,
    topCampaigns,
  ] = await Promise.all([
    prisma.contact.count({
      where: { organizationId: session.user.organizationId || undefined },
    }),
    prisma.contact.count({
      where: {
        organizationId: session.user.organizationId || undefined,
        status: 'ACTIVE'
      },
    }),
    prisma.donation.count({
      where: { organizationId: session.user.organizationId || undefined },
    }),
    prisma.donation.aggregate({
      where: {
        organizationId: session.user.organizationId || undefined,
        status: 'COMPLETED'
      },
      _sum: { amount: true },
    }),
    prisma.campaign.count({
      where: { organizationId: session.user.organizationId || undefined },
    }),
    prisma.campaign.findMany({
      where: {
        organizationId: session.user.organizationId || undefined,
        status: 'ACTIVE'
      },
      take: 3,
      orderBy: { raised: 'desc' },
      select: {
        id: true,
        name: true,
        goal: true,
        raised: true,
        status: true,
      }
    }),
    prisma.donation.findMany({
      where: { organizationId: session.user.organizationId || undefined },
      take: 5,
      orderBy: { donatedAt: 'desc' },
      include: {
        contact: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        campaign: {
          select: {
            name: true,
          }
        }
      },
    }),
    prisma.campaign.findMany({
      where: {
        organizationId: session.user.organizationId || undefined,
        status: 'ACTIVE'
      },
      take: 5,
      orderBy: { raised: 'desc' },
      select: {
        id: true,
        name: true,
        goal: true,
        raised: true,
        _count: {
          select: { donations: true }
        }
      }
    }),
  ])

  const totalRevenueAmount = totalRevenue._sum.amount || 0
  const averageDonation = totalDonationsCount > 0 ? totalRevenueAmount / totalDonationsCount : 0

  return (
    <DashboardLayout
      userName={session.user.name || session.user.email || 'User'}
      userRole={session.user.role}
      searchPlaceholder="Search contacts, donations, campaigns..."
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/70">Welcome back, {session.user.name || 'User'}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SagaCard variant="default">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white/70">Total Contacts</h3>
              <p className="text-3xl font-bold text-white mt-2">{totalContacts}</p>
              <p className="text-xs text-white/50 mt-1">{activeContacts} active</p>
            </div>
            <Users size={40} weight="bold" className="text-blue-400" />
          </div>
        </SagaCard>

        <SagaCard variant="purple">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white/70">Total Revenue</h3>
              <p className="text-3xl font-bold text-white mt-2">
                ${totalRevenueAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-white/50 mt-1">All time donations</p>
            </div>
            <CurrencyDollar size={40} weight="bold" className="text-green-400" />
          </div>
        </SagaCard>

        <SagaCard variant="orange">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white/70">Total Donations</h3>
              <p className="text-3xl font-bold text-white mt-2">{totalDonationsCount}</p>
              <p className="text-xs text-white/50 mt-1">
                ${averageDonation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} avg
              </p>
            </div>
            <Gift size={40} weight="bold" className="text-purple-400" />
          </div>
        </SagaCard>

        <SagaCard variant="pink">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white/70">Active Campaigns</h3>
              <p className="text-3xl font-bold text-white mt-2">{activeCampaigns.length}</p>
              <p className="text-xs text-white/50 mt-1">{totalCampaigns} total campaigns</p>
            </div>
            <ChartBar size={40} weight="bold" className="text-orange-400" />
          </div>
        </SagaCard>
      </div>

      {/* Recent Donations & Top Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <SagaCard title="Recent Donations" subtitle="Latest 5 donations">
          {recentDonations.length === 0 ? (
            <div className="text-center py-8">
              <CurrencyDollar size={48} weight="bold" className="text-white/30 mx-auto mb-3" />
              <p className="text-white/50 text-sm">
                No donations yet. Start by adding contacts and creating campaigns!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDonations.map((donation) => {
                const percentage = donation.status === 'COMPLETED' ? 100 :
                                   donation.status === 'PENDING' ? 50 : 0
                return (
                  <Link
                    key={donation.id}
                    href={`/donations/${donation.id}`}
                    className="block"
                  >
                    <div
                      className="p-4 rounded-lg transition-all hover:bg-white/5 bg-white/3 border border-white/10"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-medium">
                            {donation.contact.firstName} {donation.contact.lastName}
                          </p>
                          <p className="text-white/50 text-sm">
                            {donation.campaign?.name || 'No campaign'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">
                            ${donation.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-white/50 text-xs">
                            {new Date(donation.donatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`saga-badge ${
                            donation.status === 'COMPLETED'
                              ? 'saga-badge-completed'
                              : donation.status === 'PENDING'
                              ? 'saga-badge-pending'
                              : 'saga-badge-failed'
                          }`}
                        >
                          {donation.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </SagaCard>

        {/* Top Campaigns */}
        <SagaCard title="Top Campaigns" subtitle="Highest performing active campaigns">
          {topCampaigns.length === 0 ? (
            <div className="text-center py-8">
              <ChartBar size={48} weight="bold" className="text-white/30 mx-auto mb-3" />
              <p className="text-white/50 text-sm">
                No active campaigns. Create a campaign to start fundraising!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {topCampaigns.map((campaign) => {
                const percentage = campaign.goal && campaign.goal > 0 ? (campaign.raised / campaign.goal) * 100 : 0
                return (
                  <Link
                    key={campaign.id}
                    href={`/campaigns/${campaign.id}`}
                    className="block"
                  >
                    <div
                      className="p-4 rounded-lg transition-all hover:bg-white/5 bg-white/3 border border-white/10"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="text-white font-medium mb-1">{campaign.name}</p>
                          <p className="text-white/50 text-sm">
                            {campaign._count.donations} donation{campaign._count.donations !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold">
                            ${campaign.raised.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-white/50 text-xs">
                            of ${(campaign.goal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            percentage >= 100
                              ? 'bg-linear-to-r from-green-500 to-green-400'
                              : 'saga-button'
                          }`}
                          style={{
                            width: `${Math.min(percentage, 100)}%`
                          }}
                        />
                      </div>
                      <p className="text-white/50 text-xs mt-1">
                        {percentage.toFixed(1)}% of goal
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </SagaCard>
      </div>
    </DashboardLayout>
  )
}
