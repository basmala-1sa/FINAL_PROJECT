import { useState, useEffect } from "react";
import {
  FiHome, FiUser, FiList, FiUsers, FiLogOut,
  FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight,
  FiMapPin, FiClock, FiUsers as FiApplicants, FiX, FiSave,
} from "react-icons/fi";
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

const emptyForm = {
  title: "", description: "", skills: "",
  wilaya: "", type: "presentiel", deadline: "",
};

export default function MyOffers() {
  const navigate = useNavigate();
  const companyName = localStorage.getItem("full_name") || "Company" 
  const [active, setActive]   = useState("offers");
  const [hovered, setHovered] = useState(null);
  

const [showModal, setShowModal]       = useState(false);
const [editingOffer, setEditingOffer] = useState(null);
const [form, setForm]                 = useState(emptyForm);
const [deleteConfirm, setDeleteConfirm] = useState(null);
const [offers, setOffers]             = useState([]);
const [loading, setLoading]           = useState(true);
const [error, setError]               = useState(null);

const token   = localStorage.getItem("token")
const user_id = localStorage.getItem("user_id")
// Load offers on page open
useEffect(() => {
  const fetchOffers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/company/offers/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (res.ok) setOffers(data)
    } catch {
      setError("Failed to load offers.")
    } finally {
      setLoading(false)
    }
  }
  fetchOffers()
}, [])

const openCreate = () => {
  setEditingOffer(null);
  setForm(emptyForm);
  setShowModal(true);
};

const openEdit = (offer) => {
  setEditingOffer(offer);
  setForm({
    title:       offer.title,
    description: offer.description,
    skills:      offer.skills,
    wilaya:      offer.wilaya,
    type:        offer.type,
    deadline:    offer.deadline || "",
  });
  setShowModal(true);
};

