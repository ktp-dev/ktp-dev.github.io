import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // During build/SSR (window is undefined), use placeholders to prevent errors
  // In the browser, these should always be set
  if (!url || !key) {
    if (typeof window !== 'undefined') {
      // In browser, throw error if missing
      throw new Error('Missing Supabase environment variables')
    }
    // During build/SSR, return placeholder (won't be used since we call this in useEffect)
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key')
  }

  return createBrowserClient(url, key)
}

