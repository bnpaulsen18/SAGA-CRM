import { requireAuth } from '@/lib/permissions'
import SagaCard from '@/components/ui/saga-card'
import ContactForm from '@/components/contacts/ContactForm'
import Link from 'next/link'

export const runtime = 'nodejs'

export default async function NewContactPage() {
  const session = await requireAuth()

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/contacts" className="text-[var(--ink-soft)] hover:text-[var(--ink)] text-sm transition-colors">
            ← Back to Donors
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-[var(--ink)] mb-2" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>Add New Contact</h1>
        <p className="text-[var(--ink-soft)]">Create a new contact record in your database</p>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl">
        <SagaCard title="Contact Information">
          <ContactForm />
        </SagaCard>
      </div>
    </>
  )
}
