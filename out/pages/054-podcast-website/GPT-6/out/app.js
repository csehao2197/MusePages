const episodes=[
  {id:187,title:'How Figma Rebuilt Their Multiplayer Engine',guest:'Dylan Field',company:'Figma',date:'March 4, 2026',minutes:58,tags:['Engineering','Design'],description:'Real-time collaboration, WebSocket scaling, and the trade-offs behind a shared canvas.',notes:'A proposed engineering conversation about conflict resolution, connection management and rendering. No interview took place, and the brief’s Figma/Rust rewrite claim has not been verified.'},
  {id:186,title:"Inside Linear’s Product Philosophy",guest:'Karri Saarinen',company:'Linear',date:'March 4, 2026',minutes:47,tags:['Design','Founders'],description:'How a clear product point of view can guide a thousand small decisions.'},
  {id:185,title:'Scaling to 10M Users with a 5-Person Team',guest:'Sarah Chen',company:'Fictional guest',date:'February 25, 2026',minutes:52,tags:['Engineering','Growth'],description:'A hypothetical look at small-team systems, operational focus and knowing what not to build.'},
  {id:184,title:'Why We Chose Rust for Our Backend',guest:'James Liu',company:'Fictional guest',date:'February 18, 2026',minutes:41,tags:['Engineering'],description:'Ownership, performance, and the human cost of changing your stack.'},
  {id:183,title:'The Art of Developer Marketing',guest:'Emily Zhang',company:'Fictional guest',date:'February 11, 2026',minutes:38,tags:['Growth'],description:'Helpful documentation, earned trust, and meeting developers where they are.'},
  {id:182,title:'From Side Project to $50M ARR',guest:'Marcus Johnson',company:'Fictional guest',date:'February 4, 2026',minutes:55,tags:['Founders','Growth'],description:'The proposed messy middle between a useful weekend idea and a sustainable business.'},
  {id:181,title:'Designing for AI-First Products',guest:'Anna Kowalski',company:'Fictional guest',date:'January 28, 2026',minutes:44,tags:['AI','Design'],description:'Designing interfaces around uncertainty, correction and human judgment.'},
  {id:180,title:'What Small Teams Can Stop Doing',guest:'Maya Park & Diego Santos',company:'Fictional hosts',date:'January 21, 2026',minutes:36,tags:['Engineering','Founders'],description:'An original concept about fewer meetings, smaller batches, and making room to focus.'},
  {id:179,title:'Prototyping with AI, Keeping Your Judgment',guest:'Maya Park & Diego Santos',company:'Fictional hosts',date:'January 14, 2026',minutes:40,tags:['AI','Design'],description:'Use a fast first draft without confusing a prototype with a reliable product.'},
  {id:178,title:'The First Ten Customer Conversations',guest:'Diego Santos',company:'Fictional host',date:'January 7, 2026',minutes:32,tags:['Founders','Growth'],description:'Listen for the problem behind the requested feature.'},
  {id:177,title:'A Better Definition of Done',guest:'Maya Park',company:'Fictional host',date:'December 31, 2025',minutes:34,tags:['Engineering'],description:'Reliability, accessibility, and the work that happens after the first launch.'},
  {id:168,title:'How Notion Built a $10B Company',guest:'Proposed guest not supplied',company:'Unverified concept',date:'Archive concept',minutes:50,tags:['Founders'],description:'A hypothetical conversation about a flexible tool, a strong community and patient product building.',plays:'2.1M',art:'NOTION / THE LONG GAME'},
  {id:156,title:'The Vercel Origin Story',guest:'Guillermo Rauch',company:'Vercel',date:'Archive concept',minutes:48,tags:['Founders','Engineering'],description:'A proposed look at developer experience and the journey from tooling to a platform.',plays:'1.8M',art:'VERCEL / ZERO TO SHIP'},
  {id:142,title:"Stripe’s API Design Principles",guest:'Patrick Collison',company:'Stripe',date:'Archive concept',minutes:54,tags:['Engineering'],description:'A concept discussion of clear abstractions, documentation and making the difficult feel simple.',plays:'1.5M',art:'STRIPE / SIMPLE IS HARD'},
  {id:133,title:'Why Every Startup Needs a Design System',guest:'Proposed guest not supplied',company:'Unverified concept',date:'Archive concept',minutes:43,tags:['Design'],description:'A hypothetical discussion about reusable foundations and knowing when not to abstract.',plays:'1.2M',art:'DESIGN / SYSTEMS THINKING'},
  {id:128,title:'Building a Place for Communities',guest:'Emmett Shear',company:'Twitch co-founder in the brief',date:'Archive concept',minutes:46,tags:['Founders'],description:'A hypothetical discussion of live communities, moderation and product responsibility.'},
  {id:115,title:'A More Human Approach to Leadership',guest:'Julie Zhuo',company:'Author & advisor in the brief',date:'Archive concept',minutes:45,tags:['Design','Founders'],description:'A proposed conversation about management, listening and growing with a team.'},
  {id:98,title:'Small Products, Independent Creators',guest:'Sahil Lavingia',company:'Gumroad in the brief',date:'Archive concept',minutes:42,tags:['Founders','Growth'],description:'A hypothetical conversation about tools that make independent creative work possible.'}
];
const byId=new Map(episodes.map(episode=>[episode.id,episode]));
const archive=episodes.filter(episode=>episode.id!==187);
const audio=document.querySelector('#audio');
const reader=document.querySelector('#reader'),content=document.querySelector('#reader-content');
let current=byId.get(187),filter='All',query='',limit=8,hasPlayed=false;
function text(tag,value,className){const element=document.createElement(tag);element.textContent=value;if(className)element.className=className;return element;}
function demoAudio(){
  const rate=22050,seconds=16,samples=rate*seconds;
  const buffer=new ArrayBuffer(44+samples*2),view=new DataView(buffer);
  const chars=(offset,string)=>{for(let i=0;i<string.length;i++)view.setUint8(offset+i,string.charCodeAt(i));};
  chars(0,'RIFF');view.setUint32(4,36+samples*2,true);chars(8,'WAVE');chars(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,rate,true);view.setUint32(28,rate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);chars(36,'data');view.setUint32(40,samples*2,true);
  const notes=[261.63,329.63,392,523.25,440,392,329.63,293.66,261.63,392,440,523.25,659.25,523.25,392,261.63];
  for(let i=0;i<samples;i++){
    const time=i/rate,note=Math.floor(time),phase=time-note;
    const envelope=Math.min(phase/.04,1)*Math.exp(-phase*3.5)*Math.min((seconds-time)/.6,1);
    const frequency=notes[note];
    const signal=(Math.sin(2*Math.PI*frequency*time)*.6+Math.sin(2*Math.PI*frequency*2*time)*.15+Math.sin(2*Math.PI*130.815*time)*.1)*envelope*.26;
    view.setInt16(44+i*2,Math.round(signal*32767),true);
  }
  return URL.createObjectURL(new Blob([buffer],{type:'audio/wav'}));
}
const demoUrl=demoAudio();audio.volume=.65;
window.addEventListener('pagehide',()=>{audio.pause();URL.revokeObjectURL(demoUrl);});
function time(seconds){const value=Math.floor(Number.isFinite(seconds)?seconds:0);return `${Math.floor(value/60)}:${String(value%60).padStart(2,'0')}`;}
function renderArchive(){
  const matches=archive.filter(episode=>(filter==='All'||episode.tags.includes(filter))&&`${episode.title} ${episode.guest} ${episode.company} ${episode.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()));
  const visible=matches.slice(0,limit);
  document.querySelector('#episode-list').innerHTML=visible.map(episode=>`<article class="episode-row"><span class="episode-number">${episode.id}</span><div><h3><button data-notes="${episode.id}">${episode.title}</button></h3><p class="row-description">${episode.description}</p><p class="row-guest">Proposed: ${episode.guest} · Unverified appearance</p></div><div class="row-meta">${episode.date}<small>${episode.minutes} MIN CONCEPT · 16S DEMO</small></div><button class="row-play" data-play="${episode.id}" aria-label="Play original audio demo for episode ${episode.id}">▶</button></article>`).join('');
  document.querySelector('#episode-results').textContent=`Showing ${visible.length} of ${matches.length} available local episode concepts${filter!=='All'?` · ${filter}`:''}${query?` · “${query}”`:''}`;
  document.querySelector('#episode-empty').hidden=!!visible.length;
  document.querySelector('#load-more').hidden=visible.length>=matches.length;
  document.querySelectorAll('[data-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===filter)));
}
function setCurrent(id){
  if(current.id!==id){audio.pause();audio.currentTime=0;}
  current=byId.get(id);
  document.querySelector('#episode-title').textContent=current.title;
  document.querySelector('#episode-kicker').textContent=`EP ${current.id} · ${current.date.toUpperCase()} · ARCHIVE CONCEPT`;
  document.querySelector('#episode-guest').textContent=`Proposed guest: ${current.guest} · ${current.company}`;
  document.querySelector('#episode-description').textContent=`${current.description} Not an actual interview or verified account.`;
  document.querySelector('#episode-tags').replaceChildren(...current.tags.map(tag=>text('span',`#${tag.toLowerCase()}`)));
  document.querySelector('.audio-demo-label small').textContent=`${current.minutes} min is the episode concept, not the playable audio.`;
  document.querySelector('#current-notes').dataset.notes=id;
  document.querySelector('#mini-title').textContent=`EP ${id} · ${current.title}`;
}
function updatePlayer(){
  const playing=!audio.paused&&!audio.ended;
  document.querySelector('#main-play').textContent=playing?'Ⅱ':'▶';
  document.querySelector('#main-play').setAttribute('aria-pressed',String(playing));
  document.querySelector('#main-play').setAttribute('aria-label',`${playing?'Pause':'Play'} original audio demo`);
  document.querySelector('#mini-play').textContent=playing?'Ⅱ':'▶';
  document.querySelector('#mini-play').setAttribute('aria-label',`${playing?'Pause':'Play'} original audio demo`);
  document.querySelector('#mini-player').hidden=!hasPlayed;
  const duration=Number.isFinite(audio.duration)?audio.duration:16;
  for(const id of ['seek','mini-seek']){const range=document.getElementById(id);range.max=duration;range.value=audio.currentTime;range.setAttribute('aria-valuetext',`${time(audio.currentTime)} of ${time(duration)}`);}
  document.querySelector('#current-time').textContent=time(audio.currentTime);
  document.querySelector('#duration').textContent=time(duration);
  document.querySelector('#mini-time').textContent=`${time(audio.currentTime)} / ${time(duration)}`;
}
async function play(){
  try{
    if(!audio.src)audio.src=demoUrl;
    if(audio.paused||audio.ended){if(audio.ended)audio.currentTime=0;await audio.play();hasPlayed=true;document.querySelector('#audio-status').textContent='Playing an original instrumental cue. No guest speech or interview recording.';}
    else{audio.pause();document.querySelector('#audio-status').textContent='Original audio demo paused.';}
    updatePlayer();
  }catch{document.querySelector('#audio-status').textContent='Playback could not start. Use the play control to try again; no interview recording is available.';}
}
function notes(id){
  const episode=byId.get(id);
  content.replaceChildren(text('p',`SHIP IT · EP ${id} · HYPOTHETICAL SHOW NOTES`,'eyebrow'),text('h2',episode.title),text('small',`Proposed guest: ${episode.guest}. Appearance, affiliations and interview content are unverified.`),text('p',episode.description),text('p',episode.notes||'Original discussion prompts: What problem was worth solving? What did the first version leave out? Which trade-off would the team revisit? This is a proposed outline, not a quotation, transcript or technical claim from the named person.'),text('p','Only an original 16-second instrumental demo is playable. The duration, ratings, download numbers and real-company stories in the brief are concept details.'));
  const button=text('button','Play the original audio demo ↗','amber-button');button.addEventListener('click',()=>{reader.close();setCurrent(id);play();});content.append(button);reader.showModal();
}
const platformInfo=name=>name==='Google Podcasts'?'No Google Podcasts destination is configured. This legacy platform is unavailable in this concept; no obsolete subscription URL is supplied.':`No verified Ship It ${name} account or ${name==='RSS'?'podcast feed':'show page'} is configured. This button previews the intended listening option, not a real subscription or external link. Use the locally generated original audio demo instead.`;
const infos={
  'Social profiles':'No real profiles are connected. Maya Park and Diego Santos are fictional hosts; their employment and accelerator biographies are concepts, not verified credentials.',
  'Media kit':'Proposed show: Ship It. Topics: building products, engineering, design and growth. Brief metrics: 2M+ downloads, 187 episodes, 120+ guests and 18K newsletter subscribers. These are sample figures, not verified analytics. No sponsorship offer or message has been sent.',
  'Contact':'No contact, booking or support service is connected. No email, guest invitation or sponsorship inquiry is sent from this static page.',
  'Privacy':'Searches, episode selection, playback controls and email previews stay in this page’s memory. No analytics, cookies, browser storage, account, mailing or platform API is used. Audio is synthesized locally into a WAV Blob. Refreshing resets the demo.'
};
document.addEventListener('click',event=>{
  const playback=event.target.closest('[data-play]');if(playback){setCurrent(Number(playback.dataset.play));play();return;}
  const episode=event.target.closest('[data-notes]');if(episode){notes(Number(episode.dataset.notes));return;}
  const topic=event.target.closest('[data-filter]');if(topic){filter=topic.dataset.filter;limit=8;renderArchive();return;}
  const platform=event.target.closest('[data-platform]');if(platform){content.replaceChildren(text('p','LISTENING OPTION · LOCAL PREVIEW','eyebrow'),text('h2',platform.dataset.platform),text('p',platformInfo(platform.dataset.platform)));reader.showModal();return;}
  const sponsor=event.target.closest('[data-sponsor]');if(sponsor){content.replaceChildren(text('p','PROPOSED SPONSOR','eyebrow'),text('h2',sponsor.dataset.sponsor),text('p','This brand is an example from the brief, not a verified sponsor. No offer code, paid placement, endorsement or external tracking link is provided.'));reader.showModal();return;}
  const info=event.target.closest('[data-info]');if(info){content.replaceChildren(text('p','SHIP IT · CONCEPT NOTE','eyebrow'),text('h2',info.dataset.info),text('p',infos[info.dataset.info]));reader.showModal();}
});
document.querySelector('.close').addEventListener('click',()=>reader.close());
document.querySelector('#main-play').addEventListener('click',play);
document.querySelector('#mini-play').addEventListener('click',play);
for(const name of ['timeupdate','loadedmetadata','play','pause','ended','seeked'])audio.addEventListener(name,updatePlayer);
audio.addEventListener('ended',()=>{document.querySelector('#audio-status').textContent='Original audio demo ended. Replay it or explore the proposed show notes.';});
audio.addEventListener('error',()=>{document.querySelector('#audio-status').textContent='This browser could not decode the original WAV demo. Show-note previews remain available.';});
for(const id of ['seek','mini-seek'])document.getElementById(id).addEventListener('input',event=>{if(Number.isFinite(audio.duration))audio.currentTime=Math.max(0,Math.min(Number(event.target.value),audio.duration));updatePlayer();});
document.querySelector('#speed').addEventListener('change',event=>{audio.playbackRate=Number(event.target.value);});
document.querySelector('#volume').addEventListener('input',event=>{audio.volume=Number(event.target.value)/100;});
document.querySelector('#close-player').addEventListener('click',()=>{audio.pause();audio.currentTime=0;hasPlayed=false;updatePlayer();document.querySelector('#audio-status').textContent='Original audio demo stopped.';});
document.querySelector('#episode-search').addEventListener('input',event=>{query=event.target.value.trim();limit=8;renderArchive();});
function reset(){query='';filter='All';limit=8;document.querySelector('#episode-search').value='';renderArchive();}
document.querySelector('#clear-search').addEventListener('click',()=>{query='';document.querySelector('#episode-search').value='';renderArchive();});
document.querySelector('#reset-episodes').addEventListener('click',reset);
document.querySelector('#load-more').addEventListener('click',()=>{limit+=8;renderArchive();});
document.querySelector('#transcript').addEventListener('click',()=>{content.replaceChildren(text('p','TRANSCRIPT · ORIGINAL AUDIO DEMO','eyebrow'),text('h2','Sixteen seconds. No spoken words.'),text('p','00:00–00:16: an original synthesized instrumental motif, with a soft low note and a simple rising and falling melody. The sound fades between notes and ends after sixteen seconds.'),text('p','No interview transcript exists in this static concept. None of the named guests recorded or supplied this audio. The topic outlines are original hypothetical notes, not their words.'));reader.showModal();});
document.querySelector('#share').addEventListener('click',()=>{
  const url=new URL(location.href);url.search='';url.hash='';url.searchParams.set('episode',current.id);
  content.replaceChildren(text('p','SHARE A LOCAL EPISODE CONCEPT','eyebrow'),text('h2',current.title),text('p','This link opens the concept without autoplay. It uses the current host; a localhost link is only useful on your own machine.'));
  const input=document.createElement('input');input.className='share-url';input.readOnly=true;input.value=url.href;input.setAttribute('aria-label','Episode concept link');
  const button=text('button','Copy link ↗','amber-button'),status=text('p','Select and copy the link, or use the button.');status.setAttribute('role','status');
  button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(input.value);status.textContent='Link copied. This is a local concept, not a published episode.';}catch{input.focus();input.select();status.textContent='Clipboard unavailable. The link is selected for manual copying.';}});
  content.append(input,button,status);reader.showModal();
});
document.querySelector('#signup').addEventListener('submit',event=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;document.querySelector('#signup-status').textContent=`Preview ready for ${event.currentTarget.elements.email.value.trim()}. No subscription created or email sent.`;event.currentTarget.reset();});
document.querySelector('#menu').addEventListener('click',()=>{const open=document.querySelector('#nav').classList.toggle('open');document.querySelector('#menu').setAttribute('aria-expanded',String(open));});
document.querySelectorAll('#nav a').forEach(link=>link.addEventListener('click',()=>{document.querySelector('#nav').classList.remove('open');document.querySelector('#menu').setAttribute('aria-expanded','false');}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){document.querySelector('#nav').classList.remove('open');document.querySelector('#menu').setAttribute('aria-expanded','false');}});
document.querySelector('.waveform').innerHTML=Array.from({length:95},(_,index)=>`<span style="height:${5+Math.round(Math.abs(Math.sin(index*1.3)*Math.cos(index*.21))*18)}px"></span>`).join('');
document.querySelector('#implemented-count').textContent=`${episodes.length} local concepts available`;
document.querySelector('#popular-grid').innerHTML=[168,156,142,133].map(id=>{const episode=byId.get(id);const [label,title]=episode.art.split(' / ');return `<article class="popular-card"><div class="popular-art"><span>SHIP IT / EP ${id}</span><strong>${title}</strong><small>${label} · HYPOTHETICAL STORY</small><b aria-hidden="true">↗</b></div><h3>${episode.title}</h3><p>${episode.plays} SAMPLE PLAYS · NOT VERIFIED</p><button class="text-link" data-notes="${id}">Explore the episode concept ↗</button></article>`;}).join('');
const guestIds=[187,156,142,128,115,98];
document.querySelector('#guest-grid').innerHTML=guestIds.map(id=>{const episode=byId.get(id);const initials=episode.guest.split(' ').map(word=>word[0]).join('');return `<article class="guest-card"><span class="guest-avatar" aria-hidden="true">${initials}</span><div><h3>${episode.guest}</h3><p>${episode.company} · Proposed guest</p><button data-notes="${id}">EP ${id} · Concept notes ↗</button></div></article>`;}).join('');
document.querySelector('#all-guests').addEventListener('click',()=>{content.replaceChildren(text('p','HYPOTHETICAL GUEST LINEUP','eyebrow'),text('h2','The proposed builders.'),text('p','These real-person appearances are not verified. No speech, audio or portraits are impersonated.'));const list=text('div','','dialog-list');guestIds.forEach(id=>{const episode=byId.get(id),button=text('button',episode.guest);button.addEventListener('click',()=>notes(id));button.append(text('small',`EP ${id} · ${episode.title}`));list.append(button);});content.append(list);reader.showModal();});
const initial=Number(new URL(location.href).searchParams.get('episode'));setCurrent(byId.has(initial)?initial:187);renderArchive();updatePlayer();
