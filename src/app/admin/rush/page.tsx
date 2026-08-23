import { redirect } from 'next/navigation'
import AdminRushDashboard from '@/components/AdminRushDashboard'
import { AdminPageShell } from '@/components/admin/AdminPageShell'
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
      <h1
        className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 font-inter text-black"
        style={{ fontWeight: '900', letterSpacing: '-0.02em' }}
      >
        Rush
      </h1>

      <AdminQuickLinks currentPath="/admin/rush" />

      <AdminRushDashboard initialCycles={cycles} initialBundle={initialBundle} />
    </AdminPageShell>
  )
}
