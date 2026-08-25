import type { ReactNode } from 'react'
import Header from '@/components/Header'
import { PortalDarkChrome } from '@/components/PortalDarkChrome'

/** Admin is brother-only — always use dark navy chrome matching /portal. */
export function AdminPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <PortalDarkChrome />
      <Header tone="dark" />
      <div className="relative flex-1 px-6 sm:px-8 md:px-16 lg:px-20">
        <div className="blob-c inset-0 z-0" style={{ overflow: 'visible' }}>
          <div
            className="shape-blob eight"
            style={{
              left: 'calc(8% - 40px)',
              top: '-1%',
              background: 'rgba(255, 255, 255, 0.12)',
            }}
          />
          <div
            className="shape-blob nine"
            style={{
              left: 'calc(22% - 20px)',
              top: '3%',
              background: 'rgba(168, 212, 255, 0.16)',
            }}
          />
          <div
            className="shape-blob eight"
            style={{
              left: 'auto',
              right: '-2%',
              top: 'auto',
              bottom: '-4%',
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          />
          <div
            className="shape-blob nine"
            style={{
              left: 'auto',
              right: '6%',
              top: 'auto',
              bottom: '2%',
              background: 'rgba(168, 212, 255, 0.14)',
            }}
          />
        </div>
        <div className="relative z-10 w-full">
          <div className="pt-12 sm:pt-16">
            <div className="mx-auto max-w-7xl pb-16">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const adminPageTitleClass =
  'mb-8 font-inter text-3xl font-black text-white sm:text-4xl md:text-5xl'
export const adminPageTitleStyle = { fontWeight: '900', letterSpacing: '-0.02em' } as const
export const adminMutedClass = 'text-slate-400'
export const adminBodyClass = 'text-slate-200'
export const adminLinkClass =
  'text-sm font-semibold text-white transition-opacity hover:opacity-80'
