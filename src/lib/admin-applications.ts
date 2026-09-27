import 'server-only'

import { and, asc, eq, inArray, sql } from 'drizzle-orm'
import { db } from '@/db'
import {
  applicationAnswers,
  applicationFiles,
  applications,
  cycleQuestions,
  reviewScores,
  reviews,
  rubricCategories,
} from '@/db/schema'
import { deleteS3Object } from '@/lib/s3'
import { formatRushDateTimeCompact } from '@/lib/rush-timezone'
import {
  filterAdminApplications,
  sortAdminApplications,
  type AdminApplicationListItem,
  type AdminApplicationSortKey,
} from '@/lib/admin-applications-shared'

export type { AdminApplicationListItem, AdminApplicationSortKey }
export { filterAdminApplications, sortAdminApplications }

export type AdminReviewDetail = {
  id: string
  reviewerUserId: string
  reviewerLabel: string
  reviewerEmail: string | null
  scoresByCategoryId: Record<string, number>
  totalScore: number
  notes: string | null
  startedAt: string | null
  endedAt: string | null
  submittedAt: string
  durationMs: number | null
}

export type AdminApplicationDetail = {
  application: {
    id: string
    displayNumber: number | null
    name: string
    email: string
    submittedAt: string | null
    firstName: string | null
    lastName: string | null
    preferredName: string | null
    pronouns: string | null
    phone: string | null
    majors: string | null
    minors: string | null
    graduationYear: number | null
    gpa: string | null
    semestersRemaining: number | null
    otherProfessionalFraternity: boolean | null
    campusActivities: string | null
    hearAbout: string[] | null
    hearAboutOther: string | null
    anythingElse: string | null
    rushFeedback: string | null
    readCount: number
  }
  essays: Array<{ questionId: string; prompt: string; answer: string }>
  files: Array<{ slot: string; originalFilename: string | null }>
  rubric: Array<{ id: string; title: string; sortOrder: number; scaleMax: number }>
  listStats: {
    avgScore: number | null
    normalizedAvgScore: number | null
    categoryAverages: Record<string, number> | null
  }
  reviews: AdminReviewDetail[]
}

function legalDisplayName(app: {
  firstName: string | null
  lastName: string | null
  email: string
}) {
  const parts = [app.firstName?.trim(), app.lastName?.trim()].filter(Boolean)
  if (parts.length > 0) return parts.join(' ')
  return app.email
}

function displayName(app: {
  preferredName: string | null
  firstName: string | null
  lastName: string | null
  email: string
}) {
  return legalDisplayName(app)
}

function computeReviewAggregates(
  applicationIds: string[],
  categories: Array<{ id: string; scaleMin: number; scaleMax: number }>,
  reviewRows: Array<{
    applicationId: string
    reviewId: string
    reviewerUserId: string
    categoryId: string
    score: number
  }>
) {
  const categoryIds = categories.map((c) => c.id)
  const expectedScoreCount = categoryIds.length

  const scoresByReview = new Map<
    string,
    {
      applicationId: string
      reviewerUserId: string
      scores: Map<string, number>
    }
  >()

  for (const row of reviewRows) {
    if (!applicationIds.includes(row.applicationId)) continue
    let entry = scoresByReview.get(row.reviewId)
    if (!entry) {
      entry = {
        applicationId: row.applicationId,
        reviewerUserId: row.reviewerUserId,
        scores: new Map(),
      }
      scoresByReview.set(row.reviewId, entry)
    }
    entry.scores.set(row.categoryId, row.score)
  }

  const completeReviews: Array<{
    applicationId: string
    reviewerUserId: string
    totalScore: number
    scores: Map<string, number>
  }> = []

  for (const entry of scoresByReview.values()) {
    if (entry.scores.size !== expectedScoreCount) continue
    if (!categoryIds.every((id) => entry.scores.has(id))) continue
    let total = 0
    for (const id of categoryIds) {
      const score = entry.scores.get(id)!
      const category = categories.find((c) => c.id === id)
      if (!category || score < category.scaleMin || score > category.scaleMax) {
        total = NaN
        break
      }
      total += score
    }
    if (!Number.isFinite(total)) continue
    completeReviews.push({
      applicationId: entry.applicationId,
      reviewerUserId: entry.reviewerUserId,
      totalScore: total,
      scores: entry.scores,
    })
  }

  const statsByApp = new Map<
    string,
    {
      readCount: number
      totalScoreSum: number
      categorySums: Map<string, number>
    }
  >()

  for (const review of completeReviews) {
    const current = statsByApp.get(review.applicationId) ?? {
      readCount: 0,
      totalScoreSum: 0,
      categorySums: new Map<string, number>(),
    }
    current.readCount += 1
    current.totalScoreSum += review.totalScore
    for (const [categoryId, score] of review.scores) {
      current.categorySums.set(categoryId, (current.categorySums.get(categoryId) ?? 0) + score)
    }
    statsByApp.set(review.applicationId, current)
  }

  let overallTotal = 0
  let overallCount = 0
  const reviewerTotals = new Map<string, { sum: number; count: number }>()
  for (const review of completeReviews) {
    overallTotal += review.totalScore
    overallCount += 1
    const reviewer = reviewerTotals.get(review.reviewerUserId) ?? { sum: 0, count: 0 }
    reviewer.sum += review.totalScore
    reviewer.count += 1
    reviewerTotals.set(review.reviewerUserId, reviewer)
  }
  const overallMean = overallCount > 0 ? overallTotal / overallCount : null
  const reviewerMeans = new Map<string, number>()
  for (const [reviewerId, stats] of reviewerTotals) {
    if (stats.count > 0) reviewerMeans.set(reviewerId, stats.sum / stats.count)
  }

  const normalizedSums = new Map<string, number>()
  for (const review of completeReviews) {
    const reviewerMean = reviewerMeans.get(review.reviewerUserId)
    const adjustment =
      overallMean !== null
        ? overallMean - (reviewerMean !== undefined ? reviewerMean : overallMean)
        : 0
    normalizedSums.set(
      review.applicationId,
      (normalizedSums.get(review.applicationId) ?? 0) + review.totalScore + adjustment
    )
  }

  return { statsByApp, normalizedSums, completeReviews }
}

