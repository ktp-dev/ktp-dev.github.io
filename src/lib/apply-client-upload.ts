'use client'

import {
  confirmApplyFileUpload,
  presignApplyFileUpload,
} from '@/app/apply/actions'
import { resolveUploadMime } from '@/lib/apply-files'
import type { PendingUpload } from '@/lib/apply-store'
import { FILE_SLOTS, type FileSlot } from '@/lib/apply-steps'

export async function uploadApplyFile(slot: FileSlot, file: File) {
  const presigned = await presignApplyFileUpload({
    slot,
    filename: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  })
  if (presigned.error || !presigned.uploadUrl || !presigned.key) {
    return { error: presigned.error ?? 'Could not prepare upload.' }
  }

  const contentType =
    resolveUploadMime({
      slot,
      mimeType: file.type,
      filename: file.name,
    }) ?? file.type

  const uploadResponse = await fetch(presigned.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': contentType },
  })
  if (!uploadResponse.ok) {
    return { error: 'Upload failed. Try again.' }
  }

  const confirmed = await confirmApplyFileUpload({
    slot,
    key: presigned.key,
    filename: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  })
  if (confirmed.error || !confirmed.file) {
    return { error: confirmed.error ?? 'Could not save upload.' }
  }

  return { error: null, filename: confirmed.file.filename ?? file.name }
}

export async function uploadPendingApplyFiles(
  pending: Partial<Record<FileSlot, PendingUpload>>
) {
  for (const slot of FILE_SLOTS) {
    const entry = pending[slot]
    if (!entry) continue
    const result = await uploadApplyFile(slot, entry.file)
    if (result.error) {
      return { error: result.error }
    }
  }
  return { error: null }
}
