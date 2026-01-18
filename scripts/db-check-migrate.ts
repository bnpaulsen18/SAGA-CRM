#!/usr/bin/env tsx
/**
 * Database Check and Migration Script
 *
 * This script:
 * 1. Checks if the database is accessible
 * 2. Checks if required tables exist
 * 3. Runs migrations if tables are missing
 * 4. Reports status
 *
 * Usage:
 *   npx tsx scripts/db-check-migrate.ts
 *   npm run db:check
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface MigrationResult {
  success: boolean
  message: string
  tablesCreated?: string[]
  errors?: string[]
}

const REQUIRED_TABLES = [
  'Organization',
  'User',
  'Contact',
  'Donation',
  'Campaign',
  'Email',
  'EmailRecipient',
  'Interaction',
  'Task'
]

async function checkDatabaseConnection(): Promise<boolean> {
  console.log('🔍 Checking database connection...')
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    return true
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message)
    return false
  }
}

async function getExistingTables(): Promise<string[]> {
  console.log('🔍 Checking existing tables...')
  try {
    const tables: { table_name: string }[] = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `
    const tableNames = tables.map(t => t.table_name)
    console.log(`📊 Found ${tableNames.length} tables:`, tableNames.join(', '))
    return tableNames
  } catch (error: any) {
    console.error('❌ Failed to get tables:', error.message)
    return []
  }
}

async function checkMissingTables(): Promise<string[]> {
  const existingTables = await getExistingTables()
  const existingLower = existingTables.map(t => t.toLowerCase())

  const missing = REQUIRED_TABLES.filter(
    table => !existingLower.includes(table.toLowerCase())
  )

  if (missing.length > 0) {
    console.log(`⚠️ Missing tables: ${missing.join(', ')}`)
  } else {
    console.log('✅ All required tables exist')
  }

  return missing
}

async function runPrismaDbPush(): Promise<MigrationResult> {
  console.log('🚀 Running prisma db push to sync schema...')

  const { execSync } = await import('child_process')

  try {
    execSync('npx prisma db push --accept-data-loss', {
      stdio: 'inherit',
      cwd: process.cwd()
    })

    return {
      success: true,
      message: 'Prisma db push completed successfully'
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Prisma db push failed',
      errors: [error.message]
    }
  }
}

async function runManualMigrations(): Promise<MigrationResult> {
  console.log('🚀 Running manual SQL migrations...')

  const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations')
  const errors: string[] = []
  const executed: string[] = []

  // Order matters for migrations
  const migrationFiles = [
    'manual_migration.sql',
    'add-hierarchical-orgs.sql',
    'manual-fraud-detection.sql',
    'manual-email-subscribers.sql'
  ]

  for (const filename of migrationFiles) {
    const filepath = path.join(migrationsDir, filename)

    if (!fs.existsSync(filepath)) {
      console.log(`⏭️ Skipping ${filename} (not found)`)
      continue
    }

    try {
      console.log(`📄 Executing ${filename}...`)
      const sql = fs.readFileSync(filepath, 'utf8')

      // Split by semicolons and execute each statement
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))

      for (const statement of statements) {
        try {
          await prisma.$executeRawUnsafe(statement)
        } catch (e: any) {
          // Ignore "already exists" errors
          if (!e.message.includes('already exists') &&
              !e.message.includes('duplicate key')) {
            console.warn(`⚠️ Statement warning: ${e.message.substring(0, 100)}`)
          }
        }
      }

      executed.push(filename)
      console.log(`✅ ${filename} completed`)
    } catch (error: any) {
      errors.push(`${filename}: ${error.message}`)
      console.error(`❌ ${filename} failed: ${error.message}`)
    }
  }

  return {
    success: errors.length === 0,
    message: `Executed ${executed.length} migrations`,
    tablesCreated: executed,
    errors: errors.length > 0 ? errors : undefined
  }
}

async function checkUserExists(): Promise<boolean> {
  console.log('🔍 Checking if any users exist...')
  try {
    const count = await prisma.user.count()
    console.log(`👥 Found ${count} user(s)`)
    return count > 0
  } catch (error: any) {
    console.log('⚠️ Cannot check users (table might not exist)')
    return false
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════')
  console.log('  SAGA CRM - Database Check & Migration Tool')
  console.log('═══════════════════════════════════════════════════════')
  console.log('')

  // Step 1: Check connection
  const connected = await checkDatabaseConnection()
  if (!connected) {
    console.log('')
    console.log('❌ FAILED: Cannot connect to database')
    console.log('   Please check your DATABASE_URL environment variable')
    process.exit(1)
  }

  // Step 2: Check tables
  const missingTables = await checkMissingTables()

  // Step 3: Run migrations if needed
  if (missingTables.length > 0) {
    console.log('')
    console.log('🔧 Database needs migration. Running prisma db push...')

    const result = await runPrismaDbPush()

    if (!result.success) {
      console.log('')
      console.log('⚠️ Prisma db push had issues. Trying manual migrations...')
      const manualResult = await runManualMigrations()

      if (!manualResult.success) {
        console.log('')
        console.log('❌ FAILED: Migration errors occurred')
        console.log('   Errors:', manualResult.errors)
        process.exit(1)
      }
    }

    // Re-check tables after migration
    const stillMissing = await checkMissingTables()
    if (stillMissing.length > 0) {
      console.log('')
      console.log('⚠️ WARNING: Some tables still missing after migration')
      console.log('   Missing:', stillMissing.join(', '))
      console.log('   This may require manual intervention')
    }
  }

  // Step 4: Check users
  const hasUsers = await checkUserExists()

  // Final report
  console.log('')
  console.log('═══════════════════════════════════════════════════════')
  console.log('  DATABASE STATUS REPORT')
  console.log('═══════════════════════════════════════════════════════')
  console.log(`  Connection:     ✅ OK`)
  console.log(`  Tables:         ${missingTables.length === 0 ? '✅ All present' : `⚠️ ${missingTables.length} missing`}`)
  console.log(`  Users:          ${hasUsers ? '✅ Users exist' : '⚠️ No users (register first!)'}`)
  console.log('═══════════════════════════════════════════════════════')

  if (!hasUsers) {
    console.log('')
    console.log('📝 NEXT STEP: Register your first user at /register')
  }

  await prisma.$disconnect()
  process.exit(0)
}

main().catch(async (error) => {
  console.error('Fatal error:', error)
  await prisma.$disconnect()
  process.exit(1)
})
