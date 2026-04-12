import { useState } from "react";

const C = {
  royal: "#112250",
  sapphire: "#3C507D",
  gold: "#E0C58F",
  swan: "#F5F0E9",
  shell: "#D9CBC2",
};

const animations = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideRight {
  from { opacity: 0; transform: translateX(-40px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes float {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-10px); }
}
@keyframes pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(224,197,143,0.4); }
  50%      { box-shadow: 0 0 0 16px rgba(224,197,143,0); }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
`;

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const focus = (k) => setFocused(f => ({ ...f, [k]: true }));
  const blur  = (k) => setFocused(f => ({ ...f, [k]: false }));

  const inputStyle = (name) => ({
    width: "100%", padding: "14px 16px", borderRadius: 10,
    border: `1.5px solid ${focused[name] ? C.sapphire : C.shell}`,
    background: "#fff", color: C.royal, fontSize: 15,
    outline: "none", boxSizing: "border-box", fontFamily: "Georgia, serif",
    transition: "border-color 0.2s",
  });

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) return setError("Please fill in all fields.");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("full_name", data.full_name)  
        if (data.role === "company") window.location.href = "/company/dashboard";
        else if (data.role === "student") window.location.href = "/student/dashboard";
        else if (data.role === "admin") window.location.href = "/admin/dashboard";
      } else {
        setError(data.error || "Invalid credentials.");
      }

      
    } catch {
      setError("Cannot connect to server. Check that Django is running.");
    }
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <>
      <style>{animations}</style>
      <div style={{ minHeight: "100vh", background: C.royal, display: "flex",
        fontFamily: "Georgia, serif", position: "relative", overflow: "hidden" }}>

        {/* BG decorations */}
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%",
          background: C.sapphire, opacity: 0.15, top: -150, left: -150, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%",
          background: C.gold, opacity: 0.07, bottom: 60, left: "30%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 80, height: 80, borderRadius: "50%",
          border: `2px solid rgba(224,197,143,0.2)`, top: 120, right: 520, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 40, height: 40, borderRadius: "50%",
          border: `2px solid rgba(224,197,143,0.15)`, bottom: 180, left: "25%", pointerEvents: "none" }} />

        {/* LEFT PANEL */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
          alignItems: "center", padding: "48px 40px", position: "relative", zIndex: 1,
          animation: "slideRight 0.7s ease both" }}>

          {/* Logo */}
          <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center",
            gap: 10, marginBottom: 52 }}>
            <div style={{ width: 38, height: 38, background: C.gold, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: "bold", fontSize: 18, color: C.royal,
              animation: "pulse 2s infinite" }}>S.</div>
            <span style={{ color: C.swan, fontSize: 22, fontWeight: "bold", letterSpacing: 1 }}>Stag.io</span>
          </div>

          {/* Illustration card */}
          <div style={{ width: "100%", maxWidth: 360, background: C.sapphire, borderRadius: 24,
            padding: "48px 32px", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 24, position: "relative", overflow: "hidden" }}>

            <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%",
              background: "rgba(255,255,255,0.05)", top: -70, right: -70 }} />
            <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%",
              background: "rgba(255,255,255,0.03)", bottom: -30, left: -30 }} />

            <div style={{ fontSize: 80, animation: "float 3s ease-in-out infinite",
              filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))" }}>💼</div>

            <div style={{ color: C.swan, fontSize: 21, fontWeight: "bold",
              textAlign: "center", lineHeight: 1.4 }}>
              Welcome back to Stag.io
            </div>

            <div style={{ color: C.shell, fontSize: 13, textAlign: "center",
              lineHeight: 1.7, maxWidth: 250 }}>
              Sign in to continue your internship journey and explore new opportunities.
            </div>

            {/* Feature pills */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginTop: 4 }}>
              {[
                ["🔍", "Search internship offers by wilaya & skills"],
                ["📄", "Apply and track your applications"],
                ["🏆", "Get your convention de stage automatically"],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 12,
                  background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 14px" }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span style={{ color: C.shell, fontSize: 12, lineHeight: 1.4 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width: 480, display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "48px 52px", background: C.swan, position: "relative", zIndex: 1,
          animation: "fadeUp 0.7s ease both" }}>

          <div style={{ color: C.royal, fontSize: 28, fontWeight: "bold", marginBottom: 6 }}>
            Sign in to your account
          </div>
          <div style={{ color: C.sapphire, fontSize: 14, marginBottom: 36 }}>
            Enter your credentials to access Stag.io
          </div>

          {error && (
            <div style={{ background: "#fee2e2", color: "#991b1b", borderRadius: 8,
              padding: "11px 14px", fontSize: 13, marginBottom: 20,
              animation: "fadeUp 0.3s ease both" }}>{error}</div>
          )}

          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", color: C.sapphire, fontSize: 11, fontWeight: "bold",
              textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Email address</label>
            <input style={inputStyle("email")} type="email" placeholder="ahmed@univ.dz"
              value={form.email} onChange={e => set("email", e.target.value)}
              onFocus={() => focus("email")} onBlur={() => blur("email")} onKeyDown={handleKey} />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", color: C.sapphire, fontSize: 11, fontWeight: "bold",
              textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Password</label>
            <input style={inputStyle("password")} type="password" placeholder="••••••••"
              value={form.password} onChange={e => set("password", e.target.value)}
              onFocus={() => focus("password")} onBlur={() => blur("password")} onKeyDown={handleKey} />
          </div>

          {/* Role hint */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {["student","company","admin"].map(r => (
              <div key={r} style={{ flex: 1, padding: "8px 0", borderRadius: 8, textAlign: "center",
                background: "rgba(17,34,80,0.06)", color: C.sapphire, fontSize: 12,
                textTransform: "capitalize" }}>
                {r === "student" ? "🎓" : r === "company" ? "🏢" : "⚙️"} {r}
              </div>
            ))}
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading} style={{
            width: "100%", padding: "15px 0", borderRadius: 12, border: "none",
            background: C.royal, color: C.gold, fontSize: 16, fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.75 : 1,
            fontFamily: "Georgia, serif", transition: "opacity 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            {loading && <span style={{ width: 16, height: 16, border: `2px solid ${C.gold}`,
              borderTopColor: "transparent", borderRadius: "50%",
              animation: "spin 0.8s linear infinite", display: "inline-block" }} />}
            {loading ? "Signing in..." : "Sign in →"}
          </button>

          <div style={{ textAlign: "center", color: C.sapphire, fontSize: 13, marginTop: 24 }}>
            Don't have an account?{" "}
            <span onClick={() => window.location.href = "/register"}
              style={{ color: C.royal, fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}>
              Create one
            </span>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: C.shell }} />
            <span style={{ color: C.shell, fontSize: 12 }}>Stag.io v1.0</span>
            <div style={{ flex: 1, height: 1, background: C.shell }} />
          </div>

          <div style={{ color: C.shell, fontSize: 11, textAlign: "center", lineHeight: 1.6 }}>
            Internship management platform for Algerian universities & companies.
          </div>
        </div>
      </div>
    </>
  );
}