#!/usr/bin/env tsx
/**
 * SAGA CRM - Automated Deployment Fix
 *
 * This script automates the entire deployment fix process:
 * 1. Checks environment variables
 * 2. Tests database connection
 * 3. Runs migrations
 * 4. Generates Prisma client
 * 5. Verifies everything is ready
 *
 * Usage:
 *   npx tsx scripts/auto-deploy-fix.ts
 *   npm run deploy:fix
 */

import { execSync, exec } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

interface CheckResult {
  name: string
  status: 'pass' | 'fail' | 'warn'
  message: string
}

const results: CheckResult[] = []

function log(message: string) {
  console.log(message)
}

function addResult(name: string, status: 'pass' | 'fail' | 'warn', message: string) {
  results.push({ name, status, message })
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️'
  log(`${icon} ${name}: ${message}`)
}

function runCommand(cmd: string, silent = false): { success: boolean; output: string } {
  try {
    const output = execSync(cmd, {
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit',
      cwd: process.cwd()
    })
    return { success: true, output: output || '' }
  } catch (error: any) {
    return { success: false, output: error.message }
  }
}

async function checkEnvVariables() {
  log('\n📋 Checking environment variables...')

  const required = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ]

  const optional = [
    'DIRECT_URL',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'RESEND_API_KEY',
    'KV_URL',
    'KV_REST_API_URL'
  ]

  let allPresent = true

  for (const envVar of required) {
    if (process.env[envVar]) {
      addResult(envVar, 'pass', 'Set')
    } else {
      addResult(envVar, 'fail', 'MISSING - Required!')
      allPresent = false
    }
  }

  for (const envVar of optional) {
    if (process.env[envVar]) {
      addResult(envVar, 'pass', 'Set')
    } else {
      addResult(envVar, 'warn', 'Not set (optional)')
    }
  }

  return allPresent
}

async function checkDatabaseConnection() {
  log('\n🔌 Testing database connection...')

  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()

  try {
    await prisma.$queryRaw`SELECT 1`
    addResult('Database Connection', 'pass', 'Connected successfully')
    await prisma.$disconnect()
    return true
  } catch (error: any) {
    addResult('Database Connection', 'fail', error.message)
    await prisma.$disconnect()
    return false
  }
}

