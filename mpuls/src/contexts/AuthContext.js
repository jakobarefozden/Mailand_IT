import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase'; // Yol projenize göre ayarlayın
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup: (email, password) => createUserWithEmailAndPassword(auth, email, password), // Doğru fonksiyon
    login: (email, password) => signInWithEmailAndPassword(auth, email, password),
    signout: () => signOut(auth).then(() => setCurrentUser(null)),
  };
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);