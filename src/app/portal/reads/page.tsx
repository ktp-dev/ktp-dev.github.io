import Link from 'next/link'
import {
  PortalShell,
  portalInnerCardClass,
  portalInnerCardStyle,
  portalSectionCardClass,
  portalSectionCardStyle,
} from '@/components/PortalShell'
import { requireReviewer } from '@/lib/review-access'

const DUMMY_READS = [
  { name: 'Alex Kim', cycle: 'Fall 2026', status: 'Unread' },
  { name: 'Jordan Patel', cycle: 'Fall 2026', status: 'In progress' },
  { name: 'Sam Rivera', cycle: 'Fall 2026', status: 'Unread' },
]

export default async function PortalReadsPage() {
  const { cycle } = await requireReviewer()

  return (
    <PortalShell title="Application Reads">
      <div className={`${portalSectionCardClass} mb-8`} style={portalSectionCardStyle}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold font-inter">Queue</h2>
            <p className="mt-1 text-sm text-gray-500">
              Dummy list for {cycle.name}. Real reads will land here later.
            </p>
          </div>
          <Link href="/portal" className="text-sm font-semibold text-[#315CA9]">
            Back to portal
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          {DUMMY_READS.map((item) => (
            <div key={item.name} className={portalInnerCardClass} style={portalInnerCardStyle}>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">{item.cycle}</p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-gray-500">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  )
}
