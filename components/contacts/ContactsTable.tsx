'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, CaretLeft, CaretRight } from '@phosphor-icons/react'

type ContactWithStats = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  type: string
  status: string
  lifetimeGiving: number
  lastGiftDate: Date | null
  lastGiftAmount: number | null
  _count: { donations: number }
}

interface ContactsTableProps {
  data: ContactWithStats[]
  currentPage?: number
  totalPages?: number
  totalCount?: number
  startRecord?: number
  endRecord?: number
  limit?: number
}

export default function ContactsTable({
  data,
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  startRecord = 0,
  endRecord = 0,
  limit = 50
}: ContactsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof ContactWithStats>('lastName')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    params.set('limit', limit.toString())
    router.push(`?${params.toString()}`)
  }

  // Filter contacts by search term
  const filteredData = data.filter((contact) => {
    const search = searchTerm.toLowerCase()
    return (
      contact.firstName.toLowerCase().includes(search) ||
      contact.lastName.toLowerCase().includes(search) ||
      contact.email.toLowerCase().includes(search) ||
      contact.phone?.toLowerCase().includes(search) ||
      ''
    )
  })

  // Sort contacts
  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    // Handle null values
    if (aValue === null) return 1
    if (bValue === null) return -1

    // Handle nested objects
    if (sortField === '_count') {
      aValue = a._count.donations as any
      bValue = b._count.donations as any
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime()
    }

    return 0
  })

  const handleSort = (field: keyof ContactWithStats) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return {
          background: 'rgba(34, 197, 94, 0.2)',
          border: '1px solid rgba(34, 197, 94, 0.4)',
          color: '#4ade80'
        }
      case 'INACTIVE':
        return {
          background: 'rgba(156, 163, 175, 0.2)',
          border: '1px solid rgba(156, 163, 175, 0.4)',
          color: '#9ca3af'
        }
      case 'DECEASED':
        return {
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#ef4444'
        }
      case 'DO_NOT_CONTACT':
        return {
          background: 'rgba(234, 179, 8, 0.2)',
          border: '1px solid rgba(234, 179, 8, 0.4)',
          color: '#eab308'
        }
      default:
        return {
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#ffffff'
        }
    }
  }

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
      }}
    >
      {/* Search Bar */}
      <div className="p-4 border-b" style={{ borderBottomColor: 'rgba(255, 107, 107, 0.2)' }}>
        <Input
          placeholder="Search contacts by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md text-white placeholder:text-white/50"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        />
        <p className="text-xs text-white/50 mt-2">
          Showing {sortedData.length} of {data.length} contacts on this page • {totalCount.toLocaleString()} total
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {sortedData.length === 0 ? (
          <div className="px-6 py-12 text-center text-white/70">
            {searchTerm ? (
              <>
                <p className="text-lg mb-2">No contacts found</p>
                <p className="text-sm">Try adjusting your search</p>
              </>
            ) : (
              <>
                <p className="text-lg mb-2">No contacts yet</p>
                <p className="text-sm mb-4">Get started by adding your first contact</p>
                <Link href="/contacts/new">
                  <Button
                    className="text-white flex items-center gap-2"
                    style={{
                      background: 'linear-gradient(to right, #764ba2, #ff6b35)'
                    }}
                  >
                    <Plus size={18} weight="bold" />
                    Add Contact
                  </Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <TableRow style={{ borderBottomColor: 'rgba(255, 255, 255, 0.05)' }}>
                <TableHead
                  className="text-white/70 cursor-pointer hover:text-white"
                  onClick={() => handleSort('lastName')}
                >
                  Name {sortField === 'lastName' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="text-white/70">Email</TableHead>
                <TableHead className="text-white/70">Phone</TableHead>
                <TableHead className="text-white/70">Type</TableHead>
                <TableHead className="text-white/70">Status</TableHead>
                <TableHead
                  className="text-white/70 cursor-pointer hover:text-white"
                  onClick={() => handleSort('lifetimeGiving')}
                >
                  Lifetime Giving {sortField === 'lifetimeGiving' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  className="text-white/70 cursor-pointer hover:text-white"
                  onClick={() => handleSort('_count')}
                >
                  Gifts {sortField === '_count' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="text-white/70">Last Gift</TableHead>
                <TableHead className="text-white/70">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((contact) => (
                <TableRow
                  key={contact.id}
                  className="hover:bg-white/5 transition-colors"
                  style={{ borderBottomColor: 'rgba(255, 255, 255, 0.05)' }}
                >
                  <TableCell>
                    <Link
                      href={`/contacts/${contact.id}`}
                      className="font-medium text-white hover:text-orange-400 transition-colors"
                    >
                      {contact.firstName} {contact.lastName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-white/80">{contact.email}</TableCell>
                  <TableCell className="text-white/80">{contact.phone || '-'}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        background: 'rgba(118, 75, 162, 0.2)',
                        border: '1px solid rgba(118, 75, 162, 0.4)',
                        color: 'white'
                      }}
                    >
                      {contact.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={getStatusBadgeStyle(contact.status)}
                    >
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-green-400">
                    ${contact.lifetimeGiving.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-white">{contact._count.donations}</TableCell>
                  <TableCell className="text-white/70">
                    {contact.lastGiftDate
                      ? new Date(contact.lastGiftDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Link href={`/contacts/${contact.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-orange-400 hover:text-orange-500 hover:bg-white/10"
                      >
                        View →
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalCount > 0 && (
        <div
          className="p-4 border-t flex items-center justify-between"
          style={{ borderTopColor: 'rgba(255, 107, 107, 0.2)' }}
        >
          <span className="text-white/70 text-sm">
            Showing {startRecord.toLocaleString()}-{endRecord.toLocaleString()} of {totalCount.toLocaleString()} contacts
          </span>
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="text-white border-white/30 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <CaretLeft size={16} weight="bold" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="text-white border-white/30 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <CaretRight size={16} weight="bold" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
