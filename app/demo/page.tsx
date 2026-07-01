import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getDemoOrgIdOrThrow } from '@/lib/dashboard/demo-org'
import { buildDashboardViewModel, dateStrFor } from '@/lib/dashboard/build-dashboard-viewmodel'
import { KpiGrid, CampaignsPanel, RecentDonationsPanel, bricolage, type LinkFor } from '@/components/dashboard/DashboardSections'
import DemoDonorSections from '@/components/dashboard/DemoDonorSections'
import ComingSoonAgents from '@/components/dashboard/ComingSoonAgents'
import DemoShell from '@/components/dashboard/DemoShell'

// Public, unauthenticated page — always fetch fresh (matches the existing
// public /donate/[organizationId] pages' convention). Explicit, not the
// Next.js default: omitting this would silently make the page static at
// BUILD time instead, freezing the KPIs from whenever the last deploy ran.
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata: Metadata = {
  title: 'Live Product Preview',
  description: 'See the SAGA dashboard in action with sample donor data — no account required.',
  // Requestable and shareable, but not search-indexed for now.
  robots: { index: false, follow: true },
}

const linkFor: LinkFor = () => '/register'

export default async function DemoPage() {
  const organizationId = await getDemoOrgIdOrThrow(prisma)
  const now = new Date()
  const vm = await buildDashboardViewModel(prisma, organizationId, { now })
  const dateStr = dateStrFor(now)

  return (
    <DemoShell>
      <div className="mb-8">
        <h1 style={bricolage} className="text-3xl font-bold text-[var(--ink)]">See SAGA in action</h1>
        <p className="text-[var(--ink-soft)] mt-1">
          {vm.organizationName}&rsquo;s dashboard, exactly as their team sees it · {dateStr}
        </p>
      </div>

      <KpiGrid kpis={vm.kpis} />

      <DemoDonorSections vm={vm} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CampaignsPanel campaigns={vm.campaigns} linkFor={linkFor} />
        <RecentDonationsPanel donations={vm.recentDonations} linkFor={linkFor} />
      </div>

      <ComingSoonAgents />
    </DemoShell>
  )
}
