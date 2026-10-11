import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as notesApi from './api'
import type { AllNotesParams, NoteInput } from './api'

export const noteKeys = {
  all: ['notes'] as const,
  mine: (page: number) => ['notes', 'mine', page] as const,
  admin: (params: AllNotesParams) => ['notes', 'admin', params] as const,
}

export const NOTES_PAGE_SIZE = 9

export function useMyNotes(page: number) {
  return useQuery({
    queryKey: noteKeys.mine(page),
    queryFn: () => notesApi.listMyNotes({ page, limit: NOTES_PAGE_SIZE }),
    placeholderData: keepPreviousData,
  })
}

export function useAllNotes(params: AllNotesParams) {
  return useQuery({
    queryKey: noteKeys.admin(params),
    queryFn: () => notesApi.listAllNotes(params),
    placeholderData: keepPreviousData,
  })
}

function useInvalidateNotes() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: noteKeys.all })
}

export function useCreateNote() {
  const invalidate = useInvalidateNotes()
  return useMutation({ mutationFn: notesApi.createNote, onSuccess: invalidate })
}

export function useUpdateNote() {
  const invalidate = useInvalidateNotes()
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<NoteInput> & { id: string }) =>
      notesApi.updateNote(id, body),
    onSuccess: invalidate,
  })
}

export function useDeleteNote() {
  const invalidate = useInvalidateNotes()
  return useMutation({ mutationFn: notesApi.deleteNote, onSuccess: invalidate })
}
