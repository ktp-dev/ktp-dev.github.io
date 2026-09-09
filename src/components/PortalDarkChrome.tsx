'use client'

import { useEffect } from 'react'

/** Paints html/body navy so overscroll matches dark portal pages. */
export function PortalDarkChrome() {
  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    const prevRoot = root.style.backgroundColor
    const prevBody = body.style.backgroundColor
    root.style.backgroundColor = '#0f172a'
    body.style.backgroundColor = '#0f172a'
    return () => {
      root.style.backgroundColor = prevRoot
      body.style.backgroundColor = prevBody
    }
  }, [])

  return null
}
