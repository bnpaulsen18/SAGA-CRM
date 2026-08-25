# Sync(d) AI Partnership — Analysis

> Prepared 2026-08-06. Covers (a) what a Microsoft-stack migration actually requires and (b) how a financial partnership would typically be structured.
>
> **I am not a lawyer and this is not legal or investment advice.** The structures and benchmarks below are market-standard commercial patterns. The specific agreement needs a startup/IP attorney — and §1 explains why that is the most urgent item on this page, ahead of any technical work.

---

## 0. The decision you are actually making

This is framed as a technical question — "how do I migrate to Copilot Studio and Dataverse" — but that is the second question. The first is:

**Is SAGA a company you own, or a product line inside Sync(d)?**

Those lead to completely different migrations, different deals, and different outcomes for the $5M raise. Migrating first and deciding later is the expensive order, because **the migration itself destroys most of what you currently have to negotiate with.** Today you hold a working, deployed codebase. After a rebuild on Dataverse and Copilot Studio — likely by Sync(d) engineers, on Sync(d) tenancy, inside a Sync(d) solution — what you hold is the *design*, which is a far weaker asset. Domain insight is not protectable; a running product is.

**Negotiate the deal before the migration, not after.**

---

## 1. Findings that change the negotiation

### 1.0 🚨 Your fundraising brain is published on the public internet — fix today

**`cofounder/` is tracked in git, and the repo is public.** Verified: `raw.githubusercontent.com/bnpaulsen18/SAGA-CRM/main/cofounder/raise.md` returns your raise plan to anyone who asks, including the sentence that $5M is seed-sized and may not be justifiable at your stage.

Publicly readable right now: `raise.md` (the ask, the instrument, the candid reality check), `company.md`, `pitch.md` (including your prepared answers to hostile investor questions), `investors.md` (pipeline template), `tasks.md`.

Anyone you pitch — investor or partner — can read your internal assessment of your own weaknesses before the meeting. Sync(d) can read it before this negotiation.

**This file has deliberately not been committed.** It contains your negotiating position and a discussion of a potential IP conflict with your employer, and it must not be published.

Remediation, in order:

```bash
printf '\n# Business/fundraising brain — never publish\ncofounder/\n' >> .gitignore
git rm -r --cached cofounder/
git commit -m "chore: stop tracking cofounder/ business docs"
```

That stops future publication and keeps your local files. It does **not** erase history — the old versions stay in the public commit log and in any clone or fork. To remove them properly you need a history rewrite (`git filter-repo`) and a force-push, and even then you should assume anything already public has been seen. Decide whether that is worth doing; at minimum, do the three commands above.

### 1.1 🔴 The repository is public and MIT-licensed

`github.com/bnpaulsen18/SAGA-CRM` is **public**, licensed **MIT**, copyright asserted personally to you.

MIT grants anyone — including Sync(d) — an irrevocable right to use, copy, modify, sublicense and **sell** the software, requiring only that the copyright notice be preserved. As a legal matter, they do not need a licence from you to build on the SAGA codebase today.

You cannot un-publish this. Any version already pushed stays MIT permanently. What you *can* do, as sole copyright holder:

- **Relicense going forward.** You own the copyright (93 commits, one author), so future versions can be proprietary or dual-licensed. Prior commits remain MIT.
- **Make the repo private.** Stops further disclosure; does not revoke what is out.
- **Recognize what MIT does *not* cover:** the SAGA name and mark, `sagacrm.io`, the live deployment and its data, any customer relationships, and your own expertise. Those retain their value.

Practical risk today is low — 0 forks, 0 stars, nobody has taken it. The *negotiating* risk is high, because the first thing competent counsel on the other side will do is check the licence. Walking in believing you control the code, and being shown otherwise mid-negotiation, is a bad position. Fix it before the conversation, on your own terms.

### 1.2 🔴 You may not fully own SAGA — you work at Sync(d)

You are being offered a partnership for a product you built, by your own employer. Most technology employment agreements include an invention-assignment clause. The usual employee carve-outs require that the work was done **entirely on your own time**, **without employer equipment or confidential information**, and — the clause that bites hardest — that it **does not relate to the employer's business or anticipated R&D**.

