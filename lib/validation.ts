import { z } from 'zod'

/**
 * Validation Schemas using Zod
 *
 * These schemas prevent SQL injection by validating all user inputs
 * before they reach the database layer.
 */

// ============================================
// Contact Validation
// ============================================

export const contactSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'First name contains invalid characters'),

  lastName: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Last name contains invalid characters'),

  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase(),

  phone: z.string()
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[\d\s\-\+\(\)\.]+$/, 'Phone number contains invalid characters')
    .optional()
    .nullable(),

  street: z.string()
    .max(200, 'Street address must be less than 200 characters')
    .optional()
    .nullable(),

  city: z.string()
    .max(100, 'City must be less than 100 characters')
    .optional()
    .nullable(),

  state: z.string()
    .max(50, 'State must be less than 50 characters')
    .optional()
    .nullable(),

  zip: z.string()
    .max(20, 'ZIP code must be less than 20 characters')
    .regex(/^[\d\s\-]+$/, 'ZIP code contains invalid characters')
    .optional()
    .nullable(),

  country: z.string()
    .max(100, 'Country must be less than 100 characters')
    .default('USA'),

  type: z.enum(['DONOR', 'VOLUNTEER', 'BOARD_MEMBER', 'STAFF', 'VENDOR', 'OTHER'])
    .default('DONOR'),

  status: z.enum(['ACTIVE', 'INACTIVE', 'DECEASED', 'DO_NOT_CONTACT'])
    .default('ACTIVE'),

  tags: z.array(z.string().max(50)).default([]),

  notes: z.string()
    .max(5000, 'Notes must be less than 5000 characters')
    .optional()
    .nullable()
})

export type ContactInput = z.infer<typeof contactSchema>

// ============================================
// Donation Validation
// ============================================

export const donationSchema = z.object({
  contactId: z.string()
    .cuid('Invalid contact ID'),

  campaignId: z.string()
    .cuid('Invalid campaign ID')
    .optional()
    .nullable(),

  amount: z.number()
    .positive('Amount must be positive')
    .max(1000000000, 'Amount exceeds maximum allowed')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places'),

  currency: z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD'])
    .default('USD'),

  type: z.enum(['ONE_TIME', 'MONTHLY', 'QUARTERLY', 'ANNUAL', 'IN_KIND', 'STOCK'])
    .default('ONE_TIME'),

  method: z.enum([
    'CREDIT_CARD',
    'DEBIT_CARD',
    'BANK_TRANSFER',
    'CHECK',
    'CASH',
    'PAYPAL',
    'VENMO',
    'CRYPTOCURRENCY',
    'OTHER'
  ]).default('CREDIT_CARD'),

  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'])
    .default('COMPLETED'),

  transactionId: z.string()
    .max(255, 'Transaction ID must be less than 255 characters')
    .optional()
    .nullable(),

  fundRestriction: z.enum([
    'UNRESTRICTED',
    'TEMPORARILY_RESTRICTED',
    'PERMANENTLY_RESTRICTED',
    'PROGRAM_RESTRICTED',
    'PROJECT_DESIGNATED'
  ]).default('UNRESTRICTED'),

  designatedProjectId: z.string()
    .cuid('Invalid project ID')
    .optional()
    .nullable(),

  donorIntent: z.string()
    .max(1000, 'Donor intent must be less than 1000 characters')
    .optional()
    .nullable(),

  taxDeductible: z.boolean().default(true),

  notes: z.string()
    .max(5000, 'Notes must be less than 5000 characters')
    .optional()
    .nullable(),

  donatedAt: z.coerce.date()
})

export type DonationInput = z.infer<typeof donationSchema>

// ============================================
// Campaign Validation
// ============================================

export const campaignSchema = z.object({
  name: z.string()
    .min(1, 'Campaign name is required')
    .max(200, 'Campaign name must be less than 200 characters'),

  description: z.string()
    .max(5000, 'Description must be less than 5000 characters')
    .optional()
    .nullable(),

  goal: z.number()
    .positive('Goal must be positive')
    .max(1000000000, 'Goal exceeds maximum allowed')
    .optional()
    .nullable(),

  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'])
    .default('DRAFT'),

  startDate: z.coerce.date().optional().nullable(),

  endDate: z.coerce.date().optional().nullable(),

  tags: z.array(z.string().max(50)).default([])
})

export type CampaignInput = z.infer<typeof campaignSchema>

// ============================================
// Interaction Validation
// ============================================

