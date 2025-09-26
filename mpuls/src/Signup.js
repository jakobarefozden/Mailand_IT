import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signup(email, password);
      const user = userCredential.user;
      // Rol atama: Admin için manuel, öğrenci için varsayılan
      const role = email.includes('@admin') ? 'admin' : 'student'; // Örnek rol mantığı
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        role: role,
        createdAt: new Date(),
      });
      console.log('User created with role:', role);
      navigate('/admin');
    } catch (error) {
      console.error('Signup error:', error);
      setError('Registrering feilet. Prøv igjen. Detaljer: ' + error.message);
    }
    setLoading(false);
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Registrer deg</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">E-post</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Passord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button disabled={loading} type="submit" className="w-full px-4 py-2 bg-green-500 text-white rounded">
          {loading ? 'Registrerer...' : 'Registrer deg'}
        </button>
      </form>
    </div>
  );
}

export default Signup;