/**
 * Newsletter Email Verification Page
 * Handles verification token from email links
 */

import { Suspense } from 'react'
import { CheckCircle, Warning, EnvelopeSimple } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { getPrismaWithRLS } from '@/lib/prisma-rls'

interface VerifyPageProps {
  searchParams: {
    token?: string
  }
}

async function VerificationContent({ token }: { token?: string }) {
  if (!token) {
    return (
      <div className="text-center">
        <Warning size={64} weight="bold" className="text-yellow-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Missing Verification Token</h1>
        <p className="text-white/70 mb-8">
          This link appears to be incomplete. Please check your email and use the full verification link.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#4A1942] to-[#FF6B35] text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
        >
          Return Home
        </Link>
      </div>
    )
  }

  try {
    const prisma = await getPrismaWithRLS()

    // Find subscriber by verification token
    const subscriber = await prisma.emailSubscriber.findFirst({
      where: {
        verificationToken: token,
      },
    })

    if (!subscriber) {
      return (
        <div className="text-center">
          <Warning size={64} weight="bold" className="text-yellow-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Invalid or Expired Token</h1>
          <p className="text-white/70 mb-8">
            This verification link is invalid or has already been used.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#4A1942] to-[#FF6B35] text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            Return Home
          </Link>
        </div>
      )
    }

    // Check if already verified
    if (subscriber.status === 'ACTIVE' && subscriber.verifiedAt) {
      return (
        <div className="text-center">
          <CheckCircle size={64} weight="bold" className="text-green-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Already Verified!</h1>
          <p className="text-white/70 mb-8">
            Your email address <span className="text-white font-semibold">{subscriber.email}</span> is already confirmed.
            You're all set to receive our updates!
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#4A1942] to-[#FF6B35] text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            Return Home
          </Link>
        </div>
      )
    }

    // Verify the email
    await prisma.emailSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: 'ACTIVE',
        verifiedAt: new Date(),
        verificationToken: null, // Clear token after use
      },
    })

    return (
      <div className="text-center">
        <CheckCircle size={64} weight="bold" className="text-green-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Email Verified!</h1>
        <p className="text-white/70 mb-2">
          Thank you for confirming your email address:
        </p>
        <p className="text-white font-semibold text-lg mb-8">{subscriber.email}</p>
        <p className="text-white/70 mb-8">
          You're now subscribed to receive nonprofit fundraising tips, product updates, and success stories.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-6 py-3 bg-gradient-to-r from-[#4A1942] to-[#FF6B35] text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            Get Started with SAGA CRM
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  } catch (error) {
    console.error('[Newsletter] Verification error:', error)

    return (
      <div className="text-center">
        <Warning size={64} weight="bold" className="text-red-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Verification Failed</h1>
        <p className="text-white/70 mb-8">
          We encountered an error while verifying your email. Please try again or contact support.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#4A1942] to-[#FF6B35] text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
        >
          Return Home
        </Link>
      </div>
    )
  }
}

export default async function NewsletterVerifyPage({ searchParams }: VerifyPageProps) {
  const token = searchParams.token

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <EnvelopeSimple size={40} weight="bold" className="text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12">
          <Suspense
            fallback={
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-6"></div>
                <p className="text-white/70">Verifying your email...</p>
              </div>
            }
          >
            <VerificationContent token={token} />
          </Suspense>
        </div>

        {/* Footer */}
        <p className="text-center text-white/50 text-sm mt-8">
          © 2026 SAGA CRM. Built with ❤️ for nonprofits making a difference.
        </p>
      </div>
    </div>
  )
}

export const runtime = 'nodejs'
