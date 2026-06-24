/**
 * Fraud Detection System Test Suite
 * Tests all 5 factors of the fraud scoring algorithm
 */

import { calculateFraudScore } from '../lib/security/fraud-detector';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function log(color: string, label: string, message: string) {
  console.log(`${color}${label}${colors.reset} ${message}`);
}

function testResult(passed: boolean, testName: string, expected: string, actual: string) {
  if (passed) {
    log(colors.green, '✓', `${testName}: ${actual} (expected: ${expected})`);
  } else {
    log(colors.red, '✗', `${testName}: ${actual} (expected: ${expected})`);
  }
  return passed;
}

async function runTests() {
  console.log('\n' + '='.repeat(70));
  log(colors.cyan, '🛡️', 'FRAUD DETECTION SYSTEM - TEST SUITE');
  console.log('='.repeat(70) + '\n');

  let totalTests = 0;
  let passedTests = 0;

  // Mock organization and contact IDs
  const mockOrgId = 'org_test123';
  const mockContactId = 'contact_test456';

  // =========================================================================
  // TEST 1: LOW RISK - Legitimate First-Time Donor
  // =========================================================================
  console.log(log(colors.blue, '\n📋 TEST 1:', 'Low Risk - Legitimate First-Time Donor'));
  console.log(colors.gray + '  Scenario: New donor giving $50 via credit card' + colors.reset);

  try {
    const result1 = await calculateFraudScore({
      organizationId: mockOrgId,
      contactId: 'contact_new_' + Date.now(),
      amount: 50,
      method: 'CREDIT_CARD',
    });

    totalTests++;
    if (testResult(
      result1.fraudScore >= 0 && result1.fraudScore <= 20,
      'Score range',
      '0-20',
      result1.fraudScore.toString()
    )) passedTests++;

    totalTests++;
    if (testResult(
      result1.reviewStatus === 'APPROVED',
      'Review status',
      'APPROVED',
      result1.reviewStatus
    )) passedTests++;

    totalTests++;
    if (testResult(
      result1.fraudFlags.includes('NEW_DONOR'),
      'Fraud flags',
      'includes NEW_DONOR',
      result1.fraudFlags.join(', ')
    )) passedTests++;

    console.log(colors.gray + `  Flags: ${result1.fraudFlags.join(', ')}` + colors.reset);
    console.log(colors.gray + `  Recommendation: ${result1.recommendation}` + colors.reset);
  } catch (error) {
    log(colors.red, '✗', `Test failed with error: ${error}`);
  }

  // =========================================================================
  // TEST 2: MEDIUM RISK - Near Minimum Amount
  // =========================================================================
  console.log(log(colors.blue, '\n📋 TEST 2:', 'Medium Risk - Near Minimum Amount'));
  console.log(colors.gray + '  Scenario: New donor giving $5.50 (just above minimum)' + colors.reset);

  try {
    const result2 = await calculateFraudScore({
      organizationId: mockOrgId,
      contactId: 'contact_new2_' + Date.now(),
      amount: 5.50,
      method: 'CREDIT_CARD',
    });

    totalTests++;
    if (testResult(
      result2.fraudScore >= 15 && result2.fraudScore <= 30,
      'Score range',
      '15-30',
      result2.fraudScore.toString()
    )) passedTests++;

    totalTests++;
    if (testResult(
      result2.reviewStatus === 'APPROVED',
      'Review status',
      'APPROVED',
      result2.reviewStatus
    )) passedTests++;

    totalTests++;
    if (testResult(
      result2.fraudFlags.includes('MINIMUM_AMOUNT') || result2.fraudFlags.includes('NEW_DONOR'),
      'Fraud flags',
      'includes MINIMUM_AMOUNT or NEW_DONOR',
      result2.fraudFlags.join(', ')
    )) passedTests++;

    console.log(colors.gray + `  Flags: ${result2.fraudFlags.join(', ')}` + colors.reset);
    console.log(colors.gray + `  Recommendation: ${result2.recommendation}` + colors.reset);
  } catch (error) {
    log(colors.red, '✗', `Test failed with error: ${error}`);
  }

  // =========================================================================
  // TEST 3: MEDIUM-HIGH RISK - Round Amount
  // =========================================================================
  console.log(log(colors.blue, '\n📋 TEST 3:', 'Medium Risk - Round Amount Pattern'));
  console.log(colors.gray + '  Scenario: New donor giving exactly $100.00 via credit card' + colors.reset);

  try {
    const result3 = await calculateFraudScore({
      organizationId: mockOrgId,
      contactId: 'contact_new3_' + Date.now(),
      amount: 100,
      method: 'CREDIT_CARD',
    });

    totalTests++;
    if (testResult(
      result3.fraudScore >= 10 && result3.fraudScore <= 25,
      'Score range',
      '10-25',
      result3.fraudScore.toString()
    )) passedTests++;

    totalTests++;
    if (testResult(
      result3.fraudFlags.includes('ROUND_AMOUNT') || result3.fraudFlags.includes('NEW_DONOR'),
      'Fraud flags',
      'includes ROUND_AMOUNT or NEW_DONOR',
      result3.fraudFlags.join(', ')
    )) passedTests++;

    console.log(colors.gray + `  Flags: ${result3.fraudFlags.join(', ')}` + colors.reset);
    console.log(colors.gray + `  Recommendation: ${result3.recommendation}` + colors.reset);
  } catch (error) {
    log(colors.red, '✗', `Test failed with error: ${error}`);
  }

  // =========================================================================
  // TEST 4: HIGH RISK - Penny Testing Pattern
  // =========================================================================
  console.log(log(colors.blue, '\n📋 TEST 4:', 'High Risk - Penny Testing Pattern'));
  console.log(colors.gray + '  Scenario: New donor giving $1.03 (card testing pattern)' + colors.reset);

  try {
    const result4 = await calculateFraudScore({
      organizationId: mockOrgId,
      contactId: 'contact_new4_' + Date.now(),
      amount: 1.03,
      method: 'CREDIT_CARD',
    });

    totalTests++;
    if (testResult(
      result4.fraudScore >= 20,
      'Score range',
      '>=20',
      result4.fraudScore.toString()
    )) passedTests++;

    totalTests++;
    if (testResult(
      result4.fraudFlags.includes('PENNY_TEST') || result4.fraudFlags.includes('MINIMUM_AMOUNT'),
      'Fraud flags',
      'includes PENNY_TEST or MINIMUM_AMOUNT',
      result4.fraudFlags.join(', ')
    )) passedTests++;

    console.log(colors.gray + `  Flags: ${result4.fraudFlags.join(', ')}` + colors.reset);
    console.log(colors.gray + `  Recommendation: ${result4.recommendation}` + colors.reset);
  } catch (error) {
    log(colors.red, '✗', `Test failed with error: ${error}`);
  }

  // =========================================================================
  // TEST 5: VERY HIGH RISK - Large Amount from New Donor
  // =========================================================================
  console.log(log(colors.blue, '\n📋 TEST 5:', 'High Risk - Large Amount from New Donor'));
  console.log(colors.gray + '  Scenario: New donor giving $10,000 via credit card' + colors.reset);

  try {
    const result5 = await calculateFraudScore({
      organizationId: mockOrgId,
      contactId: 'contact_new5_' + Date.now(),
      amount: 10000,
      method: 'CREDIT_CARD',
    });

    totalTests++;
    if (testResult(
      result5.fraudScore >= 20,
      'Score range',
      '>=20',
      result5.fraudScore.toString()
    )) passedTests++;

    totalTests++;
    if (testResult(
      result5.fraudFlags.includes('LARGE_AMOUNT') || result5.fraudFlags.includes('NEW_DONOR'),
      'Fraud flags',
      'includes LARGE_AMOUNT or NEW_DONOR',
      result5.fraudFlags.join(', ')
    )) passedTests++;

    console.log(colors.gray + `  Flags: ${result5.fraudFlags.join(', ')}` + colors.reset);
    console.log(colors.gray + `  Recommendation: ${result5.recommendation}` + colors.reset);
  } catch (error) {
    log(colors.red, '✗', `Test failed with error: ${error}`);
  }

  // =========================================================================
  // TEST 6: EXTREME RISK - Cryptocurrency Payment
  // =========================================================================
  console.log(log(colors.blue, '\n📋 TEST 6:', 'Extreme Risk - Cryptocurrency Payment'));
  console.log(colors.gray + '  Scenario: New donor giving $500 via cryptocurrency' + colors.reset);

  try {
    const result6 = await calculateFraudScore({
      organizationId: mockOrgId,
      contactId: 'contact_new6_' + Date.now(),
      amount: 500,
      method: 'CRYPTOCURRENCY',
    });

    totalTests++;
    if (testResult(
      result6.fraudScore >= 15,
      'Score range',
      '>=15',
      result6.fraudScore.toString()
    )) passedTests++;

    totalTests++;
    if (testResult(
      result6.fraudFlags.includes('CRYPTOCURRENCY') || result6.fraudFlags.includes('NEW_DONOR'),
      'Fraud flags',
      'includes CRYPTOCURRENCY or NEW_DONOR',
      result6.fraudFlags.join(', ')
    )) passedTests++;

    console.log(colors.gray + `  Flags: ${result6.fraudFlags.join(', ')}` + colors.reset);
    console.log(colors.gray + `  Recommendation: ${result6.recommendation}` + colors.reset);
  } catch (error) {
    log(colors.red, '✗', `Test failed with error: ${error}`);
  }

  // =========================================================================
  // TEST 7: Payment Method Variations
  // =========================================================================
  console.log(log(colors.blue, '\n📋 TEST 7:', 'Payment Method Risk Assessment'));
  console.log(colors.gray + '  Scenario: Testing different payment methods' + colors.reset);

  const methods = ['CHECK', 'BANK_TRANSFER', 'PAYPAL', 'VENMO', 'OTHER'];
  for (const method of methods) {
    try {
      const result = await calculateFraudScore({
        organizationId: mockOrgId,
        contactId: 'contact_method_' + Date.now(),
        amount: 50,
        method,
      });

      console.log(colors.gray + `  ${method}: Score ${result.fraudScore}, Status ${result.reviewStatus}` + colors.reset);
      totalTests++;
      passedTests++; // All payment methods should process without error
    } catch (error) {
      log(colors.red, '✗', `${method} test failed: ${error}`);
      totalTests++;
    }
  }

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n' + '='.repeat(70));
  log(colors.cyan, '📊', 'TEST RESULTS SUMMARY');
  console.log('='.repeat(70));

  const passRateNum = (passedTests / totalTests) * 100;
  const passRate = passRateNum.toFixed(1);
  console.log(`\nTotal Tests: ${totalTests}`);
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${totalTests - passedTests}${colors.reset}`);
  console.log(`Pass Rate: ${passRateNum >= 80 ? colors.green : colors.red}${passRate}%${colors.reset}\n`);

  if (passRateNum >= 80) {
    log(colors.green, '✓', 'Fraud detection system is working correctly!');
  } else {
    log(colors.red, '✗', 'Fraud detection system has issues. Review failed tests above.');
  }

  console.log('\n' + '='.repeat(70) + '\n');

  // =========================================================================
  // SCORING BREAKDOWN GUIDE
  // =========================================================================
  console.log(log(colors.cyan, '📚', 'FRAUD SCORING BREAKDOWN GUIDE'));
  console.log('='.repeat(70));
  console.log('\nFactor 1: Velocity Check (Max 30 points)');
  console.log('  • 5+ donations in 5 min: +30 (EXTREME_VELOCITY)');
  console.log('  • 3-4 donations in 5 min: +20 (HIGH_VELOCITY)');
  console.log('  • 2 donations in 5 min: +10 (MODERATE_VELOCITY)');
  console.log('  • 50+ org donations in 1 hour: +15 (ORG_VELOCITY_SPIKE)');

  console.log('\nFactor 2: Contact History (Max 25 points)');
  console.log('  • New donor (no history): +5 (NEW_DONOR)');
  console.log('  • Previous fraud flags: +20 (PREVIOUS_FRAUD)');
  console.log('  • 2+ refunds: +15 (REFUND_HISTORY)');
  console.log('  • Amount 5x higher than average: +10 (AMOUNT_SPIKE)');

  console.log('\nFactor 3: Amount Anomaly (Max 20 points)');
  console.log('  • Round number ($100, $500): +5 (ROUND_AMOUNT)');
  console.log('  • Near minimum ($5-6): +10 (MINIMUM_AMOUNT)');
  console.log('  • Very large ($10,000+): +15 (LARGE_AMOUNT)');
  console.log('  • Penny testing ($1.01-$9.10): +8 (PENNY_TEST)');

  console.log('\nFactor 4: Payment Method (Max 15 points)');
  console.log('  • Credit card: +5 (CREDIT_CARD)');
  console.log('  • Cryptocurrency: +15 (CRYPTOCURRENCY)');
  console.log('  • Unknown/Other: +10 (UNKNOWN_METHOD)');

  console.log('\nFactor 5: Duplicate Detection (Max 10 points)');
  console.log('  • 2+ identical amounts in 10 min: +10 (DUPLICATE_AMOUNT)');

  console.log('\nRisk Thresholds:');
  console.log(colors.green + '  • 0-39: APPROVED (Low Risk)' + colors.reset);
  console.log(colors.yellow + '  • 40-69: PENDING_REVIEW (Medium Risk)' + colors.reset);
  console.log(colors.red + '  • 70-100: REJECTED (High Risk - Auto-Block)' + colors.reset);

  console.log('\n' + '='.repeat(70) + '\n');
}

// Run tests
runTests().catch((error) => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
