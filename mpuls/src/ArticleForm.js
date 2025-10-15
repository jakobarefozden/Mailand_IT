import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function ArticleForm({ onClose }) {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('nyheter');
  const [imagesInput, setImagesInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Simple helpers to append markdown-like formatting to the content
  const applyBold = () => setContent((prev) => `${prev}**bold**`);
  const applyItalic = () => setContent((prev) => `${prev}*italic*`);

  // Parse comma- or newline-separated filenames/URLs into an array
  const parseImages = (raw) => {
    return raw
      .split(/[\n,]+/g)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) =>
        name.startsWith('/images/') || name.startsWith('http')
          ? name
          : `/images/${name}`
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const images = parseImages(imagesInput);
      const coverImage = images.length > 0 ? images[0] : '';

      await addDoc(collection(db, 'articles'), {
        title,
        content,
        category,
        images,          // multiple images
        coverImage,      // first image used as cover on lists
        createdAt: serverTimestamp(),
        author: currentUser?.email ?? 'unknown',
      });

      onClose?.();
    } catch (error) {
      console.error('Error adding article:', error);
      alert('Kunne ikke legge til artikkel. Se konsollen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Tittel</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block">Innhold</label>
        <div className="border rounded p-2 mb-2">
          <div className="flex space-x-2 mb-2">
            <button type="button" onClick={applyBold} className="px-2 py-1 bg-gray-200 rounded" aria-label="Sett inn fet tekst">
              <strong>B</strong>
            </button>
            <button type="button" onClick={applyItalic} className="px-2 py-1 bg-gray-200 rounded" aria-label="Sett inn kursiv tekst">
              <em>I</em>
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border-none p-2 rounded focus:outline-none"
            rows={6}
            required
          />
        </div>
      </div>

      <div>
        <label className="block">Kategori</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="nyheter">Nyheter</option>
          <option value="intervjuer">Intervjuer</option>
          <option value="diskusjoner">Diskusjoner</option>
        </select>
      </div>

      <div>
        <label className="block">Bilder (kun filnavn – flere: komma eller ny linje)</label>
        <textarea
          value={imagesInput}
          onChange={(e) => setImagesInput(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder={`bilde1.jpg, bilde2.png\neller\nbilde1.jpg\nbilde2.png`}
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">
          Sjekk at filene ligger i <code>public/images/</code> hvis du bruker relative stier.
        </p>
      </div>

      <button disabled={loading} type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded">
        {loading ? 'Legger til...' : 'Legg til artikkel'}
      </button>
    </form>
  );
}

export default ArticleForm;
