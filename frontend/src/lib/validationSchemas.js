import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }).max(30, { message: 'Username must be at most 30 characters' }).trim(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(100, { message: 'Password must be at most 100 characters' }),
})

export const registerSchema = loginSchema

export const profileSchema = z.object({
  profileImageUrl: z.string().url({ message: 'Must be a valid URL' }).optional(),
  shortBio: z.string().min(1, { message: 'Bio cannot be empty' }).max(500, { message: 'Bio is too long' }).optional(),
})

export default {
  loginSchema,
  registerSchema,
  profileSchema,
}
