import { requireAuth, canViewContact } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import DashboardLayout from '@/components/DashboardLayout'
import SagaCard from '@/components/ui/saga-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { PencilSimple, CurrencyDollar, ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import DeleteContactButton from './DeleteContactButton'

export const runtime = 'nodejs'

const bricolage = { fontFamily: 'var(--font-bricolage), sans-serif' } as const
const twilightChip: React.CSSProperties = { background: '#EEE9F5', color: '#5B4B8A', border: '1px solid #DDD3EC' }
const neutralChip: React.CSSProperties = { background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)' }
const chipCls = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium'

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth()
  const { id } = await params

  const canView = await canViewContact(id)
  if (!canView) {
    redirect('/contacts')
  }

  const prisma = await getPrismaWithRLS()

  const contact = await prisma.contact.findFirst({
    where: { id, organizationId: session.user.organizationId ?? '__no_such_org__' },
    include: {
      donations: {
        orderBy: { donatedAt: 'desc' },
        include: { campaign: { select: { name: true } } },
      },
      interactions: {
        orderBy: { occurredAt: 'desc' },
        take: 10,
        include: { user: { select: { firstName: true, lastName: true } } },
      },
      _count: { select: { donations: true, interactions: true } },
    },
  })

  if (!contact) {
    notFound()
  }

  const lifetimeGiving = contact.donations.reduce((sum, d) => sum + d.amount, 0)
  const largestGift = contact.donations.length > 0 ? Math.max(...contact.donations.map((d) => d.amount)) : 0
  const averageGift = contact.donations.length > 0 ? lifetimeGiving / contact.donations.length : 0
  const lastGiftDate = contact.donations[0]?.donatedAt || null

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'saga-badge saga-badge-active'
      case 'INACTIVE': return 'saga-badge saga-badge-inactive'
      case 'DECEASED': return 'saga-badge saga-badge-deceased'
      case 'DO_NOT_CONTACT': return 'saga-badge saga-badge-do-not-contact'
      default: return 'saga-badge'
    }
  }

  return (
    <DashboardLayout userName={session.user.name || session.user.email || 'User'} userRole={session.user.role}>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
        <div>
          <Link href="/contacts" className="inline-flex items-center gap-1 text-[var(--ink-soft)] hover:text-[var(--ink)] mb-2 text-sm transition-colors">
            <ArrowLeft size={16} weight="bold" /> Back to Donors
          </Link>
          <h1 className="text-3xl font-bold text-[var(--ink)] mb-2" style={bricolage}>
            {contact.firstName} {contact.lastName}
          </h1>
          <div className="flex items-center gap-2">
            <span className={getStatusBadgeClass(contact.status)}>{contact.status}</span>
            <span className={chipCls} style={twilightChip}>{contact.type}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href={`/contacts/${contact.id}/edit`}>
            <Button variant="outline" className="text-[var(--ink)] border-[var(--line)] hover:bg-[var(--surface-2)] flex items-center gap-2">
              <PencilSimple size={18} weight="bold" />
              Edit Contact
            </Button>
          </Link>
          <DeleteContactButton contactId={contact.id} contactName={`${contact.firstName} ${contact.lastName}`} />
          <Link href={`/donations/new?contactId=${contact.id}`}>
            <Button className="saga-button text-white flex items-center gap-2 border-none">
              <CurrencyDollar size={18} weight="bold" />
              Add Donation
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SagaCard variant="pink">
          <h3 className="text-sm font-medium text-[var(--ink-soft)]">Lifetime Giving</h3>
          <p className="text-3xl font-bold text-[var(--ink)] mt-2 tabular-nums">
            ${lifetimeGiving.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </SagaCard>

        <SagaCard variant="default">
          <h3 className="text-sm font-medium text-[var(--ink-soft)]">Total Gifts</h3>
          <p className="text-3xl font-bold text-[var(--ink)] mt-2 tabular-nums">{contact._count.donations}</p>
        </SagaCard>

        <SagaCard variant="orange">
          <h3 className="text-sm font-medium text-[var(--ink-soft)]">Largest Gift</h3>
          <p className="text-3xl font-bold text-[var(--ink)] mt-2 tabular-nums">
            ${largestGift.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </SagaCard>

        <SagaCard variant="purple">
          <h3 className="text-sm font-medium text-[var(--ink-soft)]">Average Gift</h3>
          <p className="text-3xl font-bold text-[var(--ink)] mt-2 tabular-nums">
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
                <p className="text-xs text-[var(--ink-faint)] uppercase">Email</p>
                <p className="text-[var(--ink)]">{contact.email}</p>
              </div>
              {contact.phone && (
                <div>
                  <p className="text-xs text-[var(--ink-faint)] uppercase">Phone</p>
                  <p className="text-[var(--ink)]">{contact.phone}</p>
                </div>
              )}
              {(contact.street || contact.city || contact.state || contact.zip) && (
                <div>
                  <p className="text-xs text-[var(--ink-faint)] uppercase">Address</p>
                  <p className="text-[var(--ink)]">
                    {contact.street && <>{contact.street}<br /></>}
                    {contact.city && contact.state && `${contact.city}, ${contact.state} `}
                    {contact.zip}
                    {contact.country && contact.country !== 'USA' && <><br />{contact.country}</>}
                  </p>
                </div>
              )}
              {contact.tags && contact.tags.length > 0 && (
                <div>
                  <p className="text-xs text-[var(--ink-faint)] uppercase mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map((tag: string, i: number) => (
                      <span key={i} className={chipCls} style={neutralChip}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              {contact.notes && (
                <div>
                  <p className="text-xs text-[var(--ink-faint)] uppercase">Notes</p>
                  <p className="text-[var(--ink-soft)] text-sm">{contact.notes}</p>
                </div>
              )}
              {lastGiftDate && (
                <div>
                  <p className="text-xs text-[var(--ink-faint)] uppercase">Last Gift</p>
                  <p className="text-[var(--ink)]">
                    {new Date(lastGiftDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              )}
            </div>
          </SagaCard>
        </div>

        {/* Donation History */}
        <div className="lg:col-span-2">
          <SagaCard title="Donation History" subtitle={`${contact._count.donations} total donations`}>
            {contact.donations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[var(--ink-soft)] mb-4">No donations yet</p>
                <Link href={`/donations/new?contactId=${contact.id}`}>
                  <Button className="saga-button text-white inline-flex items-center gap-2 border-none">
                    <CurrencyDollar size={18} weight="bold" />
                    Record First Donation
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {contact.donations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 rounded-lg transition-colors hover:bg-[var(--paper)] border border-[var(--line)]">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-lg font-semibold text-[#4A8C6F] tabular-nums">
                          ${donation.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <span className={chipCls} style={neutralChip}>{donation.method}</span>
                        {donation.campaign && <span className={chipCls} style={twilightChip}>{donation.campaign.name}</span>}
                      </div>
                      <p className="text-sm text-[var(--ink-soft)] mt-1">
                        {new Date(donation.donatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <Link href={`/donations/${donation.id}`}>
                      <Button variant="ghost" size="sm" className="text-[#5B4B8A] hover:text-[#E0507A] hover:bg-[var(--surface-2)]">
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
        <SagaCard title="Recent Interactions" subtitle={`${contact._count.interactions} total interactions`}>
          <div className="space-y-3">
            {contact.interactions.map((interaction) => (
              <div key={interaction.id} className="p-4 rounded-lg border border-[var(--line)]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={chipCls} style={neutralChip}>{interaction.type}</span>
                      <p className="text-[var(--ink)] font-medium">{interaction.subject}</p>
                    </div>
                    {interaction.notes && <p className="text-[var(--ink-soft)] text-sm">{interaction.notes}</p>}
                    <p className="text-xs text-[var(--ink-faint)] mt-2">
                      {interaction.user.firstName} {interaction.user.lastName} •{' '}
                      {new Date(interaction.occurredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
