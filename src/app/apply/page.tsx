import Link from 'next/link'
import { ApplySubmittedHome } from '@/components/apply/ApplySubmittedHome'
import { applyCardStyle, ApplyShell } from '@/components/apply/ApplyShell'
import { UmichGoogleButton } from '@/components/apply/UmichGoogleButton'
import { loadApplyContext } from '@/lib/apply-load'
import { applyPreviewHref, parseApplyPreview, type ApplyPreviewQuery } from '@/lib/apply-preview'
import { applicationClosedMessage, applicationTitle } from '@/lib/apply-steps'

export default async function ApplyWelcomePage({
  searchParams,
}: {
  searchParams: Promise<ApplyPreviewQuery & { updated?: string }>
}) {
  const params = await searchParams
  const preview = parseApplyPreview(params)
  const ctx = await loadApplyContext(preview)
  const showUpdated = params.updated === '1'

  if (ctx.isPreview && ctx.cycle) {
    const title = applicationTitle(ctx.cycle.name)
    return (
      <ApplyShell title={title} preview>
        <WelcomeCard>
          <p className="whitespace-pre-wrap text-base sm:text-lg leading-relaxed">{ctx.cycle.introMarkdown}</p>
          <Link
            href={applyPreviewHref('/apply/personal', ctx.cycle.id)}
            className="inline-flex cursor-pointer self-center rounded-[40px] bg-[#315CA9] px-6 py-3 font-semibold text-white font-inter transition-all duration-300 hover:scale-105 hover:shadow-md"
          >
            Continue application
          </Link>
        </WelcomeCard>
      </ApplyShell>
    )
  }

  if (ctx.isBrother && !ctx.isAdmin) {
    return (
      <ApplyShell title={ctx.cycle ? applicationTitle(ctx.cycle.name) : 'Application'}>
        <WelcomeCard>
          <p className="text-base sm:text-lg leading-relaxed">You&apos;re signed in as a brother.</p>
          <p className="text-base sm:text-lg leading-relaxed">
            This application is only available to rushees applying this cycle. Please switch accounts to apply, or return to the Brother Portal to continue.
          </p>
          <Link
            href="/portal"
            className="inline-flex cursor-pointer self-center rounded-[40px] bg-[#315CA9] px-6 py-3 font-semibold text-white font-inter transition-all duration-300 hover:scale-105 hover:shadow-md"
          >
            Go to brother portal
          </Link>
        </WelcomeCard>
      </ApplyShell>
    )
  }

  if (!ctx.cycle) {
    return (
      <ApplyShell title="Applications are closed">
        <WelcomeCard>
          <p>There is no active rush application cycle right now. Please apply next semester.</p>
        </WelcomeCard>
      </ApplyShell>
    )
  }

  const title = applicationTitle(ctx.cycle.name)
  const windowClosed = ctx.window && !ctx.window.isOpen
  const closedCopy = ctx.window?.isBeforeOpen
    ? `Applications open ${new Date(ctx.cycle.opensAt).toLocaleString()}.`
    : applicationClosedMessage(ctx.cycle.name, ctx.cycle.closedMarkdown)

  if (!ctx.user) {
    if (windowClosed) {
      return (
        <ApplyShell title={title}>
          <WelcomeCard>
            <p>{closedCopy}</p>
          </WelcomeCard>
        </ApplyShell>
      )
    }
    return (
      <ApplyShell title={title}>
        <WelcomeCard>
          <p className="whitespace-pre-wrap text-base sm:text-lg leading-relaxed">{ctx.cycle.introMarkdown}</p>
          <UmichGoogleButton next="/apply" />
        </WelcomeCard>
      </ApplyShell>
    )
  }

  if (ctx.application?.status === 'submitted') {
    const canEdit = Boolean(ctx.window?.isOpen || ctx.isAdmin)

    return (
      <ApplyShell title={title}>
        <ApplySubmittedHome
          applicationId={ctx.application.id}
          closesAt={ctx.cycle!.closesAt}
          submittedAt={ctx.application.submittedAt}
          updated={showUpdated && canEdit}
          canEdit={canEdit}
          fields={ctx.application.fields}
          answers={ctx.answers}
          questions={ctx.questions}
          files={ctx.files}
        />
      </ApplyShell>
    )
  }

  if (ctx.window && !ctx.window.isOpen && !ctx.isAdmin) {
    return (
      <ApplyShell title={title}>
        <WelcomeCard>
          <p>{closedCopy}</p>
        </WelcomeCard>
      </ApplyShell>
    )
  }

  const adminHasProgress =
    ctx.isAdmin &&
    (Object.values(ctx.application?.fields ?? {}).some((value) =>
      Array.isArray(value) ? value.length > 0 : value != null && value !== ''
    ) ||
      Object.values(ctx.answers).some((answer) => answer.trim()) ||
      Object.keys(ctx.files).length > 0)

  const continueLabel = ctx.isAdmin
    ? adminHasProgress
      ? 'Continue as administrator'
      : 'Start as administrator'
    : 'Continue application'

  return (
    <ApplyShell title={title}>
      <WelcomeCard>
        <p className="whitespace-pre-wrap text-base sm:text-lg leading-relaxed">{ctx.cycle.introMarkdown}</p>
        {ctx.isAdmin ? (
          <p className="self-center text-center text-sm leading-relaxed text-[#315CA9]">
            You are testing as an administrator. Your responses are saved to a live draft for this
            cycle. If you submit, please delete the test application afterward so it is not reviewed
            with real applicants.
          </p>
        ) : null}
        <p className="self-center text-sm text-gray-500">Signed in as {ctx.user.email}</p>
        <Link
          href="/apply/personal"
          className="inline-flex cursor-pointer self-center rounded-[40px] bg-[#315CA9] px-6 py-3 font-semibold text-white font-inter transition-all duration-300 hover:scale-105 hover:shadow-md"
        >
          {continueLabel}
        </Link>
      </WelcomeCard>
    </ApplyShell>
  )
}

function WelcomeCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full rounded-2xl border border-gray-100 px-6 py-10 text-left sm:px-10 sm:py-12"
      style={applyCardStyle}
    >
      <div className="flex w-full flex-col items-start gap-8">
        {children}
      </div>
    </div>
  )
}
