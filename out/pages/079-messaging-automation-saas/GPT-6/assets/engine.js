export const posts=[
  {id:"weekend",name:"The weekend edit",description:"A little space to slow down",color:"peach"},
  {id:"studio",name:"A day in the studio",description:"Behind the scenes, thoughtfully made",color:"sage"},
  {id:"notes",name:"Notes for your next chapter",description:"Small ideas, a fresh perspective",color:"lilac"}
];
export const normalize=value=>String(value).normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu," ").trim().replace(/\s+/g," ");
export function keywordsFrom(value){
  const raw=String(value).split(",").map(s=>s.trim());
  if(raw.some(k=>!normalize(k)||k.length>40))return {error:"Use keywords of 1–40 characters, separated by commas."};
  const keywords=[...new Set(raw.map(normalize))];
  if(keywords.length>5)return {error:"Use up to five distinct keywords in this local preview."};
  return {keywords};
}
export function validateRule(input,plan="FREE"){
  const name=String(input.name||"").trim(),parsed=keywordsFrom(input.keywords),mode=input.mode;
  if(name.length<3||name.length>48)return {error:"Give this rule a name of 3–48 characters."};
  if(parsed.error)return parsed;
  if(!["COMMENT","DM"].includes(input.trigger))return {error:"Choose a comment or direct-message trigger."};
  if(input.trigger==="COMMENT"&&!posts.some(p=>p.id===input.post))return {error:"Choose an included sample post."};
  if(!["MESSAGE","SMARTAI"].includes(mode))return {error:"Choose a response mode."};
  if(mode==="SMARTAI"&&plan!=="PRO")return {error:"Smart AI is a PRO feature; enable the clearly labeled local PRO preview first."};
  const reply=String(input.reply||"").trim(),prompt=String(input.prompt||"").trim();
  if(mode==="MESSAGE"&&(!reply||reply.length>400))return {error:"Write a static reply of 1–400 characters."};
  if(mode==="SMARTAI"&&(!prompt||prompt.length>200))return {error:"Write a sample instruction of 1–200 characters."};
  return {rule:{name,keywords:parsed.keywords,trigger:input.trigger,post:input.trigger==="COMMENT"?input.post:"",mode,reply,prompt,active:Boolean(input.active)}};
}
export function initialRules(){return [
  {id:"r1",name:"Send the weekend guide",trigger:"COMMENT",post:"weekend",keywords:["guide","weekend"],mode:"MESSAGE",reply:"Here's your weekend guide: leave a little room to slow down, make something by hand, and find a moment just for you.",prompt:"",active:true},
  {id:"r2",name:"A little studio support",trigger:"DM",post:"",keywords:["hours","open"],mode:"MESSAGE",reply:"Our fictional studio is open Tuesday–Saturday, 10am–5pm. This reply is a local example, not a message to a real business.",prompt:"",active:true}
];}
export function inspectRule(rule,event,plan){
  const normalized=normalize(event.text),hit=rule.keywords.find(k=>` ${normalized} `.includes(` ${normalize(k)} `));
  return [
    {label:"Rule active",ok:rule.active},
    {label:`Trigger: ${rule.trigger==="COMMENT"?"comment":"direct message"}`,ok:rule.trigger===event.trigger},
    {label:rule.trigger==="COMMENT"?`Post: ${posts.find(p=>p.id===rule.post)?.name||"unknown sample"}`:"Any sample DM",ok:rule.trigger==="DM"||rule.post===event.post},
    {label:hit?`Keyword: ${hit}`:"No complete keyword or phrase",ok:Boolean(hit)},
    {label:rule.mode==="SMARTAI"?"PRO preview required":"Static reply",ok:rule.mode==="MESSAGE"||plan==="PRO"}
  ];
}
export function evaluate(rules,event,plan="FREE"){
  if(!["COMMENT","DM"].includes(event.trigger)||!String(event.text||"").trim()||String(event.text).length>300)return {matched:false,error:"Enter a sample comment or DM of 1–300 characters.",evaluations:[]};
  if(event.trigger==="COMMENT"&&!posts.some(p=>p.id===event.post))return {matched:false,error:"Choose an included sample post.",evaluations:[]};
  const evaluations=rules.map(rule=>({id:rule.id,name:rule.name,steps:inspectRule(rule,event,plan)}));
  const index=evaluations.findIndex(item=>item.steps.every(step=>step.ok));
  if(index<0)return {matched:false,evaluations};
  const rule=rules[index];
  return {matched:true,ruleId:rule.id,name:rule.name,mode:rule.mode,reply:rule.mode==="SMARTAI"?"Thanks for reaching out — this fixed preview stands in for a connected AI reply.":rule.reply,evaluations};
}
export const escape=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
