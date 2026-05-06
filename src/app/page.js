"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity, Trophy, Syringe, Baby, Flower, Scan, HeartPulse, Monitor,
  ArrowUpRight, ArrowLeft, Calendar, Clock, Building2, CheckCircle2,
  Layers, Leaf, List, Table2, Wallet
} from 'lucide-react';

const API_BASE_URL = typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_API_URL || '' : '';

const PLATFORM_COLORS = {
  eclaim: "#6366f1", ktb: "#0ea5e9", moph: "#f59e0b",
  thai: "#10b981", ntip: "#8b5cf6", physical: "#f43f5e",
};

const hospitals = [
  { id: 'all', name: 'All Cup', active: 'bg-slate-800 text-white shadow-slate-300 ring-2 ring-slate-800 ring-offset-2', inactive: 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200' },
  { id: '05954', name: 'รพ.สต.บ้านสันโค้ง', active: 'bg-blue-600 text-white shadow-blue-300 ring-2 ring-blue-600 ring-offset-2', inactive: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100' },
  { id: '05962', name: 'รพ.สต.บ้านต้นเปา', active: 'bg-emerald-600 text-white shadow-emerald-300 ring-2 ring-emerald-600 ring-offset-2', inactive: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100' },
  { id: '05957', name: 'รพ.สต.บ้านกอสะเรียม', active: 'bg-amber-500 text-white shadow-amber-300 ring-2 ring-amber-500 ring-offset-2', inactive: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100' },
  { id: 's1', spacer: true },
  { id: 's2', spacer: true },
  { id: '05956', name: 'รพ.สต.บ้านป่าตาล', active: 'bg-rose-600 text-white shadow-rose-300 ring-2 ring-rose-600 ring-offset-2', inactive: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100' },
  { id: '05959', name: 'รพ.สต.บ้านแม่ผาแหน', active: 'bg-indigo-600 text-white shadow-indigo-300 ring-2 ring-indigo-600 ring-offset-2', inactive: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100' },
];

const months = ["ต.ค.", "พ.ย.", "ธ.ค.", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย."];

const monthMapping = {
  "10": 0, "11": 1, "12": 2, "1": 3, "2": 4, "3": 5, 
  "4": 6, "5": 7, "6": 8, "7": 9, "8": 10, "9": 11,
  "ตุลาคม": 0, "พฤศจิกายน": 1, "ธันวาคม": 2, "มกราคม": 3, "กุมภาพันธ์": 4, "มีนาคม": 5,
  "เมษายน": 6, "พฤษภาคม": 7, "มิถุนายน": 8, "กรกฎาคม": 9, "สิงหาคม": 10, "กันยายน": 11
};

const fmt = (n) => Math.round(n || 0).toLocaleString('th-TH');

function processData(claims, yearFilter, unitFilter) {
  const filtered = claims.filter(c => {
    const dataYear = c.fiscal_year ? String(c.fiscal_year) : "";
    const dataUnit = c.hcode || "";
    const matchYear = yearFilter === 'all' || dataYear === yearFilter;
    const isPhysical = c.platform && c.platform.toLowerCase() === 'physical';
    let matchUnit = isPhysical ? (unitFilter === 'all') : (unitFilter === 'all' || dataUnit === unitFilter);
    return matchYear && matchUnit;
  });

  let totalAmount = 0;
  const platformStats = { ktb: 0, moph: 0, eclaim: 0, thai: 0, physical: 0, ntip: 0 };
  const platformItems = { ktb: {}, moph: {}, eclaim: {}, thai: {}, physical: {}, ntip: {} };
  const monthlyTotal = Array(12).fill(0);
  const monthlyByPlatform = { eclaim: Array(12).fill(0), ktb: Array(12).fill(0), moph: Array(12).fill(0) };

  filtered.forEach(c => {
    let amount = typeof c.amount === 'number' ? c.amount : (parseFloat(String(c.amount).replace(/,/g, '')) || 0);
    totalAmount += amount;
    let pKey = c.platform ? c.platform.toLowerCase() : 'other';
    const mStr = String(c.month);
    const mIdx = monthMapping[mStr] !== undefined ? monthMapping[mStr] : -1;

    if (platformStats[pKey] !== undefined) {
      platformStats[pKey] += amount;
      const serviceName = c.service_item || "ไม่ระบุ";
      if (!platformItems[pKey][serviceName]) {
          platformItems[pKey][serviceName] = { total: 0, monthlyData: Array(12).fill(0) };
      }
      platformItems[pKey][serviceName].total += amount;
      if (mIdx >= 0 && mIdx < 12) platformItems[pKey][serviceName].monthlyData[mIdx] += amount;
    }
    if (mIdx >= 0 && mIdx < 12) {
        monthlyTotal[mIdx] += amount;
        if (['eclaim', 'ktb', 'moph'].includes(pKey)) monthlyByPlatform[pKey][mIdx] += amount;
    }
  });

  const platformCards = [
    { key: 'eclaim', title: "E-Claim", icon: Monitor },
    { key: 'ktb', title: "Krungthai Digital Health", icon: Syringe },
    { key: 'moph', title: "MOPH Claim", icon: Baby },
    { key: 'thai', title: "OP/PP Individual", icon: Flower },
    { key: 'ntip', title: "NTIP", icon: Scan },
    { key: 'physical', title: "Disability", icon: HeartPulse },
  ].map(p => ({
    ...p,
    value: platformStats[p.key] || 0,
    items: Object.entries(platformItems[p.key] || {}).map(([name, data]) => ({ name, value: data.total, monthlyData: data.monthlyData })).sort((a, b) => b.value - a.value)
  }));

  const rankingMap = {};
  claims.filter(c => (yearFilter === 'all' || String(c.fiscal_year) === yearFilter)).forEach(c => {
    if (c.platform && c.platform.toLowerCase() === 'physical') return;
    const h = hospitals.find(x => x.id === c.hcode);
    const hName = h ? h.name : (c.hcode || "Unknown");
    if (hName === "All Cup") return;
    if (!rankingMap[hName]) rankingMap[hName] = { amount: 0, cases: 0 };
    let amt = typeof c.amount === 'number' ? c.amount : (parseFloat(String(c.amount).replace(/,/g,''))||0);
    rankingMap[hName].amount += amt;
    rankingMap[hName].cases += 1;
  });

  const rankingList = Object.entries(rankingMap).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.amount - a.amount).slice(0, 5);

  const monthlyTotal68 = Array(12).fill(0);
  const monthlyTotal69 = Array(12).fill(0);
  claims.forEach(c => {
    const dataUnit = c.hcode || "";
    if (unitFilter !== 'all' && dataUnit !== unitFilter) return; 
    let amount = typeof c.amount === 'number' ? c.amount : (parseFloat(String(c.amount).replace(/,/g, '')) || 0);
    const mStr = String(c.month);
    const mIdx = monthMapping[mStr] !== undefined ? monthMapping[mStr] : -1;
    const dataYear = c.fiscal_year ? String(c.fiscal_year) : "";
    if (mIdx >= 0 && mIdx < 12) {
      if (dataYear === '2568') monthlyTotal68[mIdx] += amount;
      if (dataYear === '2569') monthlyTotal69[mIdx] += amount;
    }
  });

  return { totalAmount, platformCards, monthlyTotal, yoyData: { year68: monthlyTotal68, year69: monthlyTotal69 }, rankingList, monthlyByPlatform };
}

const LiveClock = () => {
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString('th-TH'));
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('th-TH')), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl font-bold text-xs">
      <Clock size={16} /><span>{currentTime}</span>
    </div>
  );
};

const SimplePieChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const gradientParts = data.map((item, index, arr) => {
    const start = arr.slice(0, index).reduce((acc, curr) => acc + curr.percent, 0);
    const end = start + item.percent;
    return `${item.color} ${start}% ${end}%`;
  });
  const gradientString = gradientParts.length > 0 ? `conic-gradient(${gradientParts.join(', ')})` : 'bg-slate-200';
  return (
    <div className="flex flex-col xl:flex-row items-center space-y-8 xl:space-y-0 xl:space-x-12">
      <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full shrink-0 shadow-[0_20px_60px_rgba(5,150,105,0.15)] border-4 border-white" style={{ background: gradientString }}>
        <div className="absolute inset-8 bg-white rounded-full flex flex-col items-center justify-center z-10 shadow-inner border border-emerald-50">
          <span className="text-[12px] text-emerald-800/40 font-bold uppercase tracking-wider mb-1">CUP Share</span>
          <span className="text-3xl font-black text-emerald-950 leading-none">{data[0]?.percent || 0}%</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center text-[13px] text-slate-600 group cursor-default">
            <span className="w-3.5 h-3.5 rounded-full mr-3 shrink-0 shadow-sm transition-transform group-hover:scale-125" style={{ backgroundColor: item.color }}></span>
            <span className="font-bold truncate max-w-[100px] md:max-w-none transition-colors group-hover:text-emerald-800">{item.label}</span>
            <span className="font-black ml-3 text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">{item.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const YoYTrendChart = ({ data }) => {
  if (!data || !data.year68 || !data.year69) return null;
  const maxVal = Math.max(...data.year68, ...data.year69, 1000) * 1.1;
  const chartLeft = 40;
  const chartWidth = 560;
  const baseY = 88;
  const makePath = (arr) => arr.map((val, idx) => {
    const x = chartLeft + (idx / 11) * chartWidth;
    const y = baseY - ((val / maxVal) * 80);
    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  const path68 = makePath(data.year68);
  const path69 = makePath(data.year69);

  const yLabels = [0, 0.25, 0.5, 0.75, 1].map(p => ({ value: Math.round(maxVal * p), y: baseY - p * 80 }));
  return (
    <div className="w-full flex flex-col select-none flex-1">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-900 text-white rounded-lg shadow-sm"><Calendar size={18} /></div>
          <h4 className="text-sm font-black text-emerald-900 uppercase tracking-widest">Yearly Trend</h4>
        </div>
        <div className="flex items-center space-x-4 text-[10px] font-black uppercase text-emerald-950">
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span><span className="text-slate-500">ปี 2568</span></div>
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span><span className="text-emerald-700">ปี 2569</span></div>
        </div>
      </div>
      <div className="relative flex flex-1 w-full min-h-[220px] mt-4">
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <div className="relative flex-1 w-full bg-emerald-50/40 rounded-tr-3xl border-t border-r border-emerald-100/30">
            <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 640 110" preserveAspectRatio="none">
              {yLabels.map((label, i) => (
                <g key={i}>
                  <line x1={chartLeft} y1={label.y} x2={chartLeft + chartWidth} y2={label.y} stroke="#d1fae5" strokeWidth="0.5" strokeDasharray="3,3" />
                  <text x={chartLeft - 4} y={label.y + 2} textAnchor="end" fontSize="4" fill="#6b7280" fontWeight="bold">
                    {label.value >= 1000 ? `${(label.value/1000).toFixed(0)}k` : label.value}
                  </text>
                </g>
              ))}
              <line x1={chartLeft} y1={baseY} x2={chartLeft + chartWidth} y2={baseY} stroke="#10b981" strokeWidth="0.8" />
              <line x1={chartLeft} y1={8} x2={chartLeft} y2={baseY} stroke="#10b981" strokeWidth="0.8" />
              <path d={path68} fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4,2" strokeLinecap="round" strokeLinejoin="round" />
              {data.year68.map((val, i) => <circle key={i} cx={chartLeft + (i / 11) * chartWidth} cy={baseY - ((val / maxVal) * 80)} r="2" fill="#94a3b8" />)}
              <path d={path69} fill="none" stroke="#059669" strokeWidth="2.5" strokeDasharray="4,2" strokeLinecap="round" strokeLinejoin="round" />
              <path d={`${path69} L ${chartLeft + chartWidth} ${baseY} L ${chartLeft} ${baseY} Z`} fill="url(#gradGreen)" opacity="0.15" />
              {data.year69.map((val, i) => <circle key={i} cx={chartLeft + (i / 11) * chartWidth} cy={baseY - ((val / maxVal) * 80)} r="2" fill="#059669" />)}
              <defs>
                <linearGradient id="gradGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              {months.map((m, i) => <text key={i} x={chartLeft + (i / 11) * chartWidth} y={baseY + 6} textAnchor="middle" fontSize="4" fill="#065f46" fontWeight="bold">{m}</text>)}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlatformComparisonChart = ({ data }) => {
  const barWidth = 600 / 12 * 0.55;
  const allVals = data.eclaim.map((v, i) => v + data.ktb[i] + data.moph[i]);
  const maxVal = Math.max(...allVals, 1000) * 1.1;
  const baseY = 88;
  const chartLeft = 40;
  const chartWidth = 560;

  const yLabels = [0, 0.25, 0.5, 0.75, 1].map(p => ({ value: Math.round(maxVal * p), y: baseY - p * 80 }));
  return (
    <div className="w-full flex flex-col select-none flex-1 pt-8 mt-4 border-t border-emerald-950/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-900 text-white rounded-lg shadow-sm"><Layers size={18} /></div>
          <h4 className="text-sm font-black text-emerald-900 uppercase tracking-widest">Platform Analysis</h4>
        </div>
        <div className="flex items-center space-x-4 text-[10px] font-black uppercase text-emerald-950">
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]"></span><span>E-Claim</span></div>
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9]"></span><span>KTB</span></div>
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span><span>Moph</span></div>
        </div>
      </div>
      <div className="relative flex flex-1 w-full min-h-[180px]">
        <div className="flex-1 flex flex-col relative overflow-hidden bg-emerald-50/20 rounded-3xl border border-emerald-100/50">
          <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 640 110" preserveAspectRatio="none">
            {yLabels.map((label, i) => (
              <g key={i}>
                <line x1={chartLeft} y1={label.y} x2={chartLeft + chartWidth} y2={label.y} stroke="#d1fae5" strokeWidth="0.5" strokeDasharray="3,3" />
                <text x={chartLeft - 4} y={label.y + 2} textAnchor="end" fontSize="4" fill="#6b7280" fontWeight="bold">
                  {label.value >= 1000 ? `${(label.value/1000).toFixed(0)}k` : label.value}
                </text>
              </g>
            ))}
            <line x1={chartLeft} y1={baseY} x2={chartLeft + chartWidth} y2={baseY} stroke="#10b981" strokeWidth="0.8" />
            <line x1={chartLeft} y1={8} x2={chartLeft} y2={baseY} stroke="#10b981" strokeWidth="0.8" />
            {data.eclaim.map((_, i) => {
              const x = chartLeft + i * (chartWidth / 12) + (chartWidth / 12) * 0.2;
              const bw = barWidth * (chartWidth / 600);
              const eclaimH = (data.eclaim[i] / maxVal) * 80;
              const ktbH = (data.ktb[i] / maxVal) * 80;
              const mophH = (data.moph[i] / maxVal) * 80;
              return (
                <g key={i}>
                  <rect x={x} y={baseY - mophH} width={bw} height={mophH} fill="#f59e0b" opacity="0.85" rx="1" />
                  <rect x={x} y={baseY - mophH - ktbH} width={bw} height={ktbH} fill="#0ea5e9" opacity="0.85" rx="1" />
                  <rect x={x} y={baseY - mophH - ktbH - eclaimH} width={bw} height={eclaimH} fill="#6366f1" opacity="0.85" rx="1" />
                </g>
              );
            })}
            {months.map((m, i) => <text key={i} x={chartLeft + i * (chartWidth / 12) + (chartWidth / 12) * 0.5} y={baseY + 6} textAnchor="middle" fontSize="4" fill="#065f46" fontWeight="bold">{m}</text>)}
          </svg>
        </div>
      </div>
    </div>
  );
};

const LoginScreen = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPulled, setIsPulled] = useState(false);
  const [isLightOn, setIsLightOn] = useState(true);

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
    <div className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans transition-colors duration-1000 ${isPulled ? 'bg-slate-900' : 'bg-[#0a0a0a]'}`}>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-30">
        <div className="w-1.5 h-16 bg-slate-800"></div>
        <div className="w-32 h-12 bg-slate-800 rounded-t-[3rem] relative shadow-lg flex justify-center">
          <div className="absolute top-10 flex flex-col items-center group cursor-pointer" onClick={() => setIsPulled(true)}>
            <div className={`w-0.5 bg-slate-500 transition-all duration-500 origin-top ${isPulled ? 'h-6' : 'h-16 group-active:h-28'}`}></div>
            <div className={`w-4 h-4 bg-slate-500 rounded-full transition-all duration-500 ${isPulled ? 'scale-75' : 'group-active:scale-110'}`}></div>
          </div>
          <div className={`absolute -bottom-3 w-10 h-10 rounded-full transition-all duration-500 ${(isPulled && isLightOn) ? 'bg-emerald-400 shadow-[0_0_40px_15px_rgba(52,211,153,0.6)]' : 'bg-slate-800'}`}></div>
        </div>
      </div>
      {!isPulled && (
        <div className="absolute top-52 text-slate-500 animate-pulse text-sm font-bold tracking-widest z-20 flex flex-col items-center gap-2">
          <span>👇</span><span>คลิกเพื่อเปิดระบบ</span>
        </div>
      )}
      <div className={`bg-white/95 backdrop-blur-sm p-8 sm:p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-20 border border-slate-100 mt-24 transition-all duration-1000 ease-out transform ${isPulled ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-20 opacity-0 scale-95 pointer-events-none'}`}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-emerald-900 mb-2">ClaimCup</h2>
          <p className="text-emerald-600 font-medium">Sankhong Portal</p>
        </div>
        {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold text-center border border-red-100">{errorMsg}</div>}
        <form onSubmit={handleLogin} className="space-y-5">
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="text-gray-900 w-full px-4 py-3 rounded-xl border-2 border-emerald-100 bg-emerald-50/50" placeholder="Username" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-gray-900 w-full px-4 py-3 rounded-xl border-2 border-emerald-100 bg-emerald-50/50" placeholder="Password" required />
          <button type="submit" disabled={isLoading} className="w-full text-white font-bold py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg active:scale-95">
            {isLoading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [filterYear, setFilterYear] = useState('2569');
  const [filterUnit, setFilterUnit] = useState('all');
  
  const [claims, setClaims] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [showExpenseReport, setShowExpenseReport] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('claimcup_user');
    if (savedUser) {
      try { setCurrentUser(JSON.parse(savedUser)); } catch (e) { localStorage.removeItem('claimcup_user'); }
    }
  }, []);

  // ✅ พระเอกของงานนี้: ระบบดึงข้อมูลแบบแยกส่วน พังอันไหน อีกอันยังรอด!
  useEffect(() => {
    const fetchAllData = async () => {
        try {
            // 1. ลองดึงข้อมูลรายรับ (Claims)
            try {
                const resC = await fetch(`${API_BASE_URL}/api/claims`);
                if (resC.ok && resC.headers.get("content-type")?.includes("application/json")) {
                    const dataC = await resC.json();
                    if (Array.isArray(dataC)) setClaims(dataC);
                }
            } catch (err) { console.error("ไม่สามารถดึง Claims ได้:", err); }

            // 2. ลองดึงข้อมูลรายจ่าย (Expenses)
            try {
                const resE = await fetch(`${API_BASE_URL}/api/expenses`);
                if (resE.ok && resE.headers.get("content-type")?.includes("application/json")) {
                    const dataE = await resE.json();
                    if (Array.isArray(dataE)) setExpenses(dataE);
                }
            } catch (err) { console.error("ไม่สามารถดึง Expenses ได้:", err); }

            // 3. ดึงวันที่อัปเดต
            try {
                const resU = await fetch(`${API_BASE_URL}/api/last-updated`);
                if (resU.ok) {
                    const dataU = await resU.json();
                    if (dataU.last_updated) {
                        setLastUpdated(new Date(dataU.last_updated).toLocaleDateString('th-TH', {
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        }));
                    }
                }
            } catch (err) { }

        } finally {
            setLoading(false);
        }
    };
    fetchAllData();
  }, []);

  const selectedHospitalName = useMemo(() => hospitals.find(h => h.id === filterUnit)?.name || 'All Cup', [filterUnit]);

  const { totalAmount, platformCards, yoyData, rankingList, monthlyByPlatform } = useMemo(() => {
      return processData(claims, filterYear, filterUnit);
  }, [claims, filterYear, filterUnit]);

  const expenseReportData = useMemo(() => {
    if (filterUnit !== 'all' && filterUnit !== '05954') return { rows: [], grandTotal: 0, monthlyTotals: Array(12).fill(0) };
    const filtered = expenses.filter(e => filterYear === 'all' || String(e.fiscal_year) === filterYear);
    const grouped = {};
    let grandTotal = 0;
    const monthlyTotals = Array(12).fill(0);
    filtered.forEach(item => {
        const catName = item.category_name || item.category || 'อื่นๆ'; 
        const amt = typeof item.amount === 'number' ? item.amount : parseFloat(String(item.amount).replace(/,/g, '')) || 0;
        const mIdx = monthMapping[String(item.month)] ?? -1;
        if (!grouped[catName]) grouped[catName] = { label: catName, monthlyData: Array(12).fill(0), total: 0 };
        grouped[catName].total += amt;
        grandTotal += amt;
        if (mIdx >= 0 && mIdx < 12) {
            grouped[catName].monthlyData[mIdx] += amt;
            monthlyTotals[mIdx] += amt;
        }
    });
    return { rows: Object.values(grouped).sort((a, b) => b.total - a.total), grandTotal, monthlyTotals };
  }, [expenses, filterYear, filterUnit]);

  const top3ExpenseData = useMemo(() => {
    const colorPalette = ['bg-[#6366f1]', 'bg-[#f59e0b]', 'bg-[#f43f5e]'];
    return expenseReportData.rows.slice(0, 3).map((item, idx) => ({
        label: item.label, value: fmt(item.total),
        percent: expenseReportData.grandTotal > 0 ? Math.round((item.total / expenseReportData.grandTotal) * 100) : 0,
        color: colorPalette[idx % colorPalette.length]
    }));
  }, [expenseReportData]);

  const pieData = useMemo(() => {
      const data = platformCards.filter(p => p.value > 0).map(p => ({
            label: p.title, value: p.value, color: PLATFORM_COLORS[p.key],
            percent: totalAmount > 0 ? Math.round((p.value / totalAmount) * 100) : 0
      })).sort((a,b) => b.value - a.value);
      return data.length > 0 ? data : [{label: 'No Data', value: 1, color: '#e2e8f0', percent: 0}];
  }, [platformCards, totalAmount]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#F4FAF7]"><div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div></div>;
  if (!currentUser) return <LoginScreen onLoginSuccess={setCurrentUser} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-200">
      <div className="flex flex-col h-screen overflow-hidden">
        <header className="h-28 md:h-32 shrink-0 flex items-center justify-between px-4 md:px-10 z-30 border-b border-emerald-200/50 bg-white shadow-sm relative">
          <div className="flex items-center gap-8">
             <div className="flex items-center space-x-6 group cursor-pointer" onClick={() => setSelectedPlatform(null)}>
                <img src="/my-logo.png" alt="โลโก้ รพ.สต." className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white border-2 border-emerald-100 transition-all hover:scale-105 active:scale-95" />
                <div className="flex flex-col justify-center">
                  <h1 className="text-2xl md:text-4xl font-black tracking-tight text-emerald-950 uppercase leading-none">ClaimCup</h1>
                  <p className="text-xs md:text-base text-emerald-800 font-bold uppercase tracking-[0.2em] mt-2">Sankhong Portal</p>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <LiveClock />
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-900 text-white border border-emerald-800 rounded-2xl shadow-lg shadow-emerald-900/10"><CheckCircle2 size={16} className="text-emerald-400" /><span className="text-[10px] font-black uppercase tracking-widest">Public Health Approved</span></div>
            <button onClick={() => { localStorage.removeItem('claimcup_user'); setCurrentUser(null); }} className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 hover:border-red-500 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95">🚪 <span className="hidden sm:inline">ออกจากระบบ</span></button>
          </div>
          {lastUpdated && <span className="absolute bottom-2 right-10 text-[9px] font-bold text-emerald-700/60 tracking-wide">อัพเดทล่าสุด: {lastUpdated}</span>}
        </header>

        <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto custom-scrollbar relative bg-[#F7FBF9]">
          <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-emerald-100/50 to-transparent pointer-events-none -z-10"></div>
          <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-12 pb-12">
            
            <section className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h3 className="text-2xl md:text-5xl font-black text-emerald-950 tracking-tight flex items-center gap-4"><Leaf className="text-emerald-800" size={40} />Health Claim Analytics</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-[10px] md:text-xs text-emerald-800/40 font-bold uppercase tracking-[0.2em]">CUP Sankhong Dashboard</p>
                    <span className="w-1 h-1 rounded-full bg-emerald-200"></span>
                    <p className="text-[10px] md:text-xs text-emerald-900 font-black uppercase tracking-[0.2em] bg-emerald-100 px-2 py-0.5 rounded-md">{filterYear}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-emerald-900/5 p-1.5 rounded-2xl border border-emerald-900/10">
                  {['2568', '2569'].map(year => (
                    <button key={year} onClick={() => setFilterYear(year)} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${filterYear === year ? 'bg-emerald-900 text-white shadow-lg' : 'text-emerald-900/60 hover:bg-emerald-100'}`}>{year}</button>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-emerald-900/10 p-4 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 grid grid-cols-2 md:grid-cols-4 gap-3">
                {hospitals.map(hos => hos.spacer ? <div key={hos.id} className="hidden md:block"></div> : (
                  <button key={hos.id} onClick={() => setFilterUnit(hos.id)} className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm border truncate ${filterUnit === hos.id ? hos.active : hos.inactive}`}>{hos.name}</button>
                ))}
              </div>
            </section>

            <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-emerald-950/40 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
              <div className="relative z-10 w-full lg:w-auto text-center lg:text-left space-y-6">
                <div className="flex items-center justify-center lg:justify-start space-x-3 text-emerald-400 font-black text-[10px] md:text-xs uppercase tracking-[0.5em]"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50"></div><span>Cumulative Health Disbursement</span></div>
                <div className="flex items-baseline justify-center lg:justify-start gap-4"><span className="text-emerald-500/50 text-3xl md:text-6xl font-light">฿</span><h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-none drop-shadow-2xl">{fmt(totalAmount)}</h2></div>
                <p className="text-sm md:text-2xl font-bold text-emerald-100/60 leading-relaxed max-w-xl mx-auto lg:mx-0">ยอดเงินรวมเบิกชดเชยประจำปี {filterYear}</p>
              </div>
              <div className="relative z-10 p-10 md:p-14 bg-white rounded-[4rem] shadow-2xl border-8 border-emerald-950/10"><SimplePieChart data={pieData} /></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              <div className="lg:col-span-8">
                  <div className="bg-white border border-emerald-900/10 rounded-[3.5rem] p-10 md:p-14 shadow-sm h-full flex flex-col hover:shadow-xl transition-all duration-700">
                      <div className="flex items-center gap-6 mb-14">
                          <div className="p-5 bg-emerald-900 rounded-[1.5rem] text-white shadow-lg shadow-emerald-900/20"><Activity size={36} /></div>
                          <div className="flex flex-col">
                              <h3 className="font-black text-3xl text-emerald-950 uppercase tracking-tight leading-none">Financial Surveillance</h3>
                              <p className="text-sm font-bold text-emerald-600 mt-2 flex items-center gap-2"><Building2 size={16} /> หน่วยบริการ: {selectedHospitalName}</p>
                          </div>
                      </div>
                      <div className="flex flex-col flex-1 min-h-[400px] justify-between">
                          <YoYTrendChart data={yoyData} />
                          <PlatformComparisonChart data={monthlyByPlatform} />
                      </div>
                  </div>
              </div>
              
              <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
                  <div className="bg-white border border-emerald-900/10 rounded-[3.5rem] shadow-sm flex flex-col flex-1 min-h-[350px] overflow-hidden hover:shadow-xl transition-all duration-700">
                      <div className="p-8 border-b border-emerald-950/5 flex items-center justify-between bg-emerald-50/50">
                          <div><h3 className="font-black text-xl text-emerald-950 flex items-center gap-4 uppercase tracking-wider"><Trophy className="text-emerald-700" size={28} />Top Units</h3></div>
                      </div>
                      <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                          {rankingList.map((hospital, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-2xl bg-white shadow-sm border border-emerald-50">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm">{index + 1}</div>
                                <div><h4 className="font-bold text-emerald-950 text-sm">{hospital.name}</h4></div>
                              </div>
                              <div className="text-right"><p className="font-black text-emerald-800 text-base">{fmt(hospital.amount)}</p></div>
                            </div>
                          ))}
                      </div>
                  </div>

                  {/* ✅ ส่วนแสดงรายจ่ายที่ปลอดภัยแบบ 100% */}
                  <div className="bg-white border border-emerald-900/10 rounded-[3.5rem] shadow-sm flex flex-col overflow-hidden hover:shadow-xl transition-all duration-700 relative group">
                      <div className="p-8 pb-4 flex items-center justify-between relative z-10">
                          <div>
                              <h3 className="font-black text-xl text-emerald-950 flex items-center gap-3 uppercase tracking-wider"><Wallet className="text-emerald-600" size={28} />Expense Report</h3>
                          </div>
                          <button onClick={() => setShowExpenseReport(true)} className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"><ArrowUpRight size={20} /></button>
                      </div>
                      
                      <div className="p-8 pt-2 relative z-10 flex flex-col flex-1">
                         <div className="space-y-5 flex-1">
                            {top3ExpenseData.length > 0 ? (
                                top3ExpenseData.map((item, idx) => (
                                    <div key={idx} className="group/item">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-xs font-bold text-slate-600">{item.label}</span>
                                            <span className="text-sm font-black text-emerald-950">{item.value} ฿</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                            <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }}></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full py-6 opacity-50">
                                    <Wallet size={36} className="mb-2 text-slate-300" />
                                    <p className="text-sm font-bold text-slate-400">ยังไม่มีข้อมูลรายจ่าย</p>
                                </div>
                            )}
                         </div>
                         {top3ExpenseData.length > 0 && (
                            <button onClick={() => setShowExpenseReport(true)} className="w-full mt-6 flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3 rounded-2xl text-sm font-bold transition-all"><Table2 size={16} /> ดูรายงานฉบับเต็ม</button>
                         )}
                      </div>
                  </div>
              </div>
            </div>

            <section className="py-6 pb-20">
              <div className="bg-white border border-emerald-900/10 rounded-[3.5rem] p-8 md:p-12 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
                  {platformCards.map((card) => {
                    const platformColor = PLATFORM_COLORS[card.key] || "#10B981";
                    return (
                      <div key={card.key} className={`rounded-[2.5rem] p-6 transition-all flex flex-col items-center justify-center text-center`} style={{ backgroundColor: platformColor, boxShadow: `0 20px 40px -10px ${platformColor}80` }}>
                        <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm mb-4"><card.icon size={28} className="text-white" /></div>
                        <h4 className="text-xs font-black text-white/90 uppercase tracking-widest mb-1">{card.title}</h4>
                        <p className="text-xl font-black text-white tracking-tighter drop-shadow-md">{fmt(card.value)} <span className="text-[10px] font-bold opacity-70">บาท</span></p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      {/* MODAL REPORT 12 เดือน */}
      {showExpenseReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 sm:p-6 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-[1200px] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-8 py-6 border-b border-emerald-100/50 flex justify-between items-center bg-emerald-50/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-600 text-white rounded-2xl"><List size={24} /></div>
                        <div>
                            <h3 className="font-black text-emerald-950 text-xl uppercase">รายงานสรุปค่าใช้จ่ายแยกรายเดือน</h3>
                        </div>
                    </div>
                    <button onClick={() => setShowExpenseReport(false)} className="text-slate-400 hover:text-rose-500 text-2xl font-black">&times;</button>
                </div>
                <div className="p-8 overflow-auto custom-scrollbar flex-1">
                    <table className="w-full min-w-[1000px] text-left border-collapse border-separate border-spacing-y-1">
                        <thead>
                            <tr className="bg-emerald-50 text-emerald-800 text-[11px] font-black uppercase">
                                <th className="p-4 py-3 sticky left-0 z-20 bg-emerald-50">หมวดหมู่รายการจ่าย</th>
                                {months.map((m, i) => <th key={i} className="p-4 py-3 text-right">{m}</th>)}
                                <th className="p-4 py-3 text-right">รวมทั้งสิ้น</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-50/50">
                            {expenseReportData.rows.length > 0 ? expenseReportData.rows.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="p-4 py-3 text-sm text-slate-700 font-bold sticky left-0 z-10 bg-white">{idx + 1}. {item.label}</td>
                                    {item.monthlyData.map((val, mIdx) => <td key={mIdx} className="p-4 py-3 text-[12px] text-slate-500 text-right">{val > 0 ? fmt(val) : '-'}</td>)}
                                    <td className="p-4 py-3 text-sm text-emerald-900 font-black text-right bg-emerald-50/30">{fmt(item.total)}</td>
                                </tr>
                            )) : <tr><td colSpan="14" className="text-center py-10 text-slate-400">ไม่มีข้อมูล</td></tr>}
                        </tbody>
                        {expenseReportData.rows.length > 0 && (
                            <tfoot>
                                <tr className="bg-emerald-600 text-white">
                                    <td className="p-4 py-4 text-sm font-bold text-right sticky left-0 z-20 bg-emerald-600">รวมทุกหมวดหมู่</td>
                                    {expenseReportData.monthlyTotals.map((total, i) => <td key={i} className="p-4 py-4 text-[12px] font-bold text-right">{total > 0 ? fmt(total) : '-'}</td>)}
                                    <td className="p-4 py-4 text-base font-black text-right bg-emerald-700">{fmt(expenseReportData.grandTotal)}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
                <div className="px-8 py-5 border-t border-emerald-100/50 bg-slate-50 flex justify-end gap-3">
                    <button onClick={() => setShowExpenseReport(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-xl">ปิด</button>
                    <button onClick={() => window.print()} className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl flex items-center gap-2"><Table2 size={18} />พิมพ์รายงาน</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}