import { useState, useEffect } from "react";

const C = {
  royal: "#112250",
  sapphire: "#3C507D",
  gold: "#E0C58F",
  swan: "#F5F0E9",
  shell: "#D9CBC2",
};

const fadeIn = `
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

@media (max-width: 768px) {
  .reg-left  { display: none !important; }
  .reg-right {
    width: 100% !important;
    padding: 36px 24px 48px !important;
    min-height: 100vh !important;
  }
  .reg-root  { flex-direction: column !important; }
}
`;

const WILAYAS = [
  "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar",
  "Blida","Bouira","Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger",
  "Djelfa","Jijel","Sétif","Saïda","Skikda","Sidi Bel Abbès","Annaba","Guelma",
  "Constantine","Médéa","Mostaganem","M'Sila","Mascara","Ouargla","Oran","El Bayadh",
  "Illizi","Bordj Bou Arréridj","Boumerdès","El Tarf","Tindouf","Tissemsilt",
  "El Oued","Khenchela","Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma",
  "Aïn Témouchent","Ghardaïa","Relizane",
];

const Field = ({ label, name, type = "text", placeholder, children, form, set, focused, focus, blur }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display:"block", color:C.sapphire, fontSize:11, fontWeight:"bold", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>
      {label}
    </label>
    {children || (
      <input
        style={{
          width:"100%", padding:"13px 16px", borderRadius:10,
          border:`1.5px solid ${focused[name] ? C.sapphire : C.shell}`,
          background:"#fff", color:C.royal, fontSize:14,
          outline:"none", boxSizing:"border-box", fontFamily:"Georgia, serif",
          transition:"border-color 0.2s",
        }}
        type={type} placeholder={placeholder} value={form[name]}
        onChange={e => set(name, e.target.value)}
        onFocus={() => focus(name)} onBlur={() => blur(name)}
      />
    )}
  </div>
);

