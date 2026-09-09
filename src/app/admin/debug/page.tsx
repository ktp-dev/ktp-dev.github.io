import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Unauthorized from '@/components/Unauthorized'
import { getS3ConfigStatus } from '@/lib/s3'
import { checkIsAdmin, getCurrentUser } from '@/lib/supabase/auth-helpers'
import { createClient } from '@/lib/supabase/server'
import { S3UploadSpike } from '@/app/admin/debug/S3UploadSpike'

export default async function DebugPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect('/login')
  }

  const adminUser = await checkIsAdmin()
  if (!adminUser) {
    return <Unauthorized />
  }

  const supabase = await createClient()
  const { data: allAdmins } = await supabase.from('admins').select('*')
  const s3Status = getS3ConfigStatus()

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
        <div className="inset-0 blob-c z-0" style={{ overflow: 'visible' }}>
          <div className="shape-blob eight" style={{ left: 'calc(8% - 40px)', top: '-1%' }}></div>
          <div className="shape-blob nine" style={{ left: 'calc(22% - 20px)', top: '3%' }}></div>
        </div>

        <div className="relative w-full z-10">
          <div className="pt-12 sm:pt-16">
            <div className="max-w-7xl mx-auto pb-12">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 font-inter text-black"
                style={{ fontWeight: '900', letterSpacing: '-0.02em' }}
              >
                Admin Debug
              </h1>

              <div className={`${sectionCardClass} mb-6`} style={sectionCardStyle}>
                <h2 className="text-xl font-bold mb-4 font-inter">S3 Upload Test</h2>
                <S3UploadSpike
                  s3Configured={s3Status.configured}
                  bucket={s3Status.bucket}
                  region={s3Status.region}
                />
              </div>

              <div className={`${sectionCardClass} mb-6`} style={sectionCardStyle}>
                <h2 className="text-xl font-bold mb-4 font-inter">User Info</h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold text-gray-800">Email:</span> {adminUser.email}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">User ID:</span> {adminUser.id}
                  </p>
                </div>
              </div>

              <div className={sectionCardClass} style={sectionCardStyle}>
                <h2 className="text-xl font-bold mb-4 font-inter">All Admins in Database</h2>
                {allAdmins && allAdmins.length > 0 ? (
                  <ul className="space-y-2 text-sm text-gray-600">
                    {allAdmins.map((admin) => {
                      const isCurrentUser = adminUser.email?.toLowerCase() === admin.email
                      return (
                        <li
                          key={admin.email}
                          className={isCurrentUser ? 'font-semibold text-green-600' : ''}
                        >
                          {admin.email}
                          {isCurrentUser && ' (this is you)'}
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-600 text-sm">No admins found in database.</p>
                )}
              </div>

              <div className="mt-8">
                <Link
                  href="/admin"
                  className="inline-block px-4 py-2 bg-[#315CA9] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
                >
                  Back to Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
