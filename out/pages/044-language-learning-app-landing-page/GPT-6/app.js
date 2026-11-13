const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const icon=name=>`<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
const languages=[
 {id:'es',name:'Spanish',lessons:240,learners:'48M',phrase:'Hello, how are you?'},
 {id:'fr',name:'French',lessons:210,learners:'32M',phrase:'Hello, how are you?'},
 {id:'ja',name:'Japanese',lessons:180,learners:'18M',phrase:'Good afternoon.'},
 {id:'de',name:'German',lessons:195,learners:'22M',phrase:'Hello, how are you?'},
 {id:'zh',name:'Mandarin',lessons:200,learners:'28M',phrase:'Hello there.'}
].map(language=>({...language,translation:'English translation preview',prompt:'Hello! What would you like to order?',answer:'A coffee, please.',reply:'Here you are. Enjoy your coffee!',replyMeaning:'Scripted reply, not a pronunciation assessment.',greeting:'Hello',greetingMeaning:'A friendly greeting'}));
let selectedLanguage='es',annual=false,walkTimer=null;
function selectLanguage(id,scroll=false){
 selectedLanguage=id;const language=languages.find(l=>l.id===id);
 $('#language-cards').innerHTML=languages.map(l=>`<button class="language-card" data-language="${l.id}" aria-pressed="${l.id===id}"><img class="flag" src="assets/flag-${l.id}.svg" alt="">${l.id===id?`<span class="selected-check">${icon('check')}</span>`:''}<h3>${l.name}</h3><p>${l.lessons}+ sample lessons<span>${l.learners} sample learners</span></p></button>`).join('');
 $('#preview-flag').innerHTML=`<img src="assets/flag-${id}.svg" alt="">`;$('#preview-label').textContent=`${language.name.toUpperCase()} LESSON · IN ENGLISH`;$('#preview-phrase').textContent=language.phrase;$('#preview-phrase').lang='en';$('#preview-translation').textContent=language.translation;
 $('.phone-label').textContent=`${language.name.toUpperCase()} · ENGLISH TRANSLATION`;$('.chat-bubble').textContent=language.prompt;$('.chat-bubble').lang='en';$('.chat-translation').textContent=language.name==='Japanese'?'What would you like to order?':language.name==='Mandarin'?'What would you like to order?':'Hello! What would you like to order?';
 $('#phone-answer').replaceChildren(document.createTextNode(language.answer+' '));$('#phone-answer').insertAdjacentHTML('beforeend',icon('arrow-right'));$('#phone-answer').lang='en';$('.phone-feedback').textContent='';$('#language-status').textContent=`${language.name} preview selected.`;
 if(scroll)$('#languages').scrollIntoView();
}
$('#language-cards').addEventListener('click',event=>{const button=event.target.closest('[data-language]');if(!button)return;const id=button.dataset.language;selectLanguage(id);$(`[data-language="${id}"]`).focus({preventScroll:true});});
$('#phone-answer').addEventListener('click',()=>{$('.phone-feedback').textContent='Nice choice! “Coffee, please.” Scripted feedback, not a pronunciation score.';});
const dialog=$('#dialog'),content=$('#dialog-content');
function stopWalk(){clearInterval(walkTimer);walkTimer=null;}
function openDialog(html){stopWalk();content.innerHTML=html;if(!dialog.open)dialog.showModal();dialog.scrollTop=0;$('.close',dialog).focus();}
const heading=(label,title)=>`<p class="eyebrow">${label}</p><h2 id="dialog-title">${title}</h2>`;
$('.close',dialog).addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{stopWalk();content.innerHTML='';});
dialog.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}});
function showConversation(){
 const l=languages.find(l=>l.id===selectedLanguage);
 openDialog(`${heading(`${l.name.toUpperCase()} · SCRIPTED LOCAL PREVIEW`,'A coffee. A little confidence.')}<p>English translation of a fixed sample dialogue, not AI or speech recognition. Choose a reply to explore the conversation. No audio, microphone or network service is used.</p><div class="scripted-chat"><p lang="en">${l.prompt}</p><p>What would you like to order?</p></div><div class="scripted-choices"><button class="button outline" id="order-coffee" lang="en">${l.answer}</button><button class="button outline" id="say-hello" lang="en">${l.greeting}</button></div><p role="status" id="conversation-status"></p><div id="conversation-reply" class="scripted-chat" hidden></div>`);
 $('#order-coffee').addEventListener('click',()=>{$('#conversation-status').textContent='“Coffee, please.” A polite way to place an order. This response is scripted, not assessed.';const reply=$('#conversation-reply');reply.hidden=false;reply.replaceChildren();const original=document.createElement('p');original.lang='en';original.textContent=l.reply;const translation=document.createElement('p');translation.textContent=l.replyMeaning;reply.append(original,translation);});
 $('#say-hello').addEventListener('click',()=>{$('#conversation-status').textContent='“Hello.” A friendly greeting. For the coffee order, try the other reply.';$('#conversation-reply').hidden=true;});
}
$('#preview-lesson').addEventListener('click',showConversation);
function showStart(plan='Free'){
 const l=languages.find(l=>l.id===selectedLanguage),cost=plan==='Free'?'$0':plan==='Pro'?(annual?'$71.93 per year (about $5.99/month)':'$9.99/month'):(annual?'$107.93 per year (about $8.99/month)':'$14.99/month');
 openDialog(`${heading('LOCAL LEARNING-PATH PREVIEW','A little leap, your way.')}<p><strong>${plan} concept · ${cost}</strong>. No actual trial, account, renewal, payment or credit card. Choose a sample learning path; nothing is sent or saved.</p><form id="start-form"><label>Language<select name="language">${languages.map(language=>`<option value="${language.id}">${language.name}</option>`).join('')}</select></label><label>What brings you here?<select name="goal"><option>Travel & everyday conversations</option><option>Friends & family</option><option>Curiosity & culture</option><option>Work & study</option></select></label><label>Daily practice target<select name="minutes"><option value="5">5 minutes · a small start</option><option value="15">15 minutes · a daily habit</option><option value="20">20 minutes · a little extra</option></select></label><label class="consent"><input type="checkbox" required>I understand this is a local preview, not an actual app subscription.</label><button class="button primary" type="submit">Preview my learning path ${icon('arrow-right')}</button></form>`);
 $('#start-form [name=language]').value=l.id;$('#start-form [name=minutes]').value=plan==='Free'?'5':'15';
 $('#start-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget,language=languages.find(language=>language.id===form.elements.language.value),minutes=form.elements.minutes.value,goal=form.elements.goal.value;selectLanguage(language.id);openDialog(`${heading('YOUR LOCAL PATH PREVIEW',`A little ${language.name}, every day.`)}<p role="status">Your ${minutes}-minute practice idea is ready. Nothing was sent or saved; no account or trial was created.</p><p>Goal: ${goal}. The proposed Free plan is limited to five minutes a day; longer targets are ideas for the illustrative paid plans, not active access.</p><div class="dialog-actions"><button class="button primary" id="begin-conversation">Try the scripted conversation ${icon('arrow-right')}</button><a class="button outline" href="assets/practice-sheet.txt" download="language-practice-sheet.txt">Download practice sheet</a></div>`);$('#begin-conversation').addEventListener('click',showConversation);});
}
function showWalk(){
 const slides=[{icon:'messages-square',title:'Start with something you want to say.',text:'Choose a language and explore a fixed café conversation. The imagined app would adapt through AI; this static preview uses scripted choices.'},{icon:'sparkles',title:'Make room for a small win.',text:'Try four English word-and-meaning matches, get immediate answer feedback and complete a local lesson. No leaderboard, account or stored streak is connected.'},{icon:'audio-lines',title:'Find your voice, at your pace.',text:'Pronunciation feedback is a planned feature, not a working accent assessment. This demo never asks for a microphone or records audio.'}];
 openDialog(`${heading('SILENT INTERACTIVE WALKTHROUGH','A little look inside.')}<p>Three original visual slides, not a recorded product video.</p><div class="walkthrough"><div id="walk-icon"></div><h3 id="walk-title"></h3><p id="walk-text"></p></div><div class="walkthrough-controls"><button class="button outline" id="walk-back">Previous</button><button class="button outline" id="walk-play">Play slides</button><button class="button outline" id="walk-next">Next</button><span id="walk-position" role="status"></span></div>`);
 let index=0,playing=false;const paint=()=>{$('#walk-icon').innerHTML=icon(slides[index].icon);$('#walk-title').textContent=slides[index].title;$('#walk-text').textContent=slides[index].text;$('#walk-position').textContent=`${index+1} / ${slides.length}`;};
 $('#walk-back').addEventListener('click',()=>{index=(index+slides.length-1)%slides.length;paint();});$('#walk-next').addEventListener('click',()=>{index=(index+1)%slides.length;paint();});
 $('#walk-play').addEventListener('click',()=>{playing=!playing;$('#walk-play').textContent=playing?'Pause slides':'Play slides';if(playing)walkTimer=setInterval(()=>{index=(index+1)%slides.length;paint();},5000);else stopWalk();});paint();
}
$('#watch-how').addEventListener('click',showWalk);
const pairs=[['Hello','A greeting'],['Thanks','Gratitude'],['Friend','A companion'],['Book','Something to read']];
let selectedWord=null,matched=new Set();
function renderMatch(){
 $('#source-words').innerHTML=pairs.map(([word],index)=>`<button data-word="${index}" aria-pressed="${selectedWord===index}" ${matched.has(index)?'disabled class="matched"':''} lang="en">${word}${matched.has(index)?' ✓':''}</button>`).join('');
 $('#target-words').innerHTML=[2,0,3,1].map(index=>`<button data-translation="${index}" ${matched.has(index)?'disabled class="matched"':''}>${pairs[index][1]}${matched.has(index)?' ✓':''}</button>`).join('');
 $('#match-count').textContent=`${matched.size} / 4`;
}
$('#source-words').addEventListener('click',event=>{const button=event.target.closest('[data-word]');if(!button||button.disabled)return;selectedWord=Number(button.dataset.word);renderMatch();$(`[data-word="${selectedWord}"]`).focus();$('#match-status').textContent=`Now choose the English meaning of “${pairs[selectedWord][0]}”.`;});
$('#target-words').addEventListener('click',event=>{
 const button=event.target.closest('[data-translation]');if(!button||button.disabled)return;
 if(selectedWord===null){$('#match-status').textContent='Choose a English word first, then its English meaning.';return;}
 if(selectedWord!==Number(button.dataset.translation)){$('#match-status').textContent='Not quite. Try another meaning — mistakes are part of practice.';return;}
 const completeWord=pairs[selectedWord][0];matched.add(selectedWord);selectedWord=null;renderMatch();
 $('#match-status').textContent=matched.size===4?'Four words, one little leap! +25 sample XP. Lesson complete in this tab.':`Nice! “${completeWord}” matched. Keep going.`;
 if(matched.size===4){$('#reset-match').focus({preventScroll:true});$('#confetti').innerHTML=Array.from({length:24},(_,index)=>`<i style="--x:${(index*37)%100}%;--color:${['#c4a0e8','#91d7e1','#e9c774','#c5dfac'][index%4]};--delay:${index%5*.05}s"></i>`).join('');setTimeout(()=>{$('#confetti').innerHTML='';},2100);}
 else $('#source-words button:not(:disabled)')?.focus({preventScroll:true});
});
$('#reset-match').addEventListener('click',()=>{selectedWord=null;matched.clear();renderMatch();$('#match-status').textContent='A fresh start. Choose a English word first.';$('#confetti').innerHTML='';});
const features=[
 ['AI speech recognition','mic','Get a proposed pronunciation score with phoneme-level feedback.','Pronunciation scoring is a planned feature. The waveform and 92 score are illustrations, not measured audio. No microphone permission, recording, browser speech service or accent analysis is used.'],
 ['Adaptive difficulty','brain','Practice that could adapt around your strengths and mistakes.','A future app could select practice based on demonstrated skill and uncertainty. This demo checks the four exact vocabulary matches; it does not model proficiency or infer personal attributes.'],
 ['Offline mode','download','A little practice, even when your signal takes a break.','Offline lesson downloads are a proposed paid feature. You can download the original text practice sheet here; there is no installed app, service worker, offline library or device sync.'],
 ['Spaced repetition','calendar-days','A thoughtful review rhythm for words you want to keep.','A review system could schedule previously studied items over time. This static page has no reminders, stored learning history or automatic scheduling. A small downloadable practice sheet suggests a manual review routine.'],
 ['Story mode','book-open','Follow little adventures, one useful phrase at a time.','Story mode is an app concept. The local café conversation is a short scripted scene, not a generated narrative or a complete course. Its replies do not adapt beyond the choices provided.'],
 ['Live group sessions','video','A proposed place to practice with people, not just pixels.','Weekly native-speaker sessions are not available in this concept. There are no instructors, event bookings, video calls, school accounts or live class connections.']
];
$('#features-grid').innerHTML=features.map(([name,art,description])=>`<article class="feature-card"><span class="feature-icon">${icon(art)}</span><h3>${name}</h3><p>${description}</p><button class="text-button" data-feature="${name}">Explore the concept ${icon('arrow-right')}</button></article>`).join('');
function showFeature(name){const feature=features.find(feature=>feature[0]===name);openDialog(`${heading('PLANNED CAPABILITY · NOT A CONNECTED SERVICE',name)}<p>${feature?feature[3]:'The AI partner is a planned capability. This demo offers a fixed conversation with two choices per language, not an AI model or a real-time tutor.'}</p>${name==='Offline mode'||name==='Spaced repetition'?`<a class="download-link" href="assets/practice-sheet.txt" download="language-practice-sheet.txt">${icon('download')}Download original sample practice sheet</a>`:''}`);}
const testimonials=[
 ['Emma S.','Spanish learner · fictional, 6 months','emma.jpg','I moved to Madrid and can actually hold conversations now. LinguaLeap’s AI tutor is like having a patient friend.'],
 ['Kenji T.','Parent · fictional, 3 months','kenji.jpg','My kids fight over who gets to do their Japanese lesson first. The gamification is genius.'],
 ['Sarah M.','French learner · fictional, 4 months','sarah.jpg','I tried Duolingo and Babbel. LinguaLeap’s speech practice is on another level.']
];
$('#testimonials').innerHTML=testimonials.map(([name,context,image,quote])=>`<article class="testimonial-card"><div class="stars" aria-label="Five fictional stars">${Array.from({length:5},()=>icon('star')).join('')}</div><blockquote>“${quote}”</blockquote><div class="person"><img src="assets/${image}" alt="Stock model illustrating fictional learner ${name}"><div><strong>${name}</strong><p>${context}</p></div></div></article>`).join('');
function renderPricing(){
 const plans=[{name:'Free',price:0,tag:'A tiny step, a lovely beginning.',features:['1 language','5 minutes a day','Basic lessons','No speech practice']},{name:'Pro',price:9.99,tag:'A little more room to explore.',features:['All proposed languages','Unlimited practice','AI speech coach concept','Offline & story mode concepts']},{name:'Family',price:14.99,tag:'A bigger world, together.',features:['Up to 5 proposed accounts','All proposed Pro features','Parent progress dashboard concept','No child accounts in this demo']}];
 $('#pricing-grid').innerHTML=plans.map(plan=>{const year=Math.round(plan.price*12*.6*100)/100,monthly=annual&&plan.price?year/12:plan.price;return `<article class="price-card ${plan.name==='Pro'?'pro':''}" data-plan="${plan.name}">${plan.name==='Pro'?'<span class="popular-badge">MOST POPULAR CONCEPT</span>':''}<h3>${plan.name}</h3><p class="plan-intro">${plan.tag}</p><p class="price">$${monthly?monthly.toFixed(2):'0'}<span>/ month${annual&&plan.price?' equiv.':''}</span></p><p class="billed">${plan.price?(annual?`$${year.toFixed(2)} billed annually · illustrative`:'Billed monthly · illustrative'):'Free plan concept · no signup service'}</p><ul>${plan.features.map(feature=>`<li>${icon('check')}${feature}</li>`).join('')}</ul><button class="button ${plan.name==='Pro'?'primary':'outline'}" data-start data-plan="${plan.name}">${plan.name==='Free'?'Start free':'Start free trial'} ${icon('arrow-right')}</button></article>`;}).join('');
}
$('#billing').addEventListener('click',()=>{annual=!annual;$('#billing').setAttribute('aria-checked',String(annual));renderPricing();});
const info={
 'About LinguaLeap':'LinguaLeap is a fictional learning-app landing page with five English-translated scripted conversations, a local matching game and an illustrative pricing interface. The imagined product is not an operating learning platform, AI tutor, school or app-store listing.',
 'For schools':'This is a fictional schools offering. No classroom, student roster, child account, administrator dashboard, data processing agreement or actual school integration is provided.',
 'For business':'No business plan or enterprise service is available. The concept could support workplace language practice, but there are no live accounts, employee data integrations or contracts.',
 'Careers':'No roles are open. This fictional app has no recruiting service or verified employment opportunities.',
 'Press':'TechCrunch, WIRED, The Verge, Forbes and EdSurge are illustrative plain-text names, not verified coverage or endorsements. No official media logos are reproduced.',
 'Community':'There is no connected forum, public profile, direct messaging, leaderboard or live community. Matching-game progress stays only in this browser session.',
 'API docs':'No API endpoint, token or developer account exists. All lessons and feedback shown here are predefined local data.',
 'Help center':'Choose a language to update the sample screen; try the four-word English matching lesson; switch billing to compare illustrative prices. Start buttons open a local learning-path preview. Nothing creates a real account or subscription.',
 'Privacy':'No cookies, local storage, analytics, backend, network form submissions or microphone requests are used. Selections, progress and form choices live only in memory and reset on reload. Static hosting may retain access logs.',
 'Terms':'All product capabilities, ratings, users, press references, reviews, progress and outcomes are fictional. No learning result, certification, AI service, subscription, renewal or refund arrangement is offered. Asset sources and licenses are listed separately.',
 'Blog':'Original short read: Make your next practice specific. Instead of “learn Spanish,” try “practice one polite café order.” Say it from memory, check a reliable pronunciation source, and return tomorrow. This is general educational editorial, not a measured outcome or fluency promise.'
};
function showInfo(title){openDialog(`${heading('FICTIONAL APP · CLEAR EXPECTATIONS',title)}<p>${info[title]||`There is no official ${title} account or app listing connected. This opens information instead of sending you to an unverified profile or store.`}</p>`);}
document.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;if(button.hasAttribute('data-start'))showStart(button.dataset.plan||'Free');else if(button.dataset.feature)showFeature(button.dataset.feature);else if(button.dataset.info)showInfo(button.dataset.info);else if(button.dataset.selectLanguage)selectLanguage(button.dataset.selectLanguage,true);});
const menu=$('.menu'),nav=$('#navigation');
const menuHome=document.createElement('span');menuHome.hidden=true;menu.before(menuHome);
function closeMenu(){nav.classList.remove('open');nav.removeAttribute('role');nav.removeAttribute('aria-modal');menuHome.after(menu);menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');$('.nav-backdrop').hidden=true;}
menu.addEventListener('click',()=>{if(nav.classList.contains('open')){closeMenu();return;}nav.classList.add('open');nav.setAttribute('role','dialog');nav.setAttribute('aria-modal','true');nav.append(menu);menu.setAttribute('aria-expanded','true');menu.setAttribute('aria-label','Close navigation');$('.nav-backdrop').hidden=false;menu.focus();});
nav.addEventListener('click',event=>{if(event.target.closest('a,button'))closeMenu();});$('.nav-backdrop').addEventListener('click',()=>{closeMenu();menu.focus();});
document.addEventListener('keydown',event=>{if(!nav.classList.contains('open'))return;if(event.key==='Escape'){event.preventDefault();closeMenu();menu.focus();}if(event.key==='Tab'){const first=$('a',nav);if(event.shiftKey&&document.activeElement===first){event.preventDefault();menu.focus();}else if(!event.shiftKey&&document.activeElement===menu){event.preventDefault();first.focus();}}});
matchMedia('(min-width:781px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
$('#pause-press').addEventListener('click',()=>{const paused=!$('.press-track').classList.contains('paused');$('.press-track').classList.toggle('paused',paused);$('#pause-press').setAttribute('aria-pressed',String(paused));$('#pause-press').setAttribute('aria-label',`${paused?'Play':'Pause'} sample press carousel`);$('#pause-press').innerHTML=icon(paused?'play':'pause');});
selectLanguage('es');renderMatch();renderPricing();
