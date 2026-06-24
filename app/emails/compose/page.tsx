'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import SagaCard from '@/components/ui/saga-card'
import DashboardLayout from '@/components/DashboardLayout'
import { PaperPlaneTilt, Warning, CheckCircle } from '@phosphor-icons/react'

type SegmentType = 'ALL' | 'DONORS' | 'MONTHLY_DONORS' | 'RECENT_DONORS' | 'MAJOR_DONORS'

interface FormState {
  subject: string
  body: string
  segment: SegmentType
  previewText: string
}

const bricolage = { fontFamily: 'var(--font-bricolage), sans-serif' } as const

export default function EmailComposePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [form, setForm] = useState<FormState>({ subject: '', body: '', segment: 'ALL', previewText: '' })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [recipientCount, setRecipientCount] = useState<number | null>(null)

  const updateRecipientCount = async (segment: SegmentType) => {
    try {
      const response = await fetch(`/api/emails/recipient-count?segment=${segment}`)
      const data = await response.json()
      setRecipientCount(data.count)
    } catch (error) {
      console.error('Failed to fetch recipient count:', error)
      setRecipientCount(null)
    }
  }

  useEffect(() => {
    updateRecipientCount(form.segment)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSegmentChange = (segment: SegmentType) => {
    setForm({ ...form, segment })
    updateRecipientCount(segment)
  }

  const handleSend = async () => {
    if (!form.subject.trim()) { setError('Please enter a subject line'); return }
    if (!form.body.trim()) { setError('Please enter email content'); return }
    setError(null)
    setSending(true)
    try {
      const response = await fetch('/api/emails/send-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to send campaign')
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send campaign')
      setSending(false)
    }
  }

  const layoutProps = {
    userName: session?.user?.name || session?.user?.email || 'User',
    userRole: (session?.user as { role?: string } | undefined)?.role,
    searchPlaceholder: 'Search…',
  }

  const inputCls =
    'w-full px-4 py-2.5 bg-[var(--paper)] border border-[var(--line)] rounded-lg text-[var(--ink)] placeholder-[var(--ink-faint)] focus:outline-none focus:border-[#5B4B8A]'

  if (success) {
    return (
      <DashboardLayout {...layoutProps}>
        <div className="flex items-center justify-center py-20">
          <SagaCard className="max-w-md text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle size={64} weight="bold" className="text-[#4A8C6F]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--ink)] mb-2" style={bricolage}>Campaign Sent!</h1>
            <p className="text-[var(--ink-soft)]">Your email campaign is being sent to {recipientCount} recipients.</p>
          </SagaCard>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout {...layoutProps}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--ink)] mb-2" style={bricolage}>Compose Email Campaign</h1>
          <p className="text-[var(--ink-soft)]">Send personalized emails to your contacts</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#F6EBE6] border border-[#EAD3C8] rounded-lg flex items-start gap-3">
            <Warning size={24} className="text-[#C0573F] shrink-0 mt-0.5" />
            <p className="text-[#C0573F]">{error}</p>
          </div>
        )}

        <SagaCard>
          <div className="space-y-6">
            {/* Recipient Segment */}
            <div>
              <label className="block text-[var(--ink)] font-medium mb-2">Recipients</label>
              <select
                value={form.segment}
                onChange={(e) => handleSegmentChange(e.target.value as SegmentType)}
                className={inputCls}
                disabled={sending}
              >
                <option value="ALL">All Contacts</option>
                <option value="DONORS">All Donors</option>
                <option value="MONTHLY_DONORS">Monthly Donors</option>
                <option value="RECENT_DONORS">Recent Donors (Last 90 Days)</option>
                <option value="MAJOR_DONORS">Major Donors ($1000+)</option>
              </select>
              {recipientCount !== null && (
                <p className="text-sm text-[var(--ink-faint)] mt-2">
                  {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Subject Line */}
            <div>
              <label className="block text-[var(--ink)] font-medium mb-2">Subject Line</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Your email subject..."
                className={inputCls}
                disabled={sending}
              />
            </div>

            {/* Preview Text */}
            <div>
              <label className="block text-[var(--ink)] font-medium mb-2">
                Preview Text <span className="text-[var(--ink-faint)] text-sm font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={form.previewText}
                onChange={(e) => setForm({ ...form, previewText: e.target.value })}
                placeholder="Text shown in email inbox preview..."
                className={inputCls}
                disabled={sending}
              />
            </div>

            {/* Email Body */}
            <div>
              <label className="block text-[var(--ink)] font-medium mb-2">Email Content</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Write your email content here...&#10;&#10;You can use these variables:&#10;{{firstName}} - Contact's first name&#10;{{lastName}} - Contact's last name&#10;{{organizationName}} - Your organization name"
                rows={12}
                className={`${inputCls} font-mono text-sm resize-none`}
                disabled={sending}
              />
              <p className="text-xs text-[var(--ink-faint)] mt-2">
                Tip: Use <code className="px-1.5 py-0.5 bg-[var(--surface-2)] text-[#5B4B8A] rounded">{'{{firstName}}'}</code> to personalize emails
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSend}
                disabled={sending || !form.subject || !form.body}
                className="flex-1 text-white"
                style={{ background: 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)' }}
              >
                {sending ? (
                  'Sending...'
                ) : (
                  <>
                    <PaperPlaneTilt size={20} weight="bold" />
                    Send Campaign
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                disabled={sending}
                className="text-[var(--ink)] border-[var(--line)] hover:bg-[var(--surface-2)]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </SagaCard>
      </div>
    </DashboardLayout>
  )
}
