import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PublicDonationForm from '@/components/public/PublicDonationForm'

// Force dynamic rendering - prevents build-time database queries
export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    organizationId: string
  }
  searchParams: {
    campaignId?: string
  }
}

export default async function DonationWidgetPage({ params, searchParams }: PageProps) {
  // Fetch organization details
  const organization = await prisma.organization.findUnique({
    where: { id: params.organizationId },
    select: {
      id: true,
      name: true
    }
  })

  if (!organization) {
    notFound()
  }

  // Optionally fetch campaign if campaignId provided
  let campaign = null
  if (searchParams.campaignId) {
    campaign = await prisma.campaign.findUnique({
      where: {
        id: searchParams.campaignId,
        organizationId: params.organizationId
      },
      select: {
        id: true,
        name: true,
        status: true
      }
    })

    // If campaign not found or not active, ignore it
    if (!campaign || campaign.status !== 'ACTIVE') {
      campaign = null
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      <PublicDonationForm
        organizationId={organization.id}
        organizationName={organization.name}
        campaignId={campaign?.id}
        campaignName={campaign?.name}
        embedded={true}
      />
    </div>
  )
}
