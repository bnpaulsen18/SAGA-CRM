import { generateText } from './client';
import { promptTemplates, SYSTEM_PROMPTS } from './prompts';

/**
 * Donation receipt information
 */
export interface DonationReceiptData {
  donorName: string;
  amount: number;
  fundName: string;
  organizationName: string;
  previousDonations: number;
  donationDate: Date;
  reference?: string;
}

/**
 * Generate a personalized thank you message for a donation receipt
 * @param donation - Donation details
 * @param contact - Contact details
 * @returns AI-generated personalized thank you message
 */
export async function generateThankYouMessage(
  donation: {
    amount: number;
    fundRestriction: string;
    donationDate: Date;
    reference?: string;
  },
  contact: {
    firstName: string;
    lastName: string;
    totalDonations?: number;
  },
  organizationName: string
): Promise<string> {
  const donorName = `${contact.firstName} ${contact.lastName}`;
  const previousDonations = contact.totalDonations || 0;

  const prompt = promptTemplates.thankYouMessage({
    donorName,
    amount: donation.amount,
    fundName: donation.fundRestriction,
    organizationName,
    previousDonations,
  });

  try {
    const message = await generateText(prompt, SYSTEM_PROMPTS.DONOR_COMMUNICATION);
    return message.trim();
  } catch (error) {
    console.error('Thank you message generation error:', error);
    // Return a fallback message on error
    return generateFallbackThankYou(donorName, donation.amount, organizationName, previousDonations);
  }
}

/**
 * Fallback thank you message when AI generation fails
 */
function generateFallbackThankYou(
  donorName: string,
  amount: number,
  organizationName: string,
  previousDonations: number
): string {
  const isReturningDonor = previousDonations > 0;

  if (isReturningDonor) {
    return `Dear ${donorName},

Thank you for your generous gift of $${amount.toFixed(2)}. Your continued support makes a real difference in our mission at ${organizationName}. We are deeply grateful for your partnership and commitment to our cause.`;
  } else {
    return `Dear ${donorName},

Thank you for your generous gift of $${amount.toFixed(2)}. We are honored that you have chosen to support ${organizationName}. Your contribution will help us continue our important work and make a meaningful impact.`;
  }
}

/**
 * Generate acknowledgment letter for major gifts
 * @param receiptData - Full donation receipt information
 * @param impactStory - Optional impact story to include
 * @returns Formatted acknowledgment letter
 */
export async function generateMajorGiftAcknowledgment(
  receiptData: DonationReceiptData,
  impactStory?: string
): Promise<string> {
  const isReturningDonor = receiptData.previousDonations > 0;

  const prompt = `
Write a warm, professional acknowledgment letter for a major gift donation to a nonprofit organization.

Donor: ${receiptData.donorName}
Gift Amount: $${receiptData.amount.toFixed(2)}
Fund/Program: ${receiptData.fundName}
Organization: ${receiptData.organizationName}
Returning Donor: ${isReturningDonor ? 'Yes' : 'No'}
${isReturningDonor ? `Total Previous Support: $${receiptData.previousDonations.toFixed(2)}` : ''}
${impactStory ? `Impact Story: ${impactStory}` : ''}

The letter should:
- Express genuine gratitude (3-4 paragraphs)
- Acknowledge the significance of this gift
- Describe the specific impact it will have on ${receiptData.fundName}
- ${isReturningDonor ? 'Recognize their ongoing partnership and loyalty' : 'Welcome them to the donor family'}
- Be warm and personal, not overly formal
- Be 250-350 words

Format as a complete letter with proper greeting and closing.
  `;

  try {
    const letter = await generateText(prompt, SYSTEM_PROMPTS.DONOR_COMMUNICATION, 1500);
    return letter.trim();
  } catch (error) {
    console.error('Major gift acknowledgment generation error:', error);
    return generateFallbackMajorGiftLetter(receiptData, isReturningDonor);
  }
}

/**
 * Fallback major gift letter when AI generation fails
 */
