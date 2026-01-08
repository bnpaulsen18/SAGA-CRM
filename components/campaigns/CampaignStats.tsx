import { Campaign, Donation } from '@prisma/client';
import { CurrencyDollar, Gift, ChartBar, Confetti, Target } from '@phosphor-icons/react/dist/ssr';

interface CampaignStatsProps {
  campaign: Campaign & {
    donations?: Donation[];
    _count?: {
      donations: number;
    };
  };
}

export default function CampaignStats({ campaign }: CampaignStatsProps) {
  const donations = campaign.donations || [];
  const donorCount = campaign._count?.donations || donations.length;
  const totalRaised = campaign.raised;
  const averageDonation = donorCount > 0 ? totalRaised / donorCount : 0;
  const goal = campaign.goal || 0;
  const remaining = Math.max(goal - totalRaised, 0);
  const percentage = goal > 0 ? (totalRaised / goal) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Raised */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1">Total Raised</p>
            <p className="text-3xl font-bold text-green-400">
              ${totalRaised.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-white/50 mt-1">
              {percentage.toFixed(1)}% of goal
            </p>
          </div>
          <CurrencyDollar size={40} weight="bold" className="text-green-400" />
        </div>
      </div>

      {/* Donors */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1">Total Donors</p>
            <p className="text-3xl font-bold text-white">{donorCount}</p>
            <p className="text-xs text-white/50 mt-1">
              Unique contributions
            </p>
          </div>
          <Gift size={40} weight="bold" className="text-purple-400" />
        </div>
      </div>

      {/* Average Donation */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1">Average Gift</p>
            <p className="text-3xl font-bold text-blue-400">
              ${averageDonation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-white/50 mt-1">
              Per donation
            </p>
          </div>
          <ChartBar size={40} weight="bold" className="text-blue-400" />
        </div>
      </div>

      {/* Remaining */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1">
              {percentage >= 100 ? 'Exceeded Goal By' : 'Remaining'}
            </p>
            <p className={`text-3xl font-bold ${percentage >= 100 ? 'text-orange-400' : 'text-white'}`}>
              ${Math.abs(remaining).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-white/50 mt-1">
              {percentage >= 100 ? 'Over target' : 'To reach goal'}
            </p>
          </div>
          {percentage >= 100 ? (
            <Confetti size={40} weight="bold" className="text-orange-400" />
          ) : (
            <Target size={40} weight="bold" className="text-blue-400" />
          )}
        </div>
      </div>
    </div>
  );
}
