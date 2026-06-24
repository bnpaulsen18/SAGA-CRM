/**
 * Enable Postgres RLS (deny-by-default) on every table in the public schema.
 *
 * Why: SAGA connects as the `postgres` owner role (which bypasses RLS) and does
 * its own org-level filtering in app code (lib/prisma-rls.ts), so the app is
 * unaffected. Enabling RLS locks the Supabase Data API (anon / authenticated
 * roles) out of the tables — defense-in-depth against public exposure.
 *
 * RUN THIS AFTER ANY `prisma db push` THAT ADDS NEW TABLES — new tables default
 * to RLS-disabled and would otherwise be reachable via the Data API.
 *
 *   npx tsx scripts/enable-rls.ts
 */
import { config } from 'dotenv'
config({ path: '.env' })
config({ path: '.env.local', override: true })
import { Client } from 'pg'

async function main() {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL
  if (!url) { console.error('no DB url in .env / .env.local'); process.exit(1) }
  const c = new Client({ connectionString: url, connectionTimeoutMillis: 10000 })
  await c.connect()
  await c.query(`DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', r.tablename);
  END LOOP;
END $$;`)
  const res = await c.query(
    `SELECT count(*)::int AS total, count(*) FILTER (WHERE rowsecurity)::int AS rls_on
     FROM pg_tables WHERE schemaname = 'public'`
  )
  console.log(`public tables: ${res.rows[0].total} | RLS enabled on: ${res.rows[0].rls_on}`)
  await c.end()
}
main().catch((e) => { console.error('ERR', e); process.exit(1) })
