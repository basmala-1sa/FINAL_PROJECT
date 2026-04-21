import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Color palette ─────────────────────────────────────────────────────────────
export const C = {
  navy:      "#112250",
  navyMid:   "#1C3160",
  sapphire:  "#3C507D",
  gold:      "#C2A072",
  lightGold: "#E0C58F",
  offWhite:  "#F5F0E9",
  cream:     "#FAF8F5",
  white:     "#FFFFFF",
  shell:     "#D9CBC2",
  muted:     "rgba(17,34,80,0.45)",
};

// ── Shared CSS ────────────────────────────────────────────────────────────────
export const SHARED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp   { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideR   { from { opacity: 0; transform: translateX(32px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes float    { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes pulse    { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes marquee  { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  .gold-text {
    background: linear-gradient(135deg, #C2A072, #E0C58F);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hover-lift { transition: all 0.25s ease !important; }
  .hover-lift:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 28px rgba(194,160,114,0.3) !important; }
  .btn-hover  { transition: all 0.25s ease !important; }
  .btn-hover:hover { transform: translateY(-2px) !important; }
`;

// ── Navbar ────────────────────────────────────────────────────────────────────
export function Navbar({ active }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { key: "home",      label: "Home",      path: "/"          },
    { key: "companies", label: "Companies", path: "/companies" },
    { key: "about",     label: "About",     path: "/about"     },
    { key: "contact",   label: "Contact",   path: "/contact"   },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: "rgba(17,34,80,0.96)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(194,160,114,0.15)",
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        padding: "0 5%", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
        >
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: `linear-gradient(135deg, ${C.gold}, ${C.lightGold})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "bold", fontSize: "14px", color: C.navy,
          }}>S.</div>
          <span style={{ fontSize: "20px", fontWeight: "bold", color: C.gold, letterSpacing: "3px" }}>
            STAG.IO
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {links.map(link => (
            <span
              key={link.key}
              onClick={() => navigate(link.path)}
              onMouseEnter={() => setHovered(link.key)}
              onMouseLeave={() => setHovered(null)}
              style={{
                cursor: "pointer",
                fontSize: "13px",
                letterSpacing: "0.5px",
                color: active === link.key
                  ? C.gold
                  : hovered === link.key
                  ? C.lightGold
                  : "rgba(245,240,233,0.6)",
                borderBottom: active === link.key ? `1px solid ${C.gold}` : "1px solid transparent",
                paddingBottom: "2px",
                transition: "all 0.2s ease",
              }}
            >
              {link.label}
            </span>
          ))}
        </div>

        {/* Auth buttons */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "8px 20px", background: "transparent",
              border: "1.5px solid rgba(194,160,114,0.4)",
              borderRadius: "8px", cursor: "pointer",
              color: C.lightGold, fontSize: "13px",
              fontFamily: "Georgia, serif",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(194,160,114,0.4)"}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "8px 20px",
              background: `linear-gradient(135deg, ${C.gold}, ${C.lightGold})`,
              border: "none", borderRadius: "8px", cursor: "pointer",
              color: C.navy, fontSize: "13px", fontWeight: "bold",
              fontFamily: "Georgia, serif",
              boxShadow: "0 4px 14px rgba(194,160,114,0.35)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
export function Footer() {
  const navigate = useNavigate();

  return (
    <footer style={{
      background: C.navy,
      borderTop: "1px solid rgba(194,160,114,0.15)",
      padding: "48px 5% 28px",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Top row */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "40px", marginBottom: "40px",
        }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: `linear-gradient(135deg, ${C.gold}, ${C.lightGold})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: "bold", fontSize: "14px", color: C.navy,
              }}>S.</div>
              <span style={{ fontSize: "18px", fontWeight: "bold", color: C.gold, letterSpacing: "3px" }}>STAG.IO</span>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(245,240,233,0.4)", lineHeight: 1.7, maxWidth: "240px" }}>
              Algeria's internship management platform. Connecting students, companies, and universities.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <div style={{ fontSize: "9px", color: C.gold, letterSpacing: "2px", marginBottom: "14px" }}>PLATFORM</div>
            {[
              { label: "Home",      path: "/"          },
              { label: "Companies", path: "/companies" },
              { label: "About",     path: "/about"     },
              { label: "Contact",   path: "/contact"   },
            ].map(link => (
              <div
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{ fontSize: "13px", color: "rgba(245,240,233,0.4)", marginBottom: "8px", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = C.lightGold}
                onMouseLeave={e => e.target.style.color = "rgba(245,240,233,0.4)"}
              >
                {link.label}
              </div>
            ))}
          </div>

          {/* For users */}
          <div>
            <div style={{ fontSize: "9px", color: C.gold, letterSpacing: "2px", marginBottom: "14px" }}>FOR USERS</div>
            {["Students", "Companies", "Universities", "Admins"].map(item => (
              <div key={item} style={{ fontSize: "13px", color: "rgba(245,240,233,0.4)", marginBottom: "8px" }}>{item}</div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: "9px", color: C.gold, letterSpacing: "2px", marginBottom: "14px" }}>CONTACT</div>
            <div style={{ fontSize: "13px", color: "rgba(245,240,233,0.4)", marginBottom: "8px" }}>contact@stag.io</div>
            <div style={{ fontSize: "13px", color: "rgba(245,240,233,0.4)", marginBottom: "8px" }}>Constantine, Algeria</div>
            <div style={{ fontSize: "13px", color: "rgba(245,240,233,0.4)" }}>Université Constantine 2</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(194,160,114,0.12)", marginBottom: "20px" }} />

        {/* Bottom row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ fontSize: "12px", color: "rgba(245,240,233,0.25)" }}>
            © 2025 Stag.io — Built at Université Constantine 2
          </div>
          <div style={{ fontSize: "12px", color: "rgba(245,240,233,0.25)" }}>
            ✦ Internship Management Platform for Algeria
          </div>
        </div>
      </div>
    </footer>
  );
}