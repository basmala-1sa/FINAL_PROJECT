import { useState } from "react";
import { FiGrid, FiUser, FiSearch, FiFileText, FiBookmark } from "react-icons/fi";
import NotificationBell from "./NotificationBell";
import { useNavigate } from "react-router-dom";


export const colors = {
  navyDark:   "#112250",
  navyMedium: "#1C3160",
  sapphire:   "#3C507D",
  gold:       "#C2A072",
  lightGold:  "#E0C58F",
  offWhite:   "#F5F0E9",
  shellstone: "#D9CBC2",
  white:      "#ffffff",
  success:    "#16a34a",
  danger:     "#dc2626",
  warning:    "#d97706",
};

// ─── Shared CSS injected once ─────────────────────────────────────────────────
export const GLOBAL_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes slideIn  { from{transform:translateX(-30px);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes fadeUp   { from{transform:translateY(20px);opacity:0}  to{transform:translateY(0);opacity:1} }
  @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.6} }
  @keyframes goldLine { from{width:0} to{width:100%} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  .nav-link { transition: all 0.3s cubic-bezier(0.4,0,0.2,1) !important; }
  .nav-link:hover { padding-left: 32px !important; }
  .stat-card { transition: all 0.3s ease !important; }
  .stat-card:hover { transform:translateY(-6px) !important; box-shadow:0 12px 40px rgba(17,34,80,0.15) !important; }
  .btn-gold { transition: all 0.25s ease !important; }
  .btn-gold:hover { opacity: 0.88 !important; transform: translateY(-1px) !important; }
  .inp-field { transition: border-color .2s, box-shadow .2s !important; outline: none !important; }
  .inp-field:focus { border-color: #C2A072 !important; box-shadow: 0 0 0 3px rgba(194,160,114,0.2) !important; }
  .card-hover { transition: all 0.3s ease !important; }
  .card-hover:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 32px rgba(17,34,80,0.13) !important; }
  @media (max-width: 900px) {
    .sidebar-fixed { transform: translateX(-100%) !important; transition: transform .3s ease !important; }
    .sidebar-fixed.open { transform: translateX(0) !important; }
    .main-shifted { margin-left: 0 !important; }
    .overlay-mob { display: block !important; }
    .hamburger-btn { display: flex !important; }
  }
`;

// ─── Sidebar links for student ────────────────────────────────────────────────
export const STUDENT_NAV = [
  { key: "dashboard",    label: "Dashboard",       icon: <FiGrid size={16}/>,     path: "/student/dashboard"    },
  { key: "profile",      label: "My Profile",      icon: <FiUser size={16}/>,     path: "/student/profile"      },
  { key: "offers",       label: "Search Offers",   icon: <FiSearch size={16}/>,   path: "/student/offers"       },
  { key: "applications", label: "My Applications", icon: <FiFileText size={16}/>, path: "/student/applications" },
  { key: "saved",        label: "Saved Offers",    icon: <FiBookmark size={16}/> },
];

// ─── Shared Sidebar component ─────────────────────────────────────────────────


export function Sidebar({ active, onNavigate, role = "STUDENT PORTAL", nameKey = "full_name" }) {
  const [hovered, setHovered] = useState(null);
  const name = localStorage.getItem(nameKey) || "Student";
  const initial = name.charAt(0).toUpperCase();
  const navigate = useNavigate()

  return (
    <div className="sidebar-fixed" style={{
      width: "270px",
      background: colors.navyDark,
      display: "flex", flexDirection: "column",
      position: "fixed", top: 0, left: 0, bottom: 0,
      boxShadow: "6px 0 30px rgba(0,0,0,0.4)",
      zIndex: 100,
      animation: "slideIn 0.5s ease forwards",
    }}>
      {/* Top shimmer line */}
      <div style={{
        height: "3px",
        background: `linear-gradient(90deg,${colors.navyDark},${colors.gold},${colors.lightGold},${colors.gold},${colors.navyDark})`,
        backgroundSize: "200% auto", animation: "shimmer 3s linear infinite",
      }}/>

      {/* Logo + user */}
      <div style={{ padding: "28px 24px 20px", borderBottom: `1px solid rgba(194,160,114,0.2)`, textAlign: "center" }}>
  <div style={{ width:"60px",height:"60px",borderRadius:"50%",border:`2px solid rgba(194,160,114,0.3)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px" }}>
    <div
      onClick={() => navigate("/")}
      style={{ width:"44px",height:"44px",borderRadius:"50%",background:`linear-gradient(135deg,${colors.gold},${colors.lightGold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",fontWeight:"bold",color:colors.navyDark,cursor:"pointer" }}>
      {initial}
    </div>
  </div>
  <div style={{ fontSize:"22px",fontWeight:"bold",color:colors.gold,letterSpacing:"4px" }}>STAG.IO</div>
  <div style={{ fontSize:"9px",color:colors.lightGold,letterSpacing:"3px",marginTop:"2px",opacity:.6 }}>✦ {role} ✦</div>
  <div style={{ height:"1px",background:`linear-gradient(90deg,transparent,${colors.gold},transparent)`,marginTop:"16px" }}/>
  <div style={{ color:colors.offWhite,fontSize:"13px",marginTop:"12px",fontWeight:"bold" }}>{name}</div>
  <div style={{ color:colors.gold,fontSize:"10px",letterSpacing:"2px",marginTop:"2px",opacity:.7 }}>STUDENT</div>
</div>
      

      {/* Nav */}
      <nav style={{ flex:1, padding:"20px 0" }}>
        <div style={{ fontSize:"9px",color:colors.gold,letterSpacing:"2px",padding:"0 24px 12px",opacity:.5 }}>NAVIGATION</div>
        {STUDENT_NAV.map((link, i) => (
          <div key={link.key} className="nav-link"
            onMouseEnter={()=>setHovered(link.key)}
            onMouseLeave={()=>setHovered(null)}
            onClick={()=>onNavigate(link.key)}
            style={{
              display:"flex",alignItems:"center",gap:"14px",
              padding:"13px 24px", cursor:"pointer",
              color: active===link.key ? colors.gold : "rgba(245,240,233,0.7)",
              background: active===link.key ? "rgba(194,160,114,0.12)" : hovered===link.key ? "rgba(255,255,255,0.04)" : "transparent",
              borderLeft: active===link.key ? `3px solid ${colors.gold}` : "3px solid transparent",
              fontSize:"13px", letterSpacing:".5px",
              animation:`fadeUp 0.4s ease ${i*0.1}s both`,
            }}>
            <span style={{fontSize:"16px"}}>{link.icon}</span>
            {link.label}
            {active===link.key && (
              <div style={{ marginLeft:"auto",width:"6px",height:"6px",borderRadius:"50%",background:colors.gold,animation:"pulse 2s ease infinite" }}/>
            )}
          </div>
        ))}
      </nav>

      <div style={{ height:"1px",background:`linear-gradient(90deg,transparent,rgba(194,160,114,0.4),transparent)`,margin:"0 24px" }}/>

      {/* Logout */}
      <div onMouseEnter={()=>setHovered("logout")} onMouseLeave={()=>setHovered(null)}
        onClick={()=>{localStorage.clear();window.location.href="/login";}}
        style={{ display:"flex",alignItems:"center",gap:"14px",padding:"20px 24px",cursor:"pointer",color:hovered==="logout"?"#ff6b6b":"rgba(245,240,233,0.5)",transition:"all 0.3s ease",fontSize:"13px",letterSpacing:".5px" }}>
        ⬤ Sign Out
      </div>

      <div style={{ height:"3px",background:`linear-gradient(90deg,${colors.navyDark},${colors.gold},${colors.lightGold},${colors.gold},${colors.navyDark})`,backgroundSize:"200% auto",animation:"shimmer 3s linear infinite" }}/>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
export function StatCard({ icon, label, value, delay = "0s" }) {
  return (
    <div className="stat-card" style={{
      background: colors.white, borderRadius:"16px", padding:"28px 24px",
      boxShadow:"0 4px 20px rgba(17,34,80,0.07)",
      position:"relative", overflow:"hidden",
      animation:`fadeUp 0.5s ease ${delay} both`,
    }}>
      <div style={{ position:"absolute",top:0,right:0,width:"60px",height:"60px",background:"linear-gradient(225deg,rgba(194,160,114,0.15),transparent)",borderBottomLeftRadius:"60px" }}/>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,${colors.gold},${colors.lightGold})`,borderRadius:"16px 16px 0 0" }}/>
      
      {/* ← changed: color wrapper handles both emoji and react-icons */}
      <div style={{ color:colors.gold, marginBottom:"16px" }}>
        {icon}
      </div>
      
      <div style={{ fontSize:"36px",fontWeight:"bold",color:colors.navyDark,lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:"12px",color:"#999",marginTop:"6px",letterSpacing:".5px" }}>{label}</div>
    </div>
  );
}

