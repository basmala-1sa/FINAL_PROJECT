import { useState, useEffect } from "react";
import { colors, GLOBAL_STYLES, Sidebar, PageShell } from "./StudentLayout";
import { applyToOffer } from '../api';
import { searchOffers } from '../api';

const WILAYAS = ["Alger","Oran","Constantine","Annaba","Blida","Batna","Sétif","Tizi Ouzou","Béjaïa","Tlemcen","Biskra","Médéa","Ouargla","Skikda","Sidi Bel Abbès","Mostaganem","Boumerdès","Tipaza","Other"];
const SKILLS_LIST = ["React","Vue.js","Angular","JavaScript","Python","Django","Node.js","PHP","Laravel","Java","MySQL","MongoDB","Docker","Flutter","React Native"];
const TYPES = ["All","remote","presentiel","hybrid"];

const typeBadge = (t) => ({
  remote:     { bg: "#dcfce7", color: "#16a34a", label: "Remote" },
  presentiel: { bg: "rgba(194,160,114,0.18)", color: colors.gold, label: "Présentiel" },
  hybrid:     { bg: "#dbeafe", color: "#2563eb", label: "Hybrid" },
}[t] || { bg: "#f3f4f6", color: "#666", label: t });

// ── OfferCard defined OUTSIDE the main component so it NEVER re-mounts on typing ──
function OfferCard({ offer, i, isRecommended, applied, applying, saved, onApply, onSave }) {
  const badge      = typeBadge(offer.type);
  const isApplied  = applied.includes(offer.id);
  const isApplying = applying === offer.id;
  return (
    <div className="card-hover" style={{
      background: colors.white, borderRadius: "16px", padding: "26px",
      boxShadow: isRecommended ? "0 4px 24px rgba(194,160,114,0.18)" : "0 4px 20px rgba(17,34,80,0.07)",
      border: isRecommended ? "1.5px solid rgba(194,160,114,0.35)" : "1.5px solid transparent",
      position: "relative", overflow: "hidden",
      animation: `fadeUp 0.4s ease ${i * 0.06}s both`,
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg,${colors.gold},${colors.lightGold})`, borderRadius: "16px 16px 0 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div style={{ width: "46px", height: "46px", borderRadius: "12px", flexShrink: 0, background: "linear-gradient(135deg,rgba(194,160,114,0.2),rgba(194,160,114,0.05))", border: "1px solid rgba(194,160,114,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold", color: colors.gold }}>
          {(offer.company_name || "?")[0]}
        </div>
        <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold", letterSpacing: ".5px", background: badge.bg, color: badge.color }}>{badge.label}</span>
      </div>
      <h3 style={{ fontSize: "15px", fontWeight: "bold", color: colors.navyDark, marginBottom: "4px", lineHeight: 1.3 }}>{offer.title}</h3>
      <div style={{ fontSize: "12px", color: colors.sapphire, marginBottom: "8px", fontWeight: "bold" }}>{offer.company_name}</div>
      <div style={{ fontSize: "12px", color: "#999", marginBottom: "10px", display: "flex", alignItems: "center", gap: "4px" }}>📍 {offer.wilaya || "—"}</div>
      {offer.description && (
        <p style={{ fontSize: "12px", color: "#777", lineHeight: 1.6, marginBottom: "14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {offer.description}
        </p>
      )}
      {(offer.start_date || offer.end_date) && (
        <div style={{ fontSize: "12px", color: "#666", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px", background: "rgba(194,160,114,0.08)", borderRadius: "8px", padding: "6px 10px" }}>
          <span>📅</span>
          <span>
            {offer.start_date ? new Date(offer.start_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : "?"}
            {" → "}
            {offer.end_date ? new Date(offer.end_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : "?"}
          </span>
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "18px", flex: 1, alignContent: "flex-start" }}>
        {(offer.skills || "").split(",").filter(Boolean).map(s => (
          <span key={s} style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold", background: "rgba(194,160,114,0.12)", color: colors.sapphire, border: "1px solid rgba(194,160,114,0.25)" }}>{s.trim()}</span>
        ))}
      </div>
      <div style={{ height: "1px", background: `linear-gradient(90deg,${colors.gold}33,transparent)`, marginBottom: "16px" }} />
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button onClick={() => onSave(offer.id)} title={saved.includes(offer.id) ? "Remove from favorites" : "Save to favorites"}
          style={{ width: "42px", height: "42px", borderRadius: "10px", border: "none", cursor: "pointer", flexShrink: 0, background: saved.includes(offer.id) ? `linear-gradient(135deg,${colors.gold},${colors.lightGold})` : "rgba(194,160,114,0.12)", color: saved.includes(offer.id) ? colors.navyDark : colors.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", transition: "all 0.25s ease", boxShadow: saved.includes(offer.id) ? "0 4px 14px rgba(194,160,114,0.35)" : "none" }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >{saved.includes(offer.id) ? "✦" : "✧"}</button>
        <button className="btn-gold" onClick={() => !isApplied && onApply(offer.id)} disabled={isApplied || isApplying}
          style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "none", cursor: isApplied ? "default" : "pointer", background: isApplied ? "#dcfce7" : `linear-gradient(135deg,${colors.gold},${colors.lightGold})`, color: isApplied ? "#16a34a" : colors.navyDark, fontSize: "12px", fontWeight: "bold", letterSpacing: "1.5px", boxShadow: isApplied ? "none" : "0 4px 14px rgba(194,160,114,0.35)", fontFamily: "Georgia,serif", opacity: isApplying ? 0.7 : 1 }}
        >{isApplied ? "✅ APPLIED" : isApplying ? "SENDING…" : "✦ APPLY NOW"}</button>
      </div>
    </div>
  );
}

const SectionDivider = ({ label, count, gold }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
    <div style={{ height: "1px", flex: 1, background: gold ? `linear-gradient(90deg,${colors.gold}44,transparent)` : "rgba(17,34,80,0.08)" }} />
    {gold ? (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "20px", background: "linear-gradient(135deg,rgba(194,160,114,0.15),rgba(194,160,114,0.05))", border: "1px solid rgba(194,160,114,0.3)" }}>
        <span style={{ fontSize: "14px" }}>⭐</span>
        <span style={{ fontSize: "11px", fontWeight: "bold", color: colors.gold, letterSpacing: "2px" }}>{label}</span>
        <span style={{ fontSize: "11px", color: colors.gold, opacity: 0.7 }}>({count})</span>
      </div>
    ) : (
      <span style={{ fontSize: "11px", fontWeight: "bold", color: "#bbb", letterSpacing: "2px" }}>{label} ({count})</span>
    )}
    <div style={{ height: "1px", flex: 1, background: gold ? `linear-gradient(90deg,transparent,${colors.gold}44)` : "rgba(17,34,80,0.08)" }} />
  </div>
);

export default function SearchOffers() {
  const [active, setSidebar]   = useState("offers");
  const [sidebarOpen, setOpen] = useState(false);
  const [offers, setOffers]               = useState([]);
  const [filtered, setFiltered]           = useState([]);
  const [recommended, setRecommended]     = useState([]);
  const [others, setOthers]               = useState([]);
  const [filteredRec, setFilteredRec]     = useState([]);
  const [filteredOthers, setFilteredOthers] = useState([]);
  const [hasRecommendations, setHasRecommendations] = useState(false);
  const [loading, setLoading]     = useState(true);
  const [applying, setApplying]   = useState(null);
  const [applied, setApplied]     = useState([]);
  const [saved, setSaved]         = useState([]);
  const [toast, setToast]         = useState(null);
  const [coverModal, setCoverModal]   = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [modalError, setModalError]   = useState("");
  const [search, setSearch] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [skill, setSkill]   = useState("");
  const [type, setType]     = useState("All");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://final-project-rdr8.onrender.com/api/offers/", { headers: { "Authorization": `Bearer ${token}` } })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setOffers(data); setFiltered(data);
        setRecommended([]); setOthers([]); setFilteredRec([]); setFilteredOthers([]); setHasRecommendations(false);
      } else {
        const rec = data.recommended || []; const oth = data.others || [];
        setRecommended(rec); setOthers(oth); setFilteredRec(rec); setFilteredOthers(oth);
        setOffers([...rec, ...oth]); setFiltered([...rec, ...oth]); setHasRecommendations(rec.length > 0);
      }
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://final-project-rdr8.onrender.com/api/student/saved-offers/", { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } })
    .then(res => res.json())
    .then(data => { if (Array.isArray(data)) setSaved(data.map(s => s.offer_id)); })
    .catch(() => {});
  }, []);

  useEffect(() => {
    const applyFilters = (list) => {
      let r = [...list];
      if (search) r = r.filter(o => o.title.toLowerCase().includes(search.toLowerCase()) || o.company_name?.toLowerCase().includes(search.toLowerCase()));
      if (wilaya) r = r.filter(o => o.wilaya === wilaya);
      if (skill)  r = r.filter(o => (o.skills || "").toLowerCase().includes(skill.toLowerCase()));
      if (type !== "All") r = r.filter(o => o.type === type);
      return r;
    };
    if (hasRecommendations) {
      const fr = applyFilters(recommended); const fo = applyFilters(others);
      setFilteredRec(fr); setFilteredOthers(fo); setFiltered([...fr, ...fo]);
    } else { setFiltered(applyFilters(offers)); }
  }, [search, wilaya, skill, type, offers, recommended, others, hasRecommendations]);

  const handleApply = (offerId) => { setCoverModal(offerId); setCoverLetter(""); setModalError(""); };

  const handleSubmitApplication = async () => {
    if (!coverLetter.trim()) return;
    setSubmitting(true); setModalError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://final-project-rdr8.onrender.com/api/student/apply/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ offer_id: coverModal, cover_letter: coverLetter }),
      });
      const data = await res.json();
      if (res.ok) {
        setApplied(prev => [...prev, coverModal]);
        showToast("Application sent successfully! ✅", "success");
        setCoverModal(null); setCoverLetter(""); setModalError("");
      } else {
        setModalError(data.error || "Failed to apply.");   // ← shown INSIDE the modal
      }
    } catch { setModalError("Cannot connect to server."); }
    setSubmitting(false);
  };

  const showToast = (text, type) => { setToast({ text, type }); setTimeout(() => setToast(null), 3500); };

  const handleSave = async (offerId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://final-project-rdr8.onrender.com/api/student/save-offer/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ offer_id: offerId }),
      });
      if (res.ok) {
        if (saved.includes(offerId)) { setSaved(saved.filter(id => id !== offerId)); showToast("Removed from favorites", "error"); }
        else { setSaved([...saved, offerId]); showToast("Added to favorites ✦", "success"); }
      }
    } catch { showToast("Failed to save offer!", "error"); }
  };

  const handleNav = (key) => {
    setSidebar(key); setOpen(false);
    const paths = { dashboard: "/student/dashboard", profile: "/student/profile", offers: "/student/offers", applications: "/student/applications", saved: "/student/saved" };
    if (paths[key]) window.location.href = paths[key];
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Georgia,serif", background: colors.offWhite }}>
      <style>{GLOBAL_STYLES}</style>
      {sidebarOpen && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(17,34,80,0.5)", zIndex: 99 }} />}
      <Sidebar active={active} onNavigate={handleNav} />

      {toast && (
        <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 999, padding: "14px 22px", borderRadius: "12px", fontFamily: "Georgia,serif", background: toast.type === "success" ? "#dcfce7" : "#fee2e2", border: `1px solid ${toast.type === "success" ? "#16a34a" : "#dc2626"}`, color: toast.type === "success" ? "#16a34a" : "#dc2626", fontSize: "13px", fontWeight: "bold", letterSpacing: ".3px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", animation: "fadeUp .3s ease both" }}>
          {toast.text}
        </div>
      )}

      <PageShell title="Search Offers" subtitle="✦ FIND YOUR INTERNSHIP" onMenuClick={() => setOpen(true)}>
        <div style={{ background: colors.white, borderRadius: "16px", padding: "24px 28px", marginBottom: "28px", boxShadow: "0 4px 20px rgba(17,34,80,0.07)", position: "relative", overflow: "hidden", animation: "fadeUp .4s ease both" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg,${colors.gold},${colors.lightGold})`, borderRadius: "16px 16px 0 0" }} />
          <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "2px", marginBottom: "16px" }}>FILTERS</div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "14px" }}>
            <input className="inp-field" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or company…" style={{ padding: "10px 14px", borderRadius: "10px", border: "1.5px solid rgba(194,160,114,0.3)", background: colors.offWhite, fontSize: "13px", color: colors.navyDark, fontFamily: "Georgia,serif" }} />
            <select className="inp-field" value={wilaya} onChange={e => setWilaya(e.target.value)} style={{ padding: "10px 14px", borderRadius: "10px", border: "1.5px solid rgba(194,160,114,0.3)", background: colors.offWhite, fontSize: "13px", color: wilaya ? colors.navyDark : "#bbb", fontFamily: "Georgia,serif", cursor: "pointer" }}>
              <option value="">All Wilayas</option>
              {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            <select className="inp-field" value={skill} onChange={e => setSkill(e.target.value)} style={{ padding: "10px 14px", borderRadius: "10px", border: "1.5px solid rgba(194,160,114,0.3)", background: colors.offWhite, fontSize: "13px", color: skill ? colors.navyDark : "#bbb", fontFamily: "Georgia,serif", cursor: "pointer" }}>
              <option value="">All Skills</option>
              {SKILLS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="inp-field" value={type} onChange={e => setType(e.target.value)} style={{ padding: "10px 14px", borderRadius: "10px", border: "1.5px solid rgba(194,160,114,0.3)", background: colors.offWhite, fontSize: "13px", color: colors.navyDark, fontFamily: "Georgia,serif", cursor: "pointer" }}>
              {TYPES.map(t => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
            </select>
          </div>
          <div style={{ fontSize: "12px", color: "#bbb", marginTop: "12px", letterSpacing: ".3px" }}>
            {filtered.length} offer{filtered.length !== 1 ? "s" : ""} found
            {hasRecommendations && filteredRec.length > 0 && <span style={{ color: colors.gold, marginLeft: "8px" }}>⭐ {filteredRec.length} match your skills</span>}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: colors.gold, letterSpacing: "2px", fontSize: "12px" }}>
            <div style={{ width: "36px", height: "36px", border: "3px solid rgba(194,160,114,0.3)", borderTopColor: colors.gold, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
            LOADING OFFERS…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#bbb", fontFamily: "Georgia,serif" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</div>
            <p style={{ fontSize: "16px", marginBottom: "6px" }}>No offers match your filters</p>
            <p style={{ fontSize: "13px", opacity: .7 }}>Try adjusting your search criteria</p>
          </div>
        ) : hasRecommendations ? (
          <div>
            {filteredRec.length > 0 && (
              <div style={{ marginBottom: "36px" }}>
                <SectionDivider label="RECOMMENDED FOR YOU" count={filteredRec.length} gold={true} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "20px" }}>
                  {filteredRec.map((offer, i) => <OfferCard key={offer.id} offer={offer} i={i} isRecommended={true} applied={applied} applying={applying} saved={saved} onApply={handleApply} onSave={handleSave} />)}
                </div>
              </div>
            )}
            {filteredOthers.length > 0 && (
              <div>
                <SectionDivider label="OTHER OFFERS" count={filteredOthers.length} gold={false} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "20px" }}>
                  {filteredOthers.map((offer, i) => <OfferCard key={offer.id} offer={offer} i={i} isRecommended={false} applied={applied} applying={applying} saved={saved} onApply={handleApply} onSave={handleSave} />)}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "20px" }}>
            {filtered.map((offer, i) => <OfferCard key={offer.id} offer={offer} i={i} isRecommended={false} applied={applied} applying={applying} saved={saved} onApply={handleApply} onSave={handleSave} />)}
          </div>
        )}
      </PageShell>

      {/* Cover Letter Modal */}
      {coverModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(17,34,80,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(4px)", fontFamily: "Georgia, serif" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "520px", boxShadow: "0 30px 80px rgba(17,34,80,0.25)", position: "relative", overflow: "hidden", animation: "fadeUp 0.3s ease both" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg,${colors.gold},${colors.lightGold})`, borderRadius: "20px 20px 0 0" }} />
            <button onClick={() => { setCoverModal(null); setCoverLetter(""); setModalError(""); }} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#aaa", lineHeight: 1 }}>✕</button>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "2px", marginBottom: "6px" }}>✦ APPLY TO OFFER</div>
              <h2 style={{ fontSize: "20px", color: colors.navyDark, fontWeight: "bold", margin: "0 0 6px" }}>Why do you want this internship?</h2>
              <p style={{ fontSize: "13px", color: "#999", margin: 0, lineHeight: 1.6 }}>Write a short cover letter to introduce yourself and explain why you're the right fit.</p>
            </div>
            <div style={{ height: "1px", background: `linear-gradient(90deg,${colors.gold}44,transparent)`, marginBottom: "20px" }} />

            {/* ── Inline error box — only visible when there's an error ── */}
            {modalError && (
              <div style={{ marginBottom: "18px", padding: "12px 16px", borderRadius: "10px", background: "#fff1f1", border: "1.5px solid #fca5a5", color: "#dc2626", fontSize: "13px", lineHeight: 1.5, fontFamily: "Georgia, serif" }}>
                ⚠️ {modalError}
              </div>
            )}

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "11px", color: colors.navyDark, letterSpacing: "1px", marginBottom: "8px", fontWeight: "bold" }}>COVER LETTER *</label>
              <textarea
                value={coverLetter}
                onChange={e => { setCoverLetter(e.target.value); if (modalError) setModalError(""); }}
                placeholder={"Dear Hiring Manager,\n\nI am a student with strong skills in [your skills]. I am very interested in this internship because...\n\nThank you for considering my application."}
                rows={8}
                style={{ width: "100%", padding: "14px 16px", border: "1.5px solid rgba(194,160,114,0.3)", borderRadius: "12px", fontSize: "13px", fontFamily: "Georgia, serif", color: colors.navyDark, background: "#fdfcfb", resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.7 }}
                onFocus={e => { e.target.style.borderColor = colors.gold; e.target.style.boxShadow = "0 0 0 3px rgba(194,160,114,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(194,160,114,0.3)"; e.target.style.boxShadow = "none"; }}
              />
              <div style={{ textAlign: "right", fontSize: "11px", color: coverLetter.length > 50 ? colors.gold : "#ccc", marginTop: "6px" }}>
                {coverLetter.length} characters {coverLetter.length < 50 ? "(min 50)" : "✓"}
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => { setCoverModal(null); setCoverLetter(""); setModalError(""); }}
                style={{ flex: 1, padding: "13px", background: "transparent", border: "1.5px solid rgba(17,34,80,0.12)", borderRadius: "10px", cursor: "pointer", fontSize: "13px", color: "#888", fontFamily: "Georgia, serif" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = colors.gold}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(17,34,80,0.12)"}
              >Cancel</button>
              <button onClick={handleSubmitApplication} disabled={coverLetter.trim().length < 50 || submitting}
                style={{ flex: 2, padding: "13px", background: coverLetter.trim().length >= 50 && !submitting ? `linear-gradient(135deg,${colors.gold},${colors.lightGold})` : "#e0d8d0", border: "none", borderRadius: "10px", cursor: coverLetter.trim().length >= 50 && !submitting ? "pointer" : "not-allowed", fontSize: "13px", fontWeight: "bold", color: coverLetter.trim().length >= 50 ? colors.navyDark : "#aaa", fontFamily: "Georgia, serif", letterSpacing: "1px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                {submitting ? (
                  <><span style={{ width: "14px", height: "14px", border: `2px solid ${colors.navyDark}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />SENDING…</>
                ) : "✦ SEND APPLICATION"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}