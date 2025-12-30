import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');

    await prisma.$connect();
    console.log('✅ Connected to database');

    const orgCount = await prisma.organization.count();
    console.log(`✅ Found ${orgCount} organization(s)`);

    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} user(s)`);

    const contactCount = await prisma.contact.count();
    console.log(`✅ Found ${contactCount} contact(s)`);

    console.log('\n🎉 Database connection successful!');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
