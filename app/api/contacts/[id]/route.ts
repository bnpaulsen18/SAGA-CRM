import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import { contactSchema } from '@/lib/validation'
import { encryptContactPII, decryptContactPII } from '@/lib/encryption'
import { createAuditLog, buildChangeMetadata } from '@/lib/audit'

export const runtime = 'nodejs'

// GET /api/contacts/[id] - Get a single contact
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await requireAuth()
    const prisma = await getPrismaWithRLS()

    const contact = await prisma.contact.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || undefined
      },
      include: {
        _count: {
          select: {
            donations: true,
            interactions: true
          }
        }
      }
    })

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    // Decrypt PII before sending to client
    const decryptedContact = decryptContactPII(contact)

    // Optional: Create VIEW audit log (only for sensitive views)
    // Uncomment if you want to track contact views
    // await createAuditLog({
    //   userId: session.user.id,
    //   action: 'VIEW',
    //   resource: 'Contact',
    //   resourceId: id
    // })

    return NextResponse.json(decryptedContact)
  } catch (error) {
    console.error('GET /api/contacts/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    )
  }
}

// PUT /api/contacts/[id] - Update a contact
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await requireAuth()
    const prisma = await getPrismaWithRLS()

    const body = await req.json()

    // Validate input with Zod
    const validationResult = contactSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues
        },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Verify the contact belongs to the user's organization
    const existingContact = await prisma.contact.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || undefined
      }
    })

    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact not found or access denied' },
        { status: 404 }
      )
    }

    // Decrypt existing contact for audit trail comparison
    const decryptedExisting = decryptContactPII(existingContact)

    // Encrypt PII fields before saving to database
    const encryptedData = encryptContactPII(validatedData)

    // Update the contact
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        firstName: encryptedData.firstName,
        lastName: encryptedData.lastName,
        email: encryptedData.email,
        phone: encryptedData.phone,
        street: encryptedData.street,
        city: encryptedData.city,
        state: encryptedData.state,
        zip: encryptedData.zip,
        country: encryptedData.country,
        type: encryptedData.type,
        status: encryptedData.status,
        tags: encryptedData.tags,
        notes: encryptedData.notes
      }
    })

    // Create audit log with field changes
    const metadata = buildChangeMetadata(
      decryptedExisting,
      validatedData,
      ['id', 'organizationId', 'createdAt', 'updatedAt'] // Exclude system fields
    )

    await createAuditLog({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'Contact',
      resourceId: id,
      metadata
    })

    // Decrypt before returning to client
    const decryptedContact = decryptContactPII(updatedContact)

    return NextResponse.json(decryptedContact)
  } catch (error) {
    console.error('PUT /api/contacts/[id] error:', error)

    // Handle validation or encryption errors
    if (error instanceof Error) {
      if (error.message.includes('encrypt') || error.message.includes('ENCRYPTION_KEY')) {
        return NextResponse.json(
          { error: 'Encryption configuration error. Please contact support.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

// DELETE /api/contacts/[id] - Soft delete a contact (set status to DO_NOT_CONTACT)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await requireAuth()
    const prisma = await getPrismaWithRLS()

    // Verify the contact belongs to the user's organization
    const existingContact = await prisma.contact.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || undefined
      },
      include: {
        _count: {
          select: {
            donations: true,
            interactions: true
          }
        }
      }
    })

    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact not found or access denied' },
        { status: 404 }
      )
    }

    // Soft delete: Set status to DO_NOT_CONTACT instead of hard delete
    // This preserves donation history and maintains referential integrity
    const deletedContact = await prisma.contact.update({
      where: { id },
      data: {
        status: 'DO_NOT_CONTACT',
        notes: existingContact.notes
          ? `${existingContact.notes}\n\n[Marked for deletion on ${new Date().toISOString()}]`
          : `[Marked for deletion on ${new Date().toISOString()}]`
      }
    })

    // Create audit log for deletion
    await createAuditLog({
      userId: session.user.id,
      action: 'DELETE',
      resource: 'Contact',
      resourceId: id,
      metadata: {
        reason: 'User requested deletion via API',
        softDelete: true,
        hadDonations: existingContact._count.donations > 0,
        hadInteractions: existingContact._count.interactions > 0,
        donationCount: existingContact._count.donations,
        interactionCount: existingContact._count.interactions
      }
    })

    // Decrypt before returning
    const decryptedContact = decryptContactPII(deletedContact)

    return NextResponse.json({
      success: true,
      message: 'Contact marked for deletion (soft delete)',
      contact: decryptedContact,
      note: 'Contact status set to DO_NOT_CONTACT. Donation history preserved.'
    })
  } catch (error) {
    console.error('DELETE /api/contacts/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}
