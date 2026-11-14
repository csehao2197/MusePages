export const MAX_CENTS=1_000_000_000;
export const samplePlan={
  version:1,startMonth:"2026-11",openingBalanceCents:820000,
  income:[{id:"salary",name:"Monthly salary",amountCents:420000,frequency:"monthly",startDate:"2026-11-28"},{id:"freelance",name:"Freelance work",amountCents:45000,frequency:"biweekly",startDate:"2026-11-06"}],
  expenses:[{id:"rent",name:"Rent & utilities",amountCents:165000,category:"Housing",kind:"recurring",dueDate:"2026-11-01"},{id:"food",name:"Groceries",amountCents:48000,category:"Food",kind:"recurring",dueDate:"2026-11-07"},{id:"transport",name:"Getting around",amountCents:16000,category:"Transport",kind:"recurring",dueDate:"2026-11-10"},{id:"subscriptions",name:"Subscriptions",amountCents:6500,category:"Lifestyle",kind:"recurring",dueDate:"2026-11-15"},{id:"weekend",name:"Weekend away",amountCents:36000,category:"Lifestyle",kind:"one-time",dueDate:"2026-12-12"}],
  goals:[{id:"emergency",name:"A little peace of mind",targetCents:1000000,savedCents:620000,targetDate:"2027-10-31"},{id:"summer",name:"Somewhere sunny",targetCents:240000,savedCents:80000,targetDate:"2027-06-30"}]
};
export const expenseCategories=["Housing","Food","Transport","Lifestyle","Health","Other"];
const object=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const exact=(x,keys)=>object(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const cents=(x,zero=false)=>Number.isInteger(x)&&x>=(zero?0:1)&&x<=MAX_CENTS;
const name=x=>typeof x==="string"&&x===x.trim()&&x.length>0&&x.length<=80&&!/[\u0000-\u001f]/.test(x);
const date=x=>typeof x==="string"&&/^(20[2-9]\d|2100)-\d{2}-\d{2}$/.test(x)&&Number.isFinite(Date.parse(x+"T00:00:00Z"))&&new Date(x+"T00:00:00Z").toISOString().slice(0,10)===x;
export function validatePlan(p){
  if(!exact(p,["version","startMonth","openingBalanceCents","income","expenses","goals"])||p.version!==1)throw Error("Choose a version 1 Penny plan with the expected fields.");
  if(typeof p.startMonth!=="string"||!date(p.startMonth+"-01")||!Number.isInteger(p.openingBalanceCents)||Math.abs(p.openingBalanceCents)>MAX_CENTS)throw Error("Use a valid starting month and opening available cash within ±$10,000,000.");
  const ids=new Set();
  for(const kind of ["income","expenses","goals"]){
    if(!Array.isArray(p[kind])||p[kind].length>200)throw Error("Each list supports up to 200 entries.");
    for(const entry of p[kind]){
      const keys=kind==="income"?["id","name","amountCents","frequency","startDate"]:kind==="expenses"?["id","name","amountCents","category","kind","dueDate"]:["id","name","targetCents","savedCents","targetDate"];
      if(!exact(entry,keys)||typeof entry.id!=="string"||!/^[a-zA-Z0-9_-]{1,60}$/.test(entry.id)||ids.has(entry.id)||!name(entry.name))throw Error("Entries need unique safe IDs and names of 1–80 characters.");
      ids.add(entry.id);
      if(kind==="income"&&(!cents(entry.amountCents)||!["monthly","biweekly"].includes(entry.frequency)||!date(entry.startDate)))throw Error("Income needs a positive amount, monthly or biweekly frequency, and a valid first payday.");
      if(kind==="expenses"&&(!cents(entry.amountCents)||!expenseCategories.includes(entry.category)||!["recurring","one-time"].includes(entry.kind)||!date(entry.dueDate)))throw Error("Expenses need a positive amount, supported category, recurrence and a valid due date.");
      if(kind==="goals"&&(!cents(entry.targetCents)||!cents(entry.savedCents,true)||!date(entry.targetDate)))throw Error("Goals need a positive target, nonnegative saved amount and a valid target date.");
    }
  }
  return p;
}
export function parseMoney(value,allowNegative=false){
  const raw=String(value).trim();
  if(!(allowNegative?/^-?\d{1,8}(?:\.\d{1,2})?$/:/^\d{1,8}(?:\.\d{1,2})?$/).test(raw))throw Error("Enter dollars with up to two decimal places, without commas or currency symbols.");
  const [whole,fraction=""]=raw.replace("-","").split("."),result=(Number(whole)*100+Number(fraction.padEnd(2,"0")))*(raw.startsWith("-")?-1:1);
  if(Math.abs(result)>MAX_CENTS)throw Error("The supported amount limit is $10,000,000.");
  return result;
}
export function monthAt(start,offset){
  const [year,month]=start.split("-").map(Number);
  return new Date(Date.UTC(year,month-1+offset,1)).toISOString().slice(0,7);
}
function scheduledInMonth(entry,month,firstDate){
  const start=Date.parse(month+"-01T00:00:00Z"),end=Date.parse(monthAt(month,1)+"-01T00:00:00Z"),anchor=Date.parse(firstDate+"T00:00:00Z");
  if(entry.frequency==="biweekly"){
    const period=14*86400000,first=anchor+Math.max(0,Math.ceil((start-anchor)/period))*period;
    return first>=end?0:Math.floor((end-1-first)/period)+1;
  }
  if(entry.kind==="one-time")return firstDate.slice(0,7)===month?1:0;
  const [year,m]=month.split("-").map(Number),day=Math.min(Number(firstDate.slice(8)),new Date(Date.UTC(year,m,0)).getUTCDate());
  return Date.UTC(year,m-1,day)>=anchor?1:0;
}
function monthsToGoal(start,date){
  const [y,m]=start.split("-").map(Number),[dy,dm]=date.split("-").map(Number);
  return Math.max(1,(dy-y)*12+dm-m+1);
}
export function calculatePlan(plan){
  validatePlan(plan);
  const remaining=plan.goals.map(g=>Math.max(0,g.targetCents-g.savedCents)),monthlyAllocations=remaining.map((amount,i)=>Math.ceil(amount/monthsToGoal(plan.startMonth,plan.goals[i].targetDate)));
  let balance=plan.openingBalanceCents;
  return Array.from({length:12},(_,i)=>{
    const month=monthAt(plan.startMonth,i),incomeCents=plan.income.reduce((n,x)=>n+x.amountCents*scheduledInMonth(x,month,x.startDate),0),expenseCents=plan.expenses.reduce((n,x)=>n+x.amountCents*scheduledInMonth(x,month,x.dueDate),0);
    const allocations=plan.goals.map((goal,j)=>{const amount=Math.min(remaining[j],monthlyAllocations[j]);remaining[j]-=amount;return {id:goal.id,amountCents:amount,projectedSavedCents:Math.max(goal.savedCents,goal.targetCents-remaining[j])};});
    const goalCents=allocations.reduce((n,x)=>n+x.amountCents,0),surplusCents=incomeCents-expenseCents-goalCents;
    balance+=surplusCents;
    return {month,incomeCents,expenseCents,goalCents,surplusCents,closingBalanceCents:balance,allocations};
  });
}
export function forecastCSV(rows){return ["month,income_cents,expenses_cents,goal_allocation_cents,closing_available_cents",...rows.map(r=>`${r.month},${r.incomeCents},${r.expenseCents},${r.goalCents},${r.closingBalanceCents}`)].join("\r\n")+"\r\n";}
