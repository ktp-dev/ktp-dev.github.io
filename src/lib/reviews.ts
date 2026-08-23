import 'server-only'

import { and, asc, eq, isNull, sql } from 'drizzle-orm'
import { db } from '@/db'
import {
  applicationAnswers,
  applicationFiles,
  applications,
  cycleQuestions,
  reviewAccess,
  reviews,
  reviewScores,
  rubricCategories,
  type RubricRatingLabels,
} from '@/db/schema'
import { getActiveCycle } from '@/lib/applications'
import { normalizeReviewEmail } from '@/lib/review-access'
import { resolveRatingLabels } from '@/lib/rubric-ui'
import { checkIsAdmin, getCurrentUser } from '@/lib/supabase/auth-helpers'

export const ASSIGNMENT_DURATION_MS = 60 * 60 * 1000
export const MIN_REQUIRED_REVIEWS = 12
export const NOTES_MAX_LENGTH = 1000

export const ASSIGNMENT_RELEASED_MESSAGE =
  'This application was released after being idle. Your scores weren\u2019t saved.'

export type ReviewerSession =
  | {
      ok: true
      userId: string
      email: string
      cycle: NonNullable<Awaited<ReturnType<typeof getActiveCycle>>>
      minRequiredReviews: number
      isAdmin: boolean
    }
  | { ok: false; error: string }

export async function requireReviewerSession(): Promise<ReviewerSession> {
  const user = await getCurrentUser()
  if (!user?.email) {
    return { ok: false, error: 'Please log in with your UMich Google account.' }
  }

  const cycle = await getActiveCycle()
  if (!cycle) {
    return { ok: false, error: 'No active rush cycle.' }
  }

  const isAdmin = Boolean(await checkIsAdmin())
  const access = await db
    .select()
    .from(reviewAccess)
    .where(
      and(
        eq(reviewAccess.cycleId, cycle.id),
        eq(reviewAccess.email, normalizeReviewEmail(user.email))
      )
    )
    .limit(1)
    .then((rows) => rows[0] ?? null)

  if (!isAdmin && !access) {
    return { ok: false, error: 'You are not on the reviewer list for this cycle.' }
  }

  return {
    ok: true,
    userId: user.id,
    email: user.email,
    cycle,
    minRequiredReviews: access?.minRequiredReviews ?? MIN_REQUIRED_REVIEWS,
    isAdmin,
  }
}

function isAssignmentActive(
  app: {
    assignedReviewerId: string | null
    assignmentExpiresAt: string | null
  },
  nowMs = Date.now()
) {
  if (!app.assignedReviewerId || !app.assignmentExpiresAt) return false
  const expires = Date.parse(app.assignmentExpiresAt)
  return !Number.isNaN(expires) && expires > nowMs
}

function assignmentExpiryIso(fromMs = Date.now()) {
  return new Date(fromMs + ASSIGNMENT_DURATION_MS).toISOString()
}

export type AnonymizedReviewApplication = {
  id: string
  displayNumber: number | null
  assignmentExpiresAt: string | null
  overview: {
    majors: string
    graduationYear: string
    semestersRemaining: string
    otherProfessionalFraternity: string
    campusActivities: string
  }
  essays: Array<{ questionId: string; prompt: string; answer: string }>
  resume: {
    slot: 'resume_anonymized' | 'resume' | null
    filename: string | null
    isAnonymized: boolean
  }
  rubric: Array<{
    id: string
    title: string
    description: string | null
    sortOrder: number
    scaleMin: number
    scaleMax: number
    ratingLabels: RubricRatingLabels | null
  }>
}

