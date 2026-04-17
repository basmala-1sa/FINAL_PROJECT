import { useState, useEffect } from "react";
import { colors, GLOBAL_STYLES, Sidebar, PageShell } from "./StudentLayout";

export default function SavedOffers() {
  const [active, setSidebar]   = useState("saved");
  const [sidebarOpen, setOpen] = useState(false);
  const [saved, setSaved]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState(null);

  const showToast = (text, type) => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  // load saved offers
  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch("http://127.0.0.1:8000/api/student/saved-offers/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            // ← NO body on GET
        }
    })
    .then(res => res.json())
    .then(data => {
        if (Array.isArray(data)) setSaved(data)
        setLoading(false)
    })
    .catch(() => setLoading(false))
}, [])

  // unsave an offer
  const handleUnsave = async (offerId) => {
    const token = localStorage.getItem("token")
    try {
        const res = await fetch("http://127.0.0.1:8000/api/student/save-offer/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ offer_id: offerId })
            // ← removed student_id
        })
        if (res.ok) {
            setSaved(saved.filter(s => s.offer_id !== offerId))
            showToast("Removed from favorites!", "error")
        }
    } catch {
        showToast("Failed!", "error")
    }
}

  const handleNav = (key) => {
    setSidebar(key); setOpen(false);
    const paths = {
        dashboard:    "/student/dashboard",
        profile:      "/student/profile",
        offers:       "/student/offers",
        applications: "/student/applications",
        saved:        "/student/saved",
    };
    if (paths[key]) window.location.href = paths[key];
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"Georgia,serif", background:colors.offWhite }}>
      <style>{GLOBAL_STYLES}</style>
      {sidebarOpen && <div onClick={()=>setOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(17,34,80,0.5)",zIndex:99 }}/>}
      <Sidebar active={active} onNavigate={handleNav}/>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", top:"24px", right:"24px", zIndex:999,
          padding:"14px 22px", borderRadius:"12px",
          background: toast.type==="success" ? "#dcfce7" : "#fee2e2",
          border:`1px solid ${toast.type==="success" ? "#16a34a" : "#dc2626"}`,
          color: toast.type==="success" ? "#16a34a" : "#dc2626",
          fontSize:"13px", fontWeight:"bold",
          boxShadow:"0 8px 24px rgba(0,0,0,0.12)",
        }}>{toast.text}</div>
      )}

      <PageShell title="Saved Offers" subtitle="✦ MY FAVORITES">

        {loading ? (
          <div style={{ textAlign:"center", padding:"60px", color:colors.gold, fontSize:"13px" }}>
            LOADING...
          </div>
        ) : saved.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px", color:"#bbb" }}>
            <div style={{ fontSize:"50px", marginBottom:"16px" }}>🤍</div>
            <p style={{ fontSize:"16px", marginBottom:"6px" }}>No saved offers yet</p>
            <p style={{ fontSize:"13px", opacity:.7 }}>
              Click the ❤️ on any offer to save it here!
            </p>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:"20px" }}>
            {saved.map((item, i) => (
              <div key={item.id} style={{
                background:"#fff", borderRadius:"16px", padding:"26px",
                boxShadow:"0 4px 20px rgba(17,34,80,0.07)",
                position:"relative", overflow:"hidden",
                animation:`fadeUp 0.4s ease ${i*0.06}s both`,
              }}>
                {/* Gold top accent */}
                <div style={{ position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,${colors.gold},${colors.lightGold})`,borderRadius:"16px 16px 0 0" }}/>

                {/* Remove button */}
                {/* Remove button — same style as SearchOffers */}
<button
  onClick={() => handleUnsave(item.offer_id)}
  title="Remove from favorites"
  style={{
    position: "absolute", top: "14px", right: "14px",
    width: "36px", height: "36px",
    borderRadius: "10px", border: "none",
    cursor: "pointer",
    background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`,
    color: colors.navyDark,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "14px",
    transition: "all 0.25s ease",
    boxShadow: `0 4px 14px rgba(194,160,114,0.35)`,
  }}
  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
>
  ✦
</button>

                {/* Company avatar */}
                <div style={{
                  width:"46px", height:"46px", borderRadius:"12px",
                  background:`linear-gradient(135deg,rgba(194,160,114,0.2),rgba(194,160,114,0.05))`,
                  border:`1px solid rgba(194,160,114,0.3)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"18px", fontWeight:"bold", color:colors.gold,
                  marginBottom:"14px",
                }}>
                  {(item.offer_company || "?")[0]}
                </div>

                {/* Title */}
                <h3 style={{ fontSize:"15px", fontWeight:"bold", color:colors.navyDark, marginBottom:"4px" }}>
                  {item.offer_title}
                </h3>

                {/* Company */}
                <div style={{ fontSize:"12px", color:"#888", marginBottom:"8px", fontWeight:"bold" }}>
                  {item.offer_company}
                </div>

                {/* Location */}
                <div style={{ fontSize:"12px", color:"#999", marginBottom:"10px" }}>
                  📍 {item.offer_wilaya || "—"}
                </div>

                {/* Type badge */}
                <span style={{
                  padding:"3px 12px", borderRadius:"20px",
                  fontSize:"11px", fontWeight:"bold",
                  background:"rgba(194,160,114,0.12)",
                  color:colors.gold,
                  border:`1px solid rgba(194,160,114,0.3)`,
                  marginBottom:"12px",
                  display:"inline-block",
                }}>
                  {item.offer_type}
                </span>

                {/* Skills */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginTop:"10px" }}>
                  {(item.offer_skills || "").split(",").filter(Boolean).map(s => (
                    <span key={s} style={{
                      padding:"3px 10px", borderRadius:"20px",
                      fontSize:"11px", fontWeight:"bold",
                      background:`rgba(194,160,114,0.12)`,
                      color:"#3C507D",
                      border:`1px solid rgba(194,160,114,0.25)`,
                    }}>
                      {s.trim()}
                    </span>
                  ))}
                </div>

                {/* Apply button */}
                <button
                  onClick={() => window.location.href = "/student/offers"}
                  style={{
                    width:"100%", padding:"11px", borderRadius:"10px",
                    border:"none", cursor:"pointer", marginTop:"16px",
                    background:`linear-gradient(135deg,${colors.gold},${colors.lightGold})`,
                    color:colors.navyDark,
                    fontSize:"12px", fontWeight:"bold", letterSpacing:"1.5px",
                    fontFamily:"Georgia,serif",
                  }}
                >
                  ✦ APPLY NOW
                </button>
              </div>
            ))}
          </div>
        )}
      </PageShell>
    </div>
  );
}