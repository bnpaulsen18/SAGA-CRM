# SAGA CRM

**The all-in-one donor management platform built for modern nonprofits**

[![Next.js 14](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7.0-2D3748)](https://www.prisma.io)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🌟 What is SAGA CRM?

SAGA CRM is a **production-ready nonprofit CRM** that combines donor management, fundraising campaigns, automated receipting, and AI-powered communications into one beautiful platform.

**Built for nonprofits who need:**
- ✨ Professional donor relationship management
- 🤖 AI-powered thank-you messages and receipts
- 📊 Real-time analytics and reporting
- 💳 Integrated payment processing (Stripe)
- 📧 Automated email communications
- 📄 IRS-compliant PDF receipts
- 🎯 Campaign tracking and goal management
- 🔒 Enterprise-grade security

---

## ✨ Key Features

### 🎯 Core CRM
- **Contact Management** - Store and organize donor information with custom fields
- **Donation Tracking** - Record one-time, recurring, and pledge donations
- **Campaign Management** - Create and track fundraising campaigns with goals
- **Multi-Organization Support** - Built-in multi-tenancy with Row-Level Security

### 🤖 AI-Powered Features
- **Smart Thank-You Messages** - Personalized acknowledgments using Claude AI
- **Context-Aware** - AI considers donation amount, fund restrictions, and donor history
- **Graceful Fallback** - Works with or without AI integration

### 📧 Automated Communications
- **Instant Email Receipts** - Sent automatically when donations are recorded
- **Professional Templates** - Beautiful, mobile-responsive email designs
- **PDF Receipts** - IRS-compliant donation receipts with one click
- **Resend Functionality** - Easily resend receipts to donors

### 💳 Payment Processing
- **Stripe Integration** - Accept credit cards, Apple Pay, Google Pay
- **Recurring Donations** - Automatic monthly giving subscriptions
- **Webhook Automation** - Donations created automatically from payments
- **Test Mode** - Full testing environment included

### 📊 Reports & Analytics
- **Donation Trends** - Track giving over time with charts
- **Campaign Performance** - Monitor progress toward goals
- **Donor Retention** - Analyze new vs. returning donors
- **Fund Accounting** - IRS-compliant fund restriction tracking
- **CSV Export** - Download data for Excel, QuickBooks, etc.

### 🔒 Security & Compliance
- **Row-Level Security** - Automatic data isolation per organization
- **Role-Based Access** - Admin, User, and Viewer roles
- **Rate Limiting** - Prevent API abuse
- **Security Headers** - CSP, XSS protection, HSTS
- **IRS Compliance** - Tax-deductible donation documentation

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- (Optional) Resend account for email
- (Optional) Stripe account for payments

### Installation

```bash
# Clone the repository
git clone https://github.com/bnpaulsen18/SAGA-CRM.git
cd SAGA-CRM

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and API keys

# Initialize database
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign up for an account!

**📖 For detailed setup instructions, see [GETTING-STARTED.md](GETTING-STARTED.md)**

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Recharts** - Data visualization

### Backend
- **Next.js API Routes** - RESTful API endpoints
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Relational database
- **NextAuth v5** - Authentication and sessions

### Integrations
- **Resend** - Professional email delivery
- **React Email** - Email template framework
- **@react-pdf/renderer** - PDF generation
- **Stripe** - Payment processing
- **Anthropic Claude** - AI-powered text generation

---

## 📁 Project Structure

```
SAGA-CRM/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── contacts/          # Contact management pages
│   ├── donations/         # Donation management pages
│   ├── campaigns/         # Campaign management pages
│   ├── reports/           # Analytics and reports
│   └── dashboard/         # Main dashboard
│
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── contacts/         # Contact-specific components
│   ├── campaigns/        # Campaign-specific components
│   └── reports/          # Report charts and tables
│
├── lib/                   # Core libraries
│   ├── auth.ts           # Authentication config
│   ├── prisma.ts         # Database client
│   ├── email/            # Email system
│   ├── pdf/              # PDF generation
│   ├── ai/               # AI integration
│   ├── stripe/           # Payment processing
│   └── security/         # Security middleware
│
├── prisma/
│   └── schema.prisma     # Database schema
│
└── public/               # Static assets
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[GETTING-STARTED.md](GETTING-STARTED.md)** | Developer setup guide and quick start |
| **[API-REFERENCE.md](API-REFERENCE.md)** | Complete API endpoint documentation |
| **[LAUNCH-READINESS.md](LAUNCH-READINESS.md)** | Feature list, deployment guide, and checklist |
| **[IMPLEMENTATION-STATUS.md](IMPLEMENTATION-STATUS.md)** | Current progress and development roadmap |
| **[SAGA-FULL-VISION-ROADMAP.md](SAGA-FULL-VISION-ROADMAP.md)** | Long-term vision and future features |

---

## 🎯 Use Cases

### Small Nonprofits ($0-500K budget)
- Replace spreadsheets with professional donor management
- Accept online donations with Stripe
- Send automated thank-you emails
- Generate IRS-compliant receipts

### Mid-Size Organizations ($500K-5M budget)
- Manage multiple fundraising campaigns
- Track restricted and unrestricted funds
- Analyze donor retention and trends
- Export data for accounting software

### Fiscal Sponsors
- Manage multiple sponsored projects
- Hierarchical organization structure
- Per-project fund accounting
- Consolidated reporting

---

## 🔐 Security

SAGA CRM takes security seriously:

- **Authentication** - Secure session-based auth with NextAuth v5
- **Authorization** - Role-based access control (ADMIN, USER, VIEWER)
- **Data Isolation** - Row-Level Security ensures organizations can't access each other's data
- **Rate Limiting** - Prevent API abuse and brute-force attacks
- **Security Headers** - CSP, X-Frame-Options, HSTS, XSS protection
- **Input Validation** - All user input is validated and sanitized
- **SQL Injection Protection** - Prisma ORM provides parameterized queries
- **Webhook Verification** - Stripe webhooks verified with signatures

---

## 🌍 Environment Variables

Create a `.env.local` file with these variables:

```env
# Database (Required)
DATABASE_URL="postgresql://user:password@host:5432/database"
DIRECT_URL="postgresql://user:password@host:5432/database"

# Authentication (Required)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Email Service (Required for receipts)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="Your Org <donations@yourdomain.com>"

# Payment Processing (Required for online donations)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI Features (Optional - has fallback)
ANTHROPIC_API_KEY="sk-ant-..."
```

**See [GETTING-STARTED.md](GETTING-STARTED.md) for detailed configuration instructions.**

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Configure environment variables in the Vercel dashboard.

### Other Platforms
- **Railway** - One-click PostgreSQL included
- **AWS/GCP/Azure** - Full control and customization
- **Docker** - Containerized deployment

**See [LAUNCH-READINESS.md](LAUNCH-READINESS.md) for complete deployment guide.**

---

## 📊 Database Schema

SAGA CRM includes 14 models:

**Core Models:**
- Organization (nonprofits)
- User (staff members)
- Contact (donors/supporters)
- Donation (individual gifts)
- Campaign (fundraising campaigns)

**Communication:**
- Email (email logs)
- SMS (SMS logs)

**Automation:**
- Workflow (automation rules)
- WorkflowTrigger (trigger events)
- WorkflowAction (automated actions)

**Integration:**
- Integration (third-party connections)
- SyncLog (integration sync history)

**Content:**
- DonationPage (public donation forms)
- Asset (file uploads)

**See [prisma/schema.prisma](prisma/schema.prisma) for full schema.**

---

## 🛣️ Roadmap

### ✅ Phase 1: MVP (Complete)
- [x] Contact management
- [x] Donation tracking
- [x] Campaign management
- [x] Email automation with AI
- [x] PDF receipts
- [x] Reports and analytics
- [x] Stripe integration
- [x] Security implementation

### 🚧 Phase 2: Enhanced Features (Planned)
- [ ] Public donation pages
- [ ] Email composer and templates
- [ ] SMS integration (Twilio)
- [ ] Workflow automation builder
- [ ] Advanced search and filtering
- [ ] Bulk operations

### 🔮 Phase 3: Integrations (Future)
- [ ] QuickBooks integration
- [ ] Mailchimp sync
- [ ] Donor gift fulfillment (Printful)
- [ ] Social media automation (n8n)
- [ ] Custom API access

**See [SAGA-FULL-VISION-ROADMAP.md](SAGA-FULL-VISION-ROADMAP.md) for complete roadmap.**

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Please ensure:**
- Code follows TypeScript best practices
- All tests pass
- Documentation is updated
- Commits follow conventional commit format

---

## 🎉 What Makes SAGA Different?

### vs. Salesforce NPSP
- ✅ **Simple** - No complex configuration
- ✅ **Affordable** - Fraction of the cost
- ✅ **Modern** - Built with latest web technologies

### vs. Bloomerang
- ✅ **AI-Powered** - Smart thank-you messages
- ✅ **Open Source** - Full code access and customization
- ✅ **Fiscal Sponsorship** - Built-in support

### vs. DonorPerfect
- ✅ **Beautiful UI** - Modern, intuitive design
- ✅ **Developer-Friendly** - RESTful API included
- ✅ **Self-Hosted** - Own your data

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with amazing open-source tools:
- [Next.js](https://nextjs.org) by Vercel
- [Prisma](https://www.prisma.io) ORM
- [shadcn/ui](https://ui.shadcn.com) components
- [Stripe](https://stripe.com) payments
- [Resend](https://resend.com) email
- [Anthropic](https://anthropic.com) Claude AI

---

<div align="center">

**Built with ❤️ for nonprofits making a difference**

[Get Started](GETTING-STARTED.md) • [API Docs](API-REFERENCE.md) • [Deploy](LAUNCH-READINESS.md)

</div>

---

*Last updated: December 29, 2025*
*Version: 1.0.0*
