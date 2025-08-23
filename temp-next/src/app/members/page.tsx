'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ReactTyped } from 'react-typed';
import { parseCsv } from '../../parseCsv';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';

// Import images
import LogoImages from '../../../public/images/LogosHover.png';
import defaultImage from '../../../public/images/default.jpg';

// Categories for the members
const categories = ['Actives', 'E-Board', 'Directors', 'Alumni'];

// Define the alumni variable
const hardcodedAlumni = [
  { pledgeClass: 'Founders', names: ['Brian Mansfield', 'Denny Tsai', 'Jacqueline Fontaine', 'Jing Guo', 'Julie Varghese', 'Louise Vongphrachanh', 'Nisha Dwivedi'] },
  { pledgeClass: 'Α', names: ['Andy Kolean', 'Chris Hong', 'Dan Miller', 'Hanwenbo Yang', 'Patrick Riggs', 'Phil Park'] },
  { pledgeClass: 'Β', names: ['Jay Raina', 'Jeremy Wdowik', 'Juliana Mi', 'Justin Anderson', 'Kate Findlay', 'Nick Felicidario'] },
  { pledgeClass: 'Γ', names: ['Aya Mimura', 'Ben Krawitz', 'Connor Waldo', 'Dan Sofferman', 'Dom Parise', 'Evan Stoddard', 'Greg Nelson', 'Jackie Franklin', 'Linglu Zhou', 'Louie Cordon', 'Megan Yee', 'Sam Bolin', 'Sarah Beadle', 'Shelby Lewin'] },
  { pledgeClass: 'Δ', names: ['Aadi Krishna', 'Abbey Lepisto', 'Angela Damato', 'Christine Yu', 'Colleen Miller', 'Dinker Ambe', 'Ellen Anderson', 'Greg Azevedo', 'Jaclyn Jaffe', 'Kelly Yuen', 'Kevin Cai', 'Lizzy Pratt', 'Melanie Kipke', 'Nicole Zeffer', 'Ryan Povall', 'Sonia Doshi'] },
  { pledgeClass: 'Ε', names: ['Andrew Riggs', 'Chris Elie', 'Dean Chenensky', 'Drew Dyer', 'Elisa Shibley', 'Isha Gupta', 'Jake Wellins', 'Kyle Moynihan', 'Lisa Lyons', 'Owen Yang', 'Patrick Wilson', 'Rebecca Lawson', 'Sam Dallstream', 'Yoav Helfman'] },
  { pledgeClass: 'Ζ', names: ['Alex House', 'Anavir Shermon', 'Ben Rathi', 'Blake Schewe', 'Bryce Beckwith', 'Christie Parkinson', 'Chuckry Vengadam', 'Connie Liu', 'Cooper Anstett', 'Courtney Quell', 'Dan Wilson', 'Kaitlin Singer', 'Maxim Aleksa', 'Michael Vander Lugt', 'Nimesha Muthya', 'Olivia Alge', 'Rishin Doshi'] },
  { pledgeClass: 'Η', names: ['Amos Cone', 'Brady Mathieson', 'Dara Metz', 'Han Na Shin', 'Ismael Halaweh', 'Julia Karpf', 'Kenny Heindel', 'Lauren Krawitz', 'Logan Meyer', 'Mark Strader', 'Merri Zervas', 'Neal Parikh', 'Pascal Sturmfels', 'Rosa Wu', 'Terrence Green'] },
  { pledgeClass: 'Θ', names: ['Arya Taylor', 'Colleen Feola', 'Gage Glupker', 'Grace Kim', 'Hyunjae Kim', 'Imani Williams', 'Jill Davidson', 'Josie Elordi', 'Lukas Trierweiler', 'Mackenzie Chyatte', 'Nikil Ramanathan', 'Ramana Keerthi'] },
  { pledgeClass: 'Ι', names: ['Ash Varma', 'Ava Randa', 'Billy Kryska', 'Brendan Paul', 'Daniel Chandross', 'Danielle Colbert', 'Esther Yan', 'Ethan Cartwright', 'Hannah Jenkins', 'Joana Rushiti', 'Joe Kunnath', 'Juli Polise', 'Kevin Huang', 'Kiera Krashesky', 'Rebecca Henry'] },
  { pledgeClass: 'Κ', names: ['Aliya Khan', 'Angel Tsai', 'Ankita Avadhani', 'Benjamin Zeffer', 'Dania Abdulhamid', 'David Nguyen', 'Jessica Borin', 'Linda Sun', 'Mary Douglass Baum', 'Paige Mittenthal', 'Pranav Ajith', 'Rachel Sartori', 'Ricky Diaz Gomez', 'Sadie Staudacher', 'Taylor Wynn'] },
  { pledgeClass: 'Λ', names: ['Adam Konig', 'Aditya Chaudhry', 'Alby Thomas', 'Ben Maddux', 'Caleb Fisher', 'Evan Batsell', 'Fee Christoph', 'Jacob Kirsch', 'Jess Sickles', 'Jessica Toma', 'Neal Matta', 'Nicole Ackerman-Greenberg', 'Prachi Gokhale', 'Sabine Hutter', 'Sarah Corbe', 'Seungyeon Shin', 'Tyler Eastman', 'Vivian Wu', 'Will Chatterson', 'Zoé Hunter'] },
  { pledgeClass: 'Μ', names: ['Anne Lin', 'Arjun Ramanathan', 'Chris Knebel', 'Edward Knighton', 'Jack Zeligson', 'Kelsey Toporski', 'Kristen Basgall', 'Liz Fu', 'Michael Wilson', 'Michele Gee', 'Nathan Brown', 'Nick Dong', 'Sam Lu', 'Shaelyn Albrecht', 'Shameek Ray', 'Shashank Murching', 'Stefen Misovski', 'Sydnie Bodzianowski', 'Vinay Revankar'] },
  { pledgeClass: 'Ν', names: ['Alec Brandel', 'Andrew Bunt', 'Anjali Justice', 'Bhumika Jain', 'Damian Tenuta', 'Fernando Carretero', 'Jaroslaw Kawa', 'Juliet Levesque', 'Matthew Chen', 'Mike Trame', 'Rana Makki', 'Rosemary Wilson', 'Simrun Buttar', 'Svetha Subbiah', 'Wesley Toma'] },
  { pledgeClass: 'Ξ', names: ['Annika Zdon', 'Eli Masjedi', 'Flannery O\'Donnell', 'Izzy Williams', 'Kyle Johnson', 'Louis Gouirand', 'Maya Khanna', 'Natalie Cieslak', 'Sahil Patel', 'Tyler Jackson', 'Shreya Datta', 'Aditya Ravi'] },
  { pledgeClass: 'Ο', names: ['Aashia Mehta', 'Eldon Tsoi', 'Junho Park', 'Kelley Sweitzer', 'Michael Barsky', 'Michael Flanagan', 'Samast Varma', 'Taylor Denby', 'Sarah Addo', 'Jonah Azoulay', 'Anusha Bohra', 'Simran Chowdhry', 'Annika Dahlmann', 'Andy Dazzo', 'Emily Dershowitz', 'Jeremy Dou', 'Chris Lee', 'Cameron Oglesby', 'Sanya Verma'] },
  { pledgeClass: 'Π', names: ['Alice Ying', 'Rea Parocaran', 'Ben Arteaga', 'Sydney Bruce', 'Darian Chang', 'Rahul D\'Costa', 'Kyle Floersch', 'Caleb Harris', 'Shan Jiang', 'Katie Lawton', 'Sophie Loesberg', 'Roland Park', 'Vineet Parvathala', 'Brooke Powning', 'Harvey Reeves', 'Maya Subramanian', 'Jessica Zhang', 'Chinmay Savanur', 'Claire Waldron'] },
  { pledgeClass: 'Ρ', names: ['Eric Andrews', 'Rithik Aggarwal', 'Maya Chalker', 'Courtney Fortin', 'Olivia Garrahan', 'Robert Gibbons', 'Ashvin Kumar', 'Max Mittleman', 'William Yang', 'Rohan Barad', 'Prateek Bhola', 'Chase Goldman', 'Aashni Khatri', 'Michelle Liu', 'Advay Muchoor', 'Parth Pandit', 'Divya Ramamoorthy', 'Alyssa Russell', 'Medha Sripada'] },
  { pledgeClass: 'Σ', names: ['Logan Ross', 'Daniel Medina', 'Aayush Agarwal', 'Fizza Ahmed', 'Nacho Barreras', 'Ronald Chan', 'Aashil Dixit', 'Julie Frary', 'Melanie Howarth', 'Ananya Joshi', 'Andrew Li', 'Jason Moy', 'Evan Weissburg', 'Laura Zichi', 'Lucas Felpi', 'Isabelle Lian', 'Naoko Maeda', 'Ishan Thaker'] },
  { pledgeClass: 'Τ', names: ['Rohan Erasala', 'Anne George', 'Raffy Millado', 'Salil Nadkarni', 'Kelsey Peregord', 'Nishanth Reddy', 'Manasi Sridhar', 'Miffy Tani', 'Juan Miguel Thompson', 'Christian Wong', 'Grace Garmo', 'Neil Gupta', 'Briarre Johnson', 'Lydia Lam', 'Rithi Vaithyanathan'] },
  { pledgeClass: 'Υ', names: ['Golpari Abari', 'Carma Abu-Elnaj', 'Sreya Challa', 'Carina Gordon', 'Ansley Lewis', 'Aaryan Mukherjee', 'Aniket Nedunuri', 'Miles Scheffler', 'Lennox Thomas', 'Abbie Tooman', 'Katie Valus'] },
  { pledgeClass: 'Φ', names: ['Arez Aziz', 'Zoe Banks', 'Francesca Demolino', 'Benjamin Jin', 'Brogan Kaczkofsky', 'Aartie Kalra', 'Aryan Kamath', 'Andrea Lesmes', 'Jessica Levine', 'Davis Malmer'] },
  { pledgeClass: 'Χ', names: ['Iris Funaioli'] },
  { pledgeClass: 'Ψ', names: ['Kushaal Marri'] }
];

