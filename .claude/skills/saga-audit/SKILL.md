---
name: saga-audit
description: >-
  Organize the SAGA repo and audit its code for security and correctness with a
  confidence score on every finding. Use this whenever the user wants to "clean
  up / organize the SAGA files", map where things live, check the code for
  vulnerabilities or insecurities, sanity-check that a fix actually worked, or
  get a confidence rating on whether code is accurate and safe — even if they
  don't name a specific file. Triggers on "organize my saga files", "audit the
  code", "is this secure", "check for vulnerabilities", "did my fix hold",
  "verify the improvement", "how confident are you this is right", or any
  request to tidy the project and grade its code quality/security. Reporting is
  always safe to run; file moves and code fixes only happen after the user
  approves them.
---

# SAGA Audit

Two jobs in one skill, run independently or back to back:

1. **Organize** — build a clear map of the repo, then propose (and, on approval, execute) file moves that make it cleaner.
2. **Audit** — analyze the code for security holes and correctness bugs, attach a **confidence score** to every finding, verify whether earlier improvements actually held, and apply fixes **only after the user approves them**.

The guiding rule: **reading and reporting is always safe and needs no permission; anything that changes files on disk — moving them or editing them — is proposed first and executed only on an explicit yes.** This keeps a live, deployed repo safe.

Before doing anything, read `CLAUDE.md` at the repo root — it holds the load-bearing rules (tenant isolation convention, no remote `@import`, pricing, demo-data honesty). Findings and moves must respect it.

---

## When the user asks, figure out which job(s) they want

- "organize / clean up / where do my files live" → **Organize** (Part 1).
- "audit / secure / vulnerabilities / bugs / confidence / did my fix work" → **Audit** (Part 2).
- "do the whole thing" / unclear → run **Organize first, then Audit**, and say so.

Don't ask a long interview. Pick the obvious interpretation, state it in one line, and go.

---

## Part 1 — Organize

### Step 1: Inventory (always safe, no approval needed)

Scan the repo and produce a written map. Use `Glob`/`Grep`/`Read`; do not move anything yet. Group what you find into SAGA's real areas:

| Area | What lives there |
|------|------------------|
| App routes | `app/**` (pages, API routes, server actions) |
| Components | `components/**` |
| Library / logic | `lib/**` (auth, prisma, agents tooling, utils) |
| Data model | `prisma/**` |
| Business brain | `cofounder/**` (pitch, raise, tasks — the founder docs) |
| Docs | `docs/**` (ARCHITECTURE, SagaAgents, setup) |
| Config / infra | `.claude/**`, `*.config.*`, `.env*` (list, never open secrets) |
| Loose / uncategorized | anything at the root or misfiled |

Report it as a short tree plus a table. Flag specifically:
- **Loose files** at the repo root that belong in a folder.
- **Duplicates / near-duplicates** (e.g. the ~10 misleadingly-named logo files — the real one is `public/SAGA_mark.png`).
- **Stale / orphaned** files: docs referencing removed features, `*-old`, `*-copy`, scratch files, untracked `??` files from `git status`.
- **Misfiled** files (a doc in `components/`, a component in `lib/`).

### Step 2: Propose moves (still no changes)

Turn the flags into a concrete move list. For each proposed move give: `from → to`, a one-line reason, and a **risk note** (does anything import this path? will a move break a build?). Grep for imports/references before proposing — a moved component with live imports must have those updated in the same batch, or it's not a safe move.

Rank moves: **safe** (untracked scratch, obvious duplicates, docs) → **needs-import-updates** (code with references) → **leave alone** (anything load-bearing you're unsure about).

### Step 3: Execute only what's approved

Present the list and wait for the user to pick. Execute exactly what they approve — nothing more. After moving code, update every import you identified and run `npx tsc --noEmit` to confirm the tree still typechecks. Never move `.env*`, never delete files (propose deletions as a separate list for the user to handle), never touch `public/SAGA_mark.png`.

---

## Part 2 — Audit (security + accuracy, with confidence scores)

### Step 1: Delegate the deep read to the existing review agents

Don't re-derive what the repo already has specialists for. Spawn both in the same turn (they're read-only):

- **`saga-security-reviewer`** — auth/session, Stripe webhook verification + idempotency, server-side amount validation, IDOR/authorization on every route, secrets & `NEXT_PUBLIC_` boundaries, input validation, PII, rate limiting.
- **`saga-code-quality`** — type safety, error/loading/empty states, race conditions, dead/duplicate code, server-vs-client split, Prisma correctness, N+1 queries, missing pagination, build/typecheck status.

Scope them to what the user asked about (a file, a route, a diff) when they were specific; otherwise let them sweep. Tell the user you've dispatched them so the wait is legible.

