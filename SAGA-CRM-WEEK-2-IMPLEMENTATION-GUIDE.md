# SAGA CRM - Week 2 Implementation Guide

**Goal:** Build authentication system and expand database schema

**Time Estimate:** 18-20 hours (3-4 hours per day over 5 days)

**Prerequisites:**
- ✅ Week 1 complete (Next.js app deployed)
- ✅ Database connected (Supabase + Prisma)
- ✅ Environment variables configured

---

## Week 2 Overview

### What You'll Build

By the end of Week 2, you'll have:
- ✅ Complete database schema (17 total tables)
- ✅ NextAuth.js authentication system
- ✅ User registration with email/password
- ✅ Login/logout functionality
- ✅ Protected dashboard route
- ✅ Basic dashboard layout with navigation

### Daily Breakdown

- **Day 1:** Expand Prisma schema (all tables)
- **Day 2:** Install and configure NextAuth.js
- **Day 3:** Build registration flow
- **Day 4:** Build login flow and dashboard
- **Day 5:** Add navigation and polish

---

## DAY 1: Database Schema (4 hours)

### Step 1: Update Prisma Schema (90 min)

**1.1: Read Current Schema**

First, let's see what we have:

```bash
# View current schema
cat prisma/schema.prisma
```

**1.2: Add Contact Models**

Add to `prisma/schema.prisma`:

```prisma
// Contacts (Donors/Volunteers)
model Contact {
  id             String   @id @default(cuid())
  organizationId String

  // Basic Info
  firstName      String
  lastName       String
  email          String
  phone          String?

  // Address
  street         String?
  city           String?
  state          String?
  zip            String?
  country        String   @default("USA")

  // Contact Type
  type           ContactType @default(DONOR)
  status         ContactStatus @default(ACTIVE)

  // Metadata
  tags           String[] // ["major_donor", "monthly_giver"]
  notes          String?

  // Relationships
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  donations      Donation[]
  interactions   Interaction[]
  campaignContacts CampaignContact[]

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([organizationId])
  @@index([email])
  @@map("contacts")
}

enum ContactType {
  DONOR
  VOLUNTEER
  BOARD_MEMBER
  STAFF
  VENDOR
  OTHER
}

enum ContactStatus {
  ACTIVE
  INACTIVE
  DECEASED
  DO_NOT_CONTACT
}
```

**1.3: Add Donation Models**

```prisma
// Donations
model Donation {
  id             String   @id @default(cuid())
  organizationId String
  contactId      String
  campaignId     String?

  // Donation Details
  amount         Float
  currency       String   @default("USD")
  type           DonationType @default(ONE_TIME)
  method         PaymentMethod @default(CREDIT_CARD)
  status         DonationStatus @default(COMPLETED)

  // Payment Info
  transactionId  String?
  receiptNumber  String?  @unique

  // Tax Receipt
  taxDeductible  Boolean  @default(true)
  receiptSent    Boolean  @default(false)
  receiptSentAt  DateTime?

  // Metadata
  notes          String?
  acknowledgmentSent Boolean @default(false)

  // Relationships
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  contact        Contact @relation(fields: [contactId], references: [id], onDelete: Cascade)
  campaign       Campaign? @relation(fields: [campaignId], references: [id])

  donatedAt      DateTime @default(now())
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([organizationId])
  @@index([contactId])
  @@index([campaignId])
  @@index([donatedAt])
  @@map("donations")
}

enum DonationType {
  ONE_TIME
  MONTHLY
  QUARTERLY
  ANNUAL
  IN_KIND
  STOCK
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  BANK_TRANSFER
  CHECK
  CASH
  PAYPAL
  VENMO
  CRYPTOCURRENCY
  OTHER
}

enum DonationStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
  CANCELLED
}
```

**1.4: Add Campaign Models**

