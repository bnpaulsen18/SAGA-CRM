# SAGA Agents — Operational Expansion Analysis

> The four donor agents (Morning Brief, Major-Gift Signal, Welcome, Return) work the **donor relationship**. This doc analyzes **operational agents** — ones that help *run and protect the CRM itself*: secure the data, keep it compliant, clean it, move donors in, reconcile money, answer questions. Companion to `docs/SagaAgents.md` and `docs/AGENTS-BUILD-PLAN.md`.
>
> **Priority lens (updated):** SAGA handles real donor money and PII, so **security and compliance agents are top priority** alongside the ones that compound value and win customers. Each candidate below is scored on value, dependencies, **security/compliance impact**, risk, and effort. Nothing here is built yet — these are candidates to sequence.

Last updated: 2026-09-04

---

## What "an agent" means here — and the security stance
An agent doesn't replace SAGA's real security controls; it **watches, enforces, and reports on** them. The controls are already in the codebase: tenant isolation (`organizationId ?? '__no_such_org__'`, `lib/prisma-rls.ts`), PII encryption at rest (`lib/encryption.ts`), the audit log (`lib/audit.ts`), fraud heuristics (`lib/security/fraud-detector.ts`), rate limiting (`lib/security/rate-limiter.ts`), and CSP/headers (`middleware.ts`, `lib/security/headers.ts`).

