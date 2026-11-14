export const esc=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const shape=(id,type,x,y,width,height,color,extra={})=>({id,type,x,y,width,height,color,rotation:0,locked:false,fontSize:36,text:"",...extra});
export function createDocument(){return {title:"Room for play",nextId:1,shapes:[
  shape("paper","rect",235,50,510,520,"#fff9ec",{locked:true}),
  shape("orbit","circle",513,95,170,170,"#a594d6"),
  shape("ribbon","rect",297,167,235,61,"#ec9671",{rotation:-10}),
  shape("headline","text",300,258,410,168,"#343344",{fontSize:66,text:"Make room\nfor play."}),
  shape("dot","circle",301,452,56,56,"#dbe18e"),
  shape("caption","text",385,455,300,45,"#797a65",{fontSize:16,text:"A little space.\nA lot of possibility."}),
  shape("rule","line",300,111,170,20,"#7f7e6a")
]};}
const clone=doc=>structuredClone(doc);
function requireShape(doc,id){const s=doc.shapes.find(s=>s.id===id);if(!s)throw Error("Choose an existing object.");return s;}
function finite(value,min,max,label){if(!Number.isFinite(value)||value<min||value>max)throw Error(`${label} must be between ${min} and ${max}.`);}
export function addShape(doc,type,x,y){
  if(!["rect","circle","line","text"].includes(type))throw Error("Choose rectangle, circle, line or text.");
  if(doc.shapes.length>=100)throw Error("This local playground is limited to 100 objects.");
  finite(x,-2000,3000,"X");finite(y,-2000,3000,"Y");
  const next=clone(doc),id=`shape-${next.nextId++}`,dimensions=type==="circle"?[120,120]:type==="line"?[180,20]:type==="text"?[240,70]:[150,100];
  next.shapes.push(shape(id,type,x,y,...dimensions,type==="text"?"#343344":type==="circle"?"#a594d6":"#ec9671",type==="text"?{text:"A new thought.",fontSize:32}:{}));
  return next;
}
export function patchShape(doc,id,patch){
  const current=requireShape(doc,id),keys=Object.keys(patch);
  if(keys.length===1&&keys[0]==="locked"){
    if(typeof patch.locked!=="boolean")throw Error("Lock must be on or off.");
  }else{
    if(current.locked)throw Error("Unlock this object before editing.");
    const allowed=["x","y","width","height","rotation","color","text","fontSize"];
    if(keys.some(key=>!allowed.includes(key)))throw Error("That property cannot be changed.");
    for(const key of keys){
      const value=patch[key];
      if(["x","y"].includes(key))finite(value,-2000,3000,key.toUpperCase());
      else if(["width","height"].includes(key))finite(value,20,1000,key);
      else if(key==="rotation")finite(value,-360,360,"Rotation");
      else if(key==="fontSize")finite(value,12,140,"Font size");
      else if(key==="color"&&(typeof value!=="string"||!/^#[\da-f]{6}$/i.test(value)))throw Error("Use a six-digit hex color.");
      else if(key==="text"&&(typeof value!=="string"||value.length>120))throw Error("Keep text to 120 characters.");
    }
  }
  const next=clone(doc);Object.assign(requireShape(next,id),patch);return next;
}
export function translateShapes(doc,ids,dx,dy){
  finite(dx,-6000,6000,"Horizontal move");finite(dy,-6000,6000,"Vertical move");
  const next=clone(doc);for(const s of next.shapes)if(ids.includes(s.id)&&!s.locked){s.x=clamp(s.x+dx,-2000,3000);s.y=clamp(s.y+dy,-2000,3000);}
  return next;
}
export function removeShapes(doc,ids){const next=clone(doc);next.shapes=next.shapes.filter(s=>s.locked||!ids.includes(s.id));return next;}
export function reorder(doc,id,direction){
  const s=requireShape(doc,id);if(s.locked)throw Error("Unlock this layer first.");
  if(![-1,1].includes(direction))throw Error("Choose one layer step.");
  const next=clone(doc),index=next.shapes.findIndex(s=>s.id===id),target=clamp(index+direction,0,next.shapes.length-1);
  [next.shapes[index],next.shapes[target]]=[next.shapes[target],next.shapes[index]];return next;
}
export function alignShapes(doc,ids,mode){
  const selected=doc.shapes.filter(s=>ids.includes(s.id)&&!s.locked);
  if(!["left","top","horizontal"].includes(mode))throw Error("Choose a supported arrangement.");
  if(selected.length<(mode==="horizontal"?3:2))throw Error(mode==="horizontal"?"Select at least three unlocked objects.":"Select at least two unlocked objects.");
  const next=clone(doc),targets=next.shapes.filter(s=>selected.some(t=>t.id===s.id));
  if(mode==="left"||mode==="top"){const key=mode==="left"?"x":"y",value=Math.min(...targets.map(s=>s[key]));targets.forEach(s=>s[key]=value);}
  else{targets.sort((a,b)=>a.x-b.x);const end=targets.at(-1).x+targets.at(-1).width,gap=(end-targets[0].x-targets.reduce((sum,s)=>sum+s.width,0))/(targets.length-1);let cursor=targets[0].x;for(const s of targets){s.x=cursor;cursor+=s.width+gap;}}
  return next;
}
export function resizeCorner(s,dx,dy){
  const angle=s.rotation*Math.PI/180,cos=Math.cos(angle),sin=Math.sin(angle),width=clamp(s.width+dx*cos+dy*sin,20,1000),height=clamp(s.height-dx*sin+dy*cos,20,1000),dw=width-s.width,dh=height-s.height;
  return {x:clamp(s.x+(cos-1)*dw/2-sin*dh/2,-2000,3000),y:clamp(s.y+sin*dw/2+(cos-1)*dh/2,-2000,3000),width,height};
}
export function runCommand(doc,command){
  const input=String(command).trim();let definitions=[];
  const grid=/^grid ([1-4])x([1-4])$/i.exec(input),row=/^row ([1-8])$/i.exec(input),text=/^text (.{1,60})$/i.exec(input);
  if(grid||row){const cols=Number(grid?.[1]||row[1]),rows=Number(grid?.[2]||1);for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)definitions.push({type:"rect",x:60+x*115,y:60+y*84,width:95,height:64});}
  else if(/^(circle|rectangle)$/i.test(input))definitions=[{type:input.toLowerCase()==="circle"?"circle":"rect",x:90,y:90}];
  else if(text)definitions=[{type:"text",x:90,y:90,text:text[1]}];
  else throw Error('Try "grid 3x3", "row 4", "circle", "rectangle", or "text hello". This is a rule helper, not AI.');
  if(doc.shapes.length+definitions.length>100)throw Error("The whole command would exceed 100 objects. Nothing was added.");
  let next=clone(doc);for(const definition of definitions){next=addShape(next,definition.type,definition.x,definition.y);const {type,x,y,...patch}=definition;if(Object.keys(patch).length)next=patchShape(next,next.shapes.at(-1).id,patch);}
  return next;
}
function textLines(s){
  const max=Math.max(1,Math.floor(s.width/(s.fontSize*.6))),lines=[];
  for(const paragraph of s.text.split("\n")){let line="";for(const word of paragraph.split(" ")){if(line&&line.length+word.length+1>max){lines.push(line);line="";}let remaining=word;while(remaining.length>max){if(line){lines.push(line);line="";}lines.push(remaining.slice(0,max));remaining=remaining.slice(max);}line+=(line?" ":"")+remaining;}lines.push(line);}
  const capacity=Math.max(1,Math.floor(s.height/(s.fontSize*1.14))),visible=lines.slice(0,capacity);if(lines.length>capacity)visible[capacity-1]=visible[capacity-1].slice(0,Math.max(1,max-1))+"…";return visible;
}
export function shapeMarkup(s){
  const transform=`rotate(${s.rotation} ${s.x+s.width/2} ${s.y+s.height/2})`;
  const common=`fill="${s.color}"`;
  let element;
  if(s.type==="rect")element=`<rect x="${s.x}" y="${s.y}" width="${s.width}" height="${s.height}" rx="4" ${common}/>`;
  else if(s.type==="circle")element=`<ellipse cx="${s.x+s.width/2}" cy="${s.y+s.height/2}" rx="${s.width/2}" ry="${s.height/2}" ${common}/>`;
  else if(s.type==="line")element=`<line x1="${s.x}" y1="${s.y+s.height/2}" x2="${s.x+s.width}" y2="${s.y+s.height/2}" stroke="${s.color}" stroke-width="3"/>`;
  else element=`<text ${common} font-family="Arial, sans-serif" font-size="${s.fontSize}" font-weight="400">${textLines(s).map((text,index)=>`<tspan x="${s.x}" y="${s.y+s.fontSize+index*s.fontSize*1.14}">${esc(text)}</tspan>`).join("")}</text>`;
  return `<g transform="${transform}">${element}</g>`;
}
export function serializeSvg(doc){return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620"><title>${esc(doc.title)}</title><rect width="1000" height="620" fill="#ebe8e3"/>${doc.shapes.map(shapeMarkup).join("")}</svg>\n`;}
