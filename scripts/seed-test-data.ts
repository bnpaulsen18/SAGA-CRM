import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test data...');

  // Create test organization
  const org = await prisma.organization.upsert({
    where: { ein: '12-3456789' },
    update: {},
    create: {
      name: 'Test Nonprofit Foundation',
      ein: '12-3456789',
      email: 'contact@testnonprofit.org',
      phone: '555-0100',
      website: 'https://testnonprofit.org',
      organizationType: 'INDEPENDENT',
      taxExemptStatus: 'EXEMPT_501C3',
      missionStatement: 'Supporting communities through charitable giving',
      primaryProgram: 'Community Development',
    },
  });

  console.log('✅ Created organization:', org.name);

  // Create test user
  const hashedPassword = await hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@testnonprofit.org' },
    update: {
      organizationId: org.id,
    },
    create: {
      email: 'admin@testnonprofit.org',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      organizationId: org.id,
      isPlatformAdmin: false,
    },
  });

  console.log('✅ Created user:', user.email);

  // Create test contact
  const contact = await prisma.contact.create({
    data: {
      organizationId: org.id,
      firstName: 'John',
      lastName: 'Donor',
      email: 'john.donor@example.com',
      phone: '555-0101',
      status: 'ACTIVE',
      type: 'DONOR',
    },
  });

  console.log('✅ Created contact:', contact.firstName, contact.lastName);

  // Create test campaign
  const campaign = await prisma.campaign.create({
    data: {
      organizationId: org.id,
      name: 'Annual Fundraising Campaign 2024',
      status: 'ACTIVE',
      goal: 50000,
      raised: 15000,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      description: 'Our annual fundraising campaign to support community programs',
    },
  });

  console.log('✅ Created campaign:', campaign.name);

  // Create test donations
  const donations = await prisma.donation.createMany({
    data: [
      {
        organizationId: org.id,
        contactId: contact.id,
        campaignId: campaign.id,
        amount: 1000,
        currency: 'USD',
        type: 'ONE_TIME',
        method: 'CREDIT_CARD',
        status: 'COMPLETED',
        fundRestriction: 'UNRESTRICTED',
        receiptNumber: `${org.id.substring(0, 4)}-20240115-ABC123`,
        taxDeductible: true,
        donatedAt: new Date('2024-01-15'),
      },
      {
        organizationId: org.id,
        contactId: contact.id,
        campaignId: campaign.id,
        amount: 2500,
        currency: 'USD',
        type: 'ONE_TIME',
        method: 'CREDIT_CARD',
        status: 'COMPLETED',
        fundRestriction: 'UNRESTRICTED',
        receiptNumber: `${org.id.substring(0, 4)}-20240301-DEF456`,
        taxDeductible: true,
        donatedAt: new Date('2024-03-01'),
      },
      {
        organizationId: org.id,
        contactId: contact.id,
        campaignId: campaign.id,
        amount: 500,
        currency: 'USD',
        type: 'MONTHLY',
        method: 'BANK_TRANSFER',
        status: 'COMPLETED',
        fundRestriction: 'PROGRAM_RESTRICTED',
        receiptNumber: `${org.id.substring(0, 4)}-20240615-GHI789`,
        taxDeductible: true,
        donatedAt: new Date('2024-06-15'),
      },
    ],
  });

  console.log('✅ Created donations:', donations.count);

  console.log('\n🎉 Test data seeded successfully!');
  console.log('\n📝 Login credentials:');
  console.log('   Email: admin@testnonprofit.org');
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
