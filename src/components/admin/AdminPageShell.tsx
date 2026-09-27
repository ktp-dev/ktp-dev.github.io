import type { ReactNode } from 'react'
import Header from '@/components/Header'
import { PortalBlobsDesktop, PortalBlobsMobile } from '@/components/PortalBlobs'
import { PortalDarkChrome } from '@/components/PortalDarkChrome'

/** Admin is brother-only — always use dark navy chrome matching /portal. */
export function AdminPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#0f172a]">
      <PortalDarkChrome />
      <PortalBlobsMobile tone="dark" />
      <Header tone="dark" />
      <div className="relative flex-1 px-6 sm:px-8 md:px-16 lg:px-20">
        <PortalBlobsDesktop tone="dark" />
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
  'tap-text cursor-pointer text-sm font-semibold text-white transition-colors hover:opacity-90'
