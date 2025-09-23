// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHULzqrBxnsWiKtLlHFzR-lS5BhrEtqcs",
  authDomain: "next-firebase-commerce-41240.firebaseapp.com",
  projectId: "next-firebase-commerce-41240",
  storageBucket: "next-firebase-commerce-41240.firebasestorage.app",
  messagingSenderId: "957576029139",
  appId: "1:957576029139:web:b305626e1bc77608454526"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// firestore
const db = getFirestore(app);

// storage

// authentication
    
export {db};