// Eboard and Directors
const hardcodedMembers = [
  { name: 'Helen Liang', imageUrl: '/images/members/Liang_Helen.jpg', category: 'E-Board', role: 'President', description: 'Oversees large scale changes in KTP and runs the Executive Board. Ensures that all KTP members have an enjoyable and impactful experience in the fraternity.' },
  { name: 'Dhruv Dighrasker', imageUrl: '/images/members/Dighrasker_Dhruv.jpg', category: 'E-Board', role: 'VP of External Affairs', description: 'Responsible for senior experience, feedback, and nationals. Keeps alumni up to date on the fraternity, and gives them opportunities to be a part of it.' },
  { name: 'Carolina Mondragon-Tadiotto', imageUrl: '/images/members/Mondragon-Tadiotto_Carolina.jpg', category: 'E-Board', role: 'VP of Internal Operations', description: 'Manages KTP membership data, reserves spaces for chapter and events, and runs all Diversity, Inclusion, and Equity efforts in KTP.' },
  { name: 'Himanish Kolli', imageUrl: '/images/members/Kolli_Himanish.jpg', category: 'E-Board', role: 'VP of Finance', description: 'Budgets and plans various events, facilitates corporate sponsorships and fundraising.' },
  { name: 'In Lorthongpanich', imageUrl: '/images/members/Lorthongpanich_In.jpg', category: 'E-Board', role: 'VP of Technical Development', description: 'Oversees committees, plans technical workshops and hackathon, and supports members in their academic and professional careers.' },
  { name: 'Ashley Glabicki', imageUrl: '/images/members/Glabicki_Ashley.jpg', category: 'E-Board', role: 'VP of Marketing', description: 'Establishes consistent branding, develops marketing strategies, and is responsible for promoting KTP on campus.' },
  { name: 'Sujay Mehta', imageUrl: '/images/members/Mehta_Sujay.jpg', category: 'E-Board', role: 'VP of Membership', description: 'Focuses on supporting new members socially and professionally to successfully integrate them as brothers within KTP.' },
  { name: 'Arinjoy Das', imageUrl: '/images/members/Das_Arinjoy.jpg', category: 'E-Board', role: 'VP of Engagement', description: 'Plans a variety of brotherhood events to engage active members.' },
  { name: 'Aarnav Unadkat', imageUrl: '/images/members/Unadkat_Aarnav.jpg', category: 'E-Board', role: 'VP of Professional Development', description: 'Responsible for facilitating educational workshops, providing resources, and giving guidance to help members achieve their professional career goals.' },
  { name: 'Maya Menon', imageUrl: '/images/members/Menon_Maya.jpg', category: 'Directors', role: 'Co-Directors of Community Service & Philanthropy', description: 'Plans community service events to support philanthropic efforts.' },
  { name: 'Emma Wyatt', imageUrl: '/images/members/Wyatt_Emma.jpg', category: 'Directors', role: 'Co-Directors of Community Service & Philanthropy', description: 'Plans community service events to support philanthropic efforts.' },
  { name: 'Josefia Frydenborg', imageUrl: '/images/members/Frydenborg_Josefia.jpg', category: 'Directors', role: 'Co-Directors of Women\'s Empowerment', description: 'Empowers women through various initiatives and events.' },
  { name: 'Agnes Mar', imageUrl: '/images/members/Mar_Agnes.jpg', category: 'Directors', role: 'Co-Directors of Women\'s Empowerment', description: 'Empowers women through various initiatives and events.' },
  { name: 'Hannah Black', imageUrl: '/images/members/Black_Hannah.jpg', category: 'Directors', role: 'Co-Directors of Social Engagement', description: 'Works with VP Engagement in planning and organizing social events and activities.' },
  { name: 'Nick Govea', imageUrl: '/images/members/Govea_Nick.jpg', category: 'Directors', role: 'Co-Directors of Social Engagement', description: 'Works with VP Engagement in planning and organizing social events and activities.' },
  { name: 'Elan Hong', imageUrl: '/images/members/Hong_Elan.jpg', category: 'Directors', role: 'Co-Directors of Social Engagement', description: 'Works with VP Engagement in planning and organizing social events and activities.' },
  { name: 'Naman Jain', imageUrl: '/images/members/Jain_Naman.jpg', category: 'Directors', role: 'Co-Directors of Social Engagement', description: 'Works with VP Engagement in planning and organizing social events and activities.' },
  { name: 'Diya Kini', imageUrl: '/images/members/Kini_Diya.jpg', category: 'Directors', role: 'Director of Career Development', description: 'Facilitates career development opportunities and professional growth.' },
  { name: 'Amy Liu', imageUrl: '/images/members/Liu_Amy.jpg', category: 'Directors', role: 'Director of Design & Digital Strategy', description: 'Oversees digital strategy and designs content for KTP\'s social media platforms.' },
  { name: 'Jonathan Abulu', imageUrl: '/images/members/Abulu_Jonathan.jpg', category: 'Directors', role: 'Co-Directors of App Development', description: 'Maintains and updates the Kappa Theta Pi Life App.' },
  { name: 'Sarah Klemmer', imageUrl: '/images/members/Klemmer_Sarah.jpg', category: 'Directors', role: 'Co-Directors of App Development', description: 'Maintains and updates the Kappa Theta Pi Life App.' },
  { name: 'Teagan Hollman', imageUrl: '/images/members/Hollman_Teagan.jpg', category: 'Directors', role: 'Co-Directors of Website Development', description: 'Maintains and updates the Kappa Theta Pi website.' },
  { name: 'Sabrina Xue', imageUrl: '/images/members/Xue_Sabrina.jpg', category: 'Directors', role: 'Co-Directors of Website Development', description: 'Maintains and updates the Kappa Theta Pi website.' },
];

