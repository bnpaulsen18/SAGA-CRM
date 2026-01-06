import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateThankYouMessage } from '@/lib/ai/receipt-generator';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs'

// POST /api/ai/receipt-message - Generate AI thank-you message
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { contactFirstName, contactLastName, amount, fundRestriction } = body;

    // Validation
    if (!contactFirstName || !contactLastName || !amount) {
      return NextResponse.json(
        { error: 'Contact name and amount are required' },
        { status: 400 }
      );
    }

    // Get organization name
    const organization = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
      select: { name: true },
    });

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // For preview, we don't have total donations yet, so set to 0
    // In the actual donation creation, we'd fetch this from the contact
    const totalDonations = 0;

    // Generate the AI thank-you message
    const message = await generateThankYouMessage(
      {
        amount: parseFloat(amount),
        fundRestriction: fundRestriction || 'General Support',
        donationDate: new Date(),
      },
      {
        firstName: contactFirstName,
        lastName: contactLastName,
        totalDonations,
      },
      organization.name
    );

    return NextResponse.json({ message });
  } catch (error) {
    console.error('POST /api/ai/receipt-message error:', error);
    return NextResponse.json(
      { error: 'Failed to generate thank-you message' },
      { status: 500 }
    );
  }
}
