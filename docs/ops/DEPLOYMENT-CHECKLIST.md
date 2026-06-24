# SAGA CRM - Production Deployment Checklist

**Last Updated:** 2026-01-23
**Target Platform:** Vercel (Recommended) or similar serverless platform
**Database:** Supabase PostgreSQL

---

## 🚨 CRITICAL - Must Complete Before Deployment

### 1. Database Setup ✅

- [ ] **Apply pending database migrations**
  ```sql
  -- In Supabase SQL Editor, run in order:
  1. prisma/migrations/manual-fraud-detection.sql
  2. prisma/migrations/manual-email-subscribers.sql
  ```

- [ ] **Verify migrations applied successfully**
  ```sql
  -- Check for fraud detection fields
  SELECT column_name FROM information_schema.columns
  WHERE table_name = 'donations' AND column_name IN ('fraudScore', 'fraudFlags', 'reviewStatus');

  -- Check for email_subscribers table
  SELECT table_name FROM information_schema.tables WHERE table_name = 'email_subscribers';
  ```

- [ ] **Set up database connection pooling** (if not using Supabase)
  - Connection limit: 100 for production
  - Timeout: 30 seconds

---

### 2. Environment Variables 🔐

**Required Production Secrets:**

#### Database (Supabase)
```bash
DATABASE_URL="postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

#### Authentication (NextAuth)
```bash
NEXTAUTH_SECRET="[Generate with: openssl rand -base64 32]"
NEXTAUTH_URL="https://your-production-domain.com"
```

#### Google OAuth (Social Login)
```bash
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxxxxxxxxxxxxxxx"
```

#### Microsoft OAuth (Social Login)
```bash
MICROSOFT_CLIENT_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
MICROSOFT_CLIENT_SECRET="xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
MICROSOFT_TENANT_ID="common"
```

#### Stripe (Payment Processing) - **CRITICAL**
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxxxxxxxxxxxxxxxxxxxx"
STRIPE_SECRET_KEY="sk_live_xxxxxxxxxxxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxxx"
```

⚠️ **WARNING:** Use LIVE keys (`pk_live_`, `sk_live_`) for production!

#### Email (Resend) - **CRITICAL**
```bash
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxx"
RESEND_FROM_EMAIL="SAGA CRM <donations@your-domain.com>"
```

#### AI Features (Optional but Recommended)
```bash
ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxxxxxxxxxxx"
```

#### Analytics (Optional)
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

#### CAPTCHA (Optional but Recommended)
```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY="0x4AAAAAAAAAAAAAAAAAAA"
TURNSTILE_SECRET_KEY="0x4AAAAAAAAAAAAAAAAAAA"
```

#### Error Tracking (Highly Recommended)
```bash
NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@o12345.ingest.sentry.io/12345"
SENTRY_ORG="your-org"
SENTRY_PROJECT="saga-crm"
SENTRY_AUTH_TOKEN="sntrys_xxxxxxxxxxxxxxxxxxxxx"
```

---

### 3. Stripe Production Setup ⚡

- [ ] **Complete Stripe account verification**
  - Business information submitted
  - Bank account connected
  - Identity verification complete

- [ ] **Switch to live mode API keys**
  - Copy `pk_live_xxx` to `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - Copy `sk_live_xxx` to `STRIPE_SECRET_KEY`

- [ ] **Configure webhook endpoint**
  - URL: `https://your-domain.com/api/stripe/webhook`
  - Events to listen for:
    - ✓ `checkout.session.completed`
    - ✓ `invoice.paid`
    - ✓ `customer.subscription.deleted`
  - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

- [ ] **Test live webhook**
  ```bash
  stripe listen --forward-to https://your-domain.com/api/stripe/webhook
  stripe trigger checkout.session.completed
  ```

- [ ] **Process test $1 donation**
  - Use real credit card in test mode first
  - Then switch to live mode and test with $1
  - Verify:
    - [ ] Donation recorded in database
    - [ ] Receipt email sent
    - [ ] Stripe dashboard shows payment

---

### 4. Email Configuration (Resend) 📧

- [ ] **Add and verify domain**
  - Go to Resend dashboard → Domains
  - Add your domain (e.g., `your-domain.com`)

- [ ] **Configure DNS records** (provided by Resend)
  - Add SPF record: `v=spf1 include:_spf.resend.com ~all`
  - Add DKIM record (custom for your domain)
  - Add DMARC record: `v=DMARC1; p=none; rua=mailto:dmarc@your-domain.com`

- [ ] **Verify domain status** (must show "Verified" in Resend)

- [ ] **Test email delivery**
  - Trigger test donation
  - Check spam folder
  - Verify deliverability >95%

