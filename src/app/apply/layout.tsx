import Footer from '@/components/Footer'
import Header from '@/components/Header'

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      {/*
        Mobile blobs on the outer relative CB (not inside page-spill-clip) so soft
        edges can sit under the sticky header instead of clipping at the nav.
        top/left only — never inset-0.
      */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-0 blob-c apply-mobile-blobs apply-hero-blobs lg:hidden">
        <div className="shape-blob eight" />
        <div className="shape-blob nine" />
      </div>

      <Header />

      {/* Spill clip — relative only on mobile; desktop CB stays the outer `relative` */}
      <div className="page-spill-clip flex flex-1 flex-col overflow-x-hidden">
        {/* Desktop blobs — same positions as before */}
        <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
          <div className="inset-0 z-0 blob-c" style={{ overflow: 'visible' }}>
            <div className="shape-blob eight" style={{ left: 'calc(28% - 40px)', top: '4%' }} />
            <div className="shape-blob nine" style={{ left: 'calc(52% - 20px)', top: '6%' }} />
          </div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col px-6 sm:px-8 md:px-16 lg:px-20">
          <div className="flex flex-1 flex-col">{children}</div>
        </div>
        <div className="relative z-10 mt-auto shrink-0">
          <Footer />
        </div>
      </div>
    </div>
  )
}
