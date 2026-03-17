import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3aeoNRNXVuliRBlNHr3uoMPTTGOOccqw",
  authDomain: "mysafeplace-f01ae.firebaseapp.com",
  projectId: "mysafeplace-f01ae",
  storageBucket: "mysafeplace-f01ae.firebasestorage.app",
  messagingSenderId: "968528233756",
  appId: "1:968528233756:web:ebef9129e0124202a126d9",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
