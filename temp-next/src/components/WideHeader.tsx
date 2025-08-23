'use client';

import Link from 'next/link';

export default function WideHeader() {
    return (
        <div className='w-full'>
            <div className="relative flex items-center justify-between w-full px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-4 z-10">
                {/* Logo */}
                <div className='flex justify-start'>
                    <a href='/'>
                        <img src="/logos/ktp_logo_letters.png" alt="Logo" className="w-20 h-auto" />
                        {/* <img src="/ktp_alpha_chapter.svg" alt="Logo" className="w-20 h-auto" /> */}
                    </a>
                </div>

                {/* Nav */}
                <div className='flex justify-center space-x-8 sm:space-x-12 md:space-x-16 lg:space-x-20'>
                    <Link className="hover:text-blue-700 font-medium" href="/about">About Us</Link>
                    <Link className="hover:text-blue-700 font-medium" href="/rush">Rush</Link>
                    <Link className="hover:text-blue-700 font-medium" href="/members">Members</Link>
                    <Link className="hover:text-blue-700 font-medium" href="/nationals">Nationals</Link>
                </div>

                {/* Life App */}
                <div className='flex flex-row justify-end'>
                    <a href='/life/' className='flex flex-row justify-center items-center'>
                        <img src="/logos/ktp_life_app.svg" alt='Life App' className="w-8 h-auto mr-2" />
                        <p className="font-inter" style={{ color: '#215EB1', fontWeight: '500' }}>KTP Life App</p>
                    </a>
                </div>
            </div>
        </div>
    );
}
