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

interface Campaign {
  id: string
  name: string
}

interface DonationsFiltersProps {
  campaigns: Campaign[]
}

export default function DonationsFilters({ campaigns }: DonationsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize filter state from URL
  const [status, setStatus] = useState(searchParams.get('status') || 'all')
  const [campaignId, setCampaignId] = useState(searchParams.get('campaignId') || 'all')
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '')
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '')
  const [minAmount, setMinAmount] = useState(searchParams.get('minAmount') || '')
  const [maxAmount, setMaxAmount] = useState(searchParams.get('maxAmount') || '')

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

    if (campaignId && campaignId !== 'all') {
      params.set('campaignId', campaignId)
    } else {
      params.delete('campaignId')
    }

    if (startDate) {
      params.set('startDate', startDate)
    } else {
      params.delete('startDate')
    }

    if (endDate) {
      params.set('endDate', endDate)
    } else {
      params.delete('endDate')
    }

    if (minAmount) {
      params.set('minAmount', minAmount)
    } else {
      params.delete('minAmount')
    }

    if (maxAmount) {
      params.set('maxAmount', maxAmount)
    } else {
      params.delete('maxAmount')
    }

    router.push(`?${params.toString()}`)
  }

  const handleClearFilters = () => {
    setStatus('all')
    setCampaignId('all')
    setStartDate('')
    setEndDate('')
    setMinAmount('')
    setMaxAmount('')
    router.push('/donations')
  }

  const hasActiveFilters =
    (status && status !== 'all') ||
    (campaignId && campaignId !== 'all') ||
    startDate ||
    endDate ||
    minAmount ||
    maxAmount

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <SelectItem value="COMPLETED" className="text-white hover:bg-white/10">Completed</SelectItem>
              <SelectItem value="PENDING" className="text-white hover:bg-white/10">Pending</SelectItem>
              <SelectItem value="FAILED" className="text-white hover:bg-white/10">Failed</SelectItem>
              <SelectItem value="REFUNDED" className="text-white hover:bg-white/10">Refunded</SelectItem>
              <SelectItem value="CANCELLED" className="text-white hover:bg-white/10">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Campaign Filter */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Campaign
          </label>
          <Select value={campaignId} onValueChange={setCampaignId}>
            <SelectTrigger className="saga-input">
              <SelectValue placeholder="All campaigns" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a0a2e]/98 saga-border-orange">
              <SelectItem value="all" className="text-white hover:bg-white/10">All Campaigns</SelectItem>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id} className="text-white hover:bg-white/10">
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Min Amount */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Min Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-white/60">$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="0.00"
              className="saga-input pl-7"
            />
          </div>
        </div>

        {/* Max Amount */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Max Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-white/60">$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="10000.00"
              className="saga-input pl-7"
            />
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Start Date
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="saga-input"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            End Date
          </label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="saga-input"
          />
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
      {startDate && endDate && new Date(endDate) < new Date(startDate) && (
        <p className="text-red-400 text-sm mt-2">
          End date must be after start date
        </p>
      )}
      {minAmount && maxAmount && parseFloat(maxAmount) < parseFloat(minAmount) && (
        <p className="text-red-400 text-sm mt-2">
          Max amount must be greater than min amount
        </p>
      )}
    </div>
  )
}