SAGA is an AI-agent product for a business workflow. Sync(d) builds AI-agent products for business workflows. That "relates to the employer's business" test is exactly where this gets argued. Facts that will matter and that I cannot determine:

- Which state's law governs your employment agreement (protections vary enormously — California, Washington, Illinois and others have statutory carve-outs; some states have none)
- What your specific agreement says
- Whether any Sync(d) equipment, accounts, time, or confidential information touched SAGA
- That the repo's history runs 2025-11-26 → present, sole author, personal email and personal GitHub — helpful facts for you, but not dispositive

There is a second entanglement: the Sync(d) nonprofit pitch deck and the Copilot Studio build guides were produced *for Sync(d)*. Those are plausibly Sync(d)'s work product. SAGA predates and is separate from them — **keep that boundary clean and documented.**

A third, and the one most likely to be overlooked: **every hour you spend building SAGA-on-Dynamics while employed strengthens their claim.** Do not let "he built the Dynamics version" become the argument that the Dynamics version was always theirs. Any exploratory build should be short, timeboxed, on personal equipment and personal time — or done by Sync(d) engineers under a written agreement.

**Get an employment/IP attorney to read your agreement before you negotiate.** Not after a term sheet. This single step has more expected value than everything else on this page.

### 1.4 🟡 Your public docs contradict your pricing

Three different pricing models are visible in the public repo right now: `README.md`/`CLAUDE.md`/`ARCHITECTURE.md` say **$100/mo + 2%**; `docs/SAGA-CRM-LAUNCH-PRD.md` says **$49/mo**; `docs/SAGA-FULL-VISION-ROADMAP.md` says **$49 / $149 / $399 tiers**. The roadmap also specifies scope that is not the product (Printful merch, n8n social automation, Twilio SMS).

Cheap to fix, and worth fixing before anyone does diligence — a partner or investor reading the repo currently finds three answers to "what do you charge."

### 1.3 🟡 Sync(d) is a services business, and its customers are not yours

Sync(d) sells AI operationalization services, Dynamics 365 implementation, training, and managed services to **small and mid-sized businesses running Dynamics 365**. The Forge products appear to be solution accelerators inside that services motion, not standalone SaaS.

Two consequences:

**A revenue share on "product revenue" may capture almost nothing.** The Forge pages carry no pricing, no packaging, and no self-serve purchase — the only call to action is "Schedule a Demo and an AI Assessment." That is a **services sales motion**, not a product catalogue. If there is no discrete SKU price for CaseForge, there will be no discrete SKU price for SAGA either, and a percentage of "module revenue" attaches to a number that does not exist as a line item.

If SAGA's real contribution is *winning nonprofit Dynamics engagements*, the money is in assessment, implementation and managed-services fees. Tie your share to **the engagement value**, or to a **per-customer fee**, or take **equity** — not to an internal transfer price the other side defines and controls.

**You do not need Sync(d) to reach Microsoft's channel.** Microsoft's commercial marketplace (AppSource / Azure Marketplace) charges a **3% transact fee**, cut from 20%. Any ISV can publish. So the thing you would be paying a 20–40% channel margin for is *not* platform access — that is available to you directly at 3%. What Sync(d) genuinely brings is Dynamics delivery capability, an existing SMB customer base, and sales motion. Price the deal for **that**, and only on deals they actually source.

**There is a real customer-segment mismatch.** SAGA's ICP is a small fundraising team at $100/month. Dynamics 365 implementations are typically five- to six-figure engagements aimed at SMBs with IT budgets. A three-person nonprofit does not buy Dynamics, Copilot Studio capacity, and an implementation project. Migrating SAGA onto this stack moves it **upmarket, away from the customers it was designed for.**

That may be fine — mid-size and large nonprofits are a real, better-funded market — but it is a **repositioning, not a port**. Microsoft's nonprofit grants and Cloud for Nonprofit change this math somewhat; see the licensing section once the technical analysis lands.

---

## 2. What a partnership could look like

Six structures, roughly ascending in how much you give up. Benchmarks are market-typical ranges, not quotes.

