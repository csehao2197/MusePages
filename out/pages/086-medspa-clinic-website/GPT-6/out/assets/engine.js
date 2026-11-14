export const escape=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const local=new Date();export const TODAY=`${local.getFullYear()}-${String(local.getMonth()+1).padStart(2,"0")}-${String(local.getDate()).padStart(2,"0")}`;
export function addDays(date,days){const value=new Date(date+"T12:00:00Z");value.setUTCDate(value.getUTCDate()+days);return value.toISOString().slice(0,10);}
export const MIN_DATE=addDays(TODAY,1),MAX_DATE=addDays(TODAY,30);
export const SERVICES=[
  {id:"hydration",name:"The hydration ritual",category:"Facial care",duration:60,price:1800,image:"facial.svg",eyebrow:"A LITTLE DEW, A LITTLE YOU",description:"A gentle, unhurried facial-care concept built around comfort and a moment to pause. An illustrative service, with individual suitability left to a qualified professional."},
  {id:"calm",name:"Calm & reset",category:"Facial care",duration:45,price:1500,image:"stones.svg",eyebrow:"A SOFTER SORT OF DAY",description:"A simple facial-care concept with a quieter pace. This sample entry describes an experience, not a medical treatment, promise of results or recommendation."},
  {id:"body",name:"The body unwind",category:"Body care",duration:60,price:2200,image:"body.svg",eyebrow:"MAKE ROOM FOR YOURSELF",description:"An illustrative body-care ritual designed around rest and comfort. Real services, practitioner qualifications and suitability would require direct clinic confirmation."},
  {id:"conversation",name:"A first conversation",category:"Consultation",duration:30,price:0,image:"conversation.svg",eyebrow:"LET'S START WITH A CONVERSATION",description:"A sample introductory conversation to explore a care menu. No clinical advice, diagnosis or patient assessment takes place in this browser demonstration."}
];
export const money=value=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:0}).format(value);
export const time=value=>`${String(Math.floor(value/60)).padStart(2,"0")}:${String(value%60).padStart(2,"0")}`;
export function validDate(date){const parsed=Date.parse(date+"T12:00:00Z");return /^\d{4}-\d{2}-\d{2}$/.test(date)&&Number.isFinite(parsed)&&new Date(parsed).toISOString().slice(0,10)===date&&date>=MIN_DATE&&date<=MAX_DATE;}
export function firstOpenDate(){let date=MIN_DATE;while(new Date(date+"T12:00:00Z").getUTCDay()===0)date=addDays(date,1);return date;}
export const SAMPLE_BUSY={date:firstOpenDate(),start:600,end:660};
export const overlap=(a,b)=>a.start<b.end&&b.start<a.end;
export function quote(ids,offer=false,offerUsed=false){
  if(!Array.isArray(ids)||ids.length<1||ids.length>3||new Set(ids).size!==ids.length)throw Error("Choose one to three different care options.");
  const services=ids.map(id=>SERVICES.find(s=>s.id===id));if(services.some(s=>!s))throw Error("A care option is unavailable.");
  const subtotal=services.reduce((sum,s)=>sum+s.price,0),duration=services.reduce((sum,s)=>sum+s.duration,0),discount=offer&&!offerUsed?Math.round(subtotal/10):0;
  return {services,subtotal,duration,discount,total:subtotal-discount};
}
export function slots(date,duration,plans=[],exclude=null){
  if(!validDate(date)||new Date(date+"T12:00:00Z").getUTCDay()===0||!Number.isInteger(duration)||duration<1)return [];
  const occupied=plans.filter(p=>p.id!==exclude&&p.status==="planned"&&p.date===date).map(p=>({start:p.start,end:p.start+p.quote.duration}));
  if(date===SAMPLE_BUSY.date)occupied.push(SAMPLE_BUSY);
  const times=[];for(const[start,end]of [[540,720],[780,1020]])for(let slot=start;slot+duration<=end;slot+=15)if(!occupied.some(busy=>overlap({start:slot,end:slot+duration},busy)))times.push(slot);
  return times;
}
export function savePlan(plans,draft,offerUsed=false){
  const existing=draft.editId?plans.find(p=>p.id===draft.editId&&p.status==="planned"):null;
  if(draft.editId&&!existing)throw Error("This local plan is no longer available.");
  if(!existing&&plans.length>=8)throw Error("The demo holds up to eight plans per page session.");
  const pricing=existing?existing.quote:quote(draft.ids,draft.offer,offerUsed);
  if(!slots(draft.date,pricing.duration,plans,existing?.id).includes(draft.start))throw Error("Choose an available sample time. Dates are limited to the next 30 days, Monday to Saturday.");
  const plan={id:existing?.id||draft.id,date:draft.date,start:draft.start,quote:pricing,status:"planned"};
  if(!plan.id||(!existing&&plans.some(p=>p.id===plan.id)))throw Error("This local plan was already saved.");
  return {plans:existing?plans.map(p=>p.id===existing.id?plan:p):[...plans,plan],plan,offerUsed:offerUsed||pricing.discount>0};
}
