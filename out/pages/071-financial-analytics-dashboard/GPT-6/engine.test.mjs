import test from "node:test";
import assert from "node:assert/strict";
import {disclaimer,sampleTransactions,sampleAssets,parseDecimal,validDate,analyzeFinance,analyzePortfolio,newBook,sampleBook,placeLimit,cancelOrder,bookLevels,learningReply} from "./assets/engine.js";
test("manual finance uses selected-month integer cents and handles no income",()=>{
  const f=analyzeFinance(sampleTransactions,"2026-11");
  assert.equal(f.incomeCents,730000);assert.equal(f.expenseCents,624000);assert.equal(f.savingsCents,106000);assert.equal(f.fixedCents,284000);assert.equal(f.score,81);
  assert.equal(f.byCategory.Other,155000);
  const empty=analyzeFinance(sampleTransactions,"2027-01");assert.equal(empty.score,null);assert.equal(empty.savingsRate,null);assert.equal(empty.savingsCents,0);
  const expenseOnly=analyzeFinance(sampleTransactions.filter(t=>t.type==="expense"),"2026-11");assert.equal(expenseOnly.savingsCents,-624000);assert.equal(expenseOnly.score,null);
});
test("disclosed health-score heuristic reacts to fixed vs variable expense assumptions",()=>{
  const transactions=[{date:"2026-11-01",type:"income",category:"Income",amountCents:100000},{date:"2026-11-01",type:"expense",category:"Housing",amountCents:80000}];
  assert.equal(analyzeFinance(transactions,"2026-11").score,82);
  transactions[1].category="Other";assert.equal(analyzeFinance(transactions,"2026-11").score,100);
});
test("asset arithmetic requires exactly 10000 basis points, not rounded floating totals",()=>{
  assert.deepEqual(analyzePortfolio(sampleAssets),{totalBps:10000,valid:true,index:65,hhi:4350});
  const changed=structuredClone(sampleAssets);changed[0].weightBps--;
  assert.deepEqual(analyzePortfolio(changed),{totalBps:9999,valid:false,index:null,hhi:null});
  assert.equal(analyzePortfolio([]).valid,false);
});
test("crossing buy obeys best price, FIFO and resting price with partial fill accounting",()=>{
  const book=sampleBook(),order=placeLimit(book,{side:"buy",priceCents:10100,quantity:25},"2026-11-13T04:00:00Z");
  assert.equal(order.status,"filled");assert.equal(order.remaining,0);
  assert.deepEqual(book.trades.map(t=>[t.sellOrderId,t.priceCents,t.quantity]),[["L0001",10000,12],["L0002",10000,8],["L0003",10100,5]]);
  assert.equal(book.orders[2].status,"partial");assert.equal(book.orders[2].remaining,10);
  assert.equal(book.trades.reduce((n,t)=>n+t.quantity,0),25);
  assert.deepEqual(bookLevels(book),{bids:[{priceCents:9900,quantity:10},{priceCents:9800,quantity:20}],asks:[{priceCents:10100,quantity:10}],spreadCents:200});
});
test("crossing sell takes highest bid first and never uses the incoming limit as fill price",()=>{
  const book=newBook();placeLimit(book,{side:"buy",priceCents:10200,quantity:2});placeLimit(book,{side:"buy",priceCents:10100,quantity:3});
  const order=placeLimit(book,{side:"sell",priceCents:10000,quantity:4});
  assert.equal(order.status,"filled");assert.deepEqual(book.trades.map(t=>[t.buyOrderId,t.priceCents,t.quantity]),[["L0001",10200,2],["L0002",10100,2]]);
  assert.equal(book.orders[1].remaining,1);assert.equal(bookLevels(book).spreadCents,null);
});
test("cancellation prevents future fills but preserves unfilled quantity and audit history",()=>{
  const book=sampleBook();assert.equal(cancelOrder(book,"L0001"),true);
  const incoming=placeLimit(book,{side:"buy",priceCents:10000,quantity:15});
  assert.equal(book.trades.length,1);assert.equal(book.trades[0].sellOrderId,"L0002");assert.equal(book.trades[0].quantity,8);
  assert.equal(incoming.remaining,7);assert.equal(incoming.status,"partial");assert.equal(book.orders[0].status,"canceled");
  assert.equal(book.orders[0].remaining,12);assert.equal(cancelOrder(book,"L0002"),false);assert.equal(cancelOrder(book,"missing"),false);
  assert.equal(cancelOrder(book,incoming.id),true);assert.equal(book.trades.length,1);
});
test("noncrossing orders rest; invalid entries and capacity failures leave the book unchanged",()=>{
  const book=newBook();placeLimit(book,{side:"buy",priceCents:100,quantity:1});placeLimit(book,{side:"sell",priceCents:101,quantity:1});assert.equal(book.trades.length,0);assert.equal(bookLevels(book).spreadCents,1);
  const invalid=[{side:"hold",priceCents:100,quantity:1},{side:"buy",priceCents:0,quantity:1},{side:"buy",priceCents:100.5,quantity:1},{side:"buy",priceCents:100,quantity:1.5},{side:"buy",priceCents:100,quantity:10001}];
  for(const entry of invalid){const before=structuredClone(book);assert.throws(()=>placeLimit(book,entry));assert.deepEqual(book,before);}
  const full=newBook();for(let i=0;i<200;i++)placeLimit(full,{side:"buy",priceCents:100,quantity:1});
  const before=structuredClone(full);assert.throws(()=>placeLimit(full,{side:"buy",priceCents:100,quantity:1}));assert.deepEqual(full,before);
});
test("parsing rejects excess precision and invalid calendar dates",()=>{
  assert.equal(parseDecimal("0.29"),29);assert.equal(parseDecimal("99.99",10000),9999);
  for(const text of ["0","-1","1e3","1,000","1.001","1000000.01"])assert.throws(()=>parseDecimal(text));
  assert.equal(validDate("2028-02-29"),true);assert.equal(validDate("2026-02-29"),false);assert.equal(validDate("2026-11-31"),false);
});
test("local explanations use current aggregate values and always carry the disclaimer",()=>{
  const f=analyzeFinance(sampleTransactions,"2026-11"),p=analyzePortfolio(sampleAssets),book=sampleBook();
  for(const question of ["spending","portfolio","order book","what should I buy?"]){const answer=learningReply(question,f,p,book);assert.ok(answer.endsWith(disclaimer));}
  assert.match(learningReply("spending",f,p,book),/\$7,300\.00/);
  assert.match(learningReply("risk",f,p,book),/65\/100/);
  assert.match(learningReply("spread",f,p,book),/\$1\.00/);
});
