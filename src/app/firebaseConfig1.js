// src/app/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // ⚠️ อย่าลืมใส่ API Key ของคุณตรงนี้นะครับ
  apiKey: "AIzaSyBnNZLgoYe2-QOs8AFd4DqbQKZAUFa_xBc", 
  authDomain: "claim-cup-final.firebaseapp.com",
  projectId: "claim-cup-final",
  storageBucket: "claim-cup-final.firebasestorage.app",
  messagingSenderId: "163329201931",
  appId: "1:163329201931:web:312e2d94a2dbc297b5340e"
};

// ป้องกันการ Initialize ซ้ำ
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// 👇 บรรทัดนี้สำคัญมากครับ ถ้าขาดไปจะขึ้น Error แบบที่คุณเจอ
export { db, auth };