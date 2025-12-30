'use client'

import Link from 'next/link'

interface TopDonorsTableProps {
  donors: Array<{
    contactId: string
    name: string
    total: number
    count: number
    avgGift: number
  }>
}

export default function TopDonorsTable({ donors }: TopDonorsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-white/10">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
              Donor
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">
              Total Given
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">
              Gifts
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">
              Avg Gift
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {donors.map((donor, i) => (
            <tr
              key={donor.contactId}
              className="hover:bg-white/5 transition-colors"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {i < 3 ? (
                    <span className="text-2xl">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                    </span>
                  ) : (
                    <span className="text-lg font-bold text-white/40">
                      #{i + 1}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/contacts/${donor.contactId}`}
                  className="text-white hover:text-orange-400 transition-colors font-medium"
                >
                  {donor.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-green-400 font-bold">
                  ${donor.total.toLocaleString()}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-white">{donor.count}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-white/80">${donor.avgGift.toFixed(2)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
