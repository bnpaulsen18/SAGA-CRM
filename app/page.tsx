import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="text-center max-w-4xl">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            SAGA CRM
          </h1>
          <p className="text-2xl text-gray-700 mb-4">
            AI-Powered Nonprofit Customer Relationship Management
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Manage donors, track campaigns, and grow your nonprofit with
            powerful tools designed specifically for mission-driven
            organizations.
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <Link
              href="/register"
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition-colors border border-indigo-600"
            >
              Sign In
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="text-lg font-semibold mb-2">Contact Management</h3>
              <p className="text-gray-600 text-sm">
                Track donors, volunteers, and stakeholders in one place
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-lg font-semibold mb-2">Donation Tracking</h3>
              <p className="text-gray-600 text-sm">
                Monitor contributions and generate tax receipts automatically
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold mb-2">Campaign Analytics</h3>
              <p className="text-gray-600 text-sm">
                Measure impact and optimize your fundraising efforts
              </p>
            </div>
          </div>

          <div className="mt-16 text-sm text-gray-500">
            ✨ Week 2 Complete - Authentication & Dashboard Ready ✨
          </div>
        </div>
      </div>
    </main>
  );
}