// ─── Page shell (topbar + content area) ──────────────────────────────────────
export function PageShell({ title, subtitle, children, onMenuClick }) {
  return (
    
    <div style={{ marginLeft:"270px", flex:1, minHeight:"100vh", background:colors.offWhite, fontFamily:"Georgia, serif" }} className="main-shifted">
      {/* Topbar */}
      <div style={{ background:colors.white, padding:"0 36px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 1px 0 rgba(17,34,80,0.07)", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
          <button onClick={onMenuClick} className="hamburger-btn" style={{ display:"none",background:"none",border:"none",cursor:"pointer",color:colors.navyDark,fontSize:"22px",padding:"4px" }}>☰</button>
          <div>
            <div style={{ fontSize:"16px",fontWeight:"bold",color:colors.navyDark,letterSpacing:".5px" }}>{title}</div>
            {subtitle && <div style={{ fontSize:"11px",color:colors.gold,letterSpacing:"1px",marginTop:"2px" }}>{subtitle}</div>}
          </div>
        </div>
        
        <div style={{ fontSize:"10px",color:colors.gold,letterSpacing:"2px",border:`1px solid rgba(194,160,114,0.4)`,padding:"6px 14px",borderRadius:"20px" }}>
          ✦ STUDENT
        </div>
        
      </div>
      <div style={{
  display: "flex", justifyContent: "flex-end",
  marginBottom: "20px",
}}>
  <NotificationBell />
</div>
      
      {/* Content */}
      <div style={{ padding:"40px 36px" }}>
        <div style={{ height:"2px",background:`linear-gradient(90deg,${colors.gold},${colors.lightGold},transparent)`,marginBottom:"36px",borderRadius:"2px" }}/>
        {children}
      </div>
    </div>
    
  );
}
export default Sidebar;