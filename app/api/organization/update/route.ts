import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * PATCH /api/organization/update
 * Update organization details
 */
export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.organizationId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();

    // Validate required fields
    if (!data.name || !data.ein || !data.email) {
      return NextResponse.json(
        { error: 'Name, EIN, and email are required' },
        { status: 400 }
      );
    }

    // Validate EIN format
    const einRegex = /^\d{2}-?\d{7}$/;
    if (!einRegex.test(data.ein)) {
      return NextResponse.json(
        { error: 'EIN must be in format XX-XXXXXXX or XXXXXXXXX' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if EIN is already taken by another organization
    const existingOrg = await prisma.organization.findFirst({
      where: {
        ein: data.ein,
        id: { not: session.user.organizationId },
      },
    });

    if (existingOrg) {
      return NextResponse.json(
        { error: 'An organization with this EIN already exists' },
        { status: 409 }
      );
    }

    // Update organization
    const organization = await prisma.organization.update({
      where: { id: session.user.organizationId },
      data: {
        name: data.name,
        ein: data.ein,
        email: data.email,
        phone: data.phone || null,
        website: data.website || null,
        missionStatement: data.missionStatement || null,
        primaryProgram: data.primaryProgram || null,
      },
    });

    return NextResponse.json({
      success: true,
      organization,
    });
  } catch (error) {
    console.error('[Organization Update] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update organization' },
      { status: 500 }
    );
  }
}
