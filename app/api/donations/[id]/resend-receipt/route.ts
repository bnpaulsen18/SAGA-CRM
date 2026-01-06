import { NextResponse } from 'next/server';
import { sendDonationReceipt } from '@/lib/email/send-donation-receipt';

export const runtime = 'nodejs'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Send the receipt
    const result = await sendDonationReceipt({ donationId: id });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send receipt' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Receipt sent successfully',
      receiptNumber: result.receiptNumber,
    });
  } catch (error) {
    console.error('POST /api/donations/[id]/resend-receipt error:', error);
    return NextResponse.json(
      { error: 'Failed to resend receipt' },
      { status: 500 }
    );
  }
}
