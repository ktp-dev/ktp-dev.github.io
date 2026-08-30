'use client'

import { useMemo, useState } from 'react'
import type { AdminReviewerProgress } from '@/lib/admin-reviewer-progress'
import {
  adminBodyClass,
  adminFieldClass,
  adminFieldEditStyle,
  adminHeadingClass,
  adminLabelClass,
  adminMutedClass,
  adminTableHeadClass,
  adminTableRowClass,
  adminTableWrapClass,
  adminTableWrapStyle,
} from '@/components/admin/admin-ui'

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
      <p className={`text-sm ${adminMutedClass}`}>
        Add reviewers above to track their progress toward the minimum.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="max-w-xs">
        <label htmlFor="reviewer-progress-sort" className={adminLabelClass}>
          Sort
        </label>
        <select
          id="reviewer-progress-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as SortKey)}
          className={adminFieldClass}
          style={adminFieldEditStyle}
        >
          <option value="reads_desc">Completed (high–low)</option>
          <option value="reads_asc">Completed (low–high)</option>
          <option value="remaining_desc">Remaining (high–low)</option>
          <option value="alpha">Name (A–Z)</option>
        </select>
      </div>

      <div className={`overflow-x-auto ${adminTableWrapClass}`} style={adminTableWrapStyle}>
        <table className="min-w-full text-left text-sm">
          <thead className={adminTableHeadClass}>
            <tr>
              <th className="px-4 py-3">Reviewer</th>
              <th className="px-4 py-3">Completed</th>
              <th className="px-4 py-3">Minimum</th>
              <th className="px-4 py-3">Remaining</th>
              <th className="px-4 py-3">Avg time</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((reviewer) => {
              const met = reviewer.completedCount >= reviewer.minRequiredReviews
              return (
                <tr key={reviewer.email} className={adminTableRowClass}>
                  <td className="px-4 py-3">
                    <div className={`font-medium ${adminHeadingClass}`}>
                      {reviewer.name ?? reviewer.email}
                    </div>
                    {reviewer.name ? (
                      <div className={`text-xs ${adminMutedClass}`}>{reviewer.email}</div>
                    ) : null}
                  </td>
                  <td className={`px-4 py-3 ${adminBodyClass}`}>{reviewer.completedCount}</td>
                  <td className={`px-4 py-3 ${adminBodyClass}`}>{reviewer.minRequiredReviews}</td>
                  <td className={`px-4 py-3 ${adminBodyClass}`}>{reviewer.remainingToMinimum}</td>
                  <td className={`px-4 py-3 ${adminBodyClass}`}>
                    {formatDuration(reviewer.avgDurationMs)}
                  </td>
                  <td className={`px-4 py-3 text-xs font-medium ${adminMutedClass}`}>
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
