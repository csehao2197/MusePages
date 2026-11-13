import {stations,station,scenarios,upcoming,weather,forecast,timeLabel,cleanFavorites} from "./assets/timetable.js";
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),icon=name=>`<svg aria-hidden="true"><use href="./assets/icons.svg#${name}"></use></svg>`;
const storageKey="loopline-demo.routes.v1",dialog=$("#dialog");
let favorites=[],persistent=true,state={from:"san-francisco",to:"palo-alto",now:490,scenario:"regular"},refreshTimer,toastTimer,opener,openerData;
const options=selected=>stations.map(s=>`<option value="${s.id}" ${selected===s.id?"selected":""}>${s.name}${s.legacy?" — legacy listing":""}</option>`).join("");
function toast(message){clearTimeout(toastTimer);$("#toast").textContent=message;$("#toast").hidden=false;toastTimer=setTimeout(()=>$("#toast").hidden=true,3500);}
function persistFavorites(){try{if(persistent)localStorage.setItem(storageKey,JSON.stringify(favorites));}catch{persistent=false;}$("#storage-note").textContent=persistent?"Saved only in this browser. No sign-in, tracking or cloud sync.":"Browser storage unavailable. Routes remain only in this tab's memory; refreshing may discard changes.";}
try{const raw=localStorage.getItem(storageKey);if(raw){try{if(raw.length>12000)throw Error("Oversized data");favorites=cleanFavorites(JSON.parse(raw));}catch{favorites=[];}persistFavorites();}}catch{persistent=false;persistFavorites();}
function routeUrl(push=false){
  const url=new URL(location.href);url.searchParams.set("from",state.from);url.searchParams.set("to",state.to);url.searchParams.set("at",String(state.now));url.searchParams.set("scenario",state.scenario);
  history[push?"pushState":"replaceState"](null,"",url);
}
function restoreRoute(){
  const p=new URLSearchParams(location.search),from=p.get("from")||"san-francisco",to=p.get("to")||"palo-alto",now=p.has("at")?Number(p.get("at")):490,scenario=p.get("scenario")||"regular";
  if(station(from)&&station(to)&&from!==to&&Number.isInteger(now)&&now>=0&&now<=1439&&scenarios.includes(scenario))state={from,to,now,scenario};
  else{state={from:"san-francisco",to:"palo-alto",now:490,scenario:"regular"};$("#route-error").textContent="The link contained an invalid route or demo clock. The default sample was restored.";}
  $("#origin").innerHTML=options(state.from);$("#destination").innerHTML=options(state.to);$("#scenario").value=state.scenario;
}
function drawTrains(){
  const rows=upcoming(state.from,state.to,state.now,state.scenario),from=station(state.from),to=station(state.to);
  $("#clock").textContent=timeLabel(state.now)+" PST";$("#route-heading").textContent=from.name+" → "+to.name;
  $("#updated").textContent="Recomputed at "+timeLabel(state.now)+" demo time";
  $("#trains").innerHTML=rows.length?rows.map((r,i)=>{
    const split=value=>{const [hour,meridiem,...day]=timeLabel(value).split(" ");return `<strong>${hour}</strong><small>${meridiem}${day.length?" "+day.join(" "):""}</small>`;};
    return `<article class="train-row ${i===0?"next":""}" aria-label="Fictional ${r.type} ${r.id}, ${r.direction}, departs ${timeLabel(r.departure)}, arrives ${timeLabel(r.arrival)}, duration ${r.duration} minutes"><div class="time">${split(r.departure)}<span>DEPARTURE ${i===0?`<b class="next-badge">NEXT DEMO</b>`:""}</span></div><div class="journey"><span>${r.duration} min</span><div class="journey-line"><i></i><b></b>${icon("train-front")}<b></b><i></i></div><span>${r.type}</span></div><div class="time">${split(r.arrival)}<span>ARRIVAL</span></div><div class="train-meta"><strong class="${r.hold?"delayed":""}">${r.wait===0?"Due in demo":"In "+r.wait+" min"}</strong>${r.direction}<small>${r.id}${r.hold?" / +6m hold":""}</small></div></article>`;
  }).join(""):`<div class="empty" role="status">${from.legacy||to.legacy?"This source-brief legacy listing has no trains in the demo. Choose another stop.":state.scenario==="no-service"?"The sample suspension has no departures. Change the scenario to explore the regular fixture.":"No more fictional departures at this demo time. Restore the demo clock to 8:10 AM or choose another route."}<br><button data-action="reset-clock" class="refresh">Restore demo clock to 8:10 AM ${icon("rotate-ccw")}</button></div>`;
}
function drawWeather(){
  const from=station(state.from),to=station(state.to),first=weather(state.from,state.now),last=weather(state.to,state.now);
  $("#weather").innerHTML=[[from,first,"ORIGIN",""],[to,last,"DESTINATION","destination"]].map(([stop,w,label,cls])=>w?`<article class="weather-card ${cls}"><div class="place"><small>${label} / FICTIONAL WEATHER</small><h3>${stop.name}</h3></div><div class="condition">${icon(w.icon)}<strong>${w.temp}°<span class="sr-only">Fahrenheit</span></strong></div><div class="weather-details"><span>${w.condition}</span>Wind ${w.wind} mph · Humidity ${w.humidity}%</div></article>`:`<div class="empty">${label}: ${stop.name}. No weather fixture for this legacy listing.</div>`).join("");
  const delta=first&&last?last.temp-first.temp:0;
  $("#difference").innerHTML=first&&last?`<p class="difference">${icon("thermometer")}<span>${delta===0?"Same sample temperature at both stops":Math.abs(delta)+"°F "+(delta>0?"warmer":"cooler")+" at "+to.name}${Math.abs(delta)>=8?" · a noticeable sample difference":""}</span></p>`:"";
  $("#forecast").innerHTML=last?forecast(state.to,state.now).map(w=>`<div class="forecast-hour"><small>${timeLabel(w.minute)}</small><strong>${w.temp}°F</strong>${icon(w.icon)}<span class="sr-only">${w.condition}; wind ${w.wind} mph; humidity ${w.humidity}%</span></div>`).join(""):`<p class="dialog-note">No forecast fixture for this legacy stop.</p>`;
}
function drawAlerts(){
  const notices=[{severity:"info",icon:"info",title:"A fictional timetable, not a live service check",body:"All departures, conditions and notices on this page are generated from offline fixtures. No 511, GTFS, Caltrain or weather feed is connected. Check official sources before travelling."}];
  if(state.scenario==="delay")notices.unshift({severity:"warning",icon:"triangle-alert",title:"Sample delay · six-minute hold on local demo trains",body:"This scenario adds six minutes to Local departures and arrivals. The displayed times include the fictional hold; no real delay is being reported."});
  if(state.scenario==="no-service")notices.unshift({severity:"critical",icon:"circle-alert",title:"Sample suspension · no departures in this scenario",body:"This is a fictional critical alert. Return to Regular sample to explore the timetable. It does not describe the current Caltrain service."});
  if(station(state.from).legacy||station(state.to).legacy)notices.unshift({severity:"warning",icon:"map-pin",title:"Legacy listing selected",body:"Atherton and Stanford are preserved from the original brief but intentionally excluded from this demo's service. This list is not a current official stop inventory."});
  $("#alerts").innerHTML=notices.map(n=>`<article class="notice ${n.severity}">${icon(n.icon)}<div><h3>${n.title}</h3><p>${n.body}</p></div></article>`).join("");
}
function drawFavorites(){
  $("#favorites").innerHTML=favorites.length?`<div class="favorites-grid">${favorites.map(r=>`<article class="favorite"><button data-action="load" data-id="${r.id}" aria-label="Load ${esc(r.name)}"><h3>${esc(r.name)}</h3><p>${station(r.from).name} ${icon("arrow-right")} ${station(r.to).name}</p></button><div class="favorite-foot"><span>LOCAL TO THIS BROWSER</span><div><button data-action="edit" data-id="${r.id}" aria-label="Edit ${esc(r.name)}">${icon("pencil")}</button><button data-action="delete" data-id="${r.id}" aria-label="Delete ${esc(r.name)}">${icon("trash-2")}</button></div></div></article>`).join("")}</div>`:`<div class="saved-empty">${icon("bookmark")}<div><h3>Your everyday route belongs here.</h3><p>Save up to five routes with names that make sense to you.</p></div></div>`;
}
function draw(){drawTrains();drawWeather();drawAlerts();drawFavorites();$("#results").setAttribute("aria-busy","false");$("#find-trains").disabled=false;}
function recompute(){
  clearTimeout(refreshTimer);$("#results").setAttribute("aria-busy","true");$("#find-trains").disabled=true;$("#trains").innerHTML='<div class="loading" role="status">Recomputing the local sample… No network request.</div>';
  refreshTimer=setTimeout(draw,180);
}
function plan(from,to){
  if(!station(from)||!station(to)||from===to){$("#route-error").textContent="Choose two different stations before planning a demo trip.";return false;}
  $("#route-error").textContent="";state.from=from;state.to=to;$("#origin").value=from;$("#destination").value=to;routeUrl(true);recompute();return true;
}
function mount(title,body){if(!dialog.open){opener=document.activeElement;openerData=opener?.dataset?{...opener.dataset}:{};dialog.showModal();}$("#dialog-content").innerHTML=`<h2 id="dialog-title">${title}</h2>${body}`;$("#close").focus({preventScroll:true});dialog.scrollTop=0;}
function close(){dialog.close();$("#dialog-content").replaceChildren();const fallback=openerData?.action?document.querySelector(`[data-action="${openerData.action}"]${openerData.id?`[data-id="${openerData.id}"]`:""}`):null;(opener?.isConnected?opener:fallback||$("#origin")).focus({preventScroll:true});}
function favoriteForm(id){
  const current=favorites.find(r=>r.id===id);
  if(!current&&favorites.length>=5){toast("Five routes are saved. Edit or remove one before adding another.");return;}
  const route=current||{name:"",from:state.from,to:state.to};
  mount(current?"Make this route yours.":"Keep a familiar route.",`<p class="dialog-note">Save up to five routes in this browser only. Names and stops are not uploaded or synced. This saves the selected stops, not a train reservation or scenario.</p><form id="favorite-form"><div class="form-grid"><label>Route name<input name="name" maxlength="40" required value="${esc(route.name)}" placeholder="e.g. Home to work"></label><label>Origin<select name="from">${options(route.from)}</select></label><label>Destination<select name="to">${options(route.to)}</select></label></div><p class="form-error" id="favorite-error" role="status"></p><div class="form-actions"><button class="button red">Save route</button><button class="button outline" type="button" data-action="close">Cancel</button></div></form>`);
  $("#favorite-form").addEventListener("submit",e=>{
    e.preventDefault();const f=new FormData(e.target),name=f.get("name").trim(),from=f.get("from"),to=f.get("to");
    let error="";if(!name||name.length>40)error="Use a route name of 1–40 characters.";else if(!station(from)||!station(to)||from===to)error="Choose two different listed stops.";else if(favorites.some(r=>r.id!==id&&r.name.toLowerCase()===name.toLowerCase()))error="This route name is already saved.";else if(favorites.some(r=>r.id!==id&&r.from===from&&r.to===to))error="This station pair is already saved. Edit its existing name instead.";else if(!current&&favorites.length>=5)error="Five routes are already saved.";
    if(error){$("#favorite-error").textContent=error;return;}
    const next={id:current?.id||crypto.randomUUID(),name,from,to};if(current)favorites=favorites.map(r=>r.id===id?next:r);else favorites.push(next);persistFavorites();drawFavorites();close();toast(persistent?"Route saved in this browser.":"Route kept in tab memory; browser storage is unavailable.");
  });
}
function about(){mount("A clearer interface. A clear boundary.",`<p class="dialog-note">Loopline is an independent, original static concept, not affiliated with Caltrain. Every schedule, condition, forecast and notice is fictional. It is not safe to use this demo as a source of travel information.</p><ul class="dialog-list"><li>Demo day: Monday, November 16, 2026, PST (UTC−08:00). The clock starts at 8:10 AM; it is not the current time. +15 minutes and the optional 60-second auto-step alter only the demo clock. At 11:59 PM the demo day stops advancing.</li><li>The source brief lists 32 stops from San Francisco to Gilroy. Increasing list index is southbound. Atherton and Stanford remain visible as legacy listings with no service or weather fixture. The inventory and service rules are not current official Caltrain data.</li><li>Fictional terminal departures run every twenty minutes, 5 AM–9 PM. Local/Limited/Express cycle in that order. Limited and Express use reduced sample stop sets; route positions and travel-time factors are invented. The next five eligible rows are sorted by departure. +1d labels indicate next-day arrivals.</li><li>The delay scenario adds six minutes to Local departures and arrivals. Suspension removes all trains. These are sample notices, not evidence of real disruptions. Recompute runs a local calculation with a short loading state; no fetch takes place.</li><li>Weather and the next three sample hourly forecasts derive from station index and the demo hour. No actual observations, coordinates, geolocation, rain warning, weather provider or API are used.</li><li>Only named saved routes persist, under this app's own browser storage key. Failed storage falls back to tab memory. Invalid entries are sanitized; other websites' or apps' storage is left unchanged.</li><li>This deliverable is HTML/CSS/JavaScript with no runtime backend, not the Next.js/API integration specified for the full PRD. No Next.js, transit/weather API, credentials, accounts or environment variables are connected or required. Framework and live services remain unimplemented.</li></ul>`);}
$("#planner-form").addEventListener("submit",e=>{e.preventDefault();plan($("#origin").value,$("#destination").value);});
$("#swap").addEventListener("click",()=>plan($("#destination").value,$("#origin").value));
$("#scenario").addEventListener("change",e=>{if(!scenarios.includes(e.target.value))return;state.scenario=e.target.value;routeUrl(true);recompute();});
$("#advance").addEventListener("click",()=>{state.now=Math.min(1439,state.now+15);routeUrl(true);recompute();});
$("#refresh").addEventListener("click",recompute);
document.addEventListener("click",e=>{const b=e.target.closest("[data-action]");if(!b)return;const {action,id}=b.dataset;
  if(action==="about")about();
  else if(action==="save"||action==="edit")favoriteForm(action==="edit"?id:undefined);
  else if(action==="load"){const r=favorites.find(x=>x.id===id);if(r){plan(r.from,r.to);$("#today").scrollIntoView();}}
  else if(action==="close")close();
  else if(action==="delete"){const r=favorites.find(x=>x.id===id);if(r)mount("Remove this saved route?",`<p class="dialog-note">${esc(r.name)} will be removed from this app's saved routes only.</p><div class="form-actions"><button class="button danger" data-action="confirm-delete" data-id="${id}">Remove route</button><button class="button outline" data-action="close">Keep route</button></div>`);}
  else if(action==="confirm-delete"){favorites=favorites.filter(r=>r.id!==id);persistFavorites();drawFavorites();close();toast("Saved route removed.");}
  else if(action==="reset-clock"){state.now=490;routeUrl(true);recompute();}
});
$("#close").addEventListener("click",close);dialog.addEventListener("cancel",e=>{e.preventDefault();close();});
window.addEventListener("popstate",()=>{clearTimeout(refreshTimer);restoreRoute();draw();});
setInterval(()=>{if($("#auto").checked){state.now=Math.min(1439,state.now+1);routeUrl();recompute();}},60000);
restoreRoute();routeUrl();draw();
