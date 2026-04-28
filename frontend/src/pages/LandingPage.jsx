import { useState, useEffect, useRef } from "react";
import WebsiteReviewSection from "../components/WebsiteReviewSection";
import { Navbar, Footer, C, SHARED_STYLES } from "./SharedLayout";
import {
  FiUser, FiBriefcase, FiShield, FiSearch, FiCheckCircle,
  FiFileText, FiUsers, FiAward, FiMapPin, FiStar, FiArrowRight,
} from "react-icons/fi";

/* ═══════════════════════════════════════════════════
   GLOBAL CSS INJECTED ONCE
═══════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  /* ── Entrance keyframes ── */
  @keyframes kSlideLeft  { from{opacity:0;transform:translateX(-72px)} to{opacity:1;transform:translateX(0)} }
  @keyframes kSlideRight { from{opacity:0;transform:translateX(72px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes kFadeUp     { from{opacity:0;transform:translateY(32px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes kFadeIn     { from{opacity:0} to{opacity:1} }
  @keyframes kLineGrow   { from{transform:scaleX(0);opacity:0} to{transform:scaleX(1);opacity:1} }
  @keyframes kLineGrowY  { from{transform:scaleY(0);opacity:0} to{transform:scaleY(1);opacity:1} }
  @keyframes kScaleIn    { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }
  @keyframes kBadgePop   { 0%{opacity:0;transform:scale(.55) translateY(12px)} 72%{transform:scale(1.06)} 100%{opacity:1;transform:scale(1) translateY(0)} }

  /* ── Ambient / continuous ── */
  @keyframes kFloat      { 0%,100%{transform:translateY(0)}        50%{transform:translateY(-11px)} }
  @keyframes kFloatR     { 0%,100%{transform:translateY(0)}        50%{transform:translateY(11px)}  }
  @keyframes kFloatSlow  { 0%,100%{transform:translateY(0)}        50%{transform:translateY(-6px)}  }
  @keyframes kPulse      { 0%,100%{opacity:1;transform:scale(1)}   50%{opacity:.45;transform:scale(.75)} }
  @keyframes kPulseGlow  { 0%,100%{box-shadow:0 0 0 0 rgba(194,160,114,0)} 50%{box-shadow:0 0 18px 6px rgba(194,160,114,0.35)} }
  @keyframes kMorphBlob  {
    0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 50%}
    25%{border-radius:40% 60% 30% 70%/60% 40% 70% 30%}
    50%{border-radius:70% 30% 50% 50%/30% 70% 50% 60%}
    75%{border-radius:30% 70% 60% 40%/70% 30% 40% 60%}
  }
  @keyframes kRotateRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes kOrbit      { from{transform:rotate(0deg) translateX(var(--r,80px)) rotate(0deg)} to{transform:rotate(360deg) translateX(var(--r,80px)) rotate(-360deg)} }
  @keyframes kSparkle    { 0%,100%{opacity:0;transform:scale(.3) rotate(0deg)} 50%{opacity:1;transform:scale(1) rotate(180deg)} }
  @keyframes kScan       { from{top:-3px} to{top:100%} }
  @keyframes kBeam       {
    0%{transform:translateX(-110%) rotate(var(--br,0deg));opacity:0}
    10%,90%{opacity:1}
    100%{transform:translateX(210%) rotate(var(--br,0deg));opacity:0}
  }
  @keyframes kMarquee    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes kBracket    { 0%,100%{opacity:.3} 50%{opacity:1} }
  @keyframes kCardFloat  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-9px) rotate(.2deg)} }
  @keyframes kImgReveal  { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
  @keyframes kParticle   { 0%{transform:translateY(100vh) scale(0);opacity:0} 10%{opacity:1} 90%{opacity:.6} 100%{transform:translateY(-20px) scale(1.2);opacity:0} }
  @keyframes kShimmer    { 0%{background-position:-300% 0} 100%{background-position:300% 0} }
  @keyframes kGoldLine   { 0%,100%{opacity:.4} 50%{opacity:1} }
  @keyframes kCountUp    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  /* ── Hover helpers ── */
  .ld-btn-gold { transition: transform .22s ease, box-shadow .22s ease, background .22s ease !important; }
  .ld-btn-gold:hover { transform: translateY(-3px) !important; box-shadow: 0 14px 40px rgba(194,160,114,.55) !important; }
  .ld-btn-ghost { transition: border-color .22s, color .22s, transform .22s !important; }
  .ld-btn-ghost:hover { border-color: #C2A072 !important; color: #C2A072 !important; transform: translateY(-3px) !important; }
  .ld-hover-lift { transition: transform .25s ease, box-shadow .25s ease !important; }
  .ld-hover-lift:hover { transform: translateY(-5px) !important; box-shadow: 0 20px 56px rgba(17,34,80,.13) !important; }

  /* ── Responsive ── */
  @media (max-width: 960px) {
    .ld-hero-grid  { grid-template-columns: 1fr !important; gap: 48px !important; }
    .ld-hero-right { display: none !important; }
    .ld-feat-grid  { grid-template-columns: 1fr !important; }
    .ld-steps-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
    .ld-steps-line { display: none !important; }
    .ld-rev-grid   { grid-template-columns: 1fr !important; }
    .ld-stats-grid { grid-template-columns: 1fr 1fr !important; }
    .ld-stats-grid > div { border-right: none !important; border-bottom: 1px solid rgba(194,160,114,0.12) !important; }
  }
  @media (max-width: 600px) {
    .ld-hero-section { padding: 90px 5% 50px !important; }
    .ld-hero-btns { flex-direction: column !important; }
    .ld-hero-btns button { width: 100% !important; justify-content: center !important; }
    .ld-steps-grid { grid-template-columns: 1fr !important; }
    .ld-section-pad { padding: 60px 5% !important; }
    .ld-cta-btns { flex-direction: column !important; align-items: stretch !important; }
    .ld-cta-btns button { width: 100% !important; justify-content: center !important; }
  }
`;

/* ═══════════════════════════════════════════════════
   COLOUR TOKENS (local, not depending on C from SharedLayout)
═══════════════════════════════════════════════════ */
const GLD  = "#C2A072";
const GLDT = "#D4B896";  // lighter gold
const GLDD = "#A0804E";  // darker gold
const NVY  = "#0B1730";  // very deep navy
const NVY2 = "#112250";
const CRM  = "#F7F2EA";
const WHT  = "#FFFFFF";
const MUT  = "rgba(11,23,48,0.52)";

/* ═══════════════════════════════════════════════════
   SLIDES DATA
═══════════════════════════════════════════════════ */
const SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=640&h=800&fit=crop&crop=faces,top",
    tag: "Student",
    quote: "Found my engineering role at Sonatrach in 3 days. The smart matching is incredible.",
    name: "Amira Boukhalfa",
    role: "Software Eng. Student",
    uni: "USTHB · Alger",
    status: "✓ Placed at Sonatrach",
    statusColor: "#4ade80",
    accent: GLD,
  },
  {
    img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=640&h=800&fit=crop&crop=faces,top",
    tag: "Company",
    quote: "We hired 4 talented interns this semester. Candidate quality on Stag.io is outstanding.",
    name: "Karim Benali",
    role: "HR Director",
    uni: "Djezzy · Alger",
    status: "✓ 4 Hires This Month",
    statusColor: "#93c5fd",
    accent: "#93c5fd",
  },
  {
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=640&h=800&fit=crop&crop=faces,top",
    tag: "Student",
    quote: "My official convention PDF was ready in minutes after validation. Zero paperwork stress.",
    name: "Sara Khelifi",
    role: "Finance Student",
    uni: "Univ. Constantine 2",
    status: "✓ Convention Signed",
    statusColor: GLD,
    accent: GLD,
  },
];

/* ═══════════════════════════════════════════════════
   CANVAS PARTICLE SYSTEM
═══════════════════════════════════════════════════ */
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* particles */
    const N = 90;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * (W || 1200),
      y: Math.random() * (H || 800),
      vx: (Math.random() - .5) * .32,
      vy: (Math.random() - .5) * .32,
      r: Math.random() * 1.6 + .5,
      a: Math.random() * .55 + .1,
      gold: Math.random() > .6,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
      });
      /* connections */
      const D = 130;
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.hypot(dx, dy);
        if (d < D) {
          const a = (1 - d / D) * .14;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = (pts[i].gold || pts[j].gold)
            ? `rgba(194,160,114,${a * 1.5})`
            : `rgba(255,255,255,${a * .6})`;
          ctx.lineWidth = .55;
          ctx.stroke();
        }
      }
      /* dots */
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(194,160,114,${p.a})`
          : `rgba(255,255,255,${p.a * .55})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

/* ═══════════════════════════════════════════════════
   AMBIENT DECORATIVE LAYER
═══════════════════════════════════════════════════ */
function AmbientLayer() {
  const SPARKLES = [
    { t:"9%",  l:"7%",  s:5, d:"0s",   dr:"2.9s" },
    { t:"72%", l:"6%",  s:4, d:"1.2s", dr:"2.4s" },
    { t:"34%", r:"5%",  s:6, d:"2.1s", dr:"3.2s" },
    { t:"81%", r:"18%", s:4, d:".7s",  dr:"2.6s" },
    { t:"18%", l:"44%", s:5, d:"1.8s", dr:"2.8s" },
    { t:"57%", l:"35%", s:3, d:".4s",  dr:"2.1s" },
    { t:"91%", l:"52%", s:4, d:"1.5s", dr:"2.7s" },
    { t:"45%", r:"28%", s:3, d:"2.5s", dr:"2.3s" },
  ];

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:1 }}>
      {/* Morphing blobs */}
      <div style={{ position:"absolute", top:"-180px", right:"-120px", width:"700px", height:"700px",
        background:"radial-gradient(ellipse at 38% 38%, rgba(194,160,114,.18) 0%, rgba(194,160,114,.06) 45%, transparent 68%)",
        animation:"kMorphBlob 16s ease-in-out infinite", borderRadius:"60% 40% 70% 30%/50% 60% 40% 50%" }} />
      <div style={{ position:"absolute", bottom:"-120px", left:"-90px", width:"560px", height:"560px",
        background:"radial-gradient(ellipse at 55% 55%, rgba(146,197,253,.07) 0%, transparent 65%)",
        animation:"kMorphBlob 20s ease-in-out infinite reverse", borderRadius:"50% 60% 40% 70%/60% 40% 60% 40%" }} />
      <div style={{ position:"absolute", top:"28%", left:"-60px", width:"380px", height:"380px",
        background:"radial-gradient(ellipse, rgba(212,184,150,.12) 0%, transparent 68%)",
        animation:"kMorphBlob 13s ease-in-out infinite", animationDelay:"-4s", borderRadius:"40% 60% 60% 40%/70% 30% 70% 30%" }} />

      {/* Large decorative letter */}
      <div style={{
        position:"absolute", right:"-2%", top:"50%", transform:"translateY(-52%)",
        fontFamily:"'Cormorant Garamond',Georgia,serif",
        fontSize:"clamp(260px,38vw,520px)", fontWeight:"700", fontStyle:"italic",
        color:"transparent", WebkitTextStroke:"1px rgba(194,160,114,.09)",
        lineHeight:1, userSelect:"none", letterSpacing:"-16px", zIndex:0,
      }}>S</div>

      {/* Orbiting rings */}
      <div style={{ position:"absolute", top:"7%", right:"3%", width:"320px", height:"320px", animation:"kRotateRing 22s linear infinite" }}>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1px solid rgba(194,160,114,.18)" }}>
          <div style={{ position:"absolute", top:"-5px", left:"50%", marginLeft:"-5px",
            width:"10px", height:"10px", borderRadius:"50%", background:GLD, opacity:.65,
            boxShadow:`0 0 8px ${GLD}` }} />
        </div>
      </div>
      <div style={{ position:"absolute", top:"13%", right:"8%", width:"190px", height:"190px", animation:"kRotateRing 14s linear infinite reverse" }}>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1px dashed rgba(194,160,114,.13)" }} />
      </div>
      <div style={{ position:"absolute", bottom:"12%", left:"4%", width:"240px", height:"240px", animation:"kRotateRing 28s linear infinite" }}>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1px solid rgba(255,255,255,.05)" }} />
      </div>

      {/* Diagonal accent line */}
      <div style={{ position:"absolute", top:0, left:"42%", width:"1px", height:"100%",
        background:"linear-gradient(180deg,transparent 0%,rgba(194,160,114,.22) 28%,rgba(194,160,114,.13) 70%,transparent 100%)",
        animation:"kGoldLine 5s ease-in-out infinite" }} />

      {/* Light beam sweeps */}
      {[
        { t:"18%", w:"55%", l:"-5%",  r:"-13deg", dur:"10s", del:"0s"   },
        { t:"44%", w:"42%", l:"18%",  r:"-8deg",  dur:"14s", del:"3.5s" },
        { t:"72%", w:"38%", r:"-5%",  r2:"-5deg", dur:"11s", del:"7s"   },
      ].map((b, i) => (
        <div key={i} style={{
          position:"absolute", top:b.t, left:b.l, right:b.r, width:b.w, height:"1.5px",
          background:`linear-gradient(90deg,transparent,rgba(194,160,114,0.16) 45%,rgba(194,160,114,0.16) 55%,transparent)`,
          transform:`rotate(${b.r || b.r2})`, "--br":`${b.r || b.r2}`,
          animation:`kBeam ${b.dur} ${b.del} ease-in-out infinite`,
        }} />
      ))}

      {/* Scan line */}
      <div style={{
        position:"absolute", left:0, right:0, height:"2px",
        background:"linear-gradient(90deg,transparent,rgba(194,160,114,.12) 40%,rgba(194,160,114,.20) 50%,rgba(194,160,114,.12) 60%,transparent)",
        animation:"kScan 18s linear 2s infinite",
      }} />

      {/* Sparkle dots */}
      {SPARKLES.map((s, i) => (
        <div key={i} style={{
          position:"absolute", top:s.t, left:s.l, right:s.r,
          width:s.s, height:s.s, borderRadius:"50%",
          background: i % 2 === 0 ? "rgba(194,160,114,.75)" : "rgba(255,255,255,.35)",
          animation:`kSparkle ${s.dr} ${s.d} ease-in-out infinite`,
        }} />
      ))}

      {/* Scattered static gold dots */}
      {[
        { t:"11%", l:"8%"  }, { t:"26%", l:"21%" }, { t:"69%", l:"13%" },
        { t:"87%", l:"37%" }, { t:"19%", r:"17%" }, { t:"54%", r:"7%"  },
        { t:"79%", r:"23%" }, { t:"41%", l:"52%" },
      ].map((d, i) => (
        <div key={i} style={{ position:"absolute", top:d.t, left:d.l, right:d.r,
          width:"3px", height:"3px", borderRadius:"50%", background:GLD, opacity:.35 }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PHOTO CARD (right side hero)
═══════════════════════════════════════════════════ */
function PhotoStack({ titleVisible }) {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = (idx) => {
    if (idx === active) return;
    setFading(true);
    setTimeout(() => { setActive(idx); setFading(false); }, 300);
  };

  useEffect(() => {
    const t = setInterval(() => goTo((active + 1) % SLIDES.length), 4800);
    return () => clearInterval(t);
  }, [active]);

  const s = SLIDES[active];

  return (
    <div style={{ position:"relative", width:"100%", maxWidth:"400px", margin:"0 auto",
      opacity: titleVisible ? 1 : 0,
      animation: titleVisible ? "kSlideRight .9s ease .25s both" : "none",
    }}>
      {/* Back shadow cards */}
      <div style={{ position:"absolute", top:"24px", left:"14px", right:"-22px", bottom:"-18px",
        borderRadius:"20px", background:"rgba(194,160,114,.16)", transform:"rotate(3.4deg)" }} />
      <div style={{ position:"absolute", top:"12px", left:"7px",  right:"-11px", bottom:"-8px",
        borderRadius:"20px", background:"rgba(17,34,80,.12)",      transform:"rotate(1.6deg)" }} />

      {/* Gold frame ghost */}
      <div style={{ position:"absolute", top:"28px", left:"28px", right:"-28px", bottom:"-28px",
        border:"1px solid rgba(194,160,114,.22)", borderRadius:"6px", zIndex:0 }} />

      {/* Main card */}
      <div style={{
        position:"relative", zIndex:2, borderRadius:"20px", overflow:"hidden",
        height:"490px", boxShadow:`0 48px 96px rgba(0,0,0,.52), 0 0 0 1px rgba(194,160,114,.15)`,
        animation:"kCardFloat 5.5s ease-in-out infinite",
      }}>
        {/* Gold corner brackets */}
        {["tl","tr","bl","br"].map((pos, pi) => (
          <div key={pos} style={{
            position:"absolute", zIndex:6, width:"22px", height:"22px",
            top:    pos.includes("t") ? "11px" : "auto",
            bottom: pos.includes("b") ? "11px" : "auto",
            left:   pos.includes("l") ? "11px" : "auto",
            right:  pos.includes("r") ? "11px" : "auto",
            borderTop:    pos.includes("t") ? `1.5px solid ${GLD}` : "none",
            borderBottom: pos.includes("b") ? `1.5px solid ${GLD}` : "none",
            borderLeft:   pos.includes("l") ? `1.5px solid ${GLD}` : "none",
            borderRight:  pos.includes("r") ? `1.5px solid ${GLD}` : "none",
            animation:`kBracket 3s ease-in-out ${pi * .45}s infinite`,
          }} />
        ))}

        {/* Top accent bar */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"4px",
          background:`linear-gradient(90deg,${GLD},${GLDT},${GLD})`,
          backgroundSize:"200% 100%", animation:"kShimmer 4s linear infinite", zIndex:5 }} />

        {/* Slide counter badge */}
        <div style={{ position:"absolute", top:"13px", right:"13px", zIndex:5,
          width:"34px", height:"34px", borderRadius:"50%",
          background:`rgba(194,160,114,0.9)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:`0 0 14px rgba(194,160,114,.5)`,
          animation:"kPulseGlow 3s ease-in-out infinite",
        }}>
          <span style={{ fontSize:"10px", fontWeight:"700", color:NVY, fontFamily:"Georgia,serif" }}>
            {active+1}/{SLIDES.length}
          </span>
        </div>

        {/* Tag */}
        <div style={{ position:"absolute", top:"13px", left:"13px", zIndex:5,
          background:"rgba(8,14,40,.8)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(255,255,255,.14)", borderRadius:"3px", padding:"4px 12px" }}>
          <span style={{ fontSize:"9px", color:GLD, fontWeight:"700", letterSpacing:"2.5px" }}>{s.tag.toUpperCase()}</span>
        </div>

        {/* Photo */}
        <img src={s.img} alt={s.name} style={{
          width:"100%", height:"100%", objectFit:"cover", display:"block",
          transition:"opacity .32s ease, transform .32s ease",
          opacity: fading ? 0 : 1,
          transform: fading ? "scale(1.04)" : "scale(1)",
        }} />

        {/* Dark gradient overlay */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, zIndex:4,
          background:"linear-gradient(to top,rgba(7,13,42,.98) 0%,rgba(7,13,42,.75) 48%,transparent 100%)",
          padding:"48px 22px 24px",
          transition:"opacity .32s ease", opacity: fading ? 0 : 1,
        }}>
          {/* Progress bar */}
          <div style={{ display:"flex", gap:"5px", marginBottom:"18px" }}>
            {SLIDES.map((_, i) => (
              <div key={i} onClick={() => goTo(i)} style={{
                flex: i === active ? 2 : 1, height:"2px", borderRadius:"1px", cursor:"pointer",
                background: i === active ? GLD : "rgba(245,240,233,.22)",
                transition:"all .35s ease",
              }} />
            ))}
          </div>

          <p style={{
            fontSize:"13px", fontStyle:"italic",
            color:"rgba(245,240,233,.8)", lineHeight:1.72, margin:"0 0 15px",
            borderLeft:`2.5px solid ${s.accent}`, paddingLeft:"11px", maxWidth:"290px",
          }}>"{s.quote}"</p>

          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontWeight:"700", color:WHT, fontSize:"14px", marginBottom:"3px" }}>{s.name}</div>
              <div style={{ fontSize:"11px", color:"rgba(245,240,233,.5)" }}>{s.role}</div>
              <div style={{ fontSize:"10px", color:"rgba(245,240,233,.3)", marginTop:"2px" }}>{s.uni}</div>
            </div>
            <div style={{ display:"flex", gap:"2px", flexShrink:0, paddingBottom:"2px" }}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={GLD}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.27L7 14.14 2 9.27l6.91-1.01Z"/>
                </svg>
              ))}
            </div>
          </div>

          <div style={{
            marginTop:"13px", display:"inline-flex", alignItems:"center", gap:"7px",
            background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.14)",
            borderRadius:"3px", padding:"5px 13px",
          }}>
            <div style={{ width:"6px", height:"6px", borderRadius:"50%",
              background:s.statusColor, flexShrink:0,
              boxShadow:`0 0 8px ${s.statusColor}`, animation:"kPulse 2.5s ease-in-out infinite" }} />
            <span style={{ fontSize:"11px", color:"rgba(245,240,233,.85)", fontWeight:"600" }}>{s.status}</span>
          </div>
        </div>
      </div>

      {/* Dots nav */}
      <div style={{ display:"flex", justifyContent:"center", gap:"7px", marginTop:"18px", position:"relative", zIndex:3 }}>
        {SLIDES.map((_, i) => (
          <div key={i} onClick={() => goTo(i)} style={{
            height:"6px", borderRadius:"3px", cursor:"pointer", transition:"all .3s",
            width: i === active ? "24px" : "7px",
            background: i === active ? GLD : "rgba(255,255,255,.18)",
            boxShadow: i === active ? `0 0 10px ${GLD}` : "none",
          }} />
        ))}
      </div>

      {/* Floating badge — match rate */}
      <div style={{
        position:"absolute", bottom:"85px", right:"-46px", zIndex:5,
        background:WHT, borderRadius:"12px", padding:"13px 17px",
        boxShadow:"0 20px 50px rgba(0,0,0,.35)",
        animation:"kFloat 5s ease-in-out infinite",
        border:"1px solid rgba(17,34,80,.07)",
      }}>
        <div style={{ fontSize:"8px", color:GLD, letterSpacing:"1.8px", marginBottom:"3px", fontWeight:"700" }}>MATCH RATE</div>
        <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"26px", fontWeight:"700", color:NVY, lineHeight:1 }}>94%</div>
      </div>

      {/* Floating badge — partners */}
      <div style={{
        position:"absolute", top:"22px", left:"-46px", zIndex:5,
        background:`linear-gradient(135deg,${GLD},${GLDT})`,
        borderRadius:"12px", padding:"11px 16px",
        boxShadow:`0 14px 36px rgba(194,160,114,.50)`,
        animation:"kFloatR 6s ease-in-out infinite",
      }}>
        <div style={{ fontSize:"8px", color:NVY, opacity:.6, letterSpacing:"1.2px", marginBottom:"3px", fontWeight:"700" }}>PARTNERS</div>
        <div style={{ fontSize:"13px", fontWeight:"700", color:NVY }}>200+ Companies</div>
      </div>

      {/* Floating badge — new offers */}
      <div style={{
        position:"absolute", top:"44%", right:"-42px", zIndex:5,
        background:"rgba(11,23,48,.95)", border:"1px solid rgba(194,160,114,.28)",
        borderRadius:"10px", padding:"10px 15px",
        boxShadow:"0 14px 34px rgba(0,0,0,.4)",
        animation:"kFloat 6.5s ease-in-out 1s infinite",
      }}>
        <div style={{ fontSize:"8px", color:"rgba(245,240,233,.35)", letterSpacing:"1.5px", marginBottom:"3px" }}>NEW TODAY</div>
        <div style={{ fontSize:"13px", fontWeight:"700", color:GLD }}>+12 Offers</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════════════ */
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let s = 0; const step = target / 60;
      const t = setInterval(() => {
        s += step;
        if (s >= target) { setVal(target); clearInterval(t); }
        else setVal(Math.floor(s));
      }, 16);
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
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); obs.disconnect(); }
    }, { threshold: .08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}