If the agents are unavailable, do the same read yourself using their checklists above — but prefer the agents; that's what they're for.

### Step 2: Score every finding

The two agents return ranked findings. Your added value is a **confidence score (0–100)** on each one, so the user knows what's real versus a maybe. Score two things per finding and report both:

- **Severity** — critical / high / medium / low (how bad if true). Keep the agents' ranking.
- **Confidence** — how sure you are the finding is real and correctly diagnosed, using this rubric:

| Band | Score | Meaning |
|------|-------|---------|
| Certain | 90–100 | Reproduced or proven from the code path — e.g. a query scoped `organizationId: x \|\| undefined`, a webhook with no signature check. No judgment call. |
| Strong | 70–89 | Clear from reading, but depends on a config/runtime value you couldn't fully see (env var, deploy setting). |
| Plausible | 40–69 | Real risk pattern, but the exploit needs conditions you can't confirm, or a mitigation might exist elsewhere. |
| Speculative | < 40 | Smell / worth a look; you'd verify before acting. Say what would confirm or kill it. |

State the evidence behind the score in one line. A confident finding cites the exact code path; a low one names what's missing. **Never inflate confidence to sound decisive** — a well-calibrated 55 is more useful to the user than a fake 95.

For a whole-file or whole-repo "is this accurate/safe?" ask, also give a **rollup confidence**: one number for "how much I'd trust this code in front of investors with real donor money," with the two or three findings dragging it down. Anchor it — 100 isn't "no findings," it's "I read the risky paths and they hold."

### Step 3: Verify improvements (did the fix actually hold?)

When the user says they fixed something, or a past session recorded a fix (check Claude memory and `git log`), don't take it on faith — **verify**:

1. Read the current code at the spot the finding named.
2. Confirm the fix is present **and** correct (a wrapped-but-still-bypassable check doesn't count).
3. Check it didn't just move the bug (e.g. amount validation added to one route but not the sibling route).
4. Report per fix: **Held ✅ / Partial ⚠️ / Regressed ❌**, with a confidence score and the line that proves it.

Use `git diff` / `git log -p` on the relevant file to see what actually changed versus what was claimed. If a prior audit report exists in the workspace, diff against its findings so "what's new, what's fixed, what's still open" is explicit.

### Step 4: Fixes — proposed, applied only on approval

For each finding worth fixing, write the concrete fix (the diff or the exact change) but **do not apply it yet**. Present them grouped by severity with their confidence scores. The user picks which to apply. Then:

- Apply exactly the approved fixes.
- Re-run Step 3 verification on each one so you can say it held.
- Run `npx tsc --noEmit` (and `npm run build` if the change is non-trivial) to keep the tree green.
- Report what changed, what still passes, and what you deliberately left.

Never apply a fix the user didn't approve, never "improve" adjacent code unasked, and if a fix touches auth/payments/tenant isolation, call that out loudly before applying — those are the paths that hurt in a demo or with real money.

---

## Output format

Lead with a one-paragraph verdict, then the details. Use this shape:

```
# SAGA Audit — <scope> — <date>

## Verdict
<2–3 sentences: overall state, rollup confidence, the single most important thing.>

## Organize  (if run)
- Inventory: <tree / table>
- Proposed moves: <ranked list, from → to, reason, risk> — awaiting approval
- Executed: <what was moved, typecheck result>

## Security & correctness findings
| # | Severity | Confidence | Finding | file:line | Evidence | Fix |
Ranked critical → low. Confidence per the rubric.

## Verified improvements  (if any fixes to check)
| Fix | Held? | Confidence | Proof (file:line) |

## Proposed fixes — awaiting approval
<grouped by severity, each with its diff and confidence>
```

Keep it concrete and skimmable. The user (Beau) wants point-first, no filler — put the verdict and the scariest finding at the top, save the exhaustive list for below.

---

## Guardrails (SAGA-specific, from CLAUDE.md)

- **Tenant isolation is the crown jewel.** Any query scoped `organizationId: x || undefined` matches *every* org — that's a critical, high-confidence finding. The correct convention is `?? '__no_such_org__'`.
- **Pricing** is $100/mo + 2% platform fee. Don't flag the 2% framing as a bug; flagging "0% platform fee" copy *is* correct.
- **Demo data is fictional** (Hope Foundation, `demo@saga.app`). Never treat its numbers as real; never move or "clean up" the seed data as if it were stale.
- **Windows / OneDrive:** dev is `npm run dev` (webpack); no remote `@import` in `app/globals.css`. Don't propose changes that reintroduce those.
- **Secrets:** list `.env*` in the inventory, never open or print their contents, never move them.
- **Route params are async** in Next 16 — `await params` (server) / `use(params)` (client); flag the sync form as a real bug.
