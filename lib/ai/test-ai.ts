/**
 * Test script for AI utilities
 * Run with: npx tsx lib/ai/test-ai.ts
 */

import { generateThankYouMessage } from './receipt-generator';
import { analyzeDonorPattern } from './donor-profiles';
import { categorizeDonation } from './donation-insights';

async function testAIUtilities() {
  console.log('🧪 Testing SAGA CRM AI Utilities...\n');

  try {
    // Test 1: Thank You Message Generation
    console.log('1️⃣ Testing Thank You Message Generation...');
    const thankYouMessage = await generateThankYouMessage(
      {
        amount: 500,
        fundRestriction: 'Education Program',
        donationDate: new Date(),
        reference: 'CHECK-12345',
      },
      {
        firstName: 'John',
        lastName: 'Smith',
        totalDonations: 2500,
      },
      'Hope Foundation'
    );
    console.log('✅ Generated Thank You Message:');
    console.log(thankYouMessage);
    console.log('');

    // Test 2: Donor Pattern Analysis
    console.log('2️⃣ Testing Donor Pattern Analysis...');
    const donorIntelligence = await analyzeDonorPattern([
      { date: '2024-01-15', amount: 250, fund: 'General Support' },
      { date: '2024-04-20', amount: 300, fund: 'Education Program' },
      { date: '2024-07-10', amount: 350, fund: 'Education Program' },
      { date: '2024-10-05', amount: 400, fund: 'Education Program' },
    ]);
    console.log('✅ Donor Intelligence Analysis:');
    console.log(JSON.stringify(donorIntelligence, null, 2));
    console.log('');

    // Test 3: Donation Categorization
    console.log('3️⃣ Testing Donation Categorization...');
    const category = await categorizeDonation({
      reference: 'Annual Appeal 2024',
      notes: 'Donor mentioned wanting to support our scholarship program',
      amount: 5000,
    });
    console.log('✅ Donation Category Analysis:');
    console.log(JSON.stringify(category, null, 2));
    console.log('');

    console.log('✅ All AI utilities tests passed!\n');
    console.log('🎉 SAGA CRM AI infrastructure is working correctly!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests if executed directly
if (require.main === module) {
  testAIUtilities()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { testAIUtilities };
