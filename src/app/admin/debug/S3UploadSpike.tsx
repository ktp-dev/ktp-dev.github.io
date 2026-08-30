'use client'

import { useRef, useState } from 'react'
import { debugPresignPdfUpload, debugVerifyS3Upload } from '@/app/admin/debug/actions'

type Step = 'idle' | 'presigning' | 'uploading' | 'verifying' | 'done' | 'error'

type VerifiedObject = {
  key: string
  bucket: string
  contentType: string | null
  sizeBytes: number | null
  etag: string | null
  lastModified: string | null
}

export function S3UploadSpike({
  s3Configured,
  bucket,
  region,
}: {
  s3Configured: boolean
  bucket: string | null
  region: string | null
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [filename, setFilename] = useState<string | null>(null)
  const [object, setObject] = useState<VerifiedObject | null>(null)

  async function onChooseFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setFilename(file.name)
    setObject(null)
    setMessage(null)

    if (file.type !== 'application/pdf') {
      setStep('error')
      setMessage('Choose a PDF file.')
      if (inputRef.current) inputRef.current.value = ''
      setFilename(null)
      return
    }

    try {
      setStep('presigning')
      const presigned = await debugPresignPdfUpload({
        contentType: file.type,
        sizeBytes: file.size,
      })
      if (presigned.error || !presigned.uploadUrl || !presigned.key) {
        setStep('error')
        setMessage(presigned.error ?? 'Could not get presigned URL.')
        return
      }

      setStep('uploading')
      const uploadResponse = await fetch(presigned.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })
      if (!uploadResponse.ok) {
        setStep('error')
        setMessage(`Upload failed (${uploadResponse.status}). Check bucket CORS.`)
        return
      }

      setStep('verifying')
      const verified = await debugVerifyS3Upload(presigned.key)
      if (verified.error || !verified.object) {
        setStep('error')
        setMessage(verified.error ?? 'Upload succeeded but verification failed.')
        return
      }

      setObject(verified.object)
      setStep('done')
      setMessage('Upload verified.')
    } catch (error) {
      setStep('error')
      setMessage(error instanceof Error ? error.message : 'Upload failed.')
    }
  }

  function reset() {
    setStep('idle')
    setMessage(null)
    setFilename(null)
    setObject(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const busy = step === 'presigning' || step === 'uploading' || step === 'verifying'
  const statusLabel =
    step === 'presigning'
      ? 'Preparing upload…'
      : step === 'uploading'
        ? 'Uploading…'
        : step === 'verifying'
          ? 'Verifying…'
          : null

  return (
    <div className="space-y-4">
      {!s3Configured ? (
        <p className="text-sm text-amber-700">
          S3 env vars are missing in <code className="text-xs">.env.local</code>. Restart dev after setting them.
        </p>
      ) : (
        <p className="text-sm text-gray-600">
          Bucket: <span className="font-medium text-gray-800">{bucket}</span>
          {region ? (
            <>
              {' '}
              · Region: <span className="font-medium text-gray-800">{region}</span>
            </>
          ) : null}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        disabled={!s3Configured || busy}
        onChange={(event) => void onChooseFile(event)}
      />

      <div className="flex flex-wrap items-center gap-3">
        <div
          className={`min-w-0 flex-1 rounded-md border border-gray-100 bg-white/80 px-3 py-2 text-sm leading-5 ${
            filename ? 'truncate text-gray-700' : 'text-gray-500'
          }`}
        >
          {busy ? statusLabel : filename ?? 'No file chosen'}
        </div>
        <button
          type="button"
          disabled={!s3Configured || busy}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-[40px] border border-[#315CA9] px-4 py-2 text-sm font-semibold text-[#315CA9] transition-all duration-300 hover:scale-105 hover:bg-[#315CA9] hover:text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          Choose PDF
        </button>
        {filename && !busy ? (
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer text-sm font-semibold text-gray-500 hover:text-gray-800"
          >
            Reset
          </button>
        ) : null}
      </div>

      {message ? (
        <p className={`text-sm ${step === 'error' ? 'text-red-600' : 'text-green-700'}`}>{message}</p>
      ) : null}

      {object ? (
        <dl className="space-y-1 rounded-md border border-gray-100 bg-white/80 p-4 text-sm text-gray-700">
          <div>
            <dt className="font-semibold text-gray-800">Key</dt>
            <dd className="break-all font-mono text-xs">{object.key}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-800">Size</dt>
            <dd>{object.sizeBytes?.toLocaleString() ?? '—'} bytes</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-800">ETag</dt>
            <dd className="font-mono text-xs">{object.etag ?? '—'}</dd>
          </div>
        </dl>
      ) : null}
    </div>
  )
}