```prisma
// Campaigns
model Campaign {
  id             String   @id @default(cuid())
  organizationId String

  // Campaign Details
  name           String
  description    String?
  goal           Float?
  raised         Float    @default(0)

  // Status & Dates
  status         CampaignStatus @default(DRAFT)
  startDate      DateTime?
  endDate        DateTime?

  // Metadata
  tags           String[]

  // Relationships
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  donations      Donation[]
  campaignContacts CampaignContact[]

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([organizationId])
  @@index([status])
  @@map("campaigns")
}

enum CampaignStatus {
  DRAFT
  ACTIVE
  PAUSED
  COMPLETED
  CANCELLED
}

// Junction table for Campaign-Contact many-to-many
model CampaignContact {
  id         String   @id @default(cuid())
  campaignId String
  contactId  String

  // Contact's participation
  role       String?  // "volunteer", "team_member", etc.

  campaign   Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  contact    Contact @relation(fields: [contactId], references: [id], onDelete: Cascade)

  createdAt  DateTime @default(now())

  @@unique([campaignId, contactId])
  @@index([campaignId])
  @@index([contactId])
  @@map("campaign_contacts")
}
```

**1.5: Add Communication Models**

```prisma
// Email Communications
model Email {
  id             String   @id @default(cuid())
  organizationId String

  // Email Details
  subject        String
  body           String
  from           String

  // Status
  status         EmailStatus @default(DRAFT)
  scheduledFor   DateTime?
  sentAt         DateTime?

  // Recipients
  recipients     EmailRecipient[]

  // Metadata
  tags           String[]

  // Relationships
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([organizationId])
  @@index([status])
  @@map("emails")
}

enum EmailStatus {
  DRAFT
  SCHEDULED
  SENDING
  SENT
  FAILED
}

model EmailRecipient {
  id         String   @id @default(cuid())
  emailId    String
  contactId  String

  // Tracking
  sent       Boolean  @default(false)
  opened     Boolean  @default(false)
  clicked    Boolean  @default(false)
  bounced    Boolean  @default(false)

  sentAt     DateTime?
  openedAt   DateTime?
  clickedAt  DateTime?

  email      Email @relation(fields: [emailId], references: [id], onDelete: Cascade)

  createdAt  DateTime @default(now())

  @@index([emailId])
  @@index([contactId])
  @@map("email_recipients")
}
```

**1.6: Add Interaction Tracking**

```prisma
// Interactions (Notes, Calls, Meetings)
model Interaction {
  id             String   @id @default(cuid())
  organizationId String
  contactId      String
  userId         String

  // Interaction Details
  type           InteractionType
  subject        String
  notes          String?

  // Date/Time
  occurredAt     DateTime @default(now())

  // Relationships
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  contact        Contact @relation(fields: [contactId], references: [id], onDelete: Cascade)
  user           User @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([organizationId])
  @@index([contactId])
  @@index([userId])
  @@map("interactions")
}

enum InteractionType {
  NOTE
  CALL
  MEETING
  EMAIL_SENT
  EMAIL_RECEIVED
  DONATION_RECEIVED
  EVENT_ATTENDED
  OTHER
}
```

**1.7: Add Task Management**

```prisma
// Tasks/Follow-ups
model Task {
  id             String   @id @default(cuid())
  organizationId String
  userId         String
  contactId      String?

  // Task Details
  title          String
  description    String?
  priority       TaskPriority @default(MEDIUM)
  status         TaskStatus @default(TODO)

  // Due Date
  dueDate        DateTime?
  completedAt    DateTime?

  // Relationships
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user           User @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([organizationId])
  @@index([userId])
  @@index([status])
  @@index([dueDate])
  @@map("tasks")
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

**1.8: Update Organization and User Models**

Add relationships to existing models:

```prisma
// Update Organization model - add these relations
model Organization {
  // ... existing fields ...

  contacts      Contact[]
  donations     Donation[]
  campaigns     Campaign[]
  emails        Email[]
  interactions  Interaction[]
  tasks         Task[]

  // ... existing fields ...
}

