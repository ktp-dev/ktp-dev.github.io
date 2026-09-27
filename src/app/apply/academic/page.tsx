import { ApplyDraftSection } from '../ApplyDraftSection'
import type { ApplyPreviewQuery } from '@/lib/apply-preview'

export default function Page({
  searchParams,
}: {
  searchParams: Promise<ApplyPreviewQuery>
}) {
  return <ApplyDraftSection step="academic" searchParams={searchParams} />
}