async function buildAnonymizedApplication(
  applicationId: string,
  cycleId: string,
  assignmentExpiresAt: string | null
): Promise<AnonymizedReviewApplication | null> {
  const [app] = await db
    .select()
    .from(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.cycleId, cycleId)))
    .limit(1)
  if (!app || app.status !== 'submitted') return null

  const [questions, answers, files, categories] = await Promise.all([
    db
      .select()
      .from(cycleQuestions)
      .where(eq(cycleQuestions.cycleId, cycleId))
      .orderBy(asc(cycleQuestions.sortOrder)),
    db
      .select()
      .from(applicationAnswers)
      .where(eq(applicationAnswers.applicationId, applicationId)),
    db
      .select()
      .from(applicationFiles)
      .where(eq(applicationFiles.applicationId, applicationId)),
    db
      .select()
      .from(rubricCategories)
      .where(
        and(eq(rubricCategories.cycleId, cycleId), isNull(rubricCategories.archivedAt))
      )
      .orderBy(asc(rubricCategories.sortOrder)),
  ])

  const answerByQuestion = new Map(answers.map((row) => [row.questionId, row.body ?? '']))
  const fileBySlot = new Map(files.map((row) => [row.slot, row]))
  const anon = fileBySlot.get('resume_anonymized')
  const full = fileBySlot.get('resume')
  const resumeFile = anon ?? full ?? null

  const otherFrat =
    app.otherProfessionalFraternity == null
      ? ''
      : app.otherProfessionalFraternity
        ? 'Yes'
        : 'No'

  return {
    id: app.id,
    displayNumber: app.displayNumber,
    assignmentExpiresAt,
    overview: {
      majors: app.majors?.trim() || '',
      graduationYear: app.graduationYear != null ? String(app.graduationYear) : '',
      semestersRemaining:
        app.semestersRemaining != null ? String(app.semestersRemaining) : '',
      otherProfessionalFraternity: otherFrat,
      campusActivities: app.campusActivities?.trim() || '',
    },
    essays: questions.map((question) => ({
      questionId: question.id,
      prompt: question.prompt,
      answer: answerByQuestion.get(question.id)?.trim() || '',
    })),
    resume: {
      slot: resumeFile
        ? anon
          ? 'resume_anonymized'
          : 'resume'
        : null,
      filename: resumeFile?.originalFilename ?? null,
      isAnonymized: Boolean(anon),
    },
    rubric: categories.map((category) => ({
      id: category.id,
      title: category.title,
      description: category.description,
      sortOrder: category.sortOrder,
      scaleMin: category.scaleMin,
      scaleMax: category.scaleMax,
      ratingLabels: category.ratingLabels,
    })),
  }
}

export async function getAssignedReviewApplication(
  cycleId: string,
  reviewerUserId: string
) {
  const nowMs = Date.now()
  const assigned = await db
    .select()
    .from(applications)
    .where(
      and(
        eq(applications.cycleId, cycleId),
        eq(applications.status, 'submitted'),
        eq(applications.assignedReviewerId, reviewerUserId)
      )
    )

  const active = assigned
    .filter((app) => isAssignmentActive(app, nowMs))
    .sort((a, b) => {
      const aTime = a.assignedAt ? Date.parse(a.assignedAt) : 0
      const bTime = b.assignedAt ? Date.parse(b.assignedAt) : 0
      return bTime - aTime
    })

  if (active.length === 0) return null
  return buildAnonymizedApplication(active[0].id, cycleId, active[0].assignmentExpiresAt)
}