// Update User model - add these relations
model User {
  // ... existing fields ...

  interactions  Interaction[]
  tasks         Task[]

  // ... existing fields ...
}
```

**1.9: Save the Complete Schema**

Your complete `prisma/schema.prisma` should now have:
- ✅ 2 original models (Organization, User)
- ✅ Contact
- ✅ Donation
- ✅ Campaign
- ✅ CampaignContact
- ✅ Email
- ✅ EmailRecipient
- ✅ Interaction
- ✅ Task

**Total: 10 models with all relationships**

---

### Step 2: Push Schema to Database (15 min)

**2.1: Generate Prisma Client**

```bash
npx prisma generate
```

**2.2: Push to Database**

```bash
npx prisma db push
```

You should see:
```
✔ Generated Prisma Client
The following migration(s) have been applied:

  • contacts
  • donations
  • campaigns
  • campaign_contacts
  • emails
  • email_recipients
  • interactions
  • tasks
```

**2.3: Verify in Prisma Studio**

```bash
npx prisma studio
```

Open http://localhost:5555 and verify you see all 10 tables!

---

### Step 3: Test Database with Seed Data (45 min)

**3.1: Create Seed Script**

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting seed...')

  // Get existing organization (from Week 1)
  const org = await prisma.organization.findFirst()

  if (!org) {
    console.log('❌ No organization found. Run Week 1 setup first.')
    return
  }

  console.log(`✅ Found organization: ${org.name}`)

  // Create sample contacts
  const contact1 = await prisma.contact.create({
    data: {
      organizationId: org.id,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '555-0123',
      type: 'DONOR',
      status: 'ACTIVE',
      tags: ['major_donor', 'monthly_giver'],
    },
  })

  const contact2 = await prisma.contact.create({
    data: {
      organizationId: org.id,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      phone: '555-0124',
      type: 'VOLUNTEER',
      status: 'ACTIVE',
      tags: ['volunteer', 'event_helper'],
    },
  })

  console.log(`✅ Created 2 contacts`)

  // Create campaign
  const campaign = await prisma.campaign.create({
    data: {
      organizationId: org.id,
      name: 'Annual Fundraiser 2024',
      description: 'Our biggest fundraising campaign of the year',
      goal: 50000,
      status: 'ACTIVE',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      tags: ['annual', 'fundraiser'],
    },
  })

  console.log(`✅ Created campaign: ${campaign.name}`)

  // Create donations
  await prisma.donation.create({
    data: {
      organizationId: org.id,
      contactId: contact1.id,
      campaignId: campaign.id,
      amount: 500,
      type: 'MONTHLY',
      method: 'CREDIT_CARD',
      status: 'COMPLETED',
      receiptNumber: 'RCP-2024-001',
    },
  })

  await prisma.donation.create({
    data: {
      organizationId: org.id,
      contactId: contact2.id,
      amount: 100,
      type: 'ONE_TIME',
      method: 'CASH',
      status: 'COMPLETED',
      receiptNumber: 'RCP-2024-002',
    },
  })

  console.log(`✅ Created 2 donations`)

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

**3.2: Add Seed Script to package.json**

Update `package.json`:

```json
{
  "scripts": {
    // ... existing scripts ...
    "db:seed": "tsx prisma/seed.ts"
  },
  "devDependencies": {
    // ... existing devDependencies ...
    "tsx": "^4.7.0"
  }
}
```

**3.3: Install tsx**

```bash
npm install -D tsx
```

**3.4: Run Seed**

```bash
npm run db:seed
```

**3.5: Verify in Prisma Studio**

```bash
npx prisma studio
```

You should see:
- 2 contacts
- 1 campaign
- 2 donations

---

### Step 4: Commit Day 1 (15 min)

```bash
git add prisma/ package.json package-lock.json
git commit -m "Day 1: Expand database schema with all CRM tables

- Add Contact model with types and status
- Add Donation model with payment tracking
- Add Campaign model with goals and dates
- Add Email and EmailRecipient models
- Add Interaction tracking
- Add Task management
- Create seed script with sample data
- All relationships configured

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push
```

**✅ Day 1 Complete!** You now have a complete CRM database schema.

---

## DAY 2: NextAuth.js Setup (4 hours)

### Step 1: Install NextAuth (15 min)

**1.1: Install Dependencies**

```bash
npm install next-auth@beta bcryptjs
npm install -D @types/bcryptjs
```

**1.2: Update Prisma Schema for NextAuth**

Add to `prisma/schema.prisma`:

```prisma
// NextAuth Models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

