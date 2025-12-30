import crypto from 'crypto'

/**
 * PII Encryption Utilities
 *
 * Uses AES-256-GCM encryption for protecting Personally Identifiable Information (PII)
 * in compliance with GDPR and other data protection regulations.
 *
 * IMPORTANT: Set ENCRYPTION_KEY in .env.local
 * Generate with: node -e "console.log(crypto.randomBytes(32).toString('hex'))"
 */

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16 // Initialization vector length
const AUTH_TAG_LENGTH = 16 // Authentication tag length

/**
 * Get encryption key from environment
 * @throws Error if ENCRYPTION_KEY is not set
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY

  if (!key) {
    throw new Error(
      'ENCRYPTION_KEY environment variable is not set. ' +
      'Generate one with: node -e "console.log(crypto.randomBytes(32).toString(\'hex\'))"'
    )
  }

  if (key.length !== 64) {
    throw new Error(
      'ENCRYPTION_KEY must be a 32-byte hex string (64 characters). ' +
      'Current length: ' + key.length
    )
  }

  return Buffer.from(key, 'hex')
}

/**
 * Encrypt PII data
 * @param plaintext The data to encrypt
 * @returns Encrypted string in format: iv:authTag:encryptedData
 */
export function encryptPII(plaintext: string): string {
  if (!plaintext) {
    return plaintext
  }

  try {
    const key = getEncryptionKey()
    const iv = crypto.randomBytes(IV_LENGTH)

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(plaintext, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const authTag = cipher.getAuthTag()

    // Format: iv:authTag:encryptedData
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypt PII data
 * @param encryptedText Encrypted string in format: iv:authTag:encryptedData
 * @returns Decrypted plaintext
 */
export function decryptPII(encryptedText: string): string {
  if (!encryptedText) {
    return encryptedText
  }

  // If data doesn't look encrypted (no colons), return as-is (backwards compatibility)
  if (!encryptedText.includes(':')) {
    return encryptedText
  }

  try {
    const key = getEncryptionKey()
    const parts = encryptedText.split(':')

    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format')
    }

    const [ivHex, authTagHex, encrypted] = parts

    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

/**
 * Hash sensitive data (one-way, for comparison only)
 * Useful for de-duplication without storing plaintext
 * @param data Data to hash
 * @returns SHA-256 hash
 */
export function hashPII(data: string): string {
  if (!data) {
    return data
  }

  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex')
}

/**
 * Encrypt contact PII fields
 * @param contact Contact object with PII
 * @returns Contact with encrypted PII fields
 */
export function encryptContactPII(contact: any): any {
  if (!contact) return contact

  return {
    ...contact,
    // Encrypt sensitive fields
    email: contact.email ? encryptPII(contact.email) : contact.email,
    phone: contact.phone ? encryptPII(contact.phone) : contact.phone,
    street: contact.street ? encryptPII(contact.street) : contact.street,
    notes: contact.notes ? encryptPII(contact.notes) : contact.notes
  }
}

/**
 * Decrypt contact PII fields
 * @param contact Contact object with encrypted PII
 * @returns Contact with decrypted PII fields
 */
export function decryptContactPII(contact: any): any {
  if (!contact) return contact

  return {
    ...contact,
    // Decrypt sensitive fields
    email: contact.email ? decryptPII(contact.email) : contact.email,
    phone: contact.phone ? decryptPII(contact.phone) : contact.phone,
    street: contact.street ? decryptPII(contact.street) : contact.street,
    notes: contact.notes ? decryptPII(contact.notes) : contact.notes
  }
}

/**
 * Mask sensitive data for display (e.g., ***@example.com)
 * @param data Sensitive data to mask
 * @param type Type of data (email, phone, ssn)
 * @returns Masked string
 */
export function maskPII(data: string | null | undefined, type: 'email' | 'phone' | 'ssn' | 'card'): string {
  if (!data) return ''

  switch (type) {
    case 'email':
      const [local, domain] = data.split('@')
      if (!domain) return '***'
      return `${local.substring(0, 2)}***@${domain}`

    case 'phone':
      const cleaned = data.replace(/\D/g, '')
      if (cleaned.length < 4) return '***'
      return `***-***-${cleaned.slice(-4)}`

    case 'ssn':
      const ssnCleaned = data.replace(/\D/g, '')
      if (ssnCleaned.length < 4) return '***-**-****'
      return `***-**-${ssnCleaned.slice(-4)}`

    case 'card':
      const cardCleaned = data.replace(/\D/g, '')
      if (cardCleaned.length < 4) return '****'
      return `**** **** **** ${cardCleaned.slice(-4)}`

    default:
      return '***'
  }
}

/**
 * Generate a random token (for password reset, email verification, etc.)
 * @param length Token length in bytes (default: 32)
 * @returns Random hex token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Generate encryption key for .env.local
 * Run this once during setup
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Verify if encryption is properly configured
 * @returns true if encryption key is valid
 */
export function verifyEncryptionSetup(): boolean {
  try {
    const key = getEncryptionKey()
    return key.length === 32
  } catch (error) {
    return false
  }
}

/**
 * Anonymize contact data (GDPR right to be forgotten)
 * @param contact Contact to anonymize
 * @returns Anonymized contact
 */
export function anonymizeContact(contact: any): any {
  const timestamp = Date.now()

  return {
    ...contact,
    firstName: '[REDACTED]',
    lastName: '[REDACTED]',
    email: `deleted-${timestamp}@redacted.com`,
    phone: null,
    street: null,
    city: null,
    state: null,
    zip: null,
    notes: '[Personal data removed per GDPR request]',
    tags: [],
    status: 'DO_NOT_CONTACT'
  }
}
