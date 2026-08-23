import 'server-only'

import { and, asc, eq, sql } from 'drizzle-orm'
import { db } from '@/db'
import { brothers, reviewAccess } from '@/db/schema'
import { MIN_REQUIRED_REVIEWS } from '@/lib/reviews'
import { normalizeReviewEmail } from '@/lib/review-access'

export type ClientReviewAccess = {
  id: string
  email: string
  minRequiredReviews: number
  createdAt: string
  firstName: string | null
  lastName: string | null
}

function toClient(
  row: typeof reviewAccess.$inferSelect,
  brother?: { firstName: string | null; lastName: string | null } | null
): ClientReviewAccess {
  return {
    id: row.id,
    email: row.email,
    minRequiredReviews: row.minRequiredReviews,
    createdAt: row.createdAt,
    firstName: brother?.firstName ?? null,
    lastName: brother?.lastName ?? null,
  }
}

export async function listReviewAccessForCycle(cycleId: string) {
  const rows = await db
    .select({
      entry: reviewAccess,
      firstName: brothers.firstName,
      lastName: brothers.lastName,
    })
    .from(reviewAccess)
    .leftJoin(brothers, eq(brothers.umichEmail, reviewAccess.email))
    .where(eq(reviewAccess.cycleId, cycleId))
    .orderBy(
      sql`lower(coalesce(${brothers.firstName}, ''))`,
      sql`lower(coalesce(${brothers.lastName}, ''))`,
      asc(reviewAccess.email)
    )

  return rows.map((row) =>
    toClient(row.entry, { firstName: row.firstName, lastName: row.lastName })
  )
}

export async function addReviewAccessEntry(input: {
  cycleId: string
  email: string
  minRequiredReviews?: number
}) {
  const email = normalizeReviewEmail(input.email)
  if (!email.endsWith('@umich.edu')) {
    return { entry: null, error: 'Reviewers must use a @umich.edu email.' as const }
  }

  const minRequiredReviews = input.minRequiredReviews ?? MIN_REQUIRED_REVIEWS
  if (!Number.isInteger(minRequiredReviews) || minRequiredReviews < 1) {
    return { entry: null, error: 'Minimum reads must be at least 1.' as const }
  }

  const [brother] = await db
    .select({
      firstName: brothers.firstName,
      lastName: brothers.lastName,
    })
    .from(brothers)
    .where(eq(brothers.umichEmail, email))
    .limit(1)

  if (!brother) {
    return { entry: null, error: 'No brother found with that UMich email.' as const }
  }

  try {
    const [row] = await db
      .insert(reviewAccess)
      .values({
        cycleId: input.cycleId,
        email,
        minRequiredReviews,
      })
      .returning()
    return { entry: toClient(row, brother), error: null }
  } catch {
    return { entry: null, error: 'That reviewer is already on the list for this cycle.' as const }
  }
}

export async function removeReviewAccessEntry(id: string, cycleId: string) {
  const result = await db
    .delete(reviewAccess)
    .where(and(eq(reviewAccess.id, id), eq(reviewAccess.cycleId, cycleId)))
    .returning({ id: reviewAccess.id })

  if (result.length === 0) {
    return { error: 'Reviewer access entry not found.' as const }
  }
  return { error: null }
}

export async function updateReviewAccessMinimum(input: {
  id: string
  cycleId: string
  minRequiredReviews: number
}) {
  if (!Number.isInteger(input.minRequiredReviews) || input.minRequiredReviews < 1) {
    return { entry: null, error: 'Minimum reads must be at least 1.' as const }
  }

  const [row] = await db
    .update(reviewAccess)
    .set({ minRequiredReviews: input.minRequiredReviews })
    .where(and(eq(reviewAccess.id, input.id), eq(reviewAccess.cycleId, input.cycleId)))
    .returning()

  if (!row) return { entry: null, error: 'Reviewer access entry not found.' as const }

  const [brother] = await db
    .select({
      firstName: brothers.firstName,
      lastName: brothers.lastName,
    })
    .from(brothers)
    .where(eq(brothers.umichEmail, row.email))
    .limit(1)

  return { entry: toClient(row, brother ?? null), error: null }
}
