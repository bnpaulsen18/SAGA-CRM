/**
 * Generate bcrypt password hash for platform admin user
 *
 * Usage:
 *   node scripts/generate-password-hash.js "YourPassword123!"
 *
 * The output hash can be used in create-platform-admin.sql
 */

const bcrypt = require('bcryptjs');

// Get password from command line argument
const password = process.argv[2];

if (!password) {
  console.error('Error: Please provide a password as an argument');
  console.log('\nUsage:');
  console.log('  node scripts/generate-password-hash.js "YourPassword123!"');
  process.exit(1);
}

// Generate hash with salt rounds of 10 (same as used in registration)
const hash = bcrypt.hashSync(password, 10);

console.log('\n✓ Password hash generated successfully!\n');
console.log('Copy this hash and use it in create-platform-admin.sql:\n');
console.log(hash);
console.log('\n');
