const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const icon = name => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
const programs = [
  {id:'web',name:'Full-Stack Web Development',short:'Full-stack development',icon:'code-2',color:'#4f78df',bg:'#eff3ff',weeks:12,part:24,tech:['React','Node.js','PostgreSQL','AWS'],projects:'5 portfolio projects + capstone',tuition:14900,description:'Go from an idea to an accessible, deployed web application. Build front-end interfaces, connect APIs and model real data.',modules:['Web foundations: semantic HTML, CSS and JavaScript','React interfaces, accessibility and automated testing','Node.js APIs, authentication concepts and PostgreSQL','Deployment concepts with AWS and a full-stack capstone']},
  {id:'data',name:'Data Science & Analytics',short:'Data science',icon:'chart-no-axes-combined',color:'#398b74',bg:'#edf7f2',weeks:12,part:24,tech:['Python','SQL','TensorFlow','Tableau'],projects:'4 portfolio projects + capstone',tuition:13900,description:'Turn messy questions into useful analysis. Practice responsible data work, clear visual storytelling and reproducible modeling.',modules:['Python, SQL and data cleaning','Exploratory analysis, statistics and visualization','Machine learning, TensorFlow and model evaluation','Tableau storytelling, responsible AI and a research capstone']},
  {id:'ux',name:'UX Design',short:'UX design',icon:'pen-tool',color:'#9865d4',bg:'#f3eefb',weeks:10,part:20,tech:['Figma','Adobe XD','Maze','Hotjar'],projects:'3 case studies + capstone',tuition:11900,description:'Design useful experiences by listening first. Research needs, explore ideas and test accessible prototypes with real design methods.',modules:['Research planning, interviews and synthesis','Information architecture and interaction flows','Figma prototyping, usability testing and accessible UI','Portfolio case studies and an end-to-end capstone']}
];
const money = value => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
$('#program-grid').innerHTML = programs.map(p => `<article class="program-card" style="--program-color:${p.color};--program-bg:${p.bg}"><span class="program-icon">${icon(p.icon)}</span><h3>${p.name}</h3><p class="program-duration">${p.weeks} weeks full-time / ${p.part} weeks part-time</p><div class="program-tech">${p.tech.map(t=>`<span>${t}</span>`).join('')}</div><p class="projects">${p.projects}</p><p class="program-price">${money(p.tuition)}<span>example tuition</span></p><button class="text-button" data-program="${p.id}">Learn more ${icon('arrow-up-right')}</button></article>`).join('');
const graduates = [
  ['Maria Chen','Full-Stack Graduate','Shopify','maria.jpg','I went from bartender to software engineer in 4 months. LaunchCode gave me the structure and support I needed.'],
  ['Jamal Williams','Data Science Graduate','Capital One','jamal.jpg','The data science curriculum was incredibly hands-on. I was building real models by week 3.'],
  ['Priya Patel','UX Design Graduate','IBM','priya.jpg','Career services made all the difference. I had 3 offers within a month of graduating.'],
  ['Alex Rivera','Full-Stack Graduate','Stripe','alex.jpg','The part-time track let me keep my job while transitioning into tech.']
];
$('#testimonial-grid').innerHTML = graduates.map(([name,course,employer,image,quote])=>`<article class="testimonial-card">${icon('quote')}<blockquote>“${quote}”</blockquote><div class="graduate"><img src="assets/${image}" alt="Stock portrait illustrating fictional graduate ${name}" loading="lazy"><div><strong>${name}</strong><p>${course} · fictional story</p></div><span class="employer">${employer}</span></div></article>`).join('');
const events = [
  {id:'info',type:'ONLINE · FREE',day:'19',date:'Wednesday, March 19, 2025',time:'7:00 PM EST',name:'Free online info session',description:'Explore the three tracks and bring your questions about workload, preparation and career support.'},
  {id:'tour',type:'CAMPUS CONCEPT · FREE',day:'22',date:'Saturday, March 22, 2025',time:'10:00 AM EST',name:'Campus tour & Q&A',description:'Preview the sample tour registration. This fictional academy has no verified campus or real visit.'},
  {id:'workshop',type:'ONLINE WORKSHOP · FREE',day:'27',date:'Thursday, March 27, 2025',time:'6:30 PM EST',name:'Intro to coding workshop',description:'An illustrative beginner session on how a simple web page comes together. No live workshop is scheduled.'}
];
$('#event-grid').innerHTML = events.map(e=>`<article class="event-card"><p class="event-type">${e.type} · ARCHIVED</p><div class="event-date"><span>MAR<strong>${e.day}</strong></span><p>${e.date.split(', 2025')[0]}<br>${e.time} · sample 2025 date</p>${icon('calendar-days')}</div><h3>${e.name}</h3><button class="button outline" data-event="${e.id}">Register preview ${icon('arrow-up-right')}</button></article>`).join('');
const dialog = $('#dialog');
const content = $('#dialog-content');
function openDialog(html) {
  content.innerHTML = html;
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  $('.close',dialog).focus();
}
$('.close',dialog).addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}});
const modalHeading = (eyebrow,title) => `<p class="eyebrow">${eyebrow}</p><h2 id="dialog-title">${title}</h2>`;
function showProgram(id) {
  const p = programs.find(p=>p.id===id);
  openDialog(`${modalHeading('SAMPLE CURRICULUM',p.name)}<p>${p.description}</p><p><strong>${p.weeks} weeks full-time / ${p.part} weeks part-time · ${money(p.tuition)} example tuition</strong></p><h3>What you’ll explore</h3><ol>${p.modules.map(m=>`<li>${m}</li>`).join('')}</ol><p>${p.projects}. Illustrative curriculum; no credential, placement or availability is promised.</p><a class="download-link" href="assets/${p.id}-syllabus.txt" download="${p.id==='web'?'full-stack':p.id==='data'?'data-science':'ux-design'}-syllabus.txt">${icon('download')}Download sample syllabus</a><button class="button primary" data-apply data-track="${p.id}">Explore application ${icon('arrow-right')}</button>`);
}
$('#compare-programs').addEventListener('click',()=>openDialog(`${modalHeading('CHOOSE YOUR DIRECTION','Different tracks. Shared momentum.')}<p>All tracks are illustrative. Live instruction, portfolio practice and career support are proposed features, not active services.</p><div class="comparison-table" role="region" aria-label="Program comparison, scroll horizontally on small screens" tabindex="0"><table><thead><tr><th scope="col">At a glance</th>${programs.map(p=>`<th scope="col">${p.short}</th>`).join('')}</tr></thead><tbody>${[['Full-time',...programs.map(p=>p.weeks+' weeks')],['Part-time',...programs.map(p=>p.part+' weeks')],['Example tuition',...programs.map(p=>money(p.tuition))],['Portfolio',...programs.map(p=>p.projects)],['Toolkit',...programs.map(p=>p.tech.join(', '))]].map(row=>`<tr><th scope="row">${row[0]}</th>${row.slice(1).map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`));
let application = {};
let applicationStep = 1;
function applicationForm() {
  const steps = ['Your direction','A little about you','Review your preview'];
  openDialog(`${modalHeading(`APPLICATION PREVIEW · STEP ${applicationStep} OF 3`,steps[applicationStep-1])}<div class="application-progress" aria-label="Step ${applicationStep} of 3">${[1,2,3].map(n=>`<span class="${n<=applicationStep?'active':''}"></span>`).join('')}</div><p>Local demonstration only. Nothing is sent or saved. Do not enter sensitive personal information.</p><form id="application-form">${applicationStep===1?`<label>Program<select name="program" required>${programs.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select></label><label>Study pace<select name="pace"><option value="Full-time">Full-time</option><option value="Part-time">Part-time</option></select></label><label>What draws you to tech?<textarea name="goal" maxlength="500" required placeholder="Use a fictional example to try the form"></textarea></label>`:applicationStep===2?`<label>Name<input name="name" autocomplete="off" maxlength="80" required placeholder="Sample name"></label><label>Email<input name="email" type="email" autocomplete="off" maxlength="120" required placeholder="sample@example.com"></label><label class="consent"><input type="checkbox" name="consent" required>I understand this is a local demo, not an actual application.</label>`:`<div class="application-review"><p><strong>Program:</strong> <span data-review="program"></span></p><p><strong>Study pace:</strong> <span data-review="pace"></span></p><p><strong>Goal:</strong> <span data-review="goal"></span></p><p><strong>Name:</strong> <span data-review="name"></span></p><p><strong>Email:</strong> <span data-review="email"></span></p></div><p>Review your sample information. Completing this preview creates no admission, appointment or account.</p>`}<div class="modal-actions">${applicationStep>1?'<button class="button outline" id="application-back" type="button">Back</button>':''}<button class="button primary" type="submit">${applicationStep===3?'Complete local preview':'Continue'} ${icon('arrow-right')}</button></div></form>`);
  const form=$('#application-form');
  if(applicationStep===1){form.elements.program.value=application.program||'web';form.elements.pace.value=application.pace||'Full-time';form.elements.goal.value=application.goal||'';}
  if(applicationStep===2){form.elements.name.value=application.name||'';form.elements.email.value=application.email||'';}
  if(applicationStep===3){for(const key of ['program','pace','goal','name','email'])$(`[data-review="${key}"]`).textContent=key==='program'?programs.find(p=>p.id===application.program).name:application[key];}
  $('#application-back')?.addEventListener('click',()=>{Object.assign(application,Object.fromEntries(new FormData(form)));applicationStep--;applicationForm();});
  form.addEventListener('submit',event=>{
    event.preventDefault();
    Object.assign(application,Object.fromEntries(new FormData(form)));
    if(applicationStep<3){applicationStep++;applicationForm();return;}
    openDialog(`${modalHeading('PREVIEW COMPLETE','That’s a thoughtful first step.')}<p role="status">Your application preview is complete. Nothing was sent, stored or submitted. No place has been reserved.</p><p>For a real provider, verify licensing, curriculum, total costs, refund terms and independently audited outcomes before applying.</p><button class="button primary" id="finish-application">Back to exploring ${icon('arrow-right')}</button>`);
    application={};
    $('#finish-application').addEventListener('click',()=>dialog.close());
  });
}
dialog.addEventListener('close',()=>{application={};applicationStep=1;content.innerHTML='';});
function showFinance(mode) {
  openDialog(`${modalHeading('ILLUSTRATIVE FINANCING','Make room for a plan.')}<p>Explore sample tuition math. No credit, financing, benefits eligibility or scholarship is offered. These examples exclude unquoted fees and living costs.</p><label>Program<select id="finance-program">${programs.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select></label><label>Payment example<select id="finance-mode"><option value="upfront">Pay upfront · $1,000 discount</option><option value="monthly">12 months · 0% example interest</option><option value="isa">Income share agreement concept</option></select></label><div class="estimate" role="status" aria-live="polite" id="estimate"></div><p>Income share agreements can create substantial obligations. An actual contract must specify payment share, cap, length, eligibility, deferment and protections; those terms are not provided here. No employment or income guarantee.</p>`);
  $('#finance-mode').value=mode;
  const update=()=>{
    const p=programs.find(p=>p.id===$('#finance-program').value);
    const m=$('#finance-mode').value;
    $('#estimate').innerHTML=m==='upfront'?`<strong>${money(p.tuition-1000)}</strong><p>One example upfront payment · ${money(p.tuition)} tuition less $1,000.</p>`:m==='monthly'?`<strong>${(p.tuition/12).toLocaleString('en-US',{style:'currency',currency:'USD'})}<small> / month</small></strong><p>12 illustrative payments · ${money(p.tuition)} total · 0% interest. Cents are rounded; a real final payment would reconcile the exact total.</p>`:'<strong>$50K+</strong><p>Illustrative annual earnings threshold only. Payment amounts cannot be calculated without contract terms. No actual ISA is available.</p>';
  };
  $('#finance-program').addEventListener('change',update);$('#finance-mode').addEventListener('change',update);update();
}
function showEvent(id) {
  const e=events.find(e=>e.id===id);
  openDialog(`${modalHeading('ARCHIVED SAMPLE EVENT',e.name)}<p>${e.date} · ${e.time}. This past date is shown for the original design brief, not as an upcoming event.</p><p>${e.description}</p><form id="event-form"><label>Name<input name="name" maxlength="80" required autocomplete="off" placeholder="Sample name"></label><label>Email<input name="email" type="email" maxlength="120" required autocomplete="off" placeholder="sample@example.com"></label><label class="consent"><input type="checkbox" required>I understand this only previews registration.</label><button class="button primary" type="submit">Preview registration ${icon('arrow-right')}</button><p role="status" id="event-status"></p></form>`);
  $('#event-form').addEventListener('submit',event=>{event.preventDefault();$('#event-status').textContent='Registration preview complete. Nothing sent; no ticket, invitation or campus visit has been booked.';$('#event-form button[type=submit]').disabled=true;});
}
const articles = {
  'Start with one small project':'A personal reading list is a useful first project: give each item a title, an author and a read/unread state. Start with semantic HTML, add clear labels and test keyboard navigation before adding a framework. A small project you can explain is more useful than a large one you cannot maintain.',
  'A better question for your data':'Before choosing a chart or a model, write down the question, who will use the answer and what evidence could change your mind. Check missing values and sampling bias. Keep a plain-language record of what your data cannot tell you.',
  'Your first research conversation':'Ask about a recent real experience rather than a hypothetical future preference. “Tell me about the last time you booked a trip” is more revealing than “Would you use this app?” Seek consent, avoid collecting unnecessary personal information and separate observations from assumptions.'
};
function showArticle(title){openDialog(`${modalHeading('ORIGINAL CONCEPT JOURNAL',title)}<p class="library-article">${articles[title]}</p><p>Short educational editorial created for this demo. Not a real academy publication.</p>`);}
function showInfo(title){
  if(title==='Blog'){openDialog(`${modalHeading('THE STUDENT JOURNAL','A little curiosity goes a long way.')}<p>Original short reads for this fictional academy.</p>${Object.keys(articles).map(t=>`<button class="download-link" data-article="${t}">${t} ${icon('arrow-right')}</button>`).join('')}`);return;}
  if(title==='Contact'){openDialog(`${modalHeading('NO REAL ADMISSIONS TEAM','Let’s talk possibilities.')}<p>(555) 412-8900 is an illustrative, non-operational contact. This local form sends no messages. Use fictional information.</p><form id="contact-form"><label>Name<input name="name" required maxlength="80" autocomplete="off"></label><label>Email<input name="email" type="email" required maxlength="120" autocomplete="off"></label><label>Your question<textarea name="question" required maxlength="1000"></textarea></label><button class="button primary" type="submit">Preview your message ${icon('arrow-right')}</button><p role="status" id="contact-status"></p></form>`);$('#contact-form').addEventListener('submit',event=>{event.preventDefault();$('#contact-status').textContent='Message preview complete. Nothing was sent. This fictional academy has no admissions service.';});return;}
  const copy = {
    'Outcomes report':'No audit has been performed. The 93% placement, $78K starting salary, 1,200 graduates, 300 partners and 4.8 rating are fictional design examples. A real report should disclose cohort dates, enrollment and completion counts, placement denominator, job-seeking eligibility, survey response rate, location, employment definition, time window, salary distribution and independent auditor. No methodology or supporting dataset exists for these figures.',
    'Career support':'The concept proposes dedicated career coaching, résumé review, portfolio feedback and practice interviews. These services are not operational. Neither graduation nor career coaching guarantees a role, salary or hiring-partner introduction.',
    'Accessibility':'This static concept supports keyboard navigation, native dialog focus handling, reduced motion and responsive layouts. The comparison table scrolls within its own labeled region. The employer carousel can be paused. A formal accessibility audit has not been completed.',
    'Our story':'LaunchCode Academy is a fictional learning brand for a standalone homepage design. Its mission is to make the transition from curiosity to practical skills feel clear and supported. It is not a licensed school or an operating training provider.',
    'Press':'This is a fictional concept with no press coverage, awards or media contact. Brand, accreditation and employment references are illustrative.',
    'Careers':'No roles are open: this is a fictional academy. The interface demonstrates a static homepage, not a recruiting platform.',
    'Privacy':'Forms are processed only in this browser session and are cleared when their dialog closes. No cookies, local storage, analytics, backend, payment processing or network form submissions are used. Static hosting may retain its own access logs. All educational, financial and career claims are illustrative; review asset credits before real-world reuse.'
  };
  openDialog(`${modalHeading('FICTIONAL ACADEMY · TRANSPARENCY',title)}<p>${copy[title]||`No official ${title} account is connected. This button opens information rather than sending you to an unverified profile.`}</p>`);
}
document.addEventListener('click',event=>{
  const target=event.target.closest('button');
  if(!target)return;
  if(target.hasAttribute('data-program'))showProgram(target.dataset.program);
  else if(target.hasAttribute('data-apply')){application={program:target.dataset.track||'web'};applicationStep=1;applicationForm();}
  else if(target.hasAttribute('data-finance'))showFinance(target.dataset.finance);
  else if(target.hasAttribute('data-event'))showEvent(target.dataset.event);
  else if(target.hasAttribute('data-info'))showInfo(target.dataset.info);
  else if(target.hasAttribute('data-article'))showArticle(target.dataset.article);
});
$('#dismiss-announcement').addEventListener('click',()=>{$('#announcement').remove();$('.brand').focus();});
const menu=$('.menu'),navigation=$('#navigation');
function closeMenu(){navigation.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}
menu.addEventListener('click',()=>{const open=!navigation.classList.contains('open');navigation.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',`${open?'Close':'Open'} navigation`);});
navigation.addEventListener('click',event=>{if(event.target.closest('a,button'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&navigation.classList.contains('open')){closeMenu();menu.focus();}});
matchMedia('(min-width:701px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
const pause=$('#pause-partners');
pause.addEventListener('click',()=>{const paused=!$('#partner-track').classList.contains('paused');$('#partner-track').classList.toggle('paused',paused);pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',`${paused?'Play':'Pause'} employer carousel`);pause.innerHTML=icon(paused?'play':'pause');});
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
const counterObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){if(!entry.isIntersecting)continue;const element=entry.target;const total=Number(element.dataset.count);const start=performance.now();function tick(now){const progress=reduced.matches?1:Math.min((now-start)/1100,1);element.textContent=Math.round(total*(1-Math.pow(1-progress,3))).toLocaleString('en-US');if(progress<1)requestAnimationFrame(tick);}requestAnimationFrame(tick);counterObserver.unobserve(element);}
},{threshold:.5});
$$('[data-count]').forEach(element=>counterObserver.observe(element));
