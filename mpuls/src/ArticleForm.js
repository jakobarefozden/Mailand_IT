import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext'; // src içindeysek ./contexts
import { db } from './firebase'; // src içindeysek ./firebase
import { collection, addDoc } from 'firebase/firestore';

function ArticleForm({ onClose }) {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('nyheter');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const applyBold = () => {
    document.execCommand('bold', false, null);
  };

  const applyItalic = () => {
    document.execCommand('italic', false, null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'articles'), {
        title,
        content,
        category,
        imageUrl: imageUrl ? `/images/${imageUrl}` : '',
        createdAt: new Date(),
        author: currentUser.email,
      });
      console.log('Article added successfully by:', currentUser.email);
      onClose();
    } catch (error) {
      console.error('Error adding article:', error);
    }
    setLoading(false);
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
        <label className="block">Bilde (bare filnavn, eks. resim.jpg)</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="resim.jpg"
        />
      </div>
      <button
        disabled={loading}
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? 'Legger til...' : 'Legg til artikkel'}
      </button>
    </form>
  );
}

export default ArticleForm;