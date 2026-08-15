import { z } from 'zod'

export const adminEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Email is required')
  .max(320, 'Email is too long')
  .email('Enter a valid email')
  .refine((value) => value.endsWith('@umich.edu'), 'Admin emails must be @umich.edu')

export function parseAdminEmail(input: unknown) {
  const result = adminEmailSchema.safeParse(input)
  if (!result.success) {
    return { data: null, error: result.error.issues[0]?.message ?? 'Invalid email' }
  }
  return { data: result.data, error: null }
}
