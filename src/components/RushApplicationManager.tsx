'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  closeRushApplicationNow,
  openRushApplicationNow,
  saveRushApplicationCycle,
} from '@/app/admin/actions'
import type { ClientCycleQuestion, ClientRushCycle } from '@/lib/rush-cycles'

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 outline-none transition-[border-color,box-shadow] duration-200 ease-out focus:border-[#315CA9] focus:shadow-[0_0_0_3px_rgba(49,92,169,0.18)] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-600 disabled:shadow-none'
const compactInputClass =
  'px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 outline-none transition-[border-color,box-shadow] duration-200 ease-out focus:border-[#315CA9] focus:shadow-[0_0_0_3px_rgba(49,92,169,0.18)] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-600 disabled:shadow-none'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
const btnClass =
  'px-4 py-2 bg-[#315CA9] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
const ghostBtnClass =
  'px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
const innerCardClass = 'rounded-xl border border-gray-100 bg-white/80 p-4'
const innerCardStyle = { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)' }
const QUESTION_ANIMATION_MS = 280

type QuestionDraft = {
  key: string
  id?: string
  prompt: string
  help_text: string
  max_words: number
  required: boolean
}

function toDatetimeLocal(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
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
    return { label: 'Closed', className: 'bg-gray-200/60 text-gray-600' }
  }
  if (now < opens) {
    return { label: 'Scheduled', className: 'bg-gray-200/60 text-gray-700' }
  }
  if (now > closes) {
    return { label: 'Closed', className: 'bg-gray-200/60 text-gray-600' }
  }
  return { label: 'Accepting responses', className: 'bg-[#315CA9] text-white' }
}

