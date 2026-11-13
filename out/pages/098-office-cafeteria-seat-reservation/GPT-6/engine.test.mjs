import test from "node:test";
import assert from "node:assert/strict";
import {SEATS,SLOTS,time,plusDay,validDay,validSlot,initial,validate,book,cancel,login} from "./assets/engine.js";
const now=new Date("2026-03-20T08:30:00Z"),payload={day:"2026-03-20",slot:0,seat:"T1-S1",user:"EMP-DEMO"};
test("exact UTC boundaries, office slots, calendar rollover and future horizon",()=>{
  assert.equal(SEATS.length,30);assert.equal(SLOTS.length,16);assert.equal(time(SLOTS.at(-1).end),"17:00");assert.equal(plusDay("2026-12-31",1),"2027-01-01");assert.equal(validDay("2026-02-30"),false);
  assert.equal(validSlot(payload.day,0,now),true);assert.equal(validSlot(payload.day,0,new Date("2026-03-20T09:00:00Z")),false);assert.equal(validSlot("2026-03-27",15,now),true);assert.equal(validSlot("2026-03-28",0,now),false);assert.equal(validSlot(payload.day,16,now),false);
});
test("seat and employee conflicts, adjacent slots and policy capacity",()=>{
  const state=initial(payload.day);book(state,payload,now,"one");
  assert.throws(()=>book(state,payload,now),{code:"SEAT_UNAVAILABLE"});
  assert.throws(()=>book(state,{...payload,seat:"T1-S2"},now),{code:"ALREADY_BOOKED"});
  book(state,{...payload,slot:1},now,"two");state.capacity=1;
  assert.throws(()=>book(state,{...payload,seat:"T1-S3"},now),{code:"MANAGER_CAPACITY_EXCEEDED"});
  assert.equal(state.bookings.filter((b)=>b.user==="EMP-DEMO").length,2);
});
test("cancellation ownership, past-slot rejection and one-time release",()=>{
  const state=initial(payload.day);book(state,payload,now,"one");
  assert.throws(()=>cancel(state,"one","other",now),{code:"NOT_YOURS"});assert.throws(()=>cancel(state,"one","EMP-DEMO",new Date("2026-03-20T09:00:00Z")),{code:"INVALID_TIME_RANGE"});
  cancel(state,"one","EMP-DEMO",now);assert.throws(()=>cancel(state,"one","EMP-DEMO",now),{code:"ALREADY_CANCELLED"});book(state,payload,now,"two");assert.equal(state.bookings.filter((b)=>b.id==="two").length,1);
});
test("invalid inputs and unauthenticated bookings never mutate the ledger",()=>{
  const state=initial(payload.day),before=JSON.stringify(state);
  for(const patch of [{slot:0.5},{seat:"T7-S1"},{day:"2026-03-19"},{day:"2026-02-30"}])assert.throws(()=>book(state,{...payload,...patch},now),{code:"INVALID_TIME_RANGE"});
  assert.throws(()=>book(state,{...payload,user:"other"},now),{code:"UNAUTHENTICATED"});assert.equal(JSON.stringify(state),before);
});
test("restoration rejects malformed and conflicting records while allowing cancelled history",()=>{
  const state=initial(payload.day);assert.equal(validate(state),state);book(state,payload,now,"one");
  const clone=structuredClone(state);clone.bookings.push({...clone.bookings.at(-1),id:"duplicate-seat",user:"other"});assert.throws(()=>validate(clone),/conflicting/);
  clone.bookings.at(-1).status="CANCELLED";assert.equal(validate(clone),clone);clone.bookings[0].slot=99;assert.throws(()=>validate(clone),/invalid/);
});
test("only public fictitious credentials work and no password enters session data",()=>{
  assert.throws(()=>login("EMP-DEMO","wrong"),{code:"INVALID_CREDENTIALS"});assert.deepEqual(login(" EMP-DEMO ","blue-demo"),{version:1,id:"EMP-DEMO",name:"Alex Sample"});
});
