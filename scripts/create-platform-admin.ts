import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Creating Platform Admin account...');

  const hashedPassword = await hash('admin123', 10);

  const platformAdmin = await prisma.user.upsert({
    where: { email: 'platform@saga.com' },
    update: {
      isPlatformAdmin: true,
      role: 'ADMIN',
    },
    create: {
      email: 'platform@saga.com',
      password: hashedPassword,
      firstName: 'Platform',
      lastName: 'Admin',
      role: 'ADMIN',
      isPlatformAdmin: true,
    },
  });

  console.log('✅ Platform Admin created successfully!');
  console.log('\n📝 Platform Admin Login:');
  console.log('   Email: platform@saga.com');
  console.log('   Password: admin123');
  console.log('\n🚀 Access the platform admin dashboard at: http://localhost:3000/admin');
}

main()
  .catch((e) => {
    console.error('❌ Error creating platform admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
