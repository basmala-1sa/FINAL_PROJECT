import { useState, useEffect } from "react";
import { colors, GLOBAL_STYLES, Sidebar, PageShell } from "./studentLayout";

const WILAYAS = [
  "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar",
  "Blida","Bouira","Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger",
  "Djelfa","Jijel","Sétif","Saïda","Skikda","Sidi Bel Abbès","Annaba","Guelma",
  "Constantine","Médéa","Mostaganem","M'Sila","Mascara","Ouargla","Oran","El Bayadh",
  "Illizi","Bordj Bou Arréridj","Boumerdès","El Tarf","Tindouf","Tissemsilt",
  "El Oued","Khenchela","Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma",
  "Aïn Témouchent","Ghardaïa","Relizane",
];

const SKILL_SUGGESTIONS = [
  "React","Vue.js","Angular","JavaScript","TypeScript","HTML","CSS",
  "Python","Django","FastAPI","Node.js","Express","PHP","Laravel",
  "Java","Spring Boot","MySQL","PostgreSQL","MongoDB","Redis",
  "Docker","Git","Linux","REST API","GraphQL","Flutter","React Native",
];

export default function StudentProfile() {
  const [active, setSidebar] = useState("profile");
  const [sidebarOpen, setOpen] = useState(false);

  const [form, setForm]         = useState({ skills:"", github_link:"", wilaya:"", university:"" });
  const [skillInput, setSkillIn] = useState("");
  const [skillTags, setTags]    = useState([]);
  const [suggestions, setSugg]  = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [message, setMessage]   = useState(null); // {type, text}
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");

  // ── Load profile on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    setFullName(localStorage.getItem("full_name") || "");
    setEmail(localStorage.getItem("email") || "");

    fetch("http://localhost:8000/api/profile/", {
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
    })
      .then(r => r.json())
      .then(data => {
        if (data.skills !== undefined) {
          const tags = data.skills ? data.skills.split(",").map(s=>s.trim()).filter(Boolean) : [];
          setTags(tags);
          setForm({
            skills:      data.skills      || "",
            github_link: data.github_link || "",
            wilaya:      data.wilaya      || "",
            university:  data.university  || "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ── Skill tag management ──────────────────────────────────────────────────
  const handleSkillInput = (val) => {
    setSkillIn(val);
    if (val.trim().length > 0) {
      setSugg(SKILL_SUGGESTIONS.filter(s => s.toLowerCase().includes(val.toLowerCase()) && !skillTags.includes(s)));
    } else {
      setSugg([]);
    }
  };

  const addTag = (tag) => {
    const t = tag.trim();
    if (t && !skillTags.includes(t)) {
      const updated = [...skillTags, t];
      setTags(updated);
      setForm(f => ({ ...f, skills: updated.join(", ") }));
    }
    setSkillIn("");
    setSugg([]);
  };

  const removeTag = (tag) => {
    const updated = skillTags.filter(t => t !== tag);
    setTags(updated);
    setForm(f => ({ ...f, skills: updated.join(", ") }));
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
      e.preventDefault();
      addTag(skillInput);
    }
  };

  // ── Save profile ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8000/api/profile/", {
        method: "PUT",
        headers: { "Authorization":`Bearer ${token}`, "Content-Type":"application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type:"success", text:"Profile updated successfully ✅" });
      } else {
        setMessage({ type:"error", text: JSON.stringify(data) });
      }
    } catch {
      setMessage({ type:"error", text:"Network error — is Django running?" });
    }
    setSaving(false);
  };

  const handleNav = (key) => {
    setSidebar(key);
    setOpen(false);
    const paths = { dashboard:"/student/dashboard", profile:"/student/profile", offers:"/student/offers", applications:"/student/applications" };
    if (paths[key]) window.location.href = paths[key];
  };

  if (loading) return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:colors.offWhite,fontFamily:"Georgia,serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:"40px",height:"40px",border:`3px solid rgba(194,160,114,0.3)`,borderTopColor:colors.gold,borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 16px" }}/>
        <div style={{ color:colors.gold,letterSpacing:"2px",fontSize:"12px" }}>LOADING PROFILE…</div>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex",minHeight:"100vh",fontFamily:"Georgia,serif",background:colors.offWhite }}>
      <style>{GLOBAL_STYLES}</style>
      {sidebarOpen && <div onClick={()=>setOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(17,34,80,0.5)",zIndex:99 }}/>}
      <Sidebar active={active} onNavigate={handleNav}/>

      <PageShell title="My Profile / CV" subtitle="✦ EDIT YOUR PROFILE" onMenuClick={()=>setOpen(true)}>

        <div style={{ maxWidth:"760px", animation:"fadeUp 0.5s ease both" }}>

          {/* Success / Error message */}
          {message && (
            <div style={{
              padding:"14px 20px", borderRadius:"12px", marginBottom:"24px",
              background: message.type==="success" ? "#dcfce7" : "#fee2e2",
              border:`1px solid ${message.type==="success" ? "#16a34a" : "#dc2626"}`,
              color: message.type==="success" ? "#16a34a" : "#dc2626",
              fontSize:"14px", fontWeight:"bold", letterSpacing:".3px",
              animation:"fadeUp .3s ease both",
            }}>{message.text}</div>
          )}

          {/* Identity card (read-only from User table) */}
          <div style={{
            background:colors.white, borderRadius:"16px", padding:"28px 32px",
            marginBottom:"24px", boxShadow:"0 4px 20px rgba(17,34,80,0.07)",
            position:"relative", overflow:"hidden",
          }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,${colors.gold},${colors.lightGold})`,borderRadius:"16px 16px 0 0" }}/>
            <div style={{ fontSize:"10px",color:colors.gold,letterSpacing:"2px",marginBottom:"16px" }}>IDENTITY</div>

            <div style={{ display:"flex",alignItems:"center",gap:"20px",flexWrap:"wrap" }}>
              <div style={{
                width:"68px",height:"68px",borderRadius:"50%",flexShrink:0,
                background:`linear-gradient(135deg,${colors.gold},${colors.lightGold})`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:"26px",fontWeight:"bold",color:colors.navyDark,
              }}>{(fullName||"S")[0].toUpperCase()}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"20px",fontWeight:"bold",color:colors.navyDark,marginBottom:"4px" }}>{fullName || "—"}</div>
                <div style={{ fontSize:"13px",color:colors.sapphire }}>{email || "—"}</div>
                <div style={{ fontSize:"11px",color:colors.gold,marginTop:"4px",letterSpacing:"1px" }}>✦ FROM USER TABLE — READ ONLY</div>
              </div>
            </div>
          </div>

          {/* Editable fields */}
          <div style={{ background:colors.white, borderRadius:"16px", padding:"28px 32px", boxShadow:"0 4px 20px rgba(17,34,80,0.07)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,${colors.gold},${colors.lightGold})`,borderRadius:"16px 16px 0 0" }}/>
            <div style={{ position:"absolute",left:0,top:"15%",bottom:"15%",width:"3px",background:`linear-gradient(180deg,transparent,${colors.gold},transparent)`,borderRadius:"3px" }}/>
            <div style={{ fontSize:"10px",color:colors.gold,letterSpacing:"2px",marginBottom:"24px" }}>PROFILE DETAILS</div>

            {/* Skills */}
            <div style={{ marginBottom:"24px" }}>
              <label style={{ fontSize:"11px",fontWeight:"bold",color:colors.navyDark,letterSpacing:"1px",textTransform:"uppercase",display:"block",marginBottom:"8px" }}>
                Technical Skills
              </label>
              {/* Tags display */}
              <div style={{
                minHeight:"48px", padding:"8px 12px",
                border:`1.5px solid rgba(194,160,114,0.4)`, borderRadius:"10px",
                background:colors.offWhite, display:"flex", flexWrap:"wrap", gap:"6px",
                alignItems:"center", marginBottom:"8px",
              }}>
                {skillTags.map(tag => (
                  <span key={tag} style={{
                    display:"inline-flex", alignItems:"center", gap:"6px",
                    padding:"4px 12px", borderRadius:"20px",
                    background:`linear-gradient(135deg,${colors.gold},${colors.lightGold})`,
                    color:colors.navyDark, fontSize:"12px", fontWeight:"bold",
                  }}>
                    {tag}
                    <span onClick={()=>removeTag(tag)} style={{ cursor:"pointer",opacity:.7,fontSize:"14px",lineHeight:1 }}>×</span>
                  </span>
                ))}
                {skillTags.length === 0 && (
                  <span style={{ color:"#bbb",fontSize:"13px",fontStyle:"italic" }}>No skills added yet…</span>
                )}
              </div>
              {/* Input */}
              <div style={{ position:"relative" }}>
                <input className="inp-field" value={skillInput}
                  onChange={e=>handleSkillInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a skill and press Enter (e.g. React, Python…)"
                  style={{
                    width:"100%",padding:"11px 14px",borderRadius:"10px",
                    border:`1.5px solid rgba(194,160,114,0.3)`,background:colors.white,
                    fontSize:"13px",color:colors.navyDark,fontFamily:"Georgia,serif",
                  }}
                />
                {/* Suggestions dropdown */}
                {suggestions.length > 0 && (
                  <div style={{
                    position:"absolute",top:"100%",left:0,right:0,zIndex:10,
                    background:colors.white,border:`1.5px solid rgba(194,160,114,0.3)`,
                    borderRadius:"0 0 10px 10px",boxShadow:"0 8px 24px rgba(17,34,80,0.12)",
                    maxHeight:"180px",overflowY:"auto",
                  }}>
                    {suggestions.map(s=>(
                      <div key={s} onClick={()=>addTag(s)} style={{
                        padding:"10px 14px",cursor:"pointer",fontSize:"13px",color:colors.navyDark,
                        borderBottom:`1px solid ${colors.offWhite}`,
                        transition:"background .15s",
                      }}
                        onMouseEnter={e=>e.target.style.background=colors.offWhite}
                        onMouseLeave={e=>e.target.style.background="transparent"}
                      >{s}</div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ fontSize:"11px",color:"#bbb",marginTop:"6px",letterSpacing:".3px" }}>
                Press Enter or comma to add · Click × to remove
              </div>
            </div>

            {/* GitHub */}
            <div style={{ marginBottom:"24px" }}>
              <label style={{ fontSize:"11px",fontWeight:"bold",color:colors.navyDark,letterSpacing:"1px",textTransform:"uppercase",display:"block",marginBottom:"8px" }}>
                GitHub / Portfolio Link
              </label>
              <input className="inp-field" type="url"
                value={form.github_link}
                onChange={e=>setForm(f=>({...f,github_link:e.target.value}))}
                placeholder="https://github.com/yourusername"
                style={{
                  width:"100%",padding:"11px 14px",borderRadius:"10px",
                  border:`1.5px solid rgba(194,160,114,0.3)`,background:colors.offWhite,
                  fontSize:"13px",color:colors.navyDark,fontFamily:"Georgia,serif",
                }}
              />
            </div>

            {/* Wilaya + University — 2 columns */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",marginBottom:"32px" }}>
              <div>
                <label style={{ fontSize:"11px",fontWeight:"bold",color:colors.navyDark,letterSpacing:"1px",textTransform:"uppercase",display:"block",marginBottom:"8px" }}>Wilaya</label>
                <select className="inp-field" value={form.wilaya}
                  onChange={e=>setForm(f=>({...f,wilaya:e.target.value}))}
                  style={{
                    width:"100%",padding:"11px 14px",borderRadius:"10px",
                    border:`1.5px solid rgba(194,160,114,0.3)`,background:colors.offWhite,
                    fontSize:"13px",color:form.wilaya?colors.navyDark:"#bbb",fontFamily:"Georgia,serif",cursor:"pointer",
                  }}>
                  <option value="">Select wilaya…</option>
                  {WILAYAS.map(w=><option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:"11px",fontWeight:"bold",color:colors.navyDark,letterSpacing:"1px",textTransform:"uppercase",display:"block",marginBottom:"8px" }}>University</label>
                <input className="inp-field" type="text"
                  value={form.university}
                  onChange={e=>setForm(f=>({...f,university:e.target.value}))}
                  placeholder="USTHB, ESI, USTO…"
                  style={{
                    width:"100%",padding:"11px 14px",borderRadius:"10px",
                    border:`1.5px solid rgba(194,160,114,0.3)`,background:colors.offWhite,
                    fontSize:"13px",color:colors.navyDark,fontFamily:"Georgia,serif",
                  }}
                />
              </div>
            </div>

            {/* Save button */}
            <button className="btn-gold" onClick={handleSave} disabled={saving} style={{
              padding:"13px 40px",borderRadius:"10px",border:"none",cursor:saving?"not-allowed":"pointer",
              background:saving?`rgba(194,160,114,0.5)`:`linear-gradient(135deg,${colors.gold},${colors.lightGold})`,
              color:colors.navyDark,fontSize:"13px",fontWeight:"bold",letterSpacing:"2px",
              boxShadow:`0 4px 16px rgba(194,160,114,0.35)`,fontFamily:"Georgia,serif",
            }}>
              {saving ? "SAVING…" : "✦ SAVE PROFILE"}
            </button>
          </div>
        </div>
      </PageShell>
    </div>
  );
}