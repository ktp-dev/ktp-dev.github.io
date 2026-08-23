'use server'

import { revalidatePath } from 'next/cache'
import { checkIsAdmin, requireUser } from '@/lib/supabase/auth-helpers'
import { getBrotherByUmichEmail } from '@/lib/brothers'
import {
  cycleWindow,
  deleteApplicationFileRecord,
  getActiveCycle,
  getApplicationFileForSlot,
  getApplicationFiles,
  getCycleQuestions,
  getOrCreateApplication,
  saveApplicationAnswers,
  saveApplicationFields,
  saveApplicationFileRecord,
  submitApplication,
} from '@/lib/applications'
import { parseApplicationAnswers, parseApplicationFields, parseSubmitPayload } from '@/lib/apply-schema'
import { resolveUploadMime, validateApplyFile } from '@/lib/apply-files'
import { buildApplicationFileKey, isApplicationFileKey, isDeletableS3ObjectKey } from '@/lib/apply-s3'
import { createPresignedPutUrl, deleteS3Object, headS3Object } from '@/lib/s3'
import { FILE_SLOTS, type FileSlot } from '@/lib/apply-steps'

async function requireDraftOwner() {
  const user = await requireUser()
  if (!user?.email) return { error: 'Please log in with your UMich Google account.' as const }

  const isAdmin = await checkIsAdmin()
  if (!isAdmin && (await getBrotherByUmichEmail(user.email))) {
    return { error: 'Brothers cannot submit a rush application.' as const }
  }

  const cycle = await getActiveCycle()
  if (!cycle) return { error: 'Applications are not open.' as const }

  const window = cycleWindow(cycle)
  const application = await getOrCreateApplication({
    cycleId: cycle.id,
    userId: user.id,
    email: user.email,
  })

  if (application.status === 'submitted') {
    return { error: 'This application has already been submitted.' as const }
  }
  if (!window.isOpen && !isAdmin) {
    return { error: 'This application cycle is not open for edits.' as const }
  }

  return { user, cycle, application, error: null }
}

function validateFileInput(input: {
  slot: string
  filename: string
  mimeType: string
  sizeBytes: number
}) {
  if (!FILE_SLOTS.includes(input.slot as FileSlot)) {
    return { error: 'Invalid file slot' as const, slot: null, contentType: null }
  }
  if (!input.filename.trim()) {
    return { error: 'Choose a file first' as const, slot: null, contentType: null }
  }

  const slot = input.slot as FileSlot
  const fileCheck = validateApplyFile({
    slot,
    filename: input.filename,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
  })
  if (fileCheck.error) {
    return { error: fileCheck.error, slot: null, contentType: null }
  }

  const contentType = resolveUploadMime({
    slot,
    mimeType: input.mimeType,
    filename: input.filename,
  })
  if (!contentType) {
    return { error: 'Unsupported file type.', slot: null, contentType: null }
  }

  return { error: null, slot, contentType }
}

export async function presignApplyFileUpload(input: {
  slot: string
  filename: string
  mimeType: string
  sizeBytes: number
}) {
  const auth = await requireDraftOwner()
  if (auth.error) {
    return { error: auth.error, uploadUrl: null, key: null }
  }

  const parsed = validateFileInput(input)
  if (parsed.error || !parsed.slot || !parsed.contentType) {
    return { error: parsed.error, uploadUrl: null, key: null }
  }

  const key = buildApplicationFileKey(auth.application.id, parsed.slot, parsed.contentType)
  const presigned = await createPresignedPutUrl({
    key,
    contentType: parsed.contentType,
  })
  if (presigned.error || !presigned.uploadUrl) {
    return { error: presigned.error ?? 'Could not prepare upload.', uploadUrl: null, key: null }
  }

  return { error: null, uploadUrl: presigned.uploadUrl, key }
}

