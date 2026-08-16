import Header from '@/components/Header'

export const portalSectionCardClass =
  'rounded-xl border border-gray-100 p-6 transform transition-all duration-300 ease-in-out hover:shadow-[0_12px_36px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05)]'
export const portalSectionCardStyle = {
  backgroundColor: 'rgba(249, 250, 251, 0.95)',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
}
export const portalInnerCardClass =
  'flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-4 py-3'
export const portalInnerCardStyle = { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)' }
export const portalBtnClass =
  'inline-flex px-4 py-2 bg-[#315CA9] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'

export function PortalShell({
  title,
  subtitle,
  headerRight,
  children,
}: {
  title: string
  subtitle?: React.ReactNode
  headerRight?: React.ReactNode
  children: React.ReactNode
}) {
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
          <div className="pt-12 sm:pt-16 pb-12">
            <div className="max-w-7xl mx-auto">
              <div className={`relative mb-8 ${headerRight ? 'pr-28 sm:pr-32 md:pr-36' : ''}`}>
                <h1
                  className={`text-3xl sm:text-4xl md:text-5xl font-black font-inter text-black ${subtitle ? 'mb-3' : ''}`}
                  style={{ fontWeight: '900', letterSpacing: '-0.02em' }}
                >
                  {title}
                </h1>
                {subtitle ? (
                  <h2 className="text-xl font-bold font-inter text-gray-800">{subtitle}</h2>
                ) : null}
                {headerRight ? (
                  <div className="pointer-events-none absolute -top-4 right-0 sm:-top-5">{headerRight}</div>
                ) : null}
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
