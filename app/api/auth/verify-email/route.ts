import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/auth/verify-email?token=xxx
 * Verify user's email address
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(
        new URL('/login?error=invalid_token', req.url)
      );
    }

    // Find user by verification token
    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL('/login?error=invalid_token', req.url)
      );
    }

    // Check if token has expired
    if (user.emailVerificationExpiry && user.emailVerificationExpiry < new Date()) {
      return NextResponse.redirect(
        new URL('/login?error=token_expired', req.url)
      );
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      },
    });

    // Redirect to login with success message
    return NextResponse.redirect(
      new URL('/login?verified=true', req.url)
    );
  } catch (error) {
    console.error('[Email Verification] Error:', error);
    return NextResponse.redirect(
      new URL('/login?error=verification_failed', req.url)
    );
  }
}
