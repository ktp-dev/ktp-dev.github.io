'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type AlumniRow = {
  name: string
  pledgeClass: string
  emails: string[]
  grad: string
  major: string
  company: string
  location: string
  phone: string
  linkedin: string
}

const COLUMNS: { key: keyof AlumniRow; label: string; width: string }[] = [
  { key: 'name', label: 'Name', width: '12rem' },
  { key: 'pledgeClass', label: 'Pledge class', width: '8rem' },
  { key: 'emails', label: 'Email', width: '16rem' },
  { key: 'grad', label: 'Grad', width: '5rem' },
  { key: 'major', label: 'Major', width: '14rem' },
  { key: 'company', label: 'Company & role', width: '18rem' },
  { key: 'location', label: 'Location', width: '11rem' },
  { key: 'phone', label: 'Phone', width: '9rem' },
  { key: 'linkedin', label: 'LinkedIn', width: '16rem' },
]

const DUMMY_ALUMNI: AlumniRow[] = [
  {
    name: 'Brian Mansfield',
    pledgeClass: 'Founder',
    emails: ['brian.lee.mansfield@gmail.com'],
    grad: 'W13',
    major: 'Computational Informatics',
    company: 'Senior Architect at Salesforce',
    location: 'Chicago, IL',
    phone: '517-648-7639',
    linkedin: 'linkedin.com/in/brianmansfield',
  },
  {
    name: 'Denny Tsai',
    pledgeClass: 'Founder',
    emails: ['dennytsai09@gmail.com'],
    grad: 'W13',
    major: 'Computational Informatics',
    company: 'Software Engineer at Uber',
    location: 'San Francisco, CA',
    phone: '',
    linkedin: 'linkedin.com/in/dennytsai',
  },
  {
    name: 'Jacqueline Fontaine',
    pledgeClass: 'Founder',
    emails: ['jacfonta@umich.edu', 'jfonta1991@gmail.com'],
    grad: 'W13',
    major: 'Life Science Informatics',
    company: 'Senior Product Manager at Valant',
    location: 'Seattle, WA',
    phone: '',
    linkedin: 'linkedin.com/in/jacquelinefontaine',
  },
  {
    name: 'Jing Guo',
    pledgeClass: 'Founder',
    emails: ['jingguo@umich.edu'],
    grad: 'W13',
    major: 'Computer Science',
    company: 'Software Engineer at Google',
    location: 'Sunnyvale, CA',
    phone: '',
    linkedin: 'linkedin.com/in/jingguo',
  },
  {
    name: 'Julie Varghese',
    pledgeClass: 'Founder',
    emails: ['juliev@umich.edu'],
    grad: 'W13',
    major: 'Informatics',
    company: 'Product Manager at Microsoft',
    location: 'Seattle, WA',
    phone: '',
    linkedin: 'linkedin.com/in/julievarghese',
  },
  {
    name: 'Andy Kolean',
    pledgeClass: 'Alpha',
    emails: ['akolean@umich.edu'],
    grad: 'W14',
    major: 'Computer Science',
    company: 'Engineering Manager at Stripe',
    location: 'New York, NY',
    phone: '',
    linkedin: 'linkedin.com/in/andykolean',
  },
  {
    name: 'Chris Hong',
    pledgeClass: 'Alpha',
    emails: ['chrishong@umich.edu'],
    grad: 'W14',
    major: 'Computer Science',
    company: 'Software Engineer at Meta',
    location: 'Menlo Park, CA',
    phone: '',
    linkedin: 'linkedin.com/in/chrishong',
  },
  {
    name: 'Patrick Riggs',
    pledgeClass: 'Alpha',
    emails: ['priggs@umich.edu'],
    grad: 'W14',
    major: 'Computer Science',
    company: 'Consultant at McKinsey',
    location: 'Chicago, IL',
    phone: '',
    linkedin: 'linkedin.com/in/patrickriggs',
  },
  {
    name: 'Jay Raina',
    pledgeClass: 'Beta',
    emails: ['jraina@umich.edu'],
    grad: 'W15',
    major: 'Computer Science',
    company: 'Product at Capital One',
    location: 'Washington, DC',
    phone: '',
    linkedin: 'linkedin.com/in/jayraina',
  },
  {
    name: 'Juliana Mi',
    pledgeClass: 'Beta',
    emails: ['jmi@umich.edu'],
    grad: 'W15',
    major: 'Informatics',
    company: 'Designer at Apple',
    location: 'Cupertino, CA',
    phone: '',
    linkedin: 'linkedin.com/in/julianami',
  },
  {
    name: 'Connor Waldo',
    pledgeClass: 'Gamma',
    emails: ['cwaldo@umich.edu'],
    grad: 'W16',
    major: 'Computer Science',
    company: 'Software Engineer at Amazon',
    location: 'Seattle, WA',
    phone: '',
    linkedin: 'linkedin.com/in/connorwaldo',
  },
  {
    name: 'Sonia Doshi',
    pledgeClass: 'Delta',
    emails: ['sdoshi@umich.edu'],
    grad: 'W16',
    major: 'Computer Science',
    company: 'Product Manager at Google',
    location: 'New York, NY',
    phone: '',
    linkedin: 'linkedin.com/in/soniadoshi',
  },
  {
    name: 'Isha Gupta',
    pledgeClass: 'Epsilon',
    emails: ['ishag@umich.edu'],
    grad: 'W17',
    major: 'Computer Science',
    company: 'Software Engineer at Bloomberg',
    location: 'New York, NY',
    phone: '',
    linkedin: 'linkedin.com/in/ishagupta',
  },
  {
    name: 'Connie Liu',
    pledgeClass: 'Zeta',
    emails: ['cliu@umich.edu'],
    grad: 'W17',
    major: 'Computer Science',
    company: 'Software Engineer at Figma',
    location: 'San Francisco, CA',
    phone: '',
    linkedin: 'linkedin.com/in/connieliu',
  },
  {
    name: 'Pascal Sturmfels',
    pledgeClass: 'Eta',
    emails: ['psturm@umich.edu'],
    grad: 'W18',
    major: 'Computer Science',
    company: 'Research Scientist at DeepMind',
    location: 'London, UK',
    phone: '',
    linkedin: 'linkedin.com/in/pascalsturmfels',
  },
]

