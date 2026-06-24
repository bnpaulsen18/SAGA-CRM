interface CampaignProgressProps {
  raised: number;
  goal: number;
  className?: string;
}

export default function CampaignProgress({ raised, goal, className = '' }: CampaignProgressProps) {
  const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
  const complete = percentage >= 100;
  const fill = complete ? '#4A8C6F' : 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)';

  return (
    <div className={className}>
      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-[var(--surface-2)] rounded-full overflow-hidden border border-[var(--line)]">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%`, background: fill }}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center mt-3">
        <div className="text-sm text-[var(--ink-soft)]">
          <span className="font-semibold text-[var(--ink)] tabular-nums">
            ${raised.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {' raised of '}
          <span className="font-semibold text-[var(--ink-soft)] tabular-nums">
            ${goal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className={`text-sm font-bold tabular-nums ${complete ? 'text-[#4A8C6F]' : 'text-[var(--ink)]'}`}>
          {percentage.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
