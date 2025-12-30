/**
 * Verify and update platform admin password
 */

const bcrypt = require('bcryptjs');

// Get the password from command line or use default
const testPassword = process.argv[2] || 'SagaAdmin2024!';

console.log('\n=== Platform Admin Password Verification ===\n');
console.log('Testing password:', testPassword);
console.log('\n1. Generating NEW hash for this password:\n');

// Generate a fresh hash
const newHash = bcrypt.hashSync(testPassword, 10);
console.log('New Hash:', newHash);

console.log('\n2. Testing if this hash works:\n');

// Test the hash
const isValid = bcrypt.compareSync(testPassword, newHash);
console.log('Hash verification:', isValid ? '✓ VALID' : '✗ INVALID');

console.log('\n3. Run this SQL in Supabase to update the password:\n');
console.log('UPDATE "users"');
console.log('SET password = \'' + newHash + '\'');
console.log('WHERE email = \'admin@saga-crm.com\';');
console.log('\n');

// Also test against the original hash we used
const originalHash = '$2b$10$4E1BanzX.bBUhUCgDLoqse95JoD2HB1AYQYkDWv/hCvQOHf.ycEM2';
console.log('4. Testing original hash we generated:\n');
console.log('Original Hash:', originalHash);
const originalIsValid = bcrypt.compareSync(testPassword, originalHash);
console.log('Original hash verification:', originalIsValid ? '✓ VALID' : '✗ INVALID');

console.log('\n');
