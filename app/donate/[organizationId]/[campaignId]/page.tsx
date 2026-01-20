import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PublicDonationForm from '@/components/public/PublicDonationForm'
import { Metadata } from 'next'

// Force dynamic rendering - prevents build-time database queries
export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    organizationId: string
    campaignId: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const campaign = await prisma.campaign.findUnique({
    where: { id: params.campaignId },
    include: { organization: { select: { name: true } } }
  })

  if (!campaign) {
    return {
      title: 'Campaign Not Found'
    }
  }

  return {
    title: `${campaign.name} - ${campaign.organization.name}`,
    description: campaign.description || `Support ${campaign.name}`,
    openGraph: {
      title: campaign.name,
      description: campaign.description || `Support ${campaign.name}`,
      type: 'website'
    }
  }
}

export default async function CampaignDonatePage({ params }: PageProps) {
  // Fetch campaign with organization details
  const campaign = await prisma.campaign.findUnique({
    where: {
      id: params.campaignId,
      organizationId: params.organizationId
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          missionStatement: true,
          website: true,
          email: true,
          taxExemptStatus: true,
          ein: true
        }
      }
    }
  })

  if (!campaign) {
    notFound()
  }

  // Check if campaign is active
  const now = new Date()
  const isActive =
    campaign.status === 'ACTIVE' &&
    (!campaign.startDate || campaign.startDate <= now) &&
    (!campaign.endDate || campaign.endDate >= now)

  if (!isActive && campaign.status !== 'ACTIVE') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] p-8 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Campaign Unavailable</h1>
          <p className="text-white/70">
            This campaign is not currently accepting donations.
          </p>
          {campaign.status === 'COMPLETED' && (
            <p className="text-white/60 text-sm mt-2">
              This campaign has ended. Thank you to all who supported it!
            </p>
          )}
        </div>
      </div>
    )
  }

  // Calculate progress
  const progressPercentage = campaign.goal
    ? Math.min((campaign.raised / campaign.goal) * 100, 100)
    : 0

  return (
    <>
      <PublicDonationForm
        organizationId={campaign.organization.id}
        organizationName={campaign.organization.name}
        campaignId={campaign.id}
        campaignName={campaign.name}
      />

      {/* Campaign Details Footer */}
      <div className="max-w-2xl mx-auto px-8 pb-8">
        {/* Campaign Progress */}
        {campaign.goal && campaign.goal > 0 && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Campaign Progress</span>
              <span className="text-white/70">
                ${campaign.raised.toLocaleString()} of ${campaign.goal.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-orange-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2 text-sm">
              <span className="text-white/60">
                {progressPercentage.toFixed(0)}% funded
              </span>
              {campaign.endDate && campaign.endDate > now && (
                <span className="text-white/60">
                  Ends {campaign.endDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Campaign Description */}
        {campaign.description && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-4">
            <h2 className="text-xl font-bold text-white mb-3">
              About This Campaign
            </h2>
            <p className="text-white/70 whitespace-pre-wrap">
              {campaign.description}
            </p>
          </div>
        )}

        {/* Organization Info */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            About {campaign.organization.name}
          </h2>

          {campaign.organization.missionStatement && (
            <p className="text-white/70 mb-4">
              {campaign.organization.missionStatement}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {campaign.organization.taxExemptStatus === 'EXEMPT_501C3' && (
              <div>
                <span className="text-white/50">Tax Status:</span>
                <span className="text-white ml-2">501(c)(3) Nonprofit</span>
              </div>
            )}

            {campaign.organization.ein && (
              <div>
                <span className="text-white/50">Tax ID (EIN):</span>
                <span className="text-white ml-2">{campaign.organization.ein}</span>
              </div>
            )}

            {campaign.organization.website && (
              <div>
                <span className="text-white/50">Website:</span>
                <a
                  href={campaign.organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 ml-2"
                >
                  {campaign.organization.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}

            {campaign.organization.email && (
              <div>
                <span className="text-white/50">Contact:</span>
                <a
                  href={`mailto:${campaign.organization.email}`}
                  className="text-purple-400 hover:text-purple-300 ml-2"
                >
                  {campaign.organization.email}
                </a>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/50 text-xs">
              Your donation is tax-deductible to the extent allowed by law.
              {campaign.organization.taxExemptStatus === 'EXEMPT_501C3' && ` ${campaign.organization.name} is a 501(c)(3) tax-exempt organization.`}
              {campaign.organization.ein && ` Tax ID: ${campaign.organization.ein}.`}
              {' '}No goods or services were provided in exchange for your donation.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
