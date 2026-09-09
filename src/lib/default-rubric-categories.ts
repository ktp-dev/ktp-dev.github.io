import type { RubricRatingLabels } from '@/db/schema'
import { DEFAULT_RUBRIC_RATINGS_BY_SORT_ORDER } from '@/lib/default-rubric-ratings'

/** Standard 7-category rush rubric titles (sort_order 0–6). */
export const DEFAULT_RUBRIC_CATEGORY_TITLES = [
  'Did the applicant put effort into the application (including the resume)?',
  'Did the applicant display creativity and passion for technology?',
  "Does the applicant's ideas draw on their experiences/identity?",
  'Does the applicant demonstrate passion or interests that would resonate with brothers?',
  'Does the applicant express a love for community?',
  'Does the applicant express a desire to learn from KTP/give back to the community?',
  "Does the applicant's resume demonstrate drive and initiative which can be expanded upon by KTP?",
] as const

export type DefaultRubricCategorySeed = {
  title: string
  description: string | null
  sortOrder: number
  scaleMin: number
  scaleMax: number
  ratingLabels: RubricRatingLabels
}

export function ratingsArrayToLabels(
  ratings: Array<{ label: string; bullets?: string[] }>,
  scaleMin: number
): RubricRatingLabels {
  const labels: RubricRatingLabels = {}
  for (let i = 0; i < ratings.length; i++) {
    const rating = ratings[i]
    if (!rating) break
    labels[String(scaleMin + i)] = {
      label: rating.label,
      bullets: rating.bullets ?? [],
    }
  }
  return labels
}

/** Default category rows for a new cycle, including rating guidance. */
export function buildDefaultRubricCategorySeeds(): DefaultRubricCategorySeed[] {
  return DEFAULT_RUBRIC_CATEGORY_TITLES.map((title, sortOrder) => {
    const ratings = DEFAULT_RUBRIC_RATINGS_BY_SORT_ORDER[sortOrder] ?? [
      { label: 'Strong No', bullets: [] },
      { label: 'Weak No', bullets: [] },
      { label: 'Weak Yes', bullets: [] },
      { label: 'Strong Yes', bullets: [] },
    ]
    return {
      title,
      description: null,
      sortOrder,
      scaleMin: 1,
      scaleMax: 4,
      ratingLabels: ratingsArrayToLabels(ratings, 1),
    }
  })
}
