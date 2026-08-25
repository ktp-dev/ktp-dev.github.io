import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';

const networkCompanies = [
    { src: '/network/google.svg', alt: 'Google' },
    { src: '/network/microsoft.svg', alt: 'Microsoft' },
    { src: '/network/deloitte.svg', alt: 'Deloitte' },
    { src: '/network/jpmc.svg', alt: 'JP Morgan' },
    { src: '/network/meta.svg', alt: 'Meta' },
    { src: '/network/citadel.svg', alt: 'Citadel' },
    { src: '/network/capitalone.svg', alt: 'Capital One' },
    { src: '/network/spotify.svg', alt: 'Spotify' },
    { src: '/network/bloomberg.svg', alt: 'Bloomberg' },
    { src: '/network/doordash.svg', alt: 'Doordash' },
    { src: '/network/hrt.svg', alt: 'Hudson River Trading' },
    { src: '/network/huntington.svg', alt: 'Huntington' },
    { src: '/network/amazon.svg', alt: 'Amazon' },
    { src: '/network/apple.svg', alt: 'Apple' },
    { src: '/network/tiktok.svg', alt: 'Tiktok' },
    { src: '/network/nvidia.svg', alt: 'Nvidia' },
    { src: '/network/duolingo.svg', alt: 'Duolingo' },
    { src: '/network/janestreet.svg', alt: 'Jane Street' },
    { src: '/network/pwc.svg', alt: 'PWC' },
    { src: '/network/ey.svg', alt: 'EY' },
    { src: '/network/accenture.svg', alt: 'Accenture' },
    { src: '/network/linkedin.svg', alt: 'LinkedIn' },
    { src: '/network/tesla.svg', alt: 'Tesla' },
    { src: '/network/ibm.svg', alt: 'IBM' },
    { src: '/network/cisco.svg', alt: 'Cisco' },
    { src: '/network/asana.svg', alt: 'Asana' },
    { src: '/network/atlassian.svg', alt: 'Atlassian' },
    { src: '/network/slack.svg', alt: 'Slack' },
    { src: '/network/figma.svg', alt: 'Figma' },
    { src: '/network/bleacherreport.svg', alt: 'Bleacher Report' },
    { src: '/network/stripe.svg', alt: 'Stripe' },
    { src: '/network/pnc.svg', alt: 'PNC' },
    { src: '/network/boeing.svg', alt: 'Boeing' },
    { src: '/network/salesforce.svg', alt: 'Salesforce' },
    { src: '/network/mongodb.svg', alt: 'MongoDB' },
    { src: '/network/vmware.svg', alt: 'VMware' },
    { src: '/network/nike.svg', alt: 'Nike' },
    { src: '/network/uber.svg', alt: 'Uber' },
    { src: '/network/netskope.svg', alt: 'Netskope' },
    { src: '/network/att.svg', alt: 'AT&T' },
    { src: '/network/ford.svg', alt: 'Ford' },
    { src: '/network/moderntreasury.svg', alt: 'Modern Treasury' },
    { src: '/network/indeed.svg', alt: 'Indeed' },
    { src: '/network/bofa.svg', alt: 'Bank of America' },
    { src: '/network/workday.svg', alt: 'Workday' },
    { src: '/network/caterpillar.svg', alt: 'Caterpillar' },
    { src: '/network/p_and_g.svg', alt: 'P&G' },
  { src: '/network/viget.svg', alt: 'Viget' },
  { src: '/network/united.svg', alt: 'United' },
]