/* ═══════════════════════════════════════════════════
   MARQUEE TICKER
═══════════════════════════════════════════════════ */
const MARQUEE_NAMES = ["Sonatrach","Djezzy","Mobilis","Ooredoo","Air Algérie","BNA","Cevital","Naftal","Algérie Télécom","Condor","Biopharm","ENTP","Cosider","SPA Algérie"];

function MarqueeTicker() {
  const items = [...MARQUEE_NAMES, ...MARQUEE_NAMES];
  return (
    <div style={{ background:NVY, borderBottom:"1px solid rgba(194,160,114,.12)", padding:"10px 0", overflow:"hidden", position:"relative" }}>
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"70px", background:`linear-gradient(90deg,${NVY},transparent)`, zIndex:1, pointerEvents:"none" }} />
      <div style={{ position:"absolute", right:0, top:0, bottom:0, width:"70px", background:`linear-gradient(270deg,${NVY},transparent)`, zIndex:1, pointerEvents:"none" }} />
      <div style={{ display:"flex", animation:"kMarquee 30s linear infinite", width:"max-content" }}>
        {items.map((name, i) => (
          <div key={i} style={{
            display:"flex", alignItems:"center", gap:"10px", padding:"0 28px",
            borderRight:"1px solid rgba(194,160,114,.14)", whiteSpace:"nowrap",
            fontSize:"10px", letterSpacing:"2.5px", color:"rgba(245,240,233,.35)",
          }}>
            <div style={{ width:"4px", height:"4px", borderRadius:"50%", background:GLD, flexShrink:0 }} />
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
export default function LandingPage() {
  const [titleVisible, setTitleVisible] = useState(false);
  const [companies, setCompanies]       = useState([]);
  const [reviews, setReviews]           = useState([]);
  const [showReviewGate, setShowReviewGate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTitleVisible(true), 150);
    fetch("http://127.0.0.1:8000/api/public/companies/").then(r=>r.json()).then(d=>{ if(Array.isArray(d)) setCompanies(d); }).catch(()=>{});
    fetch("http://127.0.0.1:8000/api/public/reviews/").then(r=>r.json()).then(d=>{ if(Array.isArray(d)) setReviews(d); }).catch(()=>{});
    return () => clearTimeout(t);
  }, []);

  const [featRef,  featVisible]  = useReveal();
  const [stepsRef, stepsVisible] = useReveal();
  const [revRef,   revVisible]   = useReveal();
  const [ctaRef,   ctaVisible]   = useReveal();

  /* fallback data */
  const displayCompanies = companies.length > 0 ? companies : [
    { company_name:"Sonatrach",  location:"Alger" }, { company_name:"Djezzy",    location:"Alger" },
    { company_name:"Mobilis",    location:"Alger" }, { company_name:"Ooredoo",   location:"Oran"  },
    { company_name:"Air Algérie",location:"Alger" }, { company_name:"BNA",       location:"Alger" },
    { company_name:"Cevital",    location:"Béjaïa"}, { company_name:"Naftal",    location:"Alger" },
  ];
  const displayReviews = reviews.length > 0 ? reviews : [
    { student_name:"Amira Benali",  company_name:"Sonatrach", rating:5, comment:"Stag.io made finding my internship incredibly easy. The smart matching found me the perfect role!" },
    { student_name:"Yacine Hamdi",  company_name:"Djezzy",    rating:5, comment:"The platform is beautiful and easy to use. I got my convention PDF in minutes after validation." },
    { student_name:"Sara Meziane",  company_name:"Mobilis",   rating:4, comment:"Great experience overall. The application tracking feature kept me informed every step of the way." },
  ];

  const features = [
    { icon:<FiUser size={22}/>,    tag:"STUDENTS",     title:"Find Your Perfect Internship", desc:"Smart skill-based recommendations match you with the right offers across Algeria. Apply in one click and track every step.", pills:["Skill Matching","One-Click Apply","Status Tracking"], accent:GLD  },
    { icon:<FiBriefcase size={22}/>,tag:"COMPANIES",   title:"Recruit Top Student Talent",   desc:"Post offers, review applications, and manage your hiring pipeline from one elegant dashboard.", pills:["Post Offers","Review CVs","Instant Notify"], accent:NVY, featured:true },
    { icon:<FiShield size={22}/>,  tag:"UNIVERSITIES", title:"Full Administrative Control",  desc:"Validate internship agreements, generate official PDF conventions automatically, and monitor students.", pills:["Validate Files","Auto PDF","Analytics"], accent:C.sapphire },
  ];
  const steps = [
    { icon:<FiUser size={20}/>,        n:"01", title:"Create Profile",    desc:"Register as a student or company. Fill in your skills and details in under 2 minutes." },
    { icon:<FiSearch size={20}/>,      n:"02", title:"Discover Offers",   desc:"Browse curated internship offers matched to your skills and location across all 48 wilayas." },
    { icon:<FiFileText size={20}/>,    n:"03", title:"Apply & Connect",   desc:"Send your application with a cover letter. Companies review and respond with full notifications." },
    { icon:<FiCheckCircle size={20}/>, n:"04", title:"Get Validated",     desc:"Your university validates the agreement and generates your official PDF convention automatically." },
  ];

  /* anim helper */
  const anim = (name, delay = "0s", dur = ".7s") =>
    titleVisible ? { animation:`${name} ${dur} ease ${delay} both` } : { opacity:0 };

  return (
    <div style={{ fontFamily:"Georgia,serif", background:CRM, overflowX:"hidden", color:NVY }}>
      <style>{GLOBAL_CSS}</style>
      <style>{SHARED_STYLES}</style>
      <Navbar active="home" />

      {/* ══════════════════════════════════════════
          HERO — DARK CINEMATIC
      ══════════════════════════════════════════ */}
      <section style={{
        minHeight:"100vh", position:"relative", overflow:"hidden",
        background:`linear-gradient(150deg, ${NVY} 0%, #0e1e45 45%, #0a1630 100%)`,
        display:"flex", flexDirection:"column",
      }}>
        <ParticleCanvas />
        <AmbientLayer />

        {/* Navbar spacer */}
        <div style={{ height:"64px" }} />

        {/* Content */}
        <div style={{
          flex:1, display:"flex", alignItems:"center",
          padding:"60px 6% 48px", position:"relative", zIndex:2,
          maxWidth:"1300px", margin:"0 auto", width:"100%",
        }}>
          <div className="ld-hero-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px", alignItems:"center", width:"100%" }}>

            {/* ─── LEFT COPY ─── */}
            <div>
              {/* Eyebrow */}
              <div style={{ display:"inline-flex", alignItems:"center", gap:"12px", marginBottom:"32px", ...anim("kSlideLeft",".08s",".6s") }}>
                <div style={{ width:"32px", height:"1px", background:GLD }} />
                <span style={{ fontSize:"10px", color:GLD, letterSpacing:"4px", fontFamily:"Georgia,serif" }}>
                  ALGERIA'S INTERNSHIP PLATFORM
                </span>
                <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:GLD, animation:"kPulse 2s infinite", boxShadow:`0 0 10px ${GLD}` }} />
              </div>

              {/* Headline — each word staggers in */}
              <div style={{ marginBottom:"8px", ...anim("kSlideLeft",".18s",".7s") }}>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(52px,6.5vw,90px)", fontWeight:"300", color:"rgba(245,240,233,.96)", lineHeight:.96, letterSpacing:"-2px" }}>
                  Your
                </div>
              </div>
              <div style={{ marginBottom:"8px", ...anim("kSlideLeft",".28s",".7s") }}>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(52px,6.5vw,90px)", fontWeight:"700", fontStyle:"italic", color:GLD, lineHeight:.96, letterSpacing:"-2px",
                  textShadow:`0 0 80px rgba(194,160,114,.35)` }}>
                  Internship
                </div>
              </div>
              <div style={{ marginBottom:"28px", ...anim("kSlideLeft",".38s",".7s") }}>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(52px,6.5vw,90px)", fontWeight:"300", fontStyle:"italic", color:"rgba(245,240,233,.96)", lineHeight:.96, letterSpacing:"-2px" }}>
                  Journey.
                </div>
              </div>

              {/* Animated gold rule */}
              <div style={{ width:"80px", height:"2px", marginBottom:"28px", background:`linear-gradient(90deg,${GLD},${GLDT},transparent)`,
                borderRadius:"2px", transformOrigin:"left",
                ...anim("kLineGrow",".5s",".8s") }} />

              {/* Description */}
              <div style={{ display:"flex", alignItems:"flex-start", gap:"16px", maxWidth:"400px", marginBottom:"40px", ...anim("kSlideLeft",".55s",".65s") }}>
                <div style={{ width:"1px", minHeight:"52px", flexShrink:0, background:`linear-gradient(180deg,${GLD},transparent)`,
                  transformOrigin:"top", ...anim("kLineGrowY",".6s",".7s") }} />
                <p style={{ fontSize:"15px", color:"rgba(217,203,194,.58)", lineHeight:1.9, margin:0, fontWeight:"300" }}>
                  Connect students with companies across all 48 wilayas. Apply, track, and download your official{" "}
                  <em style={{ color:"rgba(217,203,194,.82)", fontStyle:"italic" }}>convention de stage</em> — seamlessly.
                </p>
              </div>

              {/* CTAs */}
              <div className="ld-hero-btns" style={{ display:"flex", gap:"14px", flexWrap:"wrap", ...anim("kSlideLeft",".68s",".65s") }}>
                <button className="ld-btn-gold"
                  onClick={() => window.location.href = "/register"}
                  style={{ padding:"14px 32px", background:GLD, border:"none", borderRadius:"3px", cursor:"pointer",
                    color:NVY, fontSize:"11px", fontWeight:"700", fontFamily:"Georgia,serif",
                    letterSpacing:"2.5px", textTransform:"uppercase",
                    boxShadow:`0 8px 28px rgba(194,160,114,.4)` }}>
                  Get Started
                </button>
                <button className="ld-btn-ghost"
                  onClick={() => window.location.href = "/companies"}
                  style={{ padding:"14px 32px", background:"transparent",
                    border:`1px solid rgba(194,160,114,.38)`, borderRadius:"3px", cursor:"pointer",
                    color:"rgba(245,240,233,.72)", fontSize:"11px",
                    fontFamily:"Georgia,serif", letterSpacing:"2.5px", textTransform:"uppercase" }}>
                  View Companies
                </button>
              </div>

              {/* Stats strip */}
              <div style={{
                display:"flex", gap:"0",
                marginTop:"52px", borderTop:"1px solid rgba(194,160,114,.18)", paddingTop:"28px",
                ...anim("kFadeUp",".82s",".6s"),
              }}>
                {[
                  { val:"500+", label:"Offers"    },
                  { val:"200+", label:"Companies" },
                  { val:"1000+",label:"Students"  },
                  { val:"48",   label:"Wilayas"   },
                ].map((s, i) => (
                  <div key={i} style={{
                    flex:1,
                    paddingRight: i < 3 ? "20px" : 0, marginRight: i < 3 ? "20px" : 0,
                    borderRight: i < 3 ? "1px solid rgba(194,160,114,.18)" : "none",
                  }}>
                    <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"30px", fontWeight:"600", color:GLD, lineHeight:1, marginBottom:"5px",
                      textShadow:`0 0 30px rgba(194,160,114,.3)` }}>{s.val}</div>
                    <div style={{ fontSize:"9px", color:"rgba(245,240,233,.28)", letterSpacing:"2px" }}>{s.label.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── RIGHT PHOTO STACK ─── */}
            <div className="ld-hero-right">
              <PhotoStack titleVisible={titleVisible} />
            </div>
          </div>
        </div>

        {/* Bottom gold rule */}
        <div style={{ height:"1px", background:`linear-gradient(90deg,transparent,rgba(194,160,114,.35) 30%,rgba(194,160,114,.35) 70%,transparent)`, position:"relative", zIndex:2 }} />

        {/* Scroll hint */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"6px", padding:"18px", opacity:.3, position:"relative", zIndex:2 }}>
          <span style={{ fontSize:"8px", color:GLD, letterSpacing:"3.5px" }}>SCROLL</span>
          <div style={{ width:"1px", height:"26px", background:`linear-gradient(180deg,${GLD},transparent)` }} />
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <MarqueeTicker />

      {/* ══════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════ */}
      <section style={{ background:NVY, padding:"40px 5%" }}>
        <div style={{ maxWidth:"960px", margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)" }} className="ld-stats-grid">
          {[
            { icon:<FiBriefcase size={16}/>, target:500,  suffix:"+", label:"Internship Offers"  },
            { icon:<FiUsers     size={16}/>, target:200,  suffix:"+", label:"Partner Companies"  },
            { icon:<FiAward     size={16}/>, target:1000, suffix:"+", label:"Students Placed"    },
            { icon:<FiMapPin    size={16}/>, target:48,   suffix:"",  label:"Wilayas Covered"    },
          ].map((s, i) => (
            <div key={i} style={{ textAlign:"center", padding:"12px 16px",
              borderRight: i < 3 ? "1px solid rgba(194,160,114,.12)" : "none" }}>
              <div style={{ color:GLD, marginBottom:"6px", display:"flex", justifyContent:"center" }}>{s.icon}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"40px", fontWeight:"600", color:GLD, lineHeight:1, marginBottom:"4px",
                textShadow:`0 0 30px rgba(194,160,114,.25)` }}>
                <Counter target={s.target} suffix={s.suffix} />
              </div>
              <div style={{ fontSize:"10px", color:"rgba(245,240,233,.35)", letterSpacing:"1.5px" }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section className="ld-section-pad" style={{ padding:"100px 5%", background:C.offWhite }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"64px" }}>
            <div style={{ fontSize:"10px", color:GLD, letterSpacing:"3.5px", marginBottom:"12px" }}>✦ BUILT FOR EVERYONE</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(28px,4vw,48px)", fontWeight:"600", color:NVY, margin:"0 0 14px" }}>One Platform, Three Experiences</h2>
            <div style={{ width:"48px", height:"2px", background:`linear-gradient(90deg,transparent,${GLD},transparent)`, margin:"0 auto" }} />
          </div>
          <div ref={featRef} className="ld-feat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"24px" }}>
            {features.map((f, i) => (
              <div key={i} className="ld-hover-lift" style={{
                background: f.featured ? NVY : C.white,
                borderRadius:"20px", padding:"38px 30px",
                boxShadow: f.featured ? "0 20px 56px rgba(17,34,80,.26)" : "0 4px 24px rgba(17,34,80,.07)",
                borderTop:`4px solid ${f.accent}`,
                position:"relative", overflow:"hidden",
                animation: featVisible ? `kFadeUp .65s ease ${i * .14}s both` : "none",
              }}>
                {f.featured && <div style={{ position:"absolute", top:"14px", right:"14px",
                  background:"rgba(194,160,114,.16)", border:"1px solid rgba(194,160,114,.35)",
                  borderRadius:"20px", padding:"2px 10px", fontSize:"9px", color:GLD, letterSpacing:"1px" }}>MOST POPULAR</div>}
                <div style={{ width:"48px", height:"48px", borderRadius:"12px",
                  background: f.featured ? "rgba(194,160,114,.12)" : "rgba(17,34,80,.05)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color: f.featured ? GLD : f.accent, marginBottom:"18px" }}>{f.icon}</div>
                <div style={{ fontSize:"9px", letterSpacing:"2px", marginBottom:"8px", fontWeight:"700", color: f.featured ? GLD : f.accent }}>{f.tag}</div>
                <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"22px", fontWeight:"600",
                  color: f.featured ? WHT : NVY, margin:"0 0 12px", lineHeight:1.3 }}>{f.title}</h3>
                <p style={{ fontSize:"14px", lineHeight:1.8, color: f.featured ? "rgba(245,240,233,.58)" : MUT, margin:"0 0 22px" }}>{f.desc}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"7px" }}>
                  {f.pills.map((p, j) => (
                    <span key={j} style={{ padding:"3px 12px", borderRadius:"20px", fontSize:"11px", fontWeight:"600",
                      background: f.featured ? "rgba(194,160,114,.12)" : "rgba(17,34,80,.05)",
                      color: f.featured ? GLD : C.sapphire,
                      border: f.featured ? "1px solid rgba(194,160,114,.22)" : "1px solid rgba(17,34,80,.09)" }}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COMPANIES MARQUEE
      ══════════════════════════════════════════ */}
      <section style={{ padding:"80px 0", background:CRM, overflow:"hidden" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"0 5%", marginBottom:"36px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:"16px" }}>
            <div>
              <div style={{ fontSize:"10px", color:GLD, letterSpacing:"3.5px", marginBottom:"10px" }}>✦ TRUSTED PARTNERS</div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(28px,4vw,48px)", fontWeight:"600", color:NVY, margin:0 }}>Our Companies</h2>
            </div>
            <button className="ld-hover-lift"
              onClick={() => window.location.href = "/companies"}
              style={{ display:"flex", alignItems:"center", gap:"8px", padding:"10px 22px",
                background:"transparent", border:"1.5px solid rgba(17,34,80,.18)", borderRadius:"8px",
                cursor:"pointer", color:NVY, fontSize:"13px", fontFamily:"Georgia,serif",
                transition:"border-color .2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = GLD}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(17,34,80,.18)"}
            >See All Companies <FiArrowRight size={14} /></button>
          </div>
        </div>
        <div style={{ overflow:"hidden", position:"relative" }}>
          <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"80px", background:`linear-gradient(90deg,${CRM},transparent)`, zIndex:1, pointerEvents:"none" }} />
          <div style={{ position:"absolute", right:0, top:0, bottom:0, width:"80px", background:`linear-gradient(270deg,${CRM},transparent)`, zIndex:1, pointerEvents:"none" }} />
          <div style={{ display:"flex", animation:"kMarquee 28s linear infinite", width:"fit-content" }}>
            {[...displayCompanies, ...displayCompanies].map((co, i) => (
              <div key={i}
                onClick={() => { if (co.id) window.location.href = `/company/${co.id}`; }}
                style={{ flexShrink:0, margin:"0 10px", background:C.white, borderRadius:"14px", padding:"16px 22px",
                  boxShadow:"0 3px 16px rgba(17,34,80,.06)", border:"1px solid rgba(17,34,80,.07)",
                  display:"flex", alignItems:"center", gap:"12px", minWidth:"175px", cursor:"pointer",
                  transition:"all .3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(194,160,114,.45)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(17,34,80,.07)"; e.currentTarget.style.transform = ""; }}
              >
                <div style={{ width:"40px", height:"40px", borderRadius:"10px", flexShrink:0,
                  background:"linear-gradient(135deg,rgba(194,160,114,.18),rgba(194,160,114,.05))",
                  border:"1px solid rgba(194,160,114,.28)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"16px", fontWeight:"700", color:GLD,
                  fontFamily:"'Cormorant Garamond',Georgia,serif" }}>
                  {co.company_name ? co.company_name[0].toUpperCase() : "C"}
                </div>
                <div>
                  <div style={{ fontWeight:"700", color:NVY, fontSize:"12px", whiteSpace:"nowrap" }}>{co.company_name}</div>
                  {co.location && <div style={{ fontSize:"9px", color:MUT, display:"flex", alignItems:"center", gap:"3px", marginTop:"2px" }}>
                    <FiMapPin size={8}/>{co.location}
                  </div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="ld-section-pad" style={{ padding:"100px 5%", background:C.offWhite, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-80px", right:"-80px", width:"400px", height:"400px",
          borderRadius:"50%", background:"radial-gradient(circle,rgba(194,160,114,.07) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative" }}>
          <div style={{ textAlign:"center", marginBottom:"72px" }}>
            <div style={{ fontSize:"10px", color:GLD, letterSpacing:"3.5px", marginBottom:"12px" }}>✦ SIMPLE PROCESS</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(28px,4vw,48px)", fontWeight:"600", color:NVY, margin:"0 0 14px" }}>How Stag.io Works</h2>
            <div style={{ width:"48px", height:"2px", background:`linear-gradient(90deg,transparent,${GLD},transparent)`, margin:"0 auto" }} />
          </div>
          <div ref={stepsRef} className="ld-steps-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"30px", position:"relative" }}>
            <div className="ld-steps-line" style={{ position:"absolute", top:"33px", left:"12%", right:"12%", height:"1px",
              background:`linear-gradient(90deg,transparent,rgba(194,160,114,.3),transparent)` }} />
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign:"center", position:"relative", zIndex:1,
                animation: stepsVisible ? `kFadeUp .65s ease ${i * .14}s both` : "none" }}>
                <div style={{ width:"68px", height:"68px", borderRadius:"50%", margin:"0 auto 18px",
                  background: i%2===0 ? `linear-gradient(135deg,${GLD},${GLDT})` : C.white,
                  border: i%2===0 ? "none" : `1.5px solid rgba(194,160,114,.38)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color: i%2===0 ? NVY : GLD,
                  boxShadow: i%2===0 ? `0 10px 28px rgba(194,160,114,.32), 0 0 0 6px rgba(194,160,114,.08)` : "0 4px 16px rgba(17,34,80,.07)" }}>
                  {s.icon}
                </div>
                <div style={{ fontSize:"9px", color:GLD, letterSpacing:"2px", marginBottom:"8px" }}>STEP {s.n}</div>
                <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"19px", fontWeight:"600", color:NVY, margin:"0 0 9px", lineHeight:1.3 }}>{s.title}</h3>
                <p style={{ fontSize:"13px", color:MUT, lineHeight:1.75, margin:0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          REVIEWS
      ══════════════════════════════════════════ */}
      <section className="ld-section-pad" style={{ padding:"100px 5%", background:CRM }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"64px" }}>
            <div style={{ fontSize:"10px", color:GLD, letterSpacing:"3.5px", marginBottom:"12px" }}>✦ STUDENT VOICES</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(28px,4vw,48px)", fontWeight:"600", color:NVY, margin:"0 0 14px" }}>What Students Say</h2>
            <div style={{ width:"48px", height:"2px", background:`linear-gradient(90deg,transparent,${GLD},transparent)`, margin:"0 auto 26px" }} />
            <button className="ld-btn-gold"
              onClick={() => setShowReviewGate(true)}
              style={{ padding:"11px 26px", background:`linear-gradient(135deg,${GLD},${GLDT})`, border:"none",
                borderRadius:"8px", cursor:"pointer", color:NVY, fontSize:"13px", fontWeight:"bold",
                fontFamily:"Georgia,serif", boxShadow:`0 5px 18px rgba(194,160,114,.32)` }}>
              ✦ Leave a Review
            </button>
          </div>
          <div ref={revRef} className="ld-rev-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"22px" }}>
            {displayReviews.slice(0, 6).map((r, i) => (
              <div key={i} className="ld-hover-lift" style={{
                background:C.white, borderRadius:"18px", padding:"30px 26px",
                boxShadow:"0 4px 22px rgba(17,34,80,.07)",
                border:"1px solid rgba(17,34,80,.07)",
                position:"relative", overflow:"hidden",
                animation: revVisible ? `kFadeUp .65s ease ${i * .1}s both` : "none",
              }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:"3px",
                  background:`linear-gradient(90deg,${GLD},${GLDT})`, borderRadius:"18px 18px 0 0" }} />
                <div style={{ display:"flex", gap:"3px", marginBottom:"14px" }}>
                  {[...Array(5)].map((_, j) => (
                    <FiStar key={j} size={13} style={{ fill: j < (r.rating||5) ? GLD : "none", color: j < (r.rating||5) ? GLD : C.shell }} />
                  ))}
                </div>
                <p style={{ fontSize:"13px", color:"rgba(17,34,80,.62)", lineHeight:1.78, margin:"0 0 18px", fontStyle:"italic" }}>"{r.comment}"</p>
                <div style={{ height:"1px", background:"rgba(17,34,80,.07)", marginBottom:"14px" }} />
                <div style={{ display:"flex", alignItems:"center", gap:"11px" }}>
                  <div style={{ width:"38px", height:"38px", borderRadius:"50%", flexShrink:0,
                    background:`linear-gradient(135deg,${GLD},${GLDT})`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"15px", fontWeight:"700", color:NVY,
                    fontFamily:"'Cormorant Garamond',Georgia,serif" }}>
                    {r.student_name ? r.student_name[0] : "S"}
                  </div>
                  <div>
                    <div style={{ fontWeight:"700", color:NVY, fontSize:"13px" }}>{r.student_name}</div>
                    <div style={{ fontSize:"11px", color:MUT, display:"flex", alignItems:"center", gap:"4px", marginTop:"2px" }}>
                      <FiBriefcase size={10}/>{r.company_name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section ref={ctaRef} className="ld-section-pad"
        style={{ padding:"100px 5%", background:`linear-gradient(150deg,${NVY} 0%,${NVY2} 100%)`, position:"relative", overflow:"hidden" }}>
        <ParticleCanvas />
        <div style={{ position:"absolute", inset:0,
          backgroundImage:`linear-gradient(rgba(194,160,114,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(194,160,114,.04) 1px,transparent 1px)`,
          backgroundSize:"60px 60px", pointerEvents:"none" }} />
        <div style={{ maxWidth:"680px", margin:"0 auto", textAlign:"center", position:"relative", zIndex:1,
          animation: ctaVisible ? "kFadeUp .75s ease both" : "none" }}>
          <div style={{ fontSize:"10px", color:GLD, letterSpacing:"3.5px", marginBottom:"16px" }}>✦ JOIN TODAY</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(30px,5vw,56px)", fontWeight:"600",
            color:WHT, margin:"0 0 20px", lineHeight:1.12 }}>
            Ready to Start Your<br />
            <span style={{ color:GLD, fontStyle:"italic", textShadow:`0 0 60px rgba(194,160,114,.4)` }}>Internship Journey?</span>
          </h2>
          <p style={{ fontSize:"16px", color:"rgba(217,203,194,.52)", lineHeight:1.85, maxWidth:"460px", margin:"0 auto 40px" }}>
            Join thousands of Algerian students and companies already using Stag.io to connect and succeed.
          </p>
          <div className="ld-cta-btns" style={{ display:"flex", gap:"14px", justifyContent:"center", flexWrap:"wrap" }}>
            <button className="ld-btn-gold"
              onClick={() => window.location.href = "/register"}
              style={{ padding:"14px 34px", background:`linear-gradient(135deg,${GLD},${GLDT})`,
                border:"none", borderRadius:"9px", cursor:"pointer", color:NVY,
                fontSize:"13px", fontWeight:"700", fontFamily:"Georgia,serif",
                boxShadow:`0 8px 28px rgba(194,160,114,.38)`,
                display:"flex", alignItems:"center", gap:"9px" }}>
              <FiUser size={14}/> Create Free Account
            </button>
            <button className="ld-btn-ghost"
              onClick={() => window.location.href = "/login"}
              style={{ padding:"14px 34px", background:"transparent",
                border:"1.5px solid rgba(245,240,233,.2)", borderRadius:"9px", cursor:"pointer",
                color:"rgba(245,240,233,.72)", fontSize:"13px", fontFamily:"Georgia,serif",
                display:"flex", alignItems:"center", gap:"9px" }}>
              <FiArrowRight size={14}/> Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ══ REVIEW GATE MODAL ══ */}
      {showReviewGate && (
        <div style={{ position:"fixed", inset:0, background:"rgba(11,23,48,.65)", backdropFilter:"blur(8px)",
          zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
          <div style={{ background:WHT, borderRadius:"20px", padding:"44px 38px", width:"100%", maxWidth:"430px",
            boxShadow:"0 36px 90px rgba(11,23,48,.3)", position:"relative", textAlign:"center", fontFamily:"Georgia,serif" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:"3px",
              background:`linear-gradient(90deg,${GLD},${GLDT})`, borderRadius:"20px 20px 0 0" }} />
            <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:"rgba(194,160,114,.1)",
              border:"1.5px solid rgba(194,160,114,.38)", display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 22px", fontSize:"28px" }}>🎓</div>
            <div style={{ fontSize:"10px", color:GLD, letterSpacing:"3.5px", marginBottom:"10px" }}>✦ REVIEWS</div>
            <h2 style={{ fontSize:"21px", color:NVY, fontWeight:"bold", margin:"0 0 14px" }}>Share Your Experience</h2>
            <p style={{ fontSize:"14px", color:"#666", lineHeight:1.75, margin:"0 0 30px" }}>
              Only students who have completed a validated internship can leave a review. Please sign in to share your experience with the community.
            </p>
            <div style={{ display:"flex", gap:"12px" }}>
              <button onClick={() => setShowReviewGate(false)}
                style={{ flex:1, padding:"12px", background:"none", border:"1.5px solid #ddd", borderRadius:"10px",
                  cursor:"pointer", fontSize:"13px", fontFamily:"Georgia,serif", color:"#999" }}>Cancel</button>
              <button onClick={() => window.location.href = "/login"}
                style={{ flex:2, padding:"12px", background:`linear-gradient(135deg,${GLD},${GLDT})`,
                  border:"none", borderRadius:"10px", cursor:"pointer", fontSize:"13px", fontWeight:"bold",
                  color:NVY, fontFamily:"Georgia,serif", boxShadow:`0 4px 16px rgba(194,160,114,.32)` }}>✦ Sign In</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}