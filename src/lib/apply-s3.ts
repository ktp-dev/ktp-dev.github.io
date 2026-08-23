import 'server-only'

import { randomUUID } from 'crypto'
import type { FileSlot } from '@/lib/apply-steps'

const MIME_EXTENSION: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export function buildApplicationFileKey(
  applicationId: string,
  slot: FileSlot,
  contentType: string
) {
  const ext = MIME_EXTENSION[contentType]
  if (!ext) {
    throw new Error('Unsupported content type for S3 key')
  }
  return `applications/${applicationId}/${slot}/${randomUUID()}.${ext}`
}

export function isApplicationFileKey(key: string, applicationId: string, slot: FileSlot) {
  const prefix = `applications/${applicationId}/${slot}/`
  if (!key.startsWith(prefix) || key.includes('..')) {
    return false
  }
  const suffix = key.slice(prefix.length)
  return suffix.length > 0 && !suffix.includes('/')
}

export function isDeletableS3ObjectKey(key: string) {
  return key.startsWith('applications/') && !key.includes('..')
}
