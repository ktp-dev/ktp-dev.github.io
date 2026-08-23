'use client'

import { RubricDetailPanel } from '@/components/portal/RubricDetailPanel'
import type { ReviewReferenceCategory } from '@/lib/reviews'

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
      className="group rounded-xl border border-gray-100 bg-white/70 p-4"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-gray-800 [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span className="text-xs font-normal text-gray-500 group-open:hidden">Expand</span>
        <span className="hidden text-xs font-normal text-gray-500 group-open:inline">Collapse</span>
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
          <div className="space-y-2 text-sm leading-relaxed text-gray-800">
            {questions.map((question) => (
              <div key={question.label}>
                <span className="font-semibold text-gray-900">{question.label}:</span> {question.prompt}
              </div>
            ))}
          </div>
        </CollapsibleSection>
      ) : null}

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Detailed rubric</p>
        <div className="space-y-3">
          {categories.map((category) => (
            <details
              key={category.id}
              className="group rounded-xl border border-gray-100 bg-white/70 p-3"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-gray-800 [&::-webkit-details-marker]:hidden">
                <span>{category.title}</span>
                <span className="text-xs font-normal text-gray-500 group-open:hidden">Expand</span>
                <span className="hidden text-xs font-normal text-gray-500 group-open:inline">
                  Collapse
                </span>
              </summary>
              {category.description ? (
                <p className="mt-3 text-xs leading-relaxed text-gray-500">{category.description}</p>
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
