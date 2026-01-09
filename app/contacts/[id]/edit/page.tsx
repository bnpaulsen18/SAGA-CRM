import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import DashboardLayout from '@/components/DashboardLayout'
import ContactFormEdit from '@/components/contacts/ContactFormEdit'
import { notFound } from 'next/navigation'

export const runtime = 'nodejs'

interface ContactEditPageProps {
  params: Promise<{ id: string }>
}

export default async function ContactEditPage({ params }: ContactEditPageProps) {
  const session = await requireAuth()
  const prisma = await getPrismaWithRLS()
  const { id } = await params

  const contact = await prisma.contact.findFirst({
    where: {
      id,
      organizationId: session.user.organizationId || undefined
    }
  })

  if (!contact) notFound()

  return (
    <DashboardLayout
      userName={session.user.name || session.user.email || 'User'}
      userRole={session.user.role}
      searchPlaceholder="Search contacts..."
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Edit Contact</h1>
        <p className="text-white/70">Update contact information</p>
      </div>

      <ContactFormEdit contact={contact} />
    </DashboardLayout>
  )
}
