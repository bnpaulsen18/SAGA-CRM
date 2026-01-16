import { NextRequest, NextResponse } from 'next/server'
import { render } from '@react-email/components'
import { resend, isResendAvailable, FROM_EMAIL } from '@/lib/email/client'
import CampaignEmail from '@/lib/email/templates/CampaignEmail'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import { requireAuth } from '@/lib/permissions'

type SegmentType = 'ALL' | 'DONORS' | 'MONTHLY_DONORS' | 'RECENT_DONORS' | 'MAJOR_DONORS'

interface SendCampaignRequest {
  subject: string
  body: string
  segment: SegmentType
  previewText?: string
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await requireAuth()
    const prisma = await getPrismaWithRLS()

    // Check if Resend is available
    if (!resend || !isResendAvailable) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      )
    }

    // Parse request body
    const { subject, body, segment, previewText }: SendCampaignRequest = await request.json()

    // Validation
    if (!subject?.trim() || !body?.trim()) {
      return NextResponse.json(
        { error: 'Subject and body are required' },
        { status: 400 }
      )
    }

    // Get organization details
    const organization = await prisma.organization.findFirst({
      where: { id: session.user.organizationId || undefined },
      select: { id: true, name: true }
    })

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Get contacts based on segment
    const contacts = await getContactsBySegment(prisma, organization.id, segment)

    if (contacts.length === 0) {
      return NextResponse.json(
        { error: 'No recipients found for this segment' },
        { status: 400 }
      )
    }

    // Create Email record in database
    const emailRecord = await prisma.email.create({
      data: {
        organizationId: organization.id,
        subject,
        body,
        from: FROM_EMAIL,
        status: 'SENDING',
        tags: [segment]
      }
    })

    // Send emails in batches (50 at a time with 1 second delay between batches)
    const BATCH_SIZE = 50
    let successCount = 0
    let failureCount = 0

    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
      const batch = contacts.slice(i, i + BATCH_SIZE)

      // Send batch concurrently
      const results = await Promise.allSettled(
        batch.map(async (contact: { id: string; email: string; firstName: string; lastName: string }) => {
          try {
            // Render email HTML
            const emailHtml = await render(
              CampaignEmail({
                subject,
                previewText,
                body,
                recipientName: `${contact.firstName} ${contact.lastName}`,
                organizationName: organization.name,
                unsubscribeUrl: `${process.env.NEXTAUTH_URL}/newsletter/unsubscribe?email=${encodeURIComponent(contact.email)}`
              })
            )

            // Send via Resend
            if (!resend) {
              throw new Error('Resend client not initialized')
            }

            const { error } = await resend.emails.send({
              from: FROM_EMAIL,
              to: contact.email,
              subject,
              html: emailHtml
            })

            if (error) {
              throw error
            }

            // Create EmailRecipient record
            await prisma.emailRecipient.create({
              data: {
                emailId: emailRecord.id,
                contactId: contact.id,
                sent: true,
                sentAt: new Date()
              }
            })

            return { success: true, contactId: contact.id }
          } catch (error) {
            console.error(`Failed to send to ${contact.email}:`, error)

            // Create failed EmailRecipient record
            await prisma.emailRecipient.create({
              data: {
                emailId: emailRecord.id,
                contactId: contact.id,
                sent: false
              }
            })

            return { success: false, contactId: contact.id, error }
          }
        })
      )

      // Count successes and failures
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value.success) {
          successCount++
        } else {
          failureCount++
        }
      })

      // Rate limiting: Wait 1 second between batches (except for the last batch)
      if (i + BATCH_SIZE < contacts.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    // Update Email record status
    await prisma.email.update({
      where: { id: emailRecord.id },
      data: {
        status: failureCount === 0 ? 'SENT' : failureCount < contacts.length ? 'SENT' : 'FAILED',
        sentAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      emailId: emailRecord.id,
      totalRecipients: contacts.length,
      successCount,
      failureCount
    })
  } catch (error) {
    console.error('Send campaign error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send campaign' },
      { status: 500 }
    )
  }
}

/**
 * Get contacts based on segment criteria
 */
async function getContactsBySegment(
  prisma: any,
  organizationId: string,
  segment: SegmentType
) {
  const baseQuery = {
    organizationId,
    status: 'ACTIVE' as const
  }

  switch (segment) {
    case 'ALL':
      return prisma.contact.findMany({
        where: baseQuery,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true
        }
      })

    case 'DONORS':
      // Contacts who have made at least one donation
      return prisma.contact.findMany({
        where: {
          ...baseQuery,
          donations: {
            some: {
              status: 'COMPLETED'
            }
          }
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true
        }
      })

    case 'MONTHLY_DONORS':
      // Contacts with monthly recurring donations
      return prisma.contact.findMany({
        where: {
          ...baseQuery,
          donations: {
            some: {
              status: 'COMPLETED',
              type: 'MONTHLY'
            }
          }
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true
        },
        distinct: ['email']
      })

    case 'RECENT_DONORS':
      // Contacts who donated in the last 90 days
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

      return prisma.contact.findMany({
        where: {
          ...baseQuery,
          donations: {
            some: {
              status: 'COMPLETED',
              donatedAt: {
                gte: ninetyDaysAgo
              }
            }
          }
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true
        },
        distinct: ['email']
      })

    case 'MAJOR_DONORS':
      // Contacts with total lifetime donations >= $1000
      // Note: This requires aggregation, so we'll fetch all donors and filter
      const allDonors = await prisma.contact.findMany({
        where: {
          ...baseQuery,
          donations: {
            some: {
              status: 'COMPLETED'
            }
          }
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          donations: {
            where: {
              status: 'COMPLETED'
            },
            select: {
              amount: true
            }
          }
        }
      })

      // Filter to only major donors ($1000+ lifetime)
      return allDonors
        .filter((donor: any) => {
          const totalDonated = donor.donations.reduce((sum: number, d: any) => sum + d.amount, 0)
          return totalDonated >= 1000
        })
        .map(({ donations, ...contact }: any) => contact) // Remove donations from result

    default:
      return []
  }
}
