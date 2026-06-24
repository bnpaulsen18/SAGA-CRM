# SAGA CRM Setup Notes

## Week 1 Setup (Completed: November 28, 2024)

### Accounts Created
- [x] GitHub: github.com/bnpaulsen18
- [x] Vercel: vercel.com
- [x] Supabase: app.supabase.com
- [x] Cloudflare: cloudflare.com (DNS for custom domain)

### Repository
- URL: https://github.com/bnpaulsen18/SAGA-CRM
- Main branch: main
- Git strategy: Direct commits to main (solo development)

### Production Deployment
- Primary URL: https://sagacrm.io
- WWW URL: https://www.sagacrm.io
- Vercel URL: https://saga-crm-jxo7.vercel.app
- Auto-deploys from main branch

### Database
- Provider: Supabase
- Project: mwqsvqvbrjekoxkdizqw
- Region: us-east-2 (AWS)
- Connection: Pooled connection via PgBouncer (port 6543)

### Environment Variables
Set in both Vercel dashboard and .env.local:
- DATABASE_URL (pooled connection)
- DIRECT_URL (direct connection)
- NEXTAUTH_URL (localhost for dev, sagacrm.io for prod)
- NEXTAUTH_SECRET

## Development Workflow

1. Start development environment:
   ```bash
   npm run dev          # Dev server on http://localhost:3001
   npx prisma studio    # Database GUI on http://localhost:51212
   ```

2. Make changes and test locally

3. Commit and push:
   ```bash
   git add .
   git commit -m "Description"
   git push
   ```

4. Vercel automatically deploys to production

## Tech Stack Details

### Framework & Language
- Next.js 16.0.3 with App Router
- TypeScript 5.x
- React 19.2.0

### Styling
- Tailwind CSS v4
- shadcn/ui components
- Radix UI primitives

### Database & ORM
- PostgreSQL (Supabase)
- Prisma 7.0.1 with new config format
- PostgreSQL adapter (@prisma/adapter-pg)
- Connection pooling with pg package

### Deployment & Hosting
- Vercel (hosting + serverless functions)
- Cloudflare (DNS + domain management)

## Troubleshooting

### Database Connection Issues
- Check DATABASE_URL has URL-encoded password (! becomes %21)
- Verify Supabase project is running
- Use pooled connection (port 6543) for serverless
- Use direct connection (port 5432) for migrations

### Build Errors
- Run `npm run build` locally first
- Check for TypeScript errors
- Ensure Prisma Client is generated: `npx prisma generate`
- Verify prisma.config.ts has fallback: `process.env.DATABASE_URL || "postgresql://placeholder"`

### Deployment Issues
- Check Vercel build logs in dashboard
- Verify environment variables are set in Vercel
- Ensure postinstall script runs: `"postinstall": "prisma generate"`
- Check for missing dependencies in package.json

### Development Server Issues
- Port 3000 in use? Server will use 3001 instead
- Clear .next folder: `rm -rf .next` and restart
- Check for missing .env.local file

## Project Structure

```
SAGA-CRM/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── test/          # Database connection test
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   └── prisma.ts         # Prisma client with PG adapter
├── prisma/               # Database
│   └── schema.prisma     # Database schema
├── prisma.config.ts      # Prisma 7 configuration
├── .env.local            # Local environment variables (not committed)
├── .env.example          # Environment variable template
└── README.md             # Project documentation
```

## Database Schema

### Organizations Table
- Stores nonprofit organization information
- Fields: id, name, ein (unique), email, phone, website
- One-to-many relationship with users

### Users Table
- Stores user accounts
- Fields: id, email, password, firstName, lastName, role
- Foreign key: organizationId
- Enum: UserRole (ADMIN, MEMBER, VIEWER)

## Next Steps (Week 2)

- [ ] Complete Prisma schema (add remaining tables)
- [ ] Implement NextAuth.js authentication
- [ ] Build registration flow
- [ ] Build login flow
- [ ] Create dashboard layout
- [ ] Add password hashing with bcrypt

## Notes

- SSL certificates auto-managed by Vercel
- DNS configured via Cloudflare (A record: 216.198.79.1)
- Prisma Studio accessible at http://localhost:51212 when running
- Development server runs on port 3001 (port 3000 was in use)
- Using Turbopack for faster builds in Next.js 16
