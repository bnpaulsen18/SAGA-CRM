# SAGA Agents — Operational Expansion Analysis

> The four donor agents (Morning Brief, Major-Gift Signal, Welcome, Return) work the **donor relationship**. This doc analyzes **operational agents** — ones that help *run the CRM itself*: clean the data, move donors in, reconcile money, answer questions, stay compliant. Companion to `docs/SagaAgents.md` and `docs/AGENTS-BUILD-PLAN.md`.
>
> Framing rule: these are **candidates**, not commitments. Each is scored on value, data/dependencies, risk, and build effort so you can sequence them. Nothing here is built.

Last updated: 2026-08-28

---

## How to read the priority
The best operational agents to build first **compound** — they make every other agent (and the whole product) better — and **de-risk the raise** by turning into real customer value fast. Two lenses:
- **Compounding:** does it improve the data or workflow that everything else depends on?
- **Acquisition:** does it remove a reason a nonprofit won't switch to SAGA?

| # | Agent | Helps | Risk | Effort | Priority | Scaffolding today |
|---|-------|-------|------|--------|----------|-------------------|
| 1 | **Data Hygiene** | Everyone | Low | Med | 🔴 High | Contacts + `bulk` ops exist |
| 2 | **Migration Copilot** | Sales / onboarding | Low | Med | 🔴 High | CSV import + `ImportPreview` exist |
| 3 | **Gift Reconciliation** | Finance | Med (money) | Med–High | 🟠 Med-High | Stripe + donations exist |
| 4 | **Insights / Ask-Your-Data** | EDs, board | Low–Med | Med–High | 🟠 Med-High | `lib/reports/` aggregations exist |
| 5 | **Tax-Receipt / Year-End** | Admin | Med (compliance) | Med | 🟡 Med | `lib/pdf/` + donations exist |
| 6 | **Segment Builder** | Campaigns / comms | Low | Med | 🟡 Med | Contact/donation query layer exists |
| 7 | **Consent & Compliance** | Everyone (guardrail) | Low | Med | 🟡 Med | Contact status/opt-out fields exist |
| 8 | **Fraud / Anomaly Monitor** | Platform + org trust | Low (internal) | Low–Med | 🟡 Med | `lib/security/fraud-detector.ts` exists |
| 9 | **Onboarding Copilot** | Activation / retention | Low | Med | 🟡 Med | Onboarding wizard exists |
| 10 | **Inbox / Reply Triage** | Comms team | Med (donor-facing) | High | ⚪ Later | Needs inbound email (not built) |

---

## The options, in depth

### 1. Data Hygiene Agent  🔴
**What it does:** continuously scans the donor file for duplicates, malformed emails/phones, inconsistent name/address casing, and missing fields — and proposes merges and fixes for a human to approve.
**Who it helps:** every customer. Dirty donor data is nearly universal and it silently degrades every other agent (a duplicate donor splits giving history and breaks major-gift/return detection).
**Needs:** contacts data; a merge/apply path (the `bulk` route is a starting point).
**Risk:** low — suggests, human confirms; nothing destructive without approval.
**Why first:** it **compounds** — clean data makes the four donor agents materially more accurate. It's also a great, safe demo ("SAGA found 43 duplicates and 120 fixable records on import").

### 2. Migration Copilot  🔴
**What it does:** takes a messy export from Bloomerang / DonorPerfect / Blackbaud / a spreadsheet, **maps the columns automatically**, previews the result, de-dupes on the way in, and flags anything ambiguous. Turns the `docs`-described migration process into a guided, mostly-automated flow.
**Who it helps:** sales and onboarding — this removes the **#1 switching objection** ("moving our data is a nightmare"). Directly serves the customer-acquisition goal in `cofounder/SAGA-Business.md`.
**Needs:** the existing import pipeline (`app/(app)/contacts/import`, `ImportPreview.tsx`, `bulk` route) + column-mapping intelligence.
**Risk:** low — preview + human confirm before commit.
**Why first:** it's the agent that most directly **wins customers**, and it builds on code you already have.

### 3. Gift Reconciliation Agent  🟠
**What it does:** matches Stripe payouts/deposits to donations and donors, flags unmatched gifts, likely duplicates, and donations missing a receipt; surfaces a clean "everything ties out" view for month-end.
**Who it helps:** the person who does the books — a real, recurring pain, and trust-critical because it's money.
**Needs:** Stripe (Connect) + donations; live Stripe keys.
**Risk:** medium — it reports and flags; it should never move money. Read-only reconciliation only.
**Note:** high value for finance-minded EDs; pairs with the existing Stripe integration.

