const articles=[
  {id:'invest',category:'Investing',title:"How to Start Investing With $100: A Complete Beginner's Guide",minutes:12,art:'invest',text:['Start with a goal and a time horizon. Money needed soon may require a different home than money intended for decades from now. Investments can lose value; the amount you start with does not remove that risk.','Before choosing an account, understand its fees, eligibility, tax treatment and withdrawal rules. Learn what diversification means and compare costs carefully. No account, fund, security or broker is recommended in this preview.','A small start can be a learning step, not a promise of wealth. This is general education with US account references, not a personalized plan or a documented investment experience.']},
  {id:'budget',category:'Budgeting',title:'The 50/30/20 Budget Rule Is Outdated — Try This Instead',minutes:8,art:'budget',text:['The 50/30/20 rule can be a useful starting sketch: 50% of take-home income for needs, 30% for wants and 20% for savings and extra debt payments. It is not a standard every household can or should meet.','Try a needs-first plan instead. Write down essential bills, minimum debt payments, irregular annual costs and a realistic buffer. Then decide how to divide what is left. If essential costs exceed income, a percentage rule alone will not solve the shortfall.','Our local calculator shows the conventional split so you can understand it, not to label your choices as right or wrong. Download the CSV to make a plan that reflects your actual life.']},
  {id:'debt',category:'Debt',title:"I Paid Off $47,000 in Student Loans in 18 Months — Here's My Exact Strategy",minutes:15,art:'debt',text:['This first-person headline is a fictional concept, not a verified borrower’s story. Paying $47,000 of principal over 18 months would require about $2,611.11 a month before interest. That level of spare income is not realistic for every household.','List balances, interest rates and required minimums. After minimum payments, snowball targets the smallest balance; avalanche targets the highest APR. Compare your cash flow and loan terms before choosing an approach.','The local two-debt calculator uses fixed monthly payments and monthly interest with no fees. It provides estimates, not lender payoff quotes or student-loan-program advice.']},
  {id:'savings',category:'Budgeting',title:'5 High-Yield Savings Accounts Actually Worth Opening in 2026',minutes:6,art:'savings',text:['No five banks have been reviewed here. The requested headline is preserved as an archive concept; this short educational preview is a comparison checklist, not a current product ranking.','Check five things: the applicable deposit-insurance scheme and coverage limits, variable APY, fees, minimum balance requirements, and withdrawal or transfer access. Read the actual institution’s current disclosures.','Rates and availability change. A high advertised APY is only one part of a savings decision. This site has no affiliate links or banking connection.']},
  {id:'ira',category:'Investing',title:'Roth IRA vs Traditional IRA: Which One Wins? (We Did the Math)',minutes:10,art:'ira',text:['There is no universal winner. These US retirement accounts differ in how contributions and withdrawals may be taxed. Eligibility, deduction rules, contribution limits and withdrawal restrictions depend on your situation and current law.','A purely illustrative comparison: a hypothetical $1,000 pre-tax amount at a 20% tax rate leaves $800 after tax. Tax timing, investment returns and future tax rates can change a comparison substantially. This is not a full IRA projection.','The headline is a fictional editorial concept. No individualized tax calculation or account recommendation has been completed. Consult current official guidance and a qualified tax professional.']},
  {id:'hustle',category:'Earning More',title:'How I Turned a $200/Month Side Hustle Into a $4,000/Month Business',minutes:12,art:'hustle',text:['This is a fictional headline, not an earnings claim. A business’s monthly revenue is not the same as profit or take-home pay. Costs, taxes, unpaid time and uneven demand matter.','A useful first step is to record hours and direct expenses for a small project. Test whether a customer is willing to pay before assuming a larger market exists. Keep personal and business records clear.','No outcome is guaranteed, and no course, paid program or financial product is sold here.']},
  {id:'cards',category:'Budgeting',title:'The Only 3 Credit Cards You Need (and When to Use Each)',minutes:7,art:'cards',text:['You may need no credit cards, one, or a different arrangement entirely. Three is a headline concept, not a recommendation. No named cards or issuers are ranked here.','Compare APR, fees, repayment terms, protections and your ability to pay in full. Rewards can be outweighed by interest and fees. A simple system you can manage may matter more than an extra perk.','This is general education, with no application links, eligibility promise, affiliate commission or personalized credit advice.']}
];
const byId=new Map(articles.map(a=>[a.id,a]));
const latestIds=['budget','debt','savings','ira','hustle','cards'];
let topic='All',search='';
const money=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'});
const reader=document.querySelector('#reader'), readerContent=document.querySelector('#reader-content');
function node(tag,value,className){const element=document.createElement(tag);element.textContent=value;if(className)element.className=className;return element;}
function cover(kind){
  const palettes={budget:['#e4eddd','#8da87d'],debt:['#efe9d4','#b69d59'],savings:['#e0eae7','#699488'],ira:['#e3e8f1','#8a9ebc'],hustle:['#e8e2d9','#aa9271'],cards:['#e8e1eb','#a28da9'],invest:['#e1edde','#85ab77']};
  const [background,accent]=palettes[kind];
  const motifs={
    budget:'<g transform="translate(130 22) rotate(8 65 80)"><rect width="115" height="160" rx="13" fill="#fffef7" stroke="#77896c"/><rect x="9" y="18" width="97" height="126" rx="3" fill="#f2f5ed"/><text x="22" y="44" font-size="10">MY MONTHLY PLAN</text><path d="M20 62h75m-75 23h75m-75 23h75m-75 23h75m-43-69v69" stroke="#d0dcc9"/><path d="M66 70h21m-21 23h21m-21 23h21" stroke="#94b086" stroke-width="4"/></g><circle cx="103" cy="137" r="24" fill="#b9c9a8"/><path d="m92 138 8 8 16-19" stroke="#fff" fill="none" stroke-width="3"/>',
    debt:'<rect x="75" y="45" width="230" height="120" rx="8" fill="#fffdf4"/><text x="96" y="75" font-size="11">A LITTLE MORE FREEDOM</text><path d="M97 118h184" stroke="#e6dfc7" stroke-width="14" stroke-linecap="round"/><path d="M97 118h142" stroke="#b09a57" stroke-width="14" stroke-linecap="round"/><text x="98" y="149" font-size="10">ONE PAYMENT AT A TIME</text><path d="m69 31 5 12m233-1 10-9m-4 139 9 8M58 156l12-6" stroke="#bda45f" stroke-width="3"/>',
    savings:'<path d="m84 82 106-45 106 45Z" fill="#779c8b"/><rect x="86" y="85" width="208" height="10" rx="3" fill="#fffef7"/><path d="M109 99v53m54-53v53m54-53v53m54-53v53" stroke="#a3baad" stroke-width="17"/><path d="M83 159h215v10H83Z" fill="#779c8b"/><circle cx="190" cy="67" r="10" fill="#dce7dc"/><text x="186" y="72" font-size="14">$</text>',
    ira:'<rect x="66" y="36" width="114" height="142" rx="7" fill="#fffdf6"/><rect x="201" y="36" width="114" height="142" rx="7" fill="#fffdf6"/><text x="100" y="63" font-size="11">ROTH</text><text x="216" y="63" font-size="10">TRADITIONAL</text><path d="M91 90h63m-63 23h63m-63 23h63m71-46h63m-63 23h63m-63 23h63" stroke="#b4c3d5" stroke-width="6"/><circle cx="190" cy="108" r="19" fill="#8099b4"/><text x="179" y="112" font-size="10" fill="white">OR?</text>',
    hustle:'<rect x="47" y="137" width="286" height="12" rx="3" fill="#ac9272"/><path d="M66 149v39m247-39v39" stroke="#9e8e79" stroke-width="5"/><rect x="116" y="58" width="137" height="83" rx="6" fill="#5c6e65"/><rect x="124" y="65" width="121" height="65" rx="2" fill="#e8eee1"/><path d="m141 113 24-18 21 6 36-22" stroke="#90ab7e" stroke-width="4" fill="none"/><path d="M105 142h160" stroke="#7f8b80" stroke-width="7"/><path d="M285 92v45m-1-10q-24-24-15-34 12 0 15 34m2-18q20-26 27-15 0 12-27 15" fill="#8ca17c" stroke="#8ca17c" stroke-width="3"/><path d="M270 125h30l-4 13h-23Z" fill="#d0bfa1"/>',
    cards:'<g transform="translate(83 53) rotate(-10 80 50)"><rect width="169" height="103" rx="9" fill="#6e7667"/><rect x="18" y="25" width="24" height="19" rx="4" fill="#d6caa9"/><text x="18" y="78" fill="#e0e5d7" font-size="10">KEEP IT SIMPLE</text></g><g transform="translate(143 74) rotate(8 80 50)"><rect width="169" height="103" rx="9" fill="#a899ab"/><rect x="18" y="25" width="24" height="19" rx="4" fill="#e5d7bc"/><text x="18" y="78" fill="#fff6ec" font-size="10">KNOW YOUR TERMS</text></g>',
    invest:'<rect x="70" y="40" width="240" height="130" rx="8" fill="#fffdf4"/><text x="93" y="74" font-size="12">START SMALL. LEARN FIRST.</text><path d="m95 143 37-25 28 8 39-34 29 12 51-35" stroke="#6b9b67" fill="none" stroke-width="4"/><path d="M267 69h12v13" stroke="#6b9b67" fill="none" stroke-width="4"/>'
  };
  return `<svg viewBox="0 0 380 214" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="380" height="214" fill="${background}"/><circle cx="324" cy="22" r="80" fill="${accent}" opacity=".08"/><circle cx="35" cy="204" r="75" fill="${accent}" opacity=".08"/><g font-family="Arial,sans-serif" fill="#62715f">${motifs[kind]}</g></svg>`;
}
function render(){
  const list=(topic==='Investing'?['invest','ira']:latestIds).map(id=>byId.get(id)).filter(a=>(topic==='All'||a.category===topic)&&`${a.title} ${a.category}`.toLowerCase().includes(search.toLowerCase()));
  document.querySelector('#article-grid').innerHTML=list.map(a=>`<article class="article"><button class="article-visual" data-read="${a.id}" aria-label="Read ${a.title}">${cover(a.art)}</button><div class="article-copy"><span class="badge">${a.category.toUpperCase()}</span><h3><button data-read="${a.id}">${a.title}</button></h3><p class="article-meta">${a.minutes} MIN READ LABEL · SHORT PREVIEW <span aria-hidden="true">↗</span></p></div></article>`).join('');
  document.querySelector('#article-status').textContent=`${list.length} original short previews${topic!=='All'?` · ${topic}`:''}${search?` · “${search}”`:''}`;
  document.querySelector('#article-empty').hidden=!!list.length;
  document.querySelectorAll('.article-filters [data-topic]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.topic===topic)));
}
function reset(){topic='All';search='';render();}
function readArticle(id){
  const article=byId.get(id);
  readerContent.replaceChildren(node('span',article.category.toUpperCase(),'badge'),node('h2',article.title),node('small',`By Sarah Mitchell · ${article.minutes} min label from the brief · Original short preview`));
  article.text.forEach(paragraph=>readerContent.append(node('p',paragraph)));
  readerContent.append(node('p','Fictional educational publication. Figures and first-person experiences are illustrative. No financial, tax, investment or legal advice; no guarantees or current product ranking.','reader-note'));
  if(id==='debt'){const button=node('button','Compare two debts ↗','text-link');button.addEventListener('click',()=>{reader.close();openDebt();});readerContent.append(button);}
  reader.showModal();
}
function parseIncome(value){
  const cleaned=value.trim();
  if(!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(cleaned))return null;
  const amount=Number(cleaned.replaceAll(',',''));
  return amount>0&&amount<=1000000?Math.round(amount*100):null;
}
function calculateBudget(){
  const cents=parseIncome(document.querySelector('#income').value);
  const valid=cents!==null;
  document.querySelector('#income').setAttribute('aria-invalid',String(!valid));
  document.querySelector('.donut').classList.toggle('invalid',!valid);
  const needs=valid?Math.round(cents*.5):0,wants=valid?Math.round(cents*.3):0,savings=valid?cents-needs-wants:0;
  for(const [id,value] of [['income-total',cents],['needs',needs],['wants',wants],['savings',savings]])document.getElementById(id).textContent=valid?money.format(value/100):'—';
  document.querySelector('#budget-status').textContent=valid?'Illustrative split. Rounded allocations add up exactly to your income.':'Enter a positive USD amount up to $1,000,000 with no more than 2 decimals.';
  document.querySelector('.donut').setAttribute('aria-label',valid?`Needs ${money.format(needs/100)}, wants ${money.format(wants/100)}, savings ${money.format(savings/100)}. Rounded 50/30/20 illustration.`:'No budget calculated: enter a valid income.');
}
function payoff(debts,extra,method){
  const loans=debts.map(debt=>({...debt}));
  const payment=loans.reduce((sum,debt)=>sum+debt.minimum,0)+extra;
  let interest=0,months=0;
  while(loans.some(loan=>loan.balance>0)&&months<600){
    months++;
    let remaining=payment;
    for(const loan of loans){
      if(!loan.balance)continue;
      const charge=Math.round(loan.balance*loan.rate/1200);
      loan.balance+=charge;interest+=charge;
      const paid=Math.min(loan.minimum,loan.balance);
      loan.balance-=paid;remaining-=paid;
    }
    const active=loans.filter(loan=>loan.balance>0).sort((a,b)=>method==='snowball'?a.balance-b.balance:b.rate-a.rate||a.balance-b.balance);
    for(const loan of active){const paid=Math.min(remaining,loan.balance);loan.balance-=paid;remaining-=paid;}
  }
  return {months,interest,complete:loans.every(loan=>loan.balance===0)};
}
function openDebt(){document.querySelector('#debt-dialog').showModal();document.querySelector('#debt-result').replaceChildren();}
function showPayoff(form){
  if(!form.reportValidity())return;
  const value=name=>Number(form.elements[name].value);
  const debts=['a','b'].map(prefix=>({balance:Math.round(value(prefix+'Balance')*100),rate:value(prefix+'Rate'),minimum:Math.round(value(prefix+'Minimum')*100)}));
  const extra=Math.round(value('extra')*100);
  const result=document.querySelector('#debt-result');result.replaceChildren();
  const comparisons=node('div','','debt-comparison');
  for(const method of ['snowball','avalanche']){
    const calculation=payoff(debts,extra,method);
    const box=node('div','');
    box.append(node('h3',method==='snowball'?'Snowball':'Avalanche'),node('small',method==='snowball'?'Smallest balance first':'Highest APR first'),node('p',calculation.complete?`${calculation.months} months · ${money.format(calculation.interest/100)} interest`:'No payoff within 600 months. Increase the payment or review the terms.'));
    comparisons.append(box);
  }
  result.append(comparisons,node('p',`Fixed monthly budget: ${money.format((debts.reduce((sum,debt)=>sum+debt.minimum,0)+extra)/100)}. Estimates assume payments at month end, starting next month.`,'debt-summary'));
}
const files={
  budget:{name:'monthly-budget-template.csv',content:'Category,Planned USD,Actual USD,Difference USD\nHousing,0,0,=B2-C2\nFood,0,0,=B3-C3\nTransport,0,0,=B4-C4\nInsurance,0,0,=B5-C5\nMinimum debt payments,0,0,=B6-C6\nWants,0,0,=B7-C7\nSavings and extra debt payments,0,0,=B8-C8\nTotal,=SUM(B2:B8),=SUM(C2:C8),=B9-C9\n'},
  networth:{name:'net-worth-tracker.csv',content:'Monthly snapshot USD,Amount USD\nCash and savings,0\nInvestments,0\nProperty and other assets,0\nTotal assets,=SUM(B2:B4)\nLoans,0\nCredit card balances,0\nOther liabilities,0\nTotal liabilities,=SUM(B6:B8)\nNet worth,=B5-B9\n\nInstructions,Enter positive balances and save one copy each month\n'}
};
function download(kind){
  const file=files[kind],url=URL.createObjectURL(new Blob([file.content],{type:'text/csv;charset=utf-8'}));
  const anchor=document.createElement('a');anchor.href=url;anchor.download=file.name;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  document.querySelector('#download-status').textContent=`Downloaded ${file.name}. Import the CSV into your spreadsheet app; no data was uploaded.`;
}
const infos={
  'Our story':'Penny Wise is a fictional publication imagined as a kinder introduction to money. Sarah Mitchell is an illustrated character, not a real adviser. Neither the professional credentials nor the readership and press claims from the brief have been verified or asserted as fact.',
  'Contact':'No message service is connected. This static concept does not collect contact details, account balances or support requests.',
  'Advertise':'No advertising inventory, sponsors or commercial agreements exist in this fictional concept. Audience numbers are sample figures from the brief.',
  'Privacy':'Income, debts and searches are processed only in this page’s memory. Nothing is sent to a server, analytics, a bank or an email provider. Downloaded CSVs stay on your device. Refreshing clears inputs and previews; keep downloaded files private.',
  'Editorial guidelines':'Original short educational previews, not verified reporting. Sample headlines are preserved from the prompt, with fictional experiences, missing product research and credential limitations disclosed. No current bank rankings, investment performance forecasts or personal advice are supplied.',
  'How we make money':'This static concept earns no affiliate commissions, sells no products, and contains no paid placements or tracking. A proposed business model is not implemented.',
  'Social channels':'No real profiles, audiences or social accounts are connected to this fictional site.',
  'RSS feed':'A live publishing or RSS service has not been implemented. All available local article previews can be opened from the homepage.',
  'Investment quiz':'No risk assessment or personalized investment recommendation is provided. Consider your time horizon, need for access, capacity for loss and fees. A qualified professional can help with your individual circumstances.'
};
document.addEventListener('click',event=>{
  const article=event.target.closest('[data-read]');if(article){readArticle(article.dataset.read);return;}
  const filter=event.target.closest('[data-topic]');if(filter){topic=filter.dataset.topic;search='';render();document.querySelector('#nav').classList.remove('open');document.querySelector('#menu').setAttribute('aria-expanded','false');document.querySelector('#articles').scrollIntoView();return;}
  const resource=event.target.closest('[data-download]');if(resource){download(resource.dataset.download);return;}
  const info=event.target.closest('[data-info]');if(info){readerContent.replaceChildren(node('p','PENNY WISE · CONCEPT NOTE','eyebrow'),node('h2',info.dataset.info),node('p',infos[info.dataset.info]));reader.showModal();}
});
document.querySelectorAll('.close').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
document.querySelector('#menu').addEventListener('click',()=>{const open=document.querySelector('#nav').classList.toggle('open');document.querySelector('#menu').setAttribute('aria-expanded',String(open));});
document.querySelectorAll('#nav a').forEach(link=>link.addEventListener('click',()=>{document.querySelector('#nav').classList.remove('open');document.querySelector('#menu').setAttribute('aria-expanded','false');}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){document.querySelector('#nav').classList.remove('open');document.querySelector('#menu').setAttribute('aria-expanded','false');}});
document.querySelector('#open-search').addEventListener('click',()=>document.querySelector('#search-dialog').showModal());
document.querySelector('#search-form').addEventListener('submit',event=>{event.preventDefault();search=document.querySelector('#search').value.trim();topic='All';render();document.querySelector('#search-dialog').close();document.querySelector('#articles').scrollIntoView();});
for(const id of ['all-articles','clear-search','view-all'])document.getElementById(id).addEventListener('click',reset);
document.querySelector('#income').addEventListener('input',calculateBudget);
document.querySelector('#signup').addEventListener('submit',event=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;document.querySelector('#signup-status').textContent=`Preview ready for ${event.currentTarget.elements.email.value.trim()}. No subscription created or email sent.`;event.currentTarget.reset();});
document.querySelector('#open-debt').addEventListener('click',openDebt);
document.querySelectorAll('.debt-link').forEach(button=>button.addEventListener('click',openDebt));
document.querySelector('#debt-form').addEventListener('submit',event=>{event.preventDefault();showPayoff(event.currentTarget);});
document.querySelector('#debt-form').addEventListener('input',()=>document.querySelector('#debt-result').replaceChildren());
const mobile=matchMedia('(max-width:600px)');
function footerLayout(){document.querySelectorAll('.footer-grid details').forEach(detail=>detail.open=!mobile.matches);}
mobile.addEventListener('change',footerLayout);
footerLayout();render();calculateBudget();
