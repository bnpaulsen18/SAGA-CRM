# 📘 SAGA CRM API Reference

**Version:** 1.0.0
**Base URL:** `https://yourdomain.com/api`
**Authentication:** NextAuth v5 Session-based

---

## 🔐 Authentication

All API endpoints require authentication via NextAuth session cookies. Requests without valid authentication will return `401 Unauthorized`.

### Session Requirements
- Valid NextAuth session cookie
- User must belong to an organization
- Row-Level Security (RLS) automatically filters data by organization

### Headers
```http
Content-Type: application/json
Cookie: next-auth.session-token=<session_token>
```

---

## 📋 Contacts API

### `GET /api/contacts`
**Description:** List all contacts for the authenticated user's organization

**Query Parameters:**
- `search` (optional): Search by name or email
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset

**Response:** `200 OK`
```json
{
  "contacts": [
    {
      "id": "clxxx123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94102",
      "country": "USA",
      "notes": "Major donor",
      "tags": ["vip", "monthly"],
      "customFields": {},
      "organizationId": "org_123",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-20T14:45:00Z",
      "_count": {
        "donations": 12
      }
    }
  ],
  "total": 150,
  "hasMore": true
}
```

**Errors:**
- `401 Unauthorized`: No valid session
- `500 Internal Server Error`: Database error

---

