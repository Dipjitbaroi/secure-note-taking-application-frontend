import { z } from 'zod'

export const noteSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().max(20_000, 'Content is too long'),
})

export type NoteValues = z.infer<typeof noteSchema>
