import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/campaigns/[id] - Get a single campaign
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session || !session.user || !session.user.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
      include: {
        _count: {
          select: {
            donations: true,
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('GET /api/campaigns/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}

// PUT /api/campaigns/[id] - Update a campaign
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session || !session.user || !session.user.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, goal, startDate, endDate, status } = body;

    // Validation
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    if (goal && goal <= 0) {
      return NextResponse.json(
        { error: 'Goal must be greater than 0' },
        { status: 400 }
      );
    }

    // Verify the campaign belongs to the user's organization
    const existingCampaign = await prisma.campaign.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
    });

    if (!existingCampaign) {
      return NextResponse.json(
        { error: 'Campaign not found or access denied' },
        { status: 404 }
      );
    }

    // Update the campaign
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        name,
        description,
        goal: goal ? parseFloat(goal) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'DRAFT',
      },
      include: {
        _count: {
          select: {
            donations: true,
          },
        },
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('PUT /api/campaigns/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

// DELETE /api/campaigns/[id] - Delete a campaign (soft delete)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session || !session.user || !session.user.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the campaign belongs to the user's organization
    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found or access denied' },
        { status: 404 }
      );
    }

    // Soft delete by setting status to CANCELLED
    await prisma.campaign.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });

    return NextResponse.json({ success: true, message: 'Campaign deleted' });
  } catch (error) {
    console.error('DELETE /api/campaigns/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}
