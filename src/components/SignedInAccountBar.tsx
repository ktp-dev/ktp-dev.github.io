'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function SignedInAccountBar({
  className = '',
  align = 'end',
  tone = 'light',
  variant = 'default',
  email: emailProp,
}: {
  className?: string
  align?: 'start' | 'end' | 'center'
  tone?: 'light' | 'dark'
  /** default = "Signed in as …"; compact = portal subtitle; minimal = email + sign out, apply-sized */
  variant?: 'default' | 'compact' | 'minimal'
  /** Optional initial email (avoids empty flash when known server-side) */
  email?: string
}) {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(emailProp ?? null)
  const [pending, setPending] = useState(false)
  const isDark = tone === 'dark'
  const isCompact = variant === 'compact'
  const isMinimal = variant === 'minimal'

  useEffect(() => {
    const supabase = createClient()

    void supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!email) return null

  async function handleSignOut() {
    setPending(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const alignClass =
    align === 'start' ? 'justify-start' : align === 'center' ? 'justify-center' : 'justify-end'

  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${
        isMinimal
          ? isDark
            ? 'text-sm text-slate-400'
            : 'text-sm text-gray-600'
          : isCompact
            ? isDark
              ? 'text-xl font-bold text-slate-300'
              : 'text-xl font-bold text-gray-800'
            : isDark
              ? 'text-sm text-slate-400'
              : 'text-sm text-gray-600'
      } ${alignClass} ${className}`}
    >
      {isCompact || isMinimal ? (
        <span className={`min-w-0 truncate ${isMinimal && !isDark ? 'font-medium text-gray-800' : ''}`}>
          {email}
        </span>
      ) : (
        <span className="min-w-0 truncate">
          Signed in as{' '}
          <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
            {email}
          </span>
        </span>
      )}
      <button
        type="button"
        onClick={() => void handleSignOut()}
        disabled={pending}
        className={`shrink-0 cursor-pointer font-semibold transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 ${
          isDark ? 'text-white' : 'text-[#315CA9]'
        }`}
      >
        {pending ? 'Signing out…' : 'Sign out'}
      </button>
    </div>
  )
}
