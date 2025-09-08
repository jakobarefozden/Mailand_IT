import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";


export default function AdminPanel() {

  
// AdminPanel bileşeni içinde:
const navigate = useNavigate();

useEffect(() => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate("/admin-login");
    }
  });
}, []);

  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState([]);

  const handleAdd = async () => {
    if (question.trim()) {
      await addDoc(collection(db, "questions"), {
        text: question,
        createdAt: new Date()
      });
      setQuestion("");
      fetchQuestions();
    }
  };

  const fetchQuestions = async () => {
    const snapshot = await getDocs(collection(db, "questions"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setQuestions(data);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "questions", id));
    fetchQuestions();
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div>
      <h2>Admin Paneli</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Yeni soru yaz..."
      />
      <button onClick={handleAdd}>Ekle</button>

      <ul>
        {questions.map((q) => (
          <li key={q.id}>
            {q.text} - <Link to={`/question/${q.id}`}>Görüntüle</Link>
            <button onClick={() => handleDelete(q.id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
