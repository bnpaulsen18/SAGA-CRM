# Quick Fix: Add Supabase to Vercel (5 Minutes)

Since you already have a Supabase database, you just need to add the connection strings to Vercel.

---

## Step 1: Get Connection Strings from Supabase

### 1. Go to Supabase Dashboard
https://supabase.com/dashboard → Select your project

### 2. Navigate to Database Settings
Click **"Settings"** (gear icon in sidebar) → **"Database"**

### 3. Copy Connection Strings

You'll see two connection string types:

#### **Connection Pooling** (for DATABASE_URL)
- Scroll to **"Connection Pooling"** section
- Mode: **"Transaction"** (recommended for Prisma)
- Click **"URI"** tab
- Copy the connection string

**Example**:
```
postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Important**: Replace `[YOUR-PASSWORD]` with your actual database password

#### **Direct Connection** (for DIRECT_URL)
- Scroll to **"Connection String"** section (above Connection Pooling)
- Click **"URI"** tab
- Copy the connection string

**Example**:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

**Important**: Replace `[YOUR-PASSWORD]` with your actual database password

### 4. Find Your Database Password

If you don't know your password:
1. Settings → Database
2. Scroll to **"Database Password"**
3. Click **"Reset Database Password"** if needed
4. Copy the new password
5. Update both connection strings with the password

---

## Step 2: Add Environment Variables to Vercel

### 1. Open Vercel Dashboard
https://vercel.com/dashboard → Select **SAGA-CRM** project

### 2. Go to Environment Variables
**Settings** → **Environment Variables**

### 3. Add Database Connection Strings

Click **"Add"** and enter each variable:

#### Variable 1: DATABASE_URL

**Key**: `DATABASE_URL`
**Value**: Your Supabase **Connection Pooling** URI (Transaction mode)
```
postgresql://postgres.xxxxxxxxxxxxx:YOUR_ACTUAL_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Environments**:
- ✅ Production
- ✅ Preview
- ✅ Development

Click **"Save"**

#### Variable 2: DIRECT_URL

**Key**: `DIRECT_URL`
**Value**: Your Supabase **Direct Connection** URI
```
postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

**Environments**:
- ✅ Production
- ✅ Preview
- ✅ Development

Click **"Save"**

---

## Step 3: Add Other Required Variables

### Variable 3: NEXTAUTH_SECRET

Generate a secret:
```bash
openssl rand -base64 32
```

Or use this quick generator: https://generate-secret.vercel.app/32

**Key**: `NEXTAUTH_SECRET`
**Value**: The generated secret (e.g., `J8fKl3mP9nQ2rS5tU8vW1xY4zA7bC0dE...`)
**Environments**: ✅ Production, ✅ Preview, ✅ Development

### Variable 4: NEXTAUTH_URL

**Key**: `NEXTAUTH_URL`
**Value**: Your production domain
**Environment**: ✅ Production ONLY

**Example**:
```
https://saga-crm.vercel.app
```

Or your custom domain:
```
https://your-domain.com
```

**Important**: No trailing slash!

### Variable 5: STRIPE_SECRET_KEY

Get from: https://dashboard.stripe.com/apikeys

**Key**: `STRIPE_SECRET_KEY`
**Value**: `sk_test_...` (test mode) or `sk_live_...` (production mode)
**Environments**: ✅ Production, ✅ Preview, ✅ Development

### Variable 6: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

Get from: https://dashboard.stripe.com/apikeys

**Key**: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
**Value**: `pk_test_...` (test mode) or `pk_live_...` (production mode)
**Environments**: ✅ Production, ✅ Preview, ✅ Development

---

## Step 4: Optional Variables

### RESEND_API_KEY (For Email Sending)

Get from: https://resend.com/api-keys

**Key**: `RESEND_API_KEY`
**Value**: `re_...`
**Environments**: ✅ Production, ✅ Preview, ✅ Development

### ANTHROPIC_API_KEY (For AI Features)

Get from: https://console.anthropic.com/settings/keys

**Key**: `ANTHROPIC_API_KEY`
**Value**: `sk-ant-...`
**Environments**: ✅ Production, ✅ Preview, ✅ Development

---

## Step 5: Redeploy

After adding ALL environment variables:

### Via Vercel Dashboard
1. Go to **"Deployments"** tab
2. Click on the **latest deployment**
3. Click **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Wait ~2 minutes for completion

### Via Git Push (Alternative)
```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push origin main
```

---

## ✅ Quick Checklist

Copy this checklist and check off as you go:

```
[ ] Got Supabase Connection Pooling URI (Transaction mode)
[ ] Got Supabase Direct Connection URI
[ ] Replaced [YOUR-PASSWORD] with actual password in both
[ ] Added DATABASE_URL to Vercel (all environments)
[ ] Added DIRECT_URL to Vercel (all environments)
[ ] Generated NEXTAUTH_SECRET (openssl rand -base64 32)
[ ] Added NEXTAUTH_SECRET to Vercel (all environments)
[ ] Added NEXTAUTH_URL to Vercel (production only)
[ ] Added STRIPE_SECRET_KEY to Vercel
[ ] Added NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to Vercel
[ ] (Optional) Added RESEND_API_KEY
[ ] (Optional) Added ANTHROPIC_API_KEY
[ ] Triggered redeploy in Vercel
[ ] Deployment completed successfully (green checkmark)
[ ] Tested sign-in page - no error
[ ] Can sign in successfully
```

---

## 🧪 Test After Redeployment

1. **Wait for deployment** to show green checkmark ✅
2. **Visit your production site**
3. **Click "Sign In"**
4. Should see the login page without errors ✅

### If You Don't Have a User Yet

1. Go to: `https://your-domain.vercel.app/register`
2. Create your first admin account
3. Then try signing in

