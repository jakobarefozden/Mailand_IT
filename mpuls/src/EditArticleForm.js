import React, { useState } from 'react'; // React import eklendi
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

function EditArticleForm({ article, onClose }) {
  const [editTitle, setEditTitle] = useState(article.title);
  const [editContent, setEditContent] = useState(article.content);
  const [editCategory, setEditCategory] = useState(article.category);
  const [editImageUrl, setEditImageUrl] = useState(article.imageUrl ? article.imageUrl.replace('/images/', '') : '');
  const [loading, setLoading] = useState(false);

  const applyBold = () => {
    document.execCommand('bold', false, null);
  };

  const applyItalic = () => {
    document.execCommand('italic', false, null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, 'articles', article.id), {
        title: editTitle,
        content: editContent,
        category: editCategory,
        imageUrl: editImageUrl ? `/images/${editImageUrl}` : '',
      });
      console.log('Article updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating article:', error);
    }
    setLoading(false);
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
            <button
              type="button"
              onClick={applyBold}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={applyItalic}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              <em>I</em>
            </button>
          </div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full border-none p-2 rounded focus:outline-none"
            rows="4"
            required
            contentEditable="true"
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
        <label className="block">Bilde (bare filnavn, eks. resim.jpg)</label>
        <input
          type="text"
          value={editImageUrl}
          onChange={(e) => setEditImageUrl(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="resim.jpg"
        />
      </div>
      <button
        disabled={loading}
        type="submit"
        className="w-full px-4 py-2 bg-green-500 text-white rounded"
      >
        {loading ? 'Oppdaterer...' : 'Oppdater artikkel'}
      </button>
      <button
        onClick={onClose}
        className="w-full mt-2 px-4 py-2 bg-gray-500 text-white rounded"
      >
        Avbryt
      </button>
    </form>
  );
}

export default EditArticleForm;