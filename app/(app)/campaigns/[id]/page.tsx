import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAuth } from '@/lib/permissions';
import { getPrismaWithRLS } from '@/lib/prisma-rls';
import CampaignProgress from '@/components/campaigns/CampaignProgress';
import CampaignStats from '@/components/campaigns/CampaignStats';
import { Check, Gift, ArrowLeft } from '@phosphor-icons/react/dist/ssr';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const bricolage = { fontFamily: 'var(--font-bricolage), sans-serif' } as const;

const statusStyle: Record<string, React.CSSProperties> = {
  ACTIVE: { background: '#E6F3EE', color: '#2E7D5B', border: '1px solid #CDE9DD' },
  COMPLETED: { background: '#EEE9F5', color: '#5B4B8A', border: '1px solid #DDD3EC' },
  DRAFT: { background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)' },
  PAUSED: { background: '#F7EFD9', color: '#B7791F', border: '1px solid #ECD9A8' },
  CANCELLED: { background: '#F6EBE6', color: '#C0573F', border: '1px solid #EAD3C8' },
};

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  const { id } = await params;
  const prisma = await getPrismaWithRLS();

  const campaign = await prisma.campaign.findFirst({
    where: { id, organizationId: session.user.organizationId ?? '__no_such_org__' },
    include: {
      donations: {
        include: { contact: { select: { firstName: true, lastName: true, email: true } } },
        orderBy: { donatedAt: 'desc' },
        take: 50,
      },
      _count: { select: { donations: true } },
    },
  });

  if (!campaign) {
    return (
      <>
        <div className="flex items-center justify-center py-20">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-8 max-w-md text-center">
            <h1 className="text-2xl font-bold text-[var(--ink)] mb-2" style={bricolage}>Campaign not found</h1>
            <p className="text-[var(--ink-soft)] mb-6">It doesn&apos;t exist or you don&apos;t have access to it.</p>
            <Link href="/campaigns" className="inline-block px-6 py-3 rounded-lg text-white font-medium" style={{ background: 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)' }}>
              Back to Campaigns
            </Link>
          </div>
        </div>
      </>
    );
  }

  const badge = statusStyle[campaign.status];
  const label = campaign.status.charAt(0) + campaign.status.slice(1).toLowerCase();

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <Link href="/campaigns" className="inline-flex items-center gap-1 text-[var(--ink-soft)] hover:text-[var(--ink)] mb-4 transition-colors text-sm">
          <ArrowLeft size={16} weight="bold" /> Back to Campaigns
        </Link>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2 flex-wrap">
              <h1 className="text-3xl font-bold text-[var(--ink)]" style={bricolage}>{campaign.name}</h1>
              {badge && (
                <span className="px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1" style={badge}>
                  {(campaign.status === 'ACTIVE' || campaign.status === 'COMPLETED') && <Check size={14} weight="bold" />}
                  {label}
                </span>
              )}
            </div>
            {campaign.description && <p className="text-[var(--ink-soft)]">{campaign.description}</p>}
          </div>
          <Link href={`/campaigns/${campaign.id}/edit`} className="px-5 py-2.5 bg-[var(--surface)] border border-[var(--line)] rounded-lg text-[var(--ink)] font-medium hover:bg-[var(--surface-2)] transition-colors whitespace-nowrap">
            Edit Campaign
          </Link>
        </div>
      </div>

      {/* Timeline */}
      {(campaign.startDate || campaign.endDate) && (
        <div className="mb-6 bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[var(--ink)] mb-4" style={bricolage}>Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaign.startDate && (
              <div>
                <p className="text-[var(--ink-faint)] text-sm mb-1">Start Date</p>
                <p className="text-[var(--ink)] font-medium">{new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            )}
            {campaign.endDate && (
              <div>
                <p className="text-[var(--ink-faint)] text-sm mb-1">End Date</p>
                <p className="text-[var(--ink)] font-medium">{new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress */}
      {campaign.goal && (
        <div className="mb-6 bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[var(--ink)] mb-4" style={bricolage}>Progress</h2>
          <CampaignProgress raised={campaign.raised} goal={campaign.goal} />
        </div>
      )}

      {/* Stats */}
      <div className="mb-6">
        <CampaignStats campaign={campaign} />
      </div>

      {/* Recent Donations */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden">
        <div className="border-b border-[var(--line)] px-6 py-4">
          <h2 className="text-lg font-semibold text-[var(--ink)]" style={bricolage}>Recent Donations</h2>
        </div>

        {campaign.donations.length === 0 ? (
          <div className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <Gift size={56} weight="bold" className="text-[var(--ink-faint)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">No donations yet</h3>
            <p className="text-[var(--ink-soft)]">This campaign hasn&apos;t received any donations</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--paper)] border-b border-[var(--line)]">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--ink-soft)]">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--ink-soft)]">Donor</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--ink-soft)]">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--ink-soft)]">Method</th>
                </tr>
              </thead>
              <tbody>
                {campaign.donations.map((donation) => (
                  <tr key={donation.id} className="border-b border-[var(--line)] hover:bg-[var(--paper)] transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-[var(--ink-soft)] text-sm">{new Date(donation.donatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[var(--ink)] font-medium">{donation.contact.firstName} {donation.contact.lastName}</div>
                      <div className="text-[var(--ink-faint)] text-sm">{donation.contact.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#4A8C6F] font-semibold text-lg tabular-nums">
                        ${donation.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[var(--ink-soft)] text-sm capitalize">{donation.method.toLowerCase().replace(/_/g, ' ')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
