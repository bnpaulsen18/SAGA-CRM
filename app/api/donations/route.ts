import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendAutomatedThankYou } from '@/lib/email/send-donation-receipt';

// GET /api/donations - List all donations for the user's organization
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const donations = await prisma.donation.findMany({
      where: {
        organizationId: session.user.organizationId,
      },
      include: {
        contact: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        campaign: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        donatedAt: 'desc',
      },
    });

    return NextResponse.json(donations);
  } catch (error) {
    console.error('GET /api/donations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}

// POST /api/donations - Create a new donation
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      contactId,
      amount,
      fundRestriction,
      method,
      type,
      campaignId,
      transactionId,
      notes,
      donatedAt,
    } = body;

    // Validation
    if (!contactId || !amount) {
      return NextResponse.json(
        { error: 'Contact and amount are required' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Verify the contact belongs to the user's organization
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact || contact.organizationId !== session.user.organizationId) {
      return NextResponse.json(
        { error: 'Contact not found or access denied' },
        { status: 403 }
      );
    }

    // Generate a unique receipt number (simple version: ORG-YYYYMMDD-RANDOM)
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const receiptNumber = `${session.user.organizationId.substring(0, 4)}-${dateStr}-${randomStr}`;

    // Create the donation
    const donation = await prisma.donation.create({
      data: {
        organizationId: session.user.organizationId,
        contactId,
        amount: parseFloat(amount),
        currency: 'USD',
        type: type || 'ONE_TIME',
        method: method || 'CREDIT_CARD',
        status: 'COMPLETED',
        fundRestriction: fundRestriction || 'UNRESTRICTED',
        campaignId: campaignId || null,
        transactionId: transactionId || null,
        notes: notes || null,
        receiptNumber,
        taxDeductible: true,
        donatedAt: donatedAt ? new Date(donatedAt) : new Date(),
      },
      include: {
        contact: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        campaign: {
          select: {
            name: true,
          },
        },
      },
    });

    // Send automated thank-you email with AI-generated message (async, don't wait)
    sendAutomatedThankYou(donation.id).catch(error => {
      console.error('Failed to send automated thank-you email:', error);
      // Don't fail the request if email fails
    });

    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    console.error('POST /api/donations error:', error);
    return NextResponse.json(
      { error: 'Failed to create donation' },
      { status: 500 }
    );
  }
}
