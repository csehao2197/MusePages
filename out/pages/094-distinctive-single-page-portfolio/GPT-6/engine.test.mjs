import test from "node:test";
import assert from "node:assert/strict";
import {projects,dictionaries} from "./assets/content.js";
import {language,description,filterProjects,projectFromHash,sheetIndex,nextQuote,messageDraft} from "./assets/engine.js";
test("Project filters intersect multilingual full-text tokens and categories without regex evaluation",()=>{
  assert.equal(filterProjects("chat NEXT.JS","saas").length,1);
  assert.equal(filterProjects("Laravel","civic").length,2);
  assert.equal(filterProjects("Laravel","campus").length,0);
  assert.equal(filterProjects("pembelajaran","academic","id")[0].id,"its");
  assert.equal(filterProjects("[.*").length,0);
  assert.equal(filterProjects("Ｎｅｘｔ.js","personal").length,1);
});
test("Language fallback and localized descriptions retain complete parallel UI dictionaries",()=>{
  assert.equal(language("ID"),"en");assert.equal(language("id"),"id");
  assert.notEqual(description(projects[0],"id"),description(projects[0],"en"));
  assert.deepEqual(Object.keys(dictionaries.en).sort(),Object.keys(dictionaries.id).sort());
});
test("Deep links use only exact known project identities and reject malformed encoded input",()=>{
  assert.equal(projectFromHash("#project-chatrigo").id,"chatrigo");
  assert.equal(projectFromHash("#project-CHATRIGO"),null);
  assert.equal(projectFromHash("#project-%E0%A4"),null);
  assert.equal(projectFromHash("#project-<script>"),null);
});
test("Reference navigation wraps in either direction and rejects noninteger state",()=>{
  assert.equal(sheetIndex(0,-1),1);assert.equal(sheetIndex(1,1),0);
  assert.equal(sheetIndex(0,9),1);assert.throws(()=>sheetIndex(1.5,1));
  assert.throws(()=>sheetIndex(0,1,0));
});
test("Random brief lines never repeat the current line across either random boundary",()=>{
  for(let current=0;current<4;current++)for(const value of [0,.25,.5,.999999]){const next=nextQuote(current,value);assert.notEqual(next,current);assert.ok(next>=0&&next<4);}
  assert.throws(()=>nextQuote(0,1));assert.throws(()=>nextQuote(-1,0));
});
test("Unsent drafts validate content and reject header/control injection while preserving multiline text",()=>{
  const draft=messageDraft("  Project conversation  ","Hello Dzaky,\nI'd like to discuss the supplied portfolio.");
  assert.match(draft,/UNSENT LOCAL DRAFT/);assert.match(draft,/Recipient: not configured/);
  assert.match(draft,/Hello Dzaky,\nI'd/);assert.ok(!draft.includes("  Project"));
  assert.match(messageDraft("Diskusi","Mari berdiskusi tentang proyek ini.","id"),/DRAF LOKAL BELUM TERKIRIM/);
  for(const [subject,body]of [["x","long enough message"],["bad\nheader","long enough message"],["Valid","short"],["Valid","a".repeat(2001)],["Valid","message\u0000 body"]])assert.throws(()=>messageDraft(subject,body));
});
