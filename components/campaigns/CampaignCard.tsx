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

  // Calculate days remaining/elapsed
  let daysInfo = '';
  if (campaign.endDate) {
    const now = new Date();
    const endDate = new Date(campaign.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (isActive) {
      if (diffDays > 0) {
        daysInfo = `${diffDays} days remaining`;
      } else if (diffDays === 0) {
        daysInfo = 'Ends today';
      } else {
        daysInfo = 'Ended';
      }
    } else if (isCompleted) {
      daysInfo = `Ended ${Math.abs(diffDays)} days ago`;
    }
  }

  // Status badge
  const getStatusBadge = () => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium border";

    switch (campaign.status) {
      case 'ACTIVE':
        return (
          <span className={`${baseClasses} bg-green-500/20 text-green-300 border-green-500/30`}>
            Active
          </span>
        );
      case 'COMPLETED':
        return (
          <span className={`${baseClasses} bg-blue-500/20 text-blue-300 border-blue-500/30`}>
            Completed
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
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:scale-105 transition-transform duration-200 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{campaign.name}</h3>
          {getStatusBadge()}
        </div>
      </div>

      {/* Description */}
      {campaign.description && (
        <p className="text-white/70 text-sm mb-4 line-clamp-2">
          {campaign.description}
        </p>
      )}

      {/* Progress */}
      {campaign.goal && (
        <CampaignProgress
          raised={campaign.raised}
          goal={campaign.goal}
          className="mb-4"
        />
      )}

      {/* Stats */}
      <div className="flex justify-between items-center mb-4 pt-4 border-t border-white/10">
        <div className="flex gap-4">
          <div>
            <p className="text-xs text-white/50">Donations</p>
            <p className="text-lg font-semibold text-white">{donationCount}</p>
          </div>
          {daysInfo && (
            <div>
              <p className="text-xs text-white/50">Timeline</p>
              <p className="text-sm font-medium text-white/80">{daysInfo}</p>
            </div>
          )}
        </div>
      </div>

      {/* Dates */}
      {(campaign.startDate || campaign.endDate) && (
        <div className="text-xs text-white/50 mb-4">
          {campaign.startDate && (
            <span>
              Start: {new Date(campaign.startDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          )}
          {campaign.startDate && campaign.endDate && <span className="mx-2">•</span>}
          {campaign.endDate && (
            <span>
              End: {new Date(campaign.endDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/campaigns/${campaign.id}`}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-[#764ba2] to-[#667eea] rounded-lg text-white text-sm font-medium text-center hover:scale-105 transition-transform"
        >
          View Details
        </Link>
        <Link
          href={`/campaigns/${campaign.id}/edit`}
          className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm font-medium hover:bg-white/10 transition-colors"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
