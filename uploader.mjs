// uploader.mjs
import { initializeApp } from "firebase/app";
import { getFirestore, collection, writeBatch, doc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = {
  apiKey: "AIzaSyC6sC3Xczag8x69dDLT_eR--uNYTmoSj-k",
  authDomain: "dashboard-claim-cup-sankhong.firebaseapp.com",
  projectId: "dashboard-claim-cup-sankhong",
  storageBucket: "dashboard-claim-cup-sankhong.firebasestorage.app",
  messagingSenderId: "255646095547",
  appId: "1:255646095547:web:86724c800523ce217b319e",
  measurementId: "G-KJSZL84Z1D"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const uploadData = async () => {
  try {
    console.log("📦 กำลังอ่านไฟล์ newData.json...");
    const rawData = fs.readFileSync("./newData.json", "utf-8");
    const jsonData = JSON.parse(rawData);

    console.log(`🚀 พบข้อมูล ${jsonData.length} รายการ กำลังอัปโหลดแบบเหมาเข่ง (Batch)...`);
    const colRef = collection(db, "claims");

    let batch = writeBatch(db); // สร้างเข่งใบแรก
    let count = 0;
    let totalUploaded = 0;

   for (const item of jsonData) {
       // ข้ามบรรทัดว่าง
       if (!item.hcode && !item.platform) continue;

       // 1. ดึงค่าเงินออกมา ไม่ว่า Excel จะเขียนหัวตารางมาแบบไหน
       const rawAmount = item.amount ?? item.Amount ?? item['amount '] ?? item['Amount '] ?? item['ยอดเงิน'] ?? 0;

       // 2. คลีนตัวเลข ลบลูกน้ำออก
       let cleanAmount = 0;
       if (rawAmount !== undefined && rawAmount !== null && rawAmount !== '') {
           if (typeof rawAmount === 'string') {
               cleanAmount = parseFloat(rawAmount.toString().replace(/,/g, ''));
           } else {
               cleanAmount = Number(rawAmount);
           }
       }
       if (isNaN(cleanAmount)) cleanAmount = 0;

       // 3. ก๊อปปี้ข้อมูลเดิม แต่ลบฟิลด์ยอดเงินเก่าที่มีปัญหาทิ้งให้หมด
       const cleanItem = { ...item };
       delete cleanItem.amount;
       delete cleanItem.Amount;
       delete cleanItem['amount '];
       delete cleanItem['Amount '];
       delete cleanItem['ยอดเงิน'];

       // 4. ใส่ยอดเงินที่สะอาดแล้วกลับเข้าไป ในชื่อ "amount" (พิมพ์เล็กล้วน) อันเดียว
       cleanItem.amount = cleanAmount;
       cleanItem.importedAt = new Date();

       // เอาใส่เข่ง
       const docRef = doc(colRef); 
       batch.set(docRef, cleanItem);
       count++;
       totalUploaded++;

       if (count === 500) {
           await batch.commit(); 
           console.log(`✅ อัปโหลดไปแล้ว ${totalUploaded} รายการ...`);
           batch = writeBatch(db); 
           count = 0; 
       }
    }

    // ส่งเศษที่เหลือในเข่งสุดท้าย (ถ้ามี)
    if (count > 0) {
        await batch.commit();
        console.log(`✅ อัปโหลดส่วนที่เหลือ รวมทั้งหมด ${totalUploaded} รายการ...`);
    }

    console.log("🎉 อัปโหลดเสร็จสมบูรณ์รวดเร็วทันใจ!");
    process.exit(0);

  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาด:", error);
    process.exit(1);
  }
};

uploadData();