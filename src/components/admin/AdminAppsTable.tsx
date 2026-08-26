'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  filterAdminApplications,
  sortAdminApplications,
  type AdminApplicationListItem,
  type AdminApplicationSortKey,
} from '@/lib/admin-applications-shared'
import { exportApplicationsCsvAction } from '@/app/admin/apps/actions'
import {
  adminBodyClass,
  adminFieldClass,
  adminFieldEditStyle,
  adminHeadingClass,
  adminLabelClass,
  adminLinkClass,
  adminMutedClass,
  adminPrimaryBtnClass,
  adminTableHeadClass,
  adminTableRowClass,
  adminTableWrapClass,
  adminTableWrapStyle,
} from '@/components/admin/admin-ui'

function formatScore(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return '—'
  return value.toFixed(2)
}

export function AdminAppsTable({
  cycleId,
  cycleName,
  applications,
}: {
  cycleId: string
  cycleName: string
  applications: AdminApplicationListItem[]
}) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<AdminApplicationSortKey>('display')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const filtered = useMemo(
    () => sortAdminApplications(filterAdminApplications(applications, query), sort),
    [applications, query, sort]
  )

  function onExport() {
    setError(null)
    startTransition(async () => {
      const result = await exportApplicationsCsvAction(cycleId, cycleName, { query, sort })
      if (result.error || !result.csv) {
        setError(result.error ?? 'Export failed.')
        return
      }
      const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = result.filename ?? 'applications.csv'
      anchor.click()
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="apps-search" className={adminLabelClass}>
              Search
            </label>
            <input
              id="apps-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, email, major, or app #"
              className={adminFieldClass}
              style={adminFieldEditStyle}
            />
          </div>
          <div>
            <label htmlFor="apps-sort" className={adminLabelClass}>
              Sort
            </label>
            <select
              id="apps-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as AdminApplicationSortKey)}
              className={adminFieldClass}
              style={adminFieldEditStyle}
            >
              <option value="display">Application #</option>
              <option value="alpha">Name (A–Z)</option>
              <option value="score_desc">Avg score (high–low)</option>
              <option value="normalized_score_desc">Adjusted score (high–low)</option>
              <option value="reads_desc">Read count (high–low)</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={onExport}
          disabled={pending || applications.length === 0}
          className={adminPrimaryBtnClass}
        >
          {pending ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      {filtered.length === 0 ? (
        <p className={`text-sm ${adminMutedClass}`}>
          {applications.length === 0
            ? 'No submitted applications for this cycle yet.'
            : 'No applications match your search.'}
        </p>
      ) : (
        <div
          className={`max-h-[min(36rem,70vh)] overflow-y-auto overflow-x-auto ${adminTableWrapClass}`}
          style={adminTableWrapStyle}
        >
          <table className="min-w-full text-left text-sm">
            <thead className={`sticky top-0 z-10 ${adminTableHeadClass}`}>
              <tr>
                <th className="px-4 py-3">App #</th>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Major(s)</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Reads</th>
                <th className="px-4 py-3">Avg</th>
                <th className="px-4 py-3">Adj</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className={adminTableRowClass}>
                  <td className={`px-4 py-3 font-medium ${adminHeadingClass}`}>
                    {app.displayNumber ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className={`font-medium ${adminHeadingClass}`}>{app.name}</div>
                    <div className={`text-xs ${adminMutedClass}`}>{app.email}</div>
                  </td>
                  <td
                    className={`max-w-[12rem] truncate px-4 py-3 ${adminBodyClass}`}
                    title={app.majors ?? undefined}
                  >
                    {app.majors || '—'}
                  </td>
                  <td className={`px-4 py-3 ${adminBodyClass}`}>
                    {app.graduationYear ?? '—'}
                  </td>
                  <td className={`px-4 py-3 ${adminBodyClass}`}>{app.readCount}</td>
                  <td className={`px-4 py-3 ${adminBodyClass}`}>
                    {formatScore(app.avgScore)}
                  </td>
                  <td className={`px-4 py-3 ${adminBodyClass}`}>
                    {formatScore(app.normalizedAvgScore)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/apps/${app.id}`} className={adminLinkClass}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
