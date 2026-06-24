import Link from 'next/link'
import { ArrowRight, Heart, Handshake, Sparkle, ShieldCheck } from '@phosphor-icons/react/dist/ssr'
import SiteNav from '@/components/marketing/SiteNav'
import SiteFooter from '@/components/marketing/SiteFooter'

export const metadata = {
  title: 'Our Story',
  description:
    'SAGA is an AI-native donor CRM built on one conviction: nonprofits change the world, and their tools should help — not get in the way.',
  alternates: { canonical: 'https://sagacrm.io/about' },
}

const SUNSET = 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)'

const values = [
  {
    icon: Heart,
    title: 'Mission first',
    body: 'We win only when nonprofits win. Every decision starts with whether it helps an organization raise more for the cause it serves.',
  },
  {
    icon: Handshake,
    title: 'Relationships over transactions',
    body: 'Donors are people, not line items. SAGA is built to help fundraisers remember, understand, and thank the humans behind every gift.',
  },
  {
    icon: Sparkle,
    title: 'Intelligence for everyone',
    body: "World-class donor insight shouldn't be a luxury reserved for organizations with big budgets and bigger data teams.",
  },
  {
    icon: ShieldCheck,
    title: 'Honest by default',
    body: 'Transparent pricing, no dark patterns, and data that always belongs to you. Trust is non-negotiable in mission-critical work.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#2A2433]">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute -top-32 right-0 w-[640px] h-[640px] rounded-full blur-[128px] opacity-[0.10]"
          style={{ background: SUNSET }}
        />
        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#5B4B8A] mb-4">Our Story</p>
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6">
            Every donor deserves
            <span
              className="block mt-2"
              style={{ background: SUNSET, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
            >
              to be remembered
            </span>
          </h1>
          <p className="text-xl text-[#6B6475] leading-relaxed max-w-2xl">
            SAGA was built on a simple conviction: nonprofits change the world, but the tools they&rsquo;re handed too
            often get in the way.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-6 space-y-6 text-lg text-[#6B6475] leading-relaxed">
          <p>
            Walk into almost any nonprofit and you&rsquo;ll find a small, dedicated team doing the work of many.
            You&rsquo;ll also find them spending their evenings wrestling spreadsheets, copying gifts between systems,
            and trying to remember which supporter they meant to follow up with. The relationships that fuel the mission
            slip through the cracks &mdash; not for any lack of care, but for lack of time.
          </p>
          <p>
            The cost is real. Most nonprofits lose nearly half of their donors from one year to the next. Behind that
            number are thank-you notes never sent, loyal supporters who quietly drifted away unnoticed, and gifts never
            asked for &mdash; simply because the people doing the work were buried in busywork.
          </p>
          <p>
            We started SAGA because modern AI changes this equation entirely. The drudgery &mdash; the data entry, the
            segmenting, the first draft of the thank-you, spotting the faithful donor who&rsquo;s about to lapse &mdash;
            can be handled by intelligent software. That gives fundraisers back the one thing they never have enough of:
            time for the human work only they can do.
          </p>
          <p className="text-[#2A2433] font-medium">
            So we built SAGA as an AI-native donor CRM &mdash; not a decades-old database with &ldquo;AI&rdquo; bolted on
            the side, but a platform designed from the ground up so that intelligence runs through every donor record,
            every gift, and every campaign.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="py-20 mt-12 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-3xl p-10 md:p-14 bg-white border border-[#E8E1D7]">
            <h2 className="text-3xl md:text-4xl font-bold mb-5">Our Mission</h2>
            <p className="text-xl text-[#6B6475] leading-relaxed">
              To help every nonprofit &mdash; no matter its size or budget &mdash; raise more, keep more of its donors,
              and spend more time on the mission that matters. We measure our own success by one thing: the dollars our
              customers raise and the relationships they keep.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">What we believe</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-8 bg-white border border-[#E8E1D7] rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-[#F4EFE6] flex items-center justify-center mb-5">
                  <v.icon size={24} weight="bold" className="text-[#5B4B8A]" />
                </div>
                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-[#6B6475] leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-12 rounded-3xl" style={{ background: SUNSET }}>
            <h2 className="text-4xl font-bold text-white mb-4">Less time on data. More time on donors.</h2>
            <p className="text-xl text-white/85 mb-8">See what an AI-native CRM can do for your mission.</p>
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
