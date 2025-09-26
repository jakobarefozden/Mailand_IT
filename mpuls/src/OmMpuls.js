import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function OmMpuls() {
  return (
    <div className="container mx-auto p-4 pt-20">
      <Navbar />
      <main className="pt-20 pb-24 mt-16 min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-center">Om Mpuls Skoleavis</h2>
        <p>Mpuls er Mailand Videregående Skoles offisielle skoleavis. Vi dekker nyheter, intervjuer og diskusjoner fra skolen og elevene.</p>
        <p>Grunnlagt i 2025, Mpuls er drevet av elever og lærere for å fremme engasjement og informasjon i skolesamfunnet.</p>
      </main>
      <Footer />
    </div>
  );
}

export default OmMpuls;