import { useState, useEffect, useRef } from "react";
import { Navbar, Footer, C, SHARED_STYLES } from "./SharedLayout";
import {
  FiSearch, FiBriefcase, FiMapPin, FiGlobe,
  FiStar, FiUsers, FiFilter, FiX, FiChevronRight,
} from "react-icons/fi";

const RESPONSIVE_STYLES = `
  @media (max-width: 900px) {
    .companies-hero { padding: 100px 5% 60px !important; }
    .companies-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)) !important; }
  }
  @media (max-width: 600px) {
    .companies-hero { padding: 90px 5% 50px !important; }
    .companies-grid { grid-template-columns: 1fr !important; }
    .companies-stats-bar { flex-direction: column !important; gap: 12px !important; align-items: flex-start !important; padding: 16px 5% !important; }
    .reviews-modal-box { padding: 20px 16px !important; border-radius: 16px !important; }
  }
`;

function useReveal() {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}

function StarRating({ rating, size = 13 }) {
  return (
    <div style={{ display:"flex", gap:"2px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar key={i} size={size} style={{ fill: i < Math.round(rating) ? C.gold : "none", color: i < Math.round(rating) ? C.gold : C.shell }} />
      ))}
    </div>
  );
}

function CompanyCard({ company, onSelect, selected }) {
  return (
    <div
      onClick={() => onSelect(company)}
      style={{
        background: C.white, borderRadius:"18px", padding:"28px 24px",
        boxShadow: selected ? "0 16px 48px rgba(17,34,80,0.15)" : "0 4px 20px rgba(17,34,80,0.06)",
        border: selected ? `2px solid ${C.gold}` : "1px solid rgba(17,34,80,0.07)",
        cursor:"pointer", position:"relative", overflow:"hidden",
        transition:"all .3s ease",
      }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow="0 16px 40px rgba(17,34,80,0.12)"; e.currentTarget.style.borderColor="rgba(194,160,114,0.4)"; } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(17,34,80,0.06)"; e.currentTarget.style.borderColor="rgba(17,34,80,0.07)"; } }}
    >
      <div style={{ position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,${C.gold},${C.lightGold})`,borderRadius:"18px 18px 0 0" }}/>

      <div style={{ display:"flex", alignItems:"flex-start", gap:"14px", marginBottom:"16px" }}>
        <div style={{
          width:"52px", height:"52px", borderRadius:"14px", flexShrink:0,
          background:`linear-gradient(135deg,rgba(194,160,114,0.2),rgba(194,160,114,0.05))`,
          border:"1px solid rgba(194,160,114,0.3)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"22px", fontWeight:"700", color:C.gold,
          fontFamily:"'Cormorant Garamond',Georgia,serif",
        }}>
          {company.company_name ? company.company_name[0].toUpperCase() : "C"}
        </div>
        <div style={{ flex:1 }}>
          <h3 style={{ fontSize:"15px", fontWeight:"700", color:C.navy, margin:"0 0 4px" }}>{company.company_name}</h3>
          {company.location && (
            <div style={{ fontSize:"12px", color:C.muted, display:"flex", alignItems:"center", gap:"4px" }}>
              <FiMapPin size={11} color={C.gold}/> {company.location}
            </div>
          )}
        </div>
      </div>

      {company.description && (
        <p style={{ fontSize:"13px", color:C.muted, lineHeight:1.65, margin:"0 0 16px", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {company.description}
        </p>
      )}

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <StarRating rating={company.avg_rating || 0}/>
          <span style={{ fontSize:"12px", color:C.muted }}>
            {company.avg_rating ? company.avg_rating.toFixed(1) : "0.0"} ({company.total_reviews || 0})
          </span>
        </div>
        {company.website && (
          <a href={company.website} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ color:C.gold, display:"flex", alignItems:"center", gap:"4px", fontSize:"12px", textDecoration:"none" }}>
            <FiGlobe size={12}/>
          </a>
        )}
      </div>

      <div style={{ marginTop:"14px", paddingTop:"14px", borderTop:"1px solid rgba(17,34,80,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:"11px", color:C.gold, fontWeight:"700", letterSpacing:".5px" }}>
          VIEW REVIEWS
        </span>
        <FiChevronRight size={14} color={C.gold}/>
      </div>
    </div>
  );
}

function ReviewsModal({ company, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) return;
    fetch(`https://final-project-rdr8.onrender.com/api/public/companies/${company.id}/reviews/`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setReviews(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [company]);

  if (!company) return null;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(17,34,80,0.5)", backdropFilter:"blur(6px)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }} onClick={onClose}>
      <div className="reviews-modal-box" style={{ background:C.white, borderRadius:"24px", width:"100%", maxWidth:"600px", maxHeight:"85vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 32px 80px rgba(17,34,80,0.25)", animation:"fadeUp .3s ease both" }} onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding:"24px 24px 20px", borderBottom:"1px solid rgba(17,34,80,0.07)", position:"relative", flexShrink:0 }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"3px", background:`linear-gradient(90deg,${C.gold},${C.lightGold})`, borderRadius:"24px 24px 0 0" }}/>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"12px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", minWidth:0 }}>
              <div style={{ width:"44px", height:"44px", borderRadius:"12px", flexShrink:0, background:`linear-gradient(135deg,rgba(194,160,114,0.2),rgba(194,160,114,0.05))`, border:"1px solid rgba(194,160,114,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", fontWeight:"700", color:C.gold, fontFamily:"'Cormorant Garamond',Georgia,serif" }}>
                {company.company_name[0].toUpperCase()}
              </div>
              <div style={{ minWidth:0 }}>
                <h2 style={{ margin:0, fontSize:"16px", fontWeight:"700", color:C.navy, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{company.company_name}</h2>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", marginTop:"4px", flexWrap:"wrap" }}>
                  <StarRating rating={company.avg_rating || 0}/>
                  <span style={{ fontSize:"12px", color:C.muted }}>{company.avg_rating ? company.avg_rating.toFixed(1) : "0.0"} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background:"rgba(17,34,80,0.06)", border:"none", borderRadius:"50%", width:"36px", height:"36px", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:C.navy }}>
              <FiX size={16}/>
            </button>
          </div>
        </div>

        {/* Reviews list */}
        <div style={{ overflowY:"auto", padding:"20px 24px", flex:1 }}>
          {loading ? (
            <div style={{ textAlign:"center", padding:"40px", color:C.gold, fontSize:"13px" }}>Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign:"center", padding:"48px 20px", color:C.muted }}>
              <FiStar size={36} style={{ opacity:.2, marginBottom:"12px", display:"block", margin:"0 auto 12px" }}/>
              <p style={{ fontSize:"14px", margin:0 }}>No reviews yet for this company.</p>
              <p style={{ fontSize:"12px", marginTop:"6px", opacity:.7 }}>Students who complete internships here can leave reviews.</p>
            </div>
          ) : reviews.map((r, i) => (
            <div key={i} style={{ background:C.offWhite, borderRadius:"14px", padding:"16px 18px", marginBottom:"12px", border:"1px solid rgba(17,34,80,0.06)" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px", flexWrap:"wrap", gap:"8px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.lightGold})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:"700", color:C.navy, fontFamily:"'Cormorant Garamond',Georgia,serif", flexShrink:0 }}>
                    {r.student_name ? r.student_name[0] : "S"}
                  </div>
                  <div style={{ fontWeight:"700", color:C.navy, fontSize:"13px" }}>{r.student_name}</div>
                </div>
                <StarRating rating={r.rating || 0} size={12}/>
              </div>
              <p style={{ fontSize:"13px", color:"rgba(17,34,80,0.65)", lineHeight:1.7, margin:0, fontStyle:"italic" }}>"{r.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState(null);
  const [heroRef, heroVisible]    = useReveal();

  useEffect(() => {
    fetch("https://final-project-rdr8.onrender.com/api/public/companies/")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) { setCompanies(d); setFiltered(d); } setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search) { setFiltered(companies); return; }
    const q = search.toLowerCase();
    setFiltered(companies.filter(c =>
      c.company_name?.toLowerCase().includes(q) ||
      c.location?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    ));
  }, [search, companies]);

  return (
    <div style={{ fontFamily:"Georgia,serif", background:C.cream, minHeight:"100vh", color:C.navy }}>
      <style>{SHARED_STYLES}</style>
      <style>{RESPONSIVE_STYLES}</style>
      <Navbar active="companies"/>

      {/* Hero */}
      <section className="companies-hero" style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.navyMid} 100%)`, padding:"120px 5% 80px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(194,160,114,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(194,160,114,0.04) 1px,transparent 1px)`,backgroundSize:"60px 60px",pointerEvents:"none" }}/>
        <div style={{ position:"absolute",top:"-60px",right:"-60px",width:"400px",height:"400px",borderRadius:"50%",background:"radial-gradient(circle,rgba(194,160,114,0.1) 0%,transparent 70%)",pointerEvents:"none" }}/>

        <div ref={heroRef} style={{ maxWidth:"700px", margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <div style={{ fontSize:"10px", color:C.gold, letterSpacing:"3px", marginBottom:"14px", animation:heroVisible?"fadeUp .5s ease both":"none" }}>✦ TRUSTED PARTNERS</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(32px,5vw,60px)", fontWeight:"600", color:C.white, margin:"0 0 18px", lineHeight:1.15, animation:heroVisible?"fadeUp .6s ease .1s both":"none" }}>
            Our <span className="gold-text">Companies</span>
          </h1>
          <p style={{ fontSize:"16px", color:"rgba(217,203,194,0.65)", lineHeight:1.8, maxWidth:"480px", margin:"0 auto 36px", animation:heroVisible?"fadeUp .6s ease .2s both":"none" }}>
            Discover all companies partnered with Stag.io. Click any company to see real reviews from students who completed internships there.
          </p>

          {/* Search */}
          <div style={{ position:"relative", maxWidth:"440px", margin:"0 auto", animation:heroVisible?"fadeUp .6s ease .3s both":"none" }}>
            <FiSearch size={16} style={{ position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)", color:C.gold }} />
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Search companies by name or location..."
              style={{ width:"100%", padding:"14px 16px 14px 44px", borderRadius:"10px", border:"1.5px solid rgba(194,160,114,0.3)", background:"rgba(255,255,255,0.08)", color:C.white, fontSize:"14px", fontFamily:"Georgia,serif", outline:"none", backdropFilter:"blur(8px)", transition:"border-color .2s", boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor=C.gold}
              onBlur={e=>e.target.style.borderColor="rgba(194,160,114,0.3)"}
            />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="companies-stats-bar" style={{ background:C.white, padding:"20px 5%", borderBottom:"1px solid rgba(17,34,80,0.06)", display:"flex", alignItems:"center", justifyContent:"center", gap:"40px", flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"13px", color:C.muted }}>
          <FiBriefcase size={14} color={C.gold}/> <strong style={{ color:C.navy }}>{filtered.length}</strong> companies found
        </div>
        {search && (
          <button onClick={()=>setSearch("")} style={{ display:"flex", alignItems:"center", gap:"6px", background:"rgba(194,160,114,0.1)", border:"1px solid rgba(194,160,114,0.3)", borderRadius:"20px", padding:"4px 12px", fontSize:"12px", color:C.gold, cursor:"pointer", fontFamily:"Georgia,serif" }}>
            <FiX size={11}/> Clear filter
          </button>
        )}
      </div>

      {/* Companies grid */}
      <section style={{ padding:"60px 5% 80px" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          {loading ? (
            <div style={{ textAlign:"center", padding:"80px", color:C.gold }}>
              <div style={{ width:"36px",height:"36px",border:`3px solid rgba(194,160,114,0.3)`,borderTopColor:C.gold,borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 16px" }}/>
              <p style={{ fontSize:"13px", letterSpacing:"2px" }}>LOADING COMPANIES...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 20px", color:C.muted }}>
              <FiBriefcase size={48} style={{ opacity:.2, display:"block", margin:"0 auto 16px" }}/>
              <p style={{ fontSize:"16px", fontWeight:"700", color:C.navy, marginBottom:"8px" }}>No companies found</p>
              <p style={{ fontSize:"13px" }}>Try adjusting your search.</p>
            </div>
          ) : (
            <div className="companies-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"22px" }}>
              {filtered.map((c, i) => (
                <div key={c.id || i} style={{ animation:`fadeUp .5s ease ${(i%6)*.08}s both` }}>
                  <CompanyCard company={c} onSelect={setSelected} selected={selected?.id === c.id}/>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews modal */}
      {selected && <ReviewsModal company={selected} onClose={()=>setSelected(null)}/>}

      <Footer/>
    </div>
  );
}