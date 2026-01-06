import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/permissions';
import { getPrismaWithRLS } from '@/lib/prisma-rls';

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const prisma = await getPrismaWithRLS();

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv';
    const type = searchParams.get('type') || 'donations';

    // Date range (default: last 12 months)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);

    if (type === 'donations') {
      // Export donations
      const donations = await prisma.donation.findMany({
        where: {
          organizationId: session.user.organizationId || undefined,
          donatedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          contact: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          campaign: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          donatedAt: 'desc',
        },
      });

      if (format === 'csv') {
        // Generate CSV
        const headers = [
          'Date',
          'Donor Name',
          'Email',
          'Amount',
          'Method',
          'Fund Restriction',
          'Campaign',
          'Status',
          'Receipt Number',
        ];

        const rows = donations.map((d) => [
          new Date(d.donatedAt).toLocaleDateString('en-US'),
          `${d.contact.firstName} ${d.contact.lastName}`,
          d.contact.email,
          d.amount.toFixed(2),
          d.method,
          d.fundRestriction,
          d.campaign?.name || '',
          d.status,
          d.receiptNumber || '',
        ]);

        const csvContent = [
          headers.join(','),
          ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');

        return new NextResponse(csvContent, {
          status: 200,
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="donations-export-${new Date().toISOString().split('T')[0]}.csv"`,
          },
        });
      }
    } else if (type === 'contacts') {
      // Export contacts with donation summaries
      const contacts = await prisma.contact.findMany({
        where: {
          organizationId: session.user.organizationId || undefined,
        },
        include: {
          donations: {
            select: {
              amount: true,
              donatedAt: true,
            },
          },
        },
        orderBy: {
          lastName: 'asc',
        },
      });

      if (format === 'csv') {
        const headers = [
          'First Name',
          'Last Name',
          'Email',
          'Phone',
          'Total Donated',
          'Donation Count',
          'Last Donation Date',
          'Average Gift',
        ];

        const rows = contacts.map((c) => {
          const totalDonated = c.donations.reduce((sum, d) => sum + d.amount, 0);
          const donationCount = c.donations.length;
          const lastDonation = c.donations.length > 0
            ? new Date(Math.max(...c.donations.map(d => new Date(d.donatedAt).getTime())))
            : null;
          const avgGift = donationCount > 0 ? totalDonated / donationCount : 0;

          return [
            c.firstName,
            c.lastName,
            c.email,
            c.phone || '',
            totalDonated.toFixed(2),
            donationCount.toString(),
            lastDonation ? lastDonation.toLocaleDateString('en-US') : '',
            avgGift.toFixed(2),
          ];
        });

        const csvContent = [
          headers.join(','),
          ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');

        return new NextResponse(csvContent, {
          status: 200,
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="contacts-export-${new Date().toISOString().split('T')[0]}.csv"`,
          },
        });
      }
    }

    return NextResponse.json({ error: 'Invalid export type or format' }, { status: 400 });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
