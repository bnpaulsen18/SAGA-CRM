import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import DashboardLayout from '@/components/DashboardLayout'
import ContactsTable from '@/components/contacts/ContactsTable'
import SagaCard from '@/components/ui/saga-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const runtime = 'nodejs'

export default async function ContactsPage() {
  const session = await requireAuth()
  const prisma = await getPrismaWithRLS()

  // Fetch contacts with ALL their donations in one query (fixes N+1 problem)
  // RLS: Contacts are automatically filtered by organizationId at the database level
  const contacts = await prisma.contact.findMany({
    where: {
      organizationId: session.user.organizationId || undefined
    },
    include: {
      donations: {
        select: { amount: true, donatedAt: true }
      }
    },
    orderBy: { lastName: 'asc' },
    take: 100 // Initial page - TODO: Add pagination
  })

  // Calculate stats in memory (1 query instead of 101!)
  const contactsWithStats = contacts.map((contact) => {
    const lifetimeGiving = contact.donations.reduce((sum, d) => sum + d.amount, 0)
    const sortedDonations = contact.donations.sort((a, b) =>
      b.donatedAt.getTime() - a.donatedAt.getTime()
    )

    return {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      status: contact.status,
      type: contact.type,
      donationCount: contact.donations.length,
      lifetimeGiving,
      lastGiftDate: sortedDonations[0]?.donatedAt || null,
      lastGiftAmount: sortedDonations[0]?.amount || null,
      street: contact.street,
      city: contact.city,
      state: contact.state,
      zip: contact.zip,
      country: contact.country,
      tags: contact.tags,
      notes: contact.notes,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt
    }
  })

  // Calculate stats
  const totalContacts = contacts.length
  const activeContacts = contacts.filter(c => c.status === 'ACTIVE').length
  const donorContacts = contacts.filter(c => c.type === 'DONOR').length
  const totalLifetimeGiving = contactsWithStats.reduce((sum, c) => sum + c.lifetimeGiving, 0)

  return (
    <DashboardLayout
      userName={session.user.name || session.user.email || 'User'}
      userRole={session.user.role}
      searchPlaceholder="Search contacts by name, email, phone..."
    >
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Contacts</h1>
          <p className="text-white/70">Manage your donor relationships</p>
        </div>
        <div className="flex gap-3">
          <Link href="/contacts/import">
            <Button
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10 hover:text-white hover:border-white/50"
            >
              📁 Import CSV
            </Button>
          </Link>
          <Link href="/contacts/new">
            <Button
              className="text-white font-semibold"
              style={{
                background: 'linear-gradient(to right, #764ba2, #ff6b35)',
                border: 'none'
              }}
            >
              ➕ Add Contact
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SagaCard variant="default">
          <h3 className="text-sm font-medium text-white/70">Total Contacts</h3>
          <p className="text-3xl font-bold text-white mt-2">{totalContacts}</p>
          <p className="text-xs text-white/50 mt-1">All contact records</p>
        </SagaCard>

        <SagaCard variant="purple">
          <h3 className="text-sm font-medium text-white/70">Active Contacts</h3>
          <p className="text-3xl font-bold text-white mt-2">{activeContacts}</p>
          <p className="text-xs text-white/50 mt-1">Can be contacted</p>
        </SagaCard>

        <SagaCard variant="orange">
          <h3 className="text-sm font-medium text-white/70">Donors</h3>
          <p className="text-3xl font-bold" style={{ color: '#ff6b35' }}>
            {donorContacts}
          </p>
          <p className="text-xs text-white/50 mt-1">Contact type: Donor</p>
        </SagaCard>

        <SagaCard variant="pink">
          <h3 className="text-sm font-medium text-white/70">Lifetime Giving</h3>
          <p className="text-3xl font-bold text-white mt-2">
            ${totalLifetimeGiving.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-white/50 mt-1">Total donations received</p>
        </SagaCard>
      </div>

      {/* Contacts Table */}
      <ContactsTable data={contactsWithStats} />
    </DashboardLayout>
  )
}
