import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   LOCATION → HOME PLANET
═══════════════════════════════════════════════════════════ */
function coordsToPlanet(lat, lon) {
  if (lat > 15  && lat < 72  && lon > -170 && lon < -52)  return { name:"Solara",     color:"#FFD166", glow:"#FF9A3C", region:"Sol Sector · North America",  emoji:"🌵" };
  if (lat > 35  && lat < 72  && lon > -12  && lon < 45)   return { name:"Terra Nova",  color:"#4FC3F7", glow:"#0288D1", region:"Nova Sector · Europe",          emoji:"🌿" };
  if (lat > 5   && lat < 72  && lon > 45   && lon < 150)  return { name:"Crystalis",   color:"#80DEEA", glow:"#00BCD4", region:"Crystal Sector · Asia",         emoji:"💎" };
  if (lat > -60 && lat < 15  && lon > -82  && lon < -34)  return { name:"Aquaria",     color:"#26C6DA", glow:"#00ACC1", region:"Aqua Sector · South America",   emoji:"🌊" };
  if (lat > -35 && lat < 38  && lon > -20  && lon < 52)   return { name:"Pyros",       color:"#FF7043", glow:"#E64A19", region:"Pyros Sector · Africa",         emoji:"🔥" };
  if (lat > -50 && lat < 0   && lon > 112  && lon < 180)  return { name:"Zephyros",    color:"#A5D6A7", glow:"#388E3C", region:"Zephyr Sector · Oceania",       emoji:"🌪️" };
  return                                                          { name:"Nebulos",     color:"#CE93D8", glow:"#9C27B0", region:"Nebula Sector · Deep Space",    emoji:"🌌" };
}

