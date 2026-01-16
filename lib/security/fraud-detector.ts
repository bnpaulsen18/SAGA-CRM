/**
 * Fraud Detection System
 * Calculates risk scores for donations based on multiple behavioral signals
 */

import { prisma } from '@/lib/prisma';

export interface FraudCheckResult {
  fraudScore: number; // 0-100 (0=safe, 100=definitely fraud)
  fraudFlags: string[];
  reviewStatus: 'APPROVED' | 'PENDING_REVIEW' | 'REJECTED';
  recommendation: string;
}

export interface DonationContext {
  organizationId: string;
  contactId: string;
  amount: number;
  method: string;
  userAgent?: string;
  ipAddress?: string;
}

/**
 * Calculate fraud risk score for a donation
 */
export async function calculateFraudScore(
  context: DonationContext
): Promise<FraudCheckResult> {
  let score = 0;
  const flags: string[] = [];

  // Factor 1: Velocity Check (30 points max)
  const velocityScore = await checkVelocity(context);
  score += velocityScore.score;
  flags.push(...velocityScore.flags);

  // Factor 2: Contact History (25 points max)
  const historyScore = await checkContactHistory(context);
  score += historyScore.score;
  flags.push(...historyScore.flags);

  // Factor 3: Amount Anomaly Detection (20 points max)
  const amountScore = checkAmountAnomaly(context);
  score += amountScore.score;
  flags.push(...amountScore.flags);

  // Factor 4: Payment Method Risk (15 points max)
  const methodScore = checkPaymentMethod(context);
  score += methodScore.score;
  flags.push(...methodScore.flags);

  // Factor 5: Duplicate Detection (10 points max)
  const duplicateScore = await checkDuplicates(context);
  score += duplicateScore.score;
  flags.push(...duplicateScore.flags);

  // Determine review status based on score
  let reviewStatus: 'APPROVED' | 'PENDING_REVIEW' | 'REJECTED';
  let recommendation: string;

  if (score >= 70) {
    reviewStatus = 'REJECTED';
    recommendation = 'HIGH RISK - Reject transaction and flag contact';
  } else if (score >= 40) {
    reviewStatus = 'PENDING_REVIEW';
    recommendation = 'MEDIUM RISK - Hold for manual review';
  } else {
    reviewStatus = 'APPROVED';
    recommendation = 'LOW RISK - Approve transaction';
  }

  return {
    fraudScore: Math.min(score, 100),
    fraudFlags: flags,
    reviewStatus,
    recommendation,
  };
}

/**
 * Factor 1: Check donation velocity (rapid submissions)
 */
async function checkVelocity(
  context: DonationContext
): Promise<{ score: number; flags: string[] }> {
  let score = 0;
  const flags: string[] = [];

  // Check donations in last 5 minutes
  const recentDonations = await prisma.donation.count({
    where: {
      organizationId: context.organizationId,
      contactId: context.contactId,
      createdAt: {
        gte: new Date(Date.now() - 5 * 60 * 1000),
      },
    },
  });

  if (recentDonations >= 5) {
    score += 30;
    flags.push(`EXTREME_VELOCITY: ${recentDonations} donations in 5 minutes`);
  } else if (recentDonations >= 3) {
    score += 20;
    flags.push(`HIGH_VELOCITY: ${recentDonations} donations in 5 minutes`);
  } else if (recentDonations >= 2) {
    score += 10;
    flags.push(`MODERATE_VELOCITY: ${recentDonations} donations in 5 minutes`);
  }

  // Check donations in last hour (org-wide)
  const orgRecentDonations = await prisma.donation.count({
    where: {
      organizationId: context.organizationId,
      createdAt: {
        gte: new Date(Date.now() - 60 * 60 * 1000),
      },
    },
  });

  if (orgRecentDonations >= 50) {
    score += 15;
    flags.push(`ORG_VELOCITY_SPIKE: ${orgRecentDonations} org donations in 1 hour`);
  }

  return { score, flags };
}

/**
 * Factor 2: Check contact donation history
 */
async function checkContactHistory(
  context: DonationContext
): Promise<{ score: number; flags: string[] }> {
  let score = 0;
  const flags: string[] = [];

  // Get contact's donation history
  const contactDonations = await prisma.donation.findMany({
    where: {
      contactId: context.contactId,
      status: 'COMPLETED',
    },
    orderBy: {
      donatedAt: 'desc',
    },
    take: 10,
  });

  // New donor (no history)
  if (contactDonations.length === 0) {
    score += 5;
    flags.push('NEW_DONOR: First time donor');
  }

  // Check for previous fraud flags
  const previousFraudFlags = contactDonations.filter(
    (d) => d.fraudScore && d.fraudScore > 40
  );
  if (previousFraudFlags.length > 0) {
    score += 20;
    flags.push(`PREVIOUS_FRAUD: ${previousFraudFlags.length} previous high-risk donations`);
  }

  // Check for refunds/chargebacks
  const refunds = contactDonations.filter((d) => d.status === 'REFUNDED');
  if (refunds.length >= 2) {
    score += 15;
    flags.push(`REFUND_HISTORY: ${refunds.length} previous refunds`);
  } else if (refunds.length === 1) {
    score += 5;
    flags.push('SINGLE_REFUND: 1 previous refund');
  }

  // Calculate average donation amount
  if (contactDonations.length >= 3) {
    const avgAmount =
      contactDonations.reduce((sum, d) => sum + d.amount, 0) / contactDonations.length;

    // Current donation is significantly higher than average (5x+)
    if (context.amount > avgAmount * 5) {
      score += 10;
      flags.push(
        `AMOUNT_SPIKE: $${context.amount} vs avg $${avgAmount.toFixed(2)}`
      );
    }
  }

  return { score, flags };
}

