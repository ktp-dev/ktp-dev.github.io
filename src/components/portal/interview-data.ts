export type InterviewRow = {
  id: string
  company: string
  role: string
  round: string
  outcome: string
  asked: string
  brother: string
  daysAgo: number
}

export function submittedLabel(daysAgo: number) {
  if (daysAgo <= 0) return 'Submitted today'
  if (daysAgo === 1) return 'Submitted yesterday'
  return `Submitted ${daysAgo} days ago`
}

export const DUMMY_INTERVIEWS: InterviewRow[] = [
  {
    id: '1',
    company: 'Stripe',
    role: 'Software Engineer intern',
    round: 'Phone screen',
    outcome: 'Moved to onsite',
    asked: 'Two-sum variant, then a design question about idempotent payments.',
    brother: 'Teagan Hollman',
    daysAgo: 2,
  },
  {
    id: '2',
    company: 'Capital One',
    role: 'Technology Development Program',
    round: 'HireVue + Super Day',
    outcome: 'Offer',
    asked: 'Behavioral STAR stories, then a SQL case and a simple graph walk.',
    brother: 'Ayan Nair',
    daysAgo: 4,
  },
  {
    id: '3',
    company: 'Google',
    role: 'STEP intern',
    round: 'Two technicals',
    outcome: 'Rejected',
    asked: 'String manipulation, then BFS on a grid. Interviewer cared about talking through tests.',
    brother: 'Connie Liu',
    daysAgo: 5,
  },
  {
    id: '4',
    company: 'Meta',
    role: 'Software Engineer intern',
    round: 'Coding + behavioral',
    outcome: 'Moved to onsite',
    asked: 'LRU cache, then a product sense question about News Feed ranking.',
    brother: 'Isha Gupta',
    daysAgo: 8,
  },
  {
    id: '5',
    company: 'Jane Street',
    role: 'Trading intern',
    round: 'Probability + market making',
    outcome: 'Rejected',
    asked: 'Expected value of dice games, then a toy market-making simulation.',
    brother: 'Pascal Sturmfels',
    daysAgo: 12,
  },
  {
    id: '6',
    company: 'Amazon',
    role: 'SDE intern',
    round: 'OA + final round',
    outcome: 'Offer',
    asked: 'Leadership principles stories, then a graph copy of a nested object.',
    brother: 'Connor Waldo',
    daysAgo: 18,
  },
  {
    id: '7',
    company: 'Figma',
    role: 'Software Engineer intern',
    round: 'Systems + coding',
    outcome: 'Moved to onsite',
    asked: 'Collaborative cursor presence, then interval merging.',
    brother: 'Juliana Mi',
    daysAgo: 24,
  },
  {
    id: '8',
    company: 'Bloomberg',
    role: 'Software Engineer intern',
    round: 'Phone + onsite',
    outcome: 'Offer',
    asked: 'Design a stock ticker, then a sliding-window string problem.',
    brother: 'Sonia Doshi',
    daysAgo: 40,
  },
]
