import Link from 'next/link'
import { SignedInAccountBar } from '@/components/SignedInAccountBar'
// import { AlumniDirectoryTable } from '@/components/portal/AlumniDirectoryTable'
// import { InterviewHomeSection } from '@/components/portal/InterviewHomeSection'
import {
  PortalShell,
  portalDarkInnerCardClass,
  portalDarkInnerCardStyle,
  portalDarkSectionCardClass,
  portalDarkSectionCardStyle,
} from '@/components/PortalShell'
import { checkIsAdmin } from '@/lib/supabase/auth-helpers'
import { requirePortalUser } from '@/lib/portal'
import { canReviewApplications } from '@/lib/review-access'
import { getActiveCycle } from '@/lib/applications'

type QuickLink = {
  href: string
  title: string
  subtitle: string
  external?: boolean
}

function LinkRow({ link }: { link: QuickLink }) {
  const className = `${portalDarkInnerCardClass} tap-card cursor-pointer`
  const body = (
    <>
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{link.title}</p>
        <p className="text-xs text-slate-300">{link.subtitle}</p>
      </div>
      <span className="tap-text-label shrink-0 text-sm font-semibold text-white">
        {link.external ? 'Open' : 'View'}
      </span>
    </>
  )

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={portalDarkInnerCardStyle}
      >
        {body}
      </a>
    )
  }

  return (
    <Link href={link.href} className={className} style={portalDarkInnerCardStyle}>
      {body}
    </Link>
  )
}

export default async function PortalPage() {
  const { email } = await requirePortalUser()
  const adminUser = await checkIsAdmin()
  const activeCycle = await getActiveCycle()
  const showApplicationReads = activeCycle
    ? await canReviewApplications({ email, cycleId: activeCycle.id })
    : false

  const quickLinks: QuickLink[] = [
    {
      href: 'https://drive.google.com',
      title: 'Google Drive',
      subtitle: 'Knowledge base',
      external: true,
    },
    {
      href: 'https://slack.com/signin',
      title: 'Slack',
      subtitle: 'Chapter workspace',
      external: true,
    },
    ...(adminUser
      ? [
          {
            href: '/admin',
            title: 'Admin Dashboard',
            subtitle: 'Rush cycles, applications, and admins',
          },
        ]
      : []),
  ]

  return (
    <PortalShell
      tone="dark"
      title="Brother Portal"
      subtitle={
        <SignedInAccountBar tone="dark" variant="compact" align="start" email={email} />
      }
      headerRight={
        <img
          src="/images/beep-bop.png"
          alt=""
          width={128}
          height={128}
          className="h-24 w-24 shrink-0 sm:h-28 sm:w-28 md:h-32 md:w-32"
        />
      }
    >
      <div className={`${portalDarkSectionCardClass} mb-8`} style={portalDarkSectionCardStyle}>
        <h2 className="mb-4 font-inter text-xl font-bold text-white">Quick Links</h2>
        <div className="flex flex-col gap-2">
          {quickLinks.map((link) => (
            <LinkRow key={link.href} link={link} />
          ))}
        </div>
      </div>

      {showApplicationReads ? (
        <div className={`${portalDarkSectionCardClass} mb-8`} style={portalDarkSectionCardStyle}>
          <h2 className="mb-4 font-inter text-xl font-bold text-white">Your Tasks</h2>
          <LinkRow
            link={{
              href: '/portal/reads',
              title: 'Application Reads',
              subtitle: 'Review submitted rush applications',
            }}
          />
        </div>
      ) : null}

      <div className={`${portalDarkSectionCardClass} mb-8`} style={portalDarkSectionCardStyle}>
        <h2 className="mb-2 font-inter text-xl font-bold text-white">More coming soon</h2>
        <p className="text-sm text-slate-300">More features coming soon. Stay tuned!</p>
      </div>

      {/* <div className={`${portalDarkSectionCardClass} mb-8`} style={portalDarkSectionCardStyle}>
        <AlumniDirectoryTable />
      </div>

      <div className={`${portalDarkSectionCardClass} mb-8`} style={portalDarkSectionCardStyle}>
        <InterviewHomeSection />
      </div> */}
    </PortalShell>
  )
}
