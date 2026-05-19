import { useState, useEffect } from "react";
import { FiSave, FiHome, FiUser, FiList, FiUsers, FiLogOut, FiGlobe, FiMapPin, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../components/NotificationBell";

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

export default function CompanyProfile() {
  const navigate = useNavigate();
  const [active, setActive]   = useState("profile");
  const [hovered, setHovered] = useState(null);
  const [saved, setSaved]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const companyName = localStorage.getItem("full_name") || "Company";

  const [form, setForm] = useState({
    company_name: "",
    description:  "",
    location:     "",
    website:      "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
useEffect(() => {
    const fetchProfile = async () => {
        try {
          const token = localStorage.getItem("token") 
            const res = await fetch("https://final-project-rdr8.onrender.com/api/company/profile/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                
            })
            const data = await res.json()
            if (res.ok) {
                setForm({
                    company_name: data.company_name || "",
                    description:  data.description  || "",
                    location:     data.location     || "",
                    website:      data.website      || "",
                })
            }
        } catch {
            console.log("No existing profile yet")
        }
    }
    fetchProfile()
}, [])

const handleSave = async () => {
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
        const res = await fetch("https://final-project-rdr8.onrender.com/api/company/profile/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                company_name: form.company_name,
                description:  form.description,
                location:     form.location,
                website:      form.website,
            })
        })
        const data = await res.json()
        if (res.ok) {
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } else {
            setError("Failed to save profile!")
        }
    } catch {
        setError("Cannot connect to server!")
    }
    setLoading(false)
}

  const fields = [
    {
      name: "company_name",
      label: "Company Name",
      placeholder: "Google Algeria",
      icon: <FiUser />,
      type: "text",
    },
    {
      name: "location",
      label: "Location",
      placeholder: "Alger, Algeria",
      icon: <FiMapPin />,
      type: "text",
    },
    {
      name: "website",
      label: "Website",
      placeholder: "https://yourcompany.com",
      icon: <FiGlobe />,
      type: "text",
    },
  ];

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
        .nav-link { transition: all 0.3s cubic-bezier(0.4,0,0.2,1) !important; }
        .nav-link:hover { padding-left: 32px !important; }
        .form-input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          border: 1.5px solid rgba(17,34,80,0.12);
          borderRadius: 10px;
          fontSize: 14px;
          fontFamily: Georgia, serif;
          background: #fff;
          color: #112250;
          outline: none;
          transition: all 0.3s ease;
          boxSizing: border-box;
        }
        .form-input:focus {
          border-color: #C2A072 !important;
          box-shadow: 0 0 0 3px rgba(194,160,114,0.15) !important;
        }
        .save-btn {
          transition: all 0.3s ease !important;
        }
        .save-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px rgba(194,160,114,0.4) !important;
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
        {/* Shimmer top line */}
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
              {companyName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: colors.gold, letterSpacing: "4px" }}>
            STAG.IO
          </div>
          <div style={{ fontSize: "9px", color: colors.lightGold, letterSpacing: "3px", marginTop: "2px", opacity: 0.6 }}>
            ✦ COMPANY PORTAL ✦
          </div>
          <div style={{
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`,
            marginTop: "16px",
          }} />
          <div style={{ color: colors.offWhite, fontSize: "13px", marginTop: "12px", fontWeight: "bold" }}>
            {companyName}
          </div>
          <div style={{ color: colors.gold, fontSize: "10px", letterSpacing: "2px", marginTop: "2px", opacity: 0.7 }}>
            RECRUITER
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "20px 0" }}>
          <div style={{ fontSize: "9px", color: colors.gold, letterSpacing: "2px", padding: "0 24px 12px", opacity: 0.5 }}>
            NAVIGATION
          </div>
          
          {sidebarLinks.map((link, i) => (
            <div
              key={link.key}
              className="nav-link"
              onMouseEnter={() => setHovered(link.key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                setActive(link.key)
                if (link.key === "dashboard")  navigate("/company/dashboard")
                if (link.key === "profile")    navigate("/company/profile")
                if (link.key === "offers")     navigate("/company/offers")
                if (link.key === "applicants") navigate("/company/applicants")
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

        {/* Logout */}
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

        {/* Gold top border */}
        <div style={{
          height: "2px",
          background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold}, transparent)`,
          marginBottom: "40px", borderRadius: "2px",
        }} />

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ fontSize: "11px", color: colors.gold, letterSpacing: "3px", marginBottom: "8px" }}>
            ✦ COMPANY SETTINGS
          </div>
          <h1 style={{ fontSize: "32px", color: colors.navyDark, fontWeight: "bold", margin: 0 }}>
            Company Profile
          </h1>
          <p style={{ color: "#888", marginTop: "8px", fontSize: "14px" }}>
            Complete your profile so students can learn about your company.
          </p>
        </div>

        {/* Profile Form */}
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 4px 30px rgba(17,34,80,0.08)",
          maxWidth: "700px",
          position: "relative",
          overflow: "hidden",
          animation: "fadeUp 0.5s ease 0.2s both",
        }}>

          {/* Gold left accent */}
          <div style={{
            position: "absolute",
            left: 0, top: "15%", bottom: "15%",
            width: "3px",
            background: `linear-gradient(180deg, transparent, ${colors.gold}, transparent)`,
          }} />

          {/* Section label */}
          <div style={{
            fontSize: "10px", color: colors.gold,
            letterSpacing: "2px", marginBottom: "28px",
          }}>
            BASIC INFORMATION
          </div>
          {error && (
    <div style={{
        background: "#fee2e2",
        color: "#991b1b",
        borderRadius: "8px",
        padding: "11px 14px",
        fontSize: "13px",
        marginBottom: "20px",
    }}>
        {error}
    </div>
)}

          {/* Text fields */}
          {fields.map((field, i) => (
            <div key={field.name} style={{
              marginBottom: "24px",
              animation: `fadeUp 0.4s ease ${i * 0.1 + 0.3}s both`,
            }}>
              <label style={{
                display: "block",
                fontSize: "12px",
                color: colors.navyDark,
                letterSpacing: "1px",
                marginBottom: "8px",
                fontWeight: "bold",
              }}>
                {field.label.toUpperCase()}
              </label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute",
                  left: "14px", top: "50%",
                  transform: "translateY(-50%)",
                  color: colors.gold, fontSize: "16px",
                }}>
                  {field.icon}
                </span>
                <input
                  className="form-input"
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  style={{
                    width: "100%",
                    padding: "14px 16px 14px 44px",
                    border: "1.5px solid rgba(17,34,80,0.12)",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontFamily: "Georgia, serif",
                    background: "#fff",
                    color: "#112250",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = colors.gold
                    e.target.style.boxShadow = "0 0 0 3px rgba(194,160,114,0.15)"
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(17,34,80,0.12)"
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>
            </div>
          ))}

          {/* Description textarea */}
          <div style={{ marginBottom: "32px", animation: "fadeUp 0.4s ease 0.6s both" }}>
            <label style={{
              display: "block", fontSize: "12px",
              color: colors.navyDark, letterSpacing: "1px",
              marginBottom: "8px", fontWeight: "bold",
            }}>
              DESCRIPTION
            </label>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute",
                left: "14px", top: "14px",
                color: colors.gold, fontSize: "16px",
              }}>
                <FiFileText />
              </span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Tell students about your company, your culture, and what makes you unique..."
                rows={5}
                style={{
                  width: "100%",
                  padding: "14px 16px 14px 44px",
                  border: "1.5px solid rgba(17,34,80,0.12)",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontFamily: "Georgia, serif",
                  background: "#fff",
                  color: "#112250",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                  transition: "all 0.3s ease",
                }}
                onFocus={e => {
                  e.target.style.borderColor = colors.gold
                  e.target.style.boxShadow = "0 0 0 3px rgba(194,160,114,0.15)"
                }}
                onBlur={e => {
                  e.target.style.borderColor = "rgba(17,34,80,0.12)"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>
          </div>

          {/* Save button */}
          <button
            className="save-btn"
            onClick={handleSave}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "14px 32px",
              background: saved
                ? "#5C8A5A"
                : `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`,
              color: colors.navyDark,
              border: "none", borderRadius: "10px",
              fontSize: "13px", fontWeight: "bold",
              letterSpacing: "1px", cursor: "pointer",
              fontFamily: "Georgia, serif",
              transition: "all 0.3s ease",
            }}
          >
            <FiSave size={16} />
            {saved ? "✓ SAVED SUCCESSFULLY!" : "SAVE PROFILE"}
          </button>

        </div>
      </div>
    </div>
  );
}