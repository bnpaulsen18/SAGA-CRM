import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'

export const runtime = 'nodejs'

// PUT /api/donations/[id] - Update a donation
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await requireAuth()
    const prisma = await getPrismaWithRLS()

    const body = await req.json()
    const {
      contactId,
      amount,
      fundRestriction,
      method,
      type,
      campaignId,
      transactionId,
      notes,
      donatedAt
    } = body

    // Validation
    if (!contactId || !amount) {
      return NextResponse.json(
        { error: 'Contact and amount are required' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Verify the donation belongs to the user's organization
    const existingDonation = await prisma.donation.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || undefined
      }
    })

    if (!existingDonation) {
      return NextResponse.json(
        { error: 'Donation not found or access denied' },
        { status: 404 }
      )
    }

    // Verify the contact belongs to the user's organization
    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        organizationId: session.user.organizationId || undefined
      }
    })

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found or access denied' },
        { status: 403 }
      )
    }

    // Update the donation
    const donation = await prisma.donation.update({
      where: { id },
      data: {
        contactId,
        amount: parseFloat(amount),
        type: type || 'ONE_TIME',
        method: method || 'CREDIT_CARD',
        fundRestriction: fundRestriction || 'UNRESTRICTED',
        campaignId: campaignId || null,
        transactionId: transactionId || null,
        notes: notes || null,
        donatedAt: donatedAt ? new Date(donatedAt) : existingDonation.donatedAt
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
        }
      }
    })

    return NextResponse.json(donation)
  } catch (error) {
    console.error('PUT /api/donations/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update donation' },
      { status: 500 }
    )
  }
}

// GET /api/donations/[id] - Get a single donation
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await requireAuth()
    const prisma = await getPrismaWithRLS()

    const donation = await prisma.donation.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId || undefined
      },
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        campaign: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(donation)
  } catch (error) {
    console.error('GET /api/donations/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch donation' },
      { status: 500 }
    )
  }
}
