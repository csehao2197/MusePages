import test from "node:test";
import assert from "node:assert/strict";
import {initialState,addPunch,startCycle,joinRestaurant,transfer,redeem,badges,metrics} from "./assets/engine.js";
const apply=(fn,state,...args)=>{const result=fn(state,...args);assert.ok(!result.error,result.error);return result.state;};
test("a threshold issues exactly one reward and entry; inputs remain unchanged",()=>{
  const initial=initialState();let state=initial;
  for(let i=0;i<3;i++)state=apply(addPunch,state,"folk");
  assert.equal(initial.cards[0].punches,7);assert.equal(initial.users[0].points,240);
  assert.equal(state.cards[0].punches,10);assert.equal(state.users[0].points,270);
  assert.equal(state.raffles.length,1);assert.equal(state.rewards.length,1);
  assert.ok(addPunch(state,"folk").error);assert.equal(state.raffles.length,1);
});
test("new cycles preserve unclaimed entitlements and use distinct identifiers",()=>{
  let state=initialState();for(let i=0;i<3;i++)state=apply(addPunch,state,"folk");
  state=apply(startCycle,state,"folk");assert.equal(state.rewards[0].status,"available");
  for(let i=0;i<10;i++)state=apply(addPunch,state,"folk");
  assert.deepEqual(state.raffles.map(r=>r.id),["folk-1","folk-2"]);assert.equal(state.rewards.length,2);
  assert.ok(startCycle(initialState(),"nori").error);
});
test("membership cannot be bypassed or duplicated",()=>{
  const initial=initialState();assert.ok(addPunch(initial,"sunday").error);assert.ok(joinRestaurant(initial,"missing").error);
  const joined=apply(joinRestaurant,initial,"sunday");assert.ok(joinRestaurant(joined,"sunday").error);
  assert.equal(apply(addPunch,joined,"sunday").cards[2].punches,1);
});
test("point transfers conserve balances and reject invalid and excessive values atomically",()=>{
  const state=initialState(),total=state.users.reduce((sum,u)=>sum+u.points,0);
  for(const amount of [0,-1,.5,241,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])assert.ok(transfer(state,"maya",amount).error);
  assert.ok(transfer(state,"alex",10).error);assert.ok(transfer(state,"missing",10).error);assert.ok(transfer(state,"maya",10,"x".repeat(121)).error);
  const next=apply(transfer,state,"maya",240,"  Thanks  ");
  assert.equal(next.users[0].points,0);assert.equal(next.users.reduce((sum,u)=>sum+u.points,0),total);
  assert.equal(next.transfers[0].message,"Thanks");assert.equal(state.users[0].points,240);
  assert.ok(transfer(next,"jamie",1).error);
});
test("achievements derive from cumulative transfers and completed cards",()=>{
  let state=apply(transfer,initialState(),"maya",40);
  assert.deepEqual(badges(state).map(b=>b.earned),[true,false,false]);
  state=apply(transfer,state,"jamie",60);assert.deepEqual(badges(state).map(b=>b.earned),[true,true,false]);
  for(let i=0;i<3;i++)state=apply(addPunch,state,"folk");
  assert.deepEqual(badges(state).map(b=>b.earned),[true,true,true]);
});
test("redemption is one-time and expiry uses the explicit demo clock",()=>{
  let state=initialState();for(let i=0;i<3;i++)state=apply(addPunch,state,"folk");
  const expired=structuredClone(state);expired.now=expired.rewards[0].expiresAt;
  assert.ok(redeem(expired,"folk-1").error);assert.equal(expired.rewards[0].status,"available");
  assert.ok(redeem(state,"unknown").error);state=apply(redeem,state,"folk-1");
  assert.ok(redeem(state,"folk-1").error);assert.equal(state.raffles.length,1);
  assert.deepEqual(metrics(state),{visits:3,completed:1,redeemed:1,transferred:0});
});
