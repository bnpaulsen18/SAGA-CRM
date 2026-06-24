# Sentry Error Tracking Setup Guide

**Status:** ✅ Code configuration complete - Environment variables needed

Sentry has been integrated into SAGA CRM for error tracking, performance monitoring, and session replay. This guide will help you complete the setup.

---

## What's Already Done ✅

- ✅ Sentry Next.js SDK installed (`@sentry/nextjs@10.32.1`)
- ✅ Client-side configuration created (`sentry.client.config.ts`)
- ✅ Server-side configuration created (`sentry.server.config.ts`)
- ✅ Edge runtime configuration created (`sentry.edge.config.ts`)
- ✅ Next.js config updated with Sentry webpack plugin
- ✅ Instrumentation file created for App Router
- ✅ CSP headers updated to allow Sentry domains
- ✅ Sensitive data filtering configured
- ✅ `.sentryclirc` added to `.gitignore`

---

## Step 1: Create Sentry Account & Project

### Option A: New Sentry Account

1. Go to [https://sentry.io/signup/](https://sentry.io/signup/)
2. Sign up (free tier includes 5,000 errors/month)
3. Create a new project:
   - Platform: **Next.js**
   - Project name: **saga-crm** (or your preferred name)
   - Alert frequency: **On every new issue** (recommended for production)

### Option B: Existing Sentry Account

1. Go to [https://sentry.io/](https://sentry.io/) and log in
2. Click **Create Project**
3. Select platform: **Next.js**
4. Name: **saga-crm**
5. Team: Choose your team
6. Click **Create Project**

---

## Step 2: Get Your Sentry DSN

After creating the project, Sentry will show you a DSN (Data Source Name).

**Format:** `https://[PUBLIC_KEY]@[ORG_ID].ingest.sentry.io/[PROJECT_ID]`

**Example:** `https://abc123def456@o1234567.ingest.sentry.io/7654321`

**Copy this value** - you'll need it for environment variables.

You can always find it later at:
- Sentry Dashboard → **Settings** → **Projects** → **saga-crm** → **Client Keys (DSN)**

---

## Step 3: Generate Sentry Auth Token

The auth token is used to upload source maps during builds.

1. Go to [https://sentry.io/settings/account/api/auth-tokens/](https://sentry.io/settings/account/api/auth-tokens/)
2. Click **Create New Token**
3. Token name: `SAGA CRM Build Token`
4. Scopes required (select these):
   - ✅ `project:read`
   - ✅ `project:releases`
   - ✅ `org:read`
5. Click **Create Token**
6. **Copy the token immediately** (you won't see it again!)

---

## Step 4: Configure Environment Variables

Add these variables to your production environment:

### Required Variables

```bash
# Sentry DSN (from Step 2)
NEXT_PUBLIC_SENTRY_DSN="https://abc123def456@o1234567.ingest.sentry.io/7654321"

# Sentry Organization Slug
# Find at: https://sentry.io/settings/ (look at the URL)
SENTRY_ORG="your-org-slug"

# Sentry Project Slug
SENTRY_PROJECT="saga-crm"

# Sentry Auth Token (from Step 3)
# Used for uploading source maps during builds
SENTRY_AUTH_TOKEN="sntrys_xxxxxxxxxxxxxxxxxxxxx"
```

### Local Development (.env.local)

```bash
# Add these to .env.local for testing
NEXT_PUBLIC_SENTRY_DSN="https://abc123def456@o1234567.ingest.sentry.io/7654321"
SENTRY_ORG="your-org-slug"
SENTRY_PROJECT="saga-crm"
SENTRY_AUTH_TOKEN="sntrys_xxxxxxxxxxxxxxxxxxxxx"
```

### Vercel Deployment

1. Go to Vercel Dashboard → **Settings** → **Environment Variables**
2. Add each variable:
   - `NEXT_PUBLIC_SENTRY_DSN` → Production + Preview
   - `SENTRY_ORG` → Production + Preview
   - `SENTRY_PROJECT` → Production + Preview
   - `SENTRY_AUTH_TOKEN` → Production + Preview (**Mark as Encrypted**)

---

## Step 5: Update .sentryclirc (Optional)

If you prefer to use `.sentryclirc` instead of environment variables for local development:

1. Open `.sentryclirc` in your project root
2. Replace the placeholder values:

```ini
[auth]
token=sntrys_your_actual_token_here

[defaults]
org=your-org-slug
project=saga-crm
url=https://sentry.io/
```

**⚠️ NEVER commit this file to git** (it's already in `.gitignore`)

---

## Step 6: Test Sentry Integration

### Test 1: Verify Configuration

```bash
npm run build
```

You should see:
```
✓ Sentry Next.js Plugin: Successfully uploaded source maps
```

### Test 2: Trigger a Test Error (Client-Side)

Create a test page or add a button that triggers an error:

```typescript
// In any page component
<button onClick={() => {
  throw new Error("Sentry test error from client");
}}>
  Test Sentry (Client)
</button>
```

Click the button, then check your Sentry dashboard. You should see the error within seconds.

### Test 3: Trigger a Server-Side Error

Create an API route that throws an error:

```typescript
// app/api/test-sentry/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  throw new Error('Sentry test error from server');
  return NextResponse.json({ message: 'This will not be reached' });
}
```

Visit `/api/test-sentry` and check Sentry dashboard.

### Test 4: Check in Sentry Dashboard

1. Go to [https://sentry.io/](https://sentry.io/)
2. Select your project: **saga-crm**
3. Go to **Issues** → You should see your test errors
4. Click on an error to see:
   - ✅ Stack trace with source code (thanks to source maps!)
   - ✅ User context
   - ✅ Breadcrumbs (user actions leading to error)
   - ✅ Device/browser info

---

## Step 7: Configure Alerts (Recommended)

### Email Alerts

1. Go to Sentry Dashboard → **Alerts** → **Create Alert**
2. Choose: **Issues**
3. Set conditions:
   - When: **A new issue is created**
   - Environment: **production**
4. Actions:
   - ✅ Send email to: **your-email@domain.com**
   - ✅ Send Slack notification (if Slack integration is set up)

### Slack Integration (Optional)

1. Go to Sentry Dashboard → **Settings** → **Integrations**
2. Find **Slack** → Click **Add to Slack**
3. Authorize Sentry
4. Configure notifications:
   - Channel: `#saga-crm-errors` (or your preferred channel)
   - Events: **New issues**, **Issue escalation**

---

## Features Enabled

### Error Tracking
- ✅ All unhandled exceptions captured
- ✅ Stack traces with source maps
- ✅ User context (email, ID, organization)
- ✅ Device and browser info

### Performance Monitoring
- ✅ 100% of transactions sampled (adjust in production)
- ✅ API route performance
- ✅ Page load times
- ✅ Database query performance

### Session Replay (Client-Side)
- ✅ 10% of sessions recorded
- ✅ 100% of error sessions recorded
- ✅ All text masked by default (privacy)
- ✅ All media blocked (privacy)

### Security & Privacy
- ✅ Query strings removed from URLs
- ✅ Authorization headers removed
- ✅ Cookie headers removed
- ✅ Database credentials filtered
- ✅ API keys filtered
- ✅ Secrets not sent to Sentry

### Ignored Errors
- Browser extension errors
- Network timeout errors (expected in serverless)
- Next.js 404 errors (not actionable)

---

## Production Considerations

### 1. Adjust Sample Rates

In production, you may want to reduce sampling to save quota:

**Edit `sentry.client.config.ts` and `sentry.server.config.ts`:**

```typescript
tracesSampleRate: 0.1,  // 10% of transactions (vs 100%)
replaysSessionSampleRate: 0.01,  // 1% of sessions (vs 10%)
```

### 2. Set Up Budget Alerts

1. Go to Sentry Dashboard → **Settings** → **Subscription**
2. Set **Budget Alerts** to notify you at 80% and 100% of quota
3. Free tier: 5,000 errors/month
4. Upgrade if needed: $26/month for 50K errors

### 3. Enable Auto-Assignment

1. Go to **Settings** → **Projects** → **saga-crm** → **Issue Owners**
2. Configure ownership rules:
   - API routes → Backend team
   - Frontend components → Frontend team
3. Errors will auto-assign to the right people

### 4. Release Tracking

Sentry automatically tracks releases thanks to the Next.js integration. View releases at:
- Dashboard → **Releases**
- See which errors were introduced in each deployment

### 5. Performance Monitoring

Track Core Web Vitals and API performance:
1. Go to **Performance** → **Web Vitals**
2. Monitor:
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

---

## Troubleshooting

### Issue: "Sentry DSN not configured"

**Solution:** Make sure `NEXT_PUBLIC_SENTRY_DSN` is set in environment variables. The `NEXT_PUBLIC_` prefix is required for client-side access.

### Issue: Source maps not uploading

**Check:**
1. `SENTRY_AUTH_TOKEN` is set
2. `SENTRY_ORG` matches your organization slug
3. `SENTRY_PROJECT` matches your project slug
4. Run `npm run build` and check for upload success message

### Issue: No errors showing in Sentry

**Check:**
1. DSN is correctly configured
2. Trigger a test error (see Step 6)
3. Check browser console for Sentry initialization messages
4. Verify network tab shows requests to `*.ingest.sentry.io`

### Issue: Too many errors

**Solutions:**
1. Increase `ignoreErrors` array in Sentry config
2. Set up custom error boundaries
3. Filter errors by environment (only capture production)

---

## Monitoring in Production

### Daily Checks
- [ ] Review new issues in Sentry dashboard
- [ ] Check error rate trends
- [ ] Monitor performance regressions

### Weekly Checks
- [ ] Review resolved issues that re-opened
- [ ] Check quota usage
- [ ] Review performance insights

### Monthly Checks
- [ ] Review issue ownership rules
- [ ] Update alert configurations
- [ ] Analyze error trends and patterns

---

## Resources

- **Sentry Dashboard**: [https://sentry.io/](https://sentry.io/)
- **Next.js Integration Docs**: [https://docs.sentry.io/platforms/javascript/guides/nextjs/](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- **Performance Monitoring**: [https://docs.sentry.io/product/performance/](https://docs.sentry.io/product/performance/)
- **Session Replay**: [https://docs.sentry.io/product/session-replay/](https://docs.sentry.io/product/session-replay/)

---

## Success Metrics

After setup, you should see:
- ✅ Errors appearing in Sentry dashboard within seconds
- ✅ Stack traces showing exact line numbers (source maps working)
- ✅ Performance data in Performance tab
- ✅ Session replays for error cases
- ✅ Alert notifications for new issues

---

**Setup Complete! 🎉**

Sentry is now monitoring your application for errors, performance issues, and user experience problems. You'll be notified immediately when issues occur in production.
