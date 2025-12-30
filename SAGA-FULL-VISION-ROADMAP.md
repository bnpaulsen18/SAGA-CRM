# SAGA CRM - Full Vision Implementation Roadmap

**Status:** Phase 1 (MVP) In Progress
**Timeline:** 24-32 weeks for complete vision
**Current Completion:** 40% of MVP, 15% of full vision

---

## 🎯 Executive Summary

This roadmap implements **Option A: Phased Development** with all features from the complete vision (saga-crm-complete-FINAL mockup) organized across strategic phases:

- **Phase 1:** MVP Foundation (Weeks 1-8) - Get to revenue
- **Phase 2:** Engagement & Automation Tools (Weeks 9-16) - Differentiate
- **Phase 3:** Advanced Integrations (Weeks 17-24) - Scale
- **Phase 4:** AI Social Media + n8n (Weeks 25-32) - Innovate

**Critical Decision:** Build features incrementally to achieve revenue faster while ensuring all advanced features are delivered systematically.

---

## 📊 Current Status Snapshot

### ✅ What's Complete (40% of MVP)
- Authentication & authorization (NextAuth v5, RLS)
- Database schema (100% - all 14 models including fiscal sponsorship)
- Contacts module (85% - create, list, detail, CSV import)
- Donations module (70% - create, list, AI thank-you preview)
- Dashboard with placeholder stats
- Dark glassmorphic "Midnight Impact" theme
- AI integration infrastructure (Anthropic Claude)

### 🚧 In Progress (Agents Running Now)
- **Email automation** - Infrastructure Director building Resend integration
- **PDF receipt generation** - Infrastructure Director building IRS-compliant receipts
- **Campaigns UI** - Feature Director building complete UI module

### ❌ Not Started (60% of full vision)
- Donation page builder
- Donor gifts + Printful integration
- Communication hub (unified email/SMS)
- Automation workflows
- Advanced reports & analytics
- Payment gateway integrations (Stripe, PayPal)
- Marketing integrations (Mailchimp, Meta)
- Accounting integration (QuickBooks)
- AI social media composer + n8n integration

---

## 🎯 PHASE 1: MVP Foundation (Weeks 1-8)

**Goal:** Launch a functional CRM that solves the core problem and generates revenue

### Week 1-2: Critical Path Completion ⚡ IN PROGRESS

**Agents Deployed:** 3 running in parallel

#### 1.1 Email Automation (Infrastructure Director)
- ✅ Agent launched
- Resend API integration
- React Email templates (donation-receipt.tsx)
- Auto-send on donation create
- Manual "Resend Receipt" button
- EmailLog tracking in database
- **Deliverables:** 6 files (client, templates, send logic, API routes, UI updates)

#### 1.2 PDF Receipt Generation (Infrastructure Director)
- ✅ Agent launched
- Install @react-pdf/renderer
- IRS-compliant receipt template
- Download endpoint (/api/donations/[id]/receipt)
- PDF attachment for emails
- **Deliverables:** 5 files (template, generation logic, API route, UI updates)

#### 1.3 Campaigns Module UI (Feature Director)
- ✅ Agent launched
- List page with progress bars
- Create/edit campaign forms
- Campaign detail with donation breakdown
- Campaign selector in donation form
- Progress tracking (raised vs goal)
- **Deliverables:** 9 files (4 pages, 4 components, 1 API route)

**Success Criteria:**
- Users can record donations and auto-send receipts
- Users can download PDF receipts
- Users can create and track fundraising campaigns
- All features follow dark glassmorphic theme

---

### Week 3: Reports & Analytics Foundation

**Agent to Launch:** Data Director

#### 3.1 Connect Reports to Real Data
**Current State:** Report components exist but show mock data

**Tasks:**
- Update [components/reports/](components/reports/) components to fetch real data
- Create aggregation queries for:
  - Total donations by time period
  - Donor retention rates
  - Campaign performance
  - Fund restriction breakdown
  - Donation method distribution
- Implement date range filters
- Add export to CSV/Excel functionality
- Create scheduled reports (email summary to admins)

