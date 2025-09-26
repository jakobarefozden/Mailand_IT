import React from 'react';
import { BrowserRouter as Router, Routes, Route, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './Home';
import Admin from './Admin';
import ArticleDetail from './ArticleDetail';
import Login from './Login';
import Signup from './Signup';
import Kontakt from './Kontakt';
import OmMpuls from './OmMpuls';
import Nyheter from './Nyheter';
import Intervjuer from './Intervjuer';
import Diskusjoner from './Diskusjoner';

// Hata bileşeni
function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <div>Feil: {error.status} - {error.statusText}</div>;
  } else if (error instanceof Error) {
    return <div>Feil: {error.message}</div>;
  } else {
    return <div>Ukjent feil</div>;
  }
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} errorElement={<ErrorBoundary />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/om-mpuls" element={<OmMpuls />} />
          <Route path="/nyheter" element={<Nyheter />} />
          <Route path="/intervjuer" element={<Intervjuer />} />
          <Route path="/diskusjoner" element={<Diskusjoner />} />
          <Route path="*" element={<div>Side ikke funnet</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;