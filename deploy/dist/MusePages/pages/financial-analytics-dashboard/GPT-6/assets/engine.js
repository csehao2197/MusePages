export const disclaimer="Educational demo only. Not financial, investment or tax advice.";
export const categories=["Housing","Food","Utilities","Transport","Lifestyle","Other"];
export const assetClasses={Cash:1,Bonds:2,Equities:4,Alternatives:5};
export const sampleTransactions=[
  {id:"salary",name:"Monthly salary",type:"income",category:"Income",date:"2026-11-01",amountCents:650000},
  {id:"consulting",name:"Consulting",type:"income",category:"Income",date:"2026-11-08",amountCents:80000},
  {id:"housing",name:"Rent & home",type:"expense",category:"Housing",date:"2026-11-02",amountCents:260000},
  {id:"food",name:"Food & groceries",type:"expense",category:"Food",date:"2026-11-12",amountCents:78000},
  {id:"utilities",name:"Utilities",type:"expense",category:"Utilities",date:"2026-11-06",amountCents:24000},
  {id:"transport",name:"Transport",type:"expense",category:"Transport",date:"2026-11-15",amountCents:42000},
  {id:"lifestyle",name:"Leisure & subscriptions",type:"expense",category:"Lifestyle",date:"2026-11-20",amountCents:65000},
  {id:"laptop",name:"Laptop",type:"expense",category:"Other",date:"2026-11-24",amountCents:155000}
];
export const sampleBudgets={"2026-11":{Housing:240000,Food:70000,Utilities:25000,Transport:40000,Lifestyle:60000,Other:150000}};
export const sampleAssets=[{id:"broad",name:"Broad equity sample",weightBps:6000,assetClass:"Equities"},{id:"bond",name:"Bond sample",weightBps:2500,assetClass:"Bonds"},{id:"cash",name:"Cash sample",weightBps:1000,assetClass:"Cash"},{id:"alt",name:"Alternatives sample",weightBps:500,assetClass:"Alternatives"}];
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
export function parseDecimal(value,maxCents=100000000){
  const raw=String(value).trim();if(!/^\d{1,8}(?:\.\d{1,2})?$/.test(raw))throw Error("Use a positive decimal with at most two decimal places, without commas or currency symbols.");
  const [whole,fraction=""]=raw.split("."),cents=Number(whole)*100+Number(fraction.padEnd(2,"0"));
  if(cents<1||cents>maxCents)throw Error(`Use an amount from 0.01 to ${(maxCents/100).toFixed(2)}.`);
  return cents;
}
export function validDate(value){return typeof value==="string"&&/^(20[2-9]\d|2100)-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+"T00:00:00Z"))&&new Date(value+"T00:00:00Z").toISOString().slice(0,10)===value;}
export function validateTransaction(x){
  if(typeof x.name!=="string"||!x.name.trim()||x.name.length>70||!["income","expense"].includes(x.type)||!validDate(x.date)||!Number.isInteger(x.amountCents)||x.amountCents<1||x.amountCents>100000000||!(x.type==="income"?x.category==="Income":categories.includes(x.category)))throw Error("Use a name of 1–70 characters, a valid 2020–2100 date, category and positive amount up to $1,000,000.");
  return x;
}
export function analyzeFinance(transactions,month){
  const selected=transactions.filter(t=>t.date.slice(0,7)===month),incomeCents=selected.filter(t=>t.type==="income").reduce((n,t)=>n+t.amountCents,0),expenseCents=selected.filter(t=>t.type==="expense").reduce((n,t)=>n+t.amountCents,0),byCategory=Object.fromEntries(categories.map(c=>[c,selected.filter(t=>t.type==="expense"&&t.category===c).reduce((n,t)=>n+t.amountCents,0)]));
  const savingsCents=incomeCents-expenseCents,savingsRate=incomeCents?savingsCents/incomeCents:null,fixedCents=byCategory.Housing+byCategory.Utilities,score=incomeCents?Math.round(70*clamp(savingsRate/.2,0,1)+30*clamp((1-fixedCents/incomeCents)/.5,0,1)):null;
  return {incomeCents,expenseCents,savingsCents,savingsRate,fixedCents,byCategory,score};
}
export function analyzePortfolio(assets){
  const totalBps=assets.reduce((n,a)=>n+a.weightBps,0),valid=assets.length>0&&totalBps===10000;
  return {totalBps,valid,index:valid?Math.round(assets.reduce((n,a)=>n+a.weightBps*assetClasses[a.assetClass],0)/500):null,hhi:valid?Math.round(assets.reduce((n,a)=>n+a.weightBps*a.weightBps,0)/10000):null};
}
export function newBook(){return {nextSequence:1,nextTrade:1,orders:[],trades:[]};}
export function placeLimit(book,{side,priceCents,quantity},timestamp=new Date().toISOString()){
  if(!["buy","sell"].includes(side)||!Number.isInteger(priceCents)||priceCents<1||priceCents>100000000||!Number.isInteger(quantity)||quantity<1||quantity>10000)throw Error("Use buy/sell, price $0.01–$1,000,000 and a whole quantity of 1–10,000.");
  if(book.orders.length>=200)throw Error("This local session supports 200 orders. Reset the sample book to continue.");
  const order={id:`L${String(book.nextSequence).padStart(4,"0")}`,sequence:book.nextSequence++,side,priceCents,quantity,remaining:quantity,status:"open",timestamp};
  const opposite=book.orders.filter(o=>o.side!==side&&["open","partial"].includes(o.status)&&(side==="buy"?o.priceCents<=priceCents:o.priceCents>=priceCents)).sort((a,b)=>(side==="buy"?a.priceCents-b.priceCents:b.priceCents-a.priceCents)||a.sequence-b.sequence);
  book.orders.push(order);
  for(const resting of opposite){
    if(order.remaining===0)break;
    const fill=Math.min(order.remaining,resting.remaining);order.remaining-=fill;resting.remaining-=fill;
    resting.status=resting.remaining===0?"filled":"partial";
    book.trades.push({id:`T${String(book.nextTrade++).padStart(4,"0")}`,buyOrderId:side==="buy"?order.id:resting.id,sellOrderId:side==="sell"?order.id:resting.id,priceCents:resting.priceCents,quantity:fill,timestamp});
  }
  order.status=order.remaining===0?"filled":order.remaining===order.quantity?"open":"partial";
  return order;
}
export function cancelOrder(book,id){const order=book.orders.find(o=>o.id===id);if(!order||!["open","partial"].includes(order.status))return false;order.status="canceled";return true;}
export function bookLevels(book){
  const levels=side=>{const values=new Map();for(const o of book.orders.filter(o=>o.side===side&&["open","partial"].includes(o.status)))values.set(o.priceCents,(values.get(o.priceCents)||0)+o.remaining);return [...values].map(([priceCents,quantity])=>({priceCents,quantity})).sort((a,b)=>side==="buy"?b.priceCents-a.priceCents:a.priceCents-b.priceCents);};
  const bids=levels("buy"),asks=levels("sell");return {bids,asks,spreadCents:bids.length&&asks.length?asks[0].priceCents-bids[0].priceCents:null};
}
export function sampleBook(){
  const book=newBook();
  for(const input of [{side:"sell",priceCents:10000,quantity:12},{side:"sell",priceCents:10000,quantity:8},{side:"sell",priceCents:10100,quantity:15},{side:"buy",priceCents:9900,quantity:10},{side:"buy",priceCents:9800,quantity:20}])placeLimit(book,input);
  return book;
}
export function learningReply(question,finance,portfolio,book){
  const q=question.toLowerCase(),money=x=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(x/100);
  let answer;
  if(/\b(portfolio|allocation|concentration|risk|asset)\b/.test(q))answer=portfolio.valid?`Your entered allocation totals 100%. The illustrative class-weight index is ${portfolio.index}/100; label-level HHI is ${portfolio.hhi}/10000. These do not measure market volatility, underlying overlap or investment suitability.`:`Entered weights total ${portfolio.totalBps/100}%. The index and concentration calculation stay unavailable until the total is exactly 100%.`;
  else if(/\b(order|trade|trading|spread|book|match)\b/.test(q)){const levels=bookLevels(book);answer=`This local book has ${book.trades.length} simulated fills. The best-price spread is ${levels.spreadCents===null?"unavailable with one or both sides empty":money(levels.spreadCents)}. Better prices match first, then earlier sequence; execution uses the resting order's price. There is no exchange, money or position accounting.`;}
  else if(/\b(spend|spending|income|budget|saving|savings|finance)\b/.test(q))answer=`The selected month's entered income is ${money(finance.incomeCents)}, expenses ${money(finance.expenseCents)}, and net flow ${money(finance.savingsCents)}. Savings rate is ${finance.savingsRate===null?"unavailable without income":(finance.savingsRate*100).toFixed(1)+"%"}. The illustrative score is a disclosed heuristic, not a financial assessment.`;
  else answer="This is a deterministic local explainer, not an AI model or adviser. Ask about spending, portfolio allocation, or the order book to see the current sample numbers explained. No investment, tax or personalized recommendation is generated.";
  return `${answer} ${disclaimer}`;
}
