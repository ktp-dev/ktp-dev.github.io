import { redirect } from 'next/navigation'
import {
  PortalShell,
  portalSectionCardClass,
  portalSectionCardStyle,
} from '@/components/PortalShell'
import { requireReviewer } from '@/lib/review-access'
import { getCurrentUser } from '@/lib/supabase/auth-helpers'
import { getAssignedReviewApplication } from '@/lib/reviews'
import { ReviewSession } from '@/components/portal/ReviewSession'

export default async function PortalReadsReviewPage() {
  const { cycle } = await requireReviewer()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const assigned = await getAssignedReviewApplication(cycle.id, user.id)
  if (!assigned) {
    redirect('/portal/reads')
  }

  return (
    <PortalShell title={`Application #${assigned.displayNumber ?? '—'}`}>
      <div className={`${portalSectionCardClass} mb-4`} style={portalSectionCardStyle}>
        <ReviewSession key={assigned.id} initial={assigned} />
      </div>
    </PortalShell>
  )
}
