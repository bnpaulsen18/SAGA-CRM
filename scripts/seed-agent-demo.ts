/**
 * Seeds donor histories that actually exercise the four AI agents.
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
import { scoreDonor } from '../lib/donors/scoring'

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
    demonstrates: 'Morning Brief — Lapse risk. 22 months quiet. Return Series: escalated tier (too big to auto-email).',
  },
  {
    first: 'David', last: 'Ashford', email: 'd.ashford@example.com',
    gifts: [[500, 49], [750, 42], [1200, 35]],
    demonstrates: 'Morning Brief — Lapse risk, deep. 35 months quiet. Return Series: escalated tier.',
  },
  // These three give roughly twice a year, so 13-15 months of silence is well
  // past their own rhythm. Cadence matters: an annual donor at 14 months is
  // behaving normally, a twice-yearly donor at 14 months has stopped.
  {
    first: 'Anna', last: 'Petrov', email: 'a.petrov@example.com',
    gifts: [[300, 26], [300, 20], [250, 14]],
    demonstrates: 'Morning Brief — Lapse risk, small. Return Series: automated tier.',
  },
  {
    first: 'Ruth', last: 'Feldman', email: 'r.feldman@example.com',
    gifts: [[100, 30], [150, 22], [120, 15]],
    demonstrates: 'Return Series — automated tier. Too small to be worth a fundraiser call, too loyal to lose.',
  },
  {
    first: 'Carlos', last: 'Mendez', email: 'c.mendez@example.com',
    gifts: [[200, 25], [250, 19], [200, 13]],
    demonstrates: 'Return Series — automated tier.',
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

  // Scored with the app's own module so this report can never drift from what
  // the dashboard and the agents actually see.
  const rows = contacts
    .filter((c) => c.donations.length > 0)
    .map((c) => ({
      name: `${c.firstName} ${c.lastName}`,
      ...scoreDonor({ gifts: c.donations.map((d) => ({ amount: d.amount, donatedAt: d.donatedAt })) }),
    }))

  const money = (v: number) => '$' + Math.round(v).toLocaleString('en-US')
  const cad = (r: { cadenceMonths: number | null }) =>
    r.cadenceMonths ? `every ~${r.cadenceMonths.toFixed(0)}mo` : 'no rhythm yet'
  console.log(`\nOrg: ${org.name}   donors created: ${created}   already present: ${skipped}\n`)

  console.log('MAJOR-GIFT SIGNAL would flag:')
  rows.filter((r) => r.majorGiftSignal).sort((a, b) => (b.trendRatio ?? 0) - (a.trendRatio ?? 0))
    .forEach((r) => console.log(`   ${r.name.padEnd(24)} ${(r.trendRatio ?? 0).toFixed(1)}x   ${money(r.lifetime)} lifetime   ${r.monthsSince.toFixed(1)}mo ago`))

  console.log('\nMORNING BRIEF top 3 (by dollars at stake):')
  rows.filter((r) => r.status !== 'Active').sort((a, b) => b.atStake - a.atStake).slice(0, 3)
    .forEach((r) => console.log(`   ${r.name.padEnd(24)} ${r.status.padEnd(11)} ${money(r.atStake)} at stake   ${r.monthsSince.toFixed(1)}mo quiet`))

  // Return Series gates on `lapsed` — relative to each donor's own cadence, not
  // a flat cut — then splits on lifetime value.
  const lapsed = rows.filter((r) => r.lapsed)

  console.log('\nRETURN SERIES — automated win-back (under the human-escalation tier):')
  const auto = lapsed.filter((r) => !r.needsHumanOutreach).sort((a, b) => b.lifetime - a.lifetime)
  auto.length
    ? auto.forEach((r) => console.log(`   ${r.name.padEnd(24)} ${money(r.lifetime)} lifetime   ${r.monthsSince.toFixed(0)}mo quiet   (gives ${cad(r)})`))
    : console.log('   (none)')

  console.log('\nRETURN SERIES — escalated to a person:')
  const human = lapsed.filter((r) => r.needsHumanOutreach).sort((a, b) => b.lifetime - a.lifetime)
  human.length
    ? human.forEach((r) => console.log(`   ${r.name.padEnd(24)} ${money(r.lifetime)} lifetime   ${r.monthsSince.toFixed(0)}mo quiet   -> Morning Brief`))
    : console.log('   (none)')

  console.log('\nWELCOME SERIES would enrol:')
  const ws = rows.filter((r) => r.status === 'New donor')
  ws.length
    ? ws.forEach((r) => console.log(`   ${r.name.padEnd(24)} first gift ${r.monthsSince.toFixed(1)}mo ago`))
    : console.log('   (none)')

  console.log('\nCORRECTLY SILENT (the controls that prove the gates work):')
  rows.filter((r) => !r.majorGiftSignal && !r.lapsed && r.status === 'Active' && r.count >= 3)
    .sort((a, b) => b.count - a.count)
    .forEach((r) => console.log(`   ${r.name.padEnd(24)} ${r.count} gifts   ${(r.trendRatio ?? 0).toFixed(1)}x   ${money(r.lifetime)} lifetime`))

  console.log('\nQUIET BUT NOT LAPSED (cooling on the dashboard, no win-back sent):')
  rows.filter((r) => !r.lapsed && r.monthsSince >= 6)
    .sort((a, b) => b.lifetime - a.lifetime)
    .forEach((r) => console.log(`   ${r.name.padEnd(24)} ${money(r.lifetime)} lifetime   ${r.monthsSince.toFixed(0)}mo quiet   (gives ${cad(r)})`))
  console.log()
}

main()
  .catch((e) => { console.error('SEED_ERROR', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
