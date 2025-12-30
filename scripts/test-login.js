/**
 * Test the login flow to debug authentication issues
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function testLogin() {
  const prisma = new PrismaClient();

  const testEmail = 'admin@saga-crm.com';
  const testPassword = 'SagaAdmin2024!';

  console.log('\n=== Testing Login Flow ===\n');
  console.log('1. Looking up user:', testEmail);

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: testEmail,
      },
      include: {
        organization: true,
      },
    });

    if (!user) {
      console.log('✗ User not found in database!');
      await prisma.$disconnect();
      return;
    }

    console.log('✓ User found');
    console.log('  ID:', user.id);
    console.log('  Email:', user.email);
    console.log('  Name:', `${user.firstName} ${user.lastName}`);
    console.log('  Role:', user.role);
    console.log('  isPlatformAdmin:', user.isPlatformAdmin);
    console.log('  organizationId:', user.organizationId);
    console.log('  Has password:', !!user.password);

    if (!user.password) {
      console.log('\n✗ User has no password stored!');
      await prisma.$disconnect();
      return;
    }

    console.log('\n2. Password hash from database:');
    console.log('  ', user.password.substring(0, 29) + '...');

    console.log('\n3. Testing password comparison:');
    console.log('  Testing password:', testPassword);

    const isPasswordValid = await bcrypt.compare(testPassword, user.password);

    if (isPasswordValid) {
      console.log('  ✓ Password is VALID!');
      console.log('\n4. What would be returned by authorize:');
      console.log({
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        organizationId: user.organizationId,
        isPlatformAdmin: user.isPlatformAdmin || user.role === "PLATFORM_ADMIN",
      });
      console.log('\n✓✓✓ Login should work! ✓✓✓\n');
    } else {
      console.log('  ✗ Password is INVALID!');
      console.log('\n  Generating new hash for this password:');
      const newHash = bcrypt.hashSync(testPassword, 10);
      console.log('  New hash:', newHash);
      console.log('\n  Run this SQL to fix:');
      console.log(`  UPDATE "users" SET password = '${newHash}' WHERE email = '${testEmail}';`);
      console.log('\n');
    }

  } catch (error) {
    console.error('\n✗ Error during test:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
