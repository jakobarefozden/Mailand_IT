import React, { useState } from 'react';
import { doc, updateDoc, deleteField, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

function EditArticleForm({ article, onClose }) {
  // Base fields
  const [editTitle, setEditTitle] = useState(article.title || '');
  const [editContent, setEditContent] = useState(article.content || '');
  const [editCategory, setEditCategory] = useState(article.category || 'nyheter');

  // Backward compatibility: prefer images[], otherwise use imageUrl
  const initialImages = Array.isArray(article.images)
    ? article.images
    : (article.imageUrl ? [article.imageUrl] : []);

  // Show plain filenames in the textarea (strip /images/)
  const [imagesInput, setImagesInput] = useState(
    initialImages.map(u => u.replace(/^\/images\//, '')).join('\n')
  );

  const [loading, setLoading] = useState(false);

  // Simple helpers to append markdown-like tokens to content
  const applyBold = () => setEditContent(prev => `${prev}${prev && !prev.endsWith('\n') ? '\n' : ''}**bold**`);
  const applyItalic = () => setEditContent(prev => `${prev}${prev && !prev.endsWith('\n') ? '\n' : ''}*italic*`);

  // Parse comma/newline separated values -> URLs/paths
  const parseImages = (raw) =>
    raw
      .split(/[\n,]+/g)
      .map(s => s.trim())
      .filter(Boolean)
      .map(name =>
        name.startsWith('/images/') || name.startsWith('http')
          ? name
          : `/images/${name}`
      );

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const images = parseImages(imagesInput);
      const coverImage = images[0] || '';

      const payload = {
        title: editTitle,
        content: editContent,
        category: editCategory,
        images,
        coverImage,
        updatedAt: serverTimestamp(),
      };

      // Clean legacy field if present
      if ('imageUrl' in article) {
        payload.imageUrl = deleteField();
      }

      await updateDoc(doc(db, 'articles', article.id), payload);
      onClose?.();
    } catch (err) {
      console.error('Error updating article:', err);
      alert('Kunne ikke oppdatere artikkelen. Se konsollen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <div>
        <label className="block">Tittel</label>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
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
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full border-none p-2 rounded focus:outline-none"
            rows={6}
            required
          />
        </div>
      </div>

      <div>
        <label className="block">Kategori</label>
        <select
          value={editCategory}
          onChange={(e) => setEditCategory(e.target.value)}
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
          Første bildet brukes som <strong>forside</strong>. Hvis du bruker relative stier, sørg for at filene ligger i <code>public/images/</code>.
        </p>
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full px-4 py-2 bg-green-500 text-white rounded"
      >
        {loading ? 'Oppdaterer...' : 'Oppdater artikkel'}
      </button>

      <button
        type="button"
        onClick={onClose}
        className="w-full mt-2 px-4 py-2 bg-gray-500 text-white rounded"
      >
        Avbryt
      </button>
    </form>
  );
}

export default EditArticleForm;
