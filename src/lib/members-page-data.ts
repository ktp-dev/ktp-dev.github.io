import 'server-only'

import fs from 'fs'
import path from 'path'
import Papa from 'papaparse'
import type { AlumniGroup, LeadershipMember, Member } from '@/lib/members-data'

const pledgeClassMapping: Record<string, string> = {
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
  AD: 'ΑΔ',
  AE: 'ΑE',
  AZ: 'AZ',
}

const hardcodedAlumni: AlumniGroup[] = [
  {
    pledgeClass: 'Founders',
    names: [
      'Brian Mansfield',
      'Denny Tsai',
      'Jacqueline Fontaine',
      'Jing Guo',
      'Julie Varghese',
      'Louise Vongphrachanh',
      'Nisha Dwivedi',
    ],
  },
  {
    pledgeClass: 'Α',
    names: ['Andy Kolean', 'Chris Hong', 'Dan Miller', 'Hanwenbo Yang', 'Patrick Riggs', 'Phil Park'],
  },
  {
    pledgeClass: 'Β',
    names: ['Jay Raina', 'Jeremy Wdowik', 'Juliana Mi', 'Justin Anderson', 'Kate Findlay', 'Nick Felicidario'],
  },
  {
    pledgeClass: 'Γ',
    names: [
      'Aya Mimura',
      'Ben Krawitz',
      'Connor Waldo',
      'Dan Sofferman',
      'Dom Parise',
      'Evan Stoddard',
      'Greg Nelson',
      'Jackie Franklin',
      'Linglu Zhou',
      'Louie Cordon',
      'Megan Yee',
      'Sam Bolin',
      'Sarah Beadle',
      'Shelby Lewin',
    ],
  },
  {
    pledgeClass: 'Δ',
    names: [
      'Aadi Krishna',
      'Abbey Lepisto',
      'Angela Damato',
      'Christine Yu',
      'Colleen Miller',
      'Dinker Ambe',
      'Ellen Anderson',
      'Greg Azevedo',
      'Jaclyn Jaffe',
      'Kelly Yuen',
      'Kevin Cai',
      'Lizzy Pratt',
      'Melanie Kipke',
      'Nicole Zeffer',
      'Ryan Povall',
      'Sonia Doshi',
    ],
  },
  {
    pledgeClass: 'Ε',
    names: [
      'Andrew Riggs',
      'Chris Elie',
      'Dean Chenensky',
      'Drew Dyer',
      'Elisa Shibley',
      'Isha Gupta',
      'Jake Wellins',
      'Kyle Moynihan',
      'Lisa Lyons',
      'Owen Yang',
      'Patrick Wilson',
      'Rebecca Lawson',
      'Sam Dallstream',
      'Yoav Helfman',
    ],
  },
  {
    pledgeClass: 'Ζ',
    names: [
      'Alex House',
      'Anavir Shermon',
      'Ben Rathi',
      'Blake Schewe',
      'Bryce Beckwith',
      'Christie Parkinson',
      'Chuckry Vengadam',
      'Connie Liu',
      'Cooper Anstett',
      'Courtney Quell',
      'Dan Wilson',
      'Kaitlin Singer',
      'Maxim Aleksa',
      'Michael Vander Lugt',
      'Nimesha Muthya',
      'Olivia Alge',
      'Rishin Doshi',
    ],
  },
  {
    pledgeClass: 'Η',
    names: [
      'Amos Cone',
      'Brady Mathieson',
      'Dara Metz',
      'Han Na Shin',
      'Ismael Halaweh',
      'Julia Karpf',
      'Kenny Heindel',
      'Lauren Krawitz',
      'Logan Meyer',
      'Mark Strader',
      'Merri Zervas',
      'Neal Parikh',
      'Pascal Sturmfels',
      'Rosa Wu',
      'Terrence Green',
    ],
  },
  {
    pledgeClass: 'Θ',
    names: [
      'Arya Taylor',
      'Colleen Feola',
      'Gage Glupker',
      'Grace Kim',
      'Hyunjae Kim',
      'Imani Williams',
      'Jill Davidson',
      'Josie Elordi',
      'Lukas Trierweiler',
      'Mackenzie Chyatte',
      'Nikil Ramanathan',
      'Ramana Keerthi',
    ],
  },
  {
    pledgeClass: 'Ι',
    names: [
      'Ash Varma',
      'Ava Randa',
      'Billy Kryska',
      'Brendan Paul',
      'Daniel Chandross',
      'Danielle Colbert',
      'Esther Yan',
      'Ethan Cartwright',
      'Hannah Jenkins',
      'Joana Rushiti',
      'Joe Kunnath',
      'Juli Polise',
      'Kevin Huang',
      'Kiera Krashesky',
      'Rebecca Henry',
    ],
  },
  {
    pledgeClass: 'Κ',
    names: [
      'Aliya Khan',
      'Angel Tsai',
      'Ankita Avadhani',
      'Benjamin Zeffer',
      'Dania Abdulhamid',
      'David Nguyen',
      'Jessica Borin',
      'Linda Sun',
      'Mary Douglass Baum',
      'Paige Mittenthal',
      'Pranav Ajith',
      'Rachel Sartori',
      'Ricky Diaz Gomez',
      'Sadie Staudacher',
      'Taylor Wynn',
    ],
  },
  {
    pledgeClass: 'Λ',
    names: [
      'Adam Konig',
      'Aditya Chaudhry',
      'Alby Thomas',
      'Ben Maddux',
      'Caleb Fisher',
      'Evan Batsell',
      'Fee Christoph',
      'Jacob Kirsch',
      'Jess Sickles',
      'Jessica Toma',
      'Neal Matta',
      'Nicole Ackerman-Greenberg',
      'Prachi Gokhale',
      'Sabine Hutter',
      'Sarah Corbe',
      'Seungyeon Shin',
      'Tyler Eastman',
      'Vivian Wu',
      'Will Chatterson',
      'Zoé Hunter',
    ],
  },
  {
    pledgeClass: 'Μ',
    names: [
      'Anne Lin',
      'Arjun Ramanathan',
      'Chris Knebel',
      'Edward Knighton',
      'Jack Zeligson',
      'Kelsey Toporski',
      'Kristen Basgall',
      'Liz Fu',
      'Michael Wilson',
      'Michele Gee',
      'Nathan Brown',
      'Nick Dong',
      'Sam Lu',
      'Shaelyn Albrecht',
      'Shameek Ray',
      'Shashank Murching',
      'Stefen Misovski',
      'Sydnie Bodzianowski',
      'Vinay Revankar',
    ],
  },
  {
    pledgeClass: 'Ν',
    names: [
      'Alec Brandel',
      'Andrew Bunt',
      'Anjali Justice',
      'Bhumika Jain',
      'Damian Tenuta',
      'Fernando Carretero',
      'Jaroslaw Kawa',
      'Juliet Levesque',
      'Matthew Chen',
      'Mike Trame',
      'Rana Makki',
      'Rosemary Wilson',
      'Simrun Buttar',
      'Svetha Subbiah',
      'Wesley Toma',
    ],
  },
  {
    pledgeClass: 'Ξ',
    names: [
      'Annika Zdon',
      'Eli Masjedi',
      "Flannery O'Donnell",
      'Izzy Williams',
      'Kyle Johnson',
      'Louis Gouirand',
      'Maya Khanna',
      'Natalie Cieslak',
      'Sahil Patel',
      'Tyler Jackson',
      'Shreya Datta',
      'Aditya Ravi',
    ],
  },
  {
    pledgeClass: 'Ο',
    names: [
      'Aashia Mehta',
      'Eldon Tsoi',
      'Junho Park',
      'Kelley Sweitzer',
      'Michael Barsky',
      'Michael Flanagan',
      'Samast Varma',
      'Taylor Denby',
      'Sarah Addo',
      'Jonah Azoulay',
      'Anusha Bohra',
      'Simran Chowdhry',
      'Annika Dahlmann',
      'Andy Dazzo',
      'Emily Dershowitz',
      'Jeremy Dou',
      'Chris Lee',
      'Cameron Oglesby',
      'Sanya Verma',
    ],
  },
  {
    pledgeClass: 'Π',
    names: [
      'Alice Ying',
      'Rea Parocaran',
      'Ben Arteaga',
      'Sydney Bruce',
      'Darian Chang',
      "Rahul D'Costa",
      'Kyle Floersch',
      'Caleb Harris',
      'Shan Jiang',
      'Katie Lawton',
      'Sophie Loesberg',
      'Roland Park',
      'Vineet Parvathala',
      'Brooke Powning',
      'Harvey Reeves',
      'Maya Subramanian',
      'Jessica Zhang',
      'Chinmay Savanur',
      'Claire Waldron',
    ],
  },
  {
    pledgeClass: 'Ρ',
    names: [
      'Eric Andrews',
      'Rithik Aggarwal',
      'Maya Chalker',
      'Courtney Fortin',
      'Olivia Garrahan',
      'Robert Gibbons',
      'Ashvin Kumar',
      'Max Mittleman',
      'William Yang',
      'Rohan Barad',
      'Prateek Bhola',
      'Chase Goldman',
      'Aashni Khatri',
      'Michelle Liu',
      'Advay Muchoor',
      'Parth Pandit',
      'Divya Ramamoorthy',
      'Alyssa Russell',
      'Medha Sripada',
    ],
  },
  {
    pledgeClass: 'Σ',
    names: [
      'Logan Ross',
      'Daniel Medina',
      'Aayush Agarwal',
      'Fizza Ahmed',
      'Nacho Barreras',
      'Ronald Chan',
      'Aashil Dixit',
      'Julie Frary',
      'Melanie Howarth',
      'Ananya Joshi',
      'Andrew Li',
      'Jason Moy',
      'Evan Weissburg',
      'Laura Zichi',
      'Lucas Felpi',
      'Isabelle Lian',
      'Naoko Maeda',
      'Ishan Thaker',
    ],
  },
  {
    pledgeClass: 'Τ',
    names: [
      'Rohan Erasala',
      'Anne George',
      'Raffy Millado',
      'Salil Nadkarni',
      'Kelsey Peregord',
      'Nishanth Reddy',
      'Manasi Sridhar',
      'Miffy Tani',
      'Juan Miguel Thompson',
      'Christian Wong',
      'Grace Garmo',
      'Neil Gupta',
      'Briarre Johnson',
      'Lydia Lam',
      'Rithi Vaithyanathan',
    ],
  },
  {
    pledgeClass: 'Υ',
    names: [
      'Golpari Abari',
      'Carma Abu-Elnaj',
      'Sreya Challa',
      'Carina Gordon',
      'Ansley Lewis',
      'Aaryan Mukherjee',
      'Aniket Nedunuri',
      'Miles Scheffler',
      'Lennox Thomas',
      'Abbie Tooman',
      'Katie Valus',
    ],
  },
  {
    pledgeClass: 'Φ',
    names: [
      'Arez Aziz',
      'Zoe Banks',
      'Francesca Demolino',
      'Benjamin Jin',
      'Brogan Kaczkofsky',
      'Aartie Kalra',
      'Aryan Kamath',
      'Andrea Lesmes',
      'Jessica Levine',
      'Davis Malmer',
    ],
  },
  { pledgeClass: 'Χ', names: ['Iris Funaioli'] },
  { pledgeClass: 'Ψ', names: ['Kushaal Marri'] },
]

