import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AdminAppsTable } from '@/components/admin/AdminAppsTable'
import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { AdminQuickLinks } from '@/components/admin/AdminQuickLinks'
import { AdminReviewAccessManager } from '@/components/admin/AdminReviewAccessManager'
import { AdminReviewerProgressTable } from '@/components/admin/AdminReviewerProgressTable'
import {
  portalInnerCardClass,
  portalInnerCardStyle,
} from '@/components/PortalShell'
import Unauthorized from '@/components/Unauthorized'
import { listApplicationsForAdmin } from '@/lib/admin-applications'
import { listReviewerProgressForAdmin } from '@/lib/admin-reviewer-progress'
import { listReviewAccessForCycle } from '@/lib/review-access-admin'
import { getAdminCycle } from '@/lib/rush-cycles'
import { checkIsAdmin, getCurrentUser } from '@/lib/supabase/auth-helpers'

const sectionCardClass =
  'rounded-xl border border-gray-100 p-6 transform transition-all duration-300 ease-in-out hover:shadow-[0_12px_36px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05)]'
const sectionCardStyle = {
  backgroundColor: 'rgba(249, 250, 251, 0.95)',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
}

export default async function AdminAppsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/login')

  const adminUser = await checkIsAdmin()
  if (!adminUser) return <Unauthorized />

  const { cycle } = await getAdminCycle()
  if (!cycle) {
    return (
      <AdminPageShell>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 font-inter text-black"
          style={{ fontWeight: '900', letterSpacing: '-0.02em' }}
        >
          Applications
        </h1>
        <AdminQuickLinks currentPath="/admin/apps" />
        <p className="text-sm text-gray-600">Create a rush cycle before managing applications.</p>
        <Link href="/admin/rush" className="mt-4 inline-block text-sm font-semibold text-[#315CA9]">
          Go to rush admin
        </Link>
      </AdminPageShell>
    )
  }

  const [applications, reviewAccess, reviewerProgress] = await Promise.all([
    listApplicationsForAdmin(cycle.id),
    listReviewAccessForCycle(cycle.id),
    listReviewerProgressForAdmin(cycle.id),
  ])

  const totalReads = applications.reduce((sum, app) => sum + app.readCount, 0)
  const avgReadsPerApp =
    applications.length > 0 ? (totalReads / applications.length).toFixed(1) : '—'
  const avgReviewDurationMs = (() => {
    const withDuration = reviewerProgress.filter((r) => r.avgDurationMs != null)
    if (withDuration.length === 0) return null
    return (
      withDuration.reduce((sum, r) => sum + (r.avgDurationMs ?? 0), 0) /
      withDuration.length
    )
  })()
  const metMinimumCount = reviewerProgress.filter(
    (r) => r.completedCount >= r.minRequiredReviews
  ).length

  return (
    <AdminPageShell>
      <h1
        className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 font-inter text-black"
        style={{ fontWeight: '900', letterSpacing: '-0.02em' }}
      >
        Applications
      </h1>

      <AdminQuickLinks currentPath="/admin/apps" />

      <div className={`${sectionCardClass} mb-8`} style={sectionCardStyle}>
        <div className="mb-4">
          <h2 className="text-xl font-bold font-inter">{cycle.name}</h2>
          <p className="mt-1 text-sm text-gray-500">
            EBoard overview for this rush cycle. Reviewers only see anonymized applications.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className={portalInnerCardClass} style={portalInnerCardStyle}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Submitted</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
          </div>
          <div className={portalInnerCardClass} style={portalInnerCardStyle}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total reads</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{totalReads}</p>
            </div>
          </div>
          <div className={portalInnerCardClass} style={portalInnerCardStyle}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Reviewers met min</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {metMinimumCount}
                <span className="text-base font-normal text-gray-500">
                  {' '}
                  / {reviewAccess.length}
                </span>
              </p>
            </div>
          </div>
          <div className={portalInnerCardClass} style={portalInnerCardStyle}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Avg reads / app</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{avgReadsPerApp}</p>
            </div>
          </div>
          <div className={portalInnerCardClass} style={portalInnerCardStyle}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Avg review time</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {avgReviewDurationMs == null
                  ? '—'
                  : Math.round(avgReviewDurationMs / 60000) < 1
                    ? '<1 min'
                    : `${Math.round(avgReviewDurationMs / 60000)} min`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${sectionCardClass} mb-8`} style={sectionCardStyle}>
        <div className="mb-4">
          <h2 className="text-xl font-bold font-inter">Submitted applications</h2>
          <p className="mt-1 text-sm text-gray-500">
            Search, sort, and export the full applicant list.
          </p>
        </div>
        <AdminAppsTable
          cycleId={cycle.id}
          cycleName={cycle.name}
          applications={applications}
        />
      </div>

      <div className={`${sectionCardClass} mb-8`} style={sectionCardStyle}>
        <div className="mb-4">
          <h2 className="text-xl font-bold font-inter">Reviewer access</h2>
          <p className="mt-1 text-sm text-gray-500">
            Brothers on this list can use Application Reads. They must already be in the brothers
            directory. Site admins can always review.
          </p>
        </div>
        <AdminReviewAccessManager cycleId={cycle.id} initialEntries={reviewAccess} />
      </div>

      <div className={`${sectionCardClass} mb-8`} style={sectionCardStyle}>
        <div className="mb-4">
          <h2 className="text-xl font-bold font-inter">Reviewer progress</h2>
          <p className="mt-1 text-sm text-gray-500">
            Completed reads, remaining toward each reviewer&apos;s minimum, and average time per app.
          </p>
        </div>
        <AdminReviewerProgressTable reviewers={reviewerProgress} />
      </div>
    </AdminPageShell>
  )
}
