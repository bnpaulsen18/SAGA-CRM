'use client'

import { Warning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center p-8">
      <div className="bg-white border border-[#E8E1D7] rounded-2xl p-8 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Warning size={56} weight="bold" className="text-[#E8A33D]" />
        </div>
        <h1 className="text-2xl font-bold text-[#2A2433] mb-2" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
          Something went wrong
        </h1>
        <p className="text-[#6B6475] mb-6">{error.message || 'Please try again.'}</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} className="text-white font-semibold saga-button">
            Try Again
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="text-[#2A2433] border-[#E8E1D7] hover:bg-[#F4EFE6]">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
