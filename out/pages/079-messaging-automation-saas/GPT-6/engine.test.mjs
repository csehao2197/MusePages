import test from "node:test";import assert from "node:assert/strict";
import {keywordsFrom,normalize,validateRule,initialRules,evaluate,escape} from "./assets/engine.js";
const event={trigger:"COMMENT",post:"weekend",text:"Please send the GUIDE!"};
test("keywords normalize complete phrases without matching word fragments",()=>{
  assert.equal(normalize("  FREE—Guide！ "),"free guide");assert.deepEqual(keywordsFrom(" Guide,guide,FREE guide").keywords,["guide","free guide"]);
  assert.ok(evaluate(initialRules(),event).matched);assert.ok(!evaluate(initialRules(),{...event,text:"myguidebook"}).matched);
  assert.ok(evaluate([{...initialRules()[0],keywords:["free guide"]}],{...event,text:"A FREE-guide, please"}).matched);
});
test("keyword and rule validation reject empty, oversized and unavailable modes",()=>{
  for(const value of ["",",guide","...",Array.from({length:6},(_,i)=>`key${i}`).join(","),"a".repeat(41)])assert.ok(keywordsFrom(value).error);
  const input={...initialRules()[0],keywords:"guide"};assert.ok(validateRule(input).rule);
  for(const bad of [{name:"a"},{trigger:"bad"},{post:"missing"},{reply:""},{mode:"bad"},{mode:"SMARTAI",prompt:"A sample instruction"}])assert.ok(validateRule({...input,...bad}).error);
  assert.ok(validateRule({...input,mode:"SMARTAI",prompt:"A sample instruction"},"PRO").rule);assert.ok(validateRule({...input,mode:"SMARTAI",prompt:""},"PRO").error);
});
test("post, event, active state and plan gates are actually enforced",()=>{
  const rules=initialRules();assert.ok(!evaluate(rules,{...event,post:"studio"}).matched);assert.ok(!evaluate(rules,{...event,trigger:"DM"}).matched);
  assert.equal(evaluate(rules,{trigger:"DM",post:"",text:"What are your hours?"}).ruleId,"r2");
  rules[0].active=false;assert.ok(!evaluate(rules,event).matched);rules[0].active=true;rules[0].mode="SMARTAI";
  assert.ok(!evaluate(rules,event,"FREE").matched);const result=evaluate(rules,event,"PRO");assert.ok(result.matched);assert.match(result.reply,/fixed preview/);assert.equal(result.reply.split(".").filter(Boolean).length,1);
});
test("only the first matching active rule produces a reply",()=>{
  const rules=initialRules();rules.push({...rules[0],id:"later",reply:"Later reply"});const result=evaluate(rules,event);assert.equal(result.ruleId,"r1");assert.equal(result.evaluations.length,3);
  rules[0].active=false;assert.equal(evaluate(rules,event).ruleId,"later");
});
test("event validation rejects invalid targets and oversized input",()=>{
  for(const bad of [{text:" "},{text:"a".repeat(301)},{trigger:"WEBHOOK"},{post:"external"}])assert.ok(evaluate(initialRules(),{...event,...bad}).error);
});
test("HTML data remains literal and every factory returns independent rules",()=>{
  assert.equal(escape('<img src=x onerror="bad">'),"&lt;img src=x onerror=&quot;bad&quot;&gt;");
  const rules=initialRules();rules[0].keywords.push("extra");rules[0].name="Changed";assert.equal(initialRules()[0].keywords.length,2);assert.notEqual(initialRules()[0].name,"Changed");
});
