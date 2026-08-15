import { z } from 'zod'

const emptyToNull = (value: string | null | undefined) => {
  if (value == null) return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

export const cycleQuestionSchema = z.object({
  id: z.uuid().optional().nullable(),
  prompt: z.string().trim().min(1, 'Question prompt is required').max(2000),
  help_text: z
    .string()
    .max(2000)
    .nullable()
    .optional()
    .transform(emptyToNull),
  max_words: z.coerce.number().int().min(1, 'Word limit must be at least 1').max(2000),
  required: z.boolean(),
  sort_order: z.number().int().min(0),
})

export const rushCycleSchema = z.object({
  name: z.string().trim().min(1, 'Cycle name is required').max(120),
  opens_at: z.string().min(1, 'Open date is required'),
  closes_at: z.string().min(1, 'Close date is required'),
  intro_markdown: z
    .string()
    .max(8000)
    .nullable()
    .optional()
    .transform(emptyToNull),
  hear_about_options: z.array(z.string().trim().min(1).max(200)).max(40),
  is_active: z.boolean(),
  questions: z.array(cycleQuestionSchema).max(20),
})
  .superRefine((value, ctx) => {
    const opens = new Date(value.opens_at).getTime()
    const closes = new Date(value.closes_at).getTime()
    if (Number.isNaN(opens) || Number.isNaN(closes)) {
      ctx.addIssue({ code: 'custom', message: 'Open and close must be valid dates' })
      return
    }
    if (closes <= opens) {
      ctx.addIssue({
        code: 'custom',
        message: 'Close date must be after open date',
        path: ['closes_at'],
      })
    }
  })

export type RushCycleWrite = z.infer<typeof rushCycleSchema>

export function parseRushCycle(input: unknown) {
  const result = rushCycleSchema.safeParse(input)
  if (!result.success) {
    return {
      data: null,
      error: result.error.issues[0]?.message ?? 'Invalid cycle',
    }
  }
  return { data: result.data, error: null }
}

export function parseCycleId(cycleId: unknown) {
  const result = z.uuid('Invalid cycle id').safeParse(cycleId)
  if (!result.success) {
    return { data: null, error: result.error.issues[0]?.message ?? 'Invalid cycle id' }
  }
  return { data: result.data, error: null }
}
