/**
 * Creates a ready-to-use, email-VERIFIED admin login + a populated demo org
 * (Hope Foundation) so the reskinned dashboard shows real-looking numbers.
 *
 * Run:  npx tsx scripts/seed-demo-login.ts
 *
 * Idempotent: re-running updates the login and only seeds demo data if the
 * org has none yet. Demo data is fictional (see project memory).
 */
import { config } from 'dotenv'
// Next precedence: .env.local overrides .env
config({ path: '.env' })
config({ path: '.env.local', override: true })

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { hash } from 'bcryptjs'

const url = process.env.DATABASE_URL || process.env.DIRECT_URL || ''
if (!url) {
  console.error('NO_DATABASE_URL: not found in .env / .env.local')
  process.exit(1)
}

// Mirror lib/prisma.ts: use the pg adapter for Supabase/PgBouncer poolers.
const isPgBouncer = url.includes('pgbouncer=true') || url.includes('pooler.supabase')
const prisma = isPgBouncer
  ? new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString: url, max: 5 })) })
  : new PrismaClient()

const EMAIL = 'demo@saga.app'
const PASSWORD = 'SagaDemo2026!'
const EIN = '88-8888888'

async function main() {
  const passwordHash = await hash(PASSWORD, 12)

  const org = await prisma.organization.upsert({
    where: { ein: EIN },
    update: { onboardingCompleted: true },
    create: {
      name: 'Hope Foundation',
      ein: EIN,
      email: 'hello@hopefoundation.org',
      phone: '555-0142',
      website: 'https://hopefoundation.org',
      organizationType: 'INDEPENDENT',
      taxExemptStatus: 'EXEMPT_501C3',
      missionStatement: 'Bringing clean water and education to communities in need.',
      primaryProgram: 'Clean Water Initiative',
      onboardingCompleted: true,
    },
  })

  const user = await prisma.user.upsert({
    where: { email: EMAIL },
    update: {
      password: passwordHash,
      emailVerified: new Date(),
      firstName: 'Beau',
      lastName: 'Paulsen',
      role: 'ADMIN',
      organizationId: org.id,
      isPlatformAdmin: false,
    },
    create: {
      email: EMAIL,
      password: passwordHash,
      firstName: 'Beau',
      lastName: 'Paulsen',
      role: 'ADMIN',
      organizationId: org.id,
      emailVerified: new Date(),
      isPlatformAdmin: false,
    },
  })

  const existingContacts = await prisma.contact.count({ where: { organizationId: org.id } })
  if (existingContacts === 0) {
    const donorNames: [string, string][] = [
      ['Maria', 'Alvarez'], ['James', 'Chen'], ['Aisha', 'Okafor'],
      ['David', 'Goldberg'], ['Sarah', 'Whitfield'], ['Tom', 'Becker'],
    ]
    const contacts = []
    for (const [firstName, lastName] of donorNames) {
      contacts.push(await prisma.contact.create({
        data: {
          organizationId: org.id, firstName, lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          phone: '555-0' + (100 + contacts.length),
          status: 'ACTIVE', type: 'DONOR',
        },
      }))
    }

    const campaignsData = [
      { name: 'Spring Appeal 2026', status: 'ACTIVE', goal: 50000, raised: 32400, description: 'Our spring fundraising drive for clean-water wells.' },
      { name: 'Clean Water Initiative', status: 'ACTIVE', goal: 120000, raised: 78250, description: 'Building sustainable water systems in three regions.' },
      { name: 'Year-End Gala 2025', status: 'COMPLETED', goal: 40000, raised: 41800, description: 'Annual gala supporting education programs.' },
    ]
    const campaigns = []
    for (const cd of campaignsData) {
      campaigns.push(await prisma.campaign.create({
        data: {
          organizationId: org.id, name: cd.name, status: cd.status as never,
          goal: cd.goal, raised: cd.raised,
          startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31'),
          description: cd.description,
        },
      }))
    }

    const amounts = [250, 1000, 500, 2500, 150, 5000, 750, 300, 1200, 400]
    const methods = ['CREDIT_CARD', 'BANK_TRANSFER']
    const today = new Date()
    for (let i = 0; i < amounts.length; i++) {
      const contact = contacts[i % contacts.length]
      const campaign = campaigns[i % 2] // one of the two ACTIVE campaigns
      const donatedAt = new Date(today.getTime() - (i * 4 + 1) * 86400000)
      const y = donatedAt.getFullYear()
      const m = String(donatedAt.getMonth() + 1).padStart(2, '0')
      const d = String(donatedAt.getDate()).padStart(2, '0')
      await prisma.donation.create({
        data: {
          organizationId: org.id, contactId: contact.id, campaignId: campaign.id,
          amount: amounts[i], currency: 'USD',
          type: i % 3 === 0 ? 'MONTHLY' : 'ONE_TIME',
          method: methods[i % 2] as never,
          status: 'COMPLETED', fundRestriction: 'UNRESTRICTED',
          receiptNumber: `HF-${y}${m}${d}-${1000 + i}`,
          taxDeductible: true, donatedAt,
        },
      })
    }
    console.log(`Seeded ${contacts.length} contacts, ${campaigns.length} campaigns, ${amounts.length} donations`)
  } else {
    console.log(`Org already has ${existingContacts} contacts - skipped data seeding`)
  }

  console.log('LOGIN_READY')
  console.log('email=' + EMAIL)
  console.log('password=' + PASSWORD)
  console.log('org=' + org.name + ' (' + org.id + ')')
  console.log('userId=' + user.id)
}

main()
  .catch((e) => { console.error('SEED_ERROR', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
