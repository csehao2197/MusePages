'use strict';
(() => {
  const D=window.cloudSyncData,$=(id) => document.getElementById(id);
  const escape=(value) => String(value).replace(/[&<>"']/g,(char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const icon=(name) => `<svg aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
  const names={operational:'Operational',degraded:'Degraded performance',outage:'Outage',maintenance:'Maintenance'};
  const component=(id) => D.components.find((item) => item.id===id);
  const aggregate=(records) => records.reduce((sum,record) => ({observed:sum.observed+record.observed,unavailable:sum.unavailable+record.unavailable}),{observed:0,unavailable:0});
  const availability=(records) => {const total=aggregate(records);return total.observed?100*(total.observed-total.unavailable)/total.observed:100;};
  const dateLabel=(date,options={month:'short',day:'numeric',year:'numeric'}) => new Date(date+'T12:00:00Z').toLocaleDateString('en-US',{...options,timeZone:'UTC'});
  const duration=(minutes) => minutes>=60?`${Math.floor(minutes/60)}h${minutes%60?` ${minutes%60}m`:''}`:`${minutes} min`;
  const timeLabel=(time) => {const [h,m]=time.split(':');return `${Number(h)%12 || 12}:${m} ${Number(h)>=12?'PM':'AM'} UTC`;};
  const weekly=(records) => Array.from({length:Math.ceil(records.length/7)},(_,index) => {
    const group=records.slice(index*7,index*7+7),notes=[...new Set(group.filter((record) => record.event).map((record) => record.note))];
    return {...aggregate(group),date:group[0].date,lastDate:group.at(-1).date,maintenance:group.some((record) => record.maintenance),note:notes.join(' ') || 'No incidents reported.'};
  });
  const groups=(id,mode) => mode==='weekly'?weekly(D.history[id]):mode==='recent'?D.history[id].slice(-7):D.history[id];
  const recordStatus=(record) => record.maintenance && !record.unavailable?'maintenance':availability([record])===100?'operational':availability([record])>=99?'degraded':'outage';
  let scenario='operational';
  function readScenario() {const value=new URLSearchParams(location.search).get('scenario');scenario=['webhooks','outage','maintenance'].includes(value)?value:'operational';$('scenario').value=scenario;}
  function stateFor(id) {return scenario==='webhooks' && id==='webhooks'?'degraded':scenario==='outage' && ['web','api','mobile'].includes(id)?'outage':scenario==='maintenance' && id==='database'?'maintenance':'operational';}
  function bars(id,mode) {
    return groups(id,mode).map((record,index) => {
      const date=record.lastDate?`${dateLabel(record.date)} – ${dateLabel(record.lastDate)}`:dateLabel(record.date),percentage=availability([record]).toFixed(5);
      return `<button type="button" class="bar ${recordStatus(record)}" data-bar="${id}:${mode}:${index}" tabindex="${index===0?'0':'-1'}" aria-label="${escape(component(id).name)}: ${date}, ${percentage}% uptime. ${escape(record.note)}"></button>`;
    }).join('');
  }
  function renderComponents() {
    const expanded=new Set([...document.querySelectorAll('.component[open]')].map((element) => element.dataset.component));
    $('components').innerHTML=D.components.map((item) => {
      const state=stateFor(item.id);
      return `<details class="component" data-component="${item.id}"${expanded.has(item.id)?' open':''}><summary><span class="component-name">${icon(item.icon)}${escape(item.name)}</span><span class="component-state ${state}"><i class="dot ${state}"></i>${names[state]} ${icon('chevron-down')}</span></summary><div class="component-details"><div class="subcomponents">${item.parts.map((part,index) => {const status=index===0?state:'operational';return `<div><span>${escape(part)}</span><span class="${status}"><i class="dot ${status}"></i>${names[status]}</span></div>`;}).join('')}</div><div class="recent-label"><span>LAST 7 COMPLETE DAYS</span><strong>${availability(D.history[item.id].slice(-7)).toFixed(2)}% availability</strong></div><div class="bar-group recent-bars" data-chart-mode="recent">${bars(item.id,'recent')}</div><div class="recent-dates"><span>Mar 6</span><span>Mar 12</span></div></div></details>`;
    }).join('');
    $('healthy-count').textContent=`${D.components.filter((item) => stateFor(item.id)==='operational').length} of 10 operational`;
  }
  function timeline(updates) {
    return `<ol class="timeline">${updates.map(([time,state,text]) => `<li><time>${timeLabel(time)}</time><div><strong class="${state.toLowerCase()}">${state}</strong><p>${escape(text)}</p></div></li>`).join('')}</ol>`;
  }
  function renderCurrent() {
    const state=scenario==='webhooks'?'degraded':scenario==='outage'?'outage':scenario==='maintenance'?'maintenance':'operational';
    const titles={operational:'All Systems Operational',webhooks:'Partial System Outage',outage:'Major System Outage',maintenance:'Scheduled Maintenance in Progress'};
    const descriptions={operational:'All 10 services are running as expected.',webhooks:'Webhook deliveries are delayed. All other services are operational.',outage:'US-East web and API gateways are affected. Recovery is in progress.',maintenance:'Primary database maintenance is in progress. Replicas remain available.'};
    $('status-banner').className=`status-banner ${state}`;$('banner-title').textContent=titles[scenario];$('banner-detail').textContent=descriptions[scenario];
    $('banner-icon').innerHTML=icon(state==='operational'?'circle-check':state==='outage'?'circle-alert':state==='maintenance'?'wrench':'triangle-alert');
    renderComponents();
    const incident=D.active[scenario];
    $('active-count').textContent=incident?'1 OPEN INCIDENT':'NO OPEN INCIDENTS';
    if (!incident) {$('active-incidents').innerHTML=`<div class="no-incidents">${icon('circle-check')}<div><strong>No active incidents</strong><p>${scenario==='maintenance'?'The sample database maintenance is planned work, not an unplanned incident.':'Everything is looking good. We’ll keep this space for the updates that matter.'}</p></div></div>`;return;}
    const steps=['Investigating','Identified','Monitoring','Resolved'];
    $('active-incidents').innerHTML=`<article class="incident-card ${state}"><div class="incident-card-top"><span class="severity">${incident.severity} incident</span><span class="mono">ONGOING · ${duration(incident.duration)}</span></div><h3>${incident.title}</h3><div class="incident-meta"><span>Started ${dateLabel(incident.date)} at ${timeLabel(incident.start)}</span><span>Affected: ${incident.components.map((id) => component(id).name).join(', ')}</span></div><ol class="progression" aria-label="Incident progression">${steps.map((step,index) => `<li class="${index<=incident.stage?'complete':''}"${index===incident.stage?' aria-current="step"':''}><i>${index<incident.stage?icon('check'):index+1}</i><span>${step}</span></li>`).join('')}</ol>${timeline(incident.updates)}</article>`;
  }
  function renderUptime() {
    const all=Object.values(D.history).flat(),total=availability(all).toFixed(2);
    $('overall-uptime').innerHTML=`${total}<span>%</span>`;$('uptime-badge').textContent=`${total}% over 90 days`;
    $('uptime-rows').innerHTML=D.components.map((item) => `<div class="uptime-row" data-uptime="${item.id}"><div class="uptime-label"><strong>${escape(item.name)}</strong><span>${availability(D.history[item.id]).toFixed(2)}<small>% uptime</small></span></div><div class="bar-group daily-bars" data-chart-mode="daily">${bars(item.id,'daily')}</div><div class="bar-group weekly-bars" data-chart-mode="weekly">${bars(item.id,'weekly')}</div></div>`).join('');
  }
  function pastIncident(incident) {
    return `<details class="past-incident" data-history-incident="${incident.id}"><summary><span class="resolved-badge">Resolved</span><div><h3>${escape(incident.title)}</h3><p>${escape(component(incident.component).name)} <i>·</i> Duration ${duration(incident.duration)} ${icon('chevron-down')}</p></div></summary><div class="past-content"><p>${escape(incident.summary)}</p>${timeline(incident.updates)}${incident.id==='api-response-times'?`<button class="text-link" data-event="${incident.id}">Read post-mortem ${icon('arrow-right')}</button>`:''}</div></details>`;
  }
  function renderHistory() {
    const dates=Array.from({length:14},(_,index) => new Date(D.end-index*D.day).toISOString().slice(0,10));
    $('history-list').innerHTML=dates.map((date,index) => {
      const incidents=D.incidents.filter((item) => item.date===date);
      if (!incidents.length && index!==0 && !$('show-quiet').checked) return '';
      return `<div class="history-day"><time>${dateLabel(date)}</time><div>${incidents.length?incidents.map(pastIncident).join(''):'<p class="quiet-day"><i class="dot operational"></i> No incidents reported</p>'}</div></div>`;
    }).join('');
  }
  function sparkline(values,label) {
    const min=Math.min(...values),max=Math.max(...values),points=values.map((value,index) => `${(index*240/(values.length-1)).toFixed(1)},${(57-(value-min)/(max-min || 1)*43).toFixed(1)}`).join(' ');
    return `<svg class="sparkline" viewBox="0 0 240 65" role="img" aria-label="${label}"><path d="M0 58H240M0 31H240" stroke="#edf1f6" stroke-width="1"/><polyline points="${points}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function renderMetrics() {
    const average=Math.round(D.average.reduce((sum,value) => sum+value,0)/D.average.length);
    $('metrics-grid').innerHTML=[
      ['API response time',`${average}<small>ms avg</small>`,'24-hour hourly mean','p50 <b>32ms</b> <i>·</i> p95 <b>89ms</b> <i>·</i> p99 <b>142ms</b>',D.average,'API hourly mean response time, ranging from 29 to 67 milliseconds.'],
      ['Error rate',`${D.errors.at(-1).toFixed(2)}<small>%</small>`,'Latest hourly sample','<span class="metric-ok"><i class="dot operational"></i> Below 0.10% threshold</span>',D.errors,'Hourly error rate trending from 0.07 percent to 0.02 percent.'],
      ['Throughput',`${D.throughput.at(-1).toFixed(1)}<small>K req/s</small>`,'Latest hourly sample',`Peak <b>${Math.max(...D.throughput).toFixed(1)}K req/s</b>`,D.throughput,'Hourly throughput with a peak of 18.2 thousand requests per second.']
    ].map(([label,value,note,foot,values,description]) => `<article class="metric-card"><h3>${label}</h3><strong class="metric-value">${value}</strong><span>${note}</span>${sparkline(values,description)}<div class="metric-foot">${foot}</div></article>`).join('');
    $('metric-data').innerHTML=D.average.map((value,index) => `<tr><th>${new Date(D.snapshot-(23-index)*3600000).toISOString().slice(0,13).replace('T',' ')}:00</th><td>${value}</td><td>${D.errors[index].toFixed(2)}</td><td>${D.throughput[index].toFixed(1)}</td></tr>`).join('');
  }
  function details(title,content,label='A CLOSER LOOK') {
    hideTooltip();$('detail-title').textContent=title;$('detail-label').textContent=label;$('detail-content').innerHTML=content;
    if (!$('detail-dialog').open) $('detail-dialog').showModal();$('detail-dialog').scrollTop=0;
  }
  function eventDetails(id) {
    const incident=D.incidents.find((item) => item.id===id);if (!incident) return;
    const post=incident.id==='api-response-times'?'<h3>What happened</h3><p>A sample gateway deployment reduced connection-pool capacity, leading to elevated response times. The 45-minute incident included eight unavailable minutes.</p><h3>What we changed</h3><p>The prior pool configuration was restored and queue pressure was reduced. The example follow-up adds a canary capacity check, a staged pool-size rollout and an alert on connection wait time.</p><h3>What we learned</h3><p>Capacity checks should include sustained concurrent requests, not only average throughput. This is a fictional learning record, not an analysis of a real outage.</p>':'';
    details(incident.title,`<p class="detail-meta">${dateLabel(incident.date)} · ${escape(component(incident.component).name)} · Resolved</p><p>${escape(incident.summary)}</p><dl class="incident-facts"><div><dt>Incident duration</dt><dd>${duration(incident.duration)}</dd></div><div><dt>Unavailable minutes</dt><dd>${incident.unavailable} min</dd></div><div><dt>Daily availability</dt><dd>${availability([D.history[incident.component].find((record) => record.date===incident.date)]).toFixed(5)}%</dd></div></dl>${timeline(incident.updates)}${post}`,'RESOLVED · FICTIONAL INCIDENT RECORD');
  }
  function barRecord(button) {const [id,mode,index]=button.dataset.bar.split(':');return {id,record:groups(id,mode)[Number(index)]};}
  function barDetails(button) {
    const {id,record}=barRecord(button),total=aggregate([record]);
    details(component(id).name,`<p class="detail-meta">${dateLabel(record.date)}${record.lastDate?` – ${dateLabel(record.lastDate)}`:''} · UTC</p><strong class="detail-availability">${availability([record]).toFixed(5)}<small>% availability</small></strong><dl class="incident-facts"><div><dt>Observed minutes</dt><dd>${total.observed.toLocaleString('en-US')}</dd></div><div><dt>Unavailable minutes</dt><dd>${total.unavailable}</dd></div></dl><p>${escape(record.note)}</p><p class="sample-disclosure">Calculated from the local sample record. This is not live service telemetry.</p>${record.event?`<button class="text-link" data-event="${record.event}">Open incident record ${icon('arrow-right')}</button>`:''}`,'HISTORICAL AVAILABILITY');
  }
  function hideTooltip() {$('bar-tooltip').hidden=true;}
  function showTooltip(button) {
    if (document.querySelector('dialog[open]')) return;
    const {id,record}=barRecord(button),tip=$('bar-tooltip'),rect=button.getBoundingClientRect();
    tip.textContent=`${component(id).name} · ${dateLabel(record.date)}${record.lastDate?` – ${dateLabel(record.lastDate)}`:''} · ${availability([record]).toFixed(5)}% uptime. ${record.note}`;
    tip.hidden=false;tip.style.left=`${Math.max(8,Math.min(innerWidth-tip.offsetWidth-8,rect.left-120))}px`;tip.style.top=`${Math.max(8,Math.min(innerHeight-tip.offsetHeight-8,rect.top-tip.offsetHeight-10))}px`;
  }
  function archive() {
    const query=$('archive-search').value.trim().toLowerCase(),list=D.incidents.filter((incident) => `${incident.title} ${component(incident.component).name}`.toLowerCase().includes(query));
    $('archive-count').textContent=`${list.length} ${list.length===1?'incident':'incidents'} in the 90-day sample`;
    $('archive-list').innerHTML=list.length?list.map((incident) => `<button class="archive-item" data-event="${incident.id}"><time>${dateLabel(incident.date)}</time><strong>${escape(incident.title)}</strong><span>${escape(component(incident.component).name)} · ${duration(incident.duration)} ${icon('arrow-up-right')}</span></button>`).join(''):'<p class="archive-empty">No incidents match this search. Try another title or service.</p>';
  }
  const notes={
    home:['CloudSync, in concept.','CloudSync is a fictional cloud collaboration service. This static page demonstrates transparent service health, with local fixtures rather than a connected product or monitor.'],
    api:['API documentation','No live CloudSync API is connected. Component status and metrics come from assets/data.js. The downloadable RSS document is a genuine static sample feed, with fictional .example links and no polling or credentials.'],
    support:['A clear record is the first step.','This concept has no support inbox or ticketing service. Explore a service, its availability bars and incident timelines for the available sample context. No personal information is collected.'],
    privacy:['Status information. Not your information.','There are no cookies, analytics or browser-storage writes. Email is validated on your device and cleared after the local preview. Notification preferences stay in memory and disappear on reload. Scenario selection is reflected in the page URL; email addresses are not. Downloads stay on your device.'],
    social:['A sample social channel','@CloudSyncStatus is an illustrative handle from the original brief, not a verified live account. This page sends no requests to X or any social platform. All available incident updates are included locally.']
  };
  function preferences() {return [$('pref-all').checked?'All incidents':'',$('pref-major').checked?'Only major outages':'',$('pref-maintenance').checked?'Scheduled maintenance':''].filter(Boolean);}
  function slackPreview() {
    const selected=preferences();
    if (!selected.length) {$('subscribe-status').textContent='Select at least one notification preference before previewing Slack.';$('pref-all').focus();return;}
    const incident=D.active[scenario],text=incident?`${incident.severity}: ${incident.title}. ${incident.updates[0][1]} — ${incident.updates[0][2]}`:scenario==='maintenance'?'Planned database maintenance is in progress. Read replicas remain available.':'All Systems Operational. All ten sample services are healthy.';
    details('A little clarity in your channel.',`<p>This is a sample message layout, not a Slack connection. No authorization, workspace access or webhook URL is requested.</p><p><strong>Selected preferences:</strong> ${escape(selected.join(' + '))}</p><div class="slack-message"><span class="slack-avatar">${icon('activity')}</span><div><strong>CloudSync Status <small>APP · 11:57 UTC</small></strong><p>${escape(text)}</p><span>Illustrative current snapshot · not an eligibility-filtered delivery</span></div></div><details class="payload"><summary>View sample message payload</summary><pre>${escape(JSON.stringify({channel:'#status-updates',text,localPreview:true},null,2))}</pre></details><p class="sample-disclosure">No integration or subscription has been created.</p>`,'SLACK · LOCAL PREVIEW ONLY');
  }
  $('scenario').onchange=() => {
    scenario=$('scenario').value;const url=new URL(location.href);if (scenario==='operational') url.searchParams.delete('scenario');else url.searchParams.set('scenario',scenario);history.replaceState(null,'',url);hideTooltip();renderCurrent();
  };
  $('show-quiet').onchange=renderHistory;
  $('full-history').onclick=() => {$('archive-search').value='';archive();$('archive-dialog').showModal();};
  $('archive-search').oninput=archive;
  $('pref-all').onchange=() => {if ($('pref-all').checked) $('pref-major').checked=false;$('subscribe-status').textContent='';};
  $('pref-major').onchange=() => {if ($('pref-major').checked) $('pref-all').checked=false;$('subscribe-status').textContent='';};
  $('pref-maintenance').onchange=() => {$('subscribe-status').textContent='';};
  $('subscribe-form').onsubmit=(event) => {
    event.preventDefault();const input=$('email'),email=input.value.trim(),selected=preferences();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>254) {input.setAttribute('aria-invalid','true');$('subscribe-status').textContent='Enter a valid email address to try the local form.';input.focus();return;}
    if (!selected.length) {$('subscribe-status').textContent='Select at least one notification preference.';$('pref-all').focus();return;}
    input.removeAttribute('aria-invalid');input.value='';$('subscribe-status').textContent=`Preview complete: ${selected.join(' + ')}. No subscription was created, no email was saved and nothing was sent.`;
  };
  $('slack-preview').onclick=slackPreview;
  document.addEventListener('pointerover',(event) => {const bar=event.target.closest('[data-bar]');if (bar) showTooltip(bar);});
  document.addEventListener('pointerout',(event) => {if (event.target.closest('[data-bar]')) hideTooltip();});
  document.addEventListener('focusin',(event) => {const bar=event.target.closest('[data-bar]');if (bar) showTooltip(bar);});
  document.addEventListener('focusout',(event) => {if (event.target.closest('[data-bar]')) hideTooltip();});
  window.addEventListener('scroll',hideTooltip,{passive:true});window.addEventListener('resize',hideTooltip);
  document.addEventListener('keydown',(event) => {
    if (event.key==='Escape') {hideTooltip();const dialogs=[...document.querySelectorAll('dialog[open]')];if (dialogs.length) {event.preventDefault();dialogs.at(-1).close();}}
    const bar=event.target.closest('[data-bar]');if (!bar) return;
    const group=bar.closest('.bar-group'),buttons=[...group.querySelectorAll('[data-bar]')],index=buttons.indexOf(bar);
    let next;
    if (event.key==='ArrowRight') next=buttons[Math.min(buttons.length-1,index+1)];
    if (event.key==='ArrowLeft') next=buttons[Math.max(0,index-1)];
    if (event.key==='Home') next=buttons[0];
    if (event.key==='End') next=buttons.at(-1);
    if (next) {event.preventDefault();buttons.forEach((button) => button.tabIndex=-1);next.tabIndex=0;next.focus();}
  });
  document.body.addEventListener('click',(event) => {
    const close=event.target.closest('[data-close]');if (close) $(close.dataset.close).close();
    const bar=event.target.closest('[data-bar]');if (bar) {bar.closest('.bar-group').querySelectorAll('[data-bar]').forEach((button) => button.tabIndex=-1);bar.tabIndex=0;barDetails(bar);}
    const note=event.target.closest('[data-note]');if (note) {const [title,text]=notes[note.dataset.note];details(title,`<p>${escape(text)}</p>`,'ABOUT THIS CONCEPT');}
    const incident=event.target.closest('[data-event]');if (incident) {if ($('archive-dialog').open) $('archive-dialog').close();eventDetails(incident.dataset.event);}
  });
  function restore() {readScenario();renderCurrent();if (location.hash.startsWith('#incident-')) eventDetails(location.hash.slice(10));}
  window.addEventListener('popstate',restore);window.addEventListener('hashchange',restore);
  renderUptime();renderHistory();renderMetrics();restore();
})();
