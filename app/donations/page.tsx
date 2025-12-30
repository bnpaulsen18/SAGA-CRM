import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import DonationRowActions from './DonationRowActions';

export default async function DonationsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  // Check if user has an organization
  if (!session.user.organizationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">No Organization Assigned</h1>
          <p className="text-white/70 mb-6">
            Your account is not associated with an organization. Please contact support or create an organization first.
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

  // Fetch donations for the user's organization
  const donations = await prisma.donation.findMany({
    where: {
      organizationId: session.user.organizationId,
    },
    include: {
      contact: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      campaign: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      donatedAt: 'desc',
    },
    take: 100, // Limit to 100 for now, we'll add pagination later
  });

  // Calculate total raised
  const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0);
  const thisMonthDonations = donations.filter((d) => {
    const donationDate = new Date(d.donatedAt);
    const now = new Date();
    return (
      donationDate.getMonth() === now.getMonth() &&
      donationDate.getFullYear() === now.getFullYear()
    );
  });
  const thisMonthTotal = thisMonthDonations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Donations</h1>
            <p className="text-white/60">Track and manage all donations</p>
          </div>
          <Link
            href="/donations/new"
            className="px-6 py-3 bg-gradient-to-r from-[#764ba2] to-[#667eea] rounded-lg text-white font-medium hover:scale-105 transition-transform shadow-lg"
          >
            + New Donation
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Total Raised (All Time)</p>
              <p className="text-3xl font-bold text-white">
                ${totalRaised.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">This Month</p>
              <p className="text-3xl font-bold text-white">
                ${thisMonthTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Total Donations</p>
              <p className="text-3xl font-bold text-white">{donations.length}</p>
            </div>
            <div className="text-4xl">🎁</div>
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="bg-white/5 border-b border-white/10 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Recent Donations</h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {donations.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">💸</div>
                <h3 className="text-xl font-semibold text-white mb-2">No donations yet</h3>
                <p className="text-white/60 mb-6">Get started by recording your first donation</p>
                <Link
                  href="/donations/new"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-[#764ba2] to-[#667eea] rounded-lg text-white font-medium hover:scale-105 transition-transform"
                >
                  Record First Donation
                </Link>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Donor</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Amount</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Fund</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Campaign</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Method</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/80">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr
                      key={donation.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => window.location.href = `/donations/${donation.id}`}
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
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/20">
                          {donation.fundRestriction.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/70 text-sm">
                          {donation.campaign?.name || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/70 text-sm capitalize">
                          {donation.method.toLowerCase().replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            donation.status === 'COMPLETED'
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : donation.status === 'PENDING'
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {donation.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <DonationRowActions donationId={donation.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Footer - Pagination placeholder */}
          {donations.length > 0 && (
            <div className="bg-white/5 border-t border-white/10 px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">
                  Showing {donations.length} donation{donations.length !== 1 ? 's' : ''}
                </p>
                {donations.length >= 100 && (
                  <p className="text-sm text-white/60">
                    Pagination coming soon...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
