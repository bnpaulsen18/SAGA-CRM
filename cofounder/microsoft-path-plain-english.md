# Getting SAGA into Microsoft — plain English

> A practical guide: how the Microsoft ecosystem actually works, what the steps are, and what to ask for so you stay the person who owns this.
>
> Keep this file **out of git** — `cofounder/` is currently published on GitHub. I am not a lawyer; the negotiation points here are business-standard, but a real agreement needs a real attorney.

---

## 1. The thing everyone gets confused about first

You framed it as "standalone product **or** something within Dynamics." Those feel like opposites. They aren't — they're two *separate* questions that happen to get asked at the same time:

**Question A — where does the software run?**
- On your own servers (what you have today: Next.js on Vercel)
- On Microsoft's platform (Dataverse — Microsoft's database that Dynamics is built on)

**Question B — whose product is it?**
- Yours. You own it, your name is on it, you decide.
- Sync(d)'s. It becomes one of the Forge products.

**You can mix these however you want.** The most important thing to understand: **"standalone" and "in the Microsoft suite" are not opposites.** SAGA can be a completely independent product that you own, that lives in Microsoft's app store, that installs into a nonprofit's Microsoft account. Thousands of companies do exactly this. Microsoft *wants* this.

Here's the grid:

| | **You own it** | **Sync(d) owns it** |
|---|---|---|
| **Runs on your own servers** (today) | What you have now. Independent, you control everything. Not "in the Microsoft suite." | Odd combination — they'd be buying a non-Microsoft product. Unlikely fit for them. |
| **Runs on Microsoft (Dataverse)** | ⭐ **SAGA is in the Microsoft suite AND still yours.** Listed in Microsoft's store. Sync(d) can sell it for you as a partner. | SAGA becomes "DonorForge." They own it, they sell it, you're an employee who built it. |

The star is the one most people don't realize is available. It's very likely the one you want, and it's the one that keeps you the go-to guy by *structure* rather than by goodwill.

---

## 2. How you actually get into the Microsoft suite

"Getting into the Microsoft suite" has a specific, concrete meaning: **your app is listed on Microsoft AppSource**, which is Microsoft's app store for business software. A nonprofit using Microsoft 365 or Dynamics browses AppSource, finds SAGA, and installs it into their own Microsoft account.

Here is the actual path. It's more bureaucratic than hard.

### Step 1 — Get a Microsoft Partner Center account
Partner Center is Microsoft's portal for companies that sell things through Microsoft. You sign up as a company. This is free to start.

> **⚠️ The single most important decision in this whole document happens here.** Whose name is on this account? The Partner Center account owns the app listing, the customer relationships, and the billing. **Whoever owns the publisher account owns the business.** If you register SAGA under Sync(d)'s Partner Center account, SAGA is theirs in every practical sense, no matter what anyone said in a meeting.

### Step 2 — Join "ISV Success for Business Applications"
"ISV" just means Independent Software Vendor — a company that makes software other people use. This is Microsoft's program for exactly your situation.

You have to be in it to list a Dynamics/Power Platform app. What you get is genuinely good:
- Up to **$25,000 in Azure credits**
- 25 seats of GitHub Enterprise, Visual Studio Enterprise, Microsoft 365 E5 developer
- A **Dynamics 365 partner sandbox** (25 seats) — a free environment to build in
- One-to-one technical consultations with Microsoft engineers

Free for the first 12 months, then roughly **$1,550/year**. That is a rounding error compared to what it gives you, and the sandbox alone solves "where do I build this."

### Step 3 — Build SAGA as a Dataverse "solution"
A *solution* is Microsoft's word for a package — your tables, forms, business logic and agents bundled into one installable thing. You build it in the sandbox from Step 2.

This is the real engineering work. Realistic first version — Major-Gift Signal only, one agent, no AI drafting — is about **6–8 weeks of focused engineering work** for someone who knows the platform. The full four-agent product is closer to **6–8 months for a small team**, or over a year for one person learning as they go.

### Step 4 — Create your "offer" in Partner Center
An *offer* is the store listing: name, description, screenshots, pricing, which countries. You pick the type "Dynamics 365 apps on Dataverse and Power Apps."

