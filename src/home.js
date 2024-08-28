import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import Footer from './Footer.js';
import Header from './Header.js';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ScrollToTop from './ScrollToTop';

// Images
import BlondeAppIcon from './img/alt_app_icons/blonde.jpg';
import BrownAppIcon from './img/alt_app_icons/brown.jpg'
import CrossoverAppIcon from './img/alt_app_icons/crossover.jpg'
import DefaultAppIcon from './img/alt_app_icons/default.jpg'
import PokemonAppIcon from './img/alt_app_icons/pokemon.jpg'
import RetrotechAppIcon from './img/alt_app_icons/retrotech.jpg'
import SmileyAppIcon from './img/alt_app_icons/smiley.jpg'
import SquiggleAppIcon from './img/alt_app_icons/squiggle.jpg'
import StickerAppIcon from './img/alt_app_icons/sticker.jpg'
import WhiteAppIcon from './img/alt_app_icons/white.jpg'
import YearbookAppIcon from './img/alt_app_icons/yearbook.jpg'
import YellowAppIcon from './img/alt_app_icons/yellow.jpg'

function Home() {
  useEffect(() => {
    AOS.init({
      duration: 2000,
      once: true,
    });
  }, []);

  return (
    <div className='homepage-grid'>

      <Header></Header>
      <ScrollToTop />

      {/* Main content */}
      <div className='flex flex-row justify-between mb-12 md:mb-20 lg:mb-42'>
        <div className="absolute inset-0 blob-c z-0 hidden lg:block">
            <div className="shape-blob ten"></div>
            <div className="shape-blob eleven"></div>
        </div>
        <div className='flex-1 flex flex-col items-end'>
          <img src={`${process.env.PUBLIC_URL}/melgrace.jpg`} className='hidden lg:block' style={{ width: '175px', transform: 'rotate(10deg)', borderRadius: '25px' }} />
          <img src={`${process.env.PUBLIC_URL}/rock.JPEG`} className='hidden lg:block' style={{ width: '200px', transform: 'rotate(-19deg)', borderRadius: '25px' }} />
        </div>

        <div className='flex flex-col flex-none'>
          <div className="absolute inset-0 blob-c z-0 block md:hidden overflow-hidden">
              <div className="shape-blob twelve"></div>
              <div className="shape-blob thirteen"></div>
          </div>
          <div className='flex flex-col items-center justify-center z-10'>
            <div className="font-black text-center w-[375px] sm:w-[450px] md:w-[550px] lg:w-[750px] text-3xl sm:text-3xl md:text-4xl lg:text-5xl mt-24 md:mt-36" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '900', letterSpacing: '-0.02em' }}>
              We’re the University of Michigan’s premier technology fraternity
            </div>

            <div className='text-[#707070] text-[16px] text-center mt-8 w-[350px] sm:w-[400px] md:w-[450px] lg:w-[500px] text-sm sm:text-md lg:text-base'>
              <div>Founded as the first KTP chapter, we're dedicated to uniting students across the nation for the love of technology</div>
            </div>

            <Link to="/rush">
              <div className='contact-us text-white font-semibold text-lg mt-8 flex flex-row items-center justify-center' style={{ fontFamily: 'Inter, sans-serif' }}>
                Rush
              </div>
            </Link>
          </div>
        </div>

        <div className='flex-1 flex flex-col items-start'>
          <img src={`${process.env.PUBLIC_URL}/paddle.jpg`} className='hidden lg:block' style={{ width: '200px', position: 'relative', left: '150px', transform: 'rotate(13deg)', borderRadius: '25px' }} />

          <div className='flex flex-row'>
            <img src={`${process.env.PUBLIC_URL}/retreat.JPEG`} className='hidden lg:block' style={{ width: '250px', position: 'relative', transform: 'rotate(13deg)', borderRadius: '25px' }} />
            <img src={`${process.env.PUBLIC_URL}/cross.JPEG`} className='hidden lg:block' style={{ width: '250px', position: 'relative', left: '25px', top: '100px', transform: 'rotate(13deg)', borderRadius: '25px' }} />
          </div>
        </div>
      </div>

			<div className='flex flex-col z-20 mb-12 md:mb-12 lg:mb-32'>
				{/* Description */}
				<div className='flex flex-col lg:flex-row mb-8 md:mb-12 ml-4 md:ml-8 lg:ml-16'>
					<div className='hidden md:flex flex-row justify-center md:justify-start gap-4'>
						<img src={`${process.env.PUBLIC_URL}/agnescaro.jpg`} alt="Agnes" class='h-48 md:h-64' style={{ borderRadius: '10px' }} />
						<img src={`${process.env.PUBLIC_URL}/chi2.jpeg`} alt="Crossover" class='h-48 md:h-64' style={{ borderRadius: '10px' }} />
            <img src={`${process.env.PUBLIC_URL}/lucas.jpg`} alt="Lucas" class='h-48 md:h-64 lg:hidden' style={{ borderRadius: '10px' }} />
					</div>

					<div className='flex flex-col justify-center items-center lg:ml-16'>
						<div>
							<p className='text-[#888888] text-sm md:text-base mb-4 mt-8 lg:mt-0' style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
                Established in 2012, we are
              </p>
							<p className='font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl lg:w-[400px] mb-4 md:mb-8' style={{ fontFamily: 'Inter, sans-serif', fontWeight: '900', letterSpacing: '-0.02em' }}>
								The first technology fraternity in the nation.
							</p>
							{/* More about us button */}
							<div className='more-about-us text-sm flex flex-row items-center justify-center' style={{ fontFamily: 'Inter, sans-serif' }}>
								<Link className="hover:text-blue-700 font-bold" to="/about">
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
          <img src={`${process.env.PUBLIC_URL}/ab.JPG`} alt="Alpha Beta" class='hidden lg:h-48 md:h-64' style={{ borderRadius: '10px' }} />
          <img src={`${process.env.PUBLIC_URL}/pledge_projects.jpeg`} alt="Pledge Projects" class='h-48 md:h-64' style={{ borderRadius: '10px' }} />
          <img src={`${process.env.PUBLIC_URL}/yummers.jpeg`} alt="Ava and Bella" class='h-48 md:h-64' style={{ borderRadius: '10px' }} />
          <img src={`${process.env.PUBLIC_URL}/alumni.jpg`} alt="Alumni" class='h-48 md:h-64' style={{ borderRadius: '10px' }} />
          <img src={`${process.env.PUBLIC_URL}/tailgate.jpg`} alt="Tailgate" class='h-48 md:h-64' style={{ borderRadius: '10px' }} />
        </div>
			</div>

      {/* Network */}
      <div>
        <div className='flex justify-center text-3xl lg:text-4xl font-bold mb-12'>Our Network</div>
        <div className='flex flex-wrap justify-center items-center gap-4 lg:gap-8 px-8 mb-8 sm:px-16 md:px-16 lg:px-32' data-aos="fade-up" data-aos-delay="100">
          <img src={`${process.env.PUBLIC_URL}/network/google.png`} alt='Google' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/microsoft.png`} alt='Microsoft' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/deloitte.png`} alt='Deloitte' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/jpmorgan.png`} alt='JP Morgan' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/meta.png`} alt='Meta' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/citadel.png`} alt='Citadel' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/capital_one.png`} alt='Capital One' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/spotify.png`} alt='Spotify' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/bloomberg.png`} alt='Bloomberg' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/doordash.png`} alt='Doordash' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/hudson_river_trading.png`} alt='Hudson River Trading' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/amazon.png`} alt='Amazon' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/apple.png`} alt='Apple' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/tiktok.png`} alt='Tiktok' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/nvidia.png`} alt='Nvidia' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/duolingo.png`} alt='Duolingo' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/jane_street.png`} alt='Jane Street' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/pwc.png`} alt='PWC' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/ey.png`} alt='EY' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/accenture.png`} alt='Accenture' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/linkedin.png`} alt='LinkedIn' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/tesla.png`} alt='Tesla' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/ibm.png`} alt='IBM' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/cisco.png`} alt='Cisco' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/asana.png`} alt='Asana' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/slack.png`} alt='Slack' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/figma.png`} alt='Figma' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/bleacher_report.png`} alt='Bleacher Report' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/stripe.png`} alt='Stripe' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/pnc.png`} alt='PNC' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/boeing.png`} alt='Boeing' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/salesforce.png`} alt='Salesforce' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/mongo_db.png`} alt='MongoDB' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/vmware.png`} alt='VMware' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/nike.png`} alt='Nike' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/uber.png`} alt='Uber' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/netskope.png`} alt='Netskope' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/att.png`} alt='AT&T' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/ford.png`} alt='Ford' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/modern_treasury.png`} alt='Modern Treasury' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/indeed.png`} alt='Indeed' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/bank_of_america.png`} alt='Bank of America' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/workday.png`} alt='Workday' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/caterpillar.png`} alt='Caterpillar' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/p&g.png`} alt='P&G' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/viget.png`} alt='Viget' class='h-6 lg:h-8' />
          <img src={`${process.env.PUBLIC_URL}/network/united.png`} alt='United' class='h-6 lg:h-8' />
        </div>
      </div>

      {/* Life App */}
      <div id='life-app' className='mb-12'>
        {/* Text */}
        <div className='flex flex-col md:flex-row justify-center items-center mt-12'>
          <div className="text-3xl mt-8 md:text-4xl font-bold z-10 md:mr-24 text-center md:text-left" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '900', letterSpacing: '-0.02em' }}>
            Kappa Theta Pi Life
            <div className='mt-4 font-normal text-[#707070] text-[16px] mt-8 w-[350px] sm:w-[400px] md:w-[450px] lg:w-[500px] text-xs sm:text-sm lg:text-base'>
            The KTP Life App is your one-stop shop for everything KTP! View upcoming events and details personalized to you, never miss important announcements, connect with brothers, learn more about our organization, and so much more!
            </div>
            <div className='flex flex-row justify-center md:justify-start mt-8'>
              <a href='https://apps.apple.com/us/app/kappa-theta-pi-life/id1641588942' target="_blank" rel="noopener noreferrer" className='mr-4'>
                <img src={`${process.env.PUBLIC_URL}/app_store.svg`} alt="Image" className='h-10 md:h-12 lg:h-14' />
              </a>

              <a href='https://play.google.com/store/apps/details?id=com.ktpumich.ktp_rush&pli=1' target="_blank" rel="noopener noreferrer">
                <img src={`${process.env.PUBLIC_URL}/google_play.svg`} alt="Image" className='h-10 md:h-12 lg:h-14' />
              </a>
            </div>
  
            {/* Alternate App Icons */}
            <div className="flex flex-col items-start">
              <div className="flex flex-wrap justify-start w-full mt-6">
                <img src={BlondeAppIcon} alt="Blonde KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
                <img src={BrownAppIcon} alt="Brown KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
                <img src={CrossoverAppIcon} alt="Crossover KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
                <img src={DefaultAppIcon} alt="Default KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
                <img src={PokemonAppIcon} alt="Pokemon KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
                <img src={RetrotechAppIcon} alt="Retrotech KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
              </div>
              <div className="flex flex-wrap justify-start w-full mt-2">
                <img src={SmileyAppIcon} alt="Smiley KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
                <img src={YellowAppIcon} alt="Yellow KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
                <img src={StickerAppIcon} alt="Sticker KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
                <img src={SquiggleAppIcon} alt="Squiggle KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
                <img src={WhiteAppIcon} alt="White KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
                <img src={YearbookAppIcon} alt="Yearbook KTP App Icon" className="w-14 h-14 rounded-xl mt-2 mb-2 mr-4" />
              </div>
            </div>
          </div>

          {/* Phones */}
          <div className='hidden md:flex flex-row mt-12 md:mt-0 mb-8'>
            <img src={`${process.env.PUBLIC_URL}/phone_frame_3.svg`} alt="Image" className='h-56 md:h-72 lg:h-80 xl:h-96 2xl:h-[32rem] mr-4 md:mr-8 lg:mt-24' />
            <img src={`${process.env.PUBLIC_URL}/phone_frame_4.svg`} alt="Image" className='h-56 md:h-72 lg:h-80 xl:h-96 2xl:h-[32rem] lg:mt-12' />
          </div>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}

export default Home;
