/** Client-safe types and helpers for the admin applications table. */

export type AdminApplicationListItem = {
  id: string
  displayNumber: number | null
  name: string
  email: string
  majors: string | null
  graduationYear: number | null
  submittedAt: string | null
  readCount: number
  avgScore: number | null
  normalizedAvgScore: number | null
  categoryAverages: Record<string, number> | null
  hasResume: boolean
  hasResumeAnonymized: boolean
}

export type AdminApplicationSortKey =
  | 'display'
  | 'alpha'
  | 'score_desc'
  | 'normalized_score_desc'
  | 'reads_desc'

export function filterAdminApplications(
  applications: AdminApplicationListItem[],
  query: string
) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return applications

  return applications.filter((app) => {
    const haystack = [
      app.name,
      app.email,
      app.majors ?? '',
      app.displayNumber != null ? String(app.displayNumber) : '',
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(normalized)
  })
}

export function sortAdminApplications(
  applications: AdminApplicationListItem[],
  sort: AdminApplicationSortKey
) {
  const sorted = [...applications]
  sorted.sort((a, b) => {
    if (sort === 'score_desc') {
      return (b.avgScore ?? -1) - (a.avgScore ?? -1) || a.name.localeCompare(b.name)
    }
    if (sort === 'normalized_score_desc') {
      return (
        (b.normalizedAvgScore ?? -1) - (a.normalizedAvgScore ?? -1) ||
        a.name.localeCompare(b.name)
      )
    }
    if (sort === 'reads_desc') {
      return b.readCount - a.readCount || a.name.localeCompare(b.name)
    }
    if (sort === 'alpha') {
      return a.name.localeCompare(b.name)
    }
    const aNum = a.displayNumber ?? Number.MAX_SAFE_INTEGER
    const bNum = b.displayNumber ?? Number.MAX_SAFE_INTEGER
    return aNum - bNum || a.name.localeCompare(b.name)
  })
  return sorted
}
