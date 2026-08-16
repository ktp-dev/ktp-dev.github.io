import 'server-only'

import { and, asc, eq, ne, sql } from 'drizzle-orm'
import { db } from '@/db'
import { admins, brothers } from '@/db/schema'
import type { BrotherWrite, ClientBrother } from '@/lib/brother-schema'

export type { ClientBrother }

export function toClientBrother(row: typeof brothers.$inferSelect): ClientBrother {
  return {
    id: row.id,
    first_name: row.firstName,
    last_name: row.lastName,
    umich_email: row.umichEmail,
    contact_email: row.contactEmail,
    linkedin_url: row.linkedinUrl,
    photo_filename: row.photoFilename,
    status: row.status,
    pledge_class: row.pledgeClass,
  }
}

export function brotherDisplayName(brother: ClientBrother, fallbackEmail: string) {
  const name = [brother.first_name, brother.last_name].filter(Boolean).join(' ').trim()
  return name || fallbackEmail
}

export async function getBrotherByUmichEmail(email: string) {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return null
  const [row] = await db
    .select()
    .from(brothers)
    .where(eq(brothers.umichEmail, normalized))
    .limit(1)
  return row ? toClientBrother(row) : null
}

export async function listBrothers() {
  const rows = await db
    .select()
    .from(brothers)
    .orderBy(
      sql`lower(coalesce(${brothers.firstName}, ''))`,
      sql`lower(coalesce(${brothers.lastName}, ''))`,
      asc(brothers.umichEmail)
    )
  return rows.map(toClientBrother)
}

function writeValues(input: BrotherWrite) {
  return {
    firstName: input.first_name,
    lastName: input.last_name,
    umichEmail: input.umich_email,
    pledgeClass: input.pledge_class,
    linkedinUrl: input.linkedin_url,
    photoFilename: input.photo_filename,
  }
}

async function umichEmailTaken(email: string, exceptId?: string) {
  const [existing] = await db
    .select({ id: brothers.id })
    .from(brothers)
    .where(
      exceptId
        ? and(eq(brothers.umichEmail, email), ne(brothers.id, exceptId))
        : eq(brothers.umichEmail, email)
    )
    .limit(1)
  return Boolean(existing)
}

export async function addBrotherRow(input: BrotherWrite) {
  if (await umichEmailTaken(input.umich_email)) {
    return { brother: null, error: 'That UMich email is already a brother' as const }
  }

  const [created] = await db
    .insert(brothers)
    .values({
      ...writeValues(input),
      status: 'active',
    })
    .returning()

  return { brother: created ? toClientBrother(created) : null, error: null }
}

export async function updateBrotherRow(id: string, input: BrotherWrite) {
  const [row] = await db.select({ id: brothers.id }).from(brothers).where(eq(brothers.id, id)).limit(1)
  if (!row) return { brother: null, error: 'Brother not found' as const }

  if (await umichEmailTaken(input.umich_email, id)) {
    return { brother: null, error: 'That UMich email is already a brother' as const }
  }

  const [updated] = await db
    .update(brothers)
    .set(writeValues(input))
    .where(eq(brothers.id, id))
    .returning()

  return { brother: updated ? toClientBrother(updated) : null, error: null }
}

export async function removeBrotherRow(id: string, actorEmail: string) {
  const [row] = await db.select().from(brothers).where(eq(brothers.id, id)).limit(1)
  if (!row) return { error: 'Brother not found' as const }
  if (row.umichEmail && row.umichEmail === actorEmail.toLowerCase()) {
    return { error: 'You cannot remove yourself' as const }
  }
  if (row.umichEmail) {
    const [admin] = await db.select({ email: admins.email }).from(admins).where(eq(admins.email, row.umichEmail)).limit(1)
    if (admin) return { error: 'Remove their admin access first' as const }
  }

  const deleted = await db.delete(brothers).where(eq(brothers.id, id)).returning()
  if (!deleted.length) return { error: 'Brother not found' as const }
  return { error: null }
}
