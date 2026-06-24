# OAuth Social Authentication Setup Guide

This guide will walk you through setting up Google and Microsoft OAuth authentication for SAGA CRM.

## Overview

Social authentication allows users to sign in with their existing Google or Microsoft accounts, providing:
- ✅ Faster signup process
- ✅ Email automatically verified
- ✅ Improved user experience
- ✅ Reduced password fatigue
- ✅ Better security (managed by OAuth providers)

## Prerequisites

- SAGA CRM deployed and accessible (local or production)
- Admin access to Google Cloud Console (for Google OAuth)
- Admin access to Azure Portal (for Microsoft OAuth)

---

## Part 1: Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter project name: `SAGA CRM` (or your preferred name)
4. Click **Create**

### Step 2: Configure OAuth Consent Screen

1. In the left sidebar, go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Click **Create**

**Fill in the required fields:**
- **App name**: `SAGA CRM`
- **User support email**: Your email address
- **App logo**: (Optional) Upload your logo
- **Authorized domains**: Add your domain (e.g., `sagacrm.com`)
- **Developer contact information**: Your email address

4. Click **Save and Continue**
5. On **Scopes** page, click **Add or Remove Scopes**
6. Select these scopes:
   - `userinfo.email`
   - `userinfo.profile`
   - `openid`
7. Click **Update** → **Save and Continue**
8. On **Test users** page (if in testing mode), add test email addresses
9. Click **Save and Continue**
10. Review and click **Back to Dashboard**

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Application type**: **Web application**
4. **Name**: `SAGA CRM Web Client`

**Authorized JavaScript origins:**
```
http://localhost:3000
https://your-production-domain.com
https://your-production-domain.vercel.app
```

**Authorized redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
https://your-production-domain.com/api/auth/callback/google
https://your-production-domain.vercel.app/api/auth/callback/google
```

5. Click **Create**
6. **Copy the Client ID and Client Secret** - you'll need these for your `.env` file

### Step 4: Add Credentials to Environment Variables

Add these to your `.env.local` (local) and Vercel environment variables (production):

```bash
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

---

## Part 2: Microsoft Azure AD OAuth Setup

### Step 1: Register an Application

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** (or search for it)
3. Click **App registrations** in the left sidebar
4. Click **New registration**

**Fill in the registration form:**
- **Name**: `SAGA CRM`
- **Supported account types**: Select **Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts**
- **Redirect URI**:
  - Platform: **Web**
  - URL: `http://localhost:3000/api/auth/callback/azure-ad`

5. Click **Register**

### Step 2: Add Additional Redirect URIs

1. In your new app registration, go to **Authentication** in the left sidebar
2. Under **Platform configurations** → **Web** → **Redirect URIs**, click **Add URI**
3. Add your production URLs:
   ```
   https://your-production-domain.com/api/auth/callback/azure-ad
   https://your-production-domain.vercel.app/api/auth/callback/azure-ad
   ```
4. Scroll down to **Implicit grant and hybrid flows**
5. Check **ID tokens** (used for implicit and hybrid flows)
6. Click **Save**

### Step 3: Create Client Secret

1. Go to **Certificates & secrets** in the left sidebar
2. Under **Client secrets**, click **New client secret**
3. **Description**: `SAGA CRM Production`
4. **Expires**: Choose your preferred expiration (recommended: 24 months)
5. Click **Add**
6. **Copy the Value immediately** - you won't be able to see it again!

### Step 4: Configure API Permissions

1. Go to **API permissions** in the left sidebar
2. You should see `Microsoft Graph` → `User.Read` already added
3. If not, click **Add a permission** → **Microsoft Graph** → **Delegated permissions**
4. Select:
   - `User.Read`
   - `email`
   - `openid`
   - `profile`
5. Click **Add permissions**
6. (Optional) Click **Grant admin consent** if you have admin rights

### Step 5: Get Application (Client) ID

1. Go to **Overview** in the left sidebar
2. Copy the **Application (client) ID**
3. Copy the **Directory (tenant) ID** (or use `common` for multitenant)

### Step 6: Add Credentials to Environment Variables

Add these to your `.env.local` (local) and Vercel environment variables (production):

```bash
AZURE_AD_CLIENT_ID="your-application-client-id"
AZURE_AD_CLIENT_SECRET="your-client-secret-value"
AZURE_AD_TENANT_ID="common"
```

**Note**: Use `common` for multi-tenant (any Microsoft account). If you want to restrict to a specific organization, use your specific tenant ID.

---

## Part 3: Testing

### Local Testing

1. Ensure all environment variables are set in `.env.local`:
   ```bash
   # Google OAuth
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."

   # Microsoft Azure AD
   AZURE_AD_CLIENT_ID="..."
   AZURE_AD_CLIENT_SECRET="..."
   AZURE_AD_TENANT_ID="common"
   ```

2. Restart your development server:
   ```bash
   npm run dev
   ```

3. Navigate to `http://localhost:3000/login`
4. You should see **Google** and **Microsoft** buttons
5. Click each button to test the OAuth flow

