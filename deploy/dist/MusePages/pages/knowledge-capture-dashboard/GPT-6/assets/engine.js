export const MAX_NODES=100;
export const utcDay=(value=new Date())=>new Date(value).toISOString().slice(0,10);
export function addDays(day,count){if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!Number.isInteger(count))throw new Error("Invalid day");const date=new Date(`${day}T00:00:00.000Z`);if(!Number.isFinite(date.getTime())||utcDay(date)!==day)throw new Error("Invalid day");date.setUTCDate(date.getUTCDate()+count);return utcDay(date);}
const normalized=(value)=>String(value??"").normalize("NFKC").toLowerCase().trim();
const terms={Learning:/learn|retriev|recall|study|retention/i,Memory:/memory|remember|spaced|forget/i,Design:/design|interface|typography|usability/i,AI:/\bai\b|language model|llm|embedding/i,Privacy:/privacy|private|consent|personal data/i,Systems:/system|architecture|queue|database/i,Research:/research|experiment|evidence|hypothesis/i};
export function capture(input,settings={detectTags:true}){
  const title=String(input.title??"").trim(),raw=String(input.raw??"").trim(),url=String(input.url??"").trim();
  if(input.type==="video"&&!raw)throw new Error("No transcript available to capture.");
  if(title.length<3||title.length>100)throw new Error("Use a title of 3–100 characters.");
  if(raw.length<20||raw.length>8000)throw new Error("Paste 20–8,000 characters of article text or a transcript.");
  if(url){let parsed;try{parsed=new URL(url);}catch{throw new Error("Use a complete http:// or https:// source URL.");}if(!["http:","https:"].includes(parsed.protocol)||parsed.username||parsed.password)throw new Error("Use an HTTP(S) URL without embedded credentials.");}
  const tags=String(input.tags??"").split(",").map((item)=>item.trim()).filter(Boolean);
  if(tags.length>5||tags.some((tag)=>tag.length>24||/[\x00-\x1f\x7f]/.test(tag)))throw new Error("Use up to 5 comma-separated tags, each at most 24 characters.");
  const selected=tags.length?tags:(settings.detectTags?Object.entries(terms).filter(([,pattern])=>pattern.test(title+" "+raw)).map(([tag])=>tag).slice(0,5):[]);
  const unique=[...new Map(selected.map((tag)=>[normalized(tag),tag])).values()];
  const sentences=raw.replace(/\s+/g," ").match(/[^.!?]+[.!?]+|[^.!?]+$/g)??[raw];
  const summary=sentences.slice(0,2).join("").trim().slice(0,420);
  return {title,raw,url,type:input.type==="video"?"video":"article",tags:unique.length?unique:["Unsorted"],summary,summaryMethod:"Local extract: first two sentences (up to 420 characters)"};
}
export function makeSeed(today=utcDay()){
  const samples=[
    ["small-loops","A smaller loop, a stronger memory","Short retrieval sessions turn saved information into something we can recall. A question is often more useful than another reread. Schedule one small check tomorrow instead of a large review next month.","Learning, Memory"],
    ["local-first","The case for a local-first workspace","A private workspace makes the boundary around personal data easier to see. Local-first systems can keep the working copy close to its owner. Sync and backup still require explicit design.","Privacy, Systems"],
    ["design-retrieval","Design for retrieval, not just storage","A useful interface helps us ask better questions of saved material. Design choices such as clear titles and focused collections reduce the distance between capturing and learning.","Design, Learning"],
    ["connected-notes","Connections need a reason","A knowledge graph is only useful when its edges can be explained. Shared tags are a simple, inspectable rule, but they are not semantic understanding. A system should label that difference.","Systems, Research"],
    ["spaced-practice","A practical rhythm for spaced practice","Spaced repetition schedules the next recall attempt after a delay. A difficult review shortens the interval and a successful review gradually extends it. Memory ratings should reflect actual recall.","Learning, Memory, Research"],
    ["honest-ai","Make AI boundaries visible","An AI interface should show where model output ends and source evidence begins. Clear attribution helps a reader inspect claims. A deterministic summary is not the same as a language-model summary.","AI, Design, Research"],
    ["small-databases","Small data, explicit relationships","Database relationships describe how records belong together. A graph can reveal related work when every edge has a clear label. Deleting a record should also clean up its dependent references.","Systems, Design"],
    ["capture-consent","Capture with context and consent","Privacy starts before information enters a tool. Capture only the text needed for a specific question. A URL alone does not grant permission to scrape personal data or send it to a provider.","Privacy, Research"]
  ];
  const nodes=samples.map(([id,title,raw,tags],index)=>({id,...capture({title,raw,tags,type:"article"}),capturedAt:`${addDays(today,-index)}T00:00:00.000Z`}));
  const reviews=Object.fromEntries(nodes.map((node,index)=>[node.id,{repetitions:0,interval:0,ease:2.5,nextReviewDate:addDays(today,index<4?0:2)}]));
  return {schema:1,nodes,reviews,collections:[{id:"learning-lab",name:"Learning lab",description:"Small experiments in remembering.",nodeIds:["small-loops","design-retrieval","spaced-practice"]},{id:"thoughtful-systems",name:"Thoughtful systems",description:"Privacy, structure, and clear boundaries.",nodeIds:["local-first","connected-notes","small-databases"]}],consolidations:[],settings:{detectTags:true,showEntities:true}};
}
export function filteredNodes(state,query="",collectionId="all"){
  const tokens=normalized(query).split(/\s+/).filter(Boolean);
  const collection=state.collections.find((item)=>item.id===collectionId);
  return state.nodes.filter((node)=>(collectionId==="all"||collection?.nodeIds.includes(node.id))&&tokens.every((token)=>normalized([node.title,node.summary,node.tags.join(" ")].join(" ")).includes(token))).sort((a,b)=>b.capturedAt.localeCompare(a.capturedAt)||a.id.localeCompare(b.id));
}
export function graphEdges(nodes){
  const edges=[];
  nodes.forEach((source,index)=>nodes.slice(index+1).forEach((target)=>{
    const shared=source.tags.filter((tag)=>target.tags.some((item)=>normalized(item)===normalized(tag))&&normalized(tag)!=="unsorted");
    if(shared.length)edges.push({source:source.id,target:target.id,tags:shared});
  }));
  return edges;
}
export function clusterNodes(nodes,focusId,limit=12){
  const edges=graphEdges(nodes),found=new Set(nodes.some((node)=>node.id===focusId)?[focusId]:nodes[0]?[nodes[0].id]:[]);
  for(let hop=0;hop<2;hop++){const current=new Set(found);for(const edge of edges){if(current.has(edge.source))found.add(edge.target);if(current.has(edge.target))found.add(edge.source);}}
  return nodes.filter((node)=>found.has(node.id)).slice(0,limit);
}
export function deleteNodes(state,ids){
  const removed=new Set(ids);
  return {...state,nodes:state.nodes.filter((node)=>!removed.has(node.id)),reviews:Object.fromEntries(Object.entries(state.reviews).filter(([id])=>!removed.has(id))),collections:state.collections.map((collection)=>({...collection,nodeIds:collection.nodeIds.filter((id)=>!removed.has(id))})),consolidations:state.consolidations.filter((item)=>!item.sourceNodeIds.some((id)=>removed.has(id)))};
}
export function addCollection(state,id,name,description=""){
  const title=String(name??"").trim(),detail=String(description??"").trim();
  if(title.length<2||title.length>30||detail.length>140)throw new Error("Use a 2–30 character name and at most 140 characters of description.");
  if(state.collections.length>=12)throw new Error("This local demo supports up to 12 collections.");
  if(state.collections.some((item)=>normalized(item.name)===normalized(title)))throw new Error("A collection with that name already exists.");
  if(!id||state.collections.some((item)=>item.id===id))throw new Error("Collection identity is not unique.");
  return {...state,collections:[...state.collections,{id,name:title,description:detail,nodeIds:[]}]};
}
export function addToCollection(state,collectionId,ids){
  const collection=state.collections.find((item)=>item.id===collectionId);
  if(!collection)throw new Error("Choose an existing collection.");
  if(ids.some((id)=>!state.nodes.some((node)=>node.id===id)))throw new Error("A selected capture no longer exists.");
  return {...state,collections:state.collections.map((item)=>item.id===collectionId?{...item,nodeIds:[...new Set([...item.nodeIds,...ids])]}:item)};
}
export function reviewSM2(previous,rating,today=utcDay()){
  const quality={forgot:0,hard:3,good:4,easy:5}[rating];
  if(quality===undefined||!Number.isInteger(previous.repetitions)||previous.repetitions<0||!Number.isFinite(previous.ease)||previous.ease<1.3||!Number.isInteger(previous.interval)||previous.interval<0)throw new Error("Invalid review state");
  let repetitions=previous.repetitions,interval;
  if(quality<3){repetitions=0;interval=1;}
  else{interval=repetitions===0?1:repetitions===1?6:Math.max(1,Math.round(previous.interval*previous.ease));repetitions++;}
  const ease=Math.max(1.3,Math.round((previous.ease+.1-(5-quality)*(.08+(5-quality)*.02))*100)/100);
  return {repetitions,interval,ease,nextReviewDate:addDays(today,interval)};
}
export function dueNodes(state,today=utcDay()){return state.nodes.filter((node)=>state.reviews[node.id]?.nextReviewDate<=today).sort((a,b)=>state.reviews[a.id].nextReviewDate.localeCompare(state.reviews[b.id].nextReviewDate)||a.id.localeCompare(b.id));}
export function buildDigests(state,createId=()=>crypto.randomUUID()){
  const used=new Set(state.consolidations.flatMap((item)=>item.sourceNodeIds)),available=state.nodes.filter((node)=>!used.has(node.id)),groups=new Map();
  for(const node of available)for(const tag of node.tags){const key=normalized(tag);if(key==="unsorted")continue;if(!groups.has(key))groups.set(key,{tag,nodes:[]});groups.get(key).nodes.push(node);}
  const added=[];
  for(const group of [...groups.values()].sort((a,b)=>b.nodes.length-a.nodes.length||a.tag.localeCompare(b.tag))){
    const members=group.nodes.filter((node)=>!used.has(node.id)).slice(0,4);if(members.length<2)continue;
    added.push({id:createId(),theme:group.tag,method:"Shared-tag digest; not an AI insight",sourceNodeIds:members.map((node)=>node.id),summary:members.map((node)=>`${node.title}: ${node.summary}`).join("\n\n")});members.forEach((node)=>used.add(node.id));
  }
  return {...state,consolidations:[...state.consolidations,...added]};
}
export function retrieve(state,question){
  const stop=new Set(["the","a","an","how","what","why","is","are","my","about","can","do","i","to","of","and","in","tell","me","does"]);
  const words=normalized(question).split(/[^\p{L}\p{N}-]+/u).filter((word)=>word&&!stop.has(word));
  if(!words.length)return [];
  return state.nodes.map((node)=>({node,score:words.filter((word)=>normalized([node.title,node.summary,node.tags.join(" ")].join(" ")).includes(word)).length})).filter((item)=>item.score>0).sort((a,b)=>b.score-a.score||a.node.title.localeCompare(b.node.title)).slice(0,3).map((item)=>item.node);
}
