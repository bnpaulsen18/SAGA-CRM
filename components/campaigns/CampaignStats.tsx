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
  const exceeded = percentage >= 100;
  const overOrRemaining = exceeded ? totalRaised - goal : remaining;

  const card = 'bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6';
  const money = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className={card}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--ink-soft)] text-sm mb-1">Total Raised</p>
            <p className="text-3xl font-bold text-[var(--ink)] tabular-nums">{money(totalRaised)}</p>
            <p className="text-xs text-[var(--ink-faint)] mt-1">{percentage.toFixed(1)}% of goal</p>
          </div>
          <CurrencyDollar size={40} weight="bold" className="text-[#4A8C6F]" />
        </div>
      </div>

      <div className={card}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--ink-soft)] text-sm mb-1">Total Donors</p>
            <p className="text-3xl font-bold text-[var(--ink)] tabular-nums">{donorCount}</p>
            <p className="text-xs text-[var(--ink-faint)] mt-1">Unique contributions</p>
          </div>
          <Gift size={40} weight="bold" className="text-[var(--ink-faint)]" />
        </div>
      </div>

      <div className={card}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--ink-soft)] text-sm mb-1">Average Gift</p>
            <p className="text-3xl font-bold text-[var(--ink)] tabular-nums">{money(averageDonation)}</p>
            <p className="text-xs text-[var(--ink-faint)] mt-1">Per donation</p>
          </div>
          <ChartBar size={40} weight="bold" className="text-[var(--ink-faint)]" />
        </div>
      </div>

      <div className={card}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--ink-soft)] text-sm mb-1">{exceeded ? 'Exceeded Goal By' : 'Remaining'}</p>
            <p className="text-3xl font-bold tabular-nums" style={{ color: exceeded ? '#E0507A' : 'var(--ink)' }}>
              {money(overOrRemaining)}
            </p>
            <p className="text-xs text-[var(--ink-faint)] mt-1">{exceeded ? 'Over target' : 'To reach goal'}</p>
          </div>
          {exceeded ? (
            <Confetti size={40} weight="bold" className="text-[#E0507A]" />
          ) : (
            <Target size={40} weight="bold" className="text-[var(--ink-faint)]" />
          )}
        </div>
      </div>
    </div>
  );
}
