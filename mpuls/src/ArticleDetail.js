import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import Footer from './Footer';

/** ---- Simple Carousel ---- */
function Carousel({ images = [], onImageClick }) {
  const valid = images.filter(Boolean);
  const [idx, setIdx] = useState(0);

  if (!valid.length) return null;

  const prev = () => setIdx((i) => (i - 1 + valid.length) % valid.length);
  const next = () => setIdx((i) => (i + 1) % valid.length);

  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      <div className="relative">
        <img
          src={valid[idx]}
          alt={`image-${idx + 1}`}
          className="w-full aspect-video object-cover rounded cursor-zoom-in"
          loading="lazy"
          onClick={() => onImageClick?.(idx)}   // open lightbox on click
        />
        {valid.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded"
              aria-label="Forrige bilde"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded"
              aria-label="Neste bilde"
            >
              ›
            </button>
          </>
        )}
      </div>

      {valid.length > 1 && (
        <div className="flex gap-2 mt-3 justify-center">
          {valid.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setIdx(i)}
              className={`h-2 w-2 rounded-full ${i === idx ? 'bg-blue-600' : 'bg-gray-300'}`}
              aria-label={`Gå til bilde ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** ---- Lightbox (fullscreen viewer) ---- */
function Lightbox({ images = [], startIndex = 0, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const valid = images.filter(Boolean);

  const prev = useCallback(
    () => setIdx((i) => (i - 1 + valid.length) % valid.length),
    [valid.length]
  );
  const next = useCallback(
    () => setIdx((i) => (i + 1) % valid.length),
    [valid.length]
  );
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose?.();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  }, [next, prev, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // lock scroll
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = original;
    };
  }, [handleKey]);

  if (!valid.length) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose?.(); }}
        className="absolute top-4 right-4 text-white/90 hover:text-white text-2xl"
        aria-label="Lukk"
      >
        ✕
      </button>

      {valid.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded"
            aria-label="Forrige"
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded"
            aria-label="Neste"
          >
            ›
          </button>
        </>
      )}

      {/* don't close when clicking inside */}
      <div className="max-w-[95vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
        <img
          src={valid[idx]}
          alt={`image-${idx + 1}`}
          className="max-w-[95vw] max-h-[85vh] object-contain rounded shadow-xl"
          loading="eager"
        />
        {valid.length > 1 && (
          <div className="text-center text-white/80 text-sm mt-2">
            {idx + 1} / {valid.length}
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const docRef = doc(db, 'articles', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        const images = Array.isArray(data.images)
          ? data.images
          : (data.imageUrl ? [data.imageUrl] : []);
        setArticle({ id: snap.id, ...data, images });
      } else {
        setArticle(null);
      }
      setLoading(false);
    })();
  }, [id]);

  // ---- Date helpers (no-NO) ----
  const toDateSafe = (ts) => {
    if (!ts) return null;
    if (typeof ts.toDate === 'function') return ts.toDate(); // Firestore Timestamp
    if (typeof ts === 'number') return new Date(ts);
    if (ts.seconds) return new Date(ts.seconds * 1000);
    if (typeof ts === 'string') return new Date(ts);
    return null;
  };
  const formatNo = (date) =>
    date ? new Intl.DateTimeFormat('no-NO', { dateStyle: 'long', timeStyle: 'short' }).format(date) : '';

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

  const createdAtDate = toDateSafe(article.createdAt);
  const updatedAtDate = toDateSafe(article.updatedAt);
  const createdStr = formatNo(createdAtDate);
  const updatedStr = formatNo(updatedAtDate);

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <main className="pt-28 pb-24 mt-16 min-h-screen">
        <h1 className="text-3xl font-bold mb-2">{article.title}</h1>

        {/* byline */}
        <div className="text-sm text-gray-500 mb-4">
          {article.author && <span>Av {article.author}</span>}
          {article.author && (createdStr || updatedStr) ? <span> · </span> : null}
          {createdStr && <span>Publisert {createdStr}</span>}
          {createdStr && updatedStr ? <span> · </span> : null}
          {updatedStr && <span>Oppdatert {updatedStr}</span>}
        </div>

        {/* Carousel: click opens lightbox */}
        <Carousel
          images={article.images}
          onImageClick={(index) => {
            setLightboxIndex(index);
            setLightboxOpen(true);
          }}
        />

        <article className="prose max-w-3xl mx-auto mb-6 whitespace-pre-wrap">
          {article.content}
        </article>

        <p className="text-sm text-gray-500 mb-6">
          Kategori: {article.category?.[0]?.toUpperCase()}{article.category?.slice(1)}
        </p>

        <Link to="/" className="text-blue-500">Tilbake til forsiden</Link>
      </main>
      <Footer />

      {lightboxOpen && (
        <Lightbox
          images={article.images}
          startIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}

export default ArticleDetail;
