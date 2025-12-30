/**
 * Check if platform admin user exists
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdminUser() {
  try {
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { isPlatformAdmin: true },
          { role: 'PLATFORM_ADMIN' }
        ]
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isPlatformAdmin: true,
        organizationId: true,
        createdAt: true
      }
    });

    if (adminUser) {
      console.log('\n✓ Platform admin user found:\n');
      console.log('ID:', adminUser.id);
      console.log('Email:', adminUser.email);
      console.log('Name:', `${adminUser.firstName} ${adminUser.lastName}`);
      console.log('Role:', adminUser.role);
      console.log('isPlatformAdmin:', adminUser.isPlatformAdmin);
      console.log('organizationId:', adminUser.organizationId);
      console.log('Created:', adminUser.createdAt);
      console.log('\n');
    } else {
      console.log('\n✗ No platform admin user found in database.');
      console.log('Please run the SQL to create the platform admin user.\n');
    }

    // Also check all users
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
        isPlatformAdmin: true
      }
    });

    console.log(`\nTotal users in database: ${allUsers.length}`);
    if (allUsers.length > 0) {
      console.log('\nAll users:');
      allUsers.forEach(user => {
        console.log(`- ${user.email} (${user.role}, isPlatformAdmin: ${user.isPlatformAdmin})`);
      });
    }

  } catch (error) {
    console.error('Error checking admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUser();
