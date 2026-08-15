import { ApplySectionForm } from '@/components/apply/ApplySectionForm'
import { ApplyShell } from '@/components/apply/ApplyShell'
import { requireApplyDraft } from '@/lib/apply-load'
import { applicationTitle, type ApplyStepSlug } from '@/lib/apply-steps'

export async function ApplyDraftSection({ step }: { step: ApplyStepSlug }) {
  const ctx = await requireApplyDraft()

  return (
    <ApplyShell current={step} title={applicationTitle(ctx.cycle.name)}>
      <ApplySectionForm
        step={step}
        payload={{
          applicationId: ctx.application.id,
          fields: ctx.application.fields,
          answers: ctx.answers,
          files: ctx.files,
          questions: ctx.questions,
          hearAboutOptions: ctx.cycle.hearAboutOptions ?? [],
        }}
      />
    </ApplyShell>
  )
}
