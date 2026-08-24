'use client';

import Link from 'next/link';

export default function WideHeader({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
    const isDark = tone === 'dark';

    if (isDark) {
        return (
            <div className="w-full">
                <div className="relative z-10 flex w-full items-center justify-between px-6 py-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
                    <div className="flex justify-start">
                        <Link href="/">
                            <img
                                src="/logos/ktp_logo_letters.png"
                                alt="Logo"
                                className="h-auto w-20 brightness-0 invert"
                            />
                        </Link>
                    </div>
                    <div className="flex flex-row justify-end">
                        <Link href="/life/" className="flex flex-row items-center justify-center">
                            <img src="/logos/ktp_life_app.svg" alt="Life App" className="mr-2 h-auto w-8" />
                            <p className="font-inter font-medium text-white">
                                KTP Life App
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="relative z-10 flex w-full items-center justify-between px-6 py-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
                <div className="flex justify-start">
                    <Link href="/">
                        <img src="/logos/ktp_logo_letters.png" alt="Logo" className="h-auto w-20" />
                    </Link>
                </div>

                <div className="flex justify-center space-x-8 sm:space-x-12 md:space-x-16 lg:space-x-20">
                    <Link className="font-medium hover:text-[#315CA9]" href="/about">
                        About Us
                    </Link>
                    <Link className="font-medium hover:text-[#315CA9]" href="/rush">
                        Rush
                    </Link>
                    <Link className="font-medium hover:text-[#315CA9]" href="/members">
                        Members
                    </Link>
                    <Link className="font-medium hover:text-[#315CA9]" href="/nationals">
                        Nationals
                    </Link>
                    <Link className="font-bold text-[#315CA9]" href="/apply">
                        Apply
                    </Link>
                </div>

                <div className="flex flex-row justify-end">
                    <Link href="/life/" className="flex flex-row items-center justify-center">
                        <img src="/logos/ktp_life_app.svg" alt="Life App" className="mr-2 h-auto w-8" />
                        <p className="font-inter" style={{ color: '#215EB1', fontWeight: '500' }}>
                            KTP Life App
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
