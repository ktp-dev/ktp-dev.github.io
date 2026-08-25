import { redirect } from 'next/navigation'
import AdminRushDashboard from '@/components/AdminRushDashboard'
import {
  AdminPageShell,
  adminPageTitleClass,
  adminPageTitleStyle,
} from '@/components/admin/AdminPageShell'
import { AdminQuickLinks } from '@/components/admin/AdminQuickLinks'
import Unauthorized from '@/components/Unauthorized'
import { getAdminCycle, listRushCycles } from '@/lib/rush-cycles'
import { checkIsAdmin, getCurrentUser } from '@/lib/supabase/auth-helpers'

export default async function AdminRushPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/login')

  const adminUser = await checkIsAdmin()
  if (!adminUser) return <Unauthorized />

  const [cycles, applicationCycle] = await Promise.all([listRushCycles(), getAdminCycle()])
  const initialBundle = applicationCycle.cycle
    ? {
        cycle: applicationCycle.cycle,
        questions: applicationCycle.questions,
        events: applicationCycle.events,
        categories: applicationCycle.categories,
      }
    : null

  return (
    <AdminPageShell>
      <h1 className={adminPageTitleClass} style={adminPageTitleStyle}>
        Rush
      </h1>

      <AdminQuickLinks currentPath="/admin/rush" />

      <AdminRushDashboard initialCycles={cycles} initialBundle={initialBundle} />
    </AdminPageShell>
  )
}
