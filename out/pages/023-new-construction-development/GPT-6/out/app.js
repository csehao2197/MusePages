"use strict";
const $=(s,root=document)=>root.querySelector(s),$$=(s,root=document)=>[...root.querySelectorAll(s)];
const icon=(name)=>`<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
const money=(n)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n);
const plans=[
 {id:"oakmont",name:"The Oakmont",bed:3,bath:2.5,size:1842,stories:1,price:425000,style:"Craftsman",badge:"",rooms:["Great room · 18′ × 16′","Kitchen · 14′ × 12′","Primary suite · 15′ × 14′","Bedroom 2 · 12′ × 11′","Bedroom 3 · 12′ × 11′"],options:"Screened rear porch, study in place of bedroom 3, kitchen island extension."},
 {id:"ashford",name:"The Ashford",bed:4,bath:3,size:2456,stories:2,price:498000,style:"Modern farmhouse",badge:"Most Popular",rooms:["Great room · 20′ × 17′","Kitchen · 15′ × 14′","Primary suite · 16′ × 15′","Bedrooms 2–4 · 12′ × 12′","Loft · 14′ × 12′"],options:"Covered patio, loft built-ins, extended breakfast room."},
 {id:"belmont",name:"The Belmont",bed:4,bath:3.5,size:2890,stories:2,price:565000,style:"Transitional",badge:"",rooms:["Great room · 22′ × 18′","Kitchen · 17′ × 15′","Primary suite · 18′ × 16′","Bedrooms 2–4 · 13′ × 12′","Study · 13′ × 12′"],options:"Primary-suite sitting room, extended garage, outdoor fireplace."},
 {id:"crestview",name:"The Crestview",bed:5,bath:4,size:3218,stories:2,price:639000,style:"Estate",badge:"Model Home Open",rooms:["Great room · 24′ × 20′","Kitchen · 18′ × 16′","Primary suite · 20′ × 17′","Bedrooms 2–5 · 13′ × 12′","Bonus room · 18′ × 16′"],options:"Guest suite on main, bonus-room media package, expanded rear terrace."},
];
let requestedLot=null,compatiblePlan=null,selectedLot=null,galleryIndex=0,zoom=1,mediaAbort=null,mediaObjectURL=null;
function clearVideo(){if(mediaAbort)mediaAbort.abort();mediaAbort=null;const video=$("#tour-video");if(video){video.pause();video.removeAttribute("src");video.load();}if(mediaObjectURL)URL.revokeObjectURL(mediaObjectURL);mediaObjectURL=null;}
const dialogs=$$("dialog");
function openDialog(id){const dialog=$("#"+id);dialogs.filter(d=>d!==dialog&&d.open).forEach(d=>d.close());if(!dialog.open)dialog.showModal();}
function info(title,text){$("#info-title").textContent=title;$("#info-content").replaceChildren();const p=document.createElement("p");p.textContent=text;$("#info-content").append(p);openDialog("info-dialog");}
dialogs.forEach(dialog=>{
 dialog.addEventListener("click",event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
 dialog.addEventListener("close",()=>{if(dialog.id==="media-dialog"){clearVideo();$("#media-content").replaceChildren();}if(dialog.id==="info-dialog"){$("#info-content").replaceChildren();$("#info-title").textContent="";}});
});
document.addEventListener("click",event=>{const close=event.target.closest("[data-close]");if(close)$("#"+close.dataset.close).close();});
$("#menu-open").addEventListener("click",()=>openDialog("nav-dialog"));
$$("a",$("#nav-dialog")).forEach(a=>a.addEventListener("click",()=>$("#nav-dialog").close()));
const infoPages={
 phone:["Example sales phone","919-555-0142 is the fictional brief's example number, not a verified sales contact. No call is initiated. Tour requests on this page are private local previews."],
 lender:["Pre-qualification, without the guesswork","No lender integration is configured, so this page cannot pre-qualify you or collect financial details. The March 2026 rate and April 30, 2026 incentive are historical brief examples, not current offers. A verified lender would need income, credit and loan details; never provide them to this concept page."],
 about:["Crestwood Homes — the concept","This independent creative study illustrates a regional homebuilder and a fictional 86-home community from the supplied brief. It is not operated by or affiliated with an actual builder. Floor plans, inventory, specifications and testimonials are illustrative."],
 communities:["Other communities","Ridgeline is the one community represented in this homepage concept. Other communities have not been supplied or verified; no external inventory is available here."],
 careers:["Build a career, thoughtfully","This concept does not represent a hiring organization and accepts no applications. A verified homebuilder's own careers page is the appropriate source for real openings."],
 warranty:["Understanding a new-home warranty","A real purchase should include written structural, systems and workmanship terms, exclusions, claim instructions and a named warranty provider. No warranty period, coverage or provider is established by this illustration."],
 refer:["A good place to share","Share this page's address as a design concept. No referral reward, sales program or personal-information collection is available."],
 social:["Follow the real source","Verified Crestwood social accounts were not provided. This example does not invent an Instagram or Facebook account or imply endorsement."],
 privacy:["Your information stays here","Forms validate and display a local preview only. Nothing is transmitted or stored, and fields are cleared after a valid preview. Closing the preview removes displayed personal details. Local fonts, images and videos are served with the page; external map searches open only when you choose the link."],
 terms:["A design concept, not a sales offer","All inventory, plans, lot details, ratings, certifications, prices, license number and quotes are unverified examples from a creative brief. Original illustrations and stock photographs do not depict an actual community. Expired incentives are not live offers. Obtain verified plans, contract terms, legal disclosures and financial advice before a real purchase."],
};
document.addEventListener("click",event=>{const button=event.target.closest("[data-info]");if(button){const content=infoPages[button.dataset.info];if(content)info(...content);}});
const highlights=[
 ["pool","Resort-style pool & clubhouse","Opens summer 2026, per the original brief"],
 ["tree","12 acres of preserved green space","Walking trails for a little everyday escape"],
 ["playground","Two playgrounds + sand volleyball court","Room to play, right around the corner"],
 ["school","Zoned for top-rated Wake County schools","Cedar Creek Elementary · Panther Creek High (unverified)"],
 ["shop","5 minutes to your everyday favorites","Costco · Whole Foods · Crossroads Plaza (example)"],
 ["health","8 minutes to WakeMed Cary Hospital","Illustrative driving time from the brief"],
];
$("#highlights").innerHTML=highlights.map(([i,title,detail])=>`<div class="highlight">${icon(i)}<div>${title}<small>${detail}</small></div></div>`).join("");
function renderPlans(){
 const matches=plans.filter(p=>(!$("#bed-filter").value||p.bed===Number($("#bed-filter").value))&&p.size<=Number($("#size-filter").value)&&p.price<=Number($("#price-filter").value)&&(!$("#story-filter").value||p.stories===Number($("#story-filter").value)));
 $("#size-output").textContent=Number($("#size-filter").value).toLocaleString("en-US")+" sq ft";
 $("#plan-count").textContent=`${matches.length} of 4 floor plans match your preferences.`;
 $("#plan-grid").innerHTML=matches.length?matches.map(p=>`<article class="plan-card"><div class="plan-visual"><img src="assets/${p.id}.svg" alt="Original ${p.style.toLowerCase()} concept illustration for ${p.name}" loading="lazy">${p.badge?`<span class="badge">${p.badge}</span>`:""}</div><div class="plan-body"><div class="plan-title-row"><h3>${p.name}</h3><strong><small>STARTING FROM</small>${money(p.price)}</strong></div><div class="specs"><span>${icon("bed")}${p.bed} bed</span><span>${icon("bath")}${p.bath} bath</span><span>${icon("area")}${p.size.toLocaleString("en-US")} sq ft</span><span>${icon("house")}${p.stories}-story</span></div><div class="actions"><button class="button outline" data-plan="${p.id}">View Floor Plan</button><button class="button" data-availability="${p.id}">Check Availability${icon("right")}</button></div></div></article>`).join(""):'<p class="empty">No plans match these filters. Reset or widen your preferences to see more possibilities.</p>';
}
$("#filters").addEventListener("input",renderPlans);$("#filters").addEventListener("change",renderPlans);$("#filters").addEventListener("reset",()=>setTimeout(renderPlans));
function drawing(p,level){
 const names=level===0?(p.stories===1?["Great room","Kitchen / dining","Primary suite","Bedroom 2","Bedroom 3","2.5 baths / utility"]:["Great room","Kitchen / dining","Study / guest flex","Entry / stairs","Bath / utility","Garage / porch"]):Array.from({length:6},(_,i)=>i<p.bed?(i===0?"Primary suite":`Bedroom ${i+1}`):i===p.bed?"Bath / laundry":"Loft / stairs");
 return `<figure><figcaption>${p.stories===1?"Main level":level===0?"Main level":"Upper level"} · illustrative, not to scale</figcaption><svg viewBox="0 0 480 340" role="img" aria-label="${p.name} ${level===0?"main":"upper"} level room schematic"><rect x="14" y="12" width="452" height="316" fill="#fafbf8" stroke="#334155" stroke-width="5"/>${names.map((name,i)=>{const x=14+(i%2)*226,y=12+Math.floor(i/2)*105;return`<rect x="${x}" y="${y}" width="226" height="105" fill="${i===0?"#edf4ea":"#fafbf8"}" stroke="#64748b" stroke-width="2"/><text x="${x+113}" y="${y+50}" font-family="sans-serif" font-size="13" text-anchor="middle" fill="#334155">${name}</text><path d="M${x+84} ${y+105}h50" stroke="#fafbf8" stroke-width="5"/><path d="M${x+84} ${y+104}a35 35 0 0 1 35-35v35" fill="none" stroke="#a3aeb9" stroke-width="1.3"/>`;}).join("")}</svg></figure>`;
}
function openPlan(id){
 const p=plans.find(p=>p.id===id);if(!p)return;
 $("#plan-detail").innerHTML=`<div class="plan-detail-top"><img src="assets/${p.id}.svg" alt="${p.style} exterior concept"><div><p class="eyebrow">${p.style.toUpperCase()} · MADE FOR YOUR NEXT CHAPTER</p><h2 id="plan-title">${p.name}</h2><p>${p.bed} bedrooms · ${p.bath} baths · ${p.size.toLocaleString("en-US")} sq ft · ${p.stories} ${p.stories===1?"level":"levels"}<br><b>From ${money(p.price)}</b></p></div></div><p class="local-note">Original illustrative layouts and example room dimensions, not construction drawings or verified architectural plans.</p><div class="floor-drawings">${Array.from({length:p.stories},(_,i)=>drawing(p,i)).join("")}</div><div class="plan-detail-bottom"><div><h3>Room dimensions</h3><ul>${p.rooms.map(r=>`<li>${r}</li>`).join("")}</ul></div><div><h3>Included from day one</h3><ul><li>Granite counters, stainless appliances, 36″ cabinets</li><li>Main-level LVP, fiber cement siding, front sod</li><li>Keypad entry, 2×6 framing, tankless water heater</li></ul><h3>Make it your own</h3><p>${p.options} All options are illustrative and unpriced.</p></div></div><button class="button" data-pricing="${p.id}">Request Pricing ${icon("right")}</button>`;
 openDialog("plan-dialog");
}
document.addEventListener("click",event=>{
 const plan=event.target.closest("[data-plan]");if(plan)openPlan(plan.dataset.plan);
 const pricing=event.target.closest("[data-pricing]");if(pricing){$("#plan-dialog").close();prefill(pricing.dataset.pricing,"Get Pricing Info");}
 const availability=event.target.closest("[data-availability]");if(availability){compatiblePlan=availability.dataset.availability;$("#lot-filter").value="available";renderLots();const lot=lots.find(l=>l.status==="available"&&l.plans.includes(compatiblePlan));if(lot)selectLot(lot.number);$("#availability").scrollIntoView();$("#lot-filter").focus({preventScroll:true});}
});
const lots=Array.from({length:86},(_,i)=>{
 const number=i+1,status=number<=46?"sold":number<=60?"available":number<=83?"contract":"model",acre=Number((.25+(i%16)*.01).toFixed(2));
 return{number,status,acre,orientation:["South-facing backyard","East-facing backyard","North-facing backyard","West-facing backyard"][i%4],feature:i%3===0?"Backs to green space":i%3===1?"Corner lot":"Interior garden homesite",plans:plans.filter(p=>p.id==="oakmont"||(p.id==="ashford"&&acre>=.27)||(p.id==="belmont"&&acre>=.30)||(p.id==="crestview"&&acre>=.35)).map(p=>p.id)};
});
const statusNames={available:"Available",contract:"Under contract",sold:"Sold",model:"Model home"},colors={available:"#22c55e",contract:"#f59e0b",sold:"#94a3b8",model:"#1d4ed8"};
function renderLots(){
 const filtered=lots.filter(l=>(!$("#lot-filter").value||l.status===$("#lot-filter").value)&&(!compatiblePlan||l.plans.includes(compatiblePlan)));
 const background=`<rect width="1100" height="620" fill="#f1f3e7"/><path d="M407 50V590M659 50V590M20 284H1080" stroke="#d7ddce" stroke-width="38"/><path d="M407 50V590M659 50V590M20 284H1080" stroke="#fff" stroke-width="24"/><rect x="440" y="75" width="187" height="470" rx="80" fill="#cedfbc"/><path d="M483 90q95 90 0 190t0 250" fill="none" stroke="#f8faf2" stroke-width="8"/><rect x="480" y="148" width="105" height="50" rx="8" fill="#8abbd2"/><text x="533" y="225" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#526741">POOL &amp; CLUBHOUSE</text><text x="533" y="390" text-anchor="middle" font-family="serif" font-size="20" fill="#526741">Community green</text><text x="533" y="411" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#526741">TRAILS · PLAY · BELONG</text><text x="40" y="30" font-family="sans-serif" font-size="12" fill="#64748b">PHASE 1 · SOLD OUT</text><text x="700" y="30" font-family="sans-serif" font-size="12" fill="#1d4ed8">PHASE 2 · SELLING NOW</text><text x="930" y="562" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#64748b">PHASE 3 · COMING Q4 2026</text><text x="930" y="580" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#64748b">Future area / illustrative schedule</text><text x="30" y="610" font-family="sans-serif" font-size="9" fill="#64748b">ORIGINAL SCHEMATIC · NOT A SURVEY · EXAMPLE LOT NUMBERS</text><text x="1060" y="60" font-family="sans-serif" font-size="18" fill="#64748b">N ↑</text>`;
 $("#site-svg").innerHTML=background.replace('x="700" y="30"','x="40" y="580"')+lots.map((l,i)=>{const c=i%10,r=Math.floor(i/10),x=35+c*75+(c>=5?270:0),y=55+r*52+(r>=4?40:0),show=filtered.includes(l),interactive=show&&(l.status==="available"||l.status==="model");return `<g ${interactive?'role="button" tabindex="0"':`role="img" ${show&&l.status==="contract"?'tabindex="0"':""}`} aria-label="Lot ${l.number}, ${statusNames[l.status].toLowerCase()}, ${l.acre.toFixed(2)} acres" ${interactive?`data-lot="${l.number}"`:""} ${selectedLot===l.number?'aria-pressed="true"':""} opacity="${show?1:.18}"><title>Lot ${l.number} · ${statusNames[l.status]} · ${l.acre.toFixed(2)} acres</title>${interactive?`<rect x="${x-5}" y="${y-5}" width="66" height="52" fill="transparent" stroke="none"/>`:""}<rect x="${x}" y="${y}" width="56" height="42" rx="3" fill="${colors[l.status]}" stroke="${selectedLot===l.number?"#0f172a":"#fff"}" stroke-width="${selectedLot===l.number?3:2}"/><text x="${x+28}" y="${y+26}" text-anchor="middle" font-size="13" font-family="sans-serif" fill="${l.status==="available"||l.status==="contract"?"#16391d":"#fff"}">${l.number}</text></g>`;}).join("");
 $("#lot-list").innerHTML=`<p class="fine">${filtered.length} matching homesites${compatiblePlan?` compatible with ${plans.find(p=>p.id===compatiblePlan).name}`:""}. Available first.</p>`+filtered.toSorted((a,b)=>["available","model","contract","sold"].indexOf(a.status)-["available","model","contract","sold"].indexOf(b.status)||a.number-b.number).map(l=>{
  const content=`<span class="lot-list-heading"><b>Lot ${l.number} · ${l.acre.toFixed(2)} acres</b><span class="status">${statusNames[l.status]}</span></span><small>${l.orientation} · ${l.feature}</small>`;
  return l.status==="available"||l.status==="model"?`<button data-lot="${l.number}" aria-label="View Lot ${l.number}, ${statusNames[l.status].toLowerCase()}">${content}</button>`:`<article aria-label="Lot ${l.number}, ${statusNames[l.status].toLowerCase()}">${content}</article>`;
 }).join("");
}
function selectLot(number){
 const l=lots.find(l=>l.number===number);if(!l||!["available","model"].includes(l.status))return;selectedLot=number;
 $("#lot-detail").innerHTML=`<p class="eyebrow">${statusNames[l.status].toUpperCase()} · EXAMPLE HOMESITE</p><h3>Lot ${l.number}<br><span>${l.acre.toFixed(2)} acres</span></h3><p>${l.orientation}<br><b>${l.feature}</b></p><p><b>Compatible floor plans</b><br>${l.plans.map(id=>plans.find(p=>p.id===id).name).join(" · ")}</p><small>Compatibility, premiums and boundaries are illustrative; no live inventory or pricing is connected.</small><button class="button" data-lot-request="${l.number}">${l.status==="model"?"Tour This Model Home":"Request Info on This Lot"}${icon("right")}</button>`;
 renderLots();
}
$("#site-svg").addEventListener("click",e=>{const target=e.target.closest("[data-lot]");if(target)selectLot(Number(target.dataset.lot));});
$("#site-svg").addEventListener("keydown",e=>{const target=e.target.closest("[data-lot]");if(target&&["Enter"," "].includes(e.key)){e.preventDefault();const n=Number(target.dataset.lot);selectLot(n);$(`[data-lot="${n}"]`,$("#site-svg")).focus();}});
$("#lot-list").addEventListener("click",e=>{const target=e.target.closest("[data-lot]");if(target)selectLot(Number(target.dataset.lot));});
$("#lot-filter").addEventListener("change",()=>{compatiblePlan=null;renderLots();});
function viewLots(list){$("#lot-list").hidden=!list;$("#site-map").hidden=list;$("#map-view").classList.toggle("active",!list);$("#list-view").classList.toggle("active",list);$("#map-view").setAttribute("aria-pressed",String(!list));$("#list-view").setAttribute("aria-pressed",String(list));$(".zoom-tools").hidden=list;}
$("#map-view").addEventListener("click",()=>viewLots(false));$("#list-view").addEventListener("click",()=>viewLots(true));
function setZoom(value){zoom=Math.max(1,Math.min(2.5,value));$("#site-svg").style.width=(zoom*100)+"%";$("#zoom-label").textContent=Math.round(zoom*100)+"%";$("#zoom-in").disabled=zoom>=2.5;$("#zoom-out").disabled=zoom<=1;}
$("#zoom-in").addEventListener("click",()=>setZoom(zoom+.25));$("#zoom-out").addEventListener("click",()=>setZoom(zoom-.25));$("#zoom-reset").addEventListener("click",()=>{setZoom(1);$("#site-map").scrollTo(0,0);});
const modelHomes=[{id:"crestview",photo:"living.jpg",name:"The Crestview",spec:"3,218 sq ft · 5 bed · 4 bath"},{id:"ashford",photo:"kitchen.jpg",name:"The Ashford",spec:"2,456 sq ft · 4 bed · 3 bath"}];
$("#tour-grid").innerHTML=modelHomes.map(p=>`<article class="tour-card"><div class="tour-photo"><img src="assets/${p.photo}" alt="Illustrative furnished ${p.id==="crestview"?"living room":"kitchen"}" loading="lazy"><button class="play-button" data-video="${p.id}" aria-label="Play ${p.name} illustrative virtual tour">${icon("play")}</button></div><div class="plan-body"><p class="eyebrow">WELCOME INSIDE · STOCK-IMAGE VIDEO</p><h3>${p.name} — Model Home</h3><p>${p.spec}</p><div class="actions"><button class="button" data-video="${p.id}">Take Virtual Tour${icon("play")}</button><button class="button outline" data-tour="${p.id}">Schedule In-Person Tour</button></div></div></article>`).join("");
const gallery=[["kitchen.jpg","Kitchen"],["bath.jpg","Primary bath"],["living.jpg","Great room"],["yard.jpg","Backyard inspiration"],["crestview.svg","Front porch concept"],["office.jpg","Home office"]];
$("#gallery-strip").innerHTML=gallery.map(([file,name],i)=>`<button data-photo="${i}" aria-label="Expand ${name.toLowerCase()} photo"><img src="assets/${file}" alt="${name}, illustrative ${file.endsWith("svg")?"drawing":"stock photo"}" loading="lazy"><span>${name}${icon("plus")}</span></button>`).join("");
function photo(index){galleryIndex=(index+gallery.length)%gallery.length;const[file,name]=gallery[galleryIndex];$("#media-title").textContent=name;$("#media-content").innerHTML=`<img src="assets/${file}" alt="${name}, illustrative stock or original concept image"><div class="media-nav"><button class="button outline" id="photo-prev">← Previous</button><span>Image ${galleryIndex+1} of ${gallery.length}</span><button class="button outline" id="photo-next">Next →</button></div><p class="fine">Illustrative stock photos from unrelated properties; porch is an original concept drawing, not a photograph of this community.</p>`;$("#photo-prev").addEventListener("click",()=>{photo(galleryIndex-1);$("#photo-prev").focus();});$("#photo-next").addEventListener("click",()=>{photo(galleryIndex+1);$("#photo-next").focus();});}
async function openVideo(p){
 clearVideo();const controller=new AbortController();mediaAbort=controller;
 $("#media-title").textContent=p.name+" · illustrative video walkthrough";
 $("#media-content").innerHTML=`<video id="tour-video" controls playsinline poster="assets/${p.photo}" aria-label="${p.name} 14-second illustrative room video" aria-busy="true"></video><p class="fine" id="video-status" role="status">Loading the local video…</p><p class="fine">A real, locally playable 14-second video made from stock room photographs with gentle camera movement. Not this property, not live footage and not an interactive 360° scan. No sound.</p>`;
 openDialog("media-dialog");
 try{
  const response=await fetch(`assets/${p.id}-tour.webm`,{signal:controller.signal});if(!response.ok)throw Error("Video unavailable");const blob=await response.blob();
  if(mediaAbort!==controller||!$("#media-dialog").open)return;
  mediaObjectURL=URL.createObjectURL(new Blob([blob],{type:"video/webm"}));$("#tour-video").src=mediaObjectURL;$("#tour-video").setAttribute("aria-busy","false");$("#video-status").textContent="Video ready. Press Play to explore; use the timeline to seek.";
 }catch(error){if(error.name!=="AbortError"&&mediaAbort===controller&&$("#video-status"))$("#video-status").textContent="The local video could not load. Close and reopen to retry.";}
}
document.addEventListener("click",e=>{
 const image=e.target.closest("[data-photo]");if(image){photo(Number(image.dataset.photo));openDialog("media-dialog");}
 const video=e.target.closest("[data-video]");if(video)openVideo(modelHomes.find(p=>p.id===video.dataset.video));
 const tour=e.target.closest("[data-tour]");if(tour)prefill(tour.dataset.tour,"Schedule a Tour");
 const lot=e.target.closest("[data-lot-request]");if(lot){requestedLot=Number(lot.dataset.lotRequest);prefill(null,"Get Pricing Info");}
});
$("#media-dialog").addEventListener("keydown",e=>{if(!$("#tour-video")&&["ArrowLeft","ArrowRight"].includes(e.key)){e.preventDefault();photo(galleryIndex+(e.key==="ArrowRight"?1:-1));$(e.key==="ArrowRight"?"#photo-next":"#photo-prev").focus();}});
const features=[
 ["Kitchen","Granite countertops; stainless steel appliances; 36″ cabinets.","Quartz waterfall island; GE Café series; 42″ soft-close cabinets with under-cabinet lighting."],
 ["Flooring","LVP throughout the main level.","Hardwood throughout + tile in all baths."],
 ["Exterior","Fiber cement siding; sodded front yard.","Stone/brick accent facades; full landscape package with irrigation."],
 ["Smart Home","Schlage keypad entry.","Ring security system + Nest thermostat + motorized blinds."],
 ["Energy","Energy Star certified, 2×6 wall framing, tankless water heater, per brief.","The same energy specification is standard on every home, per brief."],
];
for(const[panel,index,title]of[["standard-panel",1,"A beautiful beginning."],["premium-panel",2,"A little more you."]])$("#"+panel).innerHTML=`<p class="eyebrow">${index===1?"INCLUDED AS STANDARD":"PREMIUM UPGRADE PACKAGE"}</p><h3>${title}</h3>${features.map(row=>`<div class="feature-row"><b>${row[0]}</b><p>${row[index]}</p></div>`).join("")}`;
function featureTab(index,focus=false){$$("[role=tab]",$(".feature-tabs")).forEach((tab,i)=>{tab.setAttribute("aria-selected",String(i===index));tab.tabIndex=i===index?0:-1;if(i===index&&focus)tab.focus();});$("#standard-panel").classList.toggle("mobile-hidden",index!==0);$("#premium-panel").classList.toggle("mobile-hidden",index!==1);}
$$("[role=tab]",$(".feature-tabs")).forEach((tab,i)=>{tab.addEventListener("click",()=>featureTab(i));tab.addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight","Home","End"].includes(e.key)){e.preventDefault();featureTab(e.key==="Home"?0:e.key==="End"?1:1-i,true);}});});
const reviews=[
 ["We looked at resale homes for 6 months and everything needed $40K+ in updates. Building new with Crestwood meant we got exactly what we wanted — and the warranty gave us peace of mind.","The Martinez Family","Lot 22"],
 ["The build process was transparent. We had a dedicated project manager, a portal to track progress, and they finished 2 weeks ahead of schedule.","Jason & Emily P.","Lot 38"],
 ["Ridgeline sold us — the pool, the trails, the schools. Our kids ride bikes to the playground every afternoon. It feels like a real neighborhood.","Sarah L.","Lot 51"],
];
$("#reviews").innerHTML=reviews.map(([quote,name,lot])=>`<article class="review"><div class="stars" aria-label="5 out of 5 example stars">${icon("star").repeat(5)}</div><blockquote>“${quote}”</blockquote><cite>${name}</cite><small>${lot} · Illustrative brief quotation</small></article>`).join("");
$("#interest-choices").innerHTML=plans.map(p=>`<label class="choice"><input type="checkbox" name="interest" value="${p.id}">${p.name}</label>`).join("");
function localDate(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;}
function minDate(){const d=new Date();d.setDate(d.getDate()+1);return localDate(d);}
$("#tour-date").min=minDate();
function purpose(){const tour=$('input[name="purpose"]:checked').value==="Schedule a Tour";$("#tour-date").required=tour;$("#tour-date").disabled=!tour;$("#date-help").textContent=tour?"Tomorrow onward, Thu–Mon only. Models are closed Tue–Wed.":"A date is optional for information requests.";$("#contact-submit").firstChild.textContent=tour?"Request My Tour":"Preview My Request";}
$$('input[name="purpose"]').forEach(r=>r.addEventListener("change",purpose));
function prefill(id,value){dialogs.filter(d=>d.open).forEach(d=>d.close());if(id){requestedLot=null;$(`input[name="interest"][value="${id}"]`).checked=true;}$(".local-note",$("#contact-form")).textContent=requestedLot?`Private local preview · Lot ${requestedLot} selected. Nothing is sent, saved or booked.`:"Private local preview · Nothing is sent, saved or booked.";$(`input[name="purpose"][value="${value}"]`).checked=true;purpose();$("#contact").scrollIntoView();$('input[name="first"]').focus({preventScroll:true});}
$("#contact-form").addEventListener("input",e=>{if(e.target.setCustomValidity)e.target.setCustomValidity("");});
$("#contact-form").addEventListener("change",e=>{if(e.target.setCustomValidity)e.target.setCustomValidity("");if(e.target.name==="interest")$$('input[name="interest"]').forEach(input=>input.setCustomValidity(""));});
$("#contact-form").addEventListener("submit",e=>{
 e.preventDefault();const form=e.currentTarget,first=form.elements.first,last=form.elements.last;
 for(const input of[first,last])if(!input.value.trim()){input.setCustomValidity("Please enter a name, not only spaces.");input.reportValidity();return;}
 if(form.elements.phone.value.replace(/\D/g,"").length<7){form.elements.phone.setCustomValidity("Please enter at least seven phone digits.");form.elements.phone.reportValidity();return;}
 if(!$$('input[name="interest"]:checked').length){form.elements.interest[0].setCustomValidity("Choose at least one plan.");form.elements.interest[0].reportValidity();return;}
 if($("#tour-date").required){$("#tour-date").min=minDate();const day=new Date($("#tour-date").value+"T12:00:00").getDay();if($("#tour-date").value<minDate()||day===2||day===3){$("#tour-date").setCustomValidity("Choose tomorrow or later on Thursday through Monday.");$("#tour-date").reportValidity();return;}}
 if(!form.reportValidity())return;
 const data=new FormData(form),selected=data.getAll("interest").map(id=>plans.find(p=>p.id===id).name);
 info("Your local request preview","Nothing was sent or booked. This preview disappears when closed.");
 const dl=document.createElement("dl");for(const[label,value]of[["Name",`${first.value.trim()} ${last.value.trim()}`],["Email",data.get("email")],["Phone",data.get("phone")],["Interest",selected.join(" · ")],["Request",data.get("purpose")],["Date",data.get("date")||"Not requested"],["Homesite",requestedLot?`Lot ${requestedLot}`:"No lot selected"],["Notes",data.get("notes")||"None"]]){const div=document.createElement("div"),dt=document.createElement("dt"),dd=document.createElement("dd");dt.textContent=label;dd.textContent=value;div.append(dt,dd);dl.append(div);}$("#info-content").append(dl);form.reset();$$("input,textarea",form).forEach(input=>input.setCustomValidity(""));requestedLot=null;$(".local-note",form).textContent="Private local preview · Nothing is sent, saved or booked.";purpose();$("#tour-date").min=minDate();
});
const footerGroups=[
 ["Community",[["Overview","#community"],["Floor Plans","#plans"],["Availability","#availability"],["Gallery","#gallery"],["Amenities","#community"]]],
 ["Buying",[["Financing","#financing"],["Incentives","#financing"],["FAQ","#faq"],["Build Process Timeline","#faq"]]],
 ["Crestwood Homes",[["About","about"],["Other Communities","communities"],["Careers","careers"],["Warranty","warranty"],["Refer a Friend","refer"]]],
 ["Connect",[["Contact Sales","#contact"],["Schedule Tour","#contact"],["Newsletter","newsletter"],["Instagram","social"],["Facebook","social"]]],
];
$("#footer-links").innerHTML=footerGroups.map(([title,links])=>`<details open><summary>${title}</summary><div>${links.map(([name,target])=>target.startsWith("#")?`<a href="${target}">${name}</a>`:`<button data-info="${target}">${name}</button>`).join("")}</div></details>`).join("");
document.addEventListener("click",e=>{if(e.target.closest('[data-info="newsletter"]')){info("A little more Ridgeline, in your inbox","Local example only. Preview an email preference; nothing will be sent or subscribed.");const form=document.createElement("form");form.innerHTML='<label>Email<input type="email" name="email" required autocomplete="email" maxlength="160"></label><label class="choice consent"><input type="checkbox" required>I understand this is a local preview only.</label><button class="button" type="submit">Preview newsletter preference</button>';form.addEventListener("submit",e=>{e.preventDefault();if(!form.reportValidity())return;const email=form.elements.email.value;form.reset();info("Preference preview only",`${email} would receive community updates. No subscription was made. Closing this preview clears the displayed email.`);});$("#info-content").append(form);}});
const mobile=matchMedia("(max-width:760px)");
function responsive(){const small=mobile.matches;$("#plan-filters").open=!small;$$("details",$("#footer-links")).forEach(d=>d.open=!small);viewLots(small);if(!small&&$("#nav-dialog").open)$("#nav-dialog").close();}
mobile.addEventListener("change",responsive);
const counter=$("[data-counter]");if(!matchMedia("(prefers-reduced-motion:reduce)").matches){new IntersectionObserver((entries,observer)=>{if(entries[0].isIntersecting){const start=performance.now();function animate(now){const t=Math.min(1,(now-start)/900);counter.textContent=money(Math.round(425000*(1-(1-t)**3)));if(t<1)requestAnimationFrame(animate);}requestAnimationFrame(animate);observer.disconnect();}},{threshold:.6}).observe(counter);}
renderPlans();renderLots();setZoom(1);featureTab(0);purpose();responsive();
