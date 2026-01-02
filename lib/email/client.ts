import { Resend } from 'resend'

const initResend = (): Resend | null => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Resend] RESEND_API_KEY not configured. Email features disabled.');
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

export const resend = initResend();
export const isResendAvailable = !!resend;
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'SAGA CRM <noreply@saga-crm.com>'
