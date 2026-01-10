/**
 * OPTION 2: Emotional Impact CTA Section
 * Bold, gradient background with large CTA
 */

import { ArrowRight, CheckCircle } from '@phosphor-icons/react/dist/ssr'

export default function CTABold() {
  return (
    <section
      className="py-32 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #4A1942 0%, #E63946 50%, #FF6B35 100%)',
      }}
    >
      {/* Decorative elements */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-10 text-center">
        {/* Headline */}
        <h2
          className="text-5xl md:text-7xl font-extrabold text-white leading-none mb-8"
          style={{ letterSpacing: '-0.03em' }}
        >
          Ready to transform{' '}
          <span className="block mt-2">your fundraising?</span>
        </h2>

        {/* Subheadline */}
        <p className="text-2xl text-white/90 leading-relaxed mb-12 max-w-3xl mx-auto font-light">
          Join 500+ nonprofits already raising more, retaining donors longer, and making a bigger impact with SAGA CRM.
        </p>

        {/* CTA Button - Extra large */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-12">
          <button className="px-12 py-6 bg-white text-[#4A1942] text-xl font-bold rounded-2xl shadow-2xl hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-350 flex items-center gap-3">
            Start Your Free Trial
            <ArrowRight size={28} weight="bold" />
          </button>
        </div>

        {/* Benefits */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-16">
          {[
            'Free 14-day trial',
            'No credit card required',
            'Full feature access',
            'Cancel anytime',
            'White-glove migration included'
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle size={20} weight="bold" className="text-white" />
              <span className="text-white font-medium">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <p className="text-5xl font-bold text-white mb-2">4.9★</p>
            <p className="text-white/80 text-sm">Average rating</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <p className="text-5xl font-bold text-white mb-2">500+</p>
            <p className="text-white/80 text-sm">Nonprofits trust us</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <p className="text-5xl font-bold text-white mb-2">98%</p>
            <p className="text-white/80 text-sm">Customer satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  )
}
