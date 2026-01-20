import { requirePlatformAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import Link from "next/link";
import { Warning } from "@phosphor-icons/react/dist/ssr";

// Force dynamic rendering - prevents build-time database queries
export const dynamic = 'force-dynamic';

export default async function UsersManagementPage() {
  const user = await requirePlatformAdmin();

  // Fetch all users with their organization details
  const allUsers = await prisma.user.findMany({
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          organizationType: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate stats
  const totalUsers = allUsers.length;
  const platformAdmins = allUsers.filter((u) => u.isPlatformAdmin).length;
  const adminUsers = allUsers.filter((u) => u.role === "ADMIN" && !u.isPlatformAdmin).length;
  const regularUsers = allUsers.filter((u) => u.role === "MEMBER").length;

  // Group users by organization
  const usersWithOrg = allUsers.filter((u) => u.organization);
  const usersWithoutOrg = allUsers.filter((u) => !u.organization);

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
        currentPage="Manage Users"
        showBackButton={true}
        backHref="/admin"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className="p-6 rounded-lg shadow-lg"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <h3 className="text-sm font-medium text-white/70">Total Users</h3>
            <p className="text-3xl font-bold text-white mt-2">{totalUsers}</p>
          </div>
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
            <h3 className="text-sm font-medium text-white/70">Org Admins</h3>
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
            <h3 className="text-sm font-medium text-white/70">Regular Users</h3>
            <p className="text-3xl font-bold text-white">
              {regularUsers}
            </p>
          </div>
        </div>

        {/* All Users Table */}
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
            <h2 className="text-lg font-semibold text-white">All Platform Users</h2>
            <p className="text-sm text-white/70 mt-1">
              Manage users across all organizations
            </p>
          </div>
          <div className="overflow-x-auto">
            {allUsers.length === 0 ? (
              <div className="px-6 py-8 text-center text-white/70">
                No users found in the system.
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
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/80">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {u.organization ? (
                          <Link
                            href={`/admin/organizations/${u.organization.id}`}
                            className="hover:underline"
                            style={{ color: "#ffa07a" }}
                          >
                            {u.organization.name}
                          </Link>
                        ) : (
                          <span className="text-white/50 italic">
                            No organization
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            background:
                              u.role === "ADMIN"
                                ? "rgba(180, 21, 75, 0.3)"
                                : "rgba(118, 75, 162, 0.3)",
                            border:
                              u.role === "ADMIN"
                                ? "1px solid rgba(180, 21, 75, 0.5)"
                                : "1px solid rgba(118, 75, 162, 0.5)",
                            color: "white",
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {u.isPlatformAdmin ? (
                          <span
                            className="px-2 py-1 rounded-full text-xs font-semibold"
                            style={{
                              background: "rgba(255, 107, 53, 0.3)",
                              border: "1px solid rgba(255, 107, 53, 0.5)",
                              color: "#ff6b35",
                            }}
                          >
                            Platform Admin
                          </span>
                        ) : u.organization?.organizationType ? (
                          <span
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              background:
                                u.organization.organizationType === "PARENT"
                                  ? "rgba(180, 21, 75, 0.2)"
                                  : u.organization.organizationType === "PROJECT"
                                  ? "rgba(255, 107, 53, 0.2)"
                                  : "rgba(118, 75, 162, 0.2)",
                              border:
                                u.organization.organizationType === "PARENT"
                                  ? "1px solid rgba(180, 21, 75, 0.4)"
                                  : u.organization.organizationType === "PROJECT"
                                  ? "1px solid rgba(255, 107, 53, 0.4)"
                                  : "1px solid rgba(118, 75, 162, 0.4)",
                              color: "white",
                            }}
                          >
                            {u.organization.organizationType}
                          </span>
                        ) : (
                          <span className="text-white/50 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Users Without Organization Warning (if any) */}
        {usersWithoutOrg.length > 0 && (
          <div
            className="mt-8 p-6 rounded-lg shadow-lg"
            style={{
              background: "rgba(255, 193, 7, 0.1)",
              border: "1px solid rgba(255, 193, 7, 0.3)",
            }}
          >
            <div className="flex items-start gap-3">
              <Warning size={32} weight="bold" className="text-yellow-400" />
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Users Without Organization
                </h3>
                <p className="text-sm text-white/80">
                  {usersWithoutOrg.length} user(s) are not assigned to any
                  organization. These users may not be able to access most
                  features.
                </p>
                <div className="mt-3 space-y-1">
                  {usersWithoutOrg.map((u) => (
                    <div
                      key={u.id}
                      className="text-sm text-white/90"
                    >
                      • {u.firstName} {u.lastName} ({u.email})
                      {u.isPlatformAdmin && (
                        <span
                          className="ml-2 text-xs"
                          style={{ color: "#ff6b35" }}
                        >
                          - Platform Admin
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
