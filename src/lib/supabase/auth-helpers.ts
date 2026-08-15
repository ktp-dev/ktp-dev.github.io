import { createClient } from './server'

/**
 * Check if the current user is an admin
 * Returns the user if they are an admin, null otherwise
 */
export async function checkIsAdmin() {
  const supabase = await createClient()
  
  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    console.error('Error getting user:', userError)
    return null
  }

  if (!user) {
    console.log('No user found')
    return null
  }

  console.log('User found:', user.email, 'User ID:', user.id)

  // Check if email ends with @umich.edu
  if (!user.email?.endsWith('@umich.edu')) {
    console.log('Email does not end with @umich.edu:', user.email)
    return null
  }

  const { data: admin, error: adminError } = await supabase
    .from('admins')
    .select('email')
    .eq('email', user.email.toLowerCase())
    .single()

  if (adminError) {
    // If it's a "not found" error (PGRST116), that's expected for non-admins
    // Only log unexpected errors
    if (adminError.code !== 'PGRST116') {
      console.error('Unexpected error checking admin status:', adminError)
    }
    return null
  }

  if (!admin) {
    console.log('User is not in admins table')
    return null
  }

  console.log('User is admin!')
  return user
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
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

