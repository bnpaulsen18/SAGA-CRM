import Link from "next/link";
import { Check, X } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - SAGA CRM",
  description: "Simple, transparent pricing for nonprofits. Free tier for small organizations, Pro and Enterprise plans with unlimited features and 2% donation processing fee.",
  openGraph: {
    title: "Pricing - SAGA CRM",
    description: "Simple, transparent pricing for nonprofits of all sizes",
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-orange-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 bg-[#0a0a1a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 text-transparent bg-clip-text">
              SAGA
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-white/70 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/login" className="text-white/70 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 text-transparent bg-clip-text">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Choose the plan that fits your nonprofit. All plans include our core features with no hidden fees.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Check className="text-green-400" size={20} weight="bold" />
            <span className="text-white/80 text-sm">
              <strong>30% nonprofit discount</strong> available for verified 501(c)(3) organizations
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Free Tier */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">$0</span>
                <span className="text-white/60">/month</span>
              </div>
              <p className="text-white/60 mt-2">Perfect for getting started</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white/80">Up to 500 contacts</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white/80">Manual donation tracking</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white/80">Basic reporting</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white/80">1 campaign</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="text-red-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white/60">Online donation processing</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="text-red-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white/60">Email campaigns</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="text-red-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white/60">API access</span>
              </div>
            </div>

            <Link
              href="/register"
              className="block w-full py-3 px-4 rounded-lg border border-white/20 text-white text-center font-medium hover:bg-white/5 transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier - FEATURED */}
          <div className="rounded-2xl bg-gradient-to-b from-purple-600/20 to-pink-600/20 backdrop-blur-xl border-2 border-purple-400/50 p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium">
              Most Popular
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">$99</span>
                <span className="text-white/60">/month</span>
              </div>
              <p className="text-white/60 mt-2">
                + 2% of donations processed
              </p>
              <p className="text-sm text-green-400 mt-1">
                $69.30/mo for verified nonprofits
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white"><strong>Unlimited contacts</strong></span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white"><strong>Online donation processing</strong> (Stripe)</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white"><strong>Unlimited campaigns</strong></span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white">Email campaigns with AI</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white">Advanced reporting</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white">Fraud detection</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white">API access</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white">Priority support</span>
              </div>
            </div>

            <Link
              href="/register?plan=pro"
              className="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center font-medium hover:opacity-90 transition-opacity"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Enterprise Tier */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">$199</span>
                <span className="text-white/60">/month</span>
              </div>
              <p className="text-white/60 mt-2">
                + 2% of donations processed
              </p>
              <p className="text-sm text-green-400 mt-1">
                $139.30/mo for verified nonprofits
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white"><strong>Everything in Pro</strong></span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white">QuickBooks integration</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white">Zapier integration</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white">Custom reporting</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white">White-label donation pages</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white">Dedicated account manager</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white">99.9% uptime SLA</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-green-400 mt-1 flex-shrink-0" size={20} weight="bold" />
                <span className="text-white">Custom integrations</span>
              </div>
            </div>

            <Link
              href="/register?plan=enterprise"
              className="block w-full py-3 px-4 rounded-lg border border-white/20 text-white text-center font-medium hover:bg-white/5 transition-colors"
            >
              Start 14-Day Free Trial
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">How does the 2% donation fee work?</h3>
              <p className="text-white/70">
                We use Stripe Connect to process donations. When a donor gives $100, $98 goes directly to your nonprofit's Stripe account, and we collect $2 as our platform fee. You receive funds immediately - we don't hold your money.
              </p>
            </div>

            <div className="rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">What about Stripe's fees?</h3>
              <p className="text-white/70">
                Stripe charges 2.9% + $0.30 per transaction for credit card processing. This is separate from our 2% platform fee. Total cost: ~5% per transaction. Stripe's nonprofit rate (2.2% + $0.30) applies if you qualify.
              </p>
            </div>

            <div className="rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">How do I qualify for the nonprofit discount?</h3>
              <p className="text-white/70">
                Provide proof of 501(c)(3) status during signup (IRS determination letter or EIN lookup). Once verified, you'll automatically receive 30% off your monthly subscription fee.
              </p>
            </div>

            <div className="rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Can I switch plans later?</h3>
              <p className="text-white/70">
                Yes! Upgrade or downgrade anytime. When you upgrade, you're charged the prorated difference. When you downgrade, you'll receive credit for the next billing cycle.
              </p>
            </div>

            <div className="rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Is there a free trial?</h3>
              <p className="text-white/70">
                Yes! Pro and Enterprise plans include a 14-day free trial with full access to all features. No credit card required to start. The Free plan is available forever with no trial period.
              </p>
            </div>

            <div className="rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">What happens if I exceed 500 contacts on the Free plan?</h3>
              <p className="text-white/70">
                You'll be prompted to upgrade to Pro. Your existing data remains safe and accessible, but you won't be able to add new contacts until you upgrade or remove some contacts.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-400/30 p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to transform your donor relationships?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join 500+ nonprofits using SAGA to build stronger connections and raise more for their mission.
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-lg hover:opacity-90 transition-opacity"
            >
              Start Free Trial - No Credit Card Required
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white/60 text-sm">
            <p>© 2024 SAGA CRM. Built with ❤️ for nonprofits.</p>
            <div className="mt-4 flex justify-center gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="mailto:support@sagacrm.io" className="hover:text-white transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
