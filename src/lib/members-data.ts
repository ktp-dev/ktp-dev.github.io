export type Member = {
  name: string
  imageUrl: string
  category: string
  role: string
  description: string
  pledgeClass: string
  gradYear: number
  isAlumni: boolean
  linkedin: string
}

export type AlumniGroup = {
  pledgeClass: string
  names: string[]
}

export type LeadershipMember = {
  name: string
  imageUrl: string
  category: 'E-Board' | 'Directors'
  role: string
  description: string
}

export const MEMBER_CATEGORIES = ['Actives', 'E-Board', 'Directors', 'Alumni'] as const

export const GREEK_LETTERS = [
  'Α',
  'Β',
  'Γ',
  'Δ',
  'Ε',
  'Ζ',
  'Η',
  'Θ',
  'Ι',
  'Κ',
  'Λ',
  'Μ',
  'Ν',
  'Ξ',
  'Ο',
  'Π',
  'Ρ',
  'Σ',
  'Τ',
  'Υ',
  'Φ',
  'Χ',
  'Ψ',
  'Ω',
  'ΑΒ',
] as const
