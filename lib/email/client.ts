import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not set. Email sending will be disabled.')
}

export const resend = new Resend(process.env.RESEND_API_KEY || 'test-key')

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'SAGA CRM <noreply@saga-crm.com>'