**Here you choose how money flows — this matters a lot:**

| Option | What it means | Trade-off |
|---|---|---|
| **List only** | AppSource is a brochure. Customer contacts you, you bill them yourself (Stripe, invoice, whatever). | You keep 100%. But you do all the billing, and enterprise buyers can't use their Microsoft budget on you. |
| **Sell through Microsoft** ("transactable") | Microsoft bills the customer and pays you. **Microsoft takes 3%.** | 3% is cheap. And it's a genuinely big deal — see below. |

**Why "sell through Microsoft" is usually worth it:** many organizations have pre-committed spending agreements with Microsoft. When they buy through the marketplace, it counts against money they've *already promised to spend*. That means buying SAGA can feel budget-neutral to them. That's a real sales advantage, and it costs you 3%.

For comparison: a reseller partner typically takes **20–40%**. Microsoft takes 3%.

### Step 5 — Certification
Microsoft reviews your app — technical checks, security, that it does what it says. Takes some back-and-forth. Not a rubber stamp, not a wall either.

### Step 6 — You're listed
Nonprofits can find and install SAGA. You can now also let partners like Sync(d) sell it — as a *choice*, not a dependency.

---

## 3. The part that changes the math: nonprofit pricing

Microsoft gives registered nonprofits heavily discounted or free licenses. Roughly:
- Power Apps: **free for up to 10 users**, then ~$2.50/user/month
- Power Automate Premium: ~$3.75/user/month
- Microsoft 365 Business Basic: **free up to 300 users**
- $2,000/year in Azure credits

So a five-person nonprofit's Microsoft bill for running SAGA is roughly **$20–90/month**, and *they* pay it, not you. Your $100/month sits on top of that.

**One rule you cannot work around:** Microsoft's terms say a for-profit company **cannot register for nonprofit pricing on a nonprofit's behalf**, and those licenses can't be resold or transferred. So you can't buy cheap nonprofit licenses and host customers yourself.

That's not a technicality — it decides your whole architecture:

- ❌ **You host nonprofits in your Microsoft account** → you pay full commercial price, about **$175/month per customer**. On a $100/month product you lose money on every single customer.
- ✅ **Each nonprofit installs SAGA into their own Microsoft account** → they pay nonprofit rates, you charge your $100. This works.

The catch, and you should know it going in: the second model means **onboarding stops being "sign up on the website."** It becomes "your IT admin installs an app." For a three-person nonprofit that's a real speed bump, and it's the biggest downside of the whole Microsoft route.

---

## 4. What to ask for so you stay the go-to guy

There are four ways to be indispensable. Only two of them last.

| How | Lasts? | Why |
|---|---|---|
| **You own the asset** — the app listing, the IP, the brand | ✅ **Permanent** | Can't be taken away. Structural. |
| **It's written in a contract** — your role, your cut, your say | ✅ **Strong** | Enforceable. Survives people leaving. |
| **Your name is on it publicly** | 🟡 Medium | Customers ask for you by name. Real, but soft. |
| **You're the only one who understands it** | ❌ **Temporary** | This is the trap. It erodes the moment they hire a second person. Never rely on it. |

**Most people in your position rely on the fourth one and are surprised in eighteen months.** Get the first two in writing.

### If SAGA stays yours (recommended)

Ask for these:

1. **The Partner Center publisher account is in your name / your entity.** Non-negotiable. This is the whole ballgame. Everything else is decoration.
2. **Sync(d) is a reseller or referral partner, not the owner.** They sell SAGA, they get a cut. Normal reseller cut is 20–40%; referral fee for just making an introduction is 10–20%.
3. **Any exclusivity is limited and earned.** If they want to be the only ones selling SAGA to Dynamics customers, fine — but it expires (say 18–24 months), it's limited to Dynamics customers only, and it goes away if they don't hit agreed sales numbers. Never grant open-ended exclusivity.
4. **You're on every nonprofit deal** as the technical lead. That's how you stay the go-to guy in practice.
5. **You keep the customer relationship** or at minimum co-own it — you're on the contract, or you're named as the escalation point.

### If SAGA goes inside Sync(d)'s product line

Then you're effectively selling it, so make sure you're paid and positioned properly:

