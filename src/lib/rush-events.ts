import { asc } from 'drizzle-orm'
import { db, rushEvents } from '@/db'

export async function getRushEvents() {
  return db.select().from(rushEvents).orderBy(asc(rushEvents.orderIndex))
}
