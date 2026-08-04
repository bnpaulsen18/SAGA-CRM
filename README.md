# SAGA CRM

**The AI-native donor CRM for nonprofits.** SAGA helps small fundraising teams keep the donors they already have.

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io)

🔗 **Live:** [www.sagacrm.io](https://www.sagacrm.io)

> **New here (human or AI)?** Start with **[CLAUDE.md](CLAUDE.md)** for orientation, **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for how it's built, **[docs/SagaAgents.md](docs/SagaAgents.md)** for the four AI agents, and **[cofounder/](cofounder/)** for the business/fundraising context.

---

## What is SAGA?

SAGA is a multi-tenant SaaS web app: a donor CRM built around **action**, not data entry. The long-term product is four AI agents that watch the donor file and act on the moments that decide whether a donor gives again. It's a pre-seed-stage company.

**Pricing:** one plan — **$100/month + a 2% platform fee** on donations processed (no tiers yet).

## The four agents

Full specs, architecture diagram, and coordination rules: **[docs/SagaAgents.md](docs/SagaAgents.md)**.

| Agent | What it does | Talks to donors? |
|---|---|---|
| **Morning Brief** | Ranks the day's three highest-impact donor actions by dollars at stake and drafts the outreach | Only after a human approves each send |
| **Major-Gift Signal** | Finds donors whose giving is accelerating and briefs the assigned fundraiser before the ask | **Never** — internal only |
| **Welcome Series** | Runs a first-time donor's first 90 days in the organization's own voice | Yes, autonomously |
| **Return Series** | Wins back donors who've gone quiet — automated below a value threshold, escalated to a person above it | Yes, below the threshold |

Each agent has a page in the app — `/morning-brief`, `/major-gift-signal`, `/welcome-series`, `/return-series` — explaining how it works and showing **exactly which of your donors it would act on today**, computed live from real data.

> 🚧 **None of the four send anything yet.** The selection logic runs (that's what the agent pages show); what's missing is the drafting and sending layer, which needs an `ANTHROPIC_API_KEY` and a scheduled job runner. `docs/SagaAgents.md` marks built vs. designed in every section.
>
> ⚠️ Note that `lib/agents/` is **unrelated** developer tooling. The donor agents live in `lib/donors/`.

## Status (honest)

| Area | Status |
|---|---|
| Marketing site (landing, pricing, about, contact, security, legal) | ✅ Live |
| Auth (register, login, onboarding, password reset) | ✅ Live |
| CRM: contacts, donations, campaigns, reports, settings, CSV import | ✅ Live |
| Light/dark theming | ✅ Live |
| Public donation checkout | 🚧 Placeholder — not built |
| Live Stripe payments | 🚧 Keys not yet configured |
| Donor scoring (status, cadence, lapse, trajectory, engagement) | ✅ Live — one module, `lib/donors/scoring.ts` |
| AI agent pages (what each agent does + live preview of who it would act on) | ✅ Live |
| AI agents actually sending | 🚧 Not built — needs `ANTHROPIC_API_KEY` + a scheduled job runner |

## Tech stack

Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · Prisma · Supabase (PostgreSQL) · NextAuth v5 · Stripe Connect · Resend · Sentry · deployed on Vercel.

## Quick start

```bash
git clone https://github.com/bnpaulsen18/SAGA-CRM.git
cd SAGA-CRM
npm install

# configure environment
cp .env.example .env.local   # then fill in DATABASE_URL, NEXTAUTH_SECRET, etc.

npx prisma generate
npm run dev                  # runs `next dev --webpack` (see CLAUDE.md for why)
```

Open [http://localhost:3000](http://localhost:3000). Full setup details: **[docs/SETUP.md](docs/SETUP.md)** and **[docs/GETTING-STARTED.md](docs/GETTING-STARTED.md)**.

## Project structure

```
app/          Next.js routes (marketing, auth, dashboard CRM, api/)
components/   UI components (DashboardLayout shell, marketing SiteNav/SiteFooter, …)
lib/          Server logic: auth, prisma-rls, stripe, email, security, reports, dashboard, ai
  donors/     Donor scoring (single source of truth) + the agent catalog & previews
              (note: lib/agents/ is developer tooling — not the donor agents)
prisma/       schema.prisma (16 models)
docs/         ARCHITECTURE.md + SagaAgents.md + ops/ + brand/ + setup guides
cofounder/    business & fundraising brain (company, pitch, raise)
scripts/      ops + seed scripts
public/       static assets
```

## Documentation

| Doc | Purpose |
|---|---|
| **[CLAUDE.md](CLAUDE.md)** | Orientation + load-bearing project rules (read first) |
| **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** | How SAGA is built (stack, data model, auth, payments, AI) |
| **[docs/SagaAgents.md](docs/SagaAgents.md)** | The four AI agents — specs, architecture, coordination rules, guardrails |
| **[docs/SETUP.md](docs/SETUP.md)** / **[docs/GETTING-STARTED.md](docs/GETTING-STARTED.md)** | Local setup |
| **[docs/ops/](docs/ops/)** | Deployment, Vercel, OAuth, Sentry, database guides |
| **[cofounder/company.md](cofounder/company.md)** | What SAGA is + business model (investor-facing) |

## Security

NextAuth v5 sessions with role-based access (`PLATFORM_ADMIN` / `ADMIN` / `MEMBER` / `VIEWER`). Multi-tenant isolation is enforced in application code — every query is scoped to the user's `organizationId` (fail-closed), and Postgres RLS is deny-all to lock the data API. Payments run through Stripe (we never store card numbers); secrets live in `.env*` (never committed). See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for details.

## License

See [LICENSE](LICENSE).

---

Built for nonprofits making a difference.
