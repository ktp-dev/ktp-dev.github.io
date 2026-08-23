'use client'

import { useMemo, useState } from 'react'
import type { AdminReviewerProgress } from '@/lib/admin-reviewer-progress'

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md bg-white/80 text-sm text-gray-700 outline-none transition-[border-color,box-shadow] duration-200 ease-out focus:border-[#315CA9] focus:shadow-[0_0_0_3px_rgba(49,92,169,0.18)]'

type SortKey = 'alpha' | 'reads_desc' | 'reads_asc' | 'remaining_desc'

function formatDuration(ms: number | null) {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return '—'
  const minutes = Math.round(ms / 60000)
  if (minutes < 1) return '<1 min'
  return `${minutes} min`
}

export function AdminReviewerProgressTable({
  reviewers,
}: {
  reviewers: AdminReviewerProgress[]
}) {
  const [sort, setSort] = useState<SortKey>('reads_desc')

  const sorted = useMemo(() => {
    const list = [...reviewers]
    list.sort((a, b) => {
      if (sort === 'reads_asc') {
        return a.completedCount - b.completedCount || a.email.localeCompare(b.email)
      }
      if (sort === 'remaining_desc') {
        return (
          b.remainingToMinimum - a.remainingToMinimum ||
          a.email.localeCompare(b.email)
        )
      }
      if (sort === 'alpha') {
        const nameA = (a.name ?? a.email).toLowerCase()
        const nameB = (b.name ?? b.email).toLowerCase()
        return nameA.localeCompare(nameB)
      }
      return b.completedCount - a.completedCount || a.email.localeCompare(b.email)
    })
    return list
  }, [reviewers, sort])

  if (reviewers.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Add reviewers above to track their progress toward the minimum.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="max-w-xs">
        <label
          htmlFor="reviewer-progress-sort"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
        >
          Sort
        </label>
        <select
          id="reviewer-progress-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as SortKey)}
          className={inputClass}
        >
          <option value="reads_desc">Completed (high–low)</option>
          <option value="reads_asc">Completed (low–high)</option>
          <option value="remaining_desc">Remaining (high–low)</option>
          <option value="alpha">Name (A–Z)</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white/80">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/80 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Reviewer</th>
              <th className="px-4 py-3 font-semibold">Completed</th>
              <th className="px-4 py-3 font-semibold">Minimum</th>
              <th className="px-4 py-3 font-semibold">Remaining</th>
              <th className="px-4 py-3 font-semibold">Avg time</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((reviewer) => {
              const met = reviewer.completedCount >= reviewer.minRequiredReviews
              return (
                <tr key={reviewer.email} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {reviewer.name ?? reviewer.email}
                    </div>
                    {reviewer.name ? (
                      <div className="text-xs text-gray-500">{reviewer.email}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{reviewer.completedCount}</td>
                  <td className="px-4 py-3 text-gray-700">{reviewer.minRequiredReviews}</td>
                  <td className="px-4 py-3 text-gray-700">{reviewer.remainingToMinimum}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {formatDuration(reviewer.avgDurationMs)}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-600">
                    {!reviewer.hasSignedIn
                      ? 'Not signed in yet'
                      : met
                        ? 'Met minimum'
                        : `${reviewer.remainingToMinimum} remaining`}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
