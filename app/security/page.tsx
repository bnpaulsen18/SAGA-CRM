import Link from 'next/link'
import { ArrowRight, Lock, CreditCard, Database, ArrowsClockwise, Key, Export } from '@phosphor-icons/react/dist/ssr'
import SiteNav from '@/components/marketing/SiteNav'
import SiteFooter from '@/components/marketing/SiteFooter'

export const metadata = {
  title: 'Security',
  description:
    'How SAGA protects your organization and your donors — encryption, PCI-compliant payments via Stripe, access controls, and data you always own.',
  alternates: { canonical: 'https://sagacrm.io/security' },
}

const SUNSET = 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)'

const practices = [
  {
    icon: Lock,
    title: 'Encryption everywhere',
    body: 'All data is encrypted in transit with TLS and encrypted at rest in our database. Your information is protected the moment it leaves your browser.',
  },
  {
    icon: CreditCard,
    title: 'We never store card numbers',
    body: 'Payments are processed by Stripe, a PCI-DSS Level 1 certified provider. Donor card details are sent directly to Stripe and never touch our servers.',
  },
  {
    icon: Database,
    title: 'Your data is isolated',
    body: "Each organization's records are scoped to that organization, and access is enforced on every request so one customer can never see another's data.",
  },
  {
    icon: Key,
    title: 'Role-based access',
    body: 'Granular permissions let you control exactly who on your team can view donors, manage donations, or change settings.',
  },
  {
    icon: ArrowsClockwise,
    title: 'Backups & recovery',
    body: 'Your data is backed up regularly by our infrastructure provider so it can be restored if the unexpected happens.',
  },
  {
    icon: Export,
    title: 'You own your data',
    body: 'Export your contacts and donations whenever you like. If you ever leave SAGA, you take everything with you.',
  },
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#2A2433]">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute -top-32 right-0 w-[640px] h-[640px] rounded-full blur-[128px] opacity-[0.10]"
          style={{ background: SUNSET }}
        />
        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#5B4B8A] mb-4">Security</p>
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6">
            Built to protect your donors&rsquo; trust
          </h1>
          <p className="text-xl text-[#6B6475] leading-relaxed max-w-2xl">
            Your donor data is some of the most sensitive information your organization holds. We treat it that way &mdash;
            with strong encryption, trusted payment infrastructure, and the principle that your data is always yours.
          </p>
        </div>
      </section>

      {/* Practices */}
      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practices.map((p) => (
              <div key={p.title} className="p-8 bg-white border border-[#E8E1D7] rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-[#F4EFE6] flex items-center justify-center mb-5">
                  <p.icon size={24} weight="bold" className="text-[#5B4B8A]" />
                </div>
                <h3 className="text-xl font-bold mb-3">{p.title}</h3>
                <p className="text-[#6B6475] leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment + disclosure */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our ongoing commitment</h2>
            <p className="text-[#6B6475] leading-relaxed">
              Security is never finished. As SAGA grows, we continue to invest in our practices and work toward meeting
              recognized industry standards. We build on trusted, audited infrastructure &mdash; including Stripe for
              payments and a managed, encrypted database &mdash; so the foundation your data sits on is held to a high bar.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Reporting a vulnerability</h2>
            <p className="text-[#6B6475] leading-relaxed">
              If you believe you&rsquo;ve found a security vulnerability, we want to hear from you. Please email{' '}
              <a href="mailto:security@sagacrm.io" className="text-[#5B4B8A] font-semibold hover:underline">
                security@sagacrm.io
              </a>{' '}
              with the details. We&rsquo;ll investigate every credible report and appreciate responsible disclosure.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-12 rounded-3xl" style={{ background: SUNSET }}>
            <h2 className="text-4xl font-bold text-white mb-4">Fundraise with confidence</h2>
            <p className="text-xl text-white/85 mb-8">Give your donors a platform they can trust.</p>
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
