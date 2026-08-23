import Link from 'next/link'
import {
  PortalShell,
  portalInnerCardClass,
  portalInnerCardStyle,
  portalSectionCardClass,
  portalSectionCardStyle,
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
import { readsPrimaryBtnClass } from '@/components/portal/reads-ui'

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
    <PortalShell title="Application Reads">
      <div className={`${portalSectionCardClass} mb-8`} style={portalSectionCardStyle}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold font-inter">{cycle.name}</h2>
            <p className="mt-1 text-sm text-gray-500">
              Review anonymized rush applications. Scores are visible to E-Board only. Your minimum
              is {stats.minRequiredReviews} reads.
            </p>
          </div>
          <Link href="/portal" className="text-sm font-semibold text-[#315CA9]">
            Back to portal
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className={portalInnerCardClass} style={portalInnerCardStyle}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Completed</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.completedCount}</p>
            </div>
          </div>
          <div className={portalInnerCardClass} style={portalInnerCardStyle}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Remaining</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.remainingToMinimum}</p>
            </div>
          </div>
          <div className={portalInnerCardClass} style={portalInnerCardStyle}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Avg. time</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {formatDuration(stats.avgDurationMs)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {assigned ? (
            <div className={`${portalInnerCardClass} items-center`} style={portalInnerCardStyle}>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">
                  Application #{assigned.displayNumber ?? '—'} in progress
                </p>
                <p className="text-xs text-gray-500">
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

      <div className={`${portalSectionCardClass} mb-8`} style={portalSectionCardStyle}>
        <div className="mb-4">
          <h2 className="text-xl font-bold font-inter">Rubric &amp; questions</h2>
          <p className="mt-1 text-sm text-gray-500">
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
