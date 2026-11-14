import test from "node:test";
import assert from "node:assert/strict";
import {stations,upcoming,weather,forecast,timeLabel,cleanFavorites} from "./assets/timetable.js";
test("default route yields five sorted, directionally correct fictional departures",()=>{
  const rows=upcoming("san-francisco","palo-alto",490);
  assert.equal(rows.length,5);assert.equal(rows[0].departure,500);assert.equal(rows[0].arrival,559);assert.equal(rows[0].duration,59);assert.equal(rows[0].type,"Limited");
  assert.ok(rows.every((r,i)=>r.direction==="Southbound"&&r.departure>=490&&r.arrival-r.departure===r.duration&&(i===0||rows[i-1].departure<=r.departure)));
  const reverse=upcoming("palo-alto","san-francisco",490);assert.equal(reverse.length,5);assert.ok(reverse.every(r=>r.direction==="Northbound"));
});
test("stop patterns filter express trains and preserve legacy listings without fabricated service",()=>{
  assert.equal(stations.length,32);assert.equal(stations.filter(s=>s.legacy).length,2);
  assert.ok(upcoming("bayshore","gilroy",490).every(r=>r.type==="Local"));
  assert.deepEqual(upcoming("atherton","palo-alto",490),[]);assert.deepEqual(upcoming("san-francisco","stanford",490),[]);
  assert.equal(weather("atherton"),null);assert.equal(weather("stanford"),null);
});
test("delay adds six minutes to both ends of local trips; suspension and late day return empty",()=>{
  const regular=upcoming("san-francisco","gilroy",300),delayed=upcoming("san-francisco","gilroy",300,"delay"),local=delayed.find(t=>t.id===regular[0].id);
  assert.equal(local.departure,306);assert.equal(local.arrival,487);assert.equal(local.duration,181);assert.equal(local.hold,6);
  assert.deepEqual(upcoming("san-francisco","palo-alto",490,"no-service"),[]);assert.deepEqual(upcoming("san-francisco","palo-alto",1439),[]);
  assert.throws(()=>upcoming("san-francisco","san-francisco"));assert.throws(()=>upcoming("unknown","gilroy"));assert.throws(()=>upcoming("san-francisco","gilroy",1440));
});
test("cross-day trains and forecasts retain visible day offsets and nighttime conditions",()=>{
  assert.equal(timeLabel(1441),"12:01 AM +1d");assert.equal(timeLabel(720),"12:00 PM");
  const last=upcoming("san-francisco","gilroy",1260);assert.equal(last[0].arrival,1441);
  const next=forecast("palo-alto",1439);assert.deepEqual(next.map(w=>w.minute),[1440,1500,1560]);assert.equal(next[0].condition,"Clear");assert.equal(next[0].icon,"moon");
  assert.equal(weather("palo-alto",490).temp-weather("san-francisco",490).temp,10);
});
test("favorite restoration sanitizes shape, names, duplicates and station IDs without trusting extra fields",()=>{
  const base={id:"test-1",name:" Work ",from:"san-francisco",to:"palo-alto",secret:"discard"};
  const clean=cleanFavorites([null,{},base,{...base,id:"x",name:"work"},{...base,id:"y",name:"Different"},{...base,id:'\"><img',name:"Invalid"},{...base,id:"z",name:"Invalid stop",to:"missing"},{...base,id:"z",name:"Equal",to:base.from}]);
  assert.deepEqual(clean,[{id:"test-1",name:"Work",from:"san-francisco",to:"palo-alto"}]);
  const many=stations.slice(1,10).map((s,i)=>({id:"r-"+i,name:"Route "+i,from:"san-francisco",to:s.id}));assert.equal(cleanFavorites(many).length,5);
  assert.deepEqual(cleanFavorites({}),[]);
});
