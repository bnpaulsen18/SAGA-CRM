import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import CampaignProgress from '@/components/campaigns/CampaignProgress';
import CampaignStats from '@/components/campaigns/CampaignStats';

export const runtime = 'nodejs'

export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  const campaign = await prisma.campaign.findFirst({
    where: {
      id: params.id,
      organizationId: session.user.organizationId || undefined,
    },
    include: {
      donations: {
        include: {
          contact: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          donatedAt: 'desc',
        },
        take: 50,
      },
      _count: {
        select: {
          donations: true,
        },
      },
    },
  });

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-white mb-2">Campaign Not Found</h1>
          <p className="text-white/70 mb-6">
            The campaign you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link
            href="/campaigns"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#764ba2] to-[#667eea] rounded-lg text-white font-medium hover:scale-105 transition-transform"
          >
            Back to Campaigns
          </Link>
        </div>
      </div>
    );
  }

  // Status badge
  const getStatusBadge = () => {
    const baseClasses = "px-4 py-2 rounded-full text-sm font-medium border";

    switch (campaign.status) {
      case 'ACTIVE':
        return (
          <span className={`${baseClasses} bg-green-500/20 text-green-300 border-green-500/30`}>
            ✓ Active
          </span>
        );
      case 'COMPLETED':
        return (
          <span className={`${baseClasses} bg-blue-500/20 text-blue-300 border-blue-500/30`}>
            ✓ Completed
          </span>
        );
      case 'DRAFT':
        return (
          <span className={`${baseClasses} bg-yellow-500/20 text-yellow-300 border-yellow-500/30`}>
            Draft
          </span>
        );
      case 'PAUSED':
        return (
          <span className={`${baseClasses} bg-orange-500/20 text-orange-300 border-orange-500/30`}>
            Paused
          </span>
        );
      case 'CANCELLED':
        return (
          <span className={`${baseClasses} bg-red-500/20 text-red-300 border-red-500/30`}>
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/campaigns"
            className="inline-flex items-center text-white/60 hover:text-white mb-4 transition-colors"
          >
            ← Back to Campaigns
          </Link>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl font-bold text-white">{campaign.name}</h1>
                {getStatusBadge()}
              </div>
              <p className="text-white/60">{campaign.description}</p>
            </div>
            <Link
              href={`/campaigns/${campaign.id}/edit`}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-medium hover:bg-white/20 transition-colors"
            >
              Edit Campaign
            </Link>
          </div>
        </div>

        {/* Timeline */}
        {(campaign.startDate || campaign.endDate) && (
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Timeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaign.startDate && (
                  <div>
                    <p className="text-white/50 text-sm mb-1">Start Date</p>
                    <p className="text-white font-medium">
                      {new Date(campaign.startDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                {campaign.endDate && (
                  <div>
                    <p className="text-white/50 text-sm mb-1">End Date</p>
                    <p className="text-white font-medium">
                      {new Date(campaign.endDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress */}
        {campaign.goal && (
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Progress</h2>
              <CampaignProgress raised={campaign.raised} goal={campaign.goal} />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-8">
          <CampaignStats campaign={campaign} />
        </div>

        {/* Recent Donations */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
          <div className="bg-white/5 border-b border-white/10 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Recent Donations</h2>
          </div>

          {campaign.donations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold text-white mb-2">No donations yet</h3>
              <p className="text-white/60">This campaign hasn't received any donations</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Donor</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Amount</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {campaign.donations.map((donation) => (
                    <tr
                      key={donation.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-white/90 text-sm">
                          {new Date(donation.donatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">
                            {donation.contact.firstName} {donation.contact.lastName}
                          </div>
                          <div className="text-white/50 text-sm">{donation.contact.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#ffa07a] font-semibold text-lg">
                          ${donation.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/70 text-sm capitalize">
                          {donation.method.toLowerCase().replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
