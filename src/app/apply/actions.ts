'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/supabase/auth-helpers'
import { getBrotherByUmichEmail } from '@/lib/brothers'
import {
  cycleWindow,
  getActiveCycle,
  getApplicationFiles,
  getCycleQuestions,
  getOrCreateApplication,
  saveApplicationAnswers,
  saveApplicationFields,
  saveDummyFile,
  deleteDummyFile,
  submitApplication,
} from '@/lib/applications'
import { parseApplicationAnswers, parseApplicationFields, parseSubmitPayload } from '@/lib/apply-schema'
import { FILE_SLOTS, type FileSlot } from '@/lib/apply-steps'

async function requireDraftOwner() {
  const user = await requireUser()
  if (!user?.email) return { error: 'Please log in with your UMich Google account.' as const }

  if (await getBrotherByUmichEmail(user.email)) {
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
  if (!window.isOpen) {
    return { error: 'This application cycle is not open for edits.' as const }
  }

  return { user, cycle, application, error: null }
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

export async function saveApplyDummyFile(input: {
  slot: string
  filename: string
  mimeType: string
  sizeBytes: number
}) {
  const auth = await requireDraftOwner()
  if (auth.error) return { error: auth.error, file: null }

  if (!FILE_SLOTS.includes(input.slot as FileSlot)) {
    return { error: 'Invalid file slot', file: null }
  }
  if (!input.filename.trim()) {
    return { error: 'Choose a file first', file: null }
  }

  const saved = await saveDummyFile({
    applicationId: auth.application.id,
    slot: input.slot as FileSlot,
    filename: input.filename.trim(),
    mimeType: input.mimeType || 'application/octet-stream',
    sizeBytes: input.sizeBytes || 0,
  })

  revalidatePath('/apply')
  return {
    error: null,
    file: {
      slot: saved.slot,
      filename: saved.originalFilename,
    },
  }
}

export async function deleteApplyDummyFile(slot: string) {
  const auth = await requireDraftOwner()
  if (auth.error) return { error: auth.error }

  if (!FILE_SLOTS.includes(slot as FileSlot)) {
    return { error: 'Invalid file slot' }
  }

  await deleteDummyFile(auth.application.id, slot as FileSlot)
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