function generateFallbackMajorGiftLetter(
  receiptData: DonationReceiptData,
  isReturningDonor: boolean
): string {
  return `Dear ${receiptData.donorName},

On behalf of everyone at ${receiptData.organizationName}, I want to express our deepest gratitude for your generous gift of $${receiptData.amount.toFixed(2)} to support ${receiptData.fundName}.

${isReturningDonor
    ? `Your continued partnership has been instrumental in our success, and this gift represents a total of $${(receiptData.previousDonations + receiptData.amount).toFixed(2)} in support of our mission. Your loyalty and commitment inspire us every day.`
    : `We are honored that you have chosen to invest in our mission with such a meaningful contribution. Your support will enable us to expand our reach and deepen our impact.`
}

Your gift will directly support ${receiptData.fundName}, allowing us to continue our vital work in the community. The impact of your generosity will be felt for years to come.

Thank you again for your incredible support. We look forward to keeping you updated on the difference your gift is making.

With deep gratitude,

${receiptData.organizationName}`;
}

/**
 * Generate tax receipt footer text
 * @param organizationName - Name of the nonprofit
 * @param ein - Tax ID number
 * @returns Formatted tax receipt disclaimer
 */
export function generateTaxReceiptFooter(
  organizationName: string,
  ein: string
): string {
  return `${organizationName} is a tax-exempt organization under Section 501(c)(3) of the Internal Revenue Code.
Tax ID: ${ein}

No goods or services were provided in exchange for this contribution. This letter serves as your official tax receipt.
Please retain this for your records.

If you have any questions about your donation or this receipt, please contact us.`;
}

/**
 * Generate year-end giving summary message
 * @param donor - Donor information
 * @param yearTotal - Total donations for the year
 * @param donationCount - Number of donations made
 * @param organizationName - Organization name
 * @returns Personalized year-end summary message
 */
export async function generateYearEndSummary(
  donor: {
    firstName: string;
    lastName: string;
  },
  yearTotal: number,
  donationCount: number,
  organizationName: string
): Promise<string> {
  const donorName = `${donor.firstName} ${donor.lastName}`;

  const prompt = `
Write a warm year-end donation summary message for a nonprofit donor.

Donor: ${donorName}
Total Given This Year: $${yearTotal.toFixed(2)}
Number of Gifts: ${donationCount}
Organization: ${organizationName}

Create a 2-3 paragraph message that:
- Thanks them for their support throughout the year
- Highlights their total impact with the specific amount and gift count
- Connects their giving to real outcomes
- Expresses appreciation and hope for continued partnership
- Reminds them this serves as their tax receipt summary

Tone: Warm, grateful, inspiring
  `;

  try {
    const summary = await generateText(prompt, SYSTEM_PROMPTS.DONOR_COMMUNICATION, 1024);
    return summary.trim();
  } catch (error) {
    console.error('Year-end summary generation error:', error);
    return `Dear ${donorName},

As we close out another year, we want to take a moment to thank you for your incredible support of ${organizationName}.

Your ${donationCount} gift${donationCount > 1 ? 's' : ''} totaling $${yearTotal.toFixed(2)} this year have made a real difference in our mission. Your generosity has enabled us to continue our important work and expand our impact in the community.

We are deeply grateful for your partnership and look forward to continuing our work together in the coming year. This message serves as your year-end tax receipt summary.

With sincere appreciation,
${organizationName}`;
  }
}

/**
 * Determine appropriate receipt format based on donation amount
 * @param amount - Donation amount
 * @returns Receipt format recommendation
 */
export function determineReceiptFormat(amount: number): {
  format: 'standard' | 'enhanced' | 'major_gift';
  includeImpactStory: boolean;
  includePersonalNote: boolean;
} {
  if (amount >= 10000) {
    return {
      format: 'major_gift',
      includeImpactStory: true,
      includePersonalNote: true,
    };
  } else if (amount >= 1000) {
    return {
      format: 'enhanced',
      includeImpactStory: true,
      includePersonalNote: true,
    };
  } else {
    return {
      format: 'standard',
      includeImpactStory: amount >= 100,
      includePersonalNote: false,
    };
  }
}
