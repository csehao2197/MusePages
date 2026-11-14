'use strict';
(() => {
  const C=window.flowlineContent,$=(id) => document.getElementById(id);
  const escape=(value) => String(value).replace(/[&<>"']/g,(char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const icon=(name) => `<svg aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
  const art=(name,label='Original editorial illustration') => `<svg viewBox="0 0 640 440" role="img" aria-label="${escape(label)}"><use href="assets/illustrations.svg#${name}"/></svg>`;
  const topicFor=(id) => C.topics.find((topic) => topic.id===id);
  let topic='all',query='',limit=9,sort='curated',guides=false,lessonPosition=0,lessonTimer,playing=false,toastTimer,board=[0,0,1];
  const toast=(message) => {$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(() => {$('toast').hidden=true;},3500);};
  function readURL() {
    const params=new URLSearchParams(location.search);
    topic=topicFor(params.get('topic'))?params.get('topic'):'all';query=(params.get('q') || '').slice(0,120);guides=params.get('format')==='guide';
    $('article-search').value=query;
  }
  function writeURL() {
    const url=new URL(location.href);
    for (const key of ['topic','q','format']) url.searchParams.delete(key);
    if (topic!=='all') url.searchParams.set('topic',topic);
    if (query.trim()) url.searchParams.set('q',query.trim());
    if (guides) url.searchParams.set('format','guide');
    history.replaceState(null,'',url);
  }
  function filtered() {
    let list=C.articles.filter((article) => (topic==='all' || article.topic===topic) && (!guides || article.format==='guide') && `${article.title} ${article.excerpt} ${topicFor(article.topic).name} ${C.authors[article.author].name}`.toLowerCase().includes(query.trim().toLowerCase()));
    if (sort==='newest') list.sort((a,b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
    if (sort==='shortest') list.sort((a,b) => a.minutes-b.minutes || a.title.localeCompare(b.title));
    return list;
  }
  function newsletter() {
    return `<section class="newsletter" aria-labelledby="newsletter-title"><div class="newsletter-drawing">${icon('mail')}<i></i><i></i></div><span class="eyebrow">A GOOD READ. A BETTER WEEK.</span><h3 id="newsletter-title">Get smarter about<br> work, weekly.</h3><p>Join 12,000+ managers and makers.<br> Less noise. A little more perspective.</p><form id="newsletter-form" novalidate><label class="sr-only" for="newsletter-email">Your email address</label><input id="newsletter-email" type="email" placeholder="Your work email" maxlength="254" required autocomplete="email"><button class="button" type="submit">Subscribe ${icon('arrow-right')}</button></form><p class="newsletter-status" id="newsletter-status" role="status"></p><small>Demo audience figure. This local form sends and stores nothing.<br>By subscribing, you agree to our <button data-info="privacy">Privacy Policy</button>.</small></section>`;
  }
  function card(article) {
    const author=C.authors[article.author],date=new Date(article.date+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'});
    return `<article class="article-card" data-card="${article.id}"><a class="card-art" href="#article-${article.id}" data-article="${article.id}" aria-label="Read ${escape(article.title)}">${art(article.art)}<span class="art-corner">${icon('arrow-up-right')}</span></a><div class="card-copy"><a class="category ${article.topic}" href="?topic=${article.topic}#articles" data-topic="${article.topic}">${escape(topicFor(article.topic).name.toUpperCase())}</a><h3><a href="#article-${article.id}" data-article="${article.id}">${escape(article.title)}</a></h3><p>${escape(article.excerpt)}</p><div class="card-author"><span class="avatar" style="--avatar:${author.color}">${author.initials}</span><div><strong>${author.name}</strong><small>${date} <i>·</i> ${article.minutes} min read</small></div></div></div></article>`;
  }
  function render() {
    const list=filtered(),shown=list.slice(0,limit);
    document.querySelectorAll('[data-filter]').forEach((button) => {const active=button.dataset.filter===topic;button.classList.toggle('active',active);button.setAttribute('aria-pressed',active);});
    $('latest-title').textContent=guides?'The practical guides.':topic==='all'?'Fresh perspectives.':`${topicFor(topic).name}, thoughtfully.`;
    $('results-summary').textContent=`${list.length} ${list.length===1?'article brief':'article briefs'}${query.trim()?` matching “${query.trim()}”`:guides?' · guides only':topic==='all'?' · a little inspiration for your next chapter':''}`;
    $('clear-filters').hidden=topic==='all' && !query.trim() && !guides;
    $('article-grid').innerHTML=shown.length?shown.map((article,index) => card(article)+(index===5?newsletter():'')).join(''):'<div class="empty-state">'+icon('search')+'<h3>A little too specific?</h3><p>No articles match these filters. Try another word or clear your filters.</p><button class="button outline" data-clear>Show all articles</button></div>';
    if (shown.length && shown.length<6) $('article-grid').insertAdjacentHTML('beforeend',newsletter());
    $('page-count').textContent=`Showing ${shown.length} of ${list.length} article${list.length===1?'':'s'}`;
    $('load-more').hidden=shown.length>=list.length;
    if ($('newsletter-form')) $('newsletter-form').onsubmit=(event) => {
      event.preventDefault();
      const input=$('newsletter-email'),email=input.value.trim();
      if (!email || email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {$('newsletter-status').textContent='Enter a valid email address to try the local form.';input.setAttribute('aria-invalid','true');input.focus();return;}
      input.removeAttribute('aria-invalid');input.value='';$('newsletter-status').textContent='You tried the signup. This demo sent nothing and kept no email address.';
    };
  }
  function applyTopic(value,scroll=false) {
    topic=topicFor(value)?value:'all';limit=9;guides=false;writeURL();render();
    if (scroll) $('articles').scrollIntoView({behavior:'instant'});
    menu(false);resources(false);
  }
  $('topic-pills').innerHTML=[['all','All'],...C.topics.map((item) => [item.id,item.name])].map(([id,name]) => `<button type="button" data-filter="${id}"${id==='all'?' class="active"':''} aria-pressed="${id==='all'}">${name}</button>`).join('');
  $('topic-grid').innerHTML=C.topics.map((item) => `<a href="?topic=${item.id}#articles" data-topic="${item.id}" style="--topic:${item.color}"><span class="topic-icon">${icon(item.icon)}</span><div><h3>${item.name}</h3><span>${item.count} articles</span></div>${icon('arrow-up-right')}</a>`).join('');
  const popular=[['four-day-week','14.2K'],['async-first','9.8K'],['flowline-ai','8.1K'],['better-standups','6.4K'],['cicd-visual-guide','5.7K']];
  $('popular-list').innerHTML=popular.map(([id,count],index) => {const article=C.articles.find((item) => item.id===id);return `<li><span>0${index+1}</span><a href="#article-${id}" data-article="${id}"><strong>${escape(article.title)}</strong><small>${count} sample reads</small></a></li>`;}).join('');
  $('article-search').oninput=() => {query=$('article-search').value;limit=9;writeURL();render();};
  $('search-form').onsubmit=(event) => {event.preventDefault();$('articles').scrollIntoView({behavior:'instant'});};
  $('header-search').onclick=() => {$('article-search').scrollIntoView({behavior:'instant',block:'center'});$('article-search').focus({preventScroll:true});menu(false);};
  $('sort-order').onchange=() => {sort=$('sort-order').value;limit=9;render();};
  $('load-more').onclick=() => {
    const before=limit;limit+=9;render();
    const next=$('article-grid').querySelectorAll('[data-card]')[before]?.querySelector('h3 a');
    next?.focus({preventScroll:true});
  };
  function clear() {topic='all';query='';guides=false;limit=9;$('article-search').value='';writeURL();render();}
  $('clear-filters').onclick=clear;
  function menu(open) {$('primary-nav').classList.toggle('open',open);$('mobile-menu').setAttribute('aria-expanded',open);$('mobile-menu').setAttribute('aria-label',open?'Close menu':'Open menu');}
  function resources(open) {$('resources-menu').hidden=!open;$('resources-toggle').setAttribute('aria-expanded',open);}
  $('mobile-menu').onclick=() => menu(!$('primary-nav').classList.contains('open'));
  $('resources-toggle').onclick=() => resources($('resources-menu').hidden);
  document.addEventListener('click',(event) => {if (!event.target.closest('.resource-menu')) resources(false);if (!event.target.closest('#site-header')) menu(false);});
  document.addEventListener('keydown',(event) => {
    if (event.key==='Escape') {const dialog=document.querySelector('dialog[open]');if (dialog) {event.preventDefault();dialog.close();}else {menu(false);resources(false);$('mobile-menu').getClientRects().length?$('mobile-menu').focus():$('resources-toggle').focus();}}
    if (event.key==='/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.querySelector('dialog[open]')) {event.preventDefault();$('header-search').click();}
  });
  const observer=new IntersectionObserver(([entry]) => $('site-header').classList.toggle('scrolled',!entry.isIntersecting),{rootMargin:'-70px 0px 0px 0px'});
  observer.observe(document.querySelector('.hero'));
  function openArticle(id) {
    const article=C.articles.find((item) => item.id===id);if (!article) return;
    const topic=topicFor(article.topic),author=C.authors[article.author];
    $('article-content').innerHTML=`<span class="category ${article.topic}">${topic.name.toUpperCase()}</span><h2 id="reader-title">${escape(article.title)}</h2><div class="reader-byline"><span class="avatar" style="--avatar:${author.color}">${author.initials}</span><span>${author.name} · ${article.date} · ${article.minutes}-min editorial concept</span></div><div class="reader-art">${art(article.art)}</div><p class="reader-disclosure">LOCAL ARTICLE BRIEF · FICTIONAL PRODUCT & AUTHORS</p><p class="reader-lead">${escape(article.excerpt)}</p><h3>The idea, in a little more detail</h3><p>${escape(topic.principle)} This brief explores ${escape(article.subject.toLowerCase())}. Start with a conversation about the result your team actually needs, then choose the smallest change that could help. A new process is only useful if the people doing the work can understand and sustain it.</p><p>Make the current workflow visible before changing it. Write down where context gets lost, who is waiting for a decision, and what a good handoff looks like. Agree on a short experiment with a named owner and a review date. Keep the work small enough to learn from without adding another layer of administration.</p><h3>A small experiment for your next week</h3><ol>${topic.steps.map((step) => `<li>${escape(step)}</li>`).join('')}</ol><h3>Make the review useful</h3><p>Compare the same outcome before and after the experiment. Ask what got easier, what became harder and whether the change helped the whole team. A single percentage is not enough: consider quality, workload and the time people need to recover. Keep what helped, document what you learned, and adapt the next step.</p>${['four-day-week','designlab-story'].includes(article.id)?'<div class="reader-callout">The headline percentage is part of the original fictional brief, not an observed study or verified customer result. No causal or performance guarantee is implied.</div>':''}${article.id==='flowline-ai'?'<div class="reader-callout">Flowline AI is a feature concept. This page does not call an AI model or provide an assistant service.</div>':''}<p class="reader-footnote">This is an original editorial brief, not the full planned article. Read-time labels describe the illustrative long-form concept. All content is available locally; no sign-in is needed.</p><button class="text-link" id="reader-topic" data-topic="${article.topic}">More in ${topic.name} ${icon('arrow-right')}</button>`;
    history.replaceState(null,'',`${location.pathname}${location.search}#article-${id}`);
    if (!$('article-dialog').open) $('article-dialog').showModal();$('article-dialog').scrollTop=0;
  }
  $('article-dialog').addEventListener('close',() => {if (location.hash.startsWith('#article-')) history.replaceState(null,'',location.pathname+location.search);});
  const notes={
    product:['A calmer place for good work.','Flowline is a fictional project management concept. Try the local workspace preview to move three sample tasks through a tiny board. No production service, accounts or AI assistant are connected.'],
    solutions:['Built around the people doing the work.','Engineering, distributed teams, leaders and studios have different rhythms. Browse a topic for original editorial briefs and small experiments; customer stories and all performance figures are fictional.'],
    pricing:['A concept, without a checkout.','No paid plans, subscriptions or trial billing exist here. Start free opens a local sample board. It requests no credentials or payment details.'],
    api:['A note for developers.','No Flowline API or integration service is connected to this concept. The sample product board and content filters run entirely in this browser.'],
    company:['A little more flow.','An original static design study about thoughtful teamwork. Flowline, its authors and its customer stories are fictional; brand artwork and downloadable resources were created for this page.'],
    signin:['No account needed here.','There is no sign-in server in this static concept. Use Start free to explore the in-memory sample workspace without credentials.'],
    demo:['Your demo is already here.','Try the sample workspace or the captioned Flowline Masterclass. This concept has no sales team or meeting scheduler; no booking is created.'],
    privacy:['Your curiosity stays with you.','The page uses no analytics, cookies or browser storage. Newsletter input is checked locally, then cleared; it is never submitted or saved. Search terms are reflected in this page’s URL, so keep private information out of searches and shared links. Downloaded files remain on your device.'],
    accessibility:['A little more accessible.','Keyboard navigation, named controls, reduced motion, an all-text lesson transcript and responsive layouts are included. Article briefs and diagrams are available without signing in. The interactive library requires JavaScript.']
  };
  function info(id) {const note=notes[id];if (!note) return;menu(false);resources(false);$('info-title').textContent=note[0];$('info-content').innerHTML=`<p>${escape(note[1])}</p>${['product','signin','pricing','demo'].includes(id)?'<button class="button" data-trial>Try the local preview '+icon('arrow-right')+'</button>':''}`;$('info-dialog').showModal();}
  function renderBoard() {
    const titles=['Write the outcome','Share a short brief','Review the experiment'],columns=['To do','In progress','Done'];
    $('sample-board').innerHTML=columns.map((column,index) => `<section><h4>${column}<span>${board.filter((value) => value===index).length}</span></h4>${titles.map((title,i) => board[i]===index?`<button data-task="${i}" aria-label="${title}; move from ${column} to ${columns[(index+1)%3]}">${icon('circle-check')}<span>${title}</span>${icon('arrow-right')}</button>`:'').join('')}</section>`).join('');
  }
  function trial() {document.querySelectorAll('dialog[open]').forEach((dialog) => dialog.close());menu(false);$('trial-form').hidden=false;$('trial-result').hidden=true;$('workspace-name').value='';board=[0,0,1];$('trial-dialog').showModal();}
  $('trial-form').onsubmit=(event) => {event.preventDefault();const name=$('workspace-name').value.trim();if (!name) {$('workspace-name').setCustomValidity('Enter a workspace name.');$('workspace-name').reportValidity();return;}$('trial-form').hidden=true;$('trial-result').hidden=false;$('workspace-title').textContent=name;renderBoard();};
  $('workspace-name').oninput=() => $('workspace-name').setCustomValidity('');
  $('reset-board').onclick=() => {board=[0,0,1];renderBoard();};
  $('trial-dialog').addEventListener('close',() => {board=[0,0,1];$('workspace-name').value='';$('workspace-title').textContent='';$('sample-board').innerHTML='';});
  function renderLesson() {
    const index=Math.min(7,Math.floor(lessonPosition/6)),lesson=C.lessons[index];
    $('lesson-heading').textContent=lesson[0];$('lesson-text').textContent=lesson[1];$('lesson-step').textContent=`STEP ${index+1} OF 8`;
    if ($('lesson-scene').dataset.step!==String(index)) {
      $('lesson-scene').innerHTML=`<div class="lesson-mini-label">${icon('git-branch')} THE GOOD WORK PROJECT</div><div class="lesson-diagram"><span class="reached">${icon('target')}<strong>One outcome</strong></span><i></i><span class="${index>=2?'reached':''}">${icon('users')}<strong>A clear owner</strong></span><i></i><span class="${index>=5?'reached':''}">${icon('circle-check')}<strong>A useful review</strong></span></div><p>${index<3?'A small plan, shared clearly.':index<6?'A little less work in progress.':'A little more room for what matters.'}</p>`;
      $('lesson-scene').dataset.step=String(index);
    }
    $('lesson-progress').value=lessonPosition;$('lesson-time').textContent=`0:${String(Math.floor(lessonPosition)).padStart(2,'0')} / 0:48`;
    $('lesson-play').innerHTML=`${playing?'Pause lesson':lessonPosition>=48?'Replay lesson':'Play lesson'} ${icon(playing?'pause':'play')}`;$('lesson-prev').disabled=lessonPosition===0;$('lesson-next').disabled=lessonPosition>=42;
  }
  function pauseLesson() {playing=false;clearInterval(lessonTimer);renderLesson();}
  function openLesson() {menu(false);resources(false);lessonPosition=0;pauseLesson();$('lesson-dialog').showModal();}
  $('lesson-transcript').innerHTML=C.lessons.map(([title,text],index) => `<h3>${index+1}. ${title}</h3><p>${text}</p>`).join('');
  $('lesson-play').onclick=() => {
    if (playing) {pauseLesson();return;}
    if (lessonPosition>=48) lessonPosition=0;playing=true;renderLesson();
    let last=performance.now();
    lessonTimer=setInterval(() => {const now=performance.now();lessonPosition=Math.min(48,lessonPosition+(now-last)/1000);last=now;if (lessonPosition>=48) {pauseLesson();return;}renderLesson();},200);
  };
  $('lesson-prev').onclick=() => {lessonPosition=Math.max(0,(Math.ceil(lessonPosition/6)-1)*6);pauseLesson();};
  $('lesson-next').onclick=() => {lessonPosition=Math.min(42,(Math.floor(lessonPosition/6)+1)*6);pauseLesson();};
  $('lesson-dialog').addEventListener('close',pauseLesson);
  document.addEventListener('visibilitychange',() => {if (document.hidden && playing) pauseLesson();});
  document.body.addEventListener('click',(event) => {
    if (event.target.closest('#resources-menu a[href="#articles"]')) {menu(false);resources(false);}
    const article=event.target.closest('[data-article]');
    if (article && !(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)) {event.preventDefault();openArticle(article.dataset.article);}
    const filter=event.target.closest('[data-filter]');if (filter) applyTopic(filter.dataset.filter);
    const link=event.target.closest('[data-topic]');
    if (link && !(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)) {event.preventDefault();if ($('article-dialog').open) $('article-dialog').close();applyTopic(link.dataset.topic,true);}
    if (event.target.closest('[data-clear]')) clear();
    const note=event.target.closest('[data-info]');if (note) info(note.dataset.info);
    const close=event.target.closest('[data-close]');if (close) $(close.dataset.close).close();
    if (event.target.closest('[data-trial]')) trial();
    if (event.target.closest('[data-lesson]')) openLesson();
    if (event.target.closest('[data-guides]')) {guides=true;limit=9;writeURL();render();menu(false);resources(false);$('articles').scrollIntoView({behavior:'instant'});}
    const task=event.target.closest('[data-task]');
    if (task) {const id=Number(task.dataset.task);board[id]=(board[id]+1)%3;renderBoard();$('sample-board').querySelector(`[data-task="${id}"]`)?.focus();toast('Sample task moved. Changes stay in this preview.');}
  });
  function restoreLocation() {
    readURL();render();
    const id=location.hash.startsWith('#article-')?location.hash.slice(9):'';
    if (C.articles.some((article) => article.id===id)) openArticle(id);
    else if ($('article-dialog').open) $('article-dialog').close();
  }
  window.addEventListener('popstate',restoreLocation);
  window.addEventListener('hashchange',restoreLocation);
  restoreLocation();
  if (location.hash && !location.hash.startsWith('#article-')) setTimeout(() => {try {document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({behavior:'instant'});}catch {}},0);
})();
