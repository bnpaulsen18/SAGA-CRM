import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import { contactSchema } from '@/lib/validation'

export const runtime = 'nodejs'

/**
 * GET /api/contacts/[id]
 * Get a single contact by ID
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    const prisma = await getPrismaWithRLS()
    const { id } = await params

    const contact = await prisma.contact.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || undefined
      },
      include: {
        donations: {
          select: {
            id: true,
            amount: true,
            donatedAt: true,
            status: true,
            campaign: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            donatedAt: 'desc'
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

    return NextResponse.json(contact)
  } catch (error) {
    console.error('GET /api/contacts/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/contacts/[id]
 * Update a contact
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    const prisma = await getPrismaWithRLS()
    const { id } = await params
    const body = await req.json()

    // Zod validation
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

    // Check contact exists and belongs to user's organization
    const existingContact = await prisma.contact.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || undefined
      }
    })

    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    // Update contact
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        ...validationResult.data,
        updatedAt: new Date()
      }
    })

    // TODO: Add audit logging when lib/audit.ts is implemented
    // await createAuditLog({
    //   userId: session.user.id,
    //   action: 'UPDATE',
    //   resource: 'Contact',
    //   resourceId: id,
    //   metadata: { changes: validationResult.data }
    // })

    return NextResponse.json(updatedContact)
  } catch (error) {
    console.error('PUT /api/contacts/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/contacts/[id]
 * Soft delete a contact (set status to DO_NOT_CONTACT)
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    const prisma = await getPrismaWithRLS()
    const { id } = await params

    // Check contact exists and belongs to user's organization
    const existingContact = await prisma.contact.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || undefined
      }
    })

    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    // Soft delete by setting status to DO_NOT_CONTACT
    const deletedContact = await prisma.contact.update({
      where: { id },
      data: {
        status: 'DO_NOT_CONTACT',
        updatedAt: new Date()
      }
    })

    // TODO: Add audit logging when lib/audit.ts is implemented
    // await createAuditLog({
    //   userId: session.user.id,
    //   action: 'DELETE',
    //   resource: 'Contact',
    //   resourceId: id,
    //   metadata: { previousStatus: existingContact.status }
    // })

    return NextResponse.json({
      message: 'Contact deleted successfully',
      contact: deletedContact
    })
  } catch (error) {
    console.error('DELETE /api/contacts/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}
