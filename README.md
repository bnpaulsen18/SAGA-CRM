# SAGA CRM

AI-powered nonprofit customer relationship management platform.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma 7
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bnpaulsen18/SAGA-CRM.git
cd SAGA-CRM
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create `.env.local` and add your database credentials:

```env
DATABASE_URL="your_supabase_connection_string"
DIRECT_URL="your_supabase_direct_url"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_generated_secret"
```

4. Generate Prisma Client:
```bash
npx prisma generate
```

5. Start development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Development

### Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema changes
npm run db:studio    # Open Prisma Studio
```

### Database

View and edit data:
```bash
npx prisma studio
```

## Deployment

Automatically deploys to Vercel on push to `main` branch.

Production URL: [saga-crm-j.vercel.app](https://saga-crm-j.vercel.app)

## Project Structure

```
SAGA-CRM/
├── app/              # Next.js App Router
│   ├── api/         # API routes
│   └── page.tsx     # Home page
├── lib/             # Utility functions
│   └── prisma.ts   # Prisma client
├── prisma/          # Database schema
│   └── schema.prisma
├── components/      # React components
│   └── ui/         # shadcn/ui components
└── public/          # Static files
```

## Week 1 Status

✅ Next.js project initialized
✅ TypeScript + Tailwind configured
✅ shadcn/ui components installed
✅ Supabase database connected
✅ Prisma ORM configured
✅ Database schema created
✅ Deployed to Vercel
✅ Production-ready foundation

## Database Schema

### Organizations
- Unique EIN
- Contact information
- One-to-many relationship with Users

### Users
- Email/password authentication
- Role-based access (ADMIN, MEMBER, VIEWER)
- Organization membership

## License

MIT

## Contributing

Week 1 foundation complete. Ready for feature development!
