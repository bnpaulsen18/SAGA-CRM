import { Resend } from 'resend';
import crypto from 'crypto';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Generate a secure random token for email verification or password reset
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  if (!resend || !process.env.RESEND_FROM_EMAIL) {
    console.warn('[Auth Email] Resend not configured. Email verification disabled.');
    return false;
  }

  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: 'Verify your SAGA CRM email address',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8b5cf6; margin: 0;">SAGA CRM</h1>
          </div>

          <h2 style="color: #1f2937; margin-bottom: 16px;">Verify Your Email Address</h2>

          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 24px;">
            Thank you for signing up for SAGA CRM! Please verify your email address to access your account.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(to right, #8b5cf6, #ec4899); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Verify Email Address
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            If you didn't create an account with SAGA CRM, you can safely ignore this email.
          </p>

          <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
            This verification link will expire in 24 hours.
          </p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('[Auth Email] Failed to send verification email:', error);
    return false;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  if (!resend || !process.env.RESEND_FROM_EMAIL) {
    console.warn('[Auth Email] Resend not configured. Password reset emails disabled.');
    return false;
  }

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: 'Reset your SAGA CRM password',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8b5cf6; margin: 0;">SAGA CRM</h1>
          </div>

          <h2 style="color: #1f2937; margin-bottom: 16px;">Reset Your Password</h2>

          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 24px;">
            You requested to reset your password. Click the button below to choose a new password.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(to right, #8b5cf6, #ec4899); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Reset Password
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
          </p>

          <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
            This password reset link will expire in 1 hour.
          </p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('[Auth Email] Failed to send password reset email:', error);
    return false;
  }
}

/**
 * Send 2FA setup email
 */
export async function send2FASetupEmail(email: string, backupCodes: string[]): Promise<boolean> {
  if (!resend || !process.env.RESEND_FROM_EMAIL) {
    console.warn('[Auth Email] Resend not configured. 2FA emails disabled.');
    return false;
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: 'Your SAGA CRM 2FA Backup Codes',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8b5cf6; margin: 0;">SAGA CRM</h1>
          </div>

          <h2 style="color: #1f2937; margin-bottom: 16px;">Two-Factor Authentication Enabled</h2>

          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 24px;">
            You've successfully enabled two-factor authentication for your account. Below are your backup codes.
            Store these in a safe place - you can use them to access your account if you lose access to your authenticator app.
          </p>

          <div style="background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px; font-size: 14px;">Backup Codes:</h3>
            <div style="font-family: monospace; color: #1f2937;">
              ${backupCodes.map(code => `<div style="padding: 4px 0;">${code}</div>`).join('')}
            </div>
          </div>

          <p style="color: #dc2626; font-size: 14px; font-weight: 600; margin-bottom: 8px;">
            ⚠️ Important Security Information
          </p>
          <ul style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            <li>Each backup code can only be used once</li>
            <li>Store these codes in a secure location</li>
            <li>Don't share these codes with anyone</li>
            <li>Generate new codes if you suspect they've been compromised</li>
          </ul>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('[Auth Email] Failed to send 2FA setup email:', error);
    return false;
  }
}
