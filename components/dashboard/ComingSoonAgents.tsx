import {
  Sparkle, PhoneCall, Handshake, TrendUp, NotePencil, EnvelopeSimple,
} from '@phosphor-icons/react/dist/ssr'

const bricolage = { fontFamily: 'var(--font-bricolage), sans-serif' } as const

const secondary = [
  { icon: PhoneCall, title: 'Reactivation', body: 'Drafts personal outreach the moment a donor crosses from quiet into at-risk.' },
  { icon: Handshake, title: 'Welcome Series', body: "Paces a first-time donor's first 90 days automatically, in the org's voice." },
  { icon: TrendUp, title: 'Major-Gift Signal', body: 'Flags donors trending toward a bigger gift, briefs the fundraiser before the ask.' },
  { icon: NotePencil, title: 'Impact Reporting', body: "Turns a campaign's results into a donor-ready update, drafted, not templated." },
  { icon: EnvelopeSimple, title: 'Campaign Copy', body: "Drafts appeal and newsletter copy from the org's own donor data." },
]

/**
 * Deliberately calmer than the live-dashboard tour above it — this section
 * describes vision, not a shipped feature, and should never read as more
 * "AI-styled" than the real, working product. No fabricated metrics, no
 * lock/paywall iconography (that implies "pay us and it unlocks," which is a
 * different and also-false claim), no hover-as-if-clickable affordances.
 */
export default function ComingSoonAgents() {
  return (
    <section className="mt-10 -mx-6 px-6 py-12 bg-[var(--surface-2)] border-t border-[var(--line)]">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] bg-[var(--surface)] border border-[var(--line)] px-3 py-1 rounded-full mb-4">
            Coming soon
          </span>
          <h2 style={bricolage} className="text-2xl md:text-3xl font-bold text-[var(--ink)] mb-3">
            What you just saw is heuristics. Here&rsquo;s where it&rsquo;s headed.
          </h2>
          <p className="text-[var(--ink-soft)] max-w-2xl mx-auto">
            The Morning Brief above is real logic run against real gifts — but it&rsquo;s not yet AI. We&rsquo;re building
            toward Claude-drafted outreach, in your voice, across the moments that matter most.
          </p>
        </div>

        {/* Morning Brief, featured */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 mb-4 flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-[var(--paper)] border border-[var(--line)] flex items-center justify-center flex-shrink-0">
            <Sparkle size={22} weight="regular" className="text-[var(--twilight)]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 style={bricolage} className="text-lg font-bold text-[var(--ink)]">Morning Brief</h3>
              <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--ink-faint)] border border-[var(--line)]">Soon</span>
            </div>
            <p className="text-[var(--ink-soft)] text-sm leading-relaxed">
              The day&rsquo;s highest-impact donor actions, ranked by lapse risk and dollars at stake — with outreach
              drafted in your own voice. Approve and send; nothing goes out without a human.
            </p>
          </div>
        </div>

        {/* Secondary capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {secondary.map((item) => (
            <div key={item.title} className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <item.icon size={18} weight="regular" className="text-[var(--ink-soft)]" />
                <h3 className="font-bold text-[var(--ink)] text-sm">{item.title}</h3>
                <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--ink-faint)] border border-[var(--line)] ml-auto">Soon</span>
              </div>
              <p className="text-[var(--ink-soft)] text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
