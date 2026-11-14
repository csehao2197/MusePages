"use strict";
const $=(s,root=document)=>root.querySelector(s),$$=(s,root=document)=>[...root.querySelectorAll(s)];
const icon=name=>`<svg aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
const currency=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});
const dollars=n=>currency.format(n);
const highlights=[
 ["bed","5 Bedrooms","Primary suite with private balcony and mountain views"],
 ["bath","4.5 Bathrooms","Spa-inspired primary bath with soaking tub and rain shower"],
 ["chef","Chef’s Kitchen","Wolf & Sub-Zero appliances, waterfall quartz island, butler’s pantry"],
 ["pool","Infinity Pool","Heated saltwater pool with spa, fire bowls, and desert views"],
 ["car","3-Car Garage","Oversized bays with EV charging stations and epoxy floors"],
 ["wifi","Smart Home","Control4 system: lighting, climate, security, audio, shades"],
 ["office","Home Office","Dedicated office with built-in cabinetry and glass doors"],
 ["house","Guest Casita","Detached 450 sq ft studio with kitchenette and private entrance"]
];
$("#highlights").innerHTML=highlights.map(([name,title,copy])=>`<article class="highlight"><div class="highlight-icon">${icon(name)}</div><h3>${title}</h3><p>${copy}</p></article>`).join("");
const specifications=[
 ["Living area","4,820 sq ft"],["Lot size","0.75 acres (32,670 sq ft)"],["Year built","2021"],["Style","Contemporary Desert Modern"],["Construction","Stucco and natural stone"],["Roof","Flat with parapet, TPO membrane"],["Flooring","Porcelain tile, white oak hardwood"],["Cooling","3-zone HVAC, 16 SEER"],["Heating","Forced air + radiant in-floor (primary bath, kitchen)"],["Water heater","Tankless (2 units)"],["HOA","$285/month (gated community, common area maintenance)"],["Property tax (2025)","$14,280/year"],["School district","Scottsdale Unified — Saguaro High School"],["MLS#","AZ-2026-48210"]
];
$("#specifications").innerHTML=specifications.map(([name,value])=>`<div><dt>${name}</dt><dd>${value}</dd></div>`).join("");
const photos=[
 ["desert.jpg","Exterior front","Desert-modern architecture in a rocky landscape. Illustrative stock, not this address."],
 ["living-day.jpg","Great room","A light-filled living space. Illustrative stock; ceilings, windows and fixtures vary."],
 ["kitchen.jpg","Kitchen","An inviting kitchen and island. Illustrative stock; appliance brands are not verified."],
 ["kitchen.jpg","Kitchen detail","Alternate detail crop of the kitchen moodboard, not proof of quartz or branded appliances.","detail-crop"],
 ["primary.jpg","Primary bedroom","A restful bedroom in a neutral palette. Illustrative stock, not this property."],
 ["bath.jpg","Primary bathroom","A serene bath inspiration. Illustrative stock; finishes are unverified."],
 ["hero.jpg","Backyard","Twilight pool and modern architecture. Illustrative stock, not the named property."],
 ["terrace-evening.jpg","Outdoor kitchen","Outdoor entertaining inspiration; this stock photo does not document the specified grill or pergola."],
 ["office.jpg","Home office","A dedicated workspace inspiration. Illustrative stock, not the actual office."],
 ["desert.jpg","Guest casita exterior","Alternate crop of a desert house for architectural inspiration; not a photograph of the claimed casita.","detail-crop"],
 ["dining.jpg","Dining room","A considered space for gathering. Illustrative stock; table capacity is not verified."],
 ["parking.jpg","Garage","Illustrative parking inspiration, not documentation of a private three-bay garage or EV chargers."]
];
const grid=$("#photo-grid"),dots=$("#gallery-dots"),lightbox=$("#lightbox");
grid.innerHTML=photos.map(([file,title,,crop],i)=>`<button class="photo-tile ${crop||""}" data-photo="${i}" aria-label="Open ${title} photo"><img src="assets/${file}" alt="${title} — illustrative stock image" loading="lazy" width="900" height="700"><span class="photo-label">${icon("image")}${title}</span></button>`).join("");
dots.innerHTML=photos.map(([,title],i)=>`<button data-slide="${i}" aria-label="Show ${title} photo" aria-current="${i===0}"></button>`).join("");
let photoIndex=0,slideIndex=0;
function showPhoto(index){
 photoIndex=(index+photos.length)%photos.length;const[file,title,description,crop]=photos[photoIndex];
 $("#lightbox-image").src="assets/"+file;$("#lightbox-image").alt=description;
 $(".lightbox-frame").classList.toggle("detail-crop",Boolean(crop));$("#photo-title").textContent=title;$("#photo-description").textContent=description;$("#photo-counter").textContent=`${photoIndex+1} of ${photos.length}`;
}
function openPhoto(index){showPhoto(index);if(!lightbox.open)lightbox.showModal();}
function markSlide(index){slideIndex=index;$$("[data-slide]").forEach((b,i)=>b.setAttribute("aria-current",String(i===index)));}
function goSlide(index){index=Math.max(0,Math.min(photos.length-1,index));markSlide(index);grid.scrollTo({left:grid.children[index].offsetLeft-grid.children[0].offsetLeft,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});}
grid.addEventListener("click",e=>{const tile=e.target.closest("[data-photo]");if(tile)openPhoto(Number(tile.dataset.photo));});
dots.addEventListener("click",e=>{const dot=e.target.closest("[data-slide]");if(dot)goSlide(Number(dot.dataset.slide));});
grid.addEventListener("keydown",e=>{if(e.target!==grid||!matchMedia("(max-width: 600px)").matches)return;const next=e.key==="ArrowRight"?slideIndex+1:e.key==="ArrowLeft"?slideIndex-1:e.key==="Home"?0:e.key==="End"?photos.length-1:null;if(next!==null){e.preventDefault();goSlide(next);}});
grid.addEventListener("scroll",()=>{const origin=grid.children[0].offsetLeft;let closest=0;for(let i=1;i<photos.length;i++)if(Math.abs(grid.children[i].offsetLeft-origin-grid.scrollLeft)<Math.abs(grid.children[closest].offsetLeft-origin-grid.scrollLeft))closest=i;markSlide(closest);},{passive:true});
$(".previous",lightbox).addEventListener("click",()=>showPhoto(photoIndex-1));
$(".next",lightbox).addEventListener("click",()=>showPhoto(photoIndex+1));
$(".lightbox-close").addEventListener("click",()=>lightbox.close());
lightbox.addEventListener("keydown",e=>{if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();showPhoto(photoIndex+(e.key==="ArrowRight"?1:-1));}});
lightbox.addEventListener("close",()=>{$("#lightbox-image").removeAttribute("src");});
let touchStart=null;
$(".lightbox-frame").addEventListener("touchstart",e=>{if(e.touches.length===1)touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
$(".lightbox-frame").addEventListener("touchend",e=>{if(!touchStart||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)showPhoto(photoIndex+(dx<0?1:-1));},{passive:true});
$(".lightbox-frame").addEventListener("touchcancel",()=>{touchStart=null;},{passive:true});
const places=[
 ["hike","Pinnacle Peak Trail","2.1 miles",25,20,"A mountain trail for a Sonoran Desert morning. Check official trail conditions before visiting."],
 ["shop","Scottsdale Quarter","4.3 miles",73,58,"Shopping and dining in Scottsdale. Distance is illustrative, not a live route estimate."],
 ["golf","Grayhawk Golf Club","3.8 miles",74,28,"Golf in North Scottsdale. Tee times, access and membership are not provided here."],
 ["grocery","Whole Foods Market","5.1 miles",29,70,"Groceries and everyday essentials. Store location and driving distance have not been verified."],
 ["health","HonorHealth Scottsdale","6.2 miles",51,79,"A healthcare destination named in the brief, not emergency routing or medical advice."],
 ["plane","Scottsdale Airport","8.7 miles",82,83,"Regional aviation access. The diagram does not show flight paths or verified travel times."]
];
$("#map-pins").innerHTML=places.map(([name,title,,x,y],i)=>`<button class="map-point" data-place="${i}" style="left:${x}%;top:${y}%" aria-label="${title}" aria-pressed="false">${icon(name)}</button>`).join("");
$("#nearby-list").innerHTML=places.map(([name,title,distance],i)=>`<button data-place="${i}" aria-pressed="false">${icon(name)}<span>${title}</span><small>${distance}</small></button>`).join("");
function selectPlace(index){
 $$("[data-place]").forEach(b=>b.setAttribute("aria-pressed",String(Number(b.dataset.place)===index)));
 const[,title,distance,,,,]=places[index],detail=$("#nearby-detail");detail.replaceChildren();const strong=document.createElement("strong");strong.textContent=`${title} · ${distance}`;detail.append(strong,document.createTextNode(places[index][5]));
}
document.addEventListener("click",e=>{const place=e.target.closest("[data-place]");if(place)selectPlace(Number(place.dataset.place));});
const phoneMap=matchMedia("(max-width: 600px)");function staticPhoneMap(){$$(".map-point").forEach(b=>{b.disabled=phoneMap.matches;});}phoneMap.addEventListener("change",staticPhoneMap);staticPhoneMap();selectPlace(0);
const mortgage=$("#mortgage-form"),payment=$("#monthly-payment");
const paymentParts=[["Principal & Interest","#1e3a5f"],["Property Tax","#c9a96e"],["HOA","#94a8b8"],["Insurance","#c9c6bf"]];
mortgage.addEventListener("submit",e=>e.preventDefault());
function calculate(){
 const get=name=>Number(mortgage.elements[name].value),valid=mortgage.checkValidity();
 if(!valid){payment.textContent="—";delete payment.dataset.amount;$("#loan-amount").textContent="—";$("#breakdown").replaceChildren();$("#payment-chart").style.background="#dedbd5";$("#payment-chart").setAttribute("aria-label","Enter valid values to calculate a payment");$("#calculator-status").textContent="Enter valid amounts in every field. Home price must be positive; interest can be 0–25%; costs can be zero or more.";$("#down-output").textContent="—";return;}
 const price=get("price"),down=get("down"),loan=price*(1-down/100),rate=get("rate")/1200,months=get("term")*12;
 const principal=rate===0?loan/months:loan*rate/(-Math.expm1(-months*Math.log1p(rate)));
 const parts=[principal,get("tax")/12,get("hoa"),get("insurance")/12],total=parts.reduce((a,b)=>a+b,0);
 payment.textContent=dollars(total);payment.dataset.amount=total.toFixed(8);$("#down-output").textContent=`${dollars(price*down/100)} · ${down}%`;$("#loan-amount").textContent=dollars(loan);$("#calculator-status").textContent="";
 $("#breakdown").innerHTML=parts.map((n,i)=>`<div><dt><i style="background:${paymentParts[i][1]}"></i>${paymentParts[i][0]}</dt><dd>${new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n)}</dd></div>`).join("");
 let start=0;$("#payment-chart").style.background=`conic-gradient(${parts.map((n,i)=>{const end=start+n/total*100,stop=`${paymentParts[i][1]} ${start}% ${end}%`;start=end;return stop;}).join(",")})`;
 $("#payment-chart").setAttribute("aria-label",parts.map((n,i)=>`${paymentParts[i][0]}: ${dollars(n)} monthly`).join("; "));
}
mortgage.addEventListener("input",calculate);mortgage.addEventListener("change",calculate);calculate();
const related=[
 ["7930 E Raintree Dr","$1,895,000","4 bed · 3.5 bath · 3,640 sq ft","desert.jpg"],
 ["22614 N Pinnacle Peak Rd","$2,780,000","5 bed · 5 bath · 5,210 sq ft","hero.jpg"],
 ["10585 E Crescent Moon Dr","$3,150,000","6 bed · 6 bath · 6,800 sq ft","terrace-evening.jpg","Just Listed"]
];
$("#similar-listings").innerHTML=related.map(([address,price,stats,file,badge],i)=>`<article class="listing-card"><div class="listing-image"><img src="assets/${file}" width="700" height="470" loading="lazy" alt="Illustrative property inspiration, not ${address}">${badge?`<span class="listing-badge">${badge}</span>`:""}</div><div class="listing-body"><h3>${address}</h3><strong>${price}</strong><p>${stats}</p><button class="text-link" data-listing="${i}">View Listing${icon("arrow")}</button></div></article>`).join("");
const info=$("#info-dialog"),content=$("#info-content");
const information={
 contact:["Contact Victoria","<p>The original brief lists (480) 555-0192 and victoria@pinnaclerealty.com. These are unverified illustrative contacts; the reserved 555 example number is not a live service.</p><p>No call or email is started from this concept. Use the local message preview to explore the experience without transmitting personal information.</p><button class=\"text-link\" data-mode=\"message\">Preview a message →</button>"],
 lender:["A thoughtful next step","<p>The original brief names Desert Financial CU for historical event consultations. No lender partnership, current rate, loan availability or pre-approval service is verified or integrated here.</p><p>For a real purchase, review the lender’s official mortgage page. It opens separately; no calculator values or form entries are shared. Ask about APR, points, closing costs, jumbo-loan requirements and mortgage insurance. A calculator estimate is not credit approval.</p><a class=\"text-link\" href=\"https://www.desertfinancial.com/en/borrow/home-loans/mortgage\" target=\"_blank\" rel=\"noopener noreferrer\">Visit Desert Financial’s official mortgage page →</a>"],
 buying:["A considered home-buying guide","<ul><li>Establish a budget that includes financing, tax, insurance, HOA and maintenance.</li><li>Discuss eligibility and a written loan estimate with an independently verified lender.</li><li>Review title, HOA documents, inspection reports and desert-specific upkeep with qualified professionals.</li><li>Confirm property boundaries, permits, school assignments and every listing claim before an offer.</li></ul><p>General educational notes, not legal or financial advice.</p>"],
 moving:["A little less to think about","<ul><li>Eight weeks out: compare licensed movers, inventory belongings and review insurance.</li><li>Four weeks out: schedule utilities, internet and address changes.</li><li>Two weeks out: label boxes, organize important documents and plan pet transport.</li><li>Moving week: confirm access, inspect the home, record meter readings and update security codes.</li></ul><p>A practical local checklist; nothing is booked or shared.</p>"],
 schools:["Find the right school information","<p>The brief names Scottsdale Unified and Saguaro High School. An address-to-school assignment has not been verified; the named ZIP code and school may not establish attendance boundaries.</p><p>Confirm current boundaries directly with the district and review official Arizona school report cards. No fabricated rating, ranking or enrollment guarantee is supplied here.</p>"],
 social:["Follow through verified channels","<p>Instagram, Facebook, LinkedIn and YouTube appear in the original brief, but no verified profile URLs were supplied. This concept does not invent an account or redirect to an unrelated person.</p><p>Independently verify the brokerage and agent before making contact.</p>"],
 privacy:["A private, local experience","<p>This static concept has no server-side form, account, analytics, cookies or browser storage. Form entries stay in the current page; submission shows an on-device preview and clears the fields. Closing the confirmation clears its personal text.</p><p>Property figures, school claims, credentials and contacts are illustrative and unverified. The April 4, 2026 invitation is archived, not a live event. Photos are stock, and the floor plan and map are schematic. No professional or financial service is offered.</p>"],
 credits:["An independently imagined property","<p>Design, code, original geometric mark, schematic floor plan, neighborhood diagram and specification PDF: gpt-6.1-sol. This concept is not endorsed by a named agent, property owner, lender or product brand.</p><p>Illustrative stock photos: aksinfo7 universe, ROMAN ODINTSOV, Faheem Ahamad, Max Vakhtbovych, Magda Ehlers, Curtis Adams, Kraken Media and PROFFESIONAL PHOTO STOCK on Pexels. Portrait is not Victoria Reeves; room and exterior photos show unrelated properties.</p><p>Playfair Display and Inter: SIL Open Font License. Lucide icons: ISC. Full source links and original licenses are included with the static assets.</p><a class=\"text-link\" href=\"assets/CREDITS.txt\" download>Download attribution details →</a>"]
};
function openInfo(title,html){$("#info-title").textContent=title;content.innerHTML=html;if(!info.open)info.showModal();}
$(".info-close").addEventListener("click",()=>info.close());
info.addEventListener("close",()=>{content.replaceChildren();});
for(const dialog of[info,lightbox])dialog.addEventListener("click",e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
document.addEventListener("click",e=>{
 const button=e.target.closest("[data-info]");if(button){const item=information[button.dataset.info];if(item)openInfo(...item);}
 const listing=e.target.closest("[data-listing]");if(listing){const[address,price,stats]=related[Number(listing.dataset.listing)];openInfo(address,`<strong class="listing-summary">${price}</strong><p>${stats}</p><p>This is an illustrative related listing from the original brief. Photos are inspiration only; availability, full details and a live listing URL were not provided.</p><button class="text-link" data-mode="showing" data-related="${Number(listing.dataset.listing)}">Preview a private-showing request →</button>`);}
 const mode=e.target.closest("[data-mode]");if(mode)setMode(mode.dataset.mode,mode.dataset.related);
 const anchor=e.target.closest('a[href^="#"]');if(anchor){if(info.open)info.close();closeMenu();}
});
const rsvp=$("#rsvp-form"),dateInput=rsvp.elements.date;
function tomorrow(){const d=new Date();d.setDate(d.getDate()+1);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
dateInput.min=tomorrow();
function setMode(mode,listing){
 if(!["rsvp","showing","message"].includes(mode))return;if(info.open)info.close();
 rsvp.reset();$$("input,select,textarea",rsvp).forEach(n=>n.setCustomValidity(""));rsvp.elements.purpose.value=mode;
 $("#form-title").textContent=mode==="rsvp"?"Make yourself at home.":mode==="showing"?"Your own first impression.":"A conversation starts here.";
 $("#form-note").textContent=mode==="rsvp"?"Explore the RSVP experience. Nothing is sent or reserved; this event date has passed.":mode==="showing"?"Preview a private-showing request for a future date. Nothing is sent, scheduled or confirmed.":"Preview a message to the illustrative agent. No contact is made.";
 $("#submit-label").firstChild.textContent=mode==="rsvp"?"Reserve My Spot":mode==="showing"?"Preview Showing Request":"Preview My Message";
 $("#time-label").hidden=mode==="message";rsvp.elements.time.disabled=mode==="message";rsvp.elements.time.required=mode!=="message";
 $("#date-label").hidden=mode!=="showing";dateInput.disabled=mode!=="showing";dateInput.required=mode==="showing";dateInput.min=tomorrow();
 $("#reset-mode").hidden=mode==="rsvp";
 if(listing!==undefined&&related[Number(listing)])rsvp.elements.message.value=`I’m interested in ${related[Number(listing)][0]}.`;
 if(mode!=="rsvp"){$("#open-house").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});$("#full-name").focus({preventScroll:true});}
}
$("#reset-mode").addEventListener("click",()=>setMode("rsvp"));
rsvp.addEventListener("input",e=>{e.target.setCustomValidity?.("");});
rsvp.addEventListener("change",e=>{e.target.setCustomValidity?.("");});
rsvp.addEventListener("submit",e=>{
 e.preventDefault();const name=rsvp.elements.name,phone=rsvp.elements.phone;
 if(!name.value.trim())name.setCustomValidity("Enter your name, not only spaces.");
 if(phone.value.replace(/\D/g,"").length<7)phone.setCustomValidity("Enter at least seven phone digits.");
 if(rsvp.elements.purpose.value==="showing"&&(!dateInput.value||dateInput.value<tomorrow()))dateInput.setCustomValidity("Choose tomorrow or a later date.");
 if(!rsvp.reportValidity())return;
 const values=new FormData(rsvp),mode=values.get("purpose"),title=mode==="rsvp"?"Your RSVP preview":mode==="showing"?"Your showing-request preview":"Your message preview";
 openInfo(title,"");const p=document.createElement("p");p.textContent="Nothing has been sent, booked or reserved. This is a private, on-device preview.";const who=document.createElement("strong");who.className="receipt-name";who.textContent=String(values.get("name")).trim();
 const summary=document.createElement("p");summary.textContent=mode==="rsvp"?`Original archived event: April 4, 2026, ${values.get("time")} Arizona time. This date has passed.`:mode==="showing"?`Preferred date: ${values.get("date")}; time: ${values.get("time")} Arizona time. Availability is not verified.`:"Message for the illustrative listing agent.";
 const contacts=document.createElement("p");contacts.textContent=`${values.get("email")} · ${values.get("phone")} · Working with an agent: ${values.get("agent")}`;
 const message=document.createElement("p");message.textContent=String(values.get("message")||"No additional message.");content.append(p,who,summary,contacts,message);
 rsvp.reset();setModeAfterPreview();
});
function setModeAfterPreview(){
 rsvp.elements.purpose.value="rsvp";$("#form-title").textContent="Make yourself at home.";$("#form-note").textContent="Explore the RSVP experience. Nothing is sent or reserved; this event date has passed.";
 $("#submit-label").firstChild.textContent="Reserve My Spot";$("#time-label").hidden=false;rsvp.elements.time.disabled=false;rsvp.elements.time.required=true;$("#date-label").hidden=true;dateInput.disabled=true;dateInput.required=false;$("#reset-mode").hidden=true;
}
const menu=$(".menu"),nav=$("#navigation");
function closeMenu(){nav.classList.remove("open");menu.setAttribute("aria-expanded","false");menu.setAttribute("aria-label","Open navigation");}
menu.addEventListener("click",()=>{const open=!nav.classList.contains("open");nav.classList.toggle("open",open);menu.setAttribute("aria-expanded",String(open));menu.setAttribute("aria-label",open?"Close navigation":"Open navigation");});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("open")){closeMenu();menu.focus();}});
document.addEventListener("click",e=>{if(!e.target.closest(".site-header"))closeMenu();});
matchMedia("(min-width: 851px)").addEventListener("change",closeMenu);
new IntersectionObserver(entries=>{$(".mobile-rsvp").classList.toggle("at-form",entries[0].isIntersecting);},{threshold:.1}).observe($(".rsvp-card"));
