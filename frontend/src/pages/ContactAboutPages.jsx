import { useState, useEffect, useRef } from "react";
import { Navbar, Footer, C, SHARED_STYLES } from "./SharedLayout";
import {
  FiMail, FiLinkedin, FiGithub, FiMapPin, FiPhone,
  FiSend, FiUser, FiMessageSquare, FiCheckCircle,
  FiTarget, FiZap, FiHeart, FiTrendingUp,
  FiBriefcase, FiShield, FiGlobe, FiUsers, FiAward,
  FiBook,
} from "react-icons/fi";

function useReveal() {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}

// ── CONTACT PAGE ──────────────────────────────────────────────────────────
export function ContactPage() {
  const [form, setForm]       = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent]       = useState(false);
  const [heroRef, heroVisible] = useReveal();
  const [cardsRef, cardsVisible] = useReveal();

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name:"", email:"", subject:"", message:"" });
  };

  const contacts = [
    { icon:<FiMail size={26}/>,    label:"Email Us",       value:"contact@stag.io",          sub:"We reply within 24 hours",      href:"mailto:contact@stag.io",    color:C.gold     },
    { icon:<FiLinkedin size={26}/>, label:"LinkedIn",      value:"Stag.io Algeria",           sub:"Follow for updates & news",     href:"#",                          color:C.sapphire },
    { icon:<FiGithub size={26}/>,  label:"GitHub",         value:"github.com/basmala-1sa",   sub:"Open source — star us!",        href:"https://github.com/basmala-1sa", color:C.navy },
    { icon:<FiMapPin size={26}/>,  label:"Location",       value:"Constantine, Algeria",      sub:"Université Constantine 2",      href:"#",                          color:C.gold     },
  ];

  return (
    <div style={{ fontFamily:"Georgia,serif", background:C.cream, minHeight:"100vh", color:C.navy }}>
      <style>{SHARED_STYLES}</style>
      <Navbar active="contact"/>

      {/* Hero */}
      <section style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.navyMid} 100%)`, padding:"120px 5% 80px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(194,160,114,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(194,160,114,0.04) 1px,transparent 1px)`,backgroundSize:"60px 60px",pointerEvents:"none" }}/>
        <div style={{ position:"absolute",top:"-60px",left:"-60px",width:"380px",height:"380px",borderRadius:"50%",background:"radial-gradient(circle,rgba(194,160,114,0.1) 0%,transparent 70%)",pointerEvents:"none" }}/>

        <div ref={heroRef} style={{ maxWidth:"640px", margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <div style={{ fontSize:"10px",color:C.gold,letterSpacing:"3px",marginBottom:"14px",animation:heroVisible?"fadeUp .5s ease both":"none" }}>✦ GET IN TOUCH</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(36px,5vw,60px)",fontWeight:"600",color:C.white,margin:"0 0 18px",lineHeight:1.15,animation:heroVisible?"fadeUp .6s ease .1s both":"none" }}>
            Contact <span className="gold-text">Us</span>
          </h1>
          <p style={{ fontSize:"16px",color:"rgba(217,203,194,0.65)",lineHeight:1.8,maxWidth:"440px",margin:"0 auto",animation:heroVisible?"fadeUp .6s ease .2s both":"none" }}>
            Have a question, partnership idea, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section style={{ padding:"72px 5% 0" }}>
        <div ref={cardsRef} style={{ maxWidth:"1000px",margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"18px" }}>
          {contacts.map((c,i)=>(
            <a key={i} href={c.href} target={c.href.startsWith("http")?"_blank":"_self"} rel="noreferrer" style={{
              display:"block", textDecoration:"none",
              background:C.white, borderRadius:"16px",
              padding:"28px 20px", textAlign:"center",
              boxShadow:"0 4px 20px rgba(17,34,80,0.06)",
              border:"1px solid rgba(17,34,80,0.06)",
              transition:"all .3s ease",
              animation:cardsVisible?`fadeUp .5s ease ${i*.1}s both`:"none",
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 16px 40px rgba(17,34,80,0.12)";e.currentTarget.style.borderColor="rgba(194,160,114,0.3)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 20px rgba(17,34,80,0.06)";e.currentTarget.style.borderColor="rgba(17,34,80,0.06)";}}
            >
              <div style={{ width:"56px",height:"56px",borderRadius:"16px",background:"rgba(17,34,80,0.04)",display:"flex",alignItems:"center",justifyContent:"center",color:c.color,margin:"0 auto 14px" }}>{c.icon}</div>
              <div style={{ fontSize:"9px",color:C.muted,letterSpacing:"2px",marginBottom:"6px" }}>{c.label.toUpperCase()}</div>
              <div style={{ fontWeight:"700",color:C.navy,fontSize:"13px",marginBottom:"4px" }}>{c.value}</div>
              <div style={{ fontSize:"11px",color:C.muted }}>{c.sub}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Contact form */}
      <section style={{ padding:"60px 5% 96px" }}>
        <div style={{ maxWidth:"680px", margin:"0 auto" }}>
          <div style={{ background:C.white,borderRadius:"24px",padding:"44px",boxShadow:"0 8px 40px rgba(17,34,80,0.08)",border:"1px solid rgba(17,34,80,0.07)",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,${C.gold},${C.lightGold})`,borderRadius:"24px 24px 0 0" }}/>

            <div style={{ marginBottom:"28px" }}>
              <div style={{ fontSize:"10px",color:C.gold,letterSpacing:"3px",marginBottom:"8px" }}>✦ SEND A MESSAGE</div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"28px",fontWeight:"600",color:C.navy,margin:0 }}>Let's Talk</h2>
            </div>

            {sent && (
              <div style={{ background:"rgba(39,174,96,0.08)",border:"1px solid rgba(39,174,96,0.3)",borderRadius:"10px",padding:"14px 18px",marginBottom:"20px",display:"flex",alignItems:"center",gap:"10px",color:"#27AE60",fontSize:"13px",fontWeight:"700" }}>
                <FiCheckCircle size={16}/> Message sent! We'll reply within 24 hours.
              </div>
            )}

            {/* Fields */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px" }}>
              {[{key:"name",label:"YOUR NAME",icon:<FiUser size={14}/>,placeholder:"Ahmed Benali",type:"text"},{key:"email",label:"EMAIL ADDRESS",icon:<FiMail size={14}/>,placeholder:"ahmed@univ.dz",type:"email"}].map(f=>(
                <div key={f.key}>
                  <label style={{ display:"block",fontSize:"9px",color:C.muted,letterSpacing:"1.5px",marginBottom:"8px",fontWeight:"700" }}>{f.label}</label>
                  <div style={{ position:"relative" }}>
                    <span style={{ position:"absolute",left:"13px",top:"50%",transform:"translateY(-50%)",color:C.gold }}>{f.icon}</span>
                    <input type={f.type} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder={f.placeholder} style={{ width:"100%",padding:"12px 12px 12px 38px",borderRadius:"9px",border:"1.5px solid rgba(17,34,80,0.1)",background:C.offWhite,fontSize:"13px",fontFamily:"Georgia,serif",color:C.navy,outline:"none",transition:"border-color .2s" }}
                      onFocus={e=>e.target.style.borderColor=C.gold}
                      onBlur={e=>e.target.style.borderColor="rgba(17,34,80,0.1)"}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom:"16px" }}>
              <label style={{ display:"block",fontSize:"9px",color:C.muted,letterSpacing:"1.5px",marginBottom:"8px",fontWeight:"700" }}>SUBJECT</label>
              <input type="text" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="What is this about?" style={{ width:"100%",padding:"12px 14px",borderRadius:"9px",border:"1.5px solid rgba(17,34,80,0.1)",background:C.offWhite,fontSize:"13px",fontFamily:"Georgia,serif",color:C.navy,outline:"none",transition:"border-color .2s" }}
                onFocus={e=>e.target.style.borderColor=C.gold}
                onBlur={e=>e.target.style.borderColor="rgba(17,34,80,0.1)"}
              />
            </div>

            <div style={{ marginBottom:"24px" }}>
              <label style={{ display:"block",fontSize:"9px",color:C.muted,letterSpacing:"1.5px",marginBottom:"8px",fontWeight:"700" }}>MESSAGE</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute",left:"13px",top:"14px",color:C.gold }}><FiMessageSquare size={14}/></span>
                <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell us how we can help..." rows={5} style={{ width:"100%",padding:"12px 12px 12px 38px",borderRadius:"9px",border:"1.5px solid rgba(17,34,80,0.1)",background:C.offWhite,fontSize:"13px",fontFamily:"Georgia,serif",color:C.navy,outline:"none",resize:"vertical",transition:"border-color .2s" }}
                  onFocus={e=>e.target.style.borderColor=C.gold}
                  onBlur={e=>e.target.style.borderColor="rgba(17,34,80,0.1)"}
                />
              </div>
            </div>

            <button onClick={handleSubmit} style={{ width:"100%",padding:"14px",background:`linear-gradient(135deg,${C.gold},${C.lightGold})`,border:"none",borderRadius:"9px",cursor:"pointer",color:C.navy,fontSize:"14px",fontWeight:"700",fontFamily:"Georgia,serif",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",boxShadow:"0 6px 20px rgba(194,160,114,0.35)",transition:"all .25s ease" }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
            >
              <FiSend size={14}/> Send Message
            </button>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}

// ── ABOUT PAGE ────────────────────────────────────────────────────────────
export function AboutPage() {
  const [heroRef, heroVisible]   = useReveal();
  const [missionRef, mV]         = useReveal();
  const [teamRef, teamV]         = useReveal();
  const [statsRef, statsV]       = useReveal();

  const values = [
    { icon:<FiTarget size={22}/>,    title:"Our Mission",  desc:"To simplify the internship journey for every Algerian student, making professional opportunities accessible across all 48 wilayas.",    color:C.gold     },
    { icon:<FiZap size={22}/>,       title:"Our Vision",   desc:"To become Algeria's leading career platform, bridging the gap between universities, students, and the professional world.",              color:C.navy,    dark:true },
    { icon:<FiHeart size={22}/>,     title:"Our Values",   desc:"Transparency, elegance, and student success. We believe every student deserves access to great internships regardless of their wilaya.", color:C.sapphire },
    { icon:<FiTrendingUp size={22}/>,title:"Our Impact",   desc:"1000+ students successfully placed in internships across Algeria, with official PDF conventions generated automatically.",                color:C.gold     },
  ];

  const features = [
    { icon:<FiUsers size={20}/>,    title:"Students First",     desc:"Every feature is designed with student success as the primary goal." },
    { icon:<FiBriefcase size={20}/>,title:"Company Ready",      desc:"Powerful tools to help companies find and manage student talent."    },
    { icon:<FiShield size={20}/>,   title:"University Backed",  desc:"Official validation and automatic PDF convention generation."        },
    { icon:<FiGlobe size={20}/>,    title:"All 48 Wilayas",     desc:"Covering every corner of Algeria with localized internship offers."  },
    { icon:<FiAward size={20}/>,    title:"Quality Assured",    desc:"Verified companies and validated internship agreements."             },
    { icon:<FiBook size={20}/>,     title:"Open Platform",      desc:"Built as an academic project with open collaboration in mind."       },
  ];

  const team = [
    { name:"Basmala",  role:"Full-Stack Developer", uni:"Université Constantine 2", initial:"B" },
    { name:"Teammate", role:"Full-Stack Developer", uni:"Université Constantine 2", initial:"T" },
  ];

  return (
    <div style={{ fontFamily:"Georgia,serif", background:C.cream, minHeight:"100vh", color:C.navy }}>
      <style>{SHARED_STYLES}</style>
      <Navbar active="about"/>

      {/* Hero */}
      <section style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.navyMid} 100%)`, padding:"120px 5% 80px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(194,160,114,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(194,160,114,0.04) 1px,transparent 1px)`,backgroundSize:"60px 60px",pointerEvents:"none" }}/>
        <div style={{ position:"absolute",bottom:"-60px",right:"-60px",width:"380px",height:"380px",borderRadius:"50%",background:"radial-gradient(circle,rgba(194,160,114,0.1) 0%,transparent 70%)",pointerEvents:"none" }}/>

        <div ref={heroRef} style={{ maxWidth:"700px",margin:"0 auto",textAlign:"center",position:"relative",zIndex:1 }}>
          <div style={{ fontSize:"10px",color:C.gold,letterSpacing:"3px",marginBottom:"14px",animation:heroVisible?"fadeUp .5s ease both":"none" }}>✦ OUR STORY</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(36px,5vw,60px)",fontWeight:"600",color:C.white,margin:"0 0 18px",lineHeight:1.15,animation:heroVisible?"fadeUp .6s ease .1s both":"none" }}>
            About <span className="gold-text">Stag.io</span>
          </h1>
          <p style={{ fontSize:"16px",color:"rgba(217,203,194,0.65)",lineHeight:1.8,maxWidth:"520px",margin:"0 auto",animation:heroVisible?"fadeUp .6s ease .2s both":"none" }}>
            Born from a simple idea — connecting Algerian students with great companies should be effortless, elegant, and accessible to everyone.
          </p>
        </div>
      </section>

      {/* Mission + Story */}
      <section style={{ padding:"96px 5%", background:C.offWhite }}>
        <div ref={missionRef} style={{ maxWidth:"1100px",margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"64px",alignItems:"center" }}>
          <div style={{ animation:mV?"fadeUp .6s ease both":"none" }}>
            <div style={{ fontSize:"10px",color:C.gold,letterSpacing:"3px",marginBottom:"12px" }}>✦ OUR STORY</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(28px,4vw,44px)",fontWeight:"600",color:C.navy,margin:"0 0 20px",lineHeight:1.2 }}>
              Built for Algeria's<br/>Future Workforce
            </h2>
            <div style={{ width:"60px",height:"2px",background:`linear-gradient(90deg,${C.gold},${C.lightGold},transparent)`,marginBottom:"24px",borderRadius:"2px" }}/>
            <p style={{ fontSize:"15px",color:C.muted,lineHeight:1.85,marginBottom:"18px" }}>
              Stag.io was developed as a graduation project at Université Constantine 2. We noticed that the internship process in Algeria was fragmented — students struggled to find offers, companies had no central platform, and universities managed everything manually.
            </p>
            <p style={{ fontSize:"15px",color:C.muted,lineHeight:1.85,marginBottom:"18px" }}>
              We built a solution that handles everything from discovery to the official <em>convention de stage</em> — all in one elegant, modern platform that works across all 48 wilayas.
            </p>
            <p style={{ fontSize:"15px",color:C.muted,lineHeight:1.85 }}>
              Today, Stag.io connects students, companies, and university administrators with a seamless experience that removes all the paperwork and friction from the internship process.
            </p>
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px",animation:mV?"slideR .7s ease .2s both":"none" }}>
            {values.map((v,i)=>(
              <div key={i} style={{ background:v.dark?C.navy:C.white,borderRadius:"16px",padding:"24px 20px",boxShadow:v.dark?"0 12px 36px rgba(17,34,80,0.18)":"0 4px 20px rgba(17,34,80,0.06)",border:v.dark?"none":"1px solid rgba(17,34,80,0.06)",transition:"all .3s ease" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}
              >
                <div style={{ color:v.dark?C.gold:v.color,marginBottom:"12px" }}>{v.icon}</div>
                <div style={{ fontWeight:"700",color:v.dark?C.white:C.navy,fontSize:"14px",marginBottom:"6px" }}>{v.title}</div>
                <div style={{ fontSize:"12px",color:v.dark?"rgba(245,240,233,0.55)":C.muted,lineHeight:1.6 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding:"96px 5%", background:C.cream }}>
        <div style={{ maxWidth:"1100px",margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:"60px" }}>
            <div style={{ fontSize:"10px",color:C.gold,letterSpacing:"3px",marginBottom:"10px" }}>✦ WHAT WE OFFER</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(28px,4vw,44px)",fontWeight:"600",color:C.navy,margin:"0 0 14px" }}>Platform Highlights</h2>
            <div style={{ width:"48px",height:"2px",background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,margin:"0 auto" }}/>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"18px" }}>
            {features.map((f,i)=>(
              <div key={i} style={{ background:C.white,borderRadius:"16px",padding:"28px 22px",boxShadow:"0 4px 20px rgba(17,34,80,0.06)",border:"1px solid rgba(17,34,80,0.06)",transition:"all .3s ease",animation:`fadeUp .5s ease ${i*.08}s both` }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor="rgba(194,160,114,0.3)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor="rgba(17,34,80,0.06)";}}
              >
                <div style={{ width:"44px",height:"44px",borderRadius:"12px",background:"rgba(194,160,114,0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:C.gold,marginBottom:"14px" }}>{f.icon}</div>
                <div style={{ fontWeight:"700",color:C.navy,fontSize:"14px",marginBottom:"7px" }}>{f.title}</div>
                <div style={{ fontSize:"13px",color:C.muted,lineHeight:1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} style={{ padding:"72px 5%",background:C.navy }}>
        <div style={{ maxWidth:"900px",margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)" }}>
          {[{icon:<FiBriefcase size={18}/>,val:"500+",label:"Active Offers"},{icon:<FiUsers size={18}/>,val:"200+",label:"Companies"},{icon:<FiAward size={18}/>,val:"1000+",label:"Students Placed"},{icon:<FiGlobe size={18}/>,val:"48",label:"Wilayas"}].map((s,i)=>(
            <div key={i} style={{ textAlign:"center",padding:"12px 16px",borderRight:i<3?"1px solid rgba(194,160,114,0.12)":"none",animation:statsV?`fadeUp .5s ease ${i*.1}s both`:"none" }}>
              <div style={{ color:C.gold,marginBottom:"8px",display:"flex",justifyContent:"center" }}>{s.icon}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"38px",fontWeight:"600",color:C.gold,lineHeight:1,marginBottom:"4px" }}>{s.val}</div>
              <div style={{ fontSize:"10px",color:"rgba(245,240,233,0.4)",letterSpacing:"1.5px" }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ padding:"96px 5%", background:C.offWhite }}>
        <div ref={teamRef} style={{ maxWidth:"700px",margin:"0 auto",textAlign:"center" }}>
          <div style={{ fontSize:"10px",color:C.gold,letterSpacing:"3px",marginBottom:"10px" }}>✦ THE TEAM</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(28px,4vw,44px)",fontWeight:"600",color:C.navy,margin:"0 0 14px" }}>Meet the Builders</h2>
          <div style={{ width:"48px",height:"2px",background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,margin:"0 auto 48px" }}/>

          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"24px" }}>
            {team.map((t,i)=>(
              <div key={i} style={{ background:C.white,borderRadius:"20px",padding:"36px 28px",boxShadow:"0 4px 20px rgba(17,34,80,0.07)",border:"1px solid rgba(17,34,80,0.07)",animation:teamV?`fadeUp .6s ease ${i*.15}s both`:"none" }}>
                <div style={{ width:"72px",height:"72px",borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},${C.lightGold})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"28px",fontWeight:"700",color:C.navy,margin:"0 auto 16px",boxShadow:"0 8px 24px rgba(194,160,114,0.3)" }}>
                  {t.initial}
                </div>
                <div style={{ fontWeight:"700",color:C.navy,fontSize:"16px",marginBottom:"5px" }}>{t.name}</div>
                <div style={{ fontSize:"12px",color:C.gold,letterSpacing:"1px",marginBottom:"5px",fontWeight:"700" }}>{t.role}</div>
                <div style={{ fontSize:"12px",color:C.muted,display:"flex",alignItems:"center",justifyContent:"center",gap:"4px" }}>
                  <FiMapPin size={10}/> {t.uni}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:"36px",background:C.white,borderRadius:"16px",padding:"28px 32px",border:"1px solid rgba(194,160,114,0.2)",boxShadow:"0 4px 20px rgba(17,34,80,0.06)" }}>
            <p style={{ fontSize:"15px",color:C.muted,lineHeight:1.8,margin:0,fontStyle:"italic" }}>
              "We built Stag.io because we believe every Algerian student deserves access to great internship opportunities, regardless of where they live or study."
            </p>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}