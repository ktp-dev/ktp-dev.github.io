import Footer from '@/components/Footer'
import Header from '@/components/Header'

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="blob-c inset-0 z-0" style={{ overflow: 'visible' }}>
          <div className="shape-blob eight" style={{ left: 'calc(28% - 40px)', top: '4%' }} />
          <div className="shape-blob nine" style={{ left: 'calc(52% - 20px)', top: '6%' }} />
        </div>
      </div>
      <Header />
      <div className="relative z-10 flex flex-1 flex-col px-6 sm:px-8 md:px-16 lg:px-20">
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
      <div className="relative z-10 mt-auto shrink-0">
        <Footer />
      </div>
    </div>
  )
}
