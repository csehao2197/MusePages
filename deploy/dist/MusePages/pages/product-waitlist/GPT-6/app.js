'use strict';
(() => {
  const $=(id) => document.getElementById(id);
  const escape=(value) => String(value).replace(/[&<>"']/g,(char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const icon=(name) => `<svg aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
  const key='kite-waitlist-demo-v1', baseCount=4832, initialPosition=baseCount+1;
  const format=(value) => value.toLocaleString('en-US');
  let state=null, persisted=false, toastTimer, countFrame, countValue=baseCount, firstCount=true;
  const messages=[
    {id:1,sender:'The Weekly Edit',initial:'W',subject:'A little inspiration for your Friday',body:'News and ideas from the world of design.',time:'8:42 am',priority:2,color:'#f0e7f7',ink:'#a184b4'},
    {id:2,sender:'Avery from Studio',initial:'A',subject:'A fresh direction for the brand',body:'Can you make Thursday at 10 for our design review?',time:'9:41 am',priority:0,color:'#ede5db',ink:'#a38d77'},
    {id:3,sender:'Linear',initial:'L',subject:'Your team is making moves',body:'Here is your project activity summary for the week.',time:'9:35 am',priority:1,color:'#e6e4f8',ink:'#8a7fb6'},
    {id:4,sender:'Sam Rivera',initial:'S',subject:'Coffee + a big idea?',body:'I have been thinking about our next project. Free this week?',time:'9:28 am',priority:0,color:'#e0ecdf',ink:'#88a481'},
    {id:5,sender:'Notion',initial:'N',subject:'A little inspiration for your workspace',body:'Five new templates to keep your notes a little tidier.',time:'8:57 am',priority:2,color:'#ebe7e9',ink:'#a1919f'},
    {id:6,sender:'Finley at Accounts',initial:'F',subject:'Invoice approved — thank you',body:'Your April project invoice is approved for payment.',time:'9:05 am',priority:0,color:'#e1e9f3',ink:'#829ab8'},
    {id:7,sender:'Design Dispatch',initial:'D',subject:'The good kind of weekly roundup',body:'A new issue: color, typography and interesting things.',time:'8:31 am',priority:2,color:'#f3e7e1',ink:'#b39280'}
  ];
  const drafts={
    warm:'Hi Avery! Thursday at 10 works perfectly. I’m looking forward to seeing the latest concepts — thanks for sending them ahead. See you then!',
    concise:'Thursday at 10 works. Please send the concepts when ready. See you then!',
    professional:'Hi Avery, thank you for the invitation. I’m available for the design review on Thursday at 10. I look forward to reviewing the concepts beforehand.'
  };
  function stats(referrals) {
    if (!Number.isSafeInteger(referrals) || referrals<0 || referrals>Math.floor(Number.MAX_SAFE_INTEGER/100)) throw new RangeError('Invalid referral count');
    const credits=referrals*100, jumped=Math.min(initialPosition-1,credits), position=initialPosition-jumped;
    return {credits,jumped,position,total:baseCount+1+referrals,progress:jumped/(initialPosition-1)*100,needed:Math.max(0,Math.ceil((position-1000)/100))};
  }
  function valid(record) {
    return record?.version===1 && typeof record.email==='string' && record.email.length<=254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email) && typeof record.code==='string' && /^[a-f0-9]{24}$/.test(record.code) && typeof record.joinedAt==='string' && Number.isFinite(Date.parse(record.joinedAt)) && new Date(record.joinedAt).toISOString()===record.joinedAt && Number.isSafeInteger(record.referrals) && record.referrals>=0 && record.referrals<=Math.floor(Number.MAX_SAFE_INTEGER/100);
  }
  function toast(message) {
    $('toast').textContent=message; $('toast').hidden=false; clearTimeout(toastTimer);
    toastTimer=setTimeout(() => { $('toast').hidden=true; },4500);
  }
  function renderMessage(message) {
    return `<article class="message${message.priority===0?' message-priority':''}"><i style="--avatar-bg:${message.color};--avatar-ink:${message.ink}">${message.initial}</i><div><h3>${escape(message.sender)}<span>${message.priority===0?'FOR YOU':'LATER'}</span></h3><p>${escape(message.subject)}</p></div><time>${message.time}</time></article>`;
  }
  function renderTriage() {
    const ordered=$('priority-sort').checked?[...messages].sort((a,b) => a.priority-b.priority || b.id-a.id):messages;
    $('message-list').innerHTML=ordered.slice(0,5).map(renderMessage).join('');
  }
  function search() {
    const query=$('inbox-search').value.trim().toLowerCase(), start=performance.now();
    const matches=messages.filter((message) => `${message.sender} ${message.subject} ${message.body}`.toLowerCase().includes(query));
    const elapsed=performance.now()-start;
    $('search-results').innerHTML=matches.length?matches.map(renderMessage).join(''):'<p class="empty-search">Nothing here yet. Try “design” or “invoice”.</p>';
    $('search-metrics').textContent=`${matches.length} of 7 sample messages · ${elapsed.toFixed(2)} ms local search`;
  }
  function tab(name,focus=false) {
    document.querySelectorAll('[data-tab]').forEach((button) => {
      const active=button.dataset.tab===name;button.setAttribute('aria-selected',active);button.tabIndex=active?0:-1;
      if (active && focus) button.focus();
    });
    document.querySelectorAll('.demo-panel').forEach((panel) => { panel.hidden=panel.id!==`panel-${name}`; });
    if (name==='search') search();
  }
  document.querySelectorAll('[data-tab]').forEach((button) => {
    button.onclick=() => tab(button.dataset.tab);
    button.onkeydown=(event) => {
      const order=['triage','draft','search'], index=order.indexOf(button.dataset.tab);
      let next;
      if (event.key==='ArrowRight') next=(index+1)%3;
      if (event.key==='ArrowLeft') next=(index+2)%3;
      if (event.key==='Home') next=0;
      if (event.key==='End') next=2;
      if (next!==undefined) { event.preventDefault();tab(order[next],true); }
    };
  });
  document.querySelectorAll('[data-try]').forEach((button) => { button.onclick=() => { tab(button.dataset.try,true);document.querySelector('.mail-window').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'center'}); }; });
  document.querySelectorAll('[data-tone]').forEach((button) => { button.onclick=() => {
    document.querySelectorAll('[data-tone]').forEach((item) => item.setAttribute('aria-pressed',item===button));
    $('draft-text').value=drafts[button.dataset.tone];$('draft-status').textContent='Prewritten sample updated. You can edit it before copying.';
  }; });
  async function copy(input,message,status) {
    try { await navigator.clipboard.writeText(input.value);status.textContent=message;toast(message); }
    catch { input.focus();input.select();status.textContent='Clipboard access is unavailable. The text is selected; copy it manually.'; }
  }
  $('copy-draft').onclick=() => copy($('draft-text'),'Sample reply copied. No email was sent.',$('draft-status'));
  $('inbox-search').oninput=search;$('priority-sort').onchange=renderTriage;
  $('draft-text').value=drafts.warm;renderTriage();search();
  function count(total,animate) {
    cancelAnimationFrame(countFrame);
    const elements=document.querySelectorAll('.waitlist-count'), start=performance.now(), from=firstCount?total-26:countValue;
    firstCount=false;countValue=total;
    const tick=(now) => {
      const progress=!animate || matchMedia('(prefers-reduced-motion:reduce)').matches?1:Math.min(1,(now-start)/650);
      const value=Math.round(from+(total-from)*(1-(1-progress)**3));
      elements.forEach((element) => { element.textContent=format(value); });
      if (progress<1) countFrame=requestAnimationFrame(tick);
    };
    countFrame=requestAnimationFrame(tick);
  }
  function invitation() {
    const url=new URL(location.href);url.search='';url.hash='join';url.searchParams.set('ref',state.code);return url.href;
  }
  function renderShares() {
    if (!state) return;
    const url=invitation(), text='A little less inbox. Explore this Kite design concept and its local waitlist demo.';
    const targets={x:`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,linkedin:`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,email:`mailto:?subject=${encodeURIComponent('A smarter inbox — Kite concept')}&body=${encodeURIComponent(`${text}\n\n${url}\n\nThis is a fictional, local-only demo, not a live waitlist.`)}`,whatsapp:`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`};
    $('share-row').innerHTML=Object.entries(targets).map(([name,target]) => {
      const labels={x:'X',linkedin:'LinkedIn',email:'Email',whatsapp:'WhatsApp'};
      const marks={x:'<span class="x-mark">𝕏</span>',linkedin:'<span class="linkedin-mark">in</span>',email:icon('mail'),whatsapp:icon('message-circle')};
      return `<a href="${escape(target)}"${name!=='email'?' target="_blank" rel="noopener noreferrer"':''}>${marks[name]}${labels[name]}</a>`;
    }).join('');
  }
  function sticky() {
    const past=$('join').getBoundingClientRect().bottom<80;
    $('mobile-sticky').hidden=Boolean(state) || !past;
    $('site-header').classList.toggle('scrolled',scrollY>15);
  }
  function render(animate=false) {
    const info=stats(state?.referrals || 0);
    document.querySelectorAll('[data-signup]').forEach((form) => { form.hidden=Boolean(state); });
    document.querySelectorAll('[data-signed]').forEach((element) => { element.hidden=!state; });
    $('spot-status').textContent=state?'YOUR LOCAL DEMO SPOT':'REFERRAL PREVIEW';
    $('spot-title').textContent=state?'You’re on your way.':'Your little head start.';
    $('signup-address').textContent=state?state.email:'A preview of what your spot could look like.';
    $('position').textContent=`#${format(info.position)}`;$('referral-count').textContent=format(state?.referrals || 0);$('spots-jumped').textContent=format(info.jumped);
    $('queue-progress').value=info.progress;$('progress-label').textContent=`${Math.round(info.progress)}% of the way`;
    $('bonus-status').textContent=info.needed?`${info.needed} sample referrals would move this ${state?'demo':'preview'} into the first 1,000.`:'Your sample rank would qualify for the proposed bonus. No real reward is issued.';
    $('referral-link').value=state?invitation():'Your link appears after local signup';$('copy-link').disabled=!state;$('add-referral').disabled=!state;$('manage-spot').hidden=!state;
    $('persist-spot').checked=persisted;
    if (state) {
      $('referral-disclosure').textContent='A real link to this concept, not a real referral service. No cross-browser tracking or signup credit.';
      $('referral-status').textContent=`${format(info.credits)} places of total referral credit; displayed rank stops at #1. All figures are simulated.`;
      renderShares();
    } else {
      $('referral-disclosure').textContent='This is a preview. Join above to create a private example in this tab.';
      $('referral-status').textContent='Sample queue of 4,832 people. No real signups or referrals.';
      $('share-row').innerHTML=`<button data-share="x" disabled><span class="x-mark">𝕏</span>X</button><button data-share="linkedin" disabled><span class="linkedin-mark">in</span>LinkedIn</button><button data-share="email" disabled>${icon('mail')}Email</button><button data-share="whatsapp" disabled>${icon('message-circle')}WhatsApp</button>`;
    }
    count(state?info.total:baseCount,animate);sticky();
  }
  function remember(enabled) {
    try {
      if (enabled) localStorage.setItem(key,JSON.stringify(state));else localStorage.removeItem(key);
      persisted=enabled;$('persist-spot').checked=enabled;
      $('storage-status').textContent=enabled?'Email and simulated progress saved unencrypted on this device. Clear them here anytime.':'Saved copy removed. This tab still has your demo until refresh.';
      return true;
    } catch {
      $('persist-spot').checked=persisted;
      $('storage-status').textContent='This browser blocked storage changes. Your tab’s demo is still available; use browser settings to manage any previously saved copy.';
      return false;
    }
  }
  document.querySelectorAll('[data-signup]').forEach((form) => {
    const email=form.elements.email, status=form.querySelector('.form-status');
    email.oninput=() => { email.setCustomValidity('');status.textContent=''; };
    form.onsubmit=(event) => {
      event.preventDefault();email.value=email.value.trim();
      email.setCustomValidity(email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)?'Use a complete email address, such as you@example.com.':'');
      if (!email.reportValidity()) { status.textContent='Please enter a valid email address to try the local demo.';return; }
      if (state) { $('referrals').scrollIntoView();return; }
      const bytes=crypto.getRandomValues(new Uint8Array(12));
      state={version:1,email:email.value,code:[...bytes].map((byte) => byte.toString(16).padStart(2,'0')).join(''),joinedAt:new Date().toISOString(),referrals:0};
      persisted=false;$('storage-status').textContent='This signup is in this tab only. Refreshing clears it unless you choose device storage.';
      if (form.elements.remember.checked) remember(true);
      document.querySelectorAll('[data-signup]').forEach((item) => { item.reset();item.querySelector('.form-status').textContent=''; });
      render(true);$('referrals').scrollIntoView({behavior:'instant'});$('referral-title').tabIndex=-1;$('referral-title').focus({preventScroll:true});
      toast('Local demo spot created. No signup was sent.');
    };
  });
  $('persist-spot').onchange=() => remember($('persist-spot').checked);
  $('add-referral').onclick=() => {
    if (!state) return;
    if (state.referrals>=Math.floor(Number.MAX_SAFE_INTEGER/100)) { toast('This local counter has reached JavaScript’s exact-integer limit.');return; }
    state.referrals++;if (persisted && !remember(true)) $('storage-status').textContent='The latest progress is in this tab but could not be saved to this device.';
    render(true);
  };
  $('copy-link').onclick=() => { if (state) copy($('referral-link'),'Invitation link copied. Only your random sample code is shared.',$('referral-status')); };
  $('clear-spot').onclick=() => { $('clear-status').textContent='';$('clear-dialog').showModal(); };
  $('confirm-clear').onclick=() => {
    try { localStorage.removeItem(key); }
    catch { $('clear-status').textContent='Storage removal was blocked. Clear site data in your browser before retrying; your signup has been retained so you can manage it.';return; }
    state=null;persisted=false;$('storage-status').textContent='';render(true);$('clear-dialog').close();$('hero-email').focus();toast('Demo signup and saved copy cleared.');
  };
  const info={
    privacy:['Your inbox stays yours.','<p>This static concept has no backend, analytics, mailbox integration or AI service. Typed email is held in page memory. Explicit “Remember” stores email, a random invitation code, joining time and simulated referral count under <strong>kite-waitlist-demo-v1</strong> in this browser’s localStorage. That copy is not encrypted by this page.</p><p>Clear the signup here or remove site data in your browser. Invitation URLs contain only the random sample code, not your email. External share actions open the service you choose and pass the invitation URL and concept description; those services have their own policies. No subscription or marketing email is created.</p>'],
    terms:['A small concept. Clear expectations.','<p>Kite is a fictional email-client design concept. Counts, posts, profiles, product features, pricing benefits and launch dates are illustrative. No queue position, account, invitation, free subscription, reservation or product commitment is created.</p><p>The local referral simulator awards 100 places of credit per simulated friend. Rank stops at #1 while total credit can grow. Shared links open this same static concept; no cross-device referral validation exists. The original Spring 2026 brief is not an upcoming launch announcement.</p>'],
    social:['A little more Kite, eventually.','<p>No official Kite social account is configured for this fictional brand. The handles in the sample posts are not verified accounts or endorsements.</p><p>You can share your local demo invitation using the share links after signup, or visit <a href="https://x.com" target="_blank" rel="noopener noreferrer">X</a> and <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>. These general destinations are not official Kite profiles.</p>']
  };
  document.querySelectorAll('[data-info]').forEach((button) => { button.onclick=() => { const [title,content]=info[button.dataset.info];$('info-title').textContent=title;$('info-content').innerHTML=content;$('info-dialog').showModal(); }; });
  document.querySelectorAll('[data-close]').forEach((button) => { button.onclick=() => $(button.dataset.close).close(); });
  addEventListener('scroll',sticky,{passive:true});addEventListener('resize',sticky);
  addEventListener('storage',(event) => {
    if (event.key!==key && event.key!==null) return;
    if (persisted) { $('storage-status').textContent='Saved data changed in another tab. This tab keeps its current demo; reload to read the saved version.'; }
  });
  try {
    const saved=localStorage.getItem(key);
    if (saved) {
      const parsed=JSON.parse(saved);
      if (!valid(parsed)) throw Error('Invalid saved demo');
      state={version:1,email:parsed.email,code:parsed.code,joinedAt:parsed.joinedAt,referrals:parsed.referrals};persisted=true;
      $('storage-status').textContent='Your explicitly saved demo was restored from this device.';
    }
  } catch { $('referral-disclosure').textContent='Saved data is unavailable or invalid. You can try a fresh in-tab example.';toast('Saved demo could not be loaded. A fresh local example is available.'); }
  const ref=new URL(location.href).searchParams.get('ref');
  if (ref && /^[a-f0-9]{24}$/.test(ref)) {
    const note=document.createElement('p');note.className='incoming-note';note.textContent='You arrived via a sample invitation. Joining here creates a local example, not referral credit in another browser.';document.querySelector('.hero-description').after(note);
  }
  render(true);
  window.kiteDemo={stats,snapshot:() => state?{...state,stats:stats(state.referrals),persisted}:null};
})();
