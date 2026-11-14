export const restaurants=[
  {id:"folk",name:"Folk Coffee",category:"coffee",label:"COFFEE & CONVERSATION",location:"The corner on Birch Lane",description:"Small-batch brews. A seat that feels like yours.",goal:10,reward:"A coffee on the house",icon:"coffee",art:"folk.svg",color:"#e5b6a0"},
  {id:"nori",name:"Nori Club",category:"sushi",label:"ROLLS & GOOD COMPANY",location:"Around the corner on Willow St.",description:"Fresh rolls, long lunches, familiar faces.",goal:8,reward:"A little side of something good",icon:"fish",art:"nori.svg",color:"#bbcaaa"},
  {id:"sunday",name:"Sunday Oven",category:"bakery",label:"SLOW MORNINGS, WARM PASTRIES",location:"Your make-believe market square",description:"Something flaky. Something worth slowing down for.",goal:6,reward:"A pastry for your next slow morning",icon:"croissant",art:"sunday.svg",color:"#b8c5dd"}
];
export function initialState(){return {now:"2026-11-16T12:00:00.000Z",users:[{id:"alex",name:"Alex",points:240},{id:"maya",name:"Maya",points:310},{id:"jamie",name:"Jamie",points:180}],cards:[{restaurantId:"folk",joined:true,punches:7,cycle:1},{restaurantId:"nori",joined:true,punches:3,cycle:1},{restaurantId:"sunday",joined:false,punches:0,cycle:1}],raffles:[],rewards:[],transfers:[],activity:[]};}
const fail=message=>({error:message});
const succeed=(state,message)=>({state,message});
const findRestaurant=id=>restaurants.find(r=>r.id===id);
export function joinRestaurant(state,id){
  if(!findRestaurant(id))return fail("That demo place was not found.");
  if(state.cards.find(c=>c.restaurantId===id)?.joined)return fail("This card is already in your wallet.");
  const next=structuredClone(state);next.cards.find(c=>c.restaurantId===id).joined=true;
  next.activity.unshift({type:"joined",restaurantId:id});
  return succeed(next,"Your demo card is in your wallet.");
}
export function addPunch(state,id){
  const restaurant=findRestaurant(id),card=state.cards.find(c=>c.restaurantId===id);
  if(!restaurant||!card?.joined)return fail("Join this demo card first.");
  if(card.punches>=restaurant.goal)return fail("This card is already complete.");
  const next=structuredClone(state),updated=next.cards.find(c=>c.restaurantId===id);
  updated.punches++;next.users.find(u=>u.id==="alex").points+=10;
  next.activity.unshift({type:"visit",restaurantId:id,points:10,cycle:updated.cycle});
  if(updated.punches===restaurant.goal){
    const rewardId=`${id}-${updated.cycle}`;
    next.raffles.push({id:rewardId,restaurantId:id,cycle:updated.cycle});
    next.rewards.push({id:rewardId,restaurantId:id,cycle:updated.cycle,status:"available",expiresAt:new Date(Date.parse(next.now)+30*86400000).toISOString()});
    return succeed(next,"Card complete! One illustrative reward and raffle entry added.");
  }
  return succeed(next,"One local demo visit added. +10 demo points.");
}
export function startCycle(state,id){
  const restaurant=findRestaurant(id),card=state.cards.find(c=>c.restaurantId===id);
  if(!restaurant||!card?.joined||card.punches!==restaurant.goal)return fail("Complete the current card first.");
  const next=structuredClone(state),updated=next.cards.find(c=>c.restaurantId===id);
  updated.punches=0;updated.cycle++;
  return succeed(next,"A fresh card. Your previous reward and entry are still in your wallet.");
}
export function redeem(state,id){
  const reward=state.rewards.find(r=>r.id===id);
  if(!reward||reward.status!=="available")return fail("That illustrative reward is not available.");
  if(Date.parse(reward.expiresAt)<=Date.parse(state.now))return fail("That illustrative reward has expired.");
  const next=structuredClone(state);next.rewards.find(r=>r.id===id).status="redeemed";
  next.activity.unshift({type:"redeemed",restaurantId:reward.restaurantId});
  return succeed(next,"Demo redemption recorded. Nothing has been sent to a restaurant.");
}
export function transfer(state,to,amount,message=""){
  const from=state.users.find(u=>u.id==="alex"),recipient=state.users.find(u=>u.id===to);
  if(!recipient||to==="alex")return fail("Choose another fictional neighbor.");
  if(!Number.isSafeInteger(amount)||amount<1||amount>from.points)return fail("Use a whole number between 1 and your demo balance.");
  if(typeof message!=="string"||message.trim().length>120)return fail("Keep the note to 120 characters.");
  const next=structuredClone(state);next.users.find(u=>u.id==="alex").points-=amount;next.users.find(u=>u.id===to).points+=amount;
  next.transfers.unshift({to,amount,message:message.trim()});next.activity.unshift({type:"transfer",to,amount,message:message.trim()});
  return succeed(next,"Demo points moved locally. No real person or account was contacted.");
}
export function badges(state){
  const sent=state.transfers.reduce((sum,t)=>sum+t.amount,0);
  return [{id:"neighbor",name:"Good neighbor",description:"Make your first demo transfer",earned:sent>0},{id:"generous",name:"Good things grow",description:"Share 100 demo points in total",earned:sent>=100},{id:"regular",name:"Creature of good habits",description:"Complete your first demo card",earned:state.raffles.length>0}];
}
export function metrics(state){return {visits:state.activity.filter(a=>a.type==="visit").length,completed:state.raffles.length,redeemed:state.rewards.filter(r=>r.status==="redeemed").length,transferred:state.transfers.reduce((sum,t)=>sum+t.amount,0)};}
