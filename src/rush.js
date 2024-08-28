import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CalendarIcon from './CalendarIcon';
import PinIcon from './PinIcon';
import Footer from './Footer.js';
import Header from './Header.js';

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-gray-300 py-4 cursor-pointer" onClick={onClick}>
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold">{question}</h3>
      <span className="text-blue-700 text-2xl">{isOpen ? '-' : '+'}</span>
    </div>
    {isOpen && <p className="text-gray-600 mt-2">{answer}</p>}
  </div>
);

function Rush() {
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqs = [
    { question: "Who can rush KTP?", answer: "Anyone is allowed to rush — we gladly accept (and encourage) rushees from all disciplines! The only requirement is that you must have at least 3 semesters left in school after your pledging semester." },
    { question: "What is KTP looking for?", answer: "There’s no cookie cutter “ideal” rushee — if there were, Kappa Theta Pi wouldn’t be the multi-talented, interdisciplinary organization that it is! In our experience, the qualities you’re looking for are often what we’d love to have in new members. In the end, we are an org united by our love for technology, and people who are truly passionate about tech are the ones who usually fit in the best." },
    { question: "How would I benefit from KTP?", answer: "KTP offers a supportive community of undergraduates who are all passionate about technology! Among other things, we offer mentoring in areas such as career advising, interview prep, resume development, and coursework. Additionally, we have current members and alumni working everywhere from the brightest startups to the tech giants of the corporate world. We believe that networking is far more than just professionalism — it's a process built on friendship, trust, and brotherhood." },
    { question: "Which majors are represented in KTP?", answer: "KTP is made up of a diverse group of people from schools all across campus. Generally, our members tend to be computer science majors or in the School of Information, but we are proud to have actives with backgrounds in creative writing, philosophy, business, women’s studies, and entrepreneurship! We love (and encourage) rushees from all disciplines." },
    { question: "What types of social events does KTP have?", answer: "KTP aims to have at minimum one sober and one non-sober event per month. In the past, we have had barn dances, bowling nights, formals, Smash tournaments, and many more events." },
    { question: "How much of a time commitment is pledging?", answer: "As with all campus organizations, what you get out of the organization depends on what you put into it. We believe that our pledging process isn’t strenuous and could be accommodated by most schedules.\nIf you have any further questions or want to learn more about KTP before rush, feel free to send us an email at ktp-board@umich.edu or stop by our booths at Festifall and Northfest." },
  ];

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header></Header>
      
      <div className="px-6 sm:px-12 md:px-32">
        {/* Page content */}
        <div className="absolute inset-0 blob-c z-0">
              <div className="shape-blob eight"></div>
              <div className="shape-blob nine"></div>
            </div>
        <div className="relative py-12 sm:py-16 z-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            {/* Blob Container */}
            <h1 className="text-3xl sm:text-5xl font-black">Learn about joining KTP!</h1>
            <p className="text-base sm:text-xl mt-4 mb-8 font-medium text-gray-600" style={{ color: 'grey' }}>
            Welcome to Kappa Theta Pi's Fall 2024 Rush! <br></br>Here's our rush schedule, applications are due September 5, 2024
            </p>
            <div className="flex space-x-4">
            <a href="https://tinyurl.com/ktp-f24-rush-interest" target="_blank" rel="noopener noreferrer">
              <button className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg transform transition-all duration-200 hover:scale-105 hover:bg-blue-700 text-sm sm:text-base">
                Interest Form
              </button>
            </a>
            <a href="https://tinyurl.com/ktp-f24-rush-app" target="_blank" rel="noopener noreferrer">
              <button className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg transform transition-all duration-200 hover:scale-105 hover:bg-blue-700 text-sm sm:text-base">
                Application Link
              </button>
            </a>
            </div>
            <p className="text-sm sm:text-lg mt-4 mb-16 font-medium text-gray-600" style={{ color: 'grey' }}>
            You can also join our <a href='https://calendar.google.com/calendar/u/0?cid=Y18zMDQ0YWFjYmE3MDE1YmQyYjZmNDkwNTJhMWE3NWMwYzc4MDVlMmFiYTIyY2Q5MDRjMjk1NmVmZTcyMGZiZGQ4QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20' target="_blank" className="text-blue-600 hover:text-blue-800">F24 Rush Google Calendar</a> for dates/times/locations for all of our Open Rush events.
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col md:flex-row justify-between">
          {/* Timeline */}
          <div className="relative flex-1 mr-0 md:mr-8">
            <div className="border-l-2 border-dotted border-gray-400 absolute h-full left-4 top-0 transform -translate-x-1/2"></div>

            {/* Open House #2*/}
            <div className="mb-10 flex items-center relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <div className="w-4 h-4 rounded-full bg-blue-700 z-10"></div>
              </div>
              <div className="ml-12 pl-4">
                <h2 className="text-lg sm:text-xl font-bold mb-1">Open House #1</h2>
                <p className="text-gray-600 flex flex-col sm:flex-row sm:items-center mb-4">
                  <CalendarIcon/><p className="ml-1 mr-3">Sunday, September 1st, 7:00-9:00PM</p> <span className="hidden sm:inline">•</span>  <div className="flex ml-0 sm:ml-3"><PinIcon /><p className="ml-1">Kuenzel Room (Michigan Union)</p></div>
                </p>
                <p className="text-gray-600 flex items-center">Join us for one of our Open Houses! First, we'll give a presentation about what it means to be a brother in KTP. 
                Then, we'll break out into open discussion and you'll have a chance to ask our brothers any questions related to rush, Kappa Theta Pi, or anything else you may be wondering!</p>
              </div>
            </div>

            {/* Open House #1*/}
            <div className="mb-10 flex items-center relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <div className="w-4 h-4 rounded-full bg-blue-700 z-10"></div>
              </div>
              <div className="ml-12 pl-4">
                <h2 className="text-lg sm:text-xl font-bold mb-1">Open House #2</h2>
                <p className="text-gray-600 flex flex-col sm:flex-row sm:items-center mb-4">
                  <CalendarIcon/><p className="ml-1 mr-3">Monday, September 2nd, 7:30-9:30PM</p> <span className="hidden sm:inline">•</span> <div className="flex ml-0 sm:ml-3"><PinIcon /><p className="ml-1">Henderson Room (Michigan League)</p></div>
                </p>
                {/* <p className="text-gray-600 flex items-center">Join us for one of our Open Houses! First, we'll give a presentation about what it means to be a brother in KTP. 
                Then, we'll break out into open discussion and you'll have a chance to ask our brothers any questions related to rush, Kappa Theta Pi, or anything else you may be wondering!</p> */}
              </div>
            </div>

            

            {/*DEI Panel*/}
            <div className="mb-10 flex items-center relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <div className="w-4 h-4 rounded-full bg-blue-700 z-10"></div>
              </div>
              <div className="ml-12 pl-4">
                <h2 className="text-lg sm:text-xl font-bold mb-1">DEI Panel</h2>
                <p className="text-gray-600 flex flex-col sm:flex-row sm:items-center mb-4">
                  <CalendarIcon/><p className="ml-1 mr-3">Tuesday, September 3rd, 6:30-8:00 PM</p> <span className="hidden sm:inline">•</span> <div className="flex ml-0 sm:ml-3"><PinIcon /><p className="ml-1">NQ 2435</p></div>
                </p>
                <p className="text-gray-600 flex items-center">In KTP, we love to celebrate our members' diversity and share honest conversations about how the DEI climate can be 
                improved in KTP, on campus, and beyond. At our DEI Panel, you will have the opportunity to hear brothers' experiences as underrepresented minorities in tech. 
                After the panel, we'll break out into open discussion. Come learn about the many people and communities that make up KTP!</p>
              </div>
            </div>

            {/*Virtual Resume and Application Office Hours*/}
            <div className="mb-10 flex items-center relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <div className="w-4 h-4 rounded-full bg-blue-700 z-10"></div>
              </div>
              <div className="ml-12 pl-4">
                <h2 className="text-lg sm:text-xl font-bold mb-1">Virtual Resume and Application Office Hours</h2>
                <p className="text-gray-600 flex flex-col sm:flex-row sm:items-center mb-4">
                  <CalendarIcon/><p className="ml-1 mr-3">Wednesday, September 4th, 6:00-8:00PM</p> <span className="hidden sm:inline">•</span> <div className="flex ml-0 sm:ml-3"><PinIcon /><p className="ml-1">Virtual (Zoom)</p></div>
                </p>
                <p className="text-gray-600 flex items-center">At this event, we'll offer some tips for crafting a strong resume, then we'll hop into breakout rooms 
                to offer you some help on your KTP Rush Applications!</p>
              </div>
            </div>

            {/* Application Deadline */}
            <div className="mb-10 flex items-center relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <div className="w-4 h-4 rounded-full bg-blue-700 z-10"></div>
              </div>
              <div className="ml-12 pl-4">
                <h2 className="text-lg sm:text-xl font-bold mb-1">Application Deadline</h2>
                <p className="text-gray-600 flex flex-col sm:flex-row sm:items-center mb-4">
                  <CalendarIcon/><p className="ml-1 mr-3">Thursday, September 5th, 11:59pm</p> 
                </p>
                <a href="https://tinyurl.com/ktp-f24-rush-app" target="_blank" rel="noopener noreferrer">
                  <button className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg transform transition-all duration-200 hover:scale-105 hover:bg-blue-700 text-sm sm:text-base">
                    Apply Here
                  </button>
                </a>
              </div>
            </div>

            {/* Closed Rush */}
            <div className="relative mb-10 flex items-center relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <div className="w-4 h-4 rounded-full bg-blue-700 z-10"></div>
              </div>
              <div className="ml-12 pl-4">
                <h2 className="text-lg sm:text-xl font-bold mb-1">Closed Rush</h2>
                <p className="text-gray-600 flex flex-col sm:flex-row sm:items-center mb-4">
                  <CalendarIcon/><p className="ml-1 mr-3">Monday, September 9th - Thursday, September 19th</p> 
                </p>
                <p className="text-gray-600 flex items-center">Our Closed Rush is invite-only. KTP's closed rush process consists of 1:1 coffee chats, three events for us to get to know each other, and a final round of interviews.</p>
              </div>
            </div>
          </div>

          {/* Rush Video */}
          <div className="relative w-full md:w-2/3 lg:w-1/3 p-2 mb-10">
            <div className="absolute blob-c">
              <div className="shape-blob rush-static-green"></div>
              <div className="shape-blob rush-static-blue"></div>
            </div>
            <div className="relative z-10 h-64">
              <iframe 
                className="rounded-xl w-full h-full"
                src="https://www.youtube.com/embed/WuihbLVE6Zo?si=7lMqZdXYe162kOob" 
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
        <div className="mt-16 mb-16 relative z-10">
          <h2 className="text-center text-2xl sm:text-4xl font-black mb-10">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openQuestion === index}
                onClick={() => toggleQuestion(index)}
              />
            ))}
          </div>
        </div>
      </div>


      <Footer></Footer>
    </div>
  );
}

export default Rush;