**Components to Update:**
- DonationTrendChart.tsx
- DonorRetentionChart.tsx
- CampaignPerformanceChart.tsx
- FundAccountingReport.tsx

**New Features:**
- app/reports/page.tsx - Main reports dashboard
- app/reports/custom/page.tsx - Custom report builder
- lib/reports/aggregations.ts - Reusable query functions
- app/api/reports/export/route.ts - CSV/Excel export

---

### Week 4: Security & Monitoring

**Agents to Launch:** 3 Infrastructure Directors in parallel

#### 4.1 Error Monitoring (Sentry)
- Install @sentry/nextjs
- Configure error tracking
- Set up performance monitoring
- Add breadcrumbs for user actions
- Create error boundaries in UI
- Set up alerts for critical errors

#### 4.2 Rate Limiting
- Install @upstash/ratelimit
- Implement rate limiting middleware
- Protect API routes (donations, contacts, campaigns)
- Add rate limit headers
- Create user feedback for rate limit hits

#### 4.3 Security Headers
- Implement security middleware
- Add CSP headers
- Add CSRF protection
- Add XSS protection headers
- Audit dependencies for vulnerabilities
- Set up security scanning in CI/CD

---

### Week 5-6: UX Polish & Critical Features

**Agents to Launch:** 2 Feature Directors in parallel

#### 5.1 Toast Notifications & Loading States
- Install sonner or react-hot-toast
- Add toast notifications for all actions
- Implement loading skeletons
- Add optimistic UI updates
- Improve error messages
- Add confirmation dialogs

#### 5.2 Advanced Search & Filtering
- Global search across contacts/donations/campaigns
- Advanced filters with multiple criteria
- Saved search functionality
- Quick filters (this month, major donors, etc.)
- Search history

#### 5.3 Pagination & Performance
- Implement cursor-based pagination
- Add infinite scroll option
- Optimize database queries
- Add database indexes
- Implement query caching

---

### Week 7: Bulk Operations & Data Management

**Agent to Launch:** Feature Director

#### 7.1 Bulk Actions
- Bulk edit contacts (tags, organization type)
- Bulk delete donations (soft delete)
- Bulk export (contacts, donations, campaigns)
- Batch email sending
- Bulk tag management

#### 7.2 Data Import/Export
- Enhanced CSV import (contacts, donations)
- Excel import support
- Import validation and error reporting
- Template downloads
- Import history and rollback

---

### Week 8: Testing & Launch Preparation

**Agents to Launch:** Testing Director + Documentation Director

#### 8.1 Testing Suite
- Unit tests for critical functions
- Integration tests for API routes
- E2E tests for core workflows (create donation → send email)
- Test coverage reporting
- Set up CI/CD pipeline

#### 8.2 User Documentation
- User guide for each module
- Video tutorials (screen recordings)
- FAQ section
- Onboarding wizard for new users
- In-app help tooltips

#### 8.3 Launch Checklist
- [ ] All MVP features working
- [ ] Email sending tested in production
- [ ] PDF generation tested
- [ ] RLS security verified
- [ ] Performance tested (load testing)
- [ ] Documentation complete
- [ ] User onboarding flow tested
- [ ] Backup and disaster recovery plan
- [ ] Monitoring and alerting configured

---

## 🚀 PHASE 2: Engagement & Automation Tools (Weeks 9-16)

**Goal:** Add features that increase user engagement and automate repetitive tasks

### Week 9-10: Donation Page Builder

**Agent to Launch:** Feature Director

**Reference:** saga-crm-complete-FINAL mockup Section 2

#### Features to Build:
1. **Drag-and-Drop Page Builder**
   - Visual editor for donation pages
   - Components: Header, donation form, campaign progress, testimonials, footer
   - Template library (5-10 pre-built templates)
   - Live preview mode
   - Mobile responsive preview

2. **Customization Options**
   - Custom branding (logo, colors, fonts)
   - Custom fields (memorial donations, tribute gifts)
   - Suggested donation amounts
   - Recurring donation toggles
   - Campaign selector
   - Custom thank-you messages

