import type { FileSlot } from '@/lib/apply-steps'

const PDF_SLOTS = new Set<FileSlot>(['transcript', 'resume', 'resume_anonymized'])

const PDF_MIMES = new Set(['application/pdf'])
const IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const PDF_EXTENSIONS = new Set(['.pdf'])
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])

export const APPLY_PDF_MAX_BYTES = 5 * 1024 * 1024
export const APPLY_IMAGE_MAX_BYTES = 10 * 1024 * 1024

function fileExtension(filename: string) {
  const dot = filename.lastIndexOf('.')
  return dot >= 0 ? filename.slice(dot).toLowerCase() : ''
}

function isGenericMime(mime: string) {
  return !mime || mime === 'application/octet-stream'
}

function pdfAllowed(mime: string, ext: string) {
  if (PDF_MIMES.has(mime)) return true
  if (PDF_EXTENSIONS.has(ext) && (isGenericMime(mime) || PDF_MIMES.has(mime))) return true
  return PDF_EXTENSIONS.has(ext)
}

function imageAllowed(mime: string, ext: string) {
  if (IMAGE_MIMES.has(mime)) return true
  if (IMAGE_EXTENSIONS.has(ext) && (isGenericMime(mime) || IMAGE_MIMES.has(mime))) return true
  return IMAGE_EXTENSIONS.has(ext)
}

function maxSizeLabel(bytes: number) {
  return `${bytes / (1024 * 1024)} MB`
}

export function fileAcceptForSlot(slot: FileSlot) {
  if (PDF_SLOTS.has(slot)) {
    return 'application/pdf,.pdf'
  }
  return 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp'
}

export function validateApplyFile(input: {
  slot: FileSlot
  filename: string
  mimeType: string
  sizeBytes: number
}) {
  const filename = input.filename.trim()
  if (!filename) {
    return { error: 'Choose a file first.' }
  }

  const mime = input.mimeType.trim().toLowerCase()
  const ext = fileExtension(filename)
  const isPdf = PDF_SLOTS.has(input.slot)
  const maxBytes = isPdf ? APPLY_PDF_MAX_BYTES : APPLY_IMAGE_MAX_BYTES
  const maxLabel = maxSizeLabel(maxBytes)
  const typeLabel = isPdf ? 'PDF' : 'JPEG, PNG, or WebP image'

  if (input.sizeBytes <= 0) {
    return { error: 'That file appears to be empty.' }
  }
  if (input.sizeBytes > maxBytes) {
    return { error: `File must be ${maxLabel} or smaller.` }
  }

  const allowed = isPdf ? pdfAllowed(mime, ext) : imageAllowed(mime, ext)
  if (!allowed) {
    return { error: `Please upload a ${typeLabel}.` }
  }

  return { error: null }
}
