import test from "node:test";
import assert from "node:assert/strict";
import {capture,makeSeed,filteredNodes,graphEdges,clusterNodes,deleteNodes,addCollection,addToCollection,reviewSM2,dueNodes,buildDigests,retrieve,addDays} from "./assets/engine.js";
const today="2026-11-13",raw="Learning improves with a short retrieval session. Spaced memory practice comes next. A third sentence is kept only in the source.";
test("Capture extracts only the first two sentences and explains deterministic tag detection",()=>{
  const note=capture({title:"A memory experiment",raw,type:"article"});
  assert.equal(note.summary,"Learning improves with a short retrieval session. Spaced memory practice comes next.");
  assert.ok(note.tags.includes("Memory"));assert.ok(note.tags.includes("Learning"));assert.equal(note.raw,raw);
  assert.deepEqual(capture({title:"A memory experiment",raw},{detectTags:false}).tags,["Unsorted"]);
  assert.deepEqual(capture({title:"A memory experiment",raw,tags:"Design, design, Ｄｅｓｉｇｎ"}).tags,["Ｄｅｓｉｇｎ"]);
});
test("Capture handles missing video transcripts and refuses executable or credential-bearing URLs",()=>{
  assert.throws(()=>capture({title:"Video",type:"video",raw:""}),/No transcript/);
  for(const url of ["javascript:alert(1)","file:///secret","https://name:password@example.org","missing-host"])assert.throws(()=>capture({title:"Valid passage",raw,url}));
  assert.equal(capture({title:"Valid passage",raw,url:"https://example.org/article"}).url,"https://example.org/article");
  assert.throws(()=>capture({title:"Valid passage",raw:"short"}));
  assert.throws(()=>capture({title:"Valid passage",raw,tags:"a,b,c,d,e,f"}));
});
test("Search intersects collection membership with literal full-field tokens",()=>{
  const state=makeSeed(today);
  assert.equal(filteredNodes(state,"memory","learning-lab").length,2);
  assert.equal(filteredNodes(state,"privacy","learning-lab").length,0);
  assert.equal(filteredNodes(state,"[.*").length,0);
  assert.equal(filteredNodes(state,"ＮＯＴＥＳ").length,0);
  assert.equal(filteredNodes(state,"", "missing").length,0);
});
test("Shared-tag graph excludes Unsorted and limits its two-hop neighborhood",()=>{
  const nodes=[{id:"a",tags:["a"]},{id:"b",tags:["a","b"]},{id:"c",tags:["b","c"]},{id:"d",tags:["c"]},{id:"e",tags:["Unsorted"]},{id:"f",tags:["Unsorted"]}];
  assert.equal(graphEdges(nodes).length,3);
  assert.deepEqual(clusterNodes(nodes,"a").map((node)=>node.id),["a","b","c"]);
  assert.equal(clusterNodes(nodes,"a",2).length,2);assert.deepEqual(clusterNodes([],"a"),[]);
});
test("Collections preserve unique memberships and reject duplicate names or stale selections",()=>{
  let state=addCollection(makeSeed(today),"new","  Design notes  ");
  assert.equal(state.collections.at(-1).name,"Design notes");
  assert.throws(()=>addCollection(state,"another","Ｄｅｓｉｇｎ notes"),/already exists/);
  state=addToCollection(state,"new",["small-loops","small-loops"]);
  assert.deepEqual(state.collections.at(-1).nodeIds,["small-loops"]);
  assert.throws(()=>addToCollection(state,"missing",["small-loops"]));
  assert.throws(()=>addToCollection(state,"new",["missing"]));
});
test("Standard SM-2 uses 1 then 6 days, previous ease for growth, and lapse reset",()=>{
  const initial={repetitions:0,interval:0,ease:2.5,nextReviewDate:today};
  const one=reviewSM2(initial,"good",today),two=reviewSM2(one,"good",one.nextReviewDate),three=reviewSM2(two,"good",two.nextReviewDate);
  assert.equal(one.interval,1);assert.equal(two.interval,6);assert.equal(three.interval,15);
  const lapse=reviewSM2(three,"forgot",today);assert.equal(lapse.repetitions,0);assert.equal(lapse.interval,1);assert.equal(lapse.ease,1.7);
  assert.equal(reviewSM2(initial,"easy",today).ease,2.6);assert.equal(reviewSM2(initial,"hard",today).ease,2.36);
  assert.equal(reviewSM2({...initial,ease:1.3},"forgot",today).ease,1.3);
  assert.throws(()=>reviewSM2(initial,"unknown",today));assert.throws(()=>reviewSM2({...initial,ease:NaN},"good",today));
});
test("Review scheduling uses UTC calendar boundaries and validates real dates",()=>{
  assert.equal(addDays("2024-02-28",1),"2024-02-29");assert.equal(addDays("2026-12-31",1),"2027-01-01");
  assert.throws(()=>addDays("2026-02-30",1));assert.throws(()=>addDays("not a day",1));
  assert.equal(dueNodes(makeSeed(today),today).length,4);
});
test("Digests quote only named sources, skip already grouped captures and delete dependent records",()=>{
  let nextId=0;const state=buildDigests(makeSeed(today),()=>String(++nextId));
  assert.ok(state.consolidations.length>0);
  for(const digest of state.consolidations)for(const id of digest.sourceNodeIds)assert.ok(digest.summary.includes(state.nodes.find((node)=>node.id===id).summary));
  assert.equal(buildDigests(state,()=>String(++nextId)).consolidations.length,state.consolidations.length);
  const removedId=state.consolidations[0].sourceNodeIds[0],deleted=deleteNodes(state,[removedId]);
  assert.ok(!deleted.nodes.some((node)=>node.id===removedId));assert.ok(!deleted.reviews[removedId]);
  assert.ok(deleted.collections.every((item)=>!item.nodeIds.includes(removedId)));
  assert.ok(deleted.consolidations.every((item)=>!item.sourceNodeIds.includes(removedId)));
});
test("Memory retrieval returns bounded actual sources and gracefully handles only stopwords",()=>{
  const state=makeSeed(today);
  const found=retrieve(state,"What did I save about privacy?");
  assert.ok(found.length>0&&found.length<=3);assert.ok(found.every((node)=>state.nodes.some((item)=>item.id===node.id)));
  assert.deepEqual(retrieve(state,"the a an how"),[]);assert.deepEqual(retrieve(state,"xyzzy"),[]);
});
