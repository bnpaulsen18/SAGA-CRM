import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import SagaCard from '@/components/ui/saga-card'
import { scoreDonor } from '@/lib/donors/scoring'
import { EngagementScoreCard, DonorIntelligenceCard } from '@/components/donors/DonorSignalPanels'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PencilSimple, FileText } from '@phosphor-icons/react/dist/ssr'

export const runtime = 'nodejs'

const bricolage = { fontFamily: 'var(--font-bricolage), sans-serif' } as const
const labelCls = 'text-sm font-medium text-[var(--ink-soft)]'

export default async function DonationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth()
  const { id } = await params
  const prisma = await getPrismaWithRLS()

  const donation = await prisma.donation.findFirst({
    where: { id, organizationId: session.user.organizationId ?? '__no_such_org__' },
    include: {
      contact: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
      campaign: { select: { id: true, name: true } },
    },
  })

  if (!donation) {
    notFound()
  }

  const donorHistory = await prisma.donation.findMany({
    where: { contactId: donation.contactId, organizationId: session.user.organizationId ?? '__no_such_org__' },
    orderBy: { donatedAt: 'desc' },
    select: { id: true, amount: true, donatedAt: true, campaign: { select: { name: true } } },
  })

  const totalGiven = donorHistory.reduce((sum, d) => sum + d.amount, 0)
  const donationCount = donorHistory.length
  const averageGift = totalGiven / donationCount

  // One scoring module for every surface — see lib/donors/scoring.ts.
  const signal = scoreDonor({ gifts: donorHistory.map((d) => ({ amount: d.amount, donatedAt: d.donatedAt })) })
  const funds = Array.from(new Set(donorHistory.map((d) => d.campaign?.name || 'General Fund')))

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <Link href="/donations" className="inline-flex items-center gap-1 text-[var(--ink-soft)] hover:text-[var(--ink)] mb-2 text-sm transition-colors">
          ← Back to Donations
        </Link>
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-[var(--ink)] mb-2" style={bricolage}>Donation Details</h1>
            <p className="text-[var(--ink-soft)]">
              ${donation.amount.toLocaleString()} from{' '}
              <Link href={`/contacts/${donation.contact.id}`} className="text-[#5B4B8A] hover:text-[#E0507A] underline">
                {donation.contact.firstName} {donation.contact.lastName}
              </Link>
            </p>
          </div>
          <div className="flex gap-3">
            <a href={`/api/donations/${id}/receipt`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="text-[var(--ink)] border-[var(--line)] hover:bg-[var(--surface-2)] flex items-center gap-2">
                <FileText size={18} weight="bold" />
                Download Receipt
              </Button>
            </a>
            <Link href={`/donations/${id}/edit`}>
              <Button className="text-white font-semibold flex items-center gap-2 border-none" style={{ background: 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)' }}>
                <PencilSimple size={18} weight="bold" />
                Edit Donation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Donation Information */}
          <SagaCard title="Donation Information">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Amount</label>
                <p className="text-2xl font-bold text-[#4A8C6F] mt-1 tabular-nums">${donation.amount.toLocaleString()}</p>
              </div>
              <div>
                <label className={labelCls}>Date</label>
                <p className="text-lg text-[var(--ink)] mt-1">
                  {new Date(donation.donatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div>
                <label className={labelCls}>Payment Method</label>
                <p className="text-[var(--ink)] mt-1 capitalize">{donation.method.toLowerCase().replace(/_/g, ' ')}</p>
              </div>
              <div>
                <label className={labelCls}>Campaign</label>
                <p className="text-[var(--ink)] mt-1">
                  {donation.campaign ? (
                    <Link href={`/campaigns/${donation.campaign.id}`} className="text-[#5B4B8A] hover:text-[#E0507A] underline">
                      {donation.campaign.name}
                    </Link>
                  ) : ('General Fund')}
                </p>
              </div>
              {donation.fundRestriction && (
                <div>
                  <label className={labelCls}>Fund Restriction</label>
                  <p className="text-[var(--ink)] mt-1 capitalize">{donation.fundRestriction.toLowerCase().replace(/_/g, ' ')}</p>
                </div>
              )}
              {donation.notes && (
                <div className="col-span-2">
                  <label className={labelCls}>Notes</label>
                  <p className="text-[var(--ink-soft)] mt-1">{donation.notes}</p>
                </div>
              )}
            </div>
          </SagaCard>

          {/* Donor Information */}
          <SagaCard title="👤 Donor Information">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Name</label>
                <p className="text-lg text-[var(--ink)] mt-1">
                  <Link href={`/contacts/${donation.contact.id}`} className="hover:text-[#5B4B8A] transition-colors">
                    {donation.contact.firstName} {donation.contact.lastName}
                  </Link>
                </p>
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <p className="text-[var(--ink)] mt-1">{donation.contact.email}</p>
              </div>
              {donation.contact.phone && (
                <div>
                  <label className={labelCls}>Phone</label>
                  <p className="text-[var(--ink)] mt-1">{donation.contact.phone}</p>
                </div>
              )}
              <div>
                <label className={labelCls}>Lifetime Giving</label>
                <p className="text-xl font-bold text-[#4A8C6F] mt-1 tabular-nums">${totalGiven.toLocaleString()}</p>
              </div>
              <div>
                <label className={labelCls}>Total Donations</label>
                <p className="text-xl font-bold text-[var(--ink)] mt-1 tabular-nums">{donationCount}</p>
              </div>
              <div>
                <label className={labelCls}>Average Gift</label>
                <p className="text-lg text-[var(--ink)] mt-1 tabular-nums">${averageGift.toFixed(2)}</p>
              </div>
            </div>
          </SagaCard>

          {/* Donation History */}
          <SagaCard title="📜 Donor History">
            <div className="space-y-3">
              {donorHistory.slice(0, 10).map((d) => {
                const current = d.id === id
                return (
                  <div
                    key={d.id}
                    className="flex justify-between items-center p-3 rounded-lg border"
                    style={current
                      ? { background: '#FCEFE9', borderColor: '#F0C9B8' }
                      : { background: 'var(--paper)', borderColor: 'var(--line)' }}
                  >
                    <div>
                      <p className="text-[var(--ink)] font-medium tabular-nums">
                        {current && '→ '}${d.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-[var(--ink-faint)]">{d.campaign?.name || 'General Fund'}</p>
                    </div>
                    <p className="text-sm text-[var(--ink-soft)]">{new Date(d.donatedAt).toLocaleDateString()}</p>
                  </div>
                )
              })}
              {donorHistory.length > 10 && (
                <Link href={`/contacts/${donation.contact.id}`} className="block text-center text-[#5B4B8A] hover:text-[#E0507A] text-sm pt-2">
                  View all {donorHistory.length} donations →
                </Link>
              )}
            </div>
          </SagaCard>
        </div>

        {/* Sidebar — donor signals, shared with the donor detail page */}
        <div className="space-y-6">
          <EngagementScoreCard signal={signal} />
          <DonorIntelligenceCard signal={signal} funds={funds} />
        </div>
      </div>
    </>
  )
}