export async function claimNextApplication(cycleId: string, reviewerUserId: string) {
  const result = await db.transaction(async (tx) => {
    const nowMs = Date.now()
    const nowIso = new Date(nowMs).toISOString()
    const expiresAtIso = assignmentExpiryIso(nowMs)

    // Serialize claim selection for this cycle so two reviewers don't grab the same app.
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${`reads:${cycleId}`}))`)

    const currentAssigned = await tx
      .select()
      .from(applications)
      .where(
        and(
          eq(applications.cycleId, cycleId),
          eq(applications.status, 'submitted'),
          eq(applications.assignedReviewerId, reviewerUserId)
        )
      )

    const active = currentAssigned.filter((app) => isAssignmentActive(app, nowMs))
    if (active.length > 0) {
      active.sort((a, b) => {
        const aTime = a.assignedAt ? Date.parse(a.assignedAt) : 0
        const bTime = b.assignedAt ? Date.parse(b.assignedAt) : 0
        return bTime - aTime
      })
      const [primary, ...extras] = active
      for (const extra of extras) {
        await tx
          .update(applications)
          .set({
            assignedReviewerId: null,
            assignedAt: null,
            assignmentExpiresAt: null,
          })
          .where(eq(applications.id, extra.id))
      }
      await tx
        .update(applications)
        .set({
          assignedReviewerId: reviewerUserId,
          assignedAt: primary.assignedAt ?? nowIso,
          assignmentExpiresAt: expiresAtIso,
        })
        .where(eq(applications.id, primary.id))

      return {
        status: 'assigned' as const,
        applicationId: primary.id,
        expiresAtIso,
      }
    }

    const reviewed = await tx
      .select({ applicationId: reviews.applicationId })
      .from(reviews)
      .where(eq(reviews.reviewerUserId, reviewerUserId))
    const reviewedIds = new Set(reviewed.map((row) => row.applicationId))

    const candidates = await tx
      .select()
      .from(applications)
      .where(and(eq(applications.cycleId, cycleId), eq(applications.status, 'submitted')))
      .orderBy(
        asc(applications.reviewCount),
        asc(applications.submittedAt),
        asc(applications.id)
      )

    const next =
      candidates.find((app) => {
        if (reviewedIds.has(app.id)) return false
        if (isAssignmentActive(app, nowMs) && app.assignedReviewerId !== reviewerUserId) {
          return false
        }
        return true
      }) ?? null

    if (!next) {
      const remaining = candidates.filter((app) => !reviewedIds.has(app.id))
      if (remaining.length === 0) {
        return { status: 'all_reviewed' as const, applicationId: null, expiresAtIso: null }
      }
      return { status: 'all_assigned' as const, applicationId: null, expiresAtIso: null }
    }

    await tx
      .update(applications)
      .set({
        assignedReviewerId: reviewerUserId,
        assignedAt: nowIso,
        assignmentExpiresAt: expiresAtIso,
      })
      .where(eq(applications.id, next.id))

    return {
      status: 'assigned' as const,
      applicationId: next.id,
      expiresAtIso,
    }
  })

  if (result.status !== 'assigned' || !result.applicationId) {
    return { status: result.status, application: null }
  }

  return {
    status: result.status,
    application: await buildAnonymizedApplication(
      result.applicationId,
      cycleId,
      result.expiresAtIso
    ),
  }
}

export async function renewAssignment(
  cycleId: string,
  reviewerUserId: string,
  applicationId: string
) {
  const [app] = await db
    .select()
    .from(applications)
    .where(
      and(
        eq(applications.id, applicationId),
        eq(applications.cycleId, cycleId),
        eq(applications.status, 'submitted')
      )
    )
    .limit(1)

  if (!app) return { renewed: false as const, reason: 'not_found' as const }
  if (app.assignedReviewerId !== reviewerUserId) {
    return { renewed: false as const, reason: 'not_owner' as const }
  }

  const nowMs = Date.now()
  const expiresAtIso = assignmentExpiryIso(nowMs)
  await db
    .update(applications)
    .set({
      assignedReviewerId: reviewerUserId,
      assignedAt: app.assignedAt ?? new Date(nowMs).toISOString(),
      assignmentExpiresAt: expiresAtIso,
    })
    .where(eq(applications.id, applicationId))

  return { renewed: true as const, expiresAtIso }
}

export async function getReviewerStats(input: {
  cycleId: string
  reviewerUserId: string
  minRequiredReviews: number
}) {
  const rows = await db
    .select({
      id: reviews.id,
      startedAt: reviews.startedAt,
      endedAt: reviews.endedAt,
      applicationId: reviews.applicationId,
    })
    .from(reviews)
    .innerJoin(applications, eq(reviews.applicationId, applications.id))
    .where(
      and(
        eq(reviews.reviewerUserId, input.reviewerUserId),
        eq(applications.cycleId, input.cycleId)
      )
    )

  const durations = rows
    .map((row) => {
      if (!row.startedAt || !row.endedAt) return null
      const ms = Date.parse(row.endedAt) - Date.parse(row.startedAt)
      return Number.isFinite(ms) && ms >= 0 ? ms : null
    })
    .filter((value): value is number => value != null)

  const avgDurationMs =
    durations.length > 0
      ? durations.reduce((sum, value) => sum + value, 0) / durations.length
      : null

  const [submittedCount] = await db
    .select({ value: sql<number>`count(*)::int`.mapWith(Number) })
    .from(applications)
    .where(and(eq(applications.cycleId, input.cycleId), eq(applications.status, 'submitted')))

  return {
    completedCount: rows.length,
    minRequiredReviews: input.minRequiredReviews,
    remainingToMinimum: Math.max(0, input.minRequiredReviews - rows.length),
    avgDurationMs,
    submittedApplicationCount: submittedCount?.value ?? 0,
  }
}

export async function getActiveRubricCategories(cycleId: string) {
  return db
    .select()
    .from(rubricCategories)
    .where(and(eq(rubricCategories.cycleId, cycleId), isNull(rubricCategories.archivedAt)))
    .orderBy(asc(rubricCategories.sortOrder))
}

export async function submitApplicationReview(input: {
  cycleId: string
  reviewerUserId: string
  applicationId: string
  scores: Record<string, number>
  notes?: string | null
  startedAt?: string | null
}): Promise<{ error: string | null; assignmentReleased?: boolean }> {
  const categories = await getActiveRubricCategories(input.cycleId)
  if (categories.length === 0) {
    return { error: 'No rubric categories configured for this cycle.' }
  }

  for (const category of categories) {
    const score = input.scores[category.id]
    if (
      !Number.isInteger(score) ||
      score < category.scaleMin ||
      score > category.scaleMax
    ) {
      return {
        error: `Score each category from ${category.scaleMin}–${category.scaleMax}.`,
      }
    }
  }

  const notes = input.notes?.trim() || null
  if (notes && notes.length > NOTES_MAX_LENGTH) {
    return { error: `Notes must be ${NOTES_MAX_LENGTH} characters or fewer.` }
  }

  const [app] = await db
    .select()
    .from(applications)
    .where(
      and(
        eq(applications.id, input.applicationId),
        eq(applications.cycleId, input.cycleId),
        eq(applications.status, 'submitted')
      )
    )
    .limit(1)

  if (!app) return { error: 'Application not found.' }

  const nowMs = Date.now()
  if (!isAssignmentActive(app, nowMs) || app.assignedReviewerId !== input.reviewerUserId) {
    return { error: ASSIGNMENT_RELEASED_MESSAGE, assignmentReleased: true }
  }

  try {
    await db.transaction(async (tx) => {
      const [locked] = await tx
        .select()
        .from(applications)
        .where(
          and(
            eq(applications.id, input.applicationId),
            eq(applications.cycleId, input.cycleId),
            eq(applications.status, 'submitted')
          )
        )
        .limit(1)

      if (!locked) throw new Error('Application not found.')

      const lockedNowMs = Date.now()
      if (
        !isAssignmentActive(locked, lockedNowMs) ||
        locked.assignedReviewerId !== input.reviewerUserId
      ) {
        throw new Error(ASSIGNMENT_RELEASED_MESSAGE)
      }

      const [existing] = await tx
        .select({ id: reviews.id })
        .from(reviews)
        .where(
          and(
            eq(reviews.applicationId, input.applicationId),
            eq(reviews.reviewerUserId, input.reviewerUserId)
          )
        )
        .limit(1)
      if (existing) throw new Error('You already reviewed this application.')

      const nowIso = new Date(lockedNowMs).toISOString()
      const [created] = await tx
        .insert(reviews)
        .values({
          applicationId: input.applicationId,
          reviewerUserId: input.reviewerUserId,
          notes,
          startedAt: input.startedAt ?? null,
          endedAt: nowIso,
          submittedAt: nowIso,
        })
        .returning()

      if (!created) throw new Error('Could not save review.')

      await tx.insert(reviewScores).values(
        categories.map((category) => ({
          reviewId: created.id,
          categoryId: category.id,
          score: input.scores[category.id],
        }))
      )

      await tx
        .update(applications)
        .set({
          assignedReviewerId: null,
          assignedAt: null,
          assignmentExpiresAt: null,
          reviewCount: (locked.reviewCount ?? 0) + 1,
        })
        .where(eq(applications.id, input.applicationId))
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not submit review.'
    if (message === ASSIGNMENT_RELEASED_MESSAGE) {
      return { error: ASSIGNMENT_RELEASED_MESSAGE, assignmentReleased: true }
    }
    return { error: message }
  }

  return { error: null }
}

export async function getReviewFileForDownload(input: {
  cycleId: string
  reviewerUserId: string
  applicationId: string
  isAdmin: boolean
}) {
  const [app] = await db
    .select()
    .from(applications)
    .where(
      and(
        eq(applications.id, input.applicationId),
        eq(applications.cycleId, input.cycleId),
        eq(applications.status, 'submitted')
      )
    )
    .limit(1)

  if (!app) return { error: 'Application not found.' as const, file: null }

  const assignedToReviewer =
    app.assignedReviewerId === input.reviewerUserId && isAssignmentActive(app)
  if (!input.isAdmin && !assignedToReviewer) {
    return { error: 'This application is not assigned to you.' as const, file: null }
  }

  const files = await db
    .select()
    .from(applicationFiles)
    .where(eq(applicationFiles.applicationId, input.applicationId))

  const anon = files.find((file) => file.slot === 'resume_anonymized')
  const full = files.find((file) => file.slot === 'resume')
  // Reviewers: prefer anonymized; fall back to full only if anon missing.
  // Admins can get either when viewing assigned apps through the same path for now.
  const file = anon ?? full ?? null
  if (!file) return { error: 'No résumé on file.' as const, file: null }

  return { error: null, file }
}

export type ReviewReferenceCategory = {
  id: string
  title: string
  description: string | null
  sortOrder: number
  scaleMin: number
  scaleMax: number
  ratingLabels: RubricRatingLabels | null
}

export async function getCycleReviewReference(cycleId: string): Promise<{
  questions: Array<{ label: string; prompt: string }>
  categories: ReviewReferenceCategory[]
}> {
  const [questions, categories] = await Promise.all([
    db
      .select()
      .from(cycleQuestions)
      .where(eq(cycleQuestions.cycleId, cycleId))
      .orderBy(asc(cycleQuestions.sortOrder)),
    db
      .select()
      .from(rubricCategories)
      .where(and(eq(rubricCategories.cycleId, cycleId), isNull(rubricCategories.archivedAt)))
      .orderBy(asc(rubricCategories.sortOrder)),
  ])

  return {
    questions: questions.map((question, index) => ({
      label: `Question ${index + 1}`,
      prompt: question.prompt,
    })),
    categories: categories.map((category) => {
      const resolved = resolveRatingLabels(category)
      return {
        id: category.id,
        title: category.title,
        description: category.description,
        sortOrder: category.sortOrder,
        scaleMin: category.scaleMin,
        scaleMax: category.scaleMax,
        ratingLabels: resolved,
      }
    }),
  }
}
