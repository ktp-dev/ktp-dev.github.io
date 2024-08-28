import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HamburgerHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className='relative flex flex-row w-full items-center justify-between px-8 py-4 pt-4'>
            {/* Logo */}
            <div className='flex'>
                <a href='/'>
                    <img src={`${process.env.PUBLIC_URL}/ktp_logo.svg`} alt="Logo" className="w-20 h-auto mb-2" />
                    <img src={`${process.env.PUBLIC_URL}/ktp_alpha_chapter.svg`} alt="Logo" className="w-20 h-auto" />
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
            <div className={`fixed top-0 right-0 w-64 h-full shadow-lg z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out` } style={{ backgroundColor: '#234c8b' }}>
                <div className="relative">
                    <button onClick={toggleMenu} className="absolute top-9 right-8">
                        <svg class="close-icon" width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L11 11M1 11L11 1" stroke='#FFFFFF' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>

                    <ul className="flex flex-col items-start justify-start text-white p-8">
                        <li className='mb-2'><Link className="hover-text-custom font-medium" to="/">Home</Link></li>
                        <li className='mb-2'><Link className="hover-text-custom font-medium" to="/about">About Us</Link></li>
                        <li className='mb-2'><Link className="hover-text-custom font-medium" to="/rush">Rush</Link></li>
                        <li className='mb-2'><Link className="hover-text-custom font-medium" to="/members">Members</Link></li>
                        <li className='mb-2'><Link className="hover-text-custom font-medium" to="/nationals">Nationals</Link></li>
                    </ul>
                </div>
            </div>

            {/* Overlay */}
            {isMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-filter backdrop-blur z-40"></div>}
        </div>
    );
};

export default HamburgerHeader;
