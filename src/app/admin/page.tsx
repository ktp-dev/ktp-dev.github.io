import { redirect } from 'next/navigation'
import { checkIsAdmin, getCurrentUser } from '@/lib/supabase/auth-helpers'
import Header from '@/components/Header'
import AdminListManager from '@/components/AdminListManager'
import BrotherListManager from '@/components/BrotherListManager'
import AdminRushDashboard from '@/components/AdminRushDashboard'
import { listAdmins } from '@/lib/admins'
import { listBrothers } from '@/lib/brothers'
import { getAdminCycle, listRushCycles } from '@/lib/rush-cycles'
import Unauthorized from '@/components/Unauthorized'

export default async function AdminPage() {
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    redirect('/login')
  }

  const adminUser = await checkIsAdmin()

  if (!adminUser) {
    return <Unauthorized />
  }

  const [cycles, applicationCycle, admins, brothers] = await Promise.all([
    listRushCycles(),
    getAdminCycle(),
    listAdmins(),
    listBrothers(),
  ])
  const initialBundle = applicationCycle.cycle
    ? {
        cycle: applicationCycle.cycle,
        questions: applicationCycle.questions,
        events: applicationCycle.events,
      }
    : null

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="flex-1 px-6 sm:px-8 md:px-16 lg:px-20 relative">
        {/* Blob Container — green + blue, clustered around the header */}
        <div className="inset-0 blob-c z-0" style={{ overflow: 'visible' }}>
          <div className="shape-blob eight" style={{ left: 'calc(8% - 40px)', top: '-1%' }}></div>
          <div className="shape-blob nine" style={{ left: 'calc(22% - 20px)', top: '3%' }}></div>
          <div className="shape-blob eight" style={{ left: 'auto', right: '-2%', top: 'auto', bottom: '-4%' }}></div>
          <div className="shape-blob nine" style={{ left: 'auto', right: '6%', top: 'auto', bottom: '2%' }}></div>
        </div>

        <div className="relative w-full z-10">
          <div className="pt-12 sm:pt-16">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 font-inter text-black" style={{ fontWeight: '900', letterSpacing: '-0.02em' }}>
                Admin Dashboard
              </h1>

              <div className="mb-8 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
                <AdminListManager currentEmail={adminUser.email ?? ''} initialAdmins={admins} />
                <BrotherListManager currentEmail={adminUser.email ?? ''} initialBrothers={brothers} />
              </div>

              <AdminRushDashboard initialCycles={cycles} initialBundle={initialBundle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
