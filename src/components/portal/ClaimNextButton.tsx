'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { claimNextApplicationAction } from '@/app/portal/reads/actions'
import { readsPrimaryBtnClass } from '@/components/portal/reads-ui'

export function ClaimNextButton({
  disabled,
  emptyMessage,
}: {
  disabled?: boolean
  emptyMessage?: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onClaim() {
    setError(null)
    startTransition(async () => {
      const result = await claimNextApplicationAction()
      if (result.error) {
        setError(result.error)
        return
      }
      if (result.status === 'all_reviewed') {
        setError('You have reviewed all available applications.')
        return
      }
      if (result.status === 'all_assigned') {
        setError('All remaining applications are currently assigned to other reviewers.')
        return
      }
      if (result.application) {
        router.push('/portal/reads/review')
        return
      }
      setError('Could not claim an application.')
    })
  }

  return (
    <div>
      <button
        type="button"
        onClick={onClaim}
        disabled={disabled || pending}
        className={readsPrimaryBtnClass}
      >
        {pending ? 'Claiming…' : 'Start reviewing'}
      </button>
      {emptyMessage ? <p className="mt-2 text-sm text-gray-500">{emptyMessage}</p> : null}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
