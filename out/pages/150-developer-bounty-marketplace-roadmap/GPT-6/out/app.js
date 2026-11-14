const $=s=>document.querySelector(s);
const tranches=[
{allocation:'20%',goal:'Scaffold → build → evaluate → deploy on Stellar Testnet.',items:[
['Framework 1.0: graph kernel, 6 agents, 5 eval suites','Done','End-to-end scaffold, build, eval and testnet-deploy workflow passes.','Green repository CI; clean-checkout npm install and npm test.'],
['CLI + templates','Done','Contracts, frontend, backend and CI/CD scaffold from the documentation alone.','Fresh-environment reproduction.'],
['Testnet thin slice','In progress','Reference Soroban contract builds, tests and deploys to testnet.','Contract ID + transaction hash in data/deployments/testnet.json. Instaward evidence pending.'],
['Fresh-checkout eval suites','Done','npm test passes or skips gracefully.','Test output in CI.']]},
{allocation:'30%',goal:'Expand payments, end-to-end testing and security readiness on testnet.',items:[
['Testnet reference dApp','Pending','Token contract, wallet UI and paid API via x402 are deployed on testnet.','Explorer links, contract ID and transaction hashes in the deployment registry.'],
['End-to-end harness','Pending','Local Stellar, Playwright and Agentic Kit hooks run in CI and locally.','CI logs + badge.'],
['Threat model + monitoring plan','Pending','STRIDE-aligned generated-code, credential, supply-chain and eval-bypass risks; metrics, emissions and triggers.','Repository documents aligned to the Stellar threat-modeling and monitoring templates.'],
['Clean-environment reproducibility + graphify','Pending','A second developer reproduces the workflow from a clean setup.','Reproduction video + knowledge-graph output.']]},
{allocation:'40%',goal:'Release a mainnet-validated reference dApp and production adoption materials.',items:[
['Production release','Pending','v1.0 tag, npm publication and skills registry; npx create-stellar-agentic installs.','npm page + release tag.'],
['Mainnet reference dApp','Pending','Token, wallet and paid endpoint are deployed and activated; paid request works end-to-end.','Explorer links + transaction hashes + demo.'],
['Documentation + onboarding','Pending','A developer reaches a mainnet-validated app from the documentation.','Documentation site + clean-setup run.'],
['Community launch + monitoring','Pending','Adoption kit, contribution guide and monitoring follow the T2 plan.','Repository materials + monitoring dashboard.']]}
];
let active=0,reviewed=new Set();
function render(){
const t=tranches[active];$('#goal').textContent=t.goal;$('#allocation').textContent=t.allocation+' source allocation';
document.querySelectorAll('[data-tranche]').forEach(b=>b.classList.toggle('selected',+b.dataset.tranche===active));
const list=t.items.map((d,i)=>({d,i})).filter(({d})=>(d[0]+' '+d[2]).toLowerCase().includes($('#search').value.toLowerCase())&&($('#status').value==='All statuses'||d[1]===$('#status').value));
$('#count').textContent=list.length+' / '+t.items.length+' deliverables';
$('#deliverables').innerHTML=list.map(({d,i})=>`<article class="deliverable"><span class="status ${d[1].toLowerCase().replace(' ','')}">${d[1].toUpperCase()} · SOURCE</span><h3>${d[0]}</h3><p>${d[2]}</p><button data-item="${i}">Inspect evidence →</button></article>`).join('')||'<p class="empty">No deliverables match this filter.</p>';
}
function inspect(i){
const d=tranches[active].items[i],key=active+'-'+i;
$('#detail').innerHTML=`<p class="eyebrow">TRANCHE ${active+1} / REVIEW GATE</p><h2>${d[0]}</h2><span class="status">${d[1]} · supplied status</span><h3>Success criteria</h3><p>${d[2]}</p><h3>Reviewer verification</h3><p>${d[3]}</p><p class="callout">Evidence is described, not attached or verified in this standalone presentation. No live CI or explorer link is fabricated.</p><label><input id="reviewed" type="checkbox" ${reviewed.has(key)?'checked':''}> I have read this gate (local session only)</label><p class="tiny">This checklist does not mark the deliverable complete.</p>`;
$('#dialog').showModal();$('#reviewed').onchange=()=>{if($('#reviewed').checked)reviewed.add(key);else reviewed.delete(key)};
}
document.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.tranche!==undefined){active=+b.dataset.tranche;$('#search').value='';$('#status').selectedIndex=0;render()}if(b.dataset.item!==undefined)inspect(+b.dataset.item)};
$('#search').oninput=render;$('#status').onchange=render;$('#close').onclick=()=>$('#dialog').close();
$('#review').onclick=()=>{
$('#detail').innerHTML='<p class="eyebrow">REVIEW HANDOFF</p><h2>What is known. What remains.</h2><textarea id="summary" readonly aria-label="Review summary"></textarea><p><button id="copy">Copy review summary</button></p><p class="tiny">Local reading checklist only. Source statuses remain unchanged.</p>';
$('#summary').value='Stellar Forge roadmap snapshot\nT1: 3 done, 1 in progress; testnet evidence pending.\nT2: 4 pending; threat model + monitoring required.\nT3: 4 pending; mainnet launch is planned.\nTargets: day 30 / 90 / 120.\nAllocation listed: 90%; remainder unspecified.\nGates read in this session: '+reviewed.size+'/12.\nNo external evidence independently verified.';
$('#dialog').showModal();$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText($('#summary').value);$('#copy').textContent='Copied'}catch{$('#summary').select();$('#copy').textContent='Select and copy'}}};
render();
