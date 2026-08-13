import { redirect } from 'next/navigation'
import { checkIsAdmin, getCurrentUser } from '@/lib/supabase/auth-helpers'
import Header from '@/components/Header'
import RushScheduleManager from '@/components/RushScheduleManager'
import Unauthorized from '@/components/Unauthorized'

export default async function AdminPage() {
  // First check if user is authenticated
  const currentUser = await getCurrentUser()
  
  // If no user at all, redirect to login
  if (!currentUser) {
    redirect('/login')
  }

  // If user exists, check if they're an admin
  const adminUser = await checkIsAdmin()

  // If user is authenticated but not an admin, show unauthorized page
  if (!adminUser) {
    return <Unauthorized />
  }

  const sectionCardClass =
    'rounded-xl border border-gray-100 p-6 transform transition-all duration-300 ease-in-out hover:shadow-[0_12px_36px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05)]'

  const sectionCardStyle = {
    backgroundColor: 'rgba(249, 250, 251, 0.95)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="flex-1 px-6 sm:px-8 md:px-16 lg:px-20 relative">
        {/* Blob Container — green + blue, clustered around the header */}
        <div className="inset-0 blob-c z-0" style={{ overflow: 'visible' }}>
          <div className="shape-blob eight" style={{ left: 'calc(8% - 40px)', top: '-1%' }}></div>
          <div className="shape-blob nine" style={{ left: 'calc(22% - 20px)', top: '3%' }}></div>
        </div>

        <div className="relative w-full z-10">
          <div className="pt-12 sm:pt-16">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 font-inter text-black" style={{ fontWeight: '900', letterSpacing: '-0.02em' }}>
                Admin Dashboard
              </h1>
              
              <div className={`${sectionCardClass} mb-8`} style={sectionCardStyle}>
                <h2 className="text-xl font-bold mb-4 font-inter">
                  Welcome, {adminUser.email}!
                </h2>
                <p className="text-gray-600 text-sm">
                  Admin portal features will be available here.
                </p>
              </div>

              {/* Placeholder for future widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                <div className={sectionCardClass} style={sectionCardStyle}>
                  <RushScheduleManager />
                </div>
                
                <div className={sectionCardClass} style={sectionCardStyle}>
                  <h2 className="text-xl font-bold mb-4 font-inter">More Features</h2>
                  <p className="text-gray-600 text-sm">
                    Additional admin features will be added here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

