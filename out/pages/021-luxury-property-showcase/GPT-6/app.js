"use strict";
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const icon = (name) => `<svg aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
const money = (value, decimals = 0) => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:decimals,minimumFractionDigits:decimals}).format(value);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const scrollBehavior = () => reducedMotion.matches ? "auto" : "smooth";
const photos = [
  ["living-dusk.jpg","Living room · Dusk","City windows framing an illustrative contemporary living room at dusk"],
  ["living-day.jpg","Living room · Daylight","Illustrative daylight living room with teal seating and a city view"],
  ["kitchen.jpg","Kitchen & dining","Illustrative kitchen with warm wood cabinetry and a large island"],
  ["primary.jpg","Primary suite","Illustrative bedroom with a made bed, lounge chairs and chandelier"],
  ["bath.jpg","Primary bathroom","Illustrative bathroom with freestanding soaking tub and stone finishes"],
  ["guest.jpg","Guest bedroom","Illustrative guest bedroom with upholstered bed and adjoining bathroom"],
  ["office.jpg","Home office","Illustrative desk beside a sunlit residential window"],
  ["wine.jpg","Wine cellar","Illustrative wine storage and dining interior with timber shelving"],
  ["terrace.jpg","Private terrace","Illustrative high-rise terrace seating with a city view"],
  ["terrace-evening.jpg","Terrace · Another angle","Another daylight angle of illustrative rooftop seating"],
  ["lobby.jpg","Residents' lobby","Illustrative lounge lobby with curved wood ceiling and tall windows"],
  ["pool.jpg","Pool deck","Illustrative outdoor pool with city towers and lounge chairs"],
  ["gym.jpg","Fitness center","Illustrative fitness center with strength and cardio equipment"],
  ["dining.jpg","Open kitchen · Alternate study","Illustrative contemporary kitchen with exposed brick and a cooking island"]
];
const photoGrid = $("#photo-grid");
photoGrid.innerHTML = photos.map(([file,title,alt],index)=>`<button class="photo-tile reveal" type="button" data-photo="${index}" aria-label="Open photograph: ${title}"><img src="assets/${file}" alt="${alt}" width="1100" height="734" loading="lazy"><span>${title}</span></button>`).join("");
let photoIndex = 0;
const photoDialog = $("#photo-dialog");
function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  const [file,title,alt] = photos[photoIndex];
  $("#lightbox-image").src = `assets/${file}`;
  $("#lightbox-image").alt = alt;
  $("#photo-title").textContent = title;
  $("#photo-count").textContent = `${photoIndex + 1} of ${photos.length}`;
}
function openPhoto(index) { showPhoto(index); photoDialog.showModal(); }
photoGrid.addEventListener("click",(event)=>{ const tile=event.target.closest("[data-photo]"); if (tile) openPhoto(Number(tile.dataset.photo)); });
$("#gallery-open").addEventListener("click",()=>openPhoto(0));
$("#photo-prev").addEventListener("click",()=>showPhoto(photoIndex-1));
$("#photo-next").addEventListener("click",()=>showPhoto(photoIndex+1));
$("#photo-close").addEventListener("click",()=>photoDialog.close());
photoDialog.addEventListener("keydown",(event)=>{
  if (event.key==="ArrowLeft" || event.key==="ArrowRight") { event.preventDefault(); showPhoto(photoIndex+(event.key==="ArrowRight" ? 1 : -1)); }
});
let photoTouch = null;
$("#lightbox-image").addEventListener("pointerdown",(event)=>{ if (event.pointerType==="touch") photoTouch={x:event.clientX,y:event.clientY}; });
$("#lightbox-image").addEventListener("pointerup",(event)=>{
  if (!photoTouch) return;
  const dx=event.clientX-photoTouch.x,dy=event.clientY-photoTouch.y;
  if (Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)) showPhoto(photoIndex+(dx<0 ? 1 : -1));
  photoTouch=null;
});
$("#lightbox-image").addEventListener("pointercancel",()=>{photoTouch=null;});
photoDialog.addEventListener("close",()=>{ $("#lightbox-image").removeAttribute("src"); photoTouch=null; });

function horizontalStrip(element,previous,next) {
  const step = () => element.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(element).columnGap || 0);
  const update = () => {
    previous.disabled=element.scrollLeft<2;
    next.disabled=element.scrollLeft+element.clientWidth>=element.scrollWidth-2;
  };
  const move=(direction)=>element.scrollBy({left:step()*direction,behavior:scrollBehavior()});
  previous.addEventListener("click",()=>move(-1)); next.addEventListener("click",()=>move(1));
  element.addEventListener("scroll",update,{passive:true});
  element.addEventListener("keydown",(event)=>{
    if (event.target===element && ["ArrowLeft","ArrowRight"].includes(event.key)) { event.preventDefault(); move(event.key==="ArrowRight" ? 1 : -1); }
  });
  window.addEventListener("resize",update); update();
}
const roomData = [
  ["Primary Suite","18' × 22'",670,180,260,240,"A private primary suite with the original supplied room dimensions."],
  ["Living Room","24' × 30'",70,180,380,240,"The central living space, shown adjoining the kitchen and terrace."],
  ["Kitchen","16' × 20'",470,180,180,240,"An illustrative kitchen position next to the living room."],
  ["Home Office","12' × 14'",670,440,260,190,"A separate workspace shown on the quiet side of the schematic."],
  ["Guest Bedroom 1","14' × 16'",70,440,180,190,"The first guest bedroom with original supplied dimensions."],
  ["Guest Bedroom 2","12' × 14'",270,440,180,190,"The second guest bedroom with original supplied dimensions."],
  ["Guest Bedroom 3","12' × 12'",470,440,180,190,"The third guest bedroom with original supplied dimensions."]
];
$("#room-list").innerHTML=roomData.map(([name,size],index)=>`<button type="button" class="room-option" data-room="${index}" aria-pressed="false">${name}<span>${size}</span></button>`).join("");
$("#floor-hotspots").innerHTML=roomData.map(([name,size,x,y,width,height],index)=>`<button type="button" class="room-hotspot" data-room="${index}" aria-label="Highlight ${name}, ${size}" aria-pressed="false" style="left:${x/10}%;top:${y/7.4}%;width:${width/10}%;height:${height/7.4}%"></button>`).join("");
$$("[data-room]").forEach((button)=>button.addEventListener("click",()=>{
  const index=Number(button.dataset.room),[name,size,,,,,description]=roomData[index];
  $$("[data-room]").forEach((item)=>item.setAttribute("aria-pressed",String(Number(item.dataset.room)===index)));
  $("#room-detail").textContent=`${name} · ${size}. ${description} Illustrative placement, not to scale or verified.`;
}));
let floorZoom=1;
function zoomFloor(value) {
  const viewport=$("#floor-viewport"),old=floorZoom;
  floorZoom=Math.min(3,Math.max(1,value));
  $("#floor-inner").style.width=`${floorZoom*100}%`;
  viewport.scrollLeft=(viewport.scrollLeft+viewport.clientWidth/2)*floorZoom/old-viewport.clientWidth/2;
  viewport.scrollTop=(viewport.scrollTop+viewport.clientHeight/2)*floorZoom/old-viewport.clientHeight/2;
  $("#floor-zoom").textContent=`${Math.round(floorZoom*100)}%`;
  $("#floor-out").disabled=floorZoom===1; $("#floor-in").disabled=floorZoom===3;
}
$("#floor-in").addEventListener("click",()=>zoomFloor(floorZoom+.25));
$("#floor-out").addEventListener("click",()=>zoomFloor(floorZoom-.25));
$("#floor-reset").addEventListener("click",()=>{zoomFloor(1);$("#floor-viewport").scrollTo(0,0);});
$("#floor-viewport").addEventListener("keydown",(event)=>{
  if (["+","=","-","0"].includes(event.key)) { event.preventDefault(); zoomFloor(event.key==="0" ? 1 : floorZoom+(event.key==="-" ? -.25 : .25)); }
});
zoomFloor(1);
const features = [
  ["Kitchen","kitchen",["Sub-Zero refrigerator","Wolf range","Miele dishwasher","Waterfall quartzite island"]],
  ["Bathrooms","bath",["Heated floors","Rain shower","Freestanding soaking tub","Toto fixtures"]],
  ["Living","living",["Wide-plank European oak floors","11-ft ceilings","Gas fireplace","Automated shades"]],
  ["Technology","technology",["Savant smart home system","Integrated Sonos","Keyless entry","EV charging"]],
  ["Outdoor","outdoor",["600 sq ft private terrace","Built-in BBQ","Plunge pool","Panoramic views"]],
  ["Security","security",["24/7 concierge","Private elevator access","Biometric entry","Video intercom"]]
];
$("#feature-grid").innerHTML=features.map(([name,glyph,items])=>`<details class="feature-item" open><summary>${icon(glyph)}${name}<svg class="feature-plus" aria-hidden="true"><use href="assets/icons.svg#plus"></use></svg></summary><ul>${items.map((item)=>`<li>${item}</li>`).join("")}</ul></details>`).join("");
const amenities = [
  ["Infinity Pool & Spa","pool.jpg","A rooftop retreat designed around a slower pace.","Illustrative outdoor city pool and lounge deck"],
  ["State-of-the-Art Fitness Center","gym.jpg","A dedicated space for strength, balance and everyday wellbeing.","Illustrative strength and cardio gym"],
  ["Private Wine Storage","wine.jpg","A considered setting for a personally curated collection.","Illustrative wine storage interior"],
  ["Residents' Lounge & Bar","lobby.jpg","An inviting backdrop for quiet moments and good company.","Illustrative modern residents' lounge"],
  ["Screening Room","cinema.jpg","A private cinema concept for evenings that stay with you.","Illustrative home cinema seating and projection screen"],
  ["Children's Playroom","playroom.jpg","A bright space for curiosity, creativity and play.","Illustrative children playing with toys indoors"],
  ["Pet Spa & Dog Run","pet-spa.jpg","A little extra care for your four-legged companions.","Illustrative dog grooming station"],
  ["Valet Parking","parking.jpg","A considered arrival, with a valet service concept.","Illustrative curbside hotel arrival, not an actual valet facility"]
];
$("#amenity-strip").innerHTML=amenities.map(([name,file,description,alt])=>`<article class="amenity-card"><img src="assets/${file}" width="1100" height="734" loading="lazy" alt="${alt}"><h3>${name}</h3><p>${description}</p></article>`).join("");
horizontalStrip(photoGrid,$("#gallery-prev"),$("#gallery-next"));
horizontalStrip($("#amenity-strip"),$("#amenity-prev"),$("#amenity-next"));
const mobile=matchMedia("(max-width: 700px)");
function responsiveDetails() {
  $("#key-details").open=!mobile.matches;
  $$(".feature-item").forEach((item,index)=>{
    if (mobile.matches) item.setAttribute("name","feature");
    else item.removeAttribute("name");
    item.open=!mobile.matches || index===0;
  });
}
responsiveDetails(); mobile.addEventListener("change",responsiveDetails);
const navDialog=$("#nav-dialog"),navButton=$(".mobile-menu");
navButton.addEventListener("click",()=>{navDialog.showModal();navButton.setAttribute("aria-expanded","true");});
$(".close-nav").addEventListener("click",()=>navDialog.close());
$$("a",navDialog).forEach((link)=>link.addEventListener("click",()=>navDialog.close()));
navDialog.addEventListener("close",()=>navButton.setAttribute("aria-expanded","false"));
const updateHeader=()=>$(".site-header").classList.toggle("light",scrollY>70);
addEventListener("scroll",updateHeader,{passive:true});updateHeader();
const revealObserver=new IntersectionObserver((entries)=>entries.forEach((entry)=>{
  if (entry.isIntersecting) {entry.target.classList.add("visible");revealObserver.unobserve(entry.target);}
}),{rootMargin:"80px"});
$$(".reveal").forEach((item)=>revealObserver.observe(item));

const places=[
  {name:"The Meridian",time:"Fictional property marker",x:.47,y:.45,glyph:"pin"},
  {name:"Harbor Walk",time:"3 min walk",x:.28,y:.66,glyph:"walk"},
  {name:"Michelin-starred dining",time:"5 min walk",x:.70,y:.42,glyph:"kitchen"},
  {name:"Financial District",time:"8 min drive",x:.24,y:.28,glyph:"car"},
  {name:"International Airport",time:"22 min drive",x:.74,y:.66,glyph:"car"},
  {name:"Central Park",time:"10 min walk",x:.70,y:.22,glyph:"outdoor"}
];
$("#nearby-list").innerHTML=places.slice(1).map((place,index)=>`<button class="nearby-button" type="button" data-place="${index+1}" aria-pressed="false">${icon(place.glyph)}${place.name}<span>${place.time}</span></button>`).join("");
$("#map-pins").innerHTML=places.map((place,index)=>`<button class="map-pin${index===0 ? " property selected" : ""}" type="button" data-map-place="${index}" aria-label="${place.name}: ${index===0 ? "fictional property location" : `${place.time}, unverified`}" aria-pressed="${index===0}">${index===0 ? "M" : icon(place.glyph)}</button>`).join("");
const map=$("#neighborhood-map"),mapState={scale:1,x:0,y:0};
function renderMap() {
  $("#map-art").style.transform=`translate(${mapState.x}px,${mapState.y}px) scale(${mapState.scale})`;
  $$("[data-map-place]").forEach((pin,index)=>{
    pin.style.left=`${places[index].x*map.clientWidth*mapState.scale+mapState.x}px`;
    pin.style.top=`${places[index].y*map.clientHeight*mapState.scale+mapState.y}px`;
  });
  $("#map-out").disabled=mapState.scale<=.75;$("#map-in").disabled=mapState.scale>=3;
}
function selectPlace(index) {
  const place=places[index];
  $$("[data-map-place]").forEach((pin,i)=>{pin.classList.toggle("selected",i===index);pin.setAttribute("aria-pressed",String(i===index));});
  $$("[data-place]").forEach((item)=>item.setAttribute("aria-pressed",String(Number(item.dataset.place)===index)));
  $("#map-callout strong").textContent=place.name;
  $("#map-callout span").textContent=index ? `${place.time} · Original unverified proximity, schematic position only` : "Fictional property marker · Location not supplied";
  mapState.x=map.clientWidth*(.5-place.x*mapState.scale);
  mapState.y=map.clientHeight*(.45-place.y*mapState.scale);
  renderMap();
}
$$("[data-place]").forEach((button)=>button.addEventListener("click",()=>selectPlace(Number(button.dataset.place))));
$$("[data-map-place]").forEach((button)=>button.addEventListener("click",()=>selectPlace(Number(button.dataset.mapPlace))));
function zoomMap(delta) {
  const old=mapState.scale;
  mapState.scale=Math.min(3,Math.max(.75,Math.round((old+delta)*100)/100));
  mapState.x=map.clientWidth/2-(map.clientWidth/2-mapState.x)*mapState.scale/old;
  mapState.y=map.clientHeight/2-(map.clientHeight/2-mapState.y)*mapState.scale/old;
  renderMap();
}
$("#map-in").addEventListener("click",()=>zoomMap(.25));$("#map-out").addEventListener("click",()=>zoomMap(-.25));
$("#map-reset").addEventListener("click",()=>{Object.assign(mapState,{scale:1,x:0,y:0});selectPlace(0);});
function bindPan(element,onMove) {
  let drag=null;
  element.addEventListener("pointerdown",(event)=>{
    if (event.target.closest("button") || (event.pointerType==="mouse" && event.button!==0)) return;
    drag={x:event.clientX,y:event.clientY,id:event.pointerId};
    element.setPointerCapture(event.pointerId);element.classList.add("dragging");
  });
  element.addEventListener("pointermove",(event)=>{
    if (!drag || drag.id!==event.pointerId) return;
    onMove(event.clientX-drag.x,event.clientY-drag.y);drag.x=event.clientX;drag.y=event.clientY;
  });
  const stop=()=>{drag=null;element.classList.remove("dragging");};
  element.addEventListener("pointerup",stop);element.addEventListener("pointercancel",stop);element.addEventListener("lostpointercapture",stop);
}
function panMap(dx,dy) {
  mapState.x=Math.max(-map.clientWidth*2,Math.min(map.clientWidth*2,mapState.x+dx));
  mapState.y=Math.max(-map.clientHeight*2,Math.min(map.clientHeight*2,mapState.y+dy));renderMap();
}
bindPan(map,panMap);
map.addEventListener("keydown",(event)=>{
  const movement={ArrowLeft:[35,0],ArrowRight:[-35,0],ArrowUp:[0,35],ArrowDown:[0,-35]}[event.key];
  if (movement) {event.preventDefault();panMap(...movement);}
  else if (["+","=","-"].includes(event.key)) {event.preventDefault();zoomMap(event.key==="-" ? -.25 : .25);}
});
addEventListener("resize",renderMap);renderMap();
const tourDialog=$("#tour-dialog"),tourScene=$("#tour-scene"),tourPhotos=[0,2,3,8];
const tourLabels=["Living Room","Kitchen","Primary Suite","Private Terrace"];
let tourIndex=0,tourZoom=1,tourX=0,tourY=0;
$("#tour-rooms").innerHTML=tourLabels.map((label,index)=>`<button type="button" data-tour-room="${index}" aria-pressed="${index===0}">${label}</button>`).join("");
function renderTour() {
  const maxX=tourScene.clientWidth*(tourZoom-1)/2,maxY=tourScene.clientHeight*(tourZoom-1)/2;
  tourX=Math.max(-maxX,Math.min(maxX,tourX));tourY=Math.max(-maxY,Math.min(maxY,tourY));
  $("#tour-image").style.transform=`translate(${tourX}px,${tourY}px) scale(${tourZoom})`;
  $("#tour-out").disabled=tourZoom<=1;$("#tour-in").disabled=tourZoom>=3;
}
function changeTour(index) {
  tourIndex=(index+tourPhotos.length)%tourPhotos.length;
  const [file,,alt]=photos[tourPhotos[tourIndex]];
  $("#tour-image").src=`assets/${file}`;$("#tour-image").alt=alt;
  $("#tour-title").textContent=tourLabels[tourIndex];
  $$("[data-tour-room]").forEach((button,i)=>button.setAttribute("aria-pressed",String(i===tourIndex)));
  tourZoom=1;tourX=0;tourY=0;renderTour();
}
function expandTour(expanded) {
  tourDialog.classList.toggle("expanded",expanded);
  $("#tour-expand").setAttribute("aria-pressed",String(expanded));
  $("#tour-expand").setAttribute("aria-label",expanded ? "Restore photo walkthrough" : "Expand photo walkthrough");
  renderTour();
}
function openTour(expanded=false) {tourDialog.showModal();changeTour(0);expandTour(expanded);}
$("#tour-open").addEventListener("click",()=>openTour());
$("#tour-open-expanded").addEventListener("click",()=>openTour(true));
$("#tour-close").addEventListener("click",()=>tourDialog.close());
$("#tour-expand").addEventListener("click",()=>expandTour(!tourDialog.classList.contains("expanded")));
$("#tour-prev").addEventListener("click",()=>changeTour(tourIndex-1));
$("#tour-next").addEventListener("click",()=>changeTour(tourIndex+1));
$$("[data-tour-room]").forEach((button)=>button.addEventListener("click",()=>changeTour(Number(button.dataset.tourRoom))));
function zoomTour(delta) {tourZoom=Math.max(1,Math.min(3,Math.round((tourZoom+delta)*100)/100));renderTour();}
$("#tour-in").addEventListener("click",()=>zoomTour(.25));$("#tour-out").addEventListener("click",()=>zoomTour(-.25));
$("#tour-reset").addEventListener("click",()=>{tourZoom=1;tourX=0;tourY=0;renderTour();});
bindPan(tourScene,(dx,dy)=>{tourX+=dx;tourY+=dy;renderTour();});
tourScene.addEventListener("keydown",(event)=>{
  const movement={ArrowLeft:[30,0],ArrowRight:[-30,0],ArrowUp:[0,30],ArrowDown:[0,-30]}[event.key];
  if (movement) {event.preventDefault();tourX+=movement[0];tourY+=movement[1];renderTour();}
  else if (["+","=","-","0"].includes(event.key)) {event.preventDefault();if(event.key==="0"){tourZoom=1;tourX=0;tourY=0;renderTour();}else zoomTour(event.key==="-" ? -.25 : .25);}
});
tourDialog.addEventListener("close",()=>{$("#tour-image").removeAttribute("src");expandTour(false);});
addEventListener("resize",()=>{if(tourDialog.open)renderTour();});

const mortgage=$("#mortgage-form");
function updateMortgage() {
  const price=$("#purchase-price").valueAsNumber,down=$("#down-percent").valueAsNumber,rate=$("#interest-rate").valueAsNumber,years=$("#loan-years").valueAsNumber;
  if (!mortgage.checkValidity() || ![price,down,rate,years].every(Number.isFinite)) {
    $("#monthly-payment").textContent="—";$("#loan-summary").textContent="Enter valid values to calculate an estimate.";$("#down-amount").textContent="";return;
  }
  const principal=price*(1-down/100),months=years*12,monthlyRate=rate/1200;
  const payment=monthlyRate===0 ? principal/months : principal*monthlyRate/-Math.expm1(-months*Math.log1p(monthlyRate));
  $("#down-amount").textContent=money(price*down/100);
  $("#monthly-payment").textContent=`${money(payment,2)}/mo`;
  $("#loan-summary").textContent=`${money(principal)} loan · ${years} years · ${rate}% fixed annual interest`;
}
updateMortgage();
mortgage.addEventListener("input",updateMortgage);
mortgage.addEventListener("submit",(event)=>{event.preventDefault();updateMortgage();});
const infoDialog=$("#info-dialog"),infoContent=$("#info-content");
let infoOpener=null;
function paragraph(text) {const node=document.createElement("p");node.textContent=text;return node;}
function openInfo(title,content) {
  infoOpener=document.activeElement;$("#info-title").textContent=title;infoContent.replaceChildren(...content);infoDialog.showModal();
}
$(".close-info").addEventListener("click",()=>infoDialog.close());
infoDialog.addEventListener("close",()=>{infoContent.replaceChildren();if(infoOpener?.isConnected)infoOpener.focus({preventScroll:true});infoOpener=null;});
const panelCopy={
  agent:["A private introduction","Alexandra Sterling · Sterling Luxury Group. This is a fictional local listing concept; the name, brokerage affiliation, New York licensing claim and stock portrait are unverified.","A working phone number or agent email was not provided. alexandra@example.invalid is an example, not a deliverable address. Use the local viewing form to preview an enquiry; nothing is sent and no agent will contact you."],
  approval:["A considered starting point","No lender, application, credit check or pre-approval service is connected. The calculator estimates fixed-rate principal and interest only.","For a real purchase, consult a qualified lender about rates, taxes, insurance, HOA fees, closing costs, eligibility and affordability. This demonstration cannot qualify you for a loan."],
  Instagram:["Instagram","No verified brokerage Instagram account was supplied. This local information panel avoids linking to an unrelated person's account. No social service, embed or tracking has been loaded."],
  LinkedIn:["LinkedIn","No verified brokerage LinkedIn account was supplied. This local information panel avoids linking to an unrelated person's account. No social service, embed or tracking has been loaded."],
  "Privacy Policy":["Privacy in this static concept","This page uses local static assets and in-memory interactions. It has no application backend, analytics, cookies, account system, localStorage or sessionStorage. The page makes no form submission or enquiry requests.","The viewing form creates an on-screen local preview, then clears its input fields. Closing the preview removes those details from the document. Your browser may independently offer autofill. A real hosting provider may record ordinary page requests under its own policy."],
  "Terms of Service":["About this presentation","The Meridian Penthouse, brokerage, dimensions, features, scores, MLS references, comparable listings and service statements are unverified original concept content, not an active offer, appointment, investment recommendation or architectural plan.","Stock photography depicts multiple unrelated places and an illustrative portrait. The location diagram and floor plan are original schematics, not measured or navigational documents. The tour is a 2D photo demonstration, not Matterport, 360° imagery or a spatial scan. Source licenses and attributions are included in assets/CREDITS.txt; this collection grants no additional rights."]
};
const similar=[
  ["$3,800,000","3 bed / 3 bath","3,200 sq ft","The Apex, Unit 38A","living-day.jpg"],
  ["$4,500,000","4 bed / 4 bath","4,100 sq ft","Harborview Tower, PH2","terrace.jpg"],
  ["$3,950,000","3 bed / 3.5 bath","3,500 sq ft","One Park Place, Unit 52B","primary.jpg"]
];
$("#similar-grid").innerHTML=similar.map(([price,stats,area,address,file],index)=>`<article class="similar-card"><button type="button" data-listing="${index}" aria-label="View illustrative listing ${address}"><div class="similar-image"><img src="assets/${file}" loading="lazy" width="1100" height="734" alt="Illustrative stock interior, not a verified photograph of ${address}"><span>THE LUXURY COLLECTION</span></div><h3>${price}</h3><p class="similar-stats">${stats} · ${area}</p><p class="similar-address">${address}${icon("right")}</p></button></article>`).join("");
$$("[data-listing]").forEach((button)=>button.addEventListener("click",()=>{
  const [price,stats,area,address]=similar[Number(button.dataset.listing)];
  openInfo(address,[paragraph(`${price} · ${stats} · ${area}`),paragraph("Original unverified comparison listing with illustrative stock photography. No street location, current availability, actual agent contact or live inventory is supplied; this is not an active listing.")]);
}));
$$("[data-panel]").forEach((button)=>button.addEventListener("click",()=>{
  if(button.dataset.panel==="listings") {
    openInfo("The Luxury Collection",[paragraph("The three supplied illustrative listings are the entire local comparison collection, not active inventory."),...similar.map(([price,stats,area,address])=>paragraph(`${address} — ${price} · ${stats} · ${area}`)),paragraph("Prices and specifications are original unverified concept data. No inventory query or booking service is connected.")]);return;
  }
  const [title,...copy]=panelCopy[button.dataset.panel];openInfo(title,copy.map(paragraph));
}));
function localDate(offset) {
  const date=new Date();date.setDate(date.getDate()+offset);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
const viewingForm=$("#viewing-form"),dateInput=$("#viewing-date"),phoneInput=$("#phone");
dateInput.min=localDate(1);
dateInput.addEventListener("focus",()=>{dateInput.min=localDate(1);});
function validatePhone() {
  const value=phoneInput.value.trim(),digits=value.replace(/\D/g,"");
  phoneInput.setCustomValidity(/^\+?[\d ()-]+$/.test(value) && digits.length>=7 && digits.length<=15 ? "" : "Enter a phone number containing 7–15 digits and common phone punctuation.");
}
phoneInput.addEventListener("input",validatePhone);
viewingForm.addEventListener("submit",(event)=>{
  event.preventDefault();dateInput.min=localDate(1);validatePhone();
  if (!viewingForm.reportValidity()) return;
  const data=new FormData(viewingForm),fields=[["Full Name","name"],["Email","email"],["Phone","phone"],["Preferred Date","date"],["Preferred Time","time"],["Message","message"]];
  const content=[paragraph("Local preview only. Nothing was sent, no appointment is booked, no availability was checked and no agent will contact you.")];
  for(const [label,key] of fields) {
    const value=String(data.get(key)||"").trim();if(!value)continue;
    const row=document.createElement("p");row.className="info-field";
    const title=document.createElement("strong");title.textContent=label;row.append(title,document.createTextNode(value));content.push(row);
  }
  content.push(paragraph("Preferred times are illustrative; the property timezone was not provided. Input fields are now cleared. Closing this preview removes these details."));
  openInfo("Your viewing enquiry preview",content);viewingForm.reset();phoneInput.setCustomValidity("");dateInput.min=localDate(1);
});
$$("dialog").forEach((dialog)=>dialog.addEventListener("click",(event)=>{
  const rect=dialog.getBoundingClientRect();
  if(event.target===dialog && (event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom))dialog.close();
}));
