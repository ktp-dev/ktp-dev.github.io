'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import { IoIosSpeedometer } from 'react-icons/io';
import { MdOutlineWork } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { PiGlobeBold } from "react-icons/pi";
import { HiAcademicCap } from "react-icons/hi2";
import Header from '../../components/Header';
import Footer from '../../components/Footer';


const categories = ['President\'s Welcome', 'Our Pillars', 'History', 'DEI Commitment'];

export default function About() {
  const [selectedCategory, setSelectedCategory] = useState('President\'s Welcome');
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // No longer needed since we're using button styling instead of underline
  }, [selectedCategory]);

  const handleCategoryClick = (category: string, index: number) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <Header />

      <div className="relative bg-white w-full">
        {/* Blob Container */}
        <div className="absolute inset-0 blob-c z-0">
          <div className="shape-blob eight"></div>
          <div className="shape-blob nine"></div>
        </div>
      </div>

      {/* Blob Container */}
      <div className="inset-0 blob-c z-0">
        <div className="shape-blob eight"></div>
        <div className="shape-blob nine"></div>
      </div>

      <div className="relative w-full">
        {/* Page Content */}
        <div className="relative pt-12 sm:pt-16 z-10 px-6 sm:px-8 md:px-16 lg:px-20">
          <div className="flex flex-col text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-0" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
              About Us
            </h1>
            <p className="text-base sm:text-xl mt-8 mb-8 font-medium text-gray-600 max-w-2xl mx-auto" style={{ color: 'grey' }}>
              Learn more about who we are at Kappa Theta Pi!
            </p>
          </div>
        </div>
      </div>

      {/* Category filter buttons */}
      <div className="relative sm:mt-0 mb-8 sm:mb-12 lg:mb-16 px-6 sm:px-8 md:px-16 lg:px-24 xl:px-32">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <ScrollLink
              key={category}
              className={`px-3 sm:px-4 py-2 rounded-[40px] text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer whitespace-nowrap text-center ${selectedCategory === category ? 'bg-[#315CA9] text-white' : 'bg-gray-200/60 text-gray-700 hover:bg-gray-300/80'}`}
              onClick={() => handleCategoryClick(category, index)}
              to={`${category.toLowerCase().replace(/\s+/g, '-')}-section`}
              smooth={true}
              duration={200}
              ref={(el: unknown) => { categoryRefs.current[index] = el as HTMLDivElement | null; }}
            >
              {category}
            </ScrollLink>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col space-y-12">
        {/* President's Welcome */}
        <div className="w-full">
          <div className="px-6 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-8 sm:py-12 md:py-16" id="president's-welcome-section">
            <div className="relative flex flex-col items-center lg:flex-row lg:items-start space-y-12 lg:space-y-0 lg:space-x-12 pb-10">
              <div className="relative w-full lg:w-2/5 flex justify-center">
                <div className="absolute blob-c z-0 flex justify-center items-center z-0">
                  <div className="shape-blob eight absolute"></div>
                  <div className="shape-blob nine absolute"></div>
                </div>
                <img 
                  src="/images/members/Kolli_Himanish.jpg" 
                  alt="President's Headshot" 
                  className="relative z-10 w-3/4 h-auto rounded-full border-8 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
                  style={{ borderLeftColor: '#d1fae5', borderRightColor: '#d1fae5', borderTopColor: '#e5e7eb', borderBottomColor: '#e5e7eb' }}
                />
              </div>
              <div className="w-full lg:w-3/5 text-left relative z-10">
                <h2 className="text-center text-2xl sm:text-4xl font-black mb-10">President&apos;s Welcome</h2>
                <div className="text-base sm:text-lg leading-relaxed space-y-4">
                  <p>
                    Welcome to the Alpha Chapter of Kappa Theta Pi, Michigan&apos;s premier professional technology fraternity. On behalf of our chapter, I am excited to welcome you to our fraternity&apos;s website, where you can catch a glimpse of the passion and excellence that our chapter celebrates.
                  </p>
                  <p>
                    Kappa Theta Pi offers brothers the support to be extraordinary during their time at Michigan with resources centered around five pillars: professional development, alumni connections, social growth, technological advancement, and academic support. From project teams and study groups to professional development workshops and hackathons / design jams, we foster a culture of growth encouraging members to pursue their tech passions. Our chapter values diversity, with brothers contributing unique experiences and excelling as student leaders. We celebrate our diverse brotherhood, welcoming all united by a passion for technology.
                  </p>
                  <p>
                    Reflecting on my time at Michigan, KTP has been the most impactful part of my college experience. I have witnessed the growth of some of Michigan&apos;s most brilliant and ambitious professionals, seeing first-hand the incredible things they do. More importantly, I have been introduced to lifelong friends and connections who serve as a constant source of inspiration and always support me to be my full and best self. I invite you to explore our website and learn more about our brotherhood.​
                  </p>
                  <p>
                    With love,<br />
                    Himanish Kolli<br />
                    President, 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="w-full" style={{ backgroundColor: '#F6FBFF' }}>
          <div className="px-6 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-8 sm:py-12 md:py-16" id="our-pillars-section">
            <div className="text-center">
              <h2 className="text-center text-2xl sm:text-4xl font-black mb-10">Our Pillars</h2>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Professional Development */}
              <div className="bg-white shadow-lg rounded-lg p-6 text-center transform transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <MdOutlineWork className="text-pink-500 text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Professional Development</h3>
                <p className="text-gray-600 leading-relaxed">Through events like interview training, resume building, one-on-one mentorship, private company recruiting, and more, Kappa Theta Pi Professional Development aims to prepare members for success in any technology-related career. We take pride in developing the tech leaders of the future.</p>
              </div>

              {/* Alumni Connections */}
              <div className="bg-white shadow-lg rounded-lg p-6 text-center transform transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <PiGlobeBold className="text-orange-500 text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Alumni Connections</h3>
                <p className="text-gray-600 leading-relaxed">Our alumni are spread out across the world and work on cutting-edge technologies. They work at a plethora of companies - from tech companies like Microsoft, Amazon, Facebook, Apple, and Google, to startups, consulting firms, financial technology firms, and more!</p>
              </div>

              {/* Social Growth */}
              <div className="bg-white shadow-lg rounded-lg p-6 text-center transform transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <FaPeopleGroup className="text-teal-500 text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Social Growth</h3>
                <p className="text-gray-600 leading-relaxed">The people you meet in Kappa Theta Pi will go on to be some of your closest friends throughout college and beyond. We host a variety of exclusive social events throughout the semester through which our members can bond, some of which include formal, tailgates, retreat, and apple picking.</p>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 justify-center">
              {/* Technical Advancement */}
              <div className="bg-white shadow-lg rounded-lg p-6 text-center transform transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                    <IoIosSpeedometer className="text-green-500 text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Technical Advancement</h3>
                <p className="text-gray-600 leading-relaxed">Kappa Theta Pi provides members numerous opportunities to enhance their current technical skills, as well as learn new ones. Whether it be participation in one of our various project teams or attending a technical workshop, we make it easy for our members to expand their expertise.</p>
              </div>

              {/* Academic Support */}
              <div className="bg-white shadow-lg rounded-lg p-6 text-center transform transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <HiAcademicCap className="text-blue-500 text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Academic Support</h3>
                <p className="text-gray-600 leading-relaxed">Kappa Theta Pi brothers strive to foster academic growth and excellence for each other. We provide a supportive network filled with some of the brightest tech minds at the university that members can always rely on for help in classes and extracurricular activities.</p>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="bg-white w-full">
          <div className="px-6 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-8 sm:py-12 md:py-16" id="history-section">
            <div className="relative flex flex-col items-center lg:flex-row lg:items-start space-y-12 lg:space-y-0 lg:space-x-12 pb-20">
              <div className="w-full lg:w-3/5 text-left relative z-10">
                <h2 className="text-center text-2xl sm:text-4xl font-black mb-10">History</h2>
                <div className="text-base sm:text-lg leading-relaxed space-y-4">
                  <p>
                    Kappa Theta Pi takes pride in being the first professional technology fraternity in the country. Our members learn a plethora of skills needed to stay knowledgeable about the tech industry, as well as a strong sense of professional development for future job positions.
                  </p>
                  <p>
                    KTP was founded on January 10, 2012, with the mission to create a tech community that enthusiastic students could join. In making KTP, the founders set up a strong community that has only grown in the 11 years since its inception.
                  </p>
                  <p>
                    Our members come from all around campus. We are designers, analysts, computer scientists, engineers, artists, entrepreneurs, economists, philosophers, psychologists, and more. What makes the KTP community strong is our shared passion for technology and our unique backgrounds meshing together as one.
                  </p>
                  <p>
                    Our alumni are part of an extensive and tight-knit network that stretches across the country. They can be found from Seattle to New York, from Silicon Valley to Detroit, in both startup companies and larger businesses. Our alumni provide valuable insight for our members&apos; professional development.
                  </p>
                </div>
              </div>
              <div className="relative w-full lg:w-2/5 flex justify-center">
                <div className="absolute blob-c z-0">
                  <div className="shape-blob eight"></div>
                  <div className="shape-blob nine"></div>
                </div>
                <img src="/images/about/History.jpg" alt="KTP Founders" className="relative z-10 w-3/4 h-auto rounded-full border-8 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg" style={{ borderLeftColor: '#bae6fd', borderRightColor: '#bae6fd', borderTopColor: '#e5e7eb', borderBottomColor: '#e5e7eb' }} />
              </div>
            </div>
          </div>
        </div>

        {/* DEI Commitment */}
        <div className="w-full" style={{ backgroundColor: '#F6FBFF' }}>
          <div className="px-6 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-8 sm:py-12 md:py-16" id="dei-commitment-section">
            <div className="flex flex-col items-center pb-10 md:pb-16 lg:pb-20">
              <h2 className="text-center text-2xl sm:text-4xl font-black mb-10">DEI Commitment</h2>
              <div className="text-base sm:text-lg leading-relaxed space-y-4">
                                  <p>
                    The world of technology is unique, diverse, and multi-faceted. We believe that our brothers should be too. In Kappa Theta Pi, we&apos;re passionate about cultivating an inclusive community that promotes and values diversity. Our dedication to diversity, equity, and inclusion is unwavering; these values are central to our mission and to our impact. We know that having heterogeneous perspectives helps generate better ideas to solve the nuanced problems of a changing — and increasingly diverse — world.
                  </p>
                <p>
                  In KTP, we have a responsibility to address structural inequality in our communities as well as the social and cultural dimensions of technology. We are committed to harnessing the best of KTP — our people, platform, and technical innovation — to make lasting change inside and outside of our organization.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
