'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function WelcomePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    // Wait for session to load
    if (status === 'loading') return

    // If not authenticated, redirect to signin
    if (status === 'unauthenticated') {
      router.push('/signin')
      return
    }

    // If authenticated, wait a moment for database propagation
    // then redirect to dashboard
    if (status === 'authenticated' && session?.user) {
      const timer = setTimeout(() => {
        if (countdown > 0) {
          setCountdown(countdown - 1)
        } else {
          router.push('/dashboard')
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [status, session, countdown, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e]">
      <div className="text-center max-w-md px-6">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-orange-500 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Welcome Message */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Welcome to SAGA CRM!
        </h1>
        <p className="text-white/70 text-lg mb-8">
          Your account has been created successfully.
          {session?.user?.name && (
            <>
              <br />
              <span className="text-white font-semibold">{session.user.name}</span>
            </>
          )}
        </p>

        {/* Loading State */}
        <div className="mb-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>

        <p className="text-white/60 text-sm">
          Setting up your organization...
          <br />
          Redirecting to dashboard in {countdown} second{countdown !== 1 ? 's' : ''}
        </p>

        {/* Manual Continue Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-8 px-6 py-3 bg-gradient-to-r from-purple-500 to-orange-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  )
}
