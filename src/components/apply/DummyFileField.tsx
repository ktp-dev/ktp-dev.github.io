'use client'

import { useRef } from 'react'
import { deleteApplyDummyFile, saveApplyDummyFile } from '@/app/apply/actions'
import type { FileSlot } from '@/lib/apply-steps'
import { useApplyStore } from '@/lib/apply-store'

const LABELS: Record<FileSlot, string> = {
  photo: 'Photo of you',
  transcript: 'Transcript',
  resume: 'Résumé (not anonymized)',
  resume_anonymized: 'Résumé (anonymized)',
  life_app_screenshot: 'Upload a screenshot of your KTP Life Mobile App profile',
}

const HELP: Partial<Record<FileSlot, string>> = {
  resume: 'Please submit this file with all personal information displayed on your résumé.',
  resume_anonymized:
    'Please submit this file with all personal information removed from your résumé. This includes your name, address, phone number, and email address, and LinkedIn. This practice is designed to promote fairness during the rush process.',
  life_app_screenshot:
    'If you are experiencing technical issues, submit a screenshot of the bug instead and email ktp-board@umich.edu. This won\'t impact your application in any way!',
}

export function DummyFileField({
  slot,
  required,
  preview = false,
}: {
  slot: FileSlot
  required?: boolean
  preview?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const filename = useApplyStore((state) => state.files[slot])
  const setFile = useApplyStore((state) => state.setFile)
  const setSaveStatus = useApplyStore((state) => state.setSaveStatus)

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (preview) {
      setFile(slot, file.name)
      setSaveStatus('idle')
      return
    }
    setSaveStatus('saving')
    const result = await saveApplyDummyFile({
      slot,
      filename: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    })
    if (result.error || !result.file) {
      setSaveStatus('error', result.error)
      return
    }
    setFile(slot, result.file.filename ?? file.name)
    setSaveStatus('saved')
  }

  async function onRemove() {
    if (preview) {
      setFile(slot, null)
      if (inputRef.current) inputRef.current.value = ''
      setSaveStatus('idle')
      return
    }
    setSaveStatus('saving')
    const result = await deleteApplyDummyFile(slot)
    if (result.error) {
      setSaveStatus('error', result.error)
      return
    }
    setFile(slot, null)
    if (inputRef.current) inputRef.current.value = ''
    setSaveStatus('saved')
  }

  return (
    <div>
      <p className="mb-1 text-sm font-semibold">
        {LABELS[slot]}
        {required ? ' *' : ''}
      </p>
      {HELP[slot] ? (
        <p className="mb-2 whitespace-pre-wrap text-xs text-gray-500">{HELP[slot]}</p>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        onChange={onChange}
      />
      {filename ? (
        <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white/80 px-3 py-2">
          <span className="min-w-0 flex-1 truncate text-sm text-gray-800">{filename}</span>
          <button
            type="button"
            onClick={() => void onRemove()}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:text-red-500"
            aria-label={`Remove ${filename}`}
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
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-[40px] border border-[#315CA9] px-4 py-2 text-sm font-semibold text-[#315CA9] transition-all duration-300 hover:scale-105 hover:bg-[#315CA9] hover:text-white hover:shadow-md"
        >
          Choose file
        </button>
      )}
    </div>
  )
}
