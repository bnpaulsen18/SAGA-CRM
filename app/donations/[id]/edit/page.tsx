import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import DashboardLayout from '@/components/DashboardLayout'
import SagaCard from '@/components/ui/saga-card'
import DonationEditForm from '@/components/donations/DonationEditForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const runtime = 'nodejs'

interface DonationEditPageProps {
  params: {
    id: string
  }
}

export default async function DonationEditPage({ params }: DonationEditPageProps) {
  const session = await requireAuth()
  const prisma = await getPrismaWithRLS()

  // Fetch donation data
  const donation = await prisma.donation.findFirst({
    where: {
      id: params.id,
      organizationId: session.user.organizationId || undefined
    },
    include: {
      contact: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      },
      campaign: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  if (!donation) {
    notFound()
  }

  // Fetch contacts and campaigns for dropdowns
  const [contacts, campaigns] = await Promise.all([
    prisma.contact.findMany({
      where: {
        organizationId: session.user.organizationId || undefined,
        status: 'ACTIVE'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      },
      orderBy: { lastName: 'asc' }
    }),
    prisma.campaign.findMany({
      where: {
        organizationId: session.user.organizationId || undefined
      },
      select: {
        id: true,
        name: true
      },
      orderBy: { name: 'asc' }
    })
  ])

  return (
    <DashboardLayout
      userName={session.user.name || session.user.email || 'User'}
      userRole={session.user.role}
    >
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link href={`/donations/${params.id}`} className="text-white/70 hover:text-white">
            ← Back to Donation
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Edit Donation: ${donation.amount.toLocaleString()}
        </h1>
        <p className="text-white/70">
          Update donation from {donation.contact.firstName} {donation.contact.lastName}
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl">
        <SagaCard title="Donation Information">
          <DonationEditForm
            donation={donation}
            contacts={contacts}
            campaigns={campaigns}
          />
        </SagaCard>
      </div>
    </DashboardLayout>
  )
}
