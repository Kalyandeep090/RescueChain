
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyARBmuV8IlWJaSVQk4sXLoOz7dGh3ya6KM",
  authDomain: "rescuechain-8fb3b.firebaseapp.com",
  projectId: "rescuechain-8fb3b",
  storageBucket: "rescuechain-8fb3b.firebasestorage.app",
  messagingSenderId: "307206093004",
  appId: "1:307206093004:web:cd047a3b000f169e52aa69",
  measurementId: "G-JM6XBQHWGM"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
