import { useState, useEffect } from "react";
import {
  FiHome, FiUser, FiList, FiUsers, FiLogOut,
  FiCheckCircle, FiXCircle, FiGithub, FiMail,
  FiFilter, FiBriefcase,
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
  { icon: <FiHome />,  label: "Dashboard",  key: "dashboard"  },
  { icon: <FiUser />,  label: "My Profile", key: "profile"    },
  { icon: <FiList />,  label: "My Offers",  key: "offers"     },
  { icon: <FiUsers />, label: "Applicants", key: "applicants" },
];

export default function Applicants() {
  const navigate = useNavigate();
  const [active, setActive]       = useState("applicants");
  const [hovered, setHovered]     = useState(null);
  const [filter, setFilter]       = useState("all");
  const [applicants, setApplicants] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);
  const [loading, setLoading]     = useState(true);

  const companyName = localStorage.getItem("full_name") || "Company";
  const token       = localStorage.getItem("token");
  const user_id     = localStorage.getItem("user_id");

  // Load applicants on page open
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/company/applicants/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ company_id: user_id })
        })
        const data = await res.json()
        console.log("APPLICANTS:", data)
        if (res.ok) setApplicants(data)
      } catch (err) {
        console.log("Failed to load applicants", err)
      } finally {
        setLoading(false)
      }
    }
    fetchApplicants()
  }, [])
  const handleDecide = async (id, decision) => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/company/decide/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        application_id: id,
        decision: decision
      })
    })
    const data = await res.json()
    console.log("DECIDE RESPONSE:", data)
    if (res.ok) {
      setApplicants(applicants.map(a =>
        a.id === id ? { ...a, status: decision } : a
      ))
      setConfirmModal(null)
    } else {
      alert("Error: " + JSON.stringify(data))
    }
  } catch (err) {
    console.log("Decide failed", err)
  }
}

  const filtered = filter === "all"
    ? applicants
    : applicants.filter(a => a.status === filter);

  const counts = {
    all:      applicants.length,
    pending:  applicants.filter(a => a.status === "pending").length,
    accepted: applicants.filter(a => a.status === "accepted").length,
    refused:  applicants.filter(a => a.status === "refused").length,
  };

  const statusStyle = {
    pending:  { bg: "rgba(194,160,114,0.12)", color: colors.gold,    border: "rgba(194,160,114,0.3)", label: "PENDING"  },
    accepted: { bg: "rgba(92,138,90,0.12)",   color: "#5C8A5A",      border: "rgba(92,138,90,0.3)",   label: "ACCEPTED" },
    refused:  { bg: "rgba(224,85,85,0.10)",   color: "#e05555",      border: "rgba(224,85,85,0.3)",   label: "REFUSED"  },
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
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
        @keyframes modalIn {
          from { transform: scale(0.92) translateY(20px); opacity: 0; }
          to   { transform: scale(1)    translateY(0);    opacity: 1; }
        }
        .nav-link { transition: all 0.3s cubic-bezier(0.4,0,0.2,1) !important; }
        .nav-link:hover { padding-left: 32px !important; }
        .card { transition: all 0.3s ease !important; }
        .card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 40px rgba(17,34,80,0.12) !important;
        }
        .filter-btn { transition: all 0.2s ease !important; }
        .filter-btn:hover { transform: translateY(-1px) !important; }
        .action-btn { transition: all 0.2s ease !important; }
        .action-btn:hover { transform: scale(1.05) !important; }
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
              {companyName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: colors.gold, letterSpacing: "4px" }}>
            STAG.IO
          </div>
          <div style={{ fontSize: "9px", color: colors.lightGold, letterSpacing: "3px", marginTop: "2px", opacity: 0.6 }}>
            ✦ COMPANY PORTAL ✦
          </div>
          <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`, marginTop: "16px" }} />
          <div style={{ color: colors.offWhite, fontSize: "13px", marginTop: "12px", fontWeight: "bold" }}>
            {companyName}
          </div>
          <div style={{ color: colors.gold, fontSize: "10px", letterSpacing: "2px", marginTop: "2px", opacity: 0.7 }}>
            RECRUITER
          </div>
        </div>

        <nav style={{ flex: 1, padding: "20px 0" }}>
          <div style={{ fontSize: "9px", color: colors.gold, letterSpacing: "2px", padding: "0 24px 12px", opacity: 0.5 }}>
            NAVIGATION
          </div>
          {sidebarLinks.map((link, i) => (
            <div
              key={link.key} className="nav-link"
              onMouseEnter={() => setHovered(link.key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                setActive(link.key);
                if (link.key === "dashboard")  navigate("/company/dashboard");
                if (link.key === "profile")    navigate("/company/profile");
                if (link.key === "offers")     navigate("/company/offers");
                if (link.key === "applicants") navigate("/company/applicants");
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
          onClick={() => { localStorage.clear(); navigate("/login"); }}
          style={{
            display: "flex", alignItems: "center", gap: "14px",
            padding: "20px 24px", cursor: "pointer",
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
      <div style={{
        marginLeft: "270px", flex: 1, padding: "48px 40px",
        animation: "fadeUp 0.6s ease forwards",
      }}>
        <div style={{
          height: "2px",
          background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold}, transparent)`,
          marginBottom: "40px", borderRadius: "2px",
        }} />

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", color: colors.gold, letterSpacing: "3px", marginBottom: "8px" }}>
            ✦ CANDIDATES
          </div>
          <h1 style={{ fontSize: "32px", color: colors.navyDark, fontWeight: "bold", margin: 0 }}>
            Applicants
          </h1>
          <p style={{ color: "#888", marginTop: "8px", fontSize: "14px" }}>
            Review and manage students who applied to your offers.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "32px", flexWrap: "wrap" }}>
          {[
            { key: "all",      label: "All" },
            { key: "pending",  label: "Pending" },
            { key: "accepted", label: "Accepted" },
            { key: "refused",  label: "Refused" },
          ].map(tab => (
            <button
              key={tab.key} className="filter-btn"
              onClick={() => setFilter(tab.key)}
              style={{
                padding: "8px 20px",
                background: filter === tab.key ? colors.navyDark : "#fff",
                color: filter === tab.key ? colors.gold : "#999",
                border: filter === tab.key ? `1px solid ${colors.navyDark}` : "1px solid rgba(17,34,80,0.12)",
                borderRadius: "20px", cursor: "pointer",
                fontSize: "12px", letterSpacing: "0.5px",
                fontFamily: "Georgia, serif",
              }}
            >
              {tab.label}
              <span style={{
                marginLeft: "6px",
                background: filter === tab.key ? "rgba(194,160,114,0.2)" : "rgba(17,34,80,0.06)",
                color: filter === tab.key ? colors.gold : "#bbb",
                fontSize: "10px", padding: "1px 7px", borderRadius: "10px",
              }}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>
  

  
        {/* Applicant cards */}
        {filtered.length === 0 ? (
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "60px 20px",
            textAlign: "center", boxShadow: "0 4px 20px rgba(17,34,80,0.07)",
          }}>
            <div style={{
              width: "70px", height: "70px", borderRadius: "50%",
              background: "rgba(194,160,114,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <FiUsers size={28} style={{ color: colors.gold, opacity: 0.4 }} />
            </div>
            <p style={{ fontSize: "16px", color: "#aaa" }}>No applicants in this category</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filtered.map((app, i) => {
              const s = statusStyle[app.status];
              return (
                <div key={app.id} className="card" style={{
                  background: "#fff", borderRadius: "16px", padding: "28px 32px",
                  boxShadow: "0 4px 20px rgba(17,34,80,0.07)",
                  borderLeft: `4px solid ${s.color}`,
                  animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
                  position: "relative",
                }}>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>

                    {/* Left — student info */}
                    <div style={{ flex: 1 }}>
                      {/* Name + avatar */}
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
                        <div style={{
                          width: "46px", height: "46px", borderRadius: "50%",
                          background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "16px", fontWeight: "bold", color: colors.navyDark,
                          flexShrink: 0,
                        }}>
                          {app.student_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontSize: "16px", fontWeight: "bold", color: colors.navyDark, margin: 0 }}>
                            {app.student_name}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "3px" }}>
                            <FiMail size={11} style={{ color: colors.gold }} />
                            <span style={{ fontSize: "12px", color: "#999" }}>{app.student_email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Offer applied to */}
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                        <FiBriefcase size={13} style={{ color: colors.gold }} />
                        <span style={{ fontSize: "12px", color: "#888" }}>Applied for:</span>
                        <span style={{ fontSize: "12px", color: colors.navyDark, fontWeight: "bold" }}>{app.offer_title}</span>
                      </div>

                      {/* Skills */}
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                        {app.student_skills.split(",").map((skill, j) => (
                          <span key={j} style={{
                            background: colors.offWhite,
                            color: colors.navyDark,
                            border: "1px solid rgba(17,34,80,0.1)",
                            fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
                          }}>
                            {skill.trim()}
                          </span>
                        ))}
                      </div>

                      {/* GitHub */}
                      {app.student_github && (
                        <a href={app.student_github} target="_blank" rel="noreferrer"
                          style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: colors.gold, textDecoration: "none" }}
                        >
                          <FiGithub size={13} /> {app.student_github}
                        </a>
                      )}
                    </div>

                    {/* Right — status + actions */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>

                      {/* Status badge */}
                      <span style={{
                        background: s.bg, color: s.color,
                        border: `1px solid ${s.border}`,
                        fontSize: "10px", padding: "4px 14px",
                        borderRadius: "20px", letterSpacing: "1px",
                      }}>
                        ● {s.label}
                      </span>

                      {/* Applied date */}
                      <span style={{ fontSize: "11px", color: "#bbb" }}>
                        Applied {app.applied_at}
                      </span>

                      {/* Action buttons — only show if pending */}
                      {app.status === "pending" && (
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button className="action-btn"
                            onClick={() => setConfirmModal({ id: app.id, decision: "accepted" })}
                            style={{
                              display: "flex", alignItems: "center", gap: "6px",
                              padding: "8px 18px",
                              background: "rgba(92,138,90,0.1)",
                              color: "#5C8A5A",
                              border: "1px solid rgba(92,138,90,0.3)",
                              borderRadius: "8px", cursor: "pointer",
                              fontSize: "12px", fontFamily: "Georgia, serif",
                            }}
                          >
                            <FiCheckCircle size={14} /> Accept
                          </button>
                          <button className="action-btn"
                            onClick={() => setConfirmModal({ id: app.id, decision: "refused" })}
                            style={{
                              display: "flex", alignItems: "center", gap: "6px",
                              padding: "8px 18px",
                              background: "rgba(224,85,85,0.08)",
                              color: "#e05555",
                              border: "1px solid rgba(224,85,85,0.3)",
                              borderRadius: "8px", cursor: "pointer",
                              fontSize: "12px", fontFamily: "Georgia, serif",
                            }}
                          >
                            <FiXCircle size={14} /> Refuse
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════ CONFIRM MODAL ══════════ */}
      {confirmModal && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(17,34,80,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 999, backdropFilter: "blur(4px)",
        }}>
          <div style={{
            background: "#fff", borderRadius: "20px", padding: "40px",
            width: "100%", maxWidth: "400px", textAlign: "center",
            boxShadow: "0 30px 80px rgba(17,34,80,0.25)",
            animation: "modalIn 0.3s ease forwards",
          }}>
            <div style={{
              width: "60px", height: "60px", borderRadius: "50%",
              background: confirmModal.decision === "accepted" ? "rgba(92,138,90,0.1)" : "rgba(224,85,85,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              {confirmModal.decision === "accepted"
                ? <FiCheckCircle size={26} style={{ color: "#5C8A5A" }} />
                : <FiXCircle size={26} style={{ color: "#e05555" }} />
              }
            </div>
            <h3 style={{ fontSize: "18px", color: colors.navyDark, marginBottom: "8px" }}>
              {confirmModal.decision === "accepted" ? "Accept this candidate?" : "Refuse this candidate?"}
            </h3>
            <p style={{ fontSize: "13px", color: "#999", marginBottom: "28px" }}>
              {confirmModal.decision === "accepted"
                ? "The student will be notified and the admin will validate the internship agreement."
                : "The student will be notified that their application was not selected."
              }
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setConfirmModal(null)}
                style={{
                  flex: 1, padding: "12px",
                  background: "none", border: "1.5px solid rgba(17,34,80,0.15)",
                  borderRadius: "10px", cursor: "pointer",
                  fontSize: "13px", color: colors.navyDark, fontFamily: "Georgia, serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDecide(confirmModal.id, confirmModal.decision)}
                style={{
                  flex: 1, padding: "12px",
                  background: confirmModal.decision === "accepted" ? "#5C8A5A" : "#e05555",
                  border: "none", borderRadius: "10px", cursor: "pointer",
                  fontSize: "13px", color: "#fff", fontFamily: "Georgia, serif", fontWeight: "bold",
                }}
              >
                {confirmModal.decision === "accepted" ? "Yes, Accept" : "Yes, Refuse"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}