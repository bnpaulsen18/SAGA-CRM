import { requirePlatformAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import Link from "next/link";

interface OrganizationDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrganizationDetailPage({
  params,
}: OrganizationDetailPageProps) {
  const user = await requirePlatformAdmin();
  const { id } = await params;

  // Fetch organization with all related data
  const organization = await prisma.organization.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
      parentOrganization: {
        select: {
          id: true,
          name: true,
        },
      },
      subProjects: {
        select: {
          id: true,
          name: true,
          ein: true,
          _count: {
            select: {
              users: true,
              contacts: true,
              donations: true,
            },
          },
        },
      },
      _count: {
        select: {
          users: true,
          contacts: true,
          donations: true,
          campaigns: true,
        },
      },
    },
  });

  if (!organization) {
    notFound();
  }

  // Fetch recent donations
  const recentDonations = await prisma.donation.findMany({
    where: { organizationId: id },
    take: 10,
    orderBy: { donatedAt: "desc" },
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
  });

  // Calculate total donation amount
  const totalDonationAmount = await prisma.donation.aggregate({
    where: { organizationId: id },
    _sum: {
      amount: true,
    },
  });

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
        currentPage={organization.name}
        showBackButton={true}
        backHref="/admin"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Organization Header */}
        <div
          className="p-6 rounded-lg shadow-lg mb-8"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {organization.name}
              </h2>
              <div className="space-y-1 text-sm text-white/70">
                <p>
                  <span className="font-medium">EIN:</span> {organization.ein}
                </p>
                <p>
                  <span className="font-medium">Type:</span>{" "}
                  <span
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      background:
                        organization.organizationType === "PARENT"
                          ? "rgba(180, 21, 75, 0.3)"
                          : organization.organizationType === "PROJECT"
                          ? "rgba(255, 107, 53, 0.3)"
                          : "rgba(118, 75, 162, 0.3)",
                      border:
                        organization.organizationType === "PARENT"
                          ? "1px solid rgba(180, 21, 75, 0.5)"
                          : organization.organizationType === "PROJECT"
                          ? "1px solid rgba(255, 107, 53, 0.5)"
                          : "1px solid rgba(118, 75, 162, 0.5)",
                    }}
                  >
                    {organization.organizationType}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Tax Exempt Status:</span>{" "}
                  {organization.taxExemptStatus}
                </p>
                {organization.parentOrganization && (
                  <p>
                    <span className="font-medium">Parent Organization:</span>{" "}
                    <Link
                      href={`/admin/organizations/${organization.parentOrganization.id}`}
                      className="hover:underline"
                      style={{ color: "#ff6b35" }}
                    >
                      {organization.parentOrganization.name}
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className="p-6 rounded-lg shadow-lg"
            style={{
              background: "rgba(118, 75, 162, 0.2)",
              border: "1px solid rgba(118, 75, 162, 0.4)",
            }}
          >
            <h3 className="text-sm font-medium text-white/70">Total Users</h3>
            <p className="text-3xl font-bold text-white mt-2">
              {organization._count.users}
            </p>
          </div>
          <div
            className="p-6 rounded-lg shadow-lg"
            style={{
              background: "rgba(180, 21, 75, 0.2)",
              border: "1px solid rgba(180, 21, 75, 0.4)",
            }}
          >
            <h3 className="text-sm font-medium text-white/70">Contacts</h3>
            <p className="text-3xl font-bold" style={{ color: "#ffa07a" }}>
              {organization._count.contacts}
            </p>
          </div>
          <div
            className="p-6 rounded-lg shadow-lg"
            style={{
              background: "rgba(255, 107, 53, 0.2)",
              border: "1px solid rgba(255, 107, 53, 0.4)",
            }}
          >
            <h3 className="text-sm font-medium text-white/70">Campaigns</h3>
            <p className="text-3xl font-bold" style={{ color: "#ff6b35" }}>
              {organization._count.campaigns}
            </p>
          </div>
          <div
            className="p-6 rounded-lg shadow-lg"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <h3 className="text-sm font-medium text-white/70">Total Raised</h3>
            <p className="text-3xl font-bold text-white mt-2">
              ${(totalDonationAmount._sum.amount || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div
          className="shadow-lg rounded-lg overflow-hidden mb-8"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            className="px-6 py-4"
            style={{ borderBottom: "1px solid rgba(255, 107, 107, 0.2)" }}
          >
            <h2 className="text-lg font-semibold text-white">Users</h2>
          </div>
          <div className="overflow-x-auto">
            {organization.users.length === 0 ? (
              <div className="px-6 py-8 text-center text-white/70">
                No users found for this organization.
              </div>
            ) : (
              <table className="min-w-full">
                <thead style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y"
                  style={{ divideColor: "rgba(255, 255, 255, 0.05)" }}
                >
                  {organization.users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-white">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/80">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            background: "rgba(118, 75, 162, 0.3)",
                            border: "1px solid rgba(118, 75, 162, 0.5)",
                            color: "white",
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Sub-Projects (if applicable) */}
        {organization.subProjects.length > 0 && (
          <div
            className="shadow-lg rounded-lg overflow-hidden mb-8"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div
              className="px-6 py-4"
              style={{ borderBottom: "1px solid rgba(255, 107, 107, 0.2)" }}
            >
              <h2 className="text-lg font-semibold text-white">
                Sub-Projects
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                      Project Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                      EIN
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y"
                  style={{ divideColor: "rgba(255, 255, 255, 0.05)" }}
                >
                  {organization.subProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {project.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/80">
                        {project.ein}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {project._count.users}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {project._count.contacts}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {project._count.donations}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/organizations/${project.id}`}
                          className="text-sm font-medium hover:underline transition-colors"
                          style={{ color: "#ffa07a" }}
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Donations */}
        <div
          className="shadow-lg rounded-lg overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            className="px-6 py-4"
            style={{ borderBottom: "1px solid rgba(255, 107, 107, 0.2)" }}
          >
            <h2 className="text-lg font-semibold text-white">
              Recent Donations
            </h2>
          </div>
          <div className="overflow-x-auto">
            {recentDonations.length === 0 ? (
              <div className="px-6 py-8 text-center text-white/70">
                No donations found for this organization.
              </div>
            ) : (
              <table className="min-w-full">
                <thead style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                      Donor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y"
                  style={{ divideColor: "rgba(255, 255, 255, 0.05)" }}
                >
                  {recentDonations.map((donation) => (
                    <tr
                      key={donation.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-white">
                        {donation.contact.firstName} {donation.contact.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        ${donation.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/80">
                        {donation.campaign?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">
                        {new Date(donation.donatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            background:
                              donation.status === "COMPLETED"
                                ? "rgba(34, 197, 94, 0.3)"
                                : donation.status === "PENDING"
                                ? "rgba(255, 193, 7, 0.3)"
                                : "rgba(239, 68, 68, 0.3)",
                            border:
                              donation.status === "COMPLETED"
                                ? "1px solid rgba(34, 197, 94, 0.5)"
                                : donation.status === "PENDING"
                                ? "1px solid rgba(255, 193, 7, 0.5)"
                                : "1px solid rgba(239, 68, 68, 0.5)",
                            color: "white",
                          }}
                        >
                          {donation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
