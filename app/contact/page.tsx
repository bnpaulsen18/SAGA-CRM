import Link from 'next/link'
import { ArrowRight, EnvelopeSimple, Headset, ShieldCheck } from '@phosphor-icons/react/dist/ssr'
import SiteNav from '@/components/marketing/SiteNav'
import SiteFooter from '@/components/marketing/SiteFooter'

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the SAGA team — questions, support, or security. We read every message.',
  alternates: { canonical: 'https://sagacrm.io/contact' },
}

const SUNSET = 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)'

const channels = [
  {
    icon: EnvelopeSimple,
    title: 'General & sales',
    body: 'Questions about SAGA, a demo, or whether it fits your organization.',
    email: 'hello@sagacrm.io',
  },
  {
    icon: Headset,
    title: 'Customer support',
    body: 'Already using SAGA and need a hand? Our team is here to help.',
    email: 'support@sagacrm.io',
  },
  {
    icon: ShieldCheck,
    title: 'Security',
    body: 'Found a vulnerability or have a security question? Reach the team directly.',
    email: 'security@sagacrm.io',
  },
]

export default function ContactPage() {
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
          <p className="text-sm font-semibold uppercase tracking-wider text-[#5B4B8A] mb-4">Contact</p>
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6">Get in touch</h1>
          <p className="text-xl text-[#6B6475] leading-relaxed max-w-2xl">
            We&rsquo;re a small team that cares about nonprofits. Tell us what you need &mdash; we read every message and
            usually reply within one business day.
          </p>
        </div>
      </section>

      {/* Channels */}
      <section className="pb-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {channels.map((c) => (
              <a
                key={c.title}
                href={`mailto:${c.email}`}
                className="group p-8 bg-white border border-[#E8E1D7] rounded-2xl hover:border-[#D8CEBF] hover:shadow-[0_8px_30px_rgba(42,36,51,0.06)] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F4EFE6] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <c.icon size={24} weight="bold" className="text-[#5B4B8A]" />
                </div>
                <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                <p className="text-[#6B6475] leading-relaxed mb-4">{c.body}</p>
                <span className="inline-flex items-center gap-1.5 text-[#5B4B8A] font-semibold">
                  {c.email}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="rounded-3xl p-12 bg-white border border-[#E8E1D7]">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Rather just try it?</h2>
            <p className="text-xl text-[#6B6475] mb-8 max-w-xl mx-auto">
              Create an account and see SAGA with your own donors &mdash; no credit card required.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-10 py-5 text-white font-bold text-lg rounded-xl hover:opacity-95 transition-all"
              style={{ background: SUNSET }}
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
