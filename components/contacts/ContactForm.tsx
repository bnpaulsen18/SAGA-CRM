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
        // Redirect to contact detail page
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
        <div className="p-4 rounded-lg text-sm bg-red-500/20 border border-red-500/40 text-red-400">
          {error}
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
            First Name <span className="text-red-400">*</span>
          </label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            required
            className="saga-input"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
            Last Name <span className="text-red-400">*</span>
          </label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            required
            className="saga-input"
          />
        </div>
      </div>

      {/* Contact Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
            Email <span className="text-red-400">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="saga-input"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
            Phone
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            className="saga-input"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label htmlFor="street" className="block text-sm font-medium text-white mb-2">
          Street Address
        </label>
        <Input
          id="street"
          name="street"
          type="text"
          className="saga-input"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-white mb-2">
            City
          </label>
          <Input
            id="city"
            name="city"
            type="text"
            className="saga-input"
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-white mb-2">
            State
          </label>
          <Input
            id="state"
            name="state"
            type="text"
            className="saga-input"
          />
        </div>

        <div>
          <label htmlFor="zip" className="block text-sm font-medium text-white mb-2">
            ZIP Code
          </label>
          <Input
            id="zip"
            name="zip"
            type="text"
            className="saga-input"
          />
        </div>
      </div>

      {/* Type and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-white mb-2">
            Contact Type <span className="text-red-400">*</span>
          </label>
          <Select name="type" defaultValue="DONOR" required>
            <SelectTrigger className="saga-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a0a2e]/[0.98] saga-border-orange">
              <SelectItem value="DONOR" className="text-white hover:bg-white/10">Donor</SelectItem>
              <SelectItem value="VOLUNTEER" className="text-white hover:bg-white/10">Volunteer</SelectItem>
              <SelectItem value="BOARD_MEMBER" className="text-white hover:bg-white/10">Board Member</SelectItem>
              <SelectItem value="STAFF" className="text-white hover:bg-white/10">Staff</SelectItem>
              <SelectItem value="VENDOR" className="text-white hover:bg-white/10">Vendor</SelectItem>
              <SelectItem value="OTHER" className="text-white hover:bg-white/10">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-white mb-2">
            Status <span className="text-red-400">*</span>
          </label>
          <Select name="status" defaultValue="ACTIVE" required>
            <SelectTrigger className="saga-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a0a2e]/[0.98] saga-border-orange">
              <SelectItem value="ACTIVE" className="text-white hover:bg-white/10">Active</SelectItem>
              <SelectItem value="INACTIVE" className="text-white hover:bg-white/10">Inactive</SelectItem>
              <SelectItem value="DECEASED" className="text-white hover:bg-white/10">Deceased</SelectItem>
              <SelectItem value="DO_NOT_CONTACT" className="text-white hover:bg-white/10">Do Not Contact</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-white mb-2">
          Tags <span className="text-white/50 text-xs">(comma-separated)</span>
        </label>
        <Input
          id="tags"
          name="tags"
          type="text"
          placeholder="major-donor, monthly-giver, volunteer"
          className="saga-input"
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-white mb-2">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          className="saga-input w-full resize-none"
          placeholder="Any additional information about this contact..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`text-white font-semibold border-none ${
            isSubmitting ? 'bg-purple-600/50' : 'saga-button'
          }`}
        >
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
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="text-white border-white/30 hover:bg-white/10"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
