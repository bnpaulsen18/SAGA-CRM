# SAGA CRM

**The AI-native donor CRM for nonprofits.** SAGA helps small fundraising teams keep the donors they already have.

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io)

🔗 **Live:** [www.sagacrm.io](https://www.sagacrm.io)

> **New here (human or AI)?** Start with **[CLAUDE.md](CLAUDE.md)** for orientation, **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for how it's built, and **[cofounder/](cofounder/)** for the business/fundraising context.

---

## What is SAGA?

SAGA is a multi-tenant SaaS web app: a donor CRM built around **action**, not data entry. The long-term product is a set of AI agents that surface each day's highest-impact donor actions (e.g. a "Morning Brief") and draft outreach in the fundraiser's own voice — approve and send. It's a pre-seed-stage company.

**Pricing:** one plan — **$100/month + a 2% platform fee** on donations processed (no tiers yet).

## Status (honest)

| Area | Status |
|---|---|
| Marketing site (landing, pricing, about, contact, security, legal) | ✅ Live |
| Auth (register, login, onboarding, password reset) | ✅ Live |
| CRM: contacts, donations, campaigns, reports, settings, CSV import | ✅ Live |
| Light/dark theming | ✅ Live |
| Public donation checkout | 🚧 Placeholder — not built |
| Live Stripe payments | 🚧 Keys not yet configured |
| AI agents (the donor-facing agents) | 🚧 Not built — requires `ANTHROPIC_API_KEY` (today's "AI" is templated) |

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
lib/          Server logic: auth, prisma-rls, stripe, email, security, reports, ai, agents
prisma/       schema.prisma (16 models)
docs/         ARCHITECTURE.md + ops/ + brand/ + setup guides
cofounder/    business & fundraising brain (company, pitch, raise)
scripts/      ops + seed scripts
public/       static assets
```

## Documentation

| Doc | Purpose |
|---|---|
| **[CLAUDE.md](CLAUDE.md)** | Orientation + load-bearing project rules (read first) |
| **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** | How SAGA is built (stack, data model, auth, payments, AI) |
| **[docs/SETUP.md](docs/SETUP.md)** / **[docs/GETTING-STARTED.md](docs/GETTING-STARTED.md)** | Local setup |
| **[docs/ops/](docs/ops/)** | Deployment, Vercel, OAuth, Sentry, database guides |
| **[cofounder/company.md](cofounder/company.md)** | What SAGA is + business model (investor-facing) |

## Security

NextAuth v5 sessions with role-based access (`PLATFORM_ADMIN` / `ADMIN` / `MEMBER` / `VIEWER`). Multi-tenant isolation is enforced in application code — every query is scoped to the user's `organizationId` (fail-closed), and Postgres RLS is deny-all to lock the data API. Payments run through Stripe (we never store card numbers); secrets live in `.env*` (never committed). See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for details.

## License

See [LICENSE](LICENSE).

---

Built for nonprofits making a difference.
