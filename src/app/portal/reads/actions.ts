'use server'

import { revalidatePath } from 'next/cache'
import { createPresignedGetUrl } from '@/lib/s3'
import {
  claimNextApplication,
  getAssignedReviewApplication,
  getReviewFileForDownload,
  getReviewerStats,
  renewAssignment,
  requireReviewerSession,
  submitApplicationReview,
} from '@/lib/reviews'

export async function getMyReviewerStatsAction() {
  const session = await requireReviewerSession()
  if (!session.ok) return { error: session.error, stats: null }

  const stats = await getReviewerStats({
    cycleId: session.cycle.id,
    reviewerUserId: session.userId,
    minRequiredReviews: session.minRequiredReviews,
  })
  return { error: null, stats, cycleName: session.cycle.name }
}

export async function getAssignedApplicationAction() {
  const session = await requireReviewerSession()
  if (!session.ok) return { error: session.error, application: null }

  const application = await getAssignedReviewApplication(session.cycle.id, session.userId)
  return { error: null, application }
}

export async function claimNextApplicationAction() {
  const session = await requireReviewerSession()
  if (!session.ok) return { error: session.error, status: null, application: null }

  const result = await claimNextApplication(session.cycle.id, session.userId)
  revalidatePath('/portal/reads')
  return { error: null, status: result.status, application: result.application }
}

export async function renewAssignmentAction(applicationId: string) {
  const session = await requireReviewerSession()
  if (!session.ok) return { error: session.error, renewed: false }

  if (!applicationId) return { error: 'Missing application.', renewed: false }

  const result = await renewAssignment(session.cycle.id, session.userId, applicationId)
  if (!result.renewed) {
    return {
      error:
        result.reason === 'not_owner'
          ? 'This application is not assigned to you.'
          : 'Application not found.',
      renewed: false,
    }
  }
  return { error: null, renewed: true, expiresAtIso: result.expiresAtIso }
}

export async function submitReviewAction(input: {
  applicationId: string
  scores: Record<string, number>
  notes?: string
  startedAt?: string
}) {
  const session = await requireReviewerSession()
  if (!session.ok) {
    return { error: session.error, assignmentReleased: false, nextStatus: null }
  }

  if (!input.applicationId) {
    return { error: 'Missing application.', assignmentReleased: false, nextStatus: null }
  }

  const result = await submitApplicationReview({
    cycleId: session.cycle.id,
    reviewerUserId: session.userId,
    applicationId: input.applicationId,
    scores: input.scores,
    notes: input.notes,
    startedAt: input.startedAt,
  })

  if (result.error) {
    return {
      error: result.error,
      assignmentReleased: result.assignmentReleased ?? false,
      nextStatus: null,
    }
  }

  const claim = await claimNextApplication(session.cycle.id, session.userId)
  revalidatePath('/portal/reads')
  revalidatePath('/portal/reads/review')

  return { error: null, assignmentReleased: false, nextStatus: claim.status }
}

export async function getReviewResumeDownloadUrlAction(
  applicationId: string,
  options?: { disposition?: 'attachment' | 'inline' }
) {
  const session = await requireReviewerSession()
  if (!session.ok) return { error: session.error, downloadUrl: null }

  if (!applicationId) return { error: 'Missing application.', downloadUrl: null }

  const result = await getReviewFileForDownload({
    cycleId: session.cycle.id,
    reviewerUserId: session.userId,
    applicationId,
    isAdmin: session.isAdmin,
  })
  if (result.error || !result.file) {
    return { error: result.error ?? 'No résumé on file.', downloadUrl: null }
  }

  const disposition = options?.disposition ?? 'attachment'
  const presigned = await createPresignedGetUrl({
    key: result.file.s3Key,
    filename: result.file.originalFilename ?? 'resume.pdf',
    contentType: result.file.mimeType ?? 'application/pdf',
    disposition,
    // Preview should last through a typical review session.
    expiresInSeconds: disposition === 'inline' ? 60 * 60 : undefined,
  })
  if (presigned.error || !presigned.downloadUrl) {
    return { error: presigned.error ?? 'Could not prepare download.', downloadUrl: null }
  }

  return { error: null, downloadUrl: presigned.downloadUrl }
}
