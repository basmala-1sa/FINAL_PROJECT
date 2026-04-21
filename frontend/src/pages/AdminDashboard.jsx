import { useState, useEffect } from "react";
import { FiHome, FiCheckCircle, FiBarChart2, FiLogOut, FiUsers, FiBriefcase, FiFileText, FiClock } from "react-icons/fi";
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [active, setActive]   = useState("dashboard");
  const [hovered, setHovered] = useState(null);
  const [visible, setVisible] = useState(false);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  const adminName = localStorage.getItem("full_name") || "Admin";

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/admin/stats/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      console.log("STATS DATA:", JSON.stringify(data))
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "Georgia, serif",
      background: colors.offWhite,
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
          from { width: 0;    }
          to   { width: 100%; }
        }
        .nav-link { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
        .nav-link:hover { padding-left: 32px !important; }
        .stat-card { transition: all 0.3s ease !important; }
        .stat-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 12px 40px rgba(17,34,80,0.15) !important;
        }
      `}</style>

      {/* ══════════ SIDEBAR ══════════ */}
      <div style={{
        width: "270px",
        background: colors.navyDark,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        boxShadow: "6px 0 30px rgba(0,0,0,0.4)",
        zIndex: 100,
        animation: "slideIn 0.5s ease forwards",
      }}>

        {/* Gold top shimmer line */}
        <div style={{
          height: "3px",
          background: `linear-gradient(90deg, ${colors.navyDark}, ${colors.gold}, ${colors.lightGold}, ${colors.gold}, ${colors.navyDark})`,
          backgroundSize: "200% auto",
          animation: "shimmer 3s linear infinite",
        }} />

        {/* Logo */}
        <div style={{
          padding: "28px 24px 20px",
          borderBottom: `1px solid rgba(194,160,114,0.2)`,
          textAlign: "center",
        }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <div style={{
              width: "60px", height: "60px",
              borderRadius: "50%",
              border: `2px solid rgba(194,160,114,0.3)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px",
            }}>
              <div style={{
                width: "44px", height: "44px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px", fontWeight: "bold",
                color: colors.navyDark,
              }}>
                {adminName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          <div style={{
            fontSize: "22px", fontWeight: "bold",
            color: colors.gold, letterSpacing: "4px",
          }}>
            STAG.IO
          </div>
          <div style={{
            fontSize: "9px", color: colors.lightGold,
            letterSpacing: "3px", marginTop: "2px", opacity: 0.6,
          }}>
            ✦ ADMIN PORTAL ✦
          </div>

          <div style={{
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`,
            marginTop: "16px",
            animation: visible ? "goldLine 1s ease forwards" : "none",
          }} />

          <div style={{
            color: colors.offWhite, fontSize: "13px",
            marginTop: "12px", fontWeight: "bold",
          }}>
            {adminName}
          </div>
          <div style={{
            color: colors.gold, fontSize: "10px",
            letterSpacing: "2px", marginTop: "2px", opacity: 0.7,
          }}>
            ADMINISTRATOR
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "20px 0" }}>
          <div style={{
            fontSize: "9px", color: colors.gold,
            letterSpacing: "2px", padding: "0 24px 12px", opacity: 0.5,
          }}>
            NAVIGATION
          </div>

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
                background: active === link.key
                  ? "rgba(194,160,114,0.12)"
                  : hovered === link.key
                  ? "rgba(255,255,255,0.04)"
                  : "transparent",
                borderLeft: active === link.key
                  ? `3px solid ${colors.gold}`
                  : "3px solid transparent",
                fontSize: "13px", letterSpacing: "0.5px",
                animation: `fadeUp 0.4s ease ${i * 0.1}s both`,
                position: "relative",
              }}
            >
              <span style={{ fontSize: "17px" }}>{link.icon}</span>
              {link.label}
              {active === link.key && (
                <div style={{
                  marginLeft: "auto",
                  width: "6px", height: "6px",
                  borderRadius: "50%",
                  background: colors.gold,
                  animation: "pulse 2s ease infinite",
                }} />
              )}
            </div>
          ))}
        </nav>

        <div style={{
          height: "1px",
          background: `linear-gradient(90deg, transparent, rgba(194,160,114,0.4), transparent)`,
          margin: "0 24px",
        }} />

        {/* Logout */}
        <div
          onMouseEnter={() => setHovered("logout")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
          style={{
            display: "flex", alignItems: "center", gap: "14px",
            padding: "20px 24px", cursor: "pointer",
            color: hovered === "logout" ? "#ff6b6b" : "rgba(245,240,233,0.5)",
            transition: "all 0.3s ease",
            fontSize: "13px", letterSpacing: "0.5px",
          }}
        >
          <FiLogOut size={16} />
          Sign Out
        </div>

        {/* Bottom shimmer line */}
        <div style={{
          height: "3px",
          background: `linear-gradient(90deg, ${colors.navyDark}, ${colors.gold}, ${colors.lightGold}, ${colors.gold}, ${colors.navyDark})`,
          backgroundSize: "200% auto",
          animation: "shimmer 3s linear infinite",
        }} />
      </div>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div style={{
        marginLeft: "270px", flex: 1,
        padding: "48px 40px",
        animation: "fadeUp 0.6s ease forwards",
      }}>

        <div style={{
          height: "2px",
          background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold}, transparent)`,
          marginBottom: "40px", borderRadius: "2px",
        }} />

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{
            fontSize: "11px", color: colors.gold,
            letterSpacing: "3px", marginBottom: "8px",
          }}>
            ✦ ADMIN PANEL
          </div>
          <h1 style={{
            fontSize: "34px", color: colors.navyDark,
            fontWeight: "bold", margin: 0, letterSpacing: "1px",
          }}>
            Dashboard
          </h1>
          <p style={{
            color: "#888", marginTop: "8px",
            fontSize: "14px", letterSpacing: "0.3px",
          }}>
            Full platform overview — students, companies, offers and agreements.
          </p>
        </div>

        {/* Stats Cards */}
        {loading || !stats ? (
  <div style={{ textAlign: "center", color: colors.gold, fontSize: "16px" }}>
    Loading stats...
  </div>
) : (
  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px", marginBottom: "40px",
  }}>
    {[
      { label: "Total Students",       value: stats.students.total,       icon: <FiUsers size={26}/> },
{ label: "Total Applications",   value: stats.applications.total,   icon: <FiClock size={26}/> },
{ label: "Accepted",             value: stats.applications.accepted, icon: <FiCheckCircle size={26}/> },
{ label: "Pending",              value: stats.applications.pending, icon: <FiClock size={26}/> },
{ label: "Refused",              value: stats.applications.refused, icon: <FiBarChart2 size={26}/> },
{ label: "Placed Students",      value: stats.students.placed,      icon: <FiCheckCircle size={26}/> },
{ label: "Validated Agreements", value: stats.agreements.validated, icon: <FiCheckCircle size={26}/> },
{ label: "Unplaced Students",    value: stats.students.unplaced,    icon: <FiUsers size={26}/> },
    ].map((card, i) => (
              <div
                key={i}
                className="stat-card"
                style={{
                  background: "#fff", borderRadius: "16px",
                  padding: "28px 24px",
                  boxShadow: "0 4px 20px rgba(17,34,80,0.07)",
                  position: "relative", overflow: "hidden",
                  animation: `fadeUp 0.5s ease ${i * 0.1 + 0.2}s both`,
                  cursor: "default",
                }}
              >
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  width: "60px", height: "60px",
                  background: `linear-gradient(225deg, rgba(194,160,114,0.15), transparent)`,
                  borderBottomLeftRadius: "60px",
                }} />
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0,
                  height: "3px",
                  background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold})`,
                  borderRadius: "16px 16px 0 0",
                }} />
                <div style={{ color: colors.gold, marginBottom: "16px" }}>
                  {card.icon}
                </div>
                <div style={{
                  fontSize: "36px", fontWeight: "bold",
                  color: colors.navyDark, lineHeight: 1,
                }}>
                  {card.value}
                </div>
                <div style={{
                  fontSize: "12px", color: "#999",
                  marginTop: "6px", letterSpacing: "0.5px",
                }}>
                  {card.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Top Wilayat Table */}
        {stats && (
          <div style={{
            background: "#fff", borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 4px 20px rgba(17,34,80,0.07)",
            animation: "fadeUp 0.6s ease 0.5s both",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", left: 0, top: "20%", bottom: "20%",
              width: "3px",
              background: `linear-gradient(180deg, transparent, ${colors.gold}, transparent)`,
              borderRadius: "3px",
            }} />

            <div style={{ marginBottom: "24px" }}>
              <div style={{
                fontSize: "10px", color: colors.gold,
                letterSpacing: "2px", marginBottom: "4px",
              }}>
                OVERVIEW
              </div>
              <h2 style={{
                fontSize: "18px", color: colors.navyDark,
                margin: 0, fontWeight: "bold",
              }}>
                Top Wilayat by Applications
              </h2>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid rgba(194,160,114,0.3)` }}>
                  <th style={{ textAlign: "left", padding: "10px 16px", color: colors.navyDark, fontSize: "13px" }}>#</th>
                  <th style={{ textAlign: "left", padding: "10px 16px", color: colors.navyDark, fontSize: "13px" }}>Wilaya</th>
                  <th style={{ textAlign: "left", padding: "10px 16px", color: colors.navyDark, fontSize: "13px" }}>Applications</th>
                </tr>
              </thead>
              <tbody>
  {stats.top_wilayat.length === 0 ? (
    <tr>
      <td colSpan={3} style={{
        padding: "24px", textAlign: "center",
        color: "#bbb", fontSize: "13px",
      }}>
        No applications yet
      </td>
    </tr>
  ) : stats.top_wilayat.map((w, i) => (
    <tr key={i} style={{
      borderBottom: "1px solid rgba(0,0,0,0.04)",
      background: i % 2 === 0 ? "#fff" : "rgba(194,160,114,0.03)",
    }}>
      <td style={{ padding: "12px 16px", color: colors.gold, fontWeight: "bold" }}>{i + 1}</td>
      <td style={{ padding: "12px 16px", color: colors.navyDark, fontSize: "14px" }}>{w.offer__wilaya}</td>
      <td style={{ padding: "12px 16px", color: "#666", fontSize: "14px" }}>{w.count}</td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}