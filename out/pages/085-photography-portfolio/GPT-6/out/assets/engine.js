export const escape=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const slugify=value=>value.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
export const caption=name=>name.replace(/^\d+__/,"").replace(/\.(jpe?g|png)$/i,"").replace(/[-_]+/g," ");
export function buildCatalog(input){
  if(!Array.isArray(input)||input.length>50)throw Error("The local album manifest must contain up to 50 albums.");
  const slugs=new Set(),ids=new Set();
  return input.map(album=>{
    const match=/^(\d{4}-\d{2}-\d{2})__(.+)$/.exec(album.folder||"");
    if(!match)throw Error("An album folder needs a date and title.");
    const date=Date.parse(match[1]+"T00:00:00Z");
    if(!Number.isFinite(date)||new Date(date).toISOString().slice(0,10)!==match[1])throw Error("An album has an invalid date.");
    const slug=slugify(match[2]);if(!slug||slugs.has(slug))throw Error("Album titles must resolve to unique public slugs.");slugs.add(slug);
    if(!Array.isArray(album.files)||album.files.length>100)throw Error("An album needs a bounded file list.");
    const files=album.files.filter(file=>/\.(jpe?g|png)$/i.test(file.name||""));
    for(const file of files){
      if(typeof file.id!=="string"||!file.id||ids.has(file.id))throw Error("Photo IDs must be unique.");ids.add(file.id);
      if(!/^assets\/[a-z0-9-]+\.(jpe?g|png)$/.test(file.url||""))throw Error("Photographs must use local, relative image paths.");
      if(typeof file.alt!=="string"||!file.alt.trim())throw Error("Photographs need alternative text.");
    }
    const images=files.filter(file=>!/^__cover\.jpe?g$/i.test(file.name)).sort((a,b)=>a.name.localeCompare(b.name,"en",{numeric:true})||a.id.localeCompare(b.id));
    const cover=files.find(file=>/^__cover\.jpe?g$/i.test(file.name))||images[0]||null;
    return {slug,title:match[2].replace(/[-_]+/g," "),date:match[1],category:String(album.category||"Landscape"),description:String(album.description||""),cover,images,ignored:album.files.length-files.length};
  }).sort((a,b)=>b.date.localeCompare(a.date)||a.title.localeCompare(b.title));
}
export const cycleIndex=(index,delta,length)=>length?((index+delta)%length+length)%length:0;
export function filterProjects(projects,query="",category="",sort="newest"){
  const term=query.trim().toLowerCase();
  return projects.filter(p=>(!term||`${p.title} ${p.description} ${p.category}`.toLowerCase().includes(term))&&(!category||p.category===category)).sort((a,b)=>sort==="title"?a.title.localeCompare(b.title):sort==="oldest"?a.date.localeCompare(b.date):b.date.localeCompare(a.date));
}
export function createCatalogLoader(fetcher,{now=Date.now,staleTime=90000,cacheTime=300000}={}){
  let cached=null,loadedAt=0,pending=null;
  return {async load({force=false}={}){
    if(cached&&now()-loadedAt>=cacheTime)cached=null;
    if(!force&&cached&&now()-loadedAt<staleTime)return cached;
    if(pending)return pending;
    pending=(async()=>{const result=buildCatalog(await fetcher());cached=result;loadedAt=now();return result;})();
    try{return await pending;}finally{pending=null;}
  }};
}
