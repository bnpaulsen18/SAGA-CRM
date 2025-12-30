import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Header with Logo */}
      <header className="bg-gradient-to-r from-[#1a0a2e] via-[#2d1b3d] via-[#5c1644] via-[#8b1e4b] via-[#b4154b] to-[#ff6b35] border-b-2 border-[rgba(255,107,53,0.3)] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/SAGA_Logo_final.png"
              alt="SAGA"
              style={{
                height: '80px',
                width: 'auto',
                display: 'block',
                filter: 'drop-shadow(0 6px 16px rgba(255, 107, 107, 0.4)) brightness(1.1) contrast(1.15) saturate(1.08)',
                opacity: '0.98'
              }}
            />
          </div>
          <div className="flex gap-4">
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
        </div>
      </header>

      {/* Hero */}
      <div className="flex min-h-[calc(100vh-88px)] flex-col items-center justify-center p-8">
        <div className="text-center max-w-6xl">
          {/* Results-Driven Headline */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] px-5 py-2.5 rounded-full text-sm font-bold text-white mb-8 shadow-lg">
            <span>✨</span>
            <span>Trusted by 10,000+ Nonprofits</span>
          </div>

          <h1 className="text-6xl font-bold mb-6 text-white leading-tight">
            Raise More.
            <br />
            <span className="bg-gradient-to-r from-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent">
              Manage Smarter.
            </span>
          </h1>

          <p className="text-2xl text-white/90 mb-4 font-medium">
            The AI-powered CRM helping nonprofits raise $500M+ and counting
          </p>

          <p className="text-lg text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of mission-driven organizations using SAGA to build stronger donor relationships,
            automate workflows, and maximize every fundraising campaign.
          </p>

          {/* Dual CTA */}
          <div className="flex gap-6 justify-center mb-16">
            <Link
              href="/register"
              className="px-10 py-4 bg-gradient-to-r from-[#ff6b6b] to-[#ffa07a] text-white font-bold rounded-xl shadow-lg hover:shadow-[0_6px_20px_rgba(255,107,107,0.4)] hover:-translate-y-0.5 transition-all text-lg"
            >
              Start Free Trial →
            </Link>
            <Link
              href="/demo"
              className="px-10 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl shadow-lg hover:bg-white/20 transition-all text-lg border border-white/20"
            >
              Watch Demo
            </Link>
          </div>

          {/* Big Stats Showcase */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-5xl mx-auto">
            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-sm border border-[rgba(255,107,107,0.3)] rounded-2xl p-8 hover:border-[rgba(255,107,107,0.5)] transition-all">
              <div className="text-5xl font-black bg-gradient-to-r from-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent mb-3">
                $500M+
              </div>
              <div className="text-white/80 font-medium">Total Raised</div>
              <div className="text-white/50 text-sm mt-1">by SAGA nonprofits</div>
            </div>

            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-sm border border-[rgba(255,107,107,0.3)] rounded-2xl p-8 hover:border-[rgba(255,107,107,0.5)] transition-all">
              <div className="text-5xl font-black bg-gradient-to-r from-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent mb-3">
                10K+
              </div>
              <div className="text-white/80 font-medium">Active Orgs</div>
              <div className="text-white/50 text-sm mt-1">and growing daily</div>
            </div>

            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-sm border border-[rgba(255,107,107,0.3)] rounded-2xl p-8 hover:border-[rgba(255,107,107,0.5)] transition-all">
              <div className="text-5xl font-black bg-gradient-to-r from-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent mb-3">
                98%
              </div>
              <div className="text-white/80 font-medium">Satisfaction</div>
              <div className="text-white/50 text-sm mt-1">customer rating</div>
            </div>

            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-sm border border-[rgba(255,107,107,0.3)] rounded-2xl p-8 hover:border-[rgba(255,107,107,0.5)] transition-all">
              <div className="text-5xl font-black bg-gradient-to-r from-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent mb-3">
                35%
              </div>
              <div className="text-white/80 font-medium">Avg Increase</div>
              <div className="text-white/50 text-sm mt-1">in donor retention</div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <div className="bg-[rgba(26,26,46,0.5)] backdrop-blur-sm border border-[rgba(255,107,107,0.2)] rounded-xl p-8 text-left hover:border-[rgba(255,107,107,0.4)] hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Segmentation</h3>
              <p className="text-white/70 leading-relaxed">
                AI identifies your most engaged donors and recommends the perfect time to reach out
              </p>
            </div>

            <div className="bg-[rgba(26,26,46,0.5)] backdrop-blur-sm border border-[rgba(255,107,107,0.2)] rounded-xl p-8 text-left hover:border-[rgba(255,107,107,0.4)] hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-3">Automated Workflows</h3>
              <p className="text-white/70 leading-relaxed">
                From thank-you emails to tax receipts - automation that saves 15+ hours per week
              </p>
            </div>

            <div className="bg-[rgba(26,26,46,0.5)] backdrop-blur-sm border border-[rgba(255,107,107,0.2)] rounded-xl p-8 text-left hover:border-[rgba(255,107,107,0.4)] hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-white mb-3">Predictive Analytics</h3>
              <p className="text-white/70 leading-relaxed">
                Forecast campaign performance and donor lifetime value with machine learning
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
