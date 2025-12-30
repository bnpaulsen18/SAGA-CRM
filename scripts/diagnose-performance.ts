import { PrismaClient } from '@prisma/client';
import { performance } from 'perf_hooks';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function diagnosePerformance() {
  console.log('🔍 SAGA CRM Performance Diagnostic\n');
  console.log('=' .repeat(60));

  // Test 1: Database Connection
  console.log('\n📡 Test 1: Database Connection Speed');
  const dbStart = performance.now();
  try {
    await prisma.$connect();
    const dbEnd = performance.now();
    console.log(`✅ Connected in ${(dbEnd - dbStart).toFixed(2)}ms`);
  } catch (error) {
    console.log(`❌ Connection failed:`, error);
    process.exit(1);
  }

  // Test 2: Simple Query
  console.log('\n📊 Test 2: Simple Count Query');
  const countStart = performance.now();
  try {
    const orgCount = await prisma.organization.count();
    const countEnd = performance.now();
    console.log(`✅ Count query: ${(countEnd - countStart).toFixed(2)}ms`);
    console.log(`   Found ${orgCount} organization(s)`);
  } catch (error) {
    console.log(`❌ Query failed:`, error);
  }

  // Test 3: Complex Query (like donations page)
  console.log('\n🎯 Test 3: Complex Donations Query');
  const complexStart = performance.now();
  try {
    const orgs = await prisma.organization.findMany({ take: 1 });
    if (orgs.length === 0) {
      console.log('⚠️  No organizations found - run seed script');
    } else {
      const donations = await prisma.donation.findMany({
        where: { organizationId: orgs[0].id },
        include: {
          contact: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          campaign: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { donatedAt: 'desc' },
        take: 100,
      });
      const complexEnd = performance.now();
      console.log(`✅ Complex query: ${(complexEnd - complexStart).toFixed(2)}ms`);
      console.log(`   Found ${donations.length} donation(s)`);
    }
  } catch (error) {
    console.log(`❌ Complex query failed:`, error);
  }

  // Test 4: Multiple Parallel Queries
  console.log('\n⚡ Test 4: Parallel Queries Performance');
  const parallelStart = performance.now();
  try {
    const [orgs, contacts, campaigns] = await Promise.all([
      prisma.organization.findMany({ take: 10 }),
      prisma.contact.findMany({ take: 10 }),
      prisma.campaign.findMany({ take: 10 }),
    ]);
    const parallelEnd = performance.now();
    console.log(`✅ Parallel queries: ${(parallelEnd - parallelStart).toFixed(2)}ms`);
    console.log(`   Orgs: ${orgs.length}, Contacts: ${contacts.length}, Campaigns: ${campaigns.length}`);
  } catch (error) {
    console.log(`❌ Parallel queries failed:`, error);
  }

  // Test 5: Database Latency (ping test)
  console.log('\n🏓 Test 5: Database Latency (10 pings)');
  const latencies: number[] = [];
  for (let i = 0; i < 10; i++) {
    const pingStart = performance.now();
    await prisma.$queryRaw`SELECT 1`;
    const pingEnd = performance.now();
    latencies.push(pingEnd - pingStart);
  }
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const minLatency = Math.min(...latencies);
  const maxLatency = Math.max(...latencies);
  console.log(`   Min: ${minLatency.toFixed(2)}ms`);
  console.log(`   Avg: ${avgLatency.toFixed(2)}ms`);
  console.log(`   Max: ${maxLatency.toFixed(2)}ms`);

  // Test 6: Connection Pool
  console.log('\n🔌 Test 6: Connection Pool Status');
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL?.substring(0, 50)}...`);
  const isDirect = process.env.DATABASE_URL?.includes(':5432');
  const isPooler = process.env.DATABASE_URL?.includes(':6543');
  console.log(`   Connection type: ${isDirect ? 'DIRECT ⚡' : isPooler ? 'POOLER 🐢' : 'UNKNOWN'}`);

  console.log('\n' + '='.repeat(60));
  console.log('📈 PERFORMANCE SUMMARY\n');

  const issues: string[] = [];
  const recommendations: string[] = [];

  if (avgLatency > 100) {
    issues.push('❌ High database latency (>100ms average)');
    recommendations.push('→ Consider using direct connection instead of pooler');
    recommendations.push('→ Check network connectivity to Supabase');
  } else if (avgLatency > 50) {
    issues.push('⚠️  Moderate database latency (>50ms average)');
    recommendations.push('→ Already using direct connection, latency is from Supabase distance');
  } else {
    console.log('✅ Database latency is excellent (<50ms)');
  }

  if (isPooler) {
    issues.push('⚠️  Using connection pooler instead of direct connection');
    recommendations.push('→ Switch to DIRECT_URL for faster dev performance');
  } else if (isDirect) {
    console.log('✅ Using direct database connection');
  }

  if (issues.length > 0) {
    console.log('\n🔴 Issues Found:');
    issues.forEach((issue) => console.log(`   ${issue}`));
  }

  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    recommendations.forEach((rec) => console.log(`   ${rec}`));
  }

  if (issues.length === 0 && recommendations.length === 0) {
    console.log('\n🎉 No performance issues detected!');
    console.log('   Your database configuration is optimal.');
  }

  await prisma.$disconnect();
}

diagnosePerformance()
  .catch((e) => {
    console.error('\n❌ Diagnostic failed:', e);
    process.exit(1);
  });
