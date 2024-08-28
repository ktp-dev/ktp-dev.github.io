import React from 'react';
import { Link } from 'react-router-dom';

function LifeApp() {
  return (
    <div>
        lifeapp
        <div className='flex justify-center space-x-16 mt-8'>
            <Link className="hover:text-blue-700" to="/about">About Us Page</Link>
            <Link className="hover:text-blue-700" to="/rush">Rush Page</Link>
            <Link className="hover:text-blue-700" to="/members">Members Page</Link>
            <Link className="hover:text-blue-700" to="/nationals">Nationals Page</Link>
        </div>
    </div>
  );
}

export default LifeApp;
