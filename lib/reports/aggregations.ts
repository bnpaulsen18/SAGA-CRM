'use server';

import { getPrismaWithRLS } from '@/lib/prisma-rls';
import { requireAuth } from '@/lib/permissions';

/**
 * Reports & Analytics Aggregation Functions
 * Provides reusable queries for dashboard and custom reports
 */

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface DonationTrend {
  date: string;
  amount: number;
  count: number;
}

export interface CampaignPerformance {
  id: string;
  name: string;
  goal: number;
  raised: number;
  donorCount: number;
  averageDonation: number;
  percentageComplete: number;
}

export interface FundBreakdown {
  fundRestriction: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface MethodDistribution {
  method: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface DonorRetentionData {
  period: string;
  newDonors: number;
  returningDonors: number;
  retentionRate: number;
}

/**
 * Get donation trends over time (grouped by day, week, or month)
 */
export async function getDonationTrends(
  dateRange: DateRange,
  groupBy: 'day' | 'week' | 'month' = 'day'
): Promise<DonationTrend[]> {
  const session = await requireAuth();
  const prisma = await getPrismaWithRLS();

  const donations = await prisma.donation.findMany({
    where: {
      organizationId: session.user.organizationId || undefined,
      donatedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
    },
    select: {
      amount: true,
      donatedAt: true,
    },
    orderBy: {
      donatedAt: 'asc',
    },
  });

  // Group donations by period
  const grouped = new Map<string, { amount: number; count: number }>();

  donations.forEach((donation) => {
    const date = new Date(donation.donatedAt);
    let key: string;

    switch (groupBy) {
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'day':
      default:
        key = date.toISOString().split('T')[0];
        break;
    }

    const existing = grouped.get(key) || { amount: 0, count: 0 };
    grouped.set(key, {
      amount: existing.amount + donation.amount,
      count: existing.count + 1,
    });
  });

  return Array.from(grouped.entries())
    .map(([date, data]) => ({
      date,
      amount: data.amount,
      count: data.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Get campaign performance metrics
 */
export async function getCampaignPerformance(
  dateRange?: DateRange
): Promise<CampaignPerformance[]> {
  const session = await requireAuth();
  const prisma = await getPrismaWithRLS();

  const campaigns = await prisma.campaign.findMany({
    where: {
      organizationId: session.user.organizationId || undefined,
      ...(dateRange && {
        createdAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      }),
    },
    include: {
      donations: {
        select: {
          amount: true,
          contactId: true,
        },
      },
    },
  });

  return campaigns.map((campaign) => {
    const raised = campaign.raised;
    const goal = campaign.goal || 0;
    const donorCount = new Set(campaign.donations.map(d => d.contactId)).size;
    const averageDonation = donorCount > 0 ? raised / donorCount : 0;
    const percentageComplete = goal > 0 ? (raised / goal) * 100 : 0;

    return {
      id: campaign.id,
      name: campaign.name,
      goal,
      raised,
      donorCount,
      averageDonation,
      percentageComplete,
    };
  });
}

/**
 * Get fund restriction breakdown
 */
export async function getFundBreakdown(dateRange: DateRange): Promise<FundBreakdown[]> {
  const session = await requireAuth();
  const prisma = await getPrismaWithRLS();

  const donations = await prisma.donation.groupBy({
    by: ['fundRestriction'],
    where: {
      organizationId: session.user.organizationId || undefined,
      donatedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
    },
    _sum: {
      amount: true,
    },
    _count: {
      id: true,
    },
  });

  const total = donations.reduce((sum, d) => sum + (d._sum.amount || 0), 0);

  return donations.map((d) => ({
    fundRestriction: d.fundRestriction,
    amount: d._sum.amount || 0,
    count: d._count.id,
    percentage: total > 0 ? ((d._sum.amount || 0) / total) * 100 : 0,
  }));
}

/**
 * Get payment method distribution
 */
export async function getMethodDistribution(dateRange: DateRange): Promise<MethodDistribution[]> {
  const session = await requireAuth();
  const prisma = await getPrismaWithRLS();

  const donations = await prisma.donation.groupBy({
    by: ['method'],
    where: {
      organizationId: session.user.organizationId || undefined,
      donatedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
    },
    _sum: {
      amount: true,
    },
    _count: {
      id: true,
    },
  });

  const total = donations.reduce((sum, d) => sum + (d._sum.amount || 0), 0);

  return donations.map((d) => ({
    method: d.method,
    amount: d._sum.amount || 0,
    count: d._count.id,
    percentage: total > 0 ? ((d._sum.amount || 0) / total) * 100 : 0,
  }));
}

/**
 * Get donor retention data (new vs returning donors by period)
 */
export async function getDonorRetention(
  dateRange: DateRange,
  groupBy: 'month' | 'quarter' = 'month'
): Promise<DonorRetentionData[]> {
  const session = await requireAuth();
  const prisma = await getPrismaWithRLS();

  // Get all donations with contact info
  const donations = await prisma.donation.findMany({
    where: {
      organizationId: session.user.organizationId || undefined,
      donatedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
    },
    select: {
      contactId: true,
      donatedAt: true,
    },
    orderBy: {
      donatedAt: 'asc',
    },
  });

  // Track first donation date for each donor
  const firstDonationDates = new Map<string, Date>();
  donations.forEach((d) => {
    const existing = firstDonationDates.get(d.contactId);
    const current = new Date(d.donatedAt);
    if (!existing || current < existing) {
      firstDonationDates.set(d.contactId, current);
    }
  });

  // Group by period and count new vs returning
  const grouped = new Map<string, { newDonors: Set<string>; returningDonors: Set<string> }>();

  donations.forEach((d) => {
    const date = new Date(d.donatedAt);
    let key: string;

    if (groupBy === 'quarter') {
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      key = `${date.getFullYear()}-Q${quarter}`;
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    if (!grouped.has(key)) {
      grouped.set(key, {
        newDonors: new Set(),
        returningDonors: new Set(),
      });
    }

    const data = grouped.get(key)!;
    const firstDonation = firstDonationDates.get(d.contactId)!;
    const firstDonationKey =
      groupBy === 'quarter'
        ? `${firstDonation.getFullYear()}-Q${Math.floor(firstDonation.getMonth() / 3) + 1}`
        : `${firstDonation.getFullYear()}-${String(firstDonation.getMonth() + 1).padStart(2, '0')}`;

    if (firstDonationKey === key) {
      data.newDonors.add(d.contactId);
    } else {
      data.returningDonors.add(d.contactId);
    }
  });

  return Array.from(grouped.entries())
    .map(([period, data]) => {
      const newCount = data.newDonors.size;
      const returningCount = data.returningDonors.size;
      const total = newCount + returningCount;
      const retentionRate = total > 0 ? (returningCount / total) * 100 : 0;

      return {
        period,
        newDonors: newCount,
        returningDonors: returningCount,
        retentionRate,
      };
    })
    .sort((a, b) => a.period.localeCompare(b.period));
}

/**
 * Get summary statistics for dashboard
 */
export async function getSummaryStats(dateRange: DateRange) {
  const session = await requireAuth();
  const prisma = await getPrismaWithRLS();

  const [donations, contacts, campaigns] = await Promise.all([
    prisma.donation.aggregate({
      where: {
        organizationId: session.user.organizationId || undefined,
        donatedAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
      _avg: {
        amount: true,
      },
    }),
    prisma.contact.count({
      where: {
        organizationId: session.user.organizationId || undefined,
        donations: {
          some: {
            donatedAt: {
              gte: dateRange.startDate,
              lte: dateRange.endDate,
            },
          },
        },
      },
    }),
    prisma.campaign.count({
      where: {
        organizationId: session.user.organizationId || undefined,
        status: 'ACTIVE',
      },
    }),
  ]);

  return {
    totalDonations: donations._sum.amount || 0,
    donationCount: donations._count.id,
    averageDonation: donations._avg.amount || 0,
    uniqueDonors: contacts,
    activeCampaigns: campaigns,
  };
}
