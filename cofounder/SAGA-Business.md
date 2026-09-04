# SAGA Business

> The operating plan — how SAGA gets **running**, gets its **AI agents built**, and gets its **first customers**. Companion to the fundraising brain (`company.md`, `raise.md`, `pitch.md`, `investors.md`) and the weekly loop in `tasks.md`.
>
> **Honesty rule (non-negotiable):** the in-product demo numbers ("Hope Foundation" — $11,840 MRR, 318 sustainers, ~41% retention) are **fictional sample data**, never real traction. Real metrics live in `company.md`, marked real. Everything `<!-- FILL IN -->` is unknown until confirmed.

Last updated: 2026-08-28 · Owner: Beau Paulsen

---

## The 30-second version
SAGA is an **AI-native donor CRM** that helps nonprofits keep the donors they already have. One plan: **$100/month + a 2% platform fee** on donations processed. The full non-AI CRM is **live** at [sagacrm.io](https://www.sagacrm.io). The four AI agents — the actual wedge — are **not built yet** and are the focus of the coming week.

---

## Where things actually stand (honest status)

| Area | Status | Notes |
|---|---|---|
| Non-AI CRM (contacts, donations, campaigns, reports, settings) | ✅ Live | The product a nonprofit can use day one |
| CSV donor **import** | ✅ Live | `app/(app)/contacts/import` — with a preview step |
| Marketing site + auth + light/dark | ✅ Live | |
| PII encryption at rest + audit logging | ✅ Live | `lib/encryption.ts`, `lib/audit.ts` |
| **4 AI agents** (Morning Brief, Major-Gift Signal, Welcome Series, Return Series) | 🚧 Not built | Today's "AI" is templated heuristics; needs `ANTHROPIC_API_KEY` |
| **Public donation checkout** | 🚧 Placeholder | Needed before a nonprofit can collect gifts through SAGA |
| **Live Stripe payments** | 🚧 Not configured | Test/live keys not set; webhook has known bugs to fix |
| Production hardening (rate limiting) | 🚧 Partial | Needs Upstash/KV |

**Read that honestly:** a nonprofit can start using SAGA as a *CRM* (manage and import donors, run campaigns, report) **today** — that's a real design-partner offer. Collecting live donations *through* SAGA and the AI agents are the two things still to finish.

---

## Goal for this week
**Get SAGA running for real users, stand up the AI agents, and land the first design-partner nonprofits.** Three tracks, run in parallel:

### Track 1 — Get it running (production-ready for a first real org)
1. Set **`ANTHROPIC_API_KEY`** in Vercel (unblocks the agents).
2. Set **Stripe live keys** + fix the webhook signature/idempotency bugs (see [security atlas](https://claude.ai/code/artifact/30f1096e-0229-47df-8c73-3855181bef5c) → Payments).
3. Ship the **public donation checkout** (currently a placeholder) — or scope the first design partners to CRM-only so this isn't a blocker.
4. Turn on **rate limiting** (Upstash/Vercel KV) on auth + donation endpoints.
5. Merge the open cleanup PR: [#2](https://github.com/bnpaulsen18/SAGA-CRM/pull/2).

### Track 2 — Build the 4 AI agents (see `docs/SagaAgents.md` for the specs)
The scaffolding already exists (`lib/ai/`, `lib/donors/agent-catalog.ts`, `agent-preview.ts`). Suggested build order — **ship one real agent end-to-end before starting the next:**
1. **Morning Brief** *(build first — it's the adoption wedge).* Reviews donors overnight, surfaces the day's highest-impact actions, drafts outreach **in the staff member's voice**. Human approves before anything sends.
2. **Major-Gift Signal** — flags donors trending toward a major gift.
3. **Welcome Series** — new-donor onboarding sequence.
4. **Return Series** — lapse-risk reactivation.
- **Guardrail:** nothing sends without a human approving it. Keep that in every agent.
- **Reality check:** four production-grade LLM agents in seven days is aggressive. If time is tight, **one genuinely great Morning Brief beats four half-built agents** — it's the demo that sells the product.

### Track 3 — Get customers (first 5–10 design partners)
- **ICP:** small nonprofits (<$500k–$2M budget), 1–3 staff on development, currently on spreadsheets, Bloomerang, DonorPerfect, or Blackbaud and frustrated.
- **Offer:** free/discounted **design-partner** onboarding in exchange for feedback + (later, with permission) a real retention metric and a testimonial. This is how the `<!-- FILL IN -->` traction in `company.md` becomes real.
- **Channels:** warm intros first (board members, nonprofit networks, any Syncd partnership audience); then targeted outreach to development directors.
- **The hook:** "SAGA reads your donor list every morning and hands your team the five relationships worth acting on today — drafted and ready to send." Lead with retention (keeping donors), not features.
- **Migration as a sales tool:** "we'll move your data in for you" removes the #1 switching objection — see the process below.

---

## Secure data migration into SAGA (the onboarding import process)

This is the process for bringing a new nonprofit's existing donor data into SAGA **safely**. It matters because (a) it's the biggest switching objection, and (b) donor data is real PII — mishandling it would be a trust and legal problem.

**What SAGA already enforces** (verified in the code): every import is **authenticated**, **scoped to that org only** (`organizationId` filtering, fail-closed), **validated** (Zod) before it touches the database, **PII-encrypted at rest** (`lib/encryption.ts`), and **audit-logged** (`lib/audit.ts`). So the platform side is built for this.

**The step-by-step process:**
1. **Get the data out of the old system securely.** Have the customer export to CSV from their current CRM. **Transfer it over an encrypted channel** — a link in SAGA (or their own secure file share), *never* plain email attachments. Delete the working copy once import is confirmed.
2. **Map the columns.** Match their fields (name, email, phone, address, giving history, tags) to SAGA's. SAGA's importer (`app/(app)/contacts/import`) has a **preview step** (`ImportPreview.tsx`) so you see exactly what will land before committing.
3. **Dry-run on a sample.** Import 10–20 rows first, confirm they look right in SAGA, then run the full file. Catches mapping mistakes before they multiply.
4. **De-dupe and validate.** Check for duplicate donors and malformed emails/amounts. Fix at the CSV stage — cleanest.
5. **Import in bounded batches.** The bulk path caps operations (≤1000 records) to stay reliable on serverless; large lists come in as multiple batches.
6. **Verify + reconcile.** Spot-check totals (contact count, lifetime giving) against the source so the customer trusts the numbers.
7. **Confirm and destroy the export.** Once verified, securely delete the CSV. The customer's data now lives encrypted in SAGA, scoped to their org, with an audit trail of the import.

**What to promise a customer:** "You export once; we map, preview, verify, and confirm it with you — your data is encrypted and visible only to your organization, and we delete the transfer file when we're done." **What not to do:** never move donor PII through email/Slack/unencrypted storage, never import into the wrong org, never skip the preview/verify steps.

*Future hardening (not built yet, worth noting): direct connectors/API imports from Bloomerang/DonorPerfect/Blackbaud, and a self-serve encrypted-upload wizard so customers migrate without you touching the file.*

---

## Metrics to start tracking now (feed `company.md` — REAL only)
- Design partners signed / live · real MRR · donors under management · **real** first-year retention from a real org (the number that proves the whole thesis) · pipeline of interested nonprofits.
- These are the numbers investors actually back. Every one is currently `<!-- FILL IN -->` — filling them is the real work.

## Links
- Live product: https://www.sagacrm.io · Codebase atlas: https://claude.ai/code/artifact/30f1096e-0229-47df-8c73-3855181bef5c
- Cleanup PR: https://github.com/bnpaulsen18/SAGA-CRM/pull/2
- Agent specs: `docs/SagaAgents.md` · Architecture: `docs/ARCHITECTURE.md` · Business brain: `cofounder/company.md`, `raise.md`, `pitch.md`

## Next actions
- [ ] Set `ANTHROPIC_API_KEY` in Vercel → build **Morning Brief** end-to-end first.
- [ ] Decide the first design-partner offer: **CRM-only** (ship now) vs **wait for donations/agents** (slower). Recommend CRM-only to start collecting real feedback.
- [ ] Line up the first 3 warm-intro nonprofits to approach this week.
- [ ] After the first real import, capture the real retention/usage numbers into `company.md`.
