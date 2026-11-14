export const PLANS={monthly:80000,yearly:800000};
export const todayUTC=()=>new Date().toISOString().slice(0,10);
export const money=(paise)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(paise/100);
export function validDate(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const date=new Date(`${value}T00:00:00Z`);return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;}
export function addMonths(value,count){if(!validDate(value))throw Error("Choose a valid date.");const date=new Date(`${value}T00:00:00Z`),day=date.getUTCDate();date.setUTCDate(1);date.setUTCMonth(date.getUTCMonth()+count);const end=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+1,0)).getUTCDate();date.setUTCDate(Math.min(day,end));return date.toISOString().slice(0,10);}
export const active=(user,today=todayUTC())=>user.subscription.status==="active"&&user.subscription.startedOn<=today&&today<user.subscription.endsOn;
export function ensureActive(state,id,today){const user=state.users.find((item)=>item.id===id);if(!user||!active(user,today))throw Error("An active mock membership is required for this action.");return user;}
export function seed(today=todayUTC()){
  const start=today,end=addMonths(today,1);
  const charities=[{id:"open-table",name:"Open Table Project",category:"Community",description:"A fictional neighborhood food project, imagining a place at the table for everyone.",event:"Community kitchen open day · fictional event",image:"table"},{id:"bright-start",name:"Bright Start Collective",category:"Education",description:"A fictional learning initiative, exploring how books and curiosity can open doors.",event:"Stories under the stars · fictional event",image:"books"},{id:"wild-tomorrow",name:"Wild Tomorrow",category:"Environment",description:"A fictional habitat project, making a little more room for the natural world.",event:"A day for the green spaces · fictional event",image:"leaf"}];
  const users=[["alex","Alex Sample","open-table",[34,38,41,29,36]],["sam","Sam Sample","bright-start",[34,38,41,29,36]],["lee","Lee Sample","wild-tomorrow",[29,34,41,17,26]],["river","River Sample","open-table",[25,27,30,22,32]]].map(([id,name,charityId,values],index)=>({id,name,charityId,percent:10,subscription:{plan:"monthly",status:index===3?"lapsed":"active",startedOn:start,endsOn:index===3?today:end,cancelAtEnd:false},scores:values.map((score,i)=>({id:`${id}-round-${i}`,score,date:new Date(Date.parse(`${today}T00:00:00Z`)-i*86400000).toISOString().slice(0,10),sequence:5-i}))}));
  const historic=calculateDraw([34,38,41,29,36],users.slice(0,3).map((user)=>({id:user.id,name:user.name,scores:user.scores.map((item)=>item.score)})),216000,0);
  const previousMonth=addMonths(today,-1).slice(0,7);
  return {schema:1,revision:0,users,charities,draws:[{id:`draw-${previousMonth}`,month:previousMonth,mode:"historical fixture",publishedAt:`${previousMonth}-28T12:00:00.000Z`,...historic,winners:historic.winners.map((winner)=>({...winner,id:`historic-${winner.userId}`,verification:"awaiting-proof",proof:null,rejection:"",payment:"pending"}))}],rollover:0,donations:[],simulation:null};
}
function changed(state){state.revision++;state.simulation=null;}
export function activate(state,id,plan,charityId,percent,today=todayUTC()){
  const user=state.users.find((item)=>item.id===id);if(!user||!PLANS[plan])throw Error("Choose a known member and plan.");
  if(!state.charities.some((charity)=>charity.id===charityId)||!Number.isInteger(percent)||percent<10||percent>100)throw Error("Choose a charity and a whole contribution percentage from 10 to 100.");
  user.charityId=charityId;user.percent=percent;user.subscription={plan,status:"active",startedOn:today,endsOn:addMonths(today,plan==="yearly"?12:1),cancelAtEnd:false};changed(state);
}
export function endMembership(state,id,today=todayUTC(),immediate=false){const user=ensureActive(state,id,today);if(immediate){user.subscription.status="lapsed";user.subscription.endsOn=today;}else user.subscription.cancelAtEnd=true;changed(state);}
export function setContribution(state,id,charityId,percent,today=todayUTC()){const user=ensureActive(state,id,today);if(!state.charities.some((item)=>item.id===charityId)||!Number.isInteger(percent)||percent<10||percent>100)throw Error("Choose a charity and a contribution from 10 to 100.");user.charityId=charityId;user.percent=percent;changed(state);}
export function saveScore(state,id,input,today=todayUTC(),scoreId=null,admin=false){
  const user=admin?state.users.find((item)=>item.id===id):ensureActive(state,id,today);if(!user)throw Error("Unknown sample member.");
  const score=Number(input.score),date=String(input.date??"");if(!Number.isInteger(score)||score<1||score>45)throw Error("Stableford scores must be whole numbers from 1 to 45.");
  if(!validDate(date)||date<"2000-01-01"||date>today)throw Error("Choose a valid round date from 2000 through today.");
  if(scoreId&&!user.scores.some((item)=>item.id===scoreId))throw Error("That score no longer exists.");
  const record={id:scoreId??`round-${crypto.randomUUID().slice(0,8)}`,score,date,sequence:Math.max(0,...user.scores.map((item)=>item.sequence))+1};
  user.scores=[...user.scores.filter((item)=>item.id!==record.id),record].sort((a,b)=>b.date.localeCompare(a.date)||b.sequence-a.sequence).slice(0,5);changed(state);return user.scores.some((item)=>item.id===record.id);
}
export function monthlyFee(user,today=todayUTC()){
  if(!active(user,today))return 0;if(user.subscription.plan==="monthly")return PLANS.monthly;
  const [year,month]=today.split("-").map(Number),[startYear,startMonth]=user.subscription.startedOn.split("-").map(Number),offset=(year-startYear)*12+month-startMonth;
  if(offset<0||offset>=12)return 0;
  return Math.floor(PLANS.yearly/12)+(offset<PLANS.yearly%12?1:0);
}
export function budget(state,today=todayUTC()){
  let gross=0,charity=0,pool=0;const byCharity={};
  for(const user of state.users){const fee=monthlyFee(user,today),contribution=Math.floor(fee*user.percent/100);gross+=fee;charity+=contribution;pool+=fee-contribution;byCharity[user.charityId]=(byCharity[user.charityId]??0)+contribution;}
  return {gross,charity,pool,byCharity,activeCount:state.users.filter((user)=>active(user,today)).length};
}
export function calculateDraw(numbers,entries,pool,rollover){
  if(numbers.length!==5||new Set(numbers).size!==5||numbers.some((value)=>!Number.isInteger(value)||value<1||value>45))throw Error("A draw requires five unique numbers from 1 to 45.");
  if(![pool,rollover].every((value)=>Number.isSafeInteger(value)&&value>=0))throw Error("Invalid sample pool.");
  const matches=entries.map((entry)=>({...entry,matches:[...new Set(entry.scores)].filter((value)=>numbers.includes(value)).length}));
  const allocations={3:Math.floor(pool*25/100),4:Math.floor(pool*35/100)};allocations[5]=pool-allocations[3]-allocations[4]+rollover;
  let nextRollover=0;const winners=[];
  for(const tier of [5,4,3]){const group=matches.filter((entry)=>entry.matches===tier);if(tier===5&&!group.length)nextRollover=allocations[5];for(const entry of group)winners.push({userId:entry.id,name:entry.name,tier,prize:Math.floor(allocations[tier]/group.length)});}
  return {numbers:[...numbers],pool,incomingRollover:rollover,allocations,entries:matches,winners,nextRollover,unawardedReserve:pool+rollover-nextRollover-winners.reduce((sum,winner)=>sum+winner.prize,0)};
}
export function randomInt(limit){const ceiling=Math.floor(4294967296/limit)*limit,buffer=new Uint32Array(1);do{crypto.getRandomValues(buffer);}while(buffer[0]>=ceiling);return buffer[0]%limit;}
export function drawNumbers(mode,entries,next=randomInt){
  if(!["random","weighted"].includes(mode))throw Error("Choose random or frequency-weighted mode.");
  const available=Array.from({length:45},(_,index)=>({number:index+1,weight:mode==="weighted"?1+entries.flatMap((entry)=>entry.scores).filter((value)=>value===index+1).length:1})),numbers=[];
  while(numbers.length<5){const total=available.reduce((sum,item)=>sum+item.weight,0);let ticket=next(total),index=0;while(ticket>=available[index].weight){ticket-=available[index].weight;index++;}numbers.push(available[index].number);available.splice(index,1);}
  return numbers;
}
export function simulate(state,mode,today=todayUTC(),next=randomInt){
  if(state.draws.some((draw)=>draw.month===today.slice(0,7)))throw Error("This month already has a published local result.");
  const entries=state.users.filter((user)=>active(user,today)&&user.scores.length===5).map((user)=>({id:user.id,name:user.name,scores:user.scores.map((item)=>item.score)}));
  if(!entries.length)throw Error("At least one active member needs five retained scores.");
  state.simulation={revision:state.revision,month:today.slice(0,7),mode,...calculateDraw(drawNumbers(mode,entries,next),entries,budget(state,today).pool,state.rollover)};return state.simulation;
}
export function publish(state,today=todayUTC()){
  const simulated=state.simulation;if(!simulated||simulated.revision!==state.revision||simulated.month!==today.slice(0,7))throw Error("Run a fresh simulation before publishing.");
  if(state.draws.some((draw)=>draw.month===simulated.month))throw Error("A result is already published for this month.");
  const draw=structuredClone({...simulated,id:`draw-${simulated.month}`,publishedAt:new Date().toISOString(),winners:simulated.winners.map((winner)=>({...winner,id:`${simulated.month}-${winner.userId}`,verification:"awaiting-proof",proof:null,rejection:"",payment:"pending"}))});
  state.draws.push(draw);state.rollover=draw.nextRollover;state.simulation=null;return draw;
}
export const winners=(state)=>state.draws.flatMap((draw)=>draw.winners.map((winner)=>({...winner,month:draw.month})));
function findWinner(state,id){const winner=state.draws.flatMap((draw)=>draw.winners).find((item)=>item.id===id);if(!winner)throw Error("Unknown local award.");return winner;}
export function submitProof(state,id,userId,proof,today=todayUTC()){
  ensureActive(state,userId,today);const winner=findWinner(state,id);if(winner.userId!==userId||["approved"].includes(winner.verification)||winner.payment==="paid")throw Error("This award is not accepting a new proof.");
  if(!proof||!/^data:image\/(?:png|jpeg|webp);base64,/.test(proof.url))throw Error("Choose a valid local proof image.");
  winner.proof=proof;winner.verification="pending-review";winner.rejection="";
}
export function verifyWinner(state,id,approved,reason=""){const winner=findWinner(state,id);if(winner.verification!=="pending-review"||!winner.proof)throw Error("A submitted proof is required.");if(!approved&&String(reason).trim().length<5)throw Error("Add a rejection reason of at least five characters.");winner.verification=approved?"approved":"rejected";winner.rejection=approved?"":String(reason).trim().slice(0,160);}
export function payWinner(state,id){const winner=findWinner(state,id);if(winner.verification!=="approved"||winner.payment!=="pending")throw Error("Approve an unpaid award first.");winner.payment="paid";}
export function donate(state,charityId,value){const amount=String(value).trim();if(!/^\d{1,5}(?:\.\d{1,2})?$/.test(amount))throw Error("Enter a donation from ₹1 to ₹99,999.99 with at most two decimals.");const [whole,fraction=""]=amount.split("."),paise=Number(whole)*100+Number(fraction.padEnd(2,"0"));if(paise<100||!state.charities.some((item)=>item.id===charityId))throw Error("Choose a charity and an amount of at least ₹1.");if(state.donations.length>=20)throw Error("This demo keeps up to 20 donation records.");const record={id:crypto.randomUUID(),charityId,paise,at:new Date().toISOString()};state.donations.push(record);return record;}
export function saveCharity(state,input,id=null){
  const name=String(input.name??"").trim(),description=String(input.description??"").trim(),event=String(input.event??"").trim();
  if(name.length<3||name.length>60||description.length<20||description.length>400||event.length<5||event.length>120||!["Community","Education","Environment"].includes(input.category)||!["table","books","leaf"].includes(input.image))throw Error("Use a name (3–60), description (20–400), event (5–120), and an available cause and artwork.");
  if(state.charities.some((item)=>item.id!==id&&item.name.toLowerCase()===name.toLowerCase()))throw Error("That charity name is already in use.");
  if(!id&&state.charities.length>=12)throw Error("This demo supports up to 12 fictional charities.");
  const record={id:id??`cause-${crypto.randomUUID().slice(0,8)}`,name,description,event,category:input.category,image:input.image},index=state.charities.findIndex((item)=>item.id===id);
  if(id&&index<0)throw Error("That charity no longer exists.");if(index<0)state.charities.push(record);else state.charities[index]=record;changed(state);return record;
}
export function deleteCharity(state,id){if(state.users.some((user)=>user.charityId===id)||state.donations.some((record)=>record.charityId===id))throw Error("A selected or donated-to charity is retained for ledger integrity.");state.charities=state.charities.filter((item)=>item.id!==id);changed(state);}
