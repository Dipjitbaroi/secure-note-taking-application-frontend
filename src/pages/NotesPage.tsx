import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { PageHeader } from '@/components/common/PageHeader'
import { PaginationBar } from '@/components/common/PaginationBar'
import { Button } from '@/components/ui/button'
import { useDeleteNote, useMyNotes } from '@/features/notes/hooks'
import { NoteCard } from '@/features/notes/NoteCard'
import { NoteFormDialog } from '@/features/notes/NoteFormDialog'
import { useClampPage } from '@/hooks/useClampPage'
import { getErrorMessage } from '@/lib/api'
import type { Note } from '@/types/api'

export default function NotesPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Note | null>(null)
  const [deleting, setDeleting] = useState<Note | null>(null)

  const [page, setPage] = useState(1)
  const { data, isPending, isError, error, refetch } = useMyNotes(page)
  useClampPage(data?.meta, setPage)
  const deleteNote = useDeleteNote()

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (note: Note) => {
    setEditing(note)
    setFormOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await deleteNote.mutateAsync(deleting._id)
      toast.success('Note deleted')
      setDeleting(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <>
      <PageHeader
        title="My notes"
        description="Only you can edit these. Admins can view them."
        actions={
          <Button onClick={openCreate}>
            <PlusIcon />
            New note
          </Button>
        }
      />

      {isPending ? (
        <ListSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : data.items.length === 0 ? (
        <EmptyState title="No notes yet" description="Create your first note to get started." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={() => openEdit(note)}
              onDelete={() => setDeleting(note)}
            />
          ))}
        </div>
      )}

      <PaginationBar meta={data?.meta} onPageChange={setPage} />

      <NoteFormDialog open={formOpen} onOpenChange={setFormOpen} note={editing} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this note?"
        description={deleting ? `"${deleting.title}" will be permanently deleted.` : undefined}
        pending={deleteNote.isPending}
        onConfirm={confirmDelete}
      />
    </>
  )
}
