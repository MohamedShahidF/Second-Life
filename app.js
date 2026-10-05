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
let inv={},built=[],cat="All",pfil="all",term="";
try{inv=JSON.parse(localStorage.getItem("sl_inv")||"{}");built=JSON.parse(localStorage.getItem("sl_built")||"[]")}catch(e){}
const $=id=>document.getElementById(id);
// Icons per category. To use a real photo, put images/<id>.jpg in the images folder (see README).
const ICON={"Boards":'<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',"Devices":'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',"Audio and display":'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',"Basics":'<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>',"Sensors":'<circle cx="12" cy="12" r="3"/><path d="M6.3 6.3a8 8 0 0 0 0 11.4M17.7 6.3a8 8 0 0 1 0 11.4"/>',"Motors and power":'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>'};
const slug=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,"-");
const thumb=(id,cat,lg)=>`<span class="thumb ${lg?"lg":""}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[cat]}</svg><img src="images/${id}.jpg" alt="" loading="lazy" onerror="this.remove()"></span>`;
const save=()=>{try{localStorage.setItem("sl_inv",JSON.stringify(inv));localStorage.setItem("sl_built",JSON.stringify(built))}catch(e){}};
const toast=m=>{const t=$("toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2600)};
const fmt=g=>g>=1000?(g/1000).toFixed(2)+" kg":Math.round(g)+" g";
function score(p){let need=0,have=0,g=0;const rows=[];
  for(const [id,q] of Object.entries(p.r)){const h=Math.min(inv[id]||0,q);need+=q;have+=h;g+=h*C[id][1];rows.push({id,q,h})}
  return{pct:Math.round(have/need*100),need,have,g,rows,miss:need-have}}
const scored=()=>P.map((p,i)=>({p,i,s:score(p)})).sort((a,b)=>b.s.pct-a.s.pct||a.p.n.localeCompare(b.p.n));
function renderParts(){
  const total=Object.values(inv).reduce((a,b)=>a+b,0),ready=scored().filter(x=>x.s.pct===100).length;
  $("psum").innerHTML=`<span>${total} parts listed · ${ready} project${ready===1?"":"s"} ready to build</span><a href="#projects">See projects</a>`;
  const cats=["All",...new Set(Object.values(C).map(v=>v[2]))];
  $("cats").innerHTML=cats.map(c=>`<button class="chip" data-c="${c}" aria-pressed="${cat===c}">${c}</button>`).join("");
  const rows=Object.entries(C).filter(([k,v])=>(cat==="All"||v[2]===cat)&&v[0].toLowerCase().includes(term));
  $("plist").innerHTML=rows.length?rows.map(([k,v])=>`<div class="item ${inv[k]?"has":""}"><div class="lt">${thumb(k,v[2])}<div>${v[0]}<small>${v[2]} · about ${v[1]} g each</small></div></div><div class="step"><button data-k="${k}" data-d="-1" aria-label="Remove one ${v[0]}">−</button><output>${inv[k]||0}</output><button data-k="${k}" data-d="1" aria-label="Add one ${v[0]}">+</button></div></div>`).join(""):`<div class="empty">No parts match “${term}”.</div>`}
function renderProjects(){
  $("pf").innerHTML=[["all","All projects"],["ready","Ready to build"],["close","Missing 1–2 parts"]].map(([k,t])=>`<button class="chip" data-f="${k}" aria-pressed="${pfil===k}">${t}</button>`).join("");
  let l=scored();if(pfil==="ready")l=l.filter(x=>x.s.miss===0);if(pfil==="close")l=l.filter(x=>x.s.miss>0&&x.s.miss<=2);
  const none=!Object.values(inv).some(v=>v>0);
  $("prj").innerHTML=l.length?l.map(({p,i,s})=>`<button class="prow" data-p="${i}"><div class="lt">${thumb(slug(p.n),C[Object.keys(p.r)[0]][2],1)}<div><h3>${p.n}</h3><p>${p.d} · ${p.l}</p></div></div><div><div class="meter" role="img" aria-label="${s.pct}% of parts available"><i style="width:${s.pct}%"></i></div><div class="mt">${s.have} of ${s.need} parts · ${s.pct}% feasible</div></div><span class="pill ${s.miss?"no":"ok"}">${s.miss?`Missing ${s.miss} part${s.miss>1?"s":""}`:"Ready to build"}</span></button>`).join(""):`<div class="empty card">${none?"Add your parts first so we can match projects.":"No projects in this group yet."}<br><a class="btn pri" href="#parts">Add my parts</a></div>`}
function renderImpact(){
  const g=built.reduce((a,b)=>a+b.g,0),mx=Math.max(1,...built.map(b=>b.g));
  $("kpis").innerHTML=[[Object.values(inv).reduce((a,b)=>a+b,0),"parts in your list"],[built.length,"projects built"],[fmt(g),"e-waste reused"],[(g*.02).toFixed(1)+" kg","CO₂ avoided (estimate)"]].map(([a,b])=>`<div class="card kpi"><b>${a}</b><span>${b}</span></div>`).join("");
  $("blt").innerHTML=built.length?built.map(b=>`<div class="brow"><span>${b.n}</span><div class="meter"><i style="width:${b.g/mx*100}%"></i></div><span>${fmt(b.g)}</span></div>`).join(""):`<div class="empty">Nothing built yet. Open a project that is ready and mark it as built.<br><a class="btn pri" href="#projects">Browse projects</a></div>`}
function openProject(i){const p=P[i],s=score(p);
  $("dt").textContent=p.n;$("dd").textContent=p.d+" Difficulty: "+p.l+".";
  $("dbody").innerHTML=`<div class="meter"><i style="width:${s.pct}%"></i></div><div class="mt">${s.pct}% feasible · reuses ${fmt(s.g)} of e-waste</div><table><tr><th>Part</th><th>Needed</th><th>You have</th><th></th></tr>${s.rows.map(r=>`<tr><td>${C[r.id][0]}</td><td>${r.q}</td><td>${inv[r.id]||0}</td><td class="${r.h>=r.q?"yes":"no"}">${r.h>=r.q?"Have it":"Need "+(r.q-r.h)+" more"}</td></tr>`).join("")}</table>`;
  $("dfoot").innerHTML=`<button class="btn" id="cl">Close</button><button class="btn" id="gp">Edit my parts</button><button class="btn pri" id="bd" ${s.miss?"disabled":""}>${s.miss?"Missing parts":"Mark as built"}</button>`;
  $("cl").onclick=()=>$("dlg").close();$("gp").onclick=()=>{$("dlg").close();go("parts")};
  $("bd").onclick=()=>{for(const r of s.rows)inv[r.id]-=r.q;built.push({n:p.n,g:s.g});save();$("dlg").close();route();toast(`Built "${p.n}". ${fmt(s.g)} of e-waste reused.`)};
  $("dlg").showModal()}
let cur=(location.hash||"#home").slice(1);
function route(p){if(p)cur=p;const pg=["home","parts","projects","impact"].includes(cur)?cur:"home";
  document.querySelectorAll(".page").forEach(e=>e.classList.toggle("on",e.id===pg));
  document.querySelectorAll("#menu a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+pg));
  if(pg==="parts")renderParts();if(pg==="projects")renderProjects();if(pg==="impact")renderImpact();window.scrollTo(0,0)}
const go=p=>{try{history.replaceState(null,"","#"+p)}catch(e){}route(p)};
document.addEventListener("click",e=>{const a=e.target.closest('a[href^="#"]');if(a){e.preventDefault();go(a.getAttribute("href").slice(1))}});
const loadSample=()=>{for(const [k,v] of Object.entries(SAMPLE))inv[k]=Math.max(inv[k]||0,v);save();toast("Sample parts added.");go("projects")};
$("sample").onclick=loadSample;$("sample2").onclick=()=>{for(const [k,v] of Object.entries(SAMPLE))inv[k]=Math.max(inv[k]||0,v);save();renderParts();toast("Sample parts added.")};
$("clear").onclick=()=>{if(confirm("Remove all parts from your list?")){inv={};save();renderParts()}};
$("q").oninput=e=>{term=e.target.value.trim().toLowerCase();renderParts()};
$("cats").onclick=e=>{const b=e.target.closest("[data-c]");if(b){cat=b.dataset.c;renderParts()}};
$("plist").onclick=e=>{const b=e.target.closest("[data-k]");if(!b)return;const k=b.dataset.k;inv[k]=Math.max(0,(inv[k]||0)+ +b.dataset.d);save();renderParts()};
$("pf").onclick=e=>{const b=e.target.closest("[data-f]");if(b){pfil=b.dataset.f;renderProjects()}};
$("prj").onclick=e=>{const b=e.target.closest("[data-p]");if(b)openProject(+b.dataset.p)};
addEventListener("hashchange",()=>{cur=(location.hash||"#home").slice(1);route()});route();
