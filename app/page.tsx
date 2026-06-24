/**
 * SAGA CRM - Main Landing Page
 * Warm SAGA identity (reskin) with full SEO optimization
 */

import Link from 'next/link'
import { ArrowRight, Users, CurrencyDollar, ChartLineUp, Lightning, Shield, Star } from '@phosphor-icons/react/dist/ssr'
import SmoothScroll from '@/components/landing/shared/SmoothScroll'
import SiteNav from '@/components/marketing/SiteNav'
import SiteFooter from '@/components/marketing/SiteFooter'

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
    'msapplication-TileColor': '#FAF6EF',
    'theme-color': '#FAF6EF',
  },
}

const SUNSET = 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)'

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
        offers: [
          {
            '@type': 'Offer',
            name: 'SAGA',
            price: '100',
            priceCurrency: 'USD',
            description: 'Full access to SAGA for one organization, billed monthly. A 2% platform fee applies to donations processed through SAGA.',
          },
        ],
      },
    ],
  }

  const features = [
    {
      icon: Users,
      title: 'Donor Management',
      description: 'Complete 360-degree view of every donor with giving history, engagement scores, and relationship insights.',
    },
    {
      icon: CurrencyDollar,
      title: 'Donation Tracking',
      description: 'Track every gift, generate tax receipts automatically, and manage recurring donations with ease.',
    },
    {
      icon: ChartLineUp,
      title: 'Campaign Analytics',
      description: 'Real-time insights into campaign performance, donor behavior, and fundraising trends.',
    },
    {
      icon: Lightning,
      title: 'Smart Automation',
      description: 'Automate thank-you emails, follow-ups, and workflows to save hours every week.',
    },
    {
      icon: Shield,
      title: 'Secure by design',
      description: 'Encryption in transit and at rest, PCI-compliant payments through Stripe, and data that is always yours.',
    },
    {
      icon: Star,
      title: 'AI Insights',
      description: 'Predictive analytics that identify at-risk donors and optimal engagement timing.',
    },
  ]

  const differentiators = [
    {
      icon: Star,
      title: 'AI that does the busywork',
      description: 'SAGA drafts the thank-you, flags the donor about to lapse, and surfaces who to reach next — so your team spends time on people, not data entry.',
    },
    {
      icon: Users,
      title: 'Built for nonprofits',
      description: 'Not a sales CRM with the labels swapped. Every screen is designed around donors, gifts, and the real work of fundraising.',
    },
    {
      icon: Shield,
      title: 'Your data, protected and portable',
      description: 'Encryption in transit and at rest, payments through Stripe, and one-click export. If you ever leave, you take everything with you.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#2A2433]">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Smooth Scroll for Hash Links */}
      <SmoothScroll />

      {/* Navigation */}
      <SiteNav />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Subtle warm sunset glow */}
        <div className="absolute -top-32 right-0 w-[640px] h-[640px] rounded-full blur-[128px] opacity-[0.10]" style={{ background: SUNSET }} />

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-[#E8E1D7] rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-[#4A8C6F] rounded-full" />
              <span className="text-sm text-[#6B6475]">The AI-native donor CRM for nonprofits</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-[#2A2433] leading-[1.1] mb-6">
              Donor relationships that
              <span
                className="block mt-2"
                style={{ background: SUNSET, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
              >
                drive impact
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-[#6B6475] leading-relaxed mb-10 max-w-2xl">
              SAGA CRM gives nonprofits the tools to build lasting donor relationships,
              automate fundraising workflows, and maximize every contribution.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                href="/register"
                className="group px-8 py-4 text-white font-bold rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2"
                style={{ background: SUNSET }}
              >
                Start Free Trial
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-4 bg-white border border-[#E8E1D7] text-[#2A2433] font-semibold rounded-xl hover:bg-[#F4EFE6] transition-all flex items-center justify-center"
              >
                See Pricing
              </Link>
            </div>

            {/* Value props */}
            <div className="grid grid-cols-3 gap-8 max-w-xl">
              {[
                { value: 'Free', label: 'to get started' },
                { value: 'AI', label: 'built in, not bolted on' },
                { value: 'Secure', label: 'Stripe-powered payments' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-3xl font-bold text-[#2A2433]">
                    {item.value}
                  </p>
                  <p className="text-sm text-[#6B6475] mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2A2433] mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-[#6B6475] max-w-2xl mx-auto">
              Powerful tools designed specifically for nonprofit fundraising and donor management.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-8 bg-white border border-[#E8E1D7] rounded-2xl hover:border-[#D8CEBF] hover:shadow-[0_8px_30px_rgba(42,36,51,0.06)] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F4EFE6] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={24} weight="bold" className="text-[#5B4B8A]" />
                </div>
                <h3 className="text-xl font-bold text-[#2A2433] mb-3">{feature.title}</h3>
                <p className="text-[#6B6475] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators Section */}
      <section id="why-saga" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4EFE6] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2A2433] mb-4">
              A CRM that works the way you do
            </h2>
            <p className="text-xl text-[#6B6475] max-w-2xl mx-auto">
              Designed from the ground up for the realities of nonprofit fundraising.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {differentiators.map((item) => (
              <div
                key={item.title}
                className="p-8 bg-white border border-[#E8E1D7] rounded-2xl"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F4EFE6] flex items-center justify-center mb-6">
                  <item.icon size={24} weight="bold" className="text-[#5B4B8A]" />
                </div>
                <h3 className="text-xl font-bold text-[#2A2433] mb-3">{item.title}</h3>
                <p className="text-[#6B6475] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-12 rounded-3xl" style={{ background: SUNSET }}>
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to transform your fundraising?
            </h2>
            <p className="text-xl text-white/85 mb-8">
              Start building stronger donor relationships today.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-[#5B4B8A] font-bold text-lg rounded-xl hover:bg-white/90 transition-all"
            >
              Start Your Free Trial
              <ArrowRight size={24} />
            </Link>
            <p className="text-white/70 text-sm mt-4">No credit card required</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
