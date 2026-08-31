import { and, asc, desc, eq, inArray, ne, sql } from 'drizzle-orm'
import { db } from '@/db'
import { applicationAnswers, cycleQuestions, rushCycles } from '@/db/schema'
import {
  listRubricCategoriesForCycle,
  seedDefaultRubricCategories,
  type ClientRubricCategory,
} from '@/lib/rubric-admin'
import {
  withDefaultApplicationCopy,
} from '@/lib/default-rush-application'
import type {
  RushCycleApplicationWrite,
  RushCycleCreateWrite,
  RushCycleMetaWrite,
} from '@/lib/rush-cycle-schema'
import {
  getRushEventsForCycle,
  seedDefaultRushEvents,
  toClientRushEvent,
  type ClientRushEvent,
} from '@/lib/rush-events'

export function toClientCycle(cycle: typeof rushCycles.$inferSelect) {
  return {
    id: cycle.id,
    name: cycle.name,
    opens_at: cycle.opensAt,
    closes_at: cycle.closesAt,
    apply_close_grace_minutes: cycle.applyCloseGraceMinutes,
    intro_markdown: cycle.introMarkdown,
    closed_markdown: cycle.closedMarkdown,
    public_blurb: cycle.publicBlurb,
    interest_form_url: cycle.interestFormUrl,
    youtube_url: cycle.youtubeUrl,
    calendar_url: cycle.calendarUrl,
    hear_about_options: cycle.hearAboutOptions ?? [],
    is_active: cycle.isActive,
  }
}

export function toClientQuestion(question: typeof cycleQuestions.$inferSelect) {
  return {
    id: question.id,
    prompt: question.prompt,
    help_text: question.helpText,
    max_words: question.maxWords,
    required: question.required,
    sort_order: question.sortOrder,
  }
}

export type ClientRushCycle = ReturnType<typeof toClientCycle>
export type ClientCycleQuestion = ReturnType<typeof toClientQuestion>

export type CycleBundle = {
  cycle: ClientRushCycle
  questions: ClientCycleQuestion[]
  events: ClientRushEvent[]
  categories: ClientRubricCategory[]
}

async function questionsForCycle(cycleId: string) {
  const questions = await db
    .select()
    .from(cycleQuestions)
    .where(eq(cycleQuestions.cycleId, cycleId))
    .orderBy(asc(cycleQuestions.sortOrder))
  return questions.map(toClientQuestion)
}

async function eventsForCycle(cycleId: string) {
  const events = await getRushEventsForCycle(cycleId)
  return events.map(toClientRushEvent)
}

export async function listRushCycles() {
  const cycles = await db.select().from(rushCycles).orderBy(desc(rushCycles.opensAt))
  return cycles.map(toClientCycle)
}

export async function getCycleBundle(cycleId: string): Promise<CycleBundle | null> {
  const [cycle] = await db
    .select()
    .from(rushCycles)
    .where(eq(rushCycles.id, cycleId))
    .limit(1)
  if (!cycle) return null

  const [questions, events, categories] = await Promise.all([
    questionsForCycle(cycle.id),
    eventsForCycle(cycle.id),
    listRubricCategoriesForCycle(cycle.id),
  ])

  return {
    cycle: toClientCycle(cycle),
    questions,
    events,
    categories,
  }
}

export async function getAdminCycle() {
  const [active] = await db
    .select()
    .from(rushCycles)
    .where(eq(rushCycles.isActive, true))
    .limit(1)

  const cycle =
    active ??
    (
      await db
        .select()
        .from(rushCycles)
        .orderBy(desc(rushCycles.createdAt))
        .limit(1)
    )[0]

  if (!cycle) {
    return {
      cycle: null,
      questions: [] as ClientCycleQuestion[],
      events: [] as ClientRushEvent[],
      categories: [] as ClientRubricCategory[],
    }
  }

  const [questions, events, categories] = await Promise.all([
    questionsForCycle(cycle.id),
    eventsForCycle(cycle.id),
    listRubricCategoriesForCycle(cycle.id),
  ])

  return {
    cycle: toClientCycle(cycle),
    questions,
    events,
    categories,
  }
}

function cycleMetaValues(input: RushCycleMetaWrite) {
  return {
    name: input.name,
    opensAt: new Date(input.opens_at).toISOString(),
    closesAt: new Date(input.closes_at).toISOString(),
    applyCloseGraceMinutes: input.apply_close_grace_minutes,
    interestFormUrl: input.interest_form_url,
    youtubeUrl: input.youtube_url,
    calendarUrl: input.calendar_url,
  }
}

