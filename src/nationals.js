import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css'; // Import the custom CSS file
import Footer from './Footer.js';
import Header from './Header.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faUserGroup, faNetworkWired, faPencil } from '@fortawesome/free-solid-svg-icons';

// Import images (replace with actual paths to your logo images)
import MichiganLogo from './img/universities/michigan.png';
import NorthwesternLogo from './img/universities/northwestern.png';
import UChicagoLogo from './img/universities/uchicago.png';
import RutgersLogo from './img/universities/rutgers.png';
import BULogo from './img/universities/bu.png';
import USCLogo from './img/universities/usc.png';
import SyracuseLogo from './img/universities/syracuse.png';
import PittLogo from './img/universities/pitt.png';
import UNCLogo from './img/universities/unc.png';
import MarylandLogo from './img/universities/maryland.png';
import TexasLogo from './img/universities/texas.png';
import ColoradoLogo from './img/universities/colorado.png';

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

function Nationals() {
  return (
    <div className="h-screen flex flex-col">
      <Header></Header>

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
            <div className="flex items-center space-x-2">
              <div className="relative flex items-center">
                <div className="relative flex items-center" style={{ width: '54px', height: '24px' }}>
                  <img src={UChicagoLogo} alt="University of Chicago" className="absolute w-6 h-6 rounded-md" style={{ left: 0, zIndex: 1 }} />
                  <img src={MichiganLogo} alt="University of Michigan" className="absolute w-6 h-6 rounded-md" style={{ left: '18px', zIndex: 2 }} />
                  <img src={NorthwesternLogo} alt="Northwestern University" className="absolute w-6 h-6 rounded-md" style={{ left: '36px', zIndex: 1 }} />
                </div>
              </div>
              <span className="ml-12">Start a KTP Chapter</span>
            </div>
          </a>
        </div>
        
        <div className="logos-grid grid grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-screen-lg">
          {logos.map((logo, index) => (
            <div key={index} className="logo-container-2">
              <img src={logo.src} alt={logo.alt} className="logo-image w-full h-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Nationals;
