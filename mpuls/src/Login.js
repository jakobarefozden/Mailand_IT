import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // login fonksiyonunu al
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('Attempting login with:', { email, password }); // Log ekledim
    try {
      await login(email, password);
      navigate('/admin'); // Başarılı girişte admin sayfasına yönlendir
    } catch (error) {
      console.error('Login error details:', error);
      setError('Innlogging feilet. Sjekk e-post og passord.');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Logg inn</h2>
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
        <button disabled={loading} type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded">
          {loading ? 'Logger inn...' : 'Logg inn'}
        </button>
      </form>
    </div>
  );
}

export default Login;