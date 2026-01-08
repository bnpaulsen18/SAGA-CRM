import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import DashboardLayout from '@/components/DashboardLayout'
import SagaCard from '@/components/ui/saga-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Target, CheckCircle, CurrencyDollar, Rocket, Plus } from '@phosphor-icons/react/dist/ssr'
import CampaignCard from '@/components/campaigns/CampaignCard'

export const runtime = 'nodejs'

export default async function CampaignsPage() {
  const session = await requireAuth()
  const prisma = await getPrismaWithRLS()

  // Fetch campaigns for the user's organization
  const campaigns = await prisma.campaign.findMany({
    where: {
      organizationId: session.user.organizationId || undefined,
    },
    include: {
      _count: {
        select: {
          donations: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Calculate stats
  const totalGoal = campaigns.reduce((sum, c) => sum + (c.goal || 0), 0)
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0)
  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length

  return (
    <DashboardLayout
      userName={session.user.name || session.user.email || 'User'}
      userRole={session.user.role}
      searchPlaceholder="Search campaigns by name, status..."
    >
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Campaigns</h1>
          <p className="text-white/70">Manage your fundraising campaigns</p>
        </div>
        <Link href="/campaigns/new">
          <Button
            className="text-white font-semibold flex items-center gap-2"
            style={{
              background: 'linear-gradient(to right, #764ba2, #ff6b35)',
              border: 'none'
            }}
          >
            <Plus size={18} weight="bold" />
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SagaCard variant="default">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white/70">Total Campaigns</h3>
              <p className="text-3xl font-bold text-white mt-2">{campaigns.length}</p>
              <p className="text-xs text-white/50 mt-1">All campaigns</p>
            </div>
            <Target size={40} weight="bold" className="text-blue-400" />
          </div>
        </SagaCard>

        <SagaCard variant="purple">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white/70">Active Campaigns</h3>
              <p className="text-3xl font-bold text-green-400 mt-2">{activeCampaigns}</p>
              <p className="text-xs text-white/50 mt-1">Currently fundraising</p>
            </div>
            <CheckCircle size={40} weight="bold" className="text-green-400" />
          </div>
        </SagaCard>

        <SagaCard variant="orange">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white/70">Total Raised</h3>
              <p className="text-3xl font-bold text-white mt-2">
                ${totalRaised.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-white/50 mt-1">
                of ${totalGoal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} goal
              </p>
            </div>
            <CurrencyDollar size={40} weight="bold" className="text-green-400" />
          </div>
        </SagaCard>
      </div>

      {/* Campaigns Grid */}
      {campaigns.length === 0 ? (
        <SagaCard>
          <div className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <Rocket size={64} weight="bold" className="text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No campaigns yet</h3>
            <p className="text-white/60 mb-6">Create your first fundraising campaign to get started</p>
            <Link href="/campaigns/new">
              <Button
                className="text-white font-semibold"
                style={{
                  background: 'linear-gradient(to right, #764ba2, #ff6b35)',
                  border: 'none'
                }}
              >
                Create First Campaign
              </Button>
            </Link>
          </div>
        </SagaCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
