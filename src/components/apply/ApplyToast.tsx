'use client'

import { useEffect, useRef, useState } from 'react'
import { useApplyStore } from '@/lib/apply-store'

const TOAST_ANIMATION_MS = 320

export function ApplyToast() {
  const toastErrors = useApplyStore((state) => state.toastErrors)
  const toastTitle = useApplyStore((state) => state.toastTitle)
  const setToastErrors = useApplyStore((state) => state.setToastErrors)
  const [items, setItems] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    if (hideTimer.current) clearTimeout(hideTimer.current)

    if (toastErrors.length) {
      setItems(toastErrors)
      setOpen(false)
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setOpen(true))
      })
      closeTimer.current = setTimeout(() => setToastErrors([]), 7000)
      return () => {
        cancelAnimationFrame(frame)
        if (closeTimer.current) clearTimeout(closeTimer.current)
      }
    }

    setOpen(false)
    hideTimer.current = setTimeout(() => setItems([]), TOAST_ANIMATION_MS)
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [toastErrors, setToastErrors])

  if (!items.length) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-[10000] flex justify-center px-4">
      <div
        role="alert"
        className={`pointer-events-auto w-full max-w-md rounded-2xl border border-gray-100 bg-white/95 px-4 py-3 text-sm text-gray-700 backdrop-blur transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-4 scale-95 opacity-0'
        }`}
        style={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)' }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-gray-800">{toastTitle}</p>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-gray-100 hover:text-gray-700"
            onClick={() => setToastErrors([])}
            aria-label="Dismiss"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
