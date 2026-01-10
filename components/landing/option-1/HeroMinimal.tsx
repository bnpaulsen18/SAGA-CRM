/**
 * OPTION 1: Trust-First Minimalist Hero Section
 * Clean, centered layout with inline email capture
 */

import Image from 'next/image'
import { ArrowRight, CheckCircle } from '@phosphor-icons/react/dist/ssr'
import { option1Tokens } from '@/lib/design-system/tokens-option-1'

export default function HeroMinimal() {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="max-w-[1200px] mx-auto px-8">
        {/* Centered content */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 mb-8">
            <CheckCircle size={20} weight="bold" className="text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              Trusted by 500+ nonprofit organizations
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-[3.5rem] font-bold text-[#2C3E50] leading-tight mb-6"
              style={{ letterSpacing: '-0.02em' }}>
            Donor Management Built for{' '}
            <span className="bg-gradient-to-r from-[#764ba2] to-[#FF6B6B] bg-clip-text text-transparent">
              Nonprofit Success
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-2xl text-[#7F8C8D] leading-relaxed mb-10 max-w-3xl mx-auto">
            Track donors, manage campaigns, and maximize your fundraising impact—all in one simple platform.
          </p>

          {/* Email capture inline */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-6">
            <input
              type="email"
              placeholder="Enter your work email"
              className="flex-1 px-4 py-3.5 text-base border border-[#BDC3C7] rounded-lg focus:outline-none focus:border-[#764ba2] focus:ring-2 focus:ring-[#764ba2]/20"
            />
            <button className="px-8 py-3.5 bg-gradient-to-r from-[#764ba2] to-[#FF6B6B] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-250 flex items-center justify-center gap-2 whitespace-nowrap">
              Get Started Free
              <ArrowRight size={20} weight="bold" />
            </button>
          </div>

          {/* Trust subtext */}
          <p className="text-sm text-[#BDC3C7]">
            No credit card required • Free 14-day trial • Cancel anytime
          </p>
        </div>

        {/* Product screenshot with subtle shadow */}
        <div className="relative max-w-5xl mx-auto">
          <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200">
            <Image
              src="/dashboard-preview.png"
              alt="SAGA CRM Dashboard"
              width={1200}
              height={750}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>

        {/* Logo grid - trusted by */}
        <div className="mt-20">
          <p className="text-center text-sm font-medium text-[#7F8C8D] mb-8 uppercase tracking-wide">
            Trusted by leading nonprofits
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60 grayscale">
            {/* Placeholder for partner logos */}
            <div className="h-12 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">Partner Logo</span>
            </div>
            <div className="h-12 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">Partner Logo</span>
            </div>
            <div className="h-12 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">Partner Logo</span>
            </div>
            <div className="h-12 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">Partner Logo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
