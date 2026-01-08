import { requireAuth, canViewContact } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import { decryptContactPII } from '@/lib/encryption'
import DashboardLayout from '@/components/DashboardLayout'
import SagaCard from '@/components/ui/saga-card'
import ContactFormEdit from '@/components/contacts/ContactFormEdit'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export const runtime = 'nodejs'

interface ContactEditPageProps {
  params: {
    id: string
  }
}

export default async function ContactEditPage({ params }: ContactEditPageProps) {
  const session = await requireAuth()

  // Verify permission to edit this contact
  const canView = await canViewContact(params.id)
  if (!canView) {
    redirect('/contacts')
  }

  const prisma = await getPrismaWithRLS()

  // Fetch contact data
  const contact = await prisma.contact.findFirst({
    where: {
      id: params.id,
      organizationId: session.user.organizationId || undefined
    }
  })

  if (!contact) {
    notFound()
  }

  // Decrypt PII fields before passing to form
  const decryptedContact = decryptContactPII(contact)

  return (
    <DashboardLayout
      userName={session.user.name || session.user.email || 'User'}
      userRole={session.user.role}
    >
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link href={`/contacts/${params.id}`} className="text-white/70 hover:text-white">
            ← Back to Contact
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Edit Contact: {decryptedContact.firstName} {decryptedContact.lastName}
        </h1>
        <p className="text-white/70">Update contact information</p>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl">
        <SagaCard title="Contact Information">
          <ContactFormEdit contact={decryptedContact} />
        </SagaCard>
      </div>
    </DashboardLayout>
  )
}
