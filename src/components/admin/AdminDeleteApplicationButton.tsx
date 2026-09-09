'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { deleteApplicationAction } from '@/app/admin/apps/actions'
import { adminIconDangerBtnClass } from '@/components/admin/admin-ui'

export function AdminDeleteApplicationButton({
  cycleId,
  applicationId,
  applicantLabel,
}: {
  cycleId: string
  applicationId: string
  applicantLabel: string
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onDelete() {
    const label = applicantLabel.trim() || 'this application'
    if (
      !confirm(
        `Delete ${label}? This permanently removes the application, reviews, and uploaded files. This cannot be undone.`
      )
    ) {
      return
    }

    setError(null)
    startTransition(async () => {
      const result = await deleteApplicationAction(cycleId, applicationId)
      if (result.error) {
        setError(result.error)
        return
      }
      router.push('/admin/apps')
      router.refresh()
    })
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        className={`${adminIconDangerBtnClass} h-9 w-9`}
        title={pending ? 'Deleting…' : 'Delete application'}
        aria-label={pending ? 'Deleting application' : 'Delete application'}
      >
        {pending ? (
          <span className="text-xs">…</span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 112 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      {error ? (
        <p className="absolute right-0 top-full mt-1 whitespace-nowrap text-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  )
}