export default function Home() {
  return (
    <div className='homepage-grid'>
      <Header />
      {/* Clip sideways spill below header — overflow on homepage-grid breaks sticky nav */}
      <div className="relative w-full max-w-full flex-1 overflow-x-hidden">
      {/* Main content */}
      <div className='flex flex-row justify-center xl:justify-between mb-12 md:mb-20 lg:mb-32 px-6 sm:px-8 md:px-12 lg:px-20'>
        <div className="absolute inset-0 blob-c z-0 hidden md:block">
            <div className="shape-blob ten"></div>
            <div className="shape-blob eleven"></div>
        </div>
        <div className='flex-1 flex flex-col items-end'>
          <img src={`/images/home/ae_lighthouse.jpg`} className='hidden xl:block' style={{ width: '250px', transform: 'rotate(10deg)', borderRadius: '25px', marginRight: '60px', marginTop: '20px'}} />
          <img src={`/images/home/rock.JPEG`} className='hidden xl:block' style={{ width: '200px', transform: 'rotate(-19deg)', borderRadius: '25px', marginRight: '20px' }} />
          <img src={`/images/home/agoats.jpeg`} className='hidden xl:block' style={{ width: '300px', transform: 'rotate(10deg)', borderRadius: '25px', marginRight: '120px', marginTop: '-40px' }} />
        </div>

        <div className='flex flex-col flex-none'>
          <div className="absolute inset-0 blob-c home-mobile-blobs z-0 block md:hidden overflow-hidden">
              <div className="shape-blob twelve"></div>
              <div className="shape-blob thirteen"></div>
          </div>
          <div className='flex flex-col items-center justify-center z-10'>
            <div className="font-black text-center w-[375px] sm:w-[450px] md:w-[550px] lg:w-[750px] text-3xl sm:text-3xl md:text-4xl lg:text-5xl mt-24 md:mt-36 font-inter" style={{ fontWeight: '900', letterSpacing: '-0.02em' }}>
            We&apos;re the University of Michigan&apos;s Premier Technology Fraternity
            </div>

            <div className='text-[#707070] text-[16px] text-center mt-8 w-[350px] sm:w-[400px] md:w-[450px] lg:w-[500px] text-sm sm:text-md lg:text-base font-medium'>
              <div>Founded as the first KTP chapter, we&apos;re dedicated to uniting students across the nation for the love of technology.</div>
            </div>

            <Link href="/rush">
              <div className='contact-us text-white font-semibold text-lg mt-8 flex flex-row items-center justify-center font-inter transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 cursor-pointer'>
                Rush
              </div>
            </Link>
          </div>
        </div>

        <div className='flex-1 flex flex-col items-start'>
          <img src={`/images/home/alpha_delta_lq.jpeg`} className='hidden xl:block' style={{ width: '300px', position: 'relative', left: '50px', transform: 'rotate(347deg)', borderRadius: '25px', marginTop: '20px' }} />

          <div className='flex flex-row'>
            <img src={`/images/home/ae_crossover.jpg`} className='hidden xl:block' style={{ width: '250px', position: 'relative', transform: 'rotate(13deg)', borderRadius: '25px' }} />
            <img src={`/images/home/omega_dp.jpeg`} className='hidden xl:block' style={{ width: '350px', position: 'relative', left: '25px', top: '100px', transform: 'rotate(13deg)', borderRadius: '25px', marginTop: '20px' }} />
          </div>
        </div>
      </div>

      <div className="z-20 flex flex-col px-6 sm:px-8 md:px-12 lg:px-20">
        {/* Description */}
        <div className="mb-8 flex flex-col md:mb-12 2xl:flex-row">
          <div className="hidden flex-row justify-center gap-4 md:justify-start 2xl:flex">
            {/* <img src="/images/home/agnescaro.jpg" alt="Agnes" className='h-48 md:h-64' style={{ borderRadius: '10px' }} /> */}
            <img
              src={`/images/home/chi2.jpeg`}
              alt="Crossover"
              className="h-48 md:h-64"
              style={{ borderRadius: '10px' }}
            />
            {/* <img src="/images/home/lucas.jpg" alt="Lucas" className='h-48 md:h-64 2xl:hidden' style={{ borderRadius: '10px' }} /> */}
          </div>

          <div className="flex flex-col items-center justify-center 2xl:ml-16">
            <div>
              <p
                className="mb-4 mt-8 font-inter text-sm text-[#888888] md:text-base 2xl:mt-0"
                style={{ letterSpacing: '-0.02em' }}
              >
                Established in 2012, we are
              </p>
              <p
                className="mb-4 font-inter text-xl font-bold sm:text-2xl md:mb-8 md:text-3xl 2xl:w-[400px] 2xl:text-4xl"
                style={{ fontWeight: '900', letterSpacing: '-0.02em' }}
              >
                The first technology fraternity in the nation.
              </p>
              {/* More about us button */}
              <div className="more-about-us flex flex-row items-center justify-center font-inter text-sm">
                <Link className="font-bold hover:text-[#315CA9]" href="/about">
                  More About Us
                  <svg
                    className="ml-1 inline h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-bleed photo strip — same size as before, clipped at viewport edges */}
      <div className="mb-12 hidden w-full flex-row justify-center gap-4 overflow-hidden md:flex lg:mb-32">
        <img
          src={`/images/home/ab.jpg`}
          alt="Alpha Beta"
          className="hidden md:h-64 lg:h-48"
          style={{ borderRadius: '10px' }}
        />
        <img
          src={`/images/home/pledge_projects.jpeg`}
          alt="Pledge Projects"
          className="h-48 md:h-64"
          style={{ borderRadius: '10px' }}
        />
        <img
          src={`/images/home/tailgater.jpg`}
          alt="In and Chris"
          className="h-48 md:h-64"
          style={{ borderRadius: '10px' }}
        />
        <img
          src={`/images/home/alumni.jpg`}
          alt="Alumni"
          className="h-48 md:h-64"
          style={{ borderRadius: '10px' }}
        />
        <img
          src={`/images/home/tailgate.jpg`}
          alt="Tailgate"
          className="h-48 md:h-64"
          style={{ borderRadius: '10px' }}
        />
      </div>

      {/* Network */}
      <div className='px-6 sm:px-8 md:px-12 lg:px-20'>
        <div 
          className='flex justify-center text-3xl lg:text-4xl font-bold mb-12 font-inter' 
          style={{ fontWeight: '900', letterSpacing: '-0.02em' }}
        >
          Our Network
        </div>
        <div className='flex flex-wrap justify-center items-center gap-4 lg:gap-8 mb-8 min-h-[160px] lg:min-h-[180px]'>
          {networkCompanies.map((company, index) => (
            <img
              key={company.alt}
              src={company.src}
              alt={company.alt}
              className="h-6 lg:h-8 network-logo-simple"
              style={{ animationDelay: `${index * 50}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Life App */}
      <div id='life-app' className='mb-12 md:mb-16 lg:mb-20 xl:mb-24 px-6 sm:px-8 md:px-12 lg:px-20'>
        {/* Text */}
        <div className='flex flex-col lg:flex-row justify-center items-center mt-12 md:mt-16 lg:mt-20 xl:mt-24 gap-4 lg:gap-32 xl:gap-40 2xl:gap-48'>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold z-10 text-center lg:text-left font-inter max-w-full lg:max-w-lg" style={{ fontWeight: '900', letterSpacing: '-0.02em' }}>
            Kappa Theta Pi Life
            <div className='mt-4 font-normal text-[#707070] text-sm sm:text-base lg:text-lg max-w-full'>
            The KTP Life App is your one-stop shop for everything KTP! View upcoming events and details personalized to you, never miss important announcements, connect with brothers, learn more about our organization, and so much more!
            </div>
            <div className='flex flex-col items-center lg:items-start mt-8 mb-8'>
              <div className='flex flex-row justify-center lg:justify-start mb-4'>
                <a href='https://apps.apple.com/us/app/kappa-theta-pi-life/id1641588942' target="_blank" rel="noopener noreferrer" className='mr-4'>
                  <img src="/logos/app_store.svg" alt="App Store" className='h-12 sm:h-14 lg:h-16' style={{ width: 'clamp(120px, 15vw, 180px)' }} />
                </a>

                <a href='https://play.google.com/store/apps/details?id=com.ktpumich.ktp_rush&pli=1' target="_blank" rel="noopener noreferrer">
                  <img src="/logos/google_play.svg" alt="Google Play" className='h-12 sm:h-14 lg:h-16' style={{ width: 'clamp(120px, 15vw, 180px)' }} />
                </a>
              </div>

              <a href='/life/' target="_blank" rel="noopener noreferrer" className='w-full flex justify-center lg:justify-start'>
                <img src="/logos/web_badge.svg" alt="Web App" className='h-12 sm:h-14 lg:h-16' style={{ width: 'calc(2 * clamp(120px, 15vw, 180px) + 16px)' }} />
              </a>
            </div>
  
            {/* Alternate App Icons */}
            <div className="hidden xl:flex flex-col items-start mt-6">
              <div className="flex flex-wrap justify-start w-full gap-6">
                <img src="/images/app_icons/blonde.jpg" alt="Blonde KTP App Icon" className="w-12 h-12 rounded-xl" />
                <img src="/images/app_icons/brown.jpg" alt="Brown KTP App Icon" className="w-12 h-12 rounded-xl" />
                <img src="/images/app_icons/crossover.jpg" alt="Crossover KTP App Icon" className="w-12 h-12 rounded-xl" />
                <img src="/images/app_icons/default.jpg" alt="Default KTP App Icon" className="w-12 h-12 rounded-xl" />
                <img src="/images/app_icons/pokemon.jpg" alt="Pokemon KTP App Icon" className="w-12 h-12 rounded-xl" />
                <img src="/images/app_icons/retrotech.jpg" alt="Retrotech KTP App Icon" className="w-12 h-12 rounded-xl" />
              </div>
              <div className="flex flex-wrap justify-start w-full mt-4 gap-6">
                <img src="/images/app_icons/smiley.jpg" alt="Smiley KTP App Icon" className="w-12 h-12 rounded-xl" />
                <img src="/images/app_icons/yellow.jpg" alt="Yellow KTP App Icon" className="w-12 h-12 rounded-xl" />
                <img src="/images/app_icons/sticker.jpg" alt="Sticker KTP App Icon" className="w-12 h-12 rounded-xl" />
                <img src="/images/app_icons/squiggle.jpg" alt="Squiggle KTP App Icon" className="w-12 h-12 rounded-xl" />
                <img src="/images/app_icons/white.jpg" alt="White KTP App Icon" className="w-12 h-12 rounded-xl" />
                <img src="/images/app_icons/yearbook.jpg" alt="Yearbook KTP App Icon" className="w-12 h-12 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Phones */}
          <div className="flex shrink-0 flex-row justify-center lg:justify-end">
            <div className="relative mr-2 mt-12 shrink-0 sm:mr-4 sm:mt-24 md:mt-24 lg:mt-24">
              <Image
                src="/images/home/phone_frame_3.png"
                alt="Phone Frame 1"
                width={277}
                height={572}
                className="h-64 w-auto max-w-none shrink-0 object-contain sm:h-72 md:h-80 lg:h-80 xl:h-96 2xl:h-[28rem]"
                sizes="(max-width: 640px) 140px, (max-width: 1024px) 180px, 277px"
                style={{ width: 'auto' }}
              />
            </div>
            <div className="relative mt-6 shrink-0 sm:mt-12 md:mt-12 lg:mt-12">
              <Image
                src="/images/home/phone_frame_4.png"
                alt="Phone Frame 2"
                width={277}
                height={572}
                className="h-64 w-auto max-w-none shrink-0 object-contain sm:h-72 md:h-80 lg:h-80 xl:h-96 2xl:h-[28rem]"
                sizes="(max-width: 640px) 140px, (max-width: 1024px) 180px, 277px"
                style={{ width: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      </div>
    </div>
  );
}
