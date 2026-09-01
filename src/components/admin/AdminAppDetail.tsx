import Link from 'next/link'
import type { AdminApplicationDetail } from '@/lib/admin-applications'
import { AdminDeleteApplicationButton } from '@/components/admin/AdminDeleteApplicationButton'
import { AdminFileDownloadLink } from '@/components/admin/AdminFileDownloadLink'
import { formatRushDateTimeCompact, formatRushDateTimeLocale } from '@/lib/rush-timezone'
import {
  adminBodyClass,
  adminHeadingClass,
  adminIconBtnClass,
  adminInnerCardClass,
  adminInnerCardStyle,
  adminInsetCardClass,
  adminInsetCardStyle,
  adminLinkClass,
  adminMutedClass,
  adminSectionCardClass,
  adminSectionCardStyle,
} from '@/components/admin/admin-ui'

function formatScore(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return '—'
  return value.toFixed(2)
}

function formatDuration(ms: number | null) {
  if (ms == null || ms <= 0) return '—'
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.round((ms % 60000) / 1000)
  if (minutes === 0) return `${seconds}s`
  return `${minutes}m ${seconds}s`
}

function formatDateTime(iso: string | null | undefined) {
  if (!iso) return '—'
  return formatRushDateTimeLocale(iso) ?? iso
}

function formatDateTimeCompact(iso: string | null | undefined) {
  if (!iso) return '—'
  return formatRushDateTimeCompact(iso) ?? iso
}

function slotLabel(slot: string) {
  return slot.replace(/_/g, ' ')
}

const navIconClass = `${adminIconBtnClass} h-9 w-9`

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

