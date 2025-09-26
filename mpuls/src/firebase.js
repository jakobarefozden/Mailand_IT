// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSJuE_iYVMwb6tFxVkJVpBvPzHdwA2YyM",
  authDomain: "mpuls-b76e8.firebaseapp.com",
  projectId: "mpuls-b76e8",
  storageBucket: "mpuls-b76e8.firebasestorage.app",
  messagingSenderId: "288957139710",
  appId: "1:288957139710:web:3b3e7eee222ce3242833af",
  measurementId: "G-8H5H7JZZJ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);