-- Disable Row Level Security (RLS) on all tables
-- This fixes the "Tenant or user not found" error that occurs because
-- the application uses NextAuth (not Supabase Auth) and doesn't set
-- the required RLS context variables (app.current_user_id, app.current_org_id)
--
-- The application already has multi-tenancy security at the application level
-- through lib/prisma-rls.ts which enforces organizationId filtering on all queries.

-- Core tables
ALTER TABLE "organizations" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;

-- Contact management
ALTER TABLE "contacts" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "interactions" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "tasks" DISABLE ROW LEVEL SECURITY;

-- Donations
ALTER TABLE "donations" DISABLE ROW LEVEL SECURITY;

-- Campaigns and emails
ALTER TABLE "campaigns" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "campaign_contacts" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "emails" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "email_recipients" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "email_logs" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "email_subscribers" DISABLE ROW LEVEL SECURITY;

-- NextAuth tables (if they have RLS)
ALTER TABLE "accounts" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "sessions" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "verification_tokens" DISABLE ROW LEVEL SECURITY;

-- Audit logs
ALTER TABLE "audit_logs" DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
