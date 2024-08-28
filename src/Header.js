import React, { useState, useEffect } from 'react';
import WideHeader from './Wideheader.js';
import HamburgerHeader from './HamburgerHeader.js';

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
        const scrollTop = window.scrollY;
        setIsScrolled(scrollTop > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
        window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`sticky top-0 w-full z-[9999] transition-all duration-900 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
            <div className='hidden lg:block'><WideHeader></WideHeader></div>
            <div className='block lg:hidden'><HamburgerHeader></HamburgerHeader></div>
        </div>
    );
}

export default Header;