- [ ] **Set up from email**
  ```bash
  RESEND_FROM_EMAIL="SAGA CRM <donations@your-domain.com>"
  # Or subdomain:
  RESEND_FROM_EMAIL="SAGA CRM <noreply@crm.your-domain.com>"
  ```

---

### 5. Vercel Deployment 🚀

#### Initial Setup

- [ ] **Connect GitHub repository**
  - Go to Vercel dashboard
  - Import Git Repository
  - Select your repo
  - Framework: Next.js (auto-detected)

- [ ] **Configure build settings**
  - Build Command: `npm run build` (default)
  - Output Directory: `.next` (default)
  - Install Command: `npm install` (default)
  - Node Version: 20.x

- [ ] **Add all environment variables**
  - Go to Settings → Environment Variables
  - Add all variables from section 2
  - ⚠️ Set sensitive vars as "Encrypted"

- [ ] **Configure production domain**
  - Add custom domain in Vercel dashboard
  - Update DNS:
    - A record: `76.76.21.21`
    - CNAME: `cname.vercel-dns.com`
  - Update `NEXTAUTH_URL` to match production domain

#### Deploy

- [ ] **Trigger initial deployment**
  - Push to `main` branch
  - Or click "Deploy" in Vercel dashboard

- [ ] **Monitor build logs**
  - Watch for errors
  - Ensure Prisma generates successfully
  - Check for missing environment variables

- [ ] **Verify deployment**
  - Visit `https://your-domain.com`
  - Check health endpoint: `https://your-domain.com/api/health`
  - Expected response: `{"status": "healthy", ...}`

---

### 6. Post-Deployment Verification ✅

#### Critical Path Testing

- [ ] **Authentication Flow**
  - [ ] Email/password signup works
  - [ ] Email/password login works
  - [ ] Google OAuth works
  - [ ] Microsoft OAuth works
  - [ ] Organization creation on signup

- [ ] **Donation Flow (End-to-End)**
  - [ ] Manual donation entry works
  - [ ] Stripe checkout redirects correctly
  - [ ] Webhook processes donation
  - [ ] Donation appears in database
  - [ ] Receipt email delivered
  - [ ] Contact auto-created if needed

- [ ] **Recurring Donations**
  - [ ] Monthly subscription setup works
  - [ ] Subscription shown in Stripe dashboard
  - [ ] Cancellation webhook works

- [ ] **Public Donation Pages**
  - [ ] `/donate/[organizationId]` accessible
  - [ ] `/donate/[organizationId]/[campaignId]` accessible
  - [ ] Form validates correctly
  - [ ] Redirects to Stripe Checkout

- [ ] **Fraud Detection**
  - [ ] High-risk donations flagged
  - [ ] Admin fraud monitor shows alerts
  - [ ] Idempotency prevents duplicates

- [ ] **Newsletter System**
  - [ ] Signup form works
  - [ ] Verification email sent
  - [ ] Double opt-in confirmation works
  - [ ] Unsubscribe link works

---

### 7. Monitoring & Error Tracking 📊

#### Sentry Setup (Highly Recommended)

- [ ] **Install Sentry wizard**
  ```bash
  npx @sentry/wizard@latest -i nextjs
  ```

- [ ] **Configure Sentry**
  ```bash
  # Add to .env
  NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@sentry.io/12345"
  SENTRY_ORG="your-org"
  SENTRY_PROJECT="saga-crm"
  ```

- [ ] **Test error reporting**
  - Trigger intentional error
  - Verify appears in Sentry dashboard

- [ ] **Set up alerts**
  - Email notifications for new errors
  - Slack integration (optional)
  - Error rate threshold alerts

#### Health Monitoring

- [ ] **Set up uptime monitoring** (Choose one:)
  - [ ] UptimeRobot (free, simple)
  - [ ] Pingdom
  - [ ] Better Uptime (Vercel recommended)
  - [ ] Checkly (advanced)

- [ ] **Monitor endpoints**
  - Health check: `https://your-domain.com/api/health`
  - Interval: 5 minutes
  - Alert on: Status ≠ 200

- [ ] **Set up Vercel Analytics** (if on Pro plan)
  - Enable in Vercel dashboard
  - Track Core Web Vitals

---

### 8. Security Hardening 🔒

- [ ] **Enable HTTPS enforcement** (automatic on Vercel)

- [ ] **Verify CSP headers active**
  - Open browser DevTools → Network
  - Check `Content-Security-Policy` header present

- [ ] **Test rate limiting**
  - Rapid-fire requests to `/api/stripe/checkout`
  - Should return 429 after threshold

- [ ] **Verify CAPTCHA working** (if enabled)
  - Cloudflare Turnstile should show on forms
  - Invalid responses rejected

- [ ] **Review exposed environment variables**
  - Check `.env.local` not committed
  - Verify no secrets in client-side code

