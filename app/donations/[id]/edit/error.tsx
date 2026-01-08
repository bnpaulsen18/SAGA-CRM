'use client'

import { Warning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const params = useParams()
  const donationId = params.id as string

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-8">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Warning size={64} weight="bold" className="text-yellow-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Edit Error</h1>
        <p className="text-white/70 mb-6">
          {error.message || 'Failed to load donation edit form. Please try again.'}
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={reset}
            className="text-white font-semibold"
            style={{ background: 'linear-gradient(to right, #764ba2, #ff6b35)' }}
          >
            Try Again
          </Button>
          <Link href={donationId ? `/donations/${donationId}` : '/donations'}>
            <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
              {donationId ? 'Back to Donation' : 'Back to Donations'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
