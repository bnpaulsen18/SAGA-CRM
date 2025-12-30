'use server'

import { render } from '@react-email/components'
import { resend, FROM_EMAIL } from './client'
import DonationReceiptEmail from './templates/DonationReceiptEmail'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import { requireAuth } from '@/lib/permissions'
import { generateThankYouMessage } from '@/lib/ai/receipt-generator'

interface SendDonationReceiptParams {
  donationId: string
  recipientEmail?: string // Optional override, defaults to contact's email
}

export async function sendDonationReceipt({ donationId, recipientEmail }: SendDonationReceiptParams) {
  try {
    // Verify authentication
    const session = await requireAuth()
    const prisma = await getPrismaWithRLS()

    // Fetch donation with organization and contact details
    const donation = await prisma.donation.findFirst({
      where: {
        id: donationId,
        organizationId: session.user.organizationId || undefined
      },
      include: {
        contact: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        campaign: {
          select: {
            name: true
          }
        },
        organization: {
          select: {
            name: true,
            ein: true
          }
        }
      }
    })

    if (!donation) {
      return {
        success: false,
        error: 'Donation not found'
      }
    }

    // Use provided email or default to contact's email
    const toEmail = recipientEmail || donation.contact.email

    // Generate receipt number (format: ORG-YEAR-DONATION_ID)
    const receiptNumber = `${donation.organizationId.slice(0, 4).toUpperCase()}-${new Date(donation.donatedAt).getFullYear()}-${donation.id.slice(-8).toUpperCase()}`

    // Generate AI-powered thank-you message
    let aiThankYouMessage: string | undefined
    try {
      aiThankYouMessage = await generateThankYouMessage(
        {
          amount: donation.amount,
          fundRestriction: donation.fundRestriction,
          donationDate: donation.donatedAt
        },
        {
          firstName: donation.contact.firstName,
          lastName: donation.contact.lastName
        },
        donation.organization.name
      )
    } catch (error) {
      console.error('Failed to generate AI thank-you message:', error)
      // Continue without AI message if generation fails
    }

    // Render email HTML
    const emailHtml = await render(
      DonationReceiptEmail({
        donorName: `${donation.contact.firstName} ${donation.contact.lastName}`,
        amount: donation.amount,
        date: new Date(donation.donatedAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }),
        organizationName: donation.organization.name,
        taxId: donation.organization.ein || 'XX-XXXXXXX',
        receiptNumber,
        method: donation.method.replace('_', ' '),
        fundRestriction: donation.fundRestriction,
        campaign: donation.campaign?.name,
        aiThankYouMessage
      })
    )

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `Thank you for your donation - ${donation.organization.name}`,
      html: emailHtml,
    })

    if (error) {
      console.error('Resend API error:', error)
      return {
        success: false,
        error: error.message || 'Failed to send email'
      }
    }

    // Log email delivery (temporarily disabled until migration completes)
    // await prisma.emailLog.create({
    //   data: {
    //     organizationId: session.user.organizationId!,
    //     donationId: donation.id,
    //     contactId: donation.contactId,
    //     to: toEmail,
    //     subject: `Thank you for your donation - ${donation.organization.name}`,
    //     sentAt: new Date(),
    //     status: 'SENT',
    //     messageId: data?.id || null
    //   }
    // })

    return {
      success: true,
      messageId: data?.id,
      receiptNumber
    }
  } catch (error) {
    console.error('Error sending donation receipt:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send receipt'
    }
  }
}

/**
 * Send automated thank-you email when a donation is created
 */
export async function sendAutomatedThankYou(donationId: string) {
  try {
    // Check if auto-send is enabled (could be org setting)
    const result = await sendDonationReceipt({ donationId })

    if (result.success) {
      console.log(`Automated thank-you sent for donation ${donationId}`)
    } else {
      console.warn(`Failed to send automated thank-you: ${result.error}`)
    }

    return result
  } catch (error) {
    console.error('Automated thank-you error:', error)
    return {
      success: false,
      error: 'Automated email failed'
    }
  }
}
