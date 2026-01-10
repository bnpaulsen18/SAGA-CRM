/**
 * OPTION 3: Enterprise Data-Driven Hero Section
 * Split-screen layout with live metrics
 */

import { ArrowRight, ChartLine, TrendUp } from '@phosphor-icons/react/dist/ssr'

export default function HeroSplitScreen() {
  return (
    <section className="bg-[#FAFAFA] border-b border-[#D5DBDB]">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left: Content */}
          <div className="flex flex-col justify-center px-10 py-16 lg:py-24">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#EBF5FB] border border-[#D6EAF8] rounded-md px-3 py-1.5 mb-6 w-fit">
              <ChartLine size={16} weight="bold" className="text-[#1E3A5F]" />
              <span className="text-xs font-semibold text-[#1E3A5F] uppercase tracking-wide">
                Enterprise CRM for Nonprofits
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl md:text-6xl font-bold text-[#2C3E50] leading-tight mb-6"
              style={{ letterSpacing: '-0.02em' }}
            >
              Data-driven fundraising{' '}
              <span className="bg-gradient-to-r from-[#764ba2] to-[#FF6B35] bg-clip-text text-transparent">
                at scale
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-[#566573] leading-relaxed mb-8 max-w-lg">
              Centralize donor data, automate workflows, and make informed decisions with real-time analytics. Trusted by enterprise-scale nonprofit organizations.
            </p>

            {/* Key metrics */}
            <div className="grid grid-cols-3 gap-6 mb-10">
              <div>
                <p className="text-3xl font-bold text-[#2C3E50] mb-1">500+</p>
                <p className="text-xs text-[#95A5A6] uppercase tracking-wide">Organizations</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#2C3E50] mb-1">99.9%</p>
                <p className="text-xs text-[#95A5A6] uppercase tracking-wide">Uptime SLA</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#2C3E50] mb-1">24/7</p>
                <p className="text-xs text-[#95A5A6] uppercase tracking-wide">Support</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-8 py-4 bg-gradient-to-r from-[#764ba2] to-[#FF6B35] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-250 flex items-center justify-center gap-2">
                Request Demo
                <ArrowRight size={20} weight="bold" />
              </button>

              <button className="px-8 py-4 bg-white border-2 border-[#1E3A5F] text-[#1E3A5F] font-semibold rounded-lg hover:bg-[#F4F6F8] transition-all duration-250">
                View Documentation
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 pt-6 border-t border-[#D5DBDB]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-[#566573]">SOC 2 Type II</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-[#566573]">GDPR Compliant</span>
              </div>
            </div>
          </div>

          {/* Right: Metrics Dashboard Preview */}
          <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2C3E50] p-10 flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Dashboard card */}
              <div className="bg-white rounded-xl shadow-2xl p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#566573] uppercase tracking-wide">
                    Campaign Performance
                  </h3>
                  <TrendUp size={20} weight="bold" className="text-green-600" />
                </div>

                {/* Metric */}
                <p className="text-4xl font-bold text-[#2C3E50] mb-1">$847,392</p>
                <p className="text-sm text-green-600 font-medium mb-6">
                  ↑ 23% vs last month
                </p>

                {/* Progress bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#566573]">Major Gifts</span>
                      <span className="font-semibold text-[#2C3E50]">$423K</span>
                    </div>
                    <div className="h-2 bg-[#EBF5FB] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#764ba2] to-[#FF6B35] rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#566573]">Annual Fund</span>
                      <span className="font-semibold text-[#2C3E50]">$298K</span>
                    </div>
                    <div className="h-2 bg-[#EBF5FB] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#3498DB] to-[#27AE60] rounded-full" style={{ width: '55%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#566573]">Events</span>
                      <span className="font-semibold text-[#2C3E50]">$126K</span>
                    </div>
                    <div className="h-2 bg-[#EBF5FB] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#E67E22] to-[#E74C3C] rounded-full" style={{ width: '40%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                  <p className="text-white/70 text-xs mb-1">Donor Retention</p>
                  <p className="text-2xl font-bold text-white">82%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                  <p className="text-white/70 text-xs mb-1">Avg Gift Size</p>
                  <p className="text-2xl font-bold text-white">$4.2K</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
