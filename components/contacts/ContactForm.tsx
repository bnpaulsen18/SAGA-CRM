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
import { createContact } from '@/app/actions/contacts'
import { Check } from '@phosphor-icons/react'

const labelCls = 'block text-sm font-medium text-[var(--ink)] mb-2'
const selectContent = 'bg-[var(--surface)] border border-[var(--line)]'
const selectItem = 'text-[var(--ink)] focus:bg-[var(--surface-2)] hover:bg-[var(--surface-2)] cursor-pointer'

export default function ContactForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    const formData = new FormData(event.currentTarget)
    try {
      const result = await createContact(formData)
      if (result.success) {
        router.push(`/contacts/${result.contactId}`)
      } else {
        setError(result.error || 'Failed to create contact')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg text-sm bg-[#F6EBE6] border border-[#EAD3C8] text-[#C0573F]">
          {error}
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className={labelCls}>First Name <span className="text-[#C0573F]">*</span></label>
          <Input id="firstName" name="firstName" type="text" required className="saga-input" />
        </div>
        <div>
          <label htmlFor="lastName" className={labelCls}>Last Name <span className="text-[#C0573F]">*</span></label>
          <Input id="lastName" name="lastName" type="text" required className="saga-input" />
        </div>
      </div>

      {/* Contact Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className={labelCls}>Email <span className="text-[#C0573F]">*</span></label>
          <Input id="email" name="email" type="email" required className="saga-input" />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Phone</label>
          <Input id="phone" name="phone" type="tel" className="saga-input" />
        </div>
      </div>

      {/* Address */}
      <div>
        <label htmlFor="street" className={labelCls}>Street Address</label>
        <Input id="street" name="street" type="text" className="saga-input" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className={labelCls}>City</label>
          <Input id="city" name="city" type="text" className="saga-input" />
        </div>
        <div>
          <label htmlFor="state" className={labelCls}>State</label>
          <Input id="state" name="state" type="text" className="saga-input" />
        </div>
        <div>
          <label htmlFor="zip" className={labelCls}>ZIP Code</label>
          <Input id="zip" name="zip" type="text" className="saga-input" />
        </div>
      </div>

      {/* Type and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className={labelCls}>Contact Type <span className="text-[#C0573F]">*</span></label>
          <Select name="type" defaultValue="DONOR" required>
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
          <Select name="status" defaultValue="ACTIVE" required>
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
        <label htmlFor="tags" className={labelCls}>
          Tags <span className="text-[var(--ink-faint)] text-xs">(comma-separated)</span>
        </label>
        <Input id="tags" name="tags" type="text" placeholder="major-donor, monthly-giver, volunteer" className="saga-input" />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className={labelCls}>Notes</label>
        <textarea id="notes" name="notes" rows={4} className="saga-input w-full resize-none" placeholder="Any additional information about this contact..." />
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="saga-button text-white font-semibold border-none">
          {isSubmitting ? (
            'Creating...'
          ) : (
            <span className="flex items-center gap-2">
              <Check size={18} weight="bold" />
              Create Contact
            </span>
          )}
        </Button>
        <Button
          type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}
          className="text-[var(--ink)] border-[var(--line)] hover:bg-[var(--surface-2)]"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
