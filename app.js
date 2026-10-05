const C={arduino:["Arduino / microcontroller board",25,"Boards"],esp:["ESP8266 / ESP32 board",10,"Boards"],phone:["Old smartphone",130,"Devices"],fan:["Computer fan",30,"Devices"],charger:["USB charger or cable",60,"Devices"],speaker:["Speaker",40,"Audio and display"],buzzer:["Buzzer",5,"Audio and display"],lcd:["LCD display",25,"Audio and display"],led:["LED",1,"Basics"],resistor:["Resistor",.5,"Basics"],button:["Push button",3,"Basics"],wires:["Jumper wires (set)",10,"Basics"],board:["Breadboard",40,"Basics"],ldr:["Light sensor (LDR)",1,"Sensors"],temp:["Temperature sensor",2,"Sensors"],ultra:["Ultrasonic sensor",9,"Sensors"],ir:["IR sensor",3,"Sensors"],pir:["Motion (PIR) sensor",6,"Sensors"],cam:["Camera module",8,"Sensors"],motor:["DC motor",25,"Motors and power"],servo:["Servo motor",12,"Motors and power"],wheel:["Wheel",20,"Motors and power"],relay:["Relay module",15,"Motors and power"],battery:["Battery or battery pack",45,"Motors and power"],solar:["Solar panel",40,"Motors and power"]};
const P=[
{n:"Smart night lamp",d:"Switches on by itself when the room gets dark.",l:"Easy",r:{arduino:1,ldr:1,led:3,resistor:3}},
{n:"Old-phone security camera",d:"Turns a retired smartphone into a home camera.",l:"Easy",r:{phone:1,charger:1}},
{n:"Desk fan",d:"A quiet fan powered by a battery pack.",l:"Easy",r:{fan:1,battery:1,button:1}},
{n:"Reaction speed game",d:"Press the button as soon as the LED lights up.",l:"Easy",r:{arduino:1,led:4,button:2,buzzer:1,resistor:4}},
{n:"Door alarm",d:"Beeps when the motion sensor detects someone.",l:"Easy",r:{pir:1,buzzer:1,battery:1,wires:1}},
{n:"Portable speaker box",d:"Reuses speakers and a charger for a portable speaker.",l:"Medium",r:{speaker:2,battery:1,charger:1,wires:1}},
{n:"Solar phone charger",d:"Charges a phone from sunlight.",l:"Medium",r:{solar:1,battery:2,charger:1}},
{n:"Mini weather station",d:"Shows the temperature on a screen.",l:"Medium",r:{esp:1,temp:1,lcd:1,wires:1,board:1}},
{n:"Automatic plant waterer",d:"Runs a small pump through a relay.",l:"Medium",r:{arduino:1,relay:1,motor:1,wires:1}},
{n:"Pan and tilt camera",d:"A camera that turns left and right on servos.",l:"Medium",r:{servo:2,cam:1,arduino:1}},
{n:"Obstacle-avoiding car",d:"A small car that steers around objects.",l:"Hard",r:{arduino:1,ultra:1,motor:2,wheel:2,battery:1}},
{n:"Line-follower robot",d:"A robot that follows a black line on the floor.",l:"Hard",r:{arduino:1,motor:2,ir:2,wheel:2,battery:1,wires:1}}];
const SAMPLE={arduino:1,led:5,resistor:6,ldr:1,button:2,buzzer:1,battery:2,wires:2,motor:2,wheel:2,charger:1,phone:1,fan:1,speaker:2,temp:1};
const E={arduino:"🧠",esp:"📡",phone:"📱",fan:"🌀",charger:"🔌",speaker:"🔊",buzzer:"🔔",lcd:"🖥️",led:"💡",resistor:"〰️",button:"🔘",wires:"🧵",board:"🧱",ldr:"☀️",temp:"🌡️",ultra:"🦇",ir:"👁️",pir:"🚶",cam:"📷",motor:"⚙️",servo:"🦾",wheel:"🛞",relay:"🎛️",battery:"🔋",solar:"🌞"};
const PE=["🌙","📹","🌬️","⚡","🚪","🎵","☀️","🌦️","🪴","🎥","🚗","🤖"];
let inv={},built=[],cat="All",pfil="all",term="";
try{inv=JSON.parse(localStorage.getItem("sl_inv")||"{}");built=JSON.parse(localStorage.getItem("sl_built")||"[]")}catch(e){}
const $=id=>document.getElementById(id);
const save=()=>{try{localStorage.setItem("sl_inv",JSON.stringify(inv));localStorage.setItem("sl_built",JSON.stringify(built))}catch(e){}};
const toast=m=>{const t=$("toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2600)};
const fmt=g=>g>=1000?(g/1000).toFixed(2)+" kg":Math.round(g)+" g";
const tot=()=>Object.values(inv).reduce((a,b)=>a+b,0);
const CC={"Boards":"#22E4FF","Devices":"#FFE600","Audio and display":"#FF7AC6","Basics":"#B8FF3C","Sensors":"#B79BFF","Motors and power":"#FF9A3D"};
const LV=[["Sprout 🌱",0],["Spark ⚡",300],["Hacker 🛠️",1000],["Legend 👑",2500]];
function score(p){let need=0,have=0,g=0;const rows=[];
  for(const [id,q] of Object.entries(p.r)){const h=Math.min(inv[id]||0,q);need+=q;have+=h;g+=h*C[id][1];rows.push({id,q,h})}
  return{pct:Math.round(have/need*100),need,have,g,rows,miss:need-have}}
const scored=()=>P.map((p,i)=>({p,i,s:score(p)})).sort((a,b)=>b.s.pct-a.s.pct||a.p.n.localeCompare(b.p.n));
function fly(el,em){const t=$("tray").getBoundingClientRect(),r=el.getBoundingClientRect(),s=document.createElement("span");s.className="fly";s.textContent=em;s.style.left=r.left+r.width/2+"px";s.style.top=r.top+r.height/2+"px";document.body.append(s);
  s.animate([{transform:"translate(-50%,-50%) scale(1.3)"},{transform:`translate(${t.left+50-r.left-r.width/2}px,${t.top-r.top-r.height/2}px) scale(.4) rotate(360deg)`,opacity:.4}],{duration:650,easing:"cubic-bezier(.5,-.3,.7,1)"}).onfinish=()=>s.remove()}
function confetti(){for(let i=0;i<34;i++){const s=document.createElement("span");s.className="cf";s.textContent=["🎉","⚡","♻️","✨","🔥"][i%5];s.style.cssText=`left:${Math.random()*100}vw;animation-delay:${Math.random()*.5}s;font-size:${16+Math.random()*20}px`;document.body.append(s);setTimeout(()=>s.remove(),2600)}}
function renderTray(){
  if(!tot()){$("tray").innerHTML=`<div class="tm">🎒 Your bag is empty. Tap a part to drop it in!</div>`;return}
  const b=scored()[0],miss=b.s.rows.find(r=>r.h<r.q);
  const ch=Object.entries(inv).filter(([k,v])=>v>0).map(([k,v])=>`<span class="tc" title="${C[k][0]}">${E[k]}<sup>${v}</sup></span>`).join("");
  $("tray").innerHTML=`<div class="tb">${ch}</div><div class="tm"><b>${PE[b.i]} ${b.p.n}: ${b.s.pct}% there</b><div class="meter"><i style="width:${b.s.pct}%"></i></div>${miss?`<button class="hint" data-quick="${miss.id}">+ Add 1 ${E[miss.id]} ${C[miss.id][0]} to get closer</button>`:`<a class="hint go" href="#projects">Ready! Go build it 🔨</a>`}</div>`}
function renderParts(){
  const ready=scored().filter(x=>x.s.pct===100).length;
  $("psum").innerHTML=`<span>🎒 ${tot()} parts in your bag, ${ready} build${ready===1?"":"s"} ready</span><a href="#projects">See builds</a>`;
  const cats=["All",...new Set(Object.values(C).map(v=>v[2]))];
  $("cats").innerHTML=cats.map(c=>`<button class="chip" data-c="${c}" aria-pressed="${cat===c}">${c}</button>`).join("");
  const rows=Object.entries(C).filter(([k,v])=>(cat==="All"||v[2]===cat)&&v[0].toLowerCase().includes(term));
  $("plist").innerHTML=rows.length?rows.map(([k,v])=>{const n=inv[k]||0;return`<div class="tile ${n?"has":""}" style="--c:${CC[v[2]]}"><button class="add" data-add="${k}" aria-label="Add ${v[0]}"><span class="em">${E[k]}</span><b>${v[0]}</b><small>about ${v[1]} g</small></button>${n?`<i class="cnt">${n}</i><button class="rm" data-rm="${k}" aria-label="Remove one ${v[0]}">−</button>`:""}</div>`}).join(""):`<div class="empty">No parts match “${term}”. Try another word.</div>`;
  renderTray()}
function renderProjects(){
  $("pf").innerHTML=[["all","All builds"],["ready","Ready now"],["close","1 or 2 parts away"]].map(([k,t])=>`<button class="chip" data-f="${k}" aria-pressed="${pfil===k}">${t}</button>`).join("");
  let l=scored();if(pfil==="ready")l=l.filter(x=>x.s.miss===0);if(pfil==="close")l=l.filter(x=>x.s.miss>0&&x.s.miss<=2);
  $("prj").innerHTML=l.length?`<div class="pgrid">${l.map(({p,i,s})=>`<button class="prow ${s.miss?"":"rdy"}" data-p="${i}"><span class="big">${PE[i]}</span><h3>${p.n}</h3><p>${p.d}</p><em class="lv ${p.l}">${p.l}</em><div class="meter" role="img" aria-label="${s.pct}% of parts available"><i style="width:${s.pct}%"></i></div><div class="mt">${s.have} of ${s.need} parts</div><span class="pill ${s.miss?"no":"ok"}">${s.miss?`${s.miss} part${s.miss>1?"s":""} to go`:"Ready. Build it!"}</span></button>`).join("")}</div>`:`<div class="empty card">${tot()?"Nothing in this group yet. Try another filter.":"Your bag is empty. Add parts to unlock builds."}<br><a class="btn pri" href="#parts">Add parts</a></div>`}
function countUp(){document.querySelectorAll(".kpi b").forEach(el=>{const m=el.textContent.match(/^([\d.]+)(.*)$/);if(!m)return;const to=+m[1],d=(m[1].split(".")[1]||"").length,t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/900),v=to*(1-Math.pow(1-k,3));el.textContent=v.toFixed(d)+m[2];if(k<1)requestAnimationFrame(f)})(t0)})}
function renderImpact(){
  const g=built.reduce((a,b)=>a+b.g,0),mx=Math.max(1,...built.map(b=>b.g));
  let li=0;LV.forEach((l,i)=>{if(g>=l[1])li=i});const nx=LV[li+1];
  $("kpis").innerHTML=`<div class="card lvl"><h3>Eco level: ${LV[li][0]}</h3><div class="meter"><i style="width:${nx?(g-LV[li][1])/(nx[1]-LV[li][1])*100:100}%"></i></div><p>${nx?fmt(nx[1]-g)+" more e-waste to reach "+nx[0]:"Max level. You are a legend."}</p></div>`+[[tot(),"parts in your bag"],[built.length,"builds finished"],[fmt(g),"e-waste reused"],[(g*.02).toFixed(1)+" kg","CO₂ avoided (estimate)"]].map(([a,b])=>`<div class="card kpi"><b>${a}</b><span>${b}</span></div>`).join("");
  $("blt").innerHTML=built.length?built.map(b=>`<div class="brow"><span>${b.e||"🔧"} ${b.n}</span><div class="meter"><i style="width:${b.g/mx*100}%"></i></div><span>${fmt(b.g)}</span></div>`).join(""):`<div class="empty">Nothing built yet. Open a build that is ready and hit Build it!<br><a class="btn pri" href="#projects">Browse builds</a></div>`}
