import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Kontakt() {
  return (
    <div className="container mx-auto p-4 pt-20">
      <Navbar />
      <main className="pt-20 pb-24 mt-16 min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-center">Kontaktinformasjon</h2>
        <p>Her kan du kontakte oss for spørsmål eller tilbakemeldinger.</p>
        <ul className="list-disc pl-5">
          <li>E-post: arifo@afk.no</li>
          <li>Adresse: Mailand Videregående Skole, Mailandveien 24, 1470 Lørenskog, Norge</li>
          <li>Telefon: +47 67 91 14 40</li>
        </ul>
      </main>
      <Footer />
    </div>
  );
}

export default Kontakt;