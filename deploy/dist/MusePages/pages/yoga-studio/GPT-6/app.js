'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const icon=name=>`<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
const classes=[
 {name:'Vinyasa Flow',key:'Vinyasa',description:'Dynamic, breath-linked movement. Build strength, flexibility and focus.',minutes:60,level:'All levels',symbol:'flame',color:'#c7d1b3'},
 {name:'Hot Power Yoga',key:'Hot',description:'Traditional power yoga in a 95°F heated room. A strong, steady practice.',minutes:75,level:'Intermediate+',symbol:'flame',color:'#d6b49b'},
 {name:'Yin Yoga',key:'Yin',description:'Slow, passive poses held for 3–5 minutes. Space to soften and settle.',minutes:75,level:'All levels',symbol:'moon',color:'#c7bfd4'},
 {name:'Restorative',key:'Restorative',description:'Prop-supported poses and an unhurried pace. An invitation to rest.',minutes:60,level:'All levels',symbol:'cloud',color:'#c3d6cf'},
 {name:'Meditation & Breathwork',key:'Meditation',description:'Guided mindfulness, pranayama and gentle visualization techniques.',minutes:30,level:'All levels',symbol:'eye',color:'#e4d7b4'},
 {name:'Prenatal Yoga',key:'Prenatal',description:'A nurturing, adapted practice for expecting mothers, with individual guidance.',minutes:60,level:'All levels',symbol:'heart',color:'#e2c4c0'},
 {name:'Yoga Sculpt',key:'Sculpt',description:'Yoga meets light weights. Cardio bursts, strength work and stretching.',minutes:60,level:'Intermediate',symbol:'dumbbell',color:'#c2d0d5'}
];
const teachers=[
 {id:'maya',name:'Maya R.',credential:'Lead Instructor · E-RYT 500',specialties:'Vinyasa, Meditation',years:12,photo:'maya.jpg',bio:'Maya’s classes blend physical challenge with mindfulness. Her playlists are legendary.'},
 {id:'devon',name:'Devon K.',credential:'Hot Yoga Specialist · RYT 200',specialties:'Hot Power, Vinyasa',years:6,photo:'devon.jpg',bio:'Devon brings the heat — literally. Expect to sweat, laugh and leave renewed.'},
 {id:'lena',name:'Lena M.',credential:'Yin & Restorative · E-RYT 500',specialties:'Yin, Restorative, Prenatal',years:15,photo:'lena.jpg',bio:'Lena creates the most calming space. Her yin classes feel like a warm hug.'},
 {id:'carlos',name:'Carlos G.',credential:'Yoga Sculpt · RYT 200',specialties:'Sculpt, Vinyasa Flow',years:4,photo:'carlos.jpg',bio:'Carlos fuses yoga with fitness. Come ready to work — and have fun.'}
];
const schedule=[
 {id:0,time:'6:00 AM',key:'Vinyasa',teacher:'maya',place:'South Lamar',room:'Studio A',spots:8},
 {id:1,time:'7:30 AM',key:'Hot',teacher:'devon',place:'South Lamar',room:'Hot Room',spots:0},
 {id:2,time:'9:00 AM',key:'Yin',teacher:'lena',place:'Domain',room:'Studio B',spots:12},
 {id:3,time:'10:30 AM',key:'Sculpt',teacher:'carlos',place:'South Lamar',room:'Studio A',spots:5},
 {id:4,time:'12:00 PM',key:'Meditation',teacher:'maya',place:'Livestream',room:'Online studio',spots:Infinity},
 {id:5,time:'5:30 PM',key:'Vinyasa',teacher:'aisha',place:'Domain',room:'Studio A',spots:10},
 {id:6,time:'7:00 PM',key:'Restorative',teacher:'lena',place:'South Lamar',room:'Studio B',spots:15}
];
const videos=[
 {id:0,title:'Morning Vinyasa Flow',duration:45,teacher:'Maya R.',rating:'4.9',views:312,image:'hero.jpg',category:'Vinyasa'},
 {id:1,title:'Deep Yin for Hips & Lower Back',duration:60,teacher:'Lena M.',rating:'4.8',views:287,image:'lena.jpg',category:'Yin'},
 {id:2,title:'Quick Desk Break Stretch',duration:10,teacher:'Carlos G.',rating:'4.9',views:541,image:'carlos.jpg',category:'Stretch'},
 {id:3,title:'Sleep Meditation & Body Scan',duration:20,teacher:'Devon K.',rating:'4.7',views:198,image:'maya.jpg',category:'Meditation'}
];
const workshops=[
 {id:0,month:'JAN',day:18,date:'January 18, 2027 · 2–4 PM',title:'Handstand Workshop',teacher:'Carlos G.',price:'$45',description:'Break down arm balances and inversions. All levels welcome — we use the wall, with appropriate guidance.',spots:8},
 {id:1,month:'FEB',day:1,date:'February 1, 2027 · 7–8:30 PM',title:'Sound Bath & Restorative',teacher:'Lena M.',price:'$35',description:'Crystal singing bowls, candlelight and deep rest. Bring a blanket and settle into stillness.',spots:14},
 {id:2,month:'MAR',day:1,date:'Starts March 1, 2027 · 12 weeks',title:'200-Hour Teacher Training',teacher:'Maya R. & Lena M.',price:'$3,200',description:'An illustrative 12-week immersive program. Payment-plan concept available; certification is not verified.',spots:4}
];
const dialog=$('#action-dialog');let lastFocus=null,videoTimer=null;
function openDialog(html){if(dialog.open)dialog.close();lastFocus=document.activeElement;$('#dialog-content').innerHTML=html;dialog.showModal();}
function closeDialog(){dialog.close();}
$('.close',dialog).addEventListener('click',closeDialog);
dialog.addEventListener('close',()=>{clearInterval(videoTimer);videoTimer=null;lastFocus?.isConnected&&lastFocus.focus();});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog();}});
const htmlEscape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
function localForm(title,description,kind='preview'){
  return `<p class="eyebrow">INHALE STUDIO · LOCAL PREVIEW</p><h2 id="dialog-title">${htmlEscape(title)}</h2><p>${htmlEscape(description)}</p><p class="micro">Fictional studio. Nothing is sent, saved, charged or reserved.</p><form id="local-form" data-kind="${kind}"><label>Your name<input name="name" autocomplete="name" required maxlength="80"></label><label>Email address<input name="email" type="email" autocomplete="email" required maxlength="200"></label><label class="consent"><input name="consent" type="checkbox" required><span>I understand this is a local demo, not a confirmed booking or purchase.</span></label><button class="button taupe" type="submit">Preview ${kind} ${icon('arrow-up-right')}</button><p id="local-status" role="status"></p></form>`;
}
$('#class-rail').innerHTML=classes.map(c=>`<article class="class-card" style="--class-color:${c.color}">${icon(c.symbol)}<h3>${c.name}</h3><p>${c.description}</p><div class="class-meta"><span>${c.minutes} MIN</span><span>${c.level}</span></div><button data-class="${c.key}">Book this class ${icon('arrow-up-right')}</button></article>`).join('');
$('#class-prev').addEventListener('click',()=>$('#class-rail').scrollBy({left:-280,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
$('#class-next').addEventListener('click',()=>$('#class-rail').scrollBy({left:280,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
let place='South Lamar',style='All',day=12;
$('#schedule-filters').innerHTML=['All','Vinyasa','Hot','Yin','Restorative','Meditation','Sculpt'].map(key=>`<button data-style="${key}" aria-pressed="${key==='All'}">${key}</button>`).join('');
$('#week-days').innerHTML=Array.from({length:7},(_,i)=>`<button data-day="${12+i}" aria-pressed="${i===0}">${['THU','FRI','SAT','SUN','MON','TUE','WED'][i]}<br>NOV ${12+i}</button>`).join('');
function teacherName(id){return teachers.find(t=>t.id===id)?.name||'Aisha T.';}
function renderSchedule(){
  const rows=schedule.filter(s=>s.place===place&&(style==='All'||s.key===style));
  const desktop=!matchMedia('(max-width:520px)').matches;
  $('#schedule-list').innerHTML=`${day!==12?`<p class="week-status">Sample classes for November ${day}, 2026. Illustrative repeated weekly timetable.</p>`:''}${rows.map(s=>{
    const c=classes.find(c=>c.key===s.key);return `<details class="schedule-row" ${desktop?'open':''}><summary tabindex="${desktop?-1:0}"><time>${s.time}</time><span class="schedule-class" style="--class-color:${c.color}"><span class="class-dot"></span><span><strong>${c.name}</strong><button class="teacher-link" data-teacher="${s.teacher}">with ${teacherName(s.teacher)}</button></span></span></summary><div class="schedule-detail"><span class="schedule-place">${s.place}<span>${s.room}</span></span><span class="availability">${s.spots===Infinity?'Unlimited':s.spots===0?'Full · waitlist':`${s.spots} spots left`}</span><button class="book ${s.spots===0?'waitlist':''}" data-book="${s.id}">${s.spots===0?'Join waitlist':'Book'}</button></div></details>`;
  }).join('')||'<p class="schedule-empty">No sample classes for this combination. Try another location or class style.</p>'}`;
  $$('[data-place]').forEach(button=>button.setAttribute('aria-selected',String(button.dataset.place===place)));
  $$('[data-style]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.style===style)));
}
renderSchedule();
matchMedia('(max-width:520px)').addEventListener('change',()=>renderSchedule());
function selectPlace(value){place=value;if(value!=='Livestream')$('#location').value=value;renderSchedule();}
$('#location').addEventListener('change',event=>selectPlace(event.target.value));
$$('[data-place]').forEach(button=>button.addEventListener('click',()=>selectPlace(button.dataset.place)));
$('.tabs').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const tabs=$$('[data-place]');const index=tabs.indexOf(document.activeElement);const next=event.key==='Home'?0:event.key==='End'?2:(index+(event.key==='ArrowRight'?1:-1)+3)%3;tabs[next].focus();selectPlace(tabs[next].dataset.place);});
$('#schedule-filters').addEventListener('click',event=>{const b=event.target.closest('[data-style]');if(b){style=b.dataset.style;renderSchedule();}});
$('#week-toggle').addEventListener('click',()=>{const show=$('#week-days').hidden;$('#week-days').hidden=!show;$('#week-toggle').setAttribute('aria-expanded',String(show));});
$('#week-days').addEventListener('click',event=>{const button=event.target.closest('[data-day]');if(button){day=Number(button.dataset.day);$$('[data-day]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderSchedule();}});
$('#instructor-grid').innerHTML=teachers.map(t=>`<article class="instructor-card"><div class="instructor-image"><img src="assets/${t.photo}" alt="Illustrative stock portrait, not ${t.name}"></div><h3>${t.name}</h3><p class="credentials">${t.credential}</p><p class="specialties">${t.specialties} · ${t.years} years teaching*</p><blockquote>“${t.bio}”</blockquote><button data-teacher="${t.id}">View schedule ${icon('arrow-up-right')}</button></article>`).join('');
$('#video-grid').innerHTML=videos.map(v=>`<button class="video-button" data-video="${v.id}" aria-label="Preview ${v.title}"><div class="video-image"><img src="assets/${v.image}" alt="Illustrative ${v.category.toLowerCase()} practice"><span class="video-play">${icon('play')}</span><span class="duration">${v.duration} MIN</span></div><h3>${v.title}</h3><p>with ${v.teacher}</p><p class="rating">${v.rating} ${icon('star')} · ${v.views} example views · demo</p></button>`).join('');
$$('.stars').forEach(stars=>stars.innerHTML=Array.from({length:5},()=>icon('star')).join(''));
$('#workshop-grid').innerHTML=workshops.map(w=>`<article class="workshop-card"><div class="workshop-date"><div class="date-square">${w.month}<strong>${w.day}</strong></div><span>${w.date}<br>${w.spots} example spots left</span></div><h3>${w.title}</h3><p>with ${w.teacher}</p><p class="description">${w.description}</p><div class="workshop-bottom"><span>${w.price}</span><button class="text-button" data-workshop="${w.id}">Register ${icon('arrow-up-right')}</button></div></article>`).join('');
function showTeacher(id){
  const t=teachers.find(t=>t.id===id);
  if(!t){openDialog(`<h2 id="dialog-title">Aisha T.</h2><p>Fictional guest Vinyasa instructor. Aisha’s sample class is at Domain, 5:30 PM.</p><button class="button taupe" data-teacher-schedule="aisha">View sample schedule</button>`);return;}
  openDialog(`<p class="eyebrow">YOUR GUIDES · FICTIONAL INSTRUCTOR</p><h2 id="dialog-title">${t.name}</h2><p>${t.credential} · ${t.years} example years teaching</p><img class="profile-photo" src="assets/${t.photo}" alt="Stock illustration, not ${t.name}"><p>${t.bio}</p><p>Specialties: ${t.specialties}. Qualifications and experience are fictional; no actual credential verification is implied.</p><button class="button taupe" data-teacher-schedule="${t.id}">View sample schedule ${icon('arrow-up-right')}</button>`);
}
let videoSeconds=0,videoPaused=false,activeVideo=null;
function videoFrame(){const captions=['A little space to arrive.','A moment to notice your breath.','Come as you are. Begin at your own pace.'];$('#preview-caption').textContent=captions[Math.min(2,Math.floor(videoSeconds/4))];$('#preview-progress').value=videoSeconds;}
function playVideo(){clearInterval(videoTimer);videoPaused=false;$('#preview-toggle').textContent='Pause preview';videoTimer=setInterval(()=>{videoSeconds=Math.min(12,videoSeconds+.25);videoFrame();if(videoSeconds>=12){clearInterval(videoTimer);videoPaused=true;$('#preview-toggle').textContent='Replay preview';}},250);}
function showVideo(id){activeVideo=videos.find(v=>v.id===Number(id));videoSeconds=0;openDialog(`<p class="eyebrow">ON-DEMAND · LOCAL VISUAL PREVIEW</p><h2 id="dialog-title">${activeVideo.title}</h2><p>Example full class: ${activeVideo.duration} min with ${activeVideo.teacher}. This 12-second silent still-image preview is not an instructional class or recorded instructor video.</p><div class="preview-stage"><img src="assets/${activeVideo.image}" alt="Illustrative yoga mood image"><p id="preview-caption"></p></div><progress id="preview-progress" max="12" value="0" aria-label="Preview progress"></progress><button id="preview-toggle" class="button taupe">Pause preview</button><p>Full classes, the 500+ catalog, subscriptions and streaming are not connected in this static concept. Consult qualified guidance before practicing.</p>`);videoFrame();playVideo();}
function showLibrary(){
  openDialog(`<p class="eyebrow">A LITTLE MOVEMENT, WHEREVER YOU ARE</p><h2 id="dialog-title">Find your next practice.</h2><p>Browse four local demonstration previews. A full 500+ video library is not connected.</p><label>Search previews<input id="library-search" type="search" placeholder="Vinyasa, Yin, stretch…"></label><div class="library-results" id="library-results"></div><p id="library-count" role="status"></p>`);
  const update=()=>{const q=$('#library-search').value.trim().toLowerCase();const found=videos.filter(v=>`${v.title} ${v.teacher} ${v.category}`.toLowerCase().includes(q));$('#library-results').innerHTML=found.map(v=>`<button data-video="${v.id}">${v.title}<br><small>${v.duration} min · ${v.teacher}</small></button>`).join('');$('#library-count').textContent=`${found.length} local previews${found.length?'':' — try another search'}.`;};$('#library-search').addEventListener('input',update);update();
}
const infos={
 'Our Story':'Inhale is a fictional Austin wellness concept built around warm, welcoming spaces and adaptable movement. Both locations and all studio services shown are illustrative.',
 'Careers':'This concept has no active vacancies or hiring inbox. A real application flow would state the employer, requirements, data handling and contact details.',
 'Blog':'Studio journal preview: begin small, make space for rest and choose movement that feels appropriate for your experience. Full articles are not part of this homepage.',
 'Gift Cards':'Gift-card concept: choose a class or membership credit with a real provider. Cards are not issued or sold by this static demo.',
 'Refer a Friend':'Example referral idea: invite a friend to an introductory class. This page creates no referral accounts, rewards or messages.',
 'Student Discount':'Illustrative offer: 20% off eligible studio classes with current student ID, subject to provider terms. Eligibility is not checked and no purchase is available here.',
 'Contact':'The prompt’s email hello@inhalestudio.com, phone (512) 555-0178 and Austin addresses are illustrative. This concept has no connected contact channel, email delivery or phone service.',
 'Privacy Policy':'This demo sends no form submissions and uses no analytics, accounts, cookies or local storage. Entered details remain in this tab and disappear on reload or close. A real provider would publish its own legally reviewed policy.',
 'Terms of Service':'This is a fictional static concept, not a yoga provider. Prices, schedules, offers, availability, credentials and testimonials are illustrative. No contract, payment or booking is created. Original prompt and asset rights remain with their owners.',
 'Accessibility':'Keyboard navigation, labeled fields, native dialogs, reduced-motion support and mobile schedule accordions are provided. Use Tab to move, Enter or Space to activate and Escape to close dialogs. Content adapts down to 320px.',
 'Instagram':'No official Instagram account is connected. The photographs on this concept are locally hosted stock illustrations.',
 'Facebook':'No official Facebook community is connected. Explore the fictional studio sections on this page instead.',
 'YouTube':'No YouTube channel is connected. The on-demand section offers four silent local visual previews.',
 'Spotify':'No Spotify playlists or account connection are provided. Instructor playlist references are fictional design copy.'
};
document.addEventListener('click',event=>{
  const closest=selector=>event.target.closest(selector);
  if(closest('[data-class]')){style=closest('[data-class]').dataset.class;if(style==='Prenatal'){openDialog(localForm('Prenatal Yoga — interest preview','No prenatal sessions are listed in the sample timetable. A real provider would confirm availability, qualifications and individual suitability.','interest'));}else{renderSchedule();$('#schedule').scrollIntoView();}}
  if(closest('[data-book]')){const s=schedule.find(s=>s.id===Number(closest('[data-book]').dataset.book));const c=classes.find(c=>c.key===s.key);openDialog(localForm(`${s.spots===0?'Join waitlist':'Book'}: ${c.name}`,`November ${day}, 2026 · ${s.time} CST · ${s.place} · ${teacherName(s.teacher)}. Availability is illustrative.`,s.spots===0?'waitlist':'booking'));}
  if(closest('[data-teacher]'))showTeacher(closest('[data-teacher]').dataset.teacher);
  if(closest('[data-teacher-schedule]')){const id=closest('[data-teacher-schedule]').dataset.teacher;const s=schedule.find(s=>s.teacher===id);closeDialog();style='All';selectPlace(s?.place||'South Lamar');$('#schedule').scrollIntoView();$$('.schedule-row').forEach(row=>row.open=true);}
  if(closest('[data-plan]'))openDialog(localForm(closest('[data-plan]').dataset.plan,'Explore an illustrative membership. No checkout, recurring charge or subscription is created.','membership'));
  if(closest('[data-workshop]')){const w=workshops.find(w=>w.id===Number(closest('[data-workshop]').dataset.workshop));openDialog(localForm(w.title,`${w.date} · ${w.teacher} · ${w.price}. ${w.description}`,'registration'));}
  if(closest('[data-training]')){const w=workshops[2];openDialog(localForm(w.title,`${w.date} · ${w.price}. Fictional program; no credential is awarded or verified. Payment plans are an example only.`,'interest'));}
  if(closest('[data-video]'))showVideo(closest('[data-video]').dataset.video);
  if(closest('#preview-toggle')){if(videoPaused){if(videoSeconds>=12)videoSeconds=0;playVideo();}else{clearInterval(videoTimer);videoPaused=true;$('#preview-toggle').textContent='Play preview';}}
  if(closest('[data-offer]')){closeDialog();$('#offer').scrollIntoView();$('#offer-email').focus({preventScroll:true});}
  if(closest('[data-visit]')){const location=closest('[data-visit]').dataset.visit;openDialog(`<p class="eyebrow">ILLUSTRATIVE STUDIO GUIDE</p><h2 id="dialog-title">${location}</h2><p>${location==='South Lamar'?'2401 S Lamar Blvd, Austin, TX 78704 · 2 studios + hot room · free parking lot · 6 AM–9 PM daily.':'11005 Burnet Rd, Suite 120, Austin, TX 78758 · 1 studio + meditation room · garage parking, example first 2 hours free · 7 AM–9 PM daily.'}</p><p>This is a fictional location concept, not a verified operating studio. Maps are local schematic illustrations, not navigation or accessibility directions.</p><button class="button taupe" data-place-preview="${location}">See sample classes ${icon('arrow-up-right')}</button>`);}
  if(closest('[data-place-preview]')){const location=closest('[data-place-preview]').dataset.placePreview;closeDialog();style='All';selectPlace(location);$('#schedule').scrollIntoView();}
  if(closest('[data-info]')){const name=closest('[data-info]').dataset.info;openDialog(`<p class="eyebrow">INHALE STUDIO · CONCEPT INFORMATION</p><h2 id="dialog-title">${name}</h2>${name==='FAQ'?'<details><summary>Is this a real yoga studio?</summary><p>No. It is an interactive static design concept, with fictional services and local previews.</p></details><details><summary>What should I bring to a class?</summary><p>The example offer includes a mat. In a real studio, confirm equipment, accessibility and suitability directly with the provider.</p></details><details><summary>Is prenatal or hot yoga right for me?</summary><p>Ask a qualified clinician and instructor about your individual circumstances before starting. This page does not provide medical advice.</p></details>':`<p>${infos[name]||'This feature is a local concept preview.'}</p>`}`);}
});
document.addEventListener('submit',event=>{
  if(event.target.id==='local-form'){event.preventDefault();const data=new FormData(event.target);$('#local-status').textContent=`${String(data.get('name')).trim()}, your ${event.target.dataset.kind} preview is ready. Nothing has been sent, saved, reserved or charged. This is not a confirmation.`;}
});
$('#browse-library').addEventListener('click',showLibrary);
$('#offer-form').addEventListener('submit',event=>{event.preventDefault();$('#offer-status').textContent='Your free-class preview is ready. No email was sent, no account was created and no class was booked. This offer is illustrative only.';});
const menu=$('.menu'),nav=$('#nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const opened=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!opened));nav.classList.toggle('open',!opened);});
$$('#nav a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&videoTimer){clearInterval(videoTimer);videoPaused=true;if($('#preview-toggle'))$('#preview-toggle').textContent='Play preview';}});
window.addEventListener('pagehide',()=>clearInterval(videoTimer));
