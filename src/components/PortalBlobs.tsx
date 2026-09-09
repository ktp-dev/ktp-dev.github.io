/** Shared decorative blobs for PortalShell + AdminPageShell. */

export function PortalBlobShapes({ tone }: { tone: 'light' | 'dark' }) {
  const isDark = tone === 'dark'

  if (isDark) {
    return (
      <>
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
      </>
    )
  }

  return (
    <>
      <div className="shape-blob eight" style={{ left: 'calc(8% - 40px)', top: '-1%' }} />
      <div className="shape-blob nine" style={{ left: 'calc(22% - 20px)', top: '3%' }} />
      <div
        className="shape-blob eight"
        style={{ left: 'auto', right: '-2%', top: 'auto', bottom: '-4%' }}
      />
      <div
        className="shape-blob nine"
        style={{ left: 'auto', right: '6%', top: 'auto', bottom: '2%' }}
      />
    </>
  )
}

/** Mobile soft freeze/no-blur — place on outer page CB. CSS: max-width 1023 only. */
export function PortalBlobsMobile({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const toneClass =
    tone === 'dark' ? 'portal-mobile-blobs--dark' : 'portal-mobile-blobs--light'

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 blob-c portal-mobile-blobs lg:hidden ${toneClass}`}
    >
      <PortalBlobShapes tone={tone} />
    </div>
  )
}

/** Desktop original blur — place inside the padded relative content wrapper. */
export function PortalBlobsDesktop({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hidden blob-c lg:block"
      style={{ overflow: 'visible' }}
    >
      <PortalBlobShapes tone={tone} />
    </div>
  )
}