/**
 * Factor 3: Check for suspicious amounts
 */
function checkAmountAnomaly(context: DonationContext): {
  score: number;
  flags: string[];
} {
  let score = 0;
  const flags: string[] = [];

  // Exact round numbers are slightly suspicious (testing behavior)
  if (context.amount % 100 === 0 && context.amount <= 1000) {
    score += 5;
    flags.push(`ROUND_AMOUNT: Exact $${context.amount}`);
  }

  // Very small amounts (close to minimum)
  if (context.amount <= 6.0) {
    score += 10;
    flags.push(`MINIMUM_AMOUNT: $${context.amount} near minimum threshold`);
  }

  // Suspiciously large amounts for new donors
  if (context.amount >= 10000) {
    score += 15;
    flags.push(`LARGE_AMOUNT: $${context.amount} exceeds $10,000`);
  }

  // Penny-testing pattern (amounts like $1.01, $2.03)
  const cents = Math.round((context.amount % 1) * 100);
  if (cents > 0 && cents <= 10 && context.amount < 10) {
    score += 8;
    flags.push(`PENNY_TEST: $${context.amount} (possible card testing)`);
  }

  return { score, flags };
}

/**
 * Factor 4: Payment method risk assessment
 */
function checkPaymentMethod(context: DonationContext): {
  score: number;
  flags: string[];
} {
  let score = 0;
  const flags: string[] = [];

  // Credit cards are higher risk than other methods
  if (context.method === 'CREDIT_CARD') {
    score += 5;
    flags.push('CREDIT_CARD: Higher risk payment method');
  }

  // Cryptocurrency is very high risk
  if (context.method === 'CRYPTOCURRENCY') {
    score += 15;
    flags.push('CRYPTOCURRENCY: Very high risk payment method');
  }

  // 'OTHER' payment method is suspicious
  if (context.method === 'OTHER') {
    score += 10;
    flags.push('UNKNOWN_METHOD: Unspecified payment method');
  }

  return { score, flags };
}

/**
 * Factor 5: Check for duplicate submission attempts
 */
async function checkDuplicates(
  context: DonationContext
): Promise<{ score: number; flags: string[] }> {
  let score = 0;
  const flags: string[] = [];

  // Check for identical amounts in last 10 minutes
  const duplicateAmount = await prisma.donation.count({
    where: {
      organizationId: context.organizationId,
      contactId: context.contactId,
      amount: context.amount,
      createdAt: {
        gte: new Date(Date.now() - 10 * 60 * 1000),
      },
    },
  });

  if (duplicateAmount >= 2) {
    score += 10;
    flags.push(`DUPLICATE_AMOUNT: ${duplicateAmount} identical amounts in 10 min`);
  }

  return { score, flags };
}

/**
 * Get fraud statistics for an organization
 */
export async function getFraudStats(organizationId: string) {
  const [
    totalDonations,
    flaggedDonations,
    pendingReview,
    rejectedDonations,
    avgFraudScore,
  ] = await Promise.all([
    // Total donations
    prisma.donation.count({
      where: { organizationId },
    }),

    // Flagged (any fraud score > 0)
    prisma.donation.count({
      where: {
        organizationId,
        fraudScore: { gt: 0 },
      },
    }),

    // Pending review
    prisma.donation.count({
      where: {
        organizationId,
        reviewStatus: 'PENDING_REVIEW',
      },
    }),

    // Rejected
    prisma.donation.count({
      where: {
        organizationId,
        reviewStatus: 'REJECTED',
      },
    }),

    // Average fraud score
    prisma.donation.aggregate({
      where: { organizationId },
      _avg: { fraudScore: true },
    }),
  ]);

  return {
    totalDonations,
    flaggedDonations,
    pendingReview,
    rejectedDonations,
    avgFraudScore: avgFraudScore._avg.fraudScore || 0,
    flaggedPercentage:
      totalDonations > 0 ? (flaggedDonations / totalDonations) * 100 : 0,
  };
}

/**
 * Get high-risk donations for review
 */
export async function getHighRiskDonations(
  organizationId: string,
  limit: number = 50
) {
  return prisma.donation.findMany({
    where: {
      organizationId,
      reviewStatus: 'PENDING_REVIEW',
    },
    include: {
      contact: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: [{ fraudScore: 'desc' }, { createdAt: 'desc' }],
    take: limit,
  });
}
