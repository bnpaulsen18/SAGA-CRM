/**
 * Newsletter Unsubscribe Page
 * GDPR-compliant one-click unsubscribe
 */

import { Suspense } from 'react'
import { CheckCircle, Warning, EnvelopeOpen } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { getPrismaWithRLS } from '@/lib/prisma-rls'

interface UnsubscribePageProps {
  searchParams: {
    token?: string
  }
}

async function UnsubscribeContent({ token }: { token?: string }) {
  if (!token) {
    return (
      <div className="text-center">
        <Warning size={64} weight="bold" className="text-yellow-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Missing Unsubscribe Token</h1>
        <p className="text-white/70 mb-8">
          This link appears to be incomplete. Please use the unsubscribe link from your email.
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

    // Find subscriber by unsubscribe token
    const subscriber = await prisma.emailSubscriber.findFirst({
      where: {
        unsubscribeToken: token,
      },
    })

    if (!subscriber) {
      return (
        <div className="text-center">
          <Warning size={64} weight="bold" className="text-yellow-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Invalid Token</h1>
          <p className="text-white/70 mb-8">
            This unsubscribe link is invalid or has expired.
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

    // Check if already unsubscribed
    if (subscriber.status === 'UNSUBSCRIBED') {
      return (
        <div className="text-center">
          <CheckCircle size={64} weight="bold" className="text-green-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Already Unsubscribed</h1>
          <p className="text-white/70 mb-8">
            The email address <span className="text-white font-semibold">{subscriber.email}</span> has already been removed from our mailing list.
          </p>
          <p className="text-white/60 text-sm mb-8">
            You won't receive any further emails from us. If you change your mind, you can always resubscribe from our website.
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

    // Unsubscribe the user
    await prisma.emailSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: 'UNSUBSCRIBED',
        unsubscribedAt: new Date(),
      },
    })

    return (
      <div className="text-center">
        <CheckCircle size={64} weight="bold" className="text-green-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Successfully Unsubscribed</h1>
        <p className="text-white/70 mb-2">
          We've removed your email address from our mailing list:
        </p>
        <p className="text-white font-semibold text-lg mb-8">{subscriber.email}</p>
        <p className="text-white/60 text-sm mb-8">
          You won't receive any further emails from us. We're sorry to see you go!
        </p>

        {/* Optional feedback */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <p className="text-white/70 text-sm mb-4">
            We'd love to hear why you unsubscribed (optional):
          </p>
          <div className="space-y-2 text-left">
            <label className="flex items-center gap-3 text-white/70 text-sm cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" className="rounded" disabled />
              Too many emails
            </label>
            <label className="flex items-center gap-3 text-white/70 text-sm cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" className="rounded" disabled />
              Content wasn't relevant
            </label>
            <label className="flex items-center gap-3 text-white/70 text-sm cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" className="rounded" disabled />
              I didn't sign up for this
            </label>
            <label className="flex items-center gap-3 text-white/70 text-sm cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" className="rounded" disabled />
              Other reason
            </label>
          </div>
          <p className="text-white/50 text-xs mt-4">
            (Feedback form coming soon)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-[#4A1942] to-[#FF6B35] text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            Return Home
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
          >
            Explore SAGA CRM
          </Link>
        </div>
      </div>
    )
  } catch (error) {
    console.error('[Newsletter] Unsubscribe error:', error)

    return (
      <div className="text-center">
        <Warning size={64} weight="bold" className="text-red-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Unsubscribe Failed</h1>
        <p className="text-white/70 mb-8">
          We encountered an error while processing your request. Please try again or contact support.
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

export default async function NewsletterUnsubscribePage({ searchParams }: UnsubscribePageProps) {
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
            <EnvelopeOpen size={40} weight="bold" className="text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12">
          <Suspense
            fallback={
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-6"></div>
                <p className="text-white/70">Processing your request...</p>
              </div>
            }
          >
            <UnsubscribeContent token={token} />
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
