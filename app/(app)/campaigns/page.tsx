import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
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
      organizationId: session.user.organizationId ?? '__no_such_org__',
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
    <>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--ink)] mb-2" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>Campaigns</h1>
          <p className="text-[var(--ink-soft)]">Manage your fundraising campaigns</p>
        </div>
        <Link href="/campaigns/new">
          <Button
            className="text-white font-semibold flex items-center gap-2 saga-button border-none"
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
              <h3 className="text-sm font-medium text-[var(--ink-soft)]">Total Campaigns</h3>
              <p className="text-3xl font-bold text-[var(--ink)] mt-2 tabular-nums">{campaigns.length}</p>
              <p className="text-xs text-[var(--ink-faint)] mt-1">All campaigns</p>
            </div>
            <Target size={40} weight="bold" className="text-[var(--ink-faint)]" />
          </div>
        </SagaCard>

        <SagaCard variant="purple">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[var(--ink-soft)]">Active Campaigns</h3>
              <p className="text-3xl font-bold text-[var(--ink)] mt-2 tabular-nums">{activeCampaigns}</p>
              <p className="text-xs text-[var(--ink-faint)] mt-1">Currently fundraising</p>
            </div>
            <CheckCircle size={40} weight="bold" className="text-[#4A8C6F]" />
          </div>
        </SagaCard>

        <SagaCard variant="orange">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[var(--ink-soft)]">Total Raised</h3>
              <p className="text-3xl font-bold text-[var(--ink)] mt-2 tabular-nums">
                ${totalRaised.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-[var(--ink-faint)] mt-1">
                of ${totalGoal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} goal
              </p>
            </div>
            <CurrencyDollar size={40} weight="bold" className="text-[#4A8C6F]" />
          </div>
        </SagaCard>
      </div>

      {/* Campaigns Grid */}
      {campaigns.length === 0 ? (
        <SagaCard>
          <div className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <Rocket size={64} weight="bold" className="text-[var(--ink-faint)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--ink)] mb-2">No campaigns yet</h3>
            <p className="text-[var(--ink-soft)] mb-6">Create your first fundraising campaign to get started</p>
            <Link href="/campaigns/new">
              <Button
                className="text-white font-semibold saga-button border-none"
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
    </>
  )
}