### `POST /api/contacts`
**Description:** Create a new contact

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+1987654321",
  "address": "456 Oak Ave",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001",
  "country": "USA",
  "notes": "Met at fundraiser",
  "tags": ["prospect"]
}
```

**Response:** `201 Created`
```json
{
  "id": "clxxx456",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "organizationId": "org_123",
  "createdAt": "2025-01-25T09:15:00Z"
}
```

**Errors:**
- `400 Bad Request`: Missing required fields (firstName, lastName, email)
- `409 Conflict`: Contact with email already exists
- `401 Unauthorized`: No valid session

---

### `GET /api/contacts/[id]`
**Description:** Get a specific contact with donation history

**Response:** `200 OK`
```json
{
  "id": "clxxx123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "donations": [
    {
      "id": "don_789",
      "amount": 500.00,
      "donatedAt": "2025-01-20T10:00:00Z",
      "type": "ONE_TIME",
      "campaign": {
        "name": "Annual Fund 2025"
      }
    }
  ],
  "totalDonated": 6500.00,
  "donationCount": 12,
  "firstDonation": "2023-03-15T10:00:00Z",
  "lastDonation": "2025-01-20T10:00:00Z"
}
```

**Errors:**
- `404 Not Found`: Contact not found or not in user's organization
- `401 Unauthorized`: No valid session

---

### `PUT /api/contacts/[id]`
**Description:** Update a contact

**Request Body:** (all fields optional)
```json
{
  "firstName": "John",
  "lastName": "Doe Jr.",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "notes": "Updated notes"
}
```

**Response:** `200 OK`
```json
{
  "id": "clxxx123",
  "firstName": "John",
  "lastName": "Doe Jr.",
  "updatedAt": "2025-01-25T11:30:00Z"
}
```

**Errors:**
- `404 Not Found`: Contact not found
- `400 Bad Request`: Invalid data
- `401 Unauthorized`: No valid session

---

### `DELETE /api/contacts/[id]`
**Description:** Delete a contact (soft delete recommended)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

**Errors:**
- `404 Not Found`: Contact not found
- `400 Bad Request`: Contact has donations (cannot delete)
- `401 Unauthorized`: No valid session

---

## 💰 Donations API

### `GET /api/donations`
**Description:** List all donations for the authenticated user's organization

**Query Parameters:**
- `contactId` (optional): Filter by contact
- `campaignId` (optional): Filter by campaign
- `startDate` (optional): Filter by date range (ISO 8601)
- `endDate` (optional): Filter by date range (ISO 8601)
- `type` (optional): Filter by type (ONE_TIME, RECURRING, PLEDGE)
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset

**Response:** `200 OK`
```json
{
  "donations": [
    {
      "id": "don_123",
      "amount": 1000.00,
      "type": "ONE_TIME",
      "method": "CREDIT_CARD",
      "fundRestriction": "UNRESTRICTED",
      "donatedAt": "2025-01-25T10:00:00Z",
      "receiptNumber": "2025-0001",
      "receiptSentAt": "2025-01-25T10:05:00Z",
      "contact": {
        "id": "clxxx123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "campaign": {
        "id": "camp_456",
        "name": "Annual Fund 2025"
      },
      "transactionId": "ch_stripe_12345",
      "notes": "Year-end gift"
    }
  ],
  "total": 342,
  "hasMore": true,
  "totalAmount": 156750.00
}
```

---

### `POST /api/donations`
**Description:** Create a new donation and automatically send receipt email

**Request Body:**
```json
{
  "contactId": "clxxx123",
  "amount": 500.00,
  "type": "ONE_TIME",
  "method": "CHECK",
  "fundRestriction": "UNRESTRICTED",
  "campaignId": "camp_456",
  "donatedAt": "2025-01-25T10:00:00Z",
  "transactionId": "CHECK-1234",
  "notes": "Thank you note included"
}
```

**Response:** `201 Created`
```json
{
  "id": "don_789",
  "amount": 500.00,
  "receiptNumber": "2025-0042",
  "contact": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "emailSent": true,
  "createdAt": "2025-01-25T10:05:00Z"
}
```

**Side Effects:**
- Automatically generates unique receipt number
- Sends automated email receipt with AI-generated thank-you message (async)
- Updates campaign `raised` amount if `campaignId` provided

**Errors:**
- `400 Bad Request`: Missing required fields or invalid amount
- `404 Not Found`: Contact or campaign not found
- `401 Unauthorized`: No valid session

---

### `GET /api/donations/[id]`
**Description:** Get a specific donation with full details

**Response:** `200 OK`
```json
{
  "id": "don_123",
  "amount": 1000.00,
  "type": "ONE_TIME",
  "method": "CREDIT_CARD",
  "fundRestriction": "UNRESTRICTED",
  "donatedAt": "2025-01-25T10:00:00Z",
  "receiptNumber": "2025-0001",
  "receiptSentAt": "2025-01-25T10:05:00Z",
  "contact": {
    "id": "clxxx123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "campaign": {
    "id": "camp_456",
    "name": "Annual Fund 2025",
    "goal": 50000.00,
    "raised": 35000.00
  },
  "organization": {
    "id": "org_123",
    "name": "Amazing Nonprofit",
    "ein": "12-3456789"
  },
  "transactionId": "ch_stripe_12345",
  "notes": "Year-end gift",
  "createdAt": "2025-01-25T10:00:00Z"
}
```

**Errors:**
- `404 Not Found`: Donation not found
- `401 Unauthorized`: No valid session

---

### `PUT /api/donations/[id]`
**Description:** Update a donation

**Request Body:** (all fields optional)
```json
{
  "amount": 1200.00,
  "method": "CREDIT_CARD",
  "notes": "Updated notes"
}
```

**Response:** `200 OK`

**Errors:**
- `404 Not Found`: Donation not found
- `400 Bad Request`: Invalid data
- `401 Unauthorized`: No valid session

---

### `DELETE /api/donations/[id]`
**Description:** Delete a donation

**Response:** `200 OK`

**Errors:**
- `404 Not Found`: Donation not found
- `401 Unauthorized`: No valid session

---

### `GET /api/donations/[id]/receipt`
**Description:** Download PDF receipt for a donation

**Response:** `200 OK`
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="donation-receipt-don_123.pdf"

[PDF Binary Data]
```

**PDF Contents:**
- Organization header and logo
- Receipt number and date
- Donor information
- Donation details
- AI-generated personalized thank-you message
- IRS tax-deductible disclaimer
- Organization EIN and contact information

**Errors:**
- `404 Not Found`: Donation not found
- `500 Internal Server Error`: PDF generation failed
- `401 Unauthorized`: No valid session

---

