import Header from '@/components/Header'
import { PortalBlobsDesktop, PortalBlobsMobile } from '@/components/PortalBlobs'
import { PortalDarkChrome } from '@/components/PortalDarkChrome'
import { SignedInAccountBar } from '@/components/SignedInAccountBar'

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
  'tap-press inline-flex px-4 py-2 bg-[#315CA9] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'

/** Dark / frosty variants — same structure as light cards; do not edit the light exports above. */
export const portalDarkSectionCardClass =
  'rounded-xl border p-6 transform transition-all duration-300 ease-in-out'
export const portalDarkSectionCardStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.06)',
  borderColor: 'rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.28)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
}
export const portalDarkInnerCardClass =
  'flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-all duration-200'
export const portalDarkInnerCardStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.07)',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
}

export function PortalShell({
  title,
  subtitle,
  headerRight,
  children,
  tone = 'light',
}: {
  title: string
  subtitle?: React.ReactNode
  headerRight?: React.ReactNode
  children: React.ReactNode
  tone?: 'light' | 'dark'
}) {
  const isDark = tone === 'dark'
  const blobTone = isDark ? 'dark' : 'light'

  return (
    <div className={`relative min-h-screen ${isDark ? 'bg-[#0f172a]' : ''}`}>
      {isDark ? <PortalDarkChrome /> : null}
      {/* Mobile blobs on outer CB so long pages keep corner glows; desktop stays padded */}
      <PortalBlobsMobile tone={blobTone} />
      <Header tone={isDark ? 'dark' : 'light'} />

      <div className="relative flex-1 px-6 sm:px-8 md:px-16 lg:px-20">
        <PortalBlobsDesktop tone={blobTone} />

        <div className="relative z-10 w-full">
          <div className="pb-12 pt-12 sm:pt-16">
            <div className="mx-auto max-w-7xl">
              {isDark ? null : (
                <SignedInAccountBar className="mb-4" align="end" tone="light" />
              )}
              <div className={`relative mb-8 ${headerRight ? 'pr-28 sm:pr-32 md:pr-36' : ''}`}>
                <h1
                  className={`font-inter text-3xl font-black sm:text-4xl md:text-5xl ${
                    isDark ? 'text-white' : 'text-black'
                  } ${subtitle ? 'mb-3' : ''}`}
                  style={{ fontWeight: '900', letterSpacing: '-0.02em' }}
                >
                  {title}
                </h1>
                {subtitle ? (
                  isDark ? (
                    <div className="font-inter">{subtitle}</div>
                  ) : (
                    <h2 className="font-inter text-xl font-bold text-gray-800">{subtitle}</h2>
                  )
                ) : null}
                {headerRight ? (
                  <div className="pointer-events-none absolute -top-4 right-0 sm:-top-5">
                    {headerRight}
                  </div>
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