async function loadReviewScoreRows(cycleId: string, applicationIds: string[]) {
  if (applicationIds.length === 0) return []

  const rows = await db
    .select({
      applicationId: reviews.applicationId,
      reviewId: reviews.id,
      reviewerUserId: reviews.reviewerUserId,
      categoryId: reviewScores.categoryId,
      score: reviewScores.score,
    })
    .from(reviews)
    .innerJoin(reviewScores, eq(reviewScores.reviewId, reviews.id))
    .innerJoin(applications, eq(applications.id, reviews.applicationId))
    .where(and(eq(applications.cycleId, cycleId), inArray(reviews.applicationId, applicationIds)))

  return rows
}

export async function listApplicationsForAdmin(cycleId: string): Promise<AdminApplicationListItem[]> {
  const [apps, categories] = await Promise.all([
    db
      .select()
      .from(applications)
      .where(and(eq(applications.cycleId, cycleId), eq(applications.status, 'submitted')))
      .orderBy(asc(applications.displayNumber), asc(applications.submittedAt)),
    db
      .select()
      .from(rubricCategories)
      .where(eq(rubricCategories.cycleId, cycleId))
      .orderBy(asc(rubricCategories.sortOrder)),
  ])

  const applicationIds = apps.map((app) => app.id)
  const files =
    applicationIds.length > 0
      ? await db
          .select()
          .from(applicationFiles)
          .where(inArray(applicationFiles.applicationId, applicationIds))
      : []
  const reviewRows = await loadReviewScoreRows(cycleId, applicationIds)
  const { statsByApp, normalizedSums } = computeReviewAggregates(
    applicationIds,
    categories,
    reviewRows
  )

  const filesByApp = new Map<string, Set<string>>()
  for (const file of files) {
    const set = filesByApp.get(file.applicationId) ?? new Set()
    set.add(file.slot)
    filesByApp.set(file.applicationId, set)
  }

  return apps.map((app) => {
    const stats = statsByApp.get(app.id)
    const readCount = stats?.readCount ?? app.reviewCount ?? 0
    const avgScore = stats && stats.readCount > 0 ? stats.totalScoreSum / stats.readCount : null
    const normalizedAvgScore =
      stats && stats.readCount > 0
        ? (normalizedSums.get(app.id) ?? 0) / stats.readCount
        : null
    const categoryAverages =
      stats && stats.readCount > 0
        ? Object.fromEntries(
            [...stats.categorySums.entries()].map(([id, sum]) => [id, sum / stats.readCount])
          )
        : null
    const slots = filesByApp.get(app.id) ?? new Set()

    return {
      id: app.id,
      displayNumber: app.displayNumber,
      name: displayName(app),
      email: app.email,
      majors: app.majors?.trim() || null,
      graduationYear: app.graduationYear,
      submittedAt: app.submittedAt,
      readCount,
      avgScore,
      normalizedAvgScore,
      categoryAverages,
      hasResume: slots.has('resume'),
      hasResumeAnonymized: slots.has('resume_anonymized'),
    }
  })
}

