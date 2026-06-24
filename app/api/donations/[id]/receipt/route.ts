import { NextResponse } from 'next/server';
import { generateDonationReceiptPDF } from '@/lib/pdf/generate-receipt';
import { auth } from '@/lib/auth';
import { canViewDonation } from '@/lib/permissions';

export const runtime = 'nodejs'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Require an authenticated user who owns this donation's org.
    // Prevents leaking donor PII (name, email, amount, EIN) via guessed IDs.
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!(await canViewDonation(id))) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Generate the PDF
    const pdfBuffer = await generateDonationReceiptPDF(id);

    // Return PDF with proper headers - convert Buffer to Uint8Array for Next.js 16
    return new Response(new Uint8Array(pdfBuffer), {
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
