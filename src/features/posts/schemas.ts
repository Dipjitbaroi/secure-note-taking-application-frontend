import { z } from 'zod'

export const postSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().trim().min(1, 'Write something').max(20_000, 'Post is too long'),
})

export type PostValues = z.infer<typeof postSchema>