**1.3: Update User Model**

Add to User model:

```prisma
model User {
  id             String   @id @default(cuid())
  email          String   @unique
  password       String
  firstName      String
  lastName       String
  role           UserRole @default(MEMBER)
  organizationId String

  // NextAuth fields
  emailVerified  DateTime?
  image          String?
  accounts       Account[]
  sessions       Session[]

  // Existing relationships
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  interactions   Interaction[]
  tasks          Task[]

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([organizationId])
  @@map("users")
}
```

**1.4: Push Updated Schema**

```bash
npx prisma generate
npx prisma db push
```

---

### Step 2: Configure NextAuth (60 min)

**2.1: Create Auth Config**

Create `lib/auth.ts`:

```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { organization: true },
        })

        if (!user) {
          throw new Error('No user found')
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!passwordMatch) {
          throw new Error('Incorrect password')
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          organizationId: user.organizationId,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.organizationId = user.organizationId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.organizationId = token.organizationId as string
      }
      return session
    },
  },
}
```

**2.2: Create Auth API Route**

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

**2.3: Create Auth Types**

Create `types/next-auth.d.ts`:

```typescript
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      organizationId: string
    } & DefaultSession['user']
  }

  interface User {
    role: string
    organizationId: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    organizationId: string
  }
}
```

**2.4: Install Prisma Adapter**

```bash
npm install @next-auth/prisma-adapter
```

---

### Step 3: Create Registration API (45 min)

**3.1: Create Registration Route**

Create `app/api/auth/register/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, organizationName, ein } = body

    // Validate input
    if (!email || !password || !firstName || !lastName || !organizationName || !ein) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Check if organization exists
    let organization = await prisma.organization.findUnique({
      where: { ein },
    })

    // Create organization if doesn't exist
    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          name: organizationName,
          ein,
          email: email, // Use registering user's email for org
        },
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user as ADMIN (first user of organization)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'ADMIN',
        organizationId: organization.id,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    })

    return NextResponse.json({
      user,
      message: 'User created successfully',
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
```

---

### Step 4: Test Auth Setup (30 min)

**4.1: Test Registration Endpoint**

```bash
# Test with curl
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "firstName": "Admin",
    "lastName": "User",
    "organizationName": "Test Nonprofit",
    "ein": "12-3456789"
  }'
```

Should return:
```json
{
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  },
  "message": "User created successfully"
}
```

**4.2: Verify in Prisma Studio**

```bash
npx prisma studio
```

Check:
- New user created
- Password is hashed
- User linked to organization

---

### Step 5: Commit Day 2 (15 min)

```bash
git add .
git commit -m "Day 2: Setup NextAuth.js authentication

- Install NextAuth and bcryptjs
- Add NextAuth models to Prisma schema
- Configure JWT-based auth with credentials provider
- Create registration API endpoint
- Add password hashing with bcrypt
- Setup auth types for TypeScript

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push
```

**✅ Day 2 Complete!** Authentication backend is ready.

---

## DAY 3: Registration UI (4 hours)

### Step 1: Install Form Dependencies (15 min)

```bash
npx shadcn@latest add form label
npm install react-hook-form @hookform/resolvers zod
```

---

### Step 2: Create Registration Page (90 min)

**2.1: Create Registration Form Component**

Create `app/register/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      organizationName: formData.get('organizationName') as string,
      ein: formData.get('ein') as string,
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      // Redirect to login
      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Register your nonprofit organization
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                name="organizationName"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ein">EIN (Tax ID)</Label>
              <Input
                id="ein"
                name="ein"
                placeholder="12-3456789"
                required
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
```

**2.2: Install Card Component**

```bash
npx shadcn@latest add card
```

---

### Step 3: Test Registration Flow (30 min)

**3.1: Start Dev Server**

```bash
npm run dev
```

