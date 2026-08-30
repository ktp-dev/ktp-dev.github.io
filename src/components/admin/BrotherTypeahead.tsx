'use client'

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { searchBrothersAction } from '@/app/admin/actions'
import type { BrotherSearchHit } from '@/lib/brother-schema'

const DEBOUNCE_MS = 250
const MIN_CHARS = 2

export function BrotherTypeahead({
  id,
  value,
  onChange,
  className,
  style,
  placeholder = 'uniqname',
  required,
  disabled,
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  className?: string
  style?: CSSProperties
  placeholder?: string
  required?: boolean
  disabled?: boolean
}) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState<BrotherSearchHit[]>([])
  const [loading, setLoading] = useState(false)
  const requestId = useRef(0)

  useEffect(() => {
    const query = value.trim()
    if (query.length < MIN_CHARS) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    const timer = window.setTimeout(() => {
      const id = ++requestId.current
      void searchBrothersAction(query).then((result) => {
        if (id !== requestId.current) return
        setLoading(false)
        if (result.error || !result.data) {
          setResults([])
          return
        }
        setResults(result.data)
      })
    }, DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [value])

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  function pick(hit: BrotherSearchHit) {
    onChange(hit.uniqname)
    setOpen(false)
    setResults([])
    setLoading(false)
    requestId.current += 1
  }

  const showList = open && value.trim().length >= MIN_CHARS && (loading || results.length > 0)

  return (
    <div ref={rootRef} className="relative w-full min-w-0">
      <input
        id={id}
        type="text"
        autoComplete="off"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        className={className}
        style={style}
        placeholder={placeholder}
        value={value}
        required={required}
        disabled={disabled}
        onChange={(event) => {
          onChange(event.target.value)
          setOpen(true)
        }}
        onFocus={() => {
          if (results.length > 0) setOpen(true)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false)
        }}
      />
      {showList ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 z-20 mt-1 max-h-56 overflow-y-auto rounded-md border border-white/10 bg-[#0f172a] py-1 shadow-lg shadow-black/40"
        >
          {loading && results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-slate-400">Searching…</li>
          ) : (
            results.map((hit) => {
              const name = [hit.first_name, hit.last_name].filter(Boolean).join(' ').trim()
              return (
                <li key={hit.id} role="option">
                  <button
                    type="button"
                    className="flex w-full cursor-pointer flex-col items-start px-3 py-2 text-left hover:bg-white/10"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => pick(hit)}
                  >
                    <span className="truncate text-sm font-medium text-slate-200">
                      {name || hit.uniqname}
                    </span>
                    <span className="truncate text-xs text-slate-400">
                      {hit.uniqname}
                      {hit.pledge_class ? ` · ${hit.pledge_class}` : ''}
                    </span>
                  </button>
                </li>
              )
            })
          )}
        </ul>
      ) : null}
    </div>
  )
}
