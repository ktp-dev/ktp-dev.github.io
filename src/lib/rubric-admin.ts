import { and, asc, eq, inArray, isNull } from 'drizzle-orm'
import { db } from '@/db'
import { reviewScores, rubricCategories, type RubricRatingLabels } from '@/db/schema'
import { buildDefaultRubricCategorySeeds } from '@/lib/default-rubric-categories'
import type { RushRubricSaveWrite } from '@/lib/rubric-schema'
import { resolveRatingLabels } from '@/lib/rubric-ui'

export function toClientRubricCategory(category: typeof rubricCategories.$inferSelect) {
  const resolved = resolveRatingLabels(category)
  return {
    id: category.id,
    title: category.title,
    description: category.description,
    sort_order: category.sortOrder,
    scale_min: category.scaleMin,
    scale_max: category.scaleMax,
    rating_labels: resolved,
  }
}

export type ClientRubricCategory = ReturnType<typeof toClientRubricCategory>

export async function listRubricCategoriesForCycle(cycleId: string) {
  const rows = await db
    .select()
    .from(rubricCategories)
    .where(and(eq(rubricCategories.cycleId, cycleId), isNull(rubricCategories.archivedAt)))
    .orderBy(asc(rubricCategories.sortOrder))
  return rows.map(toClientRubricCategory)
}

export async function seedDefaultRubricCategories(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  cycleId: string
) {
  const existing = await tx
    .select({ id: rubricCategories.id })
    .from(rubricCategories)
    .where(and(eq(rubricCategories.cycleId, cycleId), isNull(rubricCategories.archivedAt)))
    .limit(1)

  if (existing.length) return

  const seeds = buildDefaultRubricCategorySeeds()
  await tx.insert(rubricCategories).values(
    seeds.map((seed) => ({
      cycleId,
      title: seed.title,
      description: seed.description,
      sortOrder: seed.sortOrder,
      scaleMin: seed.scaleMin,
      scaleMax: seed.scaleMax,
      ratingLabels: seed.ratingLabels,
    }))
  )
}

export async function saveRushRubric(
  cycleId: string,
  input: RushRubricSaveWrite
): Promise<ClientRubricCategory[]> {
  await db.transaction(async (tx) => {
    const existing = await tx
      .select()
      .from(rubricCategories)
      .where(and(eq(rubricCategories.cycleId, cycleId), isNull(rubricCategories.archivedAt)))

    const keepIds = input.categories
      .map((category) => category.id)
      .filter((id): id is string => Boolean(id))
    const removeIds = existing.map((row) => row.id).filter((id) => !keepIds.includes(id))

    if (removeIds.length) {
      const scored = await tx
        .selectDistinct({ categoryId: reviewScores.categoryId })
        .from(reviewScores)
        .where(inArray(reviewScores.categoryId, removeIds))
      const scoredIds = new Set(scored.map((row) => row.categoryId))
      const archiveIds = removeIds.filter((id) => scoredIds.has(id))
      const deleteIds = removeIds.filter((id) => !scoredIds.has(id))

      if (archiveIds.length) {
        await tx
          .update(rubricCategories)
          .set({ archivedAt: new Date().toISOString() })
          .where(
            and(eq(rubricCategories.cycleId, cycleId), inArray(rubricCategories.id, archiveIds))
          )
      }
      if (deleteIds.length) {
        await tx
          .delete(rubricCategories)
          .where(
            and(eq(rubricCategories.cycleId, cycleId), inArray(rubricCategories.id, deleteIds))
          )
      }
    }

    for (const [index, category] of input.categories.entries()) {
      const ratingLabels = (category.rating_labels ?? null) as RubricRatingLabels | null
      const values = {
        title: category.title,
        description: category.description ?? null,
        sortOrder: index,
        scaleMin: category.scale_min,
        scaleMax: category.scale_max,
        ratingLabels,
        archivedAt: null,
      }

      if (category.id) {
        await tx
          .update(rubricCategories)
          .set(values)
          .where(and(eq(rubricCategories.id, category.id), eq(rubricCategories.cycleId, cycleId)))
      } else {
        await tx.insert(rubricCategories).values({
          cycleId,
          ...values,
        })
      }
    }
  })

  return listRubricCategoriesForCycle(cycleId)
}
