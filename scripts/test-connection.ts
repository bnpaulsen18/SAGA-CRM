import { Pool } from 'pg';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });
config({ path: '.env' });

async function testConnections() {
  console.log('\n=== Testing Database Connections ===\n');

  // Test DIRECT_URL
  console.log('Testing DIRECT_URL...');
  const directUrl = process.env.DIRECT_URL;
  console.log('URL:', directUrl?.substring(0, 50) + '...');

  if (directUrl) {
    const directPool = new Pool({ connectionString: directUrl });
    try {
      const result = await directPool.query('SELECT 1 as test, current_user, current_database()');
      console.log('✅ DIRECT_URL connection succeeded');
      console.log('   User:', result.rows[0].current_user);
      console.log('   Database:', result.rows[0].current_database);
      await directPool.end();
    } catch (error) {
      console.log('❌ DIRECT_URL connection failed:', error);
    }
  }

  // Test DATABASE_URL
  console.log('\nTesting DATABASE_URL (pooler)...');
  const databaseUrl = process.env.DATABASE_URL;
  console.log('URL:', databaseUrl?.substring(0, 50) + '...');

  if (databaseUrl) {
    const poolerPool = new Pool({ connectionString: databaseUrl });
    try {
      const result = await poolerPool.query('SELECT 1 as test, current_user, current_database()');
      console.log('✅ DATABASE_URL connection succeeded');
      console.log('   User:', result.rows[0].current_user);
      console.log('   Database:', result.rows[0].current_database);
      await poolerPool.end();
    } catch (error) {
      console.log('❌ DATABASE_URL connection failed:', error);
    }
  }

  // Check what lib/prisma.ts would use
  console.log('\n=== What lib/prisma.ts Would Use ===\n');
  const nodeEnv = process.env.NODE_ENV || 'development';
  console.log('NODE_ENV:', nodeEnv);

  const connectionUrl = nodeEnv === 'production'
    ? process.env.DATABASE_URL || process.env.DIRECT_URL || ''
    : process.env.DIRECT_URL || process.env.DATABASE_URL || '';

  const isPgBouncer = connectionUrl.includes('pgbouncer=true') || connectionUrl.includes('pooler.supabase');

  console.log('Selected URL:', connectionUrl.substring(0, 50) + '...');
  console.log('Is PgBouncer:', isPgBouncer);
  console.log('Would use adapter:', isPgBouncer ? 'YES (PrismaPg)' : 'NO (Standard)');
}

testConnections();
