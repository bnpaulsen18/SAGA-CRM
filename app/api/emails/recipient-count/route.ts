import { NextRequest, NextResponse } from 'next/server'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import { requireAuth } from '@/lib/permissions'

type SegmentType = 'ALL' | 'DONORS' | 'MONTHLY_DONORS' | 'RECENT_DONORS' | 'MAJOR_DONORS'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await requireAuth()
    const prisma = await getPrismaWithRLS()

    // Get segment from query params
    const searchParams = request.nextUrl.searchParams
    const segment = (searchParams.get('segment') || 'ALL') as SegmentType

    const organizationId = session.user.organizationId

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Count contacts based on segment
    let count = 0

    const baseQuery = {
      organizationId,
      status: 'ACTIVE' as const
    }

    switch (segment) {
      case 'ALL':
        count = await prisma.contact.count({
          where: baseQuery
        })
        break

      case 'DONORS':
        count = await prisma.contact.count({
          where: {
            ...baseQuery,
            donations: {
              some: {
                status: 'COMPLETED'
              }
            }
          }
        })
        break

      case 'MONTHLY_DONORS':
        count = await prisma.contact.count({
          where: {
            ...baseQuery,
            donations: {
              some: {
                status: 'COMPLETED',
                type: 'MONTHLY'
              }
            }
          }
        })
        break

      case 'RECENT_DONORS':
        const ninetyDaysAgo = new Date()
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

        count = await prisma.contact.count({
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
          }
        })
        break

      case 'MAJOR_DONORS':
        // This requires aggregation - fetch all donors and count
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

        // Count major donors ($1000+ lifetime)
        count = allDonors.filter((donor) => {
          const totalDonated = donor.donations.reduce((sum, d) => sum + d.amount, 0)
          return totalDonated >= 1000
        }).length
        break

      default:
        count = 0
    }

    return NextResponse.json({ count, segment })
  } catch (error) {
    console.error('Recipient count error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get recipient count' },
      { status: 500 }
    )
  }
}
