import { redirect } from 'next/navigation'
import { AdminAppDetail } from '@/components/admin/AdminAppDetail'
import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { AdminQuickLinks } from '@/components/admin/AdminQuickLinks'
import Unauthorized from '@/components/Unauthorized'
import { getAdjacentAdminApplications, getApplicationReviewDetailsForAdmin } from '@/lib/admin-applications'
import { getAdminCycle } from '@/lib/rush-cycles'
import { checkIsAdmin, getCurrentUser } from '@/lib/supabase/auth-helpers'

const sectionCardClass =
  'rounded-xl border border-gray-100 p-6 transform transition-all duration-300 ease-in-out hover:shadow-[0_12px_36px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05)]'
const sectionCardStyle = {
  backgroundColor: 'rgba(249, 250, 251, 0.95)',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
}

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
      <div className={sectionCardClass} style={sectionCardStyle}>
        <AdminAppDetail
          detail={detail}
          prevApplicationId={prevId}
          nextApplicationId={nextId}
        />
      </div>
    </AdminPageShell>
  )
}
