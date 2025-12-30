'use server';

import { renderToBuffer } from '@react-pdf/renderer';
import DonationReceiptPDF from './donation-receipt';
import { getPrismaWithRLS } from '@/lib/prisma-rls';
import { requireAuth } from '@/lib/permissions';
import { generateThankYouMessage } from '@/lib/ai/receipt-generator';

/**
 * Generate a PDF receipt for a donation
 * @param donationId - The ID of the donation
 * @returns PDF buffer
 */
export async function generateDonationReceiptPDF(donationId: string): Promise<Buffer> {
  try {
    // Verify authentication
    const session = await requireAuth();
    const prisma = await getPrismaWithRLS();

    // Fetch donation with all related data
    const donation = await prisma.donation.findFirst({
      where: {
        id: donationId,
        organizationId: session.user.organizationId || undefined,
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
        organization: {
          select: {
            name: true,
            ein: true,
          },
        },
      },
    });

    if (!donation) {
      throw new Error('Donation not found');
    }

    // Generate receipt number
    const receiptNumber = `${donation.organizationId
      .slice(0, 4)
      .toUpperCase()}-${new Date(donation.donatedAt).getFullYear()}-${donation.id
      .slice(-8)
      .toUpperCase()}`;

    // Generate AI thank-you message
    let thankYouMessage: string;
    try {
      thankYouMessage = await generateThankYouMessage(
        {
          amount: donation.amount,
          fundRestriction: donation.fundRestriction,
          donationDate: donation.donatedAt,
        },
        {
          firstName: donation.contact.firstName,
          lastName: donation.contact.lastName,
        },
        donation.organization.name
      );
    } catch (error) {
      console.error('Failed to generate AI thank-you message:', error);
      // Fallback message if AI generation fails
      thankYouMessage = `Thank you for your generous donation of $${donation.amount.toLocaleString()}. Your support makes a meaningful impact on our mission and the communities we serve.`;
    }

    // Render PDF
    const pdf = DonationReceiptPDF({
      receiptNumber,
      donationId: donation.id,
      amount: donation.amount,
      donationDate: new Date(donation.donatedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      paymentMethod: donation.method.replace(/_/g, ' '),
      fundRestriction: donation.fundRestriction,
      campaignName: donation.campaign?.name,
      donorName: `${donation.contact.firstName} ${donation.contact.lastName}`,
      donorEmail: donation.contact.email,
      organizationName: donation.organization.name,
      organizationEin: donation.organization.ein || 'XX-XXXXXXX',
      thankYouMessage,
    });

    // Convert to buffer
    const pdfBuffer = await renderToBuffer(pdf);
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF receipt:', error);
    throw error;
  }
}
