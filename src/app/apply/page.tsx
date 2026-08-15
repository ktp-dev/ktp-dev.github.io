import Link from 'next/link'
import { ApplyRecap } from '@/components/apply/ApplySectionForm'
import { applyCardStyle, ApplyShell } from '@/components/apply/ApplyShell'
import { UmichGoogleButton } from '@/components/apply/UmichGoogleButton'
import { loadApplyContext } from '@/lib/apply-load'
import { applicationTitle } from '@/lib/apply-steps'

export default async function ApplyWelcomePage() {
  const ctx = await loadApplyContext()

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
    : 'The deadline for this cycle has passed. Please apply next semester.'

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
    return (
      <ApplyShell title={title}>
        <WelcomeCard>
          <p>
            Your application has been submitted
            {ctx.application.submittedAt
              ? ` (${new Date(ctx.application.submittedAt).toLocaleString()})`
              : ''}
            . Responses below are locked.
          </p>
          <div className="w-full text-left">
            <ApplyRecap
              fields={ctx.application.fields}
              answers={ctx.answers}
              questions={ctx.questions}
              files={ctx.files}
            />
          </div>
        </WelcomeCard>
      </ApplyShell>
    )
  }

  if (ctx.window && !ctx.window.isOpen) {
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
        <p className="self-center text-sm text-gray-500">Signed in as {ctx.user.email}</p>
        <Link
          href="/apply/personal"
          className="inline-flex cursor-pointer self-center rounded-[40px] bg-[#315CA9] px-6 py-3 font-semibold text-white font-inter transition-all duration-300 hover:scale-105 hover:shadow-md"
        >
          Continue application
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
