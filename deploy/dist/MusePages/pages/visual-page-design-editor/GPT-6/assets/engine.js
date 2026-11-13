export const esc=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v)),copy=project=>structuredClone(project);
const frame=(id,name,x,y,width,height,fill,kind="plain",content="",extra={})=>({id,name,x,y,width,height,fill,kind,content,rotation:0,opacity:1,radius:0,fontSize:32,locked:false,...extra});
export function createProject(){return {title:"Greenhouse",nextId:8,frames:[
  frame("f1","Desktop / page backdrop",100,65,820,570,"#f4f3e8","plain","",{locked:true,radius:2}),
  frame("f2","Navigation",140,97,740,40,"#f4f3e8","nav","greenhouse",{fontSize:24}),
  frame("f3","A better kind of everyday",145,188,430,168,"#f4f3e8","text","Better\nby nature.",{fontSize:74}),
  frame("f4","Botanical illustration",610,180,270,280,"#dbe3bb","art","",{radius:120}),
  frame("f5","Explore collection",145,411,225,52,"#244d39","button","Explore the collection",{fontSize:14,radius:26}),
  frame("f6","A little introduction",145,501,435,73,"#f4f3e8","text","Thoughtfully made essentials.\nFor a greener kind of everyday.",{fontSize:18}),
  frame("f7","Made for growing",648,496,222,65,"#edb68d","badge","MADE FOR GROWING",{fontSize:12,rotation:-7,radius:2})
]};}
function find(project,id){const f=project.frames.find(f=>f.id===id);if(!f)throw Error("Select an existing frame.");return f;}
function finite(v,min,max,label){if(!Number.isFinite(v)||v<min||v>max)throw Error(`${label}: use a number from ${min} to ${max}.`);}
export function addFrame(project,x,y){
  if(project.frames.length>=80)throw Error("This local playground holds up to 80 frames.");
  finite(x,-4000,5000,"X");finite(y,-4000,5000,"Y");
  const next=copy(project),id=`f${next.nextId++}`;next.frames.push(frame(id,`Frame ${id.slice(1).padStart(2,"0")}`,x,y,260,180,"#d7ccef","plain","",{radius:12}));return next;
}
export function updateFrame(project,id,patch){
  const f=find(project,id),keys=Object.keys(patch);
  if(keys.length===1&&keys[0]==="locked"){if(typeof patch.locked!=="boolean")throw Error("Use a true or false lock.");}
  else{
    if(f.locked)throw Error("Unlock this frame to edit it.");
    for(const key of keys){
      const v=patch[key];
      if(["x","y"].includes(key))finite(v,-4000,5000,key);
      else if(["width","height"].includes(key))finite(v,30,2000,key);
      else if(key==="rotation")finite(v,-360,360,key);
      else if(key==="opacity")finite(v,0,1,key);
      else if(key==="radius")finite(v,0,200,key);
      else if(key==="fontSize")finite(v,12,120,key);
      else if(key==="fill"){if(typeof v!=="string"||!/^#[\da-f]{6}$/i.test(v))throw Error("Choose a six-digit hex fill.");}
      else if(key==="name"){if(typeof v!=="string"||!v.trim()||v.length>60)throw Error("Frame names use 1–60 characters.");}
      else if(key==="content"){if(typeof v!=="string"||v.length>160)throw Error("Text uses up to 160 characters.");}
      else throw Error("That frame property is fixed.");
    }
  }
  const next=copy(project);Object.assign(find(next,id),patch);return next;
}
export function moveFrames(project,ids,dx,dy){finite(dx,-10000,10000,"Move X");finite(dy,-10000,10000,"Move Y");const next=copy(project);for(const f of next.frames)if(ids.includes(f.id)&&!f.locked){f.x=clamp(f.x+dx,-4000,5000);f.y=clamp(f.y+dy,-4000,5000);}return next;}
export function deleteFrames(project,ids){const next=copy(project);next.frames=next.frames.filter(f=>f.locked||!ids.includes(f.id));return next;}
export function stepLayer(project,id,step){
  const f=find(project,id);if(f.locked)throw Error("Unlock this frame before reordering.");if(![-1,1].includes(step))throw Error("Move one layer at a time.");
  const next=copy(project),i=next.frames.findIndex(f=>f.id===id),j=clamp(i+step,0,next.frames.length-1);[next.frames[i],next.frames[j]]=[next.frames[j],next.frames[i]];return next;
}
export function arrange(project,ids,mode){
  const next=copy(project),frames=next.frames.filter(f=>ids.includes(f.id)&&!f.locked);
  if(!["left","top","centerX","centerY","horizontal"].includes(mode))throw Error("Choose one of the alignment tools.");
  if(frames.length<(mode==="horizontal"?3:2))throw Error(`Select ${mode==="horizontal"?"three":"two"} or more unlocked frames.`);
  if(mode==="left"||mode==="top"){const key=mode==="left"?"x":"y",value=Math.min(...frames.map(f=>f[key]));frames.forEach(f=>f[key]=value);}
  else if(mode==="centerX"||mode==="centerY"){const key=mode==="centerX"?"x":"y",size=mode==="centerX"?"width":"height",center=(Math.min(...frames.map(f=>f[key]))+Math.max(...frames.map(f=>f[key]+f[size])))/2;frames.forEach(f=>f[key]=center-f[size]/2);}
  else{frames.sort((a,b)=>a.x-b.x);const end=frames.at(-1).x+frames.at(-1).width,gap=(end-frames[0].x-frames.reduce((sum,f)=>sum+f.width,0))/(frames.length-1);if(gap<0)throw Error("Spread frames farther apart before equal-gap distribution.");let x=frames[0].x;frames.forEach(f=>{f.x=x;x+=f.width+gap;});}
  return next;
}
export function resizeFrame(f,dx,dy){
  const a=f.rotation*Math.PI/180,c=Math.cos(a),s=Math.sin(a),width=clamp(f.width+dx*c+dy*s,30,2000),height=clamp(f.height-dx*s+dy*c,30,2000),dw=width-f.width,dh=height-f.height;
  return{x:clamp(f.x+(c-1)*dw/2-s*dh/2,-4000,5000),y:clamp(f.y+s*dw/2+(c-1)*dh/2,-4000,5000),width,height};
}
export function artwork(f,prefix="canvas"){
  const clip=`${prefix}-clip-${f.id}`,textColor=f.kind==="button"?"#f5f4e8":"#244d39";
  let content="";
  if(f.kind==="art")content=`<svg width="${f.width}" height="${f.height}" viewBox="0 0 270 280" fill="none"><path d="M140 283C139 210 147 134 132 34" stroke="#38613b" stroke-width="4"/><path d="M140 229C77 238 28 191 33 151c65-6 101 26 107 78Z" fill="#6e8c43"/><path d="M141 195c9-57 43-82 92-74-2 48-31 80-92 74Z" fill="#486c39"/><path d="M140 143C85 145 62 110 65 78c45-3 72 16 75 65Z" fill="#7e9c50"/><path d="M139 115c-5-45 19-78 59-81 17 42-9 75-59 81Z" fill="#345636"/><path d="M136 68C102 60 91 33 105 13c32 1 43 23 31 55Z" fill="#9aaa69"/><path d="m140 228-73-48m74 15 62-48m-64-4-48-43m48 15 34-58" stroke="#b6c288" stroke-width="1.5"/><circle cx="221" cy="65" r="13" fill="#e2ba6e"/></svg>`;
  else if(f.kind==="nav")content=`<text x="0" y="29" font-family="Arial,sans-serif" font-size="${f.fontSize}" font-weight="700" fill="#244d39">${esc(f.content)}</text><text x="${Math.max(170,f.width-238)}" y="26" font-family="Arial,sans-serif" font-size="12" fill="#62725d">Our things　 Our story　 Bag (0)</text>`;
  else if(f.content){
    const lines=f.content.split("\n"),center=["button","badge"].includes(f.kind),x=center?f.width/2:0,start=center?f.height/2+f.fontSize*.35:f.fontSize*.86;
    content=`<text font-family="Arial,sans-serif" font-size="${f.fontSize}" fill="${textColor}" ${center?'text-anchor="middle"':""} ${f.kind==="badge"?'letter-spacing="1.5"':""}>${lines.map((text,i)=>`<tspan x="${x}" y="${start+i*f.fontSize*1.1}">${esc(text)}</tspan>`).join("")}</text>`;
  }
  return `<g transform="translate(${f.x} ${f.y}) rotate(${f.rotation} ${f.width/2} ${f.height/2})" opacity="${f.opacity}"><defs><clipPath id="${clip}"><rect width="${f.width}" height="${f.height}" rx="${f.radius}"/></clipPath></defs><rect width="${f.width}" height="${f.height}" rx="${f.radius}" fill="${f.fill}"/><g clip-path="url(#${clip})">${content}</g></g>`;
}
