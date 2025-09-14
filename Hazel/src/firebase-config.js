import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVnC7Z-28g1f5d7S8jG6k9p0f3bI1aM2c",
  authDomain: "hazel-v2.firebaseapp.com",
  projectId: "hazel-v2",
  storageBucket: "hazel-v2.appspot.com",
  messagingSenderId: "869755085121",
  appId: "1:869755085121:web:68d9082bbff21bd06601c0",
  measurementId: "G-MBF4YYF05P"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };
