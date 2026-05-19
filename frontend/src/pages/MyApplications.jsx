import { useState, useEffect } from "react";
import { colors, GLOBAL_STYLES, Sidebar, PageShell } from "./StudentLayout";
import { getMyApplications } from '../api';
import { FiClock, FiCheckCircle, FiXCircle, FiAward, FiInbox, FiSearch, FiFileText, FiStar } from "react-icons/fi";

export default function MyApplications() {
  const [active, setSidebar]    = useState("applications");
  const [sidebarOpen, setOpen]  = useState(false);
  const [applications, setApps] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [agreement, setAgreement] = useState(null);

  // ── Review modal state ────────────────────────────────────────────────────
  const [reviewModal, setReviewModal]   = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null); // { company_id, company_name, agreement_id }
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewMsg, setReviewMsg]       = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://final-project-rdr8.onrender.com/api/student/agreement/", {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => { if (data.pdf_url) setAgreement(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    getMyApplications()
      .then(res => { setApps(Array.isArray(res.data) ? res.data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleNav = (key) => {
    setSidebar(key); setOpen(false);
    const paths = {
      dashboard: "/student/dashboard", profile: "/student/profile",
      offers: "/student/offers", applications: "/student/applications", saved: "/student/saved",
    };
    if (paths[key]) window.location.href = paths[key];
  };

  // ── Open review modal for an accepted application ─────────────────────────
  const openReview = (app) => {
    setReviewTarget({
      company_id:   app.company_id,
      company_name: app.company_name || app.offer_title,
      agreement_id: app.agreement_id,
    });
    setReviewRating(5);
    setReviewComment("");
    setReviewMsg("");
    setReviewModal(true);
  };

  // ── Submit review ─────────────────────────────────────────────────────────
  const submitReview = async () => {
    if (!reviewComment.trim()) { setReviewMsg("❌ Please write a comment."); return; }
    if (!reviewTarget?.company_id) { setReviewMsg("❌ Missing company info. Please close and try again."); return; }
    const token = localStorage.getItem("token");
    if (!token) { setReviewMsg("❌ You are not logged in."); return; }
    setReviewLoading(true);
    try {
      const res = await fetch("https://final-project-rdr8.onrender.com/api/student/review/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          company_id: reviewTarget.company_id,
          rating:     reviewRating,
          comment:    reviewComment,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviewMsg("✅ Review submitted! It will appear on the homepage.");
        setApps(prev => prev.map(a =>
          a.company_id === reviewTarget.company_id ? { ...a, has_reviewed: true } : a
        ));
        setTimeout(() => { setReviewModal(false); setReviewMsg(""); }, 2200);
      } else {
        setReviewMsg(`❌ ${data.error || "Something went wrong."}`);
      }
    } catch (err) {
      console.error("Review submit error:", err);
      setReviewMsg("❌ Cannot reach the server. Make sure the backend is running on port 8000.");
    }
    setReviewLoading(false);
  };

  const STATUS_CONFIG = {
    pending:   { label: "Pending",   bg: "rgba(194,160,114,0.15)", color: colors.gold,    icon: <FiClock size={13}/>,       desc: "Waiting for company response"        },
    accepted:  { label: "Accepted",  bg: "#dcfce7",                color: "#5C8A5A",      icon: <FiCheckCircle size={13}/>, desc: "Company accepted your application"   },
    refused:   { label: "Refused",   bg: "#fee2e2",                color: "#e05555",      icon: <FiXCircle size={13}/>,     desc: "Company declined your application"   },
    validated: { label: "Validated", bg: "#dbeafe",                color: "#2563eb",      icon: <FiAward size={13}/>,       desc: "Admin validated — internship confirmed!" },
  };

  const filtered = filter === "all" ? applications : applications.filter(a => a.status === filter);
  const counts = {
    all:       applications.length,
    pending:   applications.filter(a => a.status === "pending").length,
    accepted:  applications.filter(a => a.status === "accepted").length,
    refused:   applications.filter(a => a.status === "refused").length,
    validated: applications.filter(a => a.status === "validated").length,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Georgia,serif", background: colors.offWhite }}>
      <style>{GLOBAL_STYLES}</style>
      {sidebarOpen && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(17,34,80,0.5)", zIndex: 99 }} />}
      <Sidebar active={active} onNavigate={handleNav} />

      <PageShell title="My Applications" subtitle="✦ TRACK YOUR STATUS" onMenuClick={() => setOpen(true)}>

        {/* Summary stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "16px", marginBottom: "28px", animation: "fadeUp .4s ease both" }}>
          {[
            { key: "all",       label: "Total",     value: counts.all,       bg: colors.white,              color: colors.navyDark },
            { key: "pending",   label: "Pending",   value: counts.pending,   bg: "rgba(194,160,114,0.12)",   color: colors.gold     },
            { key: "accepted",  label: "Accepted",  value: counts.accepted,  bg: "#dcfce7",                 color: "#5C8A5A"       },
            { key: "refused",   label: "Refused",   value: counts.refused,   bg: "#fee2e2",                 color: "#e05555"       },
            { key: "validated", label: "Validated", value: counts.validated, bg: "#dbeafe",                 color: "#204eb2"       },
          ].map(s => (
            <div key={s.key} onClick={() => setFilter(s.key)} style={{
              background: s.bg, borderRadius: "14px", padding: "20px",
              border: `1.5px solid ${filter === s.key ? s.color : "transparent"}`,
              cursor: "pointer", textAlign: "center",
              boxShadow: filter === s.key ? "0 4px 16px rgba(17,34,80,0.1)" : "0 2px 8px rgba(17,34,80,0.05)",
              transition: "all .2s ease",
              transform: filter === s.key ? "translateY(-2px)" : "none",
            }}>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: s.color, marginTop: "4px", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Convention banner */}
        {agreement && (
          <div style={{
            background: "linear-gradient(135deg, #112250, #1C3160)", borderRadius: "16px",
            padding: "24px 28px", marginBottom: "28px", position: "relative", overflow: "hidden",
            animation: "fadeUp 0.5s ease both", display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap", gap: "16px",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${colors.gold}, ${colors.lightGold})` }} />
            <div>
              <div style={{ fontSize: "10px", color: colors.lightGold, letterSpacing: "2px", marginBottom: "6px" }}>✦ CONVENTION DE STAGE</div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#fff", marginBottom: "4px" }}>{agreement.offer_title}</div>
              <div style={{ fontSize: "12px", color: "#D9CBC2" }}>{agreement.company_name} · Validated</div>
            </div>
            <a href={agreement.pdf_url} target="_blank" rel="noreferrer" style={{
              display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px",
              borderRadius: "10px", background: `linear-gradient(135deg, ${colors.gold}, ${colors.lightGold})`,
              color: colors.navyDark, fontSize: "13px", fontWeight: "bold",
              letterSpacing: "1px", cursor: "pointer", textDecoration: "none", fontFamily: "Georgia, serif",
            }}>
              <FiFileText size={16} /> DOWNLOAD PDF
            </a>
          </div>
        )}

        {/* Applications list */}
        <div style={{
          background: colors.white, borderRadius: "16px", padding: "28px 32px",
          boxShadow: "0 4px 20px rgba(17,34,80,0.07)", position: "relative", overflow: "hidden",
          animation: "fadeUp .5s ease .15s both",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg,${colors.gold},${colors.lightGold})`, borderRadius: "16px 16px 0 0" }} />
          <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: "3px", background: `linear-gradient(180deg,transparent,${colors.gold},transparent)`, borderRadius: "3px" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "2px", marginBottom: "4px" }}>APPLICATIONS</div>
              <h2 style={{ fontSize: "18px", color: colors.navyDark, margin: 0, fontWeight: "bold" }}>
                {filter === "all" ? "All Applications" : `${STATUS_CONFIG[filter]?.label} Applications`}
              </h2>
            </div>
            <div style={{ fontSize: "12px", color: "#bbb", letterSpacing: ".3px" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "50px", color: colors.gold, letterSpacing: "2px", fontSize: "12px" }}>
              <div style={{ width: "36px", height: "36px", border: `3px solid rgba(194,160,114,0.3)`, borderTopColor: colors.gold, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
              LOADING…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px 20px", color: "#bbb" }}>
              <div style={{ color: "#ddd", marginBottom: "16px" }}><FiInbox size={40} /></div>
              <p style={{ fontSize: "15px", marginBottom: "6px" }}>{filter === "all" ? "No applications yet" : `No ${filter} applications`}</p>
              <p style={{ fontSize: "13px", opacity: .7 }}>{filter === "all" ? "Start by searching for internship offers!" : "Check another filter above"}</p>
              {filter === "all" && (
                <button onClick={() => window.location.href = "/student/offers"} style={{
                  marginTop: "16px", padding: "10px 24px", borderRadius: "10px", border: "none",
                  background: `linear-gradient(135deg,${colors.gold},${colors.lightGold})`,
                  color: colors.navyDark, fontSize: "12px", fontWeight: "bold", letterSpacing: "1px", cursor: "pointer", fontFamily: "Georgia,serif",
                }}>✦ SEARCH OFFERS</button>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {filtered.map((app, i) => {
                const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                // Show review option when a validated agreement exists (agreement_id comes from the serializer)
                const isAccepted = (app.status === "accepted" || app.status === "validated") && app.agreement_id != null;
                return (
                  <div key={app.id} style={{
                    padding: "18px 0", borderBottom: `1px solid ${colors.offWhite}`,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    flexWrap: "wrap", gap: "12px",
                    animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
                  }}>
                    {/* Left: company + info */}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: "220px" }}>
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "12px", flexShrink: 0,
                        background: `linear-gradient(135deg,rgba(194,160,114,0.2),rgba(194,160,114,0.05))`,
                        border: `1px solid rgba(194,160,114,0.3)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "18px", fontWeight: "bold", color: colors.gold,
                      }}>{(app.offer_title || "?")[0]}</div>
                      <div>
                        <div style={{ fontWeight: "bold", color: colors.navyDark, fontSize: "14px", marginBottom: "3px" }}>{app.offer_title}</div>
                        <div style={{ fontSize: "12px", color: colors.sapphire, fontWeight: "bold" }}>{app.company_name || app.offer_title}</div>
                        <div style={{ fontSize: "11px", color: "#bbb", marginTop: "2px" }}>📍 {app.wilaya} · Applied {app.applied_at}</div>
                        {(app.offer_start_date || app.offer_end_date) && (
                          <div style={{ fontSize: "11px", color: "#999", marginTop: "3px" }}>
                            📅 {app.offer_start_date ? new Date(app.offer_start_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : "?"}
                            {" → "}
                            {app.offer_end_date ? new Date(app.offer_end_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : "?"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Skills */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", flex: 1, minWidth: "160px" }}>
                      {(app.student_skills || "").split(",").filter(Boolean).slice(0, 3).map(s => (
                        <span key={s} style={{ padding: "3px 9px", borderRadius: "20px", fontSize: "10px", fontWeight: "bold", background: `rgba(194,160,114,0.1)`, color: colors.sapphire, border: `1px solid rgba(194,160,114,0.2)` }}>
                          {s.trim()}
                        </span>
                      ))}
                    </div>

                    {/* Right: status + review button */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 }}>
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        padding: "6px 16px", borderRadius: "20px",
                        background: sc.bg, color: sc.color,
                        fontSize: "12px", fontWeight: "bold", letterSpacing: ".5px",
                      }}>
                        {sc.icon} {sc.label}
                      </div>
                      <div style={{ fontSize: "10px", color: "#bbb", textAlign: "right" }}>{sc.desc}</div>

                      {/* ── LEAVE REVIEW BUTTON — only when internship is validated ── */}
                      {isAccepted && app.company_id && !app.has_reviewed && (
                        <button onClick={() => openReview(app)} style={{
                          display: "flex", alignItems: "center", gap: "6px",
                          padding: "7px 16px", borderRadius: "20px", border: "none",
                          background: `linear-gradient(135deg,${colors.gold},${colors.lightGold})`,
                          color: colors.navyDark, fontSize: "11px", fontWeight: "bold",
                          cursor: "pointer", fontFamily: "Georgia,serif",
                          boxShadow: "0 3px 10px rgba(194,160,114,0.35)",
                          transition: "all .2s ease",
                        }}
                          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                        >
                          <FiStar size={12} /> Leave a Review
                        </button>
                      )}
                      {isAccepted && app.has_reviewed && (
                        <div style={{
                          display: "flex", alignItems: "center", gap: "5px",
                          padding: "6px 14px", borderRadius: "20px",
                          background: "rgba(92,138,90,0.12)", color: "#5C8A5A",
                          fontSize: "11px", fontWeight: "bold", letterSpacing: ".3px",
                        }}>
                          <FiCheckCircle size={12} /> Reviewed
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PageShell>

      {/* ══ REVIEW MODAL ══ */}
      {reviewModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(17,34,80,0.55)",
          backdropFilter: "blur(6px)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
        }}>
          <div style={{
            background: colors.white, borderRadius: "20px", padding: "36px",
            width: "100%", maxWidth: "440px",
            boxShadow: "0 30px 80px rgba(17,34,80,0.3)", position: "relative",
            animation: "fadeUp .3s ease both",
          }}>
            {/* Gold top bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg,${colors.gold},${colors.lightGold})`, borderRadius: "20px 20px 0 0" }} />

            <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "2px", marginBottom: "6px" }}>✦ LEAVE A REVIEW</div>
            <h2 style={{ fontSize: "20px", color: colors.navyDark, margin: "0 0 4px", fontWeight: "bold" }}>Share Your Experience</h2>
            <p style={{ fontSize: "12px", color: "#999", margin: "0 0 24px" }}>at <strong>{reviewTarget?.company_name}</strong></p>

            {reviewMsg && (
              <div style={{
                padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px",
                background: reviewMsg.startsWith("✅") ? "#eafaf1" : "#fdf2f2",
                color:      reviewMsg.startsWith("✅") ? "#27AE60"  : "#e74c3c",
                border:     `1px solid ${reviewMsg.startsWith("✅") ? "#27AE60" : "#e74c3c"}`,
              }}>{reviewMsg}</div>
            )}

            {/* Star rating */}
            <label style={{ display: "block", fontSize: "11px", color: colors.navyDark, letterSpacing: "1px", marginBottom: "10px", fontWeight: "bold" }}>RATING</label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} onClick={() => setReviewRating(n)} style={{
                  width: "42px", height: "42px", borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", fontSize: "22px",
                  background: n <= reviewRating ? `rgba(194,160,114,0.18)` : "rgba(0,0,0,0.04)",
                  border: `1.5px solid ${n <= reviewRating ? colors.gold : "rgba(0,0,0,0.08)"}`,
                  transition: "all .15s ease",
                  transform: n <= reviewRating ? "scale(1.05)" : "scale(1)",
                }}>⭐</div>
              ))}
            </div>

            {/* Comment */}
            <label style={{ display: "block", fontSize: "11px", color: colors.navyDark, letterSpacing: "1px", marginBottom: "8px", fontWeight: "bold" }}>YOUR COMMENT</label>
            <textarea
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              placeholder="How was your experience? What did you learn?"
              rows={4}
              style={{
                width: "100%", padding: "12px 14px",
                border: "1.5px solid rgba(194,160,114,0.3)", borderRadius: "10px",
                fontSize: "13px", fontFamily: "Georgia,serif", color: colors.navyDark,
                marginBottom: "20px", outline: "none", resize: "none",
                transition: "border-color .2s",
              }}
              onFocus={e => e.target.style.borderColor = colors.gold}
              onBlur={e => e.target.style.borderColor = "rgba(194,160,114,0.3)"}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setReviewModal(false)} style={{
                flex: 1, padding: "12px", background: "none",
                border: "1.5px solid #ddd", borderRadius: "10px",
                cursor: "pointer", fontSize: "13px", fontFamily: "Georgia,serif", color: "#666",
              }}>Cancel</button>
              <button onClick={submitReview} disabled={reviewLoading} style={{
                flex: 2, padding: "12px",
                background: `linear-gradient(135deg,${colors.gold},${colors.lightGold})`,
                border: "none", borderRadius: "10px", cursor: "pointer",
                fontSize: "13px", fontWeight: "bold", color: colors.navyDark,
                fontFamily: "Georgia,serif", opacity: reviewLoading ? 0.7 : 1,
                transition: "opacity .2s",
              }}>
                {reviewLoading ? "Submitting…" : "⭐ Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}