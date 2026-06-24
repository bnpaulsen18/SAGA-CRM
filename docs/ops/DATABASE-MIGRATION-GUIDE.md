# Database Migration Guide - Fraud Detection Fields

## Step-by-Step Instructions (5 minutes)

This guide will help you add the fraud detection fields to your database. Follow each step carefully.

---

## Prerequisites ✅

- [ ] You have access to your Supabase dashboard
- [ ] You have the SQL migration file ready (it's at `prisma/migrations/manual-fraud-detection.sql`)
- [ ] You're logged into Supabase

---

## Step 1: Open the Migration SQL File

**On Windows:**
1. Open File Explorer
2. Navigate to: `C:\Users\BeauP\OneDrive\Desktop\Saga\SAGA-CRM\prisma\migrations`
3. Double-click `manual-fraud-detection.sql`
4. The file should open in Notepad or your default text editor
5. **Select ALL text** (Ctrl+A)
6. **Copy** the text (Ctrl+C)

**What you'll see in the file:**
```sql
-- Manual Migration: Add Fraud Detection Fields to Donations
-- Run this in your Supabase SQL editor or via psql

-- Step 1: Add new enum type for ReviewStatus
CREATE TYPE "ReviewStatus" AS ENUM ('APPROVED', 'PENDING_REVIEW', 'REJECTED', 'REFUNDED');

-- Step 2: Add new columns to donations table
ALTER TABLE "donations"
ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT,
...
```

✅ **Checkpoint:** You should have the SQL copied to your clipboard

---

## Step 2: Open Supabase Dashboard

1. Open your web browser (Chrome, Edge, Firefox, etc.)
2. Go to: https://supabase.com
3. Click **"Sign in"** (top right)
4. Log in with your credentials
5. You'll see your **Projects** page

**What you'll see:**
- A list of your Supabase projects
- Each project has a name and a "View" button

✅ **Checkpoint:** You can see your SAGA-CRM project

---

## Step 3: Select Your SAGA-CRM Project

1. Find your **SAGA-CRM** project in the list
2. Click on the project name or the **"Open"** button
3. Wait for the project dashboard to load (2-3 seconds)

**What you'll see:**
- Left sidebar with menu options:
  - Table Editor
  - SQL Editor ← **We need this one**
  - Database
  - Authentication
  - Storage
  - etc.

✅ **Checkpoint:** You're inside your project dashboard

---

## Step 4: Open SQL Editor

1. Look at the **left sidebar**
2. Find the **"SQL Editor"** option (it has a `</>` icon)
3. Click **"SQL Editor"**

**What you'll see:**
- A new page with:
  - Left panel: "New query" button and saved queries
  - Right panel: Large text area for SQL code
  - Bottom: "Run" button (usually blue or green)

✅ **Checkpoint:** You're in the SQL Editor with an empty query

---

## Step 5: Paste the Migration SQL

1. Click inside the **large text area** (SQL editor)
2. Make sure it's empty (if not, select all with Ctrl+A and delete)
3. **Paste** the SQL you copied in Step 1 (Ctrl+V or right-click → Paste)

**What you should see in the editor:**
```sql
-- Manual Migration: Add Fraud Detection Fields to Donations
-- Run this in your Supabase SQL editor or via psql

-- Step 1: Add new enum type for ReviewStatus
CREATE TYPE "ReviewStatus" AS ENUM ('APPROVED', 'PENDING_REVIEW', 'REJECTED', 'REFUNDED');

-- Step 2: Add new columns to donations table
ALTER TABLE "donations"
ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT,
ADD COLUMN IF NOT EXISTS "fraudScore" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "fraudFlags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS "reviewStatus" "ReviewStatus" DEFAULT 'APPROVED',
ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "reviewedBy" TEXT;

-- Step 3: Add unique constraint on idempotencyKey
ALTER TABLE "donations"
ADD CONSTRAINT "donations_idempotencyKey_unique" UNIQUE ("idempotencyKey");

-- Step 4: Add indexes for fraud monitoring queries
CREATE INDEX IF NOT EXISTS "donations_reviewStatus_idx" ON "donations" ("reviewStatus");
CREATE INDEX IF NOT EXISTS "donations_fraudScore_idx" ON "donations" ("fraudScore");
CREATE INDEX IF NOT EXISTS "donations_idempotencyKey_idx" ON "donations" ("idempotencyKey");

-- Step 5: Verify changes
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'donations'
AND column_name IN ('idempotencyKey', 'fraudScore', 'fraudFlags', 'reviewStatus', 'reviewedAt', 'reviewedBy')
ORDER BY ordinal_position;
```

✅ **Checkpoint:** SQL is pasted in the editor (you should see all the text above)

---

## Step 6: Run the Migration

1. Look for the **"Run"** button (usually at the bottom or top right of the SQL editor)
2. **Click "Run"** to execute the migration
3. **Wait** for the query to complete (5-10 seconds)

**What happens:**
- Supabase will execute all the SQL commands
- It will create the new enum type
- It will add 6 new columns to your donations table
- It will create indexes for fast queries
- It will run a verification query

**What you'll see:**

**✅ SUCCESS (What you want to see):**
```
Success. Rows returned: 6

| column_name     | data_type  | is_nullable | column_default           |
|-----------------|------------|-------------|--------------------------|
| idempotencyKey  | text       | YES         | NULL                     |
| fraudScore      | integer    | YES         | 0                        |
| fraudFlags      | ARRAY      | YES         | ARRAY[]::text[]          |
| reviewStatus    | USER-DEFINED| YES        | 'APPROVED'::ReviewStatus |
| reviewedAt      | timestamp(3)| YES        | NULL                     |
| reviewedBy      | text       | YES         | NULL                     |
```

**❌ ERROR (If you see this):**

**Error: type "ReviewStatus" already exists**
- **What it means:** You already ran this migration before
- **What to do:** Skip to Step 7 (Verification), the migration is already applied

**Error: column "idempotencyKey" already exists**
- **What it means:** You already ran this migration before
- **What to do:** Skip to Step 7 (Verification), the migration is already applied

**Error: permission denied for table donations**
- **What it means:** You don't have permission to modify the table
- **What to do:** Make sure you're logged in as the project owner, or contact your database admin

✅ **Checkpoint:** Migration executed successfully (you see the 6 rows in the results)

---

## Step 7: Verify the Migration (IMPORTANT!)

Let's double-check that everything worked correctly.

1. **Clear** the SQL editor (select all, delete)
2. **Paste** this verification query:
```sql
-- Verify fraud detection fields exist
SELECT
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'donations'
  AND column_name IN ('idempotencyKey', 'fraudScore', 'fraudFlags', 'reviewStatus')
ORDER BY column_name;
```
3. Click **"Run"**

**What you should see:**
```
Success. Rows returned: 4

| column_name    | data_type    | column_default           |
|----------------|--------------|--------------------------|
| fraudFlags     | ARRAY        | ARRAY[]::text[]          |
| fraudScore     | integer      | 0                        |
| idempotencyKey | text         | NULL                     |
| reviewStatus   | USER-DEFINED | 'APPROVED'::ReviewStatus |
```

**If you see all 4 rows:**
✅ **SUCCESS!** Migration is complete and working

**If you see 0 rows:**
❌ Migration didn't work. Go back to Step 5 and try again

✅ **Checkpoint:** All 4 new columns exist in the database

---

## Step 8: Test with a Real Donation (Optional)

Let's make sure donations still work with the new fields.

1. **Clear** the SQL editor
2. **Paste** this test query:
```sql
-- Check a recent donation to see fraud fields
SELECT
  id,
  amount,
  fraudScore,
  reviewStatus,
  fraudFlags,
  createdAt
FROM donations
ORDER BY createdAt DESC
LIMIT 1;
```
3. Click **"Run"**

**What you'll see:**

**If you have existing donations:**
```
| id      | amount | fraudScore | reviewStatus | fraudFlags | createdAt   |
|---------|--------|------------|--------------|------------|-------------|
| don_123 | 50.00  | 0          | APPROVED     | {}         | 2026-01-13  |
```
- `fraudScore` = 0 (default for existing donations)
- `reviewStatus` = APPROVED (default)
- `fraudFlags` = {} (empty array)

**If you have no donations yet:**
```
Success. Rows returned: 0
```
- This is normal if you haven't created any donations yet
- The fields will populate when you create new donations

✅ **Checkpoint:** Query runs successfully (with or without results)

---

## Step 9: Done! 🎉

**Congratulations!** Your database migration is complete.

### What Changed:

**New Columns Added to `donations` Table:**
1. `idempotencyKey` - Prevents duplicate charges
2. `fraudScore` - Risk score 0-100 for each donation
3. `fraudFlags` - Array of suspicious behaviors detected
4. `reviewStatus` - APPROVED, PENDING_REVIEW, REJECTED, or REFUNDED
5. `reviewedAt` - When admin reviewed the donation
6. `reviewedBy` - Which admin reviewed it

**New Indexes for Fast Queries:**
- Index on `reviewStatus` (find pending reviews quickly)
- Index on `fraudScore` (find high-risk donations)
- Index on `idempotencyKey` (prevent duplicates fast)

### What Happens Now:

**Automatically (from now on):**
- ✅ Every new donation gets a fraud score before processing
- ✅ High-risk donations (score >= 70) are auto-blocked
- ✅ Medium-risk donations (score 40-69) are flagged for admin review
- ✅ All fraud data is stored in the database
- ✅ Admin dashboard at `/admin/fraud-monitor` will show real data

**To Test:**
1. Create a test donation at `/donations/new`
2. Check the fraud score in the database
3. Visit `/admin/fraud-monitor` to see the dashboard

---

## Troubleshooting

### Problem: "Run" button is grayed out or disabled

**Solution:**
1. Click inside the SQL editor to focus it
2. Make sure you pasted the SQL correctly
3. Try refreshing the page and pasting again

---

### Problem: Error says "relation 'donations' does not exist"

**Solution:**
1. You might be in the wrong database
2. Check the database connection at the top of SQL Editor
3. Make sure you selected the correct project

---

### Problem: Error says "syntax error near 'CREATE TYPE'"

**Solution:**
1. Make sure you copied the ENTIRE SQL file
2. Don't skip any lines
3. The file should start with `CREATE TYPE "ReviewStatus"...`

---

### Problem: I see "type already exists" but the columns don't show up

**Solution:**
1. Run only the ALTER TABLE commands (without CREATE TYPE):
```sql
-- Run this if ReviewStatus type already exists
ALTER TABLE "donations"
ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT,
ADD COLUMN IF NOT EXISTS "fraudScore" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "fraudFlags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS "reviewStatus" "ReviewStatus" DEFAULT 'APPROVED',
ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "reviewedBy" TEXT;

ALTER TABLE "donations"
ADD CONSTRAINT "donations_idempotencyKey_unique" UNIQUE ("idempotencyKey");

CREATE INDEX IF NOT EXISTS "donations_reviewStatus_idx" ON "donations" ("reviewStatus");
CREATE INDEX IF NOT EXISTS "donations_fraudScore_idx" ON "donations" ("fraudScore");
CREATE INDEX IF NOT EXISTS "donations_idempotencyKey_idx" ON "donations" ("idempotencyKey");
```

---

## Quick Verification Checklist

Before you close Supabase, verify:

- [ ] `SELECT * FROM donations LIMIT 1;` shows new columns (fraudScore, reviewStatus, etc.)
- [ ] No error messages in SQL Editor
- [ ] All 4 core columns exist: idempotencyKey, fraudScore, fraudFlags, reviewStatus
- [ ] Existing donations have fraudScore = 0 and reviewStatus = APPROVED

**If all checkboxes are checked:** ✅ **Migration successful!**

---

## Next Steps

1. **Test the fraud detection:**
   - Create a test donation at `/donations/new`
   - Check if fraud score is calculated
   - View it in admin dashboard at `/admin/fraud-monitor`

2. **Monitor for fraud:**
   - Check the dashboard daily
   - Review flagged donations (score >= 40)
   - Approve or reject suspicious donations

3. **Optional: Run the demo:**
   - `npx tsx scripts/demo-fraud-detection.ts`
   - See how different scenarios are scored

---

**Need Help?**
If you get stuck on any step, let me know which step number and what error message you're seeing, and I'll help you troubleshoot!
