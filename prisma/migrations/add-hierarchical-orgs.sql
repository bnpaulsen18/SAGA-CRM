-- Migration: Add Hierarchical Organizations and Platform Admin Support
-- Run this in Supabase SQL Editor

-- 1. Create new enum types
CREATE TYPE "OrganizationType" AS ENUM ('INDEPENDENT', 'PARENT', 'PROJECT');
CREATE TYPE "TaxExemptStatus" AS ENUM (
  'EXEMPT_501C3',
  'EXEMPT_501C4',
  'EXEMPT_501C6',
  'EXEMPT_501C7',
  'EXEMPT_OTHER',
  'FOR_PROFIT',
  'PENDING'
);
CREATE TYPE "FundRestriction" AS ENUM (
  'UNRESTRICTED',
  'TEMPORARILY_RESTRICTED',
  'PERMANENTLY_RESTRICTED',
  'PROGRAM_RESTRICTED',
  'PROJECT_DESIGNATED'
);

-- 2. Add PLATFORM_ADMIN to existing UserRole enum
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'PLATFORM_ADMIN';

-- 3. Update organizations table (lowercase)
ALTER TABLE "organizations" ADD COLUMN "organizationType" "OrganizationType" NOT NULL DEFAULT 'INDEPENDENT';
ALTER TABLE "organizations" ADD COLUMN "parentOrganizationId" TEXT;
ALTER TABLE "organizations" ADD COLUMN "taxExemptStatus" "TaxExemptStatus" NOT NULL DEFAULT 'EXEMPT_501C3';
ALTER TABLE "organizations" ADD COLUMN "fiscalYearEnd" TEXT;
ALTER TABLE "organizations" ADD COLUMN "missionStatement" TEXT;
ALTER TABLE "organizations" ADD COLUMN "primaryProgram" TEXT;
ALTER TABLE "organizations" ADD COLUMN "allowSubProjects" BOOLEAN NOT NULL DEFAULT false;

-- 4. Add self-referential foreign key for organization hierarchy
ALTER TABLE "organizations"
  ADD CONSTRAINT "organizations_parentOrganizationId_fkey"
  FOREIGN KEY ("parentOrganizationId")
  REFERENCES "organizations"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- 5. Create index for parent organization lookups
CREATE INDEX "organizations_parentOrganizationId_idx" ON "organizations"("parentOrganizationId");

-- 6. Update users table for platform admins (lowercase)
ALTER TABLE "users" ADD COLUMN "isPlatformAdmin" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ALTER COLUMN "organizationId" DROP NOT NULL;

-- 7. Update donations table for fund accounting (lowercase)
ALTER TABLE "donations" ADD COLUMN "fundRestriction" "FundRestriction" NOT NULL DEFAULT 'UNRESTRICTED';
ALTER TABLE "donations" ADD COLUMN "designatedProjectId" TEXT;
ALTER TABLE "donations" ADD COLUMN "donorIntent" TEXT;
ALTER TABLE "donations" ADD COLUMN "passedThroughToProject" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "donations" ADD COLUMN "disbursedAt" TIMESTAMP(3);

-- 8. Add foreign key for designated project
ALTER TABLE "donations"
  ADD CONSTRAINT "donations_designatedProjectId_fkey"
  FOREIGN KEY ("designatedProjectId")
  REFERENCES "organizations"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- 9. Create index for designated project lookups
CREATE INDEX "donations_designatedProjectId_idx" ON "donations"("designatedProjectId");

-- 10. Add comments for documentation
COMMENT ON COLUMN "organizations"."organizationType" IS 'INDEPENDENT: Standalone nonprofit, PARENT: Fiscal sponsor with sub-projects, PROJECT: Sub-project under parent';
COMMENT ON COLUMN "organizations"."parentOrganizationId" IS 'For PROJECT type: references the parent organization (fiscal sponsor)';
COMMENT ON COLUMN "organizations"."taxExemptStatus" IS 'IRS tax-exempt classification (501c3, 501c4, etc.)';
COMMENT ON COLUMN "donations"."fundRestriction" IS 'IRS-compliant fund accounting classification';
COMMENT ON COLUMN "donations"."designatedProjectId" IS 'When donation is designated for a specific sub-project under a parent org';
COMMENT ON COLUMN "donations"."donorIntent" IS 'Donor-specified restrictions or intended use of funds';
COMMENT ON COLUMN "donations"."passedThroughToProject" IS 'For fiscal sponsorship: tracks if donation received by parent was disbursed to project';
COMMENT ON COLUMN "users"."isPlatformAdmin" IS 'SAGA platform owner - can access all organizations';

-- Migration complete!
-- Next step: Create your first platform admin user