export const interactionSchema = z.object({
  contactId: z.string()
    .cuid('Invalid contact ID'),

  userId: z.string()
    .cuid('Invalid user ID'),

  type: z.enum([
    'NOTE',
    'CALL',
    'MEETING',
    'EMAIL_SENT',
    'EMAIL_RECEIVED',
    'DONATION_RECEIVED',
    'EVENT_ATTENDED',
    'OTHER'
  ]),

  subject: z.string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters'),

  notes: z.string()
    .max(5000, 'Notes must be less than 5000 characters')
    .optional()
    .nullable(),

  occurredAt: z.coerce.date().default(() => new Date())
})

export type InteractionInput = z.infer<typeof interactionSchema>

// ============================================
// API Query Validation (Pagination & Filters)
// ============================================

export const paginationSchema = z.object({
  page: z.coerce.number()
    .int('Page must be an integer')
    .positive('Page must be positive')
    .default(1),

  limit: z.coerce.number()
    .int('Limit must be an integer')
    .positive('Limit must be positive')
    .max(1000, 'Limit cannot exceed 1000')
    .default(50),

  sortBy: z.string()
    .max(100, 'Sort field name too long')
    .optional(),

  sortOrder: z.enum(['asc', 'desc'])
    .default('desc')
})

export type PaginationParams = z.infer<typeof paginationSchema>

// ============================================
// Search Query Validation
// ============================================

export const searchSchema = z.object({
  query: z.string()
    .max(200, 'Search query must be less than 200 characters')
    .optional(),

  type: z.enum(['contact', 'donation', 'campaign', 'all'])
    .default('all')
})

export type SearchParams = z.infer<typeof searchSchema>

// ============================================
// Date Range Validation
// ============================================

export const dateRangeSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date()
}).refine(
  (data) => data.endDate >= data.startDate,
  {
    message: 'End date must be after start date',
    path: ['endDate']
  }
)

export type DateRangeParams = z.infer<typeof dateRangeSchema>

// ============================================
// Organization Validation
// ============================================

export const organizationSchema = z.object({
  name: z.string()
    .min(1, 'Organization name is required')
    .max(200, 'Organization name must be less than 200 characters'),

  ein: z.string()
    .regex(/^\d{2}-\d{7}$/, 'EIN must be in format XX-XXXXXXX')
    .or(z.string().regex(/^\d{9}$/, 'EIN must be 9 digits')),

  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),

  phone: z.string()
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[\d\s\-\+\(\)\.]+$/, 'Phone number contains invalid characters')
    .optional()
    .nullable(),

  website: z.string()
    .url('Invalid website URL')
    .max(255, 'Website URL must be less than 255 characters')
    .optional()
    .nullable(),

  organizationType: z.enum(['INDEPENDENT', 'PARENT', 'PROJECT'])
    .default('INDEPENDENT'),

  taxExemptStatus: z.enum([
    'EXEMPT_501C3',
    'EXEMPT_501C4',
    'EXEMPT_501C6',
    'EXEMPT_501C7',
    'EXEMPT_OTHER',
    'FOR_PROFIT',
    'PENDING'
  ]).default('EXEMPT_501C3'),

  missionStatement: z.string()
    .max(2000, 'Mission statement must be less than 2000 characters')
    .optional()
    .nullable()
})

export type OrganizationInput = z.infer<typeof organizationSchema>

// ============================================
// User Validation
// ============================================

export const userSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase(),

  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),

  firstName: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters'),

  lastName: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters'),

  role: z.enum(['PLATFORM_ADMIN', 'ADMIN', 'MEMBER', 'VIEWER'])
    .default('MEMBER'),

  organizationId: z.string()
    .cuid('Invalid organization ID')
    .optional()
    .nullable()
})

export type UserInput = z.infer<typeof userSchema>

// ============================================
// GDPR Export Request Validation
// ============================================

export const gdprExportSchema = z.object({
  contactId: z.string()
    .cuid('Invalid contact ID'),

  reason: z.string()
    .max(500, 'Reason must be less than 500 characters')
    .optional()
})

export type GDPRExportRequest = z.infer<typeof gdprExportSchema>

// ============================================
// GDPR Deletion Request Validation
// ============================================

export const gdprDeleteSchema = z.object({
  contactId: z.string()
    .cuid('Invalid contact ID'),

  reason: z.string()
    .min(1, 'Reason is required for GDPR deletion')
    .max(500, 'Reason must be less than 500 characters'),

  confirmDelete: z.boolean()
    .refine((val) => val === true, {
      message: 'You must confirm deletion'
    })
})

export type GDPRDeleteRequest = z.infer<typeof gdprDeleteSchema>
