// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPn0x4Y8PBF6HuczOqeG0Q3ldjNArgPMM",
  authDomain: "hazel-v2.firebaseapp.com",
  projectId: "hazel-v2",
  storageBucket: "hazel-v2.firebasestorage.app",
  messagingSenderId: "719736052006",
  appId: "1:719736052006:web:d4a88136eb2bdd7a3749e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, firebaseConfig };