---

## 🐛 Troubleshooting

### Still See "Something went wrong"

**Check deployment logs**:
1. Vercel Dashboard → Deployments → Latest
2. Click "View Function Logs"
3. Look for specific error messages

**Common errors**:

**"Could not connect to database"**
- Verify DATABASE_URL is correct
- Check you replaced `[YOUR-PASSWORD]` with actual password
- Verify Supabase database is running

**"Invalid database password"**
- Go to Supabase → Settings → Database
- Reset password
- Update both DATABASE_URL and DIRECT_URL with new password
- Redeploy

**"NEXTAUTH_SECRET is required"**
- Generate secret: `openssl rand -base64 32`
- Add to Vercel environment variables
- Redeploy

### Connection String Format Issues

**DATABASE_URL** should look like:
```
postgresql://postgres.xxxxx:PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**DIRECT_URL** should look like:
```
postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres
```

**Common mistakes**:
- ❌ Forgot to replace `[YOUR-PASSWORD]`
- ❌ Password contains special characters (needs URL encoding)
- ❌ Used Session pooling instead of Transaction pooling
- ❌ Copied from wrong section

### Password with Special Characters

If your password has special characters like `@`, `#`, `&`, etc., you need to URL encode them:

**Encoding table**:
- `@` → `%40`
- `#` → `%23`
- `&` → `%26`
- `!` → `%21`
- `$` → `%24`

**Example**:
- Password: `MyP@ss#123`
- Encoded: `MyP%40ss%23123`

Or just reset your password to a simpler one without special characters.

---

## 📊 Verify Environment Variables Are Set

### Via Vercel Dashboard
1. Settings → Environment Variables
2. You should see:
   - DATABASE_URL (Production, Preview, Development)
   - DIRECT_URL (Production, Preview, Development)
   - NEXTAUTH_SECRET (Production, Preview, Development)
   - NEXTAUTH_URL (Production only)
   - STRIPE_SECRET_KEY (all environments)
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (all environments)
   - KV_URL (auto-added) ✅
   - KV_REST_API_URL (auto-added) ✅
   - KV_REST_API_TOKEN (auto-added) ✅

### Via CLI (Alternative)
```bash
npx vercel login
npx vercel env ls
```

---

## 🎯 What Happens After Fix

Once environment variables are set and redeployed:

1. ✅ **Sign-in works** - No more "Something went wrong"
2. ✅ **Database connected** - Prisma can query Supabase
3. ✅ **Authentication works** - NextAuth is initialized
4. ✅ **Rate limiting works** - Redis (Vercel KV) is active
5. ✅ **Donations work** - Stripe integration is ready

---

## 🚀 Summary: What You Need to Do

1. **Get Supabase connection strings** (Transaction pooling + Direct)
2. **Replace `[YOUR-PASSWORD]`** with your actual password
3. **Add to Vercel**:
   - DATABASE_URL
   - DIRECT_URL
   - NEXTAUTH_SECRET (generate new)
   - NEXTAUTH_URL (your production domain)
   - STRIPE keys
4. **Redeploy**
5. **Test sign-in** ✅

**Time estimate**: 5 minutes

---

## 📞 Need Help?

**Supabase Connection Issues**:
- Check Supabase project is not paused
- Verify database password is correct
- Ensure you're using Transaction pooling mode

**Vercel Deployment Issues**:
- Check deployment logs for specific errors
- Verify all required env vars are set
- Ensure you redeployed after adding variables

**Still stuck?**
- Check Vercel deployment logs
- Look for error messages
- Verify each environment variable is exactly as shown above

---

**Generated**: 2026-01-16
**Status**: Ready to implement
**Time to fix**: ~5 minutes
