import { NextResponse } from 'next/server';
import { generateDonationReceiptPDF } from '@/lib/pdf/generate-receipt';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Generate the PDF
    const pdfBuffer = await generateDonationReceiptPDF(id);

    // Return PDF with proper headers - use Response for binary data
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="donation-receipt-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('GET /api/donations/[id]/receipt error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate receipt' },
      { status: 500 }
    );
  }
}
