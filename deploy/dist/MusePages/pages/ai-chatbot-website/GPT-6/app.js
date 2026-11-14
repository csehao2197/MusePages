import {starters,chooseReply,sampleHtml,escape,failureMessages} from "./assets/engine.js";
const $=id=>document.getElementById(id),icon=name=>`<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
let sequence=1,messageSequence=0,chats=[{id:"c1",title:"New conversation",messages:[],draft:"",error:null}],active="c1",pending=null,nextBehavior="normal",confirmation=null;
const current=()=>chats.find(c=>c.id===active),time=()=>new Date().toISOString();
function status(value){$("status").textContent=value;}
$("starters").innerHTML=starters.map(item=>`<button class="starter" data-starter="${item.id}">${icon(item.icon)}<span><b>${escape(item.label)}</b><small>${escape(item.hint)}</small></span><svg class="icon starter-arrow" aria-hidden="true"><use href="assets/icons.svg#up"/></svg></button>`).join("");
function resizeInput(){$("prompt").style.height="auto";$("prompt").style.height=`${Math.max(28,Math.min(120,$("prompt").scrollHeight))}px`;}
function renderInput(){
  const chat=current(),busy=Boolean(pending),limited=chat.messages.filter(m=>m.role==="user").length>=20;
  $("prompt").value=chat.draft;$("prompt").disabled=busy||limited;$("send").disabled=busy||limited||!chat.draft.trim();
  $("stop").hidden=!busy;$("loading").hidden=!busy;$("limit-note").hidden=!limited;$("char-count").textContent=`${chat.draft.length.toLocaleString("en-US")} / 2,000`;
  $("clear-chat").disabled=chat.messages.length===0;
  $("error-panel").hidden=!chat.error;
  if(chat.error){$("error-message").textContent=chat.error.message;$("error-title").textContent=chat.error.type==="stopped"?"Local sample stopped":"Simulated failure";$("retry").disabled=busy;}
  resizeInput();
}
function renderSidebar(){
  const query=$("search").value.trim().toLowerCase(),visible=[...chats].reverse().filter(c=>c.title.toLowerCase().includes(query));
  $("chat-list").innerHTML=visible.map(chat=>`<div class="chat-item ${chat.id===active?"active":""}"><button class="select-chat" data-chat="${chat.id}" ${chat.id===active?'aria-current="page"':""}>${icon("message")}<span>${escape(chat.title)}</span></button><button class="delete-chat" data-delete="${chat.id}" aria-label="Delete ${escape(chat.title)}">${icon("trash")}</button></div>`).join("");
  $("no-search").hidden=visible.length>0;$("chat-count").textContent=`${chats.length} / 8`;
}
function renderMessages(){
  const chat=current(),transcript=$("transcript");$("welcome").hidden=chat.messages.length>0;
  if(transcript.dataset.chat!==chat.id){transcript.replaceChildren();transcript.dataset.chat=chat.id;}
  const ids=new Set(chat.messages.map(m=>m.id));for(const node of [...transcript.children])if(!ids.has(node.dataset.id))node.remove();
  for(const message of chat.messages){
    let node=transcript.querySelector(`[data-id="${message.id}"]`);
    if(!node){
      node=document.createElement("article");node.className=`message ${message.role}`;node.dataset.id=message.id;
      const stamp=`<time datetime="${message.time}" title="${escape(new Date(message.time).toLocaleString())}">${escape(new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit"}).format(new Date(message.time)))}</time>`;
      node.innerHTML=message.role==="user"?`<div class="message-content"><p class="user-text">${escape(message.content)}</p><span class="message-status"></span>${stamp}</div>`:`<span class="assistant-avatar">${icon("orbit")}</span><div class="message-content"><div class="assistant-label">Orbit<span>FIXED LOCAL SAMPLE</span></div><div class="sample-body">${sampleHtml(message.content)}</div><div class="message-footer">${stamp}<button class="copy-button" data-copy="${message.id}" aria-label="Copy local sample">${icon("copy")}Copy</button></div></div>`;
      transcript.append(node);
    }
    if(message.role==="user")node.querySelector(".message-status").textContent=message.state==="failed"?"No sample reply · simulated failure":message.state==="stopped"?"No sample reply · stopped":"";
  }
}
function render(){renderSidebar();renderMessages();renderInput();}
function bottom(){$("chat-scroll").scrollTop=$("chat-scroll").scrollHeight;}
function stopPending(message="Stopped locally. Retry when you are ready."){
  if(!pending)return;
  clearTimeout(pending.timer);const chat=chats.find(c=>c.id===pending.chat),user=chat?.messages.find(m=>m.id===pending.user);
  if(user){user.state="stopped";chat.error={type:"stopped",message,user:user.id};}
  pending=null;render();
}
function beginReply(chat,user,retry=false){
  if(pending)return;const behavior=retry?"normal":nextBehavior;nextBehavior="normal";$("next-behavior").value="normal";chat.error=null;user.state="pending";
  const request={chat:chat.id,user:user.id,timer:null};pending=request;render();bottom();status("Preparing a fixed local sample. No network request is made.");
  request.timer=setTimeout(()=>{
    if(pending!==request||!chats.includes(chat))return;pending=null;
    if(failureMessages[behavior]){
      user.state="failed";chat.error={type:behavior,message:failureMessages[behavior],user:user.id};
      console.info(`Local chatbot simulation: ${behavior}`);status("Simulated failure only. Retry is available.");
    }else{
      const result=chooseReply(user.content,chat.messages);user.state="complete";
      chat.messages.push({id:`m${++messageSequence}`,role:"assistant",content:result.body,topic:result.topic,time:time()});status("Fixed local sample ready. Gemini was not called.");
    }
    render();bottom();if(!document.querySelector("dialog[open]")&&!$("prompt").disabled)$("prompt").focus({preventScroll:true});
  },700);
}
function send(){
  const chat=current(),value=chat.draft.trim();if(pending||chat.messages.filter(m=>m.role==="user").length>=20)return;
  const result=chooseReply(value,chat.messages);if(result.error){status(result.error);return;}
  const user={id:`m${++messageSequence}`,role:"user",content:value,time:time(),state:"pending"};chat.messages.push(user);
  if(chat.messages.filter(m=>m.role==="user").length===1)chat.title=value.replace(/\s+/g," ").slice(0,36)+(value.replace(/\s+/g," ").length>36?"…":"");
  chat.draft="";beginReply(chat,user);
}
function sidebar(open){
  const mobile=matchMedia("(max-width:800px)").matches;$("sidebar").classList.toggle("open",mobile&&open);$("sidebar").inert=mobile&&!open;$("sidebar-shade").hidden=!mobile||!open;$("toggle-sidebar").setAttribute("aria-expanded",String(mobile&&open));
}
function newChat(){
  if(!current().messages.length){sidebar(false);$("prompt").focus();status("This empty conversation is ready. Your unsent draft is preserved.");return;}
  if(chats.length>=8){status("This local preview holds eight conversations. Remove one to start another.");return;}
  stopPending("Stopped when a new conversation opened. Return here to retry.");
  const chat={id:`c${++sequence}`,title:"New conversation",messages:[],draft:"",error:null};chats.push(chat);active=chat.id;$("search").value="";render();sidebar(false);bottom();$("prompt").focus();status("New local conversation. Earlier chats remain in this tab.");
}
$("new-chat").addEventListener("click",newChat);
$("search").addEventListener("input",renderSidebar);
$("chat-list").addEventListener("click",event=>{
  const button=event.target.closest("button");if(!button)return;
  if(button.dataset.chat){
    if(button.dataset.chat!==active)stopPending("Stopped when switching conversations. Retry when you return.");active=button.dataset.chat;render();sidebar(false);bottom();if(!$("prompt").disabled)$("prompt").focus({preventScroll:true});status("Local conversation opened.");
  }else if(button.dataset.delete)showConfirm("delete",button.dataset.delete);
});
$("prompt").addEventListener("input",()=>{current().draft=$("prompt").value;$("send").disabled=Boolean(pending)||!current().draft.trim();$("char-count").textContent=`${current().draft.length.toLocaleString("en-US")} / 2,000`;resizeInput();});
$("prompt").addEventListener("keydown",event=>{if(event.key==="Enter"&&!event.shiftKey&&!event.isComposing){event.preventDefault();send();}});
$("composer").addEventListener("submit",event=>{event.preventDefault();send();});
$("starters").addEventListener("click",event=>{
  const button=event.target.closest("[data-starter]");if(!button||pending)return;current().draft=starters.find(s=>s.id===button.dataset.starter).prompt;renderInput();$("prompt").focus();status("Starter added to your input. Review it, then send.");
});
$("stop").addEventListener("click",()=>{stopPending();if(!$("prompt").disabled)$("prompt").focus();status("Local sample stopped. No reply was added.");});
$("retry").addEventListener("click",()=>{const chat=current(),user=chat.messages.find(m=>m.id===chat.error?.user);if(user)beginReply(chat,user,true);});
$("transcript").addEventListener("click",async event=>{
  const button=event.target.closest("[data-copy]");if(!button)return;
  const message=current().messages.find(m=>m.id===button.dataset.copy);if(!message)return;
  try{await navigator.clipboard.writeText(message.content);if(button.isConnected){button.innerHTML=`${icon("check")}Copied`;status("Local sample copied.");}}
  catch{if(button.isConnected){button.innerHTML=`${icon("info")}Copy unavailable`;status("Clipboard unavailable. Select the sample text to copy manually.");}}
});
function showConfirm(type,id){
  const chat=chats.find(c=>c.id===id);if(!chat)return;confirmation={type,id};
  $("confirm-title").textContent=type==="delete"?"Remove this conversation?":"Clear this conversation?";
  $("confirm-description").textContent=`${chat.title}. ${type==="delete"?"This removes this conversation from this tab.":"This clears messages and the unsent draft; other conversations stay unchanged."} Reloading resets the whole preview.`;
  $("confirm-action").textContent=type==="delete"?"Remove local conversation":"Clear local history";$("confirm").showModal();
}
$("clear-chat").addEventListener("click",()=>showConfirm("clear",active));
$("confirm-action").addEventListener("click",()=>{
  if(!confirmation)return;const {type,id}=confirmation;if(pending?.chat===id)stopPending("Stopped because this conversation was cleared.");
  if(type==="delete"){chats=chats.filter(c=>c.id!==id);if(!chats.length)chats.push({id:`c${++sequence}`,title:"New conversation",messages:[],draft:"",error:null});if(active===id)active=chats[0].id;}
  else{const chat=chats.find(c=>c.id===id);if(chat){chat.title="New conversation";chat.messages=[];chat.draft="";chat.error=null;}}
  confirmation=null;$("confirm").close();render();bottom();if(!$("prompt").disabled)$("prompt").focus();status(type==="delete"?"Local conversation removed.":"Current local conversation cleared.");
});
document.querySelectorAll("[data-connection]").forEach(b=>b.addEventListener("click",()=>$("connection").showModal()));
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>$(b.dataset.close).close()));
$("open-controls").addEventListener("click",()=>$("controls").showModal());
$("controls-form").addEventListener("submit",event=>{event.preventDefault();nextBehavior=$("next-behavior").value;$("controls").close();status(nextBehavior==="normal"?"Next reply: normal fixed sample.":`Next reply: simulated ${nextBehavior} failure. No provider is connected.`);});
$("toggle-sidebar").addEventListener("click",()=>{sidebar(true);$("search").focus();});
for(const id of ["close-sidebar","sidebar-shade"])$(id).addEventListener("click",()=>{sidebar(false);$("toggle-sidebar").focus();});
matchMedia("(max-width:800px)").addEventListener("change",()=>sidebar(false));
document.addEventListener("keydown",event=>{
  if(document.querySelector("dialog[open]"))return;
  if(event.altKey&&event.key.toLowerCase()==="n"){event.preventDefault();newChat();}
  else if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="k"){event.preventDefault();if(matchMedia("(max-width:800px)").matches)sidebar(true);$("search").focus();}
  else if(event.key==="Escape"){if($("sidebar").classList.contains("open")){sidebar(false);$("toggle-sidebar").focus();}else if(pending){stopPending();status("Local sample stopped by Escape.");}}
});
function offline(){$("offline").hidden=navigator.onLine;}
window.addEventListener("offline",offline);window.addEventListener("online",offline);
window.addEventListener("pagehide",()=>{if(pending)clearTimeout(pending.timer);pending=null;});
sidebar(false);offline();render();
