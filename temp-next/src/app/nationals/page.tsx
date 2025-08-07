'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faUserGroup, faNetworkWired, faPencil } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Import images
import MichiganLogo from '../../../public/img/universities/michigan.png';
import NorthwesternLogo from '../../../public/img/universities/northwestern.png';
import UChicagoLogo from '../../../public/img/universities/uchicago.png';
import RutgersLogo from '../../../public/img/universities/rutgers.png';
import BULogo from '../../../public/img/universities/bu.png';
import USCLogo from '../../../public/img/universities/usc.png';
import SyracuseLogo from '../../../public/img/universities/syracuse.png';
import PittLogo from '../../../public/img/universities/pitt.png';
import UNCLogo from '../../../public/img/universities/unc.png';
import MarylandLogo from '../../../public/img/universities/maryland.png';
import TexasLogo from '../../../public/img/universities/texas.png';
import ColoradoLogo from '../../../public/img/universities/colorado.png';

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
    <div className="h-screen flex flex-col">
      <Header />

      {/* Main content */}
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center px-4 md:px-8 py-8 md:py-16">
        <div className="text-left mb-8 md:mb-16 w-full md:w-1/3 ml-0 md:ml-32">
          <h1 className="text-4xl md:text-5xl font-bold">KTP Nationals</h1>
          <p className="text-sm md:text-lg mt-4 text-gray-600">
            With over 15+ chapters across the nation, <br></br> KTP grows by day.
          </p>
          {/* Icon Bar Integration */}
          <div className="icon-bar flex justify-center my-4" style={{ width: '100%' }}>
            <FontAwesomeIcon icon={faPencil} size="lg" className="mx-4" />
            <FontAwesomeIcon icon={faNetworkWired} size="lg" className="mx-4" />
            <FontAwesomeIcon icon={faUserGroup} size="lg" className="mx-4" />
            <FontAwesomeIcon icon={faBriefcase} size="lg" className="mx-4" />
          </div>
          
          <a href="mailto:ktp-board@umich.edu" className="relative mt-8 inline-block py-2 px-4 rounded-full shadow-md border-2 border-blue-500 text-blue-500 bg-white hover:bg-blue-100 transition">
            <div className="flex items-center">
              <div className="relative flex items-center">
                <div className="relative flex items-center" style={{ width: '54px', height: '24px' }}>
                  <img src={UChicagoLogo.src} alt="University of Chicago" className="absolute w-6 h-6 rounded-md" style={{ left: 0, zIndex: 1 }} />
                  <img src={MichiganLogo.src} alt="University of Michigan" className="absolute w-6 h-6 rounded-md" style={{ left: '18px', zIndex: 2 }} />
                  <img src={NorthwesternLogo.src} alt="Northwestern University" className="absolute w-6 h-6 rounded-md" style={{ left: '36px', zIndex: 1 }} />
                </div>
              </div>
              <span className="ml-3">Start a KTP Chapter</span>
            </div>
          </a>
        </div>
        
        <div className="logos-grid grid grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-screen-lg">
          {logos.map((logo, index) => (
            <div key={index} className="logo-container-2">
              <img src={logo.src.src} alt={logo.alt} className="logo-image w-full h-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
