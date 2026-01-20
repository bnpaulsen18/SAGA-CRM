import { requirePlatformAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";

// Force dynamic rendering - prevents build-time database queries
export const dynamic = 'force-dynamic';

export default async function PlatformReportsPage() {
  const user = await requirePlatformAdmin();

  // Fetch comprehensive platform statistics
  const [
    totalOrganizations,
    totalUsers,
    totalContacts,
    totalCampaigns,
    totalDonations,
    donationStats,
    organizationsByType,
    recentOrganizations,
    topOrganizationsByDonations,
  ] = await Promise.all([
    // Total counts
    prisma.organization.count(),
    prisma.user.count(),
    prisma.contact.count(),
    prisma.campaign.count(),
    prisma.donation.count(),

    // Financial stats
    prisma.donation.aggregate({
      _sum: { amount: true },
      _avg: { amount: true },
      _max: { amount: true },
    }),

    // Organizations by type
    prisma.organization.groupBy({
      by: ["organizationType"],
      _count: {
        id: true,
      },
    }),

    // Recent organizations
    prisma.organization.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        organizationType: true,
        createdAt: true,
        _count: {
          select: {
            users: true,
            contacts: true,
            donations: true,
          },
        },
      },
    }),

    // Top organizations by donation count
    prisma.organization.findMany({
      take: 10,
      orderBy: {
        donations: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        name: true,
        organizationType: true,
        _count: {
          select: {
            donations: true,
            contacts: true,
            users: true,
          },
        },
      },
      where: {
        donations: {
          some: {},
        },
      },
    }),
  ]);

  // Calculate additional metrics
  const totalRevenue = donationStats._sum.amount || 0;
  const averageDonation = donationStats._avg.amount || 0;
  const largestDonation = donationStats._max.amount || 0;

  // Platform admins count
  const platformAdmins = await prisma.user.count({
    where: { isPlatformAdmin: true },
  });

  // Users by role
  const adminUsers = await prisma.user.count({
    where: { role: "ADMIN", isPlatformAdmin: false },
  });

  const regularUsers = await prisma.user.count({
    where: { role: "MEMBER" },
  });

  // Recent activity - last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [recentDonationsCount, recentContactsCount, recentUsersCount] =
    await Promise.all([
      prisma.donation.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.contact.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
    ]);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      }}
    >
      <AdminNav
        userName={user.name || "Admin"}
        currentPage="Platform Reports"
        showBackButton={true}
        backHref="/admin"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Financial Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Financial Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div
              className="p-6 rounded-lg shadow-lg"
              style={{
                background: "rgba(34, 197, 94, 0.2)",
                border: "1px solid rgba(34, 197, 94, 0.4)",
              }}
            >
              <h3 className="text-sm font-medium text-white/70">
                Total Revenue
              </h3>
              <p className="text-3xl font-bold text-white mt-2">
                ${totalRevenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div
              className="p-6 rounded-lg shadow-lg"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <h3 className="text-sm font-medium text-white/70">
                Total Donations
              </h3>
              <p className="text-3xl font-bold text-white mt-2">
                {totalDonations.toLocaleString()}
              </p>
            </div>
            <div
              className="p-6 rounded-lg shadow-lg"
              style={{
                background: "rgba(180, 21, 75, 0.2)",
                border: "1px solid rgba(180, 21, 75, 0.4)",
              }}
            >
              <h3 className="text-sm font-medium text-white/70">
                Average Donation
              </h3>
              <p className="text-3xl font-bold" style={{ color: "#ffa07a" }}>
                ${averageDonation.toFixed(2)}
              </p>
            </div>
            <div
              className="p-6 rounded-lg shadow-lg"
              style={{
                background: "rgba(255, 107, 53, 0.2)",
                border: "1px solid rgba(255, 107, 53, 0.4)",
              }}
            >
              <h3 className="text-sm font-medium text-white/70">
                Largest Donation
              </h3>
              <p className="text-3xl font-bold" style={{ color: "#ff6b35" }}>
                ${largestDonation.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Platform Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Platform Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div
              className="p-6 rounded-lg shadow-lg"
              style={{
                background: "rgba(118, 75, 162, 0.2)",
                border: "1px solid rgba(118, 75, 162, 0.4)",
              }}
            >
              <h3 className="text-sm font-medium text-white/70">
                Organizations
              </h3>
              <p className="text-3xl font-bold text-white mt-2">
                {totalOrganizations}
              </p>
            </div>
            <div
              className="p-6 rounded-lg shadow-lg"
              style={{
                background: "rgba(180, 21, 75, 0.2)",
                border: "1px solid rgba(180, 21, 75, 0.4)",
              }}
            >
              <h3 className="text-sm font-medium text-white/70">Total Users</h3>
              <p className="text-3xl font-bold" style={{ color: "#ffa07a" }}>
                {totalUsers}
              </p>
            </div>
            <div
              className="p-6 rounded-lg shadow-lg"
              style={{
                background: "rgba(255, 107, 53, 0.2)",
                border: "1px solid rgba(255, 107, 53, 0.4)",
              }}
            >
              <h3 className="text-sm font-medium text-white/70">
                Total Contacts
              </h3>
              <p className="text-3xl font-bold" style={{ color: "#ff6b35" }}>
                {totalContacts}
              </p>
            </div>
            <div
              className="p-6 rounded-lg shadow-lg"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <h3 className="text-sm font-medium text-white/70">Campaigns</h3>
              <p className="text-3xl font-bold text-white mt-2">
                {totalCampaigns}
              </p>
            </div>
          </div>
        </div>

        {/* User Breakdown */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">User Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="p-6 rounded-lg shadow-lg"
              style={{
                background: "rgba(255, 107, 53, 0.2)",
                border: "1px solid rgba(255, 107, 53, 0.4)",
              }}
            >
              <h3 className="text-sm font-medium text-white/70">
                Platform Admins
              </h3>
              <p className="text-3xl font-bold" style={{ color: "#ff6b35" }}>
                {platformAdmins}
              </p>
            </div>
            <div
              className="p-6 rounded-lg shadow-lg"
              style={{
                background: "rgba(180, 21, 75, 0.2)",
                border: "1px solid rgba(180, 21, 75, 0.4)",
              }}
            >
              <h3 className="text-sm font-medium text-white/70">
                Organization Admins
              </h3>
              <p className="text-3xl font-bold" style={{ color: "#ffa07a" }}>
                {adminUsers}
              </p>
            </div>
            <div
              className="p-6 rounded-lg shadow-lg"
              style={{
                background: "rgba(118, 75, 162, 0.2)",
                border: "1px solid rgba(118, 75, 162, 0.4)",
              }}
            >
              <h3 className="text-sm font-medium text-white/70">
                Regular Users
              </h3>
              <p className="text-3xl font-bold text-white">
                {regularUsers}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity (Last 30 Days) */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Recent Activity (Last 30 Days)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="p-6 rounded-lg shadow-lg"
              style={{
                background: "rgba(34, 197, 94, 0.15)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
              }}
            >
              <h3 className="text-sm font-medium text-white/70">
                New Donations
              </h3>
              <p className="text-3xl font-bold text-white mt-2">
                {recentDonationsCount}
              </p>
            </div>
            <div
              className="p-6 rounded-lg shadow-lg"
              style={{
                background: "rgba(59, 130, 246, 0.15)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
              }}
            >
              <h3 className="text-sm font-medium text-white/70">
                New Contacts
              </h3>
              <p className="text-3xl font-bold text-white mt-2">
                {recentContactsCount}
              </p>
            </div>
            <div
              className="p-6 rounded-lg shadow-lg"
              style={{
                background: "rgba(168, 85, 247, 0.15)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
              }}
            >
              <h3 className="text-sm font-medium text-white/70">New Users</h3>
              <p className="text-3xl font-bold text-white mt-2">
                {recentUsersCount}
              </p>
            </div>
          </div>
        </div>

        {/* Organizations by Type */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Organizations by Type
          </h2>
          <div
            className="p-6 rounded-lg shadow-lg"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {organizationsByType.map((type) => (
                <div key={type.organizationType} className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">
                    {type._count.id}
                  </div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: "#ffa07a" }}
                  >
                    {type.organizationType}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Organizations by Donation Activity */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Top Organizations by Donation Activity
          </h2>
          <div
            className="shadow-lg rounded-lg overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="overflow-x-auto">
              {topOrganizationsByDonations.length === 0 ? (
                <div className="px-6 py-8 text-center text-white/70">
                  No donation activity yet.
                </div>
              ) : (
                <table className="min-w-full">
                  <thead style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                        Organization
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                        Donations
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                        Contacts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                        Users
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {topOrganizationsByDonations.map((org, index) => (
                      <tr
                        key={org.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-white">
                          #{index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-white">
                          {org.name}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              background:
                                org.organizationType === "PARENT"
                                  ? "rgba(180, 21, 75, 0.3)"
                                  : org.organizationType === "PROJECT"
                                  ? "rgba(255, 107, 53, 0.3)"
                                  : "rgba(118, 75, 162, 0.3)",
                              border:
                                org.organizationType === "PARENT"
                                  ? "1px solid rgba(180, 21, 75, 0.5)"
                                  : org.organizationType === "PROJECT"
                                  ? "1px solid rgba(255, 107, 53, 0.5)"
                                  : "1px solid rgba(118, 75, 162, 0.5)",
                              color: "white",
                            }}
                          >
                            {org.organizationType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {org._count.donations}
                        </td>
                        <td className="px-6 py-4 text-sm text-white/80">
                          {org._count.contacts}
                        </td>
                        <td className="px-6 py-4 text-sm text-white/80">
                          {org._count.users}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Recently Added Organizations */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Recently Added Organizations
          </h2>
          <div
            className="shadow-lg rounded-lg overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="overflow-x-auto">
              {recentOrganizations.length === 0 ? (
                <div className="px-6 py-8 text-center text-white/70">
                  No organizations yet.
                </div>
              ) : (
                <table className="min-w-full">
                  <thead style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                        Organization
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                        Users
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                        Contacts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                        Donations
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentOrganizations.map((org) => (
                      <tr
                        key={org.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-white">
                          {org.name}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              background:
                                org.organizationType === "PARENT"
                                  ? "rgba(180, 21, 75, 0.3)"
                                  : org.organizationType === "PROJECT"
                                  ? "rgba(255, 107, 53, 0.3)"
                                  : "rgba(118, 75, 162, 0.3)",
                              border:
                                org.organizationType === "PARENT"
                                  ? "1px solid rgba(180, 21, 75, 0.5)"
                                  : org.organizationType === "PROJECT"
                                  ? "1px solid rgba(255, 107, 53, 0.5)"
                                  : "1px solid rgba(118, 75, 162, 0.5)",
                              color: "white",
                            }}
                          >
                            {org.organizationType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {org._count.users}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {org._count.contacts}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {org._count.donations}
                        </td>
                        <td className="px-6 py-4 text-sm text-white/70">
                          {new Date(org.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
