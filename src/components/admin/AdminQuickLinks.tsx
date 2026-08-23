import Link from 'next/link'

const adminCardStyle = {
  backgroundColor: 'rgba(249, 250, 251, 0.95)',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
}

const compactCardClass =
  'flex items-center justify-between gap-3 rounded-xl border border-gray-100 px-4 py-3 transition-all duration-300 ease-in-out hover:shadow-[0_12px_36px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05)] cursor-pointer'
const homeCardClass =
  'flex h-full flex-col justify-between gap-4 rounded-xl border border-gray-100 p-6 transform transition-all duration-300 ease-in-out hover:shadow-[0_12px_36px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05)] cursor-pointer'

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
          <Link key={link.href} href={link.href} className={homeCardClass} style={adminCardStyle}>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-gray-900">{link.title}</p>
              <p className="mt-1 text-sm text-gray-500">{link.subtitle}</p>
            </div>
            <span className="text-sm font-semibold text-[#315CA9]">View</span>
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
            className={`${compactCardClass}${isCurrent ? ' ring-2 ring-[#315CA9]/20' : ''}`}
            style={adminCardStyle}
          >
            <p className="min-w-0 text-sm font-medium text-gray-800">{link.title}</p>
            <span className="shrink-0 text-sm font-semibold text-[#315CA9]">
              {isCurrent ? 'Current' : 'View'}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
