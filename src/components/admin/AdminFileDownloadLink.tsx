'use client'

import { useState } from 'react'
import { getAdminApplicationFileDownloadUrl } from '@/app/admin/apps/actions'
import { adminLinkClass } from '@/components/admin/admin-ui'

export function AdminFileDownloadLink({
  applicationId,
  slot,
  filename,
}: {
  applicationId: string
  slot: string
  filename: string
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onDownload() {
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      const result = await getAdminApplicationFileDownloadUrl({ applicationId, slot })
      if (result.error || !result.downloadUrl) {
        setError(result.error ?? 'Could not download file.')
        return
      }
      window.location.assign(result.downloadUrl)
    } catch {
      setError('Could not download file.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <span className="inline-flex min-w-0 flex-col">
      <button
        type="button"
        onClick={() => void onDownload()}
        disabled={busy}
        className={`cursor-pointer truncate text-left disabled:opacity-60 ${adminLinkClass}`}
        title={`Download ${filename}`}
      >
        {busy ? 'Preparing download…' : filename}
      </button>
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
    </span>
  )
}
