/**
 * Seeds donor histories that actually exercise the three AI agents.
 *
 * The base demo seed (seed-demo-login.ts) dates every gift inside the last ~40
 * days, so no donor is ever lapsed, cooling, or on a multi-gift trajectory —
 * which means Morning Brief surfaces nobody and Major-Gift Signal finds nothing.
 * This script adds donors with multi-year histories shaped so each agent has
 * something real to show, plus deliberate controls that should NOT trigger.
 *
 * Run:  npx tsx scripts/seed-agent-demo.ts
 *
 * Idempotent: donors are matched on email and skipped if already seeded.
 * Additive: the original Hope Foundation donors are left untouched.
 * Demo data is fictional — never present these as real traction.
 */
import { config } from 'dotenv'
config({ path: '.env' })
config({ path: '.env.local', override: true })

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { DEMO_ORG_EIN } from '../lib/dashboard/demo-org'

const url = process.env.DATABASE_URL || process.env.DIRECT_URL || ''
if (!url) {
  console.error('NO_DATABASE_URL: not found in .env / .env.local')
  process.exit(1)
}
const isPgBouncer = url.includes('pgbouncer=true') || url.includes('pooler.supabase')
const prisma = isPgBouncer
  ? new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString: url, max: 5 })) })
  : new PrismaClient()

const DAY = 86400000
const ago = (months: number) => new Date(Date.now() - Math.round(months * 30.44) * DAY)
const daysAgo = (d: number) => new Date(Date.now() - d * DAY)

type Seed = {
  first: string
  last: string
  email: string
  org?: boolean
  /** [amount, monthsAgo] — oldest first */
  gifts: [number, number][]
  /** what this donor is here to demonstrate */
  demonstrates: string
}

const DONORS: Seed[] = [
  // ---------- Morning Brief ----------
  {
    first: 'Community First', last: 'Fund', email: 'grants@communityfirst.example', org: true,
    gifts: [[10000, 31], [10000, 19], [10000, 7]],
    demonstrates: 'Morning Brief #1 — Cooling. Largest donor, perfectly regular, then stopped. $10,000 at stake.',
  },
  {
    first: 'Michael', last: 'Brennan', email: 'm.brennan@example.com',
    gifts: [[1500, 46], [1500, 34], [1750, 22]],
    demonstrates: 'Morning Brief — Lapse risk. 22 months quiet.',
  },
  {
    first: 'David', last: 'Ashford', email: 'd.ashford@example.com',
    gifts: [[500, 49], [750, 42], [1200, 35]],
    demonstrates: 'Morning Brief — Lapse risk, deep. 35 months quiet.',
  },
  {
    first: 'Anna', last: 'Petrov', email: 'a.petrov@example.com',
    gifts: [[300, 38], [300, 26], [250, 14]],
    demonstrates: 'Morning Brief — Lapse risk, small. Ranks below the others on dollars.',
  },

  // ---------- Major-Gift Signal ----------
  {
    first: 'Margaret', last: 'Chen', email: 'margaret.chen@example.com',
    gifts: [[250, 21], [500, 16], [1000, 9], [2500, 1.5]],
    demonstrates: 'Major-Gift Signal #1 — 4.3x her prior average, gave 6 weeks ago.',
  },
  {
    first: 'Hoffman Family', last: 'Trust', email: 'trustee@hoffmantrust.example', org: true,
    gifts: [[2500, 32], [3000, 20], [3500, 8], [7500, 0.5]],
    demonstrates: 'Both agents — Major-Gift Signal (2.5x) AND Morning Brief Champion. Correctly appears twice.',
  },
  {
    first: 'Priya', last: 'Raman', email: 'priya.raman@example.com',
    gifts: [[1000, 29], [1200, 22], [1100, 15], [3000, 0.8]],
    demonstrates: 'Major-Gift Signal — 2.7x prior average.',
  },
  {
    first: 'Elena', last: 'Vasquez', email: 'e.vasquez@example.com',
    gifts: [[400, 24], [450, 17], [500, 11], [900, 3]],
    demonstrates: 'Major-Gift Signal — 2.0x, lower score. Shows ranking works.',
  },

  // ---------- Welcome Series ----------
  {
    first: 'Jordan', last: 'Ellis', email: 'jordan.ellis@example.com',
    gifts: [[75, 0.1]],
    demonstrates: 'Welcome Series — first gift 3 days ago. Also Morning Brief "New donor".',
  },

  // ---------- Controls: should NOT trigger ----------
  {
    first: 'Thomas', last: 'Reed', email: 't.reed@example.com',
    gifts: [[100, 42], [100, 36], [110, 30], [100, 24], [120, 18], [110, 12], [115, 6], [120, 1]],
    demonstrates: 'CONTROL — 8 gifts, most loyal donor on file, but flat. No trajectory, not lapsed. Correctly silent.',
  },
  {
    first: 'James', last: 'Cardoso', email: 'j.cardoso@example.com',
    gifts: [[200, 28], [250, 21], [300, 11], [350, 2]],
    demonstrates: 'CONTROL — trending up 1.4x, just under the 1.5x gate. Proves the threshold does work.',
  },
]

