export const KEY="focus-pomodoro-local-v1";
export const DEFAULTS=Object.freeze({focus:25,short:5,long:15,autoBreaks:false,autoFocus:false,interval:4});
export const PHASES=Object.freeze(["focus","short","long"]);
export function validSettings(s){return Boolean(s&&["focus","short","long"].every(k=>Number.isInteger(s[k])&&s[k]>=1&&s[k]<=(k==="focus"?180:60))&&Number.isInteger(s.interval)&&s.interval>=1&&s.interval<=12&&typeof s.autoBreaks==="boolean"&&typeof s.autoFocus==="boolean");}
export function fresh(){return {version:1,settings:{...DEFAULTS},phase:"focus",durationMs:1500000,remainingMs:1500000,running:false,deadline:null,completed:0,focusSinceLong:0,focusMs:0,history:[]};}
export function validate(s){
  if(!s||s.version!==1||!validSettings(s.settings)||!PHASES.includes(s.phase)||!Number.isInteger(s.durationMs)||s.durationMs<60000||s.durationMs>10800000||!Number.isFinite(s.remainingMs)||s.remainingMs<=0||s.remainingMs>s.durationMs||typeof s.running!=="boolean"||(s.running?(!Number.isFinite(s.deadline)||s.deadline<=0):s.deadline!==null)||!Number.isSafeInteger(s.completed)||s.completed<0||!Number.isInteger(s.focusSinceLong)||s.focusSinceLong<0||s.focusSinceLong>12||!Number.isFinite(s.focusMs)||s.focusMs<0||!Array.isArray(s.history)||s.history.length>20)throw Error("Saved timer data is invalid.");
  for(const entry of s.history)if(!entry||!PHASES.includes(entry.phase)||!Number.isSafeInteger(entry.at)||entry.at<=0||entry.at>8640000000000000||!Number.isInteger(entry.minutes)||entry.minutes<1||entry.minutes>180)throw Error("Saved interval history is invalid.");
  return s;
}
export function remaining(s,now){return s.running?Math.min(s.remainingMs,Math.max(0,s.deadline-now)):s.remainingMs;}
export function liveFocusMs(s,now){return s.focusMs+(s.phase==="focus"&&s.running?s.remainingMs-remaining(s,now):0);}
export function pause(s,now){
  if(!s.running)return;
  const left=remaining(s,now);
  if(s.phase==="focus")s.focusMs+=s.remainingMs-left;
  s.remainingMs=left;s.running=false;s.deadline=null;
}
function enter(s,phase,now,auto=false){
  s.phase=phase;s.durationMs=s.settings[phase]*60000;s.remainingMs=s.durationMs;s.running=auto;s.deadline=auto?now+s.durationMs:null;
  if(phase==="long")s.focusSinceLong=0;
}
function advance(s,now,auto=false){
  const phase=s.phase==="focus"?(s.focusSinceLong>=s.settings.interval?"long":"short"):"focus";
  enter(s,phase,now,auto&&(phase==="focus"?s.settings.autoFocus:s.settings.autoBreaks));
}
export function sync(s,now,allowAuto=true){
  if(!s.running||now<s.deadline)return false;
  const phase=s.phase,at=s.deadline;
  pause(s,now);
  if(phase==="focus"){s.completed++;s.focusSinceLong++;}
  s.history.unshift({phase,at,minutes:s.durationMs/60000});s.history=s.history.slice(0,20);
  advance(s,now,allowAuto);
  return true;
}
export function toggle(s,now){
  if(sync(s,now,false))return;
  if(s.running)pause(s,now);
  else{s.running=true;s.deadline=now+s.remainingMs;}
}
export function select(s,phase,now){
  if(!PHASES.includes(phase))throw Error("Unknown interval.");
  sync(s,now,false);
  if(s.phase===phase)return;
  pause(s,now);enter(s,phase,now);
}
export function skip(s,now){
  if(sync(s,now,false)||!s.running)return false;
  pause(s,now);advance(s,now);return true;
}
export function reset(s,now){
  sync(s,now,false);pause(s,now);enter(s,s.phase,now);
}
export function updateSettings(s,next,now){
  if(!validSettings(next))throw Error("Use whole minutes: focus 1–180, breaks 1–60, and interval 1–12.");
  sync(s,now,false);
  const untouched=!s.running&&s.remainingMs===s.durationMs;
  s.settings={...next};
  if(untouched)enter(s,s.phase,now);
}
export function clock(ms){const secs=Math.ceil(Math.max(0,ms)/1000);return `${String(Math.floor(secs/60)).padStart(2,"0")}:${String(secs%60).padStart(2,"0")}`;}
