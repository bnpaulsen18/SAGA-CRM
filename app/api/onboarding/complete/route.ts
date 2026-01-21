import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/onboarding/complete
 * Mark onboarding as complete
 */
export async function POST() {
  try {
    const session = await auth();

    if (!session || !session.user?.organizationId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Mark onboarding as complete
    await prisma.organization.update({
      where: { id: session.user.organizationId },
      data: {
        onboardingCompleted: true,
        onboardingStep: 5,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
    });
  } catch (error) {
    console.error('[Onboarding Complete] Error:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}