async function replaceQuestions(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  cycleId: string,
  questions: RushCycleApplicationWrite['questions']
) {
  const existing = await tx
    .select({ id: cycleQuestions.id })
    .from(cycleQuestions)
    .where(eq(cycleQuestions.cycleId, cycleId))

  const keepIds = questions
    .map((question) => question.id)
    .filter((id): id is string => Boolean(id))
  const removeIds = existing.map((row) => row.id).filter((id) => !keepIds.includes(id))

  if (removeIds.length) {
    const [inUse] = await tx
      .select({ id: applicationAnswers.id })
      .from(applicationAnswers)
      .where(inArray(applicationAnswers.questionId, removeIds))
      .limit(1)

    if (inUse) {
      throw new Error('Cannot delete a question that applicants have already answered.')
    }

    await tx.delete(cycleQuestions).where(inArray(cycleQuestions.id, removeIds))
  }

  for (const [index, question] of questions.entries()) {
    const values = {
      prompt: question.prompt,
      helpText: question.help_text,
      maxWords: question.max_words,
      required: question.required,
      sortOrder: index,
    }

    if (question.id) {
      await tx
        .update(cycleQuestions)
        .set(values)
        .where(and(eq(cycleQuestions.id, question.id), eq(cycleQuestions.cycleId, cycleId)))
    } else {
      await tx.insert(cycleQuestions).values({
        cycleId,
        ...values,
      })
    }
  }
}

export async function createRushCycle(input: RushCycleCreateWrite) {
  const existing = await listRushCycles()
  const makeActive = existing.length === 0
  const application = withDefaultApplicationCopy(input)

  const created = await db.transaction(async (tx) => {
    if (makeActive) {
      await tx.update(rushCycles).set({ isActive: false }).where(eq(rushCycles.isActive, true))
    }

    const [row] = await tx
      .insert(rushCycles)
      .values({
        ...cycleMetaValues(application),
        introMarkdown: application.intro_markdown,
        closedMarkdown: application.closed_markdown,
        hearAboutOptions: application.hear_about_options,
        isActive: makeActive,
      })
      .returning()

    await tx.insert(cycleQuestions).values(
      application.questions.map((question, index) => ({
        cycleId: row.id,
        prompt: question.prompt,
        helpText: question.help_text,
        maxWords: question.max_words,
        required: question.required,
        sortOrder: index,
      }))
    )

    await seedDefaultRubricCategories(tx, row.id)
    await seedDefaultRushEvents(tx, row.id)

    return row
  })

  return getCycleBundle(created.id)
}

export async function saveRushCycleMeta(cycleId: string, input: RushCycleMetaWrite) {
  const [updated] = await db
    .update(rushCycles)
    .set({
      ...cycleMetaValues(input),
      updatedAt: sql`timezone('utc'::text, now())`,
    })
    .where(eq(rushCycles.id, cycleId))
    .returning()
  return updated ?? null
}

export async function saveRushCycle(cycleId: string, input: RushCycleApplicationWrite) {
  return db.transaction(async (tx) => {
    const [updated] = await tx
      .update(rushCycles)
      .set({
        introMarkdown: input.intro_markdown,
        closedMarkdown: input.closed_markdown,
        hearAboutOptions: input.hear_about_options,
        updatedAt: sql`timezone('utc'::text, now())`,
      })
      .where(eq(rushCycles.id, cycleId))
      .returning()

    if (!updated) throw new Error('Cycle not found')

    await replaceQuestions(tx, cycleId, input.questions)
    return updated
  })
}

export async function activateRushCycle(cycleId: string) {
  return db.transaction(async (tx) => {
    await tx
      .update(rushCycles)
      .set({ isActive: false })
      .where(and(eq(rushCycles.isActive, true), ne(rushCycles.id, cycleId)))
    const [updated] = await tx
      .update(rushCycles)
      .set({
        isActive: true,
        updatedAt: sql`timezone('utc'::text, now())`,
      })
      .where(eq(rushCycles.id, cycleId))
      .returning()
    return updated ?? null
  })
}

export async function closeRushCycleNow(cycleId: string) {
  const [updated] = await db
    .update(rushCycles)
    .set({
      closesAt: new Date().toISOString(),
      updatedAt: sql`timezone('utc'::text, now())`,
    })
    .where(eq(rushCycles.id, cycleId))
    .returning()
  return updated ?? null
}

export async function openRushCycleNow(cycleId: string) {
  const [cycle] = await db
    .select()
    .from(rushCycles)
    .where(eq(rushCycles.id, cycleId))
    .limit(1)
  if (!cycle) return null

  const now = new Date()
  const opens = new Date(cycle.opensAt)
  const closes = new Date(cycle.closesAt)
  const opensAt = opens > now ? now.toISOString() : cycle.opensAt
  const closesAt =
    closes <= now
      ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : cycle.closesAt

  return db.transaction(async (tx) => {
    await tx.update(rushCycles).set({ isActive: false }).where(eq(rushCycles.isActive, true))
    const [updated] = await tx
      .update(rushCycles)
      .set({
        opensAt,
        closesAt,
        isActive: true,
        updatedAt: sql`timezone('utc'::text, now())`,
      })
      .where(eq(rushCycles.id, cycleId))
      .returning()
    return updated ?? null
  })
}
