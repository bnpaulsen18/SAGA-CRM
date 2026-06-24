import Link from 'next/link';
import { Campaign } from '@prisma/client';
import CampaignProgress from './CampaignProgress';

interface CampaignCardProps {
  campaign: Campaign & {
    _count?: {
      donations: number;
    };
  };
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const donationCount = campaign._count?.donations || 0;
  const isActive = campaign.status === 'ACTIVE';
  const isCompleted = campaign.status === 'COMPLETED';

  let daysInfo = '';
  if (campaign.endDate) {
    const now = new Date();
    const endDate = new Date(campaign.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (isActive) {
      if (diffDays > 0) daysInfo = `${diffDays} days remaining`;
      else if (diffDays === 0) daysInfo = 'Ends today';
      else daysInfo = 'Ended';
    } else if (isCompleted) {
      daysInfo = `Ended ${Math.abs(diffDays)} days ago`;
    }
  }

  const getStatusBadge = () => {
    const base = 'px-3 py-1 rounded-full text-xs font-medium border';
    const styles: Record<string, React.CSSProperties> = {
      ACTIVE: { background: '#E6F3EE', color: '#2E7D5B', borderColor: '#CDE9DD' },
      COMPLETED: { background: '#EEE9F5', color: '#5B4B8A', borderColor: '#DDD3EC' },
      DRAFT: { background: 'var(--surface-2)', color: 'var(--ink-soft)', borderColor: 'var(--line)' },
      PAUSED: { background: '#F7EFD9', color: '#B7791F', borderColor: '#ECD9A8' },
      CANCELLED: { background: '#F6EBE6', color: '#C0573F', borderColor: '#EAD3C8' },
    };
    const style = styles[campaign.status];
    if (!style) return null;
    const label = campaign.status.charAt(0) + campaign.status.slice(1).toLowerCase();
    return <span className={base} style={style}>{label}</span>;
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 hover:border-[var(--line-2)] hover:shadow-[0_8px_30px_rgba(42,36,51,0.06)] transition-all duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[var(--ink)] mb-2" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>{campaign.name}</h3>
          {getStatusBadge()}
        </div>
      </div>

      {/* Description */}
      {campaign.description && (
        <p className="text-[var(--ink-soft)] text-sm mb-4 line-clamp-2">{campaign.description}</p>
      )}

      {/* Progress */}
      {campaign.goal && (
        <CampaignProgress raised={campaign.raised} goal={campaign.goal} className="mb-4" />
      )}

      {/* Stats */}
      <div className="flex justify-between items-center mb-4 pt-4 border-t border-[var(--line)]">
        <div className="flex gap-4">
          <div>
            <p className="text-xs text-[var(--ink-faint)]">Donations</p>
            <p className="text-lg font-semibold text-[var(--ink)] tabular-nums">{donationCount}</p>
          </div>
          {daysInfo && (
            <div>
              <p className="text-xs text-[var(--ink-faint)]">Timeline</p>
              <p className="text-sm font-medium text-[var(--ink-soft)]">{daysInfo}</p>
            </div>
          )}
        </div>
      </div>

      {/* Dates */}
      {(campaign.startDate || campaign.endDate) && (
        <div className="text-xs text-[var(--ink-faint)] mb-4">
          {campaign.startDate && (
            <span>Start: {new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          )}
          {campaign.startDate && campaign.endDate && <span className="mx-2">•</span>}
          {campaign.endDate && (
            <span>End: {new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/campaigns/${campaign.id}`}
          className="flex-1 px-4 py-2 rounded-lg text-white text-sm font-medium text-center hover:opacity-95 transition-opacity"
          style={{ background: 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)' }}
        >
          View Details
        </Link>
        <Link
          href={`/campaigns/${campaign.id}/edit`}
          className="px-4 py-2 bg-[var(--surface)] border border-[var(--line)] rounded-lg text-[var(--ink)] text-sm font-medium hover:bg-[var(--surface-2)] transition-colors"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
