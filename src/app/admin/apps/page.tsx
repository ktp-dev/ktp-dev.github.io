import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AdminAppsTable } from '@/components/admin/AdminAppsTable'
import {
  AdminPageShell,
  adminPageTitleClass,
  adminPageTitleStyle,
} from '@/components/admin/AdminPageShell'
import { AdminQuickLinks } from '@/components/admin/AdminQuickLinks'
import { AdminReviewAccessManager } from '@/components/admin/AdminReviewAccessManager'
import { AdminReviewerProgressTable } from '@/components/admin/AdminReviewerProgressTable'
import {
  adminHeadingClass,
  adminInnerCardClass,
  adminInnerCardStyle,
  adminLinkClass,
  adminMutedClass,
  adminSectionCardClass,
  adminSectionCardStyle,
} from '@/components/admin/admin-ui'
import Unauthorized from '@/components/Unauthorized'
import { listApplicationsForAdmin } from '@/lib/admin-applications'
import { listReviewerProgressForAdmin } from '@/lib/admin-reviewer-progress'
import { listReviewAccessForCycle } from '@/lib/review-access-admin'
import { getAdminCycle } from '@/lib/rush-cycles'
import { checkIsAdmin, getCurrentUser } from '@/lib/supabase/auth-helpers'

export default async function AdminAppsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/login')

  const adminUser = await checkIsAdmin()
  if (!adminUser) return <Unauthorized />

  const { cycle } = await getAdminCycle()
  if (!cycle) {
    return (
      <AdminPageShell>
        <h1 className={adminPageTitleClass} style={adminPageTitleStyle}>
          Applications
        </h1>
        <AdminQuickLinks currentPath="/admin/apps" />
        <p className={`text-sm ${adminMutedClass}`}>
          Create a rush cycle before managing applications.
        </p>
        <Link href="/admin/rush" className={`mt-4 inline-block ${adminLinkClass}`}>
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
      <h1 className={adminPageTitleClass} style={adminPageTitleStyle}>
        Applications
      </h1>

      <AdminQuickLinks currentPath="/admin/apps" />

      <div className={`${adminSectionCardClass} mb-8`} style={adminSectionCardStyle}>
        <div className="mb-4">
          <h2 className={`font-inter text-xl font-bold ${adminHeadingClass}`}>{cycle.name}</h2>
          <p className={`mt-1 text-sm ${adminMutedClass}`}>
            EBoard overview for this rush cycle. Reviewers only see anonymized applications.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className={adminInnerCardClass} style={adminInnerCardStyle}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${adminMutedClass}`}>
                Submitted
              </p>
              <p className={`mt-1 text-2xl font-bold ${adminHeadingClass}`}>{applications.length}</p>
            </div>
          </div>
          <div className={adminInnerCardClass} style={adminInnerCardStyle}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${adminMutedClass}`}>
                Total reads
              </p>
              <p className={`mt-1 text-2xl font-bold ${adminHeadingClass}`}>{totalReads}</p>
            </div>
          </div>
          <div className={adminInnerCardClass} style={adminInnerCardStyle}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${adminMutedClass}`}>
                Reviewers met min
              </p>
              <p className={`mt-1 text-2xl font-bold ${adminHeadingClass}`}>
                {metMinimumCount}
                <span className={`text-base font-normal ${adminMutedClass}`}>
                  {' '}
                  / {reviewAccess.length}
                </span>
              </p>
            </div>
          </div>
          <div className={adminInnerCardClass} style={adminInnerCardStyle}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${adminMutedClass}`}>
                Avg reads / app
              </p>
              <p className={`mt-1 text-2xl font-bold ${adminHeadingClass}`}>{avgReadsPerApp}</p>
            </div>
          </div>
          <div className={adminInnerCardClass} style={adminInnerCardStyle}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${adminMutedClass}`}>
                Avg review time
              </p>
              <p className={`mt-1 text-2xl font-bold ${adminHeadingClass}`}>
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

      <div className={`${adminSectionCardClass} mb-8`} style={adminSectionCardStyle}>
        <div className="mb-4">
          <h2 className={`font-inter text-xl font-bold ${adminHeadingClass}`}>
            Submitted applications
          </h2>
          <p className={`mt-1 text-sm ${adminMutedClass}`}>
            Search, sort, and export the full applicant list.
          </p>
        </div>
        <AdminAppsTable
          cycleId={cycle.id}
          cycleName={cycle.name}
          applications={applications}
        />
      </div>

      <div className={`${adminSectionCardClass} relative z-10 mb-8`} style={adminSectionCardStyle}>
        <div className="mb-4">
          <h2 className={`font-inter text-xl font-bold ${adminHeadingClass}`}>Reviewer access</h2>
          <p className={`mt-1 text-sm ${adminMutedClass}`}>
            Brothers on this list can use Application Reads. They must already be in the brothers
            directory. Site admins can always review.
          </p>
        </div>
        <AdminReviewAccessManager cycleId={cycle.id} initialEntries={reviewAccess} />
      </div>

      <div className={`${adminSectionCardClass} relative z-0 mb-8`} style={adminSectionCardStyle}>
        <div className="mb-4">
          <h2 className={`font-inter text-xl font-bold ${adminHeadingClass}`}>Reviewer progress</h2>
          <p className={`mt-1 text-sm ${adminMutedClass}`}>
            Completed reads, remaining toward each reviewer&apos;s minimum, and average time per app.
          </p>
        </div>
        <AdminReviewerProgressTable reviewers={reviewerProgress} />
      </div>
    </AdminPageShell>
  )
}
