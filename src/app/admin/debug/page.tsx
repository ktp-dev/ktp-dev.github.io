import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Header from '@/components/Header'

export default async function DebugPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  let adminCheck = null
  let adminError = null
  if (user?.email) {
    const result = await supabase
      .from('admins')
      .select('*')
      .eq('email', user.email.toLowerCase())
      .single()

    adminCheck = result.data
    adminError = result.error
  }

  const { data: allAdmins } = await supabase.from('admins').select('*')

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
                <h2 className="text-xl font-bold mb-4 font-inter">User Info</h2>
                {userError && (
                  <p className="text-red-600 text-sm mb-3">Error: {userError.message}</p>
                )}
                {user ? (
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-semibold text-gray-800">Email:</span> {user.email}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">User ID:</span> {user.id}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">Email ends with @umich.edu:</span>{' '}
                      {user.email?.endsWith('@umich.edu') ? 'Yes' : 'No'}
                    </p>
                  </div>
                ) : (
                  <p className="text-red-600 text-sm">No user found. Please log in.</p>
                )}
              </div>

              <div className={`${sectionCardClass} mb-6`} style={sectionCardStyle}>
                <h2 className="text-xl font-bold mb-4 font-inter">Admin Check</h2>
                {adminError && (
                  <p className="text-red-600 text-sm mb-3">
                    Error: {adminError.message} (Code: {adminError.code})
                  </p>
                )}
                {adminCheck ? (
                  <p className="text-green-600 text-sm font-medium">
                    You are in the admins table.
                  </p>
                ) : user ? (
                  <p className="text-red-600 text-sm">
                    You are not in the admins table. Your email is: {user.email}
                  </p>
                ) : (
                  <p className="text-gray-600 text-sm">Cannot check — no user logged in.</p>
                )}
              </div>

              <div className={sectionCardClass} style={sectionCardStyle}>
                <h2 className="text-xl font-bold mb-4 font-inter">All Admins in Database</h2>
                {allAdmins && allAdmins.length > 0 ? (
                  <ul className="space-y-2 text-sm text-gray-600">
                    {allAdmins.map((admin) => {
                      const isCurrentUser =
                        user?.email?.toLowerCase() === admin.email
                      return (
                        <li
                          key={admin.email}
                          className={
                            isCurrentUser
                              ? 'font-semibold text-green-600'
                              : ''
                          }
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
