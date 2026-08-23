'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import type { AdminApplicationListItem } from '@/lib/admin-applications'
import { exportApplicationsCsvAction } from '@/app/admin/apps/actions'

const btnClass =
  'px-4 py-2 bg-[#315CA9] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md bg-white/80 text-sm text-gray-700 outline-none transition-[border-color,box-shadow] duration-200 ease-out focus:border-[#315CA9] focus:shadow-[0_0_0_3px_rgba(49,92,169,0.18)]'

type SortKey = 'display' | 'alpha' | 'score_desc' | 'normalized_score_desc' | 'reads_desc'

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
  const [sort, setSort] = useState<SortKey>('display')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    let list = applications
    if (normalized) {
      list = list.filter((app) => {
        const haystack = [
          app.name,
          app.email,
          app.majors ?? '',
          app.displayNumber != null ? String(app.displayNumber) : '',
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(normalized)
      })
    }

    const sorted = [...list]
    sorted.sort((a, b) => {
      if (sort === 'score_desc') {
        return (b.avgScore ?? -1) - (a.avgScore ?? -1) || a.name.localeCompare(b.name)
      }
      if (sort === 'normalized_score_desc') {
        return (
          (b.normalizedAvgScore ?? -1) - (a.normalizedAvgScore ?? -1) ||
          a.name.localeCompare(b.name)
        )
      }
      if (sort === 'reads_desc') {
        return b.readCount - a.readCount || a.name.localeCompare(b.name)
      }
      if (sort === 'alpha') {
        return a.name.localeCompare(b.name)
      }
      const aNum = a.displayNumber ?? Number.MAX_SAFE_INTEGER
      const bNum = b.displayNumber ?? Number.MAX_SAFE_INTEGER
      return aNum - bNum || a.name.localeCompare(b.name)
    })
    return sorted
  }, [applications, query, sort])

  function onExport() {
    setError(null)
    startTransition(async () => {
      const result = await exportApplicationsCsvAction(cycleId, cycleName)
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
            <label htmlFor="apps-search" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Search
            </label>
            <input
              id="apps-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, email, major, or app #"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="apps-sort" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Sort
            </label>
            <select
              id="apps-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className={inputClass}
            >
              <option value="display">Application #</option>
              <option value="alpha">Name (A–Z)</option>
              <option value="score_desc">Avg score (high–low)</option>
              <option value="normalized_score_desc">Adjusted score (high–low)</option>
              <option value="reads_desc">Read count (high–low)</option>
            </select>
          </div>
        </div>
        <button type="button" onClick={onExport} disabled={pending || applications.length === 0} className={btnClass}>
          {pending ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500">
          {applications.length === 0
            ? 'No submitted applications for this cycle yet.'
            : 'No applications match your search.'}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white/80">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/80 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">App #</th>
                <th className="px-4 py-3 font-semibold">Applicant</th>
                <th className="px-4 py-3 font-semibold">Major(s)</th>
                <th className="px-4 py-3 font-semibold">Year</th>
                <th className="px-4 py-3 font-semibold">Reads</th>
                <th className="px-4 py-3 font-semibold">Avg</th>
                <th className="px-4 py-3 font-semibold">Adj</th>
                <th className="px-4 py-3 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {app.displayNumber ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{app.name}</div>
                    <div className="text-xs text-gray-500">{app.email}</div>
                  </td>
                  <td className="max-w-[12rem] truncate px-4 py-3 text-gray-700" title={app.majors ?? undefined}>
                    {app.majors || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{app.graduationYear ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{app.readCount}</td>
                  <td className="px-4 py-3 text-gray-700">{formatScore(app.avgScore)}</td>
                  <td className="px-4 py-3 text-gray-700">{formatScore(app.normalizedAvgScore)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/apps/${app.id}`}
                      className="text-sm font-semibold text-[#315CA9]"
                    >
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
