'use client'

import { RubricDetailPanel } from '@/components/portal/RubricDetailPanel'
import {
  readsBodyClass,
  readsDarkPanelClass,
  readsDarkPanelStyle,
  readsHeadingClass,
  readsMutedClass,
} from '@/components/portal/reads-ui'
import type { ReviewReferenceCategory } from '@/lib/reviews'

const flatDetailsClass =
  'group rounded-lg border border-white/10 bg-transparent p-3 sm:p-4'

function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  return (
    <details
      className={`group p-4 ${readsDarkPanelClass}`}
      style={readsDarkPanelStyle}
      open={defaultOpen}
    >
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold ${readsHeadingClass} [&::-webkit-details-marker]:hidden`}
      >
        <span>{title}</span>
        <span className={`text-xs font-normal ${readsMutedClass} group-open:hidden`}>Expand</span>
        <span className={`hidden text-xs font-normal ${readsMutedClass} group-open:inline`}>
          Collapse
        </span>
      </summary>
      <div className="mt-4 space-y-4 text-sm">{children}</div>
    </details>
  )
}

export function RubricReference({
  questions,
  categories,
}: {
  questions: Array<{ label: string; prompt: string }>
  categories: ReviewReferenceCategory[]
}) {
  return (
    <div className="space-y-4">
      {questions.length > 0 ? (
        <CollapsibleSection title="Application questions" defaultOpen>
          <div className={`space-y-2 text-sm leading-relaxed ${readsBodyClass}`}>
            {questions.map((question) => (
              <div key={question.label}>
                <span className={`font-semibold ${readsHeadingClass}`}>{question.label}:</span>{' '}
                {question.prompt}
              </div>
            ))}
          </div>
        </CollapsibleSection>
      ) : null}

      <div className="space-y-3">
        <p className={`text-xs font-semibold uppercase tracking-wide ${readsMutedClass}`}>
          Detailed rubric
        </p>
        <div className="space-y-2">
          {categories.map((category) => (
            <details key={category.id} className={flatDetailsClass}>
              <summary
                className={`flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold ${readsHeadingClass} [&::-webkit-details-marker]:hidden`}
              >
                <span>{category.title}</span>
                <span className={`text-xs font-normal ${readsMutedClass} group-open:hidden`}>
                  Expand
                </span>
                <span className={`hidden text-xs font-normal ${readsMutedClass} group-open:inline`}>
                  Collapse
                </span>
              </summary>
              {category.description ? (
                <p className={`mt-3 text-xs leading-relaxed ${readsMutedClass}`}>
                  {category.description}
                </p>
              ) : null}
              <RubricDetailPanel
                title={category.title}
                ratingLabels={category.ratingLabels}
                scaleMin={category.scaleMin}
                scaleMax={category.scaleMax}
                showTitle={false}
                className="mt-3"
              />
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
