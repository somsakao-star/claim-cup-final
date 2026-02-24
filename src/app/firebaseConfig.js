import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC6sC3Xczag8x69dDLT_eR--uNYTmoSj-k",
  authDomain: "dashboard-claim-cup-sankhong.firebaseapp.com",
  projectId: "dashboard-claim-cup-sankhong",
  storageBucket: "dashboard-claim-cup-sankhong.firebasestorage.app",
  messagingSenderId: "255646095547",
  appId: "1:255646095547:web:86724c800523ce217b319e",
  measurementId: "G-KJSZL84Z1D"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// 👇 บรรทัดนี้แหละครับที่เป็นพระเอก ช่วยแก้หน้าจอแดง
export { db, auth };