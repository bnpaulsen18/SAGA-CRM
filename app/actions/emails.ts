'use server'

import { sendDonationReceipt } from '@/lib/email/send-donation-receipt'
import { requireAuth } from '@/lib/permissions'

export async function resendDonationReceipt(donationId: string, recipientEmail?: string) {
  try {
    // Verify authentication
    await requireAuth()

    const result = await sendDonationReceipt({ donationId, recipientEmail })

    if (result.success) {
      return {
        success: true,
        message: `Receipt sent successfully to ${recipientEmail || 'donor email'}`,
        receiptNumber: result.receiptNumber
      }
    } else {
      return {
        success: false,
        error: result.error || 'Failed to send receipt'
      }
    }
  } catch (error) {
    console.error('Resend receipt action error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to resend receipt'
    }
  }
}
