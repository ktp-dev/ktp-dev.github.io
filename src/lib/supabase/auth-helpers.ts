import { cache } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from './server'

/**
 * Get the current authenticated user (deduped per request).
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

/**
 * Check if the current user is an admin.
 * Pass `user` when already loaded to avoid a redundant auth lookup.
 */
export async function checkIsAdmin(existingUser?: User | null) {
  const supabase = await createClient()
  const user = existingUser ?? (await getCurrentUser())

  if (!user) {
    return null
  }

  if (!user.email?.endsWith('@umich.edu')) {
    return null
  }

  const { data: admin, error: adminError } = await supabase
    .from('admins')
    .select('email')
    .eq('email', user.email.toLowerCase())
    .single()

  if (adminError) {
    if (adminError.code !== 'PGRST116') {
      console.error('Unexpected error checking admin status:', adminError)
    }
    return null
  }

  if (!admin) {
    return null
  }

  return user
}

/**
 * Logged-in @umich.edu user (applicant or admin).
 */
export async function requireUser() {
  const user = await getCurrentUser()
  if (!user?.email?.toLowerCase().endsWith('@umich.edu')) {
    return null
  }
  return user
}
