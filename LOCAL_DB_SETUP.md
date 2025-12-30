# Local PostgreSQL Setup (Optional)

If your Supabase project is paused and you want to continue development immediately, you can use a local PostgreSQL database.

## Option A: Docker (Easiest)

1. Install Docker Desktop for Windows
2. Run:
   ```bash
   docker run --name saga-postgres -e POSTGRES_PASSWORD=localdev123 -p 5432:5432 -d postgres:15
   ```
3. Update `.env.local`:
   ```
   DATABASE_URL="postgresql://postgres:localdev123@localhost:5432/postgres"
   DIRECT_URL="postgresql://postgres:localdev123@localhost:5432/postgres"
   ```
4. Run migrations:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

## Option B: Install PostgreSQL Directly

1. Download: https://www.postgresql.org/download/windows/
2. Install with password: `localdev123`
3. Update `.env.local` (same as Option A)
4. Run migrations (same as Option A)

## Return to Supabase Later

When your Supabase project is restored:
1. Restore the original `.env.local` values
2. Run `npx prisma db push` to sync schema
3. Continue development

---

**IMPORTANT**: This is only for local development. DO NOT use local database for production!
