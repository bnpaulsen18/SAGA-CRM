import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'

export const runtime = 'nodejs'

/**
 * GET /api/contacts/search?q=search-term
 * Global search for contacts by name, email, or phone
 * Returns max 10 results for autocomplete dropdown
 */
export async function GET(req: Request) {
  try {
    const session = await requireAuth()
    const prisma = await getPrismaWithRLS()

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')

    if (!query || query.trim().length === 0) {
      return NextResponse.json([])
    }

    // Search contacts by name, email, or phone (case-insensitive)
    const contacts = await prisma.contact.findMany({
      where: {
        organizationId: session.user.organizationId || undefined,
        OR: [
          {
            firstName: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            lastName: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            email: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            phone: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        type: true,
        status: true,
        _count: {
          select: {
            donations: true
          }
        }
      },
      orderBy: {
        lastName: 'asc'
      },
      take: 10
    })

    // Calculate lifetime giving for each contact
    const contactsWithGiving = await Promise.all(
      contacts.map(async (contact) => {
        const donations = await prisma.donation.aggregate({
          where: { contactId: contact.id },
          _sum: { amount: true }
        })

        return {
          ...contact,
          lifetimeGiving: donations._sum.amount || 0
        }
      })
    )

    return NextResponse.json(contactsWithGiving)
  } catch (error) {
    console.error('GET /api/contacts/search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
