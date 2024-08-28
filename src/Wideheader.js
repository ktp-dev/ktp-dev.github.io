import { React } from 'react';
import { Link } from 'react-router-dom';

function WideHeader() {
    return (
        <div className='sticky top-0 z-100'>
            <div className="relative flex items-center justify-between w-full p-4 z-10">
                {/* Logo */}
                <div className='flex justify-start ml-16'>
                    <a href='/'>
                        <img src={`${process.env.PUBLIC_URL}/ktp_logo_letters.png`} alt="Logo" className="w-20 h-auto" />
                        {/* <img src={`${process.env.PUBLIC_URL}/ktp_alpha_chapter.svg`} alt="Logo" className="w-20 h-auto" /> */}
                    </a>
                </div>

                {/* Nav */}
                <div className='flex justify-center space-x-20'>
                    <Link className="hover:text-blue-700 font-medium" to="/about">About Us</Link>
                    <Link className="hover:text-blue-700 font-medium" to="/rush">Rush</Link>
                    <Link className="hover:text-blue-700 font-medium" to="/members">Members</Link>
                    <Link className="hover:text-blue-700 font-medium" to="/nationals">Nationals</Link>
                </div>

                {/* Life App */}
                <div className='flex flex-row justify-end mr-16'>
                    <a href='/life/' className='flex flex-row justify-center items-center'>
                        <img src={`${process.env.PUBLIC_URL}/ktp_life_app.svg`} alt='Life App' className="w-8 h-auto mr-2" />
                        <p style={{ fontFamily: 'Inter', color: '#215EB1', fontWeight: '500' }}>KTP Life App</p>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default WideHeader;
