import { requirePlatformAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function CreateOrganizationPage() {
  await requirePlatformAdmin();

  async function createOrganization(formData: FormData) {
    "use server";

    await requirePlatformAdmin();

    const name = formData.get("name") as string;
    const ein = formData.get("ein") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const website = formData.get("website") as string;
    const organizationType = formData.get("organizationType") as string;
    const parentOrganizationId = formData.get("parentOrganizationId") as string;
    const taxExemptStatus = formData.get("taxExemptStatus") as string;
    const fiscalYearEnd = formData.get("fiscalYearEnd") as string;
    const missionStatement = formData.get("missionStatement") as string;
    const primaryProgram = formData.get("primaryProgram") as string;
    const allowSubProjects = formData.get("allowSubProjects") === "on";

    await prisma.organization.create({
      data: {
        name,
        ein,
        email,
        phone: phone || null,
        website: website || null,
        organizationType: organizationType as any,
        parentOrganizationId: parentOrganizationId || null,
        taxExemptStatus: taxExemptStatus as any,
        fiscalYearEnd: fiscalYearEnd || null,
        missionStatement: missionStatement || null,
        primaryProgram: primaryProgram || null,
        allowSubProjects,
      },
    });

    redirect("/admin");
  }

  // Get all parent organizations for the dropdown
  const potentialParents = await prisma.organization.findMany({
    where: {
      OR: [
        { organizationType: "PARENT" },
        { organizationType: "INDEPENDENT" },
      ],
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="min-h-screen saga-gradient">
      {/* SAGA Header */}
      <header
        className="shadow-lg border-b-2 sticky top-0 z-50 saga-header-gradient border-b-[rgba(255,107,53,0.3)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image
                src="/SAGA_Logo_final.png"
                alt="SAGA CRM"
                width={180}
                height={50}
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">Create Organization</h1>
                <p className="text-sm text-white/85">Add a new customer organization</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 rounded-lg font-semibold transition-all saga-glass text-white"
            >
              ← Back to Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form action={createOrganization} className="space-y-6">
          {/* Basic Information */}
          <div className="p-6 rounded-lg shadow-lg saga-glass-dark">
            <h2 className="text-xl font-bold text-white mb-6" style={{ borderBottom: '2px solid rgba(255, 107, 53, 0.3)', paddingBottom: '0.75rem' }}>
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                  Organization Name <span className="text-[#ff6b35]">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  placeholder="e.g., Community Hope Foundation"
                />
              </div>

              <div>
                <label htmlFor="ein" className="block text-sm font-medium text-white/90 mb-2">
                  EIN (Tax ID) <span className="text-[#ff6b35]">*</span>
                </label>
                <input
                  type="text"
                  id="ein"
                  name="ein"
                  required
                  pattern="[0-9]{2}-[0-9]{7}"
                  className="w-full px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  placeholder="e.g., 12-3456789"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                  Email <span className="text-[#ff6b35]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  placeholder="contact@organization.org"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white/90 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="website" className="block text-sm font-medium text-white/90 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  className="w-full px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  placeholder="https://www.organization.org"
                />
              </div>
            </div>
          </div>

          {/* Organization Type & Tax Status */}
          <div className="p-6 rounded-lg shadow-lg saga-glass-dark">
            <h2 className="text-xl font-bold text-white mb-6" style={{ borderBottom: '2px solid rgba(255, 107, 53, 0.3)', paddingBottom: '0.75rem' }}>
              Organization Structure
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="organizationType" className="block text-sm font-medium text-white/90 mb-2">
                  Organization Type <span className="text-[#ff6b35]">*</span>
                </label>
                <select
                  id="organizationType"
                  name="organizationType"
                  required
                  className="w-full px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <option value="INDEPENDENT">Independent - Standalone nonprofit</option>
                  <option value="PARENT">Parent - Fiscal sponsor with sub-projects</option>
                  <option value="PROJECT">Project - Sub-project under parent</option>
                </select>
              </div>

              <div>
                <label htmlFor="parentOrganizationId" className="block text-sm font-medium text-white/90 mb-2">
                  Parent Organization
                  <span className="text-xs text-white/60 ml-2">(Only for PROJECT type)</span>
                </label>
                <select
                  id="parentOrganizationId"
                  name="parentOrganizationId"
                  className="w-full px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <option value="">-- No Parent --</option>
                  {potentialParents.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="taxExemptStatus" className="block text-sm font-medium text-white/90 mb-2">
                  Tax Exempt Status <span className="text-[#ff6b35]">*</span>
                </label>
                <select
                  id="taxExemptStatus"
                  name="taxExemptStatus"
                  required
                  className="w-full px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <option value="EXEMPT_501C3">501(c)(3) - Public Charity</option>
                  <option value="EXEMPT_501C4">501(c)(4) - Social Welfare</option>
                  <option value="EXEMPT_501C6">501(c)(6) - Business League</option>
                  <option value="EXEMPT_501C7">501(c)(7) - Social Club</option>
                  <option value="EXEMPT_OTHER">Other Tax-Exempt</option>
                  <option value="FOR_PROFIT">For-Profit</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>

              <div>
                <label htmlFor="fiscalYearEnd" className="block text-sm font-medium text-white/90 mb-2">
                  Fiscal Year End
                  <span className="text-xs text-white/60 ml-2">(MM-DD format)</span>
                </label>
                <input
                  type="text"
                  id="fiscalYearEnd"
                  name="fiscalYearEnd"
                  pattern="(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])"
                  className="w-full px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  placeholder="12-31"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="allowSubProjects"
                    className="w-5 h-5 rounded"
                    style={{
                      accentColor: '#ff6b35'
                    }}
                  />
                  <span className="text-sm font-medium text-white/90">
                    Allow this organization to create sub-projects (for fiscal sponsors)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Mission & Programs */}
          <div className="p-6 rounded-lg shadow-lg saga-glass-dark">
            <h2 className="text-xl font-bold text-white mb-6" style={{ borderBottom: '2px solid rgba(255, 107, 53, 0.3)', paddingBottom: '0.75rem' }}>
              Mission & Programs
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="primaryProgram" className="block text-sm font-medium text-white/90 mb-2">
                  Primary Program
                </label>
                <input
                  type="text"
                  id="primaryProgram"
                  name="primaryProgram"
                  className="w-full px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  placeholder="e.g., Community Education, Food Security, Youth Development"
                />
              </div>

              <div>
                <label htmlFor="missionStatement" className="block text-sm font-medium text-white/90 mb-2">
                  Mission Statement
                </label>
                <textarea
                  id="missionStatement"
                  name="missionStatement"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  placeholder="Describe the organization's mission and purpose..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/admin"
              className="px-6 py-3 rounded-lg font-semibold transition-all"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white'
              }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #b4154b 0%, #ff6b35 100%)',
                border: 'none',
                color: 'white',
                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)'
              }}
            >
              Create Organization
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
