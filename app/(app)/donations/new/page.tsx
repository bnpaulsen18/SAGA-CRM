'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Turnstile } from '@marsidev/react-turnstile';

const bricolage = { fontFamily: 'var(--font-bricolage), sans-serif' } as const;
const inputCls =
  'w-full px-4 py-3 bg-[var(--paper)] border border-[var(--line)] rounded-lg text-[var(--ink)] placeholder-[var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-[#5B4B8A] focus:border-transparent';

function NewDonationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [aiThankYou, setAiThankYou] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    contactId: searchParams.get('contactId') || '',
    amount: '',
    fundRestriction: 'UNRESTRICTED',
    method: 'CREDIT_CARD',
    type: 'ONE_TIME',
    campaignId: '',
    transactionId: '',
    notes: '',
    donatedAt: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [contactsRes, campaignsRes] = await Promise.all([fetch('/api/contacts'), fetch('/api/campaigns')]);
        if (contactsRes.ok) setContacts(await contactsRes.json());
        if (campaignsRes.ok) setCampaigns(await campaignsRes.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.contactId && formData.amount && parseFloat(formData.amount) > 0) {
      generateAIPreview();
    } else {
      setAiThankYou('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      alert('Please complete the security check before submitting.');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          campaignId: formData.campaignId || null,
          donatedAt: new Date(formData.donatedAt),
          turnstileToken,
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
    <>
      <div className="max-w-4xl mx-auto mb-8">
        <Link href="/donations" className="inline-flex items-center gap-1 text-[var(--ink-soft)] hover:text-[var(--ink)] mb-4 transition-colors text-sm">
          ← Back to Donations
        </Link>
        <h1 className="text-3xl font-bold text-[var(--ink)] mb-2" style={bricolage}>New Donation</h1>
        <p className="text-[var(--ink-soft)]">Record a new donation and generate a receipt</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-8">
            <div className="mb-6">
              <label className="block text-[var(--ink)] font-medium mb-2">Donor <span className="text-[#C0573F]">*</span></label>
              <select required value={formData.contactId} onChange={(e) => setFormData({ ...formData, contactId: e.target.value })} className={inputCls}>
                <option value="">Select a donor...</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>{contact.firstName} {contact.lastName} ({contact.email})</option>
                ))}
              </select>
              <p className="text-sm text-[var(--ink-faint)] mt-1">
                Don&apos;t see the donor?{' '}
                <Link href="/contacts/new" className="text-[#5B4B8A] hover:underline">Add new contact</Link>
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-[var(--ink)] font-medium mb-2">Amount (USD) <span className="text-[#C0573F]">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-[var(--ink-faint)] text-lg">$</span>
                <input type="number" required min="0.01" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className={`${inputCls} pl-8`} placeholder="100.00" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[var(--ink)] font-medium mb-2">Donation Date <span className="text-[#C0573F]">*</span></label>
              <input type="date" required value={formData.donatedAt} onChange={(e) => setFormData({ ...formData, donatedAt: e.target.value })} className={inputCls} />
            </div>

            <div className="mb-6">
              <label className="block text-[var(--ink)] font-medium mb-2">Fund Restriction</label>
              <select value={formData.fundRestriction} onChange={(e) => setFormData({ ...formData, fundRestriction: e.target.value })} className={inputCls}>
                <option value="UNRESTRICTED">Unrestricted</option>
                <option value="PROGRAM_RESTRICTED">Program Restricted</option>
                <option value="TEMPORARILY_RESTRICTED">Temporarily Restricted</option>
                <option value="PERMANENTLY_RESTRICTED">Permanently Restricted (Endowment)</option>
                <option value="PROJECT_DESIGNATED">Project Designated</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-[var(--ink)] font-medium mb-2">Payment Method</label>
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

            <div className="mb-6">
              <label className="block text-[var(--ink)] font-medium mb-2">Donation Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className={inputCls}>
                <option value="ONE_TIME">One-Time</option>
                <option value="MONTHLY">Monthly Recurring</option>
                <option value="QUARTERLY">Quarterly Recurring</option>
                <option value="ANNUAL">Annual Recurring</option>
                <option value="IN_KIND">In-Kind</option>
                <option value="STOCK">Stock/Securities</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-[var(--ink)] font-medium mb-2">Campaign (Optional)</label>
              <select value={formData.campaignId} onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })} className={inputCls}>
                <option value="">No campaign</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-[var(--ink)] font-medium mb-2">Transaction/Check Number (Optional)</label>
              <input type="text" value={formData.transactionId} onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })} className={inputCls} placeholder="Check #12345 or TXN-ABC123" />
            </div>

            <div className="mb-6">
              <label className="block text-[var(--ink)] font-medium mb-2">Notes (Optional)</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className={`${inputCls} resize-none`} placeholder="Additional notes about this donation..." />
            </div>

            {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
              <div className="mb-6 flex justify-center">
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => setTurnstileToken(null)}
                  onExpire={() => setTurnstileToken(null)}
                  options={{ theme: 'light', size: 'normal' }}
                />
              </div>
            )}

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="flex-1 px-6 py-3 rounded-lg text-white font-medium hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)' }}>
                {loading ? 'Saving...' : 'Save Donation'}
              </button>
              <Link href="/donations" className="px-6 py-3 bg-[var(--surface)] border border-[var(--line)] rounded-lg text-[var(--ink)] font-medium hover:bg-[var(--surface-2)] transition-colors text-center">
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* AI Preview Panel */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 sticky top-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✨</span>
              <h3 className="text-lg font-semibold text-[var(--ink)]">AI Thank-You Preview</h3>
            </div>

            {loadingAI ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-[#E0507A] rounded-full animate-bounce" />
                  <div className="w-3 h-3 bg-[#E0507A] rounded-full animate-bounce delay-100" />
                  <div className="w-3 h-3 bg-[#E0507A] rounded-full animate-bounce delay-200" />
                </div>
              </div>
            ) : aiThankYou ? (
              <div className="bg-[var(--paper)] border border-[var(--line)] rounded-lg p-4">
                <p className="text-[var(--ink)] text-sm leading-relaxed whitespace-pre-wrap">{aiThankYou}</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-[var(--ink-soft)] text-sm">
                  {formData.contactId && formData.amount
                    ? 'AI is generating a personalized thank-you message...'
                    : 'Fill in the donor and amount to see an AI-generated thank-you message'}
                </p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-[var(--line)]">
              <p className="text-xs text-[var(--ink-faint)]">This AI-generated message will be included in the donation receipt email.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function NewDonationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--paper)]" />}>
      <NewDonationForm />
    </Suspense>
  );
}
