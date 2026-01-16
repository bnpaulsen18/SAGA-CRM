'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'
import { CurrencyDollar, Heart, CheckCircle, Warning } from '@phosphor-icons/react'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PublicDonationFormProps {
  organizationId: string
  organizationName: string
  campaignId?: string
  campaignName?: string
  embedded?: boolean
}

const PRESET_AMOUNTS = [25, 50, 100, 250, 500, 1000]

export default function PublicDonationForm({
  organizationId,
  organizationName,
  campaignId,
  campaignName,
  embedded = false
}: PublicDonationFormProps) {
  const [amount, setAmount] = useState<number | ''>(100)
  const [customAmount, setCustomAmount] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Contact information
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  const handlePresetClick = (presetAmount: number) => {
    setAmount(presetAmount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue)
    } else {
      setAmount('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!amount || amount <= 0) {
      setError('Please enter a valid donation amount')
      return
    }
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your name')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setError(null)
    setLoading(true)

    try {
      // Create Stripe Checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          organizationId,
          campaignId,
          isRecurring,
          donorInfo: {
            firstName,
            lastName,
            email
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout URL
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL provided')
      }
    } catch (err) {
      console.error('Donation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to process donation')
      setLoading(false)
    }
  }

  const containerClass = embedded
    ? 'max-w-2xl mx-auto p-6'
    : 'min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] p-8 flex items-center justify-center'

  if (success) {
    return (
      <div className={containerClass}>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center max-w-md mx-auto">
          <CheckCircle size={64} weight="bold" className="text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
          <p className="text-white/70">
            Your donation has been processed successfully. You'll receive a receipt via email shortly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={containerClass}>
      <div
        className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8"
        style={embedded ? {} : undefined}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 mb-4">
            <Heart size={32} weight="fill" className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Support {organizationName}
          </h1>
          {campaignName && (
            <p className="text-white/70 text-lg">{campaignName}</p>
          )}
          <p className="text-white/60 text-sm mt-2">
            Your donation makes a real difference
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <Warning size={24} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Donation Amount */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-3">
              Donation Amount
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {PRESET_AMOUNTS.map((presetAmount) => (
                <button
                  key={presetAmount}
                  type="button"
                  onClick={() => handlePresetClick(presetAmount)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                    amount === presetAmount && !customAmount
                      ? 'bg-gradient-to-r from-purple-500 to-orange-500 text-white'
                      : 'bg-white/5 text-white border border-white/20 hover:bg-white/10'
                  }`}
                  disabled={loading}
                >
                  ${presetAmount}
                </button>
              ))}
            </div>
            <div className="relative">
              <CurrencyDollar
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
              />
              <input
                type="number"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder="Custom amount"
                min="1"
                step="0.01"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Recurring Option */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
                disabled={loading}
              />
              <span className="text-white font-medium">
                Make this a monthly recurring donation
              </span>
            </label>
            {isRecurring && (
              <p className="text-white/60 text-sm mt-2 ml-8">
                You'll be charged ${amount || 0} every month. Cancel anytime.
              </p>
            )}
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-3">
              Your Information
            </label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                disabled={loading}
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                disabled={loading}
              />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
              disabled={loading}
            />
            <p className="text-white/50 text-xs mt-2">
              We'll send your tax receipt to this email
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !amount || amount <= 0}
            className="w-full text-white py-6 text-lg font-bold"
            style={{ background: 'linear-gradient(to right, #764ba2, #ff6b35)' }}
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                <Heart size={24} weight="fill" />
                Donate ${amount || 0}
                {isRecurring && '/month'}
              </>
            )}
          </Button>

          <p className="text-white/50 text-xs text-center mt-4">
            Secure payment powered by Stripe. Your donation is tax-deductible.
          </p>
        </form>
      </div>
    </div>
  )
}
