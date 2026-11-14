export const esc=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const commands=[
  {name:"/summary",label:"The ticket, without the digging",icon:"file"},
  {name:"/suggest",label:"Start with a few quick checks",icon:"bulb"},
  {name:"/next",label:"Find the next sensible step",icon:"arrow"},
  {name:"/similar",label:"See what worked before",icon:"search"},
  {name:"/config",label:"Review attached devices",icon:"device"},
  {name:"/draft",label:"Prepare a customer response",icon:"mail"},
  {name:"/escalate",label:"Build a clear handoff",icon:"up"},
  {name:"/5whys",label:"Separate facts from hypotheses",icon:"branch"},
  {name:"/refresh",label:"Clear this ticket’s local chat",icon:"refresh"}
];
export const sampleDate="2026-11-12T12:00:00Z";
export const tickets=[
  {id:"TW-4821",title:"Studio printer shows offline after network update",company:"Juniper Works",status:"Investigating",priority:"Normal",queue:"Service desk",device:"PRN-STUDIO-2",config:"OfficePrint 410 · documentation-only IP 192.0.2.34 · saved queue uses this address",notes:[
    {id:"N1",time:"09:12",type:"Customer note",text:"The Studio 2 printer began showing offline after yesterday’s network maintenance. Other network services appear available."},
    {id:"N2",time:"09:26",type:"Technician note",text:"Saved print queue points to 192.0.2.34. An onsite sample test page reports 192.0.2.81. Both addresses are fictional documentation addresses."},
    {id:"N3",time:"09:41",type:"Internal note",text:"No changes made. Asked the onsite contact to verify the current address and whether an approved DHCP reservation exists."},
    {id:"N4",time:"10:05",type:"Handoff note",text:"Awaiting onsite confirmation. Address mismatch is a working hypothesis; root cause and resolution are not confirmed."}
  ]},
  {id:"TW-4790",title:"VPN repeatedly prompts after a password change",company:"Juniper Works",status:"Closed",priority:"Normal",queue:"Service desk",device:"LAP-SAMPLE-7",config:"Managed sample laptop · approved VPN client · fictional device inventory",notes:[
    {id:"N1",time:"Yesterday · 14:08",type:"Customer note",text:"VPN sign-in prompt returned repeatedly following an account password change."},
    {id:"N2",time:"Yesterday · 14:24",type:"Technician note",text:"With customer approval, signed out of the approved VPN client, then signed in again. No credentials were recorded in the ticket."},
    {id:"N3",time:"Yesterday · 14:39",type:"Resolution note",text:"Customer confirmed a stable VPN connection after reauthentication. Closed with consent; monitor if symptoms return."}
  ]}
];
export const pastTickets=[
  {id:"TW-4692",company:"Juniper Works",date:"2026-11-04T10:00:00Z",kind:"printer",title:"Print queue retained an old device address",resolution:"Confirmed address ownership, then updated the queue through the approved change process. Test print passed.",scope:"Company history"},
  {id:"TW-4510",company:"Juniper Works",date:"2026-09-30T10:00:00Z",kind:"printer",title:"Reservation missing after a network change",resolution:"Network team confirmed and restored the approved reservation; onsite technician verified printing.",scope:"Company history"},
  {id:"TW-4755",company:"Cedar Sample Co.",date:"2026-11-08T10:00:00Z",kind:"printer",title:"Printer hostname and queue target differed",resolution:"Verified the live device identity before aligning the saved queue target. This is a comparison, not a diagnosis.",scope:"Global sample history"},
  {id:"TW-4411",company:"Cedar Sample Co.",date:"2026-10-10T10:00:00Z",kind:"printer",title:"Older global record outside the window",resolution:"Excluded by the 14-day global window.",scope:"Global sample history"},
  {id:"TW-4738",company:"Juniper Works",date:"2026-11-06T10:00:00Z",kind:"vpn",title:"VPN session expired after account changes",resolution:"Customer-approved sign-out and sign-in refreshed the client session. Customer verified connectivity.",scope:"Company history"}
];
export function similarTickets(ticket,now=Date.parse(sampleDate)){
  const kind=ticket.id==="TW-4821"?"printer":"vpn",day=86400000;
  return pastTickets.filter(p=>p.kind===kind&&Date.parse(p.date)<=now&&now-Date.parse(p.date)<=(p.company===ticket.company?90:14)*day).sort((a,b)=>(a.company!==ticket.company)-(b.company!==ticket.company)||Date.parse(b.date)-Date.parse(a.date));
}
export function suggestions(input){return input.startsWith("/")?commands.filter(c=>c.name.startsWith(input.toLowerCase().trim())):[];}
export function reserveReply(times,now){const recent=times.filter(t=>Number.isFinite(t)&&t>now-60000&&t<=now);return recent.length>=30?{allowed:false,times:recent,retryAfterMs:Math.max(1,recent[0]+60000-now)}:{allowed:true,times:[...recent,now],retryAfterMs:0};}
export function markdownHtml(value){
  let list=false,out="";
  for(const line of esc(value).split("\n")){
    const inline=line.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>");
    if(line.startsWith("- ")){if(!list){out+="<ul>";list=true;}out+=`<li>${inline.slice(2)}</li>`;continue;}
    if(list){out+="</ul>";list=false;}if(line.startsWith("## "))out+=`<h4>${inline.slice(3)}</h4>`;else if(line.trim())out+=`<p>${inline}</p>`;
  }return out+(list?"</ul>":"");
}
export function replyFor(input,ticket){
  if(typeof input!=="string"||!input.trim()||input.length>1200)throw Error("Use a question or command of 1–1,200 characters.");
  if(!tickets.includes(ticket))throw Error("Choose an included fictional ticket.");
  let command=input.trim().toLowerCase(),matched=false;
  if(!command.startsWith("/")){
    const rules=[[/similar|past|worked before/,"/similar"],[/config|device|address|printer/,"/config"],[/draft|reply|customer response/,"/draft"],[/escalat|handoff/,"/escalate"],[/why|root cause/,"/5whys"],[/next|who.*contact/,"/next"],[/suggest|check|troubleshoot/,"/suggest"],[/summar|status|resolv|what happened/,"/summary"]];
    const rule=rules.find(([r])=>r.test(command));if(rule){command=rule[1];matched=true;}
  }
  if(command==="/refresh")return{action:"refresh"};
  const closed=ticket.status==="Closed",sources=closed?["N1","N2","N3"]:["N1","N2","N3","N4"];
  const mismatch="The saved queue and the onsite sample test page show different addresses. This is a working hypothesis, not a verified root cause.";
  const bodies={
    "/summary":closed?"## Issue\nRepeated VPN prompts followed an account password change.\n## Recorded resolution\nWith customer approval, the technician signed out and back in to the approved client. The customer confirmed a stable connection.\n## Current status\n**Closed with consent.** Monitor if symptoms return.":`## Issue\nThe Studio 2 printer was reported offline after network maintenance.\n## What the notes show\n${mismatch}\n## Current status\n**Investigating.** Awaiting onsite confirmation. No changes or confirmed resolution are recorded.`,
    "/suggest":closed?"## If the issue returns\n- Confirm the exact symptom with the customer.\n- Check the approved client session state; obtain consent before reauthentication.\n- Record what changed and whether connectivity is stable.\nThese are sample checks, not actions performed by this demo.":"## Start with evidence\n- Ask the onsite contact to confirm the current printer identity and test-page address.\n- Compare that result with the saved queue and approved inventory.\n- Ask the network team to verify reservation history before proposing changes.\n**No changes have been made.** These are sample checks, not a diagnosis.",
    "/next":closed?"## The next sensible step\nThe customer confirmed recovery. Keep the recorded resolution available, and reopen through the normal service process if symptoms return. This demo cannot update tickets.":"## The next sensible step\nWait for the requested onsite address confirmation. Then ask the network owner to compare it with the approved reservation.\n- Owner: sample onsite contact + network team.\n- Gate: verify device identity before any change.\n- Escalate if the mismatch cannot be explained.\n**Suggested only.** This demo cannot contact anyone or update the ticket.",
    "/config":`## Attached configuration\n**${ticket.device}**\n${ticket.config}\n## Context\n${closed?"The notes describe a client-session issue; no hardware fault is recorded.":mismatch}\nThese are fictional inventory details, not a live device scan.`,
    "/draft":closed?"## Unsent customer draft\nThanks for working with us. You confirmed that the VPN connection remained stable after signing back in to the approved client. We have recorded the resolution. Please contact the service desk if the prompts return.\n**Review before use. Nothing has been sent.**":"## Unsent customer draft\nThanks for your patience. We are checking the difference between the printer’s reported address and the saved print queue. We have requested onsite confirmation and will verify the correct configuration before proposing a change. We will update you after that check.\n**Review before use. Nothing has been sent.**",
    "/escalate":`## Sample handoff\n**Ticket:** ${ticket.id} · ${ticket.company}\n**Issue:** ${ticket.title}\n**Status:** ${ticket.status}\n## Evidence and work recorded\n${closed?"Customer-approved client reauthentication restored connectivity; customer verified the result.":"Queue target: 192.0.2.34. Onsite test page: 192.0.2.81. No changes made; onsite verification requested."}\n## Outstanding question\n${closed?"If symptoms return, collect the new symptom and approved client logs through the normal process.":"Can the network owner confirm device identity and the approved reservation history?"}\n**Prepared locally, not submitted.**`,
    "/5whys":closed?"## A cautious 5 Whys\n- 1. Why was support requested? Repeated VPN prompts after a password change: recorded.\n- 2. Why did reauthentication help? A stale client session is plausible, not proven.\n- 3. Why was the session stale? Not established in the notes.\n- 4. Why was renewal not automatic? Not established in the notes.\n- 5. Why did that behavior occur? Requires approved client diagnostics.\n**A confirmed fix is not a confirmed root cause.**":"## A cautious 5 Whys\n- 1. Why was support requested? The printer was reported offline: recorded.\n- 2. Why might the queue fail? Its target differs from the test-page address: recorded mismatch.\n- 3. Why do those addresses differ? A changed assignment is a hypothesis, not confirmed.\n- 4. Why might the assignment have changed? Reservation history is still unknown.\n- 5. Why was the change not anticipated? Process history is still unknown.\n**Stop where the evidence stops.** Validate with the onsite and network owners."
  };
  if(command==="/similar"){const matches=similarTickets(ticket);return{command,matched,title:"What worked in sample history",markdown:`## Similar fictional tickets\nCompany matches use a 90-day window; global matches use 14 days. Sample clock: 12 Nov 2026. A similar issue does not establish this ticket’s cause.\n${matches.map(p=>`- **${p.id} · ${p.title}** — ${p.resolution}`).join("\n")}`,sources,matches};}
  if(!bodies[command])return{command:null,matched:false,title:"This demo uses local matching, not AI",markdown:"Try **/summary**, **/suggest**, **/next**, **/similar**, **/config**, **/draft**, **/escalate**, or **/5whys**. Free-text keywords select one of those fixed sample responses. Other questions stay unanswered; no external model is connected.",sources:[]};
  return{command,matched,title:commands.find(c=>c.name===command).label,markdown:bodies[command],sources};
}