3. **Publishing & Sharing**
   - Unique URL for each page (sagacrm.io/donate/[org]/[campaign])
   - Embed code for external websites
   - QR code generation
   - Social sharing buttons
   - Analytics tracking (page views, conversion rate)

4. **Form Builder**
   - Custom fields (dropdowns, checkboxes, text)
   - Conditional logic (show field if...)
   - Required field validation
   - CAPTCHA integration
   - Save form data to contact custom fields

**Technical Implementation:**
- app/donation-pages/ - Page builder interface
- app/api/donation-pages/ - CRUD for pages
- app/donate/[orgId]/[pageId] - Public donation page
- components/donation-page-builder/ - Builder components
- lib/donation-page-renderer.tsx - Render engine

**Database Schema:** (Already exists in Prisma schema)
- DonationPage model with JSON config field

---

### Week 11-12: Communication Hub

**Agent to Launch:** Infrastructure Director

**Reference:** saga-crm-complete-FINAL mockup Section 4

#### Features to Build:
1. **Unified Inbox**
   - View all communications (emails, SMS) in one place
   - Filter by contact, campaign, date
   - Search functionality
   - Mark as read/unread
   - Star important messages

2. **Email Composer**
   - Rich text editor (TipTap or similar)
   - Template library
   - Variable substitution ({{firstName}}, {{lastDonationAmount}})
   - Preview before send
   - Schedule send
   - Send to individual or bulk

3. **SMS Integration (Twilio)**
   - Send SMS to contacts
   - SMS templates
   - Bulk SMS sending
   - SMS opt-in/opt-out tracking
   - Compliance with TCPA regulations

4. **Email Templates**
   - Welcome email
   - Donation thank-you
   - Birthday greetings
   - Monthly update
   - Year-end tax summary
   - Campaign updates
   - Event invitations

**Technical Implementation:**
- app/communications/ - Communication hub UI
- app/api/communications/email/ - Email sending
- app/api/communications/sms/ - SMS sending (Twilio)
- lib/communications/twilio-client.ts
- lib/communications/templates/ - Template library
- components/communications/ - Composer components

**Third-Party Integrations:**
- Twilio for SMS
- Continue using Resend for email

---

### Week 13-14: Automation Workflows

**Agent to Launch:** Infrastructure Director + AI Director

**Reference:** saga-crm-complete-FINAL mockup Section 5

#### Features to Build:
1. **Workflow Builder**
   - Visual workflow designer (similar to Zapier/Make)
   - Trigger types:
     - New donation received
     - Contact created
     - Campaign milestone reached
     - Birthday/anniversary
     - Recurring donation failed
     - No donation in X months (lapsed donor)
   - Action types:
     - Send email
     - Send SMS
     - Add tag
     - Update contact field
     - Create task
     - Notify admin
     - Call webhook
     - Generate AI content

2. **Pre-Built Workflow Templates**
   - Thank-you sequence (day 1, 7, 30)
   - Birthday greetings
   - Monthly donor updates
   - Lapsed donor re-engagement
   - Major gift alerts
   - Campaign milestone celebrations
   - Year-end giving reminder

3. **AI-Powered Automation**
   - AI-generated email content based on donor history
   - Sentiment analysis for donor communications
   - Predictive next best action
   - Donor churn risk scoring

4. **Workflow Management**
   - Enable/disable workflows
   - Test workflows with sample data
   - View workflow execution history
   - Analytics (open rate, click rate, conversion)
   - A/B testing for email content

**Technical Implementation:**
- app/workflows/ - Workflow builder UI
- app/api/workflows/ - CRUD + execution
- lib/workflows/engine.ts - Workflow execution engine
- lib/workflows/triggers.ts - Trigger handlers
- lib/workflows/actions.ts - Action executors
- Database: Workflow, WorkflowExecution, WorkflowLog models (add to schema)

**Cron Jobs:**
- Set up background jobs for scheduled workflows
- Use Vercel Cron or similar for production

---

### Week 15-16: Donor Gifts + Printful Integration

**Agent to Launch:** Infrastructure Director

**Reference:** saga-crm-complete-FINAL mockup Section 3

