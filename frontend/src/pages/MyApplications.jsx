import { useState, useEffect } from "react";
import { colors, GLOBAL_STYLES, Sidebar, PageShell } from "./StudentLayout";
import { getMyApplications } from '../api'


export default function MyApplications() {
  const [active, setSidebar]       = useState("applications");
  const [sidebarOpen, setOpen]     = useState(false);
  const [applications, setApps]    = useState([]);
  const [loading, setLoading]      = useState(true);
  const [filter, setFilter]        = useState("all");

  // ── Load applications ─────────────────────────────────────────────────────
  useEffect(() => {
    const token  = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    getMyApplications()
  .then(res => {
    setApps(Array.isArray(res.data) ? res.data : [])
    setLoading(false)
  })
  .catch(() => setLoading(false))
  }, []);

  const handleNav = (key) => {
    setSidebar(key); setOpen(false);
    const paths = { dashboard:"/student/dashboard", profile:"/student/profile", offers:"/student/offers", applications:"/student/applications" };
    if (paths[key]) window.location.href = paths[key];
  };

  const STATUS_CONFIG = {
    pending:   { label:"Pending",   bg:"rgba(194,160,114,0.15)", color:colors.gold,    icon:"⏳", desc:"Waiting for company response" },
    accepted:  { label:"Accepted",  bg:"#dcfce7",                color:"#16a34a",      icon:"✅", desc:"Company accepted your application" },
    refused:   { label:"Refused",   bg:"#fee2e2",                color:"#dc2626",      icon:"❌", desc:"Company declined your application" },
    validated: { label:"Validated", bg:"#dbeafe",                color:"#2563eb",      icon:"🎓", desc:"Admin validated — internship confirmed!" },
  };

  const filtered = filter === "all" ? applications : applications.filter(a => a.status === filter);

  const counts = {
    all:       applications.length,
    pending:   applications.filter(a=>a.status==="pending").length,
    accepted:  applications.filter(a=>a.status==="accepted").length,
    refused:   applications.filter(a=>a.status==="refused").length,
    validated: applications.filter(a=>a.status==="validated").length,
  };

  return (
    <div style={{ display:"flex",minHeight:"100vh",fontFamily:"Georgia,serif",background:colors.offWhite }}>
      <style>{GLOBAL_STYLES}</style>
      {sidebarOpen && <div onClick={()=>setOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(17,34,80,0.5)",zIndex:99 }}/>}
      <Sidebar active={active} onNavigate={handleNav}/>

      <PageShell title="My Applications" subtitle="✦ TRACK YOUR STATUS" onMenuClick={()=>setOpen(true)}>

        {/* Summary stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"16px",marginBottom:"28px",animation:"fadeUp .4s ease both" }}>
          {[
            { key:"all",       label:"Total",     value:counts.all,       bg:colors.white,     color:colors.navyDark },
            { key:"pending",   label:"Pending",   value:counts.pending,   bg:"rgba(194,160,114,0.12)", color:colors.gold },
            { key:"accepted",  label:"Accepted",  value:counts.accepted,  bg:"#dcfce7",        color:"#16a34a" },
            { key:"refused",   label:"Refused",   value:counts.refused,   bg:"#fee2e2",        color:"#dc2626" },
            { key:"validated", label:"Validated", value:counts.validated, bg:"#dbeafe",        color:"#2563eb" },
          ].map(s=>(
            <div key={s.key} onClick={()=>setFilter(s.key)} style={{
              background:s.bg,borderRadius:"14px",padding:"20px",
              border:`1.5px solid ${filter===s.key ? s.color : "transparent"}`,
              cursor:"pointer",textAlign:"center",
              boxShadow:filter===s.key?"0 4px 16px rgba(17,34,80,0.1)":"0 2px 8px rgba(17,34,80,0.05)",
              transition:"all .2s ease",
              transform:filter===s.key?"translateY(-2px)":"none",
            }}>
              <div style={{ fontSize:"28px",fontWeight:"bold",color:s.color,lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:"11px",color:s.color,marginTop:"4px",fontWeight:"bold",letterSpacing:"1px",textTransform:"uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Applications list */}
        <div style={{
          background:colors.white,borderRadius:"16px",padding:"28px 32px",
          boxShadow:"0 4px 20px rgba(17,34,80,0.07)",
          position:"relative",overflow:"hidden",
          animation:"fadeUp .5s ease .15s both",
        }}>
          <div style={{ position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,${colors.gold},${colors.lightGold})`,borderRadius:"16px 16px 0 0" }}/>
          <div style={{ position:"absolute",left:0,top:"15%",bottom:"15%",width:"3px",background:`linear-gradient(180deg,transparent,${colors.gold},transparent)`,borderRadius:"3px" }}/>

          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px" }}>
            <div>
              <div style={{ fontSize:"10px",color:colors.gold,letterSpacing:"2px",marginBottom:"4px" }}>APPLICATIONS</div>
              <h2 style={{ fontSize:"18px",color:colors.navyDark,margin:0,fontWeight:"bold" }}>
                {filter==="all" ? "All Applications" : `${STATUS_CONFIG[filter]?.label} Applications`}
              </h2>
            </div>
            <div style={{ fontSize:"12px",color:"#bbb",letterSpacing:".3px" }}>
              {filtered.length} result{filtered.length!==1?"s":""}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign:"center",padding:"50px",color:colors.gold,letterSpacing:"2px",fontSize:"12px" }}>
              <div style={{ width:"36px",height:"36px",border:`3px solid rgba(194,160,114,0.3)`,borderTopColor:colors.gold,borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 16px" }}/>
              LOADING…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:"center",padding:"50px 20px",color:"#bbb" }}>
              <div style={{ fontSize:"40px",marginBottom:"16px" }}>📭</div>
              <p style={{ fontSize:"15px",marginBottom:"6px" }}>
                {filter==="all" ? "No applications yet" : `No ${filter} applications`}
              </p>
              <p style={{ fontSize:"13px",opacity:.7 }}>
                {filter==="all" ? "Start by searching for internship offers!" : "Check another filter above"}
              </p>
              {filter==="all" && (
                <button onClick={()=>window.location.href="/student/offers"} style={{
                  marginTop:"16px",padding:"10px 24px",borderRadius:"10px",border:"none",
                  background:`linear-gradient(135deg,${colors.gold},${colors.lightGold})`,
                  color:colors.navyDark,fontSize:"12px",fontWeight:"bold",letterSpacing:"1px",cursor:"pointer",fontFamily:"Georgia,serif",
                }}>✦ SEARCH OFFERS</button>
              )}
            </div>
          ) : (
            <div style={{ display:"flex",flexDirection:"column",gap:"0" }}>
              {filtered.map((app, i) => {
                const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                return (
                  <div key={app.id} style={{
                    padding:"18px 0",
                    borderBottom:`1px solid ${colors.offWhite}`,
                    display:"flex",alignItems:"center",justifyContent:"space-between",
                    flexWrap:"wrap",gap:"12px",
                    animation:`fadeUp 0.4s ease ${i*0.05}s both`,
                  }}>
                    <div style={{ display:"flex",alignItems:"center",gap:"14px",flex:1,minWidth:"220px" }}>
                      {/* Company initial */}
                      <div style={{
                        width:"48px",height:"48px",borderRadius:"12px",flexShrink:0,
                        background:`linear-gradient(135deg,rgba(194,160,114,0.2),rgba(194,160,114,0.05))`,
                        border:`1px solid rgba(194,160,114,0.3)`,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:"18px",fontWeight:"bold",color:colors.gold,
                      }}>{(app.offer_title||"?")[0]}</div>
                      <div>
                        <div style={{ fontWeight:"bold",color:colors.navyDark,fontSize:"14px",marginBottom:"3px" }}>{app.offer_title}</div>
                        <div style={{ fontSize:"12px",color:colors.sapphire,fontWeight:"bold" }}>{app.offer_title}</div>
                        <div style={{ fontSize:"11px",color:"#bbb",marginTop:"2px" }}>📍 {app.wilaya} · Applied {app.applied_at}</div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div style={{ display:"flex",flexWrap:"wrap",gap:"5px",flex:1,minWidth:"160px" }}>
                      {(app.student_skills||"").split(",").filter(Boolean).slice(0,3).map(s=>(
                        <span key={s} style={{ padding:"3px 9px",borderRadius:"20px",fontSize:"10px",fontWeight:"bold",background:`rgba(194,160,114,0.1)`,color:colors.sapphire,border:`1px solid rgba(194,160,114,0.2)` }}>
                          {s.trim()}
                        </span>
                      ))}
                    </div>

                    {/* Status */}
                    <div style={{ textAlign:"right",flexShrink:0 }}>
                      <div style={{
                        display:"inline-flex",alignItems:"center",gap:"6px",
                        padding:"6px 16px",borderRadius:"20px",
                        background:sc.bg,color:sc.color,
                        fontSize:"12px",fontWeight:"bold",letterSpacing:".5px",
                        marginBottom:"4px",
                      }}>
                        {sc.icon} {sc.label}
                      </div>
                      <div style={{ fontSize:"10px",color:"#bbb",display:"block",textAlign:"right" }}>{sc.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PageShell>
    </div>
  );
}