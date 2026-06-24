import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

async function checkRLSPolicies() {
  try {
    // Check if RLS is enabled
    const rlsStatus = await prisma.$queryRaw<Array<{tablename: string, rowsecurity: boolean}>>`
      SELECT tablename, rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;

    console.log('\n=== RLS Status ===\n');
    rlsStatus.forEach(row => {
      console.log(`${row.tablename}: ${row.rowsecurity ? '❌ ENABLED' : '✅ DISABLED'}`);
    });

    // Check for existing policies
    const policies = await prisma.$queryRaw<Array<{
      schemaname: string,
      tablename: string,
      policyname: string,
      permissive: string,
      roles: string[],
      cmd: string
    }>>`
      SELECT
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd
      FROM pg_policies
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname;
    `;

    console.log('\n=== Active RLS Policies ===\n');
    if (policies.length === 0) {
      console.log('✅ No RLS policies found\n');
    } else {
      console.log(`❌ Found ${policies.length} active policies:\n`);
      policies.forEach(policy => {
        console.log(`Table: ${policy.tablename}`);
        console.log(`  Policy: ${policy.policyname}`);
        console.log(`  Command: ${policy.cmd}`);
        console.log(`  Roles: ${policy.roles.join(', ')}`);
        console.log('');
      });
    }

    // Try a simple query
    console.log('=== Testing Simple Query ===\n');
    try {
      await prisma.$queryRaw`SELECT 1 as test`;
      console.log('✅ SELECT 1 query succeeded\n');
    } catch (error) {
      console.log('❌ SELECT 1 query failed:', error);
    }

    // Check database user and privileges
    console.log('=== Database Connection Info ===\n');
    const userInfo = await prisma.$queryRaw<Array<{current_user: string, current_database: string}>>`
      SELECT current_user, current_database();
    `;
    console.log('Connected as:', userInfo[0].current_user);
    console.log('Database:', userInfo[0].current_database);

  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRLSPolicies();
