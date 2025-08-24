'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CalendarIcon from '../../components/CalendarIcon';
import PinIcon from '../../components/PinIcon';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => (
  <div 
    className="py-4 cursor-pointer transition-all duration-300 px-4 -mx-4 border-b border-gray-200" 
    onClick={onClick}
  >
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold">{question}</h3>
      <span className={`text-[#234c8b] text-2xl transition-all duration-300 transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
        {isOpen ? '−' : '+'}
      </span>
    </div>
    <div 
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
      }`}
    >
      <p className="text-gray-600 leading-relaxed">{answer}</p>
    </div>
  </div>
);

export default function Rush() {
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);
  const [faqVisible, setFaqVisible] = useState(false);

  // Trigger FAQ animations after component mounts
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFaqVisible(true);
    }, 500); // Delay to let page load first

    return () => clearTimeout(timer);
  }, []);

  const faqs = [
    { question: "Who can rush KTP?", answer: "Anyone is allowed to rush — we gladly accept (and encourage) rushees from all disciplines! The only requirement is that you must have at least 3 semesters left in school after your pledging semester." },
    { question: "What is KTP looking for?", answer: "There's no cookie cutter \"ideal\" rushee — if there were, Kappa Theta Pi wouldn't be the multi-talented, interdisciplinary organization that it is! In our experience, the qualities you're looking for are often what we'd love to have in new members. In the end, we are an org united by our love for technology, and people who are truly passionate about tech are the ones who usually fit in the best." },
    { question: "How would I benefit from KTP?", answer: "KTP offers a supportive community of undergraduates who are all passionate about technology! Among other things, we offer mentoring in areas such as career advising, interview prep, resume development, and coursework. Additionally, we have current members and alumni working everywhere from the brightest startups to the tech giants of the corporate world. We believe that networking is far more than just professionalism — it's a process built on friendship, trust, and brotherhood." },
    { question: "Which majors are represented in KTP?", answer: "KTP is made up of a diverse group of people from schools all across campus. Generally, our members tend to be computer science majors or in the School of Information, but we are proud to have actives with backgrounds in creative writing, philosophy, business, women's studies, and entrepreneurship! We love (and encourage) rushees from all disciplines." },
    { question: "What types of social events does KTP have?", answer: "KTP aims to have at minimum one sober and one non-sober event per month. In the past, we have had barn dances, bowling nights, formals, Smash tournaments, and many more events." },
    { question: "How much of a time commitment is pledging?", answer: "As with all campus organizations, what you get out of the organization depends on what you put into it. We believe that our pledging process isn't strenuous and could be accommodated by most schedules.\nIf you have any further questions or want to learn more about KTP before rush, feel free to send us an email at ktp-board@umich.edu or stop by our booths at Festifall and Northfest." },
  ];

  const toggleQuestion = (index: number) => {
    setOpenQuestions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="flex-1 px-6 sm:px-8 md:px-16 lg:px-20">
        
        {/* Blob Container */}
        <div className="inset-0 blob-c z-0">
          <div className="shape-blob eight"></div>
          <div className="shape-blob nine"></div>
        </div>

        {/* Page content */}
        <div className="relative w-full z-10">
          {/* Page Content */}
          <div className="relative pt-12 sm:pt-16 z-10">
            <div className="flex flex-col text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-0">Learn About Joining KTP!</h1>
              <p className="text-base sm:text-xl mt-8 mb-8 font-medium text-gray-600 max-w-2xl mx-auto" style={{ color: 'grey' }}>
                Welcome to Kappa Theta Pi&apos;s Fall 2025 Rush! <br></br>Here&apos;s our rush schedule. Applications are due September 6, 2025
              </p>
              <div className="flex justify-center space-x-4 mb-8">
                <a href="https://forms.gle/oXMx7Ewo6uPP1Spm9" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-[#315CA9] text-white rounded-[40px] text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
                  Interest Form
                </a>
                <a href="https://forms.gle/dXfoiTwUGpmrs88W6" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-[#315CA9] text-white rounded-[40px] text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
                  Application Link
                </a>
              </div>
              <p className="text-sm sm:text-lg mb-16 font-medium text-gray-600" style={{ color: 'grey' }}>
                You can also join our <a href='https://calendar.google.com/calendar/u/0?cid=Y185MTA0MjdiZjlkMzlkMzk3YWFlZTExNTZmZDg0ZDUxY2MxYmE3NzdmNGZjOWZmZDQwMjMxOGRhMjA2ZTk4ZjUxQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20' target="_blank" className="text-[#315CA9] hover:text-[#234c8b]">F25 Rush Google Calendar</a> to see the dates, times, and locations of all Open Rush events.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
        {/* Main content */}
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* Timeline */}
          <div className="relative flex-1 mr-0 md:mr-8">
            <div className="border-l-2 border-dotted border-gray-400 absolute h-full left-4 top-0 transform -translate-x-1/2"></div>

            {/* Festifall*/}
            <div className="mb-10 flex items-center relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <div className="w-4 h-4 rounded-full bg-[#315CA9] z-10"></div>
              </div>
              <div className="ml-8 pl-4">
                <h2 className="text-lg sm:text-xl font-bold mb-3">Festifall</h2>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <CalendarIcon/>
                    <span className="ml-1 font-semibold text-black text-[13px] sm:text-base">Wednesday, August 27, 4:30-6:00 PM</span>
                  </div>
                  <div className="flex items-center">
                    <PinIcon />
                    <span className="ml-1 font-semibold text-black text-[13px] sm:text-base">Ingalls Mall, Table E066</span>
                  </div>
                </div>
                <p className="text-gray-600 flex items-center">Stop by our table to meet our brothers, hear about our professional development and social events, and learn how you can get involved this semester. Whether you&apos;re curious about the rush process or just want to see what KTP is all about, we&apos;d love to talk to you!
                </p>
              </div>
            </div>

            {/* Open House #1*/}
            <div className="mb-10 flex items-center relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <div className="w-4 h-4 rounded-full bg-[#315CA9] z-10"></div>
              </div>
              <div className="ml-8 pl-4">
                <h2 className="text-lg sm:text-xl font-bold mb-3">Open House #1</h2>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <CalendarIcon/>
                    <span className="ml-1 font-semibold text-black text-[13px] sm:text-base">Tuesday, September 2, 8:00-10:00 PM</span>
                  </div>
                  <div className="flex items-center">
                    <PinIcon />
                    <span className="ml-1 font-semibold text-black text-[13px] sm:text-base">CCCB 3460</span>
                  </div>
                </div>
                <p className="text-gray-600 flex items-center">Join us for one of our Open Houses! First, we&apos;ll give a presentation about what it means to be a brother in KTP. 
                Then, we&apos;ll break out into open discussion and you&apos;ll have a chance to ask our brothers any questions related to rush, Kappa Theta Pi, or anything else you may be wondering!</p>
              </div>
            </div>

            {/* Open House #2*/}
            <div className="mb-10 flex items-center relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <div className="w-4 h-4 rounded-full bg-[#315CA9] z-10"></div>
              </div>
              <div className="ml-8 pl-4">
                <h2 className="text-lg sm:text-xl font-bold mb-3">Open House #2</h2>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <CalendarIcon/>
                    <span className="ml-1 font-semibold text-black text-[13px] sm:text-base">Wednesday, September 3, 7:00-9:00 PM</span>
                  </div>
                  <div className="flex items-center">
                    <PinIcon />
                    <span className="ml-1 font-semibold text-black text-[13px] sm:text-base">CCCB 3460</span>
                  </div>
                </div>
                <p className="text-gray-600 flex items-center">The same information will be presented at both Open Houses. Feel free to come to just one Open House or both!</p>
              </div>
            </div>

            {/*DEI Panel*/}
            <div className="mb-10 flex items-center relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <div className="w-4 h-4 rounded-full bg-[#315CA9] z-10"></div>
              </div>
              <div className="ml-8 pl-4">
                <h2 className="text-lg sm:text-xl font-bold mb-3">DEI Panel</h2>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <CalendarIcon/>
                    <span className="ml-1 font-semibold text-black text-[13px] sm:text-base">Thursday, September 4, 6:30-8:00 PM</span>
                  </div>
                  <div className="flex items-center">
                    <PinIcon />
                    <span className="ml-1 font-semibold text-black text-[13px] sm:text-base">League - Michigan Room (Second Floor)</span>
                  </div>
                </div>
                                <p className="text-gray-600 flex items-center">In KTP, we love to celebrate our members&apos; diversity and share honest conversations about how the DEI climate can be
                improved in KTP, on campus, and beyond. At our DEI Panel, you will have the opportunity to hear brothers&apos; experiences as underrepresented minorities in tech.
                After the panel, we&apos;ll break out into open discussion. Come learn about the many people and communities that make up KTP!</p>
              </div>
            </div>

            {/*Resume and Application Office Hours*/}
            <div className="mb-10 flex items-center relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <div className="w-4 h-4 rounded-full bg-[#315CA9] z-10"></div>
              </div>
              <div className="ml-8 pl-4">
                <h2 className="text-lg sm:text-xl font-bold mb-3">Application Office Hours</h2>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <CalendarIcon/>
                    <span className="ml-1 font-semibold text-black text-[13px] sm:text-base">Thursday, September 4, 8:00-9:00 PM</span>
                  </div>
                  <div className="flex items-center">
                    <PinIcon />
                    <span className="ml-1 font-semibold text-black text-[13px] sm:text-base">Virtual (Zoom)</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 flex items-center">At this event, we&apos;ll share tips for crafting a strong resume, then move into both high-level discussions and 1:1 support to help you with your KTP Rush applications!<br></br>
                </p>
                {/* <a href="http://tinyurl.com/ktp-f24-rush-overview" target="_blank" rel="noopener noreferrer">
                  <button className="px-3 sm:px-4 py-2 bg-blue-500 mt-2 text-white rounded-lg transform transition-all duration-200 hover:scale-105 hover:bg-blue-700 text-sm sm:text-base">
                     Zoom
                  </button>
                </a> */}
                <a href="https://umich.zoom.us/j/92338618781?jst=2" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-[#315CA9] text-white rounded-[40px] text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
                  Join Zoom Meeting
                </a>
              </div>
            </div>

            {/* Application Deadline */}
            <div className="mb-10 flex items-center relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <div className="w-4 h-4 rounded-full bg-[#315CA9] z-10"></div>
              </div>
              <div className="ml-8 pl-4">
                <h2 className="text-lg sm:text-xl font-bold mb-3">Application Deadline</h2>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <CalendarIcon/>
                    <span className="ml-1 font-semibold text-black text-[13px] sm:text-base">Saturday, September 6, 11:59 PM</span>
                  </div>
                </div>
                <a href="https://forms.gle/nhgTGks5KmpTFz1j6" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-[#315CA9] text-white rounded-[40px] text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
                  Apply Here
                </a>
              </div>
            </div>

            {/* Closed Rush */}
            <div className="relative mb-10 flex items-center relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <div className="w-4 h-4 rounded-full bg-[#315CA9] z-10"></div>
              </div>
              <div className="ml-8 pl-4">
                <h2 className="text-lg sm:text-xl font-bold mb-3">Closed Rush</h2>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <CalendarIcon/>
                    <span className="ml-1 font-semibold text-black text-[13px] sm:text-base">From Monday, September 8 onward</span>
                  </div>
                </div>
                <p className="text-gray-600 flex items-center">KTP&apos;s closed rush process consists of events for us to get to know each other, including 1:1 coffee chats and a final round of interviews.</p>
              </div>
            </div>
          </div>

          {/* Rush Video */}
          <div className="relative w-full lg:w-1/3 p-2 mb-10">
            <div className="absolute blob-c">
              <div className="shape-blob rush-static-green"></div>
              <div className="shape-blob rush-static-blue"></div>
            </div>
            <div className="relative z-1 h-64 lg:h-80">
              <iframe 
                className="rounded-xl w-full h-full"
                src="https://www.youtube.com/embed/pktKW6XDJKk?si=7lMqZdXYe162kOob" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen>  
              </iframe>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 mb-16 relative z-1">
          <h2 className={`text-center text-2xl sm:text-4xl font-black mb-10 transition-all duration-700 ${
            faqVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ease-out ${
                  faqVisible 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-8'
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                <FAQItem 
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openQuestions.includes(index)}
                  onClick={() => toggleQuestion(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
