'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  // Check if it's an auth-related error
  const isAuthError =
    error.message?.includes('Unauthorized') ||
    error.message?.includes('No active session') ||
    error.message?.includes('session')

  // Check if it's a database error
  const isDatabaseError =
    error.message?.includes('database') ||
    error.message?.includes('prisma') ||
    error.message?.includes('connection') ||
    error.message?.includes('ECONNREFUSED')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            {isAuthError ? 'Session Expired' : isDatabaseError ? 'Connection Error' : 'Something went wrong'}
          </h1>

          <p className="text-white/70 mb-6">
            {isAuthError
              ? 'Your session has expired or you need to sign in.'
              : isDatabaseError
                ? 'Unable to connect to the database. Please try again later.'
                : 'An unexpected error occurred. Please try again.'}
          </p>

          {/* Error digest for debugging */}
          {error.digest && (
            <p className="text-white/40 text-xs mb-6 font-mono">
              Error ID: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isAuthError ? (
              <Link
                href="/login"
                className="px-6 py-3 bg-gradient-to-r from-[#764ba2] to-[#667eea] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            ) : (
              <button
                onClick={() => reset()}
                className="px-6 py-3 bg-gradient-to-r from-[#764ba2] to-[#667eea] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
            )}

            <Link
              href="/"
              className="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
            >
              Go Home
            </Link>
          </div>

          {/* Help text */}
          <p className="mt-6 text-white/50 text-sm">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  )
}
