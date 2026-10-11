import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getErrorMessage } from '@/lib/api'
import type { Note } from '@/types/api'
import { useCreateNote, useUpdateNote } from './hooks'
import { noteSchema, type NoteValues } from './schemas'

interface NoteFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  note?: Note | null
}

export function NoteFormDialog({ open, onOpenChange, note }: NoteFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{note ? 'Edit note' : 'New note'}</DialogTitle>
        </DialogHeader>
        {/* Popup content unmounts on close, so the form starts fresh every time it opens */}
        <NoteForm note={note} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function NoteForm({ note, onDone }: { note?: Note | null; onDone: () => void }) {
  const createNote = useCreateNote()
  const updateNote = useUpdateNote()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoteValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: note?.title ?? '', content: note?.content ?? '' },
  })

  const onSubmit = async (values: NoteValues) => {
    try {
      if (note) {
        await updateNote.mutateAsync({ id: note._id, ...values })
        toast.success('Note updated')
      } else {
        await createNote.mutateAsync(values)
        toast.success('Note created')
      }
      onDone()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="note-title">Title</FieldLabel>
          <Input id="note-title" autoFocus aria-invalid={!!errors.title} {...register('title')} />
          <FieldError errors={[errors.title]} />
        </Field>
        <Field data-invalid={!!errors.content}>
          <FieldLabel htmlFor="note-content">Content</FieldLabel>
          <Textarea
            id="note-content"
            rows={8}
            aria-invalid={!!errors.content}
            {...register('content')}
          />
          <FieldError errors={[errors.content]} />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </FieldGroup>
    </form>
  )
}
