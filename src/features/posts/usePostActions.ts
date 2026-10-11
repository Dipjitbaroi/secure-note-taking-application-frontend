import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/features/auth/auth-context'
import { getErrorMessage } from '@/lib/api'
import type { Post } from '@/types/api'
import { useDeletePost } from './hooks'

// Edit/delete state shared by the feed and the per-user posts page.
// Authors can edit and delete their posts; admins can delete any post.
export function usePostActions() {
  const { user, isAdmin } = useAuth()
  const [editing, setEditing] = useState<Post | null>(null)
  const [deleting, setDeleting] = useState<Post | null>(null)
  const deletePost = useDeletePost()

  const canEdit = (authorId?: string) => !!authorId && authorId === user?._id
  const canDelete = (authorId?: string) => isAdmin || canEdit(authorId)

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await deletePost.mutateAsync(deleting._id)
      toast.success('Post deleted')
      setDeleting(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return {
    editing,
    setEditing,
    deleting,
    setDeleting,
    canEdit,
    canDelete,
    confirmDelete,
    isDeleting: deletePost.isPending,
  }
}
