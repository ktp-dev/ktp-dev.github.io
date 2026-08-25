import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NationalsIconBarGate from '@/components/nationals/NationalsIconBarGate'
import NationalsMap from '@/components/nationals/NationalsMap'

const logos = [
  { src: '/images/universities/michigan.png', alt: 'University of Michigan' },
  { src: '/images/universities/pitt.png', alt: 'University of Pittsburgh' },
  { src: '/images/universities/syracuse.png', alt: 'Syracuse University' },
  { src: '/images/universities/rutgers.png', alt: 'Rutgers University' },
  { src: '/images/universities/bu.png', alt: 'Boston University' },
  { src: '/images/universities/usc.png', alt: 'University of Southern California' },
  { src: '/images/universities/northwestern.png', alt: 'Northwestern University' },
  { src: '/images/universities/uchicago.png', alt: 'University of Chicago' },
  { src: '/images/universities/unc.png', alt: 'University of North Carolina' },
  { src: '/images/universities/maryland.png', alt: 'University of Maryland' },
  { src: '/images/universities/texas.png', alt: 'University of Texas at Austin' },
  { src: '/images/universities/colorado.png', alt: 'University of Colorado Boulder' },
] as const

export default function Nationals() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Spill clip — relative only on mobile; desktop CB unchanged */}
      <div className="page-spill-clip flex w-full max-w-full flex-grow flex-col overflow-x-hidden">
        {/* Mobile hero blobs — top/left only (never inset-0) */}
        <div className="absolute left-0 right-0 top-0 z-0 blob-c nationals-mobile-blobs nationals-hero-blobs lg:hidden">
          <div className="shape-blob eight"></div>
          <div className="shape-blob nine"></div>
        </div>

        {/* Desktop blobs — same positions as before (untouched by mobile rules) */}
        <div className="absolute inset-0 z-0 hidden blob-c lg:block">
          <div className="shape-blob eight" style={{ left: '10%', top: '15%' }}></div>
          <div className="shape-blob nine" style={{ left: '10%', top: '30%' }}></div>
        </div>

        <div className="relative z-10 flex w-full flex-grow flex-col justify-center">
          <div className="relative z-10 pt-12 sm:pt-16 lg:pt-0">
            <div className="flex flex-col items-center justify-center px-6 sm:px-8 md:px-12 lg:flex-row lg:px-20">
              <div className="relative mb-12 w-full text-center md:w-3/4 lg:mb-0 lg:w-1/3 lg:text-left">
                <h1
                  className="font-inter relative z-10 mb-8 text-3xl font-black sm:text-4xl md:text-5xl"
                  style={{ fontWeight: '900', letterSpacing: '-0.02em' }}
                >
                  KTP Nationals
                </h1>
                <p
                  className="relative z-10 mb-8 mt-8 text-base font-medium leading-relaxed text-gray-600 sm:text-xl"
                  style={{ color: 'grey' }}
                >
                  With over 15+ chapters across the nation, KTP grows by day.
                </p>

                <NationalsIconBarGate />

                <a
                  href="mailto:ktp-board@umich.edu"
                  className="contact-us font-inter relative z-10 mx-auto mt-12 flex h-16 w-full max-w-[620px] cursor-pointer flex-row items-center justify-center whitespace-nowrap px-6 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-blue-500/15 sm:px-12 sm:text-base lg:mx-0"
                  style={{ boxShadow: '0 4px 12px rgba(0,59,114,0.3)' }}
                >
                  <div className="relative mr-4 flex items-center">
                    <div className="relative flex items-center" style={{ width: '54px', height: '24px' }}>
                      <Image
                        src="/images/universities/uchicago.png"
                        alt="University of Chicago"
                        width={24}
                        height={24}
                        className="absolute left-0 z-[1] h-6 w-6 rounded-md"
                      />
                      <Image
                        src="/images/universities/michigan.png"
                        alt="University of Michigan"
                        width={24}
                        height={24}
                        className="absolute z-[2] h-6 w-6 rounded-md"
                        style={{ left: '18px' }}
                      />
                      <Image
                        src="/images/universities/northwestern.png"
                        alt="Northwestern University"
                        width={24}
                        height={24}
                        className="absolute z-[1] h-6 w-6 rounded-md"
                        style={{ left: '36px' }}
                      />
                    </div>
                  </div>
                  <span>Start a KTP Chapter</span>
                </a>
              </div>

              <div className="mb-16 flex w-full justify-center lg:mb-0 lg:w-2/3 lg:justify-end">
                {/* Map mounts only at lg+ (see NationalsMap matchMedia gate) */}
                <div className="hidden h-[500px] w-3/4 lg:block">
                  <NationalsMap />
                </div>

                {/* Logo grid — mobile/tablet */}
                <div className="logos-grid grid w-full max-w-4xl grid-cols-3 justify-items-center gap-6 px-8 sm:grid-cols-4 sm:gap-8 sm:px-12 lg:hidden">
                  {logos.map((logo) => (
                    <div key={logo.src} className="logo-container-2 relative">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        fill
                        sizes="(max-width: 640px) 28vw, 20vw"
                        className="logo-image object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}
