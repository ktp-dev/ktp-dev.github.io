/** Michigan chapter rush deadlines are always expressed in Eastern Time. */
export const RUSH_TIMEZONE = 'America/Detroit'

const rushDateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: RUSH_TIMEZONE,
  hour: 'numeric',
  minute: '2-digit',
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const rushDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: RUSH_TIMEZONE,
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const rushDatetimeLocalFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: RUSH_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

function parseIso(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date
}

function partValue(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) {
  return parts.find((part) => part.type === type)?.value ?? ''
}

function wallClockInRushTz(ms: number) {
  const parts = rushDatetimeLocalFormatter.formatToParts(new Date(ms))
  let hour = partValue(parts, 'hour')
  if (hour === '24') hour = '00'
  return {
    year: Number(partValue(parts, 'year')),
    month: Number(partValue(parts, 'month')),
    day: Number(partValue(parts, 'day')),
    hour: Number(hour),
    minute: Number(partValue(parts, 'minute')),
  }
}

/** e.g. Wednesday, January 15, 2026 at 11:59 PM ET */
export function formatRushDateTime(iso: string) {
  const date = parseIso(iso)
  if (!date) return null
  return `${rushDateTimeFormatter.format(date)} ET`
}

/** e.g. Wednesday, January 15, 2026 */
export function formatRushDate(iso: string) {
  const date = parseIso(iso)
  if (!date) return null
  return rushDateFormatter.format(date)
}

export function formatApplyDeadline(iso: string) {
  return formatRushDateTime(iso)
}

/** datetime-local value interpreted as Eastern Time (for admin). */
export function toDatetimeLocalInRushTz(iso: string) {
  const date = parseIso(iso)
  if (!date) return ''
  const parts = rushDatetimeLocalFormatter.formatToParts(date)
  let hour = partValue(parts, 'hour')
  if (hour === '24') hour = '00'
  return `${partValue(parts, 'year')}-${partValue(parts, 'month')}-${partValue(parts, 'day')}T${hour}:${partValue(parts, 'minute')}`
}

/** Parse datetime-local as Eastern Time and store UTC. */
export function fromDatetimeLocalInRushTz(local: string) {
  const trimmed = local.trim()
  if (!trimmed) return ''

  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(trimmed)
  if (!match) return new Date(trimmed).toISOString()

  const target = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
  }

  let ms = Date.UTC(target.year, target.month - 1, target.day, target.hour, target.minute + 5)

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const current = wallClockInRushTz(ms)
    if (
      current.year === target.year &&
      current.month === target.month &&
      current.day === target.day &&
      current.hour === target.hour &&
      current.minute === target.minute
    ) {
      return new Date(ms).toISOString()
    }

    const currentMs = Date.UTC(
      current.year,
      current.month - 1,
      current.day,
      current.hour,
      current.minute
    )
    const targetMs = Date.UTC(
      target.year,
      target.month - 1,
      target.day,
      target.hour,
      target.minute
    )
    ms += targetMs - currentMs
  }

  return new Date(ms).toISOString()
}

export const RUSH_TIMEZONE_LABEL = 'All times are ET (Eastern Time)'
