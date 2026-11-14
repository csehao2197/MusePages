export const MAX_FILE=10*1024*1024,MAX_TOTAL=30*1024*1024,MAX_COUNT=12;
export const escape=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function group(file){return file.type.startsWith("image/")?"images":file.type.startsWith("text/")||/pdf|document|spreadsheet|presentation|json/.test(file.type)?"documents":"other";}
export function bytes(size){if(size===0)return "0 B";if(size<1024)return `${size} B`;if(size<1024*1024)return `${(size/1024).toFixed(1)} KB`;return `${(size/1024/1024).toFixed(1)} MB`;}
export function validate(title,file,items,replacing=null){
  if(!title.trim()||title.trim().length>80)return "Give your file a title of 1–80 characters.";
  if(!file||!file.name||!Number.isSafeInteger(file.size)||file.size<0)return "Choose one file from your device.";
  if(file.size>MAX_FILE)return "This local workspace accepts files up to 10 MB.";
  if(replacing!==null&&!items.some(item=>item.id===replacing))return "That file is no longer in this workspace.";
  if(replacing===null&&items.length>=MAX_COUNT)return "This local workspace holds 12 files. Remove one to make room.";
  if(items.filter(item=>item.id!==replacing).reduce((sum,item)=>sum+item.file.size,0)+file.size>MAX_TOTAL)return "This tab has a 30 MB memory budget. Remove a file or choose a smaller one.";
  return null;
}
export function filterItems(items,query="",category="all",sort="newest"){
  const q=query.trim().toLowerCase(),list=items.filter(item=>(category==="all"||group(item.file)===category)&&`${item.title} ${item.file.name}`.toLowerCase().includes(q));
  return list.sort((a,b)=>sort==="name"?a.title.localeCompare(b.title):sort==="size"?b.file.size-a.file.size:sort==="oldest"?a.created-b.created:b.created-a.created);
}
export function safeName(name){return name.replace(/[\u0000-\u001f<>:"/\\|?*]/g,"_").slice(0,200)||"download";}
