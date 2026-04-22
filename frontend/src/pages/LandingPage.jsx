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
    .hero-slider-wrap { display: none !important; }
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
`;

function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.8+0.3,
      dx: (Math.random()-.5)*.22, dy: (Math.random()-.5)*.22,
      o: Math.random()*.2+.04,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(17,34,80,${p.o})`; ctx.fill();
        p.x+=p.dx; p.y+=p.dy;
        if(p.x<0||p.x>W) p.dx*=-1;
        if(p.y<0||p.y>H) p.dy*=-1;
      });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<110){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(194,160,114,${.1*(1-d/110)})`;ctx.lineWidth=.5;ctx.stroke();}
      }
      raf=requestAnimationFrame(draw);
    };
    draw();
    const onR=()=>{W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;};
    window.addEventListener("resize",onR);
    return ()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",onR);};
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}/>;
}

function Counter({target,suffix=""}) {
  const [val,setVal]=useState(0);
  const ref=useRef(null);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){let s=0;const step=target/60;const t=setInterval(()=>{s+=step;if(s>=target){setVal(target);clearInterval(t);}else setVal(Math.floor(s));},16);}
    },{threshold:.5});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

function useReveal() {
  const ref=useRef(null);
  const [v,setV]=useState(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);obs.disconnect();}},{threshold:.1});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[]);
  return [ref,v];
}

const demoScreens = [
  {
    label:"Student Dashboard",
    bg:C.navy,
    content:(
      <div style={{padding:"18px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"}}>
          <div style={{width:"34px",height:"34px",borderRadius:"9px",background:`linear-gradient(135deg,${C.gold},${C.lightGold})`,display:"flex",alignItems:"center",justifyContent:"center"}}><FiUser size={14} color={C.navy}/></div>
          <div><div style={{fontSize:"12px",fontWeight:"700",color:C.white}}>Ahmed Benali</div><div style={{fontSize:"9px",color:"rgba(245,240,233,0.45)"}}>Student · Constantine</div></div>
          <div style={{marginLeft:"auto",background:"rgba(74,222,128,0.15)",border:"1px solid rgba(74,222,128,0.3)",borderRadius:"20px",padding:"2px 8px",fontSize:"9px",color:"#4ade80"}}>● Active</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px",marginBottom:"12px"}}>
          {[{l:"Applications",v:"12",c:C.gold},{l:"Accepted",v:"3",c:"#4ade80"},{l:"Pending",v:"7",c:C.lightGold},{l:"Offers",v:"48",c:"#93c5fd"}].map((s,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.06)",borderRadius:"9px",padding:"9px 11px"}}>
              <div style={{fontSize:"8px",color:"rgba(245,240,233,0.35)",marginBottom:"3px",letterSpacing:"1px"}}>{s.l.toUpperCase()}</div>
              <div style={{fontSize:"20px",fontWeight:"700",color:s.c,lineHeight:1}}>{s.v}</div>
            </div>
          ))}
        </div>
        <div style={{background:"rgba(255,255,255,0.05)",borderRadius:"9px",padding:"10px"}}>
          <div style={{fontSize:"8px",color:C.gold,letterSpacing:"1px",marginBottom:"6px"}}>LATEST MATCH</div>
          <div style={{fontWeight:"700",color:C.white,fontSize:"12px",marginBottom:"2px"}}>Stage React Developer</div>
          <div style={{fontSize:"10px",color:"rgba(245,240,233,0.45)",marginBottom:"6px"}}>Sonatrach · Alger · Remote</div>
          <div style={{display:"flex",gap:"4px"}}>
            {["React","JavaScript"].map(t=><span key={t} style={{background:"rgba(194,160,114,0.15)",border:"1px solid rgba(194,160,114,0.25)",borderRadius:"20px",padding:"1px 7px",fontSize:"8px",color:C.gold}}>{t}</span>)}
          </div>
        </div>
      </div>
    ),
  },
  {
    label:"Search Offers",
    bg:C.white,
    content:(
      <div style={{padding:"18px"}}>
        <div style={{background:C.offWhite,borderRadius:"9px",padding:"9px 12px",display:"flex",alignItems:"center",gap:"7px",marginBottom:"12px",border:`1.5px solid rgba(194,160,114,0.3)`}}>
          <FiSearch size={13} color={C.gold}/><span style={{fontSize:"11px",color:C.muted}}>Search internships...</span>
        </div>
        {[{title:"Stage Python Dev",co:"Djezzy",loc:"Oran",type:"Présentiel"},{title:"Stage UI/UX Designer",co:"Mobilis",loc:"Alger",type:"Remote"},{title:"Stage Data Analyst",co:"Ooredoo",loc:"Blida",type:"Hybride"}].map((o,i)=>(
          <div key={i} style={{background:C.white,borderRadius:"10px",padding:"10px 12px",marginBottom:"7px",border:"1px solid rgba(17,34,80,0.07)",boxShadow:"0 2px 8px rgba(17,34,80,0.04)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"3px"}}>
              <div style={{fontWeight:"700",color:C.navy,fontSize:"11px"}}>{o.title}</div>
              <span style={{background:"rgba(194,160,114,0.12)",borderRadius:"20px",padding:"1px 7px",fontSize:"8px",color:C.gold}}>{o.type}</span>
            </div>
            <div style={{fontSize:"9px",color:C.muted}}>{o.co} · {o.loc}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    label:"Convention PDF",
    bg:C.offWhite,
    content:(
      <div style={{padding:"18px"}}>
        <div style={{background:C.navy,borderRadius:"11px",padding:"14px",marginBottom:"11px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,${C.gold},${C.lightGold})`}}/>
          <div style={{fontSize:"8px",color:C.gold,letterSpacing:"2px",marginBottom:"5px"}}>CONVENTION DE STAGE</div>
          <div style={{fontWeight:"700",color:C.white,fontSize:"12px",marginBottom:"3px"}}>Stage React Developer</div>
          <div style={{fontSize:"10px",color:"rgba(245,240,233,0.55)",marginBottom:"8px"}}>Sonatrach · Alger</div>
          <div style={{display:"flex",alignItems:"center",gap:"5px"}}><FiCheckCircle size={11} color="#4ade80"/><span style={{fontSize:"9px",color:"#4ade80"}}>Validated by Admin</span></div>
        </div>
        {[["Student","Ahmed Benali"],["Company","Sonatrach"],["University","Univ. Constantine 2"],["Status","✓ Validated"]].map(([l,v],i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(17,34,80,0.06)"}}>
            <span style={{fontSize:"9px",color:C.muted,letterSpacing:"1px"}}>{l.toUpperCase()}</span>
            <span style={{fontSize:"11px",fontWeight:"600",color:C.navy}}>{v}</span>
          </div>
        ))}
        <div style={{marginTop:"11px",background:`linear-gradient(135deg,${C.gold},${C.lightGold})`,borderRadius:"7px",padding:"9px",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",cursor:"pointer"}}>
          <FiFileText size={12} color={C.navy}/><span style={{fontSize:"10px",fontWeight:"700",color:C.navy}}>DOWNLOAD PDF</span>
        </div>
      </div>
    ),
  },
];

