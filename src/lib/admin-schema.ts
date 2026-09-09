import { umichEmailSchema } from '@/lib/umich-email'

export const adminEmailSchema = umichEmailSchema

export function parseAdminEmail(input: unknown) {
  const result = adminEmailSchema.safeParse(input)
  if (!result.success) {
    return { data: null, error: result.error.issues[0]?.message ?? 'Invalid uniqname' }
  }
  return { data: result.data, error: null }
}
