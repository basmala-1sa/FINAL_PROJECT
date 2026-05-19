import { useState, useEffect } from "react";
import { colors, GLOBAL_STYLES, Sidebar, StatCard, PageShell } from "./StudentLayout";
import { FiUser, FiSearch, FiFileText, FiClock, FiCheckCircle, FiSend, FiBriefcase } from "react-icons/fi";



export default function StudentDashboard() {
  const [active, setSidebar]   = useState("dashboard");
  const [sidebarOpen, setOpen] = useState(false);
 const [visible, setVisible] = useState(false);
const name      = localStorage.getItem("full_name") || "Student";
const firstName = name.split(" ")[0];
const token     = localStorage.getItem("token");

const [stats, setStats] = useState([
  { icon: <FiBriefcase size={26}/>, label: "Offers Available",  value: "…" },
  { icon: <FiSend size={26}/>,      label: "Applications Sent", value: "…" },
  { icon: <FiCheckCircle size={26}/>, label: "Accepted",        value: "…" },
  { icon: <FiClock size={26}/>,     label: "Pending",           value: "…" },
]);
const [recent, setRecent] = useState([]);

useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

// fetch real data from backend
useEffect(() => {
  // fetch applications
  fetch("https://final-project-rdr8.onrender.com/api/student/applications/", {
    headers: { "Authorization": `Bearer ${token}` }
  })
    .then(r => r.json())
    .then(apps => {
      if (!Array.isArray(apps)) return;
      setStats([
  { icon: <FiBriefcase size={26}/>, label: "Offers Available",  value: "—"  },
  { icon: <FiSend size={26}/>,      label: "Applications Sent", value: apps.length },
  { icon: <FiCheckCircle size={26}/>, label: "Accepted",        value: apps.filter(a => a.status === "accepted").length },
  { icon: <FiClock size={26}/>,     label: "Pending",           value: apps.filter(a => a.status === "pending").length },
]);
      setRecent(
        apps.slice(0, 4).map(a => ({
          company: a.offer_title,
          role:    a.offer_title,
          status:  a.status,
          date:    new Date(a.applied_at).toLocaleDateString(),
        }))
      );
    })
    .catch(() => {});
}, [token]);

  const statusStyle = (s) => ({
    accepted: { bg:"#dcfce7", color:"#16a34a" },
    refused:  { bg:"#fee2e2", color:"#dc2626" },
    pending:  { bg:"rgba(194,160,114,0.15)", color:colors.gold },
  }[s] || { bg:"#f3f4f6", color:"#666" });

  const handleNav = (key) => {
    setSidebar(key);
    setOpen(false);
    const paths = {
      dashboard:    "/student/dashboard",
      profile:      "/student/profile",
      offers:       "/student/offers",
      applications: "/student/applications",
      saved:        "/student/saved",
    };
    if (paths[key]) window.location.href = paths[key];
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"Georgia, serif", background:colors.offWhite }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={()=>setOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(17,34,80,0.5)",zIndex:99 }}/>
      )}

      <Sidebar active={active} onNavigate={handleNav}/>

      <PageShell title="Dashboard" subtitle="✦ STUDENT OVERVIEW" onMenuClick={()=>setOpen(true)}>

        {/* Welcome */}
        <div style={{
          background:`linear-gradient(135deg,${colors.navyDark} 0%,${colors.sapphire} 100%)`,
          borderRadius:"16px", padding:"32px 36px", marginBottom:"32px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexWrap:"wrap", gap:"16px",
          boxShadow:`0 8px 32px rgba(17,34,80,0.3)`,
          animation:"fadeUp 0.5s ease both", position:"relative", overflow:"hidden",
        }}>
          {/* Decorative */}
          <div style={{ position:"absolute",top:"-30px",right:"-30px",width:"180px",height:"180px",borderRadius:"50%",border:`1px solid rgba(194,160,114,0.15)` }}/>
          <div style={{ position:"absolute",top:"10px",right:"40px",width:"100px",height:"100px",borderRadius:"50%",border:`1px solid rgba(194,160,114,0.1)` }}/>
          <div>
            <div style={{ fontSize:"10px",color:colors.lightGold,letterSpacing:"3px",marginBottom:"8px" }}>✦ WELCOME BACK</div>
            <h1 style={{ fontSize:"30px",fontWeight:"bold",color:colors.white,margin:0,letterSpacing:"1px" }}>
              Hello, {firstName}!
            </h1>
            <p style={{ color:colors.shellstone,fontSize:"14px",marginTop:"8px" }}>
              Here's what's happening with your internship search today.
            </p>
          </div>
          <div style={{
            width:"72px",height:"72px",borderRadius:"50%",
            background:"rgba(255,255,255,0.08)",
            border:`2px solid rgba(194,160,114,0.3)`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:"32px",
          }}>🎓</div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"20px",marginBottom:"32px" }}>
          {stats.map((s,i)=>(
            <StatCard key={i} icon={s.icon} label={s.label} value={s.value} delay={`${i*0.1+0.2}s`}/>
          ))}
        </div>

        {/* Recent Applications */}
        <div style={{
          background:colors.white, borderRadius:"16px", padding:"32px",
          boxShadow:"0 4px 20px rgba(17,34,80,0.07)",
          animation:"fadeUp 0.6s ease 0.5s both",
          position:"relative", overflow:"hidden", marginBottom:"28px",
        }}>
          {/* Gold left accent */}
          <div style={{ position:"absolute",left:0,top:"20%",bottom:"20%",width:"3px",background:`linear-gradient(180deg,transparent,${colors.gold},transparent)`,borderRadius:"3px" }}/>

          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px" }}>
            <div>
              <div style={{ fontSize:"10px",color:colors.gold,letterSpacing:"2px",marginBottom:"4px" }}>OVERVIEW</div>
              <h2 style={{ fontSize:"18px",color:colors.navyDark,margin:0,fontWeight:"bold" }}>Recent Applications</h2>
            </div>
            <div onClick={()=>handleNav("applications")} style={{
              fontSize:"11px",color:colors.gold,letterSpacing:"1px",cursor:"pointer",
              border:`1px solid rgba(194,160,114,0.4)`,padding:"6px 14px",borderRadius:"20px",transition:"all .3s ease",
            }}>VIEW ALL →</div>
          </div>

          {recent.map((r,i)=>(
            <div key={i} style={{
              display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"14px 0",borderBottom:`1px solid ${colors.offWhite}`,
              flexWrap:"wrap",gap:"8px",
            }}>
              <div style={{ display:"flex",alignItems:"center",gap:"12px" }}>
                <div style={{
                  width:"42px",height:"42px",borderRadius:"10px",
                  background:`linear-gradient(135deg,rgba(194,160,114,0.15),rgba(194,160,114,0.05))`,
                  border:`1px solid rgba(194,160,114,0.3)`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:"15px",fontWeight:"bold",color:colors.gold,flexShrink:0,
                }}>{r.company[0]}</div>
                <div>
                  <div style={{ fontWeight:"bold",color:colors.navyDark,fontSize:"14px" }}>{r.role}</div>
                  <div style={{ fontSize:"12px",color:colors.sapphire,marginTop:"2px" }}>{r.company}</div>
                </div>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:"12px" }}>
                <span style={{ fontSize:"11px",color:"#bbb",letterSpacing:".5px" }}>{r.date}</span>
                <span style={{
                  padding:"4px 14px",borderRadius:"20px",fontSize:"11px",fontWeight:"bold",
                  textTransform:"capitalize",letterSpacing:".5px",
                  background:statusStyle(r.status).bg,color:statusStyle(r.status).color,
                }}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"16px",animation:"fadeUp 0.6s ease 0.6s both" }}>
          {[
            { icon:<FiUser size={24}/>,     label:"Complete your CV",   sub:"Add skills & GitHub",   key:"profile"      },
{ icon:<FiSearch size={24}/>,   label:"Browse Internships", sub:"Find the perfect role", key:"offers"       },
{ icon:<FiFileText size={24}/>, label:"Track Applications", sub:"See your status",       key:"applications" },
          ].map((a,i)=>(
            <div key={i} className="card-hover" onClick={()=>handleNav(a.key)} style={{
              background:colors.white,borderRadius:"14px",padding:"22px",cursor:"pointer",
              border:`1px solid rgba(194,160,114,0.2)`,boxShadow:"0 2px 12px rgba(17,34,80,0.06)",
              display:"flex",alignItems:"center",gap:"14px",
              position:"relative",overflow:"hidden",
            }}>
              <div style={{ position:"absolute",top:0,left:0,right:0,height:"2px",background:`linear-gradient(90deg,${colors.gold},${colors.lightGold})` }}/>
              <div style={{ fontSize:"28px" }}>{a.icon}</div>
              <div>
                <div style={{ fontSize:"14px",fontWeight:"bold",color:colors.navyDark }}>{a.label}</div>
                <div style={{ fontSize:"12px",color:"#999",marginTop:"3px" }}>{a.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </PageShell>
    </div>
  );
}