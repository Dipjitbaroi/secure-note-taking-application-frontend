import { api, unwrap } from '@/lib/api'
import type { Note, NoteWithOwner, PageParams, Paginated } from '@/types/api'

export interface NoteInput {
  title: string
  content: string
}

export interface AllNotesParams extends PageParams {
  owner?: string
}

export const listMyNotes = (params: PageParams) =>
  unwrap<Paginated<Note>>(api.get('/notes', { params }))

export const listAllNotes = (params: AllNotesParams) =>
  unwrap<Paginated<NoteWithOwner>>(api.get('/notes/all', { params }))

export const getNote = (id: string) => unwrap<Note>(api.get(`/notes/${id}`))

export const createNote = (body: NoteInput) => unwrap<Note>(api.post('/notes', body))

export const updateNote = (id: string, body: Partial<NoteInput>) =>
  unwrap<Note>(api.patch(`/notes/${id}`, body))

export const deleteNote = (id: string) => api.delete(`/notes/${id}`)
