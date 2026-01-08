import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import { createBulkAuditLog } from '@/lib/audit'
import { z } from 'zod'
import { decryptContactPII } from '@/lib/encryption'

export const runtime = 'nodejs'

// Zod schema for bulk operations
const bulkOperationSchema = z.object({
  action: z.enum(['tag', 'export', 'delete', 'update-status']),
  contactIds: z.array(z.string().cuid()).min(1).max(1000), // Limit to 1000 contacts per operation
  // Optional fields depending on action
  tags: z.array(z.string()).optional(), // For 'tag' action
  status: z.enum(['ACTIVE', 'INACTIVE', 'DECEASED', 'DO_NOT_CONTACT']).optional(), // For 'update-status' action
})

// POST /api/contacts/bulk - Perform bulk operations on contacts
export async function POST(req: Request) {
  try {
    const session = await requireAuth()
    const prisma = await getPrismaWithRLS()

    const body = await req.json()

    // Validate input with Zod
    const validationResult = bulkOperationSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues
        },
        { status: 400 }
      )
    }

    const { action, contactIds, tags, status } = validationResult.data

    // Verify all contacts belong to the user's organization
    const contacts = await prisma.contact.findMany({
      where: {
        id: { in: contactIds },
        organizationId: session.user.organizationId || undefined
      },
      select: { id: true, firstName: true, lastName: true, email: true, status: true }
    })

    if (contacts.length !== contactIds.length) {
      return NextResponse.json(
        { error: 'Some contacts not found or access denied' },
        { status: 404 }
      )
    }

    let successCount = 0
    let failureCount = 0
    let result: any = {}

    // Perform action based on type
    switch (action) {
      case 'tag':
        if (!tags || tags.length === 0) {
          return NextResponse.json(
            { error: 'Tags are required for tag action' },
            { status: 400 }
          )
        }

        // Add tags to contacts (append to existing tags)
        for (const contact of contacts) {
          try {
            const existingContact = await prisma.contact.findUnique({
              where: { id: contact.id },
              select: { tags: true }
            })

            const existingTags = existingContact?.tags || []
            const uniqueTags = Array.from(new Set([...existingTags, ...tags]))

            await prisma.contact.update({
              where: { id: contact.id },
              data: { tags: uniqueTags }
            })

            successCount++
          } catch {
            failureCount++
          }
        }

        // Create bulk audit log
        await createBulkAuditLog({
          userId: session.user.id,
          action: 'BULK_UPDATE',
          resource: 'Contact',
          affectedIds: contacts.map(c => c.id),
          metadata: {
            bulkAction: 'tag',
            tagsAdded: tags,
            successCount,
            failureCount
          }
        })

        result = { message: 'Tags added successfully', successCount, failureCount }
        break

      case 'export':
        // Fetch full contact data with donations for export
        const fullContacts = await prisma.contact.findMany({
          where: {
            id: { in: contactIds },
            organizationId: session.user.organizationId || undefined
          },
          include: {
            donations: {
              select: { amount: true, donatedAt: true }
            }
          }
        })

        // Decrypt PII fields
        const decryptedContacts = fullContacts.map(contact => {
          const decrypted = decryptContactPII(contact)
          const lifetimeGiving = contact.donations.reduce((sum, d) => sum + d.amount, 0)
          const sortedDonations = [...contact.donations].sort((a, b) =>
            b.donatedAt.getTime() - a.donatedAt.getTime()
          )

          return {
            'First Name': decrypted.firstName,
            'Last Name': decrypted.lastName,
            'Email': decrypted.email,
            'Phone': decrypted.phone || '',
            'Street': decrypted.street || '',
            'City': decrypted.city || '',
            'State': decrypted.state || '',
            'Zip': decrypted.zip || '',
            'Country': decrypted.country || '',
            'Type': decrypted.type,
            'Status': decrypted.status,
            'Tags': (decrypted.tags || []).join('; '),
            'Lifetime Giving': lifetimeGiving.toFixed(2),
            'Total Donations': contact.donations.length,
            'Last Gift Date': sortedDonations[0]?.donatedAt.toISOString().split('T')[0] || '',
            'Last Gift Amount': sortedDonations[0]?.amount.toFixed(2) || '',
            'Notes': decrypted.notes || '',
            'Created At': decrypted.createdAt.toISOString().split('T')[0],
          }
        })

        // Create audit log for export
        await createBulkAuditLog({
          userId: session.user.id,
          action: 'EXPORT',
          resource: 'Contact',
          affectedIds: contactIds,
          metadata: {
            bulkAction: 'export',
            contactCount: decryptedContacts.length,
            exportFormat: 'csv'
          }
        })

        result = { contacts: decryptedContacts, successCount: decryptedContacts.length, failureCount: 0 }
        break

      case 'delete':
        // Soft delete: Set status to DO_NOT_CONTACT
        for (const contact of contacts) {
          try {
            await prisma.contact.update({
              where: { id: contact.id },
              data: {
                status: 'DO_NOT_CONTACT',
                notes: contact.status !== 'DO_NOT_CONTACT'
                  ? `${contact.firstName} ${contact.lastName} - Marked for deletion on ${new Date().toISOString()}`
                  : undefined
              }
            })

            successCount++
          } catch {
            failureCount++
          }
        }

        // Create bulk audit log
        await createBulkAuditLog({
          userId: session.user.id,
          action: 'BULK_DELETE',
          resource: 'Contact',
          affectedIds: contacts.map(c => c.id),
          metadata: {
            bulkAction: 'delete',
            softDelete: true,
            successCount,
            failureCount
          }
        })

        result = { message: 'Contacts marked for deletion', successCount, failureCount }
        break

      case 'update-status':
        if (!status) {
          return NextResponse.json(
            { error: 'Status is required for update-status action' },
            { status: 400 }
          )
        }

        // Update status for all contacts
        for (const contact of contacts) {
          try {
            await prisma.contact.update({
              where: { id: contact.id },
              data: { status }
            })

            successCount++
          } catch {
            failureCount++
          }
        }

        // Create bulk audit log
        await createBulkAuditLog({
          userId: session.user.id,
          action: 'BULK_UPDATE',
          resource: 'Contact',
          affectedIds: contacts.map(c => c.id),
          metadata: {
            bulkAction: 'update-status',
            newStatus: status,
            successCount,
            failureCount
          }
        })

        result = { message: `Status updated to ${status}`, successCount, failureCount }
        break
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('POST /api/contacts/bulk error:', error)
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    )
  }
}
