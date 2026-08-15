import { and, asc, desc, eq, inArray, ne, sql } from 'drizzle-orm'
import { db } from '@/db'
import { applicationAnswers, cycleQuestions, rushCycles } from '@/db/schema'
import type { RushCycleWrite } from '@/lib/rush-cycle-schema'

export function toClientCycle(cycle: typeof rushCycles.$inferSelect) {
  return {
    id: cycle.id,
    name: cycle.name,
    opens_at: cycle.opensAt,
    closes_at: cycle.closesAt,
    intro_markdown: cycle.introMarkdown,
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

  if (!cycle) return { cycle: null, questions: [] as ClientCycleQuestion[] }

  const questions = await db
    .select()
    .from(cycleQuestions)
    .where(eq(cycleQuestions.cycleId, cycle.id))
    .orderBy(asc(cycleQuestions.sortOrder))

  return {
    cycle: toClientCycle(cycle),
    questions: questions.map(toClientQuestion),
  }
}

export async function createRushCycle(input: RushCycleWrite) {
  return db.transaction(async (tx) => {
    if (input.is_active) {
      await tx.update(rushCycles).set({ isActive: false }).where(eq(rushCycles.isActive, true))
    }

    const [created] = await tx
      .insert(rushCycles)
      .values({
        name: input.name,
        opensAt: new Date(input.opens_at).toISOString(),
        closesAt: new Date(input.closes_at).toISOString(),
        introMarkdown: input.intro_markdown,
        hearAboutOptions: input.hear_about_options,
        isActive: input.is_active,
      })
      .returning()

    if (input.questions.length) {
      await tx.insert(cycleQuestions).values(
        input.questions.map((question, index) => ({
          cycleId: created.id,
          prompt: question.prompt,
          helpText: question.help_text,
          maxWords: question.max_words,
          required: question.required,
          sortOrder: index,
        }))
      )
    }

    return created
  })
}

export async function saveRushCycle(cycleId: string, input: RushCycleWrite) {
  return db.transaction(async (tx) => {
    if (input.is_active) {
      await tx
        .update(rushCycles)
        .set({ isActive: false })
        .where(and(eq(rushCycles.isActive, true), ne(rushCycles.id, cycleId)))
    }

    const [updated] = await tx
      .update(rushCycles)
      .set({
        name: input.name,
        opensAt: new Date(input.opens_at).toISOString(),
        closesAt: new Date(input.closes_at).toISOString(),
        introMarkdown: input.intro_markdown,
        hearAboutOptions: input.hear_about_options,
        isActive: input.is_active,
        updatedAt: sql`timezone('utc'::text, now())`,
      })
      .where(eq(rushCycles.id, cycleId))
      .returning()

    if (!updated) throw new Error('Cycle not found')

    const existing = await tx
      .select({ id: cycleQuestions.id })
      .from(cycleQuestions)
      .where(eq(cycleQuestions.cycleId, cycleId))

    const keepIds = input.questions
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

    for (const [index, question] of input.questions.entries()) {
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

    return updated
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
