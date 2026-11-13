import {createProject,addFrame,updateFrame,moveFrames,deleteFrames,arrange,stepLayer,resizeFrame,artwork,esc} from "./assets/engine.js";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],icon=name=>`<svg aria-hidden="true"><use href="./assets/icons.svg#${name}"></use></svg>`;
let project=createProject(),selection=["f4"],past=[],future=[],camera={x:0,y:0,zoom:1},tool="select",gesture=null,space=false,opener,toastTimer,opacityBase=null;
const canvas=$("#canvas"),dialog=$("#dialog");
function notify(message){clearTimeout(toastTimer);$("#toast").textContent=message;$("#toast").hidden=false;toastTimer=setTimeout(()=>$("#toast").hidden=true,3200);}
function view(){
  canvas.setAttribute("viewBox",`${camera.x} ${camera.y} ${1100/camera.zoom} ${700/camera.zoom}`);
  const zoom=$("#zoom");let custom=zoom.querySelector("[data-custom]");if(![...zoom.options].some(o=>Number(o.value)===camera.zoom)){if(!custom){custom=document.createElement("option");custom.dataset.custom="true";zoom.append(custom);}custom.value=String(camera.zoom);custom.textContent=`${Math.round(camera.zoom*100)}%`;}zoom.value=String(camera.zoom);
  canvas.style.cursor=space||tool==="hand"?"grab":"default";
}
function renderArt(){
  $("#artwork").innerHTML=project.frames.map(f=>`<g data-frame="${f.id}" data-locked="${f.locked}" role="button" aria-label="${esc(f.name)}${f.locked?", locked":""}">${artwork(f)}</g>`).join("");
  const chosen=project.frames.filter(f=>selection.includes(f.id));
  $("#selection").innerHTML=chosen.map(f=>`<g transform="translate(${f.x} ${f.y}) rotate(${f.rotation} ${f.width/2} ${f.height/2})"><rect class="selection-box" width="${f.width}" height="${f.height}" ${f.locked?'stroke-dasharray="4 3"':""}/>${chosen.length===1&&!f.locked?`<line class="handle-line" x1="${f.width/2}" x2="${f.width/2}" y1="0" y2="-27"/><circle class="handle rotate-handle" data-handle="rotate" cx="${f.width/2}" cy="-27" r="8"/><rect class="handle" data-handle="resize" x="${f.width-7}" y="${f.height-7}" width="14" height="14"/>`:""}</g>`).join("");
}
function render(){
  const focus=document.activeElement?.closest("#properties")?document.activeElement.name:null;
  selection=selection.filter(id=>project.frames.some(f=>f.id===id));renderArt();view();$("#project-title").textContent=project.title;$("#frame-count").textContent=project.frames.length;
  $("#layer-list").innerHTML=[...project.frames].reverse().map(f=>`<button data-layer="${f.id}" aria-pressed="${selection.includes(f.id)}">${icon(f.kind==="text"?"type":f.kind==="art"?"leaf":"frame")}<span>${esc(f.name)}</span>${f.locked?icon("lock-keyhole"):""}</button>`).join("");
  const selected=project.frames.filter(f=>selection.includes(f.id)),editable=selected.filter(f=>!f.locked),f=selected[0];
  $("#selection-kind").textContent=selected.length===1?`${f.kind==="art"?"ILLUSTRATION":"FRAME"}${f.locked?" / LOCKED":""}`:selected.length?`${selected.length} FRAMES`:"NO SELECTION";
  if(selected.length===1){
    const disabled=f.locked?"disabled":"",number=(name,label,min,max)=>`<label>${label}<input type="number" step="any" name="${name}" aria-label="${label}" min="${min}" max="${max}" value="${Math.round(f[name]*100)/100}" ${disabled}></label>`;
    $("#properties").innerHTML=`<div class="field-grid"><label class="full">Name<input name="name" aria-label="Frame name" maxlength="60" value="${esc(f.name)}" ${disabled}></label>${number("x","X position",-4000,5000)}${number("y","Y position",-4000,5000)}${number("width","Width",30,2000)}${number("height","Height",30,2000)}${number("rotation","Rotation",-360,360)}${number("radius","Corner radius",0,200)}<label class="full">Fill<input type="color" name="fill" aria-label="Frame fill" value="${f.fill}" ${disabled}></label><label class="full">Opacity<div class="opacity-row"><input type="range" name="opacitySlider" aria-label="Opacity slider" min="0" max="100" step="1" value="${Math.round(f.opacity*100)}" ${disabled}><input type="number" name="opacity" aria-label="Frame opacity percentage" min="0" max="100" step="1" value="${Math.round(f.opacity*100)}" ${disabled}><span>%</span></div></label>${!["plain","art"].includes(f.kind)?`${number("fontSize","Text size",12,120)}<label class="full">Text content<textarea name="content" aria-label="Frame text" maxlength="160" ${disabled}>${esc(f.content)}</textarea></label>`:""}</div><div class="properties-actions"><button class="icon-button" data-action="lock" aria-label="${f.locked?"Unlock":"Lock"} selected frame" title="${f.locked?"Unlock":"Lock"}">${icon(f.locked?"lock-keyhole-open":"lock-keyhole")}</button><button class="icon-button" data-action="back" aria-label="Move selected frame backward" title="Back one layer" ${disabled}>${icon("arrow-down")}</button><button class="icon-button" data-action="front" aria-label="Move selected frame forward" title="Forward one layer" ${disabled}>${icon("arrow-up")}</button><button class="icon-button" data-action="delete" aria-label="Delete selected frames" title="Delete unlocked selection" ${disabled}>${icon("trash-2")}</button></div><p class="properties-foot">Dimensions are before rotation. Text and original botanical artwork clip to their frame. Botanical paths scale with width and height.</p>`;
  }else if(selected.length>1)$("#properties").innerHTML=`<p class="properties-empty">${selected.length} frames selected.<br>${editable.length} unlocked and ready to move.<br>Locked frames stay put.</p><div class="properties-actions"><button class="icon-button" data-action="lock" aria-label="${selected.every(f=>f.locked)?"Unlock":"Lock"} selected frames">${icon("lock-keyhole")}</button><button class="icon-button" data-action="delete" aria-label="Delete selected frames" ${editable.length?"":"disabled"}>${icon("trash-2")}</button></div>`;
  else $("#properties").innerHTML='<p class="properties-empty">Pick a frame on the canvas or in the layers list.<br><br>A little change starts here.</p>';
  $$("[data-align]").forEach(b=>b.disabled=editable.length<(b.dataset.align==="horizontal"?3:2));$$("[data-tool]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.tool===tool));
  $("[data-action=undo]").disabled=!past.length;$("[data-action=redo]").disabled=!future.length;
  $("#selection-status").textContent=selected.length===1?f.name:selected.length?`${selected.length} frames selected`:"No frame selected";
  if(focus)$("#properties").querySelector(`[name="${focus}"]`)?.focus({preventScroll:true});
}
function commit(next,message="Changed here. In this tab only.",base=project){
  if(JSON.stringify(next)===JSON.stringify(base)){project=next;render();return;}
  past.push(structuredClone(base));if(past.length>50)past.shift();future=[];project=next;$("#operation-status").textContent=message;render();
}
function attempt(fn){try{fn();}catch(error){notify(error.message);$("#operation-status").textContent=error.message;render();}}
function select(id,multi=false){selection=multi?selection.includes(id)?selection.filter(x=>x!==id):[...selection,id]:[id];render();}
function open(title,content,preview=false){opener=document.activeElement;dialog.classList.toggle("preview-dialog",preview);$("#dialog-content").innerHTML=`<h2 id="dialog-title">${title}</h2>${content}`;if(!dialog.open)dialog.showModal();}
function close(){if(dialog.open)dialog.close();}
$("#close").addEventListener("click",close);dialog.addEventListener("close",()=>{const target=opener?.isConnected&&!opener.disabled?opener:$("[data-action=rename]");target.focus({preventScroll:true});});
dialog.addEventListener("click",e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
function zoom(value,anchor=null){
  value=Math.max(.4,Math.min(2,value));const p=anchor||{x:camera.x+550/camera.zoom,y:camera.y+350/camera.zoom},old=camera.zoom;
  camera={x:p.x-(p.x-camera.x)*old/value,y:p.y-(p.y-camera.y)*old/value,zoom:value};view();
}
function snapshot(){const json=JSON.stringify({format:"framespace-local-v1",...project},null,2)+"\n",url=URL.createObjectURL(new Blob([json],{type:"application/json"})),a=document.createElement("a");a.href=url;a.download="framespace-project.json";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);notify("JSON snapshot download requested. This is not a cloud save.");}
const actions={
  add:()=>{const next=addFrame(project,camera.x+550/camera.zoom-130,camera.y+350/camera.zoom-90);selection=[next.frames.at(-1).id];commit(next,"New frame. A little room for an idea.");},
  snapshot,
  preview:()=>open("Your little exploration.",`<svg class="preview-art" viewBox="0 0 1100 700" role="img" aria-label="Current artwork preview, without editor selection handles">${project.frames.map(f=>artwork(f,"preview")).join("")}</svg><p class="dialog-note">Live artwork from this document. Pan and zoom are editor-only; this preview uses the fixed 1100 × 700 view. Sample navigation and collection labels are artwork, not a functioning storefront.</p>`,true),
  rename:()=>open("Give it a name.",`<form id="rename-form"><label class="modal-field">Local project title<input id="new-title" value="${esc(project.title)}" maxlength="60" required></label><p class="dialog-note">The title stays in this tab and your JSON snapshot. Reloading returns to Greenhouse.</p><div class="dialog-actions"><button class="button primary">Use this title</button></div></form>`),
  about:()=>open("A small tool. Clear boundaries.",`<p class="dialog-note">Framespace is an independent visual-page-editor concept inspired by the original brief, not an official Framer product. The Greenhouse composition and botanical illustration are original sample artwork.</p><ul class="dialog-list"><li>Actual frame creation, multi-selection, dragging, corner resizing, rotation, fill, opacity, position, dimensions, radius and text edits work in this tab. Top of the layers list is front.</li><li>Undo/redo stores 50 in-memory edits; the document holds up to 80 frames. Reloading resets it. There is no browser storage, authentication, collaboration, backend, database, network save or AI.</li><li>Preview is the actual vector artwork. JSON snapshot downloads are readable project data, not production HTML or a code export. Import and persistence are outside this concept.</li><li>Alignment uses pre-rotation bounds. Equal-gap distribution requires at least three unlocked frames and enough room for nonnegative gaps. Text clips to its frame; botanical paths scale as a unit.</li><li>Only the static frontend is implemented. Next.js, Recoil and react-moveable were not used; the pure JavaScript engine keeps this independently deployable without a build or runtime service.</li><li>No API requests, analytics, credentials or environment variables. Inter: SIL OFL; Lucide: ISC. License files are in the local assets. Original implementation: GPT-6.1 Sol.</li></ul>`),
  shortcuts:()=>open("Less clicking. More making.",`<div class="shortcut-list"><span>Select / pan / add a frame</span><kbd>V / H / F</kbd><span>Temporary pan</span><kbd>Space + drag</kbd><span>Zoom around your pointer</span><kbd>Wheel over canvas</kbd><span>Multiple selection</span><kbd>Shift + click</kbd><span>Move / larger move</span><kbd>Arrows / Shift + arrows</kbd><span>Undo / redo</span><kbd>Ctrl or ⌘ Z / Shift Z</kbd><span>Select all / clear selection</span><kbd>Ctrl or ⌘ A / Esc</kbd><span>Delete unlocked frames</span><kbd>Delete / Backspace</kbd></div><p class="dialog-note">Keyboard canvas shortcuts work when the canvas has focus. Editable properties provide an alternative to drag, resize and rotation handles. Use the zoom selector on touchscreens; pinch gestures are outside this concept.</p>`),
  reset:()=>open("A fresh start?",`<p class="dialog-note">Reset the frames, title, view and undo history to the original Greenhouse sample. Current unsaved edits will be replaced in this tab. Download a JSON snapshot first if you want to keep a readable record.</p><div class="dialog-actions"><button class="button primary" data-action="confirm-reset">Reset the local sample</button><button class="button" data-action="cancel">Keep exploring</button></div>`),
  "confirm-reset":()=>{project=createProject();selection=["f4"];past=[];future=[];camera={x:0,y:0,zoom:1};tool="select";opacityBase=null;render();$("#operation-status").textContent="Fresh local sample. Nothing saved remotely.";close();},
  cancel:close,
  home:()=>{camera={x:0,y:0,zoom:1};select("f1");},
  fit:()=>{camera={x:0,y:0,zoom:1};view();$("#operation-status").textContent="View reset. Frames unchanged.";},
  "zoom-in":()=>zoom(camera.zoom+.25),"zoom-out":()=>zoom(camera.zoom-.25),
  undo:()=>{if(!past.length)return;future.push(structuredClone(project));project=past.pop();selection=[];$("#operation-status").textContent="Undone. Still only in this tab.";render();},
  redo:()=>{if(!future.length)return;past.push(structuredClone(project));project=future.pop();selection=[];$("#operation-status").textContent="Redone. Still only in this tab.";render();},
  delete:()=>commit(deleteFrames(project,selection),"Unlocked frames removed."),
  lock:()=>{const frames=project.frames.filter(f=>selection.includes(f.id)),locked=!frames.every(f=>f.locked);let next=project;for(const f of frames)next=updateFrame(next,f.id,{locked});commit(next,locked?"Selection locked.":"Selection unlocked.");},
  back:()=>commit(stepLayer(project,selection[0],-1),"One layer backward."),
  front:()=>commit(stepLayer(project,selection[0],1),"One layer forward.")
};
document.addEventListener("click",e=>{
  const button=e.target.closest("[data-action]");if(button&&!button.disabled){attempt(()=>actions[button.dataset.action]?.());return;}
  const layer=e.target.closest("[data-layer]");if(layer){select(layer.dataset.layer,e.shiftKey);return;}
  const align=e.target.closest("[data-align]");if(align&&!align.disabled){attempt(()=>commit(arrange(project,selection,align.dataset.align),"Unlocked frames aligned."));return;}
  const mode=e.target.closest("[data-tool]");if(mode){tool=mode.dataset.tool;render();}
});
dialog.addEventListener("submit",e=>{if(e.target.id!=="rename-form")return;e.preventDefault();const title=$("#new-title").value.trim();if(!title){$("#new-title").setCustomValidity("Use a non-blank title.");$("#new-title").reportValidity();return;}commit({...project,title},"Local project renamed.");close();});
dialog.addEventListener("input",e=>e.target.setCustomValidity?.(""));
$("#properties").addEventListener("input",e=>{
  if(e.target.name!=="opacitySlider"||selection.length!==1)return;
  if(!opacityBase)opacityBase=structuredClone(project);project=updateFrame(opacityBase,selection[0],{opacity:Number(e.target.value)/100});$("#properties [name=opacity]").value=e.target.value;renderArt();
});
$("#properties").addEventListener("change",e=>{
  const name=e.target.name;if(!name||selection.length!==1)return;
  attempt(()=>{
    if(e.target.type==="number"&&e.target.value.trim()==="")throw Error("Enter a number to update this property.");
    const opacity=name==="opacity"||name==="opacitySlider",key=opacity?"opacity":name,value=["name","content","fill"].includes(name)?e.target.value:opacity?Number(e.target.value)/100:Number(e.target.value),base=opacityBase||project;opacityBase=null;commit(updateFrame(project,selection[0],{[key]:value}),"Frame property updated locally.",base);
  });
});
$("#zoom").addEventListener("change",e=>zoom(Number(e.target.value)));
const world=e=>{const p=canvas.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(canvas.getScreenCTM().inverse());};
canvas.addEventListener("wheel",e=>{e.preventDefault();zoom(camera.zoom*(e.deltaY>0?.9:1.1),world(e));},{passive:false});
canvas.addEventListener("pointerdown",e=>{
  if(e.button!==0||gesture)return;e.preventDefault();canvas.focus({preventScroll:true});const p=world(e);
  if(space||tool==="hand")gesture={type:"pan",clientX:e.clientX,clientY:e.clientY,camera:{...camera},scale:canvas.getScreenCTM().a};
  else{
    const handle=e.target.closest("[data-handle]"),id=e.target.closest("[data-frame]")?.dataset.frame;
    if(handle&&selection.length===1){const f=project.frames.find(f=>f.id===selection[0]);gesture={type:handle.dataset.handle,base:structuredClone(project),frame:structuredClone(f),start:p,startAngle:Math.atan2(p.y-f.y-f.height/2,p.x-f.x-f.width/2)};}
    else if(id){if(!selection.includes(id)||e.shiftKey)select(id,e.shiftKey);const f=project.frames.find(f=>f.id===id);if(!selection.includes(id)||f.locked)return;gesture={type:"move",base:structuredClone(project),ids:[...selection],start:p};}
    else{if(!e.shiftKey){selection=[];render();}return;}
  }
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove",e=>{
  if(!gesture)return;const g=gesture;
  if(g.type==="pan"){camera={...g.camera,x:g.camera.x-(e.clientX-g.clientX)/g.scale,y:g.camera.y-(e.clientY-g.clientY)/g.scale};view();return;}
  const p=world(e),dx=p.x-g.start.x,dy=p.y-g.start.y;
  try{
    if(g.type==="move")project=moveFrames(g.base,g.ids,dx,dy);
    else if(g.type==="resize")project=updateFrame(g.base,g.frame.id,resizeFrame(g.frame,dx,dy));
    else{const angle=Math.atan2(p.y-g.frame.y-g.frame.height/2,p.x-g.frame.x-g.frame.width/2),rotation=g.frame.rotation+(angle-g.startAngle)*180/Math.PI;project=updateFrame(g.base,g.frame.id,{rotation:((rotation+540)%360+360)%360-180});}
    renderArt();
  }catch(error){$("#operation-status").textContent=error.message;}
});
function end(cancel=false){if(!gesture)return;const g=gesture;gesture=null;if(g.base){if(cancel){project=g.base;render();}else commit(project,"Frame gesture applied locally.",g.base);}}
canvas.addEventListener("pointerup",e=>{end();if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);});canvas.addEventListener("pointercancel",()=>end(true));canvas.addEventListener("lostpointercapture",()=>end(true));
window.addEventListener("blur",()=>{space=false;end(true);view();});
document.addEventListener("keydown",e=>{
  if(dialog.open||e.target.closest("input,textarea,select,[contenteditable=true]"))return;
  const key=e.key.toLowerCase(),cmd=e.ctrlKey||e.metaKey;
  if(cmd&&key==="z"){e.preventDefault();(e.shiftKey?actions.redo:actions.undo)();return;}
  if(cmd&&key==="y"){e.preventDefault();actions.redo();return;}
  if(e.key==="Escape"){if(gesture)end(true);else{selection=[];tool="select";render();}return;}
  if(document.activeElement!==canvas)return;
  if(cmd&&key==="a"){e.preventDefault();selection=project.frames.map(f=>f.id);render();return;}
  if(e.code==="Space"){e.preventDefault();space=true;view();return;}
  if(["Delete","Backspace"].includes(e.key)&&selection.length){e.preventDefault();attempt(actions.delete);return;}
  if(e.key.startsWith("Arrow")&&selection.length){e.preventDefault();const n=e.shiftKey?10:1;attempt(()=>commit(moveFrames(project,selection,e.key==="ArrowLeft"?-n:e.key==="ArrowRight"?n:0,e.key==="ArrowUp"?-n:e.key==="ArrowDown"?n:0),"Frames nudged locally."));return;}
  if(!cmd&&!e.altKey&&key==="f"){e.preventDefault();attempt(actions.add);}
  if(!cmd&&!e.altKey&&["v","h"].includes(key)){tool=key==="v"?"select":"hand";render();}
});
document.addEventListener("keyup",e=>{if(e.code==="Space"){space=false;view();}});
if(matchMedia("(max-width:1000px)").matches){$("#layers").open=false;$("#inspector").open=false;}
render();