| # | Structure | You keep | Typical economics | Best when |
|---|---|---|---|---|
| 1 | **Referral** | Everything | 10–20% of first-year contract value, one-time | You want to stay fully independent and test demand |
| 2 | **Reseller / channel** | Product + IP | Sync(d) takes a **20–40% margin**; you keep the rest, recurring | SAGA stays as-is and Sync(d) sells it into their base |
| 3 | **Co-sell / joint GTM** | Product + IP | Split on jointly-sourced deals; commonly **70/30 to whoever sourced it** | Both sides bring pipeline |
| 4 | **OEM / embedded licence** | IP ownership, licence it out | **2–8% of net revenue** typical for embedded software; up to ~10% where the component carries the value. (Salesforce's own OEM programme is ~25%, but that is a platform vendor embedding *its* licence — the opposite direction, not your comparable.) | SAGA becomes a module inside a Sync(d) platform |
| 5 | **Joint venture / new entity** | Defined equity % | Negotiated; watch control and funding obligations | Both sides invest materially |
| 6 | **IP sale / acquihire** | Cash, maybe equity + a role | Pre-revenue product acquisitions are highly subjective — commonly low-to-mid six figures for working IP plus the founder, with earnouts | You want out of the operating burden |

**Where your situation actually sits.** With no confirmed revenue, no confirmed customers, and a public MIT-licensed codebase, straight percentage-of-a-big-number arguments will not hold up. Your leverage is not the code — it is:

1. **You.** You are the only person who has thought hard about nonprofit donor retention as an agent problem, and you have the design worked out to build-guide depth.
2. **The domain thesis and the sector wedge**, which Sync(d) currently lacks.
3. **The brand, domain and live product**, which MIT does not cover.
4. **Speed** — you can get them into a new vertical faster than they can get there alone.

That combination argues for a structure that pays you for **ongoing contribution and market access**, not a one-time IP transfer. Realistically: a **hybrid** — a role or retainer for the build, plus a revenue share with a floor, plus either equity or a defined buyout if it becomes a real product line.

### The 2% platform fee survives — but Stripe becomes a permanent exception

Correcting an earlier assumption of mine: the 2% **does** survive. It is a Stripe `application_fee_amount`, a Stripe-side concept with no CRM dependency, and `lib/stripe/connect.ts` ports almost verbatim to an Azure Function behind a custom connector.

The catch is that **Microsoft has no marketplace-payments equivalent**, so SAGA-on-Microsoft is a Power Platform solution with a non-Microsoft dependency sitting on the revenue-critical path. That is defensible, but it should be disclosed early rather than discovered late. Note also that Microsoft's own Stripe integration for nonprofits (the Fundraising & Engagement tokenization controls) **retires 2026-12-31** along with the rest of that product.

What genuinely weakens is the *justification*: "we are the whole platform for $100" becomes "we are $100 on top of your Microsoft bill, plus 2%."

---

## 3. Term-sheet checklist — the parts that matter more than the percentage

Founders negotiate the percentage and lose on the definitions. In rough order of how much money each one moves:

1. **Percentage of *what*.** Gross revenue, net revenue, or profit? **Never accept profit-share** — the other side controls the costs. Insist on gross or narrowly-defined net with an explicit, closed list of permitted deductions.
2. **Attribution when bundled.** If SAGA ships inside a platform bundle or an implementation engagement, how is its share computed? Demand a written allocation methodology — a fixed per-seat/per-tenant amount, a stated list price, or a percentage of the total engagement. Without it, a bundled sale attributes zero to you. **This is the single most commonly litigated term in revenue shares.**
3. **Term and survival.** Does it pay for the life of the product, or three years? Does it survive termination for revenue already booked?
4. **Minimum guarantee / floor.** An annual minimum regardless of sales. This is what converts "we'll see how it goes" into a real commitment, and it is the cleanest test of whether they actually intend to sell it.
5. **Exclusivity — both directions.** Can you sell SAGA elsewhere? Can they build a competing nonprofit module? Any exclusivity you grant should be **conditional on performance minimums** and time-limited.
6. **IP ownership of the migrated build.** Who owns the Dataverse solution, the Copilot Studio agents, the Power Automate flows? Default is whoever builds it. Negotiate this explicitly.
7. **Audit rights.** The right to inspect the books that produce your number, at their cost if a material discrepancy is found.
8. **Change of control.** If Sync(d) is acquired, does your deal survive, accelerate, or die?
9. **Termination and reversion.** If it ends, do you get the IP back — including the migrated version — and can you keep selling?
10. **Trademark and naming.** Does it ship as SAGA, or as DonorForge? If the brand disappears, so does your independent option.
11. **Your employment.** How does this interact with your job? A partnership between you and your employer needs the employment side papered separately and cleanly.

---

## 4. The conflict you should name out loud

You are on both sides of this table. That is not disqualifying, but it must be handled explicitly or it will poison the relationship later:

- **Disclose in writing** that you are the SAGA owner and a Sync(d) employee, and get written acknowledgement.
- **Ask who at Sync(d) is negotiating opposite you**, and make sure it is not your direct manager.
- **Get your own counsel.** Sync(d)'s lawyer does not represent you, however friendly the founders are.
- The founders being "great to lean on" is genuinely valuable — and is *not* a substitute for a written agreement. Good relationships produce good deals precisely because the paperwork is done properly.

---

## 5. What this does to the $5M raise

Read `raise.md` alongside this. The existing reality check already flags $5M as seed-sized for pre-seed with traction still `<!-- FILL IN -->`.

A partnership cuts both ways:

**Helps:** a channel partner with an existing SMB Dynamics customer base is real distribution, and distribution is what pre-seed investors most doubt. A signed agreement with revenue minimums is evidence.

**Hurts, badly, if structured wrong:** venture investors will not fund a company whose core product is a module inside someone else's platform, whose IP ownership is contested, and whose codebase is MIT-licensed. Any one of those is a diligence problem. All three together is a pass.

**The honest fork:**

- **Path A — SAGA stays a company.** Sync(d) is a channel partner or reseller (structures 1–3). You keep IP, brand and the direct product. The raise stays alive. Migration is optional, and probably becomes a *second* deployment target rather than a replacement.
- **Path B — SAGA becomes a Sync(d) product line.** You get revenue share and/or equity and a role. This is a good outcome for you personally and it likely ends the independent raise. Be at peace with that before signing, not after.

Deciding which of these you want, and being explicit about it in the room, is worth more than any percentage point you could negotiate.

---

## 6. Recommended sequence

### Gate 0 — IP clearance (blocking, days, no code)

| Task | Done when |
|---|---|
| Pull employment agreement + invention-assignment + moonlighting policy | Documents in hand |
| **Independent** attorney review (not Sync(d)'s counsel) | Written opinion on who owns SAGA today |
| Ask Sync(d) for the proposed deal shape **in writing** | Their proposal exists on paper |
| Mutual NDA before deeper technical disclosure | Signed |
| Decide repo visibility + forward licence | Decision recorded |

**Nothing below starts until this clears.** If they won't put a shape in writing, that is itself the answer.

### Phase 0 — the cheap test (2–3 weeks, hard cap ~40 founder-hours)

Two tracks that genuinely parallelize because they consume different kinds of time.

**0A — Demand test (~10 hrs, calendar-bound).** Three to five real nonprofit fundraisers. Show the existing sagacrm.io demo and the four agent pages. No code. Ask what they pay today, whether first-year retention is a problem worth paying to fix, and capture their **actual current CRM licence costs** (that feeds the pricing question).

> **This is the most valuable thing in the entire partnership.** Sync(d) has customers; you have never validated demand. Even if the deal goes nowhere, five real fundraiser conversations are worth more to SAGA right now than a Dataverse environment.

**Kill criterion:** if none will name a budget line, neither path is worth pursuing yet.

**0B — Throwaway platform spike (~25 hrs, timeboxed, deleted after).** Build **Major-Gift Signal only** — internal-only, purely deterministic, worst case is a fundraiser reads a bad brief. Pass/fail:

- The three gates reproduce `lib/donors/scoring.ts` results **exactly** on the same fixtures — including the deliberate silent controls (Thomas Reed 8 gifts/1.1×, James Cardoso 1.4×). **If the controls fire, the platform cannot hold the gates.**
- A nightly run over ~5,000 synthetic donors finishes in a maintenance window, with the **per-run cost written down in dollars**.
- You can state in one paragraph where deterministic scoring actually lives on that stack, and whether it is unit-testable.

**Exit:** a one-page memo — demand evidence, spike verdict, cost per run, go/no-go.

### Phase 1 — Terms, before any production build

Negotiate §3's checklist into a signed term sheet. **No production build starts before that signature.** "Let's prove it works and then paper it" is how a single founder ends up having donated a product.

### Phase 2 — Thin vertical slice

One agent, one real nonprofit's data, in that customer's own tenant.
**Exit criterion:** a real fundraiser at a real nonprofit reads a real brief and acts on it, and says it was useful. Not a demo. Not seeded data.

### Phase 3 — Paid pilot

Three committed orgs, 90 days, Welcome Series added. Instrument first-gift-to-second-gift conversion. Report it as a pilot result **with an n**, never as a product claim. This is also the first real number for `company.md`.

---

## 7. Two architectural constraints that must survive

**Determinism must not move into the model.** `docs/SagaAgents.md` §2 records the single most important design decision: the classifier is arithmetic, and the LLM only decides phrasing. Copilot Studio is conversational-agent-first, and the platform's natural pull is to hand ranking to the model. If that happens you lose determinism, testability, and cost control at once. **`lib/donors/scoring.ts` must port as code — an Azure Function or plug-in — never as a prompt.**

**Return Series fires on a non-event.** Nothing happens when a donor stops giving, so there is no event trigger to bind to. It needs a scheduled flow that goes looking. Worth confirming during the spike that this is expressible.

---

## 8. Keep, rebuild, abandon

**Let the platform provide (genuinely disposable — this is not a loss):** contacts/donations/campaigns CRUD, reports (Power BI beats anything hand-built), CSV import (dataflows), auth (Entra ID), and — with relief — the manual per-query tenant scoping in `lib/prisma-rls.ts`, which is the app's largest standing security liability.

**Keep and port — this is the whole asset, and it is small, which is the point:**

- **`lib/donors/scoring.ts`** — pure, no dependencies. The cadence-relative lapse logic and the `atStake` replacement-cost multipliers are the differentiated thinking.
- **`docs/SagaAgents.md`** — the gates, thresholds, coordination rules and guardrails. Platform-independent and the most valuable artifact in the repo. It is also the easiest thing to give away for free in a friendly exploratory meeting. **Treat it as negotiating material behind an NDA.**
- **`scripts/seed-agent-demo.ts` fixtures** — the silent controls are your regression suite for any port.
- **Brand, name, sagacrm.io, the design system.** Keep, and keep *owning*.

**Abandon regardless of path:** `lib/agents/` (unrelated dev tooling whose "31 agents" README misleads every technical reader) and `docs/SAGA-FULL-VISION-ROADMAP.md` (documented scope creep with contradictory pricing — see §1.4).

**Keep www.sagacrm.io running throughout, on Vercel, independent.** It costs almost nothing and it is your only proof of independent existence — and your actual exit path. Do not fold it into a migration or take it down as a gesture of commitment.

---

## 9. Reversibility

**One-way doors:**

1. Signing an IP assignment or broad "work product" acknowledgment. Permanent. Never in the same week as an exciting conversation.
2. Disclosing `docs/SagaAgents.md` in full without an NDA. (Partly rung already — see §1.1.)
3. Shutting down sagacrm.io or letting the domain lapse.
4. Telling investors your company is now a feature of your employer's product.
5. Non-compete or exclusivity without a field-of-use carve-out and a hard expiry.
6. Migrating a real nonprofit's data into **Sync(d)'s** tenant rather than the customer's own. That org is theirs from that moment.

**Two-way doors — move fast on these:** the throwaway spike, customer interviews, keeping sagacrm.io alive, porting `scoring.ts` (pure code ports back as easily as out), a time-limited non-exclusive pilot.

**Write the pre-nup into the term sheet now:** IP **licensed, never assigned**, reverting on termination; perpetual royalty-free licence to any jointly built SAGA-specific components; customer non-solicit carved out for orgs **you** sourced; 18–24 month term with exclusivity that **expires automatically** unless renewed against revenue minimums; guaranteed data portability for the nonprofit; no non-compete in "donor CRM for nonprofits" — and if they insist, it is paid for and expires in ≤12 months.

---

## 10. Risk register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Sync(d) has a claim to SAGA under invention assignment | Medium-High | **Fatal** — kills deal and raise together | Gate 0, independent counsel, signed carve-out |
| R2 | You do the work and no signed deal materializes | **High** — the default outcome of "let's explore it" | High | No build before signed terms; 40-hr Phase 0 cap; they fund and staff the platform work |
| R3 | Nobody actually wants the product — zero validated customers | Unknown, and that is the problem | Fatal to both paths | Phase 0A. Cheapest and most important item here |
| R4 | The raise dies with nothing replacing it | High if the add-on path is taken | High | Decide §5 deliberately; pause investor outreach until Gate 0 clears |
| R5 | Spec appropriation — they build from your design | Medium | High | NDA before deeper disclosure; note MIT already limits your protection |
| R6 | Platform cannot hold the architecture (determinism, cost, guardrails) | Medium | Medium-High | Phase 0B, with the silent controls as pass/fail |
| R7 | Dynamics licensing prices out SAGA's ICP | High | High to the product thesis | Capture real licence costs in 0A; may force a field-of-use split |
| R8 | The 2% fee does not survive the platform | High | Medium — it has never earned a dollar | Model unit economics without it before signing |
| R9 | Founder burnout — job + startup + raise + migration | High | High | Hard Phase 0 cap; explicit "pick one" at the gate |
| R10 | Demo numbers presented as traction in partner conversations | Medium | Medium-High | Same rule as with investors: Hope Foundation's $11,840 MRR / 318 sustainers / 41% retention are labelled sample data everywhere. A future partner *or employer* is not a cheaper audience for a credibility mistake |

---

## 11. Migration analysis (technical)

### 11.1 The market timing is genuinely good — this is the strongest argument *for* the deal

**Microsoft is vacating this exact slot.** Dynamics 365 Fundraising & Engagement — Microsoft's first-party nonprofit fundraising app — retires **2026-12-31**, and Microsoft is explicitly directing ISVs to build nonprofit solutions on Dataverse instead. The **Common Data Model for Nonprofits is not retiring** and was updated 2026-01-23.

So there is a real, dated opening for a nonprofit fundraising product on Dataverse, and Sync(d) is a Dynamics partner. That is a market argument, not a technical one, and it is the best reason on this page to take the meeting seriously.

The sober reading of the same fact: Microsoft tried first-party nonprofit fundraising and gave up.

### 11.2 🔴 Licensing dictates the architecture — and it breaks self-serve

Microsoft's nonprofit eligibility terms state that a for-profit third party **may not register on a nonprofit's behalf**, and that nonprofit licences **cannot be shared, transferred, rented, or resold**. That single rule decides the architecture:

| Model | Who pays Microsoft | Cost per 5-person nonprofit | $100/mo survives? |
|---|---|---|---|
| SAGA hosts nonprofits in SAGA's tenant | **SAGA**, at commercial rates | **$175+/mo in seats alone** | ❌ **Gross-margin-negative on day one** |
| Nonprofit owns its tenant, SAGA ships a managed solution (AppSource ISV) | **Nonprofit**, at nonprofit rates | **~$20–90/mo** | ✅ Yes — SAGA's $100 sits on top |

Nonprofit pricing is genuinely good: Power Apps **free up to 10 users** then $2.50/user, Power Automate Premium $3.75/user, Microsoft 365 Business Basic free up to 300 seats, $2,000/yr Azure credits.

**But the viable model kills self-serve signup.** "Sign up at sagacrm.io" becomes "ask your Microsoft admin to install a managed solution." For a $100/mo product sold to three-person fundraising shops whose funnel *is* the product, that is a go-to-market one-way door — and it is the hard-numbers confirmation of the segment mismatch in §1.3.

### 11.3 The Copilot Studio bill is 70% of your price

Copilot Studio bills in credits — $200/pack for 25,000 credits, or ~$0.01/credit pay-as-you-go. A generative answer is 2 credits; an agent action is 5.

Modelled across all four agents: **≈7,000 credits/month/nonprofit ≈ $70/mo** — against a $100 product. And the credit pack is **per tenant**, so in the viable model every nonprofit buys their own.

**Recommendation: keep the drafting layer on Claude**, called from an Azure Function / Custom API, and use Copilot Studio only where you actually want a conversational surface in Teams. `lib/ai/client.ts` already has exactly this shape. Being "on Microsoft" means Dataverse, Power Platform and Entra — it does not require routing every draft through Copilot Studio, and the economics say it shouldn't.

Worth raising with Sync(d) directly, since the pitch deck assumes Copilot Studio end-to-end.

### 11.4 Data model: the fit is better than expected

Roughly **9 of 16 Prisma models map to standard Dataverse or NCDM tables at low cost**; 3 (the NextAuth models) are pure deletions. Contact → Contact and Donation → the NCDM transaction entity are near-exact.

NCDM is a **superset** of SAGA's domain. It brings, free: hard *and soft* credits (SAGA models neither), designations and credit plans, planned giving, memberships, recurring payment schedules, grantmaking, impact/outcome tracking, and OFAC sanctions screening. `Campaign.raised` becomes a platform-maintained rollup instead of a float you keep in sync.

The four hard ones are `Organization` (an architecture decision, not a data problem), and the three email models — bulk email is effectively blocked because Customer Insights–Journeys runs **$1,000–1,700/tenant/month**, 10–17× SAGA's entire price. Use Azure Communication Services Email instead (~$0.00025/message), or simply keep Resend behind a custom connector.

### 11.5 The scoring module ports well — and the architecture gets *more* important

`lib/donors/scoring.ts` is pure, dependency-free, and ports near-1:1 to a **C# class library**, referenced by both a Dataverse plug-in (per-record) and an Azure Function (whole-file batch), exposed to flows via a Custom API. Port the seed fixtures with it as the regression suite.

**The non-negotiable rule holds and now has a price attached:** deterministic gates must not move into the model. Copilot Studio bills per message, so running selection through the LLM is expensive *by construction* as well as non-deterministic. The classifier/drafting split SAGA already committed to is exactly right for this platform.

Two platform constraints to design around:
- **Rollup columns recalculate on a schedule** (default 12 hours). Fine for nightly agents; **breaks Welcome Series**, which must fire on the first gift immediately.
- **Power Automate flows cap at 30 days' run duration**, including Delay steps. Welcome Series' day-30 touch sits on the boundary and Return Series' day-42 touch exceeds it. Implement the sequences as a **daily state-machine advancer**, never as long-running flows with delays. (SAGA's stamp-before-send guardrail already implies stored state, so this is the design you'd want anyway.)
- **Return Series' non-event trigger** is confirmed inexpressible as a Copilot Studio event trigger. It must be a scheduled query. The Recurrence trigger exists but is the wrong instrument — it bills per wake and pushes selection into the LLM.

### 11.6 What is genuinely lost

**The design system.** Model-driven apps are themeable by **XML upload only — no custom CSS or JS**, colors and fonts under Fluent 2, and classic theming stops being honored in April 2026. SAGA's warm identity does not survive as the CRM shell; you get Dynamics with an accent color. PCF code components let you rebuild the donor signal panel, agent preview tables and charts as React islands — but they are islands inside chrome you cannot remove.

If the interface is part of your differentiation, **this is the biggest product casualty of the migration.**

**Also lost:** `PLATFORM_ADMIN` cross-org access has no home in a per-tenant model; cuid primary keys must become GUIDs (plan an ID-crosswalk table and keep it forever); per-PR preview deployments; and the 30-second deploy loop.

**Genuinely gained:** tenant isolation moves from developer discipline to platform enforcement — which retires SAGA's single largest standing security liability. Auth, MFA, SSO, audit logging and durable rate limiting all arrive free, deleting several subsystems the architecture doc currently lists as incomplete.

### 11.7 Effort

**~48–70 engineer-weeks** — 6–8 months for a 2–3 person team with real Power Platform experience, **12–18 months for one person**, plus 30–50% if nobody has shipped a Dataverse solution before.

**Minimum viable first deliverable — "Major-Gift Signal on Dataverse", 6–8 engineer-weeks.** NCDM installed, one real donor file imported, rollups for count/lifetime/last-gift, `scoreDonor()` ported to C# and run against the existing fixtures, one nightly flow applying the three gates, one model-driven view plus a PCF signal panel. Templated brief text — **no Copilot Studio, no API key, no credits**. It proves NCDM fit, scoring portability and the scheduled-selection pattern without touching payments, email or the tenancy decision.

### 11.8 Unverified — do not rely on these

The physical `msnfp_` table names come from the *retiring* F&E product; the conceptual NCDM entity list is verified but confirm names against a live install. Copilot Studio nonprofit pricing (~75% off) is third-party only. Which Power Apps SKU the "free up to 10 users" grant maps to is unconfirmed and is load-bearing for the cost floor. Two Microsoft pages disagree on nonprofit D365 pricing. Whether Power Pages' native payments support Stripe Connect destination charges could not be confirmed — assume not.

---

## 12. 🔴 Fix before anyone does technical diligence

A security audit of the current codebase turned up issues that a competent technical partner **will** find. Three verified directly:

| | Issue | Status |
|---|---|---|
| **C1** | `app/api/stripe/connect/authorize/route.ts` gates only on "has a session with an org" — **no role check**. A read-only VIEWER can bind a new Stripe payout account and redirect all future donations. `disconnect` correctly requires ADMIN, so they can change where the money goes but not change it back. | ✅ Verified |
| **H2** | `app/api/stripe/webhook/route.ts:155` — `prisma.campaign.update({ where: { id: metadata.campaignId } })` with **no `organizationId`**. The only genuinely unscoped mutation in the codebase; allows a cross-tenant write. | ✅ Verified |
| **H7** | `app/api/test/route.ts` is **unauthenticated**, returns organization and user counts, and leaks raw DB error text. | ✅ Verified — **and live in production** |

**`https://www.sagacrm.io/api/test` currently returns `{"organizations":1,"users":1}` to anyone.** That endpoint publicly discloses that SAGA has one organization and one user. Combined with a public `cofounder/raise.md` asking for $5M, that is a diligence problem anyone can find with a browser. **Delete the route today.**

Also flagged and worth knowing before the conversation: the auth library (`next-auth 5.0.0-beta.30` / `@auth/core 0.41.0`) carries critical advisories including one about existence-based auth checks failing open — which is exactly this codebase's authorization pattern, used at every API route. `fixAvailable: true`. Login has no rate limit or lockout (register and password-reset do). Sessions are 30-day JWTs whose role and org are frozen at login, so a demotion or password reset does not revoke access. VIEWER is not actually read-only for contacts. Any authenticated user can export the entire donor database with no role check and no audit entry. And the three public newsletter routes — including **unsubscribe** — are hard-broken by an auth gate, which is a CAN-SPAM exposure rather than just a bug.

**What is genuinely strong and worth pointing at during diligence:** the branded `TrustedOrgId` compile-time guard, the demo org resolved by a DB-unique EIN with zero input, explicit `select` allowlists on every public-surface query, raw-body webhook signature verification, discarding Stripe OAuth tokens rather than storing them, bcrypt cost 12, clean secret hygiene with no leak anywhere in git history, and the fail-closed `?? '__no_such_org__'` sentinel now applied consistently across 45 sites with **zero** `|| undefined` regressions remaining.

The migration security checklist — 40 numbered, testable guarantees the Microsoft build must satisfy, with the ones that are *weaker today* marked so they get fixed rather than faithfully reproduced — is the right artifact to hand a Microsoft-side architect. It exists; ask for it when you need it.
