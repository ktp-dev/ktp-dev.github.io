import { redirect } from 'next/navigation'
import {
  cycleWindow,
  fieldsFromRow,
  getActiveCycle,
  getApplicationAnswers,
  getApplicationFiles,
  getCycleQuestions,
  getOrCreateApplication,
} from '@/lib/applications'
import type { FileSlot } from '@/lib/apply-steps'
import { getBrotherByUmichEmail } from '@/lib/brothers'
import { requireUser } from '@/lib/supabase/auth-helpers'

const emptyFiles = {} as Partial<Record<FileSlot, string>>
const emptyAnswers = {} as Record<string, string>

export async function loadApplyContext() {
  const user = await requireUser()
  const cycle = await getActiveCycle()
  const isBrother = Boolean(user?.email && (await getBrotherByUmichEmail(user.email)))

  if (!user) {
    return {
      user: null,
      isBrother: false,
      cycle,
      application: null,
      questions: [],
      answers: emptyAnswers,
      files: emptyFiles,
      window: cycle ? cycleWindow(cycle) : null,
    }
  }

  const signedIn = { id: user.id, email: user.email! }

  if (isBrother || !cycle) {
    return {
      user: signedIn,
      isBrother,
      cycle,
      application: null,
      questions: [],
      answers: emptyAnswers,
      files: emptyFiles,
      window: cycle ? cycleWindow(cycle) : null,
    }
  }

  const application = await getOrCreateApplication({
    cycleId: cycle.id,
    userId: user.id,
    email: user.email!,
  })
  const questions = await getCycleQuestions(cycle.id)
  const answerRows = await getApplicationAnswers(application.id)
  const fileRows = await getApplicationFiles(application.id)

  return {
    user: signedIn,
    isBrother: false,
    cycle,
    application: {
      id: application.id,
      status: application.status,
      submittedAt: application.submittedAt,
      fields: fieldsFromRow(application),
    },
    questions: questions.map((question) => ({
      id: question.id,
      prompt: question.prompt,
      helpText: question.helpText,
      maxWords: question.maxWords,
      required: question.required,
      sortOrder: question.sortOrder,
    })),
    answers: Object.fromEntries(
      answerRows.map((row) => [row.questionId, row.body ?? ''])
    ) as Record<string, string>,
    files: Object.fromEntries(
      fileRows.map((row) => [row.slot, row.originalFilename ?? row.s3Key])
    ) as Partial<Record<FileSlot, string>>,
    window: cycleWindow(cycle),
  }
}

export async function requireApplyDraft() {
  const ctx = await loadApplyContext()
  if (ctx.isBrother) redirect('/apply')
  if (!ctx.user || !ctx.cycle || !ctx.application) redirect('/apply')
  if (ctx.application.status === 'submitted') redirect('/apply')
  if (ctx.window && !ctx.window.isOpen) redirect('/apply')
  return {
    user: ctx.user,
    cycle: ctx.cycle,
    application: ctx.application,
    questions: ctx.questions,
    answers: ctx.answers,
    files: ctx.files,
    window: ctx.window,
  }
}