**Every agent — especially the security ones — runs under the same rules:**
- **Least privilege** — read-mostly; an agent that *acts* (delete, suppress, lock) proposes and a human approves.
- **Fail-closed** — when a fact is unknown (consent, ownership), the safe default wins (suppress, don't send).
- **Fully audited** — every agent action writes to `lib/audit.ts`.
- **Org-scoped** — an agent can never see or act across tenant boundaries; the isolation rule applies to agents too.
- **Never fabricate** — grounded in real data only.

---

## Priority overview

| Priority | Agent | Category | Sec/Compliance impact | Effort | Scaffolding today |
|---|-------|----------|----------------------|--------|-------------------|
| 🔴 High | **Consent & Compliance** | Security/Compliance | ★★★ | Med | Contact opt-out/status fields |
| 🔴 High | **Access & Audit Monitor** | Security/Compliance | ★★★ | Med | `lib/audit.ts` + auth events |
| 🔴 High | **Data-Protection (DSAR & Retention)** | Security/Compliance | ★★★ | Med–High | `encryption.ts`, `GDPR_DELETE` audit action |
| 🔴 High | **Fraud / Anomaly Monitor** | Security/Compliance | ★★★ | Low–Med | `fraud-detector.ts` exists |
| 🔴 High | **Data Hygiene** | Operations | ★★ (data minimization) | Med | Contacts + `bulk` ops |
| 🔴 High | **Migration Copilot** | Growth/Onboarding | ★★ (secure transfer) | Med | CSV import + `ImportPreview` |
| 🟠 Med-High | **Gift Reconciliation** | Money | ★★ (financial integrity) | Med–High | Stripe + donations |
| 🟠 Med-High | **Insights / Ask-Your-Data** | Insight | ★ | Med–High | `lib/reports/` |
| 🟡 Med | **Tax-Receipt / Year-End** | Money/Compliance | ★★ (IRS) | Med | `lib/pdf/` + donations |
| 🟡 Med | **Segment Builder** | Growth | ★ | Med | query layer |
| 🟡 Med | **Onboarding Copilot** | Growth | ★ | Med | onboarding wizard |
| ⚪ Later | **Inbox / Reply Triage** | Comms | ★ | High | needs inbound email |

★ impact rating is security/compliance leverage, not overall value.

---

# Security & Compliance agents (top priority)

### 1. Consent & Compliance Agent  🔴  ★★★
**What it does:** the guardrail on every outbound message. Before *any* send — a human campaign or an autonomous agent — it verifies each recipient is legally and ethically contactable, and blocks the ones who aren't, with a reason.
**How it works:**
- Pre-flight each recipient: consented to this channel? opted out? on the suppression list? previously bounced or filed a spam complaint?
- Applies jurisdiction rules — **CAN-SPAM** (US: working unsubscribe, valid physical postal address, honest subject), **CASL** (Canada: express/implied consent tracking), **GDPR/ePrivacy** (EU: lawful basis, opt-in).
- Scans the message body for the required elements and risky patterns; flags anything missing.
- Records every consent state change with a timestamp — your proof of compliance if a regulator asks.
**Security/compliance impact:** ★★★ — this is what makes autonomous donor email (Welcome/Return Series) *safe to switch on*. Protects deliverability (fewer complaints), sender reputation, and legal standing.
**Data/deps:** contact status/opt-out fields, send events, audit log.
**Risk & guardrails:** low — it *restricts* sends, never initiates them; **fail-closed** (unknown consent → suppress).
**Effort/priority:** Med / 🔴 — **build in the same phase as Welcome + Return Series.**

### 2. Access & Audit Monitor Agent  🔴  ★★★  *(new)*
**What it does:** the intrusion-and-misuse detector. It watches the audit log and auth events for behavior that looks like a breach, an insider misusing access, or someone probing tenant isolation — and alerts a human.
**How it works:**
- Continuously reads `lib/audit.ts` events + authentication/session logs.
- Baselines "normal" per user/org, then flags anomalies: a user exporting the entire donor database at 3am; a spike in 403/authorization failures (a signature of IDOR probing); logins from new devices/geographies; a burst of record views far above that user's norm.
- Raises an internal alert with severity and a recommended action.
**Security/compliance impact:** ★★★ — detection layer over your existing controls; catches attempts to **cross org boundaries** (reinforcing the crown-jewel isolation guarantee) and supports SOC 2 / audit-readiness for enterprise and grant requirements.
**Data/deps:** audit log (exists), auth events.
**Risk & guardrails:** low — **read-only over logs, alert-only.** It deliberately does *not* auto-lock accounts (that would hand an attacker an easy denial-of-service by triggering lockouts); a human decides.
**Effort/priority:** Med / 🔴.

### 3. Data-Protection Agent — DSAR & Retention  🔴  ★★★  *(new)*
**What it does:** handles the legal obligations around donor personal data: data-subject access requests, right-to-erasure, retention limits, and encryption coverage.
**How it works:**
- **Access request** ("what do you have on me?") → compiles a complete, human-readable export of a donor's record via the existing decrypt path.
- **Erasure request** ("delete me") → proposes a compliant delete/anonymize (the schema already models a `GDPR_DELETE` audit action) — soft-delete/anonymize first, with human approval and a full audit entry.
- **Retention** → flags records held past their retention window for review (data minimization).
- **Encryption coverage** → periodically checks that sensitive PII fields are actually encrypted (`lib/encryption.ts`) and flags any that slipped through.
**Security/compliance impact:** ★★★ — directly satisfies **GDPR** (Art. 15 access, Art. 17 erasure, storage limitation) and **CCPA/CPRA** (access + deletion) obligations, and shrinks breach blast radius by minimizing retained PII.
**Data/deps:** contacts (encrypted PII), audit log, encryption lib.
**Risk & guardrails:** medium — erasure is destructive. Guardrails: **propose → human approve**, anonymize rather than hard-delete where financial records must be retained for tax/audit law, always audit.
**Effort/priority:** Med–High / 🔴.

### 4. Fraud / Anomaly Monitor Agent  🔴  ★★★
**What it does:** watches donation activity for fraud and abuse — card-testing runs, stolen-card donations, refund/chargeback abuse, and unusual spikes — and alerts staff before it becomes a chargeback problem.
**How it works:**
- Builds on the existing `lib/security/fraud-detector.ts` heuristics, adding an agent layer that reasons over patterns across time (many small donations in minutes from one source = card testing; a sudden geography/amount anomaly).
- Scores and explains each flag; routes high-severity ones to the platform admin fraud monitor (`app/admin/fraud-monitor` exists).
**Security/compliance impact:** ★★★ — protects the org's Stripe standing (chargebacks threaten payout ability), donor trust, and the platform's own risk exposure.
**Data/deps:** `fraud-detector.ts` (exists), donations, Stripe events.
**Risk & guardrails:** low — internal alerts; never auto-refunds or blocks a donor without human review.
**Effort/priority:** Low–Med (logic exists) / 🔴 — **cheapest security win to stand up.**

---

# Operations agents

### 5. Data Hygiene Agent  🔴  ★★
**What it does:** keeps the donor file clean — finds duplicates, malformed emails/phones, inconsistent name/address casing, and missing fields, and proposes merges and fixes for a human to approve.
**How it works:** scans contacts on a schedule and on import; clusters likely-duplicate donors (fuzzy match on name+email+address); proposes a merge that preserves combined giving history; normalizes formats; surfaces a review queue.
**Security/compliance impact:** ★★ — duplicate/stale records are a **data-minimization and accuracy** problem (and they silently break major-gift and return detection by splitting a donor's history).
**Data/deps:** contacts + a merge/apply path (the `bulk` route is a start).
**Risk & guardrails:** low — suggests, human confirms; merges are reversible/audited; never auto-deletes.
**Effort/priority:** Med / 🔴 — **compounds**: clean data lifts every donor agent's accuracy.

### 6. Migration Copilot  🔴  ★★
**What it does:** turns a messy export from Bloomerang / DonorPerfect / Blackbaud / a spreadsheet into a clean, mapped, de-duplicated import — the guided version of the secure migration process in `cofounder/SAGA-Business.md`.
**How it works:** auto-maps source columns to SAGA fields; previews the result (`ImportPreview.tsx`); de-dupes on the way in; flags ambiguous rows; imports in bounded batches; reconciles totals with the customer.
**Security/compliance impact:** ★★ — enforces the **secure-transfer** discipline (encrypted upload, not email; delete the source file after; org-scoped; PII encrypted on arrival; audited).
**Data/deps:** existing import pipeline (`app/(app)/contacts/import`, `bulk` route).
**Risk & guardrails:** low — preview + human confirm before commit.
**Effort/priority:** Med / 🔴 — the agent that most directly **wins customers** (kills the #1 switching objection).

---

# Money & finance agents

### 7. Gift Reconciliation Agent  🟠  ★★
**What it does:** matches Stripe payouts/deposits to donations and donors, flags unmatched gifts, likely duplicates, and donations missing a receipt — a clean "everything ties out" view for month-end.
**How it works:** pulls Stripe payout/charge data, matches to `Donation` records, surfaces discrepancies with suggested resolutions.
**Security/compliance impact:** ★★ — financial integrity and audit-readiness; catches misattributed or missing gifts before they become accounting problems.
**Data/deps:** Stripe (Connect) + donations; live Stripe keys.
**Risk & guardrails:** medium (money) — **read-only reconciliation; never moves funds.**
**Effort/priority:** Med–High / 🟠.

### 8. Tax-Receipt / Year-End Statement Agent  🟡  ★★
**What it does:** generates annual giving statements and gift acknowledgments in bulk with IRS-compliant language.
**How it works:** aggregates each donor's year of giving, renders statements via `lib/pdf/`, personalizes around **fixed, reviewed compliance templates** (the agent never free-writes the legal text).
**Security/compliance impact:** ★★ — IRS substantiation requirements (§170(f)); getting the language wrong is a real compliance issue, hence the template guardrail.
**Data/deps:** donations + `lib/pdf/` (receipts exist).
**Risk & guardrails:** medium — fixed templates + human spot-check before a bulk run.
**Effort/priority:** Med / 🟡 (seasonal, high-value).

---

# Insight & growth agents

### 9. Insights / Ask-Your-Data Agent  🟠  ★
**What it does:** natural-language questions over the org's own data ("how did Q3 giving compare to Q2?", "top 10 lapsed monthly donors?") + one-click board reports.
**How it works — the critical rule:** **compute the numbers in code** (`lib/reports/aggregations.ts`), then have the model *narrate* the computed result. The model never does the math and never invents a figure.
**Security/compliance impact:** ★ — must stay strictly org-scoped; the grounding rule prevents fabricated metrics reaching a board.
**Data/deps:** reports layer (exists).
**Risk & guardrails:** low–med — same anti-fabrication discipline as the donor agents.
**Effort/priority:** Med–High / 🟠 — strong differentiator/demo.

### 10. Segment Builder Agent  🟡  ★
**What it does:** turns plain language into saved, reusable segments for campaigns.
**How it works:** parses intent → a validated query over contacts/donations → a named list a human reviews.
**Security/compliance impact:** ★ — org-scoped; pairs with Consent agent so a segment can't be used to reach suppressed contacts.
**Effort/priority:** Med / 🟡.

### 11. Onboarding Copilot  🟡  ★
**What it does:** guides a new org through setup — connect Stripe, import donors (hands off to Migration Copilot), send a first campaign.
**Security/compliance impact:** ★ — can nudge orgs to complete security-relevant setup (verified sending domain, consent settings) correctly from day one.
**Effort/priority:** Med / 🟡 — improves activation/retention.

### 12. Inbox / Reply Triage Agent  ⚪ (later)  ★
**What it does:** triages inbound donor email, drafts replies, routes to the right person.
**Why later:** requires inbound-email infrastructure SAGA doesn't have yet.

---

## Recommended sequence (security-first)
1. **Fraud/Anomaly Monitor** — cheapest security win; the detection logic already exists.
2. **Consent & Compliance** — build *with* Welcome/Return Series so autonomous email is legal and safe from day one.
3. **Access & Audit Monitor** — breach/insider detection over the audit log; strengthens the tenant-isolation story for enterprise/grant due diligence.
4. **Data-Protection (DSAR & Retention)** — GDPR/CCPA obligations + encryption-coverage checks.
5. **Data Hygiene + Migration Copilot** — compound value + win customers (both build on existing code).
6. Then **Reconciliation → Insights → Tax-Receipt → Segment → Onboarding**, as customer pull dictates. **Inbox Triage** waits on inbound email.

## The through-line
Every agent reuses the pattern Phase 0 is building — **select/observe in code → reason with the model → human approves → never fabricate → audit everything → stay org-scoped.** For the security and compliance agents that discipline *is* the product: it's what lets a nonprofit trust SAGA with real donor money and personal data, and it's a concrete, demonstrable answer to the security due-diligence every serious customer (and investor) will run.
