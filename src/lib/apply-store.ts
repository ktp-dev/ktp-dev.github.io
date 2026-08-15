'use client'

import { create } from 'zustand'
import type { ApplicationFields } from '@/lib/apply-schema'
import type { FileSlot } from '@/lib/apply-steps'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

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
  fields: ApplicationFields
  answers: Record<string, string>
  files: Partial<Record<FileSlot, string>>
  saveStatus: SaveStatus
  saveError: string | null
  toastErrors: string[]
  hydrate: (payload: {
    applicationId: string
    fields: ApplicationFields
    answers: Record<string, string>
    files: Partial<Record<FileSlot, string>>
  }) => void
  setField: <K extends keyof ApplicationFields>(key: K, value: ApplicationFields[K]) => void
  setAnswer: (questionId: string, body: string) => void
  setFile: (slot: FileSlot, filename: string | null) => void
  setSaveStatus: (status: SaveStatus, error?: string | null) => void
  setToastErrors: (errors: string[]) => void
}

export const useApplyStore = create<ApplyStore>((set) => ({
  applicationId: null,
  fields: emptyFields,
  answers: {},
  files: {},
  saveStatus: 'idle',
  saveError: null,
  toastErrors: [],
  hydrate: (payload) =>
    set({
      applicationId: payload.applicationId,
      fields: { ...emptyFields, ...payload.fields, hear_about: payload.fields.hear_about ?? [] },
      answers: payload.answers,
      files: payload.files,
      saveStatus: 'idle',
      saveError: null,
      toastErrors: [],
    }),
  setField: (key, value) =>
    set((state) => ({ fields: { ...state.fields, [key]: value } })),
  setAnswer: (questionId, body) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: body } })),
  setFile: (slot, filename) =>
    set((state) => {
      const files = { ...state.files }
      if (filename) files[slot] = filename
      else delete files[slot]
      return { files }
    }),
  setSaveStatus: (status, error = null) =>
    set((state) => ({
      saveStatus: status,
      saveError: error,
      toastErrors: status === 'error' && error ? [error] : state.toastErrors,
    })),
  setToastErrors: (errors) => set({ toastErrors: errors }),
}))
