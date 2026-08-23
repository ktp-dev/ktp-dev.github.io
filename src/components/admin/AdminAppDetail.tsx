import Link from 'next/link'
import type { AdminApplicationDetail } from '@/lib/admin-applications'
import { AdminFileDownloadLink } from '@/components/admin/AdminFileDownloadLink'

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
  const parsed = Date.parse(iso)
  if (Number.isNaN(parsed)) return iso
  return new Date(parsed).toLocaleString()
}

function slotLabel(slot: string) {
  return slot.replace(/_/g, ' ')
}

const sectionClass = 'rounded-xl border border-gray-100 bg-white/80 p-4'
const sectionStyle = { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)' }

export function AdminAppDetail({
  detail,
  prevApplicationId,
  nextApplicationId,
}: {
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">
            Application #{application.displayNumber ?? '—'}
          </p>
          <h2 className="text-2xl font-bold font-inter text-gray-900">{legalName}</h2>
          {preferredFirst && preferredFirst.toLowerCase() !== application.firstName?.trim().toLowerCase() ? (
            <p className="text-sm text-gray-600">Preferred first name: {preferredFirst}</p>
          ) : null}
          <p className="text-sm text-gray-600">{application.email}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {prevApplicationId ? (
            <Link
              href={`/admin/apps/${prevApplicationId}`}
              className="text-sm font-semibold text-[#315CA9]"
            >
              ← Previous
            </Link>
          ) : null}
          <Link href="/admin/apps" className="text-sm font-semibold text-[#315CA9]">
            Back to applications
          </Link>
          {nextApplicationId ? (
            <Link
              href={`/admin/apps/${nextApplicationId}`}
              className="text-sm font-semibold text-[#315CA9]"
            >
              Next →
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className={sectionClass} style={sectionStyle}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Reads</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{application.readCount}</p>
        </div>
        <div className={sectionClass} style={sectionStyle}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Avg score</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{formatScore(listStats.avgScore)}</p>
          {maxTotal > 0 ? (
            <p className="text-xs text-gray-500">Max {maxTotal}</p>
          ) : null}
        </div>
        <div className={sectionClass} style={sectionStyle}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Adjusted avg</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatScore(listStats.normalizedAvgScore)}
          </p>
        </div>
        <div className={sectionClass} style={sectionStyle}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Submitted</p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {formatDateTime(application.submittedAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className={`${sectionClass} space-y-4`} style={sectionStyle}>
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">Profile</h3>
          <dl className="space-y-2 text-sm text-gray-800">
            <div><dt className="text-gray-500">Legal name</dt><dd>{legalName}</dd></div>
            <div><dt className="text-gray-500">Preferred first name</dt><dd>{preferredFirst || '—'}</dd></div>
            <div><dt className="text-gray-500">Pronouns</dt><dd>{application.pronouns || '—'}</dd></div>
            <div><dt className="text-gray-500">Phone</dt><dd>{application.phone || '—'}</dd></div>
            <div><dt className="text-gray-500">Major(s)</dt><dd>{application.majors || '—'}</dd></div>
            <div><dt className="text-gray-500">Minor(s)</dt><dd>{application.minors || '—'}</dd></div>
            <div><dt className="text-gray-500">Graduation year</dt><dd>{application.graduationYear ?? '—'}</dd></div>
            <div><dt className="text-gray-500">GPA</dt><dd>{application.gpa || '—'}</dd></div>
            <div><dt className="text-gray-500">Semesters remaining</dt><dd>{application.semestersRemaining ?? '—'}</dd></div>
            <div><dt className="text-gray-500">Other professional fraternity</dt><dd>{application.otherProfessionalFraternity == null ? '—' : application.otherProfessionalFraternity ? 'Yes' : 'No'}</dd></div>
            <div><dt className="text-gray-500">Campus activities</dt><dd className="whitespace-pre-wrap">{application.campusActivities || '—'}</dd></div>
            <div><dt className="text-gray-500">How they heard about KTP</dt><dd>{application.hearAbout?.join(', ') || '—'}{application.hearAboutOther ? ` (${application.hearAboutOther})` : ''}</dd></div>
          </dl>
        </section>

        <section className={`${sectionClass} space-y-4`} style={sectionStyle}>
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">Essays & extras</h3>
          <div className="space-y-4">
            {essays.map((essay) => (
              <div key={essay.questionId}>
                <p className="text-sm font-medium text-gray-800">{essay.prompt}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{essay.answer || '—'}</p>
              </div>
            ))}
            {application.anythingElse ? (
              <div>
                <p className="text-sm font-medium text-gray-800">Anything else</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{application.anythingElse}</p>
              </div>
            ) : null}
            {application.rushFeedback ? (
              <div>
                <p className="text-sm font-medium text-gray-800">Rush feedback</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{application.rushFeedback}</p>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <section className={`${sectionClass} space-y-3`} style={sectionStyle}>
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">Files on record</h3>
        {files.length === 0 ? (
          <p className="text-sm text-gray-500">No uploaded files.</p>
        ) : (
          <ul className="space-y-1 text-sm text-gray-700">
            {files.map((file) => (
              <li key={file.slot} className="flex flex-wrap items-baseline gap-x-1">
                <span className="font-medium capitalize">{slotLabel(file.slot)}:</span>{' '}
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

      <section className={`${sectionClass} space-y-4`} style={sectionStyle}>
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">Review breakdown</h3>
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">No completed reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-gray-100 bg-white/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{review.reviewerLabel}</p>
                    {review.reviewerEmail && review.reviewerEmail !== review.reviewerLabel ? (
                      <p className="text-xs text-gray-500">{review.reviewerEmail}</p>
                    ) : null}
                    <p className="text-xs text-gray-500">
                      {formatDateTime(review.submittedAt)} · {formatDuration(review.durationMs)}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {review.totalScore}
                    {maxTotal > 0 ? <span className="text-sm font-normal text-gray-500"> / {maxTotal}</span> : null}
                  </p>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {rubric.map((category) => (
                    <div key={category.id} className="text-sm text-gray-700">
                      <span className="text-gray-500">{category.title}: </span>
                      {review.scoresByCategoryId[category.id] ?? '—'}
                    </div>
                  ))}
                </div>
                {review.notes ? (
                  <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">
                    <span className="font-medium text-gray-800">Notes: </span>
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