#### Features to Build:
1. **Gift Catalog Management**
   - Admin creates gift tiers ($50, $100, $250, $500+)
   - Associate Printful products with each tier
   - Set gift eligibility rules (donation amount, frequency)
   - Upload product images
   - Product variants (size, color)

2. **Gift Selection by Donors**
   - After donation, show eligible gifts
   - Donor selects gift and provides shipping info
   - Shipping address validation
   - Gift preferences saved to contact record

3. **Printful Integration**
   - Install @printful/printful-sdk-js (or use REST API)
   - Sync products from Printful catalog
   - Automatic order placement to Printful
   - Webhook for order status updates
   - Tracking number sent to donor
   - Cost tracking (Printful charges vs. donation)

4. **Gift Fulfillment Dashboard**
   - View all gift orders
   - Filter by status (pending, shipped, delivered)
   - Manual override (skip gift, change product)
   - Track fulfillment costs
   - ROI analysis (gift cost vs. donor lifetime value)

**Technical Implementation:**
- app/donor-gifts/ - Gift management UI
- app/api/donor-gifts/ - Gift order handling
- lib/printful/client.ts - Printful API client
- lib/printful/webhooks.ts - Order status updates
- Database: DonorGift, GiftTier, GiftOrder models (add to schema)

**Workflow Integration:**
- Create workflow trigger: "Donor eligible for gift"
- Auto-send email with gift selection link

---

## 🌟 PHASE 3: Advanced Integrations (Weeks 17-24)

**Goal:** Connect SAGA CRM to external platforms for payments, marketing, and accounting

### Week 17-18: Payment Gateway Integration (Stripe)

**Agent to Launch:** Infrastructure Director

#### Features to Build:
1. **Stripe Donation Processing**
   - Stripe Checkout integration
   - Accept credit/debit cards
   - Save payment methods for recurring donations
   - Automatic receipt generation
   - Stripe webhook handling (payment success/failed)
   - Dispute and refund management

2. **Recurring Donation Management**
   - Set up Stripe subscriptions
   - Donor portal to manage subscriptions
   - Automatic retry on failed payments
   - Email notifications for failed payments
   - Workflow trigger: "Recurring donation failed"

3. **One-Click Upsell**
   - After successful donation, offer recurring option
   - "Cover processing fees" option
   - Round-up donations

**Technical Implementation:**
- Install @stripe/stripe-js
- app/donate/[orgId]/[pageId] - Add Stripe Checkout
- app/api/stripe/webhooks/route.ts - Handle Stripe events
- lib/stripe/client.ts
- Database: PaymentProcessor, Transaction models (add to schema)

---

### Week 19-20: Marketing Integrations

**Agents to Launch:** 2 Infrastructure Directors in parallel

#### 20.1 Mailchimp Integration
- Sync contacts to Mailchimp lists
- Tag-based segmentation
- Donation triggers for campaigns
- Import Mailchimp subscribers as contacts
- Bi-directional sync

#### 20.2 Meta (Facebook/Instagram) Integration
- Meta Pixel tracking on donation pages
- Create custom audiences from donor lists
- Track conversion from Meta ads
- Donation attribution

**Technical Implementation:**
- app/integrations/mailchimp/
- app/integrations/meta/
- app/api/integrations/mailchimp/
- app/api/integrations/meta/
- lib/integrations/mailchimp-client.ts
- lib/integrations/meta-client.ts

---

### Week 21-22: Accounting Integration (QuickBooks)

**Agent to Launch:** Infrastructure Director

#### Features to Build:
1. **QuickBooks Sync**
   - OAuth connection to QuickBooks Online
   - Sync donations as income transactions
   - Create customers from contacts
   - Fund restriction mapping to QuickBooks accounts
   - Automatic categorization by fund type

2. **Financial Reporting**
   - Real-time balance sheet
   - Income statement (P&L)
   - Fund accounting reports (restricted vs unrestricted)
   - Budget vs actual
   - Export to Excel for accountants

3. **Reconciliation**
   - Match donations to QuickBooks transactions
   - Flag discrepancies
   - Bulk reconciliation tools

