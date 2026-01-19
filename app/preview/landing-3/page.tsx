/**
 * LANDING VARIATION 3: "Warm Impact"
 * Mission-focused design with warm sunset gradients
 * Preview at: /preview/landing-3
 */

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Heart, Users, HandHeart, ChartLineUp, EnvelopeSimple, Star, Play } from '@phosphor-icons/react/dist/ssr'

export const metadata = {
  title: 'SAGA CRM - Warm Impact | Preview',
  description: 'Mission-focused design with warm sunset gradients',
}

export default function LandingWarm() {
  return (
    <div className="min-h-screen bg-[#fefaf6]">
      {/* Version Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white/90 backdrop-blur-md p-2 rounded-xl border border-orange-100 shadow-lg">
        <Link href="/preview/landing-1" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
          Midnight
        </Link>
        <Link href="/preview/landing-2" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
          Clean
        </Link>
        <Link href="/preview/landing-3" className="px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-lg text-sm font-bold">
          Warm
        </Link>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#fefaf6]/80 backdrop-blur-xl border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-rose-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Heart size={22} weight="fill" className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">SAGA</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#story" className="text-gray-600 hover:text-orange-600 transition font-medium">Our Story</a>
            <a href="#features" className="text-gray-600 hover:text-orange-600 transition font-medium">Features</a>
            <a href="#impact" className="text-gray-600 hover:text-orange-600 transition font-medium">Impact</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-700 hover:text-gray-900 transition font-medium">
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold rounded-lg shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Split Screen */}
      <section className="relative min-h-[90vh] grid lg:grid-cols-2">
        {/* Left - Brand/Story Side */}
        <div className="relative flex items-center justify-center p-12 overflow-hidden" style={{
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa07a 30%, #ff8c69 60%, #764ba2 100%)',
        }}>
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

          <div className="relative text-center text-white max-w-lg">
            <div className="mb-8">
              <Heart size={64} weight="fill" className="mx-auto text-white/90" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Every Donor Has a Story
            </h2>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              SAGA helps you tell it. Build deeper connections, inspire greater giving,
              and amplify your mission&apos;s impact.
            </p>

            {/* Stats on gradient side */}
            <div className="grid grid-cols-3 gap-4 mt-12">
              {[
                { value: '500+', label: 'Nonprofits' },
                { value: '$50M', label: 'Raised' },
                { value: '98%', label: 'Love Us' },
              ].map((stat) => (
                <div key={stat.label} className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Form/CTA Side */}
        <div className="flex items-center justify-center p-12 bg-[#fefaf6]">
          <div className="max-w-md w-full">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Transform your
              <span className="block bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                donor relationships
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              The CRM designed to help nonprofits build lasting connections
              and maximize their impact on the world.
            </p>

            {/* CTA Form */}
            <div className="space-y-4 mb-8">
              <Link
                href="/register"
                className="group w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                Start Your Free Trial
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <button className="w-full px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-orange-200 hover:bg-orange-50 transition-all flex items-center justify-center gap-3">
                <Play size={20} weight="fill" className="text-orange-500" />
                Watch 2-Minute Demo
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              No credit card required. Set up in under 5 minutes.
            </p>

            {/* Trust indicators */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-xs text-gray-400 text-center mb-4">TRUSTED BY ORGANIZATIONS LIKE</p>
              <div className="flex justify-center gap-8 opacity-50">
                {['Nonprofit A', 'Foundation B', 'Charity C'].map((name) => (
                  <span key={name} className="text-sm font-medium text-gray-400">{name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section id="story" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-3xl lg:text-4xl font-light text-gray-900 leading-relaxed">
            &ldquo;We believe every act of giving deserves to be{' '}
            <span className="font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              celebrated, remembered, and nurtured
            </span>{' '}
            into something greater.&rdquo;
          </p>
          <p className="text-gray-500 mt-6">- The SAGA Team</p>
        </div>
      </section>

      {/* Features with Warm Accents */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-[#fff5f0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">How We Help</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
              Tools that amplify your mission
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to build stronger donor relationships and grow your impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: 'Donor Profiles',
                description: 'Complete view of every supporter with giving history and engagement tracking.',
                accent: 'orange',
              },
              {
                icon: HandHeart,
                title: 'Gift Management',
                description: 'Track donations, generate receipts, and manage recurring gifts seamlessly.',
                accent: 'rose',
              },
              {
                icon: EnvelopeSimple,
                title: 'Smart Outreach',
                description: 'Personalized communications that resonate and inspire action.',
                accent: 'purple',
              },
              {
                icon: ChartLineUp,
                title: 'Impact Reports',
                description: 'Beautiful dashboards that tell your story with data.',
                accent: 'amber',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group bg-white p-8 rounded-2xl border-2 border-transparent hover:border-orange-200 shadow-lg shadow-orange-100/50 hover:shadow-orange-200/50 transition-all"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${feature.accent}-400 to-${feature.accent}-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} weight="fill" className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stories */}
      <section id="impact" className="py-24 bg-[#fefaf6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Real Stories</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3">
              Nonprofits making a difference
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "SAGA helped us reconnect with lapsed donors. We recovered $50,000 in the first quarter alone.",
                author: "Maria Santos",
                role: "Development Director",
                org: "Children's Hope Alliance",
                stat: '+40%',
                statLabel: 'Donor Retention',
              },
              {
                quote: "The personalization features are incredible. Our donors feel truly seen and appreciated.",
                author: "James Wright",
                role: "Executive Director",
                org: "Ocean Conservation Fund",
                stat: '2x',
                statLabel: 'Repeat Giving',
              },
              {
                quote: "We finally have time to focus on our mission instead of wrestling with spreadsheets.",
                author: "Priya Sharma",
                role: "Founder",
                org: "Education For All",
                stat: '15hrs',
                statLabel: 'Saved Weekly',
              },
            ].map((story, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-lg shadow-orange-100/50 border border-orange-100"
              >
                {/* Impact stat */}
                <div className="mb-6 p-4 bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl inline-block">
                  <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                    {story.stat}
                  </p>
                  <p className="text-xs text-gray-600">{story.statLabel}</p>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} weight="fill" className="text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">&ldquo;{story.quote}&rdquo;</p>
                <div className="pt-4 border-t border-gray-100">
                  <p className="font-semibold text-gray-900">{story.author}</p>
                  <p className="text-gray-500 text-sm">{story.role}</p>
                  <p className="text-orange-600 text-sm">{story.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div
            className="rounded-3xl p-12 text-white overflow-hidden relative"
            style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa07a 50%, #764ba2 100%)',
            }}
          >
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

            <div className="relative">
              <Heart size={48} weight="fill" className="mx-auto mb-6 text-white/90" />
              <h2 className="text-4xl font-bold mb-4">
                Ready to transform your fundraising?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join hundreds of nonprofits building stronger donor relationships with SAGA.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-orange-600 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Start Free Trial
                  <ArrowRight size={24} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-10 py-5 border-2 border-white/30 text-white font-semibold text-lg rounded-xl hover:bg-white/10 transition-all"
                >
                  Schedule a Call
                </Link>
              </div>
              <p className="text-white/70 text-sm mt-4">No credit card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#1a1a2e] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl flex items-center justify-center">
                <Heart size={20} weight="fill" className="text-white" />
              </div>
              <span className="text-white/70 text-sm">SAGA - Every donor has a story.</span>
            </div>
            <div className="flex gap-8 text-sm text-white/50">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
