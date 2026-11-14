export const CITY={west:13.35,east:13.46,south:52.495,north:52.545},KINDS=["Architecture","Memorial","Culture","City history"],ERAS=["18","19","20"],esc=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
export const name=record=>record.names.en,description=record=>record.descriptions.en;
export function fixture(){return [
  {
    "id": "gate",
    "names": {
      "en": "Brandenburg Gate"
    },
    "descriptions": {
      "en": "A neoclassical gateway on Pariser Platz, completed in 1791. Once close to the divided city's border, it is now closely associated with German reunification."
    },
    "kind": "Architecture",
    "era": "18",
    "lat": 52.516275,
    "lon": 13.377704,
    "art": "gate",
    "createdAt": "2026-10-24T11:00:00.000Z",
    "updatedAt": "2026-10-24T11:00:00.000Z"
  },
  {
    "id": "reichstag",
    "names": {
      "en": "Reichstag building"
    },
    "descriptions": {
      "en": "Opened in 1894, the Reichstag has witnessed major turns in German political history. Today it houses the German Bundestag."
    },
    "kind": "Architecture",
    "era": "19",
    "lat": 52.51862,
    "lon": 13.376187,
    "art": "parliament",
    "createdAt": "2026-10-24T11:00:00.000Z",
    "updatedAt": "2026-10-24T11:00:00.000Z"
  },
  {
    "id": "wall",
    "names": {
      "en": "Berlin Wall Memorial"
    },
    "descriptions": {
      "en": "The memorial on Bernauer Straße preserves traces of the border that divided Berlin. It is a place to consider the human consequences of that division."
    },
    "kind": "Memorial",
    "era": "20",
    "lat": 52.535133,
    "lon": 13.390337,
    "art": "wall",
    "createdAt": "2026-10-24T11:00:00.000Z",
    "updatedAt": "2026-10-24T11:00:00.000Z"
  },
  {
    "id": "museum",
    "names": {
      "en": "Museum Island"
    },
    "descriptions": {
      "en": "A group of museums on an island in the Spree, shaped by the cultural ambitions of the nineteenth century. Its buildings form a distinctive museum landscape."
    },
    "kind": "Culture",
    "era": "19",
    "lat": 52.520833,
    "lon": 13.396667,
    "art": "museum",
    "createdAt": "2026-10-24T11:00:00.000Z",
    "updatedAt": "2026-10-24T11:00:00.000Z"
  },
  {
    "id": "checkpoint",
    "names": {
      "en": "Checkpoint Charlie"
    },
    "descriptions": {
      "en": "A former crossing point between East and West Berlin. The site remains closely connected to the city's Cold War history."
    },
    "kind": "City history",
    "era": "20",
    "lat": 52.507507,
    "lon": 13.390373,
    "art": "checkpoint",
    "createdAt": "2026-10-24T11:00:00.000Z",
    "updatedAt": "2026-10-24T11:00:00.000Z"
  },
  {
    "id": "gallery",
    "names": {
      "en": "East Side Gallery"
    },
    "descriptions": {
      "en": "A surviving stretch of the Berlin Wall became an open-air gallery after the border opened. The site brings art and the memory of division together."
    },
    "kind": "Culture",
    "era": "20",
    "lat": 52.505035,
    "lon": 13.439785,
    "art": "gallery",
    "createdAt": "2026-10-24T11:00:00.000Z",
    "updatedAt": "2026-10-24T11:00:00.000Z"
  }
];}
export function filter(records,{query="",kind="",era="",sort="name",lang="en"}={}){
  lang="en";const q=query.trim().toLocaleLowerCase(lang);return records.filter(record=>(!kind||record.kind===kind)&&(!era||record.era===era)&&(!q||`${name(record,lang)} ${description(record,lang)}`.toLocaleLowerCase(lang).includes(q))).toSorted(sort==="updated"?(a,b)=>b.updatedAt.localeCompare(a.updatedAt):(a,b)=>name(a,lang).localeCompare(name(b,lang),lang));
}
export function validate(input,old=null,now=new Date().toISOString()){
  const names={en:String(input.enName??"").trim()},descriptions={en:String(input.enText??"").trim()},rawLat=String(input.lat??"").trim(),rawLon=String(input.lon??"").trim(),lat=Number(rawLat),lon=Number(rawLon);
  if(names.en.length<3||names.en.length>90||descriptions.en.length<20||descriptions.en.length>800)throw Error("text");
  if(!rawLat||!rawLon||!Number.isFinite(lat)||!Number.isFinite(lon)||lat< -90||lat>90||lon< -180||lon>180)throw Error("coordinates");
  if(!KINDS.includes(input.kind)||!ERAS.includes(input.era))throw Error("classification");
  return {id:old?.id||input.id,names,descriptions,lat,lon,kind:input.kind,era:input.era,art:old?.art||"place",createdAt:old?.createdAt||now,updatedAt:now};
}
export function project(record,bounds){return {x:40+(record.lon-bounds.west)/(bounds.east-bounds.west)*920,y:40+(bounds.north-record.lat)/(bounds.north-bounds.south)*520};}
export function clampBounds(bounds){
  const width=Math.min(360,Math.max(.002,bounds.east-bounds.west)),height=Math.min(180,Math.max(.001,bounds.north-bounds.south)),cx=Math.max(-180+width/2,Math.min(180-width/2,(bounds.west+bounds.east)/2)),cy=Math.max(-90+height/2,Math.min(90-height/2,(bounds.south+bounds.north)/2));
  return {west:cx-width/2,east:cx+width/2,south:cy-height/2,north:cy+height/2};
}
export function fit(records){if(!records.length)return {...CITY};const west=Math.min(...records.map(r=>r.lon)),east=Math.max(...records.map(r=>r.lon)),south=Math.min(...records.map(r=>r.lat)),north=Math.max(...records.map(r=>r.lat)),padX=Math.max(.006,(east-west)*.14),padY=Math.max(.004,(north-south)*.14);return clampBounds({west:west-padX,east:east+padX,south:south-padY,north:north+padY});}
export function zoom(bounds,factor){const cx=(bounds.east+bounds.west)/2,cy=(bounds.north+bounds.south)/2,width=(bounds.east-bounds.west)*factor,height=(bounds.north-bounds.south)*factor;return clampBounds({west:cx-width/2,east:cx+width/2,south:cy-height/2,north:cy+height/2});}
