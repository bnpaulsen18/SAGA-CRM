-- Create Platform Admin User
-- Run this AFTER running add-hierarchical-orgs.sql
-- Replace the values below with your actual admin credentials

-- NOTE: You'll need to replace 'HASHED_PASSWORD_HERE' with an actual bcrypt hash
-- To generate a bcrypt hash for your password, you can use an online tool or Node.js:
--
-- In Node.js REPL (run: node):
-- const bcrypt = require('bcryptjs');
-- bcrypt.hashSync('YourPassword123!', 10);

INSERT INTO "User" (
  id,
  email,
  password,
  "firstName",
  "lastName",
  role,
  "isPlatformAdmin",
  "organizationId",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'admin@saga-crm.com',  -- Replace with your email
  'HASHED_PASSWORD_HERE',  -- Replace with bcrypt hash of your password
  'Platform',
  'Admin',
  'PLATFORM_ADMIN',
  true,
  NULL,  -- Platform admins don't belong to a specific organization
  NOW(),
  NOW()
);

-- Verify the user was created
SELECT
  id,
  email,
  "firstName",
  "lastName",
  role,
  "isPlatformAdmin",
  "organizationId"
FROM "User"
WHERE email = 'admin@saga-crm.com';
