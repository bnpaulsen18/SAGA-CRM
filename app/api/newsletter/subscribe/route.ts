/**
 * Newsletter Subscription API Endpoint
 * Handles email signups from landing pages
 */

import { NextResponse } from 'next/server'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import { z } from 'zod'
import crypto from 'crypto'
import {
  rateLimiter,
  RATE_LIMITS,
  getClientIdentifier,
  createRateLimitHeaders,
} from '@/lib/security/rate-limiter'

// Validation schema
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  source: z.string().optional().default('landing_page'),
  turnstileToken: z.string().optional(),
})

// Turnstile verification function
async function verifyTurnstile(token: string): Promise<boolean> {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    console.warn('[Newsletter] TURNSTILE_SECRET_KEY not configured, skipping verification')
    return true // Allow through if not configured
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('[Newsletter] Turnstile verification failed:', error)
    return false
  }
}

export async function POST(req: Request) {
  try {
    // Rate limiting - 10 requests per 15 minutes per IP
    const identifier = getClientIdentifier(req)
    const rateLimit = await rateLimiter.check(
      identifier,
      RATE_LIMITS.NEWSLETTER.maxRequests,
      RATE_LIMITS.NEWSLETTER.windowMs
    )

    const rateLimitHeaders = createRateLimitHeaders(rateLimit)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many subscription attempts. Please try again later.',
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: rateLimitHeaders,
        }
      )
    }

    const body = await req.json()

    // Validate input
    const validationResult = subscribeSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid email address',
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const { email, source, turnstileToken } = validationResult.data

    // Verify Turnstile CAPTCHA if configured
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && turnstileToken) {
      const isValid = await verifyTurnstile(turnstileToken)
      if (!isValid) {
        return NextResponse.json(
          { error: 'CAPTCHA verification failed. Please try again.' },
          { status: 400 }
        )
      }
    }

    // Get client IP and user agent for tracking
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    const referrer = req.headers.get('referer') || null

    // Generate verification and unsubscribe tokens
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const unsubscribeToken = crypto.randomBytes(32).toString('hex')

    // Use Prisma without RLS for public newsletter signups
    const prisma = await getPrismaWithRLS()

    // Check if email already exists
    const existingSubscriber = await prisma.emailSubscriber.findUnique({
      where: { email },
    })

    if (existingSubscriber) {
      // If already active, return success to avoid leaking information
      if (existingSubscriber.status === 'ACTIVE') {
        return NextResponse.json({
          success: true,
          message: 'Thank you for subscribing!',
        })
      }

      // If pending or unsubscribed, update the record
      await prisma.emailSubscriber.update({
        where: { email },
        data: {
          status: 'PENDING',
          source,
          verificationToken,
          unsubscribeToken,
          ipAddress,
          userAgent,
          referrer,
          updatedAt: new Date(),
        },
      })
    } else {
      // Create new subscriber
      await prisma.emailSubscriber.create({
        data: {
          email,
          source,
          status: 'PENDING',
          verificationToken,
          unsubscribeToken,
          ipAddress,
          userAgent,
          referrer,
        },
      })
    }

    // TODO: Send verification email via Resend
    // For now, we'll just return success
    // In production, you would:
    // 1. Send verification email with token link
    // 2. User clicks link → verifies email
    // 3. Update status to ACTIVE

    // Optional: Send verification email (when RESEND_API_KEY is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)

        const verificationUrl = `${process.env.NEXTAUTH_URL}/newsletter/verify?token=${verificationToken}`
        const unsubscribeUrl = `${process.env.NEXTAUTH_URL}/newsletter/unsubscribe?token=${unsubscribeToken}`

        await resend.emails.send({
          from: 'SAGA CRM <noreply@sagacrm.com>',
          to: email,
          subject: 'Confirm your SAGA CRM newsletter subscription',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #4A1942;">Welcome to SAGA CRM!</h1>
              <p>Thank you for subscribing to our newsletter. To complete your subscription, please click the button below:</p>
              <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(to right, #4A1942, #FF6B35); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
                Confirm Subscription
              </a>
              <p style="color: #666; font-size: 14px;">If you didn't sign up for this newsletter, you can safely ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />
              <p style="color: #666; font-size: 12px; text-align: center;">
                SAGA CRM - Built with ❤️ for nonprofits making a difference.
              </p>
              <p style="color: #999; font-size: 11px; text-align: center;">
                <a href="${unsubscribeUrl}" style="color: #999; text-decoration: underline;">Unsubscribe</a> from future emails
              </p>
            </div>
          `,
        })

        console.log('[Newsletter] Verification email sent to:', email)
      } catch (emailError) {
        console.error('[Newsletter] Failed to send verification email:', emailError)
        // Don't fail the request if email sending fails
      }
    } else {
      console.log('[Newsletter] RESEND_API_KEY not configured, skipping verification email')
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for subscribing! Please check your email to confirm.',
      },
      {
        headers: rateLimitHeaders,
      }
    )
  } catch (error) {
    console.error('[Newsletter] Subscription error:', error)

    return NextResponse.json(
      {
        error: 'Failed to subscribe. Please try again later.',
      },
      { status: 500 }
    )
  }
}
