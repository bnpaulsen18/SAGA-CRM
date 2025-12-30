# 🚀 Getting Started with SAGA CRM

**Quick-start guide for developers**

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([nodejs.org](https://nodejs.org))
- **PostgreSQL** database (local or cloud)
- **Git** for version control
- **Code editor** (VS Code recommended)

---

## ⚡ Quick Start (5 minutes)

### 1. Clone and Install
```bash
# Clone the repository
cd SAGA-CRM

# Install dependencies
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/saga_crm"
DIRECT_URL="postgresql://user:password@localhost:5432/saga_crm"

# Auth (generate with: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here"

# Email (optional for local dev)
RESEND_API_KEY="re_your_key_here"
RESEND_FROM_EMAIL="SAGA CRM <noreply@yourdomain.com>"

# Stripe (optional for local dev)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI (optional - has fallback messages)
ANTHROPIC_API_KEY="sk-ant-..."
```

### 3. Set Up Database
```bash
# Push schema to database
npx prisma db push

# (Optional) Seed with sample data
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Project Structure

```
SAGA-CRM/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (login, signup)
│   ├── api/                      # API routes
│   │   ├── contacts/            # Contacts CRUD
│   │   ├── donations/           # Donations + receipts
│   │   ├── campaigns/           # Campaigns CRUD
│   │   ├── reports/             # Reports & exports
│   │   └── stripe/              # Payment processing
│   ├── contacts/                # Contacts UI pages
│   ├── donations/               # Donations UI pages
│   ├── campaigns/               # Campaigns UI pages
│   ├── reports/                 # Reports UI pages
│   ├── dashboard/               # Main dashboard
│   └── layout.tsx               # Root layout
│
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── contacts/                # Contact components
│   ├── campaigns/               # Campaign components
│   └── reports/                 # Report components
│
├── lib/                          # Core libraries
│   ├── auth.ts                  # NextAuth configuration
│   ├── prisma.ts                # Prisma client
│   ├── prisma-rls.ts            # Row-Level Security
│   ├── permissions.ts           # RBAC helpers
│   ├── email/                   # Email system
│   │   ├── send-donation-receipt.ts
│   │   └── templates/           # React Email templates
│   ├── pdf/                     # PDF generation
│   │   ├── donation-receipt.tsx
│   │   └── generate-receipt.ts
│   ├── ai/                      # AI integration
│   │   └── receipt-generator.ts
│   ├── stripe/                  # Stripe integration
│   │   └── client.ts
│   ├── security/                # Security headers & rate limiting
│   └── reports/                 # Report aggregations
│
├── prisma/
│   └── schema.prisma            # Database schema (14 models)
│
├── public/                       # Static assets
│
└── types/                        # TypeScript definitions
```

---

## 🗄️ Database Schema Overview

SAGA CRM uses PostgreSQL with 14 models:

### Core Models
- **User** - System users (staff)
- **Organization** - Nonprofits (multi-tenant)
- **Contact** - Donors and supporters
- **Donation** - Individual donations
- **Campaign** - Fundraising campaigns

### Communication
- **Email** - Email logs and templates
- **SMS** - SMS message logs

### Automation
- **Workflow** - Automation workflows
- **WorkflowTrigger** - Workflow triggers
- **WorkflowAction** - Workflow actions

### Integration
- **Integration** - Third-party integrations
- **SyncLog** - Integration sync logs

### Content
- **DonationPage** - Public donation pages
- **Asset** - File uploads (logos, images)

See [prisma/schema.prisma](prisma/schema.prisma) for full schema.

---

## 🔐 Authentication Flow

### How it works:
1. User signs up at `/signup`
2. Creates new `User` and `Organization` records
3. NextAuth v5 creates session with JWT
4. All API requests include session cookie
5. RLS automatically filters data by `organizationId`

### Accessing user in API routes:
```typescript
import { requireAuth } from '@/lib/permissions';

export async function GET(req: Request) {
  const session = await requireAuth(); // Throws if not authenticated
  const { user } = session;

  // user.id, user.email, user.organizationId, user.role
}
```

### Row-Level Security (RLS):
```typescript
import { getPrismaWithRLS } from '@/lib/prisma-rls';

const prisma = await getPrismaWithRLS(); // Auto-filters by organizationId

const contacts = await prisma.contact.findMany(); // Only returns user's org contacts
```

---

## 💡 Key Features Implementation

### Creating a Donation with Auto-Receipt
```typescript
// POST /api/donations
import { sendAutomatedThankYou } from '@/lib/email/send-donation-receipt';

const donation = await prisma.donation.create({
  data: {
    contactId: 'xxx',
    amount: 100.00,
    type: 'ONE_TIME',
    organizationId: session.user.organizationId,
  },
});

// Send email asynchronously (doesn't block response)
sendAutomatedThankYou(donation.id).catch(console.error);

return NextResponse.json(donation);
```

### AI-Powered Thank-You Messages
```typescript
import { generateThankYouMessage } from '@/lib/ai/receipt-generator';

const aiMessage = await generateThankYouMessage(
  {
    amount: donation.amount,
    fundRestriction: donation.fundRestriction,
    donationDate: donation.donatedAt,
  },
  {
    firstName: contact.firstName,
    lastName: contact.lastName,
  },
  organization.name
);
// Returns: "Dear John, your generous $500 donation to the Education Fund..."
```

### PDF Receipt Generation
```typescript
import { generateDonationReceiptPDF } from '@/lib/pdf/generate-receipt';

const pdfBuffer = await generateDonationReceiptPDF(donationId);

return new NextResponse(pdfBuffer, {
  headers: {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="receipt.pdf"',
  },
});
```

### Stripe Payment Processing
```typescript
// 1. Create checkout session
const response = await fetch('/api/stripe/checkout', {
  method: 'POST',
  body: JSON.stringify({
    amount: 100.00,
    contactId: 'xxx',
    email: 'donor@example.com',
  }),
});

const { url } = await response.json();

// 2. Redirect to Stripe
window.location.href = url;

// 3. Webhook creates donation automatically when payment succeeds
```

---

## 🎨 UI Components

SAGA CRM uses **shadcn/ui** components with a custom "Midnight Impact" theme.

### Theme Colors
```css
/* Dark glassmorphic theme */
Background: linear-gradient(to-br, #0f1419, #1a1a2e, #16213e)
Glass cards: rgba(255, 255, 255, 0.05)
Borders: rgba(255, 255, 255, 0.1)
Text: White with varying opacity
Accents: Yellow (#fbbf24) and Orange (#f97316)
```

### Using UI Components
```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function MyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e]">
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">My Card</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="bg-gradient-to-r from-yellow-400 to-orange-500">
            Click Me
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Available Components
- `Button` - Primary, secondary, ghost, link variants
- `Card` - Glass-effect cards
- `Input` - Form inputs with dark theme
- `Select` - Dropdown selects
- `Dialog` - Modals
- `Badge` - Status badges
- `Skeleton` - Loading states
- `Separator` - Dividers

---

## 🧪 Testing

### Manual Testing Flow

1. **Sign up:** Create account at `/signup`
2. **Add contacts:** Navigate to `/contacts` → "New Contact"
3. **Create campaign:** Go to `/campaigns` → "New Campaign"
4. **Record donation:** Visit `/donations` → "New Donation"
   - Select contact and campaign
   - Enter amount
   - Submit → Email sent automatically
5. **Download receipt:** In donations list, click "PDF" button
6. **View reports:** Navigate to `/reports` to see analytics
7. **Export data:** Click "Export CSV" on reports page

### Testing Stripe Integration

1. Set up Stripe test keys in `.env.local`
2. Use Stripe CLI for local webhooks:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
3. Use test card: `4242 4242 4242 4242`
4. Verify donation created and email sent

### Testing Email Locally

**Option 1: Use Resend (recommended)**
- Sign up for free Resend account
- Configure `RESEND_API_KEY`
- Emails will be sent for real

**Option 2: Console logging**
- Remove `RESEND_API_KEY` from `.env.local`
- Email content will be logged to console instead

---

## 🛠️ Common Development Tasks

### Add a New API Endpoint
```typescript
// app/api/my-endpoint/route.ts
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/permissions';
import { getPrismaWithRLS } from '@/lib/prisma-rls';

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const prisma = await getPrismaWithRLS();

    const data = await prisma.myModel.findMany();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Add a New Page
```tsx
// app/my-page/page.tsx
import { requireAuth } from '@/lib/permissions';

export default async function MyPage() {
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] p-8">
      <h1 className="text-4xl font-bold text-white">My Page</h1>
      <p className="text-white/60">Welcome, {session.user.name}!</p>
    </div>
  );
}
```

### Add a Database Model
```prisma
// prisma/schema.prisma
model MyNewModel {
  id             String   @id @default(cuid())
  name           String
  organizationId String   // Required for RLS
  organization   Organization @relation(fields: [organizationId], references: [id])
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

Then:
```bash
npx prisma db push
npx prisma generate
```

### Add a React Component
```tsx
// components/my-component.tsx
interface MyComponentProps {
  title: string;
  onClick: () => void;
}

export default function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:shadow-lg transition-all"
    >
      {title}
    </button>
  );
}
```

---

## 🐛 Troubleshooting

### "Database connection failed"
**Solution:**
```bash
# Verify DATABASE_URL in .env.local
# Test connection:
npx prisma db pull
```

### "NextAuth session not working"
**Solution:**
```bash
# Generate new NEXTAUTH_SECRET:
openssl rand -base64 32

# Add to .env.local
# Restart dev server
```

### "Email not sending"
**Possible causes:**
1. Missing `RESEND_API_KEY` → Add to `.env.local`
2. Invalid sender email → Verify domain in Resend dashboard
3. Network error → Check console logs

### "PDF generation fails"
**Solution:**
```bash
# Reinstall dependencies
npm install @react-pdf/renderer

# Check that donation has all required data
```

### "Stripe webhook not working locally"
**Solution:**
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy webhook secret to .env.local as STRIPE_WEBHOOK_SECRET
```

### "Rate limited error"
**Solution:**
Rate limits are in-memory and reset on server restart. For development, you can increase limits in [lib/security/rate-limit.ts](lib/security/rate-limit.ts).

### "RLS not filtering data correctly"
**Checklist:**
1. Are you using `getPrismaWithRLS()` instead of `prisma`?
2. Does your model have `organizationId` field?
3. Is the user authenticated?
4. Check session: `console.log(session.user.organizationId)`

---

## 📦 Production Deployment

### Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Set environment variables in Vercel dashboard
# DATABASE_URL, NEXTAUTH_SECRET, RESEND_API_KEY, etc.

# 5. Configure Stripe webhook
# Point to: https://yourdomain.vercel.app/api/stripe/webhook
```

### Railway

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize
railway init

# 4. Add PostgreSQL
railway add --plugin postgresql

# 5. Deploy
railway up

# 6. Set environment variables
railway variables set NEXTAUTH_SECRET=xxx
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
docker build -t saga-crm .
docker run -p 3000:3000 --env-file .env.production saga-crm
```

---

## 🔑 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `DIRECT_URL` | ✅ | Direct DB connection (for migrations) | Same as DATABASE_URL |
| `NEXTAUTH_URL` | ✅ | Application URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | ✅ | Session encryption key | Generate with `openssl rand -base64 32` |
| `RESEND_API_KEY` | 🟡 | Resend email API key | `re_...` |
| `RESEND_FROM_EMAIL` | 🟡 | Sender email address | `SAGA <no-reply@yourdomain.com>` |
| `STRIPE_SECRET_KEY` | 🟡 | Stripe secret key | `sk_test_...` or `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | 🟡 | Stripe publishable key | `pk_test_...` or `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | 🟡 | Stripe webhook signing secret | `whsec_...` |
| `ANTHROPIC_API_KEY` | ⚪ | Claude API key for AI features | `sk-ant-...` |

**Legend:**
- ✅ Required for app to run
- 🟡 Required for feature to work
- ⚪ Optional (has fallback)

---

## 📚 Additional Resources

- **[LAUNCH-READINESS.md](LAUNCH-READINESS.md)** - Complete feature list and deployment guide
- **[API-REFERENCE.md](API-REFERENCE.md)** - Full API documentation
- **[IMPLEMENTATION-STATUS.md](IMPLEMENTATION-STATUS.md)** - Current progress and roadmap
- **[SAGA-FULL-VISION-ROADMAP.md](SAGA-FULL-VISION-ROADMAP.md)** - Long-term feature roadmap

### External Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth v5 Docs](https://authjs.dev)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Resend Docs](https://resend.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com)

---

## 💬 Support

For questions or issues:

1. Check this guide and other documentation
2. Review code comments in relevant files
3. Check console logs for error messages
4. Review [API-REFERENCE.md](API-REFERENCE.md) for endpoint details

---

## 🎯 Next Steps

Now that you have the project running:

1. ✅ **Explore the codebase** - Start with `app/` directory
2. ✅ **Test core features** - Create contacts, donations, campaigns
3. ✅ **Review documentation** - Read LAUNCH-READINESS.md
4. ✅ **Configure services** - Set up Resend, Stripe, Anthropic
5. ✅ **Deploy to production** - Use Vercel or Railway
6. ✅ **Invite beta users** - Test with real nonprofits

---

**Welcome to SAGA CRM development! 🎉**

*Last updated: December 29, 2025*
