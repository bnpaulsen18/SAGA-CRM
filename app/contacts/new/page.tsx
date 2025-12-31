import { requireAuth } from '@/lib/permissions'
import DashboardLayout from '@/components/DashboardLayout'
import SagaCard from '@/components/ui/saga-card'
import ContactForm from '@/components/contacts/ContactForm'
import Link from 'next/link'

export default async function NewContactPage() {
  const session = await requireAuth()

  return (
    <DashboardLayout
      userName={session.user.name || session.user.email || 'User'}
      userRole={session.user.role}
    >
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/contacts" className="text-white/70 hover:text-white">
            ← Back to Contacts
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Add New Contact</h1>
        <p className="text-white/70">Create a new contact record in your database</p>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl">
        <SagaCard title="Contact Information">
          <ContactForm />
        </SagaCard>
      </div>
    </DashboardLayout>
  )
}
