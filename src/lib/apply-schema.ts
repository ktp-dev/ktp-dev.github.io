import { z } from 'zod'
import type { ApplyStepSlug, FileSlot } from '@/lib/apply-steps'

const emptyToNull = (value: string | null | undefined) => {
  if (value == null) return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

const optionalText = (max: number) =>
  z.preprocess(
    (value) => (value == null ? null : value),
    z.string().max(max).nullable()
  ).transform((value) => emptyToNull(typeof value === 'string' ? value : null))

export const applicationFieldsSchema = z.object({
  first_name: optionalText(100),
  last_name: optionalText(100),
  preferred_name: optionalText(100),
  pronouns: optionalText(50),
  phone: optionalText(30),
  majors: optionalText(200),
  minors: optionalText(200),
  graduation_year: z.preprocess(
    (value) => (value === '' || value == null ? null : value),
    z.coerce.number().int().min(2024).max(2040).nullable()
  ),
  gpa: z.preprocess(
    (value) => (value === '' || value == null ? null : value),
    z.coerce
      .number()
      .min(0, 'GPA must be between 0 and 4')
      .max(4, 'GPA must be between 0 and 4')
      .nullable()
  ),
  semesters_remaining: z.preprocess(
    (value) => (value === '' || value == null ? null : value),
    z.coerce.number().int().min(0).max(20).nullable()
  ),
  other_professional_fraternity: z.boolean().nullable().optional(),
  campus_activities: optionalText(4000),
  hear_about: z
    .array(z.string())
    .nullish()
    .transform((value) => normalizeStringArray(value)),
  hear_about_other: optionalText(500),
  anything_else: optionalText(4000),
  rush_feedback: optionalText(4000),
})

export type ApplicationFields = z.infer<typeof applicationFieldsSchema>

/** hear_about must stay a string[] in the client store and recap UI. */
export function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
  }
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()]
  }
  return []
}

export function wordCount(text: string) {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
}

export function maxAnswerChars(maxWords: number) {
  return Math.max(2000, maxWords * 20)
}

export function answerLimitError(body: string, maxWords: number) {
  const trimmed = body.trim()
  if (!trimmed) return null
  if (trimmed.length > maxAnswerChars(maxWords) || wordCount(trimmed) > maxWords) {
    return `Keep this answer within ${maxWords} words`
  }
  return null
}

export function parseApplicationAnswers(
  answers: Record<string, string>,
  questions: Array<{ id: string; maxWords: number }>
) {
  const data: { questionId: string; body: string | null }[] = []
  for (const question of questions) {
    if (!Object.hasOwn(answers, question.id)) continue
    const error = answerLimitError(answers[question.id] ?? '', question.maxWords)
    if (error) return { data: null, error }
    data.push({
      questionId: question.id,
      body: (answers[question.id] ?? '').trim() || null,
    })
  }
  return { data, error: null }
}

function hasText(value: string | null | undefined) {
  return Boolean(value && value.trim())
}

const FILE_REQUIRED_MESSAGE: Record<FileSlot, string> = {
  photo: 'Please upload a photo of you.',
  transcript: 'Please upload your transcript.',
  resume: 'Please upload your résumé.',
  resume_anonymized: 'Please upload your anonymized résumé.',
  life_app_screenshot: 'Please upload a screenshot of your KTP Life app profile.',
}

type StepQuestion = { id: string; prompt: string; maxWords: number; required: boolean }

