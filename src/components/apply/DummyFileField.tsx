'use client'

import { useRef, useState } from 'react'
import { deleteApplyDummyFile } from '@/app/apply/actions'
import { ApplyFileDownloadLink } from '@/components/apply/ApplyFileDownloadLink'
import { uploadApplyFile } from '@/lib/apply-client-upload'
import { fileAcceptForSlot, fileRequirementsLabel, validateApplyFile } from '@/lib/apply-files'
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
  const [busyMessage, setBusyMessage] = useState<'Uploading…' | 'Removing…' | null>(null)
  const busy = busyMessage !== null
  const filename = useApplyStore((state) => state.files[slot])
  const isSubmittedEdit = useApplyStore((state) => state.isSubmittedEdit)
  const setPendingUpload = useApplyStore((state) => state.setPendingUpload)
  const removePendingFile = useApplyStore((state) => state.removePendingFile)
  const setFile = useApplyStore((state) => state.setFile)
  const setSaveStatus = useApplyStore((state) => state.setSaveStatus)

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const validation = validateApplyFile({
      slot,
      filename: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    })
    if (validation.error) {
      if (inputRef.current) inputRef.current.value = ''
      setSaveStatus('error', validation.error)
      return
    }

    if (preview) {
      setFile(slot, file.name)
      setSaveStatus('idle')
      return
    }

    if (isSubmittedEdit) {
      setPendingUpload(slot, file)
      if (inputRef.current) inputRef.current.value = ''
      setSaveStatus('unsaved')
      return
    }

    setSaveStatus('saving')
    setBusyMessage('Uploading…')

    try {
      const result = await uploadApplyFile(slot, file)
      if (result.error) {
        if (inputRef.current) inputRef.current.value = ''
        setBusyMessage(null)
        setSaveStatus('error', result.error)
        return
      }

      setFile(slot, result.filename ?? file.name)
      setBusyMessage(null)
      setSaveStatus('saved')
    } catch {
      if (inputRef.current) inputRef.current.value = ''
      setBusyMessage(null)
      setSaveStatus('error', 'Upload failed. Try again.')
    }
  }

  async function onRemove() {
    if (preview) {
      setFile(slot, null)
      if (inputRef.current) inputRef.current.value = ''
      setSaveStatus('idle')
      return
    }

    if (isSubmittedEdit) {
      removePendingFile(slot)
      if (inputRef.current) inputRef.current.value = ''
      setSaveStatus('unsaved')
      return
    }

    setSaveStatus('saving')
    setBusyMessage('Removing…')
    const result = await deleteApplyDummyFile(slot)
    if (result.error) {
      setBusyMessage(null)
      setSaveStatus('error', result.error)
      return
    }
    setFile(slot, null)
    if (inputRef.current) inputRef.current.value = ''
    setBusyMessage(null)
    setSaveStatus('saved')
  }

  return (
    <div>
      <p className="mb-1 block text-sm font-semibold text-gray-700">
        {LABELS[slot]}
        {required ? ' *' : ''}
      </p>
      <p className="mb-2 text-xs text-gray-500">{fileRequirementsLabel(slot)}</p>
      {HELP[slot] ? (
        <p className="mb-2 whitespace-pre-wrap text-xs text-gray-500">{HELP[slot]}</p>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept={fileAcceptForSlot(slot)}
        className="sr-only"
        disabled={busy}
        onChange={onChange}
      />
      {busy ? (
        <div className="rounded-md border border-gray-100 bg-white/80 px-3 py-2 text-sm leading-5 text-gray-500">
          {busyMessage}
        </div>
      ) : filename ? (
        <div className="flex items-center gap-2 rounded-md border border-gray-100 bg-white/80 px-3 py-2">
          <ApplyFileDownloadLink slot={slot} filename={filename} preview={preview} />
          <button
            type="button"
            onClick={() => void onRemove()}
            className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:text-red-500"
            aria-label={`Remove ${filename}`}
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
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-[40px] border border-[#315CA9] px-4 py-2 text-sm font-semibold text-[#315CA9] transition-all duration-300 hover:scale-105 hover:bg-[#315CA9] hover:text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          Choose file
        </button>
      )}
    </div>
  )
}
