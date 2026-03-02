"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  DollarSign, Activity, Trophy, Syringe, Baby,
  Flower, Scan, HeartPulse, Monitor,
  TrendingUp, Stethoscope, ArrowUpRight, ArrowLeft,
  Calendar, Bell, Plus, Clock, Building2, ShieldCheck, CheckCircle2,
  Layers, Leaf, List, Table2
} from 'lucide-react';

// --- CONFIGURATION ---
const PLATFORM_COLORS = {
  eclaim: "#6366f1",
  ktb: "#0ea5e9",
  moph: "#f59e0b",
  thai: "#10b981",
  ntip: "#8b5cf6",
  physical: "#f43f5e",
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

// --- LOGIC: REAL DATA PROCESSING ---
function processData(claims, yearFilter, unitFilter) {
  // ในฟังก์ชัน processData
const filtered = claims.filter(c => {
  const dataYear = c.fiscal_year ? String(c.fiscal_year) : "";
  const dataUnit = c.hcode || "";
  const matchYear = yearFilter === 'all' || dataYear === yearFilter;

  // ✅ เพิ่มเงื่อนไขเช็คว่าเป็น 'กายภาพบำบัด' หรือไม่
  const isPhysical = c.platform && c.platform.toLowerCase() === 'physical';

  let matchUnit;
  if (isPhysical) {
    // ถ้าเป็นกายภาพบำบัด ให้นับข้อมูลก็ต่อเมื่อเลือกหน่วยงานเป็น 'all' (All Cup) เท่านั้น
    matchUnit = (unitFilter === 'all');
  } else {
    // แพลตฟอร์มอื่นๆ กรองตามหน่วยงานที่เลือกตามปกติ
    matchUnit = (unitFilter === 'all' || dataUnit === unitFilter);
  }

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
      
      // ✅ สร้างที่เก็บข้อมูลแยกเป็นรายเดือน ให้ตารางของคุณโอ
      if (!platformItems[pKey][serviceName]) {
          platformItems[pKey][serviceName] = { total: 0, monthlyData: Array(12).fill(0) };
      }
      platformItems[pKey][serviceName].total += amount;
      
      if (mIdx >= 0 && mIdx < 12) {
          platformItems[pKey][serviceName].monthlyData[mIdx] += amount;
      }
    }

    if (mIdx >= 0 && mIdx < 12) {
        monthlyTotal[mIdx] += amount;
        if (['eclaim', 'ktb', 'moph'].includes(pKey)) {
            monthlyByPlatform[pKey][mIdx] += amount;
        }
    }
  });

  const platformCards = [
    { key: 'eclaim', title: "E-Claim", icon: Monitor },
    { key: 'ktb', title: "KTB", icon: Syringe },
    { key: 'moph', title: "Moph-Claim", icon: Baby },
    { key: 'thai', title: "แพทย์แผนไทย", icon: Flower },
    { key: 'ntip', title: "NTIP", icon: Scan },
    { key: 'physical', title: "กายภาพบำบัด", icon: HeartPulse },
  ].map(p => ({
    ...p,
    value: platformStats[p.key] || 0,
    items: Object.entries(platformItems[p.key] || {})
      .map(([name, data]) => ({ 
          name, 
          value: data.total, 
          monthlyData: data.monthlyData 
      }))
      .sort((a, b) => b.value - a.value)
  }));

const rankingMap = {};
claims.filter(c => (yearFilter === 'all' || String(c.fiscal_year) === yearFilter)).forEach(c => {
  
  // ✅ เพิ่มบรรทัดนี้: ข้ามข้อมูลของกายภาพบำบัด ไม่นำมาคิดรวมในยอดจัดอันดับราย รพ.สต.
  if (c.platform && c.platform.toLowerCase() === 'physical') return;

  const h = hospitals.find(x => x.id === c.hcode);
  const hName = h ? h.name : (c.hcode || "Unknown");

  if (hName === "All Cup") return;
  if (!rankingMap[hName]) rankingMap[hName] = { amount: 0, cases: 0 };

  let amt = typeof c.amount === 'number' ? c.amount : (parseFloat(String(c.amount).replace(/,/g,''))||0);

  rankingMap[hName].amount += amt;
  rankingMap[hName].cases += 1;
});
  
  const rankingList = Object.entries(rankingMap)
    .map(([name, data]) => ({ name, ...data, trend: "LIVE" }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // ✅ 1. โค้ดส่วนที่คำนวณกราฟเปรียบเทียบ 2 ปี
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

  // ✅ 2. Return ตัวใหม่ที่มี yoyData 
  return { 
    totalAmount, 
    platformCards, 
    monthlyTotal, 
    yoyData: { year68: monthlyTotal68, year69: monthlyTotal69 }, 
    rankingList, 
    monthlyByPlatform 
  };
} // <-- จบฟังก์ชัน processData ตรงนี้ (มีปีกกาปิดแค่อันเดียวครับ)

// --- UI SUB-COMPONENTS ---

// --- UI SUB-COMPONENTS ---

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

  // หาค่า Max จากทั้ง 2 ปี เพื่อให้กราฟไม่ทะลุกรอบ
  const maxVal = Math.max(...data.year68, ...data.year69, 1000) * 1.1;
  
  const makePath = (arr) => `M ` + arr.map((val, idx) => {
      const x = (idx / 11) * 600; 
      const y = 100 - ((val / maxVal) * 80); 
      return `${x} ${y}`;
  }).join(' L ');

  const path68 = makePath(data.year68);
  const path69 = makePath(data.year69);

  return (
    <div className="w-full flex flex-col select-none flex-1">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-900 text-white rounded-lg shadow-sm"><Calendar size={18} /></div>
            <h4 className="text-sm font-black text-emerald-900 uppercase tracking-widest">Yearly Trend</h4>
        </div>
        {/* ✅ เพิ่มป้ายบอกสี 2 ปี */}
        <div className="flex items-center space-x-4 text-[10px] font-black uppercase text-emerald-950">
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span><span className="text-slate-500">ปี 2568</span></div>
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span><span className="text-emerald-700">ปี 2569</span></div>
        </div>
      </div>
      <div className="relative flex flex-1 w-full min-h-[220px] mt-4">
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <div className="relative flex-1 w-full bg-emerald-50/40 rounded-tr-3xl border-t border-r border-emerald-100/30">
             <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-4 px-4">
                 {[...Array(5)].map((_, i) => <div key={i} className="w-full border-t border-dashed border-emerald-200/50 h-0"></div>)}
             </div>
             <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 600 100" preserveAspectRatio="none">
                {/* ✅ เส้นปี 68 (สีเทา เส้นประ) */}
                <path d={path68} fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="6,4" strokeLinecap="round" strokeLinejoin="round" />
                {/* ✅ เส้นปี 69 (สีเขียวทึบ) */}
                <path d={path69} fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d={`${path69} L 600 100 L 0 100 Z`} fill="url(#gradGreen)" opacity="0.2" />
                <defs>
                   <linearGradient id="gradGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                       <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                       <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                   </linearGradient>
                </defs>
             </svg>
          </div>
          <div className="flex justify-between w-full pt-3 px-4 text-[10px] font-black text-emerald-950 tracking-tighter bg-emerald-50/20 backdrop-blur-sm">
            {months.map((m, i) => <span key={i}>{m}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
};

const PlatformComparisonChart = ({ data }) => {
  const allVals = [...data.eclaim, ...data.ktb, ...data.moph];
  const maxVal = Math.max(...allVals, 1000) * 1.1;

  const makePath = (arr) => {
     if(!arr || arr.length === 0) return "";
     return `M ` + arr.map((val, idx) => {
        const x = (idx / 11) * 600;
        const y = 100 - ((val / maxVal) * 80);
        return `${x} ${y}`;
     }).join(' L ');
  };

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
            <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 600 100" preserveAspectRatio="none">
              <path d={makePath(data.eclaim)} fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d={makePath(data.ktb)} fill="none" stroke="#0ea5e9" strokeWidth="3.5" strokeDasharray="6,4" strokeLinecap="round" strokeLinejoin="round" />
              <path d={makePath(data.moph)} fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
         </div>
      </div>
    </div>
  );
};

// ✅ เปลี่ยนเป็นดีไซน์ตารางรายเดือนของคุณโอ 100%
const PlatformDetailView = ({ platform, onBack, claims, filterYear }) => {
  const platformColor = PLATFORM_COLORS[platform.key] || "#10B981";
  const subItems = platform.items || [];
  
 const topPlatformUnits = useMemo(() => {
  // ✅ เพิ่มบรรทัดนี้: ถ้าเป็นหน้ากายภาพบำบัด ไม่ต้องจัดอันดับหน่วยงาน (คืนค่า Array ว่างไปเลย)
  if (platform.key === 'physical') return [];

  const map = {};
  claims.forEach(c => {
    if (c.platform?.toLowerCase() === platform.key && (filterYear === 'all' || String(c.fiscal_year) === filterYear)) {
      const h = hospitals.find(x => x.id === c.hcode);
              const hName = h ? h.name : c.hcode;
              if (hName === "All Cup" || !hName) return;
              if (!map[hName]) map[hName] = { amount: 0, cases: 0 };
// แก้ไขบรรทัดนี้ให้แปลง String ที่มีลูกน้ำเป็น Number ได้
map[hName].amount += (typeof c.amount === 'number' ? c.amount : (parseFloat(String(c.amount).replace(/,/g, '')) || 0));
map[hName].cases += 1;
          }
      });
      return Object.entries(map)
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5); 
  }, [claims, platform.key, filterYear]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white border border-emerald-100 rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 text-slate-400 transition-all shadow-sm group">
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white border border-emerald-100 shadow-sm">
                <platform.icon size={24} style={{ color: platformColor }} />
              </div>
              <h2 className="text-3xl font-black text-emerald-950 uppercase tracking-tight">{platform.title} Details</h2>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-emerald-100 shadow-sm">
           <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Amount</p>
              <p className="text-2xl font-black tracking-tight leading-none" style={{ color: platformColor }}>{platform.value.toLocaleString()} <span className="text-sm text-slate-400">บาท</span></p>
           </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-4">
           <List size={20} className="text-slate-400" />
           <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Service Overview</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subItems.map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-[2rem] border border-emerald-50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full group">
               <div className="mb-3">
                  <p className="text-xs font-bold text-slate-500 group-hover:text-emerald-700 transition-colors line-clamp-2">{item.name}</p>
               </div>
               <div className="flex items-end justify-between">
                  <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <Activity size={16} />
                  </div>
                  <p className="text-lg font-black text-emerald-950">{item.value.toLocaleString()} <span className="text-[10px] text-slate-400 font-bold">บาท</span></p>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ เลย์เอาต์เดิมของคุณโอ กลับมาแล้วครับ! */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Breakdown Table */}
        <div className="lg:col-span-2 bg-white border border-emerald-100 rounded-[3rem] p-8 shadow-sm flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-emerald-100 text-emerald-800 rounded-2xl shadow-sm"><Table2 size={32} /></div>
                <div><h3 className="text-2xl md:text-3xl font-black text-emerald-950 tracking-tight">Monthly Breakdown</h3><p className="text-xs font-bold text-emerald-900/40 uppercase tracking-[0.2em] mt-2">Detailed Monthly Disbursement</p></div>
              </div>
           </div>
           <div className="overflow-x-auto custom-scrollbar">
             <table className="w-full min-w-[900px] border-separate border-spacing-y-2">
               <thead>
                 <tr>
                   <th className="text-left py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider bg-slate-50/50 rounded-l-2xl sticky left-0 z-10">รายการบริการ</th>
                   {months.map((m, i) => <th key={i} className="text-right py-4 px-3 text-[11px] font-black uppercase bg-slate-50/50" style={{ color: platformColor }}>{m}</th>)}
                   <th className="text-right py-4 px-6 text-xs font-black text-slate-700 uppercase bg-emerald-50/50 rounded-r-2xl">Total</th>
                 </tr>
               </thead>
               <tbody>
                 {subItems.map((item, idx) => (
                   <tr key={idx} className="group hover:scale-[1.005] transition-transform">
                     <td className="py-5 px-6 bg-white border-y border-l border-slate-100 rounded-l-2xl text-sm font-bold text-slate-700 sticky left-0 z-10 shadow-sm">{item.name}</td>
                     {item.monthlyData?.map((amount, mIdx) => <td key={mIdx} className="py-5 px-3 bg-white border-y border-slate-100 text-right text-[12px] font-medium text-slate-500 group-hover:text-emerald-900 group-hover:font-bold transition-colors">{amount.toLocaleString()}</td>)}
                     <td className="py-5 px-6 bg-emerald-50/30 border-y border-r border-emerald-100 rounded-r-2xl text-right text-sm font-black text-emerald-950 shadow-sm">{item.value.toLocaleString()}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Hospital Breakdown List with Ranking Numbers */}
        <div className="lg:col-span-1 bg-white border border-emerald-100 rounded-[3.5rem] p-10 shadow-sm flex flex-col">
           <h3 className="font-black text-xl text-emerald-950 mb-8 flex items-center gap-3">
              <Building2 size={24} className="text-slate-400" />
              Top Units Share
           </h3>
           <div className="space-y-4 overflow-y-auto flex-1 custom-scrollbar pr-2">
              {topPlatformUnits.length > 0 ? topPlatformUnits.map((hos, idx) => (
                 <div key={idx} className="flex items-center p-5 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-emerald-200 transition-all hover:translate-x-1 gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm shrink-0">{idx + 1}</div>
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-slate-700 truncate">{hos.name}</p>
                       <p className="text-[11px] font-bold text-slate-400 mt-1">{hos.cases} Cases</p>
                    </div>
                    <div className="text-right shrink-0">
                       <p className="text-base font-black text-emerald-900">{hos.amount.toLocaleString()}</p>
                       <p className="text-[10px] font-bold text-slate-400">บาท</p>
                    </div>
                 </div>
              )) : <p className="text-sm text-slate-400 text-center mt-10">ยังไม่มีข้อมูล</p>}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APPLICATION ---
// --- หน้าต่าง Login (UI) ---
const LoginScreen = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // ✅ ซ่อมแล้ว: ให้ส่ง Username / Password ไปเช็คที่ /api/login
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // <--- ต้องมีบรรทัดนี้ครับ
        },
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
      setErrorMsg('ไม่สามารถเชื่อมต่อระบบหลังบ้านได้');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-emerald-900/10 w-full max-w-md border border-emerald-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-emerald-900 flex items-center justify-center shadow-xl shadow-emerald-900/20 mb-4">
            <Stethoscope className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-black text-emerald-950 tracking-tight">ClaimCup</h1>
          <p className="text-emerald-700 font-bold tracking-widest text-sm uppercase mt-1">Sankhong Portal</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold mb-6 text-center border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-emerald-900 text-sm font-bold mb-2">ชื่อผู้ใช้งาน (Username)</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="text-gray-900 w-full px-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-500 focus:outline-none bg-emerald-50/50"
              placeholder="กรอกชื่อผู้ใช้งาน"
              required
            />
          </div>
          <div>
            <label className="block text-emerald-900 text-sm font-bold mb-2">รหัสผ่าน (Password)</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="text-gray-900 w-full px-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-500 focus:outline-none bg-emerald-50/50"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-600/30 active:scale-95 flex justify-center items-center mt-2"
          >
            {isLoading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); 
  
  // ฟังก์ชันสำหรับกดปุ่มออกจากระบบ
  const handleLogout = () => {
    localStorage.removeItem('claimcup_user'); 
    setCurrentUser(null); 
  };
  
  const [currentTime, setCurrentTime] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [filterYear, setFilterYear] = useState('2569');
  const [filterUnit, setFilterUnit] = useState('all');
  
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('claimcup_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser)); 
      } catch (e) {
        console.error("ล้างข้อมูลที่พังทิ้ง");
        localStorage.removeItem('claimcup_user');
      }
    }
  }, []);
  
  const selectedHospitalName = useMemo(() => {
    const hos = hospitals.find(h => h.id === filterUnit);
    return hos ? hos.name : 'All Cup';
  }, [filterUnit]);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString('th-TH'));
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('th-TH')), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchClaimsData = async () => {
        try {
           // ตรงดึงข้อมูลกราฟ (บรรทัดแถวๆ 161)
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/claims`);
            
            const data = await response.json();
            
            if (Array.isArray(data)) {
                setClaims(data); 
            } else {
                console.error("ข้อมูลผิดปกติ ไม่ใช่ Array:", data);
                setClaims([]); 
            }
            
            setLoading(false);
        } catch (e) {
            console.error("API Error:", e);
            setClaims([]); 
            setLoading(false);
        }
    };
    fetchClaimsData();
  }, []);

  const { totalAmount, platformCards, yoyData, rankingList, monthlyByPlatform } = useMemo(() => {
      return processData(claims, filterYear, filterUnit);
  }, [claims, filterYear, filterUnit]);

  const pieData = useMemo(() => {
      const data = platformCards
        .filter(p => p.value > 0)
        .map(p => ({
            label: p.title,
            value: p.value,
            color: PLATFORM_COLORS[p.key],
            percent: totalAmount > 0 ? Math.round((p.value / totalAmount) * 100) : 0
        }))
        .sort((a,b) => b.value - a.value);
      return data.length > 0 ? data : [{label: 'No Data', value: 1, color: '#e2e8f0', percent: 0}];
  }, [platformCards, totalAmount]);

  const handleBack = () => setSelectedPlatform(null);

  if (loading) {
      return (
          <div className="h-screen flex items-center justify-center bg-[#F4FAF7]">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                  <p className="text-emerald-800 font-bold animate-pulse">กำลังโหลดข้อมูล...</p>
              </div>
          </div>
      );
  }

  if (!currentUser) {
      return <LoginScreen onLoginSuccess={(user) => {
          localStorage.setItem('claimcup_user', JSON.stringify(user)); 
          setCurrentUser(user); 
      }} />;
  }

  return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Kanit:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Plus Jakarta Sans', 'Kanit', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #064e3b; border-radius: 10px; }
      `}</style>

      <div className="flex flex-col h-screen overflow-hidden">
     {/* Header - ขยายความสูงเป็น md:h-32 เพื่อให้มีที่วางโลโก้ใหญ่ๆ */}
        <header className="h-28 md:h-32 shrink-0 flex items-center justify-between px-4 md:px-10 z-30 border-b border-emerald-200/50 bg-white shadow-sm">
          
          {/* ฝั่งซ้าย: โลโก้ รพ.สต. และชื่อ ClaimCup */}
          <div className="flex items-center gap-8">
             <div className="flex items-center space-x-6 group cursor-pointer" onClick={handleBack}>
                {/* โลโก้: ขนาดใหญ่สะใจ md:w-24 md:h-24 พร้อมเงาหนาขึ้น */}
                <img 
                  src="/my-logo.png" 
                  alt="โลโก้ รพ.สต." 
                  className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white border-2 border-emerald-100 transition-all hover:scale-105 active:scale-95" 
                />
                <div className="flex flex-col justify-center">
                  {/* ขยายตัวหนังสือให้ใหญ่ขึ้นรับกับโลโก้ */}
                  <h1 className="text-2xl md:text-4xl font-black tracking-tight text-emerald-950 uppercase leading-none">ClaimCup</h1>
                  <p className="text-xs md:text-base text-emerald-800 font-bold uppercase tracking-[0.2em] mt-2">Sankhong Portal</p>
                </div>
             </div>
          </div>
          
          {/* ฝั่งขวา: นาฬิกา + ป้ายสถานะ + ปุ่มออกจากระบบ */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl font-bold text-xs">
                <Clock size={16} /><span>{currentTime}</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-900 text-white border border-emerald-800 rounded-2xl shadow-lg shadow-emerald-900/10">
                 <CheckCircle2 size={16} className="text-emerald-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Public Health Approved</span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 hover:border-red-500 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95"
              >
                🚪 <span className="hidden sm:inline">ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto custom-scrollbar relative bg-[#F7FBF9]">
          <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-emerald-100/50 to-transparent pointer-events-none -z-10"></div>
          
          <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-12 pb-12">
            {selectedPlatform ? (
              <PlatformDetailView platform={selectedPlatform} onBack={handleBack} claims={claims} filterYear={filterYear} />
            ) : (
              <>
                {/* --- FILTER SECTION --- */}
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
                    {/* Year Quick Selector */}
                    <div className="flex items-center gap-2 bg-emerald-900/5 p-1.5 rounded-2xl border border-emerald-900/10">
                      {['2568', '2569'].map(year => (
                        <button key={year} onClick={() => setFilterYear(year)} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${filterYear === year ? 'bg-emerald-900 text-white shadow-lg' : 'text-emerald-900/60 hover:bg-emerald-100'}`}>{year}</button>
                      ))}
                    </div>
                  </div>

                  {/* Hospital Buttons */}
                  <div className="bg-white border border-emerald-900/10 p-4 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {hospitals.map(hos => (
                      hos.spacer ? (
                        <div key={hos.id} className="hidden md:block"></div>
                      ) : (
                        <button
                          key={hos.id}
                          onClick={() => setFilterUnit(hos.id)}
                          className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm border truncate ${
                            filterUnit === hos.id 
                            ? hos.active 
                            : hos.inactive
                          }`}
                        >
                          {hos.name}
                        </button>
                      )
                    ))}
                  </div>
                </section>

                {/* --- HERO SUMMARY --- */}
                <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-emerald-950/40 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group">
                  <div className="relative z-10 w-full lg:w-auto text-center lg:text-left space-y-6">
                    <div className="flex items-center justify-center lg:justify-start space-x-3 text-emerald-400 font-black text-[10px] md:text-xs uppercase tracking-[0.5em]"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50"></div><span>Cumulative Health Disbursement</span></div>
                    <div className="flex items-baseline justify-center lg:justify-start gap-4"><span className="text-emerald-500/50 text-3xl md:text-6xl font-light">฿</span><h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-none drop-shadow-2xl">{totalAmount.toLocaleString()}</h2></div>
                    <p className="text-sm md:text-2xl font-bold text-emerald-100/60 leading-relaxed max-w-xl mx-auto lg:mx-0">ยอดเงินรวมเบิกชดเชยประจำปี {filterYear}</p>
                    <div className="pt-6 flex justify-center lg:justify-start gap-4">
                      <div className="px-8 py-4 bg-emerald-400/10 text-emerald-400 rounded-[2rem] border border-emerald-400/20 text-sm md:text-base font-black flex items-center gap-3 backdrop-blur-md transition-all hover:bg-emerald-400/20 shadow-inner">
                        <Building2 size={24} />
                        <span>{selectedHospitalName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10 p-10 md:p-14 bg-white rounded-[4rem] shadow-2xl border-8 border-emerald-950/10"><SimplePieChart data={pieData} /></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12">
                  <div className="lg:col-span-8">
                      <div className="bg-white border border-emerald-900/10 rounded-[3.5rem] p-10 md:p-14 shadow-sm h-full flex flex-col hover:shadow-xl transition-all duration-700">
                          <div className="flex items-center gap-6 mb-14">
                              <div className="p-5 bg-emerald-900 rounded-[1.5rem] text-white shadow-lg shadow-emerald-900/20"><Activity size={36} /></div>
                              <div className="flex flex-col">
                                  <h3 className="font-black text-3xl text-emerald-950 uppercase tracking-tight leading-none">Financial Surveillance</h3>
                                  <p className="text-sm font-bold text-emerald-600 mt-2 flex items-center gap-2">
                                  <Building2 size={16} /> ข้อมูลของหน่วยบริการ: {selectedHospitalName}
                                  </p>
                              </div>
                          </div>
                          <div className="flex flex-col flex-1 min-h-[400px] justify-between">
                              <YoYTrendChart data={yoyData} />
                              <PlatformComparisonChart data={monthlyByPlatform} />
                          </div>
                      </div>
                  </div>
                  
                  {/* Ranking Section */}
                  <div className="lg:col-span-4">
                      <div className="bg-white border border-emerald-900/10 rounded-[3.5rem] shadow-sm flex flex-col h-full overflow-hidden hover:shadow-xl transition-all duration-700">
                          <div className="p-10 border-b border-emerald-950/5 flex items-center justify-between bg-emerald-950/[0.02]">
                              <div><h3 className="font-black text-xl text-emerald-950 flex items-center gap-4 uppercase tracking-wider"><Trophy className="text-emerald-900" size={32} fill="currentColor" />Top Units</h3></div>
                              <span className="text-[11px] font-black text-emerald-900/40 uppercase tracking-widest bg-emerald-900/5 px-3 py-1.5 rounded-xl">THB</span>
                          </div>
                          <div className="p-8 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                              {rankingList.map((hospital, index) => (
  <div key={index} className="flex items-center justify-between p-3 rounded-2xl bg-white shadow-sm border border-emerald-50 hover:border-emerald-200 transition-all group">
    
    {/* ส่วนที่ 1: ลำดับและชื่อ */}
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-sm shadow-inner">
        {index + 1}
      </div>
      <div>
        <h4 className="font-bold text-emerald-900 text-sm group-hover:text-emerald-700 transition-colors">
          {hospital.name}
        </h4>
        <p className="text-xs text-emerald-600/70 font-medium">
          {hospital.cases} CASES
        </p>
      </div>
    </div>

    {/* ส่วนที่ 2: จำนวนเงิน (ฝั่งขวา) */}
    <div className="text-right">
      <p className="font-black text-emerald-700 text-base">
        {hospital.amount ? hospital.amount.toLocaleString() : "0"} ฿
      </p>
    </div>

  </div>
))}
                          </div>
                      </div>
                  </div>
                </div>

                <section className="py-6 pb-20">
                  <div className="bg-white border border-emerald-900/10 rounded-[3.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden hover:shadow-xl transition-all duration-700">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10"><div className="flex items-center gap-5"><div className="p-4 bg-emerald-100 text-emerald-800 rounded-2xl shadow-sm"><Layers size={32} /></div><div><h3 className="text-2xl md:text-3xl font-black text-emerald-950 tracking-tight">Service Platform Breakdown</h3><p className="text-xs font-bold text-emerald-900/40 uppercase tracking-[0.2em] mt-2">Analytical Overview by System</p></div></div></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 relative z-10">
                      {platformCards.map((card) => {
                        const platformColor = PLATFORM_COLORS[card.key] || "#10B981";
                        return (
                          <div 
                            key={card.key}
                            onClick={() => setSelectedPlatform(card)}
                            className={`rounded-[2.5rem] p-6 transition-all flex flex-col items-center justify-center text-center cursor-pointer group h-full relative overflow-hidden active:scale-95`}
                            style={{ 
                              backgroundColor: platformColor,
                              boxShadow: `0 20px 40px -10px ${platformColor}80` 
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-white/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm mb-4 group-hover:bg-white group-hover:text-current transition-colors shadow-inner"><card.icon size={28} className="text-white group-hover:text-current" style={{ color: 'inherit' }} /></div>
                            <h4 className="text-xs font-black text-white/90 uppercase tracking-widest mb-1">{card.title}</h4>
                            <p className="text-xl font-black text-white tracking-tighter drop-shadow-md">{card.value.toLocaleString()} <span className="text-[10px] font-bold opacity-70">บาท</span></p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
      <button className="fixed bottom-8 right-8 md:bottom-14 md:right-14 w-18 h-18 md:w-24 md:h-24 bg-emerald-900 text-white rounded-[2.5rem] shadow-[0_30px_70px_rgba(6,78,59,0.3)] flex items-center justify-center z-40 hover:scale-110 active:scale-95 hover:rotate-90 transition-all duration-500 border-4 border-white"><Plus size={40} /></button>
    </div>
  );
}

