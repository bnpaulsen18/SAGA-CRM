'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Check } from '@phosphor-icons/react'

type Contact = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  street: string | null
  city: string | null
  state: string | null
  zip: string | null
  type: string
  status: string
  tags: string[]
  notes: string | null
}

interface ContactFormEditProps {
  contact: Contact
}

const labelCls = 'block text-sm font-medium text-[var(--ink)] mb-2'
const selectContent = 'bg-[var(--surface)] border border-[var(--line)]'
const selectItem = 'text-[var(--ink)] focus:bg-[var(--surface-2)] hover:bg-[var(--surface-2)] cursor-pointer'

export default function ContactFormEdit({ contact }: ContactFormEditProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [type, setType] = useState(contact.type)
  const [status, setStatus] = useState(contact.status)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    const formData = new FormData(event.currentTarget)
    const tags = formData.get('tags')
      ? String(formData.get('tags')).split(',').map((t) => t.trim()).filter((t) => t.length > 0)
      : []
    const data = {
      firstName: String(formData.get('firstName')),
      lastName: String(formData.get('lastName')),
      email: String(formData.get('email')),
      phone: formData.get('phone') ? String(formData.get('phone')) : null,
      street: formData.get('street') ? String(formData.get('street')) : null,
      city: formData.get('city') ? String(formData.get('city')) : null,
      state: formData.get('state') ? String(formData.get('state')) : null,
      zip: formData.get('zip') ? String(formData.get('zip')) : null,
      country: 'USA',
      type: String(formData.get('type')),
      status: String(formData.get('status')),
      tags,
      notes: formData.get('notes') ? String(formData.get('notes')) : null,
    }
    try {
      const response = await fetch(`/api/contacts/${contact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (response.ok) {
        router.push(`/contacts/${contact.id}`)
        router.refresh()
      } else {
        setError(result.error || 'Failed to update contact')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="p-4 rounded-lg text-sm bg-[#F6EBE6] border border-[#EAD3C8] text-[#C0573F]">{error}</div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className={labelCls}>First Name <span className="text-[#C0573F]">*</span></label>
          <Input id="firstName" name="firstName" type="text" required defaultValue={contact.firstName} className="saga-input" />
        </div>
        <div>
          <label htmlFor="lastName" className={labelCls}>Last Name <span className="text-[#C0573F]">*</span></label>
          <Input id="lastName" name="lastName" type="text" required defaultValue={contact.lastName} className="saga-input" />
        </div>
      </div>

      {/* Contact Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className={labelCls}>Email <span className="text-[#C0573F]">*</span></label>
          <Input id="email" name="email" type="email" required defaultValue={contact.email} className="saga-input" />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Phone</label>
          <Input id="phone" name="phone" type="tel" defaultValue={contact.phone || ''} className="saga-input" />
        </div>
      </div>

      {/* Address */}
      <div>
        <label htmlFor="street" className={labelCls}>Street Address</label>
        <Input id="street" name="street" type="text" defaultValue={contact.street || ''} className="saga-input" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className={labelCls}>City</label>
          <Input id="city" name="city" type="text" defaultValue={contact.city || ''} className="saga-input" />
        </div>
        <div>
          <label htmlFor="state" className={labelCls}>State</label>
          <Input id="state" name="state" type="text" defaultValue={contact.state || ''} className="saga-input" />
        </div>
        <div>
          <label htmlFor="zip" className={labelCls}>ZIP Code</label>
          <Input id="zip" name="zip" type="text" defaultValue={contact.zip || ''} className="saga-input" />
        </div>
      </div>

      {/* Type and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className={labelCls}>Contact Type <span className="text-[#C0573F]">*</span></label>
          <Select name="type" value={type} onValueChange={setType} required>
            <SelectTrigger className="saga-input"><SelectValue /></SelectTrigger>
            <SelectContent className={selectContent}>
              <SelectItem value="DONOR" className={selectItem}>Donor</SelectItem>
              <SelectItem value="VOLUNTEER" className={selectItem}>Volunteer</SelectItem>
              <SelectItem value="BOARD_MEMBER" className={selectItem}>Board Member</SelectItem>
              <SelectItem value="STAFF" className={selectItem}>Staff</SelectItem>
              <SelectItem value="VENDOR" className={selectItem}>Vendor</SelectItem>
              <SelectItem value="OTHER" className={selectItem}>Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="status" className={labelCls}>Status <span className="text-[#C0573F]">*</span></label>
          <Select name="status" value={status} onValueChange={setStatus} required>
            <SelectTrigger className="saga-input"><SelectValue /></SelectTrigger>
            <SelectContent className={selectContent}>
              <SelectItem value="ACTIVE" className={selectItem}>Active</SelectItem>
              <SelectItem value="INACTIVE" className={selectItem}>Inactive</SelectItem>
              <SelectItem value="DECEASED" className={selectItem}>Deceased</SelectItem>
              <SelectItem value="DO_NOT_CONTACT" className={selectItem}>Do Not Contact</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className={labelCls}>Tags <span className="text-[var(--ink-faint)] text-xs">(comma-separated)</span></label>
        <Input id="tags" name="tags" type="text" placeholder="major-donor, monthly-giver, volunteer" defaultValue={contact.tags.join(', ')} className="saga-input" />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className={labelCls}>Notes</label>
        <textarea id="notes" name="notes" rows={4} defaultValue={contact.notes || ''} className="saga-input w-full resize-none" placeholder="Any additional information about this contact..." />
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="saga-button text-white font-semibold border-none">
          {isSubmitting ? (
            'Saving...'
          ) : (
            <span className="flex items-center gap-2">
              <Check size={18} weight="bold" />
              Save Changes
            </span>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting} className="text-[var(--ink)] border-[var(--line)] hover:bg-[var(--surface-2)]">
          Cancel
        </Button>
      </div>
    </form>
  )
}
