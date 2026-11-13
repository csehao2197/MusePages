import {identity,projects,certifications,dictionaries} from "./assets/content.js";
import {categories,language,description,filterProjects,projectFromHash,sheetIndex,nextQuote,messageDraft} from "./assets/engine.js";
import {createGeometry} from "./assets/webgl.js";
const $=(id)=>document.getElementById(id);
const escape=(value)=>String(value).replace(/[&<>"']/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const icon=(name)=>`<svg aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
let locale=language(new URL(location.href).searchParams.get("lang")),category="all",expanded=false,selected=null,sheet=0,quoteIndex=0,geometryLive=false,noticeTimer;
const text=(key)=>dictionaries[locale][key];
function announce(value){$("announcement").textContent=value;$("announcement").hidden=false;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$("announcement").hidden=true,4200);}
function renderProjects(){
  const all=filterProjects($("project-search").value,category,locale),visible=expanded||category!=="all"||$("project-search").value.trim()?all:all.slice(0,4);
  $("categories").innerHTML=categories.map((id)=>`<button type="button" data-category="${id}" aria-pressed="${category===id}">${escape(text(id))}</button>`).join("");
  $("project-count").textContent=`${visible.length} ${text("of")} ${all.length} ${text("visible")}`;
  $("project-list").innerHTML=visible.length?visible.map((project)=>`<article class="window project-card" data-project="${project.id}"><div class="titlebar"><span>${icon("folder-open")}${escape(project.name.replaceAll(" ","_"))}.project</span><span>${escape(text(project.category).toUpperCase())}</span></div><div class="project-inner"><img class="project-art" src="assets/${project.id}-${locale}-1.svg" alt="${escape(text("sheetNotice"))}" width="800" height="450" loading="eager"><div class="project-copy"><h3>${escape(project.name)}</h3><p class="project-role">${escape(project.role)}${project.organization?` / ${escape(project.organization)}`:""}</p><p class="project-description">${escape(description(project,locale))}</p><div>${project.stack.map((item)=>`<span class="chip">${escape(item)}</span>`).join("")}</div></div><button type="button" class="project-open" data-open-project="${project.id}" aria-label="${escape(text("open")+" — "+project.name)}"><span>${escape(text("open"))}</span>${icon("arrow-up-right")}</button></div></article>`).join(""):`<div class="empty"><p>${escape(text("noResults"))}</p><button type="button" id="clear-filters">${escape(text("clear"))}</button></div>`;
  $("show-all").hidden=category!=="all"||Boolean($("project-search").value.trim());
  $("show-all").textContent=text(expanded?"showLess":"showAll");
  $("show-all").setAttribute("aria-expanded",String(expanded));
}
function renderSheet(){
  if(!selected)return;
  $("viewer-name").textContent=selected.name;
  $("viewer-category").textContent=text(selected.category);
  $("viewer-description").textContent=description(selected,locale);
  $("viewer-image").src=`assets/${selected.id}-${locale}-${sheet+1}.svg`;
  $("viewer-image").alt=`${selected.name} — ${text("sheet")} ${sheet+1}. ${text("sheetNotice")}`;
  $("sheet-count").textContent=`${text("sheet")} ${sheet+1} / 2`;
  $("sheet-dots").innerHTML=[0,1].map((index)=>`<button type="button" data-sheet="${index}" aria-current="${index===sheet}" aria-label="${escape(text("sheet")+" "+(index+1))}"></button>`).join("");
}
function openProject(project,updateHash=true){
  if(!project)return;
  selected=project;sheet=0;renderSheet();
  if(!$("viewer-dialog").open)$("viewer-dialog").showModal();
  if(updateHash)history.replaceState(null,"",`${location.pathname}${location.search}#project-${project.id}`);
}
function renderMode(){
  $("geometry-mode").textContent=text(geometryLive?"mode3d":"mode2d");
  $("geometry-fallback").hidden=geometryLive;
  $("rotate-object").disabled=!geometryLive;$("reset-object").disabled=!geometryLive;
}
function renderLocale(){
  document.documentElement.lang=locale;
  document.querySelectorAll("[data-text]").forEach((element)=>element.textContent=text(element.dataset.text));
  document.querySelectorAll("[data-label]").forEach((element)=>element.setAttribute("aria-label",text(element.dataset.label)));
  document.querySelectorAll("[data-language]").forEach((button)=>button.setAttribute("aria-pressed",String(button.dataset.language===locale)));
  $("summary").textContent=text("summary");
  $("project-search").placeholder=text("search");$("project-search").setAttribute("aria-label",text("search"));
  $("categories").setAttribute("aria-label",text("projects"));
  $("credentials").innerHTML=certifications.map((item)=>`<li>${escape(item)}</li>`).join("");
  $("geometry").setAttribute("aria-label",text("object"));
  $("rotate-object").setAttribute("aria-label",text("rotate"));$("reset-object").setAttribute("aria-label",text("reset"));
  $("shuffle-quote").setAttribute("aria-label",text("shuffle"));
  document.querySelector(".back-top").setAttribute("aria-label",locale==="id"?"Kembali ke atas":"Back to top");
  $("quote").textContent=text("quotes")[quoteIndex];
  $("draft-error").textContent="";
  renderMode();renderProjects();renderSheet();
}
renderLocale();
let geometry;
try{geometry=createGeometry($("geometry"),(live)=>{geometryLive=live;renderMode();});}catch{geometryLive=false;renderMode();}
document.addEventListener("click",async(event)=>{
  const target=event.target.closest("button");if(!target)return;
  if(target.dataset.language){
    const next=language(target.dataset.language);if(next===locale)return;
    locale=next;const url=new URL(location.href);url.searchParams.set("lang",locale);history.pushState(null,"",url);renderLocale();
  }
  if(target.dataset.category){category=target.dataset.category;renderProjects();}
  if(target.id==="show-all"){expanded=!expanded;renderProjects();if(!expanded)$("projects").scrollIntoView();}
  if(target.id==="clear-filters"){category="all";$("project-search").value="";expanded=false;renderProjects();}
  if(target.dataset.openProject)openProject(projects.find((project)=>project.id===target.dataset.openProject));
  if(target.dataset.close)$(target.dataset.close).close();
  if(target.id==="previous-sheet"){sheet=sheetIndex(sheet,-1);renderSheet();}
  if(target.id==="next-sheet"){sheet=sheetIndex(sheet,1);renderSheet();}
  if(target.dataset.sheet!==undefined){sheet=Number(target.dataset.sheet);renderSheet();}
  if(target.id==="rotate-object")geometry?.rotate();
  if(target.id==="reset-object")geometry?.reset();
  if(target.id==="open-contact"){$("draft-error").textContent="";$("contact-dialog").showModal();}
  if(target.id==="open-about")$("about-dialog").showModal();
  if(target.id==="shuffle-quote"){quoteIndex=nextQuote(quoteIndex,Math.random());$("quote").textContent=text("quotes")[quoteIndex];}
  if(target.id==="copy-profile"||target.id==="copy-link"){
    const value=target.id==="copy-profile"?`${identity.name}\n${identity.title}\n${text("summary")}`:location.href;
    try{await navigator.clipboard.writeText(value);announce(text(target.id==="copy-profile"?"copied":"linkCopied"));}catch{announce(text(target.id==="copy-profile"?"copyFailed":"linkFailed"));}
  }
});
$("project-search").addEventListener("input",renderProjects);
$("viewer-dialog").addEventListener("close",()=>{selected=null;if(projectFromHash(location.hash))history.replaceState(null,"",`${location.pathname}${location.search}#projects`);});
$("viewer-dialog").addEventListener("keydown",(event)=>{
  if(event.key==="ArrowLeft"||event.key==="ArrowRight"){event.preventDefault();sheet=sheetIndex(sheet,event.key==="ArrowLeft"?-1:1);renderSheet();}
});
window.addEventListener("popstate",()=>{locale=language(new URL(location.href).searchParams.get("lang"));renderLocale();const project=projectFromHash(location.hash);if(project)openProject(project,false);else if($("viewer-dialog").open)$("viewer-dialog").close();});
window.addEventListener("hashchange",()=>{const project=projectFromHash(location.hash);if(project)openProject(project,false);});
$("message-form").addEventListener("submit",(event)=>{
  event.preventDefault();
  try{
    const value=messageDraft($("message-subject").value,$("message-body").value,locale);
    const url=URL.createObjectURL(new Blob([value],{type:"text/plain;charset=utf-8"}));
    const link=document.createElement("a");link.href=url;link.download="unsent-portfolio-message.txt";link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    $("message-form").reset();$("contact-dialog").close();announce(text("draftSaved"));
  }catch{$("draft-error").textContent=text("draftError");}
});
window.addEventListener("beforeunload",(event)=>{if($("message-subject").value.trim()||$("message-body").value.trim()){event.preventDefault();event.returnValue="";}});
if(projectFromHash(location.hash))openProject(projectFromHash(location.hash),false);
