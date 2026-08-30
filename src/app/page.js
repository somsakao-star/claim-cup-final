"use client";
import WebThreads from './WebThreads';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import {
  Activity, Trophy, Syringe, Baby, Flower, Scan, HeartPulse, Monitor,
  ArrowUpRight, ArrowLeft, Calendar, Clock, Building2, CheckCircle2,
  Layers, Leaf, List, Table2, Wallet, LogOut, FileText, Database, Printer,
  Sparkles, DollarSign, Stethoscope, Pill, ChevronRight
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

const THERAPIST_SPLIT = [
  { id: 1, name: 'นักกายภาพบำบัด คนที่ 1', pct: 0.40, color: '#0369a1', bg: '#e0f2fe' },
  { id: 2, name: 'นักกายภาพบำบัด คนที่ 2', pct: 0.35, color: '#15803d', bg: '#dcfce7' },
  { id: 3, name: 'นักกายภาพบำบัด คนที่ 3', pct: 0.25, color: '#b45309', bg: '#fef3c7' },
];

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

const fmt = (n) => Math.round(n || 0).toLocaleString('th-TH');
const fmtD = (n) => (n || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtS = (n) => {
  const v = Math.abs(Math.round(n || 0));
  if (v >= 1000000) return `${(v / 1e6).toFixed(2)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
  return `${v}`;
};

const HOSP_PALETTE = ['#3b82f6', '#10b981', '#f97316', '#a855f7', '#ec4899', '#06b6d4'];

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
        <div className="absolute top-52 text-slate-300 animate-pulse text-sm font-bold tracking-widest z-20 flex flex-col items-center gap-2 drop-shadow-md cursor-pointer" onClick={() => setIsPulled(true)}>
          <span>👇</span><span>คลิกเพื่อเปิดระบบ</span>
        </div>
      )}

      <div className={`relative bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_25px_70px_-10px_rgba(5,150,105,0.4)] w-full max-w-md z-20 mt-24 transition-all duration-1000 ease-out transform border-2 border-emerald-400/50 ring-4 ring-emerald-500/10 ${isPulled ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-20 opacity-0 scale-95 pointer-events-none'}`}>
        <div className="text-center mb-8 flex flex-col items-center">
          <img src="/my-logo.png" alt="โลโก้ รพ.สต." className="w-28 h-28 mb-4 rounded-full object-cover shadow-[0_10px_30px_rgba(5,150,105,0.2)] bg-white border-4 border-emerald-100" />
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
          <button type="submit" disabled={isLoading} className="w-full text-white font-black py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-[0_10px_25px_rgba(5,150,105,0.3)] tracking-wide text-sm cursor-pointer">
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
  const [activeDetailTab, setActiveDetailTab] = useState('PP-FS');
  const [detailFilterHosp, setDetailFilterHosp] = useState('all');
  const [payableHosp, setPayableHosp] = useState('ALL');
  const [payableYear, setPayableYear] = useState('69');
  const [therapistPopupId, setTherapistPopupId] = useState(null);
  const [showExpPrintModal, setShowExpPrintModal] = useState(false);

  const [claims, setClaims] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hospitalMap, setHospitalMap] = useState({ 'all': 'All Cup' });
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

  // Auto-Logout 30 mins
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
        const [resC, resE, resHos, resP] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/api/claims`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/expenses`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/hospitals`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/payments`).then(r => r.json()).catch(() => fetch(`${API_BASE_URL}/api/payment`).then(r => r.json())),
        ]);

        if (resC.status === 'fulfilled' && Array.isArray(resC.value)) setClaims(resC.value);
        if (resE.status === 'fulfilled' && Array.isArray(resE.value)) setExpenses(resE.value);
        if (resP.status === 'fulfilled' && Array.isArray(resP.value)) setPayments(resP.value);
        if (resHos.status === 'fulfilled' && Array.isArray(resHos.value)) {
          const hMap = { 'all': 'All Cup' };
          resHos.value.forEach(h => {
            const code = String(h.hcode);
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

  /* ─── Processed Data for Overview & Ranking ─── */
  const processedData = useMemo(() => {
    let totalAmt = 0;
    const hospTotals = {};
    const groupStats = {};

    Object.keys(hospitalMap).forEach(k => {
      if (k !== 'all') hospTotals[k] = 0;
    });

    claims.forEach(c => {
      const yr = String(c.fiscal_year || '');
      const hcode = String(c.hcode || '');
      const amt = parseFloat(String(c.amount || 0).replace(/,/g, '')) || 0;
      const group = String(c.group || 'อื่นๆ');

      if (currentHosp === 'all' || hcode === currentHosp) {
        if (currentYear === 'all' || yr === currentYear) {
          totalAmt += amt;

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

      if (currentYear === 'all' || yr === currentYear) {
        if (hospTotals[hcode] !== undefined) {
          hospTotals[hcode] += amt;
        }
      }
    });

    // Top 5 ranking
    const rankingList = Object.entries(hospTotals)
      .map(([hcode, amount]) => {
        const itemCount = claims.filter(c => {
          const yr = String(c.fiscal_year || '');
          return String(c.hcode) === hcode && (currentYear === 'all' || yr === currentYear);
        }).length;
        return {
          hcode,
          name: hospitalMap[hcode] ? hospitalMap[hcode].replace(/^[0-9]+\s*[-–]?\s*/, '') : hcode,
          amount,
          items: itemCount,
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

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

  /* ─── Payable Stats (Using Payment table: rep, month, fiscal_year, platform, hcode, amount, receive) ─── */
  const payableStats = useMemo(() => {
    if (payments && payments.length > 0) {
      // 1. Calculate sum68 and sum69 for all or selected hospital
      let sum68 = 0, sum69 = 0;
      payments.forEach(p => {
        const yr = String(p.fiscal_year || '');
        const amt = parseFloat(String(p.amount || 0).replace(/,/g, '')) || 0;
        const matchHosp = payableHosp === 'ALL' || String(p.hcode) === payableHosp;
        if (matchHosp) {
          if (yr.includes('2568') || yr.endsWith('68')) sum68 += amt;
          if (yr.includes('2569') || yr.endsWith('69')) sum69 += amt;
        }
      });

      // 2. Table 1: สรุปแยกตามหน่วยบริการ (สำหรับปีที่เลือก หรือปีล่าสุด)
      const currentYearFilter = payableYear === '69' ? '69' : '68';
      const hospDataMap = {};
      Object.entries(hospitalMap).filter(([k]) => k !== 'all').forEach(([code, name]) => {
        hospDataMap[code] = {
          'หน่วยบริการ': `${code} - ${name}`,
          'code': code,
          'รับเงินครั้งที่1': 0,
          'รับเงินครั้งที่2': 0,
          'หักเงิน': 0,
          'ยอดสุทธิ': 0
        };
      });

      let p1 = 0, p2 = 0, ded = 0;

      payments.forEach(p => {
        const yr = String(p.fiscal_year || '');
        const matchYr = yr.includes(`25${currentYearFilter}`) || yr.endsWith(currentYearFilter);
        const code = String(p.hcode || '').trim();
        const amt = parseFloat(String(p.amount || 0).replace(/,/g, '')) || 0;
        const rep = parseInt(String(p.rep || 1), 10);
        const isRec = String(p.receive || '').trim().toUpperCase() === 'Y';

        if (matchYr && hospDataMap[code]) {
          if (isRec) {
            if (rep === 2) {
              hospDataMap[code]['รับเงินครั้งที่2'] += amt;
              p2 += amt;
            } else {
              hospDataMap[code]['รับเงินครั้งที่1'] += amt;
              p1 += amt;
            }
          } else {
            hospDataMap[code]['หักเงิน'] += amt;
            ded += amt;
          }
        }
      });

      Object.values(hospDataMap).forEach(row => {
        row['ยอดสุทธิ'] = (row['รับเงินครั้งที่1'] + row['รับเงินครั้งที่2']) - row['หักเงิน'];
      });

      const filteredPayData = Object.values(hospDataMap).filter(r => payableHosp === 'ALL' || r.code === payableHosp);
      const totalReceived = p1 + p2;
      const netRemain = totalReceived - ded;

      // 3. Table 2: Statement Matrix รายเดือน x Platform
      const monthMatrixMap = {};
      payments.forEach(p => {
        const yr = String(p.fiscal_year || '');
        const matchYr = yr.includes(`25${currentYearFilter}`) || yr.endsWith(currentYearFilter);
        const matchHosp = payableHosp === 'ALL' || String(p.hcode) === payableHosp;
        if (matchYr && matchHosp) {
          const m = String(p.month || '').trim();
          let platform = String(p.platform || 'อื่นๆ').trim();
          if (/ntip|cxr|tb|วัณโรค/i.test(platform)) {
            platform = 'NTIP';
          }
          const amt = parseFloat(String(p.amount || 0).replace(/,/g, '')) || 0;

          if (!monthMatrixMap[m]) {
            monthMatrixMap[m] = {
              'Month': m,
              'KTB Claim': 0,
              'MOPH Claim': 0,
              'E-Claim': 0,
              'NTIP': 0,
              'แพทย์แผนไทย': 0,
              'Total': 0
            };
          }
          if (monthMatrixMap[m][platform] !== undefined) {
            monthMatrixMap[m][platform] += amt;
          } else {
            monthMatrixMap[m][platform] = amt;
          }
          monthMatrixMap[m]['Total'] += amt;
        }
      });

      let matrixRows = Object.values(monthMatrixMap);
      if (matrixRows.length === 0) {
        matrixRows = payableYear === '69' ? (PAY_MATRIX_69[payableHosp] || PAY_MATRIX_69['ALL'] || []) : (PAY_MATRIX_68[payableHosp] || PAY_MATRIX_68['ALL'] || []);
      }

      const matrixTotal = matrixRows.reduce((acc, row) => {
        ['KTB Claim', 'MOPH Claim', 'E-Claim', 'NTIP', 'แพทย์แผนไทย', 'Total'].forEach(k => {
          acc[k] = (acc[k] || 0) + (row[k] || 0);
        });
        return acc;
      }, {});

      return { filteredPayData, p1, p2, ded, totalReceived, netRemain, sum68, sum69, matrixRows, matrixTotal };
    }

    // Fallback if payments table is empty
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
      ['KTB Claim', 'MOPH Claim', 'E-Claim', 'NTIP', 'แพทย์แผนไทย', 'Total'].forEach(k => {
        acc[k] = (acc[k] || 0) + (row[k] || 0);
      });
      return acc;
    }, {});

    return { filteredPayData, p1, p2, ded, totalReceived, netRemain, sum68, sum69, matrixRows, matrixTotal };
  }, [payments, payableHosp, payableYear, hospitalMap]);

  /* ─── Physical Therapy Stats ─── */
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
      .map(h => ({ ...h, name: hospitalMap[h.hcode] ? hospitalMap[h.hcode].replace(/^[0-9]+\s*[-–]?\s*/, '') : h.hcode }))
      .sort((a, b) => b.amount - a.amount);

    const serviceBreakdown = Object.values(serviceMap).sort((a, b) => b.amount - a.amount);

    return { total, count: rows.length, hcodeBreakdown, serviceBreakdown };
  }, [claims, currentYear, hospitalMap]);

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
  }, [currentView, processedData, hospitalMap]);

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
  }, [currentView, detailComparisonData]);

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
  }, [currentView, expenseStats]);

  /* ─── Chart: Physical Therapy YoY Comparison Chart ─── */
  useEffect(() => {
    if (currentView !== 'physical') return;
    if (!physYoYCanvasRef.current) return;

    if (physYoYChartRef.current) physYoYChartRef.current.destroy();

    const phys68 = [15000, 18500, 21000, 24500, 28000, 31000, 22000, 26000, 19800, 24500, 18500, 15040];
    const phys69 = [22000, 28500, 25000, 35000, 39000, 42000, 31400, 17000, 0, 0, 0, 0];

    physYoYChartRef.current = new Chart(physYoYCanvasRef.current, {
      type: 'bar',
      data: {
        labels: MONTHS_TH,
        datasets: [
          {
            label: 'ปีงบประมาณ 2568 (฿235,840)',
            data: phys68,
            backgroundColor: '#94a3b8',
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.6
          },
          {
            label: 'ปีงบประมาณ 2569 (฿239,900)',
            data: phys69,
            backgroundColor: '#0284c7',
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 16,
              font: { size: 12, weight: '700' }
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label.split(' ')[0]}: ${Math.round(ctx.parsed.y).toLocaleString('th-TH')} บาท`
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

    return () => {
      if (physYoYChartRef.current) physYoYChartRef.current.destroy();
    };
  }, [currentView]);

  // Handle Loading & Login
  if (loading) return (
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
          <div className="p-5 flex items-center gap-3 border-b border-[#e2e8f0]">
            <div className="w-[42px] h-[42px] rounded-xl bg-[#022c22] shadow-[0_4px_10px_rgba(2,44,34,0.2)] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.3">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
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
                {Object.entries(hospitalMap).filter(([k]) => k !== 'all').map(([code, name], idx) => {
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
                    <button
                      onClick={() => { setActiveDetailTab('ppfs'); setCurrentView('detail'); }}
                      className="bg-white/15 hover:bg-white/25 border border-white/30 px-5 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Sparkles size={15} className="text-[#34d399]" /> ดูรายละเอียดเจาะลึก 4 หมวด
                    </button>
                    <div className="bg-emerald-950/50 border border-emerald-400/20 px-4 py-2 rounded-full text-xs font-bold text-emerald-200 hidden sm:flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[#34d399]" /> รพ.สต. ในเครือข่าย 5 แห่ง
                    </div>
                  </div>
                </div>

                {/* Donut Card (2-column Legend matching dashboard_demo.html) */}
                <div className="bg-white text-slate-900 rounded-[20px] p-5 md:p-6 flex items-center gap-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                  <div className="relative w-[130px] h-[130px] shrink-0">
                    <canvas ref={donutCanvasRef}></canvas>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                      <div className="text-[9px] font-extrabold text-[#94a3b8] uppercase tracking-wider">
                        {currentHosp === 'all' ? 'CUP SHARE' : 'สัดส่วน'}
                      </div>
                      <div className="text-[18px] font-black text-[#0f172a]">
                        {currentHosp === 'all' ? `${Object.keys(hospitalMap).filter(k => k !== 'all').length} แห่ง` : `${currentHospPct}%`}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5">
                    {Object.entries(hospitalMap).filter(([k]) => k !== 'all').map(([code, name], idx) => {
                      const clean = name.replace(/^[0-9]+\s*[-–]?\s*/, '').replace('รพ.สต.', '');
                      const amt = processedData.hospTotals[code] || 0;
                      const isSelected = currentHosp === code;
                      
                      const styleMap = {
                        '05954': { dot: '#3b82f6', text: '#1d4ed8', bg: '#eff6ff' },
                        '05962': { dot: '#10b981', text: '#059669', bg: '#ecfdf5' },
                        '05957': { dot: '#f97316', text: '#c2410c', bg: '#fff7ed' },
                        '05959': { dot: '#a855f7', text: '#7e22ce', bg: '#faf5ff' },
                        '05956': { dot: '#ec4899', text: '#be185d', bg: '#fdf2f8' },
                      };
                      const s = styleMap[code] || { dot: HOSP_PALETTE[idx % HOSP_PALETTE.length], text: '#065f46', bg: '#ecfdf5' };

                      return (
                        <div
                          key={code}
                          onClick={() => setCurrentHosp(code)}
                          className={`flex items-center justify-between gap-1.5 p-1 rounded-lg cursor-pointer transition-all hover:bg-slate-50 ${
                            isSelected ? 'ring-1.5 ring-emerald-500 bg-emerald-50/50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-[7px] h-[7px] rounded-full shrink-0" style={{ backgroundColor: s.dot }}></div>
                            <span className="truncate text-[11.5px] font-semibold text-slate-700">รพ.สต.{clean}</span>
                          </div>
                          <span
                            className="text-[11px] font-extrabold px-2 py-0.5 rounded shrink-0"
                            style={{ color: s.text, backgroundColor: s.bg }}
                          >
                            ฿{fmt(amt)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ══ 1. 4 METRIC CARDS (1.Physical, 2.PPFS, 3.Thai Med, 4.Herbal) ══ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. กายภาพบำบัด */}
                <div
                  onClick={() => setCurrentView('physical')}
                  className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer border-l-4 border-l-[#0284c7] flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-2.5">
                    <div className="text-xs font-bold text-[#475569]">ชดเชย กายภาพบำบัด ปี {currentYear.slice(2)}</div>
                    <div className="w-9 h-9 rounded-xl bg-[#f0f9ff] text-[#0284c7] flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="17" r="4"/>
                        <circle cx="18.5" cy="18.5" r="1.5"/>
                        <path d="M9 13h5l3-7h3"/>
                        <path d="M14 13v4"/>
                        <path d="M9 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#0f172a] mb-2">392,535.34</div>
                  <div className="text-[11.5px] font-semibold text-[#0369a1] truncate flex items-center gap-1">
                    <Trophy size={13} className="text-[#0284c7] shrink-0" />
                    <span>สูงสุด: กายภาพบำบัด_IMC (฿259,650)</span>
                  </div>
                </div>

                {/* 2. PPFS (รายได้งบ PPFS) */}
                <div
                  onClick={() => { setActiveDetailTab('ppfs'); setCurrentView('detail'); }}
                  className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer border-l-4 border-l-[#8b5cf6] flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-2.5">
                    <div className="text-xs font-bold text-[#475569]">รายได้งบ PPFS ปี {currentYear.slice(2)}</div>
                    <div className="w-9 h-9 rounded-xl bg-[#f5f3ff] text-[#8b5cf6] flex items-center justify-center shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#0f172a] mb-2">294,185.00</div>
                  <div className="text-[11.5px] font-semibold text-[#7c3aed] truncate flex items-center gap-1">
                    <Trophy size={13} className="text-[#8b5cf6] shrink-0" />
                    <span>สูงสุด: เจาะเลือดตรวจน้ำตาล/ไขมัน (฿148,100)</span>
                  </div>
                </div>

                {/* 3. Thai Med (แพทย์แผนไทย) */}
                <div
                  onClick={() => { setActiveDetailTab('thai'); setCurrentView('detail'); }}
                  className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer border-l-4 border-l-[#f59e0b] flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-2.5">
                    <div className="text-xs font-bold text-[#475569]">ชดเชยแพทย์แผนไทย ปี {currentYear.slice(2)}</div>
                    <div className="w-9 h-9 rounded-xl bg-[#fffbeb] text-[#f59e0b] flex items-center justify-center shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#0f172a] mb-2">226,930.50</div>
                  <div className="text-[11.5px] font-semibold text-[#d97706] truncate flex items-center gap-1">
                    <Trophy size={13} className="text-[#f59e0b] shrink-0" />
                    <span>สูงสุด: ค่าบริการนวดและประคบ (฿219,827)</span>
                  </div>
                </div>

                {/* 4. Herbal (ยาสมุนไพร) */}
                <div
                  onClick={() => { setActiveDetailTab('herbal'); setCurrentView('detail'); }}
                  className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer border-l-4 border-l-[#10b981] flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-2.5">
                    <div className="text-xs font-bold text-[#475569]">ชดเชย ยาสมุนไพร ปี {currentYear.slice(2)}</div>
                    <div className="w-9 h-9 rounded-xl bg-[#ecfdf5] text-[#10b981] flex items-center justify-center shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#0f172a] mb-2">86,420.00</div>
                  <div className="text-[11.5px] font-semibold text-[#059669] truncate flex items-center gap-1">
                    <Trophy size={13} className="text-[#10b981] shrink-0" />
                    <span>สูงสุด: ยาขมิ้นชัน / ยาแก้ไอ (฿41,250)</span>
                  </div>
                </div>
              </div>

              {/* 🏆 Top 5 Internal Ranking (5-Column Grid) */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="font-black text-base text-[#0f172a] flex items-center gap-2">
                      <Trophy size={18} className="text-amber-500" /> การจัดลำดับ 1-5 ภายในเครือข่าย CUP สันโค้ง
                    </div>
                    <div className="text-xs text-[#64748b] mt-0.5">เปรียบเทียบผลงานและยอดชดเชยสะสม ประจำปีงบประมาณ {currentYear}</div>
                  </div>
                  <span className="text-[11px] font-extrabold bg-[#fef3c7] text-[#b45309] px-3 py-1 rounded-full border border-[#fde68a]">
                    Top 5 Internal Ranking
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
                  {processedData.rankingList.map((item, idx) => {
                    const badgeBgs = ['bg-[#fef3c7] text-[#b45309]', 'bg-[#f1f5f9] text-[#475569]', 'bg-[#ffedd5] text-[#c2410c]', 'bg-[#eff6ff] text-[#1d4ed8]', 'bg-[#fdf2f8] text-[#be185d]'];
                    return (
                      <div
                        key={item.hcode}
                        onClick={() => setCurrentHosp(item.hcode)}
                        className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex flex-col justify-between hover:border-[#10b981] hover:-translate-y-0.5 hover:shadow-md cursor-pointer transition-all"
                      >
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-[10.5px] font-extrabold px-2 py-0.5 rounded ${badgeBgs[idx % badgeBgs.length]}`}>
                              อันดับ {idx + 1}
                            </span>
                            <span className="text-[10px] font-extrabold text-[#064e3b] bg-[#ecfdf5] px-2 py-0.5 rounded">
                              {fmt(item.items)} รายการ
                            </span>
                          </div>
                          <div className="font-bold text-sm text-[#0f172a] leading-tight mb-1">{item.name}</div>
                          <div className="text-[10.5px] text-[#64748b] mb-3">{item.hcode}</div>
                        </div>
                        <div className="pt-2 border-t border-slate-100">
                          <div className="text-[10px] text-[#94a3b8] font-bold">ยอดเบิกชดเชย (ปี {currentYear.slice(2)})</div>
                          <div className="text-base font-black text-[#064e3b]">฿{fmt(item.amount)}</div>
                        </div>
                      </div>
                    );
                  })}
                  {processedData.rankingList.length === 0 && (
                    <div className="col-span-5 text-center text-slate-400 font-bold py-6">ไม่มีข้อมูล</div>
                  )}
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
                    {Object.entries(hospitalMap).filter(([k]) => k !== 'all').map(([code, name]) => (
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
                <div className="w-10 h-10 rounded-xl bg-[#0284c7] text-white flex items-center justify-center shadow-md">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="17" r="4"/>
                    <circle cx="18.5" cy="18.5" r="1.5"/>
                    <path d="M9 13h5l3-7h3"/>
                    <path d="M14 13v4"/>
                    <path d="M9 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-black text-slate-900">แดชบอร์ดบริการฟื้นฟูสมรรถภาพ & กายภาพบำบัด</div>
                    <span className="bg-gradient-to-r from-[#0284c7] to-[#38bdf8] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      Physical Therapy
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold">สรุปข้อมูลการเบิกจ่ายและชดเชยค่าบริการกายภาพบำบัด เปรียบเทียบปีงบประมาณ 2568 - 2569</div>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('overview')}
                className="px-5 py-2.5 rounded-full bg-[#022c22] text-white text-xs font-black flex items-center gap-2 hover:bg-[#064e3b] hover:-translate-y-0.5 transition-all shadow-[0_4px_14px_rgba(2,44,34,0.3)] cursor-pointer"
              >
                <ArrowLeft size={16} /> กลับสู่หน้าหลัก
              </button>
            </nav>

            <div className="p-6 md:p-8 max-w-[1400px] mx-auto w-full space-y-7">
              {/* ══ Dark Hero Banner (กล่องสรุปภาพรวมด้านบน) ══ */}
              <div className="bg-gradient-to-br from-[#0c4a6e] to-[#0369a1] rounded-2xl p-7 text-white shadow-[0_8px_24px_rgba(3,105,161,0.2)] flex justify-between items-center flex-wrap gap-5 border border-sky-400/20">
                <div className="flex-1 min-w-[300px]">
                  <div className="text-[11px] font-bold text-sky-200 bg-white/15 border border-white/25 px-3 py-1 rounded-md inline-flex items-center gap-1.5 mb-2.5">
                    <FileText size={13} /> แหล่งข้อมูล: รวมบริการกายภาพบำบัด รพ.สต.สังกัด อบจ.เชียงใหม่ (ต.ค.68 - พ.ค.69)
                  </div>
                  <div className="text-2xl font-black text-white mb-1">
                    เจาะลึกรายได้บริการฟื้นฟูสมรรถภาพ & กายภาพบำบัด
                  </div>
                  <div className="text-xs text-sky-100 font-medium leading-relaxed">
                    วิเคราะห์การเบิกค่าชดเชยบริการกายภาพบำบัด เปรียบเทียบยอดเบิกและยอดชดเชยจริง รายหน่วยบริการและรายกิจกรรม 2 ปีงบประมาณ (2568, 2569)
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="bg-white/12 border border-white/20 backdrop-blur-md rounded-2xl px-6 py-4 text-right min-w-[200px]">
                    <div className="text-[11px] font-bold text-sky-200">ยอดเงินรวม ปี 69</div>
                    <div className="text-2xl font-black text-white mt-0.5">392,535.34</div>
                    <div className="text-[11px] text-sky-200 mt-0.5">บาท (ข้อมูลจริงสะสม 1,098 ครั้ง)</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-white/10 border border-white/15 rounded-xl px-3.5 py-1.5 text-right min-w-[170px]">
                      <div className="text-[10px] text-sky-200 font-semibold">รพ.สต.บ้านสันโค้ง</div>
                      <div className="text-sm font-black text-white">฿365,885 <span className="text-[10px] text-sky-300 font-normal">(93.2%)</span></div>
                    </div>
                    <div className="bg-white/10 border border-white/15 rounded-xl px-3.5 py-1.5 text-right min-w-[170px]">
                      <div className="text-[10px] text-sky-200 font-semibold">รพ.สต.บ้านต้นเปา</div>
                      <div className="text-sm font-black text-white">฿26,650 <span className="text-[10px] text-sky-300 font-normal">(6.8%)</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── 3 Physical Summary Cards (ตามรูปเป๊ะๆ) ─── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Card 1: ปีงบ 2568 – สถานะการโอน */}
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div>
                    <div className="text-base font-extrabold text-slate-900 mb-2">ปีงบ 2568 – สถานะการโอน</div>
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1.5 bg-[#e0f2fe] text-[#0369a1] px-3 py-1 rounded-lg text-xs font-bold">
                        <span>🎴</span> Cup สันโค้ง (ทั้งหมด)
                      </span>
                    </div>
                    <div className="space-y-3.5 text-[13.5px]">
                      <div className="flex justify-between items-center text-slate-500">
                        <span>จำนวนรายการ</span>
                        <strong className="text-slate-900 font-extrabold">902 ครั้ง</strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>ยอดเบิก</span>
                        <strong className="text-slate-900 font-extrabold">235,840 บาท</strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>ยอดชดเชย</span>
                        <strong className="text-slate-900 font-extrabold">152,635 บาท</strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>ผู้รับบริการ</span>
                        <strong className="text-slate-900 font-extrabold">69 คน</strong>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center text-[13.5px]">
                    <span className="text-slate-500 font-bold">อัตราชดเชย</span>
                    <span className="font-black text-red-600 text-base">64.7%</span>
                  </div>
                </div>

                {/* Card 2: ปีงบ 2569 – Cup สันโค้ง */}
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div>
                    <div className="text-base font-extrabold text-slate-900 mb-2">ปีงบ 2569 – Cup สันโค้ง</div>
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1.5 bg-[#e0f2fe] text-[#0369a1] px-3 py-1 rounded-lg text-xs font-bold">
                        <span>🎴</span> Cup สันโค้ง
                      </span>
                    </div>
                    <div className="space-y-3.5 text-[13.5px]">
                      <div className="flex justify-between items-center text-slate-500">
                        <span>จำนวนรายการ</span>
                        <strong className="text-slate-900 font-extrabold">732 ครั้ง</strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>ยอดเบิก</span>
                        <strong className="text-slate-900 font-extrabold">239,900 บาท</strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>ยอดชดเชย</span>
                        <strong className="text-slate-900 font-extrabold">239,900 บาท</strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>ผู้รับบริการ</span>
                        <strong className="text-slate-900 font-extrabold">43 คน</strong>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center text-[13.5px]">
                    <span className="text-slate-500 font-bold">อัตราชดเชย</span>
                    <span className="font-black text-emerald-600 text-base inline-flex items-center gap-1">100% ✅</span>
                  </div>
                </div>

                {/* Card 3: ปีงบ 2569 – รพ.สันกำแพง */}
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div>
                    <div className="text-base font-extrabold text-slate-900 mb-2">ปีงบ 2569 – รพ.สันกำแพง</div>
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1.5 bg-[#ccfbf1] text-[#0f766e] px-3 py-1 rounded-lg text-xs font-bold">
                        <span>🎴</span> รพ.สันกำแพง
                      </span>
                    </div>
                    <div className="space-y-3.5 text-[13.5px]">
                      <div className="flex justify-between items-center text-slate-500">
                        <span>จำนวนรายการ</span>
                        <strong className="text-slate-900 font-extrabold">367 ครั้ง</strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>ยอดเบิก</span>
                        <strong className="text-slate-900 font-extrabold">119,400 บาท</strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>ยอดชดเชย</span>
                        <strong className="text-slate-900 font-extrabold">119,400 บาท</strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>ผู้รับบริการ</span>
                        <strong className="text-slate-900 font-extrabold">30 คน</strong>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center text-[13.5px]">
                    <span className="text-slate-500 font-bold">อัตราชดเชย</span>
                    <span className="font-black text-emerald-600 text-base inline-flex items-center gap-1">100% ✅</span>
                  </div>
                </div>
              </div>

              {/* ─── กราฟเปรียบเทียบยอดเบิกรายเดือน (YoY Comparison Chart) ─── */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 md:p-7 shadow-sm">
                <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
                  <div>
                    <div className="font-black text-slate-900 text-base flex items-center gap-2">
                      <Activity size={18} className="text-[#0284c7]" /> กราฟเปรียบเทียบยอดเบิกรายเดือน (YoY Comparison)
                    </div>
                    <div className="text-xs text-slate-500 mt-1">เปรียบเทียบยอดเงินชดเชยค่าบริการกายภาพบำบัดรายเดือน ระหว่างปีงบประมาณ 2568 และ 2569</div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-slate-400 inline-block"></span>
                      <span className="text-slate-500">ปีงบ 2568 (฿235.8K)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-[#0284c7] inline-block"></span>
                      <span className="text-[#0284c7]">ปีงบ 2569 (฿239.9K)</span>
                    </div>
                  </div>
                </div>
                <div className="relative h-[320px] w-full">
                  <canvas ref={physYoYCanvasRef}></canvas>
                </div>
              </div>

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
                  onClick={() => setShowExpPrintModal(true)}
                  className="px-4 py-2 bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-sky-800 transition-all shadow-sm cursor-pointer"
                >
                  <Printer size={15} /> พิมพ์รายงาน
                </button>
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
                    <Printer size={14} /> พิมพ์รายงาน (2 แผ่น แนวนอน)
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
                        onClick={() => window.print()}
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
              {/* Filter Dropdown */}
              <div className="print:hidden bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0] flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-xs text-slate-700">เลือกหน่วยบริการ:</span>
                  <select
                    value={payableHosp}
                    onChange={(e) => setPayableHosp(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-800 min-w-[280px] outline-none cursor-pointer"
                  >
                    {PAYABLE_HOSP_OPTIONS.map(h => (
                      <option key={h.code} value={h.code}>{h.label}</option>
                    ))}
                  </select>
                </div>
                <div className="text-xs text-slate-500 font-semibold">ปรับยอดและตารางอัตโนมัติตามหน่วยบริการที่เลือก</div>
              </div>

              {/* 4 KPI Cards (รูปแบบเดิม) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm border-l-4 border-l-[#10b981]">
                  <div className="text-xs font-bold text-slate-500">ยอดเงินรวม ปีงบ 2568</div>
                  <div className="text-xl font-black text-[#065f46] mt-1">฿{fmtD(payableStats.sum68)}</div>
                </div>
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm border-l-4 border-l-[#2563eb]">
                  <div className="text-xs font-bold text-slate-500">ยอดเงินรวม ปีงบ 2569</div>
                  <div className="text-xl font-black text-[#1e40af] mt-1">฿{fmtD(payableStats.sum69)}</div>
                </div>
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm border-l-4 border-l-[#f59e0b]">
                  <div className="text-xs font-bold text-slate-500">ยอดรับเงินรวม (ครั้งที่ 1 + 2)</div>
                  <div className="text-xl font-black text-[#b45309] mt-1">฿{fmtD(payableStats.totalReceived)}</div>
                </div>
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm border-l-4 border-l-[#0f172a]">
                  <div className="text-xs font-bold text-slate-500">ยอดเงินคงเหลือสุทธิ</div>
                  <div className="text-xl font-black text-slate-900 mt-1">฿{fmtD(payableStats.netRemain)}</div>
                </div>
              </div>

              {/* Table 1: สรุปการจ่ายเงิน (รูปแบบเดิม) */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm">ตารางสรุปการจ่ายเงินและยอดหักชดเชย (แยกตามหน่วยบริการ)</h3>
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
                    <tr className="bg-slate-100 font-black text-slate-900">
                      <td className="p-3">รวมทั้งหมด ({payableStats.filteredPayData.length} หน่วยบริการ)</td>
                      <td className="p-3 text-right">{fmtD(payableStats.p1)}</td>
                      <td className="p-3 text-right">{fmtD(payableStats.p2)}</td>
                      <td className="p-3 text-right text-red-600">{fmtD(payableStats.ded)}</td>
                      <td className="p-3 text-right text-emerald-900 bg-emerald-50">{fmtD(payableStats.netRemain)}</td>
                    </tr>
                  </tfoot>
                </table>
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

      </main>
    </div>
  );
}
