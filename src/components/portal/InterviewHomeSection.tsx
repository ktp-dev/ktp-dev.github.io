'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DUMMY_INTERVIEWS, submittedLabel, type InterviewRow } from '@/components/portal/interview-data'

const COLUMNS: { key: keyof InterviewRow | 'submitted'; label: string; width: string }[] = [
  { key: 'company', label: 'Company', width: '10rem' },
  { key: 'role', label: 'Role', width: '16rem' },
  { key: 'round', label: 'Round', width: '11rem' },
  { key: 'outcome', label: 'Outcome', width: '9rem' },
  { key: 'asked', label: 'What they asked', width: '24rem' },
  { key: 'brother', label: 'Brother', width: '11rem' },
  { key: 'submitted', label: 'Submitted', width: '11rem' },
]

const btnClass =
  'inline-flex px-4 py-2 bg-[#315CA9] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
const ghostBtnClass =
  'inline-flex px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
const iconBtnClass =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-blue-50 hover:text-[#315CA9] cursor-pointer'
const searchInputClass =
  'h-9 w-44 sm:w-56 rounded-lg border border-gray-300 bg-white/80 py-0 pl-9 pr-3 text-sm text-gray-700 outline-none transition-[border-color,box-shadow] duration-200 ease-out focus:border-[#315CA9] focus:shadow-[0_0_0_3px_rgba(49,92,169,0.18)]'
const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md bg-white/80 text-sm text-gray-700 outline-none transition-[border-color,box-shadow] duration-200 ease-out focus:border-[#315CA9] focus:shadow-[0_0_0_3px_rgba(49,92,169,0.18)]'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
const innerCardClass = 'rounded-xl border border-gray-100 bg-white/80 px-4 py-3'
const innerCardStyle = { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)' }
const MODAL_ANIMATION_MS = 280

const emptyForm = {
  company: '',
  role: '',
  round: '',
  outcome: 'Moved to onsite',
  asked: '',
  brother: '',
}

function cellValue(row: InterviewRow, key: (typeof COLUMNS)[number]['key']) {
  if (key === 'submitted') return submittedLabel(row.daysAgo)
  return row[key] || '—'
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
    </svg>
  )
}

function CollapseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 9h5V4M20 9h-5V4M4 15h5v5M20 15h-5v5" />
    </svg>
  )
}

function matchesQuery(row: InterviewRow, query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return COLUMNS.some((column) => cellValue(row, column.key).toLowerCase().includes(needle))
}

