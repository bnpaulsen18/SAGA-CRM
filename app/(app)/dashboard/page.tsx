import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import { redirect } from 'next/navigation'
import { trustOrgIdFromSession } from '@/lib/dashboard/demo-org'
import { buildDashboardViewModel, greetingFor, dateStrFor } from '@/lib/dashboard/build-dashboard-viewmodel'
import {
  KpiGrid, MorningBrief, GivingChart, AttentionTable, CampaignsPanel, RecentDonationsPanel,
  bricolage, type LinkFor,
} from '@/components/dashboard/DashboardSections'

export const runtime = 'nodejs'

const linkFor: LinkFor = (kind, id) => {
  switch (kind) {
    case 'contact': return `/contacts/${id}`
    case 'contacts': return '/contacts'
    case 'campaign': return `/campaigns/${id}`
    case 'campaigns': return '/campaigns'
    case 'donation': return `/donations/${id}`
    case 'donations': return '/donations'
    case 'reports': return '/reports'
  }
}

export default async function DashboardPage() {
  const session = await requireAuth()

  if (session.user.isPlatformAdmin || !session.user.organizationId) {
    redirect('/admin')
  }

  const prisma = await getPrismaWithRLS()
  const organizationId = trustOrgIdFromSession(session.user.organizationId)
  const now = new Date()

  const vm = await buildDashboardViewModel(prisma, organizationId, { now })

  const greeting = greetingFor(now)
  const firstName = (session.user.name || 'there').split(' ')[0]
  const dateStr = dateStrFor(now)

  return (
    <>
      {/* Greeting */}
      <div className="mb-8">
        <h1 style={bricolage} className="text-3xl font-bold text-[var(--ink)]">{greeting}, {firstName}</h1>
        <p className="text-[var(--ink-soft)] mt-1">
          Where {vm.organizationName} stands today · {dateStr}
        </p>
      </div>

      <KpiGrid kpis={vm.kpis} />

      <MorningBrief vm={vm} linkFor={linkFor} />

      {/* Giving over time + Donors needing attention */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <GivingChart months={vm.months} linkFor={linkFor} />
        <AttentionTable vm={vm} linkFor={linkFor} />
      </div>

      {/* Campaigns + Recent donations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CampaignsPanel campaigns={vm.campaigns} linkFor={linkFor} />
        <RecentDonationsPanel donations={vm.recentDonations} linkFor={linkFor} />
      </div>
    </>
  )
}
