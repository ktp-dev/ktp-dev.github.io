'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function HamburgerHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);  // Reference for the nav menu

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Function to close the menu
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Setup an event listener to close the menu when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeMenu();  // Close the menu if clicked outside
            }
        };

        // Add the event listener
        document.addEventListener("mousedown", handleClickOutside);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);  // Empty dependency array ensures the effect runs only on mount and unmount

    return (
        <div className='relative flex flex-row w-full items-center justify-between px-8 py-4 pt-4'>
            {/* Logo */}
            <div className='flex'>
                <a href='/'>
                    <img src="/ktp_logo_letters.png" alt="Logo" className="w-20 h-auto" />
                    {/* <img src="/ktp_alpha_chapter.svg" alt="Logo" className="w-20 h-auto" /> */}
                </a>
            </div>

            {/* Hamburger Menu */}
            <div className='flex hover:text-blue-700 cursor-pointer'>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={toggleMenu}>
                    <rect x="10" y="32.4" width="28" height="3.2" rx="1.6" fill="currentColor"/>
                    <rect x="10" y="22.4" width="28" height="3.2" rx="1.6" fill="currentColor"/>
                    <rect x="10" y="12.4" width="28" height="3.2" rx="1.6" fill="currentColor"/>
                </svg>
            </div>

            {/* Right-side Panel Navigation */}
            <div ref={menuRef} className={`fixed top-0 right-0 w-64 h-full shadow-lg z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`} style={{ backgroundColor: '#234c8b' }}>
                <div className="relative">
                    {/* X button */}
                    <button onClick={closeMenu} className="absolute top-9 right-8">
                        <svg className="close-icon" width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L11 11M1 11L11 1" stroke='#FFFFFF' strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>

                    {/* Navigation */}
                    <ul className="flex flex-col items-start justify-start text-white p-8">
                        <li className='mb-2'><Link className="hover-text-custom font-medium" href="/" onClick={closeMenu}>Home</Link></li>
                        <li className='mb-2'><Link className="hover-text-custom font-medium" href="/about" onClick={closeMenu}>About Us</Link></li>
                        <li className='mb-2'><Link className="hover-text-custom font-medium" href="/rush" onClick={closeMenu}>Rush</Link></li>
                        <li className='mb-2'><Link className="hover-text-custom font-medium" href="/members" onClick={closeMenu}>Members</Link></li>
                        <li className='mb-2'><Link className="hover-text-custom font-medium" href="/nationals" onClick={closeMenu}>Nationals</Link></li>
                    </ul>
                </div>
            </div>

            {/* Overlay */}
            {isMenuOpen && <div onClick={closeMenu} className="fixed inset-0 bg-black bg-opacity-70 backdrop-filter backdrop-blur z-40"></div>}
        </div>
    );
}
