'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash } from '@phosphor-icons/react'

interface DeleteContactButtonProps {
  contactId: string
  contactName: string
}

export default function DeleteContactButton({
  contactId,
  contactName
}: DeleteContactButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete contact')
      }

      // Redirect to contacts list after successful deletion
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
          className="bg-red-600 hover:bg-red-700 text-white border-none flex items-center gap-2"
        >
          <Trash size={18} weight="bold" />
          {isDeleting ? 'Deleting...' : 'Confirm Delete'}
        </Button>
        <Button
          onClick={() => setShowConfirm(false)}
          variant="outline"
          className="text-white border-white/30 hover:bg-white/10"
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
      className="text-red-400 border-red-400/30 hover:bg-red-400/10 flex items-center gap-2"
    >
      <Trash size={18} weight="bold" />
      Delete Contact
    </Button>
  )
}