const greekLetters = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ'];

// Pledge class mapping
const pledgeClassMapping = {
  Alpha: 'Α',
  Beta: 'Β',
  Gamma: 'Γ',
  Delta: 'Δ',
  Epsilon: 'Ε',
  Zeta: 'Ζ',
  Eta: 'Η',
  Theta: 'Θ',
  Iota: 'Ι',
  Kappa: 'Κ',
  Lambda: 'Λ',
  Mu: 'Μ',
  Nu: 'Ν',
  Xi: 'Ξ',
  Omicron: 'Ο',
  Pi: 'Π',
  Rho: 'Ρ',
  Sigma: 'Σ',
  Tau: 'Τ',
  Upsilon: 'Υ',
  Phi: 'Φ',
  Chi: 'Χ',
  Psi: 'Ψ',
  Omega: 'Ω',
  AB: 'ΑΒ',
  AG: 'ΑΓ',
  AD: 'ΑΔ'
};

export default function Members() {
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const [selectedCategory, setSelectedCategory] = useState('Actives');
  const [selectedGreekLetter, setSelectedGreekLetter] = useState<string | null>(null);
  const [activeMembers, setActiveMembers] = useState<any[]>([]);
  const [eBoardMembers, setEBoardMembers] = useState<any[]>([]);
  const [directors, setDirectors] = useState<any[]>([]);
  const [alumni, setAlumni] = useState<{pledgeClass: string; names: string[]}[]>([]);
  const categoryRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    const selectedIndex = categories.indexOf(selectedCategory);
    if (categoryRefs.current[selectedIndex]) {
      const { offsetLeft, offsetWidth } = categoryRefs.current[selectedIndex];
      const underline = document.querySelector('.underline') as HTMLElement;
      if (underline) {
        underline.style.left = `${offsetLeft}px`;
        underline.style.width = `${offsetWidth}px`;
      }
    }
  }, [selectedCategory]);

  // Load CSV data
  useEffect(() => {
    const loadMembersData = async () => {
      try {
        const response = await fetch('/memberList.csv');
        const csvText = await response.text();
        
        parseCsv(csvText, (data: any[]) => {
          console.log('Parsed Data:', data);
          const currentYear = new Date().getFullYear();

          const filteredData = data.filter((member: any) => member.First && member.Last);

          const parsedMembers = filteredData.map((member: any) => {
            // Use the Headshot column from CSV if available, otherwise generate path
            const imagePath = member.Headshot || `/images/members/${member.Last || 'unknown'}_${member.First || 'unknown'}.jpg`;

            const firstName = member.First || 'First Name';
            const lastName = member.Last || 'Last Name';
            const category = member.Category || 'Actives';
            const role = member['Pledge Class'] || 'Member';
            const description = member['Grad Year'] ? `Grad Year: ${member['Grad Year']}, Linkedin: ${member.Linkedin || 'N/A'}` : 'No Description';

            // change to 2025 once seniors graduate
            const isAlumni = member['Grad Year'] && member['Grad Year'] <= 2025;

            return {
              name: `${firstName} ${lastName}`,
              imageUrl: imagePath,
              category: category,
              role: role,
              description: description,
              pledgeClass: pledgeClassMapping[member['Pledge Class'] as keyof typeof pledgeClassMapping] || 'Unknown',
              gradYear: member['Grad Year'] || currentYear + 1,
              isAlumni,
              linkedin: member.Linkedin || '#'
            };
          });

          const actives = parsedMembers.filter((member: any) => !member.isAlumni && member.category === 'Actives');
          const eBoard = parsedMembers.filter((member: any) => !member.isAlumni && member.category === 'E-Board');
          const directors = parsedMembers.filter((member: any) => !member.isAlumni && member.category === 'Directors');
          const alumniFromCsv = parsedMembers.filter((member: any) => member.isAlumni && member.pledgeClass !== 'Unknown');

          const alumniMap: { [key: string]: string[] } = {};
          alumniFromCsv.forEach((member: any) => {
            if (!alumniMap[member.pledgeClass]) {
              alumniMap[member.pledgeClass] = [];
            }
            alumniMap[member.pledgeClass].push(member.name);
          });

          const combinedAlumni = [...hardcodedAlumni];
          Object.keys(alumniMap).forEach(pledgeClass => {
            const existingAlumni = combinedAlumni.find(alumni => alumni.pledgeClass === pledgeClass);
            if (existingAlumni) {
              // Only add names that don't already exist
              alumniMap[pledgeClass].forEach(name => {
                if (!existingAlumni.names.includes(name)) {
                  existingAlumni.names.push(name);
                }
              });
            } else {
              combinedAlumni.push({ pledgeClass, names: alumniMap[pledgeClass] });
            }
          });

          setActiveMembers(actives);
          setEBoardMembers(eBoard);
          setDirectors(directors);
          setAlumni(combinedAlumni);

          setTimeout(() => {
            document.querySelectorAll('.active-member').forEach(el => el.classList.add('visible'));
            document.querySelectorAll('.e-board-member').forEach(el => el.classList.add('visible'));
            document.querySelectorAll('.director-member').forEach(el => el.classList.add('visible'));
          }, 100);
        });
      } catch (error) {
        console.error('Error loading CSV data:', error);
      }
    };

    loadMembersData();
  }, []);



  useEffect(() => {
    if (selectedCategory === 'Actives') {
      setTimeout(() => {
        document.querySelectorAll('.active-member').forEach(el => el.classList.add('visible'));
      }, 100);
    } else if (selectedCategory === 'E-Board') {
      setTimeout(() => {
        document.querySelectorAll('.e-board-member').forEach(el => el.classList.add('visible'));
      }, 100);
    } else if (selectedCategory === 'Directors') {
      setTimeout(() => {
        document.querySelectorAll('.director-member').forEach(el => el.classList.add('visible'));
      }, 100);
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedGreekLetter(null);
  };

  const handleGreekLetterClick = (letter: string | null) => {
    setSelectedGreekLetter(letter);
    setTimeout(() => {
      const targetId = letter ? `pledgeClass-${letter}` : 'pledgeClass-Founders';
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100); // Adjust the delay as needed
  };

  const filteredAlumni = selectedGreekLetter ? alumni.filter(group => group.pledgeClass === selectedGreekLetter) : alumni;

  return (
    <div>
      <Header />
      <ScrollToTop />

      <div className="px-6 sm:px-8 md:px-16 lg:px-20">
        
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-0" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
                We Are A Team of <br className="lg:hidden"/>
                <span className="inline">
                  <ReactTyped
                    strings={['Developers', 'Leaders', 'Designers', 'Engineers', 'Innovators', 'Problem Solvers']}
                    typeSpeed={60}
                    backSpeed={50}
                    backDelay={1500}
                    loop
                  />
                </span>
              </h1>

              <p className="text-base sm:text-xl mt-8 mb-8 font-medium text-gray-600 h-16" style={{ color: 'grey' }}>
                What makes our community strong is our shared passion for technology<br />
                and our unique backgrounds meshing together as one.
              </p>
            </div>
          </div>

          {/* Category filter buttons */}
          <div className="relative mb-8 px-6 sm:px-8 md:px-16 lg:px-24 xl:px-32">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
              {categories.map((category, index) => (
                <button
                  key={category}
                  className={`px-3 sm:px-4 py-2 rounded-[40px] text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer whitespace-nowrap text-center ${selectedCategory === category ? 'bg-[#315CA9] text-white' : 'bg-gray-200/60 text-gray-700 hover:bg-gray-300/80'}`}
                  onClick={() => handleCategoryClick(category)}
                  ref={(el) => {
                    categoryRefs.current[index] = el;
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Greek letter navigation */}
          {selectedCategory === 'Alumni' && (
            <div className="relative mb-8 px-6 sm:px-8 md:px-16 lg:px-24 xl:px-32">
              <div className="flex overflow-x-auto scrollbar-hide gap-2 sm:gap-3 md:gap-4 py-2">
                <div className="flex gap-2 sm:gap-3 md:gap-4 min-w-max mx-auto">
                  <button
                    className={`px-3 sm:px-4 py-2 rounded-[40px] text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer whitespace-nowrap text-center flex-shrink-0 ${selectedGreekLetter === null ? 'bg-[#315CA9] text-white' : 'bg-gray-200/60 text-gray-700 hover:bg-gray-300/80'}`}
                    onClick={() => handleGreekLetterClick(null)}
                  >
                    All
                  </button>
                  {greekLetters.map((letter) => (
                    <button
                      key={letter}
                      className={`px-3 sm:px-4 py-2 rounded-[40px] text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer whitespace-nowrap text-center flex-shrink-0 ${selectedGreekLetter === letter ? 'bg-[#315CA9] text-white' : 'bg-gray-200/60 text-gray-700 hover:bg-gray-300/80'}`}
                      onClick={() => handleGreekLetterClick(letter)}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Members grid */}
          {selectedCategory === 'E-Board' ? (
            <div className="grid grid-cols-1 mb-12 gap-6 lg:gap-8 xl:grid-cols-2">
              {hardcodedMembers
                .filter((member) => member.category === 'E-Board')
                .map((member) => (
                  <div key={`${member.name}-${member.category}`} className="group rounded-xl shadow-md transition-all duration-300 ease transform hover:-translate-y-2 hover:shadow-lg border border-gray-100 overflow-hidden w-full min-w-0" style={{ backgroundColor: 'rgba(249, 250, 251, 0.95)' }}>
                    <div className="flex flex-col md:flex-row items-center md:items-start p-6 h-full">
                      <div className="relative mb-4 md:mb-0 md:mr-6 flex justify-center flex-shrink-0 self-center">
                        <div className="w-32 h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all duration-700 ease-in-out shadow-lg">
                          <img 
                            src={member.imageUrl} 
                            alt={member.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/default.jpg';
                            }}
                          />
                        </div>
                      </div>
                      <div className="text-center md:text-left flex-1 md:self-start break-normal">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#315CA9] transition-colors duration-700 ease-in-out">{member.name}</h3>
                        <div className="inline-block bg-[#315CA9] text-white px-3 py-1.5 rounded-full text-sm font-semibold mb-3 shadow-md">
                          {member.role}
                        </div>
                        <p className="text-gray-600 text-sm lg:text-base leading-relaxed">{member.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : selectedCategory === 'Directors' ? (
            <div className="grid grid-cols-1 mb-12 gap-6 lg:gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {(() => {
                // Group directors by role
                const directorsByRole = hardcodedMembers
                  .filter((member) => member.category === 'Directors')
                  .reduce((acc, member) => {
                    if (!acc[member.role]) {
                      acc[member.role] = [];
                    }
                    acc[member.role].push(member);
                    return acc;
                  }, {} as { [key: string]: typeof hardcodedMembers });

                return Object.entries(directorsByRole)
                  .sort(([roleA], [roleB]) => {
                    // Move Social Engagement to the end
                    if (roleA.includes('Social Engagement')) return 1;
                    if (roleB.includes('Social Engagement')) return -1;
                    return 0;
                  })
                  .map(([role, members]) => (
                  <div key={role} className={`group rounded-xl shadow-md transition-all duration-300 ease transform hover:-translate-y-2 hover:shadow-lg border border-gray-100 overflow-hidden w-full min-w-0 ${role.includes('Social Engagement') ? 'lg:col-span-2 xl:col-span-3 xl:max-w-4xl xl:mx-auto' : ''}`} style={{ backgroundColor: 'rgba(249, 250, 251, 0.95)' }}>
                    <div className="p-6">
                      <div className="text-center mb-6">
                        <div className="inline-block bg-[#315CA9] text-white px-3 py-1.5 rounded-full text-sm font-semibold mb-3 shadow-md">
                          {role}
                        </div>
                        <div className="lg:min-h-[4rem] flex items-start justify-center">
                          <p className="text-gray-600 text-sm lg:text-base leading-relaxed">{members[0].description}</p>
                        </div>
                      </div>
                      <div className={`grid gap-2 justify-items-center ${role.includes('Social Engagement') ? 'grid-cols-2 lg:grid-cols-4 max-w-md lg:max-w-4xl mx-auto' : members.length === 1 ? 'grid-cols-1 place-items-center' : 'grid-cols-2 max-w-md mx-auto'}`}>
                        {members.map((member) => (
                          <div key={member.name} className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 w-full max-w-48">
                            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all duration-700 ease-in-out shadow-lg flex-shrink-0">
                              <img 
                                src={member.imageUrl} 
                                alt={member.name} 
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/images/default.jpg';
                                }}
                              />
                            </div>
                            <div className="text-center">
                              <h4 className="text-base font-semibold text-gray-900 group-hover:text-[#315CA9] transition-colors duration-300">
                                {member.name}
                              </h4>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          ) : selectedCategory === 'Alumni' ? (
            <div className="mb-12">
                              {filteredAlumni.map((group, index) => {
                  const names = group.names.sort((a, b) => {
                    // Split names and get last names
                    const lastNameA = a.split(' ').pop() || '';
                    const lastNameB = b.split(' ').pop() || '';
                    return lastNameA.localeCompare(lastNameB);
                  });
                  const totalNames = names.length;
                  
                  // For mobile: single column, for desktop: 3 columns
                  const column1: string[] = [];
                  const column2: string[] = [];
                  const column3: string[] = [];
                  
                  names.forEach((name, i) => {
                    if (i % 3 === 0) {
                      column1.push(name);
                    } else if (i % 3 === 1) {
                      column2.push(name);
                    } else {
                      column3.push(name);
                    }
                  });
                
                                 return (
                   <div key={index} id={`pledgeClass-${group.pledgeClass}`} className="mb-8">
                     <div className="flex flex-col sm:flex-row items-start">
                       <div className="w-32 font-bold text-lg sm:text-xl mb-4 sm:mb-0 sm:mr-24">{group.pledgeClass}</div>
                       <div className="flex-1 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 sm:pl-8">
                         {/* Desktop: show in columns */}
                         <div className="hidden sm:block">
                           {column1.map((name, nameIndex) => (
                             <div key={nameIndex} className="text-base md:text-lg mb-1">{name}</div>
                           ))}
                         </div>
                         <div className="hidden sm:block">
                           {column2.map((name, nameIndex) => (
                             <div key={nameIndex} className="text-base md:text-lg mb-1">{name}</div>
                           ))}
                         </div>
                         <div className="hidden lg:block">
                           {column3.map((name, nameIndex) => (
                             <div key={nameIndex} className="text-base md:text-lg mb-1">{name}</div>
                           ))}
                         </div>
                         {/* Mobile: show all names in single column in correct order */}
                         <div className="sm:hidden">
                           {names.map((name, nameIndex) => (
                             <div key={nameIndex} className="text-base md:text-lg mb-1">{name}</div>
                           ))}
                         </div>
                       </div>
                     </div>
                   </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mb-12 gap-6 lg:gap-8">
              {activeMembers.map((member, index) => (
                <div key={index} className="text-center active-member">
                  <div className="relative w-full aspect-square mx-auto">
                    <img 
                      src={member.imageUrl} 
                      alt={member.name} 
                      className="w-full h-full object-cover rounded-lg blue-shadow" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/default.jpg';
                      }}
                    />
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-logo-container">
                      <img 
                        src="/images/linkedin.jpg" 
                        alt="LinkedIn" 
                        className="w-5 h-5 sm:w-6 sm:h-6" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </a>
                    <div className="pledge-class bottom-1 right-1 text-xs">{member.pledgeClass}</div>
                  </div>
                  <p className="mt-2 text-center text-xs sm:text-sm font-semibold">{member.name}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}
