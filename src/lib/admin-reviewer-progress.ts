import 'server-only'

import { sql } from 'drizzle-orm'
import { db } from '@/db'
import { listReviewAccessForCycle } from '@/lib/review-access-admin'

export type AdminReviewerProgress = {
  email: string
  name: string | null
  userId: string | null
  minRequiredReviews: number
  completedCount: number
  remainingToMinimum: number
  avgDurationMs: number | null
  hasSignedIn: boolean
}

export async function listReviewerProgressForAdmin(
  cycleId: string
): Promise<AdminReviewerProgress[]> {
  const accessEntries = await listReviewAccessForCycle(cycleId)
  if (accessEntries.length === 0) return []

  const result = await db.execute<{
    email: string
    user_id: string | null
    first_name: string | null
    last_name: string | null
    completed_count: number
    avg_duration_ms: number | null
  }>(sql`
    SELECT
      ra.email,
      u.id AS user_id,
      b.first_name,
      b.last_name,
      COALESCE(stats.completed_count, 0)::int AS completed_count,
      stats.avg_duration_ms
    FROM review_access AS ra
    LEFT JOIN auth.users AS u ON lower(u.email) = lower(ra.email)
    LEFT JOIN brothers AS b ON lower(b.umich_email) = lower(ra.email)
    LEFT JOIN LATERAL (
      SELECT
        COUNT(*)::int AS completed_count,
        AVG(
          CASE
            WHEN r.started_at IS NOT NULL
              AND r.ended_at IS NOT NULL
              AND r.ended_at >= r.started_at
            THEN EXTRACT(EPOCH FROM (r.ended_at - r.started_at)) * 1000
            ELSE NULL
          END
        ) AS avg_duration_ms
      FROM reviews AS r
      INNER JOIN applications AS a ON a.id = r.application_id
      WHERE r.reviewer_user_id = u.id
        AND a.cycle_id = ${cycleId}
    ) AS stats ON true
    WHERE ra.cycle_id = ${cycleId}
    ORDER BY ra.email ASC
  `)

  const rows = Array.from(result as Iterable<{
    email: string
    user_id: string | null
    first_name: string | null
    last_name: string | null
    completed_count: number
    avg_duration_ms: number | null
  }>)

  const byEmail = new Map(
    rows.map((row) => [row.email.trim().toLowerCase(), row] as const)
  )

  return accessEntries.map((entry) => {
    const row = byEmail.get(entry.email.trim().toLowerCase())
    const completedCount = row?.completed_count ?? 0
    const nameParts = [row?.first_name?.trim(), row?.last_name?.trim()].filter(Boolean)
    const name = nameParts.length > 0 ? nameParts.join(' ') : null

    return {
      email: entry.email,
      name,
      userId: row?.user_id ?? null,
      minRequiredReviews: entry.minRequiredReviews,
      completedCount,
      remainingToMinimum: Math.max(0, entry.minRequiredReviews - completedCount),
      avgDurationMs:
        row?.avg_duration_ms != null && Number.isFinite(Number(row.avg_duration_ms))
          ? Number(row.avg_duration_ms)
          : null,
      hasSignedIn: row?.user_id != null,
    }
  })
}
