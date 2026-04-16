import { useState, useEffect } from "react";
import { colors, GLOBAL_STYLES, Sidebar, PageShell } from "./StudentLayout";
import { applyToOffer } from '../api'
import { searchOffers } from '../api'


const WILAYAS = ["Alger","Oran","Constantine","Annaba","Blida","Batna","Sétif","Tizi Ouzou","Béjaïa","Tlemcen","Biskra","Médéa","Ouargla","Skikda","Sidi Bel Abbès","Mostaganem","Boumerdès","Tipaza","Other"];
const SKILLS_LIST = ["React","Vue.js","Angular","JavaScript","Python","Django","Node.js","PHP","Laravel","Java","MySQL","MongoDB","Docker","Flutter","React Native"];
const TYPES = ["All","remote","presentiel","hybrid"];

export default function SearchOffers() {
  const [active, setSidebar]   = useState("offers");
  const [sidebarOpen, setOpen] = useState(false);

  const [offers, setOffers]       = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [applying, setApplying]   = useState(null); // offer id being applied to
  const [applied, setApplied]     = useState([]);   // offer ids already applied
  const [toast, setToast]         = useState(null);

  const [search, setSearch]       = useState("");
  const [wilaya, setWilaya]       = useState("");
  const [skill, setSkill]         = useState("");
  const [type, setType]           = useState("All");

  // ── Load offers ───────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    searchOffers()
  .then(res => {
    const data = res.data
    const list = Array.isArray(data)
      ? data
      : [...(data.recommended || []), ...(data.others || [])]
    setOffers(list)
    setFiltered(list)
    setLoading(false)
  })
  .catch(() => setLoading(false))
  }, []);

  // ── Filter logic ──────────────────────────────────────────────────────────
  useEffect(() => {
    let list = [...offers];
    if (search)        list = list.filter(o => o.title.toLowerCase().includes(search.toLowerCase()) || o.company_name?.toLowerCase().includes(search.toLowerCase()));
    if (wilaya)        list = list.filter(o => o.wilaya === wilaya);
    if (skill)         list = list.filter(o => o.skills_required?.toLowerCase().includes(skill.toLowerCase()));
    if (type !== "All") list = list.filter(o => o.type === type);
    setFiltered(list);
  }, [search, wilaya, skill, type, offers]);

  // ── Apply to offer ────────────────────────────────────────────────────────
  const handleApply = async (offerId) => {
    setApplying(offerId);
    const token   = localStorage.getItem("token");
    const userId  = localStorage.getItem("user_id");
    try {
      try {
  await applyToOffer(offerId)
  setApplied(prev => [...prev, offerId])
  showToast("Application sent successfully! ✅", "success")
} catch (err) {
  const msg = err.response?.data?.error || "Failed to apply."
  showToast(msg, "error")
}
    } catch {
      // Mock success for UI testing
      setApplied(prev => [...prev, offerId]);
      showToast("Application sent! ✅ (demo mode)", "success");
    }
    setApplying(null);
  };

  const showToast = (text, type) => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleNav = (key) => {
    setSidebar(key); setOpen(false);
    const paths = { dashboard:"/student/dashboard", profile:"/student/profile", offers:"/student/offers", applications:"/student/applications" };
    if (paths[key]) window.location.href = paths[key];
  };

  const typeBadge = (t) => ({
    remote:      { bg:"#dcfce7", color:"#16a34a", label:"Remote"      },
    presentiel:  { bg:"rgba(194,160,114,0.18)", color:colors.gold, label:"Présentiel" },
    hybrid:      { bg:"#dbeafe", color:"#2563eb", label:"Hybrid"       },
  }[t] || { bg:"#f3f4f6", color:"#666", label:t });

  return (
    <div style={{ display:"flex",minHeight:"100vh",fontFamily:"Georgia,serif",background:colors.offWhite }}>
      <style>{GLOBAL_STYLES}</style>
      {sidebarOpen && <div onClick={()=>setOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(17,34,80,0.5)",zIndex:99 }}/>}
      <Sidebar active={active} onNavigate={handleNav}/>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed",top:"24px",right:"24px",zIndex:999,
          padding:"14px 22px",borderRadius:"12px",fontFamily:"Georgia,serif",
          background:toast.type==="success"?"#dcfce7":"#fee2e2",
          border:`1px solid ${toast.type==="success"?"#16a34a":"#dc2626"}`,
          color:toast.type==="success"?"#16a34a":"#dc2626",
          fontSize:"13px",fontWeight:"bold",letterSpacing:".3px",
          boxShadow:"0 8px 24px rgba(0,0,0,0.12)",
          animation:"fadeUp .3s ease both",
        }}>{toast.text}</div>
      )}

      <PageShell title="Search Offers" subtitle="✦ FIND YOUR INTERNSHIP" onMenuClick={()=>setOpen(true)}>

        {/* Filters */}
        <div style={{
          background:colors.white,borderRadius:"16px",padding:"24px 28px",
          marginBottom:"28px",boxShadow:"0 4px 20px rgba(17,34,80,0.07)",
          position:"relative",overflow:"hidden",animation:"fadeUp .4s ease both",
        }}>
          <div style={{ position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,${colors.gold},${colors.lightGold})`,borderRadius:"16px 16px 0 0" }}/>
          <div style={{ fontSize:"10px",color:colors.gold,letterSpacing:"2px",marginBottom:"16px" }}>FILTERS</div>

          <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:"14px" }}>
            {/* Search */}
            <input className="inp-field" value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search by title or company…"
              style={{ padding:"10px 14px",borderRadius:"10px",border:`1.5px solid rgba(194,160,114,0.3)`,background:colors.offWhite,fontSize:"13px",color:colors.navyDark,fontFamily:"Georgia,serif" }}
            />
            {/* Wilaya */}
            <select className="inp-field" value={wilaya} onChange={e=>setWilaya(e.target.value)}
              style={{ padding:"10px 14px",borderRadius:"10px",border:`1.5px solid rgba(194,160,114,0.3)`,background:colors.offWhite,fontSize:"13px",color:wilaya?colors.navyDark:"#bbb",fontFamily:"Georgia,serif",cursor:"pointer" }}>
              <option value="">All Wilayas</option>
              {WILAYAS.map(w=><option key={w} value={w}>{w}</option>)}
            </select>
            {/* Skill */}
            <select className="inp-field" value={skill} onChange={e=>setSkill(e.target.value)}
              style={{ padding:"10px 14px",borderRadius:"10px",border:`1.5px solid rgba(194,160,114,0.3)`,background:colors.offWhite,fontSize:"13px",color:skill?colors.navyDark:"#bbb",fontFamily:"Georgia,serif",cursor:"pointer" }}>
              <option value="">All Skills</option>
              {SKILLS_LIST.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            {/* Type */}
            <select className="inp-field" value={type} onChange={e=>setType(e.target.value)}
              style={{ padding:"10px 14px",borderRadius:"10px",border:`1.5px solid rgba(194,160,114,0.3)`,background:colors.offWhite,fontSize:"13px",color:colors.navyDark,fontFamily:"Georgia,serif",cursor:"pointer" }}>
              {TYPES.map(t=><option key={t} value={t}>{t==="All"?"All Types":t}</option>)}
            </select>
          </div>
          <div style={{ fontSize:"12px",color:"#bbb",marginTop:"12px",letterSpacing:".3px" }}>
            {filtered.length} offer{filtered.length!==1?"s":""} found
          </div>
        </div>

        {/* Offers grid */}
        {loading ? (
          <div style={{ textAlign:"center",padding:"60px",color:colors.gold,letterSpacing:"2px",fontSize:"12px" }}>
            <div style={{ width:"36px",height:"36px",border:`3px solid rgba(194,160,114,0.3)`,borderTopColor:colors.gold,borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 16px" }}/>
            LOADING OFFERS…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center",padding:"60px",color:"#bbb",fontFamily:"Georgia,serif" }}>
            <div style={{ fontSize:"40px",marginBottom:"16px" }}>🔍</div>
            <p style={{ fontSize:"16px",marginBottom:"6px" }}>No offers match your filters</p>
            <p style={{ fontSize:"13px",opacity:.7 }}>Try adjusting your search criteria</p>
          </div>
        ) : (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"20px" }}>
            {filtered.map((offer,i)=>{
              const badge   = typeBadge(offer.type);
              const isApplied = applied.includes(offer.id);
              const isApplying = applying === offer.id;
              return (
                <div key={offer.id} className="card-hover" style={{
                  background:colors.white,borderRadius:"16px",padding:"26px",
                  boxShadow:"0 4px 20px rgba(17,34,80,0.07)",
                  position:"relative",overflow:"hidden",
                  animation:`fadeUp 0.4s ease ${i*0.06}s both`,
                  display:"flex",flexDirection:"column",gap:"0",
                }}>
                  {/* Top accent */}
                  <div style={{ position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,${colors.gold},${colors.lightGold})`,borderRadius:"16px 16px 0 0" }}/>

                  {/* Header */}
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"14px" }}>
                    <div style={{
                      width:"46px",height:"46px",borderRadius:"12px",flexShrink:0,
                      background:`linear-gradient(135deg,rgba(194,160,114,0.2),rgba(194,160,114,0.05))`,
                      border:`1px solid rgba(194,160,114,0.3)`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:"18px",fontWeight:"bold",color:colors.gold,
                    }}>{(offer.company_name||"?")[0]}</div>
                    <span style={{ padding:"4px 12px",borderRadius:"20px",fontSize:"11px",fontWeight:"bold",letterSpacing:".5px",background:badge.bg,color:badge.color }}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Title + company */}
                  <h3 style={{ fontSize:"15px",fontWeight:"bold",color:colors.navyDark,marginBottom:"4px",lineHeight:1.3 }}>{offer.title}</h3>
                  <div style={{ fontSize:"12px",color:colors.sapphire,marginBottom:"8px",fontWeight:"bold" }}>{offer.company_name}</div>

                  {/* Location */}
                  <div style={{ fontSize:"12px",color:"#999",marginBottom:"10px",display:"flex",alignItems:"center",gap:"4px" }}>
                    📍 {offer.wilaya || "—"}
                  </div>

                  {/* Description */}
                  {offer.description && (
                    <p style={{ fontSize:"12px",color:"#777",lineHeight:1.6,marginBottom:"14px",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>
                      {offer.description}
                    </p>
                  )}

                  {/* Skills tags */}
                  <div style={{ display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"18px",flex:1,alignContent:"flex-start" }}>
                    {(offer.skills||"").split(",").filter(Boolean).map(s=>(
                      <span key={s} style={{ padding:"3px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:"bold",background:`rgba(194,160,114,0.12)`,color:colors.sapphire,border:`1px solid rgba(194,160,114,0.25)` }}>
                        {s.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Divider */}
                  <div style={{ height:"1px",background:`linear-gradient(90deg,${colors.gold}33,transparent)`,marginBottom:"16px" }}/>

                  {/* Apply button */}
                  <button className="btn-gold" onClick={()=>!isApplied && handleApply(offer.id)}
                    disabled={isApplied || isApplying}
                    style={{
                      width:"100%",padding:"11px",borderRadius:"10px",border:"none",
                      cursor:isApplied?"default":"pointer",
                      background:isApplied
                        ? "#dcfce7"
                        : `linear-gradient(135deg,${colors.gold},${colors.lightGold})`,
                      color:isApplied?"#16a34a":colors.navyDark,
                      fontSize:"12px",fontWeight:"bold",letterSpacing:"1.5px",
                      boxShadow:isApplied?"none":`0 4px 14px rgba(194,160,114,0.35)`,
                      fontFamily:"Georgia,serif",
                      opacity:isApplying?0.7:1,
                    }}>
                    {isApplied ? "✅ APPLIED" : isApplying ? "SENDING…" : "✦ APPLY NOW"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </PageShell>
    </div>
  );
}