**What to test:**
- ✅ OAuth redirect works
- ✅ User can authenticate with Google/Microsoft
- ✅ User is created in database (check Prisma Studio)
- ✅ Email is automatically verified (`emailVerified` field is set)
- ✅ User is redirected to dashboard
- ✅ Session persists on page reload

### Production Testing (Vercel)

1. Add environment variables in Vercel dashboard:
   - Go to your project → **Settings** → **Environment Variables**
   - Add all OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, etc.)
   - Apply to **Production**, **Preview**, and **Development** environments

2. Redeploy your application:
   ```bash
   git add .
   git commit -m "feat: Add Google and Microsoft OAuth authentication"
   git push
   ```

3. Test on your production domain
4. Verify OAuth flows work correctly

---

## Part 4: Account Linking

### How Account Linking Works

If a user:
1. Registers with email/password (`user@example.com`)
2. Later tries to sign in with Google using the same email (`user@example.com`)

**What happens:**
- NextAuth will link the accounts automatically (due to `allowDangerousEmailAccountLinking: true`)
- User data is updated (name may be refreshed from OAuth profile)
- Email is marked as verified
- User can now sign in with either method

### Security Consideration

`allowDangerousEmailAccountLinking` is enabled for better UX, but be aware:
- If someone has access to an email account, they can link it to an OAuth provider
- This is generally acceptable since OAuth providers (Google/Microsoft) verify email ownership
- For higher security applications, consider implementing explicit account linking UI

---

## Part 5: Troubleshooting

### "Redirect URI mismatch" Error

**Problem**: OAuth provider shows error about redirect URI
**Solution**:
1. Check that redirect URIs in Google/Azure exactly match your application URL
2. Common format: `https://yourdomain.com/api/auth/callback/google` or `/azure-ad`
3. Ensure no trailing slashes
4. Wait a few minutes after adding URIs for changes to propagate

### "Access blocked: SAGA CRM has not completed the Google verification process"

**Problem**: Google shows verification warning
**Solution**:
1. In Google Cloud Console → OAuth consent screen, change to **Testing** mode
2. Add test users (your email addresses)
3. For production: Complete Google's app verification process (if needed)
4. For internal use: Keep in Testing mode (up to 100 test users)

### "Client secret is invalid" Error

**Problem**: Azure AD shows invalid client secret
**Solution**:
1. Go to Azure Portal → App registration → Certificates & secrets
2. Check if secret has expired
3. Create a new secret if needed
4. Update `AZURE_AD_CLIENT_SECRET` in your environment variables
5. Redeploy

### User Created but No Organization

**Problem**: User signs in but no organization is created
**Solution**:
1. Check server logs for errors
2. Verify database connection
3. Check Prisma schema for Organization model
4. Run `npx prisma db push` to ensure schema is synced

### OAuth Buttons Not Appearing

**Problem**: Login page doesn't show Google/Microsoft buttons
**Solution**:
1. Verify environment variables are set (check `.env.local` or Vercel dashboard)
2. Restart development server after adding variables
3. Check browser console for JavaScript errors
4. Verify NextAuth configuration in `lib/auth.ts` includes Google and AzureAD providers

---

## Part 6: Going to Production

### Google OAuth - Production Checklist

- [ ] OAuth consent screen is configured
- [ ] Production redirect URIs are added
- [ ] App verification completed (if needed for public app)
- [ ] Environment variables set in Vercel
- [ ] Tested OAuth flow on production domain

### Microsoft Azure AD - Production Checklist

- [ ] App registration created
- [ ] Production redirect URIs are added
- [ ] Client secret created and saved
- [ ] API permissions granted
- [ ] Tenant ID configured (`common` for multitenant)
- [ ] Environment variables set in Vercel
- [ ] Tested OAuth flow on production domain

### Security Best Practices

- ✅ Use environment variables for credentials (never commit to Git)
- ✅ Enable HTTPS in production (required for OAuth)
- ✅ Set secure `NEXTAUTH_SECRET` (use `openssl rand -base64 32`)
- ✅ Monitor OAuth usage in Google/Azure dashboards
- ✅ Rotate client secrets periodically (every 12-24 months)
- ✅ Set up proper error logging (Sentry)

---

## Support

If you encounter issues:

1. Check NextAuth documentation: https://next-auth.js.org/providers/google
2. Review Google OAuth docs: https://developers.google.com/identity/protocols/oauth2
3. Review Azure AD docs: https://docs.microsoft.com/en-us/azure/active-directory/develop/
4. Check server logs for detailed error messages
5. Test with `NEXTAUTH_DEBUG=true` in `.env.local` for detailed logging

---

## Summary

You've successfully set up:
- ✅ Google OAuth authentication
- ✅ Microsoft Azure AD authentication
- ✅ Automatic email verification for OAuth users
- ✅ Account linking for existing users
- ✅ Production-ready OAuth configuration

Users can now sign in with Google or Microsoft accounts for a faster, more secure authentication experience!