function HeroSlider() {
  const [cur,setCur]=useState(0);
  const [anim,setAnim]=useState(true);
  useEffect(()=>{
    const t=setInterval(()=>{setAnim(false);setTimeout(()=>{setCur(c=>(c+1)%demoScreens.length);setAnim(true);},200);},3500);
    return ()=>clearInterval(t);
  },[]);
  const s=demoScreens[cur];
  return (
    <div style={{position:"relative",width:"100%",maxWidth:"360px",margin:"0 auto"}}>
      <div style={{position:"absolute",top:"14px",right:"-10px",width:"100%",height:"100%",borderRadius:"22px",background:"rgba(17,34,80,0.07)",transform:"rotate(2.5deg)"}}/>
      <div style={{position:"absolute",top:"7px",right:"-5px",width:"100%",height:"100%",borderRadius:"22px",background:"rgba(17,34,80,0.04)",transform:"rotate(1.2deg)"}}/>
      <div style={{background:s.bg===C.navy?C.navy:C.white,borderRadius:"22px",boxShadow:"0 24px 64px rgba(17,34,80,0.16)",overflow:"hidden",transition:"all .25s ease",opacity:anim?1:0,transform:anim?"translateY(0)":"translateY(10px)",position:"relative"}}>
        <div style={{height:"3px",background:`linear-gradient(90deg,${C.gold},${C.lightGold})`}}/>
        <div style={{padding:"9px 14px",background:s.bg===C.navy?"rgba(255,255,255,0.04)":"rgba(17,34,80,0.02)",display:"flex",alignItems:"center",gap:"5px",borderBottom:`1px solid ${s.bg===C.navy?"rgba(255,255,255,0.06)":"rgba(17,34,80,0.05)"}`}}>
          {["#ff5f56","#ffbd2e","#27c93f"].map(c=><div key={c} style={{width:"7px",height:"7px",borderRadius:"50%",background:c}}/>)}
          <span style={{marginLeft:"7px",fontSize:"9px",color:s.bg===C.navy?"rgba(245,240,233,0.35)":C.muted,letterSpacing:"1px"}}>{s.label}</span>
        </div>
        {s.content}
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:"5px",marginTop:"14px"}}>
        {demoScreens.map((_,i)=><div key={i} onClick={()=>setCur(i)} style={{width:i===cur?"18px":"5px",height:"5px",borderRadius:"3px",background:i===cur?C.gold:"rgba(17,34,80,0.13)",cursor:"pointer",transition:"all .3s ease"}}/>)}
      </div>
      <div style={{position:"absolute",bottom:"55px",right:"-28px",background:C.navy,borderRadius:"11px",padding:"9px 13px",boxShadow:"0 10px 28px rgba(17,34,80,0.22)",animation:"float 4s ease-in-out infinite",zIndex:2}}>
        <div style={{fontSize:"8px",color:C.gold,letterSpacing:"1px",marginBottom:"2px"}}>VALIDATED</div>
        <div style={{fontSize:"11px",fontWeight:"700",color:C.white,display:"flex",alignItems:"center",gap:"4px"}}><FiCheckCircle size={10} color="#4ade80"/> Convention ✓</div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [titleVisible,setTitleVisible]=useState(false);
  const [companies,setCompanies]=useState([]);
  const [reviews,setReviews]=useState([]);

  useEffect(()=>{
    setTimeout(()=>setTitleVisible(true),200);
    fetch("http://127.0.0.1:8000/api/public/companies/").then(r=>r.json()).then(d=>{if(Array.isArray(d))setCompanies(d);}).catch(()=>{});
    fetch("http://127.0.0.1:8000/api/public/reviews/").then(r=>r.json()).then(d=>{if(Array.isArray(d))setReviews(d);}).catch(()=>{});
  },[]);

  const [featRef,featVisible]=useReveal();
  const [compRef,compVisible]=useReveal();
  const [stepsRef,stepsVisible]=useReveal();
  const [revRef,revVisible]=useReveal();
  const [ctaRef,ctaVisible]=useReveal();

  const [reviewModal, setReviewModal] = useState(false);
  const [reviewForm, setReviewForm]   = useState({ company_id: "", rating: 5, comment: "" });
  const [reviewMsg,  setReviewMsg]    = useState("");
  const [myCompanies, setMyCompanies] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role  = localStorage.getItem("role");
    if (token && role === "student") {
      fetch("http://127.0.0.1:8000/api/student/agreements/", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setMyCompanies(d); })
      .catch(() => {});
    }
  }, []);

  const handleSubmitReview = async () => {
    const token = localStorage.getItem("token");
    if (!reviewForm.company_id || !reviewForm.comment) {
      setReviewMsg("❌ Please fill all fields.");
      return;
    }
    const selected = myCompanies.find(c => String(c.company_id || c.id) === String(reviewForm.company_id));
    if (!selected) {
      setReviewMsg("❌ Could not find your internship for this company.");
      return;
    }
    const res = await fetch("http://127.0.0.1:8000/api/student/review/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({
        company_id: reviewForm.company_id,
        rating:     reviewForm.rating,
        comment:    reviewForm.comment,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setReviewMsg("✅ Review submitted! It will appear below.");
      setMyCompanies(prev => prev.map(c =>
        String(c.company_id || c.id) === String(reviewForm.company_id)
          ? { ...c, has_reviewed: true }
          : c
      ));
      const newReview = {
        student_name: localStorage.getItem("full_name") || "You",
        company_name: myCompanies.find(c => String(c.company_id || c.id) === String(reviewForm.company_id))?.company_name || "",
        rating:       reviewForm.rating,
        comment:      reviewForm.comment,
      };
      setReviews(prev => [newReview, ...prev]);
      setTimeout(() => { setReviewModal(false); setReviewMsg(""); setReviewForm({ company_id: "", rating: 5, comment: "" }); }, 2000);
    } else {
      setReviewMsg(`❌ ${data.error || "Something went wrong."}`);
    }
  };

  const displayCompanies = companies.length > 0 ? companies : [
    {company_name:"Sonatrach",location:"Alger"},{company_name:"Djezzy",location:"Alger"},
    {company_name:"Mobilis",location:"Alger"},{company_name:"Ooredoo",location:"Oran"},
    {company_name:"Air Algérie",location:"Alger"},{company_name:"BNA",location:"Alger"},
    {company_name:"Cevital",location:"Béjaïa"},{company_name:"Naftal",location:"Alger"},
  ];

  const displayReviews = reviews.length > 0 ? reviews : [
    {student_name:"Amira Benali",company_name:"Sonatrach",rating:5,comment:"Stag.io made finding my internship incredibly easy. The smart matching found me the perfect role!"},
    {student_name:"Yacine Hamdi",company_name:"Djezzy",rating:5,comment:"The platform is beautiful and easy to use. I got my convention PDF in minutes after validation."},
    {student_name:"Sara Meziane",company_name:"Mobilis",rating:4,comment:"Great experience overall. The application tracking feature kept me informed every step of the way."},
  ];

  const features = [
    {icon:<FiUser size={22}/>,tag:"STUDENTS",title:"Find Your Perfect Internship",desc:"Smart skill-based recommendations match you with the right offers across Algeria. Apply in one click and track every step.",pills:["Skill Matching","One-Click Apply","Status Tracking"],accent:C.gold},
    {icon:<FiBriefcase size={22}/>,tag:"COMPANIES",title:"Recruit Top Student Talent",desc:"Post offers, review applications, and manage your hiring pipeline from one elegant dashboard.",pills:["Post Offers","Review CVs","Instant Notify"],accent:C.navy,featured:true},
    {icon:<FiShield size={22}/>,tag:"UNIVERSITIES",title:"Full Administrative Control",desc:"Validate internship agreements, generate official PDF conventions automatically, and monitor students.",pills:["Validate Files","Auto PDF","Analytics"],accent:C.sapphire},
  ];

  const steps=[
    {icon:<FiUser size={20}/>,n:"01",title:"Create Profile",desc:"Register as a student or company. Fill in your skills and details in under 2 minutes."},
    {icon:<FiSearch size={20}/>,n:"02",title:"Discover Offers",desc:"Browse curated internship offers matched to your skills and location across all 48 wilayas."},
    {icon:<FiFileText size={20}/>,n:"03",title:"Apply & Connect",desc:"Send your application with a cover letter. Companies review and respond with full notifications."},
    {icon:<FiCheckCircle size={20}/>,n:"04",title:"Get Validated",desc:"Your university validates the agreement and generates your official PDF convention automatically."},
  ];

  return (
    <div style={{fontFamily:"Georgia,serif",background:C.cream,overflowX:"hidden",color:C.navy}}>
      <style>{SHARED_STYLES}</style>
      <style>{RESPONSIVE_STYLES}</style>
      <Navbar active="home"/>

      {/* ══ HERO ══ */}
      <section className="hero-section" style={{minHeight:"100vh",position:"relative",overflow:"hidden",background:`linear-gradient(150deg,${C.cream} 0%,#EDF2FF 55%,${C.offWhite} 100%)`,display:"flex",alignItems:"center",padding:"100px 5% 60px"}}>
        <ParticleCanvas/>
        <div style={{position:"absolute",inset:0,pointerEvents:"none",backgroundImage:`linear-gradient(rgba(17,34,80,0.028) 1px,transparent 1px),linear-gradient(90deg,rgba(17,34,80,0.028) 1px,transparent 1px)`,backgroundSize:"64px 64px"}}/>
        <div style={{position:"absolute",top:"-60px",right:"-60px",width:"450px",height:"450px",borderRadius:"50%",background:"radial-gradient(circle,rgba(194,160,114,0.1) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"-40px",left:"8%",width:"350px",height:"350px",borderRadius:"50%",background:"radial-gradient(circle,rgba(17,34,80,0.04) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:"20%",right:"6%",width:"180px",height:"180px",borderRadius:"50%",border:"1px solid rgba(194,160,114,0.18)",animation:"float 7s ease-in-out infinite",pointerEvents:"none"}}/>

        <div style={{maxWidth:"1100px",margin:"0 auto",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"60px",alignItems:"center",position:"relative",zIndex:1}} className="hero-grid">
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(17,34,80,0.06)",border:"1px solid rgba(17,34,80,0.11)",borderRadius:"20px",padding:"5px 16px",marginBottom:"28px",animation:titleVisible?"fadeUp .5s ease both":"none"}}>
              <div style={{width:"6px",height:"6px",borderRadius:"50%",background:C.gold,animation:"pulse 2s infinite"}}/>
              <span style={{fontSize:"10px",color:C.navy,letterSpacing:"2px",opacity:.65}}>ALGERIA'S INTERNSHIP PLATFORM</span>
            </div>

            <h1 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(38px,5.5vw,70px)",fontWeight:"600",color:C.navy,lineHeight:1.1,margin:"0 0 22px",animation:titleVisible?"fadeUp .6s ease .1s both":"none"}}>
              Your Internship<br/><span className="gold-text">Journey</span> Starts<br/>Right Here
            </h1>

            <div style={{width:"72px",height:"2px",marginBottom:"22px",background:`linear-gradient(90deg,${C.gold},${C.lightGold},transparent)`,animation:titleVisible?"fadeIn .8s ease .3s both":"none",borderRadius:"2px"}}/>

            <p style={{fontSize:"16px",color:"rgba(17,34,80,0.56)",lineHeight:1.85,maxWidth:"440px",margin:"0 0 36px",animation:titleVisible?"fadeUp .6s ease .2s both":"none"}}>
              Connect students with companies across all 48 wilayas of Algeria. Apply for internships, track applications, and download your official <em>convention de stage</em> — seamlessly.
            </p>

            <div className="hero-btns" style={{display:"flex",gap:"12px",flexWrap:"wrap",animation:titleVisible?"fadeUp .6s ease .35s both":"none"}}>
              <button className="btn-hover" onClick={()=>window.location.href="/register"} style={{padding:"14px 28px",background:`linear-gradient(135deg,${C.gold},${C.lightGold})`,border:"none",borderRadius:"9px",cursor:"pointer",color:C.navy,fontSize:"14px",fontWeight:"700",fontFamily:"Georgia,serif",boxShadow:"0 8px 28px rgba(194,160,114,0.38)",display:"flex",alignItems:"center",gap:"8px"}}>
                <FiSearch size={14}/> Find Internship
              </button>
              <button className="btn-hover" onClick={()=>window.location.href="/register"} style={{padding:"14px 28px",background:"transparent",border:"1.5px solid rgba(17,34,80,0.16)",borderRadius:"9px",cursor:"pointer",color:C.navy,fontSize:"14px",fontFamily:"Georgia,serif",display:"flex",alignItems:"center",gap:"8px",transition:"border-color .2s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold}
                onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(17,34,80,0.16)"}
              ><FiBriefcase size={14}/> Post an Offer</button>
            </div>

            <div className="hero-stats" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",marginTop:"32px",background:"rgba(255,255,255,0.7)",backdropFilter:"blur(8px)",border:"1px solid rgba(17,34,80,0.07)",borderRadius:"12px",overflow:"hidden",animation:titleVisible?"fadeUp .6s ease .5s both":"none"}}>
              {[{icon:<FiBriefcase size={13}/>,val:"500+",txt:"Offers"},{icon:<FiUsers size={13}/>,val:"200+",txt:"Companies"},{icon:<FiAward size={13}/>,val:"1000+",txt:"Students"},{icon:<FiMapPin size={13}/>,val:"48",txt:"Wilayas"}].map((s,i)=>(
                <div key={i} style={{flex:1,padding:"12px 8px",textAlign:"center",borderRight:i<3?"1px solid rgba(17,34,80,0.06)":"none"}}>
                  <div style={{color:C.gold,marginBottom:"3px",display:"flex",justifyContent:"center"}}>{s.icon}</div>
                  <div style={{fontSize:"15px",fontWeight:"700",color:C.navy,lineHeight:1}}>{s.val}</div>
                  <div style={{fontSize:"9px",color:C.muted,letterSpacing:"1px",marginTop:"2px"}}>{s.txt.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-slider-wrap" style={{animation:titleVisible?"slideR .8s ease .2s both":"none"}}><HeroSlider/></div>
        </div>

        <div className="scroll-dot" style={{position:"absolute",bottom:"24px",left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",opacity:.3}}>
          <span style={{fontSize:"9px",color:C.navy,letterSpacing:"2px"}}>SCROLL</span>
          <div style={{width:"1px",height:"32px",background:`linear-gradient(180deg,${C.navy},transparent)`}}/>
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <section style={{background:C.navy,padding:"36px 5%"}}>
        <div style={{maxWidth:"960px",margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)"}} className="stats-bar-grid">
          {[{icon:<FiBriefcase size={16}/>,target:500,suffix:"+",label:"Internship Offers"},{icon:<FiUsers size={16}/>,target:200,suffix:"+",label:"Partner Companies"},{icon:<FiAward size={16}/>,target:1000,suffix:"+",label:"Students Placed"},{icon:<FiMapPin size={16}/>,target:48,suffix:"",label:"Wilayas Covered"}].map((s,i)=>(
            <div key={i} style={{textAlign:"center",padding:"12px 16px",borderRight:i<3?"1px solid rgba(194,160,114,0.12)":"none"}}>
              <div style={{color:C.gold,marginBottom:"6px",display:"flex",justifyContent:"center"}}>{s.icon}</div>
              <div style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"38px",fontWeight:"600",color:C.gold,lineHeight:1,marginBottom:"4px"}}><Counter target={s.target} suffix={s.suffix}/></div>
              <div style={{fontSize:"10px",color:"rgba(245,240,233,0.4)",letterSpacing:"1.5px"}}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="section-pad" style={{padding:"96px 5%",background:C.offWhite}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"60px"}}>
            <div style={{fontSize:"10px",color:C.gold,letterSpacing:"3px",marginBottom:"10px"}}>✦ BUILT FOR EVERYONE</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(28px,4vw,46px)",fontWeight:"600",color:C.navy,margin:"0 0 14px"}}>One Platform, Three Experiences</h2>
            <div style={{width:"48px",height:"2px",background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,margin:"0 auto"}}/>
          </div>
          <div ref={featRef} className="features-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"22px"}}>
            {features.map((f,i)=>(
              <div key={i} className="hover-lift" style={{background:f.featured?C.navy:C.white,borderRadius:"20px",padding:"36px 28px",boxShadow:f.featured?"0 16px 48px rgba(17,34,80,0.22)":"0 4px 20px rgba(17,34,80,0.06)",borderTop:`4px solid ${f.accent}`,position:"relative",overflow:"hidden",animation:featVisible?`fadeUp .6s ease ${i*.15}s both`:"none"}}>
                {f.featured&&<div style={{position:"absolute",top:"14px",right:"14px",background:"rgba(194,160,114,0.18)",border:"1px solid rgba(194,160,114,0.35)",borderRadius:"20px",padding:"2px 10px",fontSize:"9px",color:C.gold,letterSpacing:"1px"}}>MOST POPULAR</div>}
                <div style={{width:"46px",height:"46px",borderRadius:"12px",background:f.featured?"rgba(194,160,114,0.12)":"rgba(17,34,80,0.05)",display:"flex",alignItems:"center",justifyContent:"center",color:f.featured?C.gold:f.accent,marginBottom:"16px"}}>{f.icon}</div>
                <div style={{fontSize:"9px",letterSpacing:"2px",marginBottom:"7px",fontWeight:"700",color:f.featured?C.gold:f.accent}}>{f.tag}</div>
                <h3 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"21px",fontWeight:"600",color:f.featured?C.white:C.navy,margin:"0 0 11px",lineHeight:1.3}}>{f.title}</h3>
                <p style={{fontSize:"14px",lineHeight:1.75,color:f.featured?"rgba(245,240,233,0.6)":C.muted,margin:"0 0 20px"}}>{f.desc}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
                  {f.pills.map((p,j)=><span key={j} style={{padding:"3px 11px",borderRadius:"20px",fontSize:"11px",fontWeight:"600",background:f.featured?"rgba(194,160,114,0.12)":"rgba(17,34,80,0.05)",color:f.featured?C.gold:C.sapphire,border:f.featured?"1px solid rgba(194,160,114,0.2)":"1px solid rgba(17,34,80,0.08)"}}>{p}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OUR COMPANIES PREVIEW ══ */}
      <section style={{padding:"80px 0",background:C.cream,overflow:"hidden"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto",padding:"0 5%",marginBottom:"36px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:"16px"}}>
            <div>
              <div style={{fontSize:"10px",color:C.gold,letterSpacing:"3px",marginBottom:"10px"}}>✦ TRUSTED PARTNERS</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(28px,4vw,46px)",fontWeight:"600",color:C.navy,margin:0}}>Our Companies</h2>
            </div>
            <button className="btn-hover" onClick={()=>window.location.href="/companies"} style={{display:"flex",alignItems:"center",gap:"8px",padding:"10px 22px",background:"transparent",border:`1.5px solid rgba(17,34,80,0.18)`,borderRadius:"8px",cursor:"pointer",color:C.navy,fontSize:"13px",fontFamily:"Georgia,serif",transition:"border-color .2s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold}
              onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(17,34,80,0.18)"}
            >See All Companies <FiArrowRight size={14}/></button>
          </div>
        </div>

        <div style={{overflow:"hidden",position:"relative"}}>
          <div style={{position:"absolute",left:0,top:0,bottom:0,width:"80px",background:`linear-gradient(90deg,${C.cream},transparent)`,zIndex:1,pointerEvents:"none"}}/>
          <div style={{position:"absolute",right:0,top:0,bottom:0,width:"80px",background:`linear-gradient(270deg,${C.cream},transparent)`,zIndex:1,pointerEvents:"none"}}/>
          <div style={{display:"flex",animation:"marquee 28s linear infinite",width:"fit-content"}}>
            {[...displayCompanies,...displayCompanies].map((c,i)=>(
              <div key={i} style={{flexShrink:0,margin:"0 10px",background:C.white,borderRadius:"14px",padding:"16px 22px",boxShadow:"0 3px 16px rgba(17,34,80,0.06)",border:"1px solid rgba(17,34,80,0.07)",display:"flex",alignItems:"center",gap:"11px",minWidth:"170px",cursor:"pointer",transition:"all .3s"}}
              onClick={() => { if (c.id) window.location.href = `/company/${c.id}`; }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(194,160,114,0.4)";e.currentTarget.style.transform="translateY(-3px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(17,34,80,0.07)";e.currentTarget.style.transform="translateY(0)";}}
              >
                <div style={{width:"40px",height:"40px",borderRadius:"10px",background:`linear-gradient(135deg,rgba(194,160,114,0.18),rgba(194,160,114,0.05))`,border:"1px solid rgba(194,160,114,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",fontWeight:"700",color:C.gold,fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
                  {c.company_name?c.company_name[0].toUpperCase():"C"}
                </div>
                <div>
                  <div style={{fontWeight:"700",color:C.navy,fontSize:"12px",whiteSpace:"nowrap"}}>{c.company_name}</div>
                  {c.location&&<div style={{fontSize:"9px",color:C.muted,display:"flex",alignItems:"center",gap:"3px",marginTop:"2px"}}><FiMapPin size={8}/>{c.location}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="section-pad" style={{padding:"96px 5%",background:C.offWhite,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-60px",right:"-60px",width:"350px",height:"350px",borderRadius:"50%",background:"radial-gradient(circle,rgba(194,160,114,0.07) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{maxWidth:"1100px",margin:"0 auto",position:"relative"}}>
          <div style={{textAlign:"center",marginBottom:"68px"}}>
            <div style={{fontSize:"10px",color:C.gold,letterSpacing:"3px",marginBottom:"10px"}}>✦ SIMPLE PROCESS</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(28px,4vw,46px)",fontWeight:"600",color:C.navy,margin:"0 0 14px"}}>How Stag.io Works</h2>
            <div style={{width:"48px",height:"2px",background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,margin:"0 auto"}}/>
          </div>
          <div ref={stepsRef} className="steps-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"28px",position:"relative"}}>
            <div className="steps-line" style={{position:"absolute",top:"33px",left:"12%",right:"12%",height:"1px",background:`linear-gradient(90deg,transparent,rgba(194,160,114,0.3),transparent)`}}/>
            {steps.map((s,i)=>(
              <div key={i} style={{textAlign:"center",position:"relative",zIndex:1,animation:stepsVisible?`fadeUp .6s ease ${i*.15}s both`:"none"}}>
                <div style={{width:"66px",height:"66px",borderRadius:"50%",margin:"0 auto 16px",background:i%2===0?`linear-gradient(135deg,${C.gold},${C.lightGold})`:C.white,border:i%2===0?"none":`1.5px solid rgba(194,160,114,0.35)`,display:"flex",alignItems:"center",justifyContent:"center",color:i%2===0?C.navy:C.gold,boxShadow:i%2===0?"0 8px 24px rgba(194,160,114,0.3)":"0 4px 16px rgba(17,34,80,0.07)"}}>
                  {s.icon}
                </div>
                <div style={{fontSize:"9px",color:C.gold,letterSpacing:"2px",marginBottom:"7px"}}>STEP {s.n}</div>
                <h3 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"18px",fontWeight:"600",color:C.navy,margin:"0 0 8px",lineHeight:1.3}}>{s.title}</h3>
                <p style={{fontSize:"13px",color:C.muted,lineHeight:1.7,margin:0}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ REVIEWS ══ */}
      <section className="section-pad" style={{padding:"96px 5%",background:C.cream}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"60px"}}>
            <div style={{fontSize:"10px",color:C.gold,letterSpacing:"3px",marginBottom:"10px"}}>✦ STUDENT VOICES</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(28px,4vw,46px)",fontWeight:"600",color:C.navy,margin:"0 0 14px"}}>What Students Say</h2>
            <div style={{width:"48px",height:"2px",background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,margin:"0 auto 24px"}}/>
            <button
              onClick={() => {
                const token = localStorage.getItem("token");
                const role  = localStorage.getItem("role");
                if (!token || role !== "student") {
                  window.location.href = "/login";
                } else {
                  setReviewModal(true);
                }
              }}
              style={{
                padding:"10px 24px",
                background:`linear-gradient(135deg,${C.gold},${C.lightGold})`,
                border:"none", borderRadius:"8px", cursor:"pointer",
                color:C.navy, fontSize:"13px", fontWeight:"bold",
                fontFamily:"Georgia,serif",
                boxShadow:"0 4px 14px rgba(194,160,114,0.3)",
              }}
            >
              ✦ Leave a Review
            </button>
          </div>
          <div ref={revRef} className="reviews-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"22px"}}>
            {displayReviews.slice(0,6).map((r,i)=>(
              <div key={i} className="hover-lift" style={{background:C.white,borderRadius:"18px",padding:"28px 24px",boxShadow:"0 4px 20px rgba(17,34,80,0.06)",border:"1px solid rgba(17,34,80,0.06)",position:"relative",overflow:"hidden",animation:revVisible?`fadeUp .6s ease ${i*.1}s both`:"none"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,${C.gold},${C.lightGold})`,borderRadius:"18px 18px 0 0"}}/>
                <div style={{display:"flex",gap:"3px",marginBottom:"14px"}}>
                  {Array.from({length:5}).map((_,j)=><FiStar key={j} size={13} style={{fill:j<(r.rating||5)?C.gold:"none",color:j<(r.rating||5)?C.gold:C.shell}}/>)}
                </div>
                <p style={{fontSize:"13px",color:"rgba(17,34,80,0.62)",lineHeight:1.75,margin:"0 0 18px",fontStyle:"italic"}}>"{r.comment}"</p>
                <div style={{height:"1px",background:"rgba(17,34,80,0.06)",marginBottom:"14px"}}/>
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <div style={{width:"36px",height:"36px",borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},${C.lightGold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:"700",color:C.navy,fontFamily:"'Cormorant Garamond',Georgia,serif",flexShrink:0}}>
                    {r.student_name?r.student_name[0]:"S"}
                  </div>
                  <div>
                    <div style={{fontWeight:"700",color:C.navy,fontSize:"13px"}}>{r.student_name}</div>
                    <div style={{fontSize:"11px",color:C.muted,display:"flex",alignItems:"center",gap:"4px",marginTop:"2px"}}><FiBriefcase size={10}/>{r.company_name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section ref={ctaRef} className="section-pad" style={{padding:"96px 5%",background:`linear-gradient(135deg,${C.navy} 0%,${C.navyMid} 100%)`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(194,160,114,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(194,160,114,0.035) 1px,transparent 1px)`,backgroundSize:"60px 60px",pointerEvents:"none"}}/>
        <div style={{maxWidth:"680px",margin:"0 auto",textAlign:"center",position:"relative",zIndex:1,animation:ctaVisible?"fadeUp .7s ease both":"none"}}>
          <div style={{fontSize:"10px",color:C.gold,letterSpacing:"3px",marginBottom:"14px"}}>✦ JOIN TODAY</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(30px,5vw,54px)",fontWeight:"600",color:C.white,margin:"0 0 18px",lineHeight:1.15}}>
            Ready to Start Your<br/><span className="gold-text">Internship Journey?</span>
          </h2>
          <p style={{fontSize:"16px",color:"rgba(217,203,194,0.6)",lineHeight:1.8,maxWidth:"460px",margin:"0 auto 36px"}}>
            Join thousands of Algerian students and companies already using Stag.io to connect and succeed.
          </p>
          <div className="cta-btns" style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
            <button className="btn-hover" onClick={()=>window.location.href="/register"} style={{padding:"14px 32px",background:`linear-gradient(135deg,${C.gold},${C.lightGold})`,border:"none",borderRadius:"9px",cursor:"pointer",color:C.navy,fontSize:"14px",fontWeight:"700",fontFamily:"Georgia,serif",boxShadow:"0 8px 28px rgba(194,160,114,0.35)",display:"flex",alignItems:"center",gap:"8px"}}>
              <FiUser size={14}/> Create Free Account
            </button>
            <button className="btn-hover" onClick={()=>window.location.href="/login"} style={{padding:"14px 32px",background:"transparent",border:"1.5px solid rgba(245,240,233,0.22)",borderRadius:"9px",cursor:"pointer",color:"rgba(245,240,233,0.8)",fontSize:"14px",fontFamily:"Georgia,serif",display:"flex",alignItems:"center",gap:"8px",transition:"border-color .2s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(194,160,114,0.5)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(245,240,233,0.22)"}
            ><FiArrowRight size={14}/> Sign In</button>
          </div>
        </div>
      </section>

      {/* ══ REVIEW MODAL ══ */}
      {reviewModal && (
        <div style={{position:"fixed",inset:0,background:"rgba(17,34,80,0.5)",backdropFilter:"blur(6px)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
          <div className="review-modal-inner" style={{background:C.white,borderRadius:"20px",padding:"36px",width:"100%",maxWidth:"460px",boxShadow:"0 30px 80px rgba(17,34,80,0.25)",position:"relative",maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,${C.gold},${C.lightGold})`,borderRadius:"20px 20px 0 0"}}/>

            <div style={{fontSize:"10px",color:C.gold,letterSpacing:"2px",marginBottom:"6px"}}>✦ LEAVE A REVIEW</div>
            <h2 style={{fontSize:"20px",color:C.navy,margin:"0 0 24px",fontWeight:"bold"}}>Share Your Experience</h2>

            {reviewMsg && (
              <div style={{padding:"10px 14px",borderRadius:"8px",marginBottom:"16px",fontSize:"13px",
                background: reviewMsg.startsWith("✅") ? "#eafaf1" : "#fdf2f2",
                color:      reviewMsg.startsWith("✅") ? "#27AE60"  : "#e74c3c",
                border:     `1px solid ${reviewMsg.startsWith("✅") ? "#27AE60" : "#e74c3c"}`,
              }}>{reviewMsg}</div>
            )}

            <label style={{display:"block",fontSize:"11px",color:C.navy,letterSpacing:"1px",marginBottom:"6px",fontWeight:"bold"}}>COMPANY</label>
            <select
              value={reviewForm.company_id}
              onChange={e => setReviewForm({...reviewForm, company_id: e.target.value})}
              style={{width:"100%",padding:"11px 14px",border:"1.5px solid rgba(194,160,114,0.3)",borderRadius:"9px",fontSize:"13px",fontFamily:"Georgia,serif",color:C.navy,marginBottom:"16px",outline:"none"}}
            >
              <option value="">Select company</option>
              {myCompanies.filter(c => !c.has_reviewed).length > 0
                ? myCompanies.filter(c => !c.has_reviewed).map(c => (
                    <option key={c.company_id || c.id} value={c.company_id || c.id}>
                      {c.company_name} — {c.offer_title}
                    </option>
                  ))
                : <option disabled>
                    {myCompanies.length > 0 ? 'You have reviewed all your companies ✓' : 'No validated internships found'}
                  </option>
              }
            </select>

            <label style={{display:"block",fontSize:"11px",color:C.navy,letterSpacing:"1px",marginBottom:"6px",fontWeight:"bold"}}>RATING</label>
            <div style={{display:"flex",gap:"8px",marginBottom:"16px",flexWrap:"wrap"}}>
              {[1,2,3,4,5].map(n => (
                <div key={n} onClick={() => setReviewForm({...reviewForm, rating: n})}
                  style={{width:"36px",height:"36px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:"18px",
                    background: n <= reviewForm.rating ? `rgba(194,160,114,0.15)` : "rgba(0,0,0,0.04)",
                    border: `1.5px solid ${n <= reviewForm.rating ? C.gold : "rgba(0,0,0,0.08)"}`,
                  }}>⭐</div>
              ))}
            </div>

            <label style={{display:"block",fontSize:"11px",color:C.navy,letterSpacing:"1px",marginBottom:"6px",fontWeight:"bold"}}>YOUR COMMENT</label>
            <textarea
              value={reviewForm.comment}
              onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
              placeholder="Share your experience with this company..."
              rows={4}
              style={{width:"100%",padding:"11px 14px",border:"1.5px solid rgba(194,160,114,0.3)",borderRadius:"9px",fontSize:"13px",fontFamily:"Georgia,serif",color:C.navy,marginBottom:"20px",outline:"none",resize:"none",boxSizing:"border-box"}}
            />

            <div style={{display:"flex",gap:"10px"}}>
              <button onClick={() => setReviewModal(false)} style={{flex:1,padding:"11px",background:"none",border:"1.5px solid #ddd",borderRadius:"9px",cursor:"pointer",fontSize:"13px",fontFamily:"Georgia,serif"}}>Cancel</button>
              <button onClick={handleSubmitReview} style={{flex:2,padding:"11px",background:`linear-gradient(135deg,${C.gold},${C.lightGold})`,border:"none",borderRadius:"9px",cursor:"pointer",fontSize:"13px",fontWeight:"bold",color:C.navy,fontFamily:"Georgia,serif"}}>Submit Review</button>
            </div>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
}