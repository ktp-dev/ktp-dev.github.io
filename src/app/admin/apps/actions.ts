'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { applications, rushCycles } from '@/db/schema'
import { checkIsAdmin } from '@/lib/supabase/auth-helpers'
import {
  buildApplicationsExportCsv,
  deleteApplicationForAdmin,
  getApplicationReviewDetailsForAdmin,
  listApplicationsForAdmin,
  type AdminApplicationSortKey,
} from '@/lib/admin-applications'
import {
  addReviewAccessEntry,
  listReviewAccessForCycle,
  removeReviewAccessEntry,
  updateReviewAccessMinimum,
} from '@/lib/review-access-admin'
import { getApplicationFileForSlot } from '@/lib/applications'
import { isApplicationFileKey } from '@/lib/apply-s3'
import { FILE_SLOTS, type FileSlot } from '@/lib/apply-steps'
import { createPresignedGetUrl } from '@/lib/s3'

async function requireAdmin() {
  const user = await checkIsAdmin()
  if (!user) return { error: 'Unauthorized: Admin access required' as const, user: null }
  return { error: null, user }
}

function revalidateApps() {
  revalidatePath('/admin/apps')
  revalidatePath('/admin')
  revalidatePath('/portal/reads')
}

export async function listApplicationsForAdminAction(cycleId: string) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error, applications: null }
  if (!cycleId) return { error: 'Missing cycle.', applications: null }

  const applications = await listApplicationsForAdmin(cycleId)
  return { error: null, applications }
}

export async function exportApplicationsCsvAction(
  cycleId: string,
  cycleName: string,
  options?: { query?: string; sort?: AdminApplicationSortKey }
) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error, csv: null, filename: null }
  if (!cycleId) return { error: 'Missing cycle.', csv: null, filename: null }

  const csv = await buildApplicationsExportCsv(cycleId, cycleName, options)
  const slug = cycleName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return {
    error: null,
    csv,
    filename: `${slug || 'rush'}-applications.csv`,
  }
}

export async function listReviewAccessAction(cycleId: string) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error, entries: null }
  if (!cycleId) return { error: 'Missing cycle.', entries: null }

  const entries = await listReviewAccessForCycle(cycleId)
  return { error: null, entries }
}

export async function addReviewAccessAction(input: {
  cycleId: string
  email: string
  minRequiredReviews?: number
}) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error, entry: null }

  const result = await addReviewAccessEntry(input)
  if (result.error) return { error: result.error, entry: null }

  revalidateApps()
  return { error: null, entry: result.entry }
}

export async function removeReviewAccessAction(id: string, cycleId: string) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }

  const result = await removeReviewAccessEntry(id, cycleId)
  if (result.error) return { error: result.error }

  revalidateApps()
  return { error: null }
}

export async function updateReviewAccessMinimumAction(input: {
  id: string
  cycleId: string
  minRequiredReviews: number
}) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error, entry: null }

  const result = await updateReviewAccessMinimum(input)
  if (result.error) return { error: result.error, entry: null }

  revalidateApps()
  return { error: null, entry: result.entry }
}

export async function getApplicationDetailAction(cycleId: string, applicationId: string) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error, detail: null }
  if (!cycleId || !applicationId) return { error: 'Missing application.', detail: null }

  const detail = await getApplicationReviewDetailsForAdmin(cycleId, applicationId)
  if (!detail) return { error: 'Application not found.', detail: null }
  return { error: null, detail }
}

export async function deleteApplicationAction(cycleId: string, applicationId: string) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }
  if (!cycleId || !applicationId) return { error: 'Missing application.' }

  const result = await deleteApplicationForAdmin(cycleId, applicationId)
  if (result.error) return { error: result.error }

  revalidateApps()
  revalidatePath(`/admin/apps/${applicationId}`)
  return { error: null }
}

export async function getAdminApplicationFileDownloadUrl(input: {
  applicationId: string
  slot: string
}) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error, downloadUrl: null }
  if (!input.applicationId) return { error: 'Missing application.', downloadUrl: null }
  if (!FILE_SLOTS.includes(input.slot as FileSlot)) {
    return { error: 'Invalid file slot.' as const, downloadUrl: null }
  }

  const fileSlot = input.slot as FileSlot
  const [app] = await db
    .select({
      id: applications.id,
      cycleName: rushCycles.name,
    })
    .from(applications)
    .innerJoin(rushCycles, eq(rushCycles.id, applications.cycleId))
    .where(eq(applications.id, input.applicationId))
    .limit(1)

  if (!app) return { error: 'Application not found.', downloadUrl: null }

  const file = await getApplicationFileForSlot(app.id, fileSlot)
  if (!file?.s3Key) return { error: 'File not found.', downloadUrl: null }

  if (!isApplicationFileKey(file.s3Key, app.id, fileSlot, app.cycleName)) {
    return { error: 'Invalid file.', downloadUrl: null }
  }

  const presigned = await createPresignedGetUrl({
    key: file.s3Key,
    filename: file.originalFilename?.trim() || fileSlot,
    contentType: file.mimeType,
  })
  if (presigned.error || !presigned.downloadUrl) {
    return { error: presigned.error ?? 'Could not prepare download.', downloadUrl: null }
  }

  return { error: null, downloadUrl: presigned.downloadUrl }
}
