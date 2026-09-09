import { redirect } from 'next/navigation'
import {
  AdminPageShell,
  adminPageTitleStyle,
} from '@/components/admin/AdminPageShell'
import { AdminQuickLinks } from '@/components/admin/AdminQuickLinks'
import { SignedInAccountBar } from '@/components/SignedInAccountBar'
import Unauthorized from '@/components/Unauthorized'
import { checkIsAdmin, getCurrentUser } from '@/lib/supabase/auth-helpers'

function VerifiedCheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="ml-2.5 inline-block h-[0.7em] w-[0.7em] shrink-0 text-[#60a5fa]"
      aria-label="Verified admin"
      role="img"
    >
      <path
        fillRule="evenodd"
        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default async function AdminPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/login')

  const adminUser = await checkIsAdmin()
  if (!adminUser) return <Unauthorized />

  const email = adminUser.email ?? currentUser.email ?? undefined

  return (
    <AdminPageShell>
      <div className="mb-8">
        <h1
          className="mb-3 flex flex-wrap items-center font-inter text-3xl font-black text-white sm:text-4xl md:text-5xl"
          style={adminPageTitleStyle}
        >
          Admin Dashboard
          <VerifiedCheckIcon />
        </h1>
        <SignedInAccountBar
          tone="dark"
          variant="compact"
          align="start"
          email={email}
        />
      </div>

      <AdminQuickLinks variant="home" />
    </AdminPageShell>
  )
}
