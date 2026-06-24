import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config({ path: '.env.local' });
config({ path: '.env' });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL // Use pooler
    }
  }
});

async function checkSupabaseConfig() {
  try {
    console.log('\n=== Checking Supabase Configuration ===\n');

    // Check current role and settings
    const roleInfo = await prisma.$queryRaw<Array<{
      current_user: string,
      current_database: string,
      session_user: string
    }>>`
      SELECT current_user, current_database(), session_user;
    `;

    console.log('Connection Info:');
    console.log('  Current User:', roleInfo[0].current_user);
    console.log('  Session User:', roleInfo[0].session_user);
    console.log('  Database:', roleInfo[0].current_database);

    // Check if there are any session variables set
    console.log('\n=== Session Configuration ===\n');
    const sessionVars = await prisma.$queryRaw<Array<{name: string, setting: string}>>`
      SELECT name, setting
      FROM pg_settings
      WHERE name LIKE '%rls%' OR name LIKE '%row_security%'
      ORDER BY name;
    `;

    if (sessionVars.length > 0) {
      sessionVars.forEach(v => {
        console.log(`${v.name}: ${v.setting}`);
      });
    } else {
      console.log('No RLS-related session variables found');
    }

    // Check database-level settings
    console.log('\n=== Database RLS Settings ===\n');
    const dbSettings = await prisma.$queryRaw<Array<any>>`
      SELECT datname, datacl
      FROM pg_database
      WHERE datname = current_database();
    `;
    console.log('Database ACL:', dbSettings[0].datacl);

    // Check role permissions
    console.log('\n=== Role Information ===\n');
    const rolePerms = await prisma.$queryRaw<Array<{
      rolname: string,
      rolsuper: boolean,
      rolinherit: boolean,
      rolcreaterole: boolean,
      rolcreatedb: boolean,
      rolcanlogin: boolean,
      rolbypassrls: boolean
    }>>`
      SELECT rolname, rolsuper, rolinherit, rolcreaterole, rolcreatedb, rolcanlogin, rolbypassrls
      FROM pg_roles
      WHERE rolname = current_user;
    `;

    if (rolePerms.length > 0) {
      const role = rolePerms[0];
      console.log(`Role: ${role.rolname}`);
      console.log(`  Superuser: ${role.rolsuper}`);
      console.log(`  Inherit: ${role.rolinherit}`);
      console.log(`  Can Create Role: ${role.rolcreaterole}`);
      console.log(`  Can Create DB: ${role.rolcreatedb}`);
      console.log(`  Can Login: ${role.rolcanlogin}`);
      console.log(`  Bypass RLS: ${role.rolbypassrls} ${role.rolbypassrls ? '✅' : '❌ PROBLEM!'}`);
    }

  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSupabaseConfig();
