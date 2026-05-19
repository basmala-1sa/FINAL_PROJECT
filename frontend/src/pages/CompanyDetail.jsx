import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const C = { navy: "#112250", sapphire: "#3C507D", gold: "#C2A072", lightGold: "#E0C58F", offWhite: "#F5F0E9" };

function Stars({ rating, size = 16 }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= rating ? C.gold : "none"}
          stroke={C.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function CompanyDetail() {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://final-project-rdr8.onrender.com/api/company/${id}/profile/`)
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: C.offWhite, fontFamily: "Georgia, serif" }}>
      <div style={{ textAlign: "center", color: C.gold }}>Loading...</div>
    </div>
  );

  if (!data) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: C.offWhite }}>
      <div style={{ textAlign: "center", color: "#aaa" }}>Company not found.</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.offWhite, fontFamily: "Georgia, serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
      `}</style>

      {/* Header */}
      <div style={{ background: C.navy, padding: "0 0 40px" }}>
        <div style={{
          height: "3px",
          background: `linear-gradient(90deg, ${C.navy}, ${C.gold}, ${C.lightGold}, ${C.gold}, ${C.navy})`,
          backgroundSize: "200% auto", animation: "shimmer 3s linear infinite",
        }} />
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 40px 0" }}>
          <button onClick={() => navigate(-1)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(245,240,233,0.5)", fontSize: "13px", fontFamily: "Georgia, serif",
            display: "flex", alignItems: "center", gap: "6px", marginBottom: "32px",
            transition: "color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = C.gold}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(245,240,233,0.5)"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </button>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "24px", animation: "fadeUp 0.5s ease both" }}>
            <div style={{
              width: "80px", height: "80px", borderRadius: "20px", flexShrink: 0,
              background: `linear-gradient(135deg, rgba(194,160,114,0.3), rgba(194,160,114,0.1))`,
              border: `1.5px solid rgba(194,160,114,0.4)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px", fontWeight: "bold", color: C.gold,
            }}>
              {(data.company_name || "?")[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "11px", color: C.gold, letterSpacing: "3px", marginBottom: "6px" }}>✦ COMPANY PROFILE</div>
              <h1 style={{ fontSize: "30px", color: "#fff", fontWeight: "bold", margin: "0 0 8px" }}>{data.company_name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(245,240,233,0.6)", fontSize: "13px" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {data.location || "—"}
                </div>
                {data.website && (
                  <a href={data.website} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", color: C.gold, fontSize: "13px", textDecoration: "none" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    Website
                  </a>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Stars rating={Math.round(data.avg_rating)} size={14} />
                  <span style={{ color: C.gold, fontSize: "13px", fontWeight: "bold" }}>{data.avg_rating}</span>
                  <span style={{ color: "rgba(245,240,233,0.4)", fontSize: "12px" }}>({data.total_reviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px" }}>

        {/* Description */}
        {data.description && (
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "28px 32px",
            boxShadow: "0 4px 20px rgba(17,34,80,0.07)", marginBottom: "24px",
            position: "relative", overflow: "hidden", animation: "fadeUp 0.4s ease 0.1s both",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${C.gold}, ${C.lightGold})`, borderRadius: "16px 16px 0 0" }} />
            <div style={{ fontSize: "10px", color: C.gold, letterSpacing: "2px", marginBottom: "12px" }}>ABOUT</div>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.8, margin: 0 }}>{data.description}</p>
          </div>
        )}

        {/* Active offers */}
        {data.offers?.length > 0 && (
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "28px 32px",
            boxShadow: "0 4px 20px rgba(17,34,80,0.07)", marginBottom: "24px",
            position: "relative", overflow: "hidden", animation: "fadeUp 0.4s ease 0.2s both",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${C.gold}, ${C.lightGold})`, borderRadius: "16px 16px 0 0" }} />
            <div style={{ fontSize: "10px", color: C.gold, letterSpacing: "2px", marginBottom: "16px" }}>ACTIVE OFFERS ({data.total_offers})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {data.offers.map(offer => (
                <div key={offer.id} style={{
                  padding: "16px 20px", borderRadius: "12px",
                  background: C.offWhite, border: `1px solid rgba(194,160,114,0.15)`,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "bold", color: C.navy }}>{offer.title}</div>
                    <div style={{ fontSize: "12px", color: "#999", marginTop: "3px" }}>📍 {offer.wilaya} · {offer.type}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {offer.days_left !== null && (
                      <span style={{ fontSize: "11px", color: offer.days_left === "Closed" ? "#e74c3c" : C.gold }}>
                        {offer.days_left === "Closed" ? "Closed" : `${offer.days_left}d left`}
                      </span>
                    )}
                    <span style={{
                      padding: "4px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold",
                      background: "rgba(194,160,114,0.15)", color: C.gold,
                    }}>
                      {offer.applicants_count} applicants
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div style={{
          background: "#fff", borderRadius: "16px", padding: "28px 32px",
          boxShadow: "0 4px 20px rgba(17,34,80,0.07)",
          position: "relative", overflow: "hidden", animation: "fadeUp 0.4s ease 0.3s both",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${C.gold}, ${C.lightGold})`, borderRadius: "16px 16px 0 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <div style={{ fontSize: "10px", color: C.gold, letterSpacing: "2px", marginBottom: "4px" }}>REVIEWS</div>
              <h3 style={{ fontSize: "18px", color: C.navy, margin: 0, fontWeight: "bold" }}>Student Reviews</h3>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: C.navy, lineHeight: 1 }}>{data.avg_rating}</div>
              <Stars rating={Math.round(data.avg_rating)} size={14} />
              <div style={{ fontSize: "11px", color: "#aaa", marginTop: "3px" }}>{data.total_reviews} reviews</div>
            </div>
          </div>

          {data.reviews?.length === 0 ? (
            <div style={{ textAlign: "center", color: "#bbb", padding: "32px 0", fontSize: "14px" }}>
              No reviews yet for this company.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {data.reviews.map((r, i) => (
                <div key={r.id} style={{
                  padding: "16px 20px", borderRadius: "12px",
                  background: C.offWhite, border: `1px solid rgba(194,160,114,0.15)`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: `linear-gradient(135deg, ${C.gold}, ${C.lightGold})`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "13px", fontWeight: "bold", color: C.navy,
                      }}>{(r.student_name || "?")[0].toUpperCase()}</div>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "bold", color: C.navy }}>{r.student_name}</div>
                        <div style={{ fontSize: "11px", color: "#aaa" }}>{new Date(r.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <Stars rating={r.rating} size={13} />
                  </div>
                  <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.6, margin: 0 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}