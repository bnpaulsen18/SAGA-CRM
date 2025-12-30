import { requireAuth } from '@/lib/permissions'
import DashboardLayout from '@/components/DashboardLayout'
import SagaCard from '@/components/ui/saga-card'
import CSVImportWizard from '@/components/contacts/CSVImportWizard'
import Link from 'next/link'

export default async function ContactImportPage() {
  const session = await requireAuth()

  return (
    <DashboardLayout
      userName={session.user.name || session.user.email}
      userRole={session.user.role}
    >
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/contacts" className="text-white/70 hover:text-white">
            ← Back to Contacts
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Import Contacts from CSV</h1>
        <p className="text-white/70">Upload a CSV file to bulk import contacts into your CRM</p>
      </div>

      {/* Instructions Card */}
      <div className="mb-6">
        <SagaCard title="📋 CSV Format Requirements">
          <div className="space-y-3 text-white/80">
            <p>Your CSV file should include the following columns (case-insensitive):</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Required:</strong> First Name, Last Name, Email</li>
              <li><strong>Optional:</strong> Phone, Street, City, State, ZIP, Type, Status, Tags, Notes</li>
            </ul>
            <p className="text-sm text-white/60 mt-4">
              💡 Tip: Download a{' '}
              <a href="/sample-contacts.csv" className="text-orange-400 hover:text-orange-500 underline">
                sample CSV template
              </a>
              {' '}to see the correct format.
            </p>
          </div>
        </SagaCard>
      </div>

      {/* Import Wizard */}
      <CSVImportWizard />
    </DashboardLayout>
  )
}
