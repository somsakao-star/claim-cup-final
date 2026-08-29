"use client";
import WebThreads from './WebThreads';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import {
  Activity, Trophy, Syringe, Baby, Flower, Scan, HeartPulse, Monitor,
  ArrowUpRight, ArrowLeft, Calendar, Clock, Building2, CheckCircle2,
  Layers, Leaf, List, Table2, Wallet, LogOut, FileText, Database, Printer
} from 'lucide-react';

const API_BASE_URL = 'https://claimcup-api-production.up.railway.app';

const MONTHS_TH = ["ต.ค.", "พ.ย.", "ธ.ค.", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย."];

/* ⚠️ ข้อมูลชุดนี้ (PAY_DATA, PAY_MATRIX_*) เป็นข้อมูลสถิตจริงที่ยกมาจาก dashboard_demo.html โดยตรง
   ไม่ได้ดึงจาก /api/claims, /api/expenses หรือ /api/hospitals — เพราะ API ปัจจุบันยังไม่มี endpoint
   สำหรับ "รายงานพึ่งจ่าย" นี้โดยเฉพาะ ถ้ามี endpoint จริง (เช่น /api/payable) บอกได้เลย จะเปลี่ยนมา fetch แทน */
const PAY_DATA = [
  { "หน่วยบริการ": "05954 - รพ.สต.บ้านสันโค้ง", "code": "05954", "รับเงินครั้งที่1": 290775.68, "รับเงินครั้งที่2": 113379.99, "หักเงิน": 0.0, "ยอดสุทธิ": 404155.67 },
  { "หน่วยบริการ": "05957 - รพ.สต.บ้านกอสะเรียม", "code": "05957", "รับเงินครั้งที่1": 25133.87, "รับเงินครั้งที่2": 30050.50, "หักเงิน": 7920.0, "ยอดสุทธิ": 47264.37 },
  { "หน่วยบริการ": "05959 - รพ.สต.บ้านแม่ผาแหน", "code": "05959", "รับเงินครั้งที่1": 22735.00, "รับเงินครั้งที่2": 14381.00, "หักเงิน": 14160.0, "ยอดสุทธิ": 22956.00 },
  { "หน่วยบริการ": "05962 - รพ.สต.บ้านต้นเปา", "code": "05962", "รับเงินครั้งที่1": 89473.84, "รับเงินครั้งที่2": 51756.50, "หักเงิน": 0.0, "ยอดสุทธิ": 141230.34 },
  { "หน่วยบริการ": "05956 - รพ.สต.บ้านป่าตาล", "code": "05956", "รับเงินครั้งที่1": 0.0, "รับเงินครั้งที่2": 0.0, "หักเงิน": 0.0, "ยอดสุทธิ": 0.0 }
];

const PAY_MATRIX_69 = {
  "ALL": [
    { "Month": "ต.ค. 68", "KTB Claim": 1950.0, "MOPH Claim": 0.0, "E-Claim": 27905.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 29855.0 },
    { "Month": "พ.ย. 68", "KTB Claim": 7000.0, "MOPH Claim": 3270.0, "E-Claim": 21606.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 31876.0 },
    { "Month": "ธ.ค. 68", "KTB Claim": 40.0, "MOPH Claim": 12440.0, "E-Claim": 34256.5, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 46736.5 },
    { "Month": "ม.ค. 69", "KTB Claim": 1470.0, "MOPH Claim": 5260.0, "E-Claim": 94014.5, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 100744.5 },
    { "Month": "ก.พ. 69", "KTB Claim": 1550.0, "MOPH Claim": 81035.0, "E-Claim": 124385.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 206970.0 },
    { "Month": "มี.ค. 69", "KTB Claim": 21900.0, "MOPH Claim": 0.0, "E-Claim": 75563.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 97463.0 },
    { "Month": "เม.ย. 69", "KTB Claim": 3750.0, "MOPH Claim": 10730.0, "E-Claim": 114137.5, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 128617.5 },
    { "Month": "พ.ค. 69", "KTB Claim": 50.0, "MOPH Claim": 3390.0, "E-Claim": 12250.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 15690.0 },
    { "Month": "มิ.ย. 69", "KTB Claim": 0.0, "MOPH Claim": 14910.0, "E-Claim": 0.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 14910.0 },
    { "Month": "ก.ค. 69", "KTB Claim": 0.0, "MOPH Claim": 460.0, "E-Claim": 0.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 460.0 },
    { "Month": "ต.ค. 69", "KTB Claim": 0.0, "MOPH Claim": 0.0, "E-Claim": 0.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 43280.0, "แพทย์แผนไทย": 0.0, "Total": 43280.0 },
    { "Month": "พ.ย. 69", "KTB Claim": 0.0, "MOPH Claim": 0.0, "E-Claim": 0.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 700.0, "แพทย์แผนไทย": 0.0, "Total": 700.0 }
  ],
  "05954": [
    { "Month": "ต.ค. 68", "KTB Claim": 1950.0, "MOPH Claim": 0.0, "E-Claim": 15893.5, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 17843.5 },
    { "Month": "พ.ย. 68", "KTB Claim": 1260.0, "MOPH Claim": 360.0, "E-Claim": 6358.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 7978.0 },
    { "Month": "ธ.ค. 68", "KTB Claim": 0.0, "MOPH Claim": 10440.0, "E-Claim": 1489.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 11929.0 },
    { "Month": "ม.ค. 69", "KTB Claim": 20.0, "MOPH Claim": 420.0, "E-Claim": 75189.5, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 75629.5 },
    { "Month": "ก.พ. 69", "KTB Claim": 0.0, "MOPH Claim": 12900.0, "E-Claim": 16876.5, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 29776.5 },
    { "Month": "มี.ค. 69", "KTB Claim": 7300.0, "MOPH Claim": 0.0, "E-Claim": 7340.5, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 14640.5 },
    { "Month": "เม.ย. 69", "KTB Claim": 3200.0, "MOPH Claim": 0.0, "E-Claim": 35906.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 39106.0 },
    { "Month": "พ.ค. 69", "KTB Claim": 0.0, "MOPH Claim": 160.0, "E-Claim": 11180.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 11340.0 },
    { "Month": "ต.ค. 69", "KTB Claim": 0.0, "MOPH Claim": 0.0, "E-Claim": 0.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 11200.0, "แพทย์แผนไทย": 0.0, "Total": 11200.0 }
  ],
  "05957": [
    { "Month": "ต.ค. 68", "KTB Claim": 0.0, "MOPH Claim": 0.0, "E-Claim": 1202.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 1202.0 },
    { "Month": "พ.ย. 68", "KTB Claim": 0.0, "MOPH Claim": 220.0, "E-Claim": 8067.5, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 8287.5 },
    { "Month": "ธ.ค. 68", "KTB Claim": 0.0, "MOPH Claim": 240.0, "E-Claim": 8331.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 8571.0 },
    { "Month": "ม.ค. 69", "KTB Claim": 1450.0, "MOPH Claim": 40.0, "E-Claim": 10500.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 11990.0 },
    { "Month": "ก.พ. 69", "KTB Claim": 0.0, "MOPH Claim": 16420.0, "E-Claim": 47283.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 63703.0 },
    { "Month": "มี.ค. 69", "KTB Claim": 1550.0, "MOPH Claim": 0.0, "E-Claim": 23704.5, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 25254.5 },
    { "Month": "เม.ย. 69", "KTB Claim": 0.0, "MOPH Claim": 100.0, "E-Claim": 57913.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 58013.0 },
    { "Month": "มิ.ย. 69", "KTB Claim": 0.0, "MOPH Claim": 13950.0, "E-Claim": 0.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 13950.0 }
  ],
  "05959": [
    { "Month": "ต.ค. 68", "KTB Claim": 0.0, "MOPH Claim": 0.0, "E-Claim": 4945.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 4945.0 },
    { "Month": "พ.ย. 68", "KTB Claim": 600.0, "MOPH Claim": 320.0, "E-Claim": 1456.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 2376.0 },
    { "Month": "ธ.ค. 68", "KTB Claim": 40.0, "MOPH Claim": 580.0, "E-Claim": 1605.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 2225.0 },
    { "Month": "ก.พ. 69", "KTB Claim": 0.0, "MOPH Claim": 17150.0, "E-Claim": 14694.5, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 31844.5 },
    { "Month": "มี.ค. 69", "KTB Claim": 0.0, "MOPH Claim": 0.0, "E-Claim": 6174.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 6174.0 },
    { "Month": "เม.ย. 69", "KTB Claim": 0.0, "MOPH Claim": 140.0, "E-Claim": 3867.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 4007.0 },
    { "Month": "ต.ค. 69", "KTB Claim": 0.0, "MOPH Claim": 0.0, "E-Claim": 0.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 10000.0, "แพทย์แผนไทย": 0.0, "Total": 10000.0 }
  ],
  "05962": [
    { "Month": "ต.ค. 68", "KTB Claim": 0.0, "MOPH Claim": 0.0, "E-Claim": 5864.5, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 5864.5 },
    { "Month": "พ.ย. 68", "KTB Claim": 5140.0, "MOPH Claim": 2370.0, "E-Claim": 5674.5, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 13184.5 },
    { "Month": "ธ.ค. 68", "KTB Claim": 0.0, "MOPH Claim": 1180.0, "E-Claim": 22697.5, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 23877.5 },
    { "Month": "ก.พ. 69", "KTB Claim": 1550.0, "MOPH Claim": 34565.0, "E-Claim": 45531.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 81646.0 },
    { "Month": "มี.ค. 69", "KTB Claim": 13050.0, "MOPH Claim": 0.0, "E-Claim": 38344.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 51394.0 },
    { "Month": "เม.ย. 69", "KTB Claim": 550.0, "MOPH Claim": 10490.0, "E-Claim": 16451.5, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 27491.5 },
    { "Month": "ต.ค. 69", "KTB Claim": 0.0, "MOPH Claim": 0.0, "E-Claim": 0.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 22080.0, "แพทย์แผนไทย": 0.0, "Total": 22080.0 }
  ],
  "05956": [
    { "Month": "พ.ย. 68", "KTB Claim": 0.0, "MOPH Claim": 0.0, "E-Claim": 50.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 50.0 },
    { "Month": "ธ.ค. 68", "KTB Claim": 0.0, "MOPH Claim": 0.0, "E-Claim": 134.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 134.0 }
  ]
};

const PAY_MATRIX_68 = {
  "ALL": [
    { "Month": "ต.ค. 67", "KTB Claim": 0.0, "MOPH Claim": 1320.0, "E-Claim": 2964.68, "ค่าบริการ CXR": 41700.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 45984.68 },
    { "Month": "พ.ย. 67", "KTB Claim": 0.0, "MOPH Claim": 2240.0, "E-Claim": 1870.47, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 4110.47 },
    { "Month": "ธ.ค. 67", "KTB Claim": 0.0, "MOPH Claim": 1140.0, "E-Claim": 2794.77, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 3934.77 },
    { "Month": "ม.ค. 68", "KTB Claim": 0.0, "MOPH Claim": 2200.0, "E-Claim": 3815.23, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 6015.23 },
    { "Month": "ก.พ. 68", "KTB Claim": 0.0, "MOPH Claim": 12605.0, "E-Claim": 3828.23, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 16433.23 },
    { "Month": "มี.ค. 68", "KTB Claim": 0.0, "MOPH Claim": 10220.0, "E-Claim": 33336.07, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 43556.07 },
    { "Month": "เม.ย. 68", "KTB Claim": 0.0, "MOPH Claim": 37050.0, "E-Claim": 3658.0, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 40708.0 },
    { "Month": "พ.ค. 68", "KTB Claim": 98110.0, "MOPH Claim": 39365.0, "E-Claim": 37315.01, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 174790.01 },
    { "Month": "มิ.ย. 68", "KTB Claim": 0.0, "MOPH Claim": 18790.0, "E-Claim": 53904.27, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 72694.27 },
    { "Month": "ก.ค. 68", "KTB Claim": 8270.0, "MOPH Claim": 3780.0, "E-Claim": 51078.01, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 63128.01 },
    { "Month": "ส.ค. 68", "KTB Claim": 13340.0, "MOPH Claim": 2280.0, "E-Claim": 23678.63, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 39298.63 },
    { "Month": "ก.ย. 68", "KTB Claim": 200.0, "MOPH Claim": 1210.0, "E-Claim": 10661.21, "ค่าบริการ CXR": 0.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 310339.04, "Total": 322410.25 },
    { "Month": "ต.ค. 68", "KTB Claim": 50.0, "MOPH Claim": 800.0, "E-Claim": 0.0, "ค่าบริการ CXR": 19020.0, "วัณโรค (TB)": 0.0, "แพทย์แผนไทย": 0.0, "Total": 19870.0 }
  ]
};

const PAYABLE_HOSP_OPTIONS = [
  { code: 'ALL', label: '🏢 ทุกหน่วยบริการ (ภาพรวม CUP สันโค้ง)' },
  { code: '05954', label: '05954 - รพ.สต.บ้านสันโค้ง' },
  { code: '05957', label: '05957 - รพ.สต.บ้านกอสะเรียม' },
  { code: '05959', label: '05959 - รพ.สต.บ้านแม่ผาแหน' },
  { code: '05962', label: '05962 - รพ.สต.บ้านต้นเปา' },
  { code: '05956', label: '05956 - รพ.สต.บ้านป่าตาล' },
];

/* ⚠️ ข้อสมมติ: กลุ่ม (c.group) ของรายการกายภาพบำบัดใน claims จริงไม่ทราบชื่อแน่ชัด
   จึงตรวจจับแบบ fuzzy match จากคำว่า "กายภาพ" หรือ "ฟื้นฟู" — ถ้าไม่ตรงกับชื่อ group จริงจาก API
   ให้แก้ไขคำค้นหาในนี้ */
const PHYSICAL_GROUP_KEYWORDS = ['กายภาพ', 'ฟื้นฟู'];
const isPhysicalGroup = (group) => {
  const g = String(group || '');
  return PHYSICAL_GROUP_KEYWORDS.some(k => g.includes(k));
};

/* ⚠️ ไม่มีฟิลด์ "นักกายภาพ" ใน claims จริง — สัดส่วนรายคนนี้เป็นการแบ่งยอดรวมตามสัดส่วนสมมติ (40/35/25%)
   เหมือนที่ทำใน dashboard_demo.html พอมีข้อมูลจริงรายคน ค่อยเปลี่ยนมาคำนวณจากข้อมูลจริงแทน */
const THERAPIST_SPLIT = [
  { id: 1, name: 'นักกายภาพบำบัด คนที่ 1', pct: 0.40, color: '#0369a1', bg: '#e0f2fe' },
  { id: 2, name: 'นักกายภาพบำบัด คนที่ 2', pct: 0.35, color: '#15803d', bg: '#dcfce7' },
  { id: 3, name: 'นักกายภาพบำบัด คนที่ 3', pct: 0.25, color: '#b45309', bg: '#fef3c7' },
];



const fmt = (n) => Math.round(n || 0).toLocaleString('th-TH');
const fmtD = (n) => (n || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ════════ LOGIN SCREEN ════════ */
const LoginScreen = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPulled, setIsPulled] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem('claimcup_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        setErrorMsg(data.message || 'รหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      setErrorMsg('เชื่อมต่อฐานข้อมูลไม่สำเร็จ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans transition-colors duration-1000 ${isPulled ? 'bg-slate-900' : 'bg-[#050505]'}`}>
      <div className="absolute inset-0 z-0 opacity-80">
        <WebThreads color1="#059669" color2="#34d399" color3="#ffffff" speed={0.4} threadCount={6} opacity={0.8} brightness={0.8} />
      </div>

      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-30">
        <div className="w-1.5 h-16 bg-slate-800"></div>
        <div className="w-32 h-12 bg-slate-800 rounded-t-[3rem] relative shadow-lg flex justify-center">
          <div className="absolute top-0 flex flex-col items-center group cursor-pointer" onClick={() => setIsPulled(true)}>
            <div className={`w-0.5 bg-slate-500 transition-all duration-500 origin-top ${isPulled ? 'h-6' : 'h-16 group-active:h-28'}`}></div>
            <div className={`w-4 h-4 bg-slate-500 rounded-full transition-all duration-500 ${isPulled ? 'scale-75' : 'group-active:scale-110'}`}></div>
          </div>
          <div className={`absolute -bottom-3 w-10 h-10 rounded-full transition-all duration-500 ${(isPulled) ? 'bg-emerald-400 shadow-[0_0_40px_15px_rgba(52,211,153,0.6)]' : 'bg-slate-800'}`}></div>
        </div>
      </div>
      {!isPulled && (
        <div className="absolute top-52 text-slate-300 animate-pulse text-sm font-bold tracking-widest z-20 flex flex-col items-center gap-2 drop-shadow-md">
          <span>👇</span><span>คลิกเพื่อเปิดระบบ</span>
        </div>
      )}

      <div className={`relative bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_25px_70px_-10px_rgba(5,150,105,0.4)] w-full max-w-md z-20 mt-24 transition-all duration-1000 ease-out transform border-2 border-emerald-400/50 ring-4 ring-emerald-500/10 ${isPulled ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-20 opacity-0 scale-95 pointer-events-none'}`}>
        <div className="text-center mb-8 flex flex-col items-center">
          <img src="/my-logo.png" alt="โลโก้ รพ.สต." className="w-32 h-32 mb-4 rounded-full object-cover shadow-[0_10px_30px_rgba(5,150,105,0.2)] bg-white border-4 border-emerald-100" />
          <h2 className="text-3xl font-black text-emerald-950 mb-1 tracking-tight">ClaimCup</h2>
          <p className="text-emerald-700 font-bold text-xs uppercase tracking-[0.25em]">Sankhong Portal</p>
          <div className="mt-4 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-bold text-emerald-800 shadow-sm flex items-center gap-1.5 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Reimbursement Tracking System
          </div>
        </div>

        {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold text-center border border-red-100">{errorMsg}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="text-gray-900 w-full px-4 py-3.5 rounded-2xl border-2 border-emerald-200/80 bg-white/90 focus:bg-white focus:border-emerald-500 outline-none transition-all font-medium text-sm" placeholder="Username" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-gray-900 w-full px-4 py-3.5 rounded-2xl border-2 border-emerald-200/80 bg-white/90 focus:bg-white focus:border-emerald-500 outline-none transition-all font-medium text-sm" placeholder="Password" required />
          <button type="submit" disabled={isLoading} className="w-full text-white font-black py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-[0_10px_25px_rgba(5,150,105,0.3)] tracking-wide text-sm">
            {isLoading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ════════ MAIN APP COMPONENT ════════ */
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('overview');
  const [currentYear, setCurrentYear] = useState('2569');
  const [currentHosp, setCurrentHosp] = useState('all');
  const [activeDetailTab, setActiveDetailTab] = useState('ppfs');
  const [payableHosp, setPayableHosp] = useState('ALL');
  const [payableYear, setPayableYear] = useState('69');
  const [therapistPopupId, setTherapistPopupId] = useState(null);

  const [claims, setClaims] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hospitalMap, setHospitalMap] = useState({ 'all': 'All Cup' });
  const [clockTime, setClockTime] = useState('');

  const donutChartRef = useRef(null);
  const donutCanvasRef = useRef(null);
  const expenseChartRef = useRef(null);
  const expenseCanvasRef = useRef(null);

  // Auto-Logout 30 mins[cite: 2]
  useEffect(() => {
    if (!currentUser) return;
    const INACTIVITY_TIME = 30 * 60 * 1000;
    let timeoutId;
    const handleAutoLogout = () => {
      localStorage.removeItem('claimcup_user');
      setCurrentUser(null);
      alert('🔒 ระบบได้ออกจากระบบอัตโนมัติ เนื่องจากไม่มีการใช้งานเป็นเวลานานครับ');
    };
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleAutoLogout, INACTIVITY_TIME);
    };
    resetTimer();
    const events = ['mousemove', 'mousedown', 'keypress', 'touchmove', 'scroll'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    return () => {
      clearTimeout(timeoutId);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [currentUser]);

  useEffect(() => {
    const saved = localStorage.getItem('claimcup_user');
    if (saved) {
      try { setCurrentUser(JSON.parse(saved)); } catch (e) { localStorage.removeItem('claimcup_user'); }
    }
  }, []);

  useEffect(() => {
    setClockTime(new Date().toLocaleTimeString('th-TH'));
    const t = setInterval(() => setClockTime(new Date().toLocaleTimeString('th-TH')), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resC, resE, resHos] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/api/claims`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/expenses`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/hospitals`).then(r => r.json()),
        ]);

        if (resC.status === 'fulfilled' && Array.isArray(resC.value)) setClaims(resC.value);
        if (resE.status === 'fulfilled' && Array.isArray(resE.value)) setExpenses(resE.value);
        if (resHos.status === 'fulfilled' && Array.isArray(resHos.value)) {
          const hMap = { 'all': 'All Cup' };
          resHos.value.forEach(h => {
            const code = String(h.hcode);
            // กรอง hcode 2 หลักออก (54, 56, 62) เอาเฉพาะ 5 หลัก
            if (code.length >= 5) {
              hMap[code] = h.name;
            }
          });
          setHospitalMap(hMap);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const selectedHospName = hospitalMap[currentHosp] || 'All Cup';

  const processedData = useMemo(() => {
    let totalAmt = 0;
    const hospTotals = {};
    const groupStats = {};

    // สร้าง hospTotals จาก hospitalMap (เฉพาะ 5 หลัก)
    Object.keys(hospitalMap).forEach(k => {
      if (k !== 'all') hospTotals[k] = 0;
    });

    claims.forEach(c => {
      const yr = String(c.fiscal_year || '');
      const hcode = String(c.hcode || '');
      const amt = parseFloat(String(c.amount || 0).replace(/,/g, '')) || 0;
      const group = String(c.group || 'อื่นๆ');

      // คำนวณยอดรวมทั้งหมด (filter ตามปีงบ + หน่วยบริการ)
      if (currentHosp === 'all' || hcode === currentHosp) {
        if (currentYear === 'all' || yr === currentYear) {
          totalAmt += amt;

          // คำนวณยอดแยกตาม group
          if (!groupStats[group]) {
            groupStats[group] = { total: 0, items: {}, topItem: '', topAmt: 0 };
          }
          groupStats[group].total += amt;
          const sItem = c.service_item || 'ไม่ระบุ';
          groupStats[group].items[sItem] = (groupStats[group].items[sItem] || 0) + amt;
          if (groupStats[group].items[sItem] > groupStats[group].topAmt) {
            groupStats[group].topAmt = groupStats[group].items[sItem];
            groupStats[group].topItem = sItem;
          }
        }
      }

      // คำนวณ hospTotals (filter ตามปีเท่านั้น)
      if (currentYear === 'all' || yr === currentYear) {
        if (hospTotals[hcode] !== undefined) {
          hospTotals[hcode] += amt;
        }
      }
    });

    // คำนวณ rankingList — Top 5 หน่วยบริการ (sort by amount)
    const rankingList = Object.entries(hospTotals)
      .map(([hcode, amount]) => {
        // นับจำนวนรายการ
        const itemCount = claims.filter(c => {
          const yr = String(c.fiscal_year || '');
          return String(c.hcode) === hcode && (currentYear === 'all' || yr === currentYear);
        }).length;
        return {
          hcode,
          name: hospitalMap[hcode] || hcode,
          amount,
          items: itemCount,
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // แปลง groupStats เป็น array sorted by total
    const groupCards = Object.entries(groupStats)
      .map(([group, data]) => ({
        group,
        total: data.total,
        topItem: data.topItem,
        topAmt: data.topAmt,
        itemCount: Object.keys(data.items).length,
      }))
      .sort((a, b) => b.total - a.total);

    return { totalAmt, hospTotals, rankingList, groupCards };
  }, [claims, currentYear, currentHosp, hospitalMap]);

  /* ⚠️ ข้อสมมติเรื่องชื่อฟิลด์: สมมติว่าแต่ละแถวใน `expenses` (จาก /api/expenses) มีรูปแบบ
     { category (ชื่อหมวดค่าใช้จ่าย), amount (ยอดเงิน), month (ชื่อเดือนภาษาไทย เช่น "ตุลาคม"), fiscal_year }
     คล้ายกับโครงสร้างของ claims — ถ้าฟิลด์จริงจาก API ชื่อไม่ตรง ปรับ mapping ตรงนี้ได้เลย */
  const expenseStats = useMemo(() => {
    const filtered = expenses.filter(e => {
      const yr = String(e.fiscal_year || e.year || '');
      return currentYear === 'all' || yr === currentYear;
    });

    let total = 0;
    const catMap = {};
    const monthMap = {};
    MONTHS_TH.forEach(m => { monthMap[m] = 0; });

    filtered.forEach(e => {
      const amt = parseFloat(String(e.amount || e.total || 0).replace(/,/g, '')) || 0;
      total += amt;

      const cat = e.category || e.expense_type || e.name || 'ไม่ระบุหมวด';
      catMap[cat] = (catMap[cat] || 0) + amt;

      // month field may come as short Thai month ("ต.ค.") or full name ("ตุลาคม") — try to match either
      const mRaw = String(e.month || '').trim();
      const shortMonth = MONTHS_TH.find(m => m === mRaw) ||
        MONTHS_TH[["ตุลาคม","พฤศจิกายน","ธันวาคม","มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน"].indexOf(mRaw)];
      if (shortMonth) monthMap[shortMonth] += amt;
    });

    const categories = Object.entries(catMap)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);

    const topCategory = categories[0] || { name: '-', amount: 0 };
    const monthlyEntries = MONTHS_TH.map(m => ({ month: m, amount: monthMap[m] }));
    const topMonth = monthlyEntries.reduce((a, b) => (b.amount > a.amount ? b : a), monthlyEntries[0] || { month: '-', amount: 0 });
    const monthsWithData = monthlyEntries.filter(m => m.amount > 0).length || 1;
    const avgPerMonth = total / monthsWithData;

    return { total, count: filtered.length, categories, monthlyEntries, topCategory, topMonth, avgPerMonth };
  }, [expenses, currentYear]);

  const payableStats = useMemo(() => {
    const filteredPayData = PAY_DATA.filter(r => payableHosp === 'ALL' || r.code === payableHosp);
    let p1 = 0, p2 = 0, ded = 0;
    filteredPayData.forEach(r => {
      p1 += r['รับเงินครั้งที่1'] || 0;
      p2 += r['รับเงินครั้งที่2'] || 0;
      ded += r['หักเงิน'] || 0;
    });
    const totalReceived = p1 + p2;
    const netRemain = totalReceived - ded;

    const m68List = PAY_MATRIX_68[payableHosp] || PAY_MATRIX_68['ALL'] || [];
    const m69List = PAY_MATRIX_69[payableHosp] || PAY_MATRIX_69['ALL'] || [];
    const sum68 = m68List.reduce((a, b) => a + (b.Total || 0), 0);
    const sum69 = m69List.reduce((a, b) => a + (b.Total || 0), 0);

    const matrixRows = payableYear === '69' ? m69List : m68List;
    const matrixTotal = matrixRows.reduce((acc, row) => {
      ['KTB Claim', 'MOPH Claim', 'E-Claim', 'ค่าบริการ CXR', 'วัณโรค (TB)', 'แพทย์แผนไทย', 'Total'].forEach(k => {
        acc[k] = (acc[k] || 0) + (row[k] || 0);
      });
      return acc;
    }, {});

    return { filteredPayData, p1, p2, ded, totalReceived, netRemain, sum68, sum69, matrixRows, matrixTotal };
  }, [payableHosp, payableYear]);

  const physicalStats = useMemo(() => {
    const rows = claims.filter(c => {
      const yr = String(c.fiscal_year || '');
      return isPhysicalGroup(c.group) && (currentYear === 'all' || yr === currentYear);
    });

    let total = 0;
    const hcodeMap = {};
    const serviceMap = {};

    rows.forEach(c => {
      const amt = parseFloat(String(c.amount || 0).replace(/,/g, '')) || 0;
      total += amt;

      const hcode = String(c.hcode || '');
      if (!hcodeMap[hcode]) hcodeMap[hcode] = { hcode, count: 0, amount: 0 };
      hcodeMap[hcode].count += 1;
      hcodeMap[hcode].amount += amt;

      const svc = c.service_item || 'ไม่ระบุ';
      if (!serviceMap[svc]) serviceMap[svc] = { name: svc, count: 0, amount: 0 };
      serviceMap[svc].count += 1;
      serviceMap[svc].amount += amt;
    });

    const hcodeBreakdown = Object.values(hcodeMap)
      .map(h => ({ ...h, name: hospitalMap[h.hcode] || h.hcode }))
      .sort((a, b) => b.amount - a.amount);

    const serviceBreakdown = Object.values(serviceMap).sort((a, b) => b.amount - a.amount);

    return { total, count: rows.length, hcodeBreakdown, serviceBreakdown };
  }, [claims, currentYear, hospitalMap]);

  useEffect(() => {
    if (currentView !== 'overview') return;

    if (donutCanvasRef.current) {
      if (donutChartRef.current) donutChartRef.current.destroy();
      
      // ใช้ข้อมูลจริงจาก hospTotals — dynamic labels จาก hospitalMap
      const hospEntries = Object.entries(processedData.hospTotals).filter(([, v]) => v > 0);
      const labels = hospEntries.map(([code]) => hospitalMap[code] || code);
      const values = hospEntries.map(([, v]) => v);
      const colors = ['#3b82f6', '#10b981', '#f97316', '#a855f7', '#ec4899'];

      donutChartRef.current = new Chart(donutCanvasRef.current, {
        type: 'doughnut',
        data: {
          labels: labels.length > 0 ? labels : ['ไม่มีข้อมูล'],
          datasets: [{
            data: values.length > 0 ? values : [1],
            backgroundColor: values.length > 0 ? colors.slice(0, values.length) : ['#e2e8f0'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: { legend: { display: false } }
        }
      });
    }

    return () => {
      if (donutChartRef.current) donutChartRef.current.destroy();
    };
  }, [currentView, processedData, hospitalMap]);

  useEffect(() => {
    if (currentView !== 'expenses') return;
    if (!expenseCanvasRef.current) return;

    if (expenseChartRef.current) expenseChartRef.current.destroy();
    expenseChartRef.current = new Chart(expenseCanvasRef.current, {
      type: 'bar',
      data: {
        labels: expenseStats.monthlyEntries.map(m => m.month),
        datasets: [{
          label: 'ยอดค่าใช้จ่าย',
          data: expenseStats.monthlyEntries.map(m => m.amount),
          backgroundColor: '#0284c7',
          borderRadius: 6,
          maxBarThickness: 40,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => `${fmt(ctx.parsed.y)} บาท` } },
        },
        scales: {
          y: { ticks: { callback: (v) => fmt(v) }, grid: { color: '#f1f5f9' } },
          x: { grid: { display: false } },
        },
      },
    });

    return () => {
      if (expenseChartRef.current) expenseChartRef.current.destroy();
    };
  }, [currentView, expenseStats]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#F4FAF7]"><div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div></div>;
  if (!currentUser) return <LoginScreen onLoginSuccess={setCurrentUser} />;

  return (
    <div className="flex w-screen min-h-screen bg-[#f8fafc] font-sans text-[#0f172a] overflow-x-hidden">
      
      {/* ═══ SIDEBAR (ซ่อน hcode 56, 54, 62 ตามสั่ง) ═══ */}
      <aside className="print:hidden w-[260px] bg-white border-r border-[#e2e8f0] flex flex-col shrink-0 sticky top-0 h-screen z-40">
        <div className="p-5 flex items-center gap-3 border-b border-[#e2e8f0]">
          <div className="w-[42px] h-[42px] rounded-full bg-white border border-[#e2e8f0] shadow-sm flex items-center justify-center">
            <Activity className="text-emerald-700" size={22} />
          </div>
          <div>
            <div className="text-[17px] font-black text-[#022c22] leading-tight">CLAIMCUP</div>
            <div className="text-[10px] text-[#059669] font-extrabold tracking-wider">SANKHONG PORTAL</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="text-[11.5px] font-bold text-[#64748b] mb-3 flex items-center gap-2">
              <Calendar size={15} className="text-[#10b981]" /> ปีงบประมาณ
            </div>
            <div className="flex bg-[#f1f5f9] p-1 rounded-full border border-[#e2e8f0]">
              {['2568', '2569', '2570'].map(yr => (
                <button key={yr} onClick={() => setCurrentYear(yr)} className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all ${currentYear === yr ? 'bg-[#064e3b] text-white shadow-sm' : 'text-[#64748b]'}`}>{yr}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11.5px] font-bold text-[#64748b] mb-3 flex items-center gap-2">
              <Building2 size={15} className="text-[#10b981]" /> หน่วยบริการ
            </div>
            <div className="flex flex-col gap-1.5">
              <button onClick={() => setCurrentHosp('all')} className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${currentHosp === 'all' ? 'bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] font-bold' : 'text-[#475569] hover:bg-[#f8fafc]'}`}>
                <span className="w-2 h-2 rounded-full bg-[#10b981]"></span> All Cup
              </button>
              {Object.entries(hospitalMap).filter(([k]) => k !== 'all').map(([code, name], idx) => {
                const colors = ['#3b82f6', '#10b981', '#f97316', '#ec4899', '#a855f7'];
                // ตัดรหัส hcode ออกจากชื่อในเมนูด้านข้างตามที่สั่ง
                const cleanName = name.replace(/^[0-9]+\s*[-–]?\s*/, '').replace(/รพ\.สต\./, 'รพ.สต.');
                return (
                  <button key={code} onClick={() => setCurrentHosp(code)} className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${currentHosp === code ? 'bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] font-bold' : 'text-[#475569] hover:bg-[#f8fafc]'}`}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }}></span> {cleanName}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#e2e8f0]">
            <div className="text-[11.5px] font-bold text-[#64748b] mb-3 flex items-center gap-2">
              <FileText size={15} className="text-[#10b981]" /> รายงาน & เอกสาร
            </div>
            <button onClick={() => setCurrentView('expenses')} className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-[#064e3b] text-white font-bold text-xs shadow-md mb-2.5 hover:bg-[#022c22] transition-all">
              <Wallet size={16} /> รายการสรุปค่าใช้จ่าย Cup
            </button>
            <button onClick={() => setCurrentView('payable')} className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-[#065f46] text-white font-bold text-xs shadow-md hover:bg-[#044734] transition-all">
              <Database size={16} /> รายงานพึ่งจ่าย
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-[#94a3b8]">
          <span>CLAIMCUP Portal</span>
          <button onClick={() => { localStorage.removeItem('claimcup_user'); setCurrentUser(null); }} className="text-red-500 font-bold flex items-center gap-1 hover:underline">
            <LogOut size={12} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        <header className="print:hidden bg-white border-b border-[#e2e8f0] px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Activity className="text-[#022c22]" size={26} />
            <div>
              <div className="text-2xl font-black text-[#022c22] tracking-tight">Health Claim Analytics</div>
              <div className="text-[11px] font-extrabold text-[#8da2b5] tracking-wider uppercase flex items-center gap-2 mt-0.5">
                <span>CUP SANKHONG DASHBOARD</span> • <span className="bg-[#cbfbe4] text-[#064e3b] px-2 py-0.5 rounded text-[10px]">{currentYear}</span> • <span className="text-[#b91c1c] font-black">{selectedHospName.toUpperCase()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#064e3b] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#34d399]" /> PUBLIC HEALTH APPROVED
            </div>
            <div className="text-xs font-bold text-[#475569] bg-white border border-[#e2e8f0] px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
              <Clock size={14} /> {clockTime}
            </div>
          </div>
        </header>

        {/* OVERVIEW VIEW */}
        {currentView === 'overview' && (
          <div className="p-8 max-w-[1560px] mx-auto w-full space-y-6">
            <div className="bg-gradient-to-br from-[#022c22] to-[#064e3b] rounded-3xl p-8 text-white shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-[#34d399] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#34d399]"></span> CUMULATIVE HEALTH DISBURSEMENT
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-[#34d399]">฿</span>
                  <span className="text-5xl font-black tracking-tight">{fmt(processedData.totalAmt)}</span>
                </div>
                <div className="text-sm font-semibold text-[#d1fae5] mb-2">ยอดเงินรวมเบิกชดเชยประจำปี {currentYear}</div>
                <div className="text-xs font-bold text-red-400">หน่วยบริการ: {selectedHospName}</div>
                <button onClick={() => setCurrentView('detail')} className="mt-4 bg-white/15 hover:bg-white/25 border border-white/25 px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2">
                  ดูรายละเอียดเจาะลึก 4 หมวด
                </button>
              </div>
              <div className="bg-white text-slate-900 rounded-2xl p-5 flex items-center justify-around shadow-md">
                <div className="relative w-32 h-32">
                  <canvas ref={donutCanvasRef}></canvas>
                </div>
                <div className="text-left space-y-1 text-xs font-semibold">
                  {Object.entries(hospitalMap).filter(([k]) => k !== 'all').map(([code, name], idx) => (
                    <div key={code} className="flex items-center gap-2 cursor-pointer hover:text-emerald-700" onClick={() => setCurrentHosp(code)}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#3b82f6', '#10b981', '#f97316', '#ec4899', '#a855f7'][idx] }}></span>
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {processedData.groupCards.length > 0 ? processedData.groupCards.slice(0, 4).map((card, idx) => {
                const borderColors = ['#0284c7', '#8b5cf6', '#f59e0b', '#10b981'];
                const textColors = ['#0369a1', '#7c3aed', '#d97706', '#059669'];
                return (
                  <div key={card.group} onClick={() => { if (isPhysicalGroup(card.group)) { setCurrentView('physical'); } else { setActiveDetailTab(card.group); setCurrentView('detail'); } }} className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4" style={{ borderLeftColor: borderColors[idx % 4] }}>
                    <div className="text-xs font-bold text-[#475569] mb-1">{card.group} ปี {currentYear.slice(2)}</div>
                    <div className="text-2xl font-black text-[#0f172a] mb-2">{fmtD(card.total)}</div>
                    <div className="text-[11px] font-semibold" style={{ color: textColors[idx % 4] }}>สูงสุด: {card.topItem} (฿{fmt(card.topAmt)})</div>
                  </div>
                );
              }) : (
                <div className="col-span-4 bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm text-center text-slate-400 font-bold">
                  ไม่มีข้อมูลสำหรับปีงบประมาณ {currentYear}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="font-black text-base text-[#0f172a] flex items-center gap-2">
                  <Trophy size={18} className="text-amber-500" /> การจัดลำดับ 1-5 ภายในเครือข่าย CUP สันโค้ง
                </div>
                <span className="text-[11px] font-bold bg-[#fef3c7] text-[#b45309] px-3 py-1 rounded-full border border-[#fde68a]">Top 5 Internal Ranking — ปี {currentYear}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {processedData.rankingList.map((item, idx) => (
                  <div key={item.hcode} onClick={() => setCurrentHosp(item.hcode)} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500 cursor-pointer transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">อันดับ {idx + 1}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{fmt(item.items)} รายการ</span>
                    </div>
                    <div className="font-bold text-sm text-slate-800">{item.name}</div>
                    <div className="text-[10px] text-slate-400 mb-3">{item.hcode}</div>
                    <div className="pt-2 border-t border-slate-200">
                      <div className="text-[10px] text-slate-400">ยอดชดเชย</div>
                      <div className="text-base font-black text-emerald-900">฿{fmt(item.amount)}</div>
                    </div>
                  </div>
                ))}
                {processedData.rankingList.length === 0 && (
                  <div className="col-span-5 text-center text-slate-400 font-bold py-4">ไม่มีข้อมูล</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* EXPENSES VIEW */}
        {currentView === 'expenses' && (
          <div className="p-8 max-w-[1400px] mx-auto w-full space-y-6">
            <div className="print:hidden flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">รายการสรุปค่าใช้จ่าย Cup บ้านสันโค้ง</h2>
                <p className="text-sm text-slate-500">สรุปค่าใช้จ่ายดำเนินงานประจำปีงบประมาณ {currentYear}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="px-5 py-2 bg-sky-700 text-white rounded-full text-xs font-bold flex items-center gap-2 hover:bg-sky-800 transition-all">
                  <Printer size={16} /> พิมพ์รายงาน
                </button>
                <button onClick={() => setCurrentView('overview')} className="px-5 py-2 bg-slate-900 text-white rounded-full text-xs font-bold flex items-center gap-2">
                  <ArrowLeft size={16} /> กลับหน้าหลัก
                </button>
              </div>
            </div>

            {/* หัวเรื่องสำหรับตอนพิมพ์เท่านั้น */}
            <div className="hidden print:block mb-4">
              <h2 className="text-xl font-black text-slate-900">รายการสรุปค่าใช้จ่าย Cup บ้านสันโค้ง — ปีงบประมาณ {currentYear}</h2>
            </div>

            {/* KPI การ์ด 4 ใบ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm border-l-4" style={{ borderLeftColor: '#0284c7' }}>
                <div className="text-xs font-bold text-slate-500 mb-1">ยอดค่าใช้จ่ายรวมทั้งหมด</div>
                <div className="text-2xl font-black text-slate-900">฿{fmtD(expenseStats.total)}</div>
                <div className="text-[11px] font-semibold text-slate-400 mt-1">{fmt(expenseStats.count)} รายการ</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm border-l-4" style={{ borderLeftColor: '#8b5cf6' }}>
                <div className="text-xs font-bold text-slate-500 mb-1">หมวดค่าใช้จ่ายสูงสุด</div>
                <div className="text-lg font-black text-slate-900 truncate" title={expenseStats.topCategory.name}>{expenseStats.topCategory.name}</div>
                <div className="text-[11px] font-semibold text-violet-600 mt-1">฿{fmt(expenseStats.topCategory.amount)}</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm border-l-4" style={{ borderLeftColor: '#f59e0b' }}>
                <div className="text-xs font-bold text-slate-500 mb-1">เดือนที่ค่าใช้จ่ายสูงสุด</div>
                <div className="text-lg font-black text-slate-900">{expenseStats.topMonth.month}</div>
                <div className="text-[11px] font-semibold text-amber-600 mt-1">฿{fmt(expenseStats.topMonth.amount)}</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm border-l-4" style={{ borderLeftColor: '#10b981' }}>
                <div className="text-xs font-bold text-slate-500 mb-1">เฉลี่ยค่าใช้จ่ายต่อเดือน</div>
                <div className="text-2xl font-black text-slate-900">฿{fmt(expenseStats.avgPerMonth)}</div>
              </div>
            </div>

            {/* กราฟแนวโน้มรายเดือน */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm print:shadow-none print:border-slate-300">
              <h3 className="font-bold text-slate-800 mb-4">แนวโน้มค่าใช้จ่ายรายเดือน</h3>
              <div className="relative h-[280px] w-full">
                <canvas ref={expenseCanvasRef}></canvas>
              </div>
            </div>

            {/* ตารางสรุปแยกตามหมวดค่าใช้จ่าย */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm print:shadow-none print:border-slate-300">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="font-bold text-slate-800">ตารางสรุปแยกตามหมวดค่าใช้จ่าย</h3>
              </div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-3">#</th>
                    <th className="p-3">หมวดค่าใช้จ่าย</th>
                    <th className="p-3 text-right">ยอดรวม (บาท)</th>
                    <th className="p-3 text-left w-[220px]">สัดส่วน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenseStats.categories.length > 0 ? expenseStats.categories.map((c, idx) => {
                    const pct = expenseStats.total > 0 ? (c.amount / expenseStats.total * 100) : 0;
                    return (
                      <tr key={c.name} className="hover:bg-slate-50">
                        <td className="p-3 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="p-3 font-semibold text-slate-800">{c.name}</td>
                        <td className="p-3 text-right font-black text-slate-900">{fmtD(c.amount)}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden print:hidden">
                              <div className="h-full bg-sky-600" style={{ width: `${pct}%` }}></div>
                            </div>
                            <span className="text-[11px] font-bold text-sky-700 min-w-[38px]">{pct.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan={4} className="p-6 text-center text-slate-400 font-bold">ไม่มีข้อมูลค่าใช้จ่ายสำหรับปีงบประมาณ {currentYear}</td></tr>
                  )}
                </tbody>
                {expenseStats.categories.length > 0 && (
                  <tfoot>
                    <tr className="bg-slate-100 font-black">
                      <td className="p-3" colSpan={2}>รวมทั้งหมด</td>
                      <td className="p-3 text-right">{fmtD(expenseStats.total)}</td>
                      <td className="p-3 text-slate-400 font-semibold text-[11px]">100%</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        )}

        {/* PAYABLE VIEW */}
        {currentView === 'payable' && (
          <div className="p-8 max-w-[1400px] mx-auto w-full space-y-6">
            <div className="print:hidden flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">รายงานพึ่งจ่าย (งบกองทุนและชดเชย)</h2>
                <p className="text-sm text-slate-500">สรุปยอดจัดสรรเงิน การจ่ายเงิน และที่มาของ Statement ประจำปีงบประมาณ 2568-2569</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="px-5 py-2 bg-white text-slate-700 border border-slate-300 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-slate-100 transition-all">
                  <Printer size={16} /> พิมพ์รายงาน
                </button>
                <button onClick={() => setCurrentView('overview')} className="px-5 py-2 bg-slate-900 text-white rounded-full text-xs font-bold flex items-center gap-2">
                  <ArrowLeft size={16} /> กลับหน้าหลัก
                </button>
              </div>
            </div>

            <div className="hidden print:block mb-4">
              <h2 className="text-xl font-black text-slate-900">รายงานพึ่งจ่าย (งบกองทุนและชดเชย) — {PAYABLE_HOSP_OPTIONS.find(h => h.code === payableHosp)?.label}</h2>
            </div>

            {/* Filter Bar */}
            <div className="print:hidden bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-slate-700">เลือกหน่วยบริการ:</span>
                <select value={payableHosp} onChange={(e) => setPayableHosp(e.target.value)} className="px-4 py-2 rounded-lg border-[1.5px] border-slate-300 bg-slate-50 text-sm font-bold text-slate-800 min-w-[300px] outline-none cursor-pointer">
                  {PAYABLE_HOSP_OPTIONS.map(h => (
                    <option key={h.code} value={h.code}>{h.label}</option>
                  ))}
                </select>
              </div>
              <div className="text-xs text-slate-500 font-semibold">ปรับยอดและตารางอัตโนมัติตามหน่วยบริการที่เลือก</div>
            </div>

            {/* KPI การ์ด 4 ใบ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm border-l-4" style={{ borderLeftColor: '#10B981' }}>
                <div className="text-xs font-bold text-slate-500 mb-1">ยอดเงินรวม ปีงบ 2568</div>
                <div className="text-[11px] text-slate-400 mb-2">Statement ปีงบ 2568</div>
                <div className="text-xl font-black" style={{ color: '#065F46' }}>฿{fmtD(payableStats.sum68)}</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm border-l-4" style={{ borderLeftColor: '#2563EB' }}>
                <div className="text-xs font-bold text-slate-500 mb-1">ยอดเงินรวม ปีงบ 2569</div>
                <div className="text-[11px] text-slate-400 mb-2">Statement ปีงบ 2569</div>
                <div className="text-xl font-black" style={{ color: '#1E40AF' }}>฿{fmtD(payableStats.sum69)}</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm border-l-4" style={{ borderLeftColor: '#F59E0B' }}>
                <div className="text-xs font-bold text-slate-500 mb-1">ยอดรับเงินรวม (ครั้งที่ 1 + 2)</div>
                <div className="text-[11px] text-slate-400 mb-2">งวด 1: ฿{fmt(payableStats.p1)} | งวด 2: ฿{fmt(payableStats.p2)}</div>
                <div className="text-xl font-black" style={{ color: '#B45309' }}>฿{fmtD(payableStats.totalReceived)}</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm border-l-4" style={{ borderLeftColor: '#0F172A' }}>
                <div className="text-xs font-bold text-slate-500 mb-1">ยอดเงินคงเหลือสุทธิ</div>
                <div className="text-[11px] text-slate-400 mb-2">(รับเงิน 1+2) - หักเงิน</div>
                <div className="text-xl font-black text-slate-900">฿{fmtD(payableStats.netRemain)}</div>
              </div>
            </div>

            {/* Section 1: ตารางสรุปการจ่ายเงินและยอดหักชดเชย */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm print:shadow-none print:border-slate-300">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">ตารางสรุปการจ่ายเงินและยอดหักชดเชย (แยกตามหน่วยบริการ)</h3>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">ยอดจัดสรรจริง</span>
              </div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-3">หน่วยบริการ</th>
                    <th className="p-3 text-right">รับเงินครั้งที่ 1 (บาท)</th>
                    <th className="p-3 text-right">รับเงินครั้งที่ 2 (บาท)</th>
                    <th className="p-3 text-right text-red-600">หักเงิน (บาท)</th>
                    <th className="p-3 text-right font-black text-emerald-800 bg-emerald-50">ยอดสุทธิ (บาท)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payableStats.filteredPayData.map(r => (
                    <tr key={r.code} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-800">{r['หน่วยบริการ']}</td>
                      <td className="p-3 text-right text-slate-600">{r['รับเงินครั้งที่1'] > 0 ? fmtD(r['รับเงินครั้งที่1']) : '—'}</td>
                      <td className="p-3 text-right text-slate-600">{r['รับเงินครั้งที่2'] > 0 ? fmtD(r['รับเงินครั้งที่2']) : '—'}</td>
                      <td className={`p-3 text-right ${r['หักเงิน'] > 0 ? 'text-red-600 font-bold' : 'text-slate-400'}`}>{r['หักเงิน'] > 0 ? fmtD(r['หักเงิน']) : '—'}</td>
                      <td className="p-3 text-right font-black text-emerald-800 bg-emerald-50/50">{r['ยอดสุทธิ'] > 0 ? fmtD(r['ยอดสุทธิ']) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-black">
                    <td className="p-3 text-slate-900">รวมทั้งหมด ({payableStats.filteredPayData.length} หน่วยบริการ)</td>
                    <td className="p-3 text-right text-slate-900">{fmtD(payableStats.p1)}</td>
                    <td className="p-3 text-right text-slate-900">{fmtD(payableStats.p2)}</td>
                    <td className="p-3 text-right text-red-600">{fmtD(payableStats.ded)}</td>
                    <td className="p-3 text-right text-emerald-800 bg-emerald-50">{fmtD(payableStats.netRemain)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Section 2: Statement Matrix รายเดือนตามหมวด */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm print:shadow-none print:border-slate-300">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center flex-wrap gap-3">
                <div>
                  <h3 className="font-bold text-slate-800">สรุปที่มาของเงินรายเดือนแยกตามหมวด (Statement Matrix)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">แสดงข้อมูล: {PAYABLE_HOSP_OPTIONS.find(h => h.code === payableHosp)?.label}</p>
                </div>
                <div className="print:hidden flex gap-2">
                  <button onClick={() => setPayableYear('69')} className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${payableYear === '69' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-500 border-slate-300'}`}>📅 ปีงบประมาณ 2569</button>
                  <button onClick={() => setPayableYear('68')} className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${payableYear === '68' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-500 border-slate-300'}`}>📅 ปีงบประมาณ 2568</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b-2 border-slate-200">
                      <th className="p-3">เดือน</th>
                      <th className="p-3 text-right">KTB Claim</th>
                      <th className="p-3 text-right">MOPH Claim</th>
                      <th className="p-3 text-right">E-Claim (OP)</th>
                      <th className="p-3 text-right">ค่าบริการ CXR</th>
                      <th className="p-3 text-right">วัณโรค (TB)</th>
                      <th className="p-3 text-right">แพทย์แผนไทย</th>
                      <th className="p-3 text-right font-black bg-blue-50 text-blue-800">ยอดรวมรายเดือน (บาท)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payableStats.matrixRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-700">{row.Month}</td>
                        <td className="p-3 text-right text-slate-600">{row['KTB Claim'] > 0 ? fmtD(row['KTB Claim']) : '—'}</td>
                        <td className="p-3 text-right text-slate-600">{row['MOPH Claim'] > 0 ? fmtD(row['MOPH Claim']) : '—'}</td>
                        <td className="p-3 text-right text-slate-600">{row['E-Claim'] > 0 ? fmtD(row['E-Claim']) : '—'}</td>
                        <td className="p-3 text-right text-slate-600">{row['ค่าบริการ CXR'] > 0 ? fmtD(row['ค่าบริการ CXR']) : '—'}</td>
                        <td className="p-3 text-right text-slate-600">{row['วัณโรค (TB)'] > 0 ? fmtD(row['วัณโรค (TB)']) : '—'}</td>
                        <td className="p-3 text-right text-slate-600">{row['แพทย์แผนไทย'] > 0 ? fmtD(row['แพทย์แผนไทย']) : '—'}</td>
                        <td className="p-3 text-right font-black text-blue-900 bg-blue-50/50">{fmtD(row.Total)}</td>
                      </tr>
                    ))}
                    {payableStats.matrixRows.length === 0 && (
                      <tr><td colSpan={8} className="p-6 text-center text-slate-400 font-bold">ไม่มีข้อมูล</td></tr>
                    )}
                  </tbody>
                  {payableStats.matrixRows.length > 0 && (
                    <tfoot>
                      <tr className="bg-slate-100 font-black">
                        <td className="p-3 text-slate-900">รวมทั้งหมด</td>
                        <td className="p-3 text-right">{fmtD(payableStats.matrixTotal['KTB Claim'])}</td>
                        <td className="p-3 text-right">{fmtD(payableStats.matrixTotal['MOPH Claim'])}</td>
                        <td className="p-3 text-right">{fmtD(payableStats.matrixTotal['E-Claim'])}</td>
                        <td className="p-3 text-right">{fmtD(payableStats.matrixTotal['ค่าบริการ CXR'])}</td>
                        <td className="p-3 text-right">{fmtD(payableStats.matrixTotal['วัณโรค (TB)'])}</td>
                        <td className="p-3 text-right">{fmtD(payableStats.matrixTotal['แพทย์แผนไทย'])}</td>
                        <td className="p-3 text-right text-blue-900 bg-blue-50">{fmtD(payableStats.matrixTotal['Total'])}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PHYSICAL THERAPY VIEW (แสดง hcode รหัสหน่วยบริการครบถ้วนที่นี่) */}
        {currentView === 'physical' && (
          <div className="p-8 max-w-[1400px] mx-auto w-full space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">แดชบอร์ดบริการฟื้นฟูสมรรถภาพ & กายภาพบำบัด</h2>
                <p className="text-sm text-slate-500">สรุปข้อมูลการเบิกจ่ายและชดเชยค่าบริการกายภาพบำบัด ปี {currentYear}</p>
              </div>
              <button onClick={() => setCurrentView('overview')} className="px-5 py-2 bg-slate-900 text-white rounded-full text-xs font-bold flex items-center gap-2">
                <ArrowLeft size={16} /> กลับหน้าหลัก
              </button>
            </div>

            <div className="bg-gradient-to-r from-sky-600 to-cyan-700 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center flex-wrap gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-sky-200">ยอดเบิกรวมทั้ง CUP สันโค้ง — ปีงบ {currentYear}</div>
                <div className="text-3xl font-black mt-1">{fmtD(physicalStats.total)} บาท</div>
                <div className="text-xs text-sky-100 mt-1">ให้บริการโดยนักกายภาพบำบัดกลาง 3 คน ครอบคลุมทุกหน่วยบริการ (ไม่แยกยอดตามหน่วยบริการ)</div>
              </div>
              <div className="flex gap-6 text-right text-sm font-semibold">
                <div><span>จำนวนรายการ</span><div className="text-xl font-bold">{fmt(physicalStats.count)} รายการ</div></div>
              </div>
            </div>

            {/* 3 การ์ดผลงานรายบุคคล */}
            <div>
              <div className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
                <Activity size={16} className="text-sky-600" /> ผลงานรายบุคคล — นักกายภาพบำบัด (ปีงบ {currentYear})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {THERAPIST_SPLIT.map(t => {
                  const amt = physicalStats.total * t.pct;
                  const qty = Math.round(physicalStats.count * t.pct);
                  return (
                    <div key={t.id} onClick={() => setTherapistPopupId(t.id)} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm" style={{ background: t.bg, color: t.color }}>{t.id}</div>
                        <div>
                          <div className="font-bold text-sm text-slate-900 hover:underline" style={{ color: t.color }}>{t.name}</div>
                          <div className="text-[11px] text-slate-400">ชื่อ-สกุล (กรอกข้อมูลจริง)</div>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between"><span className="text-slate-500">จำนวนรายการ</span><span className="font-bold text-slate-900">{fmt(qty)} รายการ</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">ยอดเบิก</span><span className="font-bold text-slate-900">฿{fmt(amt)}</span></div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-semibold">สัดส่วนของยอดรวม CUP</span>
                        <span className="font-black" style={{ color: t.color }}>{Math.round(t.pct * 100)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ตารางแยกตามประเภทบริการ */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="font-bold text-slate-800">ตารางแยกตามประเภทการให้บริการ</h3>
              </div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-3">ประเภทบริการ</th>
                    <th className="p-3 text-right">จำนวนรายการ</th>
                    <th className="p-3 text-right">ยอดเบิก (บาท)</th>
                    <th className="p-3 text-left w-[200px]">สัดส่วน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {physicalStats.serviceBreakdown.length > 0 ? physicalStats.serviceBreakdown.map(s => {
                    const pct = physicalStats.total > 0 ? (s.amount / physicalStats.total * 100) : 0;
                    return (
                      <tr key={s.name} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800">{s.name}</td>
                        <td className="p-3 text-right text-slate-600">{fmt(s.count)}</td>
                        <td className="p-3 text-right font-black text-slate-900">{fmtD(s.amount)}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-sky-600" style={{ width: `${pct}%` }}></div></div>
                            <span className="text-[11px] font-bold text-sky-700 min-w-[36px]">{pct.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan={4} className="p-6 text-center text-slate-400 font-bold">ไม่มีข้อมูลสำหรับปีงบประมาณ {currentYear}</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ตารางแสดงรายละเอียดพร้อม hcode */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4">ตารางแสดงหน่วยบริการและรหัสสถานบริการ (Hcode View)</h3>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-3">HCODE</th>
                    <th className="p-3">ชื่อหน่วยบริการ</th>
                    <th className="p-3 text-right">จำนวนรายการ</th>
                    <th className="p-3 text-right">ยอดชดเชย (บาท)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {physicalStats.hcodeBreakdown.length > 0 ? physicalStats.hcodeBreakdown.map((row) => (
                    <tr key={row.hcode} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-sky-700">{row.hcode}</td>
                      <td className="p-3 font-semibold text-slate-800">{row.name}</td>
                      <td className="p-3 text-right text-slate-600">{fmt(row.count)}</td>
                      <td className="p-3 text-right font-black text-slate-900">฿{fmtD(row.amount)}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="p-6 text-center text-slate-400 font-bold">ไม่มีข้อมูลสำหรับปีงบประมาณ {currentYear}</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Popup รายละเอียดนักกายภาพ */}
            {therapistPopupId && (() => {
              const t = THERAPIST_SPLIT.find(x => x.id === therapistPopupId);
              const tAmt = physicalStats.total * t.pct;
              const tQty = Math.round(physicalStats.count * t.pct);
              return (
                <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setTherapistPopupId(null); }}>
                  <div className="bg-white rounded-2xl w-[420px] max-w-[92vw] max-h-[85vh] overflow-y-auto shadow-2xl">
                    <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm" style={{ background: t.bg, color: t.color }}>{t.id}</div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">{t.name}</div>
                          <div className="text-[11px] text-slate-400">รายละเอียดการให้บริการ · ปีงบ {currentYear}</div>
                        </div>
                      </div>
                      <button onClick={() => setTherapistPopupId(null)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">✕</button>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-slate-50 rounded-xl p-3">
                          <div className="text-[11px] text-slate-500 font-semibold">จำนวนรายการรวม</div>
                          <div className="text-lg font-black text-slate-900 mt-0.5">{fmt(tQty)} รายการ</div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <div className="text-[11px] text-slate-500 font-semibold">ยอดเบิกรวม</div>
                          <div className="text-lg font-black text-slate-900 mt-0.5">฿{fmt(tAmt)}</div>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-slate-700 mb-2">แยกตามประเภทบริการ</div>
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="text-left py-1.5 text-[10.5px] text-slate-400 font-bold uppercase">บริการ</th>
                            <th className="text-right py-1.5 text-[10.5px] text-slate-400 font-bold uppercase">รายการ</th>
                            <th className="text-right py-1.5 text-[10.5px] text-slate-400 font-bold uppercase">บาท</th>
                          </tr>
                        </thead>
                        <tbody>
                          {physicalStats.serviceBreakdown.map(s => (
                            <tr key={s.name} className="border-b border-slate-50">
                              <td className="py-2 font-semibold text-slate-700">{s.name}</td>
                              <td className="py-2 text-right text-slate-500">{fmt(Math.round(s.count * t.pct))}</td>
                              <td className="py-2 text-right font-bold text-slate-900">{fmtD(s.amount * t.pct)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="mt-4 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex gap-1.5">
                        <span>⚠️</span>
                        <span>ตัวเลขรายบุคคลเป็นตัวอย่างที่แบ่งตามสัดส่วน ยังไม่ใช่ข้อมูลจริงรายคน</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* DETAIL VIEW */}
        {currentView === 'detail' && (
          <div className="p-8 max-w-[1500px] mx-auto w-full space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setCurrentView('overview')} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-100">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">เจาะลึกรายได้และรายการบริการ</h2>
                  <p className="text-sm text-slate-500">ตรวจสอบรายละเอียดรายกิจกรรมและหน่วยบริการ</p>
                </div>
              </div>
              <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 flex-wrap">
                {processedData.groupCards.map(card => (
                  <button key={card.group} onClick={() => setActiveDetailTab(card.group)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeDetailTab === card.group ? 'bg-emerald-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                    {card.group}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#16121b] border border-amber-500/20 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg">
              <div>
                <span className="text-[11px] font-bold bg-amber-500/20 text-yellow-300 px-2.5 py-1 rounded border border-amber-500/30">แหล่งข้อมูลจริงจากระบบ</span>
                <h3 className="text-xl font-black mt-2">หมวดหมู่: {activeDetailTab}</h3>
                <p className="text-xs text-slate-300 mt-1">ข้อมูลเชิงลึกการเบิกจ่ายชดเชยของเครือข่าย CUP สันโค้ง — หน่วยบริการ: {selectedHospName}</p>
              </div>
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-4 text-right">
                <div className="text-[11px] text-slate-400 font-bold uppercase">ยอดเงินรวม ปี {currentYear}</div>
                <div className="text-2xl font-black text-amber-400 mt-0.5">฿{fmtD(processedData.groupCards.find(g => g.group === activeDetailTab)?.total || 0)}</div>
              </div>
            </div>

            {/* แสดงรายการบริการทั้งหมดใน group ที่เลือก */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Layers size={18} className="text-emerald-600" /> รายการบริการในหมวด {activeDetailTab}
              </h3>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-3">#</th>
                    <th className="p-3">รายการบริการ</th>
                    <th className="p-3 text-right">จำนวน (Qty)</th>
                    <th className="p-3 text-right">ยอดชดเชย (บาท)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {claims
                    .filter(c => {
                      const yr = String(c.fiscal_year || '');
                      const hcode = String(c.hcode || '');
                      const group = String(c.group || 'อื่นๆ');
                      return group === activeDetailTab
                        && (currentYear === 'all' || yr === currentYear)
                        && (currentHosp === 'all' || hcode === currentHosp);
                    })
                    .sort((a, b) => (parseFloat(String(b.amount || 0).replace(/,/g, '')) || 0) - (parseFloat(String(a.amount || 0).replace(/,/g, '')) || 0))
                    .map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="p-3 font-semibold text-slate-800">{item.service_item || 'ไม่ระบุ'}</td>
                        <td className="p-3 text-right text-slate-600">{fmt(item.quantity || 0)}</td>
                        <td className="p-3 text-right font-black text-slate-900">฿{fmtD(parseFloat(String(item.amount || 0).replace(/,/g, '')) || 0)}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}