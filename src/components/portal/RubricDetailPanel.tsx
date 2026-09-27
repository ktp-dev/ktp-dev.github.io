'use client'

import { ratingLabelsToList } from '@/lib/rubric-ui'
import type { RubricRatingLabels } from '@/db/schema'
import {
  readsDarkPanelClass,
  readsDarkPanelStyle,
  readsHeadingClass,
  readsMutedClass,
} from '@/components/portal/reads-ui'

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
      <p className={`text-sm ${readsMutedClass} ${className}`}>
        No detailed guidance configured for this category.
      </p>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {showTitle ? <p className={`text-sm font-medium ${readsHeadingClass}`}>{title}</p> : null}
      <div className="grid gap-2.5 md:grid-cols-2">
        {ratings.map((rating) => (
          <div
            key={`${title}-${rating.value}`}
            className={`space-y-2 p-3 ${readsDarkPanelClass}`}
            style={readsDarkPanelStyle}
          >
            <div className="text-sm font-medium text-slate-200">
              <span className="tabular-nums text-slate-400">{rating.value}</span>
              <span className="mx-1.5 text-slate-600">·</span>
              <span>{rating.label}</span>
            </div>
            {rating.bullets && rating.bullets.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-400">
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
