import { z } from 'zod'
import { umichEmailSchema } from '@/lib/umich-email'

const emptyToNull = (value: string | null | undefined) => {
  if (value == null) return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

export const brotherWriteSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required').max(80),
  last_name: z.string().trim().min(1, 'Last name is required').max(80),
  umich_email: umichEmailSchema,
  pledge_class: z.string().trim().min(1, 'Pledge class is required').max(40),
  linkedin_url: z
    .string()
    .trim()
    .max(500)
    .transform(emptyToNull)
    .transform((value) => {
      if (!value) return null
      return /^https?:\/\//i.test(value) ? value : `https://${value}`
    })
    .refine((value) => {
      if (value == null) return true
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    }, 'Enter a valid LinkedIn URL'),
  photo_filename: z.string().trim().max(255).transform(emptyToNull),
})

export type BrotherWrite = z.infer<typeof brotherWriteSchema>

export type BrotherFormInput = {
  first_name: string
  last_name: string
  umich_email: string
  pledge_class: string
  linkedin_url: string
  photo_filename: string
}

export type ClientBrother = {
  id: string
  first_name: string | null
  last_name: string | null
  umich_email: string | null
  contact_email: string | null
  linkedin_url: string | null
  photo_filename: string | null
  status: 'active' | 'alumni'
  pledge_class: string | null
}

export type BrotherSearchHit = {
  id: string
  first_name: string | null
  last_name: string | null
  umich_email: string
  uniqname: string
  pledge_class: string | null
}

export function parseBrotherWrite(input: unknown) {
  const result = brotherWriteSchema.safeParse(input)
  if (!result.success) {
    return { data: null, error: result.error.issues[0]?.message ?? 'Invalid brother' }
  }
  return { data: result.data, error: null }
}

export function parseBrotherId(input: unknown) {
  const result = z.uuid('Invalid brother id').safeParse(input)
  if (!result.success) {
    return { data: null, error: result.error.issues[0]?.message ?? 'Invalid brother id' }
  }
  return { data: result.data, error: null }
}
