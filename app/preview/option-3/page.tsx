/**
 * OPTION 3: Enterprise Data-Driven Landing Page
 * Corporate professional design with metrics focus
 * Access at: /preview/option-3
 */

import LandingNav from '@/components/landing/shared/LandingNav'
import HeroSplitScreen from '@/components/landing/option-3/HeroSplitScreen'
import FeaturesTabs from '@/components/landing/option-3/FeaturesTabs'
import TestimonialsData from '@/components/landing/option-3/TestimonialsData'
import CTAProfessional from '@/components/landing/option-3/CTAProfessional'

export const metadata = {
  title: 'SAGA CRM - Enterprise Donor Management for Nonprofits',
  description: 'Data-driven fundraising at scale. Centralize donor data, automate workflows, and make informed decisions with real-time analytics. Enterprise security built-in.',
}

export default function Option3Page() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav variant="light" />

      <HeroSplitScreen />

      <div id="features">
        <FeaturesTabs />
      </div>

      <div id="testimonials">
        <TestimonialsData />
      </div>

      <div id="cta">
        <CTAProfessional />
      </div>

      {/* Footer - Corporate style */}
      <footer className="bg-[#1E3A5F] text-white/70 py-16">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
            {/* Company */}
            <div className="md:col-span-2">
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                SAGA CRM
              </h4>
              <p className="text-sm leading-relaxed mb-6">
                Enterprise donor management software built specifically for nonprofit organizations. Trusted by 500+ development teams worldwide.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs">SOC 2 Type II</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs">GDPR Compliant</span>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
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
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Documentation
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
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Webinars
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    System Status
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Partners
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Sales
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © 2026 SAGA CRM. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
