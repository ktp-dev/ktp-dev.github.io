import Link from 'next/link'
import {
  PortalShell,
  portalDarkInnerCardClass,
  portalDarkInnerCardStyle,
  portalDarkSectionCardClass,
  portalDarkSectionCardStyle,
} from '@/components/PortalShell'
import { requireReviewer } from '@/lib/review-access'
import { getCurrentUser } from '@/lib/supabase/auth-helpers'
import {
  getAssignedReviewApplication,
  getCycleReviewReference,
  getReviewerStats,
  MIN_REQUIRED_REVIEWS,
} from '@/lib/reviews'
import { getReviewAccessEntry } from '@/lib/review-access'
import { ClaimNextButton } from '@/components/portal/ClaimNextButton'
import { RubricReference } from '@/components/portal/RubricReference'
import { readsLinkClass, readsMutedClass, readsPrimaryBtnClass } from '@/components/portal/reads-ui'

function formatDuration(ms: number | null) {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return '—'
  const minutes = Math.round(ms / 60000)
  if (minutes < 1) return '<1 min'
  return `${minutes} min`
}

export default async function PortalReadsPage() {
  const { email, cycle } = await requireReviewer()
  const user = await getCurrentUser()
  if (!user) return null

  const access = await getReviewAccessEntry(email, cycle.id)
  const stats = await getReviewerStats({
    cycleId: cycle.id,
    reviewerUserId: user.id,
    minRequiredReviews: access?.minRequiredReviews ?? MIN_REQUIRED_REVIEWS,
  })
  const assigned = await getAssignedReviewApplication(cycle.id, user.id)
  const reviewReference = await getCycleReviewReference(cycle.id)

  return (
    <PortalShell tone="dark" title="Application Reads">
      <div className={`${portalDarkSectionCardClass} mb-8`} style={portalDarkSectionCardStyle}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-inter text-xl font-bold text-white">{cycle.name}</h2>
            <p className={`mt-1 text-sm ${readsMutedClass}`}>
              Review anonymized rush applications. Scores are visible to EBoard only. Your minimum
              is {stats.minRequiredReviews} reads.
            </p>
          </div>
          <Link href="/portal" className={readsLinkClass}>
            Back to portal
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className={portalDarkInnerCardClass} style={portalDarkInnerCardStyle}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${readsMutedClass}`}>
                Completed
              </p>
              <p className="mt-1 text-2xl font-bold text-white">{stats.completedCount}</p>
            </div>
          </div>
          <div className={portalDarkInnerCardClass} style={portalDarkInnerCardStyle}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${readsMutedClass}`}>
                Remaining
              </p>
              <p className="mt-1 text-2xl font-bold text-white">{stats.remainingToMinimum}</p>
            </div>
          </div>
          <div className={portalDarkInnerCardClass} style={portalDarkInnerCardStyle}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${readsMutedClass}`}>
                Avg. time
              </p>
              <p className="mt-1 text-2xl font-bold text-white">
                {formatDuration(stats.avgDurationMs)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {assigned ? (
            <div className={`${portalDarkInnerCardClass} items-center`} style={portalDarkInnerCardStyle}>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">
                  Application #{assigned.displayNumber ?? '—'} in progress
                </p>
                <p className={`text-xs ${readsMutedClass}`}>
                  Finish scoring this application before claiming another.
                </p>
              </div>
              <Link href="/portal/reads/review" className={`shrink-0 ${readsPrimaryBtnClass} px-4 py-2`}>
                Continue
              </Link>
            </div>
          ) : (
            <ClaimNextButton
              disabled={stats.submittedApplicationCount === 0}
              emptyMessage={
                stats.submittedApplicationCount === 0
                  ? 'No submitted applications yet for this cycle.'
                  : undefined
              }
            />
          )}
        </div>
      </div>

      <div className={`${portalDarkSectionCardClass} mb-8`} style={portalDarkSectionCardStyle}>
        <div className="mb-4">
          <h2 className="font-inter text-xl font-bold text-white">Rubric &amp; questions</h2>
          <p className={`mt-1 text-sm ${readsMutedClass}`}>
            Review the full rubric and application questions before you start scoring.
          </p>
        </div>
        <RubricReference
          questions={reviewReference.questions}
          categories={reviewReference.categories}
        />
      </div>
    </PortalShell>
  )
}
