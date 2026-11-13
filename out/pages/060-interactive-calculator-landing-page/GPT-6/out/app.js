'use strict';
(() => {
  const {cohorts,industries,defaults,validate,calculate}=window.relayCalculator;
  const $=(id) => document.getElementById(id);
  const escape=(value) => String(value).replace(/[&<>"']/g,(char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const icon=(name) => `<svg aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
  const dollars=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
  const precise=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2});
  const money=(value) => dollars.format(value);
  const number=(value) => Math.round(value).toLocaleString('en-US');
  const percent=(value) => `${number(value)}%`;
  const paybackNumber=(value) => value<.1?'<0.1':value.toFixed(1);
  const key='relay-estimate-v1', urls=new Set(), frames=new Map();
  let step=0, visited=0, completed=false, interacted=false, converted=false, exitSeen=false, toastTimer;
  let input={...defaults,goals:[...defaults.goals]}, result=calculate(input);
  function toast(message) {
    $('toast').textContent=message; $('toast').hidden=false; clearTimeout(toastTimer);
    toastTimer=setTimeout(() => { $('toast').hidden=true; },4500);
  }
  function read() {
    return {cohort:Number($('company-size').value),industry:$('industry').value,hours:$('hours').valueAsNumber,rate:$('rate').valueAsNumber,tools:$('tools').valueAsNumber,team:$('team').valueAsNumber,goals:[...document.querySelectorAll('[name="goal"]:checked')].map((el) => el.value)};
  }
  function apply(values) {
    for (const id of ['hours','rate','tools','team']) $(id).value=values[id];
    $('company-size').value=values.cohort; $('industry').value=values.industry;
    document.querySelectorAll('[name="goal"]').forEach((el) => { el.checked=values.goals.includes(el.value); });
    update(false);
  }
  function animateMoney(element,value,animate) {
    cancelAnimationFrame(frames.get(element));
    const previous=Number(element.dataset.value ?? value); element.dataset.value=value;
    if (!animate || matchMedia('(prefers-reduced-motion:reduce)').matches) { element.textContent=money(value); return; }
    const start=performance.now();
    const tick=(now) => {
      const progress=Math.min(1,(now-start)/350), eased=1-(1-progress)**3;
      element.textContent=money(previous+(value-previous)*eased);
      if (progress<1) frames.set(element,requestAnimationFrame(tick));
      else frames.delete(element);
    };
    frames.set(element,requestAnimationFrame(tick));
  }
  function showStep(next) {
    step=next;
    document.querySelectorAll('[data-panel]').forEach((el) => { el.hidden=Number(el.dataset.panel)!==step; });
    document.querySelectorAll('[data-step]').forEach((button) => {
      const index=Number(button.dataset.step); button.disabled=index>visited; button.classList.toggle('complete',index<visited);
      if (index===step) button.setAttribute('aria-current','step'); else button.removeAttribute('aria-current');
    });
    $('step-caption').textContent=`Step ${step+1} of 3`; $('progress').value=step+1;
    $('back').disabled=step===0;
    $('next').innerHTML=`${['Next: your everyday','Next: your priorities','See my savings'][step]} ${icon('arrow-right')}`;
  }
  function validStep() {
    for (const field of document.querySelectorAll(`[data-panel="${step}"] input,[data-panel="${step}"] select`)) if (!field.reportValidity()) return false;
    if (step===1 && validate(read())) { $('calculator-status').textContent=validate(read()); return false; }
    return true;
  }
  function requireValid() {
    const error=validate(read());
    if (!error) return true;
    visited=Math.max(visited,1); showStep(1); $('calculator-status').textContent=error;
    $('calculator').scrollIntoView({behavior:'instant'});
    const invalid=[...document.querySelectorAll('[data-panel="1"] input')].find((el) => !el.validity.valid);
    invalid?.focus(); invalid?.reportValidity();
    return false;
  }
  function renderLive(animate) {
    const loss=result.net<0;
    document.querySelector('.live-card').dataset.loss=loss;
    $('live-label').textContent=loss?'Additional modeled annual cost':'Potential annual net value';
    animateMoney($('live-savings'),result.net,animate);
    $('live-hours').textContent=`${number(result.timeSaved)} hrs`;
    $('live-roi').textContent=percent(result.roi); $('live-plan').textContent=result.plan.name;
    const scale=Math.max(result.current,result.projected,1);
    $('mini-before').style.width=`${result.current/scale*100}%`;
    $('mini-after').style.width=`${result.projected/scale*100}%`;
    $('assumption-text').textContent=`All scenarios use 52 weeks/year, 12 monthly subscriptions and $2,400 one-time setup. Current ${industries[input.industry].label} planning assumption: ${Math.round(result.recovery*100)}% of task hours recovered and 70% of existing tool costs replaced. Starter: $29/seat/month, minimum 3 seats; Team: $25, minimum 10; Scale: $22, minimum 25. Your sample ${result.plan.name} uses ${number(result.seats)} billable seats. Conservative recovery: 35% time / 40% tools. Ambitious: 75% time / 90% tools. These percentages are fictional planning assumptions.`;
  }
  function renderDonut() {
    const parts=[['Remaining labor',result.remainingLabor,'#a5b88d'],['Remaining tools',result.remainingTools,'#d7dfca'],['Relay subscription',result.subscription,'#718cec'],['One-time setup',result.setup,'#b4c5f5']];
    let offset=0;
    $('cost-donut').innerHTML=parts.map(([,value,color]) => {
      const width=value/result.projected*100, circle=`<circle cx="60" cy="60" r="44" pathLength="100" stroke="${color}" stroke-dasharray="${width} ${100-width}" stroke-dashoffset="${-offset}" transform="rotate(-90 60 60)"/>`;
      offset+=width; return circle;
    }).join('')+'<text x="60" y="58" text-anchor="middle" fill="#849c6d" stroke="none" style="font:9px Inter,Arial,sans-serif">FIRST</text><text x="60" y="72" text-anchor="middle" fill="#849c6d" stroke="none" style="font:9px Inter,Arial,sans-serif">YEAR</text>';
    $('cost-donut').setAttribute('aria-label',`First-year projected cost: ${parts.map(([label,value]) => `${label} ${money(value)}`).join(', ')}`);
    $('cost-legend').innerHTML=parts.map(([label,value,color]) => `<div class="legend-line"><i style="background:${color}"></i><span>${label}</span><strong>${money(value)}</strong></div>`).join('');
  }
  function renderTimeline() {
    const low=Math.min(-result.setup,result.net,0), high=Math.max(-result.setup,result.net,0);
    const y=(value) => 140-(value-low)/(high-low)*110, x=(month) => 35+month*77.5;
    const points=result.timeline.map(({month,value}) => `${x(month)},${y(value)}`);
    const zero=y(0);
    $('roi-timeline').innerHTML=`<path d="M35 ${zero}H965" stroke="#d7e1cc" stroke-dasharray="4 5"/><path d="M${x(0)} ${zero}L${points.join('L')}L${x(12)} ${zero}Z" fill="#edf1ff" stroke="none"/><path d="M${points.join('L')}" stroke="#718cea" stroke-width="2.5"/><circle cx="${x(12)}" cy="${y(result.net)}" r="4" fill="#315be6" stroke="#fff" stroke-width="2"/>${[0,3,6,9,12].map((month) => `<text x="${x(month)}" y="166" text-anchor="${month===0?'start':month===12?'end':'middle'}">${month===0?'Setup':`Month ${month}`}</text>`).join('')}<text x="35" y="${Math.max(14,y(-result.setup)-10)}">${money(-result.setup)} setup</text><text x="965" y="${Math.max(14,y(result.net)-10)}" text-anchor="end">${money(result.net)} net</text>`;
    $('roi-timeline').setAttribute('aria-label',`Cumulative modeled value begins at ${money(-result.setup)} after setup and ends at ${money(result.net)} in month twelve.`);
    $('timeline-summary').textContent=result.payback===null?'Recurring modeled benefit does not cover the subscription; setup does not pay back.':result.payback>12?`Setup payback is beyond the first year: ${result.payback.toFixed(1)} months.`:result.payback<.1?'Modeled setup break-even in less than 0.1 months.':`Modeled setup break-even after ${result.payback.toFixed(1)} months.`;
  }
  function renderResults() {
    $('results-context').textContent=`${industries[input.industry].label} · ${number(input.team)} participating people · USD`;
    document.querySelector('.result-banner').dataset.loss=result.net<0;
    $('net-label').textContent=result.net<0?'ADDITIONAL ANNUAL MODELED COST':'YOUR ANNUAL SAVINGS POTENTIAL';
    $('annual-savings').textContent=money(result.net); $('result-hours').textContent=number(result.timeSaved);
    $('result-roi').textContent=percent(result.roi);
    $('result-payback').textContent=result.payback===null?'Not reached':`${paybackNumber(result.payback)} mo`;
    $('payback-note').textContent=result.payback===null?'no positive recurring net benefit':result.payback>12?'beyond the first year':'one-time setup recovered';
    $('before-cost').textContent=money(result.current); $('after-cost').textContent=money(result.projected);
    const scale=Math.max(result.current,result.projected,1);
    $('before-bar').style.width=`${result.current/scale*100}%`; $('after-bar').style.width=`${result.projected/scale*100}%`;
    renderDonut(); renderTimeline();
    $('recommended-title').textContent=`Meet your match: ${result.plan.name}.`;
    $('recommended-description').textContent=`Suggested for a company of ${cohorts[input.cohort].label.toLowerCase()}. ${number(result.seats)} billable seats at $${result.plan.seat}/seat/month (${result.plan.minimum}-seat minimum), plus $2,400 setup. Fictional pricing; includes a full year of fees.`;
    const features={time:'Repeatable task automations',cost:'One shared workflow hub',accuracy:'Validation and audit trails',scale:'Reusable team workflows'};
    const selected=[...new Set([...input.goals,'time','accuracy','scale'])].slice(0,3);
    $('recommended-features').innerHTML=selected.map((goal) => `<span>${icon('check')}${features[goal]}</span>`).join('');
    $('example-story').textContent=`Imagine ${number(input.team)} people finding ${number(result.timeSaved/52)} hours of combined team capacity each week. More room for thoughtful work, with ${result.plan.name} in this illustrative scenario.`;
    $('scenario-context').textContent=`${industries[input.industry].label}: compare modeled recovery, not measured peer performance.`;
    $('scenario-grid').innerHTML=[['Conservative',.35,.4],['Your planning case',result.recovery,.7],['Ambitious',.75,.9]].map(([label,recovery,consolidation]) => {
      const value=calculate(input,{recovery,consolidation});
      return `<article class="scenario" data-loss="${value.net<0}"><span>${label}</span><strong>${money(value.net)}</strong><p>${Math.round(recovery*100)}% task-time recovery · ${Math.round(consolidation*100)}% tool replacement<br>${value.net<0?'Additional modeled cost':'First-year net value'}; all Relay fees and setup included.</p></article>`;
    }).join('');
    const lines=[['Recovered labor capacity value',result.laborSaved],['Tool consolidation',result.toolsSaved],['Additional error-reduction credit',0],['Annual Relay subscription',-result.subscription],['One-time setup',-result.setup],['First-year net value',result.net]];
    $('breakdown-table').innerHTML=lines.map(([label,value],index) => `<div${index===lines.length-1?' class="total"':''}><span>${label}</span><strong>${precise.format(value)}</strong></div>`).join('')+`<p>${number(result.timeSaved)} recovered hours are already included in labor capacity value. Time is counted once; accuracy benefits have no extra dollar credit. Figures use unrounded arithmetic; displayed currency is rounded.</p>`;
    $('trial-plan').textContent=`Sample recommendation: ${result.plan.name} · ${number(result.seats)} billable seats · ${money(result.subscription/12)}/month plus setup.`;
  }
  function update(animate=true) {
    const cohort=Number($('company-size').value);
    $('team').max=cohorts[cohort].max;
    $('size-label').textContent=cohorts[cohort].label;
    $('company-size').setAttribute('aria-valuetext',cohorts[cohort].label);
    $('company-size').style.background=`linear-gradient(to right,#315be6 ${cohort/4*100}%,#e6ebdf ${cohort/4*100}%)`;
    $('team-hint').textContent=`Include 1–${number(cohorts[cohort].max)} people involved in this workflow. Model uses 52 weeks per year.`;
    const values=read(), error=validate(values);
    document.querySelector('.live-card').dataset.invalid=Boolean(error);
    $('calculator-status').textContent=error;
    $('live-note').textContent=error?`Last valid estimate. ${error}`:'Includes subscription and one-time setup. Capacity value, not a promise of cash savings.';
    document.querySelectorAll('#results button').forEach((button) => { button.disabled=Boolean(error); });
    if (error) {
      if (completed) $('results-context').textContent=`Last valid estimate — ${error}`;
      return false;
    }
    input=values; result=calculate(input); renderLive(animate); renderResults(); return true;
  }
  $('calculator-form').addEventListener('input',() => { interacted=true; update(); });
  $('calculator-form').onsubmit=(event) => { event.preventDefault(); $('next').click(); };
  $('next').onclick=() => {
    if (!validStep()) return;
    interacted=true;
    if (step<2) { visited=Math.max(visited,step+1); showStep(step+1); return; }
    if (!requireValid() || !update(false)) return;
    completed=true; $('results').hidden=false;
    $('results').scrollIntoView({behavior:'instant'}); $('results-title').focus({preventScroll:true});
  };
  $('back').onclick=() => showStep(Math.max(0,step-1));
  document.querySelectorAll('[data-step]').forEach((button) => { button.onclick=() => { if (Number(button.dataset.step)<=visited) showStep(Number(button.dataset.step)); }; });
  function syncSaved() {
    try { const exists=localStorage.getItem(key)!==null; $('load-estimate').hidden=!exists; $('remove-estimate').hidden=!exists; }
    catch { $('load-estimate').hidden=true; $('remove-estimate').hidden=true; }
  }
  function save() {
    if (!requireValid()) return false;
    try {
      localStorage.setItem(key,JSON.stringify({version:1,input:read()})); converted=true; syncSaved();
      $('save-status').textContent='Saved locally. Contact fields and free text are excluded.'; return true;
    } catch { $('save-status').textContent='This browser blocked local storage. Use Share estimate to keep a link instead.'; return false; }
  }
  $('save-estimate').onclick=save;
  $('load-estimate').onclick=() => {
    try {
      const saved=JSON.parse(localStorage.getItem(key));
      if (saved?.version!==1 || validate(saved.input)) throw Error('Invalid saved estimate');
      apply(saved.input); interacted=true; $('save-status').textContent='Saved estimate loaded. Existing free-text context was left unchanged.';
      if (completed) renderResults();
    } catch { $('save-status').textContent='Saved estimate could not be read. Remove it or use the calculator inputs.'; }
  };
  $('remove-estimate').onclick=() => {
    try { localStorage.removeItem(key); syncSaved(); $('save-status').textContent='Saved estimate removed from this browser.'; }
    catch { $('save-status').textContent='This browser blocked changes to local storage.'; }
  };
  $('reset-estimate').onclick=() => {
    apply(defaults); $('current-solution').value=''; completed=false; visited=0; interacted=false; converted=false; showStep(0); $('results').hidden=true; $('save-status').textContent='Inputs reset. A separately saved estimate is preserved.';
    const url=new URL(location.href); url.search=''; url.hash='calculator'; history.replaceState(null,'',url);
  };
  $('share-results').onclick=async () => {
    if (!requireValid()) return;
    const url=new URL(location.href); url.search=''; url.hash='results';
    for (const [name,value] of Object.entries(input)) url.searchParams.set(name,Array.isArray(value)?value.join(','):String(value));
    $('share-link').value=url.href; $('share-status').textContent='Only numeric inputs, industry and priorities are included. Copy this link; it contains your modeled business inputs, but no contact fields or free text.';
    $('share-dialog').showModal();
    try { await navigator.clipboard.writeText(url.href); $('share-status').textContent='Estimate link copied. It includes numeric inputs, industry and priorities—not contact details or free text.'; }
    catch { $('share-link').focus(); $('share-link').select(); }
  };
  function download(name,content,type) {
    const url=URL.createObjectURL(new Blob([content],{type})); urls.add(url);
    const link=document.createElement('a'); link.href=url; link.download=name; document.body.append(link); link.click(); link.remove();
    setTimeout(() => { URL.revokeObjectURL(url); urls.delete(url); },30000);
  }
  function documentHTML(title,content) {
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'"><title>${escape(title)}</title><style>body{font:15px/1.8 Arial,sans-serif;max-width:760px;margin:40px auto;padding:0 24px;color:#25345d}h1{font-size:32px}table{width:100%;border-collapse:collapse}td{padding:10px 0;border-bottom:1px solid #ddd}td:last-child{text-align:right}small{color:#667}h2{font-size:21px;margin-top:30px}@media print{body{margin:0}}</style></head><body><p>RELAY / A FICTIONAL PRODUCT</p><h1>${escape(title)}</h1>${content}<p><small>Generated locally ${escape(new Date().toISOString())}. No email was sent. Values are illustrative planning estimates in USD, not a quote, measured customer result or guaranteed cash saving.</small></p></body></html>`;
  }
  $('report-form').onsubmit=(event) => {
    event.preventDefault(); if (!requireValid()) return;
    const fields=new FormData($('report-form'));
    const personal=[['Prepared for',String(fields.get('name')).trim()],['Company',String(fields.get('company')).trim()]].filter(([,value]) => value).map(([label,value]) => `<p>${label}: ${escape(value)}</p>`).join('');
    const rows=[['Current annual resource cost',result.current],['Projected first-year resource cost',result.projected],['Recovered labor capacity value',result.laborSaved],['Tool consolidation benefit',result.toolsSaved],['Annual subscription',result.subscription],['One-time setup',result.setup],['First-year net value',result.net]];
    const content=`${personal}<p>${escape(industries[input.industry].label)} · ${number(input.team)} participating people · ${escape(cohorts[input.cohort].label)}</p><table>${rows.map(([label,value]) => `<tr><td>${label}</td><td>${precise.format(value)}</td></tr>`).join('')}</table><h2>Inputs &amp; assumptions</h2><p>${input.hours} task hours per person per week; ${precise.format(input.rate)}/hour; ${precise.format(input.tools)}/month in existing tools. 52 weeks; ${Math.round(result.recovery*100)}% task-time recovery; 70% tool-cost replacement. ${number(result.seats)} billable seats × $${result.plan.seat}/month. Recovered hours: ${number(result.timeSaved)}. First-year ROI: ${percent(result.roi)}. Setup payback: ${result.payback===null?'not reached':`${escape(paybackNumber(result.payback))} months`}.</p><p>Labor is recovered capacity, not guaranteed payroll savings. Time is counted once. Accuracy improvements have no extra dollar credit. Scenarios and plans are fictional; taxes, financing, ramp-up and ongoing administration are excluded. Email, phone and free-text workflow context are excluded from this file.</p>`;
    download('relay-savings-report.html',documentHTML('Your Relay savings estimate',content),'text/html;charset=utf-8');
    converted=true; $('report-status').textContent='HTML report prepared locally. No email was sent and no contact record was stored.';
  };
  let printWasOpen=false;
  addEventListener('beforeprint',() => { printWasOpen=document.querySelector('.breakdown').open; document.querySelector('.breakdown').open=true; });
  addEventListener('afterprint',() => { document.querySelector('.breakdown').open=printWasOpen; });
  $('print-report').onclick=() => { if (requireValid()) window.print(); };
  $('trial-form').onsubmit=(event) => {
    event.preventDefault();
    const name=$('workspace-name').value.trim();
    if (name.length<2) { $('workspace-name').setCustomValidity('Use at least two nonblank characters.'); $('workspace-name').reportValidity(); return; }
    $('trial-preview').hidden=false;
    $('trial-preview').innerHTML=`<h3>${escape(name)} is ready to explore.</h3><p>Your local ${escape(result.plan.name)} onboarding preview:</p><ul><li>Map one repetitive workflow.</li><li>Pick a sample trigger and a clear handoff.</li><li>Compare actual time before choosing a service.</li></ul><p>This is a sample checklist, not a created account or active trial.</p>`;
    converted=true;
  };
  $('workspace-name').oninput=() => $('workspace-name').setCustomValidity('');
  const localDate=(value) => `${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')}T${String(value.getHours()).padStart(2,'0')}:${String(value.getMinutes()).padStart(2,'0')}`;
  function prepareDate() {
    const now=new Date(), next=new Date(now); next.setDate(next.getDate()+1); next.setHours(10,0,0,0);
    $('demo-date').min=localDate(new Date(now.getTime()+60000)); $('demo-date').max=localDate(new Date(now.getTime()+365*86400000));
    if (!$('demo-date').value || new Date($('demo-date').value)<=now) $('demo-date').value=localDate(next);
    $('timezone-note').textContent=`Times use your browser zone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}. A personal reminder, not a booking.`;
  }
  $('demo-date').oninput=() => $('demo-date').setCustomValidity('');
  $('schedule-form').onsubmit=(event) => {
    event.preventDefault();
    const start=new Date($('demo-date').value), now=Date.now();
    if (!Number.isFinite(start.getTime()) || start.getTime()<=now || start.getTime()>now+365*86400000) { $('demo-date').setCustomValidity('Choose a future time within one year.'); $('demo-date').reportValidity(); return; }
    const icsTime=(value) => value.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
    const content=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Relay Concept//Personal Reminder//EN','BEGIN:VEVENT',`UID:relay-${now}@demo.invalid`,`DTSTAMP:${icsTime(new Date(now))}`,`DTSTART:${icsTime(start)}`,`DTEND:${icsTime(new Date(start.getTime()+30*60000))}`,'SUMMARY:Explore Relay demo - personal reminder','DESCRIPTION:Local reminder only. No meeting has been booked and no invitation sent.','END:VEVENT','END:VCALENDAR',''].join('\r\n');
    download('relay-demo-reminder.ics',content,'text/calendar;charset=utf-8'); converted=true;
    $('schedule-status').textContent='Personal calendar reminder prepared. No meeting was booked or invitation sent.';
  };
  $('guide-form').onsubmit=(event) => {
    event.preventDefault();
    const content='<p>A practical checklist for a more useful ROI conversation.</p><h2>1. Define one workflow</h2><p>Record the people involved, task hours per person and a fully loaded hourly cost. Separate team tool costs from seat costs.</p><h2>2. Measure before you model</h2><p>Keep a short baseline log. Test conservative recovery, implementation effort, learning curves and ongoing administration.</p><h2>3. Count each benefit once</h2><p>Recovered hours are capacity, not automatic payroll savings. Add cash savings only when spending actually changes. Include recurring subscriptions, minimum seats and setup.</p><h2>4. Compare real evidence</h2><p>Ask for a pilot and independently verifiable references. Use a range of outcomes, not only a headline ROI. This Relay prototype has fictional assumptions and no measured customer case studies.</p>';
    download('relay-roi-guide.html',documentHTML('A little guide to a better ROI conversation',content),'text/html;charset=utf-8');
    converted=true; $('guide-status').textContent='Guide prepared locally. No email was sent or newsletter subscription created.';
  };
  document.addEventListener('click',(event) => {
    const button=event.target.closest('button');
    if (!button || button.disabled) return;
    if (button.hasAttribute('data-close')) { button.closest('dialog').close(); return; }
    if (button.dataset.open) {
      if (!requireValid()) return;
      if (button.dataset.open==='schedule-dialog') prepareDate();
      $(button.dataset.open).showModal();
    }
  });
  for (const id of ['report-dialog','trial-dialog','schedule-dialog']) $(id).addEventListener('close',() => {
    const form=$(id).querySelector('form'); form.reset();
    form.querySelectorAll('input').forEach((field) => field.setCustomValidity(''));
    if (id==='trial-dialog') { $('trial-preview').hidden=true; $('trial-preview').replaceChildren(); }
    if (id==='report-dialog') $('report-status').textContent='';
    if (id==='schedule-dialog') $('schedule-status').textContent='';
  });
  document.addEventListener('mouseout',(event) => {
    if (event.relatedTarget || event.clientY>0 || !matchMedia('(pointer:fine)').matches || !interacted || converted || exitSeen || document.querySelector('dialog[open]')) return;
    exitSeen=true; $('exit-dialog').showModal();
  });
  $('exit-save').onclick=() => { if (save()) { $('exit-dialog').close(); toast('Estimate saved on this device. Contact data was excluded.'); } else $('exit-status').textContent=$('save-status').textContent; };
  function info(title,content) { $('info-title').textContent=title; $('info-content').innerHTML=content; $('info-dialog').showModal(); }
  $('privacy').onclick=() => info('Your inputs stay your inputs.','<p>All calculator logic, form checks and downloads run in this browser. No contact data, orders or trial request is sent to a service. Closing a contact dialog clears its fields.</p><p>Save explicitly stores numeric inputs, industry and goals on this device. Remove saved estimate clears that record. Share links include the same inputs; share them only where you want your business estimates seen.</p><p>Contact details and free-text workflow context are excluded from storage and links. Your optional report name and company appear only in the downloaded report. Hosting providers may keep normal access logs.</p>');
  $('about').onclick=() => info('An idea called Relay.','<p>Relay is a fictional workflow-automation concept. Its plans, company names, scenarios and adoption assumptions are illustrative, not claims about real customers or measured industry performance.</p><p>This independent static page pairs a working calculator with local report, guide and calendar downloads. There is no backend, sales team, account service or real free trial.</p><p>Original SVG artwork, Inter typography and Lucide icons are served locally. Font and icon licenses are included with the assets.</p>');
  $('mobile-menu').onclick=() => { const open=$('mobile-nav').hidden; $('mobile-nav').hidden=!open; $('mobile-menu').setAttribute('aria-expanded',String(open)); $('mobile-menu').setAttribute('aria-label',open?'Close navigation':'Open navigation'); };
  $('mobile-nav').onclick=() => { $('mobile-nav').hidden=true; $('mobile-menu').setAttribute('aria-expanded','false'); $('mobile-menu').setAttribute('aria-label','Open navigation'); };
  addEventListener('pagehide',(event) => { if (!event.persisted) { urls.forEach((url) => URL.revokeObjectURL(url)); urls.clear(); frames.forEach((frame) => cancelAnimationFrame(frame)); } });
  syncSaved(); apply(defaults); showStep(0);
  const params=new URL(location.href).searchParams;
  if (params.has('cohort')) {
    const shared={cohort:Number(params.get('cohort')),industry:params.get('industry'),goals:params.get('goals')?params.get('goals').split(','):[]};
    for (const name of ['hours','rate','tools','team']) shared[name]=params.get(name)===null || params.get(name)===''?NaN:Number(params.get(name));
    if (!validate(shared)) {
      apply(shared); completed=true; visited=2; showStep(2); $('results').hidden=false;
      requestAnimationFrame(() => { $('results').scrollIntoView({behavior:'instant'}); $('results-title').focus({preventScroll:true}); });
    } else toast('The shared estimate is incomplete or invalid. Showing the default inputs.');
  }
})();