export function validateApplyStep(input: {
  step: ApplyStepSlug
  fields: ApplicationFields
  answers: Record<string, string>
  files: Partial<Record<FileSlot, string | null | undefined>>
  questions: StepQuestion[]
}): string[] {
  const { step, fields, answers, files, questions } = input
  const missing: string[] = []

  if (step === 'personal') {
    if (!hasText(fields.first_name)) missing.push('First name')
    if (!hasText(fields.last_name)) missing.push('Last name')
    if (!hasText(fields.pronouns)) missing.push('Pronouns')
    if (!hasText(fields.phone)) missing.push('Phone number')
    if (!files.photo) missing.push('Photo')
  }

  if (step === 'academic') {
    if (!files.transcript) missing.push('Transcript')
    if (!files.resume) missing.push('Résumé')
    if (!files.resume_anonymized) missing.push('Anonymized résumé')
    if (!hasText(fields.majors)) missing.push('Major(s)')
    if (fields.graduation_year == null) missing.push('Graduation year')
    if (fields.gpa == null) missing.push('GPA')
    if (fields.semesters_remaining == null) missing.push('Semesters remaining on campus')
    if (fields.other_professional_fraternity == null) {
      missing.push('Whether you are in another professional fraternity')
    }
  }

  if (step === 'involvement' && !hasText(fields.campus_activities)) {
    missing.push('Campus activities')
  }

  if (step === 'questions') {
    for (const question of questions) {
      const body = (answers[question.id] ?? '').trim()
      if (question.required && !body) {
        missing.push(question.prompt.length > 80 ? `${question.prompt.slice(0, 80)}…` : question.prompt)
      } else {
        const over = answerLimitError(body, question.maxWords)
        if (over) missing.push(`${over}: ${question.prompt.slice(0, 60)}`)
      }
    }
  }

  if (step === 'additional') {
    if (!fields.hear_about?.length) missing.push('How you heard about KTP')
    const checkedOther = fields.hear_about.some((item) => item.toLowerCase() === 'other')
    if (checkedOther && !hasText(fields.hear_about_other)) {
      missing.push('Please describe how else you heard about KTP')
    }
    if (!files.life_app_screenshot) missing.push('KTP Life app screenshot')
  }

  return missing
}

export function parseApplicationFields(input: unknown) {
  const result = applicationFieldsSchema.safeParse(input)
  if (!result.success) {
    return {
      data: null,
      error: formatApplyError(result.error.issues[0]?.message),
    }
  }
  return { data: result.data, error: null }
}

export function formatApplyError(message: string | undefined) {
  const text = message ?? 'Could not save. Please try again.'
  if (/expected string/i.test(text) || /invalid input/i.test(text)) {
    return 'Some answers could not be saved. Check the highlighted fields and try again.'
  }
  return text
}

export function parseSubmitPayload(input: {
  fields: unknown
  answers: Record<string, string>
  files: Partial<Record<FileSlot, string | null | undefined>>
  questions: { id: string; prompt: string; maxWords: number; required: boolean }[]
  hearAboutOptions: string[]
}) {
  const fieldsResult = applicationFieldsSchema.safeParse(input.fields)
  if (!fieldsResult.success) {
    return { error: formatApplyError(fieldsResult.error.issues[0]?.message) }
  }
  const fields = fieldsResult.data

  const requiredText: [keyof ApplicationFields, string][] = [
    ['first_name', 'First name is required'],
    ['last_name', 'Last name is required'],
    ['pronouns', 'Pronouns are required'],
    ['phone', 'Phone number is required'],
    ['majors', 'Major(s) are required'],
    ['campus_activities', 'Campus activities are required'],
  ]

  for (const [key, message] of requiredText) {
    if (!fields[key]) return { error: message }
  }

  if (fields.graduation_year == null) return { error: 'Graduation year is required' }
  if (fields.gpa == null) return { error: 'GPA is required (enter 0 if this is your first semester)' }
  if (fields.semesters_remaining == null) {
    return { error: 'Semesters remaining is required' }
  }
  if (fields.other_professional_fraternity == null) {
    return { error: 'Please say whether you are in another professional fraternity' }
  }
  if (!fields.hear_about?.length) return { error: 'How you heard about KTP is required' }

  const checkedOther = fields.hear_about.some((item) => item.toLowerCase() === 'other')
  if (checkedOther && !fields.hear_about_other) {
    return { error: 'Please describe how else you heard about KTP' }
  }

  for (const option of fields.hear_about) {
    if (option.toLowerCase() === 'other') continue
    if (!input.hearAboutOptions.includes(option)) {
      return { error: 'Invalid How did you hear option' }
    }
  }

  for (const question of input.questions) {
    const body = (input.answers[question.id] ?? '').trim()
    if (question.required && !body) {
      return { error: `Please answer: ${question.prompt.slice(0, 80)}` }
    }
    const over = answerLimitError(body, question.maxWords)
    if (over) return { error: over }
  }

  const requiredSlots: FileSlot[] = [
    'photo',
    'transcript',
    'resume',
    'resume_anonymized',
    'life_app_screenshot',
  ]
  for (const slot of requiredSlots) {
    if (!input.files[slot]) {
      return { error: FILE_REQUIRED_MESSAGE[slot] }
    }
  }

  return { error: null, data: fields }
}
