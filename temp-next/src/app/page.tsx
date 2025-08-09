'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Images - using public folder paths

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  // Network company data
  const networkCompanies = [
    { src: '/network/google.png', alt: 'Google' },
    { src: '/network/microsoft.png', alt: 'Microsoft' },
    { src: '/network/deloitte.png', alt: 'Deloitte' },
    { src: '/network/jpmorgan.png', alt: 'JP Morgan' },
    { src: '/network/meta.png', alt: 'Meta' },
    { src: '/network/citadel.png', alt: 'Citadel' },
    { src: '/network/capital_one.png', alt: 'Capital One' },
    { src: '/network/spotify.png', alt: 'Spotify' },
    { src: '/network/bloomberg.png', alt: 'Bloomberg' },
    { src: '/network/doordash.png', alt: 'Doordash' },
    { src: '/network/hudson_river_trading.png', alt: 'Hudson River Trading' },
    { src: '/network/amazon.png', alt: 'Amazon' },
    { src: '/network/apple.png', alt: 'Apple' },
    { src: '/network/tiktok.png', alt: 'Tiktok' },
    { src: '/network/nvidia.png', alt: 'Nvidia' },
    { src: '/network/duolingo.png', alt: 'Duolingo' },
    { src: '/network/jane_street.png', alt: 'Jane Street' },
    { src: '/network/pwc.png', alt: 'PWC' },
    { src: '/network/ey.png', alt: 'EY' },
    { src: '/network/accenture.png', alt: 'Accenture' },
    { src: '/network/linkedin.png', alt: 'LinkedIn' },
    { src: '/network/tesla.png', alt: 'Tesla' },
    { src: '/network/ibm.png', alt: 'IBM' },
    { src: '/network/cisco.png', alt: 'Cisco' },
    { src: '/network/asana.png', alt: 'Asana' },
    { src: '/network/slack.png', alt: 'Slack' },
    { src: '/network/figma.png', alt: 'Figma' },
    { src: '/network/bleacher_report.png', alt: 'Bleacher Report' },
    { src: '/network/stripe.png', alt: 'Stripe' },
    { src: '/network/pnc.png', alt: 'PNC' },
    { src: '/network/boeing.png', alt: 'Boeing' },
    { src: '/network/salesforce.png', alt: 'Salesforce' },
    { src: '/network/mongo_db.png', alt: 'MongoDB' },
    { src: '/network/vmware.png', alt: 'VMware' },
    { src: '/network/nike.png', alt: 'Nike' },
    { src: '/network/uber.png', alt: 'Uber' },
    { src: '/network/netskope.png', alt: 'Netskope' },
    { src: '/network/att.png', alt: 'AT&T' },
    { src: '/network/ford.png', alt: 'Ford' },
    { src: '/network/modern_treasury.png', alt: 'Modern Treasury' },
    { src: '/network/indeed.png', alt: 'Indeed' },
    { src: '/network/bank_of_america.png', alt: 'Bank of America' },
    { src: '/network/workday.png', alt: 'Workday' },
    { src: '/network/caterpillar.png', alt: 'Caterpillar' },
    { src: '/network/p&g.png', alt: 'P&G' },
    { src: '/network/viget.png', alt: 'Viget' },
    { src: '/network/united.png', alt: 'United' },
  ];

  return (
    <div className='homepage-grid'>
      <Header />
      
      {/* Main content */}
      <div className='flex flex-row justify-between mb-12 md:mb-20 lg:mb-32'>
        <div className="absolute inset-0 blob-c z-0 hidden lg:block">
            <div className="shape-blob ten"></div>
            <div className="shape-blob eleven"></div>
        </div>
        <div className='flex-1 flex flex-col items-end'>
          <img src="/images/home/melgrace.jpg" className='hidden lg:block' style={{ width: '175px', transform: 'rotate(10deg)', borderRadius: '25px', marginRight: '50px' }} />
          <img src="/images/home/rock.JPEG" className='hidden lg:block' style={{ width: '200px', transform: 'rotate(-19deg)', borderRadius: '25px', marginRight: '20px' }} />
        </div>

        <div className='flex flex-col flex-none'>
          <div className="absolute inset-0 blob-c z-0 block md:hidden overflow-hidden">
              <div className="shape-blob twelve"></div>
              <div className="shape-blob thirteen"></div>
          </div>
          <div className='flex flex-col items-center justify-center z-10'>
            <div className="font-black text-center w-[375px] sm:w-[450px] md:w-[550px] lg:w-[750px] text-3xl sm:text-3xl md:text-4xl lg:text-5xl mt-24 md:mt-36 font-inter" style={{ fontWeight: '900', letterSpacing: '-0.02em' }}>
              We're the University of Michigan's premier technology fraternity
            </div>

            <div className='text-[#707070] text-[16px] text-center mt-8 w-[350px] sm:w-[400px] md:w-[450px] lg:w-[500px] text-sm sm:text-md lg:text-base'>
              <div>Founded as the first KTP chapter, we're dedicated to uniting students across the nation for the love of technology</div>
            </div>

            <Link href="/rush">
              <div className='contact-us text-white font-semibold text-lg mt-8 flex flex-row items-center justify-center font-inter transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 cursor-pointer'>
                Rush
              </div>
            </Link>
          </div>
        </div>

        <div className='flex-1 flex flex-col items-start'>
          <img src="/images/home/paddle.jpg" className='hidden lg:block' style={{ width: '200px', position: 'relative', left: '150px', transform: 'rotate(13deg)', borderRadius: '25px' }} />

          <div className='flex flex-row'>
            <img src="/images/home/retreat.JPEG" className='hidden lg:block' style={{ width: '250px', position: 'relative', transform: 'rotate(13deg)', borderRadius: '25px' }} />
            <img src="/images/home/cross.JPEG" className='hidden lg:block' style={{ width: '250px', position: 'relative', left: '25px', top: '100px', transform: 'rotate(13deg)', borderRadius: '25px' }} />
          </div>
        </div>
      </div>

      <div className='flex flex-col z-20 mb-12 md:mb-12 lg:mb-32'>
        {/* Description */}
        <div className='flex flex-col lg:flex-row mb-8 md:mb-12 ml-4 md:ml-8 lg:ml-16'>
          <div className='hidden md:flex flex-row justify-center md:justify-start gap-4'>
            <img src="/images/home/agnescaro.jpg" alt="Agnes" className='h-48 md:h-64' style={{ borderRadius: '10px' }} />
            <img src="/images/home/chi2.jpeg" alt="Crossover" className='h-48 md:h-64' style={{ borderRadius: '10px' }} />
            <img src="/images/home/lucas.jpg" alt="Lucas" className='h-48 md:h-64 lg:hidden' style={{ borderRadius: '10px' }} />
          </div>

          <div className='flex flex-col justify-center items-center lg:ml-16'>
            <div>
              <p className='text-[#888888] text-sm md:text-base mb-4 mt-8 lg:mt-0 font-inter' style={{ letterSpacing: '-0.02em' }}>
                Established in 2012, we are
              </p>
              <p className='font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl lg:w-[400px] mb-4 md:mb-8 font-inter' style={{ fontWeight: '900', letterSpacing: '-0.02em' }}>
                The first technology fraternity in the nation.
              </p>
              {/* More about us button */}
              <div className='more-about-us text-sm flex flex-row items-center justify-center font-inter'>
                <Link className="hover:text-blue-700 font-bold" href="/about">
                  More About Us
                  <svg className="ml-1 w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className='hidden md:flex flex-row gap-4 justify-center'>
          <img src="/images/home/ab.jpg" alt="Alpha Beta" className='hidden lg:h-48 md:h-64' style={{ borderRadius: '10px' }} />
          <img src="/images/home/pledge_projects.jpeg" alt="Pledge Projects" className='h-48 md:h-64' style={{ borderRadius: '10px' }} />
          <img src="/images/home/yummers.jpeg" alt="Ava and Bella" className='h-48 md:h-64' style={{ borderRadius: '10px' }} />
          <img src="/images/home/alumni.jpg" alt="Alumni" className='h-48 md:h-64' style={{ borderRadius: '10px' }} />
          <img src="/images/home/tailgate.jpg" alt="Tailgate" className='h-48 md:h-64' style={{ borderRadius: '10px' }} />
        </div>
      </div>

      {/* Network */}
      <div>
        <div 
          className='flex justify-center text-3xl lg:text-4xl font-bold mb-12 font-inter' 
          style={{ fontWeight: '900', letterSpacing: '-0.02em' }}
        >
          Our Network
        </div>
        <div className='flex flex-wrap justify-center items-center gap-4 lg:gap-8 px-8 mb-8 sm:px-16 md:px-16 lg:px-32'>
          {networkCompanies.map((company, index) => (
            <img
              key={company.alt}
              src={company.src}
              alt={company.alt}
              className='h-6 lg:h-8 network-logo-simple opacity-0'
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'forwards'
              }}
            />
          ))}
        </div>
      </div>

      {/* Life App */}
      <div id='life-app' className='mb-12'>
        {/* Text */}
        <div className='flex flex-col md:flex-row justify-center items-center mt-12'>
          <div className="text-3xl mt-8 md:text-4xl font-bold z-10 md:mr-24 text-center md:text-left font-inter" style={{ fontWeight: '900', letterSpacing: '-0.02em' }}>
            Kappa Theta Pi Life
            <div className='mt-4 font-normal text-[#707070] text-[16px] w-[350px] sm:w-[400px] md:w-[450px] lg:w-[500px] text-xs sm:text-sm lg:text-base'>
            The KTP Life App is your one-stop shop for everything KTP! View upcoming events and details personalized to you, never miss important announcements, connect with brothers, learn more about our organization, and so much more!
            </div>
            <div className='flex flex-row justify-center md:justify-start mt-8'>
              <a href='https://apps.apple.com/us/app/kappa-theta-pi-life/id1641588942' target="_blank" rel="noopener noreferrer" className='mr-4'>
                <img src="/logos/app_store.svg" alt="Image" className='h-10 md:h-12 lg:h-14' />
              </a>

              <a href='https://play.google.com/store/apps/details?id=com.ktpumich.ktp_rush&pli=1' target="_blank" rel="noopener noreferrer">
                <img src="/logos/google_play.svg" alt="Image" className='h-10 md:h-12 lg:h-14' />
              </a>
            </div>
  
            {/* Alternate App Icons */}
            <div className="hidden lg:flex flex-col items-start">
              <div className="flex flex-wrap justify-start w-full mt-6">
                            <img src="/images/app_icons/blonde.jpg" alt="Blonde KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
            <img src="/images/app_icons/brown.jpg" alt="Brown KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
            <img src="/images/app_icons/crossover.jpg" alt="Crossover KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
            <img src="/images/app_icons/default.jpg" alt="Default KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
            <img src="/images/app_icons/pokemon.jpg" alt="Pokemon KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
            <img src="/images/app_icons/retrotech.jpg" alt="Retrotech KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
              </div>
              <div className="flex flex-wrap justify-start w-full mt-2">
                            <img src="/images/app_icons/smiley.jpg" alt="Smiley KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
            <img src="/images/app_icons/yellow.jpg" alt="Yellow KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
            <img src="/images/app_icons/sticker.jpg" alt="Sticker KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
            <img src="/images/app_icons/squiggle.jpg" alt="Squiggle KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
            <img src="/images/app_icons/white.jpg" alt="White KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
            <img src="/images/app_icons/yearbook.jpg" alt="Yearbook KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
              </div>
            </div>
          </div>

          {/* Phones */}
          <div className='hidden md:flex flex-row mt-12 md:mt-0 mb-8'>
            <img src="/images/home/phone_frame_3.svg" alt="Image" className='h-56 md:h-72 lg:h-80 xl:h-96 2xl:h-[32rem] mr-4 md:mr-8 lg:mt-24' />
            <img src="/images/home/phone_frame_4.svg" alt="Image" className='h-56 md:h-72 lg:h-80 xl:h-96 2xl:h-[32rem] lg:mt-12' />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
