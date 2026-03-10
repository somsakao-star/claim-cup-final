import { useState, useMemo } from "react";
import { Trophy, DollarSign, ArrowUpRight, Activity, Layers, Building2, CheckCircle2, Clock, Leaf, Monitor, Syringe, Baby, Flower, Scan, HeartPulse, Calendar, ArrowLeft } from "lucide-react";

const fmt = (n) => Math.round(n || 0).toLocaleString("th-TH");

const PLATFORM_COLORS = {
  eclaim: "#6366f1", ktb: "#0ea5e9", moph: "#f59e0b",
  thai: "#10b981", ntip: "#8b5cf6", physical: "#f43f5e",
};

const months = ["ต.ค.", "พ.ย.", "ธ.ค.", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย."];

const mockRanking = [
  { name: "รพ.สต.บ้านสันโค้ง", cases: 142, amount: 285400 },
  { name: "รพ.สต.บ้านต้นเปา", cases: 98, amount: 196200 },
  { name: "รพ.สต.บ้านกอสะเรียม", cases: 87, amount: 174300 },
  { name: "รพ.สต.บ้านป่าตาล", cases: 76, amount: 152100 },
  { name: "รพ.สต.บ้านแม่ผาแหน", cases: 64, amount: 128000 },
];

const mockPlatforms = [
  { key: "eclaim", title: "E-Claim", icon: Monitor, value: 412500 },
  { key: "ktb", title: "Krungthai Digital", icon: Syringe, value: 298700 },
  { key: "moph", title: "MOPH Claim", icon: Baby, value: 187300 },
  { key: "thai", title: "OP/PP Individual", icon: Flower, value: 95400 },
  { key: "ntip", title: "NTIP", icon: Scan, value: 64200 },
  { key: "physical", title: "Disability", icon: HeartPulse, value: 41900 },
];

const totalAmount = mockPlatforms.reduce((s, p) => s + p.value, 0);

const yoy68 = [12000,18000,22000,15000,28000,31000,19000,24000,26000,20000,17000,14000];
const yoy69 = [15000,21000,28000,19000,34000,38000,24000,29000,32000,26000,22000,18000];

const pieData = mockPlatforms.map(p => ({
  label: p.title, value: p.value, color: PLATFORM_COLORS[p.key],
  percent: Math.round((p.value / totalAmount) * 100)
})).sort((a,b) => b.value - a.value);

const hospitals = ["All Cup","รพ.สต.บ้านสันโค้ง","รพ.สต.บ้านต้นเปา","รพ.สต.บ้านกอสะเรียม","รพ.สต.บ้านป่าตาล","รพ.สต.บ้านแม่ผาแหน"];

// Pie Chart
const SimplePieChart = ({ data }) => {
  const gradientParts = data.map((item, i, arr) => {
    const start = arr.slice(0,i).reduce((a,c) => a+c.percent, 0);
    return `${item.color} ${start}% ${start+item.percent}%`;
  });
  return (
    <div className="flex flex-col xl:flex-row items-center gap-6">
      <div className="relative w-40 h-40 rounded-full shrink-0 border-4 border-white shadow-xl"
        style={{ background: `conic-gradient(${gradientParts.join(", ")})` }}>
        <div className="absolute inset-7 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
          <span style={{fontSize:9,color:"#6b7280",fontWeight:700,textTransform:"uppercase"}}>CUP Share</span>
          <span style={{fontSize:22,fontWeight:900,color:"#022c22",lineHeight:1}}>{data[0]?.percent}%</span>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 20px"}}>
        {data.map((item,i) => (
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:11}}>
            <span style={{width:10,height:10,borderRadius:"50%",background:item.color,flexShrink:0}}></span>
            <span style={{fontWeight:700,color:"#374151",maxWidth:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.label}</span>
            <span style={{fontWeight:900,color:"#022c22",background:"#ecfdf5",padding:"1px 6px",borderRadius:6,fontSize:10}}>{item.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Trend Chart
const TrendChart = () => {
  const maxVal = Math.max(...yoy68, ...yoy69) * 1.15;
  const cL = 36, cW = 520, bY = 85;
  const path = (arr) => arr.map((v,i) => `${i===0?"M":"L"} ${cL+(i/11)*cW} ${bY-((v/maxVal)*72)}`).join(" ");
  const yLabels = [0,0.5,1].map(p => ({ value: Math.round(maxVal*p), y: bY-p*72 }));
  return (
    <svg viewBox="0 0 600 105" style={{width:"100%",height:"100%",position:"absolute",inset:0,padding:"8px 4px"}} preserveAspectRatio="none">
      {yLabels.map((l,i) => (
        <g key={i}>
          <line x1={cL} y1={l.y} x2={cL+cW} y2={l.y} stroke="#d1fae5" strokeWidth="0.5" strokeDasharray="3,3"/>
          <text x={cL-3} y={l.y+2} textAnchor="end" fontSize="4" fill="#9ca3af" fontWeight="bold">
            {l.value>=1000?`${(l.value/1000).toFixed(0)}k`:l.value}
          </text>
        </g>
      ))}
      <line x1={cL} y1={bY} x2={cL+cW} y2={bY} stroke="#10b981" strokeWidth="0.8"/>
      <line x1={cL} y1={10} x2={cL} y2={bY} stroke="#10b981" strokeWidth="0.8"/>
      <path d={path(yoy68)} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,2" strokeLinecap="round"/>
      {yoy68.map((v,i) => <circle key={i} cx={cL+(i/11)*cW} cy={bY-((v/maxVal)*72)} r="2" fill="#94a3b8"/>)}
      <path d={path(yoy69)} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"/>
      <path d={`${path(yoy69)} L ${cL+cW} ${bY} L ${cL} ${bY} Z`} fill="url(#g69)" opacity="0.15"/>
      {yoy69.map((v,i) => <circle key={i} cx={cL+(i/11)*cW} cy={bY-((v/maxVal)*72)} r="2.5" fill="#059669"/>)}
      <defs>
        <linearGradient id="g69" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {months.map((m,i) => (
        <text key={i} x={cL+(i/11)*cW} y={bY+7} textAnchor="middle" fontSize="3.5" fill="#065f46" fontWeight="bold">{m}</text>
      ))}
    </svg>
  );
};

export default function Dashboard() {
  const [filterUnit, setFilterUnit] = useState("All Cup");
  const [filterYear, setFilterYear] = useState("2569");

  return (
    <div style={{minHeight:"100vh",background:"#F7FBF9",fontFamily:"'Segoe UI',sans-serif",color:"#0f172a"}}>
      {/* Header */}
      <header style={{height:72,background:"white",borderBottom:"1px solid #d1fae5",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",boxShadow:"0 1px 8px rgba(0,0,0,0.04)",position:"sticky",top:0,zIndex:30}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#059669,#34d399)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(5,150,105,0.3)"}}>
            <Leaf size={22} color="white"/>
          </div>
          <div>
            <div style={{fontWeight:900,fontSize:18,letterSpacing:"-0.5px",color:"#022c22",textTransform:"uppercase"}}>ClaimCup</div>
            <div style={{fontSize:9,fontWeight:700,color:"#059669",textTransform:"uppercase",letterSpacing:"0.15em"}}>Sankhong Portal</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 14px",background:"#ecfdf5",border:"1px solid #a7f3d0",borderRadius:12,fontSize:11,fontWeight:700,color:"#065f46"}}>
            <Clock size={13}/> 10:42:31
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 14px",background:"#022c22",color:"white",borderRadius:12,fontSize:9,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.1em"}}>
            <CheckCircle2 size={13} color="#34d399"/> Public Health Approved
          </div>
          <button style={{padding:"6px 14px",background:"#fef2f2",color:"#ef4444",border:"1px solid #fecaca",borderRadius:10,fontSize:11,fontWeight:700,cursor:"pointer"}}>
            🚪 ออกจากระบบ
          </button>
        </div>
      </header>

      <div style={{padding:"24px 28px",maxWidth:1400,margin:"0 auto"}}>

        {/* Title + Year Filter */}
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:16}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,fontSize:28,fontWeight:900,color:"#022c22",letterSpacing:"-1px"}}>
              <Leaf size={28} color="#059669"/> Health Claim Analytics
            </div>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.15em",marginTop:4}}>
              CUP Sankhong Dashboard · <span style={{color:"#059669",background:"#ecfdf5",padding:"1px 8px",borderRadius:6}}>{filterYear}</span>
            </div>
          </div>
          <div style={{display:"flex",gap:4,background:"rgba(6,78,59,0.05)",padding:5,borderRadius:14,border:"1px solid rgba(6,78,59,0.08)"}}>
            {["2568","2569"].map(y => (
              <button key={y} onClick={() => setFilterYear(y)}
                style={{padding:"6px 18px",borderRadius:10,fontSize:11,fontWeight:900,border:"none",cursor:"pointer",
                  background: filterYear===y ? "#022c22" : "transparent",
                  color: filterYear===y ? "white" : "rgba(6,78,59,0.5)"}}>
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Hospital Filter Buttons */}
        <div style={{background:"white",border:"1px solid rgba(6,78,59,0.08)",borderRadius:24,padding:12,display:"flex",flexWrap:"wrap",gap:8,marginBottom:20,boxShadow:"0 4px 20px rgba(6,78,59,0.05)"}}>
          {hospitals.map(h => (
            <button key={h} onClick={() => setFilterUnit(h)}
              style={{padding:"8px 16px",borderRadius:12,fontSize:11,fontWeight:700,border: filterUnit===h ? "none" : "1px solid #d1fae5",cursor:"pointer",transition:"all 0.2s",
                background: filterUnit===h ? "#022c22" : "#f0fdf4",
                color: filterUnit===h ? "white" : "#065f46",
                boxShadow: filterUnit===h ? "0 4px 12px rgba(2,44,34,0.3)" : "none"}}>
              {h}
            </button>
          ))}
        </div>

        {/* Hero Summary */}
        <div style={{background:"linear-gradient(135deg,#022c22,#065f46,#047857)",borderRadius:32,padding:"32px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:24,marginBottom:20,boxShadow:"0 20px 60px rgba(2,44,34,0.35)",overflow:"hidden",position:"relative"}}>
          <div style={{position:"absolute",top:-60,right:300,width:300,height:300,borderRadius:"50%",background:"rgba(52,211,153,0.06)",pointerEvents:"none"}}></div>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,color:"#34d399",fontSize:9,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.4em",marginBottom:10}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:"#34d399",animation:"pulse 2s infinite"}}></span>
              Cumulative Health Disbursement
            </div>
            <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:8}}>
              <span style={{fontSize:36,color:"rgba(52,211,153,0.4)",fontWeight:300}}>฿</span>
              <span style={{fontSize:64,fontWeight:900,color:"white",letterSpacing:"-3px",lineHeight:1}}>{fmt(totalAmount)}</span>
            </div>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:14,fontWeight:600}}>ยอดเงินรวมเบิกชดเชยประจำปี {filterYear}</p>
            <div style={{marginTop:16,display:"inline-flex",alignItems:"center",gap:8,padding:"10px 20px",background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:20,color:"#34d399",fontSize:13,fontWeight:900}}>
              <Building2 size={16}/> {filterUnit}
            </div>
          </div>
          <div style={{padding:24,background:"white",borderRadius:28,boxShadow:"0 20px 50px rgba(0,0,0,0.15)",flexShrink:0}}>
            <SimplePieChart data={pieData}/>
          </div>
        </div>

        {/* Charts + Ranking Row */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:16,marginBottom:20}}>
          
          {/* Financial Surveillance */}
          <div style={{background:"white",border:"1px solid rgba(6,78,59,0.08)",borderRadius:32,padding:"28px 32px",boxShadow:"0 2px 12px rgba(6,78,59,0.04)"}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
              <div style={{padding:12,background:"#022c22",borderRadius:16,color:"white"}}><Activity size={22}/></div>
              <div>
                <div style={{fontWeight:900,fontSize:18,color:"#022c22",textTransform:"uppercase",letterSpacing:"-0.5px"}}>Financial Surveillance</div>
                <div style={{fontSize:11,color:"#059669",fontWeight:700,marginTop:2,display:"flex",alignItems:"center",gap:4}}>
                  <Building2 size={12}/> ข้อมูลของ: {filterUnit}
                </div>
              </div>
              <div style={{marginLeft:"auto",display:"flex",gap:16,fontSize:9,fontWeight:900,textTransform:"uppercase"}}>
                <span style={{display:"flex",alignItems:"center",gap:4,color:"#94a3b8"}}><span style={{width:8,height:8,borderRadius:"50%",background:"#94a3b8",display:"inline-block"}}></span>ปี 2568</span>
                <span style={{display:"flex",alignItems:"center",gap:4,color:"#059669"}}><span style={{width:8,height:8,borderRadius:"50%",background:"#059669",display:"inline-block"}}></span>ปี 2569</span>
              </div>
            </div>
            <div style={{position:"relative",height:160,background:"rgba(236,253,245,0.3)",borderRadius:16}}>
              <TrendChart/>
            </div>
          </div>

          {/* Top Units + Button */}
          <div style={{background:"white",border:"1px solid rgba(6,78,59,0.08)",borderRadius:32,display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"0 2px 12px rgba(6,78,59,0.04)"}}>
            <div style={{padding:"20px 24px",borderBottom:"1px solid rgba(6,78,59,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(6,78,59,0.01)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,fontWeight:900,fontSize:15,color:"#022c22",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                <Trophy size={22} fill="#022c22" color="#022c22"/> Top Units
              </div>
              <span style={{fontSize:9,fontWeight:900,color:"rgba(6,78,59,0.3)",textTransform:"uppercase",letterSpacing:"0.15em",background:"rgba(6,78,59,0.04)",padding:"4px 10px",borderRadius:8}}>THB</span>
            </div>

            <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:8,flex:1}}>
              {mockRanking.map((h,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",borderRadius:16,background:"white",boxShadow:"0 1px 6px rgba(0,0,0,0.04)",border:"1px solid #ecfdf5"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:"#ecfdf5",color:"#065f46",fontWeight:900,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>{i+1}</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:11,color:"#022c22"}}>{h.name}</div>
                      <div style={{fontSize:9,color:"rgba(5,150,105,0.6)",fontWeight:600}}>{h.cases} CASES</div>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:900,fontSize:12,color:"#059669"}}>{fmt(h.amount)} ฿</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ ปุ่ม Operating Expenses Report */}
            <div style={{padding:"12px 16px",borderTop:"1px solid rgba(6,78,59,0.05)"}}>
              <button style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"12px 16px",background:"#022c22",color:"white",borderRadius:16,fontWeight:900,fontSize:11,border:"none",cursor:"pointer",boxShadow:"0 6px 20px rgba(2,44,34,0.25)",letterSpacing:"0.03em"}}>
                <DollarSign size={15}/>
                Operating Expenses Report
                <ArrowUpRight size={13} style={{opacity:0.6}}/>
              </button>
            </div>
          </div>
        </div>

        {/* Platform Cards */}
        <div style={{background:"white",border:"1px solid rgba(6,78,59,0.08)",borderRadius:32,padding:"24px 28px",boxShadow:"0 2px 12px rgba(6,78,59,0.04)"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <div style={{padding:10,background:"#ecfdf5",color:"#065f46",borderRadius:14}}><Layers size={20}/></div>
            <div>
              <div style={{fontWeight:900,fontSize:16,color:"#022c22"}}>Service Platform Breakdown</div>
              <div style={{fontSize:9,fontWeight:700,color:"rgba(6,78,59,0.35)",textTransform:"uppercase",letterSpacing:"0.15em",marginTop:2}}>Analytical Overview by System</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12}}>
            {mockPlatforms.map(p => {
              const Icon = p.icon;
              return (
                <div key={p.key} style={{borderRadius:24,padding:"20px 14px",background:PLATFORM_COLORS[p.key],display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",cursor:"pointer",boxShadow:`0 12px 28px -8px ${PLATFORM_COLORS[p.key]}80`,transition:"transform 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px) scale(1.02)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                  <div style={{padding:10,borderRadius:14,background:"rgba(255,255,255,0.2)",marginBottom:10}}>
                    <Icon size={22} color="white"/>
                  </div>
                  <div style={{fontSize:8,fontWeight:900,color:"rgba(255,255,255,0.85)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>{p.title}</div>
                  <div style={{fontSize:16,fontWeight:900,color:"white",letterSpacing:"-0.5px"}}>{fmt(p.value)}</div>
                  <div style={{fontSize:8,fontWeight:700,color:"rgba(255,255,255,0.6)",marginTop:2}}>บาท</div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}