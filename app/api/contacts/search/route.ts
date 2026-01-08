import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import { decryptContactPII } from '@/lib/encryption'

export const runtime = 'nodejs'

// GET /api/contacts/search?q=query - Global search for contacts
export async function GET(req: Request) {
  try {
    const session = await requireAuth()
    const prisma = await getPrismaWithRLS()

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] })
    }

    // Search contacts by name, email (case-insensitive)
    // Limit to 10 results for quick suggestions
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
          }
        ]
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        type: true,
        status: true
      },
      take: 10,
      orderBy: [
        { status: 'asc' }, // ACTIVE first
        { lastName: 'asc' }
      ]
    })

    // Decrypt PII fields before returning
    const decryptedContacts = contacts.map((contact) => decryptContactPII(contact))

    return NextResponse.json({
      results: decryptedContacts,
      count: decryptedContacts.length
    })
  } catch (error) {
    console.error('GET /api/contacts/search error:', error)
    return NextResponse.json(
      { error: 'Failed to search contacts' },
      { status: 500 }
    )
  }
}
