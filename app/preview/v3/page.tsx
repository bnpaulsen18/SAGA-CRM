import Link from "next/link";
import Image from "next/image";

// VERSION 3: "Bold & Dynamic" - Feature Showcase with Animation-Ready Design
// Focus: Modern, energetic, feature-rich presentation
// Selling Point: Powerful all-in-one platform built for modern nonprofits

export default function HomeV3() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Preview Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-black/50 backdrop-blur-sm p-2 rounded-lg border border-white/20">
        <Link href="/preview/v1" className="px-3 py-1 bg-white/10 text-white rounded text-sm hover:bg-white/20">
          V1
        </Link>
        <Link href="/preview/v2" className="px-3 py-1 bg-white/10 text-white rounded text-sm hover:bg-white/20">
          V2
        </Link>
        <Link href="/preview/v3" className="px-3 py-1 bg-[#ff6b6b] text-white rounded text-sm font-semibold">
          V3
        </Link>
        <Link href="/" className="px-3 py-1 bg-white/10 text-white rounded text-sm hover:bg-white/20">
          Current
        </Link>
      </div>

      {/* Sleek Header */}
      <header className="bg-[rgba(26,10,46,0.8)] backdrop-blur-md border-b border-[rgba(255,107,53,0.2)] p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center -my-4">
            <Image
              src="/SAGA_Logo_final.png"
              alt="SAGA"
              width={600}
              height={240}
              className="h-24 w-auto opacity-95"
              style={{
                mixBlendMode: 'lighten',
                filter: 'contrast(1.1) saturate(1.2)'
              }}
              priority
            />
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-white/70 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-white/70 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-white/70 hover:text-white transition-colors">
              About
            </a>
          </nav>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-5 py-2 text-white/90 hover:text-white transition-colors font-medium text-sm"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-gradient-to-r from-[#ff6b6b] to-[#ffa07a] text-white rounded-lg hover:shadow-[0_4px_16px_rgba(255,107,107,0.4)] transition-all font-semibold text-sm"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Dynamic Hero */}
      <div className="flex min-h-screen flex-col items-center justify-center p-8 -mt-20">
        <div className="text-center max-w-7xl">
          {/* Eye-Catching Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#ff6b6b] px-6 py-3 rounded-full text-sm font-bold text-white mb-8 shadow-[0_4px_20px_rgba(118,75,162,0.4)] border border-white/20">
            <span className="text-lg">✨</span>
            <span>Powered by AI • Trusted by 10,000+ Nonprofits</span>
          </div>

          {/* Powerful Headline - No "SAGA CRM" text */}
          <h1 className="text-7xl md:text-8xl font-black mb-8 leading-none">
            <span className="bg-gradient-to-r from-[#ff6b9d] via-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent">
              Every Donor
            </span>
            <br />
            <span className="text-white">
              Has a Story
            </span>
          </h1>

          <p className="text-3xl text-white/90 mb-6 font-semibold max-w-4xl mx-auto">
            The AI-powered nonprofit CRM that helps you tell it
          </p>

          <p className="text-xl text-white/60 mb-12 max-w-3xl mx-auto leading-relaxed">
            Manage relationships, automate campaigns, and maximize impact with the most powerful
            fundraising platform built specifically for mission-driven organizations.
          </p>

          {/* Strong CTAs */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
            <Link
              href="/register"
              className="group px-12 py-5 bg-gradient-to-r from-[#ff6b6b] to-[#ffa07a] text-white font-bold rounded-2xl shadow-[0_8px_30px_rgba(255,107,107,0.3)] hover:shadow-[0_12px_40px_rgba(255,107,107,0.5)] hover:-translate-y-1 transition-all text-lg"
            >
              Start Free Trial
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/demo"
              className="px-12 py-5 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl shadow-lg hover:bg-white/20 transition-all text-lg border-2 border-white/30"
            >
              Book a Demo
            </Link>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto">
            <div className="group bg-gradient-to-br from-[rgba(102,126,234,0.1)] to-[rgba(118,75,162,0.1)] backdrop-blur-sm border-2 border-[rgba(255,107,107,0.3)] rounded-2xl p-10 hover:border-[rgba(255,107,107,0.6)] hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(255,107,107,0.2)] transition-all">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">👥</div>
              <h3 className="text-2xl font-black text-white mb-4">360° Donor View</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Complete donor profiles with giving history, engagement scores, and AI-powered next-best-action recommendations
              </p>
            </div>

            <div className="group bg-gradient-to-br from-[rgba(102,126,234,0.1)] to-[rgba(118,75,162,0.1)] backdrop-blur-sm border-2 border-[rgba(255,107,107,0.3)] rounded-2xl p-10 hover:border-[rgba(255,107,107,0.6)] hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(255,107,107,0.2)] transition-all">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🤖</div>
              <h3 className="text-2xl font-black text-white mb-4">Smart Automation</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Automated thank-yous, tax receipts, follow-ups, and campaign workflows that run 24/7 while you focus on impact
              </p>
            </div>

            <div className="group bg-gradient-to-br from-[rgba(102,126,234,0.1)] to-[rgba(118,75,162,0.1)] backdrop-blur-sm border-2 border-[rgba(255,107,107,0.3)] rounded-2xl p-10 hover:border-[rgba(255,107,107,0.6)] hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(255,107,107,0.2)] transition-all">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-2xl font-black text-white mb-4">Predictive Insights</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Machine learning forecasts donor lifetime value, campaign ROI, and identifies at-risk relationships before they churn
              </p>
            </div>
          </div>

          {/* Compact Stats Bar */}
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 mt-24 pt-12 border-t border-white/10">
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent mb-2">
                $500M+
              </div>
              <div className="text-white/60 font-medium">Total Raised</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-white/60 font-medium">Organizations</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent mb-2">
                98%
              </div>
              <div className="text-white/60 font-medium">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-white/60 font-medium">Support</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
