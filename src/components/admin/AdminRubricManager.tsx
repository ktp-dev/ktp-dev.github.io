'use client'

import { useState } from 'react'
import { saveRushRubricCategories } from '@/app/admin/actions'
import type { RubricRatingLabels } from '@/db/schema'
import { buildDefaultRubricCategorySeeds } from '@/lib/default-rubric-categories'
import type { ClientRubricCategory } from '@/lib/rubric-admin'

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 outline-none transition-[border-color,box-shadow] duration-200 ease-out focus:border-[#315CA9] focus:shadow-[0_0_0_3px_rgba(49,92,169,0.18)] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-600 disabled:shadow-none'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
const btnClass =
  'px-4 py-2 bg-[#315CA9] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
const ghostBtnClass =
  'px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
const innerCardClass = 'rounded-xl border border-gray-100 bg-white/80 p-4'
const innerCardStyle = { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)' }

type RatingDraft = {
  label: string
  bulletsText: string
}

type CategoryDraft = {
  key: string
  id?: string
  title: string
  description: string
  scaleMin: number
  scaleMax: number
  ratings: RatingDraft[]
  expanded: boolean
}

function emptyRatings(scaleMin: number, scaleMax: number): RatingDraft[] {
  const defaults = ['Strong No', 'Weak No', 'Weak Yes', 'Strong Yes']
  return Array.from({ length: scaleMax - scaleMin + 1 }, (_, index) => ({
    label: defaults[index] ?? `Score ${scaleMin + index}`,
    bulletsText: '',
  }))
}

function ratingsFromLabels(
  labels: RubricRatingLabels | null,
  scaleMin: number,
  scaleMax: number
): RatingDraft[] {
  return Array.from({ length: scaleMax - scaleMin + 1 }, (_, index) => {
    const value = scaleMin + index
    const entry = labels?.[String(value)]
    return {
      label: entry?.label ?? '',
      bulletsText: (entry?.bullets ?? []).join('\n'),
    }
  })
}

function categoriesFromServer(categories: ClientRubricCategory[]): CategoryDraft[] {
  return categories.map((category) => ({
    key: category.id,
    id: category.id,
    title: category.title,
    description: category.description ?? '',
    scaleMin: category.scale_min,
    scaleMax: category.scale_max,
    ratings: ratingsFromLabels(category.rating_labels, category.scale_min, category.scale_max),
    expanded: false,
  }))
}

function emptyCategory(): CategoryDraft {
  return {
    key: `new-${crypto.randomUUID()}`,
    title: '',
    description: '',
    scaleMin: 1,
    scaleMax: 4,
    ratings: emptyRatings(1, 4),
    expanded: true,
  }
}

function defaultsAsDrafts(): CategoryDraft[] {
  return buildDefaultRubricCategorySeeds().map((seed) => ({
    key: `new-${crypto.randomUUID()}`,
    title: seed.title,
    description: seed.description ?? '',
    scaleMin: seed.scaleMin,
    scaleMax: seed.scaleMax,
    ratings: ratingsFromLabels(seed.ratingLabels, seed.scaleMin, seed.scaleMax),
    expanded: false,
  }))
}

function resizeRatings(category: CategoryDraft, scaleMin: number, scaleMax: number): RatingDraft[] {
  const next = emptyRatings(scaleMin, scaleMax)
  return next.map((fallback, index) => {
    const previous = category.ratings[index]
    return {
      label: previous?.label || fallback.label,
      bulletsText: previous?.bulletsText ?? '',
    }
  })
}

export function AdminRubricManager({
  cycleId,
  initialCategories,
  onUpdated,
}: {
  cycleId: string
  initialCategories: ClientRubricCategory[]
  onUpdated?: (categories: ClientRubricCategory[]) => void
}) {
  const [serverCategories, setServerCategories] = useState(initialCategories)
  const [categories, setCategories] = useState<CategoryDraft[]>(
    initialCategories.length ? categoriesFromServer(initialCategories) : []
  )
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fieldsEditable = isEditing

  function applyServer(next: ClientRubricCategory[]) {
    setServerCategories(next)
    setCategories(next.length ? categoriesFromServer(next) : [])
    setIsEditing(false)
    onUpdated?.(next)
  }

  function handleCancel() {
    setError(null)
    setCategories(serverCategories.length ? categoriesFromServer(serverCategories) : [])
    setIsEditing(false)
  }

  function updateCategory(key: string, patch: Partial<CategoryDraft>) {
    setCategories((current) =>
      current.map((category) => (category.key === key ? { ...category, ...patch } : category))
    )
  }

  function moveCategory(index: number, direction: -1 | 1) {
    const next = index + direction
    if (next < 0 || next >= categories.length) return
    const copy = [...categories]
    const [item] = copy.splice(index, 1)
    copy.splice(next, 0, item)
    setCategories(copy)
  }

  function removeCategory(key: string) {
    if (categories.length <= 1) {
      setError('Keep at least one rubric category.')
      return
    }
    if (!confirm('Remove this rubric category? Existing scores for it will keep historical data.')) {
      return
    }
    setCategories((current) => current.filter((category) => category.key !== key))
  }

  function setScale(key: string, scaleMin: number, scaleMax: number) {
    if (scaleMax < scaleMin || scaleMax - scaleMin + 1 > 8) return
    setCategories((current) =>
      current.map((category) => {
        if (category.key !== key) return category
        return {
          ...category,
          scaleMin,
          scaleMax,
          ratings: resizeRatings(category, scaleMin, scaleMax),
        }
      })
    )
  }

  async function handleSave() {
    setIsSaving(true)
    setError(null)
    const payload = {
      categories: categories.map((category, index) => {
        const rating_labels: RubricRatingLabels = {}
        for (let i = 0; i < category.ratings.length; i++) {
          const rating = category.ratings[i]
          rating_labels[String(category.scaleMin + i)] = {
            label: rating.label,
            bullets: rating.bulletsText
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean),
          }
        }
        return {
          id: category.id,
          title: category.title,
          description: category.description,
          sort_order: index,
          scale_min: category.scaleMin,
          scale_max: category.scaleMax,
          rating_labels,
        }
      }),
    }

    const result = await saveRushRubricCategories(cycleId, payload)
    setIsSaving(false)
    if (result.error || !result.data) {
      setError(result.error ?? 'Failed to save rubric')
      return
    }
    applyServer(result.data.categories)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-inter">Review rubric</h2>
          <p className="mt-1 text-sm text-gray-500">
            Categories and score guidance shown to brothers on Application Reads.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {fieldsEditable ? (
            <>
              <button
                type="button"
                className={ghostBtnClass}
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="button"
                className={btnClass}
                onClick={() => void handleSave()}
                disabled={isSaving || categories.length === 0}
              >
                {isSaving ? 'Saving…' : 'Save rubric'}
              </button>
            </>
          ) : (
            <button
              type="button"
              className={btnClass}
              onClick={() => {
                window.setTimeout(() => setIsEditing(true), 0)
              }}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {categories.length === 0 ? (
        <div className={innerCardClass} style={innerCardStyle}>
          <p className="text-sm text-gray-600">
            No rubric categories for this cycle yet. Load the standard 7-category rubric to get
            started.
          </p>
          {fieldsEditable ? (
            <button
              type="button"
              className={`${btnClass} mt-3`}
              onClick={() => setCategories(defaultsAsDrafts())}
            >
              Load standard rubric
            </button>
          ) : (
            <button
              type="button"
              className={`${btnClass} mt-3`}
              onClick={() => {
                setCategories(defaultsAsDrafts())
                setIsEditing(true)
              }}
            >
              Load standard rubric
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category, index) => (
            <div key={category.key} className={innerCardClass} style={innerCardStyle}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Category {index + 1}
                </p>
                {fieldsEditable ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={ghostBtnClass}
                      onClick={() => moveCategory(index, -1)}
                      disabled={index === 0 || isSaving}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      className={ghostBtnClass}
                      onClick={() => moveCategory(index, 1)}
                      disabled={index === categories.length - 1 || isSaving}
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      className={ghostBtnClass}
                      onClick={() => removeCategory(category.key)}
                      disabled={isSaving || categories.length <= 1}
                    >
                      Remove
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="mt-3 space-y-3">
                <div>
                  <label className={labelClass} htmlFor={`rubric-title-${category.key}`}>
                    Prompt <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={`rubric-title-${category.key}`}
                    className={inputClass}
                    value={category.title}
                    onChange={(event) =>
                      updateCategory(category.key, { title: event.target.value })
                    }
                    disabled={!fieldsEditable || isSaving}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor={`rubric-desc-${category.key}`}>
                    Optional subtitle
                  </label>
                  <input
                    id={`rubric-desc-${category.key}`}
                    className={inputClass}
                    value={category.description}
                    onChange={(event) =>
                      updateCategory(category.key, { description: event.target.value })
                    }
                    disabled={!fieldsEditable || isSaving}
                    placeholder="Shown under the prompt on the scoring card"
                  />
                </div>

                {fieldsEditable ? (
                  <div className="grid grid-cols-2 gap-3 sm:max-w-xs">
                    <div>
                      <label className={labelClass} htmlFor={`rubric-min-${category.key}`}>
                        Scale min
                      </label>
                      <input
                        id={`rubric-min-${category.key}`}
                        type="number"
                        min={1}
                        max={10}
                        className={inputClass}
                        value={category.scaleMin}
                        onChange={(event) =>
                          setScale(category.key, Number(event.target.value), category.scaleMax)
                        }
                        disabled={isSaving}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor={`rubric-max-${category.key}`}>
                        Scale max
                      </label>
                      <input
                        id={`rubric-max-${category.key}`}
                        type="number"
                        min={1}
                        max={10}
                        className={inputClass}
                        value={category.scaleMax}
                        onChange={(event) =>
                          setScale(category.key, category.scaleMin, Number(event.target.value))
                        }
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Scale {category.scaleMin}–{category.scaleMax}
                  </p>
                )}

                <button
                  type="button"
                  className="cursor-pointer text-sm font-semibold text-[#315CA9]"
                  onClick={() =>
                    updateCategory(category.key, { expanded: !category.expanded })
                  }
                >
                  {category.expanded ? 'Hide rating guidance' : 'Show rating guidance'}
                </button>

                {category.expanded ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {category.ratings.map((rating, ratingIndex) => {
                      const score = category.scaleMin + ratingIndex
                      return (
                        <div
                          key={`${category.key}-${score}`}
                          className="rounded-lg border border-gray-100 bg-white/90 p-3"
                        >
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Score {score}
                          </p>
                          <label
                            className={labelClass}
                            htmlFor={`rubric-label-${category.key}-${score}`}
                          >
                            Label
                          </label>
                          <input
                            id={`rubric-label-${category.key}-${score}`}
                            className={inputClass}
                            value={rating.label}
                            onChange={(event) => {
                              const nextRatings = [...category.ratings]
                              nextRatings[ratingIndex] = {
                                ...rating,
                                label: event.target.value,
                              }
                              updateCategory(category.key, { ratings: nextRatings })
                            }}
                            disabled={!fieldsEditable || isSaving}
                          />
                          <label
                            className={`${labelClass} mt-2`}
                            htmlFor={`rubric-bullets-${category.key}-${score}`}
                          >
                            Guidance bullets (one per line)
                          </label>
                          <textarea
                            id={`rubric-bullets-${category.key}-${score}`}
                            className={`${inputClass} min-h-[6rem]`}
                            value={rating.bulletsText}
                            onChange={(event) => {
                              const nextRatings = [...category.ratings]
                              nextRatings[ratingIndex] = {
                                ...rating,
                                bulletsText: event.target.value,
                              }
                              updateCategory(category.key, { ratings: nextRatings })
                            }}
                            disabled={!fieldsEditable || isSaving}
                          />
                        </div>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {fieldsEditable ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={ghostBtnClass}
            onClick={() => setCategories((current) => [...current, emptyCategory()])}
            disabled={isSaving || categories.length >= 20}
          >
            Add category
          </button>
          {categories.length === 0 ? null : (
            <button
              type="button"
              className={ghostBtnClass}
              onClick={() => {
                if (
                  !confirm(
                    'Replace the current draft with the standard 7-category rubric? Unsaved edits will be lost.'
                  )
                ) {
                  return
                }
                setCategories(defaultsAsDrafts())
              }}
              disabled={isSaving}
            >
              Reset to standard rubric
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}
