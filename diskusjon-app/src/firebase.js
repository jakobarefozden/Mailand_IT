// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// Du kan også importere getAuth, getStorage osv. hvis du trenger det

const firebaseConfig = {
  apiKey: "AIzaSyRb4ckJfU4WevCAVX1K8TG67laaGxLkxw",
  authDomain: "mailand-515ac.firebaseapp.com",
  projectId: "mailand-515ac",
  storageBucket: "mailand-515ac.appspot.com",
  messagingSenderId: "184285197904",
  appId: "1:184285197904:web:c3a5e2e589577783bf9ec1",
  measurementId: "G-XBFJEJKCW3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