export async function getApplicationReviewDetailsForAdmin(
  cycleId: string,
  applicationId: string
): Promise<AdminApplicationDetail | null> {
  const [app] = await db
    .select()
    .from(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.cycleId, cycleId)))
    .limit(1)

  if (!app || app.status !== 'submitted') return null

  const [questions, answers, files, categories, reviewRows, reviewMeta] = await Promise.all([
    db
      .select()
      .from(cycleQuestions)
      .where(eq(cycleQuestions.cycleId, cycleId))
      .orderBy(asc(cycleQuestions.sortOrder)),
    db.select().from(applicationAnswers).where(eq(applicationAnswers.applicationId, applicationId)),
    db.select().from(applicationFiles).where(eq(applicationFiles.applicationId, applicationId)),
    db
      .select()
      .from(rubricCategories)
      .where(eq(rubricCategories.cycleId, cycleId))
      .orderBy(asc(rubricCategories.sortOrder)),
    loadReviewScoreRows(cycleId, [applicationId]),
    db.select().from(reviews).where(eq(reviews.applicationId, applicationId)),
  ])

  const answerByQuestion = new Map(answers.map((row) => [row.questionId, row.body ?? '']))
  const { statsByApp, normalizedSums, completeReviews } = computeReviewAggregates(
    [applicationId],
    categories,
    reviewRows
  )
  const stats = statsByApp.get(applicationId)
  const listStats = {
    avgScore: stats && stats.readCount > 0 ? stats.totalScoreSum / stats.readCount : null,
    normalizedAvgScore:
      stats && stats.readCount > 0
        ? (normalizedSums.get(applicationId) ?? 0) / stats.readCount
        : null,
    categoryAverages:
      stats && stats.readCount > 0
        ? Object.fromEntries(
            [...stats.categorySums.entries()].map(([id, sum]) => [id, sum / stats.readCount])
          )
        : null,
  }

  const scoresByReviewId = new Map<string, Record<string, number>>()
  for (const row of reviewRows) {
    const current = scoresByReviewId.get(row.reviewId) ?? {}
    current[row.categoryId] = row.score
    scoresByReviewId.set(row.reviewId, current)
  }

  const reviewerIds = [...new Set(reviewMeta.map((review) => review.reviewerUserId))]
  const reviewerInfoRows =
    reviewerIds.length > 0
      ? await db.execute<{
          user_id: string
          email: string | null
          first_name: string | null
          last_name: string | null
        }>(sql`
          SELECT
            u.id AS user_id,
            u.email,
            b.first_name,
            b.last_name
          FROM auth.users AS u
          LEFT JOIN brothers AS b ON lower(b.umich_email) = lower(u.email)
          WHERE u.id IN (${sql.join(
            reviewerIds.map((id) => sql`${id}::uuid`),
            sql`, `
          )})
        `)
      : []

  const reviewerInfoById = new Map(
    Array.from(reviewerInfoRows as Iterable<{
      user_id: string
      email: string | null
      first_name: string | null
      last_name: string | null
    }>).map((row) => [row.user_id, row] as const)
  )

  const reviewDetails: AdminReviewDetail[] = reviewMeta
    .map((review) => {
      const scoresByCategoryId = scoresByReviewId.get(review.id)
      if (!scoresByCategoryId || categories.length !== Object.keys(scoresByCategoryId).length) {
        return null
      }
      let totalScore = 0
      for (const category of categories) {
        const score = scoresByCategoryId[category.id]
        if (score == null || score < category.scaleMin || score > category.scaleMax) return null
        totalScore += score
      }
      const started = review.startedAt ? Date.parse(review.startedAt) : NaN
      const ended = review.endedAt ? Date.parse(review.endedAt) : NaN
      const durationMs =
        Number.isFinite(started) && Number.isFinite(ended) && ended >= started
          ? ended - started
          : null

      const info = reviewerInfoById.get(review.reviewerUserId)
      const nameParts = [info?.first_name?.trim(), info?.last_name?.trim()].filter(Boolean)
      const reviewerLabel =
        nameParts.length > 0
          ? nameParts.join(' ')
          : info?.email?.trim() || `Reviewer …${review.reviewerUserId.slice(-8)}`

      return {
        id: review.id,
        reviewerUserId: review.reviewerUserId,
        reviewerLabel,
        reviewerEmail: info?.email?.trim() || null,
        scoresByCategoryId,
        totalScore,
        notes: review.notes,
        startedAt: review.startedAt,
        endedAt: review.endedAt,
        submittedAt: review.submittedAt,
        durationMs,
      }
    })
    .filter((row): row is AdminReviewDetail => row != null)
    .sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt))

  return {
    application: {
      id: app.id,
      displayNumber: app.displayNumber,
      name: displayName(app),
      email: app.email,
      submittedAt: app.submittedAt,
      firstName: app.firstName,
      lastName: app.lastName,
      preferredName: app.preferredName,
      pronouns: app.pronouns,
      phone: app.phone,
      majors: app.majors,
      minors: app.minors,
      graduationYear: app.graduationYear,
      gpa: app.gpa,
      semestersRemaining: app.semestersRemaining,
      otherProfessionalFraternity: app.otherProfessionalFraternity,
      campusActivities: app.campusActivities,
      hearAbout: app.hearAbout,
      hearAboutOther: app.hearAboutOther,
      anythingElse: app.anythingElse,
      rushFeedback: app.rushFeedback,
      readCount: app.reviewCount ?? 0,
    },
    essays: questions.map((question) => ({
      questionId: question.id,
      prompt: question.prompt,
      answer: answerByQuestion.get(question.id)?.trim() || '',
    })),
    files: files.map((file) => ({
      slot: file.slot,
      originalFilename: file.originalFilename,
    })),
    rubric: categories.map((category) => ({
      id: category.id,
      title: category.title,
      sortOrder: category.sortOrder,
      scaleMax: category.scaleMax,
    })),
    listStats,
    reviews: reviewDetails,
  }
}

