'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash } from '@phosphor-icons/react'

interface DeleteContactButtonProps {
  contactId: string
  contactName: string
}

export default function DeleteContactButton({ contactId }: DeleteContactButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/contacts/${contactId}`, { method: 'DELETE' })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete contact')
      }
      router.push('/contacts')
      router.refresh()
    } catch (error) {
      console.error('Delete contact error:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete contact')
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-[#C0573F] hover:bg-[#A8492F] text-white border-none flex items-center gap-2"
        >
          <Trash size={18} weight="bold" />
          {isDeleting ? 'Deleting...' : 'Confirm Delete'}
        </Button>
        <Button
          onClick={() => setShowConfirm(false)}
          variant="outline"
          className="text-[var(--ink)] border-[var(--line)] hover:bg-[var(--surface-2)]"
        >
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => setShowConfirm(true)}
      variant="outline"
      className="text-[#C0573F] border-[#EAD3C8] hover:bg-[#F6EBE6] flex items-center gap-2"
    >
      <Trash size={18} weight="bold" />
      Delete Contact
    </Button>
  )
}