const iconBtnClass =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-blue-50 hover:text-[#315CA9] cursor-pointer'
const searchInputClass =
  'h-9 w-44 sm:w-56 rounded-lg border border-gray-300 bg-white/80 py-0 pl-9 pr-3 text-sm text-gray-700 outline-none transition-[border-color,box-shadow] duration-200 ease-out focus:border-[#315CA9] focus:shadow-[0_0_0_3px_rgba(49,92,169,0.18)]'
const MODAL_ANIMATION_MS = 280

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
    </svg>
  )
}

function ExpandIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 3H5a2 2 0 00-2 2v3m13-5h3a2 2 0 012 2v3M8 21H5a2 2 0 01-2-2v-3m13 5h3a2 2 0 002-2v-3" />
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

function matchesQuery(row: AlumniRow, query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return COLUMNS.some((column) => {
    const value = row[column.key]
    if (Array.isArray(value)) {
      return value.some((item) => item.toLowerCase().includes(needle))
    }
    return value.toLowerCase().includes(needle)
  })
}

function CopyableValue({ value, onCopy }: { value: string; onCopy: (value: string) => void }) {
  return (
    <button
      type="button"
      className="block max-w-full cursor-pointer truncate text-left text-[#315CA9] transition-colors hover:underline"
      title="Click to copy"
      onClick={() => onCopy(value)}
    >
      {value}
    </button>
  )
}

