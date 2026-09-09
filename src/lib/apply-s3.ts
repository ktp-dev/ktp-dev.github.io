import 'server-only'

import { randomUUID } from 'crypto'
import type { FileSlot } from '@/lib/apply-steps'

const MIME_EXTENSION: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

/** S3 prefix segment from cycle name, e.g. "Fall 2026" → "fall-2026". */
export function cycleStorageSlug(cycleName: string) {
  const slug = cycleName
    .replace(/\s*\(local\)\s*/gi, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'cycle'
}

export function cycleApplicationPrefix(cycleName: string) {
  return `applications/${cycleStorageSlug(cycleName)}/`
}

export function buildApplicationFileKey(
  cycleName: string,
  applicationId: string,
  slot: FileSlot,
  contentType: string
) {
  const ext = MIME_EXTENSION[contentType]
  if (!ext) {
    throw new Error('Unsupported content type for S3 key')
  }
  const cycleSlug = cycleStorageSlug(cycleName)
  return `applications/${cycleSlug}/${applicationId}/${slot}/${randomUUID()}.${ext}`
}

function slotKeySuffix(key: string, prefix: string) {
  if (!key.startsWith(prefix) || key.includes('..')) {
    return null
  }
  const suffix = key.slice(prefix.length)
  if (suffix.length === 0 || suffix.includes('/')) {
    return null
  }
  return suffix
}

export function isApplicationFileKey(
  key: string,
  applicationId: string,
  slot: FileSlot,
  cycleName?: string
) {
  if (cycleName) {
    const cycleSlug = cycleStorageSlug(cycleName)
    const prefixed = slotKeySuffix(
      key,
      `applications/${cycleSlug}/${applicationId}/${slot}/`
    )
    if (prefixed) return true
  }

  // Legacy keys uploaded before cycle folders: applications/{appId}/{slot}/...
  return Boolean(slotKeySuffix(key, `applications/${applicationId}/${slot}/`))
}

export function isDeletableS3ObjectKey(key: string) {
  return key.startsWith('applications/') && !key.includes('..')
}
