# Quick Vercel KV Setup Guide

## Option 1: Vercel Dashboard (Recommended)

1. **Go to your Vercel project**: https://vercel.com/dashboard
2. **Select your SAGA-CRM project**
3. **Click "Storage" tab** in the top navigation
4. **Click "Create Database"**
5. **Select "KV (Redis)"**
6. **Configure**:
   - Name: `saga-crm-rate-limiter`
   - Region: Choose closest to your users (e.g., `us-east-1`)
7. **Click "Create"**

Vercel will automatically add these environment variables to your project:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

**No manual configuration needed!** The `@vercel/kv` package automatically uses these variables.

## Option 2: Vercel CLI (Alternative)

```bash
# Login to Vercel
npx vercel login

# Link project if not already linked
npx vercel link

# Create KV database
npx vercel storage create kv saga-crm-rate-limiter --region us-east-1

# Link to production
npx vercel env pull .env.local
```

## After Setup

Once the KV database is created, simply push your code:

```bash
git push origin main
```

Vercel will automatically deploy with Redis enabled!

## Verify Setup

After deployment, check:
1. Vercel Dashboard → Storage → KV → See your database
2. Vercel Dashboard → Deployments → View deployment logs
3. Test a donation form to verify rate limiting works

## Cost (Free Tier Sufficient)

- **256 MB storage** - Enough for ~50,000 rate limit entries
- **10,000 commands/day** - Enough for ~2,500 donations/day (4 commands per check)
- Perfect for small-to-medium nonprofits

## Next Steps

1. ✅ Create KV database (using Option 1 or 2 above)
2. ✅ Push code: `git push origin main`
3. ✅ Vercel auto-deploys
4. ✅ Test rate limiting on production

**That's it!** Redis migration complete.
