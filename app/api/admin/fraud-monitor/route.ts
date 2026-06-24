import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getFraudStats, getHighRiskDonations } from '@/lib/security/fraud-detector';

export const runtime = 'nodejs';

/**
 * GET /api/admin/fraud-monitor
 * Returns fraud statistics and high-risk donations for admin dashboard
 */
export async function GET(req: Request) {
  try {
    const session = await auth();

    // Check authentication
    if (!session || !session.user || !session.user.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can access fraud monitoring
    if (session.user.role !== 'ADMIN' && session.user.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const organizationId = session.user.organizationId;

    // Get fraud statistics
    const stats = await getFraudStats(organizationId);

    // Get high-risk donations pending review
    const highRiskDonations = await getHighRiskDonations(organizationId, 20);

    // Get recent fraud activity (last 24 hours)
    const recentFlaggedDonations = await prisma.donation.findMany({
      where: {
        organizationId,
        fraudScore: { gt: 0 },
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
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
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    // Get donations by review status
    const reviewStatusBreakdown = await prisma.donation.groupBy({
      by: ['reviewStatus'],
      where: {
        organizationId,
      },
      _count: true,
    });

    // Get top fraud flags
    const allFraudFlags = await prisma.donation.findMany({
      where: {
        organizationId,
        fraudScore: { gt: 0 },
      },
      select: {
        fraudFlags: true,
      },
    });

    // Count frequency of each flag
    const flagCounts: Record<string, number> = {};
    allFraudFlags.forEach((donation) => {
      donation.fraudFlags.forEach((flag) => {
        flagCounts[flag] = (flagCounts[flag] || 0) + 1;
      });
    });

    const topFlags = Object.entries(flagCounts)
      .map(([flag, count]) => ({ flag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get fraud score distribution
    const scoreDistribution = await prisma.donation.groupBy({
      by: ['fraudScore'],
      where: {
        organizationId,
        fraudScore: { gt: 0 },
      },
      _count: true,
    });

    // Group into buckets
    const scoreBuckets = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '61-80': 0,
      '81-100': 0,
    };

    scoreDistribution.forEach((item) => {
      const score = item.fraudScore || 0;
      if (score <= 20) scoreBuckets['0-20'] += item._count;
      else if (score <= 40) scoreBuckets['21-40'] += item._count;
      else if (score <= 60) scoreBuckets['41-60'] += item._count;
      else if (score <= 80) scoreBuckets['61-80'] += item._count;
      else scoreBuckets['81-100'] += item._count;
    });

    return NextResponse.json({
      stats,
      highRiskDonations,
      recentFlaggedDonations,
      reviewStatusBreakdown,
      topFlags,
      scoreBuckets,
    });
  } catch (error) {
    console.error('GET /api/admin/fraud-monitor error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fraud monitoring data' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/fraud-monitor/[donationId]
 * Update review status for a flagged donation
 */
export async function PATCH(req: Request) {
  try {
    const session = await auth();

    // Check authentication
    if (!session || !session.user || !session.user.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can update review status
    if (session.user.role !== 'ADMIN' && session.user.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { donationId, reviewStatus, notes } = body;

    if (!donationId || !reviewStatus) {
      return NextResponse.json(
        { error: 'donationId and reviewStatus are required' },
        { status: 400 }
      );
    }

    if (!['APPROVED', 'PENDING_REVIEW', 'REJECTED', 'REFUNDED'].includes(reviewStatus)) {
      return NextResponse.json({ error: 'Invalid reviewStatus' }, { status: 400 });
    }

    // Update donation review status
    const donation = await prisma.donation.update({
      where: {
        id: donationId,
        organizationId: session.user.organizationId, // Ensure same org
      },
      data: {
        reviewStatus,
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
        notes: notes ? `[REVIEW] ${notes}\n\n${notes || ''}` : undefined,
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
    });

    console.log('[Fraud Monitor] Review status updated:', {
      donationId,
      reviewStatus,
      reviewedBy: session.user.id,
      fraudScore: donation.fraudScore,
    });

    return NextResponse.json(donation);
  } catch (error) {
    console.error('PATCH /api/admin/fraud-monitor error:', error);
    return NextResponse.json(
      { error: 'Failed to update review status' },
      { status: 500 }
    );
  }
}
