import { z } from 'zod'

const emptyToNull = (value: string | null | undefined) => {
  if (value == null) return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

const requiredUrl = z
  .string()
  .trim()
  .min(1, 'URL is required')
  .max(2000)
  .refine((value) => URL.canParse(value), 'Must be a valid URL')

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

const dateRangeRefine = (
  value: { opens_at: string; closes_at: string },
  ctx: z.RefinementCtx
) => {
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
}

export const rushCycleMetaSchema = z
  .object({
    name: z.string().trim().min(1, 'Cycle name is required').max(120),
    opens_at: z.string().min(1, 'Open date is required'),
    closes_at: z.string().min(1, 'Close date is required'),
    interest_form_url: requiredUrl,
    youtube_url: requiredUrl,
    calendar_url: requiredUrl,
  })
  .superRefine(dateRangeRefine)

export const rushCycleApplicationSchema = z.object({
  intro_markdown: z
    .string()
    .trim()
    .min(1, 'Welcome text is required')
    .max(8000),
  closed_markdown: z
    .string()
    .trim()
    .min(1, 'Closed text is required')
    .max(4000),
  hear_about_options: z.array(z.string().trim().min(1).max(200)).max(40),
  questions: z.array(cycleQuestionSchema).min(1).max(20),
})

export const rushCycleCreateSchema = z.intersection(
  rushCycleMetaSchema,
  rushCycleApplicationSchema
)

export type RushCycleMetaWrite = z.infer<typeof rushCycleMetaSchema>
export type RushCycleApplicationWrite = z.infer<typeof rushCycleApplicationSchema>
export type RushCycleCreateWrite = z.infer<typeof rushCycleCreateSchema>

export function parseRushCycleMeta(input: unknown) {
  const result = rushCycleMetaSchema.safeParse(input)
  if (!result.success) {
    return {
      data: null,
      error: result.error.issues[0]?.message ?? 'Invalid cycle',
    }
  }
  return { data: result.data, error: null }
}

export function parseRushCycleApplication(input: unknown) {
  const result = rushCycleApplicationSchema.safeParse(input)
  if (!result.success) {
    return {
      data: null,
      error: result.error.issues[0]?.message ?? 'Invalid application',
    }
  }
  return { data: result.data, error: null }
}

export function parseRushCycleCreate(input: unknown) {
  const result = rushCycleCreateSchema.safeParse(input)
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
