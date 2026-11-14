import test from "node:test";
import assert from "node:assert/strict";
import {DAY,initial,register,login,addDevice,regenerate,disableUser,inviteCode,resetPassword,sampleText,reference} from "./assets/engine.js";
import {qrMatrix} from "./assets/qr.js";
import {en} from "./assets/i18n.js";
const password="Demo-pass-42!",now=1800000000000;
test("invitations expire at exactly 30 days and redeem only once, including concurrent submissions",async()=>{
  const state=await initial(now),created=inviteCode(state,now);assert.equal(created.code.length,8);assert.equal(created.expires-now,30*DAY);
  await assert.rejects(register(state,{code:"JOINDEMO",name:"late_user",password},now+30*DAY),{code:"ERR_INVITE"});
  const results=await Promise.allSettled([register(state,{code:created.code,name:"sample_one",password},now),register(state,{code:created.code,name:"sample_two",password},now)]);assert.equal(results.filter((r)=>r.status==="fulfilled").length,1);assert.equal(state.users.length,3);assert.ok(created.usedBy);
});
test("username and password validation, duplicate users and rolling attempt limit",async()=>{
  const state=await initial(now);await assert.rejects(register(state,{code:"JOINDEMO",name:"bad@email",password},now),{code:"ERR_NAME"});await assert.rejects(register(state,{code:"JOINDEMO",name:"sample_one",password:"weak"},now),{code:"ERR_PASSWORD"});await assert.rejects(register(state,{code:"JOINDEMO",name:"alex_sample",password},now),{code:"ERR_TAKEN"});await assert.rejects(login(state,"alex_sample","wrong",now),{code:"ERR_LOGIN"});await login(state,"alex_sample",password,now);await assert.rejects(login(state,"alex_sample",password,now+59999),{code:"ERR_RATE"});await login(state,"alex_sample",password,now+60000);assert.equal(state.session,"alex");
});
test("device ownership, limits, regeneration and deliberately invalid downloads",async()=>{
  const state=await initial(now);state.session="raya";assert.throws(()=>sampleText(state,state.devices[0].id),{code:"ERR_DEVICE"});const d=addDevice(state,{name:"Sample phone",platform:"android"});assert.equal(d.address,4);const text=sampleText(state,d.id);assert.ok(text.includes("NOT_A_WIREGUARD_KEY"));assert.ok(text.includes(".invalid:51820"));assert.ok(!text.includes("0.0.0.0/0"));const old=reference(d);regenerate(state,d.id);assert.notEqual(reference(d),old);
  for(let i=0;i<5;i++)addDevice(state,{name:`Sample device ${i}`,platform:"linux"});assert.throws(()=>addDevice(state,{name:"Extra sample",platform:"ios"}),{code:"ERR_DEVICE_LIMIT"});
});
test("disable signs out and inactivates devices; enable never resurrects old examples",async()=>{
  const state=await initial(now);state.session="alex";disableUser(state,"alex");assert.equal(state.session,null);assert.ok(state.devices.every((d)=>!d.active));await assert.rejects(login(state,"alex_sample",password,now),{code:"ERR_DISABLED"});disableUser(state,"alex");await login(state,"alex_sample",password,now);assert.throws(()=>sampleText(state,state.devices[0].id),{code:"ERR_INACTIVE"});regenerate(state,state.devices[0].id);assert.ok(sampleText(state,state.devices[0].id).includes("Revision: 2"));assert.equal(state.devices[1].active,false);
});
test("public password reset invalidates the local session and replaces only the selected verifier",async()=>{
  const state=await initial(now);await register(state,{code:"JOINDEMO",name:"sample_new",password:"Other-demo-42!"},now);const id=state.session;await resetPassword(state,id);assert.equal(state.session,null);await assert.rejects(login(state,"sample_new","Other-demo-42!",now),{code:"ERR_LOGIN"});await login(state,"sample_new",password,now);assert.equal(state.session,id);
});
test("reference QR yields exact byte payload and zero Reed-Solomon syndromes",()=>{
  for(const payload of ["DEMO:a11ce001:1","DEMO:a11ce001:999"]){
    const matrix=qrMatrix(payload),bits=[],reserved=(x,y)=>(x<9&&y<9)||(x>=13&&y<9)||(x<9&&y>=13)||x===6||y===6;
    assert.equal(matrix.length,21);for(const row of matrix)assert.equal(row.length,21);
    for(let r=20;r>0;r-=2){if(r===6)r=5;for(let i=0;i<21;i++){const y=((r+1)&2)===0?20-i:i;for(const x of [r,r-1])if(!reserved(x,y))bits.push(Number(matrix[y][x])^Number((x+y)%2===0));}}
    assert.equal(bits.length,208);const number=(offset,length)=>bits.slice(offset,offset+length).reduce((a,b)=>(a<<1)|b,0);assert.equal(number(0,4),4);assert.equal(number(4,8),payload.length);assert.equal(Array.from({length:payload.length},(_,i)=>String.fromCharCode(number(12+i*8,8))).join(""),payload);
    const words=Array.from({length:26},(_,i)=>number(i*8,8)),mul=(a,b)=>{let r=0;while(b){if(b&1)r^=a;a<<=1;if(a&256)a^=0x11d;b>>=1;}return r;};
    let root=1;for(let i=0;i<7;i++){assert.equal(words.reduce((sum,value)=>mul(sum,root)^value,0),0);root=mul(root,2);}
    assert.ok(matrix[13][8]);assert.deepEqual(matrix[0].slice(0,7),Array(7).fill(true));
  }
  assert.throws(()=>qrMatrix("DEMO:a11ce001:1000xx"),/capacity/);
});
test("all interface, errors and five six-step platform guides remain English-only",()=>{
  for(const [key,value] of Object.entries(en))if(typeof value==="string")assert.ok(value.trim()&&!/\p{Script=Arabic}/u.test(value),key);
  for(const p of ["windows","macos","ios","android","linux"]){assert.equal(en.steps[p].length,6);for(const step of en.steps[p])assert.ok(step.trim()&&!/\p{Script=Arabic}/u.test(step));}
});
