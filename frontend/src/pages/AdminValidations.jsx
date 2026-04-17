import { useState, useEffect } from "react";
import {
  FiHome, FiCheckCircle, FiBarChart2, FiLogOut,
  FiX, FiAlertCircle, FiUser, FiBriefcase, FiFileText
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const colors = {
  navyDark:   "#112250",
  navyMedium: "#1C3160",
  gold:       "#C2A072",
  lightGold:  "#E0C58F",
  offWhite:   "#F5F0E9",
};

const sidebarLinks = [
  { icon: <FiHome />,        label: "Dashboard",   key: "dashboard"   },
  { icon: <FiCheckCircle />, label: "Validations", key: "validations" },
  { icon: <FiBarChart2 />,   label: "Statistics",  key: "statistics"  },
];

export default function AdminValidations() {
  const navigate = useNavigate();
  const [active, setActive]       = useState("validations");
  const [hovered, setHovered]     = useState(null);
  const [visible, setVisible]     = useState(false);
  const [pending, setPending]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [rejectModal, setRejectModal] = useState(null); // holds the application
  const [reason, setReason]       = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const adminName   = localStorage.getItem("full_name") || "Admin";
  const adminUserId = localStorage.getItem("user_id");

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token")
const res = await fetch("http://127.0.0.1:8000/api/admin/pending/", {
    headers: { "Authorization": `Bearer ${token}` }
});
      const data = await res.json();
      setPending(data);
    } catch (err) {
      console.error("Failed to fetch pending:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (applicationId) => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/validate/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        
        body: JSON.stringify({
          application_id: applicationId,
          admin_user_id:  adminUserId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg("✅ Internship validated and PDF generated!");
        fetchPending();
      } else {
        setActionMsg(`❌ ${data.error}`);
      }
    } catch {
      setActionMsg("❌ Something went wrong.");
    }
    setTimeout(() => setActionMsg(""), 4000);
  };

  const handleReject = async () => {
    const token = localStorage.getItem("token") 
    if (!reason.trim()) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/reject/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          application_id: rejectModal.application_id,
          admin_user_id:  adminUserId,
          reason:         reason,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg("🚫 Internship rejected and notifications sent!");
        setRejectModal(null);
        setReason("");
        fetchPending();
      } else {
        setActionMsg(`❌ ${data.error}`);
      }
    } catch {
      setActionMsg("❌ Something went wrong.");
    }
    setTimeout(() => setActionMsg(""), 4000);
  };

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      fontFamily: "Georgia, serif", background: colors.offWhite,
    }}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-30px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes fadeUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1;   }
          50%       { opacity: 0.6; }
        }
        @keyframes goldLine {
          from { width: 0; } to { width: 100%; }
        }
        .nav-link { transition: all 0.3s cubic-bezier(0.4,0,0.2,1) !important; }
        .nav-link:hover { padding-left: 32px !important; }
        .card-hover { transition: all 0.3s ease !important; }
        .card-hover:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 40px rgba(17,34,80,0.12) !important;
        }
        .btn-validate {
          background: linear-gradient(135deg, #27AE60, #2ecc71);
          color: white; border: none; padding: 9px 20px;
          border-radius: 8px; cursor: pointer; font-size: 13px;
          font-family: Georgia, serif; letter-spacing: 0.5px;
          transition: all 0.3s ease;
        }
        .btn-validate:hover { opacity: 0.85; transform: translateY(-1px); }
        .btn-reject {
          background: transparent;
          color: #e74c3c; border: 1px solid #e74c3c;
          padding: 9px 20px; border-radius: 8px;
          cursor: pointer; font-size: 13px;
          font-family: Georgia, serif; letter-spacing: 0.5px;
          transition: all 0.3s ease;
        }
        .btn-reject:hover {
          background: #e74c3c; color: white;
          transform: translateY(-1px);
        }
      `}</style>

      {/* ══════════ SIDEBAR ══════════ */}
      <div style={{
        width: "270px", background: colors.navyDark,
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, bottom: 0,
        boxShadow: "6px 0 30px rgba(0,0,0,0.4)",
        zIndex: 100, animation: "slideIn 0.5s ease forwards",
      }}>
        <div style={{
          height: "3px",
          background: `linear-gradient(90deg, ${colors.navyDark}, ${colors.gold}, ${colors.lightGold}, ${colors.gold}, ${colors.navyDark})`,
          backgroundSize: "200% auto", animation: "shimmer 3s linear infinite",
        }} />

        <div style={{
          padding: "28px 24px 20px",
          borderBottom: `1px solid rgba(194,160,114,0.2)`,
          textAlign: "center",
        }}>
          <div style={{
            width: "60px", height: "60px", borderRadius: "50%",
            border: `2px solid rgba(194,160,114,0.3)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 12px",
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
          <div style={{ fontSize: "9px", color: colors.lightGold, letterSpacing: "3px", marginTop: "2px", opacity: 0.6 }}>✦ ADMIN PORTAL ✦</div>
          <div style={{
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`,
            marginTop: "16px",
            animation: visible ? "goldLine 1s ease forwards" : "none",
          }} />
          <div style={{ color: colors.offWhite, fontSize: "13px", marginTop: "12px", fontWeight: "bold" }}>{adminName}</div>
          <div style={{ color: colors.gold, fontSize: "10px", letterSpacing: "2px", marginTop: "2px", opacity: 0.7 }}>ADMINISTRATOR</div>
        </div>

        <nav style={{ flex: 1, padding: "20px 0" }}>
          <div style={{ fontSize: "9px", color: colors.gold, letterSpacing: "2px", padding: "0 24px 12px", opacity: 0.5 }}>NAVIGATION</div>
          {sidebarLinks.map((link, i) => (
            <div
              key={link.key}
              className="nav-link"
              onMouseEnter={() => setHovered(link.key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                setActive(link.key);
                if (link.key === "dashboard")   navigate("/admin/dashboard");
                if (link.key === "validations") navigate("/admin/validations");
                if (link.key === "statistics")  navigate("/admin/statistics");
              }}
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
                <div style={{
                  marginLeft: "auto", width: "6px", height: "6px",
                  borderRadius: "50%", background: colors.gold,
                  animation: "pulse 2s ease infinite",
                }} />
              )}
            </div>
          ))}
        </nav>

        <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, rgba(194,160,114,0.4), transparent)`, margin: "0 24px" }} />
        <div
          onMouseEnter={() => setHovered("logout")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
          style={{
            display: "flex", alignItems: "center", gap: "14px",
            padding: "20px 24px", cursor: "pointer",
            color: hovered === "logout" ? "#ff6b6b" : "rgba(245,240,233,0.5)",
            transition: "all 0.3s ease", fontSize: "13px", letterSpacing: "0.5px",
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

        <div style={{
          height: "2px",
          background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold}, transparent)`,
          marginBottom: "40px", borderRadius: "2px",
        }} />

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ fontSize: "11px", color: colors.gold, letterSpacing: "3px", marginBottom: "8px" }}>✦ ADMIN PANEL</div>
          <h1 style={{ fontSize: "34px", color: colors.navyDark, fontWeight: "bold", margin: 0, letterSpacing: "1px" }}>Validations</h1>
          <p style={{ color: "#888", marginTop: "8px", fontSize: "14px" }}>
            Review and validate pending internship agreements.
          </p>
        </div>

        {/* Action message */}
        {actionMsg && (
          <div style={{
            background: actionMsg.startsWith("✅") ? "#eafaf1" : actionMsg.startsWith("🚫") ? "#fdf2f2" : "#fdf2f2",
            border: `1px solid ${actionMsg.startsWith("✅") ? "#27AE60" : "#e74c3c"}`,
            borderRadius: "10px", padding: "14px 20px",
            marginBottom: "24px", fontSize: "14px",
            color: actionMsg.startsWith("✅") ? "#27AE60" : "#e74c3c",
          }}>
            {actionMsg}
          </div>
        )}

        {/* Cards */}
        {loading ? (
          <div style={{ textAlign: "center", color: colors.gold, fontSize: "16px", marginTop: "60px" }}>Loading...</div>
        ) : pending.length === 0 ? (
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "60px",
            textAlign: "center", boxShadow: "0 4px 20px rgba(17,34,80,0.07)",
          }}>
            <FiCheckCircle size={48} style={{ color: colors.gold, opacity: 0.4, marginBottom: "16px" }} />
            <p style={{ color: "#aaa", fontSize: "16px" }}>No pending internships to validate.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {pending.map((item, i) => (
              <div
                key={item.application_id}
                className="card-hover"
                style={{
                  background: "#fff", borderRadius: "16px", padding: "28px 32px",
                  boxShadow: "0 4px 20px rgba(17,34,80,0.07)",
                  animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
                  position: "relative", overflow: "hidden",
                }}
              >
                {/* Gold top line */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                  background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold})`,
                  borderRadius: "16px 16px 0 0",
                }} />

                {/* File status badge */}
                <div style={{
                  position: "absolute", top: "20px", right: "24px",
                  background: item.file_complete ? "#eafaf1" : "#fdf2f2",
                  color: item.file_complete ? "#27AE60" : "#e74c3c",
                  border: `1px solid ${item.file_complete ? "#27AE60" : "#e74c3c"}`,
                  borderRadius: "20px", padding: "4px 14px", fontSize: "11px",
                  letterSpacing: "0.5px", fontWeight: "bold",
                }}>
                  {item.file_complete ? "✅ File Complete" : `❌ Missing: ${item.missing_fields.join(", ")}`}
                </div>

                {/* Top info row */}
                <div style={{ display: "flex", gap: "40px", marginBottom: "20px", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "1px", marginBottom: "4px" }}>
                      <FiUser style={{ marginRight: "4px" }} /> STUDENT
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: "bold", color: colors.navyDark }}>{item.student_name}</div>
                    <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{item.student_email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "1px", marginBottom: "4px" }}>
                      <FiBriefcase style={{ marginRight: "4px" }} /> COMPANY
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: "bold", color: colors.navyDark }}>{item.company_name}</div>
                    <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{item.offer_title}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "1px", marginBottom: "4px" }}>
                      <FiFileText style={{ marginRight: "4px" }} /> STUDENT INFO
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>🎓 {item.student_university || "—"}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>📍 {item.student_wilaya || "—"}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>🛠 {item.student_skills || "—"}</div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", margin: "16px 0" }} />

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    className="btn-validate"
                    disabled={!item.file_complete}
                    style={{ opacity: item.file_complete ? 1 : 0.4, cursor: item.file_complete ? "pointer" : "not-allowed" }}
                    onClick={() => handleValidate(item.application_id)}
                  >
                    ✅ Validate & Generate PDF
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => setRejectModal(item)}
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════ REJECT MODAL ══════════ */}
      {rejectModal && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 999,
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px",
            padding: "40px", width: "480px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            position: "relative",
          }}>
            {/* Gold top line */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "3px",
              background: `linear-gradient(90deg, #e74c3c, #ff6b6b)`,
              borderRadius: "16px 16px 0 0",
            }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ color: colors.navyDark, fontSize: "18px", margin: 0 }}>Reject Internship</h2>
              <FiX style={{ cursor: "pointer", color: "#aaa" }} size={20} onClick={() => { setRejectModal(null); setReason(""); }} />
            </div>

            <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
              You are rejecting <b>{rejectModal.student_name}</b>'s internship at <b>{rejectModal.company_name}</b>.
              Both the student and company will be notified with your reason.
            </p>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "12px", color: colors.gold, letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
                REASON FOR REJECTION
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Write the reason here..."
                rows={4}
                style={{
                  width: "100%", borderRadius: "10px",
                  border: `1px solid rgba(194,160,114,0.4)`,
                  padding: "12px", fontSize: "14px",
                  fontFamily: "Georgia, serif", resize: "none",
                  outline: "none", boxSizing: "border-box",
                  color: colors.navyDark,
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => { setRejectModal(null); setReason(""); }}
                style={{
                  background: "transparent", border: `1px solid #ddd`,
                  padding: "10px 24px", borderRadius: "8px",
                  cursor: "pointer", fontSize: "13px", fontFamily: "Georgia, serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!reason.trim()}
                style={{
                  background: reason.trim() ? "#e74c3c" : "#ccc",
                  color: "white", border: "none",
                  padding: "10px 24px", borderRadius: "8px",
                  cursor: reason.trim() ? "pointer" : "not-allowed",
                  fontSize: "13px", fontFamily: "Georgia, serif",
                  transition: "all 0.3s ease",
                }}
              >
                Send Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}