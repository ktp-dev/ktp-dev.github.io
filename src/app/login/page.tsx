'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import Header from '../../components/Header';

export default function Login() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only create client on client side after mount
    setMounted(true);
    if (typeof window !== 'undefined') {
      setSupabase(createClient());
    }
  }, []);

  const handleGoogleLogin = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          hd: 'umich.edu', // Restrict to @umich.edu emails
        },
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      alert('Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="flex-1 px-6 sm:px-8 md:px-16 lg:px-20 relative">
        {/* Blob Container */}
        <div className="inset-0 blob-c z-0">
          <div className="shape-blob eight" style={{ top: 'calc(50vh - 87.5px)' }}></div>
          <div className="shape-blob nine" style={{ top: 'calc(50vh - 87.5px)' }}></div>
        </div>

        {/* Page content */}
        <div className="relative w-full z-10">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center z-10 w-full">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-12 font-inter text-black" style={{ fontWeight: '900', letterSpacing: '-0.02em' }}>
                Welcome!
              </h1>
              
              <button
                onClick={handleGoogleLogin}
                disabled={!supabase}
                className="px-6 py-3 bg-[#315CA9] text-white rounded-[40px] text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer flex items-center justify-center gap-3 font-inter mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ minWidth: '280px' }}
              >
                <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <span>Log in with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

