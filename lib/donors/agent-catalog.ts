/**
 * Static description of the four donor agents — the copy behind /morning-brief,
 * /major-gift-signal, /welcome-series and /return-series.
 *
 * Kept next to lib/donors/scoring.ts on purpose: the gates described here are
 * the ones scoring.ts actually implements, so a change to one should be a change
 * to the other. Full specs live in docs/SagaAgents.md.
 *
 * NOTE: `lib/agents/` is unrelated developer tooling, not these agents.
 */

export type AgentKey = 'morning-brief' | 'major-gift-signal' | 'welcome-series' | 'return-series'

export interface AgentCopy {
  key: AgentKey
  name: string
  tagline: string
  /** One paragraph a fundraiser would understand. */
  summary: string
  trigger: string
  contactsDonors: string
  autonomy: string
  /** Ordered steps of what the agent does when it runs. */
  how: { title: string; body: string }[]
  gates: { label: string; rule: string }[]
  guardrails: string[]
  /** What has to be true before this can be switched on. */
  requirements: string[]
  /** Heading above the live preview table. */
  previewTitle: string
  previewNote: string
  emptyMessage: string
}

export const AGENTS: Record<AgentKey, AgentCopy> = {
  'morning-brief': {
    key: 'morning-brief',
    name: 'Morning Brief',
    tagline: "The day's highest-impact donor actions, ranked, with the outreach already drafted.",
    summary:
      "Every morning before anyone logs in, Morning Brief reviews the whole donor file, picks the three people who most need attention today, and drafts the outreach for each one. Your team opens SAGA and the work is already there — approve, edit, or skip.",
    trigger: 'Scheduled — daily, before business hours',
    contactsDonors: 'Only after a human approves each send',
    autonomy: 'Ranks and drafts on its own. Sends nothing without approval.',
    how: [
      { title: 'Score every donor', body: 'Runs the same scoring the dashboard uses — status, months quiet, and dollars at stake for every donor on file.' },
      { title: 'Rank by what is actually at risk', body: 'Sorts by dollars at stake — a figure that already weights a donor’s status. A large donor who just went quiet outranks a small one who lapsed a year ago, because the money at risk is larger.' },
      { title: 'Take the top three', body: 'Three, not thirty. A list of everyone who needs attention is a report, and reports get ignored. The constraint is the product.' },
      { title: 'Draft the outreach', body: "Writes a first draft for each action in the organization's own voice, grounded in real gift history — never invented facts." },
      { title: 'Wait for a human', body: 'Each draft arrives with Approve / Edit / Skip. Nothing reaches a donor until someone says so.' },
    ],
    gates: [
      { label: 'Included', rule: 'Any donor whose status is not Active' },
      { label: 'Ranked by', rule: 'Dollars at stake (status is weighted into that figure)' },
      { label: 'Capped at', rule: '3 actions per day' },
      { label: 'Suppressed', rule: 'Donors currently in a Welcome Series or Return Series sequence' },
    ],
    guardrails: [
      'Nothing sends without explicit human approval',
      'Never states a reason a donor’s giving changed — reports the observation, not a motive',
      'Suppresses anyone another agent is already working, so no donor is contacted twice',
      'Never invents a statistic, an outcome, or a beneficiary',
    ],
    requirements: [
      'ANTHROPIC_API_KEY for the drafting layer',
      'A scheduled job runner (Vercel Cron or equivalent)',
      'An approval queue for Approve / Edit / Skip',
    ],
    previewTitle: 'What Morning Brief would surface today',
    previewNote: 'Computed live from your real donor data using the same scoring the dashboard runs.',
    emptyMessage: 'Every donor is currently Active — Morning Brief would have nothing to raise today.',
  },

  'major-gift-signal': {
    key: 'major-gift-signal',
    name: 'Major-Gift Signal',
    tagline: 'Finds the donors whose giving is quietly accelerating, and briefs the fundraiser before the ask.',
    summary:
      "Some donors tell you they are ready to give more by simply giving more. Major-Gift Signal watches for that pattern every night and puts a short brief in front of the right fundraiser. It never contacts a donor — the entire blast radius is internal, which is why it is the safest agent to turn on first.",
    trigger: 'Scheduled — nightly',
    contactsDonors: 'Never',
    autonomy: 'Fully autonomous. The worst case is a fundraiser reads a brief that was not useful.',
    how: [
      { title: 'Read the full gift history', body: 'Not just the last gift — the whole trajectory, how consistent it is, and how recent.' },
      { title: 'Compare the latest gift to the pattern', body: 'A gift materially larger than that donor’s own prior average is the signal. Everything else is noise.' },
      { title: 'Apply all three gates', body: 'Depth, recency and trajectory must all pass. Two out of three is not a prospect.' },
      { title: 'Brief the assigned fundraiser', body: 'Creates a task with the giving history, the multiple, and a suggested next step. Facts and one interpretation — no invented biography.' },
    ],
    gates: [
      { label: 'Depth', rule: 'At least 3 gifts on file — two gifts is not a trajectory' },
      { label: 'Recency', rule: 'Last gift within 6 months' },
      { label: 'Trajectory', rule: 'Last gift at least 1.5x the average of all prior gifts' },
    ],
    guardrails: [
      'Never contacts a donor — output goes to staff only',
      'Never speculates about wealth, employment, health, family or motive',
      'Reports only what the gift history shows',
      'The recency gate deliberately excludes lapsed donors — those are Return Series’ job',
    ],
    requirements: [
      'ANTHROPIC_API_KEY for the brief writing',
      'A scheduled job runner',
      'Fundraiser assignment on the donor record for routing',
    ],
    previewTitle: 'Donors passing all three gates right now',
    previewNote: 'These are the donors Major-Gift Signal would brief tonight, ranked by how far above their own average the last gift was.',
    emptyMessage: 'No donor currently passes all three gates. That is a normal result — the gates are deliberately narrow.',
  },

  'welcome-series': {
    key: 'welcome-series',
    name: 'Welcome Series',
    tagline: "Runs a first-time donor's first 90 days automatically, in your organization's voice.",
    summary:
      'Between half and two-thirds of first-time donors never give again, and that outcome is largely decided in the first 90 days — the exact window a small team has no hours for. Welcome Series fires the moment a first gift lands and paces three touches across that window.',
    trigger: 'Event — a gift arrives and it is that donor’s first',
    contactsDonors: 'Yes, autonomously',
    autonomy: 'Fully autonomous and donor-facing. A delayed thank-you is worse than an imperfect one.',
    how: [
      { title: 'Detect the first gift', body: 'Fires on the gift landing, not on a nightly batch — the thank-you goes out in seconds, not days.' },
      { title: 'Check every enrolment gate', body: 'First gift on file, not already enrolled, contactable and not opted out, agent enabled.' },
      { title: 'Stamp the record, then send', body: 'Enrolment is recorded before the first email goes out. If anything crashes mid-run, a donor gets skipped rather than mailed twice.' },
      { title: 'Pace three touches', body: 'Thank you now, impact story at day 7, a gentle second-gift invitation at day 30 — re-checking consent before each one.' },
      { title: 'Stop if they convert', body: 'A donor who gives again mid-sequence stops receiving it. Asking again would be tone-deaf.' },
    ],
    gates: [
      { label: 'First gift', rule: 'Exactly one gift on file' },
      { label: 'Not enrolled', rule: 'No welcome sequence already started' },
      { label: 'Contactable', rule: 'Email present, not suppressed, not opted out' },
      { label: 'Enabled', rule: 'The agent is switched on for the organization' },
    ],
    guardrails: [
      'Demo mode redirects every send to a test mailbox until you say otherwise',
      'Stamp-before-send makes double-mailing structurally impossible',
      'Opt-out and suppression are re-checked before every touch, not just at enrolment',
      'The second ask is barred from urgency, scarcity, deadlines and matching-gift pressure — those lift response and hurt retention',
      'A kill switch you control, offered up front',
    ],
    requirements: [
      'ANTHROPIC_API_KEY for the drafting layer',
      'Contact fields for enrolment stamps, opt-out and suppression',
      'A verified sending domain (SPF/DKIM/DMARC)',
      'Somewhere for a real person to watch replies',
    ],
    previewTitle: 'Donors Welcome Series would enrol today',
    previewNote: 'First-time donors whose gift landed recently enough to still be inside the welcome window.',
    emptyMessage: 'No brand-new donors right now. Welcome Series enrols on a first gift, so this fills up as new donors arrive.',
  },

  'return-series': {
    key: 'return-series',
    name: 'Return Series',
    tagline: 'Wins back donors who have gone quiet — automatically for smaller donors, escalated to a person for major ones.',
    summary:
      'Nothing happens when a donor stops giving. There is no event, nothing arrives in a queue — the signal is silence, which is why this agent goes looking on a schedule instead of waiting for a trigger. It measures silence against each donor’s own rhythm, then decides whether an email or a phone call is the right response.',
    trigger: 'Scheduled — weekly',
    contactsDonors: 'Yes, but only below the value threshold',
    autonomy: 'Autonomous for smaller donors. Hands major donors to a person instead.',
    how: [
      { title: 'Measure silence against their own rhythm', body: 'A monthly donor who misses three months has stopped. An annual donor at 14 months is behaving normally. A single fixed threshold gets one of those wrong, so the agent uses each donor’s own median gap between gifts.' },
      { title: 'Rule out the donors it must not contact', body: 'Deceased, do-not-solicit, an open complaint, or anyone a colleague has spoken to in the last 90 days — all excluded before anything else happens.' },
      { title: 'Split on lifetime value', body: 'Below the threshold, run an automated win-back. At or above it, send nothing at all and book a call instead.' },
      { title: 'Three touches, one ask', body: 'Reconnect at day 0, impact at day 14, and a single gentle invitation at day 42. Two touches before any ask is deliberate.' },
      { title: 'Hand off, then stand down', body: 'Escalations go to Morning Brief as tasks, and Morning Brief suppresses anyone mid-sequence so no donor is worked twice.' },
    ],
    gates: [
      { label: 'Lapsed', rule: 'Quiet for longer than their own giving rhythm allows' },
      { label: 'Not too cold', rule: 'Within 36 months — past three years this is a cold email, not a win-back' },
      { label: 'Retained once', rule: 'At least 2 gifts — a single-gift donor was never really retained' },
      { label: 'Safe to contact', rule: 'No deceased or do-not-solicit flag, no open complaint, no recent conversation' },
      { label: 'Cooldown clear', rule: 'One attempt per lapse — no re-enrolment for 18 months' },
    ],
    guardrails: [
      'Never speculates about why someone stopped giving — not finances, health, or dissatisfaction',
      'No guilt, no counting the months at them, no urgency or scarcity',
      'One attempt per lapse cycle. If they do not come back, the agent leaves them alone',
      'Major donors are never auto-emailed — an automated “we miss you” to a large donor is worse than silence',
      'Stops immediately on a gift, a reply, or an opened support conversation',
    ],
    requirements: [
      'ANTHROPIC_API_KEY for the drafting layer',
      'A scheduled job runner',
      'Deceased and do-not-solicit flags kept up to date — the agent is only as good as those',
      'A per-organization lapse threshold agreed with the fundraising lead',
    ],
    previewTitle: 'Donors Return Series would act on today',
    previewNote: 'Split by lifetime value: an automated win-back below the threshold, a fundraiser call above it.',
    emptyMessage: 'No donor is currently past their own giving rhythm. Return Series would sit quiet this week.',
  },
}

export const AGENT_ORDER: AgentKey[] = [
  'morning-brief', 'major-gift-signal', 'welcome-series', 'return-series',
]