**3.2: Visit Registration Page**

Go to http://localhost:3000/register

**3.3: Test Registration**

Fill in:
- First Name: Test
- Last Name: User
- Email: test@example.com
- Password: password123
- Organization: Test Org
- EIN: 98-7654321

Click "Create Account"

Should redirect to login page with success message.

---

### Step 4: Commit Day 3 (15 min)

```bash
git add .
git commit -m "Day 3: Build registration UI

- Install shadcn form components
- Create registration page with form
- Add client-side validation
- Implement error handling
- Add link to login page

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push
```

**✅ Day 3 Complete!** Registration flow is working.

---

## DAY 4: Login & Dashboard (4 hours)

### Step 1: Create Login Page (60 min)

**1.1: Create Login Form**

Create `app/login/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error('Invalid email or password')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Access your SAGA CRM dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {registered && (
              <div className="bg-green-50 text-green-600 p-3 rounded text-sm">
                Account created! Please sign in.
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
```

**1.2: Install NextAuth React**

The package is already installed, but we need to add the provider.

Create `app/providers.tsx`:

```typescript
'use client'

import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

**1.3: Wrap App with Provider**

Update `app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'SAGA CRM',
  description: 'AI-Powered Nonprofit CRM',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

---

### Step 2: Create Protected Dashboard (90 min)

**2.1: Create Middleware for Auth**

Create `middleware.ts` in root:

```typescript
export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

**2.2: Create Dashboard Page**

Create `app/dashboard/page.tsx`:

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Get user's organization
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { organization: true },
  })

  // Get some stats
  const stats = await prisma.$transaction([
    prisma.contact.count({ where: { organizationId: user?.organizationId } }),
    prisma.donation.count({ where: { organizationId: user?.organizationId } }),
    prisma.campaign.count({ where: { organizationId: user?.organizationId } }),
  ])

  const [contactCount, donationCount, campaignCount] = stats

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold">SAGA CRM</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Welcome, {user?.firstName}!</h2>
          <p className="text-gray-600 mt-2">{user?.organization.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Contacts</h3>
            <p className="text-3xl font-bold mt-2">{contactCount}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Donations</h3>
            <p className="text-3xl font-bold mt-2">{donationCount}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Campaigns</h3>
            <p className="text-3xl font-bold mt-2">{campaignCount}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
```

---

### Step 3: Test Full Auth Flow (30 min)

**3.1: Test Login**

1. Go to http://localhost:3000/login
2. Sign in with credentials you registered
3. Should redirect to dashboard
4. See your stats displayed

**3.2: Test Protection**

