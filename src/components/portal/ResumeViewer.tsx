'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { readsMutedClass } from '@/components/portal/reads-ui'

const MODAL_ANIMATION_MS = 280

const iconBtnClass =
  'tap-press tap-press-dark flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-white/10 hover:text-sky-200'

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

function ResumeFrame({ src, tall }: { src: string; tall?: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white ${
        tall ? 'h-full min-h-0' : 'h-[70vh]'
      }`}
      style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}
    >
      <iframe title="Résumé preview" src={src} className="h-full w-full" />
    </div>
  )
}

export function ResumeViewer({
  iframeSrc,
  heading,
}: {
  iframeSrc: string
  heading: string
}) {
  const [expanded, setExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!expanded) return
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true))
    })
    return () => cancelAnimationFrame(frame)
  }, [expanded])

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
    }
  }, [])

  function openExpanded() {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    setIsVisible(false)
    setExpanded(true)
  }

  function closeExpanded() {
    setIsVisible(false)
    closeTimeoutRef.current = setTimeout(() => setExpanded(false), MODAL_ANIMATION_MS)
  }

  return (
    <>
      <h3 className={`text-sm font-bold uppercase tracking-wide ${readsMutedClass}`}>{heading}</h3>
      <div className="relative mt-3">
        <ResumeFrame src={iframeSrc} />
        <button
          type="button"
          className={`absolute top-2 right-2 z-10 shadow-sm ${iconBtnClass}`}
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}
          onClick={openExpanded}
          title="Expand résumé"
          aria-label="Expand résumé"
        >
          <ExpandIcon />
        </button>
      </div>

      {expanded &&
        typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 99999 }}>
            <div
              className={`absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={closeExpanded}
            />
            <div
              className={`relative z-10 flex h-full w-full max-w-[1400px] flex-col rounded-xl border p-6 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-95 opacity-0'
              }`}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.96)',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className={`text-sm font-bold uppercase tracking-wide ${readsMutedClass}`}>
                  {heading}
                </h3>
                <button
                  type="button"
                  className={iconBtnClass}
                  onClick={closeExpanded}
                  title="Exit full screen"
                  aria-label="Exit full screen"
                >
                  <CollapseIcon />
                </button>
              </div>
              <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
                <ResumeFrame src={iframeSrc} tall />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
