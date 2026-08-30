import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/supabase/auth-helpers'
import { getBrotherByUmichEmail, type ClientBrother } from '@/lib/brothers'

export async function requirePortalUser(): Promise<{
  email: string
  brother: ClientBrother
}> {
  const currentUser = await getCurrentUser()
  if (!currentUser?.email) {
    redirect('/login')
  }
  const brother = await getBrotherByUmichEmail(currentUser.email)
  if (!brother) {
    redirect('/apply')
  }
  return { email: currentUser.email, brother }
}
