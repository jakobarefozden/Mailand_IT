import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleHjemClick = () => {
    console.log('Hjem clicked, redirecting to /');
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white p-4 flex items-center z-20 shadow-md">
      <div className="flex items-center space-x-4 mr-4">
        
        <img src="/images/mpuls_logo.png" alt="Skole Logo" className="w-[200px] h-auto" />
      </div>
      <div className="flex-1 flex justify-center space-x-2">
        <button 
          onClick={handleHjemClick} 
          className={`px-4 py-2 rounded ${
            currentPath === '/' ? 'bg-green-500' : 'bg-blue-500'
          } text-white hover:bg-blue-600 transition-colors`}
        >
          Hjem
        </button>
        <Link 
          to="/nyheter" 
          className={`px-4 py-2 rounded text-white hover:bg-blue-600 transition-colors ${
            currentPath === '/nyheter' ? 'bg-green-500' : 'bg-blue-500'
          }`}
        >
          Nyheter
        </Link>
        <Link 
          to="/intervjuer" 
          className={`px-4 py-2 rounded text-white hover:bg-blue-600 transition-colors ${
            currentPath === '/intervjuer' ? 'bg-green-500' : 'bg-blue-500'
          }`}
        >
          Intervjuer
        </Link>
        <Link 
          to="/diskusjoner" 
          className={`px-4 py-2 rounded text-white hover:bg-blue-600 transition-colors ${
            currentPath === '/diskusjoner' ? 'bg-green-500' : 'bg-blue-500'
          }`}
        >
          Diskusjoner
        </Link>
        <Link 
          to="/kontakt" 
          className={`px-4 py-2 rounded text-white hover:bg-blue-600 transition-colors ${
            currentPath === '/kontakt' ? 'bg-green-500' : 'bg-blue-500'
          }`}
        >
          Kontakt
        </Link>
        <Link 
          to="/om-mpuls" 
          className={`px-4 py-2 rounded text-white hover:bg-blue-600 transition-colors ${
            currentPath === '/om-mpuls' ? 'bg-green-500' : 'bg-blue-500'
          }`}
        >
          Om Mplus
        </Link>
      </div>
      <div>
          <h1 className="text-4xl font-bold uppercase">MPuls</h1>
          <p className="text-lg">Skoleavis for Mailand VGS</p>
        </div>
    </nav>
  );
}

export default Navbar;