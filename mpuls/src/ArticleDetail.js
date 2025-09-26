import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import Footer from './Footer';

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      const docRef = doc(db, 'articles', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setArticle({ id: docSnap.id, ...docSnap.data() });
      } else {
        setArticle(null);
      }
      setLoading(false);
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto p-4">Laster...</div>;
  }

  if (!article) {
    return (
      <div className="container mx-auto p-4">
        <Navbar />
        <main className="pt-28 pb-24 mt-16 min-h-screen">
          <h2 className="text-2xl font-bold mb-4">Artikkelen ble ikke funnet</h2>
          <Link to="/" className="text-blue-500">Tilbake til forsiden</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <main className="pt-28 pb-24 mt-16 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">{article.title}</h2>
        <img src={article.imageUrl} alt={article.title} className="w-full max-w-md mx-auto mb-4 object-cover" />
        <p className="mb-4">{article.content}</p>
        <p className="text-sm text-gray-500">Kategori: {article.category.charAt(0).toUpperCase() + article.category.slice(1)}</p>
        <Link to="/" className="text-blue-500">Tilbake til forsiden</Link>
      </main>
      <Footer />
    </div>
  );
}

export default ArticleDetail;