**Technical Implementation:**
- Install quickbooks-node-promise or use REST API
- app/integrations/quickbooks/
- app/api/integrations/quickbooks/
- lib/integrations/quickbooks-client.ts
- Database: AccountingSync model (add to schema)

---

### Week 23-24: Advanced Analytics & Custom Reports

**Agent to Launch:** Data Director

#### Features to Build:
1. **Custom Report Builder**
   - Drag-and-drop report designer
   - Select fields (contact, donation, campaign)
   - Apply filters and grouping
   - Choose chart types (bar, line, pie, table)
   - Save and share reports

2. **Dashboards**
   - Create custom dashboards
   - Drag-and-drop widgets
   - Real-time data updates
   - Share dashboards with team
   - Export to PDF

3. **Predictive Analytics**
   - Donor churn prediction (AI model)
   - Lifetime value forecasting
   - Best time to ask (AI recommendation)
   - Campaign performance prediction

4. **Benchmarking**
   - Compare to similar organizations
   - Industry averages
   - Growth trends

**Technical Implementation:**
- app/reports/custom-builder/
- app/reports/dashboards/
- lib/analytics/predictive-models.ts
- lib/analytics/benchmarking.ts
- Consider integrating Chart.js or Recharts for visualizations

---

## 🤖 PHASE 4: AI Social Media + n8n Integration (Weeks 25-32)

**Goal:** Build AI-powered social media automation with n8n workflow integration

**Priority:** Per user request, this is built LAST after all other features

### Week 25-26: AI Social Media Composer

**Agent to Launch:** AI Director + Feature Director

**Reference:** saga-crm-complete-FINAL mockup Section 1

#### Features to Build:
1. **AI Content Generator**
   - Text input for post topic/idea
   - AI generates post content using Claude
   - Tone selection (grateful, celebratory, urgent, informative)
   - Platform-specific optimization (character limits, hashtags)
   - Generate multiple variations
   - Emoji suggestions
   - Hashtag recommendations

2. **Multi-Platform Publishing**
   - Platform toggles: Facebook, Instagram, LinkedIn, X (Twitter)
   - Platform-specific previews
   - Character count per platform
   - Image upload and optimization
   - Schedule posts
   - Save as draft

3. **Content Calendar**
   - Calendar view of scheduled posts
   - Drag-and-drop to reschedule
   - Bulk scheduling
   - Content themes/campaigns
   - Recurring posts (weekly updates, monthly highlights)

4. **AI Features**
   - Suggest best posting times (AI analysis of engagement)
   - Auto-generate images (DALL-E or similar)
   - Caption suggestions
   - Trending topics integration
   - Content ideas based on recent donations/campaigns

**Technical Implementation:**
- app/social-media/ - Social media hub UI
- app/social-media/composer/ - AI composer
- app/social-media/calendar/ - Content calendar
- app/api/ai/social-post/ - AI post generation
- lib/ai/social-media-generator.ts - AI logic
- Database: SocialPost, SocialAccount models (add to schema)

**AI Prompts:**
- System prompt for each tone (grateful, celebratory, urgent)
- Platform-specific formatting instructions
- Brand voice guidelines

---

### Week 27-28: n8n Workflow Integration

**Agent to Launch:** Infrastructure Director

**Goal:** Enable customers to create AI-generated social posts that automatically share across platforms

#### Architecture Design:

**SAGA CRM Side (What we build):**
1. **Webhook Endpoints for n8n**
   - POST /api/n8n/webhooks/social-post-created
   - POST /api/n8n/webhooks/social-post-scheduled
   - POST /api/n8n/webhooks/social-post-published
   - GET /api/n8n/social-posts/[id] - Retrieve post data

2. **API for n8n to Call**
   - POST /api/social-media/posts - Create social post via API
   - GET /api/social-media/posts - List posts
   - PUT /api/social-media/posts/[id] - Update post
   - POST /api/social-media/generate-ai - Generate AI content via API

