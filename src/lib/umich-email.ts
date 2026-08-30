import { z } from 'zod'

/** Accept `uniqname` or `uniqname@umich.edu`; always return full lowercased email. */
export function toUmichEmail(input: string) {
  const trimmed = input.trim().toLowerCase()
  if (!trimmed) return ''
  if (trimmed.includes('@')) return trimmed
  return `${trimmed}@umich.edu`
}

export function uniqnameFromEmail(email: string) {
  return email.replace(/@umich\.edu$/i, '')
}

export const umichEmailSchema = z
  .string()
  .trim()
  .min(1, 'Uniqname is required')
  .max(320, 'Email is too long')
  .transform(toUmichEmail)
  .pipe(
    z
      .string()
      .email('Enter a valid uniqname or @umich.edu email')
      .refine((value) => value.endsWith('@umich.edu'), 'Must be a @umich.edu address')
      .refine((value) => {
        const uniqname = value.slice(0, -'@umich.edu'.length)
        return /^[a-z0-9][a-z0-9._-]*$/.test(uniqname)
      }, 'Enter a valid uniqname')
  )
