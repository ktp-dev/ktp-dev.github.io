import Link from 'next/link'
import {
  adminBodyClass,
  adminHeadingClass,
  adminInnerCardClass,
  adminInnerCardStyle,
  adminMutedClass,
  adminSectionCardClass,
  adminSectionCardStyle,
} from '@/components/admin/admin-ui'

const homeLinks = [
  {
    href: '/portal',
    title: 'Brother Portal',
    subtitle: 'Brother resources and application reads',
  },
  {
    href: '/admin/rush',
    title: 'Rush',
    subtitle: 'Cycles, questions, schedule, and rubric',
  },
  {
    href: '/admin/apps',
    title: 'Applications & reads',
    subtitle: 'Submitted apps, scores, reviewer access',
  },
  {
    href: '/admin/members',
    title: 'Members',
    subtitle: 'Site admins and brother directory access',
  },
]

const compactLinks = [
  { href: '/admin', title: 'Admin home' },
  { href: '/admin/rush', title: 'Rush' },
  { href: '/admin/apps', title: 'Applications' },
  { href: '/admin/members', title: 'Members' },
]

export function AdminQuickLinks({
  currentPath,
  variant = 'compact',
}: {
  currentPath?: string
  variant?: 'compact' | 'home'
}) {
  if (variant === 'home') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {homeLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${adminSectionCardClass} tap-card flex h-full cursor-pointer flex-col justify-between gap-4`}
            style={adminSectionCardStyle}
          >
            <div className="min-w-0">
              <p className={`text-lg font-semibold ${adminHeadingClass}`}>{link.title}</p>
              <p className={`mt-1 text-sm ${adminMutedClass}`}>{link.subtitle}</p>
            </div>
            <span className="tap-text-label text-sm font-semibold text-white">View</span>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {compactLinks.map((link) => {
        const isCurrent = currentPath === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`${adminInnerCardClass} tap-card cursor-pointer${isCurrent ? ' ring-2 ring-white/20' : ''}`}
            style={adminInnerCardStyle}
          >
            <p className={`min-w-0 text-sm font-medium ${adminBodyClass}`}>{link.title}</p>
            <span className="tap-text-label shrink-0 text-sm font-semibold text-white">
              {isCurrent ? 'Current' : 'View'}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