3. **Data Structure for n8n**
   ```json
   {
     "postId": "post_123",
     "content": "AI-generated content here",
     "tone": "grateful",
     "platforms": ["facebook", "instagram", "linkedin"],
     "scheduledFor": "2025-01-15T10:00:00Z",
     "images": ["url1", "url2"],
     "tags": ["donors", "campaign123"],
     "organizationId": "org_123"
   }
   ```

4. **Authentication for n8n**
   - API key authentication
   - Create /api/integrations/n8n/auth endpoint
   - Generate API keys for organizations
   - Rate limiting for n8n requests

**n8n Workflow (What we guide users to build):**

**Workflow 1: Auto-Post New Donations**
1. Trigger: Webhook from SAGA (new donation created)
2. Action: Call SAGA API to generate AI post
3. Action: Post to Facebook (n8n Facebook node)
4. Action: Post to Instagram (n8n Instagram node)
5. Action: Post to LinkedIn (n8n LinkedIn node)
6. Action: Call SAGA webhook to log analytics

**Workflow 2: Scheduled Campaign Updates**
1. Trigger: Cron (every Monday 10am)
2. Action: Call SAGA API to get campaign progress
3. Action: Call SAGA AI endpoint to generate update post
4. Action: Post to selected platforms
5. Action: Log analytics

**Workflow 3: Thank-You Post Automation**
1. Trigger: Webhook from SAGA (major gift received)
2. Action: Generate AI thank-you post (without donor name for privacy)
3. Action: Publish to platforms
4. Action: Track engagement

**Technical Implementation:**
- app/api/n8n/ - All n8n-related endpoints
- lib/n8n/webhook-handlers.ts - Process n8n webhooks
- lib/n8n/api-auth.ts - API key validation
- app/integrations/n8n/ - n8n setup guide UI
- Database: N8nIntegration, ApiKey models (add to schema)

**Documentation to Create:**
- n8n integration guide (step-by-step with screenshots)
- Sample n8n workflows (JSON templates users can import)
- API documentation for n8n endpoints
- Video tutorial: "Set up social media automation with n8n"

---

### Week 29-30: Social Media Analytics & Insights

**Agent to Launch:** Data Director + Infrastructure Director

#### Features to Build:
1. **Platform API Integrations**
   - Facebook Graph API - fetch post metrics
   - Instagram Graph API - fetch engagement
   - LinkedIn API - fetch analytics
   - X (Twitter) API - fetch stats

2. **Analytics Dashboard**
   - Post performance (reach, engagement, clicks)
   - Best performing posts
   - Best posting times
   - Audience growth
   - Engagement rate trends
   - Platform comparison

3. **AI Insights**
   - AI analysis of top-performing content
   - Content recommendations based on performance
   - Optimal posting schedule (ML model)
   - Sentiment analysis of comments

4. **ROI Tracking**
   - Link posts to donations (UTM tracking)
   - Conversion tracking (post → donation page → donation)
   - Cost per acquisition (if running paid ads)
   - Social media attribution in donor journey

**Technical Implementation:**
- app/social-media/analytics/
- app/api/social-media/platforms/facebook/
- app/api/social-media/platforms/instagram/
- lib/social-media/facebook-client.ts
- lib/social-media/instagram-client.ts
- lib/social-media/linkedin-client.ts
- lib/social-media/twitter-client.ts
- Database: SocialAnalytics, PlatformMetrics models (add to schema)

---

### Week 31-32: Testing, Documentation & Launch

**Agents to Launch:** Testing Director + Documentation Director

#### 32.1 Comprehensive Testing
- Test all n8n workflows end-to-end
- Test social media posting to real accounts
- Verify analytics data accuracy
- Load testing for API endpoints
- Security audit of n8n integration

#### 32.2 Documentation
- Complete user guide for social media features
- n8n setup video tutorials
- API documentation for developers
- Best practices guide for social media automation
- Compliance guide (privacy, GDPR)

#### 32.3 Launch Preparation
- Beta testing with select customers
- Collect feedback and iterate
- Marketing materials for new feature
- Pricing strategy for social media tier
- Customer support training

---

## 📦 Additional Features & Nice-to-Haves

**Post-Launch Enhancements (Weeks 33+)**

### Mobile App (React Native)
- Native iOS and Android apps
- Push notifications
- Offline mode
- Mobile donation scanning (QR codes)

