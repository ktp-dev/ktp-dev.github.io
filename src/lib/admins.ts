import { asc, count, eq } from 'drizzle-orm'
import { db } from '@/db'
import { admins } from '@/db/schema'

export type ClientAdmin = {
  email: string
  created_at: string
}

export function toClientAdmin(row: typeof admins.$inferSelect): ClientAdmin {
  return {
    email: row.email,
    created_at: row.createdAt,
  }
}

export async function listAdmins() {
  const rows = await db.select().from(admins).orderBy(asc(admins.email))
  return rows.map(toClientAdmin)
}

export async function addAdminEmail(email: string) {
  const [existing] = await db.select().from(admins).where(eq(admins.email, email)).limit(1)
  if (existing) return { admin: null, error: 'That email is already an admin' as const }

  const [created] = await db.insert(admins).values({ email }).returning()
  return { admin: created ? toClientAdmin(created) : null, error: null }
}

export async function removeAdminEmail(email: string, actorEmail: string) {
  if (email === actorEmail.toLowerCase()) {
    return { error: 'You cannot remove yourself' as const }
  }

  const [total] = await db.select({ value: count() }).from(admins)
  if ((total?.value ?? 0) <= 1) {
    return { error: 'Keep at least one admin' as const }
  }

  const deleted = await db.delete(admins).where(eq(admins.email, email)).returning()
  if (!deleted.length) return { error: 'Admin not found' as const }
  return { error: null }
}
