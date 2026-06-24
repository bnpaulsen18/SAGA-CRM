'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Funnel, X } from '@phosphor-icons/react'

export default function ContactsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [status, setStatus] = useState(searchParams.get('status') || 'all')
  const [type, setType] = useState(searchParams.get('type') || 'all')
  const [minLifetimeGiving, setMinLifetimeGiving] = useState(searchParams.get('minLifetimeGiving') || '')
  const [maxLifetimeGiving, setMaxLifetimeGiving] = useState(searchParams.get('maxLifetimeGiving') || '')

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', '1')
    if (status && status !== 'all') params.set('status', status)
    else params.delete('status')
    if (type && type !== 'all') params.set('type', type)
    else params.delete('type')
    if (minLifetimeGiving) params.set('minLifetimeGiving', minLifetimeGiving)
    else params.delete('minLifetimeGiving')
    if (maxLifetimeGiving) params.set('maxLifetimeGiving', maxLifetimeGiving)
    else params.delete('maxLifetimeGiving')
    router.push(`?${params.toString()}`)
  }

  const handleClearFilters = () => {
    setStatus('all')
    setType('all')
    setMinLifetimeGiving('')
    setMaxLifetimeGiving('')
    router.push('/contacts')
  }

  const hasActiveFilters =
    (status && status !== 'all') || (type && type !== 'all') || minLifetimeGiving || maxLifetimeGiving

  const selectTrigger = 'bg-[var(--paper)] border border-[var(--line)] text-[var(--ink)]'
  const selectContent = 'bg-[var(--surface)] border border-[var(--line)]'
  const selectItem = 'text-[var(--ink)] focus:bg-[var(--surface-2)] hover:bg-[var(--surface-2)] cursor-pointer'
  const inputCls = 'bg-[var(--paper)] border border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--ink-faint)]'

  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Funnel size={20} weight="bold" className="text-[var(--ink-faint)]" />
          <h3 className="text-lg font-semibold text-[var(--ink)]">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] flex items-center gap-1"
          >
            <X size={16} weight="bold" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--ink-soft)] mb-2">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className={selectTrigger}>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent className={selectContent}>
              <SelectItem value="all" className={selectItem}>All Statuses</SelectItem>
              <SelectItem value="ACTIVE" className={selectItem}>Active</SelectItem>
              <SelectItem value="INACTIVE" className={selectItem}>Inactive</SelectItem>
              <SelectItem value="DECEASED" className={selectItem}>Deceased</SelectItem>
              <SelectItem value="DO_NOT_CONTACT" className={selectItem}>Do Not Contact</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--ink-soft)] mb-2">Type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className={selectTrigger}>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent className={selectContent}>
              <SelectItem value="all" className={selectItem}>All Types</SelectItem>
              <SelectItem value="DONOR" className={selectItem}>Donor</SelectItem>
              <SelectItem value="VOLUNTEER" className={selectItem}>Volunteer</SelectItem>
              <SelectItem value="BOARD_MEMBER" className={selectItem}>Board Member</SelectItem>
              <SelectItem value="STAFF" className={selectItem}>Staff</SelectItem>
              <SelectItem value="VENDOR" className={selectItem}>Vendor</SelectItem>
              <SelectItem value="PROSPECT" className={selectItem}>Prospect</SelectItem>
              <SelectItem value="OTHER" className={selectItem}>Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--ink-soft)] mb-2">Min Lifetime Giving (USD)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-[var(--ink-faint)]">$</span>
            <Input
              type="number" min="0" step="0.01"
              value={minLifetimeGiving}
              onChange={(e) => setMinLifetimeGiving(e.target.value)}
              placeholder="0.00"
              className={`${inputCls} pl-7`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--ink-soft)] mb-2">Max Lifetime Giving (USD)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-[var(--ink-faint)]">$</span>
            <Input
              type="number" min="0" step="0.01"
              value={maxLifetimeGiving}
              onChange={(e) => setMaxLifetimeGiving(e.target.value)}
              placeholder="100000.00"
              className={`${inputCls} pl-7`}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={handleApplyFilters} className="saga-button text-white font-semibold border-none flex items-center gap-2">
          <Funnel size={18} weight="bold" />
          Apply Filters
        </Button>
      </div>

      {minLifetimeGiving && maxLifetimeGiving && parseFloat(maxLifetimeGiving) < parseFloat(minLifetimeGiving) && (
        <p className="text-[#C0573F] text-sm mt-2">Max lifetime giving must be greater than min lifetime giving</p>
      )}
    </div>
  )
}