### `POST /api/donations/[id]/resend-receipt`
**Description:** Manually resend email receipt for a donation

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Receipt sent successfully",
  "receiptNumber": "2025-0001",
  "sentTo": "john@example.com",
  "sentAt": "2025-01-25T15:30:00Z"
}
```

**Side Effects:**
- Sends new email with AI-generated thank-you message
- Updates `receiptSentAt` timestamp

**Errors:**
- `404 Not Found`: Donation not found
- `400 Bad Request`: Contact has no email
- `500 Internal Server Error`: Email sending failed
- `401 Unauthorized`: No valid session

---

## 🎯 Campaigns API

### `GET /api/campaigns`
**Description:** List all campaigns for the authenticated user's organization

**Query Parameters:**
- `status` (optional): Filter by status (ACTIVE, DRAFT, COMPLETED, PAUSED, CANCELLED)
- `includeStats` (optional): Include donation statistics (default: true)

**Response:** `200 OK`
```json
{
  "campaigns": [
    {
      "id": "camp_123",
      "name": "Annual Fund 2025",
      "description": "Support our mission this year",
      "goal": 50000.00,
      "raised": 35250.00,
      "status": "ACTIVE",
      "startDate": "2025-01-01T00:00:00Z",
      "endDate": "2025-12-31T23:59:59Z",
      "organizationId": "org_123",
      "createdAt": "2024-12-15T10:00:00Z",
      "updatedAt": "2025-01-25T09:00:00Z",
      "_count": {
        "donations": 47
      },
      "percentComplete": 70.5,
      "daysRemaining": 340
    }
  ],
  "total": 8,
  "stats": {
    "totalCampaigns": 8,
    "activeCampaigns": 3,
    "totalRaised": 125000.00,
    "totalGoal": 200000.00
  }
}
```

---

### `POST /api/campaigns`
**Description:** Create a new campaign

**Request Body:**
```json
{
  "name": "Spring Gala 2025",
  "description": "Annual fundraising gala",
  "goal": 75000.00,
  "startDate": "2025-03-15T18:00:00Z",
  "endDate": "2025-03-15T23:00:00Z",
  "status": "DRAFT"
}
```

**Response:** `201 Created`
```json
{
  "id": "camp_456",
  "name": "Spring Gala 2025",
  "goal": 75000.00,
  "raised": 0.00,
  "status": "DRAFT",
  "organizationId": "org_123",
  "createdAt": "2025-01-25T10:00:00Z"
}
```

**Errors:**
- `400 Bad Request`: Missing required fields or invalid dates
- `401 Unauthorized`: No valid session

---

### `GET /api/campaigns/[id]`
**Description:** Get a specific campaign with donation list

**Response:** `200 OK`
```json
{
  "id": "camp_123",
  "name": "Annual Fund 2025",
  "description": "Support our mission this year",
  "goal": 50000.00,
  "raised": 35250.00,
  "status": "ACTIVE",
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": "2025-12-31T23:59:59Z",
  "donations": [
    {
      "id": "don_789",
      "amount": 500.00,
      "donatedAt": "2025-01-20T10:00:00Z",
      "contact": {
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ],
  "stats": {
    "totalDonations": 47,
    "averageGift": 750.00,
    "largestGift": 5000.00,
    "uniqueDonors": 42,
    "percentComplete": 70.5
  },
  "createdAt": "2024-12-15T10:00:00Z"
}
```

**Errors:**
- `404 Not Found`: Campaign not found
- `401 Unauthorized`: No valid session

---

### `PUT /api/campaigns/[id]`
**Description:** Update a campaign

**Request Body:** (all fields optional)
```json
{
  "name": "Annual Fund 2025 (Updated)",
  "description": "New description",
  "goal": 60000.00,
  "status": "ACTIVE",
  "endDate": "2025-12-31T23:59:59Z"
}
```

**Response:** `200 OK`
```json
{
  "id": "camp_123",
  "name": "Annual Fund 2025 (Updated)",
  "goal": 60000.00,
  "updatedAt": "2025-01-25T11:00:00Z"
}
```

**Validation:**
- `endDate` must be after `startDate`
- `goal` must be positive
- `status` must be valid enum value

**Errors:**
- `404 Not Found`: Campaign not found
- `400 Bad Request`: Invalid data
- `401 Unauthorized`: No valid session

---

### `DELETE /api/campaigns/[id]`
**Description:** Delete a campaign

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Campaign deleted successfully"
}
```

**Errors:**
- `404 Not Found`: Campaign not found
- `400 Bad Request`: Campaign has donations (cannot delete)
- `401 Unauthorized`: No valid session

---

## 📊 Reports API

### `GET /api/reports/export`
**Description:** Export data to CSV/Excel format

**Query Parameters:**
- `type`: Export type (`donations`, `contacts`, `campaigns`)
- `startDate` (optional): Filter by date range
- `endDate` (optional): Filter by date range
- `format` (optional): `csv` or `xlsx` (default: csv)

**Example:**
```
GET /api/reports/export?type=donations&startDate=2025-01-01&endDate=2025-01-31&format=csv
```

**Response:** `200 OK`
```
Content-Type: text/csv
Content-Disposition: attachment; filename="donations-export-2025-01-25.csv"

Receipt Number,Date,Donor Name,Email,Amount,Type,Method,Fund,Campaign,Transaction ID
2025-0001,2025-01-20,John Doe,john@example.com,500.00,ONE_TIME,CREDIT_CARD,UNRESTRICTED,Annual Fund 2025,ch_stripe_123
2025-0002,2025-01-21,Jane Smith,jane@example.com,1000.00,ONE_TIME,CHECK,RESTRICTED,Spring Gala,CHECK-456
```

**Donations Export Columns:**
- Receipt Number
- Date
- Donor Name
- Email
- Phone
- Amount
- Type (ONE_TIME, RECURRING, PLEDGE)
- Method (CREDIT_CARD, CHECK, CASH, etc.)
- Fund Restriction
- Campaign Name
- Transaction ID
- Notes

**Contacts Export Columns:**
- Name
- Email
- Phone
- Address
- City, State, ZIP
- Total Donated
- Donation Count
- First Donation Date
- Last Donation Date
- Tags

**Campaigns Export Columns:**
- Name
- Status
- Goal
- Raised
- % Complete
- Start Date
- End Date
- Donation Count
- Average Gift
- Unique Donors

**Errors:**
- `400 Bad Request`: Invalid export type
- `401 Unauthorized`: No valid session

---

## 💳 Stripe Integration API

### `POST /api/stripe/checkout`
**Description:** Create a Stripe Checkout session for online donations

**Request Body:**
```json
{
  "amount": 100.00,
  "contactId": "clxxx123",
  "campaignId": "camp_456",
  "fundRestriction": "UNRESTRICTED",
  "isRecurring": false,
  "email": "donor@example.com",
  "successUrl": "https://yourdomain.com/donations?success=true",
  "cancelUrl": "https://yourdomain.com/donations?canceled=true"
}
```

**Response:** `200 OK`
```json
{
  "sessionId": "cs_test_abc123",
  "url": "https://checkout.stripe.com/c/pay/cs_test_abc123"
}
```

**Usage:**
1. Call this endpoint to create a checkout session
2. Redirect user to the `url` returned
3. Stripe handles payment collection
4. Webhook creates donation record automatically

**Metadata Stored:**
- organizationId
- contactId
- campaignId
- fundRestriction
- isRecurring (true/false)

**Errors:**
- `400 Bad Request`: Invalid amount or missing contactId
- `404 Not Found`: Contact not found
- `500 Internal Server Error`: Stripe API error
- `401 Unauthorized`: No valid session

---

### `POST /api/stripe/webhook`
**Description:** Stripe webhook endpoint (called by Stripe, not clients)

**Security:** Validates webhook signature using `STRIPE_WEBHOOK_SECRET`

**Events Handled:**

#### `checkout.session.completed`
- Creates donation record in database
- Updates campaign `raised` amount
- Sends automated thank-you email with AI message

#### `invoice.paid`
- Creates donation record for recurring payment
- Updates campaign `raised` amount
- Sends automated thank-you email

#### `customer.subscription.deleted`
- Logs subscription cancellation
- Does not delete historical donation records

**Response:** `200 OK`
```json
{
  "received": true,
  "event": "checkout.session.completed",
  "donationId": "don_123"
}
```

**Errors:**
- `400 Bad Request`: Invalid webhook signature
- `500 Internal Server Error`: Processing error

**Important:** This endpoint must be configured in your Stripe dashboard:
- URL: `https://yourdomain.com/api/stripe/webhook`
- Events to send: `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`

---

## 🔒 Rate Limiting

All API endpoints are rate-limited to prevent abuse:

| Endpoint Type | Rate Limit | Window |
|--------------|------------|--------|
| Standard API | 100 requests | 15 minutes |
| Auth endpoints | 10 requests | 15 minutes |
| Email sending | 20 requests | 1 hour |
| PDF generation | 50 requests | 1 hour |

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706198400
```

**Response when rate limited:** `429 Too Many Requests`
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 300
}
```

---

## 📝 Common Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | No valid session or authentication required |
| 403 | Forbidden | Authenticated but not authorized (wrong organization) |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists (e.g., duplicate email) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error occurred |

---

## 🔑 Environment Variables Required

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." # For migrations

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="random-secret-string"

# Email (Resend)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="Your Org <donations@yourdomain.com>"

# Payments (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI (Anthropic Claude) - Optional
ANTHROPIC_API_KEY="sk-ant-..." # Gracefully degrades if not set
```

---

## 🧪 Testing the API

### Using cURL

**Create a donation:**
```bash
curl -X POST https://yourdomain.com/api/donations \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION" \
  -d '{
    "contactId": "clxxx123",
    "amount": 100.00,
    "type": "ONE_TIME",
    "method": "CREDIT_CARD"
  }'
```

**Download a receipt:**
```bash
curl -X GET https://yourdomain.com/api/donations/don_123/receipt \
  -H "Cookie: next-auth.session-token=YOUR_SESSION" \
  -o receipt.pdf
```

**Export donations:**
```bash
curl -X GET "https://yourdomain.com/api/reports/export?type=donations&format=csv" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION" \
  -o donations.csv
```

### Using JavaScript/Fetch

**Create a campaign:**
```javascript
const response = await fetch('/api/campaigns', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Spring Gala 2025',
    description: 'Annual fundraising event',
    goal: 50000.00,
    startDate: '2025-03-15T18:00:00Z',
    endDate: '2025-03-15T23:00:00Z',
    status: 'ACTIVE'
  })
});

