import { generateJSON, generateText } from './client';
import { promptTemplates, SYSTEM_PROMPTS } from './prompts';

/**
 * Campaign performance analysis result
 */
export interface CampaignAnalysis {
  goalLikelihood: number;
  recommendedActions: string[];
  targetSegments: string[];
  optimalAskAmounts: {
    major: number;
    mid: number;
    standard: number;
  };
  emailSubjectLines: string[];
  keyInsights: string[];
}

/**
 * Donation categorization result
 */
export interface DonationCategory {
  fundRestriction: 'UNRESTRICTED' | 'PROGRAM_RESTRICTED' | 'CAPITAL' | 'ENDOWMENT' | 'OTHER';
  likelyMotivation: 'ANNUAL_GIVING' | 'EVENT' | 'MAJOR_GIFT' | 'PLANNED_GIVING' | 'MEMORIAL' | 'HONOR' | 'GENERAL_SUPPORT';
  acknowledgmentPriority: 'HIGH' | 'MEDIUM' | 'LOW';
  reasoning: string;
}

/**
 * Analyze campaign performance and provide strategic recommendations
 * @param campaign - Campaign details including goal, raised amount, donations
 * @param donations - Array of donations for the campaign
 * @returns AI-generated campaign analysis with actionable insights
 */
export async function analyzeCampaignPerformance(campaign: {
  goalAmount: number;
  raisedAmount: number;
  donations: Array<{ amount: number }>;
  endDate?: Date | null;
}): Promise<CampaignAnalysis> {
  const donationCount = campaign.donations.length;
  const raisedAmount = campaign.donations.reduce((sum, d) => sum + d.amount, 0);
  const averageGift = donationCount > 0 ? raisedAmount / donationCount : 0;

  const daysRemaining = campaign.endDate
    ? Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const prompt = promptTemplates.campaignAnalysis({
    goalAmount: campaign.goalAmount,
    raisedAmount,
    donationCount,
    averageGift,
    daysRemaining,
  });

  try {
    const analysis = await generateJSON<CampaignAnalysis>(
      prompt,
      SYSTEM_PROMPTS.FUNDRAISING_EXPERT
    );
    return analysis;
  } catch (error) {
    console.error('Campaign analysis error:', error);
    // Return default analysis on error
    return {
      goalLikelihood: 50,
      recommendedActions: ['Review campaign strategy', 'Analyze donor engagement'],
      targetSegments: ['Previous donors', 'New prospects'],
      optimalAskAmounts: {
        major: Math.round(campaign.goalAmount * 0.1),
        mid: Math.round(campaign.goalAmount * 0.05),
        standard: Math.round(campaign.goalAmount * 0.01),
      },
      emailSubjectLines: ['Support our mission', 'Make an impact today', 'Join us in making a difference'],
      keyInsights: ['Unable to generate detailed insights at this time'],
    };
  }
}

/**
 * Automatically categorize a donation based on reference and notes
 * @param donation - Donation details including reference, notes, and amount
 * @returns AI-generated categorization
 */
export async function categorizeDonation(donation: {
  reference: string;
  notes?: string;
  amount: number;
}): Promise<DonationCategory> {
  const prompt = promptTemplates.donationCategorization({
    reference: donation.reference,
    notes: donation.notes,
    amount: donation.amount,
  });

  try {
    const category = await generateJSON<DonationCategory>(
      prompt,
      SYSTEM_PROMPTS.DATA_ANALYST
    );
    return category;
  } catch (error) {
    console.error('Donation categorization error:', error);
    // Return default categorization on error
    return {
      fundRestriction: 'UNRESTRICTED',
      likelyMotivation: 'GENERAL_SUPPORT',
      acknowledgmentPriority: donation.amount >= 1000 ? 'HIGH' : 'MEDIUM',
      reasoning: 'Default categorization applied due to analysis error',
    };
  }
}

/**
 * Generate executive summary for fundraising performance
 * @param params - Date range and performance metrics
 * @returns Markdown-formatted executive summary
 */
export async function generateExecutiveSummary(params: {
  dateRange: { start: Date; end: Date };
  totalRaised: number;
  donorCount: number;
  averageGift: number;
  newDonors: number;
  topFunds: Array<{ name: string; amount: number }>;
}): Promise<string> {
  const prompt = promptTemplates.executiveSummary({
    dateRange: {
      start: params.dateRange.start.toLocaleDateString(),
      end: params.dateRange.end.toLocaleDateString(),
    },
    totalRaised: params.totalRaised,
    donorCount: params.donorCount,
    averageGift: params.averageGift,
    newDonors: params.newDonors,
    topFunds: params.topFunds,
  });

  try {
    const summary = await generateText(prompt, SYSTEM_PROMPTS.DATA_ANALYST, 2048);
    return summary;
  } catch (error) {
    console.error('Executive summary generation error:', error);
    return `# Executive Summary

## Key Highlights
- Total raised: $${params.totalRaised.toFixed(2)}
- Unique donors: ${params.donorCount}
- Average gift: $${params.averageGift.toFixed(2)}
- New donors: ${params.newDonors}

Unable to generate detailed analysis at this time.`;
  }
}

/**
 * Analyze giving trends over time periods
 * @param donations - Historical donation data
 * @returns Trend analysis with insights
 */
export async function analyzeGivingTrends(donations: Array<{
  date: Date;
  amount: number;
  fund: string;
}>): Promise<{
  trend: 'increasing' | 'decreasing' | 'stable';
  seasonalPatterns: string[];
  insights: string[];
}> {
  // Group donations by month
  const monthlyData: { [key: string]: number } = {};
  donations.forEach(d => {
    const monthKey = `${d.date.getFullYear()}-${String(d.date.getMonth() + 1).padStart(2, '0')}`;
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + d.amount;
  });

  const prompt = `
Analyze this monthly giving data and identify trends:

Monthly Totals:
${JSON.stringify(monthlyData, null, 2)}

Total Donations: ${donations.length}

Return JSON:
{
  "trend": "increasing" | "decreasing" | "stable",
  "seasonalPatterns": ["pattern description 1", "pattern description 2"],
  "insights": ["insight 1", "insight 2", "insight 3"]
}

Identify seasonal giving patterns (e.g., year-end, spring, etc.) and provide actionable insights.
  `;

  try {
    const analysis = await generateJSON<{
      trend: 'increasing' | 'decreasing' | 'stable';
      seasonalPatterns: string[];
      insights: string[];
    }>(prompt, SYSTEM_PROMPTS.DATA_ANALYST);
    return analysis;
  } catch (error) {
    console.error('Trend analysis error:', error);
    return {
      trend: 'stable',
      seasonalPatterns: ['Unable to identify patterns at this time'],
      insights: ['Insufficient data for trend analysis'],
    };
  }
}
