import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Checking database...')

  try {
    // Test connection
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connected')

    // Check users
    const userCount = await prisma.user.count()
    console.log(`👥 Users: ${userCount}`)

    // Check organizations
    const orgCount = await prisma.organization.count()
    console.log(`🏢 Organizations: ${orgCount}`)

    // Show users if any
    if (userCount > 0) {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          organizationId: true
        }
      })
      console.log('\nUsers:')
      users.forEach(u => {
        console.log(`  - ${u.email} (${u.role}) org: ${u.organizationId || 'none'}`)
      })
    } else {
      console.log('\n⚠️ No users! Register at /register')
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