const campaign = await response.json();
console.log('Campaign created:', campaign.id);
```

**Resend a receipt:**
```javascript
const response = await fetch(`/api/donations/${donationId}/resend-receipt`, {
  method: 'POST',
});

const result = await response.json();
if (result.success) {
  console.log('Receipt sent to:', result.sentTo);
}
```

---

## 🎯 Best Practices

### 1. Always Check Response Status
```javascript
const response = await fetch('/api/donations');
if (!response.ok) {
  const error = await response.json();
  throw new Error(error.error || 'Request failed');
}
const data = await response.json();
```

### 2. Handle Rate Limiting
```javascript
const response = await fetch('/api/donations');
if (response.status === 429) {
  const retryAfter = response.headers.get('X-RateLimit-Reset');
  console.log('Rate limited. Retry after:', new Date(retryAfter * 1000));
}
```

### 3. Use Pagination for Large Lists
```javascript
let offset = 0;
const limit = 50;
let hasMore = true;

while (hasMore) {
  const response = await fetch(`/api/contacts?limit=${limit}&offset=${offset}`);
  const data = await response.json();

  // Process data.contacts

  hasMore = data.hasMore;
  offset += limit;
}
```

### 4. Email Sending is Async
When creating donations via `POST /api/donations`, email sending happens in the background and doesn't block the response. Check `receiptSentAt` field later to confirm delivery.

### 5. Stripe Webhooks are Idempotent
The webhook handler uses `findFirst` and creates only if donation doesn't exist, preventing duplicate donations from webhook retries.

---

## 🔐 Security Features

### Row-Level Security (RLS)
All database queries automatically filter by `organizationId` using the `getPrismaWithRLS()` wrapper. Users can only access data from their own organization.

### CSRF Protection
NextAuth v5 provides built-in CSRF protection for all authenticated requests.

### Webhook Signature Verification
Stripe webhooks verify the `stripe-signature` header to ensure requests are from Stripe.

### Input Validation
All endpoints validate input data before processing:
- Required fields are checked
- Data types are validated
- Amounts must be positive
- Dates must be valid ISO 8601

### SQL Injection Protection
Prisma ORM provides automatic SQL injection protection through parameterized queries.

---

## 📞 Support & Documentation

- **Codebase:** See [LAUNCH-READINESS.md](LAUNCH-READINESS.md) for deployment guide
- **Features:** See [IMPLEMENTATION-STATUS.md](IMPLEMENTATION-STATUS.md) for roadmap
- **Full Vision:** See [SAGA-FULL-VISION-ROADMAP.md](SAGA-FULL-VISION-ROADMAP.md)

---

*API Reference v1.0.0 | Generated: December 29, 2025*
