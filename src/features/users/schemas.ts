import { z } from 'zod'

const base = {
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.email('Enter a valid email'),
  role: z.enum(['user', 'admin']),
  interests: z.string(),
}

const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters')

export const createUserSchema = z.object({ ...base, password })

// When editing, an empty password means "leave it unchanged".
export const editUserSchema = z.object({ ...base, password: z.union([z.literal(''), password]) })

export type UserFormValues = z.infer<typeof editUserSchema>

export const profileSchema = z.object({
  name: base.name,
  interests: base.interests,
})

export type ProfileValues = z.infer<typeof profileSchema>
