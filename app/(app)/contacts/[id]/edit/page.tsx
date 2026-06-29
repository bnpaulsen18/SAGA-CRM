import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
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
      organizationId: session.user.organizationId ?? '__no_such_org__'
    }
  })

  if (!contact) notFound()

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--ink)] mb-2" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>Edit Contact</h1>
        <p className="text-[var(--ink-soft)]">Update contact information</p>
      </div>

      <ContactFormEdit contact={contact} />
    </>
  )
}