function Spreadsheet({ rows }: { rows: InterviewRow[] }) {
  return (
    <div
      className="h-full min-w-0 max-w-full overflow-auto overscroll-none rounded-xl border border-gray-100 bg-white/80"
      style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)', overscrollBehavior: 'none' }}
    >
      <table className="w-[92rem] table-fixed border-separate border-spacing-0 text-left text-sm">
        <colgroup>
          {COLUMNS.map((column) => (
            <col key={column.key} style={{ width: column.width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {COLUMNS.map((column, index) => (
              <th
                key={column.key}
                className={`sticky top-0 z-20 whitespace-nowrap border-b border-gray-100 bg-[#f8fafc] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 ${
                  index === 0 ? 'left-0 z-30' : ''
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-sm text-gray-500">
                No interviews match that search.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="group">
                {COLUMNS.map((column, index) => (
                  <td
                    key={column.key}
                    className={`align-top whitespace-normal break-words border-b border-gray-50 px-4 py-2.5 text-gray-700 group-hover:bg-[#eef4fb] ${
                      index === 0
                        ? 'sticky left-0 z-20 bg-white font-medium text-gray-800'
                        : 'relative z-0'
                    }`}
                  >
                    {cellValue(row, column.key)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export function InterviewHomeSection() {
  const [people, setPeople] = useState(DUMMY_INTERVIEWS)
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [isSheetVisible, setIsSheetVisible] = useState(false)
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const closeSheetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeAddTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const recent = people.slice(0, 3)
  const rows = useMemo(() => people.filter((row) => matchesQuery(row, query)), [people, query])

  useEffect(() => {
    if (!expanded) return
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsSheetVisible(true))
    })
    return () => cancelAnimationFrame(frame)
  }, [expanded])

  useEffect(() => {
    if (!addOpen) return
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsAddVisible(true))
    })
    return () => cancelAnimationFrame(frame)
  }, [addOpen])

  useEffect(() => {
    return () => {
      if (closeSheetTimeoutRef.current) clearTimeout(closeSheetTimeoutRef.current)
      if (closeAddTimeoutRef.current) clearTimeout(closeAddTimeoutRef.current)
    }
  }, [])

  function openSheet() {
    if (closeSheetTimeoutRef.current) clearTimeout(closeSheetTimeoutRef.current)
    setIsSheetVisible(false)
    setExpanded(true)
  }

  function closeSheet() {
    setIsSheetVisible(false)
    closeSheetTimeoutRef.current = setTimeout(() => setExpanded(false), MODAL_ANIMATION_MS)
  }

  function openAdd() {
    if (closeAddTimeoutRef.current) clearTimeout(closeAddTimeoutRef.current)
    setForm(emptyForm)
    setIsAddVisible(false)
    setAddOpen(true)
  }

  function closeAdd() {
    setIsAddVisible(false)
    closeAddTimeoutRef.current = setTimeout(() => {
      setAddOpen(false)
      setForm(emptyForm)
    }, MODAL_ANIMATION_MS)
  }

  useEffect(() => {
    if (!expanded && !addOpen) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (addOpen) closeAdd()
      else closeSheet()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [expanded, addOpen])

  function handleAdd(event: React.FormEvent) {
    event.preventDefault()
    const next: InterviewRow = {
      id: `local-${Date.now()}`,
      company: form.company.trim(),
      role: form.role.trim(),
      round: form.round.trim(),
      outcome: form.outcome,
      asked: form.asked.trim(),
      brother: form.brother.trim() || 'You',
      daysAgo: 0,
    }
    setPeople((current) => [next, ...current])
    closeAdd()
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-inter">Interview Database</h2>
          <p className="mt-1 text-sm text-gray-600">Find recently submitted interviews below.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={ghostBtnClass} onClick={openAdd}>
            Add interview
          </button>
          <button type="button" className={btnClass} onClick={openSheet}>
            View all interviews
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {recent.map((entry) => (
          <div key={entry.id} className={`${innerCardClass} flex items-center justify-between gap-3`} style={innerCardStyle}>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800">
                {entry.company}
                <span className="font-normal text-gray-500"> · {entry.role}</span>
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                {entry.round} · {entry.outcome}
              </p>
              <p className="mt-1 text-sm text-gray-600">{entry.asked}</p>
            </div>
            <p className="shrink-0 text-xs text-gray-500">{submittedLabel(entry.daysAgo)}</p>
          </div>
        ))}
      </div>

      {expanded &&
        typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 99999 }}>
            <div
              className={`absolute inset-0 bg-black/15 backdrop-blur-md transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isSheetVisible ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={closeSheet}
            />
            <div
              className={`relative z-10 flex h-full w-full max-w-[1400px] flex-col rounded-xl border border-gray-100 bg-white/95 p-6 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isSheetVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-95 opacity-0'
              }`}
              style={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)' }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold font-inter">All interviews</h2>
                  <p className="mt-1 text-sm text-gray-600">Where people interviewed and what they were asked.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <SearchIcon />
                    </span>
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search interviews"
                      className={searchInputClass}
                      aria-label="Search interviews"
                    />
                  </div>
                  <button type="button" className={ghostBtnClass} onClick={openAdd}>
                    Add interview
                  </button>
                  <button
                    type="button"
                    className={iconBtnClass}
                    onClick={closeSheet}
                    title="Exit full screen"
                    aria-label="Exit full screen"
                  >
                    <CollapseIcon />
                  </button>
                </div>
              </div>
              <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
                <Spreadsheet rows={rows} />
              </div>
            </div>
          </div>,
          document.body
        )}

      {addOpen &&
        typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 100000 }}>
            <div
              className={`absolute inset-0 bg-black/15 backdrop-blur-md transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isAddVisible ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={closeAdd}
            />
            <div
              className={`relative z-10 mx-4 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-gray-100 bg-white/95 p-6 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isAddVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-95 opacity-0'
              }`}
              style={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)' }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold font-inter">Add Interview</h3>
                <button
                  type="button"
                  onClick={closeAdd}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                  title="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4" autoComplete="off">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="interview-company" className={labelClass}>
                      Company <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="interview-company"
                      className={inputClass}
                      value={form.company}
                      onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
                      placeholder="Stripe"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="interview-role" className={labelClass}>
                      Role <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="interview-role"
                      className={inputClass}
                      value={form.role}
                      onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                      placeholder="Software Engineer intern"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="interview-round" className={labelClass}>
                      Round <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="interview-round"
                      className={inputClass}
                      value={form.round}
                      onChange={(event) => setForm((current) => ({ ...current, round: event.target.value }))}
                      placeholder="Phone screen"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="interview-outcome" className={labelClass}>
                      Outcome
                    </label>
                    <select
                      id="interview-outcome"
                      className={inputClass}
                      value={form.outcome}
                      onChange={(event) => setForm((current) => ({ ...current, outcome: event.target.value }))}
                    >
                      <option>Moved to onsite</option>
                      <option>Offer</option>
                      <option>Rejected</option>
                      <option>Waiting</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="interview-asked" className={labelClass}>
                    What they asked <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="interview-asked"
                    className={`${inputClass} min-h-24 resize-y`}
                    value={form.asked}
                    onChange={(event) => setForm((current) => ({ ...current, asked: event.target.value }))}
                    placeholder="Two-sum variant, then a system design question…"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="interview-brother" className={labelClass}>
                    Brother
                  </label>
                  <input
                    id="interview-brother"
                    className={inputClass}
                    value={form.brother}
                    onChange={(event) => setForm((current) => ({ ...current, brother: event.target.value }))}
                    placeholder="You"
                  />
                </div>

                <p className="text-xs text-gray-500">Dummy for now — this stays in the page until you refresh.</p>

                <div className="flex justify-end space-x-3 pt-2">
                  <button type="button" className={ghostBtnClass} onClick={closeAdd}>
                    Cancel
                  </button>
                  <button type="submit" className={btnClass}>
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
