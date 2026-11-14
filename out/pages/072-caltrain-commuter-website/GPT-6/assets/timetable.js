const names=["San Francisco (4th & King)","22nd Street","Bayshore","South San Francisco","San Bruno","Millbrae","Broadway","Burlingame","San Mateo","Hayward Park","Hillsdale","Belmont","San Carlos","Redwood City","Atherton","Menlo Park","Palo Alto","Stanford","California Ave","San Antonio","Mountain View","Sunnyvale","Lawrence","Santa Clara","College Park","San Jose Diridon","Tamien","Capitol","Blossom Hill","Morgan Hill","San Martin","Gilroy"];
const positions=[0,5,11,17,22,27,31,34,39,42,46,50,54,60,63,67,72,74,78,83,89,95,101,107,111,118,124,134,141,158,168,181];
export const stations=names.map((name,index)=>({id:["san-francisco","22nd-street","bayshore","south-san-francisco","san-bruno","millbrae","broadway","burlingame","san-mateo","hayward-park","hillsdale","belmont","san-carlos","redwood-city","atherton","menlo-park","palo-alto","stanford","california-ave","san-antonio","mountain-view","sunnyvale","lawrence","santa-clara","college-park","san-jose-diridon","tamien","capitol","blossom-hill","morgan-hill","san-martin","gilroy"][index],name,index,position:positions[index],legacy:[14,17].includes(index)}));
export const station=id=>stations.find(s=>s.id===id);
export const scenarios=["regular","delay","no-service"];
export function timeLabel(minutes){const day=Math.floor(minutes/1440),value=((minutes%1440)+1440)%1440,hour=Math.floor(value/60);return `${hour%12||12}:${String(value%60).padStart(2,"0")} ${hour<12?"AM":"PM"}${day>0?" +"+day+"d":""}`;}
const limited=new Set([0,3,5,8,10,13,15,16,18,20,21,23,25,26,29,30,31]),express=new Set([0,5,13,16,20,21,25,26,31]);
export function upcoming(fromId,toId,now=490,scenario="regular"){
  const from=station(fromId),to=station(toId);
  if(!from||!to||fromId===toId||!Number.isInteger(now)||now<0||now>1439||!scenarios.includes(scenario))throw Error("Choose two different listed stops and a valid demo clock.");
  if(from.legacy||to.legacy||scenario==="no-service")return [];
  const south=to.index>from.index,rows=[];
  for(let n=0;n<49;n++){
    const type=["Local","Limited","Express"][n%3],stops=type==="Limited"?limited:type==="Express"?express:null;
    if(stops&&(!stops.has(from.index)||!stops.has(to.index)))continue;
    const factor=type==="Local"?1:type==="Limited"?.82:.68,offset=south?from.position:181-from.position;
    const hold=scenario==="delay"&&n%3===0?6:0,departure=300+n*20+Math.round(offset*factor)+hold,duration=Math.max(1,Math.round(Math.abs(to.position-from.position)*factor));
    if(departure<now)continue;
    rows.push({id:`D-${type[0]}-${String(n+1).padStart(3,"0")}`,type,direction:south?"Southbound":"Northbound",departure,arrival:departure+duration,duration,hold,wait:departure-now});
  }
  return rows.sort((a,b)=>a.departure-b.departure||a.id.localeCompare(b.id)).slice(0,5);
}
export function weather(id,now=490){
  const stop=station(id);if(!stop||stop.legacy)return null;
  const hour=Math.floor(now/60),temp=56+Math.round(stop.index*.6)+Math.max(-3,Math.min(4,Math.floor((hour-8)/3)));
  const night=hour<6||hour>=19;
  return {temp,wind:12-stop.index%8,humidity:78-Math.round(stop.index*.6),condition:night?(stop.index<10?"Cloudy":"Clear"):(stop.index<10?"Partly cloudy":stop.index>24?"Sunny":"Mostly sunny"),icon:night?(stop.index<10?"cloud-moon":"moon"):(stop.index<10?"cloud-sun":"sun")};
}
export function forecast(id,now){return [1,2,3].map(step=>{const minute=(Math.floor(now/60)+step)*60;return {minute,...weather(id,minute%1440)};});}
export function cleanFavorites(raw){
  if(!Array.isArray(raw))return [];
  const clean=[];
  for(const entry of raw.slice(0,100)){
    if(clean.length===5)break;
    if(!entry||typeof entry.id!=="string"||!/^[a-zA-Z0-9-]{1,50}$/.test(entry.id)||typeof entry.name!=="string"||!entry.name.trim()||entry.name.trim().length>40||!station(entry.from)||!station(entry.to)||entry.from===entry.to||clean.some(r=>r.id===entry.id||r.name.toLowerCase()===entry.name.trim().toLowerCase()||(r.from===entry.from&&r.to===entry.to)))continue;
    clean.push({id:entry.id,name:entry.name.trim(),from:entry.from,to:entry.to});
  }
  return clean;
}