function Spreadsheet({
  rows,
  tall,
  onCopy,
}: {
  rows: AlumniRow[]
  tall?: boolean
  onCopy: (value: string) => void
}) {
  return (
    <div
      className={`min-w-0 max-w-full overflow-auto overscroll-none rounded-xl border border-gray-100 bg-white/80 ${tall ? 'h-full' : 'max-h-80'}`}
      style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)', overscrollBehavior: 'none' }}
    >
      <table className="w-[109rem] table-fixed border-separate border-spacing-0 text-left text-sm">
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
                No alumni match that search.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={`${row.name}-${row.emails[0] ?? ''}`} className="group">
                {COLUMNS.map((column, index) => {
                  const value = row[column.key]
                  const isCopyable = column.key === 'linkedin' || column.key === 'emails'
                  return (
                    <td
                      key={column.key}
                      className={`align-top border-b border-gray-50 px-4 py-2.5 text-gray-700 group-hover:bg-[#eef4fb] ${
                        isCopyable ? 'overflow-hidden whitespace-nowrap' : 'whitespace-normal break-words'
                      } ${
                        index === 0
                          ? 'sticky left-0 z-20 bg-white font-medium text-gray-800'
                          : 'relative z-0'
                      }`}
                    >
                      {column.key === 'emails' ? (
                        row.emails.length > 0 ? (
                          <div className="flex min-w-0 flex-col gap-1">
                            {row.emails.map((email) => (
                              <CopyableValue key={email} value={email} onCopy={onCopy} />
                            ))}
                          </div>
                        ) : (
                          '—'
                        )
                      ) : column.key === 'linkedin' && value ? (
                        <CopyableValue value={String(value)} onCopy={onCopy} />
                      ) : (
                        (typeof value === 'string' && value) || '—'
                      )}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function Toolbar({
  query,
  expanded,
  onQueryChange,
  onToggleExpand,
}: {
  query: string
  expanded: boolean
  onQueryChange: (value: string) => void
  onToggleExpand: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search alumni"
          className={searchInputClass}
          aria-label="Search alumni"
        />
      </div>
      <button
        type="button"
        className={iconBtnClass}
        onClick={onToggleExpand}
        title={expanded ? 'Exit full screen' : 'Expand'}
        aria-label={expanded ? 'Exit full screen' : 'Expand directory'}
      >
        {expanded ? <CollapseIcon /> : <ExpandIcon />}
      </button>
    </div>
  )
}

export function AlumniDirectoryTable({ showTitle = true }: { showTitle?: boolean }) {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copyVisible, setCopyVisible] = useState(false)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const copyHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const rows = useMemo(() => DUMMY_ALUMNI.filter((row) => matchesQuery(row, query)), [query])

  useEffect(() => {
    if (!expanded) return
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true))
    })
    return () => cancelAnimationFrame(frame)
  }, [expanded])

  function openExpanded() {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    setIsVisible(false)
    setExpanded(true)
  }

  function closeExpanded() {
    setIsVisible(false)
    closeTimeoutRef.current = setTimeout(() => setExpanded(false), MODAL_ANIMATION_MS)
  }

  useEffect(() => {
    if (!expanded) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeExpanded()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [expanded])

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      if (copyHideTimeoutRef.current) clearTimeout(copyHideTimeoutRef.current)
    }
  }, [])

  async function copyValue(value: string) {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      return
    }
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    if (copyHideTimeoutRef.current) clearTimeout(copyHideTimeoutRef.current)
    setCopied(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setCopyVisible(true))
    })
    copyTimeoutRef.current = setTimeout(() => {
      setCopyVisible(false)
      copyHideTimeoutRef.current = setTimeout(() => setCopied(false), 280)
    }, 1600)
  }

  const title = (
    <div>
      <h2 className="text-xl font-bold font-inter">Alumni Directory</h2>
      <p className="mt-1 text-sm text-gray-600">Find brothers by class, company, and city.</p>
    </div>
  )

  const toolbar = (
    <Toolbar
      query={query}
      expanded={expanded}
      onQueryChange={setQuery}
      onToggleExpand={expanded ? closeExpanded : openExpanded}
    />
  )

  return (
    <>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        {showTitle ? title : <span />}
        {expanded ? null : toolbar}
      </div>
      <Spreadsheet rows={rows} onCopy={copyValue} />

      {expanded &&
        typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 99999 }}>
            <div
              className={`absolute inset-0 bg-black/15 backdrop-blur-md transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={closeExpanded}
            />
            <div
              className={`relative z-10 flex h-full w-full max-w-[1400px] flex-col rounded-xl border border-gray-100 bg-white/95 p-6 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-95 opacity-0'
              }`}
              style={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)' }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                {title}
                {toolbar}
              </div>
              <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
                <Spreadsheet rows={rows} tall onCopy={copyValue} />
              </div>
            </div>
          </div>,
          document.body
        )}

      {copied &&
        typeof window !== 'undefined' &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-0 top-24 z-[100001] flex justify-center px-4">
            <div
              role="status"
              className={`rounded-2xl border border-gray-100 bg-white/95 px-4 py-3 text-sm font-semibold text-gray-800 backdrop-blur transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                copyVisible ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-4 scale-95 opacity-0'
              }`}
              style={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)' }}
            >
              Copied
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