---

### 9. Performance Optimization 🚀

- [ ] **Run Lighthouse audit**
  - Target scores:
    - Performance: 90+
    - Accessibility: 95+
    - SEO: 100
    - Best Practices: 100

- [ ] **Optimize images**
  - Convert large PNGs to WebP
  - Use Next.js `<Image>` component
  - Set proper width/height attributes

- [ ] **Check bundle size**
  ```bash
  npm run build
  # Review output for large bundles (>500KB)
  ```

- [ ] **Enable caching**
  - Static assets: 1 year
  - API routes: No cache
  - ISR pages: Revalidate every 60s

---

### 10. Content & SEO 📝

- [ ] **Create social media images**
  - [ ] `/public/og-image.png` (1200x630px)
  - [ ] `/public/twitter-image.png` (1200x675px)
  - Use brand gradient (purple to orange)
  - Include SAGA logo + tagline

- [ ] **Update Twitter handle**
  - In `app/layout.tsx`, replace `@sagacrm` with actual handle

- [ ] **Add Google Search Console**
  - Verify domain ownership
  - Submit sitemap: `https://your-domain.com/sitemap.xml`
  - Request indexing for key pages

- [ ] **Review metadata**
  - [ ] Homepage title/description
  - [ ] Pricing page metadata
  - [ ] Donation pages metadata

---

### 11. Legal & Compliance ⚖️

- [ ] **Review Privacy Policy**
  - Update last modified date
  - Ensure GDPR compliance
  - Add data processing details

- [ ] **Review Terms of Service**
  - Stripe terms referenced
  - Refund policy stated
  - Liability limitations

- [ ] **Cookie Consent Banner**
  - Verify shows on first visit
  - Settings modal works
  - Preferences saved correctly

- [ ] **GDPR Compliance**
  - [ ] Right to access (export data)
  - [ ] Right to deletion (delete account)
  - [ ] Right to portability (CSV export)
  - [ ] Consent management active

---

## 📋 Pre-Launch Final Checks

**1 Day Before Launch:**

- [ ] Backup production database
- [ ] Freeze code changes (no new deploys)
- [ ] Notify team of launch window
- [ ] Prepare rollback plan

**Launch Day:**

- [ ] ✅ All checklist items above completed
- [ ] Test $1 live donation (you → production)
- [ ] Monitor error logs for 1 hour
- [ ] Check Sentry for unexpected errors
- [ ] Verify health check returns 200
- [ ] Test 3 critical user flows

**First 24 Hours:**

- [ ] Monitor Sentry hourly
- [ ] Check email deliverability
- [ ] Review Stripe webhook logs
- [ ] Watch database query performance
- [ ] Check for 5xx errors in Vercel logs

**First Week:**

- [ ] Daily Sentry review
- [ ] Monitor fraud detection accuracy
- [ ] Review customer support tickets
- [ ] Optimize slow queries (if any)
- [ ] Gather user feedback

---

## 🚨 Emergency Contacts & Procedures

### Rollback Procedure

If critical errors occur:

1. **Immediate**: Revert to previous deployment in Vercel dashboard
2. **Notify**: Alert team in Slack/Discord
3. **Investigate**: Review Sentry error logs
4. **Fix**: Create hotfix branch
5. **Test**: Verify fix in preview environment
6. **Deploy**: Merge to main after verification

### Support Contacts

- **Stripe Support**: https://support.stripe.com (live chat)
- **Resend Support**: support@resend.com
- **Supabase Support**: support@supabase.com
- **Vercel Support**: https://vercel.com/support

---

## 📊 Success Metrics - Week 1

- [ ] Zero critical errors in Sentry
- [ ] >99% uptime (monitored by health checks)
- [ ] >95% email deliverability rate
- [ ] <1% fraud false positive rate
- [ ] 10+ successful donations processed
- [ ] All Lighthouse scores meet targets
- [ ] <200ms average API response time

---

## 📖 Additional Resources

- **Deployment Guide**: PRODUCTION-DEPLOYMENT-GUIDE.md
- **Comprehensive Plan**: COMPREHENSIVE-NEXT-STEPS-PLAN.md
- **Fraud System Docs**: DONATION-SECURITY-PHASE-2-COMPLETE.md
- **Newsletter System**: NEWSLETTER-SYSTEM.md
- **Analytics Setup**: WEEKS-2-3-COMPLETE.md

---

## ✅ Sign-Off

**Deployed By:** _________________
**Date:** _________________
**Deployment URL:** https://_________________
**Health Check Verified:** [ ]
**Test Donation Completed:** [ ]
**Team Notified:** [ ]

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________

---

**You're ready to launch when all checkboxes are completed. Good luck! 🚀**