/** E-Board + Directors shown on the Members page (not driven by CSV Category). */
export const LEADERSHIP_MEMBERS: LeadershipMember[] = [
  {
    name: 'Teagan Hollman',
    imageUrl: '/images/members/Hollman_Teagan.jpg',
    category: 'E-Board',
    role: 'President',
    description:
      'Oversees large scale changes in KTP and runs the Executive Board. Ensures that all KTP members have an enjoyable and impactful experience in the fraternity.',
  },
  {
    name: 'Amaan Choudhury',
    imageUrl: '/images/members/Choudhury_Amaan.jpg',
    category: 'E-Board',
    role: 'VP of External Affairs',
    description:
      'Responsible for senior experience, feedback, and nationals. Keeps alumni up to date on the fraternity, and gives them opportunities to be a part of it.',
  },
  {
    name: 'Atharva Gawde',
    imageUrl: '/images/members/Gawde_Atharva.jpg',
    category: 'E-Board',
    role: 'VP of Internal Operations',
    description:
      'Manages KTP membership data, reserves spaces for chapter and events, and runs all Diversity, Inclusion, and Equity efforts in KTP.',
  },
  {
    name: 'Nicholas Govea',
    imageUrl: '/images/members/Govea_Nick.jpg',
    category: 'E-Board',
    role: 'VP of Finance',
    description: 'Budgets and plans various events, facilitates corporate sponsorships and fundraising.',
  },
  {
    name: 'Ayan Nair',
    imageUrl: '/images/members/Nair_Ayan.jpg',
    category: 'E-Board',
    role: 'VP of Technical Development',
    description:
      'Oversees committees, plans technical workshops and hackathon, and supports members in their academic and professional careers.',
  },
  {
    name: 'Shant Manoukian',
    imageUrl: '/images/members/Manoukian_Shant.jpg',
    category: 'E-Board',
    role: 'VP of Marketing',
    description:
      "Establishes consistent branding, develops marketing strategies, and is responsible for promoting KTP on campus.",
  },
  {
    name: 'Hannah Black',
    imageUrl: '/images/members/Black_Hannah.jpg',
    category: 'E-Board',
    role: 'VP of Membership',
    description:
      'Focuses on supporting new members socially and professionally to successfully integrate them as brothers within KTP.',
  },
  {
    name: 'Lalin Ozcan',
    imageUrl: '/images/members/Ozcan_Lalin.jpg',
    category: 'E-Board',
    role: 'VP of Engagement',
    description: 'Plans a variety of brotherhood events to engage active members.',
  },
  {
    name: 'Sydney Abam',
    imageUrl: '/images/members/Abam_Sydney.jpg',
    category: 'E-Board',
    role: 'VP of Professional Development',
    description:
      'Responsible for facilitating educational workshops, providing resources, and giving guidance to help members achieve their professional career goals.',
  },
  {
    name: 'Nick Lopez',
    imageUrl: '/images/members/Lopez_Nick.jpg',
    category: 'Directors',
    role: 'Co-Directors of Community Service & Philanthropy',
    description: 'Plans community service events to support philanthropic efforts.',
  },
  {
    name: 'Jessica Ni',
    imageUrl: '/images/members/Ni_Jessica.jpg',
    category: 'Directors',
    role: 'Co-Directors of Community Service & Philanthropy',
    description: 'Plans community service events to support philanthropic efforts.',
  },
  {
    name: 'Pramiti Dubey',
    imageUrl: '/images/members/Dubey_Pramiti.jpg',
    category: 'Directors',
    role: "Director of Women's Empowerment",
    description: 'Empowers women through various initiatives and events.',
  },
  {
    name: 'Aarya Upadhyay',
    imageUrl: '/images/members/Upadhyay_Aarya.jpg',
    category: 'Directors',
    role: 'Co-Directors of Social Engagement',
    description: 'Works with VP Engagement in planning and organizing social events and activities.',
  },
  {
    name: 'Evan Meranchik',
    imageUrl: '/images/members/Meranchik_Evan.jpg',
    category: 'Directors',
    role: 'Co-Directors of Social Engagement',
    description: 'Works with VP Engagement in planning and organizing social events and activities.',
  },
  {
    name: 'Mariam Mandwee',
    imageUrl: '/images/members/Mandwee_Mariam.jpg',
    category: 'Directors',
    role: 'Director of Career Development',
    description: 'Facilitates career development opportunities and professional growth.',
  },
  {
    name: 'Jilliann Divozzo',
    imageUrl: '/images/members/Divozzo_Jilliann.jpg',
    category: 'Directors',
    role: 'Director of Design & Digital Strategy',
    description: "Oversees digital strategy and designs content for KTP's social media platforms.",
  },
  {
    name: 'Lalin Ozcan',
    imageUrl: '/images/members/Ozcan_Lalin.jpg',
    category: 'Directors',
    role: 'Co-Directors of App Development',
    description: 'Maintains and updates the Kappa Theta Pi Life App.',
  },
  {
    name: 'Arav Kulkarni',
    imageUrl: '/images/members/Kulkarni_Arav.jpg',
    category: 'Directors',
    role: 'Co-Directors of App Development',
    description: 'Maintains and updates the Kappa Theta Pi Life App.',
  },
  {
    name: 'In Lorthongpanich',
    imageUrl: '/images/members/Lorthongpanich_In.jpg',
    category: 'Directors',
    role: 'Co-Directors of Website Development',
    description: 'Maintains and updates the Kappa Theta Pi website.',
  },
  {
    name: 'Teyj Krishnan',
    imageUrl: '/images/members/Krishnan_Teyj.jpg',
    category: 'Directors',
    role: 'Co-Directors of Website Development',
    description: 'Maintains and updates the Kappa Theta Pi website.',
  },
]

