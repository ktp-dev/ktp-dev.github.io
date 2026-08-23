'use client'

import { create } from 'zustand'
import type { ApplicationFields } from '@/lib/apply-schema'
import type { FileSlot } from '@/lib/apply-steps'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'unsaved' | 'error'

export type PendingUpload = {
  file: File
  filename: string
}

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

type ApplyStore = {
  applicationId: string | null
  isSubmittedEdit: boolean
  fields: ApplicationFields
  answers: Record<string, string>
  files: Partial<Record<FileSlot, string>>
  officialFields: ApplicationFields | null
  officialAnswers: Record<string, string> | null
  officialFiles: Partial<Record<FileSlot, string>>
  pendingUploads: Partial<Record<FileSlot, PendingUpload>>
  pendingRemovals: FileSlot[]
  saveStatus: SaveStatus
  saveError: string | null
  toastErrors: string[]
  toastTitle: string
  hydrate: (payload: {
    applicationId: string
    fields: ApplicationFields
    answers: Record<string, string>
    files: Partial<Record<FileSlot, string>>
    isSubmitted?: boolean
  }) => void
  clearEditSession: () => void
  discardSubmittedEdits: () => void
  hasPendingEdits: () => boolean
  setField: <K extends keyof ApplicationFields>(key: K, value: ApplicationFields[K]) => void
  setAnswer: (questionId: string, body: string) => void
  setFile: (slot: FileSlot, filename: string | null) => void
  setPendingUpload: (slot: FileSlot, file: File) => void
  removePendingFile: (slot: FileSlot) => void
  setSaveStatus: (status: SaveStatus, error?: string | null) => void
  markUnsaved: () => void
  setToastErrors: (errors: string[], title?: string) => void
  clearPendingFileState: () => void
}

function fieldsFromPayload(fields: ApplicationFields): ApplicationFields {
  return { ...emptyFields, ...fields, hear_about: fields.hear_about ?? [] }
}

export const useApplyStore = create<ApplyStore>((set, get) => ({
  applicationId: null,
  isSubmittedEdit: false,
  fields: emptyFields,
  answers: {},
  files: {},
  officialFields: null,
  officialAnswers: null,
  officialFiles: {},
  pendingUploads: {},
  pendingRemovals: [],
  saveStatus: 'idle',
  saveError: null,
  toastErrors: [],
  toastTitle: 'Please complete:',

  hydrate: (payload) => {
    const state = get()
    const isSubmitted = payload.isSubmitted ?? false

    if (isSubmitted) {
      if (state.applicationId === payload.applicationId && state.isSubmittedEdit) {
        return
      }
      const fields = fieldsFromPayload(payload.fields)
      set({
        applicationId: payload.applicationId,
        isSubmittedEdit: true,
        fields,
        answers: payload.answers,
        files: payload.files,
        officialFields: fields,
        officialAnswers: { ...payload.answers },
        officialFiles: { ...payload.files },
        pendingUploads: {},
        pendingRemovals: [],
        saveStatus: 'idle',
        saveError: null,
        toastErrors: [],
        toastTitle: 'Please complete:',
      })
      return
    }

    if (state.applicationId === payload.applicationId && !state.isSubmittedEdit) {
      return
    }

    set({
      applicationId: payload.applicationId,
      isSubmittedEdit: false,
      fields: fieldsFromPayload(payload.fields),
      answers: payload.answers,
      files: payload.files,
      officialFields: null,
      officialAnswers: null,
      officialFiles: {},
      pendingUploads: {},
      pendingRemovals: [],
      saveStatus: 'idle',
      saveError: null,
      toastErrors: [],
      toastTitle: 'Please complete:',
    })
  },

  clearEditSession: () =>
    set({
      isSubmittedEdit: false,
      pendingUploads: {},
      pendingRemovals: [],
      officialFields: null,
      officialAnswers: null,
      officialFiles: {},
      saveStatus: 'idle',
      saveError: null,
    }),

  discardSubmittedEdits: () => {
    const state = get()
    if (!state.isSubmittedEdit || !state.officialFields || !state.officialAnswers) return
    set({
      fields: fieldsFromPayload(state.officialFields),
      answers: { ...state.officialAnswers },
      files: { ...state.officialFiles },
      pendingUploads: {},
      pendingRemovals: [],
      saveStatus: 'idle',
      saveError: null,
      toastErrors: [],
      toastTitle: 'Please complete:',
    })
  },

  hasPendingEdits: () => {
    const state = get()
    if (!state.isSubmittedEdit) return false
    if (state.saveStatus === 'unsaved') return true
    if (Object.keys(state.pendingUploads).length > 0) return true
    if (state.pendingRemovals.length > 0) return true
    return false
  },

  setField: (key, value) =>
    set((state) => ({
      fields: { ...state.fields, [key]: value },
      saveStatus: state.isSubmittedEdit ? 'unsaved' : state.saveStatus,
    })),

  setAnswer: (questionId, body) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: body },
      saveStatus: state.isSubmittedEdit ? 'unsaved' : state.saveStatus,
    })),

  setFile: (slot, filename) =>
    set((state) => {
      const files = { ...state.files }
      if (filename) files[slot] = filename
      else delete files[slot]
      return { files }
    }),

  setPendingUpload: (slot, file) =>
    set((state) => {
      const pendingUploads = { ...state.pendingUploads, [slot]: { file, filename: file.name } }
      const pendingRemovals = state.pendingRemovals.filter((item) => item !== slot)
      return {
        pendingUploads,
        pendingRemovals,
        files: { ...state.files, [slot]: file.name },
        saveStatus: 'unsaved',
      }
    }),

  removePendingFile: (slot) =>
    set((state) => {
      const pendingUploads = { ...state.pendingUploads }
      const hadPending = Boolean(pendingUploads[slot])
      delete pendingUploads[slot]

      const files = { ...state.files }
      delete files[slot]

      let pendingRemovals = state.pendingRemovals.filter((item) => item !== slot)
      if (state.officialFiles[slot] && !pendingUploads[slot]) {
        if (hadPending) {
          files[slot] = state.officialFiles[slot]
        } else {
          pendingRemovals = [...pendingRemovals, slot]
        }
      }

      return {
        pendingUploads,
        pendingRemovals,
        files,
        saveStatus: 'unsaved',
      }
    }),

  setSaveStatus: (status, error = null) =>
    set((state) => ({
      saveStatus: status,
      saveError: error,
      ...(status === 'error' && error
        ? { toastErrors: [error], toastTitle: 'Error:' }
        : {}),
    })),

  markUnsaved: () =>
    set((state) => ({
      saveStatus: state.isSubmittedEdit ? 'unsaved' : state.saveStatus,
    })),

  setToastErrors: (errors, title = 'Please complete:') =>
    set({ toastErrors: errors, toastTitle: title }),

  clearPendingFileState: () => set({ pendingUploads: {}, pendingRemovals: [] }),
}))
