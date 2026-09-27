'use client'

import { useState } from 'react'
import { getApplyFileDownloadUrl } from '@/app/apply/actions'
import type { FileSlot } from '@/lib/apply-steps'
import { useApplyStore } from '@/lib/apply-store'

function downloadLocalFile(file: File, filename: string) {
  const url = URL.createObjectURL(file)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function ApplyFileDownloadLink({
  slot,
  filename,
  preview = false,
}: {
  slot: FileSlot
  filename: string
  preview?: boolean
}) {
  const [busy, setBusy] = useState(false)
  const isSubmittedEdit = useApplyStore((state) => state.isSubmittedEdit)
  const pendingUploads = useApplyStore((state) => state.pendingUploads)
  const pendingRemovals = useApplyStore((state) => state.pendingRemovals)
  const officialFiles = useApplyStore((state) => state.officialFiles)
  const setSaveStatus = useApplyStore((state) => state.setSaveStatus)

  const pending = pendingUploads[slot]
  const canDownloadFromServer =
    !preview &&
    !pending &&
    !pendingRemovals.includes(slot) &&
    (!isSubmittedEdit || Boolean(officialFiles[slot]))

  async function onDownload() {
    if (preview || busy) return

    if (pending) {
      downloadLocalFile(pending.file, pending.filename)
      return
    }

    if (!canDownloadFromServer) return

    setBusy(true)
    try {
      const result = await getApplyFileDownloadUrl(slot)
      if (result.error || !result.downloadUrl) {
        setSaveStatus('error', result.error ?? 'Could not download file.')
        return
      }
      window.location.assign(result.downloadUrl)
    } catch {
      setSaveStatus('error', 'Could not download file.')
    } finally {
      setBusy(false)
    }
  }

  const downloadable = preview ? false : Boolean(pending || canDownloadFromServer)

  if (!downloadable) {
    return <span className="min-w-0 flex-1 truncate text-sm leading-5 text-gray-700">{filename}</span>
  }

  return (
    <button
      type="button"
      onClick={() => void onDownload()}
      disabled={busy}
      className="min-w-0 flex-1 cursor-pointer truncate text-left text-sm leading-5 text-[#315CA9] disabled:opacity-60"
      title={`Download ${filename}`}
    >
      {busy ? 'Preparing download…' : filename}
    </button>
  )
}

export function ApplyRecapFileLink({
  slot,
  filename,
  preview = false,
}: {
  slot: FileSlot
  filename: string | null | undefined
  preview?: boolean
}) {
  if (!filename) {
    return <>—</>
  }

  if (preview) {
    return <>{filename}</>
  }

  return <ApplyFileDownloadLink slot={slot} filename={filename} />
}
