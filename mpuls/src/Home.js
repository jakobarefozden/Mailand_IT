import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Home() {
  const [articles, setArticles] = useState({
    nyheter: [],
    intervjuer: [],
    diskusjoner: [],
  });

  useEffect(() => {
    const fetchArticles = async () => {
      const categories = ['nyheter', 'intervjuer', 'diskusjoner'];
      const newArticles = {};

      for (const category of categories) {
        const q = query(
          collection(db, 'articles'),
          where('category', '==', category),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const snapshot = await getDocs(q);
        newArticles[category] = snapshot.docs.map(doc => {
          const data = doc.data();
          // Görseli güvenle seç
          const img =
            data.coverImage ||
            (Array.isArray(data.images) && data.images[0]) ||
            data.imageUrl || // eski kayıtlarla uyum
            '/images/placeholder.jpg';

          return { id: doc.id, ...data, coverForList: img };
        });
      }
      setArticles(newArticles);
    };
    fetchArticles();
  }, []);

  const Card = ({ article }) => {
    const preview = (article.content ?? '').slice(0, 80);
    return (
      <div className="border rounded shadow p-3">
        <img
          src={article.coverForList}
          alt={article.title}
          className="w-full h-32 object-cover mb-2 rounded"
          loading="lazy"
        />
        <h4 className="text-lg font-semibold">{article.title}</h4>
        <p className="text-sm">{preview}{preview.length === 80 ? '...' : ''}</p>
        <Link to={`/article/${article.id}`} className="text-blue-500 text-sm">Les mer</Link>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 pt-20">
      <Navbar />
      <main className="pt-20 pb-24 mt-16 min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-center">Velkommen!</h2>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-1/2 p-4 bg-gray-100">
            <h3 className="text-xl font-semibold mb-2">Om Skolen</h3>
            <p>Mailand Videregående Skole er en moderne skole i Oslo som tilbyr et bredt spekter av utdanningsprogrammer. Skolen ble grunnlagt i 1990 og har siden vært et senter for læring og utvikling for tusenvis av elever.</p>
            <p>Vi fokuserer på akademisk fremgang, kreativitet og samfunnsengasjement. Kontakt oss for mer informasjon!</p>
          </div>
          <div className="md:w-1/2 p-4">
            <img src="/images/mailand_ut.jpg" alt="Skole Bilde" className="w-full h-72 object-cover rounded" />
          </div>
        </div>

        <div className="space-y-8">
          <section className="text-center">
            <h3 className="text-2xl font-bold mb-4">Nyheter</h3>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
                {articles.nyheter.map(article => <Card key={article.id} article={article} />)}
              </div>
            </div>
          </section>

          <section className="text-center">
            <h3 className="text-2xl font-bold mb-4">Intervjuer</h3>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
                {articles.intervjuer.map(article => <Card key={article.id} article={article} />)}
              </div>
            </div>
          </section>

          <section className="text-center">
            <h3 className="text-2xl font-bold mb-4">Diskusjoner</h3>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
                {articles.diskusjoner.map(article => <Card key={article.id} article={article} />)}
              </div>
            </div>
          </section>

          <section className="text-center mt-4 mb-40">
            <h3 className="text-2xl font-bold mb-4">Alle elever har rett til et trygt og godt skolemiljø</h3>
            <p className="text-sm">Hvis du, eller noen du kjenner, ikke har det bra på skolen, meld ifra! Du har rett til et trygt og godt skolemiljø fritt for krenkelser som mobbing, vold, diskriminering og trakassering. Det er din opplevelse av å ha blitt krenket som skal ligge til grunn for skolens oppfølging.</p>
          </section>
          <section className="text-center mb-8"></section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
