import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function QuestionPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState("");
  const [name, setName] = useState(localStorage.getItem("username") || "");
  const [text, setText] = useState("");
  const [responses, setResponses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdmin(true);
      }
    });
  }, []);

  useEffect(() => {
    const fetchQuestion = async () => {
      const docSnap = await getDoc(doc(db, "questions", id));
      if (docSnap.exists()) {
        setQuestion(docSnap.data().text);
      }
    };

    const fetchResponses = async () => {
      const q = query(collection(db, "responses"), where("questionId", "==", id));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResponses(data);
    };

    fetchQuestion();
    fetchResponses();
  }, [id]);

  const handleSubmit = async () => {
    if (!name || !text) return;

    localStorage.setItem("username", name);

    if (editingId) {
      const ref = doc(db, "responses", editingId);
      await updateDoc(ref, { text });
      setEditingId(null);
    } else {
      await addDoc(collection(db, "responses"), {
        questionId: id,
        name,
        text,
        createdAt: new Date()
      });
    }

    setText("");
    fetchResponses();
  };

  const fetchResponses = async () => {
    const q = query(collection(db, "responses"), where("questionId", "==", id));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setResponses(data);
  };

  const handleEdit = (response) => {
    setText(response.text);
    setEditingId(response.id);
  };

  const handleDelete = async (responseId) => {
    await deleteDoc(doc(db, "responses", responseId));
    fetchResponses();
  };

  return (
    <div>
      <h2>{question}</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="İsmini yaz"
      />
      <br />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Düşünceni yaz"
      />
      <br />
      <button onClick={handleSubmit}>{editingId ? "Güncelle" : "Gönder"}</button>

      <h3>Yanıtlar</h3>
      <ul>
        {responses.map((r) => (
          <li key={r.id}>
            <strong>{r.name}:</strong> {r.text}
            {r.name === name && <button onClick={() => handleEdit(r)}>Düzenle</button>}
            {isAdmin && <button onClick={() => handleDelete(r.id)}>Sil</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
