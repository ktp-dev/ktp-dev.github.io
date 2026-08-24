'use client';

import { useState, useEffect } from 'react';
import WideHeader from './WideHeader';
import HamburgerHeader from './HamburgerHeader';

export default function Header({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const isDark = tone === 'dark';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        setIsScrolled(window.scrollY > 0);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrolledClass = isDark
        ? 'bg-[#0f172a] shadow-md shadow-black/30'
        : 'bg-white shadow-md';

    return (
        <div
            className={`sticky top-0 w-full z-[9999] transition-all duration-900 ${
                isScrolled ? scrolledClass : 'bg-transparent'
            } ${isDark ? 'text-slate-200' : ''}`}
        >
            <div className="hidden lg:block">
                <WideHeader tone={tone} />
            </div>
            <div className="block lg:hidden">
                <HamburgerHeader tone={tone} />
            </div>
        </div>
    );
}
