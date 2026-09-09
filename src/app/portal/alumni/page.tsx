import {
  PortalShell,
  portalSectionCardClass,
  portalSectionCardStyle,
} from '@/components/PortalShell'
import { AlumniDirectoryTable } from '@/components/portal/AlumniDirectoryTable'
import { requirePortalUser } from '@/lib/portal'

export default async function PortalAlumniPage() {
  await requirePortalUser()

  return (
    <PortalShell title="Alumni Directory">
      <div className={`${portalSectionCardClass} mb-8`} style={portalSectionCardStyle}>
        <AlumniDirectoryTable showTitle={false} />
      </div>
    </PortalShell>
  )
}
