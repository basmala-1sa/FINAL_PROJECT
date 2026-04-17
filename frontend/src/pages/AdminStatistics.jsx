import { useState, useEffect } from "react";
import {
  FiHome, FiCheckCircle, FiBarChart2, FiLogOut,
  FiUsers, FiBriefcase, FiFileText, FiTrendingUp
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

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

const CHART_COLORS = ["#112250", "#C2A072", "#27AE60", "#e74c3c", "#E0C58F", "#6c8ebf"];

export default function AdminStatistics() {
  const navigate = useNavigate();
  const [active, setActive]   = useState("statistics");
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
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const studentsData = stats ? [
    { name: "Placed",   value: stats.students.placed   },
    { name: "Unplaced", value: stats.students.unplaced },
  ] : [];

  const applicationsData = stats ? [
    { name: "Pending",  value: stats.applications.pending  },
    { name: "Accepted", value: stats.applications.accepted },
    { name: "Refused",  value: stats.applications.refused  },
  ] : [];

  const agreementsData = stats ? [
    { name: "Validated", value: stats.agreements.validated },
    { name: "Rejected",  value: stats.agreements.rejected  },
  ] : [];

  const offersData = stats ? [
    { name: "Active",   value: stats.offers.active                          },
    { name: "Inactive", value: stats.offers.total - stats.offers.active     },
  ] : [];

  const wilayatData = stats
    ? stats.top_wilayat.map(w => ({ name: w.offer__wilaya, value: w.count }))
    : [];

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
          0%, 100% { opacity: 1; } 50% { opacity: 0.6; }
        }
        @keyframes goldLine {
          from { width: 0; } to { width: 100%; }
        }
        .nav-link { transition: all 0.3s cubic-bezier(0.4,0,0.2,1) !important; }
        .nav-link:hover { padding-left: 32px !important; }
        .chart-card { transition: all 0.3s ease !important; }
        .chart-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 40px rgba(17,34,80,0.12) !important;
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
          <h1 style={{ fontSize: "34px", color: colors.navyDark, fontWeight: "bold", margin: 0, letterSpacing: "1px" }}>Statistics</h1>
          <p style={{ color: "#888", marginTop: "8px", fontSize: "14px" }}>Full platform analytics and insights.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: colors.gold, fontSize: "16px", marginTop: "60px" }}>Loading...</div>
        ) : (
          <>
            {/* ── Row 1: Pie Charts ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>

              {/* Students Pie */}
              <div className="chart-card" style={{
                background: "#fff", borderRadius: "16px", padding: "28px",
                boxShadow: "0 4px 20px rgba(17,34,80,0.07)", position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold})`, borderRadius: "16px 16px 0 0" }} />
                <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "2px", marginBottom: "4px" }}>STUDENTS</div>
                <h3 style={{ color: colors.navyDark, margin: "0 0 20px", fontSize: "16px" }}>Placed vs Unplaced</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={studentsData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {studentsData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Offers Pie */}
              <div className="chart-card" style={{
                background: "#fff", borderRadius: "16px", padding: "28px",
                boxShadow: "0 4px 20px rgba(17,34,80,0.07)", position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold})`, borderRadius: "16px 16px 0 0" }} />
                <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "2px", marginBottom: "4px" }}>OFFERS</div>
                <h3 style={{ color: colors.navyDark, margin: "0 0 20px", fontSize: "16px" }}>Active vs Inactive</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={offersData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {offersData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Row 2: Bar Charts ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>

              {/* Applications Bar */}
              <div className="chart-card" style={{
                background: "#fff", borderRadius: "16px", padding: "28px",
                boxShadow: "0 4px 20px rgba(17,34,80,0.07)", position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold})`, borderRadius: "16px 16px 0 0" }} />
                <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "2px", marginBottom: "4px" }}>APPLICATIONS</div>
                <h3 style={{ color: colors.navyDark, margin: "0 0 20px", fontSize: "16px" }}>By Status</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={applicationsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#888" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#888" }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {applicationsData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Agreements Bar */}
              <div className="chart-card" style={{
                background: "#fff", borderRadius: "16px", padding: "28px",
                boxShadow: "0 4px 20px rgba(17,34,80,0.07)", position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold})`, borderRadius: "16px 16px 0 0" }} />
                <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "2px", marginBottom: "4px" }}>AGREEMENTS</div>
                <h3 style={{ color: colors.navyDark, margin: "0 0 20px", fontSize: "16px" }}>Validated vs Rejected</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={agreementsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#888" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#888" }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {agreementsData.map((_, i) => <Cell key={i} fill={i === 0 ? "#27AE60" : "#e74c3c"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Row 3: Top Wilayat Bar ── */}
            <div className="chart-card" style={{
              background: "#fff", borderRadius: "16px", padding: "28px",
              boxShadow: "0 4px 20px rgba(17,34,80,0.07)", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold})`, borderRadius: "16px 16px 0 0" }} />
              <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "2px", marginBottom: "4px" }}>GEOGRAPHY</div>
              <h3 style={{ color: colors.navyDark, margin: "0 0 20px", fontSize: "16px" }}>Top Wilayat by Applications</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={wilayatData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#888" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#888" }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {wilayatData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}