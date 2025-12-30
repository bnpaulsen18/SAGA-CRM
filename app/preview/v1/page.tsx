import Link from "next/link";
import Image from "next/image";

// VERSION 1: "Minimalist Hero" - Logo-First, Story-Driven
// Focus: Let the SAGA logo be the hero, emphasize the tagline, clean minimal design
// Selling Point: Every nonprofit has a unique story - SAGA helps tell it

export default function HomeV1() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Preview Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-black/50 backdrop-blur-sm p-2 rounded-lg border border-white/20">
        <Link href="/preview/v1" className="px-3 py-1 bg-[#ff6b6b] text-white rounded text-sm font-semibold">
          V1
        </Link>
        <Link href="/preview/v2" className="px-3 py-1 bg-white/10 text-white rounded text-sm hover:bg-white/20">
          V2
        </Link>
        <Link href="/preview/v3" className="px-3 py-1 bg-white/10 text-white rounded text-sm hover:bg-white/20">
          V3
        </Link>
        <Link href="/" className="px-3 py-1 bg-white/10 text-white rounded text-sm hover:bg-white/20">
          Current
        </Link>
      </div>

      {/* Colorful Header with Gradient */}
      <header className="bg-gradient-to-r from-[#1a0a2e] via-[#2d1b3d] via-[#5c1644] via-[#8b1e4b] via-[#b4154b] to-[#ff6b35] border-b-2 border-[rgba(255,107,53,0.3)] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto flex justify-end items-center gap-4">
          <Link
            href="/login"
            className="px-6 py-2 text-white hover:text-[#ffa07a] transition-colors font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-6 py-2 bg-[#764ba2] text-white rounded-lg hover:bg-[#8b5fb8] transition-all shadow-[0_2px_8px_rgba(118,75,162,0.3)] hover:shadow-[0_4px_12px_rgba(118,75,162,0.4)] hover:-translate-y-0.5 font-semibold"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero - Logo Takes Center Stage */}
      <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-8">
        <div className="text-center max-w-6xl">
          {/* Large Logo */}
          <div className="flex items-center justify-center mb-12">
            <Image
              src="/SAGA_Logo_final.png"
              alt="SAGA - every donor has a story"
              width={1200}
              height={480}
              className="h-80 w-auto opacity-95"
              style={{
                mixBlendMode: 'lighten',
                filter: 'contrast(1.1) saturate(1.2)'
              }}
              priority
            />
          </div>

          {/* AI Badge - Colorful */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] px-5 py-2.5 rounded-full text-sm font-semibold text-white mb-8 shadow-lg border border-white/20">
            <span>✨</span>
            <span>AI-Powered Nonprofit CRM</span>
          </div>

          {/* Value Proposition */}
          <h2 className="text-4xl text-white mb-6 font-light max-w-3xl mx-auto leading-relaxed">
            Donor management built for{" "}
            <span className="font-semibold bg-gradient-to-r from-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent">
              mission-driven organizations
            </span>
          </h2>

          <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Track relationships, automate receipts, and understand your donors with AI-powered insights.
            Because every nonprofit deserves enterprise-level tools.
          </p>

          {/* Single Strong CTA */}
          <Link
            href="/register"
            className="inline-block px-12 py-4 bg-gradient-to-r from-[#ff6b6b] to-[#ffa07a] text-white font-semibold rounded-xl shadow-lg hover:shadow-[0_8px_30px_rgba(255,107,107,0.5)] hover:-translate-y-1 transition-all text-lg"
          >
            Start Free Trial
          </Link>

          {/* Trust Signals - Colorful Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-sm border border-[rgba(255,107,107,0.25)] rounded-xl p-6 hover:border-[rgba(255,107,107,0.4)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,107,107,0.15)] transition-all">
              <div className="text-4xl font-black bg-gradient-to-r from-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-white/80 text-sm">Active Nonprofits</div>
            </div>
            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-sm border border-[rgba(255,107,107,0.25)] rounded-xl p-6 hover:border-[rgba(255,107,107,0.4)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,107,107,0.15)] transition-all">
              <div className="text-4xl font-black bg-gradient-to-r from-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent mb-2">
                $500M+
              </div>
              <div className="text-white/80 text-sm">Total Raised</div>
            </div>
            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-sm border border-[rgba(255,107,107,0.25)] rounded-xl p-6 hover:border-[rgba(255,107,107,0.4)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,107,107,0.15)] transition-all">
              <div className="text-4xl font-black bg-gradient-to-r from-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent mb-2">
                98%
              </div>
              <div className="text-white/80 text-sm">Satisfaction Rate</div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-sm border border-[rgba(255,107,107,0.25)] rounded-xl p-8 hover:border-[rgba(255,107,107,0.4)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,107,107,0.15)] transition-all">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-[#ffa07a] mb-3">Contact Management</h3>
              <p className="text-white/70 leading-relaxed">
                Track donors, volunteers, and stakeholders in one place with AI-powered insights
              </p>
            </div>

            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-sm border border-[rgba(255,107,107,0.25)] rounded-xl p-8 hover:border-[rgba(255,107,107,0.4)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,107,107,0.15)] transition-all">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-[#ffa07a] mb-3">Donation Tracking</h3>
              <p className="text-white/70 leading-relaxed">
                Monitor contributions and generate tax receipts automatically with smart analytics
              </p>
            </div>

            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-sm border border-[rgba(255,107,107,0.25)] rounded-xl p-8 hover:border-[rgba(255,107,107,0.4)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,107,107,0.15)] transition-all">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-[#ffa07a] mb-3">Campaign Analytics</h3>
              <p className="text-white/70 leading-relaxed">
                Measure impact and optimize your fundraising efforts with predictive AI
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
