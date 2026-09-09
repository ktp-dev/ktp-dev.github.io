import { z } from 'zod'

const emptyToNull = (value: string | null | undefined) => {
  if (value == null) return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

const ratingEntrySchema = z.object({
  label: z.string().trim().min(1, 'Rating label is required').max(80),
  bullets: z.array(z.string().trim().min(1).max(500)).max(12).default([]),
})

export const rubricCategoryWriteSchema = z
  .object({
    id: z.uuid().optional().nullable(),
    title: z.string().trim().min(1, 'Category title is required').max(500),
    description: z
      .string()
      .max(2000)
      .nullable()
      .optional()
      .transform(emptyToNull),
    sort_order: z.number().int().min(0),
    scale_min: z.coerce.number().int().min(1).max(10),
    scale_max: z.coerce.number().int().min(1).max(10),
    rating_labels: z.record(z.string(), ratingEntrySchema).nullable().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.scale_max < value.scale_min) {
      ctx.addIssue({
        code: 'custom',
        message: 'Scale max must be greater than or equal to scale min',
        path: ['scale_max'],
      })
    }
    const span = value.scale_max - value.scale_min + 1
    if (span > 8) {
      ctx.addIssue({
        code: 'custom',
        message: 'Scale may have at most 8 steps',
        path: ['scale_max'],
      })
    }
    if (!value.rating_labels) return
    for (let score = value.scale_min; score <= value.scale_max; score++) {
      if (!value.rating_labels[String(score)]) {
        ctx.addIssue({
          code: 'custom',
          message: `Missing rating guidance for score ${score}`,
          path: ['rating_labels'],
        })
      }
    }
  })

export const rushRubricSaveSchema = z.object({
  categories: z.array(rubricCategoryWriteSchema).min(1, 'Add at least one rubric category').max(20),
})

export type RubricCategoryWrite = z.infer<typeof rubricCategoryWriteSchema>
export type RushRubricSaveWrite = z.infer<typeof rushRubricSaveSchema>

export function parseRushRubricSave(input: unknown) {
  const result = rushRubricSaveSchema.safeParse(input)
  if (!result.success) {
    return {
      data: null,
      error: result.error.issues[0]?.message ?? 'Invalid rubric',
    }
  }
  return { data: result.data, error: null }
}
