import { useState } from "react";

const C = {
  royal: "#112250",
  sapphire: "#3C507D",
  gold: "#E0C58F",
  swan: "#F5F0E9",
  shell: "#D9CBC2",
};

const animations = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideRight {
  from { opacity: 0; transform: translateX(-40px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes float {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-10px); }
}
@keyframes pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(224,197,143,0.4); }
  50%      { box-shadow: 0 0 0 16px rgba(224,197,143,0); }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes goldLine {
  from { width: 0; }
  to   { width: 100%; }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .login-left  { display: none !important; }
  .login-right {
    width: 100% !important;
    padding: 40px 28px !important;
    min-height: 100vh;
  }
  .login-root  { flex-direction: column !important; }
}
`;

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E0C58F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    title: "Smart Offer Search",
    desc: "Find internships by wilaya, skills, and type with AI-powered recommendations.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E0C58F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: "Track Applications",
    desc: "Monitor your application status in real time from pending to accepted.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E0C58F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    title: "Automatic Convention",
    desc: "Get your official Convention de Stage generated and validated digitally.",
  },
];

const roles = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    label: "Student",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    label: "Company",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M20 21a8 8 0 1 0-16 0"/>
        <line x1="12" y1="14" x2="12" y2="18"/>
        <line x1="10" y1="16" x2="14" y2="16"/>
      </svg>
    ),
    label: "Admin",
  },
];

export default function Login() {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [focused, setFocused] = useState({});

  const set   = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const focus = (k)    => setFocused(f => ({ ...f, [k]: true }));
  const blur  = (k)    => setFocused(f => ({ ...f, [k]: false }));

  const inputStyle = (name) => ({
    width: "100%", padding: "14px 16px", borderRadius: 10,
    border: `1.5px solid ${focused[name] ? C.sapphire : C.shell}`,
    background: "#fff", color: C.royal, fontSize: 15,
    outline: "none", boxSizing: "border-box", fontFamily: "Georgia, serif",
    transition: "border-color 0.2s",
  });

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) return setError("Please fill in all fields.");
    setLoading(true);
    try {
      const res  = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token",     data.token);
        localStorage.setItem("role",      data.role);
        localStorage.setItem("user_id",   data.user_id);
        localStorage.setItem("full_name", data.full_name);
        if (data.role === "company")         window.location.href = "/company/dashboard";
        else if (data.role === "student")    window.location.href = "/student/dashboard";
        else if (data.role === "admin")      window.location.href = "/admin/dashboard";
        else if (data.role === "superadmin") window.location.href = "/superadmin/dashboard";
      } else {
        setError(data.error || "Invalid credentials.");
      }
    } catch {
      setError("Cannot connect to server. Check that Django is running.");
    }
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <>
      <style>{animations}</style>
      <div className="login-root" style={{
        minHeight: "100vh", background: C.royal, display: "flex",
        fontFamily: "Georgia, serif", position: "relative", overflow: "hidden",
      }}>

        {/* BG decorations */}
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:C.sapphire, opacity:0.15, top:-150, left:-150, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", width:200, height:200, borderRadius:"50%", background:C.gold, opacity:0.07, bottom:60, left:"30%", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", width:80, height:80, borderRadius:"50%", border:`2px solid rgba(224,197,143,0.2)`, top:120, right:520, pointerEvents:"none" }}/>

        {/* ══ LEFT PANEL ══ */}
        <div className="login-left" style={{
          flex: 1, display:"flex", flexDirection:"column", justifyContent:"center",
          alignItems:"center", padding:"48px 40px", position:"relative", zIndex:1,
          animation:"slideRight 0.7s ease both",
        }}>
          <div style={{ alignSelf:"flex-start", display:"flex", alignItems:"center", gap:10, marginBottom:52 }}>
            <div style={{
              width:38, height:38, background:C.gold, borderRadius:10,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:"bold", fontSize:18, color:C.royal, animation:"pulse 2s infinite",
            }}>S.</div>
            <span style={{ color:C.swan, fontSize:22, fontWeight:"bold", letterSpacing:1 }}>Stag.io</span>
          </div>

          <div style={{
            width:"100%", maxWidth:380, background:C.sapphire, borderRadius:24,
            padding:"44px 36px", display:"flex", flexDirection:"column",
            position:"relative", overflow:"hidden",
          }}>
            <div style={{ position:"absolute", width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,0.04)", top:-70, right:-70 }}/>
            <div style={{ position:"absolute", width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.03)", bottom:-20, left:-20 }}/>

            <div style={{
              width:72, height:72, borderRadius:20,
              background:"linear-gradient(135deg, rgba(224,197,143,0.2), rgba(224,197,143,0.05))",
              border:`1.5px solid rgba(224,197,143,0.3)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              marginBottom:24, animation:"float 3s ease-in-out infinite",
            }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                <line x1="12" y1="11" x2="12" y2="15"/>
                <line x1="10" y1="13" x2="14" y2="13"/>
              </svg>
            </div>

            <div style={{ color:C.swan, fontSize:20, fontWeight:"bold", lineHeight:1.3, marginBottom:8 }}>
              Algeria's Internship Platform
            </div>
            <div style={{ color:C.shell, fontSize:13, lineHeight:1.7, marginBottom:32, opacity:0.85 }}>
              Connecting students, companies, and universities through a seamless digital workflow.
            </div>

            <div style={{ height:"1px", background:`linear-gradient(90deg, transparent, ${C.gold}, transparent)`, marginBottom:28 }}/>

            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {features.map((f, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:16 }}>
                  <div style={{
                    width:44, height:44, borderRadius:12, flexShrink:0,
                    background:"rgba(255,255,255,0.06)",
                    border:`1px solid rgba(224,197,143,0.2)`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>{f.icon}</div>
                  <div>
                    <div style={{ color:C.gold, fontSize:13, fontWeight:"bold", marginBottom:3 }}>{f.title}</div>
                    <div style={{ color:C.shell, fontSize:12, lineHeight:1.6, opacity:0.8 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", marginTop:32, paddingTop:24, borderTop:`1px solid rgba(224,197,143,0.15)` }}>
              {[["200+","Companies"],["1k+","Students"],["48","Wilayas"]].map(([n,l]) => (
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ color:C.gold, fontSize:18, fontWeight:"bold" }}>{n}</div>
                  <div style={{ color:C.shell, fontSize:10, textTransform:"uppercase", letterSpacing:1, opacity:0.7 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="login-right" style={{
          width:480, display:"flex", flexDirection:"column", justifyContent:"center",
          padding:"48px 52px", background:C.swan, position:"relative", zIndex:1,
          animation:"fadeUp 0.7s ease both",
        }}>
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:"3px",
            background:`linear-gradient(90deg, ${C.royal}, ${C.gold}, #f0d080, ${C.gold}, ${C.royal})`,
            backgroundSize:"200% auto", animation:"shimmer 3s linear infinite",
          }}/>

          {/* Mobile logo — only visible on small screens */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }} className="mobile-logo">
            <style>{`
              .mobile-logo { display: none !important; }
              @media (max-width: 768px) { .mobile-logo { display: flex !important; } }
            `}</style>
            <div style={{
              width:36, height:36, background:C.gold, borderRadius:9,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:"bold", fontSize:16, color:C.royal,
            }}>S.</div>
            <span style={{ color:C.royal, fontSize:20, fontWeight:"bold", letterSpacing:1 }}>Stag.io</span>
          </div>

          <div style={{ color:C.royal, fontSize:28, fontWeight:"bold", marginBottom:6 }}>
            Sign in to your account
          </div>
          <div style={{ color:C.sapphire, fontSize:14, marginBottom:36 }}>
            Enter your credentials to access Stag.io
          </div>

          {error && (
            <div style={{
              background:"#fee2e2", color:"#991b1b", borderRadius:8,
              padding:"11px 14px", fontSize:13, marginBottom:20,
              animation:"fadeUp 0.3s ease both",
            }}>{error}</div>
          )}

          <div style={{ marginBottom:20 }}>
            <label style={{
              display:"flex", alignItems:"center", gap:8,
              color:C.sapphire, fontSize:11, fontWeight:"bold",
              textTransform:"uppercase", letterSpacing:1, marginBottom:8,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Email address
            </label>
            <input style={inputStyle("email")} type="email" placeholder="ahmed@univ.dz"
              value={form.email} onChange={e => set("email", e.target.value)}
              onFocus={() => focus("email")} onBlur={() => blur("email")} onKeyDown={handleKey}/>
          </div>

          <div style={{ marginBottom:28 }}>
            <label style={{
              display:"flex", alignItems:"center", gap:8,
              color:C.sapphire, fontSize:11, fontWeight:"bold",
              textTransform:"uppercase", letterSpacing:1, marginBottom:8,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Password
            </label>
            <input style={inputStyle("password")} type="password" placeholder="••••••••"
              value={form.password} onChange={e => set("password", e.target.value)}
              onFocus={() => focus("password")} onBlur={() => blur("password")} onKeyDown={handleKey}/>
          </div>

          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:11, color:C.sapphire, fontWeight:"bold", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>
              Available roles
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {roles.map(r => (
                <div key={r.label} style={{
                  flex:1, padding:"10px 0", borderRadius:10, textAlign:"center",
                  background:"rgba(17,34,80,0.05)", border:`1px solid rgba(17,34,80,0.08)`,
                  color:C.sapphire, fontSize:12,
                  display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                }}>
                  {r.icon}
                  <span>{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{
            width:"100%", padding:"15px 0", borderRadius:12, border:"none",
            background:C.royal, color:C.gold, fontSize:16, fontWeight:"bold",
            cursor:loading ? "not-allowed" : "pointer", opacity:loading ? 0.75 : 1,
            fontFamily:"Georgia, serif", transition:"all 0.3s ease",
            display:"flex", alignItems:"center", justifyContent:"center", gap:10,
          }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {loading ? (
              <span style={{ width:16, height:16, border:`2px solid ${C.gold}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }}/>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
            )}
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div style={{ textAlign:"center", color:C.sapphire, fontSize:13, marginTop:24 }}>
            Don't have an account?{" "}
            <span onClick={() => window.location.href = "/register"}
              style={{ color:C.royal, fontWeight:"bold", cursor:"pointer", textDecoration:"underline" }}>
              Create one
            </span>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"24px 0" }}>
            <div style={{ flex:1, height:1, background:C.shell }}/>
            <span style={{ color:C.shell, fontSize:12 }}>Stag.io v1.0</span>
            <div style={{ flex:1, height:1, background:C.shell }}/>
          </div>

          <div style={{ color:C.shell, fontSize:11, textAlign:"center", lineHeight:1.6 }}>
            Internship management platform for Algerian universities & companies.
          </div>
        </div>
      </div>
    </>
  );
}