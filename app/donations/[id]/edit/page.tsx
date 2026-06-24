import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import DashboardLayout from '@/components/DashboardLayout'
import SagaCard from '@/components/ui/saga-card'
import DonationEditForm from '@/components/donations/DonationEditForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const runtime = 'nodejs'

export default async function DonationEditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth()
  const { id } = await params
  const prisma = await getPrismaWithRLS()

  const donation = await prisma.donation.findFirst({
    where: { id, organizationId: session.user.organizationId ?? '__no_such_org__' },
    include: {
      contact: { select: { id: true, firstName: true, lastName: true, email: true } },
      campaign: { select: { id: true, name: true } },
    },
  })

  if (!donation) {
    notFound()
  }

  const [contacts, campaigns] = await Promise.all([
    prisma.contact.findMany({
      where: { organizationId: session.user.organizationId ?? '__no_such_org__', status: 'ACTIVE' },
      select: { id: true, firstName: true, lastName: true, email: true },
      orderBy: { lastName: 'asc' },
    }),
    prisma.campaign.findMany({
      where: { organizationId: session.user.organizationId ?? '__no_such_org__' },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <DashboardLayout userName={session.user.name || session.user.email || 'User'} userRole={session.user.role}>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link href={`/donations/${id}`} className="text-[var(--ink-soft)] hover:text-[var(--ink)] text-sm transition-colors">
            ← Back to Donation
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-[var(--ink)] mb-2" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
          Edit Donation: ${donation.amount.toLocaleString()}
        </h1>
        <p className="text-[var(--ink-soft)]">
          Update donation from {donation.contact.firstName} {donation.contact.lastName}
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl">
        <SagaCard title="Donation Information">
          <DonationEditForm donation={donation} contacts={contacts} campaigns={campaigns} />
        </SagaCard>
      </div>
    </DashboardLayout>
  )
}