export async function confirmApplyFileUpload(input: {
  slot: string
  key: string
  filename: string
  mimeType: string
  sizeBytes: number
}) {
  const auth = await requireDraftOwner()
  if (auth.error) {
    return { error: auth.error, file: null }
  }

  const parsed = validateFileInput(input)
  if (parsed.error || !parsed.slot || !parsed.contentType) {
    return { error: parsed.error, file: null }
  }
  if (!isApplicationFileKey(input.key, auth.application.id, parsed.slot)) {
    return { error: 'Invalid upload key.', file: null }
  }

  const object = await headS3Object(input.key)
  if (object.error || !object.object) {
    return { error: 'Upload not found in storage. Try again.', file: null }
  }
  if (object.object.sizeBytes !== input.sizeBytes) {
    return { error: 'Uploaded file size does not match.', file: null }
  }

  const previous = await getApplicationFileForSlot(auth.application.id, parsed.slot)
  const saved = await saveApplicationFileRecord({
    applicationId: auth.application.id,
    slot: parsed.slot,
    s3Key: input.key,
    mimeType: parsed.contentType,
    sizeBytes: input.sizeBytes,
    originalFilename: input.filename.trim(),
  })

  if (
    previous?.s3Key &&
    previous.s3Key !== input.key &&
    isDeletableS3ObjectKey(previous.s3Key)
  ) {
    await deleteS3Object(previous.s3Key)
  }

  revalidatePath('/apply')
  return {
    error: null,
    file: {
      slot: saved.slot,
      filename: saved.originalFilename,
    },
  }
}

export async function saveApplyDraft(input: {
  fields: unknown
  answers: Record<string, string>
}) {
  const auth = await requireDraftOwner()
  if (auth.error) return { error: auth.error }

  const parsed = parseApplicationFields(input.fields)
  if (parsed.error || !parsed.data) return { error: parsed.error }

  const saved = await saveApplicationFields(auth.application.id, auth.user.id, parsed.data)
  if (!saved) return { error: 'Could not save. The application may already be submitted.' }

  const questions = await getCycleQuestions(auth.cycle.id)
  const parsedAnswers = parseApplicationAnswers(input.answers, questions)
  if (parsedAnswers.error || !parsedAnswers.data) {
    return { error: parsedAnswers.error }
  }

  await saveApplicationAnswers(auth.application.id, parsedAnswers.data)

  revalidatePath('/apply')
  return { error: null }
}

export async function deleteApplyDummyFile(slot: string) {
  const auth = await requireDraftOwner()
  if (auth.error) return { error: auth.error }

  if (!FILE_SLOTS.includes(slot as FileSlot)) {
    return { error: 'Invalid file slot' }
  }

  const fileSlot = slot as FileSlot
  const removed = await deleteApplicationFileRecord(auth.application.id, fileSlot)
  if (removed?.s3Key && isDeletableS3ObjectKey(removed.s3Key)) {
    await deleteS3Object(removed.s3Key)
  }

  revalidatePath('/apply')
  return { error: null }
}

export async function submitApply(input: {
  fields: unknown
  answers: Record<string, string>
}) {
  const auth = await requireDraftOwner()
  if (auth.error) return { error: auth.error }

  const parsedFields = parseApplicationFields(input.fields)
  if (parsedFields.error || !parsedFields.data) return { error: parsedFields.error }

  const questions = await getCycleQuestions(auth.cycle.id)
  const files = await getApplicationFiles(auth.application.id)
  const fileMap = Object.fromEntries(
    files.map((file) => [file.slot, file.originalFilename])
  ) as Partial<Record<FileSlot, string>>

  const submitCheck = parseSubmitPayload({
    fields: parsedFields.data,
    answers: input.answers,
    files: fileMap,
    questions: questions.map((question) => ({
      id: question.id,
      prompt: question.prompt,
      maxWords: question.maxWords,
      required: question.required,
    })),
    hearAboutOptions: auth.cycle.hearAboutOptions ?? [],
  })
  if (submitCheck.error) return { error: submitCheck.error }

  const parsedAnswers = parseApplicationAnswers(input.answers, questions)
  if (parsedAnswers.error || !parsedAnswers.data) {
    return { error: parsedAnswers.error }
  }

  const saved = await saveApplicationFields(
    auth.application.id,
    auth.user.id,
    parsedFields.data
  )
  if (!saved) return { error: 'Could not save before submit.' }

  await saveApplicationAnswers(auth.application.id, parsedAnswers.data)

  const submitted = await submitApplication(auth.application.id, auth.user.id)
  if (!submitted) return { error: 'Submit failed. You may have already submitted.' }

  revalidatePath('/apply')
  return { error: null }
}
