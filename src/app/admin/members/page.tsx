import { redirect } from 'next/navigation'
import AdminListManager from '@/components/AdminListManager'
import BrotherListManager from '@/components/BrotherListManager'
import {
  AdminPageShell,
  adminPageTitleClass,
  adminPageTitleStyle,
} from '@/components/admin/AdminPageShell'
import { AdminQuickLinks } from '@/components/admin/AdminQuickLinks'
import Unauthorized from '@/components/Unauthorized'
import { listAdmins } from '@/lib/admins'
import { listBrothers } from '@/lib/brothers'
import { checkIsAdmin, getCurrentUser } from '@/lib/supabase/auth-helpers'

export default async function AdminMembersPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/login')

  const adminUser = await checkIsAdmin()
  if (!adminUser) return <Unauthorized />

  const [admins, brothers] = await Promise.all([listAdmins(), listBrothers()])

  return (
    <AdminPageShell>
      <h1 className={adminPageTitleClass} style={adminPageTitleStyle}>
        Members
      </h1>

      <AdminQuickLinks currentPath="/admin/members" />

      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
        <AdminListManager currentEmail={adminUser.email ?? ''} initialAdmins={admins} />
        <BrotherListManager currentEmail={adminUser.email ?? ''} initialBrothers={brothers} />
      </div>
    </AdminPageShell>
  )
}