export default function Register() {
  const [step, setStep]   = useState(1);
  const [form, setForm]   = useState({
    full_name:"", email:"", password:"", confirm_password:"",
    role:"student", date_of_birth:"", phone:"", wilaya:"",
    university:"", github_link:"", skills:"",
    company_name:"", website:"", description:"",
  });
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");
  const [focused, setFocused]         = useState({});
  const [universities, setUniversities] = useState([]);

  const set   = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const focus = (k)    => setFocused(f => ({ ...f, [k]: true }));
  const blur  = (k)    => setFocused(f => ({ ...f, [k]: false }));
  const fieldProps = { form, set, focused, focus, blur };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/universities/")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setUniversities(data); })
      .catch(() => {});
  }, []);

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!form.full_name || !form.email || !form.password) return setError("Please fill all required fields.");
      if (form.password !== form.confirm_password) return setError("Passwords do not match.");
      if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    }
    if (step === 2) {
      if (!form.wilaya) return setError("Please select your wilaya.");
      if (form.role === "student" && !form.university) return setError("Please select your university.");
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const body = {
        full_name:     form.full_name,
        email:         form.email,
        password:      form.password,
        role:          form.role,
        university_id: form.role === "student" ? form.university : null,
      };
      const res  = await fetch("http://127.0.0.1:8000/api/register/", {
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token",     data.token);
        localStorage.setItem("role",      data.role);
        localStorage.setItem("user_id",   data.user_id);
        localStorage.setItem("full_name", data.full_name);
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => {
          window.location.href = data.role === "student" ? "/student/dashboard" : "/company/dashboard";
        }, 1800);
      } else {
        setError(data.email?.[0] || data.full_name?.[0] || "Registration failed.");
      }
    } catch { setError("Cannot connect to server."); }
    setLoading(false);
  };

  const selectStyle = (name) => ({
    width:"100%", padding:"13px 16px", borderRadius:10, cursor:"pointer",
    border:`1.5px solid ${focused[name] ? C.sapphire : C.shell}`,
    background:"#fff", color:C.royal, fontSize:14,
    outline:"none", boxSizing:"border-box", fontFamily:"Georgia, serif",
  });

  const steps = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      step:"Step 1", title:"Create Account", desc:"Register with your email and choose your role.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      step:"Step 2", title:"Personal Details", desc:"Add your wilaya, university, and contact info.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
      ),
      step:"Step 3", title:"Complete Profile", desc:"Add your skills and start applying to internships.",
    },
  ];

  return (
    <>
      <style>{fadeIn}</style>
      <div className="reg-root" style={{
        minHeight:"100vh", background:C.royal, display:"flex",
        fontFamily:"Georgia, serif", position:"relative", overflow:"hidden",
      }}>
        {/* BG decorations */}
        <div style={{ position:"absolute",width:500,height:500,borderRadius:"50%",background:C.sapphire,opacity:0.15,top:-150,left:-150,pointerEvents:"none" }}/>
        <div style={{ position:"absolute",width:200,height:200,borderRadius:"50%",background:C.gold,opacity:0.07,bottom:60,left:"30%",pointerEvents:"none" }}/>

        {/* ══ LEFT PANEL ══ */}
        <div className="reg-left" style={{
          flex:1, display:"flex", flexDirection:"column", justifyContent:"center",
          alignItems:"center", padding:"48px 40px", position:"relative", zIndex:1,
          animation:"slideRight 0.7s ease both",
        }}>
          <div style={{ alignSelf:"flex-start", display:"flex", alignItems:"center", gap:10, marginBottom:52 }}>
            <div style={{ width:38,height:38,background:C.gold,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold",fontSize:18,color:C.royal,animation:"pulse 2s infinite" }}>S.</div>
            <span style={{ color:C.swan,fontSize:22,fontWeight:"bold",letterSpacing:1 }}>Stag.io</span>
          </div>

          <div style={{
            width:"100%", maxWidth:370, background:C.sapphire, borderRadius:24,
            padding:"44px 36px", display:"flex", flexDirection:"column",
            position:"relative", overflow:"hidden",
          }}>
            <div style={{ position:"absolute",width:220,height:220,borderRadius:"50%",background:"rgba(255,255,255,0.04)",top:-70,right:-70 }}/>
            <div style={{ position:"absolute",width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.03)",bottom:-20,left:-20 }}/>

            <div style={{
              width:72,height:72,borderRadius:20,
              background:"linear-gradient(135deg,rgba(224,197,143,0.2),rgba(224,197,143,0.05))",
              border:`1.5px solid rgba(224,197,143,0.3)`,
              display:"flex",alignItems:"center",justifyContent:"center",
              marginBottom:24,animation:"float 3s ease-in-out infinite",alignSelf:"flex-start",
            }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>

            <div style={{ color:C.swan,fontSize:20,fontWeight:"bold",lineHeight:1.3,marginBottom:8 }}>Start your internship journey</div>
            <div style={{ color:C.shell,fontSize:13,lineHeight:1.7,marginBottom:28,opacity:0.85 }}>
              Join thousands of Algerian students connecting with top companies.
            </div>

            <div style={{ height:1,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,marginBottom:28 }}/>

            <div style={{ display:"flex",flexDirection:"column",gap:20,marginBottom:28 }}>
              {steps.map((item, i) => (
                <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:16 }}>
                  <div style={{
                    width:44,height:44,borderRadius:12,flexShrink:0,
                    background:step>i?"rgba(224,197,143,0.2)":"rgba(255,255,255,0.06)",
                    border:`1px solid ${step>i?"rgba(224,197,143,0.4)":"rgba(224,197,143,0.15)"}`,
                    display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s ease",
                  }}>
                    {step > i + 1 ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : item.icon}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3 }}>
                      <div style={{ fontSize:10,color:step===i+1?C.gold:"rgba(224,197,143,0.4)",letterSpacing:1,fontWeight:"bold",textTransform:"uppercase",transition:"color 0.3s" }}>
                        {item.step}
                      </div>
                      {step===i+1&&<div style={{ width:6,height:6,borderRadius:"50%",background:C.gold,animation:"pulse 2s ease infinite" }}/>}
                    </div>
                    <div style={{ color:step>i?C.swan:"rgba(245,240,233,0.5)",fontSize:13,fontWeight:"bold",marginBottom:3,transition:"color 0.3s" }}>{item.title}</div>
                    <div style={{ color:C.shell,fontSize:12,lineHeight:1.5,opacity:0.75 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ height:1,background:`linear-gradient(90deg,transparent,rgba(224,197,143,0.2),transparent)`,marginBottom:20 }}/>

            <div style={{ display:"flex",justifyContent:"space-between" }}>
              {[["200+","Companies"],["1k+","Students"],["48","Wilayas"]].map(([n,l]) => (
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ color:C.gold,fontSize:18,fontWeight:"bold" }}>{n}</div>
                  <div style={{ color:C.shell,fontSize:10,textTransform:"uppercase",letterSpacing:1,opacity:0.7 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="reg-right" style={{
          width:500, display:"flex", flexDirection:"column", justifyContent:"center",
          padding:"48px 52px", background:C.swan, position:"relative", zIndex:1,
          animation:"fadeUp 0.7s ease both", overflowY:"auto", maxHeight:"100vh",
        }}>

          {/* Mobile logo */}
          <div style={{ display:"none" }} className="reg-mobile-logo">
            <style>{`
              @media (max-width: 768px) {
                .reg-mobile-logo {
                  display: flex !important;
                  align-items: center;
                  gap: 10px;
                  margin-bottom: 28px;
                }
              }
            `}</style>
            <div style={{ width:36,height:36,background:C.gold,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold",fontSize:16,color:C.royal }}>S.</div>
            <span style={{ color:C.royal,fontSize:20,fontWeight:"bold",letterSpacing:1 }}>Stag.io</span>
          </div>

          {/* Mobile step indicator */}
          <div className="reg-mobile-steps" style={{ display:"none" }}>
            <style>{`
              @media (max-width: 768px) {
                .reg-mobile-steps { display: block !important; margin-bottom: 24px; }
              }
            `}</style>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
              {["Account","Personal","Profile"].map((s,i)=>(
                <div key={s} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
                  <div style={{
                    width:28,height:28,borderRadius:"50%",
                    background:step>i?C.gold:"rgba(17,34,80,0.1)",
                    color:step>i?C.royal:C.sapphire,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:12,fontWeight:"bold",transition:"all 0.3s",
                  }}>
                    {step>i+1?"✓":i+1}
                  </div>
                  <span style={{ fontSize:10,color:step===i+1?C.sapphire:"#bbb",transition:"color 0.3s" }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ height:3,background:"rgba(17,34,80,0.08)",borderRadius:4,overflow:"hidden" }}>
              <div style={{ height:"100%",width:step===1?"33%":step===2?"66%":"100%",background:C.gold,borderRadius:4,transition:"width 0.5s ease" }}/>
            </div>
          </div>

          <div style={{ color:C.royal,fontSize:26,fontWeight:"bold",marginBottom:4 }}>
            {step===1?"Create your account":step===2?"Personal details":"Complete your profile"}
          </div>
          <div style={{ color:C.sapphire,fontSize:13,marginBottom:28 }}>
            Step {step} of 3 — {step===1?"Account info":step===2?"About you":form.role==="student"?"Student profile":"Company profile"}
          </div>

          {error   && <div style={{ background:"#fee2e2",color:"#991b1b",borderRadius:8,padding:"10px 14px",fontSize:13,marginBottom:16 }}>{error}</div>}
          {success && <div style={{ background:"#dcfce7",color:"#166534",borderRadius:8,padding:"10px 14px",fontSize:13,marginBottom:16 }}>{success}</div>}

          {/* STEP 1 */}
          {step===1&&(
            <div style={{ animation:"fadeUp 0.4s ease both" }}>
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block",color:C.sapphire,fontSize:11,fontWeight:"bold",textTransform:"uppercase",letterSpacing:1,marginBottom:8 }}>I am a</label>
                <div style={{ display:"flex",gap:12 }}>
                  {["student","company"].map(r=>(
                    <button key={r} onClick={()=>set("role",r)} style={{
                      flex:1,padding:"12px 0",borderRadius:10,cursor:"pointer",
                      border:`1.5px solid ${form.role===r?C.sapphire:C.shell}`,
                      background:form.role===r?C.royal:"#fff",
                      color:form.role===r?C.gold:C.sapphire,
                      fontWeight:"bold",fontSize:14,fontFamily:"Georgia, serif",
                      transition:"all 0.25s",textTransform:"capitalize",
                    }}>{r==="student"?"🎓 Student":"🏢 Company"}</button>
                  ))}
                </div>
              </div>
              <Field label="Full name *"       name="full_name"        placeholder="Ahmed Benali"  {...fieldProps}/>
              <Field label="Email address *"    name="email"            type="email" placeholder="ahmed@univ.dz" {...fieldProps}/>
              <Field label="Password *"         name="password"         type="password" placeholder="••••••••" {...fieldProps}/>
              <Field label="Confirm password *" name="confirm_password" type="password" placeholder="••••••••" {...fieldProps}/>
            </div>
          )}

          {/* STEP 2 */}
          {step===2&&(
            <div style={{ animation:"fadeUp 0.4s ease both" }}>
              <Field label="Phone number"  name="phone"         type="tel"  placeholder="+213 555 00 00 00" {...fieldProps}/>
              <Field label="Date of birth" name="date_of_birth" type="date" placeholder=""                  {...fieldProps}/>

              <Field label="Wilaya *" name="wilaya" {...fieldProps}>
                <select value={form.wilaya} onChange={e=>set("wilaya",e.target.value)}
                  style={selectStyle("wilaya")} onFocus={()=>focus("wilaya")} onBlur={()=>blur("wilaya")}>
                  <option value="">Select your wilaya</option>
                  {WILAYAS.map(w=><option key={w} value={w}>{w}</option>)}
                </select>
              </Field>

              {form.role==="company"&&(
                <Field label="Company name" name="company_name" placeholder="Tech Corp SARL" {...fieldProps}/>
              )}

              {form.role==="student"&&(
                <div style={{ marginBottom:16 }}>
                  <label style={{ display:"block",color:C.sapphire,fontSize:11,fontWeight:"bold",textTransform:"uppercase",letterSpacing:1,marginBottom:6 }}>University *</label>
                  <select value={form.university} onChange={e=>set("university",e.target.value)}
                    style={selectStyle("university")} onFocus={()=>focus("university")} onBlur={()=>blur("university")}>
                    <option value="">Select your university</option>
                    {universities.map(u=>(
                      <option key={u.id} value={u.id}>{u.name} — {u.wilaya}</option>
                    ))}
                  </select>
                  {universities.length===0&&(
                    <div style={{ fontSize:12,color:"#e74c3c",marginTop:6,lineHeight:1.5 }}>
                      ⚠️ No universities available yet. Contact us at stagioplatform@gmail.com to join.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {step===3&&(
            <div style={{ animation:"fadeUp 0.4s ease both" }}>
              {form.role==="student"?(
                <>
                  <Field label="GitHub / Portfolio link" name="github_link" placeholder="https://github.com/username" {...fieldProps}/>
                  <Field label="Skills (comma separated)" name="skills" {...fieldProps}>
                    <textarea value={form.skills} onChange={e=>set("skills",e.target.value)}
                      placeholder="React, Python, Django, SQL..."
                      style={{ width:"100%",padding:"13px 16px",borderRadius:10,height:90,resize:"none",
                        border:`1.5px solid ${focused["skills"]?C.sapphire:C.shell}`,
                        background:"#fff",color:C.royal,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"Georgia, serif" }}
                      onFocus={()=>focus("skills")} onBlur={()=>blur("skills")}/>
                  </Field>
                  {form.skills&&(
                    <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:16,marginTop:-8 }}>
                      {form.skills.split(",").map(s=>s.trim()).filter(Boolean).map(s=>(
                        <span key={s} style={{ background:C.royal,color:C.gold,borderRadius:20,padding:"3px 12px",fontSize:12 }}>{s}</span>
                      ))}
                    </div>
                  )}
                </>
              ):(
                <>
                  <Field label="Website" name="website" placeholder="https://company.dz" {...fieldProps}/>
                  <Field label="Description" name="description" {...fieldProps}>
                    <textarea value={form.description} onChange={e=>set("description",e.target.value)}
                      placeholder="Brief description of your company..."
                      style={{ width:"100%",padding:"13px 16px",borderRadius:10,height:100,resize:"none",
                        border:`1.5px solid ${focused["description"]?C.sapphire:C.shell}`,
                        background:"#fff",color:C.royal,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"Georgia, serif" }}
                      onFocus={()=>focus("description")} onBlur={()=>blur("description")}/>
                  </Field>
                </>
              )}
            </div>
          )}

          <div style={{ display:"flex",gap:12,marginTop:8 }}>
            {step>1&&(
              <button onClick={()=>{setError("");setStep(s=>s-1);}} style={{
                flex:1,padding:"14px 0",borderRadius:12,cursor:"pointer",
                border:`1.5px solid ${C.shell}`,background:"transparent",
                color:C.sapphire,fontSize:15,fontWeight:"bold",fontFamily:"Georgia, serif",
              }}>← Back</button>
            )}
            {step<3?(
              <button onClick={nextStep} style={{
                flex:2,padding:"14px 0",borderRadius:12,border:"none",
                background:C.royal,color:C.gold,fontSize:15,fontWeight:"bold",
                cursor:"pointer",fontFamily:"Georgia, serif",
              }}>Continue →</button>
            ):(
              <button onClick={handleSubmit} disabled={loading} style={{
                flex:2,padding:"14px 0",borderRadius:12,border:"none",
                background:C.royal,color:C.gold,fontSize:15,fontWeight:"bold",
                cursor:loading?"not-allowed":"pointer",opacity:loading?0.7:1,
                fontFamily:"Georgia, serif",display:"flex",alignItems:"center",justifyContent:"center",gap:10,
              }}>
                {loading&&<span style={{ width:16,height:16,border:`2px solid ${C.gold}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite",display:"inline-block" }}/>}
                {loading?"Creating account...":"Create account →"}
              </button>
            )}
          </div>

          <div style={{ textAlign:"center",color:C.sapphire,fontSize:13,marginTop:20 }}>
            Already have an account?{" "}
            <span onClick={()=>window.location.href="/login"}
              style={{ color:C.royal,fontWeight:"bold",cursor:"pointer",textDecoration:"underline" }}>
              Sign in
            </span>
          </div>
        </div>
      </div>
    </>
  );
}