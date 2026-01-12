/**
 * OPTION 2: Emotional Impact Hero Section
 * Full-bleed gradient with large bold typography
 */

import { ArrowRight, Sparkle } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

export default function HeroEmotional() {
  return (
    <section
      className="relative py-32 md:py-48 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #4A1942 0%, #E63946 50%, #FF6B35 100%)',
      }}
    >
      {/* Decorative gradient overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at top right, rgba(255, 107, 53, 0.3), transparent)',
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-10">
        <div className="max-w-5xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2.5 mb-8">
            <Sparkle size={20} weight="fill" className="text-[#F4A261]" />
            <span className="text-sm font-semibold text-white">
              Transforming nonprofit fundraising
            </span>
          </div>

          {/* Headline - Extra large and bold */}
          <h1
            className="text-5xl md:text-[5rem] font-extrabold text-white leading-[1.1] mb-8"
            style={{ letterSpacing: '-0.03em' }}
          >
            Every donor.{' '}
            <span className="block mt-2">
              Every gift.{' '}
              <span className="text-[#F4A261]">Every impact.</span>
            </span>
          </h1>

          {/* Subheadline - Larger, more emotional */}
          <p className="text-2xl md:text-3xl text-white/90 leading-relaxed mb-12 max-w-3xl font-light">
            Stop losing donors to spreadsheets. Start building relationships that last—with the CRM built for your mission.
          </p>

          {/* CTA Buttons - Larger, more prominent */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href="/register"
              className="px-10 py-5 bg-white text-[#4A1942] text-lg font-bold rounded-xl shadow-2xl hover:shadow-[0_0_40px_rgba(255,107,53,0.3)] transition-all duration-350 flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-white/30"
            >
              Start Your Free Trial
              <ArrowRight size={24} weight="bold" />
            </Link>

            <button
              type="button"
              className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-lg font-bold rounded-xl hover:bg-white/20 transition-all duration-350 focus:outline-none focus:ring-4 focus:ring-white/30"
            >
              Watch Demo
            </button>
          </div>

          {/* Social proof - Animated metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl">
            <div className="text-center py-2">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">500+</p>
              <p className="text-sm text-white/80">Nonprofits</p>
            </div>
            <div className="text-center py-2 border-l border-white/20 sm:border-r">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">$2M+</p>
              <p className="text-sm text-white/80">Raised Monthly</p>
            </div>
            <div className="text-center py-2 col-span-2 sm:col-span-1">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">98%</p>
              <p className="text-sm text-white/80">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          role="presentation"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
