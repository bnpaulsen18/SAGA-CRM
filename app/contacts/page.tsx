import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import DashboardLayout from '@/components/DashboardLayout'
import ContactsTable from '@/components/contacts/ContactsTable'
import ContactsFilters from '@/components/contacts/ContactsFilters'
import SagaCard from '@/components/ui/saga-card'
import { Button } from '@/components/ui/button'
import { FolderOpen, Plus } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

export const runtime = 'nodejs'

interface ContactsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
  const session = await requireAuth()
  const prisma = await getPrismaWithRLS()

  // Parse pagination and filter params from URL
  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = Number(params.limit) || 50
  const skip = (page - 1) * limit

  // Parse filter parameters
  const status = params.status as string | undefined
  const type = params.type as string | undefined
  const minLifetimeGiving = params.minLifetimeGiving as string | undefined
  const maxLifetimeGiving = params.maxLifetimeGiving as string | undefined

  // Build dynamic where clause based on filters
  const baseWhere: any = {
    organizationId: session.user.organizationId || undefined
  }

  // Apply filters to base where clause
  const filterWhere = { ...baseWhere }

  if (status && status !== 'all') {
    filterWhere.status = status
  }

  if (type && type !== 'all') {
    filterWhere.type = type
  }

  // Get total counts for accurate stats (use baseWhere for org-wide stats, filterWhere for filtered count)
  const [totalContactsCount, activeContactsCount, donorContactsCount, lifetimeGivingAggregate] = await Promise.all([
    prisma.contact.count({
      where: baseWhere
    }),
    prisma.contact.count({
      where: {
        ...baseWhere,
        status: 'ACTIVE'
      }
    }),
    prisma.contact.count({
      where: {
        ...baseWhere,
        type: 'DONOR'
      }
    }),
    prisma.donation.aggregate({
      where: {
        organizationId: session.user.organizationId || undefined
      },
      _sum: {
        amount: true
      }
    })
  ])

  // Get filtered count separately
  const filteredContactsCount = await prisma.contact.count({
    where: filterWhere
  })

  // Fetch contacts with ALL their donations in one query (fixes N+1 problem)
  // RLS: Contacts are automatically filtered by organizationId at the database level
  const contacts = await prisma.contact.findMany({
    where: filterWhere,
    include: {
      donations: {
        select: { amount: true, donatedAt: true }
      }
    },
    orderBy: { lastName: 'asc' },
    skip,
    take: limit
  })

  // Calculate stats in memory (1 query instead of 101!)
  let contactsWithStats = contacts.map((contact) => {
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
      lifetimeGiving,
      lastGiftDate: sortedDonations[0]?.donatedAt || null,
      lastGiftAmount: sortedDonations[0]?.amount || null,
      _count: { donations: contact.donations.length },
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

  // Apply in-memory filters for lifetime giving (computed field)
  if (minLifetimeGiving || maxLifetimeGiving) {
    contactsWithStats = contactsWithStats.filter((contact) => {
      const min = minLifetimeGiving ? parseFloat(minLifetimeGiving) : 0
      const max = maxLifetimeGiving ? parseFloat(maxLifetimeGiving) : Infinity
      return contact.lifetimeGiving >= min && contact.lifetimeGiving <= max
    })
  }

  // Use actual totals from count queries (not paginated subset)
  const totalContacts = totalContactsCount
  const activeContacts = activeContactsCount
  const donorContacts = donorContactsCount
  const totalLifetimeGiving = lifetimeGivingAggregate._sum.amount || 0

  // Calculate pagination metadata using filtered count or in-memory filtered count
  const finalCount = (minLifetimeGiving || maxLifetimeGiving) ? contactsWithStats.length : filteredContactsCount
  const totalPages = Math.ceil(finalCount / limit)
  const startRecord = finalCount === 0 ? 0 : skip + 1
  const endRecord = Math.min(skip + limit, finalCount)

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
              className="text-white border-white/30 hover:bg-white/10 hover:text-white hover:border-white/50 flex items-center gap-2"
            >
              <FolderOpen size={18} weight="bold" />
              Import CSV
            </Button>
          </Link>
          <Link href="/contacts/new">
            <Button
              className="text-white font-semibold flex items-center gap-2"
              style={{
                background: 'linear-gradient(to right, #764ba2, #ff6b35)',
                border: 'none'
              }}
            >
              <Plus size={18} weight="bold" />
              Add Contact
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

      {/* Filters */}
      <ContactsFilters />

      {/* Contacts Table */}
      <ContactsTable
        data={contactsWithStats}
        currentPage={page}
        totalPages={totalPages}
        totalCount={finalCount}
        startRecord={startRecord}
        endRecord={endRecord}
        limit={limit}
      />
    </DashboardLayout>
  )
}
