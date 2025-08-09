'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faUserGroup, faNetworkWired, faPencil } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Import images
import MichiganLogo from '../../../public/images/universities/michigan.png';
import NorthwesternLogo from '../../../public/images/universities/northwestern.png';
import UChicagoLogo from '../../../public/images/universities/uchicago.png';
import RutgersLogo from '../../../public/images/universities/rutgers.png';
import BULogo from '../../../public/images/universities/bu.png';
import USCLogo from '../../../public/images/universities/usc.png';
import SyracuseLogo from '../../../public/images/universities/syracuse.png';
import PittLogo from '../../../public/images/universities/pitt.png';
import UNCLogo from '../../../public/images/universities/unc.png';
import MarylandLogo from '../../../public/images/universities/maryland.png';
import TexasLogo from '../../../public/images/universities/texas.png';
import ColoradoLogo from '../../../public/images/universities/colorado.png';

const logos = [
  { src: MichiganLogo, alt: 'University of Michigan' },
  { src: PittLogo, alt: 'University of Pittsburgh' },
  { src: SyracuseLogo, alt: 'Syracuse University' },
  { src: RutgersLogo, alt: 'Rutgers University' },
  { src: BULogo, alt: 'Boston University' },
  { src: USCLogo, alt: 'University of Southern California' },
  { src: NorthwesternLogo, alt: 'Northwestern University' },
  { src: UChicagoLogo, alt: 'University of Chicago' },
  { src: UNCLogo, alt: 'University of North Carolina' },
  { src: MarylandLogo, alt: 'University of Maryland' },
  { src: TexasLogo, alt: 'University of Texas at Austin' },
  { src: ColoradoLogo, alt: 'University of Colorado Boulder' },
];

export default function Nationals() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Blob Container */}
      <div className="absolute inset-0 blob-c z-0">
        <div className="shape-blob eight lg:hidden" style={{ left: '40%', top: '-10%' }}></div>
        <div className="shape-blob eight hidden lg:block" style={{ left: '10%', top: '15%' }}></div>
        <div className="shape-blob nine lg:hidden" style={{ left: '30%', top: '20%' }}></div>
        <div className="shape-blob nine hidden lg:block" style={{ left: '10%', top: '30%' }}></div>
      </div>

      {/* Main content */}
      <div className="relative w-full z-10 flex-grow flex flex-col justify-center">
        <div className="relative pt-12 sm:pt-16 lg:pt-0 z-10">
          <div className="flex flex-col lg:flex-row items-center justify-center px-6 sm:px-8 md:px-12 lg:px-20">
            <div className="relative text-center lg:text-left mb-12 lg:mb-0 w-full lg:w-1/2 max-w-xl lg:max-w-none lg:mr-16">
          
          <h1 className="relative text-3xl sm:text-4xl md:text-5xl font-black mb-8 font-inter z-10" style={{ fontWeight: '900', letterSpacing: '-0.02em' }}>
            KTP Nationals
          </h1>
          <p className="relative text-base sm:text-xl mt-8 mb-8 font-medium text-gray-600 leading-relaxed z-10" style={{ color: 'grey' }}>
            With over 15+ chapters across the nation, <br />KTP grows by day.
          </p>
          
          {/* Icon Bar Integration */}
          <div className="relative flex justify-center lg:justify-start gap-16 my-12 z-10 hidden md:flex">
            <div className="relative group">
              <FontAwesomeIcon icon={faPencil} size="2x" className="text-black hover:text-[#315CA9] transition-colors duration-300 cursor-pointer" />
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 shadow-lg text-gray-800 text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20 pointer-events-none hidden md:block">
                Academic Excellence
              </div>
            </div>
            <div className="relative group">
              <FontAwesomeIcon icon={faNetworkWired} size="2x" className="text-black hover:text-[#315CA9] transition-colors duration-300 cursor-pointer" />
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 shadow-lg text-gray-800 text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20 pointer-events-none hidden md:block">
                Professional Network
              </div>
            </div>
            <div className="relative group">
              <FontAwesomeIcon icon={faUserGroup} size="2x" className="text-black hover:text-[#315CA9] transition-colors duration-300 cursor-pointer" />
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 shadow-lg text-gray-800 text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20 pointer-events-none hidden md:block">
                Brotherhood & Community
              </div>
            </div>
            <div className="relative group">
              <FontAwesomeIcon icon={faBriefcase} size="2x" className="text-black hover:text-[#315CA9] transition-colors duration-300 cursor-pointer" />
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 shadow-lg text-gray-800 text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20 pointer-events-none hidden md:block">
                Career Development
              </div>
            </div>
          </div>
          
          <a href="mailto:ktp-board@umich.edu" className="relative contact-us text-white font-semibold text-sm sm:text-base mt-12 flex flex-row items-center justify-center font-inter transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-blue-500/15 cursor-pointer w-[620px] h-16 mx-auto lg:mx-0 z-10 whitespace-nowrap px-12">
            <div className="relative flex items-center mr-4">
              <div className="relative flex items-center" style={{ width: '54px', height: '24px' }}>
                <img src={UChicagoLogo.src} alt="University of Chicago" className="absolute w-6 h-6 rounded-md" style={{ left: 0, zIndex: 1 }} />
                <img src={MichiganLogo.src} alt="University of Michigan" className="absolute w-6 h-6 rounded-md" style={{ left: '18px', zIndex: 2 }} />
                <img src={NorthwesternLogo.src} alt="Northwestern University" className="absolute w-6 h-6 rounded-md" style={{ left: '36px', zIndex: 1 }} />
              </div>
            </div>
            <span>Start a KTP Chapter</span>
          </a>
        </div>
        
        <div className="w-full lg:w-1/2 flex justify-center px-6 mb-16 lg:mb-0">
          <div className="logos-grid grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12 w-full max-w-4xl justify-items-center">
            {logos.map((logo, index) => (
              <div key={index} className="logo-container-2">
                <img 
                  src={logo.src.src} 
                  alt={logo.alt} 
                  className="logo-image w-full h-full object-cover" 
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
  );
}
