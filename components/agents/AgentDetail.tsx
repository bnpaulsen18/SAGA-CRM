import Link from 'next/link'
import SagaCard from '@/components/ui/saga-card'
import { ArrowLeft, CheckCircle, Prohibit, Clock, Lightning, ShieldCheck, Wrench } from '@phosphor-icons/react/dist/ssr'
import type { AgentCopy } from '@/lib/donors/agent-catalog'
import type { AgentPreview } from '@/lib/donors/agent-preview'

const bricolage = { fontFamily: 'var(--font-bricolage), sans-serif' } as const
const labelCls = 'text-xs font-medium text-[var(--ink-faint)] uppercase tracking-wide'

/**
 * Shared shell for the four agent pages.
 *
 * The honesty rule for this screen: none of these agents are built. The page
 * says so once, prominently, at the top — and then everything below it is real.
 * The preview table is computed live from the organization's actual donors using
 * the selection logic the agent will gate on, so it is a genuine answer to
 * "what would this do for us", not a mockup.
 */
export default function AgentDetail({ copy, preview }: { copy: AgentCopy; preview: AgentPreview }) {
  const grouped = preview.rows.reduce<Record<string, typeof preview.rows>>((acc, r) => {
    const k = r.group ?? ''
    ;(acc[k] ||= []).push(r)
    return acc
  }, {})

  return (
    <>
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-[var(--ink-soft)] hover:text-[var(--ink)] mb-3 text-sm transition-colors"
        >
          <ArrowLeft size={16} weight="bold" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3 flex-wrap mb-3">
          <h1 className="text-3xl font-bold text-[var(--ink)]" style={bricolage}>{copy.name}</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-[var(--surface-2)] text-[var(--ink-soft)] border border-[var(--line)]">
            <Clock size={13} weight="bold" /> Not built yet
          </span>
        </div>
        <p className="text-lg text-[var(--ink-soft)] max-w-3xl">{copy.tagline}</p>
      </div>

      {/* Honest status, said once and up front */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-5 mb-8">
        <p className="text-[var(--ink)] text-sm leading-relaxed">
          <strong>This agent is designed, not shipped.</strong> The selection logic below runs today —
          the table further down is computed live from your real donors. What is missing is the drafting
          and sending layer, which needs an Anthropic API key and a scheduled job runner.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <SagaCard title="What it does">
            <p className="text-[var(--ink-soft)] leading-relaxed">{copy.summary}</p>
          </SagaCard>

          <SagaCard title="How it works">
            <ol className="space-y-5">
              {copy.how.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg,#F97A5E,#E0507A)' }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-[var(--ink)] mb-1">{step.title}</p>
                    <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </SagaCard>

          {/* The live example */}
          <SagaCard title={copy.previewTitle} subtitle={copy.previewNote}>
            {preview.rows.length === 0 ? (
              <p className="text-[var(--ink-soft)] text-sm py-4">{copy.emptyMessage}</p>
            ) : (
              <div className="space-y-5">
                {Object.entries(grouped).map(([group, rows]) => (
                  <div key={group}>
                    {group && (
                      <p className={`${labelCls} mb-2`}>{group}</p>
                    )}
                    <div className="space-y-2">
                      {rows.map((r) => (
                        <Link
                          key={r.contactId}
                          href={`/contacts/${r.contactId}`}
                          className="flex items-start justify-between gap-4 p-3 rounded-lg border border-[var(--line)] bg-[var(--paper)] hover:bg-[var(--surface-2)] transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-[var(--ink)]">{r.name}</p>
                            <p className="text-sm text-[var(--ink-soft)] mt-0.5">{r.detail}</p>
                          </div>
                          <p className="text-sm font-semibold text-[var(--ink)] whitespace-nowrap tabular-nums">
                            {r.headline}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {preview.silent.length > 0 && (
              <div className="mt-6 pt-5 border-t border-[var(--line)]">
                <p className={`${labelCls} mb-1`}>Deliberately left alone</p>
                <p className="text-sm text-[var(--ink-soft)] mb-3">
                  Knowing who <em>not</em> to act on matters as much as the list above.
                </p>
                <div className="space-y-2">
                  {preview.silent.map((r) => (
                    <Link
                      key={r.contactId}
                      href={`/contacts/${r.contactId}`}
                      className="block p-3 rounded-lg border border-dashed border-[var(--line)] hover:bg-[var(--surface-2)] transition-colors"
                    >
                      <div className="flex items-baseline justify-between gap-3 flex-wrap">
                        <p className="font-medium text-[var(--ink)]">{r.name}</p>
                        <p className="text-xs text-[var(--ink-faint)] tabular-nums">{r.headline}</p>
                      </div>
                      <p className="text-sm text-[var(--ink-soft)] mt-0.5">{r.detail}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-[var(--ink-faint)] mt-5">
              Scored across {preview.totalDonors} donor{preview.totalDonors === 1 ? '' : 's'} with giving history.
            </p>
          </SagaCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <SagaCard title="At a glance">
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Runs on</label>
                <p className="text-[var(--ink)] mt-1 flex items-center gap-2">
                  <Lightning size={16} weight="fill" className="text-[#E0507A]" />
                  {copy.trigger}
                </p>
              </div>
              <div>
                <label className={labelCls}>Contacts donors</label>
                <p className="text-[var(--ink)] mt-1">{copy.contactsDonors}</p>
              </div>
              <div>
                <label className={labelCls}>Autonomy</label>
                <p className="text-[var(--ink-soft)] text-sm mt-1 leading-relaxed">{copy.autonomy}</p>
              </div>
            </div>
          </SagaCard>

          <SagaCard title="Selection gates">
            <div className="space-y-3">
              {copy.gates.map((g) => (
                <div key={g.label}>
                  <p className="text-sm font-semibold text-[var(--ink)] flex items-center gap-1.5">
                    <CheckCircle size={15} weight="fill" className="text-[#4A8C6F] flex-shrink-0" />
                    {g.label}
                  </p>
                  <p className="text-sm text-[var(--ink-soft)] ml-[22px]">{g.rule}</p>
                </div>
              ))}
            </div>
          </SagaCard>

          <SagaCard title="Guardrails">
            <ul className="space-y-2.5">
              {copy.guardrails.map((g) => (
                <li key={g} className="text-sm text-[var(--ink-soft)] flex gap-2 leading-relaxed">
                  <ShieldCheck size={16} weight="fill" className="text-[#5B4B8A] flex-shrink-0 mt-0.5" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </SagaCard>

          <SagaCard title="Before it can be switched on">
            <ul className="space-y-2.5">
              {copy.requirements.map((r) => (
                <li key={r} className="text-sm text-[var(--ink-soft)] flex gap-2 leading-relaxed">
                  <Wrench size={16} weight="fill" className="text-[var(--ink-faint)] flex-shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </SagaCard>

          <div className="rounded-xl border border-[var(--line)] p-4">
            <p className="text-sm text-[var(--ink-soft)] flex gap-2">
              <Prohibit size={16} weight="bold" className="text-[var(--ink-faint)] flex-shrink-0 mt-0.5" />
              <span>
                Every agent inherits the same anti-fabrication rules: never invent a fact about a donor,
                never speculate about why their giving changed.
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
