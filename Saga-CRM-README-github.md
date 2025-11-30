# 📘 **Saga CRM – Automated Donation Logging + Thank-You Email Workflow**
### *Nonprofit CRM Automation Workflow (n8n + Outlook + Notion)*

This repository contains the first core automation in the **Saga Nonprofit CRM** ecosystem:

✅ Automatically logs donations into your CRM  
✅ Generates personalized thank-you emails  
✅ Sends tax-compliant donation receipts  
✅ Creates clean, consistent donor records  
✅ Provides a foundation for full nonprofit CRM automation  

This workflow is built using **n8n**, **Microsoft Outlook**, and **Notion**.

---

# 🚀 **Overview**

Nonprofits spend enormous time manually:

- Entering donations  
- Creating thank-you messages  
- Writing tax receipts  
- Updating donor records  

This project automates that entire workflow so staff can focus on mission work.

The automation processes **incoming donation data** (mock JSON, Stripe/PayPal webhooks, CSV imports, etc.) and:

1. **Splits the donation batch into individual donors**
2. **Creates or updates donor records in Notion**
3. **Logs each donation into the Donations database**
4. **Sends a personalized thank-you email through Outlook**
5. **Attaches a tax-compliant PDF receipt** (optional v2)
6. **Logs all actions for audit and future donor journeys**

---

# 🧩 **Tech Stack**

| Component | Purpose |
|----------|---------|
| **n8n** | Automation engine for data processing + integrations |
| **Microsoft Outlook API** | Sends personalized donor emails + receipts |
| **Notion API** | Stores donor + donation data (acts as CRM database) |
| **Node.js / Cursor (optional v2)** | Generates PDF receipts from donation data |
| **JSON / Webhooks** | Input donation data from forms, Stripe, or CSV |

---

# 📂 **Folder Structure**

```
/workflows
    saga-donation-thank-you.json       # Exported n8n workflow
/pdf-service (optional)
    server.ts                          # PDF generation API
    templates/receipt.html             # Donation receipt HTML template
/docs
    schema.md                          # Donation + donor schema definitions
    architecture.md                    # Saga CRM architecture blueprint
README.md
```

---

# 📥 **Input Requirements**

The workflow expects donation data in a structure like:

```json
[
  {
    "name": "Jane Donor",
    "email": "jane@example.com",
    "amount": 50,
    "currency": "usd",
    "date": "2025-11-12T00:00:00Z",
    "source": "Mock Stripe"
  }
]
```

This can come from:

- Mock JSON (for testing)
- Stripe webhook
- PayPal webhook
- Donorbox
- CSV upload → Set Node → Code Node

---

# 🧠 **How It Works (Step-by-Step)**

### **1. Manual Trigger**
Used for testing (Stripe webhook replaces this in production).

### **2. Set Node**
Loads sample donation JSON or receives webhook data.

### **3. Code Node**
Splits multiple donations into individual items:

```js
const data = $json.donations;
return data.map(item => ({ json: item }));
```

### **4. Notion – Create Database Page**
Stores each donation in the `Donations` table.  
Maps fields like:

- Name  
- Email  
- Donation Amount  
- Currency  
- Date  
- Source  

### **5. Outlook – Send a Message**
Sends personalized thank-you email. Includes optional tax receipt.

---

# 📧 **Sample Email Output**

**Subject:** Thank you, Jane!

**Body:**

```
Hi Jane Donor,

Thank you for your generous donation of $50 USD on November 12, 2025.

Here are your tax receipt details:

- Donor Name: Jane Donor
- Email: jane@example.com
- Amount: 50 USD
- Date: 2025-11-12
- Source: Mock Stripe

No goods or services were provided in exchange for this contribution.
Please save this email for your tax records.

Warm regards,
Your Team
```

---

# 📎 **Optional v2 – PDF Receipt Generator**

This repo also includes optional code for a PDF generator service:

- Accepts donation JSON
- Renders HTML receipt template
- Returns Base64 PDF
- n8n attaches it automatically in the Outlook node

Tech used:

- Node.js (Express)
- Puppeteer or pdf-lib
- Hosted easily on Render/Railway

---

# 🧪 **Testing the Workflow**

1. Clone the repo  
2. Import workflow into n8n  
3. Update credentials:
   - Microsoft Outlook
   - Notion API
4. Replace the sample JSON with your own donation data  
5. Run the Manual Trigger  

---

# 🛠️ **Future Enhancements**

The long-term architecture supports:

- Donor journey automation  
- Volunteer management  
- Event management  
- Grant tracking  
- AI donor insights  
- QuickBooks integration  
- Donor segmentation (major donors, lapsed donors, etc.)  

This workflow is **the foundation** of the Saga CRM ecosystem.

---

# ❤️ **Why This Project Matters**

Nonprofits need modern tools — but they often can't afford them.

Saga CRM is built to give nonprofits:

- better automation,  
- better donor experience,  
- and more time for mission-driven work.

If you want to contribute, open an issue or PR!

---

# ⭐ **Give the Repo a Star**

If this project helps you or inspires you, please ⭐ star the repo.  
It helps others find it and shows support for open nonprofit tooling.
