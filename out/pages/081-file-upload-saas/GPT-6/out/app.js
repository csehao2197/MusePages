import {MAX_TOTAL,escape,group,bytes,validate,filterItems,safeName} from "./assets/engine.js";
const $=id=>document.getElementById(id),icon=name=>`<svg aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`,delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let items=[],sequence=0,selected=null,category="all",operation=null,viewId=null,editId=null,confirmAction=null,previewUrl=null,viewToken=null;
function samples(){const now=Date.now();items=[{id:`f${++sequence}`,title:"A little project brief",file:new File(["A little project brief\n\nProject: A calmer workspace\nGoal: Keep ideas together.\nNext step: Give one useful file a meaningful title.\n\nOriginal demonstration content. No client data.\n"],"Project brief.txt",{type:"text/plain"}),created:now-120000},{id:`f${++sequence}`,title:"Launch day, without the chaos",file:new File(["task,status\nReview the headline,ready\nCheck small screens,in progress\nTake a little break,planned\n"],"Launch checklist.csv",{type:"text/csv"}),created:now-60000},{id:`f${++sequence}`,title:"A palette with room to breathe",file:new File(['<svg xmlns="http://www.w3.org/2000/svg" width="360" height="120"><rect width="120" height="120" fill="#3267ed"/><rect x="120" width="120" height="120" fill="#f8f8f4"/><rect x="240" width="120" height="120" fill="#729276"/></svg>'],"Brand palette.svg",{type:"image/svg+xml"}),created:now}];}
function status(value){$("status").textContent=value;}
function error(value){$("upload-error").hidden=!value;$("upload-error").textContent=value||"";}
function render(){
  const filtered=filterItems(items,$("search").value,category,$("sort").value),total=items.reduce((sum,item)=>sum+item.file.size,0),busy=Boolean(operation);
  $("side-count").textContent=items.length;$("storage-label").textContent=`${bytes(total)} in this tab`;$("storage-fill").style.width=`${total/MAX_TOTAL*100}%`;$("result-count").textContent=`${filtered.length} ${filtered.length===1?"file":"files"}`;$("empty").hidden=filtered.length>0;
  document.querySelectorAll("[data-category]").forEach(b=>b.classList.toggle("active",b.dataset.category===category));$("category-name").textContent={all:"All files",documents:"Documents",images:"Images",other:"Other files"}[category];
  $("file-list").innerHTML=filtered.map(item=>`<tr data-row="${item.id}"><td><div class="file-cell"><span class="file-type ${group(item.file)}">${icon(group(item.file)==="images"?"image":group(item.file)==="documents"?"file":"other")}</span><div><button class="file-title" data-view="${item.id}" ${busy?"disabled":""}>${escape(item.title)}</button><span class="file-name">${escape(item.file.name)}</span></div></div></td><td>${bytes(item.file.size)}</td><td><time datetime="${new Date(item.created).toISOString()}" title="${escape(new Date(item.created).toLocaleString())}">${escape(new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}).format(item.created))}</time></td><td><span class="ready"><i></i>Local only</span></td><td><div class="row-actions"><button data-download="${item.id}" aria-label="Download ${escape(item.title)}" ${busy?"disabled":""}>${icon("download")}</button><button data-edit="${item.id}" aria-label="Rename ${escape(item.title)}" ${busy?"disabled":""}>${icon("edit")}</button><button data-delete="${item.id}" aria-label="Remove ${escape(item.title)}" ${busy?"disabled":""}>${icon("trash")}</button></div></td></tr>`).join("");
  for(const id of ["title","file-input","add-file","remove-choice","simulate","reset"])$(id).disabled=busy;
  $("progress-panel").hidden=!busy;$("chosen").hidden=!selected;$("chosen-name").textContent=selected?`${selected.name} · ${bytes(selected.size)}`:"";
}
function choose(file){if(operation)return;selected=file||null;error(null);render();if(file)status(`Selected ${file.name}. Add a title, then read this file locally.`);}
function resetProgress(value,label){$("progress").value=value;$("read-label").textContent=label;}
async function readFile(file,title,replacing=null){
  if(operation)return;const problem=validate(title,file,items,replacing);if(problem){error(problem);return;}
  const job={id:Symbol(),cancelled:false,fail:$("simulate").checked};operation=job;$("simulate").checked=false;error(null);render();resetProgress(0,`Reading locally · 0%`);status("Reading actual file bytes into this tab. Nothing is being uploaded.");
  try{
    const parts=[],chunk=256*1024;
    for(let offset=0;offset<Math.max(1,file.size);offset+=chunk){
      const buffer=await file.slice(offset,offset+chunk).arrayBuffer();if(operation!==job)return;
      if(job.fail)throw Error("SIMULATED");parts.push(buffer);const percent=file.size?Math.round(Math.min(file.size,offset+chunk)/file.size*100):100;resetProgress(percent,`Reading locally · ${percent}%`);await delay(35);if(operation!==job)return;
    }
    const copy=new File(parts,file.name,{type:file.type,lastModified:file.lastModified});if(operation!==job)return;
    if(replacing){const item=items.find(i=>i.id===replacing);if(!item)throw Error("REMOVED");item.file=copy;item.updated=Date.now();status("Local bytes replaced. The title is unchanged; nothing changed on Drive.");}
    else{items.push({id:`f${++sequence}`,title:title.trim(),file:copy,created:Date.now()});selected=null;$("file-input").value="";$("title").value="";status("File ready in this tab. Original bytes can be downloaded; Google Drive is not connected.");}
    category="all";$("search").value="";$("sort").value="newest";
  }catch(cause){if(operation===job){error(cause.message==="SIMULATED"?"Simulated local read failure. No file was added or replaced. Try again with the same selection.":"The local file could not be read. Existing files are unchanged. Choose it again and retry.");status("No transfer occurred. Your existing local files are preserved.");}}
  finally{if(operation===job){operation=null;render();}}
}
$("upload-form").addEventListener("submit",event=>{event.preventDefault();readFile(selected,$("title").value);});
$("file-input").addEventListener("change",()=>choose($("file-input").files[0]));
$("remove-choice").addEventListener("click",()=>{choose(null);$("file-input").value="";status("Selection removed. Your workspace is unchanged.");});
for(const name of ["dragenter","dragover"])$("dropzone").addEventListener(name,event=>{event.preventDefault();if(!operation)$("dropzone").classList.add("drag-over");});
$("dropzone").addEventListener("dragleave",()=>$("dropzone").classList.remove("drag-over"));
$("dropzone").addEventListener("drop",event=>{event.preventDefault();$("dropzone").classList.remove("drag-over");if(operation)return;const files=event.dataTransfer?.files;if(files?.length!==1){error("Choose one file at a time for this local workspace.");return;}choose(files[0]);});
window.addEventListener("dragover",event=>event.preventDefault());window.addEventListener("drop",event=>event.preventDefault());
$("cancel-read").addEventListener("click",()=>{if(!operation)return;operation=null;resetProgress(0,"Local read cancelled");render();status("Local read cancelled. No file was added or replaced; your selection is preserved.");});
$("search").addEventListener("input",render);$("sort").addEventListener("change",render);document.querySelectorAll("[data-category]").forEach(button=>button.addEventListener("click",()=>{category=button.dataset.category;render();}));
function download(item){const url=URL.createObjectURL(item.file),anchor=document.createElement("a");anchor.href=url;anchor.download=safeName(item.file.name);document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);status("Original local bytes prepared for download. No Drive request was made.");}
function releasePreview(){viewToken=null;if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=null;$("file-preview").replaceChildren();}
async function view(item){
  releasePreview();viewId=item.id;const token=Symbol();viewToken=token;$("details-title").textContent=item.title;$("detail-error").hidden=true;$("replacement").value="";
  $("file-metadata").innerHTML=`<dt>Original file</dt><dd>${escape(item.file.name)}</dd><dt>Size</dt><dd>${bytes(item.file.size)}</dd><dt>Type</dt><dd>${escape(item.file.type||"Unspecified")}</dd><dt>Added</dt><dd>${escape(new Date(item.created).toLocaleString())}</dd><dt>Location</dt><dd>This tab's memory · no Drive ID</dd>`;
  $("file-preview").textContent="Preparing a local preview…";$("details").showModal();
  if(["image/png","image/jpeg","image/gif","image/webp"].includes(item.file.type)){
    previewUrl=URL.createObjectURL(item.file);const image=new Image();image.alt=`Local preview of ${item.file.name}`;image.onload=()=>{if(viewToken===token)$("file-preview").replaceChildren(image);};image.onerror=()=>{if(viewToken===token)$("file-preview").textContent="This image could not be decoded. Metadata and original-byte download are available.";};image.src=previewUrl;
  }else if(item.file.type.startsWith("text/")||["application/json","image/svg+xml"].includes(item.file.type)){
    try{const source=await item.file.slice(0,80*1024).text();if(viewToken!==token)return;const pre=document.createElement("pre");pre.textContent=source;const note=document.createElement("p");note.textContent=item.file.size>80*1024?"Showing the first 80 KB as plain text. Download for the full file.":"Plain-text preview. Markup and scripts are displayed as source, not executed.";$("file-preview").replaceChildren(pre,note);}
    catch{if(viewToken===token)$("file-preview").textContent="Text preview unavailable. Download the original local bytes instead.";}
  }else $("file-preview").textContent="This file type has no inline preview. Its metadata and original-byte download remain available. No file is executed or scanned.";
}
$("details").addEventListener("close",releasePreview);
$("detail-download").addEventListener("click",()=>{const item=items.find(i=>i.id===viewId);if(item)download(item);});
$("replacement").addEventListener("change",()=>{const item=items.find(i=>i.id===viewId),file=$("replacement").files[0];if(!item||!file)return;const problem=validate(item.title,file,items,item.id);if(problem){$("detail-error").textContent=problem;$("detail-error").hidden=false;return;}$("details").close();readFile(file,item.title,item.id);});
$("file-list").addEventListener("click",event=>{
  if(operation)return;const button=event.target.closest("button");if(!button)return;const id=button.dataset.view||button.dataset.download||button.dataset.edit||button.dataset.delete,item=items.find(i=>i.id===id);if(!item)return;
  if(button.dataset.view)view(item);else if(button.dataset.download)download(item);else if(button.dataset.edit){editId=item.id;$("rename-title").value=item.title;$("rename-error").hidden=true;$("rename").showModal();}else confirm("delete",item.id);
});
$("rename-form").addEventListener("submit",event=>{event.preventDefault();const title=$("rename-title").value.trim(),item=items.find(i=>i.id===editId);if(!title||title.length>80){$("rename-error").hidden=false;$("rename-error").textContent="Use a title of 1–80 characters.";return;}if(item){item.title=title;item.updated=Date.now();}render();$("rename").close();status("Title updated locally. The original filename and bytes are unchanged.");});
function confirm(type,id=null){if(operation)return;confirmAction={type,id};$("confirm-title").textContent=type==="reset"?"A fresh start?":"Make a little space?";$("confirm-description").textContent=type==="reset"?"Reset all local files and edits to the three original samples. This affects only this tab.":`Remove “${items.find(i=>i.id===id)?.title}” from this tab? The original device file stays untouched.`;$("confirm-action").textContent=type==="reset"?"Reset local workspace":"Remove local file";$("confirm").showModal();}
$("reset").addEventListener("click",()=>confirm("reset"));
$("confirm-action").addEventListener("click",()=>{if(!confirmAction)return;if(confirmAction.type==="reset"){samples();selected=null;$("file-input").value="";$("title").value="";$("search").value="";category="all";$("sort").value="newest";error(null);status("Workspace reset to the three original samples.");}else{items=items.filter(item=>item.id!==confirmAction.id);status("File removed from this tab. Original files and Google Drive are unchanged.");}confirmAction=null;render();$("confirm").close();});
const info={
  connection:["A Drive connection, clearly explained.","Google Drive is not connected. This static concept reads actual selected bytes into this tab's memory; no bytes leave the browser. A live Drive portal requires a private upload API, administrator authorization, authenticated ownership checks, a database, and production limits. No Drive IDs or tokens exist here."],
  account:["Your local space. No account needed.","Sign in, signup, password reset, and account management are not connected in this static concept. No password or email is requested. Explore the fictional sample files or use a fictional local file. Reloading resets everything."],
  privacy:["What this preview keeps.","Selected bytes and titles exist only in this tab's JavaScript memory. There is no upload API, analytics, cookie, localStorage, sessionStorage, account, or Drive connection. Downloads contain local bytes. Use fictional files; normal browser and hosting behavior still applies."],
  terms:["A demonstration with clear boundaries.","This is a non-production interface concept, not a cloud storage or backup service. Files and edits disappear on reload. It has no authentication, ownership isolation, malware scanning, cloud deletion, security guarantee, or service-level commitment. Original file and resource rights remain with their respective owners."]
};
document.querySelectorAll("[data-info]").forEach(b=>b.addEventListener("click",()=>{const [title,body]=info[b.dataset.info];$("info-title").textContent=title;$("info-body").textContent=body;$("info").showModal();}));
$("try-workspace").addEventListener("click",()=>{$("info").close();$("workspace").scrollIntoView();$("title").focus({preventScroll:true});});
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>$(b.dataset.close).close()));
function menu(open){$("navigation").classList.toggle("open",open);$("menu").setAttribute("aria-expanded",String(open));}
$("menu").addEventListener("click",()=>menu(!$("navigation").classList.contains("open")));$("navigation").addEventListener("click",()=>menu(false));document.addEventListener("keydown",event=>{if(event.key==="Escape")menu(false);});matchMedia("(max-width:600px)").addEventListener("change",()=>menu(false));window.addEventListener("pagehide",()=>{operation=null;releasePreview();});
samples();render();status("Three original sample files. All files and edits stay in this tab.");
