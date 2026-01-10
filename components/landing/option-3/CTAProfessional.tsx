/**
 * OPTION 3: Enterprise Data-Driven CTA Section
 * Professional, corporate CTA with form capture
 */

import { ArrowRight, CalendarBlank } from '@phosphor-icons/react/dist/ssr'

export default function CTAProfessional() {
  return (
    <section className="bg-white py-20 md:py-32 border-t border-[#D5DBDB]">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <h2
              className="text-4xl md:text-5xl font-bold text-[#2C3E50] leading-tight mb-6"
              style={{ letterSpacing: '-0.01em' }}
            >
              Ready to scale your fundraising operations?
            </h2>

            <p className="text-lg text-[#566573] leading-relaxed mb-8">
              Schedule a personalized demo with our solutions team. We'll show you how SAGA can integrate with your existing tech stack and help you achieve your fundraising goals.
            </p>

            {/* Value props */}
            <div className="space-y-4 mb-10">
              {[
                'Personalized platform walkthrough',
                'Custom implementation plan',
                'Migration support from existing CRM',
                'ROI analysis and pricing discussion'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-base text-[#2C3E50]">{item}</span>
                </div>
              ))}
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 pt-6 border-t border-[#D5DBDB]">
              <div>
                <p className="text-2xl font-bold text-[#2C3E50]">4.9/5</p>
                <p className="text-sm text-[#95A5A6]">G2 Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2C3E50]">500+</p>
                <p className="text-sm text-[#95A5A6]">Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2C3E50]">24/7</p>
                <p className="text-sm text-[#95A5A6]">Support</p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-[#F4F6F8] border border-[#D5DBDB] rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-[#2C3E50] mb-6">
              Request a Demo
            </h3>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#566573] mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white border border-[#ABB2B9] rounded-lg focus:outline-none focus:border-[#764ba2] focus:ring-2 focus:ring-[#764ba2]/20 text-[#2C3E50]"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#566573] mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white border border-[#ABB2B9] rounded-lg focus:outline-none focus:border-[#764ba2] focus:ring-2 focus:ring-[#764ba2]/20 text-[#2C3E50]"
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#566573] mb-2">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-white border border-[#ABB2B9] rounded-lg focus:outline-none focus:border-[#764ba2] focus:ring-2 focus:ring-[#764ba2]/20 text-[#2C3E50]"
                  placeholder="john@nonprofit.org"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#566573] mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-white border border-[#ABB2B9] rounded-lg focus:outline-none focus:border-[#764ba2] focus:ring-2 focus:ring-[#764ba2]/20 text-[#2C3E50]"
                  placeholder="Your Nonprofit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#566573] mb-2">
                  Annual Fundraising Goal
                </label>
                <select className="w-full px-4 py-3 bg-white border border-[#ABB2B9] rounded-lg focus:outline-none focus:border-[#764ba2] focus:ring-2 focus:ring-[#764ba2]/20 text-[#2C3E50]">
                  <option>Under $100K</option>
                  <option>$100K - $500K</option>
                  <option>$500K - $1M</option>
                  <option>$1M - $5M</option>
                  <option>$5M+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#566573] mb-2">
                  Number of Donors
                </label>
                <select className="w-full px-4 py-3 bg-white border border-[#ABB2B9] rounded-lg focus:outline-none focus:border-[#764ba2] focus:ring-2 focus:ring-[#764ba2]/20 text-[#2C3E50]">
                  <option>Under 1,000</option>
                  <option>1,000 - 5,000</option>
                  <option>5,000 - 10,000</option>
                  <option>10,000 - 50,000</option>
                  <option>50,000+</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-[#764ba2] to-[#FF6B35] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-250 flex items-center justify-center gap-2"
              >
                <CalendarBlank size={20} weight="bold" />
                Schedule Demo
                <ArrowRight size={20} weight="bold" />
              </button>

              <p className="text-xs text-[#95A5A6] text-center">
                By submitting this form, you agree to our{' '}
                <a href="#" className="text-[#764ba2] hover:underline">
                  Privacy Policy
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
