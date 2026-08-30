import { redirect } from 'next/navigation'
import { AdminAppDetail } from '@/components/admin/AdminAppDetail'
import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { AdminQuickLinks } from '@/components/admin/AdminQuickLinks'
import Unauthorized from '@/components/Unauthorized'
import { getAdjacentAdminApplications, getApplicationReviewDetailsForAdmin } from '@/lib/admin-applications'
import { getAdminCycle } from '@/lib/rush-cycles'
import { checkIsAdmin, getCurrentUser } from '@/lib/supabase/auth-helpers'

export default async function AdminAppDetailPage({
  params,
}: {
  params: Promise<{ applicationId: string }>
}) {
  const { applicationId } = await params
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/login')

  const adminUser = await checkIsAdmin()
  if (!adminUser) return <Unauthorized />

  const { cycle } = await getAdminCycle()
  if (!cycle) redirect('/admin/apps')

  const detail = await getApplicationReviewDetailsForAdmin(cycle.id, applicationId)
  if (!detail) redirect('/admin/apps')

  const { prevId, nextId } = await getAdjacentAdminApplications(cycle.id, applicationId)

  return (
    <AdminPageShell>
      <AdminQuickLinks currentPath="/admin/apps" />
      <AdminAppDetail
        cycleId={cycle.id}
        detail={detail}
        prevApplicationId={prevId}
        nextApplicationId={nextId}
      />
    </AdminPageShell>
  )
}
