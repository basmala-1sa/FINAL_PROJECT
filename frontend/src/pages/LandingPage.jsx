import { useState, useEffect, useRef } from "react";
import WebsiteReviewSection from "../components/WebsiteReviewSection";
import { Navbar, Footer, C, SHARED_STYLES } from "./SharedLayout";
import {
  FiUser, FiBriefcase, FiShield, FiSearch, FiCheckCircle,
  FiFileText, FiUsers, FiAward, FiMapPin, FiStar,
  FiArrowRight, FiTrendingUp, FiZap,
} from "react-icons/fi";

const RESPONSIVE_STYLES = `
  @media (max-width: 900px) {
    .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
    .hero-visual-wrap { display: none !important; }
    .features-grid { grid-template-columns: 1fr !important; }
    .steps-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
    .steps-line { display: none !important; }
    .reviews-grid { grid-template-columns: 1fr !important; }
    .stats-bar-grid { grid-template-columns: 1fr 1fr !important; }
    .stats-bar-grid > div { border-right: none !important; border-bottom: 1px solid rgba(194,160,114,0.12); }
  }
  @media (max-width: 600px) {
    .hero-section { padding: 90px 5% 50px !important; }
    .hero-btns { flex-direction: column !important; }
    .hero-btns button { width: 100% !important; justify-content: center !important; }
    .hero-stats { grid-template-columns: 1fr 1fr !important; }
    .steps-grid { grid-template-columns: 1fr !important; }
    .section-pad { padding: 60px 5% !important; }
    .cta-btns { flex-direction: column !important; align-items: stretch !important; }
    .cta-btns button { width: 100% !important; justify-content: center !important; }
    .review-modal-inner { padding: 24px 16px !important; }
    .stats-bar-grid { grid-template-columns: 1fr 1fr !important; }
  }
  @keyframes morphBlob1 {
    0%,100% { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; transform: translate(0,0) scale(1); }
    33% { border-radius: 40% 60% 30% 70% / 60% 40% 70% 30%; transform: translate(40px,-30px) scale(1.06); }
    66% { border-radius: 70% 30% 50% 50% / 30% 70% 50% 60%; transform: translate(-25px,35px) scale(0.96); }
  }
  @keyframes morphBlob2 {
    0%,100% { border-radius: 50% 60% 40% 70% / 60% 40% 60% 40%; transform: translate(0,0) scale(1); }
    33% { border-radius: 70% 30% 60% 40% / 40% 60% 30% 70%; transform: translate(-45px,25px) scale(1.09); }
    66% { border-radius: 30% 70% 50% 50% / 70% 30% 60% 40%; transform: translate(30px,-40px) scale(0.94); }
  }
  @keyframes morphBlob3 {
    0%,100% { border-radius: 40% 60% 60% 40% / 70% 30% 70% 30%; transform: translate(0,0) scale(1); }
    50% { border-radius: 60% 40% 40% 60% / 30% 70% 30% 70%; transform: translate(25px,22px) scale(1.07); }
  }
  @keyframes orbitRing {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes sparkle {
    0%,100% { opacity:0; transform: scale(0.4) rotate(0deg); }
    50% { opacity:1; transform: scale(1) rotate(180deg); }
  }
  @keyframes lineGrow {
    0% { transform: scaleX(0); opacity: 0; }
    100% { transform: scaleX(1); opacity: 1; }
  }
`;