async function main() {
  const org = await prisma.organization.findUnique({
    where: { ein: DEMO_ORG_EIN },
    select: { id: true, name: true },
  })
  if (!org) {
    console.error(`NO_DEMO_ORG: no organization with ein ${DEMO_ORG_EIN}. Run seed-demo-login.ts first.`)
    process.exit(1)
  }

  const campaign = await prisma.campaign.findFirst({
    where: { organizationId: org.id, status: 'ACTIVE' },
    select: { id: true },
  })

  let created = 0
  let skipped = 0

  for (const d of DONORS) {
    const existing = await prisma.contact.findFirst({
      where: { organizationId: org.id, email: d.email },
      select: { id: true },
    })
    if (existing) {
      skipped++
      continue
    }

    const contact = await prisma.contact.create({
      data: {
        organizationId: org.id,
        firstName: d.first,
        lastName: d.last,
        email: d.email,
        status: 'ACTIVE',
        type: 'DONOR', // schema has no FOUNDATION type; trusts/funds are DONOR here
        notes: `Demo data — ${d.demonstrates}`,
      },
    })

    for (const [amount, monthsBack] of d.gifts) {
      const donatedAt = monthsBack < 0.5 ? daysAgo(Math.round(monthsBack * 30.44)) : ago(monthsBack)
      const y = donatedAt.getFullYear()
      const m = String(donatedAt.getMonth() + 1).padStart(2, '0')
      const day = String(donatedAt.getDate()).padStart(2, '0')
      await prisma.donation.create({
        data: {
          organizationId: org.id,
          contactId: contact.id,
          campaignId: campaign?.id ?? null,
          amount,
          currency: 'USD',
          type: 'ONE_TIME',
          method: 'CREDIT_CARD',
          status: 'COMPLETED',
          fundRestriction: 'UNRESTRICTED',
          receiptNumber: `HF-${y}${m}${day}-${contact.id.slice(-4)}-${Math.round(amount)}`,
          taxDeductible: true,
          donatedAt,
        },
      })
    }
    created++
  }

  // ---- report what each agent should now surface ----
  const contacts = await prisma.contact.findMany({
    where: { organizationId: org.id },
    select: {
      firstName: true, lastName: true,
      donations: { where: { status: 'COMPLETED' }, select: { amount: true, donatedAt: true } },
    },
  })

  const now = Date.now()
  const rows = contacts
    .filter((c) => c.donations.length > 0)
    .map((c) => {
      const gs = [...c.donations].sort((a, b) => +a.donatedAt - +b.donatedAt)
      const n = gs.length
      const life = gs.reduce((s, g) => s + g.amount, 0)
      const last = gs[n - 1]
      const months = (now - +last.donatedAt) / (30.44 * DAY)
      const priorAvg = n > 1 ? (life - last.amount) / (n - 1) : 0
      const ratio = priorAvg ? last.amount / priorAvg : 0
      const avg = life / n

      const mgs = n >= 3 && months <= 6 && ratio >= 1.5
      let status = 'Active', mult = 0
      if (n === 1 && months < 2) { status = 'New donor'; mult = 4 }
      else if (life >= 10000 && months < 6) { status = 'Champion'; mult = 2 }
      else if (months >= 12) { status = 'Lapse risk'; mult = 1.5 }
      else if (months >= 6) { status = 'Cooling'; mult = 1 }

      return {
        name: `${c.firstName} ${c.lastName}`, n, life, months, ratio,
        mgs, status, atStake: avg * mult,
      }
    })

  const money = (v: number) => '$' + Math.round(v).toLocaleString('en-US')
  console.log(`\nOrg: ${org.name}   donors created: ${created}   already present: ${skipped}\n`)

  console.log('MAJOR-GIFT SIGNAL would flag:')
  rows.filter((r) => r.mgs).sort((a, b) => b.ratio - a.ratio)
    .forEach((r) => console.log(`   ${r.name.padEnd(24)} ${r.ratio.toFixed(1)}x   ${money(r.life)} lifetime   ${r.months.toFixed(1)}mo ago`))

  console.log('\nMORNING BRIEF top 3 (by dollars at stake):')
  rows.filter((r) => r.status !== 'Active').sort((a, b) => b.atStake - a.atStake).slice(0, 3)
    .forEach((r) => console.log(`   ${r.name.padEnd(24)} ${r.status.padEnd(11)} ${money(r.atStake)} at stake   ${r.months.toFixed(1)}mo quiet`))

  console.log('\nWELCOME SERIES would enrol:')
  const ws = rows.filter((r) => r.n === 1 && r.months < 2)
  ws.length
    ? ws.forEach((r) => console.log(`   ${r.name.padEnd(24)} first gift ${r.months.toFixed(1)}mo ago`))
    : console.log('   (none)')

  console.log('\nCORRECTLY SILENT (the controls that prove the gates work):')
  rows.filter((r) => !r.mgs && r.status === 'Active' && r.n >= 3)
    .sort((a, b) => b.n - a.n)
    .forEach((r) => console.log(`   ${r.name.padEnd(24)} ${r.n} gifts   ${r.ratio.toFixed(1)}x   ${money(r.life)} lifetime`))
  console.log()
}

main()
  .catch((e) => { console.error('SEED_ERROR', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
