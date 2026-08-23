import type { ReactNode } from 'react'
import Header from '@/components/Header'

export function AdminPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex-1 px-6 sm:px-8 md:px-16 lg:px-20 relative">
        <div className="inset-0 blob-c z-0" style={{ overflow: 'visible' }}>
          <div className="shape-blob eight" style={{ left: 'calc(8% - 40px)', top: '-1%' }}></div>
          <div className="shape-blob nine" style={{ left: 'calc(22% - 20px)', top: '3%' }}></div>
          <div className="shape-blob eight" style={{ left: 'auto', right: '-2%', top: 'auto', bottom: '-4%' }}></div>
          <div className="shape-blob nine" style={{ left: 'auto', right: '6%', top: 'auto', bottom: '2%' }}></div>
        </div>
        <div className="relative w-full z-10">
          <div className="pt-12 sm:pt-16">
            <div className="max-w-7xl mx-auto pb-16">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
