import { useState, useEffect } from "react";
import { FiHome, FiLogOut, FiPlus, FiUsers, FiToggleLeft, FiToggleRight, FiX, FiSave, FiGlobe, FiUser, FiBriefcase } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


const colors = {
  navyDark:   "#112250",
  gold:       "#C2A072",
  lightGold:  "#E0C58F",
  offWhite:   "#F5F0E9",
};

const sidebarLinks = [
  { icon: <FiHome />,  label: "Dashboard",    key: "dashboard"    },
  { icon: <FiUsers />, label: "Universities", key: "universities" },
  { icon: <FiUsers />, label: "Admins",       key: "admins"       },
];

export default function SuperAdminDashboard() {
  const navigate  = useNavigate();
  const [active, setActive]   = useState("dashboard");
  const [hovered, setHovered] = useState(null);
  const token     = localStorage.getItem("token");
  const adminName = localStorage.getItem("full_name") || "Super Admin";

  // ── data states ──
  const [universities, setUniversities] = useState([]);
  const [admins, setAdmins]             = useState([]);
  const [loading, setLoading]           = useState(false);
  const [actionMsg, setActionMsg]       = useState("");

  // ── university modal ──
  const [uniModal, setUniModal] = useState(false);
  const [uniForm, setUniForm]   = useState({ name: "", wilaya: "", email: "" });

  // ── admin modal ──
  const [adminModal, setAdminModal] = useState(false);
  const [adminForm, setAdminForm]   = useState({
    full_name: "", email: "", password: "", university_id: ""
  });

  useEffect(() => {
    fetchUniversities();
    fetchAdmins();
  }, []);

  const fetchUniversities = async () => {
    try {
      const res  = await fetch("http://127.0.0.1:8000/api/superadmin/universities/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setUniversities(data);
    } catch {}
  };

  const fetchAdmins = async () => {
    try {
      const res  = await fetch("http://127.0.0.1:8000/api/superadmin/admins/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setAdmins(data);
    } catch {}
  };

  const handleAddUniversity = async () => {
    if (!uniForm.name || !uniForm.wilaya) return showMsg("❌ Name and wilaya are required!");
    try {
      const res  = await fetch("http://127.0.0.1:8000/api/superadmin/universities/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(uniForm),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg("✅ University added successfully!");
        setUniModal(false);
        setUniForm({ name: "", wilaya: "", email: "" });
        fetchUniversities();
      } else {
        showMsg(`❌ ${data.error}`);
      }
    } catch {
      showMsg("❌ Something went wrong.");
    }
  };

  const handleToggleUniversity = async (id) => {
    try {
      const res  = await fetch(`http://127.0.0.1:8000/api/superadmin/universities/${id}/toggle/`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) fetchUniversities();
    } catch {}
  };

  const handleCreateAdmin = async () => {
    if (!adminForm.full_name || !adminForm.email || !adminForm.password || !adminForm.university_id)
      return showMsg("❌ All fields are required!");
    try {
      const res  = await fetch("http://127.0.0.1:8000/api/superadmin/admins/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(adminForm),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg("✅ Admin created successfully!");
        setAdminModal(false);
        setAdminForm({ full_name: "", email: "", password: "", university_id: "" });
        fetchAdmins();
      } else {
        showMsg(`❌ ${data.error}`);
      }
    } catch {
      showMsg("❌ Something went wrong.");
    }
  };

  const showMsg = (msg) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(""), 4000);
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px",
    border: `1.5px solid rgba(194,160,114,0.3)`,
    borderRadius: "10px", fontSize: "14px",
    fontFamily: "Georgia, serif", color: colors.navyDark,
    background: "#fdfcfb", outline: "none",
    boxSizing: "border-box", marginBottom: "16px",
    transition: "all 0.3s ease",
  };

  const labelStyle = {
    display: "block", fontSize: "11px",
    color: colors.navyDark, letterSpacing: "1px",
    marginBottom: "6px", fontWeight: "bold",
  };

  // ── stats ──
  const totalStudents = universities.reduce((a, u) => a + u.students, 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Georgia, serif", background: colors.offWhite }}>
      <style>{`
        @keyframes slideIn { from { transform: translateX(-30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeUp  { from { transform: translateY(20px);  opacity: 0; } to { transform: translateY(0);  opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes pulse   { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes modalIn { from { transform: scale(0.92) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        .nav-link { transition: all 0.3s cubic-bezier(0.4,0,0.2,1) !important; }
        .nav-link:hover { padding-left: 32px !important; }
        .card-hover { transition: all 0.3s ease !important; }
        .card-hover:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px rgba(17,34,80,0.12) !important; }
        .inp:focus { border-color: #C2A072 !important; box-shadow: 0 0 0 3px rgba(194,160,114,0.15) !important; }
      `}</style>

      {/* ══════════ SIDEBAR ══════════ */}
      <div style={{
        width: "270px", background: colors.navyDark, display: "flex",
        flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0,
        boxShadow: "6px 0 30px rgba(0,0,0,0.4)", zIndex: 100,
        animation: "slideIn 0.5s ease forwards",
      }}>
        <div style={{
          height: "3px",
          background: `linear-gradient(90deg, ${colors.navyDark}, ${colors.gold}, ${colors.lightGold}, ${colors.gold}, ${colors.navyDark})`,
          backgroundSize: "200% auto", animation: "shimmer 3s linear infinite",
        }} />

        <div style={{ padding: "28px 24px 20px", borderBottom: `1px solid rgba(194,160,114,0.2)`, textAlign: "center" }}>
          <div style={{
            width: "60px", height: "60px", borderRadius: "50%",
            border: `2px solid rgba(194,160,114,0.3)`,
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
          }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "50%",
              background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", fontWeight: "bold", color: colors.navyDark,
            }}>
              {adminName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: colors.gold, letterSpacing: "4px" }}>STAG.IO</div>
          <div style={{ fontSize: "9px", color: colors.lightGold, letterSpacing: "3px", marginTop: "2px", opacity: 0.6 }}>✦ SUPER ADMIN ✦</div>
          <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`, marginTop: "16px" }} />
          <div style={{ color: colors.offWhite, fontSize: "13px", marginTop: "12px", fontWeight: "bold" }}>{adminName}</div>
          <div style={{ color: colors.gold, fontSize: "10px", letterSpacing: "2px", marginTop: "2px", opacity: 0.7 }}>PLATFORM OWNER</div>
        </div>

        <nav style={{ flex: 1, padding: "20px 0" }}>
          <div style={{ fontSize: "9px", color: colors.gold, letterSpacing: "2px", padding: "0 24px 12px", opacity: 0.5 }}>NAVIGATION</div>
          {sidebarLinks.map((link, i) => (
            <div
              key={link.key} className="nav-link"
              onMouseEnter={() => setHovered(link.key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setActive(link.key)}
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "13px 24px", cursor: "pointer",
                color: active === link.key ? colors.gold : "rgba(245,240,233,0.7)",
                background: active === link.key ? "rgba(194,160,114,0.12)" : hovered === link.key ? "rgba(255,255,255,0.04)" : "transparent",
                borderLeft: active === link.key ? `3px solid ${colors.gold}` : "3px solid transparent",
                fontSize: "13px", letterSpacing: "0.5px",
                animation: `fadeUp 0.4s ease ${i * 0.1}s both`,
              }}
            >
              <span style={{ fontSize: "17px" }}>{link.icon}</span>
              {link.label}
              {active === link.key && (
                <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: colors.gold, animation: "pulse 2s ease infinite" }} />
              )}
            </div>
          ))}
        </nav>

        <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, rgba(194,160,114,0.4), transparent)`, margin: "0 24px" }} />
        <div
          onMouseEnter={() => setHovered("logout")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => { localStorage.clear(); navigate("/login"); }}
          style={{
            display: "flex", alignItems: "center", gap: "14px", padding: "20px 24px", cursor: "pointer",
            color: hovered === "logout" ? "#ff6b6b" : "rgba(245,240,233,0.5)",
            transition: "all 0.3s ease", fontSize: "13px",
          }}
        >
          <FiLogOut size={16} /> Sign Out
        </div>
        <div style={{
          height: "3px",
          background: `linear-gradient(90deg, ${colors.navyDark}, ${colors.gold}, ${colors.lightGold}, ${colors.gold}, ${colors.navyDark})`,
          backgroundSize: "200% auto", animation: "shimmer 3s linear infinite",
        }} />
      </div>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div style={{ marginLeft: "270px", flex: 1, padding: "48px 40px", animation: "fadeUp 0.6s ease forwards" }}>
        <div style={{ height: "2px", background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold}, transparent)`, marginBottom: "40px", borderRadius: "2px" }} />

        {/* Action message */}
        {actionMsg && (
          <div style={{
            background: actionMsg.startsWith("✅") ? "#eafaf1" : "#fdf2f2",
            border: `1px solid ${actionMsg.startsWith("✅") ? "#27AE60" : "#e74c3c"}`,
            borderRadius: "10px", padding: "14px 20px", marginBottom: "24px", fontSize: "14px",
            color: actionMsg.startsWith("✅") ? "#27AE60" : "#e74c3c",
          }}>
            {actionMsg}
          </div>
        )}

        {/* ── DASHBOARD TAB ── */}
        {active === "dashboard" && (
          <>
            <div style={{ marginBottom: "40px" }}>
              <div style={{ fontSize: "11px", color: colors.gold, letterSpacing: "3px", marginBottom: "8px" }}>✦ PLATFORM OVERVIEW</div>
              <h1 style={{ fontSize: "34px", color: colors.navyDark, fontWeight: "bold", margin: 0 }}>Super Admin</h1>
              <p style={{ color: "#888", marginTop: "8px", fontSize: "14px" }}>Manage universities and administrators across the platform.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "40px" }}>
              {[
                { label: "Universities", value: universities.length, icon: <FiGlobe size={28} style={{ color: colors.gold }} />   },
{ label: "Admins",       value: admins.length,       icon: <FiUser size={28} style={{ color: colors.gold }} />    },
{ label: "Students",     value: totalStudents,        icon: <FiBriefcase size={28} style={{ color: colors.gold }} /> },
              ].map((card, i) => (
                <div key={i} className="card-hover" style={{
                  background: "#fff", borderRadius: "16px", padding: "28px 24px",
                  boxShadow: "0 4px 20px rgba(17,34,80,0.07)", position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold})`, borderRadius: "16px 16px 0 0" }} />
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>{card.icon}</div>
                  <div style={{ fontSize: "36px", fontWeight: "bold", color: colors.navyDark, lineHeight: 1 }}>{card.value}</div>
                  <div style={{ fontSize: "12px", color: "#999", marginTop: "6px", letterSpacing: "0.5px" }}>{card.label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── UNIVERSITIES TAB ── */}
        {active === "universities" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
              <div>
                <div style={{ fontSize: "11px", color: colors.gold, letterSpacing: "3px", marginBottom: "8px" }}>✦ MANAGE</div>
                <h1 style={{ fontSize: "32px", color: colors.navyDark, fontWeight: "bold", margin: 0 }}>Universities</h1>
                <p style={{ color: "#888", marginTop: "6px", fontSize: "14px" }}>{universities.length} universities on the platform</p>
              </div>
              <button
                onClick={() => setUniModal(true)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px",
                  background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`,
                  color: colors.navyDark, border: "none", borderRadius: "10px",
                  fontSize: "13px", fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif",
                }}
              >
                <FiPlus size={16} /> ADD UNIVERSITY
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {universities.map((u, i) => (
                <div key={u.id} className="card-hover" style={{
                  background: "#fff", borderRadius: "16px", padding: "24px 28px",
                  boxShadow: "0 4px 20px rgba(17,34,80,0.07)",
                  borderLeft: `4px solid ${u.is_active ? colors.gold : "#ddd"}`,
                  animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
                    <div style={{
  width: "50px", height: "50px", borderRadius: "12px",
  background: `linear-gradient(135deg, rgba(194,160,114,0.2), rgba(194,160,114,0.05))`,
  border: `1px solid rgba(194,160,114,0.3)`,
  display: "flex", alignItems: "center", justifyContent: "center",
}}>
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C2A072" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
</div>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "bold", color: colors.navyDark }}>{u.name}</div>
                      <div style={{ fontSize: "12px", color: "#999", marginTop: "4px", display: "flex", alignItems: "center", gap: "10px" }}>
  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C2A072" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    {u.wilaya}
  </span>
  <span style={{ color: "#ddd" }}>|</span>
  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C2A072" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    {u.admins} admin{u.admins !== 1 ? "s" : ""}
  </span>
  <span style={{ color: "#ddd" }}>|</span>
  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C2A072" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
    {u.students} student{u.students !== 1 ? "s" : ""}
  </span>
</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{
                      background: u.is_active ? "rgba(194,160,114,0.12)" : "rgba(0,0,0,0.05)",
                      color: u.is_active ? colors.gold : "#aaa",
                      fontSize: "10px", letterSpacing: "1px", padding: "4px 12px",
                      borderRadius: "20px", border: `1px solid ${u.is_active ? "rgba(194,160,114,0.3)" : "rgba(0,0,0,0.08)"}`,
                    }}>
                      {u.is_active ? "● ACTIVE" : "○ INACTIVE"}
                    </span>
                    <button
                      onClick={() => handleToggleUniversity(u.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: colors.gold, padding: 0 }}
                      title={u.is_active ? "Deactivate" : "Activate"}
                    >
                      {u.is_active
                        ? <FiToggleRight size={28} />
                        : <FiToggleLeft size={28} style={{ color: "#ccc" }} />}
                    </button>
                  </div>
                </div>
              ))}

              {universities.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px", color: "#bbb", background: "#fff", borderRadius: "16px" }}>
                  <div style={{ color: "#ddd", marginBottom: "12px" }}><FiGlobe size={40} /></div>
                  <p>No universities yet. Add the first one!</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── ADMINS TAB ── */}
        {active === "admins" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
              <div>
                <div style={{ fontSize: "11px", color: colors.gold, letterSpacing: "3px", marginBottom: "8px" }}>✦ MANAGE</div>
                <h1 style={{ fontSize: "32px", color: colors.navyDark, fontWeight: "bold", margin: 0 }}>Admins</h1>
                <p style={{ color: "#888", marginTop: "6px", fontSize: "14px" }}>{admins.length} administrators on the platform</p>
              </div>
              <button
                onClick={() => setAdminModal(true)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px",
                  background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`,
                  color: colors.navyDark, border: "none", borderRadius: "10px",
                  fontSize: "13px", fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif",
                }}
              >
                <FiPlus size={16} /> CREATE ADMIN
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {admins.map((a, i) => (
                <div key={a.id} className="card-hover" style={{
                  background: "#fff", borderRadius: "16px", padding: "24px 28px",
                  boxShadow: "0 4px 20px rgba(17,34,80,0.07)",
                  borderLeft: `4px solid ${colors.gold}`,
                  animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
                  display: "flex", alignItems: "center", gap: "24px",
                }}>
                  <div style={{
                    width: "50px", height: "50px", borderRadius: "50%",
                    background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px", fontWeight: "bold", color: colors.navyDark, flexShrink: 0,
                  }}>
                    {a.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: "bold", color: colors.navyDark }}>{a.full_name}</div>
                    <div style={{ fontSize: "12px", color: "#999", marginTop: "4px", display: "flex", alignItems: "center", gap: "10px" }}>
  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C2A072" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
    {a.email}
  </span>
  <span style={{ color: "#ddd" }}>|</span>
  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C2A072" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    {a.university}
  </span>
</div>
                  </div>
                </div>
              ))}

              {admins.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px", color: "#bbb", background: "#fff", borderRadius: "16px" }}>
                 <div style={{ color: "#ddd", marginBottom: "12px" }}><FiUser size={40} /></div>
                  <p>No admins yet. Create the first one!</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ══════════ ADD UNIVERSITY MODAL ══════════ */}
      {uniModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(17,34,80,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "480px", boxShadow: "0 30px 80px rgba(17,34,80,0.25)", animation: "modalIn 0.3s ease forwards", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold})`, borderRadius: "20px 20px 0 0" }} />
            <button onClick={() => setUniModal(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "20px" }}><FiX /></button>

            <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "2px", marginBottom: "6px" }}>✦ NEW UNIVERSITY</div>
            <h2 style={{ fontSize: "20px", color: colors.navyDark, margin: "0 0 24px", fontWeight: "bold" }}>Add University</h2>

            <label style={labelStyle}>UNIVERSITY NAME *</label>
            <input className="inp" value={uniForm.name} onChange={e => setUniForm({...uniForm, name: e.target.value})} placeholder="USTHB" style={inputStyle} />

            <label style={labelStyle}>WILAYA *</label>
            <input className="inp" value={uniForm.wilaya} onChange={e => setUniForm({...uniForm, wilaya: e.target.value})} placeholder="Alger" style={inputStyle} />

            <label style={labelStyle}>EMAIL (optional)</label>
            <input className="inp" value={uniForm.email} onChange={e => setUniForm({...uniForm, email: e.target.value})} placeholder="contact@univ.dz" style={inputStyle} />

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button onClick={() => setUniModal(false)} style={{ flex: 1, padding: "12px", background: "none", border: `1.5px solid #ddd`, borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontFamily: "Georgia, serif" }}>Cancel</button>
              <button onClick={handleAddUniversity} style={{ flex: 2, padding: "12px", background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`, border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "bold", color: colors.navyDark, fontFamily: "Georgia, serif" }}>
                <FiSave style={{ marginRight: "8px" }} /> ADD UNIVERSITY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ CREATE ADMIN MODAL ══════════ */}
      {adminModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(17,34,80,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "480px", boxShadow: "0 30px 80px rgba(17,34,80,0.25)", animation: "modalIn 0.3s ease forwards", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold})`, borderRadius: "20px 20px 0 0" }} />
            <button onClick={() => setAdminModal(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "20px" }}><FiX /></button>

            <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "2px", marginBottom: "6px" }}>✦ NEW ADMIN</div>
            <h2 style={{ fontSize: "20px", color: colors.navyDark, margin: "0 0 24px", fontWeight: "bold" }}>Create Admin Account</h2>

            <label style={labelStyle}>FULL NAME *</label>
            <input className="inp" value={adminForm.full_name} onChange={e => setAdminForm({...adminForm, full_name: e.target.value})} placeholder="Ahmed Benali" style={inputStyle} />

            <label style={labelStyle}>EMAIL *</label>
            <input className="inp" value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} placeholder="admin@usthb.dz" style={inputStyle} />

            <label style={labelStyle}>PASSWORD *</label>
            <input className="inp" type="password" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} placeholder="••••••••" style={inputStyle} />

            <label style={labelStyle}>UNIVERSITY *</label>
            <select
              className="inp"
              value={adminForm.university_id}
              onChange={e => setAdminForm({...adminForm, university_id: e.target.value})}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">Select university</option>
              {universities.map(u => (
                <option key={u.id} value={u.id}>{u.name} — {u.wilaya}</option>
              ))}
            </select>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button onClick={() => setAdminModal(false)} style={{ flex: 1, padding: "12px", background: "none", border: `1.5px solid #ddd`, borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontFamily: "Georgia, serif" }}>Cancel</button>
              <button onClick={handleCreateAdmin} style={{ flex: 2, padding: "12px", background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`, border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "bold", color: colors.navyDark, fontFamily: "Georgia, serif" }}>
                <FiSave style={{ marginRight: "8px" }} /> CREATE ADMIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}