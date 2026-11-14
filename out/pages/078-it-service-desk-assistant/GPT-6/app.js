import {tickets,commands,pastTickets,esc,markdownHtml,replyFor,suggestions,reserveReply} from "./assets/engine.js";
const $=id=>document.getElementById(id),icon=name=>`<svg aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
let current=tickets[0],histories=new Map(tickets.map(t=>[t.id,[]])),times=[],sequence=0,options=[],optionIndex=0,opener=null,resetTarget=null;
function openDialog(id,button){opener=button?.isConnected?button:document.activeElement;$(id).showModal();}
document.querySelectorAll("dialog").forEach(d=>d.addEventListener("close",()=>{if(d.open)return;(opener?.isConnected&&!opener.disabled?opener:$("prompt")).focus();opener=null;}));
function closeDialog(id){if($(id).open)$(id).close();}
function launch(command){$("gateway").hidden=true;$("workspace").hidden=false;if(innerWidth<=800)$("context-details").open=false;renderContext();renderChat();window.scrollTo({top:0});if(command)send(command);else $("prompt").focus({preventScroll:true});}
function detailTab(config){$("config-panel").hidden=!config;$("notes-list").hidden=config;$("notes-tab").classList.toggle("selected",!config);$("config-tab").classList.toggle("selected",config);$("notes-tab").setAttribute("aria-pressed",!config);$("config-tab").setAttribute("aria-pressed",config);}
function renderContext(){
  $("context-id").textContent=current.id;$("context-status").textContent=current.status;$("context-title").textContent=current.title;$("context-company").textContent=current.company+" · Fictional company";$("note-count").textContent=current.notes.length;
  $("notes-list").innerHTML=current.notes.map(n=>`<article class="note" id="note-${n.id}" tabindex="-1"><div class="note-top"><code>${n.id}</code><span>${n.type}</span><time>${n.time}</time></div><p>${esc(n.text)}</p></article>`).join("");
  $("config-panel").innerHTML=`${icon("device")}<h4>${current.device}</h4><p>${esc(current.config)}</p><p class="small-note">Fictional inventory. No device discovery or live system access.</p>`;detailTab(false);
}
function renderChat(){
  const history=histories.get(current.id);$("welcome").hidden=history.length>0;
  $("messages").innerHTML=history.map(m=>`<article class="message-pair" data-message="${m.id}"><div class="question"><p>${esc(m.question)}</p></div><div class="response"><div class="response-head"><img src="assets/favicon.svg" width="18" height="18" alt=""><span>TicketWise</span><span>LOCAL SAMPLE · NOT AI</span></div><h3>${esc(m.result.title)}</h3><div class="response-content">${markdownHtml(m.result.markdown)}</div>${m.result.matched?`<p class="match-label">Keyword match → ${m.result.command}. This is a fixed response.</p>`:""}${m.result.matches?.length?`<div class="history-links">${m.result.matches.map(p=>`<button data-history="${p.id}"><span>${p.id} · ${esc(p.title)}<small>${p.scope} · ${p.date.slice(0,10)}</small></span>${icon("up")}</button>`).join("")}</div>`:""}<div class="response-meta"><span>${m.result.sources.length?"Sample note sources":"No matching source"}</span>${m.result.sources.map(n=>`<button class="source-button" data-note="${n}" aria-label="Read sample note ${n}">${n}</button>`).join("")}<button class="copy-button" data-copy="${m.id}" aria-label="Copy response ${m.id}">${icon("copy")}<span>Copy response</span></button></div></div></article>`).join("");
  $("chat-body").scrollTop=$("chat-body").scrollHeight;
}
function clearMenu(){options=[];$("command-menu").hidden=true;$("prompt").setAttribute("aria-expanded","false");$("prompt").removeAttribute("aria-activedescendant");}
function renderOptions(){options=suggestions($("prompt").value);optionIndex=Math.min(optionIndex,Math.max(0,options.length-1));$("command-menu").hidden=!options.length;$("prompt").setAttribute("aria-expanded",options.length>0);$("command-options").innerHTML=options.map((c,i)=>`<button type="button" role="option" id="command-${i}" data-option="${i}" aria-selected="${i===optionIndex}" class="${i===optionIndex?"active":""}"><code>${c.name}</code><span>${c.label}</span></button>`).join("");if(options.length)$("prompt").setAttribute("aria-activedescendant",`command-${optionIndex}`);else $("prompt").removeAttribute("aria-activedescendant");}
function composerState(){const length=$("prompt").value.length;$("char-count").textContent=`${length} / 1200`;$("send").disabled=!$("prompt").value.trim();}
function chooseOption(index){const option=options[index];if(!option)return;$("prompt").value=option.name;clearMenu();composerState();$("prompt").focus();}
function askReset(button){resetTarget=current.id;openDialog("refresh-confirm",button);}
function send(value){
  if($("workspace").hidden)return;const input=value.trim();if(!input)return;
  if(input.toLowerCase()==="/refresh"){$("prompt").value="";composerState();clearMenu();askReset($("prompt"));return;}
  const permit=reserveReply(times,Date.now());times=permit.times;
  if(!permit.allowed){$("chat-status").textContent=`Local guard reached. Try again in ${Math.ceil(permit.retryAfterMs/1000)} seconds. Clearing chat does not reset this window.`;return;}
  try{const result=replyFor(input,current);histories.get(current.id).push({id:++sequence,question:input,result});$("prompt").value="";composerState();clearMenu();renderChat();$("chat-status").textContent=`Fixed local reply · ${30-times.length} replies left in this rolling minute · Nothing sent externally.`;$("prompt").focus({preventScroll:true});}catch(error){$("chat-status").textContent=error.message;}
}
async function copyResponse(id,button){
  const message=histories.get(current.id).find(m=>m.id===id);if(!message)return;
  const plain=`${message.result.title}\n\n${message.result.markdown.replace(/^## /gm,"").replace(/\*\*/g,"")}\n\nFictional ${current.id} · Fixed local response · Sources: ${message.result.sources.join(", ")||"none"}`;
  const html=`<div><h3>${esc(message.result.title)}</h3>${markdownHtml(message.result.markdown)}<p>Fictional ${current.id} · Fixed local response · Sources: ${message.result.sources.join(", ")||"none"}</p></div>`;
  let label="";
  try{if(navigator.clipboard?.write&&window.ClipboardItem){try{await navigator.clipboard.write([new ClipboardItem({"text/html":new Blob([html],{type:"text/html"}),"text/plain":new Blob([plain],{type:"text/plain"})})]);label="Copied rich text";}catch{await navigator.clipboard.writeText(plain);label="Copied plain text";}}else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(plain);label="Copied plain text";}else throw Error("Clipboard unavailable");
    if(button.isConnected){button.innerHTML=icon("check")+`<span>${label}</span>`;$("chat-status").textContent=label+". Review before pasting into another app.";}
  }catch{if(button.isConnected){button.innerHTML=icon("copy")+"<span>Copy unavailable</span>";$("chat-status").textContent="Clipboard permission is unavailable. Select the response text to copy it manually.";}}
}
$("chat-form").addEventListener("submit",e=>{e.preventDefault();send($("prompt").value);});
$("prompt").addEventListener("input",()=>{optionIndex=0;composerState();renderOptions();});
$("prompt").addEventListener("keydown",e=>{if(e.isComposing)return;if(options.length&&(e.key==="ArrowDown"||e.key==="ArrowUp")){e.preventDefault();optionIndex=(optionIndex+(e.key==="ArrowDown"?1:-1)+options.length)%options.length;renderOptions();$(`command-${optionIndex}`).scrollIntoView({block:"nearest"});}else if(options.length&&(e.key==="Tab"||(e.key==="Enter"&&!e.shiftKey&&$("prompt").value.trim()!==options[optionIndex].name))){e.preventDefault();chooseOption(optionIndex);}else if(e.key==="Escape"){clearMenu();}else if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send($("prompt").value);}});
$("show-commands").addEventListener("click",()=>{$("prompt").value="/";optionIndex=0;composerState();renderOptions();$("prompt").focus();});
$("ticket-select").addEventListener("change",()=>{current=tickets.find(t=>t.id===$("ticket-select").value);$("prompt").value="";composerState();clearMenu();renderContext();renderChat();$("chat-status").textContent="Switched fictional ticket. Its own in-memory conversation is shown.";});
$("notes-tab").addEventListener("click",()=>detailTab(false));$("config-tab").addEventListener("click",()=>detailTab(true));
$("new-chat").addEventListener("click",e=>askReset(e.currentTarget));
$("confirm-refresh").addEventListener("click",()=>{if(resetTarget)histories.set(resetTarget,[]);resetTarget=null;renderChat();closeDialog("refresh-confirm");$("chat-status").textContent="This ticket’s local chat was cleared. Notes, other chats, and the reply guard are unchanged.";});
$("leave-demo").addEventListener("click",()=>{clearMenu();$("workspace").hidden=true;$("gateway").hidden=false;window.scrollTo({top:0});document.querySelector(".hero [data-launch]").focus({preventScroll:true});});
document.addEventListener("click",e=>{
  const button=e.target.closest("button");if(!button||button.disabled)return;
  if(button.dataset.close)closeDialog(button.dataset.close);
  else if(button.hasAttribute("data-about"))openDialog("about",button);
  else if(button.hasAttribute("data-launch"))launch();
  else if(button.dataset.command)launch(button.dataset.command);
  else if(button.dataset.chatCommand)send(button.dataset.chatCommand);
  else if(button.dataset.option!==undefined)chooseOption(Number(button.dataset.option));
  else if(button.dataset.copy)copyResponse(Number(button.dataset.copy),button);
  else if(button.dataset.note){detailTab(false);$("context-details").open=true;document.querySelectorAll(".note").forEach(n=>n.classList.toggle("current",n.id===`note-${button.dataset.note}`));const note=$(`note-${button.dataset.note}`);note.focus({preventScroll:true});note.scrollIntoView({block:"nearest",behavior:"smooth"});}
  else if(button.dataset.history){const record=pastTickets.find(t=>t.id===button.dataset.history);if(!record)return;$("past-meta").textContent=`${record.id} · ${record.date.slice(0,10)} · ${record.scope}`;$("past-title").textContent=record.title;$("past-company").textContent=record.company+" · Fictional company";$("past-resolution").textContent=record.resolution;openDialog("past-record",button);}
});
composerState();
