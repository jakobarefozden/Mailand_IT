// src/components/AddDiscussion.js
import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function AddDiscussion() {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim()) {
      await addDoc(collection(db, 'discussions'), {
        text,
        createdAt: serverTimestamp()
      });
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Skriv en diskusjon..."
      />
      <button type="submit">Legg til</button>
    </form>
  );
}

export default AddDiscussion;
