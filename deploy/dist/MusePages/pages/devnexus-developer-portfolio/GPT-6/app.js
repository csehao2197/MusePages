import {projects,skills,posts} from "./assets/data.js";
import {startGraphics} from "./assets/graphics.js";
const $ = selector => document.querySelector(selector);
const icon = name => `<svg aria-hidden="true"><use href="./assets/icons.svg#${name}"></use></svg>`;
const esc = value => String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const dialog=$("#detail-dialog"),content=$("#dialog-content");
let opener=null,cleanup=()=>{};
function download(text,name,type="application/json"){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function category() {const value=new URL(location.href).searchParams.get("category");return ["Web","Mobile","AI","Full-stack"].includes(value)?value:"All";}
function renderProjects(value=category()){
  document.querySelectorAll("[data-filter]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.filter===value)));
  const selected=projects.filter(p=>value==="All"||p.type===value);
  $("#project-grid").innerHTML=selected.map(p=>`<article class="project-card"><a class="project-image" href="#project-${p.id}" aria-label="Explore ${p.name} case study"><img src="./assets/${p.id}.png" width="900" height="600" alt="${p.name} working local sandbox" loading="lazy"></a><p class="tiny">${p.tag}</p><h3><a href="#project-${p.id}">${p.name}${icon("arrow-up-right")}</a></h3><p>${p.description}</p><div class="stack">${p.stack.map(t=>`<span>${t}</span>`).join("")}</div></article>`).join("");
  $("#project-status").textContent=`${selected.length} ${value==="All"?"total":value} projects`;
}
document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{const url=new URL(location.href);if(b.dataset.filter==="All")url.searchParams.delete("category");else url.searchParams.set("category",b.dataset.filter);url.hash="projects";history.pushState(null,"",url);renderProjects();}));
renderProjects();
const domains=Object.keys(skills);
$(".skill-tabs").innerHTML=domains.map((name,i)=>`<button role="tab" id="tab-${name}" aria-controls="skill-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-domain="${name}">${name}</button>`).join("");
function selectDomain(name){
  document.querySelectorAll("[data-domain]").forEach(b=>{b.setAttribute("aria-selected",String(b.dataset.domain===name));b.tabIndex=b.dataset.domain===name?0:-1;});
  $("#skill-panel").setAttribute("aria-labelledby",`tab-${name}`);
  $("#skill-panel").innerHTML=skills[name].map(([label,score])=>`<div class="skill-row"><div><span>${label}</span><span>${score}%</span></div><progress value="${score}" max="100" aria-label="${label}: illustrative score ${score} out of 100"></progress></div>`).join("");
}
selectDomain(domains[0]);
document.querySelectorAll("[data-domain]").forEach((b,i)=>{b.addEventListener("click",()=>selectDomain(b.dataset.domain));b.addEventListener("keydown",e=>{let next;if(e.key==="ArrowRight")next=(i+1)%domains.length;else if(e.key==="ArrowLeft")next=(i+domains.length-1)%domains.length;else if(e.key==="Home")next=0;else if(e.key==="End")next=domains.length-1;else return;e.preventDefault();selectDomain(domains[next]);$(`#tab-${domains[next]}`).focus();});});
const readTime=p=>Math.max(1,Math.ceil([p.intro,...p.paragraphs,p.code].join(" ").split(/\s+/).length/220));
$("#post-list").innerHTML=posts.map(p=>`<a class="post-row" href="#post-${p.id}"><span class="tiny">${p.category}</span><div><h3>${p.title}</h3><p>${p.intro}</p></div><span class="post-meta"><span>${p.date}</span><br><span>${readTime(p)} MIN READ</span></span>${icon("arrow-up-right")}</a>`).join("");
function mountDemo(id){
  const box=$(".sandbox");
  if(id==="nexuscommerce"){
    const products=[["Arc keyboard","Desk",89],["Orbit stand","Desk",42],["Field notebook","Everyday",18],["Loop tote","Everyday",24],["Trail flask","Outdoor",32],["Peak light","Outdoor",39]],cart=new Map();
    box.innerHTML=`<h3>A better kind of discovery.</h3><p>Local category recommendations, not AI. Prices in sample USD.</p><label>Interested in<select id="interest"><option>Everything</option><option>Desk</option><option>Everyday</option><option>Outdoor</option></select></label><div class="products"></div><h4>Your local basket</h4><div id="cart"></div><output id="cart-total">$0.00 · 0 items</output>`;
    const draw=()=>{$(".products").innerHTML=products.map((p,i)=>({p,i})).filter(({p})=>$("#interest").value==="Everything"||p[1]===$("#interest").value).map(({p,i})=>`<div class="product"><strong>${p[0]}</strong><span>${p[1]} · $${p[2]}.00</span><button data-add="${i}">Add to basket</button></div>`).join("");};
    const drawCart=()=>{$("#cart").innerHTML=[...cart].map(([i,n])=>`<div class="cart-line"><span>${products[i][0]} × ${n}</span><button data-remove="${i}" aria-label="Remove one ${products[i][0]}">−</button></div>`).join("");let total=0,count=0;cart.forEach((n,i)=>{total+=n*products[i][2];count+=n;});$("#cart-total").textContent=`$${total.toFixed(2)} · ${count} items`;};
    $("#interest").addEventListener("change",draw);box.addEventListener("click",e=>{const b=e.target.closest("[data-add],[data-remove]");if(!b)return;const i=Number(b.dataset.add??b.dataset.remove),next=(cart.get(i)||0)+(b.hasAttribute("data-add")?1:-1);if(next>20)return;if(next)cart.set(i,next);else cart.delete(i);drawCart();});draw();
  }else if(id==="securevault"){
    box.innerHTML=`<h3>Private by local design.</h3><p>Educational, unaudited AES-GCM demo. Sample text only. Passwords and content stay in memory and clear when this case closes. The JSON envelope omits the password.</p><label>Sample text<textarea id="vault-text" maxlength="1000">A small secret, kept in this browser.</textarea></label><label>Password (at least 8 characters)<input id="vault-password" type="password" minlength="8" maxlength="128" autocomplete="off"></label><div class="demo-actions"><button id="encrypt">Encrypt sample</button><button id="decrypt" disabled>Decrypt envelope</button><button id="export-envelope" disabled>Download envelope</button></div><p id="vault-status" role="status">No key or content is stored.</p><pre id="envelope"></pre><output id="decrypted"></output>`;
    let envelope=null,busy=false,active=true;
    const bytesTo64=bytes=>btoa(String.fromCharCode(...bytes));
    const from64=text=>Uint8Array.from(atob(text),c=>c.charCodeAt(0));
    const key=async(salt,password)=>{const base=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations:210000,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);};
    async function crypt(encrypt){
      if(busy)return;
      const password=$("#vault-password").value,text=$("#vault-text").value;
      if(password.length<8){$("#vault-status").textContent="Enter a password of at least 8 characters.";$("#vault-password").focus();return;}
      if(encrypt&&!text.trim()){$("#vault-status").textContent="Enter some sample text.";return;}
      if(!crypto.subtle){$("#vault-status").textContent="Web Crypto unavailable. Use HTTPS or localhost; encryption was not performed.";return;}
      busy=true;$("#encrypt").disabled=true;$("#decrypt").disabled=true;$("#vault-status").textContent="Processing locally…";
      if(encrypt){envelope=null;$("#envelope").textContent="";$("#decrypted").textContent="";$("#export-envelope").disabled=true;}
      try{
        if(encrypt){const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));const derived=await key(salt,password),cipher=await crypto.subtle.encrypt({name:"AES-GCM",iv},derived,new TextEncoder().encode(text));if(!active)return;envelope={version:1,algorithm:"AES-256-GCM",kdf:"PBKDF2-SHA-256",iterations:210000,salt:bytesTo64(salt),iv:bytesTo64(iv),ciphertext:bytesTo64(new Uint8Array(cipher))};$("#envelope").textContent=JSON.stringify(envelope,null,2);$("#vault-text").value="";$("#vault-password").value="";$("#decrypted").textContent="";$("#vault-status").textContent="Encrypted locally. Re-enter the password to decrypt.";$("#export-envelope").disabled=false;}
        else {const derived=await key(from64(envelope.salt),password),plain=await crypto.subtle.decrypt({name:"AES-GCM",iv:from64(envelope.iv)},derived,from64(envelope.ciphertext));if(!active)return;$("#decrypted").textContent=new TextDecoder().decode(plain);$("#vault-password").value="";$("#vault-status").textContent="Decrypted locally. No network request was made.";}
      }catch{if(active){$("#decrypted").textContent="";$("#vault-status").textContent=encrypt?"Encryption failed. No new envelope was produced.":"Could not decrypt. Check the password; no plaintext was recovered.";}}
      finally{busy=false;if(active){$("#encrypt").disabled=false;$("#decrypt").disabled=!envelope;}}
    }
    $("#encrypt").addEventListener("click",()=>crypt(true));$("#decrypt").addEventListener("click",()=>crypt(false));$("#export-envelope").addEventListener("click",()=>download(JSON.stringify(envelope,null,2),"securevault-sample.json"));
    cleanup=()=>{active=false;envelope=null;};
  }else if(id==="datastream"){
    const values=[18,25,21,34,29,42,38,47,31,44,52,48];let count=4;
    box.innerHTML=`<h3>A signal you can inspect.</h3><p>Fixed sample sequence · not live analytics. Advance through twelve samples.</p><output id="stream-total"></output><svg class="chart" viewBox="0 0 600 160" role="img" aria-label="Sample values over successive steps"></svg><div class="demo-actions"><button id="next-sample">Next sample</button><button id="reset-stream">Reset</button></div><table><caption>Visible sample values</caption><thead><tr><th>Step</th><th>Value</th></tr></thead><tbody></tbody></table>`;
    const draw=()=>{const data=values.slice(0,count);$("#stream-total").textContent=`${data.reduce((a,b)=>a+b,0)} total · ${count} samples`;$(".chart").innerHTML=`<polyline points="${data.map((v,i)=>`${15+i*50},${150-v*2.4}`).join(" ")}"/>${data.map((v,i)=>`<circle cx="${15+i*50}" cy="${150-v*2.4}" r="3"/>`).join("")}`;box.querySelector("tbody").innerHTML=data.map((v,i)=>`<tr><td>${i+1}</td><td>${v}</td></tr>`).join("");$("#next-sample").disabled=count===values.length;};
    $("#next-sample").addEventListener("click",()=>{count++;draw();});$("#reset-stream").addEventListener("click",()=>{count=4;draw();});draw();
  }else if(id==="aichatbot"){
    box.innerHTML=`<h3>Meet the very local assistant.</h3><p>Rule-based FAQ, not an LLM. Try pricing, privacy, integration, or support. Nothing leaves this page.</p><div class="messages" role="log" aria-label="Local FAQ conversation"></div><form id="chat-form"><label>Question<input id="question" maxlength="300" required placeholder="What about privacy?"></label><button class="button outline">Ask local FAQ</button></form><p id="chat-status" role="status"></p>`;
    const faqs=[[/pric|cost|plan/i,"This concept has no commercial plans. All interactions here are free local demonstrations."],[/priv|data|stor/i,"No chat messages are transmitted or stored. Closing this case clears its conversation."],[/integrat|api|model|llm/i,"No model or API is connected. Answers come from four local keyword rules."],[/support|help|contact/i,"There is no support service. The contact section can download a local project brief."]];
    $("#chat-form").addEventListener("submit",e=>{e.preventDefault();const q=$("#question").value.trim();if(!q){$("#chat-status").textContent="Enter a question.";return;}if($(".messages").children.length>=20){$("#chat-status").textContent="Ten-question limit reached. Close and reopen to start again.";return;}for(const [who,text] of [["YOU",q],["LOCAL FAQ",faqs.find(([rule])=>rule.test(q))?.[1]||"No matching local answer. Try pricing, privacy, integration, or support. No LLM is connected."]]){const p=document.createElement("p"),b=document.createElement("b");b.textContent=who;p.append(b,document.createTextNode(text));$(".messages").append(p);}$("#question").value="";$(".messages").scrollTop=$(".messages").scrollHeight;});
  }else if(id==="devflow"){
    box.innerHTML=`<h3>A pipeline, made legible.</h3><p>Simulation only. No commands, checks, builds, or remote jobs run.</p><label>Scenario<select id="scenario"><option value="success">All sample stages pass</option><option value="failure">Sample test stage fails</option></select></label><ol class="pipeline"></ol><div class="demo-actions"><button id="pipeline-next">Step simulation</button><button id="pipeline-reset">Reset</button></div><p id="pipeline-status" role="status">Ready to simulate.</p>`;
    let step=0,failed=false;
    const draw=()=>{$(".pipeline").innerHTML=["Lint","Tests","Package"].map((name,i)=>`<li class="${i<step?(failed&&i===1?"failed":"passed"):""}">${name}<small>${i<step?(failed&&i===1?"sample failed":"sample passed"):failed?"skipped":"pending"}</small></li>`).join("");$("#pipeline-next").disabled=failed||step===3;$("#scenario").disabled=step>0;$("#pipeline-status").textContent=failed?"Simulation stopped at sample test failure. Package skipped.":step===3?"Simulation complete. No real checks were executed.":`Ready for sample stage ${step+1}.`;};
    $("#pipeline-next").addEventListener("click",()=>{step++;failed=step===2&&$("#scenario").value==="failure";draw();});$("#pipeline-reset").addEventListener("click",()=>{step=0;failed=false;draw();});draw();
  }else{
    box.classList.add("timer");box.innerHTML=`<p class="tiny">POCKET UI / ONE MINUTE OF FOCUS</p><h3>One thing at a time.</h3><p>Real local timer. No notifications, storage or remote service.</p><output id="timer-value" aria-label="Remaining time">01:00</output><div class="demo-actions"><button id="timer-start">Start focus</button><button id="timer-reset">Reset</button></div><p id="timer-status" role="status">Ready when you are.</p>`;
    let elapsed=0,anchor=0,running=false,interval=0;
    const draw=()=>{const ms=Math.max(0,60000-elapsed-(running?performance.now()-anchor:0)),seconds=Math.ceil(ms/1000);$("#timer-value").textContent=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;if(ms===0&&running){running=false;elapsed=60000;$("#timer-status").textContent="Focus minute complete.";$("#timer-start").textContent="Complete";$("#timer-start").disabled=true;clearInterval(interval);}};
    $("#timer-start").addEventListener("click",()=>{if(running){elapsed+=performance.now()-anchor;running=false;clearInterval(interval);$("#timer-start").textContent="Resume focus";$("#timer-status").textContent="Paused.";}else{anchor=performance.now();running=true;interval=setInterval(draw,200);$("#timer-start").textContent="Pause";$("#timer-status").textContent="Focus in progress.";}draw();});
    $("#timer-reset").addEventListener("click",()=>{clearInterval(interval);elapsed=0;running=false;$("#timer-start").disabled=false;$("#timer-start").textContent="Start focus";$("#timer-status").textContent="Ready when you are.";draw();});cleanup=()=>clearInterval(interval);
  }
}
function openProject(p){
  content.innerHTML=`<h2 id="dialog-title">${p.name}</h2><p class="case-lede">${p.description}</p><div class="stack">${p.stack.map(t=>`<span>${t}</span>`).join("")}</div><div class="case-copy" style="margin-top:24px"><div><h3>The problem</h3><p>${p.problem}</p></div><div><h3>The approach</h3><p>${p.approach}</p></div></div><div class="architecture" aria-label="Concept architecture">${p.nodes.map((n,i)=>`${i?icon("arrow-right"):""}<span>${n}</span>`).join("")}</div><p class="case-result">${p.result}</p><p class="sandbox-label">LIVE LOCAL SANDBOX / TRY IT HERE</p><div class="sandbox" data-demo="${p.id}"></div><p class="section-note">Original concept. No commercial results or client metrics are claimed. <a href="./app.js" download="devnexus-app.js">Download actual sandbox JavaScript</a> · <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub platform homepage ↗</a> (no project repository claimed).</p>`;
  $("#dialog-kind").textContent="CASE STUDY / INTERACTIVE CONCEPT";mountDemo(p.id);
}
function openPost(p){
  content.innerHTML=`<article class="article"><p class="article-meta">${p.category} / ${p.date} / ${readTime(p)} MIN READ</p><h2 id="dialog-title">${p.title}</h2><p class="article-intro">${p.intro}</p>${p.paragraphs.map(text=>`<p>${text}</p>`).join("")}<h3>A small example</h3><pre><code>${esc(p.code).replace(/\b(const|return|if)\b/g,'<span class="kw">$1</span>')}</code></pre><p class="section-note">Original short essay for this fictional portfolio. Illustrative code, not a production audit or project outcome.</p></article>`;
  $("#dialog-kind").textContent="FIELD NOTE / COMPLETE SHORT READ";
}
function restore(){
  const hash=location.hash.slice(1),p=projects.find(p=>hash===`project-${p.id}`),post=posts.find(p=>hash===`post-${p.id}`);
  cleanup();cleanup=()=>{};
  if(p||post){if(!dialog.open){opener=document.activeElement;dialog.showModal();}if(p)openProject(p);else openPost(post);dialog.scrollTop=0;document.title=`${p?.name||post.title} — DevNexus`;$("#close-dialog").focus({preventScroll:true});}
  else{if(dialog.open)dialog.close();content.replaceChildren();document.title="DevNexus — Code meets possibility";}
  renderProjects();
}
$("#close-dialog").addEventListener("click",()=>{const origin=location.hash;history.pushState(null,"",`#${origin.startsWith("#post-")?"blog":"projects"}`);restore();const target=opener?.isConnected?opener:document.querySelector(`a[href="${origin}"]`);target?.focus({preventScroll:true});});
dialog.addEventListener("cancel",e=>{e.preventDefault();$("#close-dialog").click();});
window.addEventListener("hashchange",restore);window.addEventListener("popstate",restore);
restore();
$(".mobile-toggle").addEventListener("click",()=>{const open=!$("#navigation").classList.contains("open");$("#navigation").classList.toggle("open",open);$(".mobile-toggle").setAttribute("aria-expanded",String(open));$(".mobile-toggle").setAttribute("aria-label",open?"Close navigation":"Open navigation");});
$("#navigation").addEventListener("click",e=>{if(e.target.closest("a")){$("#navigation").classList.remove("open");$(".mobile-toggle").setAttribute("aria-expanded","false");$(".mobile-toggle").setAttribute("aria-label","Open navigation");}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("#navigation").classList.contains("open")){$(".mobile-toggle").click();$(".mobile-toggle").focus();}});
$("#theme-toggle").addEventListener("click",()=>{const dark=document.documentElement.dataset.theme!=="dark";document.documentElement.dataset.theme=dark?"dark":"light";$("#theme-toggle").setAttribute("aria-label",`Switch to ${dark?"light":"dark"} theme`);$("#theme-toggle").innerHTML=icon(dark?"sun":"moon");});
new IntersectionObserver(entries=>{entries.filter(e=>e.isIntersecting).forEach(e=>{document.querySelectorAll("#navigation a").forEach(a=>a.classList.toggle("active",a.hash===`#${e.target.id}`));});},{rootMargin:"-15% 0px -65%"}).observe($("#home"));
for(const section of document.querySelectorAll("main section[id]:not(#home)"))new IntersectionObserver(entries=>{if(entries[0].isIntersecting)document.querySelectorAll("#navigation a").forEach(a=>a.classList.toggle("active",a.hash===`#${section.id}`));},{rootMargin:"-15% 0px -65%"}).observe(section);
const contact=$("#contact-form");
contact.addEventListener("submit",e=>{
  e.preventDefault();const data=Object.fromEntries(new FormData(contact).entries());for(const k in data)data[k]=data[k].trim();
  const messages={name:data.name.length>=2&&data.name.length<=80?"":"Enter a name of 2–80 characters.",email:/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)&&data.email.length<=160?"":"Enter a valid email address.",subject:data.subject.length>=4&&data.subject.length<=100?"":"Enter a subject of 4–100 characters.",message:data.message.length>=20&&data.message.length<=2000?"":"Enter a message of 20–2000 characters."};
  let first;for(const [name,message] of Object.entries(messages)){$(`#error-${name}`).textContent=message;contact.elements[name].setAttribute("aria-invalid",String(Boolean(message)));if(message&&!first)first=contact.elements[name];}
  if(first){first.focus();$("#form-status").textContent="Check the highlighted fields. Nothing was sent.";return;}
  download(JSON.stringify({kind:"DevNexus local project brief",delivery:"Not sent. Local download only.",...data},null,2),"devnexus-project-brief.json");
  contact.reset();$("#form-status").textContent="Project brief downloaded. Nothing was sent; fields cleared.";
});
contact.addEventListener("reset",()=>{contact.querySelectorAll("[aria-invalid]").forEach(e=>e.removeAttribute("aria-invalid"));contact.querySelectorAll(".error").forEach(e=>e.textContent="");$("#form-status").textContent="Fields cleared. Nothing was transmitted.";});
startGraphics();
