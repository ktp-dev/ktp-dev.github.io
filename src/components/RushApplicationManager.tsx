'use client'

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import {
  closeRushApplicationNow,
  openRushApplicationNow,
  saveRushApplicationCycle,
} from '@/app/admin/actions'
import {
  adminBodyClass,
  adminFieldClass,
  adminFieldStyleFor,
  adminHeadingClass,
  adminIconBtnClass,
  adminIconDangerBtnClass,
  adminInnerCardClass,
  adminInnerCardStyle,
  adminLabelClass,
  adminLinkClass,
  adminMutedClass,
  adminPrimaryBtnClass,
  adminSecondaryBtnClass,
} from '@/components/admin/admin-ui'
import { applyPreviewHref } from '@/lib/apply-preview'
import {
  buildDefaultClosedMarkdown,
  buildDefaultIntroMarkdown,
  defaultHearAboutOptionsText,
} from '@/lib/default-rush-application'
import type { ClientCycleQuestion, ClientRushCycle } from '@/lib/rush-cycles'

const QUESTION_ANIMATION_MS = 280

type QuestionDraft = {
  key: string
  id?: string
  prompt: string
  help_text: string
  max_words: number
  required: boolean
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function questionsFromServer(questions: ClientCycleQuestion[]): QuestionDraft[] {
  return questions.map((question) => ({
    key: question.id,
    id: question.id,
    prompt: question.prompt,
    help_text: question.help_text ?? '',
    max_words: question.max_words,
    required: question.required,
  }))
}

function emptyQuestion(): QuestionDraft {
  return {
    key: `new-${crypto.randomUUID()}`,
    prompt: '',
    help_text: '',
    max_words: 350,
    required: true,
  }
}

function cycleStatus(opensAt: string, closesAt: string) {
  const now = Date.now()
  const opens = new Date(opensAt).getTime()
  const closes = new Date(closesAt).getTime()
  if (!opensAt || !closesAt || Number.isNaN(opens) || Number.isNaN(closes)) {
    return { label: 'Closed', className: 'bg-white/10 text-slate-400' }
  }
  if (now < opens) {
    return { label: 'Scheduled', className: 'bg-white/10 text-slate-300' }
  }
  if (now > closes) {
    return { label: 'Closed', className: 'bg-white/10 text-slate-400' }
  }
  return { label: 'Open', className: 'bg-[#163556] text-white' }
}

export type RushApplicationHandle = {
  getDraft: () => {
    intro_markdown: string
    closed_markdown: string
    hear_about_options: string[]
    questions: Array<{
      id?: string
      prompt: string
      help_text: string
      max_words: number
      required: boolean
      sort_order: number
    }>
  }
}

const RushApplicationManager = forwardRef<
  RushApplicationHandle,
  {
    initialCycle: ClientRushCycle | null
    initialQuestions: ClientCycleQuestion[]
    isDraft?: boolean
    formId?: string
    draftMeta?: { cycleName: string }
    onUpdated?: (data: { cycle: ClientRushCycle; questions: ClientCycleQuestion[] }) => void
  }
>(function RushApplicationManager(
  { initialCycle, initialQuestions, isDraft = false, formId, draftMeta, onUpdated },
  ref
) {
  const [cycleId, setCycleId] = useState(initialCycle?.id ?? null)
  const [intro, setIntro] = useState(
    initialCycle?.intro_markdown ?? (isDraft ? buildDefaultIntroMarkdown() : '')
  )
  const [closed, setClosed] = useState(
    initialCycle?.closed_markdown ??
      (isDraft ? buildDefaultClosedMarkdown(draftMeta?.cycleName) : '')
  )
  const [hearAbout, setHearAbout] = useState(
    initialCycle?.hear_about_options?.length
      ? initialCycle.hear_about_options.join('\n')
      : isDraft
        ? defaultHearAboutOptionsText()
        : ''
  )
  const [questions, setQuestions] = useState<QuestionDraft[]>(
    initialQuestions.length ? questionsFromServer(initialQuestions) : [emptyQuestion()]
  )
  const [isSaving, setIsSaving] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(isDraft)
  const [enteringKey, setEnteringKey] = useState<string | null>(null)
  const [exitingKeys, setExitingKeys] = useState<string[]>([])
  const questionEls = useRef<Map<string, HTMLElement>>(new Map())
  const removeTimeouts = useRef<Map<string, number>>(new Map())

  const status = useMemo(
    () =>
      cycleStatus(initialCycle?.opens_at ?? '', initialCycle?.closes_at ?? ''),
    [initialCycle?.opens_at, initialCycle?.closes_at]
  )
  const visibleQuestionCount = questions.length - exitingKeys.length
  const fieldsEditable = isDraft || isEditing

  const accepting = Boolean(
    initialCycle &&
      Date.now() >= new Date(initialCycle.opens_at).getTime() &&
      Date.now() <= new Date(initialCycle.closes_at).getTime()
  )

  function applyServerState(data: {
    cycle: ClientRushCycle | null
    questions: ClientCycleQuestion[]
  }) {
    if (!data.cycle) return
    setCycleId(data.cycle.id)
    setIntro(data.cycle.intro_markdown ?? '')
    setClosed(data.cycle.closed_markdown ?? '')
    setHearAbout(data.cycle.hear_about_options.join('\n'))
    setQuestions(
      data.questions.length ? questionsFromServer(data.questions) : [emptyQuestion()]
    )
    setEnteringKey(null)
    setExitingKeys([])
  }

  function payload() {
    return {
      intro_markdown: intro,
      closed_markdown: closed,
      hear_about_options: hearAbout
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      questions: questions
        .filter((question) => !exitingKeys.includes(question.key))
        .map((question, index) => ({
          id: question.id || undefined,
          prompt: question.prompt,
          help_text: question.help_text,
          max_words: question.max_words,
          required: question.required,
          sort_order: index,
        })),
    }
  }

  useImperativeHandle(ref, () => ({
    getDraft: () => payload(),
  }))

  async function handleSave() {
    setIsSaving(true)
    setError(null)
    if (!cycleId) return
    const result = await saveRushApplicationCycle(cycleId, payload())
    setIsSaving(false)
    if (result.error || !result.data) {
      setError(result.error)
      return
    }
    applyServerState(result.data)
    onUpdated?.(result.data)
    setIsEditing(false)
  }

  async function handleCloseNow() {
    if (!cycleId) return
    if (!confirm('Close applications now? Applicants will not be able to edit or submit.')) {
      return
    }
    setIsClosing(true)
    setError(null)
    const result = await closeRushApplicationNow(cycleId)
    setIsClosing(false)
    if (result.error || !result.data) {
      setError(result.error)
      return
    }
    applyServerState(result.data)
    onUpdated?.(result.data)
  }

  async function handleOpenNow() {
    if (!cycleId) return
    if (
      !confirm(
        'Open applications now? If the close date already passed, it will be set to 30 days from now. You can edit that after.'
      )
    ) {
      return
    }
    setIsOpening(true)
    setError(null)
    const result = await openRushApplicationNow(cycleId)
    setIsOpening(false)
    if (result.error || !result.data) {
      setError(result.error)
      return
    }
    applyServerState(result.data)
    onUpdated?.(result.data)
  }

  function updateQuestion(key: string, patch: Partial<QuestionDraft>) {
    setQuestions((current) =>
      current.map((question) => (question.key === key ? { ...question, ...patch } : question))
    )
  }

  function moveQuestion(index: number, direction: -1 | 1) {
    const next = index + direction
    if (next < 0 || next >= questions.length) return
    const copy = [...questions]
    const [moved] = copy.splice(index, 1)
    copy.splice(next, 0, moved)
    setQuestions(copy)
  }

  function addQuestion() {
    const next = emptyQuestion()
    setQuestions((current) => [...current, next])
    setEnteringKey(next.key)
  }

  function removeQuestion(key: string) {
    if (visibleQuestionCount <= 1 || exitingKeys.includes(key)) return
    setExitingKeys((current) => [...current, key])
    const timeout = window.setTimeout(() => {
      setQuestions((current) => current.filter((item) => item.key !== key))
      setExitingKeys((current) => current.filter((item) => item !== key))
      removeTimeouts.current.delete(key)
    }, QUESTION_ANIMATION_MS)
    removeTimeouts.current.set(key, timeout)
  }

  useEffect(() => {
    if (!enteringKey) return
    const frame = window.requestAnimationFrame(() => {
      const el = questionEls.current.get(enteringKey)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el?.querySelector('textarea')?.focus()
    })
    const timeout = window.setTimeout(() => setEnteringKey(null), QUESTION_ANIMATION_MS)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
    }
  }, [enteringKey])

  useEffect(() => {
    const timeouts = removeTimeouts.current
    return () => {
      timeouts.forEach((timeout) => window.clearTimeout(timeout))
    }
  }, [])

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className={`text-xl font-bold font-inter ${adminHeadingClass}`}>Rush Application</h2>
          <span className={`rounded-[40px] px-3 py-1 text-xs font-semibold ${status.className}`}>
            {status.label}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!isDraft && cycleId ? (
            <a
              href={applyPreviewHref('/apply', cycleId)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${adminIconBtnClass} h-9 w-9 rounded-lg border border-white/15 text-slate-300`}
              title="Preview application"
              aria-label="Preview application"
            >
              <EyeIcon />
            </a>
          ) : null}
          {!isDraft && cycleId && accepting ? (
            <button
              type="button"
              className={adminSecondaryBtnClass}
              onClick={() => void handleCloseNow()}
              disabled={isClosing || isEditing}
            >
              {isClosing ? 'Closing…' : 'Close now'}
            </button>
          ) : null}
          {!isDraft && cycleId && !accepting ? (
            <button
              type="button"
              className={adminSecondaryBtnClass}
              onClick={() => void handleOpenNow()}
              disabled={isOpening || isEditing}
            >
              {isOpening ? 'Opening…' : 'Open now'}
            </button>
          ) : null}
          {!isDraft && isEditing ? (
            <button
              type="submit"
              form="rush-application-form"
              className={adminPrimaryBtnClass}
              disabled={isSaving}
            >
              {isSaving ? 'Saving…' : 'Save'}
            </button>
          ) : null}
          {!isDraft && !isEditing ? (
            <button
              type="button"
              className={adminPrimaryBtnClass}
              onClick={() => {
                window.setTimeout(() => setIsEditing(true), 0)
              }}
            >
              Edit
            </button>
          ) : null}
        </div>
      </div>

      <form
        id={isDraft ? undefined : 'rush-application-form'}
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          if (!isDraft) void handleSave()
        }}
      >
        {error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : null}

        <div>
          <h3 className={`mb-2 text-sm font-semibold ${adminBodyClass}`}>Welcome</h3>
          <div className={`${adminInnerCardClass} flex-col items-stretch`} style={adminInnerCardStyle}>
            <div className="w-full space-y-3">
              <div>
                <label htmlFor="intro" className={adminLabelClass}>
                  Welcome text <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="intro"
                  form={isDraft ? formId : undefined}
                  className={`${adminFieldClass} h-auto`}
                  style={adminFieldStyleFor(fieldsEditable)}
                  rows={4}
                  value={intro}
                  onChange={(event) => setIntro(event.target.value)}
                  placeholder="Thank you for your interest… Applications are due by 11:59 PM on September 6th."
                  required
                  disabled={!fieldsEditable}
                />
              </div>

              <div>
                <label htmlFor="closed-text" className={adminLabelClass}>
                  Closed text <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="closed-text"
                  form={isDraft ? formId : undefined}
                  className={`${adminFieldClass} h-auto`}
                  style={adminFieldStyleFor(fieldsEditable)}
                  rows={3}
                  value={closed}
                  onChange={(event) => setClosed(event.target.value)}
                  placeholder="The Kappa Theta Pi Fall 2025 Rush Application has now been closed."
                  required
                  disabled={!fieldsEditable}
                />
                <p className={`mt-1 text-xs ${adminMutedClass}`}>
                  Responders will see this message as the form is closed for responses.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className={`text-sm font-semibold ${adminBodyClass}`}>Questions</h3>
            {fieldsEditable ? (
              <button type="button" className={adminLinkClass} onClick={addQuestion}>
                Add question
              </button>
            ) : null}
          </div>
          <div className="flex flex-col gap-3">
            {questions.map((question, index) => {
              const isFirst = index === 0
              const isLast = index === questions.length - 1
              const isExiting = exitingKeys.includes(question.key)
              const isEntering = enteringKey === question.key
              return (
                <div
                  key={question.key}
                  ref={(node) => {
                    if (node) questionEls.current.set(question.key, node)
                    else questionEls.current.delete(question.key)
                  }}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isExiting ? 'pointer-events-none grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
                  } ${isEntering ? 'faq-content-expand' : ''}`}
                >
                  <div className={`min-h-0 ${isExiting ? 'overflow-hidden' : ''}`}>
                    <div
                      className={`${adminInnerCardClass} flex-col items-stretch`}
                      style={adminInnerCardStyle}
                    >
                  <div className="mb-1 flex h-5 w-full items-center justify-between gap-2">
                    <label className="text-sm font-medium text-slate-300">
                      Prompt <span className="text-red-400">*</span>
                    </label>
                    {fieldsEditable ? (
                      <div className="-mr-1.5 -translate-y-0.5 flex items-center">
                        <button
                          type="button"
                          onClick={() => moveQuestion(index, -1)}
                          disabled={isFirst}
                          className={`h-5 w-5 items-center justify-center rounded-full transition-all duration-200 ${
                            isFirst
                              ? 'flex cursor-not-allowed text-slate-600'
                              : `${adminIconBtnClass} !h-5 !w-5`
                          }`}
                          title={isFirst ? 'Already at top' : 'Move up'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 15l6-6 6 6" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => moveQuestion(index, 1)}
                          disabled={isLast}
                          className={`h-5 w-5 items-center justify-center rounded-full transition-all duration-200 ${
                            isLast
                              ? 'flex cursor-not-allowed text-slate-600'
                              : `${adminIconBtnClass} !h-5 !w-5`
                          }`}
                          title={isLast ? 'Already at bottom' : 'Move down'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeQuestion(question.key)}
                          disabled={visibleQuestionCount <= 1}
                          className={`h-5 w-5 items-center justify-center rounded-full transition-all duration-200 ${
                            visibleQuestionCount <= 1
                              ? 'flex cursor-not-allowed text-slate-600'
                              : `${adminIconDangerBtnClass} !h-5 !w-5`
                          }`}
                          title={visibleQuestionCount <= 1 ? 'Keep at least one question' : 'Remove question'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <textarea
                    className={`${adminFieldClass} mb-3 h-auto`}
                    style={adminFieldStyleFor(fieldsEditable)}
                    form={isDraft ? formId : undefined}
                    rows={2}
                    value={question.prompt}
                    onChange={(event) => updateQuestion(question.key, { prompt: event.target.value })}
                    required
                    disabled={!fieldsEditable}
                  />
                  <label className={adminLabelClass}>Help text</label>
                  <input
                    className={`${adminFieldClass} mb-3`}
                    style={adminFieldStyleFor(fieldsEditable)}
                    value={question.help_text}
                    onChange={(event) => updateQuestion(question.key, { help_text: event.target.value })}
                    disabled={!fieldsEditable}
                  />
                  <div className="flex flex-wrap items-end gap-6">
                    <div>
                      <label htmlFor={`max-words-${question.key}`} className={adminLabelClass}>
                        Max words <span className="text-red-400">*</span>
                      </label>
                      <input
                        id={`max-words-${question.key}`}
                        type="number"
                        min={1}
                        className={`${adminFieldClass} h-10 !w-28`}
                        style={adminFieldStyleFor(fieldsEditable)}
                        value={question.max_words}
                        onChange={(event) =>
                          updateQuestion(question.key, { max_words: Number(event.target.value) })
                        }
                        required
                        disabled={!fieldsEditable}
                      />
                    </div>
                    <label className={`flex h-10 items-center gap-2 text-sm ${adminBodyClass}`}>
                      <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(event) =>
                          updateQuestion(question.key, { required: event.target.checked })
                        }
                        className="h-4 w-4 cursor-pointer accent-[#163556] disabled:cursor-not-allowed"
                        disabled={!fieldsEditable}
                      />
                      Required response
                    </label>
                  </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className={`mb-2 text-sm font-semibold ${adminBodyClass}`}>Additional</h3>
          <div className={`${adminInnerCardClass} flex-col items-stretch`} style={adminInnerCardStyle}>
            <div className="w-full">
              <label htmlFor="hear-about" className={adminLabelClass}>
                How did you hear about KTP?
              </label>
              <textarea
                id="hear-about"
                form={isDraft ? formId : undefined}
                className={`${adminFieldClass} h-auto`}
                style={adminFieldStyleFor(fieldsEditable)}
                rows={5}
                value={hearAbout}
                onChange={(event) => setHearAbout(event.target.value)}
                placeholder={'Flyer\nInstagram\nWord of mouth\nOther'}
                disabled={!fieldsEditable}
              />
              <p className={`mt-1 text-xs ${adminMutedClass}`}>
                One option per line. Include “Other” if you want a write-in.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
})

export default RushApplicationManager
