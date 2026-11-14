import test from "node:test";import assert from "node:assert/strict";
import {chooseReply,sampleHtml,escape,starters,failureMessages} from "./assets/engine.js";
test("each starter selects a labeled fixed sample rather than an arbitrary answer",()=>{
  for(const item of starters){const result=chooseReply(item.prompt);assert.equal(result.topic,item.id);assert.ok(result.body.length>100);}
  assert.equal(chooseReply("Tell me about an unknown event").topic,null);assert.match(chooseReply("What is the capital of anywhere?").body,/cannot answer/);
});
test("follow-ups use only the last successful sample category",()=>{
  const previous=[{role:"assistant",topic:"plan"},{role:"assistant",topic:null},{role:"user",topic:"ideas"}];
  assert.equal(chooseReply("Continue!",previous).topic,"plan");assert.ok(chooseReply("go on",previous).followup);
  assert.match(chooseReply("continue").body,/no previous sample/);assert.equal(chooseReply("Do not continue automatically",previous).topic,null);
});
test("blank and oversized messages fail validation",()=>{
  for(const input of ["","   ","a".repeat(2001)])assert.ok(chooseReply(input).error);
  assert.ok(!chooseReply("a".repeat(2000)).error);
});
test("limited Markdown preserves code, lists and paragraph structure safely",()=>{
  const html=sampleHtml('## Example\n- first\n- second\n```js\nconst x = "<img onerror=bad>";\n```\nEnd <script>bad</script>');
  assert.match(html,/<h3>Example<\/h3><ul><li>first<\/li><li>second<\/li><\/ul><pre><code>/);
  assert.ok(!html.includes("<img"));assert.ok(!html.includes("<script>"));assert.match(html,/&lt;img/);assert.ok(html.endsWith("</p>"));
  assert.ok(sampleHtml("```js\nvalue").endsWith("</code></pre>"));assert.equal(escape('"&<>'),"&quot;&amp;&lt;&gt;");
});
test("all simulated failure descriptions accurately describe disconnected behavior",()=>{
  for(const value of Object.values(failureMessages))assert.match(value,/Simulated/);assert.match(failureMessages.network,/No request/);assert.match(failureMessages.rate,/No provider quota/);
});
