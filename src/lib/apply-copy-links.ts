/** Known KTP phrases in CMS welcome/closed copy → clickable links. */

const LINK_PATTERN =
  /\bktp-board@umich\.edu\b|\b(?:https?:\/\/)?(?:www\.)?ktpmichigan\.com(?:\/[^\s]*)?|@ktpumich\b/gi

export type ApplyCopyPart =
  | { type: 'text'; value: string }
  | { type: 'link'; value: string; href: string }

function hrefForMatch(raw: string): string | null {
  const value = raw.trim()
  const lower = value.toLowerCase()

  if (lower === 'ktp-board@umich.edu') {
    return 'mailto:ktp-board@umich.edu'
  }

  if (lower === '@ktpumich') {
    return 'https://www.instagram.com/ktpumich'
  }

  if (lower.includes('ktpmichigan.com')) {
    if (/^https?:\/\//i.test(value)) return value
    return `https://${value.replace(/^\/+/, '')}`
  }

  return null
}

export function splitApplyCopyLinks(text: string): ApplyCopyPart[] {
  if (!text) return []

  const parts: ApplyCopyPart[] = []
  let lastIndex = 0

  for (const match of text.matchAll(LINK_PATTERN)) {
    const value = match[0]
    const index = match.index ?? 0
    const href = hrefForMatch(value)
    if (!href) continue

    if (index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, index) })
    }
    parts.push({ type: 'link', value, href })
    lastIndex = index + value.length
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) })
  }

  return parts
}
