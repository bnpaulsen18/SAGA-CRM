import { requireAuth } from '@/lib/permissions'
import DashboardLayout from '@/components/DashboardLayout'

export const runtime = 'nodejs'

/**
 * Shared layout for the authenticated CRM. Renders the sidebar/topbar shell
 * ONCE so it persists across navigation — only the {children} content area
 * swaps when moving between sections (instant transitions, no shell re-mount).
 */
export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAuth()

  return (
    <DashboardLayout
      userName={session.user.name || session.user.email || 'User'}
      userRole={session.user.role}
    >
      {children}
    </DashboardLayout>
  )
}
