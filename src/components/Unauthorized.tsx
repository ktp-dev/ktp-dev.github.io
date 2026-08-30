import Link from 'next/link'
import Header from './Header'

/** Match apply welcome cards (`ApplyShell` applyCardStyle). */
const cardStyle = {
  backgroundColor: 'rgba(249, 250, 251, 0.95)',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
} as const

export default function Unauthorized() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* Mobile only — mid-viewport like login. Desktop stack below stays as-is. */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-0 blob-c unauthorized-mobile-blobs lg:hidden">
        <div className="shape-blob eight" />
        <div className="shape-blob nine" />
      </div>

      <Header />

      <div className="page-spill-clip flex flex-1 flex-col overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
          <div className="inset-0 z-0 blob-c" style={{ overflow: 'visible' }}>
            <div className="shape-blob eight" style={{ left: 'calc(28% - 40px)', top: '18%' }} />
            <div className="shape-blob nine" style={{ left: 'calc(52% - 20px)', top: '22%' }} />
          </div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-8 md:px-16 lg:px-20">
          <div
            className="w-full max-w-md rounded-2xl border border-gray-100 px-6 py-10 text-center sm:px-10 sm:py-12"
            style={cardStyle}
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#315CA9]/10">
              <svg
                className="h-8 w-8 text-[#315CA9]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h1 className="mb-4 font-inter text-2xl font-bold text-gray-900 sm:text-3xl">
              Access Denied
            </h1>
            <p className="mb-8 text-lg text-gray-600">
              You have not been authorized as an admin.
            </p>

            <Link
              href="/"
              className="tap-press inline-flex w-full cursor-pointer items-center justify-center rounded-[40px] bg-[#315CA9] px-6 py-3 font-inter text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-md sm:text-lg"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
