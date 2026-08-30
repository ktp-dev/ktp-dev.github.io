import { asc, count, eq, sql } from 'drizzle-orm'
import { db } from '@/db'
import { admins, brothers } from '@/db/schema'

export type ClientAdmin = {
  email: string
  created_at: string
  first_name: string | null
  last_name: string | null
}

export function toClientAdmin(
  row: typeof admins.$inferSelect,
  brother?: { firstName: string | null; lastName: string | null } | null
): ClientAdmin {
  return {
    email: row.email,
    created_at: row.createdAt,
    first_name: brother?.firstName ?? null,
    last_name: brother?.lastName ?? null,
  }
}

export async function listAdmins() {
  const rows = await db
    .select({
      admin: admins,
      firstName: brothers.firstName,
      lastName: brothers.lastName,
    })
    .from(admins)
    .leftJoin(brothers, eq(brothers.umichEmail, admins.email))
    .orderBy(
      sql`lower(coalesce(${brothers.firstName}, ''))`,
      sql`lower(coalesce(${brothers.lastName}, ''))`,
      asc(admins.email)
    )

  return rows.map((row) => toClientAdmin(row.admin, { firstName: row.firstName, lastName: row.lastName }))
}

export async function addAdminEmail(email: string) {
  const [existing] = await db.select().from(admins).where(eq(admins.email, email)).limit(1)
  if (existing) return { admin: null, error: 'That email is already an admin' as const }

  const [brother] = await db
    .select({
      id: brothers.id,
      firstName: brothers.firstName,
      lastName: brothers.lastName,
    })
    .from(brothers)
    .where(eq(brothers.umichEmail, email))
    .limit(1)
  if (!brother) {
    return { admin: null, error: 'No brother found with that UMich email' as const }
  }

  const [created] = await db.insert(admins).values({ email }).returning()
  return { admin: created ? toClientAdmin(created, brother) : null, error: null }
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
