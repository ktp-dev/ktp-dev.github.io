import Link from 'next/link'
import { TimeGreeting } from '@/components/portal/TimeGreeting'
// import { AlumniDirectoryTable } from '@/components/portal/AlumniDirectoryTable'
// import { InterviewHomeSection } from '@/components/portal/InterviewHomeSection'
import {
  PortalShell,
  portalInnerCardClass,
  portalInnerCardStyle,
  portalSectionCardClass,
  portalSectionCardStyle,
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
  const className = `${portalInnerCardClass} cursor-pointer transition-all duration-200 hover:bg-white`
  const body = (
    <>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800">{link.title}</p>
        <p className="text-xs text-gray-500">{link.subtitle}</p>
      </div>
      <span className="shrink-0 text-sm font-semibold text-[#315CA9]">{link.external ? 'Open' : 'View'}</span>
    </>
  )

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className} style={portalInnerCardStyle}>
        {body}
      </a>
    )
  }

  return (
    <Link href={link.href} className={className} style={portalInnerCardStyle}>
      {body}
    </Link>
  )
}

export default async function PortalPage() {
  const { email, brother } = await requirePortalUser()
  const adminUser = await checkIsAdmin()
  const activeCycle = await getActiveCycle()
  const showApplicationReads = activeCycle
    ? await canReviewApplications({ email, cycleId: activeCycle.id })
    : false
  const greetingName = brother.first_name?.trim() || email

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
      title="Brother Portal"
      subtitle={<TimeGreeting name={greetingName} />}
      headerRight={
        <img
          src="/images/beep-bop.svg"
          alt=""
          className="h-24 w-24 shrink-0 brightness-0 sm:h-28 sm:w-28 md:h-32 md:w-32"
        />
      }
    >
      <div className={`${portalSectionCardClass} mb-8`} style={portalSectionCardStyle}>
        <h2 className="mb-4 text-xl font-bold font-inter">Quick Links</h2>
        <div className="flex flex-col gap-2">
          {quickLinks.map((link) => (
            <LinkRow key={link.href} link={link} />
          ))}
        </div>
      </div>

      {showApplicationReads ? (
        <div className={`${portalSectionCardClass} mb-8`} style={portalSectionCardStyle}>
          <h2 className="mb-4 text-xl font-bold font-inter">Your Tasks</h2>
          <LinkRow
            link={{
              href: '/portal/reads',
              title: 'Application Reads',
              subtitle: 'Review submitted rush applications',
            }}
          />
        </div>
      ) : null}

      <div className={`${portalSectionCardClass} mb-8`} style={portalSectionCardStyle}>
        <h2 className="mb-2 text-xl font-bold font-inter">More coming soon</h2>
        <p className="text-sm text-gray-500">More features coming soon. Stay tuned.</p>
      </div>

      {/* <div className={`${portalSectionCardClass} mb-8`} style={portalSectionCardStyle}>
        <AlumniDirectoryTable />
      </div>

      <div className={`${portalSectionCardClass} mb-8`} style={portalSectionCardStyle}>
        <InterviewHomeSection />
      </div> */}
    </PortalShell>
  )
}
