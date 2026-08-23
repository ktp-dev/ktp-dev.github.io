'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ApplyRecap } from '@/components/apply/ApplySectionForm'
import { applyCardStyle } from '@/components/apply/ApplyShell'
import type { ApplicationFields } from '@/lib/apply-schema'
import { useApplyStore } from '@/lib/apply-store'
import { formatApplyDeadline } from '@/lib/apply-steps'
import type { FileSlot } from '@/lib/apply-steps'

type Question = {
  id: string
  prompt: string
  helpText: string | null
  maxWords: number
  required: boolean
}

export function ApplySubmittedHome({
  closesAt,
  submittedAt,
  updated = false,
  canEdit,
  fields,
  answers,
  questions,
  files,
  applicationId,
}: {
  closesAt: string
  submittedAt: string | null
  updated?: boolean
  canEdit: boolean
  fields: ApplicationFields
  answers: Record<string, string>
  questions: Question[]
  files: Partial<Record<FileSlot, string>>
  applicationId: string
}) {
  const router = useRouter()
  const hasPendingEdits = useApplyStore((state) => state.hasPendingEdits())
  const discardSubmittedEdits = useApplyStore((state) => state.discardSubmittedEdits)
  const hydrate = useApplyStore((state) => state.hydrate)
  const deadline = formatApplyDeadline(closesAt)

  useEffect(() => {
    hydrate({
      applicationId,
      fields,
      answers,
      files,
      isSubmitted: true,
    })
  }, [applicationId, fields, answers, files, hydrate])

  function handleDiscard() {
    discardSubmittedEdits()
    router.refresh()
  }

  return (
    <div
      className="w-full rounded-2xl border border-gray-100 px-6 py-10 text-left sm:px-10 sm:py-12"
      style={applyCardStyle}
    >
      <div className="flex w-full flex-col items-start gap-8">
        {canEdit ? (
          <div className="space-y-4 text-base leading-relaxed sm:text-lg">
            <p>
              <span className="font-semibold text-gray-900">
                {updated ? 'Your application has been updated.' : 'Thank you for applying!'}
              </span>
            </p>
            {deadline ? (
              <p className="text-gray-700">
                You may come back and edit your application at any time before {deadline}. Please
                reach out to{' '}
                <a href="mailto:ktp-board@umich.edu" className="font-semibold text-[#315CA9]">
                  ktp-board@umich.edu
                </a>{' '}
                if you have any questions.
              </p>
            ) : (
              <p className="text-gray-700">
                You may come back and edit your application while applications are open. Please
                reach out to{' '}
                <a href="mailto:ktp-board@umich.edu" className="font-semibold text-[#315CA9]">
                  ktp-board@umich.edu
                </a>{' '}
                if you have any questions.
              </p>
            )}
            <p className="text-sm text-gray-600">
              Changes do not take effect until you review and submit again on the Review step.
            </p>
            {submittedAt ? (
              <p className="text-sm text-gray-500">
                Originally submitted {new Date(submittedAt).toLocaleString()}.
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-base leading-relaxed sm:text-lg">
            Your application has been submitted
            {submittedAt ? ` (${new Date(submittedAt).toLocaleString()})` : ''}. Responses below are
            locked.
          </p>
        )}

        <div className="w-full text-left">
          <ApplyRecap fields={fields} answers={answers} questions={questions} files={files} />
        </div>

        {canEdit ? (
          <div className="flex flex-wrap items-center gap-3 self-center">
            <Link
              href="/apply/personal"
              className="inline-flex cursor-pointer rounded-[40px] bg-[#315CA9] px-6 py-3 font-semibold text-white font-inter transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              Edit application
            </Link>
            {hasPendingEdits ? (
              <button
                type="button"
                onClick={handleDiscard}
                className="inline-flex cursor-pointer rounded-[40px] border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:shadow-md"
              >
                Discard unsaved changes
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
