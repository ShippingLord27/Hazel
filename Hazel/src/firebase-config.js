import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD1vd6fYZ7CL1vLLYPp2fMw_iy4Qpag8NY",
  authDomain: "hazel-1e5cb.firebaseapp.com",
  projectId: "hazel-1e5cb",
  storageBucket: "hazel-1e5cb.firebasestorage.app",
  messagingSenderId: "869755085121",
  appId: "1:869755085121:web:68d9082bbff21bd06601c0",
  measurementId: "G-MBF4YYF05P"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);