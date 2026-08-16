'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { addBrother, removeBrother, updateBrother } from '@/app/admin/actions'
import type { BrotherFormInput, ClientBrother } from '@/lib/brother-schema'

const btnClass =
  'px-4 py-2 bg-[#315CA9] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
const ghostBtnClass =
  'px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md bg-white/80 text-sm text-gray-700 outline-none transition-[border-color,box-shadow] duration-200 ease-out focus:border-[#315CA9] focus:shadow-[0_0_0_3px_rgba(49,92,169,0.18)]'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
const sectionCardClass =
  'rounded-xl border border-gray-100 p-6 transform transition-all duration-300 ease-in-out hover:shadow-[0_12px_36px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05)]'
const sectionCardStyle = {
  backgroundColor: 'rgba(249, 250, 251, 0.95)',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
}
const innerCardClass = 'rounded-xl border border-gray-100 bg-white/80'
const innerCardStyle = { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)' }
const MODAL_ANIMATION_MS = 280

const emptyForm: BrotherFormInput = {
  first_name: '',
  last_name: '',
  umich_email: '',
  pledge_class: '',
  linkedin_url: '',
  photo_filename: '',
}

function displayName(brother: ClientBrother) {
  const name = [brother.first_name, brother.last_name].filter(Boolean).join(' ').trim()
  return name || brother.umich_email || 'Unnamed'
}

function formFromBrother(brother: ClientBrother): BrotherFormInput {
  return {
    first_name: brother.first_name ?? '',
    last_name: brother.last_name ?? '',
    umich_email: brother.umich_email ?? '',
    pledge_class: brother.pledge_class ?? '',
    linkedin_url: brother.linkedin_url ?? '',
    photo_filename: brother.photo_filename ?? '',
  }
}

