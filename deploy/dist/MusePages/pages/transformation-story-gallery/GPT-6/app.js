'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const icon = name => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
const people = [
  {id:'sarah',name:'Sarah M.',full:'Sarah Mitchell',age:34,gender:'Female',location:'Portland, OR',occupation:'Project manager',goal:'Weight Loss',program:'Personal Training',months:8,lost:65,popular:98,weight:'218 → 153 lbs',fat:'38% → 22%',waist:'42 → 32 in',strength:'Goblet squat: 15 → 40 lbs',before:'movement.jpg',after:'athlete.jpg',photo:'coaching.jpg',quote:'I found a stronger version of myself.',summary:'Finding confidence, one day at a time.',motivation:'I wanted to feel present on family adventures instead of sitting them out.',challenge:'Making time for myself while balancing work and family.',routine:'Three coached strength sessions each week, two easy walks, and a flexible meal-planning check-in.',advice:'Start with a commitment small enough to keep. Confidence follows consistency.'},
  {id:'marcus',name:'Marcus T.',full:'Marcus Thompson',age:29,gender:'Male',location:'Austin, TX',occupation:'Designer',goal:'Muscle Gain',program:'Personal Training',months:6,lost:0,popular:92,weight:'162 → 174 lbs',fat:'20% → 17%',waist:'33 → 32 in',strength:'Deadlift: 95 → 225 lbs',before:'gym.jpg',after:'training.jpg',photo:'training.jpg',quote:'Strength changed my perspective.',summary:'Built 12 lbs of muscle in 6 months.',motivation:'I wanted to build confidence in the weights room and feel stronger during everyday life.',challenge:'Learning technique without comparing myself with anyone else.',routine:'Four progressive strength sessions each week, adequate recovery and regular meals.',advice:'Track what you can do, not only what the scale says.'},
  {id:'elena',name:'Elena R.',full:'Elena Rivera',age:27,gender:'Female',location:'Denver, CO',occupation:'Teacher',goal:'Toning',program:'Group Classes',months:3,lost:8,popular:86,weight:'148 → 140 lbs',fat:'29% → 25%',waist:'31 → 29 in',strength:'Full push-ups: 0 → 8',before:'coaching.jpg',after:'movement.jpg',photo:'movement.jpg',quote:'I came for fitness. I found my people.',summary:'More energy and 8 lbs lost in 3 months.',motivation:'I was looking for movement I could actually enjoy after a long day teaching.',challenge:'Walking into a group class for the very first time.',routine:'Three adaptable group classes a week, weekend walks and consistent sleep.',advice:'Choose movement you look forward to. Your people make the difference.'},
  {id:'james',name:'James W.',full:'James Wilson',age:52,gender:'Male',location:'Seattle, WA',occupation:'Accountant',goal:'Weight Loss',program:'Nutrition Coaching',months:12,lost:40,popular:82,weight:'235 → 195 lbs',fat:'34% → 26%',waist:'44 → 37 in',strength:'Farmer carry: 20 → 45 lbs per hand',before:'studio.jpg',after:'training.jpg',photo:'gym.jpg',quote:'Small habits made room for a bigger life.',summary:'Lost 40 lbs over a steady 12 months.',motivation:'I wanted to feel more comfortable hiking with my partner.',challenge:'Replacing an all-or-nothing routine with sustainable habits.',routine:'A weekly nutrition check-in, two coached workouts and comfortable daily walks.',advice:'A slower week is still a week you showed up.'},
  {id:'diane',name:'Diane L.',full:'Diane Lee',age:64,gender:'Female',location:'Bend, OR',occupation:'Retired librarian',goal:'Overall Health',program:'Group Classes',months:6,lost:0,popular:95,weight:'Weight was not a goal',fat:'Not measured',waist:'Not measured',strength:'Chair stands in 30 sec: 8 → 14',before:'studio.jpg',after:'coaching.jpg',photo:'coaching.jpg',quote:'My goal was to keep saying yes to life.',summary:'Stronger balance and confidence in 6 months.',motivation:'I wanted to carry groceries and play with my grandchildren more comfortably.',challenge:'Finding safe modifications that fit my starting point.',routine:'Two adapted group sessions and short walks, with medical clearance and individual modifications.',advice:'Ask for the modification. Your starting point is welcome.'},
  {id:'alex',name:'Alex P.',full:'Alex Parker',age:41,gender:'Male',location:'San Diego, CA',occupation:'Engineer',goal:'Weight Loss',program:'Nutrition Coaching',months:6,lost:28,popular:88,weight:'210 → 182 lbs',fat:'30% → 23%',waist:'38 → 34 in',strength:'Plank: 20 → 75 seconds',before:'gym.jpg',after:'athlete.jpg',photo:'athlete.jpg',quote:'I stopped starting over. I started building.',summary:'Lost 28 lbs with new habits in 6 months.',motivation:'I wanted a routine that still worked when my calendar got busy.',challenge:'Letting go of restrictive plans and making realistic food choices.',routine:'Flexible nutrition coaching, two strength sessions and regular movement breaks.',advice:'Build the routine for your busiest week, not your ideal week.'}
];
let comparisonIndex = 0;
const filters = $('#filters');
function ageGroup(age) { return age <= 30 ? '18-30' : age <= 45 ? '31-45' : age <= 60 ? '46-60' : '60+'; }
function renderGallery() {
  const f = Object.fromEntries(new FormData(filters));
  const query = f.search.trim().toLowerCase();
  const matches = people.filter(p => (!query || `${p.name} ${p.full} ${p.summary} ${p.quote}`.toLowerCase().includes(query)) && (!f.goal || p.goal === f.goal) && (!f.gender || p.gender === f.gender) && (!f.age || ageGroup(p.age) === f.age) && (!f.program || p.program === f.program) && (!f.time || (f.time === '12' ? p.months >= 12 : p.months <= Number(f.time))));
  const sort = $('#sort').value;
  if (sort === 'popular') matches.sort((a,b) => b.popular-a.popular);
  if (sort === 'change') matches.sort((a,b) => b.lost-a.lost);
  $('#result-count').textContent = `${matches.length} ${matches.length === 1 ? 'story' : 'stories'} to inspire your next step`;
  $('#no-results').hidden = matches.length > 0;
  $('#gallery').innerHTML = matches.map(p => `<article class="story-card"><div class="card-photo" data-photo="${p.id}"><img src="assets/${p.before}" alt="Illustrative starting scene for ${p.name}'s fictional story"><img class="alternate" src="assets/${p.after}" alt="Illustrative progress scene, not an actual member result"><span class="card-note">FICTIONAL STORY · STOCK PHOTOS</span><button class="toggle" aria-pressed="false" aria-label="Show after illustration for ${p.name}" data-toggle="${p.id}">${icon('move-horizontal')}<span>Before / After</span></button></div><div class="card-body"><div class="card-title"><h3>${p.name} <span>age ${p.age}</span></h3>${icon('award')}</div><p>${p.summary} · Example result</p><p class="card-quote">“${p.quote}”</p><div class="card-footer"><span>${p.goal.toUpperCase()}</span><button data-story="${p.id}">View story ${icon('arrow-up-right')}</button></div></div></article>`).join('');
}
filters.addEventListener('input', renderGallery);
filters.addEventListener('submit', event => event.preventDefault());
filters.addEventListener('reset', () => setTimeout(renderGallery, 0));
$('#sort').addEventListener('change', renderGallery);
$('#clear-empty').addEventListener('click', () => { filters.reset(); $('#sort').value = 'recent'; renderGallery(); });
renderGallery();
$$('.comparison input[type=range]').forEach(input => input.addEventListener('input', () => input.closest('.comparison').style.setProperty('--reveal', `${input.value}%`)));
function togglePhoto(id, force) {
  const photo = $(`[data-photo="${id}"]`);
  const after = force === undefined ? !photo.classList.contains('is-after') : force;
  photo.classList.toggle('is-after', after);
  const button = $('button', photo);
  button.setAttribute('aria-pressed', String(after));
  button.setAttribute('aria-label', `Show ${after ? 'before' : 'after'} illustration for ${people.find(p=>p.id===id).name}`);
  $('span', button).textContent = after ? 'After / Show before' : 'Before / Show after';
}
let touchStart = null;
$('#gallery').addEventListener('touchstart', event => { const photo = event.target.closest('[data-photo]'); if(photo) touchStart = {id:photo.dataset.photo,x:event.touches[0].clientX,y:event.touches[0].clientY}; }, {passive:true});
$('#gallery').addEventListener('touchend', event => { if (!touchStart) return; const dx = event.changedTouches[0].clientX-touchStart.x; const dy = event.changedTouches[0].clientY-touchStart.y; if (Math.abs(dx)>40 && Math.abs(dx)>Math.abs(dy)) togglePhoto(touchStart.id, dx<0); touchStart=null; }, {passive:true});
const storyDialog = $('#story-dialog');
function showStory(id) {
  const p = people.find(person => person.id === id);
  if (!p) return;
  $('#story-content').innerHTML = `<p class="eyebrow">EVERYDAY STRONG / FICTIONAL MEMBER JOURNEY</p><h2 id="story-title">${p.full}’s next chapter</h2><p>${p.age} · ${p.occupation} · ${p.location}<br>Example member since January 2025 · ${p.program}</p><p class="pill">ALL METRICS & QUOTES ARE FICTIONAL · STOCK MODELS ARE NOT MEMBERS</p><img class="dialog-hero" src="assets/${p.photo}" alt="Stock fitness illustration, not ${p.full}"><h3>Why I decided to change</h3><p>“${p.motivation}”</p><h3>The starting point</h3><p>${p.challenge} Fitness level: new to a consistent structured routine. The first goal was a manageable weekly commitment and a conversation about safe progress.</p><h3>The journey, one chapter at a time</h3><div class="timeline"><p><strong>Month 1 — A starting point.</strong><br>Set personal goals, learn movement basics and begin a routine at a comfortable pace.</p><p><strong>Month ${Math.max(2,Math.round(p.months/2))} — Finding a rhythm.</strong><br>Review progress, adapt the plan and celebrate consistency, not perfection.</p><p><strong>Month ${p.months} — A new chapter.</strong><br>${p.summary} Next focus: maintaining supportive habits.</p></div><h3>A closer look at progress</h3><div class="progress-photos"><figure><img src="assets/${p.before}" alt="Illustrative starting scene"><figcaption>Starting point · stock illustration</figcaption></figure><figure><img src="assets/${p.photo}" alt="Illustrative progress scene"><figcaption>Midpoint · stock illustration</figcaption></figure><figure><img src="assets/${p.after}" alt="Illustrative current scene"><figcaption>Current chapter · stock illustration</figcaption></figure></div><p>These images illustrate the story. They are not chronological photos of one person.</p><div class="comparison secondary" style="--reveal:50%;height:280px"><img class="base-photo" src="assets/${p.before}" alt="Before illustration"><div class="after-photo"><img src="assets/${p.after}" alt="After illustration"></div><div class="divider"><span>${icon('move-horizontal')}</span></div><input type="range" min="0" max="100" value="50" aria-label="${p.full} comparison"></div><h3>Example stats breakdown</h3><div class="measurements"><p><strong>Weight</strong><br>${p.weight}</p><p><strong>Body fat</strong><br>${p.fat}</p><p><strong>Waist</strong><br>${p.waist}</p><p><strong>Strength</strong><br>${p.strength}</p></div><p>Hip measurements were not recorded. Examples are not medical data or predicted outcomes.</p><h3>The program</h3><p>${p.routine} Support included an example weekly coach check-in and an adaptable plan; individualized nutrition or medical advice is outside this demo.</p><h3>In their own words</h3><blockquote>“${p.advice}”</blockquote><p>Favorite exercise: ${p.goal==='Muscle Gain'?'a carefully coached deadlift':'a manageable full-body strength circuit'}. Biggest lesson: ${p.challenge}</p><div class="trainer-note"><img src="assets/coaching.jpg" alt="Illustrative coaching stock photo, not the named trainer"><div><strong>Trainer’s note · Jamie Reed, fictional coach</strong><p>“What made the difference in this example was an adaptable routine and room for ordinary life. We celebrate effort and individual progress.”</p></div></div><p>Results vary. Consult a physician before beginning a fitness program. Qualifications and health outcomes are illustrative, not verified.</p><button class="button orange" data-consult>Explore your own starting point ${icon('arrow-up-right')}</button>`;
  $('input[type=range]', storyDialog).addEventListener('input', event => event.target.closest('.comparison').style.setProperty('--reveal', `${event.target.value}%`));
  storyDialog.showModal();
}
document.addEventListener('click', event => {
  const story = event.target.closest('[data-story]');
  const toggle = event.target.closest('[data-toggle]');
  if(story) showStory(story.dataset.story);
  if(toggle) togglePhoto(toggle.dataset.toggle);
  if(event.target.closest('[data-close]')) event.target.closest('dialog').close();
  if(event.target.closest('[data-consult]')) {
    $$('dialog[open]').forEach(dialog=>dialog.close());
    $('#consult-dialog').showModal();
  }
});
$$('dialog').forEach(dialog => dialog.addEventListener('click', event => { if(event.target===dialog){ const r=dialog.getBoundingClientRect(); if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) dialog.close(); } }));
$('.menu-button').addEventListener('click', () => { const expanded=$('.menu-button').getAttribute('aria-expanded')==='true'; $('.menu-button').setAttribute('aria-expanded',String(!expanded)); $('#navigation').classList.toggle('is-open',!expanded); });
$$('#navigation a').forEach(link=>link.addEventListener('click',()=>{$('#navigation').classList.remove('is-open');$('.menu-button').setAttribute('aria-expanded','false');}));
$$('[data-program-goal],[data-program-filter]').forEach(button=>button.addEventListener('click',()=>{filters.reset(); if(button.dataset.programGoal) filters.elements.goal.value=button.dataset.programGoal; else filters.elements.program.value=button.dataset.programFilter; renderGallery(); $('#stories').scrollIntoView();}));
function updateComparison() {
  const p=people[comparisonIndex];
  $('#compare-before').src=`assets/${p.before}`; $('#compare-after').src=`assets/${p.after}`;
  $('#compare-name').textContent=p.name; $('#compare-description').textContent=p.summary;
  $('#compare-position').textContent=`${comparisonIndex+1} / ${people.length}`;
  $('#comparison-range').value='50'; $('#comparison-range').closest('.comparison').style.setProperty('--reveal','50%'); $('#share-status').textContent='';
}
$('#previous').addEventListener('click',()=>{comparisonIndex=(comparisonIndex+people.length-1)%people.length;updateComparison();});
$('#next').addEventListener('click',()=>{comparisonIndex=(comparisonIndex+1)%people.length;updateComparison();});
let autoTimer=null;
function stopAutoplay(){clearInterval(autoTimer);autoTimer=null;$('#autoplay').setAttribute('aria-pressed','false');$('#autoplay').innerHTML=icon('play')+'Auto-play comparisons';}
$('#autoplay').addEventListener('click',()=>{
  if(autoTimer){stopAutoplay();return;}
  $('#autoplay').setAttribute('aria-pressed','true');$('#autoplay').innerHTML=icon('pause')+'Pause comparisons';
  let value=0,direction=1;autoTimer=setInterval(()=>{value+=direction*2;if(value>=100){value=100;direction=-1;}if(value<=0){value=0;direction=1;comparisonIndex=(comparisonIndex+1)%people.length;updateComparison();}$('#comparison-range').value=String(value);$('#comparison-range').closest('.comparison').style.setProperty('--reveal',`${value}%`);},80);
});
$('#comparison-range').addEventListener('pointerdown',stopAutoplay);
$('#comparison-range').addEventListener('keydown',stopAutoplay);
$('#share-story').addEventListener('click',async()=>{
  const url=new URL(location.href);url.hash=`story-${people[comparisonIndex].id}`;
  try { await navigator.clipboard.writeText(url.href); $('#share-status').textContent='Story link copied. Opens this fictional story directly.'; }
  catch { $('#share-status').textContent=`Copy this story link: ${url.href}`; $('#share-status').style.overflowWrap='anywhere'; }
});
const initialStory=location.hash.match(/^#story-(\w+)$/)?.[1];if(initialStory) showStory(initialStory);
let filmTimer=null,filmSeconds=0,filmMember=null,filmPaused=false;
const captions=['Every journey begins with one small step.','Progress meant finding a routine that fit real life.','Stronger, with a little support. A fictional next chapter.'];
function filmFrame(){
  const frame=Math.min(2,Math.floor(filmSeconds/4));
  $('#film-image').src=`assets/${[filmMember.before,filmMember.photo,filmMember.after][frame]}`;
  $('#film-caption').textContent=captions[frame];$('#film-progress').value=filmSeconds;
}
function playFilm(){clearInterval(filmTimer);filmPaused=false;$('#film-toggle').textContent='Pause storyboard';filmTimer=setInterval(()=>{filmSeconds=Math.min(12,filmSeconds+.25);filmFrame();if(filmSeconds>=12){clearInterval(filmTimer);filmPaused=true;$('#film-toggle').textContent='Replay storyboard';}},250);}
$$('[data-film]').forEach(button=>button.addEventListener('click',()=>{filmMember=people.find(p=>p.id===button.dataset.film);filmSeconds=0;$('#film-title').textContent=`${filmMember.name} — a new chapter`;filmFrame();$('#film-dialog').showModal();playFilm();}));
$('#film-toggle').addEventListener('click',()=>{if(filmPaused){if(filmSeconds>=12)filmSeconds=0;playFilm();}else{clearInterval(filmTimer);filmPaused=true;$('#film-toggle').textContent='Play storyboard';}});
$('#film-dialog').addEventListener('close',()=>clearInterval(filmTimer));
let uploadUrl=null;
$('#photo-upload').addEventListener('change',event=>{
  if(uploadUrl)URL.revokeObjectURL(uploadUrl);uploadUrl=null;$('#photo-preview').hidden=true;$('#photo-status').textContent='';event.target.setCustomValidity('');
  const file=event.target.files[0];if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){event.target.value='';$('#photo-status').textContent='Choose a JPEG, PNG or WebP image smaller than 5 MB.';return;}
  uploadUrl=URL.createObjectURL(file);$('#photo-preview').src=uploadUrl;$('#photo-preview').hidden=false;$('#photo-status').textContent=`${file.name} · local preview only`;
  $('#photo-preview').onerror=()=>{event.target.value='';$('#photo-preview').hidden=true;$('#photo-status').textContent='This file could not be decoded. Please choose another image.';URL.revokeObjectURL(uploadUrl);uploadUrl=null;};
});
$('#story-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.target);$('#submission-status').textContent=`Thanks, ${String(data.get('name')).trim()}. Your story preview is ready (${String(data.get('story')).trim().length} characters). Nothing was uploaded, submitted or saved. It will be lost when this tab closes.`;});
$('#consult-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.target);$('#consult-status').textContent=`${String(data.get('name')).trim()}, your example next step is a conversation about ${data.get('interest')}. This is a local preview only: no email sent and no appointment booked.`;});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopAutoplay();clearInterval(filmTimer);filmPaused=true;$('#film-toggle').textContent='Play storyboard';}});
window.addEventListener('pagehide',()=>{stopAutoplay();clearInterval(filmTimer);if(uploadUrl)URL.revokeObjectURL(uploadUrl);});