export function AdminAppDetail({
  cycleId,
  detail,
  prevApplicationId,
  nextApplicationId,
}: {
  cycleId: string
  detail: AdminApplicationDetail
  prevApplicationId?: string | null
  nextApplicationId?: string | null
}) {
  const { application, essays, files, rubric, listStats, reviews } = detail
  const maxTotal = rubric.reduce((sum, category) => sum + category.scaleMax, 0)
  const legalName =
    [application.firstName, application.lastName].filter(Boolean).join(' ') || application.email
  const preferredFirst = application.preferredName?.trim() || null

  return (
    <div className="space-y-8">
      <div className={`${adminSectionCardClass}`} style={adminSectionCardStyle}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className={`text-sm ${adminMutedClass}`}>
              Application #{application.displayNumber ?? '—'}
            </p>
            <h2 className={`font-inter text-2xl font-bold ${adminHeadingClass}`}>{legalName}</h2>
            <p className={`text-sm ${adminBodyClass}`}>{application.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {prevApplicationId ? (
              <Link
                href={`/admin/apps/${prevApplicationId}`}
                className={navIconClass}
                title="Previous application"
                aria-label="Previous application"
              >
                <ChevronLeftIcon />
              </Link>
            ) : (
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-600"
                aria-hidden
              >
                <ChevronLeftIcon />
              </span>
            )}
            <Link href="/admin/apps" className={`px-2 ${adminLinkClass}`}>
              Back to applications
            </Link>
            {nextApplicationId ? (
              <Link
                href={`/admin/apps/${nextApplicationId}`}
                className={navIconClass}
                title="Next application"
                aria-label="Next application"
              >
                <ChevronRightIcon />
              </Link>
            ) : (
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-600"
                aria-hidden
              >
                <ChevronRightIcon />
              </span>
            )}
            <AdminDeleteApplicationButton
              cycleId={cycleId}
              applicationId={application.id}
              applicantLabel={legalName}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className={`${adminInnerCardClass} !items-start`} style={adminInnerCardStyle}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${adminMutedClass}`}>
                Reads
              </p>
              <p className={`mt-1 text-2xl font-bold leading-tight ${adminHeadingClass}`}>
                {application.readCount}
              </p>
            </div>
          </div>
          <div className={`${adminInnerCardClass} !items-start`} style={adminInnerCardStyle}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${adminMutedClass}`}>
                Avg score
              </p>
              <p className={`mt-1 text-2xl font-bold leading-tight ${adminHeadingClass}`}>
                {formatScore(listStats.avgScore)}
                {maxTotal > 0 ? (
                  <span className={`ml-1.5 text-sm font-normal ${adminMutedClass}`}>
                    / {maxTotal}
                  </span>
                ) : null}
              </p>
            </div>
          </div>
          <div className={`${adminInnerCardClass} !items-start`} style={adminInnerCardStyle}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${adminMutedClass}`}>
                Adjusted avg
              </p>
              <p className={`mt-1 text-2xl font-bold leading-tight ${adminHeadingClass}`}>
                {formatScore(listStats.normalizedAvgScore)}
              </p>
            </div>
          </div>
          <div className={`${adminInnerCardClass} !items-start`} style={adminInnerCardStyle}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${adminMutedClass}`}>
                Submitted
              </p>
              <p className={`mt-1 whitespace-nowrap text-2xl font-bold leading-tight ${adminHeadingClass}`}>
                {formatDateTimeCompact(application.submittedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className={`${adminSectionCardClass} space-y-4`} style={adminSectionCardStyle}>
          <h3 className={`text-sm font-bold uppercase tracking-wide ${adminMutedClass}`}>Profile</h3>
          <dl className={`space-y-2 text-sm ${adminBodyClass}`}>
            <div>
              <dt className={adminMutedClass}>Legal name</dt>
              <dd>{legalName}</dd>
            </div>
            <div>
              <dt className={adminMutedClass}>Preferred first name</dt>
              <dd>{preferredFirst || '—'}</dd>
            </div>
            <div>
              <dt className={adminMutedClass}>Pronouns</dt>
              <dd>{application.pronouns || '—'}</dd>
            </div>
            <div>
              <dt className={adminMutedClass}>Phone</dt>
              <dd>{application.phone || '—'}</dd>
            </div>
            <div>
              <dt className={adminMutedClass}>Major(s)</dt>
              <dd>{application.majors || '—'}</dd>
            </div>
            <div>
              <dt className={adminMutedClass}>Minor(s)</dt>
              <dd>{application.minors || '—'}</dd>
            </div>
            <div>
              <dt className={adminMutedClass}>Graduation year</dt>
              <dd>{application.graduationYear ?? '—'}</dd>
            </div>
            <div>
              <dt className={adminMutedClass}>GPA</dt>
              <dd>{application.gpa || '—'}</dd>
            </div>
            <div>
              <dt className={adminMutedClass}>Semesters remaining</dt>
              <dd>{application.semestersRemaining ?? '—'}</dd>
            </div>
            <div>
              <dt className={adminMutedClass}>Other professional fraternity</dt>
              <dd>
                {application.otherProfessionalFraternity == null
                  ? '—'
                  : application.otherProfessionalFraternity
                    ? 'Yes'
                    : 'No'}
              </dd>
            </div>
            <div>
              <dt className={adminMutedClass}>Campus activities</dt>
              <dd className="whitespace-pre-wrap">{application.campusActivities || '—'}</dd>
            </div>
            <div>
              <dt className={adminMutedClass}>How they heard about KTP</dt>
              <dd>
                {application.hearAbout?.join(', ') || '—'}
                {application.hearAboutOther ? ` (${application.hearAboutOther})` : ''}
              </dd>
            </div>
          </dl>
        </section>

        <section className={`${adminSectionCardClass} space-y-4`} style={adminSectionCardStyle}>
          <h3 className={`text-sm font-bold uppercase tracking-wide ${adminMutedClass}`}>
            Essays & extras
          </h3>
          <div className="space-y-3">
            {essays.map((essay) => (
              <div
                key={essay.questionId}
                className={`${adminInsetCardClass} p-4`}
                style={adminInsetCardStyle}
              >
                <p className={`text-sm font-medium ${adminHeadingClass}`}>{essay.prompt}</p>
                <p className={`mt-2 whitespace-pre-wrap text-sm ${adminBodyClass}`}>
                  {essay.answer || '—'}
                </p>
              </div>
            ))}
            {application.anythingElse ? (
              <div className={`${adminInsetCardClass} p-4`} style={adminInsetCardStyle}>
                <p className={`text-sm font-medium ${adminHeadingClass}`}>Anything else</p>
                <p className={`mt-2 whitespace-pre-wrap text-sm ${adminBodyClass}`}>
                  {application.anythingElse}
                </p>
              </div>
            ) : null}
            {application.rushFeedback ? (
              <div className={`${adminInsetCardClass} p-4`} style={adminInsetCardStyle}>
                <p className={`text-sm font-medium ${adminHeadingClass}`}>Rush feedback</p>
                <p className={`mt-2 whitespace-pre-wrap text-sm ${adminBodyClass}`}>
                  {application.rushFeedback}
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <section className={`${adminSectionCardClass} space-y-3`} style={adminSectionCardStyle}>
        <h3 className={`text-sm font-bold uppercase tracking-wide ${adminMutedClass}`}>
          Files on record
        </h3>
        {files.length === 0 ? (
          <p className={`text-sm ${adminMutedClass}`}>No uploaded files.</p>
        ) : (
          <ul className={`space-y-1 text-sm ${adminBodyClass}`}>
            {files.map((file) => (
              <li key={file.slot} className="flex flex-wrap items-baseline gap-x-1">
                <span className={`font-medium capitalize ${adminHeadingClass}`}>
                  {slotLabel(file.slot)}:
                </span>{' '}
                <AdminFileDownloadLink
                  applicationId={application.id}
                  slot={file.slot}
                  filename={file.originalFilename || 'Uploaded'}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={`${adminSectionCardClass} space-y-4`} style={adminSectionCardStyle}>
        <h3 className={`text-sm font-bold uppercase tracking-wide ${adminMutedClass}`}>
          Review breakdown
        </h3>
        {reviews.length === 0 ? (
          <p className={`text-sm ${adminMutedClass}`}>No completed reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`${adminInsetCardClass} p-4`}
                style={adminInsetCardStyle}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className={`text-sm font-medium ${adminHeadingClass}`}>
                      {review.reviewerLabel}
                    </p>
                    {review.reviewerEmail && review.reviewerEmail !== review.reviewerLabel ? (
                      <p className={`text-xs ${adminMutedClass}`}>{review.reviewerEmail}</p>
                    ) : null}
                    <p className={`text-xs ${adminMutedClass}`}>
                      {formatDateTime(review.submittedAt)} · {formatDuration(review.durationMs)}
                    </p>
                  </div>
                  <p className={`text-lg font-bold ${adminHeadingClass}`}>
                    {review.totalScore}
                    {maxTotal > 0 ? (
                      <span className={`text-sm font-normal ${adminMutedClass}`}> / {maxTotal}</span>
                    ) : null}
                  </p>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {rubric.map((category) => (
                    <div key={category.id} className={`text-sm ${adminBodyClass}`}>
                      <span className={adminMutedClass}>{category.title}: </span>
                      {review.scoresByCategoryId[category.id] ?? '—'}
                    </div>
                  ))}
                </div>
                {review.notes ? (
                  <p className={`mt-3 whitespace-pre-wrap text-sm ${adminBodyClass}`}>
                    <span className={`font-medium ${adminHeadingClass}`}>Notes: </span>
                    {review.notes}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
