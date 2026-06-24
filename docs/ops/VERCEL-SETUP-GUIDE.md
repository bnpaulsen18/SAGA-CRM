# Vercel Environment Variables Setup Guide

This guide walks you through configuring all required environment variables in Vercel for SAGA CRM production deployment.

---

## 📋 Quick Checklist

- [ ] Database connection strings (Supabase)
- [ ] NextAuth configuration
- [ ] Stripe API keys
- [ ] **Stripe Connect Client ID** ⚠️ CRITICAL FOR PLATFORM FEES
- [ ] Vercel KV (Redis) for rate limiting
- [ ] Optional: Resend, Turnstile, Anthropic, Google Analytics

---

## 🔧 Step-by-Step Setup

### 1. Access Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your **SAGA-CRM** project
3. Click **Settings** → **Environment Variables**

---

### 2. Database (Required)

**Add these variables from your Supabase project:**

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=10
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.mwqsvqvbrjekoxkdizqw.supabase.com:5432/postgres
```

**How to get:**
1. Go to https://supabase.com/dashboard/project/YOUR_PROJECT/settings/database
2. Copy **Connection string** (with session pooling) → `DATABASE_URL`
3. Copy **Direct connection** → `DIRECT_URL`

**Environment:** Production, Preview, Development

---

### 3. NextAuth (Required)

```
NEXTAUTH_URL=https://www.sagacrm.io
NEXTAUTH_SECRET=[generate this below]
```

**How to generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Environment:**
- Production: `https://www.sagacrm.io` or your custom domain
- Preview: Leave empty (auto-detected)
- Development: `http://localhost:3000`

---

### 4. Stripe API Keys (Required for Online Donations)

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**How to get:**
1. Go to https://dashboard.stripe.com/apikeys
2. Toggle to **Live mode** (not Test mode)
3. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Click **+ Create secret key** → Copy → `STRIPE_SECRET_KEY`
5. For webhook secret:
   - Go to https://dashboard.stripe.com/webhooks
   - Click **+ Add endpoint**
   - Endpoint URL: `https://www.sagacrm.io/api/stripe/webhook`
   - Events: Select `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`
   - Click **Add endpoint**
   - Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

**Environment:** Production (use test keys for Preview/Development)

---

### 5. 🔥 Stripe Connect Client ID (CRITICAL - NEW)

```
STRIPE_CONNECT_CLIENT_ID=ca_...
```

**This is REQUIRED for the 2% platform fee to work!**

