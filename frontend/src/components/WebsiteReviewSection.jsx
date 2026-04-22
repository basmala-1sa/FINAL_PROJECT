import { useState, useEffect } from "react";

const C = { navy: "#112250", sapphire: "#3C507D", gold: "#E0C58F", swan: "#F5F0E9", shell: "#D9CBC2" };

function Stars({ rating, size = 16, interactive = false, onRate }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= (interactive ? (hover || rating) : rating) ? C.gold : "none"}
          stroke={C.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          style={{ cursor: interactive ? "pointer" : "default", transition: "all 0.15s" }}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate && onRate(i)}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function WebsiteReviewSection() {
  const [reviews, setReviews]   = useState([]);
  const [avg, setAvg]           = useState(0);
  const [total, setTotal]       = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating]     = useState(0);
  const [comment, setComment]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const res  = await fetch("http://127.0.0.1:8000/api/website-reviews/");
      const data = await res.json();
      setReviews(data.reviews || []);
      setAvg(data.average_rating || 0);
      setTotal(data.total_reviews || 0);
    } catch {}
  };

  const handleSubmit = async () => {
    if (!rating) return setMsg({ type: "error", text: "Please select a rating!" });
    if (!comment.trim()) return setMsg({ type: "error", text: "Please write something!" });
    setLoading(true);
    try {
      const res  = await fetch("http://127.0.0.1:8000/api/website-reviews/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: "Thank you for your review! ⭐" });
        setShowForm(false); setRating(0); setComment("");
        fetchReviews();
      } else {
        setMsg({ type: "error", text: data.error || "Failed." });
      }
    } catch {
      setMsg({ type: "error", text: "Cannot connect." });
    }
    setLoading(false);
    setTimeout(() => setMsg(null), 3000);
  };

  const roleIcon = (role) => role === "student" ? "🎓" : role === "company" ? "🏢" : "👤";

  return (
    <section style={{ padding: "80px 40px", background: C.navy, fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ fontSize: "11px", color: C.gold, letterSpacing: "3px", marginBottom: "8px" }}>✦ TESTIMONIALS</div>
            <h2 style={{ fontSize: "36px", color: "#fff", fontWeight: "bold", margin: "0 0 8px" }}>What people say</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Stars rating={Math.round(avg)} size={20} />
              <span style={{ color: C.gold, fontSize: "20px", fontWeight: "bold" }}>{avg}</span>
              <span style={{ color: C.shell, fontSize: "14px" }}>({total} reviews)</span>
            </div>
          </div>
          {token && (
            <button onClick={() => setShowForm(!showForm)} style={{
              padding: "12px 24px", borderRadius: "10px", border: `1.5px solid rgba(224,197,143,0.4)`,
              background: "transparent", color: C.gold, fontSize: "13px", fontWeight: "bold",
              cursor: "pointer", fontFamily: "Georgia, serif", letterSpacing: "1px",
              transition: "all 0.3s ease",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(224,197,143,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {showForm ? "✕ CANCEL" : "✦ LEAVE A REVIEW"}
            </button>
          )}
        </div>

        {/* Message */}
        {msg && (
          <div style={{
            padding: "12px 20px", borderRadius: "10px", marginBottom: "24px", fontSize: "14px",
            background: msg.type === "success" ? "rgba(39,174,96,0.15)" : "rgba(231,76,60,0.15)",
            color: msg.type === "success" ? "#27AE60" : "#e74c3c",
            border: `1px solid ${msg.type === "success" ? "rgba(39,174,96,0.3)" : "rgba(231,76,60,0.3)"}`,
          }}>{msg.text}</div>
        )}

        {/* Review form */}
        {showForm && (
          <div style={{
            background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "28px 32px",
            marginBottom: "40px", border: `1px solid rgba(224,197,143,0.2)`,
            animation: "fadeUp 0.3s ease both",
          }}>
            <div style={{ fontSize: "10px", color: C.gold, letterSpacing: "2px", marginBottom: "16px" }}>YOUR REVIEW</div>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", color: C.shell, marginBottom: "8px", letterSpacing: "1px" }}>RATING *</div>
              <Stars rating={rating} size={28} interactive onRate={setRating} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", color: C.shell, marginBottom: "8px", letterSpacing: "1px" }}>YOUR EXPERIENCE *</div>
              <textarea
                value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Share your experience with Stag.io..."
                rows={4}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: "10px",
                  border: `1.5px solid rgba(224,197,143,0.2)`, fontSize: "13px",
                  fontFamily: "Georgia, serif", color: "#fff",
                  background: "rgba(255,255,255,0.05)", resize: "none", outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = C.gold}
                onBlur={e  => e.target.style.borderColor = "rgba(224,197,143,0.2)"}
              />
            </div>
            <button onClick={handleSubmit} disabled={loading} style={{
              padding: "12px 28px", borderRadius: "10px", border: "none",
              background: `linear-gradient(135deg, ${C.gold}, #f0d080)`,
              color: C.navy, fontSize: "13px", fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer", fontFamily: "Georgia, serif",
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "Submitting..." : "✦ SUBMIT REVIEW"}
            </button>
          </div>
        )}

        {/* Reviews grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {reviews.slice(0, 6).map((r, i) => (
            <div key={r.id} style={{
              background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px",
              border: `1px solid rgba(224,197,143,0.15)`,
              animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, ${C.gold}, transparent)` }} />
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                  background: `linear-gradient(135deg, rgba(224,197,143,0.3), rgba(224,197,143,0.1))`,
                  border: `1px solid rgba(224,197,143,0.3)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "15px", fontWeight: "bold", color: C.gold,
                }}>
                  {(r.user_name || "?")[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "bold", color: "#fff" }}>{r.user_name}</div>
                  <div style={{ fontSize: "11px", color: C.shell, opacity: 0.7 }}>
                    {roleIcon(r.user_role)} {r.user_role}
                  </div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <Stars rating={r.rating} size={13} />
                </div>
              </div>
              <p style={{ fontSize: "13px", color: C.shell, lineHeight: 1.7, margin: 0, opacity: 0.85 }}>
                "{r.comment}"
              </p>
              <div style={{ fontSize: "11px", color: C.shell, opacity: 0.4, marginTop: "12px" }}>
                {new Date(r.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div style={{ textAlign: "center", color: C.shell, opacity: 0.5, padding: "40px" }}>
            No reviews yet. Be the first to share your experience!
          </div>
        )}
      </div>
    </section>
  );
}