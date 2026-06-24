'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SagaCard from '@/components/ui/saga-card'

interface ColumnMapperProps {
  csvHeaders: string[]
  onComplete: (mapping: Record<string, string>) => void
  onBack: () => void
}

const CONTACT_FIELDS = [
  { value: '', label: 'Do not import' },
  { value: 'firstName', label: 'First Name *', required: true },
  { value: 'lastName', label: 'Last Name *', required: true },
  { value: 'email', label: 'Email *', required: true },
  { value: 'phone', label: 'Phone' },
  { value: 'street', label: 'Street Address' },
  { value: 'city', label: 'City' },
  { value: 'state', label: 'State' },
  { value: 'zip', label: 'ZIP Code' },
  { value: 'type', label: 'Contact Type' },
  { value: 'status', label: 'Status' },
  { value: 'tags', label: 'Tags (comma-separated)' },
  { value: 'notes', label: 'Notes' },
]

const selectTrigger = 'bg-[var(--paper)] border border-[var(--line)] text-[var(--ink)]'
const selectContent = 'bg-[var(--surface)] border border-[var(--line)]'
const selectItem = 'text-[var(--ink)] focus:bg-[var(--surface-2)] hover:bg-[var(--surface-2)] cursor-pointer'

export default function ColumnMapper({ csvHeaders, onComplete, onBack }: ColumnMapperProps) {
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    const autoMapping: Record<string, string> = {}
    csvHeaders.forEach((header) => {
      const normalized = header.toLowerCase().trim()
      if (normalized.includes('first') && normalized.includes('name')) autoMapping[header] = 'firstName'
      else if (normalized.includes('last') && normalized.includes('name')) autoMapping[header] = 'lastName'
      else if (normalized === 'email' || normalized === 'email address') autoMapping[header] = 'email'
      else if (normalized === 'phone' || normalized === 'phone number') autoMapping[header] = 'phone'
      else if (normalized === 'street' || normalized === 'address') autoMapping[header] = 'street'
      else if (normalized === 'city') autoMapping[header] = 'city'
      else if (normalized === 'state') autoMapping[header] = 'state'
      else if (normalized === 'zip' || normalized === 'zipcode' || normalized === 'postal code') autoMapping[header] = 'zip'
      else if (normalized === 'type' || normalized === 'contact type') autoMapping[header] = 'type'
      else if (normalized === 'status') autoMapping[header] = 'status'
      else if (normalized === 'tags') autoMapping[header] = 'tags'
      else if (normalized === 'notes') autoMapping[header] = 'notes'
    })
    setMapping(autoMapping)
  }, [csvHeaders])

  function handleMappingChange(csvColumn: string, contactField: string) {
    setMapping((prev) => ({ ...prev, [csvColumn]: contactField }))
  }

  function validateMapping() {
    const newErrors: string[] = []
    const mappedFields = Object.values(mapping).filter(Boolean)
    if (!mappedFields.includes('firstName')) newErrors.push('First Name field is required')
    if (!mappedFields.includes('lastName')) newErrors.push('Last Name field is required')
    if (!mappedFields.includes('email')) newErrors.push('Email field is required')
    const fieldCounts: Record<string, number> = {}
    mappedFields.forEach((field) => {
      if (field) fieldCounts[field] = (fieldCounts[field] || 0) + 1
    })
    Object.entries(fieldCounts).forEach(([field, count]) => {
      if (count > 1) {
        const fieldLabel = CONTACT_FIELDS.find((f) => f.value === field)?.label || field
        newErrors.push(`${fieldLabel} is mapped multiple times`)
      }
    })
    setErrors(newErrors)
    return newErrors.length === 0
  }

  function handleContinue() {
    if (validateMapping()) onComplete(mapping)
  }

  return (
    <SagaCard title="Step 2: Map Columns">
      <div className="space-y-6">
        <p className="text-[var(--ink-soft)]">Map your CSV columns to contact fields. Required fields are marked with *.</p>

        {errors.length > 0 && (
          <div className="p-4 rounded-lg space-y-1 bg-[#F6EBE6] border border-[#EAD3C8]">
            {errors.map((error, i) => (
              <div key={i} className="text-sm text-[#C0573F]">• {error}</div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {csvHeaders.map((header, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 items-center">
              <div className="text-[var(--ink)] font-medium">{header}</div>
              <Select value={mapping[header] || ''} onValueChange={(value) => handleMappingChange(header, value)}>
                <SelectTrigger className={selectTrigger}>
                  <SelectValue placeholder="Select field..." />
                </SelectTrigger>
                <SelectContent className={selectContent}>
                  {CONTACT_FIELDS.map((field) => (
                    <SelectItem key={field.value} value={field.value} className={selectItem}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={onBack} variant="outline" className="text-[var(--ink)] border-[var(--line)] hover:bg-[var(--surface-2)]">
            ← Back
          </Button>
          <Button
            onClick={handleContinue}
            className="flex-1 text-white font-semibold border-none"
            style={{ background: 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)' }}
          >
            Continue to Preview →
          </Button>
        </div>
      </div>
    </SagaCard>
  )
}
