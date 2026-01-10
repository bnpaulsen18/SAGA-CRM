/**
 * OPTION 1: Trust-First Minimalist Landing Page
 * Complete landing page with all sections
 * Access at: /preview/option-1
 */

import LandingNav from '@/components/landing/shared/LandingNav'
import HeroMinimal from '@/components/landing/option-1/HeroMinimal'
import FeaturesGrid from '@/components/landing/option-1/FeaturesGrid'
import TestimonialsSection from '@/components/landing/option-1/TestimonialsSection'
import CTASection from '@/components/landing/option-1/CTASection'

export const metadata = {
  title: 'SAGA CRM - Donor Management Built for Nonprofit Success',
  description: 'Track donors, manage campaigns, and maximize your fundraising impact—all in one simple platform. Trusted by 500+ nonprofit organizations.',
}

export default function Option1Page() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav variant="light" />

      <HeroMinimal />

      <div id="features">
        <FeaturesGrid />
      </div>

      <div id="testimonials">
        <TestimonialsSection />
      </div>

      <div id="cta">
        <CTASection />
      </div>

      {/* Footer */}
      <footer className="bg-[#0F1419] text-white/70 py-12 border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                Company
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                Product
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                Resources
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © 2026 SAGA CRM. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors text-sm">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition-colors text-sm">
                LinkedIn
              </a>
              <a href="#" className="hover:text-white transition-colors text-sm">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
