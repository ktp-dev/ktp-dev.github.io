'use client'

import { useRef, useState } from 'react'
import {
  createRushCycleRecord,
  getRushCycleBundle,
  saveRushCycleDetails,
  showRushCycleOnSite,
} from '@/app/admin/actions'
import RushApplicationManager, {
  type RushApplicationHandle,
} from '@/components/RushApplicationManager'
import RushScheduleManager from '@/components/RushScheduleManager'
import type { ClientCycleQuestion, ClientRushCycle, CycleBundle } from '@/lib/rush-cycles'

const btnClass =
  'px-4 py-2 bg-[#315CA9] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
const ghostBtnClass =
  'px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
const sectionCardClass =
  'rounded-xl border border-gray-100 p-6 transform transition-all duration-300 ease-in-out hover:shadow-[0_12px_36px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05)]'
const sectionCardStyle = {
  backgroundColor: 'rgba(249, 250, 251, 0.95)',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
}
const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 outline-none transition-[border-color,box-shadow] duration-200 ease-out focus:border-[#315CA9] focus:shadow-[0_0_0_3px_rgba(49,92,169,0.18)] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-600 disabled:shadow-none'
const datetimeInputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none transition-[border-color,box-shadow,color] duration-200 ease-out focus:border-[#315CA9] focus:shadow-[0_0_0_3px_rgba(49,92,169,0.18)] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:shadow-none'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
const innerCardClass = 'rounded-xl border border-gray-100 bg-white/80 p-4'
const innerCardStyle = { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)' }
const CYCLE_FORM_ID = 'rush-cycle-form'
const DRAFT_VALUE = '__draft__'

function toDatetimeLocal(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function emptyCycleFields() {
  return {
    name: '',
    opensAt: '',
    closesAt: '',
    interestFormUrl: '',
    youtubeUrl: '',
    calendarUrl: '',
  }
}

function fieldsFromCycle(cycle: ClientRushCycle) {
  return {
    name: cycle.name,
    opensAt: toDatetimeLocal(cycle.opens_at),
    closesAt: toDatetimeLocal(cycle.closes_at),
    interestFormUrl: cycle.interest_form_url ?? '',
    youtubeUrl: cycle.youtube_url ?? '',
    calendarUrl: cycle.calendar_url ?? '',
  }
}

export default function AdminRushDashboard({
  initialCycles,
  initialBundle,
}: {
  initialCycles: ClientRushCycle[]
  initialBundle: CycleBundle | null
}) {
  const [cycles, setCycles] = useState(initialCycles)
  const [bundle, setBundle] = useState(initialBundle)
  const [isDraft, setIsDraft] = useState(!initialBundle)
  const [draftKey, setDraftKey] = useState(0)
  const [isEditing, setIsEditing] = useState(!initialBundle)
  const [isSaving, setIsSaving] = useState(false)
  const [isActivating, setIsActivating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fields, setFields] = useState(
    initialBundle ? fieldsFromCycle(initialBundle.cycle) : emptyCycleFields()
  )
  const applicationRef = useRef<RushApplicationHandle>(null)

  const selected = isDraft ? null : bundle?.cycle ?? null
  const fieldsEditable = isDraft || isEditing

  function applyBundle(next: CycleBundle, nextCycles?: ClientRushCycle[]) {
    setIsDraft(false)
    setIsEditing(false)
    setBundle(next)
    setFields(fieldsFromCycle(next.cycle))
    if (nextCycles) {
      setCycles(nextCycles)
      return
    }
    setCycles((current) =>
      current.map((cycle) =>
        cycle.id === next.cycle.id
          ? next.cycle
          : next.cycle.is_active
            ? { ...cycle, is_active: false }
            : cycle
      )
    )
  }

  function startDraft() {
    setIsDraft(true)
    setIsEditing(true)
    setError(null)
    setFields(emptyCycleFields())
    setDraftKey((key) => key + 1)
  }

  async function handleSelect(cycleId: string) {
    if (cycleId === DRAFT_VALUE) return
    if (isDraft && !confirm('Discard this new cycle?')) return
    if (cycleId === selected?.id) return
    setIsLoading(true)
    setError(null)
    const result = await getRushCycleBundle(cycleId)
    setIsLoading(false)
    if (result.error || !result.data) {
      setError(result.error)
      return
    }
    applyBundle(result.data)
  }

  function handleNewCycle() {
    if (isDraft) {
      if (!confirm('Discard this new cycle and start over?')) return
      startDraft()
      return
    }
    if (isEditing && !confirm('Discard unsaved changes and start a new cycle?')) return
    startDraft()
  }

  function handleCancelDraft() {
    if (bundle) {
      setIsDraft(false)
      setIsEditing(false)
      setError(null)
      setFields(fieldsFromCycle(bundle.cycle))
      return
    }
    startDraft()
  }

  function cyclePayload() {
    return {
      name: fields.name,
      opens_at: fields.opensAt ? new Date(fields.opensAt).toISOString() : '',
      closes_at: fields.closesAt ? new Date(fields.closesAt).toISOString() : '',
      interest_form_url: fields.interestFormUrl,
      youtube_url: fields.youtubeUrl,
      calendar_url: fields.calendarUrl,
    }
  }

  async function handleSaveCycle(event: React.FormEvent) {
    event.preventDefault()
    setIsSaving(true)
    setError(null)

    if (isDraft) {
      const application = applicationRef.current?.getDraft()
      if (!application) {
        setIsSaving(false)
        setError('Fill out the rush application before saving.')
        return
      }
      const result = await createRushCycleRecord({
        ...cyclePayload(),
        ...application,
      })
      setIsSaving(false)
      if (result.error || !result.data) {
        setError(result.error)
        return
      }
      applyBundle(result.data, result.data.cycles)
      return
    }

    if (!selected) {
      setIsSaving(false)
      return
    }

    const result = await saveRushCycleDetails(selected.id, cyclePayload())
    setIsSaving(false)
    if (result.error || !result.data) {
      setError(result.error)
      return
    }
    applyBundle(result.data)
  }

  async function handleShowOnSite() {
    if (!selected) return
    if (
      !confirm(
        `Show ${selected.name} on /rush and /apply? The current live cycle will be replaced.`
      )
    ) {
      return
    }
    setIsActivating(true)
    setError(null)
    const result = await showRushCycleOnSite(selected.id)
    setIsActivating(false)
    if (result.error || !result.data) {
      setError(result.error)
      return
    }
    applyBundle(result.data, result.data.cycles)
  }

  function handleUpdated(data: { cycle: ClientRushCycle; questions: ClientCycleQuestion[] }) {
    if (!bundle) return
    const next = {
      ...bundle,
      cycle: data.cycle,
      questions: data.questions,
    }
    setBundle(next)
    setFields(fieldsFromCycle(data.cycle))
    setCycles((current) =>
      current.map((cycle) =>
        cycle.id === data.cycle.id
          ? data.cycle
          : data.cycle.is_active
            ? { ...cycle, is_active: false }
            : cycle
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className={sectionCardClass} style={sectionCardStyle}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold font-inter">Rush cycle</h2>
            {cycles.length || isDraft ? (
              <select
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-[border-color,box-shadow] duration-200 ease-out focus:border-[#315CA9] focus:shadow-[0_0_0_3px_rgba(49,92,169,0.18)]"
                value={isDraft ? DRAFT_VALUE : selected?.id ?? ''}
                onChange={(event) => void handleSelect(event.target.value)}
                disabled={isLoading || isSaving}
              >
                {isDraft ? <option value={DRAFT_VALUE}>New cycle</option> : null}
                {cycles.map((cycle) => (
                  <option key={cycle.id} value={cycle.id}>
                    {cycle.name}
                    {cycle.is_active ? ' (live)' : ''}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
          <div className="flex flex-nowrap items-center gap-2">
            {isDraft ? (
              <button
                type="button"
                className={ghostBtnClass}
                onClick={handleCancelDraft}
                disabled={isSaving || !bundle}
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                className={ghostBtnClass}
                onClick={() => void handleShowOnSite()}
                disabled={!selected || selected.is_active || isActivating || isLoading || isEditing}
              >
                {isActivating ? 'Updating…' : 'Show on site'}
              </button>
            )}
            {fieldsEditable ? (
              <button
                type="submit"
                form={CYCLE_FORM_ID}
                className={btnClass}
                disabled={isSaving || isLoading}
              >
                {isSaving ? 'Saving…' : 'Save'}
              </button>
            ) : (
              <button
                type="button"
                className={btnClass}
                onClick={() => {
                  window.setTimeout(() => setIsEditing(true), 0)
                }}
                disabled={isLoading}
              >
                Edit
              </button>
            )}
            <button
              type="button"
              className={btnClass}
              onClick={handleNewCycle}
              disabled={isSaving || isLoading}
            >
              New Rush Cycle
            </button>
          </div>
        </div>

        {error ? <p className="mb-3 text-sm text-red-500">{error}</p> : null}

        <form id={CYCLE_FORM_ID} onSubmit={(event) => void handleSaveCycle(event)}>
          <div className={innerCardClass} style={innerCardStyle}>
            <div className="space-y-3">
              <div>
                <label htmlFor="cycle-name" className={labelClass}>
                  Cycle name <span className="text-red-500">*</span>
                </label>
                <input
                  id="cycle-name"
                  className={inputClass}
                  value={fields.name}
                  onChange={(event) => setFields((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Fall 2026"
                  required
                  disabled={!fieldsEditable}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="opens-at" className={labelClass}>
                    Open Rush Opens <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="opens-at"
                    type="datetime-local"
                    className={`${datetimeInputClass} ${fields.opensAt ? 'text-gray-700' : 'datetime-empty'}`}
                    value={fields.opensAt}
                    onChange={(event) =>
                      setFields((current) => ({ ...current, opensAt: event.target.value }))
                    }
                    required
                    disabled={!fieldsEditable}
                  />
                </div>
                <div>
                  <label htmlFor="closes-at" className={labelClass}>
                    Open Rush Closes <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="closes-at"
                    type="datetime-local"
                    className={`${datetimeInputClass} ${fields.closesAt ? 'text-gray-700' : 'datetime-empty'}`}
                    value={fields.closesAt}
                    onChange={(event) =>
                      setFields((current) => ({ ...current, closesAt: event.target.value }))
                    }
                    required
                    disabled={!fieldsEditable}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label htmlFor="interest-form-url" className={labelClass}>
                    Interest form URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="interest-form-url"
                    type="url"
                    className={inputClass}
                    value={fields.interestFormUrl}
                    onChange={(event) =>
                      setFields((current) => ({ ...current, interestFormUrl: event.target.value }))
                    }
                    placeholder="https://forms.gle/…"
                    required
                    disabled={!fieldsEditable}
                  />
                </div>
                <div>
                  <label htmlFor="youtube-url" className={labelClass}>
                    YouTube URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="youtube-url"
                    type="url"
                    className={inputClass}
                    value={fields.youtubeUrl}
                    onChange={(event) =>
                      setFields((current) => ({ ...current, youtubeUrl: event.target.value }))
                    }
                    placeholder="https://www.youtube.com/watch?v=…"
                    required
                    disabled={!fieldsEditable}
                  />
                </div>
                <div>
                  <label htmlFor="calendar-url" className={labelClass}>
                    Google Calendar URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="calendar-url"
                    type="url"
                    className={inputClass}
                    value={fields.calendarUrl}
                    onChange={(event) =>
                      setFields((current) => ({ ...current, calendarUrl: event.target.value }))
                    }
                    placeholder="https://calendar.google.com/…"
                    required
                    disabled={!fieldsEditable}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className={`grid grid-cols-1 gap-6 pb-12 ${isDraft ? '' : 'md:grid-cols-2'} ${isLoading ? 'pointer-events-none opacity-60' : ''}`}>
        {!isDraft && selected && bundle ? (
          <div className={sectionCardClass} style={sectionCardStyle}>
            <RushScheduleManager
              key={`${selected.id}-schedule`}
              cycleId={selected.id}
              initialEvents={bundle.events}
            />
          </div>
        ) : null}
        <div className={sectionCardClass} style={sectionCardStyle}>
          <RushApplicationManager
            key={isDraft ? `draft-${draftKey}` : `${selected?.id}-application`}
            ref={applicationRef}
            initialCycle={isDraft ? null : selected}
            initialQuestions={isDraft ? [] : bundle?.questions ?? []}
            isDraft={isDraft}
            formId={isDraft ? CYCLE_FORM_ID : undefined}
            onUpdated={handleUpdated}
          />
        </div>
      </div>
    </div>
  )
}
