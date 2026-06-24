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

const labelCls = 'block text-sm font-medium text-[var(--ink-soft)] mb-2'
const inputCls = 'w-full px-4 py-2 bg-[var(--paper)] border border-[var(--line)] rounded-lg text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[#5B4B8A] focus:border-transparent'

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
    donatedAt: new Date(donation.donatedAt).toISOString().split('T')[0],
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
          donatedAt: new Date(formData.donatedAt),
        }),
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
      <div>
        <label className={labelCls}>Donor <span className="text-[#C0573F]">*</span></label>
        <select required value={formData.contactId} onChange={(e) => setFormData({ ...formData, contactId: e.target.value })} className={inputCls}>
          <option value="">Select a donor...</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>{contact.firstName} {contact.lastName} ({contact.email})</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>Amount (USD) <span className="text-[#C0573F]">*</span></label>
        <div className="relative">
          <span className="absolute left-4 top-2.5 text-[var(--ink-faint)]">$</span>
          <input type="number" required min="0.01" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className={`${inputCls} pl-8`} placeholder="100.00" />
        </div>
      </div>

      <div>
        <label className={labelCls}>Donation Date <span className="text-[#C0573F]">*</span></label>
        <input type="date" required value={formData.donatedAt} onChange={(e) => setFormData({ ...formData, donatedAt: e.target.value })} className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Fund Restriction</label>
        <select value={formData.fundRestriction} onChange={(e) => setFormData({ ...formData, fundRestriction: e.target.value })} className={inputCls}>
          <option value="UNRESTRICTED">Unrestricted</option>
          <option value="PROGRAM_RESTRICTED">Program Restricted</option>
          <option value="TEMPORARILY_RESTRICTED">Temporarily Restricted</option>
          <option value="PERMANENTLY_RESTRICTED">Permanently Restricted (Endowment)</option>
          <option value="PROJECT_DESIGNATED">Project Designated</option>
        </select>
      </div>

      <div>
        <label className={labelCls}>Payment Method</label>
        <select value={formData.method} onChange={(e) => setFormData({ ...formData, method: e.target.value })} className={inputCls}>
          <option value="CREDIT_CARD">Credit Card</option>
          <option value="DEBIT_CARD">Debit Card</option>
          <option value="BANK_TRANSFER">Bank Transfer</option>
          <option value="CHECK">Check</option>
          <option value="CASH">Cash</option>
          <option value="PAYPAL">PayPal</option>
          <option value="VENMO">Venmo</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div>
        <label className={labelCls}>Donation Type</label>
        <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className={inputCls}>
          <option value="ONE_TIME">One-Time</option>
          <option value="MONTHLY">Monthly Recurring</option>
          <option value="QUARTERLY">Quarterly Recurring</option>
          <option value="ANNUAL">Annual Recurring</option>
          <option value="IN_KIND">In-Kind</option>
          <option value="STOCK">Stock/Securities</option>
        </select>
      </div>

      <div>
        <label className={labelCls}>Campaign (Optional)</label>
        <select value={formData.campaignId} onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })} className={inputCls}>
          <option value="">No campaign</option>
          {campaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>Transaction/Check Number (Optional)</label>
        <input type="text" value={formData.transactionId} onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })} className={inputCls} placeholder="Check #12345 or TXN-ABC123" />
      </div>

      <div>
        <label className={labelCls}>Notes (Optional)</label>
        <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className={`${inputCls} resize-none`} placeholder="Additional notes about this donation..." />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading} className="flex-1 text-white font-semibold saga-button border-none">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(`/donations/${donation.id}`)} className="text-[var(--ink)] border-[var(--line)] hover:bg-[var(--surface-2)]">
          Cancel
        </Button>
      </div>
    </form>
  )
}