function openProject(i){const p=P[i],s=score(p),d=$("dlg");
  $("dt").textContent=PE[i]+" "+p.n;$("dd").textContent=p.d+" Difficulty: "+p.l+".";
  const sl=s.rows.flatMap(r=>Array.from({length:r.q},(_,n)=>n<r.h?`<span class="slot on" title="${C[r.id][0]}">${E[r.id]}</span>`:`<button class="slot off" data-grab="${r.id}" aria-label="Add ${C[r.id][0]} to your bag">${E[r.id]}<i>+</i></button>`)).join("");
  $("dbody").innerHTML=`<div class="slots">${sl}</div><div class="meter"><i style="width:${s.pct}%"></i></div><div class="mt">${s.miss?`Tap a dashed slot to add that part. ${s.miss} to go.`:"All slots filled. Ready to build!"} Reuses ${fmt(s.g)} of e-waste.</div><p class="need">Needs: ${s.rows.map(r=>`${r.q}× ${C[r.id][0]}`).join(", ")}</p>`;
  $("dbody").onclick=e=>{const b=e.target.closest("[data-grab]");if(b){inv[b.dataset.grab]=(inv[b.dataset.grab]||0)+1;save();openProject(i)}};
  $("dfoot").innerHTML=`<button class="btn" id="cl">Close</button><button class="btn" id="gp">Edit my parts</button><button class="btn pri" id="bd" ${s.miss?"disabled":""}>${s.miss?"Fill all slots first":"🔨 Build it!"}</button>`;
  $("cl").onclick=()=>d.close();$("gp").onclick=()=>{d.close();go("parts")};
  $("bd").onclick=()=>{$("dfoot").innerHTML="";$("dbody").innerHTML=`<div class="stage"><div class="big">${PE[i]}</div><b id="stx">Wiring parts…</b><div class="meter"><i id="sbar" style="width:0"></i></div></div>`;
    ["Wiring parts…","Uploading code…","Testing it out…","It's alive! 🎉"].forEach((t,n)=>setTimeout(()=>{$("stx").textContent=t;$("sbar").style.width=(n+1)*25+"%"},n*650+60));
    setTimeout(()=>{const f=score(p);for(const r of f.rows)inv[r.id]-=r.q;built.push({n:p.n,g:f.g,e:PE[i]});save();d.close();route();confetti();toast(`You built "${p.n}"! ${fmt(f.g)} of e-waste reused.`)},2900)};
  if(!d.open)d.showModal()}
