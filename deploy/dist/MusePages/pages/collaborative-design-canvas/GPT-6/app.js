import {createDocument,addShape,patchShape,translateShapes,removeShapes,reorder,alignShapes,resizeCorner,runCommand,shapeMarkup,serializeSvg,esc} from "./assets/engine.js";
const $=selector=>document.querySelector(selector),$$=selector=>[...document.querySelectorAll(selector)];
const icon=name=>`<svg aria-hidden="true"><use href="./assets/icons.svg#${name}"></use></svg>`;
let doc=createDocument(),selection=[],past=[],future=[],tool="select",camera={x:0,y:0,zoom:1},gesture=null,space=false,toastTimer,opener;
const canvas=$("#canvas"),dialog=$("#dialog");
const shapeIcon={rect:"square",circle:"circle",line:"minus",text:"type"};
const label=s=>s.type==="text"?s.text.replace(/\n/g," ").slice(0,30)||"Empty text":s.id==="paper"?"Poster paper":s.id==="orbit"?"Violet orbit":s.id==="ribbon"?"Peach ribbon":s.id==="dot"?"Little sunshine":s.id==="rule"?"A simple line":`${s.type==="rect"?"Rectangle":"Ellipse"} ${s.id.replace("shape-","")}`;
function notify(text){clearTimeout(toastTimer);$("#toast").textContent=text;$("#toast").hidden=false;toastTimer=setTimeout(()=>$("#toast").hidden=true,3200);}
function cameraView(){canvas.setAttribute("viewBox",`${camera.x} ${camera.y} ${1000/camera.zoom} ${620/camera.zoom}`);const zoom=$("#zoom");let custom=zoom.querySelector("[data-custom]");if(![...zoom.options].some(o=>Number(o.value)===camera.zoom)){if(!custom){custom=document.createElement("option");custom.dataset.custom="true";zoom.append(custom);}custom.value=String(camera.zoom);custom.textContent=`${Math.round(camera.zoom*100)}%`;}zoom.value=String(camera.zoom);canvas.style.cursor=tool==="hand"||space?"grab":tool==="select"?"default":"crosshair";}
function renderScene(){
  $("#scene").innerHTML=doc.shapes.map(s=>`<g data-id="${s.id}" data-locked="${s.locked}" role="button" aria-label="${esc(label(s))}${s.locked?", locked":""}">${shapeMarkup(s)}</g>`).join("");
  const selected=doc.shapes.filter(s=>selection.includes(s.id));
  $("#selection").innerHTML=selected.map(s=>`<g transform="rotate(${s.rotation} ${s.x+s.width/2} ${s.y+s.height/2})"><rect class="selection-box" x="${s.x}" y="${s.y}" width="${s.width}" height="${s.height}" ${s.locked?'stroke-dasharray="4 3"':""}/>${selected.length===1&&!s.locked?`<line class="handle-line" x1="${s.x+s.width/2}" x2="${s.x+s.width/2}" y1="${s.y}" y2="${s.y-26}"/><circle class="handle rotate-handle" data-handle="rotate" cx="${s.x+s.width/2}" cy="${s.y-26}" r="8"/><rect class="handle" data-handle="resize" x="${s.x+s.width-7}" y="${s.y+s.height-7}" width="14" height="14"/>`:""}</g>`).join("");
}
function render(){
  const focused=document.activeElement?.closest("#properties")?document.activeElement.name:null;
  selection=selection.filter(id=>doc.shapes.some(s=>s.id===id));renderScene();cameraView();
  $("#document-title").textContent=doc.title;$("#object-count").textContent=doc.shapes.length;
  $("#layer-list").innerHTML=[...doc.shapes].reverse().map(s=>`<button data-layer="${s.id}" aria-pressed="${selection.includes(s.id)}">${icon(shapeIcon[s.type])}<span>${esc(label(s))}</span>${s.locked?icon("lock-keyhole"):""}</button>`).join("");
  const selected=doc.shapes.filter(s=>selection.includes(s.id)),s=selected[0],editable=selected.filter(s=>!s.locked);
  if(selected.length===1){
    const number=(name,title,min,max)=>`<label>${title}<input name="${name}" aria-label="${title}" type="number" step="any" min="${min}" max="${max}" value="${Math.round(s[name]*100)/100}" ${s.locked?"disabled":""}></label>`;
    $("#properties").innerHTML=`<div class="property-fields"><p class="property-type"><span>${s.type==="rect"?"Rectangle":s.type==="circle"?"Ellipse":s.type==="line"?"Line":"Text"} · ${s.locked?"locked":"editable"}</span><span>${esc(s.id)}</span></p><div class="property-grid">${number("x","X position",-2000,3000)}${number("y","Y position",-2000,3000)}${number("width","Width",20,1000)}${number("height","Height",20,1000)}${number("rotation","Rotation",-360,360)}<label>Fill / stroke<input type="color" name="color" aria-label="Object color" value="${s.color}" ${s.locked?"disabled":""}></label>${s.type==="text"?`${number("fontSize","Font size",12,140)}<label class="wide">Text · 120 character limit<textarea name="text" aria-label="Object text" maxlength="120" ${s.locked?"disabled":""}>${esc(s.text)}</textarea></label>`:""}</div><div class="property-actions"><button class="tool" data-action="lock" aria-label="${s.locked?"Unlock":"Lock"} selected object" title="${s.locked?"Unlock":"Lock"}">${icon(s.locked?"lock-keyhole-open":"lock-keyhole")}</button><button class="tool" data-action="back" aria-label="Send selected backward" title="One layer backward" ${s.locked?"disabled":""}>${icon("arrow-down")}</button><button class="tool" data-action="front" aria-label="Bring selected forward" title="One layer forward" ${s.locked?"disabled":""}>${icon("arrow-up")}</button><button class="tool" data-action="delete" aria-label="Delete selected objects" title="Delete" ${s.locked?"disabled":""}>${icon("trash-2")}</button><span>Width / height are local, pre-rotation bounds.</span></div></div>`;
  }else if(selected.length>1)$("#properties").innerHTML=`<div class="property-fields"><p class="property-type">${selected.length} selected · ${editable.length} unlocked</p><p class="property-empty">Move together with a drag or arrow keys. Locked objects stay put.</p><div class="property-actions"><button class="tool" data-action="lock" aria-label="${selected.every(s=>s.locked)?"Unlock":"Lock"} selected objects">${icon("lock-keyhole")}</button><button class="tool" data-action="delete" aria-label="Delete selected objects" ${!editable.length?"disabled":""}>${icon("trash-2")}</button></div></div>`;
  else $("#properties").innerHTML=`<p class="property-empty">Pick a little something.<br>Its details will appear here.</p><p class="property-empty">Click a layer or shape.<br>Shift-click to select more.</p>`;
  $$("[data-action=align]").forEach(b=>b.disabled=editable.length<(b.dataset.mode==="horizontal"?3:2));
  $$("[data-tool]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.tool===tool));
  $("[data-action=undo]").disabled=!past.length;$("[data-action=redo]").disabled=!future.length;
  $("#selection-status").textContent=selected.length?`${selected.length} object${selected.length===1?"":"s"} selected${selected.some(s=>s.locked)?" · includes locked":""}`:"No objects selected";
  if(focused)$("#properties").querySelector(`[name="${focused}"]`)?.focus({preventScroll:true});
}
function commit(next,message="Changed here, in this tab only.",base=doc){
  if(JSON.stringify(next)===JSON.stringify(base)){doc=next;render();return;}
  past.push(structuredClone(base));if(past.length>50)past.shift();future=[];doc=next;$("#operation-status").textContent=message;render();
}
function attempt(fn){try{fn();}catch(error){notify(error.message);$("#operation-status").textContent=error.message;render();}}
function select(id,multi=false){selection=multi?(selection.includes(id)?selection.filter(x=>x!==id):[...selection,id]):[id];render();}
function focusCanvas(){canvas.scrollIntoView({block:"center",behavior:"instant"});canvas.focus({preventScroll:true});}
function openDialog(title,content){
  opener=document.activeElement;$("#dialog-content").innerHTML=`<h2 id="dialog-title">${title}</h2>${content}`;if(!dialog.open)dialog.showModal();
}
function closeDialog(){if(dialog.open)dialog.close();}
dialog.addEventListener("close",()=>{const focus=opener?.isConnected&&!opener.disabled?opener:$("#document-title");focus.focus({preventScroll:true});});
$("#close").addEventListener("click",closeDialog);
dialog.addEventListener("click",e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
function download(content,type,extension){
  const a=document.createElement("a"),url=URL.createObjectURL(new Blob([content],{type}));a.href=url;a.download=`collabcanvas-artwork.${extension}`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);notify(`${extension.toUpperCase()} download requested. Your document stays in this tab.`);
}
function setZoom(zoom){zoom=Math.min(2,Math.max(.5,zoom));const cx=camera.x+500/camera.zoom,cy=camera.y+310/camera.zoom;camera={x:cx-500/zoom,y:cy-310/zoom,zoom};cameraView();}
const actions={
  "focus-canvas":focusCanvas,
  about:()=>openDialog("Room to play. Clear boundaries.",`<p class="dialog-note">This independent CollabCanvas homepage is an original, single-person static concept, not a Figma product or a production collaboration service.</p><ul class="about-list"><li>Vector editing works locally. One in-memory document, up to 100 objects and 50 undo steps. Reloading resets it. There is no browser storage or automatic save.</li><li>No multiplayer cursors, Yjs sync, identity, roles, authentication, accounts, database, server snapshots, WebSockets or cloud persistence are connected. “Just you” means this one tab.</li><li>The helper is a small rule parser, not AI. Commands stay in this tab. The exact grammar is grid 1x1–4x4, row 1–8, circle, rectangle, or text followed by 1–60 characters.</li><li>SVG and JSON downloads are real local files. JSON import, grouping, font loading inside exported SVG, touch pinch zoom and advanced vector paths are outside this concept. Export uses system Arial. Rotated alignment uses pre-rotation bounds; equal gaps may overlap when space is tight.</li><li>No API requests, analytics, credentials or environment variables. Fonts: Inter (SIL OFL). Icons: Lucide (ISC). Original poster and interface by GPT-6.1 Sol. License files accompany the assets.</li></ul>`),
  shortcuts:()=>openDialog("A few little shortcuts.",`<div class="shortcut-list"><span>Select / pan / rectangle</span><kbd>V / H / R</kbd><span>Ellipse / line / text</span><kbd>O / L / T</kbd><span>Pan without changing tools</span><kbd>Space + drag</kbd><span>Multi-select</span><kbd>Shift + click</kbd><span>Nudge / larger nudge</span><kbd>Arrows / Shift + arrows</kbd><span>Select all / clear selection</span><kbd>Ctrl or ⌘ A / Esc</kbd><span>Undo / redo</span><kbd>Ctrl or ⌘ Z / Shift Z</kbd><span>Delete unlocked selection</span><kbd>Delete / Backspace</kbd><span>Zoom (or use zoom selector)</span><kbd>Ctrl or ⌘ + wheel</kbd></div><p class="dialog-note" style="margin-top:24px">Click a creation tool, then the canvas. Drag the lower-right handle to resize, or the top handle to rotate. All three are also available through property fields. Double-click text to edit. Normal wheel scrolling still scrolls this page.</p>`),
  rename:()=>openDialog("Name this little idea.",`<form id="rename-form"><label class="modal-field">Document title<input id="new-title" maxlength="60" required value="${esc(doc.title)}"></label><p class="dialog-note">This names the local document and the title inside its SVG export. The download name stays collabcanvas-artwork.</p><div class="dialog-actions"><button class="button dark">Use this title</button></div></form>`),
  export:()=>openDialog("Take your idea with you.",`<p class="dialog-note">A real vector SVG, or the complete document as readable JSON. Downloads include all objects, including locked ones. Selection handles and editor controls stay here.</p><p class="dialog-note">The export is a fixed 1000 × 620 canvas, independent of pan and zoom. Objects outside that frame may be cropped. JSON is a snapshot for inspection; this concept has no import flow.</p><div class="dialog-actions"><button class="button dark" data-download="svg">Download SVG ${icon("download")}</button><button class="button" data-download="json">Download JSON ${icon("download")}</button></div>`),
  "edit-headline":()=>{if(doc.shapes.some(s=>s.id==="headline")){select("headline");$("#inspector").open=true;$("#properties [name=text]")?.focus();$("#inspector").scrollIntoView({block:"center",behavior:"instant"});}else{notify("The original headline was deleted. Add a new text object with the T tool.");focusCanvas();}},
  undo:()=>{if(!past.length)return;future.push(structuredClone(doc));doc=past.pop();selection=[];$("#operation-status").textContent="Undone · memory only.";render();},
  redo:()=>{if(!future.length)return;past.push(structuredClone(doc));doc=future.pop();selection=[];$("#operation-status").textContent="Redone · memory only.";render();},
  fit:()=>{camera={x:0,y:0,zoom:1};cameraView();$("#operation-status").textContent="View reset. Artwork unchanged.";},
  delete:()=>commit(removeShapes(doc,selection),"Unlocked selection deleted."),
  lock:()=>{const selected=doc.shapes.filter(s=>selection.includes(s.id)),locked=!selected.every(s=>s.locked);let next=doc;for(const s of selected)next=patchShape(next,s.id,{locked});commit(next,locked?"Selection locked.":"Selection unlocked.");},
  back:()=>commit(reorder(doc,selection[0],-1),"Moved one layer backward."),
  front:()=>commit(reorder(doc,selection[0],1),"Moved one layer forward."),
  align:b=>commit(alignShapes(doc,selection,b.dataset.mode),"Unlocked objects arranged by pre-rotation bounds.")
};
document.addEventListener("click",e=>{
  const action=e.target.closest("[data-action]");if(action&&!action.disabled){attempt(()=>actions[action.dataset.action]?.(action));return;}
  const toolButton=e.target.closest("[data-tool]");if(toolButton){tool=toolButton.dataset.tool;render();$("#operation-status").textContent=tool==="select"?"Click or Shift-click a shape.":tool==="hand"?"Drag the canvas to pan.":"Click the canvas to place one object.";return;}
  const layer=e.target.closest("[data-layer]");if(layer){select(layer.dataset.layer,e.shiftKey);return;}
  const command=e.target.closest("[data-command]");if(command){$("#helper-command").value=command.dataset.command;$("#helper-command").focus();return;}
  const format=e.target.closest("[data-download]");if(format)download(format.dataset.download==="svg"?serializeSvg(doc):JSON.stringify({format:"collabcanvas-local-v1",...doc},null,2)+"\n",format.dataset.download==="svg"?"image/svg+xml":"application/json",format.dataset.download);
});
dialog.addEventListener("submit",e=>{if(e.target.id!=="rename-form")return;e.preventDefault();const title=$("#new-title").value.trim();if(!title){$("#new-title").setCustomValidity("Use a non-blank title.");$("#new-title").reportValidity();return;}commit({...doc,title},"Local title changed.");closeDialog();});
dialog.addEventListener("input",e=>e.target.setCustomValidity?.(""));
$("#properties").addEventListener("change",e=>{const name=e.target.name;if(!name||selection.length!==1)return;attempt(()=>{if(e.target.type==="number"&&e.target.value.trim()==="")throw Error("Enter a number before applying this property.");const value=["text","color"].includes(name)?e.target.value:Number(e.target.value);commit(patchShape(doc,selection[0],{[name]:value}),`${name==="text"?"Text":"Property"} updated locally.`);});});
$("#helper-form").addEventListener("submit",e=>{
  e.preventDefault();try{const next=runCommand(doc,$("#helper-command").value),added=next.shapes.slice(doc.shapes.length);selection=added.map(s=>s.id);commit(next,`${added.length} object${added.length===1?"":"s"} added by local rules.`);$("#helper-status").textContent=`${added.length} object${added.length===1?"":"s"} added. Explicit local rule only; no AI request. Undo returns to the previous document.`;camera={x:0,y:0,zoom:1};cameraView();}catch(error){$("#helper-status").textContent=error.message;}
});
$("#zoom").addEventListener("change",e=>setZoom(Number(e.target.value)));
canvas.addEventListener("wheel",e=>{if(e.ctrlKey||e.metaKey){e.preventDefault();setZoom(camera.zoom*(e.deltaY>0?.9:1.1));}},{passive:false});
const world=e=>{const point=canvas.createSVGPoint();point.x=e.clientX;point.y=e.clientY;return point.matrixTransform(canvas.getScreenCTM().inverse());};
canvas.addEventListener("pointerdown",e=>{
  if(e.button!==0||gesture)return;
  e.preventDefault();canvas.focus({preventScroll:true});const point=world(e);
  if(space||tool==="hand"){gesture={type:"pan",clientX:e.clientX,clientY:e.clientY,camera:{...camera},scale:canvas.getScreenCTM().a};}
  else if(!["select","hand"].includes(tool)){attempt(()=>{const next=addShape(doc,tool,point.x,point.y);selection=[next.shapes.at(-1).id];tool="select";commit(next,"New object added. Drag or edit its properties.");});return;}
  else{
    const handle=e.target.closest("[data-handle]"),id=e.target.closest("[data-id]")?.dataset.id;
    if(handle&&selection.length===1){const s=doc.shapes.find(s=>s.id===selection[0]);gesture={type:handle.dataset.handle,base:structuredClone(doc),shape:structuredClone(s),start:point,startAngle:Math.atan2(point.y-s.y-s.height/2,point.x-s.x-s.width/2)};}
    else if(id){if(!selection.includes(id)||e.shiftKey)select(id,e.shiftKey);const s=doc.shapes.find(s=>s.id===id);if(!selection.includes(id)||s.locked)return;gesture={type:"move",base:structuredClone(doc),ids:[...selection],start:point};}
    else{if(!e.shiftKey){selection=[];render();}return;}
  }
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove",e=>{
  if(!gesture)return;const g=gesture;
  if(g.type==="pan"){camera={...g.camera,x:g.camera.x-(e.clientX-g.clientX)/g.scale,y:g.camera.y-(e.clientY-g.clientY)/g.scale};cameraView();return;}
  const p=world(e),dx=p.x-g.start.x,dy=p.y-g.start.y;
  try{
    if(g.type==="move")doc=translateShapes(g.base,g.ids,dx,dy);
    else if(g.type==="resize")doc=patchShape(g.base,g.shape.id,resizeCorner(g.shape,dx,dy));
    else{const angle=Math.atan2(p.y-g.shape.y-g.shape.height/2,p.x-g.shape.x-g.shape.width/2),rotation=g.shape.rotation+(angle-g.startAngle)*180/Math.PI;doc=patchShape(g.base,g.shape.id,{rotation:((rotation+540)%360+360)%360-180});}
    renderScene();
  }catch(error){$("#operation-status").textContent=error.message;}
});
function endGesture(cancel=false){
  if(!gesture)return;const g=gesture;gesture=null;
  if(g.base){if(cancel){doc=g.base;render();}else commit(doc,"Canvas gesture applied locally.",g.base);}
}
canvas.addEventListener("pointerup",e=>{endGesture();if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);});
canvas.addEventListener("pointercancel",()=>endGesture(true));
canvas.addEventListener("lostpointercapture",()=>endGesture(true));
window.addEventListener("blur",()=>{space=false;endGesture(true);cameraView();});
canvas.addEventListener("dblclick",e=>{const id=e.target.closest("[data-id]")?.dataset.id,s=doc.shapes.find(s=>s.id===id);if(s?.type==="text"){select(id);$("#inspector").open=true;$("#properties [name=text]")?.focus();}});
document.addEventListener("keydown",e=>{
  if(dialog.open||e.target.closest("input,textarea,select,[contenteditable=true]"))return;
  const cmd=e.ctrlKey||e.metaKey,key=e.key.toLowerCase();
  if(cmd&&key==="z"){e.preventDefault();(e.shiftKey?actions.redo:actions.undo)();return;}
  if(cmd&&key==="y"){e.preventDefault();actions.redo();return;}
  if(cmd&&key==="a"&&document.activeElement===canvas){e.preventDefault();selection=doc.shapes.map(s=>s.id);render();return;}
  if(e.key==="Escape"){if(gesture)endGesture(true);else{selection=[];tool="select";render();}return;}
  if(e.code==="Space"&&document.activeElement===canvas){e.preventDefault();space=true;cameraView();return;}
  if(["Delete","Backspace"].includes(e.key)&&selection.length){e.preventDefault();attempt(actions.delete);return;}
  if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)&&selection.length&&document.activeElement===canvas){e.preventDefault();const n=e.shiftKey?10:1;attempt(()=>commit(translateShapes(doc,selection,e.key==="ArrowLeft"?-n:e.key==="ArrowRight"?n:0,e.key==="ArrowUp"?-n:e.key==="ArrowDown"?n:0),"Selection nudged locally."));return;}
  if(!cmd&&!e.altKey&&document.activeElement===canvas&&{v:1,h:1,r:1,o:1,l:1,t:1}[key]){tool={v:"select",h:"hand",r:"rect",o:"circle",l:"line",t:"text"}[key];render();}
});
document.addEventListener("keyup",e=>{if(e.code==="Space"){space=false;cameraView();}});
if(matchMedia("(max-width:1000px)").matches){$("#layers").open=false;$("#inspector").open=false;}
render();
