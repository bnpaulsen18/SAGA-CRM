/**
 * SAGA CRM - Main Landing Page
 * Emotional Impact design with full SEO optimization
 */

import LandingNav from '@/components/landing/shared/LandingNav'
import HeroEmotional from '@/components/landing/option-2/HeroEmotional'
import FeaturesAlternating from '@/components/landing/option-2/FeaturesAlternating'
import TestimonialsVideo from '@/components/landing/option-2/TestimonialsVideo'
import CTABold from '@/components/landing/option-2/CTABold'
import EmailCaptureForm from '@/components/landing/shared/EmailCaptureForm'
import SmoothScroll from '@/components/landing/shared/SmoothScroll'

export const metadata = {
  title: 'SAGA CRM - Transform Your Nonprofit Fundraising',
  description: 'Every donor. Every gift. Every impact. Stop losing donors to spreadsheets and start building relationships that last with SAGA CRM.',
  keywords: [
    'nonprofit CRM',
    'donor management',
    'fundraising software',
    'nonprofit software',
    'donor retention',
    'donation tracking',
    'nonprofit technology',
    'CRM for nonprofits',
    'donor database',
    'fundraising CRM',
  ],
  authors: [{ name: 'SAGA CRM' }],
  creator: 'SAGA CRM',
  publisher: 'SAGA CRM',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sagacrm.io',
    siteName: 'SAGA CRM',
    title: 'SAGA CRM - Transform Your Nonprofit Fundraising',
    description: 'Every donor. Every gift. Every impact. Stop losing donors to spreadsheets and start building relationships that last with SAGA CRM.',
    images: [
      {
        url: '/SAGA_Logo_final.png',
        width: 1200,
        height: 630,
        alt: 'SAGA CRM - Nonprofit Fundraising Software',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAGA CRM - Transform Your Nonprofit Fundraising',
    description: 'Every donor. Every gift. Every impact. Stop losing donors to spreadsheets and start building relationships that last.',
    images: ['/SAGA_Logo_final.png'],
    creator: '@sagacrm',
  },
  alternates: {
    canonical: 'https://sagacrm.io',
  },
  other: {
    'msapplication-TileColor': '#4A1942',
    'theme-color': '#4A1942',
  },
}

export default function HomePage() {
  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://sagacrm.io/#organization',
        name: 'SAGA CRM',
        url: 'https://sagacrm.io',
        logo: {
          '@type': 'ImageObject',
          url: 'https://sagacrm.io/SAGA_Logo_final.png',
          width: 1200,
          height: 630,
        },
        description: 'Nonprofit CRM and fundraising software built to help organizations raise more, retain donors longer, and make a bigger impact.',
        sameAs: [
          'https://twitter.com/sagacrm',
          'https://www.linkedin.com/company/sagacrm',
          'https://github.com/sagacrm',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://sagacrm.io/#website',
        url: 'https://sagacrm.io',
        name: 'SAGA CRM',
        publisher: {
          '@id': 'https://sagacrm.io/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://sagacrm.io/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'SAGA CRM',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          priceValidUntil: '2026-12-31',
          description: 'Free 14-day trial, no credit card required',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '500',
          bestRating: '5',
          worstRating: '1',
        },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Smooth Scroll for Hash Links */}
      <SmoothScroll />

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
          {/* Newsletter Section */}
          <div className="max-w-2xl mx-auto mb-16 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Stay Updated
            </h3>
            <p className="text-white/80 text-lg mb-8">
              Get nonprofit fundraising tips, product updates, and success stories delivered to your inbox.
            </p>
            <EmailCaptureForm
              variant="gradient"
              size="large"
              source="homepage_footer"
            />
          </div>

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
              © 2026 SAGA CRM. Built with love for nonprofits making a difference.
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
