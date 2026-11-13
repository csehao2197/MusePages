(() => {
  'use strict';
  const $=(selector,root=document) => root.querySelector(selector);
  const $$=(selector,root=document) => [...root.querySelectorAll(selector)];
  const D=window.editorialProfile;
  const icon=(name) => `<svg aria-hidden="true"><use href="./assets/icons.svg#${name}"></use></svg>`;
  const showMenu=(open) => {
    $('#navigation').classList.toggle('open',open);$('#menu-button').setAttribute('aria-expanded',String(open));$('#menu-button').setAttribute('aria-label',open?'Close navigation':'Open navigation');
  };
  $('#menu-button').addEventListener('click',() => showMenu($('#menu-button').getAttribute('aria-expanded')!=='true'));
  $$('#navigation a').forEach((link) => link.addEventListener('click',() => showMenu(false)));
  document.addEventListener('keydown',(event) => {if(event.key==='Escape' && $('#menu-button').getAttribute('aria-expanded')==='true'){showMenu(false);$('#menu-button').focus();}});
  window.addEventListener('resize',() => {if(innerWidth>600) showMenu(false);});
  $('#skills-list').innerHTML=Object.entries(D.skills).map(([name,items]) => `<div class="skill-group"><h4>${name}</h4><ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul></div>`).join('');
  const historyMarkup=D.experience.map((item) => `<div class="timeline-item"><span>${item.dates}</span><h4>${item.role}<small>${item.company}</small></h4><p>${item.description}</p></div>`).join('');
  $('#experience-list').innerHTML=historyMarkup;
  $('#resume-text').innerHTML=`<h3>${D.name}</h3><p>${D.role}</p><p>FICTIONAL PROFILE — DEMONSTRATION RESUME</p><h4>Profile</h4><p>${D.summary}</p><h4>Illustrative experience</h4>${D.experience.map((item) => `<h5>${item.role} · ${item.company}</h5><p>${item.dates} · ${item.description}</p>`).join('')}<h4>Skills</h4><ul>${Object.entries(D.skills).map(([category,items]) => `<li>${category}: ${items.join(', ')}</li>`).join('')}</ul><h4>Selected explorations</h4><ul>${D.projects.map((project) => `<li>${project.title} — ${project.subtitle}</li>`).join('')}</ul><h4>Contact</h4><p>hello@morganellis.example — reserved example address, not a working mailbox.</p><p>All profile details, companies, roles, dates and projects are fictional. No professional credentials, client results, or employment history are claimed.</p>`;
  let restoring=false;
  const writeHash=(hash) => {const url=new URL(location.href);url.hash=hash;history.replaceState(null,'',url);};
  D.projects.forEach((project) => {
    const element=$(`#project-${project.id}`),content=$('.case-content',element);
    content.innerHTML=`<div class="case-heading"><span>${project.year} / A SELF-DIRECTED EXPLORATION</span><button class="collapse-case">Close case study ${icon('x')}</button></div><div class="case-grid"><div><h4>THE CONTEXT</h4><p>${project.context}</p><h4>ROLE & APPROACH</h4><p>${project.approach}</p></div><div><h4>THE OUTCOME / WHAT I LEARNED</h4><p>${project.outcome}</p><div class="case-outcome"><h4>THE STACK</h4><p>${project.stack.join(' / ')}.<br>Actual prototype: standalone HTML, CSS, and JavaScript. No framework build or runtime service.</p></div></div></div><div class="case-links"><a class="button" href="./assets/demos/${project.demo}" target="_blank" rel="noopener">Try the local prototype ${icon('external-link')}</a><a class="text-link" href="./assets/demos/${project.demo}" download="${project.id}-prototype.html">Download actual source ${icon('download')}</a></div>`;
    $('.collapse-case',element).addEventListener('click',() => {element.open=false;$('summary',element).focus({preventScroll:true});});
    element.addEventListener('toggle',() => {
      $('summary',element).setAttribute('aria-expanded',String(element.open));
      if(element.open){$$('.project').forEach((other) => {if(other!==element) other.open=false;});if(!restoring) writeHash(element.id);}
      else if(location.hash===`#${element.id}` && !restoring) writeHash('projects');
    });
    $('summary',element).setAttribute('aria-expanded','false');
  });
  const restore=() => {
    const target=$$('.project').find((project) => location.hash===`#${project.id}`);
    restoring=true;
    $$('.project').forEach((project) => project.open=project===target);
    restoring=false;
    if(target) requestAnimationFrame(() => target.scrollIntoView({block:'start',behavior:'instant'}));
  };
  window.addEventListener('hashchange',restore);window.addEventListener('popstate',restore);
  const motion=matchMedia('(prefers-reduced-motion: reduce)'),pointer=matchMedia('(hover: hover) and (pointer: fine)'),hero=$('.hero'),figure=$('#hero-figure');
  let frame=0;
  const resetMotion=() => {cancelAnimationFrame(frame);figure.style.transform='';};
  hero.addEventListener('pointermove',(event) => {
    if(motion.matches || !pointer.matches || innerWidth<1024 || event.pointerType==='touch') return;
    const rect=hero.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;
    cancelAnimationFrame(frame);frame=requestAnimationFrame(() => figure.style.transform=`translate3d(${(x*16).toFixed(2)}px,${(y*12).toFixed(2)}px,0) rotate(${(-1.5+x*.8).toFixed(2)}deg)`);
  });
  hero.addEventListener('pointerleave',resetMotion);motion.addEventListener('change',resetMotion);pointer.addEventListener('change',resetMotion);window.addEventListener('resize',resetMotion);
  if('IntersectionObserver' in window){
    const reveal=new IntersectionObserver((entries) => entries.forEach((entry) => {if(entry.isIntersecting){entry.target.classList.add('revealed');reveal.unobserve(entry.target);}}),{threshold:.05});
    $$('[data-reveal]').forEach((section) => reveal.observe(section));
    const nav=new IntersectionObserver((entries) => entries.forEach((entry) => {
      if(entry.isIntersecting) $$('#navigation a').forEach((link) => {if(link.hash===`#${entry.target.id}`) link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    }),{rootMargin:'-15% 0px -65% 0px',threshold:0});
    ['home','about','experience','projects','contact','resume'].forEach((id) => nav.observe($(`#${id}`)));
  }
  const dialog=$('#schedule-dialog'),days=[16,17,18],times=['10:00','14:00','16:30'];
  $('#slots').innerHTML=days.flatMap((day) => times.map((time) => `<label class="slot"><input type="radio" name="slot" value="2026-11-${day}T${time}:00Z" required><span>${day} Nov 2026</span><small>${time}–${time==='16:30'?'17:00':time==='14:00'?'14:30':'10:30'} UTC</small></label>`)).join('');
  $('#schedule-button').addEventListener('click',() => {dialog.showModal();$('.close-dialog',dialog).focus();});
  $('.close-dialog',dialog).addEventListener('click',() => dialog.close());
  dialog.addEventListener('close',() => {$('#schedule-form').reset();$('#schedule-status').textContent='';$('#schedule-button').focus({preventScroll:true});});
  $('#schedule-form').addEventListener('submit',(event) => {
    event.preventDefault();const selected=$('input[name=slot]:checked');
    if(!selected) return;
    const start=new Date(selected.value),end=new Date(start.getTime()+30*60000),icsTime=(date) => date.toISOString().replace(/[-:]/g,'').replace('.000','');
    const calendar=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Morgan Ellis Concept//Local Preview//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT',`UID:intro-preview-${icsTime(start)}@morganellis.example`,'DTSTAMP:20261113T120000Z',`DTSTART:${icsTime(start)}`,`DTEND:${icsTime(end)}`,'SUMMARY:Unbooked introduction - local portfolio preview','DESCRIPTION:Fictional portfolio calendar exercise. No booking or invitation has been made.','STATUS:TENTATIVE','TRANSP:TRANSPARENT','END:VEVENT','END:VCALENDAR',''].join('\r\n');
    const url=URL.createObjectURL(new Blob([calendar],{type:'text/calendar;charset=utf-8'})),anchor=document.createElement('a');
    anchor.href=url;anchor.download='intro-call-preview.ics';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(() => URL.revokeObjectURL(url),2000);
    $('#schedule-status').textContent=`Calendar preview downloaded for ${start.toLocaleString('en-GB',{timeZone:'UTC',dateStyle:'medium',timeStyle:'short'})} UTC. No call is booked.`;
  });
  restore();
})();