1. **A named role with the word "lead" or "owner" in it** — "Nonprofit Practice Lead," "SAGA Product Owner." Titles sound cosmetic; they're not. They determine who gets pulled into every conversation.
2. **Money on nonprofit revenue.** Options, from simplest to most involved:
   - **Commission** — a percentage of each nonprofit deal you're involved in. Easiest to understand and to verify.
   - **Revenue share** — a percentage of nonprofit revenue generally. More upside, but see the warning below.
   - **Equity** — a slice of Sync(d). Biggest upside, only pays if the whole company exits.
   - **Salary increase** — the least upside but the most certain.
   > Ask for a combination. A base you can count on, plus upside if it works.
3. **Decision rights over the nonprofit roadmap.** In writing: nothing ships in the nonprofit product without your sign-off.
4. **Your name stays on it.** Product credits, the AppSource listing, case studies. Public attribution is how you stay the go-to guy outside the company too.
5. **Microsoft certifications paid for and in your name.** They belong to you, not the company. You keep them if you leave.
6. **What happens if you leave, or they drop it?** Ask now, while it's friendly. Does the SAGA name come back to you? Can you build in this space again? Get it written down.

### ⚠️ The one term people get wrong

If you agree to "a percentage of revenue," **ask immediately: a percentage of what, exactly?**

If Sync(d) sells a nonprofit a $150,000 bundle — assessment, implementation, four Forge products, managed services, and SAGA — how much of that counts as "SAGA revenue"? If nobody wrote it down, the honest answer is usually *nothing*, and there's no bad faith required for that to happen.

So insist on one of:
- **A fixed dollar amount per customer** ("$X per nonprofit per month, whatever the bundle costs") — simplest, hardest to argue about, and what I'd push for
- **A percentage of the total engagement**, not of a made-up module price
- **A written formula** for how a bundle gets split

Also: **never accept a share of "profit."** Profit is whatever's left after costs, and the other side decides what counts as a cost. Always revenue.

---

## 5. Two things to sort out before you negotiate

Not to alarm you — these are just the two facts a lawyer will ask about in the first five minutes, and it's better if you already know the answers.

**1. Does your employment agreement give Sync(d) a claim to SAGA?** Most tech employment contracts say the company owns work that "relates to the company's business." You built an AI agent product; they build AI agent products. That's arguable — and *arguable* is what you don't want a partner discovering mid-negotiation. Have your own attorney read your agreement. Not theirs. One hour, and it either removes the question or tells you what you're actually negotiating.

**2. The code is public and MIT-licensed.** Your GitHub repo is public with an MIT license, which legally lets anyone — including Sync(d) — use and sell it for free. You can change the license going forward (you own the copyright), but versions already published stay MIT. Nobody has taken it (zero forks). But the first thing their lawyer will do is check, and you want to have handled it before then rather than after.

Neither of these is a disaster. Both are much cheaper to fix now than to discover later.

---

## 6. The test to apply to any offer

> **If I walk away from Sync(d) in two years, what do I still have?**

- Still own the product, the listing and the customers → you had a partnership.
- Only had a title and some commission → you had a job with extra steps.

Both can be fine. Just know which one you're signing.

---

## 7. What I'd actually do, in order

1. **Get your employment agreement reviewed** by your own attorney. This week. Everything else waits.
2. **Ask Sync(d) to put their proposal in writing** — just a paragraph. "Are you thinking partner, or are you thinking this becomes a Forge product?" You cannot negotiate against a conversation.
3. **Open your own Partner Center account and join ISV Success.** Do this *regardless* of which way the deal goes. It's free for a year, gets you $25k of Azure credits and a sandbox, and it means you're a Microsoft ISV in your own right rather than a guest in someone else's account. It also quietly strengthens every negotiating position you have.
4. **Build the small thing** — Major-Gift Signal only, in the free sandbox, on your own time and equipment. It proves the platform works for SAGA and costs you weeks, not months.
5. **Talk to five nonprofits** from Sync(d)'s customer base. This is the single most valuable thing in the entire partnership and it doesn't require a single line of code.
6. **Then negotiate**, with a working prototype, real customer conversations, and a clear answer on who owns what.
