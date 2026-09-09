'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const PRESS_SELECTOR =
  '.tap-press, .tap-card, .contact-us, .hover-text-custom, .tap-text, .more-about-us a'
const PRESS_CLASSES = ['is-pressed', 'is-pressed-scale'] as const
/** Release press class immediately on lift so the bounce can play */
const LINGER_MS = 0
/** Text links (nav + admin): brief flash for non-nav actions (e.g. Sign out) */
const TEXT_PRESS_LINGER_MS = 35
/** Same-tab CTAs + cards: let bounce start before navigating away */
const BUTTON_NAV_DELAY_MS = 180

function isMobileTapViewport() {
  return window.matchMedia('(max-width: 1023px)').matches
}

function isTextPressTarget(el: Element) {
  return el.classList.contains('hover-text-custom') || el.classList.contains('tap-text')
}

function isCardPressTarget(el: Element) {
  return el.classList.contains('tap-card')
}

function clearPressedInstant(el: Element) {
  const node = el as HTMLElement
  const prev = node.style.transition
  node.style.transition = 'none'
  el.classList.remove(...PRESS_CLASSES)
  void node.offsetWidth
  node.style.transition = prev
}

function hasPressClass(el: Element) {
  return PRESS_CLASSES.some((c) => el.classList.contains(c))
}

function eventTargetElement(target: EventTarget | null) {
  if (target instanceof Element) return target
  if (target instanceof Node) return target.parentElement
  return null
}

/**
 * Same-tab in-app links only.
 * Interest Form is target=_blank + external → left to the browser (that path works on iOS).
 * Application is /apply in the same tab → iOS often cancels the click after a press scale,
 * so we navigate ourselves on a real tap.
 */
function sameTabInAppLink(el: Element): HTMLAnchorElement | null {
  const anchor = el.closest('a[href]')
  if (!(anchor instanceof HTMLAnchorElement)) return null

  const target = (anchor.getAttribute('target') || '').toLowerCase()
  if (target && target !== '_self') return null
  if (anchor.hasAttribute('download')) return null

  const raw = anchor.getAttribute('href')
  if (
    !raw ||
    raw.startsWith('#') ||
    raw.startsWith('mailto:') ||
    raw.startsWith('tel:') ||
    raw.startsWith('javascript:')
  ) {
    return null
  }

  try {
    const url = new URL(anchor.href, window.location.href)
    if (url.origin !== window.location.origin) return null
  } catch {
    return null
  }

  return anchor
}

/**
 * Press feedback on touchstart (mobile viewport only).
 * Selected pills use scale-only — no navy background dip on re-tap.
 */
export default function TapFeedback() {
  const pathname = usePathname()

  useEffect(() => {
    document.querySelectorAll('.is-pressed, .is-pressed-scale').forEach(clearPressedInstant)
  }, [pathname])

  useEffect(() => {
    const timers = new WeakMap<Element, ReturnType<typeof setTimeout>>()
    let active: Element | null = null
    let startX = 0
    let startY = 0

    const scheduleClear = (el: Element) => {
      const existing = timers.get(el)
      if (existing) clearTimeout(existing)

      const timer = setTimeout(() => {
        el.classList.remove(...PRESS_CLASSES)
        timers.delete(el)
      }, LINGER_MS)
      timers.set(el, timer)
    }

    const onStart = (event: TouchEvent) => {
      if (!isMobileTapViewport()) return

      const target = eventTargetElement(event.target)
      if (!target) return
      const el = target.closest(PRESS_SELECTOR)
      if (!el) {
        active = null
        return
      }

      const existing = timers.get(el)
      if (existing) clearTimeout(existing)

      active = el
      const touch = event.changedTouches[0]
      startX = touch?.clientX ?? 0
      startY = touch?.clientY ?? 0

      el.classList.remove(...PRESS_CLASSES)
      // Already-selected blue pills: scale only (navy dip feels broken on re-tap)
      el.classList.add(el.classList.contains('tap-selected') ? 'is-pressed-scale' : 'is-pressed')
    }

    const onEnd = (event: TouchEvent) => {
      const el = active
      active = null
      if (!el || !hasPressClass(el)) return

      const touch = event.changedTouches[0]
      const dx = Math.abs((touch?.clientX ?? 0) - startX)
      const dy = Math.abs((touch?.clientY ?? 0) - startY)
      if (dx > 12 || dy > 12) {
        clearPressedInstant(el)
        return
      }

      const isTextPress = isTextPressTarget(el)
      const isCardPress = isCardPressTarget(el)
      const willNavigate =
        isMobileTapViewport() && Boolean(sameTabInAppLink(el))

      if (isCardPress) {
        // Pill-like: clear on lift so spring-back plays (don't stick through nav)
        scheduleClear(el)
      } else if (isTextPress && willNavigate) {
        // Keep nav/admin text color until the next page loads
      } else if (isTextPress) {
        const existing = timers.get(el)
        if (existing) clearTimeout(existing)
        const timer = setTimeout(() => {
          clearPressedInstant(el)
          timers.delete(el)
        }, TEXT_PRESS_LINGER_MS)
        timers.set(el, timer)
      } else {
        scheduleClear(el)
      }

      if (!isMobileTapViewport()) return

      const anchor = sameTabInAppLink(el)
      if (!anchor) return

      // Stop the cancelled-click path; go ourselves (Interest Form never hits this).
      event.preventDefault()

      if (isTextPress && !isCardPress) {
        // Color already on from touchstart — navigate immediately; stays until unload
        window.location.assign(anchor.href)
        return
      }

      // Pills + cards: brief delay so the spring-back can start before unload
      window.setTimeout(() => {
        window.location.assign(anchor.href)
      }, BUTTON_NAV_DELAY_MS)
    }

    const onCancel = () => {
      if (active) clearPressedInstant(active)
      active = null
    }

    const onPageHide = () => {
      active = null
      document.querySelectorAll('.is-pressed, .is-pressed-scale').forEach(clearPressedInstant)
    }

    document.addEventListener('touchstart', onStart, { passive: true, capture: true })
    document.addEventListener('touchend', onEnd, { passive: false, capture: true })
    document.addEventListener('touchcancel', onCancel, { passive: true, capture: true })
    window.addEventListener('pagehide', onPageHide)

    return () => {
      document.removeEventListener('touchstart', onStart, true)
      document.removeEventListener('touchend', onEnd, true)
      document.removeEventListener('touchcancel', onCancel, true)
      window.removeEventListener('pagehide', onPageHide)
    }
  }, [])

  return null
}
