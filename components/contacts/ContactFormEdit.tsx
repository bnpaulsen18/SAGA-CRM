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
import { updateContact } from '@/app/actions/contacts'

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

    try {
      const result = await updateContact(contact.id, formData)

      if (result.success) {
        // Redirect back to contact detail page
        router.push(`/contacts/${contact.id}`)
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          className="p-4 rounded-lg text-sm"
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#ef4444'
          }}
        >
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
            defaultValue={contact.firstName}
            className="text-white"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
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
            defaultValue={contact.lastName}
            className="text-white"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
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
            defaultValue={contact.email}
            className="text-white"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
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
            defaultValue={contact.phone || ''}
            className="text-white"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
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
          defaultValue={contact.street || ''}
          className="text-white"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
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
            defaultValue={contact.city || ''}
            className="text-white"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
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
            defaultValue={contact.state || ''}
            className="text-white"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
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
            defaultValue={contact.zip || ''}
            className="text-white"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          />
        </div>
      </div>

      {/* Type and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-white mb-2">
            Contact Type <span className="text-red-400">*</span>
          </label>
          <Select name="type" value={type} onValueChange={setType} required>
            <SelectTrigger
              className="text-white"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              style={{
                background: 'rgba(26, 10, 46, 0.98)',
                border: '1px solid rgba(255, 107, 53, 0.3)'
              }}
            >
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
          <Select name="status" value={status} onValueChange={setStatus} required>
            <SelectTrigger
              className="text-white"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              style={{
                background: 'rgba(26, 10, 46, 0.98)',
                border: '1px solid rgba(255, 107, 53, 0.3)'
              }}
            >
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
          defaultValue={contact.tags.join(', ')}
          className="text-white placeholder:text-white/40"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
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
          defaultValue={contact.notes || ''}
          className="w-full px-3 py-2 rounded-md text-white placeholder:text-white/40 resize-none"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          placeholder="Any additional information about this contact..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="text-white font-semibold"
          style={{
            background: isSubmitting
              ? 'rgba(118, 75, 162, 0.5)'
              : 'linear-gradient(to right, #764ba2, #ff6b35)',
            border: 'none'
          }}
        >
          {isSubmitting ? 'Saving...' : '✓ Save Changes'}
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
