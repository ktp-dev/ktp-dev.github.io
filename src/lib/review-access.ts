import 'server-only'

import { and, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { reviewAccess } from '@/db/schema'
import { getActiveCycle } from '@/lib/applications'
import { requirePortalUser } from '@/lib/portal'
import { checkIsAdmin, getCurrentUser } from '@/lib/supabase/auth-helpers'

export function normalizeReviewEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function getReviewAccessEntry(email: string, cycleId: string) {
  const normalized = normalizeReviewEmail(email)
  const [row] = await db
    .select()
    .from(reviewAccess)
    .where(and(eq(reviewAccess.cycleId, cycleId), eq(reviewAccess.email, normalized)))
    .limit(1)
  return row ?? null
}

/** Reviewer on allowlist for cycle, or site admin. */
export async function canReviewApplications(input?: {
  email?: string
  cycleId?: string
}) {
  const adminUser = await checkIsAdmin()
  if (adminUser) return true

  const email = input?.email ?? (await getCurrentUser())?.email
  if (!email) return false

  const cycleId = input?.cycleId ?? (await getActiveCycle())?.id
  if (!cycleId) return false

  const entry = await getReviewAccessEntry(email, cycleId)
  return Boolean(entry)
}

export async function requireReviewer() {
  const { email } = await requirePortalUser()

  const cycle = await getActiveCycle()
  if (!cycle) {
    redirect('/portal')
  }

  const allowed = await canReviewApplications({
    email,
    cycleId: cycle.id,
  })
  if (!allowed) {
    redirect('/portal')
  }

  return { email, cycle }
}
