'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function HamburgerHeader({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const isDark = tone === 'dark';

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        if (isDark) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDark]);

    if (isDark) {
        return (
            <div className="relative flex w-full flex-row items-center justify-between px-8 py-4 pt-4">
                <div className="flex">
                    <Link href="/">
                        <img
                            src="/logos/ktp_logo_letters.png"
                            alt="Logo"
                            className="h-auto w-20 brightness-0 invert"
                        />
                    </Link>
                </div>
                <Link href="/life/" className="flex flex-row items-center justify-center">
                    <img src="/logos/ktp_life_app.svg" alt="Life App" className="mr-2 h-auto w-8" />
                    <p className="font-inter text-sm font-medium text-white sm:text-base">
                        KTP Life App
                    </p>
                </Link>
            </div>
        );
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="relative flex w-full flex-row items-center justify-between px-8 py-4 pt-4">
            <div className="flex">
                <Link href="/">
                    <img src="/logos/ktp_logo_letters.png" alt="Logo" className="h-auto w-20" />
                </Link>
            </div>

            <div className="flex cursor-pointer hover:text-blue-700">
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={toggleMenu}
                >
                    <rect x="10" y="32.4" width="28" height="3.2" rx="1.6" fill="currentColor" />
                    <rect x="10" y="22.4" width="28" height="3.2" rx="1.6" fill="currentColor" />
                    <rect x="10" y="12.4" width="28" height="3.2" rx="1.6" fill="currentColor" />
                </svg>
            </div>

            <div
                ref={menuRef}
                className={`fixed top-0 right-0 z-50 h-full w-64 transform shadow-lg transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                style={{ backgroundColor: '#234c8b' }}
            >
                <div className="relative">
                    <button onClick={closeMenu} className="absolute top-9 right-8">
                        <svg
                            className="close-icon"
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1 1L11 11M1 11L11 1"
                                stroke="#FFFFFF"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    <ul className="flex flex-col items-start justify-start p-8 text-white">
                        <li className="mb-2">
                            <Link className="hover-text-custom font-medium" href="/" onClick={closeMenu}>
                                Home
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link className="hover-text-custom font-medium" href="/about" onClick={closeMenu}>
                                About Us
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link className="hover-text-custom font-medium" href="/rush" onClick={closeMenu}>
                                Rush
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link className="hover-text-custom font-medium" href="/members" onClick={closeMenu}>
                                Members
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link className="hover-text-custom font-medium" href="/nationals" onClick={closeMenu}>
                                Nationals
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link className="hover-text-custom font-bold" href="/apply" onClick={closeMenu}>
                                Apply
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {isMenuOpen && (
                <div
                    onClick={closeMenu}
                    className="fixed inset-0 z-40 bg-white/10 backdrop-blur-md"
                    style={{
                        WebkitBackdropFilter: 'blur(8px)',
                    }}
                />
            )}
        </div>
    );
}
