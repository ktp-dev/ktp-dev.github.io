import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import TypedHeadline from '@/components/members/TypedHeadline'
import MembersDirectory from '@/components/members/MembersDirectory'
import { getMembersPageData } from '@/lib/members-page-data'

export default function Members() {
  const { activeMembers, alumni, leadership } = getMembersPageData()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <ScrollToTop />

      {/* Spill clip — `page-spill-clip` is relative only on mobile (desktop CB unchanged) */}
      <div className="page-spill-clip w-full max-w-full flex-1 overflow-x-hidden">
        <div className="absolute left-0 right-0 top-0 z-0 blob-c members-mobile-blobs members-hero-blobs">
          <div className="shape-blob eight"></div>
          <div className="shape-blob nine"></div>
        </div>

        <div className="relative z-10 px-6 sm:px-8 md:px-16 lg:px-20">
          <div className="relative z-10 pt-12 sm:pt-16">
            <div className="flex flex-col text-center">
              <h1
                className="mb-0 text-3xl font-black sm:text-4xl md:text-5xl"
                style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}
              >
                We Are A Team of <br className="lg:hidden" />
                <span className="inline">
                  <TypedHeadline />
                </span>
              </h1>

              <p
                className="mx-auto mb-8 mt-8 max-w-2xl text-base font-medium text-gray-600 sm:text-xl"
                style={{ color: 'grey' }}
              >
                What makes our community strong is our shared passion for technology and our
                unique backgrounds meshing together as one.
              </p>
            </div>
          </div>

          <MembersDirectory
            activeMembers={activeMembers}
            alumni={alumni}
            leadership={leadership}
          />
        </div>

        <Footer />
      </div>
    </div>
  )
}
