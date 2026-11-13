export const KEY="path-alert:browser-demo:prefs:v1";
export const routes=[{id:"nwk-wtc",name:"Newark–WTC",short:"NWK–WTC",color:"#da3941",stations:["Newark","Harrison","Journal Square","Grove Street","Exchange Place","World Trade Center"]},{id:"jsq-33",name:"Journal Square–33rd",short:"JSQ–33",color:"#d5a020",stations:["Journal Square","Grove Street","Newport","Christopher Street","9th Street","14th Street","23rd Street","33rd Street"]},{id:"hob-wtc",name:"Hoboken–WTC",short:"HOB–WTC",color:"#55a27d",stations:["Hoboken","Newport","Exchange Place","World Trade Center"]},{id:"hob-33",name:"Hoboken–33rd",short:"HOB–33",color:"#4c86c6",stations:["Hoboken","Newport","Christopher Street","9th Street","14th Street","23rd Street","33rd Street"]}];
export const stations=[...new Set(routes.flatMap(route=>route.stations))];
export const defaults={lines:["nwk-wtc","jsq-33"],stations:[],frequency:"immediate",theme:"light",read:[]};
export const escape=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const stationAliases={"Newark":["Newark","Newark Penn","NWK"],"Harrison":["Harrison"],"Journal Square":["Journal Square","JSQ"],"Grove Street":["Grove Street"],"Exchange Place":["Exchange Place"],"World Trade Center":["World Trade Center","WTC"],"Hoboken":["Hoboken","HOB"],"Newport":["Newport"],"Christopher Street":["Christopher Street"],"9th Street":["9th Street"],"14th Street":["14th Street"],"23rd Street":["23rd Street"],"33rd Street":["33rd Street","33rd","33"]};
const has=(text,aliases)=>aliases.some(value=>new RegExp(`\\b${value}\\b`,"i").test(text));
export function parse(text,id,date="2026-11-12T13:50:00Z"){
  const affectedStations=stations.filter(station=>has(text,stationAliases[station])),explicit=routes.filter(route=>has(text,stationAliases[route.stations[0]])&&has(text,stationAliases[route.stations.at(-1)]));
  const affectedLines=(explicit.length?explicit:routes.filter(route=>affectedStations.some(station=>route.stations.includes(station)))).map(route=>route.id);
  const resolved=/\b(restored|resumed|resolved)\b/i.test(text),critical=/\b(suspended|shut down|not running|emergency)\b/i.test(text),warning=/\b(delay|delays|delayed|long wait|crowded|closure|closed)\b/i.test(text);
  const type=/\b(suspended|not running|shut down)\b/i.test(text)?"suspension":/\b(closure|closed)\b/i.test(text)?"closure":/\b(delay|delays|delayed|long wait|crowded)\b/i.test(text)?"delay":/\b(schedule|modified|reduced)\b/i.test(text)?"schedule":"other";
  return {id,source:"original fictional scenario",originalText:text,alertType:type,severity:resolved?"info":critical?"critical":warning?"warning":"info",affectedLines,affectedStations,publishedAt:date,resolved};
}
export const seed=[
  {...parse("JSQ–33rd service is suspended in this fictional scenario. Journal Square, Grove Street, Newport, and 33rd Street are affected.","sample-suspension","2026-11-12T13:42:00Z"),title:"JSQ–33: service suspension example",summary:"A fictional incident pauses this route. Open the scenario for affected stations and the full sample text."},
  {...parse("Newark–WTC trains are delayed in this fictional scenario, with a long wait at Harrison and Newark Penn.","sample-delay","2026-11-12T13:30:00Z"),title:"Newark–WTC: longer wait example",summary:"A sample delay affecting Newark and Harrison. This is not a real service update."},
  {...parse("Modified service during a platform closure at Exchange Place in this fictional example.","sample-closure","2026-11-12T13:15:00Z"),title:"Exchange Place: platform change example",summary:"A station-closure scenario for testing station-based filters. No actual platform is reported closed."},
  {...parse("Hoboken–33rd schedule change: reduced service in this fictional morning scenario.","sample-schedule","2026-11-12T13:00:00Z"),title:"Hoboken–33: schedule change example",summary:"A fixed sample of a modified timetable. Actual departures and travel times are not available."},
  {...parse("Hoboken–WTC service restored in this fictional scenario.","sample-restored","2026-11-12T12:45:00Z"),title:"Hoboken–WTC: resolved example",summary:"An example of a resolved incident, retained for context."}
];
export const scenarios=[
  {...parse("Newark–WTC emergency: trains are not running at Harrison in this fictional example.","replay-emergency"),title:"Newark–WTC: emergency scenario",summary:"A replayable fictional interruption at Harrison. Use it to test commute preferences."},
  {...parse("Hoboken–33rd trains delayed in this fictional example, affecting Newport and 33rd Street.","replay-delay"),title:"Hoboken–33: delay scenario",summary:"A replayable fictional delay for the Hoboken–33 route."},
  {...parse("Modified schedule at Exchange Place and World Trade Center in this fictional example.","replay-schedule"),title:"WTC: modified schedule scenario",summary:"A replayable schedule example affecting the WTC corridor."}
];
export function cleanPrefs(value={}){
  if(!value||typeof value!=="object")value={};
  const subset=(list,valid,fallback)=>Array.isArray(list)?[...new Set(list.filter(item=>valid.includes(item)))]:[...fallback];
  return {lines:subset(value.lines,routes.map(r=>r.id),defaults.lines),stations:subset(value.stations,stations,[]),frequency:value.frequency==="digest"?"digest":"immediate",theme:value.theme==="dark"?"dark":"light",read:Array.isArray(value.read)?[...new Set(value.read.filter(id=>[...seed,...scenarios].some(a=>a.id===id)))]:[]};
}
export function monitored(alert,prefs){const lines=prefs.lines,selected=prefs.stations;return Boolean(lines.length||selected.length)&&(!lines.length||alert.affectedLines.some(id=>lines.includes(id)))&&(!selected.length||alert.affectedStations.some(station=>selected.includes(station)));}
export function filterAlerts(alerts,filters,prefs){
  const q=(filters.query||"").trim().toLowerCase();
  return alerts.filter(alert=>(filters.resolved||!alert.resolved)&&(!filters.route||alert.affectedLines.includes(filters.route))&&(!filters.station||alert.affectedStations.includes(filters.station))&&(!filters.severity||alert.severity===filters.severity)&&(!filters.unread||!prefs.read.includes(alert.id))&&(!filters.commute||monitored(alert,prefs))&&`${alert.title} ${alert.originalText}`.toLowerCase().includes(q)).sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt));
}
export function merge(alerts,alert){return alerts.some(item=>item.id===alert.id)?{alerts,added:false}:{alerts:[alert,...alerts],added:true};}
