export const APPLY_STEPS = [
  { slug: 'personal', path: '/apply/personal', label: 'Personal' },
  { slug: 'academic', path: '/apply/academic', label: 'Academic' },
  { slug: 'involvement', path: '/apply/involvement', label: 'Involvement' },
  { slug: 'questions', path: '/apply/questions', label: 'Questions' },
  { slug: 'additional', path: '/apply/additional', label: 'Additional' },
  { slug: 'review', path: '/apply/review', label: 'Review' },
] as const

export type ApplyStepSlug = (typeof APPLY_STEPS)[number]['slug']

export const FILE_SLOTS = [
  'photo',
  'transcript',
  'resume',
  'resume_anonymized',
  'life_app_screenshot',
] as const

export type FileSlot = (typeof FILE_SLOTS)[number]

export const SLOTS_BY_STEP: Partial<Record<ApplyStepSlug, FileSlot[]>> = {
  personal: ['photo'],
  academic: ['transcript', 'resume', 'resume_anonymized'],
  additional: ['life_app_screenshot'],
}

export function nextStepPath(slug: ApplyStepSlug) {
  const index = APPLY_STEPS.findIndex((step) => step.slug === slug)
  return APPLY_STEPS[index + 1]?.path ?? '/apply/review'
}

export function prevStepPath(slug: ApplyStepSlug) {
  const index = APPLY_STEPS.findIndex((step) => step.slug === slug)
  return APPLY_STEPS[index - 1]?.path ?? '/apply'
}

export function cycleDisplayName(cycleName: string) {
  return cycleName.replace(/\s*\(local\)\s*/gi, '').trim()
}

export function applicationTitle(cycleName: string) {
  const season = cycleDisplayName(cycleName)
  if (/kappa theta pi/i.test(season) && /rush application/i.test(season)) {
    return season
  }
  return `Kappa Theta Pi ${season} Rush Application`
}

export function applicationClosedMessage(cycleName: string, custom?: string | null) {
  if (custom?.trim()) return custom.trim()
  return `The Kappa Theta Pi ${cycleDisplayName(cycleName)} Rush Application has now been closed.`
}

export { formatApplyDeadline } from '@/lib/rush-timezone'
