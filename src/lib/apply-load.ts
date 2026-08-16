import { redirect } from 'next/navigation'
import {
  cycleWindow,
  fieldsFromRow,
  getActiveCycle,
  getApplicationAnswers,
  getApplicationFiles,
  getCycleById,
  getCycleQuestions,
  getOrCreateApplication,
} from '@/lib/applications'
import type { ApplicationFields } from '@/lib/apply-schema'
import type { FileSlot } from '@/lib/apply-steps'
import { getBrotherByUmichEmail } from '@/lib/brothers'
import { checkIsAdmin, requireUser } from '@/lib/supabase/auth-helpers'

const emptyFiles = {} as Partial<Record<FileSlot, string>>
const emptyAnswers = {} as Record<string, string>
const emptyFields: ApplicationFields = {
  first_name: null,
  last_name: null,
  preferred_name: null,
  pronouns: null,
  phone: null,
  majors: null,
  minors: null,
  graduation_year: null,
  gpa: null,
  semesters_remaining: null,
  other_professional_fraternity: null,
  campus_activities: null,
  hear_about: [],
  hear_about_other: null,
  anything_else: null,
  rush_feedback: null,
}

const previewApplication = {
  id: 'preview',
  status: 'draft' as const,
  submittedAt: null,
  fields: emptyFields,
}

export async function loadApplyContext(options?: { preview?: boolean; cycleId?: string }) {
  const user = await requireUser()
  const wantPreview = Boolean(options?.preview)
  const adminUser = wantPreview ? await checkIsAdmin() : null
  const isPreview = Boolean(wantPreview && adminUser)

  const cycle = isPreview
    ? options?.cycleId
      ? await getCycleById(options.cycleId)
      : await getActiveCycle()
    : await getActiveCycle()
  const isBrother = Boolean(user?.email && (await getBrotherByUmichEmail(user.email)))

  if (!user) {
    return {
      user: null,
      isBrother: false,
      isPreview: false,
      cycle,
      application: null,
      questions: [],
      answers: emptyAnswers,
      files: emptyFiles,
      window: cycle ? cycleWindow(cycle) : null,
    }
  }

  const signedIn = { id: user.id, email: user.email! }

  if (isPreview && cycle) {
    const questions = await getCycleQuestions(cycle.id)
    return {
      user: signedIn,
      isBrother,
      isPreview: true,
      cycle,
      application: previewApplication,
      questions: questions.map((question) => ({
        id: question.id,
        prompt: question.prompt,
        helpText: question.helpText,
        maxWords: question.maxWords,
        required: question.required,
        sortOrder: question.sortOrder,
      })),
      answers: emptyAnswers,
      files: emptyFiles,
      window: cycleWindow(cycle),
    }
  }

  if (isBrother || !cycle) {
    return {
      user: signedIn,
      isBrother,
      isPreview: false,
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
    isPreview: false,
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

export async function requireApplyDraft(options?: { preview?: boolean; cycleId?: string }) {
  const ctx = await loadApplyContext(options)
  if (ctx.isPreview) {
    if (!ctx.cycle || !ctx.application) redirect('/admin')
    return {
      user: ctx.user!,
      cycle: ctx.cycle,
      application: ctx.application,
      questions: ctx.questions,
      answers: ctx.answers,
      files: ctx.files,
      window: ctx.window,
      isPreview: true as const,
    }
  }
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
    isPreview: false as const,
  }
}
