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

-- Expected output:
-- idempotencyKey | text | YES | NULL
-- fraudScore | integer | YES | 0
-- fraudFlags | ARRAY | YES | ARRAY[]::text[]
-- reviewStatus | USER-DEFINED | YES | 'APPROVED'::ReviewStatus
-- reviewedAt | timestamp(3) without time zone | YES | NULL
-- reviewedBy | text | YES | NULL
