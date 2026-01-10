/**
 * OPTION 2: Emotional Impact Landing Page
 * Bold, mission-driven design with gradient backgrounds
 * Access at: /preview/option-2
 */

import LandingNav from '@/components/landing/shared/LandingNav'
import HeroEmotional from '@/components/landing/option-2/HeroEmotional'
import FeaturesAlternating from '@/components/landing/option-2/FeaturesAlternating'
import TestimonialsVideo from '@/components/landing/option-2/TestimonialsVideo'
import CTABold from '@/components/landing/option-2/CTABold'

export const metadata = {
  title: 'SAGA CRM - Transform Your Nonprofit Fundraising',
  description: 'Every donor. Every gift. Every impact. Stop losing donors to spreadsheets and start building relationships that last with SAGA CRM.',
}

export default function Option2Page() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav variant="dark" />

      <HeroEmotional />

      <div id="features">
        <FeaturesAlternating />
      </div>

      <div id="testimonials">
        <TestimonialsVideo />
      </div>

      <div id="cta">
        <CTABold />
      </div>

      {/* Footer - Gradient version */}
      <footer
        className="text-white/70 py-16"
        style={{
          background: 'linear-gradient(to bottom, #1D3557, #0F1419)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Company */}
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Our Mission
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
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">
                Product
              </h4>
              <ul className="space-y-3 text-sm">
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
                    Security
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-3 text-sm">
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
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Case Studies
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-3 text-sm">
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
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm">
              © 2026 SAGA CRM. Built with ❤️ for nonprofits making a difference.
            </p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors text-sm">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition-colors text-sm">
                LinkedIn
              </a>
              <a href="#" className="hover:text-white transition-colors text-sm">
                Instagram
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
