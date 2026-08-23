'use client'

import { useState } from 'react'
import {
  addReviewAccessAction,
  removeReviewAccessAction,
  updateReviewAccessMinimumAction,
} from '@/app/admin/apps/actions'
import type { ClientReviewAccess } from '@/lib/review-access-admin'

const btnClass =
  'px-4 py-2 bg-[#315CA9] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md bg-white/80 text-sm text-gray-700 outline-none transition-[border-color,box-shadow] duration-200 ease-out focus:border-[#315CA9] focus:shadow-[0_0_0_3px_rgba(49,92,169,0.18)]'
const innerCardClass = 'rounded-xl border border-gray-100 bg-white/80'
const innerCardStyle = { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)' }

function entryName(entry: ClientReviewAccess) {
  return [entry.firstName, entry.lastName].filter(Boolean).join(' ').trim()
}

function sortEntries(entries: ClientReviewAccess[]) {
  return [...entries].sort((a, b) => {
    const first = (a.firstName ?? '').localeCompare(b.firstName ?? '', undefined, {
      sensitivity: 'base',
    })
    if (first !== 0) return first
    const last = (a.lastName ?? '').localeCompare(b.lastName ?? '', undefined, {
      sensitivity: 'base',
    })
    if (last !== 0) return last
    return a.email.localeCompare(b.email)
  })
}

export function AdminReviewAccessManager({
  cycleId,
  initialEntries,
}: {
  cycleId: string
  initialEntries: ClientReviewAccess[]
}) {
  const [entries, setEntries] = useState(initialEntries)
  const [email, setEmail] = useState('')
  const [minRequired, setMinRequired] = useState('12')
  const [error, setError] = useState<string | null>(null)
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setAdding(true)
    const parsedMin = Number(minRequired)
    const result = await addReviewAccessAction({
      cycleId,
      email,
      minRequiredReviews: Number.isFinite(parsedMin) ? parsedMin : undefined,
    })
    setAdding(false)
    if (result.error || !result.entry) {
      setError(result.error ?? 'Could not add reviewer.')
      return
    }
    setEntries((current) => sortEntries([...current, result.entry!]))
    setEmail('')
    setMinRequired('12')
  }

  async function handleRemove(id: string) {
    setError(null)
    setPendingKey(id)
    const result = await removeReviewAccessAction(id, cycleId)
    setPendingKey(null)
    if (result.error) {
      setError(result.error)
      return
    }
    setEntries((current) => current.filter((entry) => entry.id !== id))
  }

  async function handleMinimumChange(id: string, value: string) {
    const parsed = Number(value)
    if (!Number.isInteger(parsed) || parsed < 1) return

    setError(null)
    setPendingKey(`min:${id}`)
    const result = await updateReviewAccessMinimumAction({
      id,
      cycleId,
      minRequiredReviews: parsed,
    })
    setPendingKey(null)
    if (result.error || !result.entry) {
      setError(result.error ?? 'Could not update minimum.')
      return
    }
    setEntries((current) =>
      current.map((entry) => (entry.id === id ? result.entry! : entry))
    )
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={(event) => void handleAdd(event)}
        className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label
              htmlFor="reviewer-email"
              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Add brother
            </label>
            <input
              id="reviewer-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="uniqname@umich.edu"
              className={inputClass}
              required
            />
          </div>
          <div className="w-full sm:w-28">
            <label
              htmlFor="reviewer-min"
              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Minimum
            </label>
            <input
              id="reviewer-min"
              type="number"
              min={1}
              value={minRequired}
              onChange={(event) => setMinRequired(event.target.value)}
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={adding} className={`${btnClass} shrink-0`}>
            {adding ? 'Adding…' : 'Add'}
          </button>
        </div>
      </form>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className={`${innerCardClass} overflow-hidden`} style={innerCardStyle}>
        {entries.length === 0 ? (
          <p className="px-4 py-2 text-sm text-gray-500">
            No brothers on the reviewer list for this cycle yet.
          </p>
        ) : (
          <ul className="max-h-64 divide-y divide-gray-100 overflow-y-auto">
            {entries.map((entry) => {
              const name = entryName(entry)
              const removing = pendingKey === entry.id
              return (
                <li
                  key={entry.id}
                  className="flex items-center justify-between gap-3 px-4 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {name || entry.email}
                    </p>
                    {name ? (
                      <p className="truncate text-xs text-gray-500">{entry.email}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs text-gray-600">
                      Min
                      <input
                        type="number"
                        min={1}
                        defaultValue={entry.minRequiredReviews}
                        disabled={pendingKey === `min:${entry.id}`}
                        onBlur={(event) =>
                          void handleMinimumChange(entry.id, event.target.value)
                        }
                        className="w-14 rounded-md border border-gray-300 px-2 py-1 text-sm"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => void handleRemove(entry.id)}
                      disabled={Boolean(pendingKey)}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                        pendingKey
                          ? 'cursor-not-allowed text-gray-300'
                          : 'cursor-pointer text-gray-400 hover:scale-110 hover:bg-red-50 hover:text-red-500'
                      }`}
                      title="Remove reviewer"
                      aria-label={`Remove ${name || entry.email}`}
                    >
                      {removing ? '…' : '×'}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