1. Sign out (we'll add button next)
2. Try to visit http://localhost:3000/dashboard
3. Should redirect to login

---

### Step 4: Commit Day 4 (15 min)

```bash
git add .
git commit -m "Day 4: Build login and dashboard

- Create login page with NextAuth integration
- Add SessionProvider to app
- Create protected dashboard route
- Add middleware for route protection
- Display organization stats on dashboard
- Implement server-side session checks

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push
```

**✅ Day 4 Complete!** Full auth flow working!

---

## DAY 5: Navigation & Polish (3-4 hours)

### Step 1: Add Navigation (90 min)

**1.1: Create Navbar Component**

Create `components/navbar.tsx`:

```typescript
'use client'

import { signOut } from 'next-auth/react'
import { Button } from './ui/button'
import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold">
              SAGA CRM
            </Link>
            <div className="hidden md:flex gap-4">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/contacts"
                className="text-gray-700 hover:text-gray-900"
              >
                Contacts
              </Link>
              <Link
                href="/dashboard/donations"
                className="text-gray-700 hover:text-gray-900"
              >
                Donations
              </Link>
              <Link
                href="/dashboard/campaigns"
                className="text-gray-700 hover:text-gray-900"
              >
                Campaigns
              </Link>
            </div>
          </div>

          <Button
            onClick={() => signOut({ callbackUrl: '/login' })}
            variant="outline"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  )
}
```

**1.2: Create Dashboard Layout**

Create `app/dashboard/layout.tsx`:

```typescript
import { Navbar } from '@/components/navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
```

**1.3: Update Dashboard Page**

Update `app/dashboard/page.tsx` to remove header (now in layout):

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { organization: true },
  })

  const stats = await prisma.$transaction([
    prisma.contact.count({ where: { organizationId: user?.organizationId } }),
    prisma.donation.count({ where: { organizationId: user?.organizationId } }),
    prisma.campaign.count({ where: { organizationId: user?.organizationId } }),
  ])

  const [contactCount, donationCount, campaignCount] = stats

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Welcome, {user?.firstName}!</h2>
        <p className="text-gray-600 mt-2">{user?.organization.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600">Contacts</h3>
          <p className="text-3xl font-bold mt-2">{contactCount}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600">Donations</h3>
          <p className="text-3xl font-bold mt-2">{donationCount}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600">Campaigns</h3>
          <p className="text-3xl font-bold mt-2">{campaignCount}</p>
        </div>
      </div>
    </div>
  )
}
```

---

### Step 2: Update Home Page (30 min)

**2.1: Create Marketing Home Page**

Update `app/page.tsx`:

```typescript
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center max-w-3xl">
        <h1 className="text-6xl font-bold mb-4">SAGA CRM</h1>
        <p className="text-2xl text-gray-600 mb-8">
          AI-Powered Nonprofit Customer Relationship Management
        </p>
        <p className="text-lg text-gray-500 mb-12">
          Manage donors, track donations, and grow your nonprofit with powerful, easy-to-use tools.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
```

---

### Step 3: Test Everything (45 min)

**3.1: Full User Flow Test**

1. Visit http://localhost:3000
2. Click "Get Started"
3. Register new account
4. Sign in
5. View dashboard
6. Click navigation links
7. Sign out
8. Sign back in

**3.2: Test Protected Routes**

1. While signed out, try to visit:
   - /dashboard
   - /dashboard/contacts
   - /dashboard/donations
2. Should redirect to login

**3.3: Test Multiple Users**

1. Register second user with same EIN
2. Verify they join same organization
3. Both users should see same stats

---

### Step 4: Build & Deploy (30 min)

**4.1: Test Production Build**

```bash
npm run build
```

Should build without errors.

**4.2: Commit Final Changes**

```bash
git add .
git commit -m "Day 5: Add navigation and polish UI

- Create navbar component with navigation
- Add dashboard layout with navbar
- Update home page with CTA buttons
- Add sign out functionality
- Polish dashboard stats display
- Test full authentication flow

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push
```

**4.3: Tag Week 2**

```bash
git tag -a v0.2.0 -m "Week 2: Authentication and database complete"
git push --tags
```

---

## Week 2 Complete! 🎉

### What You Built

✅ **Database Schema**
- 10 comprehensive models
- All relationships configured
- Seed data for testing

✅ **Authentication System**
- NextAuth.js with JWT
- Email/password login
- Registration flow
- Password hashing
- Session management

✅ **User Interface**
- Registration page
- Login page
- Protected dashboard
- Navigation bar
- Stats display

✅ **Security**
- Protected routes
- Middleware auth checks
- Password hashing
- Session management

### Statistics

- **Tables Created:** 10
- **API Routes:** 3
- **Pages Created:** 4
- **Components:** 2
- **Lines of Code:** ~1,500

---

## Next: Week 3

**Week 3 Goals:**
- Build Contacts management (CRUD)
- Build Donations tracking
- Build Campaigns management
- Add data tables with search/filter
- Create forms for adding records

**Start Date:** __________

---

## Troubleshooting

### Auth Not Working

1. Check NEXTAUTH_SECRET is set
2. Verify NEXTAUTH_URL matches your domain
3. Clear cookies and try again

### Database Errors

1. Run `npx prisma generate`
2. Run `npx prisma db push`
3. Check connection string is correct

### Build Errors

1. Delete `.next` folder
2. Run `npm run build` again
3. Check for TypeScript errors

---

**You now have a fully functional CRM with authentication!** 🚀
