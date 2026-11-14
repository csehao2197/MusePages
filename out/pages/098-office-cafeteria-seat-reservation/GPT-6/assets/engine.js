export const KEY="blu-reserve-demo-v1",SESSION="blu-reserve-session-v1";
export const SEATS=Array.from({length:30},(_,i)=>`T${Math.floor(i/5)+1}-S${i%5+1}`);
export const SLOTS=Array.from({length:16},(_,i)=>({id:i,start:540+i*30,end:570+i*30}));
export const time=(minutes)=>`${String(Math.floor(minutes/60)).padStart(2,"0")}:${String(minutes%60).padStart(2,"0")}`;
export const today=(now=new Date())=>now.toISOString().slice(0,10);
export const plusDay=(day,n)=>new Date(Date.parse(`${day}T00:00:00Z`)+n*86400000).toISOString().slice(0,10);
export function validDay(day){return typeof day==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(day)&&Number.isFinite(Date.parse(day))&&today(new Date(day))===day;}
export function validSlot(day,slot,now=new Date()){
  return validDay(day)&&Number.isInteger(slot)&&slot>=0&&slot<16&&day>=today(now)&&day<=plusDay(today(now),7)&&Date.parse(`${day}T${time(SLOTS[slot].start)}:00Z`)>now.getTime();
}
export function initial(day=today()){
  const bookings=[];
  for(let d=0;d<8;d++)for(const slot of [6,7,8])for(const [i,seat] of ["T1-S2","T2-S4","T3-S1","T4-S3","T5-S5","T6-S2"].entries())bookings.push({id:`fixture-${d}-${slot}-${i}`,day:plusDay(day,d),slot,seat,user:`sample-${i}`,status:"BOOKED",createdAt:`${day}T00:00:00.000Z`});
  return {version:1,revision:0,capacity:18,bookings};
}
export function validate(state){
  if(!state||state.version!==1||!Number.isInteger(state.revision)||state.revision<0||!Number.isInteger(state.capacity)||state.capacity<1||state.capacity>30||!Array.isArray(state.bookings)||state.bookings.length>1000)throw Error("Saved demo data is invalid. It has been preserved; choose Reset demo to replace only this demo's keys.");
  const ids=new Set(),occupied=new Set(),users=new Set();
  for(const b of state.bookings){
    if(!b||typeof b.id!=="string"||!b.id||ids.has(b.id)||!validDay(b.day)||!SLOTS[b.slot]||!Number.isInteger(b.slot)||!SEATS.includes(b.seat)||typeof b.user!=="string"||!b.user||!["BOOKED","CANCELLED"].includes(b.status)||typeof b.createdAt!=="string"||!Number.isFinite(Date.parse(b.createdAt)))throw Error("Saved booking data is invalid and has been preserved.");
    ids.add(b.id);
    if(b.status==="BOOKED"){const key=`${b.day}/${b.slot}`;if(occupied.has(`${key}/${b.seat}`)||users.has(`${key}/${b.user}`))throw Error("Saved demo contains conflicting bookings and has been preserved.");occupied.add(`${key}/${b.seat}`);users.add(`${key}/${b.user}`);}
  }
  return state;
}
export const active=(state,day,slot)=>state.bookings.filter((b)=>b.day===day&&b.slot===slot&&b.status==="BOOKED");
export function fail(code,message){throw Object.assign(Error(message),{code});}
export function book(state,{day,slot,seat,user},now=new Date(),id=crypto.randomUUID()){
  if(user!=="EMP-DEMO")fail("UNAUTHENTICATED","Use the public demo login before booking.");
  if(!validSlot(day,slot,now)||!SEATS.includes(seat))fail("INVALID_TIME_RANGE","Choose a future 30-minute office slot, 09:00–17:00 UTC, within the next seven days.");
  const list=active(state,day,slot);
  if(list.some((b)=>b.seat===seat))fail("SEAT_UNAVAILABLE","Another sample employee has this seat. Choose a different seat.");
  if(list.length>=state.capacity)fail("MANAGER_CAPACITY_EXCEEDED","The demo manager's capacity limit is reached for this slot. Choose another time.");
  if(list.some((b)=>b.user===user))fail("ALREADY_BOOKED","You already have a seat in this time slot. Cancel it before changing seats.");
  if(state.bookings.length>=1000)fail("DEMO_LIMIT","This local demo has reached 1,000 records. Export the ledger before resetting.");
  const booking={id,day,slot,seat,user,status:"BOOKED",createdAt:now.toISOString()};
  state.bookings.push(booking);state.revision++;return booking;
}
export function cancel(state,id,user,now=new Date()){
  const b=state.bookings.find((item)=>item.id===id);
  if(!b||b.user!==user||user!=="EMP-DEMO")fail("NOT_YOURS","Only your public demo booking can be cancelled.");
  if(b.status!=="BOOKED")fail("ALREADY_CANCELLED","This sample booking is already cancelled.");
  if(Date.parse(`${b.day}T${time(SLOTS[b.slot].start)}:00Z`)<=now.getTime())fail("INVALID_TIME_RANGE","Started or past bookings remain in the local history.");
  b.status="CANCELLED";state.revision++;
}
export function login(id,password){if(id.trim()!=="EMP-DEMO"||password!=="blue-demo")fail("INVALID_CREDENTIALS","Use EMP-DEMO and blue-demo. These are public mock credentials.");return {version:1,id:"EMP-DEMO",name:"Alex Sample"};}
