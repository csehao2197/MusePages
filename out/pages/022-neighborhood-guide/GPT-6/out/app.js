"use strict";
const $=(selector)=>document.querySelector(selector);
const $$=(selector)=>[...document.querySelectorAll(selector)];
const icon=(name)=>`<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
const money=(value)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(value);
const areas=[
  {id:"maplewood",name:"Maplewood Heights",zip:"97000",price:485000,walk:82,school:9,commute:22,image:"maplewood.jpg",alt:"Illustrative tree-lined residential street",tags:["Family-Friendly","Great Schools","Quiet Streets"],description:"Tree-lined streets, community parks, and a charming downtown strip. An illustrative balance of suburban tranquility and urban convenience."},
  {id:"riverside",name:"Riverside Commons",zip:"97001",price:525000,walk:89,school:8,commute:18,image:"riverside.jpg",alt:"Illustrative park promenade beside a lake",tags:["Riverside Living","Walkable","Green Spaces"],description:"A fictional waterside neighborhood imagined around morning walks, shared green spaces and easy access to local cafés."},
  {id:"old-town",name:"Old Town",zip:"97002",price:415000,walk:94,school:7,commute:12,image:"old-town.jpg",alt:"Illustrative small-town storefronts and pedestrian crossing",tags:["Local Character","Dining Nearby","Walkable"],description:"A fictional neighborhood imagined around independent shops, older homes and a lively, compact main street."},
  {id:"cedar-grove",name:"Cedar Grove",zip:"97003",price:565000,walk:63,school:9,commute:31,image:"cedar-grove.jpg",alt:"Illustrative quiet tree-lined residential road",tags:["Tree-Lined","Room to Grow","Great Schools"],description:"A fictional residential pocket imagined with leafy streets, more space between homes and a quieter pace of everyday life."},
  {id:"lakewood",name:"Lakewood Park",zip:"97004",price:610000,walk:74,school:8,commute:26,image:"lakewood.jpg",alt:"Illustrative shaded park path and lakeside trees",tags:["Parkside","Outdoor Life","Peaceful"],description:"A fictional parkside area imagined for people who like their weekends outdoors and their everyday routines close to green space."},
  {id:"westhaven",name:"Westhaven",zip:"97005",price:445000,walk:70,school:8,commute:25,image:"westhaven.jpg",alt:"Illustrative aerial view of a suburban neighborhood",tags:["Residential","Local Parks","Community"],description:"A fictional neighborhood imagined with a mix of homes, small parks and everyday local conveniences."}
];
const areaById=(id)=>areas.find((area)=>area.id===id);
$("#neighborhood-strip").innerHTML=areas.map((area)=>`<article class="neighborhood-card"><div class="neighborhood-image"><img src="assets/${area.image}" alt="${area.alt}" width="900" height="600" loading="lazy"><span class="walk-badge">${icon("walk")}Walk Score: ${area.walk}</span></div><div class="neighborhood-body"><h3>${area.name}</h3><p class="neighborhood-city">Fairhaven, OR · Example area</p><p class="neighborhood-price">${money(area.price)}<small>Median home price · Illustrative</small></p><div class="card-tags">${area.tags.map((tag)=>`<span>${tag}</span>`).join("")}</div><button class="explore-button" type="button" data-guide="${area.id}" aria-label="Explore ${area.name}">Explore neighborhood${icon("arrow")}</button></div></article>`).join("");
const scores=[["Walk Score",82,"Very Walkable","#0d9488"],["Transit Score",65,"Excellent Transit","#4989ca"],["Bike Score",71,"Very Bikeable","#62a26e"],["Safety Score",88,"Very Safe","#9475bf"]];
$("#scores").innerHTML=scores.map(([label,value,description,color])=>`<article class="score-card"><div class="score-ring"><svg viewBox="0 0 110 110" aria-hidden="true"><circle class="track" cx="55" cy="55" r="46"/><circle cx="55" cy="55" r="46" stroke="${color}" stroke-linecap="round" stroke-dasharray="${289.027*value/100} 289.027"/></svg><strong class="score-value">${value}<small>/ 100</small></strong></div><h3>${label}</h3><span>${description}</span></article>`).join("");
const dialogs=$$("dialog");
$$("[data-close]").forEach((button)=>button.addEventListener("click",()=>document.getElementById(button.dataset.close).close()));
dialogs.forEach((dialog)=>dialog.addEventListener("click",(event)=>{
  if(event.target!==dialog)return;
  const bounds=dialog.getBoundingClientRect();
  if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();
}));
function info(title,paragraphs){
  $("#info-title").textContent=title;
  $("#info-content").replaceChildren(...paragraphs.map((text)=>{const paragraph=document.createElement("p");paragraph.textContent=text;return paragraph;}));
  $("#info-dialog").showModal();
}
$("#info-dialog").addEventListener("close",()=>$("#info-content").replaceChildren());
const nav=$("#nav-dialog"),menu=$(".mobile-menu");
menu.addEventListener("click",()=>{menu.setAttribute("aria-expanded","true");nav.showModal();});
nav.addEventListener("close",()=>menu.setAttribute("aria-expanded","false"));
$$('#nav-dialog a').forEach((link)=>link.addEventListener("click",()=>nav.close()));
addEventListener("resize",()=>{if(innerWidth>760&&nav.open)nav.close();});
let previewArea="riverside";
function openGuide(id){
  const area=areaById(id);
  if(!area)return;
  hideSearch();
  $("#search-status").textContent="";
  if(id==="maplewood"){
    document.getElementById("maplewood").scrollIntoView({block:"start"});
    $("#overview-title").setAttribute("tabindex","-1");$("#overview-title").focus({preventScroll:true});
    return;
  }
  previewArea=id;
  $("#guide-title").textContent=area.name;$("#guide-description").textContent=area.description;
  $("#guide-image").src=`assets/${area.image}`;$("#guide-image").alt=area.alt;
  $("#guide-stats").innerHTML=[["Median home price",money(area.price)],["Walk Score",`${area.walk}/100`],["Example school rating",`${area.school}/10`],["Downtown by car",`${area.commute} min`]].map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");
  $("#guide-dialog").showModal();
}
$$("[data-guide]").forEach((button)=>button.addEventListener("click",()=>openGuide(button.dataset.guide)));
const search=$("#area-search"),searchOptions=$("#search-options");
let matching=[],active=-1;
function hideSearch(){
  searchOptions.hidden=true;search.setAttribute("aria-expanded","false");search.removeAttribute("aria-activedescendant");active=-1;
}
function setActive(index){
  active=index;
  $$("#search-options [role=option]").forEach((option,i)=>option.setAttribute("aria-selected",String(i===index)));
  if(index>=0){search.setAttribute("aria-activedescendant",`area-option-${index}`);document.getElementById(`area-option-${index}`).scrollIntoView({block:"nearest"});}
  else search.removeAttribute("aria-activedescendant");
}
function suggest(){
  const query=search.value.trim().toLowerCase();
  matching=areas.filter((area)=>`${area.name} fairhaven oregon ${area.zip}`.toLowerCase().includes(query));
  searchOptions.replaceChildren();
  matching.forEach((area,index)=>{
    const option=document.createElement("button");option.type="button";option.className="search-option";option.id=`area-option-${index}`;
    option.setAttribute("role","option");option.setAttribute("aria-selected","false");
    option.innerHTML=`${icon("pin")}<span>${area.name}<small>Fairhaven, OR · Example ZIP ${area.zip}</small></span>${icon("arrow")}`;
    option.addEventListener("click",()=>{search.value=area.name;openGuide(area.id);});
    searchOptions.append(option);
  });
  if(!matching.length){const empty=document.createElement("p");empty.className="search-empty";empty.textContent="No example areas match. Try Maplewood Heights or 97000.";searchOptions.append(empty);}
  active=-1;search.removeAttribute("aria-activedescendant");searchOptions.hidden=false;search.setAttribute("aria-expanded","true");
}
search.addEventListener("focus",suggest);
search.addEventListener("input",()=>{search.setCustomValidity("");$("#search-status").textContent="";suggest();});
search.addEventListener("keydown",(event)=>{
  if(["ArrowDown","ArrowUp"].includes(event.key)){
    event.preventDefault();if(searchOptions.hidden)suggest();if(!matching.length)return;
    setActive((active+(event.key==="ArrowDown"?1:active<0?0:-1)+matching.length)%matching.length);
  }else if(event.key==="Escape"){hideSearch();}
  else if(event.key==="Enter"&&!searchOptions.hidden&&active>=0){event.preventDefault();const area=matching[active];search.value=area.name;openGuide(area.id);}
});
document.addEventListener("click",(event)=>{if(!$("#search-form").contains(event.target))hideSearch();});
document.addEventListener("focusin",(event)=>{if(!$("#search-form").contains(event.target))hideSearch();});
$("#search-form").addEventListener("submit",(event)=>{
  event.preventDefault();const query=search.value.trim().toLowerCase();
  if(!query){search.setCustomValidity("Enter a neighborhood, city or example ZIP code.");search.reportValidity();return;}
  const exact=areas.find((area)=>area.name.toLowerCase()===query||area.zip===query);
  if(exact){search.value=exact.name;openGuide(exact.id);}
  else if(matching.length===1){search.value=matching[0].name;openGuide(matching[0].id);}
  else{
    $("#search-status").textContent=matching.length?"Choose a matching example neighborhood below.":"No example guide matches. Try Maplewood Heights or 97000.";
    suggest();
  }
});
const strip=$("#neighborhood-strip");
function updateStrip(){const max=strip.scrollWidth-strip.clientWidth;$("#area-prev").disabled=strip.scrollLeft<2;$("#area-next").disabled=strip.scrollLeft>=max-2;}
function moveStrip(direction){strip.scrollBy({left:direction*($(".neighborhood-card").getBoundingClientRect().width+22),behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});}
$("#area-prev").addEventListener("click",()=>moveStrip(-1));$("#area-next").addEventListener("click",()=>moveStrip(1));
strip.addEventListener("scroll",updateStrip,{passive:true});
strip.addEventListener("keydown",(event)=>{
  if(event.target!==strip)return;
  if(["ArrowRight","ArrowLeft"].includes(event.key)){event.preventDefault();moveStrip(event.key==="ArrowRight"?1:-1);}
  if(["Home","End"].includes(event.key)){event.preventDefault();strip.scrollTo({left:event.key==="Home"?0:strip.scrollWidth,behavior:"instant"});}
});
addEventListener("resize",updateStrip);updateStrip();
const categoryData={schools:{label:"School",icon:"school"},parks:{label:"Park",icon:"tree"},dining:{label:"Dining",icon:"dining"},shopping:{label:"Shopping",icon:"shop"},healthcare:{label:"Healthcare",icon:"health"}};
const places=[
  {id:"elementary",name:"Maplewood Elementary",category:"schools",distance:"0.4 mi",detail:"Example rating 9/10",x:.23,y:.32},
  {id:"middle",name:"Lincoln Middle School",category:"schools",distance:"1.1 mi",detail:"Example rating 8/10",x:.53,y:.24},
  {id:"high",name:"Westview High School",category:"schools",distance:"1.8 mi",detail:"Example rating 8/10",x:.72,y:.46},
  {id:"central",name:"Maplewood Central Park",category:"parks",distance:"0.5 mi",detail:"Example rating 4.8/5",x:.28,y:.59},
  {id:"trail",name:"Riverside Trail",category:"parks",distance:"0.8 mi",detail:"Example rating 4.7/5",x:.12,y:.78},
  {id:"playground",name:"Community Playground",category:"parks",distance:"0.6 mi",detail:"Example rating 4.6/5",x:.60,y:.66},
  {id:"dining",name:"Neighborhood dining",category:"dining",distance:"Within 1 mile",detail:"42 restaurants · Unverified brief count",x:.70,y:.82},
  {id:"town-center",name:"Maplewood Town Center",category:"shopping",distance:"0.7 mi",detail:"Shops and daily essentials · Example",x:.45,y:.46},
  {id:"market",name:"Farmers Market",category:"shopping",distance:"0.8 mi",detail:"Saturdays · Example schedule",x:.72,y:.21},
  {id:"medical",name:"Maplewood Medical Center",category:"healthcare",distance:"1.2 mi",detail:"Medical services · Unverified",x:.82,y:.68},
  {id:"urgent",name:"3 urgent care clinics",category:"healthcare",distance:"Example area",detail:"Grouped illustration · No clinical advice",x:.36,y:.80}
];
let category="all",selected="elementary";
const map=$("#amenity-map"),mapState={scale:1,x:0,y:0};
const visiblePlaces=()=>places.filter((place)=>category==="all"||place.category===category);
function renderMap(){
  $("#map-art").style.transform=`translate(${mapState.x}px,${mapState.y}px) scale(${mapState.scale})`;
  $$("[data-map-place]").forEach((pin)=>{
    const place=places.find((item)=>item.id===pin.dataset.mapPlace);
    pin.style.left=`${place.x*map.clientWidth*mapState.scale+mapState.x}px`;pin.style.top=`${place.y*map.clientHeight*mapState.scale+mapState.y}px`;
  });
  $("#map-in").disabled=mapState.scale>=2.5;$("#map-out").disabled=mapState.scale<=.75;
}
function selectPlace(id,center=false){
  const place=places.find((item)=>item.id===id);if(!place)return;
  selected=id;
  $$("[data-map-place]").forEach((pin)=>pin.setAttribute("aria-pressed",String(pin.dataset.mapPlace===id)));
  $$("[data-list-place]").forEach((button)=>button.setAttribute("aria-pressed",String(button.dataset.listPlace===id)));
  $("#selection-name").textContent=place.name;
  $("#selection-detail").textContent=`${categoryData[place.category].label} · ${place.distance} · ${place.detail}`;
  $("#selection-icon").className=`selection-icon ${place.category}`;$("#selection-icon").innerHTML=icon(categoryData[place.category].icon);
  if(center){mapState.x=map.clientWidth*(.5-place.x*mapState.scale);mapState.y=map.clientHeight*(.48-place.y*mapState.scale);renderMap();}
}
function filterPlaces(value){
  category=value;const visible=visiblePlaces();
  $$("[data-category]").forEach((button)=>button.setAttribute("aria-pressed",String(button.dataset.category===value)));
  $("#place-count").textContent=String(visible.length);
  $("#map-pins").innerHTML=visible.map((place)=>`<button class="map-pin ${place.category}" type="button" data-map-place="${place.id}" aria-label="${place.name}, ${place.distance}, illustrative ${categoryData[place.category].label.toLowerCase()}" aria-pressed="false">${icon(categoryData[place.category].icon)}</button>`).join("");
  $("#place-list").innerHTML=visible.map((place)=>`<button class="place-button" type="button" data-list-place="${place.id}" aria-pressed="false"><span class="selection-icon ${place.category}">${icon(categoryData[place.category].icon)}</span><span class="place-copy"><strong>${place.name}</strong><small>${categoryData[place.category].label} · ${place.distance}</small><span>${place.detail}</span></span>${icon("next")}</button>`).join("");
  $$("[data-map-place]").forEach((pin)=>pin.addEventListener("click",()=>selectPlace(pin.dataset.mapPlace)));
  $$("[data-list-place]").forEach((button)=>button.addEventListener("click",()=>selectPlace(button.dataset.listPlace,true)));
  Object.assign(mapState,{scale:1,x:0,y:0});selectPlace(visible.some((place)=>place.id===selected)?selected:visible[0].id);renderMap();
}
$$("[data-category]").forEach((button)=>button.addEventListener("click",()=>filterPlaces(button.dataset.category)));
function zoom(delta){
  const old=mapState.scale;mapState.scale=Math.min(2.5,Math.max(.75,Math.round((old+delta)*100)/100));
  mapState.x=map.clientWidth/2-(map.clientWidth/2-mapState.x)*mapState.scale/old;
  mapState.y=map.clientHeight/2-(map.clientHeight/2-mapState.y)*mapState.scale/old;renderMap();
}
function pan(dx,dy){mapState.x=Math.max(-map.clientWidth*2,Math.min(map.clientWidth*2,mapState.x+dx));mapState.y=Math.max(-map.clientHeight*2,Math.min(map.clientHeight*2,mapState.y+dy));renderMap();}
$("#map-in").addEventListener("click",()=>zoom(.25));$("#map-out").addEventListener("click",()=>zoom(-.25));
$("#map-reset").addEventListener("click",()=>{Object.assign(mapState,{scale:1,x:0,y:0});renderMap();});
let drag=null;
map.addEventListener("pointerdown",(event)=>{
  if(event.target.closest("button")||(event.pointerType==="mouse"&&event.button!==0))return;
  drag={id:event.pointerId,x:event.clientX,y:event.clientY};map.setPointerCapture(event.pointerId);map.classList.add("dragging");
});
map.addEventListener("pointermove",(event)=>{if(!drag||drag.id!==event.pointerId)return;pan(event.clientX-drag.x,event.clientY-drag.y);drag.x=event.clientX;drag.y=event.clientY;});
const stop=()=>{drag=null;map.classList.remove("dragging");};
for(const name of["pointerup","pointercancel","lostpointercapture"])map.addEventListener(name,stop);
map.addEventListener("keydown",(event)=>{
  if(event.target!==map)return;
  const move={ArrowLeft:[35,0],ArrowRight:[-35,0],ArrowUp:[0,35],ArrowDown:[0,-35]}[event.key];
  if(move){event.preventDefault();pan(...move);}
  else if(["+","=","-"].includes(event.key)){event.preventDefault();zoom(event.key==="-"?-.25:.25);}
});
const sidebar=$("#amenity-sidebar"),compact=matchMedia("(max-width:1024px)");
sidebar.open=!compact.matches;compact.addEventListener("change",()=>sidebar.open=!compact.matches);
addEventListener("resize",renderMap);filterPlaces("all");
const schools=[
  ["Maplewood Elementary","Public school","K–5",9,"0.4 mi","380"],
  ["Lincoln Middle School","Public school","6–8",8,"1.1 mi","620"],
  ["Westview High School","Public school","9–12",8,"1.8 mi","1,200"],
  ["Little Acorns Montessori","Private school","Pre-K–3",9,"0.6 mi","85"]
];
$("#school-rows").innerHTML=schools.map(([name,type,grades,rating,distance,students])=>`<article class="school-row"><div class="school-name"><span class="selection-icon">${icon("school")}</span><div><h3>${name}</h3><small>${type} · Illustrative</small></div></div><span><small class="field-label">Grades</small>${grades}</span><span><small class="field-label">Rating</small><span class="school-rating">${rating}/10</span></span><span><small class="field-label">Distance</small>${distance}</span><span><small class="field-label">Students</small>${students}</span></article>`).join("");
const commutes=[["Downtown","office",[[22,"by car","car"],[35,"by transit","train"]]],["Airport","plane",[[40,"by car","car"]]],["Tech District","office",[[18,"by car","car"],[28,"by transit","train"]]],["University","university",[[15,"by car","car"],[20,"by bike","bike"]]]];
$("#commute-grid").innerHTML=commutes.map(([title,glyph,modes])=>`<article class="commute-card">${icon(glyph)}<h3>${title}</h3>${modes.map(([time,mode,modeIcon])=>`<p class="commute-mode"><strong>${time}</strong>min ${mode}${icon(modeIcon)}</p>`).join("")}</article>`).join("");
const months=["Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"],prices=[465,462,466,469,467,473,478,475,480,483,481,485];
const point=(index)=>[42+index*49,(500-prices[index])*3+15];
const line=prices.map((_,index)=>point(index).join(",")).join(" ");
const chart=$("#price-chart");
chart.insertAdjacentHTML("beforeend",`<defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#0d9488" stop-opacity=".16"/><stop offset="1" stop-color="#0d9488" stop-opacity=".01"/></linearGradient></defs>${[460,480,500].map((price)=>`<path d="M42 ${(500-price)*3+15}H585" stroke="#e8eef0" stroke-dasharray="3 5"/><text x="0" y="${(500-price)*3+19}" fill="#81929d" font-size="9" font-family="sans-serif">$${price}k</text>`).join("")}<polygon points="42,172 ${line} 581,172" fill="url(#chart-fill)"/><polyline points="${line}" fill="none" stroke="#0d9488" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>${prices.map((price,index)=>{const[x,y]=point(index);return`<circle cx="${x}" cy="${y}" r="${index===11?4:2.4}" fill="#0d9488"/><text x="${x}" y="196" text-anchor="middle" fill="#81929d" font-size="9" font-family="sans-serif">${months[index]}</text>`;}).join("")}`);
$("#chart-data").innerHTML=months.map((month,index)=>`<tr><th scope="row">${month}</th><td>${money(prices[index]*1000)}</td></tr>`).join("");
function stars(rating){return Array.from({length:5},(_,index)=>`<svg class="icon${index>=rating?" empty-star":""}" aria-hidden="true"><use href="assets/icons.svg#star"></use></svg>`).join("");}
$("#average-stars").innerHTML=stars(5);
const reviews=[
  ["We moved here for the schools and stayed for the community. Block parties every summer!","The Martinez Family","6 years in Maplewood Heights",5,"MF"],
  ["Great walkability — I can get to the grocery store, gym, and coffee shop without my car.","Sarah T.","2 years in Maplewood Heights",4,"ST"],
  ["Quiet neighborhood with beautiful tree-lined streets. The farmers market is a weekend highlight.","James W.","10 years in Maplewood Heights",5,"JW"]
];
$("#review-grid").innerHTML=reviews.map(([quote,name,duration,rating,initials])=>`<article class="review-card"><span class="stars" aria-label="${rating} out of 5 stars">${stars(rating)}</span><blockquote>“${quote}”</blockquote><div class="resident"><span class="resident-initials" aria-hidden="true">${initials}</span><div><strong>${name}</strong><small>${duration}</small></div></div></article>`).join("");
function comparison(ids,caption){
  const selectedAreas=ids.map(areaById);
  return`<table class="comparison-table"><caption>${caption}</caption><thead><tr><th scope="col">At a glance</th>${selectedAreas.map((area)=>`<th scope="col">${area.name}<small>${area.id==="maplewood"?"Full example guide":"Illustrative nearby area"}</small></th>`).join("")}</tr></thead><tbody>${[["Median price","price"],["Walk Score","walk"],["School rating","school"],["Downtown by car","commute"]].map(([label,key])=>`<tr${key==="price"?' class="comparison-price"':""}><th scope="row">${label}</th>${selectedAreas.map((area)=>`<td>${key==="price"?money(area[key]):key==="walk"?`${area[key]}/100`:key==="school"?`${area[key]}/10`:`${area[key]} min`}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}
$("#comparison-preview").innerHTML=comparison(["maplewood","riverside","old-town"],"Three places. A little perspective.");
for(const selector of["#compare-first","#compare-second"])$(selector).innerHTML=areas.slice(1).map((area)=>`<option value="${area.id}">${area.name}</option>`).join("");
$("#compare-second").value="old-town";
function renderComparison(){const first=$("#compare-first"),second=$("#compare-second");second.setCustomValidity(first.value===second.value?"Choose two different nearby neighborhoods.":"");if(!second.checkValidity())return false;$("#comparison-result").innerHTML=comparison(["maplewood",first.value,second.value],"Side-by-side example comparison");return true;}
function openComparison(){renderComparison();$("#compare-dialog").showModal();}
$$("[data-compare]").forEach((button)=>button.addEventListener("click",openComparison));
$("#compare-form").addEventListener("submit",(event)=>{event.preventDefault();if(!renderComparison())$("#compare-second").reportValidity();});
for(const selector of["#compare-first","#compare-second"])$(selector).addEventListener("change",()=>$("#compare-second").setCustomValidity(""));
$("#guide-compare").addEventListener("click",()=>{
  $("#compare-first").value=previewArea;$("#compare-second").value=previewArea==="old-town"?"riverside":"old-town";
  $("#compare-second").setCustomValidity("");$("#guide-dialog").close();openComparison();
});
$("#listings-button").addEventListener("click",()=>info("Maplewood Heights listings · Example only",["No live inventory or MLS service is connected. These local illustrations are not properties offered for sale.","Example cottage · 2 beds · $425,000. Example family home · 3 beds · $485,000. Example larger home · 4 beds · $625,000.","Check verified availability, disclosures and current pricing with a licensed local professional."]));
$("#agent-contact").addEventListener("click",()=>info("Example local specialist",["Jamie Carter is an illustrative agent name paired with a stock portrait. A verified phone number or brokerage license was not provided.","This static concept cannot make calls, deliver messages or confirm a neighborhood tour."]));
$("#agent-email").addEventListener("click",()=>info("Example email address",["jamie@example.invalid is a deliberately invalid example address, not a message destination.","Use the tour form for a local preview only; nothing is sent, saved or booked."]));
$$("[data-policy]").forEach((button)=>button.addEventListener("click",()=>info(button.dataset.policy==="privacy"?"Privacy in this local concept":"About this illustrative guide",button.dataset.policy==="privacy"?["Forms are handled only in this browser session. They send no request and use no browser storage. Previewed personal details are removed when the information dialog closes.","There are no analytics, accounts, subscriptions or messages. Stock images and fonts are included locally."] : ["All areas, properties, people, reviews, prices, distances, ratings and schedules are fictional or unverified concept information, not real-estate, school, safety, financial or medical advice.","The map is an original schematic, not geocoded navigation. No GreatSchools, Walk Score, Google Maps or Mapbox affiliation is established."])));
$("#alert-form").addEventListener("submit",(event)=>{
  event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;
  const email=form.elements.email.value;form.reset();
  info("Market alerts · Local preview",[`Example area: Maplewood Heights. Email: ${email}.`,"No subscription was created, no email sent and no address saved. Close this preview to remove its displayed email."]);
});
const tourDialog=$("#tour-dialog"),tourForm=$("#tour-form");
function minimumDate(){const date=new Date();date.setDate(date.getDate()+1);return`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;}
$("#tour-date").min=minimumDate();
$("#tour-open").addEventListener("click",()=>{$("#tour-date").min=minimumDate();tourDialog.showModal();});
tourForm.elements.name.addEventListener("input",()=>tourForm.elements.name.setCustomValidity(""));
tourForm.addEventListener("submit",(event)=>{
  event.preventDefault();
  if(!tourForm.elements.name.value.trim()){tourForm.elements.name.setCustomValidity("Enter a name with at least one non-space character.");tourForm.elements.name.reportValidity();return;}
  $("#tour-date").min=minimumDate();if(!tourForm.reportValidity())return;
  const fields=new FormData(tourForm),summary=`${fields.get("name").trim()} · ${fields.get("email")} · ${fields.get("date")} · ${fields.get("time")}`;
  tourDialog.close();info("Neighborhood tour · Local preview",[summary,"Maplewood Heights · Jamie Carter (illustrative). This is not a confirmed appointment. No request was sent and no personal details were saved."]);
});
tourDialog.addEventListener("close",()=>{tourForm.reset();tourForm.elements.name.setCustomValidity("");});
