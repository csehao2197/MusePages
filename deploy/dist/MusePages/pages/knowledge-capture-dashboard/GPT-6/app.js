import {MAX_NODES,utcDay,addDays,capture,makeSeed,filteredNodes,graphEdges,clusterNodes,deleteNodes,addCollection,addToCollection,reviewSM2,dueNodes,buildDigests,retrieve} from "./assets/engine.js";
const $=(id)=>document.getElementById(id);
const escape=(value)=>String(value).replace(/[&<>"']/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const icon=(name)=>`<svg aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
const tags=(items)=>`<div class="tags">${items.map((tag)=>`<span class="tag">${escape(tag)}</span>`).join("")}</div>`;
const uid=()=>crypto.randomUUID();
const dayLabel=(day)=>new Intl.DateTimeFormat("en",{month:"short",day:"numeric",timeZone:"UTC"}).format(new Date(`${day}T00:00:00.000Z`));
let state=makeSeed(),tab="knowledge",collection="all",pageNumber=1,selected=new Set(),focused=null,revealed=false,messages=[],zoom=1,pan={x:0,y:0},drag=null,toastTimer,confirmAction=null;
const pageSize=6;
const currentNodes=()=>filteredNodes(state,$("search").value,collection);
function toast(value){$("toast").textContent=value;$("toast").hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("toast").hidden=true,4200);}
function confirm(title,description,action){$("confirm-title").textContent=title;$("confirm-description").textContent=description;confirmAction=action;$("confirm-dialog").showModal();}
function closeNavigation(){$("sidebar").classList.remove("open");$("nav-backdrop").hidden=true;$("menu-button").setAttribute("aria-expanded","false");}
function setTab(next,updateHash=true){tab=["knowledge","review","memory"].includes(next)?next:"knowledge";revealed=false;selected.clear();if(updateHash)history.replaceState(null,"",`#${tab}`);closeNavigation();render();window.scrollTo(0,0);}
function renderSidebar(){
  $("knowledge-count").textContent=state.nodes.length;$("due-count").textContent=dueNodes(state).length;
  document.querySelectorAll("[data-tab]").forEach((button)=>{if(button.dataset.tab===tab)button.setAttribute("aria-current","page");else button.removeAttribute("aria-current");});
  $("collection-list").innerHTML=state.collections.map((item)=>`<button type="button" data-collection="${item.id}" aria-pressed="${collection===item.id&&tab==="knowledge"}"><i></i>${escape(item.name)}<span>${item.nodeIds.length}</span></button>`).join("");
  $("bulk-collection").innerHTML=`<option value="">Choose collection…</option>${state.collections.map((item)=>`<option value="${item.id}">${escape(item.name)}</option>`).join("")}`;
}
function renderStats(){
  const count=state.nodes.filter((node)=>node.capturedAt.startsWith(utcDay())).length;
  $("stats").innerHTML=[
    ["bookmark","Total captures",state.nodes.length,`${count} captured today · UTC`],
    ["git-fork","Connections",graphEdges(state.nodes).length,"Explainable shared-tag links"],
    ["layers","Due for review",dueNodes(state).length,"A small step for your memory"]
  ].map(([glyph,label,value,note])=>`<div class="stat"><span class="stat-icon">${icon(glyph)}</span><div><span class="stat-label">${label}</span><strong>${value}</strong><small>${note}</small></div></div>`).join("");
}
function renderFeed(){
  const nodes=currentNodes(),pages=Math.max(1,Math.ceil(nodes.length/pageSize));pageNumber=Math.min(pageNumber,pages);
  const visible=nodes.slice((pageNumber-1)*pageSize,pageNumber*pageSize);
  $("feed-count").textContent=`${nodes.length} captures`;$("active-filter").textContent=state.collections.find((item)=>item.id===collection)?.name??"All captures";
  $("feed").innerHTML=visible.length?visible.map((node)=>`<article class="capture-item${focused===node.id?" selected":""}" data-capture="${node.id}"><input type="checkbox" data-select="${node.id}" aria-label="Select ${escape(node.title)}"${selected.has(node.id)?" checked":""}><button type="button" class="capture-main" data-open="${node.id}"><div class="capture-meta">${icon(node.type==="video"?"video":"file-text")}<span>${dayLabel(node.capturedAt.slice(0,10))}</span><span>${node.type==="video"?"TRANSCRIPT":"TEXT CAPTURE"}</span></div><h3 class="capture-title">${escape(node.title)}</h3><p class="capture-summary">${escape(node.summary)}</p>${tags(node.tags)}</button></article>`).join(""):`<div class="empty">${icon("search-x")}<h3>No captures in view.</h3><p>Try a different search, clear the collection filter, or save your first passage.</p><button class="button" type="button" id="empty-clear">Show all captures</button></div>`;
  $("page-count").textContent=`Page ${pageNumber} of ${pages}`;
  $("previous-page").disabled=pageNumber===1;$("next-page").disabled=pageNumber===pages;
  $("select-page").checked=visible.length>0&&visible.every((node)=>selected.has(node.id));
  $("select-page").indeterminate=visible.some((node)=>selected.has(node.id))&&!$("select-page").checked;
  $("select-page").disabled=!visible.length;
  $("bulk-bar").hidden=!selected.size;$("selected-count").textContent=`${selected.size} selected`;
}
function renderGraph(){
  const matches=currentNodes(),cluster=clusterNodes(matches,focused),edges=graphEdges(cluster);
  $("cluster-count").textContent=`${cluster.length} / ${matches.length} captures · 2-hop cluster`;
  const positions=new Map(cluster.map((node,index)=>{const angle=index*2*Math.PI/cluster.length-Math.PI/2;return [node.id,{x:280+Math.cos(angle)*(cluster.length<4?140:175),y:225+Math.sin(angle)*(cluster.length<4?110:145)}];}));
  const lines=edges.map((edge)=>{const a=positions.get(edge.source),b=positions.get(edge.target);return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="graph-edge${[edge.source,edge.target].includes(focused)?" focus":""}"><title>Shared tags: ${escape(edge.tags.join(", "))}</title></line>`;}).join("");
  const hubs=state.settings.showEntities?[...new Set(cluster.flatMap((node)=>node.tags))].filter((tag)=>tag!=="Unsorted").slice(0,3):[];
  const hubEdges=hubs.map((tag,index)=>cluster.filter((node)=>node.tags.includes(tag)).map((node)=>{const point=positions.get(node.id);return `<line class="tag-edge" x1="${210+index*70}" y1="225" x2="${point.x}" y2="${point.y}" stroke="#dce8d7" stroke-width="1" stroke-dasharray="3 5"/>`;}).join("")).join("");
  const hubMarkup=hubs.map((tag,index)=>`<g class="tag-hub" transform="translate(${210+index*70},225)"><circle r="23"/><text text-anchor="middle" y="3">${escape(tag)}</text></g>`).join("");
  const nodes=cluster.map((node)=>{const point=positions.get(node.id);return `<g class="graph-node${focused===node.id?" focus":""}" data-open="${node.id}" role="button" tabindex="0" aria-label="Open ${escape(node.title)}" transform="translate(${point.x},${point.y})"><title>${escape(node.title)}</title><circle r="32"/><rect class="node-symbol" x="-8" y="-10" width="16" height="20" rx="3"/><path d="M-4-4H4M-4 0H4M-4 4H1" stroke="#ad96ce" fill="none" stroke-width="1"/><text text-anchor="middle" y="48">${escape(node.title.length>23?node.title.slice(0,21)+"…":node.title)}</text><text class="node-caption" text-anchor="middle" y="61">${escape(node.tags[0])}</text></g>`;}).join("");
  $("graph-content").innerHTML=cluster.length?hubEdges+lines+hubMarkup+nodes:`<text x="280" y="230" text-anchor="middle" font-family="Inter,Arial" font-size="12" fill="#b3a5c1">No captures in this view</text>`;
  updateGraphView();
}
function updateGraphView(){$("graph").setAttribute("viewBox",`${pan.x+(560-560/zoom)/2} ${pan.y+(460-460/zoom)/2} ${560/zoom} ${460/zoom}`);$("zoom-level").textContent=`${Math.round(zoom*100)}%`;$("zoom-in").disabled=zoom>=1.8;$("zoom-out").disabled=zoom<=.6;}
function renderDetail(){
  const node=state.nodes.find((item)=>item.id===focused);if(!node)return;
  const edges=graphEdges(state.nodes).filter((edge)=>edge.source===node.id||edge.target===node.id);
  const review=state.reviews[node.id],memberships=state.collections.filter((item)=>item.nodeIds.includes(node.id));
  $("note-detail").innerHTML=`<p class="note-meta">${icon(node.type==="video"?"video":"file-text")}${node.type==="video"?"Pasted transcript":"Pasted text"} · ${dayLabel(node.capturedAt.slice(0,10))} UTC</p><h2 id="note-title">${escape(node.title)}</h2>${tags(node.tags)}<section class="detail-section"><h3>Local summary</h3><p>${escape(node.summary)}</p><p style="font-size:8px;margin-top:8px;color:#b9a7c7">${escape(node.summaryMethod)}</p></section><section class="detail-section"><h3>Source text</h3><p class="raw-text">${escape(node.raw)}</p>${node.url?`<a class="detail-source" href="${escape(node.url)}" target="_blank" rel="noreferrer">${icon("external-link")}Open supplied source URL</a>`:""}</section><section class="detail-section"><h3>${edges.length} shared-tag connections</h3>${edges.length?edges.map((edge)=>{const other=state.nodes.find((item)=>item.id===(edge.source===node.id?edge.target:edge.source));return `<button type="button" class="detail-connection" data-open="${other.id}">${escape(other.title)}<span>Shared: ${escape(edge.tags.join(", "))}</span></button>`;}).join(""):`<p>No other captures share a tag yet.</p>`}</section><section class="detail-section"><h3>Collections</h3>${memberships.length?tags(memberships.map((item)=>item.name)):`<p>Not in a collection.</p>`}<select id="note-collection" aria-label="Add capture to collection"><option value="">Add to a collection…</option>${state.collections.filter((item)=>!item.nodeIds.includes(node.id)).map((item)=>`<option value="${item.id}">${escape(item.name)}</option>`).join("")}</select></section><section class="detail-section"><h3>Spaced repetition</h3><p>Next review: ${review.nextReviewDate} UTC<br>Interval: ${review.interval} days · Ease: ${review.ease.toFixed(2)} · Repetitions: ${review.repetitions}</p></section><div class="detail-footer"><small>Deleting also removes review data, memberships, and affected digests.</small><button type="button" class="button danger" id="delete-note">${icon("trash-2")}Delete capture</button></div>`;
}
function openNote(id){
  if(!state.nodes.some((node)=>node.id===id))return;
  focused=id;renderFeed();renderGraph();renderDetail();
  if(!$("note-dialog").open)$("note-dialog").showModal();
}
function renderReview(){
  const due=dueNodes(state),node=due[0];
  if(!node){$("review-card").innerHTML=`<div class="review-card empty">${icon("circle-check")}<h3>You're all caught up.</h3><p>No captures are due today. New captures start in today's queue; ratings schedule the next UTC day or later.</p><button class="button" type="button" data-tab="knowledge">Back to knowledge</button></div>`;return;}
  const previous=state.reviews[node.id];
  $("review-card").innerHTML=`<article class="review-card" data-review="${node.id}"><div class="review-card-top"><span>${due.length} capture${due.length===1?"":"s"} due today</span><span>RECALL BEFORE REVEAL</span></div><div class="review-card-main">${tags(node.tags)}<h3>${escape(node.title)}</h3>${revealed?`<div class="review-summary">${escape(node.summary)}</div>`:`<div class="masked-summary">${icon("eye-off")}<p>Pause for a moment. What do you remember?</p><button type="button" class="button primary" id="reveal-review">Reveal summary</button></div>`}<div class="rating-buttons">${["forgot","hard","good","easy"].map((rating)=>{const next=reviewSM2(previous,rating);return `<button type="button" data-rating="${rating}"${!revealed?" disabled":""}>${rating[0].toUpperCase()+rating.slice(1)}<small>${next.interval===1?"Tomorrow":`In ${next.interval} days`}</small></button>`;}).join("")}</div></div><p class="review-footer">Standard SM-2 · Forgot=0, Hard=3, Good=4, Easy=5 · UTC day scheduling</p></article>`;
}
function sourceButtons(nodes){return `<div class="source-buttons">${nodes.map((node)=>`<button type="button" data-open="${node.id}">${icon("file-text")}${escape(node.title)}</button>`).join("")}</div>`;}
function renderMemory(){
  $("digests").innerHTML=state.consolidations.length?state.consolidations.map((item)=>`<article class="digest"><span class="eyebrow">SHARED-TAG DIGEST · ${item.sourceNodeIds.length} SOURCES</span><h3>${escape(item.theme)}</h3><p>${escape(item.summary)}</p>${sourceButtons(item.sourceNodeIds.map((id)=>state.nodes.find((node)=>node.id===id)).filter(Boolean))}</article>`).join(""):`<div class="empty">${icon("combine")}<h3>A few connections are waiting.</h3><p>Build a digest from at least two ungrouped captures sharing a tag. All text is quoted from your local summaries.</p></div>`;
  $("chat-messages").innerHTML=`<div class="chat-message"><strong>YOUR LOCAL SOURCE FINDER</strong><p>Ask a question to find up to three keyword-matching captures. I'll show sources, not invent an answer.</p></div>${messages.map((item)=>`<div class="chat-message user">${escape(item.question)}</div><div class="chat-message"><strong>${item.ids.length?"SOURCE MATCHES · NOT AN AI ANSWER":"NO SOURCE MATCHES"}</strong><p>${item.ids.length?"These captures match at least one meaningful keyword. Open a source to inspect it.":"Try a title, tag, or a more specific keyword. Nothing is sent to a provider."}</p>${sourceButtons(item.ids.map((id)=>state.nodes.find((node)=>node.id===id)).filter(Boolean))}</div>`).join("")}`;
  $("chat-input").disabled=messages.length>=10;$("chat-form").querySelector("button").disabled=messages.length>=10;
  $("chat-limit").textContent=`${messages.length} / 10 questions this session${messages.length>=10?" · Clear to start again":""}`;
  $("chat-messages").scrollTop=$("chat-messages").scrollHeight;
}
function render(){
  renderSidebar();renderStats();renderFeed();renderGraph();renderReview();renderMemory();
  $("knowledge-view").hidden=tab!=="knowledge";$("review-view").hidden=tab!=="review";$("memory-view").hidden=tab!=="memory";
  $("breadcrumb").textContent={knowledge:"Knowledge",review:"Daily review",memory:"Memory"}[tab];
  $("page-eyebrow").textContent={knowledge:"YOUR PERSONAL KNOWLEDGE SPACE",review:"KEEP YOUR CURIOSITY ALIVE",memory:"AN INSPECTABLE MEMORY WORKSPACE"}[tab];
  $("page-title").innerHTML={knowledge:'Your knowledge, connected<span>.</span>',review:'A little practice, a lasting memory<span>.</span>',memory:'See the bigger picture<span>.</span>'}[tab];
  $("page-subtitle").textContent={knowledge:"A little curiosity today. A clearer picture tomorrow.",review:"Review what is due, not everything you have ever saved.",memory:"Source-led digests and keyword retrieval. All right here."}[tab];
  $("setting-tags").checked=state.settings.detectTags;$("setting-entities").checked=state.settings.showEntities;
}
function requestDelete(ids){
  confirm(`Delete ${ids.length===1?"this capture":`${ids.length} captures`}?`,"This removes source text, reviews, collection memberships and any digest referencing the captures. This RAM-only action cannot be undone.",()=>{
    state=deleteNodes(state,ids);selected.clear();messages=messages.map((item)=>({...item,ids:item.ids.filter((id)=>!ids.includes(id))}));
    if(ids.includes(focused)){focused=null;$("note-dialog").close();}
    render();toast(`${ids.length} capture${ids.length===1?"":"s"} deleted.`);
  });
}
document.addEventListener("click",(event)=>{
  const target=event.target.closest("button,[data-open]");if(!target)return;
  if(target.dataset.tab)setTab(target.dataset.tab);
  if(target.dataset.collection){collection=target.dataset.collection;pageNumber=1;selected.clear();focused=null;setTab("knowledge");}
  if(target.dataset.open)openNote(target.dataset.open);
  if(target.dataset.close)$(target.dataset.close).close();
  if(["workspace-info","open-scope"].includes(target.id))$("scope-dialog").showModal();
  if(target.id==="open-capture"){$("capture-error").textContent="";$("capture-dialog").showModal();}
  if(target.id==="new-collection"){$("collection-error").textContent="";$("collection-dialog").showModal();closeNavigation();}
  if(target.id==="open-settings"){$("settings-dialog").showModal();closeNavigation();}
  if(target.id==="menu-button"){const open=$("sidebar").classList.toggle("open");$("nav-backdrop").hidden=!open;target.setAttribute("aria-expanded",String(open));}
  if(target.id==="nav-backdrop")closeNavigation();
  if(["clear-filter","empty-clear"].includes(target.id)){$("search").value="";collection="all";focused=null;pageNumber=1;selected.clear();render();}
  if(target.id==="previous-page"||target.id==="next-page"){pageNumber+=target.id==="previous-page"?-1:1;renderFeed();}
  if(target.id==="clear-selection"){selected.clear();renderFeed();}
  if(target.id==="bulk-add"){try{state=addToCollection(state,$("bulk-collection").value,[...selected]);selected.clear();render();toast("Selected captures added to the collection.");}catch(error){toast(error.message);}}
  if(target.id==="bulk-delete")requestDelete([...selected]);
  if(target.id==="delete-note")requestDelete([focused]);
  if(target.id==="confirm-action"){const action=confirmAction;confirmAction=null;$("confirm-dialog").close();action?.();}
  if(target.id==="reveal-review"){revealed=true;renderReview();}
  if(target.dataset.rating){
    const node=dueNodes(state)[0];if(!revealed||!node)return;
    const next=reviewSM2(state.reviews[node.id],target.dataset.rating);state={...state,reviews:{...state.reviews,[node.id]:next}};revealed=false;render();toast(`Review saved. Next: ${next.nextReviewDate} UTC.`);
  }
  if(target.id==="build-digests"){const before=state.consolidations.length;state=buildDigests(state);renderMemory();toast(state.consolidations.length>before?`${state.consolidations.length-before} source-led digests created.`:"No new pairs of ungrouped captures share a tag.");}
  if(target.id==="clear-chat"){messages=[];renderMemory();}
  if(target.id==="zoom-in"){zoom=Math.min(1.8,Math.round((zoom+.2)*10)/10);updateGraphView();}
  if(target.id==="zoom-out"){zoom=Math.max(.6,Math.round((zoom-.2)*10)/10);updateGraphView();}
  if(target.id==="fit-graph"){zoom=1;pan={x:0,y:0};updateGraphView();}
  if(target.id==="reset-demo")confirm("Reset this local workspace?","All captures, reviews, digests, collections, questions and preferences in this tab will be replaced by the fictional sample workspace.",()=>{
    state=makeSeed();messages=[];selected.clear();focused=null;collection="all";pageNumber=1;zoom=1;pan={x:0,y:0};$("search").value="";$("capture-form").reset();$("settings-dialog").close();setTab("knowledge");toast("Sample workspace restored.");
  });
  if(target.id==="export-workspace"){
    const blob=new Blob([JSON.stringify({kind:"NEXUS LOCAL DEMO EXPORT",exportedAt:new Date().toISOString(),...state},null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),link=document.createElement("a");
    link.href=url;link.download="nexus-local-workspace.json";link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast("Workspace exported. No cloud backup was created.");
  }
});
document.addEventListener("change",(event)=>{
  const target=event.target;
  if(target.dataset.select){if(target.checked)selected.add(target.dataset.select);else selected.delete(target.dataset.select);renderFeed();}
  if(target.id==="select-page"){const visible=currentNodes().slice((pageNumber-1)*pageSize,pageNumber*pageSize);visible.forEach((node)=>target.checked?selected.add(node.id):selected.delete(node.id));renderFeed();}
  if(target.id==="note-collection"&&target.value){state=addToCollection(state,target.value,[focused]);renderSidebar();renderDetail();toast("Capture added to collection.");}
  if(target.id==="setting-tags")state={...state,settings:{...state.settings,detectTags:target.checked}};
  if(target.id==="setting-entities"){state={...state,settings:{...state.settings,showEntities:target.checked}};renderGraph();}
});
$("search").addEventListener("input",()=>{selected.clear();pageNumber=1;if(!currentNodes().some((node)=>node.id===focused))focused=null;renderFeed();renderGraph();});
$("capture-form").addEventListener("submit",(event)=>{
  event.preventDefault();
  try{
    if(state.nodes.length>=MAX_NODES)throw new Error("This local edition supports 100 captures. Export and delete captures before adding more.");
    const data=capture({title:$("capture-name").value,url:$("capture-url").value,raw:$("capture-raw").value,tags:$("capture-tags").value,type:$("capture-type").value},state.settings),id=uid();
    state={...state,nodes:[{id,...data,capturedAt:new Date().toISOString()},...state.nodes],reviews:{...state.reviews,[id]:{repetitions:0,interval:0,ease:2.5,nextReviewDate:utcDay()}}};
    $("capture-form").reset();$("capture-dialog").close();$("search").value="";collection="all";pageNumber=1;focused=id;setTab("knowledge");toast("Passage saved locally. Summary extracted; shared tags linked.");
  }catch(error){$("capture-error").textContent=error.message;}
});
$("collection-form").addEventListener("submit",(event)=>{
  event.preventDefault();
  try{const id=uid();state=addCollection(state,id,$("collection-name").value,$("collection-description").value);$("collection-form").reset();$("collection-dialog").close();renderSidebar();toast("Collection created. Select captures to add them.");}
  catch(error){$("collection-error").textContent=error.message;}
});
$("chat-form").addEventListener("submit",(event)=>{event.preventDefault();const question=$("chat-input").value.trim();if(!question||messages.length>=10)return;messages.push({question,ids:retrieve(state,question).map((node)=>node.id)});$("chat-input").value="";renderMemory();});
$("graph").addEventListener("keydown",(event)=>{if(["Enter"," "].includes(event.key)&&event.target.dataset.open){event.preventDefault();openNote(event.target.dataset.open);}});
$("graph").addEventListener("pointerdown",(event)=>{if(event.target.closest("[data-open]"))return;drag={x:event.clientX,y:event.clientY,pan:{...pan}};$("graph").setPointerCapture(event.pointerId);});
$("graph").addEventListener("pointermove",(event)=>{if(!drag)return;const box=$("graph").getBoundingClientRect();pan={x:drag.pan.x-(event.clientX-drag.x)*560/box.width/zoom,y:drag.pan.y-(event.clientY-drag.y)*460/box.height/zoom};updateGraphView();});
for(const name of ["pointerup","pointercancel"])$("graph").addEventListener(name,()=>drag=null);
window.addEventListener("hashchange",()=>setTab(location.hash.slice(1),false));
document.addEventListener("keydown",(event)=>{if(event.key==="Escape")closeNavigation();if(event.key==="/"&&!document.querySelector("dialog[open]")&&!["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)){event.preventDefault();setTab("knowledge");$("search").focus();}});
$("confirm-dialog").addEventListener("close",()=>confirmAction=null);
setTab(location.hash.slice(1),false);
