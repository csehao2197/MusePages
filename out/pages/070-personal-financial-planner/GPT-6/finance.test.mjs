import test from "node:test";
import assert from "node:assert/strict";
import {samplePlan,parseMoney,validatePlan,calculatePlan} from "./assets/finance.js";
const empty=(startMonth="2026-11")=>({version:1,startMonth,openingBalanceCents:0,income:[],expenses:[],goals:[]});
test("calendar schedules count real biweekly paydays and one-time expenses once",()=>{
  const rows=calculatePlan(samplePlan);
  assert.equal(rows[0].incomeCents,510000);
  assert.equal(rows[1].incomeCents,510000);
  assert.equal(rows[2].incomeCents,555000);
  assert.equal(rows[0].expenseCents,235500);
  assert.equal(rows[1].expenseCents,271500);
  assert.equal(rows[2].expenseCents,235500);
  assert.equal(rows[0].closingBalanceCents,1042833);
  assert.equal(rows.length,12);
});
test("monthly anchors clamp to month-end and do not occur before their first date",()=>{
  const p=empty("2028-01");p.income=[{id:"pay",name:"Monthly",amountCents:10000,frequency:"monthly",startDate:"2028-01-31"}];p.expenses=[{id:"bill",name:"Monthly bill",amountCents:100,category:"Other",kind:"recurring",dueDate:"2028-03-31"}];
  const rows=calculatePlan(p);
  assert.deepEqual(rows.slice(0,4).map(r=>r.incomeCents),[10000,10000,10000,10000]);
  assert.deepEqual(rows.slice(0,4).map(r=>r.expenseCents),[0,0,100,100]);
  p.income[0].frequency="biweekly";p.income[0].startDate="2028-01-04";
  assert.deepEqual(calculatePlan(p).slice(0,3).map(r=>r.incomeCents),[20000,30000,20000]);
});
test("cent rounding caps the last allocation and does not double-count saved funds",()=>{
  const p=empty();p.openingBalanceCents=1000;p.goals=[{id:"g",name:"Three month goal",targetCents:200,savedCents:100,targetDate:"2027-01-31"}];
  const rows=calculatePlan(p);
  assert.deepEqual(rows.slice(0,4).map(r=>r.goalCents),[34,34,32,0]);
  assert.equal(rows[0].closingBalanceCents,966);
  assert.equal(rows.at(-1).closingBalanceCents,900);
  assert.equal(rows[2].allocations[0].projectedSavedCents,200);
  p.goals[0].savedCents=300;
  assert.equal(calculatePlan(p)[0].goalCents,0);
  assert.equal(calculatePlan(p)[0].allocations[0].projectedSavedCents,300);
});
test("overdue goals allocate immediately and retain unfunded negative balances",()=>{
  const p=empty();p.goals=[{id:"old",name:"Past goal",targetCents:12000,savedCents:2000,targetDate:"2026-10-31"}];
  const rows=calculatePlan(p);
  assert.equal(rows[0].goalCents,10000);
  assert.equal(rows[0].closingBalanceCents,-10000);
  assert.equal(rows[1].goalCents,0);
  assert.equal(rows[11].closingBalanceCents,-10000);
});
test("dollar parsing preserves cents and rejects exponent, excess precision and limits",()=>{
  assert.equal(parseMoney("0.29"),29);
  assert.equal(parseMoney("-120.01",true),-12001);
  assert.equal(parseMoney("10000000"),1000000000);
  for(const raw of ["1e6","0.001","1,000","-1","10000000.01","Infinity","",null])assert.throws(()=>parseMoney(raw));
});
test("imports are strict, bounded and reject ambiguous or invalid financial data",()=>{
  const mutations=[p=>p.extra=true,p=>p.version=2,p=>p.income[0].amountCents=1.5,p=>p.income[0].startDate="2026-02-30",p=>p.income[0].frequency="daily",p=>p.goals[0].savedCents=-1,p=>p.expenses[0].category="Unknown",p=>p.expenses[0].id=p.income[0].id,p=>p.startMonth="2026-13",p=>p.income[0].amountCents=1000000001,p=>p.income.push(...Array(201).fill(p.income[0])),p=>p.expenses[0].kind="weekly"];
  for(const mutate of mutations){const p=structuredClone(samplePlan);mutate(p);assert.throws(()=>validatePlan(p));}
  assert.equal(validatePlan(empty()).version,1);
});
