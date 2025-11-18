import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DebugPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  // Check admins table
  let adminCheck = null
  let adminError = null
  if (user) {
    const result = await supabase
      .from('admins')
      .select('*')
      .eq('id', user.id)
      .single()
    
    adminCheck = result.data
    adminError = result.error
  }

  // Get all admins for reference
  const { data: allAdmins } = await supabase
    .from('admins')
    .select('*')

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Debug Info</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-xl font-semibold mb-2">User Info</h2>
          {userError && (
            <div className="text-red-600 mb-2">
              Error: {userError.message}
            </div>
          )}
          {user ? (
            <div>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Email ends with @umich.edu:</strong> {user.email?.endsWith('@umich.edu') ? 'Yes' : 'No'}</p>
            </div>
          ) : (
            <p className="text-red-600">No user found. Please log in.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-xl font-semibold mb-2">Admin Check</h2>
          {adminError && (
            <div className="text-red-600 mb-2">
              Error: {adminError.message} (Code: {adminError.code})
            </div>
          )}
          {adminCheck ? (
            <div className="text-green-600">
              ✓ You ARE in the admins table!
            </div>
          ) : user ? (
            <div className="text-red-600">
              ✗ You are NOT in the admins table. Your user ID is: {user.id}
            </div>
          ) : (
            <div className="text-gray-600">
              Cannot check - no user logged in
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">All Admins in Database</h2>
          {allAdmins && allAdmins.length > 0 ? (
            <ul>
              {allAdmins.map((admin) => (
                <li key={admin.id} className={user?.id === admin.id ? 'font-bold text-green-600' : ''}>
                  {admin.id} {user?.id === admin.id && '(This is you!)'}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No admins found in database</p>
          )}
        </div>

        <div className="mt-4">
          <a 
            href="/admin" 
            className="text-blue-600 hover:underline"
          >
            ← Back to Admin Page
          </a>
        </div>
      </div>
    </div>
  )
}