**How to get:**
1. Go to https://dashboard.stripe.com/settings/applications
2. Click **New connect application** (if you don't have one)
3. Fill in:
   - **Application name:** SAGA CRM Platform
   - **Redirect URI:** `https://www.sagacrm.io/api/stripe/connect/callback`
   - **Optional webhooks:** (can configure later)
4. Click **Create application**
5. Copy **Client ID** (starts with `ca_`) → `STRIPE_CONNECT_CLIENT_ID`

**Alternative if you already have a Connect app:**
1. Go to https://dashboard.stripe.com/settings/connect
2. Scroll to **OAuth settings**
3. Copy **Development client ID** or **Live client ID** → `STRIPE_CONNECT_CLIENT_ID`

**Environment:** Production

---

### 6. Vercel KV - Redis (Required for Rate Limiting)

```
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

**How to set up:**
1. In Vercel dashboard, go to your project
2. Click **Storage** tab
3. Click **Create Database**
4. Select **KV (Redis)**
5. Configure:
   - **Name:** `saga-crm-rate-limiter`
   - **Region:** Select closest to your users (e.g., `us-east-1`)
6. Click **Create**
7. Vercel will **automatically** add `KV_REST_API_URL` and `KV_REST_API_TOKEN` to your environment variables

**Environment:** Auto-configured for all environments

---

### 7. Optional: Email Service (Resend)

```
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=SAGA CRM <noreply@sagacrm.io>
```

**How to get:**
1. Go to https://resend.com/api-keys
2. Click **Create API Key**
3. Name: "SAGA CRM Production"
4. Copy → `RESEND_API_KEY`

**Environment:** Production (can skip for Preview/Development)

---

### 8. Optional: CAPTCHA (Cloudflare Turnstile)

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA...
TURNSTILE_SECRET_KEY=0x4AAAAAAA...
```

**How to get:**
1. Go to https://dash.cloudflare.com/turnstile
2. Click **Add site**
3. Domain: `sagacrm.io`
4. Copy **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
5. Copy **Secret Key** → `TURNSTILE_SECRET_KEY`

**Environment:** Production

---

### 9. Optional: AI Features (Anthropic)

```
ANTHROPIC_API_KEY=sk-ant-...
```

**How to get:**
1. Go to https://console.anthropic.com/settings/keys
2. Click **Create Key**
3. Copy → `ANTHROPIC_API_KEY`

**Environment:** Production

---

### 10. Optional: Analytics (Google Analytics 4)

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**How to get:**
1. Go to https://analytics.google.com/
2. Admin → Data Streams → Web
3. Copy **Measurement ID** → `NEXT_PUBLIC_GA_MEASUREMENT_ID`

**Environment:** Production

---

## ✅ Verification Checklist

After adding all variables, verify your deployment:

### Required for Basic Deployment:
- [ ] `DATABASE_URL` - Set
- [ ] `DIRECT_URL` - Set
- [ ] `NEXTAUTH_URL` - Set to `https://www.sagacrm.io`
- [ ] `NEXTAUTH_SECRET` - Generated and set

### Required for Online Donations:
- [ ] `STRIPE_SECRET_KEY` - Set (Live mode)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Set (Live mode)
- [ ] `STRIPE_WEBHOOK_SECRET` - Set with webhook endpoint configured
- [ ] ⚠️ **`STRIPE_CONNECT_CLIENT_ID`** - Set (from Connect application)
- [ ] `KV_REST_API_URL` - Auto-configured by Vercel KV
- [ ] `KV_REST_API_TOKEN` - Auto-configured by Vercel KV

### Optional but Recommended:
- [ ] `RESEND_API_KEY` - For email receipts
- [ ] `TURNSTILE_SECRET_KEY` - For bot protection
- [ ] `ANTHROPIC_API_KEY` - For AI thank-you emails

---

## 🚀 After Configuration

1. **Redeploy:**
   - Environment variables require a new deployment to take effect
   - Either push a new commit or click **Redeploy** in Vercel

2. **Test Stripe Connect:**
   - Create a test organization
   - Go to Settings → Integrations
   - Click "Connect Stripe"
   - Verify OAuth flow works

3. **Test Donation Flow:**
   - Upgrade test org to Pro ($99/mo)
   - Complete Stripe Connect
   - Process a test donation
   - Verify 2% fee is collected

---

## 🐛 Troubleshooting

### "Stripe Connect not available"
- Check `STRIPE_CONNECT_CLIENT_ID` is set in Vercel
- Verify it starts with `ca_`
- Ensure you're using **Live mode** credentials

### "Can't reach database server"
- Check `DATABASE_URL` and `DIRECT_URL` are correct
- Verify Supabase database is running
- Check IP allowlist in Supabase (should allow all IPs)

### "Rate limiter not working"
- Verify Vercel KV database is created
- Check `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set
- If missing, recreate KV database

### Webhook not receiving events
- Go to Stripe Dashboard → Webhooks
- Check endpoint URL: `https://www.sagacrm.io/api/stripe/webhook`
- Click **Send test webhook** to verify

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Runtime Logs in Vercel dashboard
3. Review this checklist again
4. Contact support with specific error messages

---

**Last Updated:** 2026-01-20
**Platform Version:** Next.js 16 + Stripe Connect
