'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteApplyDummyFile, saveApplyDraft, submitApply } from '@/app/apply/actions'
import { DummyFileField } from '@/components/apply/DummyFileField'
import { ApplyRecapFileLink } from '@/components/apply/ApplyFileDownloadLink'
import { applyCardClass, applyCardStyle } from '@/components/apply/ApplyShell'
import { uploadPendingApplyFiles } from '@/lib/apply-client-upload'
import {
  answerLimitError,
  normalizeStringArray,
  validateApplyStep,
  wordCount,
  type ApplicationFields,
} from '@/lib/apply-schema'
import { applyPreviewHref } from '@/lib/apply-preview'
import { APPLY_STEPS, nextStepPath, prevStepPath, type ApplyStepSlug } from '@/lib/apply-steps'
import { useApplyStore } from '@/lib/apply-store'

const inputClass =
  'w-full rounded-md border border-gray-100 bg-white/80 px-3 py-2 text-sm text-gray-700 outline-none transition-[border-color,box-shadow] duration-200 ease-out focus:border-[#315CA9] focus:shadow-[0_0_0_3px_rgba(49,92,169,0.18)]'
const labelClass = 'mb-1 block text-sm font-semibold text-gray-700'
const btnClass =
  'tap-press cursor-pointer rounded-[40px] bg-[#315CA9] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-md'
const ghostBtnClass =
  'tap-press cursor-pointer rounded-[40px] border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-md'

export type ApplyFormPayload = {
  applicationId: string
  fields: ApplicationFields
  answers: Record<string, string>
  files: Partial<Record<string, string>>
  questions: {
    id: string
    prompt: string
    helpText: string | null
    maxWords: number
    required: boolean
  }[]
  hearAboutOptions: string[]
}