### Event Management
- Create events (galas, fundraisers)
- Ticket sales
- Check-in system
- Event analytics

### Grant Management
- Grant application tracking
- Reporting to grantors
- Compliance tracking
- Grant spending reports

### Volunteer Management
- Volunteer database
- Shift scheduling
- Hours tracking
- Volunteer communication

### Board Portal
- Board member access
- Financial dashboards
- Meeting notes and voting
- Document library

---

## 🛠️ Technical Infrastructure

### Database Additions Needed

**New Models to Add to Prisma Schema:**

```prisma
model DonationPage {
  id              String   @id @default(cuid())
  organizationId  String
  name            String
  slug            String   @unique
  config          Json     // Stores builder config
  isPublished     Boolean  @default(false)
  createdAt       DateTime @default(now())

  organization    Organization @relation(fields: [organizationId], references: [id])
  @@map("donation_pages")
}

model Workflow {
  id              String   @id @default(cuid())
  organizationId  String
  name            String
  trigger         String   // "donation_created", "contact_created", etc.
  actions         Json     // Array of actions
  isActive        Boolean  @default(true)

  organization    Organization @relation(fields: [organizationId], references: [id])
  executions      WorkflowExecution[]
  @@map("workflows")
}

model WorkflowExecution {
  id              String   @id @default(cuid())
  workflowId      String
  status          String   // "success", "failed", "running"
  logs            Json
  executedAt      DateTime @default(now())

  workflow        Workflow @relation(fields: [workflowId], references: [id])
  @@map("workflow_executions")
}

model DonorGift {
  id              String   @id @default(cuid())
  donationId      String
  contactId       String
  giftTierId      String
  printfulOrderId String?
  status          String   // "pending", "ordered", "shipped", "delivered"

  donation        Donation @relation(fields: [donationId], references: [id])
  contact         Contact  @relation(fields: [contactId], references: [id])
  @@map("donor_gifts")
}

model SocialPost {
  id              String   @id @default(cuid())
  organizationId  String
  content         String
  platforms       String[] // ["facebook", "instagram"]
  scheduledFor    DateTime?
  publishedAt     DateTime?
  status          String   // "draft", "scheduled", "published"
  aiGenerated     Boolean  @default(false)

  organization    Organization @relation(fields: [organizationId], references: [id])
  @@map("social_posts")
}

model N8nIntegration {
  id              String   @id @default(cuid())
  organizationId  String
  apiKey          String   @unique
  webhookUrl      String?
  isActive        Boolean  @default(true)

  organization    Organization @relation(fields: [organizationId], references: [id])
  @@map("n8n_integrations")
}
```

---

## 📈 Success Metrics by Phase

### Phase 1 (MVP) Metrics
- Time to send first donation receipt: < 30 seconds
- PDF generation success rate: 99%+
- Campaign creation time: < 2 minutes
- Email delivery rate: 95%+

### Phase 2 Metrics
- Donation page conversion rate: 2-5%
- Workflow automation adoption: 60% of orgs
- Average emails sent per org per month: 500+
- Donor gift fulfillment time: < 7 days

### Phase 3 Metrics
- Stripe payment success rate: 97%+
- QuickBooks sync accuracy: 99%+
- Mailchimp integration adoption: 40% of orgs

### Phase 4 Metrics
- Social posts created per org per month: 20+
- Social media engagement rate: 3-5%
- n8n workflow adoption: 30% of orgs
- AI post generation time: < 10 seconds

---

## 🚀 Agent Deployment Strategy

### For Each Week's Work:

1. **Identify the "Director" Needed:**
   - Feature Director: UI/UX features
   - Infrastructure Director: Integrations, DevOps
   - AI Director: AI features
   - Data Director: Reports, analytics
   - Testing Director: QA
   - Documentation Director: Docs

2. **Launch Agents in Parallel When Possible:**
   - Week 4: 3 agents (Sentry + Rate Limiting + Security)
   - Week 5-6: 2 agents (Notifications + Search)
   - Week 19-20: 2 agents (Mailchimp + Meta)

