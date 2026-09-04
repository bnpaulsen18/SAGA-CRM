# SAGA Agents — Build Plan & Testing

> How the four donor agents go from **designed** to **shipped**, how to **test** them safely, and the **dashboard** to run them from. Companion to `docs/SagaAgents.md` (the specs) and `cofounder/SAGA-Business.md` (the why/when).
>
> Reality anchor: the *selection logic* already runs (the agent pages show who each agent would act on today). What's missing is **drafting → approval → sending → scheduling**. This plan builds exactly that.

Last updated: 2026-08-28

---

## What already exists (don't rebuild it)
- `lib/donors/agent-catalog.ts` — all four agents' gates, guardrails, requirements.
- `lib/donors/scoring.ts` + `agent-preview.ts` — the selection logic; computes each agent's daily list from real donors.
- `components/agents/AgentDetail.tsx` + the four `app/(app)/*` pages — live per-agent views.
- `lib/ai/client.ts` — Anthropic SDK, gated on `ANTHROPIC_API_KEY` (returns disabled if absent).
- `app/api/agents/{list,execute,[name]}` — execution scaffolding.
- `scripts/seed-agent-demo.ts` — seeds donors that trigger the agents (your test fixture).

## What's missing (this plan)
Drafting layer · approval queue (Approve/Edit/Skip) · scheduled runner (Vercel Cron) · send pipeline (Welcome/Return) · enrollment/suppression stamps on `Contact` · **agents dashboard** · demo mode + tests.

---

## Sequencing — build in this order, and why

**Two agents draft-only (safe), two agents send to donors (riskier). Do the safe pair first.**

- **Morning Brief** and **Major-Gift Signal** never send to a donor on their own (Brief drafts for human approval; Signal only writes internal briefs). They need the **drafting** layer but **no email-sending pipeline** — fastest path to a working agent.
- **Welcome Series** and **Return Series** email donors autonomously. They need the send pipeline, enrollment stamps, consent re-checks, a verified domain, and demo mode. More surface area, more risk.

> **Recommended first build: Morning Brief** — it's the adoption wedge and the thing that sells SAGA in a demo. **Major-Gift Signal is a fast follow** (reuses the drafting layer, outputs internal tasks, zero donor-contact risk — arguably the *safest* to turn on for a real customer).

---

## Phase 0 — Foundations (do once, unblocks everything)
1. **Set `ANTHROPIC_API_KEY`** in Vercel (Production + Preview) and `.env.local`.
2. **Update the model.** `lib/ai/client.ts` uses `claude-3-5-sonnet-20241022` — update to a current model: **`claude-sonnet-5`** for draft quality, or **`claude-haiku-4-5`** for cheap high-volume. Make it an env/config value so it's swappable.
3. **Agent-run framework** — one entry point `runAgent(key, { orgId, mode })` where `mode = 'dry-run' | 'live'`. Every agent: select (exists) → draft → produce output (approval item or task or queued send). `dry-run` does everything **except** send.
4. **Data model** — add the tables the agents write to (Prisma migration):
   - `AgentRun` (agentKey, orgId, runAt, mode, status, counts) — observability.
   - `AgentAction` (runId, contactId, agentKey, kind, draftSubject, draftBody, status: `pending|approved|edited|skipped|sent`, decidedBy, decidedAt) — the approval queue.
   - `Contact` stamps for Welcome/Return: `welcomeEnrolledAt`, `returnEnrolledAt`, `agentSuppressedUntil`.
5. **Scheduled runner** — Vercel Cron hitting a protected route (`/api/agents/execute` already exists) per agent cadence (Brief daily, Signal nightly, Return weekly). Guard with a cron secret.

## Phase 1 — Morning Brief end-to-end (the wedge)
1. **Drafting** — for each of the top-3 selected donors, build a grounded prompt from **real gift history only** (name, last gift, months quiet, dollars at stake) and generate a draft in the org's voice. **Anti-fabrication system prompt**: never invent facts, outcomes, beneficiaries, or a *reason* the donor's giving changed.
2. **Approval queue** — write each draft as an `AgentAction (status=pending)`. UI: **Approve / Edit / Skip** per draft.
3. **Send on approval** — Approve → send via Resend (`lib/email/`) → mark `sent` + audit-log. Skip/Edit handled.
4. **Suppression** — a donor with a pending/approved action is suppressed from other agents (the "no donor worked twice" rule).
5. **Ship behind a flag** per org (`agentsEnabled`), default off.

## Phase 1.5 — Major-Gift Signal (fast follow)
Reuses drafting. Output is an **internal task/brief** for the assigned fundraiser (no donor contact). Gates already defined (depth ≥3, recency ≤6mo, last gift ≥1.5× average). Lowest-risk agent to enable for a real customer.

## Phase 2 — Welcome Series + Return Series (donor-facing, gated)
Only after Phase 1 is solid. Adds: event trigger on first gift (Welcome), weekly scan (Return), **stamp-before-send** (double-send impossible), **consent re-check before every touch**, **demo mode** (all sends redirect to a test mailbox until you flip it), value-threshold split (Return escalates majors to Morning Brief), verified sending domain (SPF/DKIM/DMARC), and a per-org kill switch.

---

## How to test the agents

**Layer the testing — cheap/fast first, donor-facing last.**

1. **Unit-test the gates (fastest).** `scoring.ts`/`agent-preview.ts` are pure functions. With `vitest` (already in the repo) + seeded fixtures, assert each agent selects exactly the right donors and *excludes* the right ones (the "deliberately left alone" set). No API key, no network.
2. **Mock the LLM.** Unit-test the drafting layer with the Anthropic client mocked — assert the prompt contains only real gift facts, and that a canned response is parsed correctly. Add a small **eval set**: given a donor, the draft must not contain invented statistics/dates (regex + assertions).
3. **Dry-run mode (your main manual test).** Run any agent in `dry-run`: it selects + drafts but **sends nothing**. Drafts land in the approval queue / dashboard so you read exactly what *would* go out. This is how you "test" day to day.
4. **Seed a test org.** `scripts/seed-agent-demo.ts` creates donors that trip each agent (a cooling major donor, a new first-gift donor, an accelerating donor, a lapsed monthly donor). Run agents against it and confirm the right ones appear.
5. **Demo mode for the sending agents.** Welcome/Return redirect every send to *your* test mailbox, so you receive the actual emails a donor would — end-to-end, zero real-donor risk.
6. **E2E the approval flow.** Playwright (`tests/e2e` exists) drives Approve/Edit/Skip and asserts an email is queued only on Approve.
7. **Staging before prod.** Run against the Vercel **Preview** deploy with the seed org before enabling for any real customer. Never test drafting against real donor emails without demo mode on.

**Golden rule for testing donor-facing agents:** demo mode ON until you have personally received and read the full sequence yourself.

---

## The Agents Dashboard (navigate + run every agent)
A single hub — `/(app)/agents` — that ties the four pages together into a control panel:

- **One card per agent** with: status pill (`Not built` → `Ready` → `Live`), *"would act on **N** donors today"* (live from `agent-preview`), cadence, last run, and donor-contact level.
- **Per-card actions:** **Open** (the existing detail page), **Dry run** (compute + draft, show results, send nothing), and later an **Enable** toggle.
- **Approval queue** surfaced on the hub: pending drafts across all agents, each Approve / Edit / Skip.
- **Run history** (`AgentRun`): what ran, when, how many actions, how many approved/sent.

An interactive **mockup of this dashboard** accompanies this plan so you can navigate it before it's built — it's the build target for `/(app)/agents`.

---

## Watch an agent run in real time (live test pane)
The "test it on the side and watch it run" experience (like Copilot Studio) is buildable directly — SAGA's agents are our own code. Anthropic has no visual agent-builder/test-canvas, but it gives us the pieces: **streaming** (`client.messages.stream()` — token-by-token output) and, if we ever want Anthropic to host the loop, **Managed Agents** (a server-side agent loop with a live SSE event stream + scheduled runs).

**Architecture for a SAGA live test pane:**
1. A streaming route — e.g. `GET /api/agents/[key]/stream?mode=dry-run` — returns a **Server-Sent Events** stream (Next.js `ReadableStream` response).
2. `runAgent(key, { mode:'dry-run' })` **emits step events** as it goes: `scoring (214 donors)` → `selected 3` → `drafting: Margaret Ellsworth` → *draft tokens streaming in* → `draft ready` → `suppressed 2 others`. Switch the drafting call from `messages.create` to **`client.messages.stream()`** and forward each text delta to the SSE stream.
3. A React side-panel component opens an `EventSource` on that route and renders the trace live — an activity log plus the draft **typing in word-by-word**, exactly like watching Claude work. Dry-run, so nothing sends.

This gives you: click **Test run** on any agent → a panel slides in → you watch it score, select, and draft in real time, then Approve/Skip the result. It's the Copilot-Studio "watch it run" feel, on real donors, with zero send risk.

> Model note: `lib/ai/client.ts` currently pins the retired `claude-3-5-sonnet-20241022`. Update it (default `claude-opus-5`; `claude-haiku-4-5` or `claude-sonnet-5` are cheaper for high-volume drafting — your call) **and switch drafting to the streaming API** so the live pane works.

## Definition of done (per agent)
Selection unit-tested · drafting grounded + anti-fabrication verified · dry-run reviewed by a human · (donor-facing) demo-mode sequence received and read · approval/kill switch working · audit-logged · behind a per-org flag, default off.

## First concrete steps
- [ ] Phase 0.1–0.2: set `ANTHROPIC_API_KEY`, update the model in `lib/ai/client.ts`.
- [ ] Phase 0.4: Prisma migration for `AgentRun` / `AgentAction` / contact stamps.
- [ ] Phase 1: Morning Brief drafting + approval queue, dry-run first.
- [ ] Build `/(app)/agents` dashboard (mockup first, then real).
