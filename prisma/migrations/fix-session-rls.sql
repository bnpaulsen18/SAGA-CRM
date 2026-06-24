-- Fix Session-Level Row Security
-- The issue: row_security is ON at the session level, even though table-level RLS is disabled
-- This causes "Tenant or user not found" errors because the session enforces RLS checking

-- Solution 1: Grant BYPASSRLS to the postgres role
-- This allows the role to bypass RLS checking entirely
ALTER ROLE postgres BYPASSRLS;

-- Solution 2: Also set row_security = off for the postgres role
-- This ensures new sessions start with row_security off
ALTER ROLE postgres SET row_security = off;

-- Verify the changes
SELECT rolname, rolbypassrls
FROM pg_roles
WHERE rolname = 'postgres';

-- Check current session setting
SHOW row_security;