let cur=(location.hash||"#home").slice(1);
function route(p){if(p)cur=p;const pg=["home","parts","projects","impact"].includes(cur)?cur:"home";document.body.dataset.pg=pg;
  document.querySelectorAll(".page").forEach(e=>e.classList.toggle("on",e.id===pg));
  document.querySelectorAll("#menu a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+pg));
  if(pg==="parts")renderParts();if(pg==="projects")renderProjects();if(pg==="impact"){renderImpact();countUp()}window.scrollTo(0,0)}
const go=p=>{try{history.replaceState(null,"","#"+p)}catch(e){}route(p)};
const addSample=()=>{for(const [k,v] of Object.entries(SAMPLE))inv[k]=Math.max(inv[k]||0,v);save()};
document.addEventListener("click",e=>{
  const a=e.target.closest('a[href^="#"]');if(a){e.preventDefault();go(a.getAttribute("href").slice(1));return}
  const q=e.target.closest("[data-quick]");if(q){inv[q.dataset.quick]=(inv[q.dataset.quick]||0)+1;save();renderParts();return}
  const d=e.target.closest("[data-demo]");if(d){d.classList.toggle("on");const n=document.querySelectorAll("[data-demo].on").length,m=$("demo");m.dataset.n=n;m.style.setProperty("--n",n);$("dres").textContent=n===3?"It's alive! You just built a Smart night lamp from 4 spare parts.":`${n} of 3 parts in. Keep tapping!`;if(n===3)confetti()}});
$("sample").onclick=()=>{addSample();toast("Sample bag loaded!");go("projects")};
$("sample2").onclick=()=>{addSample();renderParts();toast("Sample bag loaded!")};
$("clear").onclick=()=>{if(confirm("Empty your whole bag?")){inv={};save();renderParts()}};
$("q").oninput=e=>{term=e.target.value.trim().toLowerCase();renderParts()};
$("cats").onclick=e=>{const b=e.target.closest("[data-c]");if(b){cat=b.dataset.c;renderParts()}};
$("plist").onclick=e=>{const a=e.target.closest("[data-add],[data-rm]");if(!a)return;const k=a.dataset.add||a.dataset.rm;inv[k]=Math.max(0,(inv[k]||0)+(a.dataset.add?1:-1));if(a.dataset.add)fly(a,E[k]);save();renderParts();const t=document.querySelector(`#plist [data-add="${k}"]`);if(t)t.parentNode.classList.add("pop")};
$("pf").onclick=e=>{const b=e.target.closest("[data-f]");if(b){pfil=b.dataset.f;renderProjects()}};
$("prj").onclick=e=>{const b=e.target.closest("[data-p]");if(b)openProject(+b.dataset.p)};
$("share").onclick=()=>{const g=built.reduce((a,b)=>a+b.g,0),t=`I built ${built.length} project(s) and reused ${fmt(g)} of e-waste on SecondLife!`;try{navigator.clipboard.writeText(t).then(()=>toast("Copied! Paste it anywhere."))}catch(e){toast(t)}};
const mq=Object.values(E).join("  ")+"  ";$("mq").innerHTML=`<div class="mqt" aria-hidden="true">${mq.repeat(3)}${mq.repeat(3)}</div>`;
addEventListener("hashchange",()=>{cur=(location.hash||"#home").slice(1);route()});route();
