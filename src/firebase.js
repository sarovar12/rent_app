// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXAyZ8ZZvwAz3ezfMKT13SNg8ZcmtNklY",
  authDomain: "rent-app-1.firebaseapp.com",
  projectId: "rent-app-1",
  storageBucket: "rent-app-1.appspot.com",
  messagingSenderId: "467926298936",
  appId: "1:467926298936:web:83db1501705b11218d91cd",
  measurementId: "G-6MRSVX9B5C"
};

// Initialize Firebase
initializeApp(firebaseConfig);
 const db = getFirestore();
export default db;

