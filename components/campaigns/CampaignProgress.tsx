interface CampaignProgressProps {
  raised: number;
  goal: number;
  className?: string;
}

export default function CampaignProgress({ raised, goal, className = '' }: CampaignProgressProps) {
  const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

  // Color based on progress
  let progressColor = 'bg-yellow-500'; // 0-50%
  let progressGlow = 'shadow-yellow-500/50';

  if (percentage >= 100) {
    progressColor = 'bg-gradient-to-r from-yellow-400 to-orange-500'; // 100%+
    progressGlow = 'shadow-orange-500/50';
  } else if (percentage >= 90) {
    progressColor = 'bg-green-500'; // 90-100%
    progressGlow = 'shadow-green-500/50';
  } else if (percentage >= 50) {
    progressColor = 'bg-blue-500'; // 50-90%
    progressGlow = 'shadow-blue-500/50';
  }

  return (
    <div className={className}>
      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
        <div
          className={`absolute top-0 left-0 h-full ${progressColor} ${progressGlow} shadow-lg transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center mt-3">
        <div className="text-sm text-white/70">
          <span className="font-semibold text-white">
            ${raised.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {' raised of '}
          <span className="font-semibold text-white/80">
            ${goal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className={`text-sm font-bold ${percentage >= 100 ? 'text-orange-400' : 'text-white'}`}>
          {percentage.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
