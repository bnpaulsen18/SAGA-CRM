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

interface ContactsFiltersProps {}

export default function ContactsFilters({}: ContactsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize filter state from URL
  const [status, setStatus] = useState(searchParams.get('status') || 'all')
  const [type, setType] = useState(searchParams.get('type') || 'all')
  const [minLifetimeGiving, setMinLifetimeGiving] = useState(searchParams.get('minLifetimeGiving') || '')
  const [maxLifetimeGiving, setMaxLifetimeGiving] = useState(searchParams.get('maxLifetimeGiving') || '')

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Reset to page 1 when applying filters
    params.set('page', '1')

    // Apply filters
    if (status && status !== 'all') {
      params.set('status', status)
    } else {
      params.delete('status')
    }

    if (type && type !== 'all') {
      params.set('type', type)
    } else {
      params.delete('type')
    }

    if (minLifetimeGiving) {
      params.set('minLifetimeGiving', minLifetimeGiving)
    } else {
      params.delete('minLifetimeGiving')
    }

    if (maxLifetimeGiving) {
      params.set('maxLifetimeGiving', maxLifetimeGiving)
    } else {
      params.delete('maxLifetimeGiving')
    }

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
    (status && status !== 'all') ||
    (type && type !== 'all') ||
    minLifetimeGiving ||
    maxLifetimeGiving

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Funnel size={20} weight="bold" className="text-white/70" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-1"
          >
            <X size={16} weight="bold" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Status
          </label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="saga-input">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a0a2e]/98 saga-border-orange">
              <SelectItem value="all" className="text-white hover:bg-white/10">All Statuses</SelectItem>
              <SelectItem value="ACTIVE" className="text-white hover:bg-white/10">Active</SelectItem>
              <SelectItem value="INACTIVE" className="text-white hover:bg-white/10">Inactive</SelectItem>
              <SelectItem value="DECEASED" className="text-white hover:bg-white/10">Deceased</SelectItem>
              <SelectItem value="DO_NOT_CONTACT" className="text-white hover:bg-white/10">Do Not Contact</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Type
          </label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="saga-input">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a0a2e]/98 saga-border-orange">
              <SelectItem value="all" className="text-white hover:bg-white/10">All Types</SelectItem>
              <SelectItem value="DONOR" className="text-white hover:bg-white/10">Donor</SelectItem>
              <SelectItem value="VOLUNTEER" className="text-white hover:bg-white/10">Volunteer</SelectItem>
              <SelectItem value="BOARD_MEMBER" className="text-white hover:bg-white/10">Board Member</SelectItem>
              <SelectItem value="STAFF" className="text-white hover:bg-white/10">Staff</SelectItem>
              <SelectItem value="VENDOR" className="text-white hover:bg-white/10">Vendor</SelectItem>
              <SelectItem value="PROSPECT" className="text-white hover:bg-white/10">Prospect</SelectItem>
              <SelectItem value="OTHER" className="text-white hover:bg-white/10">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Min Lifetime Giving */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Min Lifetime Giving (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-white/60">$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={minLifetimeGiving}
              onChange={(e) => setMinLifetimeGiving(e.target.value)}
              placeholder="0.00"
              className="saga-input pl-7"
            />
          </div>
        </div>

        {/* Max Lifetime Giving */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Max Lifetime Giving (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-white/60">$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={maxLifetimeGiving}
              onChange={(e) => setMaxLifetimeGiving(e.target.value)}
              placeholder="100000.00"
              className="saga-input pl-7"
            />
          </div>
        </div>
      </div>

      {/* Apply Filters Button */}
      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleApplyFilters}
          className="saga-button text-white font-semibold border-none flex items-center gap-2"
        >
          <Funnel size={18} weight="bold" />
          Apply Filters
        </Button>
      </div>

      {/* Validation Messages */}
      {minLifetimeGiving && maxLifetimeGiving && parseFloat(maxLifetimeGiving) < parseFloat(minLifetimeGiving) && (
        <p className="text-red-400 text-sm mt-2">
          Max lifetime giving must be greater than min lifetime giving
        </p>
      )}
    </div>
  )
}
