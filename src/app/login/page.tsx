'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import Header from '@/components/Header'
import { UmichGoogleButton } from '@/components/apply/UmichGoogleButton'

function LoginContent() {
  const searchParams = useSearchParams()
  const authFailed = searchParams.get('error') === 'auth_failed'

  return (
    <div className="relative z-10 mx-auto w-full max-w-lg text-center">
      <h1
        className="relative z-10 mb-4 font-inter text-4xl font-black text-white sm:text-5xl md:text-6xl"
        style={{ fontWeight: '900', letterSpacing: '-0.02em' }}
      >
        Brother Portal
      </h1>
      <p className="relative z-10 mb-10 text-base leading-relaxed text-slate-300 sm:text-lg">
        Sign in with your UMich Google account to open the brother portal. Applicants should use the
        rush application instead.
      </p>

      {authFailed ? (
        <p className="relative z-10 mb-6 text-sm text-red-400">Sign-in failed. Please try again.</p>
      ) : null}

      <div className="relative z-10">
        <UmichGoogleButton next="/portal" label="Log in with Google" />
      </div>

      <p className="relative z-10 mt-8 text-sm text-slate-400">
        Applying this cycle?{' '}
        <Link href="/apply" className="font-semibold text-white transition-opacity hover:opacity-80">
          Go to the rush application
        </Link>
      </p>
    </div>
  )
}

export default function Login() {
  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    const prevRoot = root.style.backgroundColor
    const prevBody = body.style.backgroundColor
    root.style.backgroundColor = '#0f172a'
    body.style.backgroundColor = '#0f172a'
    return () => {
      root.style.backgroundColor = prevRoot
      body.style.backgroundColor = prevBody
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-[#0f172a]">
      {/*
        Mobile blobs on the outer CB (not inside max-w-lg / page-spill-clip).
        Horizontal centering via 50%/50vh in CSS. Sideways spill clipped by
        .login-mobile-blobs { overflow: hidden } — same as apply-hero-blobs.
        top/left only — never inset-0. No h-full (collapses / clips the stack).
      */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-0 block blob-c login-mobile-blobs lg:hidden">
        <div className="shape-blob eight" />
        <div className="shape-blob nine" />
      </div>

      <Header tone="dark" />

      {/*
        No overflow-x here — it forces overflow-y clipping too and cuts the
        desktop blur at the bottom. Mobile blobs sit outside with their own
        overflow:hidden; html overflow-x:clip handles page spill.
      */}
      <div className="relative w-full max-w-full flex-1">
        {/* Desktop — original blurred blobs (full page) */}
        <div
          className="pointer-events-none absolute inset-0 z-0 hidden blob-c lg:block"
          style={{ overflow: 'visible' }}
        >
          <div
            className="shape-blob eight"
            style={{
              background: 'rgba(255, 255, 255, 0.14)',
              top: 'calc(50vh - 87.5px)',
            }}
          />
          <div
            className="shape-blob nine"
            style={{
              background: 'rgba(168, 212, 255, 0.18)',
              top: 'calc(50vh - 87.5px)',
            }}
          />
        </div>

        <div className="relative z-10 flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-6 py-16 sm:px-8 md:px-16 lg:px-20">
          <Suspense fallback={null}>
            <LoginContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
