// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARvTbQAizjmad_HTENYTncd5CSp806H_A",
  authDomain: "future-craft-87fee.firebaseapp.com",
  projectId: "future-craft-87fee",
  storageBucket: "future-craft-87fee.firebasestorage.app",
  messagingSenderId: "749968571862",
  appId: "1:749968571862:web:8a4f7dfaaa8ed449dc7877",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
