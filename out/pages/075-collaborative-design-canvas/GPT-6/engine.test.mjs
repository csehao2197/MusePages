import test from "node:test";
import assert from "node:assert/strict";
import {createDocument,addShape,patchShape,translateShapes,removeShapes,reorder,alignShapes,runCommand,resizeCorner,serializeSvg} from "./assets/engine.js";
test("shape creation uses unique identities and keeps the source unchanged",()=>{
  const original=createDocument(),one=addShape(original,"rect",50,60),two=addShape(one,"circle",70,80);
  assert.equal(original.shapes.length,7);assert.equal(two.shapes.length,9);
  assert.notEqual(one.shapes.at(-1).id,two.shapes.at(-1).id);
  assert.throws(()=>addShape(original,"script",0,0));assert.throws(()=>addShape(original,"rect",NaN,0));
});
test("properties reject invalid values atomically, and locks block edits",()=>{
  const doc=createDocument(),shape=doc.shapes.find(s=>!s.locked);
  assert.throws(()=>patchShape(doc,shape.id,{width:0}));assert.throws(()=>patchShape(doc,shape.id,{color:"url(https://example.com)"}));
  assert.throws(()=>patchShape(doc,shape.id,{id:"overwrite"}));assert.throws(()=>patchShape(doc,shape.id,{text:"x".repeat(121)}));
  const locked=patchShape(doc,shape.id,{locked:true});
  assert.throws(()=>patchShape(locked,shape.id,{x:10}));
  assert.equal(patchShape(locked,shape.id,{locked:false}).shapes.find(s=>s.id===shape.id).locked,false);
  assert.deepEqual(doc,createDocument());
});
test("multi-move ignores locked objects and deletion preserves them",()=>{
  const doc=createDocument(),ids=doc.shapes.map(s=>s.id),next=translateShapes(doc,ids,20,-10);
  assert.equal(next.shapes[0].x,doc.shapes[0].x);
  assert.equal(next.shapes[1].x,doc.shapes[1].x+20);assert.equal(next.shapes[1].y,doc.shapes[1].y-10);
  assert.deepEqual(removeShapes(doc,ids).shapes.map(s=>s.id),[doc.shapes[0].id]);
});
test("layer reordering is bounded and locked layers cannot be moved",()=>{
  const doc=createDocument(),id=doc.shapes[1].id,next=reorder(doc,id,1);
  assert.equal(next.shapes[2].id,id);assert.equal(reorder(doc,doc.shapes.at(-1).id,1).shapes.at(-1).id,doc.shapes.at(-1).id);
  assert.throws(()=>reorder(doc,doc.shapes[0].id,1));
});
test("alignment and equal-gap distribution operate on the selected unlocked shapes",()=>{
  let doc=createDocument();doc.shapes=doc.shapes.slice(1,4).map((s,i)=>({...s,x:i*200,y:i*100,width:50}));
  const ids=doc.shapes.map(s=>s.id),left=alignShapes(doc,ids,"left"),top=alignShapes(doc,ids,"top");
  assert.deepEqual(left.shapes.map(s=>s.x),[0,0,0]);assert.deepEqual(top.shapes.map(s=>s.y),[0,0,0]);
  doc.shapes[1].x=110;
  assert.deepEqual(alignShapes(doc,ids,"horizontal").shapes.map(s=>s.x),[0,200,400]);
  assert.throws(()=>alignShapes(doc,ids.slice(0,2),"horizontal"));
});
test("resizing rotated shapes preserves the opposite world-space corner",()=>{
  const shape={x:100,y:100,width:100,height:80,rotation:90},resized=resizeCorner(shape,0,20);
  assert.equal(resized.width,120);assert.equal(resized.height,80);
  assert.ok(Math.abs(resized.x-90)<1e-8);assert.ok(Math.abs(resized.y-110)<1e-8);
  const clamped=resizeCorner({...shape,rotation:0},-1000,-1000);assert.equal(clamped.width,20);assert.equal(clamped.height,20);
});
test("rule helper is explicit, bounded and all-or-nothing",()=>{
  const doc=createDocument(),next=runCommand(doc,"grid 3x3");
  assert.equal(next.shapes.length,16);assert.equal(new Set(next.shapes.slice(-9).map(s=>s.id)).size,9);
  assert.equal(runCommand(doc,"text hello <world>").shapes.at(-1).text,"hello <world>");
  for(const command of ["make me something","grid 99x99","row 0","<script>"])assert.throws(()=>runCommand(doc,command));
  let full=doc;for(let i=0;i<93;i++)full=addShape(full,"rect",10,10);
  assert.throws(()=>runCommand(full,"grid 3x3"));assert.equal(full.shapes.length,100);
});
test("SVG export contains real vector elements and escaped user text, without editor chrome",()=>{
  let doc=addShape(createDocument(),"text",50,50);
  doc=patchShape(doc,doc.shapes.at(-1).id,{text:'<script>& "text"'});
  const svg=serializeSvg(doc);
  assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'));
  assert.ok(svg.includes("&lt;script&gt;&amp;"));assert.ok(!svg.includes("<script>"));
  assert.ok(svg.includes("<rect")&&svg.includes("<ellipse")&&svg.includes("<text"));
  assert.ok(!svg.includes("data-shape")&&!/\bhref=/.test(svg));
});
