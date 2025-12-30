# SAGA CRM: Product Requirements Document for Launch
## AI-Powered Nonprofit CRM - MVP Launch Specification

**Version:** 1.0
**Date:** December 29, 2025
**Status:** Draft → Implementation
**Target Launch:** 8-10 weeks from start
**Author:** SAGA Product Team

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Product Vision & Goals](#product-vision--goals)
3. [Target Users](#target-users)
4. [Core Features (MVP)](#core-features-mvp)
5. [Technical Requirements](#technical-requirements)
6. [AI Features Specification](#ai-features-specification)
7. [User Workflows](#user-workflows)
8. [Success Metrics](#success-metrics)
9. [Launch Checklist](#launch-checklist)
10. [Post-Launch Roadmap](#post-launch-roadmap)

---

## 1. EXECUTIVE SUMMARY

### Product Overview
SAGA CRM is an AI-powered customer relationship management platform designed specifically for nonprofit organizations. It streamlines donor management, automates thank-you communications, and provides intelligent insights to help nonprofits raise more funds.

### Current State
- **Progress:** 40% complete toward MVP
- **Infrastructure:** ✅ Production-ready
- **Core Features:** ⚠️ Partially implemented
- **AI Integration:** ⚠️ Backend ready, UI incomplete

### Launch Goals
1. **Functional MVP:** Complete donation management with AI-powered receipts
2. **Beta Launch:** 10 nonprofit organizations testing the platform
3. **Revenue Target:** $150-250 MRR within 4 weeks of launch
4. **Product-Market Fit:** 8/10 NPS score from beta users

### Critical Path (8 weeks)
- **Weeks 1-2:** Email automation + PDF receipts
- **Weeks 3-4:** Campaigns + Reports
- **Weeks 5-6:** Security + Testing
- **Weeks 7-8:** Polish + Launch prep

---

## 2. PRODUCT VISION & GOALS

### Vision Statement
"Empower nonprofit organizations to build deeper donor relationships through AI-powered insights and automation, enabling them to focus on their mission rather than administrative tasks."

### Strategic Goals

**For Nonprofits:**
- Reduce time spent on administrative tasks by 60%
- Increase donor retention by 25% through personalized communications
- Provide actionable insights to grow fundraising revenue by 35%

**For SAGA:**
- Acquire 50 paying customers within 6 months of launch
- Achieve $2.5k-5k MRR by Month 6
- Establish SAGA as the AI-first nonprofit CRM
- Build foundation for $1M ARR within 18 months

### Unique Value Proposition

**What makes SAGA different:**

1. **AI-First Design**
   - Every feature enhanced by Claude AI
   - Personalized thank-you messages (not templates)
   - Intelligent donor profiling
   - Predictive analytics

2. **Nonprofit-Specific**
   - Fund accounting (unrestricted, restricted, endowment)
   - Fiscal sponsorship support
   - IRS compliance built-in
   - Nonprofit workflows

3. **Beautiful, Modern UX**
   - Dark glassmorphic design
   - Intuitive navigation
   - Mobile-responsive
   - Fast, delightful interactions

4. **Affordable Pricing**
   - $49/month (vs Bloomerang $99/month, DonorPerfect $150/month)
   - No hidden fees
   - Unlimited contacts
   - Unlimited users

---

## 3. TARGET USERS

### Primary Persona: "Sarah the Small Nonprofit Director"

**Demographics:**
- Age: 35-55
- Role: Executive Director or Development Director
- Organization size: $100k-$2M annual budget
- Staff: 1-10 employees
- Tech savviness: Moderate

**Pain Points:**
- Spending 10+ hours/week on donation tracking and receipts
- Using spreadsheets or outdated software
- Can't afford enterprise CRM solutions ($150-500/month)
- Missing opportunities to engage donors personally
- No insights into donor behavior or trends

**Goals:**
- Automate donation receipts and thank-yous
- Track all donors in one place
- Understand which donors to prioritize
- Run effective fundraising campaigns
- Stay compliant with IRS regulations

**Success Criteria:**
- Can import existing donor list in <10 minutes
- Can record a donation and send receipt in <2 minutes
- Gets AI insights without learning complex analytics
- Saves 8+ hours per week on admin tasks

### Secondary Persona: "Tom the Board Member"

**Demographics:**
- Age: 45-65
- Role: Board member or volunteer
- Tech savviness: Low to moderate

**Needs:**
- Simple, read-only access to reports
- Dashboard to see fundraising progress
- No training required
- Mobile-friendly

---

## 4. CORE FEATURES (MVP)

### 4.1 Authentication & User Management

**Requirements:**
- ✅ Email/password login (COMPLETE)
- ✅ User registration (COMPLETE)
- ✅ Organization creation on signup (COMPLETE)
- ⚠️ Password reset flow (TO BUILD)
- ⚠️ Email verification (TO BUILD)
- ✅ Role-based access (Admin, Member, Viewer) (COMPLETE)

**User Stories:**
- As a nonprofit director, I can create an account and automatically create my organization
- As an admin, I can invite team members with different permission levels
- As a user, I can reset my password via email

**Acceptance Criteria:**
- [ ] New user can register and access dashboard within 2 minutes
- [ ] Password reset email arrives within 30 seconds
- [ ] Session persists for 30 days with "Remember Me"
- [ ] User can sign out from any page

### 4.2 Contacts Management

**Requirements:**
- ✅ Create contacts (COMPLETE)
- ✅ Edit contacts (COMPLETE)
- ✅ View contact details (COMPLETE)
- ✅ Import contacts from CSV (COMPLETE)
- ⚠️ Export contacts to CSV (TO BUILD)
- ⚠️ Delete contacts (soft delete) (TO BUILD)
- ⚠️ Bulk operations (tag, delete) (TO BUILD)
- ✅ Contact types (Donor, Volunteer, Board Member, etc.) (COMPLETE)
- ✅ Contact status (Active, Inactive, Do Not Contact) (COMPLETE)

**Contact Fields:**
- ✅ Name (first, last)
- ✅ Email (required, unique per org)
- ✅ Phone
- ✅ Address (street, city, state, zip, country)
- ✅ Tags (array of custom tags)
- ✅ Notes (free text)
- ✅ Type (dropdown)
- ✅ Status (dropdown)

**Calculated Fields:**
- ✅ Total lifetime giving
- ✅ Number of donations
- ✅ Last gift date
- ✅ Last gift amount

**User Stories:**
- As a staff member, I can add a new donor in under 1 minute
- As an admin, I can import 500 contacts from my old spreadsheet
- As a user, I can see a contact's full donation history on their detail page
- As a user, I can tag contacts for segmentation (e.g., "major donor", "monthly giver")

**Acceptance Criteria:**
- [ ] Contact form validates email format
- [ ] CSV import handles common formats (Excel export, Google Sheets)
- [ ] Import shows preview before confirming
- [ ] Contact list shows lifetime giving and last gift
- [ ] Can search by name, email, or phone
- [ ] Can filter by type, status, or tags

### 4.3 Donations Management

**Requirements:**
- ✅ Create donation (COMPLETE)
- ⚠️ Edit donation (TO BUILD)
- ⚠️ Delete donation (soft delete) (TO BUILD)
- ✅ View donation list (COMPLETE)
- ✅ View donation detail (COMPLETE)
- ⚠️ Generate PDF receipt (TO BUILD) ⚡ CRITICAL
- ⚠️ Email receipt automatically (TO BUILD) ⚡ CRITICAL
- ⚠️ Resend receipt manually (TO BUILD) ⚡ CRITICAL

**Donation Fields:**
- ✅ Contact (dropdown, required)
- ✅ Amount (number, required)
- ✅ Date (date picker, required)
- ✅ Fund restriction (dropdown)
- ✅ Payment method (dropdown)
- ✅ Donation type (one-time, monthly, annual, etc.)
- ✅ Campaign (optional dropdown)
- ✅ Transaction/check number (optional)
- ✅ Notes (optional)

**Fund Restriction Options:**
- ✅ Unrestricted (general operating)
- ✅ Program Restricted (specific program)
- ✅ Temporarily Restricted (time-bound)
- ✅ Permanently Restricted (endowment)
- ✅ Project Designated (fiscal sponsorship)

**Calculated Fields:**
- Total raised (all time)
- Total raised (this month)
- Total raised (this year)
- Average gift size
- Number of donations

**AI Features:**
- ✅ AI-generated thank-you message preview (COMPLETE)
- ⚠️ AI-generated thank-you in email (TO BUILD)
- ⚠️ Donor intelligence panel on detail page (TO BUILD)

**User Stories:**
- As a staff member, I can record a $100 donation in under 2 minutes
- As a donor, I receive a personalized thank-you email within 5 minutes of my gift
- As a staff member, I can see AI-generated insights about a donor's giving pattern
- As an admin, I can resend a receipt if a donor didn't receive it

**Acceptance Criteria:**
- [ ] Donation form validates amount > 0
- [ ] AI thank-you preview generates in <3 seconds
- [ ] PDF receipt downloads with all required IRS fields
- [ ] Email receipt arrives within 5 minutes
- [ ] Email includes AI thank-you message
- [ ] Email includes PDF receipt attachment
- [ ] Email log tracks sent, opened, bounced status
- [ ] Donation detail page shows contact info and AI insights

**Email Receipt Requirements:**
- **Subject:** "Thank you for your donation to [Org Name]"
- **From:** "[Org Name] <support@sagacrm.io>"
- **To:** Contact's email
- **Body:**
  - Personalized AI thank-you message
  - Donation details (amount, date, fund)
  - Organization details (name, EIN)
  - Tax receipt disclaimer
  - Link to view online
- **Attachment:** PDF receipt
- **Tracking:** Log send time, open time, bounce status

**PDF Receipt Requirements:**
- **Header:** Organization name and logo
- **Recipient:** Donor name and address
- **Body:**
  - Donation amount and date
  - Payment method
  - Fund/program designation
  - Tax-deductible disclaimer
  - Organization EIN
  - "No goods or services were provided in exchange for this contribution."
- **Footer:** Organization contact info
- **Design:** Professional, branded, print-ready

### 4.4 Campaigns Management

**Requirements:**
- ⚠️ Create campaign (TO BUILD) ⚡ CRITICAL
- ⚠️ Edit campaign (TO BUILD)
- ⚠️ View campaign list (TO BUILD)
- ⚠️ View campaign detail with progress (TO BUILD)
- ⚠️ Link donations to campaign (BACKEND READY, UI TO BUILD)
- ⚠️ Campaign analytics (TO BUILD)

**Campaign Fields:**
- Name (required)
- Description (optional)
- Goal amount (optional, number)
- Start date (optional)
- End date (optional)
- Status (Draft, Active, Completed, Cancelled)
- Tags (array)

**Calculated Fields:**
- Total raised
- Number of donations
- Number of donors
- Average gift
- Progress percentage (raised / goal)
- Days remaining

**User Stories:**
- As an admin, I can create a "Year-End 2025" campaign with a $50k goal
- As a user, I can see campaign progress in real-time
- As a user, I can link donations to campaigns when recording them
- As a donor, I can specify which campaign my gift supports

**Acceptance Criteria:**
- [ ] Campaign list shows active campaigns first
- [ ] Campaign detail shows progress bar
- [ ] Can filter donations by campaign
- [ ] Campaign card shows % to goal
- [ ] Can mark campaign as complete when goal is reached

### 4.5 Reports & Analytics

**Requirements:**
- ⚠️ Donation trends chart (TO BUILD) ⚡ CRITICAL
- ⚠️ Top donors table (TO BUILD) ⚡ CRITICAL
- ⚠️ Donor retention metrics (TO BUILD)
- ⚠️ Campaign performance (TO BUILD)
- ⚠️ Export reports to CSV (TO BUILD)
- ⚠️ Export reports to PDF (TO BUILD)

**Charts & Visualizations:**

1. **Donation Trends (Line Chart)**
   - X-axis: Months (last 12 months)
   - Y-axis: Total amount raised
   - Comparison: This year vs. last year

2. **Top Donors (Table)**
   - Columns: Name, Total Given, # Gifts, Last Gift Date, Avg Gift
   - Sortable by any column
   - Shows top 25 donors

3. **Donor Retention (Metrics)**
   - New donors this year
   - Returning donors this year
   - Lapsed donors (gave last year, not this year)
   - Retention rate (%)

4. **Campaign Performance (Bar Chart)**
   - X-axis: Campaign names
   - Y-axis: Amount raised
   - Target line for goal amount

**User Stories:**
- As a board member, I can see at a glance how fundraising is trending
- As an ED, I can identify our top 25 donors to prioritize for stewardship
- As an admin, I can export a year-end giving report for the board
- As a user, I can see which campaigns performed best

**Acceptance Criteria:**
- [ ] Charts render with real data from database
- [ ] Charts are interactive (hover tooltips)
- [ ] Charts update when date range changes
- [ ] Reports can be filtered by date range, fund, campaign
- [ ] Export includes all visible data
- [ ] PDF export maintains chart visualizations

### 4.6 AI Features (Integrated Throughout)

**AI Thank-You Messages (COMPLETE)**
- ✅ Real-time preview in donation form
- ⚠️ Included in email receipts (TO BUILD)
- Personalized based on:
  - Donor name
  - Gift amount
  - Fund designation
  - Donor history (new vs. returning)

**Donor Intelligence (PARTIAL)**
- ⚠️ Giving frequency analysis (BACKEND READY, UI TO BUILD)
- ⚠️ Gift trend (increasing, stable, decreasing) (BACKEND READY, UI TO BUILD)
- ⚠️ Preferred gift amount (BACKEND READY, UI TO BUILD)
- ⚠️ Suggested ask amount (BACKEND READY, UI TO BUILD)
- ⚠️ Major gift prospect score (BACKEND READY, UI TO BUILD)

**Campaign Optimization (POST-MVP)**
- ❌ Best time to launch campaign
- ❌ Suggested goal amount
- ❌ Predicted success rate
- ❌ Donor segmentation suggestions

**Executive Summaries (POST-MVP)**
- ❌ Board-ready monthly summary
- ❌ Key insights and trends
- ❌ Action recommendations

**User Stories:**
- As a user, I see an AI-generated thank-you message that feels personal, not templated
- As an admin, I can see AI insights about a donor's giving pattern on their detail page
- As an ED, I get AI recommendations on which donors to approach for major gifts
- As a board member, I receive an AI-generated executive summary each month

**Acceptance Criteria:**
- [ ] AI messages feel personal and contextually appropriate
- [ ] AI generates response in <3 seconds
- [ ] Fallback message displays if AI fails
- [ ] AI insights are accurate (validated against historical data)
- [ ] AI recommendations are actionable

---

## 5. TECHNICAL REQUIREMENTS

### 5.1 Technology Stack (CURRENT - NO CHANGES)

**Frontend:**
- ✅ Next.js 16 (App Router)
- ✅ React 19
- ✅ TypeScript 5
- ✅ Tailwind CSS v4
- ✅ shadcn/ui components

**Backend:**
- ✅ Next.js API Routes
- ✅ Prisma ORM 7
- ✅ PostgreSQL (Supabase)

**AI & Services:**
- ✅ Anthropic Claude API (Sonnet 4.5)
- ⚠️ Resend (email) - TO INTEGRATE
- ⚠️ @react-pdf/renderer (PDF generation) - TO INSTALL

**Deployment:**
- ✅ Vercel (hosting)
- ✅ Supabase (database)

### 5.2 Infrastructure Requirements

**Email Service (Resend)**
- API key secured in environment variables
- Sending limit: 3,000 emails/month (free tier) → upgrade to 50,000/month ($20/month) at launch
- Domain authentication (SPF, DKIM records)
- Webhook for delivery tracking

**Monitoring (Sentry)**
- Error tracking for production
- Performance monitoring
- User feedback integration
- Alert rules for critical errors

**Database**
- Supabase Pro plan ($25/month) for production
- Automated backups (daily)
- Row-level security enabled
- Connection pooling configured

**AI Service (Anthropic)**
- API key secured
- Budget: $100/month for AI calls (~2,000 requests)
- Rate limiting: 10 requests/minute per user
- Fallback for API failures

### 5.3 Performance Requirements

**Page Load:**
- Dashboard: <2 seconds
- Contact/donation list: <3 seconds
- Reports with charts: <5 seconds

**API Response:**
- CRUD operations: <500ms
- AI generation: <3 seconds
- Email sending: <5 seconds (async)

**Concurrent Users:**
- Support 100 concurrent users
- Database connection pool: 20 connections

**Data Limits:**
- Contacts: Up to 10,000 per organization
- Donations: Up to 50,000 per organization
- File uploads: 5MB max

### 5.4 Security Requirements

**Authentication:**
- ✅ Password hashing with bcrypt
- ✅ JWT sessions (30-day expiry with "Remember Me")
- ⚠️ Password reset tokens (1-hour expiry) - TO BUILD
- ⚠️ Email verification - TO BUILD

**Authorization:**
- ✅ Row-level security (RLS) in database
- ✅ API route protection with auth middleware
- ✅ Role-based access control (Admin, Member, Viewer)

**Data Protection:**
- ⚠️ Rate limiting on API routes (TO BUILD)
- ⚠️ Input validation with Zod (TO BUILD)
- ⚠️ CSRF protection (TO BUILD)
- ✅ SQL injection prevention (Prisma)
- ✅ XSS prevention (React escaping)

**Compliance:**
- ✅ GDPR audit log (table exists, TO USE)
- ⚠️ Data export for users (TO BUILD)
- ⚠️ Data deletion (right to be forgotten) (TO BUILD)
- Privacy Policy page
- Terms of Service page

**Security Headers:**
- ⚠️ Content Security Policy (CSP) - TO BUILD
- ⚠️ HSTS (HTTPS enforcement) - TO BUILD
- ⚠️ X-Frame-Options - TO BUILD

### 5.5 Testing Requirements

**Unit Tests (Vitest):**
- AI utility functions (receipt generation, donor analysis)
- Data transformation helpers
- Validation schemas

**Integration Tests:**
- API routes (CRUD operations)
- Authentication flows
- Database queries

**E2E Tests (Playwright):**
- User registration and login
- Create donation → send receipt flow
- Import contacts from CSV
- Generate and export reports

**Test Coverage Goal:** 70%+ for critical paths

---

## 6. AI FEATURES SPECIFICATION

### 6.1 AI Thank-You Message Generation

**Current Status:** ✅ COMPLETE (backend + UI preview)

**Functionality:**
- Generates personalized thank-you message based on:
  - Donor's first and last name
  - Donation amount
  - Fund restriction/designation
  - Donor history (new donor vs. returning)
  - Organization name

**Implementation:**
- Model: Claude Sonnet 4.5
- Max tokens: 1024
- Temperature: 0.7 (balance creativity and consistency)
- Fallback: Template-based message if AI fails

**Quality Criteria:**
- Feels personal and human-written
- Appropriate tone (warm, grateful, professional)
- Mentions specific details (amount, fund, donor status)
- Length: 2-3 sentences (50-100 words)
- No placeholder text or obvious AI artifacts

**Example Output:**
```
Dear Sarah,

Thank you so much for your generous gift of $500 to support our Education Programs. Your contribution will help us provide scholarships to underprivileged students and expand our tutoring services. We're deeply grateful for your partnership in our mission.

With sincere appreciation,
Green Valley Community Center
```

**Integration Points:**
- ✅ Donation form (real-time preview)
- ⚠️ Email receipt (body text) - TO BUILD
- ⚠️ PDF receipt (optional inclusion) - TO BUILD

### 6.2 Donor Intelligence Analysis

**Current Status:** ⚠️ PARTIAL (backend functions exist, not exposed in UI)

**Functionality:**
Analyze donor's giving history to provide actionable insights:

**Insights Generated:**
1. **Giving Frequency**
   - Category: "Monthly supporter", "Annual donor", "Occasional giver", "One-time donor"
   - Based on: Number of gifts and time between gifts

2. **Gift Trend**
   - Category: "Increasing", "Stable", "Decreasing", "New donor"
   - Based on: Comparison of recent gifts to historical average

3. **Preferred Gift Amount**
   - Typical gift range (e.g., "$100-$250")
   - Most common amount

4. **Suggested Ask Amount**
   - Recommended ask for next solicitation
   - Based on: Previous gifts, trend, donor capacity indicators

5. **Major Gift Prospect Score**
   - Score: 0-100
   - Based on: Lifetime giving, gift frequency, gift trajectory, engagement
   - Threshold for major gift: Score >70

**Implementation:**
- Functions exist in `lib/ai/donor-profiles.ts`
- Uses Claude Sonnet 4.5 for narrative insights
- Statistical analysis for scores and trends

**UI Integration (TO BUILD):**
- Contact detail page: "Donor Intelligence" panel (sidebar)
- Dashboard: "Major Gift Prospects" widget (top 10)
- Reports: "Donor Engagement Scores" table

**Example Output:**
```
Donor Intelligence: Sarah Johnson

Giving Pattern: Monthly Supporter
  Sarah has made 12 gifts over the past 14 months, averaging $250 per gift.

Trend: Increasing
  Her gifts have grown from $150 (first gift) to $350 (most recent).

Recommendation: Ask for $500
  Based on her giving trajectory and engagement, Sarah is ready for a larger ask.

Major Gift Potential: 85/100 (High)
  Sarah shows strong indicators of major gift capacity and commitment.
```

### 6.3 Donation Insights (Dashboard)

**Current Status:** ⚠️ PARTIAL (backend functions exist, not exposed in UI)

**Functionality:**
Generate AI-powered insights for organization's donation data:

**Insights Generated:**
1. **Giving Trends**
   - Overall trend (up, down, stable)
   - Year-over-year comparison
   - Month-over-month comparison

2. **Donor Retention**
   - Retention rate (%)
   - New vs. returning donor ratio
   - Lapsed donor identification

3. **Campaign Performance**
   - Best performing campaigns
   - Underperforming campaigns
   - Recommendations for improvement

4. **Revenue Forecasting**
   - Projected end-of-year total
   - Confidence interval

**UI Integration (TO BUILD):**
- Dashboard: "AI Insights" card
- Reports page: "Executive Summary" section

**Example Output:**
```
AI Insights for December 2025

Trend: Strong Growth
  Your fundraising is up 22% compared to last December. You're on track to exceed your annual goal by $15,000.

Top Opportunity: Monthly Giving
  Monthly donors represent 35% of your revenue with just 12% of your donor base. Consider launching a monthly giving campaign to capitalize on this strong performance.

Action Item: Re-engage Lapsed Donors
  You have 47 donors who gave in 2024 but haven't given yet in 2025. A personalized outreach could recover an estimated $8,500 in revenue.
```

---

## 7. USER WORKFLOWS

### 7.1 Core Workflow: Record a Donation

**Actor:** Staff Member
**Trigger:** Receives a check or online donation notification
**Goal:** Record donation and send receipt in <3 minutes

**Steps:**
1. Navigate to Donations → New Donation
2. Select donor from dropdown (or click "Add new contact")
3. Enter amount: $250
4. Select payment method: Check
5. Enter check number: #4521
6. Select fund: Unrestricted
7. (Optional) Select campaign: "Annual Fund 2025"
8. **See AI thank-you preview generate automatically**
9. Click "Save Donation"
10. **System automatically:**
    - Generates receipt number
    - Creates donation record
    - Generates AI thank-you message
    - Creates PDF receipt
    - Sends email with thank-you + PDF
    - Logs email send
11. User sees success message: "Donation recorded! Receipt sent to donor@email.com"

**Time:** <2 minutes (goal)
**Success Criteria:**
- Form is intuitive (no training needed)
- AI preview shows relevant, personal message
- Email arrives within 5 minutes
- PDF is professional and print-ready

### 7.2 Onboarding Workflow: New Organization Signup

**Actor:** Executive Director (new user)
**Trigger:** Visits SAGA CRM website
**Goal:** Go from signup to first donation recorded in <15 minutes

**Steps:**
1. Click "Get Started" on homepage
2. Fill registration form:
   - Name, Email, Password
   - Organization Name, EIN
3. Click "Create Account"
4. **Redirected to Dashboard**
5. See welcome message: "Welcome to SAGA CRM! Let's get you started."
6. See setup checklist:
   - [ ] Import your donor list
   - [ ] Record your first donation
   - [ ] Create a campaign
7. Click "Import Donor List"
8. Upload CSV file (500 contacts)
9. Map columns (First Name → firstName, Email → email, etc.)
10. Preview 5 sample records
11. Click "Import 500 Contacts"
12. **System imports contacts in <30 seconds**
13. Success message: "500 contacts imported!"
14. Navigate to Donations → New Donation
15. Select donor from dropdown (now populated)
16. Record first donation
17. See success message + email receipt sent
18. **Setup checklist updates: 2/3 complete** ✅

**Time:** <15 minutes (goal)
**Success Criteria:**
- No confusion at any step
- CSV import handles common formats
- Can see immediate value (contacts imported, donation recorded)
- Feels accomplishment (checklist progress)

### 7.3 Monthly Workflow: Board Report Generation

**Actor:** Executive Director
**Trigger:** End of month, needs board report
**Goal:** Generate professional report in <5 minutes

**Steps:**
1. Navigate to Reports
2. See dashboard with charts:
   - Donation trends (last 12 months)
   - Top donors (this year)
   - Campaign performance
   - AI insights summary
3. Adjust date range: "This Month" (December 2025)
4. See updated charts
5. Read AI insights:
   - "December was your strongest month, up 35% from last December..."
   - "Monthly giving program continues to outperform expectations..."
   - "Recommendation: Launch a matching gift campaign in Q1..."
6. Click "Export Report"
7. Select format: PDF
8. **System generates PDF with:**
   - All charts (as images)
   - AI insights
   - Top donor table
   - Key metrics summary
9. Download PDF: "SAGA_Report_December_2025.pdf"
10. Email to board members

**Time:** <5 minutes (goal)
**Success Criteria:**
- Report looks professional (board-ready)
- Charts are clear and readable
- AI insights add value (not generic)
- Export preserves formatting

---

## 8. SUCCESS METRICS

### 8.1 Product Metrics (Week 1-8)

**Adoption Metrics:**
- [ ] 10 beta organizations signed up
- [ ] 50+ users registered
- [ ] 5,000+ contacts imported
- [ ] 500+ donations recorded
- [ ] 100+ campaigns created

**Engagement Metrics:**
- [ ] 80% of users return within 7 days of signup
- [ ] Average 3 logins per week per active user
- [ ] 90% of donations trigger automatic emails
- [ ] 75% of AI-generated thank-yous are used (not edited)

**Quality Metrics:**
- [ ] <2% email bounce rate
- [ ] <1% error rate on core features
- [ ] 8/10 Net Promoter Score (NPS)
- [ ] 90% user satisfaction (post-task survey)

**Performance Metrics:**
- [ ] Dashboard loads in <2 seconds (p95)
- [ ] AI generation completes in <3 seconds (p95)
- [ ] Email delivery in <5 minutes (p95)
- [ ] 99.9% uptime

### 8.2 Business Metrics (Month 1-6)

**Revenue Goals:**
- Month 1: $150 MRR (3 paying customers @ $49/month)
- Month 2: $500 MRR (10 customers)
- Month 3: $1,000 MRR (20 customers)
- Month 6: $2,500 MRR (50 customers)

**Customer Acquisition:**
- Cost per acquisition (CPA): <$100
- Customer lifetime value (LTV): >$1,000 (>20 months retention)
- LTV:CAC ratio: >10:1

**Retention:**
- Month 1 retention: 90%
- Month 3 retention: 80%
- Month 6 retention: 75%

**Conversion Funnel:**
- Website visit → Signup: 5%
- Signup → First donation recorded: 80%
- Free trial → Paid: 60%
- (Assuming 14-day free trial)

### 8.3 User Satisfaction (Ongoing)

**Net Promoter Score (NPS):**
- Target: 8/10
- Question: "How likely are you to recommend SAGA CRM to another nonprofit?"

**Customer Satisfaction (CSAT):**
- Target: 4.5/5
- Question: "How satisfied are you with SAGA CRM?"

**Feature Satisfaction:**
- Donation management: 4.8/5
- AI thank-you messages: 4.5/5
- Contact management: 4.3/5
- Reports: 4.0/5

**Time Saved:**
- Target: 8+ hours/week
- Question: "How much time does SAGA CRM save you each week?"

---

## 9. LAUNCH CHECKLIST

### Week 1-2: Email & PDF ⚡ CRITICAL

- [ ] Install Resend API client
- [ ] Set up email domain authentication (SPF, DKIM)
- [ ] Create React Email templates:
  - [ ] donation-receipt.tsx
  - [ ] thank-you.tsx
  - [ ] welcome.tsx
- [ ] Build `lib/email/client.ts` (Resend wrapper)
- [ ] Build `lib/email/send-receipt.ts` (main sending logic)
- [ ] Create API route: `app/api/donations/[id]/receipt/route.ts`
- [ ] Update donation creation to auto-send email
- [ ] Add "Resend Receipt" button to donation detail page
- [ ] Test email delivery end-to-end
- [ ] Implement EmailLog tracking
- [ ] Install PDF library (@react-pdf/renderer)
- [ ] Create PDF template: `lib/pdf/receipt-template.tsx`
- [ ] Build PDF generation: `lib/pdf/generate-pdf.ts`
- [ ] Create PDF download endpoint: `app/api/donations/[id]/pdf/route.ts`
- [ ] Add download button to donation detail page
- [ ] Test PDF generation and download
- [ ] Attach PDF to email receipt
- [ ] Test full flow: Donation → Email with PDF → Received

### Week 3: Campaigns

- [ ] Build campaign list page: `app/campaigns/page.tsx`
- [ ] Build create campaign page: `app/campaigns/new/page.tsx`
- [ ] Build campaign detail page: `app/campaigns/[id]/page.tsx`
- [ ] Create CampaignCard component
- [ ] Create CampaignForm component
- [ ] Create CampaignProgress component (progress bar)
- [ ] Update API route: `app/api/campaigns/route.ts` (if needed)
- [ ] Link donations to campaigns in donation form (already supported)
- [ ] Display campaign donations on campaign detail page
- [ ] Calculate campaign stats (raised, donors, average gift)
- [ ] Add campaign filter to donation list page
- [ ] Test creating, editing, viewing campaigns

### Week 4: Reports

- [ ] Install chart library (Recharts recommended)
- [ ] Connect MonthlyGivingChart to real data
- [ ] Connect TopDonorsTable to real data
- [ ] Build donation trends query (group by month)
- [ ] Build top donors query (sum by contact, limit 25)
- [ ] Build donor retention metrics
- [ ] Add date range picker to reports
- [ ] Implement CSV export
- [ ] Implement PDF export (with charts)
- [ ] Add AI insights summary to reports page
- [ ] Test all visualizations with real data
- [ ] Ensure charts are responsive

### Week 5: Security & Monitoring

- [ ] Install Sentry SDK
- [ ] Configure Sentry for Next.js (app directory)
- [ ] Add error boundaries: `app/error.tsx`, `app/not-found.tsx`
- [ ] Wrap API routes with error logging
- [ ] Install rate limiting package (@upstash/ratelimit)
- [ ] Add rate limiting to:
  - [ ] `/api/register` (5 requests/hour per IP)
  - [ ] `/api/auth/[...nextauth]` (10 requests/minute per IP)
  - [ ] `/api/ai/*` (10 requests/minute per user)
- [ ] Implement Zod validation on all API routes
- [ ] Add security headers to `next.config.ts`:
  - [ ] Content-Security-Policy
  - [ ] X-Frame-Options
  - [ ] X-Content-Type-Options
- [ ] Enable HSTS (Vercel handles this by default)
- [ ] Test Sentry error reporting
- [ ] Set up Sentry alert rules

### Week 6: Testing

- [ ] Install testing dependencies (Vitest, Playwright)
- [ ] Write unit tests:
  - [ ] AI functions (receipt generation)
  - [ ] Data transformations
  - [ ] Validation schemas
- [ ] Write integration tests:
  - [ ] Contact CRUD API
  - [ ] Donation CRUD API
  - [ ] Campaign CRUD API
- [ ] Write E2E tests (Playwright):
  - [ ] User registration flow
  - [ ] Create donation → send receipt
  - [ ] Import contacts from CSV
  - [ ] Generate report
- [ ] Achieve 70%+ test coverage on critical paths
- [ ] Set up CI/CD testing (GitHub Actions)
- [ ] Fix all failing tests

### Week 7: UX Polish

- [ ] Add toast notifications (Sonner) everywhere:
  - [ ] Success: "Donation saved!"
  - [ ] Error: "Failed to send email. Try again."
  - [ ] Warning: "Campaign ends in 3 days!"
- [ ] Add loading skeletons to:
  - [ ] Contact list
  - [ ] Donation list
  - [ ] Dashboard stats
  - [ ] Reports charts
- [ ] Implement pagination:
  - [ ] Contacts (50 per page)
  - [ ] Donations (50 per page)
  - [ ] Campaigns (20 per page)
- [ ] Add advanced search:
  - [ ] Search contacts by name, email, phone, tags
  - [ ] Filter donations by date range, amount range, fund
  - [ ] Filter campaigns by status
- [ ] Implement bulk operations:
  - [ ] Select multiple contacts (checkboxes)
  - [ ] Bulk tag
  - [ ] Bulk delete (soft delete with confirmation)
- [ ] Mobile responsiveness audit:
  - [ ] Test on iPhone (375px)
  - [ ] Test on iPad (768px)
  - [ ] Fix layout issues
- [ ] Add keyboard shortcuts:
  - [ ] "N" to create new donation
  - [ ] "C" to create new contact
  - [ ] "/" to focus search
- [ ] Polish form validation errors
- [ ] Add loading states to buttons

### Week 8: Launch Prep

- [ ] Create onboarding welcome wizard
- [ ] Add setup checklist to dashboard:
  - [ ] Import contacts
  - [ ] Record first donation
  - [ ] Create first campaign
- [ ] Build sample data generator (for testing/demo)
- [ ] Write help documentation:
  - [ ] Getting Started guide
  - [ ] How to record a donation
  - [ ] How to import contacts
  - [ ] How to create a campaign
  - [ ] How to generate reports
- [ ] Create video tutorials (Loom):
  - [ ] 2-minute product overview
  - [ ] 3-minute onboarding walkthrough
  - [ ] 2-minute AI features demo
- [ ] Set up support email (support@sagacrm.io)
- [ ] Create canned responses for common questions
- [ ] Set up UptimeRobot for uptime monitoring
- [ ] Configure Vercel Analytics
- [ ] Final production deployment
- [ ] Smoke test all critical flows
- [ ] Invite 10 beta nonprofits
- [ ] Send launch email to beta users

### Final Pre-Launch (Day Before)

- [ ] Database backup
- [ ] Environment variables verified
- [ ] Error tracking working
- [ ] Email sending working
- [ ] AI API calls working
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security scan complete
- [ ] Privacy Policy published
- [ ] Terms of Service published
- [ ] Support email ready
- [ ] Monitoring dashboards configured

---

## 10. POST-LAUNCH ROADMAP

### Month 2-3: Feedback & Iteration

**Goals:**
- Gather user feedback from 10 beta organizations
- Fix critical bugs and usability issues
- Improve onboarding based on user struggles
- Add most-requested features

**Features:**
- Password reset flow
- Email verification
- Donation editing
- Advanced donor filters
- Bulk contact operations
- Export contacts to CSV

### Month 4-6: Growth & Scale

**Goals:**
- Acquire 30-50 paying customers
- Reach $2.5k MRR
- Improve retention to 80%+
- Build marketing website

**Features:**
- Marketing website (sagacrm.io)
- SEO-optimized content (5 blog posts)
- Lead magnets (e-books, templates)
- Email drip campaigns
- Referral program
- Integrations (Stripe, QuickBooks)

### Month 7-12: Advanced Features

**Goals:**
- Reach 100 paying customers
- $5k MRR
- Launch advanced AI features
- Build knowledge base

**Features:**
- AI email composer
- Donor segmentation (major gift prospects)
- Campaign optimizer (AI recommendations)
- Executive summary generator
- RAG support chatbot (answer questions about CRM usage)
- Pledge tracking
- Event management
- Recurring donation management

---

## APPENDIX

### A. Pricing Strategy

**Free Trial:** 14 days, no credit card required
**Pricing Tier:** Single tier (for now)

**Growth Plan: $49/month**
- Unlimited contacts
- Unlimited donations
- Unlimited users
- Unlimited campaigns
- AI-powered thank-you messages
- Email receipts
- PDF receipts
- Reports & analytics
- Email support
- All future features included

**Why $49?**
- Affordable for small nonprofits (<$500k budget)
- Undercuts competitors (Bloomerang $99/mo, DonorPerfect $150/mo)
- Provides >10x ROI (saves 8+ hours/week @ $20/hr = $640/month value)
- Allows room for future price increases

### B. Competitor Analysis

| Feature | SAGA CRM | Bloomerang | DonorPerfect | Kindful |
|---------|----------|------------|--------------|---------|
| **Price** | $49/mo | $99/mo | $150/mo | $100/mo |
| **AI Thank-Yous** | ✅ | ❌ | ❌ | ❌ |
| **AI Insights** | ✅ | Limited | ❌ | ❌ |
| **Modern UI** | ✅ | ⚠️ | ❌ | ⚠️ |
| **Ease of Use** | ✅ | ⚠️ | ❌ | ⚠️ |
| **Setup Time** | <15 min | 1-2 hours | 3-4 hours | 1-2 hours |
| **Email Automation** | ✅ | ✅ | ✅ | ✅ |
| **Reporting** | ✅ | ✅ | ✅ | ✅ |
| **Mobile App** | ❌ (Post-MVP) | ✅ | ✅ | ⚠️ |
| **Integrations** | Limited | Many | Many | Many |

**SAGA's Competitive Advantages:**
1. AI-first (unique positioning)
2. Modern, beautiful UI
3. Fastest setup (<15 min vs. 1-4 hours)
4. Most affordable ($49 vs. $99-150)
5. Built for 2025+ (not legacy software)

### C. Risk Mitigation

**Risk 1: Email Deliverability**
- Mitigation: Use Resend (high deliverability), authenticate domain (SPF/DKIM), monitor bounce rates, provide alternative "view online" link

**Risk 2: AI Generation Failures**
- Mitigation: Always provide fallback messages, cache generated content, monitor API uptime, set budget limits

**Risk 3: Low User Adoption**
- Mitigation: Invest in onboarding (wizard, checklist), provide sample data, offer 1-on-1 setup calls, create video tutorials

**Risk 4: Competition from Established Players**
- Mitigation: Emphasize AI differentiation, target underserved small nonprofits, build community, iterate faster than incumbents

**Risk 5: Regulatory Compliance Issues**
- Mitigation: Consult CPA on tax receipt requirements, implement GDPR features, obtain legal review of Terms/Privacy, stay updated on nonprofit regulations

### D. Success Stories (Hypothetical for Now)

**Green Valley Community Center**
- Imported 800 contacts in 10 minutes
- Recorded 250 donations in first month
- Saved 10 hours/week on admin tasks
- Increased donor retention from 45% to 62%
- Quote: "SAGA's AI thank-you messages feel so personal. Our donors love them!"

**Animal Rescue Network**
- Launched year-end campaign with $75k goal
- Raised $82k (109% of goal)
- AI insights identified 15 major gift prospects
- Converted 3 prospects to $5k+ gifts
- Quote: "The AI showed us exactly who to ask. We wouldn't have found these donors otherwise."

---

**Document Version:** 1.0
**Last Updated:** December 29, 2025
**Next Review:** After Week 4 (Campaigns + Reports complete)
**Owner:** SAGA Product Team

---

*This PRD is a living document. Update as requirements evolve.*