/* ═══════════════════════════════════════════════════════════
   STAR FIELD CANVAS
═══════════════════════════════════════════════════════════ */
function StarField({ warpLevel }) {
  const cvs = useRef(null);
  const stars = useRef([]);
  const raf = useRef(null);
  const warp = useRef(warpLevel);
  useEffect(() => { warp.current = warpLevel; }, [warpLevel]);

  useEffect(() => {
    const c = cvs.current;
    const ctx = c.getContext("2d");
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c.parentElement);

    stars.current = Array.from({ length: 650 }, () => ({
      x: Math.random() * (c.width||1400),
      y: Math.random() * (c.height||900),
      r: Math.random() * 1.5 + 0.25,
      b: Math.random(),
      col: Math.random() > 0.88 ? `hsl(${190+Math.random()*70},90%,82%)` : "#fff",
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = (t) => {
      const W = c.width, H = c.height, w = warp.current;
      ctx.fillStyle = w > 0.5 ? `rgba(3,5,16,${Math.max(0.07, 0.2-w*0.11)})` : "rgba(3,5,16,0.17)";
      ctx.fillRect(0, 0, W, H);

      stars.current.forEach(s => {
        if (w > 0.04) {
          const cx = W/2, cy = H/2;
          const dx = s.x-cx, dy = s.y-cy;
          const dist = Math.sqrt(dx*dx+dy*dy)||1;
          const angle = Math.atan2(dy, dx);
          const speed = w * 13 * (dist/(W*0.55));
          s.x += Math.cos(angle)*speed; s.y += Math.sin(angle)*speed;
          const streak = w * 26 * (dist/(W*0.55));
          ctx.strokeStyle = s.col; ctx.globalAlpha = Math.min(1, 0.45+w*0.55)*s.b;
          ctx.lineWidth = s.r*(0.5+w*0.6);
          ctx.beginPath(); ctx.moveTo(s.x,s.y);
          ctx.lineTo(s.x-Math.cos(angle)*streak, s.y-Math.sin(angle)*streak); ctx.stroke();
          ctx.globalAlpha = 1;
          if (s.x<0||s.x>W||s.y<0||s.y>H) { s.x=cx+(Math.random()-0.5)*80; s.y=cy+(Math.random()-0.5)*80; }
        } else {
          s.x += 0.02*s.b; if (s.x>W) s.x=0;
          const tw = 0.3+0.7*Math.abs(Math.sin(t*0.0007*s.b+s.phase));
          ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
          ctx.fillStyle = s.col; ctx.globalAlpha = tw*s.b; ctx.fill(); ctx.globalAlpha=1;
        }
      });
      raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf.current); ro.disconnect(); };
  }, []);

  return <canvas ref={cvs} style={{ position:"absolute", inset:0, width:"100%", height:"100%", display:"block" }} />;
}

/* ═══════════════════════════════════════════════════════════
   SPACESHIP
═══════════════════════════════════════════════════════════ */
function Ship({ glowColor = "#00d4ff" }) {
  return (
    <svg width="108" height="52" viewBox="0 0 108 52">
      <defs>
        <radialGradient id="eng" cx="30%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95"/>
          <stop offset="100%" stopColor={glowColor} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="hull" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#071428"/><stop offset="45%" stopColor="#1b3d70"/><stop offset="100%" stopColor="#0c2045"/>
        </linearGradient>
        <radialGradient id="ckpit" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.88"/>
          <stop offset="100%" stopColor="#040e25" stopOpacity="0.95"/>
        </radialGradient>
      </defs>
      {/* Exhaust */}
      <ellipse cx="9" cy="26" rx="10" ry="5.5" fill="url(#eng)" opacity="0.9">
        <animate attributeName="rx" values="10;18;10" dur="0.22s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="7" cy="26" rx="5.5" ry="2.5" fill="white" opacity="0.95">
        <animate attributeName="rx" values="5.5;11;5.5" dur="0.22s" repeatCount="indefinite"/>
      </ellipse>
      {/* Hull */}
      <path d="M17,26 Q29,10 70,20 Q88,23 96,26 Q88,29 70,32 Q29,42 17,26Z" fill="url(#hull)"/>
      {/* Wings */}
      <path d="M37,20 Q49,6 61,14 Q53,19 37,20Z" fill="#0e2550" stroke="#1a3d6e" strokeWidth="0.5"/>
      <path d="M37,32 Q49,46 61,38 Q53,33 37,32Z" fill="#0e2550" stroke="#1a3d6e" strokeWidth="0.5"/>
      {/* Cockpit */}
      <ellipse cx="72" cy="26" rx="13" ry="9" fill="url(#ckpit)"/>
      <ellipse cx="74" cy="23" rx="6" ry="4" fill={glowColor} opacity="0.32"/>
      {/* Hull lines */}
      <path d="M23,23 Q50,20 70,22" stroke={glowColor} strokeWidth="0.6" fill="none" opacity="0.5"/>
      <path d="M23,29 Q50,32 70,30" stroke={glowColor} strokeWidth="0.6" fill="none" opacity="0.5"/>
      {/* Nav lights */}
      <circle cx="61" cy="14" r="2.2" fill="#ff4455">
        <animate attributeName="opacity" values="1;0.15;1" dur="1.1s" repeatCount="indefinite"/>
      </circle>
      <circle cx="61" cy="38" r="2.2" fill="#22d36e">
        <animate attributeName="opacity" values="0.15;1;0.15" dur="1.1s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   PLANET
═══════════════════════════════════════════════════════════ */
function Planet({ color, glow, size, rings, label, style }) {
  return (
    <div style={{ position:"absolute", pointerEvents:"none", transform:"translate(-50%,-50%)", ...style }}>
      {rings && (
        <div style={{
          position:"absolute", left:"50%", top:"50%",
          width:size*2.7, height:size*0.42,
          border:`2px solid ${color}55`, borderRadius:"50%",
          transform:"translate(-50%,-50%) rotateX(77deg)",
          boxShadow:`0 0 14px ${color}35`,
        }}/>
      )}
      <div style={{
        width:size, height:size, borderRadius:"50%",
        background:`radial-gradient(circle at 32% 28%, ${color}f0, ${glow}bb)`,
        boxShadow:`0 0 ${size*0.55}px ${glow}90, 0 0 ${size*1.1}px ${glow}35`,
        position:"relative",
      }}>
        <div style={{ position:"absolute", width:"30%", height:"20%", background:"rgba(255,255,255,0.13)", borderRadius:"50%", top:"17%", left:"17%", filter:"blur(5px)" }}/>
      </div>
      {label && (
        <div style={{ textAlign:"center", marginTop:9, fontFamily:"Orbitron,monospace", fontSize:11, color, textShadow:`0 0 12px ${glow}`, letterSpacing:"0.2em", whiteSpace:"nowrap" }}>{label}</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BLACK HOLE
═══════════════════════════════════════════════════════════ */
function BlackHole({ scale }) {
  const s = 75 * scale;
  return (
    <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none", zIndex:18 }}>
      {[{r:2.3,c:"#FF9500",d:"1.6s"},{r:1.75,c:"#FF6B35",d:"2.4s"},{r:1.35,c:"#FFcc02",d:"3.2s"}].map((dk,i)=>(
        <div key={i} style={{
          position:"absolute", left:"50%", top:"50%",
          width:s*dk.r, height:s*dk.r*0.32,
          transform:"translate(-50%,-50%) rotateX(78deg)",
          borderRadius:"50%",
          background:`radial-gradient(ellipse,transparent 36%,${dk.c}${i===0?"65":"42"} 54%,transparent 72%)`,
          animation:`spinDisk ${dk.d} linear infinite${i%2?" reverse":""}`,
        }}/>
      ))}
      <div style={{
        position:"absolute", left:"50%", top:"50%", width:s*1.2, height:s*1.2,
        transform:"translate(-50%,-50%)", borderRadius:"50%",
        border:"1.5px solid rgba(168,85,247,0.72)",
        boxShadow:"0 0 28px rgba(168,85,247,0.55), inset 0 0 28px rgba(168,85,247,0.18)",
      }}/>
      <div style={{
        position:"absolute", left:"50%", top:"50%", width:s, height:s,
        transform:"translate(-50%,-50%)", borderRadius:"50%",
        background:"black",
        boxShadow:`0 0 ${s*0.75}px #a855f7, 0 0 ${s*1.5}px #7c3aed60`,
      }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NEBULA
═══════════════════════════════════════════════════════════ */
function Nebula({ color, size=380, style }) {
  return (
    <div style={{
      position:"absolute", width:size, height:size*0.55, borderRadius:"50%", pointerEvents:"none",
      background:`radial-gradient(ellipse,${color}2e 0%,${color}0f 44%,transparent 68%)`,
      filter:`blur(${size*0.09}px)`, transform:"translate(-50%,-50%)", ...style,
    }}/>
  );
}

/* ═══════════════════════════════════════════════════════════
   CAPTION
═══════════════════════════════════════════════════════════ */
function Caption({ text, visible }) {
  return (
    <div style={{
      position:"absolute", bottom:"8%", left:0, right:0, display:"flex", justifyContent:"center",
      zIndex:60, pointerEvents:"none", opacity:visible?1:0, transition:"opacity 0.42s ease",
    }}>
      <div style={{
        background:"rgba(3,5,16,0.84)", border:"1px solid rgba(0,212,255,0.38)", borderRadius:8,
        padding:"0.65rem 2rem", fontFamily:"Orbitron,monospace",
        fontSize:"clamp(0.58rem,1.3vw,0.8rem)", color:"#00d4ff",
        textShadow:"0 0 18px rgba(0,212,255,0.78)", letterSpacing:"0.17em", backdropFilter:"blur(12px)",
      }}>{text}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
export default function StarportAuth() {
  const [mode,setMode]     = useState("login");
  const [name,setName]     = useState("");
  const [email,setEmail]   = useState("");
  const [pass,setPass]     = useState("");
  const [errors,setErrors] = useState({});
  const [planet,setPlanet] = useState(null);
  const [locDone,setLocDone]= useState(false);

  // journey
  const [warp,setWarp]     = useState(0);
  const [phase,setPhase]   = useState("idle");
  const [sx,setSx]         = useState(50);
  const [sy,setSy]         = useState(85);
  const [ss,setSs]         = useState(0.7);
  const [sr,setSr]         = useState(-12);
  const [so,setSo]         = useState(0);
  const [bhScale,setBhScale]=useState(0);
  const [flash,setFlash]   = useState("transparent");
  const [sceneO,setSceneO] = useState(1);
  const [cap,setCap]       = useState("");
  const [capV,setCapV]     = useState(false);
  const [landed,setLanded] = useState(false);
  const [shipGlow,setShipGlow]=useState("#00d4ff");

  // geolocation
  useEffect(()=>{
    const go=(lat,lon)=>{ setPlanet(coordsToPlanet(lat,lon)); setLocDone(true); };
    if(navigator.geolocation) navigator.geolocation.getCurrentPosition(
      p=>go(p.coords.latitude,p.coords.longitude), ()=>go(51.5,-0.1)
    ); else go(51.5,-0.1);
  },[]);

  const sleep = ms=>new Promise(r=>setTimeout(r,ms));
  const say = useCallback(async(txt,dur=2000)=>{
    setCap(txt); setCapV(true); await sleep(dur); setCapV(false); await sleep(420);
  },[]);
  const flashFn = async(col,dur=130)=>{ setFlash(col); await sleep(dur); setFlash("transparent"); };

  /* ── JOURNEY ── */
  const journey = useCallback(async(udata)=>{
    const p = planet||{name:"Terra Nova",color:"#4FC3F7",glow:"#0288D1",emoji:"🌿"};
    setPhase("rising"); setSx(50); setSy(82); setSs(0.65); setSr(-10); setSo(1); setShipGlow("#00d4ff");
    await say("⚡  IDENTITY VERIFIED — BOARDING COMPLETE",1700);
    setSy(58); setSs(0.95); setSr(0); setWarp(8); await sleep(400);
    await say("🚀  ENGINES IGNITED — DEPARTING NEXUS STATION",1800);
    setPhase("travel"); setWarp(38); setSx(63); setSy(40); setSs(1.05);
    await say("🌌  CLEARING ORBITAL PERIMETER — WARP IN 3…2…1",2000);
    setPhase("planets"); setWarp(125); setSx(50); setSy(40);
    await say("🪐  CROSSING THE OUTER PLANETARY RING",2200);
    setWarp(290); setSx(48); setSy(44); setSs(0.9);
    await say("⚡  SPACETIME FOLD INITIATED — WORMHOLE LOCKED",1800);
    setPhase("blackhole");
    for(let i=0;i<=32;i++){ setBhScale(i/32); await sleep(45); }
    await say("🕳️   APPROACHING EVENT HORIZON — BRACE FOR TRANSIT",1900);
    setSx(50); setSy(50); setSs(0.15); setSr(900); setSo(0.08); setWarp(500);
    await sleep(480);
    await flashFn("rgba(168,85,247,0.88)",140);
    setPhase("tunnel"); await flashFn("#000",180);
    await say("╌╌╌╌╌╌  SPACETIME BREACH  ╌╌╌╌╌╌",1300);
    await flashFn("rgba(255,255,255,0.97)",320);
    setFlash("rgba(0,0,0,0.92)");
    setBhScale(0); setWarp(0);
    setPhase("emerge"); setSx(11); setSy(50); setSs(0.32); setSr(0); setSo(1); setWarp(65); setShipGlow(p.color);
    await sleep(300); setFlash("transparent");
    await say("🌠  TRANSIT COMPLETE — EMERGING INTO DESTINATION SYSTEM",2000);
    setPhase("land"); setWarp(20); setSx(34); setSy(52); setSs(1.1);
    await say(`🌍  APPROACHING ${p.name.toUpperCase()} — BEGINNING DESCENT`,2200);
    setSx(60); setSy(57); setSs(0.42); setSr(9); setSo(0.65); await sleep(650);
    await say(`⭐  WELCOME HOME, ${(udata.name||"TRAVELER").split(" ")[0].toUpperCase()} — SURFACE DOCKING ENGAGED`,2400);
    setPhase("done"); setSceneO(0); await sleep(900); setLanded(true);
  },[planet,say]);

  /* ── SUBMIT ── */
  const submit = ()=>{
    const e={};
    if(!email.includes("@")) e.email="Invalid comm frequency";
    if(pass.length<4) e.pass="Access code too short";
    if(mode==="signup"&&!name.trim()) e.name="Identity designation required";
    if(Object.keys(e).length){ setErrors(e); return; }
    setErrors({});
    journey({ name: mode==="signup"?name.trim():email.split("@")[0], email });
  };

  const inp=(err)=>({
    width:"100%", background:"rgba(0,0,0,0.52)",
    border:`1px solid ${err?"#ef4444":"rgba(0,212,255,0.22)"}`,
    color:"#e2eaff", padding:"0.82rem 1.1rem", borderRadius:6,
    fontFamily:"'Share Tech Mono',monospace", fontSize:"0.88rem",
    outline:"none", letterSpacing:"0.04em",
    transition:"border-color 0.2s,box-shadow 0.2s", boxSizing:"border-box",
  });

  const isOn = phase!=="idle";
  const showPlanets  = ["planets","blackhole"].includes(phase);
  const showBH       = ["blackhole","tunnel"].includes(phase);
  const showNebulas  = ["travel","planets","blackhole","emerge"].includes(phase);
  const showDest     = ["emerge","land","done"].includes(phase);

  /* ── LANDED ── */
  if(landed){
    const p=planet||{name:"Terra Nova",color:"#4FC3F7",glow:"#0288D1",emoji:"🌿"};
    return(
      <div style={{ position:"relative",width:"100%",height:"100vh",background:"#030510",overflow:"hidden",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"Orbitron,monospace" }}>
        <StarField warpLevel={0}/>
        <div style={{ position:"relative",zIndex:10,textAlign:"center",animation:"fadeInUp 1s ease" }}>
          <div style={{ fontSize:72,marginBottom:16,filter:`drop-shadow(0 0 20px ${p.glow})` }}>{p.emoji}</div>
          <div style={{ fontSize:"clamp(1.2rem,4vw,2.2rem)",fontWeight:900,color:p.color,textShadow:`0 0 35px ${p.glow}`,letterSpacing:"0.12em",marginBottom:10 }}>{p.name}</div>
          <div style={{ fontSize:"0.72rem",color:"rgba(0,212,255,0.55)",letterSpacing:"0.22em",marginBottom:50 }}>{p.region}</div>
          <div style={{ display:"inline-block",background:"rgba(34,197,94,0.12)",border:"1px solid rgba(34,197,94,0.4)",borderRadius:8,padding:"0.7rem 2rem",fontFamily:"'Share Tech Mono',monospace",fontSize:"0.75rem",color:"#22c55e",letterSpacing:"0.12em" }}>
            ✓ SURFACE DOCKING COMPLETE — LAUNCHING NEXUS DASHBOARD
          </div>
        </div>
      </div>
    );
  }

  return(
    <div style={{ position:"relative",width:"100%",height:"100vh",background:"#030510",overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&family=Exo+2:wght@300;400;500&display=swap');
        @keyframes spinDisk{from{transform:translate(-50%,-50%) rotateX(78deg) rotateZ(0deg)}to{transform:translate(-50%,-50%) rotateX(78deg) rotateZ(360deg)}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
        @keyframes orbitSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes floatY{0%,100%{transform:translate(-50%,-50%) translateY(0px)}50%{transform:translate(-50%,-50%) translateY(-13px)}}
        @keyframes floatShip{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes glowPulse{0%,100%{opacity:0.55}50%{opacity:1}}
        *{box-sizing:border-box}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 1000px rgba(0,0,0,0.55) inset!important;-webkit-text-fill-color:#e2eaff!important;}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(0,212,255,0.28)}
        @media(max-width:820px){.auth-left{display:none!important}}
      `}</style>

      {/* Canvas stars */}
      <StarField warpLevel={warp}/>

      {/* Scanlines */}
      <div style={{ position:"absolute",inset:0,zIndex:1,pointerEvents:"none",
        background:"repeating-linear-gradient(0deg,rgba(0,0,0,0.022) 0px,rgba(0,0,0,0.022) 1px,transparent 1px,transparent 4px)" }}/>

      {/* Ambient nebulas (always on) */}
      <div style={{ position:"absolute",inset:0,zIndex:2,pointerEvents:"none" }}>
        <div style={{ position:"absolute",left:"10%",top:"15%",width:"42vw",height:"42vw",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(168,85,247,0.05) 0%,transparent 68%)",filter:"blur(70px)" }}/>
        <div style={{ position:"absolute",right:"6%",bottom:"10%",width:"36vw",height:"36vw",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(0,212,255,0.042) 0%,transparent 68%)",filter:"blur(60px)" }}/>
        <div style={{ position:"absolute",left:"58%",top:"52%",width:"28vw",height:"28vw",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(255,120,0,0.028) 0%,transparent 70%)",filter:"blur(50px)" }}/>
      </div>

      {/* ── SCENE ── */}
      <div style={{ position:"absolute",inset:0,zIndex:5,opacity:sceneO,transition:"opacity 1.1s ease",pointerEvents:"none" }}>

        {/* Nebulas */}
        {showNebulas&&<>
          <Nebula color="#a855f7" size={430} style={{ left:"17%",top:"22%",zIndex:3 }}/>
          <Nebula color="#00d4ff" size={360} style={{ left:"80%",top:"60%",zIndex:3 }}/>
          <Nebula color="#ff6b35" size={270} style={{ left:"54%",top:"82%",zIndex:3 }}/>
          <Nebula color="#22c55e" size={220} style={{ left:"90%",top:"18%",zIndex:3 }}/>
          <Nebula color="#ffd166" size={200} style={{ left:"37%",top:"10%",zIndex:3 }}/>
        </>}

        {/* Planet flyby */}
        {showPlanets&&<>
          <Planet color="#FF7043" glow="#E64A19" size={70}  label="PYROS"     style={{ left:"13%",top:"19%",zIndex:6,animation:"floatY 4s ease-in-out infinite" }}/>
          <Planet color="#26C6DA" glow="#00ACC1" size={92}  label="AQUARIA"   style={{ left:"83%",top:"27%",zIndex:6,animation:"floatY 5.2s ease-in-out 0.6s infinite" }}/>
          <Planet color="#CE93D8" glow="#9C27B0" size={128} label="NEBULOS"   style={{ left:"69%",top:"74%",zIndex:6,animation:"floatY 6.1s ease-in-out 1s infinite" }} rings/>
          <Planet color="#FFD54F" glow="#FFA000" size={60}  label="SOLARA"    style={{ left:"25%",top:"72%",zIndex:6,animation:"floatY 4.6s ease-in-out 0.3s infinite" }}/>
          <Planet color="#80DEEA" glow="#00BCD4" size={48}  label="CRYSTALIS" style={{ left:"48%",top:"12%",zIndex:6,animation:"floatY 5.7s ease-in-out 0.8s infinite" }}/>
        </>}

        {/* Black hole */}
        {showBH&&(
          <div style={{ position:"absolute",inset:0,zIndex:15,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <BlackHole scale={bhScale}/>
          </div>
        )}

        {/* Destination planet */}
        {showDest&&planet&&(
          <Planet color={planet.color} glow={planet.glow} size={200} label={planet.name}
            rings={planet.name==="Nebulos"}
            style={{ left:"63%",top:"50%",zIndex:8,animation:"floatY 7s ease-in-out infinite" }}
          />
        )}

        {/* Ship */}
        {isOn&&(
          <div style={{
            position:"absolute",
            left:`${sx}%`, top:`${sy}%`,
            transform:`translate(-50%,-50%) scale(${ss}) rotate(${sr}deg)`,
            opacity:so,
            zIndex:22,
            filter:`drop-shadow(0 0 18px ${shipGlow}) drop-shadow(0 0 45px ${shipGlow}85)`,
            transition: phase==="tunnel"
              ? "transform 0.85s cubic-bezier(0.7,0,1,0.5),opacity 0.4s"
              : "left 1.2s cubic-bezier(0.4,0,0.2,1),top 1.2s cubic-bezier(0.4,0,0.2,1),transform 1.2s cubic-bezier(0.4,0,0.2,1),opacity 0.6s",
            animation:(phase==="rising"||phase==="travel")?"floatShip 2.6s ease-in-out infinite":"none",
          }}>
            <Ship glowColor={shipGlow}/>
          </div>
        )}
      </div>

      {/* Flash */}
      <div style={{ position:"absolute",inset:0,zIndex:55,background:flash,transition:"background 0.11s",pointerEvents:"none" }}/>

      {/* Caption */}
      <Caption text={cap} visible={capV}/>

      {/* ── AUTH FORM ── */}
      {!isOn&&(
        <div style={{ position:"absolute",inset:0,zIndex:30,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem" }}>

          {/* Left branding */}
          <div className="auth-left" style={{ flex:1,maxWidth:480,padding:"0 3rem 0 2rem",display:"flex",flexDirection:"column",animation:"fadeInUp 0.9s ease" }}>
            {/* Logo orb */}
            <div style={{ width:68,height:68,borderRadius:"50%",background:"conic-gradient(from 0deg,#00d4ff,#a855f7,#00d4ff)",animation:"orbitSpin 6s linear infinite",boxShadow:"0 0 26px rgba(0,212,255,0.42)",position:"relative",marginBottom:"1.8rem" }}>
              <div style={{ position:"absolute",inset:6,borderRadius:"50%",background:"#030510" }}/>
              <div style={{ position:"absolute",inset:16,borderRadius:"50%",background:"radial-gradient(circle at 40% 35%,#00d4ff,#a855f7)" }}/>
            </div>
            <h1 style={{ fontFamily:"Orbitron,monospace",fontWeight:900,fontSize:"clamp(1.7rem,3vw,2.8rem)",lineHeight:1.06,color:"#e2eaff",marginBottom:"1.2rem" }}>
              <span style={{ color:"#00d4ff",textShadow:"0 0 32px rgba(0,212,255,0.55)" }}>STARPORT</span><br/>NEXUS
            </h1>
            <p style={{ fontFamily:"'Exo 2',sans-serif",fontWeight:300,fontSize:"1rem",color:"rgba(123,146,184,0.82)",lineHeight:1.88,marginBottom:"2rem",maxWidth:340 }}>
              The galaxy's premier intergalactic travel network — connecting civilizations across 3 galaxies, 8 planetary systems, and 2 active wormhole corridors.
            </p>
            <div style={{ display:"flex",gap:"1.8rem",marginBottom:"2rem" }}>
              {[["3","Galaxies"],["8","Planets"],["2","Wormholes"]].map(([n,l])=>(
                <div key={l}>
                  <div style={{ fontFamily:"Orbitron,monospace",fontSize:"1.6rem",fontWeight:700,color:"#00d4ff",textShadow:"0 0 16px rgba(0,212,255,0.5)" }}>{n}</div>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"0.62rem",color:"rgba(123,146,184,0.5)",letterSpacing:"0.12em" }}>{l.toUpperCase()}</div>
                </div>
              ))}
            </div>
            {planet&&locDone&&(
              <div style={{ background:"rgba(0,0,0,0.42)",border:`1px solid ${planet.color}32`,borderRadius:10,padding:"1rem 1.2rem",display:"flex",alignItems:"center",gap:"1rem",animation:"fadeInUp 0.7s ease 0.3s both" }}>
                <div style={{ width:44,height:44,borderRadius:"50%",flexShrink:0,background:`radial-gradient(circle at 33% 28%,${planet.color}f0,${planet.glow}bb)`,boxShadow:`0 0 20px ${planet.glow}80` }}/>
                <div>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"0.58rem",color:"rgba(123,146,184,0.45)",letterSpacing:"0.12em",marginBottom:3 }}>HOME PLANET DETECTED</div>
                  <div style={{ fontFamily:"Orbitron,monospace",fontSize:"0.85rem",color:planet.color,textShadow:`0 0 10px ${planet.glow}`,marginBottom:2 }}>{planet.name}</div>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",color:"rgba(123,146,184,0.42)" }}>{planet.region}</div>
                </div>
                <div style={{ marginLeft:"auto",width:7,height:7,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 8px #22c55e",flexShrink:0,animation:"glowPulse 1.6s ease-in-out infinite" }}/>
              </div>
            )}
          </div>

          {/* Form card */}
          <div style={{ width:"100%",maxWidth:432,background:"rgba(4,9,22,0.94)",border:"1px solid rgba(0,212,255,0.2)",borderRadius:14,padding:"clamp(1.4rem,4vw,2.4rem)",backdropFilter:"blur(24px)",boxShadow:"0 0 80px rgba(0,212,255,0.065),0 0 160px rgba(168,85,247,0.04)",position:"relative",overflow:"hidden",animation:"fadeInUp 0.75s ease" }}>

            {/* Corner brackets */}
            {[[{top:0,left:0},{borderTop:"1px solid rgba(0,212,255,0.55)",borderLeft:"1px solid rgba(0,212,255,0.55)"}],
              [{top:0,right:0},{borderTop:"1px solid rgba(0,212,255,0.55)",borderRight:"1px solid rgba(0,212,255,0.55)"}],
              [{bottom:0,left:0},{borderBottom:"1px solid rgba(0,212,255,0.55)",borderLeft:"1px solid rgba(0,212,255,0.55)"}],
              [{bottom:0,right:0},{borderBottom:"1px solid rgba(0,212,255,0.55)",borderRight:"1px solid rgba(0,212,255,0.55)"}]
            ].map(([pos,brd],i)=>(
              <div key={i} style={{ position:"absolute",...pos,width:18,height:18,...brd }}/>
            ))}
            {/* Top shimmer */}
            <div style={{ position:"absolute",top:0,left:"18%",right:"18%",height:1,background:"linear-gradient(90deg,transparent,rgba(0,212,255,0.52),transparent)" }}/>

            {/* Logo */}
            <div style={{ textAlign:"center",marginBottom:"1.75rem" }}>
              <div style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:52,height:52,borderRadius:"50%",background:"conic-gradient(from 0deg,#00d4ff,#a855f7,#00d4ff)",animation:"orbitSpin 7s linear infinite",boxShadow:"0 0 22px rgba(0,212,255,0.42)",marginBottom:"0.9rem",position:"relative" }}>
                <div style={{ width:34,height:34,background:"#030510",borderRadius:"50%" }}/>
              </div>
              <div style={{ fontFamily:"Orbitron,monospace",fontSize:"0.7rem",color:"rgba(0,212,255,0.78)",letterSpacing:"0.28em",marginBottom:4 }}>STARPORT NEXUS</div>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"0.58rem",color:"rgba(123,146,184,0.38)",letterSpacing:"0.1em" }}>INTERGALACTIC TRAVEL SYSTEM v4.7</div>
            </div>

            {/* Tabs */}
            <div style={{ display:"flex",background:"rgba(0,0,0,0.48)",borderRadius:8,padding:3,border:"1px solid rgba(255,255,255,0.038)",marginBottom:"1.55rem" }}>
              {["login","signup"].map(m=>(
                <button key={m} onClick={()=>{setMode(m);setErrors({});}} style={{
                  flex:1,padding:"0.56rem",border:"none",cursor:"pointer",borderRadius:6,
                  fontFamily:"Orbitron,monospace",fontSize:"0.63rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",
                  background:mode===m?"rgba(0,212,255,0.13)":"transparent",
                  color:mode===m?"#00d4ff":"rgba(123,146,184,0.48)",
                  boxShadow:mode===m?"0 0 14px rgba(0,212,255,0.18)":"none",
                  transition:"all 0.22s",
                }}>{m==="login"?"⚡ Access System":"✦ New Identity"}</button>
              ))}
            </div>

            {/* Planet badge in form (mobile) */}
            {planet&&locDone&&(
              <div style={{ display:"flex",alignItems:"center",gap:"0.7rem",background:"rgba(0,0,0,0.38)",border:`1px solid ${planet.color}26`,borderRadius:8,padding:"0.6rem 0.9rem",marginBottom:"1.35rem" }}>
                <div style={{ width:26,height:26,borderRadius:"50%",flexShrink:0,background:`radial-gradient(circle at 33% 28%,${planet.color}f0,${planet.glow}bb)`,boxShadow:`0 0 12px ${planet.glow}70` }}/>
                <div style={{ minWidth:0,flex:1 }}>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"0.57rem",color:"rgba(123,146,184,0.42)",letterSpacing:"0.1em" }}>HOME PLANET</div>
                  <div style={{ fontFamily:"Orbitron,monospace",fontSize:"0.73rem",color:planet.color,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{planet.name} — {planet.region}</div>
                </div>
                <div style={{ width:6,height:6,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 7px #22c55e",flexShrink:0 }}/>
              </div>
            )}

            {/* Fields */}
            <div style={{ display:"flex",flexDirection:"column",gap:"0.92rem" }}>
              {mode==="signup"&&(
                <div>
                  <label style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",color:"rgba(123,146,184,0.52)",letterSpacing:"0.13em",display:"block",marginBottom:"0.36rem" }}>IDENTITY DESIGNATION</label>
                  <input type="text" placeholder="Your name, traveler..." value={name} onChange={e=>setName(e.target.value)} style={inp(errors.name)}
                    onFocus={e=>{e.target.style.borderColor="#00d4ff";e.target.style.boxShadow="0 0 0 2px rgba(0,212,255,0.1)"}}
                    onBlur={e=>{e.target.style.borderColor=errors.name?"#ef4444":"rgba(0,212,255,0.22)";e.target.style.boxShadow="none"}}/>
                  {errors.name&&<div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",color:"#ef4444",marginTop:"0.28rem" }}>⚠ {errors.name}</div>}
                </div>
              )}
              <div>
                <label style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",color:"rgba(123,146,184,0.52)",letterSpacing:"0.13em",display:"block",marginBottom:"0.36rem" }}>COMM FREQUENCY</label>
                <input type="email" placeholder="your@frequency.space" value={email} onChange={e=>setEmail(e.target.value)} style={inp(errors.email)}
                  onFocus={e=>{e.target.style.borderColor="#00d4ff";e.target.style.boxShadow="0 0 0 2px rgba(0,212,255,0.1)"}}
                  onBlur={e=>{e.target.style.borderColor=errors.email?"#ef4444":"rgba(0,212,255,0.22)";e.target.style.boxShadow="none"}}/>
                {errors.email&&<div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",color:"#ef4444",marginTop:"0.28rem" }}>⚠ {errors.email}</div>}
              </div>
              <div>
                <label style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",color:"rgba(123,146,184,0.52)",letterSpacing:"0.13em",display:"block",marginBottom:"0.36rem" }}>ACCESS CODE</label>
                <input type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&submit()} style={{...inp(errors.pass),letterSpacing:"0.22em"}}
                  onFocus={e=>{e.target.style.borderColor="#00d4ff";e.target.style.boxShadow="0 0 0 2px rgba(0,212,255,0.1)"}}
                  onBlur={e=>{e.target.style.borderColor=errors.pass?"#ef4444":"rgba(0,212,255,0.22)";e.target.style.boxShadow="none"}}/>
                {errors.pass&&<div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",color:"#ef4444",marginTop:"0.28rem" }}>⚠ {errors.pass}</div>}
              </div>

              {/* Launch button */}
              <button onClick={submit} style={{
                width:"100%",marginTop:"0.25rem",padding:"0.9rem",
                background:"linear-gradient(135deg,rgba(0,212,255,0.15),rgba(168,85,247,0.1))",
                border:"1px solid rgba(0,212,255,0.46)",borderRadius:8,
                fontFamily:"Orbitron,monospace",fontSize:"0.73rem",fontWeight:700,
                letterSpacing:"0.17em",color:"#00d4ff",cursor:"pointer",textTransform:"uppercase",
                boxShadow:"0 0 22px rgba(0,212,255,0.08)",transition:"all 0.22s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 0 36px rgba(0,212,255,0.36)";e.currentTarget.style.borderColor="rgba(0,212,255,0.8)";e.currentTarget.style.background="linear-gradient(135deg,rgba(0,212,255,0.22),rgba(168,85,247,0.16))"}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 0 22px rgba(0,212,255,0.08)";e.currentTarget.style.borderColor="rgba(0,212,255,0.46)";e.currentTarget.style.background="linear-gradient(135deg,rgba(0,212,255,0.15),rgba(168,85,247,0.1))"}}>
                {mode==="login"?"⚡  INITIATE LAUNCH SEQUENCE":"🚀  BEGIN REGISTRATION PROTOCOL"}
              </button>

              {/* Demo */}
              <button style={{
                background:"none",border:"1px solid rgba(255,255,255,0.055)",borderRadius:6,
                padding:"0.56rem",color:"rgba(123,146,184,0.35)",
                fontFamily:"'Share Tech Mono',monospace",fontSize:"0.62rem",letterSpacing:"0.1em",
                cursor:"pointer",transition:"all 0.2s",width:"100%",
              }}
              onMouseEnter={e=>{e.currentTarget.style.color="rgba(123,146,184,0.72)";e.currentTarget.style.borderColor="rgba(255,255,255,0.12)"}}
              onMouseLeave={e=>{e.currentTarget.style.color="rgba(123,146,184,0.35)";e.currentTarget.style.borderColor="rgba(255,255,255,0.055)"}}
              onClick={()=>journey({name:"Commander Nova",email:"demo@nexus.space"})}>
                ◎ DEMO ACCESS — NO CREDENTIALS REQUIRED
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
