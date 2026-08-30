'use server'

import { randomUUID } from 'crypto'
import { createPresignedPutUrl, headS3Object } from '@/lib/s3'
import { checkIsAdmin } from '@/lib/supabase/auth-helpers'

const DEBUG_PDF_MAX_BYTES = 10 * 1024 * 1024
const DEBUG_PDF_MIME = 'application/pdf'

async function requireAdmin() {
  const user = await checkIsAdmin()
  if (!user) {
    return { error: 'Unauthorized: Admin access required' as const, user: null }
  }
  return { error: null, user }
}

function debugKeyForUser(userId: string) {
  return `debug/${userId}/${randomUUID()}.pdf`
}

function isOwnedDebugKey(key: string, userId: string) {
  return key.startsWith(`debug/${userId}/`) && key.endsWith('.pdf') && !key.includes('..')
}

export async function debugPresignPdfUpload(input: { contentType: string; sizeBytes: number }) {
  const auth = await requireAdmin()
  if (auth.error || !auth.user) {
    return { error: auth.error, uploadUrl: null, key: null, bucket: null }
  }

  if (input.contentType !== DEBUG_PDF_MIME) {
    return { error: 'Only PDF files are allowed.', uploadUrl: null, key: null, bucket: null }
  }

  if (input.sizeBytes <= 0 || input.sizeBytes > DEBUG_PDF_MAX_BYTES) {
    return {
      error: `File must be between 1 byte and ${DEBUG_PDF_MAX_BYTES / (1024 * 1024)} MB.`,
      uploadUrl: null,
      key: null,
      bucket: null,
    }
  }

  const key = debugKeyForUser(auth.user.id)
  const presigned = await createPresignedPutUrl({
    key,
    contentType: DEBUG_PDF_MIME,
  })

  if (presigned.error || !presigned.uploadUrl) {
    return { error: presigned.error, uploadUrl: null, key: null, bucket: null }
  }

  return {
    error: null,
    uploadUrl: presigned.uploadUrl,
    key,
    bucket: presigned.bucket,
  }
}

export async function debugVerifyS3Upload(key: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.user) {
    return { error: auth.error, object: null }
  }

  if (!isOwnedDebugKey(key, auth.user.id)) {
    return { error: 'Invalid key.', object: null }
  }

  return headS3Object(key)
}
