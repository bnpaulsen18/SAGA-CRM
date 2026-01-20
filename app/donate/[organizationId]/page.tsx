import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PublicDonationForm from '@/components/public/PublicDonationForm'
import { Metadata } from 'next'

// Force dynamic rendering - prevents build-time database queries
export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    organizationId: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const organization = await prisma.organization.findUnique({
    where: { id: params.organizationId },
    select: { name: true, missionStatement: true }
  })

  if (!organization) {
    return {
      title: 'Organization Not Found'
    }
  }

  return {
    title: `Donate to ${organization.name}`,
    description: organization.missionStatement || `Support ${organization.name} with a tax-deductible donation`,
    openGraph: {
      title: `Donate to ${organization.name}`,
      description: organization.missionStatement || `Support ${organization.name}`,
      type: 'website'
    }
  }
}

export default async function OrganizationDonatePage({ params }: PageProps) {
  // Fetch organization details
  const organization = await prisma.organization.findUnique({
    where: { id: params.organizationId },
    select: {
      id: true,
      name: true,
      missionStatement: true,
      website: true,
      email: true,
      taxExemptStatus: true,
      ein: true
    }
  })

  if (!organization) {
    notFound()
  }

  return (
    <>
      <PublicDonationForm
        organizationId={organization.id}
        organizationName={organization.name}
      />

      {/* Organization Info Footer */}
      <div className="max-w-2xl mx-auto px-8 pb-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            About {organization.name}
          </h2>

          {organization.missionStatement && (
            <p className="text-white/70 mb-4">
              {organization.missionStatement}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {organization.taxExemptStatus === 'EXEMPT_501C3' && (
              <div>
                <span className="text-white/50">Tax Status:</span>
                <span className="text-white ml-2">501(c)(3) Nonprofit</span>
              </div>
            )}

            {organization.ein && (
              <div>
                <span className="text-white/50">Tax ID (EIN):</span>
                <span className="text-white ml-2">{organization.ein}</span>
              </div>
            )}

            {organization.website && (
              <div>
                <span className="text-white/50">Website:</span>
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 ml-2"
                >
                  {organization.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}

            {organization.email && (
              <div>
                <span className="text-white/50">Contact:</span>
                <a
                  href={`mailto:${organization.email}`}
                  className="text-purple-400 hover:text-purple-300 ml-2"
                >
                  {organization.email}
                </a>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/50 text-xs">
              Your donation is tax-deductible to the extent allowed by law.
              {organization.taxExemptStatus === 'EXEMPT_501C3' && ` ${organization.name} is a 501(c)(3) tax-exempt organization.`}
              {organization.ein && ` Tax ID: ${organization.ein}.`}
              {' '}No goods or services were provided in exchange for your donation.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
