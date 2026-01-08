'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface Campaign {
  id: string
  name: string
}

interface Donation {
  id: string
  contactId: string
  amount: number
  fundRestriction: string
  method: string
  type: string
  campaignId: string | null
  transactionId: string | null
  notes: string | null
  donatedAt: Date
}

interface DonationEditFormProps {
  donation: Donation
  contacts: Contact[]
  campaigns: Campaign[]
}

export default function DonationEditForm({ donation, contacts, campaigns }: DonationEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    contactId: donation.contactId,
    amount: donation.amount.toString(),
    fundRestriction: donation.fundRestriction,
    method: donation.method,
    type: donation.type,
    campaignId: donation.campaignId || '',
    transactionId: donation.transactionId || '',
    notes: donation.notes || '',
    donatedAt: new Date(donation.donatedAt).toISOString().split('T')[0]
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/donations/${donation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          campaignId: formData.campaignId || null,
          transactionId: formData.transactionId || null,
          notes: formData.notes || null,
          donatedAt: new Date(formData.donatedAt)
        })
      })

      if (response.ok) {
        router.push(`/donations/${donation.id}`)
        router.refresh()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to update donation'}`)
      }
    } catch (error) {
      console.error('Error updating donation:', error)
      alert('Failed to update donation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Selection */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Donor <span className="text-red-400">*</span>
        </label>
        <select
          required
          value={formData.contactId}
          onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select a donor...</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id} className="bg-[#1a1a2e]">
              {contact.firstName} {contact.lastName} ({contact.email})
            </option>
          ))}
        </select>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Amount (USD) <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-2.5 text-white/60">$</span>
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full pl-8 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="100.00"
          />
        </div>
      </div>

      {/* Donation Date */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Donation Date <span className="text-red-400">*</span>
        </label>
        <input
          type="date"
          required
          value={formData.donatedAt}
          onChange={(e) => setFormData({ ...formData, donatedAt: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Fund Restriction */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">Fund Restriction</label>
        <select
          value={formData.fundRestriction}
          onChange={(e) => setFormData({ ...formData, fundRestriction: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="UNRESTRICTED" className="bg-[#1a1a2e]">Unrestricted</option>
          <option value="PROGRAM_RESTRICTED" className="bg-[#1a1a2e]">Program Restricted</option>
          <option value="TEMPORARILY_RESTRICTED" className="bg-[#1a1a2e]">Temporarily Restricted</option>
          <option value="PERMANENTLY_RESTRICTED" className="bg-[#1a1a2e]">Permanently Restricted (Endowment)</option>
          <option value="PROJECT_DESIGNATED" className="bg-[#1a1a2e]">Project Designated</option>
        </select>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">Payment Method</label>
        <select
          value={formData.method}
          onChange={(e) => setFormData({ ...formData, method: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="CREDIT_CARD" className="bg-[#1a1a2e]">Credit Card</option>
          <option value="DEBIT_CARD" className="bg-[#1a1a2e]">Debit Card</option>
          <option value="BANK_TRANSFER" className="bg-[#1a1a2e]">Bank Transfer</option>
          <option value="CHECK" className="bg-[#1a1a2e]">Check</option>
          <option value="CASH" className="bg-[#1a1a2e]">Cash</option>
          <option value="PAYPAL" className="bg-[#1a1a2e]">PayPal</option>
          <option value="VENMO" className="bg-[#1a1a2e]">Venmo</option>
          <option value="OTHER" className="bg-[#1a1a2e]">Other</option>
        </select>
      </div>

      {/* Donation Type */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">Donation Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="ONE_TIME" className="bg-[#1a1a2e]">One-Time</option>
          <option value="MONTHLY" className="bg-[#1a1a2e]">Monthly Recurring</option>
          <option value="QUARTERLY" className="bg-[#1a1a2e]">Quarterly Recurring</option>
          <option value="ANNUAL" className="bg-[#1a1a2e]">Annual Recurring</option>
          <option value="IN_KIND" className="bg-[#1a1a2e]">In-Kind</option>
          <option value="STOCK" className="bg-[#1a1a2e]">Stock/Securities</option>
        </select>
      </div>

      {/* Campaign (Optional) */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">Campaign (Optional)</label>
        <select
          value={formData.campaignId}
          onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">No campaign</option>
          {campaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id} className="bg-[#1a1a2e]">
              {campaign.name}
            </option>
          ))}
        </select>
      </div>

      {/* Transaction ID */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Transaction/Check Number (Optional)
        </label>
        <input
          type="text"
          value={formData.transactionId}
          onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Check #12345 or TXN-ABC123"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">Notes (Optional)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          placeholder="Additional notes about this donation..."
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 text-white font-semibold saga-button border-none"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/donations/${donation.id}`)}
          className="text-white border-white/30 hover:bg-white/10"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
