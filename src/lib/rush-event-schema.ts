import { z } from 'zod'

const emptyToNull = (value: string | null | undefined) => {
  if (value == null) return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

export const rushEventSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  datetime: z.string().trim().min(1, 'Date and time are required').max(200),
  location: z.string().trim().min(1, 'Location is required').max(200),
  description: z
    .string()
    .max(2000)
    .nullable()
    .optional()
    .transform(emptyToNull),
  button_label: z
    .string()
    .max(100)
    .nullable()
    .optional()
    .transform(emptyToNull),
  button_url: z
    .string()
    .max(2000)
    .nullable()
    .optional()
    .transform(emptyToNull)
    .refine(
      (value) => value === null || URL.canParse(value),
      'Button URL must be a valid URL'
    ),
  order_index: z.number().int().min(0),
})

export const rushEventIdSchema = z.uuid('Invalid event id')

export const rushEventOrderSchema = z
  .array(
    z.object({
      id: z.uuid('Invalid event id'),
      order_index: z.number().int().min(0),
    })
  )
  .min(1)
  .max(100)

export type RushEventWrite = z.infer<typeof rushEventSchema>

export function parseRushEvent(event: unknown) {
  const result = rushEventSchema.safeParse(event)
  if (!result.success) {
    return {
      data: null,
      error: result.error.issues[0]?.message ?? 'Invalid event',
    }
  }
  return { data: result.data, error: null }
}

export function parseRushEventId(eventId: unknown) {
  const result = rushEventIdSchema.safeParse(eventId)
  if (!result.success) {
    return {
      data: null,
      error: result.error.issues[0]?.message ?? 'Invalid event id',
    }
  }
  return { data: result.data, error: null }
}

export function parseRushEventOrder(orderUpdates: unknown) {
  const result = rushEventOrderSchema.safeParse(orderUpdates)
  if (!result.success) {
    return {
      data: null,
      error: result.error.issues[0]?.message ?? 'Invalid event order',
    }
  }
  return { data: result.data, error: null }
}