export function ApplySectionForm({
  step,
  payload,
  preview = false,
  previewCycleId = null,
  isSubmitted = false,
}: {
  step: ApplyStepSlug
  payload: ApplyFormPayload
  preview?: boolean
  previewCycleId?: string | null
  isSubmitted?: boolean
}) {
  const router = useRouter()
  const [nextBusy, setNextBusy] = useState(false)
  const [activeSubmit, setActiveSubmit] = useState<'draft' | 'submitted' | null>(null)
  const hydrated = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveGen = useRef(0)
  const fields = useApplyStore((state) => state.fields)
  const answers = useApplyStore((state) => state.answers)
  const files = useApplyStore((state) => state.files)
  const saveStatus = useApplyStore((state) => state.saveStatus)
  const isSubmittedEdit = useApplyStore((state) => state.isSubmittedEdit)
  const pendingUploads = useApplyStore((state) => state.pendingUploads)
  const pendingRemovals = useApplyStore((state) => state.pendingRemovals)
  const setField = useApplyStore((state) => state.setField)
  const setAnswer = useApplyStore((state) => state.setAnswer)
  const setSaveStatus = useApplyStore((state) => state.setSaveStatus)
  const setToastErrors = useApplyStore((state) => state.setToastErrors)
  const clearEditSession = useApplyStore((state) => state.clearEditSession)
  const clearPendingFileState = useApplyStore((state) => state.clearPendingFileState)
  const href = (path: string) => (preview ? applyPreviewHref(path, previewCycleId) : path)

  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    useApplyStore.getState().hydrate({
      applicationId: payload.applicationId,
      fields: payload.fields,
      answers: payload.answers,
      files: payload.files,
      isSubmitted,
    })
  }, [payload, isSubmitted])

  function draftAnswers() {
    const state = useApplyStore.getState()
    const answers: Record<string, string> = {}
    for (const question of payload.questions) {
      const body = state.answers[question.id] ?? ''
      if (answerLimitError(body, question.maxWords)) continue
      answers[question.id] = body
    }
    return answers
  }

  async function persist(options?: { silent?: boolean }) {
    if (preview || isSubmittedEdit) {
      if (!options?.silent) setSaveStatus('idle')
      return true
    }
    const gen = ++saveGen.current
    if (!options?.silent) setSaveStatus('saving')
    const state = useApplyStore.getState()
    const result = await saveApplyDraft({
      fields: state.fields,
      answers: draftAnswers(),
    })
    if (gen !== saveGen.current) return false
    if (result.error) {
      setSaveStatus('error', result.error)
      return false
    }
    if (!options?.silent) setSaveStatus('saved')
    return true
  }

  function queueSave() {
    if (preview) return
    if (isSubmittedEdit) {
      setSaveStatus('unsaved')
      return
    }
    setSaveStatus('saving')
    saveGen.current += 1
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      void persist()
    }, 2000)
  }

  async function goNext() {
    if (nextBusy) return
    if (timer.current) clearTimeout(timer.current)
    setSaveStatus('idle')
    if (preview) {
      router.push(href(nextStepPath(step)))
      return
    }
    const state = useApplyStore.getState()
    const missing = validateApplyStep({
      step,
      fields: state.fields,
      answers: state.answers,
      files: state.files,
      questions: payload.questions,
    })
    if (missing.length) {
      setToastErrors(missing)
      if (!isSubmittedEdit) void persist({ silent: true })
      return
    }
    setToastErrors([])
    if (isSubmittedEdit) {
      router.push(href(nextStepPath(step)))
      return
    }
    setNextBusy(true)
    const ok = await persist({ silent: true })
    if (ok) {
      router.push(href(nextStepPath(step)))
      return
    }
    setNextBusy(false)
  }

  async function commitSubmittedEdits() {
    for (const slot of pendingRemovals) {
      const result = await deleteApplyDummyFile(slot)
      if (result.error) {
        return { error: result.error }
      }
    }

    const uploadResult = await uploadPendingApplyFiles(pendingUploads)
    if (uploadResult.error) {
      return { error: uploadResult.error }
    }

    return { error: null }
  }

  async function handleSubmit() {
    if (preview) {
      router.push('/admin')
      return
    }
    if (timer.current) clearTimeout(timer.current)
    const submitKind = isSubmittedEdit ? 'submitted' : 'draft'
    setActiveSubmit(submitKind)
    setSaveStatus('saving')
    const state = useApplyStore.getState()

    if (isSubmittedEdit) {
      const allMissing: string[] = []
      for (const item of APPLY_STEPS) {
        if (item.slug === 'review') continue
        allMissing.push(
          ...validateApplyStep({
            step: item.slug,
            fields: state.fields,
            answers: state.answers,
            files: state.files,
            questions: payload.questions,
          })
        )
      }
      if (allMissing.length) {
        setActiveSubmit(null)
        setToastErrors(allMissing)
        setSaveStatus('unsaved')
        return
      }
      setToastErrors([])

      const fileResult = await commitSubmittedEdits()
      if (fileResult.error) {
        setActiveSubmit(null)
        setSaveStatus('error', fileResult.error)
        return
      }

      const result = await submitApply({
        fields: state.fields,
        answers: state.answers,
      })
      if (result.error) {
        setActiveSubmit(null)
        setSaveStatus('error', result.error)
        return
      }

      clearPendingFileState()
      clearEditSession()
      router.push('/apply?updated=1')
      router.refresh()
      return
    }

    const ok = await persist({ silent: true })
    if (!ok) {
      setActiveSubmit(null)
      setSaveStatus('error')
      return
    }
    const result = await submitApply({
      fields: state.fields,
      answers: state.answers,
    })
    if (result.error) {
      setActiveSubmit(null)
      setSaveStatus('error', result.error)
      return
    }
    clearEditSession()
    router.push('/apply')
    router.refresh()
  }

  const stepMeta = APPLY_STEPS.find((item) => item.slug === step)!
  const submitBusy = step === 'review' && activeSubmit !== null
  const navBusy = nextBusy || submitBusy
  const showSubmittedEditUi = isSubmittedEdit || activeSubmit === 'submitted'
  const statusLabel =
    preview
      ? ''
      : saveStatus === 'saving'
        ? 'Saving…'
        : saveStatus === 'saved'
          ? 'Saved'
          : ''

  return (
    <div className={`${applyCardClass} flex min-h-full flex-1 flex-col`} style={applyCardStyle}>
      {showSubmittedEditUi ? (
        <div className="mb-5 rounded-lg border border-[#315CA9]/20 bg-[#315CA9]/5 px-4 py-3 text-sm text-gray-700">
          Changes are not saved until you submit again on the Review step. This includes file
          uploads.
        </div>
      ) : null}
      <div className="mb-5 flex items-start justify-between gap-4">
        <h2 className="text-xl font-bold font-inter text-gray-800">{stepMeta.label}</h2>
        <p className="min-h-5 shrink-0 pt-1 text-xs text-gray-400" aria-live="polite">
          {statusLabel}
        </p>
      </div>

      {step === 'personal' ? (
        <div className="space-y-4">
          <Field label="First name *" value={fields.first_name} onChange={(v) => { setField('first_name', v); queueSave() }} />
          <Field label="Last name *" value={fields.last_name} onChange={(v) => { setField('last_name', v); queueSave() }} />
          <Field
            label="Preferred first name"
            value={fields.preferred_name}
            onChange={(v) => { setField('preferred_name', v); queueSave() }}
          />
          <Field label="Preferred pronouns *" value={fields.pronouns} onChange={(v) => { setField('pronouns', v); queueSave() }} />
          <Field label="Phone number *" value={fields.phone} placeholder="XXX-XXX-XXXX" onChange={(v) => { setField('phone', v); queueSave() }} />
          <DummyFileField slot="photo" required preview={preview} />
        </div>
      ) : null}

      {step === 'academic' ? (
        <div className="space-y-4">
          <DummyFileField slot="transcript" required preview={preview} />
          <DummyFileField slot="resume" required preview={preview} />
          <DummyFileField slot="resume_anonymized" required preview={preview} />
          <Field
            label="Major(s) *"
            hint={'If you are undecided, enter "Undecided".\nIf you are planning to change majors or applying to an upper-level college, enter "Prospective [New Major]".'}
            value={fields.majors}
            onChange={(v) => { setField('majors', v); queueSave() }}
          />
          <Field label="Minor(s)" value={fields.minors} onChange={(v) => { setField('minors', v); queueSave() }} />
          <Field
            label="Graduation year *"
            type="number"
            value={fields.graduation_year?.toString() ?? ''}
            onChange={(v) => { setField('graduation_year', v === '' ? null : Number(v)); queueSave() }}
          />
          <Field
            label="GPA *"
            hint="If this is your first semester, enter 0."
            type="number"
            min={0}
            max={4}
            step="0.001"
            value={fields.gpa?.toString() ?? ''}
            onChange={(v) => { setField('gpa', v === '' ? null : Number(v)); queueSave() }}
          />
          <Field
            label="How many semesters will you be on campus after this semester, not including any semester spent abroad? *"
            type="number"
            value={fields.semesters_remaining?.toString() ?? ''}
            onChange={(v) => { setField('semesters_remaining', v === '' ? null : Number(v)); queueSave() }}
          />
          <fieldset>
            <legend className={labelClass}>Are you a member of another professional fraternity? *</legend>
            <div className="mt-2 flex gap-4">
              {[true, false].map((value) => (
                <label key={String(value)} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="other_frat"
                    className="accent-[#315CA9]"
                    checked={fields.other_professional_fraternity === value}
                    onChange={() => {
                      setField('other_professional_fraternity', value)
                      queueSave()
                    }}
                  />
                  {value ? 'Yes' : 'No'}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      ) : null}

      {step === 'involvement' ? (
        <label className="block">
          <span className={labelClass}>Tell us about any campus activities. *</span>
          <p className="mb-2 whitespace-pre-wrap text-xs text-gray-500">
            List any on-campus activities you are involved in, such as jobs, volunteering, student organizations, or athletic teams, along with your role or position. It&apos;s completely fine if you are not involved yet!
            {'\n'}
            (e.g., Gardening Club President, Grilled Cheese Club Chancellor)
          </p>
          <textarea
            className={`${inputClass} min-h-40`}
            value={fields.campus_activities ?? ''}
            onChange={(event) => {
              setField('campus_activities', event.target.value)
              queueSave()
            }}
          />
        </label>
      ) : null}

      {step === 'questions' ? (
        <div className="space-y-8">
          {payload.questions.map((question) => {
            const body = answers[question.id] ?? ''
            const count = wordCount(body)
            const over = Boolean(answerLimitError(body, question.maxWords))
            return (
              <label key={question.id} className="block">
                <span className={labelClass}>
                  {question.prompt}
                  {question.required ? ' *' : ''}
                </span>
                {question.helpText ? (
                  <p className="mb-2 whitespace-pre-wrap text-xs text-gray-500">{question.helpText}</p>
                ) : null}
                <AutoResizeTextarea
                  className={`${inputClass} min-h-40`}
                  value={body}
                  onChange={(event) => {
                    setAnswer(question.id, event.target.value)
                    queueSave()
                  }}
                />
                <p className={`mt-1 text-xs ${over ? 'text-red-600' : 'text-gray-500'}`}>
                  {count} / {question.maxWords} words
                </p>
              </label>
            )
          })}
        </div>
      ) : null}

      {step === 'additional' ? (
        <div className="space-y-4">
          <fieldset>
            <legend className={labelClass}>How did you hear about KTP? *</legend>
            <p className="mb-2 text-xs text-gray-500">
              Select all that apply! This information is used for internal analytics only and will not affect your application. Please answer as honestly and accurately as you can.
            </p>
            <div className="space-y-2">
              {payload.hearAboutOptions.map((option) => {
                const hearAbout = normalizeStringArray(fields.hear_about)
                const checked = hearAbout.includes(option)
                return (
                  <label key={option} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="accent-[#315CA9]"
                      checked={checked}
                      onChange={() => {
                        const current = normalizeStringArray(fields.hear_about)
                        const next = checked
                          ? current.filter((item) => item !== option)
                          : [...current, option]
                        setField('hear_about', next)
                        queueSave()
                      }}
                    />
                    {option}
                  </label>
                )
              })}
            </div>
          </fieldset>
          {normalizeStringArray(fields.hear_about).some((item) => item.toLowerCase() === 'other') ? (
            <Field
              label="Other (please describe) *"
              value={fields.hear_about_other}
              onChange={(v) => { setField('hear_about_other', v); queueSave() }}
            />
          ) : null}
          <label className="block">
            <span className={labelClass}>Anything else?</span>
            <p className="mb-2 text-xs text-gray-500">
              Feel free to share anything else you would like us to know! This could include past work, portfolios, websites, videos, blogs, music, or other creative projects. It is completely fine to leave this blank.
            </p>
            <textarea
              className={`${inputClass} min-h-28`}
              value={fields.anything_else ?? ''}
              onChange={(event) => {
                setField('anything_else', event.target.value)
                queueSave()
              }}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Any thoughts on the rush process?</span>
            <p className="mb-2 text-xs text-gray-500">
              We welcome all feedback, whether positive, negative, or neutral. What did you enjoy? What could we improve? This will not affect any decisions and is only used to help us improve the process.
            </p>
            <textarea
              className={`${inputClass} min-h-28`}
              value={fields.rush_feedback ?? ''}
              onChange={(event) => {
                setField('rush_feedback', event.target.value)
                queueSave()
              }}
            />
          </label>
          <DummyFileField slot="life_app_screenshot" required preview={preview} />
        </div>
      ) : null}

      {step === 'review' ? (
        <ApplyRecap
          fields={fields}
          answers={answers}
          questions={payload.questions}
          files={files}
          preview={preview}
        />
      ) : null}

      <div className="mt-auto flex justify-between gap-3 pt-8">
        <button
          type="button"
          className={`${ghostBtnClass} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}
          disabled={navBusy}
          onClick={() => router.push(href(prevStepPath(step)))}
        >
          Back
        </button>
        {step === 'review' ? (
          <button
            type="button"
            className={`${btnClass} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}
            disabled={submitBusy}
            onClick={() => void handleSubmit()}
          >
            {preview
              ? 'Exit preview'
              : submitBusy
                ? activeSubmit === 'submitted'
                  ? 'Saving…'
                  : 'Submitting…'
                : isSubmittedEdit
                  ? 'Save changes'
                  : 'Submit application'}
          </button>
        ) : (
          <button
            type="button"
            className={`${btnClass} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}
            disabled={nextBusy}
            onClick={() => void goNext()}
          >
            {nextBusy ? 'Saving…' : 'Next'}
          </button>
        )}
      </div>
    </div>
  )
}

function AutoResizeTextarea({
  className = '',
  value,
  onChange,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <textarea
      ref={ref}
      rows={1}
      className={`resize-none overflow-hidden ${className}`}
      value={value}
      onChange={onChange}
      {...props}
    />
  )
}

function Field({
  label,
  value,
  onChange,
  hint,
  type = 'text',
  placeholder,
  min,
  max,
  step,
}: {
  label: string
  value: string | null | undefined
  onChange: (value: string) => void
  hint?: string
  type?: string
  placeholder?: string
  min?: number
  max?: number
  step?: string
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {hint ? <p className="mb-2 whitespace-pre-wrap text-xs text-gray-500">{hint}</p> : null}
      <input
        type={type}
        className={inputClass}
        value={value ?? ''}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

export function ApplyRecap({
  fields,
  answers,
  questions,
  files,
  preview = false,
}: {
  fields: ApplicationFields
  answers: Record<string, string>
  questions: ApplyFormPayload['questions']
  files: Partial<Record<string, string>>
  preview?: boolean
}) {
  return (
    <div className="space-y-6 text-sm">
      <RecapBlock
        title="Personal"
        rows={[
          ['First name', fields.first_name],
          ['Last name', fields.last_name],
          ['Preferred first name', fields.preferred_name],
          ['Pronouns', fields.pronouns],
          ['Phone', fields.phone],
          [
            'Photo',
            <ApplyRecapFileLink key="photo" slot="photo" filename={files.photo} preview={preview} />,
          ],
        ]}
      />
      <RecapBlock
        title="Academic"
        rows={[
          ['Majors', fields.majors],
          ['Minors', fields.minors],
          ['Graduation year', fields.graduation_year?.toString()],
          ['GPA', fields.gpa?.toString()],
          ['Semesters remaining', fields.semesters_remaining?.toString()],
          [
            'Other professional fraternity',
            fields.other_professional_fraternity == null
              ? null
              : fields.other_professional_fraternity
                ? 'Yes'
                : 'No',
          ],
          [
            'Transcript',
            <ApplyRecapFileLink
              key="transcript"
              slot="transcript"
              filename={files.transcript}
              preview={preview}
            />,
          ],
          [
            'Résumé',
            <ApplyRecapFileLink key="resume" slot="resume" filename={files.resume} preview={preview} />,
          ],
          [
            'Anonymized résumé',
            <ApplyRecapFileLink
              key="resume_anonymized"
              slot="resume_anonymized"
              filename={files.resume_anonymized}
              preview={preview}
            />,
          ],
        ]}
      />
      <RecapBlock title="Involvement" rows={[['Campus activities', fields.campus_activities]]} />
      <div>
        <h2 className="mb-2 text-xl font-bold font-inter">Short answers</h2>
        {questions.map((question) => (
          <div key={question.id} className="mb-3">
            <p className="font-medium text-gray-500">{question.prompt}</p>
            <p className="whitespace-pre-wrap">{answers[question.id] || '—'}</p>
          </div>
        ))}
      </div>
      <RecapBlock
        title="Additional"
        rows={[
          ['How you heard', normalizeStringArray(fields.hear_about).join(', ')],
          ['Other', fields.hear_about_other],
          ['Anything else', fields.anything_else],
          ['Rush feedback', fields.rush_feedback],
          [
            'Life app screenshot',
            <ApplyRecapFileLink
              key="life_app_screenshot"
              slot="life_app_screenshot"
              filename={files.life_app_screenshot}
              preview={preview}
            />,
          ],
        ]}
      />
    </div>
  )
}

function RecapBlock({
  title,
  rows,
}: {
  title: string
  rows: [string, React.ReactNode][]
}) {
  return (
    <div>
      <h2 className="mb-2 text-xl font-bold font-inter">{title}</h2>
      <dl className="space-y-1">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="inline font-medium text-gray-500">{label}: </dt>
            <dd className="inline whitespace-pre-wrap">{value ?? '—'}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
