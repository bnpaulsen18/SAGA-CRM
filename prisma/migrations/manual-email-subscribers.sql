-- Manual Migration: Email Subscribers Table
-- Run this in Supabase SQL Editor if prisma db push fails
-- Created: 2026-01-12

-- Create enum type for subscriber status
DO $$ BEGIN
    CREATE TYPE "SubscriberStatus" AS ENUM ('PENDING', 'ACTIVE', 'UNSUBSCRIBED', 'BOUNCED', 'COMPLAINED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create email_subscribers table
CREATE TABLE IF NOT EXISTS "email_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'landing_page',
    "status" "SubscriberStatus" NOT NULL DEFAULT 'PENDING',
    "verificationToken" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "unsubscribeToken" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_subscribers_pkey" PRIMARY KEY ("id")
);

-- Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS "email_subscribers_email_key"
    ON "email_subscribers"("email");

CREATE UNIQUE INDEX IF NOT EXISTS "email_subscribers_verificationToken_key"
    ON "email_subscribers"("verificationToken");

CREATE UNIQUE INDEX IF NOT EXISTS "email_subscribers_unsubscribeToken_key"
    ON "email_subscribers"("unsubscribeToken");

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "email_subscribers_email_idx"
    ON "email_subscribers"("email");

CREATE INDEX IF NOT EXISTS "email_subscribers_status_idx"
    ON "email_subscribers"("status");

CREATE INDEX IF NOT EXISTS "email_subscribers_createdAt_idx"
    ON "email_subscribers"("createdAt");

-- Verify table creation
SELECT
    'email_subscribers table created successfully' as message,
    COUNT(*) as row_count
FROM "email_subscribers";