export type MembersPageData = {
  activeMembers: Member[]
  alumni: AlumniGroup[]
  leadership: LeadershipMember[]
}

export function getMembersPageData(): MembersPageData {
  const csvPath = path.join(process.cwd(), 'public/memberList.csv')
  const csvText = fs.readFileSync(csvPath, 'utf8')
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  })

  const currentYear = new Date().getFullYear()
  const filteredData = parsed.data.filter((member) => member.First && member.Last)

  const parsedMembers: Member[] = filteredData.map((member) => {
    const imagePath =
      member.Headshot ||
      `/images/members/${member.Last || 'unknown'}_${member.First || 'unknown'}.jpg`
    const firstName = member.First || 'First Name'
    const lastName = member.Last || 'Last Name'
    const category = member.Category || 'Actives'
    const role = member['Pledge Class'] || 'Member'
    const description = member['Grad Year']
      ? `Grad Year: ${member['Grad Year']}, Linkedin: ${member.Linkedin || 'N/A'}`
      : 'No Description'
    const isAlumni = Boolean(member['Grad Year'] && parseInt(member['Grad Year'], 10) <= 2026)

    return {
      name: `${firstName} ${lastName}`,
      imageUrl: imagePath,
      category,
      role,
      description,
      pledgeClass: pledgeClassMapping[member['Pledge Class'] || ''] || 'Unknown',
      gradYear: parseInt(member['Grad Year'] || '', 10) || currentYear + 1,
      isAlumni,
      linkedin: member.Linkedin || '#',
    }
  })

  const activeMembers = parsedMembers.filter(
    (member) => !member.isAlumni && member.category === 'Actives'
  )
  const alumniFromCsv = parsedMembers.filter(
    (member) => member.isAlumni && member.pledgeClass !== 'Unknown'
  )

  const alumniMap: Record<string, string[]> = {}
  alumniFromCsv.forEach((member) => {
    if (!alumniMap[member.pledgeClass]) {
      alumniMap[member.pledgeClass] = []
    }
    alumniMap[member.pledgeClass].push(member.name)
  })

  const combinedAlumni: AlumniGroup[] = hardcodedAlumni.map((group) => ({
    pledgeClass: group.pledgeClass,
    names: [...group.names],
  }))

  Object.keys(alumniMap).forEach((pledgeClass) => {
    const existingAlumni = combinedAlumni.find((alumni) => alumni.pledgeClass === pledgeClass)
    if (existingAlumni) {
      alumniMap[pledgeClass].forEach((name) => {
        if (!existingAlumni.names.includes(name)) {
          existingAlumni.names.push(name)
        }
      })
    } else {
      combinedAlumni.push({ pledgeClass, names: alumniMap[pledgeClass] })
    }
  })

  return {
    activeMembers,
    alumni: combinedAlumni,
    leadership: LEADERSHIP_MEMBERS,
  }
}
