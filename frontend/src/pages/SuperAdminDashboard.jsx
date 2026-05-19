import { useState, useEffect } from "react";
import { FiHome, FiLogOut, FiPlus, FiUsers, FiToggleLeft, FiToggleRight, FiX, FiSave, FiGlobe, FiUser, FiBriefcase, FiCheckCircle, FiFileText, FiMail, FiBarChart2, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../components/NotificationBell";


const colors = {
  navyDark:  "#112250",
  gold:      "#C2A072",
  lightGold: "#E0C58F",
  offWhite:  "#F5F0E9",
};

const sidebarLinks = [
  { icon: <FiHome />,      label: "Dashboard",    key: "dashboard"    },
  { icon: <FiGlobe />,     label: "Universities", key: "universities" },
  { icon: <FiUser />,      label: "Admins",       key: "admins"       },
  { icon: <FiBarChart2 />, label: "Statistics",   key: "statistics"   },
  { icon: <FiMail />,      label: "Messages",     key: "messages"     },
];


function RecentActivity({ token, colors }) {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch("https://final-project-rdr8.onrender.com/api/superadmin/activity/", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setActivity(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const iconMap = {
    application: <FiFileText size={18} color={colors.gold} />,
    offer:       <FiBriefcase size={18} color={colors.gold} />,
    agreement:   <FiCheckCircle size={18} color="#16a34a" />,
  };

  const statusColors = {
    pending:   { bg: "rgba(194,160,114,0.12)", color: colors.gold },
    accepted:  { bg: "#dcfce7",                color: "#16a34a"   },
    refused:   { bg: "#fee2e2",                color: "#dc2626"   },
    validated: { bg: "#dcfce7",                color: "#16a34a"   },
    rejected:  { bg: "#fee2e2",                color: "#dc2626"   },
    new:       { bg: "#eff6ff",                color: "#3b82f6"   },
  };

  return (
    <div style={{
      background: "#fff", borderRadius: "16px", padding: "32px",
      boxShadow: "0 4px 20px rgba(17,34,80,0.07)", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: "3px", background: `linear-gradient(180deg, transparent, ${colors.gold}, transparent)`, borderRadius: "3px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "2px", marginBottom: "4px" }}>OVERVIEW</div>
          <h2 style={{ fontSize: "18px", color: colors.navyDark, margin: 0, fontWeight: "bold" }}>Recent Activity</h2>
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: colors.gold }}>Loading...</div>
      ) : activity.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px", color: "#bbb" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>📋</div>
          <p>No activity yet on the platform.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {activity.map((a, i) => {
            const sc = statusColors[a.status] || statusColors.new;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 0", borderBottom: "1px solid rgba(194,160,114,0.1)",
                flexWrap: "wrap", gap: "8px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "10px", flexShrink: 0,
                    background: "rgba(194,160,114,0.08)", border: "1px solid rgba(194,160,114,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {iconMap[a.type]}
                  </div>
                  <div style={{ fontSize: "13px", color: colors.navyDark, maxWidth: "420px", lineHeight: 1.5 }}>
                    {a.message}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                  <span style={{ fontSize: "11px", color: "#bbb" }}>{a.time}</span>
                  <span style={{
                    padding: "3px 12px", borderRadius: "20px", fontSize: "10px", fontWeight: "bold",
                    background: sc.bg, color: sc.color, letterSpacing: ".5px",
                  }}>
                    {a.status.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SuperAdminDashboard() {
  const navigate  = useNavigate();
  const [active, setActive]   = useState("dashboard");
  const [hovered, setHovered] = useState(null);
  const token     = localStorage.getItem("token");
  const adminName = localStorage.getItem("full_name") || "Super Admin";

  // ── data states ──
  const [universities, setUniversities] = useState([]);
  const [admins, setAdmins]             = useState([]);
  const [messages, setMessages]         = useState([]);
  const [actionMsg, setActionMsg]       = useState("");

  // ── add university modal ──
  const [uniModal, setUniModal] = useState(false);
  const [uniForm, setUniForm]   = useState({ name: "", wilaya: "", email: "" });

  // ── edit university modal ──
  const [editUniModal, setEditUniModal] = useState(false);
  const [editUniForm, setEditUniForm]   = useState({ id: null, name: "", wilaya: "", email: "" });

  // ── admin modal ──
  const [adminModal, setAdminModal] = useState(false);
  const [adminForm, setAdminForm]   = useState({ full_name: "", email: "", password: "", university_id: "" });

  // ── custom confirm modal (replaces window.confirm) ──
  const [confirmModal, setConfirmModal] = useState({ open: false, message: "", onConfirm: null });

  useEffect(() => {
    fetchUniversities();
    fetchAdmins();
    fetchMessages();
  }, []);

  const fetchUniversities = async () => {
    try {
      const res  = await fetch("https://final-project-rdr8.onrender.com/api/superadmin/universities/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setUniversities(data);
    } catch {}
  };

  const fetchAdmins = async () => {
    try {
      const res  = await fetch("https://final-project-rdr8.onrender.com/api/superadmin/admins/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setAdmins(data);
    } catch {}
  };

  const fetchMessages = async () => {
    try {
      const res  = await fetch("https://final-project-rdr8.onrender.com/api/superadmin/messages/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch {}
  };

  const showMsg = (msg) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(""), 4000);
  };

  const closeConfirm = () => setConfirmModal({ open: false, message: "", onConfirm: null });

  // ── handlers ──
  const handleAddUniversity = async () => {
    if (!uniForm.name || !uniForm.wilaya) return showMsg("❌ Name and wilaya are required!");
    try {
      const res  = await fetch("https://final-project-rdr8.onrender.com/api/superadmin/universities/add/", {
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

  const handleEditUniversity = async () => {
    if (!editUniForm.name || !editUniForm.wilaya) return showMsg("❌ Name and wilaya are required!");
    try {
      const res  = await fetch(`https://final-project-rdr8.onrender.com/api/superadmin/universities/${editUniForm.id}/edit/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(editUniForm),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg("✅ University updated successfully!");
        setEditUniModal(false);
        fetchUniversities();
      } else {
        showMsg(`❌ ${data.error}`);
      }
    } catch {
      showMsg("❌ Something went wrong.");
    }
  };

  // ← Uses custom modal instead of window.confirm
  const handleDeleteUniversity = (id, name) => {
    setConfirmModal({
      open: true,
      message: `Delete university "${name}"? This cannot be undone.`,
      onConfirm: async () => {
        try {
          const res = await fetch(`https://final-project-rdr8.onrender.com/api/superadmin/universities/${id}/delete/`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` },
          });
          if (res.ok) {
            showMsg("✅ University deleted.");
            fetchUniversities();
          } else {
            showMsg("❌ Could not delete university.");
          }
        } catch {
          showMsg("❌ Something went wrong.");
        }
        closeConfirm();
      }
    });
  };

  const handleToggleUniversity = async (id) => {
    try {
      const res = await fetch(`https://final-project-rdr8.onrender.com/api/superadmin/universities/${id}/toggle/`, {
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
      const res  = await fetch("https://final-project-rdr8.onrender.com/api/superadmin/admins/create/", {
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

  // ← Uses custom modal instead of window.confirm
  const handleRevokeAdmin = (id, name) => {
    setConfirmModal({
      open: true,
      message: `Revoke admin "${name}"? This cannot be undone.`,
      onConfirm: async () => {
        try {
          const res = await fetch(`https://final-project-rdr8.onrender.com/api/superadmin/admins/${id}/revoke/`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` },
          });
          if (res.ok) {
            showMsg("✅ Admin revoked successfully.");
            fetchAdmins();
          } else {
            showMsg("❌ Could not revoke admin.");
          }
        } catch {
          showMsg("❌ Something went wrong.");
        }
        closeConfirm();
      }
    });
  };

  // ── computed stats (no extra API call needed) ──
  const totalStudents  = universities.reduce((a, u) => a + u.students, 0);
  const activeUnis     = universities.filter(u => u.is_active).length;
  const inactiveUnis   = universities.filter(u => !u.is_active).length;
  const adminsAssigned = admins.filter(a => a.university).length;

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
        <div style={{ height: "3px", background: `linear-gradient(90deg, ${colors.navyDark}, ${colors.gold}, ${colors.lightGold}, ${colors.gold}, ${colors.navyDark})`, backgroundSize: "200% auto", animation: "shimmer 3s linear infinite" }} />

        <div style={{ padding: "28px 24px 20px", borderBottom: `1px solid rgba(194,160,114,0.2)`, textAlign: "center" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", border: `2px solid rgba(194,160,114,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <div onClick={() => navigate("/")} style={{ width: "44px", height: "44px", borderRadius: "50%", background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold", color: colors.navyDark, cursor: "pointer" }}>
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
            <div key={link.key} className="nav-link"
              onMouseEnter={() => setHovered(link.key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setActive(link.key)}
              style={{
                display: "flex", alignItems: "center", gap: "14px", padding: "13px 24px", cursor: "pointer",
                color: active === link.key ? colors.gold : "rgba(245,240,233,0.7)",
                background: active === link.key ? "rgba(194,160,114,0.12)" : hovered === link.key ? "rgba(255,255,255,0.04)" : "transparent",
                borderLeft: active === link.key ? `3px solid ${colors.gold}` : "3px solid transparent",
                fontSize: "13px", letterSpacing: "0.5px",
                animation: `fadeUp 0.4s ease ${i * 0.1}s both`,
              }}
            >
              <span style={{ fontSize: "17px" }}>{link.icon}</span>
              {link.label}
              {active === link.key && <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: colors.gold, animation: "pulse 2s ease infinite" }} />}
            </div>
          ))}
        </nav>

        <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, rgba(194,160,114,0.4), transparent)`, margin: "0 24px" }} />
        <div onMouseEnter={() => setHovered("logout")} onMouseLeave={() => setHovered(null)}
          onClick={() => { localStorage.clear(); navigate("/login"); }}
          style={{ display: "flex", alignItems: "center", gap: "14px", padding: "20px 24px", cursor: "pointer", color: hovered === "logout" ? "#ff6b6b" : "rgba(245,240,233,0.5)", transition: "all 0.3s ease", fontSize: "13px" }}
        >
          <FiLogOut size={16} /> Sign Out
        </div>
        <div style={{ height: "3px", background: `linear-gradient(90deg, ${colors.navyDark}, ${colors.gold}, ${colors.lightGold}, ${colors.gold}, ${colors.navyDark})`, backgroundSize: "200% auto", animation: "shimmer 3s linear infinite" }} />
      </div>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div style={{ marginLeft: "270px", flex: 1, padding: "48px 40px", animation: "fadeUp 0.6s ease forwards" }}>
        <div style={{ height: "2px", background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold}, transparent)`, marginBottom: "40px", borderRadius: "2px" }} />

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <NotificationBell />
        </div>

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

        {/* ══════════ DASHBOARD TAB ══════════ */}
        {active === "dashboard" && (
          <>
            <div style={{ marginBottom: "40px" }}>
              <div style={{ fontSize: "11px", color: colors.gold, letterSpacing: "3px", marginBottom: "8px" }}>✦ PLATFORM OVERVIEW</div>
              <h1 style={{ fontSize: "34px", color: colors.navyDark, fontWeight: "bold", margin: 0 }}>Super Admin</h1>
              <p style={{ color: "#888", marginTop: "8px", fontSize: "14px" }}>Manage universities and administrators across the platform.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "40px" }}>
              {[
                { label: "Universities", value: universities.length, icon: <FiGlobe size={28} style={{ color: colors.gold }} /> },
                { label: "Admins",       value: admins.length,       icon: <FiUser size={28} style={{ color: colors.gold }} /> },
                { label: "Students",     value: totalStudents,        icon: <FiBriefcase size={28} style={{ color: colors.gold }} /> },
              ].map((card, i) => (
                <div key={i} className="card-hover" style={{ background: "#fff", borderRadius: "16px", padding: "28px 24px", boxShadow: "0 4px 20px rgba(17,34,80,0.07)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold})`, borderRadius: "16px 16px 0 0" }} />
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>{card.icon}</div>
                  <div style={{ fontSize: "36px", fontWeight: "bold", color: colors.navyDark, lineHeight: 1 }}>{card.value}</div>
                  <div style={{ fontSize: "12px", color: "#999", marginTop: "6px" }}>{card.label}</div>
                </div>
              ))}
            </div>
            <RecentActivity token={token} colors={colors} />
          </>
        )}

        {/* ══════════ UNIVERSITIES TAB ══════════ */}
        {active === "universities" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
              <div>
                <div style={{ fontSize: "11px", color: colors.gold, letterSpacing: "3px", marginBottom: "8px" }}>✦ MANAGE</div>
                <h1 style={{ fontSize: "32px", color: colors.navyDark, fontWeight: "bold", margin: 0 }}>Universities</h1>
                <p style={{ color: "#888", marginTop: "6px", fontSize: "14px" }}>{universities.length} universities on the platform</p>
              </div>
              <button onClick={() => setUniModal(true)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`, color: colors.navyDark, border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif" }}>
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
                    <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: `linear-gradient(135deg, rgba(194,160,114,0.2), rgba(194,160,114,0.05))`, border: `1px solid rgba(194,160,114,0.3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C2A072" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "bold", color: colors.navyDark }}>{u.name}</div>
                      <div style={{ fontSize: "12px", color: "#999", marginTop: "4px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span>{u.wilaya}</span>
                        <span style={{ color: "#ddd" }}>|</span>
                        <span>{u.admins} admin{u.admins !== 1 ? "s" : ""}</span>
                        <span style={{ color: "#ddd" }}>|</span>
                        <span>{u.students} student{u.students !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ background: u.is_active ? "rgba(194,160,114,0.12)" : "rgba(0,0,0,0.05)", color: u.is_active ? colors.gold : "#aaa", fontSize: "10px", letterSpacing: "1px", padding: "4px 12px", borderRadius: "20px", border: `1px solid ${u.is_active ? "rgba(194,160,114,0.3)" : "rgba(0,0,0,0.08)"}` }}>
                      {u.is_active ? "● ACTIVE" : "○ INACTIVE"}
                    </span>
                    <button onClick={() => { setEditUniForm({ id: u.id, name: u.name, wilaya: u.wilaya, email: u.email || "" }); setEditUniModal(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: colors.gold, padding: "4px" }} title="Edit">
                      <FiEdit2 size={18} />
                    </button>
                    <button onClick={() => handleDeleteUniversity(u.id, u.name)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e74c3c", padding: "4px" }} title="Delete">
                      <FiTrash2 size={18} />
                    </button>
                    <button onClick={() => handleToggleUniversity(u.id)} style={{ background: "none", border: "none", cursor: "pointer", color: colors.gold, padding: 0 }} title={u.is_active ? "Deactivate" : "Activate"}>
                      {u.is_active ? <FiToggleRight size={28} /> : <FiToggleLeft size={28} style={{ color: "#ccc" }} />}
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

        {/* ══════════ ADMINS TAB ══════════ */}
        {active === "admins" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
              <div>
                <div style={{ fontSize: "11px", color: colors.gold, letterSpacing: "3px", marginBottom: "8px" }}>✦ MANAGE</div>
                <h1 style={{ fontSize: "32px", color: colors.navyDark, fontWeight: "bold", margin: 0 }}>Admins</h1>
                <p style={{ color: "#888", marginTop: "6px", fontSize: "14px" }}>{admins.length} administrators on the platform</p>
              </div>
              <button onClick={() => setAdminModal(true)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`, color: colors.navyDark, border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif" }}>
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
                  <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold", color: colors.navyDark, flexShrink: 0 }}>
                    {a.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: "bold", color: colors.navyDark }}>{a.full_name}</div>
                    <div style={{ fontSize: "12px", color: "#999", marginTop: "4px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span>{a.email}</span>
                      <span style={{ color: "#ddd" }}>|</span>
                      <span>{a.university}</span>
                    </div>
                  </div>

                  {/* REVOKE BUTTON */}
                  <button
                    onClick={() => handleRevokeAdmin(a.id, a.full_name)}
                    style={{ marginLeft: "auto", background: "none", border: `1px solid #fee2e2`, borderRadius: "8px", cursor: "pointer", color: "#e74c3c", padding: "8px 14px", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", fontFamily: "Georgia, serif" }}
                  >
                    <FiTrash2 size={13} /> Revoke
                  </button>
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

        {/* ══════════ STATISTICS TAB ══════════ */}
        {active === "statistics" && (
          <>
            <div style={{ marginBottom: "32px" }}>
              <div style={{ fontSize: "11px", color: colors.gold, letterSpacing: "3px", marginBottom: "8px" }}>✦ PLATFORM</div>
              <h1 style={{ fontSize: "32px", color: colors.navyDark, fontWeight: "bold", margin: 0 }}>Statistics</h1>
              <p style={{ color: "#888", marginTop: "6px", fontSize: "14px" }}>Full overview of the platform activity.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "28px" }}>
              {[
                { label: "Total Universities",   value: universities.length },
                { label: "Total Admins",          value: admins.length       },
                { label: "Total Students",        value: totalStudents       },
                { label: "Active Universities",   value: activeUnis          },
                { label: "Inactive Universities", value: inactiveUnis        },
                { label: "Admins Assigned",       value: adminsAssigned      },
              ].map((card, i) => (
                <div key={i} className="card-hover" style={{ background: "#fff", borderRadius: "16px", padding: "28px 24px", boxShadow: "0 4px 20px rgba(17,34,80,0.07)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold})`, borderRadius: "16px 16px 0 0" }} />
                  <div style={{ fontSize: "36px", fontWeight: "bold", color: colors.navyDark, lineHeight: 1 }}>{card.value}</div>
                  <div style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>{card.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 20px rgba(17,34,80,0.07)" }}>
              <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "2px", marginBottom: "4px" }}>BREAKDOWN</div>
              <h2 style={{ fontSize: "18px", color: colors.navyDark, margin: "0 0 24px", fontWeight: "bold" }}>Students per University</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid rgba(194,160,114,0.2)` }}>
                    <th style={{ textAlign: "left",   padding: "10px 16px", color: colors.gold, fontSize: "11px", letterSpacing: "1px" }}>UNIVERSITY</th>
                    <th style={{ textAlign: "left",   padding: "10px 16px", color: colors.gold, fontSize: "11px", letterSpacing: "1px" }}>WILAYA</th>
                    <th style={{ textAlign: "center", padding: "10px 16px", color: colors.gold, fontSize: "11px", letterSpacing: "1px" }}>ADMINS</th>
                    <th style={{ textAlign: "center", padding: "10px 16px", color: colors.gold, fontSize: "11px", letterSpacing: "1px" }}>STUDENTS</th>
                    <th style={{ textAlign: "center", padding: "10px 16px", color: colors.gold, fontSize: "11px", letterSpacing: "1px" }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {universities.map((u, i) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid rgba(194,160,114,0.1)", background: i % 2 === 0 ? "#fff" : "#fdfcfb" }}>
                      <td style={{ padding: "14px 16px", color: colors.navyDark, fontWeight: "bold" }}>{u.name}</td>
                      <td style={{ padding: "14px 16px", color: "#888" }}>{u.wilaya}</td>
                      <td style={{ padding: "14px 16px", color: colors.navyDark, textAlign: "center" }}>{u.admins}</td>
                      <td style={{ padding: "14px 16px", color: colors.navyDark, textAlign: "center" }}>{u.students}</td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <span style={{ padding: "3px 12px", borderRadius: "20px", fontSize: "10px", fontWeight: "bold", background: u.is_active ? "rgba(194,160,114,0.12)" : "rgba(0,0,0,0.05)", color: u.is_active ? colors.gold : "#aaa", border: `1px solid ${u.is_active ? "rgba(194,160,114,0.3)" : "rgba(0,0,0,0.08)"}` }}>
                          {u.is_active ? "● ACTIVE" : "○ INACTIVE"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {universities.length === 0 && <div style={{ textAlign: "center", padding: "40px", color: "#bbb" }}>No data yet.</div>}
            </div>
          </>
        )}

        {/* ══════════ MESSAGES TAB ══════════ */}
        {active === "messages" && (
          <>
            <div style={{ marginBottom: "32px" }}>
              <div style={{ fontSize: "11px", color: colors.gold, letterSpacing: "3px", marginBottom: "8px" }}>✦ INBOX</div>
              <h1 style={{ fontSize: "32px", color: colors.navyDark, fontWeight: "bold", margin: 0 }}>Contact Messages</h1>
              <p style={{ color: "#888", marginTop: "6px", fontSize: "14px" }}>{messages.length} message{messages.length !== 1 ? "s" : ""} received</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {messages.map((m, i) => (
                <div key={m.id} className="card-hover" style={{ background: "#fff", borderRadius: "16px", padding: "24px 28px", boxShadow: "0 4px 20px rgba(17,34,80,0.07)", borderLeft: `4px solid ${colors.gold}`, animation: `fadeUp 0.4s ease ${i * 0.08}s both` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ width: "46px", height: "46px", borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold", color: colors.navyDark }}>
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: "bold", color: colors.navyDark }}>{m.name}</div>
                        <div style={{ fontSize: "12px", color: colors.gold, marginTop: "2px" }}>{m.email}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: "11px", color: "#bbb" }}>
                      {new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {m.subject && <div style={{ marginTop: "16px", fontSize: "13px", fontWeight: "bold", color: colors.navyDark }}>Subject: {m.subject}</div>}
                  <div style={{ marginTop: "10px", fontSize: "14px", color: "#555", lineHeight: 1.7, background: colors.offWhite, padding: "14px 18px", borderRadius: "10px" }}>{m.message}</div>
                  <div style={{ marginTop: "14px" }}>
                    <a href={`mailto:${m.email}?subject=Re: ${m.subject || 'Your message'}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 18px", background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`, borderRadius: "8px", fontSize: "12px", fontWeight: "bold", color: colors.navyDark, textDecoration: "none" }}>
                      <FiMail size={13} /> Reply via Email
                    </a>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px", color: "#bbb", background: "#fff", borderRadius: "16px" }}>
                  <div style={{ color: "#ddd", marginBottom: "12px" }}><FiMail size={40} /></div>
                  <p>No messages yet.</p>
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
            <input className="inp" value={uniForm.name} onChange={e => setUniForm({ ...uniForm, name: e.target.value })} placeholder="USTHB" style={inputStyle} />
            <label style={labelStyle}>WILAYA *</label>
            <input className="inp" value={uniForm.wilaya} onChange={e => setUniForm({ ...uniForm, wilaya: e.target.value })} placeholder="Alger" style={inputStyle} />
            <label style={labelStyle}>EMAIL (optional)</label>
            <input className="inp" value={uniForm.email} onChange={e => setUniForm({ ...uniForm, email: e.target.value })} placeholder="contact@univ.dz" style={inputStyle} />
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button onClick={() => setUniModal(false)} style={{ flex: 1, padding: "12px", background: "none", border: `1.5px solid #ddd`, borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontFamily: "Georgia, serif" }}>Cancel</button>
              <button onClick={handleAddUniversity} style={{ flex: 2, padding: "12px", background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`, border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "bold", color: colors.navyDark, fontFamily: "Georgia, serif" }}>
                <FiSave style={{ marginRight: "8px" }} /> ADD UNIVERSITY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ EDIT UNIVERSITY MODAL ══════════ */}
      {editUniModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(17,34,80,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "480px", boxShadow: "0 30px 80px rgba(17,34,80,0.25)", animation: "modalIn 0.3s ease forwards", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold})`, borderRadius: "20px 20px 0 0" }} />
            <button onClick={() => setEditUniModal(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "20px" }}><FiX /></button>
            <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "2px", marginBottom: "6px" }}>✦ EDIT UNIVERSITY</div>
            <h2 style={{ fontSize: "20px", color: colors.navyDark, margin: "0 0 24px", fontWeight: "bold" }}>Edit University</h2>
            <label style={labelStyle}>UNIVERSITY NAME *</label>
            <input className="inp" value={editUniForm.name} onChange={e => setEditUniForm({ ...editUniForm, name: e.target.value })} style={inputStyle} />
            <label style={labelStyle}>WILAYA *</label>
            <input className="inp" value={editUniForm.wilaya} onChange={e => setEditUniForm({ ...editUniForm, wilaya: e.target.value })} style={inputStyle} />
            <label style={labelStyle}>EMAIL (optional)</label>
            <input className="inp" value={editUniForm.email} onChange={e => setEditUniForm({ ...editUniForm, email: e.target.value })} style={inputStyle} />
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button onClick={() => setEditUniModal(false)} style={{ flex: 1, padding: "12px", background: "none", border: `1.5px solid #ddd`, borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontFamily: "Georgia, serif" }}>Cancel</button>
              <button onClick={handleEditUniversity} style={{ flex: 2, padding: "12px", background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`, border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "bold", color: colors.navyDark, fontFamily: "Georgia, serif" }}>
                <FiSave style={{ marginRight: "8px" }} /> SAVE CHANGES
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
            <input className="inp" value={adminForm.full_name} onChange={e => setAdminForm({ ...adminForm, full_name: e.target.value })} placeholder="Ahmed Benali" style={inputStyle} />
            <label style={labelStyle}>EMAIL *</label>
            <input className="inp" value={adminForm.email} onChange={e => setAdminForm({ ...adminForm, email: e.target.value })} placeholder="admin@usthb.dz" style={inputStyle} />
            <label style={labelStyle}>PASSWORD *</label>
            <input className="inp" type="password" value={adminForm.password} onChange={e => setAdminForm({ ...adminForm, password: e.target.value })} placeholder="••••••••" style={inputStyle} />
            <label style={labelStyle}>UNIVERSITY *</label>
            <select className="inp" value={adminForm.university_id} onChange={e => setAdminForm({ ...adminForm, university_id: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">Select university</option>
              {universities.map(u => <option key={u.id} value={u.id}>{u.name} — {u.wilaya}</option>)}
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

      {/* ══════════ CUSTOM CONFIRM MODAL (replaces window.confirm) ══════════ */}
      {confirmModal.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(17,34,80,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(6px)" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "420px", boxShadow: "0 30px 80px rgba(17,34,80,0.3)", animation: "modalIn 0.3s ease forwards", position: "relative", textAlign: "center" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #e74c3c, #ff6b6b)", borderRadius: "20px 20px 0 0" }} />

            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <FiTrash2 size={26} color="#e74c3c" />
            </div>

            <h2 style={{ fontSize: "20px", color: colors.navyDark, margin: "0 0 12px", fontWeight: "bold" }}>Are you sure?</h2>
            <p style={{ fontSize: "14px", color: "#888", lineHeight: 1.7, margin: "0 0 32px" }}>{confirmModal.message}</p>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={closeConfirm}
                style={{ flex: 1, padding: "13px", background: "none", border: "1.5px solid #ddd", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontFamily: "Georgia, serif", color: colors.navyDark }}
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                style={{ flex: 1, padding: "13px", background: "linear-gradient(135deg, #e74c3c, #ff6b6b)", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "bold", color: "#fff", fontFamily: "Georgia, serif" }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}