### 4. Insights / Ask-Your-Data Agent  🟠
**What it does:** natural-language questions over the org's own data ("how did Q3 giving compare to Q2?", "who are my top 10 lapsed monthly donors?"), plus one-click board-report generation.
**Who it helps:** EDs and boards who want answers, not spreadsheets. Strong differentiator and demo moment.
**Needs:** `lib/reports/aggregations.ts` + `donor-analytics.ts` (already exist).
**Risk:** low–medium — the hard rule is **compute the numbers in code, then have the model narrate them**; the agent must never invent a figure. Same anti-fabrication discipline as the donor agents.
**Note:** reuses the same "grounded, never fabricate" pattern already established.

### 5. Tax-Receipt / Year-End Statement Agent  🟡
**What it does:** generates annual giving statements and gift acknowledgments with IRS-compliant language, in bulk, at year-end.
**Who it helps:** admins during the January crunch — a huge, seasonal manual burden.
**Needs:** donations + `lib/pdf/` (receipt generation exists).
**Risk:** medium — compliance language must be correct; use fixed, reviewed templates and let the agent personalize around them, not free-write the legal text.
**Note:** seasonal but a strong "SAGA saved us a week" story.

### 6. Segment Builder Agent  🟡
**What it does:** turns plain language into saved, reusable segments ("monthly donors in California who lapsed this year") for campaigns and comms.
**Who it helps:** anyone running a campaign — removes the need to think in filters.
**Needs:** a query layer over contacts/donations.
**Risk:** low — it builds a list a human reviews before using.

### 7. Consent & Compliance Agent  🟡
**What it does:** keeps opt-outs and suppression clean, monitors CAN-SPAM / GDPR hygiene, and warns before a send that would hit suppressed or unconsented contacts. A **guardrail agent for the sending agents.**
**Who it helps:** everyone — protects email deliverability *and* legal standing.
**Needs:** contact consent/opt-out fields.
**Risk:** low.
**Note:** worth building **alongside** Welcome/Return Series — it makes autonomous donor email safe to switch on.

### 8. Fraud / Anomaly Monitor Agent  🟡
**What it does:** watches donation patterns for card-testing, fraud spikes, or anomalies and alerts staff — an agent layer over the fraud logic you already have.
**Who it helps:** platform trust and the org's own peace of mind.
**Needs:** `lib/security/fraud-detector.ts` (exists) + donations.
**Risk:** low — internal alerts only.
**Note:** cheapest to stand up because the detection logic is already written.

### 9. Onboarding Copilot  🟡
**What it does:** guides a brand-new org through setup — connect Stripe, import donors (hands to the Migration Copilot), send a first campaign — nudging them to the "aha" moment.
**Who it helps:** activation and early retention — the difference between a signup and a live customer.
**Needs:** the existing onboarding wizard.
**Risk:** low.

### 10. Inbox / Reply Triage Agent  ⚪ (later)
**What it does:** triages inbound donor email, drafts replies, routes to the right person.
**Who it helps:** comms teams drowning in donor email.
**Why later:** requires **inbound email infrastructure SAGA doesn't have yet** — a big dependency. High value, but not until the plumbing exists.

---

## Recommended sequence
1. **Data Hygiene + Migration Copilot** — build these two first. They compound (clean data lifts every donor agent) and directly win customers (painless switching). Both build on code that already exists.
2. **Insights / Ask-Your-Data** — the differentiator demo; reuses the reports layer and the grounded-narration pattern.
3. **Consent & Compliance** — build it *with* Welcome/Return Series so autonomous donor email is safe from day one.
4. Then **Gift Reconciliation**, **Tax-Receipt**, **Segment Builder**, **Fraud Monitor**, **Onboarding Copilot** as customer pull dictates.
5. **Inbox Triage** waits on inbound-email infrastructure.

## The through-line
Every one of these reuses two things you've already established: the **select-in-code, draft/narrate-with-the-model, human-approves** pattern, and the **never-fabricate** guardrail. That consistency is a moat — it's what makes SAGA's agents trustworthy with real donor money, and it's the same `runAgent` framework Phase 0 is building.
