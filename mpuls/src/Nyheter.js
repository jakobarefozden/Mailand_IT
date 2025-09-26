import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import Navbar from './Navbar';
import Footer from './Footer';

function Nyheter() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const q = query(collection(db, 'articles'), where('category', '==', 'nyheter'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const articlesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setArticles(articlesData);
    };
    fetchArticles();
  }, []);

  return (
    <div className="container mx-auto p-4 pt-20">
      <Navbar />
      <main className="pt-20 pb-24 mt-16 min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-center">Nyheter</h2>
        <h4 className="text-xl font-semibold mb-4">Siste artikler</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles.map(article => (
            <div key={article.id} className="border rounded shadow p-4">
              <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover mb-2" />
              <h4 className="text-xl font-semibold">{article.title}</h4>
              <p>{article.content.substring(0, 100)}...</p>
              <a href={`/article/${article.id}`} className="text-blue-500">Les mer</a>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Nyheter;