/**
 * Reusable AI prompt templates for SAGA CRM
 * These prompts are designed specifically for nonprofit fundraising and donor management
 */

export const SYSTEM_PROMPTS = {
  NONPROFIT_ASSISTANT:
    'You are a helpful assistant for nonprofit organizations. You understand fundraising, donor relations, and the unique challenges nonprofits face.',

  FUNDRAISING_EXPERT:
    'You are a nonprofit fundraising expert with deep knowledge of donor psychology, campaign strategy, and best practices for nonprofit development.',

  DONOR_COMMUNICATION:
    'You are writing on behalf of a nonprofit organization. Your tone is warm, grateful, and mission-focused. You understand the importance of genuine donor relationships.',

  DATA_ANALYST:
    'You are a nonprofit fundraising analyst. You provide actionable insights based on donation data, donor behavior patterns, and campaign performance metrics.',
};

export const promptTemplates = {
  /**
   * Generate a personalized thank you message for a donation receipt
   */
  thankYouMessage: (params: {
    donorName: string;
    amount: number;
    fundName: string;
    organizationName: string;
    previousDonations: number;
  }) => `
Generate a warm, personalized thank-you message for a nonprofit donation receipt.

Donor: ${params.donorName}
Donation Amount: $${params.amount.toFixed(2)}
Fund/Program: ${params.fundName}
Organization: ${params.organizationName}
Previous Total Donations: $${params.previousDonations.toFixed(2)}

Create a 2-3 sentence message that:
- Thanks the donor warmly and specifically
- Mentions the impact of their contribution to ${params.fundName}
- Feels personal and genuine, not templated
- Uses their name naturally
- Acknowledges if they are a returning donor (previous donations > 0)

Keep it concise, heartfelt, and mission-focused.
  `,

  /**
   * Analyze a donor's giving pattern and provide insights
   */
  donorIntelligence: (donations: Array<{
    date: string;
    amount: number;
    fund: string;
  }>) => `
Analyze this donor's giving pattern and provide actionable insights:

Donation History:
${JSON.stringify(donations, null, 2)}

Provide insights in the following JSON format:
{
  "givingFrequency": "one-time" | "monthly" | "quarterly" | "seasonal" | "irregular",
  "averageGiftTrend": "increasing" | "decreasing" | "stable",
  "preferredCauses": ["fund name 1", "fund name 2"],
  "bestTimeToAsk": "description of optimal timing based on pattern",
  "suggestedAskAmount": number,
  "insights": ["key insight 1", "key insight 2", "key insight 3"]
}

Be specific and actionable in your recommendations.
  `,

  /**
   * Analyze campaign performance and suggest optimizations
   */
  campaignAnalysis: (params: {
    goalAmount: number;
    raisedAmount: number;
    donationCount: number;
    averageGift: number;
    daysRemaining: number | null;
  }) => `
Analyze this fundraising campaign and provide strategic recommendations:

Campaign Goal: $${params.goalAmount.toFixed(2)}
Amount Raised: $${params.raisedAmount.toFixed(2)}
Progress: ${((params.raisedAmount / params.goalAmount) * 100).toFixed(1)}%
Number of Donations: ${params.donationCount}
Average Gift: $${params.averageGift.toFixed(2)}
Time Remaining: ${params.daysRemaining ? `${params.daysRemaining} days` : 'No deadline set'}

Provide analysis in JSON format:
{
  "goalLikelihood": number (0-100, % chance of reaching goal),
  "recommendedActions": ["action 1", "action 2", "action 3"],
  "targetSegments": ["segment description 1", "segment description 2"],
  "optimalAskAmounts": {
    "major": number,
    "mid": number,
    "standard": number
  },
  "emailSubjectLines": ["subject 1", "subject 2", "subject 3"],
  "keyInsights": ["insight 1", "insight 2"]
}

Be specific, actionable, and realistic in recommendations.
  `,

  /**
   * Categorize a donation automatically
   */
  donationCategorization: (params: {
    reference: string;
    notes?: string;
    amount: number;
  }) => `
Categorize this donation based on available information:

Reference/Check Number: ${params.reference}
Amount: $${params.amount.toFixed(2)}
Notes: ${params.notes || 'None provided'}

Analyze and return JSON:
{
  "fundRestriction": "UNRESTRICTED" | "PROGRAM_RESTRICTED" | "CAPITAL" | "ENDOWMENT" | "OTHER",
  "likelyMotivation": "ANNUAL_GIVING" | "EVENT" | "MAJOR_GIFT" | "PLANNED_GIVING" | "MEMORIAL" | "HONOR" | "GENERAL_SUPPORT",
  "acknowledgmentPriority": "HIGH" | "MEDIUM" | "LOW",
  "reasoning": "brief explanation of categorization"
}
  `,

  /**
   * Generate email copy for donor communication
   */
  donorEmailDraft: (params: {
    purpose: 'thank_you' | 'ask' | 'update' | 'event_invite';
    donorName: string;
    donorHistory: string;
    organizationName: string;
    specificDetails?: string;
  }) => `
Write a compelling email to a nonprofit donor:

Purpose: ${params.purpose.replace('_', ' ')}
Donor Name: ${params.donorName}
Donor History: ${params.donorHistory}
Organization: ${params.organizationName}
Additional Context: ${params.specificDetails || 'General communication'}

Create:
1. Three subject line options (compelling, personal, test-worthy)
2. Email body (150-250 words, warm tone, mission-focused)
3. Clear call-to-action

Return as JSON:
{
  "subjectLines": ["option 1", "option 2", "option 3"],
  "emailBody": "full email text with paragraphs",
  "callToAction": "specific action you want donor to take"
}

Tone: Warm, grateful, mission-focused, genuine
Avoid: Corporate jargon, guilt-tripping, overly formal language
  `,

  /**
   * Generate executive summary for reporting
   */
  executiveSummary: (params: {
    dateRange: { start: string; end: string };
    totalRaised: number;
    donorCount: number;
    averageGift: number;
    newDonors: number;
    topFunds: Array<{ name: string; amount: number }>;
  }) => `
Generate an executive summary for a nonprofit's fundraising performance:

Reporting Period: ${params.dateRange.start} to ${params.dateRange.end}
Total Raised: $${params.totalRaised.toFixed(2)}
Unique Donors: ${params.donorCount}
Average Gift: $${params.averageGift.toFixed(2)}
New Donors: ${params.newDonors}

Top Performing Funds:
${params.topFunds.map(f => `- ${f.name}: $${f.amount.toFixed(2)}`).join('\n')}

Provide a concise executive summary in markdown format with:
1. Key Highlights (3-4 bullet points of notable achievements)
2. Areas of Concern (if any, or note "None identified")
3. Recommendations for Next Quarter (3-4 specific, actionable items)
4. Donor Retention Insights (patterns and recommendations)

Format for nonprofit board presentation. Be specific and data-driven.
  `,
};

/**
 * Helper to build a prompt with context
 */
export function buildPromptWithContext(
  template: string,
  additionalContext?: string
): string {
  if (!additionalContext) return template;
  return `${template}\n\nAdditional Context:\n${additionalContext}`;
}
