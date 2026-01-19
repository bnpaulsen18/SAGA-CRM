/**
 * LANDING VARIATION 2: "Clean Trust"
 * Light, airy, professional design
 * Preview at: /preview/landing-2
 */

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Users, CurrencyDollar, ChartLineUp, Check, ShieldCheck, Lightning, Star } from '@phosphor-icons/react/dist/ssr'

export const metadata = {
  title: 'SAGA CRM - Clean Trust | Preview',
  description: 'Light, professional design emphasizing trust and reliability',
}

export default function LandingClean() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Version Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white/90 backdrop-blur-md p-2 rounded-xl border border-gray-200 shadow-lg">
        <Link href="/preview/landing-1" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
          Midnight
        </Link>
        <Link href="/preview/landing-2" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">
          Clean
        </Link>
        <Link href="/preview/landing-3" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
          Warm
        </Link>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl text-gray-900">SAGA CRM</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition font-medium">Features</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition font-medium">Testimonials</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition font-medium">Pricing</a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition font-medium">About</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-700 hover:text-gray-900 transition font-medium">
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-100/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
                  <ShieldCheck size={18} weight="fill" className="text-green-600" />
                  <span className="text-sm font-medium text-green-800">SOC 2 Certified</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
                  <Lightning size={18} weight="fill" className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">24/7 Support</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] mb-6">
                The CRM built for
                <span className="block mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  nonprofit success
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Manage donors, track donations, and grow your impact with the trusted platform
                used by 500+ organizations worldwide.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/register"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  Start Free 14-Day Trial
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/demo"
                  className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center"
                >
                  Schedule Demo
                </Link>
              </div>

              {/* Checklist */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600">
                {['No credit card required', 'Cancel anytime', 'Free data migration'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check size={18} weight="bold" className="text-green-500" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Trusted by leading nonprofits</h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: '500+', label: 'Organizations' },
                    { value: '$2M+', label: 'Raised Monthly' },
                    { value: '98%', label: 'Satisfaction Rate' },
                    { value: '35%', label: 'Avg. Retention Lift' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-xl">
                      <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
                      <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Testimonial preview */}
                <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} weight="fill" className="text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm italic">
                    &ldquo;SAGA helped us increase donor retention by 40%. It&apos;s the best decision we made.&rdquo;
                  </p>
                  <p className="text-gray-500 text-xs mt-2">- Sarah Chen, Hope Foundation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
              Everything you need in one place
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for nonprofits, SAGA combines powerful features with intuitive design.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Donor Management',
                description: 'Complete 360-degree profiles with giving history, communication logs, and engagement tracking.',
                color: 'blue',
              },
              {
                icon: CurrencyDollar,
                title: 'Donation Processing',
                description: 'Accept donations online, generate tax receipts automatically, and manage recurring gifts.',
                color: 'green',
              },
              {
                icon: ChartLineUp,
                title: 'Analytics & Reports',
                description: 'Real-time dashboards, campaign performance tracking, and customizable reports.',
                color: 'purple',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 border border-transparent hover:border-gray-100 transition-all group"
              >
                <div className={`w-14 h-14 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} weight="duotone" className={`text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <a href="#" className="inline-flex items-center gap-1 text-blue-600 font-medium mt-4 hover:gap-2 transition-all">
                  Learn more <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3">
              Trusted by mission-driven organizations
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "SAGA transformed how we manage donor relationships. The automation alone saves us 20+ hours per week.",
                author: "Marcus Johnson",
                role: "Development Director",
                org: "Youth Empowerment Alliance",
              },
              {
                quote: "Finally, a CRM that understands nonprofit needs. The reporting is incredible and our board loves the dashboards.",
                author: "Emily Rodriguez",
                role: "Executive Director",
                org: "Community First Foundation",
              },
              {
                quote: "We increased our donor retention by 40% in the first year. SAGA paid for itself in the first month.",
                author: "Sarah Chen",
                role: "Fundraising Manager",
                org: "Hope International",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={18} weight="fill" className="text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  <p className="text-blue-600 text-sm">{testimonial.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-white shadow-2xl shadow-blue-500/30">
            <h2 className="text-4xl font-bold mb-4">
              Ready to grow your impact?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join 500+ nonprofits using SAGA to build stronger donor relationships and raise more funds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-blue-600 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Start Free Trial
                <ArrowRight size={24} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-10 py-5 border-2 border-white/30 text-white font-semibold text-lg rounded-xl hover:bg-white/10 transition-all"
              >
                Talk to Sales
              </Link>
            </div>
            <p className="text-blue-200 text-sm mt-4">No credit card required. Start in under 2 minutes.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-gray-500 text-sm">SAGA CRM - Built for nonprofits making a difference.</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900 transition">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition">Terms</a>
              <a href="#" className="hover:text-gray-900 transition">Security</a>
              <a href="#" className="hover:text-gray-900 transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