/* ══ Visible animated background with morphing blobs + orbiting ring + sparkles ══ */
function MorphBackground() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>

      {/* === BLOB 1 — large warm gold, top right === */}
      <div style={{
        position: "absolute", top: "-140px", right: "-110px",
        width: "620px", height: "620px",
        background: "radial-gradient(ellipse at 38% 38%, rgba(194,160,114,0.32) 0%, rgba(212,184,150,0.14) 40%, transparent 68%)",
        animation: "morphBlob1 13s ease-in-out infinite",
        borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
      }} />

      {/* === BLOB 2 — deep navy, bottom left === */}
      <div style={{
        position: "absolute", bottom: "-100px", left: "-80px",
        width: "520px", height: "520px",
        background: "radial-gradient(ellipse at 58% 58%, rgba(17,34,80,0.13) 0%, rgba(17,34,80,0.06) 45%, transparent 70%)",
        animation: "morphBlob2 16s ease-in-out infinite",
        borderRadius: "50% 60% 40% 70% / 60% 40% 60% 40%",
      }} />

      {/* === BLOB 3 — soft gold, center left === */}
      <div style={{
        position: "absolute", top: "28%", left: "-90px",
        width: "400px", height: "400px",
        background: "radial-gradient(ellipse at 50% 50%, rgba(212,184,150,0.20) 0%, rgba(194,160,114,0.08) 50%, transparent 72%)",
        animation: "morphBlob3 11s ease-in-out infinite",
        borderRadius: "40% 60% 60% 40% / 70% 30% 70% 30%",
      }} />

      {/* === BLOB 4 — blue accent, upper center === */}
      <div style={{
        position: "absolute", top: "5%", left: "30%",
        width: "260px", height: "260px",
        background: "radial-gradient(ellipse, rgba(62,100,180,0.08) 0%, transparent 72%)",
        animation: "morphBlob1 20s ease-in-out infinite reverse",
        borderRadius: "50%",
      }} />

      {/* === ORBITING RING — decorative, top right area === */}
      <div style={{
        position: "absolute", top: "6%", right: "3%",
        width: "340px", height: "340px",
        borderRadius: "50%",
        border: "1.5px solid rgba(194,160,114,0.20)",
        animation: "float 9s ease-in-out infinite",
      }}>
        {/* Dot on ring */}
        <div style={{
          position: "absolute", top: "-5px", left: "50%", marginLeft: "-5px",
          width: "10px", height: "10px", borderRadius: "50%",
          background: "rgba(194,160,114,0.55)",
          animation: "orbitRing 8s linear infinite",
          transformOrigin: "5px 175px",
        }} />
      </div>
      <div style={{
        position: "absolute", top: "12%", right: "7%",
        width: "200px", height: "200px",
        borderRadius: "50%",
        border: "1px solid rgba(194,160,114,0.12)",
        animation: "float 7s ease-in-out infinite reverse",
      }} />

      {/* Bottom left ring */}
      <div style={{
        position: "absolute", bottom: "10%", left: "5%",
        width: "220px", height: "220px",
        borderRadius: "50%",
        border: "1px solid rgba(17,34,80,0.09)",
        animation: "float 12s ease-in-out infinite",
      }} />

      {/* === SPARKLE STARS scattered around === */}
      {[
        { top: "14%", left: "17%", size: 5, delay: "0s", dur: "2.8s" },
        { top: "70%", left: "7%",  size: 4, delay: "1.1s", dur: "2.2s" },
        { top: "38%", right: "6%", size: 6, delay: "2.0s", dur: "3.1s" },
        { top: "80%", right: "20%",size: 4, delay: "0.6s", dur: "2.5s" },
        { top: "25%", left: "48%", size: 5, delay: "1.7s", dur: "2.9s" },
        { top: "55%", left: "38%", size: 3, delay: "0.3s", dur: "2.0s" },
        { top: "88%", left: "55%", size: 4, delay: "1.4s", dur: "2.6s" },
      ].map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          top: s.top, left: s.left, right: s.right,
          width: `${s.size}px`, height: `${s.size}px`,
          borderRadius: "50%",
          background: i % 2 === 0 ? "rgba(194,160,114,0.65)" : "rgba(17,34,80,0.22)",
          animation: `sparkle ${s.dur} ${s.delay} ease-in-out infinite`,
        }} />
      ))}

      {/* === Diagonal light streaks === */}
      <div style={{
        position: "absolute", top: "35%", left: "-5%",
        width: "55%", height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(194,160,114,0.18), transparent)",
        transform: "rotate(-12deg)",
        animation: "lineGrow 3s ease-out 0.5s both",
        transformOrigin: "left center",
      }} />
      <div style={{
        position: "absolute", top: "60%", right: "-5%",
        width: "40%", height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(17,34,80,0.10), transparent)",
        transform: "rotate(-8deg)",
        animation: "lineGrow 3s ease-out 1.2s both",
        transformOrigin: "right center",
      }} />
    </div>
  );
}