const handleSave = async () => {
  try {
    if (editingOffer) {
      const res = await fetch(`http://127.0.0.1:8000/api/offers/${editingOffer.id}/manage/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, user_id })
      })
      const data = await res.json()
      console.log("EDIT RESPONSE:", data, "STATUS:", res.status)
      if (res.ok) {
        setOffers(offers.map(o => o.id === editingOffer.id ? data : o))
        setShowModal(false)
      } else {
        alert("Edit failed: " + JSON.stringify(data))
      }
    } else {
      const res = await fetch("http://127.0.0.1:8000/api/company/offers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...form })
      })
      const data = await res.json()
      console.log("CREATE RESPONSE:", data, "STATUS:", res.status)
      if (res.ok) {
        setOffers([...offers, data.offer])
        setShowModal(false)
      } else {
        alert("Create failed: " + JSON.stringify(data))
      }
    }
  } catch (err) {
    console.log("FETCH ERROR:", err)
    alert("Something went wrong: " + err.message)
  }
}
const handleDelete = async (id) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/offers/${id}/manage/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ user_id })
    })
    if (res.ok) {
      setOffers(offers.filter(o => o.id !== id))
      setDeleteConfirm(null)
    }
  } catch {
    console.log("Delete failed")
  }
}
const handleToggle = async (id) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/offers/${id}/manage/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ user_id })
    })
    const data = await res.json()
    if (res.ok) setOffers(offers.map(o => o.id === id ? { ...o, is_active: data.is_active } : o))
  } catch {
    console.log("Toggle failed")
  }
}

const typeLabel = { presentiel: "Présentiel", remote: "Remote", hybride: "Hybride" };
const typeColor = { presentiel: "#3C507D", remote: "#5C8A5A", hybride: "#8B6F5E" };

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
        .offer-card { transition: all 0.3s ease !important; }
        .offer-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 40px rgba(17,34,80,0.12) !important;
        }
        .icon-btn { transition: all 0.2s ease !important; }
        .icon-btn:hover { transform: scale(1.15) !important; }
        .form-input {
          width: 100%; padding: 12px 14px;
          border: 1.5px solid rgba(17,34,80,0.12);
          border-radius: 8px; font-size: 14px;
          font-family: Georgia, serif;
          background: #fff; color: #112250;
          outline: none; box-sizing: border-box;
          transition: all 0.3s ease;
        }
        .form-input:focus {
          border-color: #C2A072 !important;
          box-shadow: 0 0 0 3px rgba(194,160,114,0.15) !important;
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
        <div style={{
          height: "2px",
          background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold}, transparent)`,
          marginBottom: "40px",
          borderRadius: "2px",
          
        }} />

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
          <div>
            <div style={{ fontSize: "11px", color: colors.gold, letterSpacing: "3px", marginBottom: "8px" }}>
              ✦ MANAGE OFFERS
            </div>
            <h1 style={{ fontSize: "32px", color: colors.navyDark, fontWeight: "bold", margin: 0 }}>
              My Offers
            </h1>
            <p style={{ color: "#888", marginTop: "8px", fontSize: "14px" }}>
              {offers.length} offer{offers.length !== 1 ? "s" : ""} posted
            </p>
          </div>
          <button
            onClick={openCreate}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "12px 24px",
              background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`,
              color: colors.navyDark, border: "none", borderRadius: "10px",
              fontSize: "13px", fontWeight: "bold", letterSpacing: "1px",
              cursor: "pointer", fontFamily: "Georgia, serif",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 25px rgba(194,160,114,0.4)"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)";    e.target.style.boxShadow = "none"; }}
          >
            <FiPlus size={16} /> NEW OFFER
          </button>
        </div>

        {/* Offers Grid */}
       {/* Offers Grid */}
{loading ? (
  <div style={{ textAlign: "center", padding: "80px", color: colors.gold, fontSize: "13px", letterSpacing: "3px" }}>
    LOADING OFFERS...
  </div>
) : error ? (
  <div style={{ textAlign: "center", padding: "80px", color: "#e05555", fontSize: "13px" }}>
    {error}
  </div>
) : offers.length === 0 ? (
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
              <FiList size={28} style={{ color: colors.gold, opacity: 0.4 }} />
            </div>
            <p style={{ fontSize: "16px", color: "#aaa", marginBottom: "6px" }}>No offers yet</p>
            <p style={{ fontSize: "13px", color: "#bbb" }}>Click "New Offer" to post your first internship!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {offers.map((offer, i) => (
              <div
                key={offer.id} className="offer-card"
                style={{
                  background: "#fff", borderRadius: "16px", padding: "28px 32px",
                  boxShadow: "0 4px 20px rgba(17,34,80,0.07)",
                  borderLeft: `4px solid ${offer.is_active ? colors.gold : "#ddd"}`,
                  animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
                  position: "relative", overflow: "hidden",
                }}
              >
                {/* Active/Inactive badge */}
                <div style={{
                  position: "absolute", top: "20px", right: "24px",
                  background: offer.is_active ? "rgba(194,160,114,0.12)" : "rgba(0,0,0,0.05)",
                  color: offer.is_active ? colors.gold : "#aaa",
                  fontSize: "10px", letterSpacing: "1px",
                  padding: "4px 12px", borderRadius: "20px",
                  border: `1px solid ${offer.is_active ? "rgba(194,160,114,0.3)" : "rgba(0,0,0,0.08)"}`,
                }}>
                  {offer.is_active ? "● ACTIVE" : "○ INACTIVE"}
                </div>

                {/* Title + type */}
                <div style={{ marginBottom: "12px", paddingRight: "100px" }}>
                  <h3 style={{ fontSize: "18px", color: colors.navyDark, margin: "0 0 8px", fontWeight: "bold" }}>
                    {offer.title}
                  </h3>
                  <span style={{
                    background: `${typeColor[offer.type]}18`,
                    color: typeColor[offer.type],
                    fontSize: "11px", padding: "3px 12px",
                    borderRadius: "20px", letterSpacing: "0.5px",
                    border: `1px solid ${typeColor[offer.type]}33`,
                  }}>
                    {typeLabel[offer.type]}
                  </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: "13px", color: "#888", margin: "0 0 16px", lineHeight: 1.6 }}>
                  {offer.description}
                </p>

                {/* Skills */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                  {offer.skills.split(",").map((skill, j) => (
                    <span key={j} style={{
                      background: colors.offWhite,
                      color: colors.navyDark,
                      border: `1px solid rgba(17,34,80,0.1)`,
                      fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
                    }}>
                      {skill.trim()}
                    </span>
                  ))}
                </div>

                {/* Meta row */}
                <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#999" }}>
                    <FiMapPin size={13} style={{ color: colors.gold }} /> {offer.wilaya}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#999" }}>
                    <FiApplicants size={13} style={{ color: colors.gold }} /> {offer.applicants_count} applicant{offer.applicants_count !== 1 ? "s" : ""}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#999" }}>
                    <FiClock size={13} style={{ color: colors.gold }} />
                    {offer.days_left === "Closed" ? "Closed" : offer.days_left === null ? "No deadline" : `${offer.days_left} days left`}
                  </span>

                  {/* Action buttons */}
                  <div style={{ marginLeft: "auto", display: "flex", gap: "12px", alignItems: "center" }}>
                    {/* Toggle */}
                    <button className="icon-btn" onClick={() => handleToggle(offer.id)}
                      title={offer.is_active ? "Deactivate" : "Activate"}
                      style={{ background: "none", border: "none", cursor: "pointer", color: colors.gold, fontSize: "22px", padding: 0 }}
                    >
                      {offer.is_active ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} style={{ color: "#ccc" }} />}
                    </button>
                    {/* Edit */}
                    <button className="icon-btn" onClick={() => openEdit(offer)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: colors.navyDark, padding: 0 }}
                    >
                      <FiEdit2 size={18} />
                    </button>
                    {/* Delete */}
                    <button className="icon-btn" onClick={() => setDeleteConfirm(offer.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#e05555", padding: 0 }}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════ CREATE / EDIT MODAL ══════════ */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(17,34,80,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 999, backdropFilter: "blur(4px)",
        }}>
          <div style={{
            background: "#fff", borderRadius: "20px",
            padding: "40px", width: "100%", maxWidth: "560px",
            boxShadow: "0 30px 80px rgba(17,34,80,0.25)",
            animation: "modalIn 0.3s ease forwards",
            position: "relative", maxHeight: "90vh", overflowY: "auto",
          }}>
            {/* Gold top line */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "3px",
              background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold})`,
              borderRadius: "20px 20px 0 0",
            }} />

            {/* Close btn */}
            <button onClick={() => setShowModal(false)}
              style={{
                position: "absolute", top: "16px", right: "16px",
                background: "none", border: "none", cursor: "pointer",
                color: "#aaa", fontSize: "20px",
              }}
            >
              <FiX />
            </button>

            {/* Modal header */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "2px", marginBottom: "6px" }}>
                {editingOffer ? "✦ EDIT OFFER" : "✦ NEW OFFER"}
              </div>
              <h2 style={{ fontSize: "22px", color: colors.navyDark, margin: 0, fontWeight: "bold" }}>
                {editingOffer ? "Update Offer Details" : "Create New Offer"}
              </h2>
            </div>

            {/* Form fields */}
            {[
              { name: "title",       label: "JOB TITLE",   placeholder: "Frontend Developer Intern", type: "text" },
              { name: "wilaya",      label: "WILAYA",       placeholder: "Alger",                     type: "text" },
              { name: "skills",      label: "SKILLS",       placeholder: "React, Python, Django...",  type: "text" },
              { name: "deadline",    label: "DEADLINE",     placeholder: "",                          type: "date" },
            ].map(field => (
              <div key={field.name} style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "11px", color: colors.navyDark, letterSpacing: "1px", marginBottom: "6px", fontWeight: "bold" }}>
                  {field.label}
                </label>
                <input
                  className="form-input"
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={e => setForm({ ...form, [field.name]: e.target.value })}
                  onFocus={e => { e.target.style.borderColor = colors.gold; e.target.style.boxShadow = "0 0 0 3px rgba(194,160,114,0.15)"; }}
                  onBlur={e =>  { e.target.style.borderColor = "rgba(17,34,80,0.12)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            ))}

            {/* Type select */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "11px", color: colors.navyDark, letterSpacing: "1px", marginBottom: "6px", fontWeight: "bold" }}>
                TYPE
              </label>
              <select
                className="form-input"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                onFocus={e => { e.target.style.borderColor = colors.gold; e.target.style.boxShadow = "0 0 0 3px rgba(194,160,114,0.15)"; }}
                onBlur={e =>  { e.target.style.borderColor = "rgba(17,34,80,0.12)"; e.target.style.boxShadow = "none"; }}
              >
                <option value="presentiel">Présentiel</option>
                <option value="remote">Remote</option>
                <option value="hybride">Hybride</option>
              </select>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", fontSize: "11px", color: colors.navyDark, letterSpacing: "1px", marginBottom: "6px", fontWeight: "bold" }}>
                DESCRIPTION
              </label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Describe the internship, tasks, and what you're looking for..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ resize: "vertical" }}
                onFocus={e => { e.target.style.borderColor = colors.gold; e.target.style.boxShadow = "0 0 0 3px rgba(194,160,114,0.15)"; }}
                onBlur={e =>  { e.target.style.borderColor = "rgba(17,34,80,0.12)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                width: "100%", padding: "14px",
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`,
                color: colors.navyDark, border: "none", borderRadius: "10px",
                fontSize: "13px", fontWeight: "bold", letterSpacing: "1px",
                cursor: "pointer", fontFamily: "Georgia, serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(194,160,114,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "none"; }}
            >
              <FiSave size={16} /> {editingOffer ? "UPDATE OFFER" : "CREATE OFFER"}
            </button>
          </div>
        </div>
      )}

      {/* ══════════ DELETE CONFIRM MODAL ══════════ */}
      {deleteConfirm && (
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
              background: "rgba(224,85,85,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <FiTrash2 size={24} style={{ color: "#e05555" }} />
            </div>
            <h3 style={{ fontSize: "18px", color: colors.navyDark, marginBottom: "8px" }}>Delete Offer?</h3>
            <p style={{ fontSize: "13px", color: "#999", marginBottom: "28px" }}>
              This action cannot be undone. The offer and all its applications will be permanently deleted.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1, padding: "12px",
                  background: "none", border: `1.5px solid rgba(17,34,80,0.15)`,
                  borderRadius: "10px", cursor: "pointer",
                  fontSize: "13px", color: colors.navyDark, fontFamily: "Georgia, serif",
                }}
              >
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                style={{
                  flex: 1, padding: "12px",
                  background: "#e05555", border: "none",
                  borderRadius: "10px", cursor: "pointer",
                  fontSize: "13px", color: "#fff", fontFamily: "Georgia, serif",
                  fontWeight: "bold",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}