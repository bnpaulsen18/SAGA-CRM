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
 * Calculate donor engagement score (0-100)
 * @param params - Donor activity metrics
 * @returns Engagement score and interpretation
 */
export function calculateDonorEngagementScore(params: {
  donationCount: number;
  totalGiven: number;
  daysSinceLastGift: number;
  averageGiftTrend: 'increasing' | 'decreasing' | 'stable';
  emailOpens?: number;
  eventAttendance?: number;
}): {
  score: number;
  level: 'High' | 'Medium' | 'Low' | 'At Risk';
  recommendations: string[];
} {
  let score = 0;

  // Donation frequency (0-30 points)
  if (params.donationCount >= 12) score += 30;
  else if (params.donationCount >= 6) score += 25;
  else if (params.donationCount >= 3) score += 20;
  else if (params.donationCount >= 2) score += 15;
  else score += 10;

  // Recency (0-25 points)
  if (params.daysSinceLastGift <= 30) score += 25;
  else if (params.daysSinceLastGift <= 90) score += 20;
  else if (params.daysSinceLastGift <= 180) score += 15;
  else if (params.daysSinceLastGift <= 365) score += 10;
  else score += 5;

  // Total giving (0-20 points)
  if (params.totalGiven >= 10000) score += 20;
  else if (params.totalGiven >= 5000) score += 15;
  else if (params.totalGiven >= 1000) score += 10;
  else if (params.totalGiven >= 100) score += 5;

  // Gift trend (0-15 points)
  if (params.averageGiftTrend === 'increasing') score += 15;
  else if (params.averageGiftTrend === 'stable') score += 10;
  else score += 5;

  // Email engagement (0-10 points)
  if (params.emailOpens) {
    if (params.emailOpens >= 10) score += 10;
    else if (params.emailOpens >= 5) score += 7;
    else if (params.emailOpens >= 1) score += 4;
  }

  // Determine engagement level
  let level: 'High' | 'Medium' | 'Low' | 'At Risk';
  let recommendations: string[];

  if (score >= 80) {
    level = 'High';
    recommendations = [
      'Consider for major gift conversation',
      'Invite to exclusive events or leadership opportunities',
      'Request testimonial or case study participation',
    ];
  } else if (score >= 60) {
    level = 'Medium';
    recommendations = [
      'Send personalized updates on impact',
      'Invite to mid-level donor events',
      'Consider upgrade campaign targeting',
    ];
  } else if (score >= 40) {
    level = 'Low';
    recommendations = [
      'Re-engage with impact stories',
      'Survey to understand interests',
      'Provide multiple giving opportunities',
    ];
  } else {
    level = 'At Risk';
    recommendations = [
      'Urgent: Reach out to understand disengagement',
      'Send personalized "we miss you" message',
      'Offer feedback opportunity or survey',
    ];
  }

  return { score, level, recommendations };
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

/**
 * Identify major gift prospects from donor pool
 * @param donors - Array of donor profiles with giving history
 * @param majorGiftThreshold - Minimum amount to be considered major gift
 * @returns Ranked list of major gift prospects
 */
export function identifyMajorGiftProspects(
  donors: Array<{
    id: string;
    name: string;
    totalGiven: number;
    donationCount: number;
    averageGiftTrend: 'increasing' | 'decreasing' | 'stable';
    daysSinceLastGift: number;
  }>,
  majorGiftThreshold: number = 10000
): Array<{
  donor: typeof donors[0];
  score: number;
  reasons: string[];
}> {
  const prospects = donors
    .map(donor => {
      let score = 0;
      const reasons: string[] = [];

      // High total giving
      if (donor.totalGiven >= majorGiftThreshold) {
        score += 30;
        reasons.push(`Total giving exceeds $${majorGiftThreshold.toLocaleString()}`);
      } else if (donor.totalGiven >= majorGiftThreshold * 0.5) {
        score += 20;
        reasons.push(`Approaching major gift threshold`);
      }

      // Increasing gift trend
      if (donor.averageGiftTrend === 'increasing') {
        score += 25;
        reasons.push('Gifts are increasing over time');
      }

      // Consistent giving
      if (donor.donationCount >= 5) {
        score += 20;
        reasons.push('Loyal, consistent donor');
      }

      // Recent engagement
      if (donor.daysSinceLastGift <= 90) {
        score += 15;
        reasons.push('Recently engaged');
      }

      // High average gift
      const averageGift = donor.totalGiven / donor.donationCount;
      if (averageGift >= 1000) {
        score += 10;
        reasons.push(`High average gift: $${averageGift.toFixed(2)}`);
      }

      return { donor, score, reasons };
    })
    .filter(p => p.score >= 40) // Only include viable prospects
    .sort((a, b) => b.score - a.score); // Sort by score descending

  return prospects;
}

/**
 * Predict donor lapse risk
 * @param donor - Donor profile with giving history
 * @returns Risk assessment and retention recommendations
 */
export function predictDonorLapseRisk(donor: {
  daysSinceLastGift: number;
  typicalGivingFrequencyDays: number;
  averageGiftTrend: 'increasing' | 'decreasing' | 'stable';
  donationCount: number;
}): {
  riskLevel: 'High' | 'Medium' | 'Low';
  probability: number;
  retentionActions: string[];
} {
  let riskScore = 0;

  // Time since last gift vs typical frequency
  const daysPastDue = donor.daysSinceLastGift - donor.typicalGivingFrequencyDays;
  if (daysPastDue > 180) riskScore += 40;
  else if (daysPastDue > 90) riskScore += 30;
  else if (daysPastDue > 30) riskScore += 20;
  else if (daysPastDue > 0) riskScore += 10;

  // Gift trend
  if (donor.averageGiftTrend === 'decreasing') riskScore += 30;
  else if (donor.averageGiftTrend === 'stable') riskScore += 10;

  // Giving history
  if (donor.donationCount === 1) riskScore += 30; // One-time donors at higher risk
  else if (donor.donationCount < 3) riskScore += 20;

  let riskLevel: 'High' | 'Medium' | 'Low';
  let retentionActions: string[];

  if (riskScore >= 70) {
    riskLevel = 'High';
    retentionActions = [
      'URGENT: Personal phone call from development director',
      'Send "we miss you" personalized message',
      'Offer to discuss their philanthropic goals',
      'Request feedback on why they\'ve disengaged',
    ];
  } else if (riskScore >= 40) {
    riskLevel = 'Medium';
    retentionActions = [
      'Send personalized impact update',
      'Invite to exclusive event or webinar',
      'Share specific story related to their interests',
      'Gentle reminder of their past impact',
    ];
  } else {
    riskLevel = 'Low';
    retentionActions = [
      'Continue regular stewardship communications',
      'Include in general mailings and updates',
      'Maintain relationship without immediate ask',
    ];
  }

  const probability = Math.min(100, riskScore);

  return { riskLevel, probability, retentionActions };
}
