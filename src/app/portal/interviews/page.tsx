import { redirect } from 'next/navigation'
import { requirePortalUser } from '@/lib/portal'

export default async function PortalInterviewsPage() {
  await requirePortalUser()
  redirect('/portal')
}