export default function RushApplicationManager({
  initialCycle,
  initialQuestions,
}: {
  initialCycle: ClientRushCycle | null
  initialQuestions: ClientCycleQuestion[]
}) {
  const [cycleId, setCycleId] = useState(initialCycle?.id ?? null)
  const [name, setName] = useState(initialCycle?.name ?? 'Fall 2026')
  const [opensAt, setOpensAt] = useState(
    initialCycle ? toDatetimeLocal(initialCycle.opens_at) : ''
  )
  const [closesAt, setClosesAt] = useState(
    initialCycle ? toDatetimeLocal(initialCycle.closes_at) : ''
  )
  const [intro, setIntro] = useState(initialCycle?.intro_markdown ?? '')
  const [hearAbout, setHearAbout] = useState(
    (initialCycle?.hear_about_options ?? []).join('\n')
  )
  const [questions, setQuestions] = useState<QuestionDraft[]>(
    initialQuestions.length ? questionsFromServer(initialQuestions) : [emptyQuestion()]
  )
  const [isSaving, setIsSaving] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(!initialCycle)
  const [enteringKey, setEnteringKey] = useState<string | null>(null)
  const [exitingKeys, setExitingKeys] = useState<string[]>([])
  const questionEls = useRef<Map<string, HTMLElement>>(new Map())
  const removeTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const status = useMemo(
    () =>
      cycleStatus(
        opensAt ? new Date(opensAt).toISOString() : '',
        closesAt ? new Date(closesAt).toISOString() : ''
      ),
    [opensAt, closesAt]
  )
  const cycleNameError = error === 'Cycle name is required'
  const visibleQuestionCount = questions.length - exitingKeys.length

  const accepting =
    Boolean(opensAt && closesAt) &&
    Date.now() >= new Date(opensAt).getTime() &&
    Date.now() <= new Date(closesAt).getTime()

  function applyServerState(data: {
    cycle: ClientRushCycle | null
    questions: ClientCycleQuestion[]
  }) {
    if (!data.cycle) return
    setCycleId(data.cycle.id)
    setName(data.cycle.name)
    setOpensAt(toDatetimeLocal(data.cycle.opens_at))
    setClosesAt(toDatetimeLocal(data.cycle.closes_at))
    setIntro(data.cycle.intro_markdown ?? '')
    setHearAbout(data.cycle.hear_about_options.join('\n'))
    setQuestions(
      data.questions.length ? questionsFromServer(data.questions) : [emptyQuestion()]
    )
    setEnteringKey(null)
    setExitingKeys([])
  }

  function payload() {
    return {
      name,
      opens_at: new Date(opensAt).toISOString(),
      closes_at: new Date(closesAt).toISOString(),
      intro_markdown: intro,
      hear_about_options: hearAbout
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      is_active: true,
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

  async function handleSave() {
    setIsSaving(true)
    setError(null)
    const result = await saveRushApplicationCycle(cycleId, payload())
    setIsSaving(false)
    if (result.error || !result.data) {
      setError(result.error)
      return
    }
    applyServerState(result.data)
    setSavedAt(new Date().toLocaleTimeString())
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
    setSavedAt(new Date().toLocaleTimeString())
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
    setSavedAt(new Date().toLocaleTimeString())
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
          <h2 className="text-xl font-bold font-inter">Rush Application</h2>
          <span className={`rounded-[40px] px-3 py-1 text-xs font-semibold ${status.className}`}>
            {status.label}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {cycleId && accepting ? (
            <button type="button" className={ghostBtnClass} onClick={() => void handleCloseNow()} disabled={isClosing || isEditing}>
              {isClosing ? 'Closing…' : 'Close now'}
            </button>
          ) : null}
          {cycleId && !accepting ? (
            <button type="button" className={ghostBtnClass} onClick={() => void handleOpenNow()} disabled={isOpening || isEditing}>
              {isOpening ? 'Opening…' : 'Open now'}
            </button>
          ) : null}
          {isEditing ? (
            <button
              type="submit"
              form="rush-application-form"
              className={btnClass}
              disabled={isSaving}
            >
              {isSaving ? 'Saving…' : cycleId ? 'Save' : 'Create cycle'}
            </button>
          ) : (
            <button
              type="button"
              className={btnClass}
              onClick={() => {
                window.setTimeout(() => setIsEditing(true), 0)
              }}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <form
        id="rush-application-form"
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          void handleSave()
        }}
      >
        {error && !cycleNameError ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : null}
        {savedAt && !isEditing ? <p className="text-xs text-gray-400">Saved {savedAt}</p> : null}

        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-800">Welcome</h3>
          <div className={innerCardClass} style={innerCardStyle}>
            <div className="space-y-3">
              <div>
                <label htmlFor="cycle-name" className={labelClass}>
                  Cycle name <span className="text-red-500">*</span>
                </label>
                <input
                  id="cycle-name"
                  className={`${inputClass} ${cycleNameError ? 'border-red-300' : ''}`}
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value)
                    if (cycleNameError) setError(null)
                  }}
                  placeholder="Fall 2026"
                  required
                  disabled={!isEditing}
                />
                {cycleNameError ? (
                  <p className="mt-1 text-sm text-red-500">Cycle name is required</p>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="opens-at" className={labelClass}>
                    Opens <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="opens-at"
                    type="datetime-local"
                    className={inputClass}
                    value={opensAt}
                    onChange={(event) => setOpensAt(event.target.value)}
                    required
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label htmlFor="closes-at" className={labelClass}>
                    Closes <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="closes-at"
                    type="datetime-local"
                    className={inputClass}
                    value={closesAt}
                    onChange={(event) => setClosesAt(event.target.value)}
                    required
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="intro" className={labelClass}>
                  Welcome text
                </label>
                <textarea
                  id="intro"
                  className={inputClass}
                  rows={4}
                  value={intro}
                  onChange={(event) => setIntro(event.target.value)}
                  placeholder="Thank you for your interest… Applications are due by 11:59 PM on September 6th."
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">Questions</h3>
            {isEditing ? (
              <button
                type="button"
                className="cursor-pointer text-sm font-semibold text-[#315CA9] hover:underline"
                onClick={addQuestion}
              >
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
                    <div className={innerCardClass} style={innerCardStyle}>
                  <div className="mb-1 flex h-5 items-center justify-between gap-2">
                    <label className="text-sm font-medium text-gray-700">Prompt</label>
                    {isEditing ? (
                      <div className="-mr-1.5 -translate-y-0.5 flex items-center">
                        <button
                          type="button"
                          onClick={() => moveQuestion(index, -1)}
                          disabled={isFirst}
                          className={`flex h-5 w-5 items-center justify-center rounded-full transition-all duration-200 ${
                            isFirst
                              ? 'cursor-not-allowed text-gray-300'
                              : 'cursor-pointer text-gray-400 hover:scale-110 hover:bg-gray-100 hover:text-gray-700'
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
                          className={`flex h-5 w-5 items-center justify-center rounded-full transition-all duration-200 ${
                            isLast
                              ? 'cursor-not-allowed text-gray-300'
                              : 'cursor-pointer text-gray-400 hover:scale-110 hover:bg-gray-100 hover:text-gray-700'
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
                          className={`flex h-5 w-5 items-center justify-center rounded-full transition-all duration-200 ${
                            visibleQuestionCount <= 1
                              ? 'cursor-not-allowed text-gray-300'
                              : 'cursor-pointer text-gray-400 hover:scale-110 hover:bg-red-50 hover:text-red-500'
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
                    className={`${inputClass} mb-3`}
                    rows={2}
                    value={question.prompt}
                    onChange={(event) => updateQuestion(question.key, { prompt: event.target.value })}
                    required
                    disabled={!isEditing}
                  />
                  <label className={labelClass}>Help text</label>
                  <input
                    className={`${inputClass} mb-3`}
                    value={question.help_text}
                    onChange={(event) => updateQuestion(question.key, { help_text: event.target.value })}
                    disabled={!isEditing}
                  />
                  <div className="flex flex-wrap items-end gap-6">
                    <div>
                      <label htmlFor={`max-words-${question.key}`} className={labelClass}>
                        Max words
                      </label>
                      <input
                        id={`max-words-${question.key}`}
                        type="number"
                        min={1}
                        className={`${compactInputClass} h-10 w-28`}
                        value={question.max_words}
                        onChange={(event) =>
                          updateQuestion(question.key, { max_words: Number(event.target.value) })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <label className="flex h-10 items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(event) =>
                          updateQuestion(question.key, { required: event.target.checked })
                        }
                        className="h-4 w-4 cursor-pointer accent-[#315CA9] disabled:cursor-not-allowed"
                        disabled={!isEditing}
                      />
                      Required
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
          <h3 className="mb-2 text-sm font-semibold text-gray-800">Additional</h3>
          <div className={innerCardClass} style={innerCardStyle}>
            <label htmlFor="hear-about" className={labelClass}>
              How did you hear about KTP?
            </label>
            <textarea
              id="hear-about"
              className={inputClass}
              rows={5}
              value={hearAbout}
              onChange={(event) => setHearAbout(event.target.value)}
              placeholder={'Flyer\nInstagram\nWord of mouth\nOther'}
              disabled={!isEditing}
            />
            <p className="mt-1 text-xs text-gray-500">One option per line. Include “Other” if you want a write-in.</p>
          </div>
        </div>
      </form>
    </div>
  )
}
