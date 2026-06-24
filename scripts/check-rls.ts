import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

async function checkRLS() {
  try {
    const result = await prisma.$queryRaw<Array<{tablename: string, rowsecurity: boolean}>>`
      SELECT tablename, rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;

    console.log('\n=== RLS Status for all tables ===\n');
    console.log('Table Name'.padEnd(30) + 'RLS Enabled');
    console.log('='.repeat(50));

    let hasRLS = false;
    result.forEach(row => {
      console.log(
        row.tablename.padEnd(30) +
        (row.rowsecurity ? '❌ YES (PROBLEM!)' : '✅ NO (GOOD)')
      );
      if (row.rowsecurity) hasRLS = true;
    });

    console.log('='.repeat(50));
    console.log(`\n${hasRLS ? '❌ RLS IS STILL ENABLED ON SOME TABLES!' : '✅ RLS is disabled on all tables'}\n`);

  } catch (error) {
    console.error('Error checking RLS:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRLS();