function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { let s = 0; const step = target / 60; const t = setInterval(() => { s += step; if (s >= target) { setVal(target); clearInterval(t); } else setVal(Math.floor(s)); }, 16); }
    }, { threshold: .5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

function useReveal() {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: .1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}

/* ══ Real people photos ══ */
const peopleSlides = [
  {
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=480&h=580&fit=crop&crop=faces,top",
    name: "Amira Boukhalfa",
    role: "UI/UX Design Student",
    university: "USTHB · Alger",
    status: "✓ Placed at Djezzy",
    statusColor: "#4ade80",
    tag: "Student",
    quote: "Found my dream internship in 3 days on Stag.io",
  },
  {
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=480&h=580&fit=crop&crop=faces,top",
    name: "Karim Benali",
    role: "HR Director",
    university: "Sonatrach · Alger",
    status: "✓ 4 Hires This Month",
    statusColor: "#93c5fd",
    tag: "Company",
    quote: "We recruit top talent effortlessly through the platform",
  },
  {
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=480&h=580&fit=crop&crop=faces,top",
    name: "Sara Khelifi",
    role: "Software Engineering Student",
    university: "Univ. Constantine 2",
    status: "✓ Convention Signed",
    statusColor: "#C2A072",
    tag: "Student",
    quote: "My official convention PDF was ready in minutes",
  },
];

function HeroVisual() {
  const [active, setActive] = useState(0);
  const [anim, setAnim] = useState(true);
  const gold = "#C2A072";
  const lightGold = "#D4B896";
  const navy = "#112250";
  const white = "#FFFFFF";

  useEffect(() => {
    const t = setInterval(() => {
      setAnim(false);
      setTimeout(() => { setActive(a => (a + 1) % peopleSlides.length); setAnim(true); }, 250);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const slide = peopleSlides[active];

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "380px", margin: "0 auto" }}>
      {/* Decorative stacked cards behind */}
      <div style={{ position: "absolute", top: "20px", left: "16px", right: "-18px", bottom: "-14px", borderRadius: "28px", background: `rgba(194,160,114,0.16)`, transform: "rotate(2.8deg)" }} />
      <div style={{ position: "absolute", top: "10px", left: "8px", right: "-9px", bottom: "-7px", borderRadius: "28px", background: `rgba(17,34,80,0.08)`, transform: "rotate(1.3deg)" }} />

      {/* Main photo card */}
      <div style={{
        borderRadius: "28px", overflow: "hidden",
        boxShadow: "0 40px 90px rgba(17,34,80,0.26)",
        transition: "opacity .28s ease, transform .28s ease",
        opacity: anim ? 1 : 0,
        transform: anim ? "translateY(0) scale(1)" : "translateY(14px) scale(0.97)",
        position: "relative", zIndex: 2, height: "430px",
      }}>
        {/* Actual person photo */}
        <img
          src={slide.img}
          alt={slide.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        {/* Top gold accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: `linear-gradient(90deg,${gold},${lightGold})` }} />

        {/* Role tag badge top-left */}
        <div style={{ position: "absolute", top: "16px", left: "16px", background: "rgba(11,22,55,0.75)", backdropFilter: "blur(10px)", borderRadius: "20px", padding: "4px 13px", border: "1px solid rgba(255,255,255,0.14)" }}>
          <span style={{ fontSize: "10px", color: gold, fontWeight: "700", letterSpacing: "1.5px" }}>{slide.tag.toUpperCase()}</span>
        </div>

        {/* Bottom gradient overlay with info */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(8,16,45,0.97) 0%, rgba(8,16,45,0.82) 55%, transparent 100%)",
          padding: "44px 22px 24px",
        }}>
          {/* Italic quote */}
          <p style={{ margin: "0 0 14px", fontSize: "13px", fontStyle: "italic", color: "rgba(245,240,233,0.80)", lineHeight: 1.65, borderLeft: `3px solid ${gold}`, paddingLeft: "11px" }}>
            "{slide.quote}"
          </p>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "8px" }}>
            <div>
              <div style={{ fontWeight: "700", color: white, fontSize: "15px", marginBottom: "3px" }}>{slide.name}</div>
              <div style={{ fontSize: "11px", color: "rgba(245,240,233,0.52)" }}>{slide.role}</div>
              <div style={{ fontSize: "10px", color: "rgba(245,240,233,0.34)", marginTop: "2px" }}>{slide.university}</div>
            </div>
            {/* 5 stars */}
            <div style={{ display: "flex", gap: "2px", flexShrink: 0, paddingBottom: "2px" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={gold}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.84L12 17.77l-6.18 3.27L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
          </div>

          {/* Status pill */}
          <div style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.13)", borderRadius: "20px", padding: "5px 13px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: slide.statusColor, flexShrink: 0, boxShadow: `0 0 6px ${slide.statusColor}` }} />
            <span style={{ fontSize: "11px", color: "rgba(245,240,233,0.82)", fontWeight: "600" }}>{slide.status}</span>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: "7px", marginTop: "18px" }}>
        {peopleSlides.map((_, i) => (
          <div key={i} onClick={() => setActive(i)} style={{ width: i === active ? "22px" : "7px", height: "7px", borderRadius: "4px", background: i === active ? gold : "rgba(17,34,80,0.15)", cursor: "pointer", transition: "all .3s ease" }} />
        ))}
      </div>

      {/* Floating — match rate */}
      <div style={{ position: "absolute", bottom: "78px", right: "-38px", background: white, borderRadius: "16px", padding: "12px 16px", boxShadow: "0 18px 42px rgba(17,34,80,0.16)", animation: "float 4.5s ease-in-out infinite", zIndex: 3, border: "1px solid rgba(17,34,80,0.06)" }}>
        <div style={{ fontSize: "9px", color: gold, letterSpacing: "1.5px", marginBottom: "3px", fontWeight: "700" }}>MATCH RATE</div>
        <div style={{ fontSize: "22px", fontWeight: "700", color: navy, lineHeight: 1, fontFamily: "'Cormorant Garamond',Georgia,serif" }}>94%</div>
      </div>

      {/* Floating — companies */}
      <div style={{ position: "absolute", top: "26px", left: "-38px", background: `linear-gradient(135deg,${gold},${lightGold})`, borderRadius: "14px", padding: "10px 15px", boxShadow: "0 14px 32px rgba(194,160,114,0.46)", animation: "float 5.5s ease-in-out infinite reverse", zIndex: 3 }}>
        <div style={{ fontSize: "9px", color: navy, opacity: 0.6, letterSpacing: "1px", marginBottom: "2px", fontWeight: "700" }}>PARTNERS</div>
        <div style={{ fontSize: "13px", fontWeight: "700", color: navy }}>200+ Companies</div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [titleVisible, setTitleVisible] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setTimeout(() => setTitleVisible(true), 200);
    fetch("http://127.0.0.1:8000/api/public/companies/").then(r => r.json()).then(d => { if (Array.isArray(d)) setCompanies(d); }).catch(() => {});
    fetch("http://127.0.0.1:8000/api/public/reviews/").then(r => r.json()).then(d => { if (Array.isArray(d)) setReviews(d); }).catch(() => {});
  }, []);

  const [featRef, featVisible] = useReveal();
  const [stepsRef, stepsVisible] = useReveal();
  const [revRef, revVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();

  const [showReviewGate, setShowReviewGate] = useState(false);

  const displayCompanies = companies.length > 0 ? companies : [
    { company_name: "Sonatrach", location: "Alger" }, { company_name: "Djezzy", location: "Alger" },
    { company_name: "Mobilis", location: "Alger" }, { company_name: "Ooredoo", location: "Oran" },
    { company_name: "Air Algérie", location: "Alger" }, { company_name: "BNA", location: "Alger" },
    { company_name: "Cevital", location: "Béjaïa" }, { company_name: "Naftal", location: "Alger" },
  ];

  const displayReviews = reviews.length > 0 ? reviews : [
    { student_name: "Amira Benali", company_name: "Sonatrach", rating: 5, comment: "Stag.io made finding my internship incredibly easy. The smart matching found me the perfect role!" },
    { student_name: "Yacine Hamdi", company_name: "Djezzy", rating: 5, comment: "The platform is beautiful and easy to use. I got my convention PDF in minutes after validation." },
    { student_name: "Sara Meziane", company_name: "Mobilis", rating: 4, comment: "Great experience overall. The application tracking feature kept me informed every step of the way." },
  ];

  const features = [
    { icon: <FiUser size={22} />, tag: "STUDENTS", title: "Find Your Perfect Internship", desc: "Smart skill-based recommendations match you with the right offers across Algeria. Apply in one click and track every step.", pills: ["Skill Matching", "One-Click Apply", "Status Tracking"], accent: C.gold },
    { icon: <FiBriefcase size={22} />, tag: "COMPANIES", title: "Recruit Top Student Talent", desc: "Post offers, review applications, and manage your hiring pipeline from one elegant dashboard.", pills: ["Post Offers", "Review CVs", "Instant Notify"], accent: C.navy, featured: true },
    { icon: <FiShield size={22} />, tag: "UNIVERSITIES", title: "Full Administrative Control", desc: "Validate internship agreements, generate official PDF conventions automatically, and monitor students.", pills: ["Validate Files", "Auto PDF", "Analytics"], accent: C.sapphire },
  ];

  const steps = [
    { icon: <FiUser size={20} />, n: "01", title: "Create Profile", desc: "Register as a student or company. Fill in your skills and details in under 2 minutes." },
    { icon: <FiSearch size={20} />, n: "02", title: "Discover Offers", desc: "Browse curated internship offers matched to your skills and location across all 48 wilayas." },
    { icon: <FiFileText size={20} />, n: "03", title: "Apply & Connect", desc: "Send your application with a cover letter. Companies review and respond with full notifications." },
    { icon: <FiCheckCircle size={20} />, n: "04", title: "Get Validated", desc: "Your university validates the agreement and generates your official PDF convention automatically." },
  ];

  return (
    <div style={{ fontFamily: "Georgia,serif", background: C.cream, overflowX: "hidden", color: C.navy }}>
      <style>{SHARED_STYLES}</style>
      <style>{RESPONSIVE_STYLES}</style>
      <Navbar active="home" />

      {/* ══ HERO ══ */}
      <section className="hero-section" style={{
        minHeight: "100vh", position: "relative", overflow: "hidden",
        background: `linear-gradient(145deg, #f7f2ea 0%, #eef2ff 52%, #f0ece3 100%)`,
        display: "flex", alignItems: "center", padding: "100px 5% 60px",
      }}>
        <MorphBackground />

        <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center", position: "relative", zIndex: 1 }} className="hero-grid">

          {/* LEFT copy */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(17,34,80,0.06)", border: "1px solid rgba(17,34,80,0.11)", borderRadius: "20px", padding: "5px 16px", marginBottom: "28px", animation: titleVisible ? "fadeUp .5s ease both" : "none" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.gold, animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: "10px", color: C.navy, letterSpacing: "2px", opacity: .65 }}>ALGERIA'S INTERNSHIP PLATFORM</span>
            </div>

            <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(38px,5.5vw,70px)", fontWeight: "600", color: C.navy, lineHeight: 1.1, margin: "0 0 22px", animation: titleVisible ? "fadeUp .6s ease .1s both" : "none" }}>
              Your Internship<br /><span className="gold-text">Journey</span> Starts<br />Right Here
            </h1>

            <div style={{ width: "72px", height: "2px", marginBottom: "22px", background: `linear-gradient(90deg,${C.gold},${C.lightGold},transparent)`, animation: titleVisible ? "fadeIn .8s ease .3s both" : "none", borderRadius: "2px" }} />

            <p style={{ fontSize: "16px", color: "rgba(17,34,80,0.56)", lineHeight: 1.85, maxWidth: "440px", margin: "0 0 36px", animation: titleVisible ? "fadeUp .6s ease .2s both" : "none" }}>
              Connect students with companies across all 48 wilayas of Algeria. Apply for internships, track applications, and download your official <em>convention de stage</em> — seamlessly.
            </p>

            <div className="hero-btns" style={{ display: "flex", gap: "12px", flexWrap: "wrap", animation: titleVisible ? "fadeUp .6s ease .35s both" : "none" }}>
              <button className="btn-hover" onClick={() => window.location.href = "/register"} style={{ padding: "14px 28px", background: `linear-gradient(135deg,${C.gold},${C.lightGold})`, border: "none", borderRadius: "9px", cursor: "pointer", color: C.navy, fontSize: "14px", fontWeight: "700", fontFamily: "Georgia,serif", boxShadow: "0 8px 28px rgba(194,160,114,0.38)", display: "flex", alignItems: "center", gap: "8px" }}>
                <FiSearch size={14} /> Find Internship
              </button>
              <button className="btn-hover" onClick={() => window.location.href = "/register"} style={{ padding: "14px 28px", background: "transparent", border: "1.5px solid rgba(17,34,80,0.16)", borderRadius: "9px", cursor: "pointer", color: C.navy, fontSize: "14px", fontFamily: "Georgia,serif", display: "flex", alignItems: "center", gap: "8px", transition: "border-color .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(17,34,80,0.16)"}
              ><FiBriefcase size={14} /> Post an Offer</button>
            </div>

            <div className="hero-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", marginTop: "32px", background: "rgba(255,255,255,0.72)", backdropFilter: "blur(10px)", border: "1px solid rgba(17,34,80,0.07)", borderRadius: "12px", overflow: "hidden", animation: titleVisible ? "fadeUp .6s ease .5s both" : "none" }}>
              {[{ icon: <FiBriefcase size={13} />, val: "500+", txt: "Offers" }, { icon: <FiUsers size={13} />, val: "200+", txt: "Companies" }, { icon: <FiAward size={13} />, val: "1000+", txt: "Students" }, { icon: <FiMapPin size={13} />, val: "48", txt: "Wilayas" }].map((s, i) => (
                <div key={i} style={{ flex: 1, padding: "12px 8px", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(17,34,80,0.06)" : "none" }}>
                  <div style={{ color: C.gold, marginBottom: "3px", display: "flex", justifyContent: "center" }}>{s.icon}</div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: C.navy, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: "9px", color: C.muted, letterSpacing: "1px", marginTop: "2px" }}>{s.txt.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: people photos */}
          <div className="hero-visual-wrap" style={{ animation: titleVisible ? "slideR .8s ease .2s both" : "none" }}>
            <HeroVisual />
          </div>
        </div>

        <div className="scroll-dot" style={{ position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", opacity: .3 }}>
          <span style={{ fontSize: "9px", color: C.navy, letterSpacing: "2px" }}>SCROLL</span>
          <div style={{ width: "1px", height: "32px", background: `linear-gradient(180deg,${C.navy},transparent)` }} />
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <section style={{ background: C.navy, padding: "36px 5%" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }} className="stats-bar-grid">
          {[{ icon: <FiBriefcase size={16} />, target: 500, suffix: "+", label: "Internship Offers" }, { icon: <FiUsers size={16} />, target: 200, suffix: "+", label: "Partner Companies" }, { icon: <FiAward size={16} />, target: 1000, suffix: "+", label: "Students Placed" }, { icon: <FiMapPin size={16} />, target: 48, suffix: "", label: "Wilayas Covered" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "12px 16px", borderRight: i < 3 ? "1px solid rgba(194,160,114,0.12)" : "none" }}>
              <div style={{ color: C.gold, marginBottom: "6px", display: "flex", justifyContent: "center" }}>{s.icon}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "38px", fontWeight: "600", color: C.gold, lineHeight: 1, marginBottom: "4px" }}><Counter target={s.target} suffix={s.suffix} /></div>
              <div style={{ fontSize: "10px", color: "rgba(245,240,233,0.4)", letterSpacing: "1.5px" }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="section-pad" style={{ padding: "96px 5%", background: C.offWhite }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div style={{ fontSize: "10px", color: C.gold, letterSpacing: "3px", marginBottom: "10px" }}>✦ BUILT FOR EVERYONE</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: "600", color: C.navy, margin: "0 0 14px" }}>One Platform, Three Experiences</h2>
            <div style={{ width: "48px", height: "2px", background: `linear-gradient(90deg,transparent,${C.gold},transparent)`, margin: "0 auto" }} />
          </div>
          <div ref={featRef} className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "22px" }}>
            {features.map((f, i) => (
              <div key={i} className="hover-lift" style={{ background: f.featured ? C.navy : C.white, borderRadius: "20px", padding: "36px 28px", boxShadow: f.featured ? "0 16px 48px rgba(17,34,80,0.22)" : "0 4px 20px rgba(17,34,80,0.06)", borderTop: `4px solid ${f.accent}`, position: "relative", overflow: "hidden", animation: featVisible ? `fadeUp .6s ease ${i * .15}s both` : "none" }}>
                {f.featured && <div style={{ position: "absolute", top: "14px", right: "14px", background: "rgba(194,160,114,0.18)", border: "1px solid rgba(194,160,114,0.35)", borderRadius: "20px", padding: "2px 10px", fontSize: "9px", color: C.gold, letterSpacing: "1px" }}>MOST POPULAR</div>}
                <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: f.featured ? "rgba(194,160,114,0.12)" : "rgba(17,34,80,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: f.featured ? C.gold : f.accent, marginBottom: "16px" }}>{f.icon}</div>
                <div style={{ fontSize: "9px", letterSpacing: "2px", marginBottom: "7px", fontWeight: "700", color: f.featured ? C.gold : f.accent }}>{f.tag}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "21px", fontWeight: "600", color: f.featured ? C.white : C.navy, margin: "0 0 11px", lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ fontSize: "14px", lineHeight: 1.75, color: f.featured ? "rgba(245,240,233,0.6)" : C.muted, margin: "0 0 20px" }}>{f.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {f.pills.map((p, j) => <span key={j} style={{ padding: "3px 11px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", background: f.featured ? "rgba(194,160,114,0.12)" : "rgba(17,34,80,0.05)", color: f.featured ? C.gold : C.sapphire, border: f.featured ? "1px solid rgba(194,160,114,0.2)" : "1px solid rgba(17,34,80,0.08)" }}>{p}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OUR COMPANIES ══ */}
      <section style={{ padding: "80px 0", background: C.cream, overflow: "hidden" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 5%", marginBottom: "36px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "10px", color: C.gold, letterSpacing: "3px", marginBottom: "10px" }}>✦ TRUSTED PARTNERS</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: "600", color: C.navy, margin: 0 }}>Our Companies</h2>
            </div>
            <button className="btn-hover" onClick={() => window.location.href = "/companies"} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 22px", background: "transparent", border: `1.5px solid rgba(17,34,80,0.18)`, borderRadius: "8px", cursor: "pointer", color: C.navy, fontSize: "13px", fontFamily: "Georgia,serif", transition: "border-color .2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(17,34,80,0.18)"}
            >See All Companies <FiArrowRight size={14} /></button>
          </div>
        </div>
        <div style={{ overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "80px", background: `linear-gradient(90deg,${C.cream},transparent)`, zIndex: 1, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "80px", background: `linear-gradient(270deg,${C.cream},transparent)`, zIndex: 1, pointerEvents: "none" }} />
          <div style={{ display: "flex", animation: "marquee 28s linear infinite", width: "fit-content" }}>
            {[...displayCompanies, ...displayCompanies].map((c, i) => (
              <div key={i} style={{ flexShrink: 0, margin: "0 10px", background: C.white, borderRadius: "14px", padding: "16px 22px", boxShadow: "0 3px 16px rgba(17,34,80,0.06)", border: "1px solid rgba(17,34,80,0.07)", display: "flex", alignItems: "center", gap: "11px", minWidth: "170px", cursor: "pointer", transition: "all .3s" }}
                onClick={() => { if (c.id) window.location.href = `/company/${c.id}`; }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(194,160,114,0.4)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(17,34,80,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `linear-gradient(135deg,rgba(194,160,114,0.18),rgba(194,160,114,0.05))`, border: "1px solid rgba(194,160,114,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: C.gold, fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
                  {c.company_name ? c.company_name[0].toUpperCase() : "C"}
                </div>
                <div>
                  <div style={{ fontWeight: "700", color: C.navy, fontSize: "12px", whiteSpace: "nowrap" }}>{c.company_name}</div>
                  {c.location && <div style={{ fontSize: "9px", color: C.muted, display: "flex", alignItems: "center", gap: "3px", marginTop: "2px" }}><FiMapPin size={8} />{c.location}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="section-pad" style={{ padding: "96px 5%", background: C.offWhite, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle,rgba(194,160,114,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "68px" }}>
            <div style={{ fontSize: "10px", color: C.gold, letterSpacing: "3px", marginBottom: "10px" }}>✦ SIMPLE PROCESS</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: "600", color: C.navy, margin: "0 0 14px" }}>How Stag.io Works</h2>
            <div style={{ width: "48px", height: "2px", background: `linear-gradient(90deg,transparent,${C.gold},transparent)`, margin: "0 auto" }} />
          </div>
          <div ref={stepsRef} className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "28px", position: "relative" }}>
            <div className="steps-line" style={{ position: "absolute", top: "33px", left: "12%", right: "12%", height: "1px", background: `linear-gradient(90deg,transparent,rgba(194,160,114,0.3),transparent)` }} />
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: "center", position: "relative", zIndex: 1, animation: stepsVisible ? `fadeUp .6s ease ${i * .15}s both` : "none" }}>
                <div style={{ width: "66px", height: "66px", borderRadius: "50%", margin: "0 auto 16px", background: i % 2 === 0 ? `linear-gradient(135deg,${C.gold},${C.lightGold})` : C.white, border: i % 2 === 0 ? "none" : `1.5px solid rgba(194,160,114,0.35)`, display: "flex", alignItems: "center", justifyContent: "center", color: i % 2 === 0 ? C.navy : C.gold, boxShadow: i % 2 === 0 ? "0 8px 24px rgba(194,160,114,0.3)" : "0 4px 16px rgba(17,34,80,0.07)" }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: "9px", color: C.gold, letterSpacing: "2px", marginBottom: "7px" }}>STEP {s.n}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "18px", fontWeight: "600", color: C.navy, margin: "0 0 8px", lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ fontSize: "13px", color: C.muted, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ REVIEWS ══ */}
      <section className="section-pad" style={{ padding: "96px 5%", background: C.cream }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div style={{ fontSize: "10px", color: C.gold, letterSpacing: "3px", marginBottom: "10px" }}>✦ STUDENT VOICES</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: "600", color: C.navy, margin: "0 0 14px" }}>What Students Say</h2>
            <div style={{ width: "48px", height: "2px", background: `linear-gradient(90deg,transparent,${C.gold},transparent)`, margin: "0 auto 24px" }} />
            <button onClick={() => setShowReviewGate(true)} style={{ padding: "10px 24px", background: `linear-gradient(135deg,${C.gold},${C.lightGold})`, border: "none", borderRadius: "8px", cursor: "pointer", color: C.navy, fontSize: "13px", fontWeight: "bold", fontFamily: "Georgia,serif", boxShadow: "0 4px 14px rgba(194,160,114,0.3)" }}>✦ Leave a Review</button>
          </div>
          <div ref={revRef} className="reviews-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "22px" }}>
            {displayReviews.slice(0, 6).map((r, i) => (
              <div key={i} className="hover-lift" style={{ background: C.white, borderRadius: "18px", padding: "28px 24px", boxShadow: "0 4px 20px rgba(17,34,80,0.06)", border: "1px solid rgba(17,34,80,0.06)", position: "relative", overflow: "hidden", animation: revVisible ? `fadeUp .6s ease ${i * .1}s both` : "none" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg,${C.gold},${C.lightGold})`, borderRadius: "18px 18px 0 0" }} />
                <div style={{ display: "flex", gap: "3px", marginBottom: "14px" }}>
                  {Array.from({ length: 5 }).map((_, j) => <FiStar key={j} size={13} style={{ fill: j < (r.rating || 5) ? C.gold : "none", color: j < (r.rating || 5) ? C.gold : C.shell }} />)}
                </div>
                <p style={{ fontSize: "13px", color: "rgba(17,34,80,0.62)", lineHeight: 1.75, margin: "0 0 18px", fontStyle: "italic" }}>"{r.comment}"</p>
                <div style={{ height: "1px", background: "rgba(17,34,80,0.06)", marginBottom: "14px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `linear-gradient(135deg,${C.gold},${C.lightGold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: C.navy, fontFamily: "'Cormorant Garamond',Georgia,serif", flexShrink: 0 }}>
                    {r.student_name ? r.student_name[0] : "S"}
                  </div>
                  <div>
                    <div style={{ fontWeight: "700", color: C.navy, fontSize: "13px" }}>{r.student_name}</div>
                    <div style={{ fontSize: "11px", color: C.muted, display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}><FiBriefcase size={10} />{r.company_name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section ref={ctaRef} className="section-pad" style={{ padding: "96px 5%", background: `linear-gradient(135deg,${C.navy} 0%,${C.navyMid} 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(194,160,114,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(194,160,114,0.035) 1px,transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1, animation: ctaVisible ? "fadeUp .7s ease both" : "none" }}>
          <div style={{ fontSize: "10px", color: C.gold, letterSpacing: "3px", marginBottom: "14px" }}>✦ JOIN TODAY</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(30px,5vw,54px)", fontWeight: "600", color: C.white, margin: "0 0 18px", lineHeight: 1.15 }}>
            Ready to Start Your<br /><span className="gold-text">Internship Journey?</span>
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(217,203,194,0.6)", lineHeight: 1.8, maxWidth: "460px", margin: "0 auto 36px" }}>
            Join thousands of Algerian students and companies already using Stag.io to connect and succeed.
          </p>
          <div className="cta-btns" style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-hover" onClick={() => window.location.href = "/register"} style={{ padding: "14px 32px", background: `linear-gradient(135deg,${C.gold},${C.lightGold})`, border: "none", borderRadius: "9px", cursor: "pointer", color: C.navy, fontSize: "14px", fontWeight: "700", fontFamily: "Georgia,serif", boxShadow: "0 8px 28px rgba(194,160,114,0.35)", display: "flex", alignItems: "center", gap: "8px" }}>
              <FiUser size={14} /> Create Free Account
            </button>
            <button className="btn-hover" onClick={() => window.location.href = "/login"} style={{ padding: "14px 32px", background: "transparent", border: "1.5px solid rgba(245,240,233,0.22)", borderRadius: "9px", cursor: "pointer", color: "rgba(245,240,233,0.8)", fontSize: "14px", fontFamily: "Georgia,serif", display: "flex", alignItems: "center", gap: "8px", transition: "border-color .2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(194,160,114,0.5)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(245,240,233,0.22)"}
            ><FiArrowRight size={14} /> Sign In</button>
          </div>
        </div>
      </section>

      {/* ══ LOGIN GATE MODAL (reviews) ══ */}
      {showReviewGate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(17,34,80,0.55)", backdropFilter: "blur(6px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: C.white, borderRadius: "20px", padding: "40px 36px", width: "100%", maxWidth: "420px", boxShadow: "0 30px 80px rgba(17,34,80,0.25)", position: "relative", textAlign: "center", fontFamily: "Georgia,serif" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg,${C.gold},${C.lightGold})`, borderRadius: "20px 20px 0 0" }} />
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(194,160,114,0.1)", border: `1.5px solid rgba(194,160,114,0.35)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "26px" }}>🎓</div>
            <div style={{ fontSize: "10px", color: C.gold, letterSpacing: "3px", marginBottom: "10px" }}>✦ REVIEWS</div>
            <h2 style={{ fontSize: "20px", color: C.navy, fontWeight: "bold", margin: "0 0 14px" }}>Share Your Experience</h2>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7, margin: "0 0 28px" }}>
              Only students who have completed a validated internship can leave a review. Please sign in to share your experience with the community.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setShowReviewGate(false)} style={{ flex: 1, padding: "11px", background: "none", border: "1.5px solid #ddd", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontFamily: "Georgia,serif", color: "#888" }}>Cancel</button>
              <button onClick={() => window.location.href = "/login"} style={{ flex: 2, padding: "11px", background: `linear-gradient(135deg,${C.gold},${C.lightGold})`, border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "bold", color: C.navy, fontFamily: "Georgia,serif", boxShadow: "0 4px 14px rgba(194,160,114,0.3)" }}>✦ Sign In</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}