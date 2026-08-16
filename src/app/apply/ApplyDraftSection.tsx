import { ApplySectionForm } from '@/components/apply/ApplySectionForm'
import { ApplyShell } from '@/components/apply/ApplyShell'
import { requireApplyDraft } from '@/lib/apply-load'
import { parseApplyPreview, type ApplyPreviewQuery } from '@/lib/apply-preview'
import { applicationTitle, type ApplyStepSlug } from '@/lib/apply-steps'

export async function ApplyDraftSection({
  step,
  searchParams,
}: {
  step: ApplyStepSlug
  searchParams: Promise<ApplyPreviewQuery>
}) {
  const preview = parseApplyPreview(await searchParams)
  const ctx = await requireApplyDraft(preview)

  return (
    <ApplyShell current={step} title={applicationTitle(ctx.cycle.name)} preview={ctx.isPreview}>
      <ApplySectionForm
        step={step}
        preview={ctx.isPreview}
        previewCycleId={ctx.isPreview ? ctx.cycle.id : null}
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
