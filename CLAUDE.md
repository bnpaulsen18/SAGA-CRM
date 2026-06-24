# SAGA — AI & Contributor Orientation

> **Read this first.** This file is the front door to the SAGA project for any AI tool (Claude Code, etc.) or new contributor. It tells you what SAGA is, where the real knowledge lives, and the rules that will bite you if you ignore them.

## What SAGA is
SAGA is an **AI-native donor CRM for nonprofits** — built to help small fundraising teams keep the donors they already have. It's live at **https://www.sagacrm.io** and is a pre-seed-stage company (raising a $5M pre-seed).

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind v4 · Prisma ORM · Supabase Postgres · NextAuth v5 · Stripe Connect · Resend (email) · Sentry · deployed on Vercel.

## Where the knowledge lives (don't duplicate it — go here)
- **`cofounder/`** — the **business & fundraising brain** (company, pitch, raise, investors, tasks). Source of truth for "what is SAGA / business model / the raise." Invoke the `/cofounder` skill for founder-level work.
- **`docs/ARCHITECTURE.md`** — **how SAGA is built** (the technical answer for investors/engineers).
- **`docs/`** — setup, deployment, and ops guides.
- **`.claude/agents/`** — the review agents (design, security, code-quality, PM). Use them before shipping UI or backend changes.
- **Claude Code persistent memory** — a `MEMORY.md` index + per-fact files are maintained for this project across sessions. Consult it; it holds decisions and gotchas not obvious from the code.

## Load-bearing rules (violating these breaks things or misleads investors)
- **Demo data is fictional.** The demo org is "Hope Foundation" (login `demo@saga.app`). Its numbers are sample data — **never present them as real traction.** Real metrics in `cofounder/` are `<!-- FILL IN -->` until confirmed.
- **Pricing is $100/month + a 2% platform fee per donation** (single plan, no tiers yet). Do **not** say "0% platform fee" — that older framing was retired.
- **Tenant isolation is manual + fail-closed.** Supabase RLS is deny-all; the app connects as the owner role and filters by `organizationId` in app code. **Never** scope a query with `organizationId: x || undefined` (that matches *all* orgs) — the convention is `?? '__no_such_org__'`.
- **No remote `@import` in `app/globals.css`** — it panics Turbopack on this Windows/OneDrive machine. Fonts load via `next/font` in `app/layout.tsx`.
- **Dev uses webpack:** `npm run dev` runs `next dev --webpack` (Turbopack dev panics here). `next build` with Turbopack is fine.
- **Deploy:** `npx vercel --prod --yes`. Share **www.sagacrm.io**, not the `*.vercel.app` URL (it's deployment-protected). Keep the build green; typecheck with `npx tsc --noEmit`.
- **Next 16:** route `params` are async — `await params` (server) / `use(params)` (client).

## Honest current status (live vs. not yet)
- ✅ **Live:** the full non-AI CRM (contacts, donations, campaigns, reports, settings, CSV import), the marketing site (landing, pricing, about, contact, security, privacy, terms), auth, and light/dark mode — all deployed.
- 🚧 **Not built yet:** the 6 donor-facing **AI agents** (needs an `ANTHROPIC_API_KEY`; today's dashboard "AI" is templated heuristics), the **public donation checkout** (the current form is a placeholder), and **live Stripe payments** (test/live keys not configured).

## Conventions
Windows + PowerShell environment. Secrets live in `.env` / `.env.local` (gitignored) — never commit them. Prefer the dedicated review agents and keep changes scoped.
