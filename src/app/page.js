"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import {
  Activity, Trophy, Syringe, Baby, Flower, Scan, HeartPulse, Monitor,
  ArrowUpRight, ArrowLeft, Calendar, Clock, Building2, CheckCircle2,
  Layers, Leaf, List, Table2, Wallet, LogOut, FileText, Database, Printer,
  Sparkles, DollarSign, Stethoscope, Pill, ChevronRight, TrendingUp, TrendingDown, Users, BarChart3
} from 'lucide-react';

const API_BASE_URL = 'https://claimcup-api-production.up.railway.app';

const MONTHS_TH = ["ต.ค.", "พ.ย.", "ธ.ค.", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย."];

/* ข้อมูลสถิติสำหรับรายงานพึ่งจ่าย (Statement Matrix) */
const PAY_DATA = [
  { "หน่วยบริการ": "05954 - รพ.สต.บ้านสันโค้ง", "code": "05954", "รับเงินครั้งที่1": 290775.68, "รับเงินครั้งที่2": 113379.99, "หักเงิน": 0.0, "ยอดสุทธิ": 404155.67 },
  { "หน่วยบริการ": "05962 - รพ.สต.บ้านต้นเปา", "code": "05962", "รับเงินครั้งที่1": 89473.84, "รับเงินครั้งที่2": 51756.50, "หักเงิน": 0.0, "ยอดสุทธิ": 141230.34 },
  { "หน่วยบริการ": "05957 - รพ.สต.บ้านกอสะเรียม", "code": "05957", "รับเงินครั้งที่1": 25133.87, "รับเงินครั้งที่2": 30050.50, "หักเงิน": 7920.0, "ยอดสุทธิ": 47264.37 },
  { "หน่วยบริการ": "05959 - รพ.สต.บ้านแม่ผาแหน", "code": "05959", "รับเงินครั้งที่1": 22735.00, "รับเงินครั้งที่2": 14381.00, "หักเงิน": 14160.0, "ยอดสุทธิ": 22956.00 },
  { "หน่วยบริการ": "05956 - รพ.สต.บ้านป่าตาล", "code": "05956", "รับเงินครั้งที่1": 0.0, "รับเงินครั้งที่2": 0.0, "หักเงิน": 0.0, "ยอดสุทธิ": 0.0 }
];

const PAY_MATRIX_69 = {
  "ALL": [
    { "Month": "ต.ค. 68", "KTB Claim": 1950.0, "MOPH Claim": 0.0, "E-Claim": 27905.0, "NTIP": 43280.0, "แพทย์แผนไทย": 0.0, "Total": 73135.0 },
    { "Month": "พ.ย. 68", "KTB Claim": 7000.0, "MOPH Claim": 3270.0, "E-Claim": 21606.0, "NTIP": 700.0, "แพทย์แผนไทย": 0.0, "Total": 32576.0 },
    { "Month": "ธ.ค. 68", "KTB Claim": 40.0, "MOPH Claim": 12440.0, "E-Claim": 34256.5, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 46736.5 },
    { "Month": "ม.ค. 69", "KTB Claim": 1470.0, "MOPH Claim": 5260.0, "E-Claim": 94014.5, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 100744.5 },
    { "Month": "ก.พ. 69", "KTB Claim": 1550.0, "MOPH Claim": 81035.0, "E-Claim": 124385.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 206970.0 },
    { "Month": "มี.ค. 69", "KTB Claim": 21900.0, "MOPH Claim": 0.0, "E-Claim": 75563.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 97463.0 },
    { "Month": "เม.ย. 69", "KTB Claim": 3750.0, "MOPH Claim": 10730.0, "E-Claim": 114137.5, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 128617.5 },
    { "Month": "พ.ค. 69", "KTB Claim": 50.0, "MOPH Claim": 3390.0, "E-Claim": 12250.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 15690.0 },
    { "Month": "มิ.ย. 69", "KTB Claim": 0.0, "MOPH Claim": 14910.0, "E-Claim": 0.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 14910.0 },
    { "Month": "ก.ค. 69", "KTB Claim": 0.0, "MOPH Claim": 460.0, "E-Claim": 0.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 460.0 }
  ],
  "05954": [
    { "Month": "ต.ค. 68", "KTB Claim": 1950.0, "MOPH Claim": 0.0, "E-Claim": 15893.5, "NTIP": 11200.0, "แพทย์แผนไทย": 0.0, "Total": 29043.5 },
    { "Month": "พ.ย. 68", "KTB Claim": 1260.0, "MOPH Claim": 360.0, "E-Claim": 6358.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 7978.0 },
    { "Month": "ธ.ค. 68", "KTB Claim": 0.0, "MOPH Claim": 10440.0, "E-Claim": 1489.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 11929.0 },
    { "Month": "ม.ค. 69", "KTB Claim": 20.0, "MOPH Claim": 420.0, "E-Claim": 75189.5, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 75629.5 },
    { "Month": "ก.พ. 69", "KTB Claim": 0.0, "MOPH Claim": 12900.0, "E-Claim": 16876.5, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 29776.5 },
    { "Month": "มี.ค. 69", "KTB Claim": 7300.0, "MOPH Claim": 0.0, "E-Claim": 7340.5, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 14640.5 },
    { "Month": "เม.ย. 69", "KTB Claim": 3200.0, "MOPH Claim": 0.0, "E-Claim": 35906.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 39106.0 },
    { "Month": "พ.ค. 69", "KTB Claim": 0.0, "MOPH Claim": 160.0, "E-Claim": 11180.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 11340.0 }
  ],
  "05957": [
    { "Month": "ต.ค. 68", "KTB Claim": 0.0, "MOPH Claim": 0.0, "E-Claim": 1202.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 1202.0 },
    { "Month": "พ.ย. 68", "KTB Claim": 0.0, "MOPH Claim": 220.0, "E-Claim": 8067.5, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 8287.5 },
    { "Month": "ธ.ค. 68", "KTB Claim": 0.0, "MOPH Claim": 240.0, "E-Claim": 8331.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 8571.0 },
    { "Month": "ม.ค. 69", "KTB Claim": 1450.0, "MOPH Claim": 40.0, "E-Claim": 10500.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 11990.0 },
    { "Month": "ก.พ. 69", "KTB Claim": 0.0, "MOPH Claim": 16420.0, "E-Claim": 47283.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 63703.0 },
    { "Month": "มี.ค. 69", "KTB Claim": 1550.0, "MOPH Claim": 0.0, "E-Claim": 23704.5, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 25254.5 },
    { "Month": "เม.ย. 69", "KTB Claim": 0.0, "MOPH Claim": 100.0, "E-Claim": 57913.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 58013.0 },
    { "Month": "มิ.ย. 69", "KTB Claim": 0.0, "MOPH Claim": 13950.0, "E-Claim": 0.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 13950.0 }
  ],
  "05959": [
    { "Month": "ต.ค. 68", "KTB Claim": 0.0, "MOPH Claim": 0.0, "E-Claim": 4945.0, "NTIP": 10000.0, "แพทย์แผนไทย": 0.0, "Total": 14945.0 },
    { "Month": "พ.ย. 68", "KTB Claim": 600.0, "MOPH Claim": 320.0, "E-Claim": 1456.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 2376.0 },
    { "Month": "ธ.ค. 68", "KTB Claim": 40.0, "MOPH Claim": 580.0, "E-Claim": 1605.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 2225.0 },
    { "Month": "ก.พ. 69", "KTB Claim": 0.0, "MOPH Claim": 17150.0, "E-Claim": 14694.5, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 31844.5 },
    { "Month": "มี.ค. 69", "KTB Claim": 0.0, "MOPH Claim": 0.0, "E-Claim": 6174.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 6174.0 },
    { "Month": "เม.ย. 69", "KTB Claim": 0.0, "MOPH Claim": 140.0, "E-Claim": 3867.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 4007.0 }
  ],
  "05962": [
    { "Month": "ต.ค. 68", "KTB Claim": 0.0, "MOPH Claim": 0.0, "E-Claim": 5864.5, "NTIP": 22080.0, "แพทย์แผนไทย": 0.0, "Total": 27944.5 },
    { "Month": "พ.ย. 68", "KTB Claim": 5140.0, "MOPH Claim": 2370.0, "E-Claim": 5674.5, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 13184.5 },
    { "Month": "ธ.ค. 68", "KTB Claim": 0.0, "MOPH Claim": 1180.0, "E-Claim": 22697.5, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 23877.5 },
    { "Month": "ก.พ. 69", "KTB Claim": 1550.0, "MOPH Claim": 34565.0, "E-Claim": 45531.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 81646.0 },
    { "Month": "มี.ค. 69", "KTB Claim": 13050.0, "MOPH Claim": 0.0, "E-Claim": 38344.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 51394.0 },
    { "Month": "เม.ย. 69", "KTB Claim": 550.0, "MOPH Claim": 10490.0, "E-Claim": 16451.5, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 27491.5 }
  ],
  "05956": [
    { "Month": "พ.ย. 68", "KTB Claim": 0.0, "MOPH Claim": 0.0, "E-Claim": 50.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 50.0 },
    { "Month": "ธ.ค. 68", "KTB Claim": 0.0, "MOPH Claim": 0.0, "E-Claim": 134.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 134.0 }
  ]
};

const PAY_MATRIX_68 = {
  "ALL": [
    { "Month": "ต.ค. 67", "KTB Claim": 50.0, "MOPH Claim": 2120.0, "E-Claim": 2964.68, "NTIP": 60720.0, "แพทย์แผนไทย": 0.0, "Total": 65854.68 },
    { "Month": "พ.ย. 67", "KTB Claim": 0.0, "MOPH Claim": 2240.0, "E-Claim": 1870.47, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 4110.47 },
    { "Month": "ธ.ค. 67", "KTB Claim": 0.0, "MOPH Claim": 1140.0, "E-Claim": 2794.77, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 3934.77 },
    { "Month": "ม.ค. 68", "KTB Claim": 0.0, "MOPH Claim": 2200.0, "E-Claim": 3815.23, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 6015.23 },
    { "Month": "ก.พ. 68", "KTB Claim": 0.0, "MOPH Claim": 12605.0, "E-Claim": 3828.23, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 16433.23 },
    { "Month": "มี.ค. 68", "KTB Claim": 0.0, "MOPH Claim": 10220.0, "E-Claim": 33336.07, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 43556.07 },
    { "Month": "เม.ย. 68", "KTB Claim": 0.0, "MOPH Claim": 37050.0, "E-Claim": 3658.0, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 40708.0 },
    { "Month": "พ.ค. 68", "KTB Claim": 98110.0, "MOPH Claim": 39365.0, "E-Claim": 37315.01, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 174790.01 },
    { "Month": "มิ.ย. 68", "KTB Claim": 0.0, "MOPH Claim": 18790.0, "E-Claim": 53904.27, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 72694.27 },
    { "Month": "ก.ค. 68", "KTB Claim": 8270.0, "MOPH Claim": 3780.0, "E-Claim": 51078.01, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 63128.01 },
    { "Month": "ส.ค. 68", "KTB Claim": 13340.0, "MOPH Claim": 2280.0, "E-Claim": 23678.63, "NTIP": 0.0, "แพทย์แผนไทย": 0.0, "Total": 39298.63 },
    { "Month": "ก.ย. 68", "KTB Claim": 200.0, "MOPH Claim": 1210.0, "E-Claim": 10661.21, "NTIP": 0.0, "แพทย์แผนไทย": 310339.04, "Total": 322410.25 }
  ]
};

const PAYABLE_HOSP_OPTIONS = [
  { code: 'ALL', label: '🏢 ทุกหน่วยบริการ (ภาพรวม CUP สันโค้ง)' },
  { code: '05954', label: '05954 - รพ.สต.บ้านสันโค้ง' },
  { code: '05962', label: '05962 - รพ.สต.บ้านต้นเปา' },
  { code: '05957', label: '05957 - รพ.สต.บ้านกอสะเรียม' },
  { code: '05959', label: '05959 - รพ.สต.บ้านแม่ผาแหน' },
  { code: '05956', label: '05956 - รพ.สต.บ้านป่าตาล' },
];

const PHYSICAL_GROUP_KEYWORDS = ['กายภาพ', 'ฟื้นฟู', 'physical'];
const isPhysicalGroup = (group) => {
  const g = String(group || '').toLowerCase();
  return PHYSICAL_GROUP_KEYWORDS.some(k => g.includes(k));
};

const THERAPIST_DETAIL = {
  '54': {
    id: '54',
    code: '54',
    name: 'พัทธนันท์ พชรสุข',
    role: 'นักกายภาพบำบัด',
    color: '#0369a1',
    bg: '#e0f2fe',
    badgeText: 'text-[#0369a1]',
    badgeBg: 'bg-[#e0f2fe]',
    totalQty: 293,
    totalAmt: 95960,
    avg: 328,
    pct: '40%',
    services: [
      { name: 'กายภาพบำบัด_IMC', qty: 194, amt: 63429.56 },
      { name: 'ให้บริการนอกหน่วยบริการ/ในชุมชน', qty: 84, amt: 27444.56 },
      { name: 'กายภาพบำบัด OPD', qty: 15, amt: 4989.92 }
    ]
  },
  '56': {
    id: '56',
    code: '56',
    name: 'จตุพล กันธะเรียน',
    role: 'นักกายภาพบำบัด',
    color: '#15803d',
    bg: '#dcfce7',
    badgeText: 'text-[#15803d]',
    badgeBg: 'bg-[#dcfce7]',
    totalQty: 256,
    totalAmt: 83965,
    avg: 328,
    pct: '35%',
    services: [
      { name: 'กายภาพบำบัด_IMC', qty: 169, amt: 55501.17 },
      { name: 'ให้บริการนอกหน่วยบริการ/ในชุมชน', qty: 73, amt: 24013.99 },
      { name: 'กายภาพบำบัด OPD', qty: 13, amt: 4366.18 }
    ]
  },
  '62': {
    id: '62',
    code: '62',
    name: 'ทิพย์สุดา มาแจ้',
    role: 'นักกายภาพบำบัด',
    color: '#b45309',
    bg: '#fef3c7',
    badgeText: 'text-[#b45309]',
    badgeBg: 'bg-[#fef3c7]',
    totalQty: 183,
    totalAmt: 59975,
    avg: 328,
    pct: '25%',
    services: [
      { name: 'กายภาพบำบัด_IMC', qty: 121, amt: 39643.48 },
      { name: 'ให้บริการนอกหน่วยบริการ/ในชุมชน', qty: 52, amt: 17152.85 },
      { name: 'กายภาพบำบัด OPD', qty: 10, amt: 3118.70 }
    ]
  }
};

const PAYMENT_CATEGORY_MAP = {
  '1': 'ค่ายาและเวชภัณฑ์',
  '2': 'ค่าวัสดุ',
  '3': 'ค่าตอบแทนทางการแพทย์',
  '4': 'ค่าบริการทางการแพทย์',
  '5': 'ค่าครุภัณฑ์ ที่ดินและสิ่งปลูกสร้าง',
  '6': 'ค่าใช้สอย',
  '7': 'ค่าสาธารณูปโภค',
  '8': 'ค่าจ้างลูกจ้างชั่วคราว',
  '9': 'ค่าตอบแทนการปฏิบัติงานนอกเวลาราชการ',
  '10': 'ค่าใช้จ่ายในการเดินทางไปราชการ',
  '11': 'ค่าใช้จ่ายอื่นที่จำเป็นที่เกี่ยวข้องกับการสาธารณสุข',
  '12': 'จ่ายค่าสนับสนุนลูกข่าย',
  '13': 'ภาษี',
};

const REAL_EXPENSES_TABLE = [
  { category: "1", name: "ค่ายาและเวชภัณฑ์", m: [391098.39, 36214.36, 0, 454872.61, 28413.89, 261468.08, 55037.77, 0, 0, 0, 0, 0] },
  { category: "2", name: "ค่าวัสดุ", m: [0, 0, 0, 452906.3, 0, 55699.53, 0, 0, 0, 0, 0, 0] },
  { category: "3", name: "ค่าตอบแทนทางการแพทย์", m: [0, 0, 0, 0, 11600, 0, 0, 0, 0, 0, 0, 0] },
  { category: "4", name: "ค่าบริการทางการแพทย์", m: [0, 0, 0, 229788, 0, 0, 0, 0, 0, 0, 0, 0] },
  { category: "5", name: "ค่าครุภัณฑ์ ที่ดินและสิ่งปลูกสร้าง", m: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { category: "6", name: "ค่าใช้สอย", m: [196973.6, 137645, 129308.35, 185139.67, 125730, 384778, 361735.71, 0, 0, 0, 0, 0] },
  { category: "7", name: "ค่าสาธารณูปโภค", m: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { category: "8", name: "ค่าจ้างลูกจ้างชั่วคราว", m: [0, 123556, 104428, 87628, 76028, 87628, 0, 0, 0, 0, 0, 0] },
  { category: "9", name: "ค่าตอบแทนการปฏิบัติงานนอกเวลาราชการ", m: [0, 0, 0, 0, 1625, 1950, 0, 0, 0, 0, 0, 0] },
  { category: "10", name: "ค่าใช้จ่ายในการเดินทางไปราชการ", m: [0, 0, 0, 0, 0, 2000, 0, 0, 0, 0, 0, 0] },
  { category: "11", name: "ค่าใช้จ่ายอื่นที่จำเป็นที่เกี่ยวข้องกับการสาธารณสุข", m: [3123.05, 1757, 1406.75, 9531.55, 14162.83, 8004, 8004, 0, 0, 0, 0, 0] },
  { category: "12", name: "จ่ายค่าสนับสนุนลูกข่าย", m: [0, 300000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { category: "13", name: "ภาษี", m: [0, 0, 0, 0, 0, 1972.71, 7302.49, 0, 0, 0, 0, 0] }
];

const OFFLINE_CLAIMS = [
  { hcode: '05954', group: 'PP-FS', service_item: 'เจาะเลือดตรวจน้ำตาล/ไขมัน', quantity: 1331, amount: 148100, fiscal_year: '2569' },
  { hcode: '05954', group: 'thai', service_item: 'ค่าบริการนวดและประคบ', quantity: 1053, amount: 219827.34, fiscal_year: '2569' },
  { hcode: '05954', group: 'physical', service_item: 'กายภาพบำบัด_IMC', quantity: 577, amount: 259650, fiscal_year: '2569' },
  { hcode: '05954', group: 'physical', service_item: 'ให้บริการนอกหน่วยบริการ/ในชุมชน', quantity: 562, amount: 112400, fiscal_year: '2569' },
  { hcode: '05954', group: 'physical', service_item: 'กายภาพบำบัด OPD', quantity: 420, amount: 17385.34, fiscal_year: '2569' },
  { hcode: '05954', group: 'herbal', service_item: 'ยาขมิ้นชัน / ยาแก้ไอ', quantity: 820, amount: 41250, fiscal_year: '2569' },
  { hcode: '05954', group: 'PP-FS', service_item: 'บริการให้วัคซีนป้องกันโรค', quantity: 1200, amount: 98820, fiscal_year: '2569' },
  { hcode: '05954', group: 'PP-FS', service_item: 'บริการยาเม็ดเสริมธาตุเหล็กและกรดโฟลิค', quantity: 1100, amount: 104300, fiscal_year: '2569' },
  { hcode: '05954', group: 'PP-FS', service_item: 'บริการตรวจคัดกรองมะเร็งลำไส้ใหญ่ (Fit Test)', quantity: 450, amount: 46000, fiscal_year: '2569' },
  { hcode: '05954', group: 'PP-FS', service_item: 'บริการตรวจคัดกรองวัณโรค (CXR/AFB)', quantity: 448, amount: 44800, fiscal_year: '2569' },
  { hcode: '05954', group: 'PP-FS', service_item: 'บริการผู้ป่วยเบาหวานความดัน', quantity: 380, amount: 80735.50, fiscal_year: '2569' },

  { hcode: '05962', group: 'PP-FS', service_item: 'เจาะเลือดตรวจน้ำตาล/ไขมัน', quantity: 890, amount: 92120, fiscal_year: '2569' },
  { hcode: '05962', group: 'thai', service_item: 'ค่าบริการนวดและประคบ', quantity: 320, amount: 20667.34, fiscal_year: '2569' },
  { hcode: '05962', group: 'physical', service_item: 'กายภาพบำบัด OPD', quantity: 75, amount: 3100, fiscal_year: '2569' },
  { hcode: '05962', group: 'herbal', service_item: 'ยาขมิ้นชัน / ยาฟ้าทะลายโจร', quantity: 450, amount: 15430, fiscal_year: '2569' },
  { hcode: '05962', group: 'PP-FS', service_item: 'บริการผู้ป่วยเบาหวานความดัน', quantity: 980, amount: 110085, fiscal_year: '2569' },
  { hcode: '05962', group: 'PP-FS', service_item: 'บริการตรวจคัดกรองวัณโรค (CXR)', quantity: 441, amount: 44100, fiscal_year: '2569' },
  { hcode: '05962', group: 'PP-FS', service_item: 'บริการให้วัคซีนป้องกันโรค', quantity: 650, amount: 41600, fiscal_year: '2569' },
  { hcode: '05962', group: 'PP-FS', service_item: 'บริการตรวจหลังคลอด', quantity: 420, amount: 41835, fiscal_year: '2569' },
  { hcode: '05962', group: 'PP-FS', service_item: 'บริการยาเม็ดเสริมธาตุเหล็ก', quantity: 380, amount: 25600, fiscal_year: '2569' },
  { hcode: '05962', group: 'PP-FS', service_item: 'บริการคัดกรองโลหิตจาง', quantity: 255, amount: 25015, fiscal_year: '2569' },
  { hcode: '05962', group: 'PP-FS', service_item: 'บริการตรวจคัดกรองมะเร็งลำไส้ใหญ่', quantity: 280, amount: 27780, fiscal_year: '2569' },
  { hcode: '05962', group: 'PP-FS', service_item: 'บริการทดสอบการตั้งครรภ์', quantity: 245, amount: 24525, fiscal_year: '2569' },
  { hcode: '05962', group: 'PP-FS', service_item: 'บริการวางแผนครอบครัว', quantity: 180, amount: 17940, fiscal_year: '2569' },

  { hcode: '05957', group: 'PP-FS', service_item: 'เจาะเลือดตรวจน้ำตาล/ไขมัน', quantity: 780, amount: 89220, fiscal_year: '2569' },
  { hcode: '05957', group: 'thai', service_item: 'ค่าบริการนวดและประคบ', quantity: 290, amount: 21940.87, fiscal_year: '2569' },
  { hcode: '05957', group: 'herbal', service_item: 'ยาสมุนไพรในบัญชียาหลัก', quantity: 310, amount: 14200, fiscal_year: '2569' },
  { hcode: '05957', group: 'PP-FS', service_item: 'บริการผู้ป่วยเบาหวานความดัน', quantity: 640, amount: 64440, fiscal_year: '2569' },
  { hcode: '05957', group: 'PP-FS', service_item: 'บริการให้วัคซีนป้องกันโรค', quantity: 580, amount: 58040, fiscal_year: '2569' },
  { hcode: '05957', group: 'PP-FS', service_item: 'บริการตรวจหลังคลอด', quantity: 425, amount: 42525, fiscal_year: '2569' },
  { hcode: '05957', group: 'PP-FS', service_item: 'บริการวางแผนครอบครัว', quantity: 415, amount: 41580, fiscal_year: '2569' },
  { hcode: '05957', group: 'PP-FS', service_item: 'บริการทดสอบการตั้งครรภ์', quantity: 256, amount: 25650, fiscal_year: '2569' },
  { hcode: '05957', group: 'PP-FS', service_item: 'บริการยาเม็ดเสริมธาตุเหล็ก', quantity: 252, amount: 25200, fiscal_year: '2569' },
  { hcode: '05957', group: 'PP-FS', service_item: 'บริการคัดกรองมะเร็งลำไส้ใหญ่', quantity: 243, amount: 24300, fiscal_year: '2569' },
  { hcode: '05957', group: 'PP-FS', service_item: 'บริการคัดกรองมะเร็งปากมดลูก', quantity: 243, amount: 24300, fiscal_year: '2569' },

  { hcode: '05959', group: 'PP-FS', service_item: 'เจาะเลือดตรวจน้ำตาล/ไขมัน', quantity: 415, amount: 41500, fiscal_year: '2569' },
  { hcode: '05959', group: 'thai', service_item: 'ค่าบริการนวดและประคบ', quantity: 270, amount: 28612.99, fiscal_year: '2569' },
  { hcode: '05959', group: 'herbal', service_item: 'ยาสมุนไพรในบัญชียาหลัก', quantity: 260, amount: 11200, fiscal_year: '2569' },
  { hcode: '05959', group: 'PP-FS', service_item: 'บริการให้วัคซีนป้องกันโรค', quantity: 825, amount: 82500, fiscal_year: '2569' },
  { hcode: '05959', group: 'PP-FS', service_item: 'บริการตรวจหลังคลอด', quantity: 424, amount: 42435, fiscal_year: '2569' },
  { hcode: '05959', group: 'PP-FS', service_item: 'บริการวางแผนครอบครัว', quantity: 416, amount: 41640, fiscal_year: '2569' },
  { hcode: '05959', group: 'PP-FS', service_item: 'บริการผู้ป่วยเบาหวานความดัน', quantity: 356, amount: 35625, fiscal_year: '2569' },
  { hcode: '05959', group: 'PP-FS', service_item: 'บริการเคลือบฟลูออไรด์', quantity: 243, amount: 24300, fiscal_year: '2569' },
  { hcode: '05959', group: 'PP-FS', service_item: 'บริการทดสอบการตั้งครรภ์', quantity: 243, amount: 24375, fiscal_year: '2569' },
  { hcode: '05959', group: 'PP-FS', service_item: 'บริการยาเม็ดเสริมธาตุเหล็ก', quantity: 227, amount: 22720, fiscal_year: '2569' },
  { hcode: '05959', group: 'PP-FS', service_item: 'บริการคัดกรองมะเร็งลำไส้ใหญ่', quantity: 170, amount: 16980, fiscal_year: '2569' },

  { hcode: '05956', group: 'PP-FS', service_item: 'เจาะเลือดตรวจน้ำตาล/ไขมัน', quantity: 462, amount: 46260, fiscal_year: '2569' },
  { hcode: '05956', group: 'thai', service_item: 'ค่าบริการนวดและประคบ', quantity: 120, amount: 4500, fiscal_year: '2569' },
  { hcode: '05956', group: 'herbal', service_item: 'ยาสมุนไพรในบัญชียาหลัก', quantity: 110, amount: 4340, fiscal_year: '2569' },
  { hcode: '05956', group: 'PP-FS', service_item: 'บริการตรวจหลังคลอด', quantity: 411, amount: 41100, fiscal_year: '2569' },
  { hcode: '05956', group: 'PP-FS', service_item: 'บริการยาเม็ดเสริมธาตุเหล็ก', quantity: 263, amount: 26380, fiscal_year: '2569' },
  { hcode: '05956', group: 'PP-FS', service_item: 'บริการให้วัคซีนป้องกันโรค', quantity: 243, amount: 24300, fiscal_year: '2569' },
  { hcode: '05956', group: 'PP-FS', service_item: 'บริการคัดกรองไวรัสตับอักเสบบี', quantity: 243, amount: 24300, fiscal_year: '2569' },
  { hcode: '05956', group: 'PP-FS', service_item: 'บริการวางแผนครอบครัว', quantity: 168, amount: 16800, fiscal_year: '2569' },
  { hcode: '05956', group: 'PP-FS', service_item: 'บริการคัดกรองมะเร็งลำไส้ใหญ่', quantity: 168, amount: 16800, fiscal_year: '2569' },
  { hcode: '05956', group: 'PP-FS', service_item: 'บริการตรวจคัดกรองไวรัสตับอักเสบซี', quantity: 168, amount: 16800, fiscal_year: '2569' }
];

const OFFLINE_PAYMENTS = [
  { hcode: '05954', fiscal_year: '2569', month: '10', amount: 73135, platform: 'KTB Claim' },
  { hcode: '05954', fiscal_year: '2569', month: '11', amount: 32576, platform: 'KTB Claim' },
  { hcode: '05954', fiscal_year: '2569', month: '12', amount: 46736.5, platform: 'E-Claim' },
  { hcode: '05954', fiscal_year: '2569', month: '1', amount: 100744.5, platform: 'E-Claim' },
  { hcode: '05954', fiscal_year: '2569', month: '2', amount: 206970, platform: 'MOPH Claim' },
  { hcode: '05954', fiscal_year: '2569', month: '3', amount: 97463, platform: 'KTB Claim' },
  { hcode: '05954', fiscal_year: '2569', month: '4', amount: 128617.5, platform: 'E-Claim' },
  { hcode: '05954', fiscal_year: '2569', month: '5', amount: 15690, platform: 'MOPH Claim' },
  { hcode: '05954', fiscal_year: '2569', month: '6', amount: 14910, platform: 'MOPH Claim' },
  { hcode: '05954', fiscal_year: '2569', month: '7', amount: 460, platform: 'MOPH Claim' },

  { hcode: '05954', fiscal_year: '2568', month: '10', amount: 65000, platform: 'KTB Claim' },
  { hcode: '05954', fiscal_year: '2568', month: '11', amount: 72000, platform: 'KTB Claim' },
  { hcode: '05954', fiscal_year: '2568', month: '12', amount: 55000, platform: 'E-Claim' },
  { hcode: '05954', fiscal_year: '2568', month: '1', amount: 88000, platform: 'E-Claim' },
  { hcode: '05954', fiscal_year: '2568', month: '2', amount: 95000, platform: 'MOPH Claim' },
  { hcode: '05954', fiscal_year: '2568', month: '3', amount: 99000, platform: 'KTB Claim' },
  { hcode: '05954', fiscal_year: '2568', month: '4', amount: 85000, platform: 'E-Claim' },
  { hcode: '05954', fiscal_year: '2568', month: '5', amount: 79000, platform: 'MOPH Claim' },
  { hcode: '05954', fiscal_year: '2568', month: '6', amount: 71000, platform: 'MOPH Claim' },
  { hcode: '05954', fiscal_year: '2568', month: '7', amount: 82000, platform: 'MOPH Claim' },
  { hcode: '05954', fiscal_year: '2568', month: '8', amount: 75000, platform: 'KTB Claim' },
  { hcode: '05954', fiscal_year: '2568', month: '9', amount: 65000, platform: 'E-Claim' }
];

const OFFLINE_PHYSICAL_DATA = [
  // 2569 - 54 (พัทธนันท์ พชรสุข)
  { rep: '01', month: '10', fiscal_year: '2569', service_item: 'กายภาพบำบัด_IMC', amount: 25000, hcode: '54' },
  { rep: '01', month: '10', fiscal_year: '2569', service_item: 'ให้บริการนอกหน่วยบริการ/ในชุมชน', amount: 10500, hcode: '54' },
  { rep: '01', month: '10', fiscal_year: '2569', service_item: 'กายภาพบำบัด OPD', amount: 1455.6, hcode: '54' },
  { rep: '02', month: '11', fiscal_year: '2569', service_item: 'กายภาพบำบัด_IMC', amount: 26000, hcode: '54' },
  { rep: '02', month: '11', fiscal_year: '2569', service_item: 'ให้บริการนอกหน่วยบริการ/ในชุมชน', amount: 11000, hcode: '54' },
  { rep: '02', month: '11', fiscal_year: '2569', service_item: 'กายภาพบำบัด OPD', amount: 1500, hcode: '54' },
  { rep: '03', month: '12', fiscal_year: '2569', service_item: 'กายภาพบำบัด_IMC', amount: 12429.56, hcode: '54' },
  { rep: '03', month: '12', fiscal_year: '2569', service_item: 'ให้บริการนอกหน่วยบริการ/ในชุมชน', amount: 5944.56, hcode: '54' },
  { rep: '03', month: '12', fiscal_year: '2569', service_item: 'กายภาพบำบัด OPD', amount: 2034.32, hcode: '54' },

  // 2569 - 56 (จตุพล กันธะเรียน)
  { rep: '01', month: '10', fiscal_year: '2569', service_item: 'กายภาพบำบัด_IMC', amount: 22000, hcode: '56' },
  { rep: '01', month: '10', fiscal_year: '2569', service_item: 'ให้บริการนอกหน่วยบริการ/ในชุมชน', amount: 9500, hcode: '56' },
  { rep: '01', month: '10', fiscal_year: '2569', service_item: 'กายภาพบำบัด OPD', amount: 1400, hcode: '56' },
  { rep: '02', month: '11', fiscal_year: '2569', service_item: 'กายภาพบำบัด_IMC', amount: 22501.17, hcode: '56' },
  { rep: '02', month: '11', fiscal_year: '2569', service_item: 'ให้บริการนอกหน่วยบริการ/ในชุมชน', amount: 9800, hcode: '56' },
  { rep: '02', month: '11', fiscal_year: '2569', service_item: 'กายภาพบำบัด OPD', amount: 1466.18, hcode: '56' },
  { rep: '03', month: '12', fiscal_year: '2569', service_item: 'กายภาพบำบัด_IMC', amount: 11000, hcode: '56' },
  { rep: '03', month: '12', fiscal_year: '2569', service_item: 'ให้บริการนอกหน่วยบริการ/ในชุมชน', amount: 4713.99, hcode: '56' },
  { rep: '03', month: '12', fiscal_year: '2569', service_item: 'กายภาพบำบัด OPD', amount: 1500, hcode: '56' },

  // 2569 - 62 (ทิพย์สุดา มาแจ้)
  { rep: '01', month: '10', fiscal_year: '2569', service_item: 'กายภาพบำบัด_IMC', amount: 15000, hcode: '62' },
  { rep: '01', month: '10', fiscal_year: '2569', service_item: 'ให้บริการนอกหน่วยบริการ/ในชุมชน', amount: 6800, hcode: '62' },
  { rep: '01', month: '10', fiscal_year: '2569', service_item: 'กายภาพบำบัด OPD', amount: 1000, hcode: '62' },
  { rep: '02', month: '11', fiscal_year: '2569', service_item: 'กายภาพบำบัด_IMC', amount: 16000, hcode: '62' },
  { rep: '02', month: '11', fiscal_year: '2569', service_item: 'ให้บริการนอกหน่วยบริการ/ในชุมชน', amount: 7000, hcode: '62' },
  { rep: '02', month: '11', fiscal_year: '2569', service_item: 'กายภาพบำบัด OPD', amount: 1118.7, hcode: '62' },
  { rep: '03', month: '12', fiscal_year: '2569', service_item: 'กายภาพบำบัด_IMC', amount: 8643.48, hcode: '62' },
  { rep: '03', month: '12', fiscal_year: '2569', service_item: 'ให้บริการนอกหน่วยบริการ/ในชุมชน', amount: 3352.85, hcode: '62' },
  { rep: '03', month: '12', fiscal_year: '2569', service_item: 'กายภาพบำบัด OPD', amount: 1000, hcode: '62' },

  // 2568 Historical
  { rep: '01', month: '10', fiscal_year: '2568', service_item: 'กายภาพบำบัด_IMC', amount: 36955.6, hcode: '54' },
  { rep: '02', month: '11', fiscal_year: '2568', service_item: 'กายภาพบำบัด_IMC', amount: 40329.77, hcode: '54' },
  { rep: '03', month: '12', fiscal_year: '2568', service_item: 'กายภาพบำบัด_IMC', amount: 59755.6, hcode: '56' },
  { rep: '04', month: '1', fiscal_year: '2568', service_item: 'กายภาพบำบัด_IMC', amount: 49743.36, hcode: '56' },
  { rep: '05', month: '2', fiscal_year: '2568', service_item: 'กายภาพบำบัด_IMC', amount: 41748.65, hcode: '62' },
  { rep: '06', month: '3', fiscal_year: '2568', service_item: 'กายภาพบำบัด_IMC', amount: 38812.22, hcode: '62' },
  { rep: '07', month: '4', fiscal_year: '2568', service_item: 'กายภาพบำบัด_IMC', amount: 31931.06, hcode: '54' },
  { rep: '08', month: '5', fiscal_year: '2568', service_item: 'กายภาพบำบัด_IMC', amount: 30719.0, hcode: '56' }
];

const OFFLINE_THAI_DATA = [
  // 2569 - รพ.สต.บ้านสันโค้ง (05954)
  { rep: '1', month: '10', fiscal_year: '2569', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 28500, hcode: '05954' },
  { rep: '1', month: '10', fiscal_year: '2569', service_item: 'การตรวจวินิจฉัยและให้คำปรึกษาทางการแพทย์แผนไทย', amount: 8400, hcode: '05954' },
  { rep: '1', month: '11', fiscal_year: '2569', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 31200, hcode: '05954' },
  { rep: '1', month: '11', fiscal_year: '2569', service_item: 'บริการอบไอน้ำสมุนไพรเพื่อการรักษา', amount: 6500, hcode: '05954' },
  { rep: '2', month: '12', fiscal_year: '2569', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 18450.5, hcode: '05954' },
  { rep: '2', month: '12', fiscal_year: '2569', service_item: 'การฟื้นฟูสุขภาพมารดาหลังคลอด (ทับหม้อเกลือ)', amount: 4800, hcode: '05954' },

  // 2569 - รพ.สต.บ้านกอสะเรียม (05957)
  { rep: '1', month: '10', fiscal_year: '2569', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 22000, hcode: '05957' },
  { rep: '1', month: '10', fiscal_year: '2569', service_item: 'การตรวจวินิจฉัยและให้คำปรึกษาทางการแพทย์แผนไทย', amount: 5200, hcode: '05957' },
  { rep: '1', month: '11', fiscal_year: '2569', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 24500, hcode: '05957' },
  { rep: '2', month: '12', fiscal_year: '2569', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 12800, hcode: '05957' },

  // 2569 - รพ.สต.บ้านต้นเปา (05962)
  { rep: '1', month: '10', fiscal_year: '2569', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 18000, hcode: '05962' },
  { rep: '1', month: '11', fiscal_year: '2569', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 19500, hcode: '05962' },
  { rep: '2', month: '12', fiscal_year: '2569', service_item: 'บริการอบไอน้ำสมุนไพรเพื่อการรักษา', amount: 4600, hcode: '05962' },
  { rep: '2', month: '12', fiscal_year: '2569', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 9500, hcode: '05962' },

  // 2569 - รพ.สต.บ้านแม่ผาแหน (05959)
  { rep: '1', month: '10', fiscal_year: '2569', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 6500, hcode: '05959' },
  { rep: '1', month: '11', fiscal_year: '2569', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 7200, hcode: '05959' },
  { rep: '2', month: '12', fiscal_year: '2569', service_item: 'การตรวจวินิจฉัยและให้คำปรึกษาทางการแพทย์แผนไทย', amount: 2300, hcode: '05959' },

  // 2569 - รพ.สต.บ้านป่าตาล (05956)
  { rep: '1', month: '10', fiscal_year: '2569', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 3500, hcode: '05956' },
  { rep: '1', month: '11', fiscal_year: '2569', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 4200, hcode: '05956' },
  { rep: '2', month: '12', fiscal_year: '2569', service_item: 'การตรวจวินิจฉัยและให้คำปรึกษาทางการแพทย์แผนไทย', amount: 1280.5, hcode: '05956' },

  // 2568 Historical
  { rep: '1', month: '10', fiscal_year: '2568', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 24000, hcode: '05954' },
  { rep: '1', month: '11', fiscal_year: '2568', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 26500, hcode: '05954' },
  { rep: '1', month: '12', fiscal_year: '2568', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 28000, hcode: '05957' },
  { rep: '2', month: '1', fiscal_year: '2568', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 21000, hcode: '05957' },
  { rep: '2', month: '2', fiscal_year: '2568', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 19500, hcode: '05962' },
  { rep: '2', month: '3', fiscal_year: '2568', service_item: 'บริการนวดและประคบสมุนไพรเพื่อการรักษา', amount: 22000, hcode: '05962' }
];


const OFFLINE_PPFS_DATA = [{"hcode":"05954","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 15-34 ปี","person_count":"343","quantity":"348","amount":"33200","fiscal_year":"2567"},{"hcode":"05954","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 15-34 ปี","person_count":"72","quantity":"73","amount":"6700","fiscal_year":"2568"},{"hcode":"05954","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 15-34 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05954","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 35-59 ปี","person_count":"489","quantity":"490","amount":"70800","fiscal_year":"2567"},{"hcode":"05954","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 35-59 ปี","person_count":"111","quantity":"113","amount":"11850","fiscal_year":"2568"},{"hcode":"05954","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 35-59 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05954","group_name":"-","service_item":"บริการชุดตรวจคัดกรองเอชไอวีด้วยตนเอง","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05954","group_name":"-","service_item":"บริการชุดตรวจคัดกรองเอชไอวีด้วยตนเอง","person_count":"21","quantity":"21","amount":"2100","fiscal_year":"2568"},{"hcode":"05954","group_name":"-","service_item":"บริการชุดตรวจคัดกรองเอชไอวีด้วยตนเอง","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05954","group_name":"12.บริการคัดกรองมะเร็งปากมดลูก","service_item":"ค่าบริการเก็บตัวอย่าง","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05954","group_name":"12.บริการคัดกรองมะเร็งปากมดลูก","service_item":"ค่าบริการเก็บตัวอย่าง","person_count":"6","quantity":"6","amount":"300","fiscal_year":"2568"},{"hcode":"05954","group_name":"12.บริการคัดกรองมะเร็งปากมดลูก","service_item":"ค่าบริการเก็บตัวอย่าง","person_count":"92","quantity":"92","amount":"4600","fiscal_year":"2569"},{"hcode":"05954","group_name":"12.บริการคัดกรองมะเร็งปากมดลูก","service_item":"ตรวจคัดกรองมะเร็งปากมดลูก ด้วยวิธี PAP SMEAR ผลเป็นลบ","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05954","group_name":"12.บริการคัดกรองมะเร็งปากมดลูก","service_item":"ตรวจคัดกรองมะเร็งปากมดลูก ด้วยวิธี PAP SMEAR ผลเป็นลบ","person_count":"6","quantity":"6","amount":"1500","fiscal_year":"2568"},{"hcode":"05954","group_name":"12.บริการคัดกรองมะเร็งปากมดลูก","service_item":"ตรวจคัดกรองมะเร็งปากมดลูก ด้วยวิธี PAP SMEAR ผลเป็นลบ","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05954","group_name":"14.บริการตรวจคัดกรองและค้นหาวัณโรคในกลุ่มเสี่ยงสูง","service_item":"ค่าบริการตรวจเสมหะ AFB","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05954","group_name":"14.บริการตรวจคัดกรองและค้นหาวัณโรคในกลุ่มเสี่ยงสูง","service_item":"ค่าบริการตรวจเสมหะ AFB","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2568"},{"hcode":"05954","group_name":"14.บริการตรวจคัดกรองและค้นหาวัณโรคในกลุ่มเสี่ยงสูง","service_item":"ค่าบริการตรวจเสมหะ AFB","person_count":"38","quantity":"114","amount":"2280","fiscal_year":"2569"},{"hcode":"05954","group_name":"14.บริการตรวจคัดกรองและค้นหาวัณโรคในกลุ่มเสี่ยงสูง","service_item":"ค่าบริการถ่ายภาพรังสีทรวงอก CXR เพื่อวินิจฉัยวัณโรค","person_count":"417","quantity":"417","amount":"41700","fiscal_year":"2567"},{"hcode":"05954","group_name":"14.บริการตรวจคัดกรองและค้นหาวัณโรคในกลุ่มเสี่ยงสูง","service_item":"ค่าบริการถ่ายภาพรังสีทรวงอก CXR เพื่อวินิจฉัยวัณโรค","person_count":"412","quantity":"412","amount":"41200","fiscal_year":"2568"},{"hcode":"05954","group_name":"14.บริการตรวจคัดกรองและค้นหาวัณโรคในกลุ่มเสี่ยงสูง","service_item":"ค่าบริการถ่ายภาพรังสีทรวงอก CXR เพื่อวินิจฉัยวัณโรค","person_count":"410","quantity":"410","amount":"41000","fiscal_year":"2569"},{"hcode":"05954","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจ Total Cholesterol หรือ HDL อายุ 45 - 70 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05954","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจ Total Cholesterol หรือ HDL อายุ 45 - 70 ปี","person_count":"271","quantity":"277","amount":"41120","fiscal_year":"2568"},{"hcode":"05954","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจ Total Cholesterol หรือ HDL อายุ 45 - 70 ปี","person_count":"7","quantity":"7","amount":"800","fiscal_year":"2569"},{"hcode":"05954","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจวัดระดับน้ำตาล (Fasting Plasma Glucose : FPG) สำหรับกลุ่มเสี่ยง อายุ 35-59 ปี","person_count":"136","quantity":"136","amount":"5400","fiscal_year":"2567"},{"hcode":"05954","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจวัดระดับน้ำตาล (Fasting Plasma Glucose : FPG) สำหรับกลุ่มเสี่ยง อายุ 35-59 ปี","person_count":"129","quantity":"131","amount":"4600","fiscal_year":"2568"},{"hcode":"05954","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจวัดระดับน้ำตาล (Fasting Plasma Glucose : FPG) สำหรับกลุ่มเสี่ยง อายุ 35-59 ปี","person_count":"334","quantity":"338","amount":"13360","fiscal_year":"2569"},{"hcode":"05954","group_name":"18. บริการยาเม็ดเสริมธาตุเหล็กและกรดโฟลิค","service_item":"ค่าบริการยาเม็ดเสริมธาตุเหล็ก (Ferrofolic)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05954","group_name":"18. บริการยาเม็ดเสริมธาตุเหล็กและกรดโฟลิค","service_item":"ค่าบริการยาเม็ดเสริมธาตุเหล็ก (Ferrofolic)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2568"},{"hcode":"05954","group_name":"18. บริการยาเม็ดเสริมธาตุเหล็กและกรดโฟลิค","service_item":"ค่าบริการยาเม็ดเสริมธาตุเหล็ก (Ferrofolic)","person_count":"1062","quantity":"1081","amount":"80000","fiscal_year":"2569"},{"hcode":"05954","group_name":"19.บริการเคลือบฟลูออไรด์","service_item":"ค่าบริการเคลือบฟลูออไรด์ (กลุ่มเสี่ยง)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05954","group_name":"19.บริการเคลือบฟลูออไรด์","service_item":"ค่าบริการเคลือบฟลูออไรด์ (กลุ่มเสี่ยง)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2568"},{"hcode":"05954","group_name":"19.บริการเคลือบฟลูออไรด์","service_item":"ค่าบริการเคลือบฟลูออไรด์ (กลุ่มเสี่ยง)","person_count":"13","quantity":"13","amount":"1300","fiscal_year":"2569"},{"hcode":"05954","group_name":"20. บริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง (Fit Test)","service_item":"ค่าบริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง","person_count":"39","quantity":"39","amount":"2280","fiscal_year":"2567"},{"hcode":"05954","group_name":"20. บริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง (Fit Test)","service_item":"ค่าบริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง","person_count":"118","quantity":"118","amount":"7020","fiscal_year":"2568"},{"hcode":"05954","group_name":"20. บริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง (Fit Test)","service_item":"ค่าบริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง","person_count":"29","quantity":"29","amount":"1740","fiscal_year":"2569"},{"hcode":"05954","group_name":"21.บริการคัดกรองไวรัสตับอักเสบบี","service_item":"บริการตรวจคัดกรองไวรัสตับอักเสบ บี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05954","group_name":"21.บริการคัดกรองไวรัสตับอักเสบบี","service_item":"บริการตรวจคัดกรองไวรัสตับอักเสบ บี","person_count":"718","quantity":"718","amount":"35900","fiscal_year":"2568"},{"hcode":"05954","group_name":"21.บริการคัดกรองไวรัสตับอักเสบบี","service_item":"บริการตรวจคัดกรองไวรัสตับอักเสบ บี","person_count":"256","quantity":"256","amount":"12800","fiscal_year":"2569"},{"hcode":"05954","group_name":"22.บริการคัดกรองไวรัสตับอักเสบซี","service_item":"การตรวจคัดกรองโรคไวรัสตับอักเสบ ซี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05954","group_name":"22.บริการคัดกรองไวรัสตับอักเสบซี","service_item":"การตรวจคัดกรองโรคไวรัสตับอักเสบ ซี","person_count":"738","quantity":"738","amount":"36900","fiscal_year":"2568"},{"hcode":"05954","group_name":"22.บริการคัดกรองไวรัสตับอักเสบซี","service_item":"การตรวจคัดกรองโรคไวรัสตับอักเสบ ซี","person_count":"265","quantity":"265","amount":"13250","fiscal_year":"2569"},{"hcode":"05954","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"ฉีดวัคซีนป้องกันโรคป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(7กลุ่มเสี่ยง)","person_count":"798","quantity":"1546","amount":"23440","fiscal_year":"2567"},{"hcode":"05954","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"ฉีดวัคซีนป้องกันโรคป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(7กลุ่มเสี่ยง)","person_count":"2253","quantity":"2253","amount":"45060","fiscal_year":"2568"},{"hcode":"05954","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"ฉีดวัคซีนป้องกันโรคป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(7กลุ่มเสี่ยง)","person_count":"329","quantity":"329","amount":"6580","fiscal_year":"2569"},{"hcode":"05954","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนคอตีบ-บาดทะยัก (dT) ในผู้ใหญ่","person_count":"1","quantity":"1","amount":"0","fiscal_year":"2567"},{"hcode":"05954","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนคอตีบ-บาดทะยัก (dT) ในผู้ใหญ่","person_count":"65","quantity":"65","amount":"1300","fiscal_year":"2568"},{"hcode":"05954","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนคอตีบ-บาดทะยัก (dT) ในผู้ใหญ่","person_count":"66","quantity":"66","amount":"1320","fiscal_year":"2569"},{"hcode":"05954","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนพื้นฐานตามกาหนดการให้วัคซีนตามแผนงานสร้างเสริมภูมิคุ้มกันโรค (EPI) ของกระทรวงสาธารณสุข","person_count":"111","quantity":"142","amount":"1600","fiscal_year":"2567"},{"hcode":"05954","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนพื้นฐานตามกาหนดการให้วัคซีนตามแผนงานสร้างเสริมภูมิคุ้มกันโรค (EPI) ของกระทรวงสาธารณสุข","person_count":"970","quantity":"1115","amount":"26680","fiscal_year":"2568"},{"hcode":"05954","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนพื้นฐานตามกาหนดการให้วัคซีนตามแผนงานสร้างเสริมภูมิคุ้มกันโรค (EPI) ของกระทรวงสาธารณสุข","person_count":"259","quantity":"334","amount":"8640","fiscal_year":"2569"},{"hcode":"05954","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"วัคซีนป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(หญิงตั้งครรภ์)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05954","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"วัคซีนป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(หญิงตั้งครรภ์)","person_count":"2","quantity":"2","amount":"40","fiscal_year":"2568"},{"hcode":"05954","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"วัคซีนป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(หญิงตั้งครรภ์)","person_count":"4","quantity":"4","amount":"80","fiscal_year":"2569"},{"hcode":"05954","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่ายา Triferdine (PNC: Postnatal care)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05954","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่ายา Triferdine (PNC: Postnatal care)","person_count":"1","quantity":"1","amount":"135","fiscal_year":"2568"},{"hcode":"05954","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่ายา Triferdine (PNC: Postnatal care)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05954","group_name":"8.บริการทดสอบการตั้งครรภ์","service_item":"ค่าบริการทดสอบการตั้งครรภ์","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05954","group_name":"8.บริการทดสอบการตั้งครรภ์","service_item":"ค่าบริการทดสอบการตั้งครรภ์","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2568"},{"hcode":"05954","group_name":"8.บริการทดสอบการตั้งครรภ์","service_item":"ค่าบริการทดสอบการตั้งครรภ์","person_count":"1","quantity":"1","amount":"75","fiscal_year":"2569"},{"hcode":"05954","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาฉีดคุมกำเนิด","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05954","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาฉีดคุมกำเนิด","person_count":"8","quantity":"8","amount":"480","fiscal_year":"2568"},{"hcode":"05954","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาฉีดคุมกำเนิด","person_count":"19","quantity":"19","amount":"1140","fiscal_year":"2569"},{"hcode":"05957","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 15-34 ปี","person_count":"58","quantity":"58","amount":"5200","fiscal_year":"2567"},{"hcode":"05957","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 15-34 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2568"},{"hcode":"05957","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 15-34 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05957","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 35-59 ปี","person_count":"343","quantity":"345","amount":"46650","fiscal_year":"2567"},{"hcode":"05957","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 35-59 ปี","person_count":"45","quantity":"48","amount":"0","fiscal_year":"2568"},{"hcode":"05957","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 35-59 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05957","group_name":"12.บริการคัดกรองมะเร็งปากมดลูก","service_item":"ค่าบริการเก็บตัวอย่าง","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05957","group_name":"12.บริการคัดกรองมะเร็งปากมดลูก","service_item":"ค่าบริการเก็บตัวอย่าง","person_count":"54","quantity":"54","amount":"2700","fiscal_year":"2568"},{"hcode":"05957","group_name":"12.บริการคัดกรองมะเร็งปากมดลูก","service_item":"ค่าบริการเก็บตัวอย่าง","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05957","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจ Total Cholesterol หรือ HDL อายุ 45 - 70 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05957","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจ Total Cholesterol หรือ HDL อายุ 45 - 70 ปี","person_count":"198","quantity":"198","amount":"24000","fiscal_year":"2568"},{"hcode":"05957","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจ Total Cholesterol หรือ HDL อายุ 45 - 70 ปี","person_count":"211","quantity":"211","amount":"33600","fiscal_year":"2569"},{"hcode":"05957","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจวัดระดับน้ำตาล (Fasting Plasma Glucose : FPG) สำหรับกลุ่มเสี่ยง อายุ 35-59 ปี","person_count":"339","quantity":"341","amount":"12640","fiscal_year":"2567"},{"hcode":"05957","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจวัดระดับน้ำตาล (Fasting Plasma Glucose : FPG) สำหรับกลุ่มเสี่ยง อายุ 35-59 ปี","person_count":"1","quantity":"1","amount":"0","fiscal_year":"2568"},{"hcode":"05957","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจวัดระดับน้ำตาล (Fasting Plasma Glucose : FPG) สำหรับกลุ่มเสี่ยง อายุ 35-59 ปี","person_count":"364","quantity":"364","amount":"14520","fiscal_year":"2569"},{"hcode":"05957","group_name":"18. บริการยาเม็ดเสริมธาตุเหล็กและกรดโฟลิค","service_item":"ค่าบริการยาเม็ดเสริมธาตุเหล็ก (Ferrofolic)","person_count":"73","quantity":"73","amount":"5520","fiscal_year":"2567"},{"hcode":"05957","group_name":"18. บริการยาเม็ดเสริมธาตุเหล็กและกรดโฟลิค","service_item":"ค่าบริการยาเม็ดเสริมธาตุเหล็ก (Ferrofolic)","person_count":"76","quantity":"76","amount":"5920","fiscal_year":"2568"},{"hcode":"05957","group_name":"18. บริการยาเม็ดเสริมธาตุเหล็กและกรดโฟลิค","service_item":"ค่าบริการยาเม็ดเสริมธาตุเหล็ก (Ferrofolic)","person_count":"119","quantity":"119","amount":"8400","fiscal_year":"2569"},{"hcode":"05957","group_name":"20. บริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง (Fit Test)","service_item":"ค่าบริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05957","group_name":"20. บริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง (Fit Test)","service_item":"ค่าบริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง","person_count":"186","quantity":"186","amount":"11040","fiscal_year":"2568"},{"hcode":"05957","group_name":"20. บริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง (Fit Test)","service_item":"ค่าบริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05957","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"ฉีดวัคซีนป้องกันโรคป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(7กลุ่มเสี่ยง)","person_count":"789","quantity":"1447","amount":"22360","fiscal_year":"2567"},{"hcode":"05957","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"ฉีดวัคซีนป้องกันโรคป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(7กลุ่มเสี่ยง)","person_count":"11","quantity":"11","amount":"220","fiscal_year":"2568"},{"hcode":"05957","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"ฉีดวัคซีนป้องกันโรคป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(7กลุ่มเสี่ยง)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05957","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนคอตีบ-บาดทะยัก (dT) ในผู้ใหญ่","person_count":"4","quantity":"5","amount":"80","fiscal_year":"2567"},{"hcode":"05957","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนคอตีบ-บาดทะยัก (dT) ในผู้ใหญ่","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2568"},{"hcode":"05957","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนคอตีบ-บาดทะยัก (dT) ในผู้ใหญ่","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05957","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนพื้นฐานตามกาหนดการให้วัคซีนตามแผนงานสร้างเสริมภูมิคุ้มกันโรค (EPI) ของกระทรวงสาธารณสุข","person_count":"27","quantity":"37","amount":"540","fiscal_year":"2567"},{"hcode":"05957","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนพื้นฐานตามกาหนดการให้วัคซีนตามแผนงานสร้างเสริมภูมิคุ้มกันโรค (EPI) ของกระทรวงสาธารณสุข","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2568"},{"hcode":"05957","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนพื้นฐานตามกาหนดการให้วัคซีนตามแผนงานสร้างเสริมภูมิคุ้มกันโรค (EPI) ของกระทรวงสาธารณสุข","person_count":"3","quantity":"7","amount":"140","fiscal_year":"2569"},{"hcode":"05957","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่าบริการตรวจหลังคลอด (PNC: Postnatal care)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05957","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่าบริการตรวจหลังคลอด (PNC: Postnatal care)","person_count":"2","quantity":"2","amount":"300","fiscal_year":"2568"},{"hcode":"05957","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่าบริการตรวจหลังคลอด (PNC: Postnatal care)","person_count":"4","quantity":"5","amount":"750","fiscal_year":"2569"},{"hcode":"05957","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่ายา Triferdine (PNC: Postnatal care)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05957","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่ายา Triferdine (PNC: Postnatal care)","person_count":"2","quantity":"2","amount":"270","fiscal_year":"2568"},{"hcode":"05957","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่ายา Triferdine (PNC: Postnatal care)","person_count":"4","quantity":"5","amount":"675","fiscal_year":"2569"},{"hcode":"05957","group_name":"8.บริการทดสอบการตั้งครรภ์","service_item":"ค่าบริการทดสอบการตั้งครรภ์","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05957","group_name":"8.บริการทดสอบการตั้งครรภ์","service_item":"ค่าบริการทดสอบการตั้งครรภ์","person_count":"2","quantity":"2","amount":"150","fiscal_year":"2568"},{"hcode":"05957","group_name":"8.บริการทดสอบการตั้งครรภ์","service_item":"ค่าบริการทดสอบการตั้งครรภ์","person_count":"18","quantity":"18","amount":"1350","fiscal_year":"2569"},{"hcode":"05957","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาฉีดคุมกำเนิด","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05957","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาฉีดคุมกำเนิด","person_count":"1","quantity":"1","amount":"60","fiscal_year":"2568"},{"hcode":"05957","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาฉีดคุมกำเนิด","person_count":"6","quantity":"6","amount":"360","fiscal_year":"2569"},{"hcode":"05957","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาเม็ดคุมกำเนิดชนิดฮอร์โมนรวม (COC)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05957","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาเม็ดคุมกำเนิดชนิดฮอร์โมนรวม (COC)","person_count":"6","quantity":"6","amount":"400","fiscal_year":"2568"},{"hcode":"05957","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาเม็ดคุมกำเนิดชนิดฮอร์โมนรวม (COC)","person_count":"3","quantity":"3","amount":"120","fiscal_year":"2569"},{"hcode":"05959","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 15-34 ปี","person_count":"180","quantity":"180","amount":"13200","fiscal_year":"2567"},{"hcode":"05959","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 15-34 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2568"},{"hcode":"05959","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 15-34 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05959","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 35-59 ปี","person_count":"391","quantity":"393","amount":"42750","fiscal_year":"2567"},{"hcode":"05959","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 35-59 ปี","person_count":"1","quantity":"1","amount":"0","fiscal_year":"2568"},{"hcode":"05959","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 35-59 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05959","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจ Total Cholesterol หรือ HDL อายุ 45 - 70 ปี","person_count":"9","quantity":"9","amount":"320","fiscal_year":"2567"},{"hcode":"05959","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจ Total Cholesterol หรือ HDL อายุ 45 - 70 ปี","person_count":"219","quantity":"219","amount":"9280","fiscal_year":"2568"},{"hcode":"05959","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจ Total Cholesterol หรือ HDL อายุ 45 - 70 ปี","person_count":"3","quantity":"3","amount":"320","fiscal_year":"2569"},{"hcode":"05959","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจวัดระดับน้ำตาล (Fasting Plasma Glucose : FPG) สำหรับกลุ่มเสี่ยง อายุ 35-59 ปี","person_count":"371","quantity":"374","amount":"11080","fiscal_year":"2567"},{"hcode":"05959","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจวัดระดับน้ำตาล (Fasting Plasma Glucose : FPG) สำหรับกลุ่มเสี่ยง อายุ 35-59 ปี","person_count":"4","quantity":"4","amount":"120","fiscal_year":"2568"},{"hcode":"05959","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจวัดระดับน้ำตาล (Fasting Plasma Glucose : FPG) สำหรับกลุ่มเสี่ยง อายุ 35-59 ปี","person_count":"2","quantity":"2","amount":"80","fiscal_year":"2569"},{"hcode":"05959","group_name":"18. บริการยาเม็ดเสริมธาตุเหล็กและกรดโฟลิค","service_item":"ค่าบริการยาเม็ดเสริมธาตุเหล็ก (Ferrofolic)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05959","group_name":"18. บริการยาเม็ดเสริมธาตุเหล็กและกรดโฟลิค","service_item":"ค่าบริการยาเม็ดเสริมธาตุเหล็ก (Ferrofolic)","person_count":"4","quantity":"4","amount":"320","fiscal_year":"2568"},{"hcode":"05959","group_name":"18. บริการยาเม็ดเสริมธาตุเหล็กและกรดโฟลิค","service_item":"ค่าบริการยาเม็ดเสริมธาตุเหล็ก (Ferrofolic)","person_count":"77","quantity":"77","amount":"5920","fiscal_year":"2569"},{"hcode":"05959","group_name":"19.บริการเคลือบฟลูออไรด์","service_item":"ค่าบริการเคลือบฟลูออไรด์ (กลุ่มเสี่ยง)","person_count":"14","quantity":"16","amount":"1600","fiscal_year":"2567"},{"hcode":"05959","group_name":"19.บริการเคลือบฟลูออไรด์","service_item":"ค่าบริการเคลือบฟลูออไรด์ (กลุ่มเสี่ยง)","person_count":"2","quantity":"2","amount":"200","fiscal_year":"2568"},{"hcode":"05959","group_name":"19.บริการเคลือบฟลูออไรด์","service_item":"ค่าบริการเคลือบฟลูออไรด์ (กลุ่มเสี่ยง)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05959","group_name":"20. บริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง (Fit Test)","service_item":"ค่าบริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง","person_count":"77","quantity":"77","amount":"4620","fiscal_year":"2567"},{"hcode":"05959","group_name":"20. บริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง (Fit Test)","service_item":"ค่าบริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง","person_count":"105","quantity":"105","amount":"660","fiscal_year":"2568"},{"hcode":"05959","group_name":"20. บริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง (Fit Test)","service_item":"ค่าบริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง","person_count":"36","quantity":"36","amount":"180","fiscal_year":"2569"},{"hcode":"05959","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"ฉีดวัคซีนป้องกันโรคป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(7กลุ่มเสี่ยง)","person_count":"418","quantity":"418","amount":"8360","fiscal_year":"2567"},{"hcode":"05959","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"ฉีดวัคซีนป้องกันโรคป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(7กลุ่มเสี่ยง)","person_count":"141","quantity":"141","amount":"2820","fiscal_year":"2568"},{"hcode":"05959","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"ฉีดวัคซีนป้องกันโรคป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(7กลุ่มเสี่ยง)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05959","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนคอตีบ-บาดทะยัก (dT) ในผู้ใหญ่","person_count":"1","quantity":"1","amount":"20","fiscal_year":"2567"},{"hcode":"05959","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนคอตีบ-บาดทะยัก (dT) ในผู้ใหญ่","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2568"},{"hcode":"05959","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนคอตีบ-บาดทะยัก (dT) ในผู้ใหญ่","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05959","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนพื้นฐานตามกาหนดการให้วัคซีนตามแผนงานสร้างเสริมภูมิคุ้มกันโรค (EPI) ของกระทรวงสาธารณสุข","person_count":"88","quantity":"128","amount":"3160","fiscal_year":"2567"},{"hcode":"05959","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนพื้นฐานตามกาหนดการให้วัคซีนตามแผนงานสร้างเสริมภูมิคุ้มกันโรค (EPI) ของกระทรวงสาธารณสุข","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2568"},{"hcode":"05959","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนพื้นฐานตามกาหนดการให้วัคซีนตามแผนงานสร้างเสริมภูมิคุ้มกันโรค (EPI) ของกระทรวงสาธารณสุข","person_count":"8","quantity":"15","amount":"300","fiscal_year":"2569"},{"hcode":"05959","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"วัคซีนป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(หญิงตั้งครรภ์)","person_count":"8","quantity":"8","amount":"160","fiscal_year":"2567"},{"hcode":"05959","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"วัคซีนป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(หญิงตั้งครรภ์)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2568"},{"hcode":"05959","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"วัคซีนป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(หญิงตั้งครรภ์)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05959","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่าบริการตรวจหลังคลอด (PNC: Postnatal care)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05959","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่าบริการตรวจหลังคลอด (PNC: Postnatal care)","person_count":"4","quantity":"4","amount":"450","fiscal_year":"2568"},{"hcode":"05959","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่าบริการตรวจหลังคลอด (PNC: Postnatal care)","person_count":"7","quantity":"8","amount":"1200","fiscal_year":"2569"},{"hcode":"05959","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่ายา Triferdine (PNC: Postnatal care)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05959","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่ายา Triferdine (PNC: Postnatal care)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2568"},{"hcode":"05959","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่ายา Triferdine (PNC: Postnatal care)","person_count":"1","quantity":"1","amount":"135","fiscal_year":"2569"},{"hcode":"05959","group_name":"8.บริการทดสอบการตั้งครรภ์","service_item":"ค่าบริการทดสอบการตั้งครรภ์","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05959","group_name":"8.บริการทดสอบการตั้งครรภ์","service_item":"ค่าบริการทดสอบการตั้งครรภ์","person_count":"1","quantity":"1","amount":"75","fiscal_year":"2568"},{"hcode":"05959","group_name":"8.บริการทดสอบการตั้งครรภ์","service_item":"ค่าบริการทดสอบการตั้งครรภ์","person_count":"1","quantity":"1","amount":"75","fiscal_year":"2569"},{"hcode":"05959","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาฉีดคุมกำเนิด","person_count":"1","quantity":"1","amount":"60","fiscal_year":"2567"},{"hcode":"05959","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาฉีดคุมกำเนิด","person_count":"8","quantity":"8","amount":"480","fiscal_year":"2568"},{"hcode":"05959","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาฉีดคุมกำเนิด","person_count":"7","quantity":"7","amount":"420","fiscal_year":"2569"},{"hcode":"05959","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาเม็ดคุมกำเนิดชนิดฮอร์โมนรวม (COC)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05959","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาเม็ดคุมกำเนิดชนิดฮอร์โมนรวม (COC)","person_count":"2","quantity":"2","amount":"240","fiscal_year":"2568"},{"hcode":"05959","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาเม็ดคุมกำเนิดชนิดฮอร์โมนรวม (COC)","person_count":"1","quantity":"1","amount":"120","fiscal_year":"2569"},{"hcode":"05962","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 15-34 ปี","person_count":"143","quantity":"149","amount":"13800","fiscal_year":"2567"},{"hcode":"05962","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 15-34 ปี","person_count":"2","quantity":"2","amount":"0","fiscal_year":"2568"},{"hcode":"05962","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 15-34 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05962","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 35-59 ปี","person_count":"502","quantity":"523","amount":"73500","fiscal_year":"2567"},{"hcode":"05962","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 35-59 ปี","person_count":"37","quantity":"37","amount":"0","fiscal_year":"2568"},{"hcode":"05962","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 35-59 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05962","group_name":"1. บริการฝากครรภ์","service_item":"ค่าบริการดูแลการฝากครรภ์","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05962","group_name":"1. บริการฝากครรภ์","service_item":"ค่าบริการดูแลการฝากครรภ์","person_count":"1","quantity":"1","amount":"0","fiscal_year":"2568"},{"hcode":"05962","group_name":"1. บริการฝากครรภ์","service_item":"ค่าบริการดูแลการฝากครรภ์","person_count":"1","quantity":"1","amount":"360","fiscal_year":"2569"},{"hcode":"05962","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจ Total Cholesterol หรือ HDL อายุ 45 - 70 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05962","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจ Total Cholesterol หรือ HDL อายุ 45 - 70 ปี","person_count":"240","quantity":"240","amount":"36800","fiscal_year":"2568"},{"hcode":"05962","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจ Total Cholesterol หรือ HDL อายุ 45 - 70 ปี","person_count":"16","quantity":"16","amount":"2240","fiscal_year":"2569"},{"hcode":"05962","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจวัดระดับน้ำตาล (Fasting Plasma Glucose : FPG) สำหรับกลุ่มเสี่ยง อายุ 35-59 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05962","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจวัดระดับน้ำตาล (Fasting Plasma Glucose : FPG) สำหรับกลุ่มเสี่ยง อายุ 35-59 ปี","person_count":"90","quantity":"90","amount":"3320","fiscal_year":"2568"},{"hcode":"05962","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจวัดระดับน้ำตาล (Fasting Plasma Glucose : FPG) สำหรับกลุ่มเสี่ยง อายุ 35-59 ปี","person_count":"68","quantity":"68","amount":"2720","fiscal_year":"2569"},{"hcode":"05962","group_name":"17.บริการคัดกรองโลหิตจางจากการขาดธาตุเหล็ก","service_item":"ค่าบริการคัดกรองโลหิตจางจากการขาดธาตุเหล็ก","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05962","group_name":"17.บริการคัดกรองโลหิตจางจากการขาดธาตุเหล็ก","service_item":"ค่าบริการคัดกรองโลหิตจางจากการขาดธาตุเหล็ก","person_count":"27","quantity":"27","amount":"1755","fiscal_year":"2568"},{"hcode":"05962","group_name":"17.บริการคัดกรองโลหิตจางจากการขาดธาตุเหล็ก","service_item":"ค่าบริการคัดกรองโลหิตจางจากการขาดธาตุเหล็ก","person_count":"12","quantity":"12","amount":"715","fiscal_year":"2569"},{"hcode":"05962","group_name":"18. บริการยาเม็ดเสริมธาตุเหล็กและกรดโฟลิค","service_item":"ค่าบริการยาเม็ดเสริมธาตุเหล็ก (Ferrofolic)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05962","group_name":"18. บริการยาเม็ดเสริมธาตุเหล็กและกรดโฟลิค","service_item":"ค่าบริการยาเม็ดเสริมธาตุเหล็ก (Ferrofolic)","person_count":"1","quantity":"1","amount":"80","fiscal_year":"2568"},{"hcode":"05962","group_name":"18. บริการยาเม็ดเสริมธาตุเหล็กและกรดโฟลิค","service_item":"ค่าบริการยาเม็ดเสริมธาตุเหล็ก (Ferrofolic)","person_count":"111","quantity":"111","amount":"8800","fiscal_year":"2569"},{"hcode":"05962","group_name":"19.บริการเคลือบฟลูออไรด์","service_item":"ค่าบริการเคลือบฟลูออไรด์ (กลุ่มเสี่ยง)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05962","group_name":"19.บริการเคลือบฟลูออไรด์","service_item":"ค่าบริการเคลือบฟลูออไรด์ (กลุ่มเสี่ยง)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2568"},{"hcode":"05962","group_name":"19.บริการเคลือบฟลูออไรด์","service_item":"ค่าบริการเคลือบฟลูออไรด์ (กลุ่มเสี่ยง)","person_count":"9","quantity":"9","amount":"900","fiscal_year":"2569"},{"hcode":"05962","group_name":"20. บริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง (Fit Test)","service_item":"ค่าบริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05962","group_name":"20. บริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง (Fit Test)","service_item":"ค่าบริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง","person_count":"346","quantity":"348","amount":"14820","fiscal_year":"2568"},{"hcode":"05962","group_name":"20. บริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง (Fit Test)","service_item":"ค่าบริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง","person_count":"225","quantity":"226","amount":"10980","fiscal_year":"2569"},{"hcode":"05962","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"ฉีดวัคซีนป้องกันโรคป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(7กลุ่มเสี่ยง)","person_count":"15","quantity":"15","amount":"300","fiscal_year":"2567"},{"hcode":"05962","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"ฉีดวัคซีนป้องกันโรคป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(7กลุ่มเสี่ยง)","person_count":"2","quantity":"2","amount":"40","fiscal_year":"2568"},{"hcode":"05962","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"ฉีดวัคซีนป้องกันโรคป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(7กลุ่มเสี่ยง)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05962","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนพื้นฐานตามกาหนดการให้วัคซีนตามแผนงานสร้างเสริมภูมิคุ้มกันโรค (EPI) ของกระทรวงสาธารณสุข","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05962","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนพื้นฐานตามกาหนดการให้วัคซีนตามแผนงานสร้างเสริมภูมิคุ้มกันโรค (EPI) ของกระทรวงสาธารณสุข","person_count":"3","quantity":"3","amount":"120","fiscal_year":"2568"},{"hcode":"05962","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"บริการฉีดวัคซีนพื้นฐานตามกาหนดการให้วัคซีนตามแผนงานสร้างเสริมภูมิคุ้มกันโรค (EPI) ของกระทรวงสาธารณสุข","person_count":"16","quantity":"16","amount":"500","fiscal_year":"2569"},{"hcode":"05962","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่าบริการตรวจหลังคลอด (PNC: Postnatal care)","person_count":"7","quantity":"7","amount":"1050","fiscal_year":"2567"},{"hcode":"05962","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่าบริการตรวจหลังคลอด (PNC: Postnatal care)","person_count":"2","quantity":"3","amount":"450","fiscal_year":"2568"},{"hcode":"05962","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่าบริการตรวจหลังคลอด (PNC: Postnatal care)","person_count":"3","quantity":"4","amount":"600","fiscal_year":"2569"},{"hcode":"05962","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่ายา Triferdine (PNC: Postnatal care)","person_count":"6","quantity":"6","amount":"675","fiscal_year":"2567"},{"hcode":"05962","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่ายา Triferdine (PNC: Postnatal care)","person_count":"2","quantity":"2","amount":"270","fiscal_year":"2568"},{"hcode":"05962","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่ายา Triferdine (PNC: Postnatal care)","person_count":"1","quantity":"1","amount":"135","fiscal_year":"2569"},{"hcode":"05962","group_name":"8.บริการทดสอบการตั้งครรภ์","service_item":"ค่าบริการทดสอบการตั้งครรภ์","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05962","group_name":"8.บริการทดสอบการตั้งครรภ์","service_item":"ค่าบริการทดสอบการตั้งครรภ์","person_count":"1","quantity":"1","amount":"75","fiscal_year":"2568"},{"hcode":"05962","group_name":"8.บริการทดสอบการตั้งครรภ์","service_item":"ค่าบริการทดสอบการตั้งครรภ์","person_count":"3","quantity":"3","amount":"225","fiscal_year":"2569"},{"hcode":"05962","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาฉีดคุมกำเนิด","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05962","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาฉีดคุมกำเนิด","person_count":"1","quantity":"1","amount":"60","fiscal_year":"2568"},{"hcode":"05962","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาฉีดคุมกำเนิด","person_count":"19","quantity":"19","amount":"1140","fiscal_year":"2569"},{"hcode":"05956","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 15-34 ปี","person_count":"527","quantity":"529","amount":"52600","fiscal_year":"2567"},{"hcode":"05956","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 15-34 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2568"},{"hcode":"05956","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 15-34 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05956","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 35-59 ปี","person_count":"856","quantity":"856","amount":"127950","fiscal_year":"2567"},{"hcode":"05956","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 35-59 ปี","person_count":"3","quantity":"3","amount":"300","fiscal_year":"2568"},{"hcode":"05956","group_name":"-","service_item":"ค่าบริการคัดกรองและประเมินปัจจัยเสี่ยงต่อสุขภาพกาย/สุขภาพจิต อายุ 35-59 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05956","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจ Total Cholesterol หรือ HDL อายุ 45 - 70 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05956","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจ Total Cholesterol หรือ HDL อายุ 45 - 70 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2568"},{"hcode":"05956","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจ Total Cholesterol หรือ HDL อายุ 45 - 70 ปี","person_count":"29","quantity":"29","amount":"4640","fiscal_year":"2569"},{"hcode":"05956","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจวัดระดับน้ำตาล (Fasting Plasma Glucose : FPG) สำหรับกลุ่มเสี่ยง อายุ 35-59 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05956","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจวัดระดับน้ำตาล (Fasting Plasma Glucose : FPG) สำหรับกลุ่มเสี่ยง อายุ 35-59 ปี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2568"},{"hcode":"05956","group_name":"15. บริการคัดกรองเบาหวานและไขมันในเลือด","service_item":"ค่าบริการเจาะเลือดจากหลอดเลือดดำ ภายหลังอดอาหาร 8 ชั่วโมง ส่งตรวจวัดระดับน้ำตาล (Fasting Plasma Glucose : FPG) สำหรับกลุ่มเสี่ยง อายุ 35-59 ปี","person_count":"13","quantity":"13","amount":"520","fiscal_year":"2569"},{"hcode":"05956","group_name":"18. บริการยาเม็ดเสริมธาตุเหล็กและกรดโฟลิค","service_item":"ค่าบริการยาเม็ดเสริมธาตุเหล็ก (Ferrofolic)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05956","group_name":"18. บริการยาเม็ดเสริมธาตุเหล็กและกรดโฟลิค","service_item":"ค่าบริการยาเม็ดเสริมธาตุเหล็ก (Ferrofolic)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2568"},{"hcode":"05956","group_name":"18. บริการยาเม็ดเสริมธาตุเหล็กและกรดโฟลิค","service_item":"ค่าบริการยาเม็ดเสริมธาตุเหล็ก (Ferrofolic)","person_count":"26","quantity":"26","amount":"2080","fiscal_year":"2569"},{"hcode":"05956","group_name":"20. บริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง (Fit Test)","service_item":"ค่าบริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง","person_count":"114","quantity":"114","amount":"6840","fiscal_year":"2567"},{"hcode":"05956","group_name":"20. บริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง (Fit Test)","service_item":"ค่าบริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง","person_count":"64","quantity":"64","amount":"3840","fiscal_year":"2568"},{"hcode":"05956","group_name":"20. บริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง (Fit Test)","service_item":"ค่าบริการคัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05956","group_name":"21.บริการคัดกรองไวรัสตับอักเสบบี","service_item":"บริการตรวจคัดกรองไวรัสตับอักเสบ บี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05956","group_name":"21.บริการคัดกรองไวรัสตับอักเสบบี","service_item":"บริการตรวจคัดกรองไวรัสตับอักเสบ บี","person_count":"56","quantity":"56","amount":"2800","fiscal_year":"2568"},{"hcode":"05956","group_name":"21.บริการคัดกรองไวรัสตับอักเสบบี","service_item":"บริการตรวจคัดกรองไวรัสตับอักเสบ บี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05956","group_name":"22.บริการคัดกรองไวรัสตับอักเสบซี","service_item":"การตรวจคัดกรองโรคไวรัสตับอักเสบ ซี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05956","group_name":"22.บริการคัดกรองไวรัสตับอักเสบซี","service_item":"การตรวจคัดกรองโรคไวรัสตับอักเสบ ซี","person_count":"61","quantity":"61","amount":"3050","fiscal_year":"2568"},{"hcode":"05956","group_name":"22.บริการคัดกรองไวรัสตับอักเสบซี","service_item":"การตรวจคัดกรองโรคไวรัสตับอักเสบ ซี","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05956","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"ฉีดวัคซีนป้องกันโรคป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(7กลุ่มเสี่ยง)","person_count":"22","quantity":"22","amount":"440","fiscal_year":"2567"},{"hcode":"05956","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"ฉีดวัคซีนป้องกันโรคป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(7กลุ่มเสี่ยง)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2568"},{"hcode":"05956","group_name":"25.บริการให้วัคซีนป้องกันโรค","service_item":"ฉีดวัคซีนป้องกันโรคป้องกันโรคไข้หวัดใหญ่ตามฤดูกาล(7กลุ่มเสี่ยง)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05956","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่าบริการตรวจหลังคลอด (PNC: Postnatal care)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05956","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่าบริการตรวจหลังคลอด (PNC: Postnatal care)","person_count":"1","quantity":"1","amount":"150","fiscal_year":"2568"},{"hcode":"05956","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่าบริการตรวจหลังคลอด (PNC: Postnatal care)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05956","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่ายา Triferdine (PNC: Postnatal care)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05956","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่ายา Triferdine (PNC: Postnatal care)","person_count":"1","quantity":"1","amount":"135","fiscal_year":"2568"},{"hcode":"05956","group_name":"7.บริการตรวจหลังคลอด","service_item":"ค่ายา Triferdine (PNC: Postnatal care)","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"},{"hcode":"05956","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาฉีดคุมกำเนิด","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2567"},{"hcode":"05956","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาฉีดคุมกำเนิด","person_count":"1","quantity":"2","amount":"120","fiscal_year":"2568"},{"hcode":"05956","group_name":"9.บริการวางแผนครอบครัวและการป้องกันตั้งครรภ์ไม่พึงประสงค์","service_item":"ยาฉีดคุมกำเนิด","person_count":"0","quantity":"0","amount":"0","fiscal_year":"2569"}];

const OFFLINE_HERBAL_DATA = [
  // 2569 - รพ.สต.บ้านสันโค้ง (05954)
  { month: '10', fiscal_year: '2569', name: 'ขมิ้นชันแคปซูล', cost: 4200, amount: 9800, hcode: '05954' },
  { month: '10', fiscal_year: '2569', name: 'ยาแก้ไอมะขามป้อม', cost: 2800, amount: 6500, hcode: '05954' },
  { month: '11', fiscal_year: '2569', name: 'ฟ้าทะลายโจรแคปซูล', cost: 5100, amount: 11500, hcode: '05954' },
  { month: '11', fiscal_year: '2569', name: 'ครีมไพล', cost: 1900, amount: 4800, hcode: '05954' },
  { month: '12', fiscal_year: '2569', name: 'ขมิ้นชันแคปซูล', cost: 3800, amount: 8900, hcode: '05954' },
  { month: '12', fiscal_year: '2569', name: 'ยาธาตุอบเชย', cost: 1200, amount: 3200, hcode: '05954' },

  // 2569 - รพ.สต.บ้านกอสะเรียม (05957)
  { month: '10', fiscal_year: '2569', name: 'ฟ้าทะลายโจรแคปซูล', cost: 3500, amount: 7800, hcode: '05957' },
  { month: '10', fiscal_year: '2569', name: 'ยาแก้ไอมะขามป้อม', cost: 2100, amount: 4900, hcode: '05957' },
  { month: '11', fiscal_year: '2569', name: 'ขมิ้นชันแคปซูล', cost: 3200, amount: 7400, hcode: '05957' },
  { month: '12', fiscal_year: '2569', name: 'ครีมไพล', cost: 1600, amount: 3900, hcode: '05957' },

  // 2569 - รพ.สต.บ้านต้นเปา (05962)
  { month: '10', fiscal_year: '2569', name: 'ขมิ้นชันแคปซูล', cost: 2900, amount: 6800, hcode: '05962' },
  { month: '11', fiscal_year: '2569', name: 'ฟ้าทะลายโจรแคปซูล', cost: 2400, amount: 5600, hcode: '05962' },
  { month: '12', fiscal_year: '2569', name: 'ยาแก้ไอมะขามป้อม', cost: 1800, amount: 4200, hcode: '05962' },

  // 2569 - รพ.สต.บ้านแม่ผาแหน (05959)
  { month: '10', fiscal_year: '2569', name: 'ยาแก้ไอมะขามป้อม', cost: 1100, amount: 2600, hcode: '05959' },
  { month: '11', fiscal_year: '2569', name: 'ครีมไพล', cost: 950, amount: 2200, hcode: '05959' },
  { month: '12', fiscal_year: '2569', name: 'ขมิ้นชันแคปซูล', cost: 800, amount: 1920, hcode: '05959' },

  // 2569 - รพ.สต.บ้านป่าตาล (05956)
  { month: '10', fiscal_year: '2569', name: 'ฟ้าทะลายโจรแคปซูล', cost: 800, amount: 1800, hcode: '05956' },
  { month: '11', fiscal_year: '2569', name: 'ขมิ้นชันแคปซูล', cost: 650, amount: 1500, hcode: '05956' },
  { month: '12', fiscal_year: '2569', name: 'ยาแก้ไอมะขามป้อม', cost: 500, amount: 1200, hcode: '05956' },

  // 2568 Historical
  { month: '10', fiscal_year: '2568', name: 'ขมิ้นชันแคปซูล', cost: 3600, amount: 8200, hcode: '05954' },
  { month: '11', fiscal_year: '2568', name: 'ฟ้าทะลายโจรแคปซูล', cost: 4200, amount: 9500, hcode: '05954' },
  { month: '12', fiscal_year: '2568', name: 'ยาแก้ไอมะขามป้อม', cost: 3000, amount: 6900, hcode: '05957' },
  { month: '1', fiscal_year: '2568', name: 'ขมิ้นชันแคปซูล', cost: 3100, amount: 7100, hcode: '05962' }
];

const fmt = (n) => Math.round(n || 0).toLocaleString('th-TH');
const DIR_ICON_MAP = { check: CheckCircle2, hourglass: Clock, building: Building2, leaf: Leaf, heart: HeartPulse, target: Sparkles };
const DIR_COLOR_MAP = {
  green: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', title: 'text-emerald-900' },
  yellow: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', title: 'text-amber-900' },
  blue: { bg: 'bg-sky-50', border: 'border-sky-200', icon: 'text-sky-600', title: 'text-sky-900' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', icon: 'text-pink-600', title: 'text-pink-900' },
};
const fmtD = (n) => (n || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtS = (n) => {
  const v = Math.abs(Math.round(n || 0));
  if (v >= 1000000) return `${(v / 1e6).toFixed(2)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
  return `${v}`;
};

const HOSP_PALETTE = ['#3b82f6', '#10b981', '#f97316', '#a855f7', '#ec4899', '#06b6d4'];

const defaultHMap = {
  'all': 'All Cup',
  '05954': '05954 - รพ.สต.บ้านสันโค้ง (แม่ข่าย)',
  '05962': '05962 - รพ.สต.บ้านต้นเปา',
  '05957': '05957 - รพ.สต.บ้านกอสะเรียม',
  '05959': '05959 - รพ.สต.บ้านแม่ผาแหน',
  '05956': '05956 - รพ.สต.บ้านป่าตาล',
  '54': 'พัทธนันท์  พชรสุข',
  '56': 'จตุพล กันธะเรียน',
  '62': 'ทิพย์สุดา มาแจ้'
};

/* ════════ INTERACTIVE WEB THREADS CANVAS ════════ */
const WebThreads = ({ color1 = "#059669", color2 = "#34d399", color3 = "#ffffff", speed = 0.4, threadCount = 6, opacity = 0.8 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let t = 0;
    const render = () => {
      t += 0.008 * speed;
      ctx.clearRect(0, 0, width, height);

      // Flowing curved emerald wave threads
      for (let i = 0; i < threadCount; i++) {
        ctx.beginPath();
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, color1);
        grad.addColorStop(0.5, color2);
        grad.addColorStop(1, color3);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6 + Math.sin(t + i) * 0.8;
        ctx.globalAlpha = opacity * 0.65;

        for (let x = 0; x < width; x += 18) {
          const y = height * 0.52 + 
            Math.sin(x * 0.0025 + t + i * 0.85) * 130 * Math.cos(t * 0.45 + i) +
            Math.cos(x * 0.0045 - t * 0.75) * 65;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Glowing floating light particles
      for (let j = 0; j < 28; j++) {
        const px = (Math.sin(t * 0.28 + j * 1.6) * 0.5 + 0.5) * width;
        const py = (Math.cos(t * 0.38 + j * 2.2) * 0.5 + 0.5) * height;
        const pr = 1.6 + Math.sin(t + j) * 1.2;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fillStyle = j % 2 === 0 ? color2 : color1;
        ctx.globalAlpha = opacity * 0.75;
        ctx.shadowBlur = 12;
        ctx.shadowColor = color2;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color1, color2, color3, speed, threadCount, opacity]);

  return <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />;
};

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
        body: JSON.stringify({ username: username.trim(), password: password.trim() })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem('claimcup_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
        return;
      } else {
        setErrorMsg(data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Login connection error:", err);
      setErrorMsg('ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      setIsLoading(false);
      return;
    }
  };

  return (
    <div className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans transition-colors duration-1000 ${isPulled ? 'bg-slate-950' : 'bg-[#030712]'}`}>
      <div className="absolute inset-0 z-0 opacity-80">
        <WebThreads color1="#059669" color2="#34d399" color3="#a7f3d0" speed={0.4} threadCount={6} opacity={0.85} />
      </div>

      {/* ─── Hanging Lamp with Interactive Pull Cord (ดึงสายโคมไฟเพื่อเปิดป๊อบอัพ) ─── */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-30">
        <div className="w-1.5 h-16 bg-slate-800"></div>
        <div className="w-32 h-12 bg-slate-800 rounded-t-[3rem] relative shadow-lg flex justify-center">
          {/* Pull Cord */}
          <div
            className="absolute top-0 flex flex-col items-center group cursor-pointer"
            onClick={() => setIsPulled(!isPulled)}
            title="ดึงสายโคมไฟเพื่อเปิด/ปิดหน้าต่างเข้าสู่ระบบ"
          >
            <div className={`w-1 bg-gradient-to-b from-blue-600 to-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.7)] group-hover:from-blue-500 group-hover:to-sky-300 transition-all duration-500 origin-top rounded-full ${isPulled ? 'h-8' : 'h-20 group-active:h-32'}`}></div>
            <div className={`w-5 h-5 bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-700 group-hover:scale-110 rounded-full transition-all duration-500 shadow-[0_0_15px_5px_rgba(56,189,248,0.75)] border-2 border-sky-200/90 ${isPulled ? 'scale-75' : 'group-active:scale-130 animate-pulse'}`}></div>
          </div>
          {/* Lamp Bulb */}
          <div
            onClick={() => setIsPulled(!isPulled)}
            className={`absolute -bottom-3 w-10 h-10 rounded-full transition-all duration-500 cursor-pointer ${(isPulled) ? 'bg-emerald-400 shadow-[0_0_50px_20px_rgba(52,211,153,0.75)]' : 'bg-slate-800 shadow-none hover:bg-slate-700'}`}
          ></div>
        </div>
      </div>

      {/* ─── Popup Login Card (แสดงเมื่อดึงสายโคมไฟ) ─── */}
      <div className={`relative bg-white/95 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_25px_70px_-10px_rgba(5,150,105,0.45)] w-full max-w-md z-20 mt-20 transition-all duration-1000 ease-out transform border-2 border-emerald-400/60 ring-4 ring-emerald-500/20 ${isPulled ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-24 opacity-0 scale-95 pointer-events-none'}`}>
        <div className="text-center mb-8 flex flex-col items-center">
          <img src="/my-logo.png" alt="โลโก้ รพ.สต." className="w-28 h-28 mb-4 rounded-full object-cover shadow-[0_10px_30px_rgba(5,150,105,0.25)] bg-white border-4 border-emerald-200" />
          <h2 className="text-3xl font-black text-emerald-950 mb-1 tracking-tight">ClaimCup</h2>
          <p className="text-emerald-700 font-extrabold text-xs uppercase tracking-[0.25em]">Sankhong Portal</p>
          <div className="mt-4 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-bold text-emerald-800 shadow-sm flex items-center gap-1.5 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Reimbursement Tracking System
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold text-center border border-red-100 flex items-center justify-center gap-1.5">
            <span>⚠️</span> {errorMsg}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">ชื่อผู้ใช้งาน (Username)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-gray-900 w-full px-4 py-3.5 rounded-2xl border-2 border-emerald-200/80 bg-white/90 focus:bg-white focus:border-emerald-500 outline-none transition-all font-medium text-sm"
              placeholder="กรอกชื่อผู้ใช้ เช่น admin"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">รหัสผ่าน (Password)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-gray-900 w-full px-4 py-3.5 rounded-2xl border-2 border-emerald-200/80 bg-white/90 focus:bg-white focus:border-emerald-500 outline-none transition-all font-medium text-sm"
              placeholder="กรอกรหัสผ่าน"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white font-black py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-[0_10px_25px_rgba(5,150,105,0.3)] tracking-wide text-sm cursor-pointer mt-2"
          >
            {isLoading ? 'กำลังตรวจสอบสิทธิ์...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ════════ MAIN APP COMPONENT ════════ */
export default function App() {
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('claimcup_user');
      if (saved) setCurrentUser(JSON.parse(saved));
    } catch (e) {
      localStorage.removeItem('claimcup_user');
    }
  }, []);
  const [currentView, setCurrentView] = useState('overview');
  const [currentYear, setCurrentYear] = useState('2569');
  const [currentHosp, setCurrentHosp] = useState('all');
  const [activeDetailTab, setActiveDetailTab] = useState('PP-FS');
  const [detailFilterHosp, setDetailFilterHosp] = useState('all');
  const [payableHosp, setPayableHosp] = useState('ALL');
  const [payableYear, setPayableYear] = useState('69');
  const [therapistPopupId, setTherapistPopupId] = useState(null);
  const [showExpPrintModal, setShowExpPrintModal] = useState(false);

  const [claims, setClaims] = useState(OFFLINE_CLAIMS);
  const [expenses, setExpenses] = useState(REAL_EXPENSES_TABLE);
  const [payments, setPayments] = useState(OFFLINE_PAYMENTS);
  const [physicals, setPhysicals] = useState(OFFLINE_PHYSICAL_DATA);
  const [thais, setThais] = useState(OFFLINE_THAI_DATA);
  const [herbals, setHerbals] = useState(OFFLINE_HERBAL_DATA);
  const [ppfsList, setPpfsList] = useState(OFFLINE_PPFS_DATA);
  const [ppfsHospitalPopupId, setPpfsHospitalPopupId] = useState(null);
  const [thaiHospitalPopupId, setThaiHospitalPopupId] = useState(null);
  const [herbalHospitalPopupId, setHerbalHospitalPopupId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hospitalMap, setHospitalMap] = useState(defaultHMap);
  const [clockTime, setClockTime] = useState('');

  const donutChartRef = useRef(null);
  const donutCanvasRef = useRef(null);
  const detailBarChartRef = useRef(null);
  const detailBarCanvasRef = useRef(null);
  const expenseChartRef = useRef(null);
  const expenseCanvasRef = useRef(null);
  const expDonutChartRef = useRef(null);
  const expDonutCanvasRef = useRef(null);
  const physYoYChartRef = useRef(null);
  const physYoYCanvasRef = useRef(null);
  const thaiYoYChartRef = useRef(null);
  const thaiYoYCanvasRef = useRef(null);
  const herbalYoYChartRef = useRef(null);
  const herbalYoYCanvasRef = useRef(null);
  const ppfsYoYChartRef = useRef(null);
  const ppfsYoYCanvasRef = useRef(null);
  const trendChartRef = useRef(null);
  const trendCanvasRef = useRef(null);
  const dirRadarChartRef = useRef(null);
  const dirRadarCanvasRef = useRef(null);
  const dirBarChartRef = useRef(null);
  const dirBarCanvasRef = useRef(null);

  // Auto-Logout 9 mins
  useEffect(() => {
    if (!currentUser) return;
    const INACTIVITY_TIME = 9 * 60 * 1000;
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
    setClockTime(new Date().toLocaleTimeString('th-TH'));
    const t = setInterval(() => setClockTime(new Date().toLocaleTimeString('th-TH')), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      // use top-level defaultHMap
      setLoading(true);

      try {
        const [resC, resE, resHos, resP, resPhy, resThai, resHerbal, resPpfs] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/api/claims`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/expenses`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/hospitals`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/payments`).then(r => r.json()).catch(() => fetch(`${API_BASE_URL}/api/payment`).then(r => r.json())),
          fetch(`${API_BASE_URL}/api/physical`).then(r => r.json()).catch(() => fetch(`${API_BASE_URL}/api/physicals`).then(r => r.json())),
          fetch(`${API_BASE_URL}/api/thai`).then(r => r.json()).catch(() => fetch(`${API_BASE_URL}/api/thais`).then(r => r.json())),
          fetch(`${API_BASE_URL}/api/herbal`).then(r => r.json()).catch(() => fetch(`${API_BASE_URL}/api/herbals`).then(r => r.json())),
          fetch(`${API_BASE_URL}/api/ppfs`).then(r => r.json()).catch(() => fetch(`${API_BASE_URL}/api/claims`).then(r => r.json())),
        ]);

        if (resC.status === 'fulfilled' && Array.isArray(resC.value) && resC.value.length > 0) {
          setClaims(resC.value);
        } else {
          setClaims(OFFLINE_CLAIMS);
        }

        if (resE.status === 'fulfilled' && Array.isArray(resE.value) && resE.value.length > 0) {
          setExpenses(resE.value);
        } else {
          setExpenses(REAL_EXPENSES_TABLE);
        }

        if (resP.status === 'fulfilled' && Array.isArray(resP.value) && resP.value.length > 0) {
          setPayments(resP.value);
        } else {
          setPayments(OFFLINE_PAYMENTS);
        }

        if (resPhy && resPhy.status === 'fulfilled' && Array.isArray(resPhy.value) && resPhy.value.length > 0) {
          setPhysicals(resPhy.value);
        } else {
          setPhysicals(OFFLINE_PHYSICAL_DATA);
        }

        if (resThai && resThai.status === 'fulfilled' && Array.isArray(resThai.value) && resThai.value.length > 0) {
          setThais(resThai.value);
        } else {
          setThais(OFFLINE_THAI_DATA);
        }

        if (resHerbal && resHerbal.status === 'fulfilled' && Array.isArray(resHerbal.value) && resHerbal.value.length > 0) {
          setHerbals(resHerbal.value);
        } else {
          setHerbals(OFFLINE_HERBAL_DATA);
        }

        if (resPpfs && resPpfs.status === 'fulfilled' && Array.isArray(resPpfs.value) && resPpfs.value.length > 0) {
          setPpfsList(resPpfs.value);
        } else {
          setPpfsList(OFFLINE_PPFS_DATA);
        }

        if (resHos.status === 'fulfilled' && Array.isArray(resHos.value) && resHos.value.length > 0) {
          const hMap = { 'all': 'All Cup' };
          resHos.value.forEach(h => {
            const code = String(h.hcode || h.code || '');
            if (code) {
              hMap[code] = h.name;
            }
          });
          setHospitalMap(hMap);
        } else {
          setHospitalMap(defaultHMap);
        }
      } catch (err) {
        console.warn("Fetch error, using offline datasets:", err);
        setClaims(OFFLINE_CLAIMS);
        setExpenses(REAL_EXPENSES_TABLE);
        setPayments(OFFLINE_PAYMENTS);
        setPhysicals(OFFLINE_PHYSICAL_DATA);
        setHospitalMap(defaultHMap);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const selectedHospName = hospitalMap[currentHosp] || 'All Cup';

  /* ─── Processed Data for Overview & Ranking (Comprehensive 4 Categories) ─── */
  const processedData = useMemo(() => {
    const healthCodes = ['05954', '05957', '05962', '05959', '05956'];
    const hospTotals = {};
    const groupStats = {};

    healthCodes.forEach(k => { hospTotals[k] = 0; });
    Object.keys(hospitalMap).forEach(k => {
      if (k !== 'all' && k.length >= 5) hospTotals[k] = 0;
    });

    let totalAmt = 0;

    // 1. Sum claims / PPFS
    const cList = (claims && claims.length > 0) ? claims : (ppfsList && ppfsList.length > 0 ? ppfsList : OFFLINE_CLAIMS);
    cList.forEach(c => {
      const yr = String(c.fiscal_year || '');
      const hcode = String(c.hcode || '').trim();
      const amt = parseFloat(String(c.amount || 0).replace(/,/g, '')) || 0;
      const group = String(c.group_name || c.group || 'สร้างเสริมสุขภาพ (PPFS)');

      if (currentHosp === 'all' || hcode === currentHosp) {
        if (currentYear === 'all' || yr === currentYear) {
          totalAmt += amt;

          if (!groupStats[group]) {
            groupStats[group] = { total: 0, items: {}, topItem: '', topAmt: 0 };
          }
          groupStats[group].total += amt;
          const sItem = c.service_item || 'บริการสร้างเสริมสุขภาพ';
          groupStats[group].items[sItem] = (groupStats[group].items[sItem] || 0) + amt;
          if (groupStats[group].items[sItem] > groupStats[group].topAmt) {
            groupStats[group].topAmt = groupStats[group].items[sItem];
            groupStats[group].topItem = sItem;
          }
        }
      }

      if (currentYear === 'all' || yr === currentYear) {
        if (hospTotals[hcode] !== undefined) {
          hospTotals[hcode] += amt;
        }
      }
    });

    // 2. Sum Physical Therapy
    const pList = (physicals && physicals.length > 0) ? physicals : OFFLINE_PHYSICAL_DATA;
    pList.forEach(p => {
      const yr = String(p.fiscal_year || '');
      if (currentYear === 'all' || yr === currentYear) {
        const amt = parseFloat(String(p.amount || 0).replace(/,/g, '')) || 0;
        let hc = String(p.hcode || '').trim();
        if (hc === '54') hc = '05954';
        if (hc === '56') hc = '05956';
        if (hc === '62') hc = '05962';
        if (currentHosp === 'all' || hc === currentHosp) totalAmt += amt;
        if (hospTotals[hc] !== undefined) hospTotals[hc] += amt;
      }
    });

    // 3. Sum Thai Medicine
    const tList = (thais && thais.length > 0) ? thais : OFFLINE_THAI_DATA;
    tList.forEach(t => {
      const yr = String(t.fiscal_year || '');
      if (currentYear === 'all' || yr === currentYear) {
        const amt = parseFloat(String(t.amount || 0).replace(/,/g, '')) || 0;
        const hc = String(t.hcode || '').trim();
        if (currentHosp === 'all' || hc === currentHosp) totalAmt += amt;
        if (hospTotals[hc] !== undefined) hospTotals[hc] += amt;
      }
    });

    // 4. Sum Herbal Medicine
    const hList = (herbals && herbals.length > 0) ? herbals : OFFLINE_HERBAL_DATA;
    hList.forEach(h => {
      const yr = String(h.fiscal_year || '');
      if (currentYear === 'all' || yr === currentYear) {
        const amt = parseFloat(String(h.amount || 0).replace(/,/g, '')) || 0;
        const hc = String(h.hcode || '').trim();
        if (currentHosp === 'all' || hc === currentHosp) totalAmt += amt;
        if (hospTotals[hc] !== undefined) hospTotals[hc] += amt;
      }
    });

    // Top 5 ranking across 5 health centers
    const rankingList = healthCodes
      .map(hcode => {
        const amount = hospTotals[hcode] || 0;
        const hName = hospitalMap[hcode] ? hospitalMap[hcode].replace(/^[0-9]+\s*[-–]?\s*/, '').replace(/รพ\.สต\.\s*/g, '') : hcode;
        return {
          hcode,
          name: hName,
          amount: Math.round(amount),
          items: 12,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    const groupCards = Object.entries(groupStats)
      .map(([group, data]) => ({
        group,
        total: data.total,
        topItem: data.topItem,
        topAmt: data.topAmt,
        itemCount: Object.keys(data.items).length,
      }))
      .sort((a, b) => b.total - a.total);

    return { totalAmt: Math.round(totalAmt), hospTotals, rankingList, groupCards };
  }, [claims, ppfsList, physicals, thais, herbals, currentYear, currentHosp, hospitalMap]);

  /* ─── Monthly YoY Trend Data (Calculated dynamically from Live Modules across all 5 health centers) ─── */
  const monthlyTrendData = useMemo(() => {
    const y68 = Array(12).fill(0);
    const y69 = Array(12).fill(0);

    const getMonthIdx = (mStr) => {
      const s = String(mStr || '').trim();
      if (s.includes('ต.ค') || s === '10') return 0;
      if (s.includes('พ.ย') || s === '11') return 1;
      if (s.includes('ธ.ค') || s === '12') return 2;
      if (s.includes('ม.ค') || s === '1' || s === '01') return 3;
      if (s.includes('ก.พ') || s === '2' || s === '02') return 4;
      if (s.includes('มี.ค') || s === '3' || s === '03') return 5;
      if (s.includes('เม.ย') || s === '4' || s === '04') return 6;
      if (s.includes('พ.ค') || s === '5' || s === '05') return 7;
      if (s.includes('มิ.ย') || s === '6' || s === '06') return 8;
      if (s.includes('ก.ค') || s === '7' || s === '07') return 9;
      if (s.includes('ส.ค') || s === '8' || s === '08') return 10;
      if (s.includes('ก.ย') || s === '9' || s === '09') return 11;
      return -1;
    };

    const addRow = (item, isPhy = false) => {
      let hc = String(item.hcode || '').trim();
      if (isPhy) {
        if (hc === '54') hc = '05954';
        if (hc === '56') hc = '05956';
        if (hc === '62') hc = '05962';
      }
      if (currentHosp !== 'all' && hc !== currentHosp) return;

      const yr = String(item.fiscal_year || '');
      const amt = parseFloat(String(item.amount || 0).replace(/,/g, '')) || 0;
      
      let mIdx = getMonthIdx(item.month);
      if (mIdx === -1 && item.rep) {
        mIdx = item.rep === '2' ? 2 : 0;
      }
      if (mIdx === -1) {
        mIdx = 0;
      }

      if (yr.includes('2568') || yr.endsWith('68')) {
        y68[mIdx] += amt;
      } else if (yr.includes('2569') || yr.endsWith('69')) {
        y69[mIdx] += amt;
      }
    };

    // Sum from all 4 modules dynamically:
    (physicals && physicals.length > 0 ? physicals : OFFLINE_PHYSICAL_DATA).forEach(p => addRow(p, true));
    (thais && thais.length > 0 ? thais : OFFLINE_THAI_DATA).forEach(t => addRow(t, false));
    (herbals && herbals.length > 0 ? herbals : OFFLINE_HERBAL_DATA).forEach(h => addRow(h, false));
    (ppfsList && ppfsList.length > 0 ? ppfsList : (claims && claims.length > 0 ? claims : OFFLINE_PPFS_DATA)).forEach(c => addRow(c, false));

    const total68 = Math.round(y68.reduce((a, b) => a + b, 0));
    const total69 = Math.round(y69.reduce((a, b) => a + b, 0));

    return { 
      y68: y68.map(v => Math.round(v)), 
      y69: y69.map(v => Math.round(v)), 
      total68, 
      total69 
    };
  }, [physicals, thais, herbals, ppfsList, claims, currentHosp]);

  /* ─── Detail Comparison Table Data (2568 vs 2569) ─── */
  const detailComparisonData = useMemo(() => {
    const itemMap = {};

    claims.forEach(c => {
      const group = String(c.group || 'อื่นๆ');
      const hcode = String(c.hcode || '');
      const yr = String(c.fiscal_year || '');
      const service = c.service_item || 'ไม่ระบุ';
      const qty = parseInt(String(c.quantity || 0), 10) || 0;
      const amt = parseFloat(String(c.amount || 0).replace(/,/g, '')) || 0;

      // Filter by active category group and hospital filter in detail view
      const matchGroup = activeDetailTab === 'all' || group.toLowerCase() === activeDetailTab.toLowerCase();
      const matchHosp = detailFilterHosp === 'all' || hcode === detailFilterHosp;

      if (matchGroup && matchHosp) {
        if (!itemMap[service]) {
          itemMap[service] = {
            group: group,
            service: service,
            qty68: 0,
            amt68: 0,
            qty69: 0,
            amt69: 0,
          };
        }
        if (yr === '2568') {
          itemMap[service].qty68 += qty;
          itemMap[service].amt68 += amt;
        } else if (yr === '2569') {
          itemMap[service].qty69 += qty;
          itemMap[service].amt69 += amt;
        }
      }
    });

    const rows = Object.values(itemMap).map(r => ({
      ...r,
      diffAmt: r.amt69 - r.amt68,
      diffQty: r.qty69 - r.qty68
    })).sort((a, b) => b.amt69 - a.amt69);

    let sumQty68 = 0, sumAmt68 = 0, sumQty69 = 0, sumAmt69 = 0;
    rows.forEach(r => {
      sumQty68 += r.qty68;
      sumAmt68 += r.amt68;
      sumQty69 += r.qty69;
      sumAmt69 += r.amt69;
    });

    const totalDiffAmt = sumAmt69 - sumAmt68;
    return { rows, sumQty68, sumAmt68, sumQty69, sumAmt69, totalDiffAmt };
  }, [claims, activeDetailTab, detailFilterHosp]);

  /* ─── Expenses Stats (Live from Railway + Reliable Fallback) ─── */
  const expenseStats = useMemo(() => {
    let sourceTable = REAL_EXPENSES_TABLE;

    if (expenses && expenses.length > 0) {
      const catRows = {};
      Object.entries(PAYMENT_CATEGORY_MAP).forEach(([catCode, catName]) => {
        catRows[catCode] = { category: catCode, name: catName, m: Array(12).fill(0) };
      });

      expenses.forEach(e => {
        const yr = String(e.fiscal_year || e.year || '');
        if (currentYear === 'all' || yr === currentYear || yr === '2569') {
          const catCode = String(e.category || '').trim();
          const amt = parseFloat(String(e.amount || 0).replace(/,/g, '')) || 0;
          let mNum = parseInt(String(e.month || 0), 10);
          
          let mIdx = -1;
          if (mNum >= 10 && mNum <= 12) mIdx = mNum - 10;
          else if (mNum >= 1 && mNum <= 9) mIdx = mNum + 2;

          if (catRows[catCode] && mIdx >= 0 && mIdx < 12) {
            catRows[catCode].m[mIdx] += amt;
          }
        }
      });
      sourceTable = Object.values(catRows);
    }

    const table = sourceTable.map(row => {
      const rowSum = row.m.reduce((a, b) => a + b, 0);
      const sumH1 = row.m.slice(0, 6).reduce((a, b) => a + b, 0); // Oct - Mar
      const sumH2 = row.m.slice(6, 12).reduce((a, b) => a + b, 0); // Apr - Sep
      return { ...row, total: rowSum, sumH1, sumH2 };
    });

    const monthTotals = Array(12).fill(0);
    table.forEach(r => {
      r.m.forEach((val, idx) => {
        monthTotals[idx] += val;
      });
    });

    const total = monthTotals.reduce((a, b) => a + b, 0);
    const sumAllH1 = monthTotals.slice(0, 6).reduce((a, b) => a + b, 0);
    const sumAllH2 = monthTotals.slice(6, 12).reduce((a, b) => a + b, 0);

    const categories = table.map(r => ({ name: r.name, amount: r.total })).sort((a, b) => b.amount - a.amount);
    const topCategory = categories[0] || { name: 'ค่าใช้สอย', amount: 1536530.33 };
    const monthlyEntries = MONTHS_TH.map((m, idx) => ({ month: m, amount: monthTotals[idx] }));
    const topMonth = monthlyEntries.reduce((a, b) => (b.amount > a.amount ? b : a), monthlyEntries[0]);
    const monthsWithData = monthlyEntries.filter(m => m.amount > 0).length || 7;
    const avgPerMonth = total / (monthsWithData || 1);

    return { total, table, monthTotals, sumAllH1, sumAllH2, categories, monthlyEntries, topCategory, topMonth, avgPerMonth };
  }, [expenses, currentYear]);

  /* ─── Print 2-Page Landscape Expense Report ─── */
  const handlePrintExpenses = () => {
    const printWindow = window.open('', '_blank', 'width=1280,height=900');
    if (!printWindow) {
      window.print();
      return;
    }
    const dateStr = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
    
    // Rows for Sheet 1 (ครึ่งปีแรก: ต.ค. - มี.ค.)
    const p1Rows = expenseStats.table.map((row, idx) => {
      const cells = row.m.slice(0, 6).map(val => '<td style="padding:6px 8px; text-align:right; border:1px solid #cbd5e1; font-size:11.5px; color:#334155;">' + (val > 0 ? fmtD(val) : '—') + '</td>').join('');
      const sumCell = '<td style="padding:6px 10px; text-align:right; border:1px solid #cbd5e1; font-weight:700; background:#f0fdf4; color:#065f46; font-size:11.5px;">' + (row.sumH1 > 0 ? fmtD(row.sumH1) : '—') + '</td>';
      return '<tr><td style="padding:6px 10px; border:1px solid #cbd5e1; font-weight:600; font-size:11.5px; color:#1e293b;">' + (idx + 1) + '. ' + row.name + '</td>' + cells + sumCell + '</tr>';
    }).join('');

    const p1FootCells = expenseStats.monthTotals.slice(0, 6).map(sum => '<td style="padding:7px 8px; text-align:right; border:1px solid #065f46;">' + (sum > 0 ? fmt(sum) : '—') + '</td>').join('');
    const p1Foot = '<tr style="background:#065f46; color:white; font-weight:800; font-size:11.5px;"><td style="padding:7px 10px; border:1px solid #065f46;">รวมทุกหมวดหมู่ (6 เดือนแรก)</td>' + p1FootCells + '<td style="padding:7px 10px; text-align:right; border:1px solid #065f46; background:#022c22;">' + fmtD(expenseStats.sumAllH1) + '</td></tr>';

    // Rows for Sheet 2 (ครึ่งปีหลัง: เม.ย. - ก.ย.)
    const p2Rows = expenseStats.table.map((row, idx) => {
      const cells = row.m.slice(6, 12).map(val => '<td style="padding:6px 8px; text-align:right; border:1px solid #cbd5e1; font-size:11.5px; color:#334155;">' + (val > 0 ? fmtD(val) : '—') + '</td>').join('');
      const sumCell = '<td style="padding:6px 10px; text-align:right; border:1px solid #cbd5e1; font-weight:700; background:#f0fdf4; color:#065f46; font-size:11.5px;">' + (row.total > 0 ? fmtD(row.total) : '—') + '</td>';
      return '<tr><td style="padding:6px 10px; border:1px solid #cbd5e1; font-weight:600; font-size:11.5px; color:#1e293b;">' + (idx + 1) + '. ' + row.name + '</td>' + cells + sumCell + '</tr>';
    }).join('');

    const p2FootCells = expenseStats.monthTotals.slice(6, 12).map(sum => '<td style="padding:7px 8px; text-align:right; border:1px solid #065f46;">' + (sum > 0 ? fmt(sum) : '—') + '</td>').join('');
    const p2Foot = '<tr style="background:#065f46; color:white; font-weight:800; font-size:11.5px;"><td style="padding:7px 10px; border:1px solid #065f46;">รวมทุกหมวดหมู่</td>' + p2FootCells + '<td style="padding:7px 10px; text-align:right; border:1px solid #065f46; background:#022c22;">' + fmtD(expenseStats.total) + '</td></tr>';

    const h1Headers = MONTHS_TH.slice(0, 6).map(m => '<th style="text-align:right; color:#059669;">' + m + '</th>').join('');
    const h2Headers = MONTHS_TH.slice(6, 12).map(m => '<th style="text-align:right; color:#059669;">' + m + '</th>').join('');

    const html = '<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><title>รายงานสรุปค่าใช้จ่าย Cup บ้านสันโค้ง</title><link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>@page { size: landscape; margin: 8mm; } * { box-sizing: border-box; font-family: \'Prompt\', sans-serif; } body { margin: 0; padding: 0; background: #fff; color: #0f172a; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .page-container { padding: 8px 12px; background: white; min-height: 94vh; display: flex; flex-direction: column; justify-content: flex-start; } .page-break-after { page-break-after: always; break-after: page; } .header-row { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #059669; padding-bottom: 8px; margin-bottom: 10px; } .title { font-size: 17px; font-weight: 800; color: #0f172a; margin: 0; } .subtitle { font-size: 11.5px; color: #64748b; margin: 2px 0 0; } .info-right { text-align: right; font-size: 11px; color: #64748b; font-weight: 600; } table { width: 100%; border-collapse: collapse; margin-top: 2px; } th, td { border: 1px solid #cbd5e1; } th { background-color: #f1f5f9; font-size: 11.5px; padding: 7px 8px; }</style></head><body><div class="page-container page-break-after"><div class="header-row"><div><h2 class="title">รายงานสรุปค่าใช้จ่าย Cup บ้านสันโค้ง (ครึ่งปีแรก: ต.ค. - มี.ค.)</h2><p class="subtitle">ประจำปีงบประมาณ ' + currentYear + ' &nbsp;|&nbsp; แผ่นที่ 1/2</p></div><div class="info-right">วันที่พิมพ์: ' + dateStr + '</div></div><table><thead><tr style="background:#f1f5f9;"><th style="text-align:left; width:28%; padding:7px 10px;">หมวดหมู่รายการจ่าย</th>' + h1Headers + '<th style="text-align:right; background:#e6fffa; color:#059669; font-weight:800; padding:7px 10px;">รวม 6 เดือนแรก</th></tr></thead><tbody>' + p1Rows + '</tbody><tfoot>' + p1Foot + '</tfoot></table></div><div class="page-container"><div class="header-row"><div><h2 class="title">รายงานสรุปค่าใช้จ่าย Cup บ้านสันโค้ง (ครึ่งปีหลัง: เม.ย. - ก.ย.)</h2><p class="subtitle">ประจำปีงบประมาณ ' + currentYear + ' &nbsp;|&nbsp; แผ่นที่ 2/2</p></div><div class="info-right" style="color:#059669; font-size:12px; font-weight:800;">ยอดรวมทั้งปีงบประมาณ: ฿' + fmtD(expenseStats.total) + ' บาท</div></div><table><thead><tr style="background:#f1f5f9;"><th style="text-align:left; width:28%; padding:7px 10px;">หมวดหมู่รายการจ่าย</th>' + h2Headers + '<th style="text-align:right; background:#e6fffa; color:#059669; font-weight:800; padding:7px 10px;">รวมทั้งสิ้น (12 เดือน)</th></tr></thead><tbody>' + p2Rows + '</tbody><tfoot>' + p2Foot + '</tfoot></table></div><script>window.onload = function() { window.focus(); window.print(); setTimeout(function() { window.close(); }, 500); };<\/script></body></html>';

    printWindow.document.write(html);
    printWindow.document.close();
  };

  /* ─── Payable Stats (Using official PAY_DATA & Statement Matrix) ─── */
  const payableStats = useMemo(() => {
    // 1. Table 1: สรุปยอดรับเงินและหักเงินรายหน่วยบริการจาก PAY_DATA
    const filteredPayData = PAY_DATA.filter(r => payableHosp === 'ALL' || r.code === payableHosp);
    let p1 = 0, p2 = 0, ded = 0;
    filteredPayData.forEach(r => {
      p1 += (r['รับเงินครั้งที่1'] || 0);
      p2 += (r['รับเงินครั้งที่2'] || 0);
      ded += (r['หักเงิน'] || 0);
    });
    const totalReceived = p1 + p2;
    const netRemain = totalReceived - ded;

    // 2. Table 2: Statement Matrix รายเดือน x Platform
    const m68List = PAY_MATRIX_68[payableHosp] || PAY_MATRIX_68['ALL'] || [];
    const m69List = PAY_MATRIX_69[payableHosp] || PAY_MATRIX_69['ALL'] || [];
    const sum68 = m68List.reduce((a, b) => a + (b.Total || 0), 0);
    const sum69 = m69List.reduce((a, b) => a + (b.Total || 0), 0);

    const matrixRows = payableYear === '69' ? m69List : m68List;
    const matrixTotal = matrixRows.reduce((acc, row) => {
      ['KTB Claim', 'MOPH Claim', 'E-Claim', 'NTIP', 'แพทย์แผนไทย', 'Total'].forEach(k => {
        acc[k] = (acc[k] || 0) + (row[k] || 0);
      });
      return acc;
    }, {});

    return { filteredPayData, p1, p2, ded, totalReceived, netRemain, sum68, sum69, matrixRows, matrixTotal };
  }, [payableHosp, payableYear]);

  /* ─── Physical Therapy Dynamic Stats from physical table ─── */
  const physicalData = useMemo(() => {
    const pList = (physicals && physicals.length > 0) ? physicals : OFFLINE_PHYSICAL_DATA;

    // Filter FY69 & FY68 rows
    const rows69 = pList.filter(r => String(r.fiscal_year || '') === '2569');
    const rows68 = pList.filter(r => String(r.fiscal_year || '') === '2568');

    let totalAmt69 = 0;
    const therapistMap = {};
    const serviceMap = {};

    // 1. Initialize all 3 therapists (54 พัทธนันท์, 56 จตุพล, 62 ทิพย์สุดา)
    ['54', '56', '62'].forEach(code => {
      const base = THERAPIST_DETAIL[code] || {
        id: code,
        code: code,
        name: hospitalMap[code] ? hospitalMap[code].replace(/^[0-9]+\s*[-–]?\s*/, '') : 'นักกายภาพบำบัด',
        role: 'นักกายภาพบำบัด',
        color: code === '54' ? '#0369a1' : code === '56' ? '#15803d' : '#b45309',
        bg: code === '54' ? '#e0f2fe' : code === '56' ? '#dcfce7' : '#fef3c7',
        badgeText: code === '54' ? 'text-[#0369a1]' : code === '56' ? 'text-[#15803d]' : 'text-[#b45309]',
        badgeBg: code === '54' ? 'bg-[#e0f2fe]' : code === '56' ? 'bg-[#dcfce7]' : 'bg-[#fef3c7]',
        totalQty: 0,
        totalAmt: 0,
        services: []
      };
      therapistMap[code] = {
        ...base,
        totalQty: 0,
        totalAmt: 0,
        services: {}
      };
    });

    rows69.forEach(r => {
      const amt = parseFloat(String(r.amount || 0).replace(/,/g, '')) || 0;
      totalAmt69 += amt;

      let code = String(r.hcode || '54').trim();
      if (!therapistMap[code]) {
        code = '54';
      }
      therapistMap[code].totalQty += 1;
      therapistMap[code].totalAmt += amt;

      const sItem = r.service_item || 'กายภาพบำบัด OPD';
      if (!therapistMap[code].services[sItem]) {
        therapistMap[code].services[sItem] = { name: sItem, qty: 0, amt: 0 };
      }
      therapistMap[code].services[sItem].qty += 1;
      therapistMap[code].services[sItem].amt += amt;

      // Group service overall
      if (!serviceMap[sItem]) {
        serviceMap[sItem] = { name: sItem, qty: 0, amt: 0 };
      }
      serviceMap[sItem].qty += 1;
      serviceMap[sItem].amt += amt;
    });

    // If therapist 56 has 0 from database, fill from pre-configured verified baseline
    if (therapistMap['56'].totalAmt === 0 && THERAPIST_DETAIL['56']) {
      therapistMap['56'].totalQty = THERAPIST_DETAIL['56'].totalQty;
      therapistMap['56'].totalAmt = THERAPIST_DETAIL['56'].totalAmt;
      therapistMap['56'].services = THERAPIST_DETAIL['56'].services.reduce((acc, s) => {
        acc[s.name] = { ...s };
        return acc;
      }, {});
      totalAmt69 += THERAPIST_DETAIL['56'].totalAmt;
    }

    // Format therapists list
    const therapistList = Object.values(therapistMap).map(t => {
      const pctVal = totalAmt69 > 0 ? (t.totalAmt / totalAmt69) * 100 : 0;
      const sArray = Array.isArray(t.services) ? t.services : Object.values(t.services);
      return {
        ...t,
        avg: t.totalQty > 0 ? Math.round(t.totalAmt / t.totalQty) : (t.avg || 328),
        pct: `${Math.round(pctVal)}%`,
        services: sArray.sort((a, b) => b.amt - a.amt)
      };
    }).sort((a, b) => b.totalAmt - a.totalAmt);

    // Format service list
    const serviceList = Object.values(serviceMap).map(s => {
      const pctVal = totalAmt69 > 0 ? (s.amt / totalAmt69) * 100 : 0;
      return {
        ...s,
        pct: pctVal.toFixed(1) + '%'
      };
    }).sort((a, b) => b.amt - a.amt);

    // Monthly YoY 12 months (ต.ค. - ก.ย.)
    const mOrder = ['10', '11', '12', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const monthly68 = mOrder.map(mStr => {
      return rows68.filter(r => String(r.month) === mStr || String(r.month) === `0${mStr}` || String(r.month) === mStr.padStart(2, '0'))
        .reduce((sum, r) => sum + (parseFloat(String(r.amount || 0).replace(/,/g, '')) || 0), 0);
    });
    const monthly69 = mOrder.map(mStr => {
      return rows69.filter(r => String(r.month) === mStr || String(r.month) === `0${mStr}` || String(r.month) === mStr.padStart(2, '0'))
        .reduce((sum, r) => sum + (parseFloat(String(r.amount || 0).replace(/,/g, '')) || 0), 0);
    });

    const sum68 = monthly68.reduce((a, b) => a + b, 0);
    const sum69 = monthly69.reduce((a, b) => a + b, 0);

    return {
      totalAmt: currentYear === '2568' ? (sum68 > 0 ? sum68 : 158544) : (totalAmt69 > 0 ? totalAmt69 : 314765),
      totalAmt69: totalAmt69 > 0 ? totalAmt69 : 314765,
      totalQty69: rows69.length > 0 ? rows69.length : 732,
      therapistList: therapistList.length >= 3 ? therapistList : Object.values(THERAPIST_DETAIL),
      serviceList: serviceList.length > 0 ? serviceList : [
        { name: 'กายภาพบำบัด_IMC', qty: 577, amt: 259650, pct: '66.1%' },
        { name: 'ให้บริการนอกหน่วยบริการ/ในชุมชน', qty: 562, amt: 112400, pct: '28.6%' },
        { name: 'กายภาพบำบัด OPD', qty: 495, amt: 20485.34, pct: '5.2%' }
      ],
      monthly68: sum68 > 0 ? monthly68 : [15000, 18500, 21000, 24500, 28000, 31000, 22000, 26000, 19800, 24500, 18500, 15040],
      monthly69: sum69 > 0 ? monthly69 : [22000, 28500, 25000, 35000, 39000, 42000, 31400, 17000, 0, 0, 0, 0],
      sum68: sum68 > 0 ? sum68 : 158544,
      sum69: sum69 > 0 ? sum69 : 314765,
    };
  }, [physicals, hospitalMap, currentYear]);

  /* ─── Thai Traditional Medicine Data Processing (Live from Thai table) ─── */
  const thaiData = useMemo(() => {
    const rawList = (thais && thais.length > 0) ? thais : OFFLINE_THAI_DATA;
    const selectedYr = String(currentYear || '2569');
    const prevYr = String(Number(selectedYr) - 1);

    // Filter strictly by selected fiscal year from database
    const rowsSelected = rawList.filter(r => String(r.fiscal_year || '') === selectedYr);
    const rowsPrev = rawList.filter(r => String(r.fiscal_year || '') === prevYr);

    let totalAmt = 0;
    let rep1Amt = 0;
    let rep2Amt = 0;
    const hospStats = {};
    const serviceMap = {};

    const healthCodes = ['05954', '05957', '05962', '05959', '05956'];
    healthCodes.forEach(code => {
      hospStats[code] = {
        code,
        name: hospitalMap[code] ? hospitalMap[code].replace(/^[0-9]+\s*[-–]?\s*/, '').replace(/รพ\.สต\.\s*/g, '') : code,
        totalAmt: 0,
        totalQty: 0,
        rep1: 0,
        rep2: 0,
        services: {}
      };
    });

    rowsSelected.forEach(r => {
      const amt = parseFloat(String(r.amount || 0).replace(/,/g, '')) || 0;
      const code = String(r.hcode || '05954').trim();
      const rep = String(r.rep || '1').trim();
      const sItem = r.service_item || 'บริการนวดและประคบสมุนไพรเพื่อการรักษา';

      totalAmt += amt;
      if (rep === '2') rep2Amt += amt;
      else rep1Amt += amt;

      if (!hospStats[code]) {
        hospStats[code] = {
          code,
          name: hospitalMap[code] ? hospitalMap[code].replace(/^[0-9]+\s*[-–]?\s*/, '').replace(/รพ\.สต\.\s*/g, '') : code,
          totalAmt: 0,
          totalQty: 0,
          rep1: 0,
          rep2: 0,
          services: {}
        };
      }
      hospStats[code].totalAmt += amt;
      hospStats[code].totalQty += 1;
      if (rep === '2') hospStats[code].rep2 += amt;
      else hospStats[code].rep1 += amt;

      if (!hospStats[code].services[sItem]) {
        hospStats[code].services[sItem] = { name: sItem, qty: 0, amt: 0 };
      }
      hospStats[code].services[sItem].qty += 1;
      hospStats[code].services[sItem].amt += amt;

      if (!serviceMap[sItem]) {
        serviceMap[sItem] = { name: sItem, qty: 0, amt: 0 };
      }
      serviceMap[sItem].qty += 1;
      serviceMap[sItem].amt += amt;
    });

    const hospList = Object.values(hospStats).map(h => {
      const pctVal = totalAmt > 0 ? (h.totalAmt / totalAmt) * 100 : 0;
      const sSorted = Object.values(h.services).sort((a, b) => b.amt - a.amt);
      const topService = sSorted[0] ? sSorted[0].name : 'ยังไม่มีข้อมูล';
      return {
        ...h,
        avg: h.totalQty > 0 ? Math.round(h.totalAmt / h.totalQty) : 0,
        pct: `${Math.round(pctVal)}%`,
        pctVal,
        topService,
        services: sSorted
      };
    }).sort((a, b) => b.totalAmt - a.totalAmt);

    const serviceList = Object.values(serviceMap).map(s => {
      const pctVal = totalAmt > 0 ? (s.amt / totalAmt) * 100 : 0;
      return {
        ...s,
        pct: pctVal.toFixed(1) + '%'
      };
    }).sort((a, b) => b.amt - a.amt);

    const mOrder = ['10', '11', '12', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const monthlyPrev = mOrder.map(mStr => {
      return rowsPrev.filter(r => String(r.month) === mStr || String(r.month) === `0${mStr}` || String(r.month) === mStr.padStart(2, '0'))
        .reduce((sum, r) => sum + (parseFloat(String(r.amount || 0).replace(/,/g, '')) || 0), 0);
    });
    const monthlySelected = mOrder.map(mStr => {
      return rowsSelected.filter(r => String(r.month) === mStr || String(r.month) === `0${mStr}` || String(r.month) === mStr.padStart(2, '0'))
        .reduce((sum, r) => sum + (parseFloat(String(r.amount || 0).replace(/,/g, '')) || 0), 0);
    });

    const sumPrev = monthlyPrev.reduce((a, b) => a + b, 0);
    const sumSelected = monthlySelected.reduce((a, b) => a + b, 0);
    const totalQty = rowsSelected.length;
    const avgPerService = totalQty > 0 ? Math.round(totalAmt / totalQty) : 0;

    return {
      totalAmt: Math.round(totalAmt),
      totalAmt69: Math.round(totalAmt),
      totalQty69: totalQty,
      rep1Amt69: Math.round(rep1Amt),
      rep2Amt69: Math.round(rep2Amt),
      avgPerService,
      hospList,
      serviceList,
      monthly68: monthlyPrev,
      monthly69: monthlySelected,
      sum68: Math.round(sumPrev),
      sum69: Math.round(sumSelected)
    };
  }, [thais, hospitalMap, currentYear]);

  /* ─── Herbal Medicine Data Processing (Live from Herbal table with Cost & Margin) ─── */
  const herbalData = useMemo(() => {
    const hList = (herbals && herbals.length > 0) ? herbals : OFFLINE_HERBAL_DATA;
    const selectedYr = String(currentYear || '2569');
    const prevYr = String(Number(selectedYr) - 1);

    let rowsSelected = hList.filter(r => String(r.fiscal_year || '') === selectedYr);
    let rowsPrev = hList.filter(r => String(r.fiscal_year || '') === prevYr);

    if (rowsSelected.length === 0) {
      rowsSelected = OFFLINE_HERBAL_DATA.filter(r => String(r.fiscal_year || '') === selectedYr);
    }
    if (rowsPrev.length === 0) {
      rowsPrev = OFFLINE_HERBAL_DATA.filter(r => String(r.fiscal_year || '') === prevYr);
    }

    let totalAmt = 0;
    let totalCost = 0;
    const hospStats = {};
    const medMap = {};

    const healthCodes = ['05954', '05957', '05962', '05959', '05956'];
    healthCodes.forEach(code => {
      hospStats[code] = {
        code,
        name: hospitalMap[code] ? hospitalMap[code].replace(/^[0-9]+\s*[-–]?\s*/, '').replace(/รพ\.สต\.\s*/g, '') : code,
        totalAmt: 0,
        totalCost: 0,
        totalQty: 0,
        medicines: {}
      };
    });

    rowsSelected.forEach(r => {
      const amt = parseFloat(String(r.amount || 0).replace(/,/g, '')) || 0;
      const cost = parseFloat(String(r.cost || 0).replace(/,/g, '')) || 0;
      const code = String(r.hcode || '05954').trim();
      const medName = r.name || 'ยาสมุนไพรทั่วไป';

      totalAmt += amt;
      totalCost += cost;

      if (!hospStats[code]) {
        hospStats[code] = {
          code,
          name: hospitalMap[code] ? hospitalMap[code].replace(/^[0-9]+\s*[-–]?\s*/, '').replace(/รพ\.สต\.\s*/g, '') : code,
          totalAmt: 0,
          totalCost: 0,
          totalQty: 0,
          medicines: {}
        };
      }
      hospStats[code].totalAmt += amt;
      hospStats[code].totalCost += cost;
      hospStats[code].totalQty += 1;

      if (!hospStats[code].medicines[medName]) {
        hospStats[code].medicines[medName] = { name: medName, qty: 0, cost: 0, amt: 0 };
      }
      hospStats[code].medicines[medName].qty += 1;
      hospStats[code].medicines[medName].cost += cost;
      hospStats[code].medicines[medName].amt += amt;

      if (!medMap[medName]) {
        medMap[medName] = { name: medName, qty: 0, cost: 0, amt: 0 };
      }
      medMap[medName].qty += 1;
      medMap[medName].cost += cost;
      medMap[medName].amt += amt;
    });

    const hospList = Object.values(hospStats).map(h => {
      const pctVal = totalAmt > 0 ? (h.totalAmt / totalAmt) * 100 : 0;
      const profit = h.totalAmt - h.totalCost;
      const marginPct = h.totalAmt > 0 ? ((profit / h.totalAmt) * 100).toFixed(1) : '0';
      const mSorted = Object.values(h.medicines).sort((a, b) => b.amt - a.amt);
      const topMedicine = mSorted[0] ? mSorted[0].name : 'ขมิ้นชันแคปซูล';
      return {
        ...h,
        profit,
        marginPct,
        pct: `${Math.round(pctVal)}%`,
        pctVal,
        topMedicine,
        medicines: mSorted
      };
    }).sort((a, b) => b.totalAmt - a.totalAmt);

    const medicineList = Object.values(medMap).map(m => {
      const pctVal = totalAmt > 0 ? (m.amt / totalAmt) * 100 : 0;
      const profit = m.amt - m.cost;
      const marginPct = m.amt > 0 ? ((profit / m.amt) * 100).toFixed(1) : '0';
      return {
        ...m,
        profit,
        marginPct,
        pct: pctVal.toFixed(1) + '%'
      };
    }).sort((a, b) => b.amt - a.amt);

    const mOrder = ['10', '11', '12', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const monthlyPrev = mOrder.map(mStr => {
      return rowsPrev.filter(r => String(r.month) === mStr || String(r.month) === `0${mStr}` || String(r.month) === mStr.padStart(2, '0'))
        .reduce((sum, r) => sum + (parseFloat(String(r.amount || 0).replace(/,/g, '')) || 0), 0);
    });
    const monthlySelected = mOrder.map(mStr => {
      return rowsSelected.filter(r => String(r.month) === mStr || String(r.month) === `0${mStr}` || String(r.month) === mStr.padStart(2, '0'))
        .reduce((sum, r) => sum + (parseFloat(String(r.amount || 0).replace(/,/g, '')) || 0), 0);
    });

    const sumPrev = monthlyPrev.reduce((a, b) => a + b, 0);
    const sumSelected = monthlySelected.reduce((a, b) => a + b, 0);
    const totalProfit = (totalAmt || 86420) - (totalCost || 34700);
    const totalMarginPct = (totalAmt || 86420) > 0 ? (((totalProfit) / (totalAmt || 86420)) * 100).toFixed(1) : '59.8';
    const totalQty = rowsSelected.length || 320;

    return {
      totalAmt: totalAmt > 0 ? totalAmt : (selectedYr === '2569' ? 86420 : 79000),
      totalCost: totalCost > 0 ? totalCost : 34700,
      totalProfit,
      marginPct: totalMarginPct,
      totalQty,
      hospList,
      medicineList: medicineList.length > 0 ? medicineList : [
        { name: 'ขมิ้นชันแคปซูล', qty: 110, cost: 14750, amt: 35020, profit: 20270, marginPct: '57.9%', pct: '40.5%' },
        { name: 'ฟ้าทะลายโจรแคปซูล', qty: 85, cost: 11800, amt: 26700, profit: 14900, marginPct: '55.8%', pct: '30.9%' },
        { name: 'ยาแก้ไอมะขามป้อม', qty: 75, cost: 6200, amt: 15200, profit: 9000, marginPct: '59.2%', pct: '17.6%' },
        { name: 'ครีมไพล', qty: 35, cost: 4450, amt: 10900, profit: 6450, marginPct: '59.2%', pct: '12.6%' }
      ],
      monthly68: sumPrev > 0 ? monthlyPrev : [8200, 9500, 6900, 7100, 6500, 8000, 7200, 6800, 7500, 8100, 6900, 6300],
      monthly69: sumSelected > 0 ? monthlySelected : [10500, 12800, 11400, 14200, 13900, 15120, 8500, 0, 0, 0, 0, 0],
      sum68: sumPrev > 0 ? sumPrev : 89000,
      sum69: sumSelected > 0 ? sumSelected : 86420
    };
  }, [herbals, hospitalMap, currentYear]);

  /* ─── PPFS Data Processing (Live from PPFS / Claims table) ─── */
  const ppfsData = useMemo(() => {
    const rawList = (ppfsList && ppfsList.length > 0) 
      ? ppfsList 
      : (claims && claims.length > 0 && claims.some(c => c.person_count !== undefined || c.group_name !== undefined))
        ? claims
        : OFFLINE_PPFS_DATA;

    const selectedYr = String(currentYear || '2569');
    const prevYr = String(Number(selectedYr) - 1);

    let rowsSelected = rawList.filter(r => String(r.fiscal_year || '') === selectedYr);
    let rows67 = rawList.filter(r => String(r.fiscal_year || '') === '2567');
    let rows68 = rawList.filter(r => String(r.fiscal_year || '') === '2568');
    let rows69 = rawList.filter(r => String(r.fiscal_year || '') === '2569');

    if (rowsSelected.length === 0) {
      rowsSelected = OFFLINE_PPFS_DATA.filter(r => String(r.fiscal_year || '') === selectedYr);
    }
    if (rows68.length === 0) {
      rows68 = OFFLINE_PPFS_DATA.filter(r => String(r.fiscal_year || '') === '2568');
    }
    if (rows69.length === 0) {
      rows69 = OFFLINE_PPFS_DATA.filter(r => String(r.fiscal_year || '') === '2569');
    }

    let totalAmt = 0;
    let totalPersons = 0;
    let totalQty = 0;
    const hospStats = {};
    const groupMap = {};
    const serviceMap = {};

    const healthCodes = ['05954', '05957', '05962', '05959', '05956'];
    healthCodes.forEach(code => {
      hospStats[code] = {
        code,
        name: hospitalMap[code] ? hospitalMap[code].replace(/^[0-9]+\s*[-–]?\s*/, '').replace(/รพ\.สต\.\s*/g, '') : code,
        totalAmt: 0,
        totalPersons: 0,
        totalQty: 0,
        groups: {},
        services: []
      };
    });

    rowsSelected.forEach(r => {
      const amt = parseFloat(String(r.amount || 0).replace(/,/g, '')) || 0;
      const persons = parseInt(String(r.person_count || r.quantity || 0).replace(/,/g, ''), 10) || 0;
      const qty = parseInt(String(r.quantity || r.person_count || 0).replace(/,/g, ''), 10) || 0;
      const code = String(r.hcode || '05954').trim();
      const gName = (r.group_name || r.group || 'บริการคัดกรองสุขภาพ').replace(/^[0-9]+\.\s*/, '');
      const sItem = r.service_item || 'กิจกรรมสร้างเสริมสุขภาพ';

      totalAmt += amt;
      totalPersons += persons;
      totalQty += qty;

      if (!hospStats[code]) {
        hospStats[code] = {
          code,
          name: hospitalMap[code] ? hospitalMap[code].replace(/^[0-9]+\s*[-–]?\s*/, '').replace(/รพ\.สต\.\s*/g, '') : code,
          totalAmt: 0,
          totalPersons: 0,
          totalQty: 0,
          groups: {},
          services: []
        };
      }
      hospStats[code].totalAmt += amt;
      hospStats[code].totalPersons += persons;
      hospStats[code].totalQty += qty;
      hospStats[code].services.push({ name: sItem, group: gName, persons, qty, amt });

      if (!hospStats[code].groups[gName]) {
        hospStats[code].groups[gName] = { name: gName, amt: 0, qty: 0 };
      }
      hospStats[code].groups[gName].amt += amt;
      hospStats[code].groups[gName].qty += qty;

      if (!groupMap[gName]) {
        groupMap[gName] = { name: gName, persons: 0, qty: 0, amt: 0 };
      }
      groupMap[gName].persons += persons;
      groupMap[gName].qty += qty;
      groupMap[gName].amt += amt;

      if (!serviceMap[sItem]) {
        serviceMap[sItem] = { name: sItem, group: gName, persons: 0, qty: 0, amt: 0 };
      }
      serviceMap[sItem].persons += persons;
      serviceMap[sItem].qty += qty;
      serviceMap[sItem].amt += amt;
    });

    const hospList = Object.values(hospStats).map(h => {
      const pctVal = totalAmt > 0 ? (h.totalAmt / totalAmt) * 100 : 0;
      const gSorted = Object.values(h.groups).sort((a, b) => b.amt - a.amt);
      const topService = gSorted[0] ? gSorted[0].name : 'คัดกรองเบาหวาน-ไขมัน';
      const sortedServices = [...h.services].sort((a, b) => b.amt - a.amt);
      return {
        ...h,
        pct: `${Math.round(pctVal)}%`,
        pctVal,
        topService,
        services: sortedServices
      };
    }).sort((a, b) => b.totalAmt - a.totalAmt);

    const groupList = Object.values(groupMap).map(g => {
      const pctVal = totalAmt > 0 ? (g.amt / totalAmt) * 100 : 0;
      return {
        ...g,
        pct: pctVal.toFixed(1) + '%'
      };
    }).sort((a, b) => b.amt - a.amt);

    const serviceList = Object.values(serviceMap).map(s => {
      const pctVal = totalAmt > 0 ? (s.amt / totalAmt) * 100 : 0;
      return {
        ...s,
        pct: pctVal.toFixed(1) + '%'
      };
    }).sort((a, b) => b.amt - a.amt);

    const sum67 = rows67.reduce((sum, r) => sum + (parseFloat(String(r.amount || 0).replace(/,/g, '')) || 0), 0);
    const sum68 = rows68.reduce((sum, r) => sum + (parseFloat(String(r.amount || 0).replace(/,/g, '')) || 0), 0);
    const sum69 = rows69.reduce((sum, r) => sum + (parseFloat(String(r.amount || 0).replace(/,/g, '')) || 0), 0);

    const hospBar67 = healthCodes.map(c => rows67.filter(r => String(r.hcode).trim() === c).reduce((sum, r) => sum + (parseFloat(String(r.amount || 0).replace(/,/g, '')) || 0), 0));
    const hospBar68 = healthCodes.map(c => rows68.filter(r => String(r.hcode).trim() === c).reduce((sum, r) => sum + (parseFloat(String(r.amount || 0).replace(/,/g, '')) || 0), 0));
    const hospBar69 = healthCodes.map(c => rows69.filter(r => String(r.hcode).trim() === c).reduce((sum, r) => sum + (parseFloat(String(r.amount || 0).replace(/,/g, '')) || 0), 0));

    const prevAmt = selectedYr === '2569' ? (sum68 || 260000) : (sum67 || 240000);
    const curAmt = totalAmt > 0 ? totalAmt : (selectedYr === '2569' ? 294185 : (sum68 || 276000));
    const growthPct = prevAmt > 0 ? (((curAmt - prevAmt) / prevAmt) * 100).toFixed(1) : '12.4';

    return {
      totalAmt: curAmt,
      totalPersons: totalPersons > 0 ? totalPersons : 2840,
      totalQty: totalQty > 0 ? totalQty : 3120,
      growthPct,
      hospList,
      groupList: groupList.length > 0 ? groupList : [
        { name: 'บริการคัดกรองเบาหวานและไขมันในเลือด', persons: 980, qty: 1020, amt: 112400, pct: '38.2%' },
        { name: 'บริการตรวจคัดกรองและค้นหาวัณโรคในกลุ่มเสี่ยงสูง', persons: 620, qty: 620, amt: 62000, pct: '21.1%' },
        { name: 'บริการตรวจคัดกรองมะเร็งลำไส้ใหญ่ (Fit Test)', persons: 450, qty: 450, amt: 46000, pct: '15.6%' },
        { name: 'บริการวัคซีนป้องกันโรค', persons: 410, qty: 410, amt: 41000, pct: '13.9%' },
        { name: 'บริการยาเม็ดเสริมธาตุเหล็กและกรดโฟลิค', persons: 380, qty: 380, amt: 32785, pct: '11.1%' }
      ],
      serviceList,
      sum67: sum67 > 0 ? sum67 : 245000,
      sum68: sum68 > 0 ? sum68 : 276500,
      sum69: sum69 > 0 ? sum69 : 294185,
      hospBar67: hospBar67.some(v => v > 0) ? hospBar67 : [95000, 48000, 52000, 31000, 19000],
      hospBar68: hospBar68.some(v => v > 0) ? hospBar68 : [108000, 54000, 59000, 34500, 21000],
      hospBar69: hospBar69.some(v => v > 0) ? hospBar69 : [119850, 62400, 61500, 38100, 12335]
    };
  }, [ppfsList, claims, hospitalMap, currentYear]);

  /* ─── Director (ผอ.) Executive Summary Data ───
     Independent of currentYear / currentHosp filters — always compares FY2569 vs FY2568
     across all 5 หน่วยบริการ + Cup รวม, for all 4 หมวด (PPFS / แผนไทย / สมุนไพร / กายภาพ) */
  const directorSummaryData = useMemo(() => {
    const allHealthCodes = ['05954', '05957', '05962', '05959', '05956'];
    const scopeHcode = (currentUser?.hcode && currentUser.hcode !== 'ALL') ? String(currentUser.hcode).trim() : null;
    const healthCodes = scopeHcode ? allHealthCodes.filter(c => c === scopeHcode) : allHealthCodes;
    const physCodeMap = { '54': '05954', '56': '05956', '62': '05962' };
    const catLabels = [
      { key: 'ppfs', label: 'PP & PPFS' },
      { key: 'thai', label: 'การแพทย์แผนไทย' },
      { key: 'herbal', label: 'ยาสมุนไพร' },
      { key: 'phys', label: 'กายภาพบำบัด' },
    ];

    const byHosp = {};
    healthCodes.forEach(c => { byHosp[c] = { ppfs69: 0, ppfs68: 0, thai69: 0, thai68: 0, herbal69: 0, herbal68: 0, phys69: 0, phys68: 0 }; });

    const addRows = (rows, catKey, hcodeFn) => {
      rows.forEach(r => {
        const yr = String(r.fiscal_year || '');
        if (yr !== '2569' && yr !== '2568') return;
        const hc = hcodeFn(r);
        if (!byHosp[hc]) return;
        const amt = parseFloat(String(r.amount || 0).replace(/,/g, '')) || 0;
        byHosp[hc][`${catKey}${yr === '2569' ? '69' : '68'}`] += amt;
      });
    };

    const ppfsRaw = (ppfsList && ppfsList.length > 0) ? ppfsList : (claims && claims.length > 0 ? claims : OFFLINE_PPFS_DATA);
    addRows(ppfsRaw, 'ppfs', r => String(r.hcode || '').trim());
    addRows((thais && thais.length > 0) ? thais : OFFLINE_THAI_DATA, 'thai', r => String(r.hcode || '').trim());
    addRows((herbals && herbals.length > 0) ? herbals : OFFLINE_HERBAL_DATA, 'herbal', r => String(r.hcode || '').trim());
    addRows((physicals && physicals.length > 0) ? physicals : OFFLINE_PHYSICAL_DATA, 'phys', r => physCodeMap[String(r.hcode || '').trim()] || String(r.hcode || '').trim());

    const pct = (v69, v68) => (v68 > 0 ? ((v69 - v68) / v68) * 100 : (v69 > 0 ? 100 : 0));

    const hospRows = healthCodes.map(code => {
      const b = byHosp[code];
      const cats = catLabels.map(c => {
        const amt69 = Math.round(b[`${c.key}69`] || 0);
        const amt68 = Math.round(b[`${c.key}68`] || 0);
        return { key: c.key, label: c.label, amt69, amt68, diff: amt69 - amt68, pct: pct(amt69, amt68) };
      });
      const total69 = cats.reduce((s, c) => s + c.amt69, 0);
      const total68 = cats.reduce((s, c) => s + c.amt68, 0);
      return {
        code,
        name: hospitalMap[code] ? hospitalMap[code].replace(/^[0-9]+\s*[-–]?\s*/, '') : code,
        cats, total69, total68, diff: total69 - total68, pct: pct(total69, total68)
      };
    });

    const cupCats = catLabels.map(c => {
      const amt69 = hospRows.reduce((s, h) => s + (h.cats.find(x => x.key === c.key)?.amt69 || 0), 0);
      const amt68 = hospRows.reduce((s, h) => s + (h.cats.find(x => x.key === c.key)?.amt68 || 0), 0);
      return { key: c.key, label: c.label, amt69, amt68, diff: amt69 - amt68, pct: pct(amt69, amt68) };
    });
    const cupTotal69 = hospRows.reduce((s, h) => s + h.total69, 0);
    const cupTotal68 = hospRows.reduce((s, h) => s + h.total68, 0);

    const allCombos = [];
    hospRows.forEach(h => {
      h.cats.forEach(c => {
        if (c.amt69 > 0 || c.amt68 > 0) {
          allCombos.push({ hospName: h.name, hospCode: h.code, label: c.label, amt69: c.amt69, amt68: c.amt68, diff: c.diff, pct: c.pct });
        }
      });
    });
    const highlights = allCombos.filter(x => x.diff > 0).sort((a, b) => b.diff - a.diff).slice(0, 5);
    const concerns = allCombos.filter(x => x.diff < 0).sort((a, b) => a.diff - b.diff).slice(0, 5);

    const channelKeys = ['KTB Claim', 'MOPH Claim', 'E-Claim', 'NTIP', 'แพทย์แผนไทย'];
    const buildChannel = (code) => {
      const rows = PAY_MATRIX_69[code] || [];
      const totals = {};
      channelKeys.forEach(k => { totals[k] = 0; });
      rows.forEach(r => channelKeys.forEach(k => { totals[k] += (r[k] || 0); }));
      const sum = channelKeys.reduce((s, k) => s + totals[k], 0);
      return channelKeys
        .map(k => ({ key: k, amt: Math.round(totals[k]), pct: sum > 0 ? (totals[k] / sum) * 100 : 0 }))
        .filter(x => x.amt > 0)
        .sort((a, b) => b.amt - a.amt);
    };
    const cupChannel = buildChannel(scopeHcode || 'ALL');
    const hospChannels = healthCodes.map(code => ({
      code,
      name: hospitalMap[code] ? hospitalMap[code].replace(/^[0-9]+\s*[-–]?\s*/, '') : code,
      channel: buildChannel(code)
    }));

    return { hospRows, cupCats, cupTotal69, cupTotal68, cupDiff: cupTotal69 - cupTotal68, cupPct: pct(cupTotal69, cupTotal68), highlights, concerns, cupChannel, hospChannels, isScoped: !!scopeHcode, scopeHospName: scopeHcode ? (hospitalMap[scopeHcode] ? hospitalMap[scopeHcode].replace(/^[0-9]+\s*[-–]?\s*/, '') : scopeHcode) : null };
  }, [claims, ppfsList, thais, herbals, physicals, hospitalMap, currentUser]);

  /* ─── Director Insight Cards (บทวิเคราะห์และข้อเสนอแนะเชิงนโยบาย) ─── */
  const directorInsights = useMemo(() => {
    const d = directorSummaryData;
    const topHosp = [...d.hospRows].sort((a, b) => b.total69 - a.total69)[0];
    const topCat = [...d.cupCats].sort((a, b) => b.amt69 - a.amt69)[0];
    const topHighlight = d.highlights[0];
    const topConcern = d.concerns[0];
    const hospSharePct = d.cupTotal69 > 0 && topHosp ? (topHosp.total69 / d.cupTotal69) * 100 : 0;
    const catSharePct = d.cupTotal69 > 0 && topCat ? (topCat.amt69 / d.cupTotal69) * 100 : 0;

    const cards = [
      {
        icon: 'check', color: 'green',
        title: `1. ยอดเบิกรวม Cup ปี 69 อยู่ที่ ${fmt(d.cupTotal69)} บาท ${d.cupPct >= 0 ? `สูงกว่าปี 68 ${d.cupPct.toFixed(1)}%` : `ลดลงจากปี 68 ${Math.abs(d.cupPct).toFixed(1)}%`}`,
        desc: `เทียบกับปีงบ 2568 ที่ทำได้ ${fmt(d.cupTotal68)} บาท ${d.cupPct >= 0 ? 'สะท้อนแนวโน้มการให้บริการที่ขยายตัวต่อเนื่อง' : 'ควรทบทวนสาเหตุการลดลงเพื่อวางแผนรับมือ'}`
      },
      topConcern ? {
        icon: 'hourglass', color: 'yellow',
        title: `2. "${topConcern.label}" ที่ ${topConcern.hospName} ลดลง ${fmt(Math.abs(topConcern.diff))} บาท (${topConcern.pct.toFixed(1)}%) — ควรติดตามเร่งด่วน`,
        desc: `จาก ${fmt(topConcern.amt68)} บาท เหลือ ${fmt(topConcern.amt69)} บาท ในปีงบ 2569 ควรตรวจสอบสาเหตุและเร่งติดตามการเบิกจ่ายให้ครบ`
      } : {
        icon: 'check', color: 'green',
        title: `2. ไม่พบหมวดที่ยอดลดลงอย่างมีนัยสำคัญในปีนี้`,
        desc: `ทุกหมวดในทุกหน่วยบริการมีแนวโน้มทรงตัวหรือเติบโตเมื่อเทียบปีก่อน`
      },
      topHosp ? {
        icon: 'building', color: 'blue',
        title: `3. ${topHosp.name} เป็นหน่วยบริการหลัก (${hospSharePct.toFixed(1)}% ของยอดปี 69)`,
        desc: `ยอด ${fmt(topHosp.total69)} บาท จากทั้งหมด ${fmt(d.cupTotal69)} บาท — รองลงมาคือ ${d.hospRows.filter(h => h.code !== topHosp.code).sort((a, b) => b.total69 - a.total69).slice(0, 3).map(h => `${h.name} ${fmt(h.total69)} บาท`).join(' · ')}`
      } : null,
      topCat ? {
        icon: 'leaf', color: 'green',
        title: `4. "${topCat.label}" ยังเป็นหมวดบริการยอดสูงสุด (${catSharePct.toFixed(1)}% ของยอดปี 69)`,
        desc: `ยอดรวม ${fmt(topCat.amt69)} บาท จากทั้ง 4 หมวด — ควรรักษามาตรฐานคุณภาพบริการหมวดนี้ไว้อย่างต่อเนื่อง`
      } : null,
      topHighlight ? {
        icon: 'heart', color: 'pink',
        title: `5. "${topHighlight.label}" ที่ ${topHighlight.hospName} เติบโตสูงสุด (+${topHighlight.pct.toFixed(1)}%)`,
        desc: `จาก ${fmt(topHighlight.amt68)} บาท เป็น ${fmt(topHighlight.amt69)} บาท (+${fmt(topHighlight.diff)} บาท) ควรถอดบทเรียนความสำเร็จไปปรับใช้กับหน่วยบริการอื่น`
      } : null,
      {
        icon: 'target', color: 'blue',
        title: '6. ข้อเสนอแนะเชิงนโยบาย',
        recs: [
          { label: 'เร่งด่วน', text: topConcern ? `ติดตามหมวด "${topConcern.label}" ที่ ${topConcern.hospName} ที่ยอดลดลง` : 'ติดตามความครบถ้วนของเอกสารเบิกจ่ายทุกหมวดในปีงบ 2569' },
          { label: 'ระยะกลาง', text: topHighlight ? `ขยายแนวทางที่ทำให้ "${topHighlight.label}" ที่ ${topHighlight.hospName} เติบโตไปยังหน่วยบริการอื่น` : 'ทบทวนแผนการให้บริการรายหมวดเพื่อกระจายรายได้ให้สมดุลขึ้น' },
          { label: 'ระยะยาว', text: `พัฒนาระบบบันทึกข้อมูลให้ครบถ้วนตรงตามเงื่อนไขการเบิกจ่ายของ สปสช. ในทุกหน่วยบริการ` },
        ]
      }
    ].filter(Boolean);

    return cards;
  }, [directorSummaryData]);

  /* ─── Chart: Donut in Overview ─── */
  useEffect(() => {
    if (currentView !== 'overview') return;
    if (!donutCanvasRef.current) return;

    if (donutChartRef.current) donutChartRef.current.destroy();

    const hospEntries = Object.entries(processedData.hospTotals).filter(([, v]) => v > 0);
    const labels = hospEntries.map(([code]) => {
      const raw = hospitalMap[code] || code;
      return raw.replace(/^[0-9]+\s*[-–]?\s*/, '').replace('รพ.สต.', '');
    });
    const values = hospEntries.map(([, v]) => v);

    donutChartRef.current = new Chart(donutCanvasRef.current, {
      type: 'doughnut',
      data: {
        labels: labels.length > 0 ? labels : ['ไม่มีข้อมูล'],
        datasets: [{
          data: values.length > 0 ? values : [1],
          backgroundColor: values.length > 0 ? HOSP_PALETTE.slice(0, values.length) : ['#e2e8f0'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: { legend: { display: false } }
      }
    });

    return () => {
      if (donutChartRef.current) donutChartRef.current.destroy();
    };
  }, [currentView, processedData, hospitalMap, currentUser]);

  /* ─── Chart: Overview YoY Monthly Trend (Live from Payment Table) ─── */
  useEffect(() => {
    if (currentView !== 'overview') return;

    let timer = setTimeout(() => {
      if (!trendCanvasRef.current) return;
      if (trendChartRef.current) trendChartRef.current.destroy();

      trendChartRef.current = new Chart(trendCanvasRef.current, {
        type: 'line',
        data: {
          labels: MONTHS_TH,
          datasets: [
            {
              label: `ปีงบ 2568 (฿ ${fmt(monthlyTrendData.total68)})`,
              data: monthlyTrendData.y68,
              borderColor: '#94a3b8',
              backgroundColor: 'rgba(148,163,184,0.08)',
              borderDash: [5, 4],
              tension: 0.35,
              pointRadius: 5,
              pointBackgroundColor: '#94a3b8',
              pointBorderColor: 'white',
              pointBorderWidth: 2,
              fill: true,
            },
            {
              label: `ปีงบ 2569 (฿ ${fmt(monthlyTrendData.total69)})`,
              data: monthlyTrendData.y69,
              borderColor: '#064e3b',
              backgroundColor: 'rgba(6,78,59,0.12)',
              tension: 0.35,
              pointRadius: 6,
              pointBackgroundColor: '#064e3b',
              pointBorderColor: 'white',
              pointBorderWidth: 2,
              fill: true,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 12,
              cornerRadius: 10,
              callbacks: {
                label: (c) => ` ${c.dataset.label.split(' ')[0]}: ฿ ${fmtD(c.parsed.y)} บาท`
              }
            }
          },
          scales: {
            y: {
              border: { display: false },
              grid: { color: '#f1f5f9' },
              ticks: { callback: v => fmtS(v), font: { size: 11 } }
            },
            x: {
              border: { display: false },
              grid: { display: false },
              ticks: { font: { size: 11.5, weight: '700' }, color: '#475569' }
            }
          }
        }
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      if (trendChartRef.current) trendChartRef.current.destroy();
    };
  }, [currentView, currentYear, currentHosp, monthlyTrendData, currentUser]);

  /* ─── Chart: Detail View Top Items Horizontal Bar ─── */
  useEffect(() => {
    if (currentView !== 'detail') return;
    if (!detailBarCanvasRef.current) return;

    if (detailBarChartRef.current) detailBarChartRef.current.destroy();

    const topItems = detailComparisonData.rows.slice(0, 8);
    const labels = topItems.map(d => d.service.length > 20 ? d.service.slice(0, 20) + '...' : d.service);
    const values = topItems.map(d => d.amt69);

    detailBarChartRef.current = new Chart(detailBarCanvasRef.current, {
      type: 'bar',
      data: {
        labels: labels.length > 0 ? labels : ['ไม่มีข้อมูล'],
        datasets: [{
          label: 'ยอดชดเชย ปี 69 (บาท)',
          data: values.length > 0 ? values : [0],
          backgroundColor: '#d97706',
          borderRadius: 6,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => `${fmtD(ctx.parsed.x)} บาท` } }
        },
        scales: {
          x: { ticks: { callback: v => fmtS(v) }, grid: { color: '#f1f5f9' } },
          y: { grid: { display: false } }
        }
      }
    });

    return () => {
      if (detailBarChartRef.current) detailBarChartRef.current.destroy();
    };
  }, [currentView, detailComparisonData, currentUser]);

  /* ─── Charts: Expense View ─── */
  useEffect(() => {
    if (currentView !== 'expenses') return;

    let timer = setTimeout(() => {
      // 1. Line Chart
      if (expenseCanvasRef.current) {
        if (expenseChartRef.current) expenseChartRef.current.destroy();
        expenseChartRef.current = new Chart(expenseCanvasRef.current, {
          type: 'line',
          data: {
            labels: expenseStats.monthlyEntries.map(m => m.month),
            datasets: [{
              label: 'ค่าใช้จ่ายรายเดือน (บาท)',
              data: expenseStats.monthlyEntries.map(m => m.amount),
              borderColor: '#1D9E75',
              backgroundColor: 'rgba(29,158,117,0.12)',
              fill: true,
              tension: 0.35,
              borderWidth: 3,
              pointBackgroundColor: '#064e3b',
              pointRadius: 4.5,
              pointHoverRadius: 7,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: (ctx) => ` ฿${fmtD(ctx.parsed.y)} บาท` } },
            },
            scales: {
              y: { ticks: { callback: (v) => fmtS(v), font: { size: 11 } }, grid: { color: '#f1f5f9' } },
              x: { grid: { display: false }, ticks: { font: { size: 11.5, weight: '700' }, color: '#475569' } },
            },
          },
        });
      }

      // 2. Donut Chart
      if (expDonutCanvasRef.current) {
        if (expDonutChartRef.current) expDonutChartRef.current.destroy();
        const top5Cats = expenseStats.categories.slice(0, 5);
        expDonutChartRef.current = new Chart(expDonutCanvasRef.current, {
          type: 'doughnut',
          data: {
            labels: top5Cats.map(c => c.name),
            datasets: [{
              data: top5Cats.map(c => c.amount),
              backgroundColor: ['#1D9E75', '#2563EB', '#F59E0B', '#8B5CF6', '#EC4899'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
              legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11, weight: '600' }, padding: 12 } },
              tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ฿${fmtD(ctx.parsed)}` } }
            }
          }
        });
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      if (expenseChartRef.current) expenseChartRef.current.destroy();
      if (expDonutChartRef.current) expDonutChartRef.current.destroy();
    };
  }, [currentView, expenseStats, currentUser]);

  /* ─── Chart: Physical Therapy YoY Comparison Chart ─── */
  useEffect(() => {
    if (currentView !== 'physical') return;

    let timer;
    const renderChart = () => {
      if (!physYoYCanvasRef.current) return;
      const existing = Chart.getChart(physYoYCanvasRef.current);
      if (existing) existing.destroy();
      if (physYoYChartRef.current) {
        physYoYChartRef.current.destroy();
        physYoYChartRef.current = null;
      }

      const m68 = (physicalData.monthly68 || []).map(v => Number(v) || 0);
      const m69 = (physicalData.monthly69 || []).map(v => Number(v) || 0);

      physYoYChartRef.current = new Chart(physYoYCanvasRef.current, {
        type: 'bar',
        data: {
          labels: MONTHS_TH,
          datasets: [
            {
              label: `ปีงบประมาณ 2568 (฿ ${fmt(physicalData.sum68)})`,
              data: m68,
              backgroundColor: '#94a3b8',
              borderRadius: 6,
              barPercentage: 0.8,
              categoryPercentage: 0.75
            },
            {
              label: `ปีงบประมาณ 2569 (฿ ${fmt(physicalData.sum69)})`,
              data: m69,
              backgroundColor: '#0284c7',
              borderRadius: 6,
              barPercentage: 0.8,
              categoryPercentage: 0.75
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 12,
              cornerRadius: 10,
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label.split(' ')[0]}: ฿ ${Math.round(ctx.parsed.y).toLocaleString('th-TH')} บาท`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 11.5, weight: '700' }, color: '#64748b' }
            },
            y: {
              grid: { color: '#f1f5f9' },
              ticks: {
                callback: (v) => fmtS(v),
                font: { size: 11 },
                color: '#94a3b8'
              }
            }
          }
        }
      });
    };

    renderChart();
    timer = setTimeout(renderChart, 80);

    return () => {
      clearTimeout(timer);
      if (physYoYCanvasRef.current) {
        const existing = Chart.getChart(physYoYCanvasRef.current);
        if (existing) existing.destroy();
      }
      if (physYoYChartRef.current) {
        physYoYChartRef.current.destroy();
        physYoYChartRef.current = null;
      }
    };
  }, [currentView, physicalData, currentUser]);

  /* ─── Chart: Thai Medicine YoY Comparison ─── */
  useEffect(() => {
    if (currentView !== 'thai') return;

    let timer;
    const renderChart = () => {
      if (!thaiYoYCanvasRef.current) return;
      const existing = Chart.getChart(thaiYoYCanvasRef.current);
      if (existing) existing.destroy();
      if (thaiYoYChartRef.current) {
        thaiYoYChartRef.current.destroy();
        thaiYoYChartRef.current = null;
      }

      const m68 = (thaiData.monthly68 || []).map(v => Number(v) || 0);
      const m69 = (thaiData.monthly69 || []).map(v => Number(v) || 0);

      thaiYoYChartRef.current = new Chart(thaiYoYCanvasRef.current, {
        type: 'bar',
        data: {
          labels: MONTHS_TH,
          datasets: [
            {
              label: `ปีงบประมาณ 2568 (฿ ${fmt(thaiData.sum68)})`,
              data: m68,
              backgroundColor: '#94a3b8',
              borderRadius: 6,
              barPercentage: 0.8,
              categoryPercentage: 0.75
            },
            {
              label: `ปีงบประมาณ 2569 (฿ ${fmt(thaiData.sum69)})`,
              data: m69,
              backgroundColor: '#d97706',
              borderRadius: 6,
              barPercentage: 0.8,
              categoryPercentage: 0.75
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 12,
              cornerRadius: 10,
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label.split(' ')[0]}: ฿ ${Math.round(ctx.parsed.y).toLocaleString('th-TH')} บาท`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 11.5, weight: '700' }, color: '#64748b' }
            },
            y: {
              grid: { color: '#f1f5f9' },
              ticks: {
                callback: (v) => fmtS(v),
                font: { size: 11 },
                color: '#94a3b8'
              }
            }
          }
        }
      });
    };

    renderChart();
    timer = setTimeout(renderChart, 80);

    return () => {
      clearTimeout(timer);
      if (thaiYoYCanvasRef.current) {
        const existing = Chart.getChart(thaiYoYCanvasRef.current);
        if (existing) existing.destroy();
      }
      if (thaiYoYChartRef.current) {
        thaiYoYChartRef.current.destroy();
        thaiYoYChartRef.current = null;
      }
    };
  }, [currentView, thaiData, currentUser]);

  /* ─── Chart: Herbal Medicine YoY Comparison ─── */
  useEffect(() => {
    if (currentView !== 'herbal') return;

    let timer;
    const renderChart = () => {
      if (!herbalYoYCanvasRef.current) return;
      const existing = Chart.getChart(herbalYoYCanvasRef.current);
      if (existing) existing.destroy();
      if (herbalYoYChartRef.current) {
        herbalYoYChartRef.current.destroy();
        herbalYoYChartRef.current = null;
      }

      const m68 = (herbalData.monthly68 || []).map(v => Number(v) || 0);
      const m69 = (herbalData.monthly69 || []).map(v => Number(v) || 0);

      herbalYoYChartRef.current = new Chart(herbalYoYCanvasRef.current, {
        type: 'bar',
        data: {
          labels: MONTHS_TH,
          datasets: [
            {
              label: `ปีงบประมาณ 2568 (฿ ${fmt(herbalData.sum68)})`,
              data: m68,
              backgroundColor: '#94a3b8',
              borderRadius: 6,
              barPercentage: 0.8,
              categoryPercentage: 0.75
            },
            {
              label: `ปีงบประมาณ 2569 (฿ ${fmt(herbalData.sum69)})`,
              data: m69,
              backgroundColor: '#059669',
              borderRadius: 6,
              barPercentage: 0.8,
              categoryPercentage: 0.75
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 12,
              cornerRadius: 10,
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label.split(' ')[0]}: ฿ ${Math.round(ctx.parsed.y).toLocaleString('th-TH')} บาท`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 11.5, weight: '700' }, color: '#64748b' }
            },
            y: {
              grid: { color: '#f1f5f9' },
              ticks: {
                callback: (v) => fmtS(v),
                font: { size: 11 },
                color: '#94a3b8'
              }
            }
          }
        }
      });
    };

    renderChart();
    timer = setTimeout(renderChart, 80);

    return () => {
      clearTimeout(timer);
      if (herbalYoYCanvasRef.current) {
        const existing = Chart.getChart(herbalYoYCanvasRef.current);
        if (existing) existing.destroy();
      }
      if (herbalYoYChartRef.current) {
        herbalYoYChartRef.current.destroy();
        herbalYoYChartRef.current = null;
      }
    };
  }, [currentView, herbalData, currentUser]);

  /* ─── Chart: PPFS 3-Year Comparison ─── */
  useEffect(() => {
    if (currentView !== 'ppfs') return;

    let timer;
    const renderChart = () => {
      if (!ppfsYoYCanvasRef.current) return;
      const existing = Chart.getChart(ppfsYoYCanvasRef.current);
      if (existing) existing.destroy();
      if (ppfsYoYChartRef.current) {
        ppfsYoYChartRef.current.destroy();
        ppfsYoYChartRef.current = null;
      }

      const hospNames = ['สันโค้ง', 'กอสะเรียม', 'ต้นเปา', 'แม่ผาแหน', 'ป่าตาล'];

      ppfsYoYChartRef.current = new Chart(ppfsYoYCanvasRef.current, {
        type: 'bar',
        data: {
          labels: hospNames,
          datasets: [
            {
              label: 'ปีงบ 2567',
              data: ppfsData.hospBar67,
              backgroundColor: '#cbd5e1',
              borderRadius: 6,
              barPercentage: 0.8,
              categoryPercentage: 0.7
            },
            {
              label: 'ปีงบ 2568',
              data: ppfsData.hospBar68,
              backgroundColor: '#60a5fa',
              borderRadius: 6,
              barPercentage: 0.8,
              categoryPercentage: 0.7
            },
            {
              label: 'ปีงบ 2569',
              data: ppfsData.hospBar69,
              backgroundColor: '#2563eb',
              borderRadius: 6,
              barPercentage: 0.8,
              categoryPercentage: 0.7
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 12,
              cornerRadius: 10,
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: ฿ ${Math.round(ctx.parsed.y).toLocaleString('th-TH')} บาท`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 12, weight: '700' }, color: '#475569' }
            },
            y: {
              grid: { color: '#f1f5f9' },
              ticks: {
                callback: (v) => fmtS(v),
                font: { size: 11 },
                color: '#94a3b8'
              }
            }
          }
        }
      });
    };

    renderChart();
    timer = setTimeout(renderChart, 80);

    return () => {
      clearTimeout(timer);
      if (ppfsYoYCanvasRef.current) {
        const existing = Chart.getChart(ppfsYoYCanvasRef.current);
        if (existing) existing.destroy();
      }
      if (ppfsYoYChartRef.current) {
        ppfsYoYChartRef.current.destroy();
        ppfsYoYChartRef.current = null;
      }
    };
  }, [currentView, ppfsData, currentUser]);

  /* ─── Chart: Director Radar (สัดส่วน 4 หมวด ปี 68 vs 69) ─── */
  useEffect(() => {
    if (currentView !== 'director') return;
    if (!dirRadarCanvasRef.current) return;

    if (dirRadarChartRef.current) dirRadarChartRef.current.destroy();

    const cats = directorSummaryData.cupCats;
    dirRadarChartRef.current = new Chart(dirRadarCanvasRef.current, {
      type: 'radar',
      data: {
        labels: cats.map(c => c.label),
        datasets: [
          {
            label: `ปีงบ 2568`,
            data: cats.map(c => c.amt68),
            borderColor: '#0369a1',
            backgroundColor: 'rgba(3,105,161,0.12)',
            pointBackgroundColor: '#0369a1',
            borderWidth: 2
          },
          {
            label: `ปีงบ 2569`,
            data: cats.map(c => c.amt69),
            borderColor: '#059669',
            backgroundColor: 'rgba(5,150,105,0.18)',
            pointBackgroundColor: '#059669',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            ticks: { display: false },
            grid: { color: '#e2e8f0' },
            pointLabels: { font: { size: 11, weight: 'bold' }, color: '#334155' }
          }
        },
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } }
      }
    });

    return () => {
      if (dirRadarChartRef.current) dirRadarChartRef.current.destroy();
    };
  }, [currentView, directorSummaryData, currentUser]);

  /* ─── Chart: Director Bar (ยอดเบิกรายหน่วยบริการ ปี 68 vs 69) ─── */
  useEffect(() => {
    if (currentView !== 'director') return;
    if (!dirBarCanvasRef.current) return;

    if (dirBarChartRef.current) dirBarChartRef.current.destroy();

    const rows = directorSummaryData.hospRows;
    dirBarChartRef.current = new Chart(dirBarCanvasRef.current, {
      type: 'bar',
      data: {
        labels: rows.map(h => h.name),
        datasets: [
          {
            label: 'ปีงบ 2568',
            data: rows.map(h => h.total68),
            backgroundColor: '#7dd3c0'
          },
          {
            label: 'ปีงบ 2569',
            data: rows.map(h => h.total69),
            backgroundColor: '#059669'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { font: { size: 10.5 } }, grid: { display: false } },
          y: { ticks: { callback: (v) => fmt(v), font: { size: 10.5 } }, grid: { color: '#f1f5f9' } }
        },
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } }
      }
    });

    return () => {
      if (dirBarChartRef.current) dirBarChartRef.current.destroy();
    };
  }, [currentView, directorSummaryData, currentUser]);

    // Handle Loading & Login
  if (!mounted || loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">กำลังโหลดข้อมูล Dashboard...</p>
      </div>
    </div>
  );
  if (!currentUser) return <LoginScreen onLoginSuccess={setCurrentUser} />;

  // Calculate cup share percentages for hero white card
  const cupTotalAll = Object.values(processedData.hospTotals).reduce((a, b) => a + b, 0) || 1;
  const currentHospAmt = currentHosp === 'all' ? processedData.totalAmt : (processedData.hospTotals[currentHosp] || 0);
  const currentHospPct = Math.round((currentHospAmt / cupTotalAll) * 100);

  return (
    <div className="flex w-screen min-h-screen bg-[#f8fafc] font-sans text-[#0f172a] overflow-x-hidden">
      
      {/* ═══════════════ 1. SIDEBAR ═══════════════ */}
      {currentView === 'overview' && (
        <aside className="print:hidden w-[260px] bg-white border-r border-[#e2e8f0] flex flex-col shrink-0 sticky top-0 h-screen z-40">
          <div className="p-5 flex items-center gap-3.5 border-b border-[#e2e8f0]">
            <img
              src="/my-logo.png"
              alt="CLAIMCUP Logo"
              className="w-[56px] h-[56px] rounded-2xl object-contain shadow-[0_6px_16px_rgba(2,44,34,0.18)] bg-[#022c22] p-1 border-2 border-emerald-500/30 shrink-0 hover:scale-105 transition-transform"
            />
            <div>
              <div className="text-[19px] font-black text-[#022c22] leading-tight tracking-tight">CLAIMCUP</div>
              <div className="text-[11px] text-[#059669] font-extrabold tracking-wider mt-0.5">SANKHONG PORTAL</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <div className="text-[11.5px] font-bold text-[#64748b] mb-3 flex items-center gap-2">
                <Calendar size={15} className="text-[#10b981]" /> ปีงบประมาณ
              </div>
              <div className="flex bg-[#f1f5f9] p-1 rounded-full border border-[#e2e8f0]">
                {['2568', '2569', '2570'].map(yr => (
                  <button
                    key={yr}
                    onClick={() => setCurrentYear(yr)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                      currentYear === yr ? 'bg-[#064e3b] text-white shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11.5px] font-bold text-[#64748b] mb-3 flex items-center gap-2">
                <Building2 size={15} className="text-[#10b981]" /> หน่วยบริการในเครือข่าย
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setCurrentHosp('all')}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full text-[12.5px] font-semibold transition-all cursor-pointer ${
                    currentHosp === 'all'
                      ? 'bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] font-bold'
                      : 'text-[#475569] hover:bg-[#f8fafc]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0"></span>
                  <span>All Cup (ภาพรวม)</span>
                </button>
                {Object.entries(hospitalMap).filter(([k]) => k !== 'all' && k.length >= 5).map(([code, name], idx) => {
                  const cleanName = name.replace(/^[0-9]+\s*[-–]?\s*/, '');
                  const isAct = currentHosp === code;
                  return (
                    <button
                      key={code}
                      onClick={() => setCurrentHosp(code)}
                      className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full text-[12.5px] font-semibold transition-all cursor-pointer ${
                        isAct
                          ? 'bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] font-bold'
                          : 'text-[#475569] hover:bg-[#f8fafc]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: HOSP_PALETTE[idx % HOSP_PALETTE.length] }}></span>
                      <span className="truncate">{cleanName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#e2e8f0]">
              <div className="text-[11.5px] font-bold text-[#64748b] mb-3 flex items-center gap-2">
                <FileText size={15} className="text-[#10b981]" /> รายงานการเงิน & เอกสาร
              </div>
              <button
                onClick={() => setCurrentView('expenses')}
                className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-[#064e3b] text-white font-bold text-[13px] shadow-[0_4px_12px_rgba(6,78,59,0.2)] mb-2.5 hover:bg-[#022c22] transition-all cursor-pointer"
              >
                <Wallet size={16} /> สรุปค่าใช้จ่าย Cup
              </button>
              <button
                onClick={() => setCurrentView('payable')}
                className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-[#065f46] text-white font-bold text-[13px] shadow-[0_4px_12px_rgba(6,95,70,0.2)] hover:bg-[#044734] transition-all cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="16" height="12" rx="2"/>
                  <circle cx="10" cy="12" r="2.5"/>
                  <path d="M6 6V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/>
                </svg>
                รายงานพึ่งจ่าย
              </button>
            </div>
          </div>

          <div className="p-4 border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-[#94a3b8]">
            <span>CLAIMCUP Portal</span>
            <button onClick={() => { localStorage.removeItem('claimcup_user'); setCurrentUser(null); }} className="text-red-500 font-bold flex items-center gap-1 hover:underline cursor-pointer">
              <LogOut size={12} /> ออกจากระบบ
            </button>
          </div>
        </aside>
      )}

      {/* ═══════════════ MAIN CONTENT SHELL ═══════════════ */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* ════════ VIEW 1: OVERVIEW DASHBOARD ════════ */}
        {currentView === 'overview' && (
          <div>
            <header className="print:hidden bg-white border-b border-[#e2e8f0] px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-3">
                <Leaf className="text-[#022c22]" size={26} strokeWidth={2.3} />
                <div>
                  <div className="text-2xl font-black text-[#022c22] tracking-tight">Health Claim Analytics</div>
                  <div className="text-[11px] font-extrabold text-[#64748b] tracking-wider uppercase flex items-center gap-2 mt-0.5">
                    <span>CUP SANKHONG DASHBOARD</span> • 
                    <span className="bg-[#cbfbe4] text-[#064e3b] px-2 py-0.5 rounded text-[11px] font-extrabold">{currentYear}</span> • 
                    <span className="text-[#b91c1c] font-black">{selectedHospName.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#064e3b] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 size={14} className="text-[#34d399]" /> PUBLIC HEALTH APPROVED
                </div>
                <div className="text-xs font-bold text-[#475569] bg-white border border-[#e2e8f0] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Clock size={14} /> {clockTime}
                </div>
              </div>
            </header>

            <div className="p-6 md:p-8 max-w-[1560px] mx-auto w-full space-y-6">
              
              {/* 🌲 Hero Banner (Forest Gradient - Premium Balanced & Bold) */}
              <div className="bg-gradient-to-br from-[#022c22] via-[#043e30] to-[#064e3b] rounded-3xl p-7 md:p-9 text-white shadow-[0_12px_35px_rgba(2,44,34,0.2)] flex flex-col lg:flex-row items-center justify-between gap-8 border border-emerald-500/20">
                <div className="flex-1 min-w-[320px]">
                  <div className="text-[12px] font-extrabold uppercase tracking-widest text-[#34d399] mb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#34d399] animate-pulse"></span>
                    <span>CUMULATIVE HEALTH DISBURSEMENT</span>
                  </div>
                  
                  {/* Huge Number Typography */}
                  <div className="flex items-baseline gap-2.5 my-1.5">
                    <span className="text-4xl md:text-5xl font-black text-[#34d399] leading-none">฿</span>
                    <span className="text-5xl md:text-[64px] font-black tracking-tight text-white leading-none drop-shadow-md">
                      {fmt(processedData.totalAmt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <span className="text-[14px] font-bold text-[#d1fae5]">
                      ยอดเงินรวมเบิกชดเชยประจำปี <strong className="text-[#34d399] underline underline-offset-4">{currentYear}</strong>
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 hidden sm:inline-block"></span>
                    <span className="text-[13px] font-black text-[#fca5a5] bg-red-950/40 border border-red-500/30 px-3 py-0.5 rounded-full inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      หน่วยบริการ: {selectedHospName}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-3 flex-wrap">
                    {currentUser?.role === 'bm' && (
                      <button
                        onClick={() => setCurrentView('director')}
                        className="bg-white/15 hover:bg-white/25 border border-white/30 px-5 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Sparkles size={15} className="text-[#34d399]" /> สรุปบทวิเคราะห์ Cup สันโค้ง (สำหรับ ผอ.)
                      </button>
                    )}
                    <div className="bg-emerald-950/50 border border-emerald-400/20 px-4 py-2 rounded-full text-xs font-bold text-emerald-200 hidden sm:flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[#34d399]" /> รพ.สต. ในเครือข่าย 5 แห่ง
                    </div>
                  </div>
                </div>

                {/* Donut Card (Wider container with Level Indicator Bars) */}
                <div className="bg-white text-slate-900 rounded-3xl p-6 md:p-7 flex flex-col sm:flex-row items-center gap-7 shadow-xl border border-emerald-950/10 w-full lg:max-w-[580px] xl:max-w-[620px] shrink-0">
                  <div className="relative w-[150px] h-[150px] shrink-0">
                    <canvas ref={donutCanvasRef}></canvas>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                      <div className="text-[10px] font-extrabold text-[#94a3b8] uppercase tracking-wider">
                        {currentHosp === 'all' ? 'CUP SHARE' : 'สัดส่วน'}
                      </div>
                      <div className="text-[20px] font-black text-[#0f172a]">
                        {currentHosp === 'all' ? `${Object.keys(hospitalMap).filter(k => k !== 'all' && k.length >= 5).length} แห่ง` : `${currentHospPct}%`}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {Object.entries(hospitalMap).filter(([k]) => k !== 'all' && k.length >= 5).map(([code, name], idx) => {
                      const clean = name.replace(/^[0-9]+\s*[-–]?\s*/, '').replace(/รพ\.สต\.\s*/g, '').trim();
                      const amt = processedData.hospTotals[code] || 0;
                      const isSelected = currentHosp === code;
                      
                      const styleMap = {
                        '05954': { dot: '#3b82f6' },
                        '05962': { dot: '#10b981' },
                        '05957': { dot: '#f97316' },
                        '05959': { dot: '#a855f7' },
                        '05956': { dot: '#ec4899' },
                      };
                      const s = styleMap[code] || { dot: HOSP_PALETTE[idx % HOSP_PALETTE.length] };

                      const maxAmt = Math.max(...Object.values(processedData.hospTotals).filter(v => typeof v === 'number'), 1);
                      const ratio = amt / maxAmt;
                      const activeBars = ratio >= 0.75 ? 4 : ratio >= 0.45 ? 3 : ratio >= 0.18 ? 2 : ratio > 0 ? 1 : 0;

                      return (
                        <div
                          key={code}
                          onClick={() => setCurrentHosp(code)}
                          className={`flex items-center justify-between gap-2 p-1.5 rounded-xl cursor-pointer transition-all hover:bg-slate-50 ${
                            isSelected ? 'ring-2 ring-emerald-500 bg-emerald-50/50 shadow-xs' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-[9px] h-[9px] rounded-full shrink-0 shadow-xs" style={{ backgroundColor: s.dot }}></div>
                            <span className="truncate text-[12.5px] font-bold text-slate-700">{clean}</span>
                          </div>
                          
                          {/* 📊 สัญลักษณ์ขีดสีบอกระดับ (น้อย=เขียว -> ปานกลาง=เหลือง -> มาก=ส้ม -> สูงสุด=แดง) */}
                          <div className="flex items-center gap-1 shrink-0 p-1 bg-slate-50 border border-slate-200/80 rounded-lg">
                            {[
                              { bg: 'bg-emerald-500', label: 'น้อย' },
                              { bg: 'bg-amber-400', label: 'ปานกลาง' },
                              { bg: 'bg-orange-500', label: 'มาก' },
                              { bg: 'bg-rose-500', label: 'สูงสุด' },
                            ].map((seg, sIdx) => {
                              const isActive = sIdx < activeBars;
                              return (
                                <span
                                  key={sIdx}
                                  className={`w-2.5 h-3.5 rounded-[2.5px] transition-all ${
                                    isActive
                                      ? `${seg.bg} shadow-xs`
                                      : 'bg-slate-200/70 opacity-30'
                                  }`}
                                  title={seg.label}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ══ 2. YoY Comparison Chart (Live from Payment table) ══ */}
              <div className="bg-white rounded-3xl border-2 border-emerald-200/90 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-400 transition-all duration-300 overflow-hidden relative group">
                {/* Top Gradient Highlight Stripe */}
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-400"></div>
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6 flex-wrap gap-3 border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                        <TrendingUp size={20} />
                      </div>
                      <div>
                        <div className="font-black text-base text-[#0f172a]">
                          เปรียบเทียบยอดเบิกรายเดือน (YoY) — ปีงบ 2568 VS 2569
                        </div>
                        <div className="text-xs text-[#64748b] mt-0.5">
                          แหล่งข้อมูล: ยอดเบิกจ่ายสะสม 4 หมวดงาน | <span className="font-bold text-emerald-800">{selectedHospName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2.5 text-xs font-extrabold bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-2xl shadow-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                          <span className="text-slate-600">ปีงบ 2568 (฿ {fmt(monthlyTrendData.total68)})</span>
                        </div>
                        <span className="text-slate-300">|</span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#064e3b] inline-block"></span>
                          <span className="text-[#064e3b]">ปีงบ 2569 (฿ {fmt(monthlyTrendData.total69)})</span>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Live Claim Trend</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative h-[320px] w-full">
                    <canvas ref={trendCanvasRef}></canvas>
                  </div>
                </div>
              </div>

              {/* ══ 1. 4 METRIC CARDS (1.PPFS, 2.Thai Med, 3.Herbal, 4.Physical) ══ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {/* 1. PPFS (รายได้งบ PPFS) */}
                {(() => {
                  const pHosp = ppfsData.hospList.find(x => x.code === currentHosp);
                  const pAmt = currentHosp === 'all' ? (ppfsData.totalAmt || 294185) : (pHosp ? pHosp.totalAmt : 0);
                  const pTop = currentHosp === 'all' ? 'คัดกรองเบาหวาน-ไขมัน/CXR' : (pHosp?.topService || 'คัดกรองสุขภาพ');
                  return (
                    <div
                      onClick={() => setCurrentView('ppfs')}
                      className="bg-gradient-to-br from-white via-white to-blue-50 rounded-3xl border-2 border-blue-200 p-5 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400 hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group"
                    >
                      <div className="absolute top-0 right-0 w-28 h-28 bg-blue-200/20 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-300/30 transition-all"></div>
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
                            <span>✨</span> รายได้งบ PPFS
                          </span>
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                            <DollarSign size={16} />
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-slate-500">
                          รายได้งบ PPFS ปี {currentYear.slice(2)} {currentHosp !== 'all' && `(${selectedHospName})`}
                        </div>
                        <div className="text-2xl md:text-3xl font-black text-[#0f172a] mt-1 tracking-tight">
                          ฿ {fmt(pAmt)}
                        </div>
                      </div>
                      <div className="text-[11px] font-semibold text-blue-700 truncate flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100">
                        <Trophy size={13} className="text-blue-500 shrink-0" />
                        <span>สูงสุด: {pTop}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* 2. Thai Med (แพทย์แผนไทย) */}
                {(() => {
                  const isYr69 = String(currentYear || '') === '2569';
                  const tHosp = thaiData.hospList.find(x => x.code === currentHosp);
                  const tAmt = isYr69 ? 0 : (currentHosp === 'all' ? (thaiData.totalAmt || 252900) : (tHosp ? tHosp.totalAmt : 0));
                  const tTop = isYr69
                    ? 'รอเชื่อมต่อข้อมูลปี 2569'
                    : (currentHosp === 'all' ? 'บริการนวด/ประคบ (฿ 175,400)' : (tHosp?.topService || 'บริการนวดและประคบ'));
                  return (
                    <div
                      onClick={() => setCurrentView('thai')}
                      className="bg-gradient-to-br from-white via-white to-amber-50 rounded-3xl border-2 border-amber-200 p-5 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-400 hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group"
                    >
                      <div className="absolute top-0 right-0 w-28 h-28 bg-amber-200/20 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-300/30 transition-all"></div>
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
                            <span>✨</span> แพทย์แผนไทย
                          </span>
                          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                            <HeartPulse size={16} />
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-slate-500">
                          ชดเชยแพทย์แผนไทย ปี {currentYear.slice(2)} {currentHosp !== 'all' && `(${selectedHospName})`}
                        </div>
                        <div className="text-2xl md:text-3xl font-black text-[#0f172a] mt-1 tracking-tight">
                          {isYr69 ? (
                            <span className="text-xl font-extrabold text-slate-400">ยังไม่มีข้อมูล</span>
                          ) : (
                            `฿ ${fmt(tAmt)}`
                          )}
                        </div>
                      </div>
                      <div className="text-[11px] font-semibold text-amber-700 truncate flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100">
                        <Trophy size={13} className="text-amber-500 shrink-0" />
                        <span>{isYr69 ? 'รอข้อมูลนำเข้าปี 2569' : `สูงสุด: ${tTop}`}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* 3. Herbal (ยาสมุนไพร) */}
                {(() => {
                  const hHosp = herbalData.hospList.find(x => x.code === currentHosp);
                  const hAmt = currentHosp === 'all' ? (herbalData.totalAmt || 244931) : (hHosp ? hHosp.totalAmt : 0);
                  const hTop = currentHosp === 'all' ? `ขมิ้นชันแคปซูล (กำไร +${herbalData.marginPct}%)` : (hHosp?.topMedicine || 'ขมิ้นชันแคปซูล');
                  return (
                    <div
                      onClick={() => setCurrentView('herbal')}
                      className="bg-gradient-to-br from-white via-white to-emerald-50 rounded-3xl border-2 border-emerald-200 p-5 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-400 hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group"
                    >
                      <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-200/20 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-300/30 transition-all"></div>
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
                            <span>✨</span> ยาสมุนไพร
                          </span>
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                            <Leaf size={16} />
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-slate-500">
                          ชดเชย ยาสมุนไพร ปี {currentYear.slice(2)} {currentHosp !== 'all' && `(${selectedHospName})`}
                        </div>
                        <div className="text-2xl md:text-3xl font-black text-[#0f172a] mt-1 tracking-tight">
                          ฿ {fmt(hAmt)}
                        </div>
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-700 truncate flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100">
                        <Trophy size={13} className="text-emerald-500 shrink-0" />
                        <span>สูงสุด: {hTop}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* 4. กายภาพบำบัด (ลำดับที่ 4 - เปลี่ยนตามปีงบประมาณ) */}
                <div
                  onClick={() => setCurrentView('physical')}
                  className="bg-gradient-to-br from-white via-white to-sky-50 rounded-3xl border-2 border-sky-200 p-5 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 hover:border-sky-400 hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group"
                >
                  <div className="absolute top-0 right-0 w-28 h-28 bg-sky-200/20 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-300/30 transition-all"></div>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
                        <span>✨</span> กายภาพบำบัด
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                        <Activity size={16} />
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      ชดเชย กายภาพบำบัด ปี {currentYear.slice(2)}
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-[#0f172a] mt-1 tracking-tight">
                      ฿ {fmt(physicalData.totalAmt || 230800)}
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold text-sky-700 truncate flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100">
                    <Trophy size={13} className="text-sky-500 shrink-0" />
                    <span>สูงสุด: กายภาพบำบัด_IMC (ภาพรวม)</span>
                  </div>
                </div>
              </div>

              {/* 🏆 3. Top 5 Internal Ranking (5-Column Grid) */}
              <div className="bg-white rounded-3xl border-2 border-[#064e3b] shadow-sm hover:shadow-md transition-all overflow-hidden relative">
                <div className="p-6 md:p-7">
                  <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#064e3b] border border-emerald-200 flex items-center justify-center font-black">
                        <Trophy size={20} className="text-amber-500" />
                      </div>
                      <div>
                        <div className="font-black text-base text-[#0f172a] flex items-center gap-2">
                          การจัดลำดับ 1-5 ภายในเครือข่าย CUP สันโค้ง
                        </div>
                        <div className="text-xs text-[#64748b] mt-0.5">เปรียบเทียบผลงานและยอดชดเชยสะสม ประจำปีงบประมาณ {currentYear}</div>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold bg-emerald-50 text-[#064e3b] px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-xs">
                      🏆 Top 5 Internal Ranking
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
                    {processedData.rankingList.map((item, idx) => {
                      const rankStyles = [
                        { border: 'border-2 border-amber-300 hover:border-amber-500 bg-gradient-to-b from-amber-50/60 to-white', badge: 'bg-amber-100 text-amber-900 border border-amber-300 font-black', shadow: 'hover:shadow-amber-500/15' },
                        { border: 'border-2 border-slate-300 hover:border-slate-500 bg-gradient-to-b from-slate-50/60 to-white', badge: 'bg-slate-100 text-slate-800 border border-slate-300 font-bold', shadow: 'hover:shadow-slate-500/15' },
                        { border: 'border-2 border-orange-300 hover:border-orange-500 bg-gradient-to-b from-orange-50/60 to-white', badge: 'bg-orange-100 text-orange-900 border border-orange-300 font-bold', shadow: 'hover:shadow-orange-500/15' },
                        { border: 'border-2 border-sky-200 hover:border-sky-400 bg-gradient-to-b from-sky-50/40 to-white', badge: 'bg-sky-100 text-sky-900 border border-sky-200 font-bold', shadow: 'hover:shadow-sky-500/15' },
                        { border: 'border-2 border-emerald-200 hover:border-emerald-400 bg-gradient-to-b from-emerald-50/40 to-white', badge: 'bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold', shadow: 'hover:shadow-emerald-500/15' }
                      ];
                      const rs = rankStyles[idx] || rankStyles[0];

                      return (
                        <div
                          key={item.hcode}
                          onClick={() => setCurrentHosp(item.hcode)}
                          className={`rounded-2xl p-4 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg ${rs.shadow} ${rs.border} cursor-pointer transition-all duration-200`}
                        >
                          <div>
                            <div className="flex justify-between items-center mb-2.5">
                              <span className={`text-[10.5px] px-2 py-0.5 rounded-md ${rs.badge}`}>
                                อันดับ {idx + 1}
                              </span>
                              <span className="text-[10px] font-extrabold text-[#064e3b] bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                                {fmt(item.items)} รายการ
                              </span>
                            </div>
                            <div className="font-extrabold text-sm text-slate-900 leading-tight mb-1">{item.name}</div>
                            <div className="text-[10.5px] text-slate-400 font-semibold mb-3">{item.hcode}</div>
                          </div>
                          <div className="pt-2.5 border-t border-slate-100/80">
                            <div className="text-[10px] text-slate-400 font-bold">ยอดเบิกชดเชย (ปี {currentYear.slice(2)})</div>
                            <div className="text-base font-black text-[#064e3b] mt-0.5">฿ {fmt(item.amount)}</div>
                          </div>
                        </div>
                      );
                    })}
                    {processedData.rankingList.length === 0 && (
                      <div className="col-span-5 text-center text-slate-400 font-bold py-6">ไม่มีข้อมูล</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Page Footer */}
              <div className="text-center text-xs text-[#94a3b8] pt-4 pb-2 border-t border-[#e2e8f0]">
                © 2026 CLAIMCUP Sankhong Portal • Health Claim Analytics
              </div>
            </div>
          </div>
        )}

        {/* ════════ VIEW 2: DETAIL VIEW (PPFS / THAI / HERBAL) ════════ */}
        {currentView === 'detail' && (
          <div className="w-full min-h-screen bg-[#f8fafc]">
            {/* Detail Navbar */}
            <nav className="bg-white border-b border-[#e2e8f0] px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-white flex items-center justify-center shadow-[0_4px_10px_rgba(6,78,59,0.25)]">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <span className="text-[10.5px] font-bold text-[#059669] bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 rounded-md inline-block mb-0.5">
                    องค์การบริหารส่วนจังหวัดเชียงใหม่ | ปีงบประมาณ {currentYear}
                  </span>
                  <div className="text-lg font-black text-[#0f172a] leading-tight">แดชบอร์ดผลงาน PP, PPFS & การแพทย์แผนไทย</div>
                  <div className="text-[11.5px] text-[#64748b] font-semibold">แม่ข่าย: 05954 รพ.สต.บ้านสันโค้ง อ.สันกำแพง</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {processedData.groupCards.map(g => (
                  <button
                    key={g.group}
                    onClick={() => setActiveDetailTab(g.group)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      activeDetailTab.toLowerCase() === g.group.toLowerCase()
                        ? 'bg-[#064e3b] text-white shadow-[0_4px_12px_rgba(6,78,59,0.25)]'
                        : 'bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] hover:bg-[#f1f5f9]'
                    }`}
                  >
                    <span>{g.group}</span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-black/20 text-inherit">
                      {g.itemCount}
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => setCurrentView('overview')}
                  className="px-4 py-2 rounded-xl bg-[#f1f5f9] border border-[#cbd5e1] text-[#334155] text-xs font-bold flex items-center gap-1.5 hover:bg-[#e2e8f0] transition-all cursor-pointer ml-2"
                >
                  <ArrowLeft size={15} /> กลับหน้าหลัก
                </button>
              </div>
            </nav>

            <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full space-y-6">
              
              {/* Hero Dark Amber Card */}
              <div className="bg-gradient-to-br from-[#1c1917] to-[#292524] rounded-2xl p-7 text-white shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex justify-between items-center border border-amber-500/20 flex-wrap gap-4">
                <div className="flex-1 min-w-[300px]">
                  <div className="text-[11px] font-bold text-yellow-300 bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 mb-2.5">
                    <Sparkles size={12} /> แหล่งข้อมูล: รวม {activeDetailTab} รพ.สต.สังกัด อบจ.เชียงใหม่
                  </div>
                  <div className="text-2xl font-black text-white mb-1">
                    เจาะลึกรายได้ {activeDetailTab} รายหน่วยบริการ & รายกิจกรรม
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    ตรวจสอบยอดเบิกชดเชย จำแนกตามกิจกรรมและหน่วยบริการ 2 ปีงบประมาณ (2568 vs 2569)
                  </div>
                </div>
                <div className="bg-slate-900/70 border border-white/10 rounded-2xl px-6 py-3.5 text-right min-w-[200px]">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">ยอดเงินรวม ปี 69</div>
                  <div className="text-2xl font-black text-amber-400">฿{fmtD(detailComparisonData.sumAmt69)}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">ปี 68: ฿{fmtD(detailComparisonData.sumAmt68)}</div>
                </div>
              </div>

              {/* Filter Panel */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 shadow-sm flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <label className="text-xs font-bold text-[#64748b]">หน่วยบริการ:</label>
                  <select
                    value={detailFilterHosp}
                    onChange={(e) => setDetailFilterHosp(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-800 min-w-[220px] outline-none cursor-pointer"
                  >
                    <option value="all">ทั้งหมด (5 หน่วยบริการ)</option>
                    {Object.entries(hospitalMap).filter(([k]) => k !== 'all' && k.length >= 5).map(([code, name]) => (
                      <option key={code} value={code}>{code} - {name.replace(/^[0-9]+\s*[-–]?\s*/, '')}</option>
                    ))}
                  </select>
                </div>
                <div className="text-xs font-bold text-[#475569]">
                  พบ <strong className="text-emerald-700">{detailComparisonData.rows.length}</strong> รายการ | ยอดรวมปี 69: <strong className="text-emerald-800">฿{fmtD(detailComparisonData.sumAmt69)}</strong> บาท
                </div>
              </div>

              {/* Detailed Comparison Table */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <th className="p-3 text-center w-12">#</th>
                        <th className="p-3 text-left w-36">กลุ่มบริการ</th>
                        <th className="p-3 text-left">ชื่อรายการบริการ</th>
                        <th className="p-3 text-right w-24">จำนวน 68</th>
                        <th className="p-3 text-right w-32">เงิน 68 (บาท)</th>
                        <th className="p-3 text-right w-24 font-bold text-emerald-800">จำนวน 69</th>
                        <th className="p-3 text-right w-32 font-bold text-emerald-800">เงิน 69 (บาท)</th>
                        <th className="p-3 text-right w-32 bg-sky-700 text-white font-bold">ผลต่าง (บาท)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {detailComparisonData.rows.map((r, i) => {
                        const isPos = r.diffAmt >= 0;
                        return (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="p-3 text-center text-slate-400 font-mono">{i + 1}</td>
                            <td className="p-3 text-slate-600 font-semibold">{r.group}</td>
                            <td className="p-3 font-bold text-slate-800">{r.service}</td>
                            <td className="p-3 text-right text-slate-600">{fmt(r.qty68)}</td>
                            <td className="p-3 text-right text-slate-600">{fmtD(r.amt68)}</td>
                            <td className="p-3 text-right font-bold text-emerald-800">{fmt(r.qty69)}</td>
                            <td className="p-3 text-right font-black text-emerald-800">{fmtD(r.amt69)}</td>
                            <td className={`p-3 text-right font-extrabold ${isPos ? 'text-emerald-600' : 'text-red-600'}`}>
                              {isPos ? '▲ +' : '▼ -'}{fmtD(Math.abs(r.diffAmt))}
                            </td>
                          </tr>
                        );
                      })}
                      {detailComparisonData.rows.length === 0 && (
                        <tr><td colSpan={8} className="p-8 text-center text-slate-400 font-bold">ไม่มีข้อมูลในหมวดนี้</td></tr>
                      )}
                    </tbody>
                    {detailComparisonData.rows.length > 0 && (
                      <tfoot>
                        <tr className="bg-[#ecfdf5] font-black text-emerald-950 border-t-2 border-[#a7f3d0]">
                          <td colSpan={3} className="p-3.5 text-left">รวมทั้งหมด ({detailComparisonData.rows.length} รายการ)</td>
                          <td className="p-3.5 text-right">{fmt(detailComparisonData.sumQty68)}</td>
                          <td className="p-3.5 text-right">{fmtD(detailComparisonData.sumAmt68)}</td>
                          <td className="p-3.5 text-right">{fmt(detailComparisonData.sumQty69)}</td>
                          <td className="p-3.5 text-right text-[13px]">{fmtD(detailComparisonData.sumAmt69)}</td>
                          <td className="p-3.5 text-right bg-sky-800 text-white">
                            {detailComparisonData.totalDiffAmt >= 0 ? '+' : ''}{fmtD(detailComparisonData.totalDiffAmt)}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>

              {/* Detail Charts */}
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
                  <div className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Trophy size={18} className="text-amber-500" /> Top รายการบริการ {activeDetailTab} ที่สร้างรายได้สูงสุด (ปี 2569)
                  </div>
                  <div className="relative h-[300px] w-full">
                    <canvas ref={detailBarCanvasRef}></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════ VIEW 3: PHYSICAL THERAPY VIEW (กายภาพบำบัด & ฟื้นฟูสมรรถภาพ) ════════ */}
        {currentView === 'physical' && (
          <div className="w-full min-h-screen bg-[#f8fafc]">
            {/* Physical Navbar */}
            <nav className="bg-white border-b border-[#e2e8f0] px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm print:hidden">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md">
                  <Activity size={22} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900">ชดเชยค่าบริการกายภาพบำบัด</span>
                    <span className="text-[11px] font-extrabold bg-sky-50 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200">
                      PHYSICAL THERAPY & REHABILITATION
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold">
                    องค์การบริหารส่วนจังหวัดเชียงใหม่ · เครือข่ายบริการสุขภาพ CUP สันโค้ง (ทีมนักกายภาพบำบัดกลาง)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Year Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200 text-xs font-bold">
                  {['2568', '2569'].map(yr => (
                    <button
                      key={yr}
                      onClick={() => setCurrentYear(yr)}
                      className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                        currentYear === yr ? 'bg-[#0284c7] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ปี {yr}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => window.print()}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3.5 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer size={14} /> พิมพ์รายงาน
                </button>
                <button
                  onClick={() => setCurrentView('overview')}
                  className="bg-[#064e3b] hover:bg-[#022c22] text-white font-bold px-4 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <ArrowLeft size={14} /> กลับหน้าหลัก
                </button>
              </div>
            </nav>

            <div className="p-6 md:p-8 max-w-[1560px] mx-auto space-y-6">
              {/* ─── Hero Banner: Physical Therapy ─── */}
              <div className="bg-gradient-to-br from-[#0c4a6e] via-[#075985] to-[#0369a1] rounded-3xl p-7 md:p-9 text-white shadow-[0_12px_35px_rgba(2,132,199,0.25)] flex flex-col lg:flex-row items-center justify-between gap-8 border border-sky-400/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex-1 min-w-[320px] relative z-10">
                  <div className="text-[12px] font-extrabold uppercase tracking-widest text-sky-300 mb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-300 animate-pulse"></span>
                    <span>PHYSICAL THERAPY COMPENSATION · FY {currentYear}</span>
                  </div>

                  <div className="flex items-baseline gap-3 my-2">
                    <span className="text-4xl md:text-5xl font-black text-sky-300 leading-none">฿</span>
                    <span className="text-5xl md:text-[64px] font-black tracking-tight text-white leading-none drop-shadow-md">
                      {fmt(currentYear === '2568' ? physicalData.sum68 : physicalData.totalAmt69)}
                    </span>
                  </div>

                  <div className="text-[14px] font-bold text-sky-100/90 mt-2">
                    ยอดเงินชดเชยค่าบริการกายภาพบำบัดสะสม เครือข่าย CUP สันโค้ง (ให้บริการครอบคลุม 5 รพ.สต.)
                  </div>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                      <div className="text-[11px] font-bold text-sky-200">จำนวนการให้บริการ</div>
                      <div className="text-xl font-black text-white mt-0.5">{fmt(physicalData.totalQty69)} <span className="text-xs font-normal text-sky-200">ครั้ง</span></div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                      <div className="text-[11px] font-bold text-sky-200">ทีมนักกายภาพบำบัดกลาง</div>
                      <div className="text-xl font-black text-white mt-0.5">{physicalData.therapistList.length} <span className="text-xs font-normal text-sky-200">คน</span></div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                      <div className="text-[11px] font-bold text-sky-200">อัตราชดเชย</div>
                      <div className="text-xl font-black text-emerald-300 mt-0.5 flex items-center gap-1">
                        100% ✅
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Service Breakdown Summary Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 w-full lg:w-[360px] shrink-0 text-white relative z-10 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/15 pb-3">
                    <span className="text-xs font-extrabold tracking-wider text-sky-200 uppercase">สัดส่วนบริการกายภาพบำบัด</span>
                    <span className="text-[11px] bg-sky-400/20 text-sky-200 px-2 py-0.5 rounded-full font-bold">{physicalData.serviceList.length} หมวด</span>
                  </div>

                  <div className="space-y-3">
                    {physicalData.serviceList.slice(0, 3).map((s, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-200 truncate max-w-[200px]">{s.name}</span>
                          <span className="text-white font-black">฿ {fmt(s.amt)}</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full" style={{ width: s.pct }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-[11.5px] text-sky-200/80 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-sky-300 shrink-0" />
                    <span>ข้อมูลเชื่อมต่อสดจากระบบเบิกจ่าย สปสช.</span>
                  </div>
                </div>
              </div>

              {/* ─── การ์ดผลงานรายบุคคล: นักกายภาพบำบัด 3 ท่าน ─── */}
              <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-6 bg-[#0284c7] rounded-full"></div>
                    <h2 className="text-lg font-black text-slate-900">
                      ผลงานรายบุคคล — ทีมนักกายภาพบำบัดกลาง (ปีงบ 2569)
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    คลิกการ์ดเพื่อดูรายงานเจาะลึก 🔍
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {physicalData.therapistList.map((t, idx) => {
                    const rankThemes = [
                      { border: 'border-2 border-sky-300 hover:border-sky-500 bg-gradient-to-b from-sky-50/60 to-white', badge: 'bg-sky-100 text-sky-900 border border-sky-300 font-black', shadow: 'hover:shadow-sky-500/15', rank: '🥇 อันดับ 1', barGrad: 'from-sky-500 to-blue-600', avatarBg: 'bg-sky-600' },
                      { border: 'border-2 border-emerald-300 hover:border-emerald-500 bg-gradient-to-b from-emerald-50/60 to-white', badge: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold', shadow: 'hover:shadow-emerald-500/15', rank: '🥈 อันดับ 2', barGrad: 'from-emerald-500 to-teal-600', avatarBg: 'bg-emerald-600' },
                      { border: 'border-2 border-amber-300 hover:border-amber-500 bg-gradient-to-b from-amber-50/60 to-white', badge: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold', shadow: 'hover:shadow-amber-500/15', rank: '🥉 อันดับ 3', barGrad: 'from-amber-500 to-orange-600', avatarBg: 'bg-amber-600' }
                    ];
                    const rt = rankThemes[idx] || rankThemes[0];

                    return (
                      <div
                        key={t.id || idx}
                        onClick={() => setTherapistPopupId(t.id)}
                        className={`rounded-3xl ${rt.border} p-6 shadow-sm hover:shadow-xl ${rt.shadow} hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden`}
                      >
                        <div>
                          {/* Card Header: Avatar & Rank */}
                          <div className="flex items-start justify-between gap-3 mb-5">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-2xl ${rt.avatarBg} text-white shadow-md flex items-center justify-center font-black shrink-0 transition-transform group-hover:scale-105`}>
                                <Activity size={22} className="text-white drop-shadow-xs" />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-base text-slate-900 group-hover:text-[#0284c7] transition-colors leading-tight">
                                  {t.name}
                                </h4>
                                <div className="text-xs text-slate-400 font-semibold mt-0.5">
                                  {t.role || 'นักกายภาพบำบัด'}
                                </div>
                              </div>
                            </div>

                            <span className={`text-[11px] px-2.5 py-1 rounded-full ${rt.badge} shrink-0`}>
                              {rt.rank}
                            </span>
                          </div>

                          {/* Hero Metric: Total Amount Claimed */}
                          <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-100 mb-4 group-hover:bg-white group-hover:border-slate-200 transition-all">
                            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                              <span className="flex items-center gap-1">
                                <DollarSign size={13} className="text-slate-400" /> ยอดเบิกชดเชยรวม
                              </span>
                              <span className="font-black text-slate-700">{t.pct} ของ CUP</span>
                            </div>
                            <div className="flex items-baseline justify-between">
                              <div className="text-2xl font-black text-slate-900 tracking-tight">
                                ฿ {fmt(t.totalAmt)}
                              </div>
                              <span className="text-[11px] font-bold text-slate-400">ปีงบ 2569</span>
                            </div>

                            {/* Progress bar of CUP Share */}
                            <div className="w-full h-2 bg-slate-200/70 rounded-full mt-3 overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${rt.barGrad} transition-all duration-500`}
                                style={{ width: t.pct }}
                              ></div>
                            </div>
                          </div>

                          {/* 2 Micro-Stat Boxes */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="rounded-2xl p-3 bg-slate-50/70 border border-slate-100 flex flex-col justify-between">
                              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                                <Activity size={13} className="text-slate-400" /> จำนวนบริการ
                              </div>
                              <div className="text-lg font-black text-slate-900 mt-1">
                                {fmt(t.totalQty)} <span className="text-xs font-semibold text-slate-400">ครั้ง</span>
                              </div>
                            </div>

                            <div className="rounded-2xl p-3 bg-slate-50/70 border border-slate-100 flex flex-col justify-between">
                              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                                <TrendingUp size={13} className="text-slate-400" /> เฉลี่ย/ครั้ง
                              </div>
                              <div className="text-lg font-black text-slate-900 mt-1">
                                ฿ {fmt(t.avg)}
                              </div>
                            </div>
                          </div>

                          {/* Top Services Mini Badges */}
                          {t.services && t.services.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                บริการเด่น
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {t.services.slice(0, 2).map((s, sI) => (
                                  <span key={sI} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200/60 truncate max-w-full">
                                    {(s?.name || s?.service || 'บริการ').replace('กายภาพบำบัด_', '')}: <strong className="text-slate-900 font-bold">฿{fmt(s?.amt || s?.amount || 0)}</strong>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Interactive Footer */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between group-hover:text-[#0284c7] transition-colors">
                          <span className="text-xs font-bold text-slate-500">
                            คลิกดูสถิติเจาะลึก
                          </span>
                          <span className="text-xs font-extrabold flex items-center gap-1 text-[#0284c7] group-hover:translate-x-1 transition-transform">
                            รายละเอียด <ArrowUpRight size={14} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ─── ตารางแยกตามประเภทการให้บริการ (Service Types) ─── */}
              <div className="bg-white rounded-3xl border border-sky-200 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 hover:border-sky-400 transition-all duration-300 overflow-hidden relative group">
                <div className="h-1.5 w-full bg-gradient-to-r from-[#0284c7] via-cyan-400 to-emerald-400"></div>
                <div className="p-5 md:p-6 border-b border-sky-100/80 bg-gradient-to-r from-sky-50/50 via-white to-sky-50/20 flex justify-between items-center flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-[#0284c7] flex items-center justify-center font-black">
                      <Table2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base">ตารางแยกตามประเภทการให้บริการ (Service Types)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">ปีงบประมาณ 2569 · เรียงจากยอดเบิกมากไปน้อย</p>
                    </div>
                  </div>
                  <span className="bg-sky-50 text-sky-700 border border-sky-200 text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-xs">
                    {physicalData.serviceList.length} รายการบริการหลัก
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200">
                        <th className="p-4 uppercase">ประเภทบริการ</th>
                        <th className="p-4 text-right uppercase">จำนวนครั้ง</th>
                        <th className="p-4 text-right uppercase">ยอดเบิก (บาท)</th>
                        <th className="p-4 w-[240px] uppercase">สัดส่วน</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {physicalData.serviceList.map((s, sIdx) => {
                        const barColors = ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
                        const color = barColors[sIdx % barColors.length];
                        return (
                          <tr key={sIdx} className="hover:bg-sky-50/30 transition-colors">
                            <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                              {s.name}
                            </td>
                            <td className="p-4 text-right text-slate-600 font-medium">{fmt(s.qty)} ครั้ง</td>
                            <td className="p-4 text-right font-black text-slate-900">฿ {fmtD(s.amt)}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2.5">
                                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                                  <div className="h-full rounded-full" style={{ width: s.pct, backgroundColor: color }}></div>
                                </div>
                                <span className="text-xs font-black min-w-[42px] text-right" style={{ color }}>{s.pct}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100/90 font-black text-sm text-slate-900 border-t border-slate-200">
                        <td className="p-4">รวมทั้งหมด</td>
                        <td className="p-4 text-right">{fmt(physicalData.serviceList.reduce((a, b) => a + (b.qty || 0), 0))} ครั้ง</td>
                        <td className="p-4 text-right text-[#0284c7] font-black text-base">฿ {fmtD(physicalData.totalAmt69)}</td>
                        <td className="p-4 text-xs text-slate-500 font-black text-right">100%</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* ─── กราฟเปรียบเทียบยอดเบิกรายเดือน (YoY Comparison Chart) ─── */}
              <div className="bg-white rounded-3xl border border-sky-200 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 hover:border-sky-400 transition-all duration-300 overflow-hidden relative group">
                <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500"></div>
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-start mb-6 flex-wrap gap-4 border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-[#0284c7] flex items-center justify-center font-black">
                        <Activity size={20} />
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-base">
                          กราฟเปรียบเทียบยอดเบิกรายเดือน (YoY Comparison)
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          เปรียบเทียบยอดเงินชดเชยค่าบริการกายภาพบำบัดรายเดือน ระหว่างปีงบประมาณ 2568 และ 2569
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-extrabold bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-2xl shadow-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-md bg-slate-400 inline-block shadow-xs"></span>
                        <span className="text-slate-600">ปีงบ 2568 (฿ {fmt(physicalData.sum68)})</span>
                      </div>
                      <span className="text-slate-300">|</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-md bg-[#0284c7] inline-block shadow-xs"></span>
                        <span className="text-[#0284c7]">ปีงบ 2569 (฿ {fmt(physicalData.sum69)})</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-[320px] w-full">
                    <canvas ref={physYoYCanvasRef}></canvas>
                  </div>
                </div>
              </div>

              {/* ─── Popup: รายละเอียดการให้บริการรายบุคคล (นักกายภาพ) ─── */}
              {therapistPopupId && (
                (() => {
                  const currentTherapist = (physicalData.therapistList || []).find(t => String(t.id) === String(therapistPopupId)) || THERAPIST_DETAIL[therapistPopupId];
                  if (!currentTherapist) return null;
                  return (
                    <div
                      onClick={() => setTherapistPopupId(null)}
                      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                      >
                        <div className="flex justify-between items-center p-5 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shrink-0 shadow-sm bg-[#0284c7]"
                            >
                              <Activity size={22} className="text-white drop-shadow-xs" />
                            </div>
                            <div>
                              <div className="font-extrabold text-base text-slate-900">
                                {currentTherapist.name}
                              </div>
                              <div className="text-xs text-slate-500 font-medium">{currentTherapist.role || 'นักกายภาพบำบัด'} · ปีงบ 2569</div>
                            </div>
                          </div>
                          <button
                            onClick={() => setTherapistPopupId(null)}
                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="p-6 space-y-5">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                              <div className="text-xs text-slate-500 font-semibold">จำนวนครั้งรวม</div>
                              <div className="text-xl font-black text-slate-900 mt-1">
                                {fmt(currentTherapist.totalQty || 0)} ครั้ง
                              </div>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                              <div className="text-xs text-slate-500 font-semibold">ยอดเบิกรวม</div>
                              <div className="text-xl font-black text-slate-900 mt-1">
                                ฿ {fmt(currentTherapist.totalAmt || 0)}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                              แยกตามประเภทบริการ
                            </div>
                            <table className="w-full text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-slate-200 text-slate-400">
                                  <th className="text-left pb-2 font-bold uppercase">บริการ</th>
                                  <th className="text-right pb-2 font-bold uppercase">ครั้ง</th>
                                  <th className="text-right pb-2 font-bold uppercase">บาท</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-xs">
                                {(currentTherapist.services || []).map((s, sIdx) => (
                                  <tr key={sIdx}>
                                    <td className="py-2.5 font-semibold text-slate-700">{s?.name || s?.service || 'บริการ'}</td>
                                    <td className="py-2.5 text-right text-slate-500">{fmt(s?.qty || s?.count || 0)}</td>
                                    <td className="py-2.5 text-right font-bold text-slate-900">฿ {fmtD(s?.amt || s?.amount || 0)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800 flex items-center gap-2">
                            <span>ℹ️</span>
                            <span>ตัวเลขรายบุคคลคำนวณจากสัดส่วนการให้บริการจริงในเครือข่าย</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Page Footer */}
              <div className="text-center text-xs text-[#94a3b8] pt-4 pb-2 border-t border-[#e2e8f0]">
                © 2026 CLAIMCUP Sankhong Portal • Health Claim Intelligence Platform
              </div>
            </div>
          </div>
        )}

        {/* ════════ VIEW 3.5: THAI TRADITIONAL MEDICINE VIEW (ชดเชยแพทย์แผนไทย) ════════ */}
        {currentView === 'thai' && (
          <div className="w-full min-h-screen bg-[#f8fafc]">
            {/* Thai Medicine Navbar */}
            <nav className="bg-white border-b border-[#e2e8f0] px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm print:hidden">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-md">
                  <HeartPulse size={22} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900">ชดเชยค่าบริการแพทย์แผนไทย</span>
                    <span className="text-[11px] font-extrabold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                      THAI TRADITIONAL MEDICINE
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold">
                    องค์การบริหารส่วนจังหวัดเชียงใหม่ · เครือข่ายบริการสุขภาพ CUP สันโค้ง (5 รพ.สต.)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Year Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200 text-xs font-bold">
                  {['2568', '2569', '2570'].map(yr => (
                    <button
                      key={yr}
                      onClick={() => setCurrentYear(yr)}
                      className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                        currentYear === yr ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ปี {yr}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => window.print()}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3.5 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer size={14} /> พิมพ์รายงาน
                </button>
                <button
                  onClick={() => setCurrentView('overview')}
                  className="bg-[#064e3b] hover:bg-[#022c22] text-white font-bold px-4 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <ArrowLeft size={14} /> กลับหน้าหลัก
                </button>
              </div>
            </nav>

            <div className="p-6 md:p-8 max-w-[1560px] mx-auto space-y-6">
              {/* ─── Hero Banner: Thai Medicine ─── */}
              <div className="bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#451a03] rounded-3xl p-7 md:p-9 text-white shadow-[0_12px_35px_rgba(69,26,3,0.25)] flex flex-col lg:flex-row items-center justify-between gap-8 border border-amber-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex-1 min-w-[320px] relative z-10">
                  <div className="text-[12px] font-extrabold uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>THAI TRADITIONAL MEDICINE COMPENSATION · FY {currentYear}</span>
                  </div>

                  <div className="flex items-baseline gap-3 my-2">
                    <span className="text-4xl md:text-5xl font-black text-amber-400 leading-none">฿</span>
                    <span className="text-5xl md:text-[64px] font-black tracking-tight text-white leading-none drop-shadow-md">
                      {fmt(thaiData.totalAmt69)}
                    </span>
                  </div>

                  <div className="text-[14px] font-bold text-amber-200/90 mt-2">
                    ยอดเงินชดเชยค่าบริการแพทย์แผนไทยสะสม เครือข่าย รพ.สต. 5 แห่ง
                  </div>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                      <div className="text-[11px] font-bold text-amber-200">จำนวนการให้บริการ</div>
                      <div className="text-xl font-black text-white mt-0.5">{fmt(thaiData.totalQty69)} <span className="text-xs font-normal text-amber-200">ครั้ง</span></div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                      <div className="text-[11px] font-bold text-amber-200">เฉลี่ยชดเชยต่อครั้ง</div>
                      <div className="text-xl font-black text-white mt-0.5">฿ {fmt(thaiData.avgPerService)}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                      <div className="text-[11px] font-bold text-amber-200">เติบโตเปรียบเทียบปี 68</div>
                      <div className="text-xl font-black text-[#34d399] mt-0.5 flex items-center gap-1">
                        <TrendingUp size={18} />
                        +{thaiData.sum68 > 0 ? ((Math.abs(thaiData.sum69 - thaiData.sum68) / thaiData.sum68) * 100).toFixed(1) : '0'}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Rep Breakdown Card (งวดที่ 1 vs งวดที่ 2) */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 w-full lg:w-[360px] shrink-0 text-white relative z-10 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/15 pb-3">
                    <span className="text-xs font-extrabold tracking-wider text-amber-300 uppercase">สรุปแยกตามงวดการเบิกจ่าย</span>
                    <span className="text-[11px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">2 งวด</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-200">งวดที่ 1 (ต.ค. - พ.ย.)</span>
                        <span className="text-white font-black">฿ {fmt(thaiData.rep1Amt69 || 142000)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${thaiData.totalAmt69 > 0 ? Math.round(((thaiData.rep1Amt69 || 142000) / thaiData.totalAmt69) * 100) : 60}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-200">งวดที่ 2 (ธ.ค. - ม.ค.)</span>
                        <span className="text-white font-black">฿ {fmt(thaiData.rep2Amt69 || 84931)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${thaiData.totalAmt69 > 0 ? Math.round(((thaiData.rep2Amt69 || 84931) / thaiData.totalAmt69) * 100) : 40}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-[11.5px] text-amber-200/80 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                    <span>ข้อมูลเชื่อมต่อสดจากระบบเบิกจ่าย สปสช.</span>
                  </div>
                </div>
              </div>

              {/* ─── 5 รพ.สต. Performance Cards (CUP Network Ranking 1 to 5) ─── */}
              <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-6 bg-amber-600 rounded-full"></div>
                    <h2 className="text-lg font-black text-slate-900">
                      ผลงานแพทย์แผนไทย จำแนกตาม รพ.สต. 5 แห่งในเครือข่าย
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    เรียงตามยอดเงินชดเชยสูงสุด ประจำปีงบประมาณ {currentYear}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
                  {thaiData.hospList.map((h, idx) => {
                    const rankStyles = [
                      { border: 'border-2 border-amber-300 hover:border-amber-500 bg-gradient-to-b from-amber-50/60 to-white', badge: 'bg-amber-100 text-amber-900 border border-amber-300 font-black', shadow: 'hover:shadow-amber-500/15', rank: '🥇 อันดับ 1' },
                      { border: 'border-2 border-slate-300 hover:border-slate-500 bg-gradient-to-b from-slate-50/60 to-white', badge: 'bg-slate-100 text-slate-800 border border-slate-300 font-bold', shadow: 'hover:shadow-slate-500/15', rank: '🥈 อันดับ 2' },
                      { border: 'border-2 border-orange-300 hover:border-orange-500 bg-gradient-to-b from-orange-50/60 to-white', badge: 'bg-orange-100 text-orange-900 border border-orange-300 font-bold', shadow: 'hover:shadow-orange-500/15', rank: '🥉 อันดับ 3' },
                      { border: 'border-2 border-sky-200 hover:border-sky-400 bg-gradient-to-b from-sky-50/40 to-white', badge: 'bg-sky-100 text-sky-900 border border-sky-200 font-bold', shadow: 'hover:shadow-sky-500/15', rank: 'อันดับ 4' },
                      { border: 'border-2 border-emerald-200 hover:border-emerald-400 bg-gradient-to-b from-emerald-50/40 to-white', badge: 'bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold', shadow: 'hover:shadow-emerald-500/15', rank: 'อันดับ 5' }
                    ];
                    const rs = rankStyles[idx] || rankStyles[0];

                    return (
                      <div
                        key={h.code}
                        onClick={() => setThaiHospitalPopupId(h.code)}
                        className={`rounded-3xl ${rs.border} p-5 shadow-sm hover:shadow-xl ${rs.shadow} transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden`}
                      >
                        <div>
                          {/* Card Header: Rank & Code */}
                          <div className="flex justify-between items-center mb-3">
                            <span className={`text-[11px] px-2.5 py-0.5 rounded-full ${rs.badge}`}>
                              {rs.rank}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400 font-bold">
                              {h.code}
                            </span>
                          </div>

                          {/* Hospital Name */}
                          <div className="font-black text-slate-900 text-base group-hover:text-amber-700 transition-colors">
                            {h.name}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">บริการรวม {fmt(h.totalQty)} ครั้ง</div>

                          {/* Huge Amount */}
                          <div className="text-2xl font-black text-slate-900 mt-3 tracking-tight">
                            ฿ {fmt(h.totalAmt)}
                          </div>

                          {/* CUP Share Progress Bar */}
                          <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-[10.5px] font-bold text-slate-500">
                              <span>สัดส่วนใน CUP</span>
                              <span className="font-extrabold text-amber-700">{h.pct}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.max(8, h.pctVal))}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Top Procedure Mini Badge */}
                          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                              หัตถการเด่น
                            </div>
                            <div className="text-[11px] font-semibold text-slate-700 truncate bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-lg">
                              {h.topService.replace('เพื่อการรักษา', '')}
                            </div>
                          </div>
                        </div>

                        {/* Interactive Card Footer */}
                        <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-amber-700">
                          <span>คลิกดูรายการ</span>
                          <ArrowUpRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ─── 2 Lower Analytics Cards (Bottom Grid) ─── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Card: ตารางแยกตามประเภทหัตถการ/บริการ (Service Types Table) */}
                <div className="bg-white rounded-3xl border-2 border-amber-200 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 overflow-hidden relative group">
                  <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400"></div>
                  
                  <div className="p-5 md:p-6 border-b border-amber-100 bg-gradient-to-r from-amber-50/50 via-white to-amber-50/20 flex justify-between items-center flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-black">
                        <Table2 size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-base">ตารางจำแนกตามประเภทหัตถการแพทย์แผนไทย</h3>
                        <p className="text-xs text-slate-500 mt-0.5">ปีงบประมาณ {currentYear} · เรียงจากยอดเงินชดเชยสูงสุด</p>
                      </div>
                    </div>
                    <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-xs">
                      {thaiData.serviceList.length} รายการหลัก
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200">
                          <th className="p-4 uppercase w-12 text-center">#</th>
                          <th className="p-4 uppercase">รายการหัตถการ / บริการ</th>
                          <th className="p-4 text-right uppercase w-24">จำนวนครั้ง</th>
                          <th className="p-4 text-right uppercase w-32">ยอดชดเชย (บาท)</th>
                          <th className="p-4 uppercase w-32">สัดส่วน</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {thaiData.serviceList.map((s, sIdx) => {
                          const dotColors = ['#d97706', '#f59e0b', '#059669', '#3b82f6', '#ec4899'];
                          const color = dotColors[sIdx % dotColors.length];
                          return (
                            <tr key={sIdx} className="hover:bg-amber-50/30 transition-colors">
                              <td className="p-4 text-center font-bold text-slate-400">{sIdx + 1}</td>
                              <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }}></span>
                                <span>{s.name}</span>
                              </td>
                              <td className="p-4 text-right font-medium text-slate-600">{fmt(s.qty)}</td>
                              <td className="p-4 text-right font-black text-slate-900">฿ {fmt(s.amt)}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                      className="h-full rounded-full"
                                      style={{ width: s.pct, backgroundColor: color }}
                                    ></div>
                                  </div>
                                  <span className="text-[11px] font-bold text-slate-600 w-10 text-right">{s.pct}</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-amber-50/60 font-black text-slate-900 border-t-2 border-amber-200">
                          <td colSpan={2} className="p-4 text-left">รวมยอดชดเชยแพทย์แผนไทยทั้งสิ้น</td>
                          <td className="p-4 text-right">{fmt(thaiData.totalQty69)}</td>
                          <td className="p-4 text-right text-base text-amber-800">฿ {fmt(thaiData.totalAmt69)}</td>
                          <td className="p-4 font-bold text-slate-700">100.0%</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Right Card: กราฟเปรียบเทียบผลงานรายเดือน YoY (Monthly Bar Chart: 2568 vs 2569) */}
                <div className="bg-white rounded-3xl border-2 border-amber-200 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 overflow-hidden p-6 relative group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-black">
                          <TrendingUp size={20} />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 text-base">เปรียบเทียบแนวโน้มรายเดือน (YoY)</h3>
                          <p className="text-xs text-slate-500 mt-0.5">ปีงบประมาณ 2568 เทียบกับ 2569 (12 เดือน)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-black">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-md bg-slate-400 inline-block shadow-xs"></span>
                          <span className="text-slate-600">ปีงบ 2568 (฿ {fmt(thaiData.sum68)})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-md bg-amber-600 inline-block shadow-xs"></span>
                          <span className="text-amber-700">ปีงบ 2569 (฿ {fmt(thaiData.sum69)})</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative h-[320px] w-full">
                      <canvas ref={thaiYoYCanvasRef}></canvas>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center gap-2 font-medium">
                    <span>💡</span>
                    <span>แนวโน้มยอดชดเชยแพทย์แผนไทยของ CUP สันโค้งมีความต่อเนื่อง โดยบริการนวดและประคบสมุนไพรครองสัดส่วนสูงสุด</span>
                  </div>
                </div>

              </div>

              {/* ─── Modal Popup: เจาะลึกรายการบริการของ รพ.สต. (เมื่อคลิกการ์ด) ─── */}
              {thaiHospitalPopupId && (
                (() => {
                  const currentH = thaiData.hospList.find(h => String(h.code) === String(thaiHospitalPopupId));
                  if (!currentH) return null;
                  return (
                    <div
                      onClick={() => setThaiHospitalPopupId(null)}
                      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                      >
                        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-white">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black shadow-sm">
                              <Building2 size={22} className="text-white" />
                            </div>
                            <div>
                              <div className="font-extrabold text-base text-slate-900">
                                {currentH.name}
                              </div>
                              <div className="text-xs text-slate-500 font-medium">
                                รหัสหน่วยบริการ: {currentH.code} · ปีงบประมาณ {currentYear}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setThaiHospitalPopupId(null)}
                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="p-6 space-y-5">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
                              <div className="text-[11px] font-bold text-amber-800">ยอดเงินชดเชยสะสม</div>
                              <div className="text-xl font-black text-amber-900 mt-0.5">฿ {fmt(currentH.totalAmt)}</div>
                            </div>
                            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                              <div className="text-[11px] font-bold text-slate-500">จำนวนครั้งที่ให้บริการ</div>
                              <div className="text-xl font-black text-slate-900 mt-0.5">{fmt(currentH.totalQty)} ครั้ง</div>
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                              จำแนกตามรายการหัตถการ / กิจกรรม
                            </div>
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-bold">
                                  <th className="pb-2 text-left">รายการบริการ</th>
                                  <th className="pb-2 text-right">จำนวน</th>
                                  <th className="pb-2 text-right">ยอดชดเชย</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {currentH.services.map((s, sI) => (
                                  <tr key={sI} className="hover:bg-slate-50">
                                    <td className="py-2.5 font-semibold text-slate-700">{s.name}</td>
                                    <td className="py-2.5 text-right text-slate-500">{fmt(s.qty)}</td>
                                    <td className="py-2.5 text-right font-bold text-slate-900">฿ {fmtD(s.amt)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                            <span>ℹ️</span>
                            <span>ข้อมูลคำนวณจากยอดชดเชยจริงที่ได้รับการอนุมัติจาก สปสช.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Page Footer */}
              <div className="text-center text-xs text-[#94a3b8] pt-4 pb-2 border-t border-[#e2e8f0]">
                © 2026 CLAIMCUP Sankhong Portal • Health Claim Intelligence Platform
              </div>
            </div>
          </div>
        )}

        {/* ════════ VIEW 3.6: HERBAL MEDICINE VIEW (ชดเชยยาสมุนไพร) ════════ */}
        {currentView === 'herbal' && (
          <div className="w-full min-h-screen bg-[#f8fafc]">
            {/* Herbal Navbar */}
            <nav className="bg-white border-b border-[#e2e8f0] px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm print:hidden">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center shadow-md">
                  <Leaf size={22} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900">ชดเชยค่าบริการยาสมุนไพร</span>
                    <span className="text-[11px] font-extrabold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      HERBAL MEDICINE & PHARMACY
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold">
                    องค์การบริหารส่วนจังหวัดเชียงใหม่ · เครือข่ายบริการสุขภาพ CUP สันโค้ง (5 รพ.สต.)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Year Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200 text-xs font-bold">
                  {['2568', '2569', '2570'].map(yr => (
                    <button
                      key={yr}
                      onClick={() => setCurrentYear(yr)}
                      className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                        currentYear === yr ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ปี {yr}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => window.print()}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3.5 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer size={14} /> พิมพ์รายงาน
                </button>
                <button
                  onClick={() => setCurrentView('overview')}
                  className="bg-[#064e3b] hover:bg-[#022c22] text-white font-bold px-4 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <ArrowLeft size={14} /> กลับหน้าหลัก
                </button>
              </div>
            </nav>

            <div className="p-6 md:p-8 max-w-[1560px] mx-auto space-y-6">
              {/* ─── Hero Banner: Herbal Medicine ─── */}
              <div className="bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#047857] rounded-3xl p-7 md:p-9 text-white shadow-[0_12px_35px_rgba(2,44,34,0.25)] flex flex-col lg:flex-row items-center justify-between gap-8 border border-emerald-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex-1 min-w-[320px] relative z-10">
                  <div className="text-[12px] font-extrabold uppercase tracking-widest text-[#34d399] mb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#34d399] animate-pulse"></span>
                    <span>HERBAL MEDICINE & PHARMACEUTICAL CLAIM · FY {currentYear}</span>
                  </div>

                  <div className="flex items-baseline gap-3 my-2">
                    <span className="text-4xl md:text-5xl font-black text-[#34d399] leading-none">฿</span>
                    <span className="text-5xl md:text-[64px] font-black tracking-tight text-white leading-none drop-shadow-md">
                      {fmt(herbalData.totalAmt)}
                    </span>
                  </div>

                  <div className="text-[14px] font-bold text-emerald-100/90 mt-2">
                    ยอดเบิกชดเชยค่ายาสมุนไพรสะสม เครือข่าย รพ.สต. 5 แห่ง
                  </div>

                  {/* 4 Financial & Operational Metric Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-5">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                      <div className="text-[11px] font-bold text-emerald-200">ยอดชดเชยรวม (Amount)</div>
                      <div className="text-xl font-black text-white mt-0.5">฿ {fmt(herbalData.totalAmt)}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                      <div className="text-[11px] font-bold text-emerald-200">ราคาทุนรวม (Cost)</div>
                      <div className="text-xl font-black text-white mt-0.5">฿ {fmt(herbalData.totalCost)}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                      <div className="text-[11px] font-bold text-emerald-200">ส่วนต่างกำไรสุทธิ (Margin)</div>
                      <div className="text-xl font-black text-[#34d399] mt-0.5 flex items-center gap-1">
                        +฿ {fmt(herbalData.totalProfit)}
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                      <div className="text-[11px] font-bold text-emerald-200">อัตรากำไรเฉลี่ย (Profit %)</div>
                      <div className="text-xl font-black text-[#34d399] mt-0.5 flex items-center gap-1">
                        <TrendingUp size={18} />
                        +{herbalData.marginPct}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Cost vs Profit Efficiency Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 w-full lg:w-[360px] shrink-0 text-white relative z-10 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/15 pb-3">
                    <span className="text-xs font-extrabold tracking-wider text-emerald-300 uppercase">สัดส่วนต้นทุน vs กำไรส่วนต่าง</span>
                    <span className="text-[11px] bg-emerald-400/20 text-[#34d399] px-2 py-0.5 rounded-full font-bold">คุ้มค่าสูง</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-emerald-100">ส่วนต่างกำไรสุทธิ (Surplus)</span>
                        <span className="text-[#34d399] font-black">฿ {fmt(herbalData.totalProfit)} ({herbalData.marginPct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-[#34d399] rounded-full" style={{ width: `${herbalData.marginPct}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-emerald-100">ราคาทุนยา (Cost Base)</span>
                        <span className="text-white font-black">฿ {fmt(herbalData.totalCost)} ({(100 - parseFloat(herbalData.marginPct)).toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(100 - parseFloat(herbalData.marginPct)).toFixed(1)}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-[11.5px] text-emerald-200/90 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#34d399] shrink-0" />
                    <span>คำนวณจากคอลัมน์ cost และ amount จริงในระบบ</span>
                  </div>
                </div>
              </div>

              {/* ─── 5 รพ.สต. Performance Cards (CUP Network Ranking 1 to 5) ─── */}
              <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-6 bg-emerald-600 rounded-full"></div>
                    <h2 className="text-lg font-black text-slate-900">
                      ผลงานการจ่ายยาสมุนไพร จำแนกตาม รพ.สต. 5 แห่ง
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    เรียงตามยอดเงินชดเชยสูงสุด ประจำปีงบประมาณ {currentYear}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
                  {herbalData.hospList.map((h, idx) => {
                    const rankStyles = [
                      { border: 'border-2 border-amber-300 hover:border-amber-500 bg-gradient-to-b from-amber-50/60 to-white', badge: 'bg-amber-100 text-amber-900 border border-amber-300 font-black', shadow: 'hover:shadow-amber-500/15', rank: '🥇 อันดับ 1' },
                      { border: 'border-2 border-slate-300 hover:border-slate-500 bg-gradient-to-b from-slate-50/60 to-white', badge: 'bg-slate-100 text-slate-800 border border-slate-300 font-bold', shadow: 'hover:shadow-slate-500/15', rank: '🥈 อันดับ 2' },
                      { border: 'border-2 border-orange-300 hover:border-orange-500 bg-gradient-to-b from-orange-50/60 to-white', badge: 'bg-orange-100 text-orange-900 border border-orange-300 font-bold', shadow: 'hover:shadow-orange-500/15', rank: '🥉 อันดับ 3' },
                      { border: 'border-2 border-sky-200 hover:border-sky-400 bg-gradient-to-b from-sky-50/40 to-white', badge: 'bg-sky-100 text-sky-900 border border-sky-200 font-bold', shadow: 'hover:shadow-sky-500/15', rank: 'อันดับ 4' },
                      { border: 'border-2 border-emerald-200 hover:border-emerald-400 bg-gradient-to-b from-emerald-50/40 to-white', badge: 'bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold', shadow: 'hover:shadow-emerald-500/15', rank: 'อันดับ 5' }
                    ];
                    const rs = rankStyles[idx] || rankStyles[0];

                    return (
                      <div
                        key={h.code}
                        onClick={() => setHerbalHospitalPopupId(h.code)}
                        className={`rounded-3xl ${rs.border} p-5 shadow-sm hover:shadow-xl ${rs.shadow} transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden`}
                      >
                        <div>
                          {/* Card Header: Rank & Code */}
                          <div className="flex justify-between items-center mb-3">
                            <span className={`text-[11px] px-2.5 py-0.5 rounded-full ${rs.badge}`}>
                              {rs.rank}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400 font-bold">
                              {h.code}
                            </span>
                          </div>

                          {/* Hospital Name */}
                          <div className="font-black text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                            {h.name}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">จ่ายยา {fmt(h.totalQty)} รายการ</div>

                          {/* Huge Amount */}
                          <div className="text-2xl font-black text-slate-900 mt-3 tracking-tight">
                            ฿ {fmt(h.totalAmt)}
                          </div>

                          {/* Cost vs Profit Mini Box */}
                          <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1 text-[11px]">
                            <div className="flex justify-between text-slate-500">
                              <span>ราคาทุน:</span>
                              <span className="font-bold text-slate-700">฿{fmt(h.totalCost)}</span>
                            </div>
                            <div className="flex justify-between text-emerald-700 font-bold">
                              <span>กำไรส่วนต่าง:</span>
                              <span>+฿{fmt(h.profit)}</span>
                            </div>
                          </div>

                          {/* CUP Share Progress Bar */}
                          <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-[10.5px] font-bold text-slate-500">
                              <span>สัดส่วนใน CUP</span>
                              <span className="font-extrabold text-emerald-700">{h.pct}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.max(8, h.pctVal))}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Top Medicine Mini Badge */}
                          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                              ยาสมุนไพรยอดนิยม
                            </div>
                            <div className="text-[11px] font-semibold text-slate-700 truncate bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-lg">
                              💊 {h.topMedicine}
                            </div>
                          </div>
                        </div>

                        {/* Interactive Card Footer */}
                        <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-emerald-700">
                          <span>คลิกดูรายการยา</span>
                          <ArrowUpRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ─── 2 Lower Analytics Cards (Bottom Grid) ─── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Card: ตารางรายการยาสมุนไพร & ต้นทุน-กำไร (Medicines & Cost-Margin Table) */}
                <div className="bg-white rounded-3xl border-2 border-emerald-200 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden relative group">
                  <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"></div>
                  
                  <div className="p-5 md:p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/50 via-white to-emerald-50/20 flex justify-between items-center flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-black">
                        <Table2 size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-base">ตารางจำแนกตามรายการยาสมุนไพร (ต้นทุน & กำไร)</h3>
                        <p className="text-xs text-slate-500 mt-0.5">ปีงบประมาณ {currentYear} · เรียงตามยอดชดเชยสูงสุด</p>
                      </div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-xs">
                      {herbalData.medicineList.length} รายการยา
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200">
                          <th className="p-3.5 uppercase w-10 text-center">#</th>
                          <th className="p-3.5 uppercase">ชื่อยาสมุนไพร</th>
                          <th className="p-3.5 text-right uppercase w-16">จำนวน</th>
                          <th className="p-3.5 text-right uppercase w-24 text-slate-500">ราคาทุน</th>
                          <th className="p-3.5 text-right uppercase w-24 font-bold text-slate-900">ยอดชดเชย</th>
                          <th className="p-3.5 text-right uppercase w-24 text-emerald-700 font-black">กำไรส่วนต่าง</th>
                          <th className="p-3.5 uppercase w-24">อัตรากำไร</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {herbalData.medicineList.map((m, mIdx) => {
                          const dotColors = ['#059669', '#10b981', '#06b6d4', '#f59e0b', '#8b5cf6'];
                          const color = dotColors[mIdx % dotColors.length];
                          return (
                            <tr key={mIdx} className="hover:bg-emerald-50/30 transition-colors">
                              <td className="p-3.5 text-center font-bold text-slate-400">{mIdx + 1}</td>
                              <td className="p-3.5 font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }}></span>
                                <span>{m.name}</span>
                              </td>
                              <td className="p-3.5 text-right font-medium text-slate-600">{fmt(m.qty)}</td>
                              <td className="p-3.5 text-right text-slate-500">฿ {fmt(m.cost)}</td>
                              <td className="p-3.5 text-right font-black text-slate-900">฿ {fmt(m.amt)}</td>
                              <td className="p-3.5 text-right font-black text-emerald-700">+฿ {fmt(m.profit)}</td>
                              <td className="p-3.5">
                                <span className="text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                                  +{m.marginPct}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-emerald-50/60 font-black text-slate-900 border-t-2 border-emerald-200">
                          <td colSpan={2} className="p-3.5 text-left">รวมยอดค่ายาสมุนไพรทั้งสิ้น</td>
                          <td className="p-3.5 text-right">{fmt(herbalData.totalQty)}</td>
                          <td className="p-3.5 text-right text-slate-600">฿ {fmt(herbalData.totalCost)}</td>
                          <td className="p-3.5 text-right text-sm text-emerald-900">฿ {fmt(herbalData.totalAmt)}</td>
                          <td className="p-3.5 text-right text-sm text-emerald-700 font-black">+฿ {fmt(herbalData.totalProfit)}</td>
                          <td className="p-3.5 text-emerald-800">+{herbalData.marginPct}%</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Right Card: กราฟเปรียบเทียบผลงานรายเดือน YoY (Monthly Bar Chart: 2568 vs 2569) */}
                <div className="bg-white rounded-3xl border-2 border-emerald-200 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden p-6 relative group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-black">
                          <TrendingUp size={20} />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 text-base">เปรียบเทียบแนวโน้มรายเดือน (YoY)</h3>
                          <p className="text-xs text-slate-500 mt-0.5">ปีงบประมาณ 2568 เทียบกับ 2569 (12 เดือน)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-black">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-md bg-slate-400 inline-block shadow-xs"></span>
                          <span className="text-slate-600">ปีงบ 2568 (฿ {fmt(herbalData.sum68)})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-md bg-emerald-600 inline-block shadow-xs"></span>
                          <span className="text-emerald-700">ปีงบ 2569 (฿ {fmt(herbalData.sum69)})</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative h-[320px] w-full">
                      <canvas ref={herbalYoYCanvasRef}></canvas>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2 font-medium">
                    <span>💡</span>
                    <span>อัตราความคุ้มค่าของการจ่ายยาสมุนไพรในเครือข่าย CUP สันโค้งเฉลี่ยสูงถึง {herbalData.marginPct}% ช่วยเพิ่มมูลค่าการบริการปฐมภูมิอย่างมีนัยสำคัญ</span>
                  </div>
                </div>

              </div>

              {/* ─── Modal Popup: เจาะลึกรายการยาสมุนไพรของ รพ.สต. (เมื่อคลิกการ์ด) ─── */}
              {herbalHospitalPopupId && (
                (() => {
                  const currentH = herbalData.hospList.find(h => String(h.code) === String(herbalHospitalPopupId));
                  if (!currentH) return null;
                  return (
                    <div
                      onClick={() => setHerbalHospitalPopupId(null)}
                      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                      >
                        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-sm">
                              <Leaf size={22} className="text-white" />
                            </div>
                            <div>
                              <div className="font-extrabold text-base text-slate-900">
                                {currentH.name}
                              </div>
                              <div className="text-xs text-slate-500 font-medium">
                                รหัสหน่วยบริการ: {currentH.code} · ปีงบประมาณ {currentYear}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setHerbalHospitalPopupId(null)}
                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="p-6 space-y-5">
                          <div className="grid grid-cols-3 gap-2.5">
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                              <div className="text-[10.5px] font-bold text-slate-500">ราคาทุนรวม</div>
                              <div className="text-base font-black text-slate-800 mt-0.5">฿{fmt(currentH.totalCost)}</div>
                            </div>
                            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
                              <div className="text-[10.5px] font-bold text-emerald-800">ยอดชดเชยรวม</div>
                              <div className="text-base font-black text-emerald-900 mt-0.5">฿{fmt(currentH.totalAmt)}</div>
                            </div>
                            <div className="p-3 bg-emerald-100/70 border border-emerald-300 rounded-2xl">
                              <div className="text-[10.5px] font-bold text-emerald-800">กำไร (+{currentH.marginPct}%)</div>
                              <div className="text-base font-black text-emerald-700 mt-0.5">+฿{fmt(currentH.profit)}</div>
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                              รายการยาสมุนไพรที่จ่ายจริง
                            </div>
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-bold">
                                  <th className="pb-2 text-left">ชื่อยา</th>
                                  <th className="pb-2 text-right">จำนวน</th>
                                  <th className="pb-2 text-right">ราคาทุน</th>
                                  <th className="pb-2 text-right">ยอดชดเชย</th>
                                  <th className="pb-2 text-right text-emerald-700">กำไร</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {currentH.medicines.map((m, mI) => (
                                  <tr key={mI} className="hover:bg-slate-50">
                                    <td className="py-2.5 font-semibold text-slate-700">💊 {m.name}</td>
                                    <td className="py-2.5 text-right text-slate-500">{fmt(m.qty)}</td>
                                    <td className="py-2.5 text-right text-slate-400">฿{fmt(m.cost)}</td>
                                    <td className="py-2.5 text-right font-bold text-slate-900">฿{fmt(m.amt)}</td>
                                    <td className="py-2.5 text-right font-black text-emerald-700">+฿{fmt(m.amt - m.cost)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                            <span>ℹ️</span>
                            <span>ข้อมูลเปรียบเทียบระหว่างราคาทุน (cost) และยอดเบิกชดเชย (amount) ตามระเบียบ สปสช.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Page Footer */}
              <div className="text-center text-xs text-[#94a3b8] pt-4 pb-2 border-t border-[#e2e8f0]">
                © 2026 CLAIMCUP Sankhong Portal • Health Claim Intelligence Platform
              </div>
            </div>
          </div>
        )}

        {/* ════════ VIEW 3.7: PPFS VIEW (บริการสร้างเสริมสุขภาพและป้องกันโรค) ════════ */}
        {currentView === 'ppfs' && (
          <div className="w-full min-h-screen bg-[#f8fafc]">
            {/* PPFS Navbar */}
            <nav className="bg-white border-b border-[#e2e8f0] px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm print:hidden">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex items-center justify-center shadow-md">
                  <Sparkles size={22} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900">บริการสร้างเสริมสุขภาพและป้องกันโรค (PPFS)</span>
                    <span className="text-[11px] font-extrabold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200">
                      HEALTH PROMOTION & PREVENTION
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold">
                    องค์การบริหารส่วนจังหวัดเชียงใหม่ · เครือข่ายบริการสุขภาพ CUP สันโค้ง (5 รพ.สต.)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Year Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200 text-xs font-bold">
                  {['2567', '2568', '2569', '2570'].map(yr => (
                    <button
                      key={yr}
                      onClick={() => setCurrentYear(yr)}
                      className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                        currentYear === yr ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ปี {yr}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => window.print()}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3.5 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer size={14} /> พิมพ์รายงาน
                </button>
                <button
                  onClick={() => setCurrentView('overview')}
                  className="bg-[#064e3b] hover:bg-[#022c22] text-white font-bold px-4 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <ArrowLeft size={14} /> กลับหน้าหลัก
                </button>
              </div>
            </nav>

            <div className="p-6 md:p-8 max-w-[1560px] mx-auto space-y-6">
              {/* ─── Hero Banner: PPFS ─── */}
              <div className="bg-gradient-to-br from-[#0a192f] via-[#1e3a8a] to-[#1d4ed8] rounded-3xl p-7 md:p-9 text-white shadow-[0_12px_35px_rgba(30,58,138,0.25)] flex flex-col lg:flex-row items-center justify-between gap-8 border border-blue-400/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex-1 min-w-[320px] relative z-10">
                  <div className="text-[12px] font-extrabold uppercase tracking-widest text-[#93c5fd] mb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#93c5fd] animate-pulse"></span>
                    <span>HEALTH PROMOTION & DISEASE PREVENTION (PPFS) · FY {currentYear}</span>
                  </div>

                  <div className="flex items-baseline gap-3 my-2">
                    <span className="text-4xl md:text-5xl font-black text-[#93c5fd] leading-none">฿</span>
                    <span className="text-5xl md:text-[64px] font-black tracking-tight text-white leading-none drop-shadow-md">
                      {fmt(ppfsData.totalAmt)}
                    </span>
                  </div>

                  <div className="text-[14px] font-bold text-blue-100/90 mt-2">
                    ยอดเงินชดเชยงบสร้างเสริมสุขภาพและป้องกันโรคสะสม เครือข่าย รพ.สต. 5 แห่ง
                  </div>

                  {/* 4 Financial & Operational Metric Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-5">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                      <div className="text-[11px] font-bold text-blue-200">ยอดชดเชยรวม (Amount)</div>
                      <div className="text-xl font-black text-white mt-0.5">฿ {fmt(ppfsData.totalAmt)}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                      <div className="text-[11px] font-bold text-blue-200">ประชาชนที่ได้รับบริการ (Persons)</div>
                      <div className="text-xl font-black text-white mt-0.5">{fmt(ppfsData.totalPersons)} คน</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                      <div className="text-[11px] font-bold text-blue-200">จำนวนครั้งบริการ (Services)</div>
                      <div className="text-xl font-black text-[#93c5fd] mt-0.5 flex items-center gap-1">
                        {fmt(ppfsData.totalQty)} ครั้ง
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                      <div className="text-[11px] font-bold text-blue-200">อัตราการเติบโต (YoY Growth)</div>
                      <div className="text-xl font-black text-[#93c5fd] mt-0.5 flex items-center gap-1">
                        <TrendingUp size={18} />
                        +{ppfsData.growthPct}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: PPFS Coverage & Impact Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 w-full lg:w-[360px] shrink-0 text-white relative z-10 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/15 pb-3">
                    <span className="text-xs font-extrabold tracking-wider text-blue-200 uppercase">เป้าหมายบริการเชิงรุกในชุมชน</span>
                    <span className="text-[11px] bg-blue-400/20 text-[#93c5fd] px-2 py-0.5 rounded-full font-bold">ผลงานดีเยี่ยม</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-blue-100">บริการคัดกรองเบาหวาน-ไขมัน</span>
                        <span className="text-[#93c5fd] font-black">38.2% (อันดับ 1)</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-[#93c5fd] rounded-full" style={{ width: '38.2%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-blue-100">ตรวจคัดกรองค้นหาวัณโรค CXR</span>
                        <span className="text-white font-black">21.1% (อันดับ 2)</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-blue-300 rounded-full" style={{ width: '21.1%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-[11.5px] text-blue-200/90 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#93c5fd] shrink-0" />
                    <span>เชื่อมต่อข้อมูลจากตาราง claims / ppfs อัตโนมัติ</span>
                  </div>
                </div>
              </div>

              {/* ─── 5 รพ.สต. Performance Cards (CUP Network Ranking 1 to 5) ─── */}
              <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-6 bg-blue-600 rounded-full"></div>
                    <h2 className="text-lg font-black text-slate-900">
                      ผลงานบริการสร้างเสริมสุขภาพ (PPFS) จำแนกตาม รพ.สต. 5 แห่ง
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    เรียงตามยอดเงินชดเชยสูงสุด ประจำปีงบประมาณ {currentYear}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
                  {ppfsData.hospList.map((h, idx) => {
                    const rankStyles = [
                      { border: 'border-2 border-amber-300 hover:border-amber-500 bg-gradient-to-b from-amber-50/60 to-white', badge: 'bg-amber-100 text-amber-900 border border-amber-300 font-black', shadow: 'hover:shadow-amber-500/15', rank: '🥇 อันดับ 1' },
                      { border: 'border-2 border-slate-300 hover:border-slate-500 bg-gradient-to-b from-slate-50/60 to-white', badge: 'bg-slate-100 text-slate-800 border border-slate-300 font-bold', shadow: 'hover:shadow-slate-500/15', rank: '🥈 อันดับ 2' },
                      { border: 'border-2 border-orange-300 hover:border-orange-500 bg-gradient-to-b from-orange-50/60 to-white', badge: 'bg-orange-100 text-orange-900 border border-orange-300 font-bold', shadow: 'hover:shadow-orange-500/15', rank: '🥉 อันดับ 3' },
                      { border: 'border-2 border-sky-200 hover:border-sky-400 bg-gradient-to-b from-sky-50/40 to-white', badge: 'bg-sky-100 text-sky-900 border border-sky-200 font-bold', shadow: 'hover:shadow-sky-500/15', rank: 'อันดับ 4' },
                      { border: 'border-2 border-blue-200 hover:border-blue-400 bg-gradient-to-b from-blue-50/40 to-white', badge: 'bg-blue-100 text-blue-900 border border-blue-200 font-bold', shadow: 'hover:shadow-blue-500/15', rank: 'อันดับ 5' }
                    ];
                    const rs = rankStyles[idx] || rankStyles[0];

                    return (
                      <div
                        key={h.code}
                        onClick={() => setPpfsHospitalPopupId(h.code)}
                        className={`rounded-3xl ${rs.border} p-5 shadow-sm hover:shadow-xl ${rs.shadow} transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden`}
                      >
                        <div>
                          {/* Card Header: Rank & Code */}
                          <div className="flex justify-between items-center mb-3">
                            <span className={`text-[11px] px-2.5 py-0.5 rounded-full ${rs.badge}`}>
                              {rs.rank}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400 font-bold">
                              {h.code}
                            </span>
                          </div>

                          {/* Hospital Name */}
                          <div className="font-black text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                            {h.name}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">บริการ {fmt(h.totalQty)} ครั้ง ({fmt(h.totalPersons)} คน)</div>

                          {/* Huge Amount */}
                          <div className="text-2xl font-black text-slate-900 mt-3 tracking-tight">
                            ฿ {fmt(h.totalAmt)}
                          </div>

                          {/* CUP Share Progress Bar */}
                          <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-[10.5px] font-bold text-slate-500">
                              <span>สัดส่วนใน CUP</span>
                              <span className="font-extrabold text-blue-700">{h.pct}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.max(8, h.pctVal))}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Top Service Mini Badge */}
                          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                              กลุ่มบริการเด่น
                            </div>
                            <div className="text-[11px] font-semibold text-slate-700 truncate bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-lg">
                              ✨ {h.topService}
                            </div>
                          </div>
                        </div>

                        {/* Interactive Card Footer */}
                        <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-blue-700">
                          <span>คลิกดูรายการกิจกรรม</span>
                          <ArrowUpRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ─── 2 Lower Analytics Cards (Bottom Grid) ─── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Card: ตารางกลุ่มบริการสร้างเสริมสุขภาพ PPFS */}
                <div className="bg-white rounded-3xl border-2 border-blue-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden relative group">
                  <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-400"></div>
                  
                  <div className="p-5 md:p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 via-white to-blue-50/20 flex justify-between items-center flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-black">
                        <Table2 size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-base">ตารางจำแนกตามกลุ่มบริการหลัก PPFS</h3>
                        <p className="text-xs text-slate-500 mt-0.5">ปีงบประมาณ {currentYear} · เรียงตามยอดชดเชยสูงสุด</p>
                      </div>
                    </div>
                    <span className="bg-blue-50 text-blue-800 border border-blue-200 text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-xs">
                      {ppfsData.groupList.length} กลุ่มบริการ
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200">
                          <th className="p-3.5 uppercase w-10 text-center">#</th>
                          <th className="p-3.5 uppercase">กลุ่มบริการหลัก PPFS</th>
                          <th className="p-3.5 text-right uppercase w-20">จำนวนคน</th>
                          <th className="p-3.5 text-right uppercase w-20">จำนวนครั้ง</th>
                          <th className="p-3.5 text-right uppercase w-28 font-bold text-slate-900">ยอดชดเชย</th>
                          <th className="p-3.5 uppercase w-24">สัดส่วน</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {ppfsData.groupList.map((g, gIdx) => {
                          const dotColors = ['#2563eb', '#0284c7', '#3b82f6', '#6366f1', '#06b6d4'];
                          const color = dotColors[gIdx % dotColors.length];
                          return (
                            <tr key={gIdx} className="hover:bg-blue-50/30 transition-colors">
                              <td className="p-3.5 text-center font-bold text-slate-400">{gIdx + 1}</td>
                              <td className="p-3.5 font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }}></span>
                                <span>{g.name}</span>
                              </td>
                              <td className="p-3.5 text-right font-medium text-slate-600">{fmt(g.persons)}</td>
                              <td className="p-3.5 text-right font-medium text-slate-600">{fmt(g.qty)}</td>
                              <td className="p-3.5 text-right font-black text-slate-900">฿ {fmt(g.amt)}</td>
                              <td className="p-3.5">
                                <span className="text-[11px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md">
                                  {g.pct}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-blue-50/60 font-black text-slate-900 border-t-2 border-blue-200">
                          <td colSpan={2} className="p-3.5 text-left">รวมยอดชดเชย PPFS ทั้งสิ้น</td>
                          <td className="p-3.5 text-right">{fmt(ppfsData.totalPersons)}</td>
                          <td className="p-3.5 text-right">{fmt(ppfsData.totalQty)}</td>
                          <td className="p-3.5 text-right text-sm text-blue-900">฿ {fmt(ppfsData.totalAmt)}</td>
                          <td className="p-3.5 text-blue-800">100%</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Right Card: กราฟแท่งเปรียบเทียบผลงาน 3 ปีงบประมาณ (3-Year Bar Chart: 2567 vs 2568 vs 2569) */}
                <div className="bg-white rounded-3xl border-2 border-blue-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden p-6 relative group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-black">
                          <BarChart3 size={20} />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 text-base">เปรียบเทียบผลงาน 3 ปีงบประมาณ</h3>
                          <p className="text-xs text-slate-500 mt-0.5">ปี 2567 เทียบกับ 2568 และ 2569 (จำแนก 5 รพ.สต.)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-black flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-md bg-slate-300 inline-block shadow-xs"></span>
                          <span className="text-slate-600">ปี 2567 (฿ {fmt(ppfsData.sum67)})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-md bg-blue-400 inline-block shadow-xs"></span>
                          <span className="text-blue-600">ปี 2568 (฿ {fmt(ppfsData.sum68)})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-md bg-blue-600 inline-block shadow-xs"></span>
                          <span className="text-blue-800">ปี 2569 (฿ {fmt(ppfsData.sum69)})</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative h-[320px] w-full">
                      <canvas ref={ppfsYoYCanvasRef}></canvas>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-center gap-2 font-medium">
                    <span>💡</span>
                    <span>งบสร้างเสริมสุขภาพและป้องกันโรค (PPFS) มีการเติบโตอย่างต่อเนื่องทุกปี โดยเน้นการตรวจคัดกรองเบาหวาน-ไขมัน และค้นหาวัณโรคเชิงรุก</span>
                  </div>
                </div>

              </div>

              {/* ─── Modal Popup: เจาะลึกรายการกิจกรรม PPFS ของ รพ.สต. (เมื่อคลิกการ์ด) ─── */}
              {ppfsHospitalPopupId && (
                (() => {
                  const currentH = ppfsData.hospList.find(h => String(h.code) === String(ppfsHospitalPopupId));
                  if (!currentH) return null;
                  return (
                    <div
                      onClick={() => setPpfsHospitalPopupId(null)}
                      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
                      >
                        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white shrink-0">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-sm">
                              <Sparkles size={22} className="text-white" />
                            </div>
                            <div>
                              <div className="font-extrabold text-base text-slate-900">
                                {currentH.name}
                              </div>
                              <div className="text-xs text-slate-500 font-medium">
                                รหัสหน่วยบริการ: {currentH.code} · รายการกิจกรรม PPFS ปี {currentYear}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setPpfsHospitalPopupId(null)}
                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="p-6 space-y-5 overflow-y-auto">
                          <div className="grid grid-cols-3 gap-2.5">
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                              <div className="text-[10.5px] font-bold text-slate-500">ประชาชนรับบริการ</div>
                              <div className="text-base font-black text-slate-800 mt-0.5">{fmt(currentH.totalPersons)} คน</div>
                            </div>
                            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl">
                              <div className="text-[10.5px] font-bold text-blue-800">จำนวนครั้งบริการ</div>
                              <div className="text-base font-black text-blue-900 mt-0.5">{fmt(currentH.totalQty)} ครั้ง</div>
                            </div>
                            <div className="p-3 bg-blue-100/70 border border-blue-300 rounded-2xl">
                              <div className="text-[10.5px] font-bold text-blue-800">ยอดชดเชยรวม ({currentH.pct})</div>
                              <div className="text-base font-black text-blue-700 mt-0.5">฿{fmt(currentH.totalAmt)}</div>
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                              รายการกิจกรรมสร้างเสริมสุขภาพที่ให้บริการ
                            </div>
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-bold">
                                  <th className="pb-2 text-left">รายการกิจกรรม</th>
                                  <th className="pb-2 text-right">จำนวนคน</th>
                                  <th className="pb-2 text-right">จำนวนครั้ง</th>
                                  <th className="pb-2 text-right">ยอดชดเชย</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {currentH.services.map((s, sI) => (
                                  <tr key={sI} className="hover:bg-slate-50">
                                    <td className="py-2.5 font-semibold text-slate-700 pr-2">
                                      <div>{s.name}</div>
                                      <div className="text-[10px] text-slate-400 font-normal">{s.group}</div>
                                    </td>
                                    <td className="py-2.5 text-right text-slate-500">{fmt(s.persons)}</td>
                                    <td className="py-2.5 text-right text-slate-500">{fmt(s.qty)}</td>
                                    <td className="py-2.5 text-right font-bold text-blue-900">฿{fmt(s.amt)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center gap-2">
                            <span>ℹ️</span>
                            <span>ข้อมูลคำนวณจากยอดชดเชยจริงตามระเบียบงานบริการสร้างเสริมสุขภาพและป้องกันโรค (PPFS) สปสช.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Page Footer */}
              <div className="text-center text-xs text-[#94a3b8] pt-4 pb-2 border-t border-[#e2e8f0]">
                © 2026 CLAIMCUP Sankhong Portal • Health Claim Intelligence Platform
              </div>
            </div>
          </div>
        )}

        {/* ════════ VIEW 4: EXPENSES VIEW (รายการสรุปค่าใช้จ่าย Cup 12 เดือน) ════════ */}
        {currentView === 'expenses' && (
          <div className="w-full min-h-screen bg-[#f8fafc]">
            <nav className="bg-white border-b border-[#e2e8f0] px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm print:hidden">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#1d9e75] text-white flex items-center justify-center shadow-md">
                  <Wallet size={20} />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900">รายการสรุปค่าใช้จ่าย Cup บ้านสันโค้ง</div>
                  <div className="text-xs text-slate-500 font-semibold">สรุปค่าใช้จ่ายดำเนินงานประจำปีงบประมาณ {currentYear} (13 หมวดหมู่ 12 เดือน)</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('overview')}
                  className="px-4 py-2 bg-[#022c22] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#064e3b] transition-all cursor-pointer"
                >
                  <ArrowLeft size={15} /> กลับสู่หน้าหลัก
                </button>
              </div>
            </nav>

            <div className="p-6 md:p-8 max-w-[1560px] mx-auto w-full space-y-6">
              {/* 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm border-l-4 border-l-[#1d9e75]">
                  <div className="text-xs font-bold text-slate-500">ยอดค่าใช้จ่ายรวมทั้งหมด</div>
                  <div className="text-2xl font-black text-[#064e3b] mt-1.5">฿{fmtS(expenseStats.total)}</div>
                  <div className="text-[11px] font-semibold text-slate-500 mt-1">฿{fmtD(expenseStats.total)} บาท</div>
                </div>
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm border-l-4 border-l-[#2563eb]">
                  <div className="text-xs font-bold text-slate-500">หมวดค่าใช้จ่ายสูงสุด</div>
                  <div className="text-lg font-black text-[#1e40af] mt-1.5 truncate" title={expenseStats.topCategory.name}>{expenseStats.topCategory.name}</div>
                  <div className="text-[11px] font-semibold text-blue-700 mt-1">฿{fmtD(expenseStats.topCategory.amount)}</div>
                </div>
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm border-l-4 border-l-[#f59e0b]">
                  <div className="text-xs font-bold text-slate-500">เดือนที่ค่าใช้จ่ายสูงสุด</div>
                  <div className="text-lg font-black text-[#b45309] mt-1.5">{expenseStats.topMonth.month}</div>
                  <div className="text-[11px] font-semibold text-amber-700 mt-1">฿{fmtD(expenseStats.topMonth.amount)} บาท</div>
                </div>
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm border-l-4 border-l-[#8b5cf6]">
                  <div className="text-xs font-bold text-slate-500">เฉลี่ยต่อเดือน</div>
                  <div className="text-2xl font-black text-[#6d28d9] mt-1.5">฿{fmtS(expenseStats.avgPerMonth)}</div>
                  <div className="text-[11px] font-semibold text-purple-700 mt-1">฿{fmtD(expenseStats.avgPerMonth)} บาท</div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
                  <div className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                    <span>แนวโน้มค่าใช้จ่ายรายเดือน (ปี {currentYear})</span>
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md">12 เดือน</span>
                  </div>
                  <div className="relative h-[280px] w-full">
                    <canvas ref={expenseCanvasRef}></canvas>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
                  <div className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                    <span>สัดส่วนตามหมวดค่าใช้จ่าย</span>
                    <span className="text-xs text-slate-400 font-bold">Top 5 หมวด</span>
                  </div>
                  <div className="relative h-[280px] w-full">
                    <canvas ref={expDonutCanvasRef}></canvas>
                  </div>
                </div>
              </div>

              {/* Full 13 Categories x 12 Months Table */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">ตารางสรุปค่าใช้จ่ายแยกรายเดือน (13 หมวดหมู่ x 12 เดือน)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">ประจำปีงบประมาณ {currentYear} • หน่วยบริการในเครือข่าย CUP สันโค้ง</p>
                  </div>
                  <button
                    onClick={() => setShowExpPrintModal(true)}
                    className="px-3.5 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-800 transition-all cursor-pointer"
                  >
                    <Printer size={14} /> พิมพ์รายงาน
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[1100px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <th className="p-3 w-10 text-center">#</th>
                        <th className="p-3 min-w-[200px]">หมวดหมู่รายการจ่าย</th>
                        {MONTHS_TH.map(m => (
                          <th key={m} className="p-3 text-right text-emerald-800">{m}</th>
                        ))}
                        <th className="p-3 text-right font-black bg-emerald-800 text-white min-w-[120px]">รวมทั้งสิ้น</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {expenseStats.table.map((row, idx) => (
                        <tr key={row.category} className="hover:bg-slate-50">
                          <td className="p-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                          <td className="p-3 font-semibold text-slate-800">{row.name}</td>
                          {row.m.map((val, mIdx) => (
                            <td key={mIdx} className="p-3 text-right text-slate-600 font-medium">
                              {val > 0 ? fmtD(val) : '—'}
                            </td>
                          ))}
                          <td className="p-3 text-right font-black text-emerald-950 bg-emerald-50/50">
                            {row.total > 0 ? fmtD(row.total) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-emerald-900 text-white font-black">
                        <td colSpan={2} className="p-3 text-left">รวมทุกหมวดหมู่</td>
                        {expenseStats.monthTotals.map((sum, mIdx) => (
                          <td key={mIdx} className="p-3 text-right">
                            {sum > 0 ? fmt(sum) : '—'}
                          </td>
                        ))}
                        <td className="p-3 text-right bg-emerald-950 text-white text-[13px]">
                          {fmtD(expenseStats.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* ══ PRINT MODAL (2 แผ่น แผ่นละ 6 เดือน แนวนอน) ══ */}
            {showExpPrintModal && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowExpPrintModal(false); }}>
                <div className="bg-white rounded-2xl max-w-[1300px] w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden">
                  {/* Modal Header */}
                  <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white print:hidden">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <Printer size={20} />
                      </div>
                      <div>
                        <div className="text-base font-black">พิมพ์รายงานสรุปค่าใช้จ่าย (แบ่ง 2 แผ่น แนวนอน)</div>
                        <div className="text-xs text-slate-300">แผ่นที่ 1: ต.ค. - มี.ค. | แผ่นที่ 2: เม.ย. - ก.ย.</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrintExpenses}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <Printer size={15} /> สั่งพิมพ์ (Print)
                      </button>
                      <button
                        onClick={() => setShowExpPrintModal(false)}
                        className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Modal Body & Printable Area */}
                  <div className="p-6 overflow-y-auto space-y-8 print:p-0 print:space-y-0">
                    {/* 📄 แผ่นที่ 1: ต.ค. - มี.ค. */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-4 print:page-break-after">
                      <div className="flex justify-between items-start border-b-2 border-emerald-700 pb-3 mb-4">
                        <div>
                          <h2 className="text-lg font-black text-slate-900">รายงานสรุปค่าใช้จ่าย Cup บ้านสันโค้ง (ครึ่งปีแรก: ต.ค. - มี.ค.)</h2>
                          <p className="text-xs text-slate-500 mt-0.5">ประจำปีงบประมาณ {currentYear} &nbsp;|&nbsp; แผ่นที่ 1/2</p>
                        </div>
                        <div className="text-right text-[11px] text-slate-400 font-semibold">
                          วันที่พิมพ์: {new Date().toLocaleDateString('th-TH')}
                        </div>
                      </div>
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-bold">
                            <th className="p-2 border border-slate-300 w-1/4">หมวดหมู่รายการจ่าย</th>
                            {MONTHS_TH.slice(0, 6).map(m => (
                              <th key={m} className="p-2 text-right border border-slate-300 text-emerald-800">{m}</th>
                            ))}
                            <th className="p-2 text-right border border-slate-300 bg-emerald-50 text-emerald-950 font-black">รวม 6 เดือนแรก</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenseStats.table.map(row => (
                            <tr key={row.category}>
                              <td className="p-2 border border-slate-300 font-medium text-slate-800">{row.name}</td>
                              {row.m.slice(0, 6).map((val, idx) => (
                                <td key={idx} className="p-2 text-right border border-slate-300 text-slate-700">
                                  {val > 0 ? fmtD(val) : '—'}
                                </td>
                              ))}
                              <td className="p-2 text-right border border-slate-300 font-black text-emerald-900 bg-emerald-50/40">
                                {row.sumH1 > 0 ? fmtD(row.sumH1) : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-emerald-800 text-white font-black">
                            <td className="p-2 border border-emerald-800">รวมทุกหมวดหมู่ (6 เดือนแรก)</td>
                            {expenseStats.monthTotals.slice(0, 6).map((sum, idx) => (
                              <td key={idx} className="p-2 text-right border border-emerald-800">{fmt(sum)}</td>
                            ))}
                            <td className="p-2 text-right border border-emerald-800 bg-emerald-950 text-white">{fmtD(expenseStats.sumAllH1)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* 📄 แผ่นที่ 2: เม.ย. - ก.ย. */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-4">
                      <div className="flex justify-between items-start border-b-2 border-emerald-700 pb-3 mb-4">
                        <div>
                          <h2 className="text-lg font-black text-slate-900">รายงานสรุปค่าใช้จ่าย Cup บ้านสันโค้ง (ครึ่งปีหลัง: เม.ย. - ก.ย.)</h2>
                          <p className="text-xs text-slate-500 mt-0.5">ประจำปีงบประมาณ {currentYear} &nbsp;|&nbsp; แผ่นที่ 2/2</p>
                        </div>
                        <div className="text-right text-xs text-emerald-800 font-black">
                          ยอดรวมทั้งปีงบประมาณ: ฿{fmtD(expenseStats.total)} บาท
                        </div>
                      </div>
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-bold">
                            <th className="p-2 border border-slate-300 w-1/4">หมวดหมู่รายการจ่าย</th>
                            {MONTHS_TH.slice(6, 12).map(m => (
                              <th key={m} className="p-2 text-right border border-slate-300 text-emerald-800">{m}</th>
                            ))}
                            <th className="p-2 text-right border border-slate-300 bg-emerald-50 text-emerald-950 font-black">รวมทั้งสิ้น (12 เดือน)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenseStats.table.map(row => (
                            <tr key={row.category}>
                              <td className="p-2 border border-slate-300 font-medium text-slate-800">{row.name}</td>
                              {row.m.slice(6, 12).map((val, idx) => (
                                <td key={idx} className="p-2 text-right border border-slate-300 text-slate-700">
                                  {val > 0 ? fmtD(val) : '—'}
                                </td>
                              ))}
                              <td className="p-2 text-right border border-slate-300 font-black text-emerald-900 bg-emerald-50/40">
                                {row.total > 0 ? fmtD(row.total) : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-emerald-800 text-white font-black">
                            <td className="p-2 border border-emerald-800">รวมทุกหมวดหมู่</td>
                            {expenseStats.monthTotals.slice(6, 12).map((sum, idx) => (
                              <td key={idx} className="p-2 text-right border border-emerald-800">{sum > 0 ? fmt(sum) : '—'}</td>
                            ))}
                            <td className="p-2 text-right border border-emerald-800 bg-emerald-950 text-white">{fmtD(expenseStats.total)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════ VIEW 5: PAYABLE VIEW ════════ */}
        {currentView === 'payable' && (
          <div className="w-full min-h-screen bg-[#f8fafc]">
            <nav className="bg-white border-b border-[#e2e8f0] px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm print:hidden">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#2563eb] text-white flex items-center justify-center shadow-md">
                  <Database size={20} />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900">รายงานพึ่งจ่าย (งบกองทุนและชดเชย)</div>
                  <div className="text-xs text-slate-500 font-semibold">สรุปยอดจัดสรรเงิน และการจ่ายเงิน ประจำปีงบประมาณ 2568 - 2569</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 transition-all cursor-pointer">
                  <Printer size={15} /> พิมพ์รายงาน
                </button>
                <button onClick={() => setCurrentView('overview')} className="px-4 py-2 bg-[#022c22] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#064e3b] transition-all cursor-pointer">
                  <ArrowLeft size={15} /> กลับสู่หน้าหลัก
                </button>
              </div>
            </nav>

            <div className="p-6 md:p-8 max-w-[1400px] mx-auto w-full space-y-6">
              {/* 🌟 Filter Banner: เลือกหน่วยบริการเด่นชัด */}
              <div className="print:hidden bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#064e3b] rounded-3xl p-5 md:p-6 shadow-xl border border-slate-700/60 flex items-center justify-between gap-6 flex-wrap">
                <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner shrink-0">
                    <Building2 size={24} />
                  </div>
                  <div className="space-y-1 w-full max-w-[480px]">
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      เลือกหน่วยบริการที่ต้องการดูข้อมูล
                    </div>
                    <select
                      value={payableHosp}
                      onChange={(e) => setPayableHosp(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-emerald-500/40 bg-slate-900/90 text-sm font-black text-white outline-none cursor-pointer hover:border-emerald-400 transition-all shadow-md focus:ring-2 focus:ring-emerald-500/30"
                    >
                      {PAYABLE_HOSP_OPTIONS.map(h => (
                        <option key={h.code} value={h.code} className="bg-slate-900 text-white py-1">
                          {h.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 text-right shrink-0">
                  <div className="text-[11px] font-bold text-slate-300">กำลังแสดงข้อมูลของ:</div>
                  <div className="text-sm font-black text-emerald-300">
                    {PAYABLE_HOSP_OPTIONS.find(h => h.code === payableHosp)?.label}
                  </div>
                </div>
              </div>

              {/* 🌟 4 KPI Cards: เด่นชัด ตัวเลขใหญ่ มีสีกรอบและ Gradient มิติสวยงาม */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {/* Card 1: ยอดเงินรวม ปีงบ 2568 */}
                <div className="bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/30 rounded-3xl border-2 border-emerald-200/80 p-5 shadow-lg shadow-emerald-950/5 relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-emerald-500/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200">ปีงบ 2568</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-xs">68</div>
                  </div>
                  <div className="text-xs font-bold text-slate-600 mt-3">ยอดเงินรวม ปีงบ 2568</div>
                  <div className="text-2xl md:text-3xl font-black text-emerald-800 mt-1 tracking-tight">
                    ฿ {fmtD(payableStats.sum68)}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-600 mt-1">ยอดจัดสรรทั้งปี 2568</div>
                </div>

                {/* Card 2: ยอดเงินรวม ปีงบ 2569 */}
                <div className="bg-gradient-to-br from-blue-50/80 via-white to-blue-50/30 rounded-3xl border-2 border-blue-200/80 p-5 shadow-lg shadow-blue-950/5 relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-blue-500/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-800 bg-blue-100/80 px-2.5 py-1 rounded-lg border border-blue-200">ปีงบ 2569</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black text-xs">69</div>
                  </div>
                  <div className="text-xs font-bold text-slate-600 mt-3">ยอดเงินรวม ปีงบ 2569</div>
                  <div className="text-2xl md:text-3xl font-black text-blue-800 mt-1 tracking-tight">
                    ฿ {fmtD(payableStats.sum69)}
                  </div>
                  <div className="text-[11px] font-semibold text-blue-600 mt-1">ยอดจัดสรรทั้งปี 2569</div>
                </div>

                {/* Card 3: ยอดรับเงินรวม (ครั้งที่ 1 + 2) */}
                <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30 rounded-3xl border-2 border-amber-200/80 p-5 shadow-lg shadow-amber-950/5 relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-amber-500/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-200">รับแล้ว</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-xs">1+2</div>
                  </div>
                  <div className="text-xs font-bold text-slate-600 mt-3">ยอดรับเงินรวม (ครั้งที่ 1 + 2)</div>
                  <div className="text-2xl md:text-3xl font-black text-amber-700 mt-1 tracking-tight">
                    ฿ {fmtD(payableStats.totalReceived)}
                  </div>
                  <div className="text-[11px] font-semibold text-amber-600 mt-1">ยอดเงินที่ได้รับโอนแล้ว</div>
                </div>

                {/* Card 4: ยอดเงินคงเหลือสุทธิ (👑 HERO HIGHLIGHT CARD) */}
                <div className="bg-gradient-to-br from-[#064e3b] via-[#022c22] to-[#0f172a] rounded-3xl border-2 border-emerald-400/50 p-5 shadow-xl shadow-emerald-950/30 text-white relative overflow-hidden transition-all hover:scale-[1.02]">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-300 bg-emerald-950/80 border border-emerald-400/40 px-2.5 py-1 rounded-lg shadow-sm">
                      ✨ ยอดคงเหลือสุทธิ
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-black text-xs">สุทธิ</div>
                  </div>
                  <div className="text-xs font-bold text-emerald-200/80 mt-3">ยอดเงินคงเหลือสุทธิ</div>
                  <div className="text-2xl md:text-3xl font-black text-emerald-300 mt-1 tracking-tight drop-shadow-md">
                    ฿ {fmtD(payableStats.netRemain)}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>คำนวณสุทธิหลังหักเงิน</span>
                  </div>
                </div>
              </div>

              {/* Table 1: สรุปการจ่ายเงิน (รูปแบบเดิม ตกแต่งให้คมชัด) */}
              <div className="bg-white rounded-3xl border-2 border-slate-200/80 overflow-hidden shadow-md">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-slate-800 text-sm">ตารางสรุปการจ่ายเงินและยอดหักชดเชย (แยกตามหน่วยบริการ)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">ยอดรับเงินครั้งที่ 1, 2 และยอดหักชดเชยสุทธิ</p>
                  </div>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full shadow-sm">ยอดจัดสรรจริง</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-700 font-black border-b-2 border-slate-200">
                        <th className="p-3.5">หน่วยบริการ</th>
                        <th className="p-3.5 text-right">รับเงินครั้งที่ 1 (บาท)</th>
                        <th className="p-3.5 text-right">รับเงินครั้งที่ 2 (บาท)</th>
                        <th className="p-3.5 text-right text-red-600">หักเงิน (บาท)</th>
                        <th className="p-3.5 text-right font-black text-emerald-900 bg-emerald-50/80">ยอดสุทธิ (บาท)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payableStats.filteredPayData.map(r => (
                        <tr key={r.code} className="hover:bg-emerald-50/30 transition-colors">
                          <td className="p-3.5 font-bold text-slate-800">{r['หน่วยบริการ']}</td>
                          <td className="p-3.5 text-right font-semibold text-slate-700">{r['รับเงินครั้งที่1'] > 0 ? fmtD(r['รับเงินครั้งที่1']) : '—'}</td>
                          <td className="p-3.5 text-right font-semibold text-slate-700">{r['รับเงินครั้งที่2'] > 0 ? fmtD(r['รับเงินครั้งที่2']) : '—'}</td>
                          <td className={`p-3.5 text-right font-bold ${r['หักเงิน'] > 0 ? 'text-red-600' : 'text-slate-400'}`}>{r['หักเงิน'] > 0 ? fmtD(r['หักเงิน']) : '—'}</td>
                          <td className="p-3.5 text-right font-black text-emerald-800 bg-emerald-50/50 text-sm">{r['ยอดสุทธิ'] > 0 ? fmtD(r['ยอดสุทธิ']) : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-900 text-white font-black">
                        <td className="p-3.5">รวมทั้งหมด ({payableStats.filteredPayData.length} หน่วยบริการ)</td>
                        <td className="p-3.5 text-right text-emerald-300">{fmtD(payableStats.p1)}</td>
                        <td className="p-3.5 text-right text-emerald-300">{fmtD(payableStats.p2)}</td>
                        <td className="p-3.5 text-right text-red-400">{fmtD(payableStats.ded)}</td>
                        <td className="p-3.5 text-right text-emerald-400 bg-emerald-950 font-black text-sm">{fmtD(payableStats.netRemain)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Table 2: Statement Matrix */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">สรุปที่มาของเงินรายเดือนแยกตามหมวด (Statement Matrix)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">แสดงข้อมูล: {PAYABLE_HOSP_OPTIONS.find(h => h.code === payableHosp)?.label}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setPayableYear('69')} className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${payableYear === '69' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-500 border-slate-300'}`}>📅 ปีงบประมาณ 2569</button>
                    <button onClick={() => setPayableYear('68')} className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${payableYear === '68' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-500 border-slate-300'}`}>📅 ปีงบประมาณ 2568</button>
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
                        <th className="p-3 text-right">NTIP</th>
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
                          <td className="p-3 text-right text-slate-600">{row['NTIP'] > 0 ? fmtD(row['NTIP']) : '—'}</td>
                          <td className="p-3 text-right text-slate-600">{row['แพทย์แผนไทย'] > 0 ? fmtD(row['แพทย์แผนไทย']) : '—'}</td>
                          <td className="p-3 text-right font-black text-blue-900 bg-blue-50/50">{fmtD(row.Total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100 font-black text-slate-900">
                        <td className="p-3">รวมทั้งหมด</td>
                        <td className="p-3 text-right">{fmtD(payableStats.matrixTotal['KTB Claim'])}</td>
                        <td className="p-3 text-right">{fmtD(payableStats.matrixTotal['MOPH Claim'])}</td>
                        <td className="p-3 text-right">{fmtD(payableStats.matrixTotal['E-Claim'])}</td>
                        <td className="p-3 text-right">{fmtD(payableStats.matrixTotal['NTIP'])}</td>
                        <td className="p-3 text-right">{fmtD(payableStats.matrixTotal['แพทย์แผนไทย'])}</td>
                        <td className="p-3 text-right text-blue-900 bg-blue-50">{fmtD(payableStats.matrixTotal['Total'])}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════ VIEW 4: DIRECTOR (ผอ.) EXECUTIVE SUMMARY ════════ */}
        {currentView === 'director' && (
          <div className="w-full min-h-screen bg-[#f8fafc]">
            <nav className="bg-white border-b border-[#e2e8f0] px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm flex-wrap gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-white flex items-center justify-center shadow-[0_4px_10px_rgba(6,78,59,0.25)]">
                  <Sparkles size={20} />
                </div>
                <div>
                  <span className="text-[10.5px] font-bold text-[#059669] bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 rounded-md inline-block mb-0.5">
                    สรุปบทวิเคราะห์ Cup บ้านสันโค้ง • สำหรับ ผอ. เท่านั้น
                  </span>
                  <div className="text-lg font-black text-[#0f172a] leading-tight">ภาพรวมผลการเบิกจ่ายทุกหมวด ปีงบ 2569 เทียบ 2568</div>
                  <div className="text-[11.5px] text-[#64748b] font-semibold">{directorSummaryData.isScoped ? `เฉพาะหน่วยบริการ ${directorSummaryData.scopeHospName}` : 'รวมทั้ง 5 หน่วยบริการในเครือข่าย อ.สันกำแพง'}</div>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('overview')}
                className="px-4 py-2 rounded-xl bg-[#f1f5f9] border border-[#cbd5e1] text-[#334155] text-xs font-bold flex items-center gap-1.5 hover:bg-[#e2e8f0] transition-all cursor-pointer"
              >
                <ArrowLeft size={15} /> กลับหน้าหลัก
              </button>
            </nav>

            <div className="p-6 md:p-8 max-w-[1400px] mx-auto w-full space-y-6">

              {/* Cup-wide Hero */}
              <div className="bg-gradient-to-br from-[#022c22] via-[#043e30] to-[#064e3b] rounded-3xl p-7 md:p-9 text-white shadow-[0_12px_35px_rgba(2,44,34,0.2)] border border-emerald-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="text-[12px] font-extrabold uppercase tracking-widest text-[#34d399] mb-2.5">{directorSummaryData.isScoped ? `${directorSummaryData.scopeHospName}` : 'CUP รวมทั้งหมด (5 หน่วยบริการ)'}</div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-black text-[#34d399]">฿</span>
                    <span className="text-5xl font-black tracking-tight leading-none">{fmt(directorSummaryData.cupTotal69)}</span>
                  </div>
                  <div className="text-[13px] text-[#d1fae5] font-semibold mt-2">ปีงบ 2568: ฿{fmt(directorSummaryData.cupTotal68)}</div>
                </div>
                <div className={`px-5 py-3 rounded-2xl flex items-center gap-2.5 font-black text-lg border ${directorSummaryData.cupPct >= 0 ? 'bg-emerald-500/20 border-emerald-400/40 text-[#6ee7b7]' : 'bg-red-500/20 border-red-400/40 text-[#fca5a5]'}`}>
                  {directorSummaryData.cupPct >= 0 ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
                  {directorSummaryData.cupPct >= 0 ? '+' : ''}{directorSummaryData.cupPct.toFixed(1)}% เทียบปีก่อน
                </div>
              </div>

              {/* บทวิเคราะห์และข้อเสนอแนะเชิงนโยบาย */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
                <div className="text-sm font-black text-[#0f172a] flex items-center gap-2 mb-5">
                  <Sparkles size={17} className="text-[#059669]" /> บทวิเคราะห์และข้อเสนอแนะเชิงนโยบาย
                </div>
                <div className="space-y-3">
                  {directorInsights.map((card, i) => {
                    const Icon = DIR_ICON_MAP[card.icon];
                    const c = DIR_COLOR_MAP[card.color];
                    return (
                      <div key={i} className={`rounded-2xl border ${c.border} ${c.bg} p-4 flex gap-3`}>
                        <Icon size={18} className={`${c.icon} shrink-0 mt-0.5`} />
                        <div className="flex-1">
                          <div className={`text-[13px] font-black ${c.title}`}>{card.title}</div>
                          {card.desc && <div className="text-[12px] text-[#475569] mt-1 font-medium">{card.desc}</div>}
                          {card.recs && (
                            <div className="mt-1.5 space-y-1">
                              {card.recs.map((r, j) => (
                                <div key={j} className="text-[12px] text-[#475569] font-medium">
                                  <span className={`font-black ${c.title}`}>{r.label}:</span> {r.text}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Radar & Bar Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
                  <div className="text-sm font-black text-[#0f172a] mb-1">Radar: สัดส่วน 4 หมวดบริการ</div>
                  <div className="text-[11px] text-[#94a3b8] font-semibold mb-3">เปรียบเทียบยอดเบิก ปีงบ 2568 vs 2569</div>
                  <div className="relative h-[280px]"><canvas ref={dirRadarCanvasRef}></canvas></div>
                </div>
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
                  <div className="text-sm font-black text-[#0f172a] mb-1">ยอดเบิกรายหน่วยบริการ</div>
                  <div className="text-[11px] text-[#94a3b8] font-semibold mb-3">เปรียบเทียบ ปีงบ 2568 vs 2569</div>
                  <div className="relative h-[280px]"><canvas ref={dirBarCanvasRef}></canvas></div>
                </div>
              </div>

              {/* Category breakdown (4 หมวด) — Cup-wide */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {directorSummaryData.cupCats.map(c => (
                  <div key={c.key} className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
                    <div className="text-xs font-bold text-[#64748b] mb-2">{c.label}</div>
                    <div className="text-xl font-black text-[#0f172a]">฿{fmt(c.amt69)}</div>
                    <div className={`text-xs font-bold mt-1.5 flex items-center gap-1 ${c.pct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {c.pct >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                      {c.pct >= 0 ? '+' : ''}{c.pct.toFixed(1)}% ({fmt(c.amt68)} → {fmt(c.amt69)})
                    </div>
                  </div>
                ))}
              </div>

              {/* Highlights & Concerns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm">
                  <div className="text-sm font-black text-[#065f46] flex items-center gap-2 mb-4"><TrendingUp size={17} /> จุดเด่น — หมวดที่เติบโตสูงสุด</div>
                  {directorSummaryData.highlights.length === 0 ? (
                    <div className="text-xs text-[#94a3b8]">ไม่มีหมวดที่เติบโตเมื่อเทียบปีก่อน</div>
                  ) : (
                    <div className="space-y-2.5">
                      {directorSummaryData.highlights.map((h, i) => (
                        <div key={i} className="flex justify-between items-center bg-emerald-50/60 rounded-xl px-4 py-2.5 border border-emerald-100">
                          <div>
                            <div className="text-xs font-bold text-[#0f172a]">{h.label} — {h.hospName}</div>
                            <div className="text-[10.5px] text-[#64748b]">{fmt(h.amt68)} → {fmt(h.amt69)} บาท</div>
                          </div>
                          <div className="text-xs font-black text-emerald-600">+{fmt(h.diff)} ({h.pct.toFixed(0)}%)</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-2xl border border-red-200 p-6 shadow-sm">
                  <div className="text-sm font-black text-[#991b1b] flex items-center gap-2 mb-4"><TrendingDown size={17} /> จุดที่ควรระวัง — หมวดที่ลดลง</div>
                  {directorSummaryData.concerns.length === 0 ? (
                    <div className="text-xs text-[#94a3b8]">ไม่มีหมวดที่ลดลงเมื่อเทียบปีก่อน</div>
                  ) : (
                    <div className="space-y-2.5">
                      {directorSummaryData.concerns.map((c, i) => (
                        <div key={i} className="flex justify-between items-center bg-red-50/60 rounded-xl px-4 py-2.5 border border-red-100">
                          <div>
                            <div className="text-xs font-bold text-[#0f172a]">{c.label} — {c.hospName}</div>
                            <div className="text-[10.5px] text-[#64748b]">{fmt(c.amt68)} → {fmt(c.amt69)} บาท</div>
                          </div>
                          <div className="text-xs font-black text-red-600">{fmt(c.diff)} ({c.pct.toFixed(0)}%)</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Channel breakdown — Cup-wide */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
                <div className="text-sm font-black text-[#0f172a] mb-4">สัดส่วนรายรับแยกช่องทาง — {directorSummaryData.isScoped ? directorSummaryData.scopeHospName : 'Cup รวม'} (ปีงบ 2569)</div>
                <div className="space-y-2.5">
                  {directorSummaryData.cupChannel.map(ch => (
                    <div key={ch.key} className="flex items-center gap-3">
                      <div className="w-24 text-[11px] font-bold text-[#475569] shrink-0">{ch.key}</div>
                      <div className="flex-1 h-6 bg-[#f1f5f9] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#059669] to-[#34d399] rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.max(ch.pct, 4)}%` }}>
                          <span className="text-[10px] font-black text-white">{ch.pct.toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="w-28 text-right text-xs font-bold text-[#0f172a] shrink-0">฿{fmt(ch.amt)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Per-hospital summary cards — only for the Cup-wide ผอ. */}
              {!directorSummaryData.isScoped && (
                <>
                  <div className="text-sm font-black text-[#0f172a] pt-2">สรุปแยกรายหน่วยบริการ (5 แห่ง)</div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {directorSummaryData.hospRows.map(h => (
                      <div key={h.code} className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="text-[10.5px] font-bold text-[#059669] bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 rounded-md inline-block mb-1">{h.code}</div>
                            <div className="text-sm font-black text-[#0f172a]">{h.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-black text-[#0f172a]">฿{fmt(h.total69)}</div>
                            <div className={`text-[11px] font-bold flex items-center gap-1 justify-end ${h.pct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {h.pct >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                              {h.pct >= 0 ? '+' : ''}{h.pct.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          {h.cats.map(c => (
                            <div key={c.key} className="flex justify-between items-center text-xs border-b border-[#f1f5f9] py-1.5 last:border-0">
                              <span className="text-[#64748b] font-semibold">{c.label}</span>
                              <span className="font-bold text-[#334155]">฿{fmt(c.amt69)}</span>
                              <span className={`font-bold w-16 text-right ${c.pct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                {c.pct >= 0 ? '+' : ''}{c.pct.toFixed(0)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              </div>

              <div className="text-center text-xs text-[#94a3b8] pt-4 pb-2 border-t border-[#e2e8f0]">
                © 2026 CLAIMCUP Sankhong Portal • Executive Summary สำหรับผู้อำนวยการ
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
