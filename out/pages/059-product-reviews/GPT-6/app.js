'use strict';
(() => {
  const {reviews, categories, photoSources} = window.fieldworkDemo;
  const $ = (id) => document.getElementById(id);
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const icon = (name) => `<svg aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
  const number = (value) => value.toLocaleString('en-US');
  const stars = (rating) => `<span class="stars" style="--rating:${rating}" aria-label="${rating} out of 5 stars">★★★★★</span>`;
  const date = (value) => new Date(value).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
  const topicNames = {quality:'Quality',shipping:'Fast shipping',value:'Great value',ease:'Easy to use'};
  const state = {stars:new Set(),verified:false,media:false,recent:false,size:'',color:'',search:'',topic:'',sort:'recent',page:1};
  const expanded = new Set(), reported = new Set(), ownedURLs = new Set();
  let attachments = [], mediaIndex = 0, reportId = '', serial = 0, member = false, sampleMatch = false;
  let draft = [], uploadBusy = false, uploadVersion = 0, toastTimer;
  const yesCount = (review) => review.yes + Number(review.vote === 1);
  const noCount = (review) => review.no + Number(review.vote === -1);
  const helpful = (a,b) => (yesCount(b)-noCount(b))-(yesCount(a)-noCount(a));
  const byRecent = (a,b) => new Date(b.date)-new Date(a.date) || b.id.localeCompare(a.id);
  function toast(message) {
    $('toast').textContent = message;
    $('toast').hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $('toast').hidden = true; },4000);
  }
  function filtered() {
    const query = state.search.trim().toLocaleLowerCase();
    return reviews.filter((r) =>
      (!state.stars.size || state.stars.has(r.rating)) &&
      (!state.verified || r.verified) && (!state.media || r.media.length) &&
      (!state.recent || (new Date(r.date) >= Date.now()-90*86400000 && new Date(r.date) <= Date.now())) &&
      (!state.size || r.size === state.size) && (!state.color || r.color === state.color) &&
      (!state.topic || r.tags.includes(state.topic)) &&
      (!query || [r.title,r.body,r.name,r.pros,r.cons].some((text) => text.toLocaleLowerCase().includes(query)))
    ).sort((a,b) => {
      if (state.sort === 'helpful') return helpful(a,b) || byRecent(a,b);
      if (state.sort === 'highest') return b.rating-a.rating || byRecent(a,b);
      if (state.sort === 'lowest') return a.rating-b.rating || byRecent(a,b);
      if (state.sort === 'media') return Number(Boolean(b.media.length))-Number(Boolean(a.media.length)) || byRecent(a,b);
      return byRecent(a,b);
    });
  }
  function renderOverview() {
    const count = reviews.length;
    const average = reviews.reduce((sum,r) => sum+r.rating,0)/count;
    $('average-rating').textContent = average.toFixed(1);
    $('average-stars').innerHTML = stars(average);
    $('average-stars').setAttribute('aria-label',`${average.toFixed(1)} out of 5 stars`);
    $('total-reviews').textContent = number(count);
    const recommended = Math.round(reviews.filter((r) => r.recommend).length/count*100);
    $('recommend-percent').innerHTML = `${recommended}<span>%</span>`;
    $('recommend-ring').setAttribute('stroke-dasharray',`${recommended} 100`);
    $('rating-breakdown').innerHTML = [5,4,3,2,1].map((rating) => {
      const amount = reviews.filter((r) => r.rating === rating).length;
      const percent = amount/count*100;
      return `<button class="rating-bar" data-rating="${rating}" aria-pressed="${state.stars.size === 1 && state.stars.has(rating)}" aria-label="Filter ${rating} star reviews, ${number(amount)} reviews"><span>${rating} stars</span><span class="rating-track"><span class="rating-fill" style="--width:${percent}%;display:block"></span></span><strong>${number(amount)}</strong><span>${Math.round(percent)}%</span></button>`;
    }).join('');
    $('category-ratings').innerHTML = categories.map(([key,label]) => {
      const records = reviews.filter((r) => Number.isFinite(r.categories[key]));
      const score = records.reduce((sum,r) => sum+r.categories[key],0)/records.length;
      return `<div class="category-rating" data-category="${key}" title="Based on ${number(records.length)} category responses in the demo dataset"><div><span>${escape(label)}</span><strong>${score.toFixed(1)}</strong></div><div class="category-track"><span style="--width:${score/5*100}%"></span></div></div>`;
    }).join('');
    $('topic-chips').innerHTML = Object.entries(topicNames).map(([key,label]) => `<button class="topic-chip" data-topic="${key}" aria-pressed="${state.topic === key}">${label}<strong>${number(reviews.filter((r) => r.tags.includes(key)).length)}</strong></button>`).join('');
    const common = (key) => {
      const counts = new Map();
      reviews.forEach((r) => { if (r[key]) counts.set(r[key],(counts.get(r[key]) || 0)+1); });
      return [...counts].sort((a,b) => b[1]-a[1]).slice(0,2).map(([text,count]) => `${text} (${number(count)} demo mentions)`).join(' · ');
    };
    document.querySelector('.snapshot-notes').innerHTML = `<p><span>COMMON PROS</span>${escape(common('pros'))}</p><p><span>COMMON CONS</span>${escape(common('cons'))}</p>`;
  }
  function author(review) {
    const initials = review.name.split(/\s+/).slice(0,2).map((part) => [...part][0] || '').join('');
    return `<div class="author-line"><span class="avatar" aria-hidden="true">${escape(initials)}</span><div><span class="author-name">${escape(review.name)}</span><small>${review.local?'Local demo reviewer':'Example reviewer'}</small></div></div>`;
  }
  function card(r,featured = false) {
    const full = featured || expanded.has(r.id) || r.body.length <= 260;
    const short = full ? r.body : `${r.body.slice(0,255).trim()}…`;
    return `<article class="review-card" data-review="${escape(r.id)}"${featured?'':` id="${escape(r.id)}"`}>
      <div class="review-author">${author(r)}${r.verified?`<span class="verified">${icon('shield-check')}Sample verified</span>`:''}<p class="review-variant"><strong>Size:</strong> ${escape(r.size)}<br><strong>Color:</strong> ${escape(r.color)}</p></div>
      <div class="review-copy"><div class="review-topline">${stars(r.rating)}<time datetime="${r.date}">${date(r.date)}</time></div><h3 tabindex="-1">${escape(r.title)}</h3><p class="review-body">${escape(short)}</p>
      ${!featured && r.body.length>260?`<button class="text-button read-more" data-action="expand" data-id="${r.id}" aria-expanded="${full}">${full?'Read less':'Read more'}</button>`:''}
      ${r.pros || r.cons?`<div class="review-procons">${r.pros?`<span><strong>Good:</strong> ${escape(r.pros)}</span>`:''}${r.cons?`<span><strong>Could improve:</strong> ${escape(r.cons)}</span>`:''}</div>`:''}
      ${r.media.length?`<div class="review-media">${r.media.map((m,i) => `<button data-action="media" data-id="${r.id}" data-index="${i}" aria-label="View ${m.type === 'video'?'video':'photo'} ${i+1} for ${escape(r.name)}">${m.type === 'video'?`<span class="video-thumb">${icon('play')}</span>`:`<img src="${escape(m.src)}" alt="${escape(m.alt)}" loading="lazy" width="75" height="75">`}</button>`).join('')}</div>`:''}
      ${r.incentive !== 'none'?`<span class="review-incentive">${r.incentive === 'gift'?'Gifted product':'Discount / other incentive'} · ${r.local?'local disclosure':'sample disclosure'}</span>`:''}
      <div class="review-actions"><span class="helpful-label">Was this helpful?</span><button class="vote-button" data-action="yes" data-id="${r.id}" aria-label="Helpful yes for ${escape(r.name)}" aria-pressed="${r.vote === 1}">${icon('thumbs-up')}Yes (${yesCount(r)})</button><button class="vote-button" data-action="no" data-id="${r.id}" aria-label="Helpful no for ${escape(r.name)}" aria-pressed="${r.vote === -1}">${icon('thumbs-down')}No (${noCount(r)})</button><button class="review-action" data-action="share" data-id="${r.id}"${r.local?' disabled title="Local reviews exist only in this tab"':''}>${icon('share-2')}Share</button><button class="review-action" data-action="report" data-id="${r.id}"${reported.has(r.id)?' disabled':''}>${icon('flag')}${reported.has(r.id)?'Flagged locally':'Report'}</button></div>
      ${r.response?`<aside class="seller-response"><div>${icon('shield-check')}<strong>Fieldwork · sample brand response</strong><time datetime="${r.responseDate}">${date(r.responseDate)}</time></div><p>${escape(r.response)}</p></aside>`:''}</div></article>`;
  }
  function renderFeatured() {
    $('featured-grid').innerHTML = [...reviews].sort((a,b) => helpful(a,b) || byRecent(a,b)).slice(0,2).map((r) => `<div class="featured-card"><div class="featured-heading">${author(r)}<span>${icon('thumbs-up')}${number(yesCount(r))} found this helpful</span></div>${card(r,true)}</div>`).join('');
  }
  function renderFilters() {
    $('star-filters').innerHTML = [5,4,3,2,1].map((rating) => `<label class="star-filter"><input type="checkbox" value="${rating}"${state.stars.has(rating)?' checked':''} aria-label="${rating} star filter"><span>${rating}</span>${stars(rating)}<small>${number(reviews.filter((r) => r.rating === rating).length)}</small></label>`).join('');
    for (const key of ['verified','media','recent']) $(`${key}-filter`).checked = state[key];
    for (const key of ['size','color']) $(`${key}-filter`).value = state[key];
    $('review-search').value = state.search;
    $('sort').value = state.sort;
    const chips = [...state.stars].sort().map((rating) => [String(rating),`${rating} stars`,'star']);
    for (const [key,label] of [['verified','Sample verified'],['media','With media'],['recent','Last 90 days'],['size',state.size],['color',state.color],['search',`“${state.search}”`],['topic',topicNames[state.topic]]]) {
      if (state[key]) chips.push([key,label,'filter']);
    }
    $('active-filters').innerHTML = chips.map(([key,label,type]) => `<button class="active-chip" data-remove="${key}" data-kind="${type}" aria-label="Remove ${escape(label)} filter">${escape(label)}${icon('x')}</button>`).join('');
    $('filter-number').textContent = chips.length || '';
  }
  function renderList() {
    const records = filtered(), pages = Math.max(1,Math.ceil(records.length/10));
    state.page = Math.min(Math.max(1,state.page),pages);
    const first = (state.page-1)*10;
    $('result-count').textContent = records.length?`Showing ${number(first+1)}–${number(Math.min(first+10,records.length))} of ${number(records.length)} reviews`:'No reviews match these filters';
    $('review-list').innerHTML = records.length?records.slice(first,first+10).map((r) => card(r)).join(''):'<div class="empty-state"><h3>A different perspective?</h3><p>Try a broader search or clear a filter to see more demo reviews.</p><button class="text-button" data-action="reset">Reset all filters →</button></div>';
    const selectedPages = [...new Set([1,state.page-1,state.page,state.page+1,pages])].filter((p) => p>=1 && p<=pages).sort((a,b) => a-b);
    let previous = 0;
    $('pagination').innerHTML = `<button class="page-button" data-page="${state.page-1}" aria-label="Previous page"${state.page===1?' disabled':''}>${icon('chevron-left')}</button>`+selectedPages.map((p) => {
      const gap = previous && p-previous>1?'<span class="page-ellipsis" aria-hidden="true">…</span>':'';
      previous = p;
      return `${gap}<button class="page-button" data-page="${p}" aria-label="Page ${p}"${p===state.page?' aria-current="page"':''}>${p}</button>`;
    }).join('')+`<button class="page-button" data-page="${state.page+1}" aria-label="Next page"${state.page===pages?' disabled':''}>${icon('chevron-right')}</button>`;
    $('pagination').hidden = !records.length;
    $('page-jump').hidden = !records.length;
    $('jump-page').max = pages;
    $('jump-page').value = state.page;
    $('page-total').textContent = `of ${pages}`;
    $('jump-status').textContent = '';
  }
  function renderGallery() {
    attachments = reviews.flatMap((review) => review.media.map((media,index) => ({review,media,index})));
    const sources = [...new Map(attachments.map((item) => [item.media.src,item])).values()];
    $('gallery-strip').innerHTML = sources.slice(0,4).map(({review,media,index}) => `<button class="gallery-tile" data-action="media" data-id="${review.id}" data-index="${index}" aria-label="View illustrative gallery photo">${media.type==='image'?`<img src="${escape(media.src)}" alt="${escape(media.alt)}" loading="lazy" width="300" height="177">`:icon('play')}<span>${media.illustrative?'ILLUSTRATIVE DEMO PHOTO':'LOCAL DEMO ATTACHMENT'}</span></button>`).join('');
    $('gallery-all').innerHTML = `View all ${number(attachments.length)} attachments ${icon('arrow-up-right')}`;
    $('gallery-note').textContent = `${photoSources.length} illustrative source photos reused across 26 seeded attachments; ${attachments.length-26} local attachments added. No real buyer uploads or preloaded videos.`;
  }
  function refresh({all = false} = {}) {
    if (all) { renderOverview(); renderGallery(); }
    renderFeatured(); renderFilters(); renderList();
  }
  function changeFilter(change) { change(); state.page=1; refresh(); renderOverview(); }
  function reset() {
    Object.assign(state,{stars:new Set(),verified:false,media:false,recent:false,size:'',color:'',search:'',topic:'',page:1});
    refresh(); renderOverview();
  }
  function goToPage(page) {
    state.page=page; renderList();
    $('review-list-section').scrollIntoView({behavior:'instant',block:'start'});
    $('review-list').querySelector('h3')?.focus({preventScroll:true});
  }
  function locateReview(id) {
    if (!reviews.some((r) => r.id === id)) return;
    reset(); state.sort='recent';
    state.page=Math.floor(filtered().findIndex((r) => r.id===id)/10)+1;
    refresh();
    const cardElement = $(id);
    cardElement.classList.add('shared-review');
    requestAnimationFrame(() => { cardElement.scrollIntoView({behavior:'instant',block:'start'}); cardElement.querySelector('h3').focus({preventScroll:true}); });
  }
  function showMedia(index) {
    if (!attachments.length) return;
    $('media-stage').querySelector('video')?.pause();
    mediaIndex = (index+attachments.length)%attachments.length;
    const {review,media} = attachments[mediaIndex];
    $('media-title').textContent = `Attachment ${mediaIndex+1} of ${attachments.length}`;
    const element = document.createElement(media.type==='video'?'video':'img');
    element.src=media.src;
    if (media.type==='video') { element.controls=true; element.preload='metadata'; }
    else element.alt=media.alt;
    $('media-stage').replaceChildren(element);
    $('media-context').innerHTML = `<h3>${escape(review.title)}</h3><p>${escape(review.name)} · ${review.rating} stars · ${escape(review.size)} / ${escape(review.color)} · ${date(review.date)}<br>${escape(media.illustrative?`${media.credit}. Illustrative stock imagery; not a customer photo.`:'Your local demo upload. Kept in this tab; not sent to a service.')}</p><button class="text-button" id="media-go-review">Read this demo review ${icon('arrow-right')}</button>`;
    $('media-go-review').onclick = () => { $('media-dialog').close(); locateReview(review.id); };
  }
  function openMedia(review,index) {
    showMedia(attachments.findIndex((item) => item.review.id===review.id && item.index===index));
    $('media-dialog').showModal();
  }
  function showInfo(title,content) {
    $('info-title').textContent=title; $('info-content').innerHTML=content; $('info-dialog').showModal();
  }
  const info = {
    about:['A considered design concept.','<p>Fieldwork and its goods are fictional. This independent static prototype explores a transparent product-review experience.</p><p>The 1,247 seeded reviews, names, votes, order matches and brand response are deterministic demo data, with intentionally reused writing templates and imagery. They are not independent customer testimony.</p><p>Counts, star distributions, category averages and structured topic counts are calculated locally. There is no live AI analysis, login, checkout or review API.</p>'],
    privacy:['Your tab. Your demo.','<p>Searches, votes, flags, sample order checks, draft text and submitted reviews stay in this page’s memory. Refreshing clears them. There is no analytics, account, cookie or browser-storage persistence.</p><p>Images and videos are checked and previewed through local blob URLs. Their bytes are not sent to a server. Closing the draft releases draft previews; submitted media is retained for this tab.</p><p>Only seeded review identifiers are included in share links. Hosting providers may still keep normal HTTP access logs.</p>'],
    photos:['A note on the imagery.',`<p>All four photos are illustrative Unsplash imagery, not photographs of Fieldwork goods or real buyer uploads. The green product illustration is an original SVG concept; companion variants reuse it.</p>${photoSources.map((photo) => `<p><a href="https://images.unsplash.com/photo-${photo.credit.split('photo-')[1]}?auto=format&amp;fit=crop&amp;w=1200" target="_blank" rel="noopener noreferrer">${escape(photo.credit)}</a></p>`).join('')}<p><a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash license</a> · Inter and Lucide are distributed with their licenses in the assets folder.</p>`]
  };
  const products = {everyday:['Everyday Carry Pack','20L / 24L · Moss, Oat or Ink',128],daypack:['The Daypack','16L · A compact fictional companion',98],commuter:['The Commuter','20L · A fictional daily-route companion',118],weekend:['The Weekend','28L · A fictional roomier companion',148]};
  document.addEventListener('click',async (event) => {
    const button = event.target.closest('button');
    if (!button || button.disabled) return;
    if (button.hasAttribute('data-close')) { button.closest('dialog').close(); return; }
    if (button.dataset.info) { const [title,content]=info[button.dataset.info]; showInfo(title,content); return; }
    if (button.dataset.product) {
      const [name,description,price]=products[button.dataset.product];
      showInfo(name,`<img src="assets/pack.svg" alt="Original backpack concept drawing"><p>${description}</p><p class="info-price">$${price} <small>sample price</small></p><p>This fictional concept is a local product preview. The illustration is not a production specification; there is no inventory, cart or checkout.</p><button class="primary" data-close>Back to the review room</button>`); return;
    }
    if (button.classList.contains('write-open')) { $('write-dialog').showModal(); return; }
    if (button.dataset.rating) {
      const rating=Number(button.dataset.rating);
      changeFilter(() => { state.stars=state.stars.size===1 && state.stars.has(rating)?new Set():new Set([rating]); });
      $('review-list-section').scrollIntoView({behavior:'instant'}); return;
    }
    if (button.dataset.topic) { changeFilter(() => { state.topic=state.topic===button.dataset.topic?'':button.dataset.topic; }); $('review-list-section').scrollIntoView({behavior:'instant'}); return; }
    if (button.dataset.remove) { changeFilter(() => { if (button.dataset.kind==='star') state.stars.delete(Number(button.dataset.remove)); else state[button.dataset.remove]=['verified','media','recent'].includes(button.dataset.remove)?false:''; }); return; }
    if (button.dataset.page) { goToPage(Number(button.dataset.page)); return; }
    if (button.dataset.action==='reset') { reset(); return; }
    const r=reviews.find((review) => review.id===button.dataset.id);
    if (!r) return;
    const action=button.dataset.action;
    if (action==='expand') {
      if (expanded.has(r.id)) expanded.delete(r.id); else expanded.add(r.id);
      renderList(); document.querySelector(`#${r.id} [data-action="expand"]`)?.focus({preventScroll:true});
    } else if (action==='yes' || action==='no') {
      const featured=Boolean(button.closest('#featured-grid'));
      const vote=action==='yes'?1:-1; r.vote=r.vote===vote?0:vote;
      renderFeatured(); renderList();
      document.querySelector(`${featured?'#featured-grid':'#review-list'} [data-id="${r.id}"][data-action="${action}"]`)?.focus({preventScroll:true});
    } else if (action==='media') openMedia(r,Number(button.dataset.index));
    else if (action==='report') {
      reportId=r.id; $('report-form').reset(); $('report-details-label').hidden=true; $('report-details').required=false; $('report-status').textContent=''; $('report-dialog').showModal();
    } else if (action==='share' && !r.local) {
      const url=new URL(location.href); url.search=''; url.searchParams.set('review',r.id); url.hash=r.id;
      $('share-link').value=url.href; $('share-status').textContent='This link opens the seeded demo review. Copy the link below.';
      $('share-dialog').showModal();
      try { await navigator.clipboard.writeText(url.href); $('share-status').textContent='Copied the seeded demo review link. Local votes and personal data are not included.'; }
      catch { $('share-link').focus(); $('share-link').select(); }
    }
  });
  $('star-filters').addEventListener('change',(event) => {
    const rating=Number(event.target.value);
    changeFilter(() => { if (event.target.checked) state.stars.add(rating); else state.stars.delete(rating); });
    document.querySelector(`#star-filters input[value="${rating}"]`).focus({preventScroll:true});
  });
  for (const key of ['verified','media','recent']) $(`${key}-filter`).onchange=(event) => changeFilter(() => { state[key]=event.target.checked; });
  for (const key of ['size','color']) $(`${key}-filter`).onchange=(event) => changeFilter(() => { state[key]=event.target.value; });
  $('review-search').oninput=(event) => changeFilter(() => { state.search=event.target.value; });
  $('sort').onchange=(event) => { state.sort=event.target.value; state.page=1; renderList(); };
  $('clear-filters').onclick=reset;
  $('page-jump').onsubmit=(event) => {
    event.preventDefault();
    const value=Number($('jump-page').value), max=Number($('jump-page').max);
    if (!Number.isInteger(value) || value<1 || value>max) { $('jump-status').textContent=`Choose a whole page from 1 to ${max}.`; return; }
    goToPage(value);
  };
  const mobileQuery=matchMedia('(max-width:650px)');
  function syncFilters() {
    const open=$('filter-toggle').getAttribute('aria-expanded')==='true';
    $('filter-panel').hidden=mobileQuery.matches && !open;
  }
  mobileQuery.addEventListener('change',syncFilters); syncFilters();
  $('filter-toggle').onclick=() => { $('filter-toggle').setAttribute('aria-expanded',String($('filter-toggle').getAttribute('aria-expanded')!=='true')); syncFilters(); };
  $('mobile-menu').onclick=() => { const open=$('mobile-nav').hidden; $('mobile-nav').hidden=!open; $('mobile-menu').setAttribute('aria-expanded',String(open)); $('mobile-menu').setAttribute('aria-label',open?'Close navigation':'Open navigation'); };
  $('mobile-nav').onclick=() => { $('mobile-nav').hidden=true; $('mobile-menu').setAttribute('aria-expanded','false'); $('mobile-menu').setAttribute('aria-label','Open navigation'); };
  $('gallery-all').onclick=() => { showMedia(0); $('media-dialog').showModal(); };
  $('media-prev').onclick=() => showMedia(mediaIndex-1);
  $('media-next').onclick=() => showMedia(mediaIndex+1);
  $('media-dialog').onkeydown=(event) => { if (event.target.tagName==='VIDEO') return; if (event.key==='ArrowRight' || event.key==='ArrowLeft') { event.preventDefault(); showMedia(mediaIndex+(event.key==='ArrowRight'?1:-1)); } };
  $('media-dialog').addEventListener('close',() => { $('media-stage').querySelector('video')?.pause(); $('media-stage').replaceChildren(); });
  $('report-reason').onchange=() => { const other=$('report-reason').value==='Other'; $('report-details-label').hidden=!other; $('report-details').required=other; $('report-details').setCustomValidity(''); };
  $('report-details').oninput=() => $('report-details').setCustomValidity('');
  $('report-form').onsubmit=(event) => {
    event.preventDefault();
    if ($('report-reason').value==='Other' && !$('report-details').value.trim()) { $('report-details').setCustomValidity('Add a short explanation.'); $('report-details').reportValidity(); return; }
    if (!reportId || reported.has(reportId)) return;
    reported.add(reportId); renderFeatured(); renderList(); $('report-dialog').close(); toast('Flag saved in this tab only. Nothing was sent to moderation.');
  };
  function identity(isMember) {
    member=isMember; sampleMatch=false; $('order-panel').hidden=!member;
    for (const [id,active] of [['guest-mode',!member],['member-mode',member]]) { $(id).classList.toggle('active',active); $(id).setAttribute('aria-pressed',String(active)); }
    $('sample-order').value=''; $('order-status').textContent='No purchase has been verified.';
  }
  $('guest-mode').onclick=() => identity(false);
  $('member-mode').onclick=() => identity(true);
  $('sample-order').oninput=() => { sampleMatch=false; $('order-status').textContent='Sample order changed. Check it again to apply a demo badge.'; };
  $('check-order').onclick=() => {
    sampleMatch=$('sample-order').value.trim()==='FW-2048';
    $('order-status').textContent=sampleMatch?'Sample order matched. A sample-verified badge will be shown; no real purchase was checked.':'Sample order not matched. Use FW-2048 or continue without a demo badge.';
  };
  $('rating-selector').onchange=() => {
    const rating=Number(new FormData($('write-form')).get('rating'));
    $('rating-description').textContent=['','Not my fit','Needs improvement','A mixed experience','A good everyday','An excellent everyday'][rating];
    document.querySelectorAll('#rating-selector label').forEach((label,index) => label.classList.toggle('selected',index<rating));
  };
  $('review-body').oninput=() => { $('body-count').textContent=`${number($('review-body').value.trim().length)} / 2,000 · minimum 50 characters`; $('review-body').setCustomValidity(''); };
  $('write-form').elements.title.oninput=(event) => event.target.setCustomValidity('');
  const release = (src) => { if (ownedURLs.delete(src)) URL.revokeObjectURL(src); };
  function renderDraft() {
    $('draft-media').innerHTML=draft.map((m,index) => `<div class="draft-attachment">${m.type==='image'?`<img src="${escape(m.src)}" alt="Your local draft image">`:`<video src="${escape(m.src)}" muted preload="metadata"></video>`}<button type="button" class="icon-button" data-draft="${index}" aria-label="Remove attachment ${index+1}"${uploadBusy?' disabled':''}>${icon('x')}</button></div>`).join('');
  }
  $('draft-media').onclick=(event) => {
    const button=event.target.closest('[data-draft]'); if (!button || uploadBusy) return;
    const [item]=draft.splice(Number(button.dataset.draft),1); release(item.src); renderDraft(); $('upload-status').textContent=`${draft.length} local attachments ready.`;
  };
  async function inspectFile(file) {
    const imageTypes=['image/png','image/jpeg','image/webp'], videoTypes=['video/mp4','video/webm'];
    const image=imageTypes.includes(file.type), video=videoTypes.includes(file.type);
    if (!image && !video) throw Error('Choose a PNG, JPEG, WebP, MP4 or WebM file.');
    if (!file.size || file.size>(image?5:20)*1024*1024) throw Error(image?'Images must be nonempty and at most 5MB.':'Videos must be nonempty and at most 20MB.');
    const bytes=new Uint8Array(await file.slice(0,32).arrayBuffer());
    const ascii=(start,end) => String.fromCharCode(...bytes.slice(start,end));
    const valid={'image/png':bytes[0]===137 && ascii(1,4)==='PNG','image/jpeg':bytes[0]===255 && bytes[1]===216 && bytes[2]===255,'image/webp':ascii(0,4)==='RIFF' && ascii(8,12)==='WEBP','video/mp4':ascii(4,8)==='ftyp','video/webm':bytes[0]===26 && bytes[1]===69 && bytes[2]===223 && bytes[3]===163}[file.type];
    if (!valid) throw Error('File contents do not match the selected media type.');
    const src=URL.createObjectURL(file); ownedURLs.add(src);
    const element=document.createElement(image?'img':'video');
    try {
      await new Promise((resolve,reject) => {
        const timer=setTimeout(() => reject(Error('Media could not be decoded within 8 seconds.')),8000);
        const done=(error) => { clearTimeout(timer); error?reject(error):resolve(); };
        element[image?'onload':'onloadedmetadata']=() => done();
        element.onerror=() => done(Error('This file cannot be decoded by your browser.'));
        if (video) element.preload='metadata';
        element.src=src;
      });
      const width=image?element.naturalWidth:element.videoWidth, height=image?element.naturalHeight:element.videoHeight;
      if (!width || !height || width>(image?4096:1920) || height>(image?4096:1920)) throw Error(image?'Images may be at most 4096 × 4096 pixels.':'Videos may be at most 1920 × 1920 pixels.');
      if (video && (!Number.isFinite(element.duration) || element.duration<=0 || element.duration>30)) throw Error('Videos must have a finite duration of at most 30 seconds.');
      return {src,type:image?'image':'video',alt:'Local demo reviewer attachment',illustrative:false};
    } catch (error) { release(src); throw error; }
    finally { element.onload=null; element.onloadedmetadata=null; element.onerror=null; element.removeAttribute('src'); if (video) element.load(); }
  }
  $('media-upload').onchange=async () => {
    const files=[...$('media-upload').files]; if (!files.length) return;
    const token=++uploadVersion, added=[];
    uploadBusy=true; $('submit-review').disabled=true; $('media-upload').disabled=true; renderDraft();
    $('upload-status').textContent='Checking file contents, dimensions and duration locally…';
    try {
      if (files.length+draft.length>3) throw Error('Keep at most three attachments. Remove one before adding more.');
      for (const file of files) {
        const item=await inspectFile(file);
        if (token!==uploadVersion) { release(item.src); return; }
        added.push(item);
      }
      draft.push(...added); $('upload-status').textContent=`${draft.length} local attachments ready. Nothing has been uploaded.`;
    } catch (error) {
      added.forEach((item) => release(item.src));
      if (token===uploadVersion) $('upload-status').textContent=`${error.message} Previous attachments were kept.`;
    } finally {
      if (token===uploadVersion) { uploadBusy=false; $('submit-review').disabled=false; $('media-upload').disabled=false; $('media-upload').value=''; renderDraft(); }
      else added.forEach((item) => release(item.src));
    }
  };
  function resetDraft() {
    uploadVersion++; draft.forEach((item) => release(item.src)); draft=[]; uploadBusy=false;
    $('write-form').reset(); $('write-form').elements.title.setCustomValidity(''); $('review-body').setCustomValidity('');
    $('submit-review').disabled=false; $('media-upload').disabled=false;
    $('upload-status').textContent=''; $('write-status').textContent=''; $('body-count').textContent='0 / 2,000 · minimum 50 characters'; $('rating-description').textContent='Choose a rating';
    document.querySelectorAll('#rating-selector label').forEach((label) => label.classList.remove('selected'));
    identity(false); renderDraft();
  }
  $('write-dialog').addEventListener('close',resetDraft);
  $('write-form').onsubmit=(event) => {
    event.preventDefault(); if (uploadBusy) return;
    const data=new FormData($('write-form')), title=String(data.get('title')).trim(), body=String(data.get('body')).trim();
    if (title.length<5 || title.length>100) { $('write-form').elements.title.setCustomValidity('Use 5 to 100 nonblank characters.'); $('write-form').elements.title.reportValidity(); return; }
    if (body.length<50 || body.length>2000) { $('review-body').setCustomValidity('Use 50 to 2,000 nonblank characters.'); $('review-body').reportValidity(); return; }
    const rating=Number(data.get('rating'));
    if (![1,2,3,4,5].includes(rating) || !['20L','24L'].includes(data.get('size')) || !['Moss','Oat','Ink'].includes(data.get('color')) || !['yes','no'].includes(data.get('recommend')) || !data.has('consent')) return;
    const tags=Object.entries({quality:/quality|material/i,shipping:/shipping|delivery/i,value:/value|worth/i,ease:/easy|organize|access/i}).filter(([,pattern]) => pattern.test(`${title} ${body}`)).map(([key]) => key);
    const r={id:`local-review-${++serial}`,rating,title,body,name:String(data.get('name')).trim() || 'Anonymous',date:new Date().toISOString(),size:data.get('size'),color:data.get('color'),verified:member && sampleMatch,recommend:data.get('recommend')==='yes',tags,yes:0,no:0,vote:0,incentive:data.get('incentive'),media:draft,categories:{},pros:String(data.get('pros')).trim(),cons:String(data.get('cons')).trim(),local:true};
    draft=[]; reviews.push(r); $('write-dialog').close(); reset(); state.sort='recent'; refresh({all:true}); locateReview(r.id);
    toast('Added to this tab only. Refreshing clears your demo review.');
  };
  addEventListener('pagehide',(event) => { if (!event.persisted) { uploadVersion++; ownedURLs.forEach((src) => URL.revokeObjectURL(src)); ownedURLs.clear(); } });
  refresh({all:true});
  const shared=new URL(location.href).searchParams.get('review');
  if (shared && /^review-\d{4}$/.test(shared)) locateReview(shared);
})();
