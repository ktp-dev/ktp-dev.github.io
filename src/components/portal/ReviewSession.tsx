'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  getReviewResumeDownloadUrlAction,
  renewAssignmentAction,
  submitReviewAction,
} from '@/app/portal/reads/actions'
import type { AnonymizedReviewApplication } from '@/lib/reviews'
import { ResumeViewer } from '@/components/portal/ResumeViewer'
import { ScoreCategoryCard } from '@/components/portal/ScoreCategoryCard'
import { readsFieldClass, readsPrimaryBtnClass } from '@/components/portal/reads-ui'

const sectionHeadingClass = 'text-sm font-bold uppercase tracking-wide text-gray-500'
const backLinkClass = 'shrink-0 text-sm font-semibold text-[#315CA9]'
const RENEW_INTERVAL_MS = 5 * 60 * 1000

function resumeHeading(app: AnonymizedReviewApplication) {
  if (!app.resume.filename) return 'Résumé'
  if (app.resume.isAnonymized) return 'Résumé (anonymized)'
  return 'Résumé (not anonymized)'
}

function isScoreComplete(
  category: AnonymizedReviewApplication['rubric'][number],
  scores: Record<string, number>
) {
  const score = scores[category.id]
  return (
    Number.isInteger(score) && score >= category.scaleMin && score <= category.scaleMax
  )
}

export function ReviewSession({ initial }: { initial: AnonymizedReviewApplication }) {
  const router = useRouter()
  const [app] = useState(initial)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [notes, setNotes] = useState('')
  const [startedAt] = useState(() => new Date().toISOString())
  const [error, setError] = useState<string | null>(null)
  const [assignmentReleased, setAssignmentReleased] = useState(false)
  const [pending, startTransition] = useTransition()
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [resumeLoading, setResumeLoading] = useState(Boolean(initial.resume.filename))
  const [resumeError, setResumeError] = useState<string | null>(null)

  const allScoresFilled = useMemo(
    () => app.rubric.every((category) => isScoreComplete(category, scores)),
    [app.rubric, scores]
  )

  useEffect(() => {
    const renew = () => {
      void renewAssignmentAction(app.id)
    }
    renew()
    const timer = setInterval(renew, RENEW_INTERVAL_MS)
    const onVisible = () => {
      if (document.visibilityState === 'visible') renew()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [app.id])

  useEffect(() => {
    if (!app.resume.filename) {
      setResumeLoading(false)
      return
    }

    let cancelled = false
    setResumeLoading(true)
    setResumeError(null)

    void (async () => {
      const result = await getReviewResumeDownloadUrlAction(app.id, { disposition: 'inline' })
      if (cancelled) return
      if (result.error || !result.downloadUrl) {
        setResumeError(result.error ?? 'Could not load résumé.')
        setResumeUrl(null)
        setResumeLoading(false)
        return
      }
      setResumeUrl(result.downloadUrl)
      setResumeLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [app.id, app.resume.filename])

  function onSubmit() {
    if (!allScoresFilled || assignmentReleased) return

    setError(null)
    startTransition(async () => {
      const result = await submitReviewAction({
        applicationId: app.id,
        scores,
        notes,
        startedAt,
      })

      if (result.assignmentReleased) {
        setAssignmentReleased(true)
        setError(null)
        return
      }

      if (result.error) {
        setError(result.error)
        return
      }

      if (result.nextStatus === 'assigned') {
        window.scrollTo({ top: 0, behavior: 'auto' })
        router.refresh()
        return
      }

      router.push('/portal/reads')
      router.refresh()
    })
  }

  const iframeSrc = resumeUrl ? `${resumeUrl.split('#')[0]}#toolbar=0&navpanes=0` : null
  const scoringDisabled = assignmentReleased

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <section>
          <div className="flex items-center justify-between gap-3">
            <h3 className={sectionHeadingClass}>Overview</h3>
            <Link href="/portal/reads" className={`${backLinkClass} lg:hidden`}>
              Back to reads
            </Link>
          </div>
          <dl className="mt-3 space-y-2 text-sm text-gray-800">
            <div>
              <dt className="text-gray-500">Major(s)</dt>
              <dd>{app.overview.majors || '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Graduation year</dt>
              <dd>{app.overview.graduationYear || '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Semesters remaining</dt>
              <dd>{app.overview.semestersRemaining || '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Other professional fraternity</dt>
              <dd>{app.overview.otherProfessionalFraternity || '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Campus activities</dt>
              <dd className="whitespace-pre-wrap">{app.overview.campusActivities || '—'}</dd>
            </div>
          </dl>
        </section>

        <section>
          <h3 className={sectionHeadingClass}>Essays</h3>
          <div className="mt-3 space-y-4">
            {app.essays.map((essay) => (
              <div key={essay.questionId}>
                <p className="text-sm font-medium text-gray-800">{essay.prompt}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                  {essay.answer || '—'}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          {!app.resume.filename ? (
            <>
              <h3 className={sectionHeadingClass}>{resumeHeading(app)}</h3>
              <p className="mt-2 text-sm text-gray-500">No résumé on file.</p>
            </>
          ) : resumeLoading ? (
            <>
              <h3 className={sectionHeadingClass}>{resumeHeading(app)}</h3>
              <p className="mt-3 text-sm text-gray-500">Loading résumé…</p>
            </>
          ) : resumeError ? (
            <>
              <h3 className={sectionHeadingClass}>{resumeHeading(app)}</h3>
              <p className="mt-3 text-sm text-red-600">{resumeError}</p>
            </>
          ) : iframeSrc ? (
            <ResumeViewer iframeSrc={iframeSrc} heading={resumeHeading(app)} />
          ) : null}
        </section>
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="flex items-center justify-between gap-3">
          <h3 className={sectionHeadingClass}>Scoring</h3>
          <Link href="/portal/reads" className={`${backLinkClass} hidden lg:inline`}>
            Back to reads
          </Link>
        </div>
        {app.rubric.map((category) => (
          <ScoreCategoryCard
            key={category.id}
            category={category}
            value={scores[category.id]}
            onChange={(value) => {
              if (scoringDisabled) return
              setScores((current) => ({ ...current, [category.id]: value }))
            }}
          />
        ))}

        <div>
          <label htmlFor="review-notes" className="text-sm font-medium text-gray-700">
            Internal notes <span className="font-normal text-gray-500">(optional)</span>
          </label>
          <textarea
            id="review-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={1000}
            rows={4}
            disabled={scoringDisabled}
            className={`${readsFieldClass} mt-1 min-h-24 disabled:cursor-not-allowed disabled:opacity-60`}
          />
        </div>

        {assignmentReleased ? (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-red-600">
              This application was released after being idle.
              <br />
              Your scores weren&apos;t saved.
            </p>
            <Link href="/portal/reads" className={`inline-flex ${readsPrimaryBtnClass}`}>
              Back to reads
            </Link>
          </div>
        ) : (
          <>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="button"
              onClick={onSubmit}
              disabled={!allScoresFilled || pending}
              className={readsPrimaryBtnClass}
            >
              {pending ? 'Submitting…' : 'Submit & next'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
