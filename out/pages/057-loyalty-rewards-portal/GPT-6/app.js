const $=selector=>document.querySelector(selector);
const paths={
  calendar:'M5 4H19A2 2 0 0 1 21 6V20A2 2 0 0 1 19 22H5A2 2 0 0 1 3 20V6A2 2 0 0 1 5 4ZM7 1V7M17 1V7M3 10H21M7 14H10M14 14H17',
  truck:'M1 4H15V17H1ZM15 9H19L23 13V17H15M5 21A2 2 0 1 0 5 17 2 2 0 0 0 5 21ZM19 21A2 2 0 1 0 19 17 2 2 0 0 0 19 21Z',
  spark:'M12 1L15 9 23 12 15 15 12 23 9 15 1 12 9 9ZM20 1V6M18 3H23',
  star:'M12 2L15 8.5 22 9.5 17 14.5 18.5 22 12 18.5 5.5 22 7 14.5 2 9.5 9 8.5Z',
  tag:'M2 3H12L23 14 14 23 2 11ZM7 7H7.01',
  headphones:'M3 13V10A9 9 0 0 1 21 10V13M3 12H7V21H3ZM17 12H21V21H17',
  trend:'M2 18L9 11 14 16 22 5M16 5H22V11',
  gift:'M2 8H22V12H2ZM4 12V22H20V12M12 8V22M12 8C1 8 6 -4 12 8ZM12 8C23 8 18 -4 12 8Z',
  users:'M8 11A4 4 0 1 0 8 3 4 4 0 0 0 8 11ZM1 22V19C1 12 15 12 15 19V22M17 3A4 4 0 0 1 17 11M18 15C22 15 23 18 23 21',
  target:'M12 22A10 10 0 1 0 12 2 10 10 0 0 0 12 22ZM12 17A5 5 0 1 0 12 7 5 5 0 0 0 12 17ZM12 12H12.01',
  download:'M12 2V16M7 11L12 16 17 11M3 16V22H21V16',
  copy:'M9 8H21V22H9ZM15 8V2H3V16H9',
  award:'M12 15A7 7 0 1 0 12 1 7 7 0 0 0 12 15ZM7 13L4 23 12 19 20 23 17 13',
  bag:'M4 7H20L22 23H2ZM8 9V5A4 4 0 0 1 16 5V9',
  pencil:'M3 17L17 3 21 7 7 21 2 22ZM14 6L18 10',
  camera:'M8 5L10 2H15L17 5H22V21H2V5ZM12 17A4 4 0 1 0 12 9 4 4 0 0 0 12 17Z',
  shield:'M12 1L22 5V12C22 17 17 21 12 23C7 21 2 17 2 12V5ZM7 12L11 16 18 8',
  share:'M18 7A3 3 0 1 0 18 1 3 3 0 0 0 18 7ZM5 15A3 3 0 1 0 5 9 3 3 0 0 0 5 15ZM18 23A3 3 0 1 0 18 17 3 3 0 0 0 18 23ZM8 10L15 6M8 14L15 18',
  heart:'M12 22C8 18 1 13 1 7C1 0 9 -1 12 5C15 -1 23 0 23 7C23 13 16 18 12 22Z',
  megaphone:'M2 8V16H7L21 22V2L7 8ZM7 16L10 23H5L3 16',
  diamond:'M1 8L6 2H18L23 8 12 23ZM1 8H23M6 2L9 8 12 23 15 8 18 2',
  sunrise:'M1 18H23M6 18A6 6 0 0 1 18 18M12 1V5M2 7L5 10M22 7L19 10M12 8V3M9 5L12 2 15 5M3 23H21',
  flame:'M13 1C18 6 11 8 17 12C18 10 19 9 19 7C29 20 15 29 7 20C0 12 8 7 9 3C10 10 14 8 13 1Z',
  cake:'M2 12H22V23H2ZM2 17Q5 21 8 17Q12 21 16 17Q19 21 22 17M6 12V8M12 12V7M18 12V8M5 4L6 2 7 4M11 3L12 1 13 3M17 4L18 2 19 4',
  lock:'M5 10H19V23H5ZM8 10V6A4 4 0 0 1 16 6V10M12 15V18'
};
const icon=name=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.spark}"/></svg>`;
document.querySelectorAll('[data-icon]').forEach(element=>element.innerHTML=icon(element.dataset.icon));
const number=value=>value.toLocaleString('en-US');
function el(tag,value,className){const element=document.createElement(tag);element.textContent=value;if(className)element.className=className;return element;}
const tierData=[
  {name:'Bronze',start:0,max:1000,range:'0–1,000 pts',perk:'Earn 1 point per $1',color:'#b47b50',icon:'shield'},
  {name:'Silver',start:1001,max:3000,range:'1,001–3,000 pts',perk:'5% birthday discount',color:'#9492a5',icon:'award'},
  {name:'Gold',start:3001,max:6000,range:'3,001–6,000 pts',perk:'Free shipping on all orders',color:'#c49848',icon:'diamond'},
  {name:'Platinum',start:6001,max:Infinity,range:'6,001+ pts',perk:'Early access + personal shopper',color:'#a384c6',icon:'star'}
];
const rewards=[
  {id:'credit5',name:'$5 Store Credit',cost:250,category:'discounts',icon:'gift',description:'A little off your next favourite thing.',featured:true},
  {id:'credit10',name:'$10 Store Credit',cost:500,category:'discounts',icon:'gift',description:'Make your next basket a little sweeter.'},
  {id:'express',name:'Free Express Shipping',cost:300,category:'discounts',icon:'truck',description:'Your favourites, one proposed fast lane.'},
  {id:'discount20',name:'20% Off Next Order',cost:800,category:'discounts',icon:'tag',description:'A proposed discount on one eligible order.'},
  {id:'tote',name:'Exclusive Tote Bag',cost:1500,category:'products',icon:'bag',description:'An original everyday tote concept. Illustration, not a product photograph.',image:true},
  {id:'vip',name:'VIP Shopping Event Access',cost:3000,category:'experiences',icon:'star',description:'A seat on the proposed insider guest list.'}
];
const ledger=[];let serial=0;
const addEntry=(date,description,change,note='Illustrative member activity')=>ledger.push({id:++serial,date,description,change,note});
for(let i=0;i<17;i++){
  addEntry(new Date(Date.UTC(2024,i,15,12)).toISOString(),i<7?'Referral — Example qualifying first purchase':'Purchase — Example member order',i<7?500:i<16?450:620);
  addEntry(new Date(Date.UTC(2024,i,20,12)).toISOString(),'Redeemed — Example member perk',i<16?-300:-500);
}
for(const [date,earned,redeemed] of [['2026-01-05',800,600],['2026-01-15',800,600],['2026-01-25',800,600],['2026-02-05',900,570]]){
  addEntry(`${date}T12:00:00Z`,'Purchase — Example qualifying order',earned);
  const redeemDate=new Date(`${date}T12:00:00Z`);redeemDate.setUTCDate(redeemDate.getUTCDate()+3);
  addEntry(redeemDate.toISOString(),'Redeemed — Example member credit',-redeemed);
}
for(const [date,description,change] of [['2026-02-14',"Bonus — Valentine's Day Promo",200],['2026-02-20','Purchase — Order #8791',160],['2026-02-28','Bonus — Double Points Weekend',380],['2026-03-05','Redeemed — $10 Store Credit',-500],['2026-03-10','Purchase — Order #8834',240]])addEntry(`${date}T12:00:00Z`,description,change);
let historyFilter='all',historyPage=1,category='all',sort='low';
const reviewed=new Set();
const reviewProducts=['Canvas tote','Everyday mug','Pocket notebook','Classic tee','Weekend cap'];
const balance=()=>ledger.reduce((sum,row)=>sum+row.change,0);
const earned=()=>ledger.reduce((sum,row)=>sum+Math.max(0,row.change),0);
const redeemed=()=>ledger.reduce((sum,row)=>sum-Math.min(0,row.change),0);
const qualifying=()=>ledger.reduce((sum,row)=>sum+(new Date(row.date).getUTCFullYear()===2026?Math.max(0,row.change):0),0);
const tier=()=>tierData.find(item=>qualifying()>=item.start&&qualifying()<=item.max);
function rows(){
  let running=0;return ledger.map(row=>({...row,balance:running+=row.change})).reverse().filter(row=>historyFilter==='all'||(historyFilter==='earned'?row.change>0:historyFilter==='redeemed'?row.change<0:row.note==='Expired'));
}
function renderHistory(){
  const all=rows(),pages=Math.max(1,Math.ceil(all.length/10));historyPage=Math.min(historyPage,pages);
  const section=all.slice((historyPage-1)*10,historyPage*10),body=$('#history-rows');body.replaceChildren();
  for(const row of section){
    const tr=document.createElement('tr');tr.dataset.transaction=row.id;
    const date=el('td',new Date(row.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}));
    const description=el('td',''),main=el('span','','description'),symbol=el('span','','transaction-icon');symbol.innerHTML=icon(row.change>0?'bag':'gift');main.append(symbol,document.createTextNode(row.description));description.append(main,el('small',row.note,'description-note'));
    tr.append(date,description,el('td',`${row.change>0?'+':'−'}${number(Math.abs(row.change))}`,row.change>0?'positive':'negative'),el('td',number(row.balance)));body.append(tr);
  }
  $('#history-empty').hidden=!!all.length;
  $('#history-count').textContent=all.length?`Showing ${(historyPage-1)*10+1}–${Math.min(historyPage*10,all.length)} of ${all.length} sample transactions`:'Showing 0 of 0 sample transactions';
  $('#history-page').textContent=`${historyPage} / ${pages}`;$('#history-prev').disabled=historyPage===1;$('#history-next').disabled=historyPage===pages;
  document.querySelectorAll('[data-history]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.history===historyFilter)));
}
function renderRewards(){
  const list=rewards.filter(reward=>category==='all'||reward.category===category).sort((a,b)=>(sort==='low'?1:-1)*(a.cost-b.cost));
  $('#reward-grid').innerHTML=list.map(reward=>{
    const missing=Math.max(0,reward.cost-balance());
    return `<article class="reward-card ${reward.featured?'featured':''} ${reward.image?'has-image':''}" data-reward-card="${reward.id}"><span class="reward-icon">${icon(reward.icon)}</span>${reward.featured?'<span class="reward-label">A LITTLE FAVOURITE</span>':''}${reward.image?'<img class="tote-thumb" src="assets/tote.svg" alt="Original cream canvas tote illustration with Elevate wordmark" width="600" height="600">':''}<h3>${reward.name}</h3><p class="reward-description">${reward.description}</p><div class="reward-bottom"><span class="reward-cost">${number(reward.cost)}<small>points</small></span><button type="button" class="redeem-button" data-redeem="${reward.id}" ${missing?'disabled':''} aria-label="${missing?`Need ${number(missing)} more points for ${reward.name}`:`Redeem ${reward.name}`}">${missing?`Need ${number(missing)} more pts`:'Redeem ↗'}</button></div></article>`;
  }).join('');
  document.querySelectorAll('[data-category]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.category===category)));
}
function render(){
  const current=tier(),year=qualifying(),wallet=balance(),progress=Math.min(100,year/6001*100);
  for(const id of ['points-balance','catalog-balance','mobile-points'])document.getElementById(id).textContent=number(wallet);
  $('#year-total').textContent=number(year);$('#qualifying-label').textContent=number(year);
  $('#tier-remaining').textContent=current.name==='Platinum'?'Your highest tier, unlocked.':`${number(6001-year)} qualifying points to Platinum`;
  $('#welcome-progress').setAttribute('aria-valuenow',String(Math.min(year,6001)));$('#welcome-progress>i').style.width=`${progress}%`;
  $('#tier-track>i').style.width=`${progress}%`;$('#tier-track>b').style.left=`${progress}%`;
  $('.gold-chip').innerHTML=`<span aria-hidden="true">◇</span> ${current.name.toUpperCase()} MEMBER`;
  $('#benefits-title').textContent=`Your ${current.name} benefits.`;
  $('#tier-steps').innerHTML=tierData.map(item=>`<article class="tier-card ${current.name===item.name?'active':''}" style="--tier:${item.color}" ${current.name===item.name?'aria-current="step"':''}><span class="tier-icon">${icon(item.icon)}</span><div class="tier-name"><h3>${item.name}</h3>${current.name===item.name?'<span class="tier-check" aria-label="Current tier">✓</span>':''}</div><p class="threshold">${item.range}</p><p class="perk">${item.perk}${item.name==='Bronze'?'':'*'}</p></article>`).join('');
  $('#earned-stat').replaceChildren(document.createTextNode(`${number(earned())} `),el('small','pts'));
  $('#redeemed-stat').replaceChildren(document.createTextNode(`${number(redeemed())} `),el('small','pts'));
  $('#earned-note').textContent=`${number(year)} qualifying points in 2026`;
  const localRedemptions=ledger.filter(row=>row.note==='Local demo redemption').length;
  $('#redeemed-note').textContent=localRedemptions?`${localRedemptions} local demo redemption${localRedemptions===1?'':'s'} this session`:'Last sample: $10 credit · Mar 5';
  $('#next-stat').textContent=wallet>=250?'Ready now':`${number(250-wallet)} pts away`;
  $('#next-note').textContent='$5 Store Credit · 250 points';renderHistory();renderRewards();
}
const dialog=$('#dialog'),content=$('#dialog-content');
function open(title,label='ELEVATE REWARDS · LOCAL DEMO'){
  content.replaceChildren(el('p',label,'eyebrow'));const heading=el('h2',title);heading.id='dialog-title';content.append(heading);if(!dialog.open)dialog.showModal();
}
function note(title,message){open(title);content.append(el('p',message));}
function confirmation(reward){
  open('A little something, just for you.','REDEMPTION REVIEW · NOT A REAL ORDER');
  content.append(el('p',`${reward.name}\n${number(reward.cost)} sample points\nNo payment, store credit, shipping, product, booking or redeemable code will be created.`));
  const total=el('div','','dialog-total');total.append(el('span','Your local balance afterwards'),el('strong',`${number(balance()-reward.cost)} pts`));content.append(total,el('small','Your 2026 qualifying points and tier stay the same. Confirm only to subtract demo points from this session.'));
  const actions=el('div','','dialog-actions'),confirm=el('button','Confirm demo redemption','primary'),cancel=el('button','Keep my points','outline');confirm.id='confirm-redeem';confirm.type='button';cancel.type='button';
  confirm.disabled=balance()<reward.cost;
  confirm.addEventListener('click',()=>{
    if(confirm.disabled||balance()<reward.cost)return;confirm.disabled=true;
    addEntry(new Date().toISOString(),`Local redemption — ${reward.name}`,-reward.cost,'Local demo redemption');historyPage=1;historyFilter='all';render();
    open('Your local perk is recorded.','LOCAL RECEIPT · NOT REDEEMABLE');content.append(el('p',`${reward.name}\n${number(reward.cost)} demo points deducted.\nNew local balance: ${number(balance())} points.\nYour ${tier().name} tier and ${number(qualifying())} qualifying points are unchanged.`),el('small','No order, usable voucher, product shipment or event reservation exists. Refresh resets this sample.'));
  });
  cancel.addEventListener('click',()=>dialog.close());actions.append(confirm,cancel);content.append(actions);
}
$('#reward-grid').addEventListener('click',event=>{const button=event.target.closest('[data-redeem]');if(!button||button.disabled)return;const reward=rewards.find(item=>item.id===button.dataset.redeem);if(reward)confirmation(reward);});
document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.category;renderRewards();}));
$('#sort').addEventListener('change',event=>{sort=event.target.value;renderRewards();});
document.querySelectorAll('[data-history]').forEach(button=>button.addEventListener('click',()=>{historyFilter=button.dataset.history;historyPage=1;renderHistory();}));
$('#history-prev').addEventListener('click',()=>{if(historyPage>1){historyPage--;renderHistory();}});
$('#history-next').addEventListener('click',()=>{historyPage++;renderHistory();});
function download(data,type,filename){
  const url=URL.createObjectURL(new Blob([data],{type})),link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
$('#history-export').addEventListener('click',()=>{
  const quote=value=>`"${String(value).replaceAll('"','""')}"`;
  const lines=[['Date (UTC)','Description','Points','Balance'],...rows().map(row=>[row.date.slice(0,10),row.description,row.change,row.balance])];
  download(lines.map(row=>row.map(quote).join(',')).join('\r\n')+'\r\n','text/csv;charset=utf-8','elevate-points-history.csv');
});
async function copyReferral(){
  try{await navigator.clipboard.writeText($('#referral-link').value);$('#copy-status').textContent='Copied the inactive .example link. No invitation sent or points awarded.';}
  catch{$('#referral-link').focus();$('#referral-link').select();$('#copy-status').textContent='Clipboard unavailable. The example link is selected; copy it manually. No invitation sent.';}
}
$('#copy-referral').addEventListener('click',copyReferral);
$('#share-referral').addEventListener('click',()=>{$('#referrals').scrollIntoView();copyReferral();});
function review(){
  open('Your opinion has a little value.','REVIEW SIMULATOR · NOT A VERIFIED PURCHASE');
  if(reviewed.size===reviewProducts.length){content.append(el('p','All five example products have a local review. No further sample points can be awarded this session.'));return;}
  content.append(el('p','Try a 20–500 character review of a fictional product. Earn 50 local sample points once per product. Nothing is published or sent; March’s archived challenge stays unchanged.'));
  const form=document.createElement('form');form.className='review-form';form.id='review-form';
  const label=el('label','Example product'),select=document.createElement('select');select.id='review-product';select.required=true;
  reviewProducts.filter(name=>!reviewed.has(name)).forEach(name=>select.append(el('option',name)));label.append(select);
  const messageLabel=el('label','Your local sample review'),textarea=document.createElement('textarea');textarea.id='review-text';textarea.minLength=20;textarea.maxLength=500;textarea.required=true;messageLabel.append(textarea);
  const status=el('p','','review-status');status.id='review-status';status.setAttribute('role','status');
  const submit=el('button','Add local review · +50 pts','primary');submit.type='submit';submit.id='review-submit';
  textarea.addEventListener('input',()=>{textarea.setCustomValidity('');status.textContent=`${textarea.value.length} / 500 characters`;});
  form.addEventListener('submit',event=>{
    event.preventDefault();const product=select.value;
    textarea.setCustomValidity(textarea.value.trim().length<20||textarea.value.trim().length>500?'Write 20–500 meaningful characters for this sample.':'');
    if(!form.reportValidity()||reviewed.has(product)||submit.disabled)return;submit.disabled=true;reviewed.add(product);
    addEntry(new Date().toISOString(),`Local review — ${product}`,50,'Local demo review bonus');historyPage=1;historyFilter='all';render();
    open('A small opinion. A little bonus.','LOCAL REVIEW RECEIPT');content.append(el('p',`50 sample points added for ${product}.\nBalance: ${number(balance())} points.\nNothing published or sent. Each example product can award points once per page session.`),el('small','This simulator does not verify ownership or update archived March challenges or fixed example achievements.'));
  });
  form.append(label,messageLabel,status,submit);content.append(form);
}
$('#review-open').addEventListener('click',review);
const challenges=[
  {name:'Weekend Warrior',description:'Make 3 purchases this weekend',points:500,progress:1,total:3,date:'2026-03-16',label:'Mar 16',icon:'shield'},
  {name:'Review Rockstar',description:'Write 5 product reviews',points:300,progress:3,total:5,date:'2026-03-31',label:'Mar 31',icon:'star'},
  {name:'Social Butterfly',description:'Share 2 products on social media',points:200,progress:0,total:2,date:'2026-03-25',label:'Mar 25',icon:'share'}
];
function renderChallenges(){
  $('#challenge-grid').innerHTML=challenges.map(challenge=>{
    const closed=Date.now()>=Date.parse(`${challenge.date}T00:00:00Z`)+86400000,percent=Math.round(challenge.progress/challenge.total*100);
    return `<article class="challenge-card"><div class="challenge-top"><span>${icon(challenge.icon)}</span><small>${closed?'CLOSED EXAMPLE':'EXAMPLE ONLY'}</small></div><h3>${challenge.name}</h3><p>${challenge.description}</p><span class="challenge-points">+${number(challenge.points)} <small>proposed bonus points</small></span><div class="challenge-progress" role="progressbar" aria-label="${challenge.name} sample progress" aria-valuenow="${challenge.progress}" aria-valuemin="0" aria-valuemax="${challenge.total}"><i style="width:${percent}%"></i></div><div class="challenge-footer"><span>${challenge.progress}/${challenge.total} completed · <b>${percent}%</b></span><span>${closed?'Closed':'Ends'} ${challenge.label}, 2026</span></div></article>`;
  }).join('');
}
const badges=[
  ['First Purchase','Your first example order','Jan 15, 2024','bag','#f1e7f8','#aa88c4'],
  ['Loyal Customer','10 or more example purchases','May 2, 2025','heart','#f8e9ed','#c794a8'],
  ['Referral Pro','5 credited example referrals','May 15, 2024','megaphone','#eee8fa','#a18bc5'],
  ['Review Maven','10 historical example reviews','Dec 8, 2025','pencil','#e8f0f3','#94b0bd'],
  ['Big Spender','$500 or more example lifetime spend','Feb 5, 2026','diamond','#f6eddb','#c0a472'],
  ['Early Bird','Within one hour of an example launch','Feb 28, 2026','sunrise','#f8ebdf','#c4a07e'],
  ['Streak Master','Purchase for four consecutive weeks',null,'flame'],
  ['Social Star','Share 10 products',null,'camera'],
  ['Birthday Club','Make a birthday-month purchase',null,'cake']
];
$('#badge-grid').innerHTML=badges.map(([name,description,date,symbol,bg,fg])=>`<button class="badge ${date?'':'locked'}" style="--badge-bg:${bg||'#efebf2'};--badge-fg:${fg||'#c4b8ce'}" data-badge="${name}" aria-label="${name}. ${description}. ${date?`Sample earned date: ${date}`:'Locked example'}"><span class="badge-circle">${icon(symbol)}${date?'':`<span class="lock-mark">${icon('lock')}</span>`}</span><span class="badge-name">${name}</span><span class="badge-tooltip" aria-hidden="true">${name}<br>${description}<br>${date?`Sample earned ${date}`:'Locked · criteria not completed'}</span></button>`).join('');
$('#badge-grid').addEventListener('click',event=>{const button=event.target.closest('[data-badge]');if(!button)return;const [name,description,date]=badges.find(item=>item[0]===button.dataset.badge);note(name,`${description}.\n${date?`Illustrative earned date: ${date}.`:'Locked example. No connected purchase or social-verification service.'}\nAchievement records are fictional and remain separate from local review simulations.`);});
const tripleStart=Date.parse('2026-03-22T00:00:00Z'),tripleEnd=Date.parse('2026-03-25T00:00:00Z'),flashStart=Date.parse('2026-03-28T00:00:00Z');
let challengeDay='';
function promotions(){
  const now=Date.now(),ended=now>=tripleEnd,live=now>=tripleStart&&!ended,seconds=Math.max(0,Math.floor(((live?tripleEnd:tripleStart)-now)/1000));
  const today=new Date().toISOString().slice(0,10);if(today!==challengeDay){challengeDay=today;renderChallenges();}
  const values=ended?[0,0,0]:[Math.floor(seconds/86400),Math.floor(seconds%86400/3600),Math.floor(seconds%3600/60)];
  $('#promo-countdown').innerHTML=values.map((value,index)=>`<div><strong>${String(value).padStart(2,'0')}</strong><small>${['DAYS','HOURS','MINS'][index]}</small></div>`).join('');
  $('#promo-state').textContent=ended?'This March 2026 example has ended.':live?'Within the sample event window. No live promotion is connected.':'Countdown to a fictional event · UTC dates.';
  $('#promo-reminder').disabled=now>=flashStart;
  $('#promo-reminder').innerHTML=`${icon('calendar')} ${now>=flashStart?'Reminder closed':'Download local reminder'}`;
  $('#flash-state').textContent=now>=flashStart?'Past example. No live sale or reminder service.':'Explicit .ics download only. No account or real sale access.';
}
$('#promo-reminder').addEventListener('click',()=>{
  if(Date.now()>=flashStart)return;
  const stamp=new Date().toISOString().replaceAll(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
  download(['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Elevate Concept//Local Example//EN','BEGIN:VEVENT',`UID:${crypto.randomUUID()}@elevate.example`,`DTSTAMP:${stamp}`,'DTSTART;VALUE=DATE:20260328','DTEND;VALUE=DATE:20260329','SUMMARY:Review Elevate example flash sale','DESCRIPTION:Fictional promotion only. No real sale or reservation is connected.','END:VEVENT','END:VCALENDAR',''].join('\r\n'),'text/calendar','elevate-example-reminder.ics');
});
const explanation='This is an original static concept for a fictional loyalty program. Sarah, membership, ledger, earned badges, rates, services and promotions are sample data. Your wallet starts at 4,280 points, lifetime earnings at 12,450 and redemptions at 8,170. Calendar-year qualifying earnings are separately 4,280 for 2026; Platinum begins at 6,001, so the gap is 1,721, not 720. Local redemption subtracts only wallet points; a sample review adds 50 points once for each of five fictional products. All changes reset on refresh. No real account, sign-up, order, email, rewards API, storage, analytics, Instagram, referral attribution or backend is connected. Form text and clipboard actions stay in your browser. Calendar and CSV files are downloaded only when you choose those actions.';
for(const id of ['help-open','member-open','policy-open','privacy-open'])document.getElementById(id).addEventListener('click',()=>note('A clear look behind the perks.',explanation));
$('#reset-open').addEventListener('click',()=>{
  open('Start a fresh local session?');content.append(el('p','This resets local redemptions and review bonuses to the original 47-row sample. No real account or stored data exists.'));
  const actions=el('div','','dialog-actions'),reset=el('button','Reset local demo','primary');reset.id='confirm-reset';reset.addEventListener('click',()=>location.reload());actions.append(reset);content.append(actions);
});
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>note(button.dataset.action==='shop'?'The shop is still a concept.':'Social rewards, honestly explained.',button.dataset.action==='shop'?'The proposed program earns 1 point per $1 spent. No product catalog, payment, purchase verification or checkout is connected here. No points have been awarded.':'No Instagram account or verification service is connected. The proposed 100-point follow bonus cannot be earned here. No social account data is requested or stored, and no points are awarded.')));
$('#join-open').addEventListener('click',()=>note('A membership idea, not a sign-up.','The proposed rewards club is free. This preview collects no registration, email, password or financial information and creates no account. Explore the fictional member dashboard above without signing in.'));
$('#signin-open').addEventListener('click',()=>note('Your sample seat is ready.','No identity or sign-in service is connected. Sarah is a fictional example, not your personal account. No password is requested or session authenticated.'));
$('.dialog-close').addEventListener('click',()=>dialog.close());
function closeMenu(){$('#nav').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');}
$('#menu').addEventListener('click',()=>{const open=$('#nav').classList.toggle('open');$('#menu').setAttribute('aria-expanded',String(open));});
$('#nav').addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
render();renderChallenges();promotions();const timer=setInterval(promotions,1000);window.addEventListener('pagehide',()=>clearInterval(timer));
