import { asc, eq } from 'drizzle-orm'
import { db, rushEvents } from '@/db'
import type { RushEventWrite } from '@/lib/rush-event-schema'

export type { RushEventWrite }

export async function getRushEvents() {
  return db.select().from(rushEvents).orderBy(asc(rushEvents.orderIndex))
}

function toWriteValues(event: RushEventWrite) {
  return {
    title: event.title,
    datetime: event.datetime,
    location: event.location,
    description: event.description,
    buttonLabel: event.button_label,
    buttonUrl: event.button_url,
    orderIndex: event.order_index,
  }
}

export function toClientRushEvent(event: typeof rushEvents.$inferSelect) {
  return {
    id: event.id,
    title: event.title,
    datetime: event.datetime,
    location: event.location,
    description: event.description,
    button_label: event.buttonLabel,
    button_url: event.buttonUrl,
    order_index: event.orderIndex,
  }
}

export type ClientRushEvent = ReturnType<typeof toClientRushEvent>

export async function createRushEvent(event: RushEventWrite) {
  const [created] = await db
    .insert(rushEvents)
    .values(toWriteValues(event))
    .returning()
  return created
}

export async function patchRushEvent(eventId: string, event: RushEventWrite) {
  const [updated] = await db
    .update(rushEvents)
    .set(toWriteValues(event))
    .where(eq(rushEvents.id, eventId))
    .returning()
  return updated
}

export async function removeRushEvent(eventId: string) {
  await db.transaction(async (tx) => {
    const existing = await tx
      .select({ id: rushEvents.id })
      .from(rushEvents)
      .where(eq(rushEvents.id, eventId))

    if (existing.length === 0) {
      throw new Error('Event not found')
    }

    await tx.delete(rushEvents).where(eq(rushEvents.id, eventId))

    const remaining = await tx
      .select({ id: rushEvents.id })
      .from(rushEvents)
      .orderBy(asc(rushEvents.orderIndex))

    for (const [index, event] of remaining.entries()) {
      await tx
        .update(rushEvents)
        .set({ orderIndex: index })
        .where(eq(rushEvents.id, event.id))
    }
  })
}

export async function reorderRushEvents(
  orderUpdates: Array<{ id: string; order_index: number }>
) {
  await db.transaction(async (tx) => {
    for (const update of orderUpdates) {
      await tx
        .update(rushEvents)
        .set({ orderIndex: update.order_index })
        .where(eq(rushEvents.id, update.id))
    }
  })
}
