import { generateJSON } from './client';
import { promptTemplates, SYSTEM_PROMPTS } from './prompts';

/**
 * Donor intelligence analysis result
 */
export interface DonorIntelligence {
  givingFrequency: 'one-time' | 'monthly' | 'quarterly' | 'seasonal' | 'irregular';
  averageGiftTrend: 'increasing' | 'decreasing' | 'stable';
  preferredCauses: string[];
  bestTimeToAsk: string;
  suggestedAskAmount: number;
  insights: string[];
}

/**
 * Email draft for donor communication
 */
export interface DonorEmailDraft {
  subjectLines: string[];
  emailBody: string;
  callToAction: string;
}

/**
 * Analyze a donor's giving pattern and provide actionable insights
 * @param donations - Array of donor's historical donations
 * @returns AI-generated donor intelligence profile
 */
export async function analyzeDonorPattern(donations: Array<{
  date: string | Date;
  amount: number;
  fund: string;
}>): Promise<DonorIntelligence> {
  // Ensure dates are formatted as strings
  const formattedDonations = donations.map(d => ({
    date: typeof d.date === 'string' ? d.date : d.date.toISOString(),
    amount: d.amount,
    fund: d.fund,
  }));

  const prompt = promptTemplates.donorIntelligence(formattedDonations);

  try {
    const intelligence = await generateJSON<DonorIntelligence>(
      prompt,
      SYSTEM_PROMPTS.FUNDRAISING_EXPERT
    );
    return intelligence;
  } catch (error) {
    console.error('Donor pattern analysis error:', error);
    // Return default analysis on error
    const totalGiven = donations.reduce((sum, d) => sum + d.amount, 0);
    const averageGift = totalGiven / donations.length;

    return {
      givingFrequency: donations.length === 1 ? 'one-time' : 'irregular',
      averageGiftTrend: 'stable',
      preferredCauses: Array.from(new Set(donations.map(d => d.fund))),
      bestTimeToAsk: 'Based on historical data, consider reaching out during their typical giving season',
      suggestedAskAmount: Math.round(averageGift * 1.2),
      insights: [
        `Total contributions: $${totalGiven.toFixed(2)}`,
        `Average gift: $${averageGift.toFixed(2)}`,
        'Unable to generate detailed insights at this time'
      ],
    };
  }
}

/**
 * Generate AI-assisted email draft for donor communication
 * @param params - Email context and donor information
 * @returns AI-generated email draft with multiple subject line options
 */
export async function generateDonorEmail(params: {
  purpose: 'thank_you' | 'ask' | 'update' | 'event_invite';
  donorName: string;
  donorHistory: string;
  organizationName: string;
  specificDetails?: string;
}): Promise<DonorEmailDraft> {
  const prompt = promptTemplates.donorEmailDraft(params);

  try {
    const draft = await generateJSON<DonorEmailDraft>(
      prompt,
      SYSTEM_PROMPTS.DONOR_COMMUNICATION
    );
    return draft;
  } catch (error) {
    console.error('Email draft generation error:', error);
    // Return default email template on error
    return {
      subjectLines: [
        `Thank you, ${params.donorName}!`,
        `${params.organizationName} Update for ${params.donorName}`,
        `Making a Difference Together`,
      ],
      emailBody: `Dear ${params.donorName},

Thank you for your continued support of ${params.organizationName}. Your generosity makes a real difference in our mission.

${params.specificDetails || 'We wanted to reach out and share an update on our work.'}

We're grateful to have you as part of our community.

Warm regards,
${params.organizationName} Team`,
      callToAction: 'Consider making your next gift to support our mission',
    };
  }
}
