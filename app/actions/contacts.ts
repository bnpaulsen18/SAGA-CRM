'use server'

import { revalidatePath } from 'next/cache'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import { requireAuth } from '@/lib/permissions'
import { contactSchema } from '@/lib/validation'
import { ZodError } from 'zod'

export async function createContact(formData: FormData) {
  try {
    // Verify authentication
    const session = await requireAuth()

    if (!session.user.organizationId && !session.user.isPlatformAdmin) {
      return {
        success: false,
        error: 'You must belong to an organization to create contacts'
      }
    }

    // Extract and validate form data
    const tags = formData.get('tags')
      ? String(formData.get('tags'))
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      : []

    const data = {
      firstName: String(formData.get('firstName')),
      lastName: String(formData.get('lastName')),
      email: String(formData.get('email')),
      phone: formData.get('phone') ? String(formData.get('phone')) : null,
      street: formData.get('street') ? String(formData.get('street')) : null,
      city: formData.get('city') ? String(formData.get('city')) : null,
      state: formData.get('state') ? String(formData.get('state')) : null,
      zip: formData.get('zip') ? String(formData.get('zip')) : null,
      country: 'USA',
      type: String(formData.get('type')) as any,
      status: String(formData.get('status')) as any,
      tags,
      notes: formData.get('notes') ? String(formData.get('notes')) : null
    }

    // Validate with Zod
    const validated = contactSchema.parse(data)

    // Create contact with RLS
    const prisma = await getPrismaWithRLS()
    const contact = await prisma.contact.create({
      data: {
        ...validated,
        organizationId: session.user.organizationId!
      }
    })

    // Revalidate the contacts page to show new data
    revalidatePath('/contacts')
    revalidatePath(`/contacts/${contact.id}`)

    return {
      success: true,
      contactId: contact.id
    }
  } catch (error) {
    console.error('Error creating contact:', error)

    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || 'Validation failed'
      }
    }

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: false,
      error: 'Failed to create contact'
    }
  }
}

export async function updateContact(contactId: string, formData: FormData) {
  try {
    // Verify authentication
    const session = await requireAuth()

    // Extract and validate form data
    const tags = formData.get('tags')
      ? String(formData.get('tags'))
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      : []

    const data = {
      firstName: String(formData.get('firstName')),
      lastName: String(formData.get('lastName')),
      email: String(formData.get('email')),
      phone: formData.get('phone') ? String(formData.get('phone')) : null,
      street: formData.get('street') ? String(formData.get('street')) : null,
      city: formData.get('city') ? String(formData.get('city')) : null,
      state: formData.get('state') ? String(formData.get('state')) : null,
      zip: formData.get('zip') ? String(formData.get('zip')) : null,
      country: 'USA',
      type: String(formData.get('type')) as any,
      status: String(formData.get('status')) as any,
      tags,
      notes: formData.get('notes') ? String(formData.get('notes')) : null
    }

    // Validate with Zod
    const validated = contactSchema.parse(data)

    // Update contact with RLS (automatically enforces ownership)
    const prisma = await getPrismaWithRLS()
    const contact = await prisma.contact.update({
      where: {
        id: contactId,
        organizationId: session.user.organizationId || undefined
      },
      data: validated
    })

    // Revalidate pages
    revalidatePath('/contacts')
    revalidatePath(`/contacts/${contact.id}`)

    return {
      success: true,
      contactId: contact.id
    }
  } catch (error) {
    console.error('Error updating contact:', error)

    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || 'Validation failed'
      }
    }

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: false,
      error: 'Failed to update contact'
    }
  }
}

export async function deleteContact(contactId: string) {
  try {
    // Verify authentication and permission
    const session = await requireAuth()

    // Only admins can delete contacts
    if (session.user.role !== 'ADMIN' && !session.user.isPlatformAdmin) {
      return {
        success: false,
        error: 'Only administrators can delete contacts'
      }
    }

    // Delete contact with RLS (automatically enforces ownership)
    const prisma = await getPrismaWithRLS()
    await prisma.contact.delete({
      where: {
        id: contactId,
        organizationId: session.user.organizationId || undefined
      }
    })

    // Revalidate contacts page
    revalidatePath('/contacts')

    return {
      success: true
    }
  } catch (error) {
    console.error('Error deleting contact:', error)

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: false,
      error: 'Failed to delete contact'
    }
  }
}

export async function importContacts(contacts: any[]) {
  try {
    // Verify authentication
    const session = await requireAuth()

    if (!session.user.organizationId && !session.user.isPlatformAdmin) {
      return {
        success: 0,
        failed: contacts.length,
        duplicates: 0,
        errors: ['You must belong to an organization to import contacts']
      }
    }

    const prisma = await getPrismaWithRLS()
    const results = {
      success: 0,
      failed: 0,
      duplicates: 0,
      errors: [] as string[]
    }

    // Get existing emails to check for duplicates
    const existingContacts = await prisma.contact.findMany({
      where: {
        organizationId: session.user.organizationId || undefined
      },
      select: { email: true }
    })
    const existingEmails = new Set(existingContacts.map(c => c.email.toLowerCase()))

    // Process each contact
    for (let i = 0; i < contacts.length; i++) {
      const contactData = contacts[i]
      const rowNumber = i + 1

      try {
        // Check for required fields
        if (!contactData.firstName || !contactData.lastName || !contactData.email) {
          results.failed++
          results.errors.push(`Row ${rowNumber}: Missing required fields`)
          continue
        }

        // Check for duplicate email
        if (existingEmails.has(contactData.email.toLowerCase())) {
          results.duplicates++
          results.errors.push(`Row ${rowNumber}: Duplicate email: ${contactData.email}`)
          continue
        }

        // Prepare contact data with defaults
        const data = {
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          email: contactData.email,
          phone: contactData.phone || null,
          street: contactData.street || null,
          city: contactData.city || null,
          state: contactData.state || null,
          zip: contactData.zip || null,
          country: 'USA',
          type: contactData.type || 'DONOR',
          status: contactData.status || 'ACTIVE',
          tags: contactData.tags || [],
          notes: contactData.notes || null
        }

        // Validate with Zod
        const validated = contactSchema.parse(data)

        // Create contact
        await prisma.contact.create({
          data: {
            ...validated,
            organizationId: session.user.organizationId!
          }
        })

        // Add to existing emails set to catch duplicates within the import
        existingEmails.add(contactData.email.toLowerCase())

        results.success++
      } catch (error) {
        results.failed++
        if (error instanceof ZodError) {
          results.errors.push(`Row ${rowNumber}: ${error.issues[0]?.message || 'Validation failed'}`)
        } else if (error instanceof Error) {
          results.errors.push(`Row ${rowNumber}: ${error.message}`)
        } else {
          results.errors.push(`Row ${rowNumber}: Import failed`)
        }
      }
    }

    // Revalidate contacts page
    revalidatePath('/contacts')

    return results
  } catch (error) {
    console.error('Error importing contacts:', error)

    return {
      success: 0,
      failed: contacts.length,
      duplicates: 0,
      errors: [error instanceof Error ? error.message : 'Import failed']
    }
  }
}
