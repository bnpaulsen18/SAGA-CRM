/**
 * Email Capture Form - Landing Page Newsletter Signup
 * Option 2: Emotional Impact Design
 */

'use client'

import { useState } from 'react'
import { EnvelopeSimple, CheckCircle, WarningCircle } from '@phosphor-icons/react'
import { Turnstile } from '@marsidev/react-turnstile'

interface EmailCaptureFormProps {
  variant?: 'light' | 'dark' | 'gradient'
  size?: 'compact' | 'large'
  source?: string // Track where the signup came from
  className?: string
}

export default function EmailCaptureForm({
  variant = 'dark',
  size = 'large',
  source = 'landing_page',
  className = '',
}: EmailCaptureFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    // Validate Turnstile token
    if (!turnstileToken) {
      setStatus('error')
      setErrorMessage('Please complete the security check')
      return
    }

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, turnstileToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setStatus('success')
      setEmail('')

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  const isCompact = size === 'compact'

  return (
    <div className={className}>
      {status === 'success' ? (
        <div
          className={`flex items-center gap-3 ${
            isCompact ? 'p-4' : 'p-6'
          } rounded-xl border ${
            variant === 'light'
              ? 'bg-green-50 border-green-200'
              : 'bg-green-500/20 border-green-500/30'
          }`}
        >
          <CheckCircle
            size={isCompact ? 24 : 32}
            weight="bold"
            className={variant === 'light' ? 'text-green-600' : 'text-green-400'}
          />
          <div>
            <p
              className={`font-semibold ${
                variant === 'light' ? 'text-green-900' : 'text-green-300'
              }`}
            >
              {isCompact ? 'Subscribed!' : "You're subscribed!"}
            </p>
            <p
              className={`text-sm ${
                variant === 'light' ? 'text-green-700' : 'text-green-400/80'
              }`}
            >
              Check your email to confirm your subscription.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <EnvelopeSimple
                size={20}
                className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  variant === 'light' ? 'text-gray-400' : 'text-white/50'
                }`}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={status === 'loading'}
                className={`w-full ${
                  isCompact ? 'pl-11 pr-4 py-3' : 'pl-12 pr-5 py-4'
                } rounded-lg ${
                  variant === 'light'
                    ? 'bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20'
                    : variant === 'gradient'
                    ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-2 focus:ring-white/20'
                    : 'bg-[#1a1a2e] border border-white/20 text-white placeholder:text-white/50 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/30'
                } transition-all outline-none disabled:opacity-50`}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`${
                isCompact ? 'px-6 py-3' : 'px-8 py-4'
              } bg-gradient-to-r from-[#4A1942] to-[#FF6B35] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-250 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/30`}
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Subscribing...
                </span>
              ) : isCompact ? (
                'Subscribe'
              ) : (
                'Get Updates'
              )}
            </button>
          </div>

          {/* Turnstile CAPTCHA */}
          {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
            <div className="flex justify-center">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => setTurnstileToken(null)}
                onExpire={() => setTurnstileToken(null)}
                options={{
                  theme: variant === 'light' ? 'light' : 'dark',
                  size: 'normal',
                }}
              />
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/20 border border-red-500/30">
              <WarningCircle size={20} weight="bold" className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{errorMessage}</p>
            </div>
          )}

          <p
            className={`text-xs ${
              variant === 'light' ? 'text-gray-600' : 'text-white/60'
            }`}
          >
            We respect your privacy. Unsubscribe anytime.
          </p>
        </form>
      )}
    </div>
  )
}
