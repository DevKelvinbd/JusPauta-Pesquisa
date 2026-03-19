import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgM54QFS9WSllzrKG3MXitIDqjwLdGJBU",
  authDomain: "form-advocacia.firebaseapp.com",
  projectId: "form-advocacia",
  storageBucket: "form-advocacia.firebasestorage.app",
  messagingSenderId: "38762766239",
  appId: "1:38762766239:web:0485fe95f1176df18fa7aa",
  measurementId: "G-HSLDZJCZK5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);