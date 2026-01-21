import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/onboarding/status
 * Get current onboarding status and progress
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user?.organizationId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const organization = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
      select: {
        id: true,
        name: true,
        ein: true,
        email: true,
        phone: true,
        website: true,
        missionStatement: true,
        primaryProgram: true,
        onboardingCompleted: true,
        onboardingStep: true,
        subscriptionTier: true,
        stripeConnectStatus: true,
        stripeConnectAccountId: true,
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      onboardingCompleted: organization.onboardingCompleted,
      onboardingStep: organization.onboardingStep,
      organization,
    });
  } catch (error) {
    console.error('[Onboarding Status] Error:', error);
    return NextResponse.json(
      { error: 'Failed to load onboarding status' },
      { status: 500 }
    );
  }
}
