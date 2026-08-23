'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { RubricRatingLabels } from '@/db/schema'
import { RubricDetailPanel } from '@/components/portal/RubricDetailPanel'
import { readsScoreBtnClass } from '@/components/portal/reads-ui'
import { resolveRatingLabels, ratingLabelsToList } from '@/lib/rubric-ui'

const MODAL_ANIMATION_MS = 280

const helpBtnClass =
  'inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-blue-50 hover:text-[#315CA9]'

function HelpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

const closeBtnClass =
  'shrink-0 cursor-pointer text-xs font-semibold text-[#315CA9] transition-colors hover:underline'

export function ScoreCategoryCard({
  category,
  value,
  onChange,
}: {
  category: {
    id: string
    title: string
    description: string | null
    sortOrder: number
    scaleMin: number
    scaleMax: number
    ratingLabels: RubricRatingLabels | null
  }
  value?: number
  onChange: (value: number) => void
}) {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resolvedLabels = resolveRatingLabels(category)
  const hasRubricDetail = Boolean(resolvedLabels && Object.keys(resolvedLabels).length > 0)
  const ratingList = ratingLabelsToList(
    resolvedLabels,
    category.scaleMin,
    category.scaleMax
  )
  const lowLabel = ratingList[0]?.label
  const highLabel = ratingList[ratingList.length - 1]?.label
  const scores = Array.from(
    { length: category.scaleMax - category.scaleMin + 1 },
    (_, i) => category.scaleMin + i
  )

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
    return () => cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  function openModal() {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    setVisible(false)
    setOpen(true)
  }

  function closeModal() {
    setVisible(false)
    closeTimeoutRef.current = setTimeout(() => setOpen(false), MODAL_ANIMATION_MS)
  }

  return (
    <>
      <div className="rounded-xl border border-gray-100 bg-white/70 p-3">
        <div className="relative pr-7">
          <p className="text-sm font-medium leading-snug text-gray-800">{category.title}</p>
          {category.description ? (
            <p className="mt-1 text-xs leading-relaxed text-gray-500">{category.description}</p>
          ) : null}
          {hasRubricDetail ? (
            <button
              type="button"
              className={`absolute right-0 top-0 ${helpBtnClass}`}
              onClick={openModal}
              title="Rubric details"
              aria-label="View rubric details"
            >
              <HelpIcon />
            </button>
          ) : null}
        </div>
        <div className="mt-3">
          <div className="hidden items-center gap-4 sm:flex md:gap-5">
            {lowLabel ? (
              <span className="w-[5.25rem] shrink-0 text-xs leading-snug text-gray-500 md:w-28">
                {lowLabel}
              </span>
            ) : (
              <span className="w-0 shrink-0" aria-hidden />
            )}
            <div className="flex flex-1 justify-center gap-3 md:gap-3.5">
              {scores.map((score) => {
                const selected = value === score
                return (
                  <button
                    key={score}
                    type="button"
                    onClick={() => onChange(score)}
                    className={readsScoreBtnClass(selected)}
                  >
                    {score}
                  </button>
                )
              })}
            </div>
            {highLabel ? (
              <span className="w-[5.25rem] shrink-0 text-right text-xs leading-snug text-gray-500 md:w-28">
                {highLabel}
              </span>
            ) : null}
          </div>

          <div className="sm:hidden">
            <div className="flex justify-center gap-3">
              {scores.map((score) => {
                const selected = value === score
                return (
                  <button
                    key={score}
                    type="button"
                    onClick={() => onChange(score)}
                    className={readsScoreBtnClass(selected)}
                  >
                    {score}
                  </button>
                )
              })}
            </div>
            {lowLabel || highLabel ? (
              <div className="mt-2.5 flex items-start justify-between gap-4 px-0.5">
                {lowLabel ? (
                  <span className="max-w-[46%] text-[11px] leading-snug text-gray-500">{lowLabel}</span>
                ) : (
                  <span />
                )}
                {highLabel ? (
                  <span className="max-w-[46%] text-right text-[11px] leading-snug text-gray-500">
                    {highLabel}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {open &&
        typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
            <div
              className={`absolute inset-0 bg-black/15 backdrop-blur-md transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                visible ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={closeModal}
            />
            <div
              className={`relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-gray-100 bg-white/95 p-6 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-95 opacity-0'
              }`}
              style={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)' }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold leading-relaxed text-gray-900">
                  {category.title}
                </h3>
                <button type="button" className={closeBtnClass} onClick={closeModal}>
                  Close
                </button>
              </div>
              <div className="min-h-0 overflow-y-auto">
                <RubricDetailPanel
                  title={category.title}
                  ratingLabels={resolvedLabels}
                  scaleMin={category.scaleMin}
                  scaleMax={category.scaleMax}
                  showTitle={false}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
