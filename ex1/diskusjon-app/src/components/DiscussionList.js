// src/components/DiscussionList.js
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

function DiscussionList() {
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'discussions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDiscussions(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Diskusjoner</h2>
      <ul>
        {discussions.map(d => (
          <li key={d.id}>{d.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default DiscussionList;
