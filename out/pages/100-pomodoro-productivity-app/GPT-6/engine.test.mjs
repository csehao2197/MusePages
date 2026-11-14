import test from "node:test";
import assert from "node:assert/strict";
import {fresh,validate,toggle,pause,remaining,liveFocusMs,sync,select,skip,reset,updateSettings,clock} from "./assets/engine.js";
const t=1800000000000;
const one=()=>{const s=fresh();updateSettings(s,{focus:1,short:1,long:1,interval:2,autoBreaks:true,autoFocus:true},t);return s;};
test("deadline timing accumulates only running segments and resumes without drift",()=>{
  const s=fresh();toggle(s,t);assert.equal(remaining(s,t+10250),1489750);pause(s,t+10250);assert.equal(s.focusMs,10250);assert.equal(remaining(s,t+900000),1489750);toggle(s,t+900000);assert.equal(s.deadline,t+2389750);assert.equal(liveFocusMs(s,t+910000),20250);assert.equal(clock(remaining(s,t+910000)),"24:40");sync(s,s.deadline);assert.equal(s.completed,1);assert.equal(s.focusMs,1500000);
});
test("skips, resets and manual phase switches keep partial time without fake completions",()=>{
  const s=one();toggle(s,t);assert.equal(skip(s,t+17000),true);assert.equal(s.completed,0);assert.equal(s.focusMs,17000);assert.equal(s.phase,"short");assert.equal(s.running,false);select(s,"focus",t+17000);toggle(s,t+17000);reset(s,t+22000);assert.equal(s.focusMs,22000);assert.equal(s.remainingMs,60000);toggle(s,t+22000);select(s,"long",t+25000);assert.equal(s.focusMs,25000);assert.equal(s.completed,0);assert.equal(s.focusSinceLong,0);assert.equal(s.history.length,0);
});
test("two full focuses schedule one long break; skipping after it does not schedule another",()=>{
  const s=one();toggle(s,t);sync(s,t+60000);assert.equal(s.phase,"short");assert.equal(s.focusSinceLong,1);sync(s,t+120000);assert.equal(s.phase,"focus");sync(s,t+180000);assert.equal(s.phase,"long");assert.equal(s.completed,2);assert.equal(s.focusSinceLong,0);skip(s,t+181000);assert.equal(s.phase,"focus");toggle(s,t+181000);skip(s,t+182000);assert.equal(s.phase,"short");assert.equal(s.completed,2);
});
test("late ticks complete exactly one interval and auto-start at now, not a fictional old deadline",()=>{
  const s=one();toggle(s,t);sync(s,t+600000);assert.equal(s.completed,1);assert.equal(s.focusMs,60000);assert.equal(s.phase,"short");assert.equal(s.deadline,t+660000);assert.equal(sync(s,t+600000),false);const hidden=one();toggle(hidden,t);sync(hidden,t+600000,false);assert.equal(hidden.completed,1);assert.equal(hidden.running,false);assert.equal(hidden.remainingMs,60000);assert.equal(sync(hidden,t+6000000,false),false);
});
test("new preferences preserve a started interval but apply to the next fresh one",()=>{
  const s=fresh();toggle(s,t);pause(s,t+10000);const next={focus:1,short:2,long:3,interval:3,autoBreaks:true,autoFocus:false};updateSettings(s,next,t+11000);assert.equal(s.durationMs,1500000);assert.equal(s.remainingMs,1490000);reset(s,t+12000);assert.equal(s.durationMs,60000);assert.equal(s.focusMs,10000);assert.throws(()=>updateSettings(s,{...next,focus:1.5},t));assert.throws(()=>updateSettings(s,{...next,long:61},t));assert.throws(()=>updateSettings(s,{...next,interval:0},t));assert.equal(s.settings.focus,1);
});
test("serialized active deadlines restore one completion and reject corrupt history and settings",()=>{
  const s=one();toggle(s,t);const restored=validate(JSON.parse(JSON.stringify(s)));assert.equal(remaining(restored,t+20000),40000);assert.equal(sync(restored,t+999999,false),true);assert.equal(restored.completed,1);assert.equal(restored.running,false);assert.equal(validate(JSON.parse(JSON.stringify(restored))).focusMs,60000);assert.throws(()=>validate({...restored,settings:{...restored.settings,autoFocus:"yes"}}));assert.throws(()=>validate({...restored,remainingMs:-1}));assert.throws(()=>validate({...restored,history:[{phase:"focus",at:1e20,minutes:1}]}));
});
test("history is bounded; exact-deadline skip counts only the completed phase once",()=>{
  const s=one();toggle(s,t);assert.equal(skip(s,t+60000),false);assert.equal(s.completed,1);assert.equal(s.phase,"short");assert.equal(s.running,false);for(let i=1;i<=25;i++){select(s,"focus",t+i*120000);toggle(s,t+i*120000);sync(s,t+i*120000+60000,false);}assert.equal(s.completed,26);assert.equal(s.history.length,20);assert.equal(s.focusMs,26*60000);assert.equal(s.history[0].at,t+25*120000+60000);
});
test("backward clock movement cannot increase the interval or produce negative timer time",()=>{
  const s=one();toggle(s,t);assert.equal(remaining(s,t-20000),60000);assert.equal(liveFocusMs(s,t-20000),0);pause(s,t-20000);assert.equal(s.focusMs,0);assert.equal(s.remainingMs,60000);toggle(s,t+1000);sync(s,t+61000,false);assert.equal(s.completed,1);assert.equal(s.focusMs,60000);
});
