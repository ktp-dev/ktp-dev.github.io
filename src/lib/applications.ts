import { and, asc, eq } from 'drizzle-orm'
import { db } from '@/db'
import {
  applicationAnswers,
  applicationFiles,
  applications,
  cycleQuestions,
  rushCycles,
} from '@/db/schema'
import type { ApplicationFields } from '@/lib/apply-schema'
import type { FileSlot } from '@/lib/apply-steps'

export async function getActiveCycle() {
  const [cycle] = await db
    .select()
    .from(rushCycles)
    .where(eq(rushCycles.isActive, true))
    .limit(1)
  return cycle ?? null
}

export async function getCycleById(id: string) {
  const [cycle] = await db.select().from(rushCycles).where(eq(rushCycles.id, id)).limit(1)
  return cycle ?? null
}

export function cycleWindow(cycle: typeof rushCycles.$inferSelect) {
  const now = Date.now()
  const opens = new Date(cycle.opensAt).getTime()
  const closes = new Date(cycle.closesAt).getTime()
  return {
    isOpen: now >= opens && now <= closes,
    isBeforeOpen: now < opens,
    isAfterClose: now > closes,
  }
}

export async function getCycleQuestions(cycleId: string) {
  return db
    .select()
    .from(cycleQuestions)
    .where(eq(cycleQuestions.cycleId, cycleId))
    .orderBy(asc(cycleQuestions.sortOrder))
}

export async function getApplicationForUser(cycleId: string, userId: string) {
  const [application] = await db
    .select()
    .from(applications)
    .where(and(eq(applications.cycleId, cycleId), eq(applications.userId, userId)))
    .limit(1)
  return application ?? null
}

export async function getOrCreateApplication(input: {
  cycleId: string
  userId: string
  email: string
}) {
  const existing = await getApplicationForUser(input.cycleId, input.userId)
  if (existing) return existing

  try {
    const [created] = await db
      .insert(applications)
      .values({
        cycleId: input.cycleId,
        userId: input.userId,
        email: input.email.toLowerCase(),
        status: 'draft',
      })
      .returning()
    return created
  } catch {
    const raced = await getApplicationForUser(input.cycleId, input.userId)
    if (!raced) throw new Error('Failed to create application')
    return raced
  }
}

export async function getApplicationAnswers(applicationId: string) {
  return db
    .select()
    .from(applicationAnswers)
    .where(eq(applicationAnswers.applicationId, applicationId))
}

export async function getApplicationFiles(applicationId: string) {
  return db
    .select()
    .from(applicationFiles)
    .where(eq(applicationFiles.applicationId, applicationId))
}

export function fieldsFromRow(row: typeof applications.$inferSelect): ApplicationFields {
  return {
    first_name: row.firstName,
    last_name: row.lastName,
    preferred_name: row.preferredName,
    pronouns: row.pronouns,
    phone: row.phone,
    majors: row.majors,
    minors: row.minors,
    graduation_year: row.graduationYear,
    gpa: row.gpa == null ? null : Number(row.gpa),
    semesters_remaining: row.semestersRemaining,
    other_professional_fraternity: row.otherProfessionalFraternity,
    campus_activities: row.campusActivities,
    hear_about: row.hearAbout ?? [],
    hear_about_other: row.hearAboutOther,
    anything_else: row.anythingElse,
    rush_feedback: row.rushFeedback,
  }
}

export async function saveApplicationFields(
  applicationId: string,
  userId: string,
  fields: ApplicationFields
) {
  const [updated] = await db
    .update(applications)
    .set({
      firstName: fields.first_name,
      lastName: fields.last_name,
      preferredName: fields.preferred_name,
      pronouns: fields.pronouns,
      phone: fields.phone,
      majors: fields.majors,
      minors: fields.minors,
      graduationYear: fields.graduation_year,
      gpa: fields.gpa == null ? null : String(fields.gpa),
      semestersRemaining: fields.semesters_remaining,
      otherProfessionalFraternity: fields.other_professional_fraternity ?? null,
      campusActivities: fields.campus_activities,
      hearAbout: fields.hear_about ?? [],
      hearAboutOther: fields.hear_about_other,
      anythingElse: fields.anything_else,
      rushFeedback: fields.rush_feedback,
    })
    .where(
      and(
        eq(applications.id, applicationId),
        eq(applications.userId, userId),
        eq(applications.status, 'draft')
      )
    )
    .returning()
  return updated ?? null
}

export async function saveApplicationAnswers(
  applicationId: string,
  answers: { questionId: string; body: string | null }[]
) {
  for (const answer of answers) {
    await db
      .insert(applicationAnswers)
      .values({
        applicationId,
        questionId: answer.questionId,
        body: answer.body,
      })
      .onConflictDoUpdate({
        target: [applicationAnswers.applicationId, applicationAnswers.questionId],
        set: { body: answer.body },
      })
  }
}

export async function saveDummyFile(input: {
  applicationId: string
  slot: FileSlot
  filename: string
  mimeType: string
  sizeBytes: number
}) {
  const s3Key = `dummy/${input.applicationId}/${input.slot}/${input.filename}`
  const [saved] = await db
    .insert(applicationFiles)
    .values({
      applicationId: input.applicationId,
      slot: input.slot,
      s3Key,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      originalFilename: input.filename,
    })
    .onConflictDoUpdate({
      target: [applicationFiles.applicationId, applicationFiles.slot],
      set: {
        s3Key,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
        originalFilename: input.filename,
      },
    })
    .returning()
  return saved
}

export async function deleteDummyFile(applicationId: string, slot: FileSlot) {
  await db
    .delete(applicationFiles)
    .where(
      and(
        eq(applicationFiles.applicationId, applicationId),
        eq(applicationFiles.slot, slot)
      )
    )
}

export async function submitApplication(applicationId: string, userId: string) {
  const [updated] = await db
    .update(applications)
    .set({
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    })
    .where(
      and(
        eq(applications.id, applicationId),
        eq(applications.userId, userId),
        eq(applications.status, 'draft')
      )
    )
    .returning()
  return updated ?? null
}
