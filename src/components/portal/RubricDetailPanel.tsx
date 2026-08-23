'use client'

import { ratingLabelsToList } from '@/lib/rubric-ui'
import type { RubricRatingLabels } from '@/db/schema'

export function RubricDetailPanel({
  title,
  ratingLabels,
  scaleMin,
  scaleMax,
  showTitle = true,
  className = '',
}: {
  title: string
  ratingLabels: RubricRatingLabels | null
  scaleMin: number
  scaleMax: number
  showTitle?: boolean
  className?: string
}) {
  const ratings = ratingLabelsToList(ratingLabels, scaleMin, scaleMax)
  if (ratings.length === 0) {
    return (
      <p className={`text-sm text-gray-500 ${className}`}>
        No detailed guidance configured for this category.
      </p>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {showTitle ? <p className="text-sm font-medium text-gray-800">{title}</p> : null}
      <div className="grid gap-3 md:grid-cols-2">
        {ratings.map((rating) => (
          <div
            key={`${title}-${rating.value}`}
            className="space-y-2 rounded-xl border border-gray-100 bg-white/80 p-3"
            style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)' }}
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {rating.value} · {rating.label}
            </div>
            {rating.bullets && rating.bullets.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-700">
                {rating.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
