import Papa from 'papaparse'
import { parseBrotherWrite, type BrotherWrite } from '@/lib/brother-schema'
import { toUmichEmail } from '@/lib/umich-email'

function normalizeHeader(header: string) {
  return header.trim().toLowerCase().replace(/\s+/g, '_')
}

function rowToInput(row: Record<string, string>) {
  const uniqname = (row.uniqname ?? '').trim()
  return {
    first_name: (row.first_name ?? '').trim(),
    last_name: (row.last_name ?? '').trim(),
    umich_email: uniqname ? toUmichEmail(uniqname) : '',
    pledge_class: (row.pledge_class ?? '').trim(),
    linkedin_url: (row.linkedin_url ?? '').trim(),
    photo_filename: (row.photo_filename ?? '').trim(),
  }
}

export type BrotherCsvParseResult =
  | { data: BrotherWrite[]; errors: null }
  | { data: null; errors: string[] }

export function parseBrothersCsv(csvText: string): BrotherCsvParseResult {
  const trimmed = csvText.trim()
  if (!trimmed) {
    return { data: null, errors: ['CSV file is empty'] }
  }

  const parsed = Papa.parse<Record<string, string>>(trimmed, {
    header: true,
    skipEmptyLines: true,
    transformHeader: normalizeHeader,
  })

  if (parsed.errors.length > 0) {
    return { data: null, errors: [parsed.errors[0]?.message ?? 'Could not parse CSV'] }
  }

  const rows = parsed.data
  if (rows.length === 0) {
    return { data: null, errors: ['CSV has no data rows'] }
  }

  const headers = new Set(parsed.meta.fields?.map(normalizeHeader) ?? [])
  const required = ['first_name', 'last_name', 'uniqname', 'pledge_class']
  const missingHeaders = required.filter((header) => !headers.has(header))
  if (missingHeaders.length > 0) {
    return { data: null, errors: [`Missing required columns: ${missingHeaders.join(', ')}`] }
  }

  const errors: string[] = []
  const brothers: BrotherWrite[] = []
  const seenEmails = new Set<string>()

  rows.forEach((row, index) => {
    const line = index + 2
    const input = rowToInput(row)
    if (!input.umich_email) {
      errors.push(`Row ${line}: missing uniqname`)
      return
    }
    if (seenEmails.has(input.umich_email)) {
      errors.push(`Row ${line}: duplicate uniqname ${row.uniqname?.trim() || input.umich_email}`)
      return
    }
    seenEmails.add(input.umich_email)

    const result = parseBrotherWrite(input)
    if (result.error || !result.data) {
      errors.push(`Row ${line}: ${result.error ?? 'Invalid row'}`)
      return
    }
    brothers.push(result.data)
  })

  if (errors.length > 0) {
    return { data: null, errors }
  }

  return { data: brothers, errors: null }
}
