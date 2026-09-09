import { applicationTitle } from '@/lib/apply-steps'
import type { RushCycleCreateWrite } from '@/lib/rush-cycle-schema'

export const DEFAULT_HEAR_ABOUT_OPTIONS = [
  'Search engine / ktpmichigan.com',
  'Flyer',
  'Email',
  'Previous semester rush',
  'Festifall/Northfest/Winterfest',
  'Word of mouth',
  'Diag Board',
  'Instagram',
  'Club Presentation',
  'Other',
] as const

export function buildDefaultIntroMarkdown() {
  return `Thank you for your interest in rushing Kappa Theta Pi. We're excited to get to know you! If you have any questions about the rush process or application, feel free to reach out to us at ktp-board@umich.edu.

The application will remain open until [11:59 PM on DAY, MONTH DATE, YEAR], and you may edit your responses at any time before the deadline.

To participate in rush, please download the Kappa Theta Pi Life App, available on iOS, Android, and Web. If you're unable to access the app, contact our E-Board via email.

For more information about KTP or our upcoming rush events, visit ktpmichigan.com, check the KTP app, or follow us on Instagram @ktpumich.

Note: If you are experiencing technical issues with the Life App, submit a screenshot of the bug at the end of this application instead and email ktp-board@umich.edu. This won't impact your application in any way!`
}

export function buildDefaultClosedMarkdown(cycleName?: string | null) {
  const name = cycleName?.trim()
    ? applicationTitle(cycleName)
    : 'Kappa Theta Pi Rush Application'
  const season = name.replace(/ Rush Application$/i, '').trim()

  return `The ${season} Rush Application has now been closed.

Thank you for your interest in KTP! If you submitted an application, we appreciate the time you put into it. Questions about rush? Email ktp-board@umich.edu.`
}

export function defaultHearAboutOptionsText() {
  return DEFAULT_HEAR_ABOUT_OPTIONS.join('\n')
}

export function withDefaultApplicationCopy(input: RushCycleCreateWrite): RushCycleCreateWrite {
  return {
    ...input,
    intro_markdown: input.intro_markdown.trim() || buildDefaultIntroMarkdown(),
    closed_markdown:
      input.closed_markdown.trim() || buildDefaultClosedMarkdown(input.name),
    hear_about_options:
      input.hear_about_options.length > 0
        ? input.hear_about_options
        : [...DEFAULT_HEAR_ABOUT_OPTIONS],
  }
}