export default function BrotherListManager({
  currentEmail,
  initialBrothers,
}: {
  currentEmail: string
  initialBrothers: ClientBrother[]
}) {
  const [people, setPeople] = useState(initialBrothers)
  const [error, setError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [modal, setModal] = useState<'form' | 'csv' | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [csvFilename, setCsvFilename] = useState<string | null>(null)
  const csvInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const self = currentEmail.toLowerCase()
  const isEditMode = Boolean(editingId)

  useEffect(() => {
    if (!modal) return
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsModalVisible(true))
    })
    return () => cancelAnimationFrame(frame)
  }, [modal])

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  function resetTransientState() {
    setForm(emptyForm)
    setEditingId(null)
    setCsvFilename(null)
    setError(null)
    if (csvInputRef.current) csvInputRef.current.value = ''
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  function openAdd() {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    resetTransientState()
    setIsModalVisible(false)
    setModal('form')
  }

  function openEdit(brother: ClientBrother) {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    resetTransientState()
    setForm(formFromBrother(brother))
    setEditingId(brother.id)
    setIsModalVisible(false)
    setModal('form')
  }

  function openCsv() {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    resetTransientState()
    setIsModalVisible(false)
    setModal('csv')
  }

  function closeModal() {
    setIsModalVisible(false)
    closeTimeoutRef.current = setTimeout(() => {
      setModal(null)
      resetTransientState()
    }, MODAL_ANIMATION_MS)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    const result = editingId ? await updateBrother(editingId, form) : await addBrother(form)
    setIsSubmitting(false)
    if (result.error || !result.data) {
      setError(result.error)
      return
    }
    setPeople((current) => {
      const next = editingId
        ? current.map((person) => (person.id === editingId ? result.data! : person))
        : [...current, result.data!]
      return next.sort((a, b) => {
        const first = (a.first_name ?? '').localeCompare(b.first_name ?? '', undefined, { sensitivity: 'base' })
        if (first !== 0) return first
        const last = (a.last_name ?? '').localeCompare(b.last_name ?? '', undefined, { sensitivity: 'base' })
        if (last !== 0) return last
        return (a.umich_email ?? '').localeCompare(b.umich_email ?? '')
      })
    })
    closeModal()
  }

  async function handleRemove(id: string) {
    setError(null)
    setPendingId(id)
    const result = await removeBrother(id)
    setPendingId(null)
    if (result.error) {
      setError(result.error)
      return
    }
    setPeople((current) => current.filter((person) => person.id !== id))
  }

  return (
    <div className={`${sectionCardClass} flex h-full flex-col`} style={sectionCardStyle}>
      <div className="mb-4 flex min-h-10 flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold font-inter">Brothers</h2>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={ghostBtnClass} onClick={openCsv}>
            Import CSV
          </button>
          <button type="button" className={btnClass} onClick={openAdd}>
            Add brother
          </button>
        </div>
      </div>

      <div className={`${innerCardClass} overflow-hidden`} style={innerCardStyle}>
        {people.length === 0 ? (
          <p className="px-4 py-2 text-sm text-gray-500">No brothers yet.</p>
        ) : (
          <ul className="max-h-64 divide-y divide-gray-100 overflow-y-auto">
            {people.map((person) => {
              const isSelf = Boolean(person.umich_email && person.umich_email === self)
              return (
                <li key={person.id} className="flex items-center justify-between gap-3 px-4 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {displayName(person)}
                      {isSelf ? <span className="ml-2 text-xs font-normal text-gray-500">You</span> : null}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {[person.pledge_class, person.umich_email].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <div className="flex shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(person)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-blue-50 hover:text-[#315CA9] cursor-pointer"
                      title="Edit brother"
                      aria-label={`Edit ${displayName(person)}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleRemove(person.id)}
                      disabled={isSelf || Boolean(pendingId)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
                        isSelf
                          ? 'cursor-not-allowed text-gray-300'
                          : 'cursor-pointer text-gray-400 hover:scale-110 hover:bg-red-50 hover:text-red-500'
                      }`}
                      title={isSelf ? 'You cannot remove yourself' : 'Remove brother'}
                      aria-label={`Remove ${displayName(person)}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {error && !modal ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}

      {modal &&
        typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 99999 }}>
            <div
              className={`absolute inset-0 bg-black/15 backdrop-blur-md transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isModalVisible ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={closeModal}
            />
            <div
              className={`relative z-10 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto rounded-xl border border-gray-100 bg-white/95 p-6 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isModalVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-95 opacity-0'
              }`}
              style={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)' }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold font-inter">
                  {modal === 'csv' ? 'Import CSV' : isEditMode ? 'Edit Brother' : 'Add Brother'}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                  title="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {modal === 'csv' ? (
                <div>
                  <p className="mb-4 text-sm text-gray-600">
                    Upload a CSV of brothers. Import isn’t wired up yet — this only picks a file.
                  </p>
                  <input
                    ref={csvInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    className="sr-only"
                    onChange={(event) => setCsvFilename(event.target.files?.[0]?.name ?? null)}
                  />
                  {csvFilename ? (
                    <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white/80 px-3 py-2">
                      <span className="min-w-0 flex-1 truncate text-sm text-gray-800">{csvFilename}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCsvFilename(null)
                          if (csvInputRef.current) csvInputRef.current.value = ''
                        }}
                        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:text-red-500"
                        aria-label={`Remove ${csvFilename}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => csvInputRef.current?.click()}
                      className="cursor-pointer rounded-[40px] border border-[#315CA9] px-4 py-2 text-sm font-semibold text-[#315CA9] transition-all duration-300 hover:scale-105 hover:bg-[#315CA9] hover:text-white hover:shadow-md"
                    >
                      Choose file
                    </button>
                  )}
                  <div className="flex justify-end space-x-3 pt-6">
                    <button type="button" className={ghostBtnClass} onClick={closeModal}>
                      Cancel
                    </button>
                    <button type="button" className={btnClass} disabled>
                      Import
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4" autoComplete="off">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="brother-first-name" className={labelClass}>
                        First name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="brother-first-name"
                        className={inputClass}
                        value={form.first_name}
                        onChange={(event) => setForm((current) => ({ ...current, first_name: event.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="brother-last-name" className={labelClass}>
                        Last name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="brother-last-name"
                        className={inputClass}
                        value={form.last_name}
                        onChange={(event) => setForm((current) => ({ ...current, last_name: event.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="brother-umich-email" className={labelClass}>
                      UMich email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="brother-umich-email"
                      type="email"
                      className={inputClass}
                      value={form.umich_email}
                      onChange={(event) => setForm((current) => ({ ...current, umich_email: event.target.value }))}
                      placeholder="uniqname@umich.edu"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="brother-pledge-class" className={labelClass}>
                      Pledge class <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="brother-pledge-class"
                      className={inputClass}
                      value={form.pledge_class}
                      onChange={(event) => setForm((current) => ({ ...current, pledge_class: event.target.value }))}
                      placeholder="Psi"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="brother-linkedin" className={labelClass}>
                      LinkedIn
                    </label>
                    <input
                      id="brother-linkedin"
                      type="text"
                      className={inputClass}
                      value={form.linkedin_url}
                      onChange={(event) => setForm((current) => ({ ...current, linkedin_url: event.target.value }))}
                      placeholder="https://www.linkedin.com/in/…"
                    />
                  </div>

                  <div>
                    <p className={labelClass}>Photo</p>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          photo_filename: event.target.files?.[0]?.name ?? '',
                        }))
                      }
                    />
                    {form.photo_filename ? (
                      <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white/80 px-3 py-2">
                        <span className="min-w-0 flex-1 truncate text-sm text-gray-800">{form.photo_filename}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setForm((current) => ({ ...current, photo_filename: '' }))
                            if (photoInputRef.current) photoInputRef.current.value = ''
                          }}
                          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:text-red-500"
                          aria-label={`Remove ${form.photo_filename}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="cursor-pointer rounded-[40px] border border-[#315CA9] px-4 py-2 text-sm font-semibold text-[#315CA9] transition-all duration-300 hover:scale-105 hover:bg-[#315CA9] hover:text-white hover:shadow-md"
                      >
                        Upload photo
                      </button>
                    )}
                    <p className="mt-1 text-xs text-gray-500">Placeholder for now — we only store the filename until S3 is connected.</p>
                  </div>

                  {error ? <p className="text-sm text-red-500">{error}</p> : null}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" className={ghostBtnClass} onClick={closeModal} disabled={isSubmitting}>
                      Cancel
                    </button>
                    <button type="submit" className={btnClass} disabled={isSubmitting}>
                      {isSubmitting ? (isEditMode ? 'Updating…' : 'Adding…') : 'Confirm'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
