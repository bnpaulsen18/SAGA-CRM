/**
 * OPTION 1: Trust-First Minimalist CTA Section
 * Simple, centered call-to-action with email capture
 */

import { ArrowRight, CheckCircle } from '@phosphor-icons/react/dist/ssr'

const benefits = [
  'No credit card required',
  'Free 14-day trial',
  'Cancel anytime',
  '5-minute setup'
]

export default function CTASection() {
  return (
    <section className="bg-white py-20 md:py-32 border-t border-gray-200">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-4xl md:text-[2.5rem] font-bold text-[#2C3E50] leading-tight mb-6"
              style={{ letterSpacing: '-0.01em' }}>
            Start raising more. Today.
          </h2>

          {/* Subheadline */}
          <p className="text-lg text-[#7F8C8D] leading-relaxed mb-10">
            Join 500+ nonprofit organizations using SAGA to streamline their fundraising and build lasting donor relationships.
          </p>

          {/* Email capture */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8">
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

          {/* Benefits list */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle size={16} weight="bold" className="text-green-600" />
                <span className="text-sm text-[#7F8C8D]">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
