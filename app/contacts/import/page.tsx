import { requireAuth } from '@/lib/permissions'
import DashboardLayout from '@/components/DashboardLayout'
import SagaCard from '@/components/ui/saga-card'
import CSVImportWizard from '@/components/contacts/CSVImportWizard'
import Link from 'next/link'

export const runtime = 'nodejs'

export default async function ContactImportPage() {
  const session = await requireAuth()

  return (
    <DashboardLayout
      userName={session.user.name || session.user.email || 'User'}
      userRole={session.user.role}
    >
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/contacts" className="text-[var(--ink-soft)] hover:text-[var(--ink)] text-sm transition-colors">
            ← Back to Donors
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-[var(--ink)] mb-2" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>Import Contacts from CSV</h1>
        <p className="text-[var(--ink-soft)]">Upload a CSV file to bulk import contacts into your CRM</p>
      </div>

      {/* Instructions Card */}
      <div className="mb-6">
        <SagaCard title="📋 CSV Format Requirements">
          <div className="space-y-3 text-[var(--ink-soft)]">
            <p>Your CSV file should include the following columns (case-insensitive):</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong className="text-[var(--ink)]">Required:</strong> First Name, Last Name, Email</li>
              <li><strong className="text-[var(--ink)]">Optional:</strong> Phone, Street, City, State, ZIP, Type, Status, Tags, Notes</li>
            </ul>
            <p className="text-sm text-[var(--ink-faint)] mt-4">
              💡 Tip: Download a{' '}
              <a href="/sample-contacts.csv" className="text-[#5B4B8A] hover:text-[#E0507A] underline">
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
