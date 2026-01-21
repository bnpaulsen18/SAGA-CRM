import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/onboarding/update
 * Update onboarding progress
 */
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.organizationId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { step, data } = await req.json();

    // Validate step number
    if (typeof step !== 'number' || step < 0 || step > 5) {
      return NextResponse.json(
        { error: 'Invalid step number' },
        { status: 400 }
      );
    }

    // Update onboarding step
    await prisma.organization.update({
      where: { id: session.user.organizationId },
      data: {
        onboardingStep: step,
      },
    });

    return NextResponse.json({
      success: true,
      step,
    });
  } catch (error) {
    console.error('[Onboarding Update] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update onboarding progress' },
      { status: 500 }
    );
  }
}
