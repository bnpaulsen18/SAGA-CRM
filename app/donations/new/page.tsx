'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewDonationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [aiThankYou, setAiThankYou] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    contactId: '',
    amount: '',
    fundRestriction: 'UNRESTRICTED',
    method: 'CREDIT_CARD',
    type: 'ONE_TIME',
    campaignId: '',
    transactionId: '',
    notes: '',
    donatedAt: new Date().toISOString().split('T')[0], // Today's date
  });

  // Fetch contacts and campaigns
  useEffect(() => {
    async function fetchData() {
      try {
        const [contactsRes, campaignsRes] = await Promise.all([
          fetch('/api/contacts'),
          fetch('/api/campaigns'),
        ]);

        if (contactsRes.ok) {
          const contactsData = await contactsRes.json();
          setContacts(contactsData);
        }

        if (campaignsRes.ok) {
          const campaignsData = await campaignsRes.json();
          setCampaigns(campaignsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  // Generate AI thank-you message preview
  useEffect(() => {
    if (formData.contactId && formData.amount && parseFloat(formData.amount) > 0) {
      generateAIPreview();
    } else {
      setAiThankYou('');
    }
  }, [formData.contactId, formData.amount, formData.fundRestriction]);

  async function generateAIPreview() {
    setLoadingAI(true);
    try {
      const selectedContact = contacts.find((c) => c.id === formData.contactId);
      if (!selectedContact) return;

      const response = await fetch('/api/ai/receipt-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactFirstName: selectedContact.firstName,
          contactLastName: selectedContact.lastName,
          amount: parseFloat(formData.amount),
          fundRestriction: formData.fundRestriction,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiThankYou(data.message);
      }
    } catch (error) {
      console.error('Error generating AI preview:', error);
    } finally {
      setLoadingAI(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          campaignId: formData.campaignId || null,
          donatedAt: new Date(formData.donatedAt),
        }),
      });

      if (response.ok) {
        router.push('/donations');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create donation'}`);
      }
    } catch (error) {
      console.error('Error creating donation:', error);
      alert('Failed to create donation. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/donations"
          className="inline-flex items-center text-white/60 hover:text-white mb-4 transition-colors"
        >
          <span className="mr-2">←</span> Back to Donations
        </Link>
        <h1 className="text-4xl font-bold text-white mb-2">New Donation</h1>
        <p className="text-white/60">Record a new donation and generate a receipt</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            {/* Contact Selection */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">
                Donor <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={formData.contactId}
                onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent"
              >
                <option value="">Select a donor...</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id} className="bg-[#1a1a2e]">
                    {contact.firstName} {contact.lastName} ({contact.email})
                  </option>
                ))}
              </select>
              <p className="text-sm text-white/50 mt-1">
                Don't see the donor?{' '}
                <Link href="/contacts/new" className="text-[#ffa07a] hover:underline">
                  Add new contact
                </Link>
              </p>
            </div>

            {/* Amount */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">
                Amount (USD) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-white/60 text-lg">$</span>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent"
                  placeholder="100.00"
                />
              </div>
            </div>

            {/* Donation Date */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">
                Donation Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.donatedAt}
                onChange={(e) => setFormData({ ...formData, donatedAt: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent"
              />
            </div>

            {/* Fund Restriction */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Fund Restriction</label>
              <select
                value={formData.fundRestriction}
                onChange={(e) => setFormData({ ...formData, fundRestriction: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent"
              >
                <option value="UNRESTRICTED" className="bg-[#1a1a2e]">Unrestricted</option>
                <option value="PROGRAM_RESTRICTED" className="bg-[#1a1a2e]">Program Restricted</option>
                <option value="TEMPORARILY_RESTRICTED" className="bg-[#1a1a2e]">Temporarily Restricted</option>
                <option value="PERMANENTLY_RESTRICTED" className="bg-[#1a1a2e]">Permanently Restricted (Endowment)</option>
                <option value="PROJECT_DESIGNATED" className="bg-[#1a1a2e]">Project Designated</option>
              </select>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Payment Method</label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent"
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
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Donation Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent"
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
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Campaign (Optional)</label>
              <select
                value={formData.campaignId}
                onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent"
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
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Transaction/Check Number (Optional)</label>
              <input
                type="text"
                value={formData.transactionId}
                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent"
                placeholder="Check #12345 or TXN-ABC123"
              />
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent resize-none"
                placeholder="Additional notes about this donation..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#764ba2] to-[#667eea] rounded-lg text-white font-medium hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Donation'}
              </button>
              <Link
                href="/donations"
                className="px-6 py-3 bg-white/5 border border-white/20 rounded-lg text-white font-medium hover:bg-white/10 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* AI Preview Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sticky top-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✨</span>
              <h3 className="text-lg font-semibold text-white">AI Thank-You Preview</h3>
            </div>

            {loadingAI ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-[#764ba2] rounded-full animate-bounce" />
                  <div className="w-3 h-3 bg-[#764ba2] rounded-full animate-bounce delay-100" />
                  <div className="w-3 h-3 bg-[#764ba2] rounded-full animate-bounce delay-200" />
                </div>
              </div>
            ) : aiThankYou ? (
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                  {aiThankYou}
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-white/60 text-sm">
                  {formData.contactId && formData.amount
                    ? 'AI is generating a personalized thank-you message...'
                    : 'Fill in the donor and amount to see an AI-generated thank-you message'}
                </p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-white/50">
                This AI-generated message will be included in the donation receipt email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
