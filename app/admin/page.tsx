import { requirePlatformAdmin, getAllOrganizations } from "@/lib/auth-helpers";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import { Plus, Users, ChartBar } from "@phosphor-icons/react/dist/ssr";

// Force dynamic rendering - prevents build-time database queries
export const dynamic = 'force-dynamic';

export default async function PlatformAdminDashboard() {
  // Require platform admin access
  const user = await requirePlatformAdmin();

  // Get all organizations
  const organizations = await getAllOrganizations();

  // Group by type
  const independent = organizations.filter((org) => org.organizationType === "INDEPENDENT");
  const parents = organizations.filter((org) => org.organizationType === "PARENT");
  const projects = organizations.filter((org) => org.organizationType === "PROJECT");

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <AdminNav userName={user.name || "Admin"} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-lg shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <h3 className="text-sm font-medium text-white/70">Total Organizations</h3>
            <p className="text-3xl font-bold text-white mt-2">{organizations.length}</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg" style={{ background: 'rgba(118, 75, 162, 0.2)', border: '1px solid rgba(118, 75, 162, 0.4)' }}>
            <h3 className="text-sm font-medium text-white/70">Independent Orgs</h3>
            <p className="text-3xl font-bold" style={{ color: '#ffa07a' }}>{independent.length}</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg" style={{ background: 'rgba(180, 21, 75, 0.2)', border: '1px solid rgba(180, 21, 75, 0.4)' }}>
            <h3 className="text-sm font-medium text-white/70">Parent Orgs</h3>
            <p className="text-3xl font-bold" style={{ color: '#ff6b35' }}>{parents.length}</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg" style={{ background: 'rgba(255, 107, 53, 0.2)', border: '1px solid rgba(255, 107, 53, 0.4)' }}>
            <h3 className="text-sm font-medium text-white/70">Projects</h3>
            <p className="text-3xl font-bold" style={{ color: '#ffa07a' }}>{projects.length}</p>
          </div>
        </div>

        {/* Organizations List */}
        <div className="shadow-lg rounded-lg overflow-hidden saga-glass-dark">
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255, 107, 107, 0.2)' }}>
            <h2 className="text-lg font-semibold text-white">All Organizations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Organization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Tax Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Contacts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Donations</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">{org.name}</div>
                        <div className="text-sm text-white/60">EIN: {org.ein}</div>
                        {org.parentOrganization && (
                          <div className="text-xs mt-1" style={{ color: '#ff6b35' }}>
                            ↳ Under: {org.parentOrganization.name}
                          </div>
                        )}
                        {org.subProjects.length > 0 && (
                          <div className="text-xs mt-1" style={{ color: '#ffa07a' }}>
                            {org.subProjects.length} sub-project(s)
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        org.organizationType === "PARENT" ? "text-white" :
                        org.organizationType === "PROJECT" ? "text-white" :
                        "text-white"
                      }`} style={{
                        background: org.organizationType === "PARENT" ? 'rgba(180, 21, 75, 0.3)' :
                                   org.organizationType === "PROJECT" ? 'rgba(255, 107, 53, 0.3)' :
                                   'rgba(118, 75, 162, 0.3)',
                        border: org.organizationType === "PARENT" ? '1px solid rgba(180, 21, 75, 0.5)' :
                               org.organizationType === "PROJECT" ? '1px solid rgba(255, 107, 53, 0.5)' :
                               '1px solid rgba(118, 75, 162, 0.5)'
                      }}>
                        {org.organizationType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">{org.taxExemptStatus}</td>
                    <td className="px-6 py-4 text-sm text-white">{org._count.users}</td>
                    <td className="px-6 py-4 text-sm text-white">{org._count.contacts}</td>
                    <td className="px-6 py-4 text-sm text-white">{org._count.donations}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/organizations/${org.id}`}
                        className="text-sm font-medium hover:underline transition-colors text-[#ffa07a]"
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

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/organizations/create"
            className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-all text-center border-2 border-dashed hover:scale-105 bg-white/5 border-[#ff6b35]/40 hover:border-[#ff6b35] hover:bg-[#ff6b35]/10"
          >
            <div className="flex justify-center mb-2">
              <Plus size={48} weight="bold" className="text-orange-400" />
            </div>
            <h3 className="font-semibold text-white">Create Organization</h3>
            <p className="text-sm text-white/70 mt-1">Add a new customer organization</p>
          </Link>

          <Link
            href="/admin/users"
            className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-all text-center hover:scale-105 bg-[#764ba2]/15 border border-[#764ba2]/40 hover:bg-[#764ba2]/25"
          >
            <div className="flex justify-center mb-2">
              <Users size={48} weight="bold" className="text-purple-400" />
            </div>
            <h3 className="font-semibold text-white">Manage Users</h3>
            <p className="text-sm text-white/70 mt-1">View and manage all users</p>
          </Link>

          <Link
            href="/admin/reports"
            className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-all text-center hover:scale-105 bg-[#b4154b]/15 border border-[#b4154b]/40 hover:bg-[#b4154b]/25"
          >
            <div className="flex justify-center mb-2">
              <ChartBar size={48} weight="bold" className="text-pink-400" />
            </div>
            <h3 className="font-semibold text-white">Platform Reports</h3>
            <p className="text-sm text-white/70 mt-1">System-wide analytics</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