3. **Single Agent for Cohesive Features:**
   - Week 9-10: Donation Page Builder (1 Feature Director)
   - Week 11-12: Communication Hub (1 Infrastructure Director)

4. **Review Agent Output:**
   - Test deliverables
   - Code review
   - User acceptance testing
   - Deploy to production

---

## 💰 Pricing Strategy (Recommendation)

### Tiered Pricing Based on Features:

**Starter ($49/mo)**
- Up to 1,000 contacts
- Unlimited donations
- Email receipts
- Basic reports
- 1 user

**Professional ($149/mo)** - Most Popular
- Up to 10,000 contacts
- Everything in Starter
- Campaigns
- Donation pages
- Automation workflows
- Communication hub
- 5 users
- Priority support

**Enterprise ($399/mo)**
- Unlimited contacts
- Everything in Professional
- Donor gifts (Printful)
- All integrations (Stripe, QuickBooks, Mailchimp, Meta)
- AI social media + n8n
- Advanced analytics
- Unlimited users
- Dedicated support

---

## 🎯 Next Immediate Actions

### Right Now (Agents Running):
1. ✅ Email automation agent working
2. ✅ PDF generation agent working
3. ✅ Campaigns UI agent working

### When Agents Complete (2-4 hours):
1. Review and test all deliverables
2. Fix any issues or bugs
3. Deploy to production
4. Update documentation

### This Week:
1. Launch Data Director for Reports (Week 3)
2. Test end-to-end: Create donation → Email sent → PDF downloaded
3. Create sample campaigns and test UI

### Next Week:
1. Launch 3 Infrastructure Directors for security (Week 4)
2. Begin UX polish (Week 5-6)
3. Prepare for Phase 2 features

---

## 📞 n8n Integration - Your Question Answered

**You asked:** "are you able to assist in working with n8n for that?"

**Answer:** Yes, absolutely! Here's what I can help with:

### What I Can Do:
1. **Design the API architecture** for n8n integration
2. **Build webhook endpoints** in SAGA CRM for n8n to call
3. **Create data structures** that n8n can consume
4. **Write API documentation** for n8n workflows
5. **Provide sample n8n workflow templates** (JSON files)
6. **Create step-by-step guides** for setting up n8n
7. **Build the UI** in SAGA for managing n8n connections

### What You'll Need to Do (or Your Users):
1. **Set up n8n instance** (self-hosted or n8n.cloud)
2. **Configure social media OAuth** in n8n (Facebook, Instagram, LinkedIn, X)
3. **Import workflow templates** into n8n
4. **Test workflows** with real accounts
5. **Customize workflows** for specific needs

### How the Integration Works:
1. **SAGA CRM generates AI content** via API
2. **SAGA sends webhook to n8n** when post is created
3. **n8n receives webhook** and triggers workflow
4. **n8n posts to social platforms** using their native nodes
5. **n8n sends analytics back to SAGA** via webhook
6. **SAGA displays analytics** in dashboard

This is a **best-of-both-worlds approach**:
- SAGA handles: AI generation, content storage, CRM data
- n8n handles: Social media posting, complex workflows, scheduling

---

## 🎉 Summary

You now have a **complete roadmap** for building the full SAGA CRM vision:

- **Phase 1 (Weeks 1-8):** MVP with email, PDF, campaigns, reports, security ➡️ Launch and get revenue
- **Phase 2 (Weeks 9-16):** Donation pages, communication hub, workflows, donor gifts ➡️ Differentiate
- **Phase 3 (Weeks 17-24):** Stripe, Mailchimp, Meta, QuickBooks, advanced analytics ➡️ Scale
- **Phase 4 (Weeks 25-32):** AI social media + n8n integration ➡️ Innovate

**Current Status:** 3 agents working on Phase 1 critical features (email, PDF, campaigns UI)

**Next Steps:** Wait for agents to complete, review deliverables, then proceed with Week 3 (Reports)

**Timeline to Full Vision:** 24-32 weeks of focused development

**Total Features:** 50+ major features across 4 phases

Ready to build the most advanced nonprofit CRM on the market! 🚀
