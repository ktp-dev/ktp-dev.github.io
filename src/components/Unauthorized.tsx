import Link from 'next/link'
import Header from './Header'

export default function Unauthorized() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="flex-1 px-6 sm:px-8 md:px-16 lg:px-20">
        <div className="relative w-full z-10">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            {/* Blob Container */}
            <div className="inset-0 blob-c z-0 absolute">
              <div className="shape-blob eight"></div>
              <div className="shape-blob nine"></div>
            </div>

            {/* Error Card */}
            <div className="bg-white rounded-lg shadow-xl p-8 sm:p-12 max-w-md w-full mx-auto relative z-10">
              <div className="text-center">
                {/* Error Icon */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                  <svg
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>

                {/* Error Message */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 font-inter">
                  Access Denied
                </h1>
                <p className="text-gray-600 mb-8 text-lg">
                  You have not been authorized as an admin.
                </p>

                {/* Home Button */}
                <Link href="/">
                  <button
                    className="w-full px-6 py-3 bg-[#315CA9] text-white rounded-[40px] text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer font-inter"
                  >
                    Return to Homepage
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

