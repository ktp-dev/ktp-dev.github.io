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

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="flex-1 px-6 sm:px-8 md:px-16 lg:px-20">
        <div className="relative w-full z-10">
          <div className="pt-12 sm:pt-16">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 font-inter text-black" style={{ fontWeight: '900', letterSpacing: '-0.02em' }}>
                Admin Dashboard
              </h1>
              
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <p className="text-gray-600 mb-4">
                  Welcome, <span className="font-semibold">{adminUser.email}</span>!
                </p>
                <p className="text-gray-500 text-sm">
                  Admin portal features will be available here.
                </p>
              </div>

              {/* Placeholder for future widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <RushScheduleManager />
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
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

