/**
 * Drafting layer for the donor agents.
 *
 * The agents SELECT donors with lib/donors/scoring.ts + agent-preview.ts; this
 * module turns a selected donor into outreach — grounded ONLY in the gift facts
 * we pass in. The system prompt below is the load-bearing guardrail: the model
 * may never invent a statistic, an outcome, a beneficiary, or a reason a donor's
 * giving changed. A human still approves every send.
 *
 * `streamDonorDraft` yields text deltas so the live test pane can type the draft
 * in as it generates (see docs/AGENTS-BUILD-PLAN.md → "Watch an agent run").
 */
import { streamCompletion, isAnthropicAvailable } from '@/lib/ai/client'

export interface DonorDraftFacts {
  firstName: string
  orgName: string
  /** Only pass what you actually know — omit anything you don't. */
  lastGiftAmount?: number
  lastGiftDate?: string
  monthsQuiet?: number
  giftCount?: number
  lifetimeGiving?: number
  status?: string
}

/** What the outreach is for — steers tone without inventing facts. */
export type DraftIntent =
  | 'gratitude-checkin' // Morning Brief: a quiet, no-ask thank-you / check-in
  | 'welcome' // Welcome Series: first-gift thank-you
  | 'reconnect' // Return Series: gentle win-back, no ask

const SYSTEM_PROMPT = `You draft short donor outreach for a nonprofit's fundraising team, written in the organization's own warm, plain, human voice.

Hard rules — never break these:
- Use ONLY the facts you are given. Never invent a statistic, a program outcome, a beneficiary, an event, or a dollar figure that is not provided.
- Never state or speculate about WHY a donor's giving changed — no assumptions about their finances, health, family, or feelings.
- No pressure tactics: no urgency, scarcity, deadlines, guilt, counting the months at them, or matching-gift language.
- Be specific and genuine, not generic. 60–120 words.
- A real person reviews this before it sends — write a strong first draft, not a placeholder.

Return ONLY the message body. No subject line, no preamble, no explanation. End with a sign-off line of "[Your name]".`

function factLines(f: DonorDraftFacts): string {
  const lines: string[] = [`- Donor first name: ${f.firstName}`, `- Organization: ${f.orgName}`]
  if (f.status) lines.push(`- Current status: ${f.status}`)
  if (typeof f.giftCount === 'number') lines.push(`- Total gifts on file: ${f.giftCount}`)
  if (typeof f.lastGiftAmount === 'number') lines.push(`- Last gift amount: $${f.lastGiftAmount.toFixed(2)}`)
  if (f.lastGiftDate) lines.push(`- Last gift date: ${f.lastGiftDate}`)
  if (typeof f.monthsQuiet === 'number') lines.push(`- Months since last gift: ${f.monthsQuiet}`)
  if (typeof f.lifetimeGiving === 'number') lines.push(`- Lifetime giving: $${f.lifetimeGiving.toFixed(2)}`)
  return lines.join('\n')
}

const INTENT_GUIDANCE: Record<DraftIntent, string> = {
  'gratitude-checkin':
    'Write a brief, warm check-in that thanks them for their support and opens the door — explicitly no ask, no request for money.',
  welcome:
    'Write a warm thank-you for their first gift that makes them feel genuinely welcomed. No second ask.',
  reconnect:
    'Write a gentle reconnect note to a donor who has been quiet. Acknowledge it lightly and warmly. No ask, no guilt.',
}

export function buildDonorPrompt(f: DonorDraftFacts, intent: DraftIntent): string {
  return `Facts (use only these):\n${factLines(f)}\n\nTask: ${INTENT_GUIDANCE[intent]}`
}

/**
 * Stream a donor draft token-by-token. Throws if ANTHROPIC_API_KEY is unset so
 * the caller (the run framework / SSE route) can surface a clear message.
 */
export async function* streamDonorDraft(
  f: DonorDraftFacts,
  intent: DraftIntent
): AsyncGenerator<string> {
  if (!isAnthropicAvailable) {
    throw new Error('AI drafting is disabled — set ANTHROPIC_API_KEY to enable the agents.')
  }
  yield* streamCompletion(buildDonorPrompt(f, intent), SYSTEM_PROMPT, 512)
}
