import type { RubricRatingLabels } from '@/db/schema'
import { DEFAULT_RUBRIC_RATINGS_BY_SORT_ORDER } from '@/lib/default-rubric-ratings'

export function resolveRatingLabels(category: {
  sortOrder: number
  scaleMin: number
  scaleMax: number
  ratingLabels: RubricRatingLabels | null
}): RubricRatingLabels | null {
  if (category.ratingLabels && Object.keys(category.ratingLabels).length > 0) {
    return category.ratingLabels
  }

  const defaults = DEFAULT_RUBRIC_RATINGS_BY_SORT_ORDER[category.sortOrder]
  if (!defaults) return null

  const count = category.scaleMax - category.scaleMin + 1
  const labels: RubricRatingLabels = {}
  for (let i = 0; i < count; i++) {
    const rating = defaults[i]
    if (!rating) break
    labels[String(category.scaleMin + i)] = rating
  }
  return labels
}

export function ratingLabelsToList(
  labels: RubricRatingLabels | null,
  scaleMin: number,
  scaleMax: number
) {
  if (!labels) return []
  return Array.from({ length: scaleMax - scaleMin + 1 }, (_, index) => {
    const value = scaleMin + index
    const entry = labels[String(value)]
    return entry ? { value, ...entry } : null
  }).filter((entry): entry is { value: number; label: string; bullets?: string[] } =>
    Boolean(entry)
  )
}
