import React from 'react';
import { FaGlobe, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#318ADA] text-white p-2 text-center z-10">
      <p>&copy; 2025 Mailand Videregående Skole</p>
      <p>Adresse: Mailand VGS, Mailandveien 24, 1470 Lørenskog, Norge</p>
      <p>E-post: mailandvgs@afk.no | Telefon: +47 67 91 14 40</p>
      <div className="flex justify-center space-x-4 mt-2">
        <a href="#" className="text-white hover:text-gray-300">
          <FaGlobe className="text-2xl" />
        </a>
        <a href="#" className="text-white hover:text-gray-300">
          <FaFacebookF className="text-2xl" />
        </a>
        <a href="#" className="text-white hover:text-gray-300">
          <FaInstagram className="text-2xl" />
        </a>
        <a href="#" className="text-white hover:text-gray-300">
          <FaYoutube className="text-2xl" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;