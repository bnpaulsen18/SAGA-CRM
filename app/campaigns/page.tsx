import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import CampaignCard from '@/components/campaigns/CampaignCard';

export const runtime = 'nodejs'

export default async function CampaignsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  if (!session.user.organizationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">No Organization Assigned</h1>
          <p className="text-white/70 mb-6">
            Your account is not associated with an organization.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#764ba2] to-[#667eea] rounded-lg text-white font-medium hover:scale-105 transition-transform"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Fetch campaigns for the user's organization
  const campaigns = await prisma.campaign.findMany({
    where: {
      organizationId: session.user.organizationId,
    },
    include: {
      _count: {
        select: {
          donations: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Calculate stats
  const totalGoal = campaigns.reduce((sum, c) => sum + (c.goal || 0), 0);
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Campaigns</h1>
            <p className="text-white/60">Manage your fundraising campaigns</p>
          </div>
          <Link
            href="/campaigns/new"
            className="px-6 py-3 bg-gradient-to-r from-[#764ba2] to-[#667eea] rounded-lg text-white font-medium hover:scale-105 transition-transform shadow-lg"
          >
            + New Campaign
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Total Campaigns</p>
              <p className="text-3xl font-bold text-white">{campaigns.length}</p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Active Campaigns</p>
              <p className="text-3xl font-bold text-green-400">{activeCampaigns}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Total Raised</p>
              <p className="text-3xl font-bold text-white">
                ${totalRaised.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-white/50 mt-1">
                of ${totalGoal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} goal
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="max-w-7xl mx-auto">
        {campaigns.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-white mb-2">No campaigns yet</h3>
            <p className="text-white/60 mb-6">Create your first fundraising campaign to get started</p>
            <Link
              href="/campaigns/new"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#764ba2] to-[#667eea] rounded-lg text-white font-medium hover:scale-105 transition-transform"
            >
              Create First Campaign
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
