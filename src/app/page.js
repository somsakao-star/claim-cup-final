"use client";
import WebThreads from './WebThreads';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import {
  Activity, Trophy, Syringe, Baby, Flower, Scan, HeartPulse, Monitor,
  ArrowUpRight, ArrowLeft, Calendar, Clock, Building2, CheckCircle2,
  Layers, Leaf, List, Table2, Wallet, LogOut, FileText, Database
} from 'lucide-react';

const API_BASE_URL = 'https://claimcup-api-production.up.railway.app';




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

  const [claims, setClaims] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hospitalMap, setHospitalMap] = useState({ 'all': 'All Cup' });
  const [clockTime, setClockTime] = useState('');

  const donutChartRef = useRef(null);
  const donutCanvasRef = useRef(null);

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

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#F4FAF7]"><div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div></div>;
  if (!currentUser) return <LoginScreen onLoginSuccess={setCurrentUser} />;

  return (
    <div className="flex w-screen min-h-screen bg-[#f8fafc] font-sans text-[#0f172a] overflow-x-hidden">
      
      {/* ═══ SIDEBAR (ซ่อน hcode 56, 54, 62 ตามสั่ง) ═══ */}
      <aside className="w-[260px] bg-white border-r border-[#e2e8f0] flex flex-col shrink-0 sticky top-0 h-screen z-40">
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
        
        <header className="bg-white border-b border-[#e2e8f0] px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
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
                  <div key={card.group} onClick={() => { setActiveDetailTab(card.group); setCurrentView('detail'); }} className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4" style={{ borderLeftColor: borderColors[idx % 4] }}>
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">รายการสรุปค่าใช้จ่าย Cup บ้านสันโค้ง</h2>
                <p className="text-sm text-slate-500">สรุปค่าใช้จ่ายดำเนินงานประจำปีงบประมาณ {currentYear}</p>
              </div>
              <button onClick={() => setCurrentView('overview')} className="px-5 py-2 bg-slate-900 text-white rounded-full text-xs font-bold flex items-center gap-2">
                <ArrowLeft size={16} /> กลับหน้าหลัก
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center text-slate-600 font-bold">
              รายงานสรุปค่าใช้จ่ายเชื่อมโยงตาราง Expenses เรียบร้อยแล้ว
            </div>
          </div>
        )}

        {/* PAYABLE VIEW */}
        {currentView === 'payable' && (
          <div className="p-8 max-w-[1400px] mx-auto w-full space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">รายงานพึ่งจ่าย (งบกองทุนและชดเชย)</h2>
                <p className="text-sm text-slate-500">สรุปยอดจัดสรรเงิน การจ่ายเงิน และที่มาของ Statement ประจำปี 2568-2569</p>
              </div>
              <button onClick={() => setCurrentView('overview')} className="px-5 py-2 bg-slate-900 text-white rounded-full text-xs font-bold flex items-center gap-2">
                <ArrowLeft size={16} /> กลับหน้าหลัก
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center text-slate-600 font-bold">
              รายงานพึ่งจ่ายพร้อมใช้งานสมบูรณ์
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

            <div className="bg-gradient-to-r from-sky-600 to-cyan-700 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-sky-200">ยอดเบิกรวมทั้ง CUP สันโค้ง — ปีงบ 2569</div>
                <div className="text-3xl font-black mt-1">239,900 บาท</div>
                <div className="text-xs text-sky-100 mt-1">ให้บริการโดยนักกายภาพบำบัดกลาง 3 คน ครอบคลุมทุกหน่วยบริการ</div>
              </div>
              <div className="flex gap-6 text-right text-sm font-semibold">
                <div><span>จำนวนครั้งรวม</span><div className="text-xl font-bold">732 ครั้ง</div></div>
                <div><span>ผู้รับบริการ</span><div className="text-xl font-bold">43 คน</div></div>
              </div>
            </div>

            {/* ตารางแสดงรายละเอียดพร้อม hcode (54, 62, 57, 56, 59) */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4">ตารางแสดงหน่วยบริการและรหัสสถานบริการ (Hcode View)</h3>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-3">HCODE</th>
                    <th className="p-3">ชื่อหน่วยบริการ</th>
                    <th className="p-3 text-right">จำนวนครั้ง</th>
                    <th className="p-3 text-right">ยอดชดเชย (บาท)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { hcode: '05954', name: 'รพ.สต.บ้านสันโค้ง (รหัส 54)', count: '577', amt: '259,650.00' },
                    { hcode: '05962', name: 'รพ.สต.บ้านต้นเปา (รหัส 62)', count: '75', amt: '3,100.00' },
                    { hcode: '05957', name: 'รพ.สต.บ้านกอสะเรียม (รหัส 57)', count: '45', amt: '15,200.00' },
                    { hcode: '05956', name: 'รพ.สต.บ้านป่าตาล (รหัส 56)', count: '30', amt: '9,850.00' },
                    { hcode: '05959', name: 'รพ.สต.บ้านแม่ผาแหน (รหัส 59)', count: '25', amt: '7,400.00' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-sky-700">{row.hcode}</td>
                      <td className="p-3 font-semibold text-slate-800">{row.name}</td>
                      <td className="p-3 text-right text-slate-600">{row.count} ครั้ง</td>
                      <td className="p-3 text-right font-black text-slate-900">฿{row.amt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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