export async function getAdjacentAdminApplications(
  cycleId: string,
  applicationId: string
): Promise<{ prevId: string | null; nextId: string | null }> {
  const apps = await db
    .select({ id: applications.id, displayNumber: applications.displayNumber })
    .from(applications)
    .where(and(eq(applications.cycleId, cycleId), eq(applications.status, 'submitted')))
    .orderBy(asc(applications.displayNumber), asc(applications.submittedAt))

  const index = apps.findIndex((app) => app.id === applicationId)
  if (index === -1) return { prevId: null, nextId: null }

  return {
    prevId: index > 0 ? apps[index - 1].id : null,
    nextId: index < apps.length - 1 ? apps[index + 1].id : null,
  }
}

function csvEscape(value: string | number | null | undefined) {
  if (value == null) return ''
  const text = String(value)
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

export async function buildApplicationsExportCsv(
  cycleId: string,
  cycleName: string,
  options?: { query?: string; sort?: AdminApplicationSortKey }
): Promise<string> {
  const [applications, categories] = await Promise.all([
    listApplicationsForAdmin(cycleId),
    db
      .select()
      .from(rubricCategories)
      .where(eq(rubricCategories.cycleId, cycleId))
      .orderBy(asc(rubricCategories.sortOrder)),
  ])

  const items = sortAdminApplications(
    filterAdminApplications(applications, options?.query ?? ''),
    options?.sort ?? 'display'
  )

  const headers = [
    'Application #',
    'Name',
    'Email',
    'Major(s)',
    'Graduation Year',
    'Submitted At',
    'Read Count',
    'Avg Score',
    'Adjusted Avg Score',
    ...categories.map((category, index) => `Category ${index + 1} Avg`),
    'Has Resume',
    'Has Anonymized Resume',
  ]

  const rows = items.map((item) => [
    item.displayNumber ?? '',
    item.name,
    item.email,
    item.majors ?? '',
    item.graduationYear ?? '',
    item.submittedAt ? (formatRushDateTimeCompact(item.submittedAt) ?? item.submittedAt) : '',
    item.readCount,
    item.avgScore != null ? item.avgScore.toFixed(2) : '',
    item.normalizedAvgScore != null ? item.normalizedAvgScore.toFixed(2) : '',
    ...categories.map((category) => {
      const avg = item.categoryAverages?.[category.id]
      return avg != null ? avg.toFixed(2) : ''
    }),
    item.hasResume ? 'yes' : 'no',
    item.hasResumeAnonymized ? 'yes' : 'no',
  ])

  return [
    `# ${cycleName} applications export`,
    headers.map(csvEscape).join(','),
    ...rows.map((row) => row.map(csvEscape).join(',')),
  ].join('\n')
}

/** Deletes an application and best-effort removes its S3 objects. Related rows cascade. */
export async function deleteApplicationForAdmin(
  cycleId: string,
  applicationId: string
): Promise<{ error: string | null }> {
  const [app] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.cycleId, cycleId)))
    .limit(1)

  if (!app) return { error: 'Application not found.' }

  const files = await db
    .select({ s3Key: applicationFiles.s3Key })
    .from(applicationFiles)
    .where(eq(applicationFiles.applicationId, applicationId))

  await Promise.all(
    files.map(async (file) => {
      if (!file.s3Key) return
      await deleteS3Object(file.s3Key)
    })
  )

  await db.delete(applications).where(eq(applications.id, applicationId))
  return { error: null }
}
