import { requireAuth, canViewContact } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import DashboardLayout from '@/components/DashboardLayout'
import SagaCard from '@/components/ui/saga-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { PencilSimple, CurrencyDollar } from '@phosphor-icons/react/dist/ssr'

export const runtime = 'nodejs'

interface ContactDetailPageProps {
  params: {
    id: string
  }
}

export default async function ContactDetailPage({ params }: ContactDetailPageProps) {
  const session = await requireAuth()

  // Verify permission to view this contact
  const canView = await canViewContact(params.id)
  if (!canView) {
    redirect('/contacts')
  }

  const prisma = await getPrismaWithRLS()

  // Fetch contact with all related data
  const contact = await prisma.contact.findFirst({
    where: {
      id: params.id,
      organizationId: session.user.organizationId || undefined
    },
    include: {
      donations: {
        orderBy: { donatedAt: 'desc' },
        include: {
          campaign: {
            select: { name: true }
          }
        }
      },
      interactions: {
        orderBy: { occurredAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: { firstName: true, lastName: true }
          }
        }
      },
      _count: {
        select: { donations: true, interactions: true }
      }
    }
  })

  if (!contact) {
    notFound()
  }

  // Calculate stats
  const lifetimeGiving = contact.donations.reduce((sum, d) => sum + d.amount, 0)
  const largestGift = contact.donations.length > 0
    ? Math.max(...contact.donations.map(d => d.amount))
    : 0
  const averageGift = contact.donations.length > 0
    ? lifetimeGiving / contact.donations.length
    : 0
  const lastGiftDate = contact.donations[0]?.donatedAt || null

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'saga-badge saga-badge-active'
      case 'INACTIVE':
        return 'saga-badge saga-badge-inactive'
      case 'DECEASED':
        return 'saga-badge saga-badge-deceased'
      case 'DO_NOT_CONTACT':
        return 'saga-badge saga-badge-do-not-contact'
      default:
        return 'saga-badge'
    }
  }

  return (
    <DashboardLayout
      userName={session.user.name || session.user.email || 'User'}
      userRole={session.user.role}
    >
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/contacts" className="text-white/70 hover:text-white">
              ← Back to Contacts
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {contact.firstName} {contact.lastName}
          </h1>
          <div className="flex items-center gap-3">
            <span className={getStatusBadgeClass(contact.status)}>
              {contact.status}
            </span>
            <span className="saga-badge bg-purple-500/20 border-purple-500/40 text-white">
              {contact.type}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href={`/contacts/${contact.id}/edit`}>
            <Button
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10 flex items-center gap-2"
            >
              <PencilSimple size={18} weight="bold" />
              Edit Contact
            </Button>
          </Link>
          <Button className="saga-button text-white flex items-center gap-2 border-none">
            <CurrencyDollar size={18} weight="bold" />
            Add Donation
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SagaCard variant="pink">
          <h3 className="text-sm font-medium text-white/70">Lifetime Giving</h3>
          <p className="text-3xl font-bold text-white mt-2">
            ${lifetimeGiving.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </SagaCard>

        <SagaCard variant="default">
          <h3 className="text-sm font-medium text-white/70">Total Gifts</h3>
          <p className="text-3xl font-bold text-white mt-2">{contact._count.donations}</p>
        </SagaCard>

        <SagaCard variant="orange">
          <h3 className="text-sm font-medium text-white/70">Largest Gift</h3>
          <p className="text-3xl font-bold saga-text-orange">
            ${largestGift.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </SagaCard>

        <SagaCard variant="purple">
          <h3 className="text-sm font-medium text-white/70">Average Gift</h3>
          <p className="text-3xl font-bold text-white mt-2">
            ${averageGift.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </SagaCard>
      </div>

      {/* Contact Information & Donation History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <SagaCard title="Contact Information">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-white/50 uppercase">Email</p>
                <p className="text-white">{contact.email}</p>
              </div>
              {contact.phone && (
                <div>
                  <p className="text-xs text-white/50 uppercase">Phone</p>
                  <p className="text-white">{contact.phone}</p>
                </div>
              )}
              {(contact.street || contact.city || contact.state || contact.zip) && (
                <div>
                  <p className="text-xs text-white/50 uppercase">Address</p>
                  <p className="text-white">
                    {contact.street && <>{contact.street}<br /></>}
                    {contact.city && contact.state && `${contact.city}, ${contact.state} `}
                    {contact.zip}
                    {contact.country && contact.country !== 'USA' && <><br />{contact.country}</>}
                  </p>
                </div>
              )}
              {contact.tags && contact.tags.length > 0 && (
                <div>
                  <p className="text-xs text-white/50 uppercase mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="saga-badge text-xs bg-orange-500/20 border-orange-500/40 text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {contact.notes && (
                <div>
                  <p className="text-xs text-white/50 uppercase">Notes</p>
                  <p className="text-white/80 text-sm">{contact.notes}</p>
                </div>
              )}
              {lastGiftDate && (
                <div>
                  <p className="text-xs text-white/50 uppercase">Last Gift</p>
                  <p className="text-white">
                    {new Date(lastGiftDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </SagaCard>
        </div>

        {/* Donation History */}
        <div className="lg:col-span-2">
          <SagaCard
            title="Donation History"
            subtitle={`${contact._count.donations} total donations`}
          >
            {contact.donations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/70 mb-4">No donations yet</p>
                <Button className="saga-button text-white flex items-center gap-2 border-none">
                  <CurrencyDollar size={18} weight="bold" />
                  Record First Donation
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {contact.donations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-4 rounded-lg transition-colors hover:bg-white/5 border border-white/10"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-semibold text-green-400">
                          ${donation.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <span className="saga-badge text-xs bg-purple-500/20 border-purple-500/40 text-white">
                          {donation.method}
                        </span>
                        {donation.campaign && (
                          <span className="saga-badge text-xs bg-orange-500/20 border-orange-500/40 text-white">
                            {donation.campaign.name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/70 mt-1">
                        {new Date(donation.donatedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <Link href={`/donations/${donation.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-orange-400 hover:text-orange-500 hover:bg-white/10"
                      >
                        View →
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </SagaCard>
        </div>
      </div>

      {/* Recent Interactions */}
      {contact.interactions.length > 0 && (
        <SagaCard
          title="Recent Interactions"
          subtitle={`${contact._count.interactions} total interactions`}
        >
          <div className="space-y-3">
            {contact.interactions.map((interaction) => (
              <div
                key={interaction.id}
                className="p-4 rounded-lg border border-white/10"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="saga-badge text-xs bg-orange-500/20 border-orange-500/40 text-white">
                        {interaction.type}
                      </span>
                      <p className="text-white font-medium">{interaction.subject}</p>
                    </div>
                    {interaction.notes && (
                      <p className="text-white/70 text-sm">{interaction.notes}</p>
                    )}
                    <p className="text-xs text-white/50 mt-2">
                      {interaction.user.firstName} {interaction.user.lastName} •{' '}
                      {new Date(interaction.occurredAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SagaCard>
      )}
    </DashboardLayout>
  )
}
