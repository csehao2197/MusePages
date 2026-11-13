(() => {
  'use strict';
  const $=(selector,root=document) => root.querySelector(selector);
  const $$=(selector,root=document) => [...root.querySelectorAll(selector)];
  const projects=window.portfolioProjects,journal=window.portfolioJournal,quarters=window.portfolioQuarters;
  const icon=(name) => `<svg aria-hidden="true"><use href="./assets/icons.svg#${name}"></use></svg>`;
  const escape=(value) => String(value).replace(/[&<>"']/g,(character) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const projectDialog=$('#project-dialog'),contactDialog=$('#contact-dialog');
  let projectId=null,topic='All',tasks=[],taskSerial=0,returnFocus=null;
  const initialTasks=['Sketch the smallest useful thing','Make the keyboard path clear','Leave a little room'];
  const download=(text,name,type='text/plain;charset=utf-8') => {
    const url=URL.createObjectURL(new Blob([text],{type})),anchor=document.createElement('a');
    anchor.href=url;anchor.download=name;document.body.append(anchor);anchor.click();anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url),2000);
  };
  const showMenu=(open) => {
    $('#navigation').classList.toggle('open',open);$('#menu-button').setAttribute('aria-expanded',String(open));
    $('#menu-button').setAttribute('aria-label',open?'Close navigation':'Open navigation');
  };
  $('#menu-button').addEventListener('click',() => showMenu($('#menu-button').getAttribute('aria-expanded')!=='true'));
  $$('#navigation a').forEach((link) => link.addEventListener('click',() => showMenu(false)));
  document.addEventListener('keydown',(event) => {
    if(event.key==='Escape' && $('#menu-button').getAttribute('aria-expanded')==='true'){showMenu(false);$('#menu-button').focus();}
  });
  window.addEventListener('resize',() => {if(innerWidth>600) showMenu(false);});
  const filterProjects=(filter) => {
    if(!['all','product','website','open-source'].includes(filter)) filter='all';
    $$('[data-filter]').forEach((button) => button.setAttribute('aria-pressed',String(button.dataset.filter===filter)));
    $$('.project').forEach((project) => project.hidden=filter!=='all' && project.dataset.category!==filter);
    const count=$$('.project:not([hidden])').length;
    $('#project-count').textContent=filter==='all'?'Showing all 4 projects':`Showing ${count} ${count===1?'project':'projects'}`;
    return filter;
  };
  $$('[data-filter]').forEach((button) => button.addEventListener('click',() => {
    const filter=filterProjects(button.dataset.filter),url=new URL(location.href);
    if(filter==='all') url.searchParams.delete('work');else url.searchParams.set('work',filter);
    history.replaceState(null,'',url);
  }));
  $$('[data-skill]').forEach((button) => button.addEventListener('click',() => {
    const value=button.dataset.skill;
    $$('[data-skill]').forEach((item) => item.setAttribute('aria-pressed',String(item===button)));
    $$('[data-skill-group]').forEach((group) => group.hidden=value!=='all' && group.dataset.skillGroup!==value);
  }));
  $('#hero-tasks').addEventListener('change',() => $('#desk-progress').textContent=`${$$('#hero-tasks input:checked').length} of 3 little things complete`);
  const updateHash=(hash) => {const url=new URL(location.href);url.hash=hash;history.replaceState(null,'',url);};
  const closeDialog=(dialog) => {
    if(dialog===projectDialog){projectId=null;tasks=[];$('#project-content').replaceChildren();if(location.hash.startsWith('#project-')) updateHash('work');}
    if(dialog===contactDialog){$('#brief-form').reset();$('#brief-status').textContent='';$('#copy-status').textContent='';}
    if(returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
  };
  $$('dialog').forEach((dialog) => {
    $('.dialog-close',dialog).addEventListener('click',() => dialog.close());
    dialog.addEventListener('close',() => closeDialog(dialog));
    dialog.addEventListener('click',(event) => {
      if(event.target!==dialog) return;
      const rect=dialog.getBoundingClientRect();
      if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom) dialog.close();
    });
  });
  const selectTab=(name,focus=false) => {
    $$('[role=tab]',projectDialog).forEach((tab) => {const selected=tab.dataset.tab===name;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;if(selected && focus) tab.focus();});
    $$('[role=tabpanel]',projectDialog).forEach((panel) => panel.hidden=panel.id!==`pane-${name}`);
  };
  const taskRender=() => {
    $('#task-list').innerHTML=tasks.map((task) => `<div class="demo-task"><input id="task-${task.id}" type="checkbox" ${task.done?'checked':''} data-task="${task.id}"><label for="task-${task.id}" style="flex:1;overflow-wrap:anywhere">${escape(task.text)}</label><button data-remove="${task.id}" aria-label="Remove ${escape(task.text)}">Remove</button></div>`).join('');
    $$('#task-list input').forEach((input) => input.addEventListener('change',() => {const task=tasks.find((item) => item.id===Number(input.dataset.task));task.done=input.checked;taskProgress();}));
    $$('[data-remove]').forEach((button) => button.addEventListener('click',() => {tasks=tasks.filter((task) => task.id!==Number(button.dataset.remove));taskRender();$('#new-task').focus();}));
    taskProgress();
  };
  const taskProgress=() => {
    $('#task-status').textContent=tasks.length?`${tasks.filter((task) => task.done).length} of ${tasks.length} complete`:'A little room. Add your first task.';
    $$('#task-list input').forEach((input) => {const label=$(`label[for="${input.id}"]`);label.style.textDecoration=input.checked?'line-through':'none';label.style.color=input.checked?'var(--muted)':'var(--ink)';});
  };
  const mountTasks=() => {
    tasks=initialTasks.map((text,index) => ({id:++taskSerial,text,done:index===0}));taskRender();
    $('#task-form').addEventListener('submit',(event) => {
      event.preventDefault();const input=$('#new-task'),text=input.value.trim();
      if(!text){input.setCustomValidity('Give this little task a name.');input.reportValidity();return;}
      if(tasks.length>=8){$('#task-status').textContent='Eight is enough for today. Finish or remove a task to make room.';return;}
      input.setCustomValidity('');tasks.push({id:++taskSerial,text,done:false});input.value='';taskRender();input.focus();
    });
    $('#new-task').addEventListener('input',() => $('#new-task').setCustomValidity(''));
  };
  const articleList=() => {
    const articles=journal.filter((article) => topic==='All' || article.topic===topic);
    $('#demo-articles').innerHTML=articles.map((article) => `<button data-article="${article.id}"><span><strong>${article.title}</strong><small>${article.topic} · ${Math.max(1,Math.ceil(article.text.split(/\s+/).length/180))} min read</small></span>${icon('arrow-up-right')}</button>`).join('');
    $('#article-count').textContent=`${articles.length} ${articles.length===1?'essay':'essays'}`;
    $$('[data-article]').forEach((button) => button.addEventListener('click',() => {
      const article=journal.find((item) => item.id===button.dataset.article),reader=$('#article-reading');
      reader.innerHTML=`<button class="text-button" id="close-article">${icon('arrow-left')} Back to the journal</button><h4 tabindex="-1">${article.title}</h4><p>${escape(article.text)}</p>`;
      reader.hidden=false;$('#demo-articles').hidden=true;$('#close-article').addEventListener('click',() => {reader.hidden=true;$('#demo-articles').hidden=false;button.focus();});$('h4',reader).focus();
    }));
  };
  const mountJournal=() => {
    topic='All';articleList();
    $$('[data-topic]').forEach((button) => button.addEventListener('click',() => {
      topic=button.dataset.topic;$$('[data-topic]').forEach((item) => item.setAttribute('aria-pressed',String(item===button)));
      $('#article-reading').hidden=true;$('#demo-articles').hidden=false;articleList();
    }));
  };
  const quarterRender=() => {
    const index=Number($('#quarter').value),quarter=quarters[index],total=quarter.values.reduce((sum,value) => sum+value,0),previous=index?quarters[index-1].values.reduce((sum,value) => sum+value,0):null;
    $('#relay-total').textContent=total.toLocaleString('en-US');
    $('#relay-comparison').textContent=previous?`${((total/previous-1)*100).toFixed(1)}% more signups than ${quarters[index-1].label}.`:'The first sample quarter; no prior-quarter comparison.';
    $('#relay-chart').setAttribute('aria-label',`${quarter.label}: ${quarter.months.map((month,i) => `${month} ${quarter.values[i]} signups`).join(', ')}`);
    $('#relay-chart').innerHTML=quarter.values.map((value,i) => `<div class="relay-bar" style="height:${value/1800*100}%">${value.toLocaleString('en-US')}<span>${quarter.months[i]}</span></div>`).join('');
    $('#relay-rows').innerHTML=quarter.months.map((month,i) => `<tr><th scope="row">${month}</th><td>${quarter.values[i].toLocaleString('en-US')}</td></tr>`).join('')+`<tr><th scope="row">Quarter total</th><td>${total.toLocaleString('en-US')}</td></tr>`;
  };
  const mountForm=() => {
    $('#goodform-form').addEventListener('submit',(event) => {
      event.preventDefault();
      const email=$('#sample-email').value.trim(),choices=$$('#goodform-form input[name=topic]:checked').map((input) => input.value),status=$('#goodform-status');
      if(!choices.length){status.textContent='Choose at least one topic to preview.';status.classList.add('error');$('#topic-design').focus();return;}
      status.classList.remove('error');status.textContent=`Local preview: ${email} · ${choices.join(' + ')}. Nothing was sent or saved.`;
      $('#sample-email').value='';
    });
  };
  const demoMarkup=(project) => {
    const note='<p class="prototype-note">Local, in-memory prototype. Closing the case study resets your changes.</p>';
    if(project.demo==='tasks') return `<div class="prototype"><p class="eyebrow">ASTER / A SMALL DAILY LIST</p><h3>One good thing at a time.</h3>${note}<div id="task-list"></div><form id="task-form" class="demo-add"><label class="sr-only" for="new-task">New task</label><input id="new-task" maxlength="80" required placeholder="A small next step…"><button type="submit">Add task ${icon('plus')}</button></form><p id="task-status" class="demo-status" role="status"></p></div>`;
    if(project.demo==='journal') return `<div class="prototype"><p class="eyebrow">FIELDWORK / ORIGINAL MICRO-ESSAYS</p><h3>Notes from the process.</h3>${note}<div class="article-filters" role="group" aria-label="Filter journal essays">${['All','Design','Process','Development'].map((value) => `<button data-topic="${value}" aria-pressed="${value==='All'}">${value}</button>`).join('')}</div><p id="article-count" class="small-caption" role="status"></p><div id="demo-articles" class="demo-articles"></div><div id="article-reading" class="article-reading" hidden></div></div>`;
    if(project.demo==='analytics') return `<div class="prototype"><p class="eyebrow">RELAY / FICTIONAL PRODUCT ANALYTICS</p><h3>A clearer picture.</h3><div class="relay-controls"><label for="quarter">New signups, by quarter</label><select id="quarter">${quarters.map((quarter,index) => `<option value="${index}" ${index===2?'selected':''}>${quarter.label}</option>`).join('')}</select></div><p class="relay-total" id="relay-total"></p><p id="relay-comparison" class="prototype-note" role="status"></p><div id="relay-chart" class="relay-chart" role="img"></div><table class="relay-table"><caption class="sr-only">Exact signup counts, also shown in the chart</caption><thead><tr><th scope="col">Month</th><th scope="col">New signups</th></tr></thead><tbody id="relay-rows"></tbody></table><p class="prototype-note">All counts are fictional, deterministic samples. This is not a connected analytics service.</p></div>`;
    return `<div class="prototype goodform-demo"><p class="eyebrow">GOODFORM / LABELS BEFORE PLACEHOLDERS</p><h3>Small controls. Clear intentions.</h3><p class="prototype-note">A local form exercise. Enter a sample address; no subscription is created.</p><form id="goodform-form"><label for="sample-email">Sample email address</label><input id="sample-email" type="email" required maxlength="160" placeholder="you@example.com" autocomplete="off"><fieldset><legend>What would you like to read?</legend><label><input id="topic-design" type="checkbox" name="topic" value="Design notes" checked> Design notes</label><label><input type="checkbox" name="topic" value="Development notes"> Development notes</label></fieldset><button type="submit" class="primary">Preview preferences ${icon('arrow-right')}</button><p id="goodform-status" class="form-status" role="status"></p></form></div>`;
  };
  const sourceFor=(project) => {
    const demo=demoMarkup(project);
    const fixtures=JSON.stringify({projects,journal,quarters});
    const functions=[escape,taskRender,taskProgress,mountTasks,articleList,mountJournal,quarterRender,mountForm].map((fn) => `${fn.name}=${fn.toString()}`).join(';\nconst ');
    const init=project.demo==='tasks'?'mountTasks();':project.demo==='journal'?'mountJournal();':project.demo==='analytics'?"quarterRender();$('#quarter').addEventListener('change',quarterRender);":'mountForm();';
    return `<!doctype html>\n<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${project.name} — standalone prototype</title>\n<style>body{font:15px/1.7 system-ui,sans-serif;max-width:680px;margin:40px auto;padding:24px;color:#282d27;background:#f6f4ee}button,input,select{font:inherit;padding:8px}button{cursor:pointer}input:not([type=checkbox]){min-width:0;max-width:100%}svg{display:none}.demo-task,.demo-add{display:flex;align-items:center;gap:10px;margin:14px 0}.demo-task input{flex-shrink:0}.demo-task label{flex:1;overflow-wrap:anywhere}.demo-task button{font-size:12px}.demo-status,.prototype-note,.small-caption{font-size:12px}.article-filters{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0}.demo-articles>button{display:block;width:100%;text-align:left;margin:12px 0}.demo-articles strong,.demo-articles small{display:block}.article-reading p{white-space:pre-line}.relay-chart{display:flex;height:180px;align-items:flex-end;gap:20px;margin:30px 0 40px}.relay-bar{background:#294c3c;color:white;width:100%;min-width:0;position:relative;text-align:center;font-size:12px}.relay-bar span{position:absolute;bottom:-30px;left:20%;color:#282d27}.relay-table{width:100%;text-align:left}.relay-table th,.relay-table td{border-bottom:1px solid #ccc;padding:8px}form label{display:block}fieldset{margin-top:15px}.error{color:#9e3a23}[hidden]{display:none!important}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}:root{--muted:#6d7268;--ink:#282d27}</style>\n<h1>${project.name}</h1>${demo}\n<p>Original fictional portfolio concept. No network, accounts, delivery, or storage. Source supplied as an editable standalone HTML example.</p>\n<script>\n'use strict';\nconst $=(selector,root=document)=>root.querySelector(selector);\nconst $$=(selector,root=document)=>[...root.querySelectorAll(selector)];\nconst icon=()=>'';\nconst {projects,journal,quarters}=${fixtures};\nlet topic='All',tasks=[],taskSerial=0;\nconst initialTasks=${JSON.stringify(initialTasks)};\nconst ${functions};\n${init}\n</script></html>\n`;
  };
  const openProject=(id,changeHash=true) => {
    const project=projects.find((item) => item.id===id);if(!project) return;
    if(contactDialog.open) return;
    returnFocus=document.activeElement;projectId=id;
    $('#project-content').innerHTML=`<p class="eyebrow">${project.category} / ${project.year}</p><h2 id="project-title">${project.name}<em>.</em></h2><p class="case-meta"><span>${project.role}</span><span>${project.stack}</span></p><div class="case-art"><img src="./assets/${project.image}" alt="Original ${project.name} interface concept" width="640" height="420"></div><div class="case-tabs" role="tablist" aria-label="${project.name} case study"><button id="tab-story" role="tab" data-tab="story" aria-selected="true" aria-controls="pane-story">The story</button><button id="tab-demo" role="tab" data-tab="demo" aria-selected="false" aria-controls="pane-demo" tabindex="-1">Try the prototype</button><button id="tab-source" role="tab" data-tab="source" aria-selected="false" aria-controls="pane-source" tabindex="-1">The source</button></div><section id="pane-story" class="case-pane" role="tabpanel" aria-labelledby="tab-story"><div class="case-overview"><div><h3>The question</h3><p>${project.challenge}</p><h3>The approach</h3><p>${project.approach}</p><h3>What I learned</h3><p>${project.learning}</p></div><div><h3>What you can try</h3><ul>${project.deliverables.map((item) => `<li>${item}</li>`).join('')}</ul><p class="prototype-note">Fictional self-directed concept. No client work, production deployment, employment history, or performance claims.</p><button class="text-button" id="try-prototype">Try the local prototype ${icon('arrow-right')}</button></div></div></section><section id="pane-demo" class="case-pane" role="tabpanel" aria-labelledby="tab-demo" hidden>${demoMarkup(project)}</section><section id="pane-source" class="case-pane" role="tabpanel" aria-labelledby="tab-source" hidden><h3>One file. A real little prototype.</h3><p class="prototype-note">This is the actual standalone HTML, CSS, and JavaScript source for this local demo. Download it, open it in a browser, and make it your own. The broader React / Next.js stacks are concept directions, not compiled applications.</p><pre class="code-sample" tabindex="0"><code id="source-code"></code></pre><div class="source-actions"><button class="primary" id="download-source">Download HTML source ${icon('download')}</button><button class="text-button" id="run-source">Open standalone demo ${icon('external-link')}</button></div><p class="source-caption" id="source-status" role="status">Original example source, supplied under CC0-1.0; third-party fonts and Lucide assets retain their separate licenses.</p></section>`;
    $('#source-code').textContent=sourceFor(project);
    $$('[role=tab]',projectDialog).forEach((tab) => {
      tab.addEventListener('click',() => selectTab(tab.dataset.tab));
      tab.addEventListener('keydown',(event) => {
        const tabs=$$('[role=tab]',projectDialog),index=tabs.indexOf(tab);let next=null;
        if(event.key==='ArrowRight') next=(index+1)%tabs.length;if(event.key==='ArrowLeft') next=(index+tabs.length-1)%tabs.length;if(event.key==='Home') next=0;if(event.key==='End') next=tabs.length-1;
        if(next!==null){event.preventDefault();selectTab(tabs[next].dataset.tab,true);}
      });
    });
    $('#try-prototype').addEventListener('click',() => selectTab('demo',true));
    $('#download-source').addEventListener('click',() => download(sourceFor(project),`${project.id}-prototype.html`,'text/html;charset=utf-8'));
    $('#run-source').addEventListener('click',() => {
      const url=URL.createObjectURL(new Blob([sourceFor(project)],{type:'text/html'})),opened=window.open(url,'_blank','noopener');
      setTimeout(() => URL.revokeObjectURL(url),60000);
      $('#source-status').textContent='A standalone local demo was requested in a new tab. If your browser blocked it, download the source and open that file.';
      void opened;
    });
    if(project.demo==='tasks') mountTasks();
    if(project.demo==='journal') mountJournal();
    if(project.demo==='analytics'){quarterRender();$('#quarter').addEventListener('change',quarterRender);}
    if(project.demo==='form') mountForm();
    if(changeHash) updateHash(`project-${id}`);
    if(!projectDialog.open) projectDialog.showModal();
    projectDialog.scrollTop=0;$('.dialog-close',projectDialog).focus({preventScroll:true});
  };
  $$('[data-project]').forEach((button) => button.addEventListener('click',() => openProject(button.dataset.project)));
  $('#contact-button').addEventListener('click',() => {returnFocus=document.activeElement;contactDialog.showModal();$('.dialog-close',contactDialog).focus();});
  $('#copy-email').addEventListener('click',async () => {
    try {await navigator.clipboard.writeText('hello@alexmorgan.example');$('#copy-status').textContent='Sample address copied. It is not a working mailbox.';}
    catch {$('#copy-status').textContent='Clipboard unavailable. Select and copy the sample address above.';}
  });
  $('#brief-form').addEventListener('submit',(event) => {
    event.preventDefault();const text=$('#brief-text').value.trim(),status=$('#brief-status');
    if(text.length<20){status.textContent='Please add at least 20 non-padding characters to the idea.';status.classList.add('error');$('#brief-text').focus();return;}
    status.classList.remove('error');
    download(`PROJECT BRIEF — LOCAL DRAFT\n\nType: ${$('#brief-type').value}\n\nThe idea\n${text}\n\nFictional portfolio exercise. No email was sent and no submission was saved by this site.\n`,'project-brief.txt');
    status.textContent='Brief downloaded locally. Nothing was sent or saved by this site.';$('#brief-form').reset();
  });
  const restore=() => {
    filterProjects(new URL(location.href).searchParams.get('work'));
    const id=location.hash.match(/^#project-([a-z]+)$/)?.[1];
    if(id && projects.some((project) => project.id===id)){if(projectId!==id) openProject(id,false);}
    else if(projectDialog.open) projectDialog.close();
  };
  window.addEventListener('popstate',restore);window.addEventListener('hashchange',restore);
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver((entries) => entries.forEach((entry) => {
      if(!entry.isIntersecting) return;
      $$('#navigation a').forEach((link) => {if(link.hash===`#${entry.target.id}`) link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    }),{rootMargin:'-15% 0px -65% 0px',threshold:0});
    ['home','work','about','contact'].forEach((id) => observer.observe($(`#${id}`)));
  }
  restore();
})();
