import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import PresidentHeadshot from './img/members/Medway_Lily.jpg';
import History from './img/History.jpg';
import Header from './Header.js';
import Footer from './Footer.js';
import { IoIosSpeedometer } from 'react-icons/io';
import { MdOutlineWork } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { PiGlobeBold } from "react-icons/pi";
import { HiAcademicCap } from "react-icons/hi2";
import ScrollToTop from './ScrollToTop';

const categories = ['President\'s Welcome', 'Our Pillars', 'History', 'DEI Commitment'];

function About() {
  const [selectedCategory, setSelectedCategory] = useState('President\'s Welcome');
  const categoryRefs = useRef([]);

  useEffect(() => {
    const selectedIndex = categories.indexOf(selectedCategory);
    if (categoryRefs.current[selectedIndex]) {
      const { offsetLeft, offsetWidth } = categoryRefs.current[selectedIndex];
      const underline = document.querySelector('.underline');
      underline.style.left = `${offsetLeft}px`;
      underline.style.width = `${offsetWidth}px`;
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category, index) => {
    setSelectedCategory(category);
    const { offsetLeft, offsetWidth } = categoryRefs.current[index];
    const underline = document.querySelector('.underline');
    underline.style.left = `${offsetLeft}px`;
    underline.style.width = `${offsetWidth}px`;
  };

  return (
    <div>
      <Header></Header>

      <ScrollToTop />
      
      <div className="relative bg-white w-full">
        {/* Blob Container */}
        <div className="absolute inset-0 blob-c z-0">
          <div className="shape-blob eight"></div>
          <div className="shape-blob nine"></div>
        </div>

      {/* Blob Container */}
      <div className="inset-0 blob-c z-0">
        <div className="shape-blob eight"></div>
        <div className="shape-blob nine"></div>
      </div>

      <div className="relative w-full">
        {/* Page Content */}
        <div className="relative mt-16 md:mt-32 z-10">
          <div className="flex flex-col text-center">
          <h1 className="text-3xl sm:text-5xl font-black">About Us</h1>
            <p className="text-base text-gray-600 text-sm sm:text-base mt-4 mb-16" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
            Learn more about who we are at Kappa Theta Pi!
            </p>
          </div>
        </div>
      </div>

      {/* Scrolling Menu */}
      <div className="relative mb-4 ml-4 mr-4 sm:ml-8 sm:mr-8 md:ml-16 md:mr-16 lg:ml-32 lg:mr-32">
        <div className="flex justify-center text-center space-x-4 sm:space-x-8 md:space-x-16 lg:space-x-32 border-b-2 border-gray-300">
          {categories.map((category, index) => (
            <ScrollLink
              key={category}
              className={`relative px-2 sm:px-3 md:px-4 py-2 ${selectedCategory === category ? 'text-black font-bold' : 'text-gray-400'} cursor-pointer`}
              onClick={() => handleCategoryClick(category, index)}
              to={`${category.toLowerCase()}-section`}
              smooth={true}
              duration={200}
              ref={el => categoryRefs.current[index] = el}
            >
              {category}
            </ScrollLink>
          ))}
          <div className="underline absolute bottom-0 h-0.5 bg-black transition-all duration-300"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col space-y-12">
        {/* President's Welcome */}
        <div className="bg-white w-full">
          <div className="px-6 sm:px-12 md:px-24 lg:px-32 py-8 sm:py-12 md:py-16" id="president's welcome-section">
            <div className="relative flex flex-col items-center md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-8 pb-10">
              <div className="relative w-full md:w-2/5 flex justify-center">
                <div className="absolute blob-c z-0 flex justify-center items-center z-0">
                  <div className="shape-blob eight absolute"></div>
                  <div className="shape-blob nine absolute"></div>
                </div>
                <img 
                  src={PresidentHeadshot} 
                  alt="President's Headshot" 
                  className="relative z-10 w-3/4 h-auto rounded-full border-8 border-x-emerald-100"
                />
              </div>
              <div className="w-full md:w-3/5 text-center md:text-left">
                <h2 className="text-3xl text-center mt-8 sm:text-4xl font-bold text-ktp-dark-blue pb-4 sm:pb-6">President's Welcome</h2>
                <p className="text-base sm:text-lg mt-4 px-4 sm:px-6 md:px-0 mx-auto md:mx-0">
                  Welcome to the Alpha Chapter of Kappa Theta Pi, Michigan’s premier professional technology fraternity. On behalf of our chapter, I am excited to welcome you to our fraternity’s website, where you can catch a glimpse of the passion and excellence that our chapter celebrates.
                  <br/><br/>Kappa Theta Pi offers brothers the support  to be extraordinary during their time at Michigan with resources centered around five pillars: professional development, alumni connections, social growth, technological advancement, and academic support. From project teams and study groups to professional development workshops and hackathons / design jams, we foster a culture of growth encouraging members to pursue their tech passions. Our chapter values diversity, with brothers contributing unique experiences and excelling as student leaders. We celebrate our diverse brotherhood, welcoming all united by a passion for technology.
                  <br/><br/>Reflecting on my time at Michigan, KTP has been the most impactful part of my college experience. I have witnessed the growth of some of Michigan’s most brilliant and ambitious professionals, seeing first-hand the incredible things they do. More importantly, I have been introduced to lifelong friends and connections who serve as a constant source of inspiration and always support me to be my full and best self. I invite you to explore our website and learn more about our brotherhood.​
                  <br/><br/>With love,
                  <br />Lily Medway
                  <br />President, 2024
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Pillars */}
        <div className="bg-light-blue w-full">
          <div className="px-4 sm:px-6 md:px-12 lg:px-16 py-8 sm:py-12 md:py-16" id="our pillars-section">
            <div className="text-center">
              <h2 className="text-3xl mt-8 sm:text-4xl font-bold text-ktp-dark-blue pb-4 sm:pb-6">Our Pillars</h2>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Professional Development */}
              <div className="bg-white shadow-lg rounded-lg p-6 text-center transform transition-transform duration-650 ease-in-out hover:scale-110 hover:shadow-xl">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <MdOutlineWork className="text-pink-500 text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Professional Development</h3>
                <p className="text-gray-600">Through events like interview training, resume building, one-on-one mentorship, private company recruiting, and more, Kappa Theta Pi Professional Development aims to prepare members for success in any technology-related career. We take pride in developing the tech leaders of the future.</p>
              </div>

              {/* Alumni Connections */}
              <div className="bg-white shadow-lg rounded-lg p-6 text-center transform transition-transform duration-650 ease-in-out hover:scale-110 hover:shadow-xl">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <PiGlobeBold className="text-orange-500 text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Alumni Connections</h3>
                <p className="text-gray-600">Our alumni are spread out across the world and work on cutting-edge technologies. They work at a plethora of companies - from tech companies like Microsoft, Amazon, Facebook, Apple, and Google, to startups, consulting firms, financial technology firms, and more!</p>
              </div>

              {/* Social Growth */}
              <div className="bg-white shadow-lg rounded-lg p-6 text-center transform transition-transform duration-650 ease-in-out hover:scale-110 hover:shadow-xl">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <FaPeopleGroup className="text-teal-500 text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Social Growth</h3>
                <p className="text-gray-600">The people you meet in Kappa Theta Pi will go on to be some of your closest friends throughout college and beyond. We host a variety of exclusive social events throughout the semester through which our members can bond, some of which include formal, tailgates, retreat, and apple picking.</p>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 justify-center">
              {/* Technical Advancement */}
              <div className="bg-white shadow-lg rounded-lg p-6 text-center transform transition-transform duration-650 ease-in-out hover:scale-110 hover:shadow-xl">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                    <IoIosSpeedometer className="text-green-500 text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Technical Advancement</h3>
                <p className="text-gray-600">Kappa Theta Pi provides members numerous opportunities to enhance their current technical skills, as well as learn new ones. Whether it be participation in one of our various project teams or attending a technical workshop, we make it easy for our members to expand their expertise.</p>
              </div>

              {/* Academic Support */}
              <div className="bg-white shadow-lg rounded-lg p-6 text-center transform transition-transform duration-650 ease-in-out hover:scale-110 hover:shadow-xl">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <HiAcademicCap className="text-blue-500 text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Academic Support</h3>
                <p className="text-gray-600">Kappa Theta Pi brothers strive to foster academic growth and excellence for each other. We provide a supportive network filled with some of the brightest tech minds at the university that members can always rely on for help in classes and extracurricular activities.</p>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="bg-white w-full">
          <div className="px-6 sm:px-12 md:px-24 lg:px-32 py-8 sm:py-12 md:py-16" id="history-section">
            <div className="relative flex flex-col items-center md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-8 pb-20">
              <div className="w-full md:w-3/5 text-center md:text-left">
                <h2 className="text-3xl mt-8 sm:text-4xl font-bold text-ktp-dark-blue pb-4 sm:pb-6 text-center">History</h2>
                <p className="text-base sm:text-lg mt-4 px-4 sm:px-6 md:px-0 mx-auto md:mx-0">Kappa Theta Pi takes pride in being the first professional technology fraternity in the country. Our members learn a plethora of skills needed to stay knowledgeable about the tech industry, as well as a strong sense of professional development for future job positions.
                  <br/><br/>KTP was founded on January 10, 2012, with the mission to create a tech community that enthusiastic students could join. In making KTP, the founders set up a strong community that has only grown in the 11 years since its inception.
                  <br/><br/>Our members come from all around campus. We are designers, analysts, computer scientists, engineers, artists, entrepreneurs, economists, philosophers, psychologists, and more. What makes the KTP community strong is our shared passion for technology and our unique backgrounds meshing together as one.
                  <br/><br/>Our alumni are part of an extensive and tight-knit network that stretches across the country. They can be found from Seattle to New York, from Silicon Valley to Detroit, in both startup companies and larger businesses. Our alumni provide valuable insight for our members’ professional development.
                </p>
              </div>
              <div className="relative w-full md:w-2/5 flex justify-center">
                <div className="absolute blob-c z-0">
                  <div className="shape-blob eight"></div>
                  <div className="shape-blob nine"></div>
                </div>
                <img src={History} alt="KTP Founders" className="relative z-10 w-3/4 h-auto rounded-full border-8 border-x-sky-200" />
              </div>
            </div>
          </div>
        </div>

        {/* DEI Commitment */}
        <div className="bg-light-blue w-full">
          <div className="px-4 ml-16 mr-16 sm:px-6 md:px-12 lg:px-16 py-8 sm:py-12 md:py-16" id="dei commitment-section">
            <div className="flex flex-col items-center pb-10 md:pb-16 lg:pb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl mt-4 md:mt-6 font-bold text-ktp-dark-blue pb-4 sm:pb-5 lg:pb-6 text-center">DEI Commitment</h2>
              <p className="text-base sm:text-lg mt-4 px-4 sm:px-6 md:px-0 mx-auto md:mx-0">The world of technology is unique, diverse, and multi-faceted. We believe that our brothers should be too. In Kappa Theta Pi, we’re passionate about cultivating an inclusive community that promotes and values diversity. Our dedication to diversity, equity, and inclusion is unwavering; these values are central to our mission and to our impact. We know that having heterogeneous perspectives helps generate better ideas to solve the nuanced problems of a changing — and increasingly diverse — world.
                <br/><br/>In KTP, we have a responsibility to address structural inequality in our communities as well as the social and cultural dimensions of technology. We are committed to harnessing the best of KTP — our people, platform, and technical innovation — to make lasting change inside and outside of our organization.
              </p>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default About;
