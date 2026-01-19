/**
 * LANDING VARIATION 1: "Midnight Professional"
 * Dark, sophisticated, glassmorphic design
 * Preview at: /preview/landing-1
 */

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Users, CurrencyDollar, ChartLineUp, Lightning, Shield, Star } from '@phosphor-icons/react/dist/ssr'

export const metadata = {
  title: 'SAGA CRM - Midnight Professional | Preview',
  description: 'Dark, sophisticated glassmorphic design for modern nonprofits',
}

export default function LandingMidnight() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Version Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10">
        <Link href="/preview/landing-1" className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-bold">
          Midnight
        </Link>
        <Link href="/preview/landing-2" className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition">
          Clean
        </Link>
        <Link href="/preview/landing-3" className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition">
          Warm
        </Link>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/SAGA_Logo_clean.png"
              alt="SAGA CRM"
              width={120}
              height={48}
              className="h-12 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/70 hover:text-white transition">Features</a>
            <a href="#testimonials" className="text-white/70 hover:text-white transition">Testimonials</a>
            <a href="#pricing" className="text-white/70 hover:text-white transition">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-white/80 hover:text-white transition font-medium">
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[128px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-white/80">Trusted by 500+ nonprofits worldwide</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
              Donor relationships that
              <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                drive impact
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-white/60 leading-relaxed mb-10 max-w-2xl">
              SAGA CRM gives nonprofits the tools to build lasting donor relationships,
              automate fundraising workflows, and maximize every contribution.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                href="/register"
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:shadow-[0_0_60px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center"
              >
                Watch Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-xl">
              {[
                { value: '$2M+', label: 'Raised Monthly' },
                { value: '98%', label: 'Retention Rate' },
                { value: '500+', label: 'Happy Nonprofits' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-white/50 mt-1">{stat.label}</p>
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
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Powerful tools designed specifically for nonprofit fundraising and donor management.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: 'Donor Management',
                description: 'Complete 360-degree view of every donor with giving history, engagement scores, and relationship insights.',
                gradient: 'from-purple-500 to-blue-500',
              },
              {
                icon: CurrencyDollar,
                title: 'Donation Tracking',
                description: 'Track every gift, generate tax receipts automatically, and manage recurring donations with ease.',
                gradient: 'from-pink-500 to-purple-500',
              },
              {
                icon: ChartLineUp,
                title: 'Campaign Analytics',
                description: 'Real-time insights into campaign performance, donor behavior, and fundraising trends.',
                gradient: 'from-orange-500 to-pink-500',
              },
              {
                icon: Lightning,
                title: 'Smart Automation',
                description: 'Automate thank-you emails, follow-ups, and workflows to save hours every week.',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Shield,
                title: 'Bank-Level Security',
                description: 'Enterprise-grade encryption, SOC 2 compliance, and data protection you can trust.',
                gradient: 'from-green-500 to-teal-500',
              },
              {
                icon: Star,
                title: 'AI Insights',
                description: 'Predictive analytics that identify at-risk donors and optimal engagement timing.',
                gradient: 'from-yellow-500 to-orange-500',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={24} weight="bold" className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="testimonials" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Loved by nonprofits everywhere
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "SAGA transformed how we manage donor relationships. Our retention rate increased 40% in the first year.",
                author: "Sarah Chen",
                role: "Executive Director, Hope Foundation",
              },
              {
                quote: "The automation features alone save us 15+ hours per week. Now we can focus on what matters - our mission.",
                author: "Marcus Johnson",
                role: "Development Director, Youth Empowerment",
              },
              {
                quote: "Finally, a CRM that understands nonprofit needs. The reporting is incredible and easy to use.",
                author: "Emily Rodriguez",
                role: "Fundraising Manager, Community First",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} weight="fill" className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/80 leading-relaxed mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.author}</p>
                  <p className="text-white/50 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-12 bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-white/10 rounded-3xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to transform your fundraising?
            </h2>
            <p className="text-xl text-white/60 mb-8">
              Join 500+ nonprofits already using SAGA to build stronger donor relationships.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg rounded-xl shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] transition-all"
            >
              Start Your Free Trial
              <ArrowRight size={24} />
            </Link>
            <p className="text-white/40 text-sm mt-4">No credit card required</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center text-white/40 text-sm">
          <p>Built with love for nonprofits making a difference.</p>
        </div>
      </footer>
    </div>
  )
}
