# SAGA — Architecture & How It's Built

> The technical companion to `cofounder/company.md` (which covers the business). This document answers "how is SAGA built?" for engineers and technical investors. It describes the **current, real** state — aspirational/roadmap items are labeled as such.

## 1. Overview
SAGA is a multi-tenant SaaS web application: an AI-native donor CRM for nonprofits. A single Next.js codebase serves the marketing site, the authenticated CRM, and the API. Each nonprofit is an **Organization**; all data is scoped to its organization.

## 2. Tech stack
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React, TypeScript |
| Styling | Tailwind CSS v4 (warm design system + light/dark theming via `next-themes`) |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma |
| Auth | NextAuth v5 (credentials + OAuth-ready) |
| Payments | Stripe Connect (per-organization payouts) |
| Email | Resend (transactional + campaigns) |
| Monitoring | Sentry |
| Hosting | Vercel (live at www.sagacrm.io) |

## 3. Repository layout
```
app/            Next.js routes
  (marketing)   landing, pricing, about, contact, security, privacy, terms
  login, register, onboarding, forgot/reset-password
  dashboard, contacts, donations, campaigns, reports, settings, emails
  donate/[organizationId]   public donation pages (checkout not yet live)
  admin/        platform-admin area
  api/          REST route handlers (contacts, donations, campaigns, stripe, auth, agents, …)
components/      UI components (incl. DashboardLayout shell, marketing SiteNav/SiteFooter)
lib/            Server logic: auth, prisma-rls, permissions, stripe, email, security, reports, ai, agents
prisma/         schema.prisma (data model)
scripts/        ops + seed scripts
public/         static assets
```

## 4. Data model (Prisma — 16 models)
Core domain:
- **Organization** — the tenant. Holds Stripe Connect status, subscription, tax-exempt status, type.
- **User** — a team member in an organization. Role: `PLATFORM_ADMIN | ADMIN | MEMBER | VIEWER`.
- **Contact** — a donor/constituent (type + status, lifetime giving).
- **Donation** — a gift (amount, method, type, fund restriction, status, review status, receipt).
- **Campaign** / **CampaignContact** — fundraising campaigns and their audiences.
- **Email** / **EmailRecipient** / **EmailLog** — email campaigns and delivery tracking.
- **Interaction** — logged touchpoints with a contact.
- **Task** — follow-up tasks (priority, status).
- **AuditLog** — change tracking.
- **EmailSubscriber** — newsletter list.
- **Account / Session / VerificationToken** — NextAuth.

Everything tenant-owned carries an `organizationId`.

## 5. Authentication & multi-tenancy
- **Auth:** NextAuth v5. Sessions carry the user's `organizationId`, `role`, and `isPlatformAdmin`.
- **Tenant isolation:** enforced in **application code**, not the database. Postgres RLS is enabled **deny-all** on every table to lock the Supabase Data API; the app connects as the Postgres **owner** (which bypasses RLS) and every query filters by `organizationId` (`lib/prisma-rls.ts`, `lib/permissions.ts`). Filters are **fail-closed** — a session without an org matches nothing rather than everything.
- **Roadmap:** centralized enforcement via a Prisma client extension that auto-injects `organizationId`, so a forgotten filter can't leak (today it relies on each query being scoped correctly).

## 6. Payments
- **Stripe Connect:** each organization links its own Stripe account; donations settle **directly** into the nonprofit's account.
- **Model:** $100/month subscription + a **2% platform fee** per donation (a Stripe Connect application fee). Stripe's own processing fees are separate.
- A webhook (`app/api/stripe/webhook`) reconciles donation/subscription events.
- **Status:** the Stripe integration is built but **live keys are not configured**; public donor checkout is still a placeholder. Going live is a roadmap item.

## 7. AI layer (honest status)
- `lib/ai/` and `lib/agents/` contain the AI scaffolding. **Today, the dashboard "AI" is templated heuristics**, with real Claude-backed functions present behind a template fallback.
- The product vision includes **6 donor-facing AI agents** (e.g., a Morning Brief that surfaces the day's highest-impact donor actions, drafted in the user's voice). **These are not built yet** and require an `ANTHROPIC_API_KEY`.
- Treat the AI agents as the roadmap/pitch, not shipped functionality.

## 8. Security
- Encryption in transit (TLS) and at rest; secrets in `.env`/`.env.local` (never committed).
- Fraud scoring on donations (`lib/security/fraud-detector.ts`).
- Rate limiting exists but is currently **in-memory** (ineffective across Vercel's serverless instances) — moving to a shared store (Upstash/Redis) is a roadmap item.
- Audit logging model exists (`AuditLog`); wiring it through all mutations is in progress.

## 9. Deployment & environments
- Hosted on **Vercel**; production is aliased to **www.sagacrm.io**. Deploy with `npx vercel --prod --yes`.
- Database is the Supabase project "SAGA 2.0" (free tier — pauses after ~7 idle days; keep active for demos).
- Local dev runs `next dev --webpack` (Turbopack dev panics on the current Windows/OneDrive machine); production builds use Turbopack fine.

## 10. What's live vs. in progress
| Area | Status |
|---|---|
| Marketing site (landing, pricing, about, contact, security, legal) | ✅ Live |
| Auth (register, login, onboarding, password reset) | ✅ Live |
| CRM: contacts, donations, campaigns, reports, settings, CSV import | ✅ Live |
| Light/dark theming | ✅ Live |
| Public donation checkout | 🚧 Placeholder — not built |
| Live Stripe payments | 🚧 Keys not configured |
| AI agents (the 6 donor-facing agents) | 🚧 Not built — needs `ANTHROPIC_API_KEY` |
| Durable rate limiting / full audit logging | 🚧 In progress |

_Last reviewed: 2026-06-24._
