import {posts,initialRules,validateRule,evaluate,escape} from "./assets/engine.js";
const $=id=>document.getElementById(id),icon=name=>`<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
let rules=initialRules(),plan="FREE",nextId=3,editing=null,deleting=null,pendingLaunch=false,history=[],eventCount=0,commentCount=0,dmCount=0;
const counts=new Map(),postOptions=posts.map(p=>`<option value="${p.id}">${escape(p.name)}</option>`).join("");
$("sim-post").innerHTML=postOptions;$("rule-form").elements.post.innerHTML=postOptions;
function status(message){$("status").textContent=message;}
function renderMetrics(){
  $("active-count").textContent=rules.filter(r=>r.active).length;$("comment-count").textContent=commentCount;$("dm-count").textContent=dmCount;$("event-count").textContent=eventCount;
  $("plan-badge").textContent=plan==="PRO"?"PRO preview · fixed sample":"Free preview";
}
function renderRules(){
  $("rules").innerHTML=rules.map(rule=>`<article class="rule-card" data-rule="${rule.id}"><div class="rule-top"><b>${escape(rule.name)}</b><button class="switch-control" role="switch" aria-checked="${rule.active}" aria-label="Toggle ${escape(rule.name)}" data-toggle="${rule.id}"></button></div><div class="rule-meta">${icon(rule.trigger==="COMMENT"?"message":"send")}<span>${rule.trigger==="COMMENT"?escape(posts.find(p=>p.id===rule.post)?.name||"Sample post"):"Direct message"}</span><span class="rule-type ${rule.mode==="SMARTAI"?"pro-mode":""}">${rule.mode==="MESSAGE"?"Static reply":plan==="PRO"?"Fixed AI-mode sample":"PRO mode · unavailable on Free"}</span></div><div class="keyword-list">${rule.keywords.map(k=>`<span>${escape(k)}</span>`).join("")}</div><p class="rule-reply">${escape(rule.mode==="MESSAGE"?rule.reply:"This mode returns one fixed sentence, not an AI response to your instruction.")}</p><div class="rule-bottom"><span>${counts.get(rule.id)||0} local ${(counts.get(rule.id)||0)===1?"reply":"replies"}</span><button data-edit="${rule.id}" aria-label="Edit ${escape(rule.name)}">${icon("pencil")}Edit</button><button data-delete="${rule.id}" aria-label="Remove ${escape(rule.name)}">${icon("trash")}Remove</button></div></article>`).join("");
  $("rules-empty").hidden=rules.length>0;$("new-rule").disabled=rules.length>=12;renderMetrics();
}
function renderHistory(){
  $("history").innerHTML=history.length?history.map(item=>`<article class="history-card"><div class="history-label"><span>${item.event.trigger==="COMMENT"?"Comment · "+escape(posts.find(p=>p.id===item.event.post)?.name||"Sample post"):"Direct message"}</span><span>Local event ${item.number}</span></div><p class="history-in">${escape(item.event.text)}</p><p class="history-out">${item.result.matched?`${escape(item.result.reply)}\n${escape(item.result.mode==="SMARTAI"?"Fixed PRO preview · not AI":"Static sample reply")} · ${escape(item.result.name)}`:"No eligible rule matched. No reply simulated."}</p></article>`).join(""):'<p class="no-history">Nothing here yet. A little test will get things started.</p>';
  $("clear-history").disabled=history.length===0;
}
function launch(){
  $("landing").hidden=true;$("workspace").hidden=false;$("site-nav").classList.remove("open");$("nav-toggle").setAttribute("aria-expanded","false");renderRules();renderHistory();window.scrollTo({top:0,behavior:"instant"});
}
function showPlans(launchAfter=false,preferred){
  pendingLaunch=launchAfter;$("plans").showModal();if(preferred)$("plans").querySelector(`[data-select-plan="${preferred}"]`).focus();
}
document.querySelectorAll("[data-launch]").forEach(b=>b.addEventListener("click",launch));
document.querySelectorAll("[data-connect]").forEach(b=>b.addEventListener("click",()=>$("connection").showModal()));
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>$(b.dataset.close).close()));
document.querySelectorAll("[data-plan]").forEach(b=>b.addEventListener("click",()=>showPlans(true,b.dataset.plan)));
document.querySelectorAll("[data-select-plan]").forEach(b=>b.addEventListener("click",()=>{
  plan=b.dataset.selectPlan;$("plans").close();if(pendingLaunch)launch();else{renderRules();renderMetrics();}status(`${plan==="PRO"?"PRO fixed-sample":"Free static-reply"} preview selected. No subscription changed.`);
}));
$("change-plan").addEventListener("click",()=>showPlans());
$("leave").addEventListener("click",()=>{$("landing").hidden=false;$("workspace").hidden=true;window.scrollTo({top:0,behavior:"instant"});document.querySelector(".hero [data-launch]").focus({preventScroll:true});});
$("nav-toggle").addEventListener("click",()=>{const open=$("site-nav").classList.toggle("open");$("nav-toggle").setAttribute("aria-expanded",String(open));});
$("site-nav").querySelectorAll("a[href^='#']").forEach(a=>a.addEventListener("click",()=>{
  $("landing").hidden=false;$("workspace").hidden=true;$("site-nav").classList.remove("open");$("nav-toggle").setAttribute("aria-expanded","false");
}));
$("hero-form").addEventListener("submit",event=>{
  event.preventDefault();const result=evaluate([initialRules()[0]],{trigger:"COMMENT",post:"weekend",text:$("hero-comment").value});
  $("hero-result").textContent=result.error|| (result.matched?`Local reply: ${result.reply}`:"No match. Try the complete word “guide” or “weekend”. Nothing was sent.");
});
const form=$("rule-form");
function updateEditor(){
  const ai=form.elements.mode.value==="SMARTAI",dm=form.elements.trigger.value==="DM";$("rule-post-field").hidden=dm;$("reply-field").hidden=ai;$("instruction-field").hidden=!ai;
  $("mode-note").textContent=ai?"PRO preview uses one fixed sentence, independent of this instruction. No AI is called.":"Your exact message is used for a matching event.";
}
function openEditor(rule){
  editing=rule?.id||null;form.reset();$("form-error").textContent="";$("editor-title").textContent=rule?"Edit your sample rule":"Create a sample rule";
  form.elements.mode.querySelector('[value="SMARTAI"]').disabled=plan!=="PRO";
  if(rule){for(const key of ["name","trigger","post","mode","reply","prompt"])form.elements[key].value=rule[key];form.elements.keywords.value=rule.keywords.join(", ");form.elements.active.checked=rule.active;}
  else{form.elements.reply.value="Thanks for your message — here's a little inspiration for your next chapter.";form.elements.post.value=posts[0].id;}
  updateEditor();$("editor").showModal();form.elements.name.focus();
}
$("new-rule").addEventListener("click",()=>openEditor());
form.elements.mode.addEventListener("change",updateEditor);form.elements.trigger.addEventListener("change",updateEditor);
form.addEventListener("submit",event=>{
  event.preventDefault();const values=Object.fromEntries(new FormData(form));values.active=form.elements.active.checked;
  const result=validateRule(values,plan);if(result.error){$("form-error").textContent=result.error;return;}
  if(editing){const index=rules.findIndex(r=>r.id===editing);if(index<0){$("form-error").textContent="This local rule is no longer available.";return;}rules[index]={...result.rule,id:editing};}
  else{if(rules.length>=12){$("form-error").textContent="This local preview holds up to 12 rules.";return;}rules.push({...result.rule,id:`r${nextId++}`});}
  $("editor").close();renderRules();status("Sample rule saved in this tab. Instagram was not changed.");$("new-rule").focus({preventScroll:true});
});
$("rules").addEventListener("click",event=>{
  const button=event.target.closest("button");if(!button)return;const id=button.dataset.toggle||button.dataset.edit||button.dataset.delete,rule=rules.find(r=>r.id===id);if(!rule)return;
  if(button.dataset.toggle){rule.active=!rule.active;renderRules();$("rules").querySelector(`[data-toggle="${rule.id}"]`).focus({preventScroll:true});status(`${rule.name} is ${rule.active?"active":"paused"} in local tests.`);}
  else if(button.dataset.edit)openEditor(rule);
  else{deleting=rule.id;$("delete-name").textContent=rule.name;$("delete-confirm").showModal();}
});
$("confirm-delete").addEventListener("click",()=>{
  rules=rules.filter(r=>r.id!==deleting);deleting=null;$("delete-confirm").close();renderRules();status("Local rule removed. Previous history and totals are unchanged.");$("new-rule").focus({preventScroll:true});
});
$("sim-trigger").addEventListener("change",()=>{$("sim-post-field").hidden=$("sim-trigger").value==="DM";});
$("simulator").addEventListener("submit",event=>{
  event.preventDefault();const sample={trigger:$("sim-trigger").value,post:$("sim-post").value,text:$("sim-text").value.trim()},result=evaluate(rules,sample,plan);
  if(result.error){status(result.error);return;}eventCount++;
  if(result.matched){counts.set(result.ruleId,(counts.get(result.ruleId)||0)+1);if(sample.trigger==="COMMENT")commentCount++;else dmCount++;}
  $("test-result").classList.toggle("matched",result.matched);
  $("test-result").innerHTML=result.matched?`<span class="result-kicker">${result.mode==="SMARTAI"?"Fixed PRO sample · not generated by AI":"Static reply · locally simulated"}</span><h4>${escape(result.name)}</h4><div class="reply-text">${escape(result.reply)}</div><span class="result-foot">Nothing was sent to Instagram. ${result.mode==="SMARTAI"?"Your sample instruction was not used.":"First eligible rule selected."}</span>`:`${icon("info")}<p>No eligible rule matched. No reply simulated.</p>`;
  $("trace-details").hidden=false;
  $("trace").innerHTML=result.evaluations.length?result.evaluations.map(item=>`<div class="trace-rule"><b>${escape(item.name)}${item.id===result.ruleId?" · selected":""}</b><ul>${item.steps.map(step=>`<li class="${step.ok?"":"failed"}">${icon(step.ok?"check":"close")}${escape(step.label)}</li>`).join("")}</ul></div>`).join(""):"Your rulebook is empty.";
  history.unshift({number:eventCount,event:sample,result});history=history.slice(0,12);renderRules();renderHistory();status(result.matched?"Reply simulated locally. No real message was sent.":"No reply simulated. Open the trace to see why.");
});
$("clear-history").addEventListener("click",()=>{history=[];renderHistory();status("Local conversation history cleared. Counters and rules are unchanged.");});
renderRules();renderHistory();
