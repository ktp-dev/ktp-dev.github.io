'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { addBrother, removeBrother, updateBrother } from '@/app/admin/actions'
import {
  adminBodyClass,
  adminFieldClass,
  adminFieldEditStyle,
  adminHeadingClass,
  adminInnerCardClass,
  adminInnerCardStyle,
  adminLabelClass,
  adminMutedClass,
  adminPrimaryBtnClass,
  adminSecondaryBtnClass,
  adminSectionCardClass,
  adminSectionCardStyle,
  adminTableRowClass,
  adminTableWrapClass,
} from '@/components/admin/admin-ui'
import type { BrotherFormInput, ClientBrother } from '@/lib/brother-schema'

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
    <div className={`${adminSectionCardClass} flex h-full flex-col`} style={adminSectionCardStyle}>
      <div className="mb-4 flex min-h-10 flex-wrap items-center justify-between gap-3">
        <h2 className={`text-xl font-bold font-inter ${adminHeadingClass}`}>Brothers</h2>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={adminSecondaryBtnClass} onClick={openCsv}>
            Import CSV
          </button>
          <button type="button" className={adminPrimaryBtnClass} onClick={openAdd}>
            Add brother
          </button>
        </div>
      </div>

      <div className={`max-h-64 overflow-y-auto ${adminTableWrapClass}`}>
        {people.length === 0 ? (
          <p className={`px-4 py-3 text-sm ${adminMutedClass}`}>No brothers yet.</p>
        ) : (
          <ul>
            {people.map((person) => {
              const isSelf = Boolean(person.umich_email && person.umich_email === self)
              return (
                <li
                  key={person.id}
                  className={`flex items-center justify-between gap-3 px-4 py-3 first:border-t-0 ${adminTableRowClass}`}
                >
                  <div className="min-w-0">
                    <p className={`truncate text-sm font-medium ${adminBodyClass}`}>
                      {displayName(person)}
                      {isSelf ? <span className={`ml-2 text-xs font-normal ${adminMutedClass}`}>You</span> : null}
                    </p>
                    <p className={`truncate text-xs ${adminMutedClass}`}>
                      {[person.pledge_class, person.umich_email].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <div className="flex shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(person)}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-white/10 hover:text-white"
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
                          ? 'cursor-not-allowed text-slate-600'
                          : 'cursor-pointer text-slate-400 hover:scale-110 hover:bg-red-500/10 hover:text-red-300'
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

      {error && !modal ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}

      {modal &&
        typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 99999 }}>
            <div
              className={`absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isModalVisible ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={closeModal}
            />
            <div
              className={`relative z-10 mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-[#0f172a] p-6 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isModalVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-95 opacity-0'
              }`}
              style={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25)' }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className={`text-2xl font-bold font-inter ${adminHeadingClass}`}>
                  {modal === 'csv' ? 'Import CSV' : isEditMode ? 'Edit Brother' : 'Add Brother'}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-white/10 hover:text-white"
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
                  <p className={`mb-4 text-sm ${adminMutedClass}`}>
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
                    <div className={adminInnerCardClass} style={adminInnerCardStyle}>
                      <span className={`min-w-0 flex-1 truncate text-sm ${adminBodyClass}`}>{csvFilename}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCsvFilename(null)
                          if (csvInputRef.current) csvInputRef.current.value = ''
                        }}
                        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-red-500/10 hover:text-red-300"
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
                    <button type="button" onClick={() => csvInputRef.current?.click()} className={adminSecondaryBtnClass}>
                      Choose file
                    </button>
                  )}
                  <div className="flex justify-end space-x-3 pt-6">
                    <button type="button" className={adminSecondaryBtnClass} onClick={closeModal}>
                      Cancel
                    </button>
                    <button type="button" className={adminPrimaryBtnClass} disabled>
                      Import
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4" autoComplete="off">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="brother-first-name" className={adminLabelClass}>
                        First name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="brother-first-name"
                        className={adminFieldClass}
                        style={adminFieldEditStyle}
                        value={form.first_name}
                        onChange={(event) => setForm((current) => ({ ...current, first_name: event.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="brother-last-name" className={adminLabelClass}>
                        Last name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="brother-last-name"
                        className={adminFieldClass}
                        style={adminFieldEditStyle}
                        value={form.last_name}
                        onChange={(event) => setForm((current) => ({ ...current, last_name: event.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="brother-umich-email" className={adminLabelClass}>
                      Uniqname <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="brother-umich-email"
                      type="text"
                      autoComplete="username"
                      className={adminFieldClass}
                      style={adminFieldEditStyle}
                      value={form.umich_email}
                      onChange={(event) => setForm((current) => ({ ...current, umich_email: event.target.value }))}
                      placeholder="uniqname"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="brother-pledge-class" className={adminLabelClass}>
                      Pledge class <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="brother-pledge-class"
                      className={adminFieldClass}
                      style={adminFieldEditStyle}
                      value={form.pledge_class}
                      onChange={(event) => setForm((current) => ({ ...current, pledge_class: event.target.value }))}
                      placeholder="Psi"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="brother-linkedin" className={adminLabelClass}>
                      LinkedIn
                    </label>
                    <input
                      id="brother-linkedin"
                      type="text"
                      className={adminFieldClass}
                      style={adminFieldEditStyle}
                      value={form.linkedin_url}
                      onChange={(event) => setForm((current) => ({ ...current, linkedin_url: event.target.value }))}
                      placeholder="https://www.linkedin.com/in/…"
                    />
                  </div>

                  <div>
                    <p className={adminLabelClass}>Photo</p>
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
                      <div className={adminInnerCardClass} style={adminInnerCardStyle}>
                        <span className={`min-w-0 flex-1 truncate text-sm ${adminBodyClass}`}>{form.photo_filename}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setForm((current) => ({ ...current, photo_filename: '' }))
                            if (photoInputRef.current) photoInputRef.current.value = ''
                          }}
                          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-red-500/10 hover:text-red-300"
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
                        className={adminSecondaryBtnClass}
                      >
                        Upload photo
                      </button>
                    )}
                    <p className={`mt-1 text-xs ${adminMutedClass}`}>
                      Placeholder for now — we only store the filename until S3 is connected.
                    </p>
                  </div>

                  {error ? <p className="text-sm text-red-300">{error}</p> : null}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" className={adminSecondaryBtnClass} onClick={closeModal} disabled={isSubmitting}>
                      Cancel
                    </button>
                    <button type="submit" className={adminPrimaryBtnClass} disabled={isSubmitting}>
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
