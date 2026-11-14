export const ACTORS={you:"You · builder",mira:"Mira · sample maintainer"},SKILLS=["TypeScript","Rust","Frontend","Documentation"],ASSETS=["USDC","XLM"],DAY=86400000;
export const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
export const reward=b=>`${b.amount.toLocaleString("en-US")} ${b.asset}`;
export function fixture(now=Date.now()){
  return [
    ["wallet-flow","Upgrade the wallet connection flow","atlas-labs/wallet-kit","Atlas Labs","TypeScript",3500,"USDC","open",12,"Make wallet connection resilient across reconnects and network changes."],
    ["cli-errors","Give the CLI better error messages","orbit-tools/stellar-cli","Orbit Tools","Rust",14000,"XLM","open",8,"Turn opaque command failures into actionable, well-tested diagnostics."],
    ["indexer-view","Build a contract activity explorer","nova-labs/indexer","Nova Labs","Frontend",5000,"XLM","open",18,"Create an accessible activity view with useful filtering and empty states."],
    ["docs-recipes","Write the missing Soroban recipes","ledger-works/recipes","Ledger Works","Documentation",750,"USDC","open",10,"Explain common contract workflows through small, reproducible examples."],
    ["sdk-tests","Cover transaction builder edge cases","atlas-labs/transaction-sdk","Atlas Labs","TypeScript",800,"USDC","claimed",15,"Add focused tests for transaction construction and invalid inputs."],
    ["event-parser","Make event parsing predictable","orbit-tools/events","Orbit Tools","Rust",950,"USDC","submitted",20,"Document and test event decoding across supported payload shapes."]
  ].map(([id,title,repo,project,skill,amount,asset,status,days,description])=>({id,title,repo,project,skill,amount,asset,status,deadline:new Date(new Date(now+days*DAY).setUTCHours(23,59,59,999)).toISOString(),creator:"mira",developer:status==="claimed"?"you":status==="submitted"?"rin":null,description,requirements:["Keep the public API compatible.","Include focused tests and a short implementation note."],criteria:["Document the intended behavior.","Show reproducible checks for the changed behavior.","Include a pull request URL for human review."],proof:status==="submitted"?`https://github.com/${repo}/pull/42`:"",audit:[`Loaded fictional ${status} fixture; no funding or chain activity.`]}));
}
export function validRepo(repo){return typeof repo==="string"&&/^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,38}\/[a-zA-Z0-9][a-zA-Z0-9_.-]{0,99}$/.test(repo);}
export function proofUrl(value,repo){
  try{const u=new URL(String(value).trim());if(u.protocol!=="https:"||u.hostname!=="github.com"||u.port||u.username||u.password||u.search||u.hash)throw Error();const parts=u.pathname.match(/^\/([^/]+\/[^/]+)\/pull\/([1-9]\d*)\/?$/);if(!parts||parts[1].toLowerCase()!==repo.toLowerCase())throw Error();return `https://github.com/${repo}/pull/${parts[2]}`;}catch{throw Error("Use an HTTPS GitHub pull request URL in the exact sample repository, with no query or fragment. This checks URL shape only.");}
}
export function createBounty(input,actor,now=Date.now()){
  if(!Object.hasOwn(ACTORS,actor))throw Error("Choose a demo identity.");
  const title=String(input.title??"").trim(),description=String(input.description??"").trim(),repo=String(input.repo??"").trim(),criteria=String(input.criteria??"").split("\n").map(v=>v.trim()).filter(Boolean),amount=Number(input.amount),date=String(input.date??""),deadline=Date.parse(date+"T23:59:59.999Z");
  if(title.length<8||title.length>80||description.length<20||description.length>600)throw Error("Use an 8–80 character title and a 20–600 character description.");
  if(!validRepo(repo))throw Error("Use an owner/repository pair with letters, numbers, dots, underscores or hyphens.");
  if(!ASSETS.includes(input.asset)||!Number.isSafeInteger(amount)||amount<1||amount>100000)throw Error("Use 1–100,000 whole units of XLM or USDC.");
  if(!SKILLS.includes(input.skill)||!criteria.length||criteria.length>5||criteria.some(v=>v.length>160))throw Error("Choose a skill and add 1–5 acceptance criteria, up to 160 characters each.");
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(deadline)||new Date(deadline).toISOString().slice(0,10)!==date||date<=new Date(now).toISOString().slice(0,10)||date>new Date(now+60*DAY).toISOString().slice(0,10))throw Error("Choose a UTC deadline from tomorrow through 60 days ahead.");
  if(typeof input.id!=="string"||!input.id)throw Error("A local sample ID is required.");
  return {id:input.id,title,description,repo,criteria,amount,asset:input.asset,skill:input.skill,creator:actor,developer:null,deadline:new Date(deadline).toISOString(),status:"draft",project:"Your local project",requirements:["Review these fictional requirements with the sample owner."],proof:"",audit:["Local draft created; no deposit, wallet or contract."]};
}
export function transition(b,action,actor,proof="",now=Date.now()){
  if(!Object.hasOwn(ACTORS,actor))throw Error("Unknown demo identity.");
  const owner=b.creator===actor,live=Date.parse(b.deadline)>now;
  const rules={open:owner&&b.status==="draft"&&live,claim:!owner&&b.status==="open"&&live,submit:b.status==="claimed"&&b.developer===actor&&live,approve:owner&&b.status==="submitted"&&live,complete:owner&&b.status==="approved"&&live,cancel:owner&&b.status==="open",refund:owner&&["cancelled","expired"].includes(b.status),expire:b.status==="open"&&!live};
  if(!rules[action])throw Error("That local transition is unavailable for this identity, status or deadline.");
  const status={open:"open",claim:"claimed",submit:"submitted",approve:"approved",complete:"completed",cancel:"cancelled",refund:"refunded",expire:"expired"}[action];
  return {...b,status,developer:action==="claim"?actor:b.developer,proof:action==="submit"?proofUrl(proof,b.repo):b.proof,audit:[...b.audit,`${ACTORS[actor]} simulated ${action}; no chain transaction or fund movement.`]};
}
export function browse(bounties,{query="",skill="",asset="",state="open",sort="deadline"}={}){
  const q=query.trim().toLowerCase(),selected=bounties.filter(b=>(state==="all"||state==="progress"&&["claimed","submitted","approved"].includes(b.status)||state===b.status)&&(!skill||b.skill===skill)&&(!asset||b.asset===asset)&&(!q||`${b.title} ${b.project} ${b.repo} ${b.description} ${b.skill}`.toLowerCase().includes(q)));
  return selected.toSorted(sort==="title"?(a,b)=>a.title.localeCompare(b.title):sort==="newest"?(a,b)=>b.deadline.localeCompare(a.deadline):(a,b)=>a.deadline.localeCompare(b.deadline));
}
