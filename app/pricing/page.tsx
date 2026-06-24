import Link from 'next/link'
import { Check, ArrowRight } from '@phosphor-icons/react/dist/ssr'
import type { Metadata } from 'next'
import SiteNav from '@/components/marketing/SiteNav'
import SiteFooter from '@/components/marketing/SiteFooter'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple, honest pricing for nonprofits: one plan at $100/month plus a 2% platform fee on donations processed. No tiers, no surprises.',
  alternates: { canonical: 'https://sagacrm.io/pricing' },
}

const SUNSET = 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)'

const included = [
  'Unlimited contacts & donors',
  'Online donation processing (Stripe)',
  'Unlimited campaigns',
  'Email campaigns',
  'Automated tax receipts',
  'Advanced reporting & analytics',
  'Fraud detection',
  'CSV import & export',
  'Your whole team included',
  'Light & dark mode',
]

const faqs = [
  {
    q: 'How does the 2% platform fee work?',
    a: "Donations are processed through Stripe Connect and settle directly to your nonprofit's own Stripe account. We collect a 2% platform fee on each donation — so on a $100 gift, $2 is our fee. You receive your funds directly; we never hold your money.",
  },
  {
    q: "What about Stripe's processing fees?",
    a: "Stripe charges its own payment-processing fee (typically 2.9% + 30¢ per transaction) on top of our 2% platform fee. Stripe's discounted nonprofit rate may apply if your organization qualifies.",
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes — you can create an account and explore SAGA before you subscribe. No credit card required to get started.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. There are no long-term contracts. Cancel whenever you like and you keep access through the end of your current billing period.',
  },
  {
    q: 'Do I own my data?',
    a: 'Always. Your contacts and donations are yours, and you can export everything at any time. If you ever leave SAGA, you take your data with you.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#2A2433]">
      <SiteNav />

      {/* Header */}
      <section className="relative overflow-hidden">
        <div
          className="absolute -top-32 right-0 w-[640px] h-[640px] rounded-full blur-[128px] opacity-[0.10]"
          style={{ background: SUNSET }}
        />
        <div className="relative max-w-3xl mx-auto px-6 pt-24 pb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#5B4B8A] mb-4">Pricing</p>
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6">One simple plan</h1>
          <p className="text-xl text-[#6B6475] leading-relaxed">
            Everything SAGA does, for one flat price. No tiers to decode, no features held hostage &mdash; just the full
            platform.
          </p>
        </div>
      </section>

      {/* Plan card */}
      <section className="pb-8">
        <div className="max-w-lg mx-auto px-6">
          <div className="rounded-3xl bg-white border border-[#E8E1D7] shadow-[0_8px_30px_rgba(42,36,51,0.06)] overflow-hidden">
            <div className="p-8 md:p-10">
              <h2 className="text-2xl font-bold mb-2">SAGA</h2>
              <p className="text-[#6B6475] mb-6">
                Everything your nonprofit needs to raise more and keep donors longer.
              </p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-6xl font-bold tabular-nums">$100</span>
                <span className="text-[#6B6475] text-lg">/month</span>
              </div>
              <p className="text-[#6B6475] mb-8">plus a 2% platform fee on donations processed</p>

              <Link
                href="/register"
                className="flex items-center justify-center gap-2 w-full py-4 text-white font-bold rounded-xl hover:opacity-95 transition-all"
                style={{ background: SUNSET }}
              >
                Start Free
                <ArrowRight size={20} />
              </Link>
              <p className="text-center text-[#9A93A3] text-sm mt-3">No credit card required to start</p>
            </div>

            <div className="border-t border-[#E8E1D7] p-8 md:p-10 bg-[#FAF6EF]">
              <p className="font-semibold mb-5">Everything included:</p>
              <ul className="space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#E6F3EE] flex items-center justify-center">
                      <Check size={13} weight="bold" className="text-[#4A8C6F]" />
                    </span>
                    <span className="text-[#2A2433]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl bg-white border border-[#E8E1D7] p-6">
                <h3 className="text-lg font-bold mb-2">{f.q}</h3>
                <p className="text-[#6B6475] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-12 rounded-3xl" style={{ background: SUNSET }}>
            <h2 className="text-4xl font-bold text-white mb-4">Ready to raise more?</h2>
            <p className="text-xl text-white/85 mb-8">Start today &mdash; no credit card required.</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-[#5B4B8A] font-bold text-lg rounded-xl hover:bg-white/90 transition-all"
            >
              Start Free
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
