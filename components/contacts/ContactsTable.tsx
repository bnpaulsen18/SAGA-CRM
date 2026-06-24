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
  limit = 50,
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

  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]
    if (aValue === null) return 1
    if (bValue === null) return -1
    if (sortField === '_count') {
      aValue = a._count.donations as never
      bValue = b._count.donations as never
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime()
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
        return { background: '#E6F3EE', border: '1px solid #CDE9DD', color: '#2E7D5B' }
      case 'INACTIVE':
        return { background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ink-soft)' }
      case 'DECEASED':
        return { background: '#F6EBE6', border: '1px solid #EAD3C8', color: '#C0573F' }
      case 'DO_NOT_CONTACT':
        return { background: '#F7EFD9', border: '1px solid #ECD9A8', color: '#B7791F' }
      default:
        return { background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ink-soft)' }
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--line)]">
      {/* Search Bar */}
      <div className="p-4 border-b border-[var(--line)]">
        <Input
          placeholder="Search contacts by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md bg-[var(--paper)] border border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--ink-faint)]"
        />
        <p className="text-xs text-[var(--ink-faint)] mt-2">
          Showing {sortedData.length} of {data.length} contacts on this page • {totalCount.toLocaleString()} total
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {sortedData.length === 0 ? (
          <div className="px-6 py-12 text-center text-[var(--ink-soft)]">
            {searchTerm ? (
              <>
                <p className="text-lg mb-2 text-[var(--ink)]">No contacts found</p>
                <p className="text-sm">Try adjusting your search</p>
              </>
            ) : (
              <>
                <p className="text-lg mb-2 text-[var(--ink)]">No contacts yet</p>
                <p className="text-sm mb-4">Get started by adding your first contact</p>
                <Link href="/contacts/new">
                  <Button className="saga-button text-white flex items-center gap-2 border-none">
                    <Plus size={18} weight="bold" />
                    Add Contact
                  </Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-[var(--paper)]">
              <TableRow className="border-b border-[var(--line)] hover:bg-transparent">
                <TableHead className="text-[var(--ink-soft)] cursor-pointer hover:text-[var(--ink)]" onClick={() => handleSort('lastName')}>
                  Name {sortField === 'lastName' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="text-[var(--ink-soft)]">Email</TableHead>
                <TableHead className="text-[var(--ink-soft)]">Phone</TableHead>
                <TableHead className="text-[var(--ink-soft)]">Type</TableHead>
                <TableHead className="text-[var(--ink-soft)]">Status</TableHead>
                <TableHead className="text-[var(--ink-soft)] cursor-pointer hover:text-[var(--ink)] text-right" onClick={() => handleSort('lifetimeGiving')}>
                  Lifetime Giving {sortField === 'lifetimeGiving' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="text-[var(--ink-soft)] cursor-pointer hover:text-[var(--ink)]" onClick={() => handleSort('_count')}>
                  Gifts {sortField === '_count' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="text-[var(--ink-soft)]">Last Gift</TableHead>
                <TableHead className="text-[var(--ink-soft)]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((contact) => (
                <TableRow key={contact.id} className="border-b border-[var(--line)] hover:bg-[var(--paper)] transition-colors">
                  <TableCell>
                    <Link href={`/contacts/${contact.id}`} className="font-medium text-[var(--ink)] hover:text-[#5B4B8A] transition-colors">
                      {contact.firstName} {contact.lastName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-[var(--ink-soft)]">{contact.email}</TableCell>
                  <TableCell className="text-[var(--ink-soft)]">{contact.phone || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs" style={{ background: '#EEE9F5', border: '1px solid #DDD3EC', color: '#5B4B8A' }}>
                      {contact.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs" style={getStatusBadgeStyle(contact.status)}>
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-[#4A8C6F] text-right tabular-nums">
                    ${contact.lifetimeGiving.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-[var(--ink)] tabular-nums">{contact._count.donations}</TableCell>
                  <TableCell className="text-[var(--ink-soft)]">
                    {contact.lastGiftDate
                      ? new Date(contact.lastGiftDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Link href={`/contacts/${contact.id}`}>
                      <Button variant="ghost" size="sm" className="text-[#5B4B8A] hover:text-[#E0507A] hover:bg-[var(--surface-2)]">
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
        <div className="p-4 border-t border-[var(--line)] flex items-center justify-between">
          <span className="text-[var(--ink-soft)] text-sm">
            Showing {startRecord.toLocaleString()}-{endRecord.toLocaleString()} of {totalCount.toLocaleString()} contacts
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[var(--ink-faint)] text-sm">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="text-[var(--ink)] border-[var(--line)] hover:bg-[var(--surface-2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <CaretLeft size={16} weight="bold" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="text-[var(--ink)] border-[var(--line)] hover:bg-[var(--surface-2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
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