async function checkDatabaseTables() {
  log('\n📊 Checking database tables...')

  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()

  try {
    const tables: { table_name: string }[] = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `

    const tableNames = tables.map(t => t.table_name)

    // Check for essential tables
    const essential = ['User', 'Organization', 'Contact', 'Donation']
    const essentialLower = essential.map(t => t.toLowerCase())
    const existingLower = tableNames.map(t => t.toLowerCase())

    const missing = essential.filter(t => !existingLower.includes(t.toLowerCase()))

    if (missing.length === 0) {
      addResult('Database Tables', 'pass', `${tableNames.length} tables found`)
      await prisma.$disconnect()
      return true
    } else {
      addResult('Database Tables', 'fail', `Missing: ${missing.join(', ')}`)
      await prisma.$disconnect()
      return false
    }
  } catch (error: any) {
    addResult('Database Tables', 'fail', error.message)
    await prisma.$disconnect()
    return false
  }
}

async function runMigrations() {
  log('\n🔧 Running database migrations...')

  // Try prisma db push first
  log('  Running prisma db push...')
  const pushResult = runCommand('npx prisma db push --accept-data-loss', true)

  if (pushResult.success) {
    addResult('Prisma DB Push', 'pass', 'Schema synced successfully')
    return true
  } else {
    addResult('Prisma DB Push', 'warn', 'Had issues, checking if tables exist anyway...')
    return await checkDatabaseTables()
  }
}

async function generatePrismaClient() {
  log('\n⚙️ Generating Prisma client...')

  const result = runCommand('npx prisma generate', true)

  if (result.success) {
    addResult('Prisma Generate', 'pass', 'Client generated')
    return true
  } else {
    addResult('Prisma Generate', 'fail', 'Generation failed')
    return false
  }
}

async function checkUserExists() {
  log('\n👥 Checking for existing users...')

  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()

  try {
    const count = await prisma.user.count()
    await prisma.$disconnect()

    if (count > 0) {
      addResult('User Accounts', 'pass', `${count} user(s) exist`)
      return true
    } else {
      addResult('User Accounts', 'warn', 'No users - register at /register')
      return false
    }
  } catch (error: any) {
    await prisma.$disconnect()
    addResult('User Accounts', 'fail', 'Cannot check users')
    return false
  }
}

async function runBuild() {
  log('\n🏗️ Running build verification...')

  const result = runCommand('npm run build 2>&1 | tail -20', true)

  if (result.output.includes('Compiled successfully') || result.output.includes('✓ Compiled')) {
    addResult('Build', 'pass', 'Compiles successfully')
    return true
  } else {
    addResult('Build', 'warn', 'Build may have issues')
    return false
  }
}

async function printSummary() {
  log('\n')
  log('═══════════════════════════════════════════════════════════════')
  log('                    DEPLOYMENT FIX SUMMARY')
  log('═══════════════════════════════════════════════════════════════')

  const passed = results.filter(r => r.status === 'pass').length
  const failed = results.filter(r => r.status === 'fail').length
  const warned = results.filter(r => r.status === 'warn').length

  log(`  ✅ Passed:   ${passed}`)
  log(`  ⚠️ Warnings: ${warned}`)
  log(`  ❌ Failed:   ${failed}`)
  log('')

  if (failed > 0) {
    log('  🔴 STATUS: FIXES REQUIRED')
    log('')
    log('  Failed checks:')
    results.filter(r => r.status === 'fail').forEach(r => {
      log(`    - ${r.name}: ${r.message}`)
    })
    log('')
    log('  Actions needed:')

    if (results.find(r => r.name === 'DATABASE_URL' && r.status === 'fail')) {
      log('    1. Add DATABASE_URL to Vercel environment variables')
    }
    if (results.find(r => r.name === 'NEXTAUTH_SECRET' && r.status === 'fail')) {
      log('    2. Add NEXTAUTH_SECRET (run: openssl rand -base64 32)')
    }
    if (results.find(r => r.name === 'Database Connection' && r.status === 'fail')) {
      log('    3. Check DATABASE_URL is correct')
      log('       - Verify Supabase password')
      log('       - Ensure database is not paused')
    }
    if (results.find(r => r.name === 'Database Tables' && r.status === 'fail')) {
      log('    4. Run: npm run db:push (or apply migrations in Supabase)')
    }
  } else if (warned > 0) {
    log('  🟡 STATUS: MOSTLY READY (some warnings)')
    log('')

    if (results.find(r => r.name === 'User Accounts' && r.status === 'warn')) {
      log('  📝 Next step: Register your first user at /register')
    }

    results.filter(r => r.status === 'warn').forEach(r => {
      if (r.name.includes('STRIPE')) {
        log(`  💳 Optional: Add ${r.name} for donation features`)
      }
    })
  } else {
    log('  🟢 STATUS: ALL CHECKS PASSED!')
    log('')
    log('  Your deployment should be working.')
    log('  Try signing in at your production URL.')
  }

  log('')
  log('═══════════════════════════════════════════════════════════════')
}

async function main() {
  log('═══════════════════════════════════════════════════════════════')
  log('       SAGA CRM - Automated Deployment Fix')
  log('═══════════════════════════════════════════════════════════════')

  // Load .env.local if exists
  const dotenv = await import('dotenv')
  dotenv.config({ path: '.env.local' })
  dotenv.config({ path: '.env' })

  // Run all checks
  const envOk = await checkEnvVariables()

  if (!process.env.DATABASE_URL) {
    log('\n❌ Cannot proceed without DATABASE_URL')
    log('   Please set up environment variables first.')
    await printSummary()
    process.exit(1)
  }

  const dbConnected = await checkDatabaseConnection()

  if (!dbConnected) {
    log('\n❌ Cannot connect to database')
    log('   Please check your DATABASE_URL and try again.')
    await printSummary()
    process.exit(1)
  }

  const tablesExist = await checkDatabaseTables()

  if (!tablesExist) {
    log('\n🔧 Tables missing - running migrations...')
    await runMigrations()
    // Re-check
    await checkDatabaseTables()
  }

  await generatePrismaClient()
  await checkUserExists()

  // Print summary
  await printSummary()

  const failed = results.filter(r => r.status === 'fail').length
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
