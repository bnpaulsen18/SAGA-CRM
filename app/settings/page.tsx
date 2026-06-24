import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import DashboardLayout from '@/components/DashboardLayout'
import { Buildings, User, CreditCard, ArrowRight } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

export const runtime = 'nodejs'

const bricolage = { fontFamily: 'var(--font-bricolage), sans-serif' } as const

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[var(--line)] last:border-0">
      <span className="text-sm text-[var(--ink-soft)]">{label}</span>
      <span className="text-sm font-medium text-[var(--ink)] text-right">{value || '—'}</span>
    </div>
  )
}

export default async function SettingsPage() {
  const session = await requireAuth()
  const prisma = await getPrismaWithRLS()
  const org = session.user.organizationId
    ? await prisma.organization.findUnique({ where: { id: session.user.organizationId } })
    : null

  return (
    <DashboardLayout
      userName={session.user.name || session.user.email || 'User'}
      userRole={session.user.role}
      searchPlaceholder="Search settings..."
    >
      <div className="mb-8">
        <h1 style={bricolage} className="text-3xl font-bold text-[var(--ink)]">Settings</h1>
        <p className="text-[var(--ink-soft)] mt-1">Manage your organization and account</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        {/* Organization */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--line)]">
            <span className="w-9 h-9 rounded-lg bg-[var(--surface-2)] flex items-center justify-center">
              <Buildings size={18} weight="bold" className="text-[#5B4B8A]" />
            </span>
            <h2 style={bricolage} className="text-lg font-semibold text-[var(--ink)]">Organization</h2>
          </div>
          <div className="px-6 py-2">
            <Row label="Name" value={org?.name} />
            <Row label="EIN" value={org?.ein} />
            <Row label="Email" value={org?.email} />
            <Row label="Phone" value={org?.phone} />
            <Row label="Website" value={org?.website} />
            <Row label="Mission" value={org?.missionStatement} />
          </div>
        </div>

        {/* Account */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--line)]">
            <span className="w-9 h-9 rounded-lg bg-[var(--surface-2)] flex items-center justify-center">
              <User size={18} weight="bold" className="text-[#5B4B8A]" />
            </span>
            <h2 style={bricolage} className="text-lg font-semibold text-[var(--ink)]">Your account</h2>
          </div>
          <div className="px-6 py-2">
            <Row label="Name" value={session.user.name} />
            <Row label="Email" value={session.user.email} />
            <Row label="Role" value={session.user.role} />
          </div>
        </div>

        {/* Plan & billing */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden lg:col-span-2">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--line)]">
            <span className="w-9 h-9 rounded-lg bg-[var(--surface-2)] flex items-center justify-center">
              <CreditCard size={18} weight="bold" className="text-[#5B4B8A]" />
            </span>
            <h2 style={bricolage} className="text-lg font-semibold text-[var(--ink)]">Plan &amp; billing</h2>
          </div>
          <div className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-[var(--ink-soft)]">Current plan</p>
              <p className="text-xl font-bold text-[var(--ink)]" style={bricolage}>
                {org?.subscriptionTier || 'FREE'}{' '}
                <span className="text-sm font-normal text-[var(--ink-faint)]">· {org?.subscriptionStatus || 'ACTIVE'}</span>
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-white font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)' }}
            >
              View plans <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
