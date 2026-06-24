'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FraudStats {
  totalDonations: number;
  flaggedDonations: number;
  pendingReview: number;
  rejectedDonations: number;
  avgFraudScore: number;
  flaggedPercentage: number;
}

interface Donation {
  id: string;
  amount: number;
  fraudScore: number;
  fraudFlags: string[];
  reviewStatus: string;
  createdAt: string;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function FraudMonitorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<FraudStats | null>(null);
  const [highRiskDonations, setHighRiskDonations] = useState<Donation[]>([]);
  const [recentFlagged, setRecentFlagged] = useState<Donation[]>([]);
  const [topFlags, setTopFlags] = useState<{ flag: string; count: number }[]>([]);
  const [scoreBuckets, setScoreBuckets] = useState<Record<string, number>>({});
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'medium'>('all');

  // Redirect if not admin
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'PLATFORM_ADMIN')) {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchFraudData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchFraudData, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchFraudData() {
    try {
      const response = await fetch('/api/admin/fraud-monitor');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setHighRiskDonations(data.highRiskDonations);
        setRecentFlagged(data.recentFlaggedDonations);
        setTopFlags(data.topFlags);
        setScoreBuckets(data.scoreBuckets);
      }
    } catch (error) {
      console.error('Error fetching fraud data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateReviewStatus(donationId: string, reviewStatus: string) {
    try {
      const response = await fetch('/api/admin/fraud-monitor', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donationId, reviewStatus }),
      });

      if (response.ok) {
        // Refresh data
        fetchFraudData();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to update'}`);
      }
    } catch (error) {
      console.error('Error updating review status:', error);
      alert('Failed to update review status');
    }
  }

  function getRiskColor(score: number) {
    if (score >= 70) return 'text-red-400 bg-red-400/10 border-red-400/30';
    if (score >= 40) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    return 'text-green-400 bg-green-400/10 border-green-400/30';
  }

  function getRiskLabel(score: number) {
    if (score >= 70) return 'HIGH RISK';
    if (score >= 40) return 'MEDIUM RISK';
    return 'LOW RISK';
  }

  const filteredDonations = recentFlagged.filter((d) => {
    if (selectedFilter === 'high') return d.fraudScore >= 70;
    if (selectedFilter === 'medium') return d.fraudScore >= 40 && d.fraudScore < 70;
    return true;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-white">Loading fraud monitoring data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center text-white/60 hover:text-white mb-4 transition-colors"
        >
          <span className="mr-2">←</span> Back to Admin
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🛡️ Fraud Monitoring Dashboard
            </h1>
            <p className="text-white/60">Real-time donation fraud detection and prevention</p>
          </div>
          <button
            onClick={fetchFraudData}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="text-white/60 text-sm mb-2">Total Donations</div>
            <div className="text-3xl font-bold text-white">{stats.totalDonations}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-yellow-400/30 rounded-2xl p-6">
            <div className="text-yellow-400 text-sm mb-2">Flagged</div>
            <div className="text-3xl font-bold text-yellow-400">{stats.flaggedDonations}</div>
            <div className="text-yellow-400/60 text-xs mt-2">
              {stats.flaggedPercentage.toFixed(1)}% of total
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-orange-400/30 rounded-2xl p-6">
            <div className="text-orange-400 text-sm mb-2">Pending Review</div>
            <div className="text-3xl font-bold text-orange-400">{stats.pendingReview}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-red-400/30 rounded-2xl p-6">
            <div className="text-red-400 text-sm mb-2">Rejected</div>
            <div className="text-3xl font-bold text-red-400">{stats.rejectedDonations}</div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Fraud Score Distribution */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Fraud Score Distribution</h3>
          <div className="space-y-3">
            {Object.entries(scoreBuckets).map(([range, count]) => (
              <div key={range}>
                <div className="flex justify-between text-sm text-white/60 mb-1">
                  <span>{range}</span>
                  <span>{count} donations</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      range === '81-100'
                        ? 'bg-red-500'
                        : range === '61-80'
                        ? 'bg-orange-500'
                        : range === '41-60'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{
                      width: `${(count / (stats?.flaggedDonations || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Fraud Flags */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-xl font-semibold text-white mb-4">Top Fraud Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topFlags.slice(0, 8).map((item) => (
              <div
                key={item.flag}
                className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3"
              >
                <span className="text-white/90 text-sm font-mono">{item.flag}</span>
                <span className="text-white font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* High Risk Donations */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Flagged Donations (24h)</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedFilter === 'all'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/60'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter('medium')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedFilter === 'medium'
                    ? 'bg-yellow-400/20 text-yellow-400'
                    : 'bg-white/5 text-white/60'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setSelectedFilter('high')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedFilter === 'high'
                    ? 'bg-red-400/20 text-red-400'
                    : 'bg-white/5 text-white/60'
                }`}
              >
                High Risk
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredDonations.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                No flagged donations in the last 24 hours
              </div>
            ) : (
              filteredDonations.map((donation) => (
                <div
                  key={donation.id}
                  className={`bg-white/5 border rounded-lg p-4 ${getRiskColor(
                    donation.fraudScore
                  )}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-white font-semibold">
                        {donation.contact.firstName} {donation.contact.lastName}
                      </div>
                      <div className="text-white/60 text-sm">{donation.contact.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        ${donation.amount.toFixed(2)}
                      </div>
                      <div className={`text-xs font-mono ${getRiskColor(donation.fraudScore)}`}>
                        Score: {donation.fraudScore}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {donation.fraudFlags.map((flag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-white/10 rounded font-mono text-white/80"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/60">
                      {new Date(donation.createdAt).toLocaleString()}
                    </div>
                    {donation.reviewStatus === 'PENDING_REVIEW' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateReviewStatus(donation.id, 'APPROVED')}
                          className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded text-green-400 text-xs hover:bg-green-500/30"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateReviewStatus(donation.id, 'REJECTED')}
                          className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded text-red-400 text-xs hover:bg-red-500/30"
                        >
                          Reject
                        </button>
                        <Link
                          href={`/donations/${donation.id}`}
                          className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-xs hover:bg-white/20"
                        >
                          View
                        </Link>
                      </div>
                    )}
                    {donation.reviewStatus === 'APPROVED' && (
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                        ✓ Approved
                      </span>
                    )}
                    {donation.reviewStatus === 'REJECTED' && (
                      <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">
                        ✗ Rejected
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
