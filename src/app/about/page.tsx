import Image from 'next/image'
import { IoIosSpeedometer } from 'react-icons/io'
import { MdOutlineWork } from 'react-icons/md'
import { FaPeopleGroup } from 'react-icons/fa6'
import { PiGlobeBold } from 'react-icons/pi'
import { HiAcademicCap } from 'react-icons/hi2'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const categories = [
  { label: "President's Welcome", href: '#presidents-welcome-section' },
  { label: 'Our Pillars', href: '#our-pillars-section' },
  { label: 'History', href: '#history-section' },
  { label: 'DEI Commitment', href: '#dei-commitment-section' },
] as const

export default function About() {
  return (
    <div>
      <Header />

      {/* Spill clip — `page-spill-clip` is relative only on mobile (desktop CB unchanged).
          Hero blobs: top/left only — never inset-0 (bottom:0 makes the layer page-tall,
          so top:8% on children is 8% of the document, not the viewport). */}
      <div className="page-spill-clip w-full max-w-full overflow-x-hidden">
        <div className="absolute left-0 right-0 top-0 z-0 blob-c about-mobile-blobs about-hero-blobs">
          <div className="shape-blob eight"></div>
          <div className="shape-blob nine"></div>
        </div>

        <div className="relative w-full">
          <div className="relative z-10 px-6 pb-2 pt-12 sm:px-8 sm:pt-16 md:px-16 lg:px-20">
            <div className="flex flex-col text-center">
              <h1
                className="mb-0 text-3xl font-black sm:text-4xl md:text-5xl"
                style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}
              >
                About Us
              </h1>
              <p
                className="mx-auto mb-8 mt-8 max-w-2xl text-base font-medium text-gray-600 sm:text-xl"
                style={{ color: 'grey' }}
              >
                Learn more about who we are at Kappa Theta Pi!
              </p>
            </div>
          </div>
        </div>

        <div className="relative mb-8 px-6 sm:mb-12 sm:mt-0 sm:px-8 md:px-16 lg:mb-16 lg:px-24 xl:px-32">
          <nav
            className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-4 md:gap-6 lg:gap-8"
            aria-label="About sections"
          >
            {categories.map((category) => (
              <a
                key={category.href}
                href={category.href}
                className="cursor-pointer whitespace-nowrap rounded-[40px] bg-gray-200/60 px-3 py-2 text-center text-xs font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-300/80 hover:shadow-md sm:px-4 sm:text-sm md:text-base"
              >
                {category.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col space-y-12">
          <div className="w-full">
            <div
              className="scroll-mt-24 px-6 py-8 sm:px-8 sm:py-12 md:px-16 md:py-16 lg:px-24 xl:px-32"
              id="presidents-welcome-section"
            >
              <div className="relative flex flex-col items-center space-y-12 pb-10 lg:flex-row lg:items-start lg:space-x-12 lg:space-y-0">
                <div className="relative flex w-full justify-center lg:w-2/5">
                  <div className="absolute z-0 flex items-center justify-center blob-c about-mobile-blobs about-photo-blobs">
                    <div className="shape-blob eight absolute"></div>
                    <div className="shape-blob nine absolute"></div>
                  </div>
                  <Image
                    src="/images/members/Hollman_Teagan.jpg"
                    alt="President's Headshot"
                    width={800}
                    height={1422}
                    className="relative z-10 h-auto w-3/4 max-w-xs rounded-full border-8 sm:max-w-sm md:max-w-md lg:max-w-lg"
                    style={{
                      borderLeftColor: '#d1fae5',
                      borderRightColor: '#d1fae5',
                      borderTopColor: '#e5e7eb',
                      borderBottomColor: '#e5e7eb',
                    }}
                    sizes="(max-width: 640px) 75vw, (max-width: 1024px) 40vw, 400px"
                    priority
                  />
                </div>
                <div className="relative z-10 w-full text-left lg:w-3/5">
                  <h2 className="mb-10 text-center text-2xl font-black sm:text-4xl">
                    President&apos;s Welcome
                  </h2>
                  <div className="space-y-4 text-base leading-relaxed sm:text-lg">
                    <p>
                      Welcome to the Alpha Chapter of Kappa Theta Pi, Michigan&apos;s premier
                      professional technology fraternity. On behalf of our chapter, I am excited to
                      welcome you to our fraternity&apos;s website, where you can catch a glimpse of
                      the passion and excellence that our chapter celebrates.
                    </p>
                    <p>
                      Kappa Theta Pi offers brothers the support to be extraordinary during their
                      time at Michigan with resources centered around five pillars: professional
                      development, alumni connections, social growth, technological advancement,
                      and academic support. From project teams and study groups to professional
                      development workshops and hackathons / design jams, we foster a culture of
                      growth encouraging members to pursue their tech passions. Our chapter values
                      diversity, with brothers contributing unique experiences and excelling as
                      student leaders. We celebrate our diverse brotherhood, welcoming all united
                      by a passion for technology.
                    </p>
                    <p>
                      Reflecting on my time at Michigan, KTP has been the most impactful part of my
                      college experience. I joined as a sophomore transfer student, unsure of where
                      my path in technology would take me, both in college and beyond. Since then,
                      KTP has given me growth, direction, and a diverse community of students that
                      supports one another through struggles and success. To me, being a part of
                      KTP is about figuring out your place in the present and the future,
                      surrounded by a brilliant and ambitious community of individuals doing just
                      the same. I invite you to explore our website and learn more about our
                      brotherhood.
                    </p>
                    <p>
                      With love,
                      <br />
                      Teagan Hollman
                      <br />
                      President, 2026
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full" style={{ backgroundColor: '#F6FBFF' }}>
            <div
              className="scroll-mt-24 px-6 py-8 sm:px-8 sm:py-12 md:px-16 md:py-16 lg:px-24 xl:px-32"
              id="our-pillars-section"
            >
              <div className="text-center">
                <h2 className="mb-10 text-center text-2xl font-black sm:text-4xl">Our Pillars</h2>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="transform rounded-lg bg-white p-6 text-center shadow-lg transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F0FA]">
                      <MdOutlineWork className="text-2xl text-[#315CA9]" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-center text-xl font-bold">Professional Development</h3>
                  <p className="leading-relaxed text-gray-600">
                    Through events like interview training, resume building, one-on-one mentorship,
                    private company recruiting, and more, Kappa Theta Pi Professional Development
                    aims to prepare members for success in any technology-related career. We take
                    pride in developing the tech leaders of the future.
                  </p>
                </div>

                <div className="transform rounded-lg bg-white p-6 text-center shadow-lg transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F0FA]">
                      <PiGlobeBold className="text-2xl text-[#315CA9]" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-center text-xl font-bold">Alumni Connections</h3>
                  <p className="leading-relaxed text-gray-600">
                    Our alumni are spread out across the world and work on cutting-edge
                    technologies. They work at a plethora of companies - from tech companies like
                    Microsoft, Amazon, Facebook, Apple, and Google, to startups, consulting firms,
                    financial technology firms, and more!
                  </p>
                </div>

                <div className="transform rounded-lg bg-white p-6 text-center shadow-lg transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F0FA]">
                      <FaPeopleGroup className="text-2xl text-[#315CA9]" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-center text-xl font-bold">Social Growth</h3>
                  <p className="leading-relaxed text-gray-600">
                    The people you meet in Kappa Theta Pi will go on to be some of your closest
                    friends throughout college and beyond. We host a variety of exclusive social
                    events throughout the semester through which our members can bond, some of
                    which include formal, tailgates, retreat, and apple picking.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 justify-center gap-8 lg:grid-cols-2">
                <div className="transform rounded-lg bg-white p-6 text-center shadow-lg transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F0FA]">
                      <IoIosSpeedometer className="text-2xl text-[#315CA9]" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-center text-xl font-bold">Technical Advancement</h3>
                  <p className="leading-relaxed text-gray-600">
                    Kappa Theta Pi provides members numerous opportunities to enhance their current
                    technical skills, as well as learn new ones. Whether it be participation in one
                    of our various project teams or attending a technical workshop, we make it easy
                    for our members to expand their expertise.
                  </p>
                </div>

                <div className="transform rounded-lg bg-white p-6 text-center shadow-lg transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F0FA]">
                      <HiAcademicCap className="text-2xl text-[#315CA9]" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-center text-xl font-bold">Academic Support</h3>
                  <p className="leading-relaxed text-gray-600">
                    Kappa Theta Pi brothers strive to foster academic growth and excellence for
                    each other. We provide a supportive network filled with some of the brightest
                    tech minds at the university that members can always rely on for help in
                    classes and extracurricular activities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full bg-white">
            <div
              className="scroll-mt-24 px-6 py-8 sm:px-8 sm:py-12 md:px-16 md:py-16 lg:px-24 xl:px-32"
              id="history-section"
            >
              <div className="relative flex flex-col items-center space-y-12 pb-20 lg:flex-row lg:items-start lg:space-x-12 lg:space-y-0">
                <div className="relative z-10 w-full text-left lg:w-3/5">
                  <h2 className="mb-10 text-center text-2xl font-black sm:text-4xl">History</h2>
                  <div className="space-y-4 text-base leading-relaxed sm:text-lg">
                    <p>
                      Kappa Theta Pi takes pride in being the first professional technology
                      fraternity in the country. Our members learn a plethora of skills needed to
                      stay knowledgeable about the tech industry, as well as a strong sense of
                      professional development for future job positions.
                    </p>
                    <p>
                      KTP was founded on January 10, 2012, with the mission to create a tech
                      community that enthusiastic students could join. In making KTP, the founders
                      set up a strong community that has only grown in the 11 years since its
                      inception.
                    </p>
                    <p>
                      Our members come from all around campus. We are designers, analysts, computer
                      scientists, engineers, artists, entrepreneurs, economists, philosophers,
                      psychologists, and more. What makes the KTP community strong is our shared
                      passion for technology and our unique backgrounds meshing together as one.
                    </p>
                    <p>
                      Our alumni are part of an extensive and tight-knit network that stretches
                      across the country. They can be found from Seattle to New York, from Silicon
                      Valley to Detroit, in both startup companies and larger businesses. Our
                      alumni provide valuable insight for our members&apos; professional
                      development.
                    </p>
                  </div>
                </div>
                <div className="relative flex w-full justify-center lg:w-2/5">
                  <div className="absolute z-0 blob-c about-mobile-blobs about-photo-blobs">
                    <div className="shape-blob eight"></div>
                    <div className="shape-blob nine"></div>
                  </div>
                  <Image
                    src="/images/about/History.jpg"
                    alt="KTP Founders"
                    width={800}
                    height={854}
                    className="relative z-10 h-auto w-3/4 max-w-xs rounded-full border-8 sm:max-w-sm md:max-w-md lg:max-w-lg"
                    style={{
                      borderLeftColor: '#bae6fd',
                      borderRightColor: '#bae6fd',
                      borderTopColor: '#e5e7eb',
                      borderBottomColor: '#e5e7eb',
                    }}
                    sizes="(max-width: 640px) 75vw, (max-width: 1024px) 40vw, 400px"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full" style={{ backgroundColor: '#F6FBFF' }}>
            <div
              className="scroll-mt-24 px-6 py-8 sm:px-8 sm:py-12 md:px-16 md:py-16 lg:px-24 xl:px-32"
              id="dei-commitment-section"
            >
              <div className="flex flex-col items-center pb-10 md:pb-16 lg:pb-20">
                <h2 className="mb-10 text-center text-2xl font-black sm:text-4xl">
                  DEI Commitment
                </h2>
                <div className="space-y-4 text-base leading-relaxed sm:text-lg">
                  <p>
                    The world of technology is unique, diverse, and multi-faceted. We believe that
                    our brothers should be too. In Kappa Theta Pi, we&apos;re passionate about
                    cultivating an inclusive community that promotes and values diversity. Our
                    dedication to diversity, equity, and inclusion is unwavering; these values are
                    central to our mission and to our impact. We know that having heterogeneous
                    perspectives helps generate better ideas to solve the nuanced problems of a
                    changing — and increasingly diverse — world.
                  </p>
                  <p>
                    In KTP, we have a responsibility to address structural inequality in our
                    communities as well as the social and cultural dimensions of technology. We are
                    committed to harnessing the best of KTP — our people, platform, and technical
                    innovation — to make lasting change inside and outside of our organization.
                  